import {
  ForkKnife,
  BowlFood,
  CookingPot,
  Flame,
  Cake,
  Martini,
  type Icon as PhosphorIconType,
} from '@phosphor-icons/react'

/** Mappa key categoria menu → icona Phosphor (homepage QR pubblica). */
export const CATEGORY_ICON: Record<string, PhosphorIconType> = {
  antipasti: ForkKnife,
  pizza: Flame,
  primi: CookingPot,
  secondi: ForkKnife,
  fritti: Flame,
  bevande: BowlFood,
  vini: Martini,
  birre: Martini,
  dolci: Cake,
  dessert: Cake,
  formaggi: BowlFood,
  contorni: BowlFood,
  panini: ForkKnife,
  insalate: BowlFood,
  zuppe: CookingPot,
}

export type MenuQrCategoryIconKey =
  | 'fork_knife'
  | 'bowl_food'
  | 'cooking_pot'
  | 'flame'
  | 'cake'
  | 'martini'

export const MENU_QR_CATEGORY_ICON_OPTIONS: {
  value: MenuQrCategoryIconKey
  label: string
  Icon: PhosphorIconType
}[] = [
  { value: 'fork_knife', label: 'Posate', Icon: ForkKnife },
  { value: 'bowl_food', label: 'Ciotola', Icon: BowlFood },
  { value: 'cooking_pot', label: 'Pentola', Icon: CookingPot },
  { value: 'flame', label: 'Fiamma', Icon: Flame },
  { value: 'cake', label: 'Dolce', Icon: Cake },
  { value: 'martini', label: 'Calice', Icon: Martini },
]

const MENU_QR_CATEGORY_ICON_BY_KEY: Record<MenuQrCategoryIconKey, PhosphorIconType> = {
  fork_knife: ForkKnife,
  bowl_food: BowlFood,
  cooking_pot: CookingPot,
  flame: Flame,
  cake: Cake,
  martini: Martini,
}

export function resolveMenuQrCategoryIcon(
  iconKey: string | null | undefined,
  categoryKey?: string,
): PhosphorIconType {
  if (iconKey && iconKey in MENU_QR_CATEGORY_ICON_BY_KEY) {
    return MENU_QR_CATEGORY_ICON_BY_KEY[iconKey as MenuQrCategoryIconKey]
  }
  if (categoryKey) {
    return CATEGORY_ICON[categoryKey.toLowerCase()] ?? ForkKnife
  }
  return ForkKnife
}

export function defaultIconKeyForCategory(categoryKey: string): MenuQrCategoryIconKey | null {
  const icon = CATEGORY_ICON[categoryKey.toLowerCase()]
  if (!icon) return null
  const match = MENU_QR_CATEGORY_ICON_OPTIONS.find((opt) => opt.Icon === icon)
  return match?.value ?? null
}
