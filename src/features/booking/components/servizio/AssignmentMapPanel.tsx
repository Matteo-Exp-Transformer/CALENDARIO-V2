import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import {
  Users,
  LogOut,
  GripVertical,
  AlertTriangle,
  MousePointerClick,
  Plus,
  Check,
} from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import { toast } from 'react-toastify'
import { useServiceSlots } from '@/features/booking/hooks/useServiceSlots'
import {
  useTableAssignments,
  useUnassignedBookings,
  useAcceptedBookingsForDate,
  useAssignBookingToTable,
  useAssignBookingToTables,
  useForceReplaceBookingOnTable,
  useUndoTableAssignment,
  useCheckoutTable,
  TurniEsauritiError,
  type BookingTableAssignment,
  type ForceReplaceOutcome,
} from '@/features/booking/hooks/useTableAssignments'
import {
  activeAssignedBookingIds,
  filterUnassignedBookingsForSlot,
} from '@/features/booking/utils/unassignedBookingsFilter'
import {
  countTurnsUsed,
  getRemainingTurns,
  isSlotClosed,
  isTurnsExhausted,
} from '@/features/booking/utils/tableTurnLimits'
import {
  useTableStatuses,
  type TableLiveStatus,
} from '@/features/booking/hooks/useTableStatuses'
import {
  getAccurateEndTime,
  getAccurateStartTime,
  trimTimeToHHmm,
} from '@/features/booking/utils/dateUtils'
import { ServicePlanMap } from '@/features/booking/components/servizio/ServicePlanMap'
import {
  TableReleaseNoticeModal,
  type PendingTableRelease,
} from '@/features/booking/components/servizio/TableReleaseNoticeModal'
import {
  STATUS_BADGE_CLASSES,
  STATUS_CLASSES,
  STATUS_LABEL,
} from '@/features/booking/components/servizio/tableStatusStyles'
import type { RestaurantTable } from '@/features/booking/hooks/useServizioTables'
import type { Room } from '@/features/booking/hooks/useRooms'
import type { BookingRequest } from '@/types/booking'

// ─────────────────────────────────────────────
// DraggableBookingCard
// ─────────────────────────────────────────────

interface DraggableBookingCardProps {
  booking: BookingRequest
  onQuickAssign: () => void
}

const DraggableBookingCard: FC<DraggableBookingCardProps> = ({ booking, onQuickAssign }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `booking-${booking.id}`,
    data: { bookingId: booking.id },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex cursor-grab items-center gap-2 rounded-lg border border-(--color-border) bg-surface px-3 py-2.5 shadow-sm active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-(--color-text-muted)" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-primary-900">{booking.client_name}</p>
        <p className="flex items-center gap-1 text-xs text-(--color-text-muted)">
          <Users className="h-3 w-3" aria-hidden />
          {booking.num_guests} coperti
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0 text-xs"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation()
          onQuickAssign()
        }}
      >
        <MousePointerClick className="h-3.5 w-3.5" aria-hidden />
        Assegna
      </Button>
    </div>
  )
}

const DragBookingPreview: FC<{ booking: BookingRequest }> = ({ booking }) => (
  <div className="flex items-center gap-2 rounded-lg border border-primary-300 bg-primary-50 px-3 py-2.5 shadow-lg">
    <GripVertical className="h-4 w-4 shrink-0 text-primary-700" aria-hidden />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-primary-900">{booking.client_name}</p>
      <p className="flex items-center gap-1 text-xs font-medium text-primary-700">
        <Users className="h-3 w-3" aria-hidden />
        {booking.num_guests} coperti
      </p>
    </div>
  </div>
)

// ─────────────────────────────────────────────
// DroppableTable (vista a elenco)
// ─────────────────────────────────────────────

interface DroppableTableProps {
  table: RestaurantTable
  status: TableLiveStatus
  assignedBookings: BookingRequest[]
  onCheckout: () => void
  isCheckingOut: boolean
}

const DroppableTable: FC<DroppableTableProps> = ({ table, status, assignedBookings, onCheckout, isCheckingOut }) => {
  const [confirmCheckout, setConfirmCheckout] = useState(false)

  const { setNodeRef, isOver } = useDroppable({
    id: `table-${table.id}`,
    data: { tableId: table.id },
  })

  return (
    <div
      ref={setNodeRef}
      className={`relative flex min-h-[80px] flex-col justify-between rounded-xl border-2 p-3 transition-colors ${STATUS_CLASSES[status]} ${isOver ? 'ring-2 ring-primary-400 ring-offset-1' : ''}`}
    >
      <div className="flex items-start justify-between gap-1">
        <div>
          <p className="text-sm font-semibold text-primary-900">{table.name}</p>
          <p className="text-xs text-(--color-text-muted)">{table.capacity} posti</p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>

      {/* Mostra dettaglio + pulsante libera per qualsiasi stato con assegnazione attiva */}
      {assignedBookings.length > 0 && (
        <div className="mt-2 space-y-1">
          {assignedBookings.map((booking) => {
            const arrivalTime = trimTimeToHHmm(getAccurateStartTime(booking)) || null
            return (
              <div key={booking.id} className="rounded-lg bg-white/55 px-2 py-1">
                <p className="truncate text-xs font-medium text-amber-900">
                  {booking.client_name}, {booking.num_guests}
                </p>
                {arrivalTime && (
                  <p className="text-xs text-amber-800">{arrivalTime}</p>
                )}
              </div>
            )
          })}
          {confirmCheckout ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-red-700">Liberare?</span>
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={isCheckingOut}
                onClick={onCheckout}
              >
                Sì
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmCheckout(false)}
              >
                No
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setConfirmCheckout(true)}
              className="flex items-center gap-1 text-xs"
            >
              <LogOut className="h-3 w-3" aria-hidden />
              Libera tavolo
            </Button>
          )}
        </div>
      )}

      {isOver && status !== 'free' && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70">
          <p className="px-2 text-center text-xs font-semibold text-amber-800">Libera prima il tavolo</p>
        </div>
      )}

      {isOver && status === 'free' && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-primary-100/50">
          <p className="text-xs font-semibold text-primary-700">Rilascia qui</p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Componente principale
// ─────────────────────────────────────────────

/** Vista della mappa: elenco a schede oppure piantina della sala. */
export type AssignmentMapLayout = 'grid' | 'plan'

interface AssignmentMapPanelProps {
  rooms: Room[]
  tables: RestaurantTable[]
  /** 'grid' = elenco a schede (default). 'plan' = piantina sala confermata. */
  layout?: AssignmentMapLayout
  /** Sala scelta nelle linguette: su mobile/tablet è l'unica piantina mostrata. */
  selectedRoomId?: string | null
}

/**
 * Stato del dialogo di forzatura overbooking (D25).
 * Appare quando un drop verrebbe rifiutato per turni esauriti — lo staff può
 * scegliere di procedere comunque con un motivo (audit trail).
 *
 * `kind: 'replace'` (tavolo occupato, S4-FIX-5): lo staff sceglie anche `outcome`
 * per chi è già seduto — `null` finché non sceglie. `targetTableId` serve solo
 * per `outcome: 'move'` (tavolo libero di destinazione).
 */
interface ForceConfirmState {
  bookingId: string
  tableId: string
  reason: string
  kind: 'turns' | 'replace'
  outcome: ForceReplaceOutcome | null
  targetTableId: string | null
}

interface LastAssignmentState {
  assignmentIds: string[]
  bookingName: string
  tableLabel: string
  slotId: string
  date: string
}

/**
 * Modale di assegnazione rapida. `mode: 'add'` serve alle tavolate che crescono
 * (D39): la prenotazione è già su un tavolo e se ne aggiunge un altro.
 */
interface QuickAssignState {
  bookingId: string
  mode: 'assign' | 'add'
}

export const AssignmentMapPanel: FC<AssignmentMapPanelProps> = ({
  rooms,
  tables,
  layout = 'grid',
  selectedRoomId = null,
}) => {
  const today = new Date().toISOString().slice(0, 10)

  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedSlotId, setSelectedSlotId] = useState<string>('')

  // Dialogo di forzatura: presente quando un drop è bloccato per turni esauriti
  const [forceConfirm, setForceConfirm] = useState<ForceConfirmState | null>(null)
  const [quickAssign, setQuickAssign] = useState<QuickAssignState | null>(null)
  const [quickAssignSelection, setQuickAssignSelection] = useState<string[]>([])
  const [activeDragBookingId, setActiveDragBookingId] = useState<string | null>(null)
  const [lastAssignment, setLastAssignment] = useState<LastAssignmentState | null>(null)
  const [planDetailTableId, setPlanDetailTableId] = useState<string | null>(null)

  // Tavoli a fine turno per cui lo staff ha già risposto: non li ri-notifichiamo
  const [handledReleaseTableIds, setHandledReleaseTableIds] = useState<string[]>([])
  // Firma dei tavoli per cui l'avviso è stato messo da parte con "Decido dopo".
  // PERCHÉ una firma e non un booleano: se entra in uscita un tavolo NUOVO la
  // firma cambia e l'avviso torna a farsi vedere, senza riproporre quelli già visti.
  const [dismissedReleaseSignature, setDismissedReleaseSignature] = useState('')

  const { data: slots = [] } = useServiceSlots()
  const selectedSlot = slots.find((s) => s.id === selectedSlotId) ?? null

  const { data: assignments = [] } = useTableAssignments(selectedDate)
  const { data: unassigned = [] } = useUnassignedBookings(selectedDate, selectedSlot)
  const { data: acceptedOnDate = [] } = useAcceptedBookingsForDate(selectedDate)

  const bookingsById = useMemo(
    () => new Map(acceptedOnDate.map((b) => [b.id, b])),
    [acceptedOnDate],
  )

  // 5 stati live per tutti i tavoli nello slot+data correnti (D24)
  // Buffer fascia (D37): fine «In uscita» = confirmed_end + turnover_buffer
  const tableStatuses = useTableStatuses({
    assignments,
    bookingsById,
    selectedSlotId,
    selectedDate,
    turnoverBufferMinutes: selectedSlot?.turnover_buffer_minutes ?? 0,
  })

  const assignBooking = useAssignBookingToTable()
  const assignBookingToTables = useAssignBookingToTables()
  const forceReplaceBooking = useForceReplaceBookingOnTable()
  const undoAssignment = useUndoTableAssignment()
  const checkoutTable = useCheckoutTable()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const allTables = tables

  /** Cambiare fascia o giorno azzera gli avvisi già gestiti: è un altro servizio. */
  useEffect(() => {
    setHandledReleaseTableIds([])
    setDismissedReleaseSignature('')
    setLastAssignment(null)
  }, [selectedSlotId, selectedDate])

  const slotCounts = useMemo(() => {
    return new Map(
      slots.map((slot) => {
        const assignedForSlot = assignments
          .filter(
            (a) =>
              a.service_slot_id === slot.id &&
              a.date === selectedDate &&
              a.checked_out_at === null,
          )
          .map((a) => ({ booking_id: a.booking_id }))
        const count = filterUnassignedBookingsForSlot(
          acceptedOnDate,
          slot.start_time,
          slot.end_time,
          activeAssignedBookingIds(assignedForSlot),
        ).length
        return [slot.id, count]
      }),
    )
  }, [acceptedOnDate, assignments, selectedDate, slots])

  /** Assignment attivi della fascia+data correnti, ordinati per turno. */
  const activeAssignments = useMemo(
    () =>
      assignments
        .filter(
          (a) =>
            a.service_slot_id === selectedSlotId &&
            a.date === selectedDate &&
            a.checked_out_at === null,
        )
        .sort((a, b) => a.turn_number - b.turn_number),
    [assignments, selectedDate, selectedSlotId],
  )

  /** Prenotazioni attive per tavolo — usata da entrambe le viste. */
  const bookingsByTable = useMemo(() => {
    const map = new Map<string, BookingRequest[]>()
    for (const assignment of activeAssignments) {
      const booking = bookingsById.get(assignment.booking_id)
      if (!booking) continue
      const current = map.get(assignment.table_id) ?? []
      current.push(booking)
      map.set(assignment.table_id, current)
    }
    return map
  }, [activeAssignments, bookingsById])

  /**
   * Prenotazioni già assegnate, raggruppate per prenotazione (D39).
   * Serve per mostrare le tavolate su più tavoli e per aggiungerne altri:
   * una tavolata da 10 su due tavoli da 5 è una riga sola con due tavoli.
   */
  const assignedGroups = useMemo(() => {
    const byBooking = new Map<string, { booking: BookingRequest; assignments: BookingTableAssignment[] }>()
    for (const assignment of activeAssignments) {
      const booking = bookingsById.get(assignment.booking_id)
      if (!booking) continue
      const current = byBooking.get(assignment.booking_id)
      if (current) {
        current.assignments.push(assignment)
      } else {
        byBooking.set(assignment.booking_id, { booking, assignments: [assignment] })
      }
    }

    return Array.from(byBooking.values()).map(({ booking, assignments: rows }) => {
      const groupTables = rows
        .map((row) => allTables.find((t) => t.id === row.table_id) ?? null)
        .filter((table): table is RestaurantTable => table !== null)
      const seats = groupTables.reduce((sum, table) => sum + table.capacity, 0)
      return {
        booking,
        tables: groupTables,
        seats,
        // Coperti scoperti: guida l'admin a completare la tavolata
        missingSeats: Math.max(0, (booking.num_guests ?? 0) - seats),
      }
    })
  }, [activeAssignments, allTables, bookingsById])

  /**
   * Tavoli a fine turno che aspettano la conferma dello staff (D22/D23).
   * La capienza si è già liberata da sola: qui si conferma solo lo stato fisico.
   */
  const pendingReleases = useMemo<PendingTableRelease[]>(() => {
    const result: PendingTableRelease[] = []
    for (const [tableId, status] of tableStatuses) {
      if (status !== 'leaving') continue
      if (handledReleaseTableIds.includes(tableId)) continue
      const table = allTables.find((t) => t.id === tableId)
      if (!table) continue
      const booking = (bookingsByTable.get(tableId) ?? [])[0] ?? null
      const room = rooms.find((r) => r.id === table.room_id) ?? null
      result.push({
        tableId,
        tableName: table.name,
        roomName: rooms.length > 1 ? room?.name ?? null : null,
        bookingName: booking?.client_name ?? null,
        guests: booking?.num_guests ?? null,
        // Ora a muro: mai new Date(confirmed_end), che sposterebbe l'orario di fuso
        endedAtLabel: booking ? trimTimeToHHmm(getAccurateEndTime(booking)) || null : null,
      })
    }
    return result
  }, [allTables, bookingsByTable, handledReleaseTableIds, rooms, tableStatuses])

  /** Identifica il gruppo di tavoli attualmente in attesa di conferma. */
  const pendingReleaseSignature = useMemo(
    () => pendingReleases.map((r) => r.tableId).sort().join('|'),
    [pendingReleases],
  )

  // Il fine turno è un evento: la finestra si apre da sola e resta finché lo
  // staff non risponde per ogni tavolo o non la mette da parte.
  const isReleaseNoticeOpen =
    pendingReleases.length > 0 && dismissedReleaseSignature !== pendingReleaseSignature

  function findBooking(bookingId: string): BookingRequest | null {
    return unassigned.find((b) => b.id === bookingId) ?? bookingsById.get(bookingId) ?? null
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDragBookingId(String(event.active.id).replace('booking-', ''))
  }

  function rememberAssignment(bookingId: string, tableIds: string[], assignmentIds: string[]) {
    const booking = findBooking(bookingId)
    if (!booking || assignmentIds.length === 0) return
    const names = tableIds
      .map((id) => allTables.find((t) => t.id === id)?.name)
      .filter((name): name is string => Boolean(name))
    setLastAssignment({
      assignmentIds,
      bookingName: booking.client_name,
      tableLabel: names.join(', '),
      slotId: selectedSlotId,
      date: selectedDate,
    })
  }

  function openForceConfirm(state: Omit<ForceConfirmState, 'outcome' | 'targetTableId'>) {
    // Chiude la modale «Assegna tavolo» prima: altrimenti il riquadro ambra
    // resta sotto e lo staff vede solo la console (S4-UX-8 / S4-BUG-2).
    closeQuickAssign()
    setForceConfirm({ ...state, outcome: null, targetTableId: null })
  }

  function setForceOutcome(outcome: ForceReplaceOutcome) {
    setForceConfirm((prev) =>
      prev ? { ...prev, outcome, targetTableId: outcome === 'move' ? prev.targetTableId : null } : prev,
    )
  }

  function setForceTargetTable(tableId: string) {
    setForceConfirm((prev) => (prev ? { ...prev, targetTableId: tableId } : prev))
  }

  function assignToFreeTable(bookingId: string, tableId: string) {
    if (!selectedSlot) return
    const draggedBooking = findBooking(bookingId)

    assignBooking.mutate(
      {
        bookingId,
        tableId,
        slotId: selectedSlotId,
        date: selectedDate,
        maxTurns: selectedSlot.max_turns,
        existingAssignments: assignments,
        booking: draggedBooking ?? undefined,
        slot: selectedSlot,
      },
      {
        onSuccess: (data) => {
          const assignment = data as { id?: string }
          if (assignment.id) rememberAssignment(bookingId, [tableId], [assignment.id])
          closeQuickAssign()
        },
        onError: (error) => {
          if (error instanceof TurniEsauritiError) {
            openForceConfirm({
              bookingId,
              tableId,
              reason: 'Forzato dallo staff',
              kind: 'turns',
            })
          }
          // FasciaChiusaError: toast già emesso dalla mutation
        },
      },
    )
  }

  /** Assegna la stessa prenotazione a più tavoli in un colpo solo (D39). */
  function assignToSelectedTables(bookingId: string, tableIds: string[]) {
    if (!selectedSlot || tableIds.length === 0) return
    const booking = findBooking(bookingId)

    assignBookingToTables.mutate(
      {
        bookingId,
        tableIds,
        slotId: selectedSlotId,
        date: selectedDate,
        maxTurns: selectedSlot.max_turns,
        existingAssignments: assignments,
        booking: booking ?? undefined,
        slot: selectedSlot,
      },
      {
        onSuccess: (rows) => {
          rememberAssignment(bookingId, tableIds, rows.map((row) => row.id))
          closeQuickAssign()
        },
        onError: (error) => {
          if (error instanceof TurniEsauritiError) {
            openForceConfirm({
              bookingId,
              tableId: error.tableId,
              reason: 'Forzato dallo staff',
              kind: 'turns',
            })
          }
        },
      },
    )
  }

  function closeQuickAssign() {
    setQuickAssign(null)
    setQuickAssignSelection([])
  }

  function openQuickAssign(bookingId: string, mode: QuickAssignState['mode']) {
    setQuickAssign({ bookingId, mode })
    setQuickAssignSelection([])
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragBookingId(null)
    const { active, over } = event
    if (!over) return

    const bookingId = String(active.id).replace('booking-', '')
    // Le due viste usano prefissi diversi per lo stesso tavolo
    const tableId = String(over.id).replace('plan-table-', '').replace('table-', '')

    if (!selectedSlot) return
    const targetStatus = tableStatuses.get(tableId) ?? 'free'
    if (targetStatus !== 'free') {
      openForceConfirm({
        bookingId,
        tableId,
        reason: 'Forzatura guidata: tavolo occupato liberato dallo staff',
        kind: 'replace',
      })
      return
    }

    // Tavolo verde ma turni già consumati / fascia chiusa: avvisa PRIMA del fallimento muto
    if (isSlotClosed(selectedSlot.max_turns)) {
      toast.error('La fascia è chiusa: riaprila per assegnare i tavoli.')
      return
    }
    const turnsUsed = countTurnsUsed(assignments, tableId, selectedSlotId, selectedDate)
    if (isTurnsExhausted(selectedSlot.max_turns, turnsUsed)) {
      openForceConfirm({
        bookingId,
        tableId,
        reason: 'Forzato dallo staff',
        kind: 'turns',
      })
      return
    }

    assignToFreeTable(bookingId, tableId)
  }

  /** Esegue l'assegnazione forzata dopo conferma staff (D25/D27/D32). */
  function handleForceAssign() {
    if (!forceConfirm || !selectedSlot) return
    const { bookingId, tableId, reason, kind, outcome, targetTableId } = forceConfirm
    const booking = findBooking(bookingId) ?? undefined
    const onSuccess = (data: unknown) => {
      const assignment = data as { id?: string }
      if (assignment.id) rememberAssignment(bookingId, [tableId], [assignment.id])
    }

    if (kind === 'replace') {
      // «Conferma» resta spento finché manca la scelta (vedi disabled del pulsante):
      // questi guard sono una rete di sicurezza, non il percorso normale.
      if (!outcome) return
      if (outcome === 'move' && !targetTableId) return

      const displacedBooking = (bookingsByTable.get(tableId) ?? [])[0] ?? null
      const contestedTable = allTables.find((t) => t.id === tableId) ?? null
      const targetTable = targetTableId ? allTables.find((t) => t.id === targetTableId) ?? null : null

      setForceConfirm(null)
      forceReplaceBooking.mutate({
        bookingId,
        tableId,
        slotId: selectedSlotId,
        date: selectedDate,
        maxTurns: selectedSlot.max_turns,
        existingAssignments: assignments,
        booking,
        slot: selectedSlot,
        reason,
        outcome,
        targetTableId: targetTableId ?? undefined,
        displacedBookingName: displacedBooking?.client_name,
        newBookingName: booking?.client_name,
        targetTableName: targetTable?.name,
        contestedTableName: contestedTable?.name,
      }, { onSuccess })
      return
    }

    setForceConfirm(null)
    assignBooking.mutate({
      bookingId,
      tableId,
      slotId: selectedSlotId,
      date: selectedDate,
      maxTurns: selectedSlot.max_turns,
      existingAssignments: assignments,
      force: { reason },
      booking,
      slot: selectedSlot,
    }, { onSuccess })
  }

  function handleCheckout(tableId: string) {
    checkoutTable.mutate({
      tableId,
      slotId: selectedSlotId,
      date: selectedDate,
      assignments,
    })
  }

  function markReleaseHandled(tableId: string) {
    setHandledReleaseTableIds((prev) => (prev.includes(tableId) ? prev : [...prev, tableId]))
  }

  async function handleUndoLastAssignment() {
    if (!lastAssignment) return
    for (const assignmentId of lastAssignment.assignmentIds) {
      await undoAssignment.mutateAsync({
        assignmentId,
        date: lastAssignment.date,
        slotId: lastAssignment.slotId,
      })
    }
    setLastAssignment(null)
  }

  const quickAssignBooking = quickAssign ? findBooking(quickAssign.bookingId) : null
  const quickAssignExistingTableIds = quickAssign
    ? activeAssignments
        .filter((a) => a.booking_id === quickAssign.bookingId)
        .map((a) => a.table_id)
    : []
  const quickAssignSelectedSeats = quickAssignSelection.reduce((sum, tableId) => {
    const table = allTables.find((t) => t.id === tableId)
    return sum + (table?.capacity ?? 0)
  }, 0)
  const quickAssignAlreadySeats = quickAssignExistingTableIds.reduce((sum, tableId) => {
    const table = allTables.find((t) => t.id === tableId)
    return sum + (table?.capacity ?? 0)
  }, 0)

  // Riquadro «tavolo occupato» (S4-FIX-5): chi c'è già, chi si sta assegnando, il tavolo conteso.
  const forceReplaceDisplacedBooking =
    forceConfirm && forceConfirm.kind === 'replace'
      ? (bookingsByTable.get(forceConfirm.tableId) ?? [])[0] ?? null
      : null
  const forceReplaceIncomingBooking = forceConfirm ? findBooking(forceConfirm.bookingId) : null
  const forceReplaceContestedTable = forceConfirm
    ? allTables.find((t) => t.id === forceConfirm.tableId) ?? null
    : null

  // Tavoli su cui si può spostare chi è già seduto: liberi e con turni ancora disponibili.
  const forceMoveTargetTables = useMemo(() => {
    if (!forceConfirm || forceConfirm.kind !== 'replace' || !selectedSlot) return []
    return allTables.filter((table) => {
      if (table.id === forceConfirm.tableId) return false
      if ((tableStatuses.get(table.id) ?? 'free') !== 'free') return false
      if (isSlotClosed(selectedSlot.max_turns)) return false
      const turnsUsed = countTurnsUsed(assignments, table.id, selectedSlotId, selectedDate)
      return !isTurnsExhausted(selectedSlot.max_turns, turnsUsed)
    })
  }, [forceConfirm, selectedSlot, allTables, tableStatuses, assignments, selectedSlotId, selectedDate])

  const forceConfirmConfirmDisabled = (() => {
    if (!forceConfirm) return true
    if (forceConfirm.kind === 'turns') return false
    if (!forceConfirm.outcome) return true
    if (forceConfirm.outcome === 'move' && !forceConfirm.targetTableId) return true
    return false
  })()

  const forceConfirmButtonLabel = (() => {
    if (!forceConfirm || forceConfirm.kind === 'turns') return 'Assegna comunque'
    switch (forceConfirm.outcome) {
      case 'move':
        return 'Sposta e assegna'
      case 'archive':
        return 'Archivia e assegna'
      case 'requeue':
        return 'Rimetti in attesa e assegna'
      default:
        return 'Conferma'
    }
  })()

  const activeDragBooking = activeDragBookingId ? findBooking(activeDragBookingId) : null
  const planDetailTable = planDetailTableId
    ? allTables.find((t) => t.id === planDetailTableId) ?? null
    : null
  const planDetailBookings = planDetailTableId ? bookingsByTable.get(planDetailTableId) ?? [] : []

  const isAssigning =
    assignBooking.isPending || assignBookingToTables.isPending || forceReplaceBooking.isPending

  /**
   * Vista Servizio: l'elenco prenotazioni sta in TESTATA, non in colonna a sinistra.
   * Una colonna da 1/3 rubava larghezza alla piantina e diventava altissima con poche
   * prenotazioni; in striscia orizzontale la sala prende tutto lo spazio e le sale
   * possono stare affiancate a due a due.
   */
  const listInHeader = layout === 'plan'
  const shellClass = listInHeader ? 'flex flex-col gap-4' : 'flex flex-col gap-4 md:flex-row'
  const listClass = listInHeader ? 'space-y-2' : 'space-y-2 md:w-1/3 md:shrink-0'
  const cardsWrapClass = listInHeader ? 'flex gap-2 overflow-x-auto pb-1' : 'space-y-2'
  const cardItemClass = listInHeader ? 'w-64 shrink-0' : ''

  return (
    <div className="space-y-4 rounded-xl border border-(--color-border) bg-surface p-4 shadow-sm">
      <div>
        <h3 className="text-title-card font-semibold text-primary-900">Assegnazione tavoli</h3>
        <p className="mt-0.5 text-body text-(--color-text-muted)">
          Trascina una prenotazione su un tavolo per assegnarla.
        </p>
      </div>

      {/* Avviso fine turno: la capienza si è già liberata, manca la conferma fisica (D22) */}
      <TableReleaseNoticeModal
        isOpen={isReleaseNoticeOpen}
        releases={pendingReleases}
        isConfirming={checkoutTable.isPending}
        onConfirmFree={(tableId) => {
          handleCheckout(tableId)
          markReleaseHandled(tableId)
        }}
        onKeepOccupied={markReleaseHandled}
        onClose={() => setDismissedReleaseSignature(pendingReleaseSignature)}
      />

      {/* Dialogo forzatura overbooking (D25): appare quando i turni sono esauriti */}
      {forceConfirm && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            <div className="flex-1 space-y-3">
              {forceConfirm.kind === 'replace' ? (
                <>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      {forceReplaceContestedTable?.name ?? 'Il tavolo'} è occupato da{' '}
                      {forceReplaceDisplacedBooking?.client_name ?? 'un\'altra prenotazione'}
                      {forceReplaceDisplacedBooking ? ` · ${forceReplaceDisplacedBooking.num_guests} coperti` : ''}
                    </p>
                    <p className="mt-0.5 text-xs text-amber-800">
                      Stai assegnando: {forceReplaceIncomingBooking?.client_name ?? '—'}
                      {forceReplaceIncomingBooking ? ` · ${forceReplaceIncomingBooking.num_guests} coperti` : ''}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-amber-900">
                      Cosa fai di {forceReplaceDisplacedBooking?.client_name ?? 'chi è già seduto'}?
                    </p>

                    <label className="flex items-start gap-2 text-sm text-amber-900">
                      <input
                        type="radio"
                        name="force-replace-outcome"
                        className="mt-0.5"
                        checked={forceConfirm.outcome === 'move'}
                        disabled={forceMoveTargetTables.length === 0}
                        onChange={() => setForceOutcome('move')}
                      />
                      <span>
                        Sposta {forceReplaceDisplacedBooking?.client_name ?? ''} su un altro tavolo
                        {forceMoveTargetTables.length === 0 && (
                          <span className="block text-xs text-amber-700">
                            Nessun tavolo libero in questa fascia: puoi archiviare o rimettere in attesa.
                          </span>
                        )}
                      </span>
                    </label>

                    {forceConfirm.outcome === 'move' && forceMoveTargetTables.length > 0 && (
                      <div className="ml-6 space-y-2 rounded-lg border border-amber-200 bg-white/60 p-2">
                        {rooms.map((room) => {
                          const roomTables = forceMoveTargetTables.filter((t) => t.room_id === room.id)
                          if (roomTables.length === 0) return null
                          return (
                            <div key={room.id} className="space-y-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                                {room.name}
                              </p>
                              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {roomTables.map((table) => {
                                  const turnsUsed = countTurnsUsed(
                                    assignments,
                                    table.id,
                                    selectedSlotId,
                                    selectedDate,
                                  )
                                  const remaining = getRemainingTurns(
                                    selectedSlot?.max_turns ?? null,
                                    turnsUsed,
                                  )
                                  const isSelected = forceConfirm.targetTableId === table.id
                                  return (
                                    <button
                                      key={table.id}
                                      type="button"
                                      onClick={() => setForceTargetTable(table.id)}
                                      className={`relative rounded-xl border-2 p-2 text-left transition-colors ${STATUS_CLASSES.free} ${isSelected ? 'ring-2 ring-primary-500 ring-offset-1' : ''}`}
                                    >
                                      {isSelected && (
                                        <Check
                                          className="absolute right-1.5 top-1.5 h-4 w-4 text-primary-700"
                                          aria-hidden
                                        />
                                      )}
                                      <span className="block truncate text-sm font-semibold text-primary-900">
                                        {table.name}
                                      </span>
                                      <span className="block text-xs text-(--color-text-muted)">
                                        {table.capacity} posti
                                      </span>
                                      {remaining !== null && (
                                        <span className="mt-1 block text-xs text-(--color-text-muted)">
                                          {remaining} {remaining === 1 ? 'turno residuo' : 'turni residui'}
                                        </span>
                                      )}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <label className="flex items-start gap-2 text-sm text-amber-900">
                      <input
                        type="radio"
                        name="force-replace-outcome"
                        className="mt-0.5"
                        checked={forceConfirm.outcome === 'archive'}
                        onChange={() => setForceOutcome('archive')}
                      />
                      <span>
                        {forceReplaceDisplacedBooking?.client_name ?? 'La prenotazione'} ha finito: libera
                        il tavolo e archivia la prenotazione
                      </span>
                    </label>

                    <label className="flex items-start gap-2 text-sm text-amber-900">
                      <input
                        type="radio"
                        name="force-replace-outcome"
                        className="mt-0.5"
                        checked={forceConfirm.outcome === 'requeue'}
                        onChange={() => setForceOutcome('requeue')}
                      />
                      <span>
                        {forceReplaceDisplacedBooking?.client_name ?? 'La prenotazione'} torna tra le
                        prenotazioni da assegnare
                      </span>
                    </label>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-amber-900">Turni esauriti per questo tavolo</p>
                  <p className="mt-0.5 text-xs text-amber-800">
                    Vuoi assegnare comunque la prenotazione? Questa azione verrà registrata per lo staff.
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <label
                  htmlFor="force-reason"
                  className="block text-xs font-medium text-amber-900"
                >
                  Motivo (opzionale)
                </label>
                <input
                  id="force-reason"
                  type="text"
                  value={forceConfirm.reason}
                  onChange={(e) =>
                    setForceConfirm((prev) => prev ? { ...prev, reason: e.target.value } : prev)
                  }
                  placeholder="es. Richiesta speciale cliente"
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleForceAssign}
                  disabled={isAssigning || forceConfirmConfirmDisabled}
                >
                  {forceConfirmButtonLabel}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setForceConfirm(null)}
                >
                  Annulla
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quickAssignBooking && quickAssign && (
        <Modal
          isOpen
          onClose={closeQuickAssign}
          title={quickAssign.mode === 'add' ? 'Aggiungi tavolo alla tavolata' : 'Assegna tavolo'}
          size="md"
        >
          <div className="space-y-4">
            <div className="rounded-lg border border-primary-100 bg-primary-50 px-3 py-2">
              <p className="text-sm font-semibold text-primary-900">{quickAssignBooking.client_name}</p>
              <p className="flex items-center gap-1 text-xs text-primary-700">
                <Users className="h-3 w-3" aria-hidden />
                {quickAssignBooking.num_guests} coperti
              </p>
              <p className="mt-1 text-xs text-primary-800">
                Selezionati {quickAssignSelection.length} tavoli ·{' '}
                {quickAssignAlreadySeats + quickAssignSelectedSeats} posti su{' '}
                {quickAssignBooking.num_guests} richiesti
              </p>
              <p className="mt-1 text-xs text-(--color-text-muted)">
                Puoi scegliere più tavoli: una tavolata grande può stare su due tavoli piccoli.
              </p>
            </div>

            {selectedSlot && isSlotClosed(selectedSlot.max_turns) && (
              <div
                role="alert"
                className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900"
              >
                La fascia è chiusa: riaprila per assegnare i tavoli.
              </div>
            )}

            {rooms.map((room) => {
              const roomTables = allTables.filter((t) => t.room_id === room.id)
              if (roomTables.length === 0) return null
              return (
                <div key={room.id} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
                    {room.name}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {roomTables.map((table) => {
                      const status = tableStatuses.get(table.id) ?? 'free'
                      const alreadyOnBooking = quickAssignExistingTableIds.includes(table.id)
                      const isSelected = quickAssignSelection.includes(table.id)
                      const turnsUsed = countTurnsUsed(
                        assignments,
                        table.id,
                        selectedSlotId,
                        selectedDate,
                      )
                      const remaining = selectedSlot
                        ? getRemainingTurns(selectedSlot.max_turns, turnsUsed)
                        : null
                      const slotClosed = !!selectedSlot && isSlotClosed(selectedSlot.max_turns)
                      const turnsExhausted =
                        !!selectedSlot && isTurnsExhausted(selectedSlot.max_turns, turnsUsed)
                      const badgeLabel = alreadyOnBooking
                        ? 'Già in tavolata'
                        : slotClosed
                          ? 'Fascia chiusa'
                          : turnsExhausted
                            ? 'Turni esauriti'
                            : STATUS_LABEL[status]
                      return (
                        <button
                          key={table.id}
                          type="button"
                          disabled={isAssigning || alreadyOnBooking || slotClosed}
                          onClick={() => {
                            if (alreadyOnBooking || slotClosed) return
                            if (turnsExhausted) {
                              // Come «Già in tavolata»: non entra in selezione, ma forzabile di proposito
                              openForceConfirm({
                                bookingId: quickAssignBooking.id,
                                tableId: table.id,
                                reason: 'Forzato dallo staff',
                                kind: 'turns',
                              })
                              return
                            }
                            if (status === 'free') {
                              // Tavolo libero → entra/esce dalla selezione multipla
                              setQuickAssignSelection((prev) =>
                                prev.includes(table.id)
                                  ? prev.filter((id) => id !== table.id)
                                  : [...prev, table.id],
                              )
                              return
                            }
                            // Tavolo occupato → non si somma a una tavolata: serve la forzatura
                            openForceConfirm({
                              bookingId: quickAssignBooking.id,
                              tableId: table.id,
                              reason: 'Forzatura guidata: tavolo occupato liberato dallo staff',
                              kind: 'replace',
                            })
                          }}
                          className={`relative rounded-xl border-2 p-3 text-left transition-colors ${STATUS_CLASSES[status]} ${isSelected ? 'ring-2 ring-primary-500 ring-offset-1' : ''} ${alreadyOnBooking || turnsExhausted || slotClosed ? 'opacity-60' : ''}`}
                        >
                          {isSelected && (
                            <Check
                              className="absolute right-2 top-2 h-4 w-4 text-primary-700"
                              aria-hidden
                            />
                          )}
                          <span className="block truncate text-sm font-semibold text-primary-900">{table.name}</span>
                          <span className="block text-xs text-(--color-text-muted)">{table.capacity} posti</span>
                          {remaining !== null && !alreadyOnBooking && (
                            <span className="mt-1 block text-xs text-(--color-text-muted)">
                              {remaining === 0
                                ? '0 turni residui'
                                : `${remaining} ${remaining === 1 ? 'turno residuo' : 'turni residui'}`}
                            </span>
                          )}
                          <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[status]}`}>
                            {badgeLabel}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={closeQuickAssign}>
                Annulla
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={
                  quickAssignSelection.length === 0 ||
                  isAssigning ||
                  (!!selectedSlot && isSlotClosed(selectedSlot.max_turns))
                }
                onClick={() => assignToSelectedTables(quickAssignBooking.id, quickAssignSelection)}
              >
                {quickAssignSelection.length > 1
                  ? `Assegna ${quickAssignSelection.length} tavoli`
                  : 'Assegna tavolo'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Dettaglio tavolo dalla piantina: da qui si libera il tavolo */}
      {planDetailTable && (
        <Modal isOpen onClose={() => setPlanDetailTableId(null)} title={planDetailTable.name} size="sm">
          <div className="space-y-3">
            <p className="text-sm text-(--color-text-muted)">
              {STATUS_LABEL[tableStatuses.get(planDetailTable.id) ?? 'free']} ·{' '}
              {planDetailTable.capacity} posti
            </p>

            {planDetailBookings.length === 0 ? (
              <p className="text-sm text-(--color-text-muted)">
                Nessuna prenotazione su questo tavolo in questa fascia.
              </p>
            ) : (
              <ul className="space-y-1">
                {planDetailBookings.map((booking) => (
                  <li key={booking.id} className="rounded-lg border border-(--color-border) px-3 py-2">
                    <p className="text-sm font-medium text-primary-900">
                      {booking.client_name}, {booking.num_guests} coperti
                    </p>
                    {trimTimeToHHmm(getAccurateStartTime(booking)) && (
                      <p className="text-xs text-(--color-text-muted)">
                        arrivo {trimTimeToHHmm(getAccurateStartTime(booking))}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setPlanDetailTableId(null)}>
                Chiudi
              </Button>
              {planDetailBookings.length > 0 && (
                <Button
                  type="button"
                  variant="danger"
                  disabled={checkoutTable.isPending}
                  onClick={() => {
                    handleCheckout(planDetailTable.id)
                    markReleaseHandled(planDetailTable.id)
                    setPlanDetailTableId(null)
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Libera tavolo
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Selettore data + fascia */}
      <div className="flex flex-wrap gap-3">
        <div className="space-y-1">
          <label htmlFor="assign-date" className="block text-xs font-medium text-primary-900">
            Data
          </label>
          <input
            id="assign-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="assign-slot" className="block text-xs font-medium text-primary-900">
            Fascia oraria
          </label>
          <select
            id="assign-slot"
            value={selectedSlotId}
            onChange={(e) => setSelectedSlotId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">— Seleziona fascia —</option>
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}) - {slotCounts.get(s.id) ?? 0}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedSlotId && (
        <p className="text-sm text-(--color-text-muted)">Seleziona una fascia per vedere le prenotazioni e la mappa.</p>
      )}

      {selectedSlotId && (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className={shellClass}>
            {/* Prenotazioni non assegnate + tavolate già assegnate:
                in testata nella vista Servizio, in colonna nell'elenco a schede */}
            <div className={listClass}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
                  Prenotazioni ({unassigned.length})
                </p>
                {lastAssignment && (
                  <div className="flex items-center gap-1 rounded-lg border border-primary-100 bg-primary-50 px-2 py-1 text-xs text-primary-900">
                    <span className="hidden sm:inline">
                      {lastAssignment.bookingName} su {lastAssignment.tableLabel}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={undoAssignment.isPending}
                      onClick={handleUndoLastAssignment}
                    >
                      Annulla
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => setLastAssignment(null)}
                    >
                      Conferma
                    </Button>
                  </div>
                )}
              </div>
              {unassigned.length === 0 && (
                <p className="rounded-lg border border-dashed border-(--color-border) px-3 py-4 text-center text-xs text-(--color-text-muted)">
                  Nessuna prenotazione da assegnare.
                </p>
              )}
              <div className={cardsWrapClass}>
                {unassigned.map((b) => (
                  <div key={b.id} className={cardItemClass}>
                    <DraggableBookingCard
                      booking={b}
                      onQuickAssign={() => openQuickAssign(b.id, 'assign')}
                    />
                  </div>
                ))}
              </div>

              {/* Tavolate già assegnate: da qui si aggiungono altri tavoli (D39) */}
              {assignedGroups.length > 0 && (
                <div className="space-y-2 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
                    Assegnate ({assignedGroups.length})
                  </p>
                  <div className={cardsWrapClass}>
                    {assignedGroups.map((group) => (
                      <div
                        key={group.booking.id}
                        className={`rounded-lg border border-(--color-border) bg-surface px-3 py-2 shadow-sm ${cardItemClass}`}
                      >
                        <p className="truncate text-sm font-semibold text-primary-900">
                          {group.booking.client_name}
                        </p>
                        <p className="text-xs text-(--color-text-muted)">
                          {group.booking.num_guests} coperti ·{' '}
                          {group.tables.map((t) => t.name).join(', ')} ({group.seats} posti)
                        </p>
                        {group.missingSeats > 0 && (
                          <p className="mt-1 text-xs font-medium text-amber-700">
                            Mancano {group.missingSeats} posti per questa tavolata.
                          </p>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-1 text-xs"
                          onClick={() => openQuickAssign(group.booking.id, 'add')}
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden />
                          Aggiungi tavolo
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mappa tavoli con drop-zone (elenco o piantina) */}
            <div className="flex-1 space-y-3">
              {layout === 'plan' ? (
                <ServicePlanMap
                  rooms={rooms}
                  tables={allTables}
                  statuses={tableStatuses}
                  bookingsByTable={bookingsByTable}
                  onSelectTable={setPlanDetailTableId}
                  selectedRoomId={selectedRoomId}
                />
              ) : (
                rooms.map((room) => {
                  const roomTables = allTables.filter((t) => t.room_id === room.id)
                  if (roomTables.length === 0) return null
                  return (
                    <div key={room.id}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
                        {room.name}
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {roomTables.map((table) => {
                          // Stato live dal hook (5 stati D24); fallback 'free' se tavolo non in mappa
                          const status = tableStatuses.get(table.id) ?? 'free'
                          const assignedBookings = bookingsByTable.get(table.id) ?? []

                          return (
                            <DroppableTable
                              key={table.id}
                              table={table}
                              status={status}
                              assignedBookings={assignedBookings}
                              isCheckingOut={checkoutTable.isPending}
                              onCheckout={() => {
                                handleCheckout(table.id)
                                markReleaseHandled(table.id)
                              }}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              )}

              {rooms.length === 0 && (
                <p className="text-sm text-(--color-text-muted)">Nessuna sala configurata.</p>
              )}
            </div>
          </div>
          <DragOverlay>{activeDragBooking ? <DragBookingPreview booking={activeDragBooking} /> : null}</DragOverlay>
        </DndContext>
      )}
    </div>
  )
}
