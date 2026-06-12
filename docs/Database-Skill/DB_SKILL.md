---
name: db
description: >-
  Skill per qualsiasi lavoro su schema DB, migrazioni, RLS, funzioni SQL, tipi
  TypeScript generati e query Supabase in CalendarBackup-v2. Leggere prima di
  creare migrazioni, modificare policy, aggiungere tabelle o rigenerare tipi.
---

# Database — Guida agente

> Stack: PostgreSQL (Supabase) · RLS multi-tenant · naming numerico migrazioni · tipi generati da Supabase CLI.

---

## 0. Prima cosa: leggi il task → carica il context

**Passo 1 — sempre obbligatorio:**
Leggi `docs/Database-Skill/DB_SCHEMA_CONTEXT.md`.

**Passo 2 — leggi il task ricevuto e applica questa tabella:**

| Il task menziona… | Leggi anche |
|-------------------|-------------|
| Nuova migrazione / ALTER TABLE / CREATE TABLE | `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` |
| RLS / policy / `current_admin_tenant_id()` | `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` § RLS |
| Tipi TypeScript / `database.ts` / `db:types:linked` | `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` § Tipi |
| `supabase db push` / `migration list` / repair | `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` |
| Trigger / funzioni SQL | `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` § Funzioni e Trigger |
| Query hook (`useQuery`, TanStack) che tocca il DB | `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` + context della sezione admin |

Carica i file indicati **prima** di aprire qualsiasi file da modificare.

---

## 1. Workflow

1. Carica context (step 0)
2. **Leggi** le migrazioni esistenti rilevanti — mai modificare quelle già applicate
3. **Crea** il file migrazione numerato progressivamente (`008_*.sql`, `009_*.sql`, …)
4. **Verifica ambiente**: con MCP `get_project_url` deve essere TEST `docnnernvp`; se il tuo agente ha istruzioni specifiche per TEST, applicale senza toccare PROD
5. **Applica** sul canale TEST autorizzato nell'ambiente agente; non usare mai `supabase db push`
6. **Rigenera** tipi con MCP test / `npm run db:types:linked` solo se il link punta al DB test corretto
7. **Valida**: `npm run typecheck && npm run lint && npm run test`

---

## 2. Invarianti — non negoziabili

```
LOCK  supabase/migrations/          — file già applicati: MAI modificare
LOCK  src/lib/supabase.ts           — client autenticato
→ Per regole su TenantContext vedi APP_CONTEXT_SKILL.md §4

RULE  Ogni tabella dati ha tenant_id UUID NOT NULL REFERENCES organizations(id)
RULE  Ogni tabella ha RLS abilitata + policy admin_* per SELECT/INSERT/UPDATE/DELETE
RULE  Ogni policy usa USING (tenant_id = current_admin_tenant_id())
RULE  Trigger di tenant enforcement (enforce_*_tenant) su ogni nuova tabella
RULE  Naming migrazioni: 008_*, 009_*, … (numerico progressivo, MAI timestamp)
RULE  Dopo ogni migrazione applicata: npm run db:types:linked
RULE  Due client Supabase: supabase (admin auth) / supabasePublic (anonimo) — non mischiare
RULE  Supabase Data API 2026: ogni nuova tabella in schema public richiede GRANT espliciti minimi nella migrazione
      - Tabelle admin: GRANT SELECT, INSERT, UPDATE, DELETE TO authenticated + RLS admin_*
      - Tabelle pubbliche read-only: GRANT SELECT TO anon, authenticated + policy SELECT anon mirata
      - Tabelle scritte solo da Edge Function/service_role: nessun GRANT anon/authenticated se non serve al client
RULE  Email customers: normalizeCustomerEmail() prima di confronto o scrittura
RULE  cancelled_by è UUID auth.users.id — MAI passare email a campi UUID
```

---

## 3. Limite noto — doppio prefisso 003

Due file hanno prefisso `003`:
- `003_fix_tenant_usage_triggers_security_definer.sql`
- `003_menu_categories.sql`

`migration list --linked` mostra sempre una riga `003` con Remote vuoto — **falso positivo**, non un problema. Regola corrente del progetto: non usare `db push` né `db push --include-all`; applicare dal canale TEST autorizzato nell'ambiente agente.

---

## 4. Commit convention

```
feat(db): ...   fix(db): ...   update(db): ...
```

---

## 5. Reset dati TEST (non schema)

Per azzerare tenant, prenotazioni e `auth.users` su staging: [`RESET_TEST_DATABASE.md`](RESET_TEST_DATABASE.md) + [`scripts/reset_test_database.sql`](scripts/reset_test_database.sql). Mai su PROD.

---

## 6. Verifica post-modifica

```bash
npm run db:types:linked   # rigenera src/types/database.ts
npm run typecheck         # zero errori TS
npm run lint              # zero warning
npm run test              # 29/29 Vitest
```
