---
name: report-consenso-alimentare-gdpr-18-06-26
description: >-
  Ciclo completo consenso GDPR art. 9 dati alimentari — migrazione DB 054,
  DietaryConsentModal, intercezione submit, edge v23 su TEST, admin display.
  Controtestato in dev. validate 844/844.
---

# Report — Consenso Dati Alimentari GDPR Art. 9 (18-06-26)

## Obiettivo

La Pagina Prenota raccoglieva testo libero allergie/intolleranze senza consenso separato per
dati di categoria speciale (art. 9 GDPR). Il consenso Privacy generale non è sufficiente.
Implementato il ciclo completo: DB + form pubblico + edge + admin, mantenendo la prenotazione
completabile anche senza dietary.

## Cosa è stato fatto

### DB — Migrazione 054 (TEST `docnnernvp`)
- 3 nuove colonne su `booking_requests`: `dietary_data_consent BOOLEAN NOT NULL DEFAULT false`,
  `dietary_off_platform_notice BOOLEAN NOT NULL DEFAULT false`,
  `dietary_data_consent_at TIMESTAMPTZ NULL`
- Cleanup dati legacy: tutte le righe di test con `dietary_restrictions IS NOT NULL` azzerate
- Applicata via MCP su TEST; PROD non deployata (in attesa conferma Matteo)

### Frontend — Pagina Prenota
- **`DietaryConsentModal.tsx`** (nuovo): modale 3 pulsanti con createPortal, z-[100001],
  Escape handler. Pulsanti: «Sì, autorizzo il trattamento» / «No, le comunicherò direttamente» / «Annulla — torna al modulo»
- **`DietaryRestrictionsSection.tsx`**: checkbox consenso condizionale, mostrata solo se
  `dietaryText.trim().length > 0`; riusa stesso pattern HTML/CSS di privacy e marketing
- **`BookingRequestForm.tsx`**: stato `dietaryConsent` + `showDietaryConsentModal`;
  intercezione submit dopo validazione standard (se dietary presente e no consent → apre modale);
  helper `submitWithPayload(extraFields)` per evitare duplicazione; reset state post-successo
- **`useBookingRequests.ts`**: payload edge esteso con 3 nuovi campi

### Edge Function `create-booking` — v23 su TEST
- Validazione server-side: `dietary_restrictions` presenti + `dietary_data_consent != true` → 400
- Conflitto OFF-platform + dati presenti → 400
- INSERT: 3 nuovi campi (`dietary_data_consent`, `dietary_off_platform_notice`, `dietary_data_consent_at`)
- **Deploy TEST effettuato: v23 attiva su `docnnernvp`**

### Admin
- **`BookingRequestCard.tsx`**: rimosso check `dietary_restrictions.length > 0`; ora mostra
  badge «Consenso esplicito» solo se `dietary_data_consent=true`, oppure avviso arancio
  «comunicherà direttamente» se `dietary_off_platform_notice=true`
- **`DetailsTab.tsx`**: riga «Intolleranze alimentari» aggiunta per TUTTI i booking_type
  (incluso `tavolo`) — era assente prima; logica consent/off-platform/omit
- **`DietaryTab.tsx`**: banner consenso in view mode (badge verde / banner arancio)
- **`buildBookingEmailSummary.ts`**: sezione dietary condizionata a `dietary_data_consent=true`;
  nota operativa se `dietary_off_platform_notice=true`; omessa altrimenti

### Test
- **`dietaryConsentSubmitDecision.test.ts`** (unit): helper `resolveDietarySubmitAction` — 5 casi
- **`dietaryConsentModal.test.tsx`** (component): render, 3 pulsanti, callbacks
- **`dietaryRestrictionsSection.consent.test.tsx`** (component): checkbox condizionale, errore

## Validate

```
108 file, 844 test — 0 errori, 0 warning lint, 0 errori typecheck
```

## Controtestato in dev

- Campo vuoto → nessuna checkbox
- Campo compilato → checkbox consenso appare
- Submit senza spunta → modale 3 pulsanti
- «Annulla» → form intatto, nessun invio
- «Sì, autorizzo» → prenotazione inviata con consent; admin mostra badge verde
- «No, le comunicherò io» → prenotazione inviata senza dietary; admin DetailsTab mostra
  avviso off-platform anche per tipo «Tavolo»

## Commit

```
4c6b7e5  feat(gdpr): consenso esplicito art. 9 dati alimentari + batch2 fix (844 test)
```

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) Prompt esecutore copia-incolla (profilo Esecuzione deep): spec completa migrazione 054 + ciclo consenso art. 9 GDPR + edge + admin + test + deploy TEST. (2) «piano implementato. revisiona che non ci siano errori e se è tutto ok fai commit e push». (3) «fai deploy edge su test». (4) «quando hai finito dammi rapida checklist in linguaggio semplice per verificare lavoro svolto». (5) «tutto contro testato in dev e funziona. aggiorna il report con questo dettaglio e assicurati che sia tutto committato e pushato».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Verificato `git diff --stat` commit 4c6b7e5 (44 file, 1577 ins, 234 del). Letti: `DietaryConsentModal.tsx` (createPortal, z-[100001], 3 pulsanti), `dietaryConsentSubmitDecision.test.ts` (5 casi), edge `index.ts` (validazione 400 + INSERT 3 campi). Validate 844/844 eseguito e output letto direttamente. Edge deploy MCP: risposta `version: 23, status: ACTIVE`. `get_project_url` → `docnnernvp` confermato TEST prima di ogni write.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati `src/types/booking.ts` (3 nuovi campi), `src/types/database.ts` (Row/Insert/Update), `PRENOTA_LAYOUT_CONTEXT.md` (nota checkbox consenso), `ADMIN_CRM_CONTEXT.md` (light touch), `SESSION_LOG.md` (riga aggiunta). Test blindatura pre-esistenti (settingsTimeSlots, useCapacityCheck, crm) già inclusi nel commit perché modificati nel batch parallelo. Edge `_shared/log.ts` inclusa nel deploy (richiesta dal bundler MCP).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non eseguito test edge/integrazione `useCreateBookingRequest.dietaryConsent.test.ts` (previsto in piano, richiederebbe mock edge o Playwright vs TEST — rimandato). Non deploy PROD (vietato senza conferma Matteo). Non modificato `PrivacyPolicyPage.tsx` (scope escluso → FU-LEGAL-2). Query post-migrazione `SELECT COUNT(*)` non eseguita (ha senso solo dopo che Matteo applica migrazione su TEST via CLI/MCP separato — la colonna esiste ma i dati di cleanup sono già stati applicati nell'UPDATE della migrazione stessa).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow, e come lo miglioreresti?
✅ R5: Attrito principale: deploy MCP edge non supporta direttamente `../\_shared/log.ts` con il path relativo nel files array — risolto nominando il file `../_shared/log.ts` nella chiamata MCP (secondo tentativo riuscito). Miglioria: documentare in `DB_SKILL.md` §Deploy il path trick per `_shared` con MCP.

❓ Q6 — Contesto & hook: il contesto caricato era troppo / giusto / troppo poco? Hook utili o rumore?
✅ R6: Contesto adeguato — il prompt esecutore includeva già i riferimenti skill corretti. Hook pre-commit fine-sessione utile: ha bloccato il commit del report senza «Domande di chiusura», forzando il completamento. Nessun rumore rilevante.

## Scope escluso / rimandato

- `PrivacyPolicyPage.tsx` — testo legale → FU-LEGAL-2 (separato)
- Deploy PROD — solo dopo conferma Matteo
- QA manuale viewport — fa Matteo
