# Mandato controverifica `M-E` (`T1` / `mss:move` / `R6`) — 24-08-2026

> Controverifica a freddo dopo consegna esecutore Cursor Composer.
> **Famiglia richiesta (confermata Matteo):** **Codex / OpenAI** (≠ Cursor).
> Un solo report + una sola capsula. Fonte: handoff in
> [`Report-me-attrezzi-mancanti-24-08-26.md`](Report-me-attrezzi-mancanti-24-08-26.md) ·
> owner [`PLAN_V0.md`](../../MetaSkillSystem/PLAN_V0.md) · `M12` in
> [`PROMPT_ORCHESTRATOR_MSS_24-08-26.md`](../../MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md) §4 punto 7 / §6.

---

## Intestazione (incolla in cima alla chat revisore)

```
Profilo: Meta
Modalità: deep
Ruolo: revisore Codex (OpenAI) — famiglia ≠ Cursor (esecutore M-E)
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md; docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md (§4 M12 + §6 protocollo controverifica); docs/Sessioni di lavoro/24-08-26/Report-me-attrezzi-mancanti-24-08-26.md; docs/Sessioni di lavoro/24-08-26/Prompt-controverifica-ME-24-08-26.md
Non caricare: corpus storico non puntato; non aprire R1; non aprire T2/mss:review; non dichiarare H-1.3 PASS pulito; non aprire WP-1
Output attesi: controverifica fredda M-E (T1/R6); report + capsula; se e solo se M12 = PASS → aggiorna PLAN_V0 (M-E CHIUSO + prossimo task senza aprirlo) e cruscotto SOLO via npm run generate:mss:views. Niente output extra senza chiedere Sì/No prima.
```

Puoi solo **alzare** la modalità, mai abbassarla.

---

## 0. Chi sei e cosa NON fai

Sei il **revisore** di `M-E`. Non fidarti del report esecutore: **rifai** le prove.

**`M12` — CHIUSO solo se tutte e tre vere:**
1. prova che gira a comando;
2. test che **nomina** `T1` o `R6` con asserzioni non vacue;
3. questa controverifica da **Codex / OpenAI** (famiglia ≠ Cursor; esecutore = Cursor Composer).

Se manca anche una → lascia `PROVATO`, **non** aggiornare PLAN a CHIUSO, **non** chiedere a Matteo di firmare al posto della prova.

**STOP fissi:**
- nessun commit / push / tag senza sì esplicito di Matteo;
- nessun tocco `src/`, database, migrazioni;
- nessuna riscrittura di record `final` (solo `amendment`);
- non aprire `R1`, `WP-1`, `T2` / `mss:review`;
- non dichiarare `H-1.3` PASS pulito;
- non generare ROADMAP/HANDOFF come seconda vista;
- **nessun move di atti vivi del corpus** «per collaudare»: solo sandbox/temp (D15 resta: l’attrezzo esiste, ma non usarlo per riordinare la storia);
- preserva il working tree sporco di altri mandati (M-F/M-G untracked, ecc.): tocca solo il perimetro `M-E` (+ PLAN/cruscotto se M12 PASS).

## 1. Cosa leggere (solo questo)

1. questo mandato;
2. `Report-me-attrezzi-mancanti-24-08-26.md` (consegna esecutore + handoff);
3. perimetro codice: `scripts/mss/move.mjs`, `scripts/doc-paths-lib.mjs`, `scripts/check-doc-paths.mjs`, `scripts/mss/export-kit.mjs` (solo pezzi `mss:move`), `package.json` (script), `docs/MetaSkillSystem/tests/tools/run.mjs` (caso `T1/R6`), `MANUALE_OPERATIVO_MSS_V0.md` §2.4-quinquies;
4. `PROMPT_ORCHESTRATOR` §4/`M12` + §6;
5. `PLAN_V0.md` §15 **solo** se chiudi sotto M12 (owner).

Non aprire il corpus dei 400+ report.

## 2. Passo 0 (obbligatorio)

```bash
git rev-parse HEAD
git branch --show-current   # atteso: env/test
git status --porcelain
```

Se non sei su `env/test`, **fermati**. Registra HEAD apertura; a fine gate confronta di nuovo (rewrite concorrente ≠ fallimento del codice senza prova).

## 3. Protocollo controverifica (rifai, non citare)

### 3.1 Diff e perimetro

- `git diff` / status: esistono `move.mjs`, `doc-paths-lib.mjs`, modifiche a check-doc-paths / export-kit / package / test tools / manuale / report M-E?
- Il perimetro è **solo** `T1`/`mss:move`? Segnala tocchi fuori perimetro.
- Conferma che **`T2` è fuori** (nessun `mss:review`).

### 3.2 Gate da rieseguire TU

```bash
npm run test:mss:tools
npm run test:mss
npm run validate:mss:views
npm run validate:mss:all
git diff --check
npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/24-08-26/Report-me-attrezzi-mancanti-24-08-26.md" --kind report --require-capsule
```

### 3.3 Test `T1/R6` — non vacuo

Apri il caso il cui titolo **nomina** `T1` o `R6` in `tests/tools/run.mjs`. Verifica che asserisca (non solo il titolo):
- move ok con aggiornamento riferimenti;
- rifiuti leggibili (sorgente assente / destinazione occupata / zona congelata);
- rollback se validate fallisce;
- costo / delta inferiore alla baseline documentata (~1741).

Riproduci **in sandbox/temp** almeno: (a) move ok + ref aggiornato; (b) un rifiuto rosso; (c) rollback su validate rosso. Non spostare file vivi del repo.

### 3.4 D18

Conferma che `check-doc-paths` e `mss:move` condividono `doc-paths-lib.mjs` (niente secondo parser path).

## 4. Verdetto M12

| Esito | Azione |
|---|---|
| **PASS** (prova + test nominato + famiglia diversa) | Aggiorna `PLAN_V0.md`: `M-E` **CHIUSO**; prossimo task = ciò che il plan/orchestratore indica **senza aprirlo** (tipicamente `T2` resta da affidare, `R1` raccomandato non aperto). Poi **solo** `npm run generate:mss:views` per il cruscotto — mai edit manuale dentro i marcatori. |
| **FAIL** | Lascia `PROVATO`; report con prove che smentiscono; **non** toccare PLAN/cruscotto a CHIUSO. |

`H-1.3` resta `PASS_CON_RISERVE` in ogni caso.

## 5. Chiusura seduta revisore

1. Report: `docs/Sessioni di lavoro/24-08-26/Report-controverifica-ME-24-08-26.md` (un file, budget indicativo ≤ 200 righe).
2. Capsula con `npm run mss:capsule` + judgments espliciti; `--check` con **virgolette doppie** sui path con spazi.
3. Q1–Q6 **verbatim** sotto (obbligatorie).
4. Handoff: dopo PASS → prossimo = mandato `T2` o decisione orchestratore su `R1` (non aprirli qui); dopo FAIL → fix esecutore su quanto smentito.
5. Validazione: `npm run validate:mss -- --mode file --file "<tuo-report>" --kind report --require-capsule` → exit 0.

## 6. Domande di chiusura (incolla nel report — formato obbligatorio)

```
❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura (es. `git rev-parse HEAD:<path>` o SHA — stesso dato di `source_refs[].revision_or_hash` in capsula). Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1:

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).
✅ R2:

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).
✅ R3:

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4:

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5:

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6:
```

## 7. Chiusura verso Matteo (linguaggio semplice)

Una riga: se `M-E` è chiuso o no; cosa può fare ora con il comando di spostamento file; se manca ancora qualcosa prima del prossimo passo.
