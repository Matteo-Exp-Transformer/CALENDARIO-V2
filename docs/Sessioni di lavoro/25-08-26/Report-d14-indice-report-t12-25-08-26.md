# M-D14-INDEX — indice report generato (anti-stale)

**Modalità:** deep · **Ruolo:** esecutore M-D14-INDEX · **Branch:** `env/test` · **HEAD base:** `6f3edf5`
**Esito:** **PASS** — `MSS-REPORT-INDEX` è vista generate da FS; test nominato verde.

## 1. Cappello

- **Cosa è cambiato:** l'indice non si aggiorna più a mano; owner = cartella sessioni, non PLAN.
- **Cosa resta:** `WP-1` NO-GO; PLAN/prompt orchestrator non aggiornati in questo mandato.
- **Serve una tua azione:** no per usare la vista; sì solo se vuoi commit/push.

## 2. Cosa è stato fatto

1. Vista `report-index` in `scripts/mss/views.mjs`: scansione `Report-*.md` sotto `docs/Sessioni di lavoro` (salta `_…`); marcatori anti-stale.
2. Test `D14 — indice report generato: …` (FS→rosso, regenerate→verde); aggiornati fixture `V1`/`D14/V1` a quattro viste.
3. MANUALE §2.4-quater + riga limiti: indice non più «ancora manuale».
4. **Non** rifatti ROADMAP/HANDOFF; **non** toccati PLAN, `src/`, capsule.mjs.

## 3. File toccati

| File | Perché |
|---|---|
| `scripts/mss/views.mjs` | vista `report-index` + derive FS |
| `…/archive/indices/MSS-REPORT-INDEX.md` | marcatori + inventario generato |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | test nominato + stub 4 viste |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | limiti / owner FS |
| report + judgments (questa cartella) | deliverable |

## 4. Test eseguiti

| Comando | Esito |
|---|---|
| `npm run generate:mss:views` | **exit 0** |
| `npm run validate:mss:views` | **exit 0** |
| `npm run test:mss:tools` | **exit 0** (include test indice) |
| `npm run validate:mss:all` | **exit 0** (controllo capsula MSSALL) |

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `MANUALE_OPERATIVO_MSS_V0.md` | owner FS + D14 PROVATO | agente freddo |

## 6. Dati comunicazione

Q-A = genera vista (`Decisioni-T12-QABC-25-08-26.md`). Divieti: no `src/`, no WP-1/D27, no commit/push.

## 7. Analisi flusso

Disco sessioni → `generate:mss:views` → blocco fra marcatori → `validate:mss:views` rosso se manca/aggiunge un `Report-*.md`.

## 8. Lettura dell'agente

- **Sistema:** chiude residuo D14 indice; elenco FS-completo (non più subset curato 21-08).
- **Output:** questo report + test nominato.
- **Persona:** nessuna.

## 9. Handoff

**PASS.** Indice non è più debito manuale. Non aprire WP-1. PLAN può ancora dire «residuo indice» finché un ciclo successivo non allinea la prosa.

## 10. Domande di chiusura

❓ Q1 — Prompt: path e hash.
✅ R1: mandato M-D14-INDEX inline parent; HEAD base `6f3edf5` su `env/test`.

❓ Q2 — Dati = misura reale?
✅ R2: sì — generate/validate views + test:mss:tools verdi su working tree.

❓ Q3 — Skill aggiornate?
✅ R3: sì — MANUALE; indice generato non è skill.

❓ Q4 — Cosa NON fatto?
✅ R4: PLAN non aggiornato; ROADMAP/HANDOFF non rifatti; no commit/push.

❓ Q5 — Attrito?
✅ R5: owner FS implica CI rossa a ogni nuovo Report finché non si rigenera — voluto.

❓ Q6 — Contesto?
✅ R6: sufficiente — views.mjs, report D14 precedente, decisione Q-A.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0395e-ad07-712a-b0fa-ab03ef36c3b8","correlation_id":"mss-cor-01a0395e-ad07-7994-acbf-dd670fa7a999","segment_no":1,"created_at":"2026-08-25T16:41:41+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-d14-index","actor_type":"agente","role":"esecutore M-D14-INDEX","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a0395e-ad07-78ab-9bc6-3eae5fe73f27","capture_key":"mss-ses-01a0395e-ad07-712a-b0fa-ab03ef36c3b8/1/session_event/1","event":{"event_id":"mss-evt-01a0395e-ad07-7b92-a03f-109ddae068f0","event_kind":"session_close","occurred_at":"2026-08-25T16:41:41+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore M-D14-INDEX","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 6f3edf5; 11 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-d14-indice-report-t12-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-d14-indice-report-t12-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"VIEWS","criterio":"npm run validate:mss:views (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:views (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"D14IDX","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"MSSALL","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PROMPT_AVVIO_ORCHESTRATORE_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0395e-ad07-712a-b0fa-ab03ef36c3b8","correlation_id":"mss-cor-01a0395e-ad07-7994-acbf-dd670fa7a999","segment_no":1,"created_at":"2026-08-25T16:41:41+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-d14-index","actor_type":"agente","role":"esecutore M-D14-INDEX","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a0395e-ad07-7167-8e38-5393bfba2f0e","capture_key":"mss-ses-01a0395e-ad07-712a-b0fa-ab03ef36c3b8/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a0395e-ad07-7c92-bfc0-3fd391dacb23","axis":"persona","subject_record_ids":["mss-rec-01a0395e-ad07-78ab-9bc6-3eae5fe73f27"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer-m-d14-index","role":"esecutore M-D14-INDEX","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0395e-ad07-712a-b0fa-ab03ef36c3b8","correlation_id":"mss-cor-01a0395e-ad07-7994-acbf-dd670fa7a999","segment_no":1,"created_at":"2026-08-25T16:41:41+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-d14-index","actor_type":"agente","role":"esecutore M-D14-INDEX","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a0395e-ad07-7840-a2c3-406f8497cc28","capture_key":"mss-ses-01a0395e-ad07-712a-b0fa-ab03ef36c3b8/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a0395e-ad07-73ae-98bd-5236f116135d","axis":"sistema","subject_record_ids":["mss-rec-01a0395e-ad07-78ab-9bc6-3eae5fe73f27"],"delta":"creato","assertions":[{"rule_id_version":"D14-INDEX@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato M-D14-INDEX / Q-A: generare vista anti-stale per MSS-REPORT-INDEX","decision_or_output_changed":"VIEWS include report-index con ownerKind sessions-dir; derive da scansione Report-*.md sotto docs/Sessioni di lavoro; validate:mss:views controlla anti-stale; test nominato D14 — indice report generato prova FS→rosso e regenerate→verde. ROADMAP/HANDOFF non rifatti. WP-1 non toccato.","G":2,"O":2,"E":1}],"asserted_by":{"actor_id":"cursor-composer-m-d14-index","role":"esecutore M-D14-INDEX","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0395e-ad07-712a-b0fa-ab03ef36c3b8","correlation_id":"mss-cor-01a0395e-ad07-7994-acbf-dd670fa7a999","segment_no":1,"created_at":"2026-08-25T16:41:41+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-d14-index","actor_type":"agente","role":"esecutore M-D14-INDEX","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a0395e-ad07-7282-a4e7-888f7be37ead","capture_key":"mss-ses-01a0395e-ad07-712a-b0fa-ab03ef36c3b8/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a0395e-ad07-7d85-95fe-d875e240a9df","axis":"output","subject_record_ids":["mss-rec-01a0395e-ad07-78ab-9bc6-3eae5fe73f27"],"delta":"creato","assertions":[{"output_id":"report-d14-indice-report-t12-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-d14-indice-report-t12-25-08-26.md","recipient":"Matteo, orchestratore T12 e revisore","problem_or_job":"chiudere il residuo D14 indice report ancora manuale","intended_use":"prova eseguibile anti-stale FS; handoff orchestratore","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"mandato M-D14-INDEX inline parent; Q-A genera vista","authored_by":"cursor-composer-m-d14-index","verified_by":"non_osservato","acceptance_criterion":"generate/validate:mss:views exit 0 con report-index; test D14 — indice report generato verde; validate:mss:all exit 0; no commit/push","verification_or_use_evidence":"npm run generate:mss:views; validate:mss:views; test:mss:tools; validate:mss:all","verification_status":"self_report","owner_ref":"docs/Sessioni di lavoro","privacy_release":"internal","support_files":["scripts/mss/views.mjs","docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md","docs/MetaSkillSystem/tests/tools/run.mjs","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md"],"relations_no_double_count":["non aggiorna PLAN; non rifà ROADMAP/HANDOFF; non tocca capsule.mjs / WP-1"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer-m-d14-index","role":"esecutore M-D14-INDEX","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
