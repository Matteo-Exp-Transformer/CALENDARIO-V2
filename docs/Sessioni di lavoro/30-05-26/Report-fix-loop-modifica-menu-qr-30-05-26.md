# Report fix — Loop modale Modifica Menù QR (30-05-26)

**Data:** 30-05-26  
**Profilo:** Esecuzione · **Modalità:** light  
**Commit:** *(non ancora committato — solo working tree)*  
**Test:** `npm run validate` — **227 OK**  
**QA Matteo:** **OK** — «non vedo più errore in console» aprendo Modifica su QR esistente  
**Revisione:** rapida (prepara-prompt / chat ciclo) — **Approva ✅** — vedi § Revisione  

---

## In 3 righe

- **Cosa è cambiato:** aprendo **Modifica** (matita) su un Menù QR, il modale «Impostazione Menù QR» si apre **stabile** — niente più warning ripetuti in console; titoli/descrizioni override si caricano dopo la lettura da DB.
- **Cosa resta:** altri file della feature usano ancora `data = []` su query React Query (debito minore, non bloccante); nessuna migrazione DB.
- **Serve una tua azione:** no per questo fix — opzionale smoke su Salva modifica e «Nuovo QR» se vuoi chiudere al 100%.

---

## Sintesi per Matteo (schermata + effetto)

| Dove nell'app | Prima | Dopo |
|---------------|-------|------|
| **Admin → tab Menu → Gestione QR → icona matita** | Appena si apriva il modale, la console si riempiva di errori e React poteva bloccarsi | Modale **aperto subito**, console **pulita** |
| **Sezione «Titoli e descrizioni categorie»** | Stesso intento (override per QR) ma sync instabile durante il caricamento | Dopo il fetch, campi popolati con override da `menu_qrcode_categories` se presenti |
| **«Nuovo QR»** | Già OK (non passava dal ramo modifica) | **Invariato** — nessuna regressione segnalata |

**Percorso UI:** `MenuPricesTab` → `MenuQrManager` → modale `MenuQrModal` (titolo «Impostazione Menù QR»).

---

## Causa (semplice)

Quando modifichi un QR, il modale legge gli override titolo/descrizione per categoria dalla tabella **`menu_qrcode_categories`** (hook `useMenuQrcodeCategoriesForQr`).

Finché la query non ha finito, `data` è `undefined`. Il codice usava `data: overrides = []`: quel `[]` è un **array nuovo a ogni render**. Un `useEffect` (solo in **modifica**) dipendeva da `overrides` e chiamava `setOverrideDrafts` → re-render → nuovo `[]` → loop infinito → messaggio «Maximum update depth exceeded».

**Perché solo Modifica e non Nuovo QR:** l’effect problematico ha `if (!editing) return`. In creazione QR un effect separato gestisce i draft senza quella dipendenza instabile.

---

## Fix applicato

**File:** `src/features/booking/components/MenuQrModal.tsx`

| Intervento | Effetto |
|------------|---------|
| Costanti `EMPTY_OVERRIDES` e `EMPTY_MENU_ITEMS` fuori dal componente | Stesso riferimento array quando i dati non ci sono ancora |
| `overrides = overridesData ?? EMPTY_OVERRIDES` | Niente più `[]` effimero nelle dipendenze |
| Sync override in modifica solo con `isSuccess` (`overridesLoaded`) | `setOverrideDrafts` una volta a query completata, non a ogni render |

**Storage coinvolto (solo lettura nel modale):**

| Tabella | Cosa contiene per questo bug |
|---------|------------------------------|
| `menu_qr_codes` | Nome QR, filtro categorie, carosello, tema, immagini homepage, piatti nascosti |
| `menu_qrcode_categories` | Override **per quel QR**: `category_key`, `title`, `description` |
| `menu_categories` / `menu_items` | Checkbox categorie e card ingredienti nel modale |

Salvataggio invariato: solo al click **Salva** → `useSaveMenuQrSettings` in `MenuQrManager`.

---

## Test eseguiti

| Check | Esito |
|-------|-------|
| `npm run validate` (lint + tsc + 227 test) | **OK** |
| QA Matteo — Modifica QR, apertura modale | **OK** — nessun errore console |
| QA Matteo — Nuovo QR / Salva | Non ripetuto in questa sessione (regressione non segnalata) |
| Migrazioni DB | **Nessuna** |
| Revisione codice (grep + diff) | **OK** — fix allineato a causa root; `npm run validate` ripetuto in revisione **227 OK** |

---

## Revisione (rapida — post-esecutore)

**Esito: Approva ✅**

| Controllo | Esito | Nota |
|-----------|-------|------|
| Causa root (`data = []` → dep instabile riga ~139) | ✅ | Coerente con stack e con fix (`EMPTY_*` + `overridesLoaded`) |
| Fix minimo, niente refactor salvataggio | ✅ | Solo `MenuQrModal.tsx` (+ import tipo) |
| Gate `isSuccess` prima di sync override | ✅ | Evita setState durante fetch; dopo success usa dati stabili |
| Scope (no pubblico, no FU-018/019, no DB) | ✅ | |
| `npm run validate` | ✅ | 227 test |
| QA Matteo console Modifica | ✅ | Confermato in chat esecutore |

**Residui non bloccanti (non fixati in sessione):**

- `MenuQrManager.tsx` e `MenuHomepageConfigPanel.tsx` usano ancora `data: categories = []` — non hanno causato questo loop perché l’effect a riga 139 dipendeva da `overrides`, non da `categories`. Debito opzionale se emerge altro warning.
- Nel working tree ci sono anche diff **non legati** a questo bug (`docs/APP_CONTEXT_SKILL.md`, `docs/Marketing-Skill/MARKETING_SKILL.md`, aggiornamento FU-021 temi): **non includerli nel commit del fix loop** salvo richiesta esplicita di Matteo.

**Checklist controllo (Matteo)**

- [x] Tab Menu → Menu QR → **Modifica**: console pulita all’apertura
- [ ] **Nuovo QR**: modale senza errori (non ripetuto — basso rischio)
- [ ] **Salva** dopo modifica titoli/descrizioni categorie (smoke opzionale)
- [x] `npm run validate`

---

## Scope rispettato

- ✅ Fix minimo sync state / dipendenze stabili  
- ✅ Nessuna modifica pagine pubbliche `/menu/.../qr/...`  
- ✅ Nessuna UI `content_type` / preset staff (FU-018)  
- ✅ Nessuna migrazione DB  
- ✅ Nessun touch a TenantContext LOCK  

---

## File di skill aggiornati (§7.2)

| File | Modifica | Perché |
|------|----------|--------|
| `docs/SESSION_LOG.md` | Riga sessione + link report | Indice |
| `docs/Comunicazione-Skill/OSSERVAZIONI.md` | Blocchi esecutore + prepara-prompt + revisione | Dati comunicazione §7 |
| `docs/Sessioni di lavoro/30-05-26/Report-fix-loop-modifica-menu-qr-30-05-26.md` | Report + § Revisione + Dati comunicazione estesi | Chiusura ciclo |
| `MENU_ADMIN_CONTEXT.md` / `PUBLIC_MENU_SKILL.md` | — | **Non aggiornati** — nessun invariante nuovo (§7.2: fix sync state) |
| `docs/APP_CONTEXT_SKILL.md` / `MARKETING_SKILL.md` | Diff in working tree | **Fuori scope** fix loop — altra sessione (feature flag / temi) |

---

## Follow-up

| ID | Stato | Nota |
|----|-------|------|
| **FU-022** | Aperto | Invariato — seed QR su TEST |
| **FU-018 / FU-019 / FU-021** | Aperti | Invariati — fuori scope |
| Pattern `= []` su altre query | *Opzionale* | Es. `MenuHomepageConfigPanel.tsx` (`useMenuCategories`); non aperto FU — solo se emerge altro loop |

---

## Dati comunicazione

> Sezione obbligatoria §7.1 — include **tutto il ciclo** (prepara-prompt in Ask → esecutore → revisione in Agent).

### Cronologia richieste di Matteo (questa chat / ciclo)

| # | Fase | Richiesta (senso, non solo stack) | Esito |
|---|------|-----------------------------------|--------|
| 1 | **Prepara (Ask)** | Analizza bug da console (`Maximum update depth`, `MenuQrModal.tsx:139`); spiega cosa chiedere all’agente; **prompt copia-incolla** seguendo `PREPARA_PROMPT_SKILL.md` | Prompt light + checklist; causa `= []` su override |
| 2 | **Prepara (Ask)** | «**solo modifica**» — errori **appena** apre modale (non Nuovo QR) | Prompt aggiornato con riproduzione precisa |
| 3 | **Prepara (Ask)** | «**ridammi prompt completo**» + **annota** che ha dovuto dirgli solo-modifica/subito-apertura **per non copiare male il prompt** | Prompt unico con blocco **Nota da Matteo** in testa |
| 4 | **Esecutore** | (prompt incollato) fix loop | `MenuQrModal.tsx` + report esecutore |
| 5 | **Esecutore** | QA: «ok non vedo più errore in console» | Chiusura tecnica OK |
| 6 | **Revisione (Agent)** | «agente ha finito — **revisiona** e **aggiorna report finale**; **comunicazione non dimenticarla**; **segna cosa ti ho chiesto in questa chat**» | Questo § + § Revisione |

### Frasi / richieste ricorrenti

| Frase | × | Esito |
|-------|---|--------|
| Stack trace console + «cosa chiedere ad agente» | 1 | Prepara-prompt: analisi + prompt strutturato |
| Correzione riproduzione: «solo modifica» / «subito all’apertura» | 1 | **Critica** — senza non si distingue ramo `editing` vs Nuovo QR |
| «ridammi prompt completo» + nota anti-copia sbagliata | 1 | Blocco **Nota da Matteo** nel prompt — pattern da ripetere |
| «revisiona e aggiorna report finale» + comunicazione + cronologia chat | 1 | Report esteso (questa sezione) |
| «sei esecutore» + prompt preparato | 1 | Fix al primo giro |
| «ok non vedo più errore in console» | 1 | QA positivo |

### Spiegazioni che hanno funzionato (verso Matteo)

- **Dove:** Admin → tab **Menu** → **Gestione QR** → modale **Impostazione Menù QR** (`MenuQrModal`).
- **Effetto:** in **Modifica** (matita) la console non esplode più; il ristoratore può configurare il QR.
- **Storage:** override titolo/descrizione per categoria su quel QR → tabella **`menu_qrcode_categories`** (lettura nel modale; salvataggio al Salva).
- **Perché solo Modifica:** l’effect che sincronizza gli override ha `if (!editing) return` — in **Nuovo QR** non passa da lì.

### Cosa NON è successo / debiti comunicazione

- Matteo **non** ha chiesto commit in questa chat revisione.
- Smoke **Nuovo QR** e **Salva** dopo modifica non ripetuti (regressione non segnalata).
- Prepara-prompt **non** ha letto `src/` (regola skill) — analisi stack + pattern noto `= []`; esecutore ha confermato in codice.

### Procedure ripetute (candidate automazioni)

| Pattern | Certezza | Azione suggerita |
|---------|----------|------------------|
| React Query `data: x = []` in dep di `useEffect` | Alta | Nel prompt fix: obbligo `EMPTY` modulo-level o `isSuccess` |
| Dettagli riproduzione (solo create/edit, timing) | Alta | Sezione **Nota da Matteo** nel prompt se non deducibili dallo stack |
| «Prompt completo» dopo correzioni incremental | Media | Sempre ridare blocco unico, non solo delta |

### Voci Liv.2 / VOCABOLARIO

- **Prepara prompt** (filtro a monte) — usato implicitamente via `PREPARA_PROMPT_SKILL.md`.
- **Revisione rapida** — stimata a monte; eseguita a valle in chat Agent.

### Derivazione errori

| # | Cosa | Causa | Come si evita |
|---|------|-------|----------------|
| 1 | Loop console Modifica QR | **bug preesistente** — `overrides = []` default in `MenuQrModal` + effect sync | Costante `EMPTY_*` + gate query success |
| 2 | Rischio prompt incompleto | **prompt ambiguo** se manca «solo modifica / subito apertura» | Nota esplicita Matteo nel prompt (chiesto da lui) |
| 3 | — | **nessun errore agente** sul fix — implementazione corretta | — |

---

## Verdetto sessione

**Chiuso ✅** — bug Modifica QR risolto; revisione Approva; QA console OK; validate verde.

**Ciclo chat:** puoi chiudere questa conversazione a livello tecnico. Resta opzionale: commit solo `MenuQrModal.tsx` + report/docs (`git add -f` per `docs/`); non mischiare commit con diff Marketing/temi nello stesso working tree.
