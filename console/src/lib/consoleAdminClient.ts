/**
 * Helper client per la Edge Function `console-admin`.
 *
 * COSA FA:
 *   Chiama la Edge Function passando il JWT della sessione corrente nell'header
 *   Authorization. La function lato server verifica il JWT, controlla l'email
 *   nella allowlist server-side, e usa la service role per scrivere nel DB.
 *
 * COSA NON FA:
 *   - Non usa direttamente la service role (non esiste nel browser).
 *   - Non gestisce le LETTURE: quelle restano col client pubblico (supabaseClient.ts).
 *
 * USO:
 *   import { callConsoleAdmin } from '@console/lib/consoleAdminClient'
 *   const result = await callConsoleAdmin({
 *     action: 'update_edition',
 *     tenant_id: '4c694cb8-66af-478f-afd2-8719f07d64b4',
 *     edition: 'pro',
 *   })
 *
 * CONFIGURAZIONE:
 *   VITE_CONSOLE_ADMIN_FUNCTION_URL deve puntare all'URL della Edge Function deployata.
 *   Esempio: https://docnnernvp.supabase.co/functions/v1/console-admin
 *   Vedi PLAN-DB-003 per come ricavare l'URL e deployare la function.
 *
 * NOTE F10 (DEC-037):
 *   Il guard sandbox è stato rimosso lato server: le azioni valgono su qualunque tenant
 *   del progetto TEST. La rete di sicurezza è gate allowlist + conferme forti per le
 *   azioni distruttive (delete_admin_user / delete_tenant).
 */

import { supabase } from '@console/lib/supabaseClient'

// ---------------------------------------------------------------------------
// Tipi delle azioni (specchio del server — mantenerli allineati)
// ---------------------------------------------------------------------------

export interface ActionUpdateEdition {
  action: 'update_edition'
  tenant_id: string
  edition: 'classic' | 'pro' | 'enterprise'
}

export interface ActionUpsertTenantFeature {
  action: 'upsert_tenant_feature'
  tenant_id: string
  feature_key: string
  is_enabled: boolean
}

export interface ActionUpsertRestaurantSetting {
  action: 'upsert_restaurant_setting'
  tenant_id: string
  setting_key: string
  value: unknown // jsonb — il tipo dipende dalla setting specifica
}

/** Crea un utente admin: crea l'utente Auth (email+password) e la riga admin_users. */
export interface ActionCreateAdminUser {
  action: 'create_admin_user'
  email: string
  password: string
  name?: string
  tenant_id: string
}

/** Aggiorna name/tenant_id/email di un admin esistente. */
export interface ActionUpdateAdminUser {
  action: 'update_admin_user'
  admin_user_id: string
  name?: string
  tenant_id?: string
  /** Nuova email: propagata sia in admin_users sia in Auth */
  email?: string
}

/**
 * Elimina un utente admin (hard-delete: rimuove admin_users + utente Auth).
 * DEC-038: confirm_email deve corrispondere esattamente all'email del record.
 * Il server rivalidata lato server prima di cancellare.
 */
export interface ActionDeleteAdminUser {
  action: 'delete_admin_user'
  admin_user_id: string
  /** Matteo deve riscrivere l'email esatta dell'utente — rivalidata lato server. */
  confirm_email: string
}

/** Crea un tenant (azienda). Admin opzionale = crea anche l'utente Auth associato in un passaggio. */
export interface ActionCreateTenant {
  action: 'create_tenant'
  name: string
  /** Slug unico, validato lato server. */
  slug: string
  edition: 'classic' | 'pro' | 'enterprise'
  plan?: string
  is_active?: boolean
  /** Crea anche un admin associato (DEC-041): email + password impostati da Matteo. */
  admin?: {
    email: string
    password: string
    name?: string
  }
}

/**
 * Elimina un tenant (hard-delete).
 * DEC-038: confirm_name deve corrispondere esattamente a organizations.name.
 * Rivalidato lato server. Se esistono dati operativi (prenotazioni, ecc.)
 * il server restituisce 409 con istruzioni su PLAN-DB-006.
 */
export interface ActionDeleteTenant {
  action: 'delete_tenant'
  tenant_id: string
  /** Matteo deve riscrivere il nome esatto dell'azienda — rivalidato lato server. */
  confirm_name: string
}

/** Unione discriminata di tutte le azioni supportate */
export type ConsoleAdminAction =
  | ActionUpdateEdition
  | ActionUpsertTenantFeature
  | ActionUpsertRestaurantSetting
  | ActionCreateAdminUser
  | ActionUpdateAdminUser
  | ActionDeleteAdminUser
  | ActionCreateTenant
  | ActionDeleteTenant

// ---------------------------------------------------------------------------
// Risposta della function
// ---------------------------------------------------------------------------

export interface ConsoleAdminSuccess {
  ok: true
  action: string
  /** Presente per azioni che operano su un tenant specifico. */
  tenant_id?: string
  [key: string]: unknown // campi extra dipendono dall'action
}

export interface ConsoleAdminError {
  error: string
  detail?: string
}

export type ConsoleAdminResult =
  | { data: ConsoleAdminSuccess; error: null }
  | { data: null; error: ConsoleAdminError & { httpStatus: number } }

// ---------------------------------------------------------------------------
// Funzione principale
// ---------------------------------------------------------------------------

/**
 * Chiama la Edge Function `console-admin` con il JWT della sessione corrente.
 *
 * @param action - L'azione da eseguire con i suoi parametri.
 * @returns ConsoleAdminResult — sempre strutturato, mai throw (errori normalizzati).
 *
 * Pattern di uso negli hook/componenti:
 *   const { data, error } = await callConsoleAdmin({ ... })
 *   if (error) { showToast(error.error); return }
 *   // usa data.ok
 */
export async function callConsoleAdmin(action: ConsoleAdminAction): Promise<ConsoleAdminResult> {
  // Recupera la sessione corrente per ottenere il JWT.
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData.session) {
    return {
      data: null,
      error: {
        error: 'Sessione non disponibile. Effettua il login.',
        httpStatus: 401,
      },
    }
  }

  const jwt = sessionData.session.access_token

  // URL della function: definita in .env.local / variabile d'ambiente Vite.
  // Non ha un default hardcodato per evitare di puntare accidentalmente a PROD.
  const functionUrl = import.meta.env.VITE_CONSOLE_ADMIN_FUNCTION_URL as string | undefined
  if (!functionUrl) {
    return {
      data: null,
      error: {
        error:
          'VITE_CONSOLE_ADMIN_FUNCTION_URL non impostata. ' +
          'Aggiungi la variabile in console/.env.local.',
        httpStatus: 500,
      },
    }
  }

  let response: Response
  try {
    response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // La function verifica questo JWT per identificare l'utente.
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(action),
    })
  } catch (networkErr) {
    const message = networkErr instanceof Error ? networkErr.message : String(networkErr)
    return {
      data: null,
      error: {
        error: `Errore di rete durante la chiamata alla Edge Function: ${message}`,
        httpStatus: 0,
      },
    }
  }

  // Parsing della risposta JSON (la function risponde sempre JSON).
  let json: unknown
  try {
    json = await response.json()
  } catch {
    return {
      data: null,
      error: {
        error: `Risposta non JSON dalla Edge Function (HTTP ${response.status}).`,
        httpStatus: response.status,
      },
    }
  }

  if (!response.ok) {
    const errBody = json as ConsoleAdminError
    return {
      data: null,
      error: {
        error: errBody?.error ?? 'Errore sconosciuto dalla Edge Function.',
        detail: errBody?.detail,
        httpStatus: response.status,
      },
    }
  }

  return {
    data: json as ConsoleAdminSuccess,
    error: null,
  }
}
