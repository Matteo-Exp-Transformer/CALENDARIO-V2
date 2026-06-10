# Report — Card categorie QR senza foto (layout 30/70 + rifiniture)

**Data:** 01-06-26  
**Modalità:** standard · **Profilo:** Esecuzione  
**Stato:** ✅ **lavoro ok** (Matteo) — QA visivo residuo opzionale · commit ⬜ (attesa «fai report finale»)

---

## Cosa è cambiato (per il ristoratore)

Sulla **homepage del menù QR** (`/menu/:slug/qr/:shortCode`), categorie **senza foto** nel modale QR:

| Viewport | Effetto |
|----------|---------|
| **&lt;1025px** | Card a **riga**: ~30% icona grande (colore **tema**), ~70% fascia **immagine/colore header** del tema con **titolo centrato** (testo leggermente più grande) + freccia. **Nessuna** descrizione. |
| **≥1025px** | Invariato: miniatura + titolo + descrizione; icona senza foto colorata col tema. |
| **Con foto** | Invariato ovunque (hero + titolo su immagine). |

**Griglia:** 1 col &lt;520 · 2 col 520–1024 · 2 col ≥1025 (card orizzontale desktop).

**Bug risolto (tablet 2 col):** in riga con una card con foto più alta, lo sfondo tema ora **riempie** tutta la fascia destra (`cover` + altezza piena), non più solo un angolo in alto.

---

## File toccati

| File | Modifica |
|------|----------|
| `src/features/public-menu/categoryHeaderBackgroundStyle.ts` | **Nuovo** — `categoryHeaderBackgroundStyle` (pagina categoria) + `categoryCardNoPhotoBackgroundStyle` (`cover`, card) |
| `src/pages/PublicMenuPage.tsx` | `CategoryCard` 30/70, `theme`, testo centrato, `h-full` griglia, `accentColor` icona |
| `src/pages/PublicMenuCategoryPage.tsx` | Import modulo condiviso |
| `src/features/public-menu/MenuQrCategoryIconGlyph.tsx` | Prop opzionale `style` (colore tema) |
| `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md` | §8 + RULE card senza foto |
| `docs/SESSION_LOG.md` | Riga sessione |

**Report sessione:** questo file.

---

## Dati comunicazione

### Frasi / comandi Matteo (conteggio)

| Voce | × |
|------|---|
| Prompt esecuzione iniziale (scope, breakpoint, skill, criteri fatto) | 1 |
| Follow-up UX/bug (testo centro, sfondo tablet, testo più grande) | 1 |
| Follow-up colore icona tema | 1 |
| **«lavoro ok»** (+ richiesta analisi prompt/statistiche) | 1 |
| «spiegamelo semplice» / «fai report finale» / «dammi follow up» | 0 |

### Cronologia / prompt di Matteo (annotati)

| # | Prompt (sintesi / verbatim) | Intento | Esito agente |
|---|----------------------------|---------|--------------|
| P0 | Esecuzione standard: card senza foto 30/70 &lt;1025, con foto/≥1025 invariati, `categoryHeaderBackgroundStyle` condiviso, skill §8, validate, report lavoro ok, fallback se casino | Implementazione feature V3 post-verifica | ✅ 1 turno codice + skill; validate 263 |
| P1 | «ottimo» + centro testo card senza foto, testo più grande + **bug** tablet 520–1024 sfondo solo angolo (DOM path allegato) | Rifinitura + fix griglia/stretch/cover | ✅ 1 turno; nessuna domanda |
| P2 | «ottimo» + colorare icona con colore paletta tema | Coerenza visiva con tab/carosello | ✅ 1 turno; `accentColor` + `style` su glyph |
| P3 | «ottimo lavoro. lavoro ok» + analisi flusso prompt + annotare follow-up **non** nel prompt iniziale ma **allineati** a quanto chiede | Chiusura task + dati revisore | ✅ report completo |

### Follow-up fuori prompt iniziale (nota esplicita Matteo)

Matteo ha chiesto **due iterazioni** (P1, P2) **non specificate** nel prompt P0. Sono state trattate come **allineate all’intento prodotto** (qualità visiva card senza foto + coerenza tema), non come correzioni di scope errato:

- **P1** — polish UX + bug reale su tablet (altezza riga griglia + `background-size`).
- **P2** — estensione naturale del tema già passato a `CategoryCard`.

Nessun «casino» → fallback 30/70 sotto/non applicato.

### Voci Liv.2 applicate

| Voce | Esito |
|------|--------|
| «lavoro ok» → report completo + no commit | ok (questo report) |
| «compila report comunicazione + annota prompt» | ok |
| Altri Liv.2 | non attivati |

### Pattern / procedure

- Prompt P0 **molto strutturato** (profilo, skill esplicite, anti-scope, criteri validate, fallback) → **zero domande**.
- Matteo usa **feedback incrementale** («ottimo» + delta) invece di riscrivere il prompt: efficiente per lui, 2 turni extra per agente ma **basso rework** (nessun revert layout).
- Allegato **DOM path + dimensioni** su P1 → diagnosi rapida (stretch griglia + `100% auto`).

---

## Analisi flusso prompt, efficienza e statistiche (skill system)

### 1. Statistiche sessione

| Metrica | Valore |
|---------|--------|
| Messaggi utente sostanziali | **4** (P0–P3) |
| Turni agente con modifica codice | **3** |
| Turni solo report | **1** (P3) |
| Domande agente → Matteo | **0** |
| Correzioni esplicite («non era questo») | **0** |
| Follow-up richiesti da Matteo (fuori P0) | **2** |
| `npm run validate` | **≥3** esecuzioni, tutte **263 OK** |
| File codice toccati | **4** (+ 1 nuovo modulo) |
| Commit / push | **no** (regola «lavoro ok») |

### 2. Anatomia prompt principale (P0)

| Blocco | Presente |
|--------|----------|
| Profilo + modalità | ✅ Esecuzione standard |
| Skill puntuali (no APP_CONTEXT intero) | ✅ |
| Obiettivo + breakpoint | ✅ |
| Fuori scope | ✅ |
| Criterio fatto (validate, smoke, skill §8) | ✅ |
| Fallback se risultato «casino» | ✅ |
| Regola modalità deep se ≥1025/DB/LOCK | ✅ (non innalzata) |

**Indice completezza stimato:** **9/10** (manca solo URL QR di test esplicito; smoke descritto genericamente).

### 3. KPI efficienza

| KPI | Valore | Nota |
|-----|--------|------|
| Turni codice fino a «accettabile» | 1 (P0) | P1/P2 = miglioramenti, non rework da errore |
| Rework post-accettazione | 0 scope | Solo polish + bugfix |
| Domande / turno codice | 0 | |
| Token prompt P0 | Alto | Giustificato: evita 1–2 giri domande |
| Rapporto follow-up / prompt iniziale | 2:1 | **Normale** per UI visiva; Matteo conferma allineamento |

Confronto: superiore a sessioni con prompt vago (es. solo «sistema card QR»); in linea con sessioni 01-06 deep Menu QR (0 domande).

### 4. Cosa non è successo in chat

| Assenza | |
|---------|---|
| Playwright / browser MCP smoke | ⬜ non richiesto in P0 |
| Commit / push | ⬜ atteso «fai report finale» |
| Mockup HTML aggiornato | fuori scope P0 |
| Applicazione fallback layout alternativo | non necessario |
| Modalità deep innalzata | non richiesta |

### 5. Lettura qualità (dati agente — non voto revisore)

| Area | Osservazione |
|------|----------------|
| **Chiarezza prompt P0** | Eccellente: vincoli misurabili, distinzione griglia vs layout interno card, file target. |
| **Skill system** | Caricamento mirato (`PUBLIC_MENU_SKILL` §8, DATA_FLOW parziale) sufficiente; §8 aggiornato a fine P0. |
| **Efficienza esecuzione** | P0 chiuso in un giro; P1 risolto con modulo stile dedicato (`categoryCardNoPhotoBackgroundStyle`) senza proliferare varianti. |
| **Comunicazione** | Matteo: feedback breve + DOM; agente: risposte sintetiche per schermata — aderente a `COMUNICAZIONE_UTENTE_SKILL`. |
| **Affidabilità** | Rischio iniziale `100% auto` su cella alta documentato in report; fix P1 coerente con pagina categoria (due helper). |

### 6. Cosa replicare / migliorare (candidati revisore)

| Proposta | Destinazione suggerita |
|----------|------------------------|
| Template «card pubblica senza foto» con 30/70 + `cover` + `h-full` griglia in PREPARA_PROMPT | `PROPOSTE.md` |
| In `PUBLIC_MENU_SKILL` RULE: icona senza foto = `accentColor` | skill §8 (micro-aggiornamento) |
| Prompt P0 tipo: includere «smoke viewport 520–1024 con mix foto/no foto» | `PREPARA_PROMPT_SKILL` |
| Segnalare che follow-up visivi post-OK sono **pattern Matteo**, non fallimento prompt | `OSSERVAZIONI.md` ✅ (sotto) |

---

## Tecnico (stato finale)

- `theme` da `menu_qr_codes.theme_key` → `CategoryCard`.
- Senza foto &lt;1025: `categoryCardNoPhotoBackgroundStyle` (`cover`, `center`).
- Pagina categoria: `categoryHeaderBackgroundStyle` (`100% auto`, `center top`) — invariato.
- Icona: `theme.accentColor` via `MenuQrCategoryIconGlyph` `style`.

**Validate finale:** `npm run validate` — **263 test OK**.

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `PUBLIC_MENU_SKILL.md` | §8 griglia + 2 RULE | Documentare layout senza foto e griglia |

*(Icona `accentColor` non ancora in skill — candidato micro-fix sopra.)*

---

## Commit

Nessun commit in questa sessione («lavoro ok» — commit su «fai report finale»).
