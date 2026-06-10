# Report revisione indipendente — M0 Prenota FU-030 + FU-038/039 (10-06-26)

## Verdetto

**Approva con riserve**

Nessun difetto bloccante (P1) su codice, seed TEST o centratura C1/C3. Le riserve riguardano **processo/chiusura formale** (FU-030 ancora «Aperto» in `FOLLOW_UP.md` nonostante accettazione visiva Matteo) e **polish opzionale** già tracciato (FU-040/041, seed SQL versionato). Il ciclo M0 è **mergeabile** dopo commit del working tree e aggiornamento follow-up su «lavoro ok».

---

## Sintesi per Matteo (1–3 righe)

La prova cap menù **24/24/79** (FU-030 Fase 1) è coerente con codice, test e mappa §E; il seed `/prenota/test` e la centratura **C1/C3** su 5 viewport sono confermati in modo indipendente (DB + browser). Puoi chiudere M0; restano solo formalità follow-up e polish non bloccanti.

---

## Gate 1 — Automatico

| Controllo | Esito | Dettaglio |
|-----------|-------|-----------|
| `npm run validate` | ✅ PASS | lint + typecheck + **482/482** test Vitest (56 file), exit 0 |
| Diff `src/` Fase 1 | ✅ Presente e atteso | 5 file: `bookingPrenotaTextLimits.ts`, `BookingMenuCategoryCard.tsx`, `BookingSummarySidebar.tsx`, `MenuPricesTab.tsx`, `bookingPrenotaTextLimits.test.ts` (+111/−12 righe) |
| Diff `src/` Fase 2 | ✅ Nessun diff atteso | Confermato: Fase 2 = solo DB TEST + doc |
| `BookingRequestPage.tsx` LOCK | ✅ Non modificato | Assente da `git status` / diff working tree |

---

## Gate 2 — Codice FU-030 (statico)

| Controllo | Atteso | Esito revisore |
|-----------|--------|----------------|
| `BOOKING_MENU_COMPOSE_TEXT_LIMITS` | 24 / 24 / 79 da `subTabLabel` / `subTabDescription` | ✅ Costante derivata correttamente; test Vitest dedicato passa |
| Pubblico — clamp silenzioso | `clampBookingText` in card compose + sidebar; **nessun** contatore cliente | ✅ `BookingMenuCategoryCard` (categoria chiusa/aperta/portal, nome+descrizione ingrediente); `BookingSummarySidebar` (righe «Il tuo menu»). Grep `publicBooking/`: zero `maxLength`/contatori |
| Admin — `MenuPricesTab` | `maxLength` + `N/max` su prodotto + titolo categoria overlay | ✅ Nome, descrizione (`?? ''` sul contatore), titolo categoria |
| LOCK griglia | `BookingRequestPage.tsx` intatto | ✅ |
| §E `PRENOTA_TEXT_LIMITS_MAP.md` | Coerente con costanti | ✅ Sezione E allineata 24/24/79 + superfici UI |
| Fix righe vuote overlay compose | Eventuale in parallelo | ⬜ **Non presente** nel branch — nessun diff correlato; polish opzionale fuori M0 |

---

## Gate 3 — QA browser indipendente FU-039

**Ambiente:** `get_project_url` → `https://docnnernvpyrbwuzzach.supabase.co` (**TEST** `docnnernvp`) · `npm run dev` · Playwright MCP · URL obbligatorio `/prenota/test`.

**Metodo misura (indipendente dal report esecutore):**
- **C1:** `[data-testid="booking-sub-tab-cards"]` → 3 button card principali (esclusi footer/courses); `centerDelta` gruppo vs outer; `overflows` / `firstLeftGap` se overflow.
- **C3:** ramo single-slide `div.flex.w-full.justify-center > article` (il componente **non** espone `data-testid="booking-sub-tab-carousel"` — il report esecutore ha usato lo stesso workaround).

### Tabella QA revisore — C1 + C3

| ID | Caso | 375 | 806 | 834 | 1256 | 1280 |
|----|------|-----|-----|-----|------|------|
| **C1** | 3 card `qa_cards_mode` — gruppo centrato | ✅ OK | ✅ OK | ✅ OK | ✅ OK | ✅ OK |
| **C3** | 1 slide carosello `qa_carousel_mode` — slide centrata | ✅ OK | ✅ OK | ✅ OK | ✅ OK | ✅ OK |

### Metriche raw (revisore)

| Viewport | C1 cardCount | C1 centerDelta | C1 overflows | C3 centerDelta | C3 justifyContent |
|----------|--------------|----------------|--------------|----------------|-------------------|
| 375 | 3 | 0 | false | 0 | center |
| 806 | 3 | 0 | false | 0 | center |
| 834 | 3 | 0 | false | 0 | center |
| 1256 | 3 | 0 | false | 0 | center |
| 1280 | 3 | 0 | false | 0 | center |

**806px:** 3 card entrano (`outerWidth` 720px), `overflows=false`, `inner` con `w-full justify-center` — coerente con regola §5 (nessun overflow → centratura, non scroll da bordo sx).

**Spot adiacenti 1280px:** header `h1` «QA Prenota Centratura» ✅ · `#booking-request-form` ✅ · `[data-testid="booking-summary-sidebar"]` ✅ · `[data-testid="booking-mode-cards"]` ✅ · layer full-page `100lvh` ✅ · striscia laterale assente (full-page only) ✅.

**Confronto report esecutore FU-039:** valori **allineati** (centerDelta 0, 3 card, C3 centrata su tutti i viewport). Unica differenza metodologica: esecutore citava `data-testid="booking-sub-tab-carousel"` (inesistente nel DOM); entrambi misurano il ramo `flex justify-center` per 1 slide.

**Non ripetuto:** C2/C4 su `trattoria-da-tommaso` (già OK revisore 05-06, per mandato).

---

## Gate 4 — Seed FU-038 (read-only DB TEST)

| Controllo | Atteso report Fase 2 | Esito MCP `execute_sql` |
|-----------|----------------------|-------------------------|
| Ambiente | `docnnernvp` | ✅ `get_project_url` conferma TEST |
| `slug` = `test` | `33333333-3333-3333-3333-333333333333` | ✅ Match |
| `is_active` / `edition` | `true` / `pro` | ✅ |
| `public_booking_page_background` | `full-03` | ✅ |
| `public_booking_strip_photo` | `""` (striscia off) | ✅ |
| Tipologia C1 | `qa_cards_mode`, presentation `cards`, 3 sottotab | ✅ JSON `booking_public_form_config` |
| Tipologia C3 | `qa_carousel_mode`, presentation `carousel`, 1 slide | ✅ `c3-carousel-unica` + 1 `carousel_items[]` |

Pagina `/prenota/test` carica senza messaggio «temporaneamente non disponibili».

---

## Gate 5 — Processo / scope

| Controllo | Esito |
|-----------|-------|
| `FOLLOW_UP.md` FU-038/039 | ✅ `fatto` |
| `FOLLOW_UP.md` FU-030 | ⚠️ Ancora **Aperto** — incoerente con accettazione visiva Matteo (24/24/79); da chiudere su «lavoro ok» |
| Scope creep (husky/hooks/Menu QR) | ✅ Nessun diff fuori mandato nel working tree |
| FU-040/041 | ✅ Opzionali, non bloccano M0 |
| Working tree committato | ⚠️ Modifiche `src/` + doc **non ancora committate** (report esecutori untracked) |

---

## Confronto claim report esecutori

| Claim | Report FU-030 Fase 1 | Report FU-038/039 Fase 2 | Revisore |
|-------|----------------------|----------------------------|----------|
| Costanti 24/24/79 | ✅ | — | ✅ Confermato codice + test |
| 482 test validate | ✅ | ✅ | ✅ Ripetuto in sessione revisione |
| Nessun touch `BookingRequestPage` | ✅ | ✅ | ✅ |
| Seed tenant `test` | — | ✅ | ✅ SQL read-only |
| C1/C3 tutti viewport OK | — | ✅ | ✅ Misura indipendente |
| Nessun diff `src/` Fase 2 | — | ✅ | ✅ |

**Discrepanza minore (non bloccante):** report FU-039 cita testid `booking-sub-tab-carousel` — il componente vive in `BookingRequestForm.tsx` senza quel testid; la QA funziona misurando il DOM reale.

---

## Problemi e gap

| ID | Gravità | Descrizione | Blocca merge M0? |
|----|---------|-------------|------------------|
| P2-01 | Processo | FU-030 resta «Aperto» in `FOLLOW_UP.md` nonostante accettazione visiva nel mandato | No — chiudere su «lavoro ok» |
| P2-02 | Processo | Working tree non committato (src + doc + report) | No — commit prima di merge/deploy |
| P2-03 | Doc/QA | `TESTING_SKILL` §7.3 cita ancora `test-pro`; slug ufficiale smoke è `test` | No — follow-up doc |
| P2-04 | Polish | Seed SQL non versionato in `supabase/scripts/` (solo MCP one-shot) | No |
| P2-05 | Polish | Fix «righe vuote» overlay compose ingredienti — **assente** nel branch | No — opzionale parallelo |
| P2-06 | Polish | FU-040 Vitest `useBookingPublicScrollRowAlign` + FU-041 report stale 05-06 | No |
| P2-07 | Scope noto Fase 1 | Edge `create-booking` senza cap server su nomi ingredienti (solo display/admin) | No — fuori scope FU-030 Fase 1, già documentato |

**P1 (bloccanti):** nessuno.

---

## Gap / fix — obbligatori vs opzionali

### Obbligatori prima di considerare M0 «chiuso» (non bloccanti qualità codice)

1. **«Lavoro ok»** → aggiornare `FOLLOW_UP.md` **FU-030 → fatto** (Matteo ha già accettato visivamente 24/24/79).
2. **Commit** del working tree Fase 1 (`src/` + doc skill + report sessione) quando richiedi «fai report finale».

### Opzionali (follow-up, non merge gate)

- FU-040 — test Vitest hook centratura + eventuale `useLayoutEffect`.
- FU-041 — allineare report stale centratura 05-06.
- Promuovere slug `test` in `TESTING_SKILL` §7.3.
- Script SQL seed versionato per tenant QA.
- Fix visivo righe vuote overlay compose (se ancora rilevante).
- Cap server ingredienti in edge `create-booking` (eventuale Fase 3).

---

## QA manuale FU-030 (compose cap)

| Superficie | Metodo revisore | Esito |
|------------|-----------------|-------|
| Clamp codice pubblico | Lettura statica + test Vitest | ✅ |
| Smoke browser compose 375/900/1256 | Non eseguito su tenant con menù ingredienti | ⬜ Delegato ad accettazione Matteo (mandato) |
| Admin contatori `MenuPricesTab` | Lettura statica | ✅ |

---

## File esaminati

- `src/features/booking/constants/bookingPrenotaTextLimits.ts`
- `src/features/booking/constants/__tests__/bookingPrenotaTextLimits.test.ts`
- `src/features/booking/components/publicBooking/BookingMenuCategoryCard.tsx`
- `src/features/booking/components/publicBooking/BookingSummarySidebar.tsx`
- `src/features/booking/components/MenuPricesTab.tsx`
- `docs/Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md` §E
- `docs/FOLLOW_UP.md`
- Report esecutori Fase 1 e Fase 2 (stessa cartella)
- DB TEST via MCP (read-only)

---

## Raccomandazioni

1. Dì **«lavoro ok»** per chiudere formalmente FU-030 e allineare `FOLLOW_UP.md`.
2. Al **«fai report finale»**, committa il batch Fase 1 + report (Fase 2 è già solo doc/DB).
3. Opzionale: una passata visiva rapida su overlay compose «righe vuote» su tenant con ingredienti reali (`trattoria-da-tommaso`) — non emersa nel branch attuale.

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.

✅ R1:

**Prompt 1 (revisione M0 FU-030 + FU-038/039, verbatim dal messaggio utente):**

> Profilo: Verifica
> Modalità: deep
> Skill da leggere: docs/Testing-Skill/TESTING_SKILL.md (§7 QA manuale) · docs/Prenota-Skill/PRENOTA_SKILL.md · docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md (§5 centratura · § card compose) · docs/Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md §E · docs/APP_CONTEXT_SKILL.md (§4 LOCK · §1b TEST vs PROD)
> Non caricare: Admin blindatura · Menu QR · Meta comunicazione
> Output attesi: (1) verdetto Approva / Approva con riserve / Rifiuta · (2) tabella gate automatico + QA indipendente · (3) report revisione in docs/Sessioni di lavoro/10-06-26/ · (4) elenco gap/fix obbligatori vs opzionali. Niente fix codice salvo bug bloccante esplicito nel mandato — segnala, non patchare.
>
> Mandato — revisione M0 Prenota (Fase 1 + Fase 2) … [report esecutori FU-030 Fase 1 + FU-038/039 Fase 2, gate 1–5, QA /prenota/test viewport 375·806·834·1256·1280 C1/C3, seed read-only, verdetto con tabella P1/P2]

**Prompt 2 (hook fine-sessione, verbatim):**

> ⚠️ FINE-SESSIONE — la sezione «Domande di chiusura» (CHIUSURA_SESSIONE §11) non è completa:
> • docs/Sessioni di lavoro/10-06-26/Report-revisione-m0-prenota-fu030-fu038-039-10-06-26.md
>   manca l'INTERA sezione 11 «Domande di chiusura» (le 6 domande ❓Q + ✅R). Aggiungila e rispondi.
> Per Q2 (dati=diff) e Q3 (file correlati) DEVI rileggere il diff e i file prima di rispondere.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.

✅ R2: Riletto `git status` + `git diff` su working tree (10 file modificati + 3 report untracked). Conferme: `BOOKING_MENU_COMPOSE_TEXT_LIMITS` con `categoryLabel`/`itemName` = `subTabLabel` (24) e `itemDescription` = `subTabDescription` (79) in `bookingPrenotaTextLimits.ts`; `clampBookingText` in `BookingMenuCategoryCard.tsx` (nome, descrizione, `displayCategoryLabel` su header chiuso/aperto/portal) e `BookingSummarySidebar.tsx` (cat + nome riga menu); `MenuPricesTab.tsx` con `maxLength`+contatore su nome prodotto, descrizione (`?? ''`), titolo categoria overlay; 2 test nuovi → **7** test nel file, **482** totali `npm run validate` (ripetuto in sessione). Fase 2: **nessun** diff `src/` — seed DB confermato MCP (`tenant_id` `33333333-…`, slug `test`, bg `full-03`, strip `""`, modalità `qa_cards_mode`/`qa_carousel_mode`). QA browser indipendente: C1 `centerDelta=0` cardCount=3, C3 `centerDelta=0` su 5 viewport. `BookingRequestPage.tsx` assente dal diff. Report allineato al diff/evidenze runtime.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).

✅ R3: **Revisione (questa sessione):** creato solo `Report-revisione-m0-prenota-fu030-fu038-039-10-06-26.md` — nessuna modifica skill/codice da revisore. **Lavoro sotto revisione (esecutore Fase 1, verificato nel diff):** `bookingPrenotaTextLimits.ts` · `bookingPrenotaTextLimits.test.ts` · `BookingMenuCategoryCard.tsx` · `BookingSummarySidebar.tsx` · `MenuPricesTab.tsx` · `PRENOTA_TEXT_LIMITS_MAP.md` §E · `PRENOTA_LAYOUT_CONTEXT.md` §8.1 · `PRENOTA_SKILL.md` §4 · `MENU_ADMIN_CONTEXT.md` §3 · `FOLLOW_UP.md` (FU-038/039 fatto; FU-030 ancora aperto). Controllati ma volutamente non toccati: `BookingRequestPage.tsx` (LOCK), `BookingRequestForm.tsx`/`BookingSubTabCarousel` (C3 senza testid — QA via DOM), edge `create-booking` (cap ingredienti fuori Fase 1). **Non aggiornato da revisore:** `TESTING_SKILL` §7.3 (slug `test` vs `test-pro`) — segnalato P2-03 come follow-up doc.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)

✅ R4: (1) **Nessun fix codice** — per mandato esplicito «segnala, non patchare» (incluso fix righe vuote overlay compose, assente nel branch). (2) **Smoke browser FU-030 compose** su tenant con ingredienti reali (`trattoria-da-tommaso` 375/900/1256) — delegato ad accettazione visiva Matteo nel mandato; revisore ha fatto solo statico + test Vitest. (3) **C2/C4** su `trattoria-da-tommaso` — esclusi (già OK 05-06). (4) **Commit/push** — non richiesti in sessione revisione. (5) **Chiusura FU-030 in FOLLOW_UP** — segnalata come azione su «lavoro ok», non eseguita dal revisore. (6) **Aggiornamento TESTING_SKILL** con slug `test` — fuori output mandato revisore.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)

✅ R5: Attrito: report esecutore FU-039 cita `data-testid="booking-sub-tab-carousel"` ma il carosello single-slide in `BookingRequestForm.tsx` non ha testid — primo tentativo QA revisore con quel selettore fallisce; serve conoscere il ramo `flex.w-full.justify-center > article`. Miglioria: in `PRENOTA_LAYOUT_CONTEXT.md` §5 aggiungere riga esplicita «C3 QA: selettore DOM ramo 1 slide, no testid carousel» + promuovere slug `test` in `TESTING_SKILL` §7.3.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?

✅ R6: Contesto **giusto** — mandato con gate numerati, skill elencate e divieto fix ha tenuto il revisore in profilo Verifica senza drift su Menu QR/Admin. Volume deep adeguato (5 skill + 2 report esecutori + MCP + Playwright). Hook `stop` su §11 mancante: **utile**, ha forzato rilettura diff per Q2/Q3; non rumore.

---

*Revisione indipendente — profilo Verifica, 10-06-26. Revisore non ha eseguito il lavoro sotto revisione.*
