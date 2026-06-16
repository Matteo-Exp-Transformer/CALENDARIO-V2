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

Lo script di seed via SQL diretto (`seed_e2e_test_tenants.sql`) è stato **rimosso (16-06-26)**: creava utenti con INSERT diretto in `auth.users`, che GoTrue non riconosce per il login. Per ricreare i tenant/admin E2E vedi `tests/README.md` §3 — usare `supabase.auth.admin.createUser()` via SDK o il portale Supabase Auth, mai INSERT SQL diretto. Tracciato in `docs/FOLLOW_UP.md` → **FU-052**.

Copia per agenti: `docs/Database-Skill/scripts/reset_test_database.sql` — tenere allineata a questo file.
