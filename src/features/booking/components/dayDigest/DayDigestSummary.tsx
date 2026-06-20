import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { DayDigestSummary } from '../../utils/dayDigestModel'

interface DayDigestSummaryPanelProps {
  summary: DayDigestSummary
  /** Data selezionata in formato YYYY-MM-DD */
  date: string
  isPro: boolean
}

export function DayDigestSummaryPanel({ summary, date, isPro }: DayDigestSummaryPanelProps) {
  const formattedDate = format(new Date(date), 'EEEE, dd MMMM yyyy', { locale: it })

  return (
    <div className="mb-5">
      <h4 className="mb-4 text-center text-title-section font-semibold leading-snug text-primary-900">
        Prenotazioni del giorno:{' '}
        <span className="text-value font-normal text-(--color-text-muted)">{formattedDate}</span>
      </h4>
      {summary.totalBookings > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-4 sm:flex sm:flex-row sm:flex-wrap sm:justify-center">
          <StatChip label="Prenotazioni" value={summary.totalBookings} />
          <StatChip label="Coperti" value={summary.totalGuests} />
          <StatChip label="Con menu" value={summary.withMenuCount} />
          {isPro && (
            <StatChip
              label="Da assegnare"
              value={summary.pendingAssignments}
              variant="warning"
            />
          )}
          {summary.outOfSlotCount > 0 && (
            <StatChip label="Fuori fascia" value={summary.outOfSlotCount} variant="danger" />
          )}
        </div>
      )}
    </div>
  )
}

function StatChip({
  label,
  value,
  variant = 'default',
}: {
  label: string
  value: number
  variant?: 'default' | 'warning' | 'danger'
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border px-5 py-3',
        variant === 'warning' && 'bg-amber-50 border-amber-200 text-amber-800',
        variant === 'danger' && 'bg-red-50 border-red-200 text-red-800',
        variant === 'default' && 'bg-(--color-surface-2) border-(--color-border) text-(--color-text)',
      )}
    >
      <span className="text-stat-big font-bold leading-tight">{value}</span>
      <span className="text-body leading-tight text-(--color-text-muted)">{label}</span>
    </div>
  )
}
