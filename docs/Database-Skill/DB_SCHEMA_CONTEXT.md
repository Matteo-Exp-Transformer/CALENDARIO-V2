# Database — Schema, RLS, Funzioni, Trigger

> Context comune a tutte le sessioni DB.
> Copre: schema tabelle, funzioni SQL, trigger, RLS, tipi TypeScript.

---

## 1. Schema tabelle

### `organizations` — Registro tenant

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | `gen_random_uuid()` |
| `name` | TEXT NOT NULL | Nome ristorante |
| `slug` | TEXT UNIQUE NOT NULL | Parte URL: `/prenota/<slug>` |
| `plan` | TEXT | Default `'starter'` |
| `edition` | TEXT NOT NULL | Default `'pro'` — valori: `'classic'` · `'pro'` · `'enterprise'` |
| `max_bookings_per_year` | INTEGER | Default 3600 |
| `max_booking_requests_per_year` | INTEGER | Default 5000 |
| `is_active` | BOOLEAN | `false` blocca login admin |
| `created_at`, `updated_at` | TIMESTAMPTZ | |

`edition` controlla quali feature sono attive per il tenant (letto da `TenantContext` → `useFeatures()`). Migrazione: `013_tenants_edition.sql`.

Indici: `idx_organizations_slug`, `idx_organizations_active` (partial su `is_active = true`).
**RLS:** nessuna policy — letta via service role o `supabasePublic`.

---

### `admin_users` — Utenti amministratori

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `email` | TEXT NOT NULL | |
| `name` | TEXT | |
| `tenant_id` | UUID FK → organizations | NOT NULL, ON DELETE CASCADE |

Vincolo: `UNIQUE(email, tenant_id)`.
**RLS:** `admin_select_admin_users` — SELECT se `tenant_id = current_admin_tenant_id()`.

---

### `booking_requests` — Richieste prenotazione

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `tenant_id` | UUID FK → organizations | NOT NULL, ON DELETE RESTRICT |
| `client_name` | TEXT NOT NULL | |
| `client_email` | TEXT NOT NULL DEFAULT '' | |
| `client_phone` | TEXT | |
| `event_type` | TEXT | |
| `booking_type` | TEXT | |
| `desired_date` | DATE NOT NULL | |
| `desired_time` | TEXT | |
| `num_guests` | INTEGER | |
| `special_requests` | TEXT | |
| `placement` | TEXT | Zona sala |
| `menu`, `preset_menu` | TEXT | |
| `menu_selection` | JSONB | |
| `menu_total_per_person`, `menu_total_booking` | NUMERIC | |
| `dietary_restrictions` | JSONB | |
| `status` | TEXT CHECK | `pending \| accepted \| rejected \| deleted` |
| `confirmed_start`, `confirmed_end` | TIMESTAMPTZ | Solo se `accepted` |
| `rejection_reason` | TEXT | Solo se `rejected` |
| `cancellation_reason`, `cancelled_at` | — | Post-cancellazione |
| `cancelled_by` | UUID | **UUID auth.users.id** — MAI email |
| `booking_source` | TEXT CHECK | `public \| admin` |

Indici: `(tenant_id, desired_date)`, `(tenant_id, status)`.
**RLS:** policy `admin_*` — operazioni solo se `tenant_id = current_admin_tenant_id()`. Insert pubbliche via Edge Function `create-booking` (service role, bypassa RLS).

---

### `menu_items` — Voci menu

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `tenant_id` | UUID FK → organizations | |
| `name` | TEXT NOT NULL | |
| `category` | TEXT NOT NULL | |
| `price` | NUMERIC NOT NULL | |
| `description` | TEXT | |
| `sort_order` | INTEGER DEFAULT 0 | |

Vincolo: `UNIQUE(tenant_id, name, category)`. Indice: `(tenant_id, category, sort_order)`.

---

### `menu_categories` — Categorie menu per tenant

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `tenant_id` | UUID FK → organizations | ON DELETE CASCADE |
| `key` | TEXT NOT NULL | Slug della categoria |
| `label` | TEXT NOT NULL | Etichetta visualizzata |
| `sort_order` | INTEGER DEFAULT 999 | |
| `created_at`, `updated_at` | TIMESTAMPTZ | |

Vincoli: `UNIQUE(tenant_id, key)`, `UNIQUE(tenant_id, label)`.
Indice: `(tenant_id, sort_order, label)`.
**RLS:** `admin_manage_menu_categories` — ALL per authenticated se `tenant_id = current_admin_tenant_id()`.

---

### `restaurant_settings` — Impostazioni per tenant

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `tenant_id` | UUID FK → organizations | |
| `setting_key` | TEXT NOT NULL | |
| `setting_value` | JSONB NOT NULL | Struttura variabile per chiave |

Vincolo: `UNIQUE(tenant_id, setting_key)`.

---

### `customers` — CRM clienti (006)

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `tenant_id` | UUID FK → organizations | ON DELETE CASCADE |
| `name` | TEXT NOT NULL | |
| `email` | TEXT NOT NULL | Normalizzata da trigger (lower+trim) |
| `phone` | TEXT | |
| `notes` | TEXT | |
| `source` | TEXT CHECK | `manual \| synced` |
| `created_at`, `updated_at` | TIMESTAMPTZ | |

Indici: `customers_tenant_lower_email_idx` (unique su `tenant_id, lower(trim(email))`), `customers_tenant_id_idx`.
Trigger: `trg_customers_normalize_email` (normalizza email), `trg_customers_updated_at`, `trg_enforce_customer_tenant`.
**RLS:** policy `admin_*` — SELECT/INSERT/UPDATE/DELETE per `current_admin_tenant_id()`.

> **RULE email:** usare sempre `normalizeCustomerEmail()` (da `src/features/booking/utils/`) prima di confronto o scrittura. La colonna è always lowercase+trimmed.

---

### `tables` — Tavoli per sala (007)

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `tenant_id` | UUID FK → organizations | ON DELETE CASCADE |
| `name` | TEXT NOT NULL | |
| `capacity` | INTEGER NOT NULL CHECK (> 0) | |
| `placement` | TEXT NOT NULL DEFAULT '' | Zona sala |
| `active` | BOOLEAN NOT NULL DEFAULT true | |
| `created_at`, `updated_at` | TIMESTAMPTZ | |

Indice: `tables_tenant_id_idx`.
Trigger: `trg_tables_updated_at`, `trg_enforce_table_tenant`.
**RLS:** policy `admin_*` — SELECT/INSERT/UPDATE/DELETE per `current_admin_tenant_id()`.

---

### `tenant_usage` — Contatori utilizzo

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `organization_id` | UUID FK → organizations | |
| `year` | INTEGER | |
| `bookings_count` | INTEGER | Prenotazioni accettate |
| `booking_requests_count` | INTEGER | Richieste ricevute |

Aggiornata via trigger da `booking_requests`. Vincolo: `UNIQUE(organization_id, year)`.

---

### `email_logs` — Log invii email

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `tenant_id` | UUID FK → organizations | |
| `booking_id` | UUID FK → booking_requests | ON DELETE CASCADE |
| `email_type` | TEXT NOT NULL | |
| `recipient_email` | TEXT NOT NULL | |
| `sent_at` | TIMESTAMPTZ | |
| `status` | TEXT CHECK | `sent \| failed \| pending` |
| `provider_response` | JSONB | |
| `error_message` | TEXT | |

**Nota:** `booking_id` non ha indice esplicito — query lente possibili su volume alto.

---

### `invite_tokens` — Token invito admin

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `organization_id` | UUID FK → organizations | |
| `token` | TEXT UNIQUE NOT NULL | Indicizzato automaticamente dall'UNIQUE |
| `email` | TEXT | Vincola la registrazione a questa email |
| `expires_at` | TIMESTAMPTZ | |
| `used_at` | TIMESTAMPTZ | NULL = non usato |
| `created_at`, `created_by` | — | |

**RLS:** permissiva — gestita da Edge Functions con service role.

---

### `rate_limits` — Rate limiting per IP

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `ip_address` | TEXT | |
| `endpoint` | TEXT | Es. `'create-booking'` |
| `requested_at` | TIMESTAMPTZ DEFAULT NOW() | |

**RLS:** permissiva — solo Edge Functions con service role.

---

## 2. Funzioni SQL

### `current_admin_tenant_id()` → UUID

Cuore del sistema RLS multi-tenant. Legge il JWT, trova l'email, restituisce il `tenant_id` da `admin_users`.

```sql
SELECT au.tenant_id
FROM admin_users au
WHERE lower(au.email) = lower(auth.jwt() ->> 'email')
LIMIT 1
```

`SECURITY DEFINER` · `SET search_path = public` · `STABLE` · grantata a `authenticated`.

> Non modificare questa funzione senza analisi RLS completa — è usata da ogni policy.

---

### `check_admin_email(check_email text)` → tabella

RPC usata da `TenantContext.setTenantFromAdmin()`. Restituisce il `tenant_id` per una data email admin.

---

### `customers_normalize_email()` (trigger function)

Normalizza `NEW.email` con `lower(trim(...))` e solleva eccezione se vuota. Eseguita BEFORE INSERT OR UPDATE su `customers`.

---

### `enforce_customer_tenant()` / `enforce_table_tenant()` (trigger functions)

Verificano che il `tenant_id` dell'admin JWT corrisponda al `tenant_id` della riga. Sollevano eccezione se divergono. Stessa logica, tabelle diverse.

---

### `increment_booking_request_count()` / `increment_booking_count_on_accept()`

`SECURITY DEFINER` — aggiornano `tenant_usage` dai trigger su `booking_requests`. Definite in `003_fix_tenant_usage_triggers_security_definer.sql`.

---

## 3. Trigger per tabella

| Tabella | Trigger | Quando |
|---------|---------|--------|
| `customers` | `trg_customers_normalize_email` | BEFORE INSERT OR UPDATE |
| `customers` | `trg_customers_updated_at` | BEFORE UPDATE |
| `customers` | `trg_enforce_customer_tenant` | BEFORE INSERT OR UPDATE |
| `tables` | `trg_tables_updated_at` | BEFORE UPDATE |
| `tables` | `trg_enforce_table_tenant` | BEFORE INSERT OR UPDATE |
| `booking_requests` | `increment_booking_request_count` | AFTER INSERT |
| `booking_requests` | `increment_booking_count_on_accept` | AFTER UPDATE |

Per ogni **nuova tabella** con tenant isolation: aggiungere `enforce_*_tenant` + `updated_at` trigger — vedi pattern in `006_customers_crm.sql` e `007_tables.sql`.

---

## 4. Tipi TypeScript generati

Il file `src/types/database.ts` è **generato** — non modificarlo a mano.

```bash
npm run db:types:linked   # rigenera dal DB remoto linkato
```

Eseguire **obbligatoriamente** dopo ogni migrazione che aggiunge/modifica colonne o tabelle. Tutti gli hook e componenti che accedono al DB dipendono da questo file.

---

## 5. RLS — pattern standard per nuova tabella

```sql
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

---

## 6. FK senza indice esplicito (debt noto)

| Tabella | Colonna | Impatto atteso |
|---------|---------|----------------|
| `email_logs` | `booking_id` | Lento se filtri email per prenotazione |
| `invite_tokens` | `organization_id` | Lookup token per org |

Da considerare se il volume cresce.
