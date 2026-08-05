/**
 * // @admin-blindatura: crm
 * // Copre: apertura CRM Pro, tab Rubrica clienti, tab Personalizza email, sezioni Email automatiche / Email personalizzate e stati vuoti stabili.
 *
 * Test E2E — Admin Pro: CRM con sidebar Pro e tab interne.
 *
 * Richiede staging Supabase con:
 *   E2E_PRO_ADMIN_EMAIL / E2E_PRO_ADMIN_PASSWORD → admin del tenant Pro
 * Configurare in .env.local.test (vedi playwright.config.ts).
 *
 * La Rubrica clienti (CustomerDirectoryTab → CustomerCardList) non è una
 * tabella: è una lista di schede (<ul><li>), col messaggio "Nessun cliente
 * trovato." quando è vuota. Il tenant Pro (da-tommaso) ha già clienti reali
 * in TEST, quindi il test non può contare su uno stato vuoto stabile né deve
 * dipendere da quanti clienti reali esistono in un dato momento: semina un
 * cliente proprio (prenotazione con nome a prefisso unico E2E-CRM-<ts>-<rnd>
 * via insertBooking, che entra nella Rubrica tramite useCustomers/mergeProfiles)
 * e verifica che la SUA scheda sia visibile, poi lo ripulisce in finally con
 * deleteBookingsByPrefix — indipendente dal resto della rubrica.
 */

import { test, expect } from '@playwright/test'
import fs from 'fs'
import {
  getTenantIdBySlug,
  insertBooking,
  patchBookingById,
  deleteBookingsByPrefix,
  todayIsoDate,
} from '../helpers/supabaseStaging'

test.skip(!process.env.E2E_PRO_ADMIN_EMAIL, 'richiede staging Pro configurato (E2E_PRO_ADMIN_EMAIL non impostato)')

const PRO_EMAIL = process.env.E2E_PRO_ADMIN_EMAIL ?? ''
const PRO_PASSWORD = process.env.E2E_PRO_ADMIN_PASSWORD ?? ''
const TENANT_SLUG = 'da-tommaso'

async function loginAsProAdmin(page: import('@playwright/test').Page) {
  await page.goto('/admin')
  await page.getByLabel(/email/i).fill(PRO_EMAIL)
  await page.getByLabel(/password/i).fill(PRO_PASSWORD)
  await page.getByRole('button', { name: /accedi|login/i }).click()
  await expect(page.getByRole('complementary', { name: /navigazione principale/i })).toBeVisible({
    timeout: 15000,
  })
}

function proSidebar(page: import('@playwright/test').Page) {
  return page.getByRole('complementary', { name: /navigazione principale/i })
}

test.describe('Admin Pro — CRM Clienti', () => {
  test('apre CRM, passa tra Rubrica e Personalizza email e mostra stati stabili', async ({ page }) => {
    const tenantId = await getTenantIdBySlug(TENANT_SLUG)
    const uniquePrefix = `E2E-CRM-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const clientName = `${uniquePrefix} Cliente Rubrica`
    const clientEmail = `${clientName.replace(/\s+/g, '.').toLowerCase()}@e2e.test`

    // Seed PRIMA del login: la Rubrica fa fetch al mount, quindi il cliente deve
    // già esistere quando CustomerDirectoryTab monta, senza bisogno di un reload.
    await insertBooking({
      tenantId,
      clientName,
      status: 'accepted',
      desiredDate: todayIsoDate(),
      desiredTime: '20:00',
      numGuests: 2,
    })

    try {
      await loginAsProAdmin(page)

      await proSidebar(page).getByRole('button', { name: /crm clienti/i }).click()
      await expect(page.getByRole('heading', { name: /crm clienti/i })).toBeVisible({ timeout: 5000 })

      await expect(page.getByRole('button', { name: /rubrica clienti/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /personalizza email/i })).toBeVisible()

      await page.getByRole('button', { name: /rubrica clienti/i }).click()
      await expect(page.getByLabel(/cerca/i)).toBeVisible()
      await expect(page.getByLabel(/filtra data ultima prenotazione/i)).toBeVisible()

      // Rubrica = lista di schede (<ul><li>), non una tabella: verifichiamo che
      // la scheda del cliente seminato sia davvero renderizzata, non uno stato
      // vuoto generico intercambiabile con "ci sono clienti".
      const seededCard = page.getByRole('listitem').filter({ hasText: clientName })
      await expect(seededCard).toBeVisible({ timeout: 10000 })
      await expect(seededCard).toContainText(clientEmail)

      await page.getByRole('button', { name: /personalizza email/i }).click()
      await expect(page.getByRole('heading', { name: /email automatiche/i })).toBeVisible()
      await expect(page.getByRole('heading', { name: /email personalizzate/i })).toBeVisible()
      await expect(page.getByText(/accetta prenotazione/i)).toBeVisible()
      await expect(page.getByText(/rifiuta prenotazione/i)).toBeVisible()
      await expect(
        page
          .getByText(/nessuna campagna ancora/i)
          .or(page.getByRole('button', { name: /\+ nuova campagna/i }))
          .or(page.getByRole('button', { name: /invia ora/i }))
          .first(),
      ).toBeVisible()
    } finally {
      await deleteBookingsByPrefix(tenantId, uniquePrefix)
    }
  })
})

/**
 * Helper REST diretti per le campagne email — lette/scritte con service key, come fa
 * e2e/helpers/supabaseStaging.ts. Quell'helper non espone funzioni per email_campaigns
 * e in questo giro non va toccato, quindi la fetch vive qui nella spec. Stessa guardia
 * dell'helper: se VITE_SUPABASE_URL non punta al progetto TEST docnnernvp si lancia un
 * errore invece di scrivere — non deve mai essere possibile toccare PROD da qui.
 */
function ensureCrmEnvLoaded() {
  const hasUrl = !!process.env.VITE_SUPABASE_URL
  const hasKey = !!(process.env.E2E_SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (hasUrl && hasKey) return
  if (fs.existsSync('.env.local.test')) {
    process.loadEnvFile('.env.local.test')
  }
}

function crmStagingUrl(): string {
  ensureCrmEnvLoaded()
  const url = process.env.VITE_SUPABASE_URL ?? ''
  if (!url) throw new Error('VITE_SUPABASE_URL richiesto in .env.local.test per i test campagne CRM')
  if (!url.includes('docnnernvp')) {
    throw new Error('E2E campagne CRM bloccato: VITE_SUPABASE_URL non punta al progetto TEST docnnernvp')
  }
  return url
}

function crmServiceKey(): string {
  ensureCrmEnvLoaded()
  const key = process.env.E2E_SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!key) throw new Error('E2E_SUPABASE_SERVICE_KEY richiesto in .env.local.test per i test campagne CRM')
  return key
}

async function crmRest<T>(path: string, init?: RequestInit): Promise<T> {
  const url = crmStagingUrl()
  const key = crmServiceKey()
  const resp = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string> | undefined),
    },
  })
  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`Supabase REST ${init?.method ?? 'GET'} ${path} → ${resp.status}: ${body}`)
  }
  if (resp.status === 204) return undefined as T
  const text = await resp.text()
  return (text ? JSON.parse(text) : undefined) as T
}

type EmailCampaignE2eRow = {
  id: string
  tenant_id: string
  name: string
  subject: string
  body: string
  recipient_emails: string[] | null
  cadence_type: string
  last_sent_at: string | null
}

/** Campagne del tenant il cui nome inizia col prefisso dato — per asserzioni DB e cleanup. */
async function getE2eCampaignsByPrefix(tenantId: string, prefix: string): Promise<EmailCampaignE2eRow[]> {
  return crmRest<EmailCampaignE2eRow[]>(
    `email_campaigns?tenant_id=eq.${tenantId}&name=like.${encodeURIComponent(prefix)}*` +
      '&select=id,tenant_id,name,subject,body,recipient_emails,cadence_type,last_sent_at&order=created_at.desc',
  )
}

/**
 * Cancella le campagne di prova per prefisso. Va chiamata in afterEach, MAI in un
 * finally dentro il test: se il test va in timeout Playwright interrompe il corpo
 * (finally compreso) prima che la richiesta di cancellazione parta, e la campagna di
 * prova resta lì a occupare uno dei 5 posti del limite (EMAIL_CAMPAIGNS_MAX).
 */
async function deleteE2eCampaignsByPrefix(tenantId: string, prefix: string): Promise<void> {
  await crmRest(`email_campaigns?tenant_id=eq.${tenantId}&name=like.${encodeURIComponent(prefix)}*`, {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
  })
}

/**
 * // @admin-blindatura: crm
 * // Copre: riga 13 del piano Fase 2 — «CRM: crea campagna -> destinatari -> invia,
 * // fino al limite prima di Brevo». La funzione campagne email è attiva in
 * // produzione (CampaignsManager / CampaignEditor / PromoRecipientPicker) e non
 * // aveva ancora nessun test end-to-end: il resto di questo file copre solo
 * // l'apertura del CRM, non creazione/destinatari/invio delle campagne.
 * //
 * // Mode 'serial': ognuno dei tre test crea una propria campagna di prova sullo
 * // stesso tenant (da-tommaso), che condivide con la campagna reale già presente
 * // il limite duro di 5 (EMAIL_CAMPAIGNS_MAX, useEmailCampaigns.ts:15). In
 * // parallelo (fullyParallel:true in playwright.config.ts) più worker
 * // scriverebbero/leggerebbero la stessa lista di campagne del locale nello
 * // stesso momento, sovrascrivendosi a vicenda. Ogni test pulisce la propria
 * // campagna in afterEach (mai in finally — vedi deleteE2eCampaignsByPrefix sopra).
 * //
 * // Guardia invio reale: il tenant Pro ha VITE_ENABLE_SEND_EMAIL=true in
 * // .env.local (invio davvero attivo verso Brevo) e l'unico cliente con consenso
 * // marketing su TEST oggi è l'indirizzo personale di Matteo. Ogni test installa
 * // un page.route sull'endpoint dell'Edge Function send-email che abortisce
 * // qualunque richiesta, PRIMA di toccare la UI, e verifica a fine test che il
 * // contatore di chiamate intercettate sia 0 — sia rete di sicurezza sia
 * // asserzione («fino al limite prima di Brevo» è esattamente questo limite). Il
 * // bottone «Invia ora» esiste due volte con lo stesso testo: quello sulla riga
 * // della campagna (apre solo la modale di conferma, sicuro) e quello dentro la
 * // modale «Conferma invio campagna» (quello che spedisce davvero) — i test qui
 * // sotto premono SOLO il primo, mai il secondo.
 */
test.describe('Admin Pro — CRM campagne email', () => {
  test.describe.configure({ mode: 'serial' })

  const RUN_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const CAMP_PREFIX = `E2E-CAMP-${RUN_ID}`
  const CUSTOMER_PREFIX = `E2E-CRM-CAMP-${RUN_ID}`

  let tenantId: string

  test.beforeAll(async () => {
    tenantId = await getTenantIdBySlug(TENANT_SLUG)
  })

  let sendEmailCallCount = 0

  test.beforeEach(async ({ page }) => {
    sendEmailCallCount = 0
    // Rete di sicurezza: intercetta e blocca qualunque richiesta all'Edge send-email
    // prima ancora che la UI venga toccata. Il contatore serve sia da guardia sia da
    // prova positiva che il flusso testato non manda mai email vere.
    await page.route('**/functions/v1/send-email', async (route) => {
      sendEmailCallCount += 1
      await route.abort()
    })
  })

  test.afterEach(async () => {
    await deleteE2eCampaignsByPrefix(tenantId, CAMP_PREFIX)
    await deleteBookingsByPrefix(tenantId, CUSTOMER_PREFIX)
  })

  async function openPersonalizzaEmail(page: import('@playwright/test').Page) {
    await loginAsProAdmin(page)
    await proSidebar(page).getByRole('button', { name: /crm clienti/i }).click()
    await expect(page.getByRole('heading', { name: /crm clienti/i })).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /personalizza email/i }).click()
    await expect(page.getByRole('heading', { name: /email personalizzate/i })).toBeVisible()
  }

  test('crea una campagna e la riga esiste a database', async ({ page }) => {
    const campaignName = `${CAMP_PREFIX}-crea`
    const campaignSubject = `${campaignName} oggetto di prova`
    const campaignBody = `${campaignName} corpo del messaggio di prova`

    await openPersonalizzaEmail(page)

    await page.getByRole('button', { name: /\+ nuova campagna/i }).click()
    await page.getByLabel(/nome campagna/i).fill(campaignName)
    await page.getByLabel(/oggetto email/i).fill(campaignSubject)
    await page.getByLabel(/corpo del messaggio/i).fill(campaignBody)
    await page.getByRole('button', { name: /^crea campagna$/i }).click()

    // Il toast di conferma è la prima spia, ma da solo non basta: potrebbe comparire
    // anche se la scrittura fosse fallita silenziosamente lato client. La prova vera
    // è la riga letta a database.
    await expect(page.getByText(/campagna creata/i)).toBeVisible({ timeout: 10000 })

    const rows = await getE2eCampaignsByPrefix(tenantId, CAMP_PREFIX)
    const created = rows.find((r) => r.name === campaignName)
    if (!created) {
      throw new Error(`Campagna "${campaignName}" non trovata su TEST dopo il salvataggio`)
    }
    expect(created.subject).toBe(campaignSubject)
    expect(created.body).toBe(campaignBody)

    expect(sendEmailCallCount, 'nessuna richiesta deve mai arrivare a send-email').toBe(0)
  })

  test('nel gruppo destinatari entra solo chi ha dato il consenso marketing', async ({ page }) => {
    // Email tutte minuscole: l'app normalizza gli indirizzi in minuscolo prima di salvarli
    // (`normalizeCustomerEmail`, usata da filterEmailsWithMarketingConsent e dal picker), quindi
    // un indirizzo seminato con le maiuscole del prefisso tornerebbe da DB in minuscolo e il
    // confronto fallirebbe pur essendo lo stesso destinatario. Verificato il 05-08-26 su TEST.
    const eligibleEmail = `${CAMP_PREFIX}-eligible@e2e.test`.toLowerCase()
    const notEligibleEmail = `${CAMP_PREFIX}-noconsenso@e2e.test`.toLowerCase()

    // Il profilo cliente è derivato dalle prenotazioni (useCustomers.ts:60-65): non
    // esiste già una riga in `customers` per queste email finte, quindi source
    // diventa 'booking' e il consenso arriva da bookings.marketing_consent
    // (promoRecipientEligibility.ts:44-50). insertBooking da sola non scrive
    // marketing_consent, per questo serve la patch subito dopo.
    const eligibleBookingId = await insertBooking({
      tenantId,
      clientName: `${CUSTOMER_PREFIX} Con Consenso`,
      status: 'accepted',
      desiredDate: todayIsoDate(),
      desiredTime: '20:00',
      numGuests: 2,
    })
    await patchBookingById(eligibleBookingId, {
      marketing_consent: true,
      client_email: eligibleEmail,
    })

    const notEligibleBookingId = await insertBooking({
      tenantId,
      clientName: `${CUSTOMER_PREFIX} Senza Consenso`,
      status: 'accepted',
      desiredDate: todayIsoDate(),
      desiredTime: '20:30',
      numGuests: 2,
    })
    await patchBookingById(notEligibleBookingId, {
      client_email: notEligibleEmail,
    })

    const campaignName = `${CAMP_PREFIX}-consenso`

    await openPersonalizzaEmail(page)

    await page.getByRole('button', { name: /\+ nuova campagna/i }).click()
    await page.getByLabel(/nome campagna/i).fill(campaignName)
    await page.getByLabel(/oggetto email/i).fill(`${campaignName} oggetto`)
    await page.getByLabel(/corpo del messaggio/i).fill(`${campaignName} corpo`)

    // Il picker si apre su una campagna ancora NUOVA (non salvata): il gruppo scelto
    // qui resta in stato locale del form finché non premiamo "Crea campagna" — nessun
    // controllo server-side del consenso di mezzo (filterEmailsWithMarketingConsent
    // contro la tabella customers reale scatta solo su campagne GIÀ esistenti, vedi
    // CampaignEditor.tsx:109-156 — qui non si applica).
    await page.getByRole('button', { name: /scegli gruppo/i }).click()

    const picker = page.getByRole('dialog', { name: /scegli destinatari/i })
    await expect(picker).toBeVisible()

    const eligibleRow = picker.locator('label', { hasText: eligibleEmail })
    await expect(eligibleRow).toBeVisible({ timeout: 10000 })
    // Il picker mostra SOLO i clienti eleggibili: quello senza consenso non è presente
    // ma disabilitato, è proprio assente dalla lista.
    await expect(picker.locator('label', { hasText: notEligibleEmail })).toHaveCount(0)

    await eligibleRow.getByRole('checkbox').check()
    await picker.getByRole('button', { name: /^conferma$/i }).click()
    await expect(picker).toBeHidden()

    await expect(page.getByText(/1 contatto salvato/i)).toBeVisible()

    await page.getByRole('button', { name: /^crea campagna$/i }).click()
    await expect(page.getByText(/campagna creata/i)).toBeVisible({ timeout: 10000 })

    const rows = await getE2eCampaignsByPrefix(tenantId, CAMP_PREFIX)
    const created = rows.find((r) => r.name === campaignName)
    if (!created) {
      throw new Error(`Campagna "${campaignName}" non trovata su TEST dopo il salvataggio`)
    }
    expect(created.recipient_emails ?? []).toEqual([eligibleEmail])

    expect(sendEmailCallCount, 'nessuna richiesta deve mai arrivare a send-email').toBe(0)
  })

  test("l'invio si ferma alla conferma: nessuna email parte", async ({ page }) => {
    // Minuscolo per lo stesso motivo del test qui sopra: l'app normalizza gli indirizzi.
    const recipientEmail = `${CAMP_PREFIX}-invio@e2e.test`.toLowerCase()

    const bookingId = await insertBooking({
      tenantId,
      clientName: `${CUSTOMER_PREFIX} Invio Sicuro`,
      status: 'accepted',
      desiredDate: todayIsoDate(),
      desiredTime: '21:00',
      numGuests: 2,
    })
    await patchBookingById(bookingId, {
      marketing_consent: true,
      client_email: recipientEmail,
    })

    const campaignName = `${CAMP_PREFIX}-invio`

    await openPersonalizzaEmail(page)

    await page.getByRole('button', { name: /\+ nuova campagna/i }).click()
    await page.getByLabel(/nome campagna/i).fill(campaignName)
    await page.getByLabel(/oggetto email/i).fill(`${campaignName} oggetto`)
    await page.getByLabel(/corpo del messaggio/i).fill(`${campaignName} corpo`)

    // Cadenza di default = 'none' ("Nessuna (solo manuale)", CampaignCadenceSelector.tsx:29):
    // non serve toccare il selettore, è già lo stato iniziale di una campagna nuova.
    await page.getByRole('button', { name: /scegli gruppo/i }).click()
    const picker = page.getByRole('dialog', { name: /scegli destinatari/i })
    await expect(picker).toBeVisible()
    const recipientRow = picker.locator('label', { hasText: recipientEmail })
    await expect(recipientRow).toBeVisible({ timeout: 10000 })
    await recipientRow.getByRole('checkbox').check()
    await picker.getByRole('button', { name: /^conferma$/i }).click()
    await expect(picker).toBeHidden()

    await page.getByRole('button', { name: /^crea campagna$/i }).click()
    await expect(page.getByText(/campagna creata/i)).toBeVisible({ timeout: 10000 })

    // L'editor si chiude dopo il salvataggio, torniamo alla lista righe. Il bottone
    // "Invia ora" qui usato è SEMPRE quello della riga (scoped a campaignRow), mai
    // quello dentro la modale di conferma che si apre subito dopo.
    const campaignRow = page.locator('[role="button"]', { hasText: campaignName })
    await expect(campaignRow).toBeVisible({ timeout: 10000 })
    await expect(campaignRow).toContainText(/solo manuale/i)

    const sendNowOnRow = campaignRow.getByRole('button', { name: /^invia ora$/i })
    await expect(sendNowOnRow).toBeEnabled()
    await sendNowOnRow.click()

    const confirmDialog = page.getByRole('dialog', { name: /conferma invio campagna/i })
    await expect(confirmDialog).toBeVisible()
    await expect(confirmDialog).toContainText(campaignName)
    // "Inviare «nome» a 1 contatti del gruppo?" — un solo destinatario eleggibile seminato.
    await expect(confirmDialog).toContainText(/a\s*1\s*contatti del gruppo/i)

    // MAI il bottone "Invia ora" dentro questa modale: solo "Annulla".
    await confirmDialog.getByRole('button', { name: /^annulla$/i }).click()
    await expect(confirmDialog).toBeHidden()

    expect(sendEmailCallCount, 'nessuna richiesta deve mai arrivare a send-email').toBe(0)

    const rows = await getE2eCampaignsByPrefix(tenantId, CAMP_PREFIX)
    const created = rows.find((r) => r.name === campaignName)
    if (!created) {
      throw new Error(`Campagna "${campaignName}" non trovata su TEST dopo il salvataggio`)
    }
    expect(created.last_sent_at).toBeNull()
  })
})
