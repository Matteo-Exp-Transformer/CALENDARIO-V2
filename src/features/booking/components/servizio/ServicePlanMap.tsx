import type { FC } from 'react'
import { useDroppable } from '@dnd-kit/core'
import type { RestaurantTable } from '@/features/booking/hooks/useServizioTables'
import type { Room } from '@/features/booking/hooks/useRooms'
import type { TableLiveStatus } from '@/features/booking/hooks/useTableStatuses'
import type { BookingRequest } from '@/types/booking'
import { getAccurateStartTime, trimTimeToHHmm } from '@/features/booking/utils/dateUtils'
import {
  STATUS_BADGE_CLASSES,
  STATUS_CLASSES,
  STATUS_LABEL,
  STATUS_LEGEND_ORDER,
} from './tableStatusStyles'
import { TABLE_SHAPE_SIZE, TABLE_SHAPE_SIZE_RECT_W } from './tableShapeMetrics'

/**
 * ServicePlanMap — vista "Servizio" della sala (piantina operativa).
 *
 * PERCHÉ esiste, in contrasto con TableMap: TableMap è la vista di MODIFICA
 * (griglia di allineamento, tavoli trascinabili, click = modifica tavolo).
 * Questa è la sala già confermata: nessuna griglia, nessun riposizionamento,
 * i tavoli tengono le posizioni decise dall'admin e mostrano lo stato live e
 * chi li occupa in questo momento.
 *
 * Le sagome hanno la STESSA impronta del TableMap — costanti condivise in
 * `tableShapeMetrics.ts` (80px, 120px per i rettangolari, FIX-4D 02-08-26):
 * la piantina deve corrispondere esattamente a come l'admin ha disposto la
 * sala, altrimenti lo staff non la riconosce a colpo d'occhio.
 */

interface PlanTableProps {
  table: RestaurantTable
  status: TableLiveStatus
  bookings: BookingRequest[]
  onSelect: (tableId: string) => void
  /**
   * Lampeggio (FIX-4A, 02-08-26): tavolo che appartiene alla tavolata aperta
   * nella card "Assegnate" della testata. Contorno sulla sagoma stessa (ring),
   * mai un riquadro sovrapposto — non deve rubare click né interferire col
   * rilascio drag&drop (`plan-table-<id>`). Classe CSS statica in index.css
   * (`.servizio-table-highlight`), con fallback fisso sotto
   * prefers-reduced-motion (stesso pattern di `booking-public-field-attention`).
   */
  highlighted?: boolean
}

const PlanTable: FC<PlanTableProps> = ({ table, status, bookings, onSelect, highlighted = false }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `plan-table-${table.id}`,
    data: { tableId: table.id },
  })

  const width = table.shape === 'rect' ? TABLE_SHAPE_SIZE_RECT_W : TABLE_SHAPE_SIZE
  const radius = table.shape === 'round' ? '9999px' : table.shape === 'square' ? '10px' : '6px'

  // Un solo turno in corso → possiamo mostrare l'ora di arrivo (senza
  // ambiguità). Con più turni sullo stesso tavolo "N turni" sostituisce già
  // il nome: mostrare un'ora sola sarebbe fuorviante, quindi niente arrivo.
  const singleBooking = bookings.length === 1 ? bookings[0] : null
  const occupantLabel = bookings.length > 1
    ? `${bookings.length} turni`
    : singleBooking
      ? singleBooking.client_name
      : null
  const guests = bookings.reduce((sum, booking) => sum + (booking.num_guests ?? 0), 0)
  // Ora a muro: mai new Date(confirmed_start), che sposterebbe l'orario di fuso.
  const arrivalTime = singleBooking
    ? trimTimeToHHmm(getAccurateStartTime(singleBooking))
    : ''

  const title = occupantLabel
    ? `${table.name} — ${STATUS_LABEL[status]} — ${occupantLabel}, ${guests} coperti${arrivalTime ? `, arrivo ${arrivalTime}` : ''}`
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
        height: TABLE_SHAPE_SIZE,
        borderRadius: radius,
      }}
      className={`flex flex-col items-center justify-center overflow-hidden border-2 px-1 text-center transition-shadow ${STATUS_CLASSES[status]} ${isOver ? 'ring-2 ring-primary-500 ring-offset-1' : ''} ${highlighted ? 'servizio-table-highlight' : ''}`}
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
          {/* Ora di arrivo: solo un turno singolo e solo se conosciuta — mai
              riga vuota o placeholder "--:--" (vedi getAccurateStartTime). */}
          {arrivalTime && (
            <span className="text-[10px] leading-tight text-(--color-text-muted)">
              arrivo {arrivalTime}
            </span>
          )}
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
  /**
   * Sala scelta nelle linguette sopra la mappa. Su schermi piccoli è l'UNICA
   * mostrata: da telefono/tablet due piantine affiancate sono illeggibili e
   * scrollare fra loro fa perdere il colpo d'occhio durante il servizio.
   */
  selectedRoomId?: string | null
  /**
   * Tavoli da far lampeggiare (FIX-4A): la tavolata della card "Assegnate"
   * aperta in questo momento nella testata. Vuoto/assente = nessun lampeggio.
   * LIMITE NOTO: da sotto 1024px si vede una sola sala per volta (linguette);
   * se i tavoli evidenziati stanno nell'altra sala, qui non si vedono finché
   * l'admin non cambia linguetta — nessuna scorciatoia automatica di sala.
   */
  highlightedTableIds?: string[]
}

export const ServicePlanMap: FC<ServicePlanMapProps> = ({
  rooms,
  tables,
  statuses,
  bookingsByTable,
  onSelectTable,
  selectedRoomId = null,
  highlightedTableIds,
}) => {
  const roomsWithTables = rooms.filter((room) =>
    tables.some((table) => table.room_id === room.id),
  )
  const highlightedSet = new Set(highlightedTableIds ?? [])

  if (roomsWithTables.length === 0) {
    return (
      <p className="text-sm text-(--color-text-muted)">
        Nessuna sala con tavoli da mostrare in piantina.
      </p>
    )
  }

  // Se la sala delle linguette non ha tavoli (o non è ancora scelta) ripiega
  // sulla prima con tavoli: su mobile il pannello non deve mai restare vuoto.
  const visibleRoomId =
    roomsWithTables.find((room) => room.id === selectedRoomId)?.id ?? roomsWithTables[0].id

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

      {/* Da lg in su le sale stanno affiancate a due a due; sotto resta una
          colonna sola e si vede solo la sala scelta nelle linguette. */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {roomsWithTables.map((room) => {
          const roomTables = tables.filter((table) => table.room_id === room.id)
          const isVisibleOnSmall = room.id === visibleRoomId
          return (
            <div
              key={room.id}
              // min-w-0: senza, la piantina a larghezza fissa sfonda la colonna della griglia
              className={`min-w-0 space-y-2 ${isVisibleOnSmall ? '' : 'hidden lg:block'}`}
              data-room-visibility={isVisibleOnSmall ? 'always' : 'desktop-only'}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
                {room.name}
              </p>
              <div
                className="box-content max-h-[70dvh] overflow-auto rounded-xl border border-(--color-border) shadow-sm lg:max-h-none"
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
                      highlighted={highlightedSet.has(table.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
