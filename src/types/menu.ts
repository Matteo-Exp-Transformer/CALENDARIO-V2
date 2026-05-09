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
  /** Tipologie prenotazione in cui l’ingrediente è offerto nel menu (form pubblico). */
  booking_types?: BookingType[]
}

export interface MenuItemInput {
  name: string
  category: MenuCategory
  price: number
  description?: string
  sort_order?: number
  booking_types?: BookingType[]
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


















