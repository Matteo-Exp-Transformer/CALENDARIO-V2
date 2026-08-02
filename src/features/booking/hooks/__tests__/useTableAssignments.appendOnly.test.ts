/**
 * Test WP-B3 S4: checkout append-only (D48)
 *
 * Verifica che useCheckoutTable e useReleaseBookingAssignment non eseguano
 * mai un DELETE fisico su booking_table_assignments, ma solo UPDATE checked_out_at.
 *
 * Approccio: estraiamo e testiamo direttamente la mutationFn che contiene la logica
 * DB, senza dover montare un QueryClientProvider. I mock intercettano il client
 * Supabase per tracciare DELETE vs UPDATE.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Stato condiviso per intercettare le chiamate Supabase ─────────────────

const dbCalls = vi.hoisted(() => ({
  deleteCount: 0,
  updateCount: 0,
  insertCount: 0,
  lastUpdatePayload: null as unknown,
  lastInsertPayload: null as unknown,
  updateError: null as null | Error,
}))

// ─── Mock Supabase ─────────────────────────────────────────────────────────
// Il client viene intercettato per tracciare DELETE vs UPDATE.
// La catena fluente è thennable per supportare i pattern await della mutationFn.

vi.mock('@/lib/supabase', () => {
  function makeChain(error: null | Error = null) {
    const result = { error }
    const chain: Record<string, unknown> = {}

    chain.update = (payload: unknown) => {
      dbCalls.updateCount++
      dbCalls.lastUpdatePayload = payload
      return chain
    }
    chain.delete = () => {
      dbCalls.deleteCount++
      return chain
    }
    chain.insert = (payload: unknown) => {
      dbCalls.insertCount++
      dbCalls.lastInsertPayload = payload
      return chain
    }
    chain.eq = () => chain
    chain.select = () => chain
    chain.single = () => Promise.resolve({ data: { id: 'forced-assignment' }, ...result })
    // Rende la catena awaitable (pattern senza .single())
    Object.defineProperty(chain, 'then', {
      get() {
        return (resolve: (v: unknown) => void) => resolve(result)
      },
    })

    return chain
  }

  return {
    supabase: {
      from: () => makeChain(dbCalls.updateError),
    },
  }
})

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: () => ({ tenantId: 'tenant-1' }),
}))

// Mock completo di react-query per evitare la necessità di un QueryClientProvider
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

// Import DOPO i mock
import {
  useCheckoutTable,
  useForceReplaceBookingOnTable,
  useReleaseBookingAssignment,
} from '../useTableAssignments'
import type { BookingTableAssignment } from '../useTableAssignments'

// ─── Helpers ───────────────────────────────────────────────────────────────

function makeAssignment(overrides?: Partial<BookingTableAssignment>): BookingTableAssignment {
  return {
    id: 'a1',
    tenant_id: 'tenant-1',
    booking_id: 'b1',
    table_id: 'table-1',
    service_slot_id: 'slot-1',
    turn_number: 1,
    checked_out_at: null,
    date: '2026-06-24',
    created_at: '',
    ...overrides,
  }
}

// ─── useCheckoutTable — append-only ───────────────────────────────────────

describe('useCheckoutTable — append-only (D48)', () => {
  beforeEach(() => {
    dbCalls.deleteCount = 0
    dbCalls.updateCount = 0
    dbCalls.insertCount = 0
    dbCalls.lastUpdatePayload = null
    dbCalls.lastInsertPayload = null
    dbCalls.updateError = null
  })

  it('checkout senza turno successivo → UPDATE checked_out_at, mai DELETE', async () => {
    // Con il mock di useMutation, mutateAsync chiama direttamente mutationFn
    const hook = useCheckoutTable()

    await hook.mutateAsync({
      tableId: 'table-1',
      slotId: 'slot-1',
      date: '2026-06-24',
      assignments: [makeAssignment()],
    })

    expect(dbCalls.deleteCount).toBe(0)
    expect(dbCalls.updateCount).toBeGreaterThanOrEqual(1)
    expect(dbCalls.lastUpdatePayload).toMatchObject({ checked_out_at: expect.any(String) })
  })

  it('checkout con turno successivo in attesa → UPDATE checked_out_at, mai DELETE', async () => {
    const turn1 = makeAssignment({ id: 'a1', turn_number: 1, booking_id: 'b1' })
    const turn2 = makeAssignment({ id: 'a2', turn_number: 2, booking_id: 'b2' })

    const hook = useCheckoutTable()
    await hook.mutateAsync({
      tableId: 'table-1',
      slotId: 'slot-1',
      date: '2026-06-24',
      assignments: [turn1, turn2],
    })

    expect(dbCalls.deleteCount).toBe(0)
    expect(dbCalls.updateCount).toBeGreaterThanOrEqual(1)
    expect(dbCalls.lastUpdatePayload).toMatchObject({ checked_out_at: expect.any(String) })
  })
})

// ─── useReleaseBookingAssignment — append-only ─────────────────────────────

describe('useReleaseBookingAssignment — append-only (D48)', () => {
  beforeEach(() => {
    dbCalls.deleteCount = 0
    dbCalls.updateCount = 0
    dbCalls.insertCount = 0
    dbCalls.lastUpdatePayload = null
    dbCalls.lastInsertPayload = null
    dbCalls.updateError = null
  })

  it('release senza turno successivo → UPDATE checked_out_at, mai DELETE', async () => {
    const hook = useReleaseBookingAssignment()

    const result = await hook.mutateAsync({
      bookingId: 'b1',
      slotId: 'slot-1',
      date: '2026-06-24',
      assignments: [makeAssignment()],
    })

    expect(result).toBeNull()
    expect(dbCalls.deleteCount).toBe(0)
    expect(dbCalls.updateCount).toBeGreaterThanOrEqual(1)
    expect(dbCalls.lastUpdatePayload).toMatchObject({ checked_out_at: expect.any(String) })
  })

  it('release con turno successivo → blocked: waiting_next_turn, nessuna operazione DB', async () => {
    const turn1 = makeAssignment({ id: 'a1', turn_number: 1, booking_id: 'b1' })
    const turn2 = makeAssignment({ id: 'a2', turn_number: 2, booking_id: 'b2' })

    const hook = useReleaseBookingAssignment()
    const result = await hook.mutateAsync({
      bookingId: 'b1',
      slotId: 'slot-1',
      date: '2026-06-24',
      assignments: [turn1, turn2],
    })

    expect(result).toEqual({ blocked: 'waiting_next_turn' })
    expect(dbCalls.deleteCount).toBe(0)
    expect(dbCalls.updateCount).toBe(0)
  })
})

// ─── useForceReplaceBookingOnTable — append-only ───────────────────────────

describe('useForceReplaceBookingOnTable — libera e assegna append-only (D25/D48)', () => {
  beforeEach(() => {
    dbCalls.deleteCount = 0
    dbCalls.updateCount = 0
    dbCalls.insertCount = 0
    dbCalls.lastUpdatePayload = null
    dbCalls.lastInsertPayload = null
    dbCalls.updateError = null
  })

  it('forzatura guidata → UPDATE del turno attivo + INSERT audit, mai DELETE', async () => {
    const hook = useForceReplaceBookingOnTable()

    await hook.mutateAsync({
      bookingId: 'b-new',
      tableId: 'table-1',
      slotId: 'slot-1',
      date: '2026-06-24',
      maxTurns: 1,
      existingAssignments: [makeAssignment({ id: 'a-old', booking_id: 'b-old' })],
      reason: 'Forzatura guidata test',
    })

    expect(dbCalls.deleteCount).toBe(0)
    expect(dbCalls.updateCount).toBeGreaterThanOrEqual(1)
    expect(dbCalls.insertCount).toBe(1)
    expect(dbCalls.lastUpdatePayload).toMatchObject({ checked_out_at: expect.any(String) })
    expect(dbCalls.lastInsertPayload).toMatchObject({
      booking_id: 'b-new',
      table_id: 'table-1',
      forced_by_admin: true,
      force_reason: 'Forzatura guidata test',
    })
  })
})
