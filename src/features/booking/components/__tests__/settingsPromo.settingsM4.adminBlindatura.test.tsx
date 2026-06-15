// @admin-blindatura: settings-promo
// Copre: copy modale delete promo allineata a saveSilently immediato (non «prossimo salvataggio»)

import '@testing-library/jest-dom/vitest'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DEFAULT_BOOKING_FORM_CONFIG } from '@/features/booking/constants/bookingPublicFormConfig'
import type { MenuPromo } from '@/features/booking/constants/menuPromo'
import { BookingFormPromoSection } from '../settings/BookingFormPromoSection'

const mutateAsyncSpy = vi.fn()

const savedPromo: MenuPromo = {
  id: 'promo-1111-1111-1111-111111111111',
  label: 'Promo weekend',
  message: 'Sconto del 10% il sabato',
  placement: 'booking_type',
  booking_types: ['tavolo'],
  visible_on_booking: true,
}

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), warn: vi.fn(), success: vi.fn() },
}))

vi.mock('@/features/booking/hooks/useRestaurantSetting', () => ({
  useRestaurantSetting: (key: string) => ({
    data: key === 'booking_menu_promos' ? [savedPromo] : null,
    isSuccess: true,
    isPending: false,
    error: null,
  }),
  useUpsertRestaurantSetting: () => ({
    mutateAsync: mutateAsyncSpy,
    isPending: false,
  }),
}))

function renderPromoSection() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <BookingFormPromoSection bookingModes={DEFAULT_BOOKING_FORM_CONFIG.booking_modes} />
    </QueryClientProvider>,
  )
}

describe('settings-promo delete copy', () => {
  beforeEach(() => {
    mutateAsyncSpy.mockReset()
    mutateAsyncSpy.mockResolvedValue(undefined)
  })

  it('la modale delete non parla di prossimo salvataggio e conferma chiama saveSilently', async () => {
    const user = userEvent.setup()
    renderPromoSection()

    await waitFor(() => {
      expect(screen.getByText('Promo weekend')).toBeInTheDocument()
    })

    const row = screen.getByText('Promo weekend').closest('.menu-prices-item-row')
    expect(row).toBeTruthy()
    await user.click(within(row as HTMLElement).getByRole('button', { name: /elimina promo/i }))

    const dialog = await screen.findByRole('dialog', { name: /eliminare la promo/i })
    const body = within(dialog).getByText(/sei sicuro di voler eliminare/i).textContent ?? ''
    expect(body).toMatch(/salvata subito/i)
    expect(body).not.toMatch(/prossimo salvataggio/i)

    await user.click(within(dialog).getByRole('button', { name: /elimina promo/i }))

    await waitFor(() => {
      expect(mutateAsyncSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [{ key: 'booking_menu_promos', value: [] }],
          options: { silent: true },
        }),
      )
    })
    expect(screen.queryByText('Promo weekend')).not.toBeInTheDocument()
  })
})
