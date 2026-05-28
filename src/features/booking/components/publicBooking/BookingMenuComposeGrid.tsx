import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MenuItem } from '@/types/menu'
import type { SelectedMenuItem } from '@/types/menu'
import type { CustomStaffPreset, PresetMenuType } from '../../constants/presetMenus'
import {
  filterItemsForComposeCategory,
  resolveLockedPresetAllowedItemIds,
  type ComposeMenuItem,
} from '../../utils/menuComposeVisibility'
import { BookingMenuCategoryCard } from './BookingMenuCategoryCard'

const COMPOSE_SCROLL_STEP_PX = 320

export interface BookingMenuComposeGridProps {
  categoryEntries: readonly (readonly [string, string])[]
  categoryImageByKey: Record<string, string | null | undefined>
  itemsByCategory: Record<string, ComposeMenuItem[]>
  selectedItems: SelectedMenuItem[]
  locked: boolean
  presetMenu?: PresetMenuType
  menuItems: MenuItem[]
  customStaffPresets: CustomStaffPreset[]
  formatPrice: (item: ComposeMenuItem) => string
  onToggleItem: (item: ComposeMenuItem) => void
  tiramisuUnitPrice: number
  localTiramisuValue: string
  onTiramisuQuantityChange: (value: string) => void
  onTiramisuQuantityBlur: () => void
}

type VisibleCategory = { key: string; label: string; items: ComposeMenuItem[] }

function ComposeCategoryCards({
  categories,
  layout,
  compact,
  categoryImageByKey,
  selectedItems,
  locked,
  formatPrice,
  onToggleItem,
  tiramisuUnitPrice,
  localTiramisuValue,
  onTiramisuQuantityChange,
  onTiramisuQuantityBlur,
  resetKey,
}: {
  categories: VisibleCategory[]
  layout: 'grid' | 'scroll' | 'stack'
  compact?: boolean
  categoryImageByKey: Record<string, string | null | undefined>
  selectedItems: SelectedMenuItem[]
  locked: boolean
  formatPrice: (item: ComposeMenuItem) => string
  onToggleItem: (item: ComposeMenuItem) => void
  tiramisuUnitPrice: number
  localTiramisuValue: string
  onTiramisuQuantityChange: (value: string) => void
  onTiramisuQuantityBlur: () => void
  resetKey?: string
}) {
  return (
    <>
      {categories.map(({ key, label, items }) => (
        <BookingMenuCategoryCard
          key={key}
          categoryKey={key}
          categoryLabel={label}
          imageUrl={categoryImageByKey[key]}
          items={items}
          selectedItems={selectedItems}
          locked={locked}
          formatPrice={formatPrice}
          onToggleItem={onToggleItem}
          tiramisuUnitPrice={tiramisuUnitPrice}
          localTiramisuValue={localTiramisuValue}
          onTiramisuQuantityChange={onTiramisuQuantityChange}
          onTiramisuQuantityBlur={onTiramisuQuantityBlur}
          layout={layout}
          compact={compact}
          resetKey={resetKey}
        />
      ))}
    </>
  )
}

function ComposeScrollRow({
  categories,
  className,
  categoryImageByKey,
  selectedItems,
  locked,
  formatPrice,
  onToggleItem,
  tiramisuUnitPrice,
  localTiramisuValue,
  onTiramisuQuantityChange,
  onTiramisuQuantityBlur,
  resetKey,
}: {
  categories: VisibleCategory[]
  className?: string
  categoryImageByKey: Record<string, string | null | undefined>
  selectedItems: SelectedMenuItem[]
  locked: boolean
  formatPrice: (item: ComposeMenuItem) => string
  onToggleItem: (item: ComposeMenuItem) => void
  tiramisuUnitPrice: number
  localTiramisuValue: string
  onTiramisuQuantityChange: (value: string) => void
  onTiramisuQuantityBlur: () => void
  resetKey?: string
}) {
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
  }, [categories.length, updateScrollHints])

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <div className={cn('relative w-full min-w-0', className)} data-testid="booking-menu-compose-scroll">
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scorri categorie menù indietro"
          className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-warm-wood/15 bg-white/90 text-warm-wood shadow-lg backdrop-blur-sm transition hover:bg-white hover:text-warm-orange md:flex"
          onClick={() => scrollBy(-COMPOSE_SCROLL_STEP_PX)}
        >
          <ChevronLeft size={22} strokeWidth={1.75} />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex w-full min-w-0 flex-nowrap items-start gap-4 overflow-x-auto scroll-px-2 scrollbar-hide snap-x snap-mandatory py-1"
      >
        <ComposeCategoryCards
          categories={categories}
          layout="scroll"
          categoryImageByKey={categoryImageByKey}
          selectedItems={selectedItems}
          locked={locked}
          formatPrice={formatPrice}
          onToggleItem={onToggleItem}
          tiramisuUnitPrice={tiramisuUnitPrice}
          localTiramisuValue={localTiramisuValue}
          onTiramisuQuantityChange={onTiramisuQuantityChange}
          onTiramisuQuantityBlur={onTiramisuQuantityBlur}
          resetKey={resetKey}
        />
      </div>
      {canScrollRight && (
        <button
          type="button"
          aria-label="Scorri categorie menù avanti"
          className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-warm-wood/15 bg-white/90 text-warm-wood shadow-lg backdrop-blur-sm transition hover:bg-white hover:text-warm-orange md:flex"
          onClick={() => scrollBy(COMPOSE_SCROLL_STEP_PX)}
        >
          <ChevronRight size={22} strokeWidth={1.75} />
        </button>
      )}
    </div>
  )
}

export const BookingMenuComposeGrid: React.FC<BookingMenuComposeGridProps> = ({
  categoryEntries,
  categoryImageByKey,
  itemsByCategory,
  selectedItems,
  locked,
  presetMenu,
  menuItems,
  customStaffPresets,
  formatPrice,
  onToggleItem,
  tiramisuUnitPrice,
  localTiramisuValue,
  onTiramisuQuantityChange,
  onTiramisuQuantityBlur,
}) => {
  const allowedItemIds = useMemo(
    () =>
      locked
        ? resolveLockedPresetAllowedItemIds(presetMenu, menuItems, customStaffPresets)
        : null,
    [locked, presetMenu, menuItems, customStaffPresets],
  )

  const visibleCategories = useMemo(() => {
    return categoryEntries
      .map(([key, label]) => {
        const items = filterItemsForComposeCategory(itemsByCategory[key] ?? [], allowedItemIds)
        return items.length > 0 ? { key, label, items } : null
      })
      .filter((row): row is VisibleCategory => row != null)
  }, [categoryEntries, itemsByCategory, allowedItemIds])

  const cardProps = {
    categoryImageByKey,
    selectedItems,
    locked,
    formatPrice,
    onToggleItem,
    tiramisuUnitPrice,
    localTiramisuValue,
    onTiramisuQuantityChange,
    onTiramisuQuantityBlur,
    resetKey: presetMenu ?? 'no-preset',
  }

  if (visibleCategories.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-warm-wood-dark/80">
        Nessun ingrediente disponibile per questa tipologia di prenotazione.
      </p>
    )
  }

  const count = visibleCategories.length

  return (
    <div className="w-full min-w-0" data-testid="booking-menu-compose-grid">
      {/* Mobile locked (menu preselezionato): griglia 2 colonne compatte */}
      {locked ? (
        <div className="grid grid-cols-2 items-start gap-2 md:hidden">
          <ComposeCategoryCards categories={visibleCategories} layout="grid" compact {...cardProps} />
        </div>
      ) : (
        /* Mobile free: colonna singola, card collassabili */
        <div className="flex flex-col items-stretch gap-[2px] md:hidden">
          <ComposeCategoryCards categories={visibleCategories} layout="stack" {...cardProps} />
        </div>
      )}

      {/* Desktop: griglia o carosello orizzontale — sempre almeno 2 col, max-w per evitare card enormi */}
      <div className="hidden md:block">
        {count <= 3 ? (
          <div
            className={cn(
              'grid w-full min-w-0 items-start gap-4',
              count === 1 ? 'grid-cols-2' : count === 2 ? 'grid-cols-2' : 'grid-cols-3',
            )}
          >
            <ComposeCategoryCards categories={visibleCategories} layout="grid" {...cardProps} />
          </div>
        ) : (
          <ComposeScrollRow categories={visibleCategories} {...cardProps} />
        )}
      </div>
    </div>
  )
}
