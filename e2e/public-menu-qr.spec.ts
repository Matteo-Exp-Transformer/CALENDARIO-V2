/**
 * @menu-qr-blindatura: public-menu-qr
 * Copre: homepage QR cliente, apertura categoria, browser back, shortCode mancante
 * e route /menu/:slug senza shortCode.
 */
import { test, expect } from '@playwright/test'
import {
  deleteMenuE2eData,
  getTenantIdBySlug,
  upsertMenuCategory,
  upsertMenuItem,
  upsertMenuQrCode,
} from './helpers/supabaseStaging'

const TENANT_SLUG = process.env.E2E_TENANT_SLUG ?? 'trattoria-da-tommaso'
const HAS_STAGING_CONFIG = Boolean(process.env.VITE_SUPABASE_URL && process.env.E2E_SUPABASE_SERVICE_KEY)

test.skip(!HAS_STAGING_CONFIG, 'richiede .env.local.test con staging Supabase TEST')

test.describe('Menu QR pubblico — flusso cliente', () => {
  test('homepage, categoria, back, shortCode assente e fallback /menu/:slug', async ({ page }) => {
    test.setTimeout(120000)

    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return
      const text = msg.text()
      if (/Failed to load resource|favicon/i.test(text)) return
      errors.push(text)
    })

    const tenantId = await getTenantIdBySlug(TENANT_SLUG)
    const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 8)
    const categoryKey = `e2e_qr_${suffix}`
    const categoryLabel = `E2E QR ${suffix}`
    const itemName = `Piatto E2E ${suffix}`
    const shortCode = `e2eqr${suffix}`
    const fakeShortCode = `missing${suffix}`

    const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    try {
      await deleteMenuE2eData(tenantId, categoryKey, shortCode)

      await upsertMenuCategory({
        tenantId,
        key: categoryKey,
        label: categoryLabel,
        isAvailable: true,
      })
      await upsertMenuItem({
        tenantId,
        categoryKey,
        name: itemName,
        isAvailable: true,
      })
      await upsertMenuQrCode({
        tenantId,
        shortCode,
        name: `QR E2E ${suffix}`,
        categoryFilter: [categoryKey],
      })

      await page.goto(`/menu/${TENANT_SLUG}/qr/${shortCode}`, {
        waitUntil: 'domcontentloaded',
      })

      const categoryLink = page
        .getByRole('link', { name: new RegExp(escapeRegExp(categoryLabel), 'i') })
        .first()
      await expect(categoryLink).toBeVisible({ timeout: 15000 })
      await categoryLink.click()

      await expect(page).toHaveURL(
        new RegExp(`/menu/${TENANT_SLUG}/qr/${shortCode}/c/${categoryKey}$`),
      )
      await expect(page.getByText(itemName, { exact: true })).toBeVisible({ timeout: 15000 })

      await page.goBack({ waitUntil: 'domcontentloaded' })
      await expect(page).toHaveURL(new RegExp(`/menu/${TENANT_SLUG}/qr/${shortCode}$`))
      await expect(categoryLink).toBeVisible({ timeout: 15000 })

      await page.goto(`/menu/${TENANT_SLUG}/qr/${fakeShortCode}`, {
        waitUntil: 'domcontentloaded',
      })
      await expect(page).toHaveURL(new RegExp(`/menu/${TENANT_SLUG}/qr/${fakeShortCode}$`))
      await expect(page.getByText('Menù QR non trovato')).toBeVisible({ timeout: 15000 })

      await page.goto(`/menu/${TENANT_SLUG}`, { waitUntil: 'domcontentloaded' })
      await expect(page).toHaveURL(new RegExp(`/menu/${TENANT_SLUG}$`))
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 })
      await expect(page.getByText('Menù QR non trovato')).not.toBeVisible()

      expect(errors, 'errori console/browser').toEqual([])
    } finally {
      await deleteMenuE2eData(tenantId, categoryKey, shortCode).catch(() => {})
    }
  })
})
