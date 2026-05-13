import { useQuery } from '@tanstack/react-query'
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { getShiftRanges, type ShiftFilter } from '@/features/booking/utils/shifts'

export type DateRange = 'week' | 'month' | 'year'
export type { ShiftFilter }

export interface AnalyticsKpi {
  totalBookings: number
  totalCovers: number
  confirmationRate: number
  avgPartySize: number
  noShowRate: number
  bookedBy: { source: string; count: number; percentage: number }[]
}

export interface AnalyticsTrendPoint {
  date: string
  bookings: number
  covers: number
}

export interface AnalyticsData {
  kpi: AnalyticsKpi
  trend: AnalyticsTrendPoint[]
  hasData: boolean
}

export interface KpiDelta {
  value: number
  direction: 'up' | 'down' | 'neutral'
  label: string
}

export const ANALYTICS_QUERY_ROOT = 'analytics'

export const ANALYTICS_QUERY_KEY = (tenantId: string, range: DateRange, shift: ShiftFilter) =>
  [ANALYTICS_QUERY_ROOT, tenantId, range, shift] as const

type AnalyticsRow = {
  status: string
  num_guests: number | null
  created_at: string
  confirmed_start: string | null
  desired_date: string | null
  no_show: boolean
  source: string
}

/**
 * Restituisce [startStr, endStr] del periodo corrente per il range dato.
 * - week  → lunedì–domenica della settimana corrente (ISO: firstDay=1)
 * - month → primo–ultimo giorno del mese corrente
 * - year  → 1 gennaio–31 dicembre dell'anno corrente
 */
function getCurrentPeriodBounds(range: DateRange): { startStr: string; endStr: string; startDay: Date; endDay: Date } {
  const now = new Date()
  let startDay: Date
  let endDay: Date

  if (range === 'week') {
    startDay = startOfWeek(now, { weekStartsOn: 1 })
    endDay = endOfWeek(now, { weekStartsOn: 1 })
  } else if (range === 'month') {
    startDay = startOfMonth(now)
    endDay = endOfMonth(now)
  } else {
    startDay = startOfYear(now)
    endDay = endOfYear(now)
  }

  return {
    startDay,
    endDay,
    startStr: format(startDay, 'yyyy-MM-dd'),
    endStr: format(endDay, 'yyyy-MM-dd'),
  }
}

/**
 * Restituisce i bounds del periodo *precedente* dello stesso tipo.
 * - week  → settimana precedente (7 gg prima)
 * - month → mese precedente
 * - year  → anno precedente
 */
function getPreviousPeriodBounds(range: DateRange): { startStr: string; endStr: string; startDay: Date; endDay: Date } {
  const now = new Date()
  let refDate: Date

  if (range === 'week') {
    refDate = subDays(startOfWeek(now, { weekStartsOn: 1 }), 1)
    const startDay = startOfWeek(refDate, { weekStartsOn: 1 })
    const endDay = endOfWeek(refDate, { weekStartsOn: 1 })
    return { startDay, endDay, startStr: format(startDay, 'yyyy-MM-dd'), endStr: format(endDay, 'yyyy-MM-dd') }
  } else if (range === 'month') {
    refDate = subDays(startOfMonth(now), 1)
    const startDay = startOfMonth(refDate)
    const endDay = endOfMonth(refDate)
    return { startDay, endDay, startStr: format(startDay, 'yyyy-MM-dd'), endStr: format(endDay, 'yyyy-MM-dd') }
  } else {
    refDate = new Date(now.getFullYear() - 1, 0, 1)
    const startDay = startOfYear(refDate)
    const endDay = endOfYear(refDate)
    return { startDay, endDay, startStr: format(startDay, 'yyyy-MM-dd'), endStr: format(endDay, 'yyyy-MM-dd') }
  }
}

/**
 * Restituisce la data effettiva della prenotazione per i KPI.
 * Usiamo confirmed_start (data reale confermata) se disponibile, altrimenti
 * desired_date (intenzione del cliente), altrimenti created_at come fallback.
 */
function bookingDate(r: AnalyticsRow): string {
  const raw = r.confirmed_start ?? r.desired_date ?? r.created_at
  return format(parseISO(raw), 'yyyy-MM-dd')
}

function computeAnalytics(
  rows: AnalyticsRow[],
  startStr: string,
  endStr: string,
  startDay: Date,
  endDay: Date,
  shift: ShiftFilter,
  businessHoursRaw: unknown,
): AnalyticsData {
  const shiftRanges = getShiftRanges(businessHoursRaw)

  const active = rows.filter((r) => r.status !== 'deleted')
  const inWindow = active.filter((r) => {
    const day = bookingDate(r)
    if (day < startStr || day > endStr) return false

    if (shift !== 'all' && r.confirmed_start) {
      const hour = new Date(r.confirmed_start).getHours()
      if (shift === 'lunch') {
        if (hour < shiftRanges.lunch.startHour || hour >= shiftRanges.lunch.endHour) return false
      } else if (shift === 'dinner') {
        if (hour < shiftRanges.dinner.startHour || hour >= shiftRanges.dinner.endHour) return false
      }
    }

    return true
  })

  let totalCovers = 0
  let acceptedCount = 0
  let noShowCount = 0
  const sourceMap = new Map<string, number>()

  for (const r of inWindow) {
    totalCovers += r.num_guests ?? 0
    if (r.status === 'accepted') {
      acceptedCount += 1
      if (r.no_show) noShowCount += 1
    }
    const src = r.source || 'public_form'
    sourceMap.set(src, (sourceMap.get(src) ?? 0) + 1)
  }

  const totalBookings = inWindow.length
  const confirmationRate =
    totalBookings > 0 ? Math.round((100 * acceptedCount) / totalBookings) : 0
  const avgPartySize =
    acceptedCount > 0 ? Math.round((totalCovers / acceptedCount) * 10) / 10 : 0
  const noShowRate =
    acceptedCount > 0 ? Math.round((100 * noShowCount) / acceptedCount) : 0

  const bookedBy = Array.from(sourceMap.entries())
    .map(([source, count]) => ({
      source,
      count,
      percentage: totalBookings > 0 ? Math.round((100 * count) / totalBookings) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  const byDay = new Map<string, { bookings: number; covers: number }>()
  for (const r of inWindow) {
    const day = bookingDate(r)
    const prev = byDay.get(day) ?? { bookings: 0, covers: 0 }
    prev.bookings += 1
    prev.covers += r.num_guests ?? 0
    byDay.set(day, prev)
  }

  // Per year il trend è mensile (troppi giorni per un grafico giornaliero)
  const trend: AnalyticsTrendPoint[] = eachDayOfInterval({ start: startDay, end: endDay }).map((d) => {
    const date = format(d, 'yyyy-MM-dd')
    const agg = byDay.get(date)
    return { date, bookings: agg?.bookings ?? 0, covers: agg?.covers ?? 0 }
  })

  return {
    kpi: { totalBookings, totalCovers, confirmationRate, avgPartySize, noShowRate, bookedBy },
    trend,
    hasData: totalBookings > 0,
  }
}

/**
 * Calcola il tasso di occupazione come percentuale di coperti rispetto alla capacità totale del periodo.
 * Denominatore: posti × giorni nel periodo. Restituisce null se i dati non sono disponibili.
 */
export function computeOccupancyRate(
  totalCovers: number,
  totalSeats: number,
  range: DateRange,
): number | null {
  if (totalSeats <= 0) return null
  const now = new Date()
  let startDay: Date
  let endDay: Date
  if (range === 'week') {
    startDay = startOfWeek(now, { weekStartsOn: 1 })
    endDay = endOfWeek(now, { weekStartsOn: 1 })
  } else if (range === 'month') {
    startDay = startOfMonth(now)
    endDay = endOfMonth(now)
  } else {
    startDay = startOfYear(now)
    endDay = endOfYear(now)
  }
  const numDays = eachDayOfInterval({ start: startDay, end: endDay }).length
  const maxCovers = totalSeats * numDays
  return maxCovers > 0 ? Math.round((totalCovers / maxCovers) * 100) : null
}

export function useAnalytics(range: DateRange, shift: ShiftFilter = 'all', businessHoursRaw?: unknown) {
  const { tenantId } = useTenantContext()

  const query = useQuery({
    queryKey: ANALYTICS_QUERY_KEY(tenantId ?? '', range, shift),
    enabled: Boolean(tenantId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant mancante')

      const { startDay, startStr, endStr, endDay } = getCurrentPeriodBounds(range)

      const res = await supabase
        .from('booking_requests')
        .select('status, num_guests, created_at, confirmed_start, desired_date, no_show, source')
        .eq('tenant_id', tenantId)
        .gte('created_at', startOfDay(startDay).toISOString())

      if (res.error) {
        logger.error('[useAnalytics] booking_requests', res.error)
        throw new Error(res.error.message)
      }

      const rows = (res.data ?? []) as AnalyticsRow[]
      return computeAnalytics(rows, startStr, endStr, startDay, endDay, shift, businessHoursRaw)
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  }
}

/**
 * Calcola gli stessi KPI sul periodo precedente per il delta.
 * Periodo precedente: settimana/mese/anno precedente rispetto al corrente.
 */
export function useAnalyticsComparison(
  range: DateRange,
  shift: ShiftFilter = 'all',
  businessHoursRaw?: unknown,
) {
  const { tenantId } = useTenantContext()

  const query = useQuery({
    queryKey: [ANALYTICS_QUERY_ROOT, tenantId, range, shift, 'comparison'] as const,
    enabled: Boolean(tenantId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant mancante')

      const { startDay, startStr, endStr, endDay } = getPreviousPeriodBounds(range)

      const res = await supabase
        .from('booking_requests')
        .select('status, num_guests, created_at, confirmed_start, desired_date, no_show, source')
        .eq('tenant_id', tenantId)
        .gte('created_at', startOfDay(startDay).toISOString())
        .lte('created_at', endDay.toISOString())

      if (res.error) {
        logger.error('[useAnalyticsComparison] booking_requests', res.error)
        throw new Error(res.error.message)
      }

      const rows = (res.data ?? []) as AnalyticsRow[]
      return computeAnalytics(rows, startStr, endStr, startDay, endDay, shift, businessHoursRaw)
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
  }
}

/**
 * Calcola il delta tra periodo corrente e precedente per un KPI numerico.
 * Restituisce null se il periodo precedente è zero (evita divisione per zero).
 */
export function computeKpiDelta(current: number, previous: number): KpiDelta | null {
  if (previous === 0) return null
  const diff = current - previous
  const pct = Math.round((Math.abs(diff) / previous) * 100)
  return {
    value: pct,
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
    label: `${pct}% vs periodo prec.`,
  }
}
