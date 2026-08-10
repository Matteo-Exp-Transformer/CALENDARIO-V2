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

F1/F2 **non** creano stub. **F3** (move `REPORT_001`) è **autorizzato** dal mandato Matteo `027`
(prompt: `docs/Sessioni di lavoro/10-08-26/Prompt-sep-11-f3-move-report001-10-08-26.md`) ma
**non ancora eseguito** in questa tree finché la chat F3 non lo fa. **SEP-G5 non PASS**.

---

## Link pre-move `REPORT_001` (B2-F01 / SEP-D09 — sanato in inventario)

Fonte completa:
`docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Addendum-M03-link-REPORT_001-B2-F01-10-08-26.md`
(supersede della sola cella `link_da_aggiornare` M03 di B1).

| Classe | Path | Azione a F3 |
|---|---|---|
| L1 operativo | `METASKILL_SYSTEM_SKILL.md` | **update link** |
| L2 operativo | `Senior-Eval-Pack/CATALOGO_SEDUTE_E_METODI_V0.md` | **update link** |
| L3 citazione | `PLAN_V0.md` | **leave-as-history** — vedi policy sotto |
| N* narrativa | MASTERPLAN / HANDOFF / questo README | update testo solo se i fatti cambiano |
| H* storica | report SEP-10/11, A1–B2 | **leave-as-history** |

### Policy `PLAN_V0` (citazione storica ≠ rewrite stato)

- `PLAN_V0` resta owner di `SYS-1`. Una riga di changelog che cita `REPORT_001` **non** autorizza
  a riscrivere gate/WP/stato «mentre» si fa F3.
- A F3 preferire **leave-as-history** (o validità via stub al path vecchio).
- Aggiornare il path dentro `PLAN_V0` richiede mandato **SYS-1** esplicito, distinto dal mandato F3.

**Inventario documentale sanato ≠ autorizzazione F3.** F3 solo con nuovo mandato Matteo.
**SEP-G5** resta non PASS.

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
- F3: mandato `027` presente; esecuzione = chat col prompt F3; **SEP-G5 non PASS**.
- Nessun rewrite di stato in `PLAN_V0` mascherato da link-fix.
