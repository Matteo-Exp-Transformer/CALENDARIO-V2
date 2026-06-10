# Report FU-038 / FU-039 — Prenota centratura Fase 2 (10-06-26)

## Cappello

- **Cosa è cambiato:** su DB TEST esiste il tenant smoke **`test`** (`/prenota/test`) con sfondo pagina intera, tipologia **3 card** (C1) e tipologia **carosello 1 slide** (C3); QA browser Playwright conferma centratura su tutti i viewport richiesti.
- **Cosa resta:** **FU-030** aperto (prova cap menù Fase 1 — accettazione Matteo); FU-040/041 invariati (polish hook / report stale 05-06).
- **Serve una tua azione:** sì — revisione visiva opzionale su `/prenota/test`; «lavoro ok» se la Fase 2 ti basta.

---

## Obiettivo

M0 Fase 2: **FU-038** seed smoke TEST slug `test` · **FU-039** QA browser C1/C3 su `/prenota/test` (viewport 375 / 806 / 834 / 1256 / 1280). Nessuna modifica codice cap FU-030.

**Branch:** `env/test` · **DB:** TEST `docnnernvp` (verificato via `get_project_url` prima di ogni write).

---

## FU-038 — Seed smoke TEST

### Verifica ambiente

| Controllo | Esito |
|-----------|-------|
| `get_project_url` | `https://docnnernvpyrbwuzzach.supabase.co` → **TEST** `docnnernvp` ✅ |
| PROD `rwuxgvld` | **Non toccato** |

### Tenant creato

| Campo | Valore |
|-------|--------|
| **tenant_id** | `33333333-3333-3333-3333-333333333333` |
| **slug** | `test` |
| **name** | QA Prenota Centratura |
| **edition** | `pro` |
| **is_active** | `true` |
| **URL pubblico** | `http://localhost:5173/prenota/test` (dev) · `https://<app>/prenota/test` (deploy) |

### Config `restaurant_settings`

| Chiave | Valore | Note |
|--------|--------|------|
| `public_booking_page_background` | `full-03` | Sfondo pagina intera |
| `public_booking_strip_photo` | `""` | Striscia **off** (stringa vuota NOT NULL) |
| `restaurant_name` | QA Prenota Centratura | Header pubblico |
| `booking_time_slots_enabled` | `false` | Minimo funzionale |
| `business_hours` / contatti | Valori QA | Footer Orari/Contatti |

### Tipologie per QA

| ID caso | Tipologia (`booking_modes[].id`) | Label UI | `sub_tabs_presentation` | Sottotab per test |
|---------|----------------------------------|----------|-------------------------|-------------------|
| **C1** | `qa_cards_mode` | Opzioni menù (cards) | `cards` | **3 card** manuali: `c1-card-alpha`, `c1-card-beta`, `c1-card-gamma` (titolo + descrizione + `courses_label` + prezzo) |
| **C3** | `qa_carousel_mode` | Offerta carosello (1 slide) | `carousel` | **1 sottotab** `c3-carousel-unica` con **1 slide** (`carousel_items[0].image_url` foto pubblica storage TEST) |

**Selezione in pagina:** clic tipologia «Opzioni menù (cards)» → C1 · clic «Offerta carosello (1 slide)» → C3.

**Non alterato:** `trattoria-da-tommaso` (tenant C2/C4 già OK revisore 05-06).

---

## FU-039 — QA browser C1 / C3

**Ambiente:** `npm run dev` · Playwright MCP · tenant `test` · layout full-page `full-03`, striscia off.

**Metodo misura (allineato revisore 05-06):**
- **C1 (≤3 card):** `data-testid="booking-sub-tab-cards"` → gruppo 3 card vs outer `overflow-x-auto`; `centerDelta` centro gruppo vs outer; se `overflows` → `firstLeftGap` prima card.
- **C3 (1 slide):** ramo `flex w-full justify-center`; `centerDelta` slide vs container.

| ID | Caso | 375 | 806 | 834 | 1256 | 1280 |
|----|------|-----|-----|-----|------|------|
| **C1** | Tipologia cards **3** sottotab — gruppo **centrato** | OK | OK | OK | OK | OK |
| **C3** | Carosello **1** slide — slide **centrata** | OK | OK | OK | OK | OK |

### Note per cella

**C1 ✅ (tutti i viewport):** 3 card, `overflows=false`, `centerDelta=0`, `firstLeftGap=0`, inner `w-full justify-center`. A **806px** il gruppo **entra** in colonna (outer ~720px) — centrato; regola overflow «prima card a sinistra» non applicabile (nessun overflow con 3 card).

**C3 ✅ (tutti i viewport):** ramo single-slide, `centerDelta=0`, container `flex w-full justify-center`.

**Elementi adiacenti (spot 1280px):** tipologie ✅ · header «QA Prenota Centratura» ✅ · form `#booking-request-form` ✅ · testo riepilogo presente ✅ · layer full-page `100lvh` ✅ · striscia assente ✅. Nessuna regressione visibile rilevata.

**Non ripetuto:** C2/C4 su `trattoria-da-tommaso` (già chiusi 05-06).

---

## Cosa è stato fatto (cronologia)

1. Verificato branch `env/test` e ambiente MCP TEST (`docnnernvp`).
2. Inserito tenant `test` + `restaurant_settings` minima (config JSON `booking_public_form_config` con modalità C1/C3).
3. Smoke `/prenota/test` — pagina carica, nessun «Prenotazioni temporaneamente non disponibili».
4. QA Playwright C1/C3 su 5 viewport.
5. `npm run validate` verde su `src/`.
6. Report Fase 2 + chiusura FU-038/FU-039 in `FOLLOW_UP.md`.

**Non toccato:** codice `src/` (cap FU-030, layout card/carosello già in branch), PROD, Menu QR, husky/hooks, FU-040/041.

---

## File toccati

| File | Perché |
|------|--------|
| `docs/Sessioni di lavoro/10-06-26/Report-fu-038-039-prenota-centratura-fase2-10-06-26.md` | Report Fase 2 (questo file) |
| `docs/FOLLOW_UP.md` | FU-038, FU-039 → **fatto** |
| DB TEST `organizations` + `restaurant_settings` | Seed tenant `test` (via MCP `execute_sql`, non file repo) |

---

## Test eseguiti

| Comando / strumento | Esito |
|---------------------|--------|
| `get_project_url` (pre-write) | TEST `docnnernvp` ✅ |
| Playwright MCP — `/prenota/test` C1/C3 × 5 viewport | Tutti **OK** |
| `npm run validate` | **OK** — lint + typecheck + **482** test (56 file) |

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| Nessuno | — | Nessuna modifica layout/comportamento in `src/`; seed solo DB + doc follow-up/report. Slug `test` documentato in questo report (requisito FU-038). |

---

## Dati comunicazione

- **Prompt Matteo:** mandato Fase 2 unico — profilo Esecuzione, modalità deep, skill PRENOTA + LAYOUT §5 + TESTING §7 + APP §1b/§7; output enumerati (seed, tabella QA, report, FOLLOW_UP, validate); divieto scope creep senza Sì/No; FU-030 resta aperto; no commit salvo «fai report finale».
- **Formato efficace:** tabella viewport obbligatoria + ID C1/C3 + slug `test` esplicito hanno guidato seed e misure senza ambiguità Prenota vs Menu QR.
- **Automatizzabile:** script SQL seed versionato in `supabase/scripts/` (non richiesto in questa sessione — seed via MCP one-shot).

---

## Analisi flusso prompt, efficienza e statistiche

- **Prompt sostanziali Matteo:** 1 (mandato Fase 2 completo).
- **Correzioni post-1ª risposta:** 0.
- **Follow-up chiusi:** FU-038, FU-039.
- **Modalità:** deep (da prompt).
- **Skill caricate:** PRENOTA_SKILL, PRENOTA_LAYOUT_CONTEXT §5, TESTING_SKILL §7, APP_CONTEXT §1b/§7.

---

## La tua lettura della sessione

- Il prerequisito Fase 1 (cap 24/24/79) non è stato toccato — sessione pulita solo seed + QA, come da mandato.
- Il buco processo del ciclo 05-06 (slug `test` assente) si chiude con tenant dedicato senza toccare `trattoria-da-tommaso`.
- **Suggerimento (dato):** promuovere slug `test` in `TESTING_SKILL` §7.3 al posto di `test-pro` obsoleto — evita 406 su QA futuri.

---

## Derivazione errori

- **Primo script Playwright C1 `found:false`** — selettore pensato per ramo ≥4 card scrollabile; con 3 card il DOM usa `w-full justify-center` senza `data-testid` outer dedicato. Risolto con misura su `[data-testid="booking-sub-tab-cards"]`. Causa: **errore agente** (selettore incompleto), non bug prodotto.

---

## Follow-up

| ID | Stato dopo sessione |
|----|---------------------|
| FU-030 | **Aperto** — prova cap menù Fase 1; in attesa accettazione Matteo |
| FU-038 | **Fatto** — seed `test` su TEST |
| FU-039 | **Fatto** — tabella C1/C3 compilata |
| FU-040 / FU-041 | Invariati (aperti) |

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.

✅ R1:

**Prompt 1 (Fase 2 FU-038/039, verbatim dal messaggio utente):**

> Profilo: Esecuzione
> Modalità: deep
> Skill da leggere: docs/Prenota-Skill/PRENOTA_SKILL.md · docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md (§5 card/carosello centratura) · docs/Testing-Skill/TESTING_SKILL.md (§7 QA browser) · docs/APP_CONTEXT_SKILL.md (§1b TEST vs PROD · §7 chiusura)
> Non caricare: rifare cap menù Fase 1 · Menu QR · Admin blindatura · Meta comunicazione
> Output attesi: (1) seed DB TEST slug test FU-038 · (2) tabella QA browser C1/C3 su /prenota/test FU-039 · (3) report Fase 2 in docs/Sessioni di lavoro/10-06-26/ · (4) FOLLOW_UP FU-038/039 chiusi · (5) npm run validate verde su src/. Niente output in più senza chiedere Sì/No prima.
>
> Obiettivo — M0 Fase 2 / FU-038 + FU-039
> Prerequisito: Fase 1 (FU-030 cap menù 24/24/79) revisionata OK dal prepara-prompt. Non modificare i cap salvo bug bloccante.
> Branch: env/test. FU-038 seed smoke TEST slug test. FU-039 QA browser C1/C3 viewport 375/806/834/1256/1280.
> Chiusura: su «lavoro ok» — skill §7.2 se tocchi doc centratura · NON commit salvo «fai report finale».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.

✅ R2: Nessun diff `src/` in questa sessione. Rileverificato: `git branch --show-current` → `env/test`; MCP `get_project_url` → TEST; SQL post-insert → `tenant_id` `33333333-3333-3333-3333-333333333333`, slug `test`, bg `full-03`, strip `""`; Playwright raw JSON (centerDelta 0, cardCount 3, centered true su tutti i viewport); `npm run validate` → **482** test, exit 0. Report allineato a evidenze runtime, non a diff codice.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).

✅ R3: Aggiornati solo `FOLLOW_UP.md` (FU-038/039 fatto) e questo report. Skill layout centratura (`PRENOTA_LAYOUT_CONTEXT.md` §5) **non** ritoccata — nessun cambio comportamento in `src/`. `TESTING_SKILL` §7.3 ancora cita `test-pro`: non aggiornato (fuori output espliciti; slug `test` documentato qui). Codice `BookingSubTabCards.tsx` / `BookingRequestForm.tsx` riletto per interpretare misure C1 (ramo ≤3 `w-full justify-center`) — coerente con QA OK.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?

✅ R4: (1) **FU-030** — lasciato aperto per istruzione esplicita. (2) **Commit/push** — non richiesti. (3) **C2/C4** su `trattoria-da-tommaso` — esclusi dal mandato. (4) **FU-040/041** — fuori scope. (5) **Script SQL versionato** per seed `test` in `supabase/scripts/` — seed solo MCP (sufficiente per smoke QA). (6) **Aggiornamento TESTING_SKILL §7.3** con slug `test` — documentato in report, non in skill file. (7) **SESSION_LOG.md** — non aggiunto (output attesi non lo elencavano).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?

✅ R5: Attrito: primo QA C1 falliva perché la skill §5 descrive outer/inner/hook per ≥4 card, ma ≤3 usa ramo statico — il revisore 05-06 aveva già notato «innerRef non collegato». Miglioria: in `PRENOTA_LAYOUT_CONTEXT.md` §5 aggiungere riga «≤3 card: misura QA su `data-testid="booking-sub-tab-cards"`, inner `w-full justify-center`» + slug TEST ufficiale `test` in `TESTING_SKILL` §7.3.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?

✅ R6: Contesto **giusto** — elenco «Non caricare» ha evitato rifare FU-030/Menu QR. TESTING §7 + report revisione 05-06 hanno fornito template tabella e metodo misura. Nessun hook `stop` in questa sessione (report scritto con §11 completa in un passaggio). APP §1b ha impedito write su PROD.
