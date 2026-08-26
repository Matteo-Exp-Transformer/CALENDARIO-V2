import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import type { BookingRequest, BookingRequestInput } from '@/types/booking'
import { toast } from 'react-toastify'
import { createBookingDateTime, calculateEndTimeFromStart, calculateEndTimeFromStartMinutes } from '../utils/dateUtils'
import { buildFeatures } from '@/config/features'
import { logger } from '@/lib/logger'
import type { Json, TablesInsert } from '@/types/database'
import { TABLE_ASSIGNMENTS_QUERY_KEY } from './useTableAssignments'
import { useRestaurantSetting } from './useRestaurantSetting'
import { resolveBookingDuration } from '../lib/resolveBookingDuration'

// Hook for creating booking requests directly as ACCEPTED (admin only)
export const useCreateAdminBooking = () => {
  const { tenantId, edition } = useTenantContext()
  const queryClient = useQueryClient()
  const { data: restaurantDefaultDuration = 90 } = useRestaurantSetting(
    'restaurant_default_duration',
    { authenticated: true },
  )
  return useMutation({
    mutationFn: async (data: BookingRequestInput) => {
      if (!tenantId) {
        throw new Error('Tenant non disponibile: effettuare nuovamente il login')
      }

      const features = buildFeatures(edition)

      // Normalizza desired_time a formato HH:MM (rimuove secondi se presenti)
      const normalizedTime = data.desired_time 
        ? data.desired_time.split(':').slice(0, 2).join(':')
        : null
      
      const fallbackTime = '20:00'
      const startTime = normalizedTime || fallbackTime
      const resolvedDuration = resolveBookingDuration({
        restaurant_default_duration: restaurantDefaultDuration,
      })
      const durationMinutes = resolvedDuration?.duration_minutes
      const endTime = durationMinutes == null
        ? calculateEndTimeFromStart(startTime)
        : calculateEndTimeFromStartMinutes(startTime, durationMinutes)
      
      const confirmedStart = createBookingDateTime(data.desired_date, startTime, true)
      const confirmedEnd = createBookingDateTime(data.desired_date, endTime, false, startTime)
      const durationSnapshot = resolvedDuration
        ? {
            duration_minutes: resolvedDuration.duration_minutes,
            duration_source: resolvedDuration.source,
            duration_rule_version: resolvedDuration.rule_version,
          }
        : undefined
      
      const insertData: TablesInsert<'booking_requests'> = {
        tenant_id: tenantId,
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone || null,
        booking_type: data.booking_type,
        event_type: data.event_type,
        desired_date: data.desired_date,
        desired_time: normalizedTime,
        num_guests: data.num_guests,
        special_requests: data.special_requests || null,
        menu_selection: data.menu_selection ? (data.menu_selection as unknown as Json) : null,
        menu_total_per_person: data.menu_total_per_person || null,
        menu_total_booking: data.menu_total_booking || null,
        preset_menu: data.preset_menu || null,
        dietary_restrictions: data.dietary_restrictions
          ? (data.dietary_restrictions as unknown as Json)
          : null,
        placement: features.servizio ? data.placement || null : null,
        menu_promo_labels:
          Array.isArray(data.menu_promo_labels) && data.menu_promo_labels.length > 0
            ? data.menu_promo_labels
            : null,
        booking_source: 'admin',
        status: 'accepted' as const,
        confirmed_start: confirmedStart,
        confirmed_end: confirmedEnd,
        ...durationSnapshot,
      }


      // Use authenticated supabase client (admin only)
      const { data: result, error } = await supabase
        .from('booking_requests')
        .insert(insertData)
        .select()
        .single()


      if (error) {
        logger.error('❌ [useCreateAdminBooking] Error:', error)
        throw new Error(error.message)
      }

      return result as unknown as BookingRequest
    },
    onSuccess: async () => {
      // Servizio legge unassigned/assignments da TABLE_ASSIGNMENTS_QUERY_KEY, non da `bookings`.
      await queryClient.invalidateQueries({
        queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId],
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      logger.error('Error creating admin booking:', error)
      toast.error('Errore nella creazione della prenotazione')
    }
  })
}
