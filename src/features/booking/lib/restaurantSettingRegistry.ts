import { z } from 'zod'
import type { Json } from '@/types/database'
import type { BusinessHours, BusinessHourSlot } from '@/lib/businessHours'
import { getDefaultBusinessHours, parseBusinessHours } from '@/lib/businessHours'

export const RESTAURANT_SETTING_KEYS_V1 = [
  'restaurant_name',
  'timezone',
  'booking_window_days',
  'business_hours',
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
const bookingWindowDaysSchema = z.coerce
  .number()
  .int('Deve essere un intero')
  .min(1, 'Minimo 1 giorno')
  .max(365, 'Massimo 365 giorni')

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

function parseBusinessHoursFromDb(raw: unknown): BusinessHours {
  const parsed = parseBusinessHours(raw)
  if (parsed) return parsed
  const zh = businessHoursSettingSchema.safeParse(raw)
  if (zh.success) return zh.data
  return getDefaultBusinessHours()
}

export type RestaurantSettingValueMap = {
  restaurant_name: string
  timezone: string
  booking_window_days: number
  business_hours: BusinessHours
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
}
