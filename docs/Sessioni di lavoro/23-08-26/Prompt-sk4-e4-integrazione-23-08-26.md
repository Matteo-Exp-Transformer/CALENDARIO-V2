# Mandato E4 — SK-4 integrazione e dimostrazioni

```text
Profilo: Esecuzione
Modalità: deep
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md · docs/MetaSkillSystem/PLAN_V0.md (§4-bis S4, §15)
Non caricare: APP_CONTEXT_SKILL.md intero · docs/_lavoro/ · src/
Output attesi: integrazione wave E1+E2+E3, dimostrazioni B1 B2 B3, report unico Report-ciclo-SK-4-23-08-26.md, aggiornamento PLAN §4-bis riga S4 (stato provato, non chiusura), PLAN §9 E4+R1; nessun refactor query oltre ciò già fatto da E1; niente output in più senza chiedere Sì/No prima
```

> **Slot:** E4 · **Wave:** 2 (sequenziale, **dopo** E1+E2+E3 completati) · **Data:** 23-08-26

---

## 1. Gate di ingresso

Verifica in PLAN §9 che **E1, E2, E3** siano `COMPLETATO` con link ai mini-report.

Leggi i tre mini-report prima di integrare. Se un diff Wave 1 manca, **fermati**.

```bash
npm run mss:status
git status --porcelain
```

---

## 2. Chi sei

Esecutore **E4**: **non** rifare il lavoro di E1–E3 salvo bug bloccante documentato nel report
unificato. Il tuo valore è **integrazione + prove + report ciclo**.

---

## 3. Dimostrazioni obbligatorie (PLAN §7)

Crea area temporanea `docs/Sessioni di lavoro/23-08-26/_prova-sk4/` (gitignored o rimossa a fine).

| Bypass | Prova |
|---|---|
| **B1** | capsula nuova legacy senza `controls` → validate FAIL + codice |
| **B2** | `_prova-sk4/sub/Report-test-sk4.md` invalido staged → deny |
| **B3** | `_prova-sk4/sub/Verbale-test-sk4.md` invalido staged → deny (se G2) |

Registra **comando, exit code, riga di log**. Rimuovi artefatti temporanei; worktree pulito.

---

## 4. Checklist integrazione

1. `node --check` su ogni `.mjs` toccato da E1+E2
2. `npm run test:mss` → exit 0
3. `npm run validate:docs` → **17** path rotti (baseline)
4. `npm run mss:query -- --verifica` → smoke exit 0
5. `git status --porcelain` → nessuna capsula storica modificata
6. `npm run validate:mss` sul report ciclo → OK

---

## 5. Report unico

`docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-4-23-08-26.md`

Sezioni: obiettivo · decisioni G1–G6 · sintesi E1/E2/E3 · dimostrazioni B1–B3 · prove · non fatto ·
capsula · Q1–Q6 verbatim.

Aggiorna `PLAN_V0.md` §4-bis riga **S4** con stato e prove (**non** «CHIUSO» — decide Matteo).

Aggiorna PLAN §9: **E4** `COMPLETATO`, **R1** `PRONTO PER REVISIONE`.

---

## 6. Divieti

- Refactor SK-11 su `query.mjs` / `status.mjs`
- commit / push senza sì Matteo
- Dichiarare SK-4 chiuso
