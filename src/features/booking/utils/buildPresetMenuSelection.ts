import type { MenuItem } from '@/types/menu'
import type { SelectedMenuItem } from '@/types/menu'
import {
  customPresetStorageId,
  getCustomPresetUuid,
  getPresetMenu,
  isBuiltinPresetMenuType,
  isCustomPresetMenuType,
  type BuiltinPresetMenuType,
  type CustomStaffPreset,
  type PresetMenu,
  type PresetMenuType,
} from '../constants/presetMenus'

const DEFAULT_TIRAMISU_Q = 1

const normalizeName = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\//g, '/')
    .replace(/\/\s*/g, '/')
    .replace(/\s*\/\s*/g, '/')

const matchesName = (itemName: string, presetName: string): boolean => {
  const normalizedItem = normalizeName(itemName)
  const normalizedPreset = normalizeName(presetName)

  if (normalizedItem === normalizedPreset) return true

  const presetHasCaraffe = normalizedPreset.includes('caraffe')
  const presetHasDrink = normalizedPreset.includes('drink')
  const presetHasPremium = normalizedPreset.includes('premium')

  if (presetHasCaraffe) {
    const hasCaraffe = normalizedItem.includes('caraffe')
    const hasDrink = normalizedItem.includes('drink')
    const hasPremium = normalizedItem.includes('premium')

    if (presetHasPremium && !presetHasDrink) {
      if (hasCaraffe && hasPremium) return true
      return false
    }

    if (presetHasDrink && !presetHasPremium) {
      if (hasCaraffe && hasDrink && !hasPremium) return true
      return false
    }

    if (presetHasDrink && presetHasPremium) {
      if (hasCaraffe && hasDrink && hasPremium) return true
      return false
    }
  }

  if (normalizedItem.includes(normalizedPreset) || normalizedPreset.includes(normalizedItem)) return true

  return false
}

/** Costruisce le righe selezionate dal DB per un preset built-in (stessa logica del form prenotazioni). */
export function selectedItemsFromBuiltinPresetDefinition(
  preset: PresetMenu,
  menuItems: MenuItem[],
): SelectedMenuItem[] {
  return menuItems
    .filter((item) => preset.itemNames.some((presetName) => matchesName(item.name, presetName)))
    .map((item) => {
      const isTiramisu = item.name.toLowerCase().includes('tiramis')
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        quantity: isTiramisu ? DEFAULT_TIRAMISU_Q : undefined,
        totalPrice: isTiramisu ? item.price : item.price,
      }
    })
}

/** Selezione tramite UUID voci menu (preset admin). */
export function selectedItemsFromMenuItemIds(menuItems: MenuItem[], itemIds: string[]): SelectedMenuItem[] {
  const idSet = new Set(itemIds)
  return menuItems
    .filter((m) => idSet.has(m.id))
    .map((item) => {
      const isTiramisu = item.name.toLowerCase().includes('tiramis')
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        quantity: isTiramisu ? DEFAULT_TIRAMISU_Q : undefined,
        totalPrice: isTiramisu ? item.price : item.price,
      }
    })
}

export function resolvePresetSelectedItems(
  presetType: Exclude<PresetMenuType, null>,
  menuItems: MenuItem[],
  customPresets: CustomStaffPreset[],
): SelectedMenuItem[] | null {
  const builtin = getPresetMenu(presetType)
  if (builtin) {
    return selectedItemsFromBuiltinPresetDefinition(builtin, menuItems)
  }
  if (isCustomPresetMenuType(presetType)) {
    const uuid = getCustomPresetUuid(presetType)
    if (!uuid) return null
    const def = customPresets.find((c) => c.id === uuid)
    if (!def) return null
    return selectedItemsFromMenuItemIds(menuItems, def.item_ids)
  }
  return null
}

/** Confronto come in BookingRequestForm (nomi ordinati). */
export function builtinPresetMatchesSelection(
  builtinType: BuiltinPresetMenuType,
  selectedItems: SelectedMenuItem[],
): boolean {
  const preset = getPresetMenu(builtinType)
  if (!preset) return false
  const presetItemNames = [...preset.itemNames].sort()
  const selectedItemNames = selectedItems.map((i) => i.name).sort()
  if (presetItemNames.length !== selectedItemNames.length) return false
  return presetItemNames.every((name, idx) => name === selectedItemNames[idx])
}

export function presetSelectionStillMatchesStoredPreset(
  currentPreset: Exclude<PresetMenuType, null>,
  selectedItems: SelectedMenuItem[],
  customPresets: CustomStaffPreset[],
): boolean {
  if (isBuiltinPresetMenuType(currentPreset)) {
    return builtinPresetMatchesSelection(currentPreset, selectedItems)
  }
  if (isCustomPresetMenuType(currentPreset)) {
    const uuid = getCustomPresetUuid(currentPreset)
    if (!uuid) return false
    const def = customPresets.find((c) => c.id === uuid)
    if (!def) return false
    const a = [...def.item_ids].sort().join('|')
    const b = [...selectedItems.map((i) => i.id)].sort().join('|')
    return a === b
  }
  return false
}

export type MenuTotalsPayload = {
  totalPerPerson: number
  tiramisuTotal: number
  tiramisuKg: number
  menu_total_booking: number
}

export function computeMenuTotalsFromItems(
  items: SelectedMenuItem[],
  numGuests: number,
): MenuTotalsPayload {
  const totalPerPerson = items
    .filter((item) => !item.name.toLowerCase().includes('tiramis'))
    .reduce((sum, item) => sum + item.price, 0)
  const tiramisuSelection = items.find((item) => item.name.toLowerCase().includes('tiramis'))
  const tiramisuKg = tiramisuSelection?.quantity ?? 0
  const tiramisuUnitPrice = tiramisuSelection?.price ?? 0
  const tiramisuTotal = tiramisuKg > 0 ? tiramisuUnitPrice * tiramisuKg : 0
  return {
    totalPerPerson,
    tiramisuTotal,
    tiramisuKg,
    menu_total_booking: totalPerPerson * Math.max(numGuests, 0) + tiramisuTotal,
  }
}

/** Applica selezione preset e restituisce righe selezionate oppure null. */
export function applyPresetTypeToBookingFormPayload(
  presetType: Exclude<PresetMenuType, null>,
  menuItems: MenuItem[],
  customPresets: CustomStaffPreset[],
): { items: SelectedMenuItem[]; preset_menu: PresetMenuType } | null {
  const items = resolvePresetSelectedItems(presetType, menuItems, customPresets)
  if (!items?.length) {
    return null
  }
  return {
    items,
    preset_menu: presetType,
  }
}

export { customPresetStorageId }
