import {
  BeerBottle,
  BowlFood,
  Cake,
  Coffee,
  CookingPot,
  Fish,
  Flame,
  ForkKnife,
  Leaf,
  Martini,
  Hamburger,
  Pizza,
  type Icon as PhosphorIconType,
} from '@phosphor-icons/react'
import {
  ChefHat,
  Cookie,
  Croissant,
  EggFried,
  IceCreamCone,
  Milk,
  Salad,
  Sandwich,
  Shrimp,
  Soup,
  type LucideIcon,
} from 'lucide-react'

/** Default universale per categorie senza foto e senza mapping noto. */
export const MENU_QR_DEFAULT_CATEGORY_ICON_KEY = 'fork_knife' as const

export type MenuQrPhosphorIconKey =
  | 'fork_knife'
  | 'bowl_food'
  | 'cooking_pot'
  | 'flame'
  | 'cake'
  | 'martini'
  | 'fish'
  | 'steak'
  | 'leaf'
  | 'coffee'
  | 'beer'
  | 'pizza_slice'

export type MenuQrLucideIconKey =
  | 'lucide_chef_hat'
  | 'lucide_soup'
  | 'lucide_salad'
  | 'lucide_shrimp'
  | 'lucide_sandwich'
  | 'lucide_croissant'
  | 'lucide_ice_cream'
  | 'lucide_cookie'
  | 'lucide_egg_fried'
  | 'lucide_tea'

export type MenuQrCategoryIconKey = MenuQrPhosphorIconKey | MenuQrLucideIconKey

export type MenuQrCategoryIconOption =
  | {
      value: MenuQrPhosphorIconKey
      label: string
      family: 'phosphor'
      Icon: PhosphorIconType
    }
  | {
      value: MenuQrLucideIconKey
      label: string
      family: 'lucide'
      Icon: LucideIcon
    }

/** Mappa key categoria menu → chiave icona preset (solo Phosphor per prefill automatico). */
export const MENU_QR_CATEGORY_ICON_BY_CATEGORY_KEY: Record<string, MenuQrPhosphorIconKey> = {
  antipasti: 'fork_knife',
  pizza: 'pizza_slice',
  primi: 'cooking_pot',
  secondi: 'steak',
  fritti: 'flame',
  bevande: 'coffee',
  vini: 'martini',
  birre: 'beer',
  dolci: 'cake',
  dessert: 'cake',
  formaggi: 'bowl_food',
  contorni: 'leaf',
  panini: 'fork_knife',
  insalate: 'leaf',
  zuppe: 'cooking_pot',
  pesce: 'fish',
  pesci: 'fish',
  carni: 'steak',
  carne: 'steak',
  caffe: 'coffee',
  caffè: 'coffee',
}

export const MENU_QR_PHOSPHOR_ICON_OPTIONS: MenuQrCategoryIconOption[] = [
  { value: 'fork_knife', label: 'Posate', family: 'phosphor', Icon: ForkKnife },
  { value: 'bowl_food', label: 'Ciotola', family: 'phosphor', Icon: BowlFood },
  { value: 'cooking_pot', label: 'Pentola', family: 'phosphor', Icon: CookingPot },
  { value: 'flame', label: 'Fiamma', family: 'phosphor', Icon: Flame },
  { value: 'cake', label: 'Dolce', family: 'phosphor', Icon: Cake },
  { value: 'martini', label: 'Calice', family: 'phosphor', Icon: Martini },
  { value: 'fish', label: 'Pesce', family: 'phosphor', Icon: Fish },
  { value: 'steak', label: 'Bistecca', family: 'phosphor', Icon: Hamburger },
  { value: 'leaf', label: 'Verdura', family: 'phosphor', Icon: Leaf },
  { value: 'coffee', label: 'Caffè', family: 'phosphor', Icon: Coffee },
  { value: 'beer', label: 'Birra', family: 'phosphor', Icon: BeerBottle },
  { value: 'pizza_slice', label: 'Pizza', family: 'phosphor', Icon: Pizza },
]

/** Lucide: `Tea` non esportato in lucide-react del progetto → `Milk` (bevanda calda ≠ caffè Phosphor). */
export const MENU_QR_LUCIDE_ICON_OPTIONS: MenuQrCategoryIconOption[] = [
  { value: 'lucide_chef_hat', label: 'Chef / cucina', family: 'lucide', Icon: ChefHat },
  { value: 'lucide_soup', label: 'Zuppa', family: 'lucide', Icon: Soup },
  { value: 'lucide_salad', label: 'Insalata', family: 'lucide', Icon: Salad },
  { value: 'lucide_shrimp', label: 'Gamberi / mare', family: 'lucide', Icon: Shrimp },
  { value: 'lucide_sandwich', label: 'Panino', family: 'lucide', Icon: Sandwich },
  { value: 'lucide_croissant', label: 'Brioche / colazione', family: 'lucide', Icon: Croissant },
  { value: 'lucide_ice_cream', label: 'Gelato', family: 'lucide', Icon: IceCreamCone },
  { value: 'lucide_cookie', label: 'Biscotti', family: 'lucide', Icon: Cookie },
  { value: 'lucide_egg_fried', label: 'Uova / brunch', family: 'lucide', Icon: EggFried },
  { value: 'lucide_tea', label: 'Tè', family: 'lucide', Icon: Milk },
]

export const MENU_QR_CATEGORY_ICON_OPTIONS: MenuQrCategoryIconOption[] = [
  ...MENU_QR_PHOSPHOR_ICON_OPTIONS,
  ...MENU_QR_LUCIDE_ICON_OPTIONS,
]

const MENU_QR_CATEGORY_ICON_OPTION_BY_VALUE = Object.fromEntries(
  MENU_QR_CATEGORY_ICON_OPTIONS.map((opt) => [opt.value, opt]),
) as Record<MenuQrCategoryIconKey, MenuQrCategoryIconOption>

const PHOSPHOR_ICON_BY_KEY = Object.fromEntries(
  MENU_QR_PHOSPHOR_ICON_OPTIONS.map((opt) => [opt.value, opt.Icon]),
) as Record<MenuQrPhosphorIconKey, PhosphorIconType>

/** @deprecated Usare `MenuQrCategoryIconGlyph` — solo icone Phosphor. */
export const CATEGORY_ICON: Record<string, PhosphorIconType> = Object.fromEntries(
  Object.entries(MENU_QR_CATEGORY_ICON_BY_CATEGORY_KEY).map(([key, iconKey]) => [
    key,
    PHOSPHOR_ICON_BY_KEY[iconKey],
  ]),
)

export function isMenuQrCategoryIconKey(key: string): key is MenuQrCategoryIconKey {
  return key in MENU_QR_CATEGORY_ICON_OPTION_BY_VALUE
}

export function getMenuQrCategoryIconOption(
  key: MenuQrCategoryIconKey,
): MenuQrCategoryIconOption {
  return MENU_QR_CATEGORY_ICON_OPTION_BY_VALUE[key]
}

/** @deprecated Usare `MenuQrCategoryIconGlyph` per Phosphor + Lucide. */
export function resolveMenuQrCategoryIcon(
  iconKey: string | null | undefined,
  categoryKey?: string,
): PhosphorIconType {
  const resolved = resolveMenuQrCategoryIconKey(iconKey, categoryKey)
  const opt = getMenuQrCategoryIconOption(resolved)
  if (opt.family === 'lucide') {
    return PHOSPHOR_ICON_BY_KEY[MENU_QR_DEFAULT_CATEGORY_ICON_KEY]
  }
  return opt.Icon
}

export function defaultIconKeyForCategory(categoryKey: string): MenuQrPhosphorIconKey | null {
  return MENU_QR_CATEGORY_ICON_BY_CATEGORY_KEY[categoryKey.toLowerCase()] ?? null
}

export function resolveMenuQrCategoryIconKey(
  iconKey: string | null | undefined,
  categoryKey?: string,
): MenuQrCategoryIconKey {
  if (iconKey && isMenuQrCategoryIconKey(iconKey)) return iconKey
  return defaultIconKeyForCategory(categoryKey ?? '') ?? MENU_QR_DEFAULT_CATEGORY_ICON_KEY
}
