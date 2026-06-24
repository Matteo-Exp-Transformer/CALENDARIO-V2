// Test WP-B1 S4: predicato "modalità-tavoli" (D49)
// Copre: isTableMode, totalCovers, cortocircuito Classic.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { RestaurantTable } from '../useServizioTables'

// ─── Stato condiviso tra vi.hoisted e i test ───────────────────────────────
const state = vi.hoisted(() => ({
  tableAssignments: false,
  tables: [] as RestaurantTable[],
}))

vi.mock('@/hooks/useFeatures', () => ({
  useFeatures: () => ({ tableAssignments: state.tableAssignments }),
}))

vi.mock('../useServizioTables', () => ({
  useTables: () => ({ data: state.tables }),
}))

// import DOPO i mock
import { useTableMode } from '../useTableMode'

// ─── Helper ────────────────────────────────────────────────────────────────
function makeTable(id: string, capacity: number): RestaurantTable {
  return {
    id,
    tenant_id: 'tenant-1',
    name: `Tavolo ${id}`,
    capacity,
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

describe('useTableMode — predicato D49', () => {
  beforeEach(() => {
    state.tableAssignments = false
    state.tables = []
  })

  // ─── Classic: cortocircuito ──────────────────────────────────────────────
  it('Classic (tableAssignments=false, 0 tavoli) → isTableMode false', () => {
    const { result } = renderHook(() => useTableMode())
    expect(result.current.isTableMode).toBe(false)
    expect(result.current.totalCovers).toBe(0)
    expect(result.current.activeTables).toEqual([])
  })

  it('Classic (tableAssignments=false) con tavoli attivi → isTableMode false (cortocircuito)', () => {
    // Tavoli presenti ma siamo Classic: il predicato deve essere false a prescindere
    state.tables = [makeTable('t1', 4), makeTable('t2', 6)]
    const { result } = renderHook(() => useTableMode())
    expect(result.current.isTableMode).toBe(false)
    expect(result.current.totalCovers).toBe(0)
    expect(result.current.activeTables).toEqual([])
  })

  // ─── Pro senza tavoli ───────────────────────────────────────────────────
  it('Pro (tableAssignments=true) senza tavoli → isTableMode false', () => {
    state.tableAssignments = true
    state.tables = []
    const { result } = renderHook(() => useTableMode())
    expect(result.current.isTableMode).toBe(false)
    expect(result.current.totalCovers).toBe(0)
  })

  // ─── Pro con tavoli ─────────────────────────────────────────────────────
  it('Pro con 1 tavolo attivo → isTableMode true, totalCovers = capacity tavolo', () => {
    state.tableAssignments = true
    state.tables = [makeTable('t1', 8)]
    const { result } = renderHook(() => useTableMode())
    expect(result.current.isTableMode).toBe(true)
    expect(result.current.totalCovers).toBe(8)
    expect(result.current.activeTables).toHaveLength(1)
  })

  it('Pro con più tavoli → totalCovers = somma coperti', () => {
    state.tableAssignments = true
    state.tables = [makeTable('t1', 4), makeTable('t2', 6), makeTable('t3', 2)]
    const { result } = renderHook(() => useTableMode())
    expect(result.current.isTableMode).toBe(true)
    expect(result.current.totalCovers).toBe(12) // 4+6+2
  })

  // ─── Tabella dei 4 casi D49 (predicato isolato) ─────────────────────────
  it('0 tavoli + Classic → false', () => {
    state.tableAssignments = false; state.tables = []
    const { result } = renderHook(() => useTableMode())
    expect(result.current.isTableMode).toBe(false)
  })

  it('0 tavoli + Pro → false', () => {
    state.tableAssignments = true; state.tables = []
    const { result } = renderHook(() => useTableMode())
    expect(result.current.isTableMode).toBe(false)
  })

  it('≥1 tavolo + Classic → false (cortocircuito)', () => {
    state.tableAssignments = false
    state.tables = [makeTable('t1', 4)]
    const { result } = renderHook(() => useTableMode())
    expect(result.current.isTableMode).toBe(false)
  })

  it('≥1 tavolo + Pro → true', () => {
    state.tableAssignments = true
    state.tables = [makeTable('t1', 4)]
    const { result } = renderHook(() => useTableMode())
    expect(result.current.isTableMode).toBe(true)
  })
})
