# Prompt orchestratore Cursor — ciclo T7: backlog SK/H/E + readiness pilota

> **Per:** agente senior Cursor (orchestratore MSS), con sub-agent per esecuzione e revisione interna.
> **Branch:** `env/test` · **HEAD atteso:** `c2d71f3` o successivo (T6 chiuso + batch verify pushati).
> **Owner stato:** `docs/MetaSkillSystem/PLAN_V0.md` (gate **`T7`**, decisioni `D25`–`D27` invariate salvo firma Matteo).
> **Controverifica esterna:** a lavoro finito Matteo manderà **Codex** (famiglia diversa) — tu prepari atti puliti, non sostituirla.
> **Non eseguire commit/push** salvo «sì» esplicito di Matteo a fine ciclo.

---

## Intestazione agente (obbligatoria)

```
Profilo: Meta (orchestratore senior MSS)
Modalità: deep
Skill da leggere:
  - docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md
  - docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md
  - docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md (§5–§6)
  - docs/MetaSkillSystem/PLAN_V0.md §4-bis · §4-ter · §15 (ciclo T6–T7)
  - docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md (chiusura report)
Non caricare: corpus storico non puntato · src/ · Supabase · WP-1 esecuzione · SK-10 nuovo lavoro
```

---

## Ruolo — prendilo sul serio

Sei **orchestratore**, non l'unico martello. Il modello di riferimento è il ciclo **T6 Codex**
([`Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md`](../24-08-26/Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md))
e le chiusure **Claude/Cursor** del 23–25-08: **famiglia per famiglia**, **un report per famiglia**,
**capsula R1 generata**, **tu riesegui §6** prima di promuovere qualsiasi stato.

**Il tuo primo compito è economico:** accorpare il backlog residuo (`SK-*`, `H-*`, hook, `E-*`
dichiarati) in **poche famiglie eseguibili**, non in una chat infinita di micro-fix.

Matteo ha autorizzato questo ciclo **dopo push T6** (25-08-26). Obiettivo dichiarato:

> *«Accorpare il lavoro rimanente tra SK-, H- e E- e fare anche il resto dei lavori per poter
> condurre sessioni pilota con tutto funzionante dopo il tuo lavoro. Codex controverificherà a
> lavoro finito.»*

**Traduzione operativa:** chiudere le fondamenta MSS che oggi restano **aperte o stale** (cruscotto,
status, hook chiusura, bypass H-1.3 documentati), produrre **checklist readiness pilota** e
**raccomandazione esplicita** su riapertura `D27`/`WP-1` — **senza** avviare il pilota reale.

---

## Cosa leggere (ordine, poi stop)

| # | File | Perché |
|---|---|---|
| 1 | `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | comandi, owner vs vista, attrezzi |
| 2 | `docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md` §5–§6 | orchestrazione + controverifica |
| 3 | `docs/MetaSkillSystem/PLAN_V0.md` §4-bis · §4-ter · §15 (T6 chiuso, T7) | owner autorevole |
| 4 | [`Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md`](../24-08-26/Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md) §10 | backlog verbatim post-T6 |
| 5 | [`Report-revisione-skill-chiusura-e-hook-23-08-26.md`](../23-08-26/Report-revisione-skill-chiusura-e-hook-23-08-26.md) §9 | N2–N5 hook Q/R |
| 6 | `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json` | bypass E2 (`known_bypass`) per famiglia H13-E2 |

Poi: `npm run mss:status` · `npm run mss:query -- --verifica` · `npm run validate:mss:all`

**Non copiare numeri mobili nel PLAN.** I conteggi si citano come comando, non come valore fisso.

---

## STOP globali (non negoziabili)

- Nessun commit/push senza sì esplicito di Matteo.
- **`WP-1` resta NO-GO** finché Matteo non riapre **`D27`** in chat dedicata — tu prepari, non esegui piloti.
- **`H-1.3` resta `PASS_CON_RISERVE`** — **vietato** dichiarare PASS pulito anche se chiudi H13-E2 parzialmente.
- **`SK-10`:** nessun nuovo mandato formale; è già CHIUSO (`M-G`). Non riaprire portabilità salvo bug provato.
- **Prodotto CalendarBackup:** nessun lavoro su `src/`, merge `main`, release clienti (`D26`).
- **Nessuna riapertura** del verdetto M12 R1 storico (mattina 24-08).
- **Nessun allentamento validator**; nessuna riscrittura record `final` (solo `amendment`).
- **Un mandato = una famiglia = un report = una capsula** (mai un report per fix).
- **Principio `D18`:** importa regole esistenti; non duplicare regex/implementazioni.

---

## Flusso obbligatorio (quattro fasi)

### Fase 0 — Passo 0 (tu, prima di tutto)

```bash
git rev-parse HEAD
git status --porcelain
npm run mss:status
npm run mss:query -- --verifica
npm run validate:mss:all
```

Annota HEAD nel report orchestratore. Se branch ≠ `env/test`, **fermati** e avvisa Matteo.

### Fase 1 — Inventario (tu o un solo sub-agent `explore`)

**Default consigliato:** inventario **tu**, senza sub-agent — il backlog è già mappato sotto; servono
solo conferme da comando + lettura mirata di `status.mjs`, hook, `COVERAGE_MATRIX_H1.json`.

Se lanci un sub-agent explore, mandato stretto:

- restituire tabella `{ID, file coinvolti, comando prova, dipendenze, rischio}` per le cinque famiglie §4;
- **vietato** modificare file; **vietato** aprire `src/`.

### Fase 2 — Plan (tu, in chat, prima degli esecutori)

Scrivi un **plan visibile a Matteo** con:

1. Ordine famiglie (§4) e dipendenze (es. SK-2 prima del report readiness se status alimenta checklist).
2. Sub-agent per famiglia: modello suggerito (meccanico → Sonnet/Fast; hook/core → Opus dove serve).
3. Criteri M12 interni (revisore Cursor **diverso** dall'esecutore quando possibile; se stessa famiglia, segnala avviso `D17`).
4. Cosa **non** farai e perché (E-2 tecnologia, WP-1 esecuzione, H-1.3 PASS pulito).
5. Stima report attesi (≤ 5 report totali incluso orchestratore).

**Non passare alla Fase 3 senza plan.** Se Matteo corregge l'ordine, aggiorna il plan prima di eseguire.

### Fase 3 — Esecutori (sub-agent, una famiglia per volta)

Per ogni famiglia: prompt figlio **autocontenuto** (perimetro, file, comandi, deliverable, divieti).
L'esecutore consegna: diff + **un** report + `judgments-*.json` + capsula via `mss:capsule`.

Tu lanci un **revisore interno** (sub-agent famiglia diversa o tu stesso in turno §6) **prima** di
promuovere la famiglia chiusa nel tuo registro di lavoro.

### Fase 4 — Controverifica orchestratore (tu, §6)

Per **ogni** famiglia e per il ciclo intero:

1. `git diff` reale — esiste? perimetro rispettato?
2. Riesegui **tu** i comandi in `controls[]`, non leggerne gli esiti.
3. `npm run validate:mss -- --mode file --file "<report>" --kind report --require-capsule` → exit 0.
4. `npm run validate:mss:all` verde.
5. Ogni difetto dichiarato chiuso: **esiste test nominato?** Se no → famiglia non chiusa.
6. Chiudi **tu** con `mss:capsule` sul report orchestratore (mai header capsula a mano).

Poi: aggiorna **solo** `PLAN_V0.md` (owner) · rigenera cruscotto:

```bash
npm run generate:mss:views
npm run validate:mss:views
```

**Handoff Codex:** elenca path completi di tutti i report + hash HEAD + tabella M12 + riserve residue.

---

## Famiglie del ciclo T7 (accorpamento backlog)

Ordine vincolante suggerito — puoi riordinare nel plan Fase 2 **solo** se motivi dipendenze tecniche.

### Famiglia 1 — `SK-2` + viste (`V1` parziale)

**Stato partenza:** `SK-2` = `IMPLEMENTATO, non allineato` — `mss:status` ripete celle stale; cruscotto
esiste (`generate:mss:views`) ma status non è ancora «fonte unica» con validazione anti-stale.

**Obiettivo:**

- `npm run mss:status` legge stati **coerenti** con owner + viste generate (non numeri copiati a mano).
- Se tocchi generatore viste: **non** riscrivere ROADMAP/HANDOFF a mano — estendi generatore o parser PLAN.
- Test nominato in `test:mss:tools` che fallisce se status stampa un gate obsoleto rispetto al PLAN parser.

**Deliverable:** fix mirato + **un** report + capsula R1 + M12 revisore interno.

**Non fare:** move directory · allowlist `D21` · rewrite massivo Senior-Eval-Pack a mano.

---

### Famiglia 2 — Hook Q/R chiusura (`N2`–`N5`, 23-08)

**Fonte:** [`Report-revisione-skill-chiusura-e-hook-23-08-26.md`](../23-08-26/Report-revisione-skill-chiusura-e-hook-23-08-26.md) §9.

| ID | Attacco | Chiusura attesa |
|---|---|---|
| `N2` | Senior duplica regex Q/R | import unico da `scripts/mss/report-questions.mjs` (o owner equivalente), zero regex inline duplicate |
| `N3` | Parità gemelli Cursor/Claude | diff nudge ↔ senior = solo sintassi piattaforma; test gemello se già esiste pattern `A3` |
| `N4` | Sovrapposizione §12 / Q2–Q3 / pre-commit «mente fredda» | una sola voce visibile all'agente; `D24` silenzio condizionato preservato |
| `N5` | §4 CHIUSURA triade MSS | `test:mss` citato obbligatorio oltre `validate:mss` dove manca |

**Principio `D18`:** una sola implementazione discovery report — riusa `report-paths.mjs` / `adapter.mjs`.

**Deliverable:** fix hook + skill CHIUSURA/PREPARA minimo diff + test H-1/tools nominati + **un** report + capsula.

**Non fare:** emoji `❓ Q` a inizio riga fuori §11 (regola EVOLUZIONE).

---

### Famiglia 3 — `H13-E2` (bypass enforcement H-1.3)

**Stato partenza:** `H-1.3` = `PASS_CON_RISERVE`; riserva `H13-POST-L01` **chiusa** (`M13`); restano
**bypass E2 dichiarati** in `COVERAGE_MATRIX_H1.json` (`--no-verify`, unstaged, superfici senza hook, …).

**Obiettivo (realistico):**

1. **Inventario** bypass per fixture ID con evidenza comando (non opinione).
2. **Riduzione** dove esiste fix meccanico a basso rischio (es. parità hook/CI già coperta da `SK-5`).
3. **Documentazione** owner: cosa resta bypass **intenzionale** vs bug — aggiorna PLAN §3.2 / matrice.
4. Test nominati per ogni bypass **chiuso**; i restanti restano `known_bypass` espliciti.

**Deliverable:** **un** report + capsula + aggiornamento owner **senza** riga «H-1.3 PASS pulito».

**Non fare:** dichiarare WP-1 aperto · implementare tecnologia `E-2` (buco intenzionale §4 riga `E-2`).

---

### Famiglia 4 — `SK4-ASSERT` (opzionale, solo se risolvibile senza hack)

**Problema:** capsula controverifica SK-4 T6 — asse Output assertisce amendment non emesso; `--verify`
non tocca `assertions[]` Output ([`Report-batch-verify-t6-post-commit-25-08-26.md`](../24-08-26/Report-batch-verify-t6-post-commit-25-08-26.md) §3).

**Obiettivo:** rettifica **append-only** (amendment o nota owner) che allinea narrativa §7 ↔ capsula;
**oppure** documenta stop motivato se non risolvibile con contratto attuale.

**Se non chiudibile in ≤ 1 seduta:** BACKLOG esplicito nel report orchestratore — **non** bloccare T7.

---

### Famiglia 5 — Readiness pilota (`D27` prep, non esecuzione)

**Obiettivo:** checklist eseguibile «agente freddo può chiudere seduta deep senza retry» verso riapertura `D27`:

| Controllo | Comando / prova |
|---|---|
| Cancelli globali | `npm run validate:mss:all` verde · CI `mss` verde su `origin/env/test` |
| Orientamento | `mss:status` + cruscotto non stale |
| Chiusura R1 | scheda [`SCHEDA_CHIUSURA_META_R1.md`](../../MetaSkillSystem/SCHEDA_CHIUSURA_META_R1.md) + `mss:capsule` |
| Protocollo pilota | `PROTOCOLLO_PRIMO_PILOTA_V0_1.md` esiste; gap list esplicita |
| R4 seduta | hook chiede in modo diverso light vs deep **se** Famiglia 2 non l'ha già coperto |
| WP-1 | **NO-GO** finché Matteo non riapre D27 — raccomandazione sì/no con evidenza |

**Deliverable:** **un** report readiness + capsula; aggiorna PLAN §15 ciclo **`T7`** → **CHIUSO** o **`T7` eseguito CON RISERVE** con tabella gap.

**Non fare:** eventi pilota reali · mining WP-2 · scritture DB.

---

## Report orchestratore finale (obbligatorio)

Un solo file:

`docs/Sessioni di lavoro/25-08-26/Report-orchestratore-t7-backlog-pilota-25-08-26.md`

Sezioni: cappello · Passo 0 · plan adottato · tabella famiglie (esecutore/revisore/M12) · gate §6
rieseguiti · owner/cruscotto · handoff Codex · §11 Q1–Q6 verbatim (`CHIUSURA_SESSIONE.md`).

---

## Sub-agent — quando lanciarli

| Sub-agent | Quando | Output |
|---|---|---|
| `explore` | Solo se inventario supera ~30 minuti | tabella ID/file/comandi, zero edit |
| Esecutore famiglia N | Dopo plan approvato (implicito: procedi se Matteo non blocca) | diff + 1 report + judgments |
| Revisore interno N | Dopo ogni esecutore | PASS/FAIL + prove rieseguite |
| Tu (orchestratore) | Sempre Fase 4 | promozione owner + report finale |

**Tu non fidarti dei report figli:** §6 prima di scrivere «famiglia chiusa».

---

## Criterio successo T7 (per Matteo)

Matteo considera il ciclo riuscito se:

1. Backlog SK/H/hook **accorpato** in ≤ 5 report (+ orchestratore), non sparso in micro-commit narrativi.
2. `npm run validate:mss:all` verde; ogni famiglia chiusa ha test nominati o stop documentato.
3. Cruscotto + `mss:status` **non mentono** rispetto al PLAN (Famiglia 1).
4. Readiness pilota: checklist con gap espliciti e raccomandazione **`D27`** (Famiglia 5).
5. **`H-1.3` PASS pulito** e **`WP-1` aperto** **non** compaiono nel owner salvo firma nuova.
6. Atti pronti per **controverifica Codex** (path completi, HEAD, M12, riserve).

**Commit/push:** solo con sì esplicito Matteo a fine ciclo (es. «lavoro ok» / «fai report finale»).

---

## Messaggio verbatim Matteo (25-08-2026)

«Fai push su remoto. Lasciamo worktree pulito per proseguire. Poi prepara prompt per dire ad agente
cursor di accorpare il lavoro rimanente tra SK- H- E e facciamo anche il resto dei lavori per poter
condurre sessioni pilota con tutto funzionante in seguito al suo lavoro in sessione. Agente cursor
sarà orchestrator e validerà lavoro dei suoi sub agent. Ne userà uno per raccogliere i dati (o lo fa
lui se secondo te sono pochi da elaborare), poi elabora un plan, poi lancia esecutori. Poi revisiona
e prosegue. Io farò controverificare a lavoro finito da codex. Facciamo in modo che agente senior
cursor prenda sul serio il mandato e si comporti allineato a come hanno lavorato fin ora codex e
claude.»

---

## Riferimenti rapidi post-T6

| Artefatto | Path |
|---|---|
| Chiusura T6 + firma SK-4/SK-8 | [`Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md`](../24-08-26/Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md) |
| Batch verify 3/3 | [`Report-batch-verify-t6-post-commit-25-08-26.md`](../24-08-26/Report-batch-verify-t6-post-commit-25-08-26.md) |
| Template orchestratore T6 | [`Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md`](../24-08-26/Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md) |
| Cruscotto generato | `docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md` |
