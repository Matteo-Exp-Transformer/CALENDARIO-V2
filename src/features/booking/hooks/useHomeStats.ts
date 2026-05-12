import { useQuery } from '@tanstack/react-query'
import { addHours, format, startOfDay } from 'date-fns'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export const HOME_STATS_QUERY_KEY = 'home-stats'

interface HomeStatsRow {
  id: string
  status: string
  num_guests: number | null
  desired_date: string
  desired_time: string | null
  confirmed_start: string | null
  confirmed_end: string | null
  client_name: string
}

export interface HomeStatValues {
  /** Prenotazioni con evento oggi (pending + accepted). */
  totalToday: number
  /** Somma `num_guests` per le accepted con `confirmed_start` di oggi. */
  confirmedCoversToday: number
  /** Pending con `desired_date` oggi. */
  pendingToday: number
}

export interface UpcomingBooking {
  id: string
  client_name: string
  num_guests: number
  /** Inizio confermato come Date locale, già parsato. */
  start: Date
  start_iso: string
}

export interface HomeStatsData {
  stats: HomeStatValues
  upcoming: UpcomingBooking[]
}

const EMPTY_STATS: HomeStatValues = {
  totalToday: 0,
  confirmedCoversToday: 0,
  pendingToday: 0,
}

/** Estrae 'YYYY-MM-DD' dalla parte data di una ISO string senza convertire fuso. */
function extractDateFromIso(iso: string): string | null {
  const m = iso.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  return `${m[1]}-${m[2]}-${m[3]}`
}

/** Data evento: `confirmed_start` per accepted, `desired_date` per pending. */
function eventDateFor(row: HomeStatsRow): string | null {
  if (row.status === 'accepted' && row.confirmed_start) {
    return extractDateFromIso(row.confirmed_start)
  }
  if (row.status === 'pending') {
    return row.desired_date
  }
  return null
}

export function computeHomeStats(rows: HomeStatsRow[], now: Date): HomeStatsData {
  const today = format(startOfDay(now), 'yyyy-MM-dd')
  const upcomingCutoff = addHours(now, 3)

  let totalToday = 0
  let confirmedCoversToday = 0
  let pendingToday = 0
  const upcoming: UpcomingBooking[] = []

  for (const row of rows) {
    const eventDate = eventDateFor(row)
    if (eventDate === today) {
      if (row.status === 'pending') {
        pendingToday += 1
        totalToday += 1
      } else if (row.status === 'accepted') {
        totalToday += 1
        confirmedCoversToday += row.num_guests ?? 0
      }
    }

    if (row.status === 'accepted' && row.confirmed_start) {
      const start = new Date(row.confirmed_start)
      if (!Number.isNaN(start.getTime()) && start >= now && start <= upcomingCutoff) {
        upcoming.push({
          id: row.id,
          client_name: row.client_name,
          num_guests: row.num_guests ?? 0,
          start,
          start_iso: row.confirmed_start,
        })
      }
    }
  }

  upcoming.sort((a, b) => a.start.getTime() - b.start.getTime())

  return {
    stats: { totalToday, confirmedCoversToday, pendingToday },
    upcoming,
  }
}

export function useHomeStats() {
  const { tenantId } = useTenantContext()

  const query = useQuery({
    queryKey: [HOME_STATS_QUERY_KEY, tenantId],
    enabled: Boolean(tenantId),
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant mancante')

      const today = format(startOfDay(new Date()), 'yyyy-MM-dd')
      const todayStartIso = startOfDay(new Date()).toISOString()

      const res = await supabase
        .from('booking_requests')
        .select(
          'id, status, num_guests, desired_date, desired_time, confirmed_start, confirmed_end, client_name',
        )
        .eq('tenant_id', tenantId)
        .in('status', ['pending', 'accepted'])
        // Limita al solo giorno corrente: pending per desired_date, accepted per confirmed_start
        .or(`desired_date.gte.${today},confirmed_start.gte.${todayStartIso}`)

      if (res.error) {
        logger.error('[useHomeStats] booking_requests', res.error)
        throw new Error(res.error.message)
      }

      const rows = (res.data ?? []) as HomeStatsRow[]
      return computeHomeStats(rows, new Date())
    },
  })

  return {
    stats: query.data?.stats ?? EMPTY_STATS,
    upcoming: query.data?.upcoming ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  }
}
