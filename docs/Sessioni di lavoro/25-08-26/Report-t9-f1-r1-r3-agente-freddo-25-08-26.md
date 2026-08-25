# T9 F1 — R1–R3 agente freddo (gap validate scripts)

**Modalità:** deep · **Ruolo:** esecutore famiglia 1 (NON orchestratore) · **Branch:** `env/test` · **HEAD:** `fafe81f`
**Esito:** **PASS** — test R3 nominato verde; smoke R1/R2 documentati; capsula R1.

## 1. Cappello

- **Cosa è cambiato:** la distinzione `validate:app` ≠ `validate:mss:all` ≠ `validate` (con `validate` che concatena i due) è ora protetta da un test nominato in `test:mss:tools`, così non può regressare in silenzio.
- **Cosa resta:** owner `PLAN_V0.md` non aggiornato qui (divieto mandato); pubblicazione/commit resta fuori perimetro T9 F1.
- **Serve una tua azione:** no per questo mandato (orchestratore decide se promuovere stato R3 in PLAN).

## 2. Cosa è stato fatto

1. Lettura minima: Manuale §2, Scheda R1, CHIUSURA_SESSIONE; conferma branch `env/test` @ `fafe81f`.
2. Aggiunto **un** caso in `docs/MetaSkillSystem/tests/tools/run.mjs`:
   `R3 — validate:app e validate:mss:all sono script distinti e validate li concatena`.
3. Smoke: `mss:status`, `mss:query -- --verifica`, esistenza Scheda R1.
4. Report + judgments R1 + capsula via `mss:capsule` (scheda anti-errore).

## 3. File toccati e perché

| File | Perché |
|---|---|
| `docs/MetaSkillSystem/tests/tools/run.mjs` | unico caso R3 nominato |
| `docs/Sessioni di lavoro/25-08-26/Report-t9-f1-r1-r3-agente-freddo-25-08-26.md` | deliverable + capsula |
| `docs/Sessioni di lavoro/25-08-26/judgments-t9-f1-25-08-26.json` | giudizi `--template-r1` |

**Non toccati (divieto):** `PLAN_V0.md`, `src/`, report/judgments T7, validator.

## 4. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| `npm run test:mss:tools` | **exit 0** — 64 tests; incluso `OK R3 — validate:app e validate:mss:all…` |
| `npm run mss:status` | **exit 0** — gate: ultimo `M-F` CHIUSO; R1 CHIUSO CON RISERVE; **prossimo `T8`** (non mente su gate storico) |
| `npm run mss:query -- --verifica` | **exit 0** |
| Esistenza `docs/MetaSkillSystem/SCHEDA_CHIUSURA_META_R1.md` | **presente** |
| `npm run validate:mss -- --mode file --file "…/Report-t9-f1-r1-r3-agente-freddo-25-08-26.md" --kind report --require-capsule` | **exit 0** (post-capsula) |

### Assert R3 (cosa protegge il test)

Da `package.json` scripts:
- `validate:app` = lint + typecheck + test app
- `validate:mss:all` = suite MSS/docs (senza lint/typecheck/`npm run test` app)
- `validate` = `validate:app && validate:mss:all` (sequenza)

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| nessuno | — | nessuna skill area layout/comportamento app; owner PLAN vietato dal mandato |

## 6. Dati comunicazione

- Mandato: «Mandato T9 Famiglia 1 — R1–R3 agente freddo» (inline parent / sub-agent).
- Divieti rispettati: no PLAN, no src, no commit/push, no WP-1, no H-1.3 PASS pulito, no riscrittura T7.

## 7. Analisi flusso prompt

Un mandato atomico con perimetro file stretto: gap strutturale chiaro, deliverable nominati. Zero correzioni di scope. Modalità non alzata.

## 8. Lettura della sessione

- **Impressioni:** Scheda R1 + Manuale §2 bastano a chiudere senza riaprire il corpus; il gap R3 era davvero solo «manca il test nominato», non ambiguità di script.
- **Difficoltà:** working tree già sporco di T7 — preservato, nessun rewrite.
- **Migliorie (dato, non patch):** l’orchestratore potrebbe aggiungere in PLAN una riga «R3 PROVATO/CHIUSO» solo dopo controverifica; qui non toccato.

## 9. Derivazione errori

nessuna difficoltà operativa — gap era assenza di copertura nominata (vincolo strutturale di regressione), non bug runtime.

## 10. Cosa resta

- Orchestratore: eventuale allineamento stato R3 in owner PLAN (fuori F1).
- T8 / pubblicazione: sì Matteo, fuori perimetro.

## 10-bis. Handoff

**Cosa è vero adesso**
- Test nominato R3 verde in `test:mss:tools` (64/64).
- Smoke: status cita prossimo `T8`; query `--verifica` exit 0; Scheda R1 esiste.
- R1 resta CHIUSO CON RISERVE (test tre giudizi già presente); R2 PROVATO (N1/N2/doctor non riaperti); R3 gap strutturale **chiuso in codice** da questa capsula.

**Non riaprire:** rewrite report T7; allentamento validator; WP-1 / H-1.3 PASS pulito.

**Owner stato dinamico:** `PLAN_V0.md` (non modificato qui).

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: path e revisione/hash; messaggi non in file verbatim.
✅ R1: mandato inline parent «Mandato T9 Famiglia 1 — R1–R3 agente freddo (Cursor sub-agent)» (non file repo); lettura `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` §2, `docs/MetaSkillSystem/SCHEDA_CHIUSURA_META_R1.md`, `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` su working tree @ HEAD `fafe81f` (+ dirty T7 preesistente).

❓ Q2 — Dati = diff reale?
✅ R2: sì — unico delta codice = caso R3 in `tests/tools/run.mjs`; §4 allineata a exit 0 di `test:mss:tools` / status / query / validate:mss post-capsula.

❓ Q3 — File correlati / skill?
✅ R3: nessuno — motivazione §5 (nessuna skill area; PLAN vietato).

❓ Q4 — Cosa NON hai fatto?
✅ R4: non aggiornato PLAN; non toccato src/; non commit/push; non riscritto report T7; non dichiarato H-1.3 PASS pulito; non allentato validator.

❓ Q5 — Attrito + miglioria?
✅ R5: tree sporco T7 richiede disciplina di non-touch — ok; miglioria: checklist orchestratore «gap = test nominato» già nel mandato, tenere così.

❓ Q6 — Contesto & hook?
✅ R6: giusto — Manuale §2 + Scheda R1 + CHIUSURA sufficienti; nessun hook stop ancora (capsula in chiusura).

## 12. Self-review

Triade: tools verde + validate:mss require-capsule (post) + smoke documentati. §5 onesta (nessuno). Q1–Q6 sostanziali. Cap sotto 180 righe.

## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03608-e8ed-7c1d-bd55-2efcf9aab0a4","correlation_id":"mss-cor-01a03608-e8ed-7da8-b06d-088ea53d185a","segment_no":1,"created_at":"2026-08-25T01:09:08+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t9-f1-r1-r3","actor_type":"agente","role":"esecutore-famiglia-1-T9-R1-R3","agent_runtime":{"provider":"Cursor","model":"cursor-composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a03608-e8ed-7fcd-8320-7ee32cb252c2","capture_key":"mss-ses-01a03608-e8ed-7c1d-bd55-2efcf9aab0a4/1/session_event/1","event":{"event_id":"mss-evt-01a03608-e8ed-7c22-9c6c-5e7da1c2e311","event_kind":"session_close","occurred_at":"2026-08-25T01:09:08+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore-famiglia-1-T9-R1-R3","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD fafe81f; 30 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-t9-f1-r1-r3-agente-freddo-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-t9-f1-r1-r3-agente-freddo-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"TEST-TOOLS","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"STATUS","criterio":"npm run mss:status (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run mss:status (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"QUERY-VERIFICA","criterio":"npm run mss:query -- --verifica (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run mss:query -- --verifica (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"_skill-system-v0/hooks/fine-sessione-nudge.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"scripts/mss/review.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"scripts/mss/status.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-11","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03608-e8ed-7c1d-bd55-2efcf9aab0a4","correlation_id":"mss-cor-01a03608-e8ed-7da8-b06d-088ea53d185a","segment_no":1,"created_at":"2026-08-25T01:09:08+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t9-f1-r1-r3","actor_type":"agente","role":"esecutore-famiglia-1-T9-R1-R3","agent_runtime":{"provider":"Cursor","model":"cursor-composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03608-e8ed-72d7-afff-a7f48eeb4afd","capture_key":"mss-ses-01a03608-e8ed-7c1d-bd55-2efcf9aab0a4/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a03608-e8ed-7d4d-b089-70cc85349105","axis":"persona","subject_record_ids":["mss-rec-01a03608-e8ed-7fcd-8320-7ee32cb252c2"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer-t9-f1-r1-r3","role":"esecutore-famiglia-1-T9-R1-R3","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03608-e8ed-7c1d-bd55-2efcf9aab0a4","correlation_id":"mss-cor-01a03608-e8ed-7da8-b06d-088ea53d185a","segment_no":1,"created_at":"2026-08-25T01:09:08+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t9-f1-r1-r3","actor_type":"agente","role":"esecutore-famiglia-1-T9-R1-R3","agent_runtime":{"provider":"Cursor","model":"cursor-composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03608-e8ed-704a-8cff-6bae08fe96e0","capture_key":"mss-ses-01a03608-e8ed-7c1d-bd55-2efcf9aab0a4/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a03608-e8ed-79fe-8376-5c52059f7f8c","axis":"sistema","subject_record_ids":["mss-rec-01a03608-e8ed-7fcd-8320-7ee32cb252c2"],"delta":"modificato","assertions":[{"rule_id_version":"R3/T9-F1@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato T9 Famiglia 1: gap strutturale — assenza di test nominato che protegga la distinzione validate:app / validate:mss:all / validate","decision_or_output_changed":"Aggiunto in docs/MetaSkillSystem/tests/tools/run.mjs il caso nominato «R3 — validate:app e validate:mss:all sono script distinti e validate li concatena»: assert su stringhe diverse, sequenza in validate, e assenza di lint/typecheck/test app in validate:mss:all","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"cursor-composer-t9-f1-r1-r3","role":"esecutore-famiglia-1-T9-R1-R3","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03608-e8ed-7c1d-bd55-2efcf9aab0a4","correlation_id":"mss-cor-01a03608-e8ed-7da8-b06d-088ea53d185a","segment_no":1,"created_at":"2026-08-25T01:09:08+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t9-f1-r1-r3","actor_type":"agente","role":"esecutore-famiglia-1-T9-R1-R3","agent_runtime":{"provider":"Cursor","model":"cursor-composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03608-e8ed-7201-b20e-14a0659bc067","capture_key":"mss-ses-01a03608-e8ed-7c1d-bd55-2efcf9aab0a4/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a03608-e8ed-7a02-b1ae-015be0b495e1","axis":"output","subject_record_ids":["mss-rec-01a03608-e8ed-7fcd-8320-7ee32cb252c2"],"delta":"creato","assertions":[{"output_id":"report-t9-f1-r1-r3-agente-freddo-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-t9-f1-r1-r3-agente-freddo-25-08-26.md","recipient":"Matteo, orchestratore T9 e revisore","problem_or_job":"chiudere il gap R3 con test nominato verde e documentare smoke R1/R2 senza toccare PLAN né report T7","intended_use":"capsula famiglia 1 T9; prova che la distinzione degli script validate resta protetta da regressione","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"mandato T9 Famiglia 1 — R1–R3 agente freddo (Cursor sub-agent)","authored_by":"cursor-composer-t9-f1-r1-r3","verified_by":"non_osservato","acceptance_criterion":"test R3 nominato verde in test:mss:tools; smoke status/query/scheda R1 documentati; validate:mss --require-capsule exit 0","verification_or_use_evidence":"npm run test:mss:tools exit 0 (caso R3 OK); mss:status exit 0 prossimo T8; mss:query --verifica exit 0; SCHEDA_CHIUSURA_META_R1.md presente","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/MetaSkillSystem/tests/tools/run.mjs","package.json","docs/MetaSkillSystem/SCHEDA_CHIUSURA_META_R1.md"],"relations_no_double_count":["non riscrive report T7; non allenta validator; non tocca PLAN_V0.md né src/"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer-t9-f1-r1-r3","role":"esecutore-famiglia-1-T9-R1-R3","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
