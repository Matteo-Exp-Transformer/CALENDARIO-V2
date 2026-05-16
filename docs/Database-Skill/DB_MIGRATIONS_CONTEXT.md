# Database — Migrazioni: stato, workflow, storico

> Context per sessioni che toccano migrazioni, `supabase db push`, repair o naming.

---

## 1. Stato migrazioni (aggiornato 2026-05-15)

> ⚠️ **DUE ambienti Supabase distinti — non confonderli:**
> - **PRODUZIONE**: `rwuxgvldzrkabglkasym.supabase.co` — MCP server "Supabase".
> - **TEST/staging**: `docnnernvpyrbwuzzach.supabase.co` — MCP server "Supabase test". È l'ambiente che l'utente usa di solito da browser in sviluppo (l'URL appare nei suoi errori console).
>
> Una migrazione applicata via MCP su un ambiente **NON** si propaga all'altro. Vanno applicate esplicitamente a entrambi. La colonna "Remote" qui sotto si riferisce a **produzione**. Prima di diagnosticare un errore DB visto dall'utente, verificare su quale ambiente sta testando (guardare l'URL Supabase negli errori: `docnnernvp`=test, `rwuxgvld`=prod).

```
 Local | Remote | File
-------|--------|----------------------------------------------
 001   | 001    | 001_schema_completo.sql
 002   | 002    | 002_rls_admin_users.sql
 003   | 003    | 003_fix_tenant_usage_triggers_security_definer.sql
 003   |        | 003_menu_categories.sql  ← falso positivo (vedi § 3)
 004   | 004    | 004_default_menu_categories_new_organization.sql
 005   | 005    | 005_menu_items_booking_types.sql
 006   | 006    | 006_customers_crm.sql
 007   | 007    | 007_tables.sql
 008   | 008    | 008_rooms_and_table_layout.sql
 009   | 009    | 009_booking_source_and_noshow.sql
 010   | 010    | 010_service_slots.sql
 011   | 011    | 011_booking_table_assignments.sql
 012   | 012    | 012_service_slots_preset_signup.sql
 013   | 013*   | 013_tenants_edition.sql  ← applicata via MCP (2026-05-14)
 014   | 014*   | 014_rls_edition_gates.sql  ← RLS Pro-only su customers/service_slots/bta/rooms/tables (2026-05-14)
 015   | 015*   | 015_check_admin_email_with_edition.sql  ← RPC estesa con slug/org_name/edition (2026-05-14)
 016   | 016*   | 016_service_slots_canonical.sql  ← colonna is_canonical su service_slots; 3 canoniche marcate; trigger signup aggiornato (2026-05-15)
 017   | 017*   | 017_service_slots_max_guests.sql  ← colonna max_guests INTEGER DEFAULT NULL su service_slots (2026-05-15)
 018   | 018*   | 018_rpc_update_service_slot.sql  ← RPC insert + update_service_slot a 9 param (poi superata da 021) (2026-05-15)
 019   |        | 019_cleanup_booking_time_slots.sql  ← DELETE chiave deprecata booking_time_slots da restaurant_settings (NON applicata) (2026-05-15)
 020   | 020*   | 020_drop_legacy_update_service_slot.sql  ← DROP firma legacy update_service_slot a 8 param (fix PGRST202 overloading) (2026-05-15)
 021   | 021*   | 021_update_service_slot_jsonb.sql  ← update_service_slot riscritta con SINGOLO param jsonb (firma univoca, immune a PGRST202); DROP firma a 9 param (2026-05-15)
 022   | 022 TEST | 022_service_slot_overrides.sql  ← tabella service_slot_overrides + RPC insert_service_slot_override(jsonb). Applicata SOLO su TEST (docnnernvp). NON su produzione (2026-05-16)
```

*Le 013-018, 020, 021 sono applicate sul DB **produzione** via MCP `apply_migration`. Sul **DB di test** sono state applicate via MCP solo 016, 017, 018(insert)+021 (allineamento 2026-05-15) — il resto dello storico test non è verificato.

La 019 (`019_cleanup_booking_time_slots.sql`) **NON è applicata** né su produzione né su test — solo file locale, da applicare manualmente.

> **Nota PGRST202 — soluzione definitiva (2026-05-15)**: il bug è ricomparso più volte perché una RPC con N parametri opzionali è fragile con PostgREST (qualsiasi ambiguità o schema cache stale → "function not found"). Storia: 018 v1 creò la firma a 8 param; 018 v2 ne aggiunse una a 9 param senza sostituire la prima (overloading → PGRST202); 020 droppò la 8 param ma il problema poteva tornare per cache stale. **021 risolve alla radice**: `update_service_slot(payload jsonb)` — un solo parametro, firma univoca, niente più risoluzione di overload. Semantica PATCH: chiave assente = mantieni; `"max_guests": null` = azzera (presenza della chiave = intento). Il flag `p_clear_max_guests` non serve più.

Su **produzione**: 001–018, 020, 021 applicate. La **022** è applicata **solo su TEST** (`docnnernvp`, 2026-05-16) — su produzione NON ancora: andrà applicata su richiesta esplicita quando la feature "modifiche a tempo fasce" va live. La prossima migrazione deve essere `023_*.sql`. **Su test lo storico è parziale** — vedi nota * sopra.

> **Direttiva ambiente (2026-05-16)**: lo sviluppo punta al **server di TEST**. Migrazioni / RPC / rigenerazione tipi via MCP `Supabase_test__*` (`docnnernvp`), mai su produzione (`rwuxgvld`, MCP `Supabase__*`, sola lettura). Verificare sempre con `get_project_url` prima di `apply_migration`. Vedi `APP_CONTEXT_SKILL.md` §1b.

---

## 2. Workflow migrazione nuova

```bash
# 1. Crea il file (naming numerico progressivo)
# supabase/migrations/014_nome_descrittivo.sql

# 2a. Prova prima con CLI
npx supabase db push

# 2b. Se CLI fallisce (disallineamento versioni) → usa MCP Supabase
#     apply_migration(name, query)  — applica DDL direttamente sul DB remoto
#     Poi: npx supabase migration repair --status applied 013  (allinea registro)

# 3. Rigenera i tipi TypeScript
npm run db:types:linked

# 4. Valida
npm run typecheck && npm run lint && npm run test
```

> Non usare `supabase migration new` — genera naming timestamp. Creare il file SQL manualmente con prefisso numerico.

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

**Soluzione per riallineare**:
```bash
npx supabase migration repair --status applied 013
```

**Soluzione alternativa permanente**: continuare ad applicare DDL via MCP `apply_migration` + creare il file `.sql` localmente come documentazione + eseguire `repair` dopo ogni migrazione.

---

## 4b. Storico alignment (2026-05-13)

Il DB remoto fu inizializzato con naming **timestamped** (20260504181204–20260513010545) prima di adottare il naming numerico. Il disallineamento è stato risolto in due passi:

**Passo 1:** `migration repair --status applied 001..007`
→ ha inserito le versioni numeriche nel registro remoto.

**Passo 2:** `migration repair --status reverted 20260504181204 20260504190830 20260506091358 20260509105711 20260512175416 20260513010545`
→ ha rimosso le 6 voci timestamp orfane dal registro remoto.

Il registro remoto ora contiene solo le versioni numeriche 001–007.

---

## 5. Comandi utili

```bash
# Verifica stato migrazioni
npx supabase migration list --linked

# Dry run (vedi cosa verrebbe applicato)
npx supabase db push --dry-run

# Applica migrazioni pendenti
npx supabase db push

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
| ✅ Numerico progressivo | `008_nome_funzionalita.sql` | Standard del progetto |
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
```
