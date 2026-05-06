import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useTenantContext } from '@/contexts/TenantContext'
import { handleSupabaseError, supabase } from '@/lib/supabase'

export interface MenuCategoryRecord {
  id: string
  tenant_id: string
  key: string
  label: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MenuCategoryInput {
  key: string
  label: string
  sort_order?: number
}

interface MenuCategoryUpdateInput {
  id: string
  key: string
  previousKey: string
  label: string
}

const DUPLICATE_CATEGORY_MSG = 'Esiste già una categoria con questo nome'

function getMenuCategoryMutationError(error: unknown): string {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code: string }).code === '23505'
  ) {
    return DUPLICATE_CATEGORY_MSG
  }
  return handleSupabaseError(error)
}

function isMenuCategoriesMissingError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const pgError = error as { code?: string; status?: number; message?: string }
  return (
    pgError.code === '42P01' ||
    pgError.code === 'PGRST205' ||
    pgError.status === 404 ||
    (typeof pgError.message === 'string' && pgError.message.toLowerCase().includes('menu_categories'))
  )
}

export const useMenuCategories = () => {
  const { tenantId } = useTenantContext()

  return useQuery({
    queryKey: ['menu-categories', tenantId],
    queryFn: async () => {
      const { data, error } = await ((supabase as any).from('menu_categories') as any)
        .select('*')
        .eq('tenant_id', tenantId)
        .order('sort_order', { ascending: true })
        .order('label', { ascending: true })

      if (error) {
        if (isMenuCategoriesMissingError(error)) {
          return []
        }
        throw new Error(handleSupabaseError(error))
      }

      return (data ?? []) as MenuCategoryRecord[]
    },
    enabled: !!tenantId,
    retry: (failureCount, error) => {
      if (isMenuCategoriesMissingError(error)) return false
      return failureCount < 3
    },
  })
}

export const useCreateMenuCategory = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (category: MenuCategoryInput) => {
      const { data, error } = await (((supabase as any)
        .from('menu_categories') as any) as any)
        .insert({
          tenant_id: tenantId,
          key: category.key,
          label: category.label,
          sort_order: category.sort_order ?? 999
        })
        .select()
        .single()

      if (error) {
        throw new Error(getMenuCategoryMutationError(error))
      }

      return data as MenuCategoryRecord
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] })
      toast.success('Categoria aggiunta con successo')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Errore nell\'aggiunta della categoria')
    }
  })
}

export const useUpdateMenuCategory = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async ({ id, key, previousKey, label }: MenuCategoryUpdateInput) => {
      const now = new Date().toISOString()
      const supabaseAny = supabase as any

      const { data, error } = await ((supabaseAny.from('menu_categories') as any) as any)
        .update({
          key,
          label,
          updated_at: now
        })
        .eq('id', id)
        .eq('tenant_id', tenantId!)
        .select()
        .single()

      if (error) {
        throw new Error(getMenuCategoryMutationError(error))
      }

      if (previousKey !== key) {
        const { error: menuItemsError } = await ((supabaseAny.from('menu_items') as any) as any)
          .update({
            category: key,
            updated_at: now
          })
          .eq('tenant_id', tenantId!)
          .eq('category', previousKey)

        if (menuItemsError) {
          throw new Error(handleSupabaseError(menuItemsError))
        }
      }

      return data as MenuCategoryRecord
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] })
      toast.success('Categoria aggiornata con successo')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Errore nell\'aggiornamento della categoria')
    }
  })
}

export const useDeleteMenuCategory = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await ((supabase as any)
        .from('menu_categories') as any)
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId!)

      if (error) {
        throw new Error(handleSupabaseError(error))
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] })
      toast.success('Categoria eliminata con successo')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Errore nell\'eliminazione della categoria')
    }
  })
}
