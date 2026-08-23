# Mandato E2 — SK-4 legacy schema (B1 controls opzionali)

```text
Profilo: Esecuzione
Modalità: deep
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md · docs/MetaSkillSystem/PLAN_V0.md (§4-bis S4, §15) · docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md (avviso in testa + §3 identità)
Non caricare: APP_CONTEXT_SKILL.md intero · docs/_lavoro/ · src/ · adapter.mjs (slot E1)
Output attesi: chiusura bypass B1 — record nuovi con coppia legacy rifiutati in core.mjs, codice regola in rules.mjs, opzionale una fixture supplemental H-1 se G5 autorizzata; mini-report Report-sk4-e2-legacy-core-23-08-26.md; riga E2 in PLAN §9; nessun altro file; niente output in più senza chiedere Sì/No prima
```

> **Slot:** E2 · **Wave:** 1 (parallelo con E1 ed E3) · **Data:** 23-08-26 · **Branch:** `env/test`

---

## 1. Gate decisioni

Leggi:

`docs/Sessioni di lavoro/23-08-26/PLAN-CURSOR-SK-4-23-08-26.md` §3

Parti solo se **G3** (solo record nuovi) e **G5** (fixture, se la implementi) sono risolte.
Se `IN ATTESA`, fermati.

Prova baseline B1 — documenta nel report **prima** di correggere:

Costruisci capsula sintetica con `mss.session/0.1.0` + `mss-v0.1-wp0.1-freeze-1` **senza** `controls`
e lancia `npm run validate:mss` — oggi deve dare **OK** (V3 consulenza 21-08).

---

## 2. Chi sei

Esecutore **E2** di **`SK-4`**. Chiudi **solo B1**: la coppia legacy rende opzionale `controls`.

**Non tocchi** perimetro path (`adapter.mjs`, `git-adapter.mjs`, `query.mjs`). **Non tocchi** il
contratto (E3).

---

## 3. Regola del cantiere

Commento esistente in `core.mjs` ~302–303: *«lo storico 0.1.0 resta leggibile senza retro-edit»*.

Implementazione attesa (G3 raccomandata):

- **Record nuovi** (presenti in staged / non in HEAD) con coppia legacy → **deny**
- **Record storici** già committati, non modificati → **continuano a validare**

Non inventare una seconda implementazione altrove: la regola vive in **`core.mjs`**.

---

## 4. Lavoro tecnico

### 4.1 `scripts/mss/rules.mjs`

Aggiungere codice regola stabile, nome proposto:

`MSS-LEGACY-NEW-FORBIDDEN`

(messaggio: record nuovo non può usare coppia legacy; rimandare a `0.1.1`/`freeze-2`).

### 4.2 `scripts/mss/core.mjs`

1. Individuare il punto giusto nella validazione vitali / schema (righe ~280–310 e contesto staged).
2. Applicare deny per legacy-new secondo criterio G3.
3. **Non** cambiare semantica `applyAmendmentsView()` né altre regole H-1.

### 4.3 Fixture opzionale (solo se G5 = Sì)

1. Una fixture supplemental **fail** in `docs/MetaSkillSystem/fixtures/v0.1/`
2. Voce in `manifest.json` sezione `supplemental`
3. **Non** modificare hash/contenuto fixture **frozen**

---

## 5. Perimetro e divieti

| Divieto | Perché |
|---|---|
| `adapter.mjs`, `git-adapter.mjs`, `query.mjs` | E1 |
| `CONTRATTO_CAPSULA_SESSIONE_V0.md` | E3 |
| Capsule storiche nei report | append-only |
| `commit` / `push` | sì Matteo |

**Puoi scrivere in:** `core.mjs` · `rules.mjs` · `fixtures/v0.1/**` (se G5) ·
`Report-sk4-e2-*.md` · PLAN §9 riga E2.

---

## 6. Prove di chiusura E2

1. `node --check scripts/mss/core.mjs scripts/mss/rules.mjs` → exit 0
2. `npm run test:mss` → exit 0 (prima e dopo)
3. Capsula sintetica legacy-new senza `controls` → **FAIL** con codice nuovo
4. Fixture frozen invariate (hash manifest ok)

---

## 7. Mini-report e capsula

`docs/Sessioni di lavoro/23-08-26/Report-sk4-e2-legacy-core-23-08-26.md` + capsula JSONL +
Q1–Q6 verbatim. Aggiorna PLAN §9 riga **E2** → `COMPLETATO`.
