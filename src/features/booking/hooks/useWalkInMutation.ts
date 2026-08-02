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
import { TABLE_ASSIGNMENTS_QUERY_KEY } from './useTableAssignments'

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
  force_replace_existing?: boolean
  force_reason?: string
}

export function buildWalkInRollbackPatch(reason: string) {
  return {
    status: 'deleted',
    cancellation_reason: reason,
    cancelled_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
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

      if (input.table_id) {
        if (!input.service_slot_id) {
          await supabase
            .from('booking_requests')
            .update(buildWalkInRollbackPatch('Rollback walk-in: fascia servizio mancante'))
            .eq('id', data.id)
            .eq('tenant_id', tenantId)
          throw new Error('Fascia servizio mancante per assegnare il walk-in al tavolo.')
        }

        const { data: existingAssignments, error: existingError } = await supabase
          .from('booking_table_assignments')
          .select('id, turn_number, checked_out_at')
          .eq('tenant_id', tenantId)
          .eq('date', desiredDate)
          .eq('service_slot_id', input.service_slot_id)
          .eq('table_id', input.table_id)

        if (existingError) {
          await supabase
            .from('booking_requests')
            .update(buildWalkInRollbackPatch('Rollback walk-in: controllo tavolo fallito'))
            .eq('id', data.id)
            .eq('tenant_id', tenantId)
          throw new Error(existingError.message)
        }

        const assignmentRows = (existingAssignments ?? []) as {
          id: string
          turn_number: number | null
          checked_out_at: string | null
        }[]
        const activeAssignments = assignmentRows
          .filter((row) => row.checked_out_at === null)
          .sort((a, b) => (a.turn_number ?? 0) - (b.turn_number ?? 0))

        if (activeAssignments.length > 0 && !input.force_replace_existing) {
          await supabase
            .from('booking_requests')
            .update(buildWalkInRollbackPatch('Rollback walk-in: tavolo occupato'))
            .eq('id', data.id)
            .eq('tenant_id', tenantId)
          throw new Error('Questo tavolo risulta occupato: usa la conferma guidata per liberarlo e assegnare il walk-in.')
        }

        if (activeAssignments.length > 0 && input.force_replace_existing) {
          const { error: releaseError } = await supabase
            .from('booking_table_assignments')
            .update({ checked_out_at: new Date().toISOString() })
            .eq('id', activeAssignments[0].id)
            .eq('tenant_id', tenantId)

          if (releaseError) {
            await supabase
              .from('booking_requests')
              .update(buildWalkInRollbackPatch('Rollback walk-in: liberazione tavolo occupato fallita'))
              .eq('id', data.id)
              .eq('tenant_id', tenantId)
            throw new Error(releaseError.message)
          }
        }

        const turnNumbers = assignmentRows
          .map((row) => row.turn_number ?? 0)
        const turnNumber = turnNumbers.length > 0 ? Math.max(...turnNumbers) + 1 : 1

        if (
          !input.force_replace_existing &&
          input.max_turns !== null &&
          input.max_turns !== undefined &&
          turnNumber > input.max_turns
        ) {
          await supabase
            .from('booking_requests')
            .update(buildWalkInRollbackPatch('Rollback walk-in: turni tavolo esauriti'))
            .eq('id', data.id)
            .eq('tenant_id', tenantId)
          throw new Error('Turni esauriti per questo tavolo in questa fascia.')
        }

        const { error: assignmentError } = await supabase
          .from('booking_table_assignments')
          .insert({
            tenant_id: tenantId,
            booking_id: data.id,
            table_id: input.table_id,
            service_slot_id: input.service_slot_id,
            turn_number: turnNumber,
            date: desiredDate,
            checked_out_at: null,
            forced_by_admin: input.force_replace_existing === true,
            force_reason: input.force_replace_existing
              ? (input.force_reason?.trim() || 'Forzatura guidata walk-in: tavolo liberato dallo staff')
              : null,
          })

        if (assignmentError) {
          await supabase
            .from('booking_requests')
            .update(buildWalkInRollbackPatch('Rollback walk-in: assegnazione tavolo fallita'))
            .eq('id', data.id)
            .eq('tenant_id', tenantId)
          throw new Error(assignmentError.message)
        }
      }

      return { ...data, date: desiredDate, serviceSlotId: input.service_slot_id ?? null }
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
