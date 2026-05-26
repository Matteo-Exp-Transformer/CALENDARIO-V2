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
  categoryImageByKey,
  selectedItems,
  locked,
  formatPrice,
  onToggleItem,
  tiramisuUnitPrice,
  localTiramisuValue,
  onTiramisuQuantityChange,
  onTiramisuQuantityBlur,
}: {
  categories: VisibleCategory[]
  layout: 'grid' | 'scroll' | 'stack'
  categoryImageByKey: Record<string, string | null | undefined>
  selectedItems: SelectedMenuItem[]
  locked: boolean
  formatPrice: (item: ComposeMenuItem) => string
  onToggleItem: (item: ComposeMenuItem) => void
  tiramisuUnitPrice: number
  localTiramisuValue: string
  onTiramisuQuantityChange: (value: string) => void
  onTiramisuQuantityBlur: () => void
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
          className="absolute left-0 top-0 bottom-0 z-20 hidden md:flex w-10 items-center justify-center rounded-r-md border border-slate-200/80 bg-white/95 text-warm-wood shadow-sm hover:bg-white"
          onClick={() => scrollBy(-COMPOSE_SCROLL_STEP_PX)}
        >
          <ChevronLeft size={22} strokeWidth={1.75} />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex w-full min-w-0 flex-nowrap gap-4 overflow-x-auto scroll-px-2 scrollbar-hide snap-x snap-mandatory py-1 md:px-10"
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
        />
      </div>
      {canScrollRight && (
        <button
          type="button"
          aria-label="Scorri categorie menù avanti"
          className="absolute right-0 top-0 bottom-0 z-20 hidden md:flex w-10 items-center justify-center rounded-l-md border border-slate-200/80 bg-white/95 text-warm-wood shadow-sm hover:bg-white"
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
  }

  if (visibleCategories.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-warm-wood-dark/80">
        Nessun ingrediente disponibile per questa tipologia di prenotazione.
      </p>
    )
  }

  const count = visibleCategories.length
  const scrollOnDesktop = count > 3
  const gridOnDesktop = count <= 3

  return (
    <div className="w-full min-w-0" data-testid="booking-menu-compose-grid">
      {/* Mobile: colonna singola, card collassabili — larghezza piena come header */}
      <div className="flex flex-col items-stretch gap-2.5 md:hidden">
        <ComposeCategoryCards categories={visibleCategories} layout="stack" {...cardProps} />
      </div>

      {/* Desktop: griglia o carosello orizzontale */}
      <div className="hidden md:block">
        {gridOnDesktop ? (
          <div
            className={cn(
              'grid w-full min-w-0 gap-4',
              count <= 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3',
            )}
          >
            <ComposeCategoryCards categories={visibleCategories} layout="grid" {...cardProps} />
          </div>
        ) : scrollOnDesktop ? (
          <ComposeScrollRow categories={visibleCategories} {...cardProps} />
        ) : null}
      </div>
    </div>
  )
}
