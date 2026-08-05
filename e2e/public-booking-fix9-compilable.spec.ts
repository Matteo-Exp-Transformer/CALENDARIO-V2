/**
 * FIX 9 — compilable_category_keys (fase pubblica)
 * @prenota-blindatura: e2e-fix9
 *
 * Copre i casi E2E del requisito FIX 9:
 *   (1+2) toggle admin ON/OFF → coperti da Vitest settingsFormConfigCompilable
 *   (3) pubblico: categoria OFF visibile senza spunte
 *   (4) pubblico: prezzo categoria OFF non nel riepilogo
 *   (5) pubblico: submit → menu_selection non contiene item non compilabili
 *
 * Seed staging (TEST docnnernvp):
 *   - 2 categorie menu e 2 item (uno per categoria)
 *   - preset staff con entrambi gli item
 *   - booking_public_form_config con una card personalizzabile con compilable_category_keys
 * Viewport: 375 / 900 / 1256
 *
 * Pre-requisiti (.env.local.test):
 *   VITE_SUPABASE_URL (deve contenere docnnernvp)
 *   E2E_SUPABASE_SERVICE_KEY
 *   E2E_TENANT_SLUG (default 'da-tommaso')
 */

import { test, expect, type Page } from '@playwright/test'
import {
  deleteBookingsByPrefix,
  deleteMenuE2eData,
  getExistingTenantSlug,
  getRestaurantSettingSnapshot,
  getTenantIdBySlug,
  restoreRestaurantSettingSnapshot,
  upsertMenuCategory,
  upsertMenuItem,
  upsertRestaurantSettingValue,
  waitForCreateBookingRateLimitWindow,
  type RestaurantSettingSnapshot,
} from './helpers/supabaseStaging'

const PREFERRED_TENANT_SLUG = process.env.E2E_TENANT_SLUG || 'da-tommaso'
const HAS_STAGING_CONFIG = Boolean(process.env.VITE_SUPABASE_URL && process.env.E2E_SUPABASE_SERVICE_KEY)

// Chiavi categoria specifiche per questo spec (prefissate per evitare collisioni)
const CAT_COMP_KEY = 'e2e-fix9-comp'
const CAT_NONCOMP_KEY = 'e2e-fix9-non-comp'
const PRESET_ID = '00000000-0000-4000-8000-000000000901'
const CARD_ID = 'e2e-fix9-card-1'
/** Prefisso del cliente del caso 5: da quando quel submit parte davvero, crea una riga vera. */
const SUBMIT_CLIENT_PREFIX = 'E2E-FIX9-'

let tenantSlug = PREFERRED_TENANT_SLUG
let bookingUrl = `/prenota/${tenantSlug}`

function makeFormConfigFix9(itemIdComp: string, itemIdNonComp: string) {
  return {
    page_title: 'Prenota E2E FIX9',
    page_description: 'Config temporanea FIX9 compilable_category_keys.',
    booking_modes: [
      {
        id: 'rinfresco_laurea',
        booking_type: 'rinfresco_laurea',
        enabled: true,
        label: 'Rinfresco FIX9',
        description: 'Modalità con mix categorie compilabili/non.',
        icon: 'fork_knife',
        sub_tabs_enabled: true,
        sub_tabs_presentation: 'cards',
        sub_tabs: [
          {
            id: CARD_ID,
            display: 'cards',
            label: 'Menu FIX9',
            preset_id: PRESET_ID,
            is_fixed_menu: false,
            // Solo la categoria compilabile ha checkbox; non-comp è visibile ma bloccata
            compilable_category_keys: [CAT_COMP_KEY],
          },
        ],
      },
    ],
  }
}

function makeStaffPresets(itemIdComp: string, itemIdNonComp: string) {
  return [
    {
      id: PRESET_ID,
      name: 'Menu FIX9',
      item_ids: [itemIdComp, itemIdNonComp],
      is_fixed_menu: false,
    },
  ]
}

// Apre la card categoria ed aspetta il pannello espanso
async function expandCategory(page: Page, categoryKey: string) {
  const card = page.locator(`[data-testid="booking-menu-category-card-${categoryKey}"]:visible`).first()
  await expect(card).toBeVisible({ timeout: 10000 })
  await card.click()
  // Dopo click il portal appare con data-booking-menu-expanded="true"
  await expect(page.locator(`[data-testid="booking-menu-category-card-${categoryKey}"][data-booking-menu-expanded="true"]`)).toBeVisible({ timeout: 5000 })
}

test.describe('FIX 9 — compilable_category_keys pubblica', () => {
  test.describe.configure({ mode: 'serial' })
  test.skip(!HAS_STAGING_CONFIG, 'richiede .env.local.test con staging Supabase TEST')

  let tenantId = ''
  let formConfigSnapshot: RestaurantSettingSnapshot = { exists: false, value: null }
  let staffPresetsSnapshot: RestaurantSettingSnapshot = { exists: false, value: null }
  let itemIdComp = ''
  let itemIdNonComp = ''

  test.beforeAll(async () => {
    tenantSlug = await getExistingTenantSlug(PREFERRED_TENANT_SLUG, ['da-tommaso', 'test-classic', 'test-pro'])
    bookingUrl = `/prenota/${tenantSlug}`
    tenantId = await getTenantIdBySlug(tenantSlug)

    // Snapshot settings da ripristinare in afterAll
    formConfigSnapshot = await getRestaurantSettingSnapshot(tenantId, 'booking_public_form_config')
    staffPresetsSnapshot = await getRestaurantSettingSnapshot(tenantId, 'booking_custom_staff_presets')

    // Seed 2 categorie e 2 item (una coppia per categoria)
    const catComp = await upsertMenuCategory({
      tenantId,
      key: CAT_COMP_KEY,
      label: 'E2E Compilabile',
      sortOrder: 9010,
      isAvailable: true,
    })
    const catNonComp = await upsertMenuCategory({
      tenantId,
      key: CAT_NONCOMP_KEY,
      label: 'E2E Non Compilabile',
      sortOrder: 9011,
      isAvailable: true,
    })
    const itemComp = await upsertMenuItem({
      tenantId,
      categoryKey: catComp.key,
      name: 'Piatto Compilabile FIX9',
      price: 8,
      isAvailable: true,
    })
    const itemNonComp = await upsertMenuItem({
      tenantId,
      categoryKey: catNonComp.key,
      name: 'Piatto NonComp FIX9',
      price: 12,
      isAvailable: true,
    })
    itemIdComp = itemComp.id
    itemIdNonComp = itemNonComp.id

    // Seed preset staff e config prenotazione
    await upsertRestaurantSettingValue(tenantId, 'booking_custom_staff_presets', makeStaffPresets(itemIdComp, itemIdNonComp))
    await upsertRestaurantSettingValue(tenantId, 'booking_public_form_config', makeFormConfigFix9(itemIdComp, itemIdNonComp))
  })

  test.afterAll(async () => {
    if (!tenantId) return
    await restoreRestaurantSettingSnapshot(tenantId, 'booking_public_form_config', formConfigSnapshot).catch(() => {})
    await restoreRestaurantSettingSnapshot(tenantId, 'booking_custom_staff_presets', staffPresetsSnapshot).catch(() => {})
    await deleteMenuE2eData(tenantId, CAT_COMP_KEY).catch(() => {})
    await deleteMenuE2eData(tenantId, CAT_NONCOMP_KEY).catch(() => {})
    // Il caso 5 ora invia davvero: la prenotazione che crea va tolta, altrimenti resta a
    // ingombrare il calendario del locale di prova (e la capienza della sua fascia).
    await deleteBookingsByPrefix(tenantId, SUBMIT_CLIENT_PREFIX).catch(() => {})
  })

  // ── Caso 3: categoria NON compilabile visibile senza spunte ──────────────────
  for (const { label, width, height } of [
    { label: 'mobile-375', width: 375, height: 812 },
    { label: 'tablet-900', width: 900, height: 1194 },
    { label: 'desktop-1256', width: 1256, height: 800 },
  ]) {
    test(`[${label}] (3) categoria non compilabile: visibile, nessun checkbox`, async ({ page }) => {
      test.setTimeout(90000)
      await page.setViewportSize({ width, height })
      await page.goto(`${bookingUrl}?e2e=fix9-nocheckbox-${label}`, { waitUntil: 'domcontentloaded' })

      // Seleziona tipologia
      await expect(page.locator('#booking-request-form')).toBeVisible({ timeout: 15000 })
      const modeCard = page.getByText('Rinfresco FIX9').first()
      await expect(modeCard).toBeVisible({ timeout: 10000 })
      await modeCard.click()

      // Una sola card "cards" viene auto-selezionata: la strisciolina non appare,
      // ma il preset collegato deve comunque applicarsi e mostrare la griglia.
      await expect(page.getByTestId('booking-menu-compose-grid')).toBeVisible({ timeout: 10000 })

      // Categoria NON compilabile: apri la card
      await expandCategory(page, CAT_NONCOMP_KEY)

      // Nessun checkbox nel pannello espanso della categoria non compilabile
      const expandedNonComp = page.locator(`[data-testid="booking-menu-category-card-${CAT_NONCOMP_KEY}"][data-booking-menu-expanded="true"]`)
      await expect(expandedNonComp.locator('input[type="checkbox"]')).toHaveCount(0)

      // L'item della categoria non compilabile è però visibile nel testo
      await expect(expandedNonComp.getByText('Piatto NonComp FIX9')).toBeVisible()
    })
  }

  // ── Caso 3 (positivo): categoria COMPILABILE ha checkbox ─────────────────────
  for (const { label, width, height } of [
    { label: 'mobile-375', width: 375, height: 812 },
    { label: 'tablet-900', width: 900, height: 1194 },
  ]) {
    test(`[${label}] (3+) categoria compilabile: checkbox presenti`, async ({ page }) => {
      test.setTimeout(90000)
      await page.setViewportSize({ width, height })
      await page.goto(`${bookingUrl}?e2e=fix9-checkbox-${label}`, { waitUntil: 'domcontentloaded' })

      await expect(page.locator('#booking-request-form')).toBeVisible({ timeout: 15000 })
      await page.getByText('Rinfresco FIX9').first().click()
      await expect(page.getByTestId('booking-menu-compose-grid')).toBeVisible({ timeout: 10000 })

      // Categoria COMPILABILE: apri e verifica checkbox
      await expandCategory(page, CAT_COMP_KEY)
      const expandedComp = page.locator(`[data-testid="booking-menu-category-card-${CAT_COMP_KEY}"][data-booking-menu-expanded="true"]`)
      const checkboxes = expandedComp.locator('input[type="checkbox"]')
      await expect(checkboxes).toHaveCount(1) // 1 item
      await expect(expandedComp.getByText('Piatto Compilabile FIX9')).toBeVisible()
    })
  }

  // ── Caso 4: prezzo categoria non compilabile escluso dal riepilogo ────────────
  test('[desktop-1256] (4) item non compilabile NON appare nel riepilogo', async ({ page }) => {
    test.setTimeout(90000)
    await page.setViewportSize({ width: 1256, height: 800 })
    await page.goto(`${bookingUrl}?e2e=fix9-sidebar`, { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#booking-request-form')).toBeVisible({ timeout: 15000 })
    await page.getByText('Rinfresco FIX9').first().click()
    await expect(page.getByTestId('booking-menu-compose-grid')).toBeVisible({ timeout: 10000 })

    // Seleziona l'item compilabile
    await expandCategory(page, CAT_COMP_KEY)
    const expandedComp = page.locator(`[data-testid="booking-menu-category-card-${CAT_COMP_KEY}"][data-booking-menu-expanded="true"]`)
    await expandedComp.locator('input[type="checkbox"]').check()

    // Il sidebar mostra l'item compilabile
    const sidebar = page.getByTestId('booking-summary-sidebar').first()
    await expect(sidebar.getByText('Piatto Compilabile FIX9')).toBeVisible({ timeout: 5000 })

    // Il sidebar NON mostra l'item non compilabile
    await expect(sidebar.getByText('Piatto NonComp FIX9')).toHaveCount(0)
  })

  // ── Caso 5: submit — menu_selection non contiene item non compilabili ─────────
  test('[desktop-1256] (5) submit: menu_selection contiene SOLO item compilabili', async ({ page }) => {
    test.setTimeout(90000)
    await page.setViewportSize({ width: 1256, height: 800 })
    await page.goto(`${bookingUrl}?e2e=fix9-submit`, { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#booking-request-form')).toBeVisible({ timeout: 15000 })
    await page.getByText('Rinfresco FIX9').first().click()
    await expect(page.getByTestId('booking-menu-compose-grid')).toBeVisible({ timeout: 10000 })

    // Seleziona item compilabile
    await expandCategory(page, CAT_COMP_KEY)
    const expandedComp = page.locator(`[data-testid="booking-menu-category-card-${CAT_COMP_KEY}"][data-booking-menu-expanded="true"]`)
    await expandedComp.locator('input[type="checkbox"]').check()

    // Chiudi pannello e intercetta submit per ispezionare il payload
    await expandedComp.locator('button[aria-expanded="true"]').click()

    const submitPromise = page.waitForRequest((req) =>
      req.url().includes('create-booking') && req.method() === 'POST',
    { timeout: 20000 })

    // Compila i dati minimi necessari al submit.
    //
    // ⚠️ RISCRITTO IL 05-08-26. Prima questo blocco usava `#date-trigger`, `#time-trigger` e
    // `#privacy-checkbox`: tre id che in `src/` NON esistono (i veri sono `#desired_date-control`,
    // `#desired_time-control` e `#privacy-consent-dietary-input`). Erano tutti dentro un
    // `if (await …isVisible())`, quindi data, ora e privacy non venivano mai compilate, la
    // validazione bloccava il submit, nessuna richiesta partiva e l'unica asserzione del test
    // viveva dentro `if (submitRequest)` — cioè non veniva mai eseguita. Il test era verde
    // avendo verificato nulla. **Misurato**: eseguendolo, la tabella `rate_limits` non
    // registrava nessuna chiamata a `create-booking`.
    const clientName = `${SUBMIT_CLIENT_PREFIX}${Date.now()}`
    await page.fill('#client_name-control', clientName)
    await page.fill('#client_email-control', 'e2e-fix9@test.it')
    await page.fill('#client_phone-control', '3331234567')
    await page.locator('#num_guests-control').fill('2')

    // Data: pannello «Scegli la data», un mese avanti e giorno 15 — sempre esistente e sempre
    // futuro, quindi mai disabilitato e mai a ridosso del cutoff di oggi.
    await page.locator('#desired_date-control').click()
    const dateDialog = page.getByRole('dialog', { name: /scegli la data/i })
    await expect(dateDialog).toBeVisible({ timeout: 10000 })
    await dateDialog.getByRole('button', { name: 'Mese successivo' }).click()
    await dateDialog.getByRole('button', { name: '15', exact: true }).click()
    await expect(dateDialog).not.toBeVisible()

    // Ora: primo orario davvero offerto dal picker. Non si inventa un orario perché il form
    // azzera quelli fuori fascia (BookingRequestForm.tsx:477-484) e la validazione li rifiuta.
    await page.locator('#desired_time-control').click()
    const timeDialog = page.getByRole('dialog', { name: /scegli l'orario/i })
    await expect(timeDialog).toBeVisible({ timeout: 10000 })
    const orari = timeDialog.getByRole('button', { name: /^\d{2}:\d{2}$/ })
    await expect(orari.first()).toBeVisible({ timeout: 10000 })
    await orari.first().click()

    await page.locator('#privacy-consent-dietary-input').check()

    // La finestra di rate limit dell'Edge è 3 richieste/minuto per IP: senza questa attesa,
    // due spec del form pubblico lanciate di seguito si fanno respingere a vicenda (429).
    await waitForCreateBookingRateLimitWindow()

    const submitBtn = page.locator('button[type="submit"][form="booking-request-form"]:visible')
    await submitBtn.scrollIntoViewIfNeeded()
    await submitBtn.click()

    // Ora la richiesta DEVE partire: se non parte il test fallisce qui, invece di dichiararsi
    // verde per un submit mai avvenuto.
    const submitRequest = await submitPromise
    const body = submitRequest.postDataJSON() as { menu_selection?: { items: { id: string }[] } } | undefined
    const itemIds = (body?.menu_selection?.items ?? []).map((i) => i.id)
    expect(itemIds).toContain(itemIdComp)
    expect(itemIds).not.toContain(itemIdNonComp)

    // E la richiesta dev'essere anche ACCETTATA: senza questo controllo il test resterebbe
    // verde anche se l'Edge respingesse il payload (fascia piena, orario fuori servizio,
    // rate limit), cioè descrivendo un invio che nella realtà non è mai andato a buon fine.
    const response = await submitRequest.response()
    const status = response?.status()
    const responseBody = response ? await response.text().catch(() => '') : '<nessuna risposta>'
    expect(status, `create-booking ha risposto ${status}: ${responseBody.slice(0, 300)}`).toBe(201)
  })
})
