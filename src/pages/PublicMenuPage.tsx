import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ForkKnife,
  BowlFood,
  CookingPot,
  Flame,
  Cake,
  Martini,
  Heart,
  type Icon as PhosphorIconType,
} from '@phosphor-icons/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabasePublic } from '@/lib/supabasePublic'
import { usePublicMenuQr, usePublicDefaultMenuQr } from '@/features/booking/hooks/useMenuQrCodes'
import { usePublicMenuHomepageConfig } from '@/features/booking/hooks/useMenuHomepageConfig'
import { usePublicMenuQrcodeCategories } from '@/features/booking/hooks/useMenuQrcodeCategories'
import { getMenuTheme, type MenuTheme } from '@/features/public-menu/menuThemes'
import type { MenuCategoryRecord } from '@/features/booking/hooks/useMenuCategories'
import type { MenuQrCode, CarouselItem } from '@/types/menu'
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

/** Icone Phosphor per categoria. */
const CATEGORY_ICON: Record<string, PhosphorIconType> = {
  antipasti:  ForkKnife,
  pizza:      Flame,
  primi:      CookingPot,
  secondi:    ForkKnife,
  fritti:     Flame,
  bevande:    BowlFood,
  vini:       Martini,
  birre:      Martini,
  dolci:      Cake,
  dessert:    Cake,
  formaggi:   BowlFood,
  contorni:   BowlFood,
  panini:     ForkKnife,
  insalate:   BowlFood,
  zuppe:      CookingPot,
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
        .select('id, key, label, description, sort_order')
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

/** Fascia alta in cui viene disegnato il PNG header (titolo + carousel). */
const HEADER_BG_BAND = 'min(48vh, 420px)'

/**
 * Sfondo unico: header in fascia fissa; body con `100% auto` (non `cover`)
 * così la sfumatura bianca resta ~2/5 dell’altezza del PNG, come in asset.
 * `cover` stirava il gradiente su tutta la pagina.
 */
function themePageBackgroundStyle(theme: MenuTheme): CSSProperties {
  const { headerImage, bodyImage, headerFallbackBg, bodyFallbackBg } = theme

  if (headerImage && bodyImage) {
    return {
      ['--menu-header-band' as string]: HEADER_BG_BAND,
      backgroundImage: `url(${headerImage}), url(${bodyImage})`,
      backgroundSize: `100% var(--menu-header-band), 100% auto`,
      backgroundPosition: 'center top, center var(--menu-header-band)',
      backgroundRepeat: 'no-repeat, no-repeat',
      backgroundColor: bodyFallbackBg,
    }
  }

  if (bodyImage) {
    return {
      backgroundImage: `url(${bodyImage})`,
      backgroundSize: '100% auto',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundColor: bodyFallbackBg,
    }
  }

  if (headerImage) {
    return {
      backgroundImage: `url(${headerImage})`,
      backgroundSize: `100% ${HEADER_BG_BAND}`,
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundColor: headerFallbackBg,
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
                {/* Cuore tema */}
                <button
                  type="button"
                  aria-label="Specialità"
                  className="absolute right-3 top-3 rounded-full p-1.5"
                  style={{ color: accentColor }}
                >
                  <Heart size={20} weight="fill" />
                </button>
                {/* Testo su sinistra */}
                <div className="absolute inset-y-0 left-0 flex w-1/2 flex-col justify-end px-4 pb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    Specialità della casa
                  </p>
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

      {/* Pallini tema */}
      {items.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {items.map((_, i) => (
            <span
              key={i}
              className="block rounded-full transition-all"
              style={{
                width: i === activeIdx ? 16 : 8,
                height: 8,
                background: i === activeIdx ? accentColor : '#d6d3d1',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/** Pixel di scroll dopo il lock sticky per raggiungere opacità piena sulla barra tab. */
const TAB_BAR_FADE_SCROLL_PX = 56
const TAB_BAR_SCROLL_STEP_PX = 220

// ── Tab navigazione sticky ────────────────────────────────────────────────────

function MenuNavTabs({
  categories,
  presets,
  slug,
  shortCode,
  accentColor,
  tabBarStickyRgb,
}: {
  categories: MenuCategoryRecord[]
  presets: { id: string; name: string }[]
  slug: string
  shortCode: string
  accentColor: string
  tabBarStickyRgb: string
}) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [bgOpacity, setBgOpacity] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const usePresets = presets.length > 0

  const items = usePresets
    ? presets.map((p) => ({ key: p.id, label: p.name, href: `/menu/${slug}/qr/${shortCode}/preset/${p.id}` }))
    : categories.map((c) => {
        const Icon = CATEGORY_ICON[c.key.toLowerCase()] ?? ForkKnife
        return { key: c.key, label: c.label, href: `/menu/${slug}/qr/${shortCode}/c/${c.key}`, Icon }
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
            className="absolute left-0 top-0 bottom-0 z-20 hidden md:flex w-10 items-center justify-center rounded-r-md shadow-sm"
            style={{ backgroundColor: arrowBg, color: accentColor }}
            onClick={() => scrollTabs(-TAB_BAR_SCROLL_STEP_PX)}
          >
            <ChevronLeft size={22} strokeWidth={1.75} />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide py-3 px-4 md:px-11"
        >
          {items.map((item) => {
            const Icon = 'Icon' in item ? (item.Icon as PhosphorIconType) : null
            return (
              <Link
                key={item.key}
                to={item.href}
                className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                {Icon && <Icon size={16} />}
                {item.label}
              </Link>
            )
          })}
        </div>
        {canScrollRight && (
          <button
            type="button"
            aria-label="Scorri categorie avanti"
            className="absolute right-0 top-0 bottom-0 z-20 hidden md:flex w-10 items-center justify-center rounded-l-md shadow-sm"
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

// ── Card categoria — orizzontale thumb 1:1 ───────────────────────────────────

function CategoryCard({
  category,
  href,
  imageUrl,
  qrTitle,
  qrDescription,
}: {
  category: MenuCategoryRecord
  href: string
  imageUrl?: string
  qrTitle?: string | null
  qrDescription?: string | null
}) {
  const emoji = CATEGORY_EMOJI[category.key.toLowerCase()] ?? '🍽️'
  const displayTitle = qrTitle || category.label
  const displayDesc = qrDescription !== undefined ? qrDescription : category.description

  return (
    <Link
      to={href}
      className="flex overflow-hidden rounded-2xl bg-white shadow-sm min-h-[88px] active:bg-stone-50 transition-colors"
    >
      {/* Thumb 1:1 */}
      <div className="aspect-square w-24 shrink-0 bg-stone-100">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">{emoji}</div>
        )}
      </div>
      {/* Testo */}
      <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
        <p className="text-sm font-semibold text-gray-900 leading-snug">{displayTitle}</p>
        {displayDesc && (
          <p className="mt-1 text-xs text-gray-500 leading-snug line-clamp-2">{displayDesc}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center pr-3 text-gray-300">
        <ChevronRight size={18} />
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
  const { data: homepageConfig } = usePublicMenuHomepageConfig(qr.tenant_id)
  const { data: qrCatOverrides = [] } = usePublicMenuQrcodeCategories(qr.tenant_id)

  const showCart = qr.content_type === 'a_la_carte' || qr.content_type === 'mixed'
  const showPresets = qr.content_type === 'preset_menus' || qr.content_type === 'mixed'
  const isLoading = catLoading || presetLoading

  const carouselItems = homepageConfig?.carousel_items ?? []
  const categoryImages = homepageConfig?.category_images ?? {}
  const theme = getMenuTheme(homepageConfig?.theme_key)

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
    <div className="flex min-h-svh flex-col" style={themePageBackgroundStyle(theme)}>
      {/* Hero: sfondo unificato dietro (header+body in themePageBackgroundStyle) */}
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
          />
        )}

        {showCart && categories.length > 0 && (
          <main className="flex-1 px-4 pt-4">
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
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
    <div className="min-h-svh">
      {qr ? (
        <MenuContent
          qr={qr}
          slug={tenantSlug}
          shortCode={resolvedShortCode}
          organizationName={organizationName ?? 'Menu'}
        />
      ) : (
        <main className="px-4 py-12 text-center">
          <p className="text-sm text-gray-500">Menu non ancora configurato.</p>
        </main>
      )}
    </div>
  )
}
