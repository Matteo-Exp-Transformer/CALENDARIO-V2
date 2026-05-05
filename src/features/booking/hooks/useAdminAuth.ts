import { useState, useEffect } from 'react'
import { supabase, handleSupabaseError } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useTenantContext } from '@/contexts/TenantContext'

const AUTH_REVOKED_REASON_KEY = 'auth_revoked_reason'
const SUBSCRIPTION_INACTIVE_REASON = 'subscription_inactive'

interface AdminAuthUser {
  id: string
  email: string
  name?: string
  tenantId?: string
}

interface UseAdminAuthReturn {
  user: AdminAuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [user, setUser] = useState<AdminAuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { setTenantFromAdmin, clearTenant } = useTenantContext()

  // Check session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const setSubscriptionRevokedReason = () => {
    sessionStorage.setItem(AUTH_REVOKED_REASON_KEY, SUBSCRIPTION_INACTIVE_REASON)
  }

  const ensureActiveSubscription = async (tenantId?: string): Promise<boolean> => {
    if (!tenantId) {
      return false
    }

    const { data: organization, error } = await (supabase
      .from('organizations') as any)
      .select('is_active')
      .eq('id', tenantId)
      .single()

    if (error || !organization || !organization.is_active) {
      await supabase.auth.signOut()
      setSubscriptionRevokedReason()
      return false
    }

    return true
  }

  const checkSession = async () => {
    try {
      // Check if user is authenticated with Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session check error:', sessionError)
        setUser(null)
        setIsLoading(false)
        return
      }

      if (!session || !session.user || !session.user.email) {
        setUser(null)
        setIsLoading(false)
        return
      }

      // Verify user exists in admin_users table
      const { data: adminUser, error: adminError } = await (supabase
        .from('admin_users') as any)
        .select('name, tenant_id')
        .eq('email', session.user.email)
        .single()

      if (adminError || !adminUser) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const hasActiveSubscription = await ensureActiveSubscription((adminUser as any).tenant_id)
      if (!hasActiveSubscription) {
        clearTenant()
        setUser(null)
        setIsLoading(false)
        return
      }

      // Resolve tenant from admin email
      await setTenantFromAdmin(session.user.email)

      setUser({
        id: session.user.id,
        email: session.user.email,
        name: (adminUser as any).name || undefined
      })

    } catch (error) {
      console.error('Error checking session:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        return {
          success: false,
          error: handleSupabaseError(authError)
        }
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Errore durante il login. Riprova più tardi.'
        }
      }

      // Verify user exists in admin_users table
      const { data: adminUser, error: adminError } = await (supabase
        .from('admin_users') as any)
        .select('name, tenant_id')
        .eq('email', authData.user.email || '')
        .single()

      if (adminError || !adminUser) {
        await supabase.auth.signOut()
        return {
          success: false,
          error: 'Utente non autorizzato'
        }
      }

      const hasActiveSubscription = await ensureActiveSubscription((adminUser as any).tenant_id)
      if (!hasActiveSubscription) {
        clearTenant()
        setUser(null)
        return {
          success: false,
          error: 'Abbonamento non attivo. Contatta il supporto.'
        }
      }

      // Resolve tenant from admin email
      await setTenantFromAdmin(authData.user.email || '')

      setUser({
        id: authData.user.id,
        email: authData.user.email || '',
        name: (adminUser as any).name || undefined
      })

      return { success: true }
    } catch (error) {
      console.error('Login exception:', error)
      return {
        success: false,
        error: handleSupabaseError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut()

      // Clear user and tenant state
      setUser(null)
      clearTenant()

      // Navigate to login
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still navigate to login even if there's an error
      navigate('/login')
    }
  }

  return { user, isLoading, login, logout }
}
