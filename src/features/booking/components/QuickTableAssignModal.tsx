import { useState, useMemo } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useRooms } from '../hooks/useRooms'
import { useTables } from '../hooks/useServizioTables'
import { useServiceSlots } from '../hooks/useServiceSlots'
import { useAssignBookingToTable, type BookingTableAssignment, getTableStatus } from '../hooks/useTableAssignments'
import { bookingStartsInServiceSlot } from '../utils/serviceSlotBookingFilter'
import type { BookingRequest } from '@/types/booking'
import type { ServiceSlot } from '../hooks/useServiceSlots'
import { cn } from '@/lib/utils'

interface Props {
  booking: BookingRequest
  date: string
  serviceSlots: ServiceSlot[]
  tableAssignments: BookingTableAssignment[]
  onClose: () => void
}

export function QuickTableAssignModal({ booking, date, serviceSlots, tableAssignments, onClose }: Props) {
  const { data: rooms = [] } = useRooms()
  const { data: allTables = [] } = useTables()
  const { data: freshSlots = [] } = useServiceSlots()
  const assign = useAssignBookingToTable()

  const [selectedRoomId, setSelectedRoomId] = useState<string>('')

  // Fascia derivata dall'orario della prenotazione
  const derivedSlot = useMemo(() => {
    const slots = freshSlots.length > 0 ? freshSlots : serviceSlots
    return slots.find((s) => bookingStartsInServiceSlot(booking, s.start_time, s.end_time)) ?? null
  }, [booking, freshSlots, serviceSlots])

  const tablesInRoom = useMemo(
    () => allTables.filter((t) => t.room_id === selectedRoomId),
    [allTables, selectedRoomId],
  )

  const noConfig = rooms.length === 0 || allTables.length === 0

  function handleAssign(tableId: string) {
    if (!derivedSlot) return
    assign.mutate(
      {
        bookingId: booking.id,
        tableId,
        slotId: derivedSlot.id,
        date,
        maxTurns: derivedSlot.max_turns,
        existingAssignments: tableAssignments,
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Modal isOpen onClose={onClose} title="Assegna tavolo" size="md">
      {noConfig ? (
        <p className="py-4 text-sm text-(--color-text-muted)">
          Configura sale e tavoli nella pagina Servizio prima di usare questa funzione.
        </p>
      ) : (
        <div className="space-y-4">
          {!derivedSlot && (
            <p className="rounded-lg border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-sm text-(--color-text-muted)">
              Orario della prenotazione non riconducibile a nessuna fascia configurata.
            </p>
          )}

          {/* Selezione sala */}
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-primary-900">Sala</p>
            <div className="flex flex-wrap gap-2">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setSelectedRoomId(room.id)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                    selectedRoomId === room.id
                      ? 'border-primary-400 bg-primary-50 text-primary-900'
                      : 'border-(--color-border) bg-surface text-primary-900 hover:bg-primary-50',
                  )}
                >
                  {room.name}
                </button>
              ))}
            </div>
          </div>

          {/* Griglia tavoli */}
          {selectedRoomId && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-primary-900">Tavolo</p>
              {tablesInRoom.length === 0 ? (
                <p className="text-sm text-(--color-text-muted)">Nessun tavolo in questa sala.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {tablesInRoom.map((table) => {
                    const status = derivedSlot
                      ? getTableStatus(table.id, tableAssignments, derivedSlot.id, date)
                      : 'free'
                    const occupied = status === 'assigned'
                    return (
                      <button
                        key={table.id}
                        type="button"
                        disabled={occupied || !derivedSlot || assign.isPending}
                        onClick={() => handleAssign(table.id)}
                        className={cn(
                          'rounded-xl border px-2 py-3 text-center text-sm font-medium transition-colors',
                          occupied
                            ? 'cursor-not-allowed border-(--color-border) bg-(--color-surface-2) text-(--color-text-muted) opacity-60'
                            : 'border-primary-200 bg-primary-50 text-primary-900 hover:bg-primary-100',
                        )}
                      >
                        <span className="block truncate">{table.name}</span>
                        <span className="block text-[11px] font-normal opacity-70">
                          {table.capacity} posti
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="ghost" onClick={onClose}>
              Annulla
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
