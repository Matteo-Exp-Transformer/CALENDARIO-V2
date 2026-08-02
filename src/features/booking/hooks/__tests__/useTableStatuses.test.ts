/**
 * Test WP-B3 S4: 5 stati tavolo live (orologio a muro — S4-BUG-1)
 *
 * Copre:
 * 1. resolveTableLiveStatus — tutti e 5 i rami con confini precisi
 * 2. Soglia ritardo configurabile
 * 3. Confronto a muro (cifre +00:00 finte) vs «adesso» locale
 * 4. Fascia oltre mezzanotte, ora legale vs solare, buffer D37
 */

import { describe, it, expect } from 'vitest'
import {
  resolveTableLiveStatus,
  DEFAULT_LATE_THRESHOLD_MINUTES,
} from '../useTableStatuses'
import type { BookingTableAssignment } from '../useTableAssignments'
import type { BookingRequest } from '@/types/booking'

// ─── Helper ────────────────────────────────────────────────────────────────

function makeAssignment(overrides?: Partial<BookingTableAssignment>): BookingTableAssignment {
  return {
    id: 'a1',
    tenant_id: 't1',
    booking_id: 'b1',
    table_id: 'table-1',
    service_slot_id: 'slot-1',
    turn_number: 1,
    checked_out_at: null,
    date: '2026-06-24',
    created_at: '',
    ...overrides,
  }
}

/**
 * ISO nel formato del progetto: cifre = ora a muro, offset +00:00 finto.
 * NON usare toISOString() di un Date reale: produrrebbe Z e confonderebbe i test.
 */
function wallIso(dateYmd: string, timeHHmm: string): string {
  return `${dateYmd}T${timeHHmm}:00+00:00`
}

function makeBooking(
  confirmedStart: string,
  confirmedEnd: string,
  overrides?: Partial<BookingRequest> & { turnover_buffer_minutes?: number | null },
): BookingRequest & { turnover_buffer_minutes?: number | null } {
  const startDate = confirmedStart.slice(0, 10)
  return {
    id: 'b1',
    created_at: '',
    updated_at: '',
    client_name: 'Mario Rossi',
    client_email: 'mario@test.it',
    event_type: 'cena',
    desired_date: startDate,
    num_guests: 2,
    status: 'accepted',
    confirmed_start: confirmedStart,
    confirmed_end: confirmedEnd,
    tenant_id: 't1',
    ...overrides,
  } as BookingRequest & { turnover_buffer_minutes?: number | null }
}

/** «Adesso» = orologio a muro locale (stesso modo in cui il browser vede l'ora). */
function wallNow(dateYmd: string, timeHHmm: string, sec = 0): Date {
  const [y, m, d] = dateYmd.split('-').map(Number)
  const [hh, mm] = timeHHmm.split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm, sec, 0)
}

const DAY = '2026-06-24' // estate (CEST in Europa)
const START_ISO = wallIso(DAY, '20:00')
const END_ISO = wallIso(DAY, '22:00')
const THRESHOLD = DEFAULT_LATE_THRESHOLD_MINUTES // 15

function resolve(now: Date, booking = makeBooking(START_ISO, END_ISO), late = THRESHOLD, buffer = 0) {
  return resolveTableLiveStatus({
    activeAssignment: makeAssignment(),
    booking,
    now,
    lateThresholdMinutes: late,
    turnoverBufferMinutes: buffer,
  })
}

// ─── 1. Stato free — nessun assignment ─────────────────────────────────────

describe('resolveTableLiveStatus — free', () => {
  it('nessun assignment attivo → free', () => {
    expect(
      resolveTableLiveStatus({
        activeAssignment: null,
        booking: null,
        now: wallNow(DAY, '20:00'),
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('free')
  })
})

// ─── 2. Stato upcoming — now < start ──────────────────────────────────────

describe('resolveTableLiveStatus — upcoming', () => {
  it('now un secondo prima di start a muro → upcoming', () => {
    expect(resolve(wallNow(DAY, '19:59', 59))).toBe('upcoming')
  })

  it('esattamente a start → NON upcoming', () => {
    expect(resolve(wallNow(DAY, '20:00'))).not.toBe('upcoming')
  })
})

// ─── 3. Stato occupied — start ≤ now < start + threshold ──────────────────

describe('resolveTableLiveStatus — occupied', () => {
  it('esattamente a start a muro → occupied', () => {
    expect(resolve(wallNow(DAY, '20:00'))).toBe('occupied')
  })

  it('un minuto prima del confine soglia → occupied', () => {
    expect(resolve(wallNow(DAY, '20:14'))).toBe('occupied')
  })
})

// ─── 4. Stato late — start + threshold ≤ now < end ───────────────────────

describe('resolveTableLiveStatus — late', () => {
  it('esattamente a start + threshold → late', () => {
    expect(resolve(wallNow(DAY, '20:15'))).toBe('late')
  })

  it('un minuto prima di end → late', () => {
    expect(resolve(wallNow(DAY, '21:59'))).toBe('late')
  })
})

// ─── 5. Stato leaving — now ≥ end (+ buffer) ──────────────────────────────

describe('resolveTableLiveStatus — leaving', () => {
  it('esattamente a end a muro → leaving', () => {
    expect(resolve(wallNow(DAY, '22:00'))).toBe('leaving')
  })

  it('dopo end → leaving', () => {
    expect(resolve(wallNow(DAY, '22:30'))).toBe('leaving')
  })
})

// ─── 6. Soglia configurabile ───────────────────────────────────────────────

describe('resolveTableLiveStatus — soglia configurabile', () => {
  it('threshold=0 → a start è già late', () => {
    expect(resolve(wallNow(DAY, '20:00'), makeBooking(START_ISO, END_ISO), 0)).toBe('late')
  })

  it('threshold=30: a start+15min è ancora occupied', () => {
    expect(resolve(wallNow(DAY, '20:15'), makeBooking(START_ISO, END_ISO), 30)).toBe('occupied')
  })

  it('threshold=30: a start+30min è late', () => {
    expect(resolve(wallNow(DAY, '20:30'), makeBooking(START_ISO, END_ISO), 30)).toBe('late')
  })
})

// ─── 7. Edge case ──────────────────────────────────────────────────────────

describe('resolveTableLiveStatus — edge cases', () => {
  it('assignment attivo ma booking null → occupied', () => {
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking: null,
        now: wallNow(DAY, '20:00'),
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('occupied')
  })

  it('assignment attivo, booking senza confirmed_start → occupied', () => {
    const booking = makeBooking('', '')
    booking.confirmed_start = undefined
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking,
        now: wallNow(DAY, '20:00'),
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('occupied')
  })
})

// ─── 8. S4-BUG-1 — orologio a muro (regressione del sintomo E2E) ───────────

describe('resolveTableLiveStatus — orologio a muro (S4-BUG-1)', () => {
  it('pranzo 14:50, adesso 15:00 locale → occupied (non upcoming sfasato +2h)', () => {
    // Sintomo corsia B 3-2: restava «In arrivo» perché new Date(14:50+00:00) → 16:50 locale
    const booking = makeBooking(wallIso(DAY, '14:50'), wallIso(DAY, '16:20'))
    expect(resolve(wallNow(DAY, '15:00'), booking)).toBe('occupied')
  })

  it('arrivo 14:30, adesso 15:00 (>15\' ritardo) → late (non upcoming)', () => {
    // Sintomo corsia B 3-3
    const booking = makeBooking(wallIso(DAY, '14:30'), wallIso(DAY, '16:00'))
    expect(resolve(wallNow(DAY, '15:00'), booking)).toBe('late')
  })

  it('arrivo 12:00 fine 15:30, adesso 15:00 → late; a 15:30 → leaving', () => {
    // Sintomo corsia B 3-4: restava late, mai leaving
    const booking = makeBooking(wallIso(DAY, '12:00'), wallIso(DAY, '15:30'))
    expect(resolve(wallNow(DAY, '15:00'), booking)).toBe('late')
    expect(resolve(wallNow(DAY, '15:30'), booking)).toBe('leaving')
  })

  it('desired_time preferito su confirmed_start se presente', () => {
    const booking = makeBooking(wallIso(DAY, '14:50'), wallIso(DAY, '16:20'), {
      desired_time: '14:50',
      desired_date: DAY,
    })
    expect(resolve(wallNow(DAY, '15:00'), booking)).toBe('occupied')
  })
})

// ─── 9. Fascia oltre mezzanotte ────────────────────────────────────────────

describe('resolveTableLiveStatus — oltre mezzanotte', () => {
  it('arrivo 23:00 fine 01:00 giorno dopo: a 00:30 → late; a 01:00 → leaving', () => {
    const booking = makeBooking(wallIso(DAY, '23:00'), wallIso('2026-06-25', '01:00'), {
      desired_date: DAY,
      desired_time: '23:00',
    })
    expect(resolve(wallNow(DAY, '22:30'), booking)).toBe('upcoming')
    expect(resolve(wallNow(DAY, '23:00'), booking)).toBe('occupied')
    expect(resolve(wallNow(DAY, '23:20'), booking)).toBe('late')
    expect(resolve(wallNow('2026-06-25', '00:30'), booking)).toBe('late')
    expect(resolve(wallNow('2026-06-25', '01:00'), booking)).toBe('leaving')
  })
})

// ─── 10. Ora legale vs ora solare (niente costante +2) ─────────────────────

describe('resolveTableLiveStatus — DST (legale vs solare)', () => {
  it('estate (CEST): 20:00 a muro a 20:10 → occupied', () => {
    const summer = '2026-07-15'
    const booking = makeBooking(wallIso(summer, '20:00'), wallIso(summer, '22:00'))
    expect(resolve(wallNow(summer, '20:10'), booking)).toBe('occupied')
  })

  it('inverno (CET): 20:00 a muro a 20:10 → occupied (stesso comportamento, no +2 hardcoded)', () => {
    const winter = '2026-01-15'
    const booking = makeBooking(wallIso(winter, '20:00'), wallIso(winter, '22:00'), {
      desired_date: winter,
    })
    expect(resolve(wallNow(winter, '20:10'), booking)).toBe('occupied')
  })

  it('inverno: a 22:00 a muro → leaving', () => {
    const winter = '2026-01-15'
    const booking = makeBooking(wallIso(winter, '20:00'), wallIso(winter, '22:00'), {
      desired_date: winter,
    })
    expect(resolve(wallNow(winter, '22:00'), booking)).toBe('leaving')
  })
})

// ─── 11. Buffer D37 — leaving dopo confirmed_end + buffer ─────────────────

describe('resolveTableLiveStatus — buffer riassetto (D37)', () => {
  it('buffer 15: a confirmed_end ancora late; a end+15 → leaving', () => {
    const booking = makeBooking(wallIso(DAY, '20:00'), wallIso(DAY, '22:00'))
    expect(resolve(wallNow(DAY, '22:00'), booking, THRESHOLD, 15)).toBe('late')
    expect(resolve(wallNow(DAY, '22:14'), booking, THRESHOLD, 15)).toBe('late')
    expect(resolve(wallNow(DAY, '22:15'), booking, THRESHOLD, 15)).toBe('leaving')
  })

  it('snapshot turnover_buffer_minutes sulla prenotazione ha priorità sul param', () => {
    const booking = makeBooking(wallIso(DAY, '20:00'), wallIso(DAY, '22:00'), {
      turnover_buffer_minutes: 30,
    })
    // param buffer=0 ignorato: vale lo snapshot 30
    expect(resolve(wallNow(DAY, '22:20'), booking, THRESHOLD, 0)).toBe('late')
    expect(resolve(wallNow(DAY, '22:30'), booking, THRESHOLD, 0)).toBe('leaving')
  })
})
