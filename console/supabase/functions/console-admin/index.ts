/**
 * Edge Function: console-admin
 *
 * Scritture privilegiate della Console super-admin.
 * Gira in Deno sul runtime Supabase Edge — NON è codice browser.
 *
 * SICUREZZA:
 *   - JWT dell'utente nel header Authorization: verificato tramite Supabase Admin SDK.
 *   - Email del chiamante confrontata con CONSOLE_ALLOWED_EMAILS (env var del progetto).
 *   - Accetta scritture SOLO sui due tenant sandbox (console-classic / console-pro).
 *   - Service role letta da Deno.env — mai hardcodata, mai nel client browser.
 *
 * DEPLOY:
 *   Vedi docs/Console-Skill/plan-per-matteo/PLAN-DB-003-edge-console-admin.md
 *   per le istruzioni di deploy e i secret da impostare.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ---------------------------------------------------------------------------
// Costanti di dominio
// ---------------------------------------------------------------------------

/**
 * Unici tenant su cui questa function accetta scritture.
 * Sono i sandbox del branch Console — qualunque altro id è rifiutato.
 *
 * PERCHÉ: la Console può cambiare edition/feature di qualunque ristorante, quindi
 * durante lo sviluppo limitiamo le scritture ai tenant di test. I tenant reali di
 * Matteo vanno modificati solo da lui, a mano, quando è certo.
 */
const SANDBOX_TENANT_IDS = new Set([
  '4c694cb8-66af-478f-afd2-8719f07d64b4', // console-classic
  'b5436de8-731e-469e-a888-36785823be6b', // console-pro
])

/** Valori validi per organizations.edition */
const VALID_EDITIONS = new Set(['classic', 'pro', 'enterprise'])

// ---------------------------------------------------------------------------
// Tipi delle azioni supportate
// ---------------------------------------------------------------------------

interface ActionUpdateEdition {
  action: 'update_edition'
  tenant_id: string
  edition: string
}

interface ActionUpsertTenantFeature {
  action: 'upsert_tenant_feature'
  tenant_id: string
  feature_key: string
  is_enabled: boolean
}

interface ActionUpsertRestaurantSetting {
  action: 'upsert_restaurant_setting'
  tenant_id: string
  setting_key: string
  value: unknown // il tipo dipende dalla setting; il DB usa jsonb
}

type ConsoleAdminAction =
  | ActionUpdateEdition
  | ActionUpsertTenantFeature
  | ActionUpsertRestaurantSetting

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Risposta JSON con header CORS inclusi. */
function jsonResponse(body: unknown, status: number, corsHeaders: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

/**
 * Legge la allowlist email dall'env var CONSOLE_ALLOWED_EMAILS.
 * La variabile va impostata come secret nel progetto Supabase (vedi PLAN-DB-003).
 *
 * Formato: "email1@example.com,email2@example.com" (separati da virgola, case-insensitive).
 * Se la variabile manca o è vuota → Set vuoto (fail-safe: nessuno è autorizzato).
 */
function loadServerAllowlist(): Set<string> {
  const raw = Deno.env.get('CONSOLE_ALLOWED_EMAILS') ?? ''
  if (!raw.trim()) {
    console.warn('[console-admin] CONSOLE_ALLOWED_EMAILS non impostata — nessuna email autorizzata.')
    return new Set()
  }
  return new Set(
    raw.split(',').map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0)
  )
}

// ---------------------------------------------------------------------------
// Handler principale
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  // ---- CORS preflight ----
  // La Console gira su un'origine diversa (browser) → serve CORS.
  // Nota: in produzione restringi CORS_ORIGIN all'origine reale della Console.
  const corsOrigin = Deno.env.get('CONSOLE_CORS_ORIGIN') ?? '*'
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  }

  if (req.method === 'OPTIONS') {
    // Preflight — risponde subito senza autenticazione.
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Metodo non consentito. Usa POST.' }, 405, corsHeaders)
  }

  // ---- Legge variabili d'ambiente iniettate da Supabase ----
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    // Non dovrebbe mai accadere nel runtime Supabase Edge — log di emergenza.
    console.error('[console-admin] SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY mancanti.')
    return jsonResponse({ error: 'Configurazione server incompleta.' }, 500, corsHeaders)
  }

  // ---- Verifica JWT del chiamante ----
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Authorization header mancante o malformato.' }, 401, corsHeaders)
  }
  const userJwt = authHeader.substring(7) // rimuove "Bearer "

  // Crea un client che verifica il JWT *dell'utente* (non usa la service role per l'auth check).
  // Passare il JWT come option fa sì che le query successive rispettino la RLS dell'utente;
  // ma per le scritture privilegiate usiamo il client admin separato qui sotto.
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${userJwt}` } },
    auth: { persistSession: false },
  })

  const { data: { user }, error: userError } = await userClient.auth.getUser()
  if (userError || !user) {
    return jsonResponse({ error: 'JWT non valido o sessione scaduta.' }, 401, corsHeaders)
  }

  // ---- Verifica allowlist email (lato server) ----
  const serverAllowlist = loadServerAllowlist()
  const callerEmail = (user.email ?? '').trim().toLowerCase()
  if (!callerEmail || !serverAllowlist.has(callerEmail)) {
    // Log con email per l'audit trail, non per debug (andrà nei log Supabase Edge).
    console.warn(`[console-admin] Accesso negato per email: ${callerEmail}`)
    return jsonResponse(
      { error: 'Accesso non autorizzato. Email non presente nella allowlist.' },
      403,
      corsHeaders
    )
  }

  // ---- Parsing body ----
  let body: ConsoleAdminAction
  try {
    body = await req.json() as ConsoleAdminAction
  } catch {
    return jsonResponse({ error: 'Body JSON non valido.' }, 400, corsHeaders)
  }

  if (!body || typeof body.action !== 'string') {
    return jsonResponse({ error: 'Campo "action" mancante nel body.' }, 400, corsHeaders)
  }

  // ---- Guard sandbox tenant ----
  if (!('tenant_id' in body) || typeof body.tenant_id !== 'string') {
    return jsonResponse({ error: 'Campo "tenant_id" mancante o non valido.' }, 400, corsHeaders)
  }

  if (!SANDBOX_TENANT_IDS.has(body.tenant_id)) {
    return jsonResponse(
      {
        error: `Scrittura non consentita sul tenant "${body.tenant_id}". ` +
          'Solo i tenant sandbox console-classic e console-pro sono scrivibili da questa function.',
      },
      403,
      corsHeaders
    )
  }

  // ---- Client admin (service role) — usato solo dopo tutti i controlli ----
  // La service role bypassa la RLS: per questo viene creata il più tardi possibile
  // e solo dopo aver verificato auth + allowlist + sandbox.
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })

  // ---- Dispatch per action ----
  try {
    switch (body.action) {
      // ------------------------------------------------------------------
      // (a) Aggiorna organizations.edition
      // ------------------------------------------------------------------
      case 'update_edition': {
        const { edition } = body as ActionUpdateEdition
        if (!edition || !VALID_EDITIONS.has(edition)) {
          return jsonResponse(
            {
              error: `edition non valida: "${edition}". Valori consentiti: classic, pro, enterprise.`,
            },
            400,
            corsHeaders
          )
        }

        const { error } = await adminClient
          .from('organizations')
          .update({ edition })
          .eq('id', body.tenant_id)

        if (error) {
          console.error('[console-admin] update_edition error:', error)
          return jsonResponse({ error: 'Errore aggiornamento edition.', detail: error.message }, 500, corsHeaders)
        }

        console.log(`[console-admin] update_edition tenant=${body.tenant_id} edition=${edition} by=${callerEmail}`)
        return jsonResponse({ ok: true, action: 'update_edition', tenant_id: body.tenant_id, edition }, 200, corsHeaders)
      }

      // ------------------------------------------------------------------
      // (b) Upsert tenant_features
      // ------------------------------------------------------------------
      case 'upsert_tenant_feature': {
        const { feature_key, is_enabled } = body as ActionUpsertTenantFeature
        if (!feature_key || typeof feature_key !== 'string' || feature_key.trim() === '') {
          return jsonResponse({ error: '"feature_key" deve essere una stringa non vuota.' }, 400, corsHeaders)
        }
        if (typeof is_enabled !== 'boolean') {
          return jsonResponse({ error: '"is_enabled" deve essere un booleano.' }, 400, corsHeaders)
        }

        const { error } = await adminClient
          .from('tenant_features')
          .upsert(
            {
              tenant_id: body.tenant_id,
              feature_key: feature_key.trim(),
              enabled: is_enabled,
            },
            { onConflict: 'tenant_id,feature_key' }
          )

        if (error) {
          console.error('[console-admin] upsert_tenant_feature error:', error)
          return jsonResponse({ error: 'Errore upsert tenant_features.', detail: error.message }, 500, corsHeaders)
        }

        console.log(
          `[console-admin] upsert_tenant_feature tenant=${body.tenant_id} ` +
          `feature_key=${feature_key} is_enabled=${is_enabled} by=${callerEmail}`
        )
        return jsonResponse(
          { ok: true, action: 'upsert_tenant_feature', tenant_id: body.tenant_id, feature_key, is_enabled },
          200,
          corsHeaders
        )
      }

      // ------------------------------------------------------------------
      // (c) Upsert restaurant_settings
      // ------------------------------------------------------------------
      case 'upsert_restaurant_setting': {
        const { setting_key, value } = body as ActionUpsertRestaurantSetting
        if (!setting_key || typeof setting_key !== 'string' || setting_key.trim() === '') {
          return jsonResponse({ error: '"setting_key" deve essere una stringa non vuota.' }, 400, corsHeaders)
        }
        if (value === undefined) {
          return jsonResponse({ error: '"value" è richiesto (può essere null).' }, 400, corsHeaders)
        }

        const { error } = await adminClient
          .from('restaurant_settings')
          .upsert(
            {
              tenant_id: body.tenant_id,
              setting_key: setting_key.trim(),
              setting_value: value,
            },
            { onConflict: 'tenant_id,setting_key' }
          )

        if (error) {
          console.error('[console-admin] upsert_restaurant_setting error:', error)
          return jsonResponse({ error: 'Errore upsert restaurant_settings.', detail: error.message }, 500, corsHeaders)
        }

        console.log(
          `[console-admin] upsert_restaurant_setting tenant=${body.tenant_id} ` +
          `setting_key=${setting_key} by=${callerEmail}`
        )
        return jsonResponse(
          { ok: true, action: 'upsert_restaurant_setting', tenant_id: body.tenant_id, setting_key },
          200,
          corsHeaders
        )
      }

      default:
        return jsonResponse(
          {
            error: `action non riconosciuta: "${(body as { action: string }).action}". ` +
              'Valori consentiti: update_edition, upsert_tenant_feature, upsert_restaurant_setting.',
          },
          400,
          corsHeaders
        )
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[console-admin] Errore inatteso:', message)
    return jsonResponse({ error: 'Errore interno del server.', detail: message }, 500, corsHeaders)
  }
})
