import type { FC } from 'react'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { AnalyticsKpiCard } from '@/features/booking/components/analytics/AnalyticsKpiCard'
import { AnalyticsTrendChart } from '@/features/booking/components/analytics/AnalyticsTrendChart'
import { useAnalytics, type DateRange } from '@/features/booking/hooks/useAnalytics'

export const AnalyticsPage: FC = () => {
  const [range, setRange] = useState<DateRange>('7d')
  const { data, isLoading, error } = useAnalytics(range)

  const kpi = data?.kpi
  const trend = data?.trend ?? []
  const hasData = data?.hasData ?? false

  return (
    <div className="min-h-0 flex-1 bg-(--color-bg) px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-primary-900 md:text-2xl">Analytics</h1>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant={range === '7d' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setRange('7d')}
            >
              7g
            </Button>
            <Button
              type="button"
              variant={range === '30d' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setRange('30d')}
            >
              30g
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-800">
            <p className="font-semibold">Impossibile caricare gli analytics.</p>
            <p className="mt-1">{error.message}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <AnalyticsKpiCard
                label="Prenotazioni totali"
                value={kpi?.totalBookings ?? 0}
                isLoading={isLoading}
              />
              <AnalyticsKpiCard
                label="Coperti totali"
                value={kpi?.totalCovers ?? 0}
                isLoading={isLoading}
              />
              <AnalyticsKpiCard
                label="Tasso conferma"
                value={kpi?.confirmationRate ?? 0}
                suffix="%"
                isLoading={isLoading}
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-primary-900 md:text-base">Trend prenotazioni e coperti</h2>

              {isLoading ? (
                <div
                  className="flex h-80 items-center justify-center rounded-xl border border-(--color-border) bg-surface"
                  role="status"
                  aria-live="polite"
                >
                  <Loader2 className="h-10 w-10 animate-spin text-primary-600" aria-hidden />
                  <span className="sr-only">Caricamento grafico</span>
                </div>
              ) : hasData ? (
                <AnalyticsTrendChart data={trend} range={range} isEmpty={false} />
              ) : (
                <p className="rounded-xl border border-(--color-border) bg-surface px-4 py-12 text-center text-sm text-(--color-text-muted) shadow-sm">
                  Nessuna prenotazione nel periodo selezionato. Scegli un altro intervallo o attendi nuove
                  richieste.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
