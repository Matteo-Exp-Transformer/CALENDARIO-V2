import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { supabasePublic } from '../lib/supabasePublic'
import type { TenantEdition } from '@/types/edition'

interface TenantContextType {
  tenantId: string | null
  tenantSlug: string | null
  organizationName: string | null
  edition: TenantEdition
  isLoading: boolean
  setTenantFromSlug: (slug: string) => Promise<void>
  setTenantFromAdmin: (email: string) => Promise<void>
  clearTenant: () => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [tenantSlug, setTenantSlug] = useState<string | null>(null)
  const [organizationName, setOrganizationName] = useState<string | null>(null)
  const [edition, setEdition] = useState<TenantEdition>('pro')
  const [isLoading, setIsLoading] = useState(false)

  /** Risolve il tenant dalla slug (usato dalla pagina pubblica /prenota/:slug) */
  const setTenantFromSlug = useCallback(async (slug: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await (supabasePublic
        .from('organizations') as any)
        .select('id, name, slug')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        console.error('Organizzazione non trovata per slug:', slug, error)
        setTenantId(null)
        setTenantSlug(null)
        setOrganizationName(null)
        return
      }

      setTenantId(data.id)
      setTenantSlug(data.slug)
      setOrganizationName(data.name)
    } catch (err) {
      console.error('Errore setTenantFromSlug:', err)
      setTenantId(null)
      setTenantSlug(null)
      setOrganizationName(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /** Risolve il tenant dall'email admin (usato dopo login) */
  const setTenantFromAdmin = useCallback(async (email: string) => {
    setIsLoading(true)
    try {
      const { data: adminData, error } = await (supabasePublic
        .rpc as any)('check_admin_email', { check_email: email })

      if (error || !adminData || (adminData as any[]).length === 0) {
        console.error('Tenant non trovato per email admin:', email, error)
        setTenantId(null)
        setTenantSlug(null)
        setOrganizationName(null)
        return
      }

      const adminInfo = (adminData as any[])[0]
      setTenantId(adminInfo.tenant_id as string)
      setTenantSlug(adminInfo.slug || null)
      setOrganizationName(adminInfo.org_name || null)
      setEdition((adminInfo.edition as TenantEdition) || 'pro')
    } catch (err) {
      console.error('Errore setTenantFromAdmin:', err)
      setTenantId(null)
      setTenantSlug(null)
      setOrganizationName(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearTenant = useCallback(() => {
    setTenantId(null)
    setTenantSlug(null)
    setOrganizationName(null)
    setEdition('classic')
  }, [])

  return (
    <TenantContext.Provider
      value={{
        tenantId,
        tenantSlug,
        organizationName,
        edition,
        isLoading,
        setTenantFromSlug,
        setTenantFromAdmin,
        clearTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export const useTenantContext = () => {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenantContext deve essere usato dentro TenantProvider')
  }
  return context
}
