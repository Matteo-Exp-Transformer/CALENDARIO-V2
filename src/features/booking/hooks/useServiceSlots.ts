import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useTenantContext } from '@/contexts/TenantContext'
import { toast } from 'react-toastify'
import { logger } from '@/lib/logger'

export interface ServiceSlot {
  id: string
  tenant_id: string
  name: string
  start_time: string
  end_time: string
  max_turns: number | null
  display_order: number
  created_at: string
  updated_at: string
}

export const SERVICE_SLOTS_QUERY_KEY = 'service_slots'

/** end_time < start_time indica una fascia che attraversa la mezzanotte */
export function slotCrossesMidnight(slot: Pick<ServiceSlot, 'start_time' | 'end_time'>): boolean {
  return slot.end_time < slot.start_time
}

export function useServiceSlots() {
  const { tenantId } = useTenantContext()

  return useQuery({
    queryKey: [SERVICE_SLOTS_QUERY_KEY, tenantId],
    queryFn: async (): Promise<ServiceSlot[]> => {
      const { data, error } = await supabase
        .from('service_slots')
        .select('*')
        .eq('tenant_id', tenantId!)
        .order('display_order', { ascending: true })

      if (error) throw error
      return data as ServiceSlot[]
    },
    enabled: !!tenantId,
  })
}

export function useCreateServiceSlot() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (input: Omit<ServiceSlot, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('service_slots')
        .insert({ ...input, tenant_id: tenantId! })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICE_SLOTS_QUERY_KEY, tenantId] })
      toast.success('Fascia oraria creata')
    },
    onError: (error: Error) => {
      logger.error('[useCreateServiceSlot] error', error)
      toast.error(error.message || 'Errore nella creazione della fascia')
    },
  })
}

export function useUpdateServiceSlot() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<ServiceSlot> & { id: string }) => {
      const { data, error } = await supabase
        .from('service_slots')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('tenant_id', tenantId!)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICE_SLOTS_QUERY_KEY, tenantId] })
      toast.success('Fascia oraria aggiornata')
    },
    onError: (error: Error) => {
      logger.error('[useUpdateServiceSlot] error', error)
      toast.error(error.message || 'Errore nell\'aggiornamento della fascia')
    },
  })
}

export function useDeleteServiceSlot() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_slots')
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId!)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICE_SLOTS_QUERY_KEY, tenantId] })
      toast.success('Fascia oraria eliminata')
    },
    onError: (error: Error) => {
      logger.error('[useDeleteServiceSlot] error', error)
      toast.error(error.message || 'Errore nell\'eliminazione della fascia')
    },
  })
}
