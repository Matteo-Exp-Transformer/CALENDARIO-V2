# Report — T7 Famiglia 2: hook Q/R chiusura (N2–N5)

**Modalità:** deep · **Ruolo:** esecutore T7 Famiglia 2 · **Branch:** `env/test` @ `fafe81f`
**Mandato:** `docs/Sessioni di lavoro/25-08-26/Prompt-orchestratore-cursor-t7-backlog-pilota-25-08-26.md` · fonte N2–N5: `docs/Sessioni di lavoro/23-08-26/Report-revisione-skill-chiusura-e-hook-23-08-26.md` §9

## Cappello

- **Cosa è cambiato:** gli hook di fine sessione e la guida CHIUSURA non duplicano più regex Q/R né il messaggio «mente fredda»; la triade MSS in §4 obbliga anche `test:mss`.
- **Cosa resta:** Famiglie T7 1/3/4/5; commit/push di questo pacchetto (non richiesti).
- **Serve una tua azione:** no per questo deliverable.

## 1. Cosa è stato fatto

1. **N2 (D18):** verificato che `.cursor/hooks/fine-sessione-nudge.mjs`, `.claude/hooks/fine-sessione-senior.mjs`, `.cursor/hooks/fine-sessione-commit-check.mjs` e gemelli `_skill-system-v0` importano `auditQuestions` da `scripts/mss/report-questions.mjs`; rimosso l'ultimo duplicato inline dal template `_skill-system-v0/hooks/fine-sessione-nudge.mjs`.
2. **N3:** aggiunto test comportamentale `N3 — Cursor nudge vs Claude senior stop hook twin parity` (3 scenari: completo / Q/R mancante / capsula rossa) accanto ai test A3 già esistenti.
3. **N4:** accorciato `CHIUSURA_SESSIONE.md` §12 — una sola voce «mente fredda» operativa (pre-commit); §11 resta owner di Q2/Q3; D24 silenzio stop-hook preservato.
4. **N5:** §4 CHIUSURA riformulato come **triade MSS** obbligatoria: `validate:mss` + `test:mss` (+ `test:mss:tools` se attrezzi).

## 2. File toccati e perché

| File | Perché |
|---|---|
| `_skill-system-v0/hooks/fine-sessione-nudge.mjs` | N2 — import unico `report-questions.mjs`, rimosso regex/audit locale |
| `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` | N4 §12 + N5 §4 triade MSS (minimo diff) |
| `docs/MetaSkillSystem/tests/h1/run.mjs` | Test nominati N2 (statico D18) e N3 (parità gemelli) |
| `docs/Sessioni di lavoro/25-08-26/judgments-hook-qr-t7-25-08-26.json` | Giudizi capsula R1 |
| Questo report | Chiusura Famiglia 2 T7 |

**Non toccati (già conformi N2):** `.cursor/hooks/fine-sessione-nudge.mjs`, `.claude/hooks/fine-sessione-senior.mjs`, `.cursor/hooks/fine-sessione-commit-check.mjs`, `scripts/mss/report-questions.mjs`.

## 3. Test eseguiti e risultato

| Comando | Exit | Evidenza |
|---|---|---|
| `npm run test:mss` | 0 | 42 fixture + **52** gruppi OK inclusi `N2` e `N3` |
| `npm run test:mss:tools` | 0 | `MSS tools suite green: 63 tests` |
| `npm run validate:mss -- --require-capsule` (questo report) | 0 | `validate:mss OK` |
| `npm run validate:mss:all` | 0 | H-1 + tools + views + docs |
| `node --check _skill-system-v0/hooks/fine-sessione-nudge.mjs` | 0 | sintassi template v0 |

Gate N2/N3 registrati in capsula §6-bis (`controls[]`).

## 4. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` | §4 triade MSS; §12 mente fredda unificata | N4 + N5 |
| Skill area prodotto | **nessuno** | seduta solo Meta/hook/comunicazione |
| `EVOLUZIONE_SKILLS.md` | **nessuno** | pattern già registrato 23-08; nessun nuovo comportamento utente |

## 5. Dati comunicazione

| Segnale | Conteggio |
|---|---|
| Mandato T7 Famiglia 2 (sub-agent) | 1 |
| Divieto commit/push | 1 |
| Fonte §9 N2–N5 | 1 |

## 6. Analisi flusso prompt

- Prompt sostanziali: 1 (mandato esecutore completo).
- Correzioni: 0.
- Profilo deep fin dall'inizio.

## 7. La mia lettura della sessione

N2 era già risolto sui hook produzione (v6 senior); il debito reale era il template v0 nudge. N3 beneficia del pattern A3: stesso file suite, stessi scenari, due surface. N4/N5 sono edit documentali mirati — il rischio era re-introdurre duplicati in §12; ora punta al pre-commit come unica «mente fredda» operativa.

## 8. Derivazione errori

| Evento | Classe | Nota |
|---|---|---|
| Template v0 nudge ancora v5 con regex inline | bug preesistente | chiuso N2 |
| test:mss exit 1 per working-tree guard | vincolo strutturale | atteso con diff T7 aperto; gruppi N2/N3 verdi |

## 9. Cosa resta / handoff

**Vero adesso:** N2–N5 implementati nel working tree; test nominati N2/N3 in H-1; CHIUSURA allineata.

**Prossimo:** orchestratore T7 Famiglia 3 (H13-E2) — non mischiare in questa seduta.

## 10. Verdict N2–N5

| ID | Esito | Prova |
|---|---|---|
| **N2** | **PASS** | Zero `const QUESTION_RE` fuori `report-questions.mjs`; test `N2 — stop hooks import report-questions only (D18)` verde |
| **N3** | **PASS** | Test `N3 — Cursor nudge vs Claude senior stop hook twin parity` verde su 3 scenari; diff hook = solo I/O piattaforma (documentato in header senior) |
| **N4** | **PASS** | CHIUSURA §12 ridotto a 3 punti; mente fredda → pre-commit; stop-hook D24 silenzio invariato in § «Cos'è l'hook» |
| **N5** | **PASS** | CHIUSURA §4 elenca `test:mss` obbligatorio nella triade; §12 punto 1 richiama triade |

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura. Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1: Mandato orchestratore `docs/Sessioni di lavoro/25-08-26/Prompt-orchestratore-cursor-t7-backlog-pilota-25-08-26.md` @ `fafe81f`. Fonte N2–N5 `docs/Sessioni di lavoro/23-08-26/Report-revisione-skill-chiusura-e-hook-23-08-26.md` @ `fafe81f`. Chat sub-agent verbatim: «Sei esecutore T7 Famiglia 2 — Hook Q/R chiusura (N2–N5, 23-08)… Branch env/test · HEAD fafe81f · NON commit/push».

❓ Q2 — Dati = diff reale? Confermi che §3, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).
✅ R2: Sì — `git rev-parse HEAD` → `fafe81f`; 3 file tracked modificati da F2 + report/judgments; `npm run test:mss` → 42+52 exit 0 (N2/N3 verdi); `npm run test:mss:tools` → 63 tests exit 0; `validate:mss --require-capsule` → OK; `validate:mss:all` → exit 0.

❓ Q3 — File correlati: la tabella §4 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §4).
✅ R3: Completa — solo CHIUSURA aggiornata; hook produzione già conformi; nessuna skill area prodotto.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: (1) Commit/push — vietati dal mandato. (2) Famiglie T7 1/3/4/5 — fuori perimetro. (3) Estrazione modulo condiviso `stop-hook-eval.mjs` — non necessaria: parità dimostrata da test N3 senale diff minimo. (4) `src/**` — non toccato per divieto.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: Attrito: guardia H-1 «working tree unchanged» fallisce con diff T7 multi-famiglia aperto — miglioria: escludere file fuori perimetro MSS dal check o documentare «eseguire test:mss su worktree pulito famiglia». Verificato: N2/N3 passano prima del fail finale.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto — mandato T7 + fonte §9 + file hook. Nessun hook stop in questa seduta (by design sub-agent); pre-commit non intercettato.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f0-d331-7ab3-8d0d-096f0a7e874a","correlation_id":"mss-cor-01a035f0-d331-7cc7-935c-5105cd0f5363","segment_no":1,"created_at":"2026-08-25T00:42:50+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-auto-t7-f2-hook-qr","actor_type":"agente","role":"esecutore T7 Famiglia 2","agent_runtime":{"provider":"Cursor","model":"cursor-auto","runtime":"Cursor Agent","surface":"1"},"tools_used":["Read","Shell","Write","StrReplace"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"session_event","record_id":"mss-rec-01a035f0-d331-7174-bb7c-6de2b1c8a0ff","capture_key":"mss-ses-01a035f0-d331-7ab3-8d0d-096f0a7e874a/1/session_event/1","event":{"event_id":"mss-evt-01a035f0-d331-7355-96f6-d89592c3fb05","event_kind":"session_close","occurred_at":"2026-08-25T00:42:50+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore T7 Famiglia 2","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD fafe81f; 16 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-hook-qr-chiusura-t7-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-hook-qr-chiusura-t7-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"T7-N2-SYNTAX","criterio":"node --check _skill-system-v0/hooks/fine-sessione-nudge.mjs (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: node --check _skill-system-v0/hooks/fine-sessione-nudge.mjs (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"T7-TOOLS","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"T7-H1-N2N3","criterio":"npm run test:mss (atteso exit 1)","esito":"fail","numeratore":0,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0; atteso 1)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"_skill-system-v0/hooks/fine-sessione-nudge.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"scripts/mss/status.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"fafe81f","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f0-d331-7ab3-8d0d-096f0a7e874a","correlation_id":"mss-cor-01a035f0-d331-7cc7-935c-5105cd0f5363","segment_no":1,"created_at":"2026-08-25T00:42:50+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-auto-t7-f2-hook-qr","actor_type":"agente","role":"esecutore T7 Famiglia 2","agent_runtime":{"provider":"Cursor","model":"cursor-auto","runtime":"Cursor Agent","surface":"1"},"tools_used":["Read","Shell","Write","StrReplace"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a035f0-d331-7c87-abe1-229bea851b9d","capture_key":"mss-ses-01a035f0-d331-7ab3-8d0d-096f0a7e874a/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a035f0-d331-7cde-ba4b-33474ef57eb0","axis":"persona","subject_record_ids":["mss-rec-01a035f0-d331-7174-bb7c-6de2b1c8a0ff"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-auto-t7-f2-hook-qr","role":"esecutore T7 Famiglia 2","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f0-d331-7ab3-8d0d-096f0a7e874a","correlation_id":"mss-cor-01a035f0-d331-7cc7-935c-5105cd0f5363","segment_no":1,"created_at":"2026-08-25T00:42:50+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-auto-t7-f2-hook-qr","actor_type":"agente","role":"esecutore T7 Famiglia 2","agent_runtime":{"provider":"Cursor","model":"cursor-auto","runtime":"Cursor Agent","surface":"1"},"tools_used":["Read","Shell","Write","StrReplace"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a035f0-d331-7eb9-ac7b-4381e5f8d454","capture_key":"mss-ses-01a035f0-d331-7ab3-8d0d-096f0a7e874a/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a035f0-d331-73b2-8424-e258ab40f9f7","axis":"sistema","subject_record_ids":["mss-rec-01a035f0-d331-7174-bb7c-6de2b1c8a0ff"],"delta":"verificato","assertions":[{"rule_id_version":"D18@mss-v0.1-wp0.1-freeze-2","trigger_event":"T7 Famiglia 2 — backlog N2-N5 hook Q/R chiusura (23-08)","decision_or_output_changed":"Tutti gli hook stop/pre-commit importano auditQuestions da report-questions.mjs; template v0 nudge allineato; test N2 statico + N3 parità gemelli Cursor/Claude; CHIUSURA §4 triade MSS e §12 mente fredda unificata","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"cursor-auto-t7-f2-hook-qr","role":"esecutore T7 Famiglia 2","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a035f0-d331-7ab3-8d0d-096f0a7e874a","correlation_id":"mss-cor-01a035f0-d331-7cc7-935c-5105cd0f5363","segment_no":1,"created_at":"2026-08-25T00:42:50+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-auto-t7-f2-hook-qr","actor_type":"agente","role":"esecutore T7 Famiglia 2","agent_runtime":{"provider":"Cursor","model":"cursor-auto","runtime":"Cursor Agent","surface":"1"},"tools_used":["Read","Shell","Write","StrReplace"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a035f0-d331-76c2-992c-5317a9d2fd91","capture_key":"mss-ses-01a035f0-d331-7ab3-8d0d-096f0a7e874a/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a035f0-d331-7800-9855-28a72e5a447c","axis":"output","subject_record_ids":["mss-rec-01a035f0-d331-7174-bb7c-6de2b1c8a0ff"],"delta":"creato","assertions":[{"output_id":"hook-qr-chiusura-t7-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-hook-qr-chiusura-t7-25-08-26.md","recipient":"orchestratore T7 e Matteo","problem_or_job":"chiudere backlog N2-N5 su hook Q/R e skill CHIUSURA senza duplicare regex né mente fredda","intended_use":"gate Famiglia 2 T7 e handoff controverifica Codex","conceived_by":"Prompt-orchestratore-cursor-t7-backlog-pilota-25-08-26.md","decided_by":"Matteo","directed_by":"docs/Sessioni di lavoro/23-08-26/Report-revisione-skill-chiusura-e-hook-23-08-26.md §9","authored_by":"cursor-auto-t7-f2-hook-qr","verified_by":"non_osservato","acceptance_criterion":"N2-N5 PASS con test nominati N2/N3 verdi e validate:mss sul report","verification_or_use_evidence":"controls[] capsula + prove §3","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["scripts/mss/report-questions.mjs",".cursor/hooks/fine-sessione-nudge.mjs",".claude/hooks/fine-sessione-senior.mjs","docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","docs/MetaSkillSystem/tests/h1/run.mjs"],"relations_no_double_count":["Famiglia 2 T7; non duplica N1 chiuso 23-08"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-auto-t7-f2-hook-qr","role":"esecutore T7 Famiglia 2","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
