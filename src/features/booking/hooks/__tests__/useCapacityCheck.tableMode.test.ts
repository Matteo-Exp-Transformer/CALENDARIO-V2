// Test WP-B1 S4: useCapacityCheck + modalità-tavoli (D46).
// Copre:
//   - Classic → comportamento attuale intatto (zero regressioni)
//   - Pro senza tavoli → comportamento attuale intatto (D1)
//   - Pro con tavoli → cap = totalCovers (D46)

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { BookingRequest } from '@/types/booking'

// ─── Stato condiviso ───────────────────────────────────────────────────────
const state = vi.hoisted(() => ({
  servizio: false,
  isTableMode: false,
  totalCovers: 0,
  slotCapacities: { 'slot-1': 20 } as Record<string, number | null>,
  timeSlotsEnabled: true as boolean,
  tableModeRespectsSlotCap: false as boolean,
}))

const digestSlots = vi.hoisted(() => [
  { id: 'slot-1', name: 'Cena', start_time: '19:00', end_time: '23:00', display_order: 1 },
])

vi.mock('@/hooks/useFeatures', () => ({
  useFeatures: () => ({ servizio: state.servizio }),
}))

vi.mock('../useTableMode', () => ({
  useTableMode: () => ({
    isTableMode: state.isTableMode,
    totalCovers: state.totalCovers,
    activeTables: [],
  }),
}))

vi.mock('../useRestaurantSetting', () => ({
  useRestaurantSetting: (key: string) => {
    if (key === 'slot_guest_capacities') return { data: state.slotCapacities }
    if (key === 'booking_time_slots_enabled') return { data: state.timeSlotsEnabled }
    if (key === 'table_mode_respects_slot_cap') return { data: state.tableModeRespectsSlotCap }
    return { data: null }
  },
}))

vi.mock('../useServiceSlots', () => ({
  useDigestSlotConfigs: () => ({ data: digestSlots }),
  useServiceSlots: () => ({ data: [] }),
}))

vi.mock('../useServiceSlotOverrides', () => ({
  useServiceSlotOverrides: () => ({ data: [] }),
  resolveSlotOverride: vi.fn(() => null),
}))

import { useCapacityCheck } from '../useCapacityCheck'

// ─── Helper prenotazione ───────────────────────────────────────────────────
function booking(partial: Partial<BookingRequest> = {}): BookingRequest {
  return {
    id: 'b1',
    status: 'accepted',
    no_show: false,
    num_guests: 4,
    confirmed_start: '2026-06-24T20:00:00+00:00',
    confirmed_end: '2026-06-24T22:00:00+00:00',
    ...partial,
  } as BookingRequest
}

const BASE_PARAMS = {
  date: '2026-06-24',
  startTime: '20:00',
  endTime: '22:00',
  numGuests: 3,
  acceptedBookings: [] as BookingRequest[],
}

describe('useCapacityCheck — modalità-tavoli (WP-B1 D46)', () => {
  beforeEach(() => {
    state.servizio = false
    state.isTableMode = false
    state.totalCovers = 0
    state.slotCapacities = { 'slot-1': 20 }
    state.timeSlotsEnabled = true
    state.tableModeRespectsSlotCap = false
  })

  // ─── Classic: zero regressioni ───────────────────────────────────────────
  describe('Classic (isTableMode=false)', () => {
    it('usa la capacità per-fascia da slot_guest_capacities', () => {
      state.slotCapacities = { 'slot-1': 10 }
      const { result } = renderHook(() =>
        useCapacityCheck({ ...BASE_PARAMS, numGuests: 3, acceptedBookings: [booking({ num_guests: 6 })] }),
      )
      const slot = result.current.slotsStatus.find((s) => s.slot === 'slot-1')
      expect(slot?.capacity).toBe(10)
      expect(slot?.occupied).toBe(6)
      expect(result.current.isAvailable).toBe(true) // 6+3=9 ≤ 10
    })

    it('segnala sforo quando cap per-fascia superato', () => {
      state.slotCapacities = { 'slot-1': 8 }
      const { result } = renderHook(() =>
        useCapacityCheck({ ...BASE_PARAMS, numGuests: 3, acceptedBookings: [booking({ num_guests: 6 })] }),
      )
      expect(result.current.isAvailable).toBe(false)
      expect(result.current.exceededSlots?.[0]?.exceededBy).toBe(1) // 6+3=9 > 8
    })

    it('fasce disabilitate → isAvailable true, slotsStatus vuoto', () => {
      state.timeSlotsEnabled = false
      const { result } = renderHook(() =>
        useCapacityCheck({ ...BASE_PARAMS, numGuests: 100, acceptedBookings: [] }),
      )
      expect(result.current.isAvailable).toBe(true)
      expect(result.current.slotsStatus).toEqual([])
    })
  })

  // ─── Pro senza tavoli: stessa cascata Classic (D1) ────────────────────────
  describe('Pro senza tavoli (isTableMode=false, servizio=true)', () => {
    beforeEach(() => {
      state.servizio = true  // Pro abilita sempre le fasce
      state.isTableMode = false
      state.totalCovers = 0
    })

    it('usa ancora la capacità per-fascia (D1), non totalCovers=0', () => {
      state.slotCapacities = { 'slot-1': 15 }
      const { result } = renderHook(() =>
        useCapacityCheck({ ...BASE_PARAMS, numGuests: 5, acceptedBookings: [booking({ num_guests: 8 })] }),
      )
      const slot = result.current.slotsStatus.find((s) => s.slot === 'slot-1')
      expect(slot?.capacity).toBe(15) // NON 0
      expect(result.current.isAvailable).toBe(true) // 8+5=13 ≤ 15
    })
  })

  // ─── Pro con tavoli: capienza = totalCovers (D46) ─────────────────────────
  describe('Pro con tavoli (isTableMode=true)', () => {
    beforeEach(() => {
      state.servizio = true
      state.isTableMode = true
      state.totalCovers = 12 // 3 tavoli da 4 coperti
      state.slotCapacities = { 'slot-1': 50 } // valore più alto: non deve prevalere
    })

    it('cap = totalCovers (12) anziché slot_guest_capacities (50)', () => {
      const { result } = renderHook(() =>
        useCapacityCheck({ ...BASE_PARAMS, numGuests: 3, acceptedBookings: [booking({ num_guests: 8 })] }),
      )
      const slot = result.current.slotsStatus.find((s) => s.slot === 'slot-1')
      expect(slot?.capacity).toBe(12) // totalCovers, non 50
      expect(result.current.isAvailable).toBe(true) // 8+3=11 ≤ 12
    })

    it('sforo su totalCovers quando prenotazioni eccedono la capienza fisica', () => {
      const { result } = renderHook(() =>
        useCapacityCheck({ ...BASE_PARAMS, numGuests: 5, acceptedBookings: [booking({ num_guests: 8 })] }),
      )
      expect(result.current.isAvailable).toBe(false) // 8+5=13 > 12
      expect(result.current.exceededSlots?.[0]?.capacity).toBe(12)
      expect(result.current.exceededSlots?.[0]?.exceededBy).toBe(1) // 13-12
    })

    it('totalCovers = cap esatto: prenotazione che raggiunge il limite è disponibile', () => {
      const { result } = renderHook(() =>
        useCapacityCheck({ ...BASE_PARAMS, numGuests: 4, acceptedBookings: [booking({ num_guests: 8 })] }),
      )
      expect(result.current.isAvailable).toBe(true) // 8+4=12 === 12
    })

    it('D38 OFF: ignora il cap fascia anche se più basso della capienza tavoli', () => {
      state.slotCapacities = { 'slot-1': 9 }
      state.tableModeRespectsSlotCap = false
      const { result } = renderHook(() =>
        useCapacityCheck({ ...BASE_PARAMS, numGuests: 3, acceptedBookings: [booking({ num_guests: 8 })] }),
      )
      const slot = result.current.slotsStatus.find((s) => s.slot === 'slot-1')
      expect(slot?.capacity).toBe(12)
      expect(result.current.isAvailable).toBe(true)
    })

    it('D38 ON: applica anche il cap fascia e vince il primo limite raggiunto', () => {
      state.slotCapacities = { 'slot-1': 9 }
      state.tableModeRespectsSlotCap = true
      const { result } = renderHook(() =>
        useCapacityCheck({ ...BASE_PARAMS, numGuests: 3, acceptedBookings: [booking({ num_guests: 8 })] }),
      )
      const slot = result.current.slotsStatus.find((s) => s.slot === 'slot-1')
      expect(slot?.capacity).toBe(9)
      expect(result.current.isAvailable).toBe(false)
      expect(result.current.exceededSlots?.[0]?.exceededBy).toBe(2)
    })
  })
})
