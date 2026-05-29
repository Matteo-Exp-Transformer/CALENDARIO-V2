# Report revisione — Palette testo Pagina Prenota (due layout)

**Modalità:** standard · **Profilo:** Verifica  
**Data:** 29-05-26  
**Scope:** fix palette errori / privacy / riepilogo menù — bianco solo su full-page senza striscia; warm/rosso su striscia e sfondi chiari.  
**Riferimenti:** [`BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md`](../../per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md) §1–2 · [Validazione UX](Report-validazione-ux-prenota-29-05-26.md) · [Revisione validazione UX](Report-revisione-validazione-ux-prenota-29-05-26.md)

---

## Verdetto

**Approva con riserve** — comportamento allineato ai tre casi layout (striscia / full-page / altro chiaro); `npm run validate` OK. Il modello è **molto migliore** dei `text-white` sparsi della sessione validazione UX, ma l’estendibilità resta **Parziale** (S5): helper centralizzati per gli errori, ternari locali per privacy e riepilogo menù.

---

## Tabella S1–S6 (scalabilità)

| Criterio | Esito | Nota |
|----------|-------|------|
| **S1 — Single source of truth** | **Approva** | `publicFormLightTextOnDarkBackground={!showPhotoStrip && isFullPagePhoto}` calcolato **solo** in `BookingRequestPage.tsx` (L247). `showPhotoStrip` / `isFullPagePhoto` non sono ricalcolati nei figli con logica diversa. |
| **S2 — Separazione layout vs palette** | **Approva** | `publicFormLayout` (larghezza/blocchi menù) e `publicFormLightTextOnDarkBackground` / `lightTextOnDarkBackground` sono prop distinte. Nessun `publicFormFields ? text-white`. `DietaryRestrictionsSection`: `publicFormFields` (caselle inset) ≠ `lightTextOnDarkBackground`. |
| **S3 — Copertura completa** | **Approva** | Errori campo/data/slot → `bookingPublicFieldStyles.ts` via `BookingFormFields` + `BookingRequestForm`. Errori tipologia/menù/slot → `publicFormSectionErrorClass` / `publicFormSlotAvailabilityErrorClass`. Privacy → `DietaryRestrictionsSection` condizionato. Riepilogo «Hai selezionato» → `MenuSelection` condizionato. |
| **S4 — Non regressione UX validazione** | **Approva** (code review) | `noValidate` (L905), `focusFirstValidationIssue`, `dispatchBookingMenuComposeCollapse`, `scrollToBookingPublicError`, classe `.booking-public-field-attention` invariati; il flag palette non interviene nel flusso. **QA visivo** lampeggio/scroll/card: affida a Matteo su entrambi i layout (vedi tabella QA). |
| **S5 — Estendibilità** | **Parziale** | Quattro helper in `bookingPublicFieldStyles.ts` per errori. Privacy e riepilogo menù usano ancora `cn(..., flag ? 'text-white' : 'text-warm-*')` inline in `DietaryRestrictionsSection` e `MenuSelection` (~8 occorrenze). Un terzo layout richiederebbe oggi **3–4 file** (pagina + 2 componenti prosa + eventuale estensione helper), non un solo enum. |
| **S6 — Scope** | **Approva** | Solo pagina pubblica Prenota; admin/modali non toccati. `text-white` su card carosello/ingredienti (overlay su foto) resta giustificato e indipendente dal flag. Pulsanti submit/footer: bianco su verde/icona — fuori scope palette helper. |

---

## Grep `text-white` — form pubblico Prenota

| File | Occorrenza | Legame flag / giustificazione |
|------|------------|-------------------------------|
| `bookingPublicFieldStyles.ts` | Errori campo/sezione/slot | Solo se `lightTextOnDarkBackground === true` |
| `BookingFormFields.tsx` | — | Usa helper, non `text-white` diretto |
| `BookingRequestForm.tsx` | Errori menù/tipologia/slot | Helper; overlay carosello L117–145 = foto card; submit L1164 = bottone verde |
| `DietaryRestrictionsSection.tsx` | Privacy, link, obbligatori, errore | `lightTextOnDarkBackground`; check icon L146 = segno su checkbox arancione |
| `MenuSelection.tsx` | «Hai selezionato» / titolo / descrizione | `publicFormLightTextOnDarkBackground` |
| `BookingRequestPage.tsx` | Footer icone, submit sidebar | UI footer/submit, non palette form |

Nessun `text-white` «orfano» su messaggi errore/privacy/riepilogo senza flag.

---

## Confronto pre-sessione (validazione UX)

| Elemento | Sessione validazione UX (full-page) | Dopo fix palette (striscia / crema / gradiente) |
|----------|-----------------------------------|--------------------------------------------------|
| Errori campo | `text-white` fisso | `text-red-500` |
| Errori data/ora | bianco | box `border-red-200 bg-red-50` + `text-red-600` |
| Errori sezione menù | bianco | `text-red-500` |
| Privacy / obbligatori | bianco | `text-warm-wood-dark` / `text-warm-wood-dark/80` |
| Errore privacy | bianco | `text-red-500` |
| Riepilogo menù fisso | bianco | `text-warm-wood` / `text-warm-wood-dark/75` |
| Full-page senza striscia | bianco | invariato (flag `true`) |

Allineato all’intento «come pre-sessione» su layout chiaro.

---

## LOCK `BookingRequestPage`

- Griglia `grid-cols-[20vw_1fr] min-[900px]:grid-cols-[25vw_1fr]`, `BookingPhotoStrip` sticky, footer fuori griglia, spacer `h-20 min-[1256px]:h-4`: **invariati**.
- Unica modifica strutturale rilevante al form: prop `publicFormLightTextOnDarkBackground` verso `BookingRequestForm` (L247). **Conforme** al LOCK §0 (fix su figlio via prop dalla pagina).

---

## Validate

| Comando | Esito |
|---------|--------|
| `npm run validate` | **OK** — eslint, `tsc --noEmit`, Vitest **217/217** (26 file) |

---

## Tabella QA layout

| Scenario | Atteso | Esito revisore |
|----------|--------|----------------|
| Striscia laterale + submit nome vuoto | Errori/privacy **non** bianchi su crema | **Affida a Matteo** — 375px e 1280px con `public_booking_strip_photo` valorizzato |
| Pagina intera full-page + stesso test | Helper **bianchi** | **Affida a Matteo** — `full-01`…`full-06`, striscia off |
| Senza striscia, gradiente/tile/crema | Come striscia, non bianco | **Affida a Matteo** — nessuna striscia + sfondo non `full-*` |
| Entrambi i layout | Lampeggio + chiusura card + scroll errore | **Affida a Matteo** — flusso codice OK; verifica visiva non eseguita in questa sessione |

Viewport richiesti: **375** (striscia mobile), **1280** (desktop); **834** opzionale.

---

## Verdetto scalabilità (obbligatorio)

**Un nuovo layout Prenota (es. solo gradiente scuro) richiederebbe oggi ~3–4 file**, non un solo punto di configurazione.

1. **`BookingRequestPage.tsx`** — estendere la formula del flag (oggi `!showPhotoStrip && isFullPagePhoto`) o introdurre un enum tipo `PublicBookingSurface` (`strip` | `fullPagePhoto` | `lightBackground` | futuro `darkBackground`).
2. **`bookingPublicFieldStyles.ts`** — eventuali nuove regole per errori (oggi già centralizzate).
3. **`MenuSelection.tsx`** + **`DietaryRestrictionsSection.tsx`** — aggiornare i ternari inline sul testo prosa finché non esistono helper simmetrici (es. `publicFormPrivacyLabelClass`, `publicFormMenuSummaryTitleClass`).

Il passaggio a **1 punto di configurazione** è realistico promuovendo un enum/costante condivisa in `bookingPageBackground.ts` o `bookingPublicFieldStyles.ts` + helper per **tutta** la prosa pubblica, non solo gli errori. Fino ad allora il debito è **tracciabile ma non bloccante**.

---

## Raccomandazione (post-approvazione)

| Priorità | Azione |
|----------|--------|
| Doc | Aggiungere in `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` §2 un paragrafo «Palette testo helper» con tabella layout → flag → classi (evita reintrodurre bianco globale). |
| Codice (FU-014) | Enum `PublicBookingSurface` derivato da settings pagina + helper prosa in `bookingPublicFieldStyles.ts`; `MenuSelection` / `DietaryRestrictions` consumano solo helper. |
| QA | Matteo: 3 screenshot o check rapido striscia vs full-page vs gradiente dopo deploy locale. |

Non duplicare in FU-010 (hook validazione): ambito diverso.

---

## Dati comunicazione

| Voce | Contenuto |
|------|-----------|
| **Schermata** | Pagina Prenota pubblica (`/prenota/:slug`) — form richiesta prenotazione |
| **Effetto cliente** | Con **striscia foto** o sfondo **chiaro** (crema, gradiente, tile): messaggi errore rossi e testi privacy/menù **scuri**, leggibili sul crema. Con **pagina intera** (foto full-viewport, senza striscia): stessi testi **bianchi** sulla foto. La validazione (lampeggio arancione, scroll, chiusura card ingredienti) resta uguale. |
| **Componenti** | `BookingRequestPage` (decide il flag) → `BookingRequestForm` → `BookingFormFields`, `MenuSelection`, `DietaryRestrictionsSection`; stili in `bookingPublicFieldStyles.ts` |
| **Storage DB** | Nessun cambiamento — solo `restaurant_settings` già usati: `public_booking_strip_photo`, `public_booking_page_background`, `booking_public_form_config` |

---

## File esaminati

`src/pages/BookingRequestPage.tsx` · `src/features/booking/components/BookingRequestForm.tsx` · `src/features/booking/components/publicBooking/BookingFormFields.tsx` · `src/features/booking/components/DietaryRestrictionsSection.tsx` · `src/features/booking/components/MenuSelection.tsx` · `src/features/booking/constants/bookingPublicFieldStyles.ts` · `src/features/booking/utils/bookingPublicFormAttention.ts`

**Fuori scope revisione:** estrazione hook FU-010, test unitari palette (assenti), commit git.
