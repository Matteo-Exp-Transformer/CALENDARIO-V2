import { describe, it, expect } from 'vitest'
import { getSlotsOccupiedByBookingV2 } from '../capacityCalculator'
import type { SlotConfig } from '../bookingTimeSlots'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function slot(
  id: string,
  start_time: string,
  end_time: string,
  display_order: number,
  name = id
): SlotConfig {
  return { id, name, start_time, end_time, display_order, is_canonical: true }
}

const pranzo = slot('pranzo', '12:00', '15:00', 1)
const cena = slot('cena', '19:00', '23:00', 2)
const notturna = slot('notturna', '22:00', '03:00', 4) // cross-midnight

function iso(time: string, date = '2024-01-15'): string {
  return `${date}T${time}:00`
}

// ---------------------------------------------------------------------------
// getSlotsOccupiedByBookingV2
// ---------------------------------------------------------------------------

describe('getSlotsOccupiedByBookingV2', () => {
  it('booking che tocca una sola fascia', () => {
    const result = getSlotsOccupiedByBookingV2(iso('12:30'), iso('13:30'), [pranzo, cena])
    expect(result).toEqual(['pranzo'])
  })

  it('booking che attraversa 2 fasce', () => {
    // 14:30–20:00 sovrappone pranzo (12-15) e cena (19-23)
    const result = getSlotsOccupiedByBookingV2(iso('14:30'), iso('20:00'), [pranzo, cena])
    expect(result).toContain('pranzo')
    expect(result).toContain('cena')
  })

  it('booking notturno cross-midnight sovrappone notturna', () => {
    // booking 22:30–01:00, notturna 22:00–03:00
    const result = getSlotsOccupiedByBookingV2(iso('22:30'), iso('01:00'), [pranzo, notturna])
    expect(result).toContain('notturna')
    expect(result).not.toContain('pranzo')
  })

  it('booking fuori da ogni fascia → array vuoto', () => {
    // 16:00–17:00, nessuna fascia la copre (pranzo 12-15, cena 19-23)
    const result = getSlotsOccupiedByBookingV2(iso('16:00'), iso('17:00'), [pranzo, cena])
    expect(result).toEqual([])
  })

  it('0 fasce → array vuoto', () => {
    expect(getSlotsOccupiedByBookingV2(iso('12:30'), iso('13:30'), [])).toEqual([])
  })
})
