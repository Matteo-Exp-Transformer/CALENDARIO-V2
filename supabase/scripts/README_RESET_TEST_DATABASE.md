# Reset database TEST (solo dati)

Manovra per ripartire con staging vuoto: **nessun tenant, nessun utente auth, nessuna prenotazione**, mantenendo schema, RLS, funzioni e migrazioni.

## Salvaguardia ambiente

| Progetto | Ref URL | Azione |
|----------|---------|--------|
| **TEST** | `docnnernvp` → `https://docnnernvpyrbwuzzach.supabase.co` | OK |
| **PROD** | `rwuxgvld` | **STOP** — non eseguire |

Prima di ogni DELETE: MCP `get_project_url` sul server **`user-supabase-test`**. Se l’URL non contiene `docnnernvp`, fermarsi.

## Script

[`reset_test_database.sql`](reset_test_database.sql)

## Dopo il reset

Seed tenant E2E: `supabase/scripts/seed_e2e_test_tenants.sql` (vedi `tests/README.md` §3).

Copia per agenti: `docs/Database-Skill/scripts/reset_test_database.sql` — tenere allineata a questo file.
