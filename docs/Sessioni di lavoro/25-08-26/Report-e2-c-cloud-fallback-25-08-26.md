# M-E2-C — Cloud / Codex / Claude fallback (Opzione B)

**Modalità:** deep · **Ruolo:** esecutore M-E2-C · **Branch:** `env/test` · **HEAD:** `972f894`
**Esito in una riga:** fallback misurato senza hook Cloud — checklist CHIUSURA + CI `validate:mss:changed` deny report senza capsula; `H-1.3` **non** promosso.

## 1. Cappello

- **Cosa è cambiato:** Cloud/Codex/Claude senza `stop` hanno checklist obbligatoria + gate CI post-hoc documentato e provato.
- **Cosa resta:** hook Cloud **non installabile**; light fail-open (E2-D); `--no-verify` umano. `H-1.3` = `PASS_CON_RISERVE`. `WP-1` = NO-GO.
- **Serve una tua azione:** no per questo mandato; sì per controverifica orchestratore §6 prima di commit.

## 2. Cosa è stato fatto

1. **Checklist** in `CHIUSURA_SESSIONE.md` (sezione Cloud/Codex/Claude): Q/R+capsula + `validate:mss` (+ `test:mss` se MSS); divieto di promettere hook Cloud.
2. **Hooks README** kit: limiti onesti aggiornati al fallback misurato (checklist + CI).
3. **CI / validate-changed-reports:** messaggio ROSSO e commenti citano indipendenza da stop Cloud/Codex/Claude.
4. **Matrice:** `cloud_codex_claude_fallback_checklist_plus_ci: true`; `stop_does_not_cover_cloud_codex_claude` resta **true**; bypass REPORT-CAPSULE/SCHEMA/QR aggiornati.
5. **Test nominato** `H13-E2 / Cloud-Codex-Claude — stop assente, CI validate:mss:changed deny report senza capsula`.
6. **Manuale operativo** §5: riga Cloud/Codex/Claude.

## 3. Perimetro chiuso vs residuo

| Classe | Superficie | Stato M-E2-C |
|---|---|---|
| **B-E2-CLOUD-STOP** | hook `stop` su Cloud/remote | **RESTA** — non installabile; dichiarato |
| **B-E2-CLOUD-CHECKLIST** | chiusura standard/deep su Cloud/Codex/Claude | **PROVATO** — checklist in CHIUSURA |
| **B-E2-CLOUD-CI** | push/PR report incompleto | **PROVATO** — `validate:mss:changed` deny |
| **B-E2-LIGHT** | light fail-open | **RESTA** — famiglia E2-D |

## 4. File toccati

| File | Perché |
|---|---|
| `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` | checklist Cloud obbligatorio |
| `_skill-system-v0/hooks/README.md` | limiti + fallback misurato |
| `scripts/mss/validate-changed-reports.mjs` | messaggio CI Cloud-aware |
| `.github/workflows/ci.yml` | commento ruolo M-E2-C |
| `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json` | dichiarazione + bypass |
| `docs/MetaSkillSystem/tests/h1/run.mjs` | test nominato |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | limiti §5 |
| judgments + questo report | deliverable |

## 5. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| `npm run test:mss` | **exit 0** — 42 fixture + **56** gruppi (incluso `H13-E2 / Cloud-Codex-Claude — stop assente, CI validate:mss:changed deny report senza capsula`) |
| `npm run test:mss:tools` | **exit 0** — 65 test |
| `npm run validate:mss:views` | **exit 0** |
| `npm run validate:docs` | **exit 0** |
| `npm run validate:mss:all` | **exit 0** (tree stabile) |
| `npm run validate:mss -- --mode file --file "<questo report>" --kind report --require-capsule` | **exit 0** |
| `git diff --check` | **exit 0** |

## 6. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `CHIUSURA_SESSIONE.md` | sezione Cloud/Codex/Claude | fallback operativo |
| `MANUALE_OPERATIVO_MSS_V0.md` | riga limiti | allineamento skill MSS |
| skill area prodotto | nessuno | fuori perimetro |

## 7. Dati comunicazione

- Mandato: parent M-E2-C Opzione B (PLAN §P1.3).
- Divieti: no WP-1, no H-1.3 PASS, no rewrite final, no `src/`, no commit/push.

## 8. Analisi flusso

Un test simula chiusura senza Husky/stop (come Cloud) e prova deny CI. Non inventa hook Cloud.

## 9. Lettura dell'agente

- **Sistema:** buco stop resta onesto; enforcement misurabile è checklist + CI.
- **Output:** test nominato citabile in P1.
- **Persona:** nessuna decisione nuova.

## 10. Derivazione errori / buco residuo

| Residuo | Perché |
|---|---|
| Hook Cloud non installabile | limite piattaforma |
| Light fail-open | E2-D |
| Q/R non verificati in CI | CI valida capsula/schema, non §11 |

## 10-bis. Handoff

**Vero adesso:** M-E2-C consegnato; `H-1.3` = `PASS_CON_RISERVE`; prossimo tipico E2-D o controverifica §6.

**Non riaprire:** WP-1, H-1.3 PASS, promessa hook Cloud.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura.
✅ R1: mandato inline parent M-E2-C; `PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md` §P1.3 @ `972f894`; `Report-hook-qr-chiusura-t7-25-08-26.md` + `Report-h13-e2-bypass-t7-25-08-26.md` @ `972f894`; `COVERAGE_MATRIX_H1.json` @ working tree; HEAD partenza `972f894`.

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti?
✅ R2: sì — diff su CHIUSURA, hooks README, validate-changed-reports, ci.yml, matrice, run.mjs, MANUALE + report/judgments; test Cloud nominato verde; nessuna promozione H-1.3.

❓ Q3 — File correlati: la tabella §6 «File di skill aggiornati» è completa?
✅ R3: sì — CHIUSURA + MANUALE; kit hooks README allineato; nessuna skill area app.

❓ Q4 — Cosa NON hai fatto?
✅ R4: non installato/promesso hook Cloud; non chiuso E2-D light; non promosso H-1.3; non commit/push; non toccato `src/`/DB/WP-1.

❓ Q5 — Attrito + miglioria?
✅ R5: nessun attrito rilevante — riuso del cancello CI E2-A; miglioria futura: E2-D per light.

❓ Q6 — Contesto & hook?
✅ R6: contesto giusto (post E2-A/B); stop locale non applicabile a questo mandato (by design Cloud).
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03868-6287-7a8f-a849-51e996de0afc","correlation_id":"mss-cor-01a03868-6287-7f6f-a388-9af03c4244a1","segment_no":1,"created_at":"2026-08-25T12:12:40+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-e2-c","actor_type":"agente","role":"esecutore M-E2-C","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["Read","Shell","Write","StrReplace"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"session_event","record_id":"mss-rec-01a03868-6287-75c8-a6ff-ca1df4763c35","capture_key":"mss-ses-01a03868-6287-7a8f-a849-51e996de0afc/1/session_event/1","event":{"event_id":"mss-evt-01a03868-6287-7b8f-ab7b-3b278328941b","event_kind":"session_close","occurred_at":"2026-08-25T12:12:40+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore M-E2-C","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 972f894; 15 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-e2-c-cloud-fallback-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-e2-c-cloud-fallback-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"test:mss","criterio":"npm run test:mss (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"test:mss:tools","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"validate:mss:all","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"git-diff-check","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":".github/workflows/ci.yml","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"_skill-system-v0/hooks/README.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"},{"ref_id":"source-git-11","owner_id":"git-working-tree","uri_or_path":"scripts/mss/plan-parse.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"},{"ref_id":"source-git-12","owner_id":"git-working-tree","uri_or_path":"scripts/mss/validate-changed-reports.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"},{"ref_id":"source-git-13","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"972f894","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03868-6287-7a8f-a849-51e996de0afc","correlation_id":"mss-cor-01a03868-6287-7f6f-a388-9af03c4244a1","segment_no":1,"created_at":"2026-08-25T12:12:40+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-e2-c","actor_type":"agente","role":"esecutore M-E2-C","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["Read","Shell","Write","StrReplace"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a03868-6287-745a-aafa-d8d73dd0952a","capture_key":"mss-ses-01a03868-6287-7a8f-a849-51e996de0afc/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a03868-6287-7505-801b-e4082b18ae40","axis":"persona","subject_record_ids":["mss-rec-01a03868-6287-75c8-a6ff-ca1df4763c35"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer-m-e2-c","role":"esecutore M-E2-C","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03868-6287-7a8f-a849-51e996de0afc","correlation_id":"mss-cor-01a03868-6287-7f6f-a388-9af03c4244a1","segment_no":1,"created_at":"2026-08-25T12:12:40+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-e2-c","actor_type":"agente","role":"esecutore M-E2-C","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["Read","Shell","Write","StrReplace"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a03868-6287-77c4-bcac-ca1aaa27a882","capture_key":"mss-ses-01a03868-6287-7a8f-a849-51e996de0afc/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a03868-6287-73ab-b30a-435bb8d85fb7","axis":"sistema","subject_record_ids":["mss-rec-01a03868-6287-75c8-a6ff-ca1df4763c35"],"delta":"modificato","assertions":[{"rule_id_version":"H13-E2/M-E2-C@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato M-E2-C Opzione B: fallback misurato Cloud/Codex/Claude senza hook stop","decision_or_output_changed":"Stop resta non disponibile su Cloud/Codex/Claude (dichiarazione onesta); checklist obbligatoria in CHIUSURA_SESSIONE; CI validate:mss:changed cita Cloud e deny report senza capsula; matrice cloud_codex_claude_fallback_checklist_plus_ci; H-1.3 resta PASS_CON_RISERVE","G":2,"O":1,"E":2}],"asserted_by":{"actor_id":"cursor-composer-m-e2-c","role":"esecutore M-E2-C","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03868-6287-7a8f-a849-51e996de0afc","correlation_id":"mss-cor-01a03868-6287-7f6f-a388-9af03c4244a1","segment_no":1,"created_at":"2026-08-25T12:12:40+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-e2-c","actor_type":"agente","role":"esecutore M-E2-C","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["Read","Shell","Write","StrReplace"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a03868-6287-752f-9648-fb1ca2a1fccf","capture_key":"mss-ses-01a03868-6287-7a8f-a849-51e996de0afc/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a03868-6287-7453-a988-bf83801d95f9","axis":"output","subject_record_ids":["mss-rec-01a03868-6287-75c8-a6ff-ca1df4763c35"],"delta":"creato","assertions":[{"output_id":"report-e2-c-cloud-fallback-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-e2-c-cloud-fallback-25-08-26.md","recipient":"Matteo, orchestratore M-E2-C","problem_or_job":"chiudere B-E2-CLOUD con E2 alternativo misurato senza promettere hook Cloud","intended_use":"controverifica orchestratore §6 prima di commit","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md §P1.3 M-E2-C","authored_by":"cursor-composer-m-e2-c","verified_by":"non_osservato","acceptance_criterion":"test nominato H13-E2/Cloud-Codex-Claude verde; gate obbligatori exit 0; matrice aggiornata; H-1.3 non promosso","verification_or_use_evidence":"npm run test:mss; test:mss:tools; validate:mss:all; validate:mss sul report","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","privacy_release":"internal","support_files":["docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","scripts/mss/validate-changed-reports.mjs","docs/MetaSkillSystem/tests/h1/run.mjs",".github/workflows/ci.yml"],"relations_no_double_count":["Famiglia E2-C; non chiude light fail-open (E2-D); non promuove H-1.3"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer-m-e2-c","role":"esecutore M-E2-C","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
