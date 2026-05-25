# Database

## Migration alignment (storia)

Il DB remoto fu inizializzato con naming timestamped prima di adottare il naming numerico locale. I file 001–007 sono stati marcati come `applied` tramite `supabase migration repair` il 2026-05-13.

I 6 timestamp remoti orfani (20260504181204–20260513010545) sono stati marcati come `reverted` il 2026-05-13 tramite `supabase migration repair --status reverted`, eliminando il blocco su `db push`.

### Stato migrazioni (aggiornato 2026-05-22)

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
| 014–021 | edition gates, service_slots canonical/max_guests, RPC jsonb | applicate (vedi `Database-Skill/DB_MIGRATIONS_CONTEXT.md`) |
| 022 | `022_service_slot_overrides.sql` | TEST ✅ — prod ❌ (da applicare al rollout) |
| 023 | `023_service_slots_max_turns_resume.sql` | TEST ✅ — prod ❌ (da applicare al rollout) |
| 024 | `024_n_canonical_slots.sql` | TEST ✅ — prod ❌ (da applicare al rollout) |
| 019 | `019_cleanup_booking_time_slots.sql` | applicata TEST + prod (vedi `DB_MIGRATIONS_CONTEXT.md`) |
| 028 | `028_booking_menu_promo_labels.sql` | TEST ✅ — colonna `menu_promo_labels` su `booking_requests` |
| 029 | `029_rename_booking_menu_promo_settings.sql` | TEST ✅ — pulizia chiavi `booking_vol_au_vent_*` e JSON omaggio menù; **prod da applicare** |
| 030–034 | menu QR, homepage config, description categorie, override QR | vedi `Database-Skill/DB_MIGRATIONS_CONTEXT.md` |
| 035 | `035_menu_categories_image_url.sql` | TEST ✅ — `menu_categories.image_url` (foto categoria Prenota); **prod da applicare** |

La prossima migrazione deve usare il prefisso **`036_`**.

> Promo menù (23-05-26): impostazioni solo su `restaurant_settings.setting_key = booking_menu_promos`. Report: `docs/Sessioni di lavoro/23-05-26/Report-refactor-promo-menu-rimozione-vol-au-vent.md`.

> **Ambiente (2026-05-16)**: lo sviluppo punta al **server di TEST** (`docnnernvp`, MCP `Supabase_test`). Produzione (`rwuxgvld`) è sola lettura salvo richiesta esplicita. Dettaglio in `APP_CONTEXT_SKILL.md` §1b.

> **Registro prod (verificato 2026-05-22)**: prod usa versioni timestamp (`20260513...`–`20260515183055`) per le 008–021, più versioni numeriche `001`–`007`. Le 022/023/024 **non sono nel registro prod**. Per applicarle usare `Supabase__apply_migration` (mai `supabase db push`).

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
