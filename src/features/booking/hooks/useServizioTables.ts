import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export const TABLES_QUERY_KEY = 'servizio-tables'

export interface RestaurantTable {
  id: string
  tenant_id: string
  name: string
  capacity: number
  placement: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface TableInput {
  name: string
  capacity: number
  placement: string
}

export function useTables() {
  const { tenantId } = useTenantContext()

  return useQuery<RestaurantTable[]>({
    queryKey: [TABLES_QUERY_KEY, tenantId],
    enabled: Boolean(tenantId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant mancante')

      const { data, error } = await (supabase as any).from('tables')
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

export function useCreateTable() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: TableInput) => {
      if (!tenantId) throw new Error('Tenant mancante')

      const { data, error } = await (supabase as any).from('tables')
        .insert({
          tenant_id: tenantId,
          name: input.name.trim(),
          capacity: input.capacity,
          placement: input.placement,
        })
        .select('id')
        .single()

      if (error) {
        logger.error('[useServizioTables] useCreateTable', error)
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TABLES_QUERY_KEY] })
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

      const { error } = await (supabase as any).from('tables')
        .update({
          name: input.name.trim(),
          capacity: input.capacity,
          placement: input.placement,
        })
        .eq('id', id)
        .eq('tenant_id', tenantId)

      if (error) {
        logger.error('[useServizioTables] useUpdateTable', error)
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TABLES_QUERY_KEY] })
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

      const { error } = await (supabase as any).from('tables')
        .update({ active: false })
        .eq('id', id)
        .eq('tenant_id', tenantId)

      if (error) {
        logger.error('[useServizioTables] useDeleteTable', error)
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TABLES_QUERY_KEY] })
      toast.success('Tavolo rimosso')
    },
    onError: (e: Error) => {
      logger.error('[useServizioTables] useDeleteTable onError', e)
      toast.error(e.message || 'Errore rimozione tavolo')
    },
  })
}
