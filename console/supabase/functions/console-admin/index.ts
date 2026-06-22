/**
 * Edge Function: console-admin
 *
 * Scritture privilegiate della Console super-admin.
 * Gira in Deno sul runtime Supabase Edge — NON è codice browser.
 *
 * SICUREZZA (aggiornata F10 / DEC-037):
 *   - JWT dell'utente nel header Authorization: verificato tramite Supabase Admin SDK.
 *   - Email del chiamante confrontata con CONSOLE_ALLOWED_EMAILS (env var del progetto).
 *   - Guard sandbox rimosso (DEC-037): le scritture valgono su QUALUNQUE tenant del progetto
 *     (che è TEST per costruzione). La rete di sicurezza è: gate allowlist + service role solo
 *     lato Edge + conferme forti rivalidate server-side per le azioni distruttive (DEC-038).
 *   - Service role letta da Deno.env — mai hardcodata, mai nel client browser.
 *
 * DEPLOY:
 *   Vedi docs/Console-Skill/plan-per-matteo/PLAN-DB-003-edge-console-admin.md
 *   (aggiornato in F10) per le istruzioni di deploy e i secret da impostare.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ---------------------------------------------------------------------------
// Costanti di dominio
// ---------------------------------------------------------------------------

/**
 * IDs dei tenant sandbox del branch Console.
 * Rimangono come INFORMAZIONE (utili per futuri test smoke), ma NON sono più
 * usati come barriera: il guard sandbox è stato rimosso in F10 (DEC-037).
 * Vedere il commento sul guard più avanti nel file.
 */
// IDs dei tenant sandbox (manteniamo come riferimento documentale — non sono più usati
// come barriera dopo DEC-037 / F10).
const SANDBOX_TENANT_IDS_REF = {
  'console-classic': '4c694cb8-66af-478f-afd2-8719f07d64b4',
  'console-pro': 'b5436de8-731e-469e-a888-36785823be6b',
} as const
// Usiamo il riferimento in un log informativo all'avvio per evitare warning "unused"
console.info('[console-admin] sandbox refs:', JSON.stringify(SANDBOX_TENANT_IDS_REF))

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

// ---------- Nuove azioni F10 ----------

interface ActionCreateAdminUser {
  action: 'create_admin_user'
  email: string
  password: string
  name?: string
  tenant_id: string
}

interface ActionUpdateAdminUser {
  action: 'update_admin_user'
  /** ID della riga admin_users da aggiornare */
  admin_user_id: string
  name?: string
  tenant_id?: string
  /** Nuova email: aggiornata sia in admin_users sia in Auth */
  email?: string
}

interface ActionDeleteAdminUser {
  action: 'delete_admin_user'
  admin_user_id: string
  /**
   * Conferma obbligatoria: Matteo deve riscrivere l'email ESATTA dell'utente.
   * Il server rivalida questo valore contro il record reale prima di cancellare
   * (DEC-038). Se non combacia → 409, nessuna cancellazione.
   */
  confirm_email: string
}

interface ActionCreateTenant {
  action: 'create_tenant'
  name: string
  slug: string
  edition: string
  /** Campi facoltativi base */
  plan?: string
  is_active?: boolean
  /** Admin da creare e associare contestualmente (opzionale — DEC-041) */
  admin?: {
    email: string
    password: string
    name?: string
  }
}

interface ActionDeleteTenant {
  action: 'delete_tenant'
  tenant_id: string
  /**
   * Conferma obbligatoria: Matteo deve riscrivere il nome ESATTO dell'azienda.
   * Il server rivalida contro organizations.name (DEC-038).
   */
  confirm_name: string
}

type ConsoleAdminAction =
  | ActionUpdateEdition
  | ActionUpsertTenantFeature
  | ActionUpsertRestaurantSetting
  | ActionCreateAdminUser
  | ActionUpdateAdminUser
  | ActionDeleteAdminUser
  | ActionCreateTenant
  | ActionDeleteTenant

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

  // ----
  // GUARD SANDBOX RIMOSSO (DEC-037 / F10)
  //
  // Il vecchio guard che limitava le scritture ai soli tenant sandbox è stato
  // neutralizzato: questa function accetta scritture su QUALUNQUE tenant del
  // progetto (che è TEST per costruzione — RULE-1 garantita a livello di SUPABASE_URL).
  //
  // La rete di sicurezza sostitutiva è:
  //   (a) Gate allowlist CONSOLE_ALLOWED_EMAILS — verificato sopra.
  //   (b) Service role solo lato Edge — mai nel browser.
  //   (c) Conferme forti rivalidate lato server per le azioni distruttive (DEC-038):
  //       delete_admin_user → confirm_email rivalidata vs record reale
  //       delete_tenant     → confirm_name  rivalidata vs organizations.name
  //
  // Il field tenant_id è richiesto solo per le azioni che lo usano (validate per action).
  // ----

  // ---- Client admin (service role) — usato solo dopo tutti i controlli ----
  // La service role bypassa la RLS: per questo viene creata il più tardi possibile
  // e solo dopo aver verificato auth + allowlist.
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
        const { tenant_id, edition } = body as ActionUpdateEdition
        if (!tenant_id || typeof tenant_id !== 'string') {
          return jsonResponse({ error: '"tenant_id" mancante o non valido.' }, 400, corsHeaders)
        }
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
          .eq('id', tenant_id)

        if (error) {
          console.error('[console-admin] update_edition error:', error)
          return jsonResponse({ error: 'Errore aggiornamento edition.', detail: error.message }, 500, corsHeaders)
        }

        console.log(`[console-admin] update_edition tenant=${tenant_id} edition=${edition} by=${callerEmail}`)
        return jsonResponse({ ok: true, action: 'update_edition', tenant_id, edition }, 200, corsHeaders)
      }

      // ------------------------------------------------------------------
      // (b) Upsert tenant_features
      // ------------------------------------------------------------------
      case 'upsert_tenant_feature': {
        const { tenant_id, feature_key, is_enabled } = body as ActionUpsertTenantFeature
        if (!tenant_id || typeof tenant_id !== 'string') {
          return jsonResponse({ error: '"tenant_id" mancante o non valido.' }, 400, corsHeaders)
        }
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
              tenant_id,
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
          `[console-admin] upsert_tenant_feature tenant=${tenant_id} ` +
          `feature_key=${feature_key} is_enabled=${is_enabled} by=${callerEmail}`
        )
        return jsonResponse(
          { ok: true, action: 'upsert_tenant_feature', tenant_id, feature_key, is_enabled },
          200,
          corsHeaders
        )
      }

      // ------------------------------------------------------------------
      // (c) Upsert restaurant_settings
      // ------------------------------------------------------------------
      case 'upsert_restaurant_setting': {
        const { tenant_id, setting_key, value } = body as ActionUpsertRestaurantSetting
        if (!tenant_id || typeof tenant_id !== 'string') {
          return jsonResponse({ error: '"tenant_id" mancante o non valido.' }, 400, corsHeaders)
        }
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
              tenant_id,
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
          `[console-admin] upsert_restaurant_setting tenant=${tenant_id} ` +
          `setting_key=${setting_key} by=${callerEmail}`
        )
        return jsonResponse(
          { ok: true, action: 'upsert_restaurant_setting', tenant_id, setting_key },
          200,
          corsHeaders
        )
      }

      // ------------------------------------------------------------------
      // (d) Crea utente admin — F10 / DEC-037/038
      // ------------------------------------------------------------------
      case 'create_admin_user': {
        const { email, password, name, tenant_id } = body as ActionCreateAdminUser

        if (!email || typeof email !== 'string' || !email.includes('@')) {
          return jsonResponse({ error: '"email" non valida.' }, 400, corsHeaders)
        }
        if (!password || typeof password !== 'string' || password.length < 8) {
          return jsonResponse({ error: '"password" richiesta (min 8 caratteri).' }, 400, corsHeaders)
        }
        if (!tenant_id || typeof tenant_id !== 'string') {
          return jsonResponse({ error: '"tenant_id" mancante o non valido.' }, 400, corsHeaders)
        }

        // Verifica che il tenant esista
        const { data: org, error: orgErr } = await adminClient
          .from('organizations')
          .select('id')
          .eq('id', tenant_id)
          .maybeSingle()
        if (orgErr) {
          console.error('[console-admin] create_admin_user org lookup error:', orgErr)
          return jsonResponse({ error: 'Errore verifica tenant.', detail: orgErr.message }, 500, corsHeaders)
        }
        if (!org) {
          return jsonResponse({ error: `Tenant "${tenant_id}" non trovato.` }, 404, corsHeaders)
        }

        // Crea l'utente in Supabase Auth (email già confermata — Matteo imposta la password)
        const { data: authData, error: authErr } = await adminClient.auth.admin.createUser({
          email: email.trim().toLowerCase(),
          password,
          email_confirm: true,
        })

        if (authErr) {
          // Gestione caso email già esistente in Auth
          if (authErr.message?.toLowerCase().includes('already')) {
            return jsonResponse(
              { error: `Email già registrata in Auth: "${email}". Usa update_admin_user per aggiornare.` },
              409,
              corsHeaders
            )
          }
          console.error('[console-admin] create_admin_user auth.admin.createUser error:', authErr)
          return jsonResponse({ error: 'Errore creazione utente Auth.', detail: authErr.message }, 500, corsHeaders)
        }

        // Inserisce la riga admin_users
        const { data: adminRow, error: insertErr } = await adminClient
          .from('admin_users')
          .insert({
            email: email.trim().toLowerCase(),
            name: name ?? null,
            tenant_id,
          })
          .select()
          .single()

        if (insertErr) {
          // Rollback: rimuove l'utente Auth appena creato per evitare stato inconsistente
          if (authData?.user?.id) {
            await adminClient.auth.admin.deleteUser(authData.user.id)
          }
          console.error('[console-admin] create_admin_user admin_users insert error:', insertErr)
          return jsonResponse({ error: 'Errore inserimento admin_users (utente Auth rimosso).', detail: insertErr.message }, 500, corsHeaders)
        }

        console.log(
          `[console-admin] create_admin_user email=${email} tenant=${tenant_id} ` +
          `auth_id=${authData?.user?.id} by=${callerEmail}`
        )
        return jsonResponse(
          {
            ok: true,
            action: 'create_admin_user',
            admin_user_id: adminRow.id,
            auth_user_id: authData?.user?.id,
            email: adminRow.email,
            tenant_id,
          },
          200,
          corsHeaders
        )
      }

      // ------------------------------------------------------------------
      // (e) Aggiorna utente admin — F10
      // ------------------------------------------------------------------
      case 'update_admin_user': {
        const { admin_user_id, name, tenant_id: newTenantId, email: newEmail } = body as ActionUpdateAdminUser

        if (!admin_user_id || typeof admin_user_id !== 'string') {
          return jsonResponse({ error: '"admin_user_id" mancante o non valido.' }, 400, corsHeaders)
        }

        // Legge il record corrente
        const { data: existing, error: fetchErr } = await adminClient
          .from('admin_users')
          .select('id, email, name, tenant_id')
          .eq('id', admin_user_id)
          .maybeSingle()

        if (fetchErr) {
          return jsonResponse({ error: 'Errore lettura admin_users.', detail: fetchErr.message }, 500, corsHeaders)
        }
        if (!existing) {
          return jsonResponse({ error: `Utente admin "${admin_user_id}" non trovato.` }, 404, corsHeaders)
        }

        // Costruisce l'oggetto di aggiornamento (solo i campi passati)
        const updates: Record<string, unknown> = {}
        if (name !== undefined) updates.name = name
        if (newTenantId !== undefined) {
          // Verifica che il nuovo tenant esista
          const { data: newOrg } = await adminClient
            .from('organizations')
            .select('id')
            .eq('id', newTenantId)
            .maybeSingle()
          if (!newOrg) {
            return jsonResponse({ error: `Tenant "${newTenantId}" non trovato.` }, 404, corsHeaders)
          }
          updates.tenant_id = newTenantId
        }
        if (newEmail !== undefined) {
          updates.email = newEmail.trim().toLowerCase()
        }

        if (Object.keys(updates).length === 0) {
          return jsonResponse({ error: 'Nessun campo da aggiornare fornito.' }, 400, corsHeaders)
        }

        // Se l'email cambia, la propaghiamo PRIMA su Auth (sorgente dell'identità di login).
        // Ordine scelto per evitare lo stato incoerente (login impossibile) se Auth fallisse
        // DOPO aver già modificato admin_users: se Auth fallisce ci fermiamo senza toccare admin_users.
        const emailChanging =
          newEmail !== undefined && newEmail.trim().toLowerCase() !== existing.email?.toLowerCase()
        let authRollback: { id: string; oldEmail: string } | null = null

        if (emailChanging) {
          const { data: authUsers, error: listErr } = await adminClient.auth.admin.listUsers()
          if (listErr) {
            return jsonResponse({ error: 'Errore lettura utenti Auth.', detail: listErr.message }, 500, corsHeaders)
          }
          const authUser = authUsers?.users?.find(
            (u) => u.email?.toLowerCase() === existing.email?.toLowerCase()
          )
          if (authUser) {
            const { error: authUpdateErr } = await adminClient.auth.admin.updateUserById(
              authUser.id,
              { email: newEmail!.trim().toLowerCase() }
            )
            if (authUpdateErr) {
              // Auth non aggiornato → NON tocchiamo admin_users: meglio nessuna modifica che stato incoerente.
              console.error('[console-admin] update_admin_user Auth email update fallito:', authUpdateErr)
              return jsonResponse(
                { error: 'Aggiornamento email su Auth fallito: admin_users NON modificato.', detail: authUpdateErr.message },
                500,
                corsHeaders
              )
            }
            authRollback = { id: authUser.id, oldEmail: existing.email }
          }
        }

        // Aggiorna admin_users; se fallisce e avevamo già cambiato l'email su Auth, facciamo rollback.
        const { error: updateErr } = await adminClient
          .from('admin_users')
          .update(updates)
          .eq('id', admin_user_id)

        if (updateErr) {
          if (authRollback) {
            const { error: rbErr } = await adminClient.auth.admin.updateUserById(
              authRollback.id,
              { email: authRollback.oldEmail }
            )
            if (rbErr) {
              console.error('[console-admin] update_admin_user: rollback email Auth fallito:', rbErr)
            }
          }
          console.error('[console-admin] update_admin_user admin_users error:', updateErr)
          return jsonResponse({ error: 'Errore aggiornamento admin_users.', detail: updateErr.message }, 500, corsHeaders)
        }

        console.log(
          `[console-admin] update_admin_user id=${admin_user_id} fields=${Object.keys(updates).join(',')} by=${callerEmail}`
        )
        return jsonResponse(
          { ok: true, action: 'update_admin_user', admin_user_id, updated_fields: Object.keys(updates) },
          200,
          corsHeaders
        )
      }

      // ------------------------------------------------------------------
      // (f) Elimina utente admin — F10 / DEC-038 (conferma rivalidata server-side)
      // ------------------------------------------------------------------
      case 'delete_admin_user': {
        const { admin_user_id, confirm_email } = body as ActionDeleteAdminUser

        if (!admin_user_id || typeof admin_user_id !== 'string') {
          return jsonResponse({ error: '"admin_user_id" mancante o non valido.' }, 400, corsHeaders)
        }
        if (!confirm_email || typeof confirm_email !== 'string') {
          return jsonResponse(
            { error: '"confirm_email" obbligatoria: riscrivi l\'email esatta dell\'utente da eliminare.' },
            400,
            corsHeaders
          )
        }

        // Legge il record reale dal DB
        const { data: existing, error: fetchErr } = await adminClient
          .from('admin_users')
          .select('id, email, name, tenant_id')
          .eq('id', admin_user_id)
          .maybeSingle()

        if (fetchErr) {
          return jsonResponse({ error: 'Errore lettura admin_users.', detail: fetchErr.message }, 500, corsHeaders)
        }
        if (!existing) {
          return jsonResponse({ error: `Utente admin "${admin_user_id}" non trovato.` }, 404, corsHeaders)
        }

        // Rivalidazione server-side della conferma (DEC-038)
        if (confirm_email.trim().toLowerCase() !== existing.email.toLowerCase()) {
          console.warn(
            `[console-admin] delete_admin_user MISMATCH confirm_email="${confirm_email}" ` +
            `vs record email="${existing.email}" by=${callerEmail}`
          )
          return jsonResponse(
            {
              error: 'Conferma email non corrisponde. Riscrivi esattamente l\'email dell\'utente.',
            },
            409,
            corsHeaders
          )
        }

        // Elimina la riga admin_users
        const { error: deleteErr } = await adminClient
          .from('admin_users')
          .delete()
          .eq('id', admin_user_id)

        if (deleteErr) {
          console.error('[console-admin] delete_admin_user admin_users delete error:', deleteErr)
          return jsonResponse({ error: 'Errore eliminazione admin_users.', detail: deleteErr.message }, 500, corsHeaders)
        }

        // Cerca l'utente in Auth per email e lo elimina
        const { data: authUsers } = await adminClient.auth.admin.listUsers()
        const authUser = authUsers?.users?.find(
          (u) => u.email?.toLowerCase() === existing.email.toLowerCase()
        )

        if (authUser) {
          const { error: authDeleteErr } = await adminClient.auth.admin.deleteUser(authUser.id)
          if (authDeleteErr) {
            // La riga admin_users è già rimossa; logga per audit ma non blocca
            console.warn(
              `[console-admin] delete_admin_user: admin_users rimosso ma Auth delete fallito ` +
              `(auth_id=${authUser.id}): ${authDeleteErr.message}`
            )
          }
        } else {
          // Utente non trovato in Auth: insolito ma non bloccante (il record admin era la fonte di verità)
          console.warn(
            `[console-admin] delete_admin_user: nessun utente Auth trovato per email="${existing.email}"`
          )
        }

        console.log(
          `[console-admin] delete_admin_user id=${admin_user_id} email=${existing.email} by=${callerEmail}`
        )
        return jsonResponse(
          {
            ok: true,
            action: 'delete_admin_user',
            admin_user_id,
            deleted_email: existing.email,
            auth_deleted: !!authUser,
          },
          200,
          corsHeaders
        )
      }

      // ------------------------------------------------------------------
      // (g) Crea tenant (azienda) + admin opzionale — F10 / DEC-041
      // ------------------------------------------------------------------
      case 'create_tenant': {
        const { name, slug, edition, plan, is_active, admin } = body as ActionCreateTenant

        if (!name || typeof name !== 'string' || name.trim() === '') {
          return jsonResponse({ error: '"name" obbligatorio e non vuoto.' }, 400, corsHeaders)
        }
        if (!slug || typeof slug !== 'string' || slug.trim() === '') {
          return jsonResponse({ error: '"slug" obbligatorio e non vuoto.' }, 400, corsHeaders)
        }
        if (!edition || !VALID_EDITIONS.has(edition)) {
          return jsonResponse(
            { error: `"edition" non valida: "${edition}". Valori: classic, pro, enterprise.` },
            400,
            corsHeaders
          )
        }

        // Valida slug unico
        const { data: existingSlug, error: slugErr } = await adminClient
          .from('organizations')
          .select('id')
          .eq('slug', slug.trim())
          .maybeSingle()

        if (slugErr) {
          return jsonResponse({ error: 'Errore verifica slug.', detail: slugErr.message }, 500, corsHeaders)
        }
        if (existingSlug) {
          return jsonResponse(
            { error: `Slug "${slug}" già in uso. Scegli uno slug diverso.` },
            409,
            corsHeaders
          )
        }

        // Crea l'organizzazione
        const { data: newOrg, error: orgInsertErr } = await adminClient
          .from('organizations')
          .insert({
            name: name.trim(),
            slug: slug.trim(),
            edition,
            plan: plan ?? 'starter',
            is_active: is_active ?? true,
          })
          .select()
          .single()

        if (orgInsertErr) {
          console.error('[console-admin] create_tenant organizations insert error:', orgInsertErr)
          return jsonResponse({ error: 'Errore creazione organizzazione.', detail: orgInsertErr.message }, 500, corsHeaders)
        }

        const newTenantId = newOrg.id
        let adminResult: { admin_user_id: string; auth_user_id: string; email: string } | null = null

        // Se è passato un admin, lo crea e associa (DEC-041)
        if (admin) {
          const { email: adminEmail, password: adminPassword, name: adminName } = admin

          if (!adminEmail || !adminEmail.includes('@')) {
            // Rollback tenant
            await adminClient.from('organizations').delete().eq('id', newTenantId)
            return jsonResponse({ error: 'Email admin non valida.' }, 400, corsHeaders)
          }
          if (!adminPassword || adminPassword.length < 8) {
            await adminClient.from('organizations').delete().eq('id', newTenantId)
            return jsonResponse({ error: 'Password admin richiesta (min 8 caratteri).' }, 400, corsHeaders)
          }

          const { data: authData, error: authErr } = await adminClient.auth.admin.createUser({
            email: adminEmail.trim().toLowerCase(),
            password: adminPassword,
            email_confirm: true,
          })

          if (authErr) {
            // Rollback tenant
            await adminClient.from('organizations').delete().eq('id', newTenantId)
            if (authErr.message?.toLowerCase().includes('already')) {
              return jsonResponse(
                { error: `Email admin già registrata: "${adminEmail}". Il tenant non è stato creato.` },
                409,
                corsHeaders
              )
            }
            return jsonResponse(
              { error: 'Errore creazione utente Auth admin. Il tenant non è stato creato.', detail: authErr.message },
              500,
              corsHeaders
            )
          }

          const { data: adminRow, error: adminInsertErr } = await adminClient
            .from('admin_users')
            .insert({
              email: adminEmail.trim().toLowerCase(),
              name: adminName ?? null,
              tenant_id: newTenantId,
            })
            .select()
            .single()

          if (adminInsertErr) {
            // Rollback: rimuovi utente Auth e tenant
            if (authData?.user?.id) {
              await adminClient.auth.admin.deleteUser(authData.user.id)
            }
            await adminClient.from('organizations').delete().eq('id', newTenantId)
            return jsonResponse(
              { error: 'Errore inserimento admin. Tenant e utente Auth rimossi.', detail: adminInsertErr.message },
              500,
              corsHeaders
            )
          }

          adminResult = {
            admin_user_id: adminRow.id,
            auth_user_id: authData?.user?.id ?? '',
            email: adminRow.email,
          }
        }

        console.log(
          `[console-admin] create_tenant id=${newTenantId} slug=${slug} edition=${edition} ` +
          `admin=${adminResult?.email ?? 'none'} by=${callerEmail}`
        )
        return jsonResponse(
          {
            ok: true,
            action: 'create_tenant',
            tenant_id: newTenantId,
            name: newOrg.name,
            slug: newOrg.slug,
            edition: newOrg.edition,
            admin: adminResult,
          },
          200,
          corsHeaders
        )
      }

      // ------------------------------------------------------------------
      // (h) Elimina tenant (hard-delete) — F10 / DEC-038
      //
      // CASCATA (DEC-047): le FK su organizations.id NON hanno ON DELETE CASCADE.
      // Questa action gestisce lato applicativo i figli "sicuri" (nessun dato operativo
      // critico: tenant_features, restaurant_settings, admin_users e utenti Auth).
      // Le tabelle con dati operativi (booking_requests, customers, service_slots,
      // menu_items, menu_categories, email_logs, email_campaigns, email_templates,
      // menu_qr_codes, menu_qrcode_categories, rooms, tables, service_slot_overrides,
      // booking_table_assignments, tenant_usage, invite_tokens, unsubscribe_tokens,
      // menu_homepage_config) NON vengono toccate qui: se esistono dati in quelle
      // tabelle la delete organizaztion fallirà con errore FK dal DB.
      // → Il chiamante deve prima verificare che le tabelle siano vuote, oppure
      //   Matteo deve eseguire PLAN-DB-006 per aggiungere ON DELETE CASCADE.
      // ------------------------------------------------------------------
      case 'delete_tenant': {
        const { tenant_id, confirm_name } = body as ActionDeleteTenant

        if (!tenant_id || typeof tenant_id !== 'string') {
          return jsonResponse({ error: '"tenant_id" mancante o non valido.' }, 400, corsHeaders)
        }
        if (!confirm_name || typeof confirm_name !== 'string') {
          return jsonResponse(
            { error: '"confirm_name" obbligatoria: riscrivi il nome esatto dell\'azienda da eliminare.' },
            400,
            corsHeaders
          )
        }

        // Legge il record reale
        const { data: existingOrg, error: orgFetchErr } = await adminClient
          .from('organizations')
          .select('id, name, slug, edition')
          .eq('id', tenant_id)
          .maybeSingle()

        if (orgFetchErr) {
          return jsonResponse({ error: 'Errore lettura organizations.', detail: orgFetchErr.message }, 500, corsHeaders)
        }
        if (!existingOrg) {
          return jsonResponse({ error: `Tenant "${tenant_id}" non trovato.` }, 404, corsHeaders)
        }

        // Rivalidazione server-side della conferma (DEC-038)
        if (confirm_name.trim() !== existingOrg.name) {
          console.warn(
            `[console-admin] delete_tenant MISMATCH confirm_name="${confirm_name}" ` +
            `vs org.name="${existingOrg.name}" by=${callerEmail}`
          )
          return jsonResponse(
            {
              error: 'Conferma nome non corrisponde. Riscrivi esattamente il nome dell\'azienda.',
            },
            409,
            corsHeaders
          )
        }

        // ---- Pulizia figli "sicuri" prima del delete organizations ----
        // Raccoglie gli utenti Auth associati (via admin_users) per eliminarli dopo
        const { data: adminUsers } = await adminClient
          .from('admin_users')
          .select('id, email')
          .eq('tenant_id', tenant_id)

        const { data: authUsersList } = await adminClient.auth.admin.listUsers()
        const authEmailSet = new Set(
          (adminUsers ?? []).map((au) => au.email.toLowerCase())
        )
        const authUsersToDelete = (authUsersList?.users ?? []).filter(
          (u) => u.email && authEmailSet.has(u.email.toLowerCase())
        )

        // Elimina admin_users del tenant
        const { error: adminUsersDeleteErr } = await adminClient
          .from('admin_users')
          .delete()
          .eq('tenant_id', tenant_id)

        if (adminUsersDeleteErr) {
          console.error('[console-admin] delete_tenant admin_users delete error:', adminUsersDeleteErr)
          return jsonResponse(
            { error: 'Errore eliminazione admin_users del tenant.', detail: adminUsersDeleteErr.message },
            500,
            corsHeaders
          )
        }

        // Elimina tenant_features del tenant (errore gestito esplicitamente, niente silent failure)
        const { error: featDeleteErr } = await adminClient
          .from('tenant_features')
          .delete()
          .eq('tenant_id', tenant_id)
        if (featDeleteErr) {
          console.error('[console-admin] delete_tenant tenant_features delete error:', featDeleteErr)
          return jsonResponse(
            { error: 'Errore eliminazione tenant_features del tenant.', detail: featDeleteErr.message },
            500,
            corsHeaders
          )
        }

        // Elimina restaurant_settings del tenant (errore gestito esplicitamente)
        const { error: settDeleteErr } = await adminClient
          .from('restaurant_settings')
          .delete()
          .eq('tenant_id', tenant_id)
        if (settDeleteErr) {
          console.error('[console-admin] delete_tenant restaurant_settings delete error:', settDeleteErr)
          return jsonResponse(
            { error: 'Errore eliminazione restaurant_settings del tenant.', detail: settDeleteErr.message },
            500,
            corsHeaders
          )
        }

        // Elimina l'organizzazione
        // Se esistono dati in altre tabelle figlie (booking_requests, customers, ecc.)
        // questa delete fallirà con errore FK → l'errore viene restituito al chiamante.
        const { error: orgDeleteErr } = await adminClient
          .from('organizations')
          .delete()
          .eq('id', tenant_id)

        if (orgDeleteErr) {
          // Errore FK: probabile presenza di dati operativi in tabelle figlie
          console.error('[console-admin] delete_tenant organizations delete error (FK?):', orgDeleteErr)
          return jsonResponse(
            {
              error:
                'Impossibile eliminare il tenant: esistono dati collegati in altre tabelle ' +
                '(prenotazioni, clienti, fasce orarie, ecc.). ' +
                'Svuota prima quei dati oppure chiedi a Matteo di eseguire PLAN-DB-006 ' +
                '(ON DELETE CASCADE su organizations).',
              detail: orgDeleteErr.message,
            },
            409,
            corsHeaders
          )
        }

        // Elimina utenti Auth associati (dopo la delete organization, non prima,
        // per non perdere la lista in caso di rollback)
        const authDeleteResults: string[] = []
        for (const au of authUsersToDelete) {
          const { error: authDelErr } = await adminClient.auth.admin.deleteUser(au.id)
          if (authDelErr) {
            authDeleteResults.push(`${au.email}: ERRORE (${authDelErr.message})`)
          } else {
            authDeleteResults.push(`${au.email}: ok`)
          }
        }

        console.log(
          `[console-admin] delete_tenant id=${tenant_id} name="${existingOrg.name}" ` +
          `auth_deleted=${authUsersToDelete.length} by=${callerEmail}`
        )
        return jsonResponse(
          {
            ok: true,
            action: 'delete_tenant',
            tenant_id,
            deleted_name: existingOrg.name,
            auth_users_deleted: authDeleteResults,
          },
          200,
          corsHeaders
        )
      }

      default:
        return jsonResponse(
          {
            error: `action non riconosciuta: "${(body as { action: string }).action}". ` +
              'Valori consentiti: update_edition, upsert_tenant_feature, upsert_restaurant_setting, ' +
              'create_admin_user, update_admin_user, delete_admin_user, create_tenant, delete_tenant.',
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
