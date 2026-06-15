# DATABASE — Mini-pack d'area (ingresso rapido)

> **Cos'è.** Ingresso ~1 schermata per lavoro su **schema DB, migrazioni, RLS, funzioni SQL, tipi
> generati**. **Non duplica** le RULE: per il testo pieno apri `DB_SKILL.md` + i context.
> Design: `Sessioni di lavoro/12-06-26/Design-wp-e1-mini-pack-area-12-06-26.md`.

## 1. Trigger
«migrazione» · «ALTER/CREATE TABLE» · «RLS/policy» · «`current_admin_tenant_id()`» · «trigger /
funzione SQL» · «`database.ts` / `db:types:linked`» · «`migration list` / repair» · «query hook che
tocca il DB».

## 2. Carica subito
- **`DB_SCHEMA_CONTEXT.md`** (sempre, passo 1) — schema, RLS, tipi, funzioni/trigger.
- `DB_MIGRATIONS_CONTEXT.md` se crei migrazioni / `db push` / repair.
- `DB_SKILL.md` intero — workflow + invarianti.

## 3. Divieti top-3
1. **MAI modificare migrazioni già applicate** (`supabase/migrations/` è LOCK). Nuove migrazioni:
   naming numerico progressivo (`050_*`, mai timestamp).
2. **Ambiente:** prima di `apply_migration`/`execute_sql`/`generate_types` → `get_project_url` deve
   essere TEST `docnnernvp`. Se `rwuxgvld` (PROD) → FERMATI e chiedi conferma. `supabase db push`
   vietato. I MCP non leggono `.env.local`.
3. **Ogni tabella dati:** `tenant_id UUID NOT NULL` + RLS `admin_*` + `USING (tenant_id =
   current_admin_tenant_id())` + trigger `enforce_*_tenant` + GRANT minimi espliciti (Data API 2026).
   Due client (`supabase` admin / `supabasePublic` anonimo) — non mischiare.

## 4. Mappa file
| Se il task tocca… | Apri |
|---|---|
| Schema, RLS, tipi, funzioni/trigger | `DB_SCHEMA_CONTEXT.md` |
| Nuova migrazione / ALTER / CREATE / push / repair | `DB_MIGRATIONS_CONTEXT.md` |
| Workflow completo + invarianti + commit convention | `DB_SKILL.md` §§1-4 |
| Reset dati TEST (non schema) | `RESET_TEST_DATABASE.md` |
| Query hook (TanStack) che tocca il DB | `DB_SCHEMA_CONTEXT.md` + context sezione admin |
| Whitelist anon `restaurant_settings` (nuova key pubblica) | `DB_SCHEMA_CONTEXT.md` § restaurant_settings + FU-B2-WHITELIST |

## 5. LOCK (solo link)
- **`supabase/migrations/` applicate** = immutabili → `DB_SKILL.md` §2.
- **`src/lib/supabase.ts`** (client autenticato) — non toccare → `DB_SKILL.md` §2.
- **Doppio prefisso `003`** (falso positivo `migration list`) — non rinominare → `DB_SKILL.md` §3.
- **Dopo migrazione applicata:** `npm run db:types:linked` → §1.
