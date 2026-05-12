import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenantContext } from '@/contexts/TenantContext'
import { supabase } from '@/lib/supabase'
import { normalizeCustomerEmail } from '@/lib/customerEmail'
import { logger } from '@/lib/logger'
import { toast } from 'react-toastify'
import { CRM_QUERY_KEY } from './useCustomers'

export interface CreateCustomerInput {
  name: string
  email: string
  phone?: string
  notes?: string
}

export interface UpdateCustomerInput {
  /** Riga `customers`; null se profilo solo da booking (crea/aggiorna synced). */
  customerRowId: string | null
  previousEmail: string
  name: string
  email: string
  phone?: string | null
  notes?: string | null
}

async function bookingIdsMatchingEmail(tenantId: string, emailKey: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('booking_requests')
    .select('id,client_email')
    .eq('tenant_id', tenantId)
    .neq('status', 'deleted')

  if (error) throw new Error(error.message)
  const rows = data ?? []
  return rows
    .filter((r) => normalizeCustomerEmail(r.client_email) === emailKey)
    .map((r) => r.id)
}

export function useCreateCustomer() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateCustomerInput) => {
      if (!tenantId) throw new Error('Tenant mancante')
      const email = normalizeCustomerEmail(input.email)
      if (!email) throw new Error('Email non valida')

      const { data, error } = await supabase
        .from('customers')
        .insert({
          tenant_id: tenantId,
          name: input.name.trim(),
          email,
          phone: input.phone?.trim() || null,
          notes: input.notes?.trim() || null,
          source: 'manual',
        })
        .select('id')
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [CRM_QUERY_KEY, tenantId] })
      toast.success('Cliente creato')
    },
    onError: (e: Error) => {
      logger.error('[useCreateCustomer]', e)
      toast.error(e.message || 'Errore creazione cliente')
    },
  })
}

export function useUpdateCustomer() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateCustomerInput) => {
      if (!tenantId) throw new Error('Tenant mancante')
      const nextEmail = normalizeCustomerEmail(input.email)
      if (!nextEmail) throw new Error('Email non valida')
      const prevKey = normalizeCustomerEmail(input.previousEmail)
      if (!prevKey) throw new Error('Email precedente non valida')

      let rowId = input.customerRowId

      if (!rowId) {
        const { data: existing, error: selErr } = await supabase
          .from('customers')
          .select('id')
          .eq('tenant_id', tenantId)
          .eq('email', prevKey)
          .maybeSingle()

        if (selErr) throw new Error(selErr.message)
        rowId = existing?.id ?? null
      }

      if (!rowId) {
        const { data: inserted, error: insErr } = await supabase
          .from('customers')
          .insert({
            tenant_id: tenantId,
            name: input.name.trim(),
            email: prevKey,
            phone: input.phone?.trim() || null,
            notes: input.notes?.trim() || null,
            source: 'synced',
          })
          .select('id')
          .single()

        if (insErr) throw new Error(insErr.message)
        rowId = inserted.id
      }

      const { error: updErr } = await supabase
        .from('customers')
        .update({
          name: input.name.trim(),
          email: nextEmail,
          phone: input.phone?.trim() || null,
          notes: input.notes?.trim() || null,
        })
        .eq('id', rowId)
        .eq('tenant_id', tenantId)

      if (updErr) {
        const msg =
          updErr.code === '23505'
            ? 'Email già registrata per un altro cliente'
            : updErr.message
        throw new Error(msg)
      }

      if (nextEmail !== prevKey) {
        const ids = await bookingIdsMatchingEmail(tenantId, prevKey)
        if (ids.length > 0) {
          const { error: patchErr } = await supabase
            .from('booking_requests')
            .update({
              client_email: nextEmail,
              client_name: input.name.trim(),
              client_phone: input.phone?.trim() || null,
            })
            .in('id', ids)

          if (patchErr) throw new Error(patchErr.message)
        }
      } else {
        const ids = await bookingIdsMatchingEmail(tenantId, prevKey)
        if (ids.length > 0) {
          const { error: patchErr } = await supabase
            .from('booking_requests')
            .update({
              client_name: input.name.trim(),
              client_phone: input.phone?.trim() || null,
            })
            .in('id', ids)

          if (patchErr) throw new Error(patchErr.message)
        }
      }

      return { id: rowId }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [CRM_QUERY_KEY, tenantId] })
      void queryClient.invalidateQueries({ queryKey: ['bookings'], refetchType: 'all' })
      void queryClient.invalidateQueries({ queryKey: ['bookings', 'pending'], refetchType: 'all' })
      void queryClient.invalidateQueries({ queryKey: ['bookings', 'accepted'], refetchType: 'all' })
      void queryClient.invalidateQueries({ queryKey: ['bookings', 'stats'], refetchType: 'all' })
      toast.success('Cliente aggiornato')
    },
    onError: (e: Error) => {
      logger.error('[useUpdateCustomer]', e)
      toast.error(e.message || 'Errore aggiornamento cliente')
    },
  })
}

export function useDeleteCustomer() {
  const { tenantId } = useTenantContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (customerRowId: string) => {
      if (!tenantId) throw new Error('Tenant mancante')
      const { error } = await supabase.from('customers').delete().eq('id', customerRowId).eq('tenant_id', tenantId)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [CRM_QUERY_KEY, tenantId] })
      toast.success('Profilo manuale rimosso')
    },
    onError: (e: Error) => {
      logger.error('[useDeleteCustomer]', e)
      toast.error(e.message || 'Errore eliminazione')
    },
  })
}
