import { useQuery } from '@tanstack/react-query'
import { eachDayOfInterval, format, parseISO, startOfDay, subDays } from 'date-fns'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export type DateRange = '7d' | '30d'

export interface AnalyticsKpi {
  totalBookings: number
  totalCovers: number
  confirmationRate: number
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

export const ANALYTICS_QUERY_ROOT = 'analytics'

export const ANALYTICS_QUERY_KEY = (tenantId: string, range: DateRange) =>
  [ANALYTICS_QUERY_ROOT, tenantId, range] as const

type AnalyticsRow = {
  status: string
  num_guests: number | null
  created_at: string
}

function computeAnalytics(rows: AnalyticsRow[], range: DateRange): AnalyticsData {
  const dayCount = range === '7d' ? 7 : 30
  const endDay = startOfDay(new Date())
  const startDay = startOfDay(subDays(endDay, dayCount - 1))
  const startStr = format(startDay, 'yyyy-MM-dd')
  const endStr = format(endDay, 'yyyy-MM-dd')

  const active = rows.filter((r) => r.status !== 'deleted')
  const inWindow = active.filter((r) => {
    const day = format(parseISO(r.created_at), 'yyyy-MM-dd')
    return day >= startStr && day <= endStr
  })

  let totalCovers = 0
  let acceptedCount = 0
  for (const r of inWindow) {
    totalCovers += r.num_guests ?? 0
    if (r.status === 'accepted') acceptedCount += 1
  }

  const totalBookings = inWindow.length
  const confirmationRate =
    totalBookings > 0 ? Math.round((100 * acceptedCount) / totalBookings) : 0

  const byDay = new Map<string, { bookings: number; covers: number }>()
  for (const r of inWindow) {
    const day = format(parseISO(r.created_at), 'yyyy-MM-dd')
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
    kpi: { totalBookings, totalCovers, confirmationRate },
    trend,
    hasData: totalBookings > 0,
  }
}

export function useAnalytics(range: DateRange) {
  const { tenantId } = useTenantContext()

  const query = useQuery({
    queryKey: ANALYTICS_QUERY_KEY(tenantId ?? '', range),
    enabled: Boolean(tenantId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant mancante')

      const dayCount = range === '7d' ? 7 : 30
      const endDay = startOfDay(new Date())
      const startDay = startOfDay(subDays(endDay, dayCount - 1))

      const res = await supabase
        .from('booking_requests')
        .select('status, num_guests, created_at')
        .eq('tenant_id', tenantId)
        .gte('created_at', startDay.toISOString())

      if (res.error) {
        logger.error('[useAnalytics] booking_requests', res.error)
        throw new Error(res.error.message)
      }

      const rows = (res.data ?? []) as AnalyticsRow[]
      return computeAnalytics(rows, range)
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  }
}
