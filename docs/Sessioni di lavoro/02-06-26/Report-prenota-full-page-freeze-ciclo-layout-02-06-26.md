# Report — Ciclo layout Pagina Prenota full-page (freeze desktop)

**Data:** 02-06-26  
**Profilo:** Prepara-prompt + analisi (chat multi-turno); esecuzione parziale su working tree  
**Stato:** **non chiuso** — QA Matteo parziale OK; **2 fix pendenti**; working tree con diff non committato; agente esecutore 2º tentativo **annullato** da Matteo

---

## Cosa voleva Matteo (effetto ristoratore)

**Schermata:** Pagina **Prenota** pubblica (`/prenota/:slug`) quando lo sfondo è **foto a tutta pagina** (impostazione `public_booking_page_background` = full-01…04) e **senza** striscia foto laterale (`public_booking_strip_photo` vuoto).

| Obiettivo | Effetto visivo |
|-----------|----------------|
| Freeze larghezza form | Su monitor larghi il form **non si allarga** oltre la larghezza in cui entrano **4 card ingredienti** con foto (~1168px); più **sfondo** ai lati |
| Riepilogo | Da **1600px**: colonna **Riepilogo Prenotazione** a destra del form; **sotto 1600px**: come **mobile** (sotto il form) |
| Allineamento card | Card **tipologia** (3) e **sottotab** scroll allineate alla larghezza delle **caselle** del form |
| Menu QR (sessione precedente stesso thread) | Home + pagina categoria QR con cap **1024px** — **commit `283c36b`**, merge `main` ✅ |

**Fuori scope esplicito:** layout con **striscia laterale**; sfondo **gradiente/tile** (senza full-page).

---

## Stato codice (fine sessione)

| Area | Stato |
|------|--------|
| Menu QR FU-025 categoria | Committato `283c36b`, push `env/test` + merge `main` (inizio sessione) |
| Prenota freeze full-page | **Modifiche in working tree** (non committate): ~219 righe su 7 file + `bookingPageLayout.ts` untracked |
| Fix riepilogo 1256–1599 + slot 3/4/5 sottotab | **Non completati** (2º agente annullato) |

**File toccati (diff attuale):**
- `src/pages/BookingRequestPage.tsx` — wrapper centrato, cap CSS vars, riepilogo esterno `min-[1600px]`
- `src/features/booking/components/BookingRequestForm.tsx` — `externalSummaryLayout`, `min-[1600px]:hidden` su stacked summary
- `src/features/booking/constants/bookingPageLayout.ts` — **nuovo** (1168, 360, 1600)
- `BookingModeCards.tsx`, `BookingSubTabCards.tsx`, `bookingPublicFieldStyles.ts` (row width 3/5)
- `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` — §4.1

**Validate / commit:** non eseguiti in chiusura report (Matteo non ha chiesto commit).

---

## Cronologia chat e prompt (dati grezzi)

### Turni principali

| # | Matteo / agente | Contenuto |
|---|-----------------|-----------|
| 1 | Matteo | Chiede se esiste modifica «div contenitore desktop» su Prenota anti-stretch |
| 2 | Agente | Trova ex `max-w-7xl` rimosso con striscia (`7848ad6`); confonde possibile con Menu QR `max-w-[1024px]` |
| 3 | Matteo | Allinea Menu QR categoria + stesso su Prenota; **prepara prompt** |
| 4 | Agente | Prompt FU-025 categoria + piano Prenota (cap 1168, riepilogo esterno) |
| 5 | Matteo | Commit push merge main Menu QR ✅ |
| 6 | Matteo | Conferma layout: cap a 4 card ingredienti; riepilogo esterno; prova allineamento alto sottotab |
| 7 | Agente | Prompt implementazione full-page only |
| 8 | Matteo | Screenshot: riepilogo OK a destra ma **blocco tutto a sinistra** |
| 9 | Agente | Prompt fix centratura (`mx-auto`, no `w-full` su flex figli) |
| 10 | Matteo | Centratura OK; chiede riepilogo **sotto &lt;1600**; tipologie/sottotab allineate; **5** card scroll desktop; **4** sotto 1100px; **3** sotto 690px |
| 11 | Agente | Prompt completo (regola: sempre prompt intero su aggiustamenti) |
| 12 | Matteo | Conferma: sotto 1600 = come mobile; sopra 1600 = destra |
| 13 | Esecutore | Implementazione (presumibilmente in tree) |
| 14 | Matteo | **Annulla** esecutore — riepilogo 1256–1599 ancora sbagliato (comportamento sticky) |
| 15 | Agente | Tabella + **follow up** copia-incolla per prossima chat |
| 16 | Matteo | **Report finale** sessione + meta skill |

### Prompt consegnati (sintesi obiettivi)

1. **Menu QR categoria** — `max-w-[1024px]` come homepage (eseguito → `283c36b`)
2. **Prenota full-page freeze** — cap 1168px, riepilogo esterno ≥1600, tipologie `bookingPublicRowCardWidthClass(3)`, sottotab 5 slot
3. **Fix centratura** — `w-fit` + larghezze esplicite form/summary, header nel wrapper centrato
4. **Fix 1600 + card responsive** — riepilogo stacked senza sticky 1256–1599; sottotab 5/4/3 per viewport
5. **Follow up** (post-annullamento) — solo fix 1 (sticky) + fix 2 (slot 3/4/5)

### Frasi Matteo utili (verbatim / parafrasi)

- «dovrei aver fatto modifiche pagina prenota… div desktop… evitare stretch»
- «è nel menu qr bravo» (reindirizzamento area corretta)
- «facciamo la stessa cosa per pagina prenota» + «solo layout sfondo pagina intera, no striscia»
- «bloccare dimensione quando si vedono 4 card ingredienti»
- «riepilogo esterno alla div del form, allineato in alto alle sottotab»
- «sotto 1600 mantiene posizione sotto come mobile»
- «agente ha sbagliato ancora, ho fatto annullare»
- «quando aggiustamenti al prompt in chat prepara → agente deve ridare **prompt intero**»

---

## QA Matteo (parziale)

| Check | Esito |
|-------|--------|
| Centratura blocco form+riepilogo (full-page, desktop largo) | ✅ dopo fix centratura |
| Riepilogo a destra ≥1600 | ✅ |
| Riepilogo sotto 1600 come mobile | ❌ **KO** 1256–1599 (sticky/order legacy su `BookingSummarySidebar`) |
| 3 tipologie dentro larghezza form | Parziale / da rivedere con esecutore |
| 5 sottotab visibili, no 6ª peek | Parziale — codice ha solo `bookingPublicRowCardWidthClass(5)` fisso, **manca** 4/3 sotto 1100/690 |
| Striscia / gradiente | Non testato in sessione (fuori scope) |

---

## Bug root cause (per follow-up)

### Fix 1 — Riepilogo 1256–1599

`BookingSummarySidebar.tsx` riga ~113: `min-[1256px]:sticky min-[1256px]:order-0` si applica anche all’istanza nel form (`min-[1600px]:hidden` quando `externalSummaryLayout`).

**Atteso:** sotto 1600px istanza stacked = `order-2`, `mb-6`, **no sticky**. Sticky solo su istanza esterna ≥1600px.

### Fix 2 — Sottotab 5/4/3

Oggi con `fullPageFormCapLayout`: solo `bookingPublicRowCardWidthClass(5)` per ≥4 tab.

**Atteso:** `max-[689px]:` class(3), `min-[690px]:max-[1099px]:` class(4), `min-[1100px]:` class(5).

---

## Dati comunicazione (per revisore)

| Metrica | Valore |
|---------|--------|
| Giri chat (agente prepara/analisi) | ~8–10 messaggi utente nel filone layout |
| Prompt preparati | 5 blocchi copia-incolla (+ 1 follow up) |
| Esecuzioni agente | ≥2 (freeze + centratura; 2º annullato) |
| Rework utente | Annullamento esplicito 2º fix |
| Confusione iniziale area | Prenota vs Menu QR — risolta in turno 3 |
| Regola nuova chiesta | Prompt prepara = **sempre testo completo** su correzioni |

---

## Osservazioni agente (skill system)

### Cosa ha funzionato

- Confronto **git history** (`max-w-7xl` rimosso `7848ad6`) ha chiarito memoria vs codice.
- Tabella **schermata / storage / effetto** ha aiutato Matteo su «cap» vs riepilogo esterno.
- **Prompt intero** dopo correzione 1600px ha evitato ambiguità su «come prima = mobile».

### Cosa non ha funzionato

1. **Due breakpoint sovrapposti (1256 vs 1600)** senza disaccoppiare `BookingSummarySidebar` → esecutore ha implementato 1600 su pagina ma **non** ha tolto sticky a 1256 sull’istanza stacked (o fix incompleto → annullamento).
2. **§4 doc vs §4.1:** §4 dice ancora riepilogo sticky da 1256; §4.1 dice 1600 — agente può applicare solo CSS pagina e lasciare bug componente condiviso.
3. **Prepara non legge codice** — root cause sticky individuata solo dopo screenshot + annullamento; il **prompt fix 1** doveva citare **file + riga** e prop `summaryPlacement` fin dal primo follow-up.
4. **Matteo annulla ma tree resta sporco** — rischio: prossimo agente parte da stato incerto; follow-up chiede `git status` prima di codare ✅

### Dubbi / proposte evoluzione skill

| ID | Dubbio / proposta | Azione suggerita |
|----|-------------------|------------------|
| P1 | **`BOOKING_PUBLIC_SUMMARY_SIDEBAR_MIN_PX` (1256)** vs **`BOOKING_FULL_PAGE_EXTERNAL_SUMMARY_MIN_PX` (1600)** — stesso componente, due semantici | Estendere `BookingSummarySidebar` con prop `variant: 'stacked' \| 'external-sticky'` obbligatoria quando `externalSummaryLayout`; documentare in §4.1 + RULE |
| P2 | Regola prepara «prompt intero su aggiustamenti» | Aggiungere in `docs/PREPARA_PROMPT_SKILL.md` §1.B (Matteo 02-06-26) |
| P3 | Prompt fix devono includere **anti-pattern esplicito** («non lasciare `min-[1256px]:sticky` sull’istanza stacked») | Template fix in PREPARA_PROMPT per task UI breakpoint |
| P4 | Chiusura sessione con **working tree non committato** + annullamento parziale | VOCABOLARIO o report: stato `git status` obbligatorio in report finale |
| P5 | Cap **1168** derivato da card ingredienti vs Menu QR **1024** — due costanti, due pagine; rischio confusione agente | `bookingPageLayout.ts` vs `publicMenuLayout.ts` — tabella in APP_CONTEXT §4 routing già utile |
| P6 | «Revisione accurata» dichiarata ma QA solo Matteo — nessun Playwright su 1300/1599/1680 | FOLLOW_UP: smoke viewport prenota full-page |

### Candidato VOCABOLARIO

- **«prompt intero»** (Liv.2 → Liv.1?): in chat **prepara**, se Matteo corregge il prompt, l’agente riconsegna il blocco **completo**, non il delta.

---

## Prossimo passo

1. Nuova chat **Esecuzione** con follow-up (fix sticky + slot 3/4/5).
2. Smoke: **1300px**, **1599px**, **1680px**, **1000px**, **650px** su tenant full-page (es. da-tommaso).
3. `npm run validate` → commit solo se Matteo chiede «fai report finale» + push.

**Prompt pronto:** vedi messaggio agente «dammi follow up» (stessa chat, 02-06-26).

---

## File report correlati

- Menu QR: `docs/Sessioni di lavoro/01-06-26/Report-fu-025-public-menu-category-page-01-06-26.md`
- Commit Menu QR: `283c36b`
- SESSION_LOG riga 02-06-26 freeze (da aggiornare a chiusura)
