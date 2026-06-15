// @admin-blindatura: settings-promo
// Copre: delete/toggle/apply saveSilently (no «prossimo salvataggio»); label tipologie da config;
// fallimento saveSilently alza dirty per retry footer

import '@testing-library/jest-dom/vitest'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  DEFAULT_BOOKING_FORM_CONFIG,
  type BookingMode,
} from '@/features/booking/constants/bookingPublicFormConfig'
import type { MenuPromo } from '@/features/booking/constants/menuPromo'
import { toast } from 'react-toastify'
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

/** Riferimento stabile: `[savedPromo]` inline nel mock ricrea l'array a ogni render → loop useEffect sync. */
const savedPromosData: MenuPromo[] = [savedPromo]

function resetSavedPromos(promos: MenuPromo[] = [savedPromo]) {
  savedPromosData.length = 0
  savedPromosData.push(...promos)
}

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), warn: vi.fn(), success: vi.fn() },
}))

vi.mock('@/features/booking/hooks/useRestaurantSetting', () => ({
  useRestaurantSetting: (key: string) => ({
    data: key === 'booking_menu_promos' ? savedPromosData : null,
    isSuccess: true,
    isPending: false,
    error: null,
  }),
  useUpsertRestaurantSetting: () => ({
    mutateAsync: mutateAsyncSpy,
    isPending: false,
  }),
}))

function makeCustomBookingModes(): BookingMode[] {
  return DEFAULT_BOOKING_FORM_CONFIG.booking_modes.map((mode) =>
    mode.booking_type === 'tavolo'
      ? { ...mode, enabled: true, label: 'Tavolo Estivo' }
      : mode.booking_type === 'menu_prezzo_fisso'
        ? { ...mode, enabled: true, label: 'Menu Degustazione' }
        : { ...mode, enabled: false, label: 'Evento Laurea Custom' },
  )
}

function renderPromoSection(options?: {
  bookingModes?: BookingMode[]
  onDirtyChange?: (dirty: boolean) => void
}) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <BookingFormPromoSection
        bookingModes={options?.bookingModes ?? DEFAULT_BOOKING_FORM_CONFIG.booking_modes}
        onDirtyChange={options?.onDirtyChange}
      />
    </QueryClientProvider>,
  )
}

describe('settings-promo delete copy', () => {
  beforeEach(() => {
    resetSavedPromos()
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

describe('settings-promo label dinamiche da config', () => {
  const promoWithCustomType: MenuPromo = {
    id: 'promo-custom-type',
    label: 'Promo estiva',
    message: 'Offerta luglio',
    placement: 'booking_type',
    booking_types: ['tavolo'],
    visible_on_booking: true,
  }

  beforeEach(() => {
    mutateAsyncSpy.mockReset()
    mutateAsyncSpy.mockResolvedValue(undefined)
    resetSavedPromos([promoWithCustomType])
  })

  it('riepilogo promo usa la label configurata in Personalizza form, non nomi demo hardcoded', async () => {
    renderPromoSection({ bookingModes: makeCustomBookingModes() })

    await waitFor(() => {
      expect(screen.getByText('Promo estiva')).toBeInTheDocument()
    })
    expect(screen.getByText('Tavolo Estivo')).toBeInTheDocument()
    expect(screen.queryByText(/^Tavolo$/)).not.toBeInTheDocument()
    expect(screen.queryByText(/rinfresco di laurea|compila nome tipologia/i)).not.toBeInTheDocument()
  })

  it('editor promo mostra checkbox tipologia con label da config', async () => {
    const user = userEvent.setup()
    renderPromoSection({ bookingModes: makeCustomBookingModes() })

    await user.click(await screen.findByRole('button', { name: /nuova promo/i }))
    expect(screen.getByLabelText('Tavolo Estivo')).toBeInTheDocument()
    expect(screen.getByLabelText('Menu Degustazione')).toBeInTheDocument()
    expect(screen.queryByLabelText('Evento Laurea Custom')).not.toBeInTheDocument()
  })
})

describe('settings-promo saveSilently failure', () => {
  beforeEach(() => {
    resetSavedPromos()
    mutateAsyncSpy.mockReset()
    mutateAsyncSpy.mockResolvedValue(undefined)
  })

  it('toggle visibilità fallito alza dirty per retry footer', async () => {
    const onDirtyChange = vi.fn()
    mutateAsyncSpy.mockRejectedValueOnce(new Error('network'))
    const user = userEvent.setup()
    renderPromoSection({ onDirtyChange })

    await waitFor(() => {
      expect(screen.getByText('Promo weekend')).toBeInTheDocument()
    })

    const row = screen.getByText('Promo weekend').closest('.menu-prices-item-row')
    await user.click(within(row as HTMLElement).getByRole('button', { name: /nascondi nella pagina prenota/i }))

    await waitFor(() => {
      expect(mutateAsyncSpy).toHaveBeenCalled()
      expect(onDirtyChange).toHaveBeenCalledWith(true)
      expect(toast.error).toHaveBeenCalledWith('Errore nel salvataggio della promo')
    })
  })

  it('delete fallito: promo resta assente in UI locale e alza dirty per retry footer', async () => {
    const onDirtyChange = vi.fn()
    mutateAsyncSpy.mockRejectedValueOnce(new Error('network'))
    const user = userEvent.setup()
    renderPromoSection({ onDirtyChange })

    await waitFor(() => {
      expect(screen.getByText('Promo weekend')).toBeInTheDocument()
    })

    const row = screen.getByText('Promo weekend').closest('.menu-prices-item-row')
    await user.click(within(row as HTMLElement).getByRole('button', { name: /elimina promo/i }))
    const dialog = await screen.findByRole('dialog', { name: /eliminare la promo/i })
    await user.click(within(dialog).getByRole('button', { name: /elimina promo/i }))

    await waitFor(() => {
      expect(mutateAsyncSpy).toHaveBeenCalled()
      expect(onDirtyChange).toHaveBeenCalledWith(true)
      expect(toast.error).toHaveBeenCalledWith('Errore nel salvataggio della promo')
      expect(screen.queryByText('Promo weekend')).not.toBeInTheDocument()
    })
  })

  it('apply fallito: promo resta in UI locale e alza dirty per retry footer', async () => {
    resetSavedPromos([])
    const onDirtyChange = vi.fn()
    mutateAsyncSpy.mockRejectedValueOnce(new Error('network'))
    const user = userEvent.setup()
    renderPromoSection({ bookingModes: makeCustomBookingModes(), onDirtyChange })

    await user.click(await screen.findByRole('button', { name: /nuova promo/i }))
    await user.type(screen.getByLabelText(/nome promo \(admin\)/i), 'Promo nuova')
    await user.type(screen.getByLabelText(/testo promo \(prenota\)/i), 'Messaggio promo')
    await user.click(screen.getByLabelText('Tavolo Estivo'))
    await user.click(screen.getByRole('button', { name: /aggiungi alla lista/i }))

    await waitFor(() => {
      expect(mutateAsyncSpy).toHaveBeenCalled()
      expect(onDirtyChange).toHaveBeenCalledWith(true)
      expect(toast.error).toHaveBeenCalledWith('Errore nel salvataggio della promo')
      expect(screen.getByText('Promo nuova')).toBeInTheDocument()
    })
  })
})

describe('settings-promo toggle/apply senza «prossimo salvataggio»', () => {
  beforeEach(() => {
    resetSavedPromos()
    mutateAsyncSpy.mockReset()
    mutateAsyncSpy.mockResolvedValue(undefined)
  })

  it('toggle visibilità persiste subito in silent mode', async () => {
    const user = userEvent.setup()
    renderPromoSection()

    await waitFor(() => {
      expect(screen.getByText('Promo weekend')).toBeInTheDocument()
    })

    const row = screen.getByText('Promo weekend').closest('.menu-prices-item-row')
    await user.click(within(row as HTMLElement).getByRole('button', { name: /nascondi nella pagina prenota/i }))

    await waitFor(() => {
      expect(mutateAsyncSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({ key: 'booking_menu_promos' }),
          ]),
          options: { silent: true },
        }),
      )
    })
    expect(document.body.textContent ?? '').not.toMatch(/prossimo salvataggio/i)
  })

  it('Applica nuova promo persiste subito in silent mode senza copy «prossimo salvataggio»', async () => {
    resetSavedPromos([])
    const user = userEvent.setup()
    renderPromoSection({ bookingModes: makeCustomBookingModes() })

    await user.click(await screen.findByRole('button', { name: /nuova promo/i }))
    await user.type(screen.getByLabelText(/nome promo \(admin\)/i), 'Promo nuova')
    await user.type(screen.getByLabelText(/testo promo \(prenota\)/i), 'Messaggio promo')
    await user.click(screen.getByLabelText('Tavolo Estivo'))
    await user.click(screen.getByRole('button', { name: /aggiungi alla lista/i }))

    await waitFor(() => {
      expect(mutateAsyncSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          options: { silent: true },
        }),
      )
    })
    expect(document.body.textContent ?? '').not.toMatch(/prossimo salvataggio/i)
    expect(screen.getByText('Promo nuova')).toBeInTheDocument()
  })
})
