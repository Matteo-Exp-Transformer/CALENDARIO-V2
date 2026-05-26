import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/csr/CaretLeft'
import { CaretRightIcon } from '@phosphor-icons/react/dist/csr/CaretRight'
import { cn } from '@/lib/utils'
import type { SubTab } from '@/features/booking/constants/bookingPublicFormConfig'
import { BOOKING_PUBLIC_WIDE_CARDS_WIDTH } from '@/features/booking/constants/bookingPublicFieldStyles'

const SUB_TAB_SCROLL_STEP_PX = 240
const SUB_TAB_CARD_SIZE_CLASS =
  'w-[41%] max-w-[41%] shrink-0 sm:w-[41%] sm:max-w-[41%] lg:w-[31%] lg:max-w-[31%]'

interface BookingSubTabCardsProps {
  subTabs: SubTab[]
  activeSubTabId: string | null
  onChange: (subTab: SubTab | null) => void
  /** Card tipologia attive nella riga sopra. Mantenuta per compatibilita con il chiamante. */
  modeCardColumnCount: number
}

/** Es. `18,00€ a persona` (senza spazio prima del simbolo €). */
function formatPricePerPersonLabel(price?: number): string | null {
  if (price == null || price <= 0) return null
  const amount = new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
  return `${amount}€ a persona`
}

export const BookingSubTabCards: React.FC<BookingSubTabCardsProps> = ({
  subTabs,
  activeSubTabId,
  onChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollHints = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 4)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollHints()
    el.addEventListener('scroll', updateScrollHints, { passive: true })
    const ro = new ResizeObserver(updateScrollHints)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollHints)
      ro.disconnect()
    }
  }, [subTabs.length, updateScrollHints])

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  if (subTabs.length === 0) return null

  return (
    <div
      className={cn('relative min-w-0', BOOKING_PUBLIC_WIDE_CARDS_WIDTH)}
      data-testid="booking-sub-tab-cards"
    >
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scorri opzioni menù indietro"
          className="absolute left-0 top-0 bottom-0 z-20 hidden md:flex w-10 items-center justify-center rounded-r-md border border-slate-200/80 bg-white/95 text-warm-wood shadow-sm hover:bg-white"
          onClick={() => scrollBy(-SUB_TAB_SCROLL_STEP_PX)}
        >
          <CaretLeftIcon size={22} weight="regular" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex w-full min-w-0 touch-pan-x flex-nowrap gap-1.5 overflow-x-auto overscroll-x-contain scroll-px-2 scrollbar-hide snap-x snap-mandatory py-1 [-webkit-overflow-scrolling:touch] sm:gap-2"
      >
        {subTabs.map((tab) => {
          const isActive = activeSubTabId === tab.id
          const priceLabel =
            tab.display === 'carousel' ? null : formatPricePerPersonLabel(tab.price_per_person)
          return (
            <button
              key={tab.id}
              type="button"
              data-testid={`booking-sub-tab-card-${tab.id}`}
              onClick={() => onChange(isActive ? null : tab)}
              className={cn(
                'flex snap-center flex-col items-center rounded-xl border-2 px-3 py-3 text-center transition-all sm:rounded-2xl sm:px-6 sm:py-4',
                SUB_TAB_CARD_SIZE_CLASS,
                'min-h-[196px] sm:min-h-[220px]',
                'bg-white/85 backdrop-blur-[1px] shadow-sm',
                isActive
                  ? 'border-warm-orange ring-2 ring-warm-orange/30 shadow-md'
                  : 'border-black/15 hover:border-warm-orange/50',
              )}
            >
              <div className="flex min-w-0 w-full flex-1 flex-col items-center">
                <p
                  className={cn(
                    'line-clamp-2 text-sm font-bold leading-tight sm:text-base lg:text-xl',
                    isActive ? 'text-warm-orange' : 'text-warm-wood',
                  )}
                >
                  {tab.label}
                </p>
                <div
                  className={cn(
                    'mt-2 h-[3px] min-h-[3px] w-11 shrink-0 rounded-full sm:mt-2.5',
                    isActive ? 'bg-warm-orange/70' : 'bg-warm-wood/40',
                  )}
                  aria-hidden
                />
                <div className="flex min-h-0 w-full flex-1 items-center justify-center py-2 sm:py-2.5">
                  {tab.display !== 'carousel' && tab.description && (
                    <p className="line-clamp-5 text-xs leading-tight text-warm-wood-dark/70 sm:line-clamp-4 lg:text-base">
                      {tab.description}
                    </p>
                  )}
                </div>
                {priceLabel && (
                  <p className="text-xs font-bold leading-tight text-warm-wood-dark/80 sm:text-sm lg:text-lg">
                    <span>{priceLabel}</span>
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
      {canScrollRight && (
        <button
          type="button"
          aria-label="Scorri opzioni menù avanti"
          className="absolute right-0 top-0 bottom-0 z-20 hidden md:flex w-10 items-center justify-center rounded-l-md border border-slate-200/80 bg-white/95 text-warm-wood shadow-sm hover:bg-white"
          onClick={() => scrollBy(SUB_TAB_SCROLL_STEP_PX)}
        >
          <CaretRightIcon size={22} weight="regular" />
        </button>
      )}
    </div>
  )
}
