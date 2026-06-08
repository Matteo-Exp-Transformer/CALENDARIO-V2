/**
 * Test E2E — Edition Classic: UI base senza feature Pro.
 *
 * Verifica che un tenant con edition='classic' veda solo la dashboard base:
 * nessuna sidebar, 5 tab operativi, nessuna icona walk-in, nessun bottone no-show.
 *
 * Richiede staging Supabase con:
 *   E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD → admin di un tenant classic
 *   E2E_CLASSIC_TENANT_SLUG → slug del tenant classic (es. 'test-classic')
 * Configurare in .env.local.test (vedi playwright.config.ts).
 */

import { test, expect } from '@playwright/test'
import {
  dashboardHeaderNav,
  loginAsClassicAdmin as loginClassic,
  proSidebar,
} from './helpers/adminShell'
import { openCalendarTab, openFirstCalendarBookingModal, openPendingTab } from './helpers/pendingBookings'

// SKIP: richiede staging Supabase configurato con tenant edition='classic'
test.skip(!process.env.E2E_CLASSIC_ADMIN_EMAIL, 'richiede tenant Classic (E2E_CLASSIC_ADMIN_EMAIL)')

const ADMIN_EMAIL = process.env.E2E_CLASSIC_ADMIN_EMAIL ?? ''
const ADMIN_PASSWORD = process.env.E2E_CLASSIC_ADMIN_PASSWORD ?? ''

async function loginAsClassicAdmin(page: import('@playwright/test').Page) {
  await loginClassic(page, ADMIN_EMAIL, ADMIN_PASSWORD)
}

function dashboardNav(page: import('@playwright/test').Page) {
  return dashboardHeaderNav(page)
}

test.describe('Edition Classic — UI base', () => {
  test('nessuna sidebar visibile dopo login', async ({ page }) => {
    await loginAsClassicAdmin(page)
    await expect(proSidebar(page)).not.toBeVisible()
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
    await loginAsClassicAdmin(page)
    await openPendingTab(page)
    await expect(page.getByRole('button', { name: /no.?show/i })).not.toBeVisible()

    await openCalendarTab(page)
    const calendarBooking = page
      .locator('.fc-event')
      .filter({ hasText: /E2E Test/i })
      .first()
      .or(page.locator('main').getByRole('button').filter({ hasText: /E2E Test/i }).first())
    if (await calendarBooking.isVisible({ timeout: 5000 }).catch(() => false)) {
      await openFirstCalendarBookingModal(page)
      await expect(page.getByRole('button', { name: /no.?show/i })).not.toBeVisible()
    }
  })
})
