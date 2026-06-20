# Report — Feedback errori triplo Pagina Prenota (20-06-26)

## 1. Cappello
- **Cosa è cambiato:** ogni errore di compilazione o invio sulla Pagina Prenota mostra messaggio sotto il campo, lampeggio arancione con scroll, e toast chiaro in alto al centro.
- **Cosa resta:** niente follow-up aperti su questo task (FU-054 chiuso).
- **Serve una tua azione:** no — QA manuale **eseguito live in PROD (20-06-26): tutto OK**, incluse fascia piena e consenso allergie.

## 2. Cosa è stato fatto
1. Inventario errori client + edge → matrice audit (§ Matrice).
2. Helper condiviso `applyBookingPublicFormError` + `mapCreateBookingError` (`bookingPublicFormErrorFeedback.ts`).
3. Post-invio: `CreateBookingRequestError` con `code` dalla edge; feedback spostato da hook al form (`doMutate` onError).
4. Pre-invio: toast generico «N campi» sostituito con messaggio del primo errore.
5. Copy migliorati SLOT_LIMIT / OUT_OF_SLOT / consenso alimentari / rate limit.
6. FU-054: selezione card menù valida → clear `errors.menu` + `clearAttention`.
7. Test Vitest mirati + `npm run validate` verde.
8. Allineamento PRENOTA_SKILL §2 + PRENOTA_LAYOUT_CONTEXT §6 (regola toast triplo).

## 3. Matrice audit errori (prima / dopo)

| Errore | Origine | Inline | Pulse+scroll | Toast | Prima | Dopo |
|--------|---------|--------|--------------|-------|-------|------|
| Nome obbligatorio | validate | sotto Nome | sì | «Nome obbligatorio» | inline+pulse, toast generico N campi | triplo, toast specifico |
| Email non valida | validate | sotto Email | sì | messaggio campo | idem | triplo |
| Telefono obbligatorio/invalido | validate | sotto Telefono | sì | messaggio campo | idem | triplo |
| Data obbligatoria/passato/anno | validate | sotto Data | sì | messaggio campo | idem | triplo |
| Orario obbligatorio/fuori orari client | validate | sotto Ora | sì | messaggio campo | idem | triplo |
| Ospiti obbligatori | validate | sotto Ospiti | sì | messaggio campo | idem | triplo |
| Tipologia obbligatoria | validate | sezione sottotab | sì | messaggio campo | idem | triplo |
| Card menù non scelta | validate | sezione menù | sì | messaggio campo | idem | triplo + FU-054 clear on change |
| Nessun piatto (menù composable) | validate | sezione menù | sì | messaggio campo | idem | triplo |
| Privacy non accettata | validate | checkbox privacy | sì | messaggio campo | idem | triplo |
| Testo troppo lungo (client edge case) | validate | campo interessato | sì | messaggio campo | idem | triplo |
| SLOT_LIMIT | edge code | sotto Ora | sì | «Fascia piena: prova altro orario o giorno» | solo toast hook | triplo |
| OUT_OF_SLOT | edge code | sotto Ora | sì | «Orario fuori servizio…» | solo toast hook | triplo |
| Consenso art.9 alimentari | edge | checkbox consenso dietary | sì + riapre modale | copy esplicativo | solo toast hook | triplo |
| Testo troppo lungo | edge | campo inferito | sì | «Accorcialo e riprova» | solo toast hook | triplo |
| Rate limit client (localStorage) | useRateLimit | — | — | «Attendi N secondi…» | solo toast | toast migliorato |
| Rate limit server 429 | edge | scroll Ora (ancora) | sì | copy azionabile | solo toast hook | pulse+toast |
| Limite annuale tenant | edge | scroll Data | sì | copy chiaro | solo toast hook | pulse+toast |
| Insert/generici 500 | edge | fallback | sì | messaggio server | solo toast hook | triplo |
| Menù preset non disponibile | client preset | — | — | toast dedicato | invariato | invariato (fuori scope triplo campo) |

Legenda **prima:** pre-invio aveva inline+pulse ma toast generico; post-invio solo `toast.error` in `useCreateBookingRequest` (angolo, niente inline/pulse).

## 4. File toccati

| File | Perché |
|------|--------|
| `src/features/booking/utils/bookingPublicFormErrorFeedback.ts` | Helper triplo + mappa errori edge |
| `src/features/booking/utils/bookingPublicFormAttention.ts` | Nuove chiavi DOM (dietary, special_requests, dietaryConsent) |
| `src/features/booking/hooks/useBookingRequests.ts` | `CreateBookingRequestError` + rimozione toast duplicato |
| `src/features/booking/components/BookingRequestForm.tsx` | validate, onError POST, FU-054 |
| `src/features/booking/components/DietaryRestrictionsSection.tsx` | Inline errori dietary/special_requests + id consenso |
| `src/hooks/useRateLimit.ts` | Copy toast client rate limit |
| `src/features/booking/utils/__tests__/bookingPublicFormErrorFeedback.test.ts` | Test mapping |
| `src/features/booking/components/__tests__/BookingRequestForm.flussoUtente.test.tsx` | Test triplo + SLOT_LIMIT |
| `docs/Prenota-Skill/PRENOTA_SKILL.md` | §2 flusso + §5 submit feedback |
| `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` | §6 validazione submit tripla |

## 5. Test eseguiti
- `npx vitest run` su `bookingPublicFormErrorFeedback.test.ts` + `BookingRequestForm.flussoUtente.test.tsx` → 14 test OK
- `npm run validate` → verde

## 6. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `PRENOTA_SKILL.md` §2 | Flusso Anna: triplo feedback al submit invalido | Decisione prodotto 20-06-26 |
| `PRENOTA_SKILL.md` §5 | Submit: feedback POST nel form, non solo hook | Allineamento implementazione |
| `PRENOTA_LAYOUT_CONTEXT.md` §6 | Regola toast sì + copy utile + helper | Sostituisce «niente toast» |

## 7.1 Analisi flusso (standard)
- 1 prompt esecuzione completo · 0 correzioni · modalità standard · validate verde al primo giro.

## 7.2 La mia lettura della sessione
Il gap era chiaro (POST solo toast): centralizzare in `mapCreateBookingError` evita duplicazione e rende testabile la matrice. Il vincolo «non toccare hook» in PRENOTA_SKILL §5 era superato esplicitamente dal prompt — aggiornato per distinguere payload mutation vs feedback UX.

## 8. Derivazione errori
- **bug preesistente:** post-invio senza inline/pulse; toast generico pre-invio; FU-054 menu error sticky.
- **prompt chiaro:** decisione tripla feedback già definita — implementazione diretta.

## 9. Checklist QA — Matteo (5 righe) — ✅ ESEGUITA LIVE IN PROD 20-06-26

1. **Schermata:** Pagina Prenota `/prenota/:slug` — form pubblico cliente.
2. [x] **Prova A:** clicca Invia con form vuoto → devi vedere «Nome obbligatorio» sotto il nome, lampeggio arancione sul campo nome, toast in alto al centro con lo stesso testo (non «N campi»).
3. [x] **Prova B:** compila tutto tranne privacy → stesso triplo feedback sul checkbox Privacy Policy in fondo al form.
4. [x] **Prova C:** fascia piena (SLOT_LIMIT) → messaggio sotto Ora, lampeggio su Data/Ora, toast «prova altro orario o giorno».
5. [x] **Prova D:** intolleranze compilate senza consenso art.9 → modale consenso; se server rifiuta, triplo feedback sul consenso dietary + toast esplicativo.

**Esito:** tutte le prove verificate da Matteo direttamente in produzione — comportamento atteso confermato.

## 10. Domande di chiusura

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato.
✅ R1: (1) Prompt esecuzione «triplo feedback errori Pagina Prenota»: ogni errore client/edge deve dare
   inline sotto il campo + lampeggio/scroll + toast in alto al centro; centralizzare il mapping;
   copre SLOT_LIMIT/OUT_OF_SLOT/consenso art.9/rate limit; chiudere FU-054. (2) «lavoro ok».

❓ Q2 — Dati = diff reale? I file/valori citati corrispondono al diff vero?
✅ R2: Ri-verificato in controverifica con git diff: bookingPublicFormErrorFeedback.ts (nuovo, helper
   applyBookingPublicFormError + mapCreateBookingError), useBookingRequests.ts (CreateBookingRequestError
   con code + rimozione toast duplicato), BookingRequestForm.tsx (onError POST + FU-054 clear menu),
   DietaryRestrictionsSection.tsx (inline dietary/special_requests), bookingPublicFormAttention.ts
   (nuove chiavi DOM), useRateLimit.ts (copy). Test: bookingPublicFormErrorFeedback.test.ts +
   BookingRequestForm.flussoUtente.test.tsx. Tutti presenti nel diff. validate 913/913.

❓ Q3 — File correlati allineati? (skill, context, test, tipi)
✅ R3: Allineati: PRENOTA_SKILL.md §2/§5; PRENOTA_LAYOUT_CONTEXT.md §6 (regola toast triplo, sostituisce
   «niente toast»); test mapping + flusso utente. Nessun tipo DB nuovo (nessuna migrazione).

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non eseguiti: commit/push (fatto in sessione release successiva); E2E Playwright (non richiesti);
   migrazione DB (nessuna necessaria — feedback è solo client). FU-054 chiuso.

❓ Q5 — Attrito + miglioria nel workflow skill system?
✅ R5: Attrito: PRENOTA_SKILL §5 diceva «feedback solo in hook» — superato dal prompt; aggiornato per
   distinguere payload mutation (hook) vs feedback UX (form). Miglioria: nota esplicita in skill che il
   feedback POST vive nel form, non nell'hook.

❓ Q6 — Contesto & hook: troppo / giusto / troppo poco?
✅ R6: Contesto giusto — skill Prenota + costanti limiti testo sufficienti. Nessun hook MCP necessario
   (task frontend puro). Controverifica successiva ha confermato compilazione e test verdi.
```
