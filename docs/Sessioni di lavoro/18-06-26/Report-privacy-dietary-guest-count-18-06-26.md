---
name: report-privacy-dietary-guest-count-18-06-26
description: >-
  Pagina Prenota — Privacy nuova scheda + guest_count 0 intolleranze admin;
  follow-up pulsante «Torna alla prenotazione» (parzialmente non risolto in dev).
---

# Report — Privacy nuova scheda + guest_count intolleranze + ritorno Privacy (18-06-26)

## Cappello

- **Cosa è cambiato:** sulla Pagina Prenota il link Privacy si apre in altra scheda (form originale resta compilato in teoria); in admin le intolleranze da testo libero cliente non mostrano più «- 1 ospite» (`guest_count: 0`). Sul pulsante «Torna alla prenotazione» in Privacy sono stati fatti due fix iterativi (`window.close` + `window.open`).
- **Cosa resta:** in dev Matteo segnala che «Torna alla prenotazione» **non chiude la scheda privacy** e nella stessa scheda compare un **form Prenota vuoto** — comportamento non accettato; serve un fix dedicato (vedi § «Bug aperto»).
- **Serve una tua azione:** sì — riprovare il flusso Privacy dopo il prossimo fix; confermare se il problema è su Chrome/Edge e se la tab Prenota originale resta aperta in background.

## Cosa è stato fatto

### TASK 1 — Privacy Policy senza perdere il form (prompt iniziale)

1. **`DietaryRestrictionsSection.tsx`:** link Privacy in nuova scheda; prima `Link` + `target="_blank"` + `rel="noopener noreferrer"`.
2. **`PRENOTA_LAYOUT_CONTEXT.md`:** allineato §6 link privacy.
3. Nessun sessionStorage/bozza (opzione A Matteo).

### TASK 2 — Intolleranze senza «- N ospiti» da Pagina Prenota

4. Confermato: pubblico solo `DietaryRestrictionsSection` (testo libero); `DietaryRestrictionsStructuredSection` solo admin.
5. **`dietaryRestrictionsText.ts`:** `dietaryTextToRestrictions` → `guest_count: 0`; helper `shouldShowDietaryGuestCount` + `formatDietaryGuestCountLabel`.
6. **`DietaryTab`** view/recap e **`BookingRequestCard`** espanso: suffisso ospiti solo se `guest_count >= 1`.
7. Skill allineate: `ADMIN_CLASSIC_SKILL.md` §4, `BOOKING_REQUEST_CARD_CONTEXT.md` §5.

### Follow-up 1 — «Torna alla prenotazione» non faceva nulla

8. **`privacyPolicyNavigation.ts`:** azione `close-window`; **`PrivacyPolicyPage`:** `opener.focus()` + `window.close()`.
9. **Esito dev Matteo:** ancora nessun effetto utile.

### Follow-up 2 — fix alla radice (window.open)

10. **`openPrivacyPolicyInNewTab()`** in `privacyPolicyNavigation.ts`: sostituito `<a target="_blank" rel="noopener">` con `window.open(href, '_blank')` in `DietaryRestrictionsSection` (link `<a href>` + `preventDefault` on click).
11. **`resolvePrivacyBackAction`:** `close-window` solo se `window.opener` presente; altrimenti `replace` verso `/prenota/:slug`.
12. **`PrivacyPolicyPage`:** se `close-window` ma opener assente o `close()` ignorato → fallback `navigate(returnPath, { replace: true })`.

## Bug aperto — cosa vede Matteo in dev

Flusso: Pagina Prenota compilata → link Privacy (nuova scheda) → clic «Torna alla prenotazione».

**Comportamento segnalato:**
- il contenuto della Privacy **sparisce** (la pagina non è più la policy);
- la **scheda privacy non si chiude**;
- nella stessa scheda compare la **Pagina Prenota vuota** (nuovo caricamento SPA, stato React perso).

**Comportamento voluto:**
- la scheda privacy **si chiude**;
- l’utente torna sulla **tab Prenota già aperta** con il form ancora compilato.

## Perché secondo me non funziona come dovrebbe

Analisi sul codice attuale e sui vincoli dei browser (non verificata con DevTools sul browser di Matteo, ma coerente con il sintomo «form vuoto nella stessa tab»).

### 1. Il fallback `navigate(returnPath)` è quello che produce il form vuoto

In `PrivacyPolicyPage.handleBack`, quando l’azione è `close-window` ma `window.opener` è assente **oppure** `window.close()` viene ignorato dal browser, scatta il fallback:

```typescript
navigate(returnPath, { replace: true })  // es. /prenota/demo-slug
```

Questo **non chiude la tab**: sostituisce `/privacy?from=…` con `/prenota/:slug` **nella scheda privacy**. È un mount fresco dell’app → form vuoto. Coincide con «policy si chiude, tab no, form vuoto».

### 2. `window.opener` è probabilmente ancora `null` nonostante `window.open`

Prima iterazione: `rel="noopener noreferrer"` sul link azzerava `opener` by design.

Seconda iterazione: `window.open(href, '_blank')` **senza** disabilitare esplicitamente noopener. Su **Chrome/Edge recenti** molte build applicano **`noopener` di default** anche a `window.open()` (stesso effetto: `window.opener === null`). In quel caso `resolvePrivacyBackAction` **non** sceglie `close-window` e va direttamente su `{ kind: 'replace', path: returnPath }` → stesso sintomo senza nemmeno tentare `close()`.

### 3. Anche con `opener` presente, `window.close()` spesso fallisce in silenzio

I browser consentono `window.close()` in modo affidabile solo per finestre aperte da script **e** ancora «figlie» della sessione. Su tab normali, popup blocker, policy del browser o contesto Cursor/Electron embedded, `window.close()` può essere un no-op: il codice fa `return` dopo `close()` senza verificare se la tab è ancora aperta, quindi l’utente non vede nulla finché non scatta un altro percorso — o resta bloccato se il fallback non parte.

### 4. Vincolo di prodotto non risolto alla radice

Obiettivo: **due tab**, stato form solo in memoria React sulla tab A, lettura policy su tab B.

Senza **sessionStorage / bozza** (esplicitamente fuori scope) o **navigazione same-tab**, l’unica via «pulita» è chiudere tab B e riportare focus su tab A. Se il browser non permette `opener` + `close`, **non esiste recovery** che preservi il form: qualsiasi navigazione verso `/prenota/:slug` nella tab B ricrea un form vuoto.

**Ipotesi sintesi:** il sintomo di Matteo è quasi certamente il ramo **`replace` / fallback navigate** nella scheda privacy, causato da `opener` nullo (noopener implicito) o da `close()` bloccato — non da un bug del form in sé sulla tab originale (che potrebbe essere ancora lì, ma l’utente resta sulla tab sbagliata con form vuoto).

**Direzione fix probabile (prossima sessione, non eseguita qui):**
- provare `window.open(href, '_blank', 'noopener=no')` (o equivalente supportato) per preservare `opener`;
- se `close()` fallisce, **non** navigare a Prenota nella stessa tab — mostrare messaggio «Chiudi questa scheda e torna alla prenotazione» o usare `opener.location` solo same-origin con cautela;
- oppure ripensare UX: privacy in **stesso tab** + bozza minima (se Matteo accetta) o modale inline.

## File toccati e perché

| File | Perché |
|------|--------|
| `src/features/booking/components/DietaryRestrictionsSection.tsx` | Link Privacy → `openPrivacyPolicyInNewTab` |
| `src/features/booking/utils/privacyPolicyNavigation.ts` | `openPrivacyPolicyInNewTab`, `resolvePrivacyBackAction` |
| `src/features/booking/utils/__tests__/privacyPolicyNavigation.test.ts` | Test azioni back + opener |
| `src/pages/PrivacyPolicyPage.tsx` | `handleBack` close / fallback navigate |
| `src/features/booking/utils/dietaryRestrictionsText.ts` | `guest_count: 0` + helper display |
| `src/features/booking/utils/__tests__/dietaryRestrictionsText.test.ts` | Test helper e guest_count |
| `src/features/booking/components/DietaryTab.tsx` | Suffisso condizionato |
| `src/features/booking/components/BookingRequestCard.tsx` | Suffisso condizionato |
| `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` | §6 privacy + window.open |
| `docs/ADMIN_CLASSIC_SKILL.md` | §4 guest_count display |
| `docs/per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md` | §5 intolleranze |

## Test eseguiti e risultato

- `npm run validate` — verde dopo ogni iterazione (ultimo run **850/850** test unitari; suite completa validate OK).
- **Smoke browser manuale Privacy back:** fallito in dev (segnalazione Matteo); non ripetuto dall’agente con DevTools su `window.opener` / esito `window.close()`.

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `PRENOTA_LAYOUT_CONTEXT.md` | §6: `openPrivacyPolicyInNewTab`, ritorno chiude tab | Iterazioni privacy |
| `ADMIN_CLASSIC_SKILL.md` | §4 suffisso ospiti | guest_count 0 vs ≥1 |
| `BOOKING_REQUEST_CARD_CONTEXT.md` | §5 intolleranze | Regola suffisso |

## Dati comunicazione

- Prompt iniziale: 9 punti TASK 1+2, no sessionStorage, validate verde.
- Follow-up 1: «torna alla prenotazione non succede nulla».
- Follow-up 2: «analizza e soluzione semplice alla radice».
- Chiusura report: «policy si chiude ma tab no, form vuoto» + motivo ipotizzato.

## Analisi flusso prompt, efficienza e statistiche

- 4 prompt sostanziali (esecuzione + 2 fix privacy + report) · 2 correzioni post-QA Matteo su privacy · modalità standard · validate sempre verde, QA manuale privacy KO.

## La tua lettura della sessione

- **Impressioni:** parte dietary chiusa e testata; privacy è un problema **browser + architettura a due tab senza persistenza**, non un semplice attributo HTML.
- **Difficoltà:** due fix sul back button senza prova reale su `opener`/`close` nel browser di Matteo — il fallback `navigate` maschera il fallimento e peggiora l’UX.
- **Migliorie suggerite:** prima di altri fix, una sessione con `console.log({ opener: !!window.opener, closed: window.closed })` su Privacy al click back; documentare in PRENOTA_LAYOUT il vincolo noopener implicito Chrome.

## Derivazione errori

| Problema | Causa (classificazione) |
|----------|-------------------------|
| Form vuoto su «Torna alla prenotazione» | **Vincolo strutturale** — due tab senza bozza + fallback `navigate` nella tab sbagliata |
| `window.close()` inefficace | **Vincolo browser** — noopener default / policy chiusura tab |
| Prima iterazione noopener su Link | **Errore agente** — scelta sicurezza HTML incompatibile con requisito focus+close |

## Cosa resta per la prossima sessione

- **Fix obbligatorio:** pulsante «Torna alla prenotazione» — chiudere tab privacy e focus tab Prenota con form intatto (o UX alternativa approvata da Matteo).
- Verificare su browser reale: `window.opener` dopo `openPrivacyPolicyInNewTab`; provare `noopener=no` se supportato; evitare `navigate(returnPath)` nella tab privacy come fallback silenzioso.
- Opzionale: FU in `FOLLOW_UP.md` se Matteo vuole tracciamento formale.

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) Prompt esecutore TASK 1 Privacy nuova scheda + TASK 2 guest_count 0/admin suffisso, no sessionStorage, validate, report §7. (2) «piccolo fix: al click Torna alla prenotazione… si chiude [scheda]». (3) «se clicco torna alla prenotazione non succede nulla… soluzione semplice alla radice». (4) «fai report del lavoro svolto includendo… policy si chiude ma tab no, form vuoto… motivo per cui non funziona».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riaperti `PrivacyPolicyPage.tsx` (righe 36-52 fallback navigate), `privacyPolicyNavigation.ts` (`openPrivacyPolicyInNewTab`, `resolvePrivacyBackAction` righe 58-65), `DietaryRestrictionsSection.tsx` (anchor + `openPrivacyPolicyInNewTab`). Confermato ramo `navigate(returnPath, { replace: true })` su close-window senza opener. guest_count 0 e helper in `dietaryRestrictionsText.ts` invariati rispetto al report iniziale.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica e hai verificato che siano aggiornati?
✅ R3: `PRENOTA_LAYOUT_CONTEXT.md` aggiornato per window.open; skill admin dietary aggiornate. **Non** aggiornato skill/legal per bug aperto back button (da fare quando fix è definitivo). `CHIUSURA_SESSIONE` rispettata in struttura report.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non risolto bug «Torna alla prenotazione» in dev (Matteo KO). Nessun test E2E/browser automation su opener/close. Nessun commit/push. Non proposto sessionStorage (fuori scope precedente). Non aggiornato `docs/FOLLOW_UP.md` con FU dedicato (in attesa ok Matteo).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow, e come lo miglioreresti?
✅ R5: Attrito: fix privacy iterato due volte senza evidenza runtime browser — il fallback navigate ha creato un sintomo peggiore del «non succede nulla». Miglioria: per task «due tab + stato React», checklist obbligatoria DevTools (`opener`, `close`, tab count) prima di dichiarare fix; vietare fallback che naviga a Prenota nella tab privacy senza conferma esplicita.

❓ Q6 — Contesto & hook: il contesto caricato era troppo / giusto / troppo poco?
✅ R6: Giusto per dietary; per privacy mancava nel prompt il vincolo «Chrome noopener default su window.open» — andrebbe in PRENOTA_LAYOUT come divieto/nota tecnica dopo il fix definitivo.
