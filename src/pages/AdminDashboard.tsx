import React, { useState } from 'react'
import { useBookingStats } from '@/features/booking/hooks/useBookingQueries'
import { PendingRequestsTab } from '@/features/booking/components/PendingRequestsTab'
import { ArchiveTab } from '@/features/booking/components/ArchiveTab'
import { BookingCalendarTab } from '@/features/booking/components/BookingCalendarTab'
import { AdminBookingForm } from '@/features/booking/components/AdminBookingForm'
import { MenuPricesTab } from '@/features/booking/components/MenuPricesTab'
import { Calendar, Clock, Archive, Plus, User, LogOut, ChevronDown, UtensilsCrossed } from 'lucide-react'
import { useAdminAuth } from '@/features/booking/hooks/useAdminAuth'
import { useTenantContext } from '@/contexts/TenantContext'

type Tab = 'calendar' | 'pending' | 'archive' | 'menu'

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
    className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium
      transition-all duration-150 min-h-[40px] cursor-pointer
      ${active
        ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 border border-transparent'
      }`}
  >
    <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-primary-600' : 'text-slate-400'}`} />
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden">{label.split(' ')[0]}</span>
    {badge != null && badge > 0 && (
      <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 text-xs font-bold px-1.5 rounded-full bg-primary-600 text-white">
        {badge}
      </span>
    )}
  </button>
)

/* ─── StatCard ─── */
const StatCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className={`bg-white rounded-xl border-2 ${color} p-4 text-center`}>
    <p className="text-2xl font-black text-slate-800">{value}</p>
    <p className="text-xs font-medium text-slate-500 mt-0.5">{label}</p>
  </div>
)

/* ─── Dashboard ─── */
export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('calendar')
  const [calendarTargetDate, setCalendarTargetDate] = useState<string | null>(null)
  const [showNewBookingPanel, setShowNewBookingPanel] = useState(false)
  const { data: stats } = useBookingStats()
  const { user, logout } = useAdminAuth()
  const { organizationName } = useTenantContext()

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
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800 leading-tight">
                  {organizationName || 'Booking SaaS'}
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
              <StatCard label="Oggi" value={stats?.totalDay || 0} color="border-cyan-200" />
              <StatCard label="Settimana" value={stats?.totalWeek || 0} color="border-violet-200" />
              <StatCard label="Mese" value={stats?.totalMonth || 0} color="border-blue-200" />
              <StatCard label="Rifiutate" value={stats?.rejected || 0} color="border-rose-200" />
            </div>

            {/* Nav */}
            <nav className="flex flex-wrap items-center gap-2">
              <NavItem icon={Calendar} label="Calendario"          active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
              <NavItem icon={Clock}    label="Prenotazioni Pendenti" active={activeTab === 'pending'}  badge={stats?.pending} onClick={() => setActiveTab('pending')} />
              <NavItem icon={Archive}  label="Archivio"             active={activeTab === 'archive'}  onClick={() => setActiveTab('archive')} />
              <NavItem icon={UtensilsCrossed} label="Menu" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
            </nav>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 space-y-4">

        {/* Pannello nuova prenotazione collassabile */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowNewBookingPanel(p => !p)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary-600" />
              Inserisci nuova prenotazione
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showNewBookingPanel ? 'rotate-180' : ''}`}
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
          {activeTab === 'menu'     && <MenuPricesTab />}
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
        Booking SaaS v2.0 — {organizationName}
      </footer>
    </div>
  )
}
