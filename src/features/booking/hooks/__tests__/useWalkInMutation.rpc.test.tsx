import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Debito "walk-in non transazionale" (handoff S4 §4-bis punto 4, mig. 069).
// useWalkInMutation ora fa un'unica chiamata alla RPC create_walk_in_with_assignment invece di
// INSERT booking + controlli + INSERT assignment con rollback compensativo manuale. Questi test
// verificano: i parametri passati alla RPC, la gestione errore (throw col messaggio del server,
// niente più scritture di rollback lato client), e il caso senza tavolo (p_table_id null).

const { mockRpc, mockTenantId, mockToast } = vi.hoisted(() => ({
  mockRpc: vi.fn(),
  mockTenantId: { value: 'tenant-1' as string | null },
  mockToast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/supabase', () => ({
  supabase: { rpc: mockRpc },
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

import { useWalkInMutation, type WalkInInput } from '../useWalkInMutation'

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useWalkInMutation — RPC create_walk_in_with_assignment (mig. 069)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-03T19:30:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('walk-in con tavolo: chiama la RPC con tutti i parametri attesi (p_table_id valorizzato)', async () => {
    mockRpc.mockResolvedValue({ data: 'booking-uuid-1', error: null })

    const { result } = renderHook(() => useWalkInMutation(), { wrapper: makeWrapper() })

    const input: WalkInInput = {
      client_name: 'Mario',
      num_guests: 4,
      table_id: 'table-uuid-1',
      service_slot_id: 'slot-1',
      max_turns: 2,
      placement: 'Tavolo 3',
      force_replace_existing: false,
    }

    await act(async () => {
      await result.current.mutateAsync(input)
    })

    expect(mockRpc).toHaveBeenCalledTimes(1)
    const [fnName, params] = mockRpc.mock.calls[0] as [string, Record<string, unknown>]
    expect(fnName).toBe('create_walk_in_with_assignment')
    expect(params).toMatchObject({
      p_tenant_id: 'tenant-1',
      p_client_name: 'Mario',
      p_num_guests: 4,
      p_placement: 'Tavolo 3',
      p_table_id: 'table-uuid-1',
      p_service_slot_id: 'slot-1',
      p_max_turns: 2,
      p_force_replace_existing: false,
      p_force_reason: null,
    })
    expect(typeof params.p_desired_date).toBe('string')
    expect(typeof params.p_desired_time).toBe('string')
    expect(typeof params.p_confirmed_start).toBe('string')
    expect(typeof params.p_confirmed_end).toBe('string')
  })

  it('walk-in senza tavolo: p_table_id/p_service_slot_id null, una sola chiamata RPC (già atomico)', async () => {
    mockRpc.mockResolvedValue({ data: 'booking-uuid-2', error: null })

    const { result } = renderHook(() => useWalkInMutation(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({ client_name: 'Solo coperti', num_guests: 2 })
    })

    expect(mockRpc).toHaveBeenCalledTimes(1)
    const [, params] = mockRpc.mock.calls[0] as [string, Record<string, unknown>]
    expect(params).toMatchObject({
      p_table_id: null,
      p_service_slot_id: null,
      p_max_turns: null,
      p_force_replace_existing: false,
    })
  })

  it('forzatura: passa force_replace_existing e force_reason alla RPC', async () => {
    mockRpc.mockResolvedValue({ data: 'booking-uuid-3', error: null })

    const { result } = renderHook(() => useWalkInMutation(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({
        num_guests: 3,
        table_id: 'table-uuid-9',
        service_slot_id: 'slot-9',
        force_replace_existing: true,
        force_reason: 'Cliente seduto ha finito',
      })
    })

    const [, params] = mockRpc.mock.calls[0] as [string, Record<string, unknown>]
    expect(params).toMatchObject({
      p_force_replace_existing: true,
      p_force_reason: 'Cliente seduto ha finito',
    })
  })

  it('errore RPC (es. tavolo occupato) → throw col messaggio del server, nessuna scrittura di rollback', async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: {
        message: 'Questo tavolo risulta occupato: usa la conferma guidata per liberarlo e assegnare il walk-in.',
      },
    })

    const { result } = renderHook(() => useWalkInMutation(), { wrapper: makeWrapper() })

    await act(async () => {
      await expect(
        result.current.mutateAsync({
          num_guests: 2,
          table_id: 'table-uuid-busy',
          service_slot_id: 'slot-1',
        }),
      ).rejects.toThrow(/tavolo risulta occupato/i)
    })

    // Una sola chiamata: niente insert booking + insert assignment + update di rollback separati.
    expect(mockRpc).toHaveBeenCalledTimes(1)
    expect(mockToast.error).toHaveBeenCalledWith(
      expect.stringMatching(/tavolo risulta occupato/i),
    )
  })

  it('il valore di ritorno resta { id, date, serviceSlotId } per non rompere onSuccess', async () => {
    mockRpc.mockResolvedValue({ data: 'booking-uuid-ret', error: null })

    const { result } = renderHook(() => useWalkInMutation(), { wrapper: makeWrapper() })

    let returned: unknown
    await act(async () => {
      returned = await result.current.mutateAsync({
        num_guests: 2,
        service_slot_id: 'slot-7',
      })
    })

    expect(returned).toMatchObject({
      id: 'booking-uuid-ret',
      serviceSlotId: 'slot-7',
    })
    expect((returned as { date: string }).date).toEqual(expect.any(String))
  })
})
