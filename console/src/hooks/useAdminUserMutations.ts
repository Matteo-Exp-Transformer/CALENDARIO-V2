/**
 * Hook per le mutazioni CRUD sugli utenti admin (F11 — REQ-001 scrittura).
 *
 * COSA FA:
 *   Espone tre operazioni — createUser, updateUser, deleteUser — che chiamano
 *   callConsoleAdmin con le azioni F10: create_admin_user, update_admin_user,
 *   delete_admin_user.
 *   Ogni operazione ha il proprio stato (loading/success/error) per permettere
 *   feedback indipendenti nella UI (es. spinner diversi su modale crea vs elimina).
 *
 * PERCHÉ UN HOOK UNICO:
 *   Sul modello di useEditionChange e useSettingSave: isola la logica di chiamata
 *   Edge dal componente, evita useState duplicati in UserList, facilita il test.
 *
 * DEC-037: le azioni valgono su TUTTE le aziende del progetto TEST, non solo i
 *   sandbox. Il gate di sicurezza è lato server (allowlist + JWT).
 *
 * DEC-038: delete_admin_user richiede confirm_email — il server la rivalida.
 *   Questo hook accetta confirm_email come parametro e lo passa al server,
 *   ma non esegue validazione client-side dell'uguaglianza (è il modale che
 *   blocca il pulsante finché l'utente non ha riscritto l'email esatta).
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

export interface AdminUserMutationsState {
  create: MutationState
  update: MutationState
  delete: MutationState
}

// Parametri esposti dalla UI per ogni operazione.

export interface CreateUserParams {
  email: string
  password: string
  name?: string
  tenant_id: string
}

export interface UpdateUserParams {
  admin_user_id: string
  name?: string
  tenant_id?: string
  email?: string
}

export interface DeleteUserParams {
  admin_user_id: string
  /** Deve corrispondere esattamente all'email del record — rivalidato lato server. */
  confirm_email: string
}

export interface UseAdminUserMutationsReturn {
  state: AdminUserMutationsState
  createUser: (params: CreateUserParams) => Promise<boolean>
  updateUser: (params: UpdateUserParams) => Promise<boolean>
  deleteUser: (params: DeleteUserParams) => Promise<boolean>
  resetCreate: () => void
  resetUpdate: () => void
  resetDelete: () => void
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAdminUserMutations(): UseAdminUserMutationsReturn {
  const [createState, setCreateState] = useState<MutationState>({ status: 'idle' })
  const [updateState, setUpdateState] = useState<MutationState>({ status: 'idle' })
  const [deleteState, setDeleteState] = useState<MutationState>({ status: 'idle' })

  // Crea utente admin: crea Auth user + riga admin_users.
  const createUser = useCallback(async (params: CreateUserParams): Promise<boolean> => {
    if (createState.status === 'loading') return false

    setCreateState({ status: 'loading' })

    const result = await callConsoleAdmin({
      action: 'create_admin_user',
      email: params.email,
      password: params.password,
      name: params.name,
      tenant_id: params.tenant_id,
    })

    if (result.error) {
      setCreateState({ status: 'error', message: result.error.error })
      return false
    }

    setCreateState({ status: 'success' })
    return true
  }, [createState.status])

  // Aggiorna name/tenant_id/email di un admin esistente.
  const updateUser = useCallback(async (params: UpdateUserParams): Promise<boolean> => {
    if (updateState.status === 'loading') return false

    setUpdateState({ status: 'loading' })

    const result = await callConsoleAdmin({
      action: 'update_admin_user',
      admin_user_id: params.admin_user_id,
      name: params.name,
      tenant_id: params.tenant_id,
      email: params.email,
    })

    if (result.error) {
      setUpdateState({ status: 'error', message: result.error.error })
      return false
    }

    setUpdateState({ status: 'success' })
    return true
  }, [updateState.status])

  // Elimina utente admin (hard-delete: rimuove admin_users + Auth user).
  // DEC-038: confirm_email è rivalidato lato server prima della cancellazione.
  const deleteUser = useCallback(async (params: DeleteUserParams): Promise<boolean> => {
    if (deleteState.status === 'loading') return false

    setDeleteState({ status: 'loading' })

    const result = await callConsoleAdmin({
      action: 'delete_admin_user',
      admin_user_id: params.admin_user_id,
      confirm_email: params.confirm_email,
    })

    if (result.error) {
      setDeleteState({ status: 'error', message: result.error.error })
      return false
    }

    setDeleteState({ status: 'success' })
    return true
  }, [deleteState.status])

  const resetCreate = useCallback(() => setCreateState({ status: 'idle' }), [])
  const resetUpdate = useCallback(() => setUpdateState({ status: 'idle' }), [])
  const resetDelete = useCallback(() => setDeleteState({ status: 'idle' }), [])

  return {
    state: { create: createState, update: updateState, delete: deleteState },
    createUser,
    updateUser,
    deleteUser,
    resetCreate,
    resetUpdate,
    resetDelete,
  }
}
