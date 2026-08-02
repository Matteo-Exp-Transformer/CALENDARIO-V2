import type { FC } from 'react'
import { useDroppable } from '@dnd-kit/core'
import type { RestaurantTable } from '@/features/booking/hooks/useServizioTables'
import type { Room } from '@/features/booking/hooks/useRooms'
import type { TableLiveStatus } from '@/features/booking/hooks/useTableStatuses'
import type { BookingRequest } from '@/types/booking'
import {
  STATUS_BADGE_CLASSES,
  STATUS_CLASSES,
  STATUS_LABEL,
  STATUS_LEGEND_ORDER,
} from './tableStatusStyles'

/**
 * ServicePlanMap — vista "Servizio" della sala (piantina operativa).
 *
 * PERCHÉ esiste, in contrasto con TableMap: TableMap è la vista di MODIFICA
 * (griglia di allineamento, tavoli trascinabili, click = modifica tavolo).
 * Questa è la sala già confermata: nessuna griglia, nessun riposizionamento,
 * i tavoli tengono le posizioni decise dall'admin e mostrano lo stato live e
 * chi li occupa in questo momento.
 *
 * Le sagome hanno la stessa impronta del TableMap (64px, 96px per i
 * rettangolari): la piantina deve corrispondere esattamente a come l'admin ha
 * disposto la sala, altrimenti lo staff non la riconosce a colpo d'occhio.
 */

const SHAPE_SIZE = 64
const SHAPE_SIZE_RECT_W = 96

interface PlanTableProps {
  table: RestaurantTable
  status: TableLiveStatus
  bookings: BookingRequest[]
  onSelect: (tableId: string) => void
}

const PlanTable: FC<PlanTableProps> = ({ table, status, bookings, onSelect }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `plan-table-${table.id}`,
    data: { tableId: table.id },
  })

  const width = table.shape === 'rect' ? SHAPE_SIZE_RECT_W : SHAPE_SIZE
  const radius = table.shape === 'round' ? '9999px' : table.shape === 'square' ? '10px' : '6px'

  const occupantLabel = bookings.length > 1
    ? `${bookings.length} turni`
    : bookings[0]
      ? bookings[0].client_name
      : null
  const guests = bookings.reduce((sum, booking) => sum + (booking.num_guests ?? 0), 0)

  const title = occupantLabel
    ? `${table.name} — ${STATUS_LABEL[status]} — ${occupantLabel}, ${guests} coperti`
    : `${table.name} — ${STATUS_LABEL[status]} — ${table.capacity} posti`

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={() => onSelect(table.id)}
      title={title}
      aria-label={title}
      style={{
        position: 'absolute',
        left: table.position_x,
        top: table.position_y,
        width,
        height: SHAPE_SIZE,
        borderRadius: radius,
      }}
      className={`flex flex-col items-center justify-center overflow-hidden border-2 px-1 text-center transition-shadow ${STATUS_CLASSES[status]} ${isOver ? 'ring-2 ring-primary-500 ring-offset-1' : ''}`}
    >
      <span className="w-full truncate text-[11px] font-bold leading-tight text-primary-900">
        {table.name}
      </span>
      {occupantLabel ? (
        <>
          <span className="w-full truncate text-[10px] font-medium leading-tight text-primary-800">
            {occupantLabel}
          </span>
          <span className="text-[10px] leading-tight text-(--color-text-muted)">{guests} cop.</span>
        </>
      ) : (
        <span className="text-[10px] leading-tight text-(--color-text-muted)">
          {table.capacity} posti
        </span>
      )}
    </button>
  )
}

interface ServicePlanMapProps {
  rooms: Room[]
  tables: RestaurantTable[]
  statuses: Map<string, TableLiveStatus>
  /** Prenotazioni attive per tavolo nello slot+data correnti. */
  bookingsByTable: Map<string, BookingRequest[]>
  onSelectTable: (tableId: string) => void
}

export const ServicePlanMap: FC<ServicePlanMapProps> = ({
  rooms,
  tables,
  statuses,
  bookingsByTable,
  onSelectTable,
}) => {
  const roomsWithTables = rooms.filter((room) =>
    tables.some((table) => table.room_id === room.id),
  )

  if (roomsWithTables.length === 0) {
    return (
      <p className="text-sm text-(--color-text-muted)">
        Nessuna sala con tavoli da mostrare in piantina.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {/* Legenda: senza di questa i colori non dicono niente a chi apre la pagina */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_LEGEND_ORDER.map((status) => (
          <span
            key={status}
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[status]}`}
          >
            {STATUS_LABEL[status]}
          </span>
        ))}
      </div>

      {roomsWithTables.map((room) => {
        const roomTables = tables.filter((table) => table.room_id === room.id)
        return (
          <div key={room.id} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
              {room.name}
            </p>
            <div
              className="box-content overflow-auto rounded-xl border border-(--color-border) shadow-sm"
              style={{ width: room.width, maxWidth: '100%' }}
              data-testid={`service-plan-room-${room.id}`}
            >
              {/* Nessuna griglia di sfondo: questa è la sala confermata, non l'editor */}
              <div
                style={{
                  width: room.width,
                  height: room.height,
                  position: 'relative',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                {roomTables.map((table) => (
                  <PlanTable
                    key={table.id}
                    table={table}
                    status={statuses.get(table.id) ?? 'free'}
                    bookings={bookingsByTable.get(table.id) ?? []}
                    onSelect={onSelectTable}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
