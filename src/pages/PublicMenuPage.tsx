import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabasePublic } from '@/lib/supabasePublic'
import { usePublicMenuQr, usePublicDefaultMenuQr } from '@/features/booking/hooks/useMenuQrCodes'
import type { MenuCategoryRecord } from '@/features/booking/hooks/useMenuCategories'
import type { MenuQrCode } from '@/types/menu'
import { PublicMenuPageHeader } from '@/features/booking/components/PublicMenuPageHeader'
import { usePublicMenuViewport } from '@/hooks/usePublicMenuViewport'

/** Emoji mappate ai key standard delle categorie. */
const CATEGORY_EMOJI: Record<string, string> = {
  antipasti:  '🥗',
  pizza:      '🍕',
  primi:      '🍝',
  secondi:    '🍖',
  fritti:     '🍟',
  bevande:    '🥤',
  vini:       '🍷',
  birre:      '🍺',
  dolci:      '🍰',
  dessert:    '🍰',
  formaggi:   '🧀',
  contorni:   '🥦',
  panini:     '🥪',
  insalate:   '🥗',
  zuppe:      '🍲',
}

function useTenantBySlug(slug: string | undefined) {
  const { setTenantFromSlug, tenantId, organizationName, isLoading } = useTenantContext()

  useEffect(() => {
    if (slug) setTenantFromSlug(slug)
  }, [slug, setTenantFromSlug])

  return { tenantId, organizationName, isLoading }
}

function usePublicCategories(tenantId: string | null, categoryFilter: string[] | null) {
  return useQuery({
    queryKey: ['public-menu-categories', tenantId, categoryFilter],
    queryFn: async () => {
      let query = (supabasePublic
        .from('menu_categories') as any)
        .select('id, key, label, sort_order')
        .eq('tenant_id', tenantId)
        .order('sort_order', { ascending: true })
        .order('label', { ascending: true })

      if (categoryFilter && categoryFilter.length > 0) {
        query = query.in('key', categoryFilter)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as MenuCategoryRecord[]
    },
    enabled: !!tenantId,
  })
}

function usePublicPresets(tenantId: string | null, presetIds: string[] | null) {
  return useQuery({
    queryKey: ['public-menu-presets', tenantId, presetIds],
    queryFn: async () => {
      const { data, error } = await (supabasePublic
        .from('restaurant_settings') as any)
        .select('value')
        .eq('tenant_id', tenantId)
        .eq('key', 'booking_custom_staff_presets')
        .single()

      if (error || !data) return []

      const all: { id: string; name: string; item_ids: string[] }[] = Array.isArray(data.value) ? data.value : []
      if (!presetIds || presetIds.length === 0) return all
      return all.filter((p: { id: string }) => presetIds.includes(p.id))
    },
    enabled: !!tenantId,
  })
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CategoryRow({
  category,
  href,
}: {
  category: MenuCategoryRecord
  href: string
}) {
  const emoji = CATEGORY_EMOJI[category.key.toLowerCase()] ?? ''
  return (
    <Link
      to={href}
      className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm active:bg-amber-50 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        {emoji && <span className="text-2xl leading-none shrink-0">{emoji}</span>}
        <span className="text-base font-semibold text-gray-900 truncate">{category.label}</span>
      </div>
      <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

function PresetCard({ preset, href }: { preset: { id: string; name: string; item_ids: string[] }; href: string }) {
  const itemCount: number = Array.isArray(preset.item_ids) ? preset.item_ids.length : 0
  return (
    <Link
      to={href}
      className="flex flex-col gap-1 rounded-2xl bg-white px-4 py-4 shadow-sm active:bg-amber-50 transition-colors"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-semibold text-gray-900">{preset.name}</span>
        <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <span className="text-sm text-gray-500">
        {itemCount} {itemCount === 1 ? 'voce' : 'voci'}
      </span>
    </Link>
  )
}

// ── Contenuto QR risolto ──────────────────────────────────────────────────────

function MenuContent({
  qr,
  slug,
  shortCode,
}: {
  qr: MenuQrCode
  slug: string
  shortCode: string
}) {
  const { data: categories = [], isLoading: catLoading } = usePublicCategories(
    qr.tenant_id,
    qr.content_type !== 'preset_menus' ? qr.category_filter : [],
  )
  const { data: presets = [], isLoading: presetLoading } = usePublicPresets(
    qr.tenant_id,
    qr.content_type !== 'a_la_carte' ? qr.preset_ids : [],
  )

  const showCart = qr.content_type === 'a_la_carte' || qr.content_type === 'mixed'
  const showPresets = qr.content_type === 'preset_menus' || qr.content_type === 'mixed'

  const isLoading = catLoading || presetLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
        Caricamento...
      </div>
    )
  }

  return (
    <main className="flex flex-col gap-6 px-4 py-6">
      {showCart && (
        <section>
          {qr.content_type === 'mixed' && (
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-700">
              Alla Carta
            </h2>
          )}
          {categories.length === 0 ? (
            <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-gray-500 shadow-sm">
              Menu in preparazione
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <CategoryRow
                  key={cat.key}
                  category={cat}
                  href={`/menu/${slug}/qr/${shortCode}/c/${cat.key}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {showPresets && (
        <section>
          {qr.content_type === 'mixed' && (
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-700">
              Menù Eventi
            </h2>
          )}
          {presets.length === 0 ? (
            <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-gray-500 shadow-sm">
              Menu in preparazione
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {presets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  href={`/menu/${slug}/qr/${shortCode}/preset/${preset.id}`}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}

// ── Pagina principale ─────────────────────────────────────────────────────────

export function PublicMenuPage() {
  usePublicMenuViewport()
  const { tenantSlug, shortCode } = useParams<{ tenantSlug: string; shortCode?: string }>()
  const navigate = useNavigate()
  const { tenantId, organizationName, isLoading: tenantLoading } = useTenantBySlug(tenantSlug)

  const { data: qrByCode, isLoading: qrLoading } = usePublicMenuQr(
    tenantId,
    shortCode ?? null,
  )
  const { data: qrDefault, isLoading: qrDefaultLoading } = usePublicDefaultMenuQr(
    shortCode ? null : tenantId,
  )

  const qr = shortCode ? qrByCode : qrDefault
  const loading = tenantLoading || qrLoading || qrDefaultLoading

  // Se short_code specifico non trovato, redirect alla root /menu/:slug
  useEffect(() => {
    if (!loading && shortCode && !qr) {
      navigate(`/menu/${tenantSlug}`, { replace: true })
    }
  }, [loading, shortCode, qr, navigate, tenantSlug])

  if (!tenantSlug) return null

  if (loading) {
    return (
      <div className="min-h-svh bg-amber-50">
        <div className="sticky top-0 h-14 bg-amber-400" />
        <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
          Caricamento...
        </div>
      </div>
    )
  }

  if (!tenantId) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-amber-50 px-6">
        <p className="text-center text-sm text-gray-500">Ristorante non trovato.</p>
      </div>
    )
  }

  const resolvedShortCode = shortCode ?? qr?.short_code ?? ''

  return (
    <div className="min-h-svh bg-amber-50">
      <PublicMenuPageHeader name={organizationName ?? 'Menu'} />
      {qr ? (
        <MenuContent qr={qr} slug={tenantSlug} shortCode={resolvedShortCode} />
      ) : (
        <main className="px-4 py-12 text-center">
          <p className="text-sm text-gray-500">Menu non ancora configurato.</p>
        </main>
      )}
    </div>
  )
}
