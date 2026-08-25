# SK4-ASSERT T7 — rettifica Output controverifica SK-4 T6

**Modalità:** deep · **Ruolo:** esecutore T7 Famiglia 4 · **Branch:** `env/test` · **HEAD:** `fafe81f`
**Esito:** **PASS** — amendment append-only emesso; capsula Output allineata a narrativa §7.

## 1. Cappello

- **Cosa è cambiato:** l'asserzione Output della capsula controverifica SK-4 T6 non dice più `independently_verified` con evidenza fittizia; un amendment append-only rettifica `verification_status` e `verification_or_use_evidence` sul record `mss-rec-01a03596-e401-706e-bdee-f45d90ccf380`.
- **Cosa resta:** `--verify` (N2) continua a non coprire `annotation.assertions[]` Output — limite strutturale documentato, non un bug da allentare.
- **Serve una tua azione:** no per questo mandato.

## 2. Problema e perimetro

| Elemento | Valore |
|---|---|
| Report sorgente | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-sk4-t6-24-08-26.md` |
| Record Output bersaglio | `mss-rec-01a03596-e401-706e-bdee-f45d90ccf380` |
| Disallineamento | `assertions[0].verification_status: independently_verified` + evidenza che citava amendment non emesso al momento della seduta |
| Narrativa autoritativa | §7 del report controverifica (tentativo `--verify` rifiutato ORPHAN pre-commit; batch post-commit ha verificato solo asse **Sistema** esecutore) |
| Fonte batch | `docs/Sessioni di lavoro/24-08-26/Report-batch-verify-t6-post-commit-25-08-26.md` §3 |

## 3. Rettifica eseguita

**Metodo:** amendment append-only (contratto §6) emesso nella capsula di **questo** report — non riscrittura del record `final` nella capsula controverifica.

| Campo | Valore precedente | Valore rettificato |
|---|---|---|
| `annotation.assertions[0].verification_status` | `independently_verified` | `self_report` |
| `annotation.assertions[0].verification_or_use_evidence` | `report di controverifica e amendment --verify al record sistema dell'esecutore` | `report di controverifica; record Sistema esecutore verificato post-commit (Report-batch-verify-t6-post-commit-25-08-26.md); asserzione Output non coperta da --verify N2` |

**Perché non `--verify`:** `buildVerificationAmendments` in `scripts/mss/capsule.mjs` rettifica solo `annotation.verification.*` sull'annotazione bersaglio, non i campi dentro `assertions[]` Output (limite attrezzo N2, coerente con §3 batch verify).

**Owner:** `PLAN_V0.md` — riga riserva SK4-ASSERT aggiornata a **CHIUSO T7**.

## 4. File toccati

| File | Perché |
|---|---|
| `docs/Sessioni di lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md` | deliverable + capsula con amendment |
| `docs/Sessioni di lavoro/25-08-26/judgments-sk4-assert-t7-25-08-26.json` | giudizi per `mss:capsule` |
| `docs/MetaSkillSystem/PLAN_V0.md` | owner: riserva SK4-ASSERT → chiusa |

## 5. Test eseguiti

| Comando | Esito |
|---|---|
| `npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md" --kind report --require-capsule` | **exit 0** |
| `npm run validate:mss:all` | **exit 0** |

## 6. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `PLAN_V0.md` | riserva SK4-ASSERT + riga SK-4 backlog | owner autorevole stato rettifica |
| nessun altro | — | nessuna skill area app |

## 7. Dati comunicazione

- Mandato: prompt orchestratore T7 § Famiglia 4 (inline parent + file prompt).
- Divieti rispettati: no riscrittura record final, no allentamento validator, no commit/push.

## 8. Analisi flusso

Il disallineamento nasce da un giudizio Output ottimistico al momento della controverifica (amendment prospettico mai validato). Il batch post-commit ha chiuso l'asse Sistema ma ha esplicitamente lasciato SK4-ASSERT in backlog perché `--verify` non raggiunge `assertions[]`. L'amendment manuale su `field_path` annidato è già supportato dal validator (cfr. test H13 su `annotation.assertions[0].owner_ref`).

## 9. Lettura dell'agente

- **Sistema:** narrativa §7 e capsula macchina ora concordi; limite N2 resta dichiarato.
- **Output:** questo report + amendment registrano la chiusura SK4-ASSERT.
- **Persona:** nessuna decisione nuova richiesta a Matteo.

## 10. Handoff

**Stato:** Famiglia 4 **PASS** — backlog SK4-ASSERT chiuso.

**Non riaprire:** SK-4 sostanziale (già CHIUSO con firma Matteo).

## 11. Domande di chiusura

❓ Q1 — Prompt: path e hash.
✅ R1: mandato inline parent T7 Famiglia 4; `docs/Sessioni di lavoro/25-08-26/Prompt-orchestratore-cursor-t7-backlog-pilota-25-08-26.md` @ `fafe81f`; report controverifica @ HEAD.

❓ Q2 — Dati = diff reale?
✅ R2: sì — amendment in capsula §6-bis; owner PLAN; validate:mss post-run.

❓ Q3 — Skill aggiornate?
✅ R3: sì — solo `PLAN_V0.md` § riserva SK4-ASSERT e riga SK-4.

❓ Q4 — Cosa NON fatto?
✅ R4: non esteso `--verify` a assertions[]; non modificato report controverifica inline; non commit/push.

❓ Q5 — Attrito?
✅ R5: `--verify` non copre Output assertions — risolto con amendment manuale validato, non hack validator.

❓ Q6 — Contesto?
✅ R6: giusto — record ID, batch §3 e contratto §6 sufficienti.

## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f4-8d8f-74ce-a113-f52cf2b005f2","correlation_id":"mss-cor-01a035f4-8d8f-7801-a1c4-2d3a2120f818","segment_no":1,"created_at":"2026-08-25T00:46:54+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t7-sk4-assert","actor_type":"agente","role":"esecutore T7 Famiglia 4 SK4-ASSERT","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a035f4-8d8f-7c81-8011-a22419faeba1","capture_key":"mss-ses-01a035f4-8d8f-74ce-a113-f52cf2b005f2/1/session_event/1","event":{"event_id":"mss-evt-01a035f4-8d8f-7c1f-b016-42345f4be47d","event_kind":"session_close","occurred_at":"2026-08-25T00:46:54+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore T7 Famiglia 4 SK4-ASSERT","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD fafe81f; 19 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"validate-report","criterio":"npm run validate:mss -- --mode file --file docs/Sessioni di lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md --kind report --require-capsule (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss -- --mode file --file \"docs/Sessioni di lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md\" --kind report --require-capsule (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"_skill-system-v0/hooks/fine-sessione-nudge.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"scripts/mss/status.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f4-8d8f-74ce-a113-f52cf2b005f2","correlation_id":"mss-cor-01a035f4-8d8f-7801-a1c4-2d3a2120f818","segment_no":1,"created_at":"2026-08-25T00:46:54+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t7-sk4-assert","actor_type":"agente","role":"esecutore T7 Famiglia 4 SK4-ASSERT","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a035f4-8d8f-703a-b569-2a93acccf525","capture_key":"mss-ses-01a035f4-8d8f-74ce-a113-f52cf2b005f2/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a035f4-8d8f-714f-a2ad-9342582fa173","axis":"persona","subject_record_ids":["mss-rec-01a035f4-8d8f-7c81-8011-a22419faeba1"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer-t7-sk4-assert","role":"esecutore T7 Famiglia 4 SK4-ASSERT","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f4-8d8f-74ce-a113-f52cf2b005f2","correlation_id":"mss-cor-01a035f4-8d8f-7801-a1c4-2d3a2120f818","segment_no":1,"created_at":"2026-08-25T00:46:54+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t7-sk4-assert","actor_type":"agente","role":"esecutore T7 Famiglia 4 SK4-ASSERT","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a035f4-8d8f-7dce-a54a-8ce2b2e192dd","capture_key":"mss-ses-01a035f4-8d8f-74ce-a113-f52cf2b005f2/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a035f4-8d8f-7682-8952-0ca92b85f856","axis":"sistema","subject_record_ids":["mss-rec-01a035f4-8d8f-7c81-8011-a22419faeba1"],"delta":"modificato","assertions":[{"rule_id_version":"SK4-ASSERT/T7@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato T7 Famiglia 4: disallineamento Output controverifica SK-4 T6","decision_or_output_changed":"Emesso amendment append-only su annotation.assertions[0] del record Output controverifica: verification_status self_report e evidenza allineata a §7; --verify (N2) non copre assertions[] Output","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"cursor-composer-t7-sk4-assert","role":"esecutore T7 Famiglia 4 SK4-ASSERT","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f4-8d8f-74ce-a113-f52cf2b005f2","correlation_id":"mss-cor-01a035f4-8d8f-7801-a1c4-2d3a2120f818","segment_no":1,"created_at":"2026-08-25T00:46:54+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t7-sk4-assert","actor_type":"agente","role":"esecutore T7 Famiglia 4 SK4-ASSERT","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a035f4-8d8f-7341-834a-9257d6096989","capture_key":"mss-ses-01a035f4-8d8f-74ce-a113-f52cf2b005f2/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a035f4-8d8f-7ea6-9960-a94e14d416c7","axis":"output","subject_record_ids":["mss-rec-01a035f4-8d8f-7c81-8011-a22419faeba1"],"delta":"creato","assertions":[{"output_id":"report-sk4-assert-t7-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md","recipient":"Matteo, orchestratore T7 e revisore Codex","problem_or_job":"allineare capsula Output controverifica SK-4 T6 con narrativa §7 senza riscrivere record final","intended_use":"chiudere backlog SK4-ASSERT opzionale; registrare amendment su assertions[] Output","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"docs/Sessioni di lavoro/25-08-26/Prompt-orchestratore-cursor-t7-backlog-pilota-25-08-26.md § Famiglia 4","authored_by":"cursor-composer-t7-sk4-assert","verified_by":"non_osservato","acceptance_criterion":"amendment append-only validato su target in HEAD; owner PLAN aggiornato; validate:mss sul report verde","verification_or_use_evidence":"validate:mss sul report; amendment record in capsula; target mss-rec-01a03596-e401-706e-bdee-f45d90ccf380 risolto da HEAD","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/Sessioni di lavoro/24-08-26/Report-controverifica-sk4-t6-24-08-26.md","docs/Sessioni di lavoro/24-08-26/Report-batch-verify-t6-post-commit-25-08-26.md","scripts/mss/capsule.mjs"],"relations_no_double_count":["rettifica semantica SK4-ASSERT; non riapre SK-4 né modifica validator N2"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer-t7-sk4-assert","role":"esecutore T7 Famiglia 4 SK4-ASSERT","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f4-8d8f-74ce-a113-f52cf2b005f2","correlation_id":"mss-cor-01a035f4-8d8f-7801-a1c4-2d3a2120f818","segment_no":1,"created_at":"2026-08-25T00:46:54+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t7-sk4-assert","actor_type":"agente","role":"esecutore T7 Famiglia 4 SK4-ASSERT","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["node","mss:capsule"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"amendment","record_id":"mss-rec-01a035f4-8b30-7408-8475-a3f8df7383a3","capture_key":"mss-ses-01a035f4-8d8f-74ce-a113-f52cf2b005f2/1/amendment/1","amendment":{"amendment_id":"mss-amd-01a035f4-8b30-71f5-b110-3c071b84003c","target_record_id":"mss-rec-01a03596-e401-706e-bdee-f45d90ccf380","relation":"amends","reason":"SK4-ASSERT T7: allinea assertions[0] Output controverifica SK-4 T6 con narrativa section 7","changes":[{"field_path":"annotation.assertions[0].verification_status","previous_value_or_hash":"independently_verified","corrected_value":"self_report"},{"field_path":"annotation.assertions[0].verification_or_use_evidence","previous_value_or_hash":"report di controverifica e amendment --verify al record sistema dell'esecutore","corrected_value":"report di controverifica; record Sistema esecutore verificato post-commit (Report-batch-verify-t6-post-commit-25-08-26.md); asserzione Output non coperta da --verify N2"}],"evidence_refs":["docs/Sessioni di lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md"],"effective_at":"2026-08-25T00:46:54+02:00"}}
```
