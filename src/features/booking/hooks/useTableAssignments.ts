import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useTenantContext } from '@/contexts/TenantContext'
import { toast } from 'react-toastify'
import { logger } from '@/lib/logger'
import type { ServiceSlot } from '@/features/booking/hooks/useServiceSlots'
import {
  activeAssignedBookingIds,
  filterUnassignedBookingsForSlot,
} from '@/features/booking/utils/unassignedBookingsFilter'
import { hasWaitingNextTurnOnTable } from '@/features/booking/utils/tableCheckout'
import type { BookingRequest } from '@/types/booking'
import { computeOccupancyWindow } from '@/features/booking/lib/resolveOccupancy'

export interface BookingTableAssignment {
  id: string
  tenant_id: string
  booking_id: string
  table_id: string
  service_slot_id: string
  turn_number: number
  checked_out_at: string | null
  date: string
  created_at: string
}

export const TABLE_ASSIGNMENTS_QUERY_KEY = 'table_assignments'

export type TableStatus = 'free' | 'assigned' | 'checked_out'

/** Calcola lo stato di un tavolo per slot+data dati gli assignment attivi */
export function getTableStatus(
  tableId: string,
  assignments: BookingTableAssignment[],
  selectedSlotId: string,
  selectedDate: string,
): TableStatus {
  const relevant = assignments.filter(
    (a) => a.table_id === tableId && a.service_slot_id === selectedSlotId && a.date === selectedDate,
  )

  if (relevant.length === 0) return 'free'

  const active = relevant.filter((a) => a.checked_out_at === null)
  if (active.length === 0) return 'checked_out'

  return 'assigned'
}

export function filterBookingsOnDate(bookings: BookingRequest[], date: string): BookingRequest[] {
  return bookings.filter((b) => {
    const d = b.confirmed_start
      ? b.confirmed_start.slice(0, 10)
      : b.desired_date?.slice(0, 10)
    return d === date
  })
}

/** Prenotazioni accettate per una data (lookup nome/orario sui tavoli assegnati). */
export function useAcceptedBookingsForDate(date: string) {
  const { tenantId } = useTenantContext()

  return useQuery({
    queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, date, 'accepted-bookings'],
    queryFn: async (): Promise<BookingRequest[]> => {
      const { data: bookings, error } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('tenant_id', tenantId!)
        .eq('status', 'accepted')

      if (error) throw error
      return filterBookingsOnDate(bookings as unknown as BookingRequest[], date)
    },
    enabled: !!tenantId && !!date,
  })
}

export function useTableAssignments(date: string) {
  const { tenantId } = useTenantContext()

  return useQuery({
    queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, date],
    queryFn: async (): Promise<BookingTableAssignment[]> => {
      const { data, error } = await supabase
        .from('booking_table_assignments')
        .select('*')
        .eq('tenant_id', tenantId!)
        .eq('date', date)

      if (error) throw error
      return data as BookingTableAssignment[]
    },
    enabled: !!tenantId && !!date,
  })
}

/** Prenotazioni accettate per la data, non ancora assegnate ad alcun tavolo per lo slot */
export function useUnassignedBookings(
  date: string,
  slot: Pick<ServiceSlot, 'id' | 'start_time' | 'end_time'> | null,
) {
  const { tenantId } = useTenantContext()
  const slotId = slot?.id ?? ''

  return useQuery({
    queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, date, slotId, 'unassigned'],
    queryFn: async (): Promise<BookingRequest[]> => {
      const { data: bookings, error: bErr } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('tenant_id', tenantId!)
        .eq('status', 'accepted')

      if (bErr) throw bErr

      const onDate = filterBookingsOnDate(bookings as unknown as BookingRequest[], date)

      if (onDate.length === 0) return []

      // Rimuovi quelle già assegnate a un tavolo per questo slot (con checked_out_at = null)
      const { data: assigned, error: aErr } = await supabase
        .from('booking_table_assignments')
        .select('booking_id')
        .eq('tenant_id', tenantId!)
        .eq('date', date)
        .eq('service_slot_id', slotId)
        .is('checked_out_at', null)

      if (aErr) throw aErr

      return filterUnassignedBookingsForSlot(
        onDate,
        slot!.start_time,
        slot!.end_time,
        activeAssignedBookingIds(assigned ?? []),
      )
    },
    enabled: !!tenantId && !!date && !!slot?.id,
  })
}

interface AssignInput {
  bookingId: string
  tableId: string
  slotId: string
  date: string
  maxTurns: number | null
  existingAssignments: BookingTableAssignment[]
  /**
   * Forza l'assegnazione ignorando il limite turni / stato tavolo occupato (D25/D27/D32).
   * Se presente, l'assignment viene inserito con forced_by_admin=true e force_reason impostato.
   * PERCHÉ: lo staff può decidere consapevolmente di sovrapporre turni in situazioni eccezionali.
   * La traccia audit (forced_by_admin + force_reason) documenta la decisione.
   */
  force?: { reason: string }
  /**
   * Prenotazione corrente (per snapshot occupancy su assegnazione, TASK 4 / D42).
   * Best-effort: se assente, lo snapshot viene saltato senza errore.
   */
  booking?: Pick<BookingRequest, 'confirmed_start' | 'confirmed_end'> & { occupancy_start?: string | null }
  /**
   * Slot corrente (per leggere turnover_buffer_minutes, TASK 4 / D42).
   * Best-effort: se assente, si usa buffer=0.
   */
  slot?: Pick<ServiceSlot, 'turnover_buffer_minutes'>
}

/** Errore specifico per turni esauriti — distinguibile dalla UI per offrire la forzatura. */
export class TurniEsauritiError extends Error {
  readonly tableId: string
  readonly turnNumber: number
  readonly maxTurns: number
  constructor(tableId: string, turnNumber: number, maxTurns: number) {
    super('Turni esauriti per questo tavolo in questa fascia.')
    this.name = 'TurniEsauritiError'
    this.tableId = tableId
    this.turnNumber = turnNumber
    this.maxTurns = maxTurns
  }
}

export function useAssignBookingToTable() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async ({ bookingId, tableId, slotId, date, maxTurns, existingAssignments, force, booking, slot }: AssignInput) => {
      const forThisTable = existingAssignments.filter(
        (a) => a.table_id === tableId && a.service_slot_id === slotId && a.date === date,
      )
      const turnNumber = forThisTable.length > 0 ? Math.max(...forThisTable.map((a) => a.turn_number)) + 1 : 1

      // Blocco turni esauriti — saltato se force presente (D25: overbooking consapevole)
      if (!force && maxTurns !== null && turnNumber > maxTurns) {
        throw new TurniEsauritiError(tableId, turnNumber, maxTurns)
      }

      // L'assignment è forzato dallo staff: traccio il motivo per audit (D25/D27/D32)
      const isForcedByAdmin = force !== undefined
      const forceReason = force?.reason ?? null

      const { data, error } = await supabase
        .from('booking_table_assignments')
        .insert({
          tenant_id: tenantId!,
          booking_id: bookingId,
          table_id: tableId,
          service_slot_id: slotId,
          turn_number: turnNumber,
          date,
          checked_out_at: null,
          forced_by_admin: isForcedByAdmin,
          force_reason: forceReason,
        })
        .select()
        .single()

      if (error) throw error

      // TASK 4 / D42 — snapshot finestra di occupazione sulla prenotazione.
      // PERCHÉ: valorizzare occupancy_start/end permette all'Edge e al calcolo capienza
      // di usare la finestra reale senza ricalcolarla ogni volta. Best-effort: qualsiasi
      // dato mancante causa skip silenzioso (non blocca l'assegnazione, D42 degrado).
      // D15: non tocchiamo le righe già valorizzate (occupancy_start già presente → skip).
      try {
        if (
          booking?.confirmed_start &&
          booking?.confirmed_end &&
          !booking?.occupancy_start // D15: non sovrascrivere snapshot già presente
        ) {
          const bufferMinutes = slot?.turnover_buffer_minutes ?? 0
          const arrivalDate = new Date(booking.confirmed_start)
          const endDate = new Date(booking.confirmed_end)
          const durationMinutes = Math.max(0, (endDate.getTime() - arrivalDate.getTime()) / 60_000)
          const window = computeOccupancyWindow({ arrival: arrivalDate, durationMinutes, bufferMinutes })

          await supabase
            .from('booking_requests')
            .update({
              occupancy_start: window.start.toISOString(),
              occupancy_end: window.end.toISOString(),
              turnover_buffer_minutes: bufferMinutes,
            })
            .eq('id', bookingId)
            .eq('tenant_id', tenantId!)
          // Errore non bloccante: loggato ma non rilanciato (D42)
        }
      } catch (snapshotErr) {
        logger.warn('[useAssignBookingToTable] snapshot occupancy fallito (non bloccante)', snapshotErr)
      }

      return data
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date] })
      queryClient.invalidateQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date, vars.slotId, 'unassigned'] })
      toast.success('Prenotazione assegnata al tavolo')
    },
    onError: (error: Error) => {
      logger.error('[useAssignBookingToTable] error', error)
      // TurniEsauritiError viene gestita dalla UI per offrire la forzatura — non mostriamo toast
      if (error instanceof TurniEsauritiError) return
      toast.error(error.message || 'Errore nell\'assegnazione')
    },
  })
}

export function useCheckoutTable() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async ({
      tableId,
      slotId,
      date,
      assignments,
    }: {
      tableId: string
      slotId: string
      date: string
      assignments: BookingTableAssignment[]
    }) => {
      // Libera l'assignment attivo con turn_number più basso
      const active = assignments
        .filter(
          (a) =>
            a.table_id === tableId &&
            a.service_slot_id === slotId &&
            a.date === date &&
            a.checked_out_at === null,
        )
        .sort((a, b) => a.turn_number - b.turn_number)

      if (active.length === 0) throw new Error('Nessun assignment attivo da liberare.')

      const current = active[0]

      // D48 append-only: il checkout lascia SEMPRE una riga in archivio
      // con il timbro checked_out_at. Nessun DELETE fisico — la riga resta
      // come traccia storica del turno; un secondo turno crea una nuova riga.
      const { error } = await supabase
        .from('booking_table_assignments')
        .update({ checked_out_at: new Date().toISOString() })
        .eq('id', current.id)
        .eq('tenant_id', tenantId!)

      if (error) throw error
    },
    onSuccess: async (_data, vars) => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date] }),
        queryClient.refetchQueries({
          queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date, vars.slotId, 'unassigned'],
        }),
      ])
      toast.success('Tavolo liberato')
    },
    onError: (error: Error) => {
      logger.error('[useCheckoutTable] error', error)
      toast.error(error.message || 'Errore nel liberare il tavolo')
    },
  })
}

interface ReleaseInput {
  bookingId: string
  slotId: string
  date: string
  assignments: BookingTableAssignment[]
}

export type ReleaseBlockedReason = 'waiting_next_turn'

/**
 * Libera l'assignment attivo di una specifica prenotazione (per riassegnazione rapida da Calendario).
 * Diverso da useCheckoutTable che opera per tavolo+slot.
 * Restituisce { blocked: ReleaseBlockedReason } se ci sono turni successivi in attesa sul tavolo
 * (comportamento provvisorio sicuro fino all'implementazione della logica permanenza, sessione futura).
 */
export function useReleaseBookingAssignment() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async ({ bookingId, slotId, date, assignments }: ReleaseInput): Promise<{ blocked: ReleaseBlockedReason } | null> => {
      const current = assignments.find(
        (a) =>
          a.booking_id === bookingId &&
          a.service_slot_id === slotId &&
          a.date === date &&
          a.checked_out_at === null,
      )

      if (!current) throw new Error('Nessun assignment attivo da liberare per questa prenotazione.')

      // D48 append-only: non usiamo più DELETE fisico nemmeno per la riassegnazione rapida.
      // Se esiste un turno successivo in attesa sullo stesso tavolo, blocchiamo comunque
      // la release per evitare conflitti (la riassegnazione creerebbe un buco di turno).
      if (hasWaitingNextTurnOnTable(assignments, current)) {
        return { blocked: 'waiting_next_turn' }
      }

      // Marca come checked-out — il prossimo assegnamento creerà una nuova riga (nuovo turno).
      const { error } = await supabase
        .from('booking_table_assignments')
        .update({ checked_out_at: new Date().toISOString() })
        .eq('id', current.id)
        .eq('tenant_id', tenantId!)

      if (error) throw error
      return null
    },
    onSuccess: async (result, vars) => {
      if (result?.blocked) return
      await Promise.all([
        queryClient.refetchQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date] }),
        queryClient.refetchQueries({
          queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date, vars.slotId, 'unassigned'],
        }),
      ])
    },
    onError: (error: Error) => {
      logger.error('[useReleaseBookingAssignment] error', error)
      toast.error(error.message || 'Errore nel liberare l\'assegnazione')
    },
  })
}
