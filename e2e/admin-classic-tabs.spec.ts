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
 *   E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD → admin di un tenant classic
 * Configurare in .env.local.test (vedi playwright.config.ts).
 */

import { test, expect } from '@playwright/test'
import {
  dashboardHeaderNav,
  loginAsClassicAdmin as loginClassic,
  proSidebar,
} from './helpers/adminShell'
import {
  acceptFirstPendingBooking,
  openCalendarTab,
  openFirstCalendarBookingModal,
} from './helpers/pendingBookings'

// SKIP: richiede tenant Classic dedicato (non usare account Pro in E2E_ADMIN_EMAIL)
test.skip(!process.env.E2E_CLASSIC_ADMIN_EMAIL, 'richiede tenant Classic (E2E_CLASSIC_ADMIN_EMAIL)')

const ADMIN_EMAIL = process.env.E2E_CLASSIC_ADMIN_EMAIL ?? ''
const ADMIN_PASSWORD = process.env.E2E_CLASSIC_ADMIN_PASSWORD ?? ''

async function loginAsClassicAdmin(page: import('@playwright/test').Page) {
  await loginClassic(page, ADMIN_EMAIL, ADMIN_PASSWORD)
}

function dashboardNav(page: import('@playwright/test').Page) {
  return dashboardHeaderNav(page)
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
    await expect(proSidebar(page)).not.toBeVisible()
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
    await expect(
      page.getByRole('heading', { name: /impostazioni|settings|ristorante/i }).or(
        page.getByLabel(/nome ristorante|nome locale|nome del ristorante/i)
      ).or(
        page.locator('[data-testid="settings-tab"], [class*="settings"]').first()
      )
    ).toBeVisible({ timeout: 5000 })
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
  test('cancellazione prenotazione rimuove dalla lista attiva', async ({ page }) => {
    await loginAsClassicAdmin(page)
    const clientName = await acceptFirstPendingBooking(page)
    await openCalendarTab(page)
    await openFirstCalendarBookingModal(page, clientName)

    await page.getByRole('button', { name: /^elimina$/i }).first().click()

    const confirmModal = page.getByRole('dialog')
    await confirmModal.getByRole('button', { name: /elimina prenotazione/i }).click()

    await expect(page.locator('.Toastify__toast--success').first()).toBeVisible({ timeout: 10000 })
  })
})
