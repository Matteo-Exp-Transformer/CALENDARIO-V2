---
name: calendarbackup-db
description: >-
  Entry point for database work in CalendarBackup-v2: schema, numbered
  migrations, multi-tenant RLS, SQL functions/triggers, generated TypeScript
  types, Supabase TEST vs PROD safety. Use before creating migrations, editing
  policies, adding tables, or regenerating types.
---

# CalendarBackup — Database (Cursor pointer)

Puntatore stabile per Cursor. **Non duplica** RULE/LOCK: vivono nei file versionati del repo.

## Prima di toccare il codice
1. Leggi il **mini-pack** (~1 schermata): `docs/Database-Skill/DB_MINI.md`.
2. Poi `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` (sempre) + `DB_MIGRATIONS_CONTEXT.md` se crei
   migrazioni, e `docs/Database-Skill/DB_SKILL.md` intero per workflow + invarianti.
3. **Ambiente:** `get_project_url` deve essere TEST `docnnernvp` prima di scrivere; `rwuxgvld` (PROD)
   → fermati e chiedi conferma. Migrazioni CLI TEST via `npm run db:apply`; `db push --include-all`
   vietato.

Routing ufficiale e profili: `docs/APP_CONTEXT_SKILL.md` §0 + §0.0b.
