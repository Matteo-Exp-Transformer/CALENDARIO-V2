/**
 * FIX B (03-08-26, D-A) — conferma con impatto quantificato prima di eliminare un tavolo
 * occupato, copiando tono/struttura di RoomConfigModal (liveImpactText, `:176-179`).
 * Tavolo libero → nessun cambiamento: stesso conferma «Eliminare? Sì/No» di sempre.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const state = vi.hoisted(() => ({
  tables: [] as { id: string; name: string; capacity: number; room_id: string | null; active: boolean }[],
  rooms: [] as { id: string; name: string }[],
  liveCountByTable: {} as Record<string, number>,
  deleteMutate: vi.fn(),
}))

vi.mock('@/hooks/useFeatures', () => ({
  useFeatures: () => ({ walkIn: false, servizio: true, tableAssignments: true }),
}))

vi.mock('@/features/booking/hooks/useTableMode', () => ({
  useTableMode: () => ({ isTableMode: true, activeTables: state.tables, totalCovers: 0 }),
}))

vi.mock('@/features/booking/hooks/useServizioTables', () => ({
  useTables: () => ({ data: state.tables, isLoading: false, error: null }),
  useDeleteTable: () => ({ mutate: state.deleteMutate, isPending: false }),
  useTableLiveBookings: (tableId: string | null) => ({
    data: tableId ? (state.liveCountByTable[tableId] ?? 0) : 0,
    isLoading: false,
  }),
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
  AssignmentMapPanel: () => <div data-testid="assignment-map-panel" />,
}))

import { ServizioPage } from '../ServizioPage'

describe('ServizioPage — Lista, eliminazione tavolo (FIX B)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    state.rooms = [{ id: 'room-1', name: 'Sala principale' }]
    state.liveCountByTable = {}
  })

  it('tavolo LIBERO → invariato: «Eliminare?» Sì/No, nessun avviso in più, nessun click in più', async () => {
    state.tables = [{ id: 't-libero', name: 'T1', capacity: 4, room_id: 'room-1', active: true }]
    const user = userEvent.setup()
    render(<ServizioPage />)

    await user.click(screen.getByRole('button', { name: /elimina t1/i }))

    expect(screen.getByText('Eliminare?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^sì$/i })).toBeInTheDocument()
    expect(screen.queryByText(/prenotazion/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^sì$/i }))
    expect(state.deleteMutate).toHaveBeenCalledWith('t-libero')
  })

  it('tavolo OCCUPATO → avviso con numero di prenotazioni coinvolte + conferma esplicita "Sì, elimina"', async () => {
    state.tables = [{ id: 't-occupato', name: 'T2', capacity: 4, room_id: 'room-1', active: true }]
    state.liveCountByTable = { 't-occupato': 1 }
    const user = userEvent.setup()
    render(<ServizioPage />)

    await user.click(screen.getByRole('button', { name: /elimina t2/i }))

    await waitFor(() =>
      expect(screen.getByText(/questo tavolo ha 1 prenotazione assegnata/i)).toBeInTheDocument(),
    )
    expect(screen.getByRole('button', { name: /sì, elimina/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /sì, elimina/i }))
    expect(state.deleteMutate).toHaveBeenCalledWith('t-occupato')
  })

  it('tavolo con più di una prenotazione → testo al plurale', async () => {
    state.tables = [{ id: 't-multi', name: 'T3', capacity: 8, room_id: 'room-1', active: true }]
    state.liveCountByTable = { 't-multi': 3 }
    const user = userEvent.setup()
    render(<ServizioPage />)

    await user.click(screen.getByRole('button', { name: /elimina t3/i }))

    await waitFor(() =>
      expect(screen.getByText(/questo tavolo ha 3 prenotazioni assegnate/i)).toBeInTheDocument(),
    )
  })

  it('tavolata su più tavoli: l\'avviso di impatto riguarda SOLO il tavolo su cui si preme elimina', async () => {
    state.tables = [
      { id: 't-a', name: 'TA', capacity: 4, room_id: 'room-1', active: true },
      { id: 't-b', name: 'TB', capacity: 4, room_id: 'room-1', active: true },
    ]
    // Stessa prenotazione su due tavoli (tavolata): solo TA ha un assignment attivo
    // "contato" nel test — TB resta a 0, quindi il suo pulsante elimina resta invariato.
    state.liveCountByTable = { 't-a': 1, 't-b': 0 }
    const user = userEvent.setup()
    render(<ServizioPage />)

    await user.click(screen.getByRole('button', { name: /elimina ta/i }))
    await waitFor(() =>
      expect(screen.getByText(/questo tavolo ha 1 prenotazione assegnata/i)).toBeInTheDocument(),
    )

    // Il tavolo TB non è stato toccato: resta nel suo stato normale (pulsante elimina presente,
    // nessun avviso mostrato per lui).
    expect(screen.getByRole('button', { name: /elimina tb/i })).toBeInTheDocument()
  })
})
