# Mandato R1 — revisione indipendente SK-4

```text
Profilo: Verifica
Modalità: deep
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md · docs/Testing-Skill/TESTING_SKILL.md (solo per interpretare test:mss)
Non caricare: APP_CONTEXT_SKILL.md intero · docs/_lavoro/ · src/
Output attesi: Report-sk4-revisione-indipendente-23-08-26.md con controprove B1 B2 B3, giudizio su non-regressione, eventuali difetti bloccanti; aggiornamento PLAN §9 riga R1; nessuna modifica codice salvo handoff esplicito al coordinatore; niente output in più senza chiedere Sì/No prima
```

> **Slot:** R1 · **Wave:** 3 · **Dopo** E4 · **Famiglia modello diversa consigliata** (D17, non gate)

---

## 1. Gate

E4 deve essere `COMPLETATO` in PLAN §9. Leggi **prima**:

- `PLAN-CURSOR-SK-4-23-08-26.md`
- `Report-ciclo-SK-4-23-08-26.md`
- Mini-report E1, E2, E3
- `git diff` / file toccati

**Non** assumere corretto il lavoro degli esecutori.

---

## 2. Controprove obbligatorie

Ripeti **in autonomia** (non citare a memoria il report E4):

1. **B1:** capsula legacy-new → deve FAIL
2. **B2:** report in sotto-cartella invalido → enforcement deve bloccare
3. **B3:** `Verbale-` invalido → idem (se G2)
4. `npm run test:mss` → exit 0
5. Nessuna capsula storica nel diff
6. Un solo regex path nel repo (grep `Sessioni di lavoro` in `scripts/mss/`)

Se una controprova fallisce → **difetto bloccante**, non approvare.

---

## 3. Cosa valutare

- D18 rispettato (no triplicazione regex / regola legacy)
- Contratto allineato al codice post-E2
- Perimetro: nessun file SK-11 / CI toccato
- Capsula report revisione: `self_report` — ⛔ non marcare `independently_verified` su te stesso

---

## 4. Output

`docs/Sessioni di lavoro/23-08-26/Report-sk4-revisione-indipendente-23-08-26.md`

Struttura: metodo · esito per bypass · non-regressione · difetti · raccomandazione a Matteo
(accetta / correggere / non chiudere SK-4) · capsula · Q1–Q6 verbatim.

PLAN §9 riga **R1** → `COMPLETATO` o `BLOCCATO` con motivo.

---

## 5. Divieti

- Fix silenziosi nel codice (solo report)
- Dichiarare SK-4 chiuso
- commit / push
