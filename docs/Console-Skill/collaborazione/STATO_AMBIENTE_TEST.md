# Stato ambiente TEST — baseline reale della Console

> **A cosa serve.** Fotografia di **cosa è già attivo** sul progetto TEST `docnnernvp`
> (`docnnernvpyrbwuzzach`), così il Team parte dalla baseline giusta e sa cosa è "fatto" vs "da fare".
> **Aggiornare questo file** quando l'ambiente cambia (nuovo deploy, nuova policy, nuovo secret).
>
> ⚠️ Alcune attivazioni qui sotto sono state fatte con **SQL diretto su TEST** (non come file di
> migrazione, per non toccare la cartella `supabase/migrations/` di Matteo che è LOCK). Vanno
> **formalizzate in migrazioni vere** prima di qualunque uso su dati/ambiente reali → vedi `FU-CONSOLE-10`.

**Ultimo aggiornamento:** 2026-06-22 · sessione "attivazione console lato Matteo".

---

## 1. Accesso / login

| Cosa | Valore |
|------|--------|
| Login Console | **email + password** (sostituito il Magic Link — vedi DEC-032) |
| Utente di test | `matteo94cl@gmail.com` (creato in Supabase Auth TEST, email confermata) |
| Allowlist client | `console/.env.local` → `VITE_CONSOLE_ALLOWED_EMAILS=matteo94cl@gmail.com` |
| Allowlist server (Edge) | secret `CONSOLE_ALLOWED_EMAILS=matteo94cl@gmail.com` |
| Allowlist DB (RLS) | tabella `public.console_allowed_emails` contiene `matteo94cl@gmail.com` |

## 2. Scritture (Edge Function)

| Cosa | Valore |
|------|--------|
| Function | `console-admin` **deployata** su TEST, `verify_jwt = false` (auth interna, DEC-023) |
| URL | `https://docnnernvpyrbwuzzach.supabase.co/functions/v1/console-admin` |
| `.env.local` | `VITE_CONSOLE_ADMIN_FUNCTION_URL` = URL sopra |
| Azioni | `update_edition`, `upsert_tenant_feature`, `upsert_restaurant_setting` |
| Guard | scrive **solo** sui 2 tenant sandbox (sotto). Verificato: no-auth→401, sandbox→ok, non-sandbox→403 |

## 3. Lettura (RLS) per l'utente Console

Applicate policy di **sola lettura** per l'utente in allowlist (parte lettura di PLAN-DB-002 + 004):

| Oggetto | Tipo | Note |
|---------|------|------|
| `public.console_allowed_emails` | tabella + RLS on | allowlist DB (scrivibile solo da service role) |
| `public.is_console_user()` | funzione `SECURITY DEFINER` | true se l'email JWT è in allowlist |
| `console_admin_select_organizations` | policy SELECT (authenticated) | l'utente Console vede **tutti** i ristoranti |
| `console_admin_select_tenant_features` | policy SELECT (authenticated) | legge override reali |
| `console_admin_select_restaurant_settings` | policy SELECT (authenticated) | legge impostazioni |

> Le policy esistenti dell'app di Matteo (`admin_*`, `anon_*`) **non sono state toccate**: i ristoratori
> continuano a vedere solo il proprio tenant. Le nuove policy aggiungono solo un canale di lettura.

## 4. Tenant sandbox (unici scrivibili)

| Slug | Nome | tenant_id |
|------|------|-----------|
| `console-classic` | Console Sandbox Classic | `4c694cb8-66af-478f-afd2-8719f07d64b4` |
| `console-pro` | Console Sandbox Pro | `b5436de8-731e-469e-a888-36785823be6b` |

## 5. Stato dei plan-per-matteo

| Plan | Stato reale su TEST |
|------|---------------------|
| PLAN-DB-001 (sandbox) | ✅ eseguito (sessione 22-06 originale) |
| PLAN-DB-002 (allowlist + RLS) | 🟡 **parte lettura eseguita** via SQL diretto (allowlist + `is_console_user` + SELECT policies). Parte UPDATE/scrittura RLS non necessaria (le scritture passano dall'Edge con service role) |
| PLAN-DB-003 (deploy Edge) | ✅ eseguito (function deployata + secret impostato) |
| PLAN-DB-004 (SELECT tenant_features) | ✅ eseguito (policy `console_admin_select_tenant_features`) |
| PLAN-DB-005 (SELECT admin_users) | ✅ eseguito via MCP `apply_migration` (policy `console_admin_select_admin_users`) |
| PLAN-DB-006 (CASCADE delete_tenant) | ✅ **eseguito 2026-06-23** via MCP `apply_migration` (`plan_db_006_cascade_delete_organizations`): 21/21 FK verso `organizations` con `ON DELETE CASCADE`. `delete_tenant` ora elimina aziende con dati operativi |

## 6. Cosa manca / debiti

- **FU-CONSOLE-10**: trasformare in **migrazioni versionate** (file in `supabase/migrations/`) tutte le
  modifiche di schema fatte su TEST fuori dal repo: SQL diretto (allowlist, funzione, 3 policy SELECT) +
  policy `console_admin_select_admin_users` (PLAN-DB-005) + 21 FK `ON DELETE CASCADE` (PLAN-DB-006, 2026-06-23).
  Quelle via MCP sono nello storico del DB remoto TEST ma non nei file del repo. **Owner: team Console**
  (concordato con Matteo 2026-06-23), **in coordinamento** con Matteo per la cartella LOCK e per decidere
  cosa portare in PROD (in particolare il CASCADE distruttivo su booking_requests/customers/email_logs).
- Deploy pubblico della Console (Vercel `console.<dominio>`) — DEC-012, dominio TBD.
- `console/.env.local` non è committato: chi clona il repo lo ricrea (vedi `console/.env.example`).
