# M-E2-B — enforcement unstaged / worktree Report|Verbale (Opzione B)

**Modalità:** deep · **Ruolo:** esecutore M-E2-B · **Branch:** `env/test` · **HEAD:** `ee86d2a`
**Esito in una riga:** Report/Verbale MSS modificati ma non staged entrano nel pre-commit e negano se incompleti; `H-1.3` **non** promosso; E2-A lasciato intatto nel working tree.

## 1. Cappello

- **Cosa è cambiato:** il cancello pre-commit non ignora più Report/Verbale sporchi solo nel worktree (perimetro SK-4 B2/B3 ricorsivo).
- **Cosa resta:** `--no-verify`; JSONL/fixture unstaged; Cloud/Codex/Claude; light fail-open. `H-1.3` = `PASS_CON_RISERVE`. `WP-1` = NO-GO.
- **Serve una tua azione:** no per questo mandato; sì per controverifica orchestratore §6.

## 2. Cosa è stato fatto

1. **`collectUnstagedMssReportEntries` + `collectPrecommitMssEntries`** in `git-adapter.mjs`: unisce staged MSS e Report/Verbale dirty non staged.
2. **`fine-sessione-commit-check.mjs`:** valida la vista unificata; etichetta `(unstaged)` nel deny.
3. **Matrice H-1:** `precommit_covers_unstaged_mss_reports: true`; `denominator_note` e `known_bypass` aggiornati (residuo = JSONL/fixture unstaged + `--no-verify`).
4. **Test nominato** `H13-E2 / unstaged — Report|Verbale non staged entrano nel gate e deny` (B2 Report + B3 Verbale in sotto-cartella).
5. **Husky:** commento policy M-E2-A/B senza cambiare il flusso lint-staged → hook.

## 3. Perimetro chiuso vs residuo

| Classe | Superficie | Stato M-E2-B |
|---|---|---|
| **B-E2-UNST-REPORT** | Report/Verbale dirty non staged | **PROVATO** — entrano nel gate; deny se incompleti |
| **B-E2-UNST-JSONL** | eventi-light / fixture non staged | **RESTA** — fuori scope Report|Verbale |
| **B-E2-NOV** | `git commit --no-verify` | **RESTA** — salta anche il nuovo check (E2-A) |
| **B-E2-CLOUD** | agenti senza hook | **RESTA** — famiglia E2-C |

## 4. File toccati (additivo; E2-A non revertato)

| File | Perché |
|---|---|
| `scripts/mss/git-adapter.mjs` | collector unstaged Report/Verbale + merge pre-commit |
| `.cursor/hooks/fine-sessione-commit-check.mjs` | gate su vista staged+unstaged |
| `.husky/pre-commit` | policy documentata M-E2-B |
| `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json` | dichiarazione + bypass aggiornati |
| `docs/MetaSkillSystem/tests/h1/run.mjs` | test nominato H13-E2/unstaged |
| `judgments-e2-b-unstaged-25-08-26.json` | giudizi R1 |
| questo report | deliverable |

**Nota coesistenza E2-A:** restano unstaged `Report-e2-a-no-verify-…`, `judgments-e2-a-…`, e le modifiche E2-A a `validate-changed-reports.mjs` / parti condivise di matrice-hook-test. Nessun revert; diff E2-B additivo sugli stessi file condivisi dove necessario.

## 5. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| `npm run test:mss` | **exit 0** — 42 fixture + **55** gruppi (incluso `H13-E2 / unstaged — …`) |
| `npm run test:mss:tools` | **exit 0** — 65 test |
| `npm run validate:mss:all` | **exit 0** |
| `git diff --check` | **exit 0** |

## 6. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| nessuno | — | nessuna skill area app |

## 7. Dati comunicazione

- Mandato: prompt parent M-E2-B Opzione B (PLAN §P1.2).
- Divieti rispettati: no WP-1, no promozione H-1.3, no rewrite final, no `src/`, no commit/push, no tocco non necessario ai file E2-A dedicati.

## 8. Analisi flusso

SK-4 B2/B3 già coprivano Report/Verbale ricorsivi **quando staged** (e mismatch staged/worktree). Il buco era il file **solo** worktree. Il merge pre-commit chiude quel buco senza allargare a JSONL/fixture.

## 9. Lettura dell'agente

- **Sistema:** unstaged Report/Verbale non sono più fail-open silenzioso al commit.
- **Output:** deny misurabile + test nominato citabile in P1.
- **Persona:** nessuna decisione nuova.

## 10. Derivazione errori / buco residuo

| Residuo | Perché |
|---|---|
| JSONL/fixture unstaged | scope esplicito Report\|Verbale (SK-4 B2/B3) |
| `--no-verify` | feature Git; già coperto da E2-A CI |
| Cloud/light | E2-C / E2-D |

## 10-bis. Handoff

**Vero adesso:** M-E2-B consegnato; `H-1.3` resta `PASS_CON_RISERVE`.

**Prossimo:** M-E2-C (Cloud), M-E2-D (light), poi M-H13-PASS.

**Non riaprire:** WP-1, H-1.3 PASS in questo passo, revert E2-A.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: path e revisione/hash.
✅ R1: mandato inline parent M-E2-B; `PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md` §P1.2; `Report-h13-e2-bypass-t7-25-08-26.md` @ `ee86d2a`; `Report-e2-a-no-verify-25-08-26.md` (handoff, non riaperto); `COVERAGE_MATRIX_H1.json` @ working tree post-E2-A.

❓ Q2 — Dati = diff reale?
✅ R2: sì — git-adapter + fine-sessione-commit-check + husky + matrice + test; gate rieseguiti exit 0; H-1.3 non promosso.

❓ Q3 — Skill aggiornate?
✅ R3: sì — nessuna skill area; matrice è artefatto MSS.

❓ Q4 — Cosa NON hai fatto?
✅ R4: non chiuso JSONL unstaged/Cloud/light; non promosso H-1.3; non commit/push; non revertato E2-A; non toccato `src/`/DB.

❓ Q5 — Attrito + miglioria?
✅ R5: working tree già sporco da E2-A — lavorato in additivo; residuo naturale: fixture/JSONL unstaged.

❓ Q6 — Contesto & hook?
✅ R6: contesto corretto post E2-A PULITO; hook pre-commit esteso e provato dal test nominato.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0384c-2ed4-766d-8ae6-1cd48773d90e","correlation_id":"mss-cor-01a0384c-2ed4-7057-a6e9-d14897dfc350","segment_no":1,"created_at":"2026-08-25T11:41:51+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer","actor_type":"agente","role":"esecutore M-E2-B","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a0384c-2ed4-78a9-826b-b6d51575c2fd","capture_key":"mss-ses-01a0384c-2ed4-766d-8ae6-1cd48773d90e/1/session_event/1","event":{"event_id":"mss-evt-01a0384c-2ed4-7229-b87c-f910aa66bee6","event_kind":"session_close","occurred_at":"2026-08-25T11:41:51+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore M-E2-B","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD ee86d2a; 10 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-e2-b-unstaged-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-e2-b-unstaged-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"test:mss","criterio":"npm run test:mss (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"test:mss:tools","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"validate:mss:all","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"git-diff-check","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":".cursor/hooks/fine-sessione-commit-check.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"ee86d2a","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":".husky/pre-commit","stable_anchor_or_event_id":"working tree","revision_or_hash":"ee86d2a","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"ee86d2a","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"ee86d2a","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"scripts/mss/git-adapter.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"ee86d2a","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"scripts/mss/validate-changed-reports.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"ee86d2a","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0384c-2ed4-766d-8ae6-1cd48773d90e","correlation_id":"mss-cor-01a0384c-2ed4-7057-a6e9-d14897dfc350","segment_no":1,"created_at":"2026-08-25T11:41:51+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer","actor_type":"agente","role":"esecutore M-E2-B","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a0384c-2ed4-7a99-b121-8bce72bf43ca","capture_key":"mss-ses-01a0384c-2ed4-766d-8ae6-1cd48773d90e/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a0384c-2ed4-7eee-b3f5-7f40cdeda103","axis":"persona","subject_record_ids":["mss-rec-01a0384c-2ed4-78a9-826b-b6d51575c2fd"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer","role":"esecutore M-E2-B","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0384c-2ed4-766d-8ae6-1cd48773d90e","correlation_id":"mss-cor-01a0384c-2ed4-7057-a6e9-d14897dfc350","segment_no":1,"created_at":"2026-08-25T11:41:51+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer","actor_type":"agente","role":"esecutore M-E2-B","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a0384c-2ed4-7884-832f-7dbc6c04fe82","capture_key":"mss-ses-01a0384c-2ed4-766d-8ae6-1cd48773d90e/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a0384c-2ed4-795a-a2ae-ea50399c26df","axis":"sistema","subject_record_ids":["mss-rec-01a0384c-2ed4-78a9-826b-b6d51575c2fd"],"delta":"modificato","assertions":[{"rule_id_version":"H13-E2/M-E2-B@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato M-E2-B Opzione B: Report/Verbale MSS unstaged devono entrare nel gate pre-commit (SK-4 B2/B3)","decision_or_output_changed":"Pre-commit raccoglie Report/Verbale sporchi nel worktree ma non staged e li valida; deny misurabile con etichetta unstaged; matrice dichiara precommit_covers_unstaged_mss_reports; JSONL/fixture unstaged e --no-verify restano residui; H-1.3 resta PASS_CON_RISERVE","G":2,"O":1,"E":2}],"asserted_by":{"actor_id":"cursor-composer","role":"esecutore M-E2-B","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0384c-2ed4-766d-8ae6-1cd48773d90e","correlation_id":"mss-cor-01a0384c-2ed4-7057-a6e9-d14897dfc350","segment_no":1,"created_at":"2026-08-25T11:41:51+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer","actor_type":"agente","role":"esecutore M-E2-B","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a0384c-2ed4-7e60-904c-894cb03ba8dc","capture_key":"mss-ses-01a0384c-2ed4-766d-8ae6-1cd48773d90e/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a0384c-2ed4-77d0-9233-921d7d192804","axis":"output","subject_record_ids":["mss-rec-01a0384c-2ed4-78a9-826b-b6d51575c2fd"],"delta":"creato","assertions":[{"output_id":"report-e2-b-unstaged-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-e2-b-unstaged-25-08-26.md","recipient":"Matteo, orchestratore M-E2-B","problem_or_job":"chiudere bypass B-E2-UNST sui Report/Verbale non staged con deny misurabile","intended_use":"controverifica orchestratore §6 prima di commit","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md §P1.2 M-E2-B","authored_by":"cursor-composer-m-e2-b","verified_by":"non_osservato","acceptance_criterion":"test nominato H13-E2/unstaged verde; gate obbligatori exit 0; matrice aggiornata; H-1.3 non promosso; E2-A non revertato","verification_or_use_evidence":"npm run test:mss; test:mss:tools; validate:mss:all","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","privacy_release":"internal","support_files":["scripts/mss/git-adapter.mjs",".cursor/hooks/fine-sessione-commit-check.mjs",".husky/pre-commit","docs/MetaSkillSystem/tests/h1/run.mjs"],"relations_no_double_count":["Famiglia E2-B; coesiste additivo con E2-A unstaged; non chiude Cloud/light/--no-verify (E2-C/D/A residuo)"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer","role":"esecutore M-E2-B","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
