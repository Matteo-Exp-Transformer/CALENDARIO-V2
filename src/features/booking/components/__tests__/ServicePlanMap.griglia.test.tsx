/**
 * Piantine delle sale in «Assegnazione tavoli»: due colonne da desktop,
 * una sola sala (quella scelta nelle linguette) da mobile/tablet.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import { ServicePlanMap } from '../servizio/ServicePlanMap'
import type { Room } from '../../hooks/useRooms'
import type { RestaurantTable } from '../../hooks/useServizioTables'
import type { TableLiveStatus } from '../../hooks/useTableStatuses'

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
