import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

/**
 * FIX B (03-08-26, D-A/S-2) — bug bloccante: eliminare un tavolo occupato lasciava la
 * prenotazione appesa (checked_out_at = null su un tavolo inattivo), senza tavolo e senza
 * il pulsante «Togli tavolo» in UI. Ora, prima di disattivare il tavolo, le righe di
 * assegnazione ATTIVE su QUESTO tavolo vengono cancellate FISICAMENTE (non timbrate):
 * la prenotazione non è stata servita, non deve consumare un turno né essere archiviata.
 * Stesso pattern di useRooms.softDelete.test.tsx ma per un solo table_id.
 */

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

import { useDeleteTable, useTableLiveBookings } from '../useServizioTables'

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

// ---------------------------------------------------------------------------
// useDeleteTable — tavolo LIBERO: invariato
// ---------------------------------------------------------------------------
describe('useDeleteTable — tavolo LIBERO: invariato, nessun avviso in più (D-A)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('nessun assignment attivo → nessun DELETE su booking_table_assignments, solo active=false su tables', async () => {
    const deleteAssignmentsFn = vi.fn()
    const updateTablesFn = vi.fn(() => ({
      eq: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }))

    mockFrom.mockImplementation((table: string) => {
      if (table === 'booking_table_assignments') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                is: vi.fn(() => Promise.resolve({ data: [], error: null })),
              })),
            })),
          })),
          delete: deleteAssignmentsFn,
        }
      }
      if (table === 'tables') {
        return { update: updateTablesFn }
      }
      return {}
    })

    const { result } = renderHook(() => useDeleteTable(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync('table-libero')
    })

    expect(deleteAssignmentsFn).not.toHaveBeenCalled()
    expect(updateTablesFn).toHaveBeenCalledWith({ active: false })
    expect(mockToast.success).toHaveBeenCalledWith('Tavolo rimosso')
  })
})

// ---------------------------------------------------------------------------
// useDeleteTable — tavolo OCCUPATO: libera prima (DELETE fisico), poi disattiva
// ---------------------------------------------------------------------------
describe('useDeleteTable — tavolo OCCUPATO: DELETE fisico delle righe attive, poi active=false (D-A/S-2)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('DELETE fisico delle righe attive, MAI update checked_out_at (non consuma un turno)', async () => {
    const deleteIdBatches: unknown[] = []
    const updateAssignmentsFn = vi.fn()
    const updateTablesFn = vi.fn(() => ({
      eq: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }))

    mockFrom.mockImplementation((table: string) => {
      if (table === 'booking_table_assignments') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                is: vi.fn(() =>
                  Promise.resolve({ data: [{ id: 'a1' }, { id: 'a2' }], error: null }),
                ),
              })),
            })),
          })),
          delete: vi.fn(() => ({
            in: vi.fn((_col: string, ids: string[]) => {
              deleteIdBatches.push(ids)
              return { eq: vi.fn(() => Promise.resolve({ error: null })) }
            }),
          })),
          update: updateAssignmentsFn,
        }
      }
      if (table === 'tables') {
        return { update: updateTablesFn }
      }
      return {}
    })

    const { result } = renderHook(() => useDeleteTable(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync('table-occupato')
    })

    expect(deleteIdBatches).toEqual([['a1', 'a2']])
    // Mai timbrato checked_out_at: la liberazione non brucia un turno (D-A)
    expect(updateAssignmentsFn).not.toHaveBeenCalled()
    expect(updateTablesFn).toHaveBeenCalledWith({ active: false })
    expect(mockToast.success).toHaveBeenCalledWith('Tavolo rimosso')
  })

  it('non chiama markBookingServedIfFullyReleased: nessuna scrittura su booking_requests', async () => {
    const bookingRequestsFn = vi.fn()

    mockFrom.mockImplementation((table: string) => {
      if (table === 'booking_table_assignments') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                is: vi.fn(() => Promise.resolve({ data: [{ id: 'a1' }], error: null })),
              })),
            })),
          })),
          delete: vi.fn(() => ({
            in: vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ error: null })) })),
          })),
        }
      }
      if (table === 'tables') {
        return { update: vi.fn(() => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) })) }
      }
      if (table === 'booking_requests') {
        bookingRequestsFn()
        return {}
      }
      return {}
    })

    const { result } = renderHook(() => useDeleteTable(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync('table-occupato')
    })

    expect(bookingRequestsFn).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// useDeleteTable — tavolata su più tavoli: tocca SOLO le righe di questo tavolo
// ---------------------------------------------------------------------------
describe('useDeleteTable — tavolata su più tavoli: tocca solo le righe del tavolo eliminato (D-A)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('la select filtra per tenant_id + table_id: gli altri tavoli della tavolata non entrano nel batch', async () => {
    const eqCalls: Array<[string, unknown]> = []
    mockFrom.mockImplementation((table: string) => {
      if (table === 'booking_table_assignments') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn((col: string, val: unknown) => {
              eqCalls.push([col, val])
              return {
                eq: vi.fn((col2: string, val2: unknown) => {
                  eqCalls.push([col2, val2])
                  return {
                    is: vi.fn(() => Promise.resolve({ data: [], error: null })),
                  }
                }),
              }
            }),
          })),
          delete: vi.fn(),
        }
      }
      if (table === 'tables') {
        return { update: vi.fn(() => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) })) }
      }
      return {}
    })

    const { result } = renderHook(() => useDeleteTable(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync('table-conteso')
    })

    expect(eqCalls).toEqual(
      expect.arrayContaining([
        ['tenant_id', 'tenant-1'],
        ['table_id', 'table-conteso'],
      ]),
    )
  })
})

// ---------------------------------------------------------------------------
// useDeleteTable — righe già chiuse restano intatte
// ---------------------------------------------------------------------------
describe('useDeleteTable — righe già chiuse (checked_out_at valorizzato) restano intatte', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('la select filtra is(checked_out_at, null): solo le righe ATTIVE entrano nel batch da cancellare', async () => {
    let isCall: [string, unknown] | null = null
    const deleteFn = vi.fn()
    mockFrom.mockImplementation((table: string) => {
      if (table === 'booking_table_assignments') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                is: vi.fn((col: string, val: unknown) => {
                  isCall = [col, val]
                  // Il filtro is(checked_out_at, null) esclude già le righe chiuse: qui simula
                  // che nel batch tornato dal DB non ce ne sia nessuna.
                  return Promise.resolve({ data: [], error: null })
                }),
              })),
            })),
          })),
          delete: deleteFn,
        }
      }
      if (table === 'tables') {
        return { update: vi.fn(() => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) })) }
      }
      return {}
    })

    const { result } = renderHook(() => useDeleteTable(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync('table-1')
    })

    expect(isCall).toEqual(['checked_out_at', null])
    expect(deleteFn).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// useTableLiveBookings
// ---------------------------------------------------------------------------
describe('useTableLiveBookings — conteggio prenotazioni vive su UN tavolo (D-A)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('conta i booking_id distinti attivi su quel tavolo', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'booking_table_assignments') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                is: vi.fn(() =>
                  Promise.resolve({
                    data: [{ booking_id: 'b1' }, { booking_id: 'b1' }],
                    error: null,
                  }),
                ),
              })),
            })),
          })),
        }
      }
      return {}
    })

    const { result } = renderHook(() => useTableLiveBookings('table-1'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toBe(1)
  })

  it('non è abilitato se tableId è null (nessuna richiesta per un tavolo libero non ancora aperto)', () => {
    const { result } = renderHook(() => useTableLiveBookings(null), { wrapper: makeWrapper() })
    expect(mockFrom).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
  })
})
