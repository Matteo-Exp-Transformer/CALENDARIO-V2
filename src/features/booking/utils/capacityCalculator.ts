import type { BookingRequest } from '@/types/booking'
import {
  DEFAULT_SLOT_GUEST_CAPACITIES,
  type SlotGuestCapacities,
} from '@/features/booking/lib/restaurantSettingRegistry'
import { extractDateFromISO } from './dateUtils'
import {
  DEFAULT_BOOKING_TIME_SLOTS,
  isTimeInsideSlot,
  parseHmToMinutes,
  slotRangesOverlap,
  type BookingTimeSlots,
  type SlotConfig,
} from './bookingTimeSlots'

// Tipi nuovi per N slot -------------------------------------------------------

export interface SlotCapacityEntry {
  slotId: string
  name: string
  capacity: number | null
  occupied: number
  available: number | null
}

export interface DailyCapacityV2 {
  date: string
  slots: SlotCapacityEntry[]
}

// Tipo legacy per compatibilità transitoria
export interface TimeSlotCapacityLegacy {
  slot: string
  capacity: number | null
  occupied: number
  available: number | null
}

// Helper interni --------------------------------------------------------------

function extractTimeFromISO(isoString: string): string {
  const match = isoString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)
  if (match) return `${match[4]}:${match[5]}`
  return isoString.split('T')[1]?.substring(0, 5) ?? ''
}

// N-slot API (nuova) ----------------------------------------------------------

/**
 * Restituisce i `SlotConfig.id` occupati da una prenotazione (overlap con i range della fascia).
 * Una prenotazione occupa una fascia se il suo range si sovrappone al range della fascia.
 */
export function getSlotsOccupiedByBookingV2(
  start: string,
  end: string,
  slots: SlotConfig[]
): string[] {
  const startTime = extractTimeFromISO(start)
  const endTime = extractTimeFromISO(end)
  const startMinutes = parseHmToMinutes(startTime)
  const endMinutes = parseHmToMinutes(endTime)
  const bookingCrossesMidnight = endMinutes < startMinutes

  const result: string[] = []
  for (const slot of slots) {
    const overlaps = bookingCrossesMidnight
      ? slotRangesOverlap(startTime, '23:59', slot.start_time, slot.end_time) ||
        slotRangesOverlap('00:00', endTime, slot.start_time, slot.end_time)
      : slotRangesOverlap(startTime, endTime, slot.start_time, slot.end_time)
    if (overlaps) result.push(slot.id)
  }
  return result
}

/**
 * Ritorna l'id della fascia in cui cade l'orario di inizio della prenotazione.
 * Prende la prima fascia (per display_order) che contiene l'orario.
 * Se nessuna → fallback all'ultima fascia (comportamento legacy preservato).
 */
export function getStartSlotForBookingV2(start: string, slots: SlotConfig[]): string {
  if (slots.length === 0) return 'daily'
  const startTime = extractTimeFromISO(start)
  const sorted = [...slots].sort((a, b) => a.display_order - b.display_order)
  for (const slot of sorted) {
    if (isTimeInsideSlot(startTime, slot.start_time, slot.end_time)) return slot.id
  }
  return sorted[sorted.length - 1].id
}

/**
 * Calcola la capacity giornaliera per N fasce dinamiche.
 * `slotCapacities`: Record<slotId, number | null>
 */
export function calculateDailyCapacityV2(
  date: string,
  bookings: BookingRequest[],
  slots: SlotConfig[],
  slotCapacities: Record<string, number | null> = {}
): DailyCapacityV2 {
  const counters: Record<string, number> = {}
  for (const slot of slots) counters[slot.id] = 0

  const dayBookings = bookings.filter((b) => {
    if (!b.confirmed_start) return false
    return extractDateFromISO(b.confirmed_start) === date
  })

  for (const booking of dayBookings) {
    if (!booking.confirmed_start || !booking.confirmed_end) continue
    const occupied = getSlotsOccupiedByBookingV2(booking.confirmed_start, booking.confirmed_end, slots)
    for (const slotId of occupied) {
      if (slotId in counters) counters[slotId] += booking.num_guests ?? 0
    }
  }

  const entries: SlotCapacityEntry[] = slots.map((slot) => {
    const cap = slotCapacities[slot.id] ?? null
    const occ = counters[slot.id] ?? 0
    return {
      slotId: slot.id,
      name: slot.name,
      capacity: cap,
      occupied: occ,
      available: cap == null ? null : cap - occ,
    }
  })

  return { date, slots: entries }
}

// Legacy API — @deprecated ---------------------------------------------------

/** @deprecated Usare getSlotsOccupiedByBookingV2. Rimuovere allo Step 9. */
export function getSlotsOccupiedByBooking(
  start: string,
  end: string,
  slotConfig: BookingTimeSlots = DEFAULT_BOOKING_TIME_SLOTS
): string[] {
  const startTime = extractTimeFromISO(start)
  const endTime = extractTimeFromISO(end)
  const startMinutes = parseHmToMinutes(startTime)
  const endMinutes = parseHmToMinutes(endTime)
  const bookingCrossesMidnight = endMinutes < startMinutes

  const overlaps = (slotStart: string, slotEnd: string) =>
    bookingCrossesMidnight
      ? slotRangesOverlap(startTime, '23:59', slotStart, slotEnd) ||
        slotRangesOverlap('00:00', endTime, slotStart, slotEnd)
      : slotRangesOverlap(startTime, endTime, slotStart, slotEnd)

  const slots: string[] = []
  if (overlaps(slotConfig.morningStart, slotConfig.morningEnd)) slots.push('morning')
  if (overlaps(slotConfig.afternoonStart, slotConfig.afternoonEnd)) slots.push('afternoon')
  if (overlaps(slotConfig.eveningStart, slotConfig.eveningEnd)) slots.push('evening')
  return slots
}

/** @deprecated Usare getStartSlotForBookingV2. Rimuovere allo Step 9. */
export function getStartSlotForBooking(
  start: string,
  slotConfig: BookingTimeSlots = DEFAULT_BOOKING_TIME_SLOTS
): string {
  const startTime = extractTimeFromISO(start)
  if (isTimeInsideSlot(startTime, slotConfig.morningStart, slotConfig.morningEnd)) return 'morning'
  if (isTimeInsideSlot(startTime, slotConfig.afternoonStart, slotConfig.afternoonEnd)) return 'afternoon'
  return 'evening'
}

/** @deprecated Usare calculateDailyCapacityV2. Rimuovere allo Step 9. */
export function calculateDailyCapacity(
  date: string,
  bookings: BookingRequest[],
  slotConfig: BookingTimeSlots = DEFAULT_BOOKING_TIME_SLOTS,
  slotGuestCapacities: SlotGuestCapacities = DEFAULT_SLOT_GUEST_CAPACITIES
): { date: string; morning: TimeSlotCapacityLegacy; afternoon: TimeSlotCapacityLegacy; evening: TimeSlotCapacityLegacy } {
  const morning: TimeSlotCapacityLegacy = { slot: 'morning', capacity: slotGuestCapacities.morning, occupied: 0, available: slotGuestCapacities.morning }
  const afternoon: TimeSlotCapacityLegacy = { slot: 'afternoon', capacity: slotGuestCapacities.afternoon, occupied: 0, available: slotGuestCapacities.afternoon }
  const evening: TimeSlotCapacityLegacy = { slot: 'evening', capacity: slotGuestCapacities.evening, occupied: 0, available: slotGuestCapacities.evening }

  const dayBookings = bookings.filter((b) => {
    if (!b.confirmed_start) return false
    return extractDateFromISO(b.confirmed_start) === date
  })

  for (const booking of dayBookings) {
    if (!booking.confirmed_start || !booking.confirmed_end) continue
    const slots = getSlotsOccupiedByBooking(booking.confirmed_start, booking.confirmed_end, slotConfig)
    const g = booking.num_guests ?? 0
    for (const slot of slots) {
      if (slot === 'morning') morning.occupied += g
      else if (slot === 'afternoon') afternoon.occupied += g
      else if (slot === 'evening') evening.occupied += g
    }
  }

  morning.available   = morning.capacity   == null ? null : morning.capacity   - morning.occupied
  afternoon.available = afternoon.capacity == null ? null : afternoon.capacity - afternoon.occupied
  evening.available   = evening.capacity   == null ? null : evening.capacity   - evening.occupied

  return { date, morning, afternoon, evening }
}
