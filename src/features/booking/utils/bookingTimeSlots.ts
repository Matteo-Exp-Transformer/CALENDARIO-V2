import { BOOKING_SLOT_TIME_DEFAULTS } from '@/features/booking/constants/capacity'

export type BookingTimeSlots = {
  morningStart: string
  morningEnd: string
  afternoonStart: string
  afternoonEnd: string
  eveningStart: string
  eveningEnd: string
}

export type CanonicalSlot = {
  name: string
  start_time: string
  end_time: string
  is_canonical: boolean
  display_order: number
}

/** end_time < start_time → fascia che attraversa la mezzanotte */
export function slotCrossesMidnight(slot: Pick<CanonicalSlot, 'start_time' | 'end_time'>): boolean {
  return slot.end_time.slice(0, 5) < slot.start_time.slice(0, 5)
}

/** Avviso UI quando fine < inizio (orario nel giorno successivo). */
export const OVERNIGHT_TIME_END_HINT =
  "Orario notturno — l'orario di fine cade nel giorno successivo."

/**
 * Converte le 3 fasce canoniche (Colazione/Pranzo/Cena) nel formato BookingTimeSlots
 * usato da calendario, capacity e pending. Le fasce devono essere già ordinate per display_order.
 */
export function toBookingTimeSlots(canonicalSlots: CanonicalSlot[]): BookingTimeSlots {
  const ordered = [...canonicalSlots]
    .filter((s) => s.is_canonical)
    .sort((a, b) => a.display_order - b.display_order)

  const [morning, afternoon, evening] = ordered

  return {
    morningStart: morning?.start_time?.slice(0, 5) ?? BOOKING_SLOT_TIME_DEFAULTS.MORNING_START,
    morningEnd: morning?.end_time?.slice(0, 5) ?? BOOKING_SLOT_TIME_DEFAULTS.MORNING_END,
    afternoonStart: afternoon?.start_time?.slice(0, 5) ?? BOOKING_SLOT_TIME_DEFAULTS.AFTERNOON_START,
    afternoonEnd: afternoon?.end_time?.slice(0, 5) ?? BOOKING_SLOT_TIME_DEFAULTS.AFTERNOON_END,
    eveningStart: evening?.start_time?.slice(0, 5) ?? BOOKING_SLOT_TIME_DEFAULTS.EVENING_START,
    eveningEnd: evening?.end_time?.slice(0, 5) ?? BOOKING_SLOT_TIME_DEFAULTS.EVENING_END,
  }
}

export const DEFAULT_BOOKING_TIME_SLOTS: BookingTimeSlots = {
  morningStart: BOOKING_SLOT_TIME_DEFAULTS.MORNING_START,
  morningEnd: BOOKING_SLOT_TIME_DEFAULTS.MORNING_END,
  afternoonStart: BOOKING_SLOT_TIME_DEFAULTS.AFTERNOON_START,
  afternoonEnd: BOOKING_SLOT_TIME_DEFAULTS.AFTERNOON_END,
  eveningStart: BOOKING_SLOT_TIME_DEFAULTS.EVENING_START,
  eveningEnd: BOOKING_SLOT_TIME_DEFAULTS.EVENING_END,
}

const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/

export function parseHmToMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number)
  return h * 60 + m
}

type MinuteRange = [number, number]

function toDaySegments(start: number, end: number): MinuteRange[] {
  // Fascia che attraversa la mezzanotte: es. 18:00 -> 03:00
  if (end < start) return [[start, 24 * 60], [0, end]]
  return [[start, end]]
}

function rangesOverlap(a: MinuteRange, b: MinuteRange): boolean {
  return a[0] < b[1] && b[0] < a[1]
}

export function slotRangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  const aSegments = toDaySegments(parseHmToMinutes(aStart), parseHmToMinutes(aEnd))
  const bSegments = toDaySegments(parseHmToMinutes(bStart), parseHmToMinutes(bEnd))
  for (const a of aSegments) {
    for (const b of bSegments) {
      if (rangesOverlap(a, b)) return true
    }
  }
  return false
}

export function isTimeInsideSlot(time: string, slotStart: string, slotEnd: string): boolean {
  const t = parseHmToMinutes(time)
  const start = parseHmToMinutes(slotStart)
  const end = parseHmToMinutes(slotEnd)
  if (end < start) {
    return t >= start || t <= end
  }
  return t >= start && t <= end
}

export function getBookingTimeSlotLabel(
  slot: 'morning' | 'afternoon' | 'evening',
  config: BookingTimeSlots
): string {
  if (slot === 'morning') return `Mattina ${config.morningStart} - ${config.morningEnd}`
  if (slot === 'afternoon') return `Pomeriggio ${config.afternoonStart} - ${config.afternoonEnd}`
  return `Sera ${config.eveningStart} - ${config.eveningEnd}`
}

export function validateBookingTimeSlots(config: BookingTimeSlots): string | null {
  const allTimes = [
    config.morningStart,
    config.morningEnd,
    config.afternoonStart,
    config.afternoonEnd,
    config.eveningStart,
    config.eveningEnd,
  ]

  for (const time of allTimes) {
    if (!HH_MM.test(time)) {
      return 'Ogni orario deve essere nel formato HH:mm'
    }
  }

  const morningStart = parseHmToMinutes(config.morningStart)
  const morningEnd = parseHmToMinutes(config.morningEnd)
  const afternoonStart = parseHmToMinutes(config.afternoonStart)
  const afternoonEnd = parseHmToMinutes(config.afternoonEnd)
  const eveningStart = parseHmToMinutes(config.eveningStart)
  const eveningEnd = parseHmToMinutes(config.eveningEnd)

  if (morningStart === morningEnd) return 'La fascia Mattina non e valida: inizio e fine coincidono'
  if (afternoonStart === afternoonEnd) return 'La fascia Pomeriggio non e valida: inizio e fine coincidono'
  if (eveningStart === eveningEnd) return 'La fascia Sera non e valida: inizio e fine coincidono'

  if (
    slotRangesOverlap(
      config.morningStart,
      config.morningEnd,
      config.afternoonStart,
      config.afternoonEnd
    )
  ) {
    return 'Le fasce Mattina e Pomeriggio si sovrappongono'
  }
  if (
    slotRangesOverlap(
      config.afternoonStart,
      config.afternoonEnd,
      config.eveningStart,
      config.eveningEnd
    )
  ) {
    return 'Le fasce Pomeriggio e Sera si sovrappongono'
  }
  if (
    slotRangesOverlap(
      config.morningStart,
      config.morningEnd,
      config.eveningStart,
      config.eveningEnd
    )
  ) {
    return 'Le fasce Mattina e Sera si sovrappongono'
  }

  return null
}

