# Report finale — Validazione UX Pagina Prenota (29-05-26)

**Modalità sessione:** standard  
**Scope:** solo Pagina Prenota pubblica (`/prenota/:slug`)  
**Esito:** ✅ **Chiuso — QA Matteo + revisione Verifica** (validazione + leggibilità testi); **post-fix palette striscia** confermato da Matteo («ottimo funziona»)  
**Revisione:** [Report-revisione-validazione-ux-prenota-29-05-26.md](Report-revisione-validazione-ux-prenota-29-05-26.md) — **Approva con riserve**  
**Replica altri form:** [FORM_VALIDATION_ATTENTION_PATTERN.md](../../per-ui-design-skill/FORM_VALIDATION_ATTENTION_PATTERN.md)

---

## Ciclo di lavoro (prepara-prompt → esecutore → fix → revisore)

| Fase | Esito |
|------|--------|
| Prompt iniziale (validazione + ancoraggio card) | Esecutore implementa utility + rAF overlay |
| QA Matteo giro 1 | KO: niente lampeggio, card non chiudono; scroll overlay migliorato |
| Fix esecutore (giro 2–4) | Evento collapse, `isTrusted`, pulse arancione su wrapper |
| **Root cause giro 3** | `noValidate` mancante — HTML5 bloccava tutto il flusso React |
| Polish chat esecutore | Testi errore/privacy/menù bianchi; pulse visibile su Ospiti/Data |
| Revisione Verifica | Approva A1–B; validate 217 test; QA browser 834/900/1280 |
| Commit | Codice `src/` + doc pattern (questa sessione) |
| Fix palette striscia (sessione light, stesso giorno) | Prop `publicFormLightTextOnDarkBackground`; bianco solo full-page; QA Matteo OK |

**Velocità:** il fix definitivo è stato rapido una volta individuato `noValidate`; i giri precedenti erano sintomi dello stesso blocco.

---

## Effetto per il cliente (Pagina Prenota)

Quando prova a inviare la prenotazione con dati mancanti o errati:

1. **Card ingredienti aperte** si chiudono (non coprono più il campo da correggere).
2. La pagina **scorre** verso il primo problema (nome, menù, privacy, …).
3. Il campo lampeggia in **arancione** (colore tema) finché non ci clicca — poi smette.
4. Con una categoria ingredienti aperta, scrollando la pagina il pannello **resta agganciato** alla card.
5. **Messaggi di errore**, testo privacy e riepilogo menù («Hai selezionato : …») usano colori **adatti allo sfondo**: **bianco** solo con foto **pagina intera**; con **striscia laterale** o sfondo crema/gradiente restano **marrone e rosso** (leggibili su `#faf7f1`).

**Storage DB:** nessun cambiamento — solo stato UI in memoria React nel browser.

---

## Sintesi per il ristoratore

| Dove nell’app | Cosa vede il cliente |
|---------------|----------------------|
| **Pagina Prenota** — submit con campi vuoti | Toast di errore, scroll automatico al primo campo, lampeggio arancione sul campo da correggere. |
| **Sezione menù** — menù fisso preselezionato | Riepilogo «Hai selezionato : …» — **bianco** su foto full-page; **marrone** su striscia/crema. |
| **Campi cliente** — errori sotto nome, ora, ospiti, … | **Rosso** su sfondo chiaro; **bianco** su foto full-page (data/ora possono avere box rosso chiaro su crema). |
| **Blocco privacy** — in fondo al form | Link arancione + testo marrone su crema; bianco + link bianchi solo su full-page. |

---

## Cosa è stato fatto (ordine cronologico)

| # | Intervento |
|---|------------|
| 1 | **Ancoraggio overlay (B)** — loop `requestAnimationFrame` + sync DOM diretto sul portal; listener scroll orizzontale `ComposeScrollRow`. |
| 2 | **Submit fallito (A)** — utility `bookingPublicFormAttention.ts`; sequenza collapse → scroll → lampeggio in `BookingRequestForm`. |
| 3 | **Fix QA giro 2** — evento `booking-menu-compose-collapse`; dismiss attenzione solo `event.isTrusted`; pulse CSS rinforzato. |
| 4 | **Fix QA giro 3 (root cause)** — `noValidate` sul form: la validazione HTML5 bloccava `validate()` React. |
| 5 | **Polish lampeggio** — colore **arancione** (`--color-warm-orange`); pulse spostato sul **wrapper esterno** del campo (Ospiti, Data, Ora, input inset) per visibilità anche con bordo rosso errore. |
| 6 | **Polish leggibilità giro 4** — testi privacy, riepilogo menù fisso e messaggi errore form → **bianco** su sfondo scuro; rimossi box rossi chiari su errori data/ora/slot. |
| 7 | **Conferma QA Matteo** — chiusura card, scroll, lampeggio, ancoraggio overlay; iterazioni colore testi fino a bianco. |
| 8 | **Fix palette striscia** — bianco era applicato anche su crema `#faf7f1` (striscia laterale); prop `publicFormLightTextOnDarkBackground` da `BookingRequestPage`; helper in `bookingPublicFieldStyles.ts`; layout inset (`publicFormFields`) separato dalla palette. |

---

## Causa root principale (perché inizialmente «non funzionava nulla»)

I campi hanno attributo HTML `required`, ma il form **non** aveva `noValidate`.

Il browser intercettava il submit **prima** di `onSubmit` → `validate()` e `focusFirstValidationIssue` **non partivano mai**. L’utente vedeva solo il tooltip nativo del browser, non toast, scroll, lampeggio né chiusura card.

**Fix definitivo:** `noValidate` su `#booking-request-form`.

---

## Scelta tecnica overlay (B)

**Problema:** portal `position: fixed` con `setState` a ogni scroll → lag visivo.

**Soluzione:** loop rAF che aggiorna `top`/`left`/`width` via ref DOM (senza re-render per frame) + listener sullo scroll orizzontale categorie desktop.

---

## Lampeggio attenzione

- Classe: `.booking-public-field-attention` in `index.css`
- Colore: **`var(--color-warm-orange)`** (arancione tema, non rosso errore)
- Applicato sul **contenitore esterno** (`data-booking-public-field-anchor`), non sul riquadro interno — così Ospiti e altri campi lampeggiano anche quando c’è bordo rosso `hasError`
- Il bordo rosso del campo e i messaggi errore (rossi o bianchi a seconda dello sfondo pagina) segnalano l’errore; il pulse arancione indica «clicca qui per correggere»
- `prefers-reduced-motion`: ring arancione statico, senza animazione

---

## Leggibilità testi (giro 4 + fix striscia)

**Giro 4 (sessione validazione):** su sfondo **full-page** foto, testi marrone/rosso erano poco leggibili → introdotto bianco.

**Fix striscia (stesso giorno):** il bianco era legato a `publicFormLayout` / `publicFormFields` (sempre true su `/prenota`) e finiva anche sulla colonna **crema** con striscia laterale (`public_booking_strip_photo`) — illeggibile. Ora la palette dipende da un solo booleano calcolato in pagina:

`publicFormLightTextOnDarkBackground = !showPhotoStrip && isFullPagePhoto`

| Layout | Sfondo colonna form | Palette errori / privacy / «Hai selezionato» |
|--------|---------------------|---------------------------------------------|
| Striscia laterale | Crema `#faf7f1` | warm-wood, `text-red-500` / `text-red-600`, link `text-warm-orange` |
| Pagina intera (full-01…06) | Foto viewport | `text-white` |
| Senza striscia, gradiente/tile/crema | Chiaro | come striscia |

| Elemento | Componente | Stile (condizionato) |
|----------|------------|----------------------|
| «Hai selezionato :» + titolo + descrizione | `MenuSelection` | `publicFormLightTextOnDarkBackground` |
| Errori campi cliente | `BookingFormFields` | helper `publicFormFieldErrorClass` / `publicFormDateTimeErrorClass` |
| Errori menù, tipologia, slot | `BookingRequestForm` | helper `publicFormSectionErrorClass` / `publicFormSlotAvailabilityErrorClass` |
| Privacy + link + obbligatori | `DietaryRestrictionsSection` | prop `lightTextOnDarkBackground` (layout inset resta `publicFormFields`) |

**Nota:** card menù con `bg-white/85` e titoli **dentro** le card ingredienti su foto restano invariati (`text-white` sulle foto delle card).

---

## File toccati

| File | Perché |
|------|--------|
| `BookingRequestForm.tsx` | `noValidate`, orchestrazione submit errato, errori menù/tipologia/slot bianchi |
| `BookingMenuCategoryCard.tsx` | rAF overlay, evento collapse |
| `BookingMenuComposeGrid.tsx` | `composeCollapseKey`, scroll ref |
| `MenuSelection.tsx` | collapse + remount key; riepilogo menù fisso bianco |
| `bookingPublicFormAttention.ts` | scroll, collapse event, mappa errori |
| `BookingFormFields.tsx` | attenzione per campo; messaggi errore bianchi |
| `BookingPublicInsetField.tsx` | anchor scroll + pulse su wrapper esterno |
| `BookingPublicDateTimePickers.tsx` | idem date/ora + pulse esterno |
| `DietaryRestrictionsSection.tsx` | privacy + pulse; palette condizionata (`lightTextOnDarkBackground`) |
| `index.css` | animazione pulse arancione |
| `BookingRequestPage.tsx` | calcolo e passaggio `publicFormLightTextOnDarkBackground` |
| `bookingPublicFieldStyles.ts` | helper palette errori (`publicFormFieldErrorClass`, …) |

---

## Test eseguiti

| Test | Esito |
|------|-------|
| `npm run validate` | ✅ OK (×4 in sessione, ultimo dopo polish testi bianchi) |
| QA browser locale — submit nome vuoto | ✅ toast, scroll, pulse |
| QA Matteo — chiusura card + scroll + lampeggio | ✅ **Approvato** |
| QA Matteo — ancoraggio overlay scroll | ✅ Accettabile |
| QA Matteo — leggibilità privacy / errori / riepilogo menù | ✅ Bianco su full-page (giro 4) |
| QA Matteo — fix palette con striscia laterale attiva | ✅ **«Ottimo funziona»** (sessione light) |
| `npm run validate` post-fix palette | ✅ OK (217 test) |

---

## Derivazione errori

| Issue | Causa | Come evitato |
|-------|-------|--------------|
| Nulla funzionava (toast/scroll/pulse/card) | **Validazione HTML5** senza `noValidate` | `noValidate` + doc layout context |
| Pulse spariva subito (giro 2) | `focus()` programmatico post-scroll | Rimosso; dismiss solo `isTrusted` |
| Card non chiudevano (giro 2) | Solo `resetKey` via prop, timing | Evento sync + remount `MenuSelection` |
| Lag overlay | portal + setState per frame | Sync DOM via rAF |
| Privacy non scrollava | id DOM errato in mappa | `privacy-consent-dietary` |
| Ospiti poco visibile al pulse | Classe attenzione sul riquadro interno con bordo rosso | Pulse sul wrapper esterno |
| Testi privacy/errori/menù illeggibili su full-page | Colori warm-wood / rosso su foto scura | Bianco se `publicFormLightTextOnDarkBackground` |
| Testi bianchi illeggibili su striscia/crema | Bianco legato a `publicFormFields` senza distinguere layout | Prop da `BookingRequestPage`; warm/rosso su sfondo chiaro |

---

## File di skill / doc aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `FORM_VALIDATION_ATTENTION_PATTERN.md` | **nuovo** — guida replica su altri form/modali | FU-010, riferimenti codice |
| `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | §9 validazione + palette condizionale full-page | agenti su Prenota |
| `FOLLOW_UP.md` | FU-010 aperto; FU-011/012/013 chiusi | debito post-sessione |
| `SESSION_LOG.md` | righe esecutore + revisione | tracciamento |
| `Report-revisione-validazione-ux-prenota-29-05-26.md` | report Verifica | chiusura ciclo |
| `bookingPublicFormAttention.ts` | header JSDoc → pattern doc | discoverability in IDE |

---

## Dati comunicazione

- **Schermata:** Pagina Prenota — form pubblico `/prenota/:slug`.
- **Componenti:** `BookingRequestForm` (validazione + errori), `MenuSelection` (riepilogo menù), `BookingFormFields` (campi cliente), `DietaryRestrictionsSection` (privacy), `BookingMenuCategoryCard` (card ingredienti).
- **Storage:** nessuna tabella/chiave DB modificata — solo CSS/classi Tailwind in memoria browser.

---

## Follow-up aperti

| ID | Descrizione |
|----|-------------|
| **FU-010** | Estrarre hook condiviso; checklist e riferimenti in `docs/per-ui-design-skill/FORM_VALIDATION_ATTENTION_PATTERN.md` §6–7. |

---

## Guida replica (riassunto)

Per **AdminBookingForm**, modali walk-in/tavolo, ecc.:

1. Leggere **`FORM_VALIDATION_ATTENTION_PATTERN.md`** (checklist §6).
2. Copiare sequenza da `focusFirstValidationIssue` in `BookingRequestForm.tsx`.
3. Riutilizzare `bookingPublicFormAttention.ts` fino a estrazione hook (FU-010).
4. Applicare `.booking-public-field-attention` su wrapper con `id` scrollabile.
5. **Mai** omettere `noValidate` se i campi hanno `required`.

---

## Scalabilità multi-tenant

**OK** — nessuna query Supabase; loop rAF per card aperta è per istanza browser locale.

---

## Fix palette striscia (29-05-26, sessione light)

**Problema:** il giro 4 aveva messo testo bianco ovunque il form pubblico usasse `publicFormFields` / `publicFormLayout`, ma con **striscia laterale** la colonna form è su crema `#faf7f1` (`STRIP_MODE_PAGE_BG` in `BookingRequestPage.tsx`) — errori e privacy risultavano invisibili.

**Soluzione:** un booleano dalla pagina, non dal form:

- `publicFormLightTextOnDarkBackground={!showPhotoStrip && isFullPagePhoto}`
- Propagato a `BookingRequestForm` → `BookingFormFields`, `DietaryRestrictionsSection`, `MenuSelection`
- Classi centralizzate in `bookingPublicFieldStyles.ts`

**Invariato:** lampeggio arancione, `noValidate`, chiusura card, scroll errore, ancoraggio overlay portal.

**Storage:** nessun cambio — solo `restaurant_settings` già letti (`public_booking_strip_photo`, `public_booking_page_background`).

**Esito QA:** Matteo — «ottimo funziona» su striscia; full-page mantiene bianco come giro 4.
