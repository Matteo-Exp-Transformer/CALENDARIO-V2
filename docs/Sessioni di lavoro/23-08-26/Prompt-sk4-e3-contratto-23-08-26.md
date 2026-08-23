# Mandato E3 — SK-4 allineo contratto capsula

```text
Profilo: Esecuzione
Modalità: deep
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md · docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md (intero) · docs/MetaSkillSystem/PLAN_V0.md (§4-bis S4, §15)
Non caricare: APP_CONTEXT_SKILL.md intero · docs/_lavoro/ · src/ · scripts/mss/ (non modifichi codice in questo slot)
Output attesi: CONTRATTO_CAPSULA_SESSIONE_V0.md allineato a 0.1.1/freeze-2 come versione viva, §2 path coerente con G1/G2, avviso in testa aggiornato; mini-report Report-sk4-e3-contratto-23-08-26.md; riga E3 in PLAN §9; nessun altro file; niente output in più senza chiedere Sì/No prima
```

> **Slot:** E3 · **Wave:** 1 (parallelo con E1 ed E2) · **Data:** 23-08-26 · **Branch:** `env/test`

---

## 1. Gate decisioni

Leggi PLAN §3 — parti solo se **G1, G2, G4** sono `AUTORIZZATE`:

`docs/Sessioni di lavoro/23-08-26/PLAN-CURSOR-SK-4-23-08-26.md`

Leggi anche `scripts/mss/rules.mjs` righe 3–6 (fonte autorevole versione viva) — **non** copiare
dal corpo obsoleto del contratto.

---

## 2. Chi sei

Esecutore **E3** di **`SK-4`**. Allinei il **documento owner dello schema** al codice, così un agente
che segue il contratto **non** produce più capsule senza `controls`.

**Non modifichi** `.mjs`. **Non modifichi** capsule storiche nei report.

---

## 3. Problema da chiudere (V4 consulenza)

Oggi il contratto istruisce ancora `0.1.0` / `freeze-1` nel §3, mentre `rules.mjs` impone
`0.1.1` / `freeze-2`. Chi segue il contratto ottiene bypass B1.

---

## 4. Lavoro documentale

File unico: `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md`

1. **Titolo / §3 identità:** versione viva `mss.session/0.1.1` + `mss-v0.1-wp0.1-freeze-2`.
2. **Sezione storico:** `0.1.0` / `freeze-1` solo per **leggere** record esistenti, non per produrne di nuovi.
3. **§2 dove vive:** path report coerenti con regex approvata (PLAN §3):
   - profondità arbitraria sotto cartella-data
   - prefissi `Report-` e `Verbale-` se G2
4. **Avviso in testa:** aggiornare — se E2 non è ancora merged, mantieni nota «validator in rollout»
   senza contraddire la versione viva del corpo.
5. **`controls`:** resta obbligatorio per capsule nuove; spiegare cosa contiene (prove verifiche).

⛔ Non aprire ri-versioni schema oltre allineamento 0.1.1/freeze-2. Non toccare `rule_id_version`
(backlog SK-4 esteso).

---

## 5. Perimetro

**Solo scrittura:** `CONTRATTO_CAPSULA_SESSIONE_V0.md` · report E3 · PLAN §9 riga E3.

---

## 6. Prove di chiusura E3

1. Grep: il corpo §3 non invita più a scrivere `0.1.0` per record **nuovi**
2. §2 cita esplicitamente sotto-cartelle e prefissi concordati
3. Avviso in testa coerente con corpo (nessuna contraddizione owner)

---

## 7. Mini-report e capsula

`docs/Sessioni di lavoro/23-08-26/Report-sk4-e3-contratto-23-08-26.md` — elenca sezioni cambiate,
cosa resta backlog, Q1–Q6 verbatim. PLAN §9 **E3** → `COMPLETATO`.
