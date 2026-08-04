/**
 * @admin-blindatura: menu-magazzino
 * Copre: toggle disponibilità magazzino in browser (Admin), propagazione Menu QR,
 * restore finale is_available e QA responsive 375/834/1280.
 *
 * Pre-requisiti staging (.env.local.test):
 *   E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_TENANT_SLUG, E2E_SUPABASE_SERVICE_KEY
 */
import { test, expect, type Locator, type Page } from '@playwright/test'
import {
  E2E_MENU_PREFIX,
  deleteMenuE2eData,
  getMenuCategoryAvailability,
  getMenuItemAvailability,
  getRestaurantSettingSnapshot,
  getTenantIdBySlug,
  restoreRestaurantSettingSnapshot,
  setMenuCategoryAvailability,
  setMenuItemAvailability,
  upsertMenuCategory,
  upsertMenuItem,
  upsertMenuQrCode,
  upsertRestaurantSettingValue,
  type RestaurantSettingSnapshot,
} from './helpers/supabaseStaging'

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? ''
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? ''
const TENANT_SLUG = process.env.E2E_TENANT_SLUG ?? ''
const SERVICE_KEY = process.env.E2E_SUPABASE_SERVICE_KEY ?? ''

const hasE2eCreds = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD && TENANT_SLUG && SERVICE_KEY)

const VIEWPORTS = [
  { label: 'desktop-1280', tag: '', width: 1280, height: 800 },
  { label: 'mobile-375', tag: '@viewport:mobile-375', width: 375, height: 812 },
  { label: 'tablet-834', tag: '@viewport:tablet-834', width: 834, height: 1194 },
] as const

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function byExactText(value: string): RegExp {
  return new RegExp(`^${escapeRegExp(value)}$`, 'i')
}

function quotedIdSelector(id: string): string {
  return `[id="${id.replace(/"/g, '\\"')}"]`
}

async function loginAdmin(page: Page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL)
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: /accedi|login/i }).click()
  await expect(page).toHaveURL(/\/admin/, { timeout: 15000 })
}

async function goToAdminMenu(page: Page) {
  await page.goto('/admin/menu', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/admin\/menu/)
  await expect(page.getByRole('heading', { name: /^Menu$/i })).toBeVisible({ timeout: 15000 })
}

function categoryHeader(page: Page, categoryLabel: string): Locator {
  return page
    .locator('[role="button"][aria-expanded][aria-controls]')
    .filter({ has: page.getByRole('heading', { name: byExactText(categoryLabel) }) })
    .first()
}

async function categoryContent(page: Page, header: Locator): Promise<Locator> {
  const contentId = await header.getAttribute('aria-controls')
  expect(contentId, 'aria-controls categoria').toBeTruthy()
  return page.locator(quotedIdSelector(contentId!))
}

async function openCategory(page: Page, categoryLabel: string): Promise<Locator> {
  const header = categoryHeader(page, categoryLabel)
  await expect(header).toBeVisible({ timeout: 15000 })
  if ((await header.getAttribute('aria-expanded')) !== 'true') {
    // Si clicca il TITOLO, non l'intestazione intera: a 375px la riga è stretta e il
    // centro dell'intestazione — dove Playwright clicca — cade su uno dei bottoni
    // interni (sposta su/giù, «Nascondi in Prenota e Menu QR»). Nello snapshot di
    // errore della run del 04-08-26 quel bottone risultava infatti premuto: il test
    // non solo non apriva la categoria, le cambiava anche la visibilità sotto i piedi.
    // Il click sul titolo risale all'onClick dell'intestazione e non tocca i comandi.
    await header.getByRole('heading').click()
  }
  await expect(header).toHaveAttribute('aria-expanded', 'true')
  const content = await categoryContent(page, header)
  await expect(content).toHaveAttribute('aria-hidden', 'false')
  return content
}

function collectBrowserErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const text = msg.text()
    if (/Failed to load resource|favicon/i.test(text)) return
    errors.push(text)
  })
  return errors
}

async function expectPublicQrItemVisible(
  page: Page,
  shortCode: string,
  categoryKey: string,
  categoryLabel: string,
  itemName: string,
) {
  await page.goto(`/menu/${TENANT_SLUG}/qr/${shortCode}`, { waitUntil: 'domcontentloaded' })
  await expect(
    page.getByRole('link', { name: new RegExp(escapeRegExp(categoryLabel), 'i') }).first(),
  ).toBeVisible({ timeout: 15000 })

  await page.goto(`/menu/${TENANT_SLUG}/qr/${shortCode}/c/${categoryKey}`, {
    waitUntil: 'domcontentloaded',
  })
  await expect(page.getByText(itemName, { exact: true })).toBeVisible({ timeout: 15000 })
}

async function expectPublicQrCategoryHidden(
  page: Page,
  shortCode: string,
  categoryKey: string,
  categoryLabel: string,
) {
  await page.goto(`/menu/${TENANT_SLUG}/qr/${shortCode}`, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('link', { name: new RegExp(escapeRegExp(categoryLabel), 'i') })).not.toBeVisible({
    timeout: 10000,
  })

  await page.goto(`/menu/${TENANT_SLUG}/qr/${shortCode}/c/${categoryKey}`, {
    waitUntil: 'domcontentloaded',
  })
  await expect(page.getByText(/Questa categoria non è al momento disponibile/i)).toBeVisible({
    timeout: 15000,
  })
}

async function expectPublicQrItemHidden(
  page: Page,
  shortCode: string,
  categoryKey: string,
  itemName: string,
) {
  await page.goto(`/menu/${TENANT_SLUG}/qr/${shortCode}/c/${categoryKey}`, {
    waitUntil: 'domcontentloaded',
  })
  await expect(page.getByText(itemName, { exact: true })).not.toBeVisible({ timeout: 10000 })
  await expect(page.getByText(/Nessun piatto visibile in questa categoria/i)).toBeVisible({
    timeout: 15000,
  })
}

async function selectPublicBookingMenuMode(page: Page, presetId: string, options?: { expectGrid?: boolean }) {
  await page.goto(`/prenota/${TENANT_SLUG}`, { waitUntil: 'domcontentloaded' })
  const menuCard = page
    .locator(
      '[data-testid="booking-mode-card-rinfresco_laurea"], [data-testid="booking-mode-card-menu_prezzo_fisso"]',
    )
    .first()
  await expect(menuCard).toBeVisible({ timeout: 15000 })
  await menuCard.click()

  // Il seed monta due sotto-schede apposta (vedi `buildE2eBookingPublicFormConfig`):
  // la striscia di card esiste solo da 2 in su, ed è l'unico modo per far applicare
  // il preset collegato. Selezionarla è quindi parte dello scenario, non un dettaglio.
  const subTabCard = page.getByTestId(`booking-sub-tab-card-subtab-${presetId}`)
  await expect(subTabCard).toBeVisible({ timeout: 15000 })
  await subTabCard.click()

  if (options?.expectGrid !== false) {
    await expect(page.getByTestId('booking-menu-compose-grid')).toBeVisible({ timeout: 15000 })
  }
}

async function expectPublicBookingItemVisible(
  page: Page,
  presetId: string,
  categoryKey: string,
  categoryLabel: string,
  itemName: string,
) {
  await selectPublicBookingMenuMode(page, presetId)
  const categoryButton = page.locator(`button${quotedIdSelector(`booking-menu-cat-header-${categoryKey}`)}:visible`)
  await expect(categoryButton).toBeVisible({ timeout: 15000 })
  await expect(categoryButton).toHaveAccessibleName(new RegExp(escapeRegExp(categoryLabel), 'i'))
  if ((await categoryButton.getAttribute('aria-expanded')) !== 'true') {
    await categoryButton.click()
  }
  await expect(page.getByText(itemName, { exact: true })).toBeVisible({ timeout: 15000 })
}

async function expectPublicBookingItemHidden(page: Page, presetId: string, itemName: string) {
  await selectPublicBookingMenuMode(page, presetId, { expectGrid: false })
  await expect(page.getByText(itemName, { exact: true })).not.toBeVisible({ timeout: 10000 })
  await expect(page.getByText(/Nessun ingrediente disponibile per questa tipologia/i)).toBeVisible({
    timeout: 15000,
  })
}

function buildE2eStaffPreset(presetId: string, itemId: string, label: string) {
  return {
    id: presetId,
    name: label,
    item_ids: [itemId],
    booking_types: ['menu_prezzo_fisso'],
    description: 'Preset E2E temporaneo',
    is_fixed_menu: false,
    visible_on_booking: true,
  }
}

function buildE2eBookingPublicFormConfig(presetId: string, label: string) {
  return {
    page_title: 'Prenota QA E2E',
    page_description: 'Configurazione temporanea Playwright',
    header_styles: {},
    booking_modes: [
      {
        id: 'menu_prezzo_fisso',
        booking_type: 'menu_prezzo_fisso',
        enabled: true,
        label: 'Menu QA E2E',
        description: 'Test temporaneo Playwright',
        icon: 'bowl_food',
        sub_tabs_enabled: true,
        sub_tabs_presentation: 'cards',
        // DUE sotto-schede, non una. La striscia di card che permette di sceglierle
        // esiste solo da 2 in su (`BookingRequestForm.tsx:1300`,
        // `activeModeSubTabs.length > 1`). Con una sola, `activeSubTabId` resta `null`,
        // il preset collegato non viene mai applicato (`:459-462`) e la griglia mostra
        // il menù intero del locale invece dei soli ingredienti del preset: il test
        // cercava allora una card inesistente e restava appeso 2 minuti.
        // ⚠️ Che con UNA sola sotto-scheda «a card» il preset non venga mai applicato
        // è una domanda di prodotto aperta (per il carosello esiste l'auto-selezione,
        // `:528-533`; per le card no) — annotata per Matteo, non decisa qui.
        sub_tabs: [
          {
            id: `subtab-${presetId}`,
            display: 'cards',
            label,
            preset_id: presetId,
            is_fixed_menu: false,
          },
          {
            id: `subtab-alt-${presetId}`,
            display: 'cards',
            label: `${label} alt`.slice(0, 24),
            preset_id: presetId,
            is_fixed_menu: false,
          },
        ],
      },
    ],
  }
}

test.describe('Admin Menu magazzino — QA browser M3', () => {
  test.describe.configure({ mode: 'serial' })
  test.skip(!hasE2eCreds, 'richiede credenziali staging in .env.local.test')

  /**
   * Stato da ripulire, tenuto FUORI dal corpo del test.
   *
   * Perché non basta un `finally` dentro il test (com'era fino al 04-08-26): quando
   * Playwright fa scattare il timeout del test (`test.setTimeout(120000)`) interrompe il
   * corpo **compreso il `finally`**, e le `await` di ripristino non arrivano mai al server.
   * Risultato osservato sul DB TEST: `booking_public_form_config` di `da-tommaso` è rimasto
   * la configurazione finta di questo test, e la variante di viewport successiva ne ha
   * fatto lo snapshot credendolo l'originale — così il travestimento è diventato
   * permanente (`restaurant_name` era «QA 375» dal 16-06-26).
   * `afterEach` ha un budget di tempo suo, separato da quello del test: gira anche dopo
   * un timeout ed è l'unico posto in cui il ripristino è garantito.
   */
  type PendingCleanup = {
    tenantId: string
    categoryKey: string
    shortCode: string
    categoryId: string
    itemId: string
    staffPresetsSnapshot: RestaurantSettingSnapshot | null
    bookingConfigSnapshot: RestaurantSettingSnapshot | null
  }

  let pending: PendingCleanup | null = null

  async function runPendingCleanup() {
    if (!pending) return
    const state = pending
    pending = null
    if (state.categoryId) {
      await setMenuCategoryAvailability(state.tenantId, state.categoryId, true).catch(() => {})
    }
    if (state.itemId) {
      await setMenuItemAvailability(state.tenantId, state.itemId, true).catch(() => {})
    }
    if (state.bookingConfigSnapshot) {
      await restoreRestaurantSettingSnapshot(
        state.tenantId,
        'booking_public_form_config',
        state.bookingConfigSnapshot,
      ).catch(() => {})
    }
    if (state.staffPresetsSnapshot) {
      await restoreRestaurantSettingSnapshot(
        state.tenantId,
        'booking_custom_staff_presets',
        state.staffPresetsSnapshot,
      ).catch(() => {})
    }
    await deleteMenuE2eData(state.tenantId, state.categoryKey, state.shortCode).catch(() => {})
  }

  // Rete di sicurezza: gira col proprio budget di tempo, quindi anche quando il test è
  // stato interrotto dal timeout e il suo `finally` non ha fatto in tempo.
  test.afterEach(runPendingCleanup)

  for (const viewport of VIEWPORTS) {
    test(`toggle disponibilità e propagazione QR (${viewport.label}) ${viewport.tag}`, async ({ page }) => {
      test.setTimeout(120000)
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      const browserErrors = collectBrowserErrors(page)

      const tenantId = await getTenantIdBySlug(TENANT_SLUG)
      const suffix = viewport.label.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      const categoryKey = `e2e_m3_${suffix}`
      const categoryLabel = `${E2E_MENU_PREFIX}${viewport.label}`.slice(0, 24)
      const itemName = `${E2E_MENU_PREFIX}Item ${viewport.label}`.slice(0, 24)
      const shortCode = `e2em3${suffix}`.replace(/_/g, '').slice(0, 20)

      let categoryId = ''
      let itemId = ''
      let staffPresetsSnapshot: RestaurantSettingSnapshot | null = null
      let bookingConfigSnapshot: RestaurantSettingSnapshot | null = null

      // Registrato PRIMA di creare qualsiasi cosa: da qui in poi `afterEach` sa cosa
      // ripulire anche se il test muore a metà. Gli id/snapshot vengono aggiornati per
      // riferimento man mano che esistono.
      const state: PendingCleanup = {
        tenantId,
        categoryKey,
        shortCode,
        categoryId,
        itemId,
        staffPresetsSnapshot,
        bookingConfigSnapshot,
      }
      pending = state

      try {
        await deleteMenuE2eData(tenantId, categoryKey, shortCode)
        const category = await upsertMenuCategory({
          tenantId,
          key: categoryKey,
          label: categoryLabel,
          isAvailable: true,
        })
        const item = await upsertMenuItem({
          tenantId,
          categoryKey,
          name: itemName,
          isAvailable: true,
        })
        await upsertMenuQrCode({
          tenantId,
          shortCode,
          name: `${E2E_MENU_PREFIX}QR ${viewport.label}`,
          categoryFilter: [categoryKey],
        })
        categoryId = category.id
        itemId = item.id
        state.categoryId = categoryId
        state.itemId = itemId

        const presetId = crypto.randomUUID()
        const presetLabel = `${E2E_MENU_PREFIX}Card ${viewport.label}`.slice(0, 24)
        staffPresetsSnapshot = await getRestaurantSettingSnapshot(
          tenantId,
          'booking_custom_staff_presets',
        )
        bookingConfigSnapshot = await getRestaurantSettingSnapshot(
          tenantId,
          'booking_public_form_config',
        )
        // Gli snapshot vanno passati ad `afterEach` PRIMA di sovrascrivere le due chiavi:
        // se il test muore fra la lettura e la scrittura, non c'è niente da ripristinare;
        // se muore dopo, `afterEach` ha già in mano l'originale.
        state.staffPresetsSnapshot = staffPresetsSnapshot
        state.bookingConfigSnapshot = bookingConfigSnapshot
        await upsertRestaurantSettingValue(tenantId, 'booking_custom_staff_presets', [
          buildE2eStaffPreset(presetId, itemId, presetLabel),
        ])
        await upsertRestaurantSettingValue(
          tenantId,
          'booking_public_form_config',
          buildE2eBookingPublicFormConfig(presetId, presetLabel),
        )

        await loginAdmin(page)
        await goToAdminMenu(page)

        await expect(page.getByRole('button', { name: /Crea \/ Modifica Categoria/i })).toBeEnabled()
        await expect(page.getByRole('button', { name: /Crea \/ Modifica Prodotto/i })).toBeEnabled()

        const header = categoryHeader(page, categoryLabel)
        await expect(header).toBeVisible({ timeout: 15000 })
        await expect(header).toHaveAttribute('aria-expanded', 'false')

        const hideCategory = page.getByRole('button', {
          name: byExactText(`Nascondi ${categoryLabel} in Prenota e Menu QR`),
        })
        await expect(hideCategory).toBeVisible()
        await hideCategory.click()

        await expect(header).toHaveAttribute('aria-expanded', 'false')
        await expect
          .poll(() => getMenuCategoryAvailability(categoryId), { timeout: 10000 })
          .toBe(false)
        await expect(
          page.getByRole('button', {
            name: byExactText(`Mostra ${categoryLabel} in Prenota e Menu QR`),
          }),
        ).toBeVisible()
        await expectPublicQrCategoryHidden(page, shortCode, categoryKey, categoryLabel)

        await goToAdminMenu(page)
        await page
          .getByRole('button', { name: byExactText(`Mostra ${categoryLabel} in Prenota e Menu QR`) })
          .click()
        await expect
          .poll(() => getMenuCategoryAvailability(categoryId), { timeout: 10000 })
          .toBe(true)

        await goToAdminMenu(page)
        const content = await openCategory(page, categoryLabel)
        await expect(content.getByText(itemName, { exact: true })).toBeVisible({ timeout: 10000 })

        await content
          .getByRole('button', { name: byExactText(`Nascondi ${itemName} in Prenota e Menu QR`) })
          .click()
        await expect(header).toHaveAttribute('aria-expanded', 'true')
        await expect(content).toHaveAttribute('aria-hidden', 'false')
        await expect.poll(() => getMenuItemAvailability(itemId), { timeout: 10000 }).toBe(false)
        await expect(
          content.getByRole('button', { name: byExactText(`Mostra ${itemName} in Prenota e Menu QR`) }),
        ).toBeVisible()
        await expectPublicBookingItemHidden(page, presetId, itemName)
        await expectPublicQrItemHidden(page, shortCode, categoryKey, itemName)

        await goToAdminMenu(page)
        const reopenedContent = await openCategory(page, categoryLabel)
        await reopenedContent
          .getByRole('button', { name: byExactText(`Mostra ${itemName} in Prenota e Menu QR`) })
          .click()
        await expect.poll(() => getMenuItemAvailability(itemId), { timeout: 10000 }).toBe(true)
        await expectPublicBookingItemVisible(page, presetId, categoryKey, categoryLabel, itemName)
        await expectPublicQrItemVisible(page, shortCode, categoryKey, categoryLabel, itemName)

        await goToAdminMenu(page)
        await page.getByRole('button', { name: /Crea \/ Modifica Categoria/i }).click()
        await expect(page.getByRole('heading', { name: /Categorie Menu/i })).toBeVisible({
          timeout: 10000,
        })
        await expect(
          page.getByRole('button', { name: /in Prenota e Menu QR/i }),
        ).not.toBeVisible()

        expect(browserErrors, 'errori console/browser').toEqual([])
      } finally {
        // Percorso normale. Se il test viene interrotto dal timeout questo blocco non
        // arriva in fondo: la stessa pulizia gira allora da `afterEach`.
        await runPendingCleanup()
      }
    })
  }
})
