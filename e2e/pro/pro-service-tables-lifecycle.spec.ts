/**
 * @admin-blindatura: servizio
 * Copre: COLLAUDO_S4_CHECKLIST.md §2.2 (avviso fine turno con conferma),
 * §2.3 (tavolata su più tavoli + archiviazione S4-REQ-3), §3 (5 stati tavolo in
 * sequenza), §9 ultima riga (responsive 375px, finestra fine turno).
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
  insertRoom,
  insertTable,
  insertTableAssignment,
  insertBooking,
  insertServiceSlot,
  deleteServiceSlotsByPrefix,
  getTableAssignmentsForBooking,
  getBookingServedAt,
  getBookingStatus,
  deleteBookingsByPrefix,
  deleteTablesByPrefix,
  deleteRoomsByPrefix,
  offsetIsoDate,
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

async function selectDateAndSlot(page: Page, date: string, slotId: string) {
  await page.getByLabel('Data', { exact: true }).fill(date)
  await page.getByLabel('Fascia oraria', { exact: true }).selectOption(slotId)
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
