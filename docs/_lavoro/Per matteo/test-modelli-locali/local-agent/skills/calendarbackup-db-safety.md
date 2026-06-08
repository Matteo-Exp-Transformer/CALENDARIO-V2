# calendarbackup-db-safety

Usa questa skill per DB, Supabase, RLS, migrazioni, auth, tenant features, tipi database, policy, RPC
e dati remoti.

Fonti da leggere quando serve:

1. `docs/Database-Skill/DB_SKILL.md`
2. `docs/DATA_FLOW_SKILL.md`
3. `docs/DATABASE.md`
4. `docs/APP_CONTEXT_SKILL.md` §1b per TEST vs PROD.

Regole:

- TEST = `docnnernvp`.
- PROD = `rwuxgvld`.
- Prima di INSERT, UPDATE, DELETE, migrazioni o SQL remoto verifica sempre il project ref.
- Se il ref e PROD, fermati e chiedi conferma esplicita.
- I modelli locali non applicano migrazioni e non modificano DB: preparano piano o review.
- Le modifiche DB sono riservate a Codex/Claude.
