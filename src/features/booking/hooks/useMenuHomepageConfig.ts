import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { supabasePublic } from '@/lib/supabasePublic'
import { useTenantContext } from '@/contexts/TenantContext'
import type { MenuHomepageConfig, MenuHomepageConfigInput, CarouselItem } from '@/types/menu'

const QUERY_KEY = 'menu-homepage-config'

function parseConfig(raw: Record<string, unknown>): MenuHomepageConfig {
  const carouselRaw = Array.isArray(raw.carousel_items) ? raw.carousel_items : []
  const carousel: CarouselItem[] = carouselRaw
    .filter((x): x is Record<string, unknown> => typeof x === 'object' && x !== null)
    .map((x) => ({
      image_url: String(x.image_url ?? ''),
      title: x.title != null ? String(x.title) : undefined,
      description: x.description != null ? String(x.description) : undefined,
      label: x.label != null ? String(x.label) : undefined,
      sort_order: typeof x.sort_order === 'number' ? x.sort_order : 0,
    }))
    .filter((x) => x.image_url)

  const catImagesRaw =
    typeof raw.category_images === 'object' && raw.category_images !== null && !Array.isArray(raw.category_images)
      ? (raw.category_images as Record<string, unknown>)
      : {}
  const categoryImages: Record<string, string> = {}
  for (const [k, v] of Object.entries(catImagesRaw)) {
    if (typeof v === 'string' && v) categoryImages[k] = v
  }

  return {
    id: String(raw.id),
    tenant_id: String(raw.tenant_id),
    carousel_items: carousel,
    category_images: categoryImages,
    theme_key: typeof raw.theme_key === 'string' ? raw.theme_key : 'mediterranean_teal',
    created_at: String(raw.created_at),
    updated_at: String(raw.updated_at),
  }
}

// ── Hook pubblico (usa supabasePublic) ────────────────────────────────────────

export function usePublicMenuHomepageConfig(tenantId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY, 'public', tenantId],
    queryFn: async (): Promise<MenuHomepageConfig | null> => {
      const { data, error } = await (supabasePublic
        .from('menu_homepage_config') as any)
        .select('*')
        .eq('tenant_id', tenantId)
        .maybeSingle()

      if (error || !data) return null
      return parseConfig(data as Record<string, unknown>)
    },
    enabled: !!tenantId,
  })
}

// ── Hook admin (usa supabase autenticato) ─────────────────────────────────────

export function useMenuHomepageConfig() {
  const { tenantId } = useTenantContext()
  return useQuery({
    queryKey: [QUERY_KEY, 'admin', tenantId],
    queryFn: async (): Promise<MenuHomepageConfig | null> => {
      const { data, error } = await (supabase
        .from('menu_homepage_config') as any)
        .select('*')
        .eq('tenant_id', tenantId)
        .maybeSingle()

      if (error || !data) return null
      return parseConfig(data as Record<string, unknown>)
    },
    enabled: !!tenantId,
  })
}

export function useUpsertMenuHomepageConfig() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: MenuHomepageConfigInput) => {
      const { error } = await (supabase
        .from('menu_homepage_config') as any)
        .upsert(
          {
            tenant_id: tenantId,
            carousel_items: input.carousel_items,
            category_images: input.category_images,
            theme_key: input.theme_key ?? 'mediterranean_teal',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'tenant_id' },
        )
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}
