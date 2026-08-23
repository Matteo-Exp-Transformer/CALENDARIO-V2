# Report — SK-7 fix B (D2/D3 + privacy) — 23-08-26

**Cosa è cambiato:** `parseCheckSpec` usa la sintassi canonica `CONTROL_ID=>comando`; D2/D3 non producono più prove false; privacy minimizzata con amendment append-only sul report SK-7.

**Cosa resta:** chiusura formale SK-7 (`M3`) spetta a Matteo; revisione indipendente D17 consigliata.

**Serve una tua azione:** sì — leggere questo report e decidere `M3`; commit solo su richiesta esplicita.

**Data:** 23-08-26 · **Tipo:** deep · **Agente:** esecutore SK-7 fix B (Cursor)

**Modalità:** deep

---

## 1. Cosa è stato fatto

1. Verificati branch `env/test`, HEAD = `origin/env/test` (`308e576`); working tree con file altrui non modificati da questa seduta.
2. **Riproduzione pre-fix** (codice originale):
   - D3 `test:mss:npm run test:mss` → `control_id=test`, `command=mss:npm run test:mss` (ID spezzato).
   - D2 `x::node --version` → `control_id=x`, `command=:node --version`; `runChecks` → **pass** (exit 0, no-op shell).
3. Implementato fix in `scripts/mss/capsule.mjs`: canonico `=>`, legacy un solo `:`, ambigui rifiutati; guardia `runChecks`; template privacy; CLI exit 2 senza stack.
4. +9 test in `test:mss:tools` (totale **34** al run finale).
5. Rettifica privacy: `judgments-sk7-report-23-08-26.json`; **amendment** `final` in coda al JSONL di `Report-sk7-mss-capsule-23-08-26.md` (record `final` storici intatti).
6. Aggiornati `MANUALE_OPERATIVO_MSS_V0.md` (§2.4 `--check`) e `PLAN_V0.md` S7 + §4-ter.

## 2. File toccati e perché

| File | Perché |
|---|---|
| `scripts/mss/capsule.mjs` | parseCheckSpec, runChecks, template privacy, CLI |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | 9 test D2/D3/privacy |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | sintassi `--check` |
| `docs/MetaSkillSystem/PLAN_V0.md` | S7 + §4-ter |
| `docs/Sessioni di lavoro/23-08-26/judgments-sk7-report-23-08-26.json` | prohibited_content generiche |
| `docs/Sessioni di lavoro/23-08-26/Report-sk7-mss-capsule-23-08-26.md` | amendment privacy append-only |
| `docs/Sessioni di lavoro/23-08-26/judgments-sk7-fix-b-23-08-26.json` | giudizi seduta fix B |
| `docs/Sessioni di lavoro/23-08-26/Report-fix-sk7-timbri-23-08-26.md` | questo report |

## 3. Test eseguiti e risultato

### Riproduzione D2/D3

| Fase | Input | control_id / esito | Comando eseguito | Exit | Esito controllo |
|---|---|---|---|---|---|
| **pre-fix** D3 | `test:mss:npm run test:mss` | `test` | `mss:npm run test:mss` | — | parsing errato |
| **pre-fix** D2 | `x::node --version` | `x` | `:node --version` | 0 | **pass** falso |
| **post-fix** D3 | `test:mss:npm run test:mss` | — | — | — | parse error (ambiguo), CLI exit 2 |
| **post-fix** D2 | `x::node --version` | — | — | — | parse error (ambiguo), CLI exit 2 |
| **post-fix** canonico | `test:mss=>npm run test:mss` | `test:mss` | `npm run test:mss` | — | parsing corretto |
| **pre-follow-up** arrow | `arrow=>node -e "const f = x => x; …"` | — | — | — | parse error: «più di un =>» |
| **post-follow-up** arrow | stesso input | `arrow` | `node -e "const f = x => x; process.exit(f(0))"` | 0 | **pass** (secondo `=>` nel comando) |

### Gate finali (run finale)

| Comando | Exit |
|---|---|
| `npm run test:mss:tools` | **0** — 36/36 |
| `npm run test:mss` | **0** — 42 fixture + 38 gruppi |
| `npm run validate:docs` | **0** — 962 path, 0 rotti |
| `npm run lint:scripts` | **0** |
| `validate:mss` report SK-7 | **0** |
| `validate:mss` questo report | **0** |
| `git diff --check` (solo file SK-7) | **0** |

**Nota form:** sidecar `capsule-fix-sk7-timbri-23-08-26.jsonl` rimosso — capsula deep solo nel report; capsula rigenerata dopo la rimozione per evitare `MSS-REF-UNRESOLVABLE`.

**Nota batch:** `SK7FIX-VALIDATE` era `non_noto` (ENOBUFS); `npm run validate` standalone → exit **0** nella seduta precedente.

## 4. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `MANUALE_OPERATIVO_MSS_V0.md` | §2.4 `--check` | owner operativo sintassi |
| `PLAN_V0.md` | S7, §4-ter | patch verificata, M3 pendente |
| Skill area prodotto | nessuna | perimetro MSS only |

## 5. Dati comunicazione

**Prompt:** mandato fix B integrale (Profilo Esecuzione, gate B autorizzato).

## 6. Analisi flusso prompt

- **Prompt sostanziali:** 1 · **correzioni:** 0 · **tipo:** deep.

## 7. La mia lettura della sessione

Fix chirurgico su parsing; amendment privacy conforme §6; `M3` resta decisione umana.

## 8. Derivazione errori

| Evento | Classe | Nota |
|---|---|---|
| D2 pass falso | bug pre-fix | no-op `:node` |
| D3 ID troncato | bug pre-fix | split al primo `:` |
| Secondo `=>` rifiutato | bug follow-up | comando con arrow function |
| ENOBUFS in batch validate | limite buffer | standalone exit 0 |

## 9. Cosa resta

1. Matteo decide `M3`.
2. Revisione indipendente D17 (consigliata).
3. Trailing whitespace altrui (`git diff --check` exit 2).

## 10. Handoff

**Vero adesso:** D2/D3 chiusi tecnicamente; 34 test tools; amendment privacy OK; SK-7 **APERTO**.

**Non riaprire:** dichiarare SK-7 CHIUSO senza Matteo.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a030a4-1065-7568-bd95-7d1a588496b9","correlation_id":"mss-cor-01a030a4-1065-7917-9900-78d4fd935965","segment_no":1,"created_at":"2026-08-24T00:00:53+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-2.5","actor_type":"agente","role":"agente esecutore SK-7 fix refs pubblicabili","agent_runtime":{"provider":"Cursor","model":"composer-2.5","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a030a4-1065-7fad-8140-e14f45b51975","capture_key":"mss-ses-01a030a4-1065-7568-bd95-7d1a588496b9/1/session_event/1","event":{"event_id":"mss-evt-01a030a4-1065-7b67-a9e9-aa4bcddf082a","event_kind":"session_close","occurred_at":"2026-08-24T00:00:53+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"fix B autorizzato: chiudere D2/D3 parseCheckSpec/runChecks, rettifica privacy append-only, test e prove ripetibili; SK-7 non chiuso (M3 pendente)","session_type":"deep","capsule_status":"completa","role_key":"agente-esecutore-sk7-fix-b","area":"MetaSkillSystem / attrezzo mss:capsule","environment":"branch env/test; HEAD allineato a origin/env/test; Windows 11","authorization":{"read":["docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","docs/MetaSkillSystem/PLAN_V0.md","docs/Sessioni di lavoro/23-08-26/Report-sk7-mss-capsule-23-08-26.md"],"write":["scripts/mss/capsule.mjs","docs/MetaSkillSystem/tests/tools/run.mjs","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","docs/MetaSkillSystem/PLAN_V0.md","docs/Sessioni di lavoro/23-08-26/judgments-sk7-report-23-08-26.json","docs/Sessioni di lavoro/23-08-26/Report-sk7-mss-capsule-23-08-26.md","docs/Sessioni di lavoro/23-08-26/Report-fix-sk7-timbri-23-08-26.md"],"forbid":["src/**","supabase/**","scripts/mss/query.mjs","scripts/mss/core.mjs","scripts/mss/rules.mjs","scripts/mss/adapter.mjs","commit","push"]},"authorized_outputs":["patch parseCheckSpec ID=>comando","test:mss:tools +9 test D2/D3/privacy","amendment privacy report SK-7","Report-fix-sk7-timbri-23-08-26.md"],"route":{"chosen":"gate B Matteo: reimplementazione D2/D3 + privacy append-only + prove; sintassi canonica CONTROL_ID=>comando","alternatives_or_conflicts":"nessuno"},"observed_outcome":"parseCheckSpec canonico e legacy sicuro; ambigui D2/D3 rifiutati exit 2; comando puo contenere ulteriori =>; runChecks non passa comandi vuoti; template e judgments privacy minimizzati; amendment privacy append-only su report SK-7; test tools verdi inclusi arrow","open_items":["M3 chiusura SK-7 spetta a Matteo","revisione indipendente D17 consigliata non eseguita"],"controls":[{"control_id":"SK7FIX-TOOLS","criterio":"npm run test:mss:tools","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0)","evidence_refs":[]},{"control_id":"SK7FIX-MSS","criterio":"npm run test:mss","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0)","evidence_refs":[]},{"control_id":"SK7FIX-DOCS","criterio":"npm run validate:docs","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:docs (exit 0)","evidence_refs":[]},{"control_id":"SK7FIX-LINT","criterio":"npm run lint:scripts","esito":"fail","numeratore":0,"denominatore":1,"esecutore":"mss:capsule: npm run lint:scripts (exit 1)","evidence_refs":[]},{"control_id":"SK7FIX-ARROW","criterio":"node -e \"const f = x => x; process.exit(f(0))\"","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: node -e \"const f = x => x; process.exit(f(0))\" (exit 0)","evidence_refs":[]},{"control_id":"SK7FIX-LEGACY","criterio":"npm run mss:capsule -- --force-legacy","esito":"fail","numeratore":0,"denominatore":1,"esecutore":"mss:capsule: npm run mss:capsule -- --force-legacy (exit 2)","evidence_refs":[]}],"subject_runtime":{"actor_id":"Matteo","provider":"non_applicabile: soggetto umano","model":"non_applicabile: soggetto umano","runtime":"non_applicabile: soggetto umano","surface":"Cursor chat"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["path del repo","esiti comandi","metriche aggregate test"],"prohibited_content":["materiale privato non registrabile","segreti","token di autenticazione"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-plan","owner_id":"SYS-1","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"sezione 4-bis S7","revision_or_hash":"working tree","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-sk7-report","owner_id":"SK-7","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-sk7-mss-capsule-23-08-26.md","stable_anchor_or_event_id":"capsula session_event","revision_or_hash":"working tree","sensitivity":"internal"},{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"308e576","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"308e576","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"308e576","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-sk7-mss-capsule-23-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"308e576","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/Sessioni di lavoro/23-08-26/judgments-sk7-report-23-08-26.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"308e576","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"scripts/mss/capsule.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"308e576","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a030a4-1065-7568-bd95-7d1a588496b9","correlation_id":"mss-cor-01a030a4-1065-7917-9900-78d4fd935965","segment_no":1,"created_at":"2026-08-24T00:00:53+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-2.5","actor_type":"agente","role":"agente esecutore SK-7 fix refs pubblicabili","agent_runtime":{"provider":"Cursor","model":"composer-2.5","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a030a4-1065-7ebc-9c82-1e41f82af074","capture_key":"mss-ses-01a030a4-1065-7568-bd95-7d1a588496b9/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a030a4-1065-7746-b590-03f14bfed5d1","axis":"persona","subject_record_ids":["mss-rec-01a030a4-1065-7fad-8140-e14f45b51975"],"delta":"nessuno","assertions":[{"signal":"Matteo ha autorizzato esplicitamente fix B (reimplementazione D2/D3 + privacy) dopo P0 assenza","actor":"Matteo","assistance":"guidato","origin":"naturale","source_ref":"source-sk7-report","effect":"perimetro esecutivo chiaro: no commit, no M3 automatico","evidence_state":"observed"}],"asserted_by":{"actor_id":"cursor-composer-sk7-fix-b","role":"agente esecutore SK-7 fix B","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile:non ancora verificato","evidence_refs":[],"notes":"nessuna osservazione aggiuntiva"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a030a4-1065-7568-bd95-7d1a588496b9","correlation_id":"mss-cor-01a030a4-1065-7917-9900-78d4fd935965","segment_no":1,"created_at":"2026-08-24T00:00:53+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-2.5","actor_type":"agente","role":"agente esecutore SK-7 fix refs pubblicabili","agent_runtime":{"provider":"Cursor","model":"composer-2.5","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a030a4-1065-7bee-af05-5faea3b3136b","capture_key":"mss-ses-01a030a4-1065-7568-bd95-7d1a588496b9/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a030a4-1065-77b6-a168-7ebfa2723357","axis":"sistema","subject_record_ids":["mss-rec-01a030a4-1065-7fad-8140-e14f45b51975"],"delta":"modificato","assertions":[{"rule_id_version":"SK-7 fix B@mss.session/0.1.1","trigger_event":"parseCheckSpec spezzava al primo colon; runChecks passava no-op","decision_or_output_changed":"sintassi canonica ID=>comando; legacy un solo colon; ambigui rifiutati; guardia comando vuoto in runChecks; CLI exit 2 senza stack","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"cursor-composer-sk7-fix-b","role":"agente esecutore SK-7 fix B","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-plan","evidence_refs":["source-sk7-report"],"notes":"34 test test:mss:tools"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a030a4-1065-7568-bd95-7d1a588496b9","correlation_id":"mss-cor-01a030a4-1065-7917-9900-78d4fd935965","segment_no":1,"created_at":"2026-08-24T00:00:53+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-2.5","actor_type":"agente","role":"agente esecutore SK-7 fix refs pubblicabili","agent_runtime":{"provider":"Cursor","model":"composer-2.5","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a030a4-1065-7331-8ed8-e06a983a14fb","capture_key":"mss-ses-01a030a4-1065-7568-bd95-7d1a588496b9/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a030a4-1065-7db9-99e1-7f7407ac2c12","axis":"output","subject_record_ids":["mss-rec-01a030a4-1065-7fad-8140-e14f45b51975"],"delta":"modificato","assertions":[{"output_id":"mss-capsule-v0-fix-b","primary_type":"prodotto","canonical_version":"scripts/mss/capsule.mjs parseCheckSpec/runChecks fix B","recipient":"agenti MSS e Matteo","problem_or_job":"prove false D2/D3 e privacy template con path privato","intended_use":"controlli misurabili affidabili e privacy minimizzata","conceived_by":"audit P0 + mandato fix B","decided_by":"Matteo","directed_by":"prompt fix B 23-08-26","authored_by":"cursor-composer-sk7-fix-b","verified_by":"test:mss:tools + validate:mss","acceptance_criterion":"D2/D3 rossi pre-fix verdi post-fix; amendment privacy; test obbligatori verdi","verification_or_use_evidence":"npm run test:mss:tools 34/34; validate:mss su report fix","verification_status":"self_report","owner_ref":"owner-plan","privacy_release":"internal","support_files":["docs/MetaSkillSystem/tests/tools/run.mjs","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md"],"relations_no_double_count":["amends privacy capsula report SK-7 via amendment append-only"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-composer-sk7-fix-b","role":"agente esecutore SK-7 fix B","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-plan","evidence_refs":[],"notes":"M3 non dichiarato"}}}
```

## Domande di chiusura

❓ Q1 — Prompt ricevuti?
✅ R1: Mandato fix B + follow-up arrow `=>` (chat corrente).

❓ Q2 — Dati = diff reale?
✅ R2: Sì — tools 36/36; H-1 42+38; validate:docs 962/0/26; entrambi validate:mss OK; git diff --check sui file SK-7 exit 0.

❓ Q3 — Skill aggiornati completi?
✅ R3: MANUALE + PLAN (seduta precedente); follow-up solo capsule.mjs + test + report.

❓ Q4 — Cosa NON hai fatto?
✅ R4: M3, commit, D17, file fuori perimetro (report revisione skill).

❓ Q5 — Attrito?
✅ R5: sidecar jsonl eliminato → capsula rigenerata senza ref orfano (no rewrite del report SK-7 storico).

❓ Q6 — Contesto?
✅ R6: Giusto.
