/**
 * Test WP-B3 S4: AssignmentMapPanel mostra le 5 label corrette (D24)
 *
 * Usa DroppableTable come proxy per i label — isolato tramite mock di
 * useTableStatuses, useTableAssignments, useServiceSlots, ecc.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { TableLiveStatus } from '../../hooks/useTableStatuses'

// ─── Costanti label attese ─────────────────────────────────────────────────

const EXPECTED_LABELS: Record<TableLiveStatus, string> = {
  free:     'Libero',
  upcoming: 'In arrivo',
  occupied: 'Occupato',
  late:     'In ritardo',
  leaving:  'In uscita',
}

// ─── Mock STATUS_LABEL esportata dal componente ────────────────────────────
// Testiamo la costante direttamente importandola dal modulo (dopo il refactor)
// per verificare che tutte e 5 le label siano presenti e corrette.

// Il modulo AssignmentMapPanel non esporta STATUS_LABEL, quindi lo testiamo
// attraverso un rendering del componente con stati mockati.

const mockState = vi.hoisted(() => ({
  tableStatuses: new Map<string, TableLiveStatus>([['table-1', 'free']]),
  assignments: [] as Array<{
    id: string
    table_id: string
    service_slot_id: string
    date: string
    booking_id: string
    checked_out_at: string | null
    turn_number: number
  }>,
  acceptedBookings: [] as Array<{
    id: string
    client_name: string
    num_guests: number
    desired_time: string
    confirmed_start: string
  }>,
}))

vi.mock('../../hooks/useTableStatuses', () => ({
  useTableStatuses: () => mockState.tableStatuses,
  DEFAULT_LATE_THRESHOLD_MINUTES: 15,
}))

vi.mock('../../hooks/useTableAssignments', () => ({
  useTableAssignments: () => ({ data: mockState.assignments }),
  useUnassignedBookings: () => ({ data: [] }),
  useAcceptedBookingsForDate: () => ({ data: mockState.acceptedBookings }),
  useAssignBookingToTable: () => ({ mutate: vi.fn() }),
  useCheckoutTable: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('../../hooks/useServiceSlots', () => ({
  useServiceSlots: () => ({
    data: [{ id: 'slot-1', name: 'Cena', start_time: '20:00:00', end_time: '22:00:00', max_turns: 2 }],
  }),
}))

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: () => ({ tenantId: 'tenant-1' }),
}))

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
  }),
  CSS: { Translate: { toString: () => '' } },
}))

vi.mock('@/components/ui', () => ({
  Button: ({ children, onClick, disabled, type, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }) => (
    <button type={type ?? 'button'} onClick={onClick} disabled={disabled} {...rest}>{children}</button>
  ),
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
const TABLE: RestaurantTable = {
  id: 'table-1',
  tenant_id: 't1',
  name: 'T1',
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

function renderPanel() {
  return render(<AssignmentMapPanel rooms={[ROOM]} tables={[TABLE]} />)
}

// Seleziona la fascia per far apparire la mappa
async function selectSlot(container: HTMLElement) {
  const select = container.querySelector('select') as HTMLSelectElement
  if (!select) return
  // Simula selezione fascia slot-1
  const { fireEvent } = await import('@testing-library/react')
  fireEvent.change(select, { target: { value: 'slot-1' } })
}

describe('AssignmentMapPanel — 5 label stati live', () => {
  const statuses: TableLiveStatus[] = ['free', 'upcoming', 'occupied', 'late', 'leaving']

  for (const status of statuses) {
    it(`mostra label "${EXPECTED_LABELS[status]}" per stato "${status}"`, async () => {
      mockState.tableStatuses = new Map([['table-1', status]])
      mockState.assignments = []
      mockState.acceptedBookings = []
      const { container } = renderPanel()
      await selectSlot(container)
      expect(screen.getByText(EXPECTED_LABELS[status])).toBeDefined()
    })
  }

  it('renderizza due assegnazioni attive sullo stesso tavolo', async () => {
    mockState.tableStatuses = new Map([['table-1', 'occupied']])
    mockState.assignments = [
      {
        id: 'a1',
        table_id: 'table-1',
        service_slot_id: 'slot-1',
        date: new Date().toISOString().slice(0, 10),
        booking_id: 'booking-1',
        checked_out_at: null,
        turn_number: 1,
      },
      {
        id: 'a2',
        table_id: 'table-1',
        service_slot_id: 'slot-1',
        date: new Date().toISOString().slice(0, 10),
        booking_id: 'booking-2',
        checked_out_at: null,
        turn_number: 2,
      },
    ]
    mockState.acceptedBookings = [
      {
        id: 'booking-1',
        client_name: 'Mario Rossi',
        num_guests: 2,
        desired_time: '20:00',
        confirmed_start: '2026-06-24T20:00:00+00:00',
      },
      {
        id: 'booking-2',
        client_name: 'Luigi Bianchi',
        num_guests: 4,
        desired_time: '21:30',
        confirmed_start: '2026-06-24T21:30:00+00:00',
      },
    ]

    const { container } = renderPanel()
    await selectSlot(container)

    expect(screen.getByText(/Mario Rossi, 2/)).toBeInTheDocument()
    expect(screen.getByText(/Luigi Bianchi, 4/)).toBeInTheDocument()
  })
})
