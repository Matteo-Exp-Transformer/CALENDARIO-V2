/**
 * Pre-requisiti staging (.env.local.test):
 *   VITE_SUPABASE_URL → deve puntare al progetto TEST (docnnernvp)
 *   E2E_SUPABASE_SERVICE_KEY (o SUPABASE_SERVICE_ROLE_KEY) → per seminare/consumare l'invito
 *   E2E_CLASSIC_TENANT_SLUG → tenant a cui agganciare l'invito (default 'test-classic')
 *   La Edge Function validate-invite deve essere deployata sullo staging
 *
 * Il token non arriva più da un env var fisso (E2E_VALID_INVITE_TOKEN): per natura si consuma
 * al primo uso reale (POST → invite_tokens.used_at si valorizza, supabase/functions/validate-invite/
 * index.ts:132-137), quindi un valore scritto una volta in .env.local.test smette di funzionare
 * dopo la prima run che completa una registrazione. Ogni test che lo consuma genera qui il
 * proprio invite_tokens fresco (stesso pattern REST con service key degli helper in
 * e2e/helpers/supabaseStaging.ts) e lo ripulisce in finally.
 */
import { test, expect } from '@playwright/test'
import { getTenantIdBySlug } from './helpers/supabaseStaging'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? ''
const SERVICE_KEY = process.env.E2E_SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const INVITE_TENANT_SLUG = process.env.E2E_CLASSIC_TENANT_SLUG ?? 'test-classic'
const hasStagingServiceCreds = Boolean(SUPABASE_URL.includes('docnnernvp') && SERVICE_KEY)

function restHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  }
}

/**
 * invite_tokens (supabase/migrations/001_schema_completo.sql:147-156): id default, organization_id
 * NOT NULL, token TEXT UNIQUE NOT NULL (nessun default → lo generiamo qui), email opzionale
 * (se presente il form di InvitePage la precompila e disabilita, src/pages/InvitePage.tsx:65,214),
 * expires_at NOT NULL, used_at nullable (si valorizza al consumo). Service role bypassa la RLS
 * (che concede insert solo a service_role) esattamente come gli altri helper di seed.
 */
async function createInviteToken(
  organizationId: string,
  email: string,
): Promise<{ token: string; id: string }> {
  const token = `e2e-invite-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/invite_tokens`, {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify({
      organization_id: organizationId,
      token,
      email,
      expires_at: expiresAt,
    }),
  })
  if (!resp.ok) throw new Error(`createInviteToken → ${resp.status}: ${await resp.text()}`)
  const rows = (await resp.json()) as Array<{ id: string }>
  if (!rows[0]?.id) throw new Error('createInviteToken: nessuna riga restituita')
  return { token, id: rows[0].id }
}

async function deleteInviteTokenById(id: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/invite_tokens?id=eq.${id}`, {
    method: 'DELETE',
    headers: restHeaders({ Prefer: 'return=minimal' }),
  })
}

async function deleteAdminUserByEmail(email: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}`, {
    method: 'DELETE',
    headers: restHeaders({ Prefer: 'return=minimal' }),
  })
}

/**
 * L'Edge Function crea l'utente Auth via supabaseAdmin.auth.admin.createUser (validate-invite/
 * index.ts:171-176) ma non salva il suo id da nessuna parte in admin_users — per pulirlo dopo il
 * test bisogna cercarlo per email nell'Admin API di GoTrue. Best-effort: se la ricerca/cancellazione
 * fallisce non facciamo fallire il test (è cleanup, non l'asserzione), ma lo segnaliamo in console.
 */
async function findAuthUserIdByEmail(email: string): Promise<string | null> {
  const resp = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=1000`, {
    headers: restHeaders(),
  })
  if (!resp.ok) return null
  const data = (await resp.json().catch(() => null)) as { users?: Array<{ id: string; email?: string }> } | null
  return data?.users?.find((u) => u.email === email)?.id ?? null
}

async function deleteAuthUserById(id: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${id}`, {
    method: 'DELETE',
    headers: restHeaders(),
  })
}

async function cleanupRegisteredUser(email: string): Promise<void> {
  try {
    const authUserId = await findAuthUserIdByEmail(email)
    if (authUserId) await deleteAuthUserById(authUserId)
  } catch (error) {
    console.warn(`[invite-flow cleanup] utente Auth ${email} non ripulito:`, error)
  }
  await deleteAdminUserByEmail(email).catch((error) => {
    console.warn(`[invite-flow cleanup] admin_users ${email} non ripulito:`, error)
  })
}

test.describe('Flusso invito admin', () => {
  let tenantId = ''

  test.beforeAll(async () => {
    if (!hasStagingServiceCreds) return
    tenantId = await getTenantIdBySlug(INVITE_TENANT_SLUG)
  })

  test('token valido mostra il form di registrazione', async ({ page }) => {
    test.skip(
      !hasStagingServiceCreds,
      'richiede VITE_SUPABASE_URL (staging TEST) e E2E_SUPABASE_SERVICE_KEY in .env.local.test per generare un invite_tokens reale',
    )
    const { token, id } = await createInviteToken(tenantId, `e2e-invite-view-${Date.now()}@e2e.test`)
    try {
      await page.goto(`/invite/${token}`)

      // La pagina deve mostrare un form di registrazione, non un errore
      await expect(page).not.toHaveURL('/login')
      const formOrHeading = page.locator('form, h1:has-text("Registra"), h2:has-text("Registra"), input[type="password"]').first()
      await expect(formOrHeading).toBeVisible({ timeout: 8000 })
    } finally {
      await deleteInviteTokenById(id).catch(() => {})
    }
  })

  test('token non valido mostra un messaggio di errore', async ({ page }) => {
    await page.goto('/invite/token-completamente-inesistente-xyzabc123')

    // Deve apparire un messaggio di errore o la pagina di errore
    const errorElement = page.locator(
      '[class*="error"], [class*="invalid"], p:has-text("non valido"), p:has-text("scaduto"), h1:has-text("non valido")'
    ).first()
    await expect(errorElement).toBeVisible({ timeout: 8000 })
  })

  test('vecchio URL /register?token= funziona per retrocompatibilità', async ({ page }) => {
    test.skip(
      !hasStagingServiceCreds,
      'richiede VITE_SUPABASE_URL (staging TEST) e E2E_SUPABASE_SERVICE_KEY in .env.local.test per generare un invite_tokens reale',
    )
    const { token, id } = await createInviteToken(tenantId, `e2e-invite-legacy-${Date.now()}@e2e.test`)
    try {
      await page.goto(`/register?token=${token}`)

      // Deve mostrare lo stesso form del percorso /invite/:token
      await expect(page).not.toHaveURL('/login')
      const formOrHeading = page.locator('form, h1, h2, input[type="password"]').first()
      await expect(formOrHeading).toBeVisible({ timeout: 8000 })
    } finally {
      await deleteInviteTokenById(id).catch(() => {})
    }
  })

  test('registrazione OK con token valido', async ({ page }) => {
    test.skip(
      !hasStagingServiceCreds,
      'richiede VITE_SUPABASE_URL (staging TEST) e E2E_SUPABASE_SERVICE_KEY in .env.local.test per generare un invite_tokens reale',
    )
    const email = `e2e-invite-register-${Date.now()}@e2e.test`
    const { token, id } = await createInviteToken(tenantId, email)

    try {
      await page.goto(`/invite/${token}`)

      const passwordInput = page.locator('input[type="password"]').first()
      const confirmPasswordInput = page.locator('input[type="password"]').nth(1)
      await expect(passwordInput).toBeVisible({ timeout: 8000 })

      // src/pages/InvitePage.tsx: l'email arriva già precompilata (e disabilitata) dal
      // token — il form ha solo password + conferma password, nessun campo "nome".
      await passwordInput.fill('PasswordSicura123!')
      await confirmPasswordInput.fill('PasswordSicura123!')
      await page.locator('button[type="submit"]').click()

      // Successo reale: InvitePage.tsx:170 mostra questo heading esatto (non un toast generico)
      await expect(page.getByRole('heading', { name: /registrazione completata/i })).toBeVisible({
        timeout: 10000,
      })

      // Riprova oggettiva sul DB: la POST dell'Edge Function inserisce in admin_users
      // (validate-invite/index.ts:188-194) solo se la registrazione è andata a buon fine davvero.
      const resp = await fetch(
        `${SUPABASE_URL}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}&select=id`,
        { headers: restHeaders() },
      )
      const rows = (await resp.json()) as Array<{ id: string }>
      expect(rows.length, `nessuna riga admin_users creata per ${email}`).toBeGreaterThan(0)
    } finally {
      await deleteInviteTokenById(id).catch(() => {})
      await cleanupRegisteredUser(email)
    }
  })
})
