import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase, handleSupabaseError } from '@/lib/supabase'
import { supabasePublic } from '@/lib/supabasePublic'
import { toast } from 'react-toastify'
import { useTenantContext } from '@/contexts/TenantContext'
import type { MenuQrCode, MenuQrCodeInput } from '@/types/menu'

export const MENU_QR_CODES_QUERY_KEY = 'menu-qr-codes'

// ── Admin: lettura tutti i QR del tenant ──────────────────────────────────────

export const useMenuQrCodes = () => {
  const { tenantId } = useTenantContext()

  return useQuery({
    queryKey: [MENU_QR_CODES_QUERY_KEY, tenantId],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('menu_qr_codes') as any)
        .select('*')
        .eq('tenant_id', tenantId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (error) throw new Error(handleSupabaseError(error))
      return data as MenuQrCode[]
    },
    enabled: !!tenantId,
  })
}

// ── Admin: crea nuovo QR ──────────────────────────────────────────────────────

export const useCreateMenuQrCode = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async ({ shortCode, input }: { shortCode: string; input: MenuQrCodeInput }) => {
      const { data, error } = await (supabase
        .from('menu_qr_codes') as any)
        .insert({
          tenant_id: tenantId,
          short_code: shortCode,
          name: input.name,
          content_type: input.content_type,
          category_filter: input.category_filter ?? null,
          preset_ids: input.preset_ids ?? null,
          is_active: input.is_active ?? true,
          sort_order: input.sort_order ?? 0,
        })
        .select()
        .single()

      if (error) throw new Error(handleSupabaseError(error))
      return data as MenuQrCode
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MENU_QR_CODES_QUERY_KEY] })
      toast.success('QR creato')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Errore nella creazione del QR')
    },
  })
}

// ── Admin: aggiorna QR esistente ──────────────────────────────────────────────

export const useUpdateMenuQrCode = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<MenuQrCodeInput> }) => {
      const { data, error } = await (supabase
        .from('menu_qr_codes') as any)
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('tenant_id', tenantId!)
        .select()
        .single()

      if (error) throw new Error(handleSupabaseError(error))
      return data as MenuQrCode
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MENU_QR_CODES_QUERY_KEY] })
      toast.success('QR aggiornato')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Errore nella modifica del QR')
    },
  })
}

// ── Admin: elimina QR ─────────────────────────────────────────────────────────

export const useDeleteMenuQrCode = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase
        .from('menu_qr_codes') as any)
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId!)

      if (error) throw new Error(handleSupabaseError(error))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MENU_QR_CODES_QUERY_KEY] })
      toast.success('QR eliminato')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Errore nell\'eliminazione del QR')
    },
  })
}

// ── Pubblico: risolvi short_code → MenuQrCode ─────────────────────────────────

export const usePublicMenuQr = (tenantId: string | null, shortCode: string | null) => {
  return useQuery({
    queryKey: ['public-menu-qr', tenantId, shortCode],
    queryFn: async () => {
      const { data, error } = await (supabasePublic
        .from('menu_qr_codes') as any)
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('short_code', shortCode)
        .eq('is_active', true)
        .single()

      if (error) throw new Error(handleSupabaseError(error))
      return data as MenuQrCode
    },
    enabled: !!tenantId && !!shortCode,
  })
}

// ── Pubblico: primo QR attivo del tenant (fallback route /menu/:slug) ─────────

export const usePublicDefaultMenuQr = (tenantId: string | null) => {
  return useQuery({
    queryKey: ['public-menu-qr-default', tenantId],
    queryFn: async () => {
      const { data, error } = await (supabasePublic
        .from('menu_qr_codes') as any)
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(1)
        .single()

      if (error) return null
      return data as MenuQrCode
    },
    enabled: !!tenantId,
  })
}
