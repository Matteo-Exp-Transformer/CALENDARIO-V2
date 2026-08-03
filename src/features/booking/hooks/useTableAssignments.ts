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
import {
  computeNextTurnNumber,
  isSlotClosed,
} from '@/features/booking/utils/tableTurnLimits'

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
  /**
   * FIX D (03-08-26, mig. 070) — istante in cui lo staff ha premuto "Ancora occupato"
   * sull'avviso di fine turno. NULL = nessuna conferma attiva.
   *
   * Campo OBBLIGATORIO nel tipo (revisione senior 03-08-26): tutte le query fanno
   * `select('*')`, quindi a runtime il campo c'è sempre — renderlo obbligatorio protegge
   * da una futura select che dimenticasse la colonna su questa fonte di verità. I 4 file
   * di test che costruiscono `BookingTableAssignment` con `Partial<...>` sono stati
   * aggiornati con un default esplicito.
   */
  release_notice_handled_at: string | null
}

export const TABLE_ASSIGNMENTS_QUERY_KEY = 'table_assignments'
export const SERVICE_ASSIGNMENTS_REFETCH_INTERVAL_MS = 15_000

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
    refetchOnMount: 'always',
    refetchInterval: SERVICE_ASSIGNMENTS_REFETCH_INTERVAL_MS,
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
    refetchOnMount: 'always',
    refetchInterval: SERVICE_ASSIGNMENTS_REFETCH_INTERVAL_MS,
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
    refetchOnMount: 'always',
    refetchInterval: SERVICE_ASSIGNMENTS_REFETCH_INTERVAL_MS,
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

/** Fascia chiusa (max_turns = 0): messaggio distinto dai turni esauriti. */
export class FasciaChiusaError extends Error {
  constructor() {
    super('La fascia è chiusa: riaprila per assegnare i tavoli.')
    this.name = 'FasciaChiusaError'
  }
}

/** Blocca l'assegnazione se la fascia è chiusa o i turni sono finiti (salvo force). */
function assertTurnAvailable(
  tableId: string,
  turnNumber: number,
  maxTurns: number | null,
  force?: { reason: string },
) {
  if (force) return
  if (isSlotClosed(maxTurns)) {
    throw new FasciaChiusaError()
  }
  if (maxTurns !== null && turnNumber > maxTurns) {
    throw new TurniEsauritiError(tableId, turnNumber, maxTurns)
  }
}

/** Azzera served_at: una riassegnazione riporta la prenotazione in servizio. */
async function clearBookingServedAt(bookingId: string, tenantId: string) {
  const { error } = await supabase
    .from('booking_requests')
    .update({ served_at: null })
    .eq('id', bookingId)
    .eq('tenant_id', tenantId)
  if (error) {
    logger.warn('[useTableAssignments] clear served_at fallito (non bloccante)', error)
  }
}

/**
 * Archivia la prenotazione solo se non restano assegnazioni attive (tavolata multi-tavolo).
 * Usato SOLO dal checkout normale — mai da undo, force-replace o release.
 *
 * Non lancia: quando gira, il tavolo è GIÀ stato liberato nel DB. Un throw qui salterebbe
 * l'invalidate delle query e lo staff vedrebbe il tavolo ancora occupato pur essendo libero.
 * Restituisce false così il chiamante avvisa con un messaggio dedicato.
 */
async function markBookingServedIfFullyReleased(
  bookingId: string,
  tenantId: string,
  remainingActiveForBooking: number,
): Promise<boolean> {
  if (remainingActiveForBooking > 0) return true
  const { error } = await supabase
    .from('booking_requests')
    .update({ served_at: new Date().toISOString() })
    .eq('id', bookingId)
    .eq('tenant_id', tenantId)
  if (error) {
    logger.error('[useTableAssignments] archiviazione served_at fallita', error)
    return false
  }
  return true
}

async function writeOccupancySnapshot({
  bookingId,
  tenantId,
  booking,
  slot,
}: {
  bookingId: string
  tenantId: string
  booking?: Pick<BookingRequest, 'confirmed_start' | 'confirmed_end'> & { occupancy_start?: string | null }
  slot?: Pick<ServiceSlot, 'turnover_buffer_minutes'>
}) {
  try {
    if (
      booking?.confirmed_start &&
      booking?.confirmed_end &&
      !booking?.occupancy_start
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
        .eq('tenant_id', tenantId)
    }
  } catch (snapshotErr) {
    logger.warn('[useTableAssignments] snapshot occupancy fallito (non bloccante)', snapshotErr)
  }
}

export function useAssignBookingToTable() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async ({ bookingId, tableId, slotId, date, maxTurns, existingAssignments, force, booking, slot }: AssignInput) => {
      const turnNumber = computeNextTurnNumber(existingAssignments, tableId, slotId, date)
      assertTurnAvailable(tableId, turnNumber, maxTurns, force)

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

      // Riassegnazione dopo checkout: la prenotazione torna attiva (served_at → null)
      await clearBookingServedAt(bookingId, tenantId!)

      // TASK 4 / D42 — snapshot finestra di occupazione sulla prenotazione.
      // PERCHÉ: valorizzare occupancy_start/end permette all'Edge e al calcolo capienza
      // di usare la finestra reale senza ricalcolarla ogni volta. Best-effort: qualsiasi
      // dato mancante causa skip silenzioso (non blocca l'assegnazione, D42 degrado).
      // D15: non tocchiamo le righe già valorizzate (occupancy_start già presente → skip).
      await writeOccupancySnapshot({ bookingId, tenantId: tenantId!, booking, slot })

      return data
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date] })
      queryClient.invalidateQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date, vars.slotId, 'unassigned'] })
      toast.success('Prenotazione assegnata al tavolo')
    },
    onError: (error: Error) => {
      logger.error('[useAssignBookingToTable] error', error)
      // TurniEsauritiError → UI offre forzatura; FasciaChiusaError → toast col messaggio dedicato
      if (error instanceof TurniEsauritiError) return
      toast.error(error.message || 'Errore nell\'assegnazione')
    },
  })
}

export interface AssignManyInput extends Omit<AssignInput, 'tableId'> {
  /** Tavoli su cui distribuire la stessa prenotazione (D39: tavolata su più tavoli). */
  tableIds: string[]
}

/**
 * Assegna UNA prenotazione a PIÙ tavoli in un solo insert (D39).
 *
 * PERCHÉ una mutation dedicata invece di N chiamate a useAssignBookingToTable:
 * il turn_number è per-tavolo e va calcolato sullo stesso snapshot di
 * `existingAssignments`; chiamate sequenziali leggerebbero uno stato intermedio.
 * Un unico insert multi-riga mantiene anche coerente il vincolo UNIQUE (D40).
 *
 * Usato sia per l'assegnazione iniziale multi-tavolo sia per aggiungere un
 * tavolo a una prenotazione già assegnata (tavolata che cresce).
 */
export function useAssignBookingToTables() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async ({
      bookingId,
      tableIds,
      slotId,
      date,
      maxTurns,
      existingAssignments,
      force,
      booking,
      slot,
    }: AssignManyInput) => {
      if (tableIds.length === 0) throw new Error('Seleziona almeno un tavolo.')

      const rows = tableIds.map((tableId) => {
        const turnNumber = computeNextTurnNumber(existingAssignments, tableId, slotId, date)
        assertTurnAvailable(tableId, turnNumber, maxTurns, force)

        return {
          tenant_id: tenantId!,
          booking_id: bookingId,
          table_id: tableId,
          service_slot_id: slotId,
          turn_number: turnNumber,
          date,
          checked_out_at: null,
          forced_by_admin: force !== undefined,
          force_reason: force?.reason ?? null,
        }
      })

      const { data, error } = await supabase
        .from('booking_table_assignments')
        .insert(rows)
        .select()

      if (error) throw error

      await clearBookingServedAt(bookingId, tenantId!)

      // Snapshot finestra di occupazione: una sola volta per prenotazione (D42, best-effort)
      await writeOccupancySnapshot({ bookingId, tenantId: tenantId!, booking, slot })

      return (data ?? []) as BookingTableAssignment[]
    },
    onSuccess: async (_data, vars) => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date] }),
        queryClient.refetchQueries({
          queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date, vars.slotId, 'unassigned'],
        }),
      ])
      toast.success(
        vars.tableIds.length > 1
          ? `Prenotazione assegnata a ${vars.tableIds.length} tavoli`
          : 'Prenotazione assegnata al tavolo',
      )
    },
    onError: (error: Error) => {
      logger.error('[useAssignBookingToTables] error', error)
      if (error instanceof TurniEsauritiError) return
      toast.error(error.message || 'Errore nell\'assegnazione')
    },
  })
}

/**
 * Esito scelto dallo staff per chi è già seduto sul tavolo conteso (S4-FIX-5):
 * - `move`    → si sposta su un altro tavolo libero, non consuma un turno del tavolo conteso.
 * - `archive` → il pasto è finito: si libera e si archivia (se non restano altri tavoli attivi).
 * - `requeue` → torna tra le prenotazioni da assegnare, come il vecchio comportamento unico.
 */
export type ForceReplaceOutcome = 'move' | 'archive' | 'requeue'

interface ForceReplaceInput extends AssignInput {
  reason: string
  outcome: ForceReplaceOutcome
  /** Tavolo libero di destinazione — obbligatorio quando outcome === 'move'. */
  targetTableId?: string
  /** Nomi per il messaggio di successo differenziato per esito (best-effort, no toast generico). */
  displacedBookingName?: string
  newBookingName?: string
  targetTableName?: string
  contestedTableName?: string
}

function forceReplaceSuccessMessage(vars: ForceReplaceInput): string {
  const { outcome, displacedBookingName, newBookingName, targetTableName, contestedTableName } = vars
  if (outcome === 'move' && displacedBookingName && targetTableName) {
    return contestedTableName && newBookingName
      ? `${displacedBookingName} spostato su ${targetTableName}, ${contestedTableName} assegnato a ${newBookingName}`
      : `${displacedBookingName} spostato su ${targetTableName}`
  }
  if (outcome === 'archive' && displacedBookingName) {
    return `${displacedBookingName} archiviato, tavolo assegnato${newBookingName ? ` a ${newBookingName}` : ''}`
  }
  if (outcome === 'requeue' && displacedBookingName) {
    return `${displacedBookingName} torna tra le prenotazioni da assegnare, tavolo assegnato${newBookingName ? ` a ${newBookingName}` : ''}`
  }
  return 'Tavolo liberato e prenotazione assegnata'
}

export function useForceReplaceBookingOnTable() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async ({
      bookingId,
      tableId,
      slotId,
      date,
      existingAssignments,
      reason,
      booking,
      slot,
      outcome,
      targetTableId,
    }: ForceReplaceInput) => {
      const active = existingAssignments
        .filter(
          (a) =>
            a.table_id === tableId &&
            a.service_slot_id === slotId &&
            a.date === date &&
            a.checked_out_at === null,
        )
        .sort((a, b) => a.turn_number - b.turn_number)

      if (active.length === 0) {
        throw new Error('Nessuna prenotazione attiva da liberare su questo tavolo.')
      }

      const currentAssignment = active[0]
      const displacedBookingId = currentAssignment.booking_id
      const trimmedReason = reason.trim()

      if (outcome === 'move') {
        if (!targetTableId) {
          throw new Error('Seleziona il tavolo su cui spostare la prenotazione in corso.')
        }

        // 1. la prenotazione scavalcata si sposta sul tavolo di destinazione: nuovo turno LÌ.
        const moveTurnNumber = computeNextTurnNumber(existingAssignments, targetTableId, slotId, date)
        const { error: moveError } = await supabase
          .from('booking_table_assignments')
          .insert({
            tenant_id: tenantId!,
            booking_id: displacedBookingId,
            table_id: targetTableId,
            service_slot_id: slotId,
            turn_number: moveTurnNumber,
            date,
            checked_out_at: null,
            forced_by_admin: true,
            force_reason: trimmedReason || 'Forzatura guidata: spostato dal tavolo conteso',
          })
        if (moveError) throw moveError

        // 2. la sua riga sul tavolo conteso sparisce: nessun turno consumato lì (regola 2, §3).
        const { error: deleteError } = await supabase
          .from('booking_table_assignments')
          .delete()
          .eq('id', currentAssignment.id)
          .eq('tenant_id', tenantId!)
        if (deleteError) throw deleteError
      } else if (outcome === 'archive') {
        const checkedOutAt = new Date().toISOString()
        const { error: releaseError } = await supabase
          .from('booking_table_assignments')
          .update({ checked_out_at: checkedOutAt })
          .eq('id', currentAssignment.id)
          .eq('tenant_id', tenantId!)
        if (releaseError) throw releaseError

        // S4-REQ-3: archivia solo se non restano altri tavoli attivi sulla stessa prenotazione.
        const remainingActiveForBooking = existingAssignments.filter(
          (a) =>
            a.booking_id === displacedBookingId &&
            a.checked_out_at === null &&
            a.id !== currentAssignment.id,
        ).length
        await markBookingServedIfFullyReleased(displacedBookingId, tenantId!, remainingActiveForBooking)
      } else {
        // requeue — stesso principio di useUndoTableAssignment: non è un turno servito,
        // DELETE fisico invece del timbro checked_out_at (non consuma un posto nel conteggio).
        const { error: deleteError } = await supabase
          .from('booking_table_assignments')
          .delete()
          .eq('id', currentAssignment.id)
          .eq('tenant_id', tenantId!)
        if (deleteError) throw deleteError
      }

      // 3 (move) / passo unico (archive, requeue): la prenotazione nuova prende il tavolo conteso.
      const turnNumber = computeNextTurnNumber(existingAssignments, tableId, slotId, date)

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
          forced_by_admin: true,
          force_reason: trimmedReason || 'Forzatura guidata: tavolo liberato dallo staff',
        })
        .select()
        .single()

      if (error) throw error

      await clearBookingServedAt(bookingId, tenantId!)
      await writeOccupancySnapshot({ bookingId, tenantId: tenantId!, booking, slot })

      return data as BookingTableAssignment
    },
    onSuccess: async (_data, vars) => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date] }),
        queryClient.refetchQueries({
          queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date, vars.slotId, 'unassigned'],
        }),
      ])
      toast.success(forceReplaceSuccessMessage(vars))
    },
    onError: (error: Error) => {
      logger.error('[useForceReplaceBookingOnTable] error', error)
      toast.error(error.message || 'Errore nella forzatura del tavolo')
    },
  })
}

export function useUndoTableAssignment() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (input: {
      assignmentId: string
      date: string
      slotId: string
    }) => {
      // DELETE fisico: l'annullamento corregge un errore di pochi secondi, non è
      // un turno servito. Non viola D48 (append-only sui turni realmente serviti)
      // e non consuma un posto nel conteggio turni.
      const { error } = await supabase
        .from('booking_table_assignments')
        .delete()
        .eq('id', input.assignmentId)
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
      toast.success('Assegnazione annullata')
    },
    onError: (error: Error) => {
      logger.error('[useUndoTableAssignment] error', error)
      toast.error(error.message || 'Errore nell\'annullamento')
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

      // S4-REQ-3: archivia solo se non restano altri tavoli attivi sulla stessa prenotazione
      const remainingActiveForBooking = assignments.filter(
        (a) =>
          a.booking_id === current.booking_id &&
          a.checked_out_at === null &&
          a.id !== current.id,
      ).length
      const archived = await markBookingServedIfFullyReleased(
        current.booking_id,
        tenantId!,
        remainingActiveForBooking,
      )

      return { archived }
    },
    onSuccess: async (result, vars) => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date] }),
        queryClient.refetchQueries({
          queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date, vars.slotId, 'unassigned'],
        }),
      ])
      if (result && result.archived === false) {
        toast.warn(
          'Tavolo liberato, ma la prenotazione non è stata archiviata: potrebbe ricomparire fra quelle da assegnare.',
        )
        return
      }
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

      // Se esiste un turno successivo in attesa sullo stesso tavolo, blocchiamo comunque
      // la release per evitare conflitti (la riassegnazione creerebbe un buco di turno).
      if (hasWaitingNextTurnOnTable(assignments, current)) {
        return { blocked: 'waiting_next_turn' }
      }

      // D48 (riscritta 03-08, D-B/S-1): append-only vale sui turni REALMENTE serviti
      // (checkout/archiviazione). Uno spostamento — «Modifica tavolo» da Calendario — non è
      // un turno servito: il cliente si sposta, non se ne va. DELETE fisico della riga sul
      // tavolo di partenza, stesso principio già in vigore per useUndoTableAssignment e per
      // il ramo requeue/move di useForceReplaceBookingOnTable (S4-FIX-5). Così il conteggio
      // turni residui del tavolo di partenza resta invariato, identico al percorso Servizio.
      const { error } = await supabase
        .from('booking_table_assignments')
        .delete()
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

interface MarkReleaseNoticeHandledInput {
  /**
   * FIX D, revisione senior (03-08-26): la riga ESATTA notificata (quella col
   * turn_number più basso, la stessa che `useTableStatuses`/`activeAssignmentByTable`
   * usano per decidere "in uscita"), non più tavolo+fascia+data. Un tavolo con un
   * secondo turno già in coda (`hasWaitingNextTurnOnTable`) ha DUE righe attive: la
   * versione precedente le timbrava entrambe, e quel secondo turno — quando arriverà il
   * suo momento — poteva ereditare un timbro che nessuno ha confermato per lui, con
   * l'avviso silenzioso senza che lo staff l'abbia mai visto.
   */
  assignmentId: string
  date: string
}

/**
 * FIX D (03-08-26, D-D, mig. 070) — timbra `release_notice_handled_at = now()` sulla
 * riga di assegnazione ESATTA notificata quando lo staff preme "Ancora occupato"
 * sull'avviso di fine turno. Persistito sul record: la conferma vale per tutti i
 * dispositivi e resiste al ricaricamento. Non tocca `checked_out_at` (il tavolo resta
 * occupato) né consuma un turno — è solo una traccia di "l'avviso è stato visto e
 * respinto adesso", per QUELLA riga soltanto.
 */
export function useMarkReleaseNoticeHandled() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async ({ assignmentId }: MarkReleaseNoticeHandledInput) => {
      const { error } = await supabase
        .from('booking_table_assignments')
        .update({ release_notice_handled_at: new Date().toISOString() })
        .eq('id', assignmentId)
        .eq('tenant_id', tenantId!)

      if (error) throw error
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: [TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, vars.date] })
    },
    onError: (error: Error) => {
      logger.error('[useMarkReleaseNoticeHandled] error', error)
      toast.error(error.message || 'Errore nel confermare l\'avviso')
    },
  })
}
