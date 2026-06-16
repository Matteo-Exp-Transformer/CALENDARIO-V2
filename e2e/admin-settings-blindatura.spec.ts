/**
 * @admin-blindatura: settings-e2e
 * Copre: Anagrafica Azienda / Personalizza Form, footer salvataggio, guard dirty tema e
 * reachability responsive 375/900/1256.
 *
 * Pre-requisiti staging (.env.local.test):
 *   E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_TENANT_SLUG, E2E_SUPABASE_SERVICE_KEY
 */
import { expect, test, type Page } from '@playwright/test'

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? process.env.E2E_CLASSIC_ADMIN_EMAIL ?? ''
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? process.env.E2E_CLASSIC_ADMIN_PASSWORD ?? ''
const hasE2eCreds = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD)

const SMALL_VIEWPORTS = [
  { label: 'mobile-375', tag: '@viewport:mobile-375', width: 375, height: 812 },
  { label: 'tablet-900', tag: '@viewport:tablet-900', width: 900, height: 1194 },
] as const

async function loginClassicAdmin(page: Page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.fill('#email', ADMIN_EMAIL)
  await page.fill('#password', ADMIN_PASSWORD)
  await page.locator('button[type="submit"]').click()
  await expect(page).toHaveURL(/\/admin/, { timeout: 15000 })
}

async function goToSettings(page: Page) {
  await page.goto('/admin/impostazioni', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/admin\/impostazioni/)
  await expect(page.getByRole('heading', { name: /Impostazioni locale/i })).toBeVisible({
    timeout: 15000,
  })
}

function saveFooter(page: Page) {
  return page.getByRole('region', { name: /Modifiche non salvate/i })
}

async function expectButtonReachable(page: Page, name: RegExp) {
  const button = page.getByRole('button', { name })
  const box = await button.boundingBox()
  expect(box, `bounding box per ${name}`).not.toBeNull()
  const viewport = page.viewportSize()
  expect(viewport).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.y).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width + 1)
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height + 1)
}

test.describe('Admin Impostazioni - smoke desktop', () => {
  test.skip(!hasE2eCreds, 'richiede credenziali staging in .env.local.test')

  // @admin-blindatura: settings-e2e
  // Copre: pill Anagrafica/Personalizza Form, nome vuoto che blocca il persist con scroll/pulse e footer visibile.
  test('pill visibili e nome vuoto scrolla al primo errore senza modale pubblica', async ({ page }) => {
    await page.setViewportSize({ width: 1256, height: 800 })
    await loginClassicAdmin(page)
    await goToSettings(page)

    await expect(page.getByRole('button', { name: /Anagrafica Azienda/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Personalizza Form/i })).toBeVisible()

    const themeSection = page.locator('section[aria-labelledby="app-theme-heading"]')
    await themeSection.scrollIntoViewIfNeeded()
    await themeSection.getByRole('button', { name: /Seleziona tema: Terracotta & Sand/i }).click()

    const nameField = page.locator('#restaurant_name')
    await expect(nameField).toBeVisible()
    await nameField.fill('')

    const footer = saveFooter(page)
    await expect(footer).toBeVisible()
    const saveButton = footer.getByRole('button', { name: /Salva modifiche/i })
    await expect(saveButton).toBeEnabled()
    await saveButton.click()

    await expect(page.getByRole('dialog', { name: /Salva modifiche pubbliche/i })).toHaveCount(0)
    await expect(page.locator('#settings-error-restaurant-name')).toHaveClass(
      /booking-public-field-attention/,
    )
    await expect(nameField).toBeInViewport()
  })
})

for (const viewport of SMALL_VIEWPORTS) {
  test.describe(`Admin Impostazioni - smoke responsive ${viewport.label} ${viewport.tag}`, () => {
    test.skip(!hasE2eCreds, 'richiede credenziali staging in .env.local.test')

    // @admin-blindatura: settings-e2e
    // Copre: footer salvataggio raggiungibile, tema dirty e guard modale.
    test('tema dirty e guard navigazione', async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await loginClassicAdmin(page)
      await goToSettings(page)

      const themeSection = page.locator('section[aria-labelledby="app-theme-heading"]')
      await themeSection.scrollIntoViewIfNeeded()
      await themeSection.getByRole('button', { name: /Seleziona tema: Terracotta & Sand/i }).click()

      const footer = saveFooter(page)
      await expect(footer).toBeVisible()
      await expectButtonReachable(page, /Annulla tutte/i)
      await expectButtonReachable(page, /Salva modifiche/i)

      await page.getByRole('button', { name: /Personalizza Form/i }).click()
      const guard = page.getByRole('dialog').filter({ hasText: /Modifiche non salvate/i })
      await expect(guard).toBeVisible({ timeout: 10000 })
      await guard.getByRole('button', { name: /Resta qui/i }).click()
    })
  })
}
