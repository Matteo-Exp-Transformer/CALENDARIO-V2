# Test plan post-migrazione RLS — sicurezza + funzionalità

> Eseguito dopo `002_rls_admin_users.sql` su `rwuxgvldzrkabglkasym` e dei fix client.
> Obiettivo: verificare che (a) l'isolamento multi-tenant tenga sotto pressione, (b) i flussi pubblico e admin funzionino end-to-end, (c) non ci siano regressioni nascoste.
>
> Tre suite, eseguibili in parallelo da agenti distinti. Ogni suite produce un report con OK/KO per test, prove (status code, body, screenshot, query SQL output) e severità del fallimento.

---

## Verifica preliminare dello stato (audit del report)

Il report `REPORT_ESECUZIONE_PLAN_RLS.md` dichiara coerentemente:

- Migrazione `002_rls_admin_users.sql` applicata (verificato: file in `supabase/migrations/`).
- `current_admin_tenant_id()` presente, `set_tenant` rimossa, policy `admin_*` su `booking_requests` create.
- Client allineato: `set_tenant` rimosso da TenantContext (verificato: nessun match `set_tenant`/`setCurrentTenant` in `src/`), `supabasePublic` con `storageKey: 'sb-public-no-session'` + storage no-op (verificato), `useAdminBookingRequests` con `tenant_id` + guard (verificato), `email.ts` con `tenant_id` su `EmailLog`/`SendEmailOptions` (verificato), `useEmailNotifications` propaga `booking.tenant_id` (verificato), `TestEmailModal` legge da `useTenantContext` (verificato).
- `BookingRequest.tenant_id` reso obbligatorio (verificato: `src/types/booking.ts:60`).
- Build OK, lint OK con baseline `.eslintrc.cjs` aggiunta.

**Deviazioni dichiarate, da accettare consapevolmente:**

1. **PR non aperta**, push diretto su `main`. Non bloccante per i test ma riduce il safety-net del review.
2. **Stash con modifiche UI scartate** (`stash@{0} - cleanup-before-tests-2026-05-04`). Da non droppare finché non si conferma stabilità.
3. **Golden path browser e test negativi NON eseguiti** dall'agente. È esattamente ciò che questo test plan deve coprire.
4. **`.claude/` esclusa via `.git/info/exclude`** — non è un problema di sicurezza, ma da ricordare se si cambia macchina.

**Lacuna rispetto al piano (da segnalare, non bloccante per i test):**

- Il piano elencava `admin_select_tenant_usage`, `admin_manage_menu_items`, `admin_*_restaurant_settings` ecc. — la migrazione le contiene tutte. ✓
- Ho confermato che nel migration file il trigger `enforce_booking_tenant` ha il filtro `IF auth.role() = 'authenticated'` (riga 108): la Edge Function in service-role bypassa correttamente. ✓

---

## Convenzioni comuni alle 3 suite

- **Ambiente:** `VITE_SUPABASE_URL` + anon key del progetto `rwuxgvldzrkabglkasym`. App locale su `npm run dev` (di solito `http://localhost:5173`).
- **Tenant di test:** servono **2 tenant distinti** (`Tenant A`, `Tenant B`) con **un admin per ciascuno** (`admin.a.rls@example.com`, `admin.b.rls@example.com`). Se non esistono, crearli con il pattern `Guida.md` (organizations + admin_users + Auth user). Anche un solo tenant è accettabile per le suite 2 e 3, ma la suite 1 richiede 2 tenant per i test di cross-tenant.
- **Reset prima di ogni suite:** logout completo, `localStorage.clear()` + `sessionStorage.clear()` + chiusura DevTools.
- **Output:** ogni test produce una riga `OK | KO | N/A` con (i) artefatto raccolto, (ii) severità (`blocker | high | medium | low`), (iii) note.
- **Niente fixture distruttive in produzione**: i dati creati durante i test devono essere puliti alla fine (cancellazione mirata, non `truncate`).

---

# SUITE 1 — Sicurezza RLS multi-tenant

**Scopo:** dimostrare che **nessun client** (anon, autenticato sul tenant sbagliato, autenticato senza riga in `admin_users`) può leggere/scrivere dati di un tenant diverso dal proprio. Verificare anche che la chiusura dell'`anon_insert` su `booking_requests` ed `email_logs` sia effettiva.

**Strumenti:** `curl`, browser DevTools, Supabase SQL Editor (per controlli post-attacco). NON usare la service-role key in nessun test (i test simulano un attaccante con anon key, che è ciò che è esposto al frontend).

### S1.1 — Anon non può leggere `booking_requests`

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  "<URL>/rest/v1/booking_requests?select=*"
```

- **Atteso:** body vuoto `[]` (RLS senza policy `anon_select` → silently denied) **oppure** 200 con `[]`. NON deve restituire righe.
- **Severity se KO:** blocker.

### S1.2 — Anon non può inserire `booking_requests` direttamente

```bash
curl -s -X POST \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"tenant_id":"<UUID-tenant-A>","client_name":"hacker","client_email":"x@x","desired_date":"2026-12-31"}' \
  "<URL>/rest/v1/booking_requests"
```

- **Atteso:** 401/403 con messaggio RLS. **NON** 201.
- **Severity se KO:** blocker.

### S1.3 — Anon non può inserire `email_logs`

Stesso pattern di S1.2 contro `/rest/v1/email_logs`. Atteso: rejection.

### S1.4 — Admin del tenant A non vede dati del tenant B

1. Login UI come `admin.a.rls@example.com`.
2. In console DevTools: `await (await import('/src/lib/supabase.ts')).supabase.from('booking_requests').select('id, tenant_id, client_name')`.
3. Tutte le righe restituite devono avere `tenant_id === <UUID-tenant-A>`. Nessuna riga di B.

**Variante diretta REST con JWT:** prendere il `access_token` dalla sessione (`(await supabase.auth.getSession()).data.session.access_token`) e fare:

```bash
curl -s -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ACCESS_TOKEN_A>" \
  "<URL>/rest/v1/booking_requests?select=id,tenant_id&tenant_id=eq.<UUID-tenant-B>"
```

- **Atteso:** `[]`. Il filtro `eq.<UUID-tenant-B>` non deve far passare nulla — la policy `admin_select_bookings` confronta con `current_admin_tenant_id()`, che è il tenant di A.
- **Severity se KO:** blocker.

### S1.5 — Admin di A non può inserire una booking spacciandola per B

Con JWT di A:

```bash
curl -s -X POST \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ACCESS_TOKEN_A>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"tenant_id":"<UUID-tenant-B>","client_name":"injection","client_email":"x@x","desired_date":"2026-12-31"}' \
  "<URL>/rest/v1/booking_requests"
```

- **Atteso:** errore. Due livelli di difesa devono attivarsi: la policy `admin_insert_bookings WITH CHECK` e il trigger `enforce_booking_tenant`. Il messaggio del trigger dovrebbe contenere `tenant_id ... diverso dal tenant dell'admin`.
- **Severity se KO:** blocker.

### S1.6 — Admin di A non può aggiornare una booking di B

Con JWT di A, prendere un `id` reale di booking di B (lo si conosce da SQL Editor in service-role per il setup, oppure indovinandolo non si arriva — meglio passare l'id come parametro del test):

```bash
curl -s -X PATCH \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ACCESS_TOKEN_A>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"status":"rejected"}' \
  "<URL>/rest/v1/booking_requests?id=eq.<BOOKING_ID_DI_B>"
```

- **Atteso:** `[]` (nessuna riga matched dal filtro RLS) o errore. La booking di B in DB resta `pending`/`accepted` immutata.
- **Severity se KO:** blocker.

### S1.7 — Admin di A non può cancellare booking di B

Stesso pattern di S1.6 con `DELETE`. Atteso: nessuna riga eliminata, conteggio booking di B invariato.

### S1.8 — Admin di A vede solo i propri admin_users

```bash
curl -s -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ACCESS_TOKEN_A>" \
  "<URL>/rest/v1/admin_users?select=*"
```

- **Atteso:** solo righe con `tenant_id == A`. Nessun admin di B esposto. **Stress test ricorsione:** la policy su `admin_users` chiama `current_admin_tenant_id()` (SECURITY DEFINER → bypassa RLS). Verificare che la query non si pianti per ricorsione (timeout >5s sarebbe il sintomo).
- **Severity se KO:** high.

### S1.9 — Admin di A non vede `email_logs`, `restaurant_settings`, `menu_items`, `tenant_usage` di B

Iterare su queste 4 tabelle con JWT di A e filtro `tenant_id=eq.<UUID-B>` (per `tenant_usage` usare `organization_id`). Atteso: tutti `[]`.

### S1.10 — Anon mantiene accesso pubblico legittimo

I flussi pubblici devono continuare a funzionare:

1. `GET /rest/v1/organizations?select=id,name,slug&slug=eq.<slug-A>` → restituisce 1 riga.
2. `GET /rest/v1/menu_items?select=*&tenant_id=eq.<UUID-A>` → restituisce le voci del menù pubblico.
3. `GET /rest/v1/restaurant_settings?select=*&tenant_id=eq.<UUID-A>` → restituisce le settings.

Atteso: 200 con dati. Se 403/empty → regressione del flusso pubblico (il form `/prenota/<slug>` non funzionerà più).

### S1.11 — Edge Function `create-booking` continua a funzionare

```bash
curl -s -X POST \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"tenantSlug":"<slug-A>","client_name":"E2E test","client_email":"qa@test.local","desired_date":"2027-01-15","desired_time":"20:00","num_guests":2}' \
  "<URL>/functions/v1/create-booking"
```

- **Atteso:** 200 con `{ success: true, ... }`. La booking risultante in DB ha il `tenant_id` corretto (uguale all'`id` di `Tenant A`).
- **Severity se KO:** blocker.

### S1.12 — JWT con `email` di un'utenza Auth ma NON in `admin_users`

Caso edge: utente Auth esistente che è stato rimosso da `admin_users` (o non vi è mai stato).

1. Creare in Supabase Auth un utente `outsider.rls@example.com` senza riga in `admin_users`.
2. Login da UI come quell'utente (UI dovrebbe rifiutarlo via `useAdminAuth` — verificare comportamento). Se UI lo blocca, fare login via API direttamente.
3. Con il suo `access_token`, tentare `GET /rest/v1/booking_requests`.

- **Atteso:** `[]`. `current_admin_tenant_id()` ritorna NULL → policy `admin_select_bookings` confronta `tenant_id = NULL` → falso per ogni riga.
- **Severity se KO:** high (esposizione dati).

### S1.13 — Recursion sanity check su `admin_users` policy

In SQL Editor (service-role bypass per il setup, ma il check va fatto come authenticated):

```sql
SELECT set_config('request.jwt.claims', json_build_object('email', 'admin.a.rls@example.com')::text, true);
SELECT set_config('role', 'authenticated', true);
SELECT count(*) FROM admin_users;
```

- **Atteso:** numero corrispondente agli admin del tenant A. Tempo <100ms.
- **Severity se KO:** high (loop infinito = DoS).

### Output suite 1
Tabella `Test ID | Status | Evidence | Severity | Note`. Allegare anche:
- elenco `tenant_id` distinti visti in S1.4 e S1.9 (deve esserci solo `<UUID-A>`),
- response body completi di S1.5/S1.6/S1.7 (per verificare che i messaggi non leakino strutture interne sensibili).

---

# SUITE 2 — Funzionalità admin (golden path E2E)

**Scopo:** validare che ogni flusso admin funzioni post-migrazione, con focus su quelli toccati dal piano (insert admin, log email).

**Tool:** browser su `npm run dev`, DevTools (Network + Console), Supabase Table Editor per ispezione lato DB. Tutti i test partono da logout.

### S2.1 — Login admin pulito

1. Naviga `/login`, credenziali admin A.
2. **Console:** assenza assoluta di:
   - `Multiple GoTrueClient instances detected` (era il warning specifico),
   - errori 401/403,
   - errori riferiti a `set_tenant`.
3. **Network:** chiamate a `/auth/v1/token`, `/rest/v1/rpc/check_admin_email` con 200.

OK = tutti i 3 punti verdi. Severity blocker se KO.

### S2.2 — Caricamento dashboard senza 403

Dopo login, la dashboard `AdminDashboard` carica le tab. Verificare in Network:

- `GET /rest/v1/booking_requests?select=*&tenant_id=eq.<UUID-A>&status=eq.pending` → **200** con array (vuoto è OK).
- `GET /rest/v1/booking_requests?...status=eq.accepted` → 200.
- Nessuna chiamata 403.

### S2.3 — Creazione booking admin con `tenant_id` impl.

1. Apri `AdminBookingForm`, compila e submetti.
2. **Network:** `POST /rest/v1/booking_requests` → 201; payload contiene `tenant_id: "<UUID-A>"`.
3. **DB (Table Editor):** la riga esiste con `booking_source='admin'`, `status='accepted'`, `tenant_id` corretto.
4. **UI:** la prenotazione appare in `BookingCalendar` e in `DetailsTab`.

### S2.4 — Edit booking esistente

Da `DetailsTab` modifica un campo (es. `num_guests`, `special_requests`). 
- **Network:** PATCH 200/204.
- **DB:** modifica persistita, `updated_at` aggiornato.
- **UI:** valore aggiornato senza reload.

### S2.5 — Accept di una pending → email log con `tenant_id`

1. In `PendingRequestsTab` accetta una richiesta.
2. **Network:** PATCH a `/booking_requests` 200, POST a `/functions/v1/send-email` (se Resend è configurato — altrimenti l'edge function darà errore non-bloccante).
3. **DB email_logs:** **una nuova riga** con `tenant_id == <UUID-A>`, `email_type='booking_accepted'`, `booking_id` corretto, `status` = `sent` o `failed` a seconda di Resend.
4. **NESSUN errore RLS** in console su email_logs insert (era il bug latente che il piano ha chiuso).

### S2.6 — Reject di una pending → email log

Stesso pattern di S2.5 con `email_type='booking_rejected'`.

### S2.7 — Cancel di una accepted → email log

Stesso pattern con `email_type='booking_cancelled'`.

### S2.8 — Test email modal

1. Apri `TestEmailModal`, inserisci una email valida, invia.
2. **DB email_logs:** riga con `tenant_id == <UUID-A>`, `email_type='manual'` (o equivalente), `booking_id` NULL.
3. Se `tenantId` non è disponibile (caso patologico): UI mostra toast e NON invia.

### S2.9 — Settings tab (lettura/scrittura `restaurant_settings`)

In `SettingsTab` leggere e modificare un setting (es. orari apertura).

- GET: 200 con valori attuali, **filtrati per tenant**.
- UPDATE/UPSERT: 200, riga in `restaurant_settings` con `tenant_id` corretto.

### S2.10 — Menu Items CRUD

In `MenuPricesTab`:
1. Crea voce → POST 201 con `tenant_id` corretto in DB.
2. Modifica prezzo → PATCH 200.
3. Cancella voce → DELETE 200.

### S2.11 — Email logs viewer

`EmailLogsModal` deve listare solo i log del tenant corrente. Verifica in Network: query a `/rest/v1/email_logs` non contiene `tenant_id` nel filtro client (RLS lo applica server-side) **oppure** lo contiene ma in entrambi i casi solo righe del tenant tornano.

### S2.12 — Logout pulito

Click "Esci". Verifica:
- redirect a `/login`,
- `localStorage` non contiene più la sessione admin (controllare key `sb-<project>-auth-token`),
- la key `sb-public-no-session` resta o non viene mai scritta (è un no-op): controllare DevTools → Application → Local Storage.

### S2.13 — Re-login dopo logout

Login secondo round: tutto deve funzionare come S2.1-S2.4. Niente residui di sessione, niente 403 spurii.

### S2.14 — Form pubblico `/prenota/<slug>`

In navigazione anonima (incognito):
1. Apri `/prenota/<slug-A>`.
2. **Network:** GET su `organizations`, `restaurant_settings`, `menu_items` filtrati per slug/tenant, tutti 200.
3. Compila form e invia.
4. **Network:** POST su `/functions/v1/create-booking` → 200.
5. **DB:** booking creata con `booking_source='public'`, `tenant_id == <UUID-A>`, `status='pending'`.
6. **Console:** nessun warning GoTrueClient.

### Output suite 2
Tabella + screenshot per ogni step UI (S2.3 modale prenotazione, S2.5 toast accept, S2.14 form pubblico).

---

# SUITE 3 — Resilienza, regressione, qualità

**Scopo:** stress sui casi limite e check di non-regressione su ciò che il piano NON ha toccato ma potrebbe aver impattato.

### S3.1 — Persistenza sessione attraverso reload

1. Login A. Reload pagina `/admin`.
2. **Atteso:** rimane loggato (sessione PKCE in localStorage), `useAdminAuth.checkSession` riconosce admin, dashboard carica senza chiedere login.
3. **Verifica:** nessuna chiamata a `set_tenant` (era il punto in cui il vecchio codice rompeva).

### S3.2 — Resilienza al pooler (regression test del bug originale)

Riprodurre il pattern che faceva fallire la GUC:

1. Login A.
2. In rapida successione (script Promise.all): 10 GET su `/booking_requests` + 10 POST insert + 5 PATCH update.
3. **Atteso:** zero 403, zero RLS errors. La nuova RLS è derivata dal JWT a ogni request → indipendente dalla connection pool.
4. **Severity se KO:** blocker (regressione del fix).

```js
// Snippet console
const results = await Promise.all([
  ...Array(10).fill().map(() => supabase.from('booking_requests').select('id').limit(1)),
  ...Array(10).fill().map((_, i) => supabase.from('booking_requests').insert({
    tenant_id: '<UUID-A>',
    client_name: `stress-${i}`,
    client_email: 'q@q',
    desired_date: '2027-02-01'
  })),
  ...Array(5).fill().map(() => supabase.from('restaurant_settings').select('*').limit(1)),
])
console.table(results.map(r => ({ status: r.status, error: r.error?.code })))
```

### S3.3 — Comportamento con JWT scaduto

1. Login A. In console: forza scadenza chiamando `await supabase.auth.signOut({ scope: 'others' })` o aspettando refresh.
2. Tentativo immediato di `select` su `booking_requests`: deve essere gestito (refresh automatico → 200, oppure errore esplicito → redirect a login).
3. **Atteso:** zero schermate bianche, zero loop infinito di 401.

### S3.4 — Email logs senza Edge `send-email`

Se la Edge Function `send-email` non è deployata (caso documentato in REPORT.md), la riga in `email_logs` deve comunque essere persistita con `status='failed'` e `error_message` valorizzato — non deve fallire l'intera azione admin.

### S3.5 — Storage no-op effettivo su `supabasePublic`

In console:

```js
const { supabasePublic } = await import('/src/lib/supabasePublic.ts')
console.log(localStorage.getItem('sb-public-no-session')) // atteso: null
console.log(Object.keys(localStorage).filter(k => k.includes('public-no-session'))) // atteso: []
```

E verifica che il warning GoTrueClient sia assente anche dopo HMR (modifica un file, salva, riapre la dashboard).

### S3.6 — Edge cases booking insert

1. Insert con `tenant_id` mancante via UI hook → la guard di `useCreateAdminBooking` deve scattare (toast + nessuna POST in Network).
2. Insert con `tenant_id` presente ma `current_admin_tenant_id()` NULL (caso teorico: admin appena rimosso da admin_users, sessione ancora viva). Atteso: trigger `enforce_booking_tenant` rifiuta con messaggio chiaro.

### S3.7 — Concorrenza tenant_usage trigger

`increment_booking_request_count` (trigger su `booking_requests` insert) aggiorna `tenant_usage`. Verificare con S3.2 che il contatore aumenti coerentemente del numero di insert riusciti.

```sql
SELECT booking_requests_count FROM tenant_usage WHERE organization_id = '<UUID-A>' AND year = 2026;
```

Atteso: incrementato del numero esatto di insert OK in S3.2.

### S3.8 — Sanity types DB

```bash
npm run build
```

Atteso: zero errori TypeScript. In particolare, verificare che il tipo `email_logs.Insert` esposto da `src/types/database.ts` abbia `tenant_id: string` non opzionale (se opzionale, è una regressione del rigenerato).

### S3.9 — Lint baseline

```bash
npm run lint
```

Atteso: zero errori, zero warnings (o documentati in `.eslintrc.cjs`).

### S3.10 — Regressione su flusso `/invite/:token`

Attivare il flusso di registrazione tramite invite token (Edge Function `validate-invite`):

1. Generare un token in SQL Editor (come da `Guida.md`).
2. Aprire `/invite/<token>` in incognito.
3. Compilare form e registrare nuovo admin.
4. **Atteso:** Auth user creato, riga in `admin_users` creata con `tenant_id` corretto, `invite_tokens.used_at` valorizzato.
5. Login con il nuovo admin → dashboard funzionante.

### Output suite 3
Tabella + log raw del browser per S3.2 (in particolare verificare che le 25 chiamate concorrenti restituiscano stati coerenti).

---

## Matrice di severità per il go/no-go finale

| Severità | Soglia tollerata |
|----------|------------------|
| Blocker | 0 |
| High | 0 |
| Medium | ≤2, con workaround documentato |
| Low | accettabili, da tracciare per follow-up |

Se anche un solo blocker o high fallisce: **rollback** della migrazione (drop policy nuove + ricreare le `tenant_*` GUC-based da `001_schema_completo.sql`) e revert dei file client. Lo stash `cleanup-before-tests-2026-05-04` resta come safety-net delle UI in pending.

---

## Allocazione agli agenti

Suggerimento: 3 agenti in parallelo, **Suite 1** (security), **Suite 2** (functional), **Suite 3** (resilience/regression). Ognuno produce report indipendente, poi un agente di sintesi consolida le 3 tabelle in un unico verdetto finale.

Prerequisito comune: i 2 tenant + admin di test devono esistere prima dell'avvio. Predisporre uno script di setup in `Lavoro/04-05-26/setup_test_data.sql` se manca.
