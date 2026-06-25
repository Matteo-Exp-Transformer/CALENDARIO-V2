import { describe, it, expect, vi } from 'vitest'
import { buildWalkInRollbackPatch } from '../useWalkInMutation'

describe('useWalkInMutation — rollback walk-in con tavolo', () => {
  it('costruisce un update che archivia il booking se l assignment fallisce', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-24T20:15:00.000Z'))

    const patch = buildWalkInRollbackPatch('Rollback walk-in: assegnazione tavolo fallita')

    expect(patch).toMatchObject({
      status: 'deleted',
      cancellation_reason: 'Rollback walk-in: assegnazione tavolo fallita',
      cancelled_at: '2026-06-24T20:15:00.000Z',
      updated_at: '2026-06-24T20:15:00.000Z',
    })

    vi.useRealTimers()
  })
})
