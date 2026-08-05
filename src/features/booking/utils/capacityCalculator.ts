import type { BookingRequest } from '@/types/booking'
import { extractDateFromISO } from './dateUtils'
import {
  parseHmToMinutes,
  slotRangesOverlap,
  type SlotConfig,
} from './bookingTimeSlots'

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
 * Somma i coperti per data (YYYY-MM-DD) per il badge «% riempimento» del calendario.
 * Stesso criterio del blocco pubblico giornaliero (edge create-booking) e del digest:
 * conta SOLO le prenotazioni accettate, NON no-show, con confirmed_start E confirmed_end
 * (stesso criterio di digest/eventi FC). Decisione Matteo 11-06-26: i no-show liberano il posto.
 */
export function sumGuestsByDate(bookings: BookingRequest[]): Record<string, number> {
  const acc: Record<string, number> = {}
  for (const b of bookings) {
    if (b.status !== 'accepted' || b.no_show || !b.confirmed_start || !b.confirmed_end) continue
    const date = extractDateFromISO(b.confirmed_start)
    if (!date) continue
    acc[date] = (acc[date] ?? 0) + (b.num_guests ?? 0)
  }
  return acc
}
