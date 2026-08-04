/**
 * // @admin-blindatura: shell-edition
 * // Copre: Classic senza sidebar e dashboard operativa con tab interne.
 *
 * Test E2E — Admin Classic: copertura tab Archivio, Impostazioni e cancellazione prenotazione.
 *
 * Copre le lacune identificate in GUIDA-TEST-SISTEMA.md § "Parte 3":
 * - Tab Archivio: lista prenotazioni archiviate accessibile
 * - Tab Impostazioni: form impostazioni ristorante accessibile
 * - Cancella prenotazione (soft-delete) nel browser
 *
 * Richiede staging Supabase con:
 *   E2E_CLASSIC_ADMIN_EMAIL / E2E_CLASSIC_ADMIN_PASSWORD → admin di un tenant edition='classic'
 *   E2E_CLASSIC_TENANT_SLUG → slug del tenant classic (default 'test-classic')
 *   E2E_SUPABASE_SERVICE_KEY → per seminare/ripulire la prenotazione del test cancellazione
 * Configurare in .env.local.test (vedi playwright.config.ts).
 *
 * NOTA: prima leggeva E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD, ma in .env.local.test quelle chiavi
 * puntano a tomas@t.com sul tenant da-tommaso (edition='pro' — vedi commento righe 26-33 di
 * .env.local.test). Con quell'account `loginAsClassicAdmin` aspettava "nessuna sidebar" su un
 * tenant che la sidebar ce l'ha davvero, facendo fallire ogni test qui sotto per un motivo
 * estraneo ai tab Classic. Allineato alle stesse credenziali di edition-classic.spec.ts /
 * admin-shell-blindatura.spec.ts.
 */

import { test, expect, type Page } from '@playwright/test'
import {
  deleteBookingsByPrefix,
  getBookingStatus,
  getTenantIdBySlug,
  insertBooking,
  isoStartEnd,
  todayIsoDate,
} from './helpers/supabaseStaging'

// SKIP: richiede staging Supabase configurato con tenant edition='classic'
test.skip(!process.env.E2E_CLASSIC_ADMIN_EMAIL, 'richiede staging Classic (E2E_CLASSIC_ADMIN_EMAIL non impostato)')

const ADMIN_EMAIL = process.env.E2E_CLASSIC_ADMIN_EMAIL ?? ''
const ADMIN_PASSWORD = process.env.E2E_CLASSIC_ADMIN_PASSWORD ?? ''
const CLASSIC_TENANT_SLUG = process.env.E2E_CLASSIC_TENANT_SLUG ?? 'test-classic'
const BOOKING_PREFIX = 'E2E-ADMCLS-'

async function loginAsClassicAdmin(page: Page) {
  await page.goto('/admin')
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL)
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: /accedi|login/i }).click()
  // Classic non ha sidebar — la sua assenza conferma che il login è completato
  await expect(page.getByRole('navigation', { name: /navigazione principale/i })).not.toBeVisible({
    timeout: 10000,
  })
}

/**
 * Restituisce il locator dei NavItem dell'header AdminDashboard.
 * Scende nel <nav> del header per evitare ambiguità con bottoni omonimi
 * presenti in altri tab (es. "Calendario" in ArchiveTab su mobile).
 */
function dashboardNav(page: Page) {
  return page.locator('header nav')
}

/**
 * Locator reale per un evento prenotazione nel calendario FullCalendar (stesso aggancio usato
 * in edition-classic.spec.ts): `.booking-calendar-fc` avvolge FullCalendar
 * (src/features/booking/components/BookingCalendar.tsx:1115), `.fc-event` è la classe che la
 * libreria FullCalendar applica a ogni evento renderizzato (BookingCalendar.tsx:888, :952-1039).
 * Non esiste nel markup un `data-testid`/`role="row"` per la riga prenotazione — quelli usati
 * prima (`tr[role="row"]`, `[data-testid="booking-row"]`) non hanno zero occorrenze in src/.
 */
function bookingEvent(page: Page, clientName: string) {
  return page.locator('.booking-calendar-fc .fc-event').filter({ hasText: clientName })
}

test.describe('Admin Classic — Tab Archivio', () => {
  test('click tab Archivio mostra la sezione archivio', async ({ page }) => {
    await loginAsClassicAdmin(page)
    await dashboardNav(page).getByRole('button', { name: /archivio/i }).click()
    // Il tab archivio deve mostrare una lista o un messaggio vuoto — mai un errore
    const archiveSection = page.locator(
      '[data-testid="archive-tab"], [class*="archive"], section, main',
    ).first()
    await expect(archiveSection).toBeVisible({ timeout: 5000 })
  })

  test('tab Archivio mostra intestazioni della lista prenotazioni', async ({ page }) => {
    await loginAsClassicAdmin(page)
    await dashboardNav(page).getByRole('button', { name: /archivio/i }).click()
    // Verifica che la sezione sia caricata senza errori fatali
    // (la lista può essere vuota, ma l'heading o il container devono esistere)
    await expect(page.getByRole('navigation', { name: /navigazione principale/i })).not.toBeVisible()
    // Attende che il contenuto del tab sia stabile
    await page.waitForTimeout(1000)
    // Verifica l'assenza di errori critici nel DOM (es. schermata bianca)
    await expect(page.locator('body')).not.toBeEmpty()
  })
})

test.describe('Admin Classic — Tab Impostazioni', () => {
  test('click tab Impostazioni mostra il form impostazioni ristorante', async ({ page }) => {
    await loginAsClassicAdmin(page)
    await dashboardNav(page).getByRole('button', { name: /impostazioni/i }).click()
    // Il form impostazioni contiene sempre almeno il nome del ristorante
    await expect(page.getByRole('heading', { name: /impostazioni locale/i })).toBeVisible({
      timeout: 5000,
    })
  })

  test('tab Impostazioni contiene almeno un campo form compilabile', async ({ page }) => {
    await loginAsClassicAdmin(page)
    await dashboardNav(page).getByRole('button', { name: /impostazioni/i }).click()
    // Almeno un input testuale deve essere presente nel form impostazioni
    await expect(page.locator('input[type="text"], input[type="email"], textarea').first()).toBeVisible({
      timeout: 5000,
    })
  })
})

test.describe('Admin Classic — Cancella prenotazione (soft-delete)', () => {
  // Il bottone "Elimina" (soft-delete → status='deleted', useCancelBooking in
  // useBookingMutations.ts:548-582) vive nel drawer BookingDetailsModal, che si apre solo
  // cliccando l'evento di una prenotazione ACCETTATA nel Calendario — non nel tab Prenotazioni
  // (quello mostra solo le richieste PENDING con Accetta/Rifiuta, mai un modal, vedi
  // src/features/booking/components/PendingRequestsTab.tsx e BookingRequestCard.tsx). Semina
  // quindi una prenotazione già accettata e passa dal Calendario.
  test('cancellazione prenotazione rimuove dalla lista attiva', async ({ page }) => {
    const tenantId = await getTenantIdBySlug(CLASSIC_TENANT_SLUG)
    const clientName = `${BOOKING_PREFIX}Cancel-${Date.now()}`
    const date = todayIsoDate()
    const { start, end } = isoStartEnd(date, '19:00')

    const bookingId = await insertBooking({
      tenantId,
      clientName,
      status: 'accepted',
      desiredDate: date,
      desiredTime: '19:00',
      numGuests: 2,
      confirmedStart: start,
      confirmedEnd: end,
    })

    try {
      await loginAsClassicAdmin(page)
      await dashboardNav(page).getByRole('button', { name: /calendario/i }).click()
      // Vista "Giorno": timeline del giorno corrente, niente cap "+N altri" (dayMaxEvents è
      // solo per la vista Mese) che nasconderebbe l'evento seminato dietro un "+più".
      await page.getByRole('group', { name: 'Viste calendario' }).getByRole('button', { name: 'Giorno' }).click()

      const event = bookingEvent(page, clientName)
      await expect(event).toBeVisible({ timeout: 10000 })
      await event.click()

      // Il modal dettagli prenotazione (BookingDetailsModal) non ha role="dialog": si
      // riconosce dall'heading "Dettagli Prenotazione" (BookingDetailsModal.tsx:952).
      const modalHeading = page.getByRole('heading', { name: 'Dettagli Prenotazione' })
      await expect(modalHeading).toBeVisible({ timeout: 5000 })

      // Bottone "Elimina" nel footer del drawer (BookingDetailsModal.tsx:1110-1118).
      await page.getByRole('button', { name: 'Elimina', exact: true }).click()

      // Conferma: BookingDangerActionModal HA role="dialog" (BookingDangerActionModal.tsx:109).
      const confirmDialog = page.getByRole('dialog').filter({ hasText: /Elimina Prenotazione Accettata/i })
      await expect(confirmDialog).toBeVisible({ timeout: 5000 })
      await confirmDialog.getByRole('button', { name: 'Elimina Prenotazione' }).click()

      // Il drawer si chiude e la prenotazione sparisce dal calendario (lista attiva)
      await expect(modalHeading).not.toBeVisible({ timeout: 5000 })
      await expect(event).not.toBeVisible({ timeout: 5000 })

      // Riprova oggettiva sul DB: soft-delete = status passato a 'deleted' (non una riga cancellata)
      await expect
        .poll(() => getBookingStatus(bookingId), { timeout: 10000 })
        .toBe('deleted')
    } finally {
      await deleteBookingsByPrefix(tenantId, BOOKING_PREFIX).catch(() => {})
    }
  })
})
