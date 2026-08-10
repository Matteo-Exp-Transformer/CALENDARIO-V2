# Archive MetaSkillSystem — policy (v0 shell)

> **Stato:** create-only (SEP-11 F1) · **Non è owner di stato.**
> Stato pack → `Senior-Eval-Pack/MASTERPLAN_V0.md` · Stato SYS-1 → `PLAN_V0.md`.
> Questa cartella è **indice / vista / stub futuri**, non masterplan.

Fonte decisioni: `docs/Sessioni di lavoro/10-08-26/Report-decisioni-d1-d5-perimetro-sep11-f1-f2-10-08-26.md`
(D1=b · D2=c · D3=a · D4=a · D5=a). Piano: B1 §4–§6 · B2 STOP F3 (B2-F01).

---

## A cosa serve

- Dare un posto stabile alle **policy** di archiviazione MSS.
- Ospitare **indici puntatore** (es. `indices/MSS-REPORT-INDEX.md`) senza spostare i report.
- In futuro (solo dopo gate e mandato): stub/redirect verso storia spostata — **non** in F1/F2.

---

## Livelli (cosa vive dove)

| Liv. | Contenuto | Path tipico | Regola SEP-11 |
|---|---|---|---|
| L1 | Kernel / contratti | `docs/MetaSkillSystem/*` (skill, PLAN, capsula, …) | resta; `PLAN_V0` solo con mandato SYS-1 |
| L2 | Pacchetti entry | `Senior-Eval-Pack/` | resta path; stato in MASTERPLAN |
| L3 | Viste / indici | SESSION_LOG, HANDOFF, ROADMAP, **questo archive** | viste: non possiedono gate |
| L4 | Storia report | `docs/Sessioni di lavoro/GG-MM-AA/` | **restano lì** (D3); solo puntati da indice |
| L5 | Prove tecniche | `fixtures/`, `scripts/mss/`, `tests/h1/`, matrix | **FREEZE** (D4) — fuori SEP-11 |
| L6 | Privato / sigillato | `docs/_lavoro/.../Valutazione Personale/` (+ owner) | **INTANGIBILE** — solo puntatore, mai copy |

---

## Owner (anti doppio stato)

| Cosa | Owner unico | Ruolo di `archive/` |
|---|---|---|
| Gate / WP pack SEP | `MASTERPLAN_V0.md` | nessuna |
| Gate / WP SYS-1 | `PLAN_V0.md` | nessuna |
| Continuità senior | `HANDOFF_SENIOR_V0.md` (vista) | nessuna |
| Indice report MSS (vista) | `archive/indices/MSS-REPORT-INDEX.md` | **sì** — puntatori, non stato |
| Storia fisica report | cartelle `Sessioni di lavoro/…` | non muovere in F1/F2 |

---

## Redirect / stub (policy D5 — non ancora usati in F1/F2)

Quando (e solo quando) una fase autorizzata crea uno stub al posto di un path spostato:

1. **TTL:** 30 giorni dalla creazione dello stub.
2. **Rimozione:** dopo TTL **e** `rg` a zero hit sul path vecchio (repo + docs citati).
3. Ogni stub dichiara: path nuovo, data creazione, TTL, criterio rimozione.

F1/F2 **non** creano stub. F3 (move `REPORT_001`) resta **vietato** finché non è sanato B2-F01.

---

## Freeze espliciti (non toccare da questa cartella)

**L5 (D4):**

- `docs/MetaSkillSystem/fixtures/`
- `docs/MetaSkillSystem/tests/h1/`
- `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json`
- `scripts/mss/`
- hook path-coupled legati al validator (fuori rewrite senza gate H-1.x)

**L6:**

- qualsiasi path sotto `docs/_lavoro/` (contenuti privati / Valutazione Personale)
- `.env*` (segreti; fuori dominio archive)

---

## Struttura attuale (F1)

```text
docs/MetaSkillSystem/archive/
  README.md                 # questo file (policy)
  indices/
    MSS-REPORT-INDEX.md     # F2: indice puntatore report MSS
```

Rollback F1/F2: eliminare i file creati sotto `archive/` (nessun reverse-move: non c’è stato move).

---

## STOP

- Nessun rename/move/copy di storia in F1/F2.
- Nessun claim `SEP-G5` PASS.
- Nessun touch L5/L6 da fasi archive senza mandato dedicato.
- F3 solo dopo remediation **B2-F01** + nuovo mandato Matteo.
