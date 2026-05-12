import type { FC } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AnalyticsKpiCardProps {
  label: string
  value: string | number
  suffix?: string
  isLoading?: boolean
}

export const AnalyticsKpiCard: FC<AnalyticsKpiCardProps> = ({
  label,
  value,
  suffix,
  isLoading,
}) => (
  <div
    className={cn(
      'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm',
      'md:p-5',
    )}
  >
    <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)] md:text-sm">
      {label}
    </p>
    <div className="mt-2 flex min-h-[2rem] items-baseline gap-1 md:min-h-[2.25rem]">
      {isLoading ? (
        <Loader2 className="h-6 w-6 shrink-0 animate-spin text-primary-600" aria-hidden />
      ) : (
        <>
          <span className="text-2xl font-bold tabular-nums text-primary-900 md:text-3xl">{value}</span>
          {suffix ? (
            <span className="text-sm font-medium text-[var(--color-text-muted)] md:text-base">{suffix}</span>
          ) : null}
        </>
      )}
    </div>
  </div>
)
