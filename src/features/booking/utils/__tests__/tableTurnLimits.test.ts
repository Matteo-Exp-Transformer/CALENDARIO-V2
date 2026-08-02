/**
 * FIX-2 — turni residui, fascia chiusa, undo non consuma turno.
 */
import { describe, it, expect } from 'vitest'
import {
  computeNextTurnNumber,
  countTurnsUsed,
  getRemainingTurns,
  isSlotClosed,
  isTurnsExhausted,
} from '../tableTurnLimits'

const base = {
  table_id: 't1',
  service_slot_id: 's1',
  date: '2026-08-02',
}

describe('tableTurnLimits', () => {
  it('conteggio include righe già chiuse (tavolo verde che rifiuta)', () => {
    const rows = [
      { ...base, turn_number: 1 },
      { ...base, turn_number: 2 },
    ]
    expect(countTurnsUsed(rows, 't1', 's1', '2026-08-02')).toBe(2)
    expect(computeNextTurnNumber(rows, 't1', 's1', '2026-08-02')).toBe(3)
    expect(isTurnsExhausted(2, 2)).toBe(true)
    expect(getRemainingTurns(2, 2)).toBe(0)
  })

  it('max_turns null → illimitato, mai esaurito', () => {
    expect(getRemainingTurns(null, 99)).toBeNull()
    expect(isTurnsExhausted(null, 99)).toBe(false)
    expect(isSlotClosed(null)).toBe(false)
  })

  it('max_turns 0 → fascia chiusa, distinta da turni esauriti', () => {
    expect(isSlotClosed(0)).toBe(true)
    expect(isTurnsExhausted(0, 0)).toBe(false)
    expect(getRemainingTurns(0, 0)).toBe(0)
  })

  it('dopo undo (riga cancellata) il turno non è consumato', () => {
    // Undo DELETE lascia zero righe → prossimo turno = 1
    expect(computeNextTurnNumber([], 't1', 's1', '2026-08-02')).toBe(1)
    expect(countTurnsUsed([], 't1', 's1', '2026-08-02')).toBe(0)
    expect(isTurnsExhausted(2, 0)).toBe(false)
  })
})
