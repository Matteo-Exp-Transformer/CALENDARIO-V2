import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { CollapsibleCard } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useMenuItems } from '../hooks/useMenuItems'
import { useMenuCategories } from '../hooks/useMenuCategories'
import type { SelectedMenuItem } from '@/types/menu'
import { isCaraffeDrinkPremium, isCaraffeDrinkStandard } from '../utils/caraffePricing'
import { groupMenuItemsByCategory } from '../utils/menuCatalogGrouping'
import {
  MENU_CATEGORY_COLLAPSIBLE_CLASS,
  MENU_CATEGORY_COLLAPSIBLE_HEADER_CLASS,
  MENU_CATEGORY_LABEL_TITLE_CLASS,
  MENU_CATEGORY_LABEL_TITLE_STYLE,
  MENU_INGREDIENT_DESC_CLASS,
  MENU_INGREDIENT_NAME_CLASS,
  MENU_INGREDIENT_OVERVIEW_GRID_CLASS,
  MENU_INGREDIENT_PRICE_CLASS,
} from './menuPricesCatalogLayout'

const DEFAULT_TIRAMISU_KG = 1
const TIRAMISU_MIN_KG = 1
const TIRAMISU_MAX_KG = 7

const isTiramisuItem = (itemName: string): boolean => itemName.toLowerCase().includes('tiramis')

type NormalizedMenuItem = {
  id: string
  name: string
  price: number
  category: string
  description?: string
  sort_order: number
  priceSuffix?: string
}

const clampTiramisuQuantity = (qty: number): number => {
  if (Number.isNaN(qty) || qty <= 0) return 0
  return Math.min(TIRAMISU_MAX_KG, Math.max(TIRAMISU_MIN_KG, qty))
}

export interface PresetMenuBuilderProps {
  /** Righe selezionate come in Booking / MenuSelection */
  selectedItems: SelectedMenuItem[]
  onSelectionChange: (items: SelectedMenuItem[]) => void
}

/** Selezione ingredienti con la stessa UX visiva della panoramica «Modifica Ingredienti». */
export const PresetMenuBuilder: React.FC<PresetMenuBuilderProps> = ({
  selectedItems,
  onSelectionChange,
}) => {
  const { data: menuItems = [], isLoading, error } = useMenuItems()
  const { data: dbCategories = [] } = useMenuCategories()

  const normalizedMenuItems = useMemo<NormalizedMenuItem[]>(() => {
    return menuItems.map<NormalizedMenuItem>((item) => {
      const lowerName = item.name.toLowerCase()
      const priceSuffix =
        lowerName.includes('tiramis') && item.category === 'dolci' ? ' al Kg' : undefined

      return {
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description ?? undefined,
        sort_order: item.sort_order ?? 0,
        priceSuffix,
      }
    })
  }, [menuItems])

  const tiramisuUnitPrice = useMemo(() => {
    const tiramisuItem = normalizedMenuItems.find((item) => isTiramisuItem(item.name))
    return tiramisuItem?.price ?? 20
  }, [normalizedMenuItems])

  const categoryEntries = useMemo(
    () => dbCategories.map((category) => [category.key, category.label] as const),
    [dbCategories],
  )

  const itemsByCategory = useMemo(
    () =>
      groupMenuItemsByCategory(
        normalizedMenuItems,
        categoryEntries.map(([key]) => key),
      ),
    [categoryEntries, normalizedMenuItems],
  )

  const emitChange = useCallback(
    (items: SelectedMenuItem[]) => {
      const itemsWithTotals = items.map((selected) => {
        if (isTiramisuItem(selected.name)) {
          const rawQuantity = selected.quantity ?? DEFAULT_TIRAMISU_KG
          const clampedQuantity = clampTiramisuQuantity(rawQuantity)
          const totalPrice = clampedQuantity > 0 ? tiramisuUnitPrice * clampedQuantity : 0
          return {
            ...selected,
            quantity: clampedQuantity > 0 ? clampedQuantity : undefined,
            totalPrice: totalPrice > 0 ? totalPrice : undefined,
          }
        }
        return { ...selected, totalPrice: selected.totalPrice ?? selected.price }
      })
      onSelectionChange(itemsWithTotals)
    },
    [onSelectionChange, tiramisuUnitPrice],
  )

  const handleItemToggle = (item: NormalizedMenuItem) => {
    const isSelected = selectedItems.some((selected) => selected.id === item.id)

    if (isSelected) {
      emitChange(selectedItems.filter((selected) => selected.id !== item.id))
      return
    }

    let updatedItems: SelectedMenuItem[] = selectedItems

    if (item.category === 'bevande') {
      const isCaraffe = isCaraffeDrinkStandard(item.name) || isCaraffeDrinkPremium(item.name)
      if (isCaraffe) {
        updatedItems = selectedItems.filter(
          (selected) =>
            !(
              selected.category === 'bevande' &&
              (isCaraffeDrinkStandard(selected.name) || isCaraffeDrinkPremium(selected.name))
            ),
        )
      }
    }

    const newItem: SelectedMenuItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
    }

    if (isTiramisuItem(item.name)) {
      newItem.quantity = DEFAULT_TIRAMISU_KG
      newItem.totalPrice = item.price * DEFAULT_TIRAMISU_KG
    }

    emitChange([
      ...updatedItems.filter((selected) => selected.id !== item.id),
      newItem,
    ])
  }

  const [localTiramisuValue, setLocalTiramisuValue] = useState<string>('')
  const isInitializedRef = React.useRef(false)
  const tiramisuKg = selectedItems.find((item) => isTiramisuItem(item.name))?.quantity ?? 0

  useEffect(() => {
    if (!isInitializedRef.current && tiramisuKg > 0) {
      setLocalTiramisuValue(String(tiramisuKg))
      isInitializedRef.current = true
    } else if (tiramisuKg === 0 && localTiramisuValue !== '') {
      setLocalTiramisuValue('')
    }
  }, [tiramisuKg, localTiramisuValue])

  const handleTiramisuQuantityChange = (value: string) => {
    setLocalTiramisuValue(value)

    const trimmed = value.trim()
    if (trimmed === '') {
      const itemsWithoutQuantity = selectedItems.map((item) =>
        isTiramisuItem(item.name) ? { ...item, quantity: undefined, totalPrice: undefined } : item,
      )
      emitChange(itemsWithoutQuantity)
      return
    }

    if (!/^\d+$/.test(trimmed)) {
      return
    }

    const parsed = Number.parseInt(trimmed, 10)
    if (Number.isNaN(parsed)) {
      return
    }

    if (parsed > TIRAMISU_MAX_KG) {
      const clamped = TIRAMISU_MAX_KG
      setLocalTiramisuValue(String(clamped))
      const updatedItems = selectedItems.map((item) =>
        isTiramisuItem(item.name)
          ? { ...item, quantity: clamped, totalPrice: clamped > 0 ? tiramisuUnitPrice * clamped : undefined }
          : item,
      )
      emitChange(updatedItems)
      return
    }

    if (parsed < TIRAMISU_MIN_KG) {
      return
    }

    const updatedItems = selectedItems.map((item) =>
      isTiramisuItem(item.name)
        ? {
            ...item,
            quantity: parsed,
            totalPrice: parsed > 0 ? tiramisuUnitPrice * parsed : undefined,
          }
        : item,
    )
    emitChange(updatedItems)
  }

  const handleTiramisuQuantityBlur = () => {
    const trimmed = localTiramisuValue.trim()
    if (trimmed === '') {
      const itemsWithoutQuantity = selectedItems.map((item) =>
        isTiramisuItem(item.name) ? { ...item, quantity: undefined, totalPrice: undefined } : item,
      )
      emitChange(itemsWithoutQuantity)
      return
    }

    const parsed = Number.parseInt(trimmed, 10)
    if (Number.isNaN(parsed) || parsed < TIRAMISU_MIN_KG) {
      const clamped = DEFAULT_TIRAMISU_KG
      setLocalTiramisuValue(String(clamped))
      const updatedItems = selectedItems.map((item) =>
        isTiramisuItem(item.name)
          ? {
              ...item,
              quantity: clamped,
              totalPrice: clamped > 0 ? tiramisuUnitPrice * clamped : undefined,
            }
          : item,
      )
      emitChange(updatedItems)
    } else if (parsed > TIRAMISU_MAX_KG) {
      const clamped = TIRAMISU_MAX_KG
      setLocalTiramisuValue(String(clamped))
      const updatedItems = selectedItems.map((item) =>
        isTiramisuItem(item.name)
          ? {
              ...item,
              quantity: clamped,
              totalPrice: clamped > 0 ? tiramisuUnitPrice * clamped : undefined,
            }
          : item,
      )
      emitChange(updatedItems)
    }
  }

  const formatPrice = (item: NormalizedMenuItem) =>
    `€${item.price.toFixed(2)}${item.priceSuffix ?? ''}`

  if (isLoading) {
    return <div className="py-8 text-center text-sm text-gray-600">Caricamento menu...</div>
  }

  if (error) {
    return <p className="py-8 text-center text-sm text-red-600">Errore nel caricamento del menu.</p>
  }

  if (categoryEntries.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-600">
        Nessuna categoria configurata. Aggiungine una dalla gestione categorie.
      </p>
    )
  }

  return (
    <div className={cn(MENU_INGREDIENT_OVERVIEW_GRID_CLASS, 'mt-6')}>
      {categoryEntries.map(([categoryKey, categoryLabel]) => {
        const categoryItems = itemsByCategory[categoryKey] ?? []
        const itemCount = categoryItems.length

        return (
          <CollapsibleCard
            key={categoryKey}
            title={categoryLabel}
            subtitle={
              <span className="text-xs font-semibold text-(--color-text-muted) sm:text-sm">
                {itemCount} {itemCount === 1 ? 'ingrediente' : 'ingredienti'}
              </span>
            }
            defaultExpanded={false}
            className={MENU_CATEGORY_COLLAPSIBLE_CLASS}
            headerClassName={MENU_CATEGORY_COLLAPSIBLE_HEADER_CLASS}
            contentClassName="bg-transparent p-0"
            titleClassName={cn(MENU_CATEGORY_LABEL_TITLE_CLASS, 'break-words')}
            titleStyle={MENU_CATEGORY_LABEL_TITLE_STYLE}
          >
            <div className="flex flex-col gap-2 px-1 pb-3 pt-0.5 sm:px-2">
              {itemCount === 0 ? (
                <p className="px-2 py-4 text-center text-xs text-(--color-text-muted) sm:text-sm">
                  Nessun ingrediente in questa categoria.
                </p>
              ) : (
                categoryItems.map((item) => {
                  const isSelected = selectedItems.some((selected) => selected.id === item.id)
                  const isTiramisu = isTiramisuItem(item.name)
                  const hasDesc = Boolean(item.description?.trim())

                  return (
                    <div key={item.id} className="flex w-full min-w-0 flex-col items-stretch gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleItemToggle(item)}
                        aria-pressed={isSelected}
                        className={cn(
                          'menu-prices-item-row w-full min-w-0 flex-col items-stretch gap-1 py-2.5 px-3',
                          !hasDesc && 'min-h-0 items-center',
                          isSelected && 'menu-prices-item-row--selected',
                        )}
                        style={{
                          minHeight: hasDesc ? undefined : '3rem',
                        }}
                      >
                        <div className="flex w-full min-w-0 items-center justify-between gap-2">
                          <p className={cn(MENU_INGREDIENT_NAME_CLASS, 'menu-prices-item-text break-words')}>
                            {item.name}
                          </p>
                          <span className={MENU_INGREDIENT_PRICE_CLASS}>{formatPrice(item)}</span>
                        </div>
                        {hasDesc ? (
                          <p className={cn(MENU_INGREDIENT_DESC_CLASS, 'break-words')}>{item.description}</p>
                        ) : null}
                      </button>
                      {isTiramisu && isSelected ? (
                        <div className="w-full min-w-0 rounded-xl border-2 border-black/20 bg-white/85 px-4 py-3">
                          <label
                            htmlFor={`preset-tiramisu-qty-${item.id}`}
                            className="mb-2 block text-sm font-semibold text-warm-wood"
                          >
                            Quanti Kg di Tiramisù (1-7)?
                          </label>
                          <input
                            id={`preset-tiramisu-qty-${item.id}`}
                            type="number"
                            min={TIRAMISU_MIN_KG}
                            max={TIRAMISU_MAX_KG}
                            inputMode="numeric"
                            value={localTiramisuValue}
                            onChange={(e) => handleTiramisuQuantityChange(e.target.value)}
                            onBlur={handleTiramisuQuantityBlur}
                            className="w-full rounded-lg border border-warm-wood/40 px-3 py-2 text-base font-semibold"
                          />
                          <p className="mt-2 text-xs text-gray-500">
                            €{tiramisuUnitPrice.toFixed(2)} al Kg
                          </p>
                        </div>
                      ) : null}
                    </div>
                  )
                })
              )}
            </div>
          </CollapsibleCard>
        )
      })}
    </div>
  )
}
