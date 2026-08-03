/**
 * FIX D (03-08-26, D-D) — unit puro su isReleaseNoticeSilenced, la funzione che decide
 * se l'avviso "Tavolo a fine turno" resta silenziato dopo "Ancora occupato".
 * Nessun mock: è una funzione pura (nessun accesso a Supabase/React).
 * Copertura equivalente, a livello DOM, in AssignmentMapPanel.fineTurnoMultiTavolo.test.tsx.
 */

import { describe, it, expect } from 'vitest'
import { isReleaseNoticeSilenced } from '../servizio/AssignmentMapPanel'

describe('isReleaseNoticeSilenced', () => {
  const now = new Date('2026-08-03T20:00:00.000Z')

  it('nessuna conferma (null) → mai silenziato', () => {
    expect(isReleaseNoticeSilenced(null, now, 30)).toBe(false)
  })

  it('nessuna conferma (undefined) → mai silenziato', () => {
    expect(isReleaseNoticeSilenced(undefined, now, 30)).toBe(false)
  })

  it('conferma di 29 minuti fa, richiamo 30 → silenziato', () => {
    const handledAt = new Date(now.getTime() - 29 * 60 * 1000).toISOString()
    expect(isReleaseNoticeSilenced(handledAt, now, 30)).toBe(true)
  })

  it('conferma di 31 minuti fa, richiamo 30 → non più silenziato', () => {
    const handledAt = new Date(now.getTime() - 31 * 60 * 1000).toISOString()
    expect(isReleaseNoticeSilenced(handledAt, now, 30)).toBe(false)
  })

  it('conferma esattamente 30 minuti fa → non più silenziato (confine incluso nel "torna")', () => {
    const handledAt = new Date(now.getTime() - 30 * 60 * 1000).toISOString()
    expect(isReleaseNoticeSilenced(handledAt, now, 30)).toBe(false)
  })

  it('manopola diversa (60 minuti): una conferma di 31 minuti fa resta silenziata', () => {
    const handledAt = new Date(now.getTime() - 31 * 60 * 1000).toISOString()
    expect(isReleaseNoticeSilenced(handledAt, now, 60)).toBe(true)
  })

  it('data non valida → non silenziato (fail-open: l\'avviso torna a comparire, mai a sparire per errore)', () => {
    expect(isReleaseNoticeSilenced('non-una-data', now, 30)).toBe(false)
  })
})
