/**
 * S4-FIX-5 UI — riquadro «tavolo occupato»: tre scelte per chi è già seduto
 * (sposta / archivia / rimetti in attesa), non più un'unica «Libera e assegna».
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
  }>,
  unassigned: [] as Array<{
    id: string
    client_name: string
    num_guests: number
    confirmed_start?: string
  }>,
  acceptedOnDate: [] as Array<{
    id: string
    client_name: string
    num_guests: number
    confirmed_start?: string
  }>,
  maxTurns: null as number | null,
  forceReplaceMutate: vi.fn(),
}))

vi.mock('../../hooks/useTableStatuses', () => ({
  useTableStatuses: () => mockState.tableStatuses,
  DEFAULT_LATE_THRESHOLD_MINUTES: 15,
}))

vi.mock('../../hooks/useTableAssignments', () => ({
  useTableAssignments: () => ({ data: mockState.assignments }),
  useUnassignedBookings: () => ({ data: mockState.unassigned }),
  useAcceptedBookingsForDate: () => ({ data: mockState.acceptedOnDate }),
  useAssignBookingToTable: () => ({ mutate: vi.fn(), isPending: false }),
  useAssignBookingToTables: () => ({ mutate: vi.fn(), isPending: false }),
  useForceReplaceBookingOnTable: () => ({ mutate: mockState.forceReplaceMutate, isPending: false }),
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
      {
        id: 'slot-1',
        name: 'Pranzo',
        start_time: '11:31:00',
        end_time: '15:30:00',
        max_turns: mockState.maxTurns,
      },
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

/** Apre il riquadro «tavolo occupato»: click su Assegna → click sul tavolo conteso nella modale. */
function openReplaceConfirm(contestedTableName: string) {
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'slot-1' } })
  fireEvent.click(screen.getByRole('button', { name: /Assegna/i }))
  const dialog = screen.getByRole('dialog', { name: /Assegna tavolo/i })
  fireEvent.click(within(dialog).getByText(contestedTableName))
}

describe('S4-FIX-5 — riquadro tavolo occupato, tre scelte', () => {
  beforeEach(() => {
    mockState.assignments = [
      {
        id: 'a-old',
        table_id: 't1',
        service_slot_id: 'slot-1',
        date: TODAY,
        booking_id: 'b-old',
        checked_out_at: null,
        turn_number: 1,
      },
    ]
    mockState.acceptedOnDate = [
      { id: 'b-old', client_name: 'Bianchi', num_guests: 4, confirmed_start: `${TODAY}T12:00:00+00:00` },
    ]
    mockState.unassigned = [
      { id: 'b-new', client_name: 'Rossi', num_guests: 2, confirmed_start: `${TODAY}T12:30:00+00:00` },
    ]
    mockState.maxTurns = null
    mockState.forceReplaceMutate.mockReset()
  })

  it('mostra chi è seduto e chi si sta assegnando, con «Conferma» spento finché non si sceglie', () => {
    mockState.tableStatuses = new Map([
      ['t1', 'occupied'],
      ['t2', 'free'],
    ])
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1'), makeTable('t2', 'T2')]} />)

    openReplaceConfirm('T1')

    expect(screen.getByText(/T1 è occupato da Bianchi/i)).toHaveTextContent('4 coperti')
    expect(screen.getByText(/Stai assegnando: Rossi/i)).toHaveTextContent('2 coperti')

    expect(screen.getByRole('radio', { name: /Sposta Bianchi su un altro tavolo/i })).toBeInTheDocument()
    expect(
      screen.getByRole('radio', { name: /Bianchi ha finito: libera il tavolo e archivia/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('radio', { name: /Bianchi torna tra le prenotazioni da assegnare/i }),
    ).toBeInTheDocument()

    // Nessuna scelta preselezionata: Conferma spento.
    expect(screen.getByRole('button', { name: 'Conferma' })).toBeDisabled()
  })

  it('scelta 1 (sposta): resta spento finché non si sceglie anche il tavolo di destinazione', () => {
    mockState.tableStatuses = new Map([
      ['t1', 'occupied'],
      ['t2', 'free'],
    ])
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1'), makeTable('t2', 'T2')]} />)

    openReplaceConfirm('T1')

    fireEvent.click(screen.getByRole('radio', { name: /Sposta Bianchi su un altro tavolo/i }))
    // L'etichetta segue subito la scelta, ma resta spento finché manca il tavolo.
    const confirmButton = screen.getByRole('button', { name: 'Sposta e assegna' })
    expect(confirmButton).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: /^T2/ }))
    expect(confirmButton).not.toBeDisabled()

    fireEvent.click(confirmButton)
    expect(mockState.forceReplaceMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        bookingId: 'b-new',
        tableId: 't1',
        outcome: 'move',
        targetTableId: 't2',
      }),
      expect.anything(),
    )
  })

  it('scelta 2 (archivia) e scelta 3 (in attesa): abilitano subito «Conferma» con l\'etichetta giusta', () => {
    mockState.tableStatuses = new Map([
      ['t1', 'occupied'],
      ['t2', 'free'],
    ])
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1'), makeTable('t2', 'T2')]} />)

    openReplaceConfirm('T1')

    fireEvent.click(
      screen.getByRole('radio', { name: /Bianchi ha finito: libera il tavolo e archivia/i }),
    )
    expect(screen.getByRole('button', { name: 'Archivia e assegna' })).not.toBeDisabled()

    fireEvent.click(
      screen.getByRole('radio', { name: /Bianchi torna tra le prenotazioni da assegnare/i }),
    )
    const requeueButton = screen.getByRole('button', { name: 'Rimetti in attesa e assegna' })
    expect(requeueButton).not.toBeDisabled()

    fireEvent.click(requeueButton)
    expect(mockState.forceReplaceMutate).toHaveBeenCalledWith(
      expect.objectContaining({ outcome: 'requeue', tableId: 't1', bookingId: 'b-new' }),
      expect.anything(),
    )
  })

  it('senza tavoli liberi: la scelta «Sposta» è spenta con la spiegazione', () => {
    mockState.tableStatuses = new Map([['t1', 'occupied']])
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} />)

    openReplaceConfirm('T1')

    const moveRadio = screen.getByRole('radio', { name: /Sposta Bianchi su un altro tavolo/i })
    expect(moveRadio).toBeDisabled()
    expect(
      screen.getByText(/Nessun tavolo libero in questa fascia: puoi archiviare o rimettere in attesa\./i),
    ).toBeInTheDocument()
  })
})
