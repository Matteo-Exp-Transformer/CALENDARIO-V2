/**
 * S4-FIX-4C — ora di arrivo sulle card della striscia «Prenotazioni» / «Assegnate».
 * S4-FIX-4B — frecce di scorrimento al posto della barra nativa (BookingCardsStrip).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
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
    desired_time?: string
    confirmed_start?: string
  }>,
  accepted: [] as Array<{
    id: string
    client_name: string
    num_guests: number
    desired_time?: string
    confirmed_start?: string
  }>,
}))

vi.mock('../../hooks/useTableStatuses', () => ({
  useTableStatuses: () => mockState.tableStatuses,
  DEFAULT_LATE_THRESHOLD_MINUTES: 15,
  useReleaseNoticeRecallMinutes: () => 30,
}))

vi.mock('../../hooks/useTableAssignments', () => ({
  useTableAssignments: () => ({ data: mockState.assignments }),
  useUnassignedBookings: () => ({ data: mockState.unassigned }),
  useAcceptedBookingsForDate: () => ({ data: mockState.accepted }),
  useAssignBookingToTable: () => ({ mutate: vi.fn(), isPending: false }),
  useAssignBookingToTables: () => ({ mutate: vi.fn(), isPending: false }),
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
      { id: 'slot-1', name: 'Pranzo', start_time: '11:30:00', end_time: '15:30:00', max_turns: null },
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

function selectSlot() {
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'slot-1' } })
}

// ─────────────────────────────────────────────
// FIX-4C — ora di arrivo
// ─────────────────────────────────────────────

describe('FIX-4C — ora di arrivo sulle card', () => {
  beforeEach(() => {
    mockState.tableStatuses = new Map([['t1', 'free']])
    mockState.assignments = []
  })

  it('mostra l\'ora di arrivo sulla card «Prenotazioni» quando disponibile', () => {
    mockState.unassigned = [
      { id: 'b-orario', client_name: 'Verdi', num_guests: 2, confirmed_start: `${TODAY}T12:30:00+00:00` },
    ]
    mockState.accepted = mockState.unassigned

    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />)
    selectSlot()

    expect(screen.getByText(/2 coperti · 12:30/)).toBeInTheDocument()
  })

  it('non mostra alcuna ora (né riga vuota né --:--) quando non è disponibile', () => {
    mockState.unassigned = [
      { id: 'b-senza-orario', client_name: 'Bianchi', num_guests: 3 },
    ]
    mockState.accepted = mockState.unassigned

    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />)
    selectSlot()

    expect(screen.getByText('3 coperti')).toBeInTheDocument()
    expect(screen.queryByText(/--:--/)).not.toBeInTheDocument()
  })

  it('mostra l\'ora di arrivo anche sulla card «Assegnate»', () => {
    mockState.unassigned = [
      { id: 'b-senza-orario', client_name: 'Bianchi', num_guests: 3 },
    ]
    mockState.accepted = [
      { id: 'b-orario', client_name: 'Verdi', num_guests: 2, confirmed_start: `${TODAY}T12:30:00+00:00` },
      ...mockState.unassigned,
    ]
    mockState.assignments = [
      {
        id: 'a1',
        table_id: 't1',
        service_slot_id: 'slot-1',
        date: TODAY,
        booking_id: 'b-orario',
        checked_out_at: null,
        turn_number: 1,
      },
    ]

    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />)
    selectSlot()

    expect(screen.getByText('Assegnate (1)')).toBeInTheDocument()
    expect(screen.getByText('12:30')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────
// FIX-4B — frecce al posto della barra di scorrimento
// ─────────────────────────────────────────────

/**
 * jsdom non implementa ResizeObserver: lo mockiamo catturando la callback per
 * poterla scatenare a mano dopo aver forzato le larghezze del contenitore
 * (stesso schema di useBookingPublicScrollRowAlign.test.tsx).
 */
let roCallback: ResizeObserverCallback | null = null

class MockResizeObserver {
  constructor(cb: ResizeObserverCallback) {
    roCallback = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

function setWidth(node: HTMLElement, prop: 'clientWidth' | 'scrollWidth', value: number) {
  Object.defineProperty(node, prop, { configurable: true, value })
}

function triggerMeasure() {
  act(() => {
    roCallback?.([], {} as ResizeObserver)
  })
}

describe('FIX-4B — frecce di scorrimento al posto della barra', () => {
  beforeEach(() => {
    mockState.tableStatuses = new Map([['t1', 'free']])
    mockState.assignments = []
    mockState.unassigned = [
      { id: 'b-1', client_name: 'Verdi', num_guests: 2 },
      { id: 'b-2', client_name: 'Neri', num_guests: 4 },
      { id: 'b-3', client_name: 'Gialli', num_guests: 2 },
    ]
    mockState.accepted = mockState.unassigned
    roCallback = null
    vi.stubGlobal('ResizeObserver', MockResizeObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('layout "grid": nessuna freccia, elenco verticale invariato', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="grid" />)
    selectSlot()

    expect(screen.queryByRole('button', { name: /Scorri a sinistra/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Scorri a destra/i })).not.toBeInTheDocument()
    expect(screen.queryByTestId('booking-cards-strip-scroll')).not.toBeInTheDocument()
  })

  it('layout "plan": nessuna freccia quando le card entrano tutte (niente overflow)', () => {
    render(<AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />)
    selectSlot()

    // JSDOM: senza forzare le larghezze, clientWidth/scrollWidth restano 0 → nessun overflow
    expect(screen.queryByRole('button', { name: /Scorri a sinistra/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Scorri a destra/i })).not.toBeInTheDocument()
  })

  it('layout "plan": le frecce compaiono con overflow e il click sposta lo scorrimento', () => {
    const { container } = render(
      <AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />,
    )
    selectSlot()

    const scroller = container.querySelector(
      '[data-testid="booking-cards-strip-scroll"]',
    ) as HTMLElement
    setWidth(scroller, 'clientWidth', 300)
    setWidth(scroller, 'scrollWidth', 900)
    Object.defineProperty(scroller, 'scrollLeft', { configurable: true, writable: true, value: 0 })
    triggerMeasure()

    const rightArrow = screen.getByRole('button', { name: /Scorri a destra/i })
    const leftArrow = screen.getByRole('button', { name: /Scorri a sinistra/i })
    expect(rightArrow).toBeEnabled()
    expect(leftArrow).toBeDisabled() // scrollLeft = 0: già all'inizio, nulla da scorrere a sinistra

    // jsdom non implementa scrollBy sull'elemento: lo definiamo prima di spiarlo
    // (vi.spyOn richiede che la proprietà esista già).
    const scrollBySpy = vi.fn()
    scroller.scrollBy = scrollBySpy
    fireEvent.click(rightArrow)

    expect(scrollBySpy).toHaveBeenCalledTimes(1)
    const call = scrollBySpy.mock.calls[0][0] as { left: number; behavior: string }
    expect(call.left).toBeGreaterThan(0)
  })

  it('il pulsante freccia ferma la propagazione del puntatore (non deve avviare un drag)', () => {
    const { container } = render(
      <AssignmentMapPanel rooms={[ROOM]} tables={[makeTable('t1', 'T1')]} layout="plan" />,
    )
    selectSlot()

    const scroller = container.querySelector(
      '[data-testid="booking-cards-strip-scroll"]',
    ) as HTMLElement
    setWidth(scroller, 'clientWidth', 300)
    setWidth(scroller, 'scrollWidth', 900)
    triggerMeasure()

    const rightArrow = screen.getByRole('button', { name: /Scorri a destra/i })
    // Ascolto su `document`, non su `container`: React 18 delega i suoi
    // listener sintetici proprio sul nodo `container` di render() — un
    // listener nativo lì sopra vedrebbe comunque l'evento (stopPropagation
    // blocca solo i nodi SUCCESSIVI nel percorso, non i listener fratelli
    // sullo stesso nodo). Il test vero è che l'evento non superi la radice.
    const bubbledListener = vi.fn()
    document.addEventListener('pointerdown', bubbledListener)

    try {
      fireEvent.pointerDown(rightArrow)
      expect(bubbledListener).not.toHaveBeenCalled()
    } finally {
      document.removeEventListener('pointerdown', bubbledListener)
    }
  })
})
