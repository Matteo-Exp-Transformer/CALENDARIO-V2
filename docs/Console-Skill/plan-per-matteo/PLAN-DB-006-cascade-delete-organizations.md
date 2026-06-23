# PLAN-DB-006 — ON DELETE CASCADE su organizations per `delete_tenant`

**Stato:** ✅ **ESEGUITO su TEST** (2026-06-23, via MCP `apply_migration` `plan_db_006_cascade_delete_organizations`, autorizzato da Matteo) · **Ambiente:** TEST docnnernvp · **Data:** 2026-06-22
**Correlato a:** F10 (Edge `console-admin`), DEC-047, REQ-003

> **Esito 2026-06-23:** migrazione applicata con la versione completa (tutte e 21 le FK). Verifica
> `delete_rule` → **21/21 tabelle = CASCADE**. `delete_tenant` ora elimina qualsiasi azienda anche con
> dati operativi (il gate `confirm_name` resta). ⚠️ **PROD non toccato** — su PROD valutare se conservare
> booking_requests/customers/email_logs a fini di archivio (vedi «Note per Matteo»). Questa migrazione è
> stata applicata via MCP: va ancora **formalizzata come file** in `supabase/migrations/` → **FU-CONSOLE-10**.

## Obiettivo

L'azione `delete_tenant` dell'Edge Function `console-admin` esegue una **hard-delete** di
un'organizzazione (`organizations`). Il problema: **21 tabelle figlie** referenziano
`organizations.id` tramite FK, ma **nessuna** di esse ha `ON DELETE CASCADE`.

L'Edge gestisce lato applicativo la pulizia delle tabelle di configurazione
(`admin_users`, `tenant_features`, `restaurant_settings`) prima di cancellare il parent.
Ma se il tenant ha dati operativi (prenotazioni, clienti, fasce orarie, menu…) la `DELETE`
su `organizations` fallisce con errore di FK e restituisce un 409 chiaro.

Questo PLAN aggiunge `ON DELETE CASCADE` alle FK di tutte le tabelle figlie, così
`delete_tenant` può eliminare qualsiasi tenant in modo pulito con una sola operazione
(fermo restando la rivalidazione del `confirm_name` lato server — DEC-038).

> **ATTENZIONE:** `ON DELETE CASCADE` significa che cancellare un'organizzazione
> cancella in modo **irreversibile** TUTTI i dati ad essa collegati: prenotazioni,
> clienti, fasce, menu, log email, ecc. Eseguire **solo su TEST** (`docnnernvp`).
> Riflettere bene prima di portare in PROD.

---

## Modifica proposta (SQL)

```sql
-- ==========================================================================
-- PLAN-DB-006 — Aggiunta ON DELETE CASCADE su tutte le FK verso organizations
-- ==========================================================================
-- Ambiente: TEST docnnernvp
-- Autore proposta: Console super-admin agent (F10)
-- RULE-3: NON eseguito dall'agente — da eseguire manualmente da Matteo su TEST.
-- ==========================================================================

-- 1. admin_users
ALTER TABLE public.admin_users
  DROP CONSTRAINT admin_users_tenant_id_fkey,
  ADD CONSTRAINT admin_users_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 2. restaurant_settings
ALTER TABLE public.restaurant_settings
  DROP CONSTRAINT restaurant_settings_tenant_id_fkey,
  ADD CONSTRAINT restaurant_settings_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 3. tenant_features
ALTER TABLE public.tenant_features
  DROP CONSTRAINT tenant_features_tenant_id_fkey,
  ADD CONSTRAINT tenant_features_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 4. booking_requests
ALTER TABLE public.booking_requests
  DROP CONSTRAINT booking_requests_tenant_id_fkey,
  ADD CONSTRAINT booking_requests_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 5. customers
ALTER TABLE public.customers
  DROP CONSTRAINT customers_tenant_id_fkey,
  ADD CONSTRAINT customers_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 6. service_slots
ALTER TABLE public.service_slots
  DROP CONSTRAINT service_slots_tenant_id_fkey,
  ADD CONSTRAINT service_slots_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 7. service_slot_overrides
ALTER TABLE public.service_slot_overrides
  DROP CONSTRAINT service_slot_overrides_tenant_id_fkey,
  ADD CONSTRAINT service_slot_overrides_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 8. menu_categories
ALTER TABLE public.menu_categories
  DROP CONSTRAINT menu_categories_tenant_id_fkey,
  ADD CONSTRAINT menu_categories_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 9. menu_items
ALTER TABLE public.menu_items
  DROP CONSTRAINT menu_items_tenant_id_fkey,
  ADD CONSTRAINT menu_items_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 10. menu_qr_codes
ALTER TABLE public.menu_qr_codes
  DROP CONSTRAINT menu_qr_codes_tenant_id_fkey,
  ADD CONSTRAINT menu_qr_codes_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 11. menu_qrcode_categories
ALTER TABLE public.menu_qrcode_categories
  DROP CONSTRAINT menu_qrcode_categories_tenant_id_fkey,
  ADD CONSTRAINT menu_qrcode_categories_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 12. menu_homepage_config
ALTER TABLE public.menu_homepage_config
  DROP CONSTRAINT menu_homepage_config_tenant_id_fkey,
  ADD CONSTRAINT menu_homepage_config_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 13. rooms
ALTER TABLE public.rooms
  DROP CONSTRAINT rooms_tenant_id_fkey,
  ADD CONSTRAINT rooms_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 14. tables (dipende da rooms → elimina rooms prima o CASCADE gestisce in ordine)
ALTER TABLE public.tables
  DROP CONSTRAINT tables_tenant_id_fkey,
  ADD CONSTRAINT tables_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 15. booking_table_assignments
ALTER TABLE public.booking_table_assignments
  DROP CONSTRAINT booking_table_assignments_tenant_id_fkey,
  ADD CONSTRAINT booking_table_assignments_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 16. email_logs
ALTER TABLE public.email_logs
  DROP CONSTRAINT email_logs_tenant_id_fkey,
  ADD CONSTRAINT email_logs_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 17. email_templates
ALTER TABLE public.email_templates
  DROP CONSTRAINT email_templates_tenant_id_fkey,
  ADD CONSTRAINT email_templates_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 18. email_campaigns
ALTER TABLE public.email_campaigns
  DROP CONSTRAINT email_campaigns_tenant_id_fkey,
  ADD CONSTRAINT email_campaigns_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 19. unsubscribe_tokens
ALTER TABLE public.unsubscribe_tokens
  DROP CONSTRAINT unsubscribe_tokens_tenant_id_fkey,
  ADD CONSTRAINT unsubscribe_tokens_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 20. tenant_usage
ALTER TABLE public.tenant_usage
  DROP CONSTRAINT tenant_usage_organization_id_fkey,
  ADD CONSTRAINT tenant_usage_organization_id_fkey
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 21. invite_tokens
ALTER TABLE public.invite_tokens
  DROP CONSTRAINT invite_tokens_organization_id_fkey,
  ADD CONSTRAINT invite_tokens_organization_id_fkey
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
```

---

## Tabelle/colonne toccate

Tutte le tabelle che referenziano `organizations.id` tramite FK (21 tabelle):

| Tabella | Colonna FK | Constraint originale | Note |
|---------|-----------|---------------------|------|
| `admin_users` | `tenant_id` | `admin_users_tenant_id_fkey` | |
| `restaurant_settings` | `tenant_id` | `restaurant_settings_tenant_id_fkey` | |
| `tenant_features` | `tenant_id` | `tenant_features_tenant_id_fkey` | |
| `booking_requests` | `tenant_id` | `booking_requests_tenant_id_fkey` | dati operativi (59 righe su TEST) |
| `customers` | `tenant_id` | `customers_tenant_id_fkey` | dati operativi (6 righe) |
| `service_slots` | `tenant_id` | `service_slots_tenant_id_fkey` | dati operativi (35 righe) |
| `service_slot_overrides` | `tenant_id` | `service_slot_overrides_tenant_id_fkey` | |
| `menu_categories` | `tenant_id` | `menu_categories_tenant_id_fkey` | dati operativi (37 righe) |
| `menu_items` | `tenant_id` | `menu_items_tenant_id_fkey` | dati operativi (18 righe) |
| `menu_qr_codes` | `tenant_id` | `menu_qr_codes_tenant_id_fkey` | |
| `menu_qrcode_categories` | `tenant_id` | `menu_qrcode_categories_tenant_id_fkey` | |
| `menu_homepage_config` | `tenant_id` | `menu_homepage_config_tenant_id_fkey` | |
| `rooms` | `tenant_id` | `rooms_tenant_id_fkey` | |
| `tables` | `tenant_id` | `tables_tenant_id_fkey` | |
| `booking_table_assignments` | `tenant_id` | `booking_table_assignments_tenant_id_fkey` | |
| `email_logs` | `tenant_id` | `email_logs_tenant_id_fkey` | dati operativi (33 righe) |
| `email_templates` | `tenant_id` | `email_templates_tenant_id_fkey` | |
| `email_campaigns` | `tenant_id` | `email_campaigns_tenant_id_fkey` | |
| `unsubscribe_tokens` | `tenant_id` | `unsubscribe_tokens_tenant_id_fkey` | |
| `tenant_usage` | `organization_id` | `tenant_usage_organization_id_fkey` | colonna si chiama organization_id |
| `invite_tokens` | `organization_id` | `invite_tokens_organization_id_fkey` | colonna si chiama organization_id |

---

## Impatto / rischi

- **Potenzialmente distruttivo:** con CASCADE attivo, un `DELETE FROM organizations WHERE id = X`
  rimuove in modo definitivo TUTTI i dati di quel tenant (prenotazioni, clienti, menu, ecc.).
  Il gate di sicurezza rimane: `delete_tenant` richiede `confirm_name` rivalidato lato server.
- **L'app di Matteo non è impattata** in lettura/scrittura normale: le FK cambiano solo il
  comportamento al DELETE, non le SELECT/INSERT/UPDATE.
- **Ordine di esecuzione SQL:** PostgreSQL gestisce le dipendenze tra tabelle figlie
  automaticamente durante un CASCADE. Non serve un ordine specifico nello script.
- **Downtime:** `ALTER TABLE … DROP CONSTRAINT … ADD CONSTRAINT` acquisisce un lock breve
  sulla tabella. Su TEST con pochi dati il rischio è trascurabile.

---

## Stato attuale senza questo PLAN

L'Edge Function `delete_tenant` (F10) **funziona già** per tenant senza dati operativi
(es. un tenant appena creato con `create_tenant`). Se il tenant ha prenotazioni, clienti,
fasce orarie ecc., la function restituisce un 409 con messaggio chiaro:
> "Impossibile eliminare il tenant: esistono dati collegati in altre tabelle.
>  Svuota prima quei dati oppure chiedi a Matteo di eseguire PLAN-DB-006."

---

## Come verificare dopo (su TEST)

```sql
-- Verifica che i constraint siano stati ricreati con CASCADE
SELECT
  tc.table_name,
  kcu.column_name,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints rc
  ON tc.constraint_name = rc.constraint_name
JOIN information_schema.table_constraints tc2
  ON rc.unique_constraint_name = tc2.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc2.table_name = 'organizations'
ORDER BY tc.table_name;
```
Tutti i record devono mostrare `delete_rule = CASCADE`.

---

## Note per Matteo

- Eseguire **solo su TEST** (`docnnernvp`). Prima di portare su PROD: valutare se la
  cascata distruttiva è accettabile per i dati di produzione (es. conservare booking_requests
  anche dopo la cancellazione dell'organizzazione a fini di archivio).
- Se preferisci **non** usare CASCADE su booking_requests/customers/email_logs (archivio
  storico), esegui lo script solo sulle tabelle di configurazione e mantieni la gestione
  manuale per le altre — discutine prima.
- Dopo l'esecuzione, ri-deploya la Edge Function `console-admin` (il codice non cambia,
  ma è buona norma verificare il comportamento con un test smoke su un tenant sandbox).
- DEC correlate: DEC-047 (scelta cascata applicativa vs schema CASCADE), DEC-038 (conferme
  distruttive), REQ-003 (elimina azienda).
