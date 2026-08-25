# Manuale operativo MSS v0 — agente freddo

> **Scopo:** far lavorare un agente sul MetaSkillSystem **senza rileggere l’intero corpus**.
> **Non è owner di stato:** i conteggi mobili e i gate vivono nei comandi e in `PLAN_V0.md`.
> **Pacchetto:** `SK-10` — **CHIUSO** 25-08-26 (firma Matteo post-M-T8). **P2A** (manuale locale) e
> **P2B** (export + `mss:doctor`, §7). `R8` coperto da atti M-D/M-G/T9; owner in [`PLAN_V0.md`](PLAN_V0.md) §4-bis S10.

---

## 1. Cosa aprire (in ordine)

| Bisogno | File | Ruolo |
|---|---|---|
| Ingresso e smistamento | [`METASKILL_SYSTEM_SKILL.md`](METASKILL_SYSTEM_SKILL.md) | Tabella di routing; punta al manuale e agli owner |
| **Stato autoritativo** | [`PLAN_V0.md`](PLAN_V0.md) | Unico owner di `SYS-1`: gate, sequenza, §4-bis/§4-ter, §15 prossimo task |
| Fotografia tecnica recente | [`AUDIT_STATO_REALE_23-08-26.md`](AUDIT_STATO_REALE_23-08-26.md) | Rettifiche «dichiarato vs reale»; non sostituisce il plan |
| Schema capsula | [`CONTRATTO_CAPSULA_SESSIONE_V0.md`](CONTRATTO_CAPSULA_SESSIONE_V0.md) | Coppia viva `0.1.1` / `freeze-2`; dove vive la capsula; `controls` obbligatori |
| Chiusura report | [`../Comunicazione-Skill/CHIUSURA_SESSIONE.md`](../Comunicazione-Skill/CHIUSURA_SESSIONE.md) | Sezioni obbligatorie + Q1–Q6 per standard/deep |
| **Avvio orchestrazione** | [`PROMPT_AVVIO_ORCHESTRATORE_MSS.md`](PROMPT_AVVIO_ORCHESTRATORE_MSS.md) | Il prompt con cui si apre una chat di orchestrazione: ruolo, cosa leggere, prima azione. Corto per scelta, **senza data** perché resti uno solo; instrada al mandato vivo |
| **Mandato vivo** | [`PROMPT_ORCHESTRATOR_MSS_24-08-26.md`](PROMPT_ORCHESTRATOR_MSS_24-08-26.md) | Ciclo orchestratore: cosa vuol dire 100%, i mandati per famiglia, budget documentazione, controverifica. Sostituisce [`PROMPT_PROSSIMO_ESECUTORE_MSS_23-08-26.md`](PROMPT_PROSSIMO_ESECUTORE_MSS_23-08-26.md), che resta come storia |
| Vista continuità senior | [`Senior-Eval-Pack/HANDOFF_SENIOR_V0.md`](Senior-Eval-Pack/HANDOFF_SENIOR_V0.md) | Puntatore operativo; **vince** `PLAN_V0.md` se divergono |
| Vista sequenza SEP (parcheggiata) | [`Senior-Eval-Pack/ROADMAP_V0.md`](Senior-Eval-Pack/ROADMAP_V0.md) | Non è il fronte attivo; traccia `SK-*` come vista |

**Regola owner vs vista:** un valore dinamico ha **un solo owner** (`PLAN_V0.md` per stato MSS). Roadmap, handoff, audit e questo manuale **rimandano**, non ricopiano conteggi.

**Prima di agire:** `git rev-parse --abbrev-ref HEAD` → atteso `env/test` per lavoro MSS corrente; verifica HEAD vs `origin/env/test` e working tree (preserva modifiche altrui).

---

## 2. Comandi MSS (sola lettura salvo capsula)

Tutti i comandi partono dalla **root del repo**. Exit code `0` = esecuzione ok (non sempre = gate PASS).

### 2.1 `npm run mss:status`

| | |
|---|---|
| **Legge** | `PLAN_V0.md`, `Senior-Eval-Pack/MASTERPLAN_V0.md`, git (branch, HEAD, dirty, tag `mss*`, stash) |
| **Scrive** | nulla |
| **Argomenti** | nessuno |
| **Uso sicuro** | `npm run mss:status` — prima seduta o dopo lunga pausa |

Stampa Git + tabella §4 derivata dal plan. **Non** sostituisce la lettura di §4-ter se il task tocca chiusure SK. Segnala assenza tag ripristino (`SK-1` aperto).

### 2.2 `npm run mss:query -- --<domanda>`

| | |
|---|---|
| **Legge** | Report/Verbali sotto `docs/Sessioni di lavoro/` (HEAD + working tree), catena `amendment` via `core.mjs` |
| **Scrive** | nulla |
| **Domande** | `--regole` · `--modelli` · `--verifica` · `--fail` · `--costo` · opzionale `--json` |
| **Uso sicuro** | `npm run mss:query -- --verifica` · `npm run mss:query -- --fail` |

I denominatori sono **calcolati dal corpus** al momento del run (mai copiati da un report). La vista **effettiva** applica gli `amendment` del contratto §6.

### 2.3 `npm run validate:mss`

| | |
|---|---|
| **Legge** | File indicato (report, jsonl, session log) + snapshot git per append-only |
| **Scrive** | nulla |
| **Argomenti obbligatori** | `--mode file|worktree|staged` e `--file <path>` |
| **Opzioni** | `--kind report|jsonl|session_log` · `--require-capsule` · `--json` |
| **Uso sicuro** | `npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/GG-MM-AA/Report-….md" --kind report --require-capsule` |

Senza `--file` mostra usage ed esce `2` (intenzionale).

### 2.4 `npm run mss:capsule`

| | |
|---|---|
| **Legge** | `--judgments file.json`, env whitelisted, git porcelain, comandi `--check`, corpus (solo con `--verify`) |
| **Scrive** | stdout JSONL; con `--append-to` modifica **solo** report senza capsula esistente |
| **Obbligatori (generazione)** | `--model <modello>` · `--judgments <file>` (tre assi) |
| **Opzioni** | `--template` · `--check "ID=>comando"` (legacy: un solo `:`) · `--verify "record_id\|esito\|prova\|motivo"` · `--role` · `--tool` · `--package "id\|ver\|ref"` |
| **Uso sicuro** | `npm run mss:capsule -- --template` · `npm run mss:capsule -- --help` |

**Non** è chiusura automatica della seduta: serve giudizio umano/agente in JSON. D2/D3 sono **chiusi** (sintassi canonica `ID=>comando`, ambigui rifiutati).

Per chiudere una seduta standard/deep senza ricostruire questo capitolo, seguire la scheda operativa
di una pagina [`SCHEDA_CHIUSURA_META_R1.md`](SCHEDA_CHIUSURA_META_R1.md). La scheda è un promemoria
anti-errore: struttura del report e domande restano proprietarie di `CHIUSURA_SESSIONE.md`.

**R1 — ingresso compatto.** `npm run mss:capsule -- --template-r1` produce il file giudizi
minimo: soltanto `persona`, `sistema`, `output`. Con quel formato il generatore compone UUID,
timestamp, runtime, Git, `source_refs` e risultati dei `--check`; non inventa intent, soggetto o
follow-up, che restano `non_osservato`. **Busta non osservabile dalla chat** (riserva R1 ridotta
24-08-26): `area` e `observed_outcome` sono `non_osservato:…`; `session_type` / `capsule_status` /
template `privacy` enum sono **costanti di mode** (`R1_MODE_CONSTANTS` in `capsule.mjs`), non fatti
dedotti dalla conversazione. Un asse con `delta: nessuno` usa onestamente `assertions: []`; per ogni
altro delta l'asserzione resta obbligatoria. Il formato storico esteso resta compatibile per le
capsule esistenti.

✅ **`N3`/`N4` PROVATI — il controllo dichiara ora ciò che prova.** La diagnosi
precedente («le virgolette si perdono nel trasporto») è **falsa ed è stata falsificata con misura
diretta** in [`Report-controverifica-md-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-md-24-08-26.md) §6.
Le virgolette **arrivano intatte** a `process.argv`. La rottura è **a valle**, in `spawnCheckCommand`
(`spawnSync(cmd, { shell: true })`):

| Path dentro il comando registrato | Esito reale |
|---|---|
| **virgolette doppie** | **exit 0 — funziona, registralo pure** |
| nessuna virgoletta | exit 1 — il `fail` falso |
| **virgolette singole** | **exit 1 su Windows** — `shell: true` usa `cmd.exe`, che non le riconosce |

**In pratica:** un path con spazi nei `controls[]` **si registra**, con virgolette **doppie**. La
trappola sono le **virgolette singole**, perché sono l'abitudine POSIX. Su Windows l'attrezzo emette
un avviso leggibile anche per un path probabilmente non quotato: non attribuisce in silenzio il
fallimento al bersaglio. Puoi associare a ogni `--check` immediatamente precedente
`--check-expect <exit>` (intero ≥ 0): un controllo che deve fallire registra `pass` solo se esce
con l'exit code dichiarato.

✅ **`N4` PROVATO — `--check` confronta l'exit code atteso.** Senza `--check-expect` resta
compatibile e attende `0`; con l'opzione registra sia exit reale sia atteso nel criterio. Un comando
nella denylist chiusa di controlli non falsificabili (`git status --short`, `true`, `echo`,
`mss:query -- --verifica`, …) con atteso `0` è **rifiutato** (exit `2`, nessuna scrittura): non
diventa un `pass` vacuo. Con `--check-expect` ≠ `0` lo stesso comando resta ammissibile (prova a
segno invertito). Test: `capsule: N4 / SK-7 — controllo infallibile deny` in `test:mss:tools`.

✅ **`N6` PROVATO — `mss:doctor`, passo `owner`, legge solo gli owner.** Una repo appena
`git init`ata può dichiarare Git non ricostruibile senza far diventare rosso il passo owner: il
controllo analizza soltanto il blocco di stato derivato dagli owner e segnala l'owner solo quando è
davvero assente o non interpretabile.

⚠️ **Due separatori diversi nello stesso attrezzo:** `--check` usa `=>`, `--verify` usa `|`.

**`N1` PROVATO 24-08-26 (`M-C`).** L'attrezzo ora esegue `validateMss` sul bundle **prima** di scrivere: con `--append-to` valida il report **prospettico** (`--require-capsule`), altrimenti il solo JSONL. Se esce rosso: exit `2`, diagnostica su stderr, **nessuna scrittura**. La guardia «il report ha già una capsula» usa la stessa definizione del validator (`parse.mjs::findCapsuleHeadings`), quindi riconosce anche le intestazioni numerate (`## 6-bis. Capsula MetaSkillSystem`). Esegui comunque `validate:mss` dopo: è il gate dichiarato, non un doppione.

**`N2` PROVATO 24-08-26 (`M-C`).** Un revisore registra una verifica con `--verify "<mss-rec-…>|<esito>|<evidence_ref>|<motivo>"` (ripetibile): l'attrezzo emette un `amendment` conforme al contratto §6, leggendo i valori precedenti **dal record bersaglio**. Bersaglio ed esito non si deducono; `self_report` è rifiutato (un secondo attore non può ridichiarare l'autodichiarazione altrui). Se `--role` nomina un revisore e la seduta non emette nessun amendment, l'attrezzo **avvisa** e non blocca. Il template resta con `verified_by: []`: è la verità per una seduta che non ha verificato nessuno.

✅ **`R-T7-06` / Opzione B PROVATO 25-08-26.** Se il bersaglio è asse **Output** con esattamente una `assertions[]`, lo stesso `--verify` rettifica anche `annotation.assertions[0].verification_status` e `verification_or_use_evidence` (oltre a `annotation.verification.*`). Non riscrive il record `final`; non allenta il validator; multi-assertion o assertions vuote → exit `2` con messaggio esplicito (indice > 0 resta amendment manuale). Test: `capsule: R-T7-06 / Opzione B — --verify patcha assertions[] Output` in `test:mss:tools`.

### 2.4-sexies `npm run mss:review` — che cosa ho toccato (sola lettura)

| | |
|---|---|
| **Legge** | diff Git (`--base`, default `HEAD`) + eventuale `--report`; classificazione L1–L6 da `archive/README.md` |
| **Scrive** | nulla |
| **Argomenti** | `--base <ref>` · `--report <path>` · `--json` · `--help` |
| **Uso sicuro** | `npm run mss:review` · `npm run mss:review -- --json` |

**`T2` / `SK-3` PROVATO** (questa seduta), **non `CHIUSO`:** serve controverifica famiglia diversa
(`M12`). Contratto minimo = `STRATEGIA-scheletro-mss-21-08-26.md` §3.2: tabella di fatti (file +
livello, ⚠️ owner di stato, ⚠️ L5/L6, regole citate senza inventare G/O/E, mancanze capsula/Q1–Q6/gate,
comandi solo se ricostruibili dalla capsula). Test nominato:
`T2 / mss:review — seduta con violazione nota la trova; seduta pulita non inventa` in
`npm run test:mss:tools`.

✅ **`N5` PROVATO — un verificatore nominato richiede uno stato coerente.** `--verify` ammette
solo `independently_verified` o `contradicted`; il validator applica la stessa regola al dato
effettivo dopo gli amendment, così un record `unverified` o `not_applicable` non può dichiarare un
verificatore da nessuna strada.

### 2.4-bis `npm run mss:doctor` — checklist di primo run

| | |
|---|---|
| **Legge** | `mss.config.json` (o i default), il manifesto di export, gli owner, il corpus; lancia le suite |
| **Scrive** | nulla |
| **Argomenti** | nessuno |
| **Uso sicuro** | `npm run mss:doctor` — dopo un'installazione, o quando «non si capisce se funziona» |

Esce `0` **solo** se tutti i passi sono verdi. Due passi sono prove **attive**, non osservazioni:
«perimetro» verifica che la regex segua la config in entrambe le direzioni (accetta il path giusto
**e** rifiuta quello sbagliato) e «sa dire di no» dà in pasto al validator un report che *deve*
essere rifiutato — un motore inerte passerebbe qualunque conteggio e cadrebbe lì.

⚠️ **Un corpus vuoto è un FAIL, non un pass.** «Zero record, tutto ok» è il falso verde che `R2`
vieta ed è la stessa forma di `N4`. In una repo appena installata il primo `mss:doctor` è rosso per
costruzione: diventa verde quando una seduta vera è stata chiusa. Test che lo asserisce:
`npm run test:mss:tools` (cerca «corpus vuoto»).

### 2.4-ter `npm run mss:export -- --to <dir>` — installa il motore altrove

| | |
|---|---|
| **Legge** | il manifesto di export (`scripts/mss/*.mjs` scoperti dalla cartella + un elenco esplicito) |
| **Scrive** | **solo nella destinazione**, e non sovrascrive file esistenti senza `--force` |
| **Uso sicuro** | `npm run mss:export -- --help` · `npm run mss:export -- --to /percorso/repo/nuova` |

Il motore non ha dipendenze npm esterne: l'export **non è packaging**, è una copia di cartella. Non
c'è nessun bundle da costruire e nessun pacchetto da pubblicare. Dopo la copia il comando risolve
ogni import relativo dei file copiati: se manca un modulo esce rosso invece di consegnare un motore
monco. Scrive un `mss.config.json` di default se assente e un marcatore `.mss-vendored` nella
cartella dei documenti copiati, perché i loro link parlano dell'albero di origine.

### 2.4-quater `npm run generate:mss:views` — rigenera le viste di progetto

| | |
|---|---|
| **Legge** | gli owner dichiarati dalla singola vista |
| **Scrive** | solo fra i marcatori `<!-- mss:generated … inizio/fine -->` della vista bersaglio |
| **Uso sicuro** | `npm run generate:mss:views` dopo una modifica all'owner |

La prima vista e il cruscotto di Matteo; dal mandato D14 anche ROADMAP e HANDOFF del Senior-Eval-Pack
sono generate dallo stesso owner. Fuori dai marcatori resta testo umano; dentro non si corregge a
mano. Il generatore deriva da `PLAN_V0.md`:

- **Gate** (ultimo ciclo, prossima azione, R1) — come `mss:status`
- **L'ultimo ciclo chiuso** — ultimo §15 con pattern «eseguito e **STATO**» (cruscotto)
- **Lavagna** — solo se §4/§4-bis hanno righe: tre colonne (Fatte / Con riserva / Da fare) con
  conteggi; stato da M (§4-ter prevale); etichetta da §4-quater se presente, altrimenti etichetta tecnica;
  righe M non classificabili compaiono come **Non classificate** (conteggio in testa + elenco sotto)
- **Riserve aperte** — celle con ⚠️ in M; omessa se vuota
- **Errore glossa orfana** — id in §4-quater assente da M
- **ROADMAP / HANDOFF** — stessa lavagna/gate; niente HEAD ne conteggi di test congelati (solo
  rimandi ai comandi)

`npm run validate:mss:views` rigenera in memoria e confronta: se owner e vista
divergono esce rosso e indica il comando di rigenerazione. È un attrezzo **di questo progetto**,
non una capacità esportata dal motore nelle repo ospiti.

### 2.4-quater-bis `npm run mss:views-html` — cruscotto HTML a mano (fuori cancelli)

| | |
|---|---|
| **Legge** | `PLAN_V0.md` (stesso parser M+D di `generate:mss:views`) + `git log -1 --format=%cI` + roadmap privata §3 se leggibile |
| **Scrive** | un `.html` **fuori** da `docs/` versionati (default: scratchpad Cursor); rifiuta `--out` sotto `docs/` |
| **Uso sicuro** | `npm run mss:views-html` oppure `node scripts/mss/views-html.mjs [--out path] [--plan path] [--roadmap path]` |
| **Cancelli** | **non** è in `validate:mss:all` / CI — solo invocazione manuale |

Cantieri L6/privati restano solo nell'HTML locale; non entrano nel `.md` versionato.

### 2.4-quinquies `npm run mss:move -- <sorgente> <destinazione>` — sposta e aggiorna i link vivi

| | |
|---|---|
| **Legge** | il file sorgente + i docs vivi (stesso perimetro di `validate:docs`) + citazioni path in `scripts/` |
| **Scrive** | sposta il file; aggiorna i riferimenti vivi; opzionale stub di redirect al path vecchio (TTL 30g) |
| **Uso sicuro** | `npm run mss:move -- --help` · prova in sandbox prima di atti vivi |
| **Forma** | **una sola:** `npm run mss:move -- <sorgente> <destinazione> [--no-stub] [--skip-validate]` |

Effetti: (1) sposta/rinomina nel working tree; (2) aggiorna link markdown e path citati nei docs
vivi e nelle stringhe path sotto `scripts/`; (3) **non** riscrive la storia sotto
`Sessioni di lavoro` / Archivio; (4) esce rosso senza scrivere a metà se sorgente assente,
destinazione occupata, zona congelata (L5 prove / L6 privato / storia sedute) o
`validate:docs` rosso dopo il move — in quel caso **annulla**. Baseline costo manuale
documentata: ≈ 1 741 righe (`R6` / `D15`); l'attrezzo stampa il delta righe del proprio run.

**`T1`/`R6` PROVATO in `M-E` (24-08-26), non `CHIUSO`:** serve controverifica famiglia diversa
(`M12`). Test: `npm run test:mss:tools` cerca `T1/R6`.

### 2.5 Suite e cancelli globali

| Comando | Legge | Scrive | Quando |
|---|---|---|---|
| `npm run test:mss` | Fixture H-1 + integrazione | nulla | Dopo tocchi validator/core/adapter |
| `npm run test:mss:tools` | Attrezzi query/status/capsule | nulla | Dopo tocchi `scripts/mss/*.mjs` |
| `npm run validate:docs` | Path citati nei `.md` vivi | nulla | Dopo tocchi docs o link |
| `npm run validate:app` | `lint` + `typecheck` + `test` (codice `src/`) | nulla | Chi tocca `src/` |
| `npm run validate:mss:all` | `test:mss` + `test:mss:tools` + `validate:mss:views` + `validate:docs` | nulla | Chi tocca `scripts/mss/`, `docs/` o gli hook — **non** include `mss:views-html` |
| `npm run validate` | `validate:app` + `validate:mss:all` (i due composti, in sequenza) | nulla | Chi prepara una PR |

### 2.6 Comandi **non** implementati (non inventarli)

_(nessuno al momento — `mss:review` è in §2.4-sexies)_

---

## 3. Flussi minimi per tipo di seduta

### 3.1 Light (fix piccolo, una zona)

1. Carica skill d’area da `APP_CONTEXT_SKILL.md` §0 — **non** questo manuale intero se il task è fuori Meta.
2. Esegui il fix; **nessun** `Report-*.md`.
3. Chiudi con JSONL in `docs/Sessioni di lavoro/GG-MM-AA/eventi-light/<record_id>.jsonl` + riga in `SESSION_LOG.md` (link, non capsula inline).
4. Validazione: `validate:mss` sul file jsonl se tocchi schema.

### 3.2 Standard / deep (Meta o lavoro sostanziale)

1. `npm run mss:status` + leggi §15 di `PLAN_V0.md` (task autorizzato e STOP).
2. Carica `METASKILL_SYSTEM_SKILL.md` + contratto capsula + skill area se applicabile.
3. Dichiara perimetro: cosa è vietato (es. WP-1, commit, SK-7 reimplementazione silenziosa).
4. Lavora; registra comandi reali per `controls[]`.
5. Chiudi con `Report-*.md` completo (`CHIUSURA_SESSIONE.md` Parte A) + capsula `0.1.1`/`freeze-2`.
6. Verifica obbligatoria:
   - `npm run validate:mss -- --mode file --file "<report>" --kind report --require-capsule`
   - se codice MSS: `npm run test:mss` e/o `npm run test:mss:tools`
   - `git diff --check`
7. Se Meta/deep: handoff §10-bis + Q1–Q6 §11 verbatim.

### 3.3 Revisione (famiglia di modello diversa consigliata, non gate)

1. Ricevi report + capsula + diff — **non** la narrativa completa del verdetto atteso.
2. `npm run mss:query -- --verifica` e `--fail` per misure indipendenti.
3. Riesegui comandi citati in `controls[]`; confronta hash/path (`git rev-parse HEAD:path`).
4. Esito in report proprio + annotazioni `independently_verified` / `contradicted` via **`amendment`**, mai rewrite di record `final`.
5. `validate:mss` sul report revisore.

---

## 4. Validare report e capsula

### Report standard/deep

Sezioni obbligatorie: cappello · fatto · file · test · skill §5 · comunicazione §6 · capsula §6-bis · analisi flusso · lettura agente · derivazione errori · resta · handoff (deep/Meta) · **domande §11**.

### Capsula

- Coppia **viva:** `schema_version: mss.session/0.1.1` + `system_revision: mss-v0.1-wp0.1-freeze-2`
- `session_event` + tre `annotation` (Persona, Sistema, Output) salvo delta esplicitamente `nessuno`
- `controls` obbligatorio: array di prove **o** `nessuno` dichiarato
- Ogni controllo: `criterio`, `esito`, `numeratore`, `denominatore`, `esecutore`, `evidence_refs`

### Gate meccanico

```bash
npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/GG-MM-AA/Report-….md" --kind report --require-capsule
```

Pre-commit (se committi): stesso perimetro `Report-*` / `Verbale-*` con `requireCapsule: true` — fixture H-1 escluse.

---

## 5. Limiti reali correnti (non riaprire da soli)

| Limite | Stato | Cosa fare |
|---|---|---|
| **SK-7 D2/D3** | APERTO — prove false possibili in `mss:capsule` | Gate Matteo: (A) patch recuperabile o (B) autorità reimplementazione |
| **WP-1** | **NO-GO** | Non aprire piloti reali |
| **H-1.3** | `PASS_CON_RISERVE` | Non dichiarare PASS pulito |
| **Tag ripristino** | `mss/baseline-h13` posato 24-08-26 su HEAD pre-M-A/M-B e **pubblicato su origin** (decisione `M5`) | Ritorno: `git reset --hard mss/baseline-h13`; mai forzato su origin senza conferma di Matteo |
| **Hook Claude** | `guard-prod.mjs` + `settings.json` tracciati da git (24-08-26); casi `A1`/`A2`/`A3`/`A4` nel nome, verificarli con `npm run test:mss` | `settings.local.json`/`mcp.json` restano personali per design — mai tracciarli (`test:mss` lo verifica) |
| **Cloud / Codex / Claude senza stop** | Hook `stop` **non installabile** su Cloud/remote; fallback Opzione B (M-E2-C): checklist in `CHIUSURA_SESSIONE.md` + CI `validate:mss:changed` | Non promettere hook Cloud; matrice `stop_does_not_cover_cloud_codex_claude` + `cloud_codex_claude_fallback_checklist_plus_ci` |
| **guard PROD** | Tracciato e coperto (Cursor+Claude+kit) da `npm run test:mss`; cancello CI = `npm run validate:mss:all`, **osservato verde su GitHub Actions reale il 24-08-26** | Prima di scritture Supabase verificare comunque l'ambiente a mano: il test copre la logica, non sostituisce la prudenza umana |
| **SK-4 / SK-5 / SK-11** | APERTI post-audit | Chiusura formale solo Matteo; bypass residui in prosa |
| **ROADMAP / HANDOFF generati** | `D14` ROADMAP+HANDOFF **PROVATO** (indice report ancora manuale) | `npm run generate:mss:views` / `validate:mss:views`; test `D14/V1` |

---

## 6. Owner, viste, dati mobili

| Tipo | Esempi | Regola |
|---|---|---|
| **Owner** | `PLAN_V0.md`, contratto capsula, `PARAMETRI_MACRO_V0.md` | Fonte autoritativa; si legge per gate e sequenza |
| **Viste** | ROADMAP, HANDOFF, AUDIT, questo manuale, report | Rimandano all’owner; aggiornare dopo mutazioni provate |
| **Dati mobili** | N° sedute, controlli, revisori, esiti `--fail` | **Solo da comando** (`mss:query`, `test:mss`, …) al momento del run |

Se un report e `mss:query` divergono, vince il corpus letto dal comando + spiegazione dell’origine (HEAD vs working tree).

---

## 7. Bootstrap in altra repo (P2B — procedura provata 24-08-26)

**P2A** rende MSS scopribile nella repo attuale. **P2B** è la procedura per portarlo altrove, ed è
di tre comandi:

```bash
npm run mss:export -- --to /percorso/repo/nuova   # 1. copia (non è packaging: zero dipendenze npm)
# 2. rispondi all'intervista in mss.config.json: sessionsDir · reportKinds · owners
npm run mss:doctor                                 # 3. checklist di primo run, nella repo nuova
```

I dettagli dell'intervista e della checklist stanno in
[`../../_skill-system-v0/MANUALE_AVVIO.md`](../../_skill-system-v0/MANUALE_AVVIO.md) passo 0 e
passo 10 — qui non si duplicano.

**Che cosa è parametrico e che cosa no.** `mss.config.json` decide i path che l'**installazione**
possiede: cartella delle sedute, prefissi dei file di chiusura, file owner (`pack` può essere
`null`). **Default identici ai valori cablati prima**, quindi questa repo non configura nulla. Sono
invece **interni al motore per scelta**: il layout delle fixture (`test:mss` le inchioda per sha256:
una manopola che la suite non può seguire è peggio di nessuna manopola) e l'eccezione storica per
sha256 in `parse.mjs`.

**Che cosa non è portabile, e lo dichiara.** Alcuni gruppi delle suite non provano il motore:
provano che *questa* repo ha certi file — i report storici inchiodati, le guardie PROD con i ref di
questo progetto, gli hook cablati nell'IDE. In una repo ospite escono `n/a` con il nome dell'ancora
mancante: mai saltati in silenzio, mai contati come verdi, e se non restasse in piedi nessun gruppo
la suite esce rossa.

**Stato di `R8`: `PROVATO`, non `CHIUSO`** (la chiusura è solo di Matteo). La prova è registrata nel
report `M-D` del 24-08-26: repo vergine con `git init`, cartella delle sedute **rinominata** e owner
**rinominato**, primo `mss:doctor` rosso sul corpus vuoto, seduta chiusa con report + capsula,
`validate:mss` verde, secondo `mss:doctor` verde.

---

## 8. STOP globali (arresto obbligatorio)

- Task richiede WP-1, move, o chiusura `SK-*` senza mandato in §15
- Due owner si contraddicono → rileggi §4-ter del plan
- Scrittura su PROD Supabase senza conferma (`rwuxgvld`)
- Reimplementazione SK-7 senza gate A/B
- Commit/push senza «sì» esplicito di Matteo
- Completare campi capsula per plausibilità

---

## 9. Riferimenti rapidi post-P1

- P0 SK-7 assenza: `docs/Sessioni di lavoro/23-08-26/Report-p0-sk7-assenza-fix-23-08-26.md`
- P1 D1/D4/D5: `docs/Sessioni di lavoro/23-08-26/Report-p1-d1-d4-d5-23-08-26.md`
- P2A manuale: `docs/Sessioni di lavoro/23-08-26/Report-p2a-manuale-mss-23-08-26.md`

**Prossimo dopo P2B:** vedi `PLAN_V0.md` §15 — questo manuale non è owner di sequenza.
