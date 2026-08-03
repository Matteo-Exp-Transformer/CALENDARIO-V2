/**
 * Test S4 post-QA — le due viste della mappa (richiesta Matteo 02-08-26).
 *
 * Vista "Servizio" (default): la sala confermata, senza griglia, con stati live e
 * occupanti — è quella che serve a servizio aperto, quindi apre per prima.
 * Vista "Modifica": l'editor di sempre, griglia di allineamento e CRUD tavoli.
 * Le due viste non convivono: una alla volta, altrimenti si vedono due mappe.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const state = vi.hoisted(() => ({
  isTableMode: true,
  tables: [] as { id: string; name: string; capacity: number; room_id: string | null; active: boolean }[],
  rooms: [] as { id: string; name: string }[],
}))

vi.mock('@/hooks/useFeatures', () => ({
  useFeatures: () => ({ walkIn: false, servizio: true, tableAssignments: true }),
}))

vi.mock('@/features/booking/hooks/useTableMode', () => ({
  useTableMode: () => ({
    isTableMode: state.isTableMode,
    activeTables: state.tables,
    totalCovers: 0,
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

vi.mock('@/features/booking/components/servizio/WalkInLimitCard', () => ({
  WalkInLimitCard: () => <div data-testid="walk-in-limit-card" />,
}))

vi.mock('@/features/booking/components/servizio/AssignmentMapPanel', () => ({
  AssignmentMapPanel: ({ layout }: { layout?: string }) => (
    <div data-testid="assignment-map-panel" data-layout={layout} />
  ),
}))

import { ServizioPage } from '../ServizioPage'

async function openMapTab() {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: /^mappa$/i }))
  return user
}

describe('ServizioPage — due viste della mappa', () => {
  beforeEach(() => {
    state.isTableMode = true
    state.rooms = [{ id: 'room-1', name: 'Sala principale' }]
    state.tables = [{ id: 't1', name: 'T1', capacity: 4, room_id: 'room-1', active: true }]
  })

  it('apre sulla vista Servizio: piantina della sala, niente editor', async () => {
    render(<ServizioPage />)
    await openMapTab()

    const panel = screen.getByTestId('assignment-map-panel')
    expect(panel).toBeInTheDocument()
    // layout "plan" = sala confermata senza griglia
    expect(panel).toHaveAttribute('data-layout', 'plan')
    expect(screen.queryByTestId('table-map')).not.toBeInTheDocument()
  })

  it('passando a Modifica compare l\'editor e sparisce la piantina', async () => {
    render(<ServizioPage />)
    const user = await openMapTab()

    await user.click(screen.getByRole('button', { name: /^modifica$/i }))

    expect(screen.getByTestId('table-map')).toBeInTheDocument()
    expect(screen.queryByTestId('assignment-map-panel')).not.toBeInTheDocument()
  })

  it('si torna alla vista Servizio dal pulsante Servizio', async () => {
    render(<ServizioPage />)
    const user = await openMapTab()

    await user.click(screen.getByRole('button', { name: /^modifica$/i }))
    await user.click(screen.getByRole('button', { name: /^servizio$/i }))

    expect(screen.getByTestId('assignment-map-panel')).toBeInTheDocument()
    expect(screen.queryByTestId('table-map')).not.toBeInTheDocument()
  })

  it('Pro senza tavoli: la vista Servizio mostra lo stato-vuoto, non la piantina', async () => {
    state.isTableMode = false
    state.tables = []
    render(<ServizioPage />)
    await openMapTab()

    expect(screen.getByText(/attiva la mappa delle assegnazioni/i)).toBeInTheDocument()
    expect(screen.queryByTestId('assignment-map-panel')).not.toBeInTheDocument()
  })
})
