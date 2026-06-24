/**
 * Test WP-B3 S4: TableShape colori per status (D24)
 *
 * Copre:
 * - Senza prop status → colori verdi default (no regressioni)
 * - Con status='late' → fill rosso
 * - Con ogni stato → il fill SVG corrisponde alla mappa STATUS_COLORS
 */

import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
  CSS: { Translate: { toString: () => '' } },
}))

import { TableShape } from '../servizio/TableShape'
import type { RestaurantTable } from '../../hooks/useServizioTables'
import type { TableLiveStatus } from '../../hooks/useTableStatuses'

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

// Colori attesi dalla mappa STATUS_COLORS (spec: fill identico al green quando free)
const EXPECTED_FILL: Record<TableLiveStatus | 'none', string> = {
  none:     '#4ade80', // default = free
  free:     '#4ade80',
  upcoming: '#67e8f9',
  occupied: '#fcd34d',
  late:     '#fca5a5',
  leaving:  '#e9d5ff',
}

function getFillFromSvg(container: HTMLElement): string | null {
  const shape = container.querySelector('rect, circle')
  return shape?.getAttribute('fill') ?? null
}

describe('TableShape — colori per status (D24)', () => {
  it('senza prop status → fill verde #4ade80 (no regressioni)', () => {
    const { container } = render(<TableShape table={TABLE} onEdit={vi.fn()} />)
    expect(getFillFromSvg(container)).toBe(EXPECTED_FILL.none)
  })

  it("status='free' esplicito → fill verde #4ade80 (identico al default)", () => {
    const { container } = render(<TableShape table={TABLE} onEdit={vi.fn()} status="free" />)
    expect(getFillFromSvg(container)).toBe(EXPECTED_FILL.free)
  })

  it("status='upcoming' → fill ciano", () => {
    const { container } = render(<TableShape table={TABLE} onEdit={vi.fn()} status="upcoming" />)
    expect(getFillFromSvg(container)).toBe(EXPECTED_FILL.upcoming)
  })

  it("status='occupied' → fill ambra", () => {
    const { container } = render(<TableShape table={TABLE} onEdit={vi.fn()} status="occupied" />)
    expect(getFillFromSvg(container)).toBe(EXPECTED_FILL.occupied)
  })

  it("status='late' → fill rosso (colore ritardo)", () => {
    const { container } = render(<TableShape table={TABLE} onEdit={vi.fn()} status="late" />)
    expect(getFillFromSvg(container)).toBe(EXPECTED_FILL.late)
  })

  it("status='leaving' → fill viola", () => {
    const { container } = render(<TableShape table={TABLE} onEdit={vi.fn()} status="leaving" />)
    expect(getFillFromSvg(container)).toBe(EXPECTED_FILL.leaving)
  })
})
