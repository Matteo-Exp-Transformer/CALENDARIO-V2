# Database

## Tecnologia

PostgreSQL gestito da Supabase. Ogni tabella ha Row Level Security (RLS) abilitata. L'isolamento dei dati tra tenant avviene tramite la colonna `tenant_id` presente su tutte le tabelle dati.

## Schema

### `organizations` — Registro dei tenant

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | `gen_random_uuid()` |
| `name` | TEXT NOT NULL | Nome del ristorante |
| `slug` | TEXT UNIQUE NOT NULL | Parte dell'URL: `/prenota/<slug>` |
| `plan` | TEXT | Default `'starter'` |
| `max_bookings_per_year` | INTEGER | Default 3600 — limite prenotazioni accettate |
| `max_booking_requests_per_year` | INTEGER | Default 5000 — limite richieste entranti |
| `is_active` | BOOLEAN | `false` blocca login admin |
| `created_at`, `updated_at` | TIMESTAMPTZ | |

Indici: `idx_organizations_slug`, `idx_organizations_active` (partial index su `is_active = true`).

**RLS:** nessuna policy (la tabella è letta tramite service role nelle Edge Functions o tramite `supabasePublic` lato client).

---

### `booking_requests` — Richieste di prenotazione

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `tenant_id` | UUID FK → organizations | NOT NULL, ON DELETE RESTRICT |
| `client_name` | TEXT NOT NULL | |
| `client_email` | TEXT NOT NULL DEFAULT '' | Stringa vuota se non fornita |
| `client_phone` | TEXT | |
| `event_type` | TEXT | Tipo evento (es. compleanno, matrimonio) |
| `booking_type` | TEXT | Tipo prenotazione (es. cena, brunch) |
| `desired_date` | DATE NOT NULL | |
| `desired_time` | TEXT | |
| `num_guests` | INTEGER | |
| `special_requests` | TEXT | |
| `placement` | TEXT | Zona sala (es. interno, esterno) |
| `menu`, `preset_menu` | TEXT | |
| `menu_selection` | JSONB | Selezione voci menu |
| `menu_total_per_person` | NUMERIC | |
| `menu_total_booking` | NUMERIC | |
| `dietary_restrictions` | JSONB | Intolleranze alimentari |
| `status` | TEXT CHECK | `pending \| accepted \| rejected \| deleted` |
| `confirmed_start`, `confirmed_end` | TIMESTAMPTZ | Solo se `status = 'accepted'` |
| `rejection_reason` | TEXT | Solo se `status = 'rejected'` |
| `cancellation_reason`, `cancelled_at`, `cancelled_by` | — | Cancellazione post-accettazione |
| `booking_source` | TEXT CHECK | `public \| admin` |

Indici: `(tenant_id, desired_date)`, `(tenant_id, status)`.

**RLS:** policy `admin_*` — SELECT/INSERT/UPDATE/DELETE solo se `tenant_id = current_admin_tenant_id()`. Le insert pubbliche avvengono tramite Edge Function `create-booking` (service role, bypassa RLS).

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

### `menu_items` — Voci del menu

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

### `restaurant_settings` — Impostazioni per tenant

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `tenant_id` | UUID FK → organizations | |
| `setting_key` | TEXT NOT NULL | Chiave impostazione |
| `setting_value` | JSONB NOT NULL | Valore (struttura variabile per chiave) |

Vincolo: `UNIQUE(tenant_id, setting_key)`. Ogni ristorante ha una riga per impostazione (orari, capienza, ecc.).

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
| `provider_response` | JSONB | Risposta Resend |
| `error_message` | TEXT | |

**Nota:** `booking_id` ha una FK su `booking_requests` ma manca un indice esplicito su questa colonna — se il volume di email_logs cresce, questa query potrebbe diventare lenta.

---

### `invite_tokens` — Token di invito per nuovi admin

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `organization_id` | UUID FK → organizations | |
| `token` | TEXT UNIQUE NOT NULL | |
| `email` | TEXT | Se presente, vincola la registrazione a questa email |
| `expires_at` | TIMESTAMPTZ | |
| `used_at` | TIMESTAMPTZ | NULL se non ancora usato |
| `created_at`, `created_by` | — | |

**RLS:** policy permissiva su questa tabella — le Edge Functions la gestiscono con service role. Non ci sono policy restrittive per utenti autenticati.

**Nota:** `organization_id` non ha un indice separato (solo il FK implicito). Manca anche un indice su `token` per le lookup veloci (compensato dal `UNIQUE` constraint che Postgres indicizza automaticamente).

---

### `tenant_usage` — Contatori utilizzo per anno

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `organization_id` | UUID FK → organizations | |
| `year` | INTEGER | |
| `bookings_count` | INTEGER | Prenotazioni accettate |
| `booking_requests_count` | INTEGER | Richieste ricevute |

Aggiornata tramite trigger quando cambiano i conteggi.

---

### `rate_limits` — Rate limiting per IP

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | UUID PK | |
| `ip_address` | TEXT | |
| `endpoint` | TEXT | Es. `'create-booking'` |
| `requested_at` | TIMESTAMPTZ DEFAULT NOW() | |

**RLS:** policy permissiva — usata solo dalle Edge Functions con service role.

---

## Funzioni DB

### `current_admin_tenant_id()` → UUID

Cuore del sistema RLS. Legge il JWT dell'utente autenticato, trova l'email nel token, e restituisce il `tenant_id` corrispondente dalla tabella `admin_users`.

```sql
SELECT au.tenant_id
FROM admin_users au
WHERE lower(au.email) = lower(auth.jwt() ->> 'email')
LIMIT 1
```

Caratteristiche: `SECURITY DEFINER`, `SET search_path = public`, `STABLE`. Grantata a `authenticated`.

**Nota:** `SECURITY DEFINER` è intenzionale ma implica che la funzione gira con i privilegi del owner. Verificare che il `search_path` sia sempre fisso per evitare SQL injection via search_path.

### `check_admin_email(check_email text)` → tabella

Funzione RPC usata da `TenantContext.setTenantFromAdmin()`. Restituisce il `tenant_id` per una data email admin.

---

## Trigger

Trigger sulle tabelle `booking_requests` e `tenant_usage` per aggiornare automaticamente i contatori in `tenant_usage` quando una prenotazione viene creata o il suo status cambia. Definiti nella migrazione `003_fix_tenant_usage_triggers_security_definer.sql`.

---

## Indici FK mancanti

Le seguenti FK non hanno un indice esplicito e potrebbero causare slow query su tabelle grandi:

| Tabella | Colonna | Impatto atteso |
|---------|---------|---------------|
| `email_logs` | `booking_id` | Lento se si filtrano email per prenotazione |
| `invite_tokens` | `organization_id` | Lookup token per org |

---

## Come applicare le migrazioni

```bash
# Applica tutte le migrazioni pendenti al DB remoto linkato
supabase db push

# Verifica lo stato delle migrazioni
supabase migration list --linked
```

---

## Come rigenerare i tipi TypeScript

```bash
npm run db:types:linked
# Scrive src/types/database.ts con i tipi aggiornati dal DB remoto
```

Eseguire dopo ogni migrazione che aggiunge/modifica colonne o tabelle.

---

## Seed data

```bash
npm run seed:booking-menu-full   # prenotazione con selezione menu
npm run seed:booking-table       # prenotazione tavolo semplice
```

Richiede `TENANT_SLUG` e `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

---

## Issue noto — Disallineamento nomi migrazioni locale/remoto

**Sintomo:** `supabase migration list --linked` mostra le migrazioni remote con nome timestamp (es. `20240101000000_schema_completo`) mentre le migrazioni locali usano nomi sequenziali (`001_schema_completo.sql`).

**Causa:** le migrazioni sono state applicate al DB remoto manualmente (via SQL Editor o con una versione diversa del CLI) invece che tramite `supabase db push`. Supabase CLI registra le migrazioni applicabili nella tabella `supabase_migrations` con il nome del file locale. Se il file non corrisponde al nome registrato, il CLI considera le migrazioni "non applicate" localmente anche se il codice SQL è già nel DB.

**Impatto:** nessun impatto funzionale se le migrazioni non vengono rieseguite. Il problema si manifesta solo se si usa `supabase db push` su un DB già configurato manualmente — potrebbe tentare di rieseguire migrazioni già applicate.

**Raccomandazione:** prima di eseguire `supabase db push` su un DB esistente, verificare con `supabase migration list --linked` e risolvere i disallineamenti. Non rinominare le migrazioni già applicate.

**Nota aggiuntiva:** esistono due migrazioni con prefisso `003_`:
- `003_fix_tenant_usage_triggers_security_definer.sql`
- `003_menu_categories.sql`

Entrambe sono state applicate al remoto. Il doppio prefisso è uno storico, non ha impatto funzionale purché non si tenti di applicarle nuovamente.
