import { useMemo } from 'react'
import { useTenantContext } from '@/contexts/TenantContext'
import { buildFeatures } from '@/config/features'
import type { FeatureFlags } from '@/config/features'

export const useFeatures = (): FeatureFlags => {
  const { edition } = useTenantContext()
  return useMemo(() => buildFeatures(edition), [edition])
}
