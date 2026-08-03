/**
 * Servizio-UI FIX-5 — la piantina "Servizio" (layout="plan") resta visibile anche
 * senza fascia selezionata: prima spariva del tutto dietro il messaggio "Seleziona
 * una fascia...". Decisione prodotto (opzione A): niente drag&drop e niente lista
 * prenotazioni finché manca la fascia, ma la sala si vede comunque.
 * layout="grid" (solo test, elenco a schede) resta gated come prima.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { TableLiveStatus } from '../../hooks/useTableStatuses'

const mockState = vi.hoisted(() => ({
  tableStatuses: new Map<string, TableLiveStatus>(),
  assignments: [] as Array<{
    id: string
    table_id: string
    service_slot_id: string
    date: string
    booking_id: string
    checked_out_at: string | null
    turn_number: number
  }>,
  unassigned: [] as Array<{
    id: string
    client_name: string
    num_guests: number
    confirmed_start?: string
  }>,
  accepted: [] as Array<{
    id: string
    client_name: string
    num_guests: number
    confirmed_start?: string
  }>,
}))

vi.mock('../../hooks/useTableStatuses', () => ({
  useTableStatuses: () => mockState.tableStatuses,
  DEFAULT_LATE_THRESHOLD_MINUTES: 15,
}))

vi.mock('../../hooks/useTableAssignments', () => ({
  useTableAssignments: () => ({ data: mockState.assignments }),
  useUnassignedBookings: () => ({ data: mockState.unassigned }),
  useAcceptedBookingsForDate: () => ({ data: mockState.accepted }),
  useAssignBookingToTable: () => ({ mutate: vi.fn(), isPending: false }),
  useAssignBookingToTables: () => ({ mutate: vi.fn(), isPending: false }),
  useForceReplaceBookingOnTable: () => ({ mutate: vi.fn(), isPending: false }),
  useUndoTableAssignment: () => ({ mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false }),
  useCheckoutTable: () => ({ mutate: vi.fn(), isPending: false }),
  TurniEsauritiError: class TurniEsauritiError extends Error {
    tableId: string
    constructor(tableId: string) {
      super('Turni esauriti')
      this.name = 'TurniEsauritiError'
      this.tableId = tableId
    }
  },
}))

vi.mock('../../hooks/useServiceSlots', () => ({
  useServiceSlots: () => ({
    data: [
      { id: 'slot-1', name: 'Cena', start_time: '19:00:00', end_time: '23:00:00', max_turns: null },
    ],
  }),
}))

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: () => ({ tenantId: 'tenant-1' }),
}))

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DragOverlay: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PointerSensor: class {},
  useSensor: vi.fn(() => ({})),
  useSensors: vi.fn(() => []),
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
  useDroppable: () => ({ setNodeRef: vi.fn(), isOver: false }),
  CSS: { Translate: { toString: () => '' } },
}))

vi.mock('@/components/ui', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }) => (
    <button type={type ?? 'button'} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  ),
  Modal: ({
    children,
    isOpen,
    title,
  }: {
    children: React.ReactNode
    isOpen: boolean
    title?: string
  }) => (isOpen ? <div role="dialog" aria-label={title}>{children}</div> : null),
}))

import React from 'react'
import { AssignmentMapPanel } from '../servizio/AssignmentMapPanel'
import type { RestaurantTable } from '../../hooks/useServizioTables'
import type { Room } from '../../hooks/useRooms'

const ROOM: Room = {
  id: 'room-1',
  tenant_id: 't1',
  name: 'Sala',
  width: 800,
  height: 600,
  display_order: 1,
  active: true,
  created_at: '',
  updated_at: '',
}

function makeTable(id: string, name: string): RestaurantTable {
  return {
    id,
    tenant_id: 't1',
    name,
    capacity: 4,
    placement: 'inside',
    active: true,
    room_id: 'room-1',
    position_x: 0,
    position_y: 0,
    shape: 'square',
    created_at: '',
    updated_at: '',
  }
}

beforeEach(() => {
  mockState.tableStatuses = new Map([['t1', 'free']])
  mockState.assignments = []
  mockState.unassigned = []
  mockState.accepted = []
})

describe('AssignmentMapPanel — piantina "Servizio" senza fascia (FIX-5)', () => {
  it('layout "plan": la piantina resta visibile senza fascia, niente lista prenotazioni', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />)

    expect(
      screen.getByText(/Seleziona una fascia per assegnare i tavoli e vedere le prenotazioni/i),
    ).toBeInTheDocument()
    // La sagoma del tavolo è nel DOM: la piantina non è nascosta dietro il messaggio.
    expect(screen.getByText('T1')).toBeInTheDocument()
    // Niente striscia "Prenotazioni (N)" finché non c'è una fascia.
    expect(screen.queryByText(/Prenotazioni \(/)).not.toBeInTheDocument()
  })

  it('layout "plan": scegliendo la fascia compaiono anche prenotazioni e drag&drop', () => {
    mockState.unassigned = [
      { id: 'b-1', client_name: 'Verdi', num_guests: 2, confirmed_start: '2026-08-03T20:00:00+00:00' },
    ]
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'slot-1' } })

    expect(screen.getByText(/Prenotazioni \(1\)/)).toBeInTheDocument()
    expect(screen.getByText('Verdi')).toBeInTheDocument()
    expect(screen.getByText('T1')).toBeInTheDocument()
  })

  it('layout "grid": resta gated dalla fascia come prima (nessuna piantina qui)', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="grid" />)

    expect(
      screen.getByText(/Seleziona una fascia per vedere le prenotazioni e la mappa/i),
    ).toBeInTheDocument()
    expect(screen.queryByText('T1')).not.toBeInTheDocument()
  })
})
