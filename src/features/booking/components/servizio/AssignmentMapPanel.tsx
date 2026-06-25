import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { Users, LogOut, GripVertical, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui'
import { useServiceSlots } from '@/features/booking/hooks/useServiceSlots'
import {
  useTableAssignments,
  useUnassignedBookings,
  useAcceptedBookingsForDate,
  useAssignBookingToTable,
  useCheckoutTable,
  TurniEsauritiError,
} from '@/features/booking/hooks/useTableAssignments'
import {
  useTableStatuses,
  type TableLiveStatus,
} from '@/features/booking/hooks/useTableStatuses'
import { getAccurateStartTime, trimTimeToHHmm } from '@/features/booking/utils/dateUtils'
import type { RestaurantTable } from '@/features/booking/hooks/useServizioTables'
import type { Room } from '@/features/booking/hooks/useRooms'
import type { BookingRequest } from '@/types/booking'

// ─────────────────────────────────────────────
// Colori e label per i 5 stati live (D24)
// ─────────────────────────────────────────────

const STATUS_CLASSES: Record<TableLiveStatus, string> = {
  free:     'bg-emerald-100 border-emerald-300',
  upcoming: 'bg-cyan-100 border-cyan-400',
  occupied: 'bg-amber-100 border-amber-400',
  late:     'bg-red-100 border-red-400',
  leaving:  'bg-violet-100 border-violet-300',
}

const STATUS_LABEL: Record<TableLiveStatus, string> = {
  free:     'Libero',
  upcoming: 'In arrivo',
  occupied: 'Occupato',
  late:     'In ritardo',
  leaving:  'In uscita',
}

/** Badge inline per ogni stato — colori coerenti con STATUS_CLASSES. */
const STATUS_BADGE_CLASSES: Record<TableLiveStatus, string> = {
  free:     'bg-emerald-200 text-emerald-800',
  upcoming: 'bg-cyan-200 text-cyan-800',
  occupied: 'bg-amber-200 text-amber-800',
  late:     'bg-red-200 text-red-800',
  leaving:  'bg-violet-200 text-violet-800',
}

// ─────────────────────────────────────────────
// DraggableBookingCard
// ─────────────────────────────────────────────

interface DraggableBookingCardProps {
  booking: BookingRequest
}

const DraggableBookingCard: FC<DraggableBookingCardProps> = ({ booking }) => {
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
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-primary-900">{booking.client_name}</p>
        <p className="flex items-center gap-1 text-xs text-(--color-text-muted)">
          <Users className="h-3 w-3" aria-hidden />
          {booking.num_guests} coperti
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// DroppableTable
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
    disabled: status !== 'free',
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

interface AssignmentMapPanelProps {
  rooms: Room[]
  tables: RestaurantTable[]
}

/**
 * Stato del dialogo di forzatura overbooking (D25).
 * Appare quando un drop verrebbe rifiutato per turni esauriti — lo staff può
 * scegliere di procedere comunque con un motivo (audit trail).
 */
interface ForceConfirmState {
  bookingId: string
  tableId: string
  reason: string
}

export const AssignmentMapPanel: FC<AssignmentMapPanelProps> = ({ rooms, tables }) => {
  const today = new Date().toISOString().slice(0, 10)

  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedSlotId, setSelectedSlotId] = useState<string>('')

  // Dialogo di forzatura: presente quando un drop è bloccato per turni esauriti
  const [forceConfirm, setForceConfirm] = useState<ForceConfirmState | null>(null)

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
  const tableStatuses = useTableStatuses({
    assignments,
    bookingsById,
    selectedSlotId,
    selectedDate,
  })

  const assignBooking = useAssignBookingToTable()
  const checkoutTable = useCheckoutTable()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const bookingId = String(active.id).replace('booking-', '')
    const tableId = String(over.id).replace('table-', '')

    if (!selectedSlot) return
    const targetStatus = tableStatuses.get(tableId) ?? 'free'
    if (targetStatus !== 'free') return
    const draggedBooking = unassigned.find((booking) => booking.id === bookingId) ?? null

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
        onError: (error) => {
          // Turni esauriti: offriamo la forzatura invece di fallire silenziosamente (D25)
          if (error instanceof TurniEsauritiError) {
            setForceConfirm({
              bookingId,
              tableId,
              reason: 'Forzato dallo staff',
            })
          }
          // Gli altri errori vengono gestiti dall'onError globale della mutation
        },
      },
    )
  }

  /** Esegue l'assegnazione forzata dopo conferma staff (D25/D27/D32). */
  function handleForceAssign() {
    if (!forceConfirm || !selectedSlot) return
    const { bookingId, tableId, reason } = forceConfirm
    setForceConfirm(null)
    assignBooking.mutate({
      bookingId,
      tableId,
      slotId: selectedSlotId,
      date: selectedDate,
      maxTurns: selectedSlot.max_turns,
      existingAssignments: assignments,
      force: { reason },
    })
  }

  const allTables = tables

  return (
    <div className="space-y-4 rounded-xl border border-(--color-border) bg-surface p-4 shadow-sm">
      <div>
        <h3 className="text-title-card font-semibold text-primary-900">Assegnazione tavoli</h3>
        <p className="mt-0.5 text-body text-(--color-text-muted)">
          Trascina una prenotazione su un tavolo per assegnarla.
        </p>
      </div>

      {/* Dialogo forzatura overbooking (D25): appare quando i turni sono esauriti */}
      {forceConfirm && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm font-semibold text-amber-900">Turni esauriti per questo tavolo</p>
                <p className="mt-0.5 text-xs text-amber-800">
                  Vuoi assegnare comunque la prenotazione? Questa azione verrà registrata per lo staff.
                </p>
              </div>
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
                  disabled={assignBooking.isPending}
                >
                  Assegna comunque
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
                {s.name} ({s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedSlotId && (
        <p className="text-sm text-(--color-text-muted)">Seleziona una fascia per vedere le prenotazioni e la mappa.</p>
      )}

      {selectedSlotId && (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-4">
            {/* Panel sinistro: prenotazioni non assegnate */}
            <div className="w-1/3 shrink-0 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
                Prenotazioni ({unassigned.length})
              </p>
              {unassigned.length === 0 && (
                <p className="rounded-lg border border-dashed border-(--color-border) px-3 py-4 text-center text-xs text-(--color-text-muted)">
                  Nessuna prenotazione da assegnare.
                </p>
              )}
              {unassigned.map((b) => (
                <DraggableBookingCard key={b.id} booking={b} />
              ))}
            </div>

            {/* Panel destro: mappa tavoli con drop-zone */}
            <div className="flex-1 space-y-3">
              {rooms.map((room) => {
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
                        const activeAssignments = assignments
                          .filter(
                            (a) =>
                              a.table_id === table.id &&
                              a.service_slot_id === selectedSlotId &&
                              a.date === selectedDate &&
                              a.checked_out_at === null,
                          )
                          .sort((a, b) => a.turn_number - b.turn_number)
                        const assignedBookings = activeAssignments
                          .map((a) => bookingsById.get(a.booking_id) ?? null)
                          .filter((booking): booking is BookingRequest => booking !== null)

                        return (
                          <DroppableTable
                            key={table.id}
                            table={table}
                            status={status}
                            assignedBookings={assignedBookings}
                            isCheckingOut={checkoutTable.isPending}
                            onCheckout={() =>
                              checkoutTable.mutate({
                                tableId: table.id,
                                slotId: selectedSlotId,
                                date: selectedDate,
                                assignments,
                              })
                            }
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {rooms.length === 0 && (
                <p className="text-sm text-(--color-text-muted)">Nessuna sala configurata.</p>
              )}
            </div>
          </div>
        </DndContext>
      )}
    </div>
  )
}
