# Chiusura residui T13 — lavagna + Q-B + Q-C — 25-08-2026

**Modalità:** standard · **Profilo:** Meta · **Branch:** `env/test`
**HEAD:** `db17841` (T11+T12 già su `origin`) · **Working tree:** atti T13 non committati

## 1. Cappello

- **Cosa è cambiato:** la lavagna non mette più i piloti (WP-1) tra le cose fatte; i controlli vuoti tipo `pwd`/`whoami`/`node --version` non passano più per sbaglio; si può verificare una singola asserzione Output anche quando ce ne sono più di una; il piano non chiede più «commit T11+T12».
- **Cosa resta:** niente sui tre residui. Pilota solo se lo riapri tu in un’altra chat. Commit/push di questi atti solo se dici Sì.
- **Serve una tua azione:** sì — commit/push se vuoi pubblicare T13; niente pilota finché non riapri D27.

## 2. Cosa è stato fatto

1. **Lavagna:** `classifyPlanState` tratta `NON INIZIATO` / `BLOCCATO` / `NO-GO` prima della parola `PASS` in prosa. WP-1 torna in «Da fare». Test nominato verde; cruscotto rigenerato.
2. **Controlli vuoti (ex Q-B):** denylist N4 estesa (`pwd`, `whoami`, `git rev-parse…`, `node`/`npm --version`, `exit 0`, `ls`/`dir`, …). Deny exit 2, zero scrittura; `--check-expect` ≠ 0 resta ok. MANUALE §2.4 + test.
3. **Verify multi-asserzione (ex Q-C):** flag `--verify-assertion-index <n>` subito dopo `--verify`. Patch append-only sull’indice scelto; fuori range → deny chiaro. MANUALE §2.4 + test.
4. **Prosa / gate:** PLAN §15 ciclo T13 CHIUSO; Decisioni-T12 aggiornate (Q-B/Q-C riaperti e chiusi); viste generate; prossimo `T14` senza debiti Q-B/Q-C e senza «commit T11+T12».

## 3. File toccati e perché

| File | Perché |
|---|---|
| `scripts/mss/plan-parse.mjs` | fix classificazione lavagna |
| `scripts/mss/capsule.mjs` | denylist + `--verify-assertion-index` |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | test A/B/C + allineo fixture/`SK-2` live |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | §2.4 Q-B/Q-C |
| `docs/MetaSkillSystem/PLAN_V0.md` | §15 T13 + header |
| `docs/Sessioni di lavoro/25-08-26/Decisioni-T12-QABC-25-08-26.md` | riapertura Q-B/Q-C |
| viste generate (cruscotto, HANDOFF, ROADMAP, indice) | `generate:mss:views` |
| questo report + judgments | chiusura |

**Non toccati:** `src/`, pilota WP-1/D27, validator core (non allentato).

## 4. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| Test `T13 / lavagna — WP-1…` | **OK** |
| Test `T13 / Q-B — denylist N4 estesa…` | **OK** |
| Test `T13 / Q-C — --verify-assertion-index…` | **OK** |
| `npm run test:mss:tools` | **exit 0** (73) |
| `npm run validate:mss:all` | **exit 0** |
| `npm run mss:status` | ultimo `T13` → prossimo `T14`; senza debiti Q-B/Q-C; senza «commit T11+T12» |
| Cruscotto | WP-1 in colonna **Da fare** (non Fatte) |
| `validate:mss` su questo report `--require-capsule` | **exit 0** |

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `MANUALE_OPERATIVO_MSS_V0.md` | denylist estesa + verify multi-indice | agente freddo |
| `PLAN_V0.md` | ciclo T13 / prossimo T14 | owner stato |
| `Decisioni-T12-QABC-25-08-26.md` | Q-B/Q-C riaperti chiusi | traccia decisioni |
| viste generate | lavagna + gate | anti-stale |
| skill prodotto | nessuno | fuori area |

## 6. Dati comunicazione

- Mandato Meta T13 (chat): tre chiusure A/B/C/D; «procedi» dopo Ask mode.
- Frasi chiave Matteo: chiudere davvero i residui; Q-B/Q-C ora autorizzati; pilota NO-GO.
- Formato che ha funzionato: ordine A→B→C→D; gate nominati prima della prosa «chiuso».

## 7. Analisi flusso prompt

- Prompt sostanziali: 2 (mandato completo + «procedi»).
- Correzioni dopo 1ª risposta: 0 sul merito (solo sblocco Ask→Agent).
- Profondità seduta: standard (dichiarata in testa).

## 8. Lettura della sessione

- **Sistema:** tre residui tecnici chiusi con prove; niente «procedi e lascia debiti».
- **Output:** attrezzi + manuale + piano allineati; cruscotto leggibile.
- **Persona:** Matteo ha riaperto Q-B/Q-C e li ha chiusi in esecuzione.

## 9. Cosa resta

- Commit/push atti T13: solo con Sì.
- Pilota / D27 / WP-1: **NO-GO** finché non riapri in chat dedicata.
- Residui aperti sui tre punti del mandato: **nessuno**.

## 10-bis. Handoff

**Vero adesso:** T13 CHIUSO sul working tree @ HEAD `db17841`; lavagna corretta; denylist estesa; verify multi-indice; prosa senza «commit T11+T12» e senza debiti Q-B/Q-C.

**Prossimo:** `T14` — P3/D27/WP-1 solo con riapertura verbatim; commit T13 solo con sì Matteo. Pilota solo se Matteo lo riapre in altra chat.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica path e revisione o hash al momento della lettura. Per i messaggi di Matteo non contenuti in un file del repo, riportali verbatim.
✅ R1:
- Mandato Meta T13 (messaggio chat, non in file): profilo Meta; skill METASKILL→MANUALE→PLAN §4/§4-bis/§15→CONTRATTO→CHIUSURA; tre chiusure A lavagna / B denylist / C verify-index / D prosa; gate nominati; report `Report-chiusura-residui-t13-25-08-26.md`; no pilota/src/commit senza Sì.
- Decisione Matteo (verbatim nel mandato): «Chiudere DAVVERO i tre residui post-T12. Vietato rispondere «procedi e lascia debiti». A T12 Q-B/Q-C erano No: ORA sono autorizzati come lavoro da completare. Pilota (D27/WP-1) = FUORI: resta NO-GO.»
- Secondo messaggio: «procedi» (dopo blocco Ask mode).
- Owner letti @ HEAD `db17841`: `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md`, `MANUALE_OPERATIVO_MSS_V0.md`, `PLAN_V0.md`, `CONTRATTO_CAPSULA_SESSIONE_V0.md`, `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md`.

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (controls[]) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza.
✅ R2: sì — `test:mss:tools` 73 OK; `validate:mss:all` exit 0; `mss:status` T13→T14; cruscotto WP-1 in Da fare; diff su `plan-parse.mjs` / `capsule.mjs` / PLAN / MANUALE / viste / test / Decisioni; HEAD `db17841`.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca.
✅ R3: sì — MANUALE + PLAN + Decisioni + viste; nessuna skill prodotto da allineare.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: no commit/push; no pilota/WP-1/D27; no `src/`; no allentamento validator.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: denylist su `node`/`npm --version` ha rotto due fixture storiche — fixato sostituendo i comandi nei test. Miglioria: quando si estende la denylist, cercare subito i `--check` di fixture che usano gli stessi pattern.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: contesto Meta / MANUALE / PLAN giusto (niente corpus, niente src); hook commit non esercitato (no commit).
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0398d-1f50-776e-ae11-d5114d22922f","correlation_id":"mss-cor-01a0398d-1f50-7b3d-aed6-cbba627d464a","segment_no":1,"created_at":"2026-08-25T17:32:25+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t13-residui","actor_type":"agente","role":"esecutore Meta T13 residui","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"session_event","record_id":"mss-rec-01a0398d-1f50-7004-bb09-e3d26f73a80d","capture_key":"mss-ses-01a0398d-1f50-776e-ae11-d5114d22922f/1/session_event/1","event":{"event_id":"mss-evt-01a0398d-1f50-75c3-a29b-f19f24aa005c","event_kind":"session_close","occurred_at":"2026-08-25T17:32:25+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore Meta T13 residui","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD db17841; 20 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-chiusura-residui-t13-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-chiusura-residui-t13-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"TOOLS","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"VALIDATE-ALL","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":".claude/CLAUDE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"AGENTS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/COMUNICAZIONE_UTENTE_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/OSSERVAZIONI.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/PROPOSTE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-11","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-12","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-13","owner_id":"git-working-tree","uri_or_path":"docs/Sessioni di lavoro/25-08-26/Decisioni-T12-QABC-25-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-14","owner_id":"git-working-tree","uri_or_path":"scripts/mss/capsule.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"},{"ref_id":"source-git-15","owner_id":"git-working-tree","uri_or_path":"scripts/mss/plan-parse.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"db17841","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0398d-1f50-776e-ae11-d5114d22922f","correlation_id":"mss-cor-01a0398d-1f50-7b3d-aed6-cbba627d464a","segment_no":1,"created_at":"2026-08-25T17:32:25+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t13-residui","actor_type":"agente","role":"esecutore Meta T13 residui","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a0398d-1f50-7d29-9734-d6b0862bfe43","capture_key":"mss-ses-01a0398d-1f50-776e-ae11-d5114d22922f/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a0398d-1f50-71e2-a16a-46b5d7f84abe","axis":"persona","subject_record_ids":["mss-rec-01a0398d-1f50-7004-bb09-e3d26f73a80d"],"delta":"modificato","assertions":[{"signal":"Matteo ha riaperto Q-B e Q-C (No in T12) e ha ordinato di chiuderli in esecuzione insieme al bug lavagna, vietando «procedi e lascia debiti»; pilota resta NO-GO","actor":"Matteo","assistance":"spontaneo","origin":"naturale","source_ref":"docs/Sessioni di lavoro/25-08-26/Decisioni-T12-QABC-25-08-26.md","effect":"autorizzazione esecuzione M-N4-EXTEND e M-VERIFY-MULTI in T13; nessuna promozione Persona oltre la decisione operativa","evidence_state":"observed"}],"asserted_by":{"actor_id":"cursor-composer-t13-residui","role":"esecutore Meta T13 residui","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0398d-1f50-776e-ae11-d5114d22922f","correlation_id":"mss-cor-01a0398d-1f50-7b3d-aed6-cbba627d464a","segment_no":1,"created_at":"2026-08-25T17:32:25+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t13-residui","actor_type":"agente","role":"esecutore Meta T13 residui","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a0398d-1f50-7e66-80e3-8546e2d7f923","capture_key":"mss-ses-01a0398d-1f50-776e-ae11-d5114d22922f/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a0398d-1f50-7870-aee6-8208f6cf4f33","axis":"sistema","subject_record_ids":["mss-rec-01a0398d-1f50-7004-bb09-e3d26f73a80d"],"delta":"modificato","assertions":[{"rule_id_version":"T13-LAVAGNA-QB-QC@mss-v0.1-wp0.1-freeze-2","trigger_event":"Chiusura residui post-T12: lavagna + denylist + verify-index","decision_or_output_changed":"classifyPlanState: NON INIZIATO/BLOCCATO/NO-GO prima di PASS; denylist N4 estesa; --verify-assertion-index per Output multi; PLAN T13 CHIUSO → T14","G":2,"O":1,"E":2}],"asserted_by":{"actor_id":"cursor-composer-t13-residui","role":"esecutore Meta T13 residui","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0398d-1f50-776e-ae11-d5114d22922f","correlation_id":"mss-cor-01a0398d-1f50-7b3d-aed6-cbba627d464a","segment_no":1,"created_at":"2026-08-25T17:32:25+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-t13-residui","actor_type":"agente","role":"esecutore Meta T13 residui","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a0398d-1f50-7496-b4c0-2bd96c22ed3c","capture_key":"mss-ses-01a0398d-1f50-776e-ae11-d5114d22922f/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a0398d-1f50-7d9c-af87-6894192ac007","axis":"output","subject_record_ids":["mss-rec-01a0398d-1f50-7004-bb09-e3d26f73a80d"],"delta":"creato","assertions":[{"output_id":"report-chiusura-residui-t13-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-chiusura-residui-t13-25-08-26.md","recipient":"Matteo","problem_or_job":"chiudere davvero i tre residui post-T12 senza lasciare debiti","intended_use":"base per T14 / commit T13 con sì; non apre pilota","conceived_by":"Matteo","decided_by":"Matteo (riapertura Q-B/Q-C + procedi)","directed_by":"Mandato Meta T13 chat 25-08-26","authored_by":"cursor-composer-t13-residui","verified_by":"non_osservato","acceptance_criterion":"test T13 A/B/C verdi; test:mss:tools 0; validate:mss:all 0; mss:status T13→T14 senza debiti Q-B/Q-C né commit T11+T12; WP-1 non in Fatte","verification_or_use_evidence":"npm run test:mss:tools; npm run validate:mss:all; npm run mss:status; cruscotto WP-1 in Da fare","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["scripts/mss/plan-parse.mjs","scripts/mss/capsule.mjs","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","docs/MetaSkillSystem/tests/tools/run.mjs","docs/Sessioni di lavoro/25-08-26/Decisioni-T12-QABC-25-08-26.md"],"relations_no_double_count":["Chiude debiti T12 Q-B/Q-C + bug lavagna; non apre WP-1/D27; non tocca src/"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer-t13-residui","role":"esecutore Meta T13 residui","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
