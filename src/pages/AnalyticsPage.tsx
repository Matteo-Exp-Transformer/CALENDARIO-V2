import type { FC } from 'react'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { AnalyticsKpiCard } from '@/features/booking/components/analytics/AnalyticsKpiCard'
import { AnalyticsTrendChart } from '@/features/booking/components/analytics/AnalyticsTrendChart'
import { ShiftToggle } from '@/features/booking/components/analytics/ShiftToggle'
import { BookedByChart } from '@/features/booking/components/analytics/BookedByChart'
import {
  useAnalytics,
  useAnalyticsComparison,
  computeKpiDelta,
  computeOccupancyRate,
  type DateRange,
  type ShiftFilter,
} from '@/features/booking/hooks/useAnalytics'
import { useRooms } from '@/features/booking/hooks/useRooms'
import { useTables } from '@/features/booking/hooks/useServizioTables'
import { useRestaurantSetting } from '@/features/booking/hooks/useRestaurantSetting'

const RANGE_LABELS: { value: DateRange; label: string }[] = [
  { value: 'week', label: 'Settimana' },
  { value: 'month', label: 'Mese' },
  { value: 'year', label: 'Anno' },
]

export const AnalyticsPage: FC = () => {
  const [range, setRange] = useState<DateRange>('month')
  const [shift, setShift] = useState<ShiftFilter>('all')

  const { data: businessHoursRaw } = useRestaurantSetting('business_hours')
  const { data: rooms = [] } = useRooms()
  const { data: tables = [] } = useTables()

  const totalSeats = tables.filter((t) => t.active).reduce((sum, t) => sum + t.capacity, 0)

  const { data, isLoading, error } = useAnalytics(range, shift, businessHoursRaw)
  const { data: prevData } = useAnalyticsComparison(range, shift, businessHoursRaw)

  const kpi = data?.kpi
  const prevKpi = prevData?.kpi
  const trend = data?.trend ?? []
  const hasData = data?.hasData ?? false

  const roomsConfigured = rooms.length > 0 && totalSeats > 0
  const occupancyRate =
    roomsConfigured && kpi ? computeOccupancyRate(kpi.totalCovers, totalSeats, range, businessHoursRaw) : null
  const prevOccupancyRate =
    roomsConfigured && prevKpi ? computeOccupancyRate(prevKpi.totalCovers, totalSeats, range, businessHoursRaw) : null

  return (
    <div className="min-h-0 flex-1 bg-(--color-bg) px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary-900 md:text-2xl">Analytics</h1>
            {/* Toggle turno — a destra del titolo */}
            <ShiftToggle value={shift} onChange={setShift} />
          </div>

          {/* Toggle range — centrato */}
          <div className="flex justify-center gap-2">
            {RANGE_LABELS.map(({ value, label }) => (
              <Button
                key={value}
                type="button"
                variant={range === value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setRange(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-800">
            <p className="font-semibold">Impossibile caricare gli analytics.</p>
            <p className="mt-1">{error.message}</p>
          </div>
        ) : (
          <>
            {/* KPI grid — 5 card su 2 righe */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <AnalyticsKpiCard
                label="Prenotazioni"
                value={kpi?.totalBookings ?? 0}
                isLoading={isLoading}
                delta={kpi && prevKpi ? computeKpiDelta(kpi.totalBookings, prevKpi.totalBookings) : null}
              />
              <AnalyticsKpiCard
                label="Coperti totali"
                value={kpi?.totalCovers ?? 0}
                isLoading={isLoading}
                delta={kpi && prevKpi ? computeKpiDelta(kpi.totalCovers, prevKpi.totalCovers) : null}
              />
              <AnalyticsKpiCard
                label="Tasso conferma"
                value={kpi?.confirmationRate ?? 0}
                suffix="%"
                isLoading={isLoading}
                delta={kpi && prevKpi ? computeKpiDelta(kpi.confirmationRate, prevKpi.confirmationRate) : null}
              />
              <AnalyticsKpiCard
                label="Media coperti/booking"
                value={kpi?.avgPartySize ?? 0}
                isLoading={isLoading}
                delta={kpi && prevKpi ? computeKpiDelta(kpi.avgPartySize, prevKpi.avgPartySize) : null}
              />
              <AnalyticsKpiCard
                label="Tasso no-show"
                value={kpi?.noShowRate ?? 0}
                suffix="%"
                isLoading={isLoading}
                delta={kpi && prevKpi ? computeKpiDelta(kpi.noShowRate, prevKpi.noShowRate) : null}
              />
            </div>

            {/* Card tasso occupazione — coperti / (posti × giorni periodo) */}
            <AnalyticsKpiCard
              label="Tasso occupazione"
              value={occupancyRate != null ? occupancyRate : '—'}
              suffix={occupancyRate != null ? '%' : undefined}
              isLoading={isLoading && roomsConfigured}
              disabled={!roomsConfigured}
              disabledTooltip="Configura sala e tavoli per attivare questo KPI"
              delta={
                occupancyRate != null && prevOccupancyRate != null
                  ? computeKpiDelta(occupancyRate, prevOccupancyRate)
                  : null
              }
            />

            {/* Trend */}
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

            {/* Booked By chart */}
            <BookedByChart data={kpi?.bookedBy ?? []} isLoading={isLoading} />
          </>
        )}
      </div>
    </div>
  )
}
