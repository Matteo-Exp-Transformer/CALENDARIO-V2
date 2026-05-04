# Fix strutturale RLS multi-tenant + cleanup applicativo

## Contesto

L'app è arrivata a questo stato dopo pochi prompt e mostra tre sintomi che hanno **una radice strutturale comune** + due rumori a margine:

| Sintomo | Vera causa |
|--------|-----------|
| `403` su `GET /rest/v1/booking_requests?select=*` | RLS legge una GUC di sessione `app.current_tenant_id` che, su Supabase con pooler in transaction mode, **può non persistere** tra una richiesta REST e la successiva. |
| `new row violates row-level security policy` su INSERT admin | Stessa GUC + bug applicativo: [useAdminBookingRequests.ts:24-44](src/features/booking/hooks/useAdminBookingRequests.ts#L24-L44) costruisce `insertData` **senza `tenant_id`**, ma la colonna è `NOT NULL` e la policy `WITH CHECK` confronta proprio `tenant_id` con la GUC. Il check fallisce a prescindere. |
| `Multiple GoTrueClient instances detected` | [supabase.ts](src/lib/supabase.ts) e [supabasePublic.ts](src/lib/supabasePublic.ts) usano la stessa anon key e lo stesso `storageKey` di default. |
| Avviso React DevTools in console | Solo DX, ignorabile. |

**Il punto strutturale** è che l'isolamento multi-tenant è ancorato a una variabile di sessione PostgreSQL impostata da una RPC chiamata **una volta sola** a login ([TenantContext.tsx:83](src/contexts/TenantContext.tsx#L83)). Questa scelta è incompatibile con i pooler Supabase: ogni REST call può atterrare su una connessione diversa, dove la GUC non è valorizzata. Anche risolvendo il bug del `tenant_id` mancante, l'architettura resterebbe fragile.

**Obiettivo del piano:** sostituire la GUC con una RLS auto-sufficiente per richiesta basata su `admin_users` + JWT, chiudere la superficie di scrittura anonima diretta, allineare il client e poi sistemare i sintomi applicativi.

---

## Strategia in due livelli

1. **Strutturale (DB + Edge Functions):** nuova RLS basata su sub-query verso `admin_users` con `auth.jwt()->>'email'`, eliminazione della GUC e del flusso `set_tenant`, chiusura dell'`anon_insert` diretto su `booking_requests` e `email_logs`.
2. **Applicativo (client React):** rimozione delle chiamate `set_tenant`, fix del payload admin INSERT, fix del warning GoTrueClient.

---

## Fase 1 — Migrazione SQL: nuova architettura RLS

**File da creare:** `supabase/migrations/002_rls_admin_users.sql`

Si crea una nuova migrazione invece di modificare [001_schema_completo.sql](supabase/migrations/001_schema_completo.sql) per non rompere setup esistenti.

### 1.1 Helper function (cuore del nuovo modello)

```sql
-- Restituisce il tenant_id dell'admin loggato, oppure NULL.
-- SECURITY DEFINER per bypassare RLS su admin_users (evita ricorsione).
CREATE OR REPLACE FUNCTION current_admin_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT au.tenant_id
  FROM admin_users au
  WHERE lower(au.email) = lower(auth.jwt() ->> 'email')
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION current_admin_tenant_id() TO authenticated;
```

Vantaggi: una sola sorgente di verità (chi è admin di quale tenant), nessuna dipendenza da stato di sessione, funziona con qualsiasi pooler.

### 1.2 Drop policy "vecchio modello" e funzione `set_tenant`

```sql
-- booking_requests
DROP POLICY IF EXISTS "anon_insert_bookings"   ON booking_requests;
DROP POLICY IF EXISTS "tenant_select_bookings" ON booking_requests;
DROP POLICY IF EXISTS "tenant_update_bookings" ON booking_requests;
DROP POLICY IF EXISTS "tenant_delete_bookings" ON booking_requests;
DROP POLICY IF EXISTS "tenant_insert_bookings" ON booking_requests;

-- admin_users
DROP POLICY IF EXISTS "tenant_select_admin_users" ON admin_users;

-- email_logs
DROP POLICY IF EXISTS "anon_insert_email_logs"   ON email_logs;
DROP POLICY IF EXISTS "tenant_select_email_logs" ON email_logs;
DROP POLICY IF EXISTS "tenant_insert_email_logs" ON email_logs;

-- restaurant_settings
DROP POLICY IF EXISTS "tenant_select_restaurant_settings"  ON restaurant_settings;
DROP POLICY IF EXISTS "tenant_update_restaurant_settings"  ON restaurant_settings;
DROP POLICY IF EXISTS "tenant_insert_restaurant_settings"  ON restaurant_settings;

-- menu_items
DROP POLICY IF EXISTS "tenant_manage_menu_items" ON menu_items;

-- tenant_usage
DROP POLICY IF EXISTS "tenant_select_usage" ON tenant_usage;

-- Rimuovi la RPC obsoleta (non più usata dopo la fase 3)
DROP FUNCTION IF EXISTS set_tenant(uuid);
```

### 1.3 Nuove policy `booking_requests`

```sql
-- Niente più anon_insert: tutte le scritture pubbliche passano da Edge Function (service role).
-- Authenticated: tutte le operazioni vincolate al tenant dell'admin loggato.

CREATE POLICY "admin_select_bookings"
  ON booking_requests FOR SELECT TO authenticated
  USING (tenant_id = current_admin_tenant_id());

CREATE POLICY "admin_insert_bookings"
  ON booking_requests FOR INSERT TO authenticated
  WITH CHECK (tenant_id = current_admin_tenant_id());

CREATE POLICY "admin_update_bookings"
  ON booking_requests FOR UPDATE TO authenticated
  USING (tenant_id = current_admin_tenant_id())
  WITH CHECK (tenant_id = current_admin_tenant_id());

CREATE POLICY "admin_delete_bookings"
  ON booking_requests FOR DELETE TO authenticated
  USING (tenant_id = current_admin_tenant_id());
```

### 1.4 Nuove policy `admin_users`, `email_logs`, `restaurant_settings`, `menu_items`, `tenant_usage`

```sql
-- admin_users: l'admin vede solo i record del proprio tenant
CREATE POLICY "admin_select_admin_users"
  ON admin_users FOR SELECT TO authenticated
  USING (tenant_id = current_admin_tenant_id());

-- email_logs: niente più anon_insert (logging passa dall'Edge Function send-email
-- quando esisterà; finché non c'è, evitiamo di lasciare aperto un canale di scrittura
-- anonimo). Authenticated: solo proprio tenant.
CREATE POLICY "admin_select_email_logs"
  ON email_logs FOR SELECT TO authenticated
  USING (tenant_id = current_admin_tenant_id());

CREATE POLICY "admin_insert_email_logs"
  ON email_logs FOR INSERT TO authenticated
  WITH CHECK (tenant_id = current_admin_tenant_id());

-- restaurant_settings: anon_select rimane (form pubblico legge orari/nome ristorante)
CREATE POLICY "admin_select_restaurant_settings"
  ON restaurant_settings FOR SELECT TO authenticated
  USING (tenant_id = current_admin_tenant_id());

CREATE POLICY "admin_insert_restaurant_settings"
  ON restaurant_settings FOR INSERT TO authenticated
  WITH CHECK (tenant_id = current_admin_tenant_id());

CREATE POLICY "admin_update_restaurant_settings"
  ON restaurant_settings FOR UPDATE TO authenticated
  USING (tenant_id = current_admin_tenant_id())
  WITH CHECK (tenant_id = current_admin_tenant_id());

CREATE POLICY "admin_delete_restaurant_settings"
  ON restaurant_settings FOR DELETE TO authenticated
  USING (tenant_id = current_admin_tenant_id());

-- menu_items: anon_select rimane
CREATE POLICY "admin_manage_menu_items"
  ON menu_items FOR ALL TO authenticated
  USING (tenant_id = current_admin_tenant_id())
  WITH CHECK (tenant_id = current_admin_tenant_id());

-- tenant_usage: niente più anon_select; chi serve i contatori (Edge Function) usa service-role.
DROP POLICY IF EXISTS "anon_select_tenant_usage" ON tenant_usage;
CREATE POLICY "admin_select_tenant_usage"
  ON tenant_usage FOR SELECT TO authenticated
  USING (organization_id = current_admin_tenant_id());
```

> Nota: `organizations`, `invite_tokens`, `rate_limits` mantengono le policy esistenti — il loro modello pubblico è coerente con l'Edge Function.

### 1.5 Trigger di blindatura su `booking_requests`

Per evitare che un admin (o un bug client) inserisca con tenant_id sbagliato pur passando il check, aggiungiamo un trigger di pre-validazione che restituisce errore esplicito invece di un opaco "RLS violation":

```sql
CREATE OR REPLACE FUNCTION enforce_booking_tenant()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE caller_tenant uuid;
BEGIN
  IF auth.role() = 'authenticated' THEN
    caller_tenant := current_admin_tenant_id();
    IF caller_tenant IS NULL THEN
      RAISE EXCEPTION 'admin non riconosciuto (email JWT non in admin_users)';
    END IF;
    IF NEW.tenant_id IS DISTINCT FROM caller_tenant THEN
      RAISE EXCEPTION 'tenant_id (%) diverso dal tenant dell''admin (%)',
        NEW.tenant_id, caller_tenant;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enforce_booking_tenant
  BEFORE INSERT OR UPDATE ON booking_requests
  FOR EACH ROW EXECUTE FUNCTION enforce_booking_tenant();
```

Stesso schema applicabile in futuro a `menu_items`, `restaurant_settings` se serve.

---

## Fase 2 — Allineamento Edge Functions e flusso pubblico

Le Edge Functions [create-booking](supabase/functions/create-booking/index.ts) e [validate-invite](supabase/functions/validate-invite/index.ts) usano già il **service role** e bypassano RLS: continuano a funzionare invariate dopo la migrazione. **Niente codice da cambiare lato Deno.**

Cosa va verificato:

1. **`create-booking`**: già risolve `tenantSlug → organizations.id` server-side e inserisce `tenant_id` esplicito → compatibile con il nuovo trigger e policy (passa per service role, niente check su `current_admin_tenant_id`).
2. **`validate-invite` POST**: crea utente Auth + insert in `admin_users`. Dopo la migrazione, l'admin appena registrato sarà subito riconosciuto da `current_admin_tenant_id()` al primo login → nessun ulteriore step.
3. **Nessuna nuova Edge Function** richiesta da questo piano.

---

## Fase 3 — Cleanup client React

Tre modifiche localizzate, tutte non invasive.

### 3.1 [src/contexts/TenantContext.tsx](src/contexts/TenantContext.tsx)

**Rimuovere** la chiamata `set_tenant` ([linea 83](src/contexts/TenantContext.tsx#L83)). Il contesto resta utile per esporre `tenantId`, `tenantSlug`, `organizationName` agli hook e ai componenti, ma non deve più mutare lo stato del DB.

```diff
-      // Imposta la variabile di sessione RLS
-      await (supabase.rpc as any)('set_tenant', { tid: resolvedTenantId })
```

### 3.2 [src/lib/supabase.ts](src/lib/supabase.ts)

**Rimuovere** `setCurrentTenant()` ([linee 41-45](src/lib/supabase.ts#L41-L45)) — non più chiamata da nessuno una volta tolto il punto in TenantContext. Cercare con grep usi residui prima di rimuovere.

### 3.3 [src/lib/supabasePublic.ts](src/lib/supabasePublic.ts) — fix GoTrueClient duplicato

Aggiungere `storageKey` distinto e disabilitare lo storage del tutto (non serve, la sessione non viene persistita):

```diff
 export const supabasePublic = createClient<Database>(supabaseUrl, supabaseAnonKey, {
   auth: {
     persistSession: false,
     autoRefreshToken: false,
+    storageKey: 'sb-public-no-session',
+    storage: {
+      getItem: () => null,
+      setItem: () => {},
+      removeItem: () => {},
+    },
   },
   global: {
     headers: { 'X-Client-Info': 'booking-public' },
   },
 })
```

Questo elimina la registrazione del listener auth condivisa che genera il warning.

### 3.4 [src/features/booking/hooks/useAdminBookingRequests.ts](src/features/booking/hooks/useAdminBookingRequests.ts) — fix bug applicativo

**Aggiungere `tenant_id` al payload INSERT.** È necessario per due ragioni indipendenti:

1. La colonna è `NOT NULL` ([001_schema_completo.sql:73](supabase/migrations/001_schema_completo.sql#L73)).
2. Il nuovo trigger `enforce_booking_tenant` controlla esplicitamente che `NEW.tenant_id = current_admin_tenant_id()`.

```diff
 import { useMutation } from '@tanstack/react-query'
 import { supabase } from '@/lib/supabase'
+import { useTenantContext } from '@/contexts/TenantContext'
 import type { BookingRequest, BookingRequestInput } from '@/types/booking'
 import { toast } from 'react-toastify'
 import { createBookingDateTime, calculateEndTimeFromStart } from '../utils/dateUtils'

 export const useCreateAdminBooking = () => {
+  const { tenantId } = useTenantContext()
   return useMutation({
     mutationFn: async (data: BookingRequestInput) => {
+      if (!tenantId) {
+        throw new Error('Tenant non disponibile: effettuare nuovamente il login')
+      }
       // ... codice esistente ...
       const insertData = {
+        tenant_id: tenantId,
         client_name: data.client_name,
         // ... resto invariato ...
       }
```

Pattern coerente con [useBookingMutations.ts](src/features/booking/hooks/useBookingMutations.ts) (es. riga 49: `const { tenantId } = useTenantContext()`).

### 3.5 Audit hook esistenti

Tutti gli altri hook admin **già** filtrano per `tenant_id` esplicito:
- [useBookingQueries.ts:8,37,67,91](src/features/booking/hooks/useBookingQueries.ts) — SELECT con `.eq('tenant_id', tenantId)` ✓
- [useBookingMutations.ts:65-71, 123, 232, 316, 357](src/features/booking/hooks/useBookingMutations.ts) — UPDATE/DELETE con `.eq('tenant_id', tenantId!)` ✓
- [useBookingRequests.ts:155, 200-206](src/features/booking/hooks/useBookingRequests.ts) — idem ✓

Nessun cambiamento richiesto: dopo la migrazione questi hook continueranno a funzionare perché le policy ora derivano il tenant da `admin_users` (e `auth.jwt()->>'email'`), che è esattamente il tenant dell'admin loggato.

### 3.6 Fix `email_logs` insert (allineamento al nuovo RLS)

[email.ts:81-103](src/lib/email.ts#L81-L103) inserisce in `email_logs` **senza `tenant_id`**, ma la colonna è `NOT NULL` ([001_schema_completo.sql:107](supabase/migrations/001_schema_completo.sql#L107)) e dopo la migrazione la nuova policy `admin_insert_email_logs` richiede `tenant_id = current_admin_tenant_id()`. Senza fix, ogni log fallisce.

**Strategia:** estendere `EmailLog` e la firma di `logEmailToDatabase` / `sendAndLogEmail` con `tenantId`, e propagarlo dai chiamanti. Le sorgenti del `tenantId` sono già disponibili senza nuove dipendenze:

- [useEmailNotifications.ts:12,36,60](src/features/booking/hooks/useEmailNotifications.ts) ricevono un `BookingRequest`: usare `booking.tenant_id`.
- [TestEmailModal.tsx:27](src/features/booking/components/TestEmailModal.tsx#L27): leggere `tenantId` da `useTenantContext()` e passarlo alla call.

Diff schematico in `email.ts`:

```diff
 interface SendEmailOptions {
   to: string | string[]
   subject: string
   html: string
   bookingId?: string
   emailType?: string
+  tenantId: string
 }

 interface EmailLog {
   booking_id?: string
   email_type: string
   recipient_email: string
   status: 'sent' | 'failed' | 'pending'
   provider_response?: Record<string, any>
   error_message?: string
+  tenant_id: string
 }

 export const logEmailToDatabase = async (log: EmailLog) => {
   // ...
   const logData = {
+    tenant_id: log.tenant_id,
     booking_id: log.booking_id || null,
     email_type: log.email_type,
     // ... resto invariato ...
   }
 }

 export const sendAndLogEmail = async (
   options: SendEmailOptions,
   emailType: string
 ) => {
   // ...
   const log: EmailLog = {
+    tenant_id: options.tenantId,
     booking_id: options.bookingId,
     // ...
   }
 }
```

Nei tre helper di `useEmailNotifications.ts`: aggiungere `tenantId: booking.tenant_id` alla call `sendAndLogEmail`. In `TestEmailModal.tsx`: estrarre `const { tenantId } = useTenantContext()` e passarlo (con guard se null → toast e return).

> Tipo `BookingRequest`: verificare che `tenant_id` sia esposto in [src/types/booking.ts](src/types/booking.ts); in caso contrario aggiungerlo al tipo (è già nello schema DB).

---

## Fase 4 — React DevTools (no-op)

L'avviso `Download the React DevTools` in console è un suggerimento DX della libreria React in dev mode. Non correlato a RLS o Supabase. Nessuna azione richiesta. Documentato per chiusura del bug report.

---

## File toccati (riepilogo)

| File | Tipo modifica |
|------|---------------|
| `supabase/migrations/002_rls_admin_users.sql` | **Nuovo** |
| [src/contexts/TenantContext.tsx](src/contexts/TenantContext.tsx) | Rimozione 1 riga (`set_tenant` call) |
| [src/lib/supabase.ts](src/lib/supabase.ts) | Rimozione `setCurrentTenant` |
| [src/lib/supabasePublic.ts](src/lib/supabasePublic.ts) | Aggiunta `storageKey` + storage no-op |
| [src/features/booking/hooks/useAdminBookingRequests.ts](src/features/booking/hooks/useAdminBookingRequests.ts) | Aggiunta `tenant_id` al payload + guard |
| [src/lib/email.ts](src/lib/email.ts) | Aggiunta `tenant_id` a `EmailLog` / `SendEmailOptions` + insert |
| [src/features/booking/hooks/useEmailNotifications.ts](src/features/booking/hooks/useEmailNotifications.ts) | Passa `tenantId: booking.tenant_id` a `sendAndLogEmail` |
| [src/features/booking/components/TestEmailModal.tsx](src/features/booking/components/TestEmailModal.tsx) | Legge `tenantId` da `useTenantContext` e lo passa |
| [src/types/database.ts](src/types/database.ts) | Rigenerare con `npm run db:types:linked` (post-migrazione) |

Nessuna modifica a Edge Functions, router, componenti UI core, schema delle tabelle.

---

## Verifica end-to-end

### A. Applicare la migrazione

In Supabase Dashboard → SQL Editor: eseguire l'intero contenuto di `002_rls_admin_users.sql`. Verifica:

```sql
-- 1) helper esiste
SELECT proname FROM pg_proc WHERE proname = 'current_admin_tenant_id';

-- 2) le policy nuove esistono e quelle vecchie no
SELECT policyname FROM pg_policies WHERE tablename = 'booking_requests' ORDER BY policyname;
-- atteso: admin_delete_bookings, admin_insert_bookings, admin_select_bookings, admin_update_bookings

-- 3) set_tenant è stata rimossa
SELECT proname FROM pg_proc WHERE proname = 'set_tenant'; -- atteso: 0 righe
```

### B. Smoke test SQL con JWT reale (opzionale ma consigliato)

In SQL Editor, simulando un utente autenticato:

```sql
-- come superuser: simula JWT admin
SELECT set_config('request.jwt.claims', json_build_object('email', '<email-admin-esistente>')::text, true);
SELECT current_admin_tenant_id(); -- atteso: l'UUID del tenant di quell'admin
SELECT count(*) FROM booking_requests; -- atteso: solo le righe del suo tenant
```

### C. Test browser (golden path)

1. Avviare dev server: `npm run dev`.
2. Login admin → la console **non deve** mostrare il warning GoTrueClient.
3. Tab Network: la richiesta `GET .../booking_requests?select=*` deve restituire **200** con la lista, non più 403.
4. Da [AdminBookingForm.tsx](src/features/booking/components/AdminBookingForm.tsx) creare una nuova prenotazione admin → POST 201, riga visibile in [BookingCalendar](src/features/booking/components/BookingCalendar.tsx) e [DetailsTab](src/features/booking/components/DetailsTab.tsx).
5. Accept/Reject di una pending da [PendingRequestsTab](src/features/booking/components/PendingRequestsTab.tsx) → status update e mutate cache.
6. Form pubblico `/prenota/<slug>` invariato (Edge Function continua a creare la prenotazione).

### D. Test negativi

1. Logout, poi `GET .../booking_requests` da DevTools → deve fallire (nessun admin loggato → `current_admin_tenant_id()` NULL → policy non passa).
2. Tentativo manuale di anon insert via `curl` su `/rest/v1/booking_requests` → deve fallire con RLS (anon non ha più policy INSERT).

### E. Rollback

In caso di problemi: ripristinare le policy originali da [001_schema_completo.sql:267-326](supabase/migrations/001_schema_completo.sql#L267-L326), ripristinare `set_tenant`, e fare `git revert` dei tre file React. La migrazione 002 è interamente reversibile (solo policy + 2 funzioni + 1 trigger).

---

## Ordine di esecuzione consigliato

1. Aprire un branch `fix/rls-admin-users`.
2. Scrivere e committare `002_rls_admin_users.sql`. Applicarlo allo Supabase di sviluppo (progetto `rwuxgvldzrkabglkasym`).
3. Rigenerare i tipi: `npm run db:types:linked` → committare il diff in `src/types/database.ts`.
4. Verificare smoke test SQL (sezione B).
5. Modificare i file React (Fase 3.1 → 3.6). Commit.
6. `npm run dev` → percorrere golden path (sezione C) e test negativi (D).
7. Test specifico email: accept di una prenotazione → verificare che la riga in `email_logs` abbia `tenant_id` corretto e nessun errore RLS in console.
8. Deploy frontend.

---

## Risposte alle domande di allineamento

1. **Ambiente unico:** sì, applicare al progetto `rwuxgvldzrkabglkasym`. Niente staging separato. La migrazione è reversibile (vedi sezione E rollback) quindi si applica direttamente.
2. **Rigenerazione tipi:** sì, è parte della PR. Step 3 dell'ordine di esecuzione. Verificare in particolare che `email_logs` Insert/Row tipi includano `tenant_id` come `string` (non opzionale).
3. **Admin multi-tenant:** scelta esplicita per ora **un admin → un solo tenant**. `current_admin_tenant_id()` usa `LIMIT 1` senza ORDER BY perché in pratica `email` è univoca; se in futuro si vuole supportare un admin su più tenant servirà un cambio architetturale (es. tenant attivo via header/JWT claim). Per ora: documentare l'assunzione e lasciare `LIMIT 1`. Aggiungere però un constraint o una nota in migrazione: nel modello attuale, **non inserire la stessa email su tenant diversi** finché non si introduce la selezione di tenant.
4. **Trigger `enforce_booking_tenant`:** il ramo `IF auth.role() = 'authenticated'` è già nel piano (Fase 1.5) — lo service role bypassa, l'anon non può comunque insert (policy chiusa). Confermato.
5. **Warning GoTrueClient:** la fix proposta (`storageKey` distinto + storage no-op) è sufficiente per il caso normale. Se persiste con HMR di Vite (capita raramente perché Vite riusa i moduli), un hard reload risolve. Nessuna mitigazione aggiuntiva nel piano.
6. **`email_logs`:** estensione confermata in Fase 3.6. La sorgente di `tenant_id` è `booking.tenant_id` (per email transazionali) o `useTenantContext().tenantId` (per Test Email).
