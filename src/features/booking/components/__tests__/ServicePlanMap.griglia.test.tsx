/**
 * Piantine delle sale in «Assegnazione tavoli»: due colonne da desktop,
 * una sola sala (quella scelta nelle linguette) da mobile/tablet.
 */

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import { ServicePlanMap } from '../servizio/ServicePlanMap'
import { TableShape } from '../servizio/TableShape'
import { TABLE_SHAPE_SIZE, TABLE_SHAPE_SIZE_RECT_W } from '../servizio/tableShapeMetrics'
import type { Room } from '../../hooks/useRooms'
import type { RestaurantTable } from '../../hooks/useServizioTables'
import type { TableLiveStatus } from '../../hooks/useTableStatuses'
import type { BookingRequest } from '@/types/booking'

function makeRoom(id: string, name: string): Room {
  return {
    id,
    tenant_id: 't-1',
    name,
    width: 600,
    height: 400,
    active: true,
    created_at: '2026-08-02T00:00:00Z',
  } as unknown as Room
}

function makeTable(id: string, roomId: string): RestaurantTable {
  return {
    id,
    tenant_id: 't-1',
    room_id: roomId,
    name: id,
    capacity: 4,
    shape: 'square',
    position_x: 10,
    position_y: 10,
    active: true,
  } as unknown as RestaurantTable
}

function makeBooking(id: string, overrides: Partial<BookingRequest> = {}): BookingRequest {
  return {
    id,
    client_name: 'Mario Rossi',
    num_guests: 4,
    ...overrides,
  } as unknown as BookingRequest
}

const rooms = [makeRoom('r-a', 'Sala A'), makeRoom('r-b', 'Sala B'), makeRoom('r-c', 'Sala C')]
const tables = [makeTable('A1', 'r-a'), makeTable('B1', 'r-b'), makeTable('C1', 'r-c')]

function renderMap(selectedRoomId: string | null, roomList: Room[] = rooms) {
  return render(
    <DndContext>
      <ServicePlanMap
        rooms={roomList}
        tables={tables}
        statuses={new Map<string, TableLiveStatus>()}
        bookingsByTable={new Map()}
        onSelectTable={() => {}}
        selectedRoomId={selectedRoomId}
      />
    </DndContext>,
  )
}

/** Wrapper della sala: porta la classe di visibilità e il data-attribute. */
function roomWrapper(roomId: string): HTMLElement {
  const plan = screen.getByTestId(`service-plan-room-${roomId}`)
  const wrapper = plan.parentElement
  if (!wrapper) throw new Error(`wrapper mancante per ${roomId}`)
  return wrapper
}

describe('ServicePlanMap — griglia sale', () => {
  it('mette le sale in una griglia a 2 colonne da lg in su', () => {
    renderMap('r-a')
    const grid = roomWrapper('r-a').parentElement
    expect(grid?.className).toContain('grid')
    expect(grid?.className).toContain('lg:grid-cols-2')
    expect(grid?.className).toContain('grid-cols-1')
  })

  it('da mobile/tablet mostra solo la sala scelta nelle linguette', () => {
    renderMap('r-b')

    expect(roomWrapper('r-b')).toHaveAttribute('data-room-visibility', 'always')
    expect(roomWrapper('r-b').className).not.toContain('hidden')

    for (const hidden of ['r-a', 'r-c']) {
      expect(roomWrapper(hidden)).toHaveAttribute('data-room-visibility', 'desktop-only')
      expect(roomWrapper(hidden).className).toContain('hidden')
      // …ma su desktop tornano visibili nella seconda colonna
      expect(roomWrapper(hidden).className).toContain('lg:block')
    }
  })

  it('cambiando sala nelle linguette cambia la sala mostrata', () => {
    const { rerender } = renderMap('r-a')
    expect(roomWrapper('r-a')).toHaveAttribute('data-room-visibility', 'always')

    rerender(
      <DndContext>
        <ServicePlanMap
          rooms={rooms}
          tables={tables}
          statuses={new Map<string, TableLiveStatus>()}
          bookingsByTable={new Map()}
          onSelectTable={() => {}}
          selectedRoomId="r-c"
        />
      </DndContext>,
    )

    expect(roomWrapper('r-c')).toHaveAttribute('data-room-visibility', 'always')
    expect(roomWrapper('r-a')).toHaveAttribute('data-room-visibility', 'desktop-only')
  })

  it('senza sala scelta ripiega sulla prima con tavoli (mai vuoto su mobile)', () => {
    renderMap(null)
    expect(roomWrapper('r-a')).toHaveAttribute('data-room-visibility', 'always')
  })

  it('se la sala scelta non ha tavoli mostra comunque la prima con tavoli', () => {
    const withEmpty = [makeRoom('r-vuota', 'Sala vuota'), ...rooms]
    renderMap('r-vuota', withEmpty)

    expect(screen.queryByTestId('service-plan-room-r-vuota')).toBeNull()
    expect(roomWrapper('r-a')).toHaveAttribute('data-room-visibility', 'always')
  })
})

/**
 * FIX-4D (02-08-26): la piantina di servizio (ServicePlanMap, sagome HTML) e
 * l'editor sala (TableShape, sagome SVG) DEVONO disegnare i tavoli alla
 * stessa dimensione — altrimenti la piantina non corrisponde più a come
 * l'admin ha disposto la sala. Le due costanti vivono ora in un unico modulo
 * condiviso (`tableShapeMetrics.ts`): questi test lo dimostrano confrontando
 * l'impronta effettiva delle due viste, non solo il valore delle costanti.
 */
describe('ServicePlanMap — stessa impronta di TableShape (FIX-4D, tableShapeMetrics condiviso)', () => {
  it('tavolo quadrato: stessa larghezza/altezza in editor (SVG) e piantina di servizio (HTML)', () => {
    const squareTable = makeTable('SQ1', 'r-sq')

    const { container: editorContainer } = render(
      <TableShape table={squareTable} onEdit={() => {}} />,
    )
    const svg = editorContainer.querySelector('svg')
    expect(svg).toHaveAttribute('width', String(TABLE_SHAPE_SIZE))
    expect(svg).toHaveAttribute('height', String(TABLE_SHAPE_SIZE))

    // container dedicato: TableShape sopra è già in pagina con un role="button"
    // che inizia per lo stesso id ("SQ1, 4 posti") — la query va isolata al
    // secondo render, non cercata su tutto `screen`.
    const { container: planContainer } = render(
      <DndContext>
        <ServicePlanMap
          rooms={[makeRoom('r-sq', 'Sala Quadrata')]}
          tables={[squareTable]}
          statuses={new Map<string, TableLiveStatus>()}
          bookingsByTable={new Map()}
          onSelectTable={() => {}}
          selectedRoomId="r-sq"
        />
      </DndContext>,
    )
    const planButton = within(planContainer).getByRole('button', { name: /^SQ1/ })
    expect(planButton).toHaveStyle({
      width: `${TABLE_SHAPE_SIZE}px`,
      height: `${TABLE_SHAPE_SIZE}px`,
    })
  })

  it('tavolo rettangolare: stessa impronta più larga in editor (SVG) e piantina di servizio (HTML)', () => {
    const rectTable: RestaurantTable = { ...makeTable('RC1', 'r-rc'), shape: 'rect' }

    const { container: editorContainer } = render(
      <TableShape table={rectTable} onEdit={() => {}} />,
    )
    const svg = editorContainer.querySelector('svg')
    expect(svg).toHaveAttribute('width', String(TABLE_SHAPE_SIZE_RECT_W))
    expect(svg).toHaveAttribute('height', String(TABLE_SHAPE_SIZE))

    const { container: planContainer } = render(
      <DndContext>
        <ServicePlanMap
          rooms={[makeRoom('r-rc', 'Sala Rettangolare')]}
          tables={[rectTable]}
          statuses={new Map<string, TableLiveStatus>()}
          bookingsByTable={new Map()}
          onSelectTable={() => {}}
          selectedRoomId="r-rc"
        />
      </DndContext>,
    )
    const planButton = within(planContainer).getByRole('button', { name: /^RC1/ })
    expect(planButton).toHaveStyle({
      width: `${TABLE_SHAPE_SIZE_RECT_W}px`,
      height: `${TABLE_SHAPE_SIZE}px`,
    })
  })
})

/**
 * FIX-4D (02-08-26): l'ora di arrivo dentro la sagoma. Ora a muro via
 * getAccurateStartTime/trimTimeToHHmm (mai new Date(confirmed_start)); mai
 * placeholder "--:--"; mai un'ora sola quando ci sono più turni ("N turni").
 */
describe('ServicePlanMap — ora di arrivo nella sagoma (FIX-4D)', () => {
  /**
   * Ritorna la sagoma del tavolo (non `screen`): la legenda mostra sempre un
   * badge "In arrivo" che contiene la sottostringa "arrivo" — le assert su
   * presenza/assenza dell'ora vanno isolate al bottone del tavolo.
   */
  function renderSingleTable(
    table: RestaurantTable,
    bookings: BookingRequest[],
  ): HTMLElement {
    const { container } = render(
      <DndContext>
        <ServicePlanMap
          rooms={[makeRoom('r-x', 'Sala X')]}
          tables={[table]}
          statuses={new Map<string, TableLiveStatus>()}
          bookingsByTable={new Map([[table.id, bookings]])}
          onSelectTable={() => {}}
          selectedRoomId="r-x"
        />
      </DndContext>,
    )
    return within(container).getByRole('button', { name: new RegExp(`^${table.id}`) })
  }

  it('un solo turno con orario noto → mostra "arrivo HH:mm"', () => {
    const table = makeTable('T1', 'r-x')
    const tableButton = renderSingleTable(table, [makeBooking('bk-1', { desired_time: '20:30' })])

    expect(within(tableButton).getByText('arrivo 20:30')).toBeInTheDocument()
  })

  it('più turni sullo stesso tavolo → "N turni" ma nessuna ora (sarebbero due)', () => {
    const table = makeTable('T2', 'r-x')
    const tableButton = renderSingleTable(table, [
      makeBooking('bk-1', { desired_time: '19:00' }),
      makeBooking('bk-2', { desired_time: '21:00' }),
    ])

    expect(within(tableButton).getByText('2 turni')).toBeInTheDocument()
    expect(within(tableButton).queryByText(/arrivo/)).toBeNull()
  })

  it('orario mancante → nessuna riga vuota né placeholder "--:--"', () => {
    const table = makeTable('T3', 'r-x')
    const tableButton = renderSingleTable(table, [makeBooking('bk-1', { desired_time: undefined, confirmed_start: undefined })])

    expect(within(tableButton).queryByText(/arrivo/)).toBeNull()
    expect(within(tableButton).queryByText('--:--')).toBeNull()
  })
})
