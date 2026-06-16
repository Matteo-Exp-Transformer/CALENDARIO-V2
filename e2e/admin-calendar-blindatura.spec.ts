/**
 * @admin-blindatura: calendario-e2e
 * Copre: badge riempimento mese, digest con accettate/no-show/pending, e scorciatoia
 * "+ Nuova prenotazione" con data pre-selezionata.
 *
 * Pre-requisiti staging (.env.local.test):
 *   E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_TENANT_SLUG, E2E_SUPABASE_SERVICE_KEY
 */
import { expect, test, type Page } from '@playwright/test'
import {
  deleteBookingsByPrefix,
  getRestaurantSettingSnapshot,
  getTenantIdBySlug,
  insertBooking,
  isoStartEnd,
  offsetIsoDate,
  patchBookingById,
  restoreRestaurantSettingSnapshot,
  upsertRestaurantSettingValue,
} from './helpers/supabaseStaging'

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? process.env.E2E_CLASSIC_ADMIN_EMAIL ?? ''
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? process.env.E2E_CLASSIC_ADMIN_PASSWORD ?? ''
const TENANT_SLUG = process.env.E2E_TENANT_SLUG ?? ''
const SERVICE_KEY = process.env.E2E_SUPABASE_SERVICE_KEY ?? ''

const hasE2eCreds = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD && TENANT_SLUG && SERVICE_KEY)

const CALENDAR_PREFIX = 'E2E-CAL-'

test.use({ viewport: { width: 1280, height: 800 } })

async function loginClassicAdmin(page: Page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.fill('#email', ADMIN_EMAIL)
  await page.fill('#password', ADMIN_PASSWORD)
  await page.locator('button[type="submit"]').click()
  await expect(page).toHaveURL(/\/admin/, { timeout: 15000 })
}

async function goToCalendar(page: Page) {
  await page.goto('/admin/calendario', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/admin\/calendario/)
  await expect(page.getByRole('heading', { name: /Calendario Prenotazioni/i })).toBeVisible({
    timeout: 15000,
  })
}

function dayCell(page: Page, date: string) {
  return page.locator(`.fc-daygrid-day[data-date="${date}"]`).first()
}

function dayNumber(page: Page, date: string) {
  return dayCell(page, date).locator('.fc-daygrid-day-number').first()
}

function formatDayMonth(date: string): string {
  return new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: '2-digit' }).format(new Date(date))
}

test.describe('Admin Calendario - smoke', () => {
  test.describe.configure({ mode: 'serial' })
  test.skip(!hasE2eCreds, 'richiede credenziali staging in .env.local.test')

  let tenantId = ''
  let dailyGuestLimitSnapshot = { exists: false, value: null as unknown }

  test.beforeAll(async () => {
    tenantId = await getTenantIdBySlug(TENANT_SLUG)
    dailyGuestLimitSnapshot = await getRestaurantSettingSnapshot(tenantId, 'daily_guest_limit')
    await deleteBookingsByPrefix(tenantId, CALENDAR_PREFIX)
  })

  test.afterAll(async () => {
    if (!tenantId) return
    await deleteBookingsByPrefix(tenantId, CALENDAR_PREFIX).catch(() => {})
    await restoreRestaurantSettingSnapshot(
      tenantId,
      'daily_guest_limit',
      dailyGuestLimitSnapshot,
    ).catch(() => {})
  })

  test.beforeEach(async ({ page }) => {
    await loginClassicAdmin(page)
  })

  // @admin-blindatura: calendario-e2e
  // Copre: mese con badge %/coperti, digest giornaliero, assenza pending/no-show e apertura
  // "Nuova prenotazione" con data pre-selezionata.
  test('badge mese, digest e nuova prenotazione con data selezionata', async ({ page }) => {
    const digestDate = offsetIsoDate(1)
    const formDate = offsetIsoDate(2)
    const badgeName = `${CALENDAR_PREFIX}Badge`
    const pendingName = `${CALENDAR_PREFIX}Pending`
    const noShowName = `${CALENDAR_PREFIX}NoShow`

    await upsertRestaurantSettingValue(tenantId, 'daily_guest_limit', 1)

    const { start, end } = isoStartEnd(digestDate, '20:00')
    await insertBooking({
      tenantId,
      clientName: badgeName,
      status: 'accepted',
      desiredDate: digestDate,
      desiredTime: '20:00',
      numGuests: 3,
      confirmedStart: start,
      confirmedEnd: end,
    })

    await insertBooking({
      tenantId,
      clientName: pendingName,
      status: 'pending',
      desiredDate: digestDate,
      desiredTime: '20:00',
      numGuests: 2,
    })

    const noShowId = await insertBooking({
      tenantId,
      clientName: noShowName,
      status: 'accepted',
      desiredDate: digestDate,
      desiredTime: '21:00',
      numGuests: 2,
      confirmedStart: isoStartEnd(digestDate, '21:00').start,
      confirmedEnd: isoStartEnd(digestDate, '21:00').end,
    })
    await patchBookingById(noShowId, { no_show: true })

    await goToCalendar(page)

    const digestCell = dayCell(page, digestDate)
    await expect(digestCell).toBeVisible({ timeout: 15000 })
    await expect(digestCell.locator('.booking-day-fill')).toBeVisible({ timeout: 15000 })
    await expect(digestCell.locator('.booking-day-fill')).toContainText('%', { timeout: 15000 })

    await dayNumber(page, digestDate).click()
    await expect(page.getByRole('button', { name: new RegExp(`Nuova prenotazione il ${formatDayMonth(digestDate)}`, 'i') })).toBeVisible()

    const digestSection = page.locator('section[aria-labelledby="digest-table-only-heading"]')
    await expect(digestSection).toContainText(badgeName)
    await expect(page.locator('body')).not.toContainText(pendingName)
    await expect(page.locator('body')).not.toContainText(noShowName)

    await dayNumber(page, formDate).click()
    const createButton = page.getByRole('button', {
      name: new RegExp(`Nuova prenotazione il ${formatDayMonth(formDate)}`, 'i'),
    })
    await expect(createButton).toBeVisible({ timeout: 10000 })
    await createButton.click()

    const dialog = page.getByRole('dialog').filter({ hasText: /Nuova prenotazione/i })
    await expect(dialog).toBeVisible({ timeout: 10000 })
    await expect(dialog.locator('#desired_date-control')).toHaveValue(formDate)
  })
})
