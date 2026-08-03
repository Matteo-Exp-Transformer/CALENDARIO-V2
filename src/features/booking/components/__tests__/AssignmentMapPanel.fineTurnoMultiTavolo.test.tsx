/**
 * Test S4 post-QA — due comportamenti richiesti da Matteo (02-08-26):
 *
 * 1. FINE TURNO (D22/D23): quando la finestra di occupazione è scaduta il tavolo
 *    passa in "In uscita" e la capienza si è già liberata da sola. Lo stato fisico
 *    però lo conferma lo staff: deve comparire una finestra di notifica con
 *    "Libero" (checkout append-only) e "Ancora occupato" (silenzia l'avviso).
 *
 * 2. MULTI-TAVOLO (D39): una tavolata da 10 su due tavoli da 4 deve comparire come
 *    UNA riga in "Assegnate", con entrambi i tavoli, i posti totali e i coperti
 *    ancora scoperti, più l'azione per aggiungere un altro tavolo.
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
    release_notice_handled_at?: string | null
  }>,
  acceptedBookings: [] as Array<{
    id: string
    client_name: string
    num_guests: number
    desired_time: string
    confirmed_start: string
    confirmed_end: string
  }>,
  checkoutMutate: vi.fn(),
  markReleaseNoticeMutate: vi.fn(),
  releaseNoticeRecallMinutes: 30,
}))

vi.mock('../../hooks/useTableStatuses', () => ({
  useTableStatuses: () => mockState.tableStatuses,
  DEFAULT_LATE_THRESHOLD_MINUTES: 15,
  useReleaseNoticeRecallMinutes: () => mockState.releaseNoticeRecallMinutes,
}))

vi.mock('../../hooks/useTableAssignments', () => ({
  useTableAssignments: () => ({ data: mockState.assignments }),
  useUnassignedBookings: () => ({ data: [] }),
  useAcceptedBookingsForDate: () => ({ data: mockState.acceptedBookings }),
  useAssignBookingToTable: () => ({ mutate: vi.fn(), isPending: false }),
  useAssignBookingToTables: () => ({ mutate: vi.fn(), isPending: false }),
  useForceReplaceBookingOnTable: () => ({ mutate: vi.fn(), isPending: false }),
  useUndoTableAssignment: () => ({ mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false }),
  useCheckoutTable: () => ({ mutate: mockState.checkoutMutate, isPending: false }),
  // FIX D: la produzione chiude l'avviso solo dopo onSuccess (evita la corsa col reload,
  // vedi commento in AssignmentMapPanel.tsx markReleaseHandled) — il mock invoca onSuccess
  // subito, sincrono, per non introdurre attese artificiali nei test DOM.
  useMarkReleaseNoticeHandled: () => ({
    mutate: (vars: unknown, opts?: { onSuccess?: () => void }) => {
      mockState.markReleaseNoticeMutate(vars)
      opts?.onSuccess?.()
    },
    isPending: false,
  }),
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
  Button: ({ children, onClick, disabled, type, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }) => (
    <button type={type ?? 'button'} onClick={onClick} disabled={disabled} {...rest}>{children}</button>
  ),
  Modal: ({ children, isOpen, title }: { children: React.ReactNode; isOpen: boolean; title?: string }) => (
    isOpen ? <div role="dialog" aria-label={title}>{children}</div> : null
  ),
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

function makeTable(id: string, name: string, capacity: number): RestaurantTable {
  return {
    id,
    tenant_id: 't1',
    name,
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

const TABLE_1 = makeTable('table-1', 'T1', 4)
const TABLE_2 = makeTable('table-2', 'T2', 4)

function renderPanel(tables: RestaurantTable[]) {
  return render(<AssignmentMapPanel rooms={[ROOM]} tables={tables} />)
}

function selectSlot(container: HTMLElement) {
  const select = container.querySelector('select') as HTMLSelectElement
  fireEvent.change(select, { target: { value: 'slot-1' } })
}

beforeEach(() => {
  mockState.tableStatuses = new Map()
  mockState.assignments = []
  mockState.acceptedBookings = []
  mockState.checkoutMutate = vi.fn()
  mockState.markReleaseNoticeMutate = vi.fn()
  mockState.releaseNoticeRecallMinutes = 30
})

describe('AssignmentMapPanel — avviso fine turno con conferma staff (D22/D23)', () => {
  beforeEach(() => {
    mockState.tableStatuses = new Map([['table-1', 'leaving']])
    mockState.assignments = [
      {
        id: 'a1',
        table_id: 'table-1',
        service_slot_id: 'slot-1',
        date: TODAY,
        booking_id: 'booking-1',
        checked_out_at: null,
        turn_number: 1,
      },
    ]
    mockState.acceptedBookings = [
      {
        id: 'booking-1',
        client_name: 'Mario Rossi',
        num_guests: 4,
        desired_time: '20:00',
        confirmed_start: '2026-06-24T20:00:00+00:00',
        confirmed_end: '2026-06-24T21:30:00+00:00',
      },
    ]
  })

  it('tavolo "In uscita" → si apre la finestra di notifica con il cliente e l\'orario di fine', () => {
    const { container } = renderPanel([TABLE_1])
    selectSlot(container)

    const dialog = screen.getByRole('dialog', { name: /tavolo a fine turno/i })
    expect(within(dialog).getByText('T1')).toBeInTheDocument()
    expect(within(dialog).getByText('Mario Rossi')).toBeInTheDocument()
    // Ora a muro estratta dalla stringa ISO, non convertita di fuso
    expect(within(dialog).getByText(/fine turno 21:30/i)).toBeInTheDocument()
  })

  it('"Libero" esegue il checkout del tavolo e chiude l\'avviso', () => {
    const { container } = renderPanel([TABLE_1])
    selectSlot(container)

    fireEvent.click(screen.getByRole('button', { name: 'Libero' }))

    expect(mockState.checkoutMutate).toHaveBeenCalledTimes(1)
    expect(mockState.checkoutMutate.mock.calls[0][0]).toMatchObject({
      tableId: 'table-1',
      slotId: 'slot-1',
      date: TODAY,
    })
    expect(screen.queryByRole('dialog', { name: /tavolo a fine turno/i })).not.toBeInTheDocument()
  })

  // FIX D (03-08-26, D-D): prima "Ancora occupato" non toccava il DB, solo lo stato
  // React locale (bug FU-SERV-RELEASE-NOTICE-1: l'avviso tornava dopo un F5). Ora
  // timbra release_notice_handled_at sulla riga attiva — persistito, vale per tutti i
  // dispositivi. Non tocca comunque il checkout: il tavolo resta occupato.
  it('"Ancora occupato" NON esegue il checkout, silenzia subito l\'avviso E persiste la conferma sul DB', () => {
    const { container } = renderPanel([TABLE_1])
    selectSlot(container)

    fireEvent.click(screen.getByRole('button', { name: /ancora occupato/i }))

    expect(mockState.checkoutMutate).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog', { name: /tavolo a fine turno/i })).not.toBeInTheDocument()
    expect(mockState.markReleaseNoticeMutate).toHaveBeenCalledTimes(1)
    // FIX D, revisione senior: timbra la riga ESATTA (assignmentId), non più
    // tavolo+fascia+data — 'a1' è l'id dell'unica riga attiva su table-1 nel fixture.
    expect(mockState.markReleaseNoticeMutate).toHaveBeenCalledWith({
      assignmentId: 'a1',
      date: TODAY,
    })
  })

  it('tavolo occupato ma non a fine turno → nessun avviso', () => {
    mockState.tableStatuses = new Map([['table-1', 'occupied']])
    const { container } = renderPanel([TABLE_1])
    selectSlot(container)

    expect(screen.queryByRole('dialog', { name: /fine turno/i })).not.toBeInTheDocument()
  })

  // FIX D, revisione senior (03-08-26): "Ancora occupato" timbra SOLO la riga notificata,
  // mai un secondo turno già in coda sullo stesso tavolo (hasWaitingNextTurnOnTable esiste
  // proprio per questo caso). Prima del fix, useMarkReleaseNoticeHandled filtrava per
  // tavolo+fascia+data e avrebbe timbrato ANCHE la riga del turno successivo — che nessuno
  // ha mai confermato, e che al suo turno potrebbe restare silenziosa.
  it('con un secondo turno già in coda sullo stesso tavolo, "Ancora occupato" timbra SOLO la riga in uscita (turno più basso)', () => {
    mockState.assignments = [
      {
        id: 'a-turno-1',
        table_id: 'table-1',
        service_slot_id: 'slot-1',
        date: TODAY,
        booking_id: 'booking-1',
        checked_out_at: null,
        turn_number: 1,
      },
      {
        id: 'a-turno-2',
        table_id: 'table-1',
        service_slot_id: 'slot-1',
        date: TODAY,
        booking_id: 'booking-2',
        checked_out_at: null,
        turn_number: 2,
      },
    ]
    const { container } = renderPanel([TABLE_1])
    selectSlot(container)

    fireEvent.click(screen.getByRole('button', { name: /ancora occupato/i }))

    expect(mockState.markReleaseNoticeMutate).toHaveBeenCalledTimes(1)
    expect(mockState.markReleaseNoticeMutate).toHaveBeenCalledWith({
      assignmentId: 'a-turno-1',
      date: TODAY,
    })
  })

  // ── FIX D (03-08-26, D-D) — persistenza su DB, filtro sul richiamo ────────────
  describe('conferma persistita sul record (release_notice_handled_at)', () => {
    it('conferma di 29 minuti fa (< intervallo di richiamo 30\') → l\'avviso NON torna, nemmeno dopo un reload', () => {
      mockState.assignments[0].release_notice_handled_at = new Date(
        Date.now() - 29 * 60 * 1000,
      ).toISOString()

      const { container } = renderPanel([TABLE_1])
      selectSlot(container)

      // Simula il "reload": handledReleaseTableIds locale è vuoto (nuovo mount), la
      // verità viene solo dalla colonna sulla riga attiva.
      expect(screen.queryByRole('dialog', { name: /tavolo a fine turno/i })).not.toBeInTheDocument()
    })

    it('conferma di 31 minuti fa (> intervallo di richiamo 30\') → l\'avviso torna', () => {
      mockState.assignments[0].release_notice_handled_at = new Date(
        Date.now() - 31 * 60 * 1000,
      ).toISOString()

      const { container } = renderPanel([TABLE_1])
      selectSlot(container)

      const dialog = screen.getByRole('dialog', { name: /tavolo a fine turno/i })
      expect(within(dialog).getByText('T1')).toBeInTheDocument()
    })

    it('nessuna conferma mai data (release_notice_handled_at = null) → l\'avviso compare', () => {
      mockState.assignments[0].release_notice_handled_at = null
      const { container } = renderPanel([TABLE_1])
      selectSlot(container)

      expect(screen.getByRole('dialog', { name: /tavolo a fine turno/i })).toBeInTheDocument()
    })

    it('manopola diversa (intervallo di richiamo 60\') → una conferma di 31 minuti fa resta silenziata', () => {
      mockState.releaseNoticeRecallMinutes = 60
      mockState.assignments[0].release_notice_handled_at = new Date(
        Date.now() - 31 * 60 * 1000,
      ).toISOString()

      const { container } = renderPanel([TABLE_1])
      selectSlot(container)

      expect(screen.queryByRole('dialog', { name: /tavolo a fine turno/i })).not.toBeInTheDocument()
    })
  })

  // ── FIX D — cambio fascia o giorno: voce di checklist mai verificata (§2.2-6) ──
  it('cambio fascia azzera gli avvisi già gestiti localmente in questa sessione', () => {
    const { container } = renderPanel([TABLE_1])
    selectSlot(container)
    expect(screen.getByRole('dialog', { name: /tavolo a fine turno/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /ancora occupato/i }))
    expect(screen.queryByRole('dialog', { name: /tavolo a fine turno/i })).not.toBeInTheDocument()

    // Cambio fascia (deseleziona e riseleziona): l'effetto su [selectedSlotId, selectedDate]
    // azzera handledReleaseTableIds. Il tavolo resta "in uscita" nel mock (nella app reale
    // tableStatuses verrebbe ricalcolato per la nuova fascia+data) — se il reset non
    // funzionasse, l'avviso resterebbe silenziato per il resto della sessione.
    const select = container.querySelector('select') as HTMLSelectElement
    fireEvent.change(select, { target: { value: '' } })
    fireEvent.change(select, { target: { value: 'slot-1' } })

    expect(screen.getByRole('dialog', { name: /tavolo a fine turno/i })).toBeInTheDocument()
  })
})

describe('AssignmentMapPanel — tavolata su più tavoli (D39)', () => {
  beforeEach(() => {
    mockState.tableStatuses = new Map([
      ['table-1', 'occupied'],
      ['table-2', 'occupied'],
    ])
    // Stessa prenotazione su due tavoli diversi
    mockState.assignments = [
      {
        id: 'a1',
        table_id: 'table-1',
        service_slot_id: 'slot-1',
        date: TODAY,
        booking_id: 'booking-1',
        checked_out_at: null,
        turn_number: 1,
      },
      {
        id: 'a2',
        table_id: 'table-2',
        service_slot_id: 'slot-1',
        date: TODAY,
        booking_id: 'booking-1',
        checked_out_at: null,
        turn_number: 1,
      },
    ]
    mockState.acceptedBookings = [
      {
        id: 'booking-1',
        client_name: 'Famiglia Verdi',
        num_guests: 10,
        desired_time: '20:00',
        confirmed_start: '2026-06-24T20:00:00+00:00',
        confirmed_end: '2026-06-24T21:30:00+00:00',
      },
    ]
  })

  it('mostra una sola riga "Assegnate" con entrambi i tavoli e i posti totali', () => {
    const { container } = renderPanel([TABLE_1, TABLE_2])
    selectSlot(container)

    expect(screen.getByText(/Assegnate \(1\)/)).toBeInTheDocument()
    // FIX-7: la riga in testata non ripete più tavolo/posti (duplicato col dettaglio
    // per-tavolo espandibile, che ora li mostra con prefisso "Tavolo").
    expect(screen.getByText('10 coperti')).toBeInTheDocument()
    expect(screen.queryByText(/T1, T2 \(8 posti\)/)).not.toBeInTheDocument()
  })

  it('segnala i coperti ancora scoperti della tavolata', () => {
    const { container } = renderPanel([TABLE_1, TABLE_2])
    selectSlot(container)

    expect(screen.getByText(/Mancano 2 posti per questa tavolata/i)).toBeInTheDocument()
  })

  it('"Aggiungi tavolo" apre la modale sulla tavolata esistente, coi tavoli già usati non riselezionabili', () => {
    const { container } = renderPanel([TABLE_1, TABLE_2])
    selectSlot(container)

    fireEvent.click(screen.getByRole('button', { name: /aggiungi tavolo/i }))

    expect(screen.getByRole('dialog', { name: /aggiungi tavolo alla tavolata/i })).toBeInTheDocument()
    expect(screen.getByText(/8 posti su 10 richiesti/)).toBeInTheDocument()
    expect(screen.getAllByText('Già in tavolata')).toHaveLength(2)
  })

  it('senza tavolate assegnate la sezione non compare', () => {
    mockState.assignments = []
    mockState.acceptedBookings = []
    const { container } = renderPanel([TABLE_1, TABLE_2])
    selectSlot(container)

    expect(screen.queryByText(/Assegnate \(/)).not.toBeInTheDocument()
  })
})
