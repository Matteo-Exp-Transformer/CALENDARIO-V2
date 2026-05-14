import type { FC } from 'react'
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_APP_THEME } from '@/features/booking/constants/appTheme'
import { useRestaurantSetting } from '@/features/booking/hooks/useRestaurantSetting'
import {
  Home,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  ConciergeBell,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminAuth } from '@/features/booking/hooks/useAdminAuth'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { Button } from '@/components/ui'
import { useTenantContext } from '@/contexts/TenantContext'
import { useFeatures } from '@/hooks/useFeatures'

const AdminHomePage = lazy(() =>
  import('@/pages/AdminHomePage').then((m) => ({ default: m.AdminHomePage })),
)
const CrmPage = lazy(() => import('@/pages/CrmPage').then((m) => ({ default: m.CrmPage })))
const ServizioPage = lazy(() =>
  import('@/pages/ServizioPage').then((m) => ({ default: m.ServizioPage })),
)
const AnalyticsPage = lazy(() =>
  import('@/pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
)

const SectionFallback: FC = () => (
  <div className="flex h-32 items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary-600" />
  </div>
)

export type AdminShellSection = 'home' | 'prenotazioni' | 'crm' | 'servizio' | 'analytics'
type SidebarActiveItem = 'home' | 'form' | 'analytics' | 'servizio' | 'crm' | 'settings' | 'dashboard-tab' | null

function useIsNarrow() {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 644px)').matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 644px)')
    const onChange = () => setNarrow(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return narrow
}

function initials(user: { name?: string; email: string }): string {
  if (user.name?.trim()) {
    const parts = user.name.trim().split(/\s+/)
    const a = parts[0]?.[0]
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1]
    return ((a ?? '') + (b ?? '')).toUpperCase() || user.email[0]?.toUpperCase() || '?'
  }
  return user.email.slice(0, 2).toUpperCase()
}

type SidebarNavAction =
  | { type: 'section'; section: AdminShellSection }
  | { type: 'public-form' }
  | { type: 'settings' }

const SIDEBAR_NAV_ITEMS: {
  id: string
  label: string
  icon: typeof Home
  action: SidebarNavAction
  featureKey?: 'servizio' | 'crm' | 'analytics'
}[] = [
  { id: 'form', label: 'Form Pubblico', icon: ExternalLink, action: { type: 'public-form' } },
  {
    id: 'servizio',
    label: 'Servizio',
    icon: ConciergeBell,
    action: { type: 'section', section: 'servizio' },
    featureKey: 'servizio',
  },
  {
    id: 'crm',
    label: 'CRM Clienti',
    icon: Users,
    action: { type: 'section', section: 'crm' },
    featureKey: 'crm',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    action: { type: 'section', section: 'analytics' },
    featureKey: 'analytics',
  },
]

export const AdminShell: FC = () => {
  const isNarrow = useIsNarrow()
  const features = useFeatures()
  // Sidebar sempre chiusa all'avvio — si apre solo al click sul pulsante
  const [expanded, setExpanded] = useState(false)
  const [section, setSection] = useState<AdminShellSection>(() =>
    features.sidebar ? 'home' : 'prenotazioni',
  )
  const [activeSidebarItem, setActiveSidebarItem] = useState<SidebarActiveItem>(() =>
    features.sidebar ? 'home' : null,
  )
  const [restaurantSettingsSignal, setRestaurantSettingsSignal] = useState(0)
  const { user, logout } = useAdminAuth()
  const { tenantSlug } = useTenantContext()
  const asideRef = useRef<HTMLDivElement | null>(null)

  const { data: savedAppTheme = DEFAULT_APP_THEME, isPending: isAppThemePending } =
    useRestaurantSetting('app_theme')

  useEffect(() => {
    const resolved = isAppThemePending ? DEFAULT_APP_THEME : savedAppTheme
    document.documentElement.setAttribute('data-admin-theme', resolved)
    // nessun cleanup: il tema deve persistere per tutta la sessione admin
  }, [savedAppTheme, isAppThemePending])

  // Click-outside: chiude la sidebar quando si clicca fuori dall'aside
  useEffect(() => {
    if (!expanded) return
    const handlePointerDown = (e: PointerEvent) => {
      if (asideRef.current && !asideRef.current.contains(e.target as Node)) {
        setExpanded(false)
      }
    }
    // 'capture: true' intercetta prima che altri handler possano fermare la propagazione
    document.addEventListener('pointerdown', handlePointerDown, { capture: true })
    return () => document.removeEventListener('pointerdown', handlePointerDown, { capture: true })
  }, [expanded])

  // Escape chiude la sidebar
  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  const toggleSidebar = useCallback(() => {
    setExpanded((e) => !e)
  }, [])

  const runSidebarAction = useCallback(
    (action: SidebarNavAction) => {
      if (action.type === 'section') {
        const item: SidebarActiveItem =
          action.section === 'analytics' ? 'analytics'
          : action.section === 'servizio' ? 'servizio'
          : action.section === 'crm' ? 'crm'
          : null
        openSection(action.section, item)
        return
      }
      if (action.type === 'public-form') {
        if (!tenantSlug) return
        if (isNarrow) setExpanded(false)
        setActiveSidebarItem('form')
        window.open(`/prenota/${tenantSlug}`, '_blank', 'noopener,noreferrer')
        return
      }
      if (action.type === 'settings') {
        openSection('prenotazioni', 'settings')
        setRestaurantSettingsSignal((n) => n + 1)
      }
    },
    [isNarrow, tenantSlug],
  )

  const openSection = (s: AdminShellSection, sidebarItem: SidebarActiveItem = null) => {
    if (isNarrow) setExpanded(false)
    setSection(s)
    setActiveSidebarItem(sidebarItem)
  }

  // Narrow drawer: sidebar si comporta come overlay
  const isNarrowDrawerOpen = isNarrow && expanded

  // Edition Classic: nessuna sidebar, AdminDashboard occupa tutta la pagina
  if (!features.sidebar) {
    return (
      <div className="flex min-h-screen flex-col">
        <AdminDashboard restaurantSettingsSignal={restaurantSettingsSignal} />
      </div>
    )
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-(--color-bg)">
      {/* Overlay per narrow drawer */}
      {isNarrowDrawerOpen && (
        <button
          type="button"
          className="fixed inset-0 z-7999 cursor-default border-0 bg-black/40 p-0"
          aria-label="Chiudi menu"
          onClick={() => setExpanded(false)}
        />
      )}

      <aside
        ref={asideRef as unknown as React.Ref<HTMLElement>}
        className={cn(
          'flex h-full shrink-0 flex-col border-r border-(--color-border) bg-surface py-4 transition-[width] duration-200 ease-out',
          isNarrowDrawerOpen && 'fixed inset-y-0 left-0 z-8000 w-56 shadow-xl',
          isNarrow && !isNarrowDrawerOpen && 'relative w-16',
          !isNarrow && expanded && 'w-56',
          !isNarrow && !expanded && 'w-16',
        )}
        aria-label="Navigazione principale"
        aria-expanded={expanded}
      >
        <div className="flex flex-1 flex-col gap-1 px-2">
          {/* Home — voce principale */}
          <div
            className={cn(
              'mb-1 flex',
              expanded ? 'items-center justify-between gap-1 px-1' : 'justify-center',
            )}
          >
            <button
              type="button"
              onClick={() => {
                setSection('home')
                setActiveSidebarItem('home')
                if (isNarrow) setExpanded(false)
              }}
              title="Home"
              aria-label="Home"
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                activeSidebarItem === 'home'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-900 hover:bg-primary-50',
                !expanded && 'w-10 justify-center px-0',
              )}
            >
              <Home
                className={cn(
                  'h-5 w-5 shrink-0',
                  activeSidebarItem === 'home' ? 'text-white' : 'text-primary-900',
                )}
                aria-hidden
              />
              {expanded && <span className="truncate">Home</span>}
            </button>
            {expanded && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-expanded={expanded}
                aria-label="Comprimi menu"
                title="Comprimi menu"
                onClick={toggleSidebar}
                className="shrink-0 text-primary-900"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </Button>
            )}
          </div>

          <div className="my-1 border-t border-(--color-border)" />

          {/* Voci nav */}
          {SIDEBAR_NAV_ITEMS.filter((item) =>
            item.featureKey ? features[item.featureKey] : true,
          ).map(({ id, label, icon: Icon, action }) => {
              const active =
                action.type === 'section'
                  ? activeSidebarItem === id ||
                    (!activeSidebarItem && section === action.section)
                  : activeSidebarItem === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => runSidebarAction(action)}
                  title={label}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary-600 text-white'
                      : 'text-primary-900 hover:bg-primary-50',
                    !expanded && 'mx-auto w-10 justify-center px-0',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 shrink-0',
                      active ? 'text-white' : 'text-primary-900',
                    )}
                    aria-hidden
                  />
                  {expanded && <span className="truncate">{label}</span>}
                </button>
              )
            },
          )}

          {/* Pulsante Espandi — sotto tutte le voci nav */}
          {!expanded && (
            <div className="mt-1 flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-expanded={false}
                aria-label="Espandi menu"
                title="Espandi menu"
                onClick={toggleSidebar}
                className="text-primary-900"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          )}
        </div>

        {/* Footer sidebar: utente + logout */}
        <div className="mt-auto flex flex-col gap-2 border-t border-(--color-border) px-2 pt-3">
          {user && (
            <div
              className={cn(
                'flex items-center gap-2 rounded-xl px-2 py-1.5 text-primary-900',
                !expanded && 'justify-center px-0',
              )}
              title={user.email}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-900"
                aria-hidden
              >
                {initials(user)}
              </span>
              {expanded && (
                <span className="min-w-0 truncate text-xs font-medium text-(--color-text-muted)">
                  {user.email}
                </span>
              )}
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size={expanded ? 'sm' : 'icon'}
            className={cn(
              'w-full text-primary-900',
              expanded ? 'justify-start gap-2' : 'justify-center',
            )}
            onClick={() => void logout()}
            title="Esci"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden />
            {expanded && <span className="truncate">Esci</span>}
          </Button>
        </div>
      </aside>

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {(section === 'prenotazioni' || section === 'home') && (
          <AdminDashboard
            restaurantSettingsSignal={restaurantSettingsSignal}
            bodyOverride={
              section === 'home' ? (
                <Suspense fallback={<SectionFallback />}>
                  <AdminHomePage
                    onOpenCrm={() => openSection('crm', 'crm')}
                    onOpenServizio={() => openSection('servizio', 'servizio')}
                  />
                </Suspense>
              ) : undefined
            }
            onBodyOverrideExit={() => openSection('prenotazioni', null)}
          />
        )}

        {section !== 'prenotazioni' && section !== 'home' && (
          <div className="flex flex-col">
            {/* Barra X — in flusso normale, spinge il contenuto in basso */}
            <div className="flex justify-end px-3 pt-3">
              <button
                type="button"
                onClick={() => openSection('prenotazioni', null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--color-border) bg-surface text-primary-900 shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Torna alla dashboard"
                title="Torna alla dashboard"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <Suspense fallback={<SectionFallback />}>
              {section === 'crm' && features.crm && <CrmPage />}
              {section === 'servizio' && features.servizio && <ServizioPage />}
              {section === 'analytics' && features.analytics && <AnalyticsPage />}
            </Suspense>
          </div>
        )}
      </main>
    </div>
  )
}
