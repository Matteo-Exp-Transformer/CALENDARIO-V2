# Mandato `M-E` — attrezzi mancanti (`T1` poi `T2`) — 24-08-2026

> Affidato dopo la chiusura `M-F` (M12). Esecutore consigliato: **Opus** per `T1` (`mss:move`);
> revisore di **famiglia diversa** obbligatorio per chiudere sotto `M12`.
> **Un solo report** e **una sola capsula** per questo mandato.
> Fonte viva: [`PROMPT_ORCHESTRATOR_MSS_24-08-26.md`](../../MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md) §3–§5 · owner [`PLAN_V0.md`](../../MetaSkillSystem/PLAN_V0.md) §15.
>
> ✅ Prerequisito soddisfatto: `M-F` è **CHIUSO**
> ([`Report-controverifica-MF-24-08-26.md`](Report-controverifica-MF-24-08-26.md)).

---

## Intestazione (incolla in cima alla chat esecutore)

```
Profilo: Meta
Modalità: deep
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md; questo mandato
Non caricare: corpus storico non puntato; non aprire R1; non dichiarare H-1.3 PASS pulito; non aprire WP-1
Output attesi: mss:move (T1) con prova eseguibile + test che nomina T1/R6; report + capsula; PLAN/CRUSCOTTO solo dopo M12 (controverifica famiglia diversa). T2 (mss:review) solo se T1 è PROVATO nello stesso mandato, altrimenti lascia T2 esplicitamente fuori.
Niente output extra senza chiedere Sì/No prima.
```

---

## 0. Chi sei e cosa NON fai

Sei l’esecutore di **`M-E`**. Costruisci gli attrezzi ancora a zero:

| ID | Attrezzo | Requisito | Stato oggi |
|---|---|---|---|
| `T1` / `SK-9` / `R6` | `mss:move` | spostare/rinominare un file e aggiornare i riferimenti **vivi** | **0%** — non esiste |
| `T2` / `SK-3` | `mss:review` | sola lettura: trova violazioni note, non inventa su seduta pulita | non iniziato |

**STOP fissi (anche se «sembra utile»):**

- nessun commit / push / tag senza sì esplicito di Matteo;
- nessun tocco `src/`, database, migrazioni;
- nessun `move` **manuale** di file del corpus «per preparare» l’attrezzo (decisione `D15`: senza attrezzo il costo misurato è ~1 741 righe);
- nessuna riscrittura di record `final` (solo `amendment`);
- non aprire `R1`, `WP-1`; non dichiarare `H-1.3` PASS pulito;
- non generare ROADMAP/HANDOFF come seconda vista;
- non aggiornare `PLAN_V0` a CHIUSO da solo: `M12` richiede controverifica famiglia diversa dopo di te → al massimo lascia lo stato **PROVATO** e l’handoff al revisore.

## 1. Cosa NON leggere

Non aprire il corpus dei 400+ report. Ti bastano:

1. questo mandato;
2. `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` (comandi, owner vs viste, comandi che **non** esistono);
3. i file del perimetro che tocchi sotto `scripts/mss/` e i test tools;
4. §15 di `PLAN_V0.md` **solo** per lo stato (prossima azione = M-E) — non riscrivere la storia.

Atti utili (lettura mirata, non corpus):

- [`Report-controverifica-MF-24-08-26.md`](Report-controverifica-MF-24-08-26.md) — handoff: prossimo = M-E;
- [`Report-punto-situazione-mss-24-08-26.md`](Report-punto-situazione-mss-24-08-26.md) se ti serve il costo del move manuale (~1 741 righe).

## 2. Passo 0 (obbligatorio)

Prima di qualsiasi modifica:

```bash
git rev-parse HEAD
git branch --show-current   # atteso: env/test
git status --porcelain
```

Se il branch non è `env/test`, **fermati**. Se durante i gate il tree cambia per commit esterni, rileggi HEAD/status e ripeti i gate — non trattare un rewrite concorrente come fallimento del tuo codice senza prova.

## 3. Che cosa deve diventare vero — `T1` (`mss:move`)

### 3.1 Comportamento

Deve esistere un comando documentato nel manuale, tipicamente:

```bash
npm run mss:move -- <sorgente> <destinazione>
```

(o forma equivalente **una** e sola, motivata nel report).

Effetti attesi:

1. sposta o rinomina il file nel working tree;
2. aggiorna i **riferimenti vivi** (link markdown, import, path citati dai cancelli MSS che devono restare verdi);
3. non aggiorna da solo la storia / gli archivi morti se non sono nel perimetro dichiarato;
4. esce **rosso** in modo leggibile se sorgente assente, destinazione occupata, o riferimenti non risolvibili — senza scrivere a metà;
5. dopo un move di prova: `npm run validate:docs` (o equivalente del repo) a **zero path rotti** sul perimetro toccato; suite MSS verde.

### 3.2 Prova eseguibile (obbligatoria)

- Un move **reale** in una sandbox/temp o su un file di prova dedicato (non distruggere atti vivi senza piano).
- Misura o cita il confronto col costo storico del move manuale (~1 741 righe) — almeno: «con l’attrezzo: N file/tocchi vs baseline documentata».
- `npm run test:mss:tools` include un test che **nomina** `T1` o `R6` (titolo esplicito) con asserzioni **non vacue** (non basta `exit !== 0`).

### 3.3 `D18`

Se ti serve una regola già in `core`/`config`, **importala**; se non è esportata, esportala. Vietato duplicare parser path.

## 4. `T2` (`mss:review`) — solo dopo `T1` PROVATO

Se e solo se `T1` ha prova + test nominato verdi nello stesso mandato, puoi aggiungere `mss:review` (sola lettura):

- su seduta con violazione nota → la segnala;
- su seduta pulita → non inventa finding.

Altrimenti: dichiara `T2` **fuori scope** nel report e lascia handoff chiaro. Non gonfiare il mandato.

## 5. Integrazione cancelli / docs

- Documenta il comando in `MANUALE_OPERATIVO_MSS_V0.md` (sezione attrezzi).
- Aggiungi script in `package.json` in coerenza col manuale.
- `npm run validate:mss:all` deve restare verde (include già `validate:mss:views` da M-F: **non romperlo**).
- Dopo ogni modifica a `PLAN_V0` (solo se autorizzata post-M12): `npm run generate:mss:views` — mai editare a mano dentro i marcatori del cruscotto.

## 6. Comandi da lasciare verdi (riesegui tu, non citare esiti altrui)

```bash
npm run test:mss:tools
npm run test:mss
npm run validate:mss:views
npm run validate:mss:all
git diff --check
npm run validate:mss -- --mode file --file "<tuo-report>" --kind report --require-capsule
```

## 7. Chiusura seduta esecutore

1. Report: `docs/Sessioni di lavoro/24-08-26/Report-me-attrezzi-mancanti-24-08-26.md` (un file, budget indicativo ≤ 250 righe).
2. Capsula con `npm run mss:capsule` + judgments espliciti; `--check` con **virgolette doppie** sui path con spazi; `--check-expect` dove serve.
3. Q1–Q6 verbatim come negli altri report Meta.
4. Stato in report: **`M-E` PROVATO, non CHIUSO`** finché manca controverifica famiglia diversa (`M12`).
5. Handoff: revisore Cursor (o altra famiglia ≠ OpenAI se l’esecutore è Codex) rifà i gate e le controprove `T1` (e `T2` se inclusa).

## 8. Handoff obbligatorio nel report

Dopo il tuo lavoro:

- prossimo passo = **controverifica M-E** (famiglia diversa) → solo allora CHIUSO sotto M12;
- `R1` resta raccomandato ma **non aperto**;
- `WP-1` resta NO-GO;
- `H-1.3` resta PASS_CON_RISERVE.

## 9. Chiusura verso Matteo (linguaggio semplice)

Una riga: cosa può fare ora (es. «spostare un file MSS con un comando senza rincorrere i link a mano») e se manca la controverifica prima di dire chiuso.
