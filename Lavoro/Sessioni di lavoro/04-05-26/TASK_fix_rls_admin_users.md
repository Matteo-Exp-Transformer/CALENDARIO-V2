# TASK — Fix strutturale RLS multi-tenant + cleanup applicativo

> Esecuzione del piano `c-users-matte-mio-cursor-plans-debug-rls-shiny-porcupine.md`.
> Le scelte architetturali sono già state prese — l'agente esegue, non ridiscute.

---

## Decisioni già prese (non rimettere in discussione)

| Tema | Scelta |
|------|--------|
| Modello RLS | Sub-query su `admin_users` via `auth.jwt()->>'email'` (helper `current_admin_tenant_id()`) |
| GUC `app.current_tenant_id` | **Eliminata**, RPC `set_tenant(uuid)` rimossa |
| Anon insert su `booking_requests` / `email_logs` | **Chiusi** — pubblico passa solo via Edge Function `create-booking` |
| `tenant_usage` | Drop `anon_select_tenant_usage` e `tenant_select_usage`, nuova `admin_select_tenant_usage` su `organization_id = current_admin_tenant_id()` |
| Trigger `enforce_booking_tenant` | Solo `authenticated` (`IF auth.role() = 'authenticated'`) per non bloccare la Edge Function service-role |
| Edge Functions | **Nessuna modifica** |
| Ambiente | Solo `rwuxgvldzrkabglkasym` (no staging) |
| Tipi DB | Rigenerare con `npm run db:types:linked` post-migrazione, committare `src/types/database.ts` |
| Admin → tenant | Un admin = un solo tenant. `current_admin_tenant_id()` con `LIMIT 1`. Nessun supporto multi-tenant per admin |
| Warning GoTrueClient | Fix con `storageKey` distinto + storage no-op su `supabasePublic`. Sufficiente |
| `email_logs` | **Esteso al piano**: aggiungere `tenant_id` a `EmailLog` / `SendEmailOptions` / payload insert. Sorgente: `booking.tenant_id` per transazionali, `useTenantContext().tenantId` per test |

---

## Sequenza esecuzione

### 1. Branch
```
git checkout -b fix/rls-admin-users
```

### 2. Migrazione SQL
Creare `supabase/migrations/002_rls_admin_users.sql` seguendo **letteralmente** Fase 1.1 → 1.5 del piano:

- `current_admin_tenant_id()` SECURITY DEFINER con `SET search_path = public`, `GRANT EXECUTE` a `authenticated`.
- Drop di tutte le policy GUC-based su `booking_requests`, `admin_users`, `email_logs`, `restaurant_settings`, `menu_items`, `tenant_usage`.
- Drop `anon_select_tenant_usage` e `set_tenant(uuid)`.
- Nuove policy `admin_*` come da piano.
- Trigger `enforce_booking_tenant` su `BEFORE INSERT OR UPDATE` di `booking_requests`.

Applicare via Supabase Dashboard → SQL Editor sul progetto `rwuxgvldzrkabglkasym`.

### 3. Verifica SQL
Eseguire i 3 check del piano (sezione A "Applicare la migrazione") e lo smoke test JWT (sezione B). Se fallisce: STOP e segnalare.

### 4. Rigenerazione tipi
```
npm run db:types:linked
```
Verificare che `src/types/database.ts` contenga `tenant_id: string` non-nullable in `email_logs.Insert`. Committare il file.

### 5. Modifiche client React (in ordine)

**5.a — `src/contexts/TenantContext.tsx`:** rimuovere riga 83 (`await (supabase.rpc as any)('set_tenant', { tid: resolvedTenantId })`). Lasciare il resto intatto.

**5.b — `src/lib/supabase.ts`:** rimuovere `setCurrentTenant` (righe 41-45). Verificare con grep che non sia importata altrove (oggi non lo è — solo usato inline in TenantContext).

**5.c — `src/lib/supabasePublic.ts`:** aggiungere a `auth: {}`:
```ts
storageKey: 'sb-public-no-session',
storage: {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
},
```

**5.d — `src/features/booking/hooks/useAdminBookingRequests.ts`:** importare `useTenantContext`, estrarre `tenantId`, guard `if (!tenantId) throw new Error(...)`, aggiungere `tenant_id: tenantId` come prima proprietà di `insertData`.

**5.e — `src/lib/email.ts`:**
- Aggiungere `tenantId: string` a `SendEmailOptions`.
- Aggiungere `tenant_id: string` a `EmailLog`.
- In `logEmailToDatabase` aggiungere `tenant_id: log.tenant_id` come prima proprietà di `logData`.
- In `sendAndLogEmail` aggiungere `tenant_id: options.tenantId` al log object.

**5.f — `src/features/booking/hooks/useEmailNotifications.ts`:** in tutte e 3 le chiamate `sendAndLogEmail`, aggiungere `tenantId: booking.tenant_id`.

**5.g — `src/features/booking/components/TestEmailModal.tsx`:**
- `import { useTenantContext } from '@/contexts/TenantContext'`
- Estrarre `const { tenantId } = useTenantContext()`.
- Guard nel `handleTestEmail`: `if (!tenantId) { toast.error('Tenant non disponibile'); return }`.
- Passare `tenantId` nella call a `sendAndLogEmail`.

**5.h — `src/types/booking.ts`:** verificare che `BookingRequest` esponga `tenant_id: string`. Se manca, aggiungerlo.

### 6. Build & lint
```
npm run lint
npm run build
```
Devono passare a zero errori. Se TypeScript si lamenta in qualche file non in lista, NON aggiustarlo silenziosamente: segnalare nel report finale.

### 7. Test browser (golden path)
Eseguire `npm run dev` e verificare manualmente:

1. Login admin → console **senza** warning `Multiple GoTrueClient`.
2. Tab Network: `GET .../booking_requests?select=*` → 200 (non più 403).
3. Crea prenotazione admin da `AdminBookingForm` → 201, riga visibile.
4. Accept di una pending → status update + nuova riga in `email_logs` con `tenant_id` corretto (controllare in Supabase Table Editor).
5. Reject di una pending → idem.
6. Test email da `TestEmailModal` → log persistito con `tenant_id`.
7. Form pubblico `/prenota/<slug>` (logout prima) → invariato.

### 8. Test negativi
- Logout, poi DevTools console: `await supabase.from('booking_requests').select('*')` → deve fallire/array vuoto (no admin → `current_admin_tenant_id()` NULL).
- `curl -X POST .../rest/v1/booking_requests` con anon key → deve restituire errore RLS.

### 9. PR
Apri PR su `main` con:
- Titolo: `fix: replace GUC-based RLS with admin_users-derived tenant isolation`
- Body: link al piano + sezione "Test plan" che ricalca il punto 7 e 8.
- NON eseguire `git push --force` o operazioni distruttive.

---

## Cosa NON fare

- ❌ Non modificare `001_schema_completo.sql` (mantenuto per setup nuovi). Tutte le modifiche schema vanno in `002_rls_admin_users.sql`.
- ❌ Non toccare le Edge Functions (`create-booking`, `validate-invite`).
- ❌ Non rimuovere/cambiare le policy `anon_select_*` su `organizations`, `restaurant_settings`, `menu_items`, `invite_tokens`, `rate_limits` — restano necessarie per il flusso pubblico.
- ❌ Non introdurre nuove dipendenze npm.
- ❌ Non rifattorizzare `useEmailNotifications` o `email.ts` oltre quanto serve a passare `tenantId`.
- ❌ Non aggiungere commenti che descrivono cosa fa il codice; solo commenti di "perché" se necessari (es. SECURITY DEFINER nella migrazione).
- ❌ Non eseguire `git push` automatico né merge automatico — solo creare la PR.
- ❌ Non chiedere conferme intermedie su scelte già definite in questo task. Procedere fino al primo blocker reale.

---

## Cosa fare se qualcosa va storto

- **Errore SQL nella migrazione:** non patchare in produzione, fai rollback (le policy nuove possono essere droppate, le vecchie ricreate da `001_schema_completo.sql`). Riporta l'errore esatto.
- **TypeScript rotto in file non listati:** stop e riporta. Probabile drift dei tipi DB.
- **Test browser fallisce:** raccogli payload Network (status, response body), schermata della console, riportali nel report finale. NON tirare a indovinare la causa con altri commit speculativi.

---

## Output atteso a fine task

Un report finale (≤300 parole) con:
1. SHA del commit della migrazione, della rigenerazione tipi, dei fix client.
2. Output dei 3 check SQL (nomi policy, `current_admin_tenant_id` esiste, `set_tenant` non esiste).
3. Esito del golden path (numerati 1-7) con OK/KO.
4. Esito test negativi.
5. URL della PR.
6. Eventuali deviazioni dal task con motivazione.
