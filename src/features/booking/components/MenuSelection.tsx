import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { useMenuItems } from '../hooks/useMenuItems'
import { useMenuCategories } from '../hooks/useMenuCategories'
import type { SelectedMenuItem } from '@/types/menu'
import {
  customPresetStorageId,
  getPresetMenu,
  getPresetMenuLabel,
  isBuiltinPresetMenuType,
  isCustomPresetMenuType,
  isStaffPresetSelectableForBookingType,
  type CustomStaffPreset,
  type PresetMenuType,
} from '../constants/presetMenus'
import { isCaraffeDrinkPremium, isCaraffeDrinkStandard } from '../utils/caraffePricing'
import { VOL_AU_VENT_THRESHOLD_EUR } from '../constants/volAuVentPromo'
import type { BookingType } from '@/types/booking'
import { normalizeMenuItemBookingTypes } from '@/types/menu'
import { bookingTypeUsesMenuSelections } from '../utils/bookingTypeMenu'

interface MenuSelectionProps {
  selectedItems: SelectedMenuItem[]
  numGuests: number
  onMenuChange: (payload: {
    items: SelectedMenuItem[]
    totalPerPerson: number
    tiramisuTotal: number
    tiramisuKg: number
  }) => void
  presetMenu?: PresetMenuType
  onPresetMenuChange?: (preset: PresetMenuType) => void
  bookingType?: BookingType
  /** Se false, nasconde il menu a tendina dei menù consigliati (impostazione admin). Default: true */
  staffPresetsDropdownVisible?: boolean
  /** Menù personalizzati dallo staff (da restaurant_settings). */
  customStaffPresets?: CustomStaffPreset[]
}

type NormalizedMenuItem = {
  id: string
  name: string
  price: number
  category: string
  description?: string
  sort_order: number
  priceSuffix?: string
}

const CATEGORY_LIMITS: Partial<Record<string, number>> = {
  bevande: 1,
  antipasti: 3,
  primi: 1,
  secondi: 3
}

const isTiramisuItem = (itemName: string): boolean =>
  itemName.toLowerCase().includes('tiramis')

const TIRAMISU_MIN_KG = 1
const TIRAMISU_MAX_KG = 7
const DEFAULT_TIRAMISU_KG = 1

// Virtual promotional item for Vol-au-vent
const VIRTUAL_VOL_AU_VENT_ID = 'virtual-vol-au-vent-promo'

const createVirtualVolAuVentItem = (): SelectedMenuItem => ({
  id: VIRTUAL_VOL_AU_VENT_ID,
  name: 'Mini Rustici Misti',
  price: 0,
  category: 'antipasti',
  totalPrice: 0
})

const isVolAuVentItem = (item: SelectedMenuItem): boolean =>
  item.id === VIRTUAL_VOL_AU_VENT_ID

const clampTiramisuQuantity = (qty: number): number => {
  if (Number.isNaN(qty) || qty <= 0) {
    return 0
  }
  return Math.min(TIRAMISU_MAX_KG, Math.max(TIRAMISU_MIN_KG, qty))
}

export const MenuSelection: React.FC<MenuSelectionProps> = ({
  selectedItems,
  numGuests,
  onMenuChange,
  presetMenu,
  onPresetMenuChange,
  bookingType,
  staffPresetsDropdownVisible = true,
  customStaffPresets = [],
}) => {
  const { data: menuItems = [], isLoading, error } = useMenuItems()
  const { data: dbCategories = [] } = useMenuCategories()
  const MENU_CARD_MAX_WIDTH_PX = 746

  const formatPrice = (item: NormalizedMenuItem) =>
    `€${item.price.toFixed(2)}${item.priceSuffix ?? ''}`
  const formatCurrency = (value: number) => `€${value.toFixed(2)}`

  const selectableStaffPresets = useMemo(
    () => customStaffPresets.filter((p) => isStaffPresetSelectableForBookingType(p, bookingType)),
    [customStaffPresets, bookingType],
  )

  const showStaffPresetDropdown = useMemo(() => {
    if (!bookingTypeUsesMenuSelections(bookingType) || !onPresetMenuChange || !staffPresetsDropdownVisible) {
      return false
    }
    if (selectableStaffPresets.length > 0) return true
    if (presetMenu != null && isBuiltinPresetMenuType(presetMenu)) return true
    if (
      presetMenu != null &&
      isCustomPresetMenuType(presetMenu) &&
      customStaffPresets.some((p) => customPresetStorageId(p.id) === presetMenu) &&
      !selectableStaffPresets.some((p) => customPresetStorageId(p.id) === presetMenu)
    ) {
      return true
    }
    if (
      presetMenu != null &&
      isCustomPresetMenuType(presetMenu) &&
      !customStaffPresets.some((p) => customPresetStorageId(p.id) === presetMenu)
    ) {
      return true
    }
    return false
  }, [
    bookingType,
    onPresetMenuChange,
    staffPresetsDropdownVisible,
    customStaffPresets,
    selectableStaffPresets,
    presetMenu,
  ])

  const normalizedMenuItems = useMemo<NormalizedMenuItem[]>(() => {
    return menuItems
      .filter((item) => {
        if (!bookingTypeUsesMenuSelections(bookingType)) {
          return true
        }
        const types = normalizeMenuItemBookingTypes(item.booking_types)
        return bookingType ? types.includes(bookingType) : true
      })
      .map<NormalizedMenuItem>((item) => {
        const lowerName = item.name.toLowerCase()
        const priceSuffix =
          lowerName.includes('tiramis') && item.category === 'dolci'
            ? ' al Kg'
            : undefined

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
  }, [menuItems, bookingType])

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

  const tiramisuUnitPrice = useMemo(() => {
    const tiramisuItem = normalizedMenuItems.find((item) => isTiramisuItem(item.name))
    return tiramisuItem?.price ?? 20
  }, [normalizedMenuItems])

  // Raggruppa per categoria
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

  const { totalPerPerson, tiramisuKg, tiramisuTotal } = useMemo(() => {
    const tiramisuSelection = selectedItems.find((item) => isTiramisuItem(item.name))
    const quantity = tiramisuSelection?.quantity ?? 0
    const totalForTiramisu = quantity > 0 ? tiramisuUnitPrice * quantity : 0

    const baseTotal = selectedItems
      .filter((item) => !isTiramisuItem(item.name))
      .reduce((sum, item) => sum + item.price, 0)

    const totalPerPerson = baseTotal

    return {
      totalPerPerson,
      tiramisuKg: quantity,
      tiramisuTotal: totalForTiramisu
    }
  }, [selectedItems, tiramisuUnitPrice])

  // Check if Vol-au-vent promotion threshold is met
  const meetsVolAuVentThreshold = useMemo(() => {
    return totalPerPerson >= VOL_AU_VENT_THRESHOLD_EUR
  }, [totalPerPerson])

  const shouldHaveVolAuVent = useMemo(() => {
    if (!bookingTypeUsesMenuSelections(bookingType)) return false
    return meetsVolAuVentThreshold
  }, [meetsVolAuVentThreshold, bookingType])

  // Stato locale per l'input del tiramisù per permettere digitazione libera
  const [localTiramisuValue, setLocalTiramisuValue] = useState<string>('')
  const isInitializedRef = React.useRef<boolean>(false)

  // Inizializza lo stato locale solo una volta quando tiramisuKg è disponibile
  useEffect(() => {
    if (!isInitializedRef.current && tiramisuKg > 0) {
      setLocalTiramisuValue(String(tiramisuKg))
      isInitializedRef.current = true
    } else if (tiramisuKg === 0 && localTiramisuValue !== '') {
      // Reset solo se tiramisuKg è 0 e il valore locale non è vuoto (caso di rimozione tiramisù)
      setLocalTiramisuValue('')
    }
  }, [tiramisuKg])

  // Rimosso useEffect che causava loop infinito
  // Il callback viene chiamato direttamente da handleItemToggle e handleBisPrimiToggle

  const emitMenuSelectionChange = useCallback((items: SelectedMenuItem[]) => {
    // GUARD: Prevent infinite loops by checking if items actually changed
    const itemsChanged = items.length !== selectedItems.length ||
      items.some((item, index) => {
        const existing = selectedItems[index]
        return !existing ||
          item.id !== existing.id ||
          item.quantity !== existing.quantity
      })

    if (!itemsChanged) {
      return
    }

    const itemsWithTotals = items.map((selected) => {
      if (isTiramisuItem(selected.name)) {
        const rawQuantity = selected.quantity ?? DEFAULT_TIRAMISU_KG
        const clampedQuantity = clampTiramisuQuantity(rawQuantity)
        const totalPrice = clampedQuantity > 0 ? tiramisuUnitPrice * clampedQuantity : 0
        return {
          ...selected,
          quantity: clampedQuantity > 0 ? clampedQuantity : undefined,
          totalPrice: totalPrice > 0 ? totalPrice : undefined
        }
      }

      return {
        ...selected,
        totalPrice: selected.totalPrice ?? selected.price
      }
    })

    const tiramisuSelection = itemsWithTotals.find((item) => isTiramisuItem(item.name))
    const tiramisuQuantity = tiramisuSelection?.quantity ?? 0
    const tiramisuTotalValue = tiramisuSelection?.totalPrice ?? 0

    const baseTotal = itemsWithTotals
      .filter((item) => !isTiramisuItem(item.name))
      .reduce((sum, item) => sum + item.price, 0)

    onMenuChange({
      items: itemsWithTotals,
      totalPerPerson: baseTotal,
      tiramisuTotal: tiramisuTotalValue,
      tiramisuKg: tiramisuQuantity
    })
  }, [selectedItems, tiramisuUnitPrice, onMenuChange])

  // Auto-add or remove Vol-au-vent based on threshold
  useEffect(() => {
    const currentHasVolAuVent = selectedItems.some(isVolAuVentItem)

    if (shouldHaveVolAuVent && !currentHasVolAuVent) {
      // Add Vol-au-vent
      const updatedItems = [...selectedItems, createVirtualVolAuVentItem()]
      emitMenuSelectionChange(updatedItems)
    } else if (!shouldHaveVolAuVent && currentHasVolAuVent) {
      // Remove Vol-au-vent
      const updatedItems = selectedItems.filter(item => !isVolAuVentItem(item))
      emitMenuSelectionChange(updatedItems)
    }
  }, [shouldHaveVolAuVent, selectedItems, emitMenuSelectionChange])

  const handleItemToggle = (item: NormalizedMenuItem) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id)

    if (isSelected) {
      const remainingItems = selectedItems.filter(selected => selected.id !== item.id)
      emitMenuSelectionChange(remainingItems)
      return
    }

    let updatedItems: SelectedMenuItem[] = selectedItems

    // === BEVANDE RULES ===
    if (item.category === 'bevande') {
      const isCaraffe = isCaraffeDrinkStandard(item.name) || isCaraffeDrinkPremium(item.name)
      if (isCaraffe) {
        updatedItems = selectedItems.filter(selected =>
          !(
            selected.category === 'bevande' &&
            (isCaraffeDrinkStandard(selected.name) || isCaraffeDrinkPremium(selected.name))
          )
        )
      }
    }

    // === ANTIPASTI RULES ===
    if (item.category === 'antipasti') {
      const antipastiCount = selectedItems.filter(s => s.category === 'antipasti').length
      if (antipastiCount >= 3) {
        alert('Puoi scegliere massimo 3 antipasti')
        return
      }
    }

    // Regole generiche per categoria guidate da limite configurato
    const limit = CATEGORY_LIMITS[item.category]
    if (typeof limit === 'number') {
      const categoryCount = updatedItems.filter(s => s.category === item.category).length
      if (limit === 1) {
        updatedItems = updatedItems.filter(selected => selected.category !== item.category)
      } else if (categoryCount >= limit) {
        alert(`Puoi scegliere massimo ${limit} elementi in questa categoria`)
        return
      }
    }

    const newItem: SelectedMenuItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category
    }

    if (isTiramisuItem(item.name)) {
      newItem.quantity = DEFAULT_TIRAMISU_KG
    }

    emitMenuSelectionChange([
      ...updatedItems.filter(selected => selected.id !== item.id),
      newItem
    ])
  }

  const handleRemoveSelectedItem = (itemId: string) => {
    const remainingItems = selectedItems.filter(item => item.id !== itemId)
    emitMenuSelectionChange(remainingItems)
  }

  const handleTiramisuQuantityChange = (value: string) => {
    // Aggiorna immediatamente lo stato locale per permettere digitazione libera
    setLocalTiramisuValue(value)

    const trimmed = value.trim()
    const isEmpty = trimmed === ''

    if (isEmpty) {
      const itemsWithoutQuantity = selectedItems.map((item) =>
        isTiramisuItem(item.name)
          ? { ...item, quantity: undefined, totalPrice: undefined }
          : item
      )
      emitMenuSelectionChange(itemsWithoutQuantity)
      return
    }

    // Permetti solo numeri
    if (!/^\d+$/.test(trimmed)) {
      return
    }

    const parsed = Number.parseInt(trimmed, 10)
    if (Number.isNaN(parsed)) {
      return
    }

    // Se il numero è fuori range (0 o > 7)
    if (parsed < TIRAMISU_MIN_KG || parsed > TIRAMISU_MAX_KG) {
      // Se è chiaramente fuori range (es. > 7), clampalo immediatamente
      if (parsed > TIRAMISU_MAX_KG) {
        const clamped = TIRAMISU_MAX_KG
        setLocalTiramisuValue(String(clamped))
        const updatedItems = selectedItems.map((item) =>
          isTiramisuItem(item.name)
            ? {
                ...item,
                quantity: clamped,
                totalPrice: clamped > 0 ? tiramisuUnitPrice * clamped : undefined
              }
            : item
        )
        emitMenuSelectionChange(updatedItems)
      }
      // Se è < 1, lascia che l'utente continui a digitare (potrebbe voler digitare 1, 2, etc.)
      return
    }

    // Valore valido (1-7), aggiorna immediatamente
    const updatedItems = selectedItems.map((item) =>
      isTiramisuItem(item.name)
        ? {
            ...item,
            quantity: parsed,
            totalPrice: parsed > 0 ? tiramisuUnitPrice * parsed : undefined
          }
        : item
    )
    emitMenuSelectionChange(updatedItems)
  }

  const handleTiramisuQuantityBlur = () => {
    // Al blur, assicurati che il valore sia valido
    const trimmed = localTiramisuValue.trim()
    if (trimmed === '') {
      const itemsWithoutQuantity = selectedItems.map((item) =>
        isTiramisuItem(item.name)
          ? { ...item, quantity: undefined, totalPrice: undefined }
          : item
      )
      emitMenuSelectionChange(itemsWithoutQuantity)
      return
    }

    const parsed = Number.parseInt(trimmed, 10)
    if (Number.isNaN(parsed) || parsed < TIRAMISU_MIN_KG) {
      // Se vuoto o invalido, imposta a default
      const clamped = DEFAULT_TIRAMISU_KG
      setLocalTiramisuValue(String(clamped))
      const updatedItems = selectedItems.map((item) =>
        isTiramisuItem(item.name)
          ? {
              ...item,
              quantity: clamped,
              totalPrice: clamped > 0 ? tiramisuUnitPrice * clamped : undefined
            }
          : item
      )
      emitMenuSelectionChange(updatedItems)
    } else if (parsed > TIRAMISU_MAX_KG) {
      // Se troppo grande, clampalo
      const clamped = TIRAMISU_MAX_KG
      setLocalTiramisuValue(String(clamped))
      const updatedItems = selectedItems.map((item) =>
        isTiramisuItem(item.name)
          ? {
              ...item,
              quantity: clamped,
              totalPrice: clamped > 0 ? tiramisuUnitPrice * clamped : undefined
            }
          : item
      )
      emitMenuSelectionChange(updatedItems)
    } else {
      // Valore valido, assicurati che sia sincronizzato
      const updatedItems = selectedItems.map((item) =>
        isTiramisuItem(item.name)
          ? {
              ...item,
              quantity: parsed,
              totalPrice: parsed > 0 ? tiramisuUnitPrice * parsed : undefined
            }
          : item
      )
      emitMenuSelectionChange(updatedItems)
    }
  }

  if (isLoading) {
    return <div className="text-center py-4 text-gray-600">Caricamento menu...</div>
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 font-semibold mb-2">Errore nel caricamento del menu</p>
        <p className="text-sm text-gray-600">Contatta l&apos;amministratore</p>
      </div>
    )
  }

  return (
    <div className="isolate">
      {/* Titolo Sezione */}
      <h2
        className="booking-section-title booking-section-title-mobile booking-mobile-heading text-2xl md:text-3xl max-[595px]:!text-lg font-serif text-warm-wood mb-4 pb-3 border-b-2 border-warm-beige"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(1px)',
          padding: '18px 24px',
          borderRadius: '18px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          width: '100%',
          maxWidth: `min(${MENU_CARD_MAX_WIDTH_PX}px, calc(100% - 16px))`,
          margin: '0 auto',
          boxSizing: 'border-box',
          overflow: 'hidden',
          minHeight: '58px'
        }}
      >
        <span style={{ flexShrink: 0 }}>Menù</span>
        <span
          className="text-xl font-serif text-warm-wood md:text-2xl max-[595px]:!text-base"
          style={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            flexShrink: 1,
            minWidth: 0,
            textAlign: 'right'
          }}
        >
          € a Persona
        </span>
      </h2>

      {/* Banner omaggio + menu a tendina menù consigliati — solo Rinfresco di Laurea */}
      {showStaffPresetDropdown && bookingTypeUsesMenuSelections(bookingType) && (
        <div
          className="w-full flex flex-col items-center px-1 sm:px-2"
          style={{
            paddingTop: '1rem',
            paddingBottom: '0',
            marginTop: '0',
            marginBottom: '0',
          }}
        >
          <select
            id="preset_menu"
            value={presetMenu || ''}
            onChange={(e) => {
              const value = e.target.value
              onPresetMenuChange?.(value === '' ? null : (value as Exclude<PresetMenuType, null>))
            }}
            className="block rounded-full border shadow-sm transition-all w-full"
            style={{
              borderColor: 'rgba(0,0,0,0.2)',
              height: '56px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '700',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(1px)',
              color: 'black',
              maxWidth: `min(${MENU_CARD_MAX_WIDTH_PX}px, calc(100% - 16px))`,
              margin: '0 auto'
            }}
            onFocus={(e) => (e.target as HTMLSelectElement).style.borderColor = '#8B6914'}
            onBlur={(e) => (e.target as HTMLSelectElement).style.borderColor = 'rgba(0,0,0,0.2)'}
          >
            <option value="">Scegli un menù consigliato dallo staff</option>
            {presetMenu != null && isBuiltinPresetMenuType(presetMenu) && (
              <option value={presetMenu}>{getPresetMenu(presetMenu)?.label ?? presetMenu}</option>
            )}
            {presetMenu != null &&
              isCustomPresetMenuType(presetMenu) &&
              customStaffPresets.some((p) => customPresetStorageId(p.id) === presetMenu) &&
              !selectableStaffPresets.some((p) => customPresetStorageId(p.id) === presetMenu) && (
                <option value={presetMenu}>
                  {getPresetMenuLabel(presetMenu, customStaffPresets)}
                </option>
              )}
            {presetMenu != null &&
              isCustomPresetMenuType(presetMenu) &&
              !customStaffPresets.some((p) => customPresetStorageId(p.id) === presetMenu) && (
                <option value={presetMenu}>
                  {getPresetMenuLabel(presetMenu, customStaffPresets)}
                </option>
              )}
            {selectableStaffPresets.map((p) => (
              <option key={p.id} value={customPresetStorageId(p.id)}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Lista per Categoria */}
      {orderedCategories.map((category, index) => {
        const label = categoryLabels.get(category) ?? category
        const items = itemsByCategory[category] || []
        if (!items || items.length === 0) return null

        const selectedCount = selectedItems.filter(i => i.category === category).length

        let counterText: string | null = null
        if (category === 'bevande') {
          const caraffeCount = selectedItems.filter(i =>
            i.category === 'bevande' &&
            (isCaraffeDrinkStandard(i.name) || isCaraffeDrinkPremium(i.name))
          ).length
          const limit = CATEGORY_LIMITS[category]
          if (typeof limit === 'number') {
            counterText = `(${caraffeCount}/${limit} selezionat${caraffeCount === 1 ? 'a' : 'e'})`
          } else {
            counterText = `(${caraffeCount} selezionat${caraffeCount === 1 ? 'a' : 'e'})`
          }
        } else {
          const limit = CATEGORY_LIMITS[category]
          if (typeof limit === 'number') {
            counterText = `(${selectedCount}/${limit} selezionat${selectedCount === 1 ? 'o' : 'i'})`
          } else if (selectedCount > 0) {
            counterText = `(${selectedCount} selezionat${selectedCount === 1 ? 'o' : 'i'})`
          }
        }

        // Padding condizionale: prima categoria (Bevande) ha padding extra se c'è dropdown sopra
        const hasDropdownAbove = showStaffPresetDropdown
        const isFirstCategory = index === 0
        
        // Calcola padding top: se è la prima categoria e c'è dropdown, padding extra
        const paddingTop = isFirstCategory && hasDropdownAbove
          ? '0.75rem' // Padding extra per prima categoria (Bevande) se c'è dropdown sopra
          : isFirstCategory
          ? '0.5rem' // Mantiene un gap visivo tra titolo sezione e prima categoria (utile su mobile)
          : '1.5rem' // Padding normale per altre categorie

        return (
          <div 
            key={category} 
            className="w-full flex flex-col items-center px-1 sm:px-2 menu-grid-container"
            style={{ paddingTop, paddingBottom: '0' }}
          >
            <h3
              className="text-lg md:text-xl border-b border-gray-300 pb-2 flex items-center justify-between w-full booking-section-title-mobile booking-mobile-subheading"
              style={{
                color: '#6B4226',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(1px)',
                padding: '8px 16px',
                borderRadius: '12px',
                width: '100%',
                maxWidth: `min(${MENU_CARD_MAX_WIDTH_PX}px, calc(100% - 16px))`,
                margin: '0 auto',
                boxSizing: 'border-box',
                fontWeight: '700'
              }}
            >
              <span>{label}</span>
              {counterText ? (
                <span className="text-sm text-gray-600 booking-mobile-counter">
                  {counterText}
                </span>
              ) : null}
            </h3>
            <div
              className="flex w-full max-w-5xl flex-col items-stretch gap-4 mx-auto"
              style={{ paddingTop: '0.5rem', marginTop: '0' }}
            >
              {items
                .filter(item => item.id !== VIRTUAL_VOL_AU_VENT_ID)
                .map((item) => {
                const isSelected = selectedItems.some(selected => selected.id === item.id)
                const isTiramisu = isTiramisuItem(item.name)
                return (
                  <div
                    key={item.id}
                    className="flex w-full flex-col items-stretch gap-2"
                    style={{
                      maxWidth: `min(${MENU_CARD_MAX_WIDTH_PX}px, calc(100% - 16px))`,
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleItemToggle(item)}
                      aria-pressed={isSelected}
                      className={`
                        flex w-full cursor-pointer flex-col items-stretch rounded-xl border-2 text-left menu-card-mobile
                        ${isTiramisu && isSelected ? 'menu-card-with-ingredient' : ''}
                        transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-wood/50 focus-visible:ring-offset-2
                      `}
                      style={{
                        minHeight: '80px',
                        maxHeight: 'none',
                        backgroundColor: isSelected ? 'rgba(245, 222, 179, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(1px)',
                        borderColor: isSelected ? '#8B4513' : 'rgba(0,0,0,0.2)',
                        paddingTop: '6px',
                        paddingBottom: '6px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        borderRadius: '16px',
                        marginBottom: '4px',
                        width: '100%',
                        maxWidth: `${MENU_CARD_MAX_WIDTH_PX}px`,
                        height: item.description ? 'auto' : '80px',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        justifyContent: item.description ? undefined : 'center',
                      }}
                    >
                      <div
                        className="flex min-h-0 w-full min-w-0 flex-1 flex-row flex-nowrap items-center justify-between gap-x-2 gap-y-0 sm:gap-x-3"
                        style={{
                          paddingLeft: '4px',
                          paddingRight: '12px',
                          paddingTop: '0px',
                          paddingBottom: item.description ? '2px' : '0px',
                          overflow: 'hidden',
                        }}
                      >
                        <span
                          className={`booking-mobile-card-title min-w-0 flex-1 font-bold text-base md:text-lg ${isSelected ? 'text-warm-wood' : 'text-gray-700'}`}
                          style={{
                            fontWeight: '700',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                          }}
                        >
                          {item.name}
                        </span>
                        <span
                          className="booking-mobile-price shrink-0 self-center text-sm font-bold text-warm-wood whitespace-nowrap md:text-lg"
                          style={{ fontWeight: '700', textAlign: 'right' }}
                        >
                          {formatPrice(item)}
                        </span>
                      </div>
                      {item.description ? (
                        <p
                          className="booking-mobile-card-description w-full min-w-0 px-1 pb-0 pt-0.5 text-left text-sm font-semibold leading-snug text-gray-600 md:text-base"
                          style={{
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            lineHeight: '1.35',
                            margin: 0,
                            hyphens: 'auto',
                          }}
                        >
                          {item.description}
                        </p>
                      ) : null}
                    </button>
                    {isTiramisu && isSelected && (
                      <div
                        className="w-full max-w-[746px] bg-white/85 border-2 rounded-xl px-4 py-3 flex flex-col gap-2 tiramisu-ingredient-card transition-all duration-200"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.85)',
                          backdropFilter: 'blur(1px)',
                          borderColor: 'rgba(0,0,0,0.2)',
                          borderRadius: '16px',
                          marginTop: '0.5rem',
                          paddingTop: '0.75rem'
                        }}
                      >
                        <label
                          htmlFor="tiramisu-quantity"
                          className="text-sm font-semibold text-warm-wood"
                        >
                          Quanti Kg di Tiramisù desideri? (1-7)
                        </label>
                        <input
                          id="tiramisu-quantity"
                          type="number"
                          min={TIRAMISU_MIN_KG}
                          max={TIRAMISU_MAX_KG}
                          inputMode="numeric"
                          value={localTiramisuValue}
                          onChange={(event) => handleTiramisuQuantityChange(event.target.value)}
                          onBlur={handleTiramisuQuantityBlur}
                          className="w-full rounded-lg border border-warm-wood/40 px-3 py-2 text-base font-semibold text-gray-800 focus:border-warm-wood focus:ring-2 focus:ring-warm-wood/30"
                        />
                        <p className="text-xs text-gray-500">
                          Il tiramisù viene preparato in teglie da 1 Kg. Ogni Kg corrisponde a €{tiramisuUnitPrice.toFixed(2)}.
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

      {/* Riepilogo Scelte */}
      {selectedItems.length > 0 && (
        <div className="w-full flex justify-center">
          <div
            className="w-full max-w-[746px] border-2 rounded-xl bg-white/85 transition-all duration-200"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(1px)',
              borderColor: 'rgba(0,0,0,0.2)',
              borderRadius: '16px'
            }}
          >
            <div className="flex items-center justify-between" style={{ paddingLeft: '22px', paddingRight: '22px', paddingTop: '22px', paddingBottom: '22px' }}>
              <h3 className="text-xl font-semibold text-warm-wood">Riepilogo Scelte</h3>
              <span className="text-sm font-medium text-gray-600">{selectedItems.length} elementi</span>
            </div>
            <div style={{ height: '2px', backgroundColor: '#60a5fa', marginLeft: '22px', marginRight: '22px' }} />
            <div style={{ paddingLeft: '22px', paddingRight: '22px', paddingTop: '18px', paddingBottom: '18px' }}>
              <div className="flex flex-wrap" style={{ gap: '16px' }}>
                {selectedItems.map((item) => {
                  const isTiramisu = isTiramisuItem(item.name)
                  const isPromoItem = isVolAuVentItem(item)
                  const quantityLabel = isTiramisu && item.quantity ? ` - ${item.quantity} Kg` : ''
                  const chipLabel = `${item.name}${quantityLabel}`
                  const displayLabel = isPromoItem ? `${chipLabel} (In regalo)` : chipLabel
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleRemoveSelectedItem(item.id)}
                      className="group flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2 text-sm font-semibold text-warm-wood shadow-sm transition-all hover:bg-warm-beige/30"
                      style={{ borderColor: '#60a5fa' }}
                    >
                      <span className="truncate max-w-[180px] text-left">{displayLabel}</span>
                      <X className="h-4 w-4 transition-colors" style={{ color: '#60a5fa' }} />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Totali */}
      {selectedItems.length > 0 && (
        <div className="w-full flex justify-center">
          <div
            className="w-full max-w-[746px] border-2 rounded-xl bg-white/85 transition-all duration-200"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(1px)',
              borderColor: 'rgba(0,0,0,0.2)',
              borderRadius: '16px'
            }}
          >
            <div className="space-y-4" style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '30px', paddingBottom: '30px' }}>
              <div className="flex items-center justify-between text-lg font-semibold text-warm-wood">
                <span>Prezzo a persona</span>
                <span>{formatCurrency(totalPerPerson)}</span>
              </div>
              {tiramisuTotal > 0 && (
                <div className="flex items-center justify-between text-lg font-semibold text-warm-wood">
                  <span>Tiramisù</span>
                  <span>{formatCurrency(tiramisuTotal)}</span>
                </div>
              )}
              <div className="h-px bg-warm-beige/60" />
              <div className="flex items-center justify-between text-2xl font-bold text-warm-wood">
                <span>Prezzo totale rinfresco</span>
                <span>
                  {formatCurrency(totalPerPerson * Math.max(numGuests, 0) + tiramisuTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

