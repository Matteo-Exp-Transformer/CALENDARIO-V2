/**
 * @admin-blindatura: servizio
 * Copre: COLLAUDO_S4_CHECKLIST.md §2.2 (avviso fine turno con conferma),
 * §2.3 (tavolata su più tavoli + archiviazione S4-REQ-3), §3 (5 stati tavolo in
 * sequenza), §9 ultima riga (responsive 375px, finestra fine turno), e Fase 2
 * piano senior §4 righe 2, 5, 6 e 7 (chiusura fascia → form pubblico; walk-in da browser;
 * turni esauriti → assegna comunque; avviso fine turno).
 *
 * Queste voci non sono mai state collaudate a mano perché legate al tempo reale
 * (serve aspettare che i minuti passino davvero per vedere un tavolo passare a
 * "In uscita"). Qui il tempo è pilotato con l'API clock di Playwright
 * (page.clock.install/fastForward): nessuna attesa reale.
 *
 * ⚠️ IMPORTANTE — perché NOW non è mai un istante avanti al tempo reale, e mai
 * una data futura fissa: installare page.clock su un istante lontano nel
 * futuro (provato: 9 giorni avanti) rompe silenziosamente l'autenticazione.
 * Supabase-js calcola la scadenza del JWT con `Date.now()`; con l'orologio
 * finto piazzato lontano nel futuro, il token (emesso con `expires_at` reale
 * dal server) risulta "già scaduto" fin da subito, l'SDK tenta un refresh
 * continuo che non si stabilizza mai e le richieste successive cadono sul
 * ruolo anon → 401 "permission denied" su
 * `booking_requests`/`booking_table_assignments` (verificato con un test
 * diagnostico usando `page.on('response')`: stesso schema di query, stesso
 * account, la sola differenza è la distanza dell'istante NOW dal reale).
 *
 * NOW = `safeAnchorNow()` (../helpers/wallClockAnchor.ts) — mezzogiorno del
 * giorno solare PRECEDENTE a quello reale, MAI l'istante reale letterale
 * (fix 04-08-26). Prima NOW era `new Date()`: gli scenari sotto (scostamenti
 * da -100' a +35') costruiscono l'ISO abbinando la data canonica alla sola
 * ora dell'istante (`wallIsoAt`) — fra le ~23:25 e le ~01:40 lo scostamento
 * scavalcava la mezzanotte e la data canonica restava sbagliata (dettaglio
 * delle due finestre cieche nel commento di testata di wallClockAnchor.ts).
 * Ancorare a mezzogiorno del giorno prima elimina il problema alla radice
 * (mai a ridosso di mezzanotte per gli scostamenti usati qui) restando
 * comunque SEMPRE nel passato rispetto al tempo reale — stesso vincolo di
 * sicurezza sopra. `fastForward` avanza poi di pochi minuti/decine di minuti
 * dall'ancora: il JWT resta valido per tutta la durata del test (i token dei
 * client hanno vita ~1h) esattamente come quando NOW era il tempo reale.
 *
 * Richiede staging Supabase Pro (stesso account di pro-service.spec.ts):
 *   E2E_PRO_ADMIN_EMAIL / E2E_PRO_ADMIN_PASSWORD
 * Scrive dati SOLO su TEST (docnnernvp). Sale/tavoli/prenotazioni/fasce seminati
 * usano il prefisso E2E-SRV- (E2E_SERVIZIO_PREFIX) e vengono ripuliti in un
 * blocco finally per ogni test — cascata DB: cancellare booking e tavoli
 * cancella anche le righe di booking_table_assignments (FK ON DELETE CASCADE,
 * mig. 011); cancellare la fascia cascata sulle stesse righe se non già sparite.
 *
 * Ogni test crea una fascia temporanea propria invece di riusare una fascia
 * reale del tenant (es. "Cena"): il suo orario configurato non conta per questi
 * scenari (l'assignment la referenzia solo per id, gli stati tavolo dipendono
 * solo da confirmed_start/confirmed_end della prenotazione), MA la finestra
 * "Tavolo a fine turno" raggruppa per tenant+data+service_slot_id — più test
 * che condividessero la stessa fascia sulla data di oggi si vedrebbero a
 * vicenda i tavoli in uscita quando Playwright li esegue in parallelo
 * (fullyParallel:true in playwright.config.ts, comportamento di default di
 * questo repo). Una fascia dedicata per test elimina la collisione alla
 * radice: nessuna esecuzione seriale necessaria, i test restano indipendenti
 * anche se uno di loro fallisce.
 */

import { test, expect, type Page, type Locator } from '@playwright/test'
import {
  getTenantIdBySlug,
  getRestaurantSettingSnapshot,
  getServiceSlotMaxTurns,
  insertRoom,
  insertTable,
  insertTableAssignment,
  insertBooking,
  patchBookingById,
  insertServiceSlot,
  restoreRestaurantSettingSnapshot,
  deleteServiceSlotsByPrefix,
  getTableAssignmentsForBooking,
  getBookingServedAt,
  getTableActive,
  getBookingStatus,
  getBookingsByNamePrefix,
  deleteBookingsByPrefix,
  deleteTablesByPrefix,
  deleteRoomsByPrefix,
  upsertRestaurantSettingValue,
  offsetIsoDate,
  todayIsoDate,
  E2E_SERVIZIO_PREFIX,
} from '../helpers/supabaseStaging'
import {
  addMinutes,
  localDateStr,
  localTimeStr,
  wallIsoAt,
  safeAnchorNow,
} from '../helpers/wallClockAnchor'

test.skip(
  !process.env.E2E_PRO_ADMIN_EMAIL,
  'richiede staging Pro configurato (E2E_PRO_ADMIN_EMAIL non impostato)',
)

const PRO_EMAIL = process.env.E2E_PRO_ADMIN_EMAIL ?? ''
const PRO_PASSWORD = process.env.E2E_PRO_ADMIN_PASSWORD ?? ''
const TENANT_SLUG = 'da-tommaso'

function sidebarNav(page: Page) {
  return page.getByRole('complementary', { name: /navigazione principale/i })
}

async function loginAsProAdmin(page: Page) {
  await page.goto('/admin')
  await page.getByLabel(/email/i).fill(PRO_EMAIL)
  await page.getByLabel(/password/i).fill(PRO_PASSWORD)
  await page.getByRole('button', { name: /accedi|login/i }).click()
  await expect(sidebarNav(page)).toBeVisible({ timeout: 15000 })
}

/** Login → Servizio → tab Mappa (vista Servizio, di default). */
async function openServizioMappa(page: Page) {
  await loginAsProAdmin(page)
  await sidebarNav(page).getByRole('button', { name: /servizio/i }).click()
  await expect(page.getByRole('heading', { name: /^Servizio$/i })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: /^Mappa$/i }).click()
}

/** Login → Servizio → tab Lista (gestione sale/tavoli). */
async function openServizioLista(page: Page) {
  await loginAsProAdmin(page)
  await sidebarNav(page).getByRole('button', { name: /servizio/i }).click()
  await expect(page.getByRole('heading', { name: /^Servizio$/i })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: /^Lista$/i }).click()
}

async function selectDateAndSlot(page: Page, date: string, slotId: string) {
  await page.getByLabel('Data', { exact: true }).fill(date)
  await page.getByLabel('Fascia oraria', { exact: true }).selectOption(slotId)
}

function makeTavoloOnlyFormConfig() {
  return {
    page_title: 'Prenota E2E servizio',
    page_description: 'Config temporanea per verificare le fasce chiuse.',
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

async function openPublicTimeDialog(page: Page) {
  await expect(page.locator('#booking-request-form')).toBeVisible({ timeout: 15000 })
  await page.locator('#desired_time-control').click()
  const dialog = page.getByRole('dialog', { name: /scegli l'orario/i })
  await expect(dialog).toBeVisible({ timeout: 10000 })
  return dialog
}

// ─────────────────────────────────────────────
// Tempo per gli scenari: vedi ../helpers/wallClockAnchor.ts (addMinutes,
// localDateStr, localTimeStr, wallIsoAt, safeAnchorNow) — estratte lì perché
// vitest.config.ts esclude e2e/** dalla scoperta dei test, quindi il test
// unitario che le copre vive in tests/ e importa lo stesso modulo.
// ─────────────────────────────────────────────

/** Bottone del tavolo in piantina: aria-label/title iniziano con "{nome} — {stato} — ...". */
function tableButton(page: Page, tableName: string): Locator {
  return page.getByRole('button', { name: new RegExp(`^${tableName}( |$)`) })
}

let tenantIdCache: string | null = null

/** Risolve una volta sola l'id del tenant (sola lettura, nessuna scrittura da cachare). */
async function getTenantId(): Promise<string> {
  if (tenantIdCache) return tenantIdCache
  tenantIdCache = await getTenantIdBySlug(TENANT_SLUG)
  return tenantIdCache
}

/** Soglia ritardo del tenant (letta, mai scritta) — indipendente dalla fascia usata. */
async function getLateThresholdMinutes(tenantId: string): Promise<number> {
  const snapshot = await getRestaurantSettingSnapshot(tenantId, 'table_late_threshold_minutes')
  return snapshot.exists && typeof snapshot.value === 'number'
    ? snapshot.value
    : 15 // DEFAULT_LATE_THRESHOLD_MINUTES (useTableStatuses.ts) — setting assente su questo tenant
}

let tempSlotCounter = 0

/**
 * Fascia temporanea dedicata al singolo test (vedi commento di testata del
 * file — evita la collisione fra test che condividono tenant+data+fascia
 * quando Playwright li esegue in parallelo). Il nome è unico per run.
 */
async function createTempSlot(tenantId: string, label: string): Promise<{ id: string; name: string }> {
  tempSlotCounter += 1
  const name = `${E2E_SERVIZIO_PREFIX}Slot-${label}-${Date.now()}-${tempSlotCounter}`
  return insertServiceSlot({ tenantId, name })
}

// ─────────────────────────────────────────────
// 0. Fase 2 — Eliminazione tavolo occupato (FIX 0.1)
// ─────────────────────────────────────────────

test.describe('Eliminazione tavolo occupato', () => {
  test('da Lista avvisa, rimuove il tavolo e riporta la prenotazione da assegnare senza servirla', async ({
    page,
  }) => {
    const tenantId = await getTenantId()
    const slot = await createTempSlot(tenantId, 'DelOcc')
    const DATE = offsetIsoDate(120)
    const roomName = `${E2E_SERVIZIO_PREFIX}DelOcc-Room`
    const tableName = `${E2E_SERVIZIO_PREFIX}DelOcc-T1`
    const clientName = `${E2E_SERVIZIO_PREFIX}DelOcc-Cliente`

    const room = await insertRoom({ tenantId, name: roomName })
    const table = await insertTable({ tenantId, roomId: room.id, name: tableName, capacity: 4 })
    const bookingId = await insertBooking({
      tenantId,
      clientName,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: '20:00',
      numGuests: 4,
      confirmedStart: wallIsoAt(DATE, new Date(`${DATE}T20:00:00`)),
      confirmedEnd: wallIsoAt(DATE, new Date(`${DATE}T23:00:00`)),
    })
    await insertTableAssignment({
      tenantId,
      bookingId,
      tableId: table.id,
      serviceSlotId: slot.id,
      date: DATE,
    })

    try {
      await openServizioLista(page)

      await expect(page.getByRole('heading', { name: roomName })).toBeVisible({ timeout: 10000 })
      await expect(page.getByText(tableName, { exact: true })).toBeVisible()

      await page.getByRole('button', { name: `Elimina ${tableName}`, exact: true }).click()
      await expect(page.getByText(/questo tavolo ha 1 prenotazione assegnata/i)).toBeVisible({
        timeout: 10000,
      })
      await page.getByRole('button', { name: /sì, elimina/i }).click()

      await expect(
        page.getByRole('button', { name: `Elimina ${tableName}`, exact: true }),
      ).toHaveCount(0, { timeout: 10000 })

      await expect.poll(() => getTableActive(table.id), { timeout: 10000 }).toBe(false)
      await expect
        .poll(
          async () => {
            const assignments = await getTableAssignmentsForBooking(bookingId)
            return assignments.filter((assignment) => assignment.table_id === table.id).length
          },
          { timeout: 10000 },
        )
        .toBe(0)
      await expect.poll(() => getBookingServedAt(bookingId), { timeout: 10000 }).toBeNull()
      await expect.poll(() => getBookingStatus(bookingId), { timeout: 10000 }).toBe('accepted')
    } finally {
      await deleteBookingsByPrefix(tenantId, clientName)
      await deleteTablesByPrefix(tenantId, tableName)
      await deleteRoomsByPrefix(tenantId, roomName)
      await deleteServiceSlotsByPrefix(tenantId, slot.name)
    }
  })
})

// ─────────────────────────────────────────────
// 0-bis. Fase 2 — Chiusura fascia → form pubblico
// ─────────────────────────────────────────────

test.describe('Fascia chiusa e form pubblico', () => {
  test('Mario chiude una fascia da Servizio e Anna non la vede più nel picker orari', async ({
    page,
  }) => {
    test.setTimeout(120000)

    const tenantId = await getTenantId()
    const slot = await createTempSlot(tenantId, 'PublicClosed')
    const formSnapshot = await getRestaurantSettingSnapshot(tenantId, 'booking_public_form_config')
    const slotsEnabledSnapshot = await getRestaurantSettingSnapshot(
      tenantId,
      'booking_time_slots_enabled',
    )

    try {
      await upsertRestaurantSettingValue(
        tenantId,
        'booking_public_form_config',
        makeTavoloOnlyFormConfig(),
      )
      await upsertRestaurantSettingValue(tenantId, 'booking_time_slots_enabled', true)

      await page.goto(`/prenota/${TENANT_SLUG}?e2e=slot-open-${Date.now()}`, {
        waitUntil: 'domcontentloaded',
      })
      const openDialog = await openPublicTimeDialog(page)
      await expect(openDialog.getByText(slot.name, { exact: true })).toBeVisible({
        timeout: 15000,
      })
      await openDialog.getByRole('button', { name: 'Chiudi' }).click()
      await expect(openDialog).not.toBeVisible()

      await openServizioLista(page)
      await page.getByRole('button', { name: /^Fasce orarie$/ }).click()
      await expect(page.getByText(slot.name, { exact: true })).toBeVisible({ timeout: 10000 })
      await page.getByRole('button', { name: `Chiudi servizio ${slot.name}`, exact: true }).click()

      await expect
        .poll(() => getServiceSlotMaxTurns(slot.id), { timeout: 15000 })
        .toBe(0)

      await page.goto(`/prenota/${TENANT_SLUG}?e2e=slot-closed-${Date.now()}`, {
        waitUntil: 'domcontentloaded',
      })
      const closedDialog = await openPublicTimeDialog(page)
      await expect(closedDialog.getByText(slot.name, { exact: true })).toHaveCount(0)
    } finally {
      await restoreRestaurantSettingSnapshot(
        tenantId,
        'booking_public_form_config',
        formSnapshot,
      ).catch(() => {})
      await restoreRestaurantSettingSnapshot(
        tenantId,
        'booking_time_slots_enabled',
        slotsEnabledSnapshot,
      ).catch(() => {})
      await deleteServiceSlotsByPrefix(tenantId, slot.name).catch(() => {})
    }
  })
})

// ─────────────────────────────────────────────
// 0-ter. Fase 2 — Walk-in end-to-end a browser
// ─────────────────────────────────────────────

test.describe('Walk-in da browser', () => {
  test('tavolo occupato: primo click avvisa, cambio sala resetta, secondo click forza e assegna', async ({
    page,
  }) => {
    test.setTimeout(120000)

    const tenantId = await getTenantId()
    const runId = `${Date.now()}`
    const slotName = `${E2E_SERVIZIO_PREFIX}WalkIn-Slot-${runId}`
    const roomPrefix = `${E2E_SERVIZIO_PREFIX}WalkIn-Room-${runId}`
    const tablePrefix = `${E2E_SERVIZIO_PREFIX}WalkIn-T-${runId}`
    const oldClientName = `${E2E_SERVIZIO_PREFIX}WalkIn-Old-${runId}`
    const newClientName = `${E2E_SERVIZIO_PREFIX}WalkIn-New-${runId}`
    const today = todayIsoDate()

    // Pulizia preventiva: se un run precedente va in timeout, Playwright può
    // interrompere il finally. Una vecchia fascia WalkIn 00:00-23:59 con
    // display_order basso farebbe scegliere al modale la fascia sbagliata.
    await deleteBookingsByPrefix(tenantId, `${E2E_SERVIZIO_PREFIX}WalkIn-`).catch(() => {})
    await deleteTablesByPrefix(tenantId, `${E2E_SERVIZIO_PREFIX}WalkIn-T-`).catch(() => {})
    await deleteRoomsByPrefix(tenantId, `${E2E_SERVIZIO_PREFIX}WalkIn-Room-`).catch(() => {})
    await deleteServiceSlotsByPrefix(tenantId, `${E2E_SERVIZIO_PREFIX}WalkIn-Slot-`).catch(() => {})

    const slot = await insertServiceSlot({
      tenantId,
      name: slotName,
      startTime: '00:00',
      endTime: '23:59',
      displayOrder: -10000,
    })
    const roomA = await insertRoom({ tenantId, name: `${roomPrefix}-A`, displayOrder: -10000 })
    const roomB = await insertRoom({ tenantId, name: `${roomPrefix}-B`, displayOrder: -9999 })
    const busyTable = await insertTable({
      tenantId,
      roomId: roomA.id,
      name: `${tablePrefix}-Busy`,
      capacity: 4,
      positionX: 20,
      positionY: 20,
    })
    const freeTable = await insertTable({
      tenantId,
      roomId: roomB.id,
      name: `${tablePrefix}-Free`,
      capacity: 4,
      positionX: 20,
      positionY: 20,
    })
    const oldBookingId = await insertBooking({
      tenantId,
      clientName: oldClientName,
      status: 'accepted',
      desiredDate: today,
      desiredTime: '12:00',
      numGuests: 2,
      confirmedStart: `${today}T12:00:00+00:00`,
      confirmedEnd: `${today}T15:00:00+00:00`,
    })
    await insertTableAssignment({
      tenantId,
      bookingId: oldBookingId,
      tableId: busyTable.id,
      serviceSlotId: slot.id,
      date: today,
    })

    try {
      await loginAsProAdmin(page)
      await expect(page.getByRole('heading', { name: /^Home$/i })).toBeVisible({ timeout: 10000 })

      await page.getByRole('button', { name: /Aggiungi walk-in/i }).click()
      const dialog = page.getByRole('dialog', { name: /^Aggiungi walk-in$/ })
      await expect(dialog).toBeVisible({ timeout: 10000 })

      await dialog.getByLabel(/nome cliente/i).fill(newClientName)
      await dialog.getByLabel(/numero coperti/i).fill('2')
      await dialog.getByLabel(/^Sala/i).selectOption(roomA.id)
      const tableSelect = dialog.getByLabel(/^Tavolo/i)
      await expect(tableSelect.locator(`option[value="${busyTable.id}"]`)).toContainText(/occupato/i)
      await tableSelect.selectOption(busyTable.id)

      await expect(dialog.getByTestId('busy-table-warning')).toHaveText(/puoi forzare la sostituzione/i)

      const submit = dialog.getByRole('button', { name: /^Aggiungi walk-in$/i })
      await submit.click()
      await expect(dialog.getByTestId('busy-table-warning')).toHaveText(/stai liberando il tavolo occupato/i)
      await expect.poll(() => getBookingsByNamePrefix(tenantId, newClientName)).toHaveLength(0)

      // Cambiare sala azzera il tavolo selezionato e la conferma di forzatura: non deve
      // restare un "ok" nascosto mentre lo staff sceglie un'altra sala.
      await dialog.getByLabel(/^Sala/i).selectOption(roomB.id)
      await expect(dialog.getByLabel(/^Tavolo/i)).toHaveValue('')
      await expect(dialog.getByTestId('busy-table-warning')).toHaveCount(0)
      await dialog.getByLabel(/^Tavolo/i).selectOption(freeTable.id)
      await expect(dialog.getByTestId('busy-table-warning')).toHaveCount(0)

      // Torna sul tavolo occupato e conferma davvero con il secondo click.
      await dialog.getByLabel(/^Sala/i).selectOption(roomA.id)
      await dialog.getByLabel(/^Tavolo/i).selectOption(busyTable.id)
      await submit.click()
      await expect(dialog.getByTestId('busy-table-warning')).toHaveText(/stai liberando il tavolo occupato/i)
      await submit.click()
      await expect(dialog).not.toBeVisible({ timeout: 15000 })

      await expect
        .poll(() => getBookingsByNamePrefix(tenantId, newClientName), { timeout: 15000 })
        .toHaveLength(1)
      const newBookings = await getBookingsByNamePrefix(tenantId, newClientName)
      expect(newBookings[0]).toMatchObject({
        client_name: newClientName,
        status: 'accepted',
        num_guests: 2,
      })

      const oldAssignments = await getTableAssignmentsForBooking(oldBookingId)
      expect(oldAssignments).toHaveLength(1)
      expect(oldAssignments[0].checked_out_at).not.toBeNull()

      const newAssignments = await getTableAssignmentsForBooking(newBookings[0].id)
      expect(newAssignments).toHaveLength(1)
      expect(newAssignments[0]).toMatchObject({
        table_id: busyTable.id,
        checked_out_at: null,
      })
    } finally {
      await deleteBookingsByPrefix(tenantId, `${E2E_SERVIZIO_PREFIX}WalkIn-Old-${runId}`).catch(() => {})
      await deleteBookingsByPrefix(tenantId, `${E2E_SERVIZIO_PREFIX}WalkIn-New-${runId}`).catch(() => {})
      await deleteTablesByPrefix(tenantId, tablePrefix).catch(() => {})
      await deleteRoomsByPrefix(tenantId, roomPrefix).catch(() => {})
      await deleteServiceSlotsByPrefix(tenantId, slotName).catch(() => {})
    }
  })
})

// ─────────────────────────────────────────────
// 0-quater. Fase 2 — Turni esauriti + assegna comunque a browser
// ─────────────────────────────────────────────

test.describe('Turni esauriti da browser', () => {
  test('tavolo libero con turni finiti: mostra avviso e assegna comunque con audit', async ({
    page,
  }) => {
    test.setTimeout(120000)

    const tenantId = await getTenantId()
    const runId = `${Date.now()}`
    const slotName = `${E2E_SERVIZIO_PREFIX}Turns-Slot-${runId}`
    const roomName = `${E2E_SERVIZIO_PREFIX}Turns-Room-${runId}`
    const tableName = `${E2E_SERVIZIO_PREFIX}Turns-T1-${runId}`
    const oldClientPrefix = `${E2E_SERVIZIO_PREFIX}Turns-Old-${runId}`
    const newClientName = `${E2E_SERVIZIO_PREFIX}Turns-New-${runId}`
    const DATE = offsetIsoDate(120)

    const slot = await insertServiceSlot({
      tenantId,
      name: slotName,
      startTime: '00:00',
      endTime: '23:59',
      maxTurns: 2,
    })
    const room = await insertRoom({ tenantId, name: roomName })
    const table = await insertTable({
      tenantId,
      roomId: room.id,
      name: tableName,
      capacity: 4,
      positionX: 20,
      positionY: 20,
    })

    const oldBooking1Id = await insertBooking({
      tenantId,
      clientName: `${oldClientPrefix}-1`,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: '11:00',
      numGuests: 2,
      confirmedStart: `${DATE}T11:00:00+00:00`,
      confirmedEnd: `${DATE}T12:00:00+00:00`,
    })
    const oldBooking2Id = await insertBooking({
      tenantId,
      clientName: `${oldClientPrefix}-2`,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: '12:30',
      numGuests: 2,
      confirmedStart: `${DATE}T12:30:00+00:00`,
      confirmedEnd: `${DATE}T13:30:00+00:00`,
    })
    await insertTableAssignment({
      tenantId,
      bookingId: oldBooking1Id,
      tableId: table.id,
      serviceSlotId: slot.id,
      date: DATE,
      turnNumber: 1,
      checkedOutAt: new Date().toISOString(),
    })
    await patchBookingById(oldBooking1Id, { served_at: new Date().toISOString() })
    await insertTableAssignment({
      tenantId,
      bookingId: oldBooking2Id,
      tableId: table.id,
      serviceSlotId: slot.id,
      date: DATE,
      turnNumber: 2,
      checkedOutAt: new Date().toISOString(),
    })
    await patchBookingById(oldBooking2Id, { served_at: new Date().toISOString() })

    const newBookingId = await insertBooking({
      tenantId,
      clientName: newClientName,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: '14:00',
      numGuests: 2,
      confirmedStart: `${DATE}T14:00:00+00:00`,
      confirmedEnd: `${DATE}T15:30:00+00:00`,
    })

    try {
      await openServizioMappa(page)
      await selectDateAndSlot(page, DATE, slot.id)

      await expect(page.getByText('Prenotazioni (1)', { exact: true })).toBeVisible({ timeout: 10000 })
      await page.getByRole('button', { name: 'Assegna', exact: true }).click()

      const assignDialog = page.getByRole('dialog', { name: /^Assegna tavolo$/ })
      await expect(assignDialog).toBeVisible({ timeout: 10000 })
      const tableChoice = assignDialog.locator('button', { hasText: tableName })
      await expect(tableChoice).toContainText('0 turni residui')
      await expect(tableChoice).toContainText('Turni esauriti')

      await tableChoice.click()
      await expect(assignDialog).not.toBeVisible()
      await expect(page.getByText(/Turni esauriti per questo tavolo/i)).toBeVisible()
      await page.getByRole('button', { name: /Assegna comunque/i }).click()

      await expect(page.getByText('Assegnate (1)', { exact: true })).toBeVisible({ timeout: 15000 })
      await expect
        .poll(() => getTableAssignmentsForBooking(newBookingId), { timeout: 15000 })
        .toHaveLength(1)

      const assignments = await getTableAssignmentsForBooking(newBookingId)
      expect(assignments[0]).toMatchObject({
        table_id: table.id,
        checked_out_at: null,
        forced_by_admin: true,
        force_reason: 'Forzato dallo staff',
        turn_number: 3,
      })
    } finally {
      await deleteBookingsByPrefix(tenantId, oldClientPrefix).catch(() => {})
      await deleteBookingsByPrefix(tenantId, newClientName).catch(() => {})
      await deleteTablesByPrefix(tenantId, tableName).catch(() => {})
      await deleteRoomsByPrefix(tenantId, roomName).catch(() => {})
      await deleteServiceSlotsByPrefix(tenantId, slot.name).catch(() => {})
    }
  })
})

// ─────────────────────────────────────────────
// 1. Avviso di fine turno con conferma (checklist §2.2)
// ─────────────────────────────────────────────

test.describe('Avviso di fine turno con conferma', () => {
  test('si apre da solo, mostra i dati giusti; "Ancora occupato" non fa tornare l\'avviso dopo reload', async ({
    page,
  }) => {
    const tenantId = await getTenantId()
    const slot = await createTempSlot(tenantId, 'RelA')
    const NOW = safeAnchorNow()
    const arrival = addMinutes(NOW, -90)
    const end = addMinutes(NOW, -5) // 5' prima di NOW → già "in uscita" al caricamento
    const DATE = localDateStr(NOW)
    const roomName = `${E2E_SERVIZIO_PREFIX}Rel-A-Room`
    const tableName = `${E2E_SERVIZIO_PREFIX}RelA-T1`
    const clientName = `${E2E_SERVIZIO_PREFIX}RelA-Cliente`

    const room = await insertRoom({ tenantId, name: roomName })
    const table = await insertTable({ tenantId, roomId: room.id, name: tableName, capacity: 4 })
    const bookingId = await insertBooking({
      tenantId,
      clientName,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: localTimeStr(arrival),
      numGuests: 4,
      confirmedStart: wallIsoAt(DATE, arrival),
      confirmedEnd: wallIsoAt(DATE, end),
    })
    await insertTableAssignment({
      tenantId,
      bookingId,
      tableId: table.id,
      serviceSlotId: slot.id,
      date: DATE,
    })

    try {
      await page.clock.install({ time: NOW })
      await openServizioMappa(page)
      await selectDateAndSlot(page, DATE, slot.id)

      const dialog = page.getByRole('dialog', { name: /^Tavolo a fine turno$/ })
      await expect(dialog).toBeVisible({ timeout: 10000 })
      const releaseRow = dialog.locator('li', { hasText: tableName })
      await expect(releaseRow).toContainText(roomName)
      await expect(releaseRow).toContainText(clientName)
      await expect(releaseRow).toContainText('4 coperti')
      await expect(releaseRow).toContainText(`fine turno ${localTimeStr(end)}`)

      await releaseRow.getByRole('button', { name: 'Ancora occupato' }).click()
      await expect(dialog).not.toBeVisible()

      // Il tavolo resta "non libero": lo stato interno è ancora 'leaving' (In
      // uscita). FIX D (03-08-26): "Ancora occupato" ORA scrive su DB
      // (release_notice_handled_at), ma solo per silenziare l'avviso — non tocca
      // checked_out_at, quindi il tavolo non torna "Libero".
      const tableEl = tableButton(page, tableName)
      await expect(tableEl).toHaveAccessibleName(/— In uscita —/)
      await expect(tableEl).not.toHaveAccessibleName(/— Libero —/)

      // Ricarica con lo stesso istante fissato: l'avviso non deve tornare per
      // questo tavolo nella stessa fascia/data (checklist §2.2).
      await page.clock.install({ time: NOW })
      await page.reload()
      await expect(page.getByRole('heading', { name: /^Servizio$/i })).toBeVisible({ timeout: 10000 })
      await page.getByRole('button', { name: /^Mappa$/i }).click()
      await selectDateAndSlot(page, DATE, slot.id)

      await expect(page.getByRole('dialog', { name: /fine turno/i })).not.toBeVisible({ timeout: 5000 })
    } finally {
      await deleteBookingsByPrefix(tenantId, clientName)
      await deleteTablesByPrefix(tenantId, tableName)
      await deleteRoomsByPrefix(tenantId, roomName)
      await deleteServiceSlotsByPrefix(tenantId, slot.name)
    }
  })

  test('"Libero" esegue il checkout append-only (booking non sparisce)', async ({ page }) => {
    const tenantId = await getTenantId()
    const slot = await createTempSlot(tenantId, 'RelB')
    const NOW = safeAnchorNow()
    const arrival = addMinutes(NOW, -100)
    const end = addMinutes(NOW, -10)
    const DATE = localDateStr(NOW)
    const roomName = `${E2E_SERVIZIO_PREFIX}Rel-B-Room`
    const tableName = `${E2E_SERVIZIO_PREFIX}RelB-T1`
    const clientName = `${E2E_SERVIZIO_PREFIX}RelB-Cliente`

    const room = await insertRoom({ tenantId, name: roomName })
    const table = await insertTable({ tenantId, roomId: room.id, name: tableName, capacity: 2 })
    const bookingId = await insertBooking({
      tenantId,
      clientName,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: localTimeStr(arrival),
      numGuests: 2,
      confirmedStart: wallIsoAt(DATE, arrival),
      confirmedEnd: wallIsoAt(DATE, end),
    })
    await insertTableAssignment({
      tenantId,
      bookingId,
      tableId: table.id,
      serviceSlotId: slot.id,
      date: DATE,
    })

    try {
      await page.clock.install({ time: NOW })
      await openServizioMappa(page)
      await selectDateAndSlot(page, DATE, slot.id)

      const dialog = page.getByRole('dialog', { name: /fine turno/i })
      await expect(dialog).toBeVisible({ timeout: 10000 })
      const releaseRow = dialog.locator('li', { hasText: tableName })
      await releaseRow.getByRole('button', { name: 'Libero' }).click()
      await expect(dialog).not.toBeVisible()

      await expect(tableButton(page, tableName)).toHaveAccessibleName(/— Libero —/)

      const assignments = await getTableAssignmentsForBooking(bookingId)
      expect(assignments).toHaveLength(1)
      expect(assignments[0].checked_out_at).not.toBeNull()

      // Append-only: la prenotazione esiste ancora (non è stata cancellata).
      const status = await getBookingStatus(bookingId)
      expect(status).toBe('accepted')
    } finally {
      await deleteBookingsByPrefix(tenantId, clientName)
      await deleteTablesByPrefix(tenantId, tableName)
      await deleteRoomsByPrefix(tenantId, roomName)
      await deleteServiceSlotsByPrefix(tenantId, slot.name)
    }
  })

  test('"Decido dopo" chiude l\'avviso; un secondo tavolo in uscita lo fa tornare con entrambi', async ({
    page,
  }) => {
    const tenantId = await getTenantId()
    const slot = await createTempSlot(tenantId, 'RelC')
    const NOW = safeAnchorNow()
    const DATE = localDateStr(NOW)
    const roomName = `${E2E_SERVIZIO_PREFIX}Rel-C-Room`
    const tablePrefix = `${E2E_SERVIZIO_PREFIX}RelC-T`
    const table1Name = `${tablePrefix}1`
    const table2Name = `${tablePrefix}2`
    const client1Name = `${E2E_SERVIZIO_PREFIX}RelC1-Cliente`
    const client2Name = `${E2E_SERVIZIO_PREFIX}RelC2-Cliente`

    // Tavolo 1: già in uscita a NOW.
    const table1Arrival = addMinutes(NOW, -90)
    const table1End = addMinutes(NOW, -5)
    // Tavolo 2: "in ritardo" a NOW, entra in uscita 6' dopo.
    const table2Arrival = addMinutes(NOW, -30)
    const table2End = addMinutes(NOW, 5)

    const room = await insertRoom({ tenantId, name: roomName })
    const table1 = await insertTable({
      tenantId,
      roomId: room.id,
      name: table1Name,
      capacity: 2,
      positionX: 20,
      positionY: 20,
    })
    const table2 = await insertTable({
      tenantId,
      roomId: room.id,
      name: table2Name,
      capacity: 2,
      positionX: 150,
      positionY: 20,
    })

    const booking1Id = await insertBooking({
      tenantId,
      clientName: client1Name,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: localTimeStr(table1Arrival),
      numGuests: 2,
      confirmedStart: wallIsoAt(DATE, table1Arrival),
      confirmedEnd: wallIsoAt(DATE, table1End),
    })
    const booking2Id = await insertBooking({
      tenantId,
      clientName: client2Name,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: localTimeStr(table2Arrival),
      numGuests: 2,
      confirmedStart: wallIsoAt(DATE, table2Arrival),
      confirmedEnd: wallIsoAt(DATE, table2End),
    })
    await insertTableAssignment({
      tenantId,
      bookingId: booking1Id,
      tableId: table1.id,
      serviceSlotId: slot.id,
      date: DATE,
    })
    await insertTableAssignment({
      tenantId,
      bookingId: booking2Id,
      tableId: table2.id,
      serviceSlotId: slot.id,
      date: DATE,
    })

    try {
      await page.clock.install({ time: NOW })
      await openServizioMappa(page)
      await selectDateAndSlot(page, DATE, slot.id)

      const dialog = page.getByRole('dialog', { name: /fine turno/i })
      await expect(dialog).toBeVisible({ timeout: 10000 })
      await expect(dialog.locator('li')).toHaveCount(1)
      await expect(dialog).toContainText(table1Name)

      await dialog.getByRole('button', { name: 'Decido dopo' }).click()
      await expect(dialog).not.toBeVisible()

      // 6' dopo: anche il secondo tavolo entra in "In uscita" (fine turno NOW+5').
      await page.clock.fastForward(6 * 60_000)

      const dialog2 = page.getByRole('dialog', { name: /fine turno/i })
      await expect(dialog2).toBeVisible({ timeout: 10000 })
      await expect(dialog2.locator('li')).toHaveCount(2)
      await expect(dialog2).toContainText(table1Name)
      await expect(dialog2).toContainText(table2Name)
    } finally {
      await deleteBookingsByPrefix(tenantId, client1Name)
      await deleteBookingsByPrefix(tenantId, client2Name)
      await deleteTablesByPrefix(tenantId, tablePrefix)
      await deleteRoomsByPrefix(tenantId, roomName)
      await deleteServiceSlotsByPrefix(tenantId, slot.name)
    }
  })

  test('cambiare fascia azzera "Decido dopo": tornando alla fascia il tavolo in uscita riapre l\'avviso', async ({
    page,
  }) => {
    const tenantId = await getTenantId()
    const slotA = await createTempSlot(tenantId, 'RelD-A')
    const slotB = await createTempSlot(tenantId, 'RelD-B')
    const NOW = safeAnchorNow()
    const arrival = addMinutes(NOW, -90)
    const end = addMinutes(NOW, -5)
    const DATE = localDateStr(NOW)
    const runId = `${Date.now()}`
    const roomName = `${E2E_SERVIZIO_PREFIX}Rel-D-Room-${runId}`
    const tableName = `${E2E_SERVIZIO_PREFIX}RelD-T1-${runId}`
    const clientName = `${E2E_SERVIZIO_PREFIX}RelD-Cliente-${runId}`

    const room = await insertRoom({ tenantId, name: roomName })
    const table = await insertTable({ tenantId, roomId: room.id, name: tableName, capacity: 2 })
    const bookingId = await insertBooking({
      tenantId,
      clientName,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: localTimeStr(arrival),
      numGuests: 2,
      confirmedStart: wallIsoAt(DATE, arrival),
      confirmedEnd: wallIsoAt(DATE, end),
    })
    await insertTableAssignment({
      tenantId,
      bookingId,
      tableId: table.id,
      serviceSlotId: slotA.id,
      date: DATE,
    })

    try {
      await page.clock.install({ time: NOW })
      await openServizioMappa(page)
      await selectDateAndSlot(page, DATE, slotA.id)

      const dialog = page.getByRole('dialog', { name: /fine turno/i })
      await expect(dialog).toBeVisible({ timeout: 10000 })
      await expect(dialog).toContainText(tableName)

      await dialog.getByRole('button', { name: 'Decido dopo' }).click()
      await expect(dialog).not.toBeVisible()

      await page.getByLabel('Fascia oraria', { exact: true }).selectOption(slotB.id)
      await expect(dialog).not.toBeVisible()

      await page.getByLabel('Fascia oraria', { exact: true }).selectOption(slotA.id)
      await expect(dialog).toBeVisible({ timeout: 10000 })
      await expect(dialog).toContainText(tableName)
    } finally {
      await deleteBookingsByPrefix(tenantId, clientName)
      await deleteTablesByPrefix(tenantId, tableName)
      await deleteRoomsByPrefix(tenantId, roomName)
      await deleteServiceSlotsByPrefix(tenantId, slotA.name)
      await deleteServiceSlotsByPrefix(tenantId, slotB.name)
    }
  })
})

// ─────────────────────────────────────────────
// 2. Tavolata su più tavoli (checklist §2.3 + §9.6 archiviazione all'ultimo tavolo)
// ─────────────────────────────────────────────

test.describe('Tavolata su più tavoli', () => {
  test('assegnazione multi-select + liberazione parziale + archiviazione solo all\'ultimo tavolo', async ({
    page,
  }) => {
    const tenantId = await getTenantId()
    const slot = await createTempSlot(tenantId, 'Multi')
    // Nessuna manipolazione del clock in questo scenario: non serve pilotare il
    // tempo, solo assegnare/liberare tavoli. Data fissa nel futuro (nessuna
    // prenotazione reale la occupa) per non dipendere dal giorno di esecuzione.
    const DATE = offsetIsoDate(120)
    const roomName = `${E2E_SERVIZIO_PREFIX}Multi-Room`
    const tablePrefix = `${E2E_SERVIZIO_PREFIX}Multi-T`
    const table1Name = `${tablePrefix}1`
    const table2Name = `${tablePrefix}2`
    const clientName = `${E2E_SERVIZIO_PREFIX}Multi-Tavolata`

    const room = await insertRoom({ tenantId, name: roomName })
    const table1 = await insertTable({
      tenantId,
      roomId: room.id,
      name: table1Name,
      capacity: 5,
      positionX: 20,
      positionY: 20,
    })
    const table2 = await insertTable({
      tenantId,
      roomId: room.id,
      name: table2Name,
      capacity: 5,
      positionX: 150,
      positionY: 20,
    })
    const bookingId = await insertBooking({
      tenantId,
      clientName,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: '20:00', // dentro la finestra 00:00–23:59 della fascia temporanea
      numGuests: 10,
    })

    try {
      await openServizioMappa(page)
      await selectDateAndSlot(page, DATE, slot.id)

      await expect(page.getByText('Prenotazioni (1)', { exact: true })).toBeVisible({ timeout: 10000 })
      // exact:true — dnd-kit rende l'intera card trascinabile con role="button" e
      // nome accessibile "da-content" (include il testo del bottone interno
      // "Assegna"), quindi un match a sottostringa risolverebbe a due elementi.
      await page.getByRole('button', { name: 'Assegna', exact: true }).click()

      const assignDialog = page.getByRole('dialog', { name: /^Assegna tavolo$/ })
      await expect(assignDialog).toBeVisible({ timeout: 10000 })
      await assignDialog.locator('button', { hasText: table1Name }).click()
      await assignDialog.locator('button', { hasText: table2Name }).click()
      await expect(
        assignDialog.getByText('Selezionati 2 tavoli · 10 posti su 10 richiesti', { exact: true }),
      ).toBeVisible()

      await assignDialog.getByRole('button', { name: 'Assegna 2 tavoli' }).click()
      await expect(assignDialog).not.toBeVisible()

      await expect(page.getByText('Prenotazioni (0)', { exact: true })).toBeVisible()
      await expect(page.getByText('Assegnate (1)', { exact: true })).toBeVisible()

      // Espande la card per verificare che entrambi i tavoli siano nella stessa riga.
      await page.getByRole('button', { name: `Tavoli di ${clientName}` }).click()
      await expect(
        page.getByText(`${roomName} · Tavolo ${table1Name} · 5 posti`, { exact: true }),
      ).toBeVisible()
      await expect(
        page.getByText(`${roomName} · Tavolo ${table2Name} · 5 posti`, { exact: true }),
      ).toBeVisible()

      // Piantina: entrambi i tavoli occupati dalla stessa prenotazione.
      await expect(tableButton(page, table1Name)).toHaveAccessibleName(new RegExp(clientName))
      await expect(tableButton(page, table2Name)).toHaveAccessibleName(new RegExp(clientName))

      // Libera il primo tavolo dalla piantina.
      await tableButton(page, table1Name).click()
      const detailDialog1 = page.getByRole('dialog', { name: table1Name })
      await expect(detailDialog1).toBeVisible()
      await detailDialog1.getByRole('button', { name: /Libera tavolo/ }).click()
      await expect(detailDialog1).not.toBeVisible()

      await expect(tableButton(page, table1Name)).toHaveAccessibleName(/— Libero —/)
      await expect(tableButton(page, table2Name)).toHaveAccessibleName(new RegExp(clientName))

      let assignments = await getTableAssignmentsForBooking(bookingId)
      const t1Assignment = assignments.find((a) => a.table_id === table1.id)
      const t2Assignment = assignments.find((a) => a.table_id === table2.id)
      expect(t1Assignment?.checked_out_at).not.toBeNull()
      expect(t2Assignment?.checked_out_at).toBeNull()
      // S4-REQ-3: resta un tavolo attivo → NON ancora archiviata.
      expect(await getBookingServedAt(bookingId)).toBeNull()

      // Libera anche il secondo tavolo: ora sì, archiviata (served_at valorizzato).
      await tableButton(page, table2Name).click()
      const detailDialog2 = page.getByRole('dialog', { name: table2Name })
      await expect(detailDialog2).toBeVisible()
      await detailDialog2.getByRole('button', { name: /Libera tavolo/ }).click()
      await expect(detailDialog2).not.toBeVisible()

      // Il click chiude il modale in modo ottimistico (setPlanDetailTableId(null)
      // è sincrono), la mutation di checkout è asincrona: aspetta che la piantina
      // rifletta "Libero" (segno che l'onSuccess ha già rifatto il refetch) prima
      // di leggere lo stato via REST, altrimenti si rischia una lettura in corsa.
      await expect(tableButton(page, table2Name)).toHaveAccessibleName(/— Libero —/)

      assignments = await getTableAssignmentsForBooking(bookingId)
      expect(assignments.every((a) => a.checked_out_at !== null)).toBe(true)
      expect(await getBookingServedAt(bookingId)).not.toBeNull()
    } finally {
      await deleteBookingsByPrefix(tenantId, clientName)
      await deleteTablesByPrefix(tenantId, tablePrefix)
      await deleteRoomsByPrefix(tenantId, roomName)
      await deleteServiceSlotsByPrefix(tenantId, slot.name)
    }
  })
})

// ─────────────────────────────────────────────
// 3. Stati del tavolo in sequenza (checklist §3)
// ─────────────────────────────────────────────

test.describe('Stati del tavolo in sequenza', () => {
  test('In arrivo → Occupato → In ritardo → In uscita, pilotato con page.clock', async ({ page }) => {
    const tenantId = await getTenantId()
    const slot = await createTempSlot(tenantId, 'States')
    const lateThresholdMinutes = await getLateThresholdMinutes(tenantId)
    const NOW = safeAnchorNow()
    const DATE = localDateStr(NOW)
    const arrival = addMinutes(NOW, 5)
    // Finestra "in ritardo" di 6' dopo la soglia, prima di finire il pasto.
    const end = addMinutes(arrival, lateThresholdMinutes + 6)
    const roomName = `${E2E_SERVIZIO_PREFIX}States-Room`
    const tableName = `${E2E_SERVIZIO_PREFIX}States-T1`
    const clientName = `${E2E_SERVIZIO_PREFIX}States-Cliente`

    const room = await insertRoom({ tenantId, name: roomName })
    const table = await insertTable({ tenantId, roomId: room.id, name: tableName, capacity: 4 })
    const bookingId = await insertBooking({
      tenantId,
      clientName,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: localTimeStr(arrival),
      numGuests: 4,
      confirmedStart: wallIsoAt(DATE, arrival),
      confirmedEnd: wallIsoAt(DATE, end),
    })
    await insertTableAssignment({
      tenantId,
      bookingId,
      tableId: table.id,
      serviceSlotId: slot.id,
      date: DATE,
    })

    try {
      await page.clock.install({ time: NOW })
      await openServizioMappa(page)
      await selectDateAndSlot(page, DATE, slot.id)

      const tableEl = tableButton(page, tableName)
      await expect(tableEl).toHaveAccessibleName(/— In arrivo —/)

      // Oltre l'orario di arrivo (NOW+5'), ancora entro la soglia di ritardo → Occupato.
      await page.clock.fastForward(6 * 60_000) // NOW+6'
      await expect(tableEl).toHaveAccessibleName(/— Occupato —/)

      // Oltre la soglia di ritardo (arrivo + soglia) → In ritardo.
      await page.clock.fastForward(lateThresholdMinutes * 60_000) // NOW+6'+soglia
      await expect(tableEl).toHaveAccessibleName(/— In ritardo —/)

      // Oltre fine pasto (arrivo + soglia + 6') → In uscita, e riparte l'avviso della sezione 1.
      await page.clock.fastForward(8 * 60_000) // supera "end" con margine
      await expect(tableEl).toHaveAccessibleName(/— In uscita —/)
      await expect(page.getByRole('dialog', { name: /fine turno/i })).toBeVisible({ timeout: 10000 })
    } finally {
      await deleteBookingsByPrefix(tenantId, clientName)
      await deleteTablesByPrefix(tenantId, tableName)
      await deleteRoomsByPrefix(tenantId, roomName)
      await deleteServiceSlotsByPrefix(tenantId, slot.name)
    }
  })

  test('la vista Lista non mostra occupazione/stato live per tavolo (unico posto è la piantina)', async ({
    page,
  }) => {
    // Lettura codice (ServizioPage.tsx, componente TableCard): la tab "Lista"
    // rende solo nome+capienza del tavolo, senza badge di stato né occupante —
    // l'unico punto dell'app che mostra i 5 stati live è la piantina "Servizio"
    // (coperta dal test sopra). Il layout="grid" di AssignmentMapPanel (che
    // avrebbe badge di stato) non è mai montato da ServizioPage in produzione,
    // solo nei test component-level. Verificato qui a video, non solo a codice.
    const tenantId = await getTenantId()
    const slot = await createTempSlot(tenantId, 'States2')
    const NOW = safeAnchorNow()
    const DATE = localDateStr(NOW)
    const arrival = addMinutes(NOW, 5)
    const end = addMinutes(arrival, 30)
    const roomName = `${E2E_SERVIZIO_PREFIX}States2-Room`
    const tableName = `${E2E_SERVIZIO_PREFIX}States2-T1`
    const clientName = `${E2E_SERVIZIO_PREFIX}States2-Cliente`
    const room = await insertRoom({ tenantId, name: roomName })
    const table = await insertTable({ tenantId, roomId: room.id, name: tableName, capacity: 4 })
    const bookingId = await insertBooking({
      tenantId,
      clientName,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: localTimeStr(arrival),
      numGuests: 4,
      confirmedStart: wallIsoAt(DATE, arrival),
      confirmedEnd: wallIsoAt(DATE, end),
    })
    await insertTableAssignment({
      tenantId,
      bookingId,
      tableId: table.id,
      serviceSlotId: slot.id,
      date: DATE,
    })

    try {
      await loginAsProAdmin(page)
      await sidebarNav(page).getByRole('button', { name: /servizio/i }).click()
      await expect(page.getByRole('heading', { name: /^Servizio$/i })).toBeVisible({ timeout: 10000 })
      // viewMode di default è "Lista": il tavolo compare, ma senza traccia dell'occupante.
      await expect(page.getByText(tableName, { exact: true })).toBeVisible({ timeout: 10000 })
      await expect(page.getByText(clientName)).toHaveCount(0)
    } finally {
      await deleteBookingsByPrefix(tenantId, clientName)
      await deleteTablesByPrefix(tenantId, tableName)
      await deleteRoomsByPrefix(tenantId, roomName)
      await deleteServiceSlotsByPrefix(tenantId, slot.name)
    }
  })
})

// ─────────────────────────────────────────────
// 4. Responsive 375px — finestra fine turno (checklist §9, ultima riga)
// ─────────────────────────────────────────────

test.describe('Responsive 375px', () => {
  test('i pulsanti Libero / Ancora occupato restano dentro lo schermo', async ({ page }) => {
    const tenantId = await getTenantId()
    const slot = await createTempSlot(tenantId, 'Resp')
    const NOW = safeAnchorNow()
    const arrival = addMinutes(NOW, -90)
    const end = addMinutes(NOW, -5)
    const DATE = localDateStr(NOW)
    const roomName = `${E2E_SERVIZIO_PREFIX}Resp-Room`
    const tableName = `${E2E_SERVIZIO_PREFIX}Resp-T1`
    const clientName = `${E2E_SERVIZIO_PREFIX}Resp-Cliente`

    const room = await insertRoom({ tenantId, name: roomName })
    const table = await insertTable({ tenantId, roomId: room.id, name: tableName, capacity: 4 })
    const bookingId = await insertBooking({
      tenantId,
      clientName,
      status: 'accepted',
      desiredDate: DATE,
      desiredTime: localTimeStr(arrival),
      numGuests: 4,
      confirmedStart: wallIsoAt(DATE, arrival),
      confirmedEnd: wallIsoAt(DATE, end),
    })
    await insertTableAssignment({
      tenantId,
      bookingId,
      tableId: table.id,
      serviceSlotId: slot.id,
      date: DATE,
    })

    try {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.clock.install({ time: NOW })
      await openServizioMappa(page)
      await selectDateAndSlot(page, DATE, slot.id)

      const dialog = page.getByRole('dialog', { name: /fine turno/i })
      await expect(dialog).toBeVisible({ timeout: 10000 })
      const releaseRow = dialog.locator('li', { hasText: tableName })

      const libero = releaseRow.getByRole('button', { name: 'Libero' })
      const ancoraOccupato = releaseRow.getByRole('button', { name: 'Ancora occupato' })
      await expect(libero).toBeVisible()
      await expect(ancoraOccupato).toBeVisible()

      const liberoBox = await libero.boundingBox()
      const ancoraBox = await ancoraOccupato.boundingBox()
      expect(liberoBox).not.toBeNull()
      expect(ancoraBox).not.toBeNull()
      expect(liberoBox!.x).toBeGreaterThanOrEqual(0)
      expect(liberoBox!.x + liberoBox!.width).toBeLessThanOrEqual(375 + 1)
      expect(ancoraBox!.x).toBeGreaterThanOrEqual(0)
      expect(ancoraBox!.x + ancoraBox!.width).toBeLessThanOrEqual(375 + 1)
    } finally {
      await deleteBookingsByPrefix(tenantId, clientName)
      await deleteTablesByPrefix(tenantId, tableName)
      await deleteRoomsByPrefix(tenantId, roomName)
      await deleteServiceSlotsByPrefix(tenantId, slot.name)
    }
  })
})
