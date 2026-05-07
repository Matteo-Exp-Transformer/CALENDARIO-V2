/**
 * Pre-requisiti staging:
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY → progetto Supabase staging
 *   E2E_TENANT_SLUG → slug di un'organizzazione attiva nel DB staging
 */
import { test, expect } from '@playwright/test'

const TENANT_SLUG = process.env.E2E_TENANT_SLUG || 'test-ristorante'
const BOOKING_URL = `/prenota/${TENANT_SLUG}`

test.describe('Form prenotazione pubblica', () => {
  test('la pagina di prenotazione si apre correttamente', async ({ page }) => {
    await page.goto(BOOKING_URL)
    // Il titolo o un heading visibile identifica la pagina
    await expect(page).not.toHaveURL('/login')
    await expect(page.locator('form, [data-testid="booking-form"], h1, h2').first()).toBeVisible()
  })

  test('submit con email non valida mostra errore inline', async ({ page }) => {
    await page.goto(BOOKING_URL)

    // Compila i campi obbligatori con email invalida
    const emailField = page.locator('input[type="email"], input[name="email"], input[id="email"]').first()
    if (await emailField.isVisible()) {
      await emailField.fill('non-una-email')
    }

    await page.locator('button[type="submit"]').first().click()

    // Deve apparire un messaggio di errore — cerca pattern comuni
    const errorMsg = page.locator('p.text-red-500, [role="alert"], .text-red-400, .text-destructive').first()
    await expect(errorMsg).toBeVisible({ timeout: 3000 })
  })

  test('submit con dati validi crea la prenotazione', async ({ page }) => {
    await page.goto(BOOKING_URL)

    const nameInput = page.locator('input[name="name"], input[id="name"], input[placeholder*="nome"], input[placeholder*="Nome"]').first()
    const emailInput = page.locator('input[type="email"]').first()
    const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first()
    const guestsInput = page.locator('input[type="number"], input[name="guests"]').first()

    if (await nameInput.isVisible()) await nameInput.fill('Mario Rossi')
    if (await emailInput.isVisible()) await emailInput.fill('mario.rossi@test.it')
    if (await phoneInput.isVisible()) await phoneInput.fill('+39 333 1234567')
    if (await guestsInput.isVisible()) await guestsInput.fill('2')

    await page.locator('button[type="submit"]').first().click()

    // Il successo si manifesta con toast, messaggio di conferma o cambio URL
    const successSignal = page.locator(
      '[class*="toast"], [role="status"], [class*="success"], [class*="confirm"]'
    ).first()
    await expect(successSignal).toBeVisible({ timeout: 8000 })
  })
})
