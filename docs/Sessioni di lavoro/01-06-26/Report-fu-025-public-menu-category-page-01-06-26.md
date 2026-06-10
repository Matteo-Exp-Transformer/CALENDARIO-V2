# Report — FU-025 esteso a PublicMenuCategoryPage (01-06-26)

**Profilo:** Esecuzione · **Modalità:** standard  
**Stato:** ✅ **lavoro ok** (Matteo 01-06-26) — QA visivo accettato · commit ⬜ (attesa «fai report finale»)  
**Validate:** 263/263 OK (run esecutore)

---

## Cosa è cambiato (per il ristoratore)

Sul **menù QR al tavolo**, quando il cliente apre una **categoria** (lista piatti/ingredienti):

| Viewport | Effetto |
|----------|---------|
| **Telefono / tablet (≤1024px)** | Come prima — colonna unica a tutta larghezza; freccia indietro e card invariati |
| **Monitor largo (>1024px)** | Header categoria + lista piatti restano in una **colonna centrata ~1024px** (stessa “larghezza tablet” della homepage QR); ai lati solo il fondo grigio chiaro (`stone-50`) |
| **Homepage QR** (regressione) | Nessun cambiamento visivo — solo codice condiviso (costante layout) |

**Dove nell'app:** pagina pubblica `/menu/{slug}/qr/{codice}/c/{chiave-categoria}` — fuori dall’admin, dopo scan QR.

---

## Cosa è stato fatto (ordine)

1. Lettura skill mirate (`PUBLIC_MENU_SKILL` §8, `PUBLIC_MENU_LAYOUT_CONTEXT`, filtri QR in DATA_FLOW).
2. **`publicMenuLayout.ts`** — `PUBLIC_MENU_CONTENT_MAX_WIDTH_CLASS` (DRY con homepage).
3. **`PublicMenuCategoryPage.tsx`** — shell `bg-stone-50` full viewport + wrapper interno su `<header>` sticky + `<main>`.
4. **`PublicMenuPage.tsx`** — refactor minimo: wrapper FU-025 usa la costante.
5. Aggiornamento skill, `FOLLOW_UP.md` (estensione FU-025), `SESSION_LOG.md`.
6. `npm run validate` — verde.
7. Report completo post **«lavoro ok»** (questo file).

**Non toccato:** `PublicMenuPresetPage`, dimensioni card (`h-44`), filtri `hidden_menu_item_ids`, admin, tema full-page sul corpo categoria (FU-019).

---

## File toccati (scope task FU-025 categoria)

| File | Modifica |
|------|----------|
| `src/features/public-menu/publicMenuLayout.ts` | **Nuovo** — costante FU-025 |
| `src/pages/PublicMenuCategoryPage.tsx` | Wrapper due livelli (header + lista) |
| `src/pages/PublicMenuPage.tsx` | Import costante sul wrapper esistente |
| `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md` | §8 `PublicMenuCategoryPage` + RULE desktop |
| `docs/per-ui-design-skill/PUBLIC_MENU_LAYOUT_CONTEXT.md` | Diagramma ASCII categoria + costante |
| `docs/FOLLOW_UP.md` | FU-025: esteso a categoria + link report |
| `docs/SESSION_LOG.md` | Indice sessione |

**Nota workspace:** in `git status` possono comparire altre modifiche non committate da sessioni parallele (es. card 30/70, glyph) — fuori scope di questo report.

---

## Tecnico (stato finale)

- **Shell esterna:** `min-h-svh bg-stone-50` — full viewport.
- **Colonna interna:** `PUBLIC_MENU_CONTENT_MAX_WIDTH_CLASS` + `min-h-svh` — avvolge header PNG tema (~56px, sticky) e main `px-4`.
- **Dati:** invariati — `usePublicMenuQr`, `menu_items` via `supabasePublic`, `hidden_menu_item_ids`, `isCategoryInQrFilter`.
- **Regola modalità deep:** non innalzata (nessun cambio homepage/footer/tema body).

---

## QA viewport

| Viewport | Atteso | Esito Matteo |
|----------|--------|----------------|
| 375px | Invariato | ✅ **lavoro ok** |
| 834px | Full width &lt;1024 | ✅ |
| 1280px+ | Colonna ~1024px, bande stone-50 | ✅ |
| Regressione home `/menu/test-pro/qr/x7zuud5` | FU-025 OK | ✅ |

Smoke suggerito in prompt: tenant `test-pro`, shortCode `x7zuud5`.

---

## Dati comunicazione

### Frasi / comandi Matteo (conteggio)

| Voce | × |
|------|---|
| Prompt esecuzione iniziale (FU-025 categoria, skill, vincoli, criteri fatto) | 1 |
| Follow-up correttivi / «non era questo» | 0 |
| **«lavoro ok»** (+ richiesta analisi flusso prompt / statistiche skill system) | 1 |
| «spiegamelo semplice» / «fai report finale» / «dammi follow up» | 0 |

### Cronologia prompt (annotati)

| # | Prompt (sintesi) | Intento | Esito agente |
|---|------------------|---------|--------------|
| P0 | Esecuzione standard: estendere FU-025 a `PublicMenuCategoryPage`; DRY `publicMenuLayout.ts`; due livelli shell/wrapper; non preset/admin/card size; skill + FOLLOW_UP + report; validate; regola deep se serve homepage/footer | Implementazione layout desktop categoria | ✅ 1 turno codice + doc; validate 263 |
| P1 | «lavoro ok» + analisi flusso prompt, efficienza, statistiche per comunicazione/skill | Chiusura task + dati revisore | ✅ report completo (questo file) |

### Follow-up fuori prompt iniziale

**Nessuno** — accettazione al primo giro implementativo. Nessuna iterazione UX tra P0 e P1.

### Voci Liv.2 applicate

| Voce | Esito |
|------|--------|
| «lavoro ok» → report completo + no commit | ✅ |
| Analisi prompt / statistiche per skill system | ✅ § sotto |
| «fai report finale» / commit | ⬜ non richiesti |

### Pattern / procedure

- Prompt P0 **molto strutturato**: riferimento esplicito a FU-025/home, architettura due livelli, lista «NON fare», URL smoke, modalità standard vs deep.
- **Zero domande** agente → esecuzione diretta.
- Matteo chiude con **«lavoro ok»** senza correzioni intermedie → prompt P0 sufficiente per scope dichiarato.

---

## Analisi flusso prompt, efficienza e statistiche (skill system)

### 1. Statistiche sessione

| Metrica | Valore |
|---------|--------|
| Messaggi utente sostanziali | **2** (P0 esecuzione, P1 lavoro ok) |
| Turni agente con modifica codice | **1** |
| Turni solo report / chiusura | **1** (P1) |
| Domande agente → Matteo | **0** |
| Correzioni esplicite («non era questo») | **0** |
| Follow-up richiesti da Matteo (fuori P0) | **0** |
| `npm run validate` | **1** esecuzione, **263 OK** |
| File codice nuovi/modificati (task) | **3** (+ 4 doc) |
| Commit / push | **no** (regola «lavoro ok») |
| Innalzamento modalità deep | **no** (regola prompt rispettata) |

### 2. Anatomia prompt principale (P0)

| Blocco | Presente |
|--------|----------|
| Profilo + modalità (`Esecuzione` / `standard`) | ✅ |
| Skill puntuali + «Non caricare» | ✅ |
| Obiettivo + effetto cliente | ✅ |
| Riferimento codice (home vs categoria) | ✅ |
| Architettura attesa (2 livelli) + DRY costante | ✅ |
| Vincoli / cosa NON fare (lista esplicita) | ✅ |
| Superfici smoke (tabella viewport) | ✅ |
| Tenant / URL test (`test-pro`, `x7zuud5`) | ✅ |
| Criterio fatto (validate, skill, FOLLOW_UP, report) | ✅ |
| Regola deep condizionale | ✅ |

**Indice completezza stimato:** **10/10** — confrontabile al miglior template sessioni 01-06-26 (card 30/70, ordine categorie).

### 3. KPI efficienza

| KPI | Valore | Nota |
|-----|--------|------|
| Turni codice fino ad accettazione | **1** | Nessun rework |
| Rapporto messaggi utente / turni codice | 2:1 | P1 solo chiusura |
| Domande / turno codice | 0 | |
| Rework post-implementazione | 0 | |
| Token prompt P0 | Alto | Giustificato: estensione pattern noto, vincoli stretti |
| Tempo agente stimato | Basso | Pattern già su home; solo wrap + estrazione const |

**Confronto sessione card 30/70 (stesso giorno):** quella aveva **2 follow-up** (P1 polish, P2 icona) → **3 turni codice**. Questa sessione FU-025 categoria è **più efficiente** (1 turno) perché scope meccanico (wrapper CSS) e pattern già documentato su homepage.

### 4. Cosa non è successo in chat

| Assenza | |
|---------|---|
| Playwright / browser MCP smoke | ⬜ non richiesto in P0 |
| Commit / push | ⬜ atteso «fai report finale» |
| Iterazioni visive post-P0 | — Matteo ha accettato al primo giro |
| Estensione a `PublicMenuPresetPage` | escluso in P0 |
| `useMenuPageBackgroundStyle` su categoria | escluso (FU-019) |

### 5. Lettura qualità (dati agente — non voto revisore)

| Area | Osservazione |
|------|----------------|
| **Chiarezza prompt P0** | Eccellente: obiettivo misurabile, riferimento FU-025 esistente, file target, anti-scope esplicito, regola deep. |
| **Skill system** | Caricamento mirato (3 doc, no APP_CONTEXT) sufficiente; aggiornamento §8 + LAYOUT + FOLLOW_UP coerente. |
| **Efficienza esecuzione** | Estrazione `publicMenuLayout.ts` evita divergenza 1024/1025; nessuna duplicazione logica dati. |
| **Comunicazione** | Un solo scambio operativo + chiusura; aderente a profilo Esecuzione standard. |
| **Affidabilità** | Rischio basso: solo layout; regressione home limitata a sostituzione className con costante. |

### 6. Cosa replicare / migliorare (candidati revisore)

| Proposta | Destinazione suggerita |
|----------|------------------------|
| Template handoff «Estendi FU-025 a pagina X» con blocchi P0 (shell / wrapper / costante / non fare) | `PREPARA_PROMPT_SKILL` o esempio in `PUBLIC_MENU_SKILL` |
| In `PUBLIC_MENU_SKILL` §8: link esplicito a `publicMenuLayout.ts` per ogni pagina `/menu/*` che userà freeze | skill §8 (micro) |
| Segnalare che task «estensione pattern già fatto» tendono a **1 turno + lavoro ok** se prompt come P0 | `OSSERVAZIONI.md` |
| Dopo estensione categoria, unico debito noto: `PublicMenuPresetPage` (FU-019 / FU-025) | `FOLLOW_UP.md` (già FU-019) |

---

## Storage / dati

Invariati: `menu_items`, `menu_qr_codes` (`theme_key`, `hidden_menu_item_ids`, `category_filter`), `menu_categories.label` — solo CSS layout.

---

## Commit

Nessun commit in questa sessione («lavoro ok» — commit su richiesta «fai report finale»).
