# Report revisione — Validazione UX Pagina Prenota (29-05-26)

## Tipo sessione

| Campo | Valore |
|-------|--------|
| **Profilo** | Verifica (post-esecutore) |
| **Modalità** | standard |
| **Report esecutore** | [Report-validazione-ux-prenota-29-05-26.md](Report-validazione-ux-prenota-29-05-26.md) |
| **Scope revisione** | Obiettivi A (submit fallito) + B (ancoraggio overlay); regressioni; scope creep |

---

## Verdetto

**Approva con riserve**

Il codice implementa in modo coerente il flusso descritto nel report esecutore. `npm run validate` è verde. QA browser revisore **OK su tablet (834/900) e desktop (1280)** — card chiuse, lampeggio arancione, scroll al Nome, errori bianchi, ancoraggio overlay accettabile. Riserve: FU-010 aperto; 375px non rieseguito; modifica incidentale `BookingModeCards.tsx` fuori scope commit.

---

## Tabella requisiti

| ID | Requisito | Esito | Evidenza codice |
|----|-----------|-------|-----------------|
| **A1** | Submit con errori → tutte le card ingredienti aperte si chiudono (`booking-menu-compose-collapse`, `resetKey`, remount `MenuSelection`) | **Approva** | `focusFirstValidationIssue` incrementa `composeCollapseNonce`, dispatch evento, remount `MenuSelection` con `key={menu-compose-${nonce}}`; `BookingMenuCategoryCard` ascolta evento + `useLayoutEffect` su `resetKey`; `BookingMenuComposeGrid` passa `resetKey` derivato da `composeCollapseKey` |
| **A2** | Invariati: carosello, card sottotab chiuse, striscia categorie | **Approva** | Collapse limitato a `BookingMenuCategoryCard` (`setExpanded(false)`); nessun listener su `BookingSubTabCards`, carosello o `ComposeScrollRow` oltre al sync posizione overlay |
| **A3** | Scroll al primo errore (`firstErrorKey`), centrato / visibile con margine sticky | **Approva** | `scrollToBookingPublicError` → `scrollIntoView({ block: 'center' })`; wrapper con `BOOKING_PUBLIC_FIELD_SCROLL_MARGIN` (`scroll-mt-24 scroll-mb-36` mobile, ridotto ≥1256px); mappa ID include fallback menù → `booking-sub-tabs-section` |
| **A4** | Lampeggio arancione su wrapper esterno fino a interazione utente reale (`isTrusted`) | **Approva** | Classe `.booking-public-field-attention` su wrapper (`data-booking-public-field-anchor`); `shouldDismissBookingPublicAttention` controlla `nativeEvent.isTrusted`; nessun `focus()` programmatico post-scroll |
| **A5** | Messaggi errore / privacy / riepilogo menù leggibili (bianco su sfondo scuro) | **Approva** | `BookingFormFields` errori `text-white font-semibold`; `DietaryRestrictionsSection` con `publicFormFields` → label/link/nota/errore bianchi; `MenuSelection` riepilogo `text-white` / `text-white/90`; errori menù/tipologia/slot in `BookingRequestForm` bianchi |
| **B** | Portal ingredienti: sync posizione rAF + ref DOM + scroll orizzontale `ComposeScrollRow` | **Approva** | Loop `requestAnimationFrame` in `BookingMenuCategoryCard`; listener scroll/resize + `ResizeObserver`; `horizontalScrollRef` passato da `ComposeScrollRow`; z-index portal `z-[160]` documentato sotto sticky `z-200` |

---

## Root cause `noValidate`

**Confermata** — allineata al report esecutore.

- Il form `#booking-request-form` ha **`noValidate`** (linea 898 `BookingRequestForm.tsx`).
- I campi cliente hanno attributo **`required`** (es. `BookingFormFields`, checkbox privacy).
- **Senza `noValidate`:** il browser intercetta il submit con validazione HTML5 nativa **prima** di `onSubmit` → `handleSubmit` → `validate()` → `focusFirstValidationIssue` **non vengono raggiunti**; l’utente vede solo il tooltip nativo.
- **Con `noValidate`:** il submit arriva a `validate()` React; se fallisce → toast + sequenza collapse/scroll/pulse.

---

## `npm run validate`

| Comando | Esito | Dettaglio |
|---------|-------|-----------|
| `npm run validate` | **OK** | Eseguito dal revisore 29-05-26 21:56 — lint + typecheck + **217 test** (26 file), exit 0 |

---

## Regressioni (analisi codice)

| Controllo | Esito | Note |
|-----------|-------|------|
| Submit valido con `noValidate` + `validate()` completa | **OK** | `noValidate` disabilita solo HTML5 nativo; `validate()` resta l’unico gate logico; path successo → `mutate()` invariato |
| Remount `MenuSelection` su errore **non** azzera `menu_selection` nel parent | **OK** | Solo `composeCollapseNonce` cambia; `selectedItems={formData.menu_selection?.items}` resta nello state parent; remount resetta solo stato interno UI (card espanse) |
| Sticky bar mobile non copre campo dopo scroll | **OK** | QA tablet 834px: campo Nome centrato in viewport (`nameTop` ~464px, `nameBottom` ~512px su vh 1024); margine sopra sticky bar rispettato |
| z-index overlay vs sticky bar (~200) | **OK** | `BOOKING_MENU_CATEGORY_EXPANDED_PORTAL_CLASS = 'fixed z-[160]'`; `BookingStickyBar` usa `z-200` — overlay sotto la barra come da commento in `bookingMenuComposePanelLayout.ts` |

---

## QA manuale (browser — revisore 29-05-26)

**Tenant:** `test-pro` · **URL:** `http://localhost:5175/prenota/test-pro`  
**Scenario:** Rinfresco di Laurea → Menù aperitivo di laurea → card **Antipasti** aperta → (scroll) → **Invia** con campi vuoti.

| Viewport | Card chiuse post-submit | Lampeggio arancione Nome | Scroll al campo | Testi errore bianchi | Ancoraggio overlay scroll |
|----------|-------------------------|--------------------------|-----------------|----------------------|---------------------------|
| **834** (tablet) | **OK** — 0 portal aperti, Antipasti `collapsed` | **OK** — `.booking-public-field-attention` su `#client_name` | **OK** — Nome visibile e centrato (`scrollY` ~510) | **OK** — `rgb(255,255,255)` «Nome obbligatorio» | **OK** — portal segue scroll verticale (742→343 px top dopo +400px scroll) |
| **900** (tablet largo) | **OK** | **OK** | **OK** — Nome in viewport con margine sticky | **OK** | Non misurato (focus submit/pulse) |
| **1280** (desktop) | **OK** — 0 portal aperti | **OK** | **OK** — Nome visibile post-submit | **OK** | **OK** — screenshot con card aperta dopo scroll: overlay allineato alla striscia categorie; drift residuo accettabile (coerente FU-013) |

| Viewport | Revisore | Matteo (esecutore) |
|----------|----------|-------------------|
| 375 | Non rieseguito in questo giro | OK (giro precedente) |
| 834 / 900 / 1280 | **OK** (tabella sopra) | OK (conferma precedente) |

**Evidenze visive:** screenshot revisore `qa-tablet-834-submit-error-pulse.png`, `qa-desktop-1280-submit-error-pulse.png`, `qa-desktop-1280-overlay-scroll.png` (sessione browser locale).

---

## Scope creep — `BookingModeCards.tsx`

| File | Diff | Giudizio |
|------|------|----------|
| `BookingModeCards.tsx` | Aggiunta `mx-[-7px]` sul titolo card tipologia | **Fuori scope** — tweak tipografico/allineamento, non collegato a validazione UX né overlay. **Escludere** dal commit del task «validazione UX Prenota»; eventualmente commit separato se voluto. |

---

## Follow-up

| ID | Stato revisione | Motivo |
|----|-----------------|--------|
| **FU-010** | **Aperto** (confermato) | Helper condiviso admin — fuori scope sessione; debito documentato |
| **FU-011** | **Chiuso** (codice supporta claim) | `noValidate` + pulse arancione + dismiss `isTrusted` |
| **FU-012** | **Chiuso** (codice supporta claim) | Evento collapse + `resetKey` + remount `MenuSelection` |
| **FU-013** | **Chiuso** (codice supporta claim) | rAF + scroll orizzontale; drift residuo accettabile per QA Matteo |

---

## File esaminati

| File | Ruolo verificato |
|------|------------------|
| `bookingPublicFormAttention.ts` | Evento collapse, mappa errori, scroll, `isTrusted`, classi attenzione/margini |
| `BookingRequestForm.tsx` | `noValidate`, `validate()`, `focusFirstValidationIssue`, `composeCollapseNonce`, `attentionFieldKey`, remount `MenuSelection` |
| `BookingMenuCategoryCard.tsx` | Listener collapse, rAF overlay, portal |
| `BookingMenuComposeGrid.tsx` | `composeCollapseKey` → `resetKey`, ref scroll orizzontale |
| `BookingPublicInsetField.tsx` | Pulse su wrapper esterno, dismiss attenzione |
| `BookingPublicDateTimePickers.tsx` | Idem date/ora |
| `BookingFormFields.tsx` | Wiring `attentionFieldKey`, errori bianchi |
| `DietaryRestrictionsSection.tsx` | Privacy attenzione + testi bianchi `publicFormFields` |
| `MenuSelection.tsx` | `composeCollapseKey`, riepilogo menù bianco |
| `index.css` | Animazione `.booking-public-field-attention` arancione + `prefers-reduced-motion` |
| `bookingMenuComposePanelLayout.ts` | z-index portal vs sticky |

---

## Dati comunicazione

| Campo | Valore |
|-------|--------|
| **Schermata** | Pagina Prenota pubblica — `/prenota/:slug` |
| **Effetto per il cliente** | Submit con dati mancanti: toast errore, card ingredienti si chiudono, scroll al primo campo, lampeggio arancione finché non clicca, messaggi bianchi leggibili; con card aperta lo scroll pagina mantiene il pannello agganciato alla card |
| **Componenti principali** | `BookingRequestForm` (orchestrazione), `MenuSelection` + `BookingMenuCategoryCard` (menù/ingredienti), `BookingFormFields` (dati cliente), `DietaryRestrictionsSection` (privacy) |
| **Storage DB** | **Nessun cambiamento** — solo stato UI React e CSS in memoria browser |

---

## Scalabilità multi-tenant

**OK** — nessuna query Supabase; loop rAF e listener per istanza browser locale; nessun timer globale non pulito o stato condiviso tra tenant.

---

## Gap / riserve (non bloccanti)

1. **FU-010** — estrazione hook condiviso per admin ancora da fare.
2. **QA revisore** — 375px non rieseguito; tablet/desktop OK (834/900/1280).
3. **`BookingModeCards.tsx`** — diff margin negativo incidentale, non parte del deliverable UX validazione.
4. **`shouldDismissBookingPublicAttention`** — fallback `return true` se `isTrusted` assente (edge case teorico); accettabile, nessun bug segnalato in QA.

---

## Chiusura revisione

| Voce | Stato |
|------|--------|
| Codice vs requisiti A + B | Coerente |
| Report esecutore vs codice | Allineato |
| `npm run validate` | OK (217 test) |
| Guida replica altri form | `docs/per-ui-design-skill/FORM_VALIDATION_ATTENTION_PATTERN.md` (post-commit) |
| `BookingModeCards.tsx` | Escluso dal commit validazione UX (tweak `mx-[-7px]` non incluso) |
| Commit | Eseguito in chiusura ciclo Matteo (codice + doc) |

---

## Metriche ciclo (standard)

| Metrica | Valore |
|---------|--------|
| Prompt sostanziali (prepara + esecutore + fix) | ~3 |
| Correzioni post-prima implementazione | 2 (KO lampeggio/card → root `noValidate` + polish testi) |
| Follow-up aperti | 1 (FU-010 estrazione hook) |
| Modalità alzata | no |
| Note | Fix rapido dopo root cause; revisore Approva con riserve |
