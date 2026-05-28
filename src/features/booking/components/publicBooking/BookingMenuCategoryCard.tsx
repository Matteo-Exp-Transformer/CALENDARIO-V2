import React, { useState } from 'react'
import { ChevronDown, Utensils } from 'lucide-react'
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
  /** `scroll` = strip orizzontale; `grid` = griglia desktop; `stack` = colonna mobile con collapse. */
  layout?: 'grid' | 'scroll' | 'stack'
  resetKey?: string
  /** Riduce padding e testo per griglie strette (es. 3 col su mobile). */
  compact?: boolean
}

function ItemPriceRow({
  item,
  formatPrice,
}: {
  item: ComposeMenuItem
  formatPrice: (item: ComposeMenuItem) => string
}) {
  const hasDesc = Boolean(item.description?.trim())
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold leading-snug text-warm-wood wrap-break-word">{item.name}</span>
        <span className="shrink-0 text-sm font-bold tabular-nums text-warm-wood">
          {formatPrice(item)}
        </span>
      </div>
      {hasDesc ? (
        <span className="mt-0.5 block text-xs leading-snug text-warm-wood-dark/65 wrap-break-word">
          {item.description}
        </span>
      ) : null}
    </div>
  )
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
  resetKey,
  compact = false,
}) => {
  const selectedCount = countSelectedInCategory(selectedItems, categoryKey)
  const { hint, status } = selectionStatusLabel(categoryKey, selectedCount)
  const maxSelectable = MENU_COMPOSE_CATEGORY_LIMITS[categoryKey]
  const useRadioAppearance = maxSelectable === 1

  const heroSrc = imageUrl?.trim() || undefined
  const [expanded, setExpanded] = useState(false)

  React.useEffect(() => {
    setExpanded(false)
  }, [resetKey])

  const articleClass = cn(
    'flex flex-col border-2 border-black/15 bg-white/90 backdrop-blur-[1px] shadow-md',
    layout === 'scroll'
      ? 'w-[min(280px,calc(100vw-4rem))] min-w-[240px] max-w-[280px] shrink-0 snap-center rounded-2xl sm:min-w-[260px]'
      : layout === 'stack'
        ? 'w-full min-w-0 max-w-none rounded-xl'
        : 'w-full min-w-0 self-start rounded-2xl',
  )

  const itemsList = (
    <ul className="flex flex-col gap-px px-0 pb-2">
        {items.map((item) => {
          const isSelected = selectedItems.some((s) => s.id === item.id)
          const isTiramisu = isTiramisuItem(item.name)
          const selection = selectedItems.find((s) => s.id === item.id)
          const inputId = `compose-${categoryKey}-${item.id}`
          const itemImageSrc = item.image_url?.trim() || undefined

          if (locked) {
            return (
              <li key={item.id} className="min-w-0">
                <div className="min-w-0 rounded-xl px-2 py-2">
                  {itemImageSrc ? (
                    <div className="mb-2 aspect-4/3 overflow-hidden rounded-lg border border-black/10 bg-warm-beige/20 sm:aspect-3/2">
                      <img src={itemImageSrc} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ) : null}
                  <div className="flex min-h-[44px] gap-2.5">
                    <ItemPriceRow item={item} formatPrice={formatPrice} />
                  </div>
                </div>
                {isTiramisu && selection?.quantity ? (
                  <p className="mx-2 mb-2 text-xs font-semibold text-warm-wood-dark/80">
                    {selection.quantity} Kg — €{tiramisuUnitPrice.toFixed(2)} al Kg
                  </p>
                ) : null}
              </li>
            )
          }

          return (
            <li key={item.id} className="min-w-0">
              <label
                htmlFor={inputId}
                className={cn(
                  'flex cursor-pointer flex-col rounded-xl px-2 py-2 transition-colors',
                  isSelected && 'bg-warm-orange/10',
                  !isSelected && 'hover:bg-warm-beige/50',
                )}
              >
                {itemImageSrc ? (
                  <div className="mb-2 aspect-4/3 overflow-hidden rounded-lg border border-black/10 bg-warm-beige/20 sm:aspect-3/2">
                    <img src={itemImageSrc} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ) : null}
                <div className="flex min-h-[44px] gap-2.5">
                  <input
                    id={inputId}
                    type={useRadioAppearance ? 'radio' : 'checkbox'}
                    name={useRadioAppearance ? `compose-${categoryKey}` : undefined}
                    checked={isSelected}
                    onChange={() => onToggleItem(item)}
                    className="mt-1 h-4 w-4 shrink-0 accent-warm-orange"
                  />
                  <ItemPriceRow item={item} formatPrice={formatPrice} />
                </div>
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
                    onChange={(e) => onTiramisuQuantityChange(e.target.value)}
                    onBlur={onTiramisuQuantityBlur}
                    className="w-full rounded-lg border border-warm-wood/40 px-2 py-1.5 text-sm font-semibold text-gray-800 focus:border-warm-wood focus:ring-2 focus:ring-warm-wood/30"
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
  )

  const headerId = `booking-menu-cat-header-${categoryKey}`
  const panelId = `booking-menu-cat-panel-${categoryKey}`
  const lockedOpenSummary = selectedCount > 0 ? 'Incluso nel menù' : 'Menù preselezionato'
  const lockedClosedTeaser = 'Scopri cosa è incluso'
  // Card chiusa: aspect-ratio fisso 4/3 indipendente dal layout, così la foto resta
  // proporzionata sia in colonna stretta (mobile) che in colonna larga (tablet/desktop).
  // Su mobile stack la card prende tutta la larghezza form: 4/3 produce un'altezza
  // visiva coerente (es. 400×300 anziché un nastro 600×148 sproporzionato).
  const closedImageClass = layout === 'stack' ? 'aspect-video sm:aspect-4/3' : 'aspect-4/3'

  if (!expanded) {
    return (
      <article className={articleClass} data-testid={`booking-menu-category-card-${categoryKey}`}>
        <button
          type="button"
          id={headerId}
          aria-expanded={false}
          aria-controls={panelId}
          className="group relative block w-full overflow-hidden rounded-[inherit] text-left"
          onClick={() => setExpanded(true)}
        >
          <div className={cn('relative w-full overflow-hidden bg-warm-beige/40', closedImageClass)}>
            {heroSrc ? (
              <img
                src={heroSrc}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-warm-wood/40">
                <Utensils className="h-10 w-10" strokeWidth={1.25} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className={cn('absolute inset-x-0 bottom-0 flex items-end gap-1 text-white', compact ? 'p-1.5' : 'p-4 gap-3')}>
              <div className="min-w-0 flex-1 overflow-hidden">
                <h3 className={cn('font-bold uppercase leading-tight', compact ? 'text-[10px] tracking-tight line-clamp-2' : 'text-base tracking-wide sm:text-lg')}>
                  {categoryLabel}
                </h3>
                {!compact && (
                  <p className={cn('mt-1 font-bold text-white/85', locked ? 'text-sm' : 'text-xs')}>
                    {!locked ? status : lockedClosedTeaser}
                  </p>
                )}
              </div>
              <ChevronDown className={cn('shrink-0', compact ? 'h-3 w-3' : 'h-5 w-5')} aria-hidden />
            </div>
          </div>
        </button>
      </article>
    )
  }

  return (
    <article className={articleClass} data-testid={`booking-menu-category-card-${categoryKey}`}>
      <button
        type="button"
        id={headerId}
        aria-expanded={true}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 border-b border-black/10 px-4 py-3 text-left"
        onClick={() => setExpanded(false)}
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold uppercase tracking-wide text-warm-wood sm:text-base">
            {categoryLabel}
          </h3>
          {!locked ? (
            <div className="mt-1">
              <p className="text-xs font-semibold text-warm-wood-dark/70">{hint}</p>
              <p className="text-xs font-bold text-warm-orange">{status}</p>
            </div>
          ) : (
            <p className="mt-1 text-sm font-semibold text-warm-wood-dark/70">{lockedOpenSummary}</p>
          )}
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 rotate-180 text-warm-wood" aria-hidden />
      </button>
      <div id={panelId} role="region" aria-labelledby={headerId}>
        {itemsList}
      </div>
    </article>
  )
}
