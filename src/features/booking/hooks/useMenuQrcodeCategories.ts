import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { supabasePublic } from '@/lib/supabasePublic'
import { useTenantContext } from '@/contexts/TenantContext'
import { handleSupabaseError } from '@/lib/supabase'
import type { MenuQrcodeCategoryOverride, MenuQrcodeCategoryOverrideInput } from '@/types/menu'

const QUERY_KEY = 'menu-qrcode-categories'

function parseOverride(raw: Record<string, unknown>): MenuQrcodeCategoryOverride {
  return {
    id: String(raw.id),
    tenant_id: String(raw.tenant_id),
    category_key: String(raw.category_key),
    title: raw.title != null ? String(raw.title) : null,
    description: raw.description != null ? String(raw.description) : null,
    created_at: String(raw.created_at),
    updated_at: String(raw.updated_at),
  }
}

/** Lettura pubblica — usato in PublicMenuPage */
export function usePublicMenuQrcodeCategories(tenantId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY, 'public', tenantId],
    queryFn: async (): Promise<MenuQrcodeCategoryOverride[]> => {
      const { data, error } = await (supabasePublic
        .from('menu_qrcode_categories') as any)
        .select('*')
        .eq('tenant_id', tenantId)

      if (error || !data) return []
      return (data as Record<string, unknown>[]).map(parseOverride)
    },
    enabled: !!tenantId,
  })
}

/** Lettura admin */
export function useMenuQrcodeCategories() {
  const { tenantId } = useTenantContext()
  return useQuery({
    queryKey: [QUERY_KEY, 'admin', tenantId],
    queryFn: async (): Promise<MenuQrcodeCategoryOverride[]> => {
      const { data, error } = await (supabase
        .from('menu_qrcode_categories') as any)
        .select('*')
        .eq('tenant_id', tenantId)

      if (error || !data) return []
      return (data as Record<string, unknown>[]).map(parseOverride)
    },
    enabled: !!tenantId,
  })
}

/** Upsert singolo override categoria (per admin) */
export function useUpsertMenuQrcodeCategory() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: MenuQrcodeCategoryOverrideInput) => {
      const { error } = await (supabase
        .from('menu_qrcode_categories') as any)
        .upsert(
          {
            tenant_id: tenantId,
            category_key: input.category_key,
            title: input.title ?? null,
            description: input.description ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'tenant_id,category_key' },
        )
      if (error) throw new Error(handleSupabaseError(error))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: (error: Error) => {
      void error
    },
  })
}
