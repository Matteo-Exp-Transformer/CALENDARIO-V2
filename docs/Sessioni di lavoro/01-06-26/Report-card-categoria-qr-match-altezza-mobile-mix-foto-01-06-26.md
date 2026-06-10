# Report — Card categorie QR senza foto: altezza mobile in griglia mista (aspect 7/2)

**Data:** 01-06-26  
**Modalità:** standard · **Profilo:** Esecuzione  
**Stato:** ✅ **lavoro ok** (Matteo) — commit ⬜ (attesa «fai report finale»)

---

## Cosa è cambiato (per il ristoratore)

Sulla **homepage del menù QR** (`/menu/:slug/qr/:shortCode`), quando nella griglia ci sono **categorie con foto e senza foto**:

| Viewport | Effetto |
|----------|---------|
| **&lt;520px** (1 colonna) | Le card **senza foto** hanno ora la **stessa altezza** delle card **con foto** (prima restavano più basse con solo `min-h-[64px]`). Layout interno invariato: 30% icona bianca + 70% fascia tema. |
| **≥520px** (2 colonne) | **Invariato** — già allineate con `aspect-[5/2]`. |
| **Solo categorie senza foto** in griglia | **Invariato** — `min-h-[64px]` mobile, `min-h-[72px]` da 520px. |

**Dati coinvolti:** `menu_qr_codes.category_images` (JSON per QR) — se almeno una categoria ha thumb, scatta `matchPhotoTileHeight` su tutte le card senza foto.

---

## File toccati

| File | Modifica |
|------|----------|
| `src/pages/PublicMenuPage.tsx` | `CategoryCard` → `noPhotoRowClass` con `aspect-[7/2]` sotto 520px quando `matchPhotoTileHeight`; JSDoc aggiornato |
| `docs/per-ui-design-skill/PUBLIC_MENU_LAYOUT_CONTEXT.md` | Tabella `CategoryCard`: aspect mobile + mix foto documentati |

**Report sessione:** questo file.

**Non toccati:** LOCK, griglia globale, DB, hook, `categoryHeaderBackgroundStyle.ts`, pagina categoria.

---

## Dati comunicazione

### Frasi / comandi Matteo (conteggio)

| Voce | × |
|------|---|
| Prompt esecuzione iniziale (profilo, skill, tabella stato attuale, anti-regressione ≥520px) | 1 |
| **«lavoro ok»** (+ richiesta analisi flusso prompt / efficienza / statistiche skill system) | 1 |
| Follow-up visivo / correzione scope | 0 |
| «spiegamelo semplice» / «fai report finale» / «dammi follow up» | 0 |

### Cronologia / prompt di Matteo (annotati)

| # | Prompt (sintesi / verbatim) | Intento | Esito agente |
|---|----------------------------|---------|--------------|
| P0 | Esecuzione standard: allineare altezza card senza foto a quelle con foto su mobile (&lt;520) in griglia mista; estendere `matchPhotoTileHeight` con stessi aspect 7/2 e 5/2; non regressare tablet/desktop; skill PUBLIC_MENU_* + UI_RESPONSIVE; regola deep se LOCK/refactor; mockup opzionale (troncato) | Fix gap CSS mirato | ✅ 1 turno codice + doc layout; nessuna domanda |
| P1 | «lavoro ok» + report completo con analisi flusso prompt, efficienza, statistiche per comunicazione e skill system | Chiusura task + dati revisore | ✅ questo report |

### Follow-up fuori prompt iniziale

**Nessuno.** Task chiuso al primo giro implementativo. Il prompt P0 conteneva già tabella «stato attuale vs desiderato» e vincolo anti-regressione ≥520px — sufficiente per patch minima senza iterazioni UX.

### Voci Liv.2 applicate

| Voce | Esito |
|------|--------|
| «lavoro ok» → report completo + no commit | ok (questo report) |
| Analisi prompt / efficienza / statistiche | ok (§ sotto) |
| Altri Liv.2 | non attivati |

### Pattern / procedure

- Prompt P0 **eredita contesto sessione precedente** (layout 30/70, report 30-70) senza ripetere tutto lo scope — **efficiente**.
- Tabella breakpoint **riduce ambiguità** (cosa cambiare solo mobile vs cosa lasciare).
- Riferimento a report sessione precedente + mockup opzionale = ancoraggio visivo senza obbligo di aprire file.

---

## Analisi flusso prompt, efficienza e statistiche (skill system)

### 1. Statistiche sessione

| Metrica | Valore |
|---------|--------|
| Messaggi utente sostanziali | **2** (P0, P1) |
| Turni agente con modifica codice | **1** |
| Turni solo report / comunicazione | **1** (P1) |
| Domande agente → Matteo | **0** |
| Correzioni esplicite («non era questo» / «rifai») | **0** |
| Follow-up richiesti da Matteo (fuori P0) | **0** |
| `npm run validate` | **non eseguito** in chat (patch CSS 2 righe classi) |
| Righe codice effettive cambiate | **~3** (`noPhotoRowClass` + commento JSDoc) |
| File doc aggiornati | **1** (`PUBLIC_MENU_LAYOUT_CONTEXT.md`) |
| Commit / push | **no** (regola «lavoro ok») |
| Modalità innalzata a deep | **no** |

### 2. Anatomia prompt principale (P0)

| Blocco | Presente |
|--------|----------|
| Profilo + modalità | ✅ Esecuzione standard |
| Skill puntuali (3 file, no APP_CONTEXT intero) | ✅ |
| Obiettivo misurabile (mix foto, &lt;520px, 1 col) | ✅ |
| Stato attuale in tabella (gap esplicito: `min-h-[64px]` vs `aspect-[7/2]`) | ✅ |
| Anti-regressione ≥520px | ✅ |
| File target (`PublicMenuPage.tsx`, `CategoryCard`) | ✅ |
| Regola modalità deep se LOCK/refactor griglia | ✅ (non innalzata) |
| Criterio validate / smoke esplicito | ⬜ assente |
| URL QR / tenant di test | ⬜ assente |

**Indice completezza stimato:** **8/10** — ottimo per task CSS circoscritto; mancano solo validate/smoke opzionali (basso rischio).

### 3. KPI efficienza

| KPI | Valore | Nota |
|-----|--------|------|
| Turni codice fino a accettazione | **1** | Nessun rework |
| Rapporto LOC / turno | **Altissimo** | 1 riga logica classi (+ doc) |
| Domande / turno codice | **0** | |
| Token prompt P0 | **Medio-alto** | Giustificato da tabella stato + vincoli breakpoint |
| Follow-up post-P0 | **0** | Contrasto con sessione 30/70 (2 follow-up polish) |
| Tempo revisione Matteo stimato | **Basso** | Verifica visiva mobile mix foto |

**Confronto sessioni stesso filone (01-06-26 Menu QR):**

| Sessione | Turni codice | Follow-up | Domande |
|----------|--------------|-----------|---------|
| Layout 30/70 + polish | 3 | 2 | 0 |
| **Match altezza mobile mix foto** (questa) | **1** | **0** | **0** |

### 4. Cosa non è successo in chat

| Assenza | |
|---------|---|
| `npm run validate` | non richiesto in P0 |
| Playwright / browser MCP | non richiesto |
| Aggiornamento mockup HTML (`mockup-menu-qr-card-categoria-mobile.html`) | citato opzionale, troncato in P0 — non fatto |
| Commit / push | atteso «fai report finale» |
| Touch LOCK / refactor griglia | no |

### 5. Lettura qualità (dati agente — non voto revisore)

| Area | Osservazione |
|------|----------------|
| **Chiarezza prompt P0** | Molto alta: il gap era già formulato come differenza classi Tailwind; soluzione implicita (`aspect-[7/2]` su `noPhotoRowClass`). |
| **Skill system** | Caricamento mirato adeguato; `PUBLIC_MENU_LAYOUT_CONTEXT` aggiornato per coerenza doc/codice. `UI_RESPONSIVE_SKILL` citata ma non necessaria lettura completa per patch 1 riga. |
| **Efficienza esecuzione** | Rimozione `min-h-[64px]` + `h-full` quando `matchPhotoTileHeight` — allineamento simmetrico alle tile con foto senza side effect su ramo «solo senza foto». |
| **Comunicazione** | Risposta agente P0: tabella prima/dopo + dove vive in app — aderente a skill comunicazione. |
| **Affidabilità** | Rischio basso: tablet già usava `aspect-[5/2]`; solo estensione pattern esistente a &lt;520px. |

### 6. Cosa replicare / migliorare (candidati revisore)

| Proposta | Destinazione suggerita |
|----------|------------------------|
| Template prompt «fix aspect matchPhotoTileHeight» con tabella stato attuale (modello P0) | `PREPARA_PROMPT_SKILL` o `PROPOSTE.md` |
| In `PUBLIC_MENU_LAYOUT_CONTEXT` § `CategoryCard`: mantenere tabella viewport ↔ aspect (già aggiornata) | skill layout ✅ |
| Per micro-fix CSS: «validate opzionale se solo classi Tailwind» | `TESTING_SKILL` / checklist lavoro ok |
| Segnalare che prompt **continuazione** (riferimento report 30-70) abbrevia contesto senza perdere precisione | `OSSERVAZIONI.md` |

---

## Tecnico (stato finale)

**Componente:** `CategoryCard` in `PublicMenuPage.tsx` (griglia homepage sotto tab sticky).

**Logica:**

```ts
matchPhotoTileHeight = categories.some(cat => categoryImages[cat.key])
```

**Classi `noPhotoRowClass`:**

| `matchPhotoTileHeight` | Classi |
|------------------------|--------|
| `true` (mix foto) | `flex aspect-[7/2] w-full overflow-hidden min-[520px]:aspect-[5/2]` |
| `false` (solo senza foto) | `flex h-full min-h-[64px] w-full overflow-hidden min-[520px]:min-h-[72px]` |

**Con foto (invariato):** `aspect-[7/2]` → `min-[520px]:aspect-[5/2]`.

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `PUBLIC_MENU_LAYOUT_CONTEXT.md` | § `CategoryCard` — aspect mobile in mix foto | Allineare doc a codice |

*`PUBLIC_MENU_SKILL.md` non aggiornato — delta minore; opzionale micro-nota in §8 se revisore lo richiede.*

---

## Commit

Nessun commit in questa sessione («lavoro ok» — commit su «fai report finale»).
