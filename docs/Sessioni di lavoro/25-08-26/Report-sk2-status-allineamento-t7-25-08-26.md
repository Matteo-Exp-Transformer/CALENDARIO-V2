# Report — SK-2 status allineamento + viste (T7 Famiglia 1) — 25-08-2026

**Modalità:** deep · **Ruolo:** esecutore Cursor/Composer (T7 Famiglia 1)
**Branch:** `env/test` · **HEAD (inizio):** `fafe81f`
**Esito in una riga:** `mss:status` deriva gate e anti-stale dallo stesso parser del cruscotto; test nominato SK-2 verde; owner §4-bis SK-2 promosso ad ALLINEATO con riserva ROADMAP/HANDOFF.

## 1. Cappello

- **Cosa è cambiato:** il comando «dove siamo» ora mostra il gate autorizzato (`T7`) dall'ultimo ciclo del piano — non gate storici come `M-E` — e segnala se il cruscotto è stale; la tabella scheletro non ripete più numeri congelati dalle celle prova.
- **Cosa resta:** ROADMAP/HANDOFF restano viste manuali (D14); controverifica M12 famiglia diversa prima di dichiarare SK-2 CHIUSO formale; Famiglie 2–5 del ciclo T7.
- **Serve una tua azione:** no per usare `mss:status`; sì per revisione interna orchestratore T7.

## 2. Cosa è stato fatto

1. Estratto `scripts/mss/plan-parse.mjs` — parser PLAN condiviso (`parsePlanGate`: ultimo ciclo M-*, ultima prossima azione, stato R1).
2. `views.mjs` delega al parser condiviso (cruscotto invariato nel contratto).
3. `status.mjs`: sezione **Gate autorizzato**, sezione **Viste generate** (anti-stale via `runViews`), §4-bis solo stato senza colonna prova.
4. Test nominato `SK-2 / status: gate autorizzato deriva dall'ultimo ciclo PLAN, non da gate storici` in `test:mss:tools`.
5. Owner `PLAN_V0.md` §4-bis riga SK-2 → **ALLINEATO** con prova e riserva ROADMAP/HANDOFF.
6. Aggiornato `METASKILL_SYSTEM_SKILL.md` (ingresso attrezzi).

## 3. File toccati e perché

| File | Perché |
|---|---|
| `scripts/mss/plan-parse.mjs` | parser PLAN unico per status + viste |
| `scripts/mss/status.mjs` | gate, anti-stale, §4-bis senza numeri stale |
| `scripts/mss/views.mjs` | import parser condiviso (D18) |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | test SK-2 + fix conteggio owner assenti |
| `docs/MetaSkillSystem/PLAN_V0.md` | SK-2 ALLINEATO |
| `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` | descrizione mss:status |
| questo report + judgments | atti chiusura Famiglia 1 |

## 4. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| `npm run test:mss:tools` | exit 0 — 63 test (incluso SK-2) |
| `npm run mss:status` | exit 0 — gate `T7`, cruscotto allineata, nessun 163 file / 9/9 |
| `npm run validate:mss:views` | exit 0 |
| `npm run validate:mss:all` | exit 0 |
| `npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/25-08-26/Report-sk2-status-allineamento-t7-25-08-26.md" --kind report --require-capsule` | exit 0 (post-capsula) |

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` | nota gate/parser condiviso su mss:status | comportamento attrezzo cambiato |
| `docs/MetaSkillSystem/PLAN_V0.md` | owner §4-bis SK-2 | chiusura allineamento Famiglia 1 |
| nessuno skill area prodotto | — | mandato MSS, divieto `src/` |

## 6. Dati comunicazione

- Mandato: sub-agent T7 Famiglia 1 inline (orchestratore) — vedi Q1.
- Effetto per Matteo: apri terminale → `npm run mss:status` → vedi subito gate `T7` e se il cruscotto va rigenerato, sence muro di numeri storici SK-0.
- Automatizzabile: parser + anti-stale; manuale: estensione generatore a ROADMAP/HANDOFF (D14).

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali: 1 (mandato esecutore). Correzioni: 2 (padding vista, conteggio owner assenti nel test). Modalità: deep.

## 8. Lettura dell'agente

Condividere `plan-parse.mjs` evita la deriva status↔cruscotto che era il difetto SK-2. Non ho toccato ROADMAP/HANDOFF: fuori perimetro e divieto esplicito.

## 9. Derivazione errori

- Test rosso iniziale: `padEnd(16)` su `cruscotto-matteo` concatenava «allineata» — errore agente, fix padding.
- Test owner assenti: terza occorrenza «non ricostruibile» dalla nuova sezione Gate — test aggiornato, non indebolito.

## 10. Cosa resta / handoff

**Vero adesso:** Famiglia 1 T7 consegnata; SK-2 ALLINEATO in owner con riserva viste Senior-Eval; gate operativo = `T7`.

**Prossimo:** Famiglia 2 hook Q/R; orchestratore riesegue §6 prima di promuovere.

**Non riaprire:** rewrite ROADMAP/HANDOFF a mano; commit/push senza sì Matteo.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: path + revisione/hash; messaggi Matteo verbatim.
✅ R1: Mandato sub-agent inline (orchestratore T7 Famiglia 1) — branch `env/test`, HEAD `fafe81f`, obiettivo SK-2 + viste V1 parziale, deliverable report/judgments/capsula, divieti src/commit/push/ROADMAP rewrite. File letti: `scripts/mss/status.mjs`, `views.mjs`, `tests/tools/run.mjs`, `PLAN_V0.md` §4-bis @ working tree (HEAD blob `1b090f7e2a3c52db72c489f6a0d8d7301387d245` + diff SK-2); `CHIUSURA_SESSIONE.md` §11.

❓ Q2 — Dati = diff reale?
✅ R2: Sì — diff contiene plan-parse.mjs, status/views, test SK-2, PLAN SK-2, METASKILL; `npm run test:mss:tools` 63/63; `mss:status` mostra `prossimo T7` e non `M-E`; `validate:mss:all` exit 0.

❓ Q3 — File correlati §5 completi?
✅ R3: Sì — METASKILL + PLAN; nessuna skill prodotto.

❓ Q4 — Cosa NON hai fatto?
✅ R4: (1) ROADMAP/HANDOFF generati — divieto + backlog D14. (2) Hook Q/R Famiglia 2. (3) commit/push. (4) dichiarare SK-2 CHIUSO M12 — resta ALLINEATO con riserva; controverifica orchestratore pendente.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito: test legacy contava 2 «non ricostruibile» invece di 3 con sezione Gate — miglioria: documentare in test che Gate usa lo stesso UNKNOWN dell'owner.

❓ Q6 — Contesto & hook?
✅ R6: Contesto giusto (mandato T7 stretto). Nessun hook Cursor intercettato; prove via suite.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f2-7cba-76d5-a9f0-100be1e694fa","correlation_id":"mss-cor-01a035f2-7cba-747b-9c8b-84a970c72e6a","segment_no":1,"created_at":"2026-08-25T00:44:39+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-cursor-composer-sk2-t7","actor_type":"agente","role":"agente esecutore T7 Famiglia 1 SK-2","agent_runtime":{"provider":"Cursor","model":"cursor-composer-sk2-t7","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a035f2-7cba-70a3-8d48-6ffa08776513","capture_key":"mss-ses-01a035f2-7cba-76d5-a9f0-100be1e694fa/1/session_event/1","event":{"event_id":"mss-evt-01a035f2-7cba-7454-8f3b-cbfd413308d7","event_kind":"session_close","occurred_at":"2026-08-25T00:44:39+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"agente esecutore T7 Famiglia 1 SK-2","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD fafe81f; 16 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-sk2-status-allineamento-t7-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-sk2-status-allineamento-t7-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"SK2-TOOLS","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"SK2-VIEWS","criterio":"npm run validate:mss:views (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:views (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"SK2-ALL","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"_skill-system-v0/hooks/fine-sessione-nudge.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"scripts/mss/status.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f2-7cba-76d5-a9f0-100be1e694fa","correlation_id":"mss-cor-01a035f2-7cba-747b-9c8b-84a970c72e6a","segment_no":1,"created_at":"2026-08-25T00:44:39+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-cursor-composer-sk2-t7","actor_type":"agente","role":"agente esecutore T7 Famiglia 1 SK-2","agent_runtime":{"provider":"Cursor","model":"cursor-composer-sk2-t7","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a035f2-7cba-7b0e-bd43-37cf7bdfb040","capture_key":"mss-ses-01a035f2-7cba-76d5-a9f0-100be1e694fa/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a035f2-7cba-7cb7-bb84-65b70e46e1c0","axis":"persona","subject_record_ids":["mss-rec-01a035f2-7cba-70a3-8d48-6ffa08776513"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-cursor-composer-sk2-t7","role":"agente esecutore T7 Famiglia 1 SK-2","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f2-7cba-76d5-a9f0-100be1e694fa","correlation_id":"mss-cor-01a035f2-7cba-747b-9c8b-84a970c72e6a","segment_no":1,"created_at":"2026-08-25T00:44:39+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-cursor-composer-sk2-t7","actor_type":"agente","role":"agente esecutore T7 Famiglia 1 SK-2","agent_runtime":{"provider":"Cursor","model":"cursor-composer-sk2-t7","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a035f2-7cba-75e8-8181-038ee0e74526","capture_key":"mss-ses-01a035f2-7cba-76d5-a9f0-100be1e694fa/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a035f2-7cba-7787-995b-e20974ac8e73","axis":"sistema","subject_record_ids":["mss-rec-01a035f2-7cba-70a3-8d48-6ffa08776513"],"delta":"verificato","assertions":[{"rule_id_version":"SK-2/T7@PLAN_V0","trigger_event":"mss:status ripeteva celle §4-bis con numeri congelati e non derivava il gate dall'ultimo ciclo PLAN","decision_or_output_changed":"Parser PLAN condiviso (plan-parse.mjs) alimenta gate autorizzato e cruscotto; status controlla viste anti-stale e omette colonne prova stale","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"cursor-cursor-composer-sk2-t7","role":"agente esecutore T7 Famiglia 1 SK-2","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f2-7cba-76d5-a9f0-100be1e694fa","correlation_id":"mss-cor-01a035f2-7cba-747b-9c8b-84a970c72e6a","segment_no":1,"created_at":"2026-08-25T00:44:39+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-cursor-composer-sk2-t7","actor_type":"agente","role":"agente esecutore T7 Famiglia 1 SK-2","agent_runtime":{"provider":"Cursor","model":"cursor-composer-sk2-t7","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a035f2-7cba-78e1-8027-8decc59a7ccd","capture_key":"mss-ses-01a035f2-7cba-76d5-a9f0-100be1e694fa/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a035f2-7cba-7ff6-86fd-6f9f9948e0e1","axis":"output","subject_record_ids":["mss-rec-01a035f2-7cba-70a3-8d48-6ffa08776513"],"delta":"creato","assertions":[{"output_id":"sk2-status-allineamento-t7-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-sk2-status-allineamento-t7-25-08-26.md","recipient":"Matteo e orchestratore T7","problem_or_job":"allineare mss:status al parser PLAN e al cancello viste senza riscrivere ROADMAP/HANDOFF a mano","intended_use":"orientamento agente freddo coerente con cruscotto e gate T7 corrente","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"mandato T7 Famiglia 1 (orchestratore Cursor)","authored_by":"cursor-composer-sk2-t7","verified_by":"non_osservato","acceptance_criterion":"test nominato SK-2 verde; mss:status mostra T7 non M-E; validate:mss:all verde","verification_or_use_evidence":"controls[] in capsula e test SK-2 in test:mss:tools","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["scripts/mss/plan-parse.mjs","scripts/mss/status.mjs","scripts/mss/views.mjs","docs/MetaSkillSystem/tests/tools/run.mjs"],"relations_no_double_count":["Famiglia 1 T7; ROADMAP/HANDOFF generati restano backlog D14"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-cursor-composer-sk2-t7","role":"agente esecutore T7 Famiglia 1 SK-2","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
