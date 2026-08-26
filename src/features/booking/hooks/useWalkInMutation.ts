import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { createBookingDateTime } from '@/features/booking/utils/dateUtils'
import { resolveBookingDuration } from '@/features/booking/lib/resolveBookingDuration'
import type { Database } from '@/types/database'
import { ANALYTICS_QUERY_ROOT } from './useAnalytics'
import { HOME_STATS_QUERY_KEY } from './useHomeStats'
import { TABLE_ASSIGNMENTS_QUERY_KEY } from './useTableAssignments'

/**
 * `supabase gen types` non riflette la nullability dei parametri SQL, solo l'opzionalità
 * (una chiave diventa `?:` solo se il parametro ha un `DEFAULT` nella funzione — mai `| null`,
 * anche quando la colonna/il parametro Postgres accetta NULL). `create_walk_in_with_assignment`
 * (mig. 069) accetta esplicitamente NULL per i campi duration, p_placement, p_table_id e
 * p_service_slot_id (walk-in senza tavolo, permanenza OFF): verificato via RPC diretta su TEST.
 * Questo tipo locale rispecchia la nullability reale della funzione; il cast alla riga della
 * chiamata `.rpc()` serve solo ad attraversare il limite del generatore, non a indebolire i
 * controlli sui nomi/tipi dei campi (quelli restano verificati qui).
 */
type CreateWalkInWithAssignmentParams = {
  p_tenant_id: string
  p_client_name: string
  p_num_guests: number
  p_desired_date: string
  p_desired_time: string
  p_confirmed_start: string
  p_confirmed_end: string
  p_duration_minutes: number | null
  p_duration_source: string | null
  p_duration_rule_version: number | null
  p_placement: string | null
  p_table_id: string | null
  p_service_slot_id: string | null
  p_max_turns?: number | null
  p_force_replace_existing?: boolean
  p_force_reason?: string | null
}

export interface WalkInInput {
  client_name?: string
  num_guests: number
  /** @deprecated Non usato: booking_requests non ha colonna table_id.
   *  Il posizionamento avviene tramite `placement` (nome tavolo). Mantenuto per
   *  compatibilità con codice chiamante che potrebbe ancora passarlo. */
  table_id?: string | null
  service_slot_id?: string | null
  max_turns?: number | null
  placement?: string
  /**
   * Durata minima della fascia in cui cade il walk-in (service_slots.min_duration).
   * Passata dal chiamante (WalkInModal) che ha già risolto la fascia corrente.
   * Usata come pavimento dal resolver durata (gerarchia D35) — mai come valore unico.
   */
  slot_min_duration?: number
  /** Durata base da console, ultimo gradino della gerarchia D35. */
  restaurant_default_duration?: number
  force_replace_existing?: boolean
  force_reason?: string
}

/**
 * Crea una prenotazione walk-in: status accepted, source walk_in,
 * confirmed_start / confirmed_end con orario locale "a muro" (stesso schema di
 * `createBookingDateTime` per il resto dell'admin — evita `toISOString()` UTC che
 * sposta l'ora in calendario). desired_time allineato per digest / getAccurateStartTime.
 * Non invia email, non applica rate-limit. Admin-only — client `supabase` autenticato.
 *
 * Durata (Task B2):
 *   - Passa slot_min_duration al resolver D35 come pavimento.
 *   - Se il resolver ritorna undefined (permanenza OFF, D42): fallback a 90 min.
 *   - Se il resolver ritorna un valore: lo usa per confirmed_end e persiste lo snapshot
 *     duration_minutes / duration_source / duration_rule_version (campi esistenti in DB
 *     dal S2, verificati in BookingRequest e BookingRequestInput).
 *
 * Scrittura atomica (debito "walk-in non transazionale", handoff S4 §4-bis punto 4, mig. 069):
 * booking + eventuale assegnazione tavolo sono un'unica chiamata alla RPC
 * `create_walk_in_with_assignment` (SECURITY DEFINER, check tenant interno). Prima questo hook
 * faceva un INSERT su booking_requests seguito da controlli e INSERT su
 * booking_table_assignments, con un "rollback" simulato (UPDATE compensativo che marcava il
 * booking `deleted`) se un passo falliva — non una vera transazione: se il rollback stesso
 * falliva (rete/sessione persa a metà), restava un walk-in orfano. Ora qualunque condizione di
 * errore fa fallire l'intera RPC lato Postgres: nessuna riga sporca può restare, senza bisogno
 * di scritture compensative lato client. La sola business logic rimasta in JS è la risoluzione
 * della durata (resolveBookingDuration), pura e già testata: la RPC riceve il risultato già
 * calcolato come parametro, non lo ricalcola.
 */
export function useWalkInMutation() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: WalkInInput) => {
      if (!tenantId) throw new Error('Tenant mancante')

      const now = new Date()
      const desiredDate = format(now, 'yyyy-MM-dd')
      const desiredTime = format(now, 'HH:mm')
      const confirmedStart = createBookingDateTime(desiredDate, desiredTime)

      // Risolve la durata con il resolver D35.
      // Per il walk-in non abbiamo card/preset/booking_mode disponibili qui.
      // La durata base console è l'ultimo gradino; la fascia resta solo un pavimento.
      const resolved = resolveBookingDuration({
        restaurant_default_duration: input.restaurant_default_duration,
        slot_min_duration: input.slot_min_duration,
      })

      let durationMinutes: number
      let durationSnapshot: { duration_minutes: number; duration_source: string; duration_rule_version: number } | undefined

      if (resolved !== undefined) {
        durationMinutes = resolved.duration_minutes
        // I campi snapshot esistono nel tipo BookingRequest (S2, righe 81-83) e
        // in BookingRequestInput — li persiste per mantenere coerenza con le altre prenotazioni.
        durationSnapshot = {
          duration_minutes: resolved.duration_minutes,
          duration_source: resolved.source,
          duration_rule_version: resolved.rule_version,
        }
      } else {
        // Permanenza OFF (D42): nessuna durata configurata → fallback a 90 min.
        // Non persiste snapshot perché non c'è una sorgente da tracciare.
        durationMinutes = 90
      }

      const endAt = new Date(now.getTime() + durationMinutes * 60 * 1000)
      const endDate = format(endAt, 'yyyy-MM-dd')
      const endTime = format(endAt, 'HH:mm')
      const confirmedEnd = createBookingDateTime(endDate, endTime, false, desiredTime)

      // Snapshot durata: solo se il resolver ha prodotto un risultato (durationSnapshot
      // definito). Senza configurazione (permanenza OFF, D42) i tre campi restano NULL —
      // stesso comportamento dell'INSERT originale, che non li includeva affatto in quel caso.
      // durationMinutes (usato sopra per confirmedEnd) resta comunque concreto (90 di fallback).
      const durationParams = durationSnapshot
        ? {
            duration_minutes: durationSnapshot.duration_minutes,
            duration_source: durationSnapshot.duration_source,
            duration_rule_version: durationSnapshot.duration_rule_version,
          }
        : { duration_minutes: null, duration_source: null, duration_rule_version: null }

      const rpcParams: CreateWalkInWithAssignmentParams = {
        p_tenant_id: tenantId,
        p_client_name: input.client_name?.trim() || 'Walk-in',
        p_num_guests: input.num_guests,
        p_desired_date: desiredDate,
        p_desired_time: desiredTime,
        p_confirmed_start: confirmedStart,
        p_confirmed_end: confirmedEnd,
        p_duration_minutes: durationParams.duration_minutes,
        p_duration_source: durationParams.duration_source,
        p_duration_rule_version: durationParams.duration_rule_version,
        p_placement: input.placement ?? null,
        p_table_id: input.table_id ?? null,
        p_service_slot_id: input.service_slot_id ?? null,
        p_max_turns: input.max_turns ?? null,
        p_force_replace_existing: input.force_replace_existing ?? false,
        p_force_reason: input.force_reason ?? null,
      }

      const { data: bookingId, error } = await supabase.rpc(
        'create_walk_in_with_assignment',
        rpcParams as unknown as Database['public']['Functions']['create_walk_in_with_assignment']['Args'],
      )

      if (error) {
        logger.error('[useWalkInMutation] RPC error', error)
        throw new Error(error.message)
      }

      return { id: bookingId as string, date: desiredDate, serviceSlotId: input.service_slot_id ?? null }
    },
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookings'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['bookings', 'accepted'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId], refetchType: 'all' }),
        data.serviceSlotId
          ? queryClient.invalidateQueries({
              queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, data.date, data.serviceSlotId, 'unassigned'],
              refetchType: 'all',
            })
          : Promise.resolve(),
        queryClient.invalidateQueries({ queryKey: [HOME_STATS_QUERY_KEY, tenantId], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: [ANALYTICS_QUERY_ROOT, tenantId], refetchType: 'all' }),
      ])
      toast.success('Walk-in aggiunto')
    },
    onError: (e: Error) => {
      logger.error('[useWalkInMutation] mutation error', e)
      toast.error(e.message || 'Errore aggiunta walk-in')
    },
  })
}
