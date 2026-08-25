# T9 Famiglia 4 — R8 portabilità + D14 viste

**Modalità:** deep · **Ruolo:** esecutore T9 Famiglia 4 · **Branch:** `env/test` · **HEAD:** `fafe81f`
**Esito:** **PASS** — R8 riconfermato **PROVATO** (non CHIUSO); D14 = **BACKLOG deliberato** con path.

## 1. Cappello

- **Cosa è cambiato:** misurazione fresca di doctor/views/export-help; classificazione R8 e D14 registrata in questa capsula.
- **Cosa resta:** chiusura formale R8/SK-10 solo di Matteo; generatore ROADMAP/HANDOFF (D14) non implementato.
- **Serve una tua azione:** no per questo mandato; sì solo se vuoi firmare `CHIUSO` su R8 o autorizzare un mandato D14 dedicato.

## 2. Cosa è stato fatto

1. Rieseguiti i cancelli locali senza scrivere kit fuori repo.
2. Verificato che il generatore viste copre **solo** il cruscotto Matteo.
3. Classificato D14 come backlog deliberato (nessun fix ≤1 file chiarissimo).
4. Scritti report + judgments + capsula; zero tocchi a PLAN/src/generatore.

## 3. Classificazione

| ID | Stato | Motivo misurato ora |
|---|---|---|
| **R8** (SK-10 / P2B) | **PROVATO** — non CHIUSO | `mss:doctor` 10/10 ok; `mss:export -- --help` ok; prova storica M-D resta; chiusura formale = Matteo |
| **D14** / R-T7-04 | **BACKLOG deliberato** | `VIEWS` in `scripts/mss/views.mjs` = solo `cruscotto-matteo`; ROADMAP/HANDOFF restano manuali |

### Path backlog D14 (non generati)

| Path | Ruolo oggi |
|---|---|
| `docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md` | vista manuale |
| `docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md` | vista manuale |
| `scripts/mss/views.mjs` (`VIEWS`) | generatore = solo cruscotto |
| `docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md` | unica vista anti-stale (OK) |
| Owner debito | `PLAN_V0.md` § D14 · § R-T7-04 |

**Perché non estendere il generatore:** aggiungere ROADMAP+HANDOFF richiede marker, derive multipli e test — oltre il tetto «fix ≤1 file chiarissimo» del mandato. Preferenza zero codice rispettata.

## 4. File toccati

| File | Perché |
|---|---|
| `docs/Sessioni di lavoro/25-08-26/Report-t9-f4-r8-d14-portabilita-25-08-26.md` | deliverable |
| `docs/Sessioni di lavoro/25-08-26/judgments-t9-f4-25-08-26.json` | giudizi R1 |

**Non toccati:** PLAN, src, views.mjs, kit export ospite, report T7.

## 5. Test eseguiti

| Comando | Esito |
|---|---|
| `npm run mss:doctor` | **exit 0** — 10/10 ok (rieseguito dopo un falso fail via spawn di `mss:capsule`; conferma diretta verde) |
| `npm run validate:mss:views` | **exit 0** — `MSS views check OK: cruscotto-matteo` |
| `npm run mss:export -- --help` | **exit 0** — usage; nessun `--to` (no kit fuori repo) |
| `npm run validate:mss -- --mode file --file "…/Report-t9-f4-r8-d14-portabilita-25-08-26.md" --kind report --require-capsule` | **exit 0** (post-capsula) |

## 6. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| nessuno | — | nessuna mutazione di comportamento/layout skill; stato owner già dice R8 PROVATO e D14 aperto |

## 7. Dati comunicazione

- Mandato: T9 Famiglia 4 inline (R8 + D14 portabilità).
- Divieti rispettati: no generatore «per completezza», no PLAN, no src, no commit, no kit ospite, no report T7.

## 8. Analisi flusso

Una seduta di sola misura + classificazione. Doctor + views + help bastano a riconfermare R8 e a documentare D14 senza aprire codice.

## 9. Lettura dell'agente

- **Sistema:** portabilità operativa ancora verde in questa repo; viste generate incomplete by design (solo cruscotto).
- **Output:** questa capsula fissa R8=PROVATO e D14=BACKLOG con path.
- **Persona:** nessuna decisione nuova richiesta qui.

## 10. Handoff

**PASS.** Prossimo lavoro D14 solo con mandato dedicato (estensione generatore o accettazione permanente delle viste manuali). Non promuovere R8 a CHIUSO senza firma Matteo.

## 11. Domande di chiusura

❓ Q1 — Prompt: path e hash.
✅ R1: mandato T9 Famiglia 4 inline parent; HEAD `fafe81f` su `env/test`.

❓ Q2 — Dati = misura reale?
✅ R2: sì — doctor/views/export-help rieseguiti in seduta; nessun kit scritto fuori repo.

❓ Q3 — Skill aggiornate?
✅ R3: nessuno — owner già allineato; vietato toccare PLAN in questo mandato.

❓ Q4 — Cosa NON fatto?
✅ R4: non esteso `views.mjs`; non CHIUSO su R8; non commit/push; non export kit.

❓ Q5 — Attrito?
✅ R5: nessuno operativo; D14 resta debito consapevole (R-T7-04).

❓ Q6 — Contesto?
✅ R6: sufficiente — MANUALE §7, `VIEWS` in views.mjs, PLAN D14/R-T7-04.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0360b-dcf1-70c3-bd3b-35ee5462ab25","correlation_id":"mss-cor-01a0360b-dcf1-7a9d-b1f3-10c04ad40fe6","segment_no":1,"created_at":"2026-08-25T01:12:22+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t9-f4","actor_type":"agente","role":"esecutore T9 Famiglia 4 R8+D14","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["node","mss:doctor","validate:mss:views"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"session_event","record_id":"mss-rec-01a0360b-dcf1-7a70-b577-22fd0cd78182","capture_key":"mss-ses-01a0360b-dcf1-70c3-bd3b-35ee5462ab25/1/session_event/1","event":{"event_id":"mss-evt-01a0360b-dcf1-71a8-8786-21561791d6ee","event_kind":"session_close","occurred_at":"2026-08-25T01:12:22+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore T9 Famiglia 4 R8+D14","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD fafe81f; 34 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-t9-f4-r8-d14-portabilita-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-t9-f4-r8-d14-portabilita-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"doctor","criterio":"node scripts/mss/doctor.mjs (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: node scripts/mss/doctor.mjs (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"views","criterio":"npm run validate:mss:views (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:views (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"export-help","criterio":"node scripts/mss/export-kit.mjs --help (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: node scripts/mss/export-kit.mjs --help (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"_skill-system-v0/hooks/fine-sessione-nudge.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"scripts/mss/review.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"scripts/mss/status.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-11","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0360b-dcf1-70c3-bd3b-35ee5462ab25","correlation_id":"mss-cor-01a0360b-dcf1-7a9d-b1f3-10c04ad40fe6","segment_no":1,"created_at":"2026-08-25T01:12:22+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t9-f4","actor_type":"agente","role":"esecutore T9 Famiglia 4 R8+D14","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["node","mss:doctor","validate:mss:views"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a0360b-dcf1-7a67-9f38-a31352c7005e","capture_key":"mss-ses-01a0360b-dcf1-70c3-bd3b-35ee5462ab25/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a0360b-dcf1-778f-8e17-65180401b57c","axis":"persona","subject_record_ids":["mss-rec-01a0360b-dcf1-7a70-b577-22fd0cd78182"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer-t9-f4","role":"esecutore T9 Famiglia 4 R8+D14","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0360b-dcf1-70c3-bd3b-35ee5462ab25","correlation_id":"mss-cor-01a0360b-dcf1-7a9d-b1f3-10c04ad40fe6","segment_no":1,"created_at":"2026-08-25T01:12:22+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t9-f4","actor_type":"agente","role":"esecutore T9 Famiglia 4 R8+D14","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["node","mss:doctor","validate:mss:views"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a0360b-dcf1-7082-8571-84d541d26ff4","capture_key":"mss-ses-01a0360b-dcf1-70c3-bd3b-35ee5462ab25/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a0360b-dcf1-75a4-93a5-6d319f0437b1","axis":"sistema","subject_record_ids":["mss-rec-01a0360b-dcf1-7a70-b577-22fd0cd78182"],"delta":"verificato","assertions":[{"rule_id_version":"R8/SK-10@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato T9 Famiglia 4: riesecuzione mss:doctor + validate:mss:views + smoke mss:export --help","decision_or_output_changed":"R8 confermato PROVATO (non CHIUSO): doctor 10/10 ok; views check OK solo cruscotto-matteo; export --help ok senza kit fuori repo. D14 deliberato BACKLOG: generatore non esteso (fix >1 file / non chiarissimo); ROADMAP e HANDOFF restano viste manuali (R-T7-04).","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"cursor-composer-t9-f4","role":"esecutore T9 Famiglia 4 R8+D14","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0360b-dcf1-70c3-bd3b-35ee5462ab25","correlation_id":"mss-cor-01a0360b-dcf1-7a9d-b1f3-10c04ad40fe6","segment_no":1,"created_at":"2026-08-25T01:12:22+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t9-f4","actor_type":"agente","role":"esecutore T9 Famiglia 4 R8+D14","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["node","mss:doctor","validate:mss:views"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a0360b-dcf1-7ae6-b7e8-ec77eb89b040","capture_key":"mss-ses-01a0360b-dcf1-70c3-bd3b-35ee5462ab25/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a0360b-dcf1-7b59-b445-7b8750b811ee","axis":"output","subject_record_ids":["mss-rec-01a0360b-dcf1-7a70-b577-22fd0cd78182"],"delta":"creato","assertions":[{"output_id":"report-t9-f4-r8-d14-portabilita-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-t9-f4-r8-d14-portabilita-25-08-26.md","recipient":"Matteo, orchestratore T9 e revisore","problem_or_job":"riconfermare R8 portabilita e classificare D14 senza estendere il generatore viste","intended_use":"capsula unica T9 Famiglia 4; backlog D14 con path espliciti; R8 resta PROVATO non CHIUSO","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"mandato T9 Famiglia 4 R8+D14 (inline parent)","authored_by":"cursor-composer-t9-f4","verified_by":"non_osservato","acceptance_criterion":"doctor e validate:mss:views exit 0; R8=PROVATO; D14=BACKLOG con path; report+capsula validate:mss --require-capsule verde; zero codice/PLAN/src/commit/kit ospite","verification_or_use_evidence":"npm run mss:doctor exit 0 (10/10); npm run validate:mss:views exit 0 (cruscotto-matteo); npm run mss:export -- --help exit 0; validate:mss --require-capsule sul report","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","scripts/mss/views.mjs","docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md"],"relations_no_double_count":["non chiude R8/SK-10; non implementa D14; non e report T7"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer-t9-f4","role":"esecutore T9 Famiglia 4 R8+D14","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
