/**
 * FIX-4A (S4 giro 4, corsia "card assegnate") — la card "Assegnate" nella
 * testata della vista Servizio si apre/chiude, mostra i tavoli della
 * tavolata uno per riga e permette di TOGLIERE un singolo tavolo (senza
 * consumare un turno né archiviare la prenotazione) invece di poterne solo
 * aggiungere. Al click i tavoli della tavolata lampeggiano nella piantina.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
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
    created_at: string
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
  undoMutate: vi.fn(),
  checkoutMutate: vi.fn(),
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
  // Togli tavolo DEVE passare da qui (DELETE fisico, non consuma turno) — mai da useCheckoutTable.
  useUndoTableAssignment: () => ({ mutate: mockState.undoMutate, mutateAsync: vi.fn(), isPending: false }),
  useCheckoutTable: () => ({ mutate: mockState.checkoutMutate, isPending: false }),
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
      { id: 'slot-1', name: 'Pranzo', start_time: '11:30:00', end_time: '15:30:00', max_turns: null },
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
  mockState.undoMutate.mockReset()
  mockState.checkoutMutate.mockReset()
})

describe('FIX-4A — apertura/chiusura della card "Assegnate"', () => {
  beforeEach(() => {
    mockState.tableStatuses = new Map([['t1', 'occupied'], ['t2', 'occupied']])
    mockState.unassigned = []
    mockState.accepted = [{ id: 'b1', client_name: 'Verdi', num_guests: 8 }]
    mockState.assignments = [
      { id: 'a1', table_id: 't1', service_slot_id: 'slot-1', date: TODAY, booking_id: 'b1', checked_out_at: null, turn_number: 1, created_at: '2026-08-02T10:00:00Z' },
      { id: 'a2', table_id: 't2', service_slot_id: 'slot-1', date: TODAY, booking_id: 'b1', checked_out_at: null, turn_number: 1, created_at: '2026-08-02T10:00:01Z' },
    ]
  })

  it('è chiusa di default: nessun elenco tavoli, nessun pulsante "Togli"', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1'), makeTable('t2', 'T2')]} layout="plan" />)
    selectSlot()

    expect(screen.queryByText('Togli')).not.toBeInTheDocument()
    expect(screen.queryByText(/T1 · 4 posti/)).not.toBeInTheDocument()
  })

  it('un click sulla card la apre e mostra un tavolo per riga (nome tavolo · posti)', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1'), makeTable('t2', 'T2')]} layout="plan" />)
    selectSlot()

    openCard('Verdi')

    expect(screen.getByText(/T1 · 4 posti/)).toBeInTheDocument()
    expect(screen.getByText(/T2 · 4 posti/)).toBeInTheDocument()
    expect(screen.getAllByText('Togli')).toHaveLength(2)
    // "Aggiungi tavolo" resta: si toglie E si aggiunge dalla stessa card
    expect(screen.getByRole('button', { name: /Aggiungi tavolo/i })).toBeInTheDocument()
  })

  it('un secondo click sulla stessa card la richiude', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1'), makeTable('t2', 'T2')]} layout="plan" />)
    selectSlot()

    openCard('Verdi')
    expect(screen.getAllByText('Togli')).toHaveLength(2)

    openCard('Verdi')
    expect(screen.queryByText('Togli')).not.toBeInTheDocument()
  })
})

describe('FIX-4A — una sola card aperta alla volta', () => {
  beforeEach(() => {
    mockState.tableStatuses = new Map([['t1', 'occupied'], ['t2', 'occupied']])
    mockState.unassigned = []
    mockState.accepted = [
      { id: 'b1', client_name: 'Verdi', num_guests: 2 },
      { id: 'b2', client_name: 'Neri', num_guests: 2 },
    ]
    mockState.assignments = [
      { id: 'a1', table_id: 't1', service_slot_id: 'slot-1', date: TODAY, booking_id: 'b1', checked_out_at: null, turn_number: 1, created_at: '2026-08-02T10:00:00Z' },
      { id: 'a2', table_id: 't2', service_slot_id: 'slot-1', date: TODAY, booking_id: 'b2', checked_out_at: null, turn_number: 1, created_at: '2026-08-02T10:00:00Z' },
    ]
  })

  it('aprire la seconda card chiude automaticamente la prima', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1'), makeTable('t2', 'T2')]} layout="plan" />)
    selectSlot()

    openCard('Verdi')
    expect(screen.getByText(/T1 · 4 posti/)).toBeInTheDocument()

    openCard('Neri')
    expect(screen.queryByText(/T1 · 4 posti/)).not.toBeInTheDocument()
    expect(screen.getByText(/T2 · 4 posti/)).toBeInTheDocument()
    // Un solo pulsante "Togli" visibile per volta
    expect(screen.getAllByText('Togli')).toHaveLength(1)
  })
})

describe('FIX-4A — rimozione tavolo: annullamento, non checkout', () => {
  beforeEach(() => {
    mockState.tableStatuses = new Map([['t1', 'occupied'], ['t2', 'occupied']])
    mockState.unassigned = []
    mockState.accepted = [{ id: 'b1', client_name: 'Verdi', num_guests: 8 }]
    mockState.assignments = [
      { id: 'a1', table_id: 't1', service_slot_id: 'slot-1', date: TODAY, booking_id: 'b1', checked_out_at: null, turn_number: 1, created_at: '2026-08-02T10:00:00Z' },
      { id: 'a2', table_id: 't2', service_slot_id: 'slot-1', date: TODAY, booking_id: 'b1', checked_out_at: null, turn_number: 1, created_at: '2026-08-02T10:00:01Z' },
    ]
  })

  it('con più tavoli residui: "Togli" sul tavolo giusto chiama SOLO useUndoTableAssignment con l\'id di quella riga', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1'), makeTable('t2', 'T2')]} layout="plan" />)
    selectSlot()
    openCard('Verdi')

    const row = screen.getByText(/T1 · 4 posti/).closest('div') as HTMLElement
    fireEvent.click(within(row).getByRole('button', { name: /Togli/i }))

    expect(mockState.undoMutate).toHaveBeenCalledTimes(1)
    expect(mockState.undoMutate).toHaveBeenCalledWith({
      assignmentId: 'a1',
      date: TODAY,
      slotId: 'slot-1',
    })
    // Difetto da non introdurre: NON deve mai passare dal checkout (bruciare un turno / archiviare).
    expect(mockState.checkoutMutate).not.toHaveBeenCalled()
  })

  it('toglie il tavolo giusto anche quando si clicca sul secondo tavolo della tavolata', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1'), makeTable('t2', 'T2')]} layout="plan" />)
    selectSlot()
    openCard('Verdi')

    const row = screen.getByText(/T2 · 4 posti/).closest('div') as HTMLElement
    fireEvent.click(within(row).getByRole('button', { name: /Togli/i }))

    expect(mockState.undoMutate).toHaveBeenCalledWith({
      assignmentId: 'a2',
      date: TODAY,
      slotId: 'slot-1',
    })
  })
})

describe('FIX-4A — rimozione dell\'ultimo tavolo: la prenotazione torna fra le non assegnate', () => {
  it('dopo il refetch (dati aggiornati) la prenotazione lascia "Assegnate" e compare in "Prenotazioni"', () => {
    mockState.tableStatuses = new Map([['t1', 'occupied']])
    mockState.unassigned = []
    mockState.accepted = [{ id: 'b1', client_name: 'Verdi', num_guests: 2 }]
    mockState.assignments = [
      { id: 'a1', table_id: 't1', service_slot_id: 'slot-1', date: TODAY, booking_id: 'b1', checked_out_at: null, turn_number: 1, created_at: '2026-08-02T10:00:00Z' },
    ]

    const { rerender } = render(
      <AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />,
    )
    selectSlot()

    expect(screen.getByText('Assegnate (1)')).toBeInTheDocument()
    expect(screen.getByText('Prenotazioni (0)')).toBeInTheDocument()

    openCard('Verdi')
    const row = screen.getByText(/T1 · 4 posti/).closest('div') as HTMLElement
    fireEvent.click(within(row).getByRole('button', { name: /Togli/i }))

    expect(mockState.undoMutate).toHaveBeenCalledWith({
      assignmentId: 'a1',
      date: TODAY,
      slotId: 'slot-1',
    })

    // useUndoTableAssignment (non toccato in questo giro) rifà il refetch di
    // assignment + non-assegnate: simuliamo qui il dato fresco che arriverebbe
    // dal server — nessun assignment attivo, la prenotazione riappare come
    // non assegnata. Non è un DELETE reale (mutate è mockato), ma dimostra
    // che il rendering del pannello segue correttamente i dati aggiornati.
    mockState.assignments = []
    mockState.unassigned = [{ id: 'b1', client_name: 'Verdi', num_guests: 2 }]

    rerender(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />)

    expect(screen.queryByText(/Assegnate \(/)).not.toBeInTheDocument()
    expect(screen.getByText('Prenotazioni (1)')).toBeInTheDocument()
  })
})

describe('FIX-4A — lampeggio dei tavoli nella piantina', () => {
  beforeEach(() => {
    mockState.tableStatuses = new Map([['t1', 'occupied'], ['t2', 'occupied']])
    mockState.unassigned = []
    mockState.accepted = [{ id: 'b1', client_name: 'Verdi', num_guests: 8 }]
    mockState.assignments = [
      { id: 'a1', table_id: 't1', service_slot_id: 'slot-1', date: TODAY, booking_id: 'b1', checked_out_at: null, turn_number: 1, created_at: '2026-08-02T10:00:00Z' },
      { id: 'a2', table_id: 't2', service_slot_id: 'slot-1', date: TODAY, booking_id: 'b1', checked_out_at: null, turn_number: 1, created_at: '2026-08-02T10:00:01Z' },
    ]
  })

  it('aprendo la card i due tavoli della tavolata prendono la classe di lampeggio nella piantina', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1'), makeTable('t2', 'T2')]} layout="plan" />)
    selectSlot()

    const planT1 = screen.getByRole('button', { name: /^T1 —/ })
    const planT2 = screen.getByRole('button', { name: /^T2 —/ })
    expect(planT1.className).not.toContain('servizio-table-highlight')
    expect(planT2.className).not.toContain('servizio-table-highlight')

    openCard('Verdi')

    expect(planT1.className).toContain('servizio-table-highlight')
    expect(planT2.className).toContain('servizio-table-highlight')
  })

  it('richiudendo la card il lampeggio si spegne', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1'), makeTable('t2', 'T2')]} layout="plan" />)
    selectSlot()

    openCard('Verdi')
    const planT1 = screen.getByRole('button', { name: /^T1 —/ })
    expect(planT1.className).toContain('servizio-table-highlight')

    openCard('Verdi')
    expect(planT1.className).not.toContain('servizio-table-highlight')
  })
})
