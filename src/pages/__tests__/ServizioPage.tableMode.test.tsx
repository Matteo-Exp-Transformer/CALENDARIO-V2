// Test WP-B1 S4: guard AssignmentMapPanel in ServizioPage (D49).
// Copre:
//   - Pro senza tavoli → stato-vuoto invitante al posto di AssignmentMapPanel
//   - Pro con tavoli → AssignmentMapPanel renderizzato

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// ─── Stato condiviso ───────────────────────────────────────────────────────
const state = vi.hoisted(() => ({
  isTableMode: false,
  tableAssignments: true, // Pro di default
  tables: [] as { id: string; name: string; capacity: number; room_id: string | null; active: boolean }[],
  rooms: [] as { id: string; name: string }[],
}))

vi.mock('@/hooks/useFeatures', () => ({
  useFeatures: () => ({
    walkIn: false,
    servizio: true,
    tableAssignments: state.tableAssignments,
  }),
}))

vi.mock('@/features/booking/hooks/useTableMode', () => ({
  useTableMode: () => ({
    isTableMode: state.isTableMode,
    activeTables: state.tables,
    totalCovers: state.tables.reduce((s: number, t: { capacity: number }) => s + t.capacity, 0),
  }),
}))

vi.mock('@/features/booking/hooks/useServizioTables', () => ({
  useTables: () => ({ data: state.tables, isLoading: false, error: null }),
  useDeleteTable: () => ({ mutate: vi.fn(), isPending: false }),
  useTableLiveBookings: () => ({ data: 0, isLoading: false }),
}))

vi.mock('@/features/booking/hooks/useRooms', () => ({
  useRooms: () => ({ data: state.rooms, isLoading: false }),
}))

vi.mock('@/features/booking/components/servizio/TableFormModal', () => ({
  TableFormModal: () => null,
}))

vi.mock('@/features/booking/components/servizio/RoomConfigModal', () => ({
  RoomConfigModal: () => null,
}))

vi.mock('@/features/booking/components/servizio/RoomTabs', () => ({
  RoomTabs: () => <div data-testid="room-tabs" />,
}))

vi.mock('@/features/booking/components/servizio/TableMap', () => ({
  TableMap: () => <div data-testid="table-map" />,
}))

vi.mock('@/features/booking/components/servizio/ServiceSlotsManager', () => ({
  ServiceSlotsManager: () => <div data-testid="service-slots-manager" />,
}))

vi.mock('@/features/booking/components/servizio/AssignmentMapPanel', () => ({
  AssignmentMapPanel: () => <div data-testid="assignment-map-panel">Mappa assegnazioni</div>,
}))

import { ServizioPage } from '../ServizioPage'

async function switchToMapTab() {
  const user = userEvent.setup()
  const mapBtn = screen.getByRole('button', { name: /mappa/i })
  await user.click(mapBtn)
}

describe('ServizioPage — guard AssignmentMapPanel (WP-B1 D49)', () => {
  beforeEach(() => {
    state.isTableMode = false
    state.tableAssignments = true
    state.tables = []
    state.rooms = [{ id: 'room-1', name: 'Sala principale' }]
  })

  it('Pro senza tavoli → stato-vuoto invitante, NON AssignmentMapPanel', async () => {
    state.isTableMode = false
    render(<ServizioPage />)
    await switchToMapTab()

    // Stato-vuoto invitante deve essere visibile
    expect(screen.getByText(/attiva la mappa delle assegnazioni/i)).toBeInTheDocument()
    expect(screen.getByText(/crea la prima sala e i primi tavoli/i)).toBeInTheDocument()

    // AssignmentMapPanel non deve renderizzare
    expect(screen.queryByTestId('assignment-map-panel')).not.toBeInTheDocument()
  })

  it('Pro con tavoli → AssignmentMapPanel renderizzato', async () => {
    state.isTableMode = true
    state.tables = [{ id: 't1', name: 'Tavolo 1', capacity: 4, room_id: 'room-1', active: true }]
    render(<ServizioPage />)
    await switchToMapTab()

    expect(screen.getByTestId('assignment-map-panel')).toBeInTheDocument()
    // Lo stato-vuoto non deve comparire
    expect(screen.queryByText(/attiva la mappa delle assegnazioni/i)).not.toBeInTheDocument()
  })

  it('tab Lista (default) → nessun pannello mappa né stato-vuoto visibile', () => {
    // La tab Lista è quella attiva di default, il blocco mappa non è montato
    render(<ServizioPage />)
    expect(screen.queryByTestId('assignment-map-panel')).not.toBeInTheDocument()
    expect(screen.queryByText(/attiva la mappa delle assegnazioni/i)).not.toBeInTheDocument()
  })
})
