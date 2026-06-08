---
name: calendarbackup-db-safety
description: Usa questa skill per DB, Supabase, RLS, migrazioni, auth, tenant_features, tipi database, policy, RPC e dati remoti.
---

# CalendarBackup DB safety

Questa skill serve a evitare modifiche pericolose su database, Supabase e produzione.

## Quando usarla

Usala per task su:

- Supabase;
- DB, schema, migrazioni;
- RLS, policy, RPC, trigger;
- Auth;
- tenant, tenant_features, feature flag remoti;
- `database.types.ts` o tipi generati;
- query remote o MCP Supabase.

## Fonti da leggere

1. `docs/Database-Skill/DB_SKILL.md`
2. `docs/DATA_FLOW_SKILL.md`
3. `docs/DATABASE.md`
4. `docs/APP_CONTEXT_SKILL.md` §1b per TEST vs PROD

## Regole di sicurezza

- TEST = `docnnernvp`.
- PROD = `rwuxgvld`.
- Prima di INSERT, UPDATE, DELETE, migrazioni o apply SQL verifica sempre il project ref.
- Se il ref e PROD, fermati e chiedi conferma esplicita.
- I modelli locali non applicano migrazioni e non modificano DB: preparano piano o review.
- Le modifiche DB sono riservate a Codex/Claude.
- Non dichiarare migrazioni o test DB riusciti senza output reale.

## Output minimo

- Ambiente rilevato o non verificato.
- Azione richiesta.
- Rischio DB.
- Skill lette.
- Cosa e consentito.
- Cosa e vietato.
- Prossima azione sicura.
