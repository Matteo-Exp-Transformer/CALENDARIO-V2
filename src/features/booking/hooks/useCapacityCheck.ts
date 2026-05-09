import { useMemo } from 'react'
import type { BookingRequest, TimeSlot, AvailabilityCheck } from '@/types/booking'
import {
  DEFAULT_SLOT_GUEST_CAPACITIES,
  type SlotGuestCapacities,
} from '@/features/booking/lib/restaurantSettingRegistry'
import { extractDateFromISO } from '../utils/dateUtils'
import { useRestaurantSetting } from './useRestaurantSetting'
import {
  DEFAULT_BOOKING_TIME_SLOTS,
  parseHmToMinutes,
  slotRangesOverlap,
  type BookingTimeSlots,
} from '../utils/bookingTimeSlots'

interface UseCapacityCheckParams {
  date: string
  startTime: string
  endTime: string
  numGuests: number
  acceptedBookings: BookingRequest[]
  excludeBookingId?: string
}

// Get slots occupied by a booking based on time strings (HH:MM format)
// A booking occupies a time slot if it overlaps with that slot's time range
function getSlotsOccupiedByTimeString(
  startTime: string,
  endTime: string,
  slotConfig: BookingTimeSlots
): TimeSlot[] {
  const startMinutes = parseHmToMinutes(startTime)
  const endMinutes = parseHmToMinutes(endTime)
  const bookingCrossesMidnight = endMinutes < startMinutes

  const slots: TimeSlot[] = []

  const overlaps = (slotStart: string, slotEnd: string) => {
    if (bookingCrossesMidnight) {
      return (
        slotRangesOverlap(startTime, '23:59', slotStart, slotEnd) ||
        slotRangesOverlap('00:00', endTime, slotStart, slotEnd)
      )
    }
    return slotRangesOverlap(startTime, endTime, slotStart, slotEnd)
  }

  if (overlaps(slotConfig.morningStart, slotConfig.morningEnd)) {
    slots.push('morning')
  }
  if (overlaps(slotConfig.afternoonStart, slotConfig.afternoonEnd)) {
    slots.push('afternoon')
  }
  if (overlaps(slotConfig.eveningStart, slotConfig.eveningEnd)) {
    slots.push('evening')
  }

  return slots
}

export function useCapacityCheck(params: UseCapacityCheckParams): AvailabilityCheck {
  const { date, startTime, endTime, numGuests, acceptedBookings, excludeBookingId } = params
  const dailyGuestLimitQuery = useRestaurantSetting('daily_guest_limit')
  const bookingSlotsQuery = useRestaurantSetting('booking_time_slots')
  const slotGuestCapacitiesQuery = useRestaurantSetting('slot_guest_capacities')
  // `null` (o assente) = nessun limite giornaliero impostato → skip del controllo
  const dailyGuestLimit = dailyGuestLimitQuery.data ?? null
  const bookingSlots = bookingSlotsQuery.data ?? DEFAULT_BOOKING_TIME_SLOTS
  const slotGuestCapacities: SlotGuestCapacities =
    slotGuestCapacitiesQuery.data ?? DEFAULT_SLOT_GUEST_CAPACITIES

  return useMemo(() => {
    const morning = {
      slot: 'morning' as TimeSlot,
      capacity: slotGuestCapacities.morning,
      occupied: 0,
      available: slotGuestCapacities.morning,
    }
    const afternoon = {
      slot: 'afternoon' as TimeSlot,
      capacity: slotGuestCapacities.afternoon,
      occupied: 0,
      available: slotGuestCapacities.afternoon,
    }
    const evening = {
      slot: 'evening' as TimeSlot,
      capacity: slotGuestCapacities.evening,
      occupied: 0,
      available: slotGuestCapacities.evening,
    }

    // Get bookings for the same date
    const dayBookings = acceptedBookings.filter((booking) => {
      if (booking.id === excludeBookingId) return false
      if (!booking.confirmed_start) return false
      const bookingDate = extractDateFromISO(booking.confirmed_start)
      return bookingDate === date
    })

    // Calculate occupied seats for each slot
    for (const booking of dayBookings) {
      if (!booking.confirmed_start || !booking.confirmed_end) continue
      
      // Extract time directly from ISO string to avoid timezone issues
      const startTimeMatch = booking.confirmed_start.match(/T(\d{2}):(\d{2}):(\d{2})/)
      const endTimeMatch = booking.confirmed_end.match(/T(\d{2}):(\d{2}):(\d{2})/)
      
      let startTimeStr: string
      let endTimeStr: string
      
      if (startTimeMatch && endTimeMatch) {
        startTimeStr = `${startTimeMatch[1]}:${startTimeMatch[2]}`
        endTimeStr = `${endTimeMatch[1]}:${endTimeMatch[2]}`
      } else {
        // Fallback to old method
        startTimeStr = booking.confirmed_start.split('T')[1].substring(0, 5)
        endTimeStr = booking.confirmed_end.split('T')[1].substring(0, 5)
      }
      
      const slots = getSlotsOccupiedByTimeString(startTimeStr, endTimeStr, bookingSlots)
      const guests = booking.num_guests || 0

      for (const slot of slots) {
        if (slot === 'morning') morning.occupied += guests
        else if (slot === 'afternoon') afternoon.occupied += guests
        else if (slot === 'evening') evening.occupied += guests
      }
    }

    morning.available =
      morning.capacity == null ? null : morning.capacity - morning.occupied
    afternoon.available =
      afternoon.capacity == null ? null : afternoon.capacity - afternoon.occupied
    evening.available =
      evening.capacity == null ? null : evening.capacity - evening.occupied

    // If no date/time selected, return available
    if (!date || !startTime || !endTime || numGuests === 0) {
      return { isAvailable: true, slotsStatus: [morning, afternoon, evening] }
    }

    // Check if daily limit is exceeded by adding this booking
    let isAvailable = true
    const errorMessages: string[] = []
    const exceededSlots: Array<{
      slot: TimeSlot
      slotName: string
      exceededBy: number
      totalOccupied: number
      capacity: number
    }> = []

    const totalGuestsForDay = dayBookings.reduce((acc, booking) => acc + (booking.num_guests || 0), 0)
    const totalWithNewBooking = totalGuestsForDay + numGuests
    // Applica il limite giornaliero solo se l'admin ne ha impostato uno.
    // `dailyGuestLimit === null` significa «nessun limite» → niente vincolo sul totale del giorno.
    if (dailyGuestLimit != null && totalWithNewBooking > dailyGuestLimit) {
      isAvailable = false
      const exceededBy = totalWithNewBooking - dailyGuestLimit
      errorMessages.push(
        `Limite giornaliero: ${dailyGuestLimit} coperti (totale con prenotazione: ${totalWithNewBooking})`
      )
      exceededSlots.push({
        slot: 'daily',
        slotName: 'giornata',
        exceededBy,
        totalOccupied: totalWithNewBooking,
        capacity: dailyGuestLimit,
      })
    }

    return {
      isAvailable,
      slotsStatus: [morning, afternoon, evening],
      errorMessage: errorMessages.length > 0 ? errorMessages.join('\n') : undefined,
      exceededSlots: exceededSlots.length > 0 ? exceededSlots : undefined,
    }
  }, [
    date,
    startTime,
    endTime,
    numGuests,
    acceptedBookings,
    excludeBookingId,
    dailyGuestLimit,
    bookingSlots,
    slotGuestCapacities,
  ])
}
