import { isAuthRetryableFetchError } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

const TRANSIENT_RETRY_DELAYS_MS = [300, 900] as const
const TRANSIENT_POSTGREST_CODES = new Set(['PGRST000', 'PGRST001', 'PGRST002', 'PGRST003'])

interface SupabaseOperationResult {
  error: unknown
  status?: number
}

function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined

  const status = 'status' in error ? error.status : 'statusCode' in error ? error.statusCode : undefined
  const parsedStatus = typeof status === 'string' ? Number(status) : status
  return typeof parsedStatus === 'number' && Number.isFinite(parsedStatus) ? parsedStatus : undefined
}

export function isTransientSupabaseFailure(error: unknown, responseStatus?: number): boolean {
  if (!error) return false
  if (isAuthRetryableFetchError(error)) return true

  const status = responseStatus ?? getErrorStatus(error)
  if (
    status === 0
    || status === 408
    || status === 429
    || (status !== undefined && status >= 500 && status <= 599)
  ) {
    return true
  }

  if (typeof error === 'object' && 'code' in error) {
    return TRANSIENT_POSTGREST_CODES.has(String(error.code).toUpperCase())
  }

  return false
}

export async function retryTransientSupabaseOperation<T extends SupabaseOperationResult>(
  label: string,
  operation: () => PromiseLike<T>,
  delaysMs: readonly number[] = TRANSIENT_RETRY_DELAYS_MS,
): Promise<T> {
  for (let attemptIndex = 0; ; attemptIndex += 1) {
    const result = await operation()

    if (!isTransientSupabaseFailure(result.error, result.status) || attemptIndex >= delaysMs.length) {
      return result
    }

    const retryNumber = attemptIndex + 1
    logger.warn(
      `[${label}] guasto temporaneo: tentativo di recupero ${retryNumber}/${delaysMs.length}`,
      result.error,
    )
    await new Promise((resolve) => window.setTimeout(resolve, delaysMs[attemptIndex]))
  }
}
