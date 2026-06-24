import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { TABLES_QUERY_KEY } from './useServizioTables'
import { TABLE_ASSIGNMENTS_QUERY_KEY } from './useTableAssignments'

export const ROOMS_QUERY_KEY = 'rooms'
export const ROOM_LIVE_BOOKINGS_QUERY_KEY = 'room_live_bookings'

export interface Room {
  id: string
  tenant_id: string
  name: string
  width: number
  height: number
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface RoomInput {
  name: string
  width: number
  height: number
  display_order?: number
}

export function useRooms() {
  const { tenantId } = useTenantContext()

  return useQuery<Room[]>({
    queryKey: [ROOMS_QUERY_KEY, tenantId],
    enabled: Boolean(tenantId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant mancante')

      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('active', true)
        .order('display_order', { ascending: true })
        .order('name', { ascending: true })

      if (error) {
        logger.error('[useRooms] useRooms', error)
        throw new Error(error.message)
      }

      return (data ?? []) as Room[]
    },
  })
}

/**
 * Conta il numero di prenotazioni distinte assegnate ai tavoli di una sala
 * e non ancora checkat (checked_out_at IS NULL).
 * "Sala viva" = liveCount > 0.
 */
export function useRoomLiveBookings(roomId: string | null) {
  const { tenantId } = useTenantContext()

  return useQuery<number>({
    queryKey: [ROOM_LIVE_BOOKINGS_QUERY_KEY, tenantId, roomId],
    enabled: Boolean(tenantId) && Boolean(roomId),
    staleTime: 30 * 1000,
    queryFn: async () => {
      if (!tenantId || !roomId) return 0

      // 1. Recupera i tavoli della sala
      const { data: tables, error: tablesError } = await supabase
        .from('tables')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('room_id', roomId)

      if (tablesError) {
        logger.error('[useRooms] useRoomLiveBookings tables', tablesError)
        throw new Error(tablesError.message)
      }

      const tableIds = (tables ?? []).map((t: { id: string }) => t.id)
      if (tableIds.length === 0) return 0

      // 2. Conta i booking_id distinti con assignment attivo (checked_out_at IS NULL)
      const { data: assignments, error: assignError } = await supabase
        .from('booking_table_assignments')
        .select('booking_id')
        .eq('tenant_id', tenantId)
        .in('table_id', tableIds)
        .is('checked_out_at', null)

      if (assignError) {
        logger.error('[useRooms] useRoomLiveBookings assignments', assignError)
        throw new Error(assignError.message)
      }

      const distinctBookings = new Set(
        (assignments ?? []).map((a: { booking_id: string }) => a.booking_id),
      )
      return distinctBookings.size
    },
  })
}

export function useCreateRoom() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RoomInput) => {
      if (!tenantId) throw new Error('Tenant mancante')

      const { data, error } = await supabase
        .from('rooms')
        .insert({
          tenant_id: tenantId,
          name: input.name.trim(),
          width: input.width,
          height: input.height,
          display_order: input.display_order ?? 0,
        })
        .select('id')
        .single()

      if (error) {
        logger.error('[useRooms] useCreateRoom', error)
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [ROOMS_QUERY_KEY, tenantId] })
      toast.success('Sala aggiunta')
    },
    onError: (e: Error) => {
      logger.error('[useRooms] useCreateRoom onError', e)
      toast.error(e.message || 'Errore aggiunta sala')
    },
  })
}

export function useUpdateRoom() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: RoomInput }) => {
      if (!tenantId) throw new Error('Tenant mancante')

      const { error } = await supabase
        .from('rooms')
        .update({
          name: input.name.trim(),
          width: input.width,
          height: input.height,
          display_order: input.display_order ?? 0,
        })
        .eq('id', id)
        .eq('tenant_id', tenantId)

      if (error) {
        logger.error('[useRooms] useUpdateRoom', error)
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [ROOMS_QUERY_KEY, tenantId] })
      toast.success('Sala aggiornata')
    },
    onError: (e: Error) => {
      logger.error('[useRooms] useUpdateRoom onError', e)
      toast.error(e.message || 'Errore aggiornamento sala')
    },
  })
}

export function useDeleteRoom() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (roomId: string) => {
      if (!tenantId) throw new Error('Tenant mancante')

      // 1. Recupera i tavoli della sala
      const { data: tables, error: tablesError } = await supabase
        .from('tables')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('room_id', roomId)

      if (tablesError) {
        logger.error('[useRooms] useDeleteRoom tables', tablesError)
        throw new Error(tablesError.message)
      }

      const tableIds = (tables ?? []).map((t: { id: string }) => t.id)

      // 2. Se ci sono tavoli, timbra checked_out_at sugli assignment attivi (release cassetto)
      if (tableIds.length > 0) {
        const { data: activeAssignments, error: assignError } = await supabase
          .from('booking_table_assignments')
          .select('id')
          .eq('tenant_id', tenantId)
          .in('table_id', tableIds)
          .is('checked_out_at', null)

        if (assignError) {
          logger.error('[useRooms] useDeleteRoom assignments', assignError)
          throw new Error(assignError.message)
        }

        const assignmentIds = (activeAssignments ?? []).map((a: { id: string }) => a.id)

        if (assignmentIds.length > 0) {
          const { error: releaseError } = await supabase
            .from('booking_table_assignments')
            .update({ checked_out_at: new Date().toISOString() })
            .in('id', assignmentIds)
            .eq('tenant_id', tenantId)

          if (releaseError) {
            logger.error('[useRooms] useDeleteRoom release', releaseError)
            throw new Error(releaseError.message)
          }
        }
      }

      // 3. Archivia la sala (soft-delete)
      const { error: archiveError } = await supabase
        .from('rooms')
        .update({ active: false })
        .eq('id', roomId)
        .eq('tenant_id', tenantId)

      if (archiveError) {
        logger.error('[useRooms] useDeleteRoom archive', archiveError)
        throw new Error(archiveError.message)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [ROOMS_QUERY_KEY, tenantId] })
      void queryClient.invalidateQueries({ queryKey: [TABLES_QUERY_KEY, tenantId] })
      void queryClient.invalidateQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId] })
      toast.success('Sala archiviata')
    },
    onError: (e: Error) => {
      logger.error('[useRooms] useDeleteRoom onError', e)
      toast.error(e.message || 'Errore archiviazione sala')
    },
  })
}
