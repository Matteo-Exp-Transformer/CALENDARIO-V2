/**
 * Test WP-B3 S4: 5 stati tavolo live
 *
 * Copre:
 * 1. resolveTableLiveStatus — tutti e 5 i rami con confini precisi
 * 2. Soglia ritardo configurabile (occupied↔late cambia con threshold)
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

function makeBooking(confirmedStart: string, confirmedEnd: string): BookingRequest {
  return {
    id: 'b1',
    created_at: '',
    updated_at: '',
    client_name: 'Mario Rossi',
    client_email: 'mario@test.it',
    event_type: 'cena',
    desired_date: '2026-06-24',
    num_guests: 2,
    status: 'accepted',
    confirmed_start: confirmedStart,
    confirmed_end: confirmedEnd,
    tenant_id: 't1',
  } as BookingRequest
}

// Slot serale: 20:00–22:00 (UTC)
const START = new Date('2026-06-24T20:00:00.000Z')
const END   = new Date('2026-06-24T22:00:00.000Z')
const THRESHOLD = DEFAULT_LATE_THRESHOLD_MINUTES // 15

// ─── 1. Stato free — nessun assignment ─────────────────────────────────────

describe('resolveTableLiveStatus — free', () => {
  it('nessun assignment attivo → free', () => {
    expect(
      resolveTableLiveStatus({
        activeAssignment: null,
        booking: null,
        now: START,
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('free')
  })
})

// ─── 2. Stato upcoming — now < start ──────────────────────────────────────

describe('resolveTableLiveStatus — upcoming', () => {
  it('now un secondo prima di start → upcoming', () => {
    const now = new Date(START.getTime() - 1000)
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking: makeBooking(START.toISOString(), END.toISOString()),
        now,
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('upcoming')
  })

  it('esattamente a start → NON upcoming (confine: start ≤ now)', () => {
    const result = resolveTableLiveStatus({
      activeAssignment: makeAssignment(),
      booking: makeBooking(START.toISOString(), END.toISOString()),
      now: START,
      lateThresholdMinutes: THRESHOLD,
    })
    expect(result).not.toBe('upcoming')
  })
})

// ─── 3. Stato occupied — start ≤ now < start + threshold ──────────────────

describe('resolveTableLiveStatus — occupied', () => {
  it('esattamente a start → occupied', () => {
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking: makeBooking(START.toISOString(), END.toISOString()),
        now: START,
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('occupied')
  })

  it('un millisecondo prima del confine soglia → occupied', () => {
    const now = new Date(START.getTime() + THRESHOLD * 60 * 1000 - 1)
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking: makeBooking(START.toISOString(), END.toISOString()),
        now,
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('occupied')
  })
})

// ─── 4. Stato late — start + threshold ≤ now < end ───────────────────────

describe('resolveTableLiveStatus — late', () => {
  it('esattamente a start + threshold → late', () => {
    const now = new Date(START.getTime() + THRESHOLD * 60 * 1000)
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking: makeBooking(START.toISOString(), END.toISOString()),
        now,
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('late')
  })

  it('un millisecondo prima di end → late', () => {
    const now = new Date(END.getTime() - 1)
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking: makeBooking(START.toISOString(), END.toISOString()),
        now,
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('late')
  })
})

// ─── 5. Stato leaving — now ≥ end ─────────────────────────────────────────

describe('resolveTableLiveStatus — leaving', () => {
  it('esattamente a end → leaving', () => {
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking: makeBooking(START.toISOString(), END.toISOString()),
        now: END,
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('leaving')
  })

  it('dopo end → leaving', () => {
    const now = new Date(END.getTime() + 30 * 60 * 1000) // +30 min
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking: makeBooking(START.toISOString(), END.toISOString()),
        now,
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('leaving')
  })
})

// ─── 6. Soglia configurabile: occupied↔late cambia con threshold ───────────

describe('resolveTableLiveStatus — soglia configurabile', () => {
  it('threshold=0 → a start è già late (grazia azzerata)', () => {
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking: makeBooking(START.toISOString(), END.toISOString()),
        now: START,
        lateThresholdMinutes: 0,
      }),
    ).toBe('late')
  })

  it('threshold=30: a start+15min è ancora occupied (grazia estesa)', () => {
    const now = new Date(START.getTime() + 15 * 60 * 1000) // +15 min (< threshold 30)
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking: makeBooking(START.toISOString(), END.toISOString()),
        now,
        lateThresholdMinutes: 30,
      }),
    ).toBe('occupied')
  })

  it('threshold=30: a start+30min è late', () => {
    const now = new Date(START.getTime() + 30 * 60 * 1000)
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking: makeBooking(START.toISOString(), END.toISOString()),
        now,
        lateThresholdMinutes: 30,
      }),
    ).toBe('late')
  })
})

// ─── 7. Edge case: assignment senza prenotazione (fallback occupied) ────────

describe('resolveTableLiveStatus — edge cases', () => {
  it('assignment attivo ma booking null → occupied (fallback sicuro)', () => {
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking: null,
        now: START,
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('occupied')
  })

  it('assignment attivo, booking senza confirmed_start → occupied (fallback)', () => {
    const booking = makeBooking('', '')
    booking.confirmed_start = undefined
    expect(
      resolveTableLiveStatus({
        activeAssignment: makeAssignment(),
        booking,
        now: START,
        lateThresholdMinutes: THRESHOLD,
      }),
    ).toBe('occupied')
  })
})
