import React, { useState } from 'react'
import { useBookingStats } from '@/features/booking/hooks/useBookingQueries'
import { PendingRequestsTab } from '@/features/booking/components/PendingRequestsTab'
import { ArchiveTab } from '@/features/booking/components/ArchiveTab'
import { BookingCalendarTab } from '@/features/booking/components/BookingCalendarTab'
import { AdminBookingForm } from '@/features/booking/components/AdminBookingForm'
import { MenuPricesTab } from '@/features/booking/components/MenuPricesTab'
import {
  Calendar,
  Clock,
  Archive,
  Plus,
  User,
  LogOut,
  ChevronDown,
  UtensilsCrossed,
  Store,
  ExternalLink,
} from 'lucide-react'
import { useAdminAuth } from '@/features/booking/hooks/useAdminAuth'
import { useRestaurantName } from '@/hooks/useRestaurantName'
import { RestaurantSettingsTab } from '@/features/booking/components/RestaurantSettingsTab'
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
      <Icon className={cn('h-4 w-4 flex-shrink-0', active ? 'text-primary-900' : 'text-slate-800')} />
      <span className="hidden min-w-0 truncate text-center sm:inline">{label}</span>
      <span className="min-w-0 truncate text-center sm:hidden">{mobileLabel ?? label.split(' ')[0]}</span>
      {badge != null && badge > 0 && (
        <span className="inline-flex flex-shrink-0 items-center justify-center min-w-[20px] h-5 text-xs font-bold px-1.5 rounded-full bg-primary-600 text-white">
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
          'admin-nav-item admin-nav-tab-active relative w-full min-h-11 flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-3 py-2.5 text-sm font-semibold text-slate-900 cursor-pointer',
          '[background-image:none] bg-orange-200',
          'border-solid border-4 shadow-none'
        )}
      >
        {showNotifyDecor && <NotifyNavShinyLayers />}
        <span className="relative z-10 flex min-w-0 w-full items-center justify-center gap-1.5 sm:gap-2">
          {inner}
        </span>
      </button>
    )
    if (showNotifyDecor) {
      return <div className="admin-nav-notify-pulse-wrap w-full rounded-xl">{activeBtn}</div>
    }
    return activeBtn
  }

  const inactiveBtn = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'admin-nav-item relative w-full min-h-11 flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border px-2 sm:px-3 py-2.5 text-sm font-medium text-slate-900 transition-all duration-150 cursor-pointer',
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
    return <div className="admin-nav-notify-pulse-wrap w-full rounded-xl">{inactiveBtn}</div>
  }
  return inactiveBtn
}

/* ─── StatCard ─── */
const StatCard: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="admin-warm-surface rounded-xl border-2 p-4 text-center shadow-sm">
    <p className="text-2xl font-black text-slate-800">{value}</p>
    <p className="text-xs font-medium text-slate-600 mt-0.5">{label}</p>
  </div>
)

/* ─── Dashboard ─── */
export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('calendar')
  const [calendarTargetDate, setCalendarTargetDate] = useState<string | null>(null)
  const [showNewBookingPanel, setShowNewBookingPanel] = useState(false)
  const { data: stats } = useBookingStats()
  const { user, logout } = useAdminAuth()
  const restaurantName = useRestaurantName()
  const { tenantSlug } = useTenantContext()
  const appIconSrc = `${import.meta.env.BASE_URL}icons/Icona-per-adminPage-no-bg.png`

  const handleViewInCalendar = (date: string) => {
    setCalendarTargetDate(date)
    setActiveTab('calendar')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">

      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pt-4 md:gap-5 md:px-6 md:pt-6">

          {/* Top bar */}
          <div className="admin-warm-surface relative flex h-[106px] items-center justify-center overflow-hidden rounded-xl border shadow-sm px-4 md:px-6">
            <div className="absolute right-2 top-1/2 z-2 flex h-[100px] w-[100px] shrink-0 -translate-y-1/2 items-center justify-center overflow-hidden rounded-xl bg-transparent p-0 md:right-3">
              <img
                src={appIconSrc}
                alt="Icona app"
                className="h-full w-full min-h-0 min-w-0 shrink-0 rounded-lg object-contain"
              />
            </div>
            <div className="w-full px-4 md:px-28 text-center pointer-events-none">
              <h1
                className="relative -left-16 mx-auto max-w-[calc(100%-9rem)] md:max-w-[calc(100%-11rem)] overflow-hidden line-clamp-2 wrap-anywhere font-semibold italic font-serif tracking-wide text-slate-800 leading-tight"
                style={{ fontSize: 'clamp(1.297rem, 2.767vw, 1.729rem)' }}
              >
                {restaurantName || 'Booking SaaS'}
              </h1>
            </div>
          </div>

          {/* Stats + Nav */}
          <div className="pb-4 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 min-[470px]:grid-cols-4 gap-2 md:gap-3">
              <StatCard label="Oggi" value={stats?.totalDay || 0} />
              <StatCard label="Settimana" value={stats?.totalWeek || 0} />
              <StatCard label="Mese" value={stats?.totalMonth || 0} />
              <StatCard label="Rifiutate" value={stats?.rejected || 0} />
            </div>

            <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              <NavItem icon={Calendar} label="Calendario"          active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
              <NavItem
                icon={Clock}
                label="Prenotazioni Pendenti"
                active={activeTab === 'pending'}
                badge={stats?.pending}
                notifyHighlight
                onClick={() => setActiveTab('pending')}
              />
              <NavItem icon={Archive}  label="Archivio"             active={activeTab === 'archive'}  onClick={() => setActiveTab('archive')} />
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
          </div>
        </div>
      </header>

      {/* ── Main: collapse più largo (~2× max-w-7xl); area tab resta max-w-7xl ── */}
      <main className="flex-1 w-full pt-6 pb-12 md:pb-16 space-y-4">
        {/* Pannello nuova prenotazione collassabile — larghezza fino a 160rem (doppio di 7xl), centrato */}
        <div className="flex w-full justify-center px-4 md:px-6">
          <div
            className="w-full max-w-[min(100%,160rem)] overflow-hidden rounded-xl border-2 border-[rgba(45,212,191,0.55)] bg-white shadow-md"
          >
            <button
              type="button"
              onClick={() => setShowNewBookingPanel(p => !p)}
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
                className={`h-5 w-5 shrink-0 text-[rgba(6,64,50,0.88)] transition-transform md:h-6 md:w-6 ${showNewBookingPanel ? 'rotate-180' : ''}`}
              />
            </button>
            {showNewBookingPanel && (
              <div className="border-t border-slate-200 bg-white px-5 py-5">
                <AdminBookingForm />
              </div>
            )}
          </div>
        </div>

        {/* Tab content */}
        <div
          className={cn(
            'mx-auto w-full max-w-7xl px-4 md:px-6 py-5 md:py-7',
            activeTab !== 'menu' && 'min-h-[500px]'
          )}
        >
          {activeTab === 'calendar' && <BookingCalendarTab initialDate={calendarTargetDate} />}
          {activeTab === 'pending'  && <PendingRequestsTab />}
          {activeTab === 'archive'  && <ArchiveTab onViewInCalendar={handleViewInCalendar} />}
          {activeTab === 'menu' && <MenuPricesTab />}
          {activeTab === 'settings-restaurant' && <RestaurantSettingsTab />}
        </div>
      </main>

      <footer className="flex min-h-[62px] items-center border-t border-slate-100 bg-white py-3">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="admin-warm-surface flex min-w-0 w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm md:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100">
                <User className="h-3.5 w-3.5 text-primary-600" />
              </div>
              <span className="truncate text-xs font-medium text-slate-600">{user?.email}</span>
            </div>
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
      </footer>
    </div>
  )
}
