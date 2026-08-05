import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase, handleSupabaseError, isInvalidStoredRefreshTokenError } from '@/lib/supabase'
import { useTenantContext } from '@/contexts/TenantContext'
import { logger } from '@/lib/logger'
import { isTransientSupabaseFailure, retryTransientSupabaseOperation } from '@/lib/supabaseRetry'
import type { Tables } from '@/types/database'

const AUTH_REVOKED_REASON_KEY = 'auth_revoked_reason'
const SUBSCRIPTION_INACTIVE_REASON = 'subscription_inactive'

interface AdminAuthUser {
  id: string
  email: string
  name?: string
  tenantId?: string
}

interface AdminAuthContextValue {
  user: AdminAuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)
type AdminUserAuthRow = Pick<Tables<'admin_users'>, 'name' | 'tenant_id'>

const isPublicTenantRoutePath = (pathname: string): boolean =>
  pathname === '/prenota' ||
  pathname.startsWith('/prenota/') ||
  pathname === '/menu' ||
  pathname.startsWith('/menu/')

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminAuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { setTenantFromAdmin, clearTenant } = useTenantContext()

  const setSubscriptionRevokedReason = () => {
    sessionStorage.setItem(AUTH_REVOKED_REASON_KEY, SUBSCRIPTION_INACTIVE_REASON)
  }

  const ensureActiveSubscription = async (tenantId?: string): Promise<boolean> => {
    if (!tenantId) {
      return false
    }

    const { data: organization, error } = await retryTransientSupabaseOperation(
      'checkSession: organizations',
      () => supabase
        .from('organizations')
        .select('is_active')
        .eq('id', tenantId)
        .single()
        .retry(false),
    )

    if (error || !organization || !organization.is_active) {
      await supabase.auth.signOut()
      setSubscriptionRevokedReason()
      return false
    }

    return true
  }

  const checkSession = async () => {
    try {
      setIsLoading(true)
      const isPublicTenantRoute = isPublicTenantRoutePath(location.pathname)
      const { data: { session }, error: sessionError } = await retryTransientSupabaseOperation(
        'checkSession: sessione',
        () => supabase.auth.getSession(),
      )

      if (sessionError) {
        if (isInvalidStoredRefreshTokenError(sessionError)) {
          await supabase.auth.signOut({ scope: 'local' })
        } else {
          logger.error('Session check error:', sessionError)
          if (isTransientSupabaseFailure(sessionError)) {
            await supabase.auth.signOut()
            if (!isPublicTenantRoute) {
              clearTenant()
            }
          }
        }
        setUser(null)
        setIsLoading(false)
        return
      }

      if (!session || !session.user || !session.user.email) {
        setUser(null)
        setIsLoading(false)
        return
      }
      const sessionEmail = session.user.email

      const { data: adminUser, error: adminError } = await retryTransientSupabaseOperation(
        'checkSession: admin_users',
        () => supabase
          .from('admin_users')
          .select('name, tenant_id')
          .eq('email', sessionEmail)
          .single<AdminUserAuthRow>()
          .retry(false),
      )

      if (adminError || !adminUser) {
        await supabase.auth.signOut()
        if (!isPublicTenantRoute) {
          clearTenant()
        }
        setUser(null)
        setIsLoading(false)
        return
      }

      const hasActiveSubscription = await ensureActiveSubscription(adminUser.tenant_id)
      if (!hasActiveSubscription) {
        if (!isPublicTenantRoute) {
          clearTenant()
        }
        setUser(null)
        setIsLoading(false)
        return
      }

      if (!isPublicTenantRoute) {
        // FU-AUTH-3: se la RPC tenant fallisce, mai lasciare un admin loggato con
        // tenant nullo → signOut + pulizia, l'utente riprova il login.
        const tenantResolved = await setTenantFromAdmin(sessionEmail)
        if (!tenantResolved) {
          logger.error('[checkSession] risoluzione tenant admin fallita: signOut di sicurezza')
          await supabase.auth.signOut()
          clearTenant()
          setUser(null)
          setIsLoading(false)
          return
        }
      }

      setUser({
        id: session.user.id,
        email: session.user.email,
        name: adminUser.name || undefined,
      })
    } catch (error) {
      logger.error('Error checking session:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void checkSession()
  }, [location.pathname])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        return {
          success: false,
          error: handleSupabaseError(authError),
        }
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Errore durante il login. Riprova più tardi.',
        }
      }

      const { data: adminUser, error: adminError } = await retryTransientSupabaseOperation(
        'login: admin_users',
        () => supabase
          .from('admin_users')
          .select('name, tenant_id')
          .eq('email', authData.user.email || '')
          .single<AdminUserAuthRow>()
          .retry(false),
      )

      if (adminError || !adminUser) {
        await supabase.auth.signOut()
        return {
          success: false,
          error: 'Utente non autorizzato',
        }
      }

      const hasActiveSubscription = await ensureActiveSubscription(adminUser.tenant_id)
      if (!hasActiveSubscription) {
        clearTenant()
        setUser(null)
        return {
          success: false,
          error: 'Abbonamento non attivo. Contatta il supporto.',
        }
      }

      // FU-AUTH-3: tenant non risolto → non completare il login con tenant nullo.
      const tenantResolved = await setTenantFromAdmin(authData.user.email || '')
      if (!tenantResolved) {
        await supabase.auth.signOut()
        clearTenant()
        setUser(null)
        return {
          success: false,
          error: 'Impossibile caricare i dati del locale. Riprova o contatta il supporto.',
        }
      }

      setUser({
        id: authData.user.id,
        email: authData.user.email || '',
        name: adminUser.name || undefined,
      })

      return { success: true }
    } catch (error) {
      logger.error('Login exception:', error)
      return {
        success: false,
        error: handleSupabaseError(error),
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      clearTenant()
      navigate('/login')
    } catch (error) {
      logger.error('Logout error:', error)
      navigate('/login')
    }
  }

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuth = (): AdminAuthContextValue => {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return ctx
}
