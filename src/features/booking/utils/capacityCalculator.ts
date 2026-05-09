import type { BookingRequest, TimeSlot, TimeSlotCapacity, DailyCapacity } from '@/types/booking'
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
} from './bookingTimeSlots'

// Extract time from ISO string - handles both local and UTC times properly
function extractTimeFromISO(isoString: string): string {
  // Always extract time components directly from the ISO string to avoid timezone issues
  const match = isoString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)
  
  if (match) {
    const hour = match[4]
    const minute = match[5]
    // Return time directly from string (no timezone conversion)
    return `${hour}:${minute}`
  }
  
  // Fallback: extract using substring
  const timePart = isoString.split('T')[1]?.substring(0, 5)
  return timePart || ''
}

// Get slots occupied by a booking
// A booking occupies a time slot if it overlaps with that slot's time range
export function getSlotsOccupiedByBooking(
  start: string,
  end: string,
  slotConfig: BookingTimeSlots = DEFAULT_BOOKING_TIME_SLOTS
): TimeSlot[] {
  const startTime = extractTimeFromISO(start)
  const endTime = extractTimeFromISO(end)
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

// Get the time slot where a booking STARTS (for display purposes only)
// Unlike getSlotsOccupiedByBooking, this returns only ONE slot based on start time
// Capacity calculations should continue using getSlotsOccupiedByBooking
export function getStartSlotForBooking(
  start: string,
  slotConfig: BookingTimeSlots = DEFAULT_BOOKING_TIME_SLOTS
): TimeSlot {
  const startTime = extractTimeFromISO(start)
  if (isTimeInsideSlot(startTime, slotConfig.morningStart, slotConfig.morningEnd)) {
    return 'morning'
  }
  if (isTimeInsideSlot(startTime, slotConfig.afternoonStart, slotConfig.afternoonEnd)) {
    return 'afternoon'
  }
  return 'evening'
}

// Calculate daily capacity for a specific date
export function calculateDailyCapacity(
  date: string,
  bookings: BookingRequest[],
  slotConfig: BookingTimeSlots = DEFAULT_BOOKING_TIME_SLOTS,
  slotGuestCapacities: SlotGuestCapacities = DEFAULT_SLOT_GUEST_CAPACITIES
): DailyCapacity {
  const morning: TimeSlotCapacity = {
    slot: 'morning',
    capacity: slotGuestCapacities.morning,
    occupied: 0,
    available: slotGuestCapacities.morning,
  }
  const afternoon: TimeSlotCapacity = {
    slot: 'afternoon',
    capacity: slotGuestCapacities.afternoon,
    occupied: 0,
    available: slotGuestCapacities.afternoon,
  }
  const evening: TimeSlotCapacity = {
    slot: 'evening',
    capacity: slotGuestCapacities.evening,
    occupied: 0,
    available: slotGuestCapacities.evening,
  }

  const dayBookings = bookings.filter((booking) => {
    if (!booking.confirmed_start) return false
    const bookingDate = extractDateFromISO(booking.confirmed_start)
    return bookingDate === date
  })

  for (const booking of dayBookings) {
    if (!booking.confirmed_start || !booking.confirmed_end) continue
    const slots = getSlotsOccupiedByBooking(booking.confirmed_start, booking.confirmed_end, slotConfig)
    const numGuests = booking.num_guests || 0
    for (const slot of slots) {
      if (slot === 'morning') { morning.occupied += numGuests }
      else if (slot === 'afternoon') { afternoon.occupied += numGuests }
      else if (slot === 'evening') { evening.occupied += numGuests }
    }
  }

  morning.available =
    morning.capacity == null ? null : morning.capacity - morning.occupied
  afternoon.available =
    afternoon.capacity == null ? null : afternoon.capacity - afternoon.occupied
  evening.available =
    evening.capacity == null ? null : evening.capacity - evening.occupied
  
  return { date, morning, afternoon, evening }
}