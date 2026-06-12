# Database

## Migration alignment (storia)

Il DB remoto fu inizializzato con naming timestamped prima di adottare il naming numerico locale. I file 001–007 sono stati marcati come `applied` tramite `supabase migration repair` il 2026-05-13.

I 6 timestamp remoti orfani (20260504181204–20260513010545) sono stati marcati come `reverted` il 2026-05-13 tramite `supabase migration repair --status reverted`, eliminando il blocco su `db push`.

### Stato migrazioni

> **Fonte di verità (non questo riepilogo):** elenco file in `supabase/migrations/` + stato remoto via MCP `list_migrations` dopo `get_project_url` (TEST `docnnernvp`, PROD `rwuxgvld` sola lettura). Dettaglio workflow e anomalie storiche: `Database-Skill/DB_MIGRATIONS_CONTEXT.md`.

Ultimo file in repo (verificato 12-06-26): `045_menu_magazzino_is_available.sql`. La prossima migrazione deve usare il prefisso **`046_`**.

| Versione | File | Note sintetiche |
|----------|------|-----------------|
| 001–012 | schema base, RLS, CRM, tavoli, service_slots | vedi file in `supabase/migrations/` |
| 013–021 | edition, RLS gates, RPC jsonb service_slots | applicate via MCP (naming timestamp in prod) |
| 019 | `019_cleanup_booking_time_slots.sql` | DELETE chiave legacy `booking_time_slots` |
| 022–025 | overrides, max_turns_resume, slot_color, RLS classic | rollout prod 2026-05-22 |
| 026–027 | security hardening, ip_blacklist | |
| 028–029 | promo menù (`menu_promo_labels`, pulizia vol-au-vent) | report 23-05-26 |
| 030–039 | menu QR, foto, tenant_features, homepage config, hardening vista pubblica | schema in `DB_SCHEMA_CONTEXT.md` |
| 040 | `040_clamp_booking_carousel_slide_text_limits.sql` | funzioni clamp testi carosello Prenota + UPDATE `booking_public_form_config` |
| 041 | `041_menu_qr_theme_green_wellness.sql` | tema `green_wellness` su `menu_qr_codes` e `menu_homepage_config` |
| 042 | `042_menu_qrcode_categories_icon.sql` | colonna `menu_qrcode_categories.icon` |
| 043 | `043_drop_menu_qr_preset_columns.sql` | DROP `menu_qr_codes.content_type`, `preset_ids` (codice morto) |
| 044 | `044_fix_booking_count_skip_restore.sql` | trigger `increment_booking_count_on_accept`: skip `deleted → accepted` |
| 045 | `045_menu_magazzino_is_available.sql` | `is_available` su `menu_categories` e `menu_items` (magazzino M3) |

> Promo menù (23-05-26): impostazioni solo su `restaurant_settings.setting_key = booking_menu_promos`. Report: `docs/Sessioni di lavoro/23-05-26/Report-refactor-promo-menu-rimozione-vol-au-vent.md`.

> **Ambiente (2026-05-16)**: lo sviluppo punta al **server di TEST** (`docnnernvp`, MCP `Supabase_test`). Produzione (`rwuxgvld`) è sola lettura salvo richiesta esplicita. Dettaglio in `APP_CONTEXT_SKILL.md` §1b.

> **Data API Supabase (2026-05-28)**: dal 30 maggio 2026 sui nuovi progetti, e dal 30 ottobre 2026 sulle nuove tabelle dei progetti esistenti, le tabelle `public` non sono esposte alla Data API senza GRANT espliciti. Ogni nuova tabella deve avere nella migrazione i GRANT minimi coerenti con l'uso: admin `authenticated`, pubblico `anon` solo se davvero pubblico, nessun grant client per tabelle solo service_role.

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
