import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabasePublic } from '@/lib/supabasePublic'
import { usePublicMenuQr, usePublicDefaultMenuQr } from '@/features/booking/hooks/useMenuQrCodes'
import { usePublicMenuHomepageConfig } from '@/features/booking/hooks/useMenuHomepageConfig'
import type { MenuCategoryRecord } from '@/features/booking/hooks/useMenuCategories'
import type { MenuQrCode, CarouselItem } from '@/types/menu'
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

// ── Carosello ────────────────────────────────────────────────────────────────

function MenuCarousel({ items }: { items: CarouselItem[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.offsetWidth)
    setActiveIdx(idx)
  }

  return (
    <section className="px-4 pt-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">
        Specialità della casa
      </p>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl scrollbar-hide gap-0"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="relative h-48 w-full shrink-0 snap-start overflow-hidden rounded-2xl"
            style={{ scrollSnapAlign: 'start', minWidth: '100%' }}
          >
            <img
              src={item.image_url}
              alt={item.label ?? ''}
              className="h-full w-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            {item.label && (
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-4 pb-3 pt-8">
                <p className="text-sm font-semibold text-white">{item.label}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Pallini */}
      {items.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {items.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all ${
                i === activeIdx ? 'h-2 w-4 bg-stone-700' : 'h-2 w-2 bg-stone-300'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

// ── Pill buttons categoria ────────────────────────────────────────────────────

function CategoryPills({
  categories,
  activeKey,
  onSelect,
}: {
  categories: MenuCategoryRecord[]
  activeKey: string | null
  onSelect: (key: string | null) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-4 scrollbar-hide">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          activeKey === null
            ? 'bg-stone-800 text-white'
            : 'border border-stone-200 bg-white text-stone-700'
        }`}
      >
        Tutte
      </button>
      {categories.map((cat) => (
        <button
          key={cat.key}
          type="button"
          onClick={() => onSelect(cat.key)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeKey === cat.key
              ? 'bg-stone-800 text-white'
              : 'border border-stone-200 bg-white text-stone-700'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}

// ── Card categoria ────────────────────────────────────────────────────────────

function CategoryCardPhoto({
  category,
  href,
  imageUrl,
}: {
  category: MenuCategoryRecord
  href: string
  imageUrl: string
}) {
  return (
    <Link to={href} className="relative block overflow-hidden rounded-2xl shadow-sm">
      <img src={imageUrl} alt={category.label} className="h-32 w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-3 pb-3 pt-8">
        <p className="text-sm font-bold text-white">{category.label}</p>
      </div>
    </Link>
  )
}

function CategoryCardText({
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
      className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm active:bg-stone-50 transition-colors"
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
      className="flex flex-col gap-1 rounded-2xl bg-white px-4 py-4 shadow-sm active:bg-stone-50 transition-colors"
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
  const { data: homepageConfig } = usePublicMenuHomepageConfig(qr.tenant_id)

  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const showCart = qr.content_type === 'a_la_carte' || qr.content_type === 'mixed'
  const showPresets = qr.content_type === 'preset_menus' || qr.content_type === 'mixed'
  const isLoading = catLoading || presetLoading

  const carouselItems = homepageConfig?.carousel_items ?? []
  const categoryImages = homepageConfig?.category_images ?? {}

  const visibleCategories =
    activeCategory === null
      ? categories
      : categories.filter((c) => c.key === activeCategory)

  const hasAnyPhoto = categories.some((c) => categoryImages[c.key])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
        Caricamento...
      </div>
    )
  }

  return (
    <div>
      {/* Carosello specialità */}
      {carouselItems.length > 0 && <MenuCarousel items={carouselItems} />}

      {showCart && categories.length > 0 && (
        <>
          {/* Pill categorie */}
          <CategoryPills
            categories={categories}
            activeKey={activeCategory}
            onSelect={setActiveCategory}
          />

          {/* Grid categorie */}
          <main className="px-4 pb-6">
            {qr.content_type === 'mixed' && (
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-500">
                Alla Carta
              </h2>
            )}
            {hasAnyPhoto ? (
              <div className="grid grid-cols-2 gap-3">
                {visibleCategories.map((cat) => {
                  const imgUrl = categoryImages[cat.key]
                  const href = `/menu/${slug}/qr/${shortCode}/c/${cat.key}`
                  return imgUrl ? (
                    <CategoryCardPhoto key={cat.key} category={cat} href={href} imageUrl={imgUrl} />
                  ) : (
                    <div key={cat.key} className="col-span-2">
                      <CategoryCardText category={cat} href={href} />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {visibleCategories.map((cat) => (
                  <CategoryCardText
                    key={cat.key}
                    category={cat}
                    href={`/menu/${slug}/qr/${shortCode}/c/${cat.key}`}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {showCart && categories.length === 0 && (
        <main className="px-4 py-6">
          <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-gray-500 shadow-sm">
            Menu in preparazione
          </p>
        </main>
      )}

      {showPresets && (
        <section className="px-4 pb-6">
          {qr.content_type === 'mixed' && (
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-500">
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
    </div>
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

  useEffect(() => {
    if (!loading && shortCode && !qr) {
      navigate(`/menu/${tenantSlug}`, { replace: true })
    }
  }, [loading, shortCode, qr, navigate, tenantSlug])

  if (!tenantSlug) return null

  if (loading) {
    return (
      <div className="min-h-svh bg-stone-50">
        <div className="sticky top-0 h-14 bg-stone-800" />
        <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
          Caricamento...
        </div>
      </div>
    )
  }

  if (!tenantId) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-stone-50 px-6">
        <p className="text-center text-sm text-gray-500">Ristorante non trovato.</p>
      </div>
    )
  }

  const resolvedShortCode = shortCode ?? qr?.short_code ?? ''

  return (
    <div className="min-h-svh bg-stone-50">
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
