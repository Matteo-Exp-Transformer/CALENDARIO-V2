/**
 * Test E2E — Edition Classic: UI base senza feature Pro.
 *
 * Verifica che un tenant con edition='classic' veda solo la dashboard base:
 * nessuna sidebar, 5 tab operativi, nessuna icona walk-in, nessun bottone no-show.
 *
 * Richiede staging Supabase con:
 *   E2E_CLASSIC_ADMIN_EMAIL / E2E_CLASSIC_ADMIN_PASSWORD → admin di un tenant classic
 *   E2E_CLASSIC_TENANT_SLUG → slug del tenant classic (es. 'test-classic')
 * Configurare in .env.local.test (vedi playwright.config.ts).
 */

import { test, expect } from '@playwright/test'
import { deleteBookingsByPrefix, getTenantIdBySlug, insertBooking, isoStartEnd, todayIsoDate } from './helpers/supabaseStaging'

// SKIP: richiede staging Supabase configurato con tenant edition='classic'
test.skip(
  !process.env.E2E_CLASSIC_ADMIN_EMAIL,
  'richiede staging Classic esplicito (E2E_CLASSIC_ADMIN_EMAIL non impostato)',
)

const ADMIN_EMAIL = process.env.E2E_CLASSIC_ADMIN_EMAIL ?? ''
const ADMIN_PASSWORD = process.env.E2E_CLASSIC_ADMIN_PASSWORD ?? ''
const CLASSIC_TENANT_SLUG = process.env.E2E_CLASSIC_TENANT_SLUG ?? 'test-classic'
const BOOKING_PREFIX = 'E2E-EDCLS-'

async function loginAsClassicAdmin(page: import('@playwright/test').Page) {
  await page.goto('/admin')
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL)
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: /accedi|login/i }).click()
  // Fallimento reale (non skip): credenziali Classic presenti in .env.local.test ma il login
  // non ha portato su /admin — l'errore Playwright mostra URL atteso vs reale.
  await expect(
    page,
    'Login Classic fallito: E2E_CLASSIC_ADMIN_EMAIL/PASSWORD sono impostati ma non hanno autenticato su questo staging (verifica credenziali o stato account su docnnernvp)',
  ).toHaveURL(/\/admin/, { timeout: 10000 })
  // Attende che la dashboard sia visibile (Classic: sidebar assente)
  await expect(page.getByRole('complementary', { name: /navigazione principale/i })).not.toBeVisible({
    timeout: 10000,
  })
}

/**
 * Locator reale per un evento prenotazione nel calendario FullCalendar.
 * `.booking-calendar-fc` avvolge FullCalendar (src/features/booking/components/BookingCalendar.tsx:1115);
 * `.fc-event` è la classe che la libreria FullCalendar applica a ogni evento renderizzato
 * (eventContent/eventClick sono configurati a BookingCalendar.tsx:952-1039 e :888). Non esiste
 * nel codice un data-testid dedicato alla riga prenotazione: questo è l'aggancio stabile reale.
 */
function bookingEvent(page: import('@playwright/test').Page, clientName: string) {
  return page.locator('.booking-calendar-fc .fc-event').filter({ hasText: clientName })
}

/**
 * Restituisce il locator dei NavItem dell'header AdminDashboard.
 * Scende nel <nav> del header per evitare ambiguità con bottoni omonimi
 * presenti in altri tab (es. "Calendario" in ArchiveTab su mobile).
 */
function dashboardNav(page: import('@playwright/test').Page) {
  return page.locator('header nav')
}

test.describe('Edition Classic — UI base', () => {
  test('nessuna sidebar visibile dopo login', async ({ page }) => {
    await loginAsClassicAdmin(page)
    await expect(page.getByRole('complementary', { name: /navigazione principale/i })).not.toBeVisible()
  })

  test('5 tab operativi visibili (Calendario, Prenotazioni, Archivio, Menu, Impostazioni)', async ({
    page,
  }) => {
    await loginAsClassicAdmin(page)
    const nav = dashboardNav(page)
    await expect(nav.getByRole('button', { name: /calendario/i })).toBeVisible()
    await expect(nav.getByRole('button', { name: /prenotazioni/i })).toBeVisible()
    await expect(nav.getByRole('button', { name: /archivio/i })).toBeVisible()
    await expect(nav.getByRole('button', { name: /menu/i })).toBeVisible()
    await expect(nav.getByRole('button', { name: /impostazioni/i })).toBeVisible()
  })

  test('click Calendario mostra la vista calendario', async ({ page }) => {
    await loginAsClassicAdmin(page)
    await dashboardNav(page).getByRole('button', { name: /calendario/i }).click()
    // Il calendario è visibile (cerca il contenitore del BookingCalendar)
    await expect(page.locator('[data-testid="booking-calendar"], .booking-calendar, [class*="calendar"]').first()).toBeVisible({ timeout: 5000 })
  })

  test('nessuna icona walk-in nel calendario', async ({ page }) => {
    await loginAsClassicAdmin(page)
    await dashboardNav(page).getByRole('button', { name: /calendario/i }).click()
    // L'icona walk-in (gated da features.walkIn) non deve apparire
    await expect(page.locator('[aria-label*="walk"i], [title*="walk"i]')).not.toBeVisible()
  })

  test('nessun bottone no-show nel modal dettagli prenotazione', async ({ page }) => {
    const tenantId = await getTenantIdBySlug(CLASSIC_TENANT_SLUG)
    const clientName = `${BOOKING_PREFIX}NoShow-${Date.now()}`
    const date = todayIsoDate()
    const { start, end } = isoStartEnd(date, '20:00')

    await insertBooking({
      tenantId,
      clientName,
      status: 'accepted',
      desiredDate: date,
      desiredTime: '20:00',
      numGuests: 2,
      confirmedStart: start,
      confirmedEnd: end,
    })

    try {
      await loginAsClassicAdmin(page)
      await dashboardNav(page).getByRole('button', { name: /calendario/i }).click()
      // Vista "Giorno": mostra la timeline del giorno corrente senza il cap "+N altri"
      // della vista Mese (dayMaxEvents), che nasconderebbe l'evento dietro un "+più".
      await page.getByRole('group', { name: 'Viste calendario' }).getByRole('button', { name: 'Giorno' }).click()

      const event = bookingEvent(page, clientName)
      await expect(event).toBeVisible({ timeout: 10000 })
      await event.click()

      await expect(page.getByRole('heading', { name: 'Dettagli Prenotazione' })).toBeVisible({ timeout: 5000 })
      // Il bottone no-show (gated da features.noShow, vuoto per Classic — src/config/features.ts:39) non deve apparire
      await expect(page.getByRole('button', { name: /no.?show/i })).not.toBeVisible()
    } finally {
      await deleteBookingsByPrefix(tenantId, BOOKING_PREFIX).catch(() => {})
    }
  })
})
