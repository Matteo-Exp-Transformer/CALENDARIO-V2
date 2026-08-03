/**
 * Servizio-UI FIX-7 — striscia "Assegnate": la riga di testata non ripete più
 * tavolo/posti (già visibili nel dettaglio per-tavolo espandibile, che ora porta
 * il prefisso "Tavolo"); al loro posto, se presenti, note staff e intolleranze
 * della prenotazione (sola lettura, stessi campi di BookingDetailsModal:
 * `admin_notes` e `dietary_restrictions`). "Mancano N posti" resta invariato.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { TableLiveStatus } from '../../hooks/useTableStatuses'
import type { DietaryRestriction } from '@/types/booking'

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
  unassigned: [] as Array<{ id: string; client_name: string; num_guests: number }>,
  accepted: [] as Array<{
    id: string
    client_name: string
    num_guests: number
    admin_notes?: string | null
    dietary_restrictions?: DietaryRestriction[]
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

const TODAY = new Date().toISOString().slice(0, 10)

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

function selectSlot() {
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'slot-1' } })
}

function openCard(clientName: string) {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`Tavoli di ${clientName}`, 'i') }))
}

beforeEach(() => {
  mockState.tableStatuses = new Map([['t1', 'occupied']])
  mockState.unassigned = []
  mockState.assignments = [
    {
      id: 'a1',
      table_id: 't1',
      service_slot_id: 'slot-1',
      date: TODAY,
      booking_id: 'b1',
      checked_out_at: null,
      turn_number: 1,
    },
  ]
})

describe('AssignmentMapPanel — striscia "Assegnate" (FIX-7)', () => {
  it('senza note né intolleranze: solo "N coperti", niente tavolo/posti in testata', () => {
    mockState.accepted = [{ id: 'b1', client_name: 'Verdi', num_guests: 4 }]
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />)
    selectSlot()

    expect(screen.getByText('4 coperti')).toBeInTheDocument()
    expect(screen.queryByText(/T1 · 4 posti/)).not.toBeInTheDocument()
  })

  it('con note staff e intolleranze: entrambe compaiono, note sopra intolleranze', () => {
    mockState.accepted = [
      {
        id: 'b1',
        client_name: 'Verdi',
        num_guests: 4,
        admin_notes: 'Cliente abituale, tavolo vicino alla finestra',
        dietary_restrictions: [{ restriction: 'Glutine', guest_count: 1 }],
      },
    ]
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />)
    selectSlot()

    const note = screen.getByText('Cliente abituale, tavolo vicino alla finestra')
    const dietary = screen.getByText('Glutine')
    expect(note).toBeInTheDocument()
    expect(dietary).toBeInTheDocument()
    // Ordine: note prima, intolleranze dopo (stesso blocco, note come primo figlio).
    expect(
      note.compareDocumentPosition(dietary) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('il dettaglio per-tavolo espanso porta il prefisso "Tavolo"', () => {
    mockState.accepted = [{ id: 'b1', client_name: 'Verdi', num_guests: 4 }]
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />)
    selectSlot()

    openCard('Verdi')

    expect(screen.getByText(/Tavolo T1 · 4 posti/)).toBeInTheDocument()
  })
})
