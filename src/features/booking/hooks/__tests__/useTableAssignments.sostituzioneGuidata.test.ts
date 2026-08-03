/**
 * S4-FIX-5 — sostituzione guidata su tavolo occupato.
 *
 * `useForceReplaceBookingOnTable` prende un `outcome: 'move' | 'archive' | 'requeue'`
 * per chi è già seduto sul tavolo conteso. Un caso per esito (piano §4, tabella §3):
 *
 *  esito     | riga sul tavolo conteso        | served_at del trasferito | turno consumato
 *  ----------|--------------------------------|---------------------------|------------------
 *  move      | DELETE + insert su nuovo tavolo | resta null                | no
 *  archive   | UPDATE checked_out_at           | valorizzato (se libero)   | sì
 *  requeue   | DELETE                          | resta null                | no
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

interface OpLogEntry {
  op: 'insert' | 'update' | 'delete'
  table: string
  payload?: unknown
  match?: Record<string, string>
}

const dbState = vi.hoisted(() => ({
  opLog: [] as OpLogEntry[],
  nextInsertId: 0,
}))

vi.mock('@/lib/supabase', () => {
  function makeChain(table: string) {
    const chain: Record<string, unknown> = {}

    function pushOp(op: OpLogEntry['op'], payload?: unknown) {
      const entry: OpLogEntry = { op, table, payload }
      dbState.opLog.push(entry)
      return entry
    }

    let currentEntry: OpLogEntry | null = null

    chain.insert = (payload: unknown) => {
      currentEntry = pushOp('insert', payload)
      return chain
    }
    chain.update = (payload: unknown) => {
      currentEntry = pushOp('update', payload)
      return chain
    }
    chain.delete = () => {
      currentEntry = pushOp('delete')
      return chain
    }
    chain.eq = (col: string, value: string) => {
      if (currentEntry) {
        currentEntry.match = { ...(currentEntry.match ?? {}), [col]: value }
      }
      return chain
    }
    chain.select = () => chain
    chain.single = () => {
      dbState.nextInsertId++
      return Promise.resolve({ data: { id: `assignment-${dbState.nextInsertId}` }, error: null })
    }
    Object.defineProperty(chain, 'then', {
      get() {
        return (resolve: (v: unknown) => void) => resolve({ error: null })
      },
    })
    return chain
  }

  return {
    supabase: {
      from: (table: string) => makeChain(table),
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

import { useForceReplaceBookingOnTable } from '../useTableAssignments'
import type { BookingTableAssignment } from '../useTableAssignments'

function makeAssignment(overrides?: Partial<BookingTableAssignment>): BookingTableAssignment {
  return {
    id: 'a1',
    tenant_id: 'tenant-1',
    booking_id: 'b1',
    table_id: 'table-conteso',
    service_slot_id: 'slot-1',
    turn_number: 1,
    checked_out_at: null,
    date: '2026-08-02',
    created_at: '',
    release_notice_handled_at: null,
    ...overrides,
  }
}

function assignmentOps() {
  return dbState.opLog.filter((o) => o.table === 'booking_table_assignments')
}

function servedAtUpdateFor(bookingId: string) {
  return dbState.opLog.find(
    (o) => o.table === 'booking_requests' && o.op === 'update' && o.match?.id === bookingId,
  )
}

describe('S4-FIX-5 — useForceReplaceBookingOnTable, tre esiti', () => {
  beforeEach(() => {
    dbState.opLog = []
    dbState.nextInsertId = 0
  })

  it('move — insert(destinazione) → delete(conteso) → insert(conteso), nell\'ordine; served_at del trasferito non toccato', async () => {
    const hook = useForceReplaceBookingOnTable()
    const oldAssignment = makeAssignment({ id: 'a-old', booking_id: 'b-old', turn_number: 2 })

    await hook.mutateAsync({
      bookingId: 'b-new',
      tableId: 'table-conteso',
      slotId: 'slot-1',
      date: '2026-08-02',
      maxTurns: 3,
      existingAssignments: [oldAssignment],
      reason: 'Sposta Bianchi',
      outcome: 'move',
      targetTableId: 'table-libero',
    })

    const ops = assignmentOps()
    expect(ops.map((o) => o.op)).toEqual(['insert', 'delete', 'insert'])

    // 1. la prenotazione scavalcata si sposta sul tavolo libero — nuovo turno LÌ (1, tavolo vuoto)
    expect(ops[0].payload).toMatchObject({
      booking_id: 'b-old',
      table_id: 'table-libero',
      turn_number: 1,
      forced_by_admin: true,
    })

    // 2. la sua riga sul tavolo conteso sparisce (DELETE, non UPDATE)
    expect(ops[1].match).toMatchObject({ id: 'a-old' })

    // 3. la prenotazione nuova prende il tavolo conteso — turno 3 (dopo il turno 2 già usato lì)
    expect(ops[2].payload).toMatchObject({
      booking_id: 'b-new',
      table_id: 'table-conteso',
      turn_number: 3,
      forced_by_admin: true,
    })

    // Il trasferito non è mai stato archiviato: solo la NUOVA prenotazione ha un
    // update su booking_requests (clearBookingServedAt → served_at: null).
    const bookingUpdates = dbState.opLog.filter((o) => o.table === 'booking_requests' && o.op === 'update')
    expect(bookingUpdates).toHaveLength(1)
    expect(bookingUpdates[0].match).toMatchObject({ id: 'b-new' })
    expect(servedAtUpdateFor('b-old')).toBeUndefined()
  })

  it('move senza targetTableId → errore, nessuna scrittura sul DB', async () => {
    const hook = useForceReplaceBookingOnTable()
    const oldAssignment = makeAssignment({ id: 'a-old', booking_id: 'b-old' })

    await expect(
      hook.mutateAsync({
        bookingId: 'b-new',
        tableId: 'table-conteso',
        slotId: 'slot-1',
        date: '2026-08-02',
        maxTurns: 3,
        existingAssignments: [oldAssignment],
        reason: '',
        outcome: 'move',
      }),
    ).rejects.toThrow()

    expect(dbState.opLog).toHaveLength(0)
  })

  it('archive — UPDATE checked_out_at sul conteso + served_at valorizzato (nessun altro tavolo attivo)', async () => {
    const hook = useForceReplaceBookingOnTable()
    const oldAssignment = makeAssignment({ id: 'a-old', booking_id: 'b-old' })

    await hook.mutateAsync({
      bookingId: 'b-new',
      tableId: 'table-conteso',
      slotId: 'slot-1',
      date: '2026-08-02',
      maxTurns: 3,
      existingAssignments: [oldAssignment],
      reason: 'Bianchi ha finito',
      outcome: 'archive',
    })

    const ops = assignmentOps()
    expect(ops.map((o) => o.op)).toEqual(['update', 'insert'])
    expect(ops[0].match).toMatchObject({ id: 'a-old' })
    expect(ops[0].payload).toMatchObject({ checked_out_at: expect.any(String) })

    const served = servedAtUpdateFor('b-old')
    expect(served?.payload).toMatchObject({ served_at: expect.any(String) })
  })

  it('archive — NON marca served_at se restano altri tavoli attivi sulla stessa prenotazione (tavolata)', async () => {
    const hook = useForceReplaceBookingOnTable()
    const oldAssignment = makeAssignment({ id: 'a-old', booking_id: 'b-old' })
    const otherActiveTable = makeAssignment({ id: 'a-other', booking_id: 'b-old', table_id: 'table-altro' })

    await hook.mutateAsync({
      bookingId: 'b-new',
      tableId: 'table-conteso',
      slotId: 'slot-1',
      date: '2026-08-02',
      maxTurns: 3,
      existingAssignments: [oldAssignment, otherActiveTable],
      reason: 'Bianchi ha finito',
      outcome: 'archive',
    })

    expect(servedAtUpdateFor('b-old')).toBeUndefined()
  })

  it('requeue — DELETE della riga scavalcata (non UPDATE), served_at non toccato', async () => {
    const hook = useForceReplaceBookingOnTable()
    const oldAssignment = makeAssignment({ id: 'a-old', booking_id: 'b-old' })

    await hook.mutateAsync({
      bookingId: 'b-new',
      tableId: 'table-conteso',
      slotId: 'slot-1',
      date: '2026-08-02',
      maxTurns: 3,
      existingAssignments: [oldAssignment],
      reason: 'Bianchi torna in attesa',
      outcome: 'requeue',
    })

    const ops = assignmentOps()
    expect(ops.map((o) => o.op)).toEqual(['delete', 'insert'])
    expect(ops[0].match).toMatchObject({ id: 'a-old' })
    expect(servedAtUpdateFor('b-old')).toBeUndefined()
  })
})
