# Addendum M03 — superficie link `REPORT_001` (B2-F01 / SEP-D09)

> **Tipo:** rettifica documentale pre-F3 · **Non è** esecuzione F3 · **Non riscrive** B1 in silenzio.
> **Supersede (solo cella):** `link_da_aggiornare` di B1 §5 riga **M03**.
> **Fonte debito:** B2 § finding B2-F01 + §6 punto 4.
> **Sessione:** `SEP-SES-20260810-026` · Meta remediation · 10-08-2026.
> **Git al momento inventario:** `env/test` · HEAD `6336c19` (D2 già committed) · ahead 3.

---

## 1. Cosa chiude questo addendum

Chiude il debito **HIGH B2-F01 / SEP-D09**: elenco completo dei riferimenti vivi a
`REPORT_001_OSSERVAZIONI_ARCHITETTURALI_09-08-26.md` (path/nome) + policy esplicita su `PLAN_V0`.

**Non** autorizza F3. **Non** sposta file. **Non** dichiara `SEP-G5` PASS.

---

## 2. Target fisico (invariato)

| Campo | Valore attuale |
|---|---|
| Path corrente | `docs/MetaSkillSystem/REPORT_001_OSSERVAZIONI_ARCHITETTURALI_09-08-26.md` |
| Destinazione proposta (B1 M03, non eseguita) | `docs/MetaSkillSystem/archive/osservazioni/REPORT_001_…` + stub al path vecchio |
| Stub / TTL | policy D5: TTL 30gg + `rg` zero sul path vecchio **dopo** creazione stub (non in questa seduta) |

---

## 3. Inventario `rg` (escluso `docs/_lavoro/**`)

Comando di riferimento: `rg -n --glob '!docs/_lavoro/**' 'REPORT_001' docs .cursor scripts package.json`

### 3.a Riferimenti operativi / owner (superficie F3)

| # | Path referenziante | Tipo ref | Contesto breve | Azione prevista a F3 | Rischio owner |
|---|---|---|---|---|---|
| L1 | `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` | routing / nome file | Ordine di lavoro §6: «leggere `REPORT_001_…md`. Non usarlo come stato.» | **update link** → path nuovo **o** stub al path vecchio | alto se link morto (entry MSS) |
| L2 | `docs/MetaSkillSystem/Senior-Eval-Pack/CATALOGO_SEDUTE_E_METODI_V0.md` | fonte storica path | Record catalogo: `Fonte: docs/MetaSkillSystem/REPORT_001_…md` | **update link** al path post-move (o stub) | medio (catalogo storia) |
| L3 | `docs/MetaSkillSystem/PLAN_V0.md` | citazione registro storico | Changelog 09-08-26: path `REPORT_001_…md` | **leave-as-history** (vedi §4); **vietato** rewrite stato SYS-1 | alto se si tocca owner SYS-1 senza mandato |

### 3.b Riferimenti narrativi pack / policy (aggiornare testo solo se F3 cambia fatti)

| # | Path referenziante | Tipo ref | Contesto breve | Azione prevista a F3 | Rischio owner |
|---|---|---|---|---|---|
| N1 | `docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md` | nome / STOP | «Vietato … F3/move `REPORT_001`» | **update** narrativa post-F3 (fatto move) | basso (owner pack) |
| N2 | `docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md` | nome / STOP | STOP su move finché B2-F01 + mandato | **update** handoff post-F3 | basso (vista) |
| N3 | `docs/MetaSkillSystem/archive/README.md` | policy | F3 vietato finché B2-F01; stub D5 | **update** policy post-F3 (stub attivo) | basso (vista archive) |

### 3.c Riferimenti storici di sessione (non patchare come link vivi)

| # | Path referenziante | Tipo ref | Azione a F3 |
|---|---|---|---|
| H1 | `SEP-10-archiviazione/Report-B1-sintesi-piano-migrazione.md` | piano M03 + menzioni | **leave-as-history** (+ questo addendum supersede cella link) |
| H2 | `SEP-10-archiviazione/Report-B2-review-piano-migrazione.md` | finding B2-F01 | **leave-as-history** |
| H3 | `SEP-10-archiviazione/Report-A1-inventario-filesystem.md` | inventario path | **leave-as-history** |
| H4 | `Report-decisioni-d1-d5-perimetro-sep11-f1-f2-10-08-26.md` | perimetro F3 bloccato | **leave-as-history** |
| H5 | `Report-sep-11-f1-f2-archive-shell-indice-10-08-26.md` | F1+F2; no move | **leave-as-history** |
| H6 | questo addendum + report remediation `026` | inventario | aggiorna se F3 eseguito (nuovo report) |

### 3.d Assenze rilevanti

- **Nessun** hit in `scripts/mss/`, `docs/MetaSkillSystem/fixtures/`, `docs/MetaSkillSystem/tests/h1/`,
  `package.json`, `.cursor/hooks/*` sul token `REPORT_001` (L5 non path-coupled a questo file).
- **Nessun** hit in `archive/indices/MSS-REPORT-INDEX.md` (indice punta ai report seduta, non a REPORT_001).
- `docs/_lavoro/**` **non** scansionato (freeze L6 / mandato).

---

## 4. Policy `PLAN_V0` (citazione storica ≠ rewrite stato)

1. `PLAN_V0.md` è **unico owner** dello stato dinamico di `SYS-1`.
2. La riga changelog che cita `REPORT_001_…md` è **storia di creazione**, non istruzione di routing viva.
3. A F3: **non** riscrivere gate/WP/stato in `PLAN_V0` «di passaggio». Nessun allineo H-1.3, nessun
   cambio di verdetti SYS-1 mascherato da link-fix.
4. Opzioni ammesse a F3 **senza** mandato SYS-1 ampio:
   - lasciare la citazione invariata (**leave-as-history** preferito);
   - se esiste stub al path vecchio, la citazione resta valida come nome storico.
5. Un eventuale aggiornamento del solo path nella riga changelog richiede **mandato SYS-1 esplicito**
   distinto dal mandato F3 pack — fuori da questa remediation.

Questa policy vive anche in `docs/MetaSkillSystem/archive/README.md` (sezione link pre-move).

---

## 5. Cella M03 supersede (sostituisce solo `link_da_aggiornare` di B1)

| Campo B1 M03 | Valore B1 originale | Valore supersede (questo addendum) |
|---|---|---|
| `link_da_aggiornare` | `METASKILL_SYSTEM_SKILL` | **L1** `METASKILL_SYSTEM_SKILL.md` (update link) · **L2** `CATALOGO_SEDUTE_E_METODI_V0.md` (update link) · **L3** `PLAN_V0.md` (leave-as-history / policy §4) · più **N1–N3** narrativa pack/archive se F3 cambia fatti |
| Rollback «reverse M03» | reverse move + drop stub | invariato **più** reverse degli update link L1/L2 (e narrativa N* se aggiornata) |

B1 §5 tabella resta storia; **non** è stata riscritta in-place oltre alla nota append-only nel report B1.

---

## 6. Checklist pre-F3 (documentale — non eseguita)

- [x] Inventario `rg` completo vs B2-F01
- [x] `link_da_aggiornare` espanso (questo file)
- [x] Policy PLAN_V0 scritta senza rewrite stato
- [ ] Mandato Matteo esplicito per **F3** (ancora assente)
- [ ] Esecuzione move + stub + update L1/L2
- [ ] `rg` post-move / TTL stub (D5)

**F3 resta VIETATO** finché Matteo non dà nuovo mandato post-B2-F01.

---

## 7. Relazione con SEP-G5

Inventario + policy **non** equivalgono a cutover. `SEP-G5` resta **non PASS**.
