import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const { mockFrom, mockTenantId } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockTenantId: { value: 'tenant-1' as string | null },
}))

vi.mock('@/lib/supabase', () => ({
  supabase: { from: mockFrom },
}))

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: vi.fn(() => ({ tenantId: mockTenantId.value })),
}))

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}))

// date-fns/format: freeze "today" so tests don't depend on the real clock
vi.mock('date-fns', async (importOriginal) => {
  const actual = await importOriginal<typeof import('date-fns')>()
  return {
    ...actual,
    format: vi.fn((date: Date | number, fmt: string) => {
      // Only intercept the 'yyyy-MM-dd' call used for `today`
      if (fmt === 'yyyy-MM-dd') return '2026-06-24'
      return actual.format(date, fmt)
    }),
    startOfDay: vi.fn(() => new Date('2026-06-24T00:00:00.000Z')),
  }
})

import { useShiftBriefing } from '../useShiftBriefing'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

/** Build a chainable Supabase query mock that resolves to { data, error }. */
function makeQueryChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'eq', 'gte', 'lt', 'is', 'in', 'order']
  for (const m of methods) {
    chain[m] = vi.fn(() => chain)
  }
  // The final await resolves with the result
  chain.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve)
  return chain
}

// ---------------------------------------------------------------------------
// Shared fixture data
// ---------------------------------------------------------------------------

const TODAY = '2026-06-24'

const BOOKING_1 = {
  id: 'b1',
  client_name: 'Mario Rossi',
  num_guests: 2,
  confirmed_start: '2026-06-24T19:30:00.000Z',
  special_requests: null,
}

const BOOKING_2 = {
  id: 'b2',
  client_name: 'Luigi Bianchi',
  num_guests: 4,
  confirmed_start: '2026-06-24T20:00:00.000Z',
  special_requests: 'Vegan',
}

const ROOM_A = { id: 'room-a', name: 'Sala Principale', active: true }
const ROOM_B = { id: 'room-b', name: 'Sala Giardino', active: true }

const TABLE_1 = { id: 'table-1', name: 'T1', room_id: 'room-a' }
const TABLE_2 = { id: 'table-2', name: 'T2', room_id: 'room-b' }

/** Configure mockFrom to respond differently per table name. */
function setupMocks({
  bookings = [BOOKING_1],
  assignments = [{ booking_id: 'b1', table_id: 'table-1' }],
  tables = [TABLE_1],
  rooms = [ROOM_A],
}: {
  bookings?: object[]
  assignments?: object[]
  tables?: object[]
  rooms?: object[]
} = {}) {
  mockFrom.mockImplementation((tableName: string) => {
    switch (tableName) {
      case 'booking_requests':
        return makeQueryChain({ data: bookings, error: null })
      case 'booking_table_assignments':
        return makeQueryChain({ data: assignments, error: null })
      case 'tables':
        return makeQueryChain({ data: tables, error: null })
      case 'rooms':
        return makeQueryChain({ data: rooms, error: null })
      default:
        return makeQueryChain({ data: [], error: null })
    }
  })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useShiftBriefing — table/room join', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('single-room venue: populates table_name, isMultiRoom=false, room_name ignored', async () => {
    setupMocks({
      bookings: [BOOKING_1],
      assignments: [{ booking_id: 'b1', table_id: 'table-1' }],
      tables: [TABLE_1],
      rooms: [ROOM_A], // only 1 active room
    })

    const { result } = renderHook(() => useShiftBriefing('all'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const data = result.current.data!
    expect(data.isMultiRoom).toBe(false)
    expect(data.bookings).toHaveLength(1)
    expect(data.bookings[0].table_name).toBe('T1')
    // room_name is populated but modal won't show it because isMultiRoom=false
    expect(data.bookings[0].room_name).toBe('Sala Principale')
  })

  it('multi-room venue: isMultiRoom=true, room_name populated for assigned booking', async () => {
    setupMocks({
      bookings: [BOOKING_1],
      assignments: [{ booking_id: 'b1', table_id: 'table-2' }],
      tables: [TABLE_1, TABLE_2],
      rooms: [ROOM_A, ROOM_B], // 2 active rooms
    })

    const { result } = renderHook(() => useShiftBriefing('all'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const data = result.current.data!
    expect(data.isMultiRoom).toBe(true)
    expect(data.bookings[0].table_name).toBe('T2')
    expect(data.bookings[0].room_name).toBe('Sala Giardino')
  })

  it('booking without assignment: table_name=null, room_name=null', async () => {
    setupMocks({
      bookings: [BOOKING_1],
      assignments: [], // no assignment for b1
      tables: [TABLE_1],
      rooms: [ROOM_A],
    })

    const { result } = renderHook(() => useShiftBriefing('all'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const data = result.current.data!
    expect(data.bookings[0].table_name).toBeNull()
    expect(data.bookings[0].room_name).toBeNull()
  })

  it('multi-table booking (D39): table names joined with ", ", room from first table', async () => {
    const TABLE_3 = { id: 'table-3', name: 'T3', room_id: 'room-a' }

    setupMocks({
      bookings: [BOOKING_1],
      // b1 assigned to two tables
      assignments: [
        { booking_id: 'b1', table_id: 'table-1' },
        { booking_id: 'b1', table_id: 'table-3' },
      ],
      tables: [TABLE_1, TABLE_3],
      rooms: [ROOM_A],
    })

    const { result } = renderHook(() => useShiftBriefing('all'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const data = result.current.data!
    expect(data.bookings[0].table_name).toBe('T1, T3')
    expect(data.bookings[0].room_name).toBe('Sala Principale') // from first table
  })

  it('mixed: assigned and unassigned bookings coexist correctly', async () => {
    setupMocks({
      bookings: [BOOKING_1, BOOKING_2],
      assignments: [{ booking_id: 'b1', table_id: 'table-1' }], // only b1 assigned
      tables: [TABLE_1],
      rooms: [ROOM_A],
    })

    const { result } = renderHook(() => useShiftBriefing('all'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const data = result.current.data!
    expect(data.bookings).toHaveLength(2)

    const b1 = data.bookings.find((b) => b.id === 'b1')!
    expect(b1.table_name).toBe('T1')

    const b2 = data.bookings.find((b) => b.id === 'b2')!
    expect(b2.table_name).toBeNull()
  })

  it('correctly computes totalBookings and totalCovers', async () => {
    setupMocks({
      bookings: [BOOKING_1, BOOKING_2],
      assignments: [],
      tables: [],
      rooms: [ROOM_A],
    })

    const { result } = renderHook(() => useShiftBriefing('all'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const data = result.current.data!
    expect(data.totalBookings).toBe(2)
    expect(data.totalCovers).toBe(6) // 2 + 4
  })

  it('today is used as the date field value (format yyyy-MM-dd)', async () => {
    setupMocks()

    const { result } = renderHook(() => useShiftBriefing('all'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data!.date).toBe(TODAY)
  })

  it('inactive room is not counted for isMultiRoom', async () => {
    // 1 active + 1 inactive → isMultiRoom should be false
    setupMocks({
      bookings: [BOOKING_1],
      assignments: [{ booking_id: 'b1', table_id: 'table-1' }],
      tables: [TABLE_1],
      rooms: [
        ROOM_A, // active: true
        { id: 'room-c', name: 'Sala Chiusa', active: false },
      ],
    })

    const { result } = renderHook(() => useShiftBriefing('all'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data!.isMultiRoom).toBe(false)
  })

  it('does not run query when tenantId is null', () => {
    mockTenantId.value = null

    const { result } = renderHook(() => useShiftBriefing('all'), { wrapper: makeWrapper() })

    // Query stays idle (disabled)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
    expect(mockFrom).not.toHaveBeenCalled()
  })
})
