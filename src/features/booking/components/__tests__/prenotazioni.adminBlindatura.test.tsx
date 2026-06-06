// @admin-blindatura: prenotazioni
// Copre: conferme coerenti — niente window.confirm nativo; modale custom su archivio e no-show.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { ArchiveTab } from '../ArchiveTab'
import { BookingDangerActionModal } from '../BookingDangerActionModal'

const confirmSpy = vi.spyOn(window, 'confirm')

const mockMutateAsyncRestore = vi.fn()
const mockMutateAsyncRequeue = vi.fn()

vi.mock('../../hooks/useBookingQueries', () => ({
  useAllBookings: () => ({
    data: [
      {
        id: 'deleted-1',
        status: 'deleted',
        client_name: 'Anna Bianchi',
        client_email: 'anna@test.it',
        desired_date: '2026-06-10',
        confirmed_start: '2026-06-10T20:00:00+00:00',
        confirmed_end: '2026-06-10T23:00:00+00:00',
        num_guests: 2,
        created_at: '2026-06-01T10:00:00Z',
      },
      {
        id: 'rejected-1',
        status: 'rejected',
        client_name: 'Luigi Verdi',
        client_email: 'luigi@test.it',
        desired_date: '2026-06-11',
        rejection_reason: 'Completo',
        num_guests: 4,
        created_at: '2026-06-02T10:00:00Z',
      },
    ],
    isLoading: false,
    error: null,
  }),
}))

vi.mock('../../hooks/useBookingMutations', () => ({
  useRestoreBooking: () => ({
    mutateAsync: mockMutateAsyncRestore,
    isPending: false,
  }),
  useRequeueRejectedBooking: () => ({
    mutateAsync: mockMutateAsyncRequeue,
    isPending: false,
  }),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('ArchiveTab — conferme coerenti', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMutateAsyncRestore.mockResolvedValue(undefined)
    mockMutateAsyncRequeue.mockResolvedValue(undefined)
  })

  it('reinserisci apre modale custom e non usa window.confirm', async () => {
    const user = userEvent.setup()

    render(
      <ArchiveTab filter="deleted" sortOrder="booking_date" />,
      { wrapper },
    )

    const cardHeader = screen.getByText('Anna Bianchi').closest('button')
    if (cardHeader) await user.click(cardHeader)

    await user.click(screen.getByRole('button', { name: /reinserisci/i }))

    expect(confirmSpy).not.toHaveBeenCalled()
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/reinserisci prenotazione/i)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /^Reinserisci$/i }))

    expect(mockMutateAsyncRestore).toHaveBeenCalledWith('deleted-1')
  })

  it('riporta in attesa apre modale custom e chiama requeue', async () => {
    const user = userEvent.setup()

    render(
      <ArchiveTab filter="rejected" sortOrder="booking_date" />,
      { wrapper },
    )

    const cardHeader = screen.getByText('Luigi Verdi').closest('button')
    if (cardHeader) await user.click(cardHeader)

    await user.click(screen.getByRole('button', { name: /riporta in attesa/i }))

    expect(confirmSpy).not.toHaveBeenCalled()
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: /riporta in attesa/i })).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /^Riporta in attesa$/i }))

    expect(mockMutateAsyncRequeue).toHaveBeenCalledWith('rejected-1')
  })
})

describe('BookingDangerActionModal — regressione conferme', () => {
  it('espone titolo e azioni Annulla/Conferma coerenti', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()

    render(
      <BookingDangerActionModal
        isOpen
        onClose={() => undefined}
        onConfirm={onConfirm}
        title="Segna come No-show"
        message="Confermi che il cliente non si è presentato?"
        confirmLabel="Conferma No-show"
        variant="warning"
      />,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /conferma no-show/i }))
    expect(onConfirm).toHaveBeenCalled()
  })
})
