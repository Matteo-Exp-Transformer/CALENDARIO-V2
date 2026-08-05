/**
 * Copre Fase 2 riga 12 del piano — «Form Classic: invio completo + oltre-limite»: il form
 * pubblico `/prenota/test-classic` del locale Classic. Debito di collaudo aperto, a mano
 * nessuno era mai riuscito a completare un invio su quel locale.
 *
 * Pre-requisiti staging:
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY → progetto Supabase TEST (docnnernvp)
 *   E2E_SUPABASE_SERVICE_KEY → service role, per seed/verifica/cleanup
 *   E2E_CLASSIC_TENANT_SLUG → slug del locale Classic (default 'test-classic')
 *
 * ⚠️ LIMITE DI FREQUENZA — create-booking blocca per IP oltre 3 richieste/minuto (429) e
 * mette in blacklist 24h l'IP oltre 6 richieste/10min dopo lo sforamento. Questo file fa AL
 * MASSIMO UN invio reale per test, e solo nei test 1 e 3 (il test 2 non invia nulla, apre
 * solo il picker). Non aggiungere altri invii reali qui, non ritentare il submit, non fare
 * doppio click: ogni invio in più avvicina la macchina di sviluppo al blocco di 24 ore.
 * Prima di ogni invio `clickInviaPrenotazione` chiama `waitForCreateBookingRateLimitWindow()`:
 * senza quella guardia questo file è già bastato, il 05-08-26, a farsi respingere il terzo
 * invio in un minuto quando girava dopo un'altra spec del form pubblico.
 *
 * ⚠️ CONVIVENZA — `admin-calendar-blindatura.spec.ts` cancella tutte le fasce di
 * `test-classic` e le rimpiazza con due sue, ripristinandole a fine file. Questa spec legge
 * le fasce vere del locale: i due file NON possono girare in parallelo (oggi la batteria si
 * lancia con `--workers=1`). Se le fasce lette in `beforeAll` non contengono le 20:00 o non
 * hanno un cap, il test fallisce esplicitamente invece di saltare in silenzio — potrebbe
 * essere proprio quello spec in corsa sulla stessa riga.
 */
import { test, expect, type Locator, type Page } from '@playwright/test'
import {
  deleteBookingsByPrefix,
  getBookingsByNamePrefix,
  getServiceSlots,
  getSlotGuestCapacities,
  getTenantIdBySlug,
  insertBooking,
  offsetIsoDate,
  waitForCreateBookingRateLimitWindow,
  type ServiceSlotRow,
} from './helpers/supabaseStaging'

const TENANT_SLUG = process.env.E2E_CLASSIC_TENANT_SLUG ?? 'test-classic'
const BOOKING_URL = `/prenota/${TENANT_SLUG}`
/** Prefisso di questa spec: l'afterAll finale spazza tutto quello che inizia così. */
const CLIENT_PREFIX = 'E2E-PUBCLS-'

/**
 * Data futura che non cade mai di venerdì: su `test-classic` `business_hours.friday` è
 * `null` (chiuso) e `BookingRequestForm.tsx:1039` rifiuta l'invio contro un giorno chiuso.
 * Le tre chiamate di questo file partono da basi distanziate di 3 giorni (14/17/20): anche
 * con lo scivolamento di +1 per un venerdì, due test non possono mai finire sulla stessa data.
 */
function dataFutura(giorniDaOggi: number): string {
  let offset = giorniDaOggi
  for (;;) {
    const iso = offsetIsoDate(offset)
    const [y, m, d] = iso.split('-').map(Number)
    const isVenerdi = new Date(y, m - 1, d).getDay() === 5
    if (!isVenerdi) return iso
    offset += 1
  }
}

function orarioDentroFascia(slot: ServiceSlotRow, hhmm: string): boolean {
  const start = slot.start_time.slice(0, 5)
  const end = slot.end_time.slice(0, 5)
  return start <= hhmm && hhmm <= end
}

test.describe('Form pubblico Classic — invio completo e oltre-limite', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  let tenantId = ''
  /** Nome della fascia che contiene le 20:00 (letto, mai dedotto: vedi commento di testata). */
  let cenaSlotName = ''
  /** Cap coperti della fascia sopra, letto da service_slots.max_guests o slot_guest_capacities. */
  let cenaCap = 0
  /** Fascia del mattino (contiene le 10:00) e la sua vicina di mezzogiorno: servono al test sul fuso. */
  let mattinoSlotName = ''
  let mattinoCap = 0
  let mezzogiornoSlotName = ''

  test.beforeAll(async () => {
    tenantId = await getTenantIdBySlug(TENANT_SLUG)
    const slots = await getServiceSlots(tenantId)
    const capacities = await getSlotGuestCapacities(tenantId)
    const capDi = (slot: ServiceSlotRow) => slot.max_guests ?? capacities[slot.id] ?? null

    const mattino = slots.find((slot) => orarioDentroFascia(slot, '10:00'))
    const mezzogiorno = slots.find((slot) => orarioDentroFascia(slot, '13:00'))
    const capMattino = mattino ? capDi(mattino) : null
    if (!mattino || !mezzogiorno || capMattino == null) {
      throw new Error(
        `Le fasce di ${TENANT_SLUG} non hanno una fascia del mattino con cap (10:00) e una di ` +
          'mezzogiorno (13:00): il test sull\'ora a muro non ha due fasce adiacenti da distinguere.',
      )
    }
    mattinoSlotName = mattino.name
    mattinoCap = capMattino
    mezzogiornoSlotName = mezzogiorno.name

    const cena = slots.find((slot) => orarioDentroFascia(slot, '20:00'))
    if (!cena) {
      throw new Error(
        `Le fasce di ${TENANT_SLUG} non contengono le 20:00: non sono quelle attese. ` +
          'Un altro spec (probabilmente admin-calendar-blindatura.spec.ts, che sostituisce ' +
          'temporaneamente le fasce di questo tenant) potrebbe averle cancellate/sostituite ' +
          "mentre questa girava — le due spec non possono girare in parallelo.",
      )
    }
    const cap = cena.max_guests ?? capacities[cena.id] ?? null
    if (cap == null) {
      throw new Error(
        `La fascia "${cena.name}" di ${TENANT_SLUG} non ha un cap configurato (né ` +
          `service_slots.max_guests né slot_guest_capacities[${cena.id}]): senza un cap i ` +
          'test "fascia piena" e "oltre il limite" non hanno nulla da saturare.',
      )
    }
    cenaSlotName = cena.name
    cenaCap = cap
  })

  /**
   * Stato da ripulire, tenuto FUORI dal corpo del test: `afterEach` ha un budget di tempo
   * separato da `test.setTimeout(...)` e gira anche se il test è stato interrotto a metà
   * (docs/Testing-Skill/TESTING_SKILL.md §5.3) — un `finally` dentro il test non basterebbe.
   */
  let pending: string[] | null = null

  test.afterEach(async () => {
    if (!pending || !tenantId) return
    const prefixes = pending
    pending = null
    for (const prefix of prefixes) {
      await deleteBookingsByPrefix(tenantId, prefix).catch(() => {})
    }
  })

  // Rete di sicurezza finale: spazza qualunque riga di questa spec sopravvissuta a un
  // afterEach saltato (worker morto a metà, run interrotta da terminale).
  test.afterAll(async () => {
    if (!tenantId) return
    await deleteBookingsByPrefix(tenantId, CLIENT_PREFIX).catch(() => {})
  })

  async function selezionaTavolo(page: Page) {
    // Due tipologie attive sul locale: `tavolo` (carosello, non chiede piatti) e
    // `menu_prezzo_fisso` (bloccherebbe il submit con «Scegli almeno un piatto dal menù!»).
    // Il testid usa il booking_type interno, stabile anche se l'etichetta admin cambia.
    const card = page.getByTestId('booking-mode-card-tavolo')
    await expect(card).toBeVisible({ timeout: 8000 })
    await card.click()
  }

  async function compilaDatiBase(page: Page, clientName: string, numGuests = 2) {
    await selezionaTavolo(page)
    await page.locator('#client_name-control').fill(clientName)
    await page.locator('#client_email-control').fill('mario.rossi@test.it')
    await page.locator('#client_phone-control').fill('+39 333 1234567')
    await page.locator('#num_guests-control').fill(String(numGuests))
    await page.locator('#privacy-consent-dietary-input').check()
  }

  /** Apre il pannello «Scegli la data» e sceglie il giorno esatto, navigando i mesi se serve. */
  async function scegliData(page: Page, iso: string) {
    await page.locator('#desired_date-control').click()
    const dialog = page.getByRole('dialog', { name: /scegli la data/i })
    await expect(dialog).toBeVisible({ timeout: 10000 })

    const [targetYear, targetMonth, targetDay] = iso.split('-').map(Number)
    const today = new Date()
    const monthsAhead =
      (targetYear - today.getFullYear()) * 12 + (targetMonth - 1 - today.getMonth())
    for (let i = 0; i < monthsAhead; i++) {
      await dialog.getByRole('button', { name: 'Mese successivo' }).click()
    }

    // `exact: true` è la parte che conta: senza, il bottone «1» risolverebbe anche su
    // «11» e «21» (match per sottostringa) — locator circoscritto al dialog per lo stesso motivo.
    await dialog.getByRole('button', { name: String(targetDay), exact: true }).click()
    await expect(dialog).not.toBeVisible()
  }

  async function apriPannelloOrario(page: Page): Promise<Locator> {
    await page.locator('#desired_time-control').click()
    const dialog = page.getByRole('dialog', { name: /scegli l'orario/i })
    await expect(dialog).toBeVisible({ timeout: 10000 })
    return dialog
  }

  /**
   * Orario dentro la fascia data (per nome legend), letto dal bottone — mai hardcodato.
   *
   * Tutti e tre i test passano da qui, anche quello che deve solo andare a buon fine: il
   * picker offre gli orari di TUTTE le fasce (Colazione parte dalle 07:00), ma
   * `business_hours` di questo locale apre alle 11:00 o più tardi in ogni giorno feriale, e
   * `BookingRequestForm.tsx:1032-1054` blocca il submit con «Orario non valido. Orari
   * disponibili: …». La fascia serale è l'unica dentro l'orario di apertura di ogni giorno
   * non-venerdì, quindi è l'unica scelta che prova il percorso di invio invece della
   * validazione oraria.
   */
  async function scegliOrarioDellaFascia(page: Page, slotName: string): Promise<string> {
    const dialog = await apriPannelloOrario(page)
    const fieldset = dialog.locator('fieldset').filter({ hasText: slotName })
    const bottoni = fieldset.getByRole('button', { name: /^\d{2}:\d{2}$/ })
    await expect(bottoni.first()).toBeVisible({ timeout: 10000 })
    const scelto = (await bottoni.first().textContent()) ?? ''
    await bottoni.first().click()
    await expect(page.locator('#desired_time-control')).toContainText(scelto)
    return scelto
  }

  /**
   * A 1280px il submit vive nel riepilogo (`form="booking-request-form"`), mai nel bottone
   * grande del form (soglia reale ≥1600px, `BookingRequestForm.tsx` — «Submit grande — solo
   * ≥1600px»). `:visible` serve perché il riepilogo è montato in due varianti (affiancata e
   * impilata): senza, il locator risolve su 2 elementi e va in strict mode violation.
   * Stessa logica di `e2e/public-booking.spec.ts:40-50`.
   */
  async function clickInviaPrenotazione(page: Page) {
    // L'invio arriva davvero all'Edge: prima di premere aspetta che ci sia posto nella
    // finestra di rate limit (3 richieste/minuto per IP). Senza, basta un'altra spec del form
    // pubblico lanciata poco prima e il 429 fa fallire questo test con un sintomo che sembra
    // un difetto del form — misurato il 05-08-26, quattro invii in 58 secondi.
    await waitForCreateBookingRateLimitWindow()
    const submit = page.locator('button[type="submit"][form="booking-request-form"]:visible')
    await submit.scrollIntoViewIfNeeded()
    await expect(submit).toBeVisible({ timeout: 8000 })
    await submit.click()
  }

  /** Numero di fasce che nel picker mostrano almeno un orario, per il nome dato. */
  function orariDellaFascia(dialog: Locator, slotName: string) {
    return dialog
      .locator('fieldset')
      .filter({ hasText: slotName })
      .getByRole('button', { name: /^\d{2}:\d{2}$/ })
  }

  /**
   * Satura la fascia Cena con due prenotazioni accettate (più realistico di una sola da
   * tutto il cap). `confirmed_start`/`confirmed_end` alle 20:00–22:00 con offset "+00:00"
   * finto, dove le cifre sono l'ora a muro (dateUtils.ts:53-59): seed alle 20:00 in Cena
   * perché è dove le due letture della capienza (picker cliente via RPC, Edge create-booking)
   * coincidono in entrambe le stagioni.
   */
  async function saturaFasciaCena(date: string, prefix: string): Promise<void> {
    const meta1 = Math.ceil(cenaCap / 2)
    const meta2 = cenaCap - meta1
    await insertBooking({
      tenantId,
      clientName: `${prefix}1`,
      status: 'accepted',
      desiredDate: date,
      desiredTime: '20:00',
      numGuests: meta1,
      confirmedStart: `${date}T20:00:00+00:00`,
      confirmedEnd: `${date}T22:00:00+00:00`,
    })
    await insertBooking({
      tenantId,
      clientName: `${prefix}2`,
      status: 'accepted',
      desiredDate: date,
      desiredTime: '20:00',
      numGuests: meta2,
      confirmedStart: `${date}T20:00:00+00:00`,
      confirmedEnd: `${date}T22:00:00+00:00`,
    })
  }

  test('il cliente completa l\'invio e la prenotazione esiste a database', async ({ page }) => {
    // 150s e non 60: la guardia sulla finestra di rate limit può attendere fino a ~90 secondi.
    test.setTimeout(150_000)
    const date = dataFutura(14)
    const clientName = `${CLIENT_PREFIX}OK-${Date.now()}`
    pending = [clientName]

    await page.goto(BOOKING_URL)
    await compilaDatiBase(page, clientName)
    await scegliData(page, date)
    await scegliOrarioDellaFascia(page, cenaSlotName)
    await clickInviaPrenotazione(page)

    // 1. Segnale a schermo, con un testo esplicito.
    await expect(
      page.getByText(/richiesta.*inviata|prenotazione.*inviata/i).first(),
    ).toBeVisible({ timeout: 15000 })

    // 2. La prova che conta: la riga esiste davvero, con lo status e gli ospiti giusti —
    //    non un `[role="status"]` generico che sarebbe verde anche senza scrittura a DB.
    await expect
      .poll(async () => (await getBookingsByNamePrefix(tenantId, clientName)).length, {
        timeout: 15000,
      })
      .toBe(1)
    const [created] = await getBookingsByNamePrefix(tenantId, clientName)
    expect(created.status).toBe('pending')
    expect(created.num_guests).toBe(2)

    await deleteBookingsByPrefix(tenantId, clientName).catch(() => {})
  })

  test('fascia piena: gli orari di quella fascia spariscono dal picker', async ({ page }) => {
    test.setTimeout(60_000)
    const date = dataFutura(17)
    const seedPrefix = `${CLIENT_PREFIX}FULL2-${Date.now()}-`
    pending = [seedPrefix]

    // PRIMA semina la saturazione: il test dimostra che il picker la vede già piena
    // quando il cliente apre il form, non una race con un invio in corso. Zero invii reali.
    await saturaFasciaCena(date, seedPrefix)

    await page.goto(BOOKING_URL)
    await selezionaTavolo(page)
    await scegliData(page, date)
    const dialog = await apriPannelloOrario(page)

    const cenaFieldset = dialog.locator('fieldset').filter({ hasText: cenaSlotName })
    await expect(cenaFieldset).toHaveCount(1)
    await expect(cenaFieldset.getByRole('button', { name: /^\d{2}:\d{2}$/ })).toHaveCount(0)

    // Un'altra fascia (non Cena) ha ancora orari: la sparizione è mirata alla fascia satura,
    // non un guasto generale del picker per quella data.
    const altreFasce = dialog.locator('fieldset').filter({ hasNotText: cenaSlotName })
    await expect(altreFasce.getByRole('button', { name: /^\d{2}:\d{2}$/ }).first()).toBeVisible({
      timeout: 10000,
    })
  })

  test('oltre il limite: l\'invio viene respinto e non crea nulla', async ({ page }) => {
    // 150s e non 60: come sopra, l'attesa della finestra di rate limit fa parte del test.
    test.setTimeout(150_000)
    const date = dataFutura(20)
    const seedPrefix = `${CLIENT_PREFIX}FULL3-${Date.now()}-`
    const clientName = `${CLIENT_PREFIX}REJ-${Date.now()}`
    pending = [seedPrefix, clientName]

    await page.goto(BOOKING_URL)
    await compilaDatiBase(page, clientName)
    await scegliData(page, date)
    // Sceglie l'orario DENTRO Cena PRIMA di seminare: è lo scenario vero, la fascia si
    // riempie mentre il cliente sta ancora compilando. Da qui in poi il test non tocca più
    // né data né ospiti: la query capacità (staleTime 30s, chiave con data+ospiti,
    // useArrivalSlots.ts:77-92) non deve rifare fetch, altrimenti
    // BookingRequestForm.tsx:477-484 azzera l'orario scelto invece di lasciarlo arrivare al
    // submit, e il test vedrebbe «Scegli un nuovo orario disponibile» invece di SLOT_LIMIT.
    await scegliOrarioDellaFascia(page, cenaSlotName)

    await saturaFasciaCena(date, seedPrefix)

    // UNICO invio reale di questo test (vincolo di frequenza, vedi commento di testata).
    // Niente retry, niente doppio click: se questo fallisce il dato va riportato così com'è.
    await clickInviaPrenotazione(page)

    const timeError = page.locator('#desired_time-error')
    await expect(timeError).toBeVisible({ timeout: 15000 })
    await expect(timeError).toContainText(/al completo/i)

    // La prova che conta: zero righe per questo cliente, non solo l'errore a schermo.
    await expect
      .poll(async () => (await getBookingsByNamePrefix(tenantId, clientName)).length, {
        timeout: 5000,
      })
      .toBe(0)
  })

  /**
   * Non-regressione della migrazione 071 (05-08-26).
   *
   * L'app salva `confirmed_start` con offset «+00:00» finto, dove le cifre SONO l'ora a muro
   * (`src/features/booking/utils/dateUtils.ts:53-59`). Fino alla 070 la RPC pubblica
   * `get_available_arrival_times` lo leggeva come istante UTC vero
   * (`AT TIME ZONE 'Europe/Rome'`), spostando l'occupazione di +2h d'estate: una prenotazione
   * delle 10:00 saturava la fascia di mezzogiorno invece di quella del mattino — misurato su
   * TEST prima e dopo il fix. Il cliente vedeva piena una fascia vuota, e libera una piena
   * che poi l'Edge rifiutava all'invio.
   *
   * Questo test sarebbe stato ROSSO prima della 071 (le asserzioni sono esattamente invertite
   * rispetto al comportamento vecchio), e non dipende dalla stagione: usa due fasce adiacenti
   * separate da meno di due ore di scarto, che è ciò che il bug spostava.
   */
  test("l'occupazione conta sull'ora a muro: satura la fascia giusta", async ({ page }) => {
    test.setTimeout(60_000)
    const date = dataFutura(23)
    const seedPrefix = `${CLIENT_PREFIX}WALL-${Date.now()}-`
    pending = [seedPrefix]

    // Una prenotazione da tutto il cap alle 10:00 → è dentro la fascia del mattino.
    await insertBooking({
      tenantId,
      clientName: `${seedPrefix}1`,
      status: 'accepted',
      desiredDate: date,
      desiredTime: '10:00',
      numGuests: mattinoCap,
      confirmedStart: `${date}T10:00:00+00:00`,
      confirmedEnd: `${date}T11:00:00+00:00`,
    })

    await page.goto(BOOKING_URL)
    await selezionaTavolo(page)
    await scegliData(page, date)
    const dialog = await apriPannelloOrario(page)

    // Il mattino è pieno: nessun orario. Mezzogiorno è vuoto: gli orari ci sono ancora.
    // Prima della 071 valeva l'esatto contrario, ed è la firma del difetto.
    await expect(orariDellaFascia(dialog, mattinoSlotName)).toHaveCount(0)
    await expect(orariDellaFascia(dialog, mezzogiornoSlotName).first()).toBeVisible({
      timeout: 10000,
    })
  })
})
