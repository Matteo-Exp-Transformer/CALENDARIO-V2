# Database

## Migration alignment (storia)

Il DB remoto fu inizializzato con naming timestamped prima di adottare il naming numerico locale. I file 001–007 sono stati marcati come `applied` tramite `supabase migration repair` il 2026-05-13.

I 6 timestamp remoti orfani (20260504181204–20260513010545) sono stati marcati come `reverted` il 2026-05-13 tramite `supabase migration repair --status reverted`, eliminando il blocco su `db push`.

### Stato migrazioni

> **Fonte di verità (non questo riepilogo):** elenco file in `supabase/migrations/` + stato remoto via MCP `list_migrations` dopo `get_project_url` (TEST `docnnernvp`, PROD `rwuxgvld` sola lettura). Se l'agente ha un canale TEST specifico, seguire le sue istruzioni dedicate. Dettaglio workflow e anomalie storiche: `Database-Skill/DB_MIGRATIONS_CONTEXT.md`.

Ultimo file in repo (verificato 03-08-26): `070_booking_table_assignments_release_notice.sql` (Fase 0 FIX D, TEST). La prossima migrazione deve usare il prefisso **`071_`**.

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
| 046 | `046_codify_policy_drift.sql` | WP-B1: codifica la policy `anon_select_active_organizations` (anon SELECT su `organizations`, `is_active = true`) che esisteva su TEST+PROD ma non era versionata. Necessaria alla vista `organizations_public` security_invoker (039). Applicata TEST+PROD 12-06-26. Nessuna restrizione (chiusura lettura cross-tenant `restaurant_settings` = WP-B2) |
| 047 | `047_restrict_anon_restaurant_settings.sql` | WP-B2: restringe la lettura anon di `restaurant_settings` alle key pubbliche whitelistate; nuove key pubbliche richiedono update registry + migrazione policy |
| 048 | `048_schedule_rate_limits_cleanup.sql` | WP-B5: definisce `cleanup_rate_limits()` e job `pg_cron` orario `cleanup-rate-limits-hourly`. Applicata/verificata su TEST `docnnernvp` 12-06-26 (`048`) e su PROD `rwuxgvld` 12-06-26 (`20260612131057`): `pg_cron`, funzione, job e revoche EXECUTE ok |
| 057–058 | durata fasce + snapshot prenotazione | solo TEST; fondamenta S2 |
| 059 | `059_service_slots_arrival_step.sql` | `arrival_step_minutes` 5–120, default 30; TEST registrata |
| 060 | `060_rpc_get_available_arrival_times.sql` | RPC anon ristretta: capienza residua degli accettati; TEST registrata |
| 061 | `061_rpc_get_public_slot_config.sql` | RPC anon ristretta: fasce + sole soglie operative; TEST registrata |
| 062 | `062_update_service_slot_arrival_step.sql` | estende PATCH RPC Pro senza cambiare firma; TEST registrata |
| 063 | `063_rooms_soft_delete.sql` | S4 Traccia A / D50: `rooms.active boolean NOT NULL DEFAULT true` + indice parziale `rooms_tenant_active_idx`. Eliminazione sala MORBIDA (`useDeleteRoom` soft-delete, `useRooms` filtra `active=true`). Solo aggiunta colonna su tabella esistente → nessun nuovo GRANT, RLS 008 `admin_update_rooms` già copre. **Solo TEST `docnnernvp`; PROD `rwuxgvld` invariata fino a rollout** |
| 064 | `064_booking_occupancy_snapshot_force.sql` | S4 / D25+D37: snapshot `occupancy_start/end`, `turnover_buffer_minutes` e audit overbooking `forced_by_admin/force_reason` su `booking_requests`. **Solo TEST; PROD invariata** |
| 065 | `065_table_assignments_force.sql` | S4 / D25: audit assegnazione forzata `forced_by_admin/force_reason` su `booking_table_assignments`. **Solo TEST; PROD invariata** |
| 066 | `066_booking_requests_served_at.sql` | S4 FIX-2 / S4-REQ-3: `booking_requests.served_at` per archiviazione al checkout. Applicata e verificata su TEST il 02-08-26; **PROD invariata** |
| 067 | `067_public_slot_config_excludes_closed.sql` | RPC pubblica `get_public_slot_config`: esclude le fasce con `max_turns = 0` (servizio chiuso) dall'elenco visto dal form pubblico. **Solo TEST; PROD invariata** |
| 068 | `068_tables_unique_name_per_tenant.sql` | Debito "nome tavolo solo lato app" (handoff S4 §4-bis): indice unico parziale `tables_tenant_active_name_lower_idx` su `tables (tenant_id, lower(btrim(name)))` con `active = true` — seconda barriera dietro `hasDuplicateTableName()` client-side. Applicata e verificata su TEST il 03-08-26 (0 duplicati su 54 tavoli attivi); **PROD invariata** |
| 069 | `069_create_walk_in_with_assignment_rpc.sql` | Debito "walk-in non transazionale" (handoff S4 §4-bis): RPC `SECURITY DEFINER` `create_walk_in_with_assignment` sostituisce insert+rollback-manuale con una scrittura atomica (booking + assignment in un solo corpo PL/pgSQL, `REVOKE` da `anon`). Applicata e verificata su TEST il 03-08-26 con JWT admin reale; **PROD invariata** |
| 070 | `070_booking_table_assignments_release_notice.sql` | Fase 0 senior FIX D (FU-SERV-RELEASE-NOTICE-1, D-D): colonna `booking_table_assignments.release_notice_handled_at timestamptz NULL` — persiste la conferma "Ancora occupato" sull'avviso di fine turno, vale per tutti i dispositivi e resiste al reload. Nessun nuovo GRANT (RLS `admin_update_bta` di `011_booking_table_assignments.sql` già copre). Applicata su TEST il 03-08-26; **PROD invariata** |

> Promo menù (23-05-26): impostazioni solo su `restaurant_settings.setting_key = booking_menu_promos`. Report: `docs/Sessioni di lavoro/23-05-26/Report-refactor-promo-menu-rimozione-vol-au-vent.md`.

> **Ambiente (agg. 2026-06-12)**: lo sviluppo punta al **server di TEST** (`docnnernvp`). Produzione (`rwuxgvld`) è sola lettura salvo richiesta esplicita. Dettaglio in `APP_CONTEXT_SKILL.md` §1b; regole specifiche Codex in `AGENTS.md`.

> **Data API Supabase:** dal 30-05-2026 (nuovi progetti) e dal 30-10-2026 (nuove tabelle su progetti esistenti) le tabelle `public` richiedono GRANT espliciti oltre a RLS. Guardrail operativo: [`Database-Skill/DB_SKILL.md`](Database-Skill/DB_SKILL.md) §1.

> **Registro prod (verificato 2026-05-22)**: prod usa versioni timestamp (`20260513...`–`20260515183055`) per le 008–021, più versioni numeriche `001`–`007`. Le 022/023/024 **non sono nel registro prod**. Per applicarle usare `Supabase__apply_migration` (mai `supabase db push`).

### Migrazioni CLI su TEST

Il registro TEST è stato riallineato il 02-08-26 alle versioni numeriche locali `001`–`066`, poi
esteso fino a `070` il 03-08-26 (`068`/`069`/`070` applicate con `npm run db:apply`). Per
applicare nuove migrazioni su TEST usare:

```bash
npm run db:apply -- --dry-run
npm run db:apply
npm run db:types:linked
```

`npm run db:apply` verifica `supabase/.temp/project-ref = docnnernvpyrbwuzzach` e lancia `db push`
da una workdir temporanea che esclude il falso positivo `003_menu_categories.sql`. Non usare la CLI
per scrivere su PROD.

### Limite noto: doppio prefisso 003

Esistono due file con prefisso `003`:
- `003_fix_tenant_usage_triggers_security_definer.sql`
- `003_menu_categories.sql`

La tabella `schema_migrations` ha primary key su `version`, quindi può registrare una sola voce `003`. La seconda riga in `migration list --linked` mostra sempre `Remote` vuoto per `003_menu_categories.sql` — questo è atteso e non indica un problema funzionale. La tabella `menu_categories` esiste correttamente nel DB.

`db push --dry-run` dalla root segnala `003_menu_categories.sql` come pendente — è un falso positivo dovuto al doppio prefisso. Non eseguire `db push --include-all` per questo file: il push fallisce sulla constraint `schema_migrations_pkey` (la versione `003` esiste già). Usare `npm run db:apply`.
