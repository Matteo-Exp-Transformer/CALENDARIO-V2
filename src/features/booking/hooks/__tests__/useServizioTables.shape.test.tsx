import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// WP-A1 / D44 — Forma tavolo di default = quadrato.
// Alla creazione di un nuovo tavolo senza forma esplicita, l'insert deve scrivere
// shape='square' (non più il default DB 'round'). Una forma esplicita va rispettata,
// e l'update di un tavolo esistente NON deve mai toccare la forma.

const { mockFrom, mockTenantId, mockToast } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockTenantId: { value: 'tenant-1' as string | null },
  mockToast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/supabase', () => ({
  supabase: { from: mockFrom },
}))

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: vi.fn(() => ({ tenantId: mockTenantId.value })),
}))

vi.mock('react-toastify', () => ({
  toast: mockToast,
}))

vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}))

import { useCreateTable, useUpdateTable, type TableInput } from '../useServizioTables'

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const BASE_INPUT: TableInput = {
  name: 'Tavolo 1',
  capacity: 4,
  placement: 'Sala A',
  room_id: 'room-1',
}

describe('useCreateTable — forma di default (D44)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('un nuovo tavolo senza forma esplicita nasce "square"', async () => {
    const insert = vi.fn(() => ({
      select: () => ({ single: () => Promise.resolve({ data: { id: 't-1' }, error: null }) }),
    }))
    mockFrom.mockReturnValue({ insert })

    const { result } = renderHook(() => useCreateTable(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync(BASE_INPUT)
    })

    expect(insert).toHaveBeenCalledTimes(1)
    expect((insert.mock.calls as unknown[][])[0][0]).toMatchObject({ shape: 'square' })
  })

  it('rispetta una forma esplicita passata in input', async () => {
    const insert = vi.fn(() => ({
      select: () => ({ single: () => Promise.resolve({ data: { id: 't-2' }, error: null }) }),
    }))
    mockFrom.mockReturnValue({ insert })

    const { result } = renderHook(() => useCreateTable(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({ ...BASE_INPUT, shape: 'rect' })
    })

    expect((insert.mock.calls as unknown[][])[0][0]).toMatchObject({ shape: 'rect' })
  })
})

describe('useUpdateTable — la forma non viene toccata in update', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('il payload di update NON include shape (i tavoli esistenti non cambiano forma)', async () => {
    const update = vi.fn(() => ({
      eq: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }))
    mockFrom.mockReturnValue({ update })

    const { result } = renderHook(() => useUpdateTable(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({ id: 't-1', input: BASE_INPUT })
    })

    expect(update).toHaveBeenCalledTimes(1)
    expect((update.mock.calls as unknown[][])[0][0]).not.toHaveProperty('shape')
  })
})
