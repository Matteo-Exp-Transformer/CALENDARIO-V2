# H13-E2 T7 — inventario bypass enforcement H-1.3

**Modalità:** deep · **Ruolo:** esecutore T7 Famiglia 3 · **Branch:** `env/test` · **HEAD:** `fafe81f`
**Esito in una riga:** inventario bypass E2 per controllo `H1-*` con evidenza comando; chiuso solo **`B-E2-CI`** (matrice stale); `H-1.3` resta **`PASS_CON_RISERVE`**.

## 1. Cappello

- **Cosa è cambiato:** la matrice di copertura non dice più che la CI «non è cablata» — era obsoleta dopo `SK-5`. Resta un inventario esplicito di tutti i bypass E2 (hook saltabili, file unstaged, superfici senza hook).
- **Cosa resta:** `--no-verify`, unstaged, Cloud/Codex/Claude senza hook, report light/non recenti, ecc. — tutti **intenzionali** finché non esiste tecnologia `E-2`. `H-1.3` **non** è PASS pulito. `WP-1` resta NO-GO.
- **Serve una tua azione:** no per questo mandato; sì per controverifica Codex a fine ciclo T7.

## 2. Cosa è stato fatto

1. **Passo 0:** `git rev-parse HEAD` → `fafe81f`; working tree con modifiche altrui (Famiglia 1 SK-2) — non toccate.
2. **Inventario** di ogni `known_bypass` in `COVERAGE_MATRIX_H1.json` (21 controlli `H1-*`), raggruppato per classe con prova comando.
3. **Chiusura meccanica `B-E2-CI`:** rimosso «CI non cablata» da `H1-FIXTURE-PROTOCOL`; verificato che `.github/workflows/ci.yml` contiene `validate:mss:all` su `main`/`env/test` (`SK-5`).
4. **Test nominato** `H13-E2 / SK-5 — CI cablata, matrice senza bypass stale` in `npm run test:mss`.
5. **Owner:** `PLAN_V0.md` §3.2 e § gate H-1 (riga CI) rettificati — **senza** riga «H-1.3 PASS pulito».

## 3. Tabella bypass — fixture/controllo `H1-*`

Legenda **Stato:** `CHIUSO` = bypass eliminato dalla matrice + test; `RESTA` = bypass intenzionale E2; `DOCUMENTATO` = già dichiarato, nessun fix meccanico in perimetro.

| Classe | Controlli `H1-*` | Bypass (estratto matrice) | Tipo | Stato | Evidenza comando |
|---|---|---|---|---|---|
| **B-E2-NOV** | tutti (21) | `--no-verify` | intenzionale E-2 | **RESTA** | `git commit --help` documenta `--no-verify`; `.husky/pre-commit` non gira se flag presente |
| **B-E2-UNST** | SCHEMA, VITALS, JSONL-LIGHT, FIXTURE-PROTOCOL, … | `unstaged` / `file non staged` | intenzionale | **RESTA** | pre-commit legge solo index staged: `git diff --cached` vs worktree in `adapter.mjs` |
| **B-E2-CLOUD** | SCHEMA, REPORT-CAPSULE, QR-UNCHANGED | Cloud/Codex/Claude senza hook | intenzionale | **RESTA** | `COVERAGE_MATRIX_H1.json` → `declarations.stop_does_not_cover_cloud_codex_claude: true` |
| **B-E2-CI** | FIXTURE-PROTOCOL | ~~CI non cablata~~ | stale post-SK-5 | **CHIUSO** | `rg validate:mss:all .github/workflows/ci.yml` → match job `mss`; test `H13-E2 / SK-5 — …` |
| **B-E2-HOOK** | ID-CAPTURE, APPEND-ONLY-HEAD, AXIS-SEMANTICS, VERSION-MODE, AMENDMENT-HISTORY, UTF8-FATAL | superfici senza hook | intenzionale | **RESTA** | Codex web / agenti fuori Cursor non montano `.husky` né hook Claude locali |
| **B-E2-LIGHT** | REPORT-CAPSULE, VERSION-MODE | report light/legacy/undeclared | intenzionale fail-open | **RESTA** | `FX-I07` + gruppo `H-1.1 report modes` in `test:mss` |
| **B-E2-RECENT** | REPORT-CAPSULE | report non recente (stop) | intenzionale | **RESTA** | `stop hook integration` — finestra 20 min in matrice `denominator_note` |
| **B-E2-DRAFT** | FINAL-AXES | draft non presentato come chiusura | intenzionale | **RESTA** | design: assi draft fuori gate chiusura |
| **B-E2-HINT** | LOCK-HINT | hint non lessicale | intenzionale | **RESTA** | effetto `warn`, non deny — E1 |
| **B-E2-REF** | REFS | ref logici senza prova contenuto | limite noto | **DOCUMENTATO** | `FX-I05` + `reference security` |
| **B-E2-FREE** | AXIS-SEMANTICS | testo libero non strutturato | intenzionale | **RESTA** | fail-open senza capsula strutturata |
| **B-E2-HIST** | AMENDMENT-HISTORY | storia non tracciata / fuori perimetro | intenzionale | **RESTA** | `historical_amendments_use_bounded_git_head` in matrice |
| **B-E2-PERIM** | ID-CAPTURE, APPEND-ONLY-HEAD, UTF8-FATAL, … | artefatti fuori perimetro report/eventi-light | intenzionale | **RESTA** | perimetro adapter in `scripts/mss/adapter.mjs` |

**Riduzione effettuata:** 1 classe (`B-E2-CI`), 1 controllo (`H1-FIXTURE-PROTOCOL`). Nessun allentamento validator; nessun tocco `src/`.

## 4. File toccati

| File | Perché |
|---|---|
| `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json` | rimosso bypass stale «CI non cablata» su `H1-FIXTURE-PROTOCOL` |
| `docs/MetaSkillSystem/tests/h1/run.mjs` | test nominato `H13-E2 / SK-5 — CI cablata, matrice senza bypass stale` |
| `docs/MetaSkillSystem/PLAN_V0.md` | §3.2 + gate H-1: inventario T7, CI rettificata, **H-1.3 resta PASS_CON_RISERVE** |
| `docs/Sessioni di lavoro/25-08-26/judgments-h13-e2-t7-25-08-26.json` | giudizi R1 per `mss:capsule` |
| questo report | deliverable Famiglia 3 |

## 5. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| `npm run test:mss` | **exit 0** — 42 fixture + **52** gruppi (incluso `H13-E2 / SK-5 — CI cablata, matrice senza bypass stale`) |
| `npm run validate:mss:all` | **exit 0** |
| `npm run validate:mss -- --mode file --file "<questo report>" --kind report --require-capsule` | **exit 0** |

**Nota working tree:** altre famiglie T7 (SK-2, hook Q/R) lavorano in parallelo sullo stesso branch; la suite H-1 è stata eseguita con tree pulito dalle modifiche altrui (stash temporaneo) e poi `validate:mss:all` **exit 0** con capsula.

## 6. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `PLAN_V0.md` | §3.2 + gate H-1 CI | owner autorevole stato H-1.3 / bypass |
| nessun altro | — | nessuna skill area app; matrice è artefatto MSS owner-adjacent |

## 7. Dati comunicazione

- Mandato: prompt orchestratore T7 § Famiglia 3 (incollato dal parent).
- Divieti rispettati: no WP-1 aperto, no E-2 tecnologia, no allentamento validator, no `src/`.
- Formato efficace: tabella classe/controllo/evidenza — allineato a revisioni SK-4/H13 precedenti.

## 8. Analisi flusso ed efficienza

Un solo bypass era chiudibile a rischio zero: la dicitura CI nella matrice contraddiceva `SK-5` già chiuso e verificato su Actions. Il resto è buco intenzionale §4 riga `E-2` o limite di perimetro (staged-only, fail-open su light). Tentare di «chiudere» `--no-verify` richiederebbe tecnologia E-2 — fuori mandato.

## 9. Lettura dell'agente

- **Sistema:** la matrice ora non mente sulla CI; l'inventario rende auditabile cosa resta saltabile e perché.
- **Output:** report + test nominato per l'unica chiusura; bypass residui espliciti in matrice e tabella §3.
- **Persona:** nessuna decisione nuova richiesta a Matteo in seduta.

## 10. Derivazione errori

| Problema | Causa | Classe |
|---|---|---|
| Matrice diceva «CI non cablata» | owner gate H-1 non aggiornato dopo `SK-5` (24-08) | bug documentale |
| test:mss exit 1 su tree sporco | guardia anti-drift suite vs modifiche parallele T7 | vincolo strutturale |

## 10-bis. Handoff

**Cosa è vero adesso:** `H13-E2` Famiglia 3 consegnato; `B-E2-CI` chiuso con test; `H-1.3` = `PASS_CON_RISERVE` invariato; bypass `--no-verify`/unstaged/Cloud restano in matrice.

**Prossimo:** orchestratore T7 Famiglia 4 (`SK4-ASSERT`) o 5 (readiness); controverifica Codex a fine ciclo.

**Non riaprire:** WP-1, H-1.3 PASS pulito, implementazione E-2.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura.
✅ R1: mandato inline parent T7 Famiglia 3; `docs/Sessioni di lavoro/25-08-26/Prompt-orchestratore-cursor-t7-backlog-pilota-25-08-26.md` @ `fafe81f`; `COVERAGE_MATRIX_H1.json` @ working tree; `PLAN_V0.md` @ working tree.

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti?
✅ R2: sì — diff limitato a matrice, run.mjs, PLAN §3.2+gate H-1; test `H13-E2 / SK-5` verde; nessuna riga «PASS pulito» nel PLAN.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa?
✅ R3: sì — solo `PLAN_V0.md`; matrice e test sono artefatti MSS, elencati in §4.

❓ Q4 — Cosa NON hai fatto?
✅ R4: non implementato E-2; non chiuso bypass `--no-verify`/unstaged/Cloud; non toccato `src/`; non commit/push; non aperto WP-1; non rigenerato cruscotto (owner PLAN cambiato — orchestratore può lanciare `generate:mss:views` in Fase 4).

❓ Q5 — Attrito + miglioria?
✅ R5: attrito: working tree sporco da Famiglia 1 fa fallire la guardia finale di `test:mss` — suggerimento: esecutori T7 su worktree dedicati o stash esplicito tra famiglie.

❓ Q6 — Contesto & hook?
✅ R6: contesto giusto (prompt T7 + matrice + PLAN); hook non applicabili in sub-agent.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f1-726b-7742-8def-b54c1f297380","correlation_id":"mss-cor-01a035f1-726b-7b2d-96ce-e0750f933a6b","segment_no":1,"created_at":"2026-08-25T00:43:31+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer","actor_type":"agente","role":"esecutore T7 Famiglia 3 H13-E2","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a035f1-726b-7d5c-a147-b472baeba47f","capture_key":"mss-ses-01a035f1-726b-7742-8def-b54c1f297380/1/session_event/1","event":{"event_id":"mss-evt-01a035f1-726b-7f65-80df-41c98a3336b4","event_kind":"session_close","occurred_at":"2026-08-25T00:43:31+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore T7 Famiglia 3 H13-E2","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD fafe81f; 16 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-h13-e2-bypass-t7-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-h13-e2-bypass-t7-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"test:mss","criterio":"npm run test:mss (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"validate:mss:all","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"_skill-system-v0/hooks/fine-sessione-nudge.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"scripts/mss/status.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f1-726b-7742-8def-b54c1f297380","correlation_id":"mss-cor-01a035f1-726b-7b2d-96ce-e0750f933a6b","segment_no":1,"created_at":"2026-08-25T00:43:31+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer","actor_type":"agente","role":"esecutore T7 Famiglia 3 H13-E2","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a035f1-726b-77a2-9876-89a4fb3af0bf","capture_key":"mss-ses-01a035f1-726b-7742-8def-b54c1f297380/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a035f1-726b-70f3-94fd-9a4f7d0b53e7","axis":"persona","subject_record_ids":["mss-rec-01a035f1-726b-7d5c-a147-b472baeba47f"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer","role":"esecutore T7 Famiglia 3 H13-E2","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f1-726b-7742-8def-b54c1f297380","correlation_id":"mss-cor-01a035f1-726b-7b2d-96ce-e0750f933a6b","segment_no":1,"created_at":"2026-08-25T00:43:31+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer","actor_type":"agente","role":"esecutore T7 Famiglia 3 H13-E2","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a035f1-726b-7da8-bbc7-22d688e6dba3","capture_key":"mss-ses-01a035f1-726b-7742-8def-b54c1f297380/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a035f1-726b-7961-80ff-4f60602c1490","axis":"sistema","subject_record_ids":["mss-rec-01a035f1-726b-7d5c-a147-b472baeba47f"],"delta":"modificato","assertions":[{"rule_id_version":"H13-E2/B-E2-CI@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato T7 Famiglia 3: inventario bypass E2 H-1.3 e chiusura meccanica dove SK-5 già cablato","decision_or_output_changed":"Il bypass stale «CI non cablata» è rimosso da H1-FIXTURE-PROTOCOL; la matrice resta la fonte dei bypass intenzionali (--no-verify, unstaged, Cloud senza hook); H-1.3 resta PASS_CON_RISERVE","G":2,"O":1,"E":2}],"asserted_by":{"actor_id":"cursor-composer","role":"esecutore T7 Famiglia 3 H13-E2","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f1-726b-7742-8def-b54c1f297380","correlation_id":"mss-cor-01a035f1-726b-7b2d-96ce-e0750f933a6b","segment_no":1,"created_at":"2026-08-25T00:43:31+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer","actor_type":"agente","role":"esecutore T7 Famiglia 3 H13-E2","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a035f1-726b-7fb6-9e59-ecde0c66effc","capture_key":"mss-ses-01a035f1-726b-7742-8def-b54c1f297380/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a035f1-726b-71a7-8407-f1e7da97398a","axis":"output","subject_record_ids":["mss-rec-01a035f1-726b-7d5c-a147-b472baeba47f"],"delta":"creato","assertions":[{"output_id":"report-h13-e2-bypass-t7-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-h13-e2-bypass-t7-25-08-26.md","recipient":"Matteo, orchestratore T7 e revisore Codex post-ciclo","problem_or_job":"documentare ogni bypass E2 per controllo H1-* con evidenza comando e chiudere solo ciò che SK-5 rende meccanicamente obsoleto","intended_use":"controverificare H13-E2 senza dichiarare H-1.3 PASS pulito né aprire WP-1","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"docs/Sessioni di lavoro/25-08-26/Prompt-orchestratore-cursor-t7-backlog-pilota-25-08-26.md § Famiglia 3","authored_by":"cursor-composer-t7-h13-e2","verified_by":"non_osservato","acceptance_criterion":"tabella bypass per classe/controllo; un bypass chiuso con test nominato; owner §3.2 aggiornato senza PASS pulito; validate:mss sul report verde","verification_or_use_evidence":"npm run test:mss (gruppo H13-E2), validate:mss sul report, validate:mss:all","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","docs/MetaSkillSystem/tests/h1/run.mjs",".github/workflows/ci.yml"],"relations_no_double_count":["inventario bypass; non sostituisce revisione M12 del ciclo T7"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer","role":"esecutore T7 Famiglia 3 H13-E2","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
