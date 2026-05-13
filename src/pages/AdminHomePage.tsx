import type { FC } from 'react'
import { useState } from 'react'
import { Calendar, ConciergeBell, Loader2, Users, Clock, UserPlus, Printer } from 'lucide-react'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { useHomeStats } from '@/features/booking/hooks/useHomeStats'
import { WalkInModal } from '@/features/booking/components/home/WalkInModal'
import { ShiftBriefingModal } from '@/features/booking/components/home/ShiftBriefingModal'
import { useRestaurantSetting } from '@/features/booking/hooks/useRestaurantSetting'

export interface AdminHomePageProps {
  onOpenPrenotazioni: () => void
  onOpenCrm: () => void
  onOpenServizio: () => void
}

interface QuickNavButtonProps {
  icon: typeof Calendar
  label: string
  description: string
  onClick: () => void
}

const QuickNavButton: FC<QuickNavButtonProps> = ({
  icon: Icon,
  label,
  description,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'group flex items-center gap-3 rounded-xl border border-(--color-border) bg-surface p-4 text-left shadow-sm transition-colors',
      'hover:border-primary-300 hover:bg-primary-50',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    )}
  >
    <span
      aria-hidden
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition-colors group-hover:bg-primary-200"
    >
      <Icon className="h-5 w-5" />
    </span>
    <span className="flex min-w-0 flex-col">
      <span className="truncate text-sm font-semibold text-primary-900">{label}</span>
      <span className="truncate text-xs text-(--color-text-muted)">{description}</span>
    </span>
  </button>
)

interface StatCardProps {
  label: string
  value: number
  isLoading?: boolean
}

const StatCard: FC<StatCardProps> = ({ label, value, isLoading }) => (
  <div className="rounded-xl border border-(--color-border) bg-surface p-4 shadow-sm md:p-5">
    <p className="text-xs font-medium uppercase tracking-wide text-(--color-text-muted) md:text-sm">
      {label}
    </p>
    <div className="mt-2 flex min-h-8 items-baseline gap-1 md:min-h-9">
      {isLoading ? (
        <Loader2 className="h-6 w-6 shrink-0 animate-spin text-primary-600" aria-hidden />
      ) : (
        <span className="text-2xl font-bold tabular-nums text-primary-900 md:text-3xl">
          {value}
        </span>
      )}
    </div>
  </div>
)

export const AdminHomePage: FC<AdminHomePageProps> = ({
  onOpenPrenotazioni,
  onOpenCrm,
  onOpenServizio,
}) => {
  const { stats, upcoming, isLoading, error } = useHomeStats()
  const { data: businessHoursRaw } = useRestaurantSetting('business_hours')

  const [walkInOpen, setWalkInOpen] = useState(false)
  const [briefingOpen, setBriefingOpen] = useState(false)

  const pendingCount = stats.pendingToday

  return (
    <div className="min-h-0 flex-1 bg-(--color-bg) px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-xl font-bold text-primary-900 md:text-2xl">Home</h1>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            Riepilogo della giornata e accesso rapido alle sezioni principali.
          </p>
        </header>

        {/* Banner alert richieste in attesa */}
        {!isLoading && pendingCount > 0 && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-(--color-warning) bg-warning-50 px-4 py-3">
            <p className="text-sm font-medium text-warning-900">
              Hai {pendingCount} {pendingCount === 1 ? 'richiesta in attesa' : 'richieste in attesa'} di conferma
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onOpenPrenotazioni}
            >
              Vai a Prenotazioni
            </Button>
          </div>
        )}

        {/* Quick-nav: 5 pulsanti su 2-3 colonne */}
        <nav
          aria-label="Scorciatoie sezioni dashboard"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <QuickNavButton
            icon={Calendar}
            label="Calendario"
            description="Prenotazioni e tab operativi"
            onClick={onOpenPrenotazioni}
          />
          <QuickNavButton
            icon={Users}
            label="CRM Clienti"
            description="Anagrafica e storico"
            onClick={onOpenCrm}
          />
          <QuickNavButton
            icon={ConciergeBell}
            label="Servizio"
            description="Gestione tavoli e sale"
            onClick={onOpenServizio}
          />
          <QuickNavButton
            icon={UserPlus}
            label="Aggiungi walk-in"
            description="Cliente senza prenotazione"
            onClick={() => setWalkInOpen(true)}
          />
          <QuickNavButton
            icon={Printer}
            label="Briefing turno"
            description="Stampa o scarica PDF"
            onClick={() => setBriefingOpen(true)}
          />
        </nav>

        {/* Stat card */}
        <section
          aria-label="Statistiche di oggi"
          className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
        >
          <StatCard label="Prenotazioni oggi" value={stats.totalToday} isLoading={isLoading} />
          <StatCard
            label="Coperti confermati"
            value={stats.confirmedCoversToday}
            isLoading={isLoading}
          />
          <StatCard
            label="In attesa di conferma"
            value={stats.pendingToday}
            isLoading={isLoading}
          />
        </section>

        {/* Prossime 3 ore */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary-700" aria-hidden />
            <h2 className="text-sm font-semibold text-primary-900 md:text-base">
              Prossime 3 ore
            </h2>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <p className="font-semibold">Impossibile caricare le prossime prenotazioni.</p>
              <p className="mt-1">{error.message}</p>
            </div>
          ) : isLoading ? (
            <div
              className="flex h-24 items-center justify-center rounded-xl border border-(--color-border) bg-surface shadow-sm"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" aria-hidden />
              <span className="sr-only">Caricamento prossime prenotazioni</span>
            </div>
          ) : upcoming.length === 0 ? (
            <p className="rounded-xl border border-(--color-border) bg-surface px-4 py-6 text-center text-sm text-(--color-text-muted) shadow-sm">
              Nessuna prenotazione confermata nelle prossime 3 ore.
            </p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-(--color-border) bg-surface px-4 py-3 shadow-sm"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold text-primary-900">
                      {b.client_name}
                    </span>
                    <span className="text-xs text-(--color-text-muted)">
                      {b.num_guests} {b.num_guests === 1 ? 'coperto' : 'coperti'}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-lg bg-primary-50 px-3 py-1 text-sm font-semibold tabular-nums text-primary-900">
                    {format(b.start, 'HH:mm', { locale: it })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <WalkInModal isOpen={walkInOpen} onClose={() => setWalkInOpen(false)} />
      <ShiftBriefingModal
        isOpen={briefingOpen}
        onClose={() => setBriefingOpen(false)}
        businessHoursRaw={businessHoursRaw}
      />
    </div>
  )
}
