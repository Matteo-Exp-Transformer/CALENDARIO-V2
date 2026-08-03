/**
 * FIX-2 UI — tavolo verde con turni finiti mostrato PRIMA; forzatura raggiungibile
 * senza chiudere a mano la modale «Assegna tavolo» (S4-BUG-2 / S4-UX-8).
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
  maxTurns: 2 as number | null,
  assignMutate: vi.fn(),
  assignManyMutate: vi.fn(),
}))

vi.mock('../../hooks/useTableStatuses', () => ({
  useTableStatuses: () => mockState.tableStatuses,
  DEFAULT_LATE_THRESHOLD_MINUTES: 15,
  useReleaseNoticeRecallMinutes: () => 30,
}))

vi.mock('../../hooks/useTableAssignments', () => ({
  useTableAssignments: () => ({ data: mockState.assignments }),
  useUnassignedBookings: () => ({ data: mockState.unassigned }),
  useAcceptedBookingsForDate: () => ({ data: mockState.unassigned }),
  useAssignBookingToTable: () => ({ mutate: mockState.assignMutate, isPending: false }),
  useAssignBookingToTables: () => ({ mutate: mockState.assignManyMutate, isPending: false }),
  useForceReplaceBookingOnTable: () => ({ mutate: vi.fn(), isPending: false }),
  useUndoTableAssignment: () => ({ mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false }),
  useCheckoutTable: () => ({ mutate: vi.fn(), isPending: false }),
  useMarkReleaseNoticeHandled: () => ({ mutate: vi.fn(), isPending: false }),
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

describe('FIX-2 UI — turni esauriti e forzatura', () => {
  beforeEach(() => {
    mockState.tableStatuses = new Map([['t1', 'free']])
    mockState.maxTurns = 2
    mockState.assignments = [
      // Due turni già chiusi → tavolo verde ma 0 residui
      {
        id: 'a1',
        table_id: 't1',
        service_slot_id: 'slot-1',
        date: TODAY,
        booking_id: 'old-1',
        checked_out_at: '2026-08-02T12:00:00Z',
        turn_number: 1,
      },
      {
        id: 'a2',
        table_id: 't1',
        service_slot_id: 'slot-1',
        date: TODAY,
        booking_id: 'old-2',
        checked_out_at: '2026-08-02T13:00:00Z',
        turn_number: 2,
      },
    ]
    mockState.unassigned = [
      {
        id: 'b-new',
        client_name: 'Verdi',
        num_guests: 2,
        confirmed_start: `${TODAY}T12:30:00+00:00`,
      },
    ]
    mockState.assignMutate.mockReset()
    mockState.assignManyMutate.mockReset()
  })

  it('mostra «Turni esauriti» nella modale PRIMA di tentare l\'assegnazione', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} />)

    // Seleziona fascia (prima option vuota)
    const slotSelect = screen.getByRole('combobox')
    fireEvent.change(slotSelect, { target: { value: 'slot-1' } })

    fireEvent.click(screen.getByRole('button', { name: /Assegna/i }))

    const dialog = screen.getByRole('dialog', { name: /Assegna tavolo/i })
    expect(within(dialog).getByText('Turni esauriti')).toBeInTheDocument()
    expect(within(dialog).getByText(/0 turni residui/i)).toBeInTheDocument()
    // Nessuna mutation ancora: lo staff lo vede prima del fallimento
    expect(mockState.assignManyMutate).not.toHaveBeenCalled()
    expect(mockState.assignMutate).not.toHaveBeenCalled()
  })

  it('click su tavolo «Turni esauriti» apre la conferma forzatura chiudendo la modale', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'slot-1' } })
    fireEvent.click(screen.getByRole('button', { name: /Assegna/i }))

    expect(screen.getByRole('dialog', { name: /Assegna tavolo/i })).toBeInTheDocument()

    // Click deliberato sul tavolo con turni finiti (solo nella modale Assegna)
    const assignDialog = screen.getByRole('dialog', { name: /Assegna tavolo/i })
    fireEvent.click(within(assignDialog).getByText('T1'))

    // Modale chiusa, riquadro ambra raggiungibile
    expect(screen.queryByRole('dialog', { name: /Assegna tavolo/i })).not.toBeInTheDocument()
    expect(screen.getByText(/Turni esauriti per questo tavolo/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Assegna comunque/i })).toBeInTheDocument()
  })
})

describe('Vista Servizio — prenotazioni in testata, non in colonna', () => {
  beforeEach(() => {
    mockState.tableStatuses = new Map([['t1', 'free']])
    mockState.maxTurns = null
    mockState.assignments = []
    mockState.unassigned = [
      { id: 'b-1', client_name: 'Verdi', num_guests: 2, confirmed_start: `${TODAY}T12:30:00+00:00` },
    ]
  })

  it('layout "plan": l\'elenco è una striscia orizzontale sopra la mappa', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'slot-1' } })

    const strip = screen.getByText('Verdi').closest('.overflow-x-auto')
    expect(strip).not.toBeNull()

    // Il contenitore non affianca più elenco e mappa: la piantina prende tutta la larghezza
    const shell = strip?.closest('div.flex.flex-col')
    expect(shell?.className).not.toContain('md:flex-row')
  })

  it('layout "grid": resta la colonna laterale di prima', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="grid" />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'slot-1' } })

    expect(screen.getByText('Verdi').closest('.overflow-x-auto')).toBeNull()
    expect(document.querySelector('.md\\:w-1\\/3')).not.toBeNull()
  })
})
