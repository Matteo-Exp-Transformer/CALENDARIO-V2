# Report ciclo — Temi sfondo Menu QR (prepara prompt → asset → deploy)

**Data:** 30-05-26  
**Modalità:** standard (prepara-prompt light + esecuzione standard/deep asset)  
**Profilo:** Meta (prompt) → Esecuzione (codice + asset + git)  
**Commit:** `2fc7e9b` su `main` e `env/test` (push OK)  
**Test:** `npm run validate` — 227 OK (pre-commit)  
**DB TEST:** migrazione `041` applicata via MCP  
**DB PROD:** migrazione `041` **applicata** 30-05-26 (`menu_qr_theme_green_wellness` su `rwuxgvld`)  

---

## In 3 righe (milestone M2)

- **Cosa è cambiato:** il cliente sul menu QR vede **5 temi** selezionabili dall’admin; la **homepage usa un solo sfondo lungo** (body); la **barra in categoria** usa l’header; PNG di test installati + fix codice.
- **Cosa resta:** QA visivo scroll lungo mobile/tablet su **PROD**; footer compatto ~1/4 (FU-021); eventuale rigenerazione asset se grana/formato non bastano.
- **Serve una tua azione:** sì — smoke sui 5 temi dopo hard refresh; conferma visiva prima di considerare FU-021 chiuso.

---

## Sintesi per Matteo (schermata + effetto)

| Dove | Prima | Dopo |
|------|-------|------|
| **Modale «Impostazione Menù QR» → Tema** | 4 pulsanti, sfondo home = header+body sovrapposti | **5 pulsanti** (+ Green Wellness); scelta tema → salva su `menu_qr_codes.theme_key` |
| **Home menu QR** (cliente) | Header PNG in fascia alta + body sotto (errato) | **Un solo PNG body** su tutta la pagina (scroll ripetuto se lungo) |
| **Categoria aperta** (Antipasti, ecc.) | Header PNG crop ~56px | Invariato — **solo header PNG** sulla barra sticky |
| **Storage** | `public/menu-themes/{tema}-body.png` + `{tema}-header.png` | Stesso schema; 5 coppie attive |

---

## Cronologia sessione

1. **Prepara prompt** — prompt v1→v3 per generatore esterno (2 PNG/idea, mobile-first, zone scoperte). Report: [Report-prepara-prompt-temi-sfondo-menu-qr-30-05-26.md](Report-prepara-prompt-temi-sfondo-menu-qr-30-05-26.md).
2. **Test asset batch 1** — coppie numerate 1+2, 3+4, 5+6 installate; Matteo: immagine non va bene (16:9 corto, header in home).
3. **Fix codice** — `PublicMenuPage`: solo `bodyImage` in homepage; `headerImage` solo in `PublicMenuCategoryPage`.
4. **Batch 2** — coppie a/b/c/d; rimosso dark gold (d); mappatura 4 temi + green-wellness spare.
5. **Matteo:** home = 1 immagine, header solo categoria — conferma fix codice.
6. **Green Wellness** — quinto tema + migrazione `041` + push `main` / `env/test`.

---

## Mappa asset finale

| Tema (`theme_key`) | Home `*-body.png` | Categoria `*-header.png` | Origine batch |
|--------------------|-------------------|---------------------------|---------------|
| `mediterranean_teal` | sketch menu à la carte | lavagna scura | 1 + 2 |
| `cream_sage` | sketch variant | lavagna variant | 3 + 4 |
| `dark_gold` | pomodori/basilico | fascia chiara | b |
| `rustic_terracotta` | olive / mattonelle | mediterraneo | c |
| `green_wellness` | avocado / microgreens | wellness chiaro | a |

File sorgente rinominati in `docs/Sessioni di lavoro/30-05-26/immagini test pagina QRMENU/` con naming `{tema}-body/header.png`.

---

## File toccati (perché)

| Area | File | Effetto ristoratore |
|------|------|-------------------|
| Homepage QR | `src/pages/PublicMenuPage.tsx` | Sfondo coerente: una sola immagine lunga, non header tagliato in alto |
| Temi | `src/features/public-menu/menuThemes.ts` | Quinto tema Green Wellness + commenti body/header |
| Asset | `public/menu-themes/*.png` | Anteprima visiva per ogni tema nel menu cliente |
| DB | `supabase/migrations/041_*.sql` | Permette di salvare `green_wellness` sul QR |
| Doc layout | `PUBLIC_MENU_LAYOUT_CONTEXT.md` | Allineata regola body-only home |

---

## Test eseguiti

- `npm run validate` — OK (227 test) prima del commit `2fc7e9b`.
- QA browser Matteo — test asset batch 1 **KO** (formato/copertura); batch 2 + fix codice — **da confermare** su 5 temi.
- Migrazione `041` — applicata su **TEST** e **PROD** (30-05-26, MCP prod).

---

## File di skill aggiornati (§7.2)

| File | Modifica | Perché |
|------|----------|--------|
| `docs/per-ui-design-skill/PUBLIC_MENU_LAYOUT_CONTEXT.md` | §1 body-only home + tabella 5 temi | Allineamento post-fix asset |
| `docs/Sessioni di lavoro/30-05-26/Report-prepara-prompt-*.md` | Report fase prompt | §7.1 ciclo |
| `docs/Sessioni di lavoro/30-05-26/Report-ciclo-temi-sfondo-*.md` | Questo report | §7.1 chiusura ciclo |
| `docs/SESSION_LOG.md` | +righe sessione | Indice |
| `docs/FOLLOW_UP.md` | FU-021 aggiornato | Debito asset parziale |
| `docs/Comunicazione-Skill/OSSERVAZIONI.md` | Blocco sessione + pattern | Dati revisore |
| `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md` | — | **Non aggiornato** — delta coperto da LAYOUT_CONTEXT; aggiornare se si formalizza regola body/header in skill entry |

---

## Derivazione errori

| Tipo | Cosa | Evitare |
|------|------|---------|
| **prompt ambiguo** | v2 prepara-prompt: 3 PNG e header separato categoria non richiesti | Chiedere Sì/No su numero file prima di consegnare |
| **errore agente** | Installazione asset: header usato anche in home (codice pre-esistente + mapping non chiarito a Matteo) | Dopo fix prodotto esplicito «home=body, categoria=header» in skill layout |
| **vincolo strutturale** | PNG 16:9 → ~200px altezza body su 375px | Prompt generatore: body ≥3600px altezza; doc dimensioni in FU-021 |
| **bug preesistente** | `themePageBackgroundStyle` accoppiava header+body in homepage | Risolto in `2fc7e9b` |

---

## Follow-up

| ID | Stato | Nota |
|----|-------|------|
| **FU-021** | Aperto (parziale) | Asset test integrati + fix body-only + PROD `041` ✅; restano: QA scroll PROD, footer ~1/4, eventuale nuovo giro generazione PNG |
| **FU-022** | Aperto | Invariato — seed QR su TEST |

---

## Dati comunicazione

### Frasi / richieste ricorrenti

| Frase | × | Esito |
|-------|---|--------|
| «prepara prompt» / `@PREPARA_PROMPT_SKILL.md` | 1 | Prompt v3 consegnato |
| «non aggiungere cose non richieste» / «non 3 immagini» | 1 | Riformulazione prompt — **ok** |
| «spiegami in parole semplici» + componente + storage | 2 | Tabella zone scoperte + schermata cliente |
| «immagine non va bene» (test batch 1) | 1 | Nuovo prompt v4 + batch 2 asset |
| «home solo 1 immagine, header solo categoria» | 1 | Fix codice stessa sessione |
| «fai report sessione / comunicazione» | 2 | Report prepara + questo ciclo |
| «merge env/test e push main e env» | 1 | `2fc7e9b` push OK |
| «le altre foto? pulsanti tema» | 1 | Green Wellness aggiunto |

### Cronologia prompt Matteo (annotati)

1. Prepara prompt sfondi menu QR mobile, 5 idee, zone scoperte, screenshot ref.
2. Footer 1/4, header categoria diverso → correzione «solo 2 PNG».
3. Report sessione prepara-prompt.
4. Test coppia Mediterranean — «non va bene».
5. Prompt alleggerito generatore esterno (no file repo).
6. Nuove immagini coppie numeriche → install + rename.
7. «Header in home errato» → chiarimento prodotto.
8. Rimuovi dark gold, mappa a/b/c, rename coerente.
9. Tutte le foto? → Green Wellness + push.
10. Report finale comunicazione + skill.

### Spiegazioni che hanno funzionato

- Tabella **home vs categoria** + quale PNG (`body` / `header`).
- «Margini 16px = dove si vede lo sfondo» (prepara-prompt).
- Mappa coppie **dispari=body, pari=header** dopo errore mapping.

### Pattern nuovi (candidati PROPOSTE)

| Pattern | Proposta |
|---------|----------|
| Menu QR asset: **home = body only, category = header only** | RULE in `PUBLIC_MENU_LAYOUT_CONTEXT.md` ✅ già aggiornato; citare in `PUBLIC_MENU_SKILL.md` §8 |
| Prepara-prompt asset: chiedere **mapping file→schermata** esplicito | Nota in `PREPARA_PROMPT_SKILL` o ERRORI_PROCESSO |
| Checklist smoke temi: **5 radio in modale + hard refresh + scroll categoria** | Checklist revisore Menu QR |

### Cosa non è successo in chat

- Migrazione `041` su **PROD** non applicata.
- Footer `MenuFooterCard` ~1/4 non implementato.
- QA formale 375/834/1280 non documentato in tabella revisore.
- `PUBLIC_MENU_SKILL.md` entry non aggiornata (solo LAYOUT_CONTEXT).
- Conferma esplicita «ok funziona» su batch 2 asset non ricevuta.

### Token / processo

- Prepara-prompt v1 troppo lungo; v3/v4 più snelli dopo correzione Matteo.
- Ciclo lungo in una chat: prepara → test → fix → asset → deploy; report unificato utile.

---

## Stato finale

**Ciclo task:** completo a livello tecnico (`2fc7e9b` pushato, validate OK, report + skill layout).  
**Resta:** PROD migration `041`, QA visivo Matteo, chiusura parziale FU-021.

**Review:** `docs/Sessioni di lavoro/30-05-26/Report-ciclo-temi-sfondo-menu-qr-30-05-26.md` · `docs/SESSION_LOG.md` · `docs/FOLLOW_UP.md`
