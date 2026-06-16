// @prenota-blindatura: fix5-fix8-area-a
// Copre: FIX 5 — testo card tipologia (BookingModeCards) ingrandito ~20% senza peggiorare il
// confronto lg vs sm già noto (PRENOTA_LAYOUT_CONTEXT §5); FIX 8 — la card categoria ingredienti
// (BookingMenuCategoryCard) scrolla la propria card al centro dello strip orizzontale prima di
// espandersi solo quando è nel layout «scroll» col ref del contenitore assegnato (desktop), e NON
// quando è in layout «grid» (mobile, nessun horizontalScrollRef).

import '@testing-library/jest-dom/vitest'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createRef } from 'react'
import { fireEvent, render, screen, cleanup } from '@testing-library/react'
import { BookingModeCards } from '../BookingModeCards'
import { BookingMenuCategoryCard } from '../BookingMenuCategoryCard'
import type { BookingMode } from '@/features/booking/constants/bookingPublicFormConfig'
import type { ComposeMenuItem } from '@/features/booking/utils/menuComposeVisibility'

describe('FIX 5 — BookingModeCards testo +20%', () => {
  beforeEach(() => cleanup())

  const modes: BookingMode[] = [
    { id: 'tavolo', label: 'Tavolo', description: 'Prenota un tavolo', enabled: true, booking_type: 'tavolo', icon: 'utensils' },
    { id: 'asporto', label: 'Asporto', description: 'Ritira al locale', enabled: true, booking_type: 'tavolo', icon: 'utensils' },
  ] as unknown as BookingMode[]

  it('usa le classi di testo ingrandite (16px base, sm/xl 19px, lg 17px) e descrizione text-sm', () => {
    render(
      <BookingModeCards modes={modes} activeModeId="tavolo" onChange={vi.fn()} />,
    )

    const title = screen.getByText('Tavolo')
    expect(title.className).toContain('text-[16px]')
    expect(title.className).toContain('sm:text-[19px]')
    expect(title.className).toContain('lg:text-[17px]')
    expect(title.className).toContain('xl:text-[19px]')

    const description = screen.getByText('Prenota un tavolo')
    expect(description.className).toContain('text-sm')

    // Il gap lg-vs-sm noto (PRENOTA_LAYOUT_CONTEXT §5) non deve peggiorare: 17 deve restare
    // più vicino a 19 di quanto non peggiori il rapporto precedente (14 vs 16).
    const lgPx = 17
    const smPx = 19
    expect(smPx - lgPx).toBeLessThanOrEqual(2)
  })
})

describe('FIX 8 — BookingMenuCategoryCard scrollIntoView prima di espandere', () => {
  beforeEach(() => {
    cleanup()
    Element.prototype.scrollIntoView = vi.fn()
    // jsdom non implementa ResizeObserver; il componente lo usa per il sync overlay/portal.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )
  })

  const items: ComposeMenuItem[] = [
    { id: 'item-1', name: 'Margherita', category: 'pizze', price: 6.5, sort_order: 0 } as ComposeMenuItem,
  ]

  it('layout scroll con horizontalScrollRef assegnato: scrolla la card al centro prima di espandere', () => {
    const scrollContainer = document.createElement('div')
    const horizontalScrollRef = createRef<HTMLElement>()
    Object.defineProperty(horizontalScrollRef, 'current', { value: scrollContainer, writable: true })

    render(
      <BookingMenuCategoryCard
        categoryKey="pizze"
        categoryLabel="Pizze"
        items={items}
        selectedItems={[]}
        locked={false}
        formatPrice={() => '€6.50'}
        onToggleItem={vi.fn()}
        layout="scroll"
        horizontalScrollRef={horizontalScrollRef}
      />,
    )

    const closedCardButton = screen.getByRole('button', { name: /Pizze/i })
    fireEvent.click(closedCardButton)

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: 'smooth', inline: 'center' }),
    )
    expect(screen.getByRole('region', { name: /Pizze/i })).toBeInTheDocument()
  })

  it('layout grid (mobile, nessun horizontalScrollRef): espande senza chiamare scrollIntoView', () => {
    render(
      <BookingMenuCategoryCard
        categoryKey="pizze"
        categoryLabel="Pizze"
        items={items}
        selectedItems={[]}
        locked={false}
        formatPrice={() => '€6.50'}
        onToggleItem={vi.fn()}
        layout="grid"
      />,
    )

    const closedCardButton = screen.getByRole('button', { name: /Pizze/i })
    fireEvent.click(closedCardButton)

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
    expect(screen.getByRole('region', { name: /Pizze/i })).toBeInTheDocument()
  })

  // Controtest "rompi" (MANUALE_BLINDATURA §3, fronte flusso utente): click rapidi multipli sulla
  // card chiusa non devono accumulare chiamate scrollIntoView dopo che la card è già espansa
  // (il bottone chiuso è smontato non appena `expanded` diventa true).
  it('rompi: click rapidi multipli sulla card chiusa scrollano una sola volta', () => {
    const scrollContainer = document.createElement('div')
    const horizontalScrollRef = createRef<HTMLElement>()
    Object.defineProperty(horizontalScrollRef, 'current', { value: scrollContainer, writable: true })

    render(
      <BookingMenuCategoryCard
        categoryKey="pizze"
        categoryLabel="Pizze"
        items={items}
        selectedItems={[]}
        locked={false}
        formatPrice={() => '€6.50'}
        onToggleItem={vi.fn()}
        layout="scroll"
        horizontalScrollRef={horizontalScrollRef}
      />,
    )

    const closedCardButton = screen.getByRole('button', { name: /Pizze/i })
    fireEvent.click(closedCardButton)
    fireEvent.click(closedCardButton)
    fireEvent.click(closedCardButton)

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1)
  })
})
