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
import { ADMIN_WARM_GRADIENT_SURFACE } from '@/lib/adminWarmGradientSurface'
import { cn } from '@/lib/utils'
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
  onClick: () => void
  mobileLabel?: string
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, badge, onClick, mobileLabel }) => (
  <button
    type="button"
    onClick={onClick}
    className="admin-nav-item relative w-full min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border px-2 sm:px-3 py-2.5 text-sm font-medium text-slate-900 transition-all duration-150 cursor-pointer"
    style={{
      ...(active
        ? {
            boxShadow:
              'inset 0 0 0 2px rgba(255, 255, 255, 0.88), 0 1px 6px rgba(180, 83, 9, 0.18)'
          }
        : {})
    }}
  >
    <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-primary-900' : 'text-slate-800'}`} />
    <span className="hidden min-w-0 truncate text-center sm:inline">{label}</span>
    <span className="min-w-0 truncate text-center sm:hidden">{mobileLabel ?? label.split(' ')[0]}</span>
    {badge != null && badge > 0 && (
      <span className="inline-flex flex-shrink-0 items-center justify-center min-w-[20px] h-5 text-xs font-bold px-1.5 rounded-full bg-primary-600 text-white">
        {badge}
      </span>
    )}
  </button>
)

/* ─── StatCard ─── */
type StatCardTone = 'metrics' | 'rejected'

/** Stesso sfondo della strip brand in header (nome locale + “Dashboard Admin”) */
const STAT_CARD_SURFACE: Record<StatCardTone, React.CSSProperties> = {
  metrics: { ...ADMIN_WARM_GRADIENT_SURFACE },
  rejected: { ...ADMIN_WARM_GRADIENT_SURFACE },
}

const StatCard: React.FC<{ label: string; value: number; tone: StatCardTone }> = ({ label, value, tone }) => (
  <div
    className="rounded-xl border-2 p-4 text-center shadow-sm"
    style={STAT_CARD_SURFACE[tone]}
  >
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
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Top bar */}
          <div
            className="relative flex items-center justify-center h-[106px] rounded-xl shadow-sm border px-4 md:px-6"
            style={ADMIN_WARM_GRADIENT_SURFACE}
          >
            <div
              className="absolute flex h-[103px] w-[103px] items-center rounded-xl overflow-hidden p-3 shadow-sm md:h-[136px] md:w-[136px] md:p-4"
              style={{
                ...ADMIN_WARM_GRADIENT_SURFACE,
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
              }}
            >
              <img
                src={appIconSrc}
                alt="Icona app"
                className="h-full w-full rounded-lg object-contain"
              />
            </div>
            <div className="w-full px-4 md:px-28 text-center pointer-events-none">
              <h1
                className="mx-auto max-w-[calc(100%-9rem)] md:max-w-[calc(100%-11rem)] overflow-hidden break-words font-semibold italic font-serif tracking-wide text-slate-800 leading-tight"
                style={{
                  fontSize: 'clamp(1.297rem, 2.767vw, 1.729rem)',
                  position: 'relative',
                  left: '-64px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflowWrap: 'anywhere',
                }}
              >
                {restaurantName || 'Booking SaaS'}
              </h1>
            </div>
          </div>

          {/* Stats + Nav */}
          <div className="pb-4 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              <StatCard label="Oggi" value={stats?.totalDay || 0} tone="metrics" />
              <StatCard label="Settimana" value={stats?.totalWeek || 0} tone="metrics" />
              <StatCard label="Mese" value={stats?.totalMonth || 0} tone="metrics" />
              <StatCard label="Rifiutate" value={stats?.rejected || 0} tone="rejected" />
            </div>

            <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              <NavItem icon={Calendar} label="Calendario"          active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
              <NavItem icon={Clock}    label="Prenotazioni Pendenti" active={activeTab === 'pending'}  badge={stats?.pending} onClick={() => setActiveTab('pending')} />
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
                mobileLabel="Visualizza Form Pubblico"
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
            className="w-full overflow-hidden rounded-xl border-2 border-[rgba(45,212,191,0.55)] bg-white shadow-md"
            style={{ maxWidth: 'min(100%, 160rem)' }}
          >
            <button
              type="button"
              onClick={() => setShowNewBookingPanel(p => !p)}
              className="admin-new-booking-collapse-trigger flex w-full items-center justify-between gap-3 rounded-t-xl px-4 py-[1.333rem] text-white transition-[background-image,transform] duration-200 md:gap-4 md:px-6 md:py-[1.667rem]"
            >
              <div
                className="flex min-w-0 flex-1 items-baseline justify-start gap-2.5 font-semibold tracking-tight text-white"
                style={{
                  fontSize: 'calc(clamp(1.125rem, 0.9rem + 1.1vw, 1.625rem) * 2 / 3)',
                  lineHeight: 1.35,
                }}
              >
                <Plus
                  aria-hidden
                  className="shrink-0 translate-y-[0.06em] text-white/95"
                  style={{ width: '1.05em', height: '1.05em' }}
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
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div
          className={cn(
            'rounded-xl border border-slate-200 bg-white shadow-sm p-5 md:p-7',
            activeTab !== 'menu' && 'min-h-[500px]'
          )}
        >
          {activeTab === 'calendar' && <BookingCalendarTab initialDate={calendarTargetDate} />}
          {activeTab === 'pending'  && <PendingRequestsTab />}
          {activeTab === 'archive'  && <ArchiveTab onViewInCalendar={handleViewInCalendar} />}
          {activeTab === 'menu' && <MenuPricesTab />}
          {activeTab === 'settings-restaurant' && <RestaurantSettingsTab />}
        </div>
        </div>
      </main>

      <footer
        className="min-h-[62px] py-3 border-t border-slate-100 flex items-center"
        style={ADMIN_WARM_GRADIENT_SURFACE}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex w-full items-center justify-between gap-4">
          <div
            className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border shadow-sm px-4 py-3 md:px-6"
            style={ADMIN_WARM_GRADIENT_SURFACE}
          >
            <div className="w-6 h-6 shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary-600" />
            </div>
            <span className="truncate text-xs text-slate-600 font-medium">{user?.email}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              bg-[#1e3a8a] !text-white hover:bg-[#1e40af] transition-colors"
            style={{ color: '#ffffff' }}
          >
            <LogOut className="w-3.5 h-3.5 !text-white" />
            <span className="!text-white" style={{ color: '#ffffff' }}>Log-out</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
