/**
 * FIX-2 S4 — archiviazione al checkout (S4-REQ-3), undo DELETE, fascia chiusa.
 *
 * Quattro casi served_at + annullamento che non consuma turno.
 * Devono fallire sul codice pre-fix e passare dopo.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

const dbCalls = vi.hoisted(() => ({
  deleteCount: 0,
  updateCount: 0,
  insertCount: 0,
  updatePayloads: [] as unknown[],
  lastInsertPayload: null as unknown,
  fromTables: [] as string[],
  updateError: null as null | Error,
  /** Errore mirato a una sola tabella (es. colonna served_at mancante). */
  errorByTable: {} as Record<string, Error>,
}))

vi.mock('@/lib/supabase', () => {
  function makeChain(table: string, error: null | Error = null) {
    const result = { error }
    const chain: Record<string, unknown> = {}

    chain.update = (payload: unknown) => {
      dbCalls.updateCount++
      dbCalls.updatePayloads.push({ table, payload })
      return chain
    }
    chain.delete = () => {
      dbCalls.deleteCount++
      dbCalls.fromTables.push(`delete:${table}`)
      return chain
    }
    chain.insert = (payload: unknown) => {
      dbCalls.insertCount++
      dbCalls.lastInsertPayload = payload
      return chain
    }
    chain.eq = () => chain
    chain.in = () => chain
    chain.select = () => chain
    chain.single = () => Promise.resolve({ data: { id: 'new-assignment' }, ...result })
    Object.defineProperty(chain, 'then', {
      get() {
        return (resolve: (v: unknown) => void) => resolve(result)
      },
    })
    return chain
  }

  return {
    supabase: {
      from: (table: string) => {
        dbCalls.fromTables.push(table)
        return makeChain(table, dbCalls.errorByTable[table] ?? dbCalls.updateError)
      },
    },
  }
})

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: () => ({ tenantId: 'tenant-1' }),
}))

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
    refetchQueries: vi.fn().mockResolvedValue(undefined),
  }),
  useMutation: (opts: { mutationFn: (...args: unknown[]) => unknown }) => ({
    mutateAsync: opts.mutationFn,
    isPending: false,
  }),
  useQuery: () => ({ data: undefined }),
}))

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

import {
  useCheckoutTable,
  useForceReplaceBookingOnTable,
  useReleaseBookingAssignment,
  useUndoTableAssignment,
  useAssignBookingToTable,
  FasciaChiusaError,
  TurniEsauritiError,
} from '../useTableAssignments'
import type { BookingTableAssignment } from '../useTableAssignments'
import { filterUnassignedBookingsForSlot } from '../../utils/unassignedBookingsFilter'
import { countTurnsUsed } from '../../utils/tableTurnLimits'
import type { BookingRequest } from '@/types/booking'

function makeAssignment(overrides?: Partial<BookingTableAssignment>): BookingTableAssignment {
  return {
    id: 'a1',
    tenant_id: 'tenant-1',
    booking_id: 'b1',
    table_id: 'table-1',
    service_slot_id: 'slot-1',
    turn_number: 1,
    checked_out_at: null,
    date: '2026-08-02',
    created_at: '',
    release_notice_handled_at: null,
    ...overrides,
  }
}

function makeBooking(overrides?: Partial<BookingRequest>): BookingRequest {
  return {
    id: 'b1',
    created_at: '',
    updated_at: '',
    client_name: 'Rossi',
    client_email: 'r@test.it',
    event_type: 'cena',
    desired_date: '2026-08-02',
    num_guests: 2,
    status: 'accepted',
    tenant_id: 'tenant-1',
    confirmed_start: '2026-08-02T12:00:00+00:00',
    ...overrides,
  }
}

function updatesFor(table: string) {
  return dbCalls.updatePayloads.filter((u) => (u as { table: string }).table === table)
}

describe('FIX-2 — archiviazione e undo', () => {
  beforeEach(() => {
    dbCalls.deleteCount = 0
    dbCalls.updateCount = 0
    dbCalls.insertCount = 0
    dbCalls.updatePayloads = []
    dbCalls.lastInsertPayload = null
    dbCalls.fromTables = []
    dbCalls.updateError = null
    dbCalls.errorByTable = {}
  })

  // ── Caso 1: checkout normale → ARCHIVIA ───────────────────────────────
  it('1. checkout normale → marca served_at sulla prenotazione', async () => {
    const hook = useCheckoutTable()
    await hook.mutateAsync({
      tableId: 'table-1',
      slotId: 'slot-1',
      date: '2026-08-02',
      assignments: [makeAssignment()],
    })

    const bookingUpdates = updatesFor('booking_requests')
    expect(bookingUpdates).toHaveLength(1)
    expect((bookingUpdates[0] as { payload: { served_at: string } }).payload.served_at).toEqual(
      expect.any(String),
    )
  })

  it('1c. se l\'archiviazione fallisce il tavolo resta liberato (nessun throw)', async () => {
    // Scenario reale: migrazione 066 non applicata → PGRST204 «served_at non esiste».
    // Il checked_out_at è già scritto: fallire qui lascerebbe la mappa disallineata.
    dbCalls.errorByTable.booking_requests = new Error(
      "Could not find the 'served_at' column of 'booking_requests' in the schema cache",
    )

    const hook = useCheckoutTable()
    const result = await hook.mutateAsync({
      tableId: 'table-1',
      slotId: 'slot-1',
      date: '2026-08-02',
      assignments: [makeAssignment()],
    })

    expect(result).toEqual({ archived: false })
    expect(updatesFor('booking_table_assignments')).toHaveLength(1)
  })

  it('1b. prenotazione con served_at esce dal cassetto da assegnare', () => {
    const served = makeBooking({ served_at: '2026-08-02T14:00:00Z' })
    const result = filterUnassignedBookingsForSlot(
      [served],
      '11:31:00',
      '15:30:00',
      new Set(),
    )
    expect(result).toHaveLength(0)
  })

  // ── Caso 2: undo → NON archivia, DELETE fisico ────────────────────────
  it('2. undo → DELETE fisico, nessun served_at', async () => {
    const hook = useUndoTableAssignment()
    await hook.mutateAsync({
      assignmentId: 'a1',
      date: '2026-08-02',
      slotId: 'slot-1',
    })

    expect(dbCalls.deleteCount).toBe(1)
    expect(updatesFor('booking_requests')).toHaveLength(0)
  })

  // ── Caso 3: force replace / release → NON archiviano ───────────────────
  it('3a. Libera e assegna (requeue) → NON marca served_at, riga scavalcata cancellata (S4-FIX-5)', async () => {
    // Prima di S4-FIX-5 questa scelta timbrava checked_out_at (UPDATE) sulla riga
    // scavalcata. Ora "torna in attesa" non ha servito un turno: la riga si
    // cancella fisicamente, stesso principio di useUndoTableAssignment — non è
    // più un UPDATE. served_at resta comunque a null: cambia la chiamata DB,
    // non l'intento del test.
    const hook = useForceReplaceBookingOnTable()
    await hook.mutateAsync({
      bookingId: 'b-new',
      tableId: 'table-1',
      slotId: 'slot-1',
      date: '2026-08-02',
      maxTurns: 2,
      existingAssignments: [makeAssignment({ id: 'a-old', booking_id: 'b-old' })],
      reason: 'test',
      outcome: 'requeue',
    })

    // DELETE fisico sulla riga scavalcata, non più UPDATE checked_out_at
    expect(dbCalls.deleteCount).toBe(1)
    const bookingServed = updatesFor('booking_requests').filter(
      (u) => (u as { payload: { served_at?: string } }).payload.served_at,
    )
    expect(bookingServed).toHaveLength(0)
  })

  it('3b. release rapida da Calendario → NON marca served_at', async () => {
    const hook = useReleaseBookingAssignment()
    await hook.mutateAsync({
      bookingId: 'b1',
      slotId: 'slot-1',
      date: '2026-08-02',
      assignments: [makeAssignment()],
    })

    expect(updatesFor('booking_requests')).toHaveLength(0)
  })

  // ── Caso 4: tavolata multi-tavolo ──────────────────────────────────────
  it('4. liberare UN tavolo di una tavolata non archivia finché resta un attivo', async () => {
    const a1 = makeAssignment({ id: 'a1', table_id: 't1', booking_id: 'b-party' })
    const a2 = makeAssignment({ id: 'a2', table_id: 't2', booking_id: 'b-party', turn_number: 1 })

    const hook = useCheckoutTable()
    await hook.mutateAsync({
      tableId: 't1',
      slotId: 'slot-1',
      date: '2026-08-02',
      assignments: [a1, a2],
    })

    expect(updatesFor('booking_requests')).toHaveLength(0)
  })

  it('4b. liberare l\'ULTIMO tavolo della tavolata → archivia', async () => {
    const a1 = makeAssignment({
      id: 'a1',
      table_id: 't1',
      booking_id: 'b-party',
      checked_out_at: '2026-08-02T13:00:00Z',
    })
    const a2 = makeAssignment({ id: 'a2', table_id: 't2', booking_id: 'b-party' })

    const hook = useCheckoutTable()
    await hook.mutateAsync({
      tableId: 't2',
      slotId: 'slot-1',
      date: '2026-08-02',
      assignments: [a1, a2],
    })

    const bookingUpdates = updatesFor('booking_requests')
    expect(bookingUpdates).toHaveLength(1)
    expect((bookingUpdates[0] as { payload: { served_at: string } }).payload.served_at).toEqual(
      expect.any(String),
    )
  })

  // ── Undo non consuma turno (verifica DELETE) ───────────────────────────
  it('annullamento → DELETE (non UPDATE checked_out_at)', async () => {
    const hook = useUndoTableAssignment()
    await hook.mutateAsync({ assignmentId: 'a1', date: '2026-08-02', slotId: 'slot-1' })
    expect(dbCalls.deleteCount).toBe(1)
    expect(dbCalls.updateCount).toBe(0)
  })

  // ── Fascia chiusa ≠ turni esauriti ─────────────────────────────────────
  it('max_turns=0 → FasciaChiusaError, non TurniEsauritiError', async () => {
    const hook = useAssignBookingToTable()
    let caught: unknown
    try {
      await hook.mutateAsync({
        bookingId: 'b1',
        tableId: 'table-1',
        slotId: 'slot-1',
        date: '2026-08-02',
        maxTurns: 0,
        existingAssignments: [],
      })
    } catch (e) {
      caught = e
    }
    expect(caught).toBeInstanceOf(FasciaChiusaError)
    expect(caught).not.toBeInstanceOf(TurniEsauritiError)
    expect((caught as Error).message).toMatch(/fascia è chiusa/i)
  })

  // ── FIX A (03-08-26, D-B/S-1) ──────────────────────────────────────────
  it('FIX A — spostamento da Calendario e "sposta" da Servizio lasciano lo stesso numero di turni residui sul tavolo di partenza', async () => {
    const dateFixA = '2026-08-03'
    const departingCalendario = makeAssignment({
      id: 'a-cal',
      table_id: 'table-1',
      booking_id: 'b-cal',
      turn_number: 1,
      date: dateFixA,
    })
    const departingServizio = makeAssignment({
      id: 'a-serv',
      table_id: 'table-1',
      booking_id: 'b-serv',
      turn_number: 1,
      date: dateFixA,
    })

    const turnsUsedBefore = countTurnsUsed([departingCalendario], 'table-1', 'slot-1', dateFixA)
    expect(turnsUsedBefore).toBe(1) // il cliente è seduto: 1 riga attiva sul tavolo di partenza

    // Percorso Calendario: "Modifica tavolo" → useReleaseBookingAssignment
    const releaseHook = useReleaseBookingAssignment()
    await releaseHook.mutateAsync({
      bookingId: 'b-cal',
      slotId: 'slot-1',
      date: dateFixA,
      assignments: [departingCalendario],
    })
    expect(dbCalls.deleteCount).toBe(1) // riga cancellata, non timbrata checked_out_at
    expect(updatesFor('booking_table_assignments')).toHaveLength(0)
    // Simula il refetch: la riga cancellata non torna più nello stato locale.
    const turnsUsedAfterCalendario = countTurnsUsed([], 'table-1', 'slot-1', dateFixA)

    dbCalls.deleteCount = 0
    dbCalls.updateCount = 0
    dbCalls.insertCount = 0
    dbCalls.updatePayloads = []

    // Percorso Servizio: sostituzione guidata su tavolo occupato → scelta "spostalo" (outcome 'move')
    const forceHook = useForceReplaceBookingOnTable()
    await forceHook.mutateAsync({
      bookingId: 'b-nuovo-occupante',
      tableId: 'table-1',
      slotId: 'slot-1',
      date: dateFixA,
      maxTurns: 2,
      existingAssignments: [departingServizio],
      reason: 'test FIX A',
      outcome: 'move',
      targetTableId: 'table-2',
    })
    // La riga del cliente scavalcato sul tavolo di PARTENZA sparisce (DELETE): il nuovo
    // occupante crea una riga nuova e distinta su table-1, qui irrilevante — il confronto
    // riguarda solo il destino della riga del cliente spostato.
    expect(dbCalls.deleteCount).toBe(1)
    const turnsUsedAfterServizio = countTurnsUsed([], 'table-1', 'slot-1', dateFixA)

    expect(turnsUsedAfterCalendario).toBe(turnsUsedAfterServizio)
    expect(turnsUsedAfterCalendario).toBe(turnsUsedBefore - 1)
  })

  it('riassegna dopo checkout → azzera served_at', async () => {
    const hook = useAssignBookingToTable()
    await hook.mutateAsync({
      bookingId: 'b1',
      tableId: 'table-1',
      slotId: 'slot-1',
      date: '2026-08-02',
      maxTurns: 2,
      existingAssignments: [],
    })

    const clears = updatesFor('booking_requests').filter(
      (u) => (u as { payload: { served_at: null } }).payload.served_at === null,
    )
    expect(clears.length).toBeGreaterThanOrEqual(1)
  })
})
