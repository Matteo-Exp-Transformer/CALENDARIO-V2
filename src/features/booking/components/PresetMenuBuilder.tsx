import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useMenuItems } from '../hooks/useMenuItems'
import { useMenuCategories } from '../hooks/useMenuCategories'
import type { SelectedMenuItem } from '@/types/menu'
import { isCaraffeDrinkPremium, isCaraffeDrinkStandard } from '../utils/caraffePricing'

const CATEGORY_LIMITS: Partial<Record<string, number>> = {
  bevande: 1,
  antipasti: 3,
  primi: 1,
  secondi: 3,
}

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

/** Stessa UX di selezione ingredienti della pagina prenota (limiti di categoria, caraffe, tiramisù). */
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

  const orderedCategories = useMemo(() => {
    const fromDb = dbCategories.map((category) => category.key)
    const withItems = normalizedMenuItems
      .map((item) => item.category)
      .filter((category, idx, arr) => arr.indexOf(category) === idx)
    const merged = [...fromDb]
    withItems.forEach((category) => {
      if (!merged.includes(category)) {
        merged.push(category)
      }
    })
    return merged
  }, [dbCategories, normalizedMenuItems])

  const categoryLabels = useMemo(() => {
    const map = new Map<string, string>()
    dbCategories.forEach((category) => {
      map.set(category.key, category.label)
    })
    return map
  }, [dbCategories])

  const itemsByCategory = useMemo(() => {
    const grouped = orderedCategories.reduce((acc, category) => {
      acc[category] = []
      return acc
    }, {} as Record<string, NormalizedMenuItem[]>)

    normalizedMenuItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })

    orderedCategories.forEach((category) => {
      grouped[category]?.sort((a, b) => {
        if (a.sort_order === b.sort_order) {
          return a.name.localeCompare(b.name)
        }
        return a.sort_order - b.sort_order
      })
    })

    return grouped
  }, [orderedCategories, normalizedMenuItems])

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

    if (item.category === 'antipasti') {
      const antipastiCount = selectedItems.filter((s) => s.category === 'antipasti').length
      if (antipastiCount >= 3) {
        window.alert('Puoi scegliere massimo 3 antipasti')
        return
      }
    }

    const limit = CATEGORY_LIMITS[item.category]
    if (typeof limit === 'number') {
      const categoryCount = updatedItems.filter((s) => s.category === item.category).length
      if (limit === 1) {
        updatedItems = updatedItems.filter((selected) => selected.category !== item.category)
      } else if (categoryCount >= limit) {
        window.alert(`Puoi scegliere massimo ${limit} elementi in questa categoria`)
        return
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
    return <div className="text-center py-4 text-gray-600">Caricamento menu...</div>
  }

  if (error) {
    return <p className="text-red-600 text-center">Errore nel caricamento del menu.</p>
  }

  return (
    <div className="isolate w-full max-w-4xl mx-auto space-y-6">
      {orderedCategories.map((category) => {
        const label = categoryLabels.get(category) ?? category
        const items = itemsByCategory[category] || []
        if (!items?.length) return null

        const selectedCount = selectedItems.filter((i) => i.category === category).length
        let counterText: string | null = null
        if (category === 'bevande') {
          const caraffeCount = selectedItems.filter(
            (i) =>
              i.category === 'bevande' &&
              (isCaraffeDrinkStandard(i.name) || isCaraffeDrinkPremium(i.name)),
          ).length
          const limit = CATEGORY_LIMITS[category]
          counterText =
            typeof limit === 'number'
              ? `(${caraffeCount}/${limit} selezionat${caraffeCount === 1 ? 'a' : 'e'})`
              : `(${caraffeCount} selezionat${caraffeCount === 1 ? 'a' : 'e'})`
        } else {
          const limit = CATEGORY_LIMITS[category]
          if (typeof limit === 'number') {
            counterText = `(${selectedCount}/${limit} selezionat${selectedCount === 1 ? 'o' : 'i'})`
          } else if (selectedCount > 0) {
            counterText = `(${selectedCount} selezionat${selectedCount === 1 ? 'o' : 'i'})`
          }
        }

        return (
          <div key={category} className="w-full flex flex-col items-center px-1">
            <h3
              className="text-lg md:text-xl border-b border-gray-300 pb-2 flex items-center justify-between w-full rounded-xl px-4 py-2"
              style={{
                color: '#2563EB',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                fontWeight: 700,
              }}
            >
              <span>{label}</span>
              {counterText ? <span className="text-sm text-gray-600">{counterText}</span> : null}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full justify-items-center pt-3">
              {items.map((item) => {
                const isSelected = selectedItems.some((selected) => selected.id === item.id)
                const isTiramisu = isTiramisuItem(item.name)
                return (
                  <div key={item.id} className="flex w-full flex-col items-stretch gap-2 max-w-[560px]">
                    <button
                      type="button"
                      onClick={() => handleItemToggle(item)}
                      aria-pressed={isSelected}
                      className={`
                        flex w-full cursor-pointer flex-col items-stretch rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-wood/50 focus-visible:ring-offset-2
                        ${isTiramisu && isSelected ? 'border-warm-orange/60' : ''}
                      `}
                      style={{
                        minHeight: '80px',
                        height: item.description ? 'auto' : '80px',
                        backgroundColor: isSelected ? 'rgba(245, 222, 179, 0.85)' : 'rgba(255, 255, 255, 0.92)',
                        borderColor: isSelected ? '#8B4513' : 'rgba(0,0,0,0.2)',
                        padding: '8px',
                        borderRadius: '16px',
                        justifyContent: item.description ? undefined : 'center',
                        overflow: 'hidden',
                      }}
                    >
                      <div className="flex min-w-0 w-full flex-row flex-nowrap items-center justify-between gap-2">
                        <span className="min-w-0 flex-1 font-bold text-base break-words text-gray-800">
                          {item.name}
                        </span>
                        <span className="shrink-0 font-bold text-warm-wood whitespace-nowrap">
                          {formatPrice(item)}
                        </span>
                      </div>
                      {item.description ? (
                        <p className="mt-0.5 w-full min-w-0 text-left text-sm font-semibold leading-snug break-words text-gray-600 md:text-base">
                          {item.description}
                        </p>
                      ) : null}
                    </button>
                    {isTiramisu && isSelected && (
                      <div className="w-full border-2 rounded-xl px-4 py-3 bg-white/90" style={{ borderColor: 'rgba(0,0,0,0.2)' }}>
                        <label htmlFor="admin-tiramisu-qty" className="text-sm font-semibold text-warm-wood block mb-2">
                          Quanti Kg di Tiramisù (1-7)?
                        </label>
                        <input
                          id="admin-tiramisu-qty"
                          type="number"
                          min={TIRAMISU_MIN_KG}
                          max={TIRAMISU_MAX_KG}
                          inputMode="numeric"
                          value={localTiramisuValue}
                          onChange={(e) => handleTiramisuQuantityChange(e.target.value)}
                          onBlur={handleTiramisuQuantityBlur}
                          className="w-full rounded-lg border border-warm-wood/40 px-3 py-2 text-base font-semibold"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Ogni Kg €{tiramisuUnitPrice.toFixed(2)} — il cliente potrà modificarlo in prenotazione.
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
