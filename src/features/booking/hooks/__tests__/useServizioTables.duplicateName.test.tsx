import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Parte A del debito "nome tavolo unico solo lato app" (handoff S4 §4-bis punto 4).
// Migrazione 068 aggiunge un indice unico case/spazi-insensitive per tenant sui tavoli attivi
// (tables_tenant_active_name_lower_idx). Se lo scrive violato (race fra due admin, o una
// scrittura che bypassa il check client-side hasDuplicateTableName), Postgres risponde con
// l'errore 23505 (unique_violation): il messaggio grezzo va sostituito con quello amichevole,
// coerente col testo già mostrato dal controllo client (servizioA1Fixes.test.tsx riga ~119).

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

import { useCreateTable, useUpdateTable, type TableInput } from '../useServizioTables'

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const BASE_INPUT: TableInput = {
  name: 'Tavolo 1',
  capacity: 4,
  placement: 'Sala A',
  room_id: 'room-1',
}

const POSTGRES_UNIQUE_VIOLATION = {
  code: '23505',
  message:
    'duplicate key value violates unique constraint "tables_tenant_active_name_lower_idx"',
  details: null,
  hint: null,
}

describe('useCreateTable — violazione indice unico nome tavolo (mig. 068)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('code 23505 → messaggio amichevole, non il testo Postgres grezzo', async () => {
    const insert = vi.fn(() => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: POSTGRES_UNIQUE_VIOLATION }),
      }),
    }))
    mockFrom.mockReturnValue({ insert })

    const { result } = renderHook(() => useCreateTable(), { wrapper: makeWrapper() })

    await act(async () => {
      result.current.mutate(BASE_INPUT)
    })

    await waitFor(() => expect(mockToast.error).toHaveBeenCalledTimes(1))
    expect(mockToast.error).toHaveBeenCalledWith('Esiste già un tavolo con questo nome.')
    expect(mockToast.error.mock.calls[0][0]).not.toContain('duplicate key value')
    expect(mockToast.error.mock.calls[0][0]).not.toContain('constraint')
  })

  it('un errore diverso da 23505 mantiene il messaggio Postgres originale', async () => {
    const otherError = { code: '23514', message: 'check constraint violated', details: null, hint: null }
    const insert = vi.fn(() => ({
      select: () => ({ single: () => Promise.resolve({ data: null, error: otherError }) }),
    }))
    mockFrom.mockReturnValue({ insert })

    const { result } = renderHook(() => useCreateTable(), { wrapper: makeWrapper() })

    await act(async () => {
      result.current.mutate(BASE_INPUT)
    })

    await waitFor(() => expect(mockToast.error).toHaveBeenCalledTimes(1))
    expect(mockToast.error).toHaveBeenCalledWith('check constraint violated')
  })
})

describe('useUpdateTable — violazione indice unico nome tavolo (mig. 068)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('code 23505 → messaggio amichevole, non il testo Postgres grezzo', async () => {
    const update = vi.fn(() => ({
      eq: () => ({ eq: () => Promise.resolve({ error: POSTGRES_UNIQUE_VIOLATION }) }),
    }))
    mockFrom.mockReturnValue({ update })

    const { result } = renderHook(() => useUpdateTable(), { wrapper: makeWrapper() })

    await act(async () => {
      result.current.mutate({ id: 't-1', input: BASE_INPUT })
    })

    await waitFor(() => expect(mockToast.error).toHaveBeenCalledTimes(1))
    expect(mockToast.error).toHaveBeenCalledWith('Esiste già un tavolo con questo nome.')
    expect(mockToast.error.mock.calls[0][0]).not.toContain('duplicate key value')
  })
})
