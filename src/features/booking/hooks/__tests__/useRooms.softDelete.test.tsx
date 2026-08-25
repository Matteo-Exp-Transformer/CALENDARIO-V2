import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// D50 — soft-delete sala + release prenotazioni nel cassetto «da assegnare»

const { mockFrom, mockTenantId, mockToast } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockTenantId: { value: 'tenant-1' as string | null },
  mockToast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/supabase', () => ({
  supabase: { from: mockFrom },
}))

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: vi.fn(() => ({ tenantId: mockTenantId.value })),
}))

vi.mock('react-toastify', () => ({
  toast: mockToast,
}))

vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}))

import { useRooms, useDeleteRoom, useRoomLiveBookings } from '../useRooms'

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

// ---------------------------------------------------------------------------
// useRooms — deve filtrare per active = true
// ---------------------------------------------------------------------------
describe('useRooms — filtra sale archiviate (D50)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('include .eq("active", true) nella query', async () => {
    // Costruiamo una catena di mock che registra le chiamate eq
    const eqCalls: Array<[string, unknown]> = []
    const eqChain = {
      eq: vi.fn((col: string, val: unknown) => {
        eqCalls.push([col, val])
        return eqChain
      }),
      order: vi.fn().mockReturnValue(
        Promise.resolve({ data: [], error: null }),
      ),
    }
    const selectChain = {
      select: vi.fn().mockReturnValue(eqChain),
    }
    mockFrom.mockReturnValue(selectChain)

    renderHook(() => useRooms(), { wrapper: makeWrapper() })

    await waitFor(() => {
      expect(eqCalls).toEqual(
        expect.arrayContaining([['active', true]]),
      )
    })
  })
})

// ---------------------------------------------------------------------------
// useDeleteRoom — sala SCARICA (nessun assignment attivo)
// ---------------------------------------------------------------------------
describe('useDeleteRoom — sala scarica: nessun assignment toccato (D50)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('archivia la sala con active=false senza mai chiamare delete su rooms o assignments', async () => {
    const deleteRoomsFn = vi.fn()
    const deleteAssignmentsFn = vi.fn()
    const updateAssignmentsFn = vi.fn()
    const updateRoomsFn = vi.fn(() => ({
      eq: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }))

    // Tabella tables: restituisce lista vuota (sala scarica)
    const tablesSelectChain = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      update: updateRoomsFn,
      delete: deleteRoomsFn,
    }

    // Tabella booking_table_assignments: non dovrebbe mai essere chiamata
    const assignmentsChain = {
      select: vi.fn(() => ({})),
      update: updateAssignmentsFn,
      delete: deleteAssignmentsFn,
    }

    mockFrom.mockImplementation((table: string) => {
      if (table === 'tables') return tablesSelectChain
      if (table === 'booking_table_assignments') return assignmentsChain
      if (table === 'rooms') return { update: updateRoomsFn, delete: deleteRoomsFn }
      return {}
    })

    const { result } = renderHook(() => useDeleteRoom(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync('room-1')
    })

    // NON deve mai chiamare delete su rooms
    expect(deleteRoomsFn).not.toHaveBeenCalled()
    // NON deve mai chiamare delete su booking_table_assignments
    expect(deleteAssignmentsFn).not.toHaveBeenCalled()
    // booking_table_assignments.update NON deve essere chiamato (sala scarica)
    expect(updateAssignmentsFn).not.toHaveBeenCalled()
    // Toast di archiviazione (non di eliminazione)
    expect(mockToast.success).toHaveBeenCalledWith('Sala archiviata')
  })
})

// ---------------------------------------------------------------------------
// useDeleteRoom — sala VIVA (ha assignment attivi)
// ---------------------------------------------------------------------------
// FU-SERV-TURNO-SALA-1 (APERTO, decisione Matteo 06-08-26 ancora non eseguita):
// oggi la sala viva fa UPDATE checked_out_at (consuma turno); il tavolo invece
// fa DELETE fisico. Target prodotto: allineare la sala al tavolo. Questo test
// pina il comportamento *corrente* finché P6 non gira — a quel punto va
// riscritto come «DELETE assignments, mai checked_out_at».
describe('useDeleteRoom — sala viva: timbra checked_out_at + archivia (D50)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('timbra checked_out_at sugli assignment attivi E archivia la sala, senza mai delete', async () => {
    const updateAssignmentPayloads: unknown[] = []
    const deleteRoomsFn = vi.fn()
    const deleteAssignmentsFn = vi.fn()

    // Tables: due tavoli nella sala
    const tablesResult = { data: [{ id: 'table-1' }, { id: 'table-2' }], error: null }

    // Assignments attivi: due assignment
    const assignmentsResult = { data: [{ id: 'assign-1' }, { id: 'assign-2' }], error: null }

    // UPDATE rooms — cattura il payload
    const updateRoomsFn = vi.fn((payload: unknown) => {
      return {
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
        _payload: payload,
      }
    })

    // UPDATE assignments — cattura il payload
    const updateAssignsFn = vi.fn((payload: unknown) => {
      updateAssignmentPayloads.push(payload)
      return {
        in: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
      }
    })

    mockFrom.mockImplementation((table: string) => {
      if (table === 'tables') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => Promise.resolve(tablesResult)),
            })),
          })),
          delete: deleteRoomsFn,
        }
      }
      if (table === 'booking_table_assignments') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              in: vi.fn(() => ({
                is: vi.fn(() => Promise.resolve(assignmentsResult)),
              })),
            })),
          })),
          update: updateAssignsFn,
          delete: deleteAssignmentsFn,
        }
      }
      if (table === 'rooms') {
        return {
          update: updateRoomsFn,
          delete: deleteRoomsFn,
        }
      }
      return {}
    })

    const { result } = renderHook(() => useDeleteRoom(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync('room-1')
    })

    // Deve aver timbrato checked_out_at sugli assignment (non delete)
    expect(updateAssignsFn).toHaveBeenCalledTimes(1)
    const assignPayload = updateAssignmentPayloads[0] as Record<string, unknown>
    expect(assignPayload).toHaveProperty('checked_out_at')
    expect(typeof assignPayload['checked_out_at']).toBe('string')
    // checked_out_at deve essere una stringa ISO non nulla
    expect(assignPayload['checked_out_at']).not.toBeNull()

    // NON deve mai chiamare delete
    expect(deleteRoomsFn).not.toHaveBeenCalled()
    expect(deleteAssignmentsFn).not.toHaveBeenCalled()

    // Deve aver archiviato la sala
    expect(updateRoomsFn).toHaveBeenCalledWith({ active: false })

    expect(mockToast.success).toHaveBeenCalledWith('Sala archiviata')
  })
})

// ---------------------------------------------------------------------------
// useRoomLiveBookings — conta booking_id distinti
// ---------------------------------------------------------------------------
describe('useRoomLiveBookings — conteggio prenotazioni vive (D50)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('ritorna 0 se la sala non ha tavoli', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'tables') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
            })),
          })),
        }
      }
      return {}
    })

    const { result } = renderHook(() => useRoomLiveBookings('room-empty'), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toBe(0)
  })

  it('conta i booking_id distinti tra assignment attivi', async () => {
    // booking-A assegnato a due tavoli diversi: conta come 1 solo
    const assignmentsData = [
      { booking_id: 'booking-A' },
      { booking_id: 'booking-A' },
      { booking_id: 'booking-B' },
    ]

    mockFrom.mockImplementation((table: string) => {
      if (table === 'tables') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() =>
                Promise.resolve({ data: [{ id: 'table-1' }, { id: 'table-2' }], error: null }),
              ),
            })),
          })),
        }
      }
      if (table === 'booking_table_assignments') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              in: vi.fn(() => ({
                is: vi.fn(() => Promise.resolve({ data: assignmentsData, error: null })),
              })),
            })),
          })),
        }
      }
      return {}
    })

    const { result } = renderHook(() => useRoomLiveBookings('room-1'), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    // booking-A e booking-B = 2 distinti (non 3)
    expect(result.current.data).toBe(2)
  })

  it('non è abilitato se roomId è null', () => {
    const { result } = renderHook(() => useRoomLiveBookings(null), {
      wrapper: makeWrapper(),
    })
    // Query disabled: nessuna chiamata a from
    expect(mockFrom).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
  })
})
