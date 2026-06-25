import { useQuery } from '@tanstack/react-query'
import { format, startOfDay } from 'date-fns'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { bookingStartsInServiceSlot } from '@/features/booking/utils/serviceSlotBookingFilter'

export interface BriefingBooking {
  id: string
  client_name: string
  num_guests: number
  confirmed_start: string
  special_requests: string | null
  table_name: string | null
  room_name: string | null
}

export interface ShiftBriefingData {
  bookings: BriefingBooking[]
  totalBookings: number
  totalCovers: number
  date: string
  shiftLabel: string
  isMultiRoom: boolean
}

export type BriefingShiftFilter = 'all' | string

export function useShiftBriefing(shift: BriefingShiftFilter = 'all', _businessHoursRaw?: unknown) {
  const { tenantId } = useTenantContext()

  return useQuery<ShiftBriefingData>({
    queryKey: ['shift-briefing', tenantId, shift] as const,
    enabled: Boolean(tenantId),
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant mancante')

      const today = format(startOfDay(new Date()), 'yyyy-MM-dd')
      const todayStart = startOfDay(new Date()).toISOString()
      const todayEnd = new Date(startOfDay(new Date()).getTime() + 24 * 60 * 60 * 1000).toISOString()

      // 1. Fetch bookings
      const { data, error } = await supabase
        .from('booking_requests')
        .select('id, client_name, num_guests, confirmed_start, confirmed_end, desired_date, desired_time, special_requests')
        .eq('tenant_id', tenantId)
        .eq('status', 'accepted')
        .eq('no_show', false)
        .gte('confirmed_start', todayStart)
        .lt('confirmed_start', todayEnd)
        .order('confirmed_start', { ascending: true })

      if (error) {
        logger.error('[useShiftBriefing] booking_requests', error)
        throw new Error(error.message)
      }

      const { data: slotsData, error: slotsError } = await supabase
        .from('service_slots')
        .select('id, name, start_time, end_time')
        .eq('tenant_id', tenantId)
        .order('display_order', { ascending: true })

      if (slotsError) {
        logger.error('[useShiftBriefing] service_slots', slotsError)
        throw new Error(slotsError.message)
      }

      // 2. Fetch active table assignments for today
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('booking_table_assignments')
        .select('booking_id, table_id')
        .eq('tenant_id', tenantId)
        .eq('date', today)
        .is('checked_out_at', null)

      if (assignmentsError) {
        logger.error('[useShiftBriefing] booking_table_assignments', assignmentsError)
        throw new Error(assignmentsError.message)
      }

      // 3. Fetch tables (all tenant tables to build a lookup map)
      const { data: tablesData, error: tablesError } = await supabase
        .from('tables')
        .select('id, name, room_id')
        .eq('tenant_id', tenantId)

      if (tablesError) {
        logger.error('[useShiftBriefing] tables', tablesError)
        throw new Error(tablesError.message)
      }

      // 4. Fetch rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('id, name, active')
        .eq('tenant_id', tenantId)

      if (roomsError) {
        logger.error('[useShiftBriefing] rooms', roomsError)
        throw new Error(roomsError.message)
      }

      // Build lookup maps
      const tableMap = new Map<string, { name: string; room_id: string | null }>(
        (tablesData ?? []).map((t: { id: string; name: string; room_id: string | null }) => [
          t.id,
          { name: t.name, room_id: t.room_id },
        ]),
      )

      const roomMap = new Map<string, string>(
        (roomsData ?? []).map((r: { id: string; name: string; active: boolean }) => [r.id, r.name]),
      )

      const activeRoomCount = (roomsData ?? []).filter(
        (r: { active: boolean }) => r.active,
      ).length
      const isMultiRoom = activeRoomCount > 1

      // Build a map: bookingId -> list of table records (active assignments)
      const assignmentsByBooking = new Map<string, string[]>()
      for (const a of assignmentsData ?? []) {
        const rec = a as { booking_id: string; table_id: string }
        if (!assignmentsByBooking.has(rec.booking_id)) {
          assignmentsByBooking.set(rec.booking_id, [])
        }
        assignmentsByBooking.get(rec.booking_id)!.push(rec.table_id)
      }

      const slotMap = new Map(
        ((slotsData ?? []) as { id: string; name: string; start_time: string; end_time: string }[])
          .map((slot) => [slot.id, slot]),
      )
      const selectedSlot = shift === 'all' ? null : slotMap.get(shift) ?? null

      const raw = (data ?? []) as {
        id: string
        client_name: string
        num_guests: number | null
        confirmed_start: string
        confirmed_end: string | null
        desired_date: string | null
        desired_time: string | null
        special_requests: string | null
      }[]

      const filtered = raw.filter((row) => {
        if (shift === 'all') return true
        if (!selectedSlot) return false
        return bookingStartsInServiceSlot(
          row as unknown as Parameters<typeof bookingStartsInServiceSlot>[0],
          selectedSlot.start_time,
          selectedSlot.end_time,
        )
      })

      const bookings: BriefingBooking[] = filtered.map((row) => {
        const tableIds = assignmentsByBooking.get(row.id) ?? []

        if (tableIds.length === 0) {
          return {
            id: row.id,
            client_name: row.client_name,
            num_guests: row.num_guests ?? 0,
            confirmed_start: row.confirmed_start,
            special_requests: row.special_requests,
            table_name: null,
            room_name: null,
          }
        }

        // Join table names with ', ' for multi-table bookings (D39)
        const tableNames = tableIds
          .map((tid) => tableMap.get(tid)?.name)
          .filter((name): name is string => Boolean(name))
        const tableName = tableNames.length > 0 ? tableNames.join(', ') : null

        // Room from the first assigned table
        const firstTableRoomId = tableMap.get(tableIds[0])?.room_id ?? null
        const roomName = firstTableRoomId ? (roomMap.get(firstTableRoomId) ?? null) : null

        return {
          id: row.id,
          client_name: row.client_name,
          num_guests: row.num_guests ?? 0,
          confirmed_start: row.confirmed_start,
          special_requests: row.special_requests,
          table_name: tableName,
          room_name: roomName,
        }
      })

      return {
        bookings,
        totalBookings: bookings.length,
        totalCovers: bookings.reduce((s, b) => s + b.num_guests, 0),
        date: today,
        shiftLabel: selectedSlot?.name ?? 'Giornata completa',
        isMultiRoom,
      }
    },
  })
}
