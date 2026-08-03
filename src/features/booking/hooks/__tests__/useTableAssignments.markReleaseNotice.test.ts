/**
 * FIX D, revisione senior (03-08-26) — useMarkReleaseNoticeHandled deve timbrare
 * `release_notice_handled_at` per `id` di riga, non più per tavolo+fascia+data.
 *
 * Motivo del cambio: un tavolo con un secondo turno già assegnato in coda
 * (`hasWaitingNextTurnOnTable` esiste proprio per rilevare questo caso) ha DUE righe
 * attive nello stesso tavolo+fascia+data. La versione precedente del filtro
 * (`.eq('table_id', ...).eq('service_slot_id', ...).eq('date', ...)`) le avrebbe
 * timbrate ENTRAMBE: il secondo turno erediterebbe una conferma "Ancora occupato" che
 * nessuno staff ha mai dato per lui, con il rischio che il SUO avviso di fine turno
 * resti silenzioso quando arriverà il momento.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

const dbCalls = vi.hoisted(() => ({
  updateCalls: [] as Array<{ payload: unknown; matches: Record<string, unknown> }>,
}))

vi.mock('@/lib/supabase', () => {
  function makeChain() {
    const chain: Record<string, unknown> = {}
    let current: { payload: unknown; matches: Record<string, unknown> } | null = null
    chain.update = (payload: unknown) => {
      current = { payload, matches: {} }
      dbCalls.updateCalls.push(current)
      return chain
    }
    chain.eq = (col: string, val: unknown) => {
      if (current) current.matches[col] = val
      return chain
    }
    Object.defineProperty(chain, 'then', {
      get() {
        return (resolve: (v: unknown) => void) => resolve({ error: null })
      },
    })
    return chain
  }
  return { supabase: { from: () => makeChain() } }
})

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: () => ({ tenantId: 'tenant-1' }),
}))

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
    refetchQueries: vi.fn().mockResolvedValue(undefined),
  }),
  useMutation: (opts: { mutationFn: (...args: unknown[]) => unknown }) => ({
    mutateAsync: opts.mutationFn,
    isPending: false,
  }),
  useQuery: () => ({ data: undefined }),
}))

vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() } }))

import { useMarkReleaseNoticeHandled } from '../useTableAssignments'

describe('useMarkReleaseNoticeHandled — timbra per id di riga, non per tavolo+fascia+data', () => {
  beforeEach(() => {
    dbCalls.updateCalls = []
  })

  it('la UPDATE filtra SOLO per id + tenant_id: nessun match su table_id/service_slot_id/date', async () => {
    const hook = useMarkReleaseNoticeHandled()
    await hook.mutateAsync({ assignmentId: 'a-turno-1', date: '2026-08-03' })

    expect(dbCalls.updateCalls).toHaveLength(1)
    const call = dbCalls.updateCalls[0]
    expect(call.matches).toMatchObject({ id: 'a-turno-1', tenant_id: 'tenant-1' })
    expect(call.matches).not.toHaveProperty('table_id')
    expect(call.matches).not.toHaveProperty('service_slot_id')
    expect(call.matches).not.toHaveProperty('date')
    expect(call.payload).toMatchObject({ release_notice_handled_at: expect.any(String) })
  })

  it('due chiamate con id diversi (due turni sullo stesso tavolo) producono due UPDATE indipendenti', async () => {
    const hook = useMarkReleaseNoticeHandled()
    await hook.mutateAsync({ assignmentId: 'a-turno-1', date: '2026-08-03' })
    await hook.mutateAsync({ assignmentId: 'a-turno-2', date: '2026-08-03' })

    expect(dbCalls.updateCalls).toHaveLength(2)
    expect(dbCalls.updateCalls[0].matches.id).toBe('a-turno-1')
    expect(dbCalls.updateCalls[1].matches.id).toBe('a-turno-2')
  })
})
