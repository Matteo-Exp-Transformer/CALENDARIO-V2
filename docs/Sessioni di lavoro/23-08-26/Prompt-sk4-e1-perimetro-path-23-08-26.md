# Mandato E1 — SK-4 perimetro path (B2 sotto-cartella + B3 prefisso)

```text
Profilo: Esecuzione
Modalità: deep
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md · docs/MetaSkillSystem/PLAN_V0.md (§4-bis S4, §15, §16) · docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md (§2 dove vive)
Non caricare: APP_CONTEXT_SKILL.md intero · docs/_lavoro/ · src/ · TESTING_SKILL (non è il tuo slot)
Output attesi: chiusura bypass B2+B3 su perimetro path — export costante condivisa da adapter.mjs, git-adapter allineato, query.mjs importa la costante (solo questo su query.mjs); mini-report Report-sk4-e1-perimetro-path-23-08-26.md; aggiornamento riga E1 in PLAN §9; nessun altro file; niente output in più senza chiedere Sì/No prima
```

> **Slot:** E1 · **Wave:** 1 (parallelo con E2 ed E3) · **Data:** 23-08-26 · **Branch:** `env/test`

---

## 1. Prima di scrivere codice

```bash
npm run mss:status
```

Leggi il piano owner e verifica che **G1, G2 e G6** in §3 siano `AUTORIZZATE`:

`docs/Sessioni di lavoro/23-08-26/PLAN-CURSOR-SK-4-23-08-26.md`

Se una decisione è ancora `IN ATTESA DI MATTEO`, **fermati** e segnala al coordinatore.

Baseline **senza correggere** — registra numeri nel mini-report:

```bash
git ls-tree -r --name-only HEAD -- "docs/Sessioni di lavoro" | findstr /i "Report-"
```

Conta quanti path hanno **più di un livello** sotto la cartella-data (es.
`10-08-26/SEP-10-archiviazione/Report-…`) e quanti oggi **non** matchano il regex attuale di
`adapter.mjs` riga 13.

---

## 2. Chi sei e cosa NON è questo mandato

Sei l'**esecutore E1** del pacchetto **`SK-4`**. Chiudi **solo** i bypass di **perimetro path**:

- **B2:** report in sotto-cartella invisibili al pre-commit
- **B3:** prefisso `Verbale-` (se G2 autorizzata) fuori perimetro

**Non sei E2** (legacy / `core.mjs`). **Non sei E3** (contratto). **Non sei SK-11** (refactor
importabilità di `query.mjs`).

---

## 3. Regola del cantiere

Non inventare numeri. Un dato mancante si misura con un comando. **D18:** se la regola path esiste
già in `adapter.mjs`, **esportala** — non duplicarla in `git-adapter.mjs` o `query.mjs`.

Su `query.mjs` tocchi **solo**:

- import della costante esportata da `adapter.mjs`
- rimozione del regex locale (riga ~49)
- eventuali commenti SK-4 allineati

⛔ Vietato refactor CLI, export test, `buildVistaEffettiva`, larghezza colonne, ecc.

---

## 4. Lavoro tecnico

### 4.1 `scripts/mss/adapter.mjs`

1. Sostituire `REPORT_RE` con il pattern approvato in PLAN §3 (default se G1+G2):
   `/^docs\/Sessioni di lavoro\/.+\/(Report|Verbale)-.*\.md$/i`
2. **Esportare** la costante (nome proposto: `REPORT_PATH_RE`) e aggiornare `isMssRelevantPath()`.
3. Nessun'altra regola contrattuale in questo file.

### 4.2 `scripts/mss/git-adapter.mjs`

1. `collectGitHeadHistory()` deve filtrare con **`isMssRelevantPath()`** importato da `adapter.mjs`.
2. Eliminare il regex duplicato righe ~114–116.

### 4.3 `scripts/mss/query.mjs`

1. Importare `REPORT_PATH_RE` (o export equivalente) da `adapter.mjs`.
2. Rimuovere definizione locale del regex.
3. Verificare che `npm run mss:query -- --verifica` still runs (exit 0) — solo smoke, non prova di chiusura.

---

## 5. Perimetro e divieti

| Divieto | Perché |
|---|---|
| `core.mjs`, `rules.mjs`, contratto | slot E2 / E3 |
| Capsule storiche | append-only |
| `commit` / `push` | solo con sì Matteo |
| Fixture H-1 | slot E2 se G5 |
| `docs/MetaSkillSystem/tests/tools/**` | SK-11 |

**Puoi scrivere in:** `adapter.mjs` · `git-adapter.mjs` · `query.mjs` (solo §4.3) ·
`docs/Sessioni di lavoro/23-08-26/Report-sk4-e1-*.md` · riga E1 in PLAN §9.

---

## 6. Prove di chiusura E1

1. `node --check scripts/mss/adapter.mjs scripts/mss/git-adapter.mjs scripts/mss/query.mjs` → exit 0
2. Conteggio report nel nuovo perimetro vs vecchio (comando + numeri nel report)
3. `git diff --stat` mostra **solo** i tre file `.mjs` ammessi (+ tuo report/plan)

Non dichiarare chiuso `SK-4` — solo il tuo slot.

---

## 7. Mini-report e capsula

Scrivi `docs/Sessioni di lavoro/23-08-26/Report-sk4-e1-perimetro-path-23-08-26.md`:

- obiettivo, baseline, diff, prove, cosa non fatto
- capsula JSONL: schema/revision da `rules.mjs` righe 3–6, UUIDv7, `segment_no: 1`, `self_report`
- sezione **Domande di chiusura** Q1–Q6 verbatim (`CHIUSURA_SESSIONE.md` §11)

Aggiorna riga **E1** in `PLAN-CURSOR-SK-4-23-08-26.md` §9 → `COMPLETATO` con link al report.

---

## 8. Handoff

Al termine, il coordinatore può lanciare **E4 integrazione** quando anche E2 ed E3 sono completi.
