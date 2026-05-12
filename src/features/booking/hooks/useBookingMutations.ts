import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, handleSupabaseError } from '@/lib/supabase'
import type { BookingRequest, BookingType } from '@/types/booking'
import { toast } from 'react-toastify'
import {
  sendBookingAcceptedEmail,
  sendBookingRejectedEmail,
  areEmailNotificationsEnabled,
} from './useEmailNotifications'
import { ANALYTICS_QUERY_ROOT } from './useAnalytics'
import { useTenantContext } from '@/contexts/TenantContext'

interface AcceptBookingInput {
  bookingId: string
  confirmedStart: string
  confirmedEnd: string
  desiredTime?: string
  numGuests?: number
  internalNotes?: string
}

interface RejectBookingInput {
  bookingId: string
  rejectionReason?: string
}

interface UpdateBookingInput {
  bookingId: string
  booking_type?: BookingType
  client_name?: string
  client_email?: string | null
  client_phone?: string | null
  confirmedStart: string
  confirmedEnd: string
  numGuests: number
  specialRequests?: string | null
  desiredTime?: string
  menu_selection?: any
  menu_total_per_person?: number
  menu_total_booking?: number
  dietary_restrictions?: any[]
  preset_menu?: string
  menu?: string
  placement?: string | null
}

// Mutation per accettare una prenotazione
export const useAcceptBooking = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (input: AcceptBookingInput) => {
      const updateData: any = {
        status: 'accepted',
        confirmed_start: input.confirmedStart,
        confirmed_end: input.confirmedEnd,
        num_guests: input.numGuests,
        updated_at: new Date().toISOString(),
      }

      if (input.desiredTime !== undefined) {
        updateData.desired_time = input.desiredTime
      }

      const { data, error } = await (supabase
        .from('booking_requests') as any)
        .update(updateData as any)
        .eq('id', input.bookingId)
        .eq('tenant_id', tenantId!)
        .select()
        .single()

      if (error) {
        throw new Error(handleSupabaseError(error))
      }

      return data as BookingRequest
    },
    onSuccess: async (booking: BookingRequest) => {
      // Invalida tutte le queries per refresh automatico completo
      // This will refresh the calendar automatically
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookings'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['bookings', 'pending'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['bookings', 'accepted'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['bookings', 'stats'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: [ANALYTICS_QUERY_ROOT, tenantId], refetchType: 'all' }),
      ])

      // Send email notification
      const emailEnabled = areEmailNotificationsEnabled()
      
      if (emailEnabled) {
        try {
          await sendBookingAcceptedEmail(booking)
        } catch (error) {
          console.warn('[useAcceptBooking] Email opzionale non inviata:', error)
        }
      } else {
      }
    },
    onError: (error: Error) => {
      console.error('❌ [useAcceptBooking] Mutation error:', error)
      // Toast error già gestito nel componente
    },
  })
}

// Mutation per rifiutare una prenotazione
export const useRejectBooking = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (input: RejectBookingInput) => {
      const { data, error } = await (supabase
        .from('booking_requests') as any)
        .update({
          status: 'rejected',
          rejection_reason: input.rejectionReason || null,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', input.bookingId)
        .eq('tenant_id', tenantId!)
        .select()
        .single()

      if (error) {
        throw new Error(handleSupabaseError(error))
      }

      return data as BookingRequest
    },
    onSuccess: async (booking: BookingRequest) => {
      // Invalida tutte le queries per refresh automatico completo
      // This will refresh the calendar automatically
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookings'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['bookings', 'pending'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['bookings', 'accepted'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['bookings', 'stats'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: [ANALYTICS_QUERY_ROOT, tenantId], refetchType: 'all' }),
      ])
      
      // Send email notification
      if (areEmailNotificationsEnabled()) {
        try {
          await sendBookingRejectedEmail(booking)
        } catch (error) {
          console.warn('[useRejectBooking] Email opzionale non inviata:', error)
        }
      }
    },
    onError: (error: Error) => {
      console.error('❌ [useRejectBooking] Mutation error:', error)
      // Toast error già gestito nel componente
    },
  })
}

// Mutation per aggiornare una prenotazione
export const useUpdateBooking = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (input: UpdateBookingInput) => {
      
      const updateData: any = {
        updated_at: new Date().toISOString(),
        confirmed_start: input.confirmedStart,
        confirmed_end: input.confirmedEnd,
        num_guests: input.numGuests,
      }

      // Update client information if provided
      if (input.client_name !== undefined) {
        updateData.client_name = input.client_name
      }
      if (input.client_email !== undefined) {
        // DB: client_email è NOT NULL (default ''). Non inviare mai null.
        const raw = input.client_email === null || input.client_email === undefined
          ? ''
          : String(input.client_email).trim()
        updateData.client_email = raw
      }
      if (input.client_phone !== undefined) {
        updateData.client_phone = input.client_phone || null
      }

      // Update booking type if provided
      if (input.booking_type !== undefined) {
        updateData.booking_type = input.booking_type
      }

      // Update desired_time if provided
      if (input.desiredTime !== undefined) {
        updateData.desired_time = input.desiredTime || null
      }

      // Update special requests if provided
      if (input.specialRequests !== undefined) {
        updateData.special_requests = input.specialRequests || null
      }
      
      // Update menu fields if provided
      if (input.menu !== undefined) {
        updateData.menu = input.menu || null
      }
      if (input.menu_selection !== undefined) {
        updateData.menu_selection = input.menu_selection || null
      }
      if (input.menu_total_per_person !== undefined) {
        updateData.menu_total_per_person = input.menu_total_per_person || null
      }
      if (input.menu_total_booking !== undefined) {
        updateData.menu_total_booking = input.menu_total_booking || null
      }
      if (input.dietary_restrictions !== undefined) {
        updateData.dietary_restrictions = input.dietary_restrictions || null
      }
      if (input.preset_menu !== undefined) {
        updateData.preset_menu = input.preset_menu || null
      }

      // Update placement if provided
      if (input.placement !== undefined) {
        updateData.placement = input.placement || null
      }


      const { data, error } = await (supabase
        .from('booking_requests') as any)
        .update(updateData as any)
        .eq('id', input.bookingId)
        .eq('tenant_id', tenantId!)
        .select()
        .single()

      if (error) {
        console.error('❌ [useUpdateBooking] Error:', error)
        throw new Error(handleSupabaseError(error))
      }

      return data as BookingRequest
    },
    onSuccess: async (data) => {
      
      // Aggiorna direttamente la cache con i dati aggiornati per tutte le query che potrebbero contenere questa prenotazione
      // Usa un approccio sicuro che gestisce diversi formati di dati nella cache
      queryClient.setQueriesData(
        { queryKey: ['bookings'] },
        (oldData: any) => {
          if (!oldData) return oldData
          // Verifica che oldData sia un array
          if (Array.isArray(oldData)) {
            return oldData.map((booking: BookingRequest) => 
              booking.id === data.id ? data : booking
            )
          }
          // Se non è un array, restituisci i dati originali (potrebbe essere un oggetto o altro formato)
          return oldData
        }
      )
      
      queryClient.setQueriesData(
        { queryKey: ['bookings', 'pending'] },
        (oldData: any) => {
          if (!oldData) return oldData
          if (Array.isArray(oldData)) {
            return oldData.map((booking: BookingRequest) => 
              booking.id === data.id ? data : booking
            )
          }
          return oldData
        }
      )
      
      queryClient.setQueriesData(
        { queryKey: ['bookings', 'accepted'] },
        (oldData: any) => {
          if (!oldData) return oldData
          if (Array.isArray(oldData)) {
            return oldData.map((booking: BookingRequest) => 
              booking.id === data.id ? data : booking
            )
          }
          return oldData
        }
      )
      
      // Invalida anche le query per forzare un refetch e assicurarsi che tutto sia sincronizzato
      await queryClient.invalidateQueries({ queryKey: ['bookings'] })
      await queryClient.invalidateQueries({ queryKey: ['bookings', 'pending'] })
      await queryClient.invalidateQueries({ queryKey: ['bookings', 'accepted'] })
      await queryClient.invalidateQueries({ queryKey: [ANALYTICS_QUERY_ROOT, tenantId] })
      toast.success('Prenotazione aggiornata con successo!')
    },
    onError: (error: Error) => {
      console.error('❌ [useUpdateBooking] onError:', error)
      toast.error(error.message || 'Errore nell\'aggiornamento della prenotazione')
    },
  })
}

// Mutation per ripristinare una prenotazione eliminata
export const useRestoreBooking = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data: bookingToRestore, error: fetchError } = await (supabase
        .from('booking_requests') as any)
        .select('id, confirmed_start, confirmed_end')
        .eq('id', bookingId)
        .eq('tenant_id', tenantId!)
        .single()

      if (fetchError) {
        throw new Error(handleSupabaseError(fetchError))
      }

      if (!bookingToRestore?.confirmed_start || !bookingToRestore?.confirmed_end) {
        throw new Error('Impossibile reinserire: mancano orario di inizio/fine confermati.')
      }

      const { data, error } = await (supabase
        .from('booking_requests') as any)
        .update({
          status: 'accepted',
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', bookingId)
        .eq('tenant_id', tenantId!)
        .select()
        .single()

      if (error) {
        console.error('❌ [useRestoreBooking] Error:', error)
        throw new Error(handleSupabaseError(error))
      }

      return data as BookingRequest
    },
    onSuccess: async () => {
      // Invalida tutte le queries per refresh automatico completo
      await queryClient.invalidateQueries({ queryKey: ['bookings'] })
      await queryClient.invalidateQueries({ queryKey: ['bookings', 'pending'] })
      await queryClient.invalidateQueries({ queryKey: ['bookings', 'accepted'] })
      await queryClient.invalidateQueries({ queryKey: [ANALYTICS_QUERY_ROOT, tenantId] })
      toast.success('Prenotazione reinserita con successo!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Errore nel reinserimento della prenotazione')
    },
  })
}

/** Rifiutata → pending (sezione richieste in attesa), senza reinserimento in calendario. */
export const useRequeueRejectedBooking = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await (supabase
        .from('booking_requests') as any)
        .update({
          status: 'pending',
          rejection_reason: null,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', bookingId)
        .eq('tenant_id', tenantId!)
        .eq('status', 'rejected')
        .select()
        .single()

      if (error) {
        throw new Error(handleSupabaseError(error))
      }

      return data as BookingRequest
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookings'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['bookings', 'pending'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['bookings', 'accepted'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['bookings', 'stats'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: [ANALYTICS_QUERY_ROOT, tenantId], refetchType: 'all' }),
      ])
      toast.success('Prenotazione riportata tra le richieste in attesa')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Impossibile riportare la prenotazione in attesa')
    },
  })
}

// Mutation per cancellare una prenotazione
export const useCancelBooking = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async ({ bookingId, cancellationReason }: { bookingId: string; cancellationReason?: string }) => {

      const { data, error } = await (supabase
        .from('booking_requests') as any)
        .update({
          status: 'deleted',
          cancellation_reason: cancellationReason || null,
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', bookingId)
        .eq('tenant_id', tenantId!)
        .select()
        .single()

      if (error) {
        console.error('❌ [useCancelBooking] Error:', error)
        throw new Error(handleSupabaseError(error))
      }

      return data as BookingRequest
    },
    onSuccess: async () => {
      // Invalida tutte le queries per refresh automatico completo
      await queryClient.invalidateQueries({ queryKey: ['bookings'] })
      await queryClient.invalidateQueries({ queryKey: ['bookings', 'pending'] })
      await queryClient.invalidateQueries({ queryKey: ['bookings', 'accepted'] })
      await queryClient.invalidateQueries({ queryKey: [ANALYTICS_QUERY_ROOT, tenantId] })
      toast.success('Prenotazione cancellata con successo!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Errore nella cancellazione della prenotazione')
    },
  })
}

