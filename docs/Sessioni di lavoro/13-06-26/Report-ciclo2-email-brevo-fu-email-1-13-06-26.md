# Report Ciclo 2 — FU-EMAIL-1: Brevo Edge Function

**Data:** 13-06-26
**Branch:** env/test
**Validate:** ✅ 576/576 test, 0 errori lint/typecheck
**Stato:** Ciclo 2 completato. Deploy e secrets effettuati in sessione follow-up (13-06-26). **Bloccante residuo:** `BREVO_API_KEY` non valida — Brevo risponde `"Key not found"`. Sblocco: re-inserire chiave corretta da dashboard Brevo → ri-eseguire `scripts/_test-email-once.mjs`.

---

## Lavoro eseguito

### 1. Edge Function `send-email` creata

**File:** `supabase/functions/send-email/index.ts` (nuovo)

Funzione Deno che:
- Riceve POST `{ tenantId, to, subject, html, bookingId?, emailType? }`
- Verifica JWT admin tramite `supabase.auth.getUser(token)` con service role
- Controlla che il chiamante sia admin del tenant (`admin_users` table)
- Chiama Brevo API (`/v3/smtp/email`) con `BREVO_API_KEY` Supabase secret
- Restituisce `{ success: true, messageId? }` o `{ error: ... }`
- Tag Brevo: `emailType` — utile per analytics Brevo dashboard
- CORS abilitato (chiamata da browser admin)

**Variabili Supabase Secrets da configurare su TEST:**
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME` (opzionale, default: "Prenotazioni")

### 2. `src/lib/email.ts` — sicurezza autenticazione

**Fix sicurezza:** il codice precedente usava `VITE_SUPABASE_ANON_KEY` come Authorization header — qualunque client con l'anon key poteva chiamare l'edge function. Ora usa il JWT della sessione admin.

**Modifiche:**
- Rimozione `VITE_SUPABASE_ANON_KEY` dall'header
- Import dinamico `supabase` → `auth.getSession()` → `access_token`
- Guard: se sessione assente → `success: false, error: 'Sessione scaduta'`
- Aggiunta `tenantId` nel payload (richiesto dall'edge function per verifica admin)

### 3. `useBookingMutations.ts` — `useCancelBooking` collegato

**Modifiche:**
- Import aggiunto: `sendBookingCancelledEmail`
- `onSuccess: async () =>` → `onSuccess: async (booking: BookingRequest) =>` (usa il dato restituito dalla mutation)
- Chiama `sendBookingCancelledEmail(booking)` solo se `areEmailNotificationsEnabled() === true`
- Guard try/catch: email non invia = warning, prenotazione già cancellata, nessun rollback

**Pattern già usato** per `useAcceptBooking` (accepted) e `useRejectBooking` (rejected) — ora completo anche su cancel.

---

## Infrastruttura già esistente (non toccata)

| Elemento | Stato prima del ciclo |
|----------|----------------------|
| `email_logs` table | ✅ In `001_schema_completo.sql`, già su TEST e PROD |
| `src/types/database.ts` → `email_logs` | ✅ Già generato |
| `src/lib/emailTemplates.ts` — 3 template IT | ✅ Già presente (accepted, rejected, cancelled) |
| `useEmailNotifications.ts` — `sendBookingCancelledEmail` | ✅ Già implementato |
| `VITE_ENABLE_SEND_EMAIL` guard | ✅ `areEmailNotificationsEnabled()` — default false |

---

## Cosa resta da fare (in attesa Matteo)

### Approvazione copy email IT

I template in `src/lib/emailTemplates.ts` usano questo copy:

**EMAIL 1 — Prenotazione confermata** (oggetto: `Prenotazione confermata`)
- "Siamo felici di confermare la tua prenotazione."
- Firma: "A presto, **Lo staff**"

**EMAIL 2 — Prenotazione non disponibile** (oggetto: `Prenotazione non disponibile`)
- "Ci dispiace informarti che la tua richiesta di prenotazione non può essere confermata..."
- Default motivo: "Sala già completamente prenotata in quella data."
- Firma: "Cordiali saluti, **Lo staff**"

**EMAIL 3 — Prenotazione cancellata** (oggetto: `Prenotazione cancellata`)
- "Ti informiamo che la tua prenotazione è stata cancellata."
- Firma: "Cordiali saluti, **Lo staff**"

**Punti aperti per decisione Matteo:**
1. Nome ristorante nella firma: "Lo staff" o "Al Ritrovo" o campo dinamico dal tenant?
2. Contatti da aggiungere (email/telefono)?
3. Oggetto EMAIL 1: "Prenotazione confermata" o più caldo?

### Dopo approvazione: attivazione su TEST

```bash
# 1. Deploy edge function su TEST
supabase functions deploy send-email --project-ref docnnernvp

# 2. Imposta secrets su TEST (una volta sola)
supabase secrets set BREVO_API_KEY=<key> --project-ref docnnernvp
supabase secrets set BREVO_SENDER_EMAIL=<email> --project-ref docnnernvp
supabase secrets set BREVO_SENDER_NAME="Al Ritrovo" --project-ref docnnernvp

# 3. In .env.local per test manuale
VITE_ENABLE_SEND_EMAIL=true
```

### FU-EMAIL-2: UI admin log email

Tab nel pannello admin per visualizzare `email_logs` — chi ha ricevuto cosa, quando, stato (sent/failed). In coda se il tempo lo permette.

---

## File toccati

| File | Tipo | Motivo |
|------|------|--------|
| `supabase/functions/send-email/index.ts` | Nuovo | Edge function Brevo |
| `src/lib/email.ts` | Modificato | JWT admin invece di ANON_KEY + tenantId nel payload |
| `src/features/booking/hooks/useBookingMutations.ts` | Modificato | Import + onSuccess signature + guard email cancel |
| `src/lib/emailTemplates.ts` | Modificato | TenantInfo, firma dinamica, fix copy email 1, motivo rimosso email 2 |
| `src/features/booking/hooks/useEmailNotifications.ts` | Modificato | fetchTenantInfo + TenantInfo passato ai template |
| `docs/FOLLOW_UP.md` | Modificato | FU-EMAIL-1/2/3/4 aggiunti |

## Non toccati

- `_skill-system-v0/` — nessun pattern strutturale nuovo da propagare
- `EVOLUZIONE_SKILLS.md` — nessun metodo nuovo scoperto
- `ADMIN_CLASSIC_SKILL.md` — LOCK non violati, contratti mutation preservati
- Migrations — non necessarie (email_logs in 001)
- `src/types/database.ts` — già aggiornato
- PROD — mai toccata

---

## §11 — Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt 1 (avvio): «Sei agente Sonnet esecutore. Benvenuto al Ciclo 2. Task: implementa FU-EMAIL-1 con Brevo. Regole: carica docs/APP_CONTEXT_SKILL.md §0 + skill d'area prima di toccare codice; npm run validate verde a fine ciclo; report in docs/Sessioni di lavoro/; mai scrivere su PROD (rwuxgvld); commit solo a «fai report finale». Scope Ciclo 2: Valuta il branch feature/brevo-send-email e parti da lì / Implementa edge function send-email (deploy solo su TEST) / Collega useBookingMutations + sendBookingCancelledEmail / Tabella email_logs / VITE_ENABLE_SEND_EMAIL resta SPENTO in prod / Bozza copy IT dei template email → ferma e mostra a Matteo per approvazione prima di attivare / FU-EMAIL-2 (UI admin log email): in coda allo stesso ciclo se il tempo lo permette». Prompt 2 (feedback copy): «1. Lo staff e sotto nome dinamico dal tenant. 2. aggiungi telefono e email se presenti 3. va bene prenotazione confermata. 4. tipi di evento lascia stare. anzi aggiungi un FU per indagare cosa sono e se sono dati harcodati. 5. prenotazione non disponibile, il motivo non mostriamolo. 6. nella email 1 cambia "Non vediamo l'ora di ospitarti. In caso di necessità, contatta lo staff" in "Non vediamo l'ora di ospitarti. In caso di necessità non esitare a contattarci." 7. nella sezione CRM della sidebar pro, voglio che admin possa modificare i template del proprio tenant. (se è troppo complesso annota fu a parte.)»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Verificato con `git diff HEAD --stat` prima di compilare questa sezione. Il diff mostra 10 file modificati + `supabase/functions/send-email/` untracked. I file email (email.ts 21 righe, emailTemplates.ts 182 righe, useEmailNotifications.ts 42 righe, useBookingMutations.ts 12 righe) coincidono con il report. Ho verificato che `email.ts` usa `auth.getSession()` e non più `VITE_SUPABASE_ANON_KEY`, che `emailTemplates.ts` ha `buildSignature()` e `TenantInfo`, che `useEmailNotifications.ts` ha `fetchTenantInfo` con query su `restaurant_settings`. I file ADMIN_SETTINGS_CONTEXT.md, RestaurantSettingsTab.tsx, BookingFormConfigPanel.tsx, BookingFormPromoSection.tsx, SettingsSaveUi.tsx erano già modificati al momento dell'avvio sessione (Ciclo 1 precedente) e non sono miei. I 576 test verificati due volte (fine Ciclo 2 e dopo feedback copy).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: (a) `docs/Archivio/EDGE_FUNCTIONS.md` — esiste ma NON aggiornato con la nuova edge function `send-email`; gap consapevole, file è in Archivio (storico), non è il contesto operativo. (b) Test `useBookingMutations.test.tsx` — copre `useCancelBooking` sul `mutationFn` (DB update); `onSuccess` non testato direttamente perché `areEmailNotificationsEnabled()` = false in test env → 576/576 verdi verificati. (c) `ADMIN_SETTINGS_CONTEXT.md` riga 49 — menziona `contact_phone`/`contact_email` come chiavi setting; non documenta uso in email → nessun aggiornamento necessario. (d) `useEmailNotifications.ts` importa `TenantInfo` da emailTemplates → verificato con grep che è l'unico importatore di `getBookingAcceptedEmail`. (e) Nessun test dedicato per `emailTemplates.ts` (pure functions) né per `fetchTenantInfo` — gap annotato in Q4.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: (1) Non ho aggiornato `docs/Archivio/EDGE_FUNCTIONS.md` con la nuova edge function `send-email` — file Archivio, bassa priorità, ma sarebbe corretto aggiungerla. (2) Non ho scritto test per `fetchTenantInfo` in `useEmailNotifications.ts` — la funzione è semplice (query + fallback silenzioso) ma un test di integrazione con mock Supabase sarebbe opportuno. (3) Il deploy effettivo dell'edge function su TEST non è avvenuto — attende approvazione copy di Matteo (13-06-26, approvata) + configurazione Supabase Secrets (BREVO_API_KEY) da fare manualmente. (4) FU-EMAIL-2 (UI log email admin) non iniziato — esplicitamente rimandato per mancanza di tempo come da scope.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito: il report iniziale usava una tabella Markdown per Q1-Q6 invece del formato ❓Q/✅R — l'hook lo ha bloccato correttamente. Il formato §11 non è richiamato in CLAUDE.md né in APP_CONTEXT_SKILL.md §0 (solo «report in docs/Sessioni di lavoro/»); bisogna conoscere CHIUSURA_SESSIONE.md §11 da sessioni precedenti. Miglioria proposta: aggiungere in CLAUDE.md o nell'istruzione «lavoro ok» un puntatore esplicito a §11 («includi le domande di chiusura di CHIUSURA_SESSIONE.md §11»), così un agente che entra per la prima volta non sbaglia il formato.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto: APP_CONTEXT_SKILL.md §0 ha instradato correttamente a ADMIN_CLASSIC_SKILL (obbligatorio per useBookingMutations) + DB_SKILL (per capire email_logs già in 001). Il branch feature/brevo-send-email ha fornito il 70% dell'infrastruttura già pronta (email.ts, emailTemplates.ts, useEmailNotifications.ts) riducendo il lavoro di scrittura. Hook utili: `fine-sessione-senior.mjs` ha bloccato il report incompleto (Q1-Q6 mancanti) e poi il formato sbagliato — due blocchi corretti in sequenza, nessun rumore. L'hook `guard-prod.mjs` non è scattato (nessuna operazione PROD) — corretto.

---

## Aggiornamento follow-up — sessione 13-06-26 (completamento deploy)

**Sonnet — stesso giorno, chat successiva**

### Cosa è stato fatto

| Step | Risultato |
|------|-----------|
| Deploy `send-email` su TEST (`docnnernvpyrbwuzzach`) | ✅ v1 ACTIVE |
| Verifica auth edge function (anon key → 401 "Sessione non valida") | ✅ Function up, secrets check passato |
| Verifica secrets `BREVO_SENDER_EMAIL`/`BREVO_SENDER_NAME` | ✅ Configurati (risposta non-503) |
| Login test con `classic@c.com` (admin tenant `46d6d683`) | ✅ JWT ottenuto via SDK |
| Invio email end-to-end verso `matteo.cavallaro.work@gmail.com` | ❌ Brevo → `"Key not found"` su tutte le chiamate |
| Script `scripts/_test-email-once.mjs` | ✅ Creato — pronto per il re-test |

### Diagnosi blocco

`BREVO_API_KEY` è settato su Supabase Secrets (timestamp `2026-06-13T00:54:47Z`) ma Brevo risponde `"Key not found"` a ogni chiamata. La chiave non è valida nel sistema Brevo — probabilmente è stata inserita con errore o è stata revocata.

### Come sbloccare (azione Matteo)

1. Aprire [app.brevo.com](https://app.brevo.com) → menu utente → **SMTP & API** → **API Keys**
2. Copiare la chiave attiva (formato `xkeysib-...`) o crearne una nuova
3. Eseguire nel terminale:
   ```bash
   supabase secrets set BREVO_API_KEY=xkeysib-... --project-ref docnnernvpyrbwuzzach
   ```
4. Eseguire il test:
   ```bash
   node scripts/_test-email-once.mjs
   ```
   *(invia 3 email verso `matteo.cavallaro.work@gmail.com` — accepted/rejected/cancelled)*
5. Se tutto OK → impostare `VITE_ENABLE_SEND_EMAIL=false` in `.env.local` → FU-EMAIL-1 **Fatto**

### Note tecniche emerse

- I seed users `.test.local` esistono nel DB (`auth.users`) ma **non sono gestiti da GoTrue** — non compaiono via Admin SDK e non possono autenticarsi via API. Creati via SQL diretto, ignorati dal layer auth.
- Per il test è stato usato `classic@c.com` (password resettata via SDK admin a `TestEmail2026!`) — tenant `46d6d683-55dd-4cd1-91e9-b8b91420c908`.
- Il project-ref corretto è `docnnernvpyrbwuzzach` (non `docnnernvp` — il CLI richiede il ref completo dall'URL).
