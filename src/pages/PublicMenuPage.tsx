import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabasePublic } from '@/lib/supabasePublic'
import { usePublicMenuQr, usePublicDefaultMenuQr } from '@/features/booking/hooks/useMenuQrCodes'
import { usePublicMenuQrcodeCategories } from '@/features/booking/hooks/useMenuQrcodeCategories'
import { getMenuTheme, type MenuTheme } from '@/features/public-menu/menuThemes'
import { MenuQrCategoryIconGlyph } from '@/features/public-menu/MenuQrCategoryIconGlyph'
import type { MenuCategoryRecord } from '@/features/booking/hooks/useMenuCategories'
import type { MenuQrCode, CarouselItem, MenuQrcodeCategoryOverride } from '@/types/menu'
import { usePublicMenuViewport } from '@/hooks/usePublicMenuViewport'
import { useRestaurantName } from '@/hooks/useRestaurantName'

function useTenantBySlug(slug: string | undefined) {
  const { setTenantFromSlug, tenantId, tenantSlug, organizationName, isLoading } = useTenantContext()

  useEffect(() => {
    if (slug) setTenantFromSlug(slug)
  }, [slug, setTenantFromSlug])

  /** Evita lookup QR con tenantId “stale” (es. sessione admin) prima che lo slug URL sia risolto. */
  const tenantReady = !!slug && !isLoading && !!tenantId && tenantSlug === slug

  return { tenantId, organizationName, isLoading, tenantReady }
}

function usePublicCategories(tenantId: string | null, categoryFilter: string[] | null) {
  return useQuery({
    queryKey: ['public-menu-categories', tenantId, categoryFilter],
    queryFn: async () => {
      // [] esplicito = nessuna card categoria in homepage
      if (categoryFilter !== null && categoryFilter.length === 0) {
        return []
      }

      let query = (supabasePublic
        .from('menu_categories') as any)
        .select('id, key, label, description, sort_order')
        .eq('tenant_id', tenantId)
        .order('sort_order', { ascending: true })
        .order('label', { ascending: true })

      if (categoryFilter !== null && categoryFilter.length > 0) {
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
        .select('setting_value')
        .eq('tenant_id', tenantId)
        .eq('setting_key', 'booking_custom_staff_presets')
        .maybeSingle()

      if (error || !data) return []

      const all: { id: string; name: string; item_ids: string[] }[] = Array.isArray(data.setting_value)
        ? data.setting_value
        : []
      if (!presetIds || presetIds.length === 0) return all
      return all.filter((p: { id: string }) => presetIds.includes(p.id))
    },
    enabled: !!tenantId,
  })
}

/**
 * Homepage menu QR: un solo PNG (`bodyImage`) per tutto lo sfondo.
 * `headerImage` è solo su PublicMenuCategoryPage (barra categoria).
 * `repeat-y` + `100% auto` sul wrapper scrollabile — niente layer fixed separato.
 */
function useMenuPageBackgroundStyle(theme: MenuTheme): CSSProperties {
  const { bodyImage, bodyFallbackBg } = theme

  if (bodyImage) {
    return {
      backgroundImage: `url(${bodyImage})`,
      backgroundSize: '100% auto',
      backgroundPosition: 'center top',
      backgroundRepeat: 'repeat-y',
      backgroundColor: bodyFallbackBg,
    }
  }

  return { backgroundColor: bodyFallbackBg }
}

// ── Carosello ────────────────────────────────────────────────────────────────

function MenuCarousel({
  items,
  accentColor,
}: {
  items: CarouselItem[]
  accentColor: string
}) {
  const [activeIdx, setActiveIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.offsetWidth)
    setActiveIdx(idx)
  }

  const goToSlide = (index: number) => {
    const el = scrollRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(index, items.length - 1))
    el.scrollTo({ left: clamped * el.offsetWidth, behavior: 'smooth' })
    setActiveIdx(clamped)
  }

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    if (!el) return
    isDragging.current = true
    startX.current = e.pageX - el.offsetLeft
    scrollLeft.current = el.scrollLeft
    el.style.cursor = 'grabbing'
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    if (!isDragging.current || !el) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    const walk = (x - startX.current) * 1.2
    el.scrollLeft = scrollLeft.current - walk
  }

  const onMouseUp = () => {
    const el = scrollRef.current
    isDragging.current = false
    if (el) el.style.cursor = 'grab'
  }

  const hasImages = items.length > 0

  return (
    <div>
      {hasImages ? (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl scrollbar-hide gap-0"
          style={{ scrollSnapType: 'x mandatory', cursor: 'grab', userSelect: 'none' }}
        >
          {items.map((item, i) => {
            const title = item.title ?? item.label
            const eyebrow = item.eyebrow?.trim()
            return (
              <div
                key={i}
                className="relative h-52 w-full shrink-0 snap-start overflow-hidden rounded-2xl"
                style={{ scrollSnapAlign: 'start', minWidth: '100%' }}
              >
                <img
                  src={item.image_url}
                  alt={title ?? ''}
                  className="h-full w-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
                {/* Gradiente overlay 40% sinistro per testo */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 50%)',
                  }}
                />
                {/* Testo su sinistra */}
                <div className="absolute inset-y-0 left-0 flex w-1/2 flex-col justify-end px-4 pb-4">
                  {eyebrow ? (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                      {eyebrow}
                    </p>
                  ) : null}
                  {title && (
                    <p className="mt-0.5 text-base font-bold leading-snug text-white">{title}</p>
                  )}
                  {item.description && (
                    <p className="mt-0.5 text-xs leading-snug text-white/80">{item.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Placeholder trasparente quando nessuna foto */
        <div className="h-28 w-full rounded-2xl" style={{ background: 'rgba(255,255,255,0.15)' }} />
      )}

      {/* Pallini tema — click per cambiare slide */}
      {items.length > 1 && (
        <div className="mt-2 flex justify-center gap-0.5" role="tablist" aria-label="Slide specialità">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Slide ${i + 1} di ${items.length}`}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-0 bg-transparent p-0 cursor-pointer touch-manipulation"
              onClick={() => goToSlide(i)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span
                className="block rounded-full transition-all"
                style={{
                  width: i === activeIdx ? 16 : 8,
                  height: 8,
                  background: i === activeIdx ? accentColor : '#d6d3d1',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Pixel di scroll dopo il lock sticky per raggiungere opacità piena sulla barra tab. */
const TAB_BAR_FADE_SCROLL_PX = 56
const TAB_BAR_SCROLL_STEP_PX = 220

type MenuNavTabItem =
  | { key: string; label: string; href: string }
  | { key: string; label: string; href: string; iconKey?: string | null; categoryKey: string }

function isCategoryNavTab(
  item: MenuNavTabItem,
): item is Extract<MenuNavTabItem, { categoryKey: string }> {
  return 'categoryKey' in item
}

// ── Tab navigazione sticky ────────────────────────────────────────────────────

function MenuNavTabs({
  categories,
  presets,
  slug,
  shortCode,
  accentColor,
  tabBarStickyRgb,
  overridesByKey,
}: {
  categories: MenuCategoryRecord[]
  presets: { id: string; name: string }[]
  slug: string
  shortCode: string
  accentColor: string
  tabBarStickyRgb: string
  overridesByKey: Record<string, MenuQrcodeCategoryOverride>
}) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [bgOpacity, setBgOpacity] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const usePresets = presets.length > 0

  const items: MenuNavTabItem[] = usePresets
    ? presets.map((p) => ({ key: p.id, label: p.name, href: `/menu/${slug}/qr/${shortCode}/preset/${p.id}` }))
    : categories.map((c) => {
        const ov = overridesByKey[c.key]
        return {
          key: c.key,
          label: c.label,
          href: `/menu/${slug}/qr/${shortCode}/c/${c.key}`,
          iconKey: ov?.icon,
          categoryKey: c.key,
        }
      })

  const updateScrollHints = () => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 4)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4)
  }

  useEffect(() => {
    const updateOpacity = () => {
      const sentinel = sentinelRef.current
      if (!sentinel) return
      const bottom = sentinel.getBoundingClientRect().bottom
      if (bottom > 0) {
        setBgOpacity(0)
        return
      }
      const progress = Math.min(1, -bottom / TAB_BAR_FADE_SCROLL_PX)
      setBgOpacity(progress)
    }

    updateOpacity()
    window.addEventListener('scroll', updateOpacity, { passive: true })
    window.addEventListener('resize', updateOpacity)
    return () => {
      window.removeEventListener('scroll', updateOpacity)
      window.removeEventListener('resize', updateOpacity)
    }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollHints()
    el.addEventListener('scroll', updateScrollHints, { passive: true })
    const ro = new ResizeObserver(updateScrollHints)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollHints)
      ro.disconnect()
    }
  }, [items.length])

  if (items.length === 0) return null

  const blurPx = Math.round(bgOpacity * 10)
  const barBg = `rgba(${tabBarStickyRgb}, ${bgOpacity * 0.97})`
  const arrowBg = `rgba(${tabBarStickyRgb}, ${Math.max(bgOpacity * 0.97, 0.72)})`

  const scrollTabs = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />
      <div
        className="sticky top-0 z-10 relative"
        style={{
          backgroundColor: barBg,
          backdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
          WebkitBackdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
          transition: 'background-color 0.12s ease-out, backdrop-filter 0.12s ease-out',
        }}
      >
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scorri categorie indietro"
            className="absolute left-0 top-0 bottom-0 z-20 hidden min-[700px]:flex w-10 items-center justify-center rounded-r-md shadow-sm"
            style={{ backgroundColor: arrowBg, color: accentColor }}
            onClick={() => scrollTabs(-TAB_BAR_SCROLL_STEP_PX)}
          >
            <ChevronLeft size={22} strokeWidth={1.75} />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide py-3 px-4 min-[700px]:px-11"
        >
          {items.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium leading-none transition-colors"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                {isCategoryNavTab(item) ? (
                  <MenuQrCategoryIconGlyph
                    iconKey={item.iconKey}
                    categoryKey={item.categoryKey}
                    size={16}
                    className="shrink-0"
                  />
                ) : null}
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
        </div>
        {canScrollRight && (
          <button
            type="button"
            aria-label="Scorri categorie avanti"
            className="absolute right-0 top-0 bottom-0 z-20 hidden min-[700px]:flex w-10 items-center justify-center rounded-l-md shadow-sm"
            style={{ backgroundColor: arrowBg, color: accentColor }}
            onClick={() => scrollTabs(TAB_BAR_SCROLL_STEP_PX)}
          >
            <ChevronRight size={22} strokeWidth={1.75} />
          </button>
        )}
      </div>
    </>
  )
}

// ── Card categoria — tile verticale <1025px, riga orizzontale da 1025px ──
// Griglia (in MenuContent): 1 col <520 · 2 col 520–1024 · 2 col ≥1025 (card orizzontale)

function CategoryCard({
  category,
  href,
  imageUrl,
  qrTitle,
  qrDescription,
  iconKey,
}: {
  category: MenuCategoryRecord
  href: string
  imageUrl?: string
  qrTitle?: string | null
  qrDescription?: string | null
  iconKey?: string | null
}) {
  const displayTitle = qrTitle || category.label
  const displayDesc = qrDescription !== undefined ? qrDescription : category.description
  return (
    <Link
      to={href}
      className="block overflow-hidden rounded-xl bg-white shadow-sm active:bg-stone-50 transition-colors min-[1025px]:flex min-[1025px]:min-h-[80px] min-[1025px]:rounded-2xl min-[900px]:min-h-[88px]"
    >
      {/* <1025px: tile verticale (anche in griglia 2 col tablet) */}
      <div className="relative min-[1025px]:hidden">
        <div className="relative aspect-[7/2] w-full overflow-hidden bg-stone-100 min-[520px]:aspect-[5/2]">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-stone-400">
              <MenuQrCategoryIconGlyph
                iconKey={iconKey}
                categoryKey={category.key}
                className="size-6 min-[520px]:size-7"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-1 p-2 text-white min-[520px]:p-2.5">
            <h2 className="min-w-0 flex-1 text-xs font-bold uppercase leading-tight tracking-wide min-[520px]:text-sm">
              {displayTitle}
            </h2>
            <ChevronRight className="size-3.5 shrink-0 opacity-80 min-[520px]:size-4" aria-hidden />
          </div>
        </div>
      </div>

      {/* ≥1025px: riga orizzontale thumb + titolo + descrizione */}
      <div className="hidden min-[1025px]:contents">
        <div className="aspect-square w-20 shrink-0 bg-stone-100 min-[900px]:w-24">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-stone-400">
              <MenuQrCategoryIconGlyph iconKey={iconKey} categoryKey={category.key} size={32} />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2.5 min-[900px]:px-4 min-[900px]:py-3">
          <p className="text-sm font-semibold text-gray-900 leading-snug min-[900px]:text-[15px]">{displayTitle}</p>
          {displayDesc ? (
            <p className="mt-1 text-xs text-gray-500 leading-snug line-clamp-2">{displayDesc}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center pr-3 text-gray-300">
          <ChevronRight size={18} aria-hidden />
        </div>
      </div>
    </Link>
  )
}

// ── Footer data/ora ───────────────────────────────────────────────────────────

function MenuFooterCard() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const dateStr = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(now)
  const timeStr = new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit', minute: '2-digit',
  }).format(now)

  return (
    <div className="mx-4 mb-6 rounded-2xl bg-white px-4 py-3 shadow-sm flex items-center justify-between gap-2">
      <span className="text-sm text-gray-500 capitalize">{dateStr}</span>
      <span className="text-sm font-semibold text-gray-800">{timeStr}</span>
    </div>
  )
}

// ── Contenuto QR risolto ──────────────────────────────────────────────────────

function MenuContent({
  qr,
  slug,
  shortCode,
  organizationName,
}: {
  qr: MenuQrCode
  slug: string
  shortCode: string
  organizationName: string
}) {
  const { data: categories = [], isLoading: catLoading } = usePublicCategories(
    qr.tenant_id,
    qr.content_type !== 'preset_menus' ? qr.category_filter : [],
  )
  const { data: presets = [], isLoading: presetLoading } = usePublicPresets(
    qr.tenant_id,
    qr.content_type !== 'a_la_carte' ? qr.preset_ids : [],
  )
  const { data: qrCatOverrides = [] } = usePublicMenuQrcodeCategories(qr.id)

  const showCart = qr.content_type === 'a_la_carte' || qr.content_type === 'mixed'
  const showPresets = qr.content_type === 'preset_menus' || qr.content_type === 'mixed'
  const isLoading = catLoading || presetLoading

  const carouselItems = qr.carousel_items ?? []
  const categoryImages = qr.category_images ?? {}
  const theme = getMenuTheme(qr.theme_key)
  const pageBgStyle = useMenuPageBackgroundStyle(theme)

  // Mappa override per category_key
  const overridesByKey = Object.fromEntries(qrCatOverrides.map((o) => [o.category_key, o]))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
        Caricamento...
      </div>
    )
  }

  return (
    <div
      className="flex min-h-svh flex-col"
      style={pageBgStyle}
    >
      {/* FU-025: sfondo tema full viewport; contenuto congelato a larghezza tablet, centrato oltre 1024px */}
      <div className="mx-auto flex w-full max-w-[1024px] flex-1 flex-col">
      {/* Hero: sfondo bodyImage repeat-y sul wrapper che scrolla col contenuto */}
      <header className="relative shrink-0 px-4 pt-8 pb-4">
        <div className="relative flex flex-col items-center gap-2 text-center">
          <h1
            className="text-2xl font-bold leading-tight tracking-wide"
            style={{ color: theme.headerTextColor }}
          >
            {organizationName}
          </h1>
          <div
            className="mt-1 h-0.5 w-16 rounded-full opacity-60"
            style={{ background: theme.headerTextColor }}
          />
        </div>
        <div className="relative mt-4">
          <MenuCarousel items={carouselItems} accentColor={theme.accentColor} />
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        {showCart && (
          <MenuNavTabs
            categories={categories}
            presets={showPresets ? presets : []}
            slug={slug}
            shortCode={shortCode}
            accentColor={theme.accentColor}
            tabBarStickyRgb={theme.tabBarStickyRgb}
            overridesByKey={overridesByKey}
          />
        )}

        {showCart && categories.length > 0 && (
          <main className="flex-1 px-4 pt-4">
            <div className="grid grid-cols-1 gap-1.5 min-[520px]:grid-cols-2 min-[520px]:gap-2 min-[1025px]:gap-3">
              {categories.map((cat) => {
                const ov = overridesByKey[cat.key]
                return (
                  <CategoryCard
                    key={cat.key}
                    category={cat}
                    href={`/menu/${slug}/qr/${shortCode}/c/${cat.key}`}
                    imageUrl={categoryImages[cat.key]}
                    qrTitle={ov?.title}
                    qrDescription={ov?.description}
                    iconKey={ov?.icon}
                  />
                )
              })}
            </div>
          </main>
        )}

        {showCart && categories.length === 0 && (
          <main className="flex-1 px-4 py-6">
            <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-gray-500 shadow-sm">
              Menu in preparazione
            </p>
          </main>
        )}

        {showPresets && (
          <section className="flex-1 px-4 pb-4 pt-4">
            {presets.length === 0 ? (
              <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-gray-500 shadow-sm">
                Menu in preparazione
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {presets.map((preset) => (
                  <Link
                    key={preset.id}
                    to={`/menu/${slug}/qr/${shortCode}/preset/${preset.id}`}
                    className="flex flex-col gap-1 rounded-2xl bg-white px-4 py-4 shadow-sm active:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-semibold text-gray-900">{preset.name}</span>
                      <ChevronRight size={18} className="shrink-0 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-500">
                      {Array.isArray(preset.item_ids) ? preset.item_ids.length : 0} voci
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="mt-auto pt-2">
          <MenuFooterCard />
        </div>
      </div>
      </div>
    </div>
  )
}

// ── Pagina principale ─────────────────────────────────────────────────────────

export function PublicMenuPage() {
  usePublicMenuViewport()
  const { tenantSlug, shortCode } = useParams<{ tenantSlug: string; shortCode?: string }>()
  const { tenantId, isLoading: tenantLoading, tenantReady } = useTenantBySlug(tenantSlug)
  const restaurantDisplayName = useRestaurantName()

  const { data: qrByCode, isLoading: qrLoading, isFetched: qrByCodeFetched } = usePublicMenuQr(
    tenantReady ? tenantId : null,
    shortCode ?? null,
  )
  const { data: qrDefault, isLoading: qrDefaultLoading } = usePublicDefaultMenuQr(
    shortCode ? null : tenantReady ? tenantId : null,
  )

  const qr = shortCode ? qrByCode : qrDefault
  const loading = shortCode
    ? tenantLoading || !tenantReady || qrLoading
    : tenantLoading || !tenantReady || qrDefaultLoading

  const qrNotFound =
    !!shortCode && tenantReady && qrByCodeFetched && !qrLoading && qrByCode === null

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
    <div className="min-h-svh">
      {qr ? (
        <MenuContent
          qr={qr}
          slug={tenantSlug}
          shortCode={resolvedShortCode}
          organizationName={restaurantDisplayName ?? 'Menu'}
        />
      ) : qrNotFound ? (
        <main className="px-4 py-12 text-center">
          <p className="text-sm font-medium text-gray-700">Menù QR non trovato</p>
          <p className="mt-2 text-xs text-gray-500">
            Il link non è valido, il QR è disattivato o non appartiene a questo ristorante.
          </p>
        </main>
      ) : (
        <main className="px-4 py-12 text-center">
          <p className="text-sm text-gray-500">Menu non ancora configurato.</p>
        </main>
      )}
    </div>
  )
}
