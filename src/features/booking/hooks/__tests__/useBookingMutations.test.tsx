import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const { mockUpdate, mockFrom } = vi.hoisted(() => {
  const mockUpdate = vi.fn()
  const mockFrom = vi.fn()
  return { mockUpdate, mockFrom }
})

vi.mock('@/lib/supabase', () => ({
  supabase: { from: mockFrom },
  handleSupabaseError: (e: unknown) => {
    if (e && typeof e === 'object' && 'message' in e) return (e as { message: string }).message
    return 'Errore'
  },
}))

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: vi.fn(() => ({ tenantId: 'tenant-1' })),
}))

// Sopprime i toast nei test
vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn(), warn: vi.fn() },
}))

// Sopprime le notifiche email
vi.mock('../useEmailNotifications', () => ({
  areEmailNotificationsEnabled: vi.fn(() => false),
  sendBookingAcceptedEmail: vi.fn(),
  sendBookingRejectedEmail: vi.fn(),
}))

import { useAcceptBooking, useRejectBooking, useCancelBooking } from '../useBookingMutations'

function buildUpdateChain(result: { data: unknown; error: null | { message: string } }) {
  const chain: Record<string, unknown> = {}
  chain['update'] = vi.fn(() => chain)
  chain['eq'] = vi.fn(() => chain)
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

const BOOKING_ACCEPTED = {
  id: 'booking-1',
  status: 'accepted',
  confirmed_start: '2026-05-10T12:00:00',
  confirmed_end: '2026-05-10T14:00:00',
  client_email: 'ospite@test.it',
  client_name: 'Mario Rossi',
  num_guests: 4,
}

describe('useAcceptBooking', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('chiama supabase.update con status accepted e invalida le query', async () => {
    const chain = buildUpdateChain({ data: BOOKING_ACCEPTED, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useAcceptBooking(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({
        bookingId: 'booking-1',
        confirmedStart: '2026-05-10T12:00:00',
        confirmedEnd: '2026-05-10T14:00:00',
        numGuests: 4,
      })
    })

    expect(mockFrom).toHaveBeenCalledWith('booking_requests')
    const updateCall = (chain['update'] as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(updateCall.status).toBe('accepted')
  })

  it('propaga l\'errore se il DB rifiuta l\'aggiornamento', async () => {
    const chain = buildUpdateChain({ data: null, error: { message: 'RLS violation' } })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useAcceptBooking(), { wrapper: makeWrapper() })

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          bookingId: 'booking-1',
          confirmedStart: '2026-05-10T12:00:00',
          confirmedEnd: '2026-05-10T14:00:00',
        })
      })
    ).rejects.toThrow('RLS violation')
  })
})

describe('useRejectBooking', () => {
  beforeEach(() => vi.resetAllMocks())

  it('chiama supabase.update con status rejected', async () => {
    const chain = buildUpdateChain({ data: { ...BOOKING_ACCEPTED, status: 'rejected' }, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useRejectBooking(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({ bookingId: 'booking-1', rejectionReason: 'Locale chiuso' })
    })

    const updateCall = (chain['update'] as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(updateCall.status).toBe('rejected')
    expect(updateCall.rejection_reason).toBe('Locale chiuso')
  })
})

describe('useCancelBooking (soft-delete)', () => {
  beforeEach(() => vi.resetAllMocks())

  it('chiama supabase.update con status deleted (soft-delete)', async () => {
    const chain = buildUpdateChain({ data: { ...BOOKING_ACCEPTED, status: 'deleted' }, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useCancelBooking(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({ bookingId: 'booking-1', cancellationReason: 'Cliente disdetto' })
    })

    const updateCall = (chain['update'] as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(updateCall.status).toBe('deleted')
    expect(updateCall.cancellation_reason).toBe('Cliente disdetto')
  })
})
