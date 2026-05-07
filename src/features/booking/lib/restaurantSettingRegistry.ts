import { z } from 'zod'
import type { Json } from '@/types/database'
import type { BusinessHours, BusinessHourSlot } from '@/lib/businessHours'
import { getDefaultBusinessHours, parseBusinessHours } from '@/lib/businessHours'
import {
  DEFAULT_BOOKING_TIME_SLOTS,
  type BookingTimeSlots,
  validateBookingTimeSlots,
} from '@/features/booking/utils/bookingTimeSlots'
import {
  type BookingPageBackgroundId,
  isBookingPageBackgroundId,
  parseBookingPageBackgroundFromDb,
} from '@/features/booking/constants/bookingPageBackground'
import type { CustomStaffPreset } from '@/features/booking/constants/presetMenus'
import { DEFAULT_VOL_AU_VENT_PROMO_MESSAGE } from '@/features/booking/constants/volAuVentPromo'

export const RESTAURANT_SETTING_KEYS_V1 = [
  'restaurant_name',
  'timezone',
  'booking_window_days',
  'daily_guest_limit',
  'booking_time_slots',
  'business_hours',
  'contact_email',
  'contact_phone',
  'contact_address',
  'public_booking_page_background',
  /** Mostra nel form pubblico il menu a tendina “menù consigliati” (built-in + personalizzati) */
  'booking_staff_presets_visible',
  /** Menù predefiniti creati dall’admin (nome + lista id voci) */
  'booking_custom_staff_presets',
  /** Banner sopra al menu a tendina: omaggio Mini Rustici sopra soglia €/persona */
  'booking_vol_au_vent_promo_visible',
  /** Testo del banner (admin) */
  'booking_vol_au_vent_promo_message',
  /** Elenco aree di posizionamento prenotazioni (es. Sala A, Sala B, Deorr) */
  'booking_placement_areas',
] as const

export type RestaurantSettingKeyV1 = (typeof RESTAURANT_SETTING_KEYS_V1)[number]

const timeHm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Usa il formato HH:mm')

const businessHourSlotSchema = z.object({
  open: timeHm,
  close: timeHm,
})

const daySlotsSchema = z.union([z.null(), z.array(businessHourSlotSchema)])

export const businessHoursSettingSchema = z
  .object({
    monday: daySlotsSchema.optional(),
    tuesday: daySlotsSchema.optional(),
    wednesday: daySlotsSchema.optional(),
    thursday: daySlotsSchema.optional(),
    friday: daySlotsSchema.optional(),
    saturday: daySlotsSchema.optional(),
    sunday: daySlotsSchema.optional(),
  })
  .transform(
    (raw): BusinessHours => ({
      monday: raw.monday ?? null,
      tuesday: raw.tuesday ?? null,
      wednesday: raw.wednesday ?? null,
      thursday: raw.thursday ?? null,
      friday: raw.friday ?? null,
      saturday: raw.saturday ?? null,
      sunday: raw.sunday ?? null,
    })
  )

const restaurantNameSchema = z.string().trim().min(1, 'Il nome è obbligatorio').max(200)
const timezoneSchema = z.string().trim().min(1, 'Il fuso orario è obbligatorio').max(80)
const genericTextSchema = z.string().trim().min(1, 'Campo obbligatorio').max(200)
const emailSchema = z.string().trim().email('Email non valida').max(200)
const phoneSchema = z.string().trim().min(3, 'Telefono non valido').max(50)
const bookingWindowDaysSchema = z.coerce
  .number()
  .int('Deve essere un intero')
  .min(1, 'Minimo 1 giorno')
  .max(365, 'Massimo 365 giorni')
const dailyGuestLimitSchema = z.coerce
  .number()
  .int('Deve essere un intero')
  .min(1, 'Minimo 1 ospite')
  .max(1000, 'Massimo 1000 ospiti')

/** Valore JSON salvato su `restaurant_settings.setting_value` quando non c’è limite giornaliero (la colonna è NOT NULL). */
export const DAILY_GUEST_LIMIT_UNLIMITED_DB_VALUE = -1
const bookingTimeSlotsSchema = z.object({
  morningStart: timeHm,
  morningEnd: timeHm,
  afternoonStart: timeHm,
  afternoonEnd: timeHm,
  eveningStart: timeHm,
  eveningEnd: timeHm,
})

function parseJsonScalarString(raw: unknown): string {
  if (raw == null) return ''
  if (typeof raw === 'string') return raw
  if (typeof raw === 'number' || typeof raw === 'boolean') return String(raw)
  return ''
}

function parseBookingWindowDaysFromDb(raw: unknown): number {
  if (raw == null) return 60
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const n = parseInt(raw, 10)
    if (!Number.isNaN(n)) return n
  }
  return 60
}

/**
 * `daily_guest_limit` può essere assente/`null` per indicare «nessun limite».
 * Restituisce `null` quando il valore non è impostato o non è un numero valido,
 * così l'app sa che non deve applicare alcun cap giornaliero.
 */
function parseDailyGuestLimitFromDb(raw: unknown): number | null {
  if (raw == null) return null
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    if (raw === DAILY_GUEST_LIMIT_UNLIMITED_DB_VALUE) return null
    return raw
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (trimmed === '') return null
    const n = parseInt(trimmed, 10)
    if (!Number.isNaN(n)) {
      if (n === DAILY_GUEST_LIMIT_UNLIMITED_DB_VALUE) return null
      return n
    }
  }
  return null
}

function parseBusinessHoursFromDb(raw: unknown): BusinessHours {
  const parsed = parseBusinessHours(raw)
  if (parsed) return parsed
  const zh = businessHoursSettingSchema.safeParse(raw)
  if (zh.success) return zh.data
  return getDefaultBusinessHours()
}

function parseBookingTimeSlotsFromDb(raw: unknown): BookingTimeSlots {
  const parsed = bookingTimeSlotsSchema.safeParse(raw)
  if (!parsed.success) return DEFAULT_BOOKING_TIME_SLOTS
  const error = validateBookingTimeSlots(parsed.data)
  if (error) return DEFAULT_BOOKING_TIME_SLOTS
  return parsed.data
}

const customStaffPresetRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(200),
  item_ids: z.array(z.string().uuid()).max(160),
})

const bookingCustomStaffPresetsSchema = z.array(customStaffPresetRowSchema).max(40)

function parseBookingStaffPresetsVisibleFromDb(raw: unknown): boolean {
  if (raw == null) return true
  if (typeof raw === 'boolean') return raw
  if (raw === 'false' || raw === false) return false
  if (raw === 'true' || raw === true) return true
  return true
}

function parseBookingCustomStaffPresetsFromDb(raw: unknown): CustomStaffPreset[] {
  const parsed = bookingCustomStaffPresetsSchema.safeParse(raw)
  if (!parsed.success) return []
  return parsed.data
}

function parseBookingVolAuVentPromoVisibleFromDb(raw: unknown): boolean {
  if (raw == null) return true
  if (typeof raw === 'boolean') return raw
  if (raw === 'false' || raw === false) return false
  if (raw === 'true' || raw === true) return true
  return true
}

const volAuVentPromoMessageSchema = z.string().trim().min(1).max(500)
const placementAreaLabelSchema = z.string().trim().min(1).max(40)
const bookingPlacementAreasSchema = z.array(placementAreaLabelSchema).min(1).max(30)

function parseBookingVolAuVentPromoMessageFromDb(raw: unknown): string {
  const s = parseJsonScalarString(raw).trim()
  if (!s) return DEFAULT_VOL_AU_VENT_PROMO_MESSAGE
  return s
}

function parseBookingPlacementAreasFromDb(raw: unknown): string[] {
  const parsed = bookingPlacementAreasSchema.safeParse(raw)
  if (!parsed.success) return ['Sala A', 'Sala B', 'Deorr']
  const unique = parsed.data.filter((item, index, arr) => arr.indexOf(item) === index)
  return unique.length > 0 ? unique : ['Sala A', 'Sala B', 'Deorr']
}

export type RestaurantSettingValueMap = {
  restaurant_name: string
  timezone: string
  booking_window_days: number
  daily_guest_limit: number | null
  booking_time_slots: BookingTimeSlots
  business_hours: BusinessHours
  contact_email: string
  contact_phone: string
  contact_address: string
  public_booking_page_background: BookingPageBackgroundId
  booking_staff_presets_visible: boolean
  booking_custom_staff_presets: CustomStaffPreset[]
  booking_vol_au_vent_promo_visible: boolean
  booking_vol_au_vent_promo_message: string
  booking_placement_areas: string[]
}

export interface RestaurantSettingRegistryEntry<K extends RestaurantSettingKeyV1> {
  key: K
  parseFromDb(raw: unknown): RestaurantSettingValueMap[K]
  serializeToDb(value: RestaurantSettingValueMap[K]): Json
  validate(value: unknown): string | null
}

export const restaurantSettingRegistry: {
  [K in RestaurantSettingKeyV1]: RestaurantSettingRegistryEntry<K>
} = {
  restaurant_name: {
    key: 'restaurant_name',
    parseFromDb: (raw) => parseJsonScalarString(raw),
    serializeToDb: (value) => value as Json,
    validate: (value) => {
      const r = restaurantNameSchema.safeParse(value)
      return r.success ? null : r.error.issues[0]?.message ?? 'Valore non valido'
    },
  },
  timezone: {
    key: 'timezone',
    parseFromDb: (raw) => parseJsonScalarString(raw),
    serializeToDb: (value) => value as Json,
    validate: (value) => {
      const r = timezoneSchema.safeParse(value)
      return r.success ? null : r.error.issues[0]?.message ?? 'Valore non valido'
    },
  },
  booking_window_days: {
    key: 'booking_window_days',
    parseFromDb: (raw) => parseBookingWindowDaysFromDb(raw),
    serializeToDb: (value) => value as Json,
    validate: (value) => {
      const r = bookingWindowDaysSchema.safeParse(value)
      return r.success ? null : r.error.issues[0]?.message ?? 'Valore non valido'
    },
  },
  daily_guest_limit: {
    key: 'daily_guest_limit',
    parseFromDb: (raw) => parseDailyGuestLimitFromDb(raw),
    serializeToDb: (value) => {
      // La colonna DB è NOT NULL: usiamo -1 come sentinella per «nessun limite».
      if (value == null) return DAILY_GUEST_LIMIT_UNLIMITED_DB_VALUE as unknown as Json
      return value as Json
    },
    validate: (value) => {
      // Campo opzionale: vuoto/null = nessun limite, sempre valido
      if (value == null || value === '') return null
      const r = dailyGuestLimitSchema.safeParse(value)
      return r.success ? null : r.error.issues[0]?.message ?? 'Valore non valido'
    },
  },
  booking_time_slots: {
    key: 'booking_time_slots',
    parseFromDb: (raw) => parseBookingTimeSlotsFromDb(raw),
    serializeToDb: (value) => value as Json,
    validate: (value) => {
      const r = bookingTimeSlotsSchema.safeParse(value)
      if (!r.success) return r.error.issues[0]?.message ?? 'Fasce orarie non valide'
      return validateBookingTimeSlots(r.data)
    },
  },
  business_hours: {
    key: 'business_hours',
    parseFromDb: (raw) => parseBusinessHoursFromDb(raw),
    serializeToDb: (value) => {
      const v = value as BusinessHours
      const out: Record<string, BusinessHourSlot[] | null> = {}
      const days: (keyof BusinessHours)[] = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ]
      for (const d of days) {
        const slots = v[d]
        out[d] = slots && slots.length > 0 ? slots : null
      }
      return out as Json
    },
    validate: (value) => {
      const r = businessHoursSettingSchema.safeParse(value)
      if (!r.success) return r.error.issues[0]?.message ?? 'Orari non validi'
      const parsed = parseBusinessHours(r.data)
      return parsed ? null : 'Struttura orari non valida'
    },
  },
  contact_email: {
    key: 'contact_email',
    parseFromDb: (raw) => parseJsonScalarString(raw),
    serializeToDb: (value) => value as Json,
    validate: (value) => {
      const r = emailSchema.safeParse(value)
      return r.success ? null : r.error.issues[0]?.message ?? 'Valore non valido'
    },
  },
  contact_phone: {
    key: 'contact_phone',
    parseFromDb: (raw) => parseJsonScalarString(raw),
    serializeToDb: (value) => value as Json,
    validate: (value) => {
      const r = phoneSchema.safeParse(value)
      return r.success ? null : r.error.issues[0]?.message ?? 'Valore non valido'
    },
  },
  contact_address: {
    key: 'contact_address',
    parseFromDb: (raw) => parseJsonScalarString(raw),
    serializeToDb: (value) => value as Json,
    validate: (value) => {
      const r = genericTextSchema.safeParse(value)
      return r.success ? null : r.error.issues[0]?.message ?? 'Valore non valido'
    },
  },
  public_booking_page_background: {
    key: 'public_booking_page_background',
    parseFromDb: (raw) => parseBookingPageBackgroundFromDb(raw),
    serializeToDb: (value) => String(value).trim().toLowerCase() as Json,
    validate: (value) => {
      if (typeof value !== 'string') return 'Seleziona uno sfondo valido'
      const normalized = value.trim().toLowerCase()
      if (isBookingPageBackgroundId(normalized)) return null
      return 'Sfondo pagina non valido'
    },
  },
  booking_staff_presets_visible: {
    key: 'booking_staff_presets_visible',
    parseFromDb: (raw) => parseBookingStaffPresetsVisibleFromDb(raw),
    serializeToDb: (value) => value as Json,
    validate: (value) => {
      return typeof value === 'boolean' ? null : 'Valore non valido'
    },
  },
  booking_custom_staff_presets: {
    key: 'booking_custom_staff_presets',
    parseFromDb: (raw) => parseBookingCustomStaffPresetsFromDb(raw),
    serializeToDb: (value) => value as unknown as Json,
    validate: (value) => {
      const r = bookingCustomStaffPresetsSchema.safeParse(value)
      return r.success ? null : r.error.issues[0]?.message ?? 'Menù preselezionati non validi'
    },
  },
  booking_vol_au_vent_promo_visible: {
    key: 'booking_vol_au_vent_promo_visible',
    parseFromDb: (raw) => parseBookingVolAuVentPromoVisibleFromDb(raw),
    serializeToDb: (value) => value as Json,
    validate: (value) => {
      return typeof value === 'boolean' ? null : 'Valore non valido'
    },
  },
  booking_vol_au_vent_promo_message: {
    key: 'booking_vol_au_vent_promo_message',
    parseFromDb: (raw) => parseBookingVolAuVentPromoMessageFromDb(raw),
    serializeToDb: (value) => value as Json,
    validate: (value) => {
      const r = volAuVentPromoMessageSchema.safeParse(value)
      return r.success ? null : r.error.issues[0]?.message ?? 'Messaggio non valido'
    },
  },
  booking_placement_areas: {
    key: 'booking_placement_areas',
    parseFromDb: (raw) => parseBookingPlacementAreasFromDb(raw),
    serializeToDb: (value) => value as unknown as Json,
    validate: (value) => {
      const r = bookingPlacementAreasSchema.safeParse(value)
      if (!r.success) return r.error.issues[0]?.message ?? 'Aree di posizionamento non valide'
      const unique = r.data.filter((item, index, arr) => arr.indexOf(item) === index)
      return unique.length === r.data.length ? null : 'Le aree di posizionamento devono essere univoche'
    },
  },
}
