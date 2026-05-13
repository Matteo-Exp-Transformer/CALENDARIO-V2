import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { ANALYTICS_QUERY_ROOT } from './useAnalytics'
import { HOME_STATS_QUERY_KEY } from './useHomeStats'

export interface WalkInInput {
  client_name?: string
  num_guests: number
  table_id?: string | null
  placement?: string
}

/**
 * Crea una prenotazione walk-in: status accepted, source walk_in, confirmed_start = now,
 * confirmed_end = now + 90min. Non invia email, non applica rate-limit.
 * È un'operazione admin-only — usa il client `supabase` autenticato.
 */
export function useWalkInMutation() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: WalkInInput) => {
      if (!tenantId) throw new Error('Tenant mancante')

      const now = new Date()
      const confirmedStart = now.toISOString()
      const confirmedEnd = new Date(now.getTime() + 90 * 60 * 1000).toISOString()
      const desiredDate = format(now, 'yyyy-MM-dd')

      const { data, error } = await supabase
        .from('booking_requests')
        .insert({
          tenant_id: tenantId,
          client_name: input.client_name?.trim() || 'Walk-in',
          client_email: '',
          num_guests: input.num_guests,
          desired_date: desiredDate,
          status: 'accepted',
          booking_type: 'walk_in',
          source: 'walk_in',
          confirmed_start: confirmedStart,
          confirmed_end: confirmedEnd,
          ...(input.placement ? { placement: input.placement } : {}),
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
