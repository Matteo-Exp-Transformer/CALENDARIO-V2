/**
 * useTableStatuses — S4 WP-B3 (D22 + D23 + D24)
 *
 * Calcola lo stato "live" di ogni tavolo per slot+data dati gli assignment
 * e le prenotazioni. Il modello a 5 stati è pre-Live: raffinabile in S4-LIVE
 * quando esisterà un flag "seduto" esplicito (ex. checked_in_at).
 *
 * Gerarchia stati:
 *   free     → nessun assignment attivo
 *   upcoming → assignment attivo ma now < arrivo a muro
 *   occupied → arrivo ≤ now < arrivo + soglia (grazia)
 *   late     → arrivo + soglia ≤ now < fine occupazione (pasto + buffer D37)
 *   leaving  → now ≥ fine occupazione, attende checkout fisico (D22/D48)
 *
 * Orari: confirmed_start/end usano offset +00:00 finto (cifre = ora a muro).
 * I confronti usano wallClockDateFromISO / getAccurate* — mai new Date(iso).
 */

import { useEffect, useMemo, useState } from 'react'
import type { BookingTableAssignment } from '@/features/booking/hooks/useTableAssignments'
import type { BookingRequest } from '@/types/booking'
import { useRestaurantSetting } from '@/features/booking/hooks/useRestaurantSetting'
import {
  extractDateFromISO,
  getAccurateEndTime,
  getAccurateStartTime,
  wallClockDateFromISO,
  wallClockDateFromParts,
} from '@/features/booking/utils/dateUtils'

/** 5 stati tavolo live (pre-Live; raffinabile quando arriverà flag "seduto"). */
export type TableLiveStatus = 'free' | 'upcoming' | 'occupied' | 'late' | 'leaving'

/** Soglia ritardo default in minuti (chiave JSONB senza migrazione). */
export const DEFAULT_LATE_THRESHOLD_MINUTES = 15

/**
 * FIX D (03-08-26, D-D/S-5) — intervallo di richiamo default (minuti) dell'avviso
 * "Tavolo a fine turno" dopo che lo staff preme "Ancora occupato". Stessa manopola
 * JSONB senza migrazione della soglia di ritardo sopra: chiave
 * `restaurant_settings.table_release_notice_recall_minutes`.
 */
export const DEFAULT_RELEASE_NOTICE_RECALL_MINUTES = 30

/**
 * Legge la manopola dell'intervallo di richiamo (S-5). Nessuna migrazione: default
 * gestito dal registry (`restaurantSettingRegistry.ts`) se la chiave è assente.
 */
export function useReleaseNoticeRecallMinutes(): number {
  const { data } = useRestaurantSetting('table_release_notice_recall_minutes', {
    authenticated: true,
  })
  return data ?? DEFAULT_RELEASE_NOTICE_RECALL_MINUTES
}

/** Campi opzionali di occupancy snapshot (mig. 064) — select('*') li restituisce. */
type BookingWithOccupancy = BookingRequest & {
  turnover_buffer_minutes?: number | null
}

interface ResolveArgs {
  /** Assignment attivo (checked_out_at === null) per questo tavolo nello slot+data, se esiste. */
  activeAssignment: BookingTableAssignment | null
  /** Prenotazione associata all'assignment attivo, se disponibile. */
  booking: BookingWithOccupancy | null
  /** Istante corrente (orologio reale del browser). */
  now: Date
  /** Minuti di grazia dopo l'arrivo a muro prima di marcare 'late'. */
  lateThresholdMinutes: number
  /**
   * Buffer di riassetto (D37), in minuti. Preferire lo snapshot sulla prenotazione;
   * altrimenti il buffer della fascia corrente. Default 0.
   */
  turnoverBufferMinutes?: number
}

/**
 * Fine occupazione a muro = fine pasto (confirmed_end) + buffer di riassetto (D37).
 * La capienza si libera a questo istante; lo stato 'leaving' e l'avviso staff coincidono.
 */
function resolveOccupancyEndWall(
  booking: BookingWithOccupancy,
  turnoverBufferMinutes: number,
): Date | null {
  const endFromIso = wallClockDateFromISO(booking.confirmed_end)
  if (!endFromIso) {
    const startDate =
      booking.desired_date || extractDateFromISO(booking.confirmed_start) || ''
    const endTime = getAccurateEndTime(booking)
    const fallback = wallClockDateFromParts(startDate, endTime)
    if (!fallback) return null
    const bufferMs = Math.max(0, turnoverBufferMinutes) * 60 * 1000
    return new Date(fallback.getTime() + bufferMs)
  }
  const bufferMs = Math.max(0, turnoverBufferMinutes) * 60 * 1000
  return new Date(endFromIso.getTime() + bufferMs)
}

function resolveArrivalWall(booking: BookingWithOccupancy): Date | null {
  const startTime = getAccurateStartTime(booking)
  const startDate =
    booking.desired_date || extractDateFromISO(booking.confirmed_start) || ''
  if (startTime && startDate) {
    const fromParts = wallClockDateFromParts(startDate, startTime)
    if (fromParts) return fromParts
  }
  return wallClockDateFromISO(booking.confirmed_start)
}

/**
 * Funzione PURA — risolvere lo stato live di un singolo tavolo.
 * Testabile in isolamento senza hook o dipendenze React.
 *
 * @see JSDoc del modulo per la semantica di ogni stato.
 */
export function resolveTableLiveStatus({
  activeAssignment,
  booking,
  now,
  lateThresholdMinutes,
  turnoverBufferMinutes = 0,
}: ResolveArgs): TableLiveStatus {
  // Nessun turno attivo → tavolo libero
  if (!activeAssignment) return 'free'

  // Senza prenotazione associata o senza finestra temporale confermata, consideriamo occupato
  // (assegnazione manuale senza orario confermato — caso estremo, non rompiamo il flusso)
  if (!booking || !booking.confirmed_start || !booking.confirmed_end) return 'occupied'

  const bufferFromBooking =
    typeof booking.turnover_buffer_minutes === 'number'
      ? booking.turnover_buffer_minutes
      : turnoverBufferMinutes

  const start = resolveArrivalWall(booking)
  const end = resolveOccupancyEndWall(booking, bufferFromBooking)
  if (!start || !end) return 'occupied'

  const nowMs = now.getTime()
  const startMs = start.getTime()
  const endMs = end.getTime()
  const lateMs = lateThresholdMinutes * 60 * 1000

  if (nowMs < startMs) return 'upcoming'
  if (nowMs < startMs + lateMs) return 'occupied'
  if (nowMs < endMs) return 'late'
  return 'leaving'
}

interface UseTableStatusesArgs {
  /** Tutti gli assignment per la data selezionata. */
  assignments: BookingTableAssignment[]
  /** Mappa booking_id → BookingRequest per la data. */
  bookingsById: Map<string, BookingRequest>
  /** Slot selezionato (filtra gli assignment). */
  selectedSlotId: string
  /** Data selezionata (YYYY-MM-DD). */
  selectedDate: string
  /** Istante corrente (iniettabile nei test per riproducibilità). Default: new Date(). */
  now?: Date
  /**
   * Buffer di riassetto della fascia (D37). Usato se la prenotazione non ha
   * ancora lo snapshot `turnover_buffer_minutes`.
   */
  turnoverBufferMinutes?: number
}

/**
 * Hook che calcola lo stato live per ogni tavolo nello slot+data correnti.
 * La soglia ritardo viene da `restaurant_settings.table_late_threshold_minutes`
 * con fallback a `DEFAULT_LATE_THRESHOLD_MINUTES` (15 min) se la chiave è assente.
 *
 * @returns Map<tableId, TableLiveStatus>
 */
export function useTableStatuses({
  assignments,
  bookingsById,
  selectedSlotId,
  selectedDate,
  now: nowOverride,
  turnoverBufferMinutes = 0,
}: UseTableStatusesArgs): Map<string, TableLiveStatus> {
  // Legge la soglia dal JSONB — nessuna migrazione richiesta, default gestito dal registry
  const { data: lateThreshold } = useRestaurantSetting('table_late_threshold_minutes', {
    authenticated: true,
  })

  const threshold = lateThreshold ?? DEFAULT_LATE_THRESHOLD_MINUTES
  const [clockNow, setClockNow] = useState(() => nowOverride ?? new Date())

  useEffect(() => {
    if (nowOverride) {
      setClockNow(nowOverride)
      return
    }
    const id = window.setInterval(() => setClockNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [nowOverride])

  return useMemo(() => {
    const now = nowOverride ?? clockNow
    const statusMap = new Map<string, TableLiveStatus>()

    // Raggruppa assignment per tavolo (solo slot+data correnti, solo attivi)
    const byTable = new Map<string, BookingTableAssignment>()
    for (const a of assignments) {
      if (a.service_slot_id !== selectedSlotId) continue
      if (a.date !== selectedDate) continue
      if (a.checked_out_at !== null) continue
      // Se ci sono più assignment attivi per lo stesso tavolo (anomalia), prende quello
      // col turn_number più basso (coerente con useCheckoutTable)
      const existing = byTable.get(a.table_id)
      if (!existing || a.turn_number < existing.turn_number) {
        byTable.set(a.table_id, a)
      }
    }

    // Per ogni tavolo con assignment attivo, calcola lo stato
    for (const [tableId, activeAssignment] of byTable) {
      const booking = (bookingsById.get(activeAssignment.booking_id) as BookingWithOccupancy | undefined) ?? null
      statusMap.set(
        tableId,
        resolveTableLiveStatus({
          activeAssignment,
          booking,
          now,
          lateThresholdMinutes: threshold,
          turnoverBufferMinutes,
        }),
      )
    }

    return statusMap
  }, [
    assignments,
    bookingsById,
    selectedSlotId,
    selectedDate,
    threshold,
    nowOverride,
    clockNow,
    turnoverBufferMinutes,
  ])
}
