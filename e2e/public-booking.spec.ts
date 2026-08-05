/**
 * Pre-requisiti staging:
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY → progetto Supabase staging
 *   E2E_TENANT_SLUG → slug di un'organizzazione attiva nel DB staging (default: 'da-tommaso')
 *   E2E_SUPABASE_SERVICE_KEY → service role, serve solo per verificare/ripulire la riga creata
 */
import { test, expect, type Page } from '@playwright/test'
import {
  deleteBookingsByPrefix,
  getBookingsByNamePrefix,
  getRestaurantSettingSnapshot,
  getTenantIdBySlug,
  restoreRestaurantSettingSnapshot,
  upsertRestaurantSettingValue,
  waitForCreateBookingRateLimitWindow,
  type RestaurantSettingSnapshot,
} from './helpers/supabaseStaging'

// Niente più fallback sullo slug storico 'test': su TEST non esiste (TESTING_SKILL §8.3, §5.2).
// Stesso default di public-booking-smoke.spec.ts, così le due spec puntano allo stesso locale.
const TENANT_SLUG = process.env.E2E_TENANT_SLUG || 'da-tommaso'
const BOOKING_URL = `/prenota/${TENANT_SLUG}`
/** Prefisso dei nomi cliente creati qui: rende le righe riconoscibili e cancellabili. */
const CLIENT_PREFIX = 'E2E-PUB-'

/**
 * ≥1600px: submit grande dentro il form; sotto i 1600px il submit vive nel riepilogo
 * (`form="booking-request-form"`).
 *
 * La soglia è quella del componente, non un numero scelto qui: in
 * `BookingRequestForm.tsx` il submit grande sta in un contenitore
 * `hidden min-[1600px]:flex` («Submit grande — solo ≥1600px; sotto il submit è nel
 * riepilogo»). Con la vecchia soglia 1256 questa spec, che gira a 1280, cercava un
 * bottone nascosto e moriva in timeout su `scrollIntoViewIfNeeded`.
 * `public-booking-smoke.spec.ts` usa già 1600: le due spec ora dicono la stessa cosa.
 *
 * `:visible` non è cosmetico: il riepilogo è montato in due varianti (affiancata e
 * impilata) e senza il filtro il locator risolve su 2 elementi, di cui uno nascosto
 * → strict mode violation. Stesso accorgimento di `public-booking-smoke.spec.ts:287-288`.
 */
async function clickInviaPrenotazione(page: Page) {
  const viewport = page.viewportSize()
  const useDesktopSubmit = (viewport?.width ?? 1280) >= 1600
  const submit = useDesktopSubmit
    ? page.locator('#booking-request-form button.booking-cross-shine-btn[type="submit"]:visible')
    : page.locator('button[type="submit"][form="booking-request-form"]:visible')

  await submit.scrollIntoViewIfNeeded()
  await expect(submit).toBeVisible({ timeout: 8000 })
  await submit.click()
}

async function fillPublicBookingBasics(page: Page, clientName: string) {
  const cards = page.locator('[data-testid^="booking-mode-card-"]')
  if (await cards.first().isVisible().catch(() => false)) {
    await cards.first().click()
  }

  const nameInput = page.locator('#client_name-control')
  await expect(nameInput).toBeVisible({ timeout: 8000 })
  await nameInput.fill(clientName)
  await page.locator('#client_email-control').fill('mario.rossi@test.it')
  await page.locator('#client_phone-control').fill('+39 333 1234567')
  await page.locator('#num_guests-control').fill('2')

  const privacy = page.locator('#privacy-consent-dietary-input')
  if (await privacy.isVisible().catch(() => false)) {
    await privacy.check()
  }
}

/**
 * Sceglie un orario davvero disponibile dal picker.
 *
 * Non è un fronzolo: il form si precompila con `getDefaultTime()`, ma
 * `BookingRequestForm.tsx:478-484` **azzera** l'orario se non è fra le fasce di arrivo
 * del locale, e la validazione (`:1023-1054`) blocca il submit con «Orario obbligatorio»
 * o «Orario non valido». Senza questo passaggio il submit non parte mai — ed è il
 * motivo per cui il test «crea la prenotazione» era verde senza creare nulla.
 * Stesso pattern di `public-booking-smoke.spec.ts:294-305`.
 */
async function scegliOrarioDisponibile(page: Page): Promise<string> {
  await page.locator('#desired_time-control').click()
  const timeDialog = page.getByRole('dialog', { name: /scegli l'orario/i })
  await expect(timeDialog).toBeVisible({ timeout: 10000 })
  const availableTimes = timeDialog.getByRole('button', { name: /^\d{2}:\d{2}$/ })
  await expect(availableTimes.first()).toBeVisible({ timeout: 10000 })
  const chosen = (await availableTimes.first().textContent()) ?? ''
  await availableTimes.first().click()
  await expect(page.locator('#desired_time-control')).toContainText(chosen)
  return chosen
}

/**
 * Modalità unica «Tavolo», senza sotto-schede: è l'unica configurazione in cui il
 * submit non richiede anche la scelta di un piatto.
 *
 * Perché seminarla invece di usare quella del locale: la configurazione pubblica di
 * `da-tommaso` è un residuo di altri test (il 04-08-26 conteneva ancora
 * «Configurazione temporanea Playwright» con una sotto-scheda `E2E-M3-Card tablet-834`).
 * Con una modalità a menù il form si blocca su «Scegli almeno un piatto dal menù!» e
 * il submit non parte — cioè il test dipendeva dallo stato lasciato da qualcun altro.
 */
function makeTavoloOnlyFormConfig() {
  return {
    page_title: 'Prenota E2E form pubblico',
    page_description: 'Config temporanea per public-booking.spec.ts.',
    booking_modes: [
      {
        id: 'tavolo',
        booking_type: 'tavolo',
        enabled: true,
        label: 'Tavolo',
        description: 'Prenota un tavolo.',
        icon: 'fork_knife',
        sub_tabs_enabled: false,
        sub_tabs_presentation: null,
        sub_tabs: [],
      },
    ],
  }
}

test.describe('Form prenotazione pubblica', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  let tenantId = ''
  let formConfigSnapshot: RestaurantSettingSnapshot = { exists: false, value: null }

  test.beforeAll(async () => {
    tenantId = await getTenantIdBySlug(TENANT_SLUG)
    formConfigSnapshot = await getRestaurantSettingSnapshot(tenantId, 'booking_public_form_config')
    await upsertRestaurantSettingValue(
      tenantId,
      'booking_public_form_config',
      makeTavoloOnlyFormConfig(),
    )
  })

  test.afterAll(async () => {
    if (!tenantId) return
    await restoreRestaurantSettingSnapshot(
      tenantId,
      'booking_public_form_config',
      formConfigSnapshot,
    ).catch(() => {})
  })

  test('la pagina di prenotazione si apre correttamente', async ({ page }) => {
    await page.goto(BOOKING_URL)
    await expect(page).not.toHaveURL('/login')
    await expect(page.locator('[data-testid="booking-mode-cards"], form, h1, h2').first()).toBeVisible()
  })

  test('le card tipologia sono visibili e selezionabili', async ({ page }) => {
    await page.goto(BOOKING_URL)
    const cards = page.locator('[data-testid^="booking-mode-card-"]')
    await expect(cards.first()).toBeVisible({ timeout: 5000 })
    await cards.first().click()
    await expect(cards.first()).toBeVisible()
  })

  // RIMOSSO 04-08-26 — «selezionando una card tipologia menu appare la sezione menu».
  // Era avvolto in `if (await menuCard.isVisible())`: se il locale non aveva una
  // modalità a menù il corpo non girava e il test era verde avendo verificato nulla —
  // e ora che questa spec semina una configurazione «solo tavolo» sarebbe sempre così.
  // Il percorso menù è coperto, con dati seminati apposta, da
  // `public-booking-fix9-compilable.spec.ts` (griglia di composizione + payload inviato).

  test('submit con email non valida mostra errore inline', async ({ page }) => {
    await page.goto(BOOKING_URL)
    await fillPublicBookingBasics(page, `${CLIENT_PREFIX}EmailKO`)
    await scegliOrarioDisponibile(page)
    await page.locator('#client_email-control').fill('non-una-email')
    await clickInviaPrenotazione(page)

    // Errore del campo email, non «un errore qualsiasi da qualche parte»: il locator
    // generico di prima (`p.text-red-500, [role="alert"], .text-destructive`) sarebbe
    // stato verde anche per un errore su un altro campo.
    const emailError = page.locator('#client_email-error')
    await expect(emailError).toBeVisible({ timeout: 5000 })
    await expect(emailError).toContainText(/email/i)
  })

  test('submit con dati validi crea la prenotazione', async ({ page }) => {
    // 150s e non 60: prima di premere «Invia» si aspetta che ci sia posto nella finestra di
    // rate limit dell'Edge (3 richieste/minuto per IP). Misurato il 05-08-26: con questa spec
    // e `public-booking-classic.spec.ts` lanciate a poca distanza si arriva a quattro invii in
    // 58 secondi, il quarto torna 429 e — poiché la mappatura di «Troppe richieste» non ha
    // messaggio inline — il test fallisce come se il form fosse rotto.
    test.setTimeout(150_000)
    // Nome unico per run: il repo gira fullyParallel, e serve a distinguere la riga
    // creata da questo test da qualunque altra.
    const clientName = `${CLIENT_PREFIX}${Date.now()}`

    try {
      await page.goto(BOOKING_URL)
      await fillPublicBookingBasics(page, clientName)
      await scegliOrarioDisponibile(page)
      await waitForCreateBookingRateLimitWindow()
      await clickInviaPrenotazione(page)

      // 1. Segnale a schermo, con un testo esplicito.
      await expect(
        page.getByText(/richiesta.*inviata|prenotazione.*inviata/i).first(),
      ).toBeVisible({ timeout: 15000 })

      // 2. La prova che conta: la riga esiste davvero. Prima qui c'era solo un
      //    `[role="status"], [class*="toast"]`, e il test era verde pur non creando
      //    nessuna prenotazione (verificato sul DB TEST: l'ultima riga «Mario Rossi
      //    E2E» risaliva a due mesi prima).
      await expect
        .poll(async () => (await getBookingsByNamePrefix(tenantId, clientName)).length, {
          timeout: 15000,
        })
        .toBe(1)

      const [created] = await getBookingsByNamePrefix(tenantId, clientName)
      expect(created.num_guests).toBe(2)
      expect(created.status).toBe('pending')
    } finally {
      await deleteBookingsByPrefix(tenantId, clientName).catch(() => {})
    }
  })
})
