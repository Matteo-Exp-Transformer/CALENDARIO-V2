/**
 * E2E smoke Pagina Prenota — gap manuali testabili senza giudizio visivo.
 *
 * @prenota-blindatura:e2e
 * Copre:
 * - slug inesistente → pagina non disponibile;
 * - submit invalido → primo campo con alert visivo;
 * - link Privacy → ritorno a /prenota/:slug;
 * - submit raggiungibile nelle viewport 375 / 834 / 1280.
 */

import { test, expect, type Page } from '@playwright/test'
import {
  getRestaurantSettingSnapshot,
  getTenantIdBySlug,
  restoreRestaurantSettingSnapshot,
  upsertRestaurantSettingValue,
} from './helpers/supabaseStaging'

const TENANT_SLUG = process.env.E2E_TENANT_SLUG || 'test'
const BOOKING_URL = `/prenota/${TENANT_SLUG}`
const MISSING_SLUG_URL = '/prenota/__slug-inesistente__'
const HAS_STAGING_CONFIG = Boolean(process.env.VITE_SUPABASE_URL && process.env.E2E_SUPABASE_SERVICE_KEY)

test.use({ viewport: { width: 1280, height: 900 } })

function visibleSubmitForViewport(page: Page) {
  const viewport = page.viewportSize()
  const isDesktop = (viewport?.width ?? 1280) >= 1256

  return isDesktop
    ? page.locator('#booking-request-form button.booking-cross-shine-btn[type="submit"]:visible')
    : page.locator('button[type="submit"][form="booking-request-form"]:visible')
}

test.describe('Pagina Prenota smoke', () => {
  test('slug inesistente mostra la pagina non disponibile', async ({ page }) => {
    await page.goto(MISSING_SLUG_URL)

    await expect(page.getByRole('heading', { name: /prenotazioni temporaneamente non disponibili/i })).toBeVisible()
    await expect(page.getByText(/il ristorante richiesto non esiste/i)).toBeVisible()
  })

  test('submit invalido attiva alert sul primo campo', async ({ page }) => {
    await page.goto(BOOKING_URL)

    await expect(page.locator('#booking-request-form')).toBeVisible({ timeout: 10000 })
    await visibleSubmitForViewport(page).click()

    const firstField = page.locator('#client_name-control')
    await expect(firstField).toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator('#client_name')).toHaveClass(/booking-public-field-attention/)
    await expect(page.getByText('Nome obbligatorio')).toBeVisible()
  })

  test('link privacy ritorna a /prenota/:slug', async ({ page }) => {
    await page.goto(BOOKING_URL)

    const privacyLink = page.getByRole('link', { name: /privacy policy/i })
    await expect(privacyLink).toHaveAttribute('href', new RegExp(`/privacy\\?from=%2Fprenota%2F${TENANT_SLUG}$`))

    const popupPromise = page.waitForEvent('popup')
    await privacyLink.click()
    const privacyPage = await popupPromise

    await expect(privacyPage).toHaveURL(new RegExp(`/privacy\\?from=%2Fprenota%2F${TENANT_SLUG}$`))
    await expect(privacyPage.getByRole('link', { name: /torna alla prenotazione/i })).toHaveAttribute(
      'href',
      new RegExp(`/prenota/${TENANT_SLUG}$`),
    )

    await privacyPage.getByRole('link', { name: /torna alla prenotazione/i }).click()
    await expect(privacyPage).toHaveURL(new RegExp(`/prenota/${TENANT_SLUG}$`))
  })

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 834, height: 1194 },
    { width: 1280, height: 800 },
  ]) {
    test(`submit raggiungibile a ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto(BOOKING_URL)

      await expect(page.locator('#booking-request-form')).toBeVisible({ timeout: 10000 })
      await expect(page.getByTestId('booking-summary-sidebar').first()).toBeVisible()

      const desktopSubmit = page.locator('#booking-request-form button.booking-cross-shine-btn[type="submit"]:visible')
      const summarySubmit = page.locator('button[type="submit"][form="booking-request-form"]:visible')

      if (viewport.width >= 1256) {
        await expect(desktopSubmit).toHaveCount(1)
        await expect(summarySubmit).toHaveCount(0)
      } else {
        await expect(summarySubmit).toHaveCount(1)
        await expect(desktopSubmit).toHaveCount(0)
      }
    })
  }
})

test.describe('Pagina Prenota visual checklist', () => {
  test.describe.configure({ mode: 'serial' })
  test.skip(!HAS_STAGING_CONFIG, 'richiede .env.local.test con staging Supabase TEST')

  async function hasFullPageBackground(page: Page, id: string): Promise<boolean> {
    return page.evaluate((backgroundId) => {
      return Array.from(document.querySelectorAll<HTMLElement>('div')).some((el) =>
        el.style.backgroundImage.includes(`${backgroundId}-landscape.webp`) ||
        el.style.backgroundImage.includes(`${backgroundId}-portrait.webp`),
      )
    }, id)
  }

  async function rootBackgroundColor(page: Page): Promise<string> {
    return page.evaluate(() => {
      const roots = Array.from(document.querySelectorAll<HTMLElement>('div'))
      const root = roots.find((el) => el.style.backgroundColor)
      return root ? getComputedStyle(root).backgroundColor : ''
    })
  }

  test('sfondo: striscia vince su foto intera, foto intera senza striscia, crema senza scelta', async ({ page }) => {
    test.setTimeout(120000)

    const tenantId = await getTenantIdBySlug(TENANT_SLUG)
    const stripSnapshot = await getRestaurantSettingSnapshot(tenantId, 'public_booking_strip_photo')
    const pageBgSnapshot = await getRestaurantSettingSnapshot(tenantId, 'public_booking_page_background')

    try {
      await upsertRestaurantSettingValue(tenantId, 'public_booking_strip_photo', 'strip-04')
      await upsertRestaurantSettingValue(tenantId, 'public_booking_page_background', 'full-02')

      await page.goto(`${BOOKING_URL}?e2e=strip`, { waitUntil: 'domcontentloaded' })
      await expect(page.locator('img[src*="asset/strip/strip-04.webp"]').first()).toBeVisible({
        timeout: 15000,
      })
      await expect.poll(() => hasFullPageBackground(page, 'full-02'), { timeout: 15000 }).toBe(false)

      await upsertRestaurantSettingValue(tenantId, 'public_booking_strip_photo', '')
      await upsertRestaurantSettingValue(tenantId, 'public_booking_page_background', 'full-02')

      await page.goto(`${BOOKING_URL}?e2e=full`, { waitUntil: 'domcontentloaded' })
      await expect(page.locator('img[src*="asset/strip/"]')).toHaveCount(0)
      await expect.poll(() => hasFullPageBackground(page, 'full-02'), { timeout: 15000 }).toBe(true)

      await upsertRestaurantSettingValue(tenantId, 'public_booking_strip_photo', '')
      await upsertRestaurantSettingValue(tenantId, 'public_booking_page_background', '')

      await page.goto(`${BOOKING_URL}?e2e=neutral`, { waitUntil: 'domcontentloaded' })
      await expect(page.locator('img[src*="asset/strip/"]')).toHaveCount(0)
      await expect.poll(() => hasFullPageBackground(page, 'full-02'), { timeout: 15000 }).toBe(false)
      await expect.poll(() => rootBackgroundColor(page), { timeout: 15000 }).toBe('rgb(250, 247, 241)')
    } finally {
      await restoreRestaurantSettingSnapshot(
        tenantId,
        'public_booking_strip_photo',
        stripSnapshot,
      ).catch(() => {})
      await restoreRestaurantSettingSnapshot(
        tenantId,
        'public_booking_page_background',
        pageBgSnapshot,
      ).catch(() => {})
    }
  })

  test('footer Orari assente quando tutti i giorni sono chiusi', async ({ page }) => {
    test.setTimeout(120000)

    const tenantId = await getTenantIdBySlug(TENANT_SLUG)
    const hoursSnapshot = await getRestaurantSettingSnapshot(tenantId, 'business_hours')
    const closedHours = {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    }

    try {
      await upsertRestaurantSettingValue(tenantId, 'business_hours', closedHours)

      await page.goto(`${BOOKING_URL}?e2e=hours-closed`, { waitUntil: 'domcontentloaded' })
      await expect(page.getByRole('heading', { name: /^Orari$/i })).not.toBeVisible({
        timeout: 15000,
      })
    } finally {
      await restoreRestaurantSettingSnapshot(tenantId, 'business_hours', hoursSnapshot).catch(() => {})
    }
  })
})
