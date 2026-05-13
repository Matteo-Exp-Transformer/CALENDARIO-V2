import { useQuery } from '@tanstack/react-query'
import { eachDayOfInterval, format, parseISO, startOfDay, subDays } from 'date-fns'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { getShiftRanges, type ShiftFilter } from '@/features/booking/utils/shifts'

export type DateRange = '7d' | '30d'
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
 * Restituisce la data effettiva della prenotazione per i KPI.
 * Usiamo confirmed_start (data reale confermata) se disponibile, altrimenti
 * desired_date (intenzione del cliente), altrimenti created_at come fallback.
 * Questo evita di attribuire prenotazioni al giorno di creazione anziché
 * al giorno in cui il servizio viene effettivamente erogato.
 */
function bookingDate(r: AnalyticsRow): string {
  const raw = r.confirmed_start ?? r.desired_date ?? r.created_at
  return format(parseISO(raw), 'yyyy-MM-dd')
}

function computeAnalytics(
  rows: AnalyticsRow[],
  range: DateRange,
  shift: ShiftFilter,
  businessHoursRaw: unknown,
): AnalyticsData {
  const dayCount = range === '7d' ? 7 : 30
  const endDay = startOfDay(new Date())
  const startDay = startOfDay(subDays(endDay, dayCount - 1))
  const startStr = format(startDay, 'yyyy-MM-dd')
  const endStr = format(endDay, 'yyyy-MM-dd')

  const shiftRanges = getShiftRanges(businessHoursRaw)

  const active = rows.filter((r) => r.status !== 'deleted')
  const inWindow = active.filter((r) => {
    const day = bookingDate(r)
    if (day < startStr || day > endStr) return false

    // Filtro turno: usa confirmed_start per determinare l'orario
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

export function useAnalytics(range: DateRange, shift: ShiftFilter = 'all', businessHoursRaw?: unknown) {
  const { tenantId } = useTenantContext()

  const query = useQuery({
    queryKey: ANALYTICS_QUERY_KEY(tenantId ?? '', range, shift),
    enabled: Boolean(tenantId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant mancante')

      const dayCount = range === '7d' ? 7 : 30
      const endDay = startOfDay(new Date())
      const startDay = startOfDay(subDays(endDay, dayCount - 1))

      const res = await supabase
        .from('booking_requests')
        .select('status, num_guests, created_at, confirmed_start, desired_date, no_show, source')
        .eq('tenant_id', tenantId)
        .gte('created_at', startDay.toISOString())

      if (res.error) {
        logger.error('[useAnalytics] booking_requests', res.error)
        throw new Error(res.error.message)
      }

      const rows = (res.data ?? []) as AnalyticsRow[]
      return computeAnalytics(rows, range, shift, businessHoursRaw)
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
 * Es: se range='7d', questo hook interroga i 7 giorni prima del periodo corrente.
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

      const dayCount = range === '7d' ? 7 : 30
      // Periodo precedente: [dayCount*2 giorni fa, dayCount giorni fa)
      const endDay = startOfDay(subDays(new Date(), dayCount))
      const startDay = startOfDay(subDays(endDay, dayCount - 1))

      const res = await supabase
        .from('booking_requests')
        .select('status, num_guests, created_at, confirmed_start, desired_date, no_show, source')
        .eq('tenant_id', tenantId)
        .gte('created_at', startDay.toISOString())
        .lte('created_at', endDay.toISOString())

      if (res.error) {
        logger.error('[useAnalyticsComparison] booking_requests', res.error)
        throw new Error(res.error.message)
      }

      const rows = (res.data ?? []) as AnalyticsRow[]
      // Usa lo stesso range ma con date del periodo precedente — il compute filtra per window
      return computeAnalytics(rows, range, shift, businessHoursRaw)
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
