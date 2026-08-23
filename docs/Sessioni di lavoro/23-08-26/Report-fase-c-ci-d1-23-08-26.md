# Report Fase C — job MSS indipendente in CI — 23-08-26

## Esito

La decisione D1-A è implementata nel solo workflow autorizzato. Il job applicativo/documentale
`ci` conserva installazione, `validate:docs`, lint, typecheck e unit test; il nuovo job `mss` ha
checkout, setup Node e `npm ci` propri ed esegue in tre passi distinti e hard-fail la validazione
dei report/verbali cambiati, H-1 e i test degli attrezzi. I due job non hanno dipendenze reciproche.

La simulazione finale in repository temporaneo isolato è verde per l'intera sequenza MSS. Il gate
documentale resta rosso e visibile. Nessuna GitHub Actions remota è stata osservata, nessun commit o
push è stato eseguito e nessun pacchetto è stato dichiarato `CHIUSO`.

## Fotografia e ownership

Fotografia iniziale, prima delle scritture:

- branch `env/test`;
- `HEAD = d1598b64a545fc988b3f4db3c8650858a3de493d`;
- `origin/env/test = eee6cf7c10e4c8a58afdcc2af7e55b9e66c9c26a`;
- `origin/env/test...HEAD = 0 1`;
- `d1598b6` è antenato di HEAD, exit 0;
- workflow non modificato, SHA-256 iniziale
  `1AA98341D6FC2AAE9DB58B142696C5D34AA9556667FCF5BC18EF5C077C2F3F1D`;
- sole modifiche tracked iniziali: i tre file tecnici rilasciati dalla Fase B
  (`validate-changed-reports.mjs`, `query.mjs`, suite tools);
- presenti e preservati piano, prompt B/C, report B e i due report revisori non tracciati.

È stata dichiarata ownership temporanea esclusiva di `.github/workflows/ci.yml`. L'hash è rimasto
invariato durante la verifica della Fase B e, dopo la sola modifica D1-A, vale
`8E10C4B8E76D2A3511C8393318995DD669FC48993D1D0AA05D80ECA4B51F9C3B`.

## Workflow prima e dopo

Prima esisteva un solo job `ci`: `validate:docs` precedeva i tre gate MSS. Poiché il primo comando
era rosso, GitHub Actions interrompeva quel job prima di raggiungere MSS.

Dopo la modifica:

- `ci`: checkout completo, Node 20, `npm ci`, `validate:docs`, lint, typecheck, unit test;
- `mss`: checkout completo, Node 20, `npm ci`, changed-reports, H-1, tools;
- entrambi i checkout usano `fetch-depth: 0` e
  `github.event.pull_request.head.sha || github.sha`;
- changed-reports usa base PR oppure `github.event.before`, e head PR oppure `github.sha`;
- trigger invariati: `push` e `pull_request` verso `main` ed `env/test`;
- nessun `needs` fra i due job e nessun `continue-on-error`.

I gate applicativi preesistenti non sono stati rimossi né ammorbiditi. Il rosso documentale resta
nel job `ci`; non può impedire l'esecuzione del job `mss`.

## Prerequisito Fase B

Prima dell'edit CI sono stati verificati direttamente:

| Controllo | Exit | Prova |
|---|---:|---|
| sintassi dei tre `.mjs` Fase B | 0 | tre `node --check` verdi |
| policy canonica | 0 | una sola definizione `REPORT_PATH_RE`, in `adapter.mjs` |
| H-1 | 0 | `42 fixture cases + 32 contract/integration groups` |
| tools | 0 | `16 tests`, inclusi Report e Verbale rosso→verde e testi query |
| query | — | i tre output citano entrambe le famiglie; nessuna seconda regex |

Il report B dichiara i file rilasciati e nessun difetto provvisorio è stato rilevato. Adapter,
helper, query e test B non sono stati modificati in Fase C.

## Simulazione locale equivalente

Root finale dedicata:

`C:\Users\matte.MIO\AppData\Local\Temp\calendarbackup-mss-phase-c-64f158e3e6294f99acede6dab233f39c`

Il clone è derivato da `d1598b6`; il candidato temporaneo che integra Fase B e D1-A è
`007e266401089152226dc8961d32745e700cbd32`. Il clone ha eseguito un checkout LF esplicito
(`i/lf w/lf`) per equivalenza con i blob Git e il runner Ubuntu, poi `npm ci` reale: exit 0,
902 pacchetti installati e 903 controllati.

| Caso | Comando/prova | Exit | Riga probante |
|---|---|---:|---|
| YAML e struttura | parser `yaml` + assert statici | 0 | `jobs=ci,mss independent=true ... hard-fail=true` |
| Report invalido | changed-reports sul commit sintetico | 1 | path esplicito; `MSS-REPORT-MODE-INVALID`, `MSS-REPORT-NO-CAPSULE`, `ROSSO: 1/1` |
| Report ripulito | stesso range dalla baseline candidata | 0 | nessun Report/Verbale aggiunto o modificato |
| Verbale invalido | changed-reports sul commit sintetico | 1 | path esplicito; gli stessi due codici MSS; `ROSSO: 1/1` |
| Verbale ripulito | stesso range dalla baseline pulita | 0 | nessun Report/Verbale aggiunto o modificato |
| caso vuoto | commit che tocca solo un file non pertinente | 0 | messaggio esplicito su entrambe le famiglie |
| changed-reports candidato | `d1598b6..007e266` | 0 | report B validato, `OK: 1/1` |
| H-1 candidato | `npm run test:mss` | 0 | 42 fixture + 32 gruppi |
| tools candidato | `npm run test:mss:tools` | 0 | 16 test |
| job MSS completo | i tre comandi nell'ordine del job | 0/0/0 | tutti raggiunti, `JOB_MSS_COMPLETE=GREEN` |
| docs separato | `npm run validate:docs` nello stesso clone | 1 | hard-fail osservato prima di eseguire comunque tutti i passi MSS |
| stato temp | `git status --short` | 0 | output vuoto |
| cleanup | rimozione della sola root dopo verifica parent assoluto | 0 | `TEMP_RESIDUE=False` |

Questo prova l'indipendenza: nello stesso candidato il dominio docs è rosso e, separatamente, i tre
passi del job MSS sono tutti eseguiti e verdi.

### Baseline documentale 17 e clone CI-like

Nel workspace locale `npm run validate:docs` restituisce exit 1 con 186 Markdown, 965 path
controllati e **17 path rotti**, cioè la baseline prevista e non mascherata. Nel clone isolato
equivalente a un checkout GitHub il conteggio sale a **26**: nove riferimenti aggiuntivi puntano a
file privati/gitignored presenti nel workspace ma assenti da un checkout pulito. Non è stato
corretto né allowlistato nessuno dei 17 path; il gate resta hard-fail in entrambi gli ambienti.

La differenza 17/26 è una misura ambientale emersa dalla simulazione, non un cambio del workflow.
Una futura run GitHub Actions dovrà confermare il conteggio remoto reale; questa Fase non la avvia.

## Gate locali finali

| Gate | Exit | Esito probante |
|---|---:|---|
| parser YAML sul workflow reale | 0 | trigger, due job, checkout, ref PR e hard-fail conformi |
| `npm run lint` | 0 | zero warning ESLint |
| `npm run test:mss` | 0 | 42 fixture + 32 gruppi |
| `npm run test:mss:tools` | 0 | 16/16, superiore al minimo 9/9 |
| `npm run validate` | 0 | lint, typecheck, Vitest e tools verdi |
| `npm run validate:docs` locale | 1 atteso | baseline 17 ancora visibile |
| `git diff --check -- .github/workflows/ci.yml` | 0 | solo diff C pulito |
| validazione MSS di questo report | 0 | `validate:mss OK` con capsula obbligatoria |

`npm run validate` non include H-1 e non sostituisce `npm run test:mss`; i due esiti sono quindi
registrati separatamente. I warning React `act(...)` osservati durante Vitest sono preesistenti e
non bloccanti; ESLint resta a zero warning.

## Tentativi della simulazione e cleanup

Il primo harness è stato interrotto dal timeout del comando; la root rimasta è stata individuata,
verificata come figlia diretta della temp di sistema e rimossa (`RESIDUE=False`). Il secondo si è
fermato prima dei test per l'invocazione PowerShell ambigua di `npm ci`; `finally` ha rimosso la
root. Il terzo ha completato tutte le prove tranne H-1 perché il clone Windows aveva convertito i
fixture congelati in CRLF; tools era 16/16 e la root è stata rimossa. Le diagnosi successive hanno
provato che workspace e blob hanno hash LF corretto; la simulazione finale ha forzato LF prima del
checkout ed è risultata interamente verde. Tutte le root diagnostiche dedicate sono state rimosse.

## File e non-interventi

Output di Fase C:

- `.github/workflows/ci.yml` — separazione D1-A;
- `docs/Sessioni di lavoro/23-08-26/Report-fase-c-ci-d1-23-08-26.md` — questo report e handoff.

Non sono stati toccati helper, adapter, query, test B, package, 17 path, viste, owner, capsule
storiche, `PLAN_V0.md`, `src/**`, DB, Supabase o documenti privati. Nessun commit, push, branch
remoto, rewrite o stato `CHIUSO`.

## Handoff finale

La Fase C rilascia il workflow e questo report per la **revisione integrata** prevista dalla Fase E.
Il prossimo gate unico è: revisione integrata senza riserve bloccanti; soltanto dopo, Matteo può
dare l'autorizzazione esplicita al push. La prova GitHub Actions reale avverrà dopo quel futuro push
e non è stata osservata in questa seduta.

Decisioni da non riaprire: D1-A, M1–M3, D16–D19. Non aprire `SK-7`, `WP-1`, `SEP-G5` o backlog R1.

## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-0198f100-0003-7000-8000-000000000001","session_id":"mss-ses-0198f100-0003-7000-8000-000000000010","correlation_id":"mss-cor-0198f100-0003-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198f100-0003-7000-8000-000000000010/1/session_event/1","created_at":"2026-08-23T16:02:56+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-phase-c","actor_type":"agente","role":"esecutore CI MetaSkillSystem Fase C D1-A","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"workspace locale"},"tools_used":["Read","Shell","apply_patch","git","node","npm"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"testing-skill","package_version_or_revision":"workspace 23-08-26","source_ref":"docs/Testing-Skill/TESTING_SKILL.md"},{"package_id":"mss-session-contract","package_version_or_revision":"mss.session/0.1.1","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"},{"package_id":"comunicazione-vocabolario","package_version_or_revision":"workspace 23-08-26","source_ref":"docs/Comunicazione-Skill/VOCABOLARIO.md"}],"event":{"event_id":"mss-evt-0198f100-0003-7000-8000-000000000030","event_kind":"session_close","occurred_at":"2026-08-23T16:02:56+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"implementare soltanto la Fase C D1-A con job MSS indipendente, simulazione locale equivalente e prove pre-push","session_type":"deep","capsule_status":"completa","role_key":"esecutore-mss-fase-c-d1-a","area":"MetaSkillSystem / GitHub Actions CI","environment":"workspace locale env/test e repository temporanei isolati; nessun DB o rete applicativa; nessuna CI remota","authorization":{"read":["fonti MSS e Testing indicate dal mandato","workflow, package e helper necessari"],"write":[".github/workflows/ci.yml","Report-fase-c-ci-d1-23-08-26.md","artefatti temporanei poi rimossi"],"forbid":["helper e test Fase B","17 path documentali","src/**","docs/_lavoro/**","DB e Supabase","commit","push","CHIUSO"]},"authorized_outputs":["workflow D1-A","simulazione temporanea ripulita","report Fase C con capsula"],"route":{"chosen":"D1-A approvata: job MSS separato e indipendente dal job documentale/applicativo","alternatives_or_conflicts":[]},"observed_outcome":"workflow separato; simulazione finale changed-reports/H-1/tools verde; Report e Verbale invalidi respinti; docs hard-fail locale 17 e clone CI-like 26; zero residui finali","open_items":["revisione integrata Fase E","autorizzazione esplicita di Matteo prima del push","run GitHub Actions reale post-push"],"controls":[{"control_id":"C-BASELINE","criterio":"branch, discendenza d1598b6, ahead e ownership workflow conformi","esito":"pass","numeratore":4,"denominatore":4,"esecutore":"openai-codex-phase-c","evidence_refs":["source-report"]},{"control_id":"C-B-PREREQ","criterio":"Fase B definitiva: regex unica, H-1 e tools verdi","esito":"pass","numeratore":3,"denominatore":3,"esecutore":"openai-codex-phase-c","evidence_refs":["source-report"]},{"control_id":"C-YAML","criterio":"trigger, job indipendenti, checkout completo, head PR e hard-fail","esito":"pass","numeratore":5,"denominatore":5,"esecutore":"openai-codex-phase-c","evidence_refs":["source-report"]},{"control_id":"C-REPORT-RED-GREEN","criterio":"Report invalido rosso con path/codice e stato ripulito verde","esito":"pass","numeratore":2,"denominatore":2,"esecutore":"openai-codex-phase-c","evidence_refs":["source-report"]},{"control_id":"C-VERBALE-RED-GREEN","criterio":"Verbale invalido rosso con path/codice e stato ripulito verde","esito":"pass","numeratore":2,"denominatore":2,"esecutore":"openai-codex-phase-c","evidence_refs":["source-report"]},{"control_id":"C-JOB-MSS","criterio":"changed-reports, H-1 e tools tutti raggiunti e verdi nel clone finale","esito":"pass","numeratore":3,"denominatore":3,"esecutore":"openai-codex-phase-c","evidence_refs":["source-report"]},{"control_id":"C-DOCS-SEPARATE","criterio":"gate docs ancora hard-fail e non impedisce la sequenza MSS","esito":"pass","numeratore":2,"denominatore":2,"esecutore":"openai-codex-phase-c","evidence_refs":["source-report"]},{"control_id":"C-LINT-VALIDATE","criterio":"lint e validate locali exit 0; H-1 misurato separatamente","esito":"pass","numeratore":3,"denominatore":3,"esecutore":"openai-codex-phase-c","evidence_refs":["source-report"]},{"control_id":"C-DIFF","criterio":"git diff --check sul solo workflow C","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"openai-codex-phase-c","evidence_refs":["source-report"]},{"control_id":"C-CLEANUP","criterio":"root temporanee confinate, rimosse e nessuna capsula invalida residua","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"openai-codex-phase-c","evidence_refs":["source-report"]}],"subject_runtime":{"actor_id":"openai-codex-phase-c","provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"workspace locale"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["path tecnici","hash commit","exit code","conteggi test"],"prohibited_content":["segreti","credenziali","contenuti docs/_lavoro"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-plan","owner_id":"piano-post-revisione","uri_or_path":"docs/Sessioni di lavoro/23-08-26/PLAN-POST-REVISIONE-RIMANENZE-23-08-26.md","stable_anchor_or_event_id":"§10 Fase C","revision_or_hash":"working tree 23-08-26","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-prompt","owner_id":"fase-c-d1-a","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Prompt-fase-c-ci-d1-23-08-26.md","stable_anchor_or_event_id":"mandato integrale","revision_or_hash":"working tree 23-08-26","sensitivity":"internal"},{"ref_id":"source-report","owner_id":"fase-c-d1-a","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-fase-c-ci-d1-23-08-26.md","stable_anchor_or_event_id":"prove e handoff","revision_or_hash":"working tree 23-08-26","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198f100-0003-7000-8000-000000000002","session_id":"mss-ses-0198f100-0003-7000-8000-000000000010","correlation_id":"mss-cor-0198f100-0003-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198f100-0003-7000-8000-000000000010/1/annotation/1","created_at":"2026-08-23T16:02:57+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-phase-c","actor_type":"agente","role":"esecutore CI MetaSkillSystem Fase C D1-A","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"workspace locale"},"tools_used":["Read"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198f100-0003-7000-8000-000000000040","axis":"persona","subject_record_ids":["mss-rec-0198f100-0003-7000-8000-000000000001"],"delta":"nessuno","assertions":[{"signal":"non_osservato","actor":"Matteo","assistance":"non_applicabile:seduta tecnica esecutiva","origin":"naturale","source_ref":"source-prompt","effect":"nessuna inferenza sulla persona","evidence_state":"not_applicable"}],"asserted_by":{"actor_id":"openai-codex-phase-c","role":"esecutore CI MetaSkillSystem Fase C D1-A","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-report","evidence_refs":["source-report"],"notes":"la seduta osserva sistema e output, non competenze personali"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198f100-0003-7000-8000-000000000003","session_id":"mss-ses-0198f100-0003-7000-8000-000000000010","correlation_id":"mss-cor-0198f100-0003-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198f100-0003-7000-8000-000000000010/1/annotation/2","created_at":"2026-08-23T16:02:58+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-phase-c","actor_type":"agente","role":"esecutore CI MetaSkillSystem Fase C D1-A","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"workspace locale"},"tools_used":["Shell","git","node","npm"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"testing-skill","package_version_or_revision":"workspace 23-08-26","source_ref":"docs/Testing-Skill/TESTING_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198f100-0003-7000-8000-000000000050","axis":"sistema","subject_record_ids":["mss-rec-0198f100-0003-7000-8000-000000000001"],"delta":"modificato","assertions":[{"rule_id_version":"D1-A@23-08-26","trigger_event":"mandato Fase C con Fase B definitiva rilasciata","decision_or_output_changed":"workflow da job unico bloccato dai docs a job MSS indipendente con tre gate hard-fail","G":2,"O":2,"E":1}],"asserted_by":{"actor_id":"openai-codex-phase-c","role":"esecutore CI MetaSkillSystem Fase C D1-A","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-report","evidence_refs":["source-report"],"notes":"E=1 finché revisione integrata e GitHub Actions remota non sono osservate"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198f100-0003-7000-8000-000000000004","session_id":"mss-ses-0198f100-0003-7000-8000-000000000010","correlation_id":"mss-cor-0198f100-0003-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198f100-0003-7000-8000-000000000010/1/annotation/3","created_at":"2026-08-23T16:02:59+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-phase-c","actor_type":"agente","role":"esecutore CI MetaSkillSystem Fase C D1-A","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"workspace locale"},"tools_used":["apply_patch"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198f100-0003-7000-8000-000000000060","axis":"output","subject_record_ids":["mss-rec-0198f100-0003-7000-8000-000000000001"],"delta":"creato","assertions":[{"output_id":"workflow-ci-d1-a","primary_type":"processo","canonical_version":"23-08-26-working-tree","recipient":"Matteo e revisore integrato Fase E","problem_or_job":"rendere raggiungibili i gate MSS senza mascherare il debito documentale","intended_use":"gate CI separato pre-chiusura MSS","conceived_by":"piano post-revisione §8","decided_by":"Matteo D1-A","directed_by":"mandato Fase C","authored_by":"openai-codex-phase-c","verified_by":"non_osservato","acceptance_criterion":"job MSS indipendente, tre gate hard-fail, docs hard-fail separato, simulazione completa verde","verification_or_use_evidence":"simulazione locale documentata; revisione integrata e run remota non ancora osservate","verification_status":"self_report","owner_ref":"owner-plan","privacy_release":"requires_confirmation","support_files":[".github/workflows/ci.yml","docs/Sessioni di lavoro/23-08-26/Report-fase-c-ci-d1-23-08-26.md"],"relations_no_double_count":["workflow e report appartengono alla stessa Fase C D1-A"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"openai-codex-phase-c","role":"esecutore CI MetaSkillSystem Fase C D1-A","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-report","evidence_refs":["source-report"],"notes":"la prova locale non sostituisce revisione indipendente o run GitHub Actions"}}}
```
