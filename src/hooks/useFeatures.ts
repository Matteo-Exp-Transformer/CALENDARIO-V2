import { useMemo } from 'react'
import { useTenantContext } from '@/contexts/TenantContext'
import { buildFeatures } from '@/config/features'
import type { FeatureFlags } from '@/config/features'

export const useFeatures = (): FeatureFlags => {
  const { edition, qrMenuEnabled } = useTenantContext()
  return useMemo(() => buildFeatures(edition, qrMenuEnabled), [edition, qrMenuEnabled])
}
