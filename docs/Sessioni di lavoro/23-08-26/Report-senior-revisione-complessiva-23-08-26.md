# Revisione senior complessiva MetaSkillSystem — 23-08-26

**Modalità:** deep

**Esito sintetico:** le chiusure tecniche di `SK-4` e `SK-11` sono sostanzialmente dimostrate, ma con riserve documentali e di integrazione; la chiusura Senior Cursor è accettabile come fotografia della propria seduta, con viste oggi obsolete; `SK-5` deve essere corretto perché il nuovo gate MSS è irraggiungibile nella CI corrente. Nessun pacchetto viene dichiarato `CHIUSO` da questa revisione.

## 1. Identità e provenienza del revisore

| Campo | Valore reale |
|---|---|
| Provider | OpenAI |
| Modello | Codex basato sulla famiglia GPT-5 |
| Runtime | Codex, workspace Windows, shell PowerShell |
| Famiglia effettiva | OpenAI / Codex / GPT-5 |
| Ruolo | revisore senior finale, sola lettura più questo report |

La classificazione è distinta per cantiere e resta deliberatamente conservativa:

| Perimetro | Autori dichiarati nei record | Rapporto col revisore | Classificazione usata |
|---|---|---|---|
| Cursor `SK-4` | Cursor Composer per E1/E4/R1; Cursor Claude per E2/E3 | alcune sottofasi dichiarano Claude, ma Composer non espone una famiglia verificabile e il pacchetto è misto | `self_report` sul pacchetto; nessuna indipendenza estesa per cortesia |
| Chiusura Senior Cursor | Cursor Auto | famiglia sottostante non verificabile dai dati disponibili | `self_report` |
| Codex `SK-11` | OpenAI GPT-5 / Codex | stessa famiglia del revisore | `self_report` |
| Codex `SK-5` | OpenAI GPT-5 / Codex | stessa famiglia del revisore | `self_report` |
| Integrazione complessiva | lavoro misto Cursor + Codex, commit attribuito a Matteo con co-autore Cursor | famiglia mista e provenienza non separabile nel commit | `self_report` |

Le prove sono autonome sul piano operativo, ma non trasformano automaticamente la provenienza in una certificazione indipendente di famiglia.

## 2. Obiettivo e perimetro

Ho confrontato i cinque perimetri richiesti contro codice, diff `origin/env/test..HEAD`, owner, piani, handoff, capsule, test reali e controprove isolate. Ho letto integralmente il contesto obbligatorio indicato dal mandato, oltre a `AGENTS.md`, `.claude/CLAUDE.md`, routing e dipendenze dirette del MetaSkillSystem.

L’unica scrittura autorizzata e compiuta nel workspace principale è questo report. Le mutazioni probanti sono state effettuate soltanto in tre cloni temporanei isolati e poi rimosse.

## 3. Baseline Git reale

Baseline rilevata prima delle prove:

| Dato | Valore |
|---|---|
| Branch | `env/test` |
| `HEAD` | `d1598b64a545fc988b3f4db3c8650858a3de493d` |
| Parent | `eee6cf7c10e4c8a58afdcc2af7e55b9e66c9c26a` |
| `origin/env/test` locale | `eee6cf7c10e4c8a58afdcc2af7e55b9e66c9c26a` |
| `origin/env/test` remoto, verificato con `git ls-remote` | `eee6cf7c10e4c8a58afdcc2af7e55b9e66c9c26a` |
| Divergenza | behind `0`, ahead `1` |
| Stato iniziale | pulito: nessun tracked modificato, nessun untracked |
| Commit corrente | `feat(mss): SK-4 chiude tre bypass enforcement (PROVATO 23-08-26)` |
| Autore/committer | `Matteo-Exp-Transformer`, con trailer `Co-authored-by: Cursor` |
| Data commit | `2026-08-23T11:27:42+02:00` |
| Ampiezza | 43 file, +3588/-237 |

Il commit è preesistente a questa revisione e non è stato creato da me. Riunisce `SK-4`, Senior, `SK-11` e `SK-5`, benché il titolo citi soltanto `SK-4`. Questo contraddice la fotografia dei report e handoff, che dichiarano ancora “nessun commit/push”, e soprattutto rende la revisione non più realmente pre-commit. Il push non è avvenuto: il remoto resta un commit indietro.

Durante la revisione, dopo il cleanup dei cloni e a baseline già registrata, è comparso il file concorrente non tracciato `docs/Sessioni di lavoro/23-08-26/Report-revisione-indipendente-sessione-mss-23-08-26.md`. Non coincide col target di questo report, non è stato aperto o modificato e resta attribuzione non verificabile.

Confronto finale: la baseline era pulita; al termine non esistono modifiche tracked e `git status --short` mostra esattamente due untracked, cioè questo report autorizzato e il report concorrente appena citato. Le root temporanee della revisione residue sono `0`.

## 4. Mappa di attribuzione dei file

| Cantiere | File applicativi/documentali attribuiti | Note di condivisione |
|---|---|---|
| Cursor `SK-4` | `scripts/mss/adapter.mjs`, `git-adapter.mjs`, `core.mjs`, `rules.mjs`; contratto; `FX-I11`; manifest; builder H-1; piano, handoff e report `SK-4` | `query.mjs` è condiviso con `SK-11`; `PLAN_V0.md` è owner condiviso |
| Senior Cursor | i due `fine-sessione-senior.mjs`; `HANDOFF_SENIOR_V0.md`; `ROADMAP_V0.md`; template `EVOLUZIONE_SKILLS.md`; prompt/report Senior | nessun codice `SK-4` attribuito al Senior |
| Codex `SK-11` | `.eslintrc.cjs`; `runtime.mjs`, `status.mjs`, seam e testi di `query.mjs`; runner tools; `_test-email-once.mjs`; `sync-to-prenotazen.mjs`; script package | `package.json` è condiviso con `SK-5` |
| Codex `SK-5` | `.github/workflows/ci.yml`; `scripts/mss/validate-changed-reports.mjs`; script package | l’helper delega al CLI canonico, ma duplica il nome `REPORT_PATH_RE` |
| Trasversale | `PLAN_V0.md`, indice sessione, piani/handoff/report di ciclo, `package.json`, `query.mjs` | tutto è stato schiacciato nel singolo commit `d1598b6` |

Il controllo automatico sull’unione dei perimetri ha esaminato tutti i 43 path del commit e trovato `0` path fuori dall’unione autorizzata. Nessun report con record `final` già esistente è stato modificato: i report di sessione nel commit risultano tutti aggiunti, quindi l’append-only storico è preservato nel diff esaminato.

## 5. Revisione Cursor `SK-4`

### Esito tecnico

- B1 è reale: un record nuovo con coppia `0.1.0` / `freeze-1` viene respinto da `MSS-LEGACY-NEW-FORBIDDEN`.
- La coppia viva `0.1.1` / `freeze-2` richiede `controls`; contratto, builder, manifest e 42 fixture risultano coerenti.
- B2 e B3 sono reali: la regex esportata da `adapter.mjs` riconosce `Report-*` e `Verbale-*` anche in sottocartelle; `git-adapter.mjs` e `query.mjs` la importano.
- Le capsule storiche restano append-only; la fixture legacy è nuova e volutamente rossa.
- `npm run test:mss` è verde con 42 fixture e 32 gruppi di contratto/integrazione.

### Controprove isolate

Clone: `.tmp-senior-review-23-08-26/sk4`, path assoluto verificato prima della rimozione.

| Caso | Comando sostanziale | Path probante | Exit | Codice MSS |
|---|---|---|---:|---|
| B1 | `node scripts/mss/cli.mjs --mode file --file docs/MetaSkillSystem/_audit/legacy-new.jsonl --kind jsonl` | `docs/MetaSkillSystem/_audit/legacy-new.jsonl` | 1 | `MSS-LEGACY-NEW-FORBIDDEN` |
| B2 | `node scripts/mss/cli.mjs --mode staged --file <Report> --require-capsule` | `docs/Sessioni di lavoro/23-08-26/_audit/sub/Report-deep-no-capsule.md` | 1 | `MSS-REPORT-NO-CAPSULE` |
| B3 | `node scripts/mss/cli.mjs --mode staged --file <Verbale> --require-capsule` | `docs/Sessioni di lavoro/23-08-26/_audit/sub/Verbale-standard-no-capsule.md` | 1 | `MSS-REPORT-NO-CAPSULE` |
| verde post-rimozione | stesso staged validator sul path rimosso | nessuna entry staged | 0 | `validate:mss OK` |

Il clone era pulito dopo la rimozione delle sole evidenze e la root temporanea è stata eliminata.

### Riserve

1. Esistono due costanti denominate `REPORT_PATH_RE`: quella canonica in `adapter.mjs:13` e quella più stretta dell’helper `validate-changed-reports.mjs:9`. La seconda serve alla selezione Report-only di `SK-5`, ma viola letteralmente il claim “una sola definizione” e crea una seconda policy regex.
2. `query.mjs:320`, `:1010` e `:1034` descrive ancora il perimetro come soli `Report-*.md`, mentre il codice legge anche `Verbale-*`.
3. Il report E1, riga 29, afferma che `Report-tiramisù-removal-db-migration-28-05-26.md` resti escluso. La prova reale con `git ls-tree` e regex esportata dà `true`; i path canonici riconosciuti a `HEAD` sono 431.

Verdetto `SK-4`: **ACCETTA CON RISERVE**. I tre bypass sono chiusi nel codice; vanno corretti i claim e rimossa o resa esplicitamente distinta la duplicazione regex prima di considerare pulita l’integrazione.

## 6. Revisione chiusura Senior Cursor

- Entrambi gli hook superano `node --check`.
- Gli hash diversi sono intenzionali: il file progetto contiene path concreti, il template usa configurazione portabile. La correzione semantica “template tracciato, non assumere gitignore” è presente in entrambi.
- `git ls-files _skill-system-v0` restituisce 31 file; `git check-ignore _skill-system-v0` esce 1, quindi il vecchio claim “gitignored” era realmente falso.
- Le ricerche statiche mostrano sole API di lettura dal filesystem; non compaiono API di scrittura o subprocess. L’esecuzione di entrambi con guardia `stop_hook_active:true` esce 0, non produce output e lascia invariati gli hash SHA-256.
- Il report Senior passa il validatore MSS con capsula obbligatoria e non riscrive record final storici.
- I gate riprodotti `mss:status` e `mss:query -- --verifica` escono 0. Le metriche storiche del report Senior sono coerenti con la fotografia `eee6cf7`, non con il successivo `HEAD`.

Riserva: `ROADMAP_V0:58-59`, `HANDOFF_SENIOR_V0:122-169` e `INDICE-SESSIONE:13-17` sono oggi obsoleti: mostrano `SK-11` fermo ad A1–A4/A5 e `SK-5 NON INIZIATO`, mentre `PLAN_V0` e il codice dichiarano i relativi gate tecnici provati. La chiusura Senior era coerente al proprio istante, ma non è più una vista corrente affidabile dopo il cantiere Codex.

Verdetto chiusura Senior Cursor: **ACCETTA CON RISERVE**. Hook e consegna della seduta sono corretti; le viste derivate devono essere riallineate o marcate chiaramente come snapshot non corrente.

## 7. Revisione Codex `SK-11`

Tutti i criteri tecnici richiesti sono riprodotti:

- import di `query.mjs` e `status.mjs`: exit 0 e `0` byte catturati;
- nessun `process.exit` nei moduli importabili; la guardia ESM e la root discovery sono condivise in `runtime.mjs`;
- parità byte-per-byte CLI/seam su query summary, `--verifica`, `--json`, opzione ignota e status: 5/5;
- amendment effettivi delegati a `core.mjs::applyAmendmentsView()`; la query rende e classifica il risultato senza duplicare l’applicazione;
- sette scenari query e due status sono distinti, sintetici, offline e deterministici;
- collisione preview resa nel testo e valori interi preservati nel JSON;
- tie-break stabile su `record_id` anche con input invertito;
- lint copre `scripts/**/*.mjs` con `--no-ignore` e `--max-warnings 0`; `no-console` non è disattivato globalmente;
- `_test-email-once.mjs` usa il logger CLI; la regex di `sync-to-prenotazen.mjs` contiene gli spazi espliciti autorizzati;
- `test:mss:tools` è autonomo ed è incluso in `validate`.

### Controprova rossa e inversa

Nel clone `.tmp-senior-review-23-08-26/sk11` è stata modificata una sola aspettativa del primo test.

| Stato | Risultato |
|---|---|
| Hash prima | `97956F5B187F700896AB4639F55184852331A0F9B1DF5F85CCCF28D45C9DCBB9` |
| Rosso | exit 1, `MSS tools suite red: 1/9 tests failed` |
| Patch inversa | ripristino della sola asserzione |
| Verde | exit 0, `MSS tools suite green: 9 tests` |
| Hash dopo | identico al precedente |
| Diff/stato clone | pulito |

Riserva: `Report-ciclo-SK-11-SK-5-23-08-26.md:138` e `:262` dichiara `git diff --check` exit 0, ma il controllo significativo `git diff --check origin/env/test..HEAD` esce 2 e segnala 110 righe di output, soprattutto trailing whitespace nei documenti aggiunti. Il comando senza range esce 0 soltanto perché il worktree tracciato è pulito e non verifica il commit già creato.

Verdetto `SK-11`: **ACCETTA CON RISERVE**. Il codice e la suite sono solidi; la prova documentale sul diff deve essere rettificata con amendment o con evidenza che specifichi il range reale.

## 8. Revisione Codex `SK-5`

Gli elementi locali sono corretti:

- trigger su push e pull request verso `main` ed `env/test`;
- checkout `fetch-depth: 0` e ref della head PR;
- gate applicativi preesistenti conservati;
- passi separati per report MSS, H-1 e tools;
- helper limitato ai `Report-*.md` aggiunti o modificati, con messaggio esplicito nel caso vuoto;
- delega esatta al CLI con `--mode file --kind report --require-capsule`;
- gestione base/head, zero SHA, parent fallback e path con argomenti non concatenati;
- YAML parsato con il package `yaml`: exit 0.

### Prova isolata

Nel clone `.tmp-senior-review-23-08-26/sk5`:

| Passo | Risultato |
|---|---|
| Base | `d1598b64a545fc988b3f4db3c8650858a3de493d` |
| Head rossa | `fde88d1c1445039ddb11e8fa88a13ffb4f4ebc78` |
| Report | `docs/Sessioni di lavoro/23-08-26/_audit/deep/Report-ci-invalid.md` |
| Comando | `node scripts/mss/validate-changed-reports.mjs --base <base> --head <head> --repo <temp>` |
| Rosso | exit 1, `MSS-REPORT-NO-CAPSULE`, path esplicito, `ROSSO: 1/1` |
| Head verde dopo rimozione | `a248b7d61004605a30ba81ee10ffbe84ec11e85f` |
| Verde | exit 0, `OK: nessun Report-*.md aggiunto o modificato` |
| Stato clone | pulito |

### Difetto bloccante

Nel workflow reale `Validate doc paths` precede `Validate changed MSS reports`. `npm run validate:docs` esce 1 sulla baseline dichiarata di 17 path rotti. GitHub Actions interrompe il job a quel passo: pertanto il gate report MSS, H-1 e tools non sono raggiungibili in nessuna esecuzione corrente, pur essendo corretti se lanciati isolatamente.

Verdetto `SK-5`: **CORREGGERE**. Criterio di accettazione: una simulazione o run CI deve attraversare tutti i passi MSS; ciò richiede che il gate documentale precedente sia verde oppure che l’ordine/semantica del workflow renda eseguibili i gate MSS senza nascondere il fallimento docs.

## 9. Revisione trasversale e collisioni

1. Il singolo commit `d1598b6` mescola cinque perimetri e usa un subject `SK-4`; l’attribuzione fine resta ricostruibile dal diff, ma non dal commit come unità atomica.
2. `query.mjs`, `PLAN_V0.md` e `package.json` sono realmente condivisi. Non risultano sovrascritture funzionali perse, ma le viste Senior e l’indice non sono state aggiornate dopo `SK-11`/`SK-5`.
3. La seconda `REPORT_PATH_RE` dell’helper CI è una duplicazione di policy, benché non reimplementi le regole di validazione MSS.
4. La suite completa resta verde; non emergono regressioni applicative.
5. `git diff --check` sul range reale è rosso, mentre più report lo danno verde.
6. Il file concorrente non tracciato apparso durante la seduta è stato preservato e non attribuito.
7. Non risultano directory temporanee o capsule di prova invalide residue create da questa revisione.

## 10. Matrice claim → prova → esito

| # | Claim/gate | Comando o prova autonoma | Exit/conteggio | Esito |
|---:|---|---|---|---|
| 1 | sintassi di ogni `.mjs` attribuito | `node --check <file>` sui 14 file cambiati | 14/14 exit 0 | PASS |
| 2 | lint reale e zero warning | `npm run lint` | exit 0; `--max-warnings 0` | PASS |
| 3 | enforcement H-1 | `npm run test:mss` | exit 0; 42 fixture + 32 gruppi | PASS |
| 4 | test attrezzi | `npm run test:mss:tools` | exit 0; 9/9 | PASS |
| 5 | suite tools sa fallire | asserzione invertita in clone, poi inversa | exit 1 → exit 0; hash identico | PASS |
| 6 | validazione complessiva | `npm run validate` | exit 0; 163 file test passati; warning React `act(...)` non bloccanti | PASS |
| 7 | baseline doc paths | `npm run validate:docs` | exit 1; 17 path rotti su 965 controllati | FAIL noto, ma bloccante per CI |
| 8 | query effettiva | `npm run mss:query -- --verifica` | exit 0; nessun amendment non risolto nella prova iniziale | PASS |
| 9 | stato owner/Git | `npm run mss:status` | exit 0; branch `env/test`, ahead 1 | PASS con viste statiche obsolete |
| 10 | bypass `SK-4` | tre CLI isolate B1/B2/B3, poi cleanup | 1/1/1 → 0 | PASS |
| 11 | helper `SK-5` | repo isolato, commit rosso e commit verde | 1 → 0 | PASS locale |
| 12 | whitespace diff | `git diff --check` e `git diff --check origin/env/test..HEAD` | 0 sul worktree; 2 sul range, 110 righe | FAIL sul diff reale |
| 13 | report dei cantieri | CLI `validate:mss ... --require-capsule` | 7/7 report prodotti validi | PASS |
| 14 | perimetro e temporanei | script sui 43 path + ricerca root temporanea | 0 fuori perimetro; 0 temp della revisione | PASS; 1 file concorrente preservato |
| 15 | append-only | `git diff --name-status` + ricerca record final nei file modificati | 0 report final storici modificati | PASS |
| 16 | consegnabilità di questo report | `npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/23-08-26/Report-senior-revisione-complessiva-23-08-26.md" --kind report --require-capsule` | exit 0, `validate:mss OK` | PASS |

I sette report del punto 13 sono E1, E2, E3, ciclo `SK-4`, revisione R1, chiusura Senior e ciclo `SK-11/SK-5`; ciascuno ha restituito `validate:mss OK`.

## 11. Difetti, riserve e aspetti non verificabili

| ID | Severità | Claim contestato e prova | File/punto | Effetto concreto | Criterio di accettazione |
|---|---|---|---|---|---|
| D1 | alta/bloccante | “controlli MSS nella CI”: `validate:docs` exit 1 viene prima dei passi MSS | `.github/workflows/ci.yml:26-29` | i nuovi gate non vengono eseguiti in CI | run completa che raggiunge e supera/esercita report MSS, H-1 e tools |
| D2 | alta/governance | “decisione prima di commit”: `HEAD` è già un commit locale unico di 43 file | commit `d1598b6`; handoff Codex righe 18/121 | revisione avviene dopo il commit e subject/attributi sono aggregati | decisione esplicita di Matteo sul mantenimento o riordino del commit prima di ogni push |
| D3 | media | “una sola `REPORT_PATH_RE`”: due definizioni reali | `adapter.mjs:13`; `validate-changed-reports.mjs:9` | rischio di deriva fra perimetro MSS e selezione CI | una sola policy canonica oppure costante distinta, nominata e testata come filtro CI Report-only |
| D4 | media | “stati allineati”: owner e viste derivate divergono | `ROADMAP:58-59`, `HANDOFF:122-169`, `INDICE:13-17` | il prossimo agente può credere `SK-5` non iniziato | rigenerare/allineare le viste o marcarle come snapshot con data/HEAD |
| D5 | media | “`git diff --check` exit 0”: il range reale esce 2 | report Codex `:138`, `:262`; vari docs | prova falsa e diff non pulito | `git diff --check origin/env/test..HEAD` exit 0 o rettifica append-only del claim |
| D6 | bassa | E1 esclude il path Unicode, ma la regex restituisce true | report E1 `:29` | metrica/perimetro dichiarato inesatto | amendment del record/report, senza riscrivere il final |
| D7 | bassa | output query dice “solo Report” ma legge anche Verbale | `query.mjs:320`, `:1010`, `:1034` | messaggio utente fuorviante | testo coerente col filtro canonico, con test snapshot/seam |
| D8 | non verificabile | famiglia sottostante di Cursor Composer/Auto | record di provenienza Cursor | impossibile certificare indipendenza familiare del pacchetto | evidenza runtime attendibile della famiglia o revisore esterno noto |
| D9 | informativa/concorrenza | file non tracciato apparso dopo baseline | `Report-revisione-indipendente-sessione-mss-23-08-26.md` | stato finale differisce dalla baseline per una scrittura non attribuibile a questa revisione | il proprietario concorrente rilascia e chiarisce il file |

## 12. Cosa non è stato fatto

- Nessun difetto è stato corretto.
- Nessun owner, piano, handoff, hook, workflow, script, fixture o capsula storica è stato modificato.
- Nessun record `final` è stato riscritto.
- Nessun commit, push, branch remoto, DB o Supabase è stato eseguito.
- Nessuna CI remota è stata avviata; la conclusione sull’irraggiungibilità deriva dall’ordine YAML e dal fallimento locale riprodotto del primo gate.
- Il file concorrente non tracciato non è stato aperto, validato, spostato o rimosso.
- Non è stato dichiarato `CHIUSO` alcun pacchetto.

## 13. Verdetti separati

| Perimetro | Verdetto | Motivo decisivo |
|---|---|---|
| Cursor `SK-4` | **ACCETTA CON RISERVE** | B1/B2/B3 reali; duplicazione regex e claim/testi inesatti |
| Chiusura Senior Cursor | **ACCETTA CON RISERVE** | hook e snapshot corretti; viste oggi obsolete |
| Codex `SK-11` | **ACCETTA CON RISERVE** | implementazione e test solidi; prova `diff --check` falsa sul range reale |
| Codex `SK-5` | **CORREGGERE** | gate locale corretto ma irraggiungibile nella CI attuale |
| Integrazione complessiva | **CORREGGERE** | CI bloccata, commit già aggregato, viste divergenti e diff whitespace rosso |

## 14. Raccomandazione finale a Matteo

Non autorizzare ancora il push dell’aggregato. Accetta tecnicamente `SK-4` e `SK-11` con le riserve indicate, ma chiedi prima la correzione del flusso `SK-5` affinché una run CI raggiunga davvero i gate MSS. Nella stessa decisione, stabilisci se mantenere il commit locale già esistente o riorganizzarlo e come riallineare le viste senza riscrivere capsule final.

## 15. Dati comunicazione e dati grezzi

### Comunicazione

La richiesta sostanziale è stata una revisione Senior finale, autonoma e non implementativa dei cinque perimetri, con test offline, controprove isolate, matrice completa, report deep e capsula valida. Gli aggiornamenti intermedi hanno dichiarato identità, progressione delle prove, difetto CI bloccante e collisione concorrente.

### Dati grezzi essenziali

- `git ls-remote origin refs/heads/env/test`: `eee6cf7c10e4c8a58afdcc2af7e55b9e66c9c26a`.
- `git rev-list --left-right --count origin/env/test...HEAD`: `0 1`.
- Commit: `d1598b64a545fc988b3f4db3c8650858a3de493d`, 43 path.
- `node --check`: 14/14 exit 0.
- `npm run lint`: exit 0, zero warning lint.
- `npm run test:mss`: exit 0, 42 + 32.
- `npm run test:mss:tools`: exit 0, 9/9.
- `npm run validate`: exit 0, 163 test file passati; warning React `act(...)` osservati.
- `npm run validate:docs`: exit 1, 186 Markdown scansionati, 965 path controllati, 17 rotti, 21 allowlist.
- CLI/seam: 5/5 byte-equal; import query/status: 0 byte.
- Regex canonica: 431 path a `HEAD`; path `tiramisù` riconosciuto `true`.
- `git diff --check`: exit 0 senza range; exit 2 su `origin/env/test..HEAD`, 110 righe.
- Report cantieri: 7/7 `validate:mss OK`.
- Questo report: comando finale con capsula obbligatoria, exit 0, `validate:mss OK`.
- Clone temporanei: `sk4`, `sk11`, `sk5`; tutti puliti prima della rimozione; root verificata e rimossa.
- Stato finale: nessun tracked modificato; due untracked, questo report autorizzato e `Report-revisione-indipendente-sessione-mss-23-08-26.md` concorrente.

## 16. Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a02e08-ec51-74af-8460-f5d4bacfc661","correlation_id":"mss-cor-01a02e08-ec53-75dd-ba4b-49c62a1b2e08","segment_no":1,"created_at":"2026-08-23T11:52:11+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-senior-review-23-08-26","actor_type":"agente","role":"senior_reviewer","agent_runtime":{"provider":"OpenAI","model":"Codex GPT-5","runtime":"Codex Windows PowerShell","surface":"workspace locale"},"tools_used":["Read","Shell","apply_patch","git","node","npm"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"testing-skill","package_version_or_revision":"workspace 23-08-26","source_ref":"docs/Testing-Skill/TESTING_SKILL.md"},{"package_id":"mss-contract","package_version_or_revision":"mss.session/0.1.1","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"},{"package_id":"review-mandate","package_version_or_revision":"23-08-26","source_ref":"docs/Sessioni di lavoro/23-08-26/INDICE-SESSIONE-23-08-26.md"}],"record_type":"session_event","record_id":"mss-rec-01a02e08-ec53-75c2-aa5c-8c8200018cba","capture_key":"mss-ses-01a02e08-ec51-74af-8460-f5d4bacfc661/1/session_event/1","event":{"event_id":"mss-evt-01a02e08-ec53-7bc4-9c53-f8932547020c","event_kind":"session_close","occurred_at":"2026-08-23T11:52:11+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"revisionare autonomamente i cantieri Cursor SK-4 e Senior, Codex SK-11 e SK-5 e la loro integrazione senza implementare fix","session_type":"deep","capsule_status":"completa","role_key":"senior-reviewer-finale","area":"MetaSkillSystem / revisione complessiva 23-08-26","environment":"workspace locale env/test; HEAD d1598b6; remoto eee6cf7","authorization":{"read":["repository e contesto obbligatorio","diff Git","test locali offline"],"write":["docs/Sessioni di lavoro/23-08-26/Report-senior-revisione-complessiva-23-08-26.md","repository temporanei isolati poi rimossi"],"forbid":["fix a codice o documenti esistenti","riscrittura record final","commit","push","DB","Supabase","dichiarazioni CHIUSO"]},"authorized_outputs":["report senior complessivo con capsula valida"],"route":{"chosen":"MetaSkillSystem + Testing Skill + mandato revisione senior","alternatives_or_conflicts":["file concorrente non tracciato preservato"]},"observed_outcome":"SK-4, Senior e SK-11 accettabili con riserve; SK-5 e integrazione da correggere; nessun pacchetto dichiarato chiuso","open_items":["rendere raggiungibili i gate MSS in CI","decisione di Matteo sul commit locale aggregato","riallineare viste e claim con modifica append-only","risolvere proprietà del file concorrente"],"controls":[{"control_id":"SR-NODE","criterio":"node --check su tutti i file mjs attribuiti, exit 0","esito":"pass","numeratore":14,"denominatore":14,"esecutore":"OpenAI Codex senior reviewer","evidence_refs":["source-report"]},{"control_id":"SR-LINT","criterio":"npm run lint exit 0 e zero warning","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"OpenAI Codex senior reviewer","evidence_refs":["source-report"]},{"control_id":"SR-H1","criterio":"test:mss 42 fixture più 32 gruppi exit 0","esito":"pass","numeratore":74,"denominatore":74,"esecutore":"OpenAI Codex senior reviewer","evidence_refs":["source-report"]},{"control_id":"SR-TOOLS","criterio":"test:mss:tools exit 0","esito":"pass","numeratore":9,"denominatore":9,"esecutore":"OpenAI Codex senior reviewer","evidence_refs":["source-report"]},{"control_id":"SR-VALIDATE","criterio":"npm run validate exit 0","esito":"pass","numeratore":163,"denominatore":163,"esecutore":"OpenAI Codex senior reviewer","evidence_refs":["source-report"]},{"control_id":"SR-DOCS","criterio":"validate:docs senza path rotti","esito":"fail","numeratore":0,"denominatore":17,"esecutore":"OpenAI Codex senior reviewer","evidence_refs":["source-report"]},{"control_id":"SR-SK4-REDGREEN","criterio":"tre bypass rossi e cleanup verde","esito":"pass","numeratore":4,"denominatore":4,"esecutore":"OpenAI Codex senior reviewer","evidence_refs":["source-report"]},{"control_id":"SR-SK11-REDGREEN","criterio":"rosso 1/9, inversa 9/9, hash identico","esito":"pass","numeratore":3,"denominatore":3,"esecutore":"OpenAI Codex senior reviewer","evidence_refs":["source-report"]},{"control_id":"SR-SK5-REDGREEN","criterio":"helper CI rosso su report invalido e verde post-rimozione","esito":"pass","numeratore":2,"denominatore":2,"esecutore":"OpenAI Codex senior reviewer","evidence_refs":["source-report"]},{"control_id":"SR-DIFF-CHECK","criterio":"git diff --check origin/env/test..HEAD exit 0","esito":"fail","numeratore":0,"denominatore":1,"esecutore":"OpenAI Codex senior reviewer","evidence_refs":["source-report"]},{"control_id":"SR-CLEANUP","criterio":"nessuna root temporanea della revisione residua","esito":"pass","numeratore":3,"denominatore":3,"esecutore":"OpenAI Codex senior reviewer","evidence_refs":["source-report"]}],"subject_runtime":{"actor_id":"openai-codex-senior-review-23-08-26","provider":"OpenAI","model":"Codex GPT-5","runtime":"Codex Windows PowerShell","surface":"workspace locale"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["path repository","hash Git e test","exit code","classificazione provenienza"],"prohibited_content":["segreti","credenziali","dati personali non necessari"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-plan","owner_id":"SYS-1","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"§4-bis SK-4 SK-11 SK-5","revision_or_hash":"d1598b64a545fc988b3f4db3c8650858a3de493d","sensitivity":"internal"},{"ref_id":"owner-contract","owner_id":"mss-contract-v0.1","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"schema mss.session/0.1.1","revision_or_hash":"mss-v0.1-wp0.1-freeze-2","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-report","owner_id":"senior-review-23-08-26","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-senior-revisione-complessiva-23-08-26.md","stable_anchor_or_event_id":"corpo e matrice","revision_or_hash":"working-tree","sensitivity":"internal"},{"ref_id":"source-sk4","owner_id":"SK-4","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-4-23-08-26.md","stable_anchor_or_event_id":"prove B1 B2 B3","revision_or_hash":"d1598b6","sensitivity":"internal"},{"ref_id":"source-senior","owner_id":"Senior-Eval-Pack","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-senior-chiusura-sessione-23-08-26.md","stable_anchor_or_event_id":"Conferma Stop-hook 2","revision_or_hash":"d1598b6","sensitivity":"internal"},{"ref_id":"source-codex","owner_id":"SK-11-SK-5","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-11-SK-5-23-08-26.md","stable_anchor_or_event_id":"prove SK-11 SK-5","revision_or_hash":"d1598b6","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a02e08-ec51-74af-8460-f5d4bacfc661","correlation_id":"mss-cor-01a02e08-ec53-75dd-ba4b-49c62a1b2e08","segment_no":1,"created_at":"2026-08-23T11:52:12+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-senior-review-23-08-26","actor_type":"agente","role":"senior_reviewer","agent_runtime":{"provider":"OpenAI","model":"Codex GPT-5","runtime":"Codex Windows PowerShell","surface":"workspace locale"},"tools_used":["Read","Shell"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a02e08-ec53-7617-8141-32cbbc216466","capture_key":"mss-ses-01a02e08-ec51-74af-8460-f5d4bacfc661/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a02e08-ec53-7d83-92dc-aa911d807b9c","axis":"persona","subject_record_ids":["mss-rec-01a02e08-ec53-75c2-aa5c-8c8200018cba"],"delta":"nessuno","assertions":[{"signal":"Matteo ha richiesto una revisione autonoma con prove reali e decisione finale riservata a sé","actor":"Matteo","assistance":"guidato","origin":"naturale","source_ref":"source-report","effect":"separazione dei verdetti e divieto di implementazione o chiusura","evidence_state":"observed"}],"asserted_by":{"actor_id":"openai-codex-senior-review-23-08-26","role":"senior_reviewer","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-report","evidence_refs":["source-report"],"notes":"nessuna inferenza professionale o personale oltre al mandato operativo"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a02e08-ec51-74af-8460-f5d4bacfc661","correlation_id":"mss-cor-01a02e08-ec53-75dd-ba4b-49c62a1b2e08","segment_no":1,"created_at":"2026-08-23T11:52:13+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-senior-review-23-08-26","actor_type":"agente","role":"senior_reviewer","agent_runtime":{"provider":"OpenAI","model":"Codex GPT-5","runtime":"Codex Windows PowerShell","surface":"workspace locale"},"tools_used":["Read","Shell","git","node","npm"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"testing-skill","package_version_or_revision":"workspace 23-08-26","source_ref":"docs/Testing-Skill/TESTING_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a02e08-ec53-7ade-a188-5298b22d1675","capture_key":"mss-ses-01a02e08-ec51-74af-8460-f5d4bacfc661/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a02e08-ec53-7109-aa44-61c335ebcbd6","axis":"sistema","subject_record_ids":["mss-rec-01a02e08-ec53-75c2-aa5c-8c8200018cba"],"delta":"verificato","assertions":[{"rule_id_version":"senior-review@cursor-sk4","trigger_event":"revisione Cursor SK-4","decision_or_output_changed":"ACCETTA CON RISERVE; provenienza self_report per pacchetto misto Composer Claude","G":2,"O":2,"E":2},{"rule_id_version":"senior-review@cursor-senior","trigger_event":"revisione chiusura Senior Cursor","decision_or_output_changed":"ACCETTA CON RISERVE; provenienza self_report perché Cursor Auto non espone famiglia","G":2,"O":2,"E":2},{"rule_id_version":"senior-review@codex-sk11","trigger_event":"revisione Codex SK-11","decision_or_output_changed":"ACCETTA CON RISERVE; provenienza self_report per stessa famiglia OpenAI","G":2,"O":2,"E":2},{"rule_id_version":"senior-review@codex-sk5","trigger_event":"revisione Codex SK-5","decision_or_output_changed":"CORREGGERE; provenienza self_report per stessa famiglia OpenAI","G":2,"O":2,"E":2},{"rule_id_version":"senior-review@integration","trigger_event":"revisione trasversale","decision_or_output_changed":"CORREGGERE; commit misto e CI MSS irraggiungibile; provenienza self_report","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"openai-codex-senior-review-23-08-26","role":"senior_reviewer","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-report","evidence_refs":["source-report","source-sk4","source-senior","source-codex"],"notes":"prove autonome ma nessuna elevazione artificiale a verifica indipendente di famiglia"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a02e08-ec51-74af-8460-f5d4bacfc661","correlation_id":"mss-cor-01a02e08-ec53-75dd-ba4b-49c62a1b2e08","segment_no":1,"created_at":"2026-08-23T11:52:14+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-senior-review-23-08-26","actor_type":"agente","role":"senior_reviewer","agent_runtime":{"provider":"OpenAI","model":"Codex GPT-5","runtime":"Codex Windows PowerShell","surface":"workspace locale"},"tools_used":["apply_patch","Shell"]},"packages_loaded":[{"package_id":"mss-contract","package_version_or_revision":"mss.session/0.1.1","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a02e08-ec53-75ad-8c26-0ea91b072f62","capture_key":"mss-ses-01a02e08-ec51-74af-8460-f5d4bacfc661/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a02e08-ec54-7e1d-8161-18c62c20b23c","axis":"output","subject_record_ids":["mss-rec-01a02e08-ec53-75c2-aa5c-8c8200018cba"],"delta":"creato","assertions":[{"output_id":"report-senior-revisione-complessiva-23-08-26","primary_type":"registro","canonical_version":"23-08-26-working-tree","recipient":"Matteo","problem_or_job":"decidere sui cinque perimetri MetaSkillSystem dopo verifica autonoma","intended_use":"decisione su correzioni, eventuale chiusura e successivo commit o push","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"mandato revisione senior complessiva","authored_by":"openai-codex-senior-review-23-08-26","verified_by":"self_report OpenAI Codex","acceptance_criterion":"verdetti separati, difetti riproducibili, matrice completa, cleanup e capsula valida","verification_or_use_evidence":"sezioni 3-15 e comando validate:mss finale","verification_status":"self_report","owner_ref":"owner-plan","privacy_release":"internal","support_files":[],"relations_no_double_count":["revisione complessiva distinta dai report di cantiere"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"openai-codex-senior-review-23-08-26","role":"senior_reviewer","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-report","evidence_refs":["source-report"],"notes":"consegna non equivale a chiusura dei pacchetti"}}}
```

## 17. Sei domande canoniche di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.

✅ R1: Prompt sostanziale verbatim:

```text
Apri e segui integralmente `AGENTS.md`.

RUOLO

Agisci come revisore Senior finale del cantiere MetaSkillSystem del 23-08-26. Devi revisionare nel complesso, con prove autonome, sia i lavori eseguiti da Cursor sia quelli eseguiti da Codex.

Non assumere corrette le conclusioni dei report esistenti. Confronta ogni dichiarazione con codice, diff, stato Git e output reali.

OBIETTIVO

Produrre una revisione complessiva dei seguenti cantieri:

1. Cursor — `SK-4`: chiusura dei bypass e allineamento del contratto capsula.
2. Cursor — chiusura Senior della sessione, hook e documentazione collegata.
3. Codex — `SK-11`: lint e test automatici degli attrezzi MSS.
4. Codex — `SK-5`: controlli MSS nella CI di `env/test`.
5. Integrazione trasversale: assenza di regressioni, collisioni, duplicazioni di regole, stati incoerenti o prove attribuite al cantiere sbagliato.

Il risultato deve permettere a Matteo di decidere se dichiarare chiusi i pacchetti e autorizzare successivamente commit e push.

AUTORITÀ E LIMITI

- Lavoro di revisione, non di implementazione.
- Puoi leggere tutto il perimetro necessario ed eseguire test locali offline.
- Puoi creare o aggiornare soltanto il report della tua revisione:
  `docs/Sessioni di lavoro/23-08-26/Report-senior-revisione-complessiva-23-08-26.md`
- Non correggere codice, workflow, hook, piani o capsule esistenti.
- Se trovi un difetto, documentalo con riproduzione, severità, file coinvolti ed effetto; non applicare il fix.
- Eventuali mutazioni necessarie per dimostrare che un test sa fallire devono avvenire in un repository temporaneo isolato. Verifica sempre il path assoluto prima della rimozione.
- Non modificare capsule storiche o record `final`.
- Non eseguire commit, push, creazione di branch remoti, DB o Supabase.
- Non dichiarare `SK-4`, `SK-11` o `SK-5` `CHIUSO`: la decisione è di Matteo.
- Preserva tutte le modifiche concorrenti presenti nel worktree.
- Se un file risulta ancora posseduto da un altro agente, fermati su quel file e registra la collisione.

PROVENIENZA DELLA REVISIONE

All’inizio dichiara provider, modello, runtime e famiglia effettiva.

Valuta separatamente l’indipendenza rispetto agli autori Cursor e Codex. Non usare `independently_verified` per cortesia:

- se appartieni alla stessa famiglia dell’autore del lavoro revisionato, usa `self_report`;
- se sei realmente di famiglia diversa e soddisfi i criteri del contratto, motiva puntualmente l’eventuale `independently_verified`;
- se l’indipendenza vale soltanto per alcuni cantieri, registra una classificazione distinta per ciascuno.

CONTESTO OBBLIGATORIO

Leggi integralmente, in questo ordine:

1. `docs/Comunicazione-Skill/VOCABOLARIO.md`
2. `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md`
3. `docs/Testing-Skill/TESTING_SKILL.md`
4. `docs/MetaSkillSystem/PLAN_V0.md`
5. `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md`
6. `docs/Sessioni di lavoro/23-08-26/INDICE-SESSIONE-23-08-26.md`

Cantiere Cursor `SK-4`:

7. `docs/Sessioni di lavoro/23-08-26/PLAN-CURSOR-SK-4-23-08-26.md`
8. `docs/Sessioni di lavoro/23-08-26/HANDOFF-CURSOR-SK-4-23-08-26.md`
9. `docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-4-23-08-26.md`
10. I prompt e report `Prompt-sk4-*` / `Report-sk4-*` presenti nella cartella del 23-08-26.
11. `docs/Sessioni di lavoro/23-08-26/Report-sk4-revisione-indipendente-23-08-26.md`

Cantiere Senior Cursor:

12. `docs/Sessioni di lavoro/23-08-26/Prompt-senior-chiusura-sessione-23-08-26.md`
13. `docs/Sessioni di lavoro/23-08-26/Report-senior-chiusura-sessione-23-08-26.md`
14. `docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md`
15. `docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md`
16. `_skill-system-v0/comunicazione/EVOLUZIONE_SKILLS.md`

Cantiere Codex `SK-11` → `SK-5`:

17. `docs/Sessioni di lavoro/23-08-26/Prompt-avvio-CODEX-SK-11-SK-5-23-08-26.md`
18. `docs/Sessioni di lavoro/23-08-26/PLAN-CODEX-SK-11-SK-5-23-08-26.md`
19. `docs/Sessioni di lavoro/23-08-26/HANDOFF-CODEX-SK-11-SK-5-23-08-26.md`
20. `docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-11-SK-5-23-08-26.md`

FASE 0 — STATO REALE

Prima di valutare i lavori:

1. Verifica branch corrente, `HEAD`, `origin/env/test` e divergenza.
2. Registra `git status --short`, file tracciati modificati e file non tracciati.
3. Ricostruisci l’attribuzione dei file ai diversi cantieri.
4. Confronta diff reale, report, piano e handoff.
5. Identifica file modificati da più cantieri, soprattutto:
   - `scripts/mss/query.mjs`;
   - `docs/MetaSkillSystem/PLAN_V0.md`;
   - `package.json`;
   - contratto, fixture e runner H-1;
   - hook e documenti Senior.
6. Non attribuire a Codex modifiche Cursor/Senior e viceversa.
7. Controlla che non esistano directory temporanee o capsule invalide residue.

REVISIONE `SK-4`

Verifica nel merito:

- esistenza di una sola definizione canonica di `REPORT_PATH_RE`;
- uso coerente da parte di adapter, git-adapter e query;
- divieto dei nuovi record con coppia legacy;
- requisito `controls` per la coppia viva;
- rilevamento dei `Report-*.md` deep/standard nelle sottocartelle;
- rilevamento dei `Verbale-*.md` nelle sottocartelle;
- assenza di duplicazioni tra adapter, core, rules e helper;
- coerenza fra contratto `0.1.1` / `freeze-2`, fixture, manifest e test;
- effettiva copertura dei casi B1, B2 e B3 dichiarati;
- integrità append-only delle capsule storiche.

Ripeti autonomamente le controprove `SK-4` in un repository temporaneo isolato. Registra comando, exit code, codice MSS, path probante e successivo cleanup.

REVISIONE CHIUSURA SENIOR CURSOR

Confronta prompt, report e diff effettivo dei file Senior e degli hook.

Verifica almeno:

- sintassi degli `.mjs` coinvolti;
- parità o differenze intenzionali tra gli hook duplicati;
- coerenza di handoff e roadmap;
- assenza di stati falsi, intestazioni obsolete o claim non provati;
- eventuali modifiche fuori perimetro;
- validità MSS del report Senior;
- rispetto della semantica append-only;
- assenza di effetti collaterali o scritture non autorizzate degli hook.

Ripeti i gate indicati nel relativo prompt/report. Se un gate non è riproducibile, classificalo come non verificato.

REVISIONE `SK-11`

Verifica nel merito:

- importabilità silenziosa di `query.mjs` e `status.mjs`;
- assenza di `process.exit` o side effect all’import;
- parità fra wrapper CLI e seam esportati;
- delega esclusiva della semantica amendment a `core.mjs::applyAmendmentsView()`;
- utility condivisa per root discovery e guard ESM;
- test offline, deterministici e indipendenti da rete, DB, ora reale e TTY;
- sette scenari query e due scenari status realmente distinti;
- collisione delle anteprime e conservazione dei valori completi nel JSON;
- tie-break deterministico con input invertito;
- lint reale su tutti gli `.mjs` sotto `scripts/`;
- `no-console` non disattivato globalmente;
- uso del logger CLI in `_test-email-once.mjs`;
- correttezza della regex autorizzata in `sync-to-prenotazen.mjs`;
- inclusione autonoma e dentro `validate` di `test:mss:tools`.

In isolamento, modifica deliberatamente una sola asserzione della suite, prova il rosso e applica la patch inversa. Registra hash/diff prima e dopo per dimostrare che non rimane alcuna mutazione.

REVISIONE `SK-5`

Verifica nel merito:

- trigger CI su push e pull request verso `main` ed `env/test`;
- checkout con storia sufficiente e head PR corretta;
- conservazione dei gate applicativi esistenti;
- passi distinti per report MSS, H-1 e tools;
- selezione esclusiva dei `Report-*.md` aggiunti o modificati;
- comportamento esplicito quando nessun report è toccato;
- delega al CLI MSS canonico con:
  `--mode file --kind report --require-capsule`;
- assenza di una seconda implementazione delle regole MSS nell’helper;
- correttezza di base/head e gestione dei path;
- sintassi e parsing del workflow YAML.

Ripeti in un nuovo repository temporaneo isolato la dimostrazione CI:

1. nuovo report standard/deep con capsula intenzionalmente invalida;
2. stesso comando della CI con `--repo` verso il temp;
3. exit non zero, codice MSS e path esplicito;
4. rimozione sicura del solo report invalido;
5. stesso comando sullo stato verde, exit `0`;
6. verifica dello stato Git del temp;
7. rimozione sicura della root temporanea;
8. controllo che nel workspace principale non resti alcun artefatto.

MATRICE FINALE OBBLIGATORIA

Esegui e registra comando, exit code e riga probante:

1. `node --check` su ogni `.mjs` attribuito ai cantieri revisionati.
2. `npm run lint` — exit `0`, zero warning.
3. `npm run test:mss` — conteggio reale.
4. `npm run test:mss:tools` — conteggio reale.
5. Controprova rossa `SK-11` in isolamento e successivo verde.
6. `npm run validate`.
7. `npm run validate:docs` — confronta con la baseline dichiarata di 17 path rotti.
8. `npm run mss:query -- --verifica`.
9. `npm run mss:status`.
10. Prove rosso→verde `SK-4`.
11. Prova rosso→verde `SK-5`.
12. `git diff --check`.
13. Validazione MSS di tutti i report standard/deep prodotti o modificati dai cantieri.
14. Controllo automatico dei path fuori perimetro e dei temporanei residui.
15. Nuovo `git status --short` finale, confrontato con la baseline della Fase 0.

CRITERI DI VERDETTO

Per ogni cantiere assegna uno dei seguenti verdetti:

- `ACCETTA`;
- `ACCETTA CON RISERVE`;
- `CORREGGERE`;
- `NON VERIFICABILE`.

Non usare un unico verdetto generico. Valuta separatamente:

- Cursor `SK-4`;
- chiusura Senior Cursor;
- Codex `SK-11`;
- Codex `SK-5`;
- integrazione complessiva.

Ogni riserva o difetto deve avere:

- severità;
- claim contestato;
- prova reale;
- file e punto coinvolto;
- effetto concreto;
- criterio di accettazione per il fix.

REPORT OBBLIGATORIO

Crea:

`docs/Sessioni di lavoro/23-08-26/Report-senior-revisione-complessiva-23-08-26.md`

Modalità: `deep`.

Struttura minima:

1. Identità e provenienza del revisore.
2. Obiettivo e perimetro.
3. Baseline Git reale.
4. Mappa di attribuzione dei file.
5. Revisione Cursor `SK-4`.
6. Revisione chiusura Senior Cursor.
7. Revisione Codex `SK-11`.
8. Revisione Codex `SK-5`.
9. Revisione trasversale e collisioni.
10. Matrice claim → prova → esito.
11. Difetti, riserve e aspetti non verificabili.
12. Cosa non è stato fatto.
13. Verdetto separato per ciascun cantiere.
14. Raccomandazione finale a Matteo: accettare o correggere.
15. Dati comunicazione e dati grezzi.
16. Capsula MetaSkillSystem JSONL valida.
17. Sei domande canoniche di chiusura, verbatim.

La capsula deve:

- usare la coppia viva `mss.session/0.1.1` / `mss-v0.1-wp0.1-freeze-2`;
- usare UUIDv7 nuovi e non collidenti;
- avere `segment_no: 1`;
- dichiarare onestamente la provenienza per ciascun cantiere;
- non usare `independently_verified` se i requisiti reali non sono soddisfatti;
- registrare controlli con exit code e conteggi veri;
- non dichiarare chiusi i pacchetti;
- usare amendment per correggere eventuali record `final`, mai riscriverli.

Prima della consegna esegui:

`npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/23-08-26/Report-senior-revisione-complessiva-23-08-26.md" --kind report --require-capsule`

Il report è consegnabile soltanto con `validate:mss OK`.

OUTPUT FINALE IN CHAT

Consegna a Matteo:

- verdetto separato per i cinque perimetri;
- difetti o riserve, ordinati per severità;
- prove principali con exit code;
- conferma del cleanup;
- classificazione reale della provenienza;
- link al report;
- conferma esplicita: nessun commit, push, DB/Supabase o dichiarazione `CHIUSO`.

Non correggere i difetti trovati e non aggiornare gli owner di stato: lascia a Matteo la decisione successiva.
```

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.

✅ R2: Sì per i dati dichiarati: ho riaperto i 43 path del diff per attribuzione mirata, i 14 `.mjs`, workflow, helper CI, regex, core/rules, contratto, fixture/manifest/builder, package scripts, hook, owner, roadmap, handoff, indice e sette report. Ho verificato remoto con `ls-remote`, divergenza, commit metadata, diff name-status, range `diff --check`, output test e path Unicode.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).

✅ R3: Verificati MetaSkillSystem Skill, Testing Skill, `PLAN_V0`, contratto, `adapter/core/rules/git-adapter/query/runtime/status`, H-1 e tools, `.eslintrc`, package, workflow/helper, entrambi gli hook, `ROADMAP`, `HANDOFF`, indice, template evoluzione e report. Non sono tutti allineati: ROADMAP/HANDOFF/INDICE sono obsoleti rispetto a SK-11/SK-5 e la query ha testi Report-only non coerenti col filtro Verbale.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)

✅ R4: Non ho corretto i difetti, aggiornato owner o capsule storiche, eseguito CI remota, commit, push, DB o Supabase, né dichiarato pacchetti chiusi. Non ho toccato il file concorrente apparso durante la revisione. L’unico limite probatorio è la mancata CI remota, sostituita da parsing YAML, ordine dei passi, fallimento locale del primo gate e prove isolate dell’helper.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)

✅ R5: Attrito: report storici, viste statiche e commit aggregato raccontano istanti diversi e costringono a ricostruire l’attribuzione; miglioria: generare indice/roadmap dallo stesso owner e imporre un gate pre-commit che esegua `git diff --check <base>..<head>` e verifichi la raggiungibilità sequenziale dei passi CI.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?

✅ R6: Contesto giusto per una revisione trasversale, benché voluminoso: contratto, piani e report erano tutti necessari per distinguere prova da claim. Gli hook Senior sono stati utili come oggetto di audit; non hanno bloccato questa seduta e il loro vecchio messaggio “gitignored” era effettivamente rumore, già corretto nel cantiere revisionato.
