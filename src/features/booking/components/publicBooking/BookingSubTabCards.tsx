import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SubTab } from '@/features/booking/constants/bookingPublicFormConfig'
import {
  BOOKING_PUBLIC_WIDE_CARDS_WIDTH,
  bookingPublicRowCardWidthClass,
} from '@/features/booking/constants/bookingPublicFieldStyles'
import type { CustomStaffPreset } from '@/features/booking/constants/presetMenus'

const SUB_TAB_SCROLL_STEP_PX = 240

interface BookingSubTabCardsProps {
  subTabs: SubTab[]
  activeSubTabId: string | null
  onChange: (subTab: SubTab | null) => void
  /**
   * Serve per mostrare nel label delle card "preset" il nome vero del menù
   * (coerente con `MenuSelection`), invece di un label generico tipo "Opzione menu".
   */
  customStaffPresets?: CustomStaffPreset[]
  /** Card tipologia attive nella riga sopra — allinea la larghezza massima delle sottotab. */
  modeCardColumnCount: number
}

function formatPricePerPerson(price?: number): string | null {
  if (price == null || price <= 0) return null
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)
}

export const BookingSubTabCards: React.FC<BookingSubTabCardsProps> = ({
  subTabs,
  activeSubTabId,
  onChange,
  customStaffPresets = [],
  modeCardColumnCount,
}) => {
  const subTabCardWidthClass = bookingPublicRowCardWidthClass(modeCardColumnCount)
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
          <ChevronLeft size={22} strokeWidth={1.75} />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex w-full min-w-0 touch-pan-x flex-nowrap gap-1.5 overflow-x-auto overscroll-x-contain scroll-px-2 scrollbar-hide snap-x snap-mandatory py-1 [-webkit-overflow-scrolling:touch] sm:gap-2"
      >
        {subTabs.map((tab) => {
          const isActive = activeSubTabId === tab.id
          const priceLabel = formatPricePerPerson(tab.price_per_person)
          const presetName =
            tab.type === 'preset' && tab.preset_id
              ? customStaffPresets.find((p) => p.id === tab.preset_id)?.name
              : undefined
          return (
            <button
              key={tab.id}
              type="button"
              data-testid={`booking-sub-tab-card-${tab.id}`}
              onClick={() => onChange(isActive ? null : tab)}
              className={cn(
                'flex snap-center flex-col items-center rounded-xl border-2 px-2 py-3 text-center transition-all sm:rounded-2xl sm:px-5 sm:py-4',
                subTabCardWidthClass,
                'min-h-[132px] sm:min-h-[150px]',
                'bg-white/85 backdrop-blur-[1px] shadow-sm',
                isActive
                  ? 'border-warm-orange ring-2 ring-warm-orange/30 shadow-md'
                  : 'border-black/15 hover:border-warm-orange/50',
              )}
            >
              <div className="flex min-w-0 w-full flex-1 flex-col items-center">
                <p
                  className={cn(
                    'line-clamp-2 text-sm font-bold leading-tight sm:text-base',
                    isActive ? 'text-warm-orange' : 'text-warm-wood',
                  )}
                >
                  {presetName?.trim() ? presetName : tab.label}
                </p>
                <div
                  className={cn(
                    'mt-2 h-px w-10 rounded-full sm:mt-2.5',
                    isActive ? 'bg-warm-orange/60' : 'bg-warm-wood/25',
                  )}
                  aria-hidden
                />
                {tab.description && (
                  <p className="mt-2 line-clamp-3 text-xs leading-tight text-warm-wood-dark/70 sm:mt-2.5 sm:line-clamp-2">
                    {tab.description}
                  </p>
                )}
                {priceLabel && (
                  <p className="mt-auto pt-2 text-[13px] font-semibold leading-tight text-warm-wood-dark/80 sm:pt-2.5 sm:text-[15px]">
                    <span>{priceLabel}/persona</span>
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
          <ChevronRight size={22} strokeWidth={1.75} />
        </button>
      )}
    </div>
  )
}
