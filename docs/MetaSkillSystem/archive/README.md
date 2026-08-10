# Archive MetaSkillSystem — policy (v0 shell)

> **Stato:** F1+F2 create-only + **F3 stub attivo** (M03) · **Non è owner di stato.**
> Stato pack → `Senior-Eval-Pack/MASTERPLAN_V0.md` · Stato SYS-1 → `PLAN_V0.md`.
> Questa cartella è **indice / vista / stub**, non masterplan.

Fonte decisioni: `docs/Sessioni di lavoro/10-08-26/Report-decisioni-d1-d5-perimetro-sep11-f1-f2-10-08-26.md`
(D1=b · D2=c · D3=a · D4=a · D5=a). Piano: B1 §4–§6 · F3 eseguito in `028`.

---

## A cosa serve

- Dare un posto stabile alle **policy** di archiviazione MSS.
- Ospitare **indici puntatore** (es. `indices/MSS-REPORT-INDEX.md`) senza spostare i report seduta.
- Ospitare **osservazioni** archiviate (es. `osservazioni/REPORT_001_…`) + stub al path storico.

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
| Storia fisica report | cartelle `Sessioni di lavoro/…` | non muovere oltre mandato fase |
| Osservazioni archiviate | file sotto `archive/osservazioni/` | **sì** — contenuto spostato; stub al path vecchio |

---

## Redirect / stub (policy D5 — **stub attivo post-F3**)

Quando una fase autorizzata crea uno stub al posto di un path spostato:

1. **TTL:** 30 giorni dalla creazione dello stub.
2. **Rimozione:** dopo TTL **e** `rg` a zero hit sul path vecchio (repo + docs citati).
3. Ogni stub dichiara: path nuovo, data creazione, TTL, criterio rimozione.

**Stub attivo (F3 / M03, sessione `028`):**

| Campo | Valore |
|---|---|
| Path vecchio (stub) | `docs/MetaSkillSystem/REPORT_001_OSSERVAZIONI_ARCHITETTURALI_09-08-26.md` |
| Path nuovo | `docs/MetaSkillSystem/archive/osservazioni/REPORT_001_OSSERVAZIONI_ARCHITETTURALI_09-08-26.md` |
| Data | 10-08-2026 |
| TTL | 30 giorni (≈ 09-09-2026) |
| SEP-G5 | **non PASS** — F3 ≠ cutover |

---

## Link post-move `REPORT_001` (B2-F01 / SEP-D09 — F3 eseguito)

Fonte inventario pre-F3:
`docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Addendum-M03-link-REPORT_001-B2-F01-10-08-26.md`.

| Classe | Path | Azione F3 (`028`) |
|---|---|---|
| L1 operativo | `METASKILL_SYSTEM_SKILL.md` | **aggiornato** → path nuovo (+ stub) |
| L2 operativo | `Senior-Eval-Pack/CATALOGO_SEDUTE_E_METODI_V0.md` | **aggiornato** → path nuovo (+ stub) |
| L3 citazione | `PLAN_V0.md` | **leave-as-history** (invariato) |
| N* narrativa | MASTERPLAN / HANDOFF / questo README | aggiornati ai fatti F3 |
| H* storica | report SEP-10/11, A1–B2 | leave-as-history |

### Policy `PLAN_V0` (citazione storica ≠ rewrite stato)

- `PLAN_V0` resta owner di `SYS-1`. Una riga di changelog che cita `REPORT_001` **non** autorizza
  a riscrivere gate/WP/stato «mentre» si fa F3.
- A F3: **leave-as-history** (citazione valida anche via stub al path vecchio).
- Aggiornare il path dentro `PLAN_V0` richiede mandato **SYS-1** esplicito, distinto dal mandato F3.

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

## Struttura attuale (F1 + F3)

```text
docs/MetaSkillSystem/archive/
  README.md                 # questo file (policy)
  indices/
    MSS-REPORT-INDEX.md     # F2: indice puntatore report MSS
  osservazioni/
    REPORT_001_OSSERVAZIONI_ARCHITETTURALI_09-08-26.md   # F3
```

Stub al path storico root: `docs/MetaSkillSystem/REPORT_001_…md` (redirect D5).

**Rollback F3:** reverse `git mv` + drop stub + reverse update L1/L2 (e N* se aggiornate).
Rollback F1/F2: eliminare i file create-only sotto `archive/` (indice/README) se mai richiesto.

---

## STOP

- Nessun claim `SEP-G5` PASS.
- Nessun touch L5/L6 da fasi archive senza mandato dedicato.
- Nessun rewrite di stato in `PLAN_V0` mascherato da link-fix.
- Nessun altro move oltre M03 senza nuovo mandato.
