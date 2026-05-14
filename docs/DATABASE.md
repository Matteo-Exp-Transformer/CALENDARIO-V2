# Database

## Migration alignment (storia)

Il DB remoto fu inizializzato con naming timestamped prima di adottare il naming numerico locale. I file 001–007 sono stati marcati come `applied` tramite `supabase migration repair` il 2026-05-13.

I 6 timestamp remoti orfani (20260504181204–20260513010545) sono stati marcati come `reverted` il 2026-05-13 tramite `supabase migration repair --status reverted`, eliminando il blocco su `db push`.

### Stato migrazioni (aggiornato 2026-05-14)

| Versione | File | Stato |
|----------|------|-------|
| 001 | `001_schema_completo.sql` | applicata |
| 002 | `002_rls_admin_users.sql` | applicata |
| 003 | `003_fix_tenant_usage_triggers_security_definer.sql` | applicata |
| 003 | `003_menu_categories.sql` | applicata (falso positivo in `migration list` — vedi sotto) |
| 004 | `004_default_menu_categories_new_organization.sql` | applicata |
| 005 | `005_menu_items_booking_types.sql` | applicata |
| 006 | `006_customers_crm.sql` | applicata |
| 007 | `007_tables.sql` | applicata |
| 008 | `008_rooms_and_table_layout.sql` | applicata |
| 009 | `009_booking_source_and_noshow.sql` | applicata |
| 010 | `010_service_slots.sql` | applicata |
| 011 | `011_booking_table_assignments.sql` | applicata |
| 012 | `012_service_slots_preset_signup.sql` | applicata |
| 013 | `013_tenants_edition.sql` | applicata via MCP Supabase (2026-05-14) |

La prossima migrazione deve usare il prefisso **`014_`**.

### Limite noto: `supabase db push` da CLI

A partire dalla 013, la CLI `npx supabase db push` restituisce un errore di disallineamento tra versioni locali numeriche e registro remoto. Il push fallisce con:
```
Remote migration versions not found in local migrations directory.
```
**Workaround adottato**: applicare le migrazioni DDL tramite **MCP Supabase** (`apply_migration`) direttamente sul DB remoto, e creare il file `.sql` localmente solo come documentazione. Il file locale NON viene inserito nel registro `schema_migrations` dalla CLI.

Se si vuole riallineare la CLI: `npx supabase migration repair --status applied 013`.

### Limite noto: doppio prefisso 003

Esistono due file con prefisso `003`:
- `003_fix_tenant_usage_triggers_security_definer.sql`
- `003_menu_categories.sql`

La tabella `schema_migrations` ha primary key su `version`, quindi può registrare una sola voce `003`. La seconda riga in `migration list --linked` mostra sempre `Remote` vuoto per `003_menu_categories.sql` — questo è atteso e non indica un problema funzionale. La tabella `menu_categories` esiste correttamente nel DB.

`db push --dry-run` segnala `003_menu_categories.sql` come pendente — è un falso positivo dovuto al doppio prefisso. Non eseguire `db push --include-all` per questo file: il push fallisce sulla constraint `schema_migrations_pkey` (la versione `003` esiste già).
