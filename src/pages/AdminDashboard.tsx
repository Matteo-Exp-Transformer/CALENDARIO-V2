import React, { useEffect, useRef, useState } from 'react'
import { useBookingStats } from '@/features/booking/hooks/useBookingQueries'
import { PendingRequestsTab } from '@/features/booking/components/PendingRequestsTab'
import {
  ArchiveFiltersCard,
  ArchiveTab,
  type ArchiveFilter,
  type SortOrder,
} from '@/features/booking/components/ArchiveTab'
import { BookingCalendarTab } from '@/features/booking/components/BookingCalendarTab'
import { AdminBookingForm } from '@/features/booking/components/AdminBookingForm'
import {
  MenuPricesHeroToolbar,
  MenuPricesTab,
  type MenuPricesTabHandle,
} from '@/features/booking/components/MenuPricesTab'
import {
  Calendar,
  Clock,
  Archive,
  Plus,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  UtensilsCrossed,
  Store,
  ExternalLink,
} from 'lucide-react'
import { useAdminAuth } from '@/features/booking/hooks/useAdminAuth'
import { useRestaurantName } from '@/hooks/useRestaurantName'
import { DEFAULT_APP_THEME } from '@/features/booking/constants/appTheme'
import { useRestaurantSetting } from '@/features/booking/hooks/useRestaurantSetting'
import {
  RestaurantSettingsIntro,
  RestaurantSettingsTab,
} from '@/features/booking/components/RestaurantSettingsTab'
import { NotifyNavShinyLayers } from '@/components/ui'
import { cn } from '@/lib/utils'
import { adminBlueCtaSurfaceClass } from '@/lib/adminBlueCtaClass'
import { useTenantContext } from '@/contexts/TenantContext'

type Tab =
  | 'calendar'
  | 'pending'
  | 'archive'
  | 'menu'
  | 'settings-restaurant'

/* ─── NavItem ─── */
interface NavItemProps {
  icon: React.ElementType
  label: string
  active?: boolean
  badge?: number
  /** Solo tab Prenotazioni: shiny + pulse quando badge ≥ 1 (anche se tab attiva) */
  notifyHighlight?: boolean
  onClick: () => void
  mobileLabel?: string
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  active,
  badge,
  notifyHighlight,
  onClick,
  mobileLabel,
}) => {
  const hasBadge = badge != null && badge > 0
  const showNotifyDecor = Boolean(notifyHighlight && hasBadge)

  const inner = (
    <>
      <Icon className={cn('h-4 w-4 flex-shrink-0', active ? 'text-white' : 'text-primary-900')} />
      <span className="hidden min-w-0 truncate text-center sm:inline">{label}</span>
      <span className="min-w-0 truncate text-center sm:hidden">{mobileLabel ?? label.split(' ')[0]}</span>
      {badge != null && badge > 0 && (
        <span className="inline-flex flex-shrink-0 items-center justify-center min-w-[20px] h-5 text-xs font-bold px-1.5 rounded-full border border-primary-200 bg-primary-100 text-primary-900">
          {badge}
        </span>
      )}
    </>
  )

  if (active) {
    const activeBtn = (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'admin-nav-item admin-nav-tab-active relative w-full min-h-11 flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-3 py-2.5 text-sm font-semibold text-white cursor-pointer',
          'border-solid shadow-none',
          showNotifyDecor && 'overflow-hidden'
        )}
      >
        {showNotifyDecor && <NotifyNavShinyLayers />}
        <span className="relative z-10 flex min-w-0 w-full items-center justify-center gap-1.5 sm:gap-2">
          {inner}
        </span>
      </button>
    )
    if (showNotifyDecor) {
      return (
        <div className="admin-nav-notify-pulse-wrap min-w-0 max-w-full w-full rounded-xl">
          {activeBtn}
        </div>
      )
    }
    return activeBtn
  }

  const inactiveBtn = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'admin-nav-item relative w-full min-h-11 flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border px-2 sm:px-3 py-2.5 text-sm font-medium text-primary-900 transition-all duration-150 cursor-pointer',
        showNotifyDecor && 'overflow-hidden'
      )}
    >
      {showNotifyDecor && <NotifyNavShinyLayers />}
      {showNotifyDecor ? (
        <span className="relative z-10 flex min-w-0 w-full items-center justify-center gap-1.5 sm:gap-2">
          {inner}
        </span>
      ) : (
        inner
      )}
    </button>
  )

  if (showNotifyDecor) {
    return (
      <div className="admin-nav-notify-pulse-wrap min-w-0 max-w-full w-full rounded-xl">
        {inactiveBtn}
      </div>
    )
  }
  return inactiveBtn
}

/* ─── StatCard ─── */
const StatCard: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center shadow-sm">
    <p className="text-2xl font-black text-primary-900">{value}</p>
    <p className="text-xs font-medium text-[var(--color-text-muted)] mt-0.5">{label}</p>
  </div>
)

/* ─── Dashboard ─── */
export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('calendar')
  const [calendarTargetDate, setCalendarTargetDate] = useState<string | null>(null)
  const [showNewBookingPanel, setShowNewBookingPanel] = useState(false)
  const [archiveFilter, setArchiveFilter] = useState<ArchiveFilter>('all')
  const [archiveSortOrder, setArchiveSortOrder] = useState<SortOrder>('booking_date')
  const [menuToolbarPromoDisabled, setMenuToolbarPromoDisabled] = useState(false)
  const menuPricesTabRef = useRef<MenuPricesTabHandle>(null)
  const { data: stats } = useBookingStats()

  useEffect(() => {
    if (activeTab !== 'pending') setShowNewBookingPanel(false)
  }, [activeTab])
  const { user, logout } = useAdminAuth()
  const restaurantName = useRestaurantName()
  const { tenantSlug } = useTenantContext()
  const appIconSrc = `${import.meta.env.BASE_URL}icons/Icona-per-adminPage-no-bg.png`
  const { data: savedAppTheme = DEFAULT_APP_THEME, isPending: isAppThemePending } =
    useRestaurantSetting('app_theme')

  useEffect(() => {
    const resolved = isAppThemePending ? DEFAULT_APP_THEME : savedAppTheme
    document.documentElement.setAttribute('data-admin-theme', resolved)
    return () => document.documentElement.removeAttribute('data-admin-theme')
  }, [savedAppTheme, isAppThemePending])

  const handleViewInCalendar = (date: string) => {
    setCalendarTargetDate(date)
    setActiveTab('calendar')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /** Stessi h-9 w-9 del tasto «Torna in alto»; attivo = primary come tab header. */
  const footerQuickNavBtnClass = (isActive: boolean) =>
    cn(
      'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      isActive
        ? 'border-2 border-primary-600 bg-primary-600 text-white'
        : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-primary-900 hover:bg-[var(--color-surface-2)]',
    )

  const openPublicBookingForm = () => {
    if (!tenantSlug) return
    window.location.href = `/prenota/${tenantSlug}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">

      {/* ── Header in flusso documento: scrolla via insieme al contenuto (nessun ancoraggio sticky in alto) ── */}
      <header className="relative z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pt-4 md:gap-5 md:px-6 md:pt-6">

          {/* Top bar */}
          <div className="relative flex h-[106px] items-center justify-center overflow-hidden rounded-xl border border-primary-700/25 bg-primary-600 px-4 shadow-md md:px-6">
            <div className="absolute right-2 top-1/2 z-2 flex h-[100px] w-[100px] shrink-0 -translate-y-1/2 items-center justify-center overflow-hidden rounded-xl bg-transparent p-0 md:right-3">
              <img
                src={appIconSrc}
                alt="Icona app"
                className="h-full w-full min-h-0 min-w-0 shrink-0 rounded-lg object-contain"
              />
            </div>
            <div className="w-full px-4 md:px-28 text-center pointer-events-none">
              <h1
                className="relative -left-16 mx-auto max-w-[calc(100%-9rem)] md:max-w-[calc(100%-11rem)] overflow-hidden line-clamp-2 wrap-anywhere font-semibold italic font-serif tracking-wide text-white drop-shadow-sm leading-tight"
                style={{ fontSize: 'clamp(1.297rem, 2.767vw, 1.729rem)' }}
              >
                {restaurantName || 'Booking SaaS'}
              </h1>
            </div>
          </div>

          {/* Nav + fascia contestuale nascosti solo con form nuova prenotazione aperto (tab Pendenti). Il collapse è solo sul tab Pendenti, allo stesso posto della vecchia fascia. */}
          <div className="space-y-4 pb-4">
            {!showNewBookingPanel && (
              <>
                <nav className="grid grid-cols-2 items-start gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  <NavItem icon={Calendar} label="Calendario" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
                  <NavItem
                    icon={Clock}
                    label="Prenotazioni"
                    active={activeTab === 'pending'}
                    badge={stats?.pending}
                    notifyHighlight
                    onClick={() => setActiveTab('pending')}
                  />
                  <NavItem icon={Archive} label="Archivio" active={activeTab === 'archive'} onClick={() => setActiveTab('archive')} />
                  <NavItem icon={UtensilsCrossed} label="Menu" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
                  <NavItem
                    icon={Store}
                    label="Impostazioni locale"
                    active={activeTab === 'settings-restaurant'}
                    onClick={() => setActiveTab('settings-restaurant')}
                    mobileLabel="Impostazioni"
                  />
                  <NavItem
                    icon={ExternalLink}
                    label="Visualizza Form Pubblico"
                    mobileLabel="Form"
                    onClick={() => {
                      if (!tenantSlug) return
                      window.location.href = `/prenota/${tenantSlug}`
                    }}
                  />
                </nav>

                {activeTab === 'calendar' && (
                  <div className="grid grid-cols-2 min-[470px]:grid-cols-4 gap-2 md:gap-3">
                    <StatCard label="Oggi" value={stats?.totalDay || 0} />
                    <StatCard label="Settimana" value={stats?.totalWeek || 0} />
                    <StatCard label="Mese" value={stats?.totalMonth || 0} />
                    <StatCard label="Rifiutate" value={stats?.rejected || 0} />
                  </div>
                )}

                {activeTab === 'archive' && (
                  <ArchiveFiltersCard
                    filter={archiveFilter}
                    sortOrder={archiveSortOrder}
                    onFilterChange={setArchiveFilter}
                    onSortOrderChange={setArchiveSortOrder}
                  />
                )}

                {activeTab === 'menu' && (
                  <MenuPricesHeroToolbar
                    promoDisabled={menuToolbarPromoDisabled}
                    onAddProduct={() => menuPricesTabRef.current?.startAddProduct()}
                    onAddCategory={() => menuPricesTabRef.current?.startAddCategory()}
                    onPresetMenus={() => menuPricesTabRef.current?.openPresetMenus()}
                    onPromo={() => menuPricesTabRef.current?.openPromo()}
                  />
                )}

                {activeTab === 'settings-restaurant' && <RestaurantSettingsIntro />}
              </>
            )}

            {activeTab === 'pending' && (
              <div className="w-full overflow-hidden rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-md min-h-0">
                <button
                  type="button"
                  onClick={() => setShowNewBookingPanel((p) => !p)}
                  className="admin-new-booking-collapse-trigger flex w-full items-center justify-between gap-3 rounded-t-xl px-4 py-[1.333rem] text-white transition-[background-image,transform] duration-200 md:gap-4 md:px-6 md:py-[1.667rem]"
                >
                  <div
                    className="flex min-w-0 flex-1 items-baseline justify-start gap-2.5 font-semibold tracking-tight text-white leading-[1.35]"
                    style={{ fontSize: 'calc(clamp(1.125rem, 0.9rem + 1.1vw, 1.625rem) * 2 / 3)' }}
                  >
                    <Plus
                      aria-hidden
                      className="w-[1.05em] h-[1.05em] shrink-0 translate-y-[0.06em] text-white/95"
                    />
                    <span className="min-w-0 truncate drop-shadow-sm">Inserisci Nuova Prenotazione</span>
                  </div>
                  <ChevronDown
                    aria-hidden
                    className={`h-5 w-5 shrink-0 text-white/90 transition-transform md:h-6 md:w-6 ${showNewBookingPanel ? 'rotate-180' : ''}`}
                  />
                </button>
                {showNewBookingPanel && (
                  <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-5">
                    <AdminBookingForm />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main: tolto dal flusso con form lungo aperto (solo hero + collapse + footer nella pagina) ── */}
      <main
        className={cn(
          'flex-1 w-full space-y-4 pb-12 md:pb-16',
          /* Archivio: meno vuoto sopra il blocco filtri rispetto all’header */
          activeTab === 'archive' ? 'pt-3 md:pt-4' : 'pt-6',
          showNewBookingPanel && 'hidden',
        )}
      >
        {/* Tab content */}
        <div
          className={cn(
            'mx-auto w-full max-w-7xl px-4 md:px-6',
            activeTab === 'archive' ? 'pb-6 pt-3 md:pb-7 md:pt-4' : 'py-5 md:py-7',
            /* Nessun min-h sulla tab Pendenti: lista vuota resta corta così il footer è in vista senza scroll */
            activeTab !== 'menu' && activeTab !== 'pending' && 'min-h-[500px]'
          )}
        >
          {activeTab === 'calendar' && <BookingCalendarTab initialDate={calendarTargetDate} />}
          {activeTab === 'pending'  && <PendingRequestsTab />}
          {activeTab === 'archive' && (
            <ArchiveTab
              onViewInCalendar={handleViewInCalendar}
              filter={archiveFilter}
              sortOrder={archiveSortOrder}
            />
          )}
          {activeTab === 'menu' && (
            <MenuPricesTab
              ref={menuPricesTabRef}
              omitHeroSection
              onToolbarPromoDisabled={setMenuToolbarPromoDisabled}
            />
          )}
          {activeTab === 'settings-restaurant' && <RestaurantSettingsTab />}
        </div>
      </main>

      <footer className="flex min-h-[62px] items-center border-t border-[var(--color-border)] bg-[var(--color-bg)] py-3">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="flex min-w-0 w-full flex-col items-stretch gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-2 md:gap-3 md:px-6">
            <div className="flex min-w-0 shrink-0 items-center gap-2 sm:max-w-[min(40%,18rem)]">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100">
                <User className="h-3.5 w-3.5 text-primary-600" />
              </div>
              <span className="truncate text-xs font-medium text-[var(--color-text-muted)]">{user?.email}</span>
            </div>

            <nav
              className="flex flex-1 flex-wrap items-center justify-center gap-2"
              aria-label="Scorciatoie sezioni dashboard"
            >
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={footerQuickNavBtnClass(activeTab === 'calendar')}
                aria-label="Calendario"
                title="Calendario"
              >
                <Calendar
                  className={cn('h-4 w-4 shrink-0', activeTab === 'calendar' ? 'text-white' : 'text-slate-800')}
                  aria-hidden
                />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={footerQuickNavBtnClass(activeTab === 'pending')}
                aria-label="Prenotazioni"
                title="Prenotazioni"
              >
                <Clock
                  className={cn('h-4 w-4 shrink-0', activeTab === 'pending' ? 'text-white' : 'text-slate-800')}
                  aria-hidden
                />
                {stats != null && stats.pending != null && stats.pending > 0 ? (
                  <span className="pointer-events-none absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full border border-primary-200 bg-primary-100 px-0.5 text-[10px] font-bold text-primary-900">
                    {stats.pending > 99 ? '99+' : stats.pending}
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('archive')}
                className={footerQuickNavBtnClass(activeTab === 'archive')}
                aria-label="Archivio"
                title="Archivio"
              >
                <Archive
                  className={cn('h-4 w-4 shrink-0', activeTab === 'archive' ? 'text-white' : 'text-slate-800')}
                  aria-hidden
                />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className={footerQuickNavBtnClass(activeTab === 'menu')}
                aria-label="Menu"
                title="Menu"
              >
                <UtensilsCrossed
                  className={cn('h-4 w-4 shrink-0', activeTab === 'menu' ? 'text-white' : 'text-slate-800')}
                  aria-hidden
                />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings-restaurant')}
                className={footerQuickNavBtnClass(activeTab === 'settings-restaurant')}
                aria-label="Impostazioni locale"
                title="Impostazioni locale"
              >
                <Store
                  className={cn(
                    'h-4 w-4 shrink-0',
                    activeTab === 'settings-restaurant' ? 'text-white' : 'text-slate-800',
                  )}
                  aria-hidden
                />
              </button>
              <button
                type="button"
                onClick={openPublicBookingForm}
                className={footerQuickNavBtnClass(false)}
                aria-label="Visualizza form pubblico prenotazioni"
                title="Visualizza Form Pubblico"
              >
                <ExternalLink className="h-4 w-4 shrink-0 text-slate-800" aria-hidden />
              </button>
            </nav>

            <div className="flex shrink-0 items-center justify-center gap-2 sm:justify-end">
              <button
                type="button"
                onClick={scrollToTop}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-slate-700 shadow-sm transition-colors hover:bg-[var(--color-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label="Torna in alto"
                title="Torna in alto"
              >
                <ChevronUp className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={logout}
                className={cn('flex shrink-0 items-center gap-1.5', adminBlueCtaSurfaceClass)}
              >
                <LogOut className="h-3.5 w-3.5 text-white" />
                <span className="text-white">Log-out</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
