# Report — backlog R1 SK-4: hook Q/R + CLI staged `--require-capsule` — 23-08-26

**Cosa è cambiato:** l'hook pre-commit e la CLI MSS in modalità staged ora condividono lo stesso perimetro path e la stessa propagazione del flag capsula — un report deep in sotto-cartella non sfugge più all'audit Q/R, e `--require-capsule` in staged nega correttamente i report B2 senza capsula.

**Cosa resta:** commit/push quando Matteo dice «fai report finale»; eventuali altri item del backlog INDICE §1 (fuori perimetro questo task).

**Serve una tua azione:** no (fino a chiusura commit).

**Data:** 23-08-26 · **Tipo:** esecuzione backlog post-SK-4

**Modalità:** standard

## Cosa è stato fatto

1. **Hook pre-commit** (`.cursor/hooks/fine-sessione-commit-check.mjs`): rimossa la regex locale `[^/]+` (ancora su HEAD `245e684`); import di `isMssRelevantPath` e `REPORT_PATH_RE` da `scripts/mss/adapter.mjs` per l'audit «Domande di chiusura» sui report staged — parità con `collectStagedMssEntries` / validator MSS.

2. **CLI staged** (`scripts/mss/cli.mjs` + `scripts/mss/adapter.mjs`): `--require-capsule` propagato a `validateStagedMssFiles` → `validatePathContent` (`requireCapsule` nel loop report/jsonl operativi).

3. **Test H-1** (`docs/MetaSkillSystem/tests/h1/run.mjs`): aggiunto `testH13StagedRequireCapsule` — undeclared passa senza flag, deny con flag; deep deny senza flag.

## File toccati

| File | Perché |
|---|---|
| `.cursor/hooks/fine-sessione-commit-check.mjs` | perimetro Q/R allineato a `isMssRelevantPath` / `REPORT_PATH_RE` |
| `scripts/mss/adapter.mjs` | opzione `requireCapsule` in `validateStagedMssFiles` |
| `scripts/mss/cli.mjs` | inoltro flag in `--mode staged` |
| `docs/MetaSkillSystem/tests/h1/run.mjs` | regressione staged + require-capsule |
| `docs/Sessioni di lavoro/23-08-26/sub/Report-test.md` | fixture prove manuali (tabella scenari) |

## Prove obbligatorie

### 1. Staged senza capsula, senza dichiarazione modalità — deny solo con `--require-capsule`

File: `docs/Sessioni di lavoro/23-08-26/sub/Report-test.md` (staged, contenuto senza capsula né riga modalità contrattuale).

```
=== senza flag ===
validate:mss OK
exit=0

=== CON --require-capsule ===
validate:mss FAIL (deny=1 warn=0)
[deny] MSS-REPORT-NO-CAPSULE @ …/sub/Report-test.md :: Capsula MetaSkillSystem
exit=1
```

### 2. Stesso path con modalità deep — deny anche senza flag

```
validate:mss FAIL (deny=1 warn=0)
[deny] MSS-REPORT-NO-CAPSULE @ …/sub/Report-test.md
exit=1
```

### 3. Report deep in `sub/` staged, Q/R incomplete — hook blocca

```
PRE-COMMIT fine-sessione: report incompleto, commit bloccato.

- docs/Sessioni di lavoro/23-08-26/sub/Report-test.md
  risposte vuote: Q1
exit=1
```

(Path `sub/` non matchava la vecchia `REPORT_RE` con `[^/]+` su HEAD.)

### 4. `npm run test:mss`

```
H-1 suite green: 42 fixture cases + 33 contract/integration groups
exit=0
```

(incluso `OK H-1.3 staged CLI require-capsule`)

### 5. `node --check`

```
node --check scripts/mss/adapter.mjs   → 0
node --check scripts/mss/cli.mjs       → 0
node --check .cursor/hooks/fine-sessione-commit-check.mjs → 0
node --check docs/MetaSkillSystem/tests/h1/run.mjs → 0
```

## File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| nessuno | — | diff solo su enforcement MSS/hook/test; nessuna skill area descrive queste regex |

## Cosa NON ho fatto

- Commit / push (non richiesti).
- Modifiche a `src/`, contratto, fixture frozen, SK-7/SK-11.
- Dichiarazioni di riapertura/chiusura SK-4.
- Allineamento INDICE/backlog (resta a Matteo al commit).

## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-0198f300-0001-7000-8000-000000000001","session_id":"mss-ses-0198f300-0001-7000-8000-000000000010","correlation_id":"mss-cor-0198f300-0001-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198f300-0001-7000-8000-000000000010/1/session_event/1","created_at":"2026-08-23T19:20:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-auto-sk4-backlog-hook-cli","actor_type":"agente","role":"esecutore backlog R1 SK-4","agent_runtime":{"provider":"Cursor","model":"Auto","runtime":"Cursor Agent","surface":"IDE chat"},"tools_used":["Read","Write","StrReplace","Shell","Grep","git","node","npm"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"event":{"event_id":"mss-evt-0198f300-0001-7000-8000-000000000030","event_kind":"session_close","occurred_at":"2026-08-23T19:20:00+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"chiudere gap R1 post-SK-4: hook Q/R sotto-cartelle + CLI staged --require-capsule","session_type":"standard","capsule_status":"completa","role_key":"esecutore-mss-enforcement","area":"MetaSkillSystem / hook / CLI","environment":"workspace locale env/test HEAD 245e684+","authorization":{"read":["scripts/mss",".cursor/hooks","docs/MetaSkillSystem/tests/h1"],"write":["adapter.mjs","cli.mjs","fine-sessione-commit-check.mjs","run.mjs","report"],"forbid":["src","fixture frozen","commit senza mandato"]},"authorized_outputs":["hook e CLI allineati","report con prove"],"route":{"chosen":"mandato chat 23-08-26 backlog R1","alternatives_or_conflicts":"nessuno"},"observed_outcome":"due gap chiusi; prove 1-5 verdi; test:mss 33 gruppi","open_items":["commit push su «fai report finale»"],"controls":[{"control_id":"MSS-TEST","criterio":"npm run test:mss exit 0","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"Cursor Auto","evidence_refs":["source-report"]},{"control_id":"CLI-RC","criterio":"staged --require-capsule deny MSS-REPORT-NO-CAPSULE","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"Cursor Auto","evidence_refs":["source-report"]},{"control_id":"HOOK-QR","criterio":"pre-commit blocca Q/R vuota in sub/","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"Cursor Auto","evidence_refs":["source-report"]}],"subject_runtime":{"actor_id":"cursor-auto-sk4-backlog-hook-cli","provider":"Cursor","model":"Auto","runtime":"Cursor Agent","surface":"IDE chat"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["path repo","exit code"],"prohibited_content":["segreti"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-mandato","owner_id":"backlog-r1","uri_or_path":"docs/Sessioni di lavoro/23-08-26/INDICE-SESSIONE-23-08-26.md","stable_anchor_or_event_id":"backlog §1-2","revision_or_hash":"working tree","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-report","owner_id":"report-sk4-backlog","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-sk4-backlog-hook-cli-23-08-26.md","stable_anchor_or_event_id":"prove obbligatorie","revision_or_hash":"working tree","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198f300-0001-7000-8000-000000000002","session_id":"mss-ses-0198f300-0001-7000-8000-000000000010","correlation_id":"mss-cor-0198f300-0001-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198f300-0001-7000-8000-000000000010/1/annotation/1","created_at":"2026-08-23T19:20:01+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-auto-sk4-backlog-hook-cli","actor_type":"agente","role":"esecutore backlog R1 SK-4","agent_runtime":{"provider":"Cursor","model":"Auto","runtime":"Cursor Agent","surface":"IDE chat"},"tools_used":["Read"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198f300-0001-7000-8000-000000000040","axis":"persona","subject_record_ids":["mss-rec-0198f300-0001-7000-8000-000000000001"],"delta":"nessuno","assertions":[{"signal":"mandato_esplicito","actor":"Matteo","assistance":"guidato","origin":"naturale","source_ref":"source-report","effect":"task delimitato con prove e divieti","evidence_state":"observed"}],"asserted_by":{"actor_id":"cursor-auto-sk4-backlog-hook-cli","role":"esecutore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-report","evidence_refs":["source-report"],"notes":"prompt chat verbatim in Q1"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198f300-0001-7000-8000-000000000003","session_id":"mss-ses-0198f300-0001-7000-8000-000000000010","correlation_id":"mss-cor-0198f300-0001-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198f300-0001-7000-8000-000000000010/1/annotation/2","created_at":"2026-08-23T19:20:02+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-auto-sk4-backlog-hook-cli","actor_type":"agente","role":"esecutore backlog R1 SK-4","agent_runtime":{"provider":"Cursor","model":"Auto","runtime":"Cursor Agent","surface":"IDE chat"},"tools_used":["Shell","StrReplace"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198f300-0001-7000-8000-000000000050","axis":"sistema","subject_record_ids":["mss-rec-0198f300-0001-7000-8000-000000000001"],"delta":"verificato","assertions":[{"rule_id_version":"validateStagedMssFiles@adapter","trigger_event":"gap R1 revisione indipendente","decision_or_output_changed":"requireCapsule propagato; hook usa isMssRelevantPath+REPORT_PATH_RE","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"cursor-auto-sk4-backlog-hook-cli","role":"esecutore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-report","evidence_refs":["source-report"],"notes":"test H-1.3 staged CLI require-capsule aggiunto"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198f300-0001-7000-8000-000000000004","session_id":"mss-ses-0198f300-0001-7000-8000-000000000010","correlation_id":"mss-cor-0198f300-0001-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198f300-0001-7000-8000-000000000010/1/annotation/3","created_at":"2026-08-23T19:20:03+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-auto-sk4-backlog-hook-cli","actor_type":"agente","role":"esecutore backlog R1 SK-4","agent_runtime":{"provider":"Cursor","model":"Auto","runtime":"Cursor Agent","surface":"IDE chat"},"tools_used":["Write"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198f300-0001-7000-8000-000000000060","axis":"output","subject_record_ids":["mss-rec-0198f300-0001-7000-8000-000000000001"],"delta":"creato","assertions":[{"output_id":"report-sk4-backlog-hook-cli-23-08-26","primary_type":"registro","canonical_version":"23-08-26","recipient":"Matteo","problem_or_job":"gap R1 hook regex e CLI staged require-capsule","intended_use":"chiusura backlog e base commit","conceived_by":"INDICE backlog §1-2","decided_by":"Matteo","directed_by":"mandato chat","authored_by":"Cursor Auto","verified_by":"non_osservato","acceptance_criterion":"prove 1-5 + test:mss verdi","verification_or_use_evidence":"sezione Prove obbligatorie","verification_status":"self_report","owner_ref":"owner-mandato","privacy_release":"requires_confirmation","support_files":["sub/Report-test.md"],"relations_no_double_count":[],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-auto-sk4-backlog-hook-cli","role":"esecutore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-report","evidence_refs":["source-report"],"notes":"revisione indipendente non rieseguita in questa chat"}}}
```

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «Profilo: Esecuzione · modalità standard · Branch: env/test · HEAD atteso: 245e684 (o successivo)» + mandato completo con contesto SK-4 chiuso, obiettivo «Chiudere i due gap con diff minimo: hook allineato a isMssRelevantPath() da adapter.mjs; CLI staged propaga requireCapsule», file in perimetro, prove obbligatorie 1-5, divieti (no src/contratto/fixture frozen/SK-7/SK-11, no commit salvo «fai report finale»), output report con capsula e Q1–Q6 verbatim da CHIUSURA_SESSIONE.md §11.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Ri-verificato: (1) `git rev-parse HEAD` → `245e684`; `git show HEAD:…/fine-sessione-commit-check.mjs` conteneva ancora `REPORT_RE` con `[^/]+`; working tree importa `isMssRelevantPath` + `REPORT_PATH_RE`. (2) `adapter.mjs` — firma `validateStagedMssFiles(..., { requireCapsule })` e pass-through a `validatePathContent`. (3) `cli.mjs` riga staged passa `requireCapsule: args.requireCapsule`. (4) Prove 1-3 rilanciate in shell con output incollato in §Prove. (5) `npm run test:mss` → 42+33 gruppi exit 0. (6) `node --check` sui 4 file toccati exit 0.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessuna skill area da aggiornare — il cambiamento è enforcement interno MSS/hook già documentato in backlog INDICE e report revisione R1; tabella «File di skill aggiornati» = nessuno. Test H-1 allineato con `testH13StagedRequireCapsule`.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: (1) Commit/push — esplicitamente vietati finché Matteo non dice «fai report finale». (2) Aggiornamento INDICE/backlog checkbox — fuori scope esecuzione, resta al commit. (3) Revisione indipendente ripetuta — non richiesta; gap chiusi con prove automatizzate + manuali. (4) Non ho lasciato staged il probe `sub/Report-test.md` dopo le prove (`git reset HEAD`).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: nessuna osservazione — verificato che il fix hook era già parzialmente nel working tree (D18) ma non su HEAD; il mandato ha chiarito bene i due gap distinti (Q/R vs requireCapsule) evitando confusione con il perimetro SK-4 già chiuso in adapter.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto — mandato auto-contenuto con path, prove numerate e divieti. Hook Cursor non intercettati in chat (lavoro pre-commit); il probe manuale su `fine-sessione-commit-check.mjs` ha confermato il comportamento atteso su path `sub/`.
