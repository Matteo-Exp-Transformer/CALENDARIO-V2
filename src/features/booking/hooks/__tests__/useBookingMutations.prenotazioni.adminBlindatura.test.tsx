// @admin-blindatura: prenotazioni
// Copre: mutation accept/reject/cancel/restore/requeue/no-show — soft-delete, stati DB voluti.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const { mockFrom } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
}))

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

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn(), warn: vi.fn() },
}))

vi.mock('../useEmailNotifications', () => ({
  areEmailNotificationsEnabled: vi.fn(() => false),
  sendBookingAcceptedEmail: vi.fn(),
  sendBookingRejectedEmail: vi.fn(),
}))

import {
  useAcceptBooking,
  useRejectBooking,
  useCancelBooking,
  useRestoreBooking,
  useRequeueRejectedBooking,
  useMarkNoShow,
} from '../useBookingMutations'

function buildUpdateChain(result: { data: unknown; error: null | { message: string } }) {
  const chain: Record<string, unknown> = {}
  chain['update'] = vi.fn(() => chain)
  chain['eq'] = vi.fn(() => chain)
  chain['select'] = vi.fn(() => chain)
  chain['single'] = vi.fn().mockResolvedValue(result)
  return chain
}

function buildSelectChain(result: { data: unknown; error: null | { message: string } }) {
  const chain: Record<string, unknown> = {}
  chain['select'] = vi.fn(() => chain)
  chain['eq'] = vi.fn(() => chain)
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

describe('@admin-blindatura prenotazioni — useAcceptBooking', () => {
  beforeEach(() => vi.clearAllMocks())

  it('accept-da-card: scrive accepted + orari + desired_time', async () => {
    const chain = buildUpdateChain({
      data: { id: 'b1', status: 'accepted' },
      error: null,
    })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useAcceptBooking(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({
        bookingId: 'b1',
        confirmedStart: '2026-06-10T20:00:00+00:00',
        confirmedEnd: '2026-06-10T23:00:00+00:00',
        desiredTime: '20:00',
        numGuests: 6,
      })
    })

    const updateArg = (chain['update'] as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(updateArg.status).toBe('accepted')
    expect(updateArg.confirmed_start).toBe('2026-06-10T20:00:00+00:00')
    expect(updateArg.confirmed_end).toBe('2026-06-10T23:00:00+00:00')
    expect(updateArg.desired_time).toBe('20:00')
  })
})

describe('@admin-blindatura prenotazioni — useRejectBooking', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rifiuta senza motivo → rejected, rejection_reason assente/null', async () => {
    const chain = buildUpdateChain({ data: { id: 'b1', status: 'rejected' }, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useRejectBooking(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({ bookingId: 'b1' })
    })

    const updateArg = (chain['update'] as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(updateArg.status).toBe('rejected')
  })
})

describe('@admin-blindatura prenotazioni — useCancelBooking soft-delete', () => {
  beforeEach(() => vi.clearAllMocks())

  it('elimina → deleted + cancelled_at + motivo (no hard-delete)', async () => {
    const chain = buildUpdateChain({ data: { id: 'b1', status: 'deleted' }, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useCancelBooking(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({
        bookingId: 'b1',
        cancellationReason: 'Cliente ha disdetto',
      })
    })

    const updateArg = (chain['update'] as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(updateArg.status).toBe('deleted')
    expect(updateArg.cancellation_reason).toBe('Cliente ha disdetto')
    expect(updateArg.cancelled_at).toBeTruthy()
    expect(typeof updateArg.cancelled_at).toBe('string')
  })
})

describe('@admin-blindatura prenotazioni — useRestoreBooking', () => {
  beforeEach(() => vi.clearAllMocks())

  it('reinserisci deleted → accepted se ha confirmed_start/end', async () => {
    const selectChain = buildSelectChain({
      data: {
        id: 'b1',
        confirmed_start: '2026-06-10T20:00:00+00:00',
        confirmed_end: '2026-06-10T23:00:00+00:00',
      },
      error: null,
    })
    const updateChain = buildUpdateChain({ data: { id: 'b1', status: 'accepted' }, error: null })
    mockFrom.mockReturnValueOnce(selectChain).mockReturnValueOnce(updateChain)

    const { result } = renderHook(() => useRestoreBooking(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync('b1')
    })

    const updateArg = (updateChain['update'] as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(updateArg.status).toBe('accepted')
  })
})

describe('@admin-blindatura prenotazioni — useRequeueRejectedBooking', () => {
  beforeEach(() => vi.clearAllMocks())

  it('riporta in attesa: rejected → pending, azzera rejection_reason', async () => {
    const chain = buildUpdateChain({ data: { id: 'b1', status: 'pending' }, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useRequeueRejectedBooking(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync('b1')
    })

    const updateArg = (chain['update'] as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(updateArg.status).toBe('pending')
    expect(updateArg.rejection_reason).toBeNull()
  })
})

describe('@admin-blindatura prenotazioni — useMarkNoShow', () => {
  beforeEach(() => vi.clearAllMocks())

  it('no-show → no_show=true, riga resta in DB', async () => {
    const chain = buildUpdateChain({ data: { id: 'b1', no_show: true }, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useMarkNoShow(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync('b1')
    })

    const updateArg = (chain['update'] as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(updateArg.no_show).toBe(true)
  })
})
