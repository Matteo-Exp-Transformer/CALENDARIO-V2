# Report orchestratore — ciclo T12 — 25-08-2026

**Modalità:** deep · **Profilo:** Meta orchestratore MSS · **Branch:** `env/test`
**HEAD Passo 0:** `6f3edf5` · **HEAD chiusura:** `6f3edf5` (working tree T12 non committato)

## 1. Cappello

- **Cosa è cambiato:** T12 chiuso — prompt orchestratore allineati; indice report è vista anti-stale (`report-index`).
- **Cosa resta:** commit/push solo con sì; debiti Q-B/Q-C espliciti; WP-1 NO-GO; P3 solo D27 verbatim.
- **Serve una tua azione:** sì — commit/push se dici sì; niente pilota finché non riapri D27.

## 2. Passo 0 rieseguito / stato

| Controllo | Esito |
|---|---|
| `git rev-parse HEAD` | `6f3edf5308295bca30048e37136d36e0db3b9c79` |
| Branch | `env/test` (allineato origin al Passo 0) |
| Working tree Passo 0 | pulito |
| `npm run mss:status` (Passo 0) | ultimo `T11` → prossimo `T12`; H-1.3 PASS; WP-1 NO-GO |
| `npm run validate:mss:all` (Passo 0) | **exit 0** |

## 3. Plan + decisioni annotate

Decisioni Matteo (default plan accettati):
[`Decisioni-T12-QABC-25-08-26.md`](Decisioni-T12-QABC-25-08-26.md)

| ID | Decisione |
|---|---|
| Q-A | **genera vista** indice |
| Q-B | **No** estensione denylist |
| Q-C | **No** multi-assertion `--verify` |

Modelli sub-agent: tutti `auto` (vincolo token Matteo). Revisore famiglia diversa: non disponibile (D17 = avviso).

## 4. Tabella famiglie

| Famiglia | Esito | Report | Test / prova |
|---|---|---|---|
| M-SYNC-ORCH | **PROMUOVERE** | `Report-sync-prompt-orchestrator-n4-t12-25-08-26.md` | grep no `PASS_CON_RISERVE` STOP / no «prossima M-D» viva; `validate:mss:all` |
| M-D14-INDEX | **PROMUOVERE** | `Report-d14-indice-report-t12-25-08-26.md` | `D14 — indice report generato…` |
| M-N4-EXTEND | **saltato** (Q-B No) | — | debito handoff |
| M-VERIFY-MULTI | **saltato** (Q-C No) | — | debito handoff |
| Orchestratore T12 | questo file | — | §6 sotto |

## 5. Gate §6 (orchestratore)

| Comando | Exit |
|---|---|
| `git diff --check` | **0** |
| Perimetro no `src/` / no WP-1 / no D27 | **PASS** |
| `validate:mss` report M-SYNC + M-D14 `--require-capsule` | **0** (rieseguiti) |
| `npm run generate:mss:views` + `validate:mss:views` | **0** (4 viste incl. `report-index`) |
| `npm run validate:mss:all` | **0** (post-mark T12) |
| `npm run mss:status` | ultimo `T12` → prossimo `T13` |

Fix collaterale atteso: test SK-2 live T11/T12 → T12/T13; MANUALE riga H-1.3 allineata a PASS.

## 6. Owner / cruscotto

| Owner | Aggiornamento |
|---|---|
| `PLAN_V0.md` | ciclo **T12 CHIUSO**; D14 indice PROVATO; prossima **T13**; WP-1 NO-GO |
| Prompt ORCH/AVVIO | post-T12 → gate T13 |
| Viste generate | cruscotto + ROADMAP + HANDOFF + report-index |
| `src/` | non toccato |

## 7. Handoff

**Vero adesso:** T12 chiuso sul working tree; HEAD ancora `6f3edf5`.

| Debito | Stato |
|---|---|
| Estensione denylist N4 | **aperto** — Q-B No |
| `--verify` multi-assertion | **aperto** — Q-C No |
| Commit/push T11+P2+T12 | **no** senza sì |
| D27 / WP-1 | chiusa / **NO-GO** |
| P3 | solo **D27 verbatim** |

## 8. Domande di chiusura

❓ Q1 — Prompt ricevuti: path e revisione/hash.
✅ R1: mandato T12 inline parent; Passo 0 HEAD `6f3edf5`; decisioni [`Decisioni-T12-QABC-25-08-26.md`](Decisioni-T12-QABC-25-08-26.md); Matteo: «sono daccordo con le decisioni… procedi».

❓ Q2 — Dati = diff reale?
✅ R2: sì — diff perimetro MSS docs/scripts views+test; no `src/`; famiglie validate OK; status T12→T13 post-mark.

❓ Q3 — File skill §5 completi?
✅ R3: sì — PLAN + MANUALE + PROMPT ORCH/AVVIO + viste; skill prodotto nessuna.

❓ Q4 — Cosa NON hai fatto?
✅ R4: no commit/push; no M-N4-EXTEND; no M-VERIFY-MULTI; no WP-1/D27; no E2.

❓ Q5 — Attrito + miglioria?
✅ R5: dopo mark T12 il test SK-2 live va aggiornato nello stesso edit (come T11). Miglioria: checklist «mark PLAN → aggiorna SK-2 live» nel mandato orch.

❓ Q6 — Contesto & hook?
✅ R6: contesto Meta MSS / T12 giusto; hook commit non esercitato.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03967-7ae7-735d-8e97-b0a78988242b","correlation_id":"mss-cor-01a03967-7ae7-7a42-80f3-980ea78e1cb0","segment_no":1,"created_at":"2026-08-25T16:51:18+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-orch-t12","actor_type":"agente","role":"orchestratore T12","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a03967-7ae7-7552-8f0f-63c9299ec3f5","capture_key":"mss-ses-01a03967-7ae7-735d-8e97-b0a78988242b/1/session_event/1","event":{"event_id":"mss-evt-01a03967-7ae7-75f1-bd92-943c004df407","event_kind":"session_close","occurred_at":"2026-08-25T16:51:18+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"orchestratore T12","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 6f3edf5; 17 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-orchestratore-t12-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-orchestratore-t12-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"validate-mss-all","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"git-diff-check","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PROMPT_AVVIO_ORCHESTRATORE_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03967-7ae7-735d-8e97-b0a78988242b","correlation_id":"mss-cor-01a03967-7ae7-7a42-80f3-980ea78e1cb0","segment_no":1,"created_at":"2026-08-25T16:51:18+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-orch-t12","actor_type":"agente","role":"orchestratore T12","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03967-7ae7-7a8f-80c7-e8acdda3eac6","capture_key":"mss-ses-01a03967-7ae7-735d-8e97-b0a78988242b/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a03967-7ae7-790e-8ae8-dfe30b32713a","axis":"persona","subject_record_ids":["mss-rec-01a03967-7ae7-7552-8f0f-63c9299ec3f5"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer-orch-t12","role":"orchestratore T12","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03967-7ae7-735d-8e97-b0a78988242b","correlation_id":"mss-cor-01a03967-7ae7-7a42-80f3-980ea78e1cb0","segment_no":1,"created_at":"2026-08-25T16:51:18+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-orch-t12","actor_type":"agente","role":"orchestratore T12","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03967-7ae7-7c5a-832f-2b5b0b618603","capture_key":"mss-ses-01a03967-7ae7-735d-8e97-b0a78988242b/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a03967-7ae7-7de9-b3a9-8168cb320522","axis":"sistema","subject_record_ids":["mss-rec-01a03967-7ae7-7552-8f0f-63c9299ec3f5"],"delta":"modificato","assertions":[{"rule_id_version":"T12-ORCH@mss-v0.1-wp0.1-freeze-2","trigger_event":"Chiusura orchestratore ciclo T12 (M-SYNC-ORCH + M-D14-INDEX; Q-B/Q-C No)","decision_or_output_changed":"T12 CHIUSO: prompt allineati; indice report-index PROVATO; PLAN mark T12→T13; debiti Q-B/Q-C espliciti; WP-1 NO-GO; D27 chiusa","G":2,"O":1,"E":2}],"asserted_by":{"actor_id":"cursor-composer-orch-t12","role":"orchestratore T12","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03967-7ae7-735d-8e97-b0a78988242b","correlation_id":"mss-cor-01a03967-7ae7-7a42-80f3-980ea78e1cb0","segment_no":1,"created_at":"2026-08-25T16:51:18+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-orch-t12","actor_type":"agente","role":"orchestratore T12","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03967-7ae7-7bf5-91ab-c79836c1697a","capture_key":"mss-ses-01a03967-7ae7-735d-8e97-b0a78988242b/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a03967-7ae7-7f62-9831-b36c60e5fde7","axis":"output","subject_record_ids":["mss-rec-01a03967-7ae7-7552-8f0f-63c9299ec3f5"],"delta":"creato","assertions":[{"output_id":"report-orchestratore-t12-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-orchestratore-t12-25-08-26.md","recipient":"Matteo","problem_or_job":"chiudere ciclo T12 residui documentali con gate §6 e handoff","intended_use":"sintesi post-T12; base per T13 commit o debiti Q-B/Q-C con sì","conceived_by":"Matteo","decided_by":"Matteo (Q-A vista; Q-B No; Q-C No)","directed_by":"Mandato orchestratore T12 inline parent","authored_by":"cursor-composer-orch-t12","verified_by":"non_osservato","acceptance_criterion":"report ≤200; due famiglie PROMUOVERE; validate:mss:all 0; PLAN T12 CHIUSO; no commit/push; WP-1 NO-GO","verification_or_use_evidence":"validate:mss:all; validate:mss famiglie+orch; mss:status T12→T13; git diff --check; HEAD 6f3edf5","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/Sessioni di lavoro/25-08-26/Report-sync-prompt-orchestrator-n4-t12-25-08-26.md","docs/Sessioni di lavoro/25-08-26/Report-d14-indice-report-t12-25-08-26.md","docs/Sessioni di lavoro/25-08-26/Decisioni-T12-QABC-25-08-26.md","docs/MetaSkillSystem/PLAN_V0.md"],"relations_no_double_count":["Sintesi M-SYNC+M-D14-INDEX; non apre Q-B/Q-C/D27/WP-1; non tocca src/"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer-orch-t12","role":"orchestratore T12","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
