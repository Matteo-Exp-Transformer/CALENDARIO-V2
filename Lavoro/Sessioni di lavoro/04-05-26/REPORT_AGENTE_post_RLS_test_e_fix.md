# Report agente — verifica post-RLS, test plan ed emergenze risolte

**Data sessione:** 4 maggio 2026  
**Contesto:** esecuzione di `Lavoro/Sessioni di lavoro/04-05-26/TEST_PLAN_post_RLS.md` dopo migrazione `002_rls_admin_users.sql` sul progetto Supabase `rwuxgvldzrkabglkasym`.  
**Obiettivo:** validare sicurezza multi-tenant, funzionalità admin quando automatizzabile, regressioni e qualità build/lint.

---

## 1. Sintesi esecutiva

| Area | Esito |
|------|--------|
| Suite 1 (RLS REST + JWT) | **Superata** su tutti i casi eseguiti via API |
| Suite 2 (E2E browser) | **Non eseguita dall’agente** — richiede browser locale + DevTools |
| Suite 3 (stress + build/lint) | **Superata** dopo correzione blocker su `tenant_usage` |
| Blocker risolti in sessione | Edge Function `create-booking` assente → deploy; insert admin → fallimento RLS su `tenant_usage` → migrazione `003`; build fallita → fix UI/asset |
| Raccomandazione | **GO** sul perimetro DB/API; deploy Edge completati (`create-booking`, `validate-invite`). Resta **Suite 2** manuale browser. |

---

## 2. Analisi del report esecutore (`REPORT_ESECUZIONE_PLAN_RLS.md`)

È stato confrontato il contenuto dichiarato con codice e stato DB:

- Migrazione `002_rls_admin_users.sql`: helper `current_admin_tenant_id()`, policy `admin_*` su `booking_requests`, rimozione modello GUC `set_tenant`, trigger `enforce_booking_tenant` con ramo `IF auth.role() = 'authenticated'`.
- Client: assenza di `set_tenant` / `setCurrentTenant` in `src/`, `supabasePublic` con `storageKey: 'sb-public-no-session'`, uso di `tenant_id` su insert/log email, tipo `BookingRequest.tenant_id` obbligatorio.
- Deviazioni accettate dal report originale: push su `main` senza PR; golden path browser non ancora coperto dall’agente precedente.

---

## 3. Setup dati di test cross-tenant

### 3.1 Script SQL idempotente

È stato creato ed eseguito (con aggiustamento JSONB per `restaurant_settings.setting_value`):

**File:** `Lavoro/04-05-26/setup_test_data.sql`

Contenuto principale:

- Secondo tenant: slug `tenant-b-qa` (oltre a `al-ritrovo` già esistente).
- Righe `admin_users` per admin QA con email **validabili da Supabase Auth** (`@example.com`), non `@test.local` (rifiutato da Auth con `email_address_invalid`).
- Seed minimi: `restaurant_settings`, `menu_items`, `tenant_usage`, booking seed distinte per tenant (`seedA@test.local` / `seedB@test.local`) per PATCH/DELETE cross-tenant.

**UUID di riferimento (ambiente QA):**

| Ruolo | Slug | `organization_id` |
|-------|------|-------------------|
| Tenant A | `al-ritrovo` | `1de53854-4cbe-4065-9dbd-1ae84cac4f6d` |
| Tenant B | `tenant-b-qa` | `a7bd042b-162c-4cbe-9868-a5b0ae663208` |

**Booking seed tenant B** (per S1.6/S1.7): `id = 1f514da8-b9dd-4eb6-95f0-33b41831349f` (verificata intatta dopo tentativi di PATCH/DELETE da admin A).

### 3.2 Aggiornamento test plan

È stato aggiornato `Lavoro/04-05-26/TEST_PLAN_post_RLS.md` per allineare email e snippet SQL S1.13 a:

- `admin.a.rls@example.com`, `admin.b.rls@example.com`
- `outsider.rls@example.com` per S1.12

---

## 4. Utenti Supabase Auth

Richiesta utente: password **`123456`** per tutti.

Operazioni effettuate:

- Creazione / conferma utenti in `auth.users` per le tre email sopra (compatibilità login immediato).
- Verifica **`outsider.rls@example.com`** senza riga in `public.admin_users` (per S1.12).

Nota di sicurezza: password deboli solo per ambiente di test QA.

---

## 5. Edge Function `create-booking`

**Problema:** chiamata `POST /functions/v1/create-booking` → `404 NOT_FOUND` (funzione non deployata).

**Azione (primo deploy):** deploy tramite MCP Supabase della funzione dal sorgente `supabase/functions/create-booking/index.ts`, con `verify_jwt: true`.

**Aggiornamento (7 maggio 2026, §21):** per il **form pubblico** il client invoca la funzione con **solo la chiave anon**; il gateway Supabase poteva rispondere **401** se la verifica JWT restava forzata. È stata aggiunta in repo la sezione **`[functions.create-booking] verify_jwt = false`** in `supabase/config.toml`, è stato eseguito **`npx supabase functions deploy create-booking --project-ref rwuxgvldzrkabglkasym --no-verify-jwt`**, e nel client (`useBookingRequests.ts`) l’header **`apikey`** oltre a **`Authorization`**. L’autorizzazione applicativa resta su **slug tenant + rate limit** dentro la funzione (service role).

**Esito:** `201 Created` / `{ success: true, booking: { … tenant_id corretto } }` su slug `al-ritrovo`.

**Nota sul piano:** il documento menziona HTTP `200`; il comportamento REST corretto per creazione è **`201`** — considerato equivalente funzionale.

---

## 6. Fix applicativo (repository)

### 6.1 TypeScript — variant `Button`

Errori `TS2322`: `variant="solid"` non ammesso dal tipo del componente `Button`.

**File modificati:**

- `src/features/booking/components/MenuPricesTab.tsx`
- `src/features/booking/components/SettingsTab.tsx`

**Modifica:** `variant="solid"` → `variant="primary"` (mantenendo classi Tailwind esistenti).

### 6.2 Build — asset mancanti su `BookingRequestPage`

La build falliva per import di immagini assenti (`src/assets/IMG20241127235924.jpg`, `mobile-vintage-bg.png`).

**File modificato:** `src/pages/BookingRequestPage.tsx`

**Modifica:** rimozione degli import; sfondo pagina e fascia mobile resi con **gradient CSS** deterministico (nessuna dipendenza da asset binari mancanti).

### 6.3 Verifica qualità

- `npm run build`: **OK**
- `npm run lint`: **OK**

---

## 7. Blocker critico DB — insert admin e trigger `tenant_usage`

### 7.1 Sintomo

Durante **S3.2** (stress concorrente): tutte le **POST** su `booking_requests` come admin JWT → **403 Forbidden**, body PostgREST:

`new row violates row-level security policy for table "tenant_usage"`

Insert singolo confermato stesso errore.

### 7.2 Causa radice

Le funzioni trigger:

- `increment_booking_request_count()` (AFTER INSERT su `booking_requests`)
- `increment_booking_count_on_accept()` (AFTER UPDATE su `booking_requests`)

eseguono `INSERT … ON CONFLICT DO UPDATE` su `public.tenant_usage` come **invoker** (ruolo `authenticated`). Su `tenant_usage` risultano policy solo di **SELECT** per admin (`admin_select_tenant_usage`), senza INSERT/UPDATE esposti agli utenti applicativi → RLS blocca il mantenimento contatori.

La Edge Function `create-booking` usa **service role**, che bypassa RLS: il problema non emerge sul solo flusso pubblico.

### 7.3 Soluzione applicata

**Migrazione:** `supabase/migrations/003_fix_tenant_usage_triggers_security_definer.sql`

Entrambe le funzioni sono state ricreate come:

- `LANGUAGE plpgsql`
- **`SECURITY DEFINER`**
- **`SET search_path = public`**

Applicata anche al database remoto tramite MCP `apply_migration`.

### 7.4 Verifica post-fix

- POST singola admin booking → **201 Created**
- Stress S3.2: **10 GET + 10 POST + 5 GET** → tutti codici attesi (**200** / **201**), zero 403
- `tenant_usage.booking_requests_count` per tenant A anno corrente: incremento **+10** coerente con le 10 insert riuscite (S3.7)

---

## 8. Esecuzione dettagliata — SUITE 1 (automazione REST/curl)

Strumenti: `curl.exe`, body JSON tramite file temporaneo (PowerShell), JWT ottenuti con `grant_type=password` e anon key.

| Test | Risultato | Evidenza sintetica |
|------|------------|-------------------|
| S1.1 Anon SELECT `booking_requests` | OK | HTTP 200, corpo vuoto |
| S1.2 Anon INSERT `booking_requests` | OK | 401 / 42501 RLS |
| S1.3 Anon INSERT `email_logs` | OK | 401 / 42501 RLS |
| S1.4 Admin A filtra tenant B | OK | `[]` |
| S1.5 Admin A INSERT con `tenant_id` B | OK | Errore trigger: `tenant_id … diverso dal tenant dell'admin` |
| S1.6 Admin A PATCH booking B | OK | 200 + `[]`; DB: riga B ancora `pending` |
| S1.7 Admin A DELETE booking B | OK | 200 + `[]`; DB: riga B invariata |
| S1.8 Admin A SELECT `admin_users` | OK | Solo `tenant_id` = A (nessun admin B) |
| S1.9 Admin A su tabelle filtrate per B | OK | Tutti `[]` (email_logs, settings, menu_items, tenant_usage) |
| S1.10 Accesso pubblico anon | OK | organizations + menu + settings tenant A con dati |
| S1.11 `create-booking` | OK | 201 + `success: true` |
| S1.12 Outsider JWT SELECT `booking_requests` | OK | `[]` |
| S1.13 Ricorsione `admin_users` | OK | `EXPLAIN ANALYZE` ~0,23 ms |

**Tenant_id distinti osservati per admin A nei test di isolamento:** solo UUID tenant A.

---

## 9. SUITE 2 — Golden path admin (browser)

Non eseguita in questa sessione agente perché richiede:

- `npm run dev` su macchina utente
- ispezione Console (GoTrueClient, `set_tenant`)
- Network tab (RPC `check_admin_email`, REST filtrati)
- screenshot indicati nel piano

**Prerequisiti ora soddisfatti per E2E:** utenti Auth + `admin_users`, insert admin REST funzionanti dopo migrazione `003`, Edge `create-booking` attiva.

**Credenziali QA usate nella sessione API:**

- `admin.a.rls@example.com` / `123456` (tenant A)
- `admin.b.rls@example.com` / `123456` (tenant B)

**Form pubblico:** `http://localhost:5173/prenota/al-ritrovo`

---

## 10. SUITE 3 — Resilienza e qualità

| Test | Esito | Note |
|------|--------|------|
| S3.2 Stress 25 richieste concorrenti | OK (post 003) | 0 fallimenti HTTP |
| S3.7 Coerenza `tenant_usage` | OK | Delta +10 su 10 POST |
| S3.8 `npm run build` | OK | |
| S3.9 `npm run lint` | OK | |
| Tipo `email_logs.Insert.tenant_id` | OK | Obbligatorio in `src/types/database.ts` |
| S3.1, S3.3–S3.6, S3.5 | N/A qui | Browser / scenari manuali |
| S3.10 `/invite/:token` | Pronto da verificare in UI | **validate-invite** deployata dopo il primo report (`npx supabase functions deploy validate-invite`). Eseguire smoke manuale su `/invite/:token`. |

---

## 11. Limiti MCP browser (localhost)

Tentativi di automazione browser via MCP (`user-playwright`) verso `http://localhost:5173` hanno restituito `ERR_CONNECTION_REFUSED` o contesto browser chiuso: l’agente non ha potuto eseguire Suite 2 in modalità headless remota. L’E2E resta sul browser dell’utente.

---

## 12. Matrice go / no-go (come da piano)

| Severità | Soglia | Stato dopo lavoro svolto |
|----------|--------|---------------------------|
| Blocker | 0 | **0** (dopo deploy `create-booking` + migrazione `003`) |
| High | 0 | **0** |
| Medium | ≤2 con workaround | **S3.10** ridotto a verifica manuale post-deploy |

---

## 13. Artefatti e file toccati (repository)

| File / percorso | Azione |
|-----------------|--------|
| `Lavoro/Sessioni di lavoro/04-05-26/setup_test_data.sql` | Creato / aggiornato (cast `to_jsonb` settings) |
| `Lavoro/Sessioni di lavoro/04-05-26/TEST_PLAN_post_RLS.md` | Aggiornato (email `@example.com`) |
| `Lavoro/Sessioni di lavoro/04-05-26/cleanup_qa_test_data.sql` | Script DELETE mirata post-QA |
| `supabase/migrations/003_fix_tenant_usage_triggers_security_definer.sql` | **Nuovo** — allineare repo a DB remoto |
| `src/features/booking/components/MenuPricesTab.tsx` | Fix variant Button |
| `src/features/booking/components/SettingsTab.tsx` | Fix variant Button |
| `src/pages/BookingRequestPage.tsx` | Rimozione dipendenza asset mancanti |

**Operazioni solo su ambiente Supabase (non tutte versionate):** deploy Edge `create-booking` e `validate-invite`; `apply_migration` per `003`; dati seed e utenti Auth QA.

---

## 14. Pulizia dati consigliata (post-QA)

Durante stress e test sono stati creati record di comodo (es. `client_email` `stress@test.local`, booking `plan-suite`, `after-fix`, ecc.). Usare **`cleanup_qa_test_data.sql`** nella cartella sessione oppure DELETE mirata equivalente; **senza** `TRUNCATE` globale.

---

## 15. Prossimi passi suggeriti

1. Completare **Suite 2** in browser locale (`npm run dev`) seguendo `TEST_PLAN_post_RLS.md` — credenziali QA `admin.a.rls@example.com` / `123456`.
2. Smoke **S3.10**: generare token invito in SQL, aprire `/invite/<token>`, completare registrazione (Edge **validate-invite** ora deployata).
3. **Commit e push** del repo (migrazione `003`, fix UI, cartella doc sessione) per evitare disallineamento repo ↔ DB remoto.
4. Prima del go-live: pulizia booking QA, rimozione o reset password utenti `*.rls@example.com`; tenere **`SECURITY DEFINER`** sui trigger contatori (preferibile ad aprire INSERT/UPDATE `tenant_usage` agli admin).

---

## 16. Aggiornamento completamento repository (sessione successiva)

- Documentazione operativa **`Guida.md`** e **`dati db calendario V.2.txt`**: unica posizione prevista **`Lavoro/Knowledge Base/`** (non più sotto `02-05-26`).
- Report esecuzione piano spostato sotto **`Lavoro/Sessioni di lavoro/04-05-26/`**; rimossa copia obsoleta da `Lavoro/04-05-26/` se presente in indice git.
- **`validate-invite`** deployata con CLI: `npx supabase functions deploy validate-invite --project-ref rwuxgvldzrkabglkasym`.

---

## 17. Aggiornamento — documentazione Knowledge Base e Suite 2 (agente)

| Attività | Dettaglio |
|----------|-----------|
| Checklist Suite 2 in linguaggio semplice | Creato **`Lavoro/Knowledge Base/CHECKLIST_Suite2_browser_semplice.md`** (passi S2.1–S2.14 con esempi pratici, riferimento a credenziali e slug `al-ritrovo`). |
| Credenziali QA | Creato / aggiornato **`Lavoro/Knowledge Base/Utenti per test.md`** (admin A/B, outsider, link rapidi). |
| Nota su calendario vs archivio | In checklist **S2.5**: chiarito che dopo l’accettazione le prenotazioni **compaiono nel calendario** (slot confermati) e restano consultabili anche dall’**archivio** — due viste complementari. |

*Cartella **`Lavoro/Knowledge Base/`** versionata nel commit successivo (checklist, utenti test, eventuali altre note operative).*

---

## 18. Aggiornamento — bug modifica prenotazione e verifica utente (maggio 2026)

### 18.1 Lavoro svolto dall’utente (QA manuale)

- Esecuzione **Suite 2** in ambiente locale (`npm run dev`), login **admin A**.
- Segnalazione console: errore in **salvataggio modifica** prenotazione (`useUpdateBooking` / `BookingDetailsModal`), messaggio DB **`null value in column "client_email"`** (vincolo NOT NULL).
- Chiarimento comportamento: le richieste **accettate** risultano **presenti nel calendario** (dopo un primo dubbio su archivio vs calendario).
- Conferma post-fix: **«ok ora funziona»** — modifica prenotazione riuscita.
- **Isolamento multi-tenant (verifica manuale):** accesso con **account diverso** (admin del **ristorante B**, `admin.b.rls@example.com`). Confermato in QA: si vedono **solo** le prenotazioni del tenant B; **non** compaiono le prenotazioni del tenant A — coerente con le policy RLS e con la Suite 1 già validata via API.

### 18.2 Lavoro svolto dall’agente (fix codice)

| File | Modifica |
|------|----------|
| `src/features/booking/hooks/useBookingMutations.ts` | In `useUpdateBooking`, `client_email` non viene più inviato come `null`: si usa sempre stringa (trim), stringa vuota `''` se assente — allineato a colonna **NOT NULL** con default `''` in DB. |
| `src/features/booking/components/BookingDetailsModal.tsx` | In `performSave`, `client_email` passato come `(formData.client_email ?? '').trim()` invece di `null`. |

**Causa radice:** il codice assumeva `client_email` nullable; lo schema PostgreSQL la mantiene obbligatoria.

### 18.3 Avvisi console ancora possibili (non risolti in questo fix)

- **`Unknown option 'eventCursor'`** (FullCalendar / `@fullcalendar/react`): opzione non riconosciuta dalla versione in uso; compare in `BookingCalendar.tsx` (config `eventCursor: 'pointer'`). È un warning di libreria, distinto dal bug DB sopra. Correzione consigliata futura: rimuovere `eventCursor` dal config e applicare `cursor: pointer` via CSS sugli eventi `.fc-event`.
- Messaggi **CursorBrowser** / **React DevTools**: informativi in dev, non errori applicativi.

---

## 19. Come proseguire (ordine consigliato)

**Già coperto in questa sessione (commit):** fix modifica prenotazione (`client_email`), aggiornamento report, checklist e utenti test in Knowledge Base, documentazione **`Guida.md`** / **`dati db calendario V.2.txt`** consolidata solo in **`Lavoro/Knowledge Base/`** (rimossi duplicati da `02-05-26`).

1. **Completare Suite 2**  
   Continuare con **`CHECKLIST_Suite2_browser_semplice.md`** (accetta/rifiuta, email log, test email, menu, logout, form pubblico incognito). Annotare OK/KO come da **`TEST_PLAN_post_RLS.md`** se serve traccia formale.

2. **Smoke S3.10** (`/invite/:token`)  
   Con `validate-invite` già deployata: generare token in SQL, flusso incognito, verifica `admin_users` + `invite_tokens.used_at`.

3. **Pulizia QA e sicurezza**  
   Eseguire o adattare **`cleanup_qa_test_data.sql`**; prima del go-live rimuovere o rinforzare password utenti `*.rls@example.com`.

4. **Opzionale — rumore FullCalendar**  
   Rimuovere `eventCursor` dalla config e spostare lo stile su CSS per eliminare i warning in console.

---

## 20. Chiusura commit (riferimento operativo)

Versionati in commit dedicato: fix modifica prenotazione (`BookingDetailsModal`, `useBookingMutations`), **`REPORT_AGENTE_post_RLS_test_e_fix.md`**, cartella **`Lavoro/Knowledge Base/`** (checklist Suite 2, utenti test, **`Guida.md`**, **`dati db calendario V.2.txt`** — unica sede per questi file).

---

## 21. Aggiornamento — form pubblico `/prenota`, checklist Suite 2, MCP `email_logs` (7 maggio 2026)

### 21.1 Contesto

In QA browser comparivano **`406`** su `restaurant_settings` (chiave `business_hours`, `.single()` senza riga) e **`401`** su `POST /functions/v1/create-booking` con invio dal form. Inoltre il dropdown **Tipologia di prenotazione** era commentato in UI: restava implicito solo **Rinfresco di Laurea** senza percorso chiaro **“Prenota un tavolo”**.

### 21.2 Lavoro svolto dall’agente (codice e deploy)

| File / azione | Modifica |
|---------------|----------|
| `src/hooks/useBusinessHours.ts` | `.single()` → **`.maybeSingle()`** sulla lettura `business_hours` per tenant: evita **406** quando la riga non esiste (si usano orari di default). |
| `src/features/booking/hooks/useBookingRequests.ts` | Chiamata Edge: header **`apikey`** uguale alla chiave anon, oltre a **`Authorization: Bearer <anon>`**. |
| `supabase/config.toml` | Sezione **`[functions.create-booking] verify_jwt = false`** documentata in repo. |
| Deploy remoto | `npx supabase functions deploy create-booking --project-ref rwuxgvldzrkabglkasym --no-verify-jwt`. |
| `src/features/booking/components/BookingRequestForm.tsx` | Default **`booking_type: 'tavolo'`**; **select “Tipologia di Prenotazione”** riattivato (opzioni tavolo senza menù / Rinfresco con menù); al passaggio a tavolo si azzerano menù, totali e intolleranze; rimosso `useEffect` non necessario. |
| `npm run build` | **OK** dopo le modifiche. |

**Commit di riferimento (già su `main`):** `5b0037e` — messaggio: `fix(booking): form pubblico tavolo default; maybeSingle settings; create-booking anon headers; Edge JWT off in config`.

### 21.3 Verifica DB tramite MCP (traccia S2.5)

Eseguita query su **`public.email_logs`**: per il tenant A risultano righe con **`email_type = booking_accepted`** e **`booking_id`** valorizzato; **`status`** può risultare **`failed`** se l’invio reale non è configurato — per la checklist è sufficiente la **presenza della riga** (traccia evento). S2.5 in **`CHECKLIST_Suite2_browser_semplice.md`** portata a **completata** con questa nota.

### 21.4 Documentazione Knowledge Base

- **`CHECKLIST_Suite2_browser_semplice.md`:** legenda **N/A**; stati aggiornati (S2.5 ✅, S2.8/S2.11 N/A con motivazione piano free / assenza UI, S2.12–S2.13 ✅, S2.14 🟡 da riverificare in browser); sezione istruzioni e troubleshooting **401/406**.
- **`PROMPT_plan_UI_impostazioni_ristorante.md`** e **`PROMPT_plan_UI_menu_ingredienti_admin.md`:** prompt pronti per agenti che devono pianificare UI **Impostazioni** (S2.9) e **menu/listino** admin (S2.10).

### 21.5 Prossimi passi (invariati dal piano generale)

Riverificare S2.14 in incognito (POST **201**); usare i due PROMPT per sbloccare S2.9 e S2.10 in UI; opzionale rimozione warning FullCalendar (`eventCursor`).

---

*Report aggiornato: 7 maggio 2026 — §21 form pubblico, deploy `create-booking`, checklist e prompt Knowledge Base (commit `5b0037e`).*
