/**
 * Hook per le mutazioni CRUD sui tenant (aziende) (F12 — REQ-003).
 *
 * COSA FA:
 *   Espone due operazioni — createTenant, deleteTenant — che chiamano
 *   callConsoleAdmin con le azioni F10: create_tenant, delete_tenant.
 *   Ogni operazione ha il proprio stato (loading/success/error) per permettere
 *   feedback indipendenti nella UI (modale crea vs modale elimina).
 *
 * MODELLATO SU: useAdminUserMutations (stesso pattern, stessa struttura stato).
 *
 * DEC-037: le azioni valgono su TUTTE le aziende del progetto TEST, non solo i
 *   sandbox. Il gate di sicurezza è lato server (allowlist + JWT).
 *
 * DEC-038: delete_tenant richiede confirm_name — il server la rivalida
 *   case-sensitive con trim() (ma senza toLowerCase). Il gate client segue
 *   lo stesso comportamento per coerenza. Vedi nota in DeleteTenantModal.
 *
 * DEC-041: create_tenant accetta un admin opzionale (email+password+name);
 *   se passato, il server crea auth user + riga admin_users in un unico passaggio.
 *
 * GESTIONE FUNCTION NON DEPLOYATA:
 *   Se VITE_CONSOLE_ADMIN_FUNCTION_URL non è impostata, callConsoleAdmin
 *   restituisce errore esplicito. Lo stato diventa 'error' con quel messaggio.
 */

import { useState, useCallback } from 'react'
import { callConsoleAdmin } from '@console/lib/consoleAdminClient'

// ---------------------------------------------------------------------------
// Tipi di stato per ogni operazione
// ---------------------------------------------------------------------------

type MutationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export interface TenantMutationsState {
  create: MutationState
  delete: MutationState
}

// Parametri esposti dalla UI per ogni operazione.

export interface CreateTenantParams {
  name: string
  slug: string
  edition: 'classic' | 'pro' | 'enterprise'
  plan?: string
  is_active?: boolean
  /** Crea anche un admin (DEC-041): email + password + nome opzionale. */
  admin?: {
    email: string
    password: string
    name?: string
  }
}

export interface DeleteTenantParams {
  tenant_id: string
  /**
   * Deve corrispondere esattamente al nome dell'organizzazione (trim, case-sensitive).
   * Rivalidato lato server. Vedi nota DEC-038 in DeleteTenantModal.
   */
  confirm_name: string
}

export interface UseTenantMutationsReturn {
  state: TenantMutationsState
  createTenant: (params: CreateTenantParams) => Promise<boolean>
  deleteTenant: (params: DeleteTenantParams) => Promise<boolean>
  resetCreate: () => void
  resetDelete: () => void
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTenantMutations(): UseTenantMutationsReturn {
  const [createState, setCreateState] = useState<MutationState>({ status: 'idle' })
  const [deleteState, setDeleteState] = useState<MutationState>({ status: 'idle' })

  // Crea un tenant (organizzazione + admin opzionale in un passaggio — DEC-041).
  const createTenant = useCallback(async (params: CreateTenantParams): Promise<boolean> => {
    if (createState.status === 'loading') return false

    setCreateState({ status: 'loading' })

    const result = await callConsoleAdmin({
      action: 'create_tenant',
      name: params.name,
      slug: params.slug,
      edition: params.edition,
      plan: params.plan,
      is_active: params.is_active,
      admin: params.admin,
    })

    if (result.error) {
      setCreateState({ status: 'error', message: result.error.error })
      return false
    }

    setCreateState({ status: 'success' })
    return true
  }, [createState.status])

  // Elimina un tenant (hard-delete protetto — DEC-038).
  // confirm_name è rivalidato lato server prima della cancellazione.
  const deleteTenant = useCallback(async (params: DeleteTenantParams): Promise<boolean> => {
    if (deleteState.status === 'loading') return false

    setDeleteState({ status: 'loading' })

    const result = await callConsoleAdmin({
      action: 'delete_tenant',
      tenant_id: params.tenant_id,
      confirm_name: params.confirm_name,
    })

    if (result.error) {
      setDeleteState({ status: 'error', message: result.error.error })
      return false
    }

    setDeleteState({ status: 'success' })
    return true
  }, [deleteState.status])

  const resetCreate = useCallback(() => setCreateState({ status: 'idle' }), [])
  const resetDelete = useCallback(() => setDeleteState({ status: 'idle' }), [])

  return {
    state: { create: createState, delete: deleteState },
    createTenant,
    deleteTenant,
    resetCreate,
    resetDelete,
  }
}
