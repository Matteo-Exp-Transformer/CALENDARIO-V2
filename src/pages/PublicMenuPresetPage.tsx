import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabasePublic } from '@/lib/supabasePublic'
import { usePublicMenuViewport } from '@/hooks/usePublicMenuViewport'
import type { MenuItem } from '@/types/menu'
import type { CustomStaffPreset } from '@/features/booking/constants/presetMenus'

function useTenantBySlug(slug: string | undefined) {
  const { setTenantFromSlug, tenantId, isLoading } = useTenantContext()
  useEffect(() => {
    if (slug) setTenantFromSlug(slug)
  }, [slug, setTenantFromSlug])
  return { tenantId, isLoading }
}

function usePublicPresetDetail(tenantId: string | null, presetId: string | undefined) {
  return useQuery({
    queryKey: ['public-preset-detail', tenantId, presetId],
    queryFn: async () => {
      const { data, error } = await (supabasePublic
        .from('restaurant_settings') as any)
        .select('value')
        .eq('tenant_id', tenantId)
        .eq('key', 'booking_custom_staff_presets')
        .single()

      if (error || !data) return null
      const all: CustomStaffPreset[] = Array.isArray(data.value) ? data.value : []
      return all.find((p) => p.id === presetId) ?? null
    },
    enabled: !!tenantId && !!presetId,
  })
}

function useMenuItemsByIds(tenantId: string | null, itemIds: string[]) {
  return useQuery({
    queryKey: ['public-menu-items-by-ids', tenantId, itemIds],
    queryFn: async () => {
      if (itemIds.length === 0) return []
      const { data, error } = await (supabasePublic
        .from('menu_items') as any)
        .select('id, name, description, price, image_url, sort_order, category')
        .eq('tenant_id', tenantId)
        .in('id', itemIds)

      if (error) throw error
      const ordered = itemIds
        .map((id) => (data as MenuItem[]).find((item) => item.id === id))
        .filter(Boolean) as MenuItem[]
      return ordered
    },
    enabled: !!tenantId && itemIds.length > 0,
  })
}

export function PublicMenuPresetPage() {
  usePublicMenuViewport()
  const { tenantSlug, shortCode, presetId } = useParams<{
    tenantSlug: string
    shortCode: string
    presetId: string
  }>()

  const { tenantId, isLoading: tenantLoading } = useTenantBySlug(tenantSlug)
  const { data: preset, isLoading: presetLoading } = usePublicPresetDetail(tenantId, presetId)
  const { data: items = [], isLoading: itemsLoading } = useMenuItemsByIds(
    tenantId,
    preset?.item_ids ?? [],
  )

  const backHref = `/menu/${tenantSlug}/qr/${shortCode}`
  const loading = tenantLoading || presetLoading || (!!preset && itemsLoading)

  return (
    <div className="min-h-svh bg-amber-50">
      <header className="sticky top-0 z-10 bg-amber-400 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to={backHref}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-950/10 text-amber-950 active:bg-amber-950/20"
            aria-label="Torna al menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-lg font-bold text-amber-950 leading-tight pr-9">
            {preset?.name ?? '…'}
          </h1>
        </div>
      </header>

      <main className="px-4 py-6">
        {loading && (
          <div className="py-16 text-center text-sm text-gray-500">Caricamento...</div>
        )}

        {!loading && !preset && (
          <div className="rounded-2xl bg-white px-4 py-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">Menù non trovato.</p>
          </div>
        )}

        {!loading && preset && (
          <div className="flex flex-col gap-4">
            {items.length === 0 ? (
              <div className="rounded-2xl bg-white px-4 py-10 text-center shadow-sm">
                <p className="text-sm text-gray-500">Menù in preparazione.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 shrink-0 text-sm font-bold text-amber-700 tabular-nums">
                        {idx + 1}.
                      </span>
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-gray-900 leading-snug">
                          {item.name}
                        </p>
                        {item.description?.trim() && (
                          <p className="mt-0.5 text-sm text-gray-500 leading-snug">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 text-base font-bold text-amber-700">
                      €{item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
