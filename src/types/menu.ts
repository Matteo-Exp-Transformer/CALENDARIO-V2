// Type definitions for Menu Items

import type { BookingType } from './booking'

export type MenuCategory = string

/** Valori ammessi in DB per `menu_items.booking_types` (allineati al form pubblico). */
export const MENU_ITEM_BOOKING_TYPE_VALUES: BookingType[] = [
  'tavolo',
  'rinfresco_laurea',
  'menu_prezzo_fisso',
]

export function normalizeMenuItemBookingTypes(raw: unknown): BookingType[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [...MENU_ITEM_BOOKING_TYPE_VALUES]
  }
  const allowed = new Set<string>(MENU_ITEM_BOOKING_TYPE_VALUES)
  const filtered = raw.filter((t): t is BookingType => typeof t === 'string' && allowed.has(t))
  return filtered.length > 0 ? filtered : [...MENU_ITEM_BOOKING_TYPE_VALUES]
}

export interface MenuItem {
  id: string
  created_at: string
  updated_at: string
  name: string
  category: MenuCategory
  price: number
  description?: string
  sort_order: number
  /** Tipologie prenotazione in cui l'ingrediente e offerto nel menu (form pubblico). */
  booking_types?: BookingType[]
  /** URL pubblico foto piatto (Supabase Storage bucket menu-photos). Opzionale. */
  image_url?: string | null
}

export interface MenuItemInput {
  name: string
  category: MenuCategory
  price: number
  description?: string
  sort_order?: number
  booking_types?: BookingType[]
  image_url?: string | null
}

/** Tipo per i QR code del menu pubblico. */
export interface MenuQrCode {
  id: string
  tenant_id: string
  short_code: string
  name: string
  content_type: 'a_la_carte' | 'preset_menus' | 'mixed'
  category_filter: string[] | null
  preset_ids: string[] | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MenuQrCodeInput {
  name: string
  content_type: 'a_la_carte' | 'preset_menus' | 'mixed'
  category_filter?: string[] | null
  preset_ids?: string[] | null
  is_active?: boolean
  sort_order?: number
}

export interface CarouselItem {
  image_url: string
  label?: string
  sort_order: number
}

export interface MenuHomepageConfig {
  id: string
  tenant_id: string
  carousel_items: CarouselItem[]
  category_images: Record<string, string>
  created_at: string
  updated_at: string
}

export interface MenuHomepageConfigInput {
  carousel_items: CarouselItem[]
  category_images: Record<string, string>
}

export interface SelectedMenuItem {
  id: string
  name: string
  price: number
  category: MenuCategory
  quantity?: number
  totalPrice?: number
}

// Dietary restriction types
export const DIETARY_RESTRICTIONS = [
  'No Lattosio',
  'Vegano',
  'Vegetariano',
  'No Glutine',
  'No Frutta secca',
  'Altro'
] as const

export type DietaryRestrictionType = typeof DIETARY_RESTRICTIONS[number]


















