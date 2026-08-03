/**
 * FIX D (03-08-26, D-D/S-5) — manopola table_release_notice_recall_minutes.
 * Stesso modello di table_late_threshold_minutes: chiave JSONB, nessuna migrazione,
 * default 30 se assente/non valida.
 */

import { describe, it, expect } from 'vitest'
import { restaurantSettingRegistry } from '../restaurantSettingRegistry'

const entry = restaurantSettingRegistry.table_release_notice_recall_minutes

describe('restaurantSettingRegistry.table_release_notice_recall_minutes', () => {
  it('parseFromDb: chiave assente (null) → default 30', () => {
    expect(entry.parseFromDb(null)).toBe(30)
  })

  it('parseFromDb: numero valido → lo ritorna cosi\' com\'e\'', () => {
    expect(entry.parseFromDb(45)).toBe(45)
  })

  it('parseFromDb: stringa numerica → parsata', () => {
    expect(entry.parseFromDb('60')).toBe(60)
  })

  it('parseFromDb: valore non valido (negativo, non numero) → default 30', () => {
    expect(entry.parseFromDb(-5)).toBe(30)
    expect(entry.parseFromDb('non-un-numero')).toBe(30)
    expect(entry.parseFromDb(undefined)).toBe(30)
  })

  // Revisione senior (03-08-26): parseFromDb va allineato a validate (minimo 1, non 0).
  // Con 0 accettato, isReleaseNoticeSilenced farebbe "now - handledAt < 0" → sempre
  // falso: l'avviso tornerebbe subito dopo "Ancora occupato", riaprendo il bug di FIX D.
  it('parseFromDb: 0 → default 30 (0 riaprirebbe subito l\'avviso, stesso bug che FIX D chiude)', () => {
    expect(entry.parseFromDb(0)).toBe(30)
    expect(entry.parseFromDb('0')).toBe(30)
  })

  it('parseFromDb: oltre 240 → default 30 (allineato al tetto di validate)', () => {
    expect(entry.parseFromDb(241)).toBe(30)
    expect(entry.parseFromDb(10000)).toBe(30)
  })

  it('parseFromDb: numero non intero (34.5) → default 30', () => {
    expect(entry.parseFromDb(34.5)).toBe(30)
  })

  it('validate: intero fra 1 e 240 → nessun errore', () => {
    expect(entry.validate(30)).toBeNull()
    expect(entry.validate(1)).toBeNull()
    expect(entry.validate(240)).toBeNull()
  })

  it('validate: 0, negativo, oltre 240 o non intero → errore', () => {
    expect(entry.validate(0)).not.toBeNull()
    expect(entry.validate(-1)).not.toBeNull()
    expect(entry.validate(241)).not.toBeNull()
    expect(entry.validate(30.5)).not.toBeNull()
  })
})
