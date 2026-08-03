import type { FC, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui'

export interface BookingCardsStripProps {
  children: ReactNode
  /**
   * 'scroll' = striscia orizzontale con frecce al posto della barra nativa
   * (vista Servizio, layout "plan"). 'list' = elenco verticale invariato
   * (layout "grid", solo test): nessuna freccia, nessuno scorrimento.
   */
  mode: 'scroll' | 'list'
}

/**
 * Contenitore delle card «Prenotazioni (N)» / «Assegnate (N)» nella testata
 * della vista Servizio (S4-FIX-4B). Sostituisce la barra di scorrimento nativa
 * con due pulsanti freccia, senza togliere lo scorrimento col dito su
 * telefono/tablet (resta `overflow-x-auto`, solo la barra a video sparisce).
 *
 * Le frecce compaiono solo quando c'è davvero altro da vedere e si
 * disabilitano singolarmente all'inizio/fine, così lo spazio del layout non
 * salta quando appaiono/spariscono.
 */
export const BookingCardsStrip: FC<BookingCardsStripProps> = ({ children, mode }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    if (mode !== 'scroll') return
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    // Il numero di card cambia senza un resize della finestra (nuova
    // assegnazione, cambio fascia/giorno): il ResizeObserver copre anche quel caso.
    // Guardia `typeof`: ambienti senza ResizeObserver (jsdom nei test che non lo
    // stubbano) non devono far esplodere il componente — restano scroll+resize.
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScrollState) : null
    observer?.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
      observer?.disconnect()
    }
    // children nelle dipendenze: ricalcola quando il numero di card cambia.
  }, [mode, updateScrollState, children])

  if (mode === 'list') {
    return <div className="space-y-2">{children}</div>
  }

  const showArrows = canScrollLeft || canScrollRight

  function scrollByStep(direction: -1 | 1) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * Math.round(el.clientWidth * 0.9 || 200), behavior: 'smooth' })
  }

  return (
    <div className="flex items-center gap-1">
      {showArrows && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          disabled={!canScrollLeft}
          aria-label="Scorri a sinistra"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => scrollByStep(-1)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Button>
      )}
      <div
        ref={scrollRef}
        data-testid="booking-cards-strip-scroll"
        className="scrollbar-hide flex gap-2 overflow-x-auto pb-1"
      >
        {children}
      </div>
      {showArrows && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          disabled={!canScrollRight}
          aria-label="Scorri a destra"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => scrollByStep(1)}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      )}
    </div>
  )
}
