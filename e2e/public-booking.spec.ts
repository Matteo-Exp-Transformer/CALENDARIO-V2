/**
 * Pre-requisiti staging:
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY → progetto Supabase staging
 *   E2E_TENANT_SLUG → slug di un'organizzazione attiva nel DB staging
 */
import { test, expect } from '@playwright/test'

const TENANT_SLUG =
  process.env.E2E_PUBLIC_BOOKING_SLUG ||
  process.env.E2E_CLASSIC_TENANT_SLUG ||
  process.env.E2E_TENANT_SLUG ||
  'test-ristorante'
const BOOKING_URL = `/prenota/${TENANT_SLUG}`

async function pickValidBookingTime(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /^ora \*/i }).click()
  await page.getByLabel(/ora \(formato 24 ore\)/i).selectOption('19')
  await page.getByLabel(/^minuti$/i).selectOption('00')
  await page.getByRole('button', { name: /conferma orario/i }).click()
}

test.describe('Form prenotazione pubblica', () => {
  test('la pagina di prenotazione si apre correttamente', async ({ page }) => {
    await page.goto(BOOKING_URL)
    await expect(page).not.toHaveURL('/login')
    await expect(page.locator('[data-testid="booking-mode-cards"], form, h1, h2').first()).toBeVisible()
  })

  test('le card tipologia sono visibili e selezionabili', async ({ page }) => {
    await page.goto(BOOKING_URL)
    const cards = page.locator('[data-testid^="booking-mode-card-"]')
    await expect(cards.first()).toBeVisible({ timeout: 5000 })
    // Seleziona la prima card
    await cards.first().click()
    await expect(cards.first()).toBeVisible()
  })

  test('selezionando una card tipologia menu appare la sezione menu', async ({ page }) => {
    await page.goto(BOOKING_URL)
    // Seleziona Rinfresco di Laurea o Menu prezzo fisso
    const menuCard = page.locator('[data-testid="booking-mode-card-rinfresco_laurea"], [data-testid="booking-mode-card-menu_prezzo_fisso"]').first()
    if (await menuCard.isVisible()) {
      await menuCard.click()
      // La sezione menu dovrebbe comparire
      await expect(page.locator('#menu-section')).toBeVisible({ timeout: 3000 })
    }
  })

  test('submit con email non valida mostra errore inline', async ({ page }) => {
    await page.goto(BOOKING_URL)

    const emailField = page.locator('input[type="email"], input[id="client_email"]').first()
    if (await emailField.isVisible()) {
      await emailField.fill('non-una-email')
    }

    await page.locator('button[type="submit"]').first().click()

    const errorMsg = page.locator('p.text-red-500, [role="alert"], .text-red-400, .text-destructive').first()
    await expect(errorMsg).toBeVisible({ timeout: 3000 })
  })

  test('submit con dati validi crea la prenotazione', async ({ page }) => {
    await page.goto(BOOKING_URL)

    await expect(page.getByTestId('booking-mode-cards')).toBeVisible({ timeout: 10000 })
    await page.getByTestId('booking-mode-card-tavolo').click()

    await pickValidBookingTime(page)
    await page.getByRole('textbox', { name: /nome completo/i }).fill(`E2E Test ${Date.now()}`)
    await page.getByRole('textbox', { name: /^ospiti/i }).fill('2')
    await page.getByRole('textbox', { name: /telefono/i }).fill('+39 333 1234567')
    await page.getByRole('textbox', { name: /^email/i }).fill('e2e.test@example.com')

    await page.getByRole('checkbox', { name: /privacy policy/i }).check()

    await page.getByRole('button', { name: /invia prenotazione/i }).click()

    const successSignal = page
      .getByRole('heading', { name: /richiesta di prenotazione inviata/i })
      .or(page.locator('.Toastify__toast--success'))
      .first()
    await expect(successSignal).toBeVisible({ timeout: 12000 })
  })
})
