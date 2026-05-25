import type { MenuItem } from '@/types/menu'
import {
  getCustomPresetUuid,
  isBuiltinPresetMenuType,
  isCustomPresetMenuType,
  type CustomStaffPreset,
  type PresetMenuType,
} from '../constants/presetMenus'
import { resolvePresetSelectedItems } from './buildPresetMenuSelection'

/** Limiti selezione per categoria (form pubblico Prenota). */
export const MENU_COMPOSE_CATEGORY_LIMITS: Partial<Record<string, number>> = {
  bevande: 1,
  antipasti: 3,
  primi: 1,
  secondi: 3,
}

export type ComposeMenuItem = {
  id: string
  name: string
  price: number
  category: string
  description?: string
  sort_order: number
  priceSuffix?: string
}

/**
 * UUID consentiti quando il menù è bloccato (preset fisso o built-in).
 * `null` = nessun filtro (compose libero senza preset). Con preset personalizzabile = solo `item_ids` del catalogo.
 */
export function resolveLockedPresetAllowedItemIds(
  presetMenu: PresetMenuType | null | undefined,
  menuItems: MenuItem[],
  customStaffPresets: CustomStaffPreset[],
): Set<string> | null {
  if (!presetMenu) return null

  if (isCustomPresetMenuType(presetMenu)) {
    const uuid = getCustomPresetUuid(presetMenu)
    const preset = uuid ? customStaffPresets.find((p) => p.id === uuid) : undefined
    if (!preset?.item_ids?.length) return new Set()
    // Personalizzabile: mostra solo il catalogo preset, senza pre-selezioni
    return new Set(preset.item_ids)
  }

  if (isBuiltinPresetMenuType(presetMenu)) {
    const resolved = resolvePresetSelectedItems(presetMenu, menuItems, customStaffPresets)
    if (!resolved?.length) return new Set()
    return new Set(resolved.map((i) => i.id))
  }

  return null
}

export function filterItemsForComposeCategory(
  categoryItems: ComposeMenuItem[],
  allowedItemIds: Set<string> | null,
): ComposeMenuItem[] {
  if (!allowedItemIds) return categoryItems
  return categoryItems.filter((item) => allowedItemIds.has(item.id))
}

export function countSelectedInCategory(
  selectedItems: { id: string; category: string }[],
  categoryKey: string,
): number {
  return selectedItems.filter((s) => s.category === categoryKey).length
}

export function selectionStatusLabel(
  categoryKey: string,
  selectedCount: number,
): { hint: string; status: string } {
  const limit = MENU_COMPOSE_CATEGORY_LIMITS[categoryKey]
  if (typeof limit === 'number' && limit === 1) {
    return {
      hint: 'Scegli 1 opzione',
      status:
        selectedCount === 1
          ? '1 selezionata'
          : selectedCount === 0
            ? 'Nessuna selezionata'
            : `${selectedCount} selezionate`,
    }
  }
  if (typeof limit === 'number' && limit > 1) {
    return {
      hint: `Scegli fino a ${limit}`,
      status:
        selectedCount === 0
          ? 'Nessuna selezionata'
          : selectedCount === 1
            ? '1 selezionata'
            : `${selectedCount} selezionate`,
    }
  }
  return {
    hint: 'Scegli le opzioni',
    status:
      selectedCount === 0
        ? 'Nessuna selezionata'
        : selectedCount === 1
          ? '1 selezionata'
          : `${selectedCount} selezionate`,
  }
}
