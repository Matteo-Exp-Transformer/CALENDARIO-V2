# Prompt orchestratore Codex — ciclo T6: R1 → SK-4 → SK-8

> **Per:** Codex (orchestratore senior MSS), con sub-agent dove serve.
> **Branch:** `env/test` · **HEAD:** registrare all'apertura con `git rev-parse HEAD` e `git status --porcelain`.
> **Owner stato:** `docs/MetaSkillSystem/PLAN_V0.md` (decisioni `D25`–`D27`, ciclo `T6`).
> **Non eseguire commit/push** salvo «sì» esplicito di Matteo a fine ciclo.

---

## Ruolo

Sei **orchestratore**, non l'unico esecutore. Raggruppa per **famiglia**, scegli modello per carico,
affida sub-agent, **controverifica tu** con protocollo §6 del mandato vivo. Un mandato = un report =
una capsula.

Matteo ha deciso (`D25`–`D27`):

- Completare **`R1` → `SK-4` → `SK-8`** in quest'ordine.
- **`SK-10` più avanti**; **prodotto app in pausa**; **`WP-1` NO-GO** finché non riapre lui.
- Obiettivo: MSS **usabile senza sprecare token** e **senza retry inutili** su capsule/report.

---

## Cosa leggere (solo questo, in ordine)

| # | File |
|---|---|
| 1 | `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` |
| 2 | `docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md` (§2 target R1–R8, §6 controverifica) |
| 3 | `docs/MetaSkillSystem/PLAN_V0.md` §4-bis · §4-ter · §15 ciclo T6 · §16.2 (`R1`) |
| 4 | Per SK-4: `docs/Sessioni di lavoro/23-08-26/PLAN-CURSOR-SK-4-23-08-26.md` |
| 5 | Per R1 già fatto: `docs/Sessioni di lavoro/24-08-26/Report-r1-raccolta-sottoprodotto-24-08-26.md` + `Report-controverifica-R1-24-08-26.md` |

Poi: `npm run mss:status` · `npm run mss:query -- --verifica` — **non copiare numeri nel PLAN**.

**Non caricare:** corpus storico non puntato · `src/` · DB/Supabase · WP-1 · SK-10.

---

## STOP globali (non negoziabili)

- Nessun commit/push senza sì di Matteo.
- Nessuna chiusura pacchetto senza M12 + (se richiesto) firma Matteo.
- **`WP-1` NO-GO** · **`H-1.3` resta `PASS_CON_RISERVE`** — non dichiarare PASS pulito.
- **`SK-10` non aprire** in questo ciclo.
- Nessun lavoro su prodotto CalendarBackup (`src/`, merge main, release).
- Nessun allentamento validator; nessuna riscrittura record `final` (solo `amendment`).
- Un mandato = una famiglia = **un report** = **una capsula** (mai un report per fix).

---

## Passo 0 (obbligatorio)

```bash
git rev-parse HEAD
git status --porcelain
npm run mss:status
npm run mss:query -- --verifica
```

Annota HEAD nel report orchestratore finale.

---

## Sequenza dei tre mandati

### Mandato 1 — `R1` al 100% (costo agente + errori chiusura)

**Stato partenza:** R1 **CHIUSO CON RISERVE — M12 soddisfatto** (~50% sul target §16.2: motore R1
compatto esiste; agenti falliscono ancora spesso su capsule).

**Obiettivo operativo (non codice per codice):** una seduta standard/deep si chiude con:

1. Solo `judgments-*.json` (tre assi) via `--template-r1` o equivalente.
2. `npm run mss:capsule -- --judgments … --model … --check "ID=>comando" … --append-to report`.
3. **Mai** scrivere a mano `## Capsula MetaSkillSystem` nel report.
4. `--verify` con **path file completi** risolvibili (es. `docs/Sessioni di lavoro/…/Report-….md`), non nomi corti.
5. `validate:mss --require-capsule` verde al primo colpo **nella maggior parte** dei casi documentati.

**Deliverable minimi:**

| Cosa | Dove (indicativo) |
|---|---|
| Scheda anti-errore chiusura Meta (1 pagina: R1, `--check`, `--verify`, evidence_refs, no header capsula) | `docs/MetaSkillSystem/` o puntatore dal manuale §2.4 — **non** duplicare CHIUSURA intero |
| Aggiornamento ingresso routing (agente Meta carica manuale + mandato, non corpus) | `METASKILL_SYSTEM_SKILL.md` o `PROMPT_AVVIO_ORCHESTRATORE_MSS.md` — minimo diff |
| Prova: almeno **una** chiusura reale del ciclo eseguita con R1 end-to-end + test nominato se tocchi codice | report `Report-r1-completamento-t6-24-08-26.md` (nome ad libitum coerente) |
| Controverifica M12 famiglia **diversa** dall'esecutore | report revisore dedicato |

**Modello suggerito:** esecutore Sonnet; revisore Opus o Cursor/Composer (famiglia diversa).

**Non fare:** riaprire verdetto M12 di R1 del 24-08; non toccare `R1_MODE_CONSTANTS` salvo bug provato.

**Gate chiusura mandato R1:** prova eseguibile + test se codice + M12 + aggiornare owner se Matteo firma CHIUSO senza riserve.

---

### Mandato 2 — `SK-4` bypass enforcement (fondamenta)

**Stato partenza:** `SK-4` **APERTO** — B1–B3 documentati; P1 ha allineato pre-commit/CI su
`requireCapsule`; restano bypass e gate «in prosa».

**Fonte operativa:** `docs/Sessioni di lavoro/23-08-26/PLAN-CURSOR-SK-4-23-08-26.md` (G1–G6 già
autorizzati da Matteo il 23-08).

| ID | Attacco | Chiusura attesa |
|---|---|---|
| B1 | Legacy 0.1.0/freeze-1 rende `controls` opzionale | Record **nuovi** legacy → FAIL; storico leggibile |
| B2 | Report in sotto-cartella fuori pre-commit | Staged/modificati in sotto-cartella → validati |
| B3 | Prefisso diverso da `Report-` (es. `Verbale-`) | Prefissi concordati → validati |

Regex proposta (se ancora valida):  
`/^docs\/Sessioni di lavoro\/.+\/(Report|Verbale)-.*\.md$/i`

**Principio D18:** una sola implementazione path — esportare da `adapter.mjs`, importare altrove.

**Deliverable:** fix + test nominati in `test:mss` (es. FX-I11 per B1 se previsto) + **un** report +
capsula R1 + M12 famiglia diversa.

**Modello suggerito:** esecutore Sonnet (meccanico); revisore Opus.

**Non fare:** SK-11, SK-10, move archivio, `src/`.

---

### Mandato 3 — `SK-8` promozione documentale (suite da root diverse)

**Stato partenza:** **IMPLEMENTATO, non dichiarato** — `test:mss` verde da cwd diverse; manca prova
registrata e promozione in owner.

**Obiettivo:** test nominato che prova esecuzione da directory diversa dalla root repo (risoluzione
via posizione file); aggiornare §4-bis S8; eventuale nota in manuale §2.5.

**Deliverable:** test in suite esistente + **un** report + capsula R1 + M12.

**Modello suggerito:** esecutore Haiku/Sonnet (piccolo); revisore famiglia diversa.

---

## Report orchestratore finale (obbligatorio)

Al termine dei tre mandati (o stop documentato), scrivi **un solo**:

`docs/Sessioni di lavoro/24-08-26/Report-orchestratore-t6-r1-sk4-sk8-24-08-26.md`

Con: cappello · fatto · file · test · §5 skill · capsula R1 · handoff §10-bis · Q1–Q6 verbatim
(`CHIUSURA_SESSIONE.md`).

Aggiorna **solo** `PLAN_V0.md` (owner) e rigenera cruscotto:

```bash
npm run generate:mss:views
npm run validate:mss:views
```

**Non** dichiarare `WP-1` aperto · **non** dichiarare `H-1.3` PASS pulito.

---

## Sub-agent — quando lanciarli

| Sub-agent | Quando | Cosa restituisce |
|---|---|---|
| Esecutore R1 | Mandato 1 | diff + report + judgments |
| Revisore R1 | Dopo esecutore R1 | PASS/FAIL + amendment se serve |
| Esecutore SK-4 | Mandato 2 | diff + report |
| Revisore SK-4 | Dopo SK-4 | controverifica B1–B3 rieseguita |
| Esecutore SK-8 | Mandato 3 | test + report |
| Revisore SK-8 | Dopo SK-8 | M12 |

Tu (orchestratore) **non fidarti dei report**: riesegui gate §6 prima di promuovere stato in PLAN.

---

## Criterio di successo del ciclo T6 (per Matteo)

Matteo considera il ciclo riuscito se:

1. **R1:** chiude sedute con tre giudizi + capsula generata; scheda anti-errore esiste; meno retry documentato.
2. **SK-4:** i tre attacchi B1–B3 falliscono a comando (non a parole).
3. **SK-8:** promozione documentale + test nominato verde.
4. Owner e cruscotto allineati; CI MSS resta verde; nessun lavoro prodotto accidentalmente aperto.

**Firma Matteo:** chiusura formale SK-4 / SK-8 / R1 senza riserve resta sua dove il mandato lo prevede.

---

## Messaggio verbatim Matteo (24-08-2026 sera)

«Voglio completare: R1 - SK-4 - SK-8. SK10 lo farei più avanti. Prodotto calendario aspetta per ora.
Voglio chiudere bene le fondamenta, strumenti e test per strumenti in modo da poter usare MSS senza
pagare costi inutili per agenti e minimizzando errori di utilizzo. Poi proseguire con sviluppo e
testing come pilota quando è tutto pronto. Se ne occuperà codex in seduta orchestrator con sub agent.»
