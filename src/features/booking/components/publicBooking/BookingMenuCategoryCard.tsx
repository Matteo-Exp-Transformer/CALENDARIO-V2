import React from 'react'
import { Utensils } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SelectedMenuItem } from '@/types/menu'
import {
  MENU_COMPOSE_CATEGORY_LIMITS,
  type ComposeMenuItem,
  countSelectedInCategory,
  selectionStatusLabel,
} from '../../utils/menuComposeVisibility'

const TIRAMISU_MIN_KG = 1
const TIRAMISU_MAX_KG = 7

const isTiramisuItem = (itemName: string): boolean =>
  itemName.toLowerCase().includes('tiramis')

export interface BookingMenuCategoryCardProps {
  categoryKey: string
  categoryLabel: string
  imageUrl?: string | null
  items: ComposeMenuItem[]
  selectedItems: SelectedMenuItem[]
  locked: boolean
  formatPrice: (item: ComposeMenuItem) => string
  onToggleItem: (item: ComposeMenuItem) => void
  tiramisuUnitPrice: number
  localTiramisuValue: string
  onTiramisuQuantityChange: (value: string) => void
  onTiramisuQuantityBlur: () => void
  /** `scroll` = card a larghezza fissa nella strip orizzontale; `grid` = colonna fluida in griglia. */
  layout?: 'grid' | 'scroll'
}

export const BookingMenuCategoryCard: React.FC<BookingMenuCategoryCardProps> = ({
  categoryKey,
  categoryLabel,
  imageUrl,
  items,
  selectedItems,
  locked,
  formatPrice,
  onToggleItem,
  tiramisuUnitPrice,
  localTiramisuValue,
  onTiramisuQuantityChange,
  onTiramisuQuantityBlur,
  layout = 'grid',
}) => {
  const selectedCount = countSelectedInCategory(selectedItems, categoryKey)
  const { hint, status } = selectionStatusLabel(categoryKey, selectedCount)
  const maxSelectable = MENU_COMPOSE_CATEGORY_LIMITS[categoryKey]
  const useRadioAppearance = maxSelectable === 1

  const heroSrc = imageUrl?.trim() || undefined

  return (
    <article
      className={cn(
        'flex flex-col rounded-2xl border-2 border-black/15 bg-white/90 backdrop-blur-[1px] shadow-md',
        layout === 'scroll'
          ? 'w-[min(280px,calc(100vw-3rem))] min-w-[240px] max-w-[280px] shrink-0 snap-center sm:min-w-[260px]'
          : 'w-full min-w-0 max-w-none',
      )}
      data-testid={`booking-menu-category-card-${categoryKey}`}
    >
      <div className="border-b border-black/10 px-4 py-3 text-center">
        <h3 className="text-sm font-bold uppercase tracking-wide text-warm-wood">
          {categoryLabel}
        </h3>
      </div>

      <div className="relative mx-3 mt-3 aspect-[4/3] overflow-hidden rounded-xl bg-warm-beige/40">
        {heroSrc ? (
          <img
            src={heroSrc}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-warm-wood/40">
            <Utensils className="h-10 w-10" strokeWidth={1.25} />
          </div>
        )}
      </div>

      <div className="px-4 py-2 text-center">
        <p className="text-xs font-semibold text-warm-wood-dark/70">{hint}</p>
        <p className="text-xs font-bold text-warm-orange">{status}</p>
      </div>

      <ul className="flex flex-1 flex-col gap-1 px-2 pb-3">
        {items.map((item) => {
          const isSelected = selectedItems.some((s) => s.id === item.id)
          const isTiramisu = isTiramisuItem(item.name)
          const hasDesc = Boolean(item.description?.trim())
          const inputId = `compose-${categoryKey}-${item.id}`

          return (
            <li key={item.id} className="min-w-0">
              <label
                htmlFor={inputId}
                className={cn(
                  'flex min-h-[44px] cursor-pointer gap-2.5 rounded-xl px-2 py-2 transition-colors',
                  locked && 'cursor-default',
                  isSelected && 'bg-warm-orange/10',
                  !locked && !isSelected && 'hover:bg-warm-beige/50',
                )}
              >
                <input
                  id={inputId}
                  type={useRadioAppearance ? 'radio' : 'checkbox'}
                  name={useRadioAppearance ? `compose-${categoryKey}` : undefined}
                  checked={isSelected}
                  disabled={locked}
                  onChange={() => onToggleItem(item)}
                  className={cn(
                    'mt-1 h-4 w-4 shrink-0 accent-warm-orange',
                    locked && 'opacity-70',
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold leading-snug text-warm-wood break-words">
                      {item.name}
                    </span>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-warm-wood">
                      {formatPrice(item)}
                    </span>
                  </span>
                  {hasDesc ? (
                    <span className="mt-0.5 block text-xs leading-snug text-warm-wood-dark/65 break-words">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </label>

              {isTiramisu && isSelected ? (
                <div className="mx-2 mb-2 rounded-xl border border-black/15 bg-white/95 px-3 py-2">
                  <label
                    htmlFor={`tiramisu-${item.id}`}
                    className="mb-1 block text-xs font-semibold text-warm-wood"
                  >
                    Quanti Kg di Tiramisù? ({TIRAMISU_MIN_KG}-{TIRAMISU_MAX_KG})
                  </label>
                  <input
                    id={`tiramisu-${item.id}`}
                    type="number"
                    min={TIRAMISU_MIN_KG}
                    max={TIRAMISU_MAX_KG}
                    inputMode="numeric"
                    value={localTiramisuValue}
                    disabled={locked}
                    onChange={(e) => onTiramisuQuantityChange(e.target.value)}
                    onBlur={onTiramisuQuantityBlur}
                    className="w-full rounded-lg border border-warm-wood/40 px-2 py-1.5 text-sm font-semibold text-gray-800 focus:border-warm-wood focus:ring-2 focus:ring-warm-wood/30 disabled:opacity-70"
                  />
                  <p className="mt-1 text-[10px] text-gray-500">
                    €{tiramisuUnitPrice.toFixed(2)} al Kg
                  </p>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </article>
  )
}
