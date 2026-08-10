# Report A3 — Prove tecniche e path hard-coded

**Modalità:** deep · SEP-10 fase A3 · `SEP-SES-20260810-021` (segmento A3)  
**AGC:** `SEP-AGC-xai-cursor-001` · 10-08-2026 · **Zero fix** validator/hook/fixture

---

## Cappello

- **Cosa è cambiato:** matrice path→consumatore per MSS tecnico.
- **Cosa resta:** B1 userà questi HIGH come vincoli di fase.
- **Serve una tua azione:** no.

---

## 1. Fotografia Git

`env/test` · `bec82c39…` · staging vuoto · scripts/mss + fixtures spesso **untracked** (WT concorrente).

---

## 2. Inventario prove

| path | ruolo |
|---|---|
| `scripts/mss/cli.mjs` | CLI validate:mss |
| `scripts/mss/adapter.mjs` | adapter file/staged + costanti path |
| `scripts/mss/core.mjs` | core validate |
| `scripts/mss/parse.mjs` | parse report/capsula |
| `scripts/mss/rules.mjs` | regole/schema version |
| `scripts/mss/refs.mjs` | resolve ref |
| `scripts/mss/canonical.mjs` | canonical JSON |
| `scripts/mss/git-adapter.mjs` | git staged/head + root fixture |
| `scripts/mss/report-questions.mjs` | audit Q/R |
| `docs/MetaSkillSystem/fixtures/v0.1/manifest.json` | manifest fixture |
| `docs/MetaSkillSystem/fixtures/v0.1/FX-*` | fixture I/S/V |
| `docs/MetaSkillSystem/tests/h1/run.mjs` | runner test:mss |
| `docs/MetaSkillSystem/tests/h1/build-fixtures.mjs` | builder |
| `docs/MetaSkillSystem/tests/h1/fixture-factory.mjs` | factory |
| `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json` | coverage matrix |
| `.cursor/hooks/fine-sessione-nudge.mjs` | stop hook |
| `.cursor/hooks/fine-sessione-commit-check.mjs` | pre-commit |
| `package.json` scripts `validate:mss` / `test:mss` / `generate:mss-fixtures` | entry npm |

---

## 3. Matrice path hard-coded → consumatore

| path hard-coded | consumatore | se spostato rompe | rischio | certezza |
|---|---|---|---|---|
| `docs/MetaSkillSystem/fixtures/v0.1/manifest.json` | `adapter.mjs`, `run.mjs` | validate/test | **alto** | alta |
| `docs/MetaSkillSystem/fixtures/v0.1` (root) | `adapter.mjs`, `git-adapter.mjs`, `run.mjs` | tutta la suite | **alto** | alta |
| `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json` | `run.mjs` | coverage gate test | **alto** | alta |
| `docs/MetaSkillSystem/fixtures/v0.1/<FX-*>` | `run.mjs` (join) | casi singoli | alto | alta |
| `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` | fixture-factory `source_ref` | metadata fixture | medio | alta |
| `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | factory/ownerRef; test staged | ref owner | alto | alta |
| `docs/MetaSkillSystem/PLAN_V0.md` | `run.mjs` path absolute/traversal cases | test path safety | medio | alta |
| `scripts/mss/*.mjs` | hooks import `../../scripts/mss/...` | chiusura chat/commit | **alto** | alta |
| `scripts/mss/cli.mjs` | `package.json` validate:mss; spawn in run.mjs | CLI | alto | alta |
| `docs/MetaSkillSystem/tests/h1/run.mjs` | `package.json` test:mss | suite | alto | alta |
| `docs/MetaSkillSystem/tests/h1/build-fixtures.mjs` | generate:mss-fixtures | regen fixture | medio | alta |

**Non eseguito in A3:** `npm run test:mss` come sanatoria; opzionale solo evidenza stato — saltato per non mescolare H-1.3 FAIL con ricognizione (esito H-1.3 già autorevole).

---

## 4. Findings A3

| ID | Sev. | Asse | Effetto |
|---|---|---|---|
| A3-F01 | **HIGH** | sistema | Move banale di `fixtures/v0.1` o `scripts/mss` rompe hook + test + validate |
| A3-F02 | **HIGH** | sistema | `COVERAGE_MATRIX_H1.json` path fisso in runner |
| A3-F03 | MEDIUM | sistema | Import relativi hook→scripts: rename cartella `.cursor/hooks` o depth rompe stop/pre-commit |
| A3-F04 | MEDIUM | output | Suite e matrix vivono fuori dal pack SEP: migrazione «solo docs» non è isolata |
| A3-F05 | LOW | sistema | G «prove versionate» · E reale = path stringhe (enforcement path-coupled) |

---

## 5. Segnali MSS (G/O/E)

- **G:** contratto e freeze H-1 dichiarano prove.
- **O:** prove funzionano sul path corrente (anche untracked).
- **E:** enforcement è path hard-coded, non policy di archivio. Vale E path-coupled.

---

## 6. Inventario schema (subset)

| path | categoria | stato | rischio | certezza | note_1_riga |
|---|---|---|---|---|---|
| `scripts/mss/**` | prova_tecnica | prova | alto | alta | non spostare senza rewrite import |
| `fixtures/v0.1/**` | prova_tecnica | prova | alto | alta | costante MSS_FIXTURE_ROOT |
| `tests/h1/**` | prova_tecnica | prova | alto | alta | package.json |
| `COVERAGE_MATRIX_H1.json` | prova_tecnica | prova | alto | alta | run.mjs |
| `.cursor/hooks/fine-sessione-*.mjs` | prova_tecnica | prova | alto | alta | import scripts/mss |

---

## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-019fec21-a301-7000-8000-000000000001","session_id":"mss-ses-019fec21-a301-7000-8000-0000000000a1","correlation_id":"mss-cor-019fec21-a301-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec21-a301-7000-8000-0000000000a1/1/session_event/1","created_at":"2026-08-10T15:15:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep10-a3","actor_type":"agente","role":"sep10_a3","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["PowerShell","Git","Read","Grep","Write","Node.js"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md"},{"package_id":"communication-closure","package_version_or_revision":"working-tree","source_ref":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md"}],"event":{"event_id":"mss-evt-019fec21-a301-7000-8000-0000000000e1","event_kind":"session_close","occurred_at":"2026-08-10T15:15:00+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"Eseguire A3 prove tecniche","session_type":"deep","capsule_status":"completa","role_key":"Meta writer","area":"MetaSkillSystem SEP-10 A3","environment":"branch env/test; HEAD bec82c39; staging vuoto; working-tree concorrente non attribuito","authorization":{"read":["docs/MetaSkillSystem/**","scripts/mss/**","plan SEP-10"],"write":["docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/**","report ombrello","MASTERPLAN SEP-10","HANDOFF","SESSION_LOG"],"forbid":["rename/move/migrazione","SEP-11","H-1.3 fix","WP-1","Valutazione Personale contents","commit"]},"authorized_outputs":["report A3","capsula"],"route":{"chosen":"SENIOR_EVAL_SKILL + MASTERPLAN","alternatives_or_conflicts":"nessuno"},"observed_outcome":"A3 path hard-coded","open_items":["B1","B2","SEP-11 vietato"],"controls":[{"control_id":"NO-MIGRATION","criterio":"zero rename/move","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-grok-sep10-a3","evidence_refs":["owner-report"]},{"control_id":"SCHEMA-INVENTORY","criterio":"report contiene inventario/findings/segnali","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-grok-sep10-a3","evidence_refs":["owner-report"]}],"subject_runtime":{"actor_id":"mss.senior-eval-pack/0.1.0","provider":"non_applicabile:oggetto documentale","model":"non_applicabile:oggetto documentale","runtime":"docs/MetaSkillSystem/Senior-Eval-Pack","surface":"markdown pack"},"privacy":{"classification":"internal","capture_basis":"user_request","allowed_content":["finding","path","git metadata","decisioni Matteo"],"prohibited_content":["dati personali Valutazione Personale","segreti"],"redactions":"nessuno","external_release":"forbidden","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-report","owner_id":"SEP-10-A3","uri_or_path":"docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-A3-prove-tecniche-path.md","stable_anchor_or_event_id":"SEP-SES-20260810-021","revision_or_hash":"working-tree-10-08-26","sensitivity":"internal"},{"ref_id":"owner-masterplan","owner_id":"mss.senior-eval-masterplan","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md","stable_anchor_or_event_id":"SEP-10","revision_or_hash":"working-tree-10-08-26","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-user","owner_id":"conversation","uri_or_path":"conversation:this-session","stable_anchor_or_event_id":"mandate-SEP-10-A1A4","revision_or_hash":"10-08-26","sensitivity":"internal"},{"ref_id":"source-plan","owner_id":"plan","uri_or_path":".cursor/plans/sep-10_archiviazione_mss_430c9c1d.plan.md","stable_anchor_or_event_id":"A1-A4","revision_or_hash":"kept","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fec21-a301-7000-8000-000000000002","session_id":"mss-ses-019fec21-a301-7000-8000-0000000000a1","correlation_id":"mss-cor-019fec21-a301-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec21-a301-7000-8000-0000000000a1/1/annotation/1","created_at":"2026-08-10T15:15:01+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep10-a3","actor_type":"agente","role":"sep10_a3","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write"]},"packages_loaded":[{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fec21-a301-7000-8000-0000000000a1","axis":"persona","subject_record_ids":["mss-rec-019fec21-a301-7000-8000-000000000001"],"delta":"nessuno","assertions":[{"signal":"non_osservato","actor":"matteo","assistance":"non_applicabile:analisi read-only","origin":"naturale","source_ref":"source-user","effect":"nessuna nuova decisione mid-flight","evidence_state":"observed"}],"asserted_by":{"actor_id":"cursor-grok-sep10-a3","role":"sep10_a3","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile:gate_o_archivio","evidence_refs":["source-user"],"notes":"nessuna inferenza su competenze o profilo di Matteo"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fec21-a301-7000-8000-000000000003","session_id":"mss-ses-019fec21-a301-7000-8000-0000000000a1","correlation_id":"mss-cor-019fec21-a301-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec21-a301-7000-8000-0000000000a1/1/annotation/2","created_at":"2026-08-10T15:15:02+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep10-a3","actor_type":"agente","role":"sep10_a3","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write","Grep"]},"packages_loaded":[{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md"}],"annotation":{"annotation_id":"mss-ann-019fec21-a301-7000-8000-0000000000a2","axis":"sistema","subject_record_ids":["mss-rec-019fec21-a301-7000-8000-000000000001"],"delta":"NON_INIZIATO -> IN_CORSO_analisi","assertions":[{"rule_id_version":"SEP-10@mss.senior-eval-pack/0.1.0","trigger_event":"ricognizione A3","decision_or_output_changed":"artefatto analisi","G":2,"O":2,"E":0}],"asserted_by":{"actor_id":"cursor-grok-sep10-a3","role":"sep10_a3","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-masterplan","evidence_refs":["owner-report"],"notes":"calibrazione/documentazione"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fec21-a301-7000-8000-000000000004","session_id":"mss-ses-019fec21-a301-7000-8000-0000000000a1","correlation_id":"mss-cor-019fec21-a301-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec21-a301-7000-8000-0000000000a1/1/annotation/3","created_at":"2026-08-10T15:15:03+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep10-a3","actor_type":"agente","role":"sep10_a3","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write"]},"packages_loaded":[{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fec21-a301-7000-8000-0000000000a3","axis":"output","subject_record_ids":["mss-rec-019fec21-a301-7000-8000-000000000001"],"delta":"creato","assertions":[{"output_id":"SEP-OUT-sep10-a3-0.1","primary_type":"registro","canonical_version":"2026-08-10-v1","recipient":"Matteo","problem_or_job":"ricognizione archiviazione read-only","intended_use":"input B1","conceived_by":"Matteo via plan","decided_by":"plan tenuto","directed_by":"prompt Fase 2","authored_by":"cursor-grok-sep10-a3","verified_by":"validate capsula","acceptance_criterion":"report in cartella SEP-10 senza migrazione","verification_or_use_evidence":"file presente","verification_status":"self_report","owner_ref":"owner-report","privacy_release":"internal","support_files":["docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/README.md"],"relations_no_double_count":["un report per fase"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-grok-sep10-a3","role":"sep10_a3","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-report","evidence_refs":["owner-report"],"notes":"non eval prospettica"}}}
```
