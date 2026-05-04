import { useQuery } from '@tanstack/react-query'
import { supabasePublic } from '@/lib/supabasePublic'
import { useTenantContext } from '@/contexts/TenantContext'

/**
 * Legge `restaurant_name` da restaurant_settings (anon) per il tenant corrente.
 * Fallback a `organizationName` (tabella organizations) se la riga non esiste o è vuota.
 */
export const useRestaurantName = (): string | null => {
  const { tenantId, organizationName } = useTenantContext()

  const { data } = useQuery({
    queryKey: ['restaurant_settings', 'restaurant_name', tenantId],
    queryFn: async (): Promise<string | null> => {
      const { data, error } = await (supabasePublic
        .from('restaurant_settings') as any)
        .select('setting_value')
        .eq('setting_key', 'restaurant_name')
        .eq('tenant_id', tenantId)
        .maybeSingle()

      if (error || !data) return null

      const raw = (data as any).setting_value
      if (typeof raw === 'string') return raw.trim() || null
      if (typeof raw === 'number' || typeof raw === 'boolean') return String(raw)
      return null
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })

  return (data && data.length > 0 ? data : null) ?? organizationName
}
