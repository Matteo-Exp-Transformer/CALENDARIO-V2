import { CAPACITY_CONFIG } from '@/features/booking/constants/capacity'

export type BookingTimeSlots = {
  morningStart: string
  morningEnd: string
  afternoonStart: string
  afternoonEnd: string
  eveningStart: string
  eveningEnd: string
}

export const DEFAULT_BOOKING_TIME_SLOTS: BookingTimeSlots = {
  morningStart: CAPACITY_CONFIG.MORNING_START,
  morningEnd: CAPACITY_CONFIG.MORNING_END,
  afternoonStart: CAPACITY_CONFIG.AFTERNOON_START,
  afternoonEnd: CAPACITY_CONFIG.AFTERNOON_END,
  eveningStart: CAPACITY_CONFIG.EVENING_START,
  eveningEnd: CAPACITY_CONFIG.EVENING_END,
}

const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/

export function parseHmToMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number)
  return h * 60 + m
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

  if (morningStart >= morningEnd) return 'La fascia Mattina non e valida: inizio deve essere prima della fine'
  if (afternoonStart >= afternoonEnd) return 'La fascia Pomeriggio non e valida: inizio deve essere prima della fine'
  if (eveningStart >= eveningEnd) return 'La fascia Sera non e valida: inizio deve essere prima della fine'

  if (afternoonStart <= morningEnd) {
    return 'Le fasce Mattina e Pomeriggio si sovrappongono'
  }
  if (eveningStart <= afternoonEnd) {
    return 'Le fasce Pomeriggio e Sera si sovrappongono'
  }

  return null
}

