// @admin-blindatura: shell-login
// Copre: la distinzione fra guasti temporanei da ritentare e risposte definitive.
import { describe, expect, it } from 'vitest'
import { isTransientSupabaseFailure } from '@/lib/supabaseRetry'

describe('isTransientSupabaseFailure', () => {
  it.each([0, 408, 429, 500, 503, 599])('considera temporaneo lo status %s', (status) => {
    expect(isTransientSupabaseFailure({ status, message: 'temporary failure' })).toBe(true)
  })

  it.each([400, 401, 403, 404])('non ritenta lo status definitivo %s', (status) => {
    expect(isTransientSupabaseFailure({ status, message: 'definitive response' })).toBe(false)
  })

  it('ritenta gli errori PostgREST di connessione', () => {
    expect(isTransientSupabaseFailure({ code: 'PGRST000' })).toBe(true)
  })

  it('non ritenta una riga admin assente', () => {
    expect(isTransientSupabaseFailure({ code: 'PGRST116' })).toBe(false)
  })
})
