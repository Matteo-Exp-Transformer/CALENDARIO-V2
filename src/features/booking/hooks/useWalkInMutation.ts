import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { createBookingDateTime } from '@/features/booking/utils/dateUtils'
import { resolveBookingDuration } from '@/features/booking/lib/resolveBookingDuration'
import { ANALYTICS_QUERY_ROOT } from './useAnalytics'
import { HOME_STATS_QUERY_KEY } from './useHomeStats'

export interface WalkInInput {
  client_name?: string
  num_guests: number
  /** @deprecated Non usato: booking_requests non ha colonna table_id.
   *  Il posizionamento avviene tramite `placement` (nome tavolo). Mantenuto per
   *  compatibilità con codice chiamante che potrebbe ancora passarlo. */
  table_id?: string | null
  placement?: string
  /**
   * Durata minima della fascia in cui cade il walk-in (service_slots.min_duration).
   * Passata dal chiamante (WalkInModal) che ha già risolto la fascia corrente.
   * Usata come pavimento dal resolver durata (gerarchia D35) — mai come valore unico.
   */
  slot_min_duration?: number
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
      // Per il walk-in non abbiamo card/preset/booking_mode disponibili qui
      // (la config walk-in da console è FU-SERV-ADMIN-PANEL-1, non ancora implementata).
      // Passiamo solo slot_min_duration come pavimento — il resolver usa quello come floor,
      // non come sorgente: senza altri livelli configurati ritorna undefined (D42).
      const resolved = resolveBookingDuration({
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

      const { data, error } = await supabase
        .from('booking_requests')
        .insert({
          tenant_id: tenantId,
          client_name: input.client_name?.trim() || 'Walk-in',
          client_email: '',
          num_guests: input.num_guests,
          desired_date: desiredDate,
          desired_time: desiredTime,
          status: 'accepted',
          booking_type: 'walk_in',
          source: 'walk_in',
          confirmed_start: confirmedStart,
          confirmed_end: confirmedEnd,
          ...(input.placement ? { placement: input.placement } : {}),
          ...(durationSnapshot ?? {}),
        })
        .select('id')
        .single()

      if (error) {
        logger.error('[useWalkInMutation] DB error', error)
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookings'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['bookings', 'accepted'], refetchType: 'all' }),
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
