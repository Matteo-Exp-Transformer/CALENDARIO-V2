import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { CollapsibleCard } from '@/components/ui'
import { cn } from '@/lib/utils'
import { ADMIN_WARM_GRADIENT_SURFACE } from '@/lib/adminWarmGradientSurface'
import { useMenuItems } from '../hooks/useMenuItems'
import { useMenuCategories } from '../hooks/useMenuCategories'
import type { SelectedMenuItem } from '@/types/menu'
import {
  customPresetStorageId,
  getCustomPresetUuid,
  getPresetMenu,
  getPresetMenuLabel,
  isBuiltinPresetMenuType,
  isCustomPresetMenuType,
  isStaffPresetFixedMenu,
  isStaffPresetSelectableForBookingType,
  type CustomStaffPreset,
  type PresetMenuType,
} from '../constants/presetMenus'
import { isCaraffeDrinkPremium, isCaraffeDrinkStandard } from '../utils/caraffePricing'
import { groupMenuItemsByCategory } from '../utils/menuCatalogGrouping'
import type { BookingType } from '@/types/booking'
import { normalizeMenuItemBookingTypes } from '@/types/menu'
import { bookingTypeUsesMenuSelections } from '../utils/bookingTypeMenu'
import {
  MENU_CATEGORY_COLLAPSIBLE_CLASS,
  MENU_CATEGORY_COLLAPSIBLE_HEADER_CLASS,
  MENU_CATEGORY_LABEL_TITLE_CLASS,
  MENU_CATEGORY_LABEL_TITLE_STYLE,
  MENU_INGREDIENT_DESC_CLASS,
  MENU_INGREDIENT_NAME_CLASS,
  MENU_INGREDIENT_OVERVIEW_GRID_CLASS,
  MENU_CARD_MAX_WIDTH_PX,
  MENU_INGREDIENT_OVERVIEW_SHELL_CLASS,
  MENU_INGREDIENT_PRICE_CLASS,
} from './menuPricesCatalogLayout'

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
  /** Nasconde il blocco «Riepilogo Scelte» e i totali (evita duplicato con la sidebar). Default: false */
  hideSummary?: boolean
  /** Variante layout: 'compose' usa titolo «CREA IL TUO MENU». Default: 'default' */
  variant?: 'default' | 'compose'
  /** Etichette custom per le card/opzioni preset (da booking_public_form_config). */
  subTabOverrides?: { preset_id: string; custom_label: string }[]
  /** Nasconde la griglia ingredienti (es. sottotab manuale). Default: false */
  hideMenuGrid?: boolean
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
  hideSummary = false,
  variant: _variant = 'default',
  subTabOverrides = [],
  hideMenuGrid = false,
}) => {
  const { data: menuItems = [], isLoading, error } = useMenuItems()
  const { data: dbCategories = [] } = useMenuCategories()

  const formatPrice = (item: NormalizedMenuItem) =>
    `€${item.price.toFixed(2)}${item.priceSuffix ?? ''}`
  const formatCurrency = (value: number) => `€${value.toFixed(2)}`

  const selectableStaffPresets = useMemo(
    () => customStaffPresets.filter((p) => isStaffPresetSelectableForBookingType(p, bookingType)),
    [customStaffPresets, bookingType],
  )

  const menuSelectionLocked = useMemo(() => {
    if (!presetMenu) return false
    if (isBuiltinPresetMenuType(presetMenu)) return true
    if (!isCustomPresetMenuType(presetMenu)) return false
    const uuid = getCustomPresetUuid(presetMenu)
    const preset = uuid ? customStaffPresets.find((p) => p.id === uuid) : undefined
    return preset ? isStaffPresetFixedMenu(preset) : false
  }, [presetMenu, customStaffPresets])

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

  const categoryEntries = useMemo(
    () => dbCategories.map((category) => [category.key, category.label] as const),
    [dbCategories],
  )

  const tiramisuUnitPrice = useMemo(() => {
    const tiramisuItem = normalizedMenuItems.find((item) => isTiramisuItem(item.name))
    return tiramisuItem?.price ?? 20
  }, [normalizedMenuItems])

  // Raggruppa per categoria
  const itemsByCategory = useMemo(
    () =>
      groupMenuItemsByCategory(
        normalizedMenuItems,
        categoryEntries.map(([key]) => key),
      ),
    [categoryEntries, normalizedMenuItems],
  )

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

  const handleItemToggle = (item: NormalizedMenuItem) => {
    if (menuSelectionLocked) return

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
    if (menuSelectionLocked) return

    const remainingItems = selectedItems.filter(item => item.id !== itemId)
    emitMenuSelectionChange(remainingItems)
  }

  const handleTiramisuQuantityChange = (value: string) => {
    if (menuSelectionLocked) return

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
    if (menuSelectionLocked) return

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
            {selectableStaffPresets.map((p) => {
              const override = subTabOverrides.find((o) => o.preset_id === p.id)
              return (
                <option key={p.id} value={customPresetStorageId(p.id)}>
                  {override?.custom_label?.trim() || p.name}
                </option>
              )
            })}
          </select>
        </div>
      )}

      {menuSelectionLocked && !hideMenuGrid && (
        <p className="mx-auto mt-3 max-w-xl rounded-xl border border-warm-beige bg-white/85 px-4 py-2 text-center text-xs text-warm-wood-dark/80 sm:text-sm">
          Menù fisso: gli ingredienti sono quelli del pacchetto scelto e non possono essere modificati.
        </p>
      )}

      {/* Panoramica categorie — stesso layout di MenuPricesTab / menù preselezionati */}
      {!hideMenuGrid && (
      <div
        className={cn(MENU_INGREDIENT_OVERVIEW_SHELL_CLASS, 'mt-4 w-full min-w-0')}
        style={ADMIN_WARM_GRADIENT_SURFACE}
      >
        {categoryEntries.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-600">
            Nessuna categoria configurata.
          </p>
        ) : (
          <div className={cn(MENU_INGREDIENT_OVERVIEW_GRID_CLASS, 'mt-2')}>
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
                              disabled={menuSelectionLocked}
                              className={cn(
                                'menu-prices-item-row w-full min-w-0 flex-col items-stretch gap-1 py-2.5 px-3',
                                !hasDesc && 'min-h-0 items-center',
                                isSelected && 'menu-prices-item-row--selected',
                                isTiramisu && isSelected && 'menu-card-with-ingredient',
                                menuSelectionLocked && 'cursor-default opacity-90',
                              )}
                              style={{
                                minHeight: hasDesc ? undefined : '3rem',
                              }}
                            >
                              <div className="flex w-full min-w-0 items-center justify-between gap-2">
                                <p
                                  className={cn(
                                    MENU_INGREDIENT_NAME_CLASS,
                                    'menu-prices-item-text break-words',
                                  )}
                                >
                                  {item.name}
                                </p>
                                <span className={MENU_INGREDIENT_PRICE_CLASS}>{formatPrice(item)}</span>
                              </div>
                              {hasDesc ? (
                                <p className={cn(MENU_INGREDIENT_DESC_CLASS, 'break-words')}>
                                  {item.description}
                                </p>
                              ) : null}
                            </button>
                            {isTiramisu && isSelected ? (
                              <div className="w-full min-w-0 rounded-xl border-2 border-black/20 bg-white/85 px-4 py-3">
                                <label
                                  htmlFor={`menu-selection-tiramisu-${item.id}`}
                                  className="mb-2 block text-sm font-semibold text-warm-wood"
                                >
                                  Quanti Kg di Tiramisù desideri? (1-7)
                                </label>
                                <input
                                  id={`menu-selection-tiramisu-${item.id}`}
                                  type="number"
                                  min={TIRAMISU_MIN_KG}
                                  max={TIRAMISU_MAX_KG}
                                  inputMode="numeric"
                                  value={localTiramisuValue}
                                  onChange={(event) =>
                                    handleTiramisuQuantityChange(event.target.value)
                                  }
                                  onBlur={handleTiramisuQuantityBlur}
                                  className="w-full rounded-lg border border-warm-wood/40 px-3 py-2 text-base font-semibold text-gray-800 focus:border-warm-wood focus:ring-2 focus:ring-warm-wood/30"
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                  Il tiramisù viene preparato in teglie da 1 Kg. Ogni Kg corrisponde a €
                                  {tiramisuUnitPrice.toFixed(2)}.
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
        )}
      </div>
      )}

      {/* Riepilogo Scelte — nascosto quando la sidebar mostra già il riepilogo */}
      {!hideSummary && selectedItems.length > 0 && (
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
              <h3 className="text-title-card font-semibold text-warm-wood">Riepilogo Scelte</h3>
              <span className="text-label font-medium text-gray-600">{selectedItems.length} elementi</span>
            </div>
            <div style={{ height: '2px', backgroundColor: '#60a5fa', marginLeft: '22px', marginRight: '22px' }} />
            <div style={{ paddingLeft: '22px', paddingRight: '22px', paddingTop: '18px', paddingBottom: '18px' }}>
              <div className="flex flex-wrap" style={{ gap: '16px' }}>
                {selectedItems.map((item) => {
                  const isTiramisu = isTiramisuItem(item.name)
                  const quantityLabel = isTiramisu && item.quantity ? ` - ${item.quantity} Kg` : ''
                  const displayLabel = `${item.name}${quantityLabel}`
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleRemoveSelectedItem(item.id)}
                      disabled={menuSelectionLocked}
                      className={cn(
                        'group flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2 text-sm font-semibold text-warm-wood shadow-sm transition-all',
                        menuSelectionLocked ? 'cursor-default' : 'hover:bg-warm-beige/30',
                      )}
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

      {/* Totali — nascosti quando la sidebar mostra già i totali */}
      {!hideSummary && selectedItems.length > 0 && (
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

