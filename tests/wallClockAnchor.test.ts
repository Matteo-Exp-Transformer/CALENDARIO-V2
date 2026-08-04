/**
 * Copre e2e/helpers/wallClockAnchor.ts — fix 04-08-26 delle due finestre
 * cieche di pro-service-tables-lifecycle.spec.ts (dettaglio nel commento di
 * testata di quel modulo).
 *
 * Vive qui e non in e2e/__tests__ perché vitest.config.ts esclude `e2e/**`
 * dalla scoperta dei test (riga 15): questo file importa comunque il modulo
 * REALE usato dallo spec (stesso codice, non una copia), `tests/` non è
 * escluso e ha già `setupFiles` puntato qui (vedi vitest.config.ts).
 *
 * Non si può lanciare Playwright per dimostrare che il fix regge a qualunque
 * ora del giorno (l'orario reale della macchina non è pilotabile da qui):
 * la prova sta in questi test, che fingono l'ora reale (`realNow`, iniettata
 * a `safeAnchorNow`) esattamente nelle due finestre cieche prima del fix
 * (23:50 e 00:30) più un'ora di controllo lontana da mezzanotte (14:00), e
 * verificano — con le STESSE funzioni pure usate dallo spec e con la
 * `resolveTableLiveStatus` reale dell'app (useTableStatuses.ts, non
 * modificata) — che l'inizio resti prima della fine e che gli stati
 * risultino quelli attesi dallo spec per ciascuno dei due pattern di
 * scenario che tocca (6 test su 7: "già in uscita al carico" e "sequenza di
 * stati in avanti").
 */

import { describe, it, expect } from 'vitest'
import {
  addMinutes,
  localDateStr,
  localTimeStr,
  wallIsoAt,
  safeAnchorNow,
} from '../e2e/helpers/wallClockAnchor'
import {
  extractDateFromISO,
  extractTimeFromISO,
  wallClockDateFromParts,
} from '@/features/booking/utils/dateUtils'
import {
  resolveTableLiveStatus,
  DEFAULT_LATE_THRESHOLD_MINUTES,
  type TableLiveStatus,
} from '@/features/booking/hooks/useTableStatuses'
import type { BookingTableAssignment } from '@/features/booking/hooks/useTableAssignments'
import type { BookingRequest } from '@/types/booking'

// ─── Istanti "ora reale" da coprire ─────────────────────────────────────────
// Le due finestre cieche del bug erano ~23:25→00:00 e 00:00→~01:40 (dettaglio
// nel commento di testata di wallClockAnchor.ts): 23:50 e 00:30 cadono
// entrambe dentro quella finestra. 14:00 è il controllo "ora normale",
// lontana da mezzanotte, che deve continuare a funzionare come prima.
const REAL_NOW_CASES: Array<{ label: string; realNow: Date }> = [
  { label: '23:50 (poco prima di mezzanotte)', realNow: new Date(2026, 7, 15, 23, 50, 0, 0) },
  { label: '00:30 (poco dopo mezzanotte)', realNow: new Date(2026, 7, 16, 0, 30, 0, 0) },
  { label: '14:00 (controllo, ora lontana da mezzanotte)', realNow: new Date(2026, 7, 16, 14, 0, 0, 0) },
]

// ─── Helper di test — stesso pattern di useTableStatuses.test.ts ───────────

function makeAssignment(): BookingTableAssignment {
  return {
    id: 'a1',
    tenant_id: 't1',
    booking_id: 'b1',
    table_id: 'table-1',
    service_slot_id: 'slot-1',
    turn_number: 1,
    checked_out_at: null,
    date: '2026-01-01',
    created_at: '',
    release_notice_handled_at: null,
  }
}

/**
 * Prenotazione seminata come fa `insertBooking` nello spec e2e reale:
 * `desired_date`/`desired_time` SEMPRE valorizzati (è così che
 * `resolveArrivalWall` — useTableStatuses.ts — sceglie l'arrivo), oltre a
 * `confirmed_start`/`confirmed_end` costruiti con la stessa `wallIsoAt`.
 */
function makeBooking(canonicalDate: string, arrival: Date, end: Date): BookingRequest {
  return {
    id: 'b1',
    created_at: '',
    updated_at: '',
    client_name: 'Cliente Test',
    client_email: 'cliente@test.it',
    event_type: 'cena',
    desired_date: canonicalDate,
    desired_time: localTimeStr(arrival),
    num_guests: 2,
    status: 'accepted',
    confirmed_start: wallIsoAt(canonicalDate, arrival),
    confirmed_end: wallIsoAt(canonicalDate, end),
    tenant_id: 't1',
  } as BookingRequest
}

/** Ricostruisce il `Date` a muro esattamente come lo rilegge l'app da un ISO salvato. */
function wallClockFromIso(iso: string): Date {
  const parsed = wallClockDateFromParts(extractDateFromISO(iso), extractTimeFromISO(iso))
  if (!parsed) throw new Error(`ISO non valido nel test: ${iso}`)
  return parsed
}

function statusAt(
  booking: BookingRequest,
  now: Date,
  lateThresholdMinutes = DEFAULT_LATE_THRESHOLD_MINUTES,
): TableLiveStatus {
  return resolveTableLiveStatus({
    activeAssignment: makeAssignment(),
    booking,
    now,
    lateThresholdMinutes,
  })
}

// ─── safeAnchorNow: invarianti indipendenti dall'ora reale ─────────────────

describe('safeAnchorNow', () => {
  for (const { label, realNow } of REAL_NOW_CASES) {
    it(`[realNow ${label}] non è mai avanti al tempo reale (vincolo auth — vedi testata dello spec)`, () => {
      const anchor = safeAnchorNow(realNow)
      expect(anchor.getTime()).toBeLessThan(realNow.getTime())
    })

    it(`[realNow ${label}] è fissa a mezzogiorno del giorno solare precedente`, () => {
      const anchor = safeAnchorNow(realNow)
      expect(anchor.getHours()).toBe(12)
      expect(anchor.getMinutes()).toBe(0)
      expect(anchor.getSeconds()).toBe(0)
      expect(localDateStr(anchor)).not.toBe(localDateStr(realNow))
    })
  }
})

// ─── Scenari reali dello spec, replicati con l'ancora ──────────────────────
// I due pattern usati dai 6 test su 7 toccati dal fix (dettaglio nel prompt
// del senior, verificato riga per riga sullo spec):
//   A) "già in uscita al carico" (test 1, 2, 3-tavolo1, 6): arrivo NOW-90',
//      fine NOW-5' — deve risultare 'leaving' fin dal primo caricamento.
//   B) "sequenza di stati in avanti" (test 4/States): arrivo NOW+5', fine =
//      arrivo + soglia + 6' — upcoming → occupied → late → leaving mentre il
//      clock avanza.

describe('scenario A — "già in uscita al carico" (arrivo NOW-90\', fine NOW-5\')', () => {
  for (const { label, realNow } of REAL_NOW_CASES) {
    it(`[realNow ${label}] inizio < fine e stato 'leaving' fin dal carico`, () => {
      const anchor = safeAnchorNow(realNow)
      const DATE = localDateStr(anchor)
      const arrival = addMinutes(anchor, -90)
      const end = addMinutes(anchor, -5)

      const booking = makeBooking(DATE, arrival, end)

      // Le stringhe salvate (confirmed_start/end) devono restare sullo stesso
      // giorno canonico: è la garanzia che elimina il bug (mai attraversare
      // mezzanotte rispetto a DATE).
      expect(extractDateFromISO(booking.confirmed_start!)).toBe(DATE)
      expect(extractDateFromISO(booking.confirmed_end!)).toBe(DATE)

      const start = wallClockFromIso(booking.confirmed_start!)
      const finish = wallClockFromIso(booking.confirmed_end!)
      expect(start.getTime()).toBeLessThan(finish.getTime())

      expect(statusAt(booking, anchor)).toBe('leaving')
    })
  }
})

describe('scenario B — "sequenza di stati in avanti" (arrivo NOW+5\', fine = arrivo+soglia+6\')', () => {
  const threshold = DEFAULT_LATE_THRESHOLD_MINUTES // 15 — stesso default dello spec

  for (const { label, realNow } of REAL_NOW_CASES) {
    it(`[realNow ${label}] inizio < fine e upcoming → occupied → late → leaving`, () => {
      const anchor = safeAnchorNow(realNow)
      const DATE = localDateStr(anchor)
      const arrival = addMinutes(anchor, 5)
      const end = addMinutes(arrival, threshold + 6)

      const booking = makeBooking(DATE, arrival, end)

      expect(extractDateFromISO(booking.confirmed_start!)).toBe(DATE)
      expect(extractDateFromISO(booking.confirmed_end!)).toBe(DATE)

      const start = wallClockFromIso(booking.confirmed_start!)
      const finish = wallClockFromIso(booking.confirmed_end!)
      expect(start.getTime()).toBeLessThan(finish.getTime())

      // Stessa sequenza di fastForward dello spec: 0 → +6' → +6'+soglia → +6'+soglia+8'
      expect(statusAt(booking, addMinutes(anchor, 0), threshold)).toBe('upcoming')
      expect(statusAt(booking, addMinutes(anchor, 6), threshold)).toBe('occupied')
      expect(statusAt(booking, addMinutes(anchor, 6 + threshold), threshold)).toBe('late')
      expect(statusAt(booking, addMinutes(anchor, 6 + threshold + 8), threshold)).toBe('leaving')
    })
  }
})
