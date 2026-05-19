import { BOOKING_SLOT_TIME_DEFAULTS } from '@/features/booking/constants/capacity'

/**
 * Configurazione di una fascia oraria dinamica (N fasce, non più 3 fisse).
 * Usa `id` (service_slots.id) come chiave nei calcoli capacity.
 */
export type SlotConfig = {
  id: string
  name: string
  start_time: string  // HH:mm
  end_time: string    // HH:mm
  display_order: number
  is_canonical: boolean
  slot_color?: string | null
}

/** Ritorna l'etichetta UI di una fascia: "Nome HH:mm - HH:mm" */
export function getSlotLabel(slot: Pick<SlotConfig, 'name' | 'start_time' | 'end_time'>): string {
  return `${slot.name} ${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`
}

/**
 * Valida un array di SlotConfig: formato orari, nomi univoci, no inizio=fine, no sovrapposizioni.
 * Ritorna stringa di errore o null.
 */
export function validateSlotConfigs(slots: SlotConfig[]): string | null {
  if (slots.length === 0) return 'Almeno una fascia oraria è richiesta'
  const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/
  const names = new Set<string>()
  for (const slot of slots) {
    if (!HH_MM.test(slot.start_time)) return `Fascia "${slot.name}": orario inizio non valido`
    if (!HH_MM.test(slot.end_time)) return `Fascia "${slot.name}": orario fine non valido`
    if (slot.start_time === slot.end_time) return `Fascia "${slot.name}": inizio e fine coincidono`
    const key = slot.name.trim().toLowerCase()
    if (names.has(key)) return `Nome fascia duplicato: "${slot.name}"`
    names.add(key)
  }
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (slotRangesOverlap(slots[i].start_time, slots[i].end_time, slots[j].start_time, slots[j].end_time)) {
        return `Le fasce "${slots[i].name}" e "${slots[j].name}" si sovrappongono`
      }
    }
  }
  return null
}

/**
 * Converte N SlotConfig nel formato legacy BookingTimeSlots (3 slot fissi).
 * Usato come adapter durante la migrazione degli step.
 * Prende i primi 3 per display_order; riempie con default se meno di 3.
 * @deprecated Rimuovere allo Step 9 quando tutti i consumer usano SlotConfig.
 */
export function slotConfigsToLegacyBookingTimeSlots(slots: SlotConfig[]): BookingTimeSlots {
  const ordered = [...slots].sort((a, b) => a.display_order - b.display_order)
  const [s0, s1, s2] = ordered
  return {
    morningStart:    s0?.start_time?.slice(0, 5) ?? BOOKING_SLOT_TIME_DEFAULTS.MORNING_START,
    morningEnd:      s0?.end_time?.slice(0, 5)   ?? BOOKING_SLOT_TIME_DEFAULTS.MORNING_END,
    afternoonStart:  s1?.start_time?.slice(0, 5) ?? BOOKING_SLOT_TIME_DEFAULTS.AFTERNOON_START,
    afternoonEnd:    s1?.end_time?.slice(0, 5)   ?? BOOKING_SLOT_TIME_DEFAULTS.AFTERNOON_END,
    eveningStart:    s2?.start_time?.slice(0, 5) ?? BOOKING_SLOT_TIME_DEFAULTS.EVENING_START,
    eveningEnd:      s2?.end_time?.slice(0, 5)   ?? BOOKING_SLOT_TIME_DEFAULTS.EVENING_END,
  }
}

// ---------------------------------------------------------------------------
// Legacy types & functions — @deprecated, mantenuti per compatibilità Step 1-8
// ---------------------------------------------------------------------------

/** @deprecated Usare SlotConfig */
export type BookingTimeSlots = {
  morningStart: string
  morningEnd: string
  afternoonStart: string
  afternoonEnd: string
  eveningStart: string
  eveningEnd: string
}

/** @deprecated Usare SlotConfig */
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
 * Converte le 3 fasce canoniche nel formato BookingTimeSlots.
 * @deprecated Usare useDigestSlotConfigs() + SlotConfig. Rimuovere allo Step 9.
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

/** @deprecated Usare SlotConfig[]. Rimuovere allo Step 9. */
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

/** @deprecated Usare getSlotLabel(slot: SlotConfig). Rimuovere allo Step 9. */
export function getBookingTimeSlotLabel(
  slot: 'morning' | 'afternoon' | 'evening',
  config: BookingTimeSlots
): string {
  if (slot === 'morning') return `Mattina ${config.morningStart} - ${config.morningEnd}`
  if (slot === 'afternoon') return `Pomeriggio ${config.afternoonStart} - ${config.afternoonEnd}`
  return `Sera ${config.eveningStart} - ${config.eveningEnd}`
}

/** @deprecated Usare validateSlotConfigs(slots: SlotConfig[]). Rimuovere allo Step 9. */
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

