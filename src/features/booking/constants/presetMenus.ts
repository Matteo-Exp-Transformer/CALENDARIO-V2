/**
 * Preset menù Rinfresco di Laurea
 *
 * L’elenco selezionabile in UI usa solo `booking_custom_staff_presets` (restaurant_settings).
 * Le definizioni `menu_1`…`menu_4` restano per compatibilità con prenotazioni già salvate in DB.
 */

import type { BookingType } from '@/types/booking'

export const CUSTOM_PRESET_PREFIX = 'custom:' as const

/** Tipologie in cui un menù preselezionato può comparire (no «Prenota un tavolo»). */
export type StaffPresetBookingType = 'rinfresco_laurea' | 'menu_prezzo_fisso'

export const STAFF_PRESET_BOOKING_TYPE_VALUES: StaffPresetBookingType[] = [
  'rinfresco_laurea',
  'menu_prezzo_fisso',
]

export const STAFF_PRESET_DEFAULT_BOOKING_TYPES: StaffPresetBookingType[] = [
  ...STAFF_PRESET_BOOKING_TYPE_VALUES,
]

export const STAFF_PRESET_BOOKING_TYPE_OPTIONS: { value: StaffPresetBookingType; label: string }[] = [
  { value: 'rinfresco_laurea', label: 'Rinfresco di Laurea' },
  { value: 'menu_prezzo_fisso', label: 'Menu a prezzo fisso' },
]

export function normalizeStaffPresetBookingTypes(raw: unknown): StaffPresetBookingType[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [...STAFF_PRESET_DEFAULT_BOOKING_TYPES]
  }
  const allowed = new Set<string>(STAFF_PRESET_BOOKING_TYPE_VALUES)
  const filtered = raw.filter(
    (t): t is StaffPresetBookingType => typeof t === 'string' && allowed.has(t),
  )
  return filtered.length > 0 ? filtered : [...STAFF_PRESET_DEFAULT_BOOKING_TYPES]
}

export function staffPresetBookingTypeLabelsJoined(types: StaffPresetBookingType[]): string {
  return types
    .map((t) => STAFF_PRESET_BOOKING_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t)
    .join(', ')
}

export type BuiltinPresetMenuType = 'menu_1' | 'menu_2' | 'menu_3' | 'menu_4'

/** Valore salvato in `preset_menu`: built-in menu_1…4 oppure chiave custom */
export type PresetMenuType = BuiltinPresetMenuType | `${typeof CUSTOM_PRESET_PREFIX}${string}` | null

export interface CustomStaffPreset {
  id: string
  name: string
  item_ids: string[]
  /** Tipologie prenotazione con flusso menù in cui il preset è offerto (mai `tavolo`). */
  booking_types: StaffPresetBookingType[]
  /** Se `false`, il preset non compare nella pagina Prenota (default: visibile). */
  visible_on_booking?: boolean
}

export function isStaffPresetVisibleOnBooking(p: CustomStaffPreset): boolean {
  return p.visible_on_booking !== false
}

/** Preset visibile in pagina Prenota per la tipologia scelta (occhio aperto + booking_types). */
export function isStaffPresetSelectableForBookingType(
  p: CustomStaffPreset,
  bookingType: BookingType | string | null | undefined,
): boolean {
  if (!isStaffPresetVisibleOnBooking(p)) return false
  if (bookingType !== 'rinfresco_laurea' && bookingType !== 'menu_prezzo_fisso') return false
  return normalizeStaffPresetBookingTypes(p.booking_types).includes(bookingType)
}

export interface PresetMenu {
  id: BuiltinPresetMenuType
  label: string
  itemNames: string[] // Nomi degli items come nel database (match flessibile lato client)
}

/**
 * Menù 1: Base
 * Caraffe drink + Pizza Margherita
 */
export const MENU_1: PresetMenu = {
  id: 'menu_1',
  label: 'Menù 1 Rinfresco Leggero',
  itemNames: [
    'Caraffe drink',
    'Pizza Margherita'
  ]
}

/**
 * Menù 2: Medio
 * Caraffe drink + Pizza Margherita + Farinata + Olive Ascolana + Anelli di Cipolla + Patatine Fritte
 */
export const MENU_2: PresetMenu = {
  id: 'menu_2',
  label: 'Menù 2 Rinfresco Completo',
  itemNames: [
    'Caraffe drink',
    'Pizza Margherita',
    'Farinata',
    'Olive Ascolana',
    'Anelli di Cipolla',
    'Patatine fritte'
  ]
}

/**
 * Menù 3: Completo
 * Menù 2 + Cannelloni Ricotta e Spinaci
 */
export const MENU_3: PresetMenu = {
  id: 'menu_3',
  label: 'Menù 3 Pranzo o Cena',
  itemNames: [
    'Caraffe drink',
    'Pizza Margherita',
    'Farinata',
    'Anelli di Cipolla',
    'Patatine fritte',
    'Olive Ascolana',
    'Cannelloni Ricotta e Spinaci'
  ]
}

/**
 * Menù 4: Gourmet
 * Caraffe Premium + Panelle + Camembert + Lasagne Ragù + Polpette vegane di Lenticchie e Curry + Cannoli siciliani
 */
export const MENU_4: PresetMenu = {
  id: 'menu_4',
  label: 'Menù 4 Gourmet',
  itemNames: [
    'Caraffe Premium',
    'Panelle',
    'Camembert',
    'Lasagne Ragù',
    'Polpette vegane di Lenticchie e Curry',
    'Cannoli siciliani'
  ]
}

/**
 * Mappa di tutti i menu predefiniti staff (built-in)
 */
export const PRESET_MENUS: Record<BuiltinPresetMenuType, PresetMenu> = {
  menu_1: MENU_1,
  menu_2: MENU_2,
  menu_3: MENU_3,
  menu_4: MENU_4
}

export function isBuiltinPresetMenuType(v: string | null | undefined): v is BuiltinPresetMenuType {
  return v === 'menu_1' || v === 'menu_2' || v === 'menu_3' || v === 'menu_4'
}

export function isCustomPresetMenuType(v: string | null | undefined): v is `${typeof CUSTOM_PRESET_PREFIX}${string}` {
  return typeof v === 'string' && v.startsWith(CUSTOM_PRESET_PREFIX)
}

export function getCustomPresetUuid(v: string): string | null {
  if (!isCustomPresetMenuType(v)) return null
  return v.slice(CUSTOM_PRESET_PREFIX.length)
}

export function customPresetStorageId(uuid: string): `${typeof CUSTOM_PRESET_PREFIX}${string}` {
  return `${CUSTOM_PRESET_PREFIX}${uuid}`
}

/**
 * Helper per ottenere un preset menu built-in per tipo
 */
export const getPresetMenu = (type: PresetMenuType): PresetMenu | null => {
  if (!type || isCustomPresetMenuType(type)) return null
  return PRESET_MENUS[type] ?? null
}

/**
 * Label per UI (form, card, dettaglio)
 */
export const getPresetMenuLabel = (type: PresetMenuType, customPresets?: CustomStaffPreset[]): string => {
  if (!type) return 'Scegli un menu predefinito'
  if (isCustomPresetMenuType(type)) {
    const uuid = getCustomPresetUuid(type)
    const found = uuid ? customPresets?.find((p) => p.id === uuid) : undefined
    return found?.name ?? 'Menù consigliato personalizzato'
  }
  return getPresetMenu(type)?.label ?? 'Menu Sconosciuto'
}
