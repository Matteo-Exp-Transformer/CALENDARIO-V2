import React, { useMemo } from 'react'
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
      .filter((row): row is { key: string; label: string; items: ComposeMenuItem[] } => row != null)
  }, [categoryEntries, itemsByCategory, allowedItemIds])

  if (visibleCategories.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-warm-wood-dark/80">
        Nessun ingrediente disponibile per questa tipologia di prenotazione.
      </p>
    )
  }

  const useEqualColumns = visibleCategories.length <= 5

  return (
    <div
      className={cn(
        'w-full min-w-0 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-px-2',
        useEqualColumns && 'lg:grid lg:overflow-visible lg:snap-none lg:pb-0',
      )}
      style={
        useEqualColumns
          ? {
              gridTemplateColumns: `repeat(${visibleCategories.length}, minmax(0, 1fr))`,
            }
          : undefined
      }
      data-testid="booking-menu-compose-grid"
    >
      {visibleCategories.map(({ key, label, items }) => (
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
        />
      ))}
    </div>
  )
}
