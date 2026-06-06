// @prenota-blindatura: flusso-utente
// Copre (FU-036 #1): il riepilogo mostra/nasconde i totali per CAPACITÀ
// (modeUsesMenu(activeMode)) e non per nome tipologia. Blinda che una modalità
// «tavolo» con menù via card+preset mostri i totali, e che una senza menù non li mostri.

import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookingSummarySidebar } from '../publicBooking/BookingSummarySidebar'
import type { BookingMode } from '@/features/booking/constants/bookingPublicFormConfig'

// Il sidebar legge il catalogo categorie via hook: lo neutralizziamo, qui conta solo `hasMenu`.
vi.mock('@/features/booking/hooks/useMenuCategories', () => ({
  useMenuCategories: () => ({ data: [] }),
}))

function makeMode(overrides: Partial<BookingMode>): BookingMode {
  return {
    id: 'm1',
    booking_type: 'tavolo',
    enabled: true,
    label: 'Modalità',
    sub_tabs_enabled: false,
    ...overrides,
  } as BookingMode
}

const MENU_SELECTION = {
  items: [{ id: 'i1', name: 'Antipasto', category: 'antipasti', price: 5 }],
}

describe('BookingSummarySidebar — menù per CAPACITÀ non per nome', () => {
  it('mostra «Il tuo menu» quando la modalità USA il menù anche se booking_type=tavolo', () => {
    // tavolo per NOME non userebbe il menù, ma la capability esplicita (Livello A) vince.
    const modes = [makeMode({ booking_type: 'tavolo', capabilities: { uses_menu: true } })]
    render(
      <BookingSummarySidebar
        formData={{ num_guests: 2, booking_type: 'tavolo', menu_selection: MENU_SELECTION }}
        modes={modes}
      />,
    )
    expect(screen.getByText('Il tuo menu')).toBeInTheDocument()
    expect(screen.getByText('Antipasto')).toBeInTheDocument()
  })

  it('mostra «Il tuo menu» per Livello B: card tavolo con preset collegato', () => {
    const modes = [makeMode({ booking_type: 'tavolo' })]
    render(
      <BookingSummarySidebar
        formData={{ num_guests: 2, booking_type: 'tavolo', menu_selection: MENU_SELECTION }}
        modes={modes}
        activeSubTab={{
          id: 'tab-preset',
          display: 'cards',
          label: 'Menu collegato',
          preset_id: 'preset-1',
        }}
      />,
    )
    expect(screen.getByText('Il tuo menu')).toBeInTheDocument()
    expect(screen.getByText('Antipasto')).toBeInTheDocument()
  })

  it('NON mostra «Il tuo menu» quando la modalità NON usa il menù anche se rinfresco_laurea', () => {
    // rinfresco_laurea per NOME mostrerebbe il menù, ma la capability esplicita lo disattiva.
    const modes = [makeMode({ booking_type: 'rinfresco_laurea', capabilities: { uses_menu: false } })]
    render(
      <BookingSummarySidebar
        formData={{ num_guests: 2, booking_type: 'rinfresco_laurea', menu_selection: MENU_SELECTION }}
        modes={modes}
      />,
    )
    expect(screen.queryByText('Il tuo menu')).not.toBeInTheDocument()
  })

  it('comportamento storico preservato: tavolo senza capability → niente menù', () => {
    const modes = [makeMode({ booking_type: 'tavolo' })]
    render(
      <BookingSummarySidebar
        formData={{ num_guests: 2, booking_type: 'tavolo', menu_selection: MENU_SELECTION }}
        modes={modes}
      />,
    )
    expect(screen.queryByText('Il tuo menu')).not.toBeInTheDocument()
  })
})
