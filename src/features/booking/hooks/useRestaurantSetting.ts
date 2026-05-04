import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase, handleSupabaseError } from '@/lib/supabase'
import { useTenantContext } from '@/contexts/TenantContext'
import { toast } from 'react-toastify'
import {
  restaurantSettingRegistry,
  type RestaurantSettingKeyV1,
  type RestaurantSettingValueMap,
} from '@/features/booking/lib/restaurantSettingRegistry'

export function useRestaurantSetting<K extends RestaurantSettingKeyV1>(key: K) {
  const { tenantId } = useTenantContext()

  return useQuery({
    queryKey: ['restaurant_settings', key, tenantId],
    queryFn: async (): Promise<RestaurantSettingValueMap[K]> => {
      const { data, error } = await (supabase
        .from('restaurant_settings') as any)
        .select('setting_value')
        .eq('tenant_id', tenantId!)
        .eq('setting_key', key)
        .maybeSingle()

      if (error) {
        throw new Error(handleSupabaseError(error))
      }

      return restaurantSettingRegistry[key].parseFromDb(data?.setting_value) as RestaurantSettingValueMap[K]
    },
    enabled: !!tenantId,
  })
}

export type UpsertRestaurantSettingItem = {
  key: RestaurantSettingKeyV1
  value: unknown
}

/**
 * Upsert una o più righe `restaurant_settings` (stesso tenant). Dopo il successo invalida
 * le query pubbliche/admin sugli stessi prefissi definiti nel piano.
 */
export function useUpsertRestaurantSetting() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (items: UpsertRestaurantSettingItem[]) => {
      if (!tenantId) {
        throw new Error('Tenant non disponibile')
      }

      const rows = items.map(({ key, value }) => {
        const reg = restaurantSettingRegistry[key]
        const err = reg.validate(value)
        if (err) {
          throw new Error(`${key}: ${err}`)
        }
        return {
          tenant_id: tenantId,
          setting_key: key,
          setting_value: reg.serializeToDb(value as never),
        }
      })

      const { error } = await (supabase.from('restaurant_settings') as any).upsert(rows, {
        onConflict: 'tenant_id,setting_key',
      })

      if (error) {
        throw new Error(handleSupabaseError(error))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant_settings'], refetchType: 'active' })
      if (tenantId) {
        queryClient.invalidateQueries({
          queryKey: ['restaurant_settings', 'business_hours', tenantId],
          refetchType: 'active',
        })
      }
      toast.success('Impostazioni salvate')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Errore nel salvataggio')
    },
  })
}
