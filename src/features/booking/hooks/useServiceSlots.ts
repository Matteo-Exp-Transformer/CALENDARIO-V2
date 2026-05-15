import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useTenantContext } from '@/contexts/TenantContext'
import { toast } from 'react-toastify'
import { logger } from '@/lib/logger'
import {
  toBookingTimeSlots,
  slotCrossesMidnight,
  type BookingTimeSlots,
} from '@/features/booking/utils/bookingTimeSlots'

export { slotCrossesMidnight }

export interface ServiceSlot {
  id: string
  tenant_id: string
  name: string
  start_time: string
  end_time: string
  max_turns: number | null
  max_guests: number | null
  display_order: number
  // is_canonical è managed dal DB (migration 016) — non incluso nei payload insert/update
  is_canonical: boolean
  created_at: string
  updated_at: string
}

type ServiceSlotInsert = Omit<ServiceSlot, 'id' | 'tenant_id' | 'created_at' | 'updated_at' | 'is_canonical'>
type ServiceSlotUpdate = Partial<Omit<ServiceSlot, 'is_canonical'>> & { id: string }

export const SERVICE_SLOTS_QUERY_KEY = 'service_slots'

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
    mutationFn: async (input: ServiceSlotInsert) => {
      // biome-ignore lint: RPC non ancora nei tipi generati (migration 018 applicata via MCP)
      const { data, error } = await (supabase as any)
        .rpc('insert_service_slot', {
          p_tenant_id:     tenantId!,
          p_name:          input.name,
          p_start_time:    input.start_time,
          p_end_time:      input.end_time,
          p_max_turns:     input.max_turns ?? null,
          p_max_guests:    input.max_guests ?? null,
          p_display_order: input.display_order,
        })

      if (error) throw error
      return (data as unknown as ServiceSlot[])[0]
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
    mutationFn: async ({ id, ...patch }: ServiceSlotUpdate) => {
      // RPC bypassa la schema cache PostgREST (colonne 016/017 non ancora nel cache).
      // Passa solo i campi presenti nel patch — NULL = mantieni valore esistente.
      // 'max_guests' in patch con valore null significa azzeramento esplicito.
      const clearMaxGuests = 'max_guests' in patch && patch.max_guests === null
      // biome-ignore lint: RPC non ancora nei tipi generati (migration 018 applicata via MCP)
      const { data, error } = await (supabase as any)
        .rpc('update_service_slot', {
          p_id:               id,
          p_tenant_id:        tenantId!,
          p_name:             patch.name             ?? null,
          p_start_time:       patch.start_time       ?? null,
          p_end_time:         patch.end_time         ?? null,
          p_max_turns:        patch.max_turns        !== undefined ? patch.max_turns : null,
          p_max_guests:       clearMaxGuests ? null : (patch.max_guests ?? null),
          p_display_order:    patch.display_order    ?? null,
          p_clear_max_guests: clearMaxGuests,
        })

      if (error) throw error
      return (data as unknown as ServiceSlot[])[0]
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

/**
 * Restituisce le 3 fasce canoniche (Colazione/Pranzo/Cena) già convertite
 * nel formato BookingTimeSlots usato da calendario, capacity e pending.
 */
export function useCanonicalTimeSlots(): {
  data: BookingTimeSlots
  isLoading: boolean
  error: Error | null
} {
  const { tenantId } = useTenantContext()

  const query = useQuery({
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

  const canonicalSlots = (query.data ?? []).filter((s) => s.is_canonical)

  return {
    data: toBookingTimeSlots(canonicalSlots),
    isLoading: query.isLoading,
    error: query.error as Error | null,
  }
}
