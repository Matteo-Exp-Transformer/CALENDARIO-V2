/**
 * useTableStatuses — S4 WP-B3 (D22 + D23 + D24)
 *
 * Calcola lo stato "live" di ogni tavolo per slot+data dati gli assignment
 * e le prenotazioni. Il modello a 5 stati è pre-Live: raffinabile in S4-LIVE
 * quando esisterà un flag "seduto" esplicito (ex. checked_in_at).
 *
 * Gerarchia stati:
 *   free     → nessun assignment attivo
 *   upcoming → assignment attivo ma now < confirmed_start
 *   occupied → start ≤ now < start + soglia (grazia)
 *   late     → start + soglia ≤ now < confirmed_end (D23: lo staff decide, nessuna liberazione cieca)
 *   leaving  → now ≥ confirmed_end, attende checkout fisico (D22/D48)
 */

import { useMemo } from 'react'
import type { BookingTableAssignment } from '@/features/booking/hooks/useTableAssignments'
import type { BookingRequest } from '@/types/booking'
import { useRestaurantSetting } from '@/features/booking/hooks/useRestaurantSetting'

/** 5 stati tavolo live (pre-Live; raffinabile quando arriverà flag "seduto"). */
export type TableLiveStatus = 'free' | 'upcoming' | 'occupied' | 'late' | 'leaving'

/** Soglia ritardo default in minuti (chiave JSONB senza migrazione). */
export const DEFAULT_LATE_THRESHOLD_MINUTES = 15

interface ResolveArgs {
  /** Assignment attivo (checked_out_at === null) per questo tavolo nello slot+data, se esiste. */
  activeAssignment: BookingTableAssignment | null
  /** Prenotazione associata all'assignment attivo, se disponibile. */
  booking: BookingRequest | null
  /** Istante corrente. */
  now: Date
  /** Minuti di grazia dopo confirmed_start prima di marcare 'late'. */
  lateThresholdMinutes: number
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
}: ResolveArgs): TableLiveStatus {
  // Nessun turno attivo → tavolo libero
  if (!activeAssignment) return 'free'

  // Senza prenotazione associata o senza finestra temporale confiramta, consideriamo occupato
  // (assegnazione manuale senza orario confermato — caso estremo, non rompiamo il flusso)
  if (!booking || !booking.confirmed_start || !booking.confirmed_end) return 'occupied'

  const start = new Date(booking.confirmed_start).getTime()
  const end = new Date(booking.confirmed_end).getTime()
  const nowMs = now.getTime()
  const lateMs = lateThresholdMinutes * 60 * 1000

  if (nowMs < start) return 'upcoming'
  if (nowMs < start + lateMs) return 'occupied'
  if (nowMs < end) return 'late'
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
}: UseTableStatusesArgs): Map<string, TableLiveStatus> {
  // Legge la soglia dal JSONB — nessuna migrazione richiesta, default gestito dal registry
  const { data: lateThreshold } = useRestaurantSetting('table_late_threshold_minutes', {
    authenticated: true,
  })

  const threshold = lateThreshold ?? DEFAULT_LATE_THRESHOLD_MINUTES

  return useMemo(() => {
    const now = nowOverride ?? new Date()
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
      const booking = bookingsById.get(activeAssignment.booking_id) ?? null
      statusMap.set(
        tableId,
        resolveTableLiveStatus({ activeAssignment, booking, now, lateThresholdMinutes: threshold }),
      )
    }

    return statusMap
  }, [assignments, bookingsById, selectedSlotId, selectedDate, threshold, nowOverride])
}
