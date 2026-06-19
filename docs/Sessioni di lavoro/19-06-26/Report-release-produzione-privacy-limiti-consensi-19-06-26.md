---
name: report-release-produzione-privacy-limiti-consensi-19-06-26
description: >-
  Fix Privacy in-page (modale) + audit di release + allineamento backend PROD
  (mig. 053/054, edge create-booking v20) + release PrenotaZen in produzione.
---

# Report — Fix Privacy in-page + Release in produzione (19-06-26)

## Cappello

- **Cosa è cambiato:** la Privacy Policy sul form Prenota ora si apre come **finestra in pagina (modale)**: il cliente legge la policy senza perdere il form compilato. Inoltre tutto il batch degli ultimi giorni (consenso allergie art. 9, consenso marketing, nuovo modello limiti coperti, display intolleranze, rate-limit 7) è stato **portato in produzione**: backend PROD allineato (migrazioni 053+054, motore prenotazioni `create-booking` v20) e frontend rilasciato su PrenotaZen.
- **Cosa resta:** verifica del «READY» del deploy Vercel sulla dashboard (build identica già verde in locale); chiusura riga `FU-LIMITI-PROD` in `FOLLOW_UP.md`; smoke manuale in produzione (vedi file checklist dedicato).
- **Serve una tua azione:** sì — confermare Vercel READY e fare lo smoke in produzione con la checklist `CHECKLIST_TEST_PRENOTAZEN_RELEASE_15-19-giugno-26.md`.

## Cosa è stato fatto

### 1. Fix Privacy Policy → finestra in-page (modale)

Il bug dell'ultimo report (back button + due schede + form vuoto) nasceva da un approccio fragile (nuova scheda + `window.close()`, che fallisce nel browser embedded di Cursor e su mobile). Soluzione scelta con Matteo: **modale in-page**.

- Nuovo `src/pages/privacy/PrivacyPolicyContent.tsx` — il **contenuto legale** estratto (byte-identico), condiviso tra pagina `/privacy` e modale.
- Nuovo `src/features/booking/components/PrivacyPolicyModal.tsx` — usa `Modal` (`@/components/ui`, z-index LOCK non toccato), montato solo all'apertura.
- `DietaryRestrictionsSection.tsx` — il link «Privacy Policy» apre la modale; rimossa prop `tenantSlug` (e dal chiamante `BookingRequestForm.tsx`).
- `PrivacyPolicyPage.tsx` — usa il contenuto condiviso, back semplificato.
- `privacyPolicyNavigation.ts` — potati i rami two-tab (`close-window`/`manual-close`/`hasOpener`/`openPrivacyPolicyInNewTab`).
- Test allineati + nuovo test apertura/chiusura modale; doc `PRENOTA_LAYOUT_CONTEXT.md` §6.

### 2. Audit di release (sub-agent Sonnet) → 3 blocchi risolti

- **Blocco critico:** la migrazione **054** (consenso allergie art. 9) era stata applicata solo sul DB TEST via MCP e **non esisteva nel repo** → ricostruito `supabase/migrations/054_dietary_consent.sql` leggendo le colonne esatte dal DB TEST.
- **Blocco:** 3 mock di test con il vecchio `daily_guest_limit` (modello superato) → puliti.
- **Blocco:** working tree non committato → committato.
- **Falla P3** (campagne email a clienti senza consenso): verificata **già chiusa** (doppio filtro picker + invio).
- LOCK rispettati, RULE rispettate.

### 3. Commit + merge

- Commit `99e81e9` su `env/test`, `npm run validate` **verde 851/851**, merge fast-forward in `main`.

### 4. Allineamento backend PROD (`rwuxgvld`) — 3 passi autorizzati uno a uno

- ✅ Migrazione **053_marketing_consent** applicata (colonne `marketing_consent` su `booking_requests` + `customers`).
- ✅ Migrazione **054_dietary_consent** applicata (3 colonne consenso allergie su `booking_requests`); colonne verificate via `information_schema`.
- ✅ Edge **create-booking v19 → v20** (`verify_jwt:false`, con `_shared/log.ts` via trick MCP) — modello capienza nuovo + scrittura consensi.
- ✅ Smoke PROD non-scrivente: `OPTIONS` → 200, `GET` → 405 (funzione viva, import risolto).

### 5. Release frontend PrenotaZen

- `npm run release:prenotazen` (sync `main@99e81e9` → repo pubblica) → `npm run build` **verde** → commit + push PrenotaZen (`295d1a9..b78d612`) → **Vercel deploy produzione**.
- Sincronizzato il repo dev: `origin/main` + `origin/env/test` a `99e81e9`.

## File toccati e perché (questa sessione)

| File | Perché |
|------|--------|
| `src/pages/privacy/PrivacyPolicyContent.tsx` | NUOVO — contenuto legale condiviso pagina + modale |
| `src/features/booking/components/PrivacyPolicyModal.tsx` | NUOVO — modale Privacy in-page |
| `src/pages/PrivacyPolicyPage.tsx` | Usa contenuto condiviso, back semplificato |
| `src/features/booking/components/DietaryRestrictionsSection.tsx` | Link → modale; rimossa `tenantSlug` |
| `src/features/booking/components/BookingRequestForm.tsx` | Rimossa prop `tenantSlug` |
| `src/features/booking/utils/privacyPolicyNavigation.ts` | Potati rami two-tab |
| `supabase/migrations/054_dietary_consent.sql` | NUOVO — ricostruita migrazione mancante nel repo |
| 3 test `*adminBlindatura*` | Rimosso mock orfano `daily_guest_limit` |
| `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` | §6 privacy = modale |

## Test eseguiti e risultato

- `npm run validate` — **verde 851/851** (lint + typecheck + test), ripetuto dopo ogni gruppo di modifiche.
- Build PrenotaZen — **verde** (✓ 21.25s, solo warning chunk-size pre-esistente, PWA generata).
- Smoke PROD edge — OPTIONS 200 / GET 405 (no scritture).

## Sicurezza PROD (come è stata gestita)

`get_project_url` verificato prima di ogni scrittura: TEST `docnnernvp` (sola lettura per ricostruire 054), PROD `rwuxgvld` (3 scritture autorizzate esplicitamente da Matteo, una a una, con verifica esito). Ordine rispettato: **DB + edge PRIMA del frontend**, per non avere client nuovo ↔ backend vecchio (consensi persi / errori admin). `supabase db push` non usato.

## Cosa resta per la prossima sessione

- Confermare **Vercel READY** del deploy PrenotaZen (build identica già verde).
- Chiudere `FU-LIMITI-PROD` in `docs/FOLLOW_UP.md` (edge ora su PROD) — commit veloce su `env/test`.
- Smoke manuale produzione con la checklist dedicata.

## Domande di chiusura

❓ Q1 — Prompt ricevuti (verbatim sostanziali).
✅ R1: (1) profilo Verifica orchestrazione release + «parti analizzando bug dell'ultimo report scritto su privacy policy. fixiamo quello e proseguiamo»; (2) «procedi al fix poi usa sub agent sonnet per mappare il resto del lavoro e valutare merge in main e poi in prod… se è tutto ok sei autorizzato a fare release da main a prenotazen»; (3) scelta modale; (4) «arriva a merge con main, poi analizza prenotazen in produzione… se conflitti lancia sub agent… poi release»; (5) «Sì, procedi coi 3 passi PROD»; (6) «fai report del tuo lavoro svolto. poi fai una ricerca e creami un file [checklist + tabella]».

❓ Q2 — Dati = diff/stato reale?
✅ R2: Sì: numeri da `npm run validate` (851 in questa sessione), versioni edge da MCP `list_edge_functions` (PROD v19→v20), colonne verificate via `information_schema`, hash commit/push reali.

❓ Q3 — File correlati allineati?
✅ R3: `PRENOTA_LAYOUT_CONTEXT.md` §6 aggiornato; memoria `project_due_limiti_coperti` aggiornata (PROD deployato). `FOLLOW_UP.md` (FU-LIMITI-PROD) chiuso nella sessione 19-06 successiva.

❓ Q4 — Cosa NON fatto?
✅ R4: Verifica Vercel READY via API (mancava legame progetto/team) — demandata a dashboard; smoke con scrittura su PROD evitato per scelta (nessuna prenotazione di test su PROD).

❓ Q5 — Attrito + miglioria.
✅ R5: Il blocco vero (054 fuori repo, edge PROD vecchio) non era nei prompt iniziali — emerso solo con l'audit. Miglioria: prima di ogni release, check automatico «migrazioni repo == migrazioni PROD» e «edge repo == edge PROD».

❓ Q6 — Contesto & hook.
✅ R6: Adeguato. Il pre-commit fine-sessione ha chiesto il formato Q&A con marker risposta — rispettato.
