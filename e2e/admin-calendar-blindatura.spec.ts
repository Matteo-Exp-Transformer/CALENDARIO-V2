/**
 * @admin-blindatura: calendario-e2e
 * Copre: badge riempimento mese (con % e neutro), digest giornaliero (fasce in ordine
 * display_order, prenotazioni sotto la fascia corretta, pending/no-show assenti), e scorciatoia
 * "+ Nuova prenotazione" con data pre-selezionata.
 *
 * Pre-requisiti staging (.env.local.test):
 *   E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_TENANT_SLUG, E2E_SUPABASE_SERVICE_KEY
 */
import { expect, test, type Locator, type Page } from '@playwright/test'
import {
  deleteAllServiceSlots,
  deleteBookingsByPrefix,
  getExistingTenantSlug,
  getRestaurantSettingSnapshot,
  getServiceSlotsSnapshot,
  getTenantIdBySlug,
  insertBooking,
  insertServiceSlots,
  isoStartEnd,
  offsetIsoDate,
  patchBookingById,
  restoreRestaurantSettingSnapshot,
  restoreServiceSlotsSnapshot,
  type ServiceSlotsSnapshot,
  upsertRestaurantSettingValue,
  upsertSlotGuestCapacities,
} from './helpers/supabaseStaging'

const PREFERRED_TENANT_SLUG = process.env.E2E_CLASSIC_TENANT_SLUG ?? 'test-classic'
/** Slug DB per seed/cleanup: allineato al login Classic (testc@c.com → test-classic). */
const CALENDAR_SEED_TENANT_SLUG = 'test-classic'
const SERVICE_KEY = process.env.E2E_SUPABASE_SERVICE_KEY ?? ''
const ADMIN_CREDENTIALS = [
  { email: 'testc@c.com', password: '123456' },
  { email: process.env.E2E_CLASSIC_ADMIN_EMAIL ?? '', password: process.env.E2E_CLASSIC_ADMIN_PASSWORD ?? '' },
  { email: process.env.E2E_ADMIN_EMAIL ?? '', password: process.env.E2E_ADMIN_PASSWORD ?? '' },
].filter((cred, index, all) =>
  Boolean(cred.email && cred.password) && all.findIndex((item) => item.email === cred.email) === index,
)

const hasE2eCreds = Boolean(ADMIN_CREDENTIALS.length > 0 && SERVICE_KEY)

const CALENDAR_PREFIX = 'E2E-CAL-'

test.use({ viewport: { width: 1280, height: 800 } })

async function loginClassicAdmin(page: Page) {
  for (const credentials of ADMIN_CREDENTIALS) {
    await page.goto('/login', { waitUntil: 'domcontentloaded' })
    await page.fill('#email', credentials.email)
    await page.fill('#password', credentials.password)
    await page.locator('button[type="submit"]').click()
    try {
      await expect(page).toHaveURL(/\/admin/, { timeout: 8000 })
      return
    } catch {
      // Prova la credenziale successiva: lo staging puo avere .env.local.test obsoleto.
    }
  }
  throw new Error('Login Classic E2E fallito con tutte le credenziali configurate')
}

async function goToCalendar(page: Page) {
  await page.goto('/admin/calendario', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/admin\/calendario/)
  await expect(page.getByRole('heading', { name: /Calendario Prenotazioni/i })).toBeVisible({
    timeout: 15000,
  })
}

function dayCell(page: Page, date: string) {
  return page.locator(`.fc-daygrid-day[data-date="${date}"]`).first()
}

function dayNumber(page: Page, date: string) {
  return dayCell(page, date).locator('.fc-daygrid-day-number').first()
}

function formatDayMonth(date: string): string {
  return new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: '2-digit' }).format(new Date(date))
}

async function openDayDigest(page: Page, date: string) {
  const cell = dayCell(page, date)
  await expect(cell).toBeVisible({ timeout: 15000 })
  await dayNumber(page, date).click()
  const dayDigestHeading = page.getByRole('heading', { name: /Prenotazioni del giorno/i })
  await expect(dayDigestHeading).toBeVisible({ timeout: 15000 })
  await dayDigestHeading.scrollIntoViewIfNeeded()
}

/**
 * Sezione di una fascia nel digest giornaliero (vedi DayServiceGroupCard.tsx:58): un <section> per
 * fascia, individuato dal nome esatto (span.text-title-section dentro il bottone header). Su
 * /admin/calendario è l'unico componente della pagina che renderizza <section>, quindi il tag da
 * solo è già inequivocabile.
 */
function serviceGroupSection(page: Page, label: string): Locator {
  return page.locator('section').filter({ has: page.getByText(label, { exact: true }) })
}

/** Ordine reale delle fasce nel digest (ordine DOM delle sezioni = ordine di dayModel.groups = display_order). */
async function serviceGroupLabelsInOrder(page: Page): Promise<string[]> {
  const labels = page.locator('section span.text-title-section')
  await expect(labels.first()).toBeVisible({ timeout: 15000 })
  return labels.allTextContents()
}

/** Le card fascia sono collassate di default (DayServiceGroupCard.tsx:39) — bisogna espanderle per vedere le prenotazioni dentro. */
async function expandServiceGroup(section: Locator): Promise<void> {
  const toggle = section.locator('button[aria-expanded]')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
}

test.describe('Admin Calendario - responsive', () => {
  test.skip(ADMIN_CREDENTIALS.length === 0, 'richiede credenziali staging in .env.local.test')

  test.beforeEach(async ({ page }) => {
    await loginClassicAdmin(page)
  })

  // @admin-blindatura: calendario-e2e
  // Copre: viste FullCalendar disponibili e fallback responsive sui tre viewport QA.
  test('selettore viste responsive a 375, 834 e 1280 px', async ({ page }) => {
    await goToCalendar(page)
    const viewSelector = page.getByRole('group', { name: 'Viste calendario' })
    const monthButton = viewSelector.getByRole('button', { name: 'Mese' })
    const listButton = viewSelector.getByRole('button', { name: 'Lista' })

    await expect(viewSelector.getByRole('button', { name: 'Settimana' })).toBeVisible()
    await expect(viewSelector.getByRole('button', { name: 'Giorno' })).toBeVisible()
    await viewSelector.getByRole('button', { name: 'Settimana' }).click()

    await page.setViewportSize({ width: 375, height: 812 })
    await expect(viewSelector.getByRole('button', { name: 'Settimana' })).toHaveCount(0)
    await expect(viewSelector.getByRole('button', { name: 'Giorno' })).toHaveCount(0)
    await expect(monthButton).toHaveClass(/bg-primary-50/)
    await listButton.click()
    await expect(listButton).toHaveClass(/bg-primary-50/)
    await monthButton.click()
    await expect(monthButton).toHaveClass(/bg-primary-50/)

    await page.setViewportSize({ width: 834, height: 1194 })
    await expect(viewSelector.getByRole('button', { name: 'Settimana' })).toHaveCount(0)
    await expect(viewSelector.getByRole('button', { name: 'Giorno' })).toHaveCount(0)
    await listButton.click()
    await expect(listButton).toHaveClass(/bg-primary-50/)
    await monthButton.click()
    await expect(monthButton).toHaveClass(/bg-primary-50/)
    await listButton.click()

    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(viewSelector.getByRole('button', { name: 'Settimana' })).toBeVisible()
    await expect(viewSelector.getByRole('button', { name: 'Giorno' })).toBeVisible()
    await expect(listButton).toHaveClass(/bg-primary-50/)
  })
})

test.describe('Admin Calendario - nuova prenotazione da giorno', () => {
  test.skip(!hasE2eCreds, 'richiede credenziali staging in .env.local.test')

  test.beforeEach(async ({ page }) => {
    await loginClassicAdmin(page)
  })

  // @admin-blindatura: calendario-e2e
  // Copre: il click su un giorno del mese apre "+ Nuova prenotazione" con la data di quel giorno
  // pre-selezionata nel form (nessun seed dati necessario: non dipende da prenotazioni/impostazioni).
  test('apre "+ Nuova prenotazione" con la data del giorno cliccato preselezionata', async ({ page }) => {
    const formDate = offsetIsoDate(2)
    await goToCalendar(page)

    await dayNumber(page, formDate).click()
    const createButton = page.getByRole('button', {
      name: new RegExp(`Nuova prenotazione il ${formatDayMonth(formDate)}`, 'i'),
    })
    await expect(createButton).toBeVisible({ timeout: 10000 })
    await createButton.click()

    const dialog = page.getByRole('dialog').filter({ hasText: /Nuova prenotazione/i })
    await expect(dialog).toBeVisible({ timeout: 10000 })
    await expect(dialog.locator('#desired_date-control')).toHaveValue(formDate)
  })
})

test.describe('Admin Calendario - badge mese e digest giornaliero', () => {
  // Serial voluto (non per nascondere skip a cascata): i tre test qui sotto mutano le stesse
  // impostazioni tenant-wide (slot_limit_enabled, service_slots, slot_guest_capacities,
  // booking_time_slots_enabled) dello stesso tenant test-classic. Con fullyParallel:true, senza
  // serial girerebbero su worker diversi e si scriverebbero sopra a vicenda sulla stessa riga DB.
  // Ogni test seed+asserisce da solo e passerebbe anche eseguito isolato.
  test.describe.configure({ mode: 'serial' })
  test.skip(!hasE2eCreds, 'richiede credenziali staging in .env.local.test')

  let tenantId = ''
  let tenantSlug = PREFERRED_TENANT_SLUG
  let serviceSlotsSnapshot: ServiceSlotsSnapshot = { slots: [] }
  let slotLimitEnabledSnapshot = { exists: false, value: null as unknown }
  let slotGuestCapacitiesSnapshot = { exists: false, value: null as unknown }
  let timeSlotsEnabledSnapshot = { exists: false, value: null as unknown }

  test.beforeAll(async () => {
    tenantSlug = await getExistingTenantSlug(CALENDAR_SEED_TENANT_SLUG, ['test-classic'])
    tenantId = await getTenantIdBySlug(tenantSlug)
    serviceSlotsSnapshot = await getServiceSlotsSnapshot(tenantId)
    slotLimitEnabledSnapshot = await getRestaurantSettingSnapshot(tenantId, 'slot_limit_enabled')
    slotGuestCapacitiesSnapshot = await getRestaurantSettingSnapshot(tenantId, 'slot_guest_capacities')
    timeSlotsEnabledSnapshot = await getRestaurantSettingSnapshot(tenantId, 'booking_time_slots_enabled')
    await upsertRestaurantSettingValue(tenantId, 'booking_time_slots_enabled', true)
    await deleteBookingsByPrefix(tenantId, CALENDAR_PREFIX)
  })

  test.afterAll(async () => {
    if (!tenantId) return
    await deleteBookingsByPrefix(tenantId, CALENDAR_PREFIX).catch(() => {})
    await restoreServiceSlotsSnapshot(tenantId, serviceSlotsSnapshot).catch(() => {})
    await restoreRestaurantSettingSnapshot(tenantId, 'slot_limit_enabled', slotLimitEnabledSnapshot).catch(() => {})
    await restoreRestaurantSettingSnapshot(
      tenantId,
      'slot_guest_capacities',
      slotGuestCapacitiesSnapshot,
    ).catch(() => {})
    await restoreRestaurantSettingSnapshot(
      tenantId,
      'booking_time_slots_enabled',
      timeSlotsEnabledSnapshot,
    ).catch(() => {})
  })

  test.beforeEach(async ({ page }) => {
    await loginClassicAdmin(page)
  })

  // @admin-blindatura: calendario-e2e
  // Copre: BookingCalendar.tsx resolveDayDenominator (righe ~500-513) — con slot_limit_enabled
  // acceso e OGNI fascia del giorno con un cap in slot_guest_capacities, il badge mese mostra
  // % = coperti/somma-cap con title "N coperti su M" (M = somma dei cap seminati qui, non un
  // numero fisso) e oltre il 100% mostra il valore reale, senza bloccare (buildDayFillBadgesHtml
  // righe ~806-818).
  test('badge mese con percentuale: soglia ok e soglia over', async ({ page }) => {
    const SLOT_MATTINA_ID = 'e2eba001-0001-4001-8001-000000000001'
    const SLOT_SERA_ID = 'e2eba001-0001-4001-8001-000000000002'
    const CAP_MATTINA = 30
    const CAP_SERA = 20
    const denominator = CAP_MATTINA + CAP_SERA

    await upsertRestaurantSettingValue(tenantId, 'slot_limit_enabled', true)
    await deleteAllServiceSlots(tenantId)
    await insertServiceSlots([
      {
        id: SLOT_MATTINA_ID,
        tenant_id: tenantId,
        name: 'E2E-CAL Mattina',
        start_time: '06:00:00',
        end_time: '12:00:00',
        display_order: 0,
        is_canonical: true,
        max_guests: null,
        max_turns: null,
        max_turns_resume: null,
        slot_color: null,
      },
      {
        id: SLOT_SERA_ID,
        tenant_id: tenantId,
        name: 'E2E-CAL Sera',
        start_time: '18:00:00',
        end_time: '23:59:00',
        display_order: 1,
        is_canonical: true,
        max_guests: null,
        max_turns: null,
        max_turns_resume: null,
        slot_color: null,
      },
    ])
    await upsertSlotGuestCapacities(tenantId, {
      [SLOT_MATTINA_ID]: CAP_MATTINA,
      [SLOT_SERA_ID]: CAP_SERA,
    })

    const okDate = offsetIsoDate(10)
    const overDate = offsetIsoDate(11)
    const okGuests = 20 // 20 / 50 = 40% → --ok
    const overGuests = 70 // 70 / 50 = 140% → --over (oltre il 100%, mostrato reale)

    const okTimesA = isoStartEnd(okDate, '08:00')
    await insertBooking({
      tenantId,
      clientName: `${CALENDAR_PREFIX}BadgeOkA`,
      status: 'accepted',
      desiredDate: okDate,
      desiredTime: '08:00',
      numGuests: 12,
      confirmedStart: okTimesA.start,
      confirmedEnd: okTimesA.end,
    })
    const okTimesB = isoStartEnd(okDate, '19:00')
    await insertBooking({
      tenantId,
      clientName: `${CALENDAR_PREFIX}BadgeOkB`,
      status: 'accepted',
      desiredDate: okDate,
      desiredTime: '19:00',
      numGuests: 8,
      confirmedStart: okTimesB.start,
      confirmedEnd: okTimesB.end,
    })

    const overTimesA = isoStartEnd(overDate, '08:00')
    await insertBooking({
      tenantId,
      clientName: `${CALENDAR_PREFIX}BadgeOverA`,
      status: 'accepted',
      desiredDate: overDate,
      desiredTime: '08:00',
      numGuests: 40,
      confirmedStart: overTimesA.start,
      confirmedEnd: overTimesA.end,
    })
    const overTimesB = isoStartEnd(overDate, '19:00')
    await insertBooking({
      tenantId,
      clientName: `${CALENDAR_PREFIX}BadgeOverB`,
      status: 'accepted',
      desiredDate: overDate,
      desiredTime: '19:00',
      numGuests: 30,
      confirmedStart: overTimesB.start,
      confirmedEnd: overTimesB.end,
    })

    await goToCalendar(page)

    const okBadge = dayCell(page, okDate).locator('.booking-day-fill')
    await expect(okBadge).toBeVisible({ timeout: 15000 })
    await expect(okBadge).toHaveClass(/booking-day-fill--ok\b/)
    await expect(okBadge.locator('.booking-day-fill-num')).toHaveText(
      String(Math.round((okGuests / denominator) * 100)),
    )
    await expect(okBadge).toContainText('%')
    await expect(okBadge).toHaveAttribute('title', `${okGuests} coperti su ${denominator}`)

    const overBadge = dayCell(page, overDate).locator('.booking-day-fill')
    await expect(overBadge).toBeVisible({ timeout: 15000 })
    await expect(overBadge).toHaveClass(/booking-day-fill--over\b/)
    await expect(overBadge.locator('.booking-day-fill-num')).toHaveText(
      String(Math.round((overGuests / denominator) * 100)),
    )
    await expect(overBadge).toContainText('%')
    await expect(overBadge).toHaveAttribute('title', `${overGuests} coperti su ${denominator}`)
  })

  // @admin-blindatura: calendario-e2e
  // Copre: BookingCalendar.tsx resolveDayDenominator riga ~508 — "se anche una sola fascia del
  // giorno è senza limite → niente %, solo conteggio". Qui: slot_limit_enabled RESTA acceso, ma
  // una delle due fasce del giorno non ha alcun cap configurato (né max_guests sulla fascia, né
  // una voce in slot_guest_capacities). Il badge deve mostrare solo i coperti, classe --neutral,
  // e MAI il simbolo %.
  test('badge mese senza percentuale se una fascia del giorno non ha un cap', async ({ page }) => {
    const SLOT_CON_CAP_ID = 'e2eba002-0001-4001-8001-000000000001'
    const SLOT_SENZA_CAP_ID = 'e2eba002-0001-4001-8001-000000000002'

    await upsertRestaurantSettingValue(tenantId, 'slot_limit_enabled', true)
    await deleteAllServiceSlots(tenantId)
    await insertServiceSlots([
      {
        id: SLOT_CON_CAP_ID,
        tenant_id: tenantId,
        name: 'E2E-CAL ConCap',
        start_time: '06:00:00',
        end_time: '12:00:00',
        display_order: 0,
        is_canonical: true,
        max_guests: null,
        max_turns: null,
        max_turns_resume: null,
        slot_color: null,
      },
      {
        id: SLOT_SENZA_CAP_ID,
        tenant_id: tenantId,
        name: 'E2E-CAL SenzaCap',
        start_time: '18:00:00',
        end_time: '23:59:00',
        display_order: 1,
        is_canonical: true,
        max_guests: null,
        max_turns: null,
        max_turns_resume: null,
        slot_color: null,
      },
    ])
    // Solo la prima fascia ha un cap: la seconda resta orfana di limite → denominatore null.
    await upsertSlotGuestCapacities(tenantId, { [SLOT_CON_CAP_ID]: 30 })

    const noPctDate = offsetIsoDate(12)
    const noPctGuests = 5
    const noPctTimes = isoStartEnd(noPctDate, '08:00')
    await insertBooking({
      tenantId,
      clientName: `${CALENDAR_PREFIX}NoPct`,
      status: 'accepted',
      desiredDate: noPctDate,
      desiredTime: '08:00',
      numGuests: noPctGuests,
      confirmedStart: noPctTimes.start,
      confirmedEnd: noPctTimes.end,
    })

    await goToCalendar(page)

    const badge = dayCell(page, noPctDate).locator('.booking-day-fill')
    await expect(badge).toBeVisible({ timeout: 15000 })
    await expect(badge).toHaveClass(/booking-day-fill--neutral\b/)
    await expect(badge).toHaveText(String(noPctGuests))
    await expect(badge).not.toContainText('%')
    await expect(badge).toHaveAttribute('title', `${noPctGuests} coperti`)
  })

  // @admin-blindatura: calendario-e2e
  // Copre: dayDigestModel.ts (buildDayDigestModel) + DayServiceGroupCard.tsx — le fasce compaiono
  // nell'ordine di display_order salvato (non nell'ordine cronologico degli orari: qui Cena=0,
  // Pranzo=1, Aperitivo=2 pur avendo orari in ordine inverso), ogni prenotazione accettata compare
  // sotto la fascia in cui cade il suo orario, pending/no-show non compaiono in nessuna fascia
  // (selectedDayDigestBookings in BookingCalendar.tsx già li esclude a monte).
  test('digest: fasce in ordine display_order, prenotazioni sotto la fascia giusta, pending/no-show assenti', async ({
    page,
  }) => {
    const SLOT_IDS = {
      cena: 'e2e00001-0001-4001-8001-000000000001',
      pranzo: 'e2e00001-0001-4001-8001-000000000002',
      aperitivo: 'e2e00001-0001-4001-8001-000000000003',
    } as const

    const SEED_SLOTS = [
      { id: SLOT_IDS.cena, name: 'E2E Cena', start_time: '19:00:00', end_time: '22:00:00', display_order: 0 },
      { id: SLOT_IDS.pranzo, name: 'E2E Pranzo', start_time: '12:00:00', end_time: '15:00:00', display_order: 1 },
      {
        id: SLOT_IDS.aperitivo,
        name: 'E2E Aperitivo',
        start_time: '17:00:00',
        end_time: '19:00:00',
        display_order: 2,
      },
    ] as const

    await upsertRestaurantSettingValue(tenantId, 'booking_time_slots_enabled', true)
    await deleteAllServiceSlots(tenantId)
    await insertServiceSlots(
      SEED_SLOTS.map((slot) => ({
        id: slot.id,
        tenant_id: tenantId,
        name: slot.name,
        start_time: slot.start_time,
        end_time: slot.end_time,
        display_order: slot.display_order,
        is_canonical: true,
        max_guests: null,
        max_turns: null,
        max_turns_resume: null,
        slot_color: null,
      })),
    )

    const digestDate = offsetIsoDate(13)
    const cenaName = `${CALENDAR_PREFIX}SlotCena`
    const pranzoName = `${CALENDAR_PREFIX}SlotPranzo`
    const aperitivoName = `${CALENDAR_PREFIX}SlotAper`
    const pendingName = `${CALENDAR_PREFIX}Pending`
    const noShowName = `${CALENDAR_PREFIX}NoShow`

    const cenaTimes = isoStartEnd(digestDate, '20:00')
    await insertBooking({
      tenantId,
      clientName: cenaName,
      status: 'accepted',
      desiredDate: digestDate,
      desiredTime: '20:00',
      numGuests: 2,
      confirmedStart: cenaTimes.start,
      confirmedEnd: cenaTimes.end,
    })

    const pranzoTimes = isoStartEnd(digestDate, '13:00')
    await insertBooking({
      tenantId,
      clientName: pranzoName,
      status: 'accepted',
      desiredDate: digestDate,
      desiredTime: '13:00',
      numGuests: 2,
      confirmedStart: pranzoTimes.start,
      confirmedEnd: pranzoTimes.end,
    })

    const aperitivoTimes = isoStartEnd(digestDate, '18:00')
    await insertBooking({
      tenantId,
      clientName: aperitivoName,
      status: 'accepted',
      desiredDate: digestDate,
      desiredTime: '18:00',
      numGuests: 2,
      confirmedStart: aperitivoTimes.start,
      confirmedEnd: aperitivoTimes.end,
    })

    await insertBooking({
      tenantId,
      clientName: pendingName,
      status: 'pending',
      desiredDate: digestDate,
      desiredTime: '20:00',
      numGuests: 2,
    })

    const noShowId = await insertBooking({
      tenantId,
      clientName: noShowName,
      status: 'accepted',
      desiredDate: digestDate,
      desiredTime: '21:00',
      numGuests: 2,
      confirmedStart: isoStartEnd(digestDate, '21:00').start,
      confirmedEnd: isoStartEnd(digestDate, '21:00').end,
    })
    await patchBookingById(noShowId, { no_show: true })

    await goToCalendar(page)
    await openDayDigest(page, digestDate)

    // display_order 0,1,2 = Cena, Pranzo, Aperitivo: NON l'ordine cronologico degli orari (che
    // sarebbe Pranzo 12:00 → Aperitivo 17:00 → Cena 19:00). È proprio questo che il test difende.
    const expectedOrder = SEED_SLOTS.map((slot) => slot.name)
    await expect.poll(async () => serviceGroupLabelsInOrder(page)).toEqual(expectedOrder)

    for (const slot of SEED_SLOTS) {
      const section = serviceGroupSection(page, slot.name)
      await expect(section).toContainText(`${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`)
    }

    const cenaSection = serviceGroupSection(page, 'E2E Cena')
    await expandServiceGroup(cenaSection)
    await expect(cenaSection).toContainText(cenaName)
    await expect(cenaSection).not.toContainText(pranzoName)
    await expect(cenaSection).not.toContainText(aperitivoName)

    const pranzoSection = serviceGroupSection(page, 'E2E Pranzo')
    await expandServiceGroup(pranzoSection)
    await expect(pranzoSection).toContainText(pranzoName)
    await expect(pranzoSection).not.toContainText(cenaName)
    await expect(pranzoSection).not.toContainText(aperitivoName)

    const aperitivoSection = serviceGroupSection(page, 'E2E Aperitivo')
    await expandServiceGroup(aperitivoSection)
    await expect(aperitivoSection).toContainText(aperitivoName)
    await expect(aperitivoSection).not.toContainText(cenaName)
    await expect(aperitivoSection).not.toContainText(pranzoName)

    await expect(page.locator('body')).not.toContainText(pendingName)
    await expect(page.locator('body')).not.toContainText(noShowName)
  })
})
