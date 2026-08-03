// @admin-blindatura: servizio-a1
// Copre: polish isolato mappa/sale/tavoli deciso nel piano S4 A1.

import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UnsavedChangesProvider } from '@/contexts/UnsavedChangesContext'
import type { RestaurantTable } from '@/features/booking/hooks/useServizioTables'
import type { Room } from '@/features/booking/hooks/useRooms'

const mocks = vi.hoisted(() => ({
  createTable: vi.fn(),
  updateTable: vi.fn(),
  createRoom: vi.fn(),
  updateRoom: vi.fn(),
  deleteRoom: vi.fn(),
}))

vi.mock('@/features/booking/hooks/useServizioTables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/booking/hooks/useServizioTables')>()
  return {
    ...actual,
    useCreateTable: () => ({ mutate: mocks.createTable, isPending: false }),
    useUpdateTable: () => ({ mutate: mocks.updateTable, isPending: false }),
    useUpdateTablePosition: () => ({ debouncedUpdate: vi.fn(), isPending: false }),
  }
})

vi.mock('@/features/booking/hooks/useRooms', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/booking/hooks/useRooms')>()
  return {
    ...actual,
    useCreateRoom: () => ({ mutate: mocks.createRoom, isPending: false }),
    useUpdateRoom: () => ({ mutate: mocks.updateRoom, isPending: false }),
    useDeleteRoom: () => ({ mutate: mocks.deleteRoom, isPending: false }),
    useRoomLiveBookings: () => ({ data: 2, isLoading: false }),
  }
})

import { RoomTabs } from '../servizio/RoomTabs'
import { RoomConfigModal } from '../servizio/RoomConfigModal'
import { TableFormModal, hasDuplicateTableName } from '../servizio/TableFormModal'
import { TableMap } from '../servizio/TableMap'
import { TableShape, TABLE_NAME_MAX_LENGTH } from '../servizio/TableShape'

const ROOM_A: Room = {
  id: 'room-a', tenant_id: 'tenant-1', name: 'Sala A', width: 800, height: 600,
  display_order: 0, active: true, created_at: '', updated_at: '',
}
const ROOM_B: Room = { ...ROOM_A, id: 'room-b', name: 'Sala B', display_order: 1 }

function table(partial: Partial<RestaurantTable>): RestaurantTable {
  return {
    id: 'table-1', tenant_id: 'tenant-1', name: 'Tavolo 1', capacity: 2,
    placement: 'Sala A', active: true, room_id: 'room-a', position_x: 10,
    position_y: 10, shape: 'square', created_at: '', updated_at: '', ...partial,
  }
}

function renderWithGuard(node: React.ReactNode) {
  return render(<UnsavedChangesProvider>{node}</UnsavedChangesProvider>)
}

describe('Servizio A1 — sale e tavoli', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
  })

  it('Modifica sala apre direttamente la sala selezionata senza dropdown', async () => {
    const user = userEvent.setup()
    const onConfigureRoom = vi.fn()
    render(
      <RoomTabs
        rooms={[ROOM_A, ROOM_B]}
        selectedRoomId="room-b"
        onSelectRoom={vi.fn()}
        onConfigureRoom={onConfigureRoom}
      />,
    )

    await user.click(screen.getByRole('button', { name: /modifica sala/i }))

    expect(onConfigureRoom).toHaveBeenCalledWith(ROOM_B)
    expect(screen.queryByRole('button', { name: /^sala a$/i })).toBeInTheDocument()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('nuovo tavolo parte da 2 coperti', () => {
    renderWithGuard(
      <TableFormModal isOpen onClose={vi.fn()} rooms={[ROOM_A]} tables={[]} initial={null} />,
    )

    expect(screen.getByLabelText(/capienza/i)).toHaveValue(2)
  })

  it('nome tavolo è unico case-insensitive nell’intero tenant', async () => {
    const user = userEvent.setup()
    const existing = table({ id: 'existing', name: 'Tavolo 1', room_id: 'room-a' })
    renderWithGuard(
      <TableFormModal
        isOpen
        onClose={vi.fn()}
        rooms={[ROOM_A, ROOM_B]}
        tables={[existing]}
        defaultRoomId="room-b"
        initial={null}
      />,
    )

    await user.type(screen.getByLabelText(/nome tavolo/i), 'tAVOLO 1')
    await user.click(screen.getByRole('button', { name: /^aggiungi$/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/esiste già un tavolo con questo nome/i)
    expect(mocks.createTable).not.toHaveBeenCalled()
  })

  it('in modifica il controllo unicità ignora il record corrente', () => {
    const current = table({ id: 'current', name: 'Tavolo 1' })
    const other = table({ id: 'other', name: 'Tavolo 2', room_id: 'room-b' })

    expect(hasDuplicateTableName([current, other], 'TAVOLO 1', 'current')).toBe(false)
    expect(hasDuplicateTableName([current, other], 'tavolo 2', 'current')).toBe(true)
  })

  it('input e resa mappa condividono il limite nome e usano testo più leggibile', () => {
    const namedTable = table({ name: 'Tavolo 123' })
    const { container } = render(<TableShape table={namedTable} onEdit={vi.fn()} />)

    expect(TABLE_NAME_MAX_LENGTH).toBe(10)
    expect(container.querySelector('text')?.textContent).toBe('Tavolo 123')
    expect(container.querySelector('text')?.getAttribute('font-size')).toBe('12')
    expect(container.querySelectorAll('text')[1]?.getAttribute('font-size')).toBe('11')
  })

  it('contenitore mappa usa la larghezza configurata della sala con max responsive', () => {
    render(<TableMap room={ROOM_A} tables={[]} onEditTable={vi.fn()} onAddTable={vi.fn()} />)

    expect(screen.getByTestId('table-map-viewport')).toHaveStyle({ width: '800px', maxWidth: '100%' })
  })

  it('durante conferma elimina sala nasconde Annulla e Salva', async () => {
    const user = userEvent.setup()
    renderWithGuard(
      <RoomConfigModal isOpen onClose={vi.fn()} initial={ROOM_A} tableCount={1} />,
    )

    await user.click(screen.getByRole('button', { name: /elimina sala/i }))

    expect(screen.getByRole('button', { name: /sì, elimina/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^no$/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^annulla$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^salva$/i })).not.toBeInTheDocument()
  })
})
