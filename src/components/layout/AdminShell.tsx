import type { FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UtensilsCrossed,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminAuth } from '@/features/booking/hooks/useAdminAuth'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { CrmPage } from '@/pages/CrmPage'
import { AdminHomePage } from '@/pages/AdminHomePage'
import { ServizioPage } from '@/pages/ServizioPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { Button } from '@/components/ui'

export type AdminShellSection = 'home' | 'prenotazioni' | 'crm' | 'servizio' | 'analytics'

/** Voci sidebar visibili — "prenotazioni" non compare: la gestione prenotazioni
 *  è la vista di default (accessibile dall'icona calendario in cima). */

function useIsLg() {
  const [lg, setLg] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => setLg(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return lg
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

const NAV: { section: AdminShellSection; label: string; icon: typeof LayoutDashboard }[] = [
  { section: 'home', label: 'Home', icon: LayoutDashboard },
  { section: 'crm', label: 'CRM Clienti', icon: Users },
  { section: 'servizio', label: 'Servizio', icon: UtensilsCrossed },
  { section: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export const AdminShell: FC = () => {
  const isLg = useIsLg()
  const [narrowExpanded, setNarrowExpanded] = useState(false)
  const [wideCollapsed, setWideCollapsed] = useState(false)
  const [section, setSection] = useState<AdminShellSection>('prenotazioni')
  const { user, logout } = useAdminAuth()

  const sidebarExpanded = isLg ? !wideCollapsed : narrowExpanded

  const toggleSidebar = useCallback(() => {
    if (isLg) {
      setWideCollapsed((c) => !c)
    } else {
      setNarrowExpanded((e) => !e)
    }
  }, [isLg])

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--color-bg)]">
      <aside
        className={cn(
          'flex h-full shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] py-4 transition-[width] duration-200 ease-out',
          sidebarExpanded ? 'w-56' : 'w-16',
        )}
        aria-label="Navigazione principale"
      >
        <div className="flex flex-1 flex-col gap-1 px-2">
          {/* Icona calendario — torna alla gestione prenotazioni (vista default) */}
          <div className={cn('mb-1 flex', sidebarExpanded ? 'items-center justify-between gap-1 px-1' : 'justify-center')}>
            <button
              type="button"
              onClick={() => setSection('prenotazioni')}
              title="Calendario prenotazioni"
              aria-label="Calendario prenotazioni"
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                section === 'prenotazioni'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-900 hover:bg-primary-50',
                !sidebarExpanded && 'justify-center px-0 w-10',
              )}
            >
              <CalendarDays className={cn('h-5 w-5 shrink-0', section === 'prenotazioni' ? 'text-white' : 'text-primary-900')} aria-hidden />
              {sidebarExpanded && <span className="truncate">Prenotazioni</span>}
            </button>
            {sidebarExpanded && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-expanded={sidebarExpanded}
                aria-label="Comprimi menu"
                title="Comprimi menu"
                onClick={toggleSidebar}
                className="shrink-0 text-primary-900"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </Button>
            )}
          </div>
          {!sidebarExpanded && (
            <div className="mb-1 flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-expanded={sidebarExpanded}
                aria-label="Espandi menu"
                title="Espandi menu"
                onClick={toggleSidebar}
                className="text-primary-900"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          )}
          <div className="my-1 border-t border-(--color-border)" />
          {NAV.map(({ section: key, label, icon: Icon }) => {
            const active = section === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSection(key)}
                title={label}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-600 text-white'
                    : 'text-primary-900 hover:bg-primary-50',
                  !sidebarExpanded && 'justify-center px-0',
                )}
              >
                <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-white' : 'text-primary-900')} aria-hidden />
                {sidebarExpanded && <span className="truncate">{label}</span>}
              </button>
            )
          })}
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-[var(--color-border)] px-2 pt-3">
          {user && (
            <div
              className={cn(
                'flex items-center gap-2 rounded-xl px-2 py-1.5 text-primary-900',
                !sidebarExpanded && 'justify-center px-0',
              )}
              title={user.email}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-900"
                aria-hidden
              >
                {initials(user)}
              </span>
              {sidebarExpanded && (
                <span className="min-w-0 truncate text-xs font-medium text-[var(--color-text-muted)]">
                  {user.email}
                </span>
              )}
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size={sidebarExpanded ? 'sm' : 'icon'}
            className={cn(
              'w-full text-primary-900',
              sidebarExpanded ? 'justify-start gap-2' : 'justify-center',
            )}
            onClick={() => void logout()}
            title="Esci"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden />
            {sidebarExpanded && <span className="truncate">Esci</span>}
          </Button>
        </div>
      </aside>

      <main className="min-h-0 flex-1 overflow-y-auto">
        {section === 'home' && <AdminHomePage />}
        {section === 'prenotazioni' && <AdminDashboard />}
        {section === 'crm' && <CrmPage />}
        {section === 'servizio' && <ServizioPage />}
        {section === 'analytics' && <AnalyticsPage />}
      </main>
    </div>
  )
}
