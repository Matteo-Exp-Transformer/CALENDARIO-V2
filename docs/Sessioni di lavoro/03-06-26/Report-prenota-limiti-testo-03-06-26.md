# Report — Limiti testo Pagina Prenota (03-06-26)

## Cappello

- **Cosa è cambiato:** in Pagina Prenota i testi del ristoratore hanno limiti allineati allo spazio delle card (con contatore in admin); chi prenota ha cap generosi **invisibili** (anti-spam) su nome, email, telefono, intolleranze e richieste.
- **Cosa resta:** limiti su nome/descrizione **ingredienti e categorie** in Tab Menu (sezione E mappa); allineamento `restaurant_name` 40 vs 200 Zod; QA manuale 375/900/1256 non eseguito in sessione agente.
- **Serve una tua azione:** no (smoke opzionale su `/prenota/:slug` con testo lungo in intolleranze).

---

## Cosa è stato fatto

1. Centralizzati i limiti in `bookingPrenotaTextLimits.ts`: ristoratore, cliente, carosello, font header.
2. **Personalizza form + promo:** contatori `N/max` su titolo/descrizione header, tipologie, sottotab, promo; font descrizione header capped a **22px** (nome/titolo fino 38px).
3. **Form cliente:** `maxLength` silenzioso (65 nome/email, 30 tel, 700 note); nessun contatore in pagina; validazione submit + edge `create-booking` con messaggio «Testo troppo lungo».
4. Normalizer `bookingPublicFormConfig` aggiornato per clamp su parse/salvataggio copy ristoratore.
5. Skill area aggiornate + mappa 1:1 `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md`.
6. Test unitari `bookingPrenotaTextLimits.test.ts` + estensioni `bookingPublicFormConfig.test.ts`.

---

## File toccati

| File | Perché |
|------|--------|
| `src/features/booking/constants/bookingPrenotaTextLimits.ts` | **Nuovo** — costanti uniche |
| `src/features/booking/constants/bookingPublicFormConfig.ts` | Import limiti; clamp header fontSize |
| `BookingFormConfigPanel.tsx` | Usa `BOOKING_PRENOTA_RESTAURANT_TEXT_LIMITS` |
| `BookingFormPromoSection.tsx` | Limiti promo 60/350 |
| `BookingFormFields.tsx` | Cap silenzioso cliente |
| `DietaryRestrictionsSection.tsx` | Cap 700 silenzioso |
| `BookingRequestForm.tsx` | `validate()` lunghezza testi cliente |
| `supabase/functions/create-booking/index.ts` | Validazione server allineata |
| `docs/per-ui-design-skill/BOOKING_*` | Skill + mappa |
| `__tests__/bookingPrenotaTextLimits.test.ts` | Test |

---

## Test eseguiti

| Comando | Esito |
|---------|-------|
| `npm run validate` | OK — lint, typecheck, **284** test |

QA manuale viewport (375/900/1256): **non eseguito** in questa chiusura.

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | §8.1 limiti + §9 punto validazione cliente | Comportamento Prenota |
| `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` | § Limiti testo 03-06-26 | Admin Personalizza form |
| `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` | **Nuovo** — mappa 1:1 | Riferimento citato dalle skill |

---

## Dati comunicazione

- Matteo ha chiarito **3 volte** la regola UX: admin vede contatore, cliente no; limiti cliente **abbondanti** solo di sistema.
- Prepara-prompt ha mappato DOM + storage prima dell'esecuzione; efficace per scope Pagina Prenota vs Menu QR.
- Formato richiesto: revisione + «lavoro ok» + report finale in un unico messaggio.

---

## Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: ~4 (prepara → campi cliente → no UI limite → lavoro ok)
- Correzioni dopo 1ª risposta: 2 (inclusione campi cliente; limite invisibile)
- Follow-up generati: 2 (ingredienti/categorie; QA viewport)
- Modalità alzata: no (deep già da prepara-prompt)

---

## La mia lettura della sessione

**Impressioni:** il task era ben delimitato dal ciclo prepara-prompt; la distinzione admin-contatore / cliente-silenzioso è chiara nel codice. Centralizzare in `bookingPrenotaTextLimits.ts` riduce magic number sparsi.

**Difficoltà:** la mappa markdown era citata nelle skill ma non creata dall'esecutore — colmata in chiusura per allineamento §7.2. Edge Deno duplica le costanti cliente (sync manuale).

**Migliorie suggerite (dato, non implementate):** script o test che verifica parità costanti edge ↔ TS; completare sezione E (Tab Menu) in un follow-up dedicato.

---

## Derivazione errori

| Voce | Causa | Evitabile come |
|------|-------|----------------|
| Mappa MD assente a «lavoro ok» | deliverable Fase 1 non materializzato | checklist Output attesi in chiusura |
| Ingredienti senza cap | scope Fase 2 parziale | follow-up esplicito in mappa §E |

Nessun bug funzionale rilevato in revisione statica.

---

## Cosa resta / FOLLOW_UP

| ID | Nota |
|----|------|
| — | Cap **nome/descrizione ingrediente e categoria** in Tab Menu (mappa §E) |
| — | QA manuale Prenota 375/900/1256 con testi al limite |
| — | Allineare `restaurant_name` input 40 vs Zod 200 se serve un solo numero |

---

## Revisione (chiusura)

| Check | Esito |
|-------|-------|
| Regola admin contatore / cliente silenzioso | OK |
| `npm run validate` | OK |
| Skill allineate al diff | OK (post mappa) |
| Edge sync limiti cliente | OK (duplicate + commento) |
| LOCK griglia BookingRequestPage | Non toccato |
| Menu QR | Fuori scope |

**Verdetto revisione:** approvato per commit su `env/test`.
