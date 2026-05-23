# Audit di sicurezza DB produzione + hardening — 2026-05-23

## Contesto

L'utente ha chiesto un audit "professionale e spietato" del DB di produzione (`rwuxgvldzrkabglkasym.supabase.co`) prima di accettare dati sensibili reali di utenti. L'analisi iniziale ha trovato **5 falle critiche** e 4 hardening importanti.

## Falle trovate (pre-fix)

1. **`organizations` SELECT pubblica `USING (true)`** → tabella intera (`plan`, `max_bookings_per_year`, `edition`, ecc.) leggibile da chiunque, anche anonimo.
2. **`invite_tokens` UPDATE pubblica `USING (true)`** → anonimo poteva rigenerare/riusare token di invito → registrarsi come admin di qualsiasi ristorante. Game-over multi-tenant.
3. **`check_admin_email` callabile da anon** → enumerazione email → phishing mirato su tutti gli admin.
4. **RPC `insert_service_slot` / `update_service_slot` / `insert_service_slot_override`** accettano `tenant_id` come parametro e bypassano RLS perché SECURITY DEFINER. Anonimo conoscendo l'UUID di un tenant poteva scrivere/sovrascrivere fasce orarie altrui.
5. **GRANT iperpermissivi** (TRUNCATE/TRIGGER/REFERENCES/DELETE/UPDATE/INSERT) ad `anon` su tutte le tabelle. RLS bloccava le scritture, ma una policy permissiva aggiunta per sbaglio avrebbe aperto un buco gigante.

Hardening aggiuntivi: 8 funzioni con `search_path` mutable (privilege escalation guard), assenza di `FORCE RLS` (service_role bypassa policy → bug in Edge Function = data leak cross-tenant), 3 indici FK mancanti.

## Cosa è stato fatto

### Migrazioni applicate a PROD (2026-05-23)

- **`026_security_hardening.sql`** + **`026b_fix_organizations_public_view`**: contengono tutte le 9 categorie di fix in un colpo solo.

### Fix DB (sintesi)

| Categoria | Azione |
|---|---|
| `organizations` | Drop policy pubblica → policy `admin_select_own_organization` (authenticated, solo proprio tenant). Vista `organizations_public` (security_invoker) con 5 campi safe + GRANT per-colonna anon. |
| `invite_tokens` | Drop policy anon SELECT/UPDATE. Accesso solo via Edge Function `validate-invite` con service_role. |
| `check_admin_email` | REVOKE EXECUTE da anon/public, GRANT solo authenticated. `search_path` fisso. |
| RPC `insert_service_slot[_override]` / `update_service_slot` | REVOKE EXECUTE da anon. Riscritte in plpgsql con check `tenant_id = current_admin_tenant_id()` → blocca anche admin che provano scrittura cross-tenant. |
| Altre SECURITY DEFINER (`cleanup_rate_limits`, trigger functions, `seed_default_*`, `increment_*`) | EXECUTE revocata da chi non serve. `search_path` fisso su 8 funzioni. |
| FORCE RLS | Attivato su `customers`, `booking_requests`, `email_logs`, `admin_users`, `invite_tokens`. service_role continua a bypassare (BYPASSRLS) → Edge Functions intatte. |
| GRANT tabelle | REVOKE ALL ai ruoli anon/authenticated, GRANT minimi (solo i privilegi davvero usati dalle policy). |
| Indici FK | `idx_bta_service_slot`, `idx_email_logs_booking`, `idx_invite_tokens_org`. |

### Fix codice frontend

- [`src/contexts/TenantContext.tsx`](src/contexts/TenantContext.tsx): `setTenantFromAdmin` ora usa il client `supabase` autenticato per chiamare `check_admin_email` (era `supabasePublic`). `setTenantFromSlug` legge da `organizations_public` invece che dalla tabella.
- [`src/contexts/__tests__/TenantContext.test.tsx`](src/contexts/__tests__/TenantContext.test.tsx): aggiunto mock per `@/lib/supabase` (oltre a `supabasePublic` già esistente).
- [`src/types/database.ts`](src/types/database.ts): rigenerato con `npm run db:types:linked` per includere la vista `organizations_public`.

## Check di fine lavoro

- `npm run typecheck` → ✅ verde
- `npm run lint` → ✅ verde (zero warning)
- `npm run test` → ✅ **132/132 passati** (era 131 + 1 fallito sul mock; ora 132 dopo fix mock)
- Supabase security advisor → **0 ERROR**, restano solo:
  - 1 INFO `rls_enabled_no_policy` su `invite_tokens` (intenzionale: accesso solo via Edge Function service_role)
  - 1 WARN `rls_policy_always_true` su `rate_limits.anon_insert` (intenzionale: serve per registrare i rate limit IP)
  - 5 WARN `authenticated_security_definer_function_executable` (intenzionali: RPC admin con check tenant interno)
  - 1 WARN `auth_leaked_password_protection` → richiede azione manuale utente

## Azioni manuali richieste all'utente (in Supabase Dashboard)

Solo elementi che non posso fare via MCP:

1. **Authentication → Policies → "Leaked password protection"** → ON (blocca password compromesse via HaveIBeenPwned).
2. **Auth → Providers → Email** → verificare "Confirm email" ON.
3. **Settings → API** → assicurarsi che la `service_role` key non sia in repo/`.env` versionati. In dubbio: ruotare.
4. **Settings → Database → SSL Enforcement** → ON.
5. **Database → Backups** → su free i backup sono limitati; per dati sensibili passare a Pro + PITR.
6. **MFA** sull'account owner Supabase.
7. **DPA con Supabase** (firmabile da dashboard) se i clienti sono UE.

## Verdetto

Prima della sessione: **DB non pronto per dati sensibili** (5 falle critiche aperte, una con escalation completa cross-tenant).

Dopo la sessione: **DB pronto per ricevere dati sensibili** una volta completate le 7 azioni manuali sopra. Tutti gli ERROR dell'advisor sono chiusi; i WARN residui sono scelte di design documentate.

## File toccati

- `supabase/migrations/026_security_hardening.sql` (nuovo)
- `src/contexts/TenantContext.tsx`
- `src/contexts/__tests__/TenantContext.test.tsx`
- `src/types/database.ts` (rigenerato)
- `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` (riga 026)
- `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` (sezione `check_admin_email` + nuova `organizations_public`)

Nota: la migrazione `026b` è applicata SOLO al DB remoto via MCP (`apply_migration`), non esiste come file separato. Il file `026_security_hardening.sql` contiene la versione iniziale; la patch della vista è stata applicata direttamente. In TEST entrambe vanno riallineate quando l'ambiente verrà ripreso.
