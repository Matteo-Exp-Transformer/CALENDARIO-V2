import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { supabasePublic } from '../lib/supabasePublic'

interface TenantContextType {
  tenantId: string | null
  tenantSlug: string | null
  organizationName: string | null
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
  const [isLoading, setIsLoading] = useState(false)

  /** Risolve il tenant dalla slug (usato dalla pagina pubblica /prenota/:slug) */
  const setTenantFromSlug = useCallback(async (slug: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await (supabasePublic
        .from('organizations') as any)
        .select('id, name, slug')
        .eq('slug', slug)
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
      const resolvedTenantId = adminInfo.tenant_id as string

      const { data: orgData } = await (supabasePublic
        .from('organizations') as any)
        .select('slug, name')
        .eq('id', resolvedTenantId)
        .single()

      setTenantId(resolvedTenantId)
      setTenantSlug(orgData?.slug || null)
      setOrganizationName(orgData?.name || null)

      // Imposta la variabile di sessione RLS
      await (supabase.rpc as any)('set_tenant', { tid: resolvedTenantId })
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
  }, [])

  return (
    <TenantContext.Provider
      value={{
        tenantId,
        tenantSlug,
        organizationName,
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
