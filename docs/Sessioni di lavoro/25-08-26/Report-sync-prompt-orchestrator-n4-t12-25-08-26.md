# Report — sync PROMPT_ORCHESTRATOR post-T11 (M-SYNC-ORCH) — 25-08-2026

**Modalità:** deep · **Profilo:** Esecuzione Meta MSS · **Branch:** `env/test`
**HEAD:** `6f3edf5` · **NO commit/push**

## 1. Cappello

- **Cosa è cambiato:** i due prompt orchestratore non dicono più «prossima M-D» né `H-1.3` PASS_CON_RISERVE; puntano a `T12` e a `npm run mss:status`.
- **Cosa resta:** indice report (Q-A); commit T11+P2 solo con sì Matteo; denylist/multi-assertion non toccati (Q-B/Q-C No).
- **Serve una tua azione:** no per questo sync; sì se vuoi commit o proseguire indice under T12.

## 2. Cosa è stato fatto

Allineato il mandato orchestratore allo stato owner post-T11: N3/N4 e D14 ROADMAP/HANDOFF come PROVATI; M-D storico; gate vivo T12; STOP con H-1.3 PASS e WP-1 NO-GO; avvio corto aggiornato nella stessa famiglia.

## 3. File toccati e perché

| File | Perché |
|---|---|
| `docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md` | §2 R2 · §3 N4/V1/P-T · §4 mandati · §7 STOP · §8 prossima azione |
| `docs/MetaSkillSystem/PROMPT_AVVIO_ORCHESTRATORE_MSS.md` | Dove siamo · STOP · Prima azione |
| questo report + judgments | chiusura M-SYNC-ORCH |

## 4. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| `npm run mss:status` | T11 CHIUSO → T12; H-1.3 PASS; WP-1 NO-GO |
| `npm run validate:mss -- --mode file --file "…/Report-sync-prompt-orchestrator-n4-t12-25-08-26.md" --kind report --require-capsule` | **exit 0** |
| `npm run validate:mss:all` | **exit 0** (test:mss · test:mss:tools · views · docs) |
| Grep stale sui due prompt | nessuna riga STOP con `PASS_CON_RISERVE`; nessuna «prossima M-D» come azione viva |

## 5. File di skill aggiornati

| file | modifica | perché |
|---|---|---|
| `PROMPT_ORCHESTRATOR_MSS_24-08-26.md` | allineo post-T11 | mandato vivo |
| `PROMPT_AVVIO_ORCHESTRATORE_MSS.md` | Dove siamo / STOP / Prima azione | famiglia avvio |
| nessuno skill prodotto app | — | perimetro solo Meta docs |

## 6. Dati comunicazione

- Mandato parent M-SYNC-ORCH: Q-A vista · Q-B No · Q-C No; non toccare denylist né multi-assertion.
- Decisione annotata: `Decisioni-T12-QABC-25-08-26.md`.
- Formato utile: citare comandi (`mss:status`), non percentuali R*.

## 7. Analisi flusso prompt

1 prompt sostanziale (mandato M-SYNC-ORCH). Nessuna correzione dopo 1ª risposta. Modalità deep confermata. Prompt chiaro: stale list + deliverable + STOP fuori.

## 8. Lettura della sessione

Sync documentale stretto: fonti obbligatorie + `mss:status` bastano. Il rischio era lasciare residui «M-D prossimo» / PASS_CON_RISERVE; greppati. Suggerimento: i prompt datati invecchiano — l’avvio senza data + status riducono il debito.

## 9. Derivazione errori

nessuna difficoltà — vincolo strutturale rispettato (no src/, no capsule.mjs).

## 10. Cosa resta

- Indice report (T12 / Q-A genera vista) — fuori da questo mandato sync.
- Commit/push solo con sì Matteo.
- Debito denylist / multi-assertion: handoff, non eseguito (Q-B/Q-C No).

## 10-bis. Handoff

**Vero adesso:** `PROMPT_ORCHESTRATOR` + `PROMPT_AVVIO` allineati a `mss:status` (T11 chiuso, T12 prossimo, H-1.3 PASS, WP-1 NO-GO).

| Debito | Stato |
|---|---|
| Indice report | ancora manuale → prossimo pezzo T12 (Q-A) |
| Estensione denylist N4 | No (Q-B) |
| Multi-assertion verify | No (Q-C) |
| WP-1 / D27 | NO-GO / chiusa |
| Commit | no senza sì |

Owner stato: `PLAN_V0.md`. Mandato vivo: `PROMPT_ORCHESTRATOR_MSS_24-08-26.md`.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: path e revisione/hash.
✅ R1: mandato M-SYNC-ORCH inline parent @ HEAD `6f3edf5`; letture: `MANUALE_OPERATIVO_MSS_V0.md` (N4/R-T7-06), `PLAN_V0.md` §15 T11/T12, `Report-orchestratore-t11-p2-25-08-26.md`, `PROMPT_ORCHESTRATOR_MSS_24-08-26.md` (intero, aggiornato), `PROMPT_AVVIO_ORCHESTRATORE_MSS.md`, `Decisioni-T12-QABC-25-08-26.md`.

❓ Q2 — Dati = diff reale?
✅ R2: sì — diff solo sui due prompt + report/judgments/capsula; `mss:status` T11→T12 / H-1.3 PASS / WP-1 NO-GO; nessun tocco denylist o multi-assertion.

❓ Q3 — File skill §5 completi?
✅ R3: sì — due prompt Meta + questo report; nessuna skill area prodotto.

❓ Q4 — Cosa NON hai fatto?
✅ R4: no commit/push; no indice report; no denylist; no multi-assertion verify; no src/ WP-1 D27 capsule.mjs views.mjs.

❓ Q5 — Attrito + miglioria?
✅ R5: §2 aveva percentuali R* stale e tabella P/T contraddiceva status — allineate per non mentire. Miglioria: dopo ogni mark PLAN, un mandato sync prompt obbligatorio (come questo) prima di affidare orchestrazione.

❓ Q6 — Contesto & hook?
✅ R6: contesto Meta MSS giusto; hook commit non esercitato (no commit).

## 12. Self-review

Triade MSS post-capsula; §5 completa; §11 piena; handoff ricostruibile; greppabile no «prossima M-D» viva / no PASS_CON_RISERVE in STOP.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03956-8a1b-7118-840a-9b77f01e6cb7","correlation_id":"mss-cor-01a03956-8a1b-7da5-a98a-3b55331c609c","segment_no":1,"created_at":"2026-08-25T16:32:47+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-sync-orch","actor_type":"agente","role":"esecutore Meta MSS M-SYNC-ORCH","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a03956-8a1b-716a-8eaf-c072a5061824","capture_key":"mss-ses-01a03956-8a1b-7118-840a-9b77f01e6cb7/1/session_event/1","event":{"event_id":"mss-evt-01a03956-8a1b-70ee-8dfd-8701a54086ab","event_kind":"session_close","occurred_at":"2026-08-25T16:32:47+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore Meta MSS M-SYNC-ORCH","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 6f3edf5; 5 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-sync-prompt-orchestrator-n4-t12-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-sync-prompt-orchestrator-n4-t12-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"test-mss-tools","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"git-diff-check","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PROMPT_AVVIO_ORCHESTRATORE_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6f3edf5","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03956-8a1b-7118-840a-9b77f01e6cb7","correlation_id":"mss-cor-01a03956-8a1b-7da5-a98a-3b55331c609c","segment_no":1,"created_at":"2026-08-25T16:32:47+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-sync-orch","actor_type":"agente","role":"esecutore Meta MSS M-SYNC-ORCH","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03956-8a1b-7d45-b88a-3de87e1287db","capture_key":"mss-ses-01a03956-8a1b-7118-840a-9b77f01e6cb7/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a03956-8a1b-7fdf-824e-955d8b5b2286","axis":"persona","subject_record_ids":["mss-rec-01a03956-8a1b-716a-8eaf-c072a5061824"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer-m-sync-orch","role":"esecutore Meta MSS M-SYNC-ORCH","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03956-8a1b-7118-840a-9b77f01e6cb7","correlation_id":"mss-cor-01a03956-8a1b-7da5-a98a-3b55331c609c","segment_no":1,"created_at":"2026-08-25T16:32:47+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-sync-orch","actor_type":"agente","role":"esecutore Meta MSS M-SYNC-ORCH","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03956-8a1b-7eca-9c71-dfc68e2e8379","capture_key":"mss-ses-01a03956-8a1b-7118-840a-9b77f01e6cb7/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a03956-8a1b-7f35-aa04-0be857725581","axis":"sistema","subject_record_ids":["mss-rec-01a03956-8a1b-716a-8eaf-c072a5061824"],"delta":"modificato","assertions":[{"rule_id_version":"M-SYNC-ORCH@mss-v0.1-wp0.1-freeze-2","trigger_event":"Allineo PROMPT_ORCHESTRATOR + PROMPT_AVVIO allo stato owner post-T11","decision_or_output_changed":"N3/N4 e D14 ROADMAP/HANDOFF citati PROVATI; M-D storico; gate vivo T12; H-1.3 PASS in STOP; WP-1 NO-GO; niente percentuali R* inventate; Q-B/Q-C No rispettati","G":2,"O":1,"E":2}],"asserted_by":{"actor_id":"cursor-composer-m-sync-orch","role":"esecutore Meta MSS M-SYNC-ORCH","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03956-8a1b-7118-840a-9b77f01e6cb7","correlation_id":"mss-cor-01a03956-8a1b-7da5-a98a-3b55331c609c","segment_no":1,"created_at":"2026-08-25T16:32:47+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-sync-orch","actor_type":"agente","role":"esecutore Meta MSS M-SYNC-ORCH","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03956-8a1b-7966-a16f-b89acb39a302","capture_key":"mss-ses-01a03956-8a1b-7118-840a-9b77f01e6cb7/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a03956-8a1b-7c80-bc1e-c67f9d981928","axis":"output","subject_record_ids":["mss-rec-01a03956-8a1b-716a-8eaf-c072a5061824"],"delta":"creato","assertions":[{"output_id":"report-sync-prompt-orchestrator-n4-t12-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-sync-prompt-orchestrator-n4-t12-25-08-26.md","recipient":"Matteo","problem_or_job":"togliere stale N4/R2/STOP H-1.3/prossima M-D dal mandato orchestratore post-T11","intended_use":"mandato orchestratore coerente con mss:status per T12 residui documentali","conceived_by":"Matteo","decided_by":"Matteo (Q-A vista; Q-B No; Q-C No)","directed_by":"Mandato M-SYNC-ORCH inline parent","authored_by":"cursor-composer-m-sync-orch","verified_by":"non_osservato","acceptance_criterion":"due prompt aggiornati; no prossima M-D viva; no H-1.3 PASS_CON_RISERVE in STOP; validate report+capsula 0; validate:mss:all verde; no commit","verification_or_use_evidence":"npm run mss:status; validate:mss --require-capsule; validate:mss:all; grep STOP/prossima","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md","docs/MetaSkillSystem/PROMPT_AVVIO_ORCHESTRATORE_MSS.md","docs/Sessioni di lavoro/25-08-26/Decisioni-T12-QABC-25-08-26.md"],"relations_no_double_count":["Solo sync docs prompt; non apre indice/D27/WP-1; non tocca denylist"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer-m-sync-orch","role":"esecutore Meta MSS M-SYNC-ORCH","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
