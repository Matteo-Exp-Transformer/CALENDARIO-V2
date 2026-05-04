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
  SlidersHorizontal,
  Store,
} from 'lucide-react'
import { useAdminAuth } from '@/features/booking/hooks/useAdminAuth'
import { useRestaurantName } from '@/hooks/useRestaurantName'
import { SettingsTab } from '@/features/booking/components/SettingsTab'
import { RestaurantSettingsTab } from '@/features/booking/components/RestaurantSettingsTab'

type Tab =
  | 'calendar'
  | 'pending'
  | 'archive'
  | 'menu'
  | 'settings-system'
  | 'settings-restaurant'

const ADMIN_WARM_GRADIENT_SURFACE: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(90deg, rgb(255 237 213) 0%, rgb(255 247 237) 42%, rgb(254 249 195) 100%)',
  borderColor: 'rgba(253, 186, 116, 0.55)'
}

/* ─── NavItem ─── */
interface NavItemProps {
  icon: React.ElementType
  label: string
  active?: boolean
  badge?: number
  onClick: () => void
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, badge, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="relative w-full min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border px-2 sm:px-3 py-2.5 text-sm font-medium text-slate-900 transition-all duration-150 cursor-pointer hover:border-amber-500/45"
    style={{
      ...ADMIN_WARM_GRADIENT_SURFACE,
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
    <span className="min-w-0 truncate text-center sm:hidden">{label.split(' ')[0]}</span>
    {badge != null && badge > 0 && (
      <span className="inline-flex flex-shrink-0 items-center justify-center min-w-[20px] h-5 text-xs font-bold px-1.5 rounded-full bg-primary-600 text-white">
        {badge}
      </span>
    )}
  </button>
)

/* ─── StatCard ─── */
type StatCardTone = 'metrics' | 'rejected'

const STAT_CARD_SURFACE: Record<StatCardTone, React.CSSProperties> = {
  metrics: {
    backgroundImage:
      'linear-gradient(145deg, rgb(224 242 254) 0%, rgb(219 234 254) 40%, rgb(220 252 231) 100%)',
    borderColor: 'rgba(56, 189, 248, 0.45)'
  },
  rejected: {
    backgroundImage:
      'linear-gradient(165deg, rgb(255 255 255) 0%, rgb(254 242 242) 35%, rgb(254 202 202) 72%, rgb(252 165 165) 100%)',
    borderColor: 'rgba(248 113 113, 0.65)'
  }
}

const StatCard: React.FC<{ label: string; value: number; tone: StatCardTone }> = ({ label, value, tone }) => (
  <div className="rounded-xl border-2 p-4 text-center shadow-sm" style={STAT_CARD_SURFACE[tone]}>
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

  const handleViewInCalendar = (date: string) => {
    setCalendarTargetDate(date)
    setActiveTab('calendar')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Top bar */}
          <div
            className="flex items-center justify-between h-16 rounded-xl shadow-sm border"
            style={ADMIN_WARM_GRADIENT_SURFACE}
          >
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800 leading-tight">
                  {restaurantName || 'Booking SaaS'}
                </h1>
                <p className="text-xs text-slate-400">Dashboard Admin</p>
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary-600" />
                </div>
                <span className="text-xs text-slate-600 font-medium max-w-[140px] truncate">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Esci</span>
              </button>
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
                icon={SlidersHorizontal}
                label="Impostazioni sistema"
                active={activeTab === 'settings-system'}
                onClick={() => setActiveTab('settings-system')}
              />
              <NavItem
                icon={Store}
                label="Impostazioni locale"
                active={activeTab === 'settings-restaurant'}
                onClick={() => setActiveTab('settings-restaurant')}
              />
            </nav>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 space-y-4">

        {/* Pannello nuova prenotazione collassabile */}
        <div className="rounded-xl border border-emerald-200/80 shadow-sm overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => setShowNewBookingPanel(p => !p)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-white
              bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-100
              hover:from-emerald-700 hover:via-emerald-600 hover:to-emerald-200
              transition-all duration-200 rounded-t-xl"
          >
            <span className="flex items-center gap-2 drop-shadow-sm">
              <Plus className="w-4 h-4 text-emerald-50" />
              Inserisci nuova prenotazione
            </span>
            <ChevronDown
              className={`w-4 h-4 text-emerald-900/75 transition-transform duration-200 ${showNewBookingPanel ? 'rotate-180' : ''}`}
            />
          </button>
          {showNewBookingPanel && (
            <div className="border-t border-slate-100 px-5 py-5">
              <AdminBookingForm />
            </div>
          )}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-7 min-h-[500px]">
          {activeTab === 'calendar' && <BookingCalendarTab initialDate={calendarTargetDate} />}
          {activeTab === 'pending'  && <PendingRequestsTab />}
          {activeTab === 'archive'  && <ArchiveTab onViewInCalendar={handleViewInCalendar} />}
          {activeTab === 'menu' && <MenuPricesTab />}
          {activeTab === 'settings-system' && <SettingsTab />}
          {activeTab === 'settings-restaurant' && <RestaurantSettingsTab />}
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
        Booking SaaS v2.0 — {restaurantName}
      </footer>
    </div>
  )
}
