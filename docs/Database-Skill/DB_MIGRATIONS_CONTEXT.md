# Database — Migrazioni: stato, workflow, storico

> Context per sessioni che toccano migrazioni, `supabase db push`, repair o naming.

---

## 1. Fonte di verità migrazioni

**Non usare questo file come elenco statico Local|Remote** — gli elenchi marciti invecchiano in pochi giorni.

### Fonti verificabili (ordine obbligatorio)

1. **Repo (versionato):** `supabase/migrations/*.sql` — naming `NNN_descrizione.sql`. Glob dalla root del progetto.
2. **Remoto (sola lettura per consultazione):** MCP `get_project_url` → deve rispondere TEST `docnnernvp` (sviluppo) o PROD `rwuxgvld` (sola lettura salvo conferma esplicita). Poi `list_migrations`. Se l'agente ha un canale TEST specifico, seguire le istruzioni dedicate dell'agente senza estenderle agli altri ambienti.
3. **Schema colonne/tabelle:** `DB_SCHEMA_CONTEXT.md` — aggiornare dopo ogni migrazione che introduce colonne.

Ultimo file in repo (verificato 24-06-26): **`065_table_assignments_force.sql`** (S4, solo TEST). Prossima nuova migrazione: prefisso **`066_`**.

### Indice repo 040–048 (sintesi schema — non sostituisce i file SQL)

| File | Contenuto |
|------|-----------|
| `040_clamp_booking_carousel_slide_text_limits.sql` | Funzioni `clamp_text_jsonb_field`, `normalize_booking_carousel_slide_item`, `normalize_booking_public_form_config_carousel`; UPDATE `restaurant_settings` dove `setting_key = 'booking_public_form_config'` |
| `041_menu_qr_theme_green_wellness.sql` | CHECK `theme_key` include `green_wellness` su `menu_qr_codes` e `menu_homepage_config` |
| `042_menu_qrcode_categories_icon.sql` | `menu_qrcode_categories.icon TEXT NULL` |
| `043_drop_menu_qr_preset_columns.sql` | DROP `menu_qr_codes.content_type`, `preset_ids` |
| `044_fix_booking_count_skip_restore.sql` | `increment_booking_count_on_accept()` — non conta transizione `deleted → accepted` |
| `045_menu_magazzino_is_available.sql` | `menu_categories.is_available`, `menu_items.is_available` BOOLEAN NOT NULL DEFAULT true |
| `046_codify_policy_drift.sql` | Codifica policy RLS `anon_select_active_organizations` (anon SELECT su `organizations`, `is_active = true`), prima presente sul DB ma fuori dalle migrazioni. Idempotente. NON restringe `restaurant_settings` (→ WP-B2) |
| `047_restrict_anon_restaurant_settings.sql` | WP-B2: restringe anon SELECT su `restaurant_settings` a whitelist di key pubbliche; nuove key pubbliche richiedono update registry + nuova migrazione policy |
| `048_schedule_rate_limits_cleanup.sql` | WP-B5: abilita `pg_cron`, definisce `cleanup_rate_limits()` e programma job orario `cleanup-rate-limits-hourly`. TEST applicata/verificata 12-06-26 (`048`); PROD applicata/verificata 12-06-26 (`20260612131057`) |
| `057`–`058` | Durata fasce + snapshot prenotazione (fondamenta S2). **Solo TEST.** |
| `059_service_slots_arrival_step.sql` | `arrival_step_minutes` 5–120, default 30 (S3). **Solo TEST.** |
| `060_rpc_get_available_arrival_times.sql` | RPC anon ristretta: capienza residua accettati (S3). **Solo TEST.** |
| `061_rpc_get_public_slot_config.sql` | RPC anon ristretta: fasce + soglie operative (S3). **Solo TEST.** |
| `062_update_service_slot_arrival_step.sql` | Estende PATCH RPC Pro senza cambiare firma (S3). **Solo TEST.** |
| `063_rooms_soft_delete.sql` | S4 Traccia A / D50: `rooms.active boolean NOT NULL DEFAULT true` + indice parziale `rooms_tenant_active_idx`. Abilita l'eliminazione sala MORBIDA (`useDeleteRoom` soft-delete). **Solo TEST `docnnernvp`; PROD invariata.** |
| `064_booking_occupancy_snapshot_force.sql` | S4 / D25+D37: snapshot finestra occupazione e audit overbooking su `booking_requests`. **Solo TEST; PROD invariata.** |
| `065_table_assignments_force.sql` | S4 / D25: audit assegnazione forzata su `booking_table_assignments`. **Solo TEST; PROD invariata.** |

### Due ambienti Supabase — non confonderli

- **PRODUZIONE**: `rwuxgvldzrkabglkasym.supabase.co` — canale PROD autorizzato, sola lettura salvo conferma esplicita.
- **TEST/staging**: `docnnernvpyrbwuzzach.supabase.co` — canale TEST autorizzato nell'ambiente agente. Ambiente di sviluppo abituale.

Una migrazione applicata su un ambiente **NON** si propaga all'altro. Prima di diagnosticare un errore DB, verificare su quale ambiente sta testando l'utente (`docnnernvp` = test, `rwuxgvld` = prod).

### Snapshot remoto TEST (12-06-26)

Registro remoto TEST allineato a `048` il 12-06-26. In sessione Codex, il connettore Supabase ChatGPT vedeva solo l'organizzazione PROD; con conferma esplicita Matteo, Codex ha applicato `048` su TEST via CLI Supabase dopo checklist progetto/link, poi ha marcato il registro con `migration repair --status applied 048 --linked`. Verificati `pg_cron`, funzione `public.cleanup_rate_limits()`, job `cleanup-rate-limits-hourly` (`17 * * * *`) e revoke execute da `anon/authenticated`.

> **Nota PROD:** `048_schedule_rate_limits_cleanup` applicata su PROD `rwuxgvld` il 12-06-26 con conferma Matteo; registro `20260612131057`; verificati `pg_cron`, funzione `public.cleanup_rate_limits()`, job `cleanup-rate-limits-hourly` (`17 * * * *`) e revoke execute da `anon/authenticated`.

### Snapshot S3 TEST (23-06-26)

Versioni `059`, `060`, `061`, `062` verificate sullo schema reale e marcate applied via
`migration repair --status applied ... --linked`. Tipi rigenerati dal TEST. Il lock S3 proposto NON è
stato fatto: D36 rende i pending non-capacitivi, quindi non avrebbe enforcement reale oppure violerebbe
il dominio. PROD non toccata.

> **Nota:** la `063` esiste ma è di un altro cantiere (S4 Traccia A, soft-delete sale — vedi voce
> in tabella sotto), non il lock S3 qui scartato.

### Snapshot S4 TEST (24-06-26)

`063_rooms_soft_delete.sql` aggiunge `rooms.active boolean NOT NULL DEFAULT true` + indice parziale
`rooms_tenant_active_idx` (filtro `active = true`). Applicata **solo a TEST** (`docnnernvp`), **non in
PROD** (`rwuxgvld` invariata fino a rollout con Matteo). Solo aggiunta colonna su tabella esistente →
nessun nuovo GRANT, RLS `admin_update_rooms` (mig. 008) già copre il soft-delete. Lato client:
`useDeleteRoom` fa soft-delete (`active=false`), `useRooms` filtra `active=true`, nuovo
`useRoomLiveBookings`.

`064_booking_occupancy_snapshot_force.sql` aggiunge a `booking_requests` gli snapshot
`occupancy_start`, `occupancy_end`, `turnover_buffer_minutes` e i campi audit
`forced_by_admin`/`force_reason`. `065_table_assignments_force.sql` aggiunge gli stessi campi audit a
`booking_table_assignments`. Tutte e tre risultano applicate su TEST con versioni remote timestamp
(`20260624015417`, `20260624101337`, `20260624101344`): il nome logico registrato coincide coi file locali.
Schema, default, indice e tipi TypeScript verificati; PROD non toccata.

### Anomalie storiche utili (permanenti)

**Doppio prefisso 003:** due file locali `003_fix_tenant_usage_triggers_security_definer.sql` e `003_menu_categories.sql`. `schema_migrations` ha PK su `version` — una sola riga `003` in Remote. Riga Remote vuota per il secondo file in `migration list --linked` = falso positivo atteso. **NON** eseguire `db push --include-all` per questo warning.

**CLI `db push` post-013:** da migrazione 013 applicata via MCP, `npx supabase db push` può fallire con `Remote migration versions not found in local migrations directory`. Workaround adottato: DDL via MCP `apply_migration` + file `.sql` locale come documentazione.

**PGRST202 / RPC service_slots:** risolto in `021_update_service_slot_jsonb.sql` con firma univoca `update_service_slot(payload jsonb)`. Storia overloading 018→020 documentata nei report 2026-05-15. Non reintrodurre RPC multi-param opzionali.

**Rollout produzione 019–025 (2026-05-22):** applicate in prod via MCP; smoke test OK.

**Allineamento TEST 019 (2026-05-22):** mancava solo 019 nel registro MCP; schema già coerente.

**Registro prod versioni timestamp:** prod usa versioni timestamp (`20260513…`–`20260515183055`) per le 008–021, più numeriche `001`–`007`. Per applicare nuove migrazioni in prod: MCP `apply_migration`, non `supabase db push`.

---

## 2. Workflow migrazione nuova

```bash
# 1. Crea il file (naming numerico progressivo)
# supabase/migrations/049_nome_descrittivo.sql

# 2. Verifica ambiente prima di qualunque SQL remoto
# Il canale TEST autorizzato deve rispondere docnnernvp.

# 3. Applica sul DB TEST dal canale autorizzato dell'agente
# Non usare db push. Se il canale non aggiorna il registro, definire prima
# strategia di verifica schema + repair della migration history.

# 4. Rigenera i tipi TypeScript dal DB test corretto
npm run db:types:linked

# 5. Valida
npm run typecheck && npm run lint && npm run test
```

> Non usare `supabase migration new` — genera naming timestamp. Creare il file SQL manualmente con prefisso numerico.
> Non usare la produzione per "provare" una migrazione: `Supabase__*` (`rwuxgvld`) è sola lettura salvo richiesta esplicita.

---

## 3. Limite noto: doppio prefisso 003

Due file locali hanno prefisso `003`:
- `003_fix_tenant_usage_triggers_security_definer.sql` → abbinato in Remote
- `003_menu_categories.sql` → riga Remote vuota (falso positivo permanente)

**Causa:** `schema_migrations` ha PK su `version` — una sola riga per `003`.
**Impatto:** nessuno. `db push` normale funziona correttamente. Solo `migration list --linked` mostra la riga senza Remote per il secondo file.

**NON eseguire** `db push --include-all` per risolvere questo warning — il push fallisce con `duplicate key on schema_migrations_pkey`.

---

## 4. Limite noto — CLI `db push` e disallineamento post-013 (2026-05-14)

A partire dalla 013, la CLI `npx supabase db push` restituisce:
```
Remote migration versions not found in local migrations directory.
Make sure your local git repo is up-to-date.
```

**Causa**: la 013 è stata applicata via MCP `apply_migration` senza passare dal registro CLI, lasciando le versioni remote non allineate con quelle locali.

**Soluzione alternativa permanente**: continuare ad applicare DDL via MCP `apply_migration` + creare il file `.sql` localmente come documentazione.

---

## 4b. Storico alignment (2026-05-13)

Il DB remoto fu inizializzato con naming **timestamped** (20260504181204–20260513010545) prima di adottare il naming numerico. Il disallineamento è stato risolto in due passi:

**Passo 1:** `migration repair --status applied 001..007`
→ ha inserito le versioni numeriche nel registro remoto.

**Passo 2:** `migration repair --status reverted 20260504181204 20260504190830 20260506091358 20260509105711 20260512175416 20260513010545`
→ ha rimosso le 6 voci timestamp orfane dal registro remoto.

Il registro remoto ora contiene le versioni numeriche 001–007 + versioni timestamp per 008–025.

---

## 5. Comandi utili

```bash
# Verifica stato migrazioni
npx supabase migration list --linked

# Dry run storico/diagnostico: NON usare come via di applicazione in questo repo
npx supabase db push --dry-run

# Vietato in questo repo
# npx supabase db push

# Marca una versione come applicata (senza eseguire SQL)
npx supabase migration repair --status applied <version>

# Marca una versione come revertita (rimuove dal registro, non tocca DB)
npx supabase migration repair --status reverted <version>

# Rigenera tipi TypeScript dal DB remoto
npm run db:types:linked
```

> **npx vs supabase diretto:** `supabase` potrebbe non essere nel PATH globale. Usare `npx supabase` dalla root del repo (è una devDependency).

---

## 6. Naming convention migrazioni

| Pattern | Esempio | Note |
|---------|---------|------|
| ✅ Numerico progressivo | `049_nome_funzionalita.sql` | Standard del progetto |
| ❌ Timestamp | `20260514000000_nome.sql` | Non usare — rompe l'allineamento |
| ❌ Rinominare esistenti | — | **LOCK** — mai rinominare file già applicati |

Il nome descrittivo dopo il numero deve essere snake_case, conciso, che descriva la funzionalità (non la data o il ticket).

---

## 7. Template migrazione nuova tabella

```sql
-- Breve descrizione funzionale della tabella.

CREATE TABLE nome_tabella (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  -- colonne dominio
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX nome_tabella_tenant_id_idx ON nome_tabella (tenant_id);

-- Trigger updated_at (usa funzione esistente update_updated_at())
CREATE TRIGGER trg_nome_tabella_updated_at
  BEFORE UPDATE ON nome_tabella
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger enforce tenant (copia da 007_tables.sql, adatta nome tabella)
CREATE OR REPLACE FUNCTION enforce_nome_tabella_tenant()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE caller_tenant uuid;
BEGIN
  IF auth.role() = 'authenticated' THEN
    caller_tenant := current_admin_tenant_id();
    IF caller_tenant IS NULL THEN
      RAISE EXCEPTION 'admin non riconosciuto';
    END IF;
    IF NEW.tenant_id IS DISTINCT FROM caller_tenant THEN
      RAISE EXCEPTION 'tenant_id diverge dal tenant admin';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enforce_nome_tabella_tenant
  BEFORE INSERT OR UPDATE ON nome_tabella
  FOR EACH ROW EXECUTE FUNCTION enforce_nome_tabella_tenant();

-- RLS
ALTER TABLE nome_tabella ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_select_nome_tabella"
  ON nome_tabella FOR SELECT TO authenticated
  USING (tenant_id = current_admin_tenant_id());

CREATE POLICY "admin_insert_nome_tabella"
  ON nome_tabella FOR INSERT TO authenticated
  WITH CHECK (tenant_id = current_admin_tenant_id());

CREATE POLICY "admin_update_nome_tabella"
  ON nome_tabella FOR UPDATE TO authenticated
  USING (tenant_id = current_admin_tenant_id())
  WITH CHECK (tenant_id = current_admin_tenant_id());

CREATE POLICY "admin_delete_nome_tabella"
  ON nome_tabella FOR DELETE TO authenticated
  USING (tenant_id = current_admin_tenant_id());

-- Data API grants: richiesti da Supabase per nuove tabelle public.
-- Admin-only: il client autenticato passa comunque da RLS.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE nome_tabella TO authenticated;
```
