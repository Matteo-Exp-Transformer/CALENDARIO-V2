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
}))

vi.mock('../../hooks/useTableStatuses', () => ({
  useTableStatuses: () => mockState.tableStatuses,
  DEFAULT_LATE_THRESHOLD_MINUTES: 15,
}))

vi.mock('../../hooks/useTableAssignments', () => ({
  useTableAssignments: () => ({ data: [] }),
  useUnassignedBookings: () => ({ data: [] }),
  useAcceptedBookingsForDate: () => ({ data: [] }),
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
      const { container } = renderPanel()
      await selectSlot(container)
      expect(screen.getByText(EXPECTED_LABELS[status])).toBeDefined()
    })
  }
})
