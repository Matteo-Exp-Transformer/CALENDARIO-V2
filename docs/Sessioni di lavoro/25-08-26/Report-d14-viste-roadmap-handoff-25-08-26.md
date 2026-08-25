# M-D14 — ROADMAP/HANDOFF generate (anti-stale)

**Modalità:** deep · **Ruolo:** esecutore M-D14 · **Branch:** `env/test` · **HEAD base:** `892f6e4`
**Esito:** **PASS** — ROADMAP e HANDOFF Senior-Eval sono viste generate da `PLAN_V0`; test `D14/V1` verde.

## 1. Cappello

- **Cosa è cambiato:** le due viste del Senior-Eval-Pack non si aggiornano più a mano; stesso contratto del cruscotto (marcatori + `validate:mss:views`).
- **Cosa resta:** indice dei report (parte di `D14` storica) ancora manuale; `R-T7-06` (verify Output) ancora in `T11`; `WP-1` NO-GO.
- **Serve una tua azione:** no per usare le viste; sì solo se vuoi commit/push o firmare chiusure formali.

## 2. Cosa è stato fatto

1. Esteso `scripts/mss/views.mjs`: viste `roadmap-senior` e `handoff-senior` derivate da `PLAN_V0` (gate, lavagna M, riserve, STOP da board — niente numeri mobili).
2. Inseriti marcatori nei due file Senior-Eval; ritirate le istantanee manuali stratificate dell'handoff (storia resta in §7).
3. Test nominato `D14/V1 — ROADMAP e HANDOFF generate: owner modificato = gate rosso, rigenerazione = verde`; aggiornato `V1` al fixture a tre viste.
4. MANUALE §2.4-quater / tabella limiti; progresso owner PLAN (R-T7-04 CHIUSA, SK-2, D14 residuo indice).
5. **Non toccato** `scripts/mss/capsule.mjs` (mandato parallelo M-SK7-N4).

## 3. File toccati

| File | Perché |
|---|---|
| `scripts/mss/views.mjs` | derive ROADMAP/HANDOFF + registro VIEWS |
| `docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md` | marcatori + blocco generato |
| `docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md` | marcatori + blocco generato; coda §§4–7 umana |
| `docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md` | riallineato dopo PLAN |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | V1 a 3 viste + test `D14/V1` |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | tre viste; stato D14 |
| `docs/MetaSkillSystem/PLAN_V0.md` | solo progresso D14 / R-T7-04 / SK-2 (no WP-1) |
| report + judgments (questa cartella) | deliverable |

## 4. Test eseguiti

| Comando | Esito |
|---|---|
| `npm run generate:mss:views` | **exit 0** — cruscotto + roadmap + handoff |
| `npm run validate:mss:views` | **exit 0** |
| `npm run test:mss:tools` | **exit 0** — include `D14/V1` (68 test) |
| `npm run validate:mss:all` | **exit 0** |
| `git diff --check` | **exit 0** (perimetro D14) |

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `MANUALE_OPERATIVO_MSS_V0.md` | viste ROADMAP/HANDOFF + riga limiti | agente freddo sa rigenerare |

## 6. Dati comunicazione

Mandato parent M-D14 (rilancio post rate-limit Opus). Divieti rispettati: no `src/`, no DB, no WP-1/D27, no capsule.mjs, no commit/push.

## 7. Analisi flusso

Owner → `generate:mss:views` → tre blocchi fra marcatori → `validate:mss:views` rosso se diverge. Link atti in HANDOFF riscritti `../` → `../../` (vista un livello sotto MetaSkillSystem).

## 8. Lettura dell'agente

- **Sistema:** chiude la fabbrica di debito V2/V3 sulle due viste; residuo indice report resta debito consapevole.
- **Output:** questo report + test `D14/V1`.
- **Persona:** nessuna.

## 9. Handoff

**PASS.** Prossimo in `T11`: `R-T7-06`. Non riaprire WP-1. Controverso `capsule.mjs` del parallelo: fuori perimetro qui.

## 10. Domande di chiusura

❓ Q1 — Prompt: path e hash.
✅ R1: mandato M-D14 inline parent; HEAD base `892f6e4` su `env/test`.

❓ Q2 — Dati = misura reale?
✅ R2: sì — gate §4 rieseguiti verdi; viste allineate a PLAN post-edit D14.

❓ Q3 — Skill aggiornate?
✅ R3: sì — MANUALE; PLAN progresso D14; viste generate non sono skill.

❓ Q4 — Cosa NON fatto?
✅ R4: indice report non generato; R-T7-06 non toccato; capsule.mjs non toccato; no commit/push.

❓ Q5 — Attrito?
✅ R5: PLAN era stato ripristinato a metà seduta (viste stale); riapplicato progresso D14 e rigenerato. Parallelo su capsule.mjs osservato, non confluito.

❓ Q6 — Contesto?
✅ R6: sufficiente — MANUALE viste, views.mjs, report T9-F4 path backlog, pattern cruscotto.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0390a-4e30-7b48-b731-e06b6d2754bd","correlation_id":"mss-cor-01a0390a-4e30-7b97-b07e-2ce2d1e54924","segment_no":1,"created_at":"2026-08-25T15:09:31+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-d14","actor_type":"agente","role":"esecutore M-D14 ROADMAP/HANDOFF","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a0390a-4e30-7777-bc5b-338527063306","capture_key":"mss-ses-01a0390a-4e30-7b48-b731-e06b6d2754bd/1/session_event/1","event":{"event_id":"mss-evt-01a0390a-4e30-744d-854c-e8da1b53162a","event_kind":"session_close","occurred_at":"2026-08-25T15:09:31+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore M-D14 ROADMAP/HANDOFF","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 892f6e4; 12 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-d14-viste-roadmap-handoff-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-d14-viste-roadmap-handoff-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"VIEWS","criterio":"npm run validate:mss:views (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:views (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"D14V1","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"MSSALL","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"scripts/mss/capsule.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"892f6e4","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0390a-4e30-7b48-b731-e06b6d2754bd","correlation_id":"mss-cor-01a0390a-4e30-7b97-b07e-2ce2d1e54924","segment_no":1,"created_at":"2026-08-25T15:09:31+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-d14","actor_type":"agente","role":"esecutore M-D14 ROADMAP/HANDOFF","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a0390a-4e30-7d1d-b778-d6a66026a63f","capture_key":"mss-ses-01a0390a-4e30-7b48-b731-e06b6d2754bd/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a0390a-4e30-7fe1-ab70-9439b98d42a2","axis":"persona","subject_record_ids":["mss-rec-01a0390a-4e30-7777-bc5b-338527063306"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer-m-d14","role":"esecutore M-D14 ROADMAP/HANDOFF","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0390a-4e30-7b48-b731-e06b6d2754bd","correlation_id":"mss-cor-01a0390a-4e30-7b97-b07e-2ce2d1e54924","segment_no":1,"created_at":"2026-08-25T15:09:31+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-d14","actor_type":"agente","role":"esecutore M-D14 ROADMAP/HANDOFF","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a0390a-4e30-733a-83e1-81d0bb277d4b","capture_key":"mss-ses-01a0390a-4e30-7b48-b731-e06b6d2754bd/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a0390a-4e30-7d45-a605-1f844a41b020","axis":"sistema","subject_record_ids":["mss-rec-01a0390a-4e30-7777-bc5b-338527063306"],"delta":"creato","assertions":[{"rule_id_version":"D14/V1@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato M-D14: estendere generate:mss:views a ROADMAP_V0 e HANDOFF_SENIOR_V0 anti-stale","decision_or_output_changed":"VIEWS include roadmap-senior e handoff-senior derivate da PLAN_V0 fra marcatori; validate:mss:views le controlla; test nominato D14/V1 prova owner→rosso e generate→verde. R-T7-04 CHIUSA; residuo D14 = indice report manuale. WP-1 non toccato.","G":2,"O":2,"E":1}],"asserted_by":{"actor_id":"cursor-composer-m-d14","role":"esecutore M-D14 ROADMAP/HANDOFF","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0390a-4e30-7b48-b731-e06b6d2754bd","correlation_id":"mss-cor-01a0390a-4e30-7b97-b07e-2ce2d1e54924","segment_no":1,"created_at":"2026-08-25T15:09:31+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-m-d14","actor_type":"agente","role":"esecutore M-D14 ROADMAP/HANDOFF","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a0390a-4e30-7b9d-b55c-d891d770f30e","capture_key":"mss-ses-01a0390a-4e30-7b48-b731-e06b6d2754bd/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a0390a-4e30-79b1-839c-a5cbfb5e775b","axis":"output","subject_record_ids":["mss-rec-01a0390a-4e30-7777-bc5b-338527063306"],"delta":"creato","assertions":[{"output_id":"report-d14-viste-roadmap-handoff-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-d14-viste-roadmap-handoff-25-08-26.md","recipient":"Matteo, orchestratore T11 e revisore","problem_or_job":"chiudere il debito D14/R-T7-04 sulle viste ROADMAP e HANDOFF manuali","intended_use":"prova eseguibile anti-stale; handoff per T11 residuo R-T7-06","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"mandato M-D14 inline parent","authored_by":"cursor-composer-m-d14","verified_by":"non_osservato","acceptance_criterion":"generate/validate:mss:views exit 0 sulle tre viste; test D14/V1 verde; validate:mss:all exit 0; git diff --check exit 0; capsule.mjs non toccato","verification_or_use_evidence":"npm run generate:mss:views; validate:mss:views; test:mss:tools (D14/V1); validate:mss:all; git diff --check","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["scripts/mss/views.mjs","docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md","docs/MetaSkillSystem/tests/tools/run.mjs","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md"],"relations_no_double_count":["non chiude T11 intero; non implementa indice report; non tocca capsule.mjs / WP-1 / R-T7-06"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer-m-d14","role":"esecutore M-D14 ROADMAP/HANDOFF","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
