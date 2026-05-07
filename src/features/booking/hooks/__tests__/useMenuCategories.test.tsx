import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const { mockFrom, mockTenantId } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockTenantId: { value: 'tenant-1' as string | null },
}))

vi.mock('@/lib/supabase', () => ({
  supabase: { from: mockFrom },
  handleSupabaseError: (e: unknown) => {
    if (e && typeof e === 'object' && 'message' in e) return (e as { message: string }).message
    return 'Errore'
  },
}))

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: vi.fn(() => ({ tenantId: mockTenantId.value })),
}))

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

import {
  useMenuCategories,
  useCreateMenuCategory,
  useUpdateMenuCategory,
} from '../useMenuCategories'

const CAT_LIST = [
  { id: 'cat-1', tenant_id: 'tenant-1', key: 'antipasti', label: 'Antipasti', sort_order: 1, created_at: '', updated_at: '' },
  { id: 'cat-2', tenant_id: 'tenant-1', key: 'primi', label: 'Primi', sort_order: 2, created_at: '', updated_at: '' },
]

function buildReadChain(data: unknown[]) {
  const chain: Record<string, unknown> = {}
  chain['select'] = vi.fn(() => chain)
  chain['eq'] = vi.fn(() => chain)
  chain['order'] = vi.fn(() => chain)
  // La query finisce con la seconda .order() — restituisce direttamente la Promise
  ;(chain['order'] as ReturnType<typeof vi.fn>)
    .mockReturnValueOnce(chain)
    .mockResolvedValueOnce({ data, error: null })
  return chain
}

function buildMutationChain(result: { data: unknown; error: null | { message: string; code?: string } }) {
  const chain: Record<string, unknown> = {}
  chain['insert'] = vi.fn(() => chain)
  chain['update'] = vi.fn(() => chain)
  chain['delete'] = vi.fn(() => chain)
  chain['eq'] = vi.fn(() => chain)
  chain['select'] = vi.fn(() => chain)
  chain['single'] = vi.fn().mockResolvedValue(result)
  return chain
}

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useMenuCategories', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('query disabilitata se tenantId è null', () => {
    mockTenantId.value = null
    const { result } = renderHook(() => useMenuCategories(), { wrapper: makeWrapper() })
    // Con enabled: false la query non parte → fetchStatus idle
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('restituisce le categorie filtrate per tenant', async () => {
    // Simula la chain: .select().eq().order().order() → { data: CAT_LIST }
    const chain: Record<string, unknown> = {}
    chain['select'] = vi.fn(() => chain)
    chain['eq'] = vi.fn(() => chain)
    // Prima .order() → chain, seconda .order() → Promise con risultato
    let orderCallCount = 0
    chain['order'] = vi.fn(() => {
      orderCallCount++
      if (orderCallCount < 2) return chain
      return Promise.resolve({ data: CAT_LIST, error: null })
    })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useMenuCategories(), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].key).toBe('antipasti')
  })
})

describe('useCreateMenuCategory', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('chiama supabase.insert con i dati corretti', async () => {
    const newCat = { id: 'cat-3', tenant_id: 'tenant-1', key: 'dolci', label: 'Dolci', sort_order: 3, created_at: '', updated_at: '' }
    const chain = buildMutationChain({ data: newCat, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useCreateMenuCategory(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({ key: 'dolci', label: 'Dolci', sort_order: 3 })
    })

    expect(mockFrom).toHaveBeenCalledWith('menu_categories')
    const insertCall = (chain['insert'] as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(insertCall.key).toBe('dolci')
    expect(insertCall.label).toBe('Dolci')
    expect(insertCall.tenant_id).toBe('tenant-1')
  })

  it('propaga errore di duplicato con messaggio leggibile', async () => {
    const chain = buildMutationChain({ data: null, error: { message: 'duplicate key', code: '23505' } })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useCreateMenuCategory(), { wrapper: makeWrapper() })

    await expect(
      act(async () => {
        await result.current.mutateAsync({ key: 'antipasti', label: 'Antipasti' })
      })
    ).rejects.toThrow('Esiste già una categoria con questo nome')
  })
})

describe('useUpdateMenuCategory', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockTenantId.value = 'tenant-1'
  })

  it('chiama supabase.update su menu_categories', async () => {
    const updated = { ...CAT_LIST[0], label: 'Antipasti e stuzzichini' }
    const chain = buildMutationChain({ data: updated, error: null })
    mockFrom.mockReturnValue(chain)

    const { result } = renderHook(() => useUpdateMenuCategory(), { wrapper: makeWrapper() })

    await act(async () => {
      await result.current.mutateAsync({
        id: 'cat-1',
        key: 'antipasti',
        previousKey: 'antipasti',
        label: 'Antipasti e stuzzichini',
      })
    })

    expect(mockFrom).toHaveBeenCalledWith('menu_categories')
    const updateCall = (chain['update'] as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(updateCall.label).toBe('Antipasti e stuzzichini')
  })
})
