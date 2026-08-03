// @admin-blindatura: settings-time-slots
// Copre: overlap/overnight helper, validateSlotConfigs, fascia malformata senza crash logico

import { describe, expect, it } from 'vitest'
import {
  OVERNIGHT_TIME_END_HINT,
  slotCrossesMidnight,
  slotRangesOverlap,
  validateSlotConfigs,
  type SlotConfig,
} from '@/features/booking/utils/bookingTimeSlots'

const baseSlot = (overrides: Partial<SlotConfig> = {}): SlotConfig => ({
  id: 'slot-a',
  name: 'Pranzo',
  start_time: '12:00',
  end_time: '15:00',
  display_order: 0,
  is_canonical: true,
  ...overrides,
})

describe('settings-time-slots M4 — helper bookingTimeSlots', () => {
  it('overlap tra due fasce nello stesso giorno → slotRangesOverlap true', () => {
    expect(slotRangesOverlap('12:00', '15:00', '14:00', '18:00')).toBe(true)
    expect(slotRangesOverlap('12:00', '15:00', '15:00', '18:00')).toBe(false)
  })

  it('fascia overnight attraversa mezzanotte senza crash e overlap con fascia serale', () => {
    const overnight = baseSlot({ id: 'night', name: 'Notte', start_time: '22:00', end_time: '02:00' })
    expect(slotCrossesMidnight(overnight)).toBe(true)
    expect(OVERNIGHT_TIME_END_HINT).toMatch(/giorno successivo/i)
    expect(slotRangesOverlap('22:00', '02:00', '23:00', '23:30')).toBe(true)
    expect(slotRangesOverlap('22:00', '02:00', '01:00', '01:30')).toBe(true)
  })

  it('validateSlotConfigs blocca overlap strutturale', () => {
    const slots = [
      baseSlot({ id: 'a', name: 'A', start_time: '12:00', end_time: '15:00' }),
      baseSlot({ id: 'b', name: 'B', start_time: '14:00', end_time: '18:00' }),
    ]
    expect(validateSlotConfigs(slots)).toMatch(/sovrappongono/i)
  })

  it('validateSlotConfigs blocca orari malformati e inizio=fine', () => {
    expect(
      validateSlotConfigs([baseSlot({ start_time: '25:99', end_time: '15:00' })]),
    ).toMatch(/non valido/i)
    expect(
      validateSlotConfigs([baseSlot({ start_time: '12:00', end_time: '12:00' })]),
    ).toMatch(/coincidono/i)
  })

  it('validateSlotConfigs accetta fasce valide non sovrapposte', () => {
    const slots = [
      baseSlot({ id: 'a', name: 'Pranzo', start_time: '12:00', end_time: '15:00' }),
      baseSlot({ id: 'b', name: 'Cena', start_time: '19:00', end_time: '23:00', display_order: 1 }),
    ]
    expect(validateSlotConfigs(slots)).toBeNull()
  })

  // ── FIX C, revisione senior (03-08-26): modalità focusIndex ──────────────────────
  // Senza focusIndex (default, Impostazioni): tutto l'array è responsabile di sé stesso.
  // Con focusIndex (Servizio, un editor per fascia): solo la fascia a focusIndex e le sue
  // relazioni con le altre contano — le altre fasce fra loro (dati legacy potenzialmente
  // invalidi, mai bloccati da nessun editor prima di stasera) non vengono giudicate.
  describe('validateSlotConfigs — focusIndex', () => {
    it('fascia legacy con nome duplicato TRA le altre (non focus) non blocca il salvataggio della bozza', () => {
      const slots = [
        baseSlot({ id: 'legacy-1', name: 'Cena', start_time: '19:00', end_time: '22:00' }),
        baseSlot({ id: 'legacy-2', name: 'cena', start_time: '12:00', end_time: '15:00' }),
        baseSlot({ id: 'draft', name: 'Aperitivo', start_time: '18:00', end_time: '19:00' }),
      ]
      expect(validateSlotConfigs(slots, { focusIndex: 2 })).toBeNull()
    })

    it('fascia legacy con inizio==fine (non focus) non blocca il salvataggio della bozza', () => {
      const slots = [
        baseSlot({ id: 'legacy', name: 'Rotta', start_time: '20:00', end_time: '20:00' }),
        baseSlot({ id: 'draft', name: 'Pranzo', start_time: '12:00', end_time: '15:00' }),
      ]
      expect(validateSlotConfigs(slots, { focusIndex: 1 })).toBeNull()
    })

    it('fasce legacy sovrapposte fra loro (non focus) non bloccano il salvataggio della bozza', () => {
      const slots = [
        baseSlot({ id: 'legacy-a', name: 'A', start_time: '10:00', end_time: '12:00' }),
        baseSlot({ id: 'legacy-b', name: 'B', start_time: '11:00', end_time: '13:00' }),
        baseSlot({ id: 'draft', name: 'C', start_time: '19:00', end_time: '22:00' }),
      ]
      expect(validateSlotConfigs(slots, { focusIndex: 2 })).toBeNull()
    })

    it('la bozza stessa con inizio==fine resta rifiutata anche in modalità focus', () => {
      const slots = [
        baseSlot({ id: 'other', name: 'Cena', start_time: '19:00', end_time: '22:00' }),
        baseSlot({ id: 'draft', name: 'Rotta', start_time: '20:00', end_time: '20:00' }),
      ]
      expect(validateSlotConfigs(slots, { focusIndex: 1 })).toMatch(/coincidono/i)
    })

    it('un duplicato che coinvolge la bozza resta rifiutato', () => {
      const slots = [
        baseSlot({ id: 'other', name: 'Cena', start_time: '19:00', end_time: '22:00' }),
        baseSlot({ id: 'draft', name: 'cena', start_time: '12:00', end_time: '15:00' }),
      ]
      expect(validateSlotConfigs(slots, { focusIndex: 1 })).toMatch(/duplicato/i)
    })

    it('una sovrapposizione che coinvolge la bozza resta rifiutata', () => {
      const slots = [
        baseSlot({ id: 'other', name: 'Cena', start_time: '19:00', end_time: '22:00' }),
        baseSlot({ id: 'draft', name: 'Serale', start_time: '20:00', end_time: '23:00' }),
      ]
      expect(validateSlotConfigs(slots, { focusIndex: 1 })).toMatch(/sovrappongono/i)
    })

    it('senza focusIndex (Impostazioni) un duplicato ovunque nell\'array resta rifiutato: nessuna regressione', () => {
      const slots = [
        baseSlot({ id: 'a', name: 'Cena', start_time: '19:00', end_time: '22:00' }),
        baseSlot({ id: 'b', name: 'cena', start_time: '12:00', end_time: '15:00' }),
      ]
      expect(validateSlotConfigs(slots)).toMatch(/duplicato/i)
    })
  })
})
