import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { toast } from 'react-toastify'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { TABLE_ASSIGNMENTS_QUERY_KEY } from '@/features/booking/hooks/useTableAssignments'

export const TABLES_QUERY_KEY = 'servizio-tables'
export const TABLE_LIVE_BOOKINGS_QUERY_KEY = 'table_live_bookings'

/**
 * Messaggio amichevole per la violazione dell'indice unico case/spazi-insensitive
 * (migrazione 068, `tables_tenant_active_name_lower_idx`) — seconda barriera dietro
 * `hasDuplicateTableName()` (TableFormModal.tsx). Il check client-side normalmente intercetta
 * prima, ma una race fra due admin o una scrittura diretta può arrivare fino al DB: qui si
 * sostituisce il messaggio Postgres grezzo (`duplicate key value violates unique constraint...`)
 * con lo stesso testo già usato dal controllo lato client.
 */
const DUPLICATE_TABLE_NAME_MESSAGE = 'Esiste già un tavolo con questo nome.'

function isUniqueTableNameViolation(error: { code?: string }): boolean {
  return error.code === '23505'
}

export interface RestaurantTable {
  id: string
  tenant_id: string
  name: string
  capacity: number
  placement: string
  active: boolean
  room_id: string | null
  position_x: number
  position_y: number
  shape: 'round' | 'square' | 'rect'
  created_at: string
  updated_at: string
}

export interface TableInput {
  name: string
  capacity: number
  placement: string
  room_id: string
  position_x?: number
  position_y?: number
  shape?: 'round' | 'square' | 'rect'
}

export function useTables() {
  const { tenantId } = useTenantContext()

  return useQuery<RestaurantTable[]>({
    queryKey: [TABLES_QUERY_KEY, tenantId],
    enabled: Boolean(tenantId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant mancante')

      const { data, error } = await supabase.from('tables')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('active', true)
        .order('placement', { ascending: true })
        .order('name', { ascending: true })

      if (error) {
        logger.error('[useServizioTables] useTables', error)
        throw new Error(error.message)
      }

      return (data ?? []) as RestaurantTable[]
    },
  })
}

/**
 * Conta le prenotazioni distinte assegnate a UN tavolo, non ancora liberate
 * (checked_out_at IS NULL). "Tavolo vivo" = liveCount > 0.
 *
 * FIX B (03-08-26, D-A): stesso pattern di useRoomLiveBookings (useRooms.ts), ma
 * filtrato su un solo table_id invece che su tutti i tavoli di una sala — serve alla
 * conferma con impatto quantificato prima di eliminare un tavolo occupato.
 */
export function useTableLiveBookings(tableId: string | null) {
  const { tenantId } = useTenantContext()

  return useQuery<number>({
    queryKey: [TABLE_LIVE_BOOKINGS_QUERY_KEY, tenantId, tableId],
    enabled: Boolean(tenantId) && Boolean(tableId),
    staleTime: 30 * 1000,
    queryFn: async () => {
      if (!tenantId || !tableId) return 0

      const { data: assignments, error } = await supabase
        .from('booking_table_assignments')
        .select('booking_id')
        .eq('tenant_id', tenantId)
        .eq('table_id', tableId)
        .is('checked_out_at', null)

      if (error) {
        logger.error('[useServizioTables] useTableLiveBookings', error)
        throw new Error(error.message)
      }

      const distinctBookings = new Set(
        (assignments ?? []).map((a: { booking_id: string }) => a.booking_id),
      )
      return distinctBookings.size
    },
  })
}

export function useCreateTable() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: TableInput) => {
      if (!tenantId) throw new Error('Tenant mancante')

      const { data, error } = await supabase.from('tables')
        .insert({
          tenant_id: tenantId,
          name: input.name.trim(),
          capacity: input.capacity,
          placement: input.placement,
          room_id: input.room_id,
          shape: input.shape ?? 'square',
        })
        .select('id')
        .single()

      if (error) {
        logger.error('[useServizioTables] useCreateTable', error)
        throw new Error(isUniqueTableNameViolation(error) ? DUPLICATE_TABLE_NAME_MESSAGE : error.message)
      }

      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TABLES_QUERY_KEY, tenantId] })
      toast.success('Tavolo aggiunto')
    },
    onError: (e: Error) => {
      logger.error('[useServizioTables] useCreateTable onError', e)
      toast.error(e.message || 'Errore aggiunta tavolo')
    },
  })
}

export function useUpdateTable() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: TableInput }) => {
      if (!tenantId) throw new Error('Tenant mancante')

      const { error } = await supabase.from('tables')
        .update({
          name: input.name.trim(),
          capacity: input.capacity,
          placement: input.placement,
          room_id: input.room_id,
        })
        .eq('id', id)
        .eq('tenant_id', tenantId)

      if (error) {
        logger.error('[useServizioTables] useUpdateTable', error)
        throw new Error(isUniqueTableNameViolation(error) ? DUPLICATE_TABLE_NAME_MESSAGE : error.message)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TABLES_QUERY_KEY, tenantId] })
      toast.success('Tavolo aggiornato')
    },
    onError: (e: Error) => {
      logger.error('[useServizioTables] useUpdateTable onError', e)
      toast.error(e.message || 'Errore aggiornamento tavolo')
    },
  })
}

export function useDeleteTable() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!tenantId) throw new Error('Tenant mancante')

      // FIX B (03-08-26, D-A/S-2): un tavolo occupato non deve più sparire sotto il
      // cliente. Prima di disattivare il tavolo, le righe di assegnazione ATTIVE su
      // QUESTO tavolo (solo questo: una tavolata su più tavoli non deve toccare gli
      // altri) vengono cancellate FISICAMENTE, non timbrate — la prenotazione non è
      // stata servita, non deve consumare un turno né essere archiviata. Stesso
      // principio già in uso per useUndoTableAssignment/useReleaseBookingAssignment
      // (FIX A). Non chiamiamo markBookingServedIfFullyReleased: la prenotazione torna
      // semplicemente nel cassetto «da assegnare», riassegnabile.
      const { data: activeAssignments, error: assignError } = await supabase
        .from('booking_table_assignments')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('table_id', id)
        .is('checked_out_at', null)

      if (assignError) {
        logger.error('[useServizioTables] useDeleteTable assignments', assignError)
        throw new Error(assignError.message)
      }

      const assignmentIds = (activeAssignments ?? []).map((a: { id: string }) => a.id)

      if (assignmentIds.length > 0) {
        const { error: releaseError } = await supabase
          .from('booking_table_assignments')
          .delete()
          .in('id', assignmentIds)
          .eq('tenant_id', tenantId)

        if (releaseError) {
          logger.error('[useServizioTables] useDeleteTable release', releaseError)
          throw new Error(releaseError.message)
        }
      }

      const { error } = await supabase.from('tables')
        .update({ active: false })
        .eq('id', id)
        .eq('tenant_id', tenantId)

      if (error) {
        logger.error('[useServizioTables] useDeleteTable', error)
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TABLES_QUERY_KEY, tenantId] })
      void queryClient.invalidateQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId] })
      void queryClient.invalidateQueries({ queryKey: [TABLE_LIVE_BOOKINGS_QUERY_KEY, tenantId] })
      toast.success('Tavolo rimosso')
    },
    onError: (e: Error) => {
      logger.error('[useServizioTables] useDeleteTable onError', e)
      toast.error(e.message || 'Errore rimozione tavolo')
    },
  })
}

/**
 * Aggiorna la posizione di un tavolo nella mappa con debounce 300ms.
 * Il debounce è gestito con un ref al timer per evitare re-render inutili.
 * Non mostra toast: il drag è un'operazione frequente e silenziosa.
 */
export function useUpdateTablePosition() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mutation = useMutation({
    mutationFn: async ({ id, x, y }: { id: string; x: number; y: number }) => {
      if (!tenantId) throw new Error('Tenant mancante')

      const { error } = await supabase.from('tables')
        .update({ position_x: x, position_y: y })
        .eq('id', id)
        .eq('tenant_id', tenantId)

      if (error) {
        logger.error('[useServizioTables] useUpdateTablePosition', error)
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TABLES_QUERY_KEY, tenantId] })
    },
    onError: (e: Error) => {
      logger.error('[useServizioTables] useUpdateTablePosition onError', e)
      toast.error(e.message || 'Errore salvataggio posizione tavolo')
    },
  })

  function debouncedUpdate(id: string, x: number, y: number) {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      mutation.mutate({ id, x, y })
    }, 300)
  }

  return { debouncedUpdate, isPending: mutation.isPending }
}
