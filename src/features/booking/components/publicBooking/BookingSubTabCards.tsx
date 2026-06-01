import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/csr/CaretLeft'
import { CaretRightIcon } from '@phosphor-icons/react/dist/csr/CaretRight'
import { cn } from '@/lib/utils'
import type { SubTab } from '@/features/booking/constants/bookingPublicFormConfig'
import { BOOKING_PUBLIC_WIDE_CARDS_WIDTH } from '@/features/booking/constants/bookingPublicFieldStyles'
import { MenuQrCategoryIconGlyph } from '@/features/public-menu/MenuQrCategoryIconGlyph'
import { MENU_QR_DEFAULT_CATEGORY_ICON_KEY } from '@/features/public-menu/categoryIcons'

const SUB_TAB_SCROLL_STEP_PX = 240

interface BookingSubTabCardsProps {
  subTabs: SubTab[]
  activeSubTabId: string | null
  onChange: (subTab: SubTab | null) => void
  /** Card tipologia attive nella riga sopra. Mantenuta per compatibilita con il chiamante. */
  modeCardColumnCount: number
}

/** Es. `18,00€` (senza spazio prima del simbolo €). */
function formatPriceAmountLabel(price?: number): string | null {
  if (price == null || price <= 0) return null
  const amount = new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
  return `${amount}€`
}

export const BookingSubTabCards: React.FC<BookingSubTabCardsProps> = ({
  subTabs,
  activeSubTabId,
  onChange,
  modeCardColumnCount: _modeCardColumnCount,
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
  // ≤3 card: flex-1 su ogni card → si espandono a riempire la riga, centrate
  // ≥4 card: larghezza minima fissa → scroll laterale automatico
  const cardFlexClass = subTabs.length <= 3
    ? 'flex-1 min-w-0'
    : 'w-[200px] sm:w-[220px] shrink-0'

  return (
    <div
      className={cn('relative min-w-0', BOOKING_PUBLIC_WIDE_CARDS_WIDTH)}
      data-testid="booking-sub-tab-cards"
    >
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scorri opzioni menù indietro"
          className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-warm-wood/15 bg-white/90 text-warm-wood shadow-lg backdrop-blur-sm transition hover:bg-white hover:text-warm-orange md:flex"
          onClick={() => scrollBy(-SUB_TAB_SCROLL_STEP_PX)}
        >
          <CaretLeftIcon size={20} weight="bold" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="w-full min-w-0 overflow-x-auto overscroll-x-contain scrollbar-hide py-1 touch-pan-x [-webkit-overflow-scrolling:touch]"
      >
        <div className="flex w-full flex-nowrap gap-1.5 sm:gap-2 snap-x snap-mandatory scroll-px-2">
        {subTabs.map((tab) => {
          const isActive = activeSubTabId === tab.id
          const priceAmount =
            tab.display === 'carousel' ? null : formatPriceAmountLabel(tab.price_per_person)
          const coursesLabel = tab.display === 'carousel' ? '' : tab.courses_label?.trim() ?? ''
          const descriptionLabel = tab.display === 'carousel' ? '' : tab.description?.trim() ?? ''
          return (
            <button
              key={tab.id}
              type="button"
              data-testid={`booking-sub-tab-card-${tab.id}`}
              onClick={() => onChange(isActive ? null : tab)}
              className={cn(
                'flex snap-center flex-col items-center rounded-xl border-2 px-3 py-3 text-center transition-all sm:rounded-2xl sm:px-6 sm:py-4',
                cardFlexClass,
                'min-h-[140px] sm:min-h-[196px] lg:min-h-[230px]',
                'bg-white/85 backdrop-blur-[1px] shadow-sm',
                isActive
                  ? 'border-warm-orange ring-2 ring-warm-orange/30 shadow-md'
                  : 'border-black/15 hover:border-warm-orange/50',
              )}
            >
              <div className="flex min-w-0 w-full flex-1 flex-col items-center pt-2 sm:pt-3">
                <p
                  className={cn(
                    'line-clamp-2 text-xs font-bold leading-tight sm:text-base lg:text-xl',
                    isActive ? 'text-warm-orange' : 'text-warm-wood',
                  )}
                >
                  {tab.label}
                </p>
                <div
                  className={cn(
                    'mt-3 h-[3px] min-h-[3px] w-11 shrink-0 rounded-full sm:mt-4',
                    isActive ? 'bg-warm-orange/70' : 'bg-warm-wood/40',
                  )}
                  aria-hidden
                />
                <div className="flex min-h-0 w-full flex-1 items-center justify-center py-2 sm:py-3">
                  {tab.display !== 'carousel' && (
                    <span
                      className={cn(
                        'flex shrink-0 items-center justify-center',
                        'h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16',
                      )}
                      aria-hidden
                    >
                      <MenuQrCategoryIconGlyph
                        iconKey={tab.icon ?? MENU_QR_DEFAULT_CATEGORY_ICON_KEY}
                        className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 text-warm-wood-dark"
                      />
                    </span>
                  )}
                </div>
                {descriptionLabel ? (
                  <p className="mt-0.5 hidden max-w-full px-1 text-center text-xs leading-snug text-warm-wood-dark/70 line-clamp-3 min-[700px]:block sm:line-clamp-2">
                    {descriptionLabel}
                  </p>
                ) : null}
                {(priceAmount || coursesLabel) && (
                  <div className="flex w-full items-end justify-between gap-2">
                    {coursesLabel ? (
                      <p className="min-w-0 text-left text-[11px] font-bold leading-tight text-warm-orange sm:text-sm lg:text-base">
                        {coursesLabel}
                      </p>
                    ) : (
                      <span className="min-w-0 flex-1" aria-hidden />
                    )}
                    {priceAmount && (
                      <p className="shrink-0 text-right text-xs font-bold leading-tight text-warm-wood-dark/80 sm:text-base lg:text-xl">
                        <span>{priceAmount}</span>
                        <span className="hidden min-[900px]:inline"> a persona</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </button>
          )
        })}
        </div>
      </div>
      {canScrollRight && (
        <button
          type="button"
          aria-label="Scorri opzioni menù avanti"
          className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-warm-wood/15 bg-white/90 text-warm-wood shadow-lg backdrop-blur-sm transition hover:bg-white hover:text-warm-orange md:flex"
          onClick={() => scrollBy(SUB_TAB_SCROLL_STEP_PX)}
        >
          <CaretRightIcon size={20} weight="bold" />
        </button>
      )}
    </div>
  )
}
