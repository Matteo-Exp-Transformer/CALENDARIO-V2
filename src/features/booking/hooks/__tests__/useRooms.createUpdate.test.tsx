import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

/**
 * Blindatura WP-1 istanza 1 — create/update sala non avevano unit dedicate
 * (solo mock nei test modale). Proteggono trim nome, payload canvas e toast.
 */

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

import { useCreateRoom, useUpdateRoom, type RoomInput } from '../useRooms'

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const BASE_INPUT: RoomInput = {
  name: '  Sala Principale  ',
  width: 800,
  height: 600,
  display_order: 2,
}

describe('useCreateRoom — insert sala (blindatura CRUD)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('scrive tenant, nome trim, dimensioni e display_order; toast «Sala aggiunta»', async () => {
    const insert = vi.fn(() => ({
      select: () => ({ single: () => Promise.resolve({ data: { id: 'room-1' }, error: null }) }),
    }))
    mockFrom.mockReturnValue({ insert })

    const { result } = renderHook(() => useCreateRoom(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync(BASE_INPUT)
    })

    expect(mockFrom).toHaveBeenCalledWith('rooms')
    expect(insert).toHaveBeenCalledTimes(1)
    expect((insert.mock.calls as unknown[][])[0][0]).toEqual({
      tenant_id: 'tenant-1',
      name: 'Sala Principale',
      width: 800,
      height: 600,
      display_order: 2,
    })
    expect(mockToast.success).toHaveBeenCalledWith('Sala aggiunta')
  })

  it('senza display_order esplicito usa 0', async () => {
    const insert = vi.fn(() => ({
      select: () => ({ single: () => Promise.resolve({ data: { id: 'room-2' }, error: null }) }),
    }))
    mockFrom.mockReturnValue({ insert })

    const { result } = renderHook(() => useCreateRoom(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({
        name: 'Sala B',
        width: 400,
        height: 300,
      })
    })

    expect((insert.mock.calls as unknown[][])[0][0]).toMatchObject({ display_order: 0 })
  })

  it('senza tenant rifiuta prima di toccare Supabase', async () => {
    mockTenantId.value = null
    const insert = vi.fn()
    mockFrom.mockReturnValue({ insert })

    const { result } = renderHook(() => useCreateRoom(), { wrapper: makeWrapper() })

    await expect(
      act(async () => {
        await result.current.mutateAsync(BASE_INPUT)
      }),
    ).rejects.toThrow('Tenant mancante')
    expect(insert).not.toHaveBeenCalled()
  })
})

describe('useUpdateRoom — update sala (blindatura CRUD)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('aggiorna nome trim + canvas e filtra per id+tenant; toast «Sala aggiornata»', async () => {
    const eqTenant = vi.fn(() => Promise.resolve({ error: null }))
    const eqId = vi.fn(() => ({ eq: eqTenant }))
    const update = vi.fn(() => ({ eq: eqId }))
    mockFrom.mockReturnValue({ update })

    const { result } = renderHook(() => useUpdateRoom(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({ id: 'room-1', input: BASE_INPUT })
    })

    expect(update).toHaveBeenCalledWith({
      name: 'Sala Principale',
      width: 800,
      height: 600,
      display_order: 2,
    })
    expect(eqId).toHaveBeenCalledWith('id', 'room-1')
    expect(eqTenant).toHaveBeenCalledWith('tenant_id', 'tenant-1')
    expect(mockToast.success).toHaveBeenCalledWith('Sala aggiornata')
  })

  it('senza tenant rifiuta prima di toccare Supabase', async () => {
    mockTenantId.value = null
    const update = vi.fn()
    mockFrom.mockReturnValue({ update })

    const { result } = renderHook(() => useUpdateRoom(), { wrapper: makeWrapper() })

    await expect(
      act(async () => {
        await result.current.mutateAsync({ id: 'room-1', input: BASE_INPUT })
      }),
    ).rejects.toThrow('Tenant mancante')
    expect(update).not.toHaveBeenCalled()
  })
})
