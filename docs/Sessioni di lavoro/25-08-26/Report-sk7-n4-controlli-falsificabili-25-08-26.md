# M-SK7-N4 — controlli capsula falsificabili (residuo N4)

**Modalità:** deep · **Ruolo:** esecutore M-SK7-N4 · **Branch:** `env/test` · **HEAD:** `892f6e4`
**Esito in una riga:** **deny** (exit 2) su denylist chiusa di `--check` non falsificabili; `--check-expect` M-G invariato.

## 1. Cappello

- **Cosa è cambiato:** un `--check` tipo `git status --short` / `true` / `echo` / `mss:query -- --verifica` con exit atteso `0` non può più finire in capsula come `pass` vacuo — l'attrezzo rifiuta (exit 2, nessuna scrittura).
- **Cosa resta:** la denylist non è un oracolo (comandi «sempre verdi» fuori lista non sono intercettati); V1/D14 in parallelo lascia `test:mss:tools` rosso sul pezzo viste.
- **Serve una tua azione:** controverifica; commit solo dopo orchestratore. Non riaprire WP-1.

## 2. Cosa è stato fatto

1. **`nonFalsifiableCheckReason` + `NonFalsifiableCheckError`** in `capsule.mjs`: lista chiusa; se `expectedExit === 0` e match → throw.
2. **`runChecks` / `runCapsule`:** deny prima di spawn/scrittura; con `--check-expect` ≠ 0 lo stesso comando resta eseguibile (prova invertita).
3. **Test nominato:** `capsule: N4 / SK-7 — controllo infallibile deny (git status --short non è prova)`.
4. **MANUALE §2.4:** chiuso il «limite aperto M-C»; documentato deny + test.
5. **PLAN_V0:** *non* marcato (avrebbe stale-izzato il cruscotto sotto M-D14 parallelo) — mark lasciato a orchestratore.

## 3. File toccati

| File | Perché |
|---|---|
| `scripts/mss/capsule.mjs` | denylist + deny CLI |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | test N4/SK-7 (**file condiviso** con M-D14: additivo) |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | residuo N4 → PROVATO |
| judgments + questo report | deliverable |

**Non toccati (fuori / parallelo):** `views.mjs`, ROADMAP, HANDOFF, cruscotto, `src/`, validator core.

## 4. Scelta deny vs warn

| Opzione | Perché scartata / scelta |
|---|---|
| **warn** | lascerebbe il `pass` vacuo nel JSONL — stesso falso verde di R2/corpus vuoto |
| **deny** | scelta Opzione B: rifiuta, exit 2, zero scrittura |

## 5. Gate

| Comando | Esito |
|---|---|
| Test `capsule: N4 / SK-7 — …` | **OK** |
| Test `capsule: N4 — check-expect…` (M-G) | **OK** (non regresso) |
| `npm run test:mss:tools` | **rosso 2/68** — FAIL `V1` + `D14/V1` (viste Senior non allineate: lavoro **M-D14 parallelo**, non questo mandato) |
| `npm run validate:mss:all` | **rosso** per la stessa causa V1/D14 |
| `git diff --check` (perimetro N4) | **exit 0** |

## 6. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `MANUALE_OPERATIVO_MSS_V0.md` §2.4 | N4 residuo deny | istruzione agente freddo |
| skill prodotto | nessuno | fuori area |

## 7. Dati comunicazione

- Mandato: M-SK7-N4 inline (rilancio post rate-limit Opus).
- Parallelismo: altro agente su `views.mjs` / ROADMAP / HANDOFF; `tests/tools/run.mjs` toccato da entrambi in additivo.

## 8. Lettura

- **Sistema:** residuo N4 chiuso per i casi documentati (M-C / P2.2); non allenta il validator.
- **Output:** prova eseguibile + manuale allineato.
- **Persona:** nessuna.

## 9. Handoff

**Vero adesso:** deny N4 in `capsule.mjs`; test nominato verde; suite tools rossa solo per V1/D14 parallelo.

**Prossimo:** orchestratore marca N4 in PLAN dopo M-D14 verde; controverifica; commit.

**Non riaprire:** N1/N2, WP-1/D27, rewrite `--check-expect`.

## 10. Domande di chiusura

❓ Q1 — Prompt ricevuti: path e revisione/hash.
✅ R1: mandato M-SK7-N4 inline parent; `MANUALE_OPERATIVO_MSS_V0.md` @ HEAD `892f6e4`; `PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md` §P2.2 @ working tree; `capsule.mjs` letto intero pre-edit.

❓ Q2 — Dati = diff reale?
✅ R2: sì — N4 test OK in `test:mss:tools`; FAIL solo V1/D14; diff N4 = capsule + test + MANUALE + report/judgments; PLAN non modificato.

❓ Q3 — File skill §6 completi?
✅ R3: sì — solo MANUALE nel perimetro skill.

❓ Q4 — Cosa NON hai fatto?
✅ R4: no commit/push; no views/ROADMAP/HANDOFF; no PLAN mark; no allentamento validator; no rifacimento `--check-expect`.

❓ Q5 — Attrito + miglioria?
✅ R5: file condiviso `tests/tools/run.mjs` con M-D14 — additivo ok; gate `validate:mss:all` non chiudibile finché D14 non allinea le viste. Miglioria: orchestratore sequenzia mark PLAN dopo regen viste.

❓ Q6 — Contesto & hook?
✅ R6: contesto Meta MSS / P2.2 corretto; hook non esercitato (no commit).
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03904-b986-7b9e-bd09-b20e7b8b326b","correlation_id":"mss-cor-01a03904-b986-7826-bcb4-5806f09feab2","segment_no":1,"created_at":"2026-08-25T15:03:26+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-sk7-n4","actor_type":"agente","role":"esecutore M-SK7-N4","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["mss:capsule"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a03904-b986-7968-b212-167e67930e18","capture_key":"mss-ses-01a03904-b986-7b9e-bd09-b20e7b8b326b/1/session_event/1","event":{"event_id":"mss-evt-01a03904-b986-719f-a1ec-f7e1df06a498","event_kind":"session_close","occurred_at":"2026-08-25T15:03:26+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore M-SK7-N4","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 892f6e4; 9 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-sk7-n4-controlli-falsificabili-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-sk7-n4-controlli-falsificabili-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"N4-TEST","criterio":"node docs/MetaSkillSystem/tests/tools/run.mjs (atteso exit 0)","esito":"fail","numeratore":0,"denominatore":1,"esecutore":"mss:capsule: node docs/MetaSkillSystem/tests/tools/run.mjs (exit 1; atteso 0)","evidence_refs":[]},{"control_id":"DIFF-CHECK","criterio":"git diff --check -- scripts/mss/capsule.mjs docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check -- scripts/mss/capsule.mjs docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"scripts/mss/capsule.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03904-b986-7b9e-bd09-b20e7b8b326b","correlation_id":"mss-cor-01a03904-b986-7826-bcb4-5806f09feab2","segment_no":1,"created_at":"2026-08-25T15:03:26+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-sk7-n4","actor_type":"agente","role":"esecutore M-SK7-N4","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["mss:capsule"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03904-b986-7c78-8b7e-a85b1be4204d","capture_key":"mss-ses-01a03904-b986-7b9e-bd09-b20e7b8b326b/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a03904-b986-7020-a621-75693dee7aa4","axis":"persona","subject_record_ids":["mss-rec-01a03904-b986-7968-b212-167e67930e18"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer-m-sk7-n4","role":"esecutore M-SK7-N4","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03904-b986-7b9e-bd09-b20e7b8b326b","correlation_id":"mss-cor-01a03904-b986-7826-bcb4-5806f09feab2","segment_no":1,"created_at":"2026-08-25T15:03:26+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-sk7-n4","actor_type":"agente","role":"esecutore M-SK7-N4","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["mss:capsule"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03904-b986-78c3-b195-b4e73ac5e2a3","capture_key":"mss-ses-01a03904-b986-7b9e-bd09-b20e7b8b326b/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a03904-b986-7daa-9c1a-d1016b45ec73","axis":"sistema","subject_record_ids":["mss-rec-01a03904-b986-7968-b212-167e67930e18"],"delta":"modificato","assertions":[{"rule_id_version":"N4/SK-7@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato M-SK7-N4: deny controlli --check non falsificabili (residuo post M-G check-expect)","decision_or_output_changed":"Denylist chiusa in capsule.mjs: git status / true / : / echo / mss:query --verifica con expectedExit 0 → exit 2 nessuna scrittura; check-expect ≠ 0 resta ammissibile; test nominato N4/SK-7; limite aperto rimosso dal MANUALE","G":2,"O":1,"E":2}],"asserted_by":{"actor_id":"cursor-composer-m-sk7-n4","role":"esecutore M-SK7-N4","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03904-b986-7b9e-bd09-b20e7b8b326b","correlation_id":"mss-cor-01a03904-b986-7826-bcb4-5806f09feab2","segment_no":1,"created_at":"2026-08-25T15:03:26+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-sk7-n4","actor_type":"agente","role":"esecutore M-SK7-N4","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["mss:capsule"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03904-b986-71b4-bbc6-f1e07ca194af","capture_key":"mss-ses-01a03904-b986-7b9e-bd09-b20e7b8b326b/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a03904-b986-7eed-810a-a6d924150f93","axis":"output","subject_record_ids":["mss-rec-01a03904-b986-7968-b212-167e67930e18"],"delta":"creato","assertions":[{"output_id":"report-sk7-n4-controlli-falsificabili-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-sk7-n4-controlli-falsificabili-25-08-26.md","recipient":"Matteo, orchestratore T11/P2.2","problem_or_job":"chiudere residuo N4: pass vacuo da comando infallibile","intended_use":"controverifica; gate P2.2 senza riaprire N1/N2 né WP-1","conceived_by":"Matteo","decided_by":"Matteo (Opzione B deny)","directed_by":"PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md §P2.2 M-SK7-N4","authored_by":"cursor-composer-m-sk7-n4","verified_by":"non_osservato","acceptance_criterion":"test N4/SK-7 deny verde; check-expect M-G invariato; validate:mss sul report; no views/ROADMAP","verification_or_use_evidence":"npm run test:mss:tools — OK capsule: N4 / SK-7; FAIL V1/D14 parallelo fuori perimetro","verification_status":"self_report","owner_ref":"scripts/mss/capsule.mjs","privacy_release":"internal","support_files":["scripts/mss/capsule.mjs","docs/MetaSkillSystem/tests/tools/run.mjs","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md"],"relations_no_double_count":["Residuo N4 dopo M-G --check-expect; non tocca validator core; non WP-1"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer-m-sk7-n4","role":"esecutore M-SK7-N4","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
