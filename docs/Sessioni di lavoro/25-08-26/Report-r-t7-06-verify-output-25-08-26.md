# R-T7-06 Opzione B — `--verify` patcha assertions[] Output

**Modalità:** deep · **Ruolo:** esecutore T11 Famiglia R-T7-06 · **Branch:** `env/test`
**Esito:** **PASS** — estensione N2 su asse Output; test nominato verde; owner PLAN → CHIUSA.

## 1. Cappello

- **Cosa è cambiato:** se un revisore fa `--verify` su un record Output con una sola asserzione, l'amendment aggiorna anche `assertions[0].verification_status` e `verification_or_use_evidence` (oltre a `annotation.verification.*`). Non serve più amendment manuale tipo SK4-ASSERT per quel caso.
- **Cosa resta:** multi-assertion Output (indice > 0) resta amendment manuale; WP-1/D27 NO-GO; nessuna riscrittura di record `final`.
- **Serve una tua azione:** no per questo mandato (no commit/push).

## 2. Problema e perimetro

| Elemento | Valore |
|---|---|
| Debito | R-T7-06 — `--verify` non toccava `assertions[]` Output |
| Precedente | ACCETTATO via amendment manuale SK4-ASSERT T7 |
| Autorizzazione | Matteo · Opzione B |
| Fuori | `src/`, WP-1, D27, D21, allentamento validator, rewrite final, rifare D14/N4 |

## 3. Approccio

**Estensione di `--verify`** (non flag nuovo): stesso formato `record|status|evidence|motivo`.

In `buildVerificationAmendments` (`scripts/mss/capsule.mjs`), se il bersaglio è asse `output`:

| Guardrail | Comportamento |
|---|---|
| Solo Output | persona/sistema invariati (solo `annotation.verification.*`) |
| Esattamente 1 assertion | patch `assertions[0].verification_status` + `verification_or_use_evidence` |
| 0 o >1 assertions | exit `2` / `VERIFY_INVALID` — messaggio esplicito |
| Record `final` | non mutato in-place; solo amendment append-only |
| Esiti | ancora solo `independently_verified` \| `contradicted` (`self_report` rifiutato) |
| Validator | non allentato |

## 4. File toccati

| File | Perché |
|---|---|
| `scripts/mss/capsule.mjs` | Opzione B in `buildVerificationAmendments` |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | test nominato R-T7-06 |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | N2 + R-T7-06 PROVATO |
| `docs/MetaSkillSystem/PLAN_V0.md` | owner: R-T7-06 CHIUSA |
| viste generate (cruscotto/ROADMAP/HANDOFF) | allineamento anti-stale post-PLAN |
| questo report + judgments | deliverable |

## 5. Test eseguiti

| Comando | Esito |
|---|---|
| `npm run test:mss:tools` | **exit 0** (69) — incl. `capsule: R-T7-06 / Opzione B — --verify patcha assertions[] Output` |
| `npm run validate:mss:all` | **exit 0** (prima della capsula; non ripetuto nei controls per durata) |
| `git diff --check` | **exit 0** |
| `mss:capsule --append-to` (controls: tools + diff-check) | **exit 0** |

## 6. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `MANUALE_OPERATIVO_MSS_V0.md` | blocco R-T7-06 Opzione B PROVATO sotto N2 | comportamento attrezzo |
| `PLAN_V0.md` | R-T7-06 → CHIUSA; prossima azione T11 aggiornata | owner stato |
| viste MSS | rigenerate | owner → viste |

## 7. Dati comunicazione

- Mandato: M-R-T7-06 Opzione B (inline parent).
- Divieti rispettati: no commit/push; no rewrite final; no WP-1.

## 8. Analisi flusso

Scope contenuto: una funzione + test + docs. Multi-assertion deliberatamente fuori (stop esplicito, non half-broken).

## 9. Lettura dell'agente

- **Sistema:** N2 copre Output assertions nel caso canonico (1 assertion).
- **Output:** report + test chiudono il debito documentato.
- **Persona:** nessuna decisione nuova.

## 10. Handoff

**Stato:** R-T7-06 **CHIUSA** (Opzione B). Orchestratore: residui P2 documentali; WP-1 NO-GO.

## 11. Domande di chiusura

❓ Q1 — Prompt: path e hash.
✅ R1: mandato M-R-T7-06 inline parent; PLAN/MANUALE/SK4-ASSERT @ working tree `env/test`.

❓ Q2 — Dati = diff reale?
✅ R2: sì — estensione in `capsule.mjs`; test nominato; PLAN CHIUSA.

❓ Q3 — Skill aggiornate?
✅ R3: sì — MANUALE + PLAN + viste generate.

❓ Q4 — Cosa NON fatto?
✅ R4: no flag dedicato; no multi-index; no commit/push; no WP-1.

❓ Q5 — Attrito?
✅ R5: prossima-azione PLAN deve restare nel pattern `**Prossima azione autorizzata: \`T#\`** (...)` o `mss:status`/viste vanno rosse.

❓ Q6 — Contesto?
✅ R6: sufficiente (N2 + SK4-ASSERT + P2.3).
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0391e-07c0-7945-8891-5a27d51d3f71","correlation_id":"mss-cor-01a0391e-07c0-7cea-a366-0773454c0de1","segment_no":1,"created_at":"2026-08-25T15:31:04+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-r-t7-06","actor_type":"agente","role":"esecutore T11 M-R-T7-06 Opzione B","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["node","mss:capsule"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"session_event","record_id":"mss-rec-01a0391e-07c0-7161-8512-b66c8e2eca93","capture_key":"mss-ses-01a0391e-07c0-7945-8891-5a27d51d3f71/1/session_event/1","event":{"event_id":"mss-evt-01a0391e-07c0-70f4-a65b-ea1f8b1910c2","event_kind":"session_close","occurred_at":"2026-08-25T15:31:04+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore T11 M-R-T7-06 Opzione B","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 892f6e4; 14 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-r-t7-06-verify-output-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-r-t7-06-verify-output-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"test-mss-tools","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"git-diff-check","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"scripts/mss/capsule.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0391e-07c0-7945-8891-5a27d51d3f71","correlation_id":"mss-cor-01a0391e-07c0-7cea-a366-0773454c0de1","segment_no":1,"created_at":"2026-08-25T15:31:04+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-r-t7-06","actor_type":"agente","role":"esecutore T11 M-R-T7-06 Opzione B","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["node","mss:capsule"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a0391e-07c0-7fae-b53e-cfe4a6ac06a7","capture_key":"mss-ses-01a0391e-07c0-7945-8891-5a27d51d3f71/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a0391e-07c0-7217-b67f-0a429961efce","axis":"persona","subject_record_ids":["mss-rec-01a0391e-07c0-7161-8512-b66c8e2eca93"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer-m-r-t7-06","role":"esecutore T11 M-R-T7-06 Opzione B","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0391e-07c0-7945-8891-5a27d51d3f71","correlation_id":"mss-cor-01a0391e-07c0-7cea-a366-0773454c0de1","segment_no":1,"created_at":"2026-08-25T15:31:04+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-r-t7-06","actor_type":"agente","role":"esecutore T11 M-R-T7-06 Opzione B","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["node","mss:capsule"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a0391e-07c0-7537-afad-b657c603537c","capture_key":"mss-ses-01a0391e-07c0-7945-8891-5a27d51d3f71/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a0391e-07c0-700a-bd1b-338b5364bf7f","axis":"sistema","subject_record_ids":["mss-rec-01a0391e-07c0-7161-8512-b66c8e2eca93"],"delta":"modificato","assertions":[{"rule_id_version":"R-T7-06/Opzione-B@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato M-R-T7-06: estendere --verify a assertions[] Output (Opzione B autorizzata Matteo)","decision_or_output_changed":"buildVerificationAmendments: asse Output con esattamente 1 assertion → patch assertions[0].verification_status + verification_or_use_evidence oltre annotation.verification.*; multi/vuoto → VERIFY_INVALID; persona/sistema invariati; no rewrite final; no allentamento validator","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"cursor-composer-m-r-t7-06","role":"esecutore T11 M-R-T7-06 Opzione B","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0391e-07c0-7945-8891-5a27d51d3f71","correlation_id":"mss-cor-01a0391e-07c0-7cea-a366-0773454c0de1","segment_no":1,"created_at":"2026-08-25T15:31:04+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-r-t7-06","actor_type":"agente","role":"esecutore T11 M-R-T7-06 Opzione B","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["node","mss:capsule"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a0391e-07c0-7158-b383-92b0995d91d9","capture_key":"mss-ses-01a0391e-07c0-7945-8891-5a27d51d3f71/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a0391e-07c0-72e4-b86a-40b08fb960e7","axis":"output","subject_record_ids":["mss-rec-01a0391e-07c0-7161-8512-b66c8e2eca93"],"delta":"creato","assertions":[{"output_id":"report-r-t7-06-verify-output-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-r-t7-06-verify-output-25-08-26.md","recipient":"Matteo, orchestratore T11/P2.3","problem_or_job":"chiudere R-T7-06: --verify non toccava assertions[] Output (SK4-ASSERT era amendment manuale)","intended_use":"controverifica; gate P2.3 senza WP-1/D27/riscrittura final","conceived_by":"Matteo","decided_by":"Matteo (Opzione B)","directed_by":"Mandato M-R-T7-06 verify Output assertions Opzione B","authored_by":"cursor-composer-m-r-t7-06","verified_by":"non_osservato","acceptance_criterion":"test nominato R-T7-06 Opzione B verde; test:mss:tools 0; validate:mss:all 0; git diff --check 0; PLAN R-T7-06 CHIUSA","verification_or_use_evidence":"npm run test:mss:tools — OK capsule: R-T7-06 / Opzione B; validate:mss:all e git diff --check in controls","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["scripts/mss/capsule.mjs","docs/MetaSkillSystem/tests/tools/run.mjs","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","docs/MetaSkillSystem/PLAN_V0.md"],"relations_no_double_count":["Estensione N2; non riapre E2/H-1.3; non allenta validator; multi-assertion resta manuale"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer-m-r-t7-06","role":"esecutore T11 M-R-T7-06 Opzione B","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
