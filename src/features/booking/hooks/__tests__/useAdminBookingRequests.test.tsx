import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const { mockFrom, mockRestaurantDefaultDuration } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockRestaurantDefaultDuration: { value: 90 },
}))

vi.mock('@/lib/supabase', () => ({
  supabase: { from: mockFrom },
}))

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: vi.fn(),
}))

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('../useRestaurantSetting', () => ({
  useRestaurantSetting: () => ({ data: mockRestaurantDefaultDuration.value }),
}))

import { useTenantContext } from '@/contexts/TenantContext'
import { useCreateAdminBooking } from '../useAdminBookingRequests'

const mockUseTenantContext = vi.mocked(useTenantContext)

function buildInsertChain(result: { data: unknown; error: null | { message: string } }) {
  const chain: Record<string, unknown> = {}
  chain['insert'] = vi.fn(() => chain)
  chain['select'] = vi.fn(() => chain)
  chain['single'] = vi.fn().mockResolvedValue(result)
  return chain
}

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const BOOKING_INPUT = {
  client_name: 'Mario',
  client_email: 'mario@test.it',
  booking_type: 'tavolo' as const,
  desired_date: '2026-05-10',
  desired_time: '20:00',
  num_guests: 4,
  placement: 'Sala A',
}

describe('useCreateAdminBooking — placement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRestaurantDefaultDuration.value = 90
    mockUseTenantContext.mockReturnValue({
      tenantId: 'tenant-1',
      edition: 'classic',
    } as ReturnType<typeof useTenantContext>)
  })

  it('edition classic: inserisce placement null anche se il payload ha un valore', async () => {
    const chain = buildInsertChain({ data: { id: 'new-1' }, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useCreateAdminBooking(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync(BOOKING_INPUT)
    })

    expect(chain['insert']).toHaveBeenCalledWith(
      expect.objectContaining({ placement: null }),
    )
  })

  it('edition pro: inserisce placement dal payload', async () => {
    mockUseTenantContext.mockReturnValue({
      tenantId: 'tenant-1',
      edition: 'pro',
    } as ReturnType<typeof useTenantContext>)

    const chain = buildInsertChain({ data: { id: 'new-2' }, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useCreateAdminBooking(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync(BOOKING_INPUT)
    })

    expect(chain['insert']).toHaveBeenCalledWith(
      expect.objectContaining({ placement: 'Sala A' }),
    )
  })

  it('risolve prima la durata console e poi calcola confirmed_end a +90 minuti', async () => {
    const chain = buildInsertChain({ data: { id: 'new-3' }, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useCreateAdminBooking(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync(BOOKING_INPUT)
    })

    expect(chain['insert']).toHaveBeenCalledWith(expect.objectContaining({
      confirmed_end: '2026-05-10T21:30:00+00:00',
      duration_minutes: 90,
      duration_source: 'restaurant_default',
      duration_rule_version: 1,
    }))
  })

  it('calcola in minuti anche una durata console non multipla di un ora', async () => {
    mockRestaurantDefaultDuration.value = 31
    const chain = buildInsertChain({ data: { id: 'new-4' }, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useCreateAdminBooking(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync(BOOKING_INPUT)
    })

    expect(chain['insert']).toHaveBeenCalledWith(expect.objectContaining({
      confirmed_end: '2026-05-10T20:31:00+00:00',
      duration_minutes: 31,
    }))
  })
})
