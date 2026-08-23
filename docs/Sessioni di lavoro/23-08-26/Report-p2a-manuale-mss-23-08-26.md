# Report — P2A MSS: manuale operativo discovery — 23-08-26

**Cosa è cambiato:** un agente freddo trova subito comandi, flussi e limiti MSS in un manuale unico, collegato dall’ingresso MetaSkillSystem.

**Cosa resta:** P2B export/bootstrap; gate A/B SK-7; hook Claude e guard PROD; generatore viste D14.

**Serve una tua azione:** no per P2A; sì per SK-7 quando vorrai A o B; sì per P2B quando apri export.

**Data:** 23-08-26 · **Tipo:** deep · **Modalità:** deep

---

## 1. Cosa è stato fatto

1. Verificato Git: branch `env/test`, HEAD `46b8bca` = `origin/env/test`, working tree con modifiche preesistenti preservate.
2. Letto integralmente METASKILL, PLAN §4-bis/§4-ter/§15/§16, AUDIT, contratto capsula, report P1, CHIUSURA §11.
3. Creato [`MANUALE_OPERATIVO_MSS_V0.md`](../MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md): ingresso file, comandi, flussi light/standard/revisione, validazione, limiti, owner vs viste, confine P2A/P2B.
4. Aggiornati puntatori minimi: METASKILL (sezione agente freddo), PLAN §4-bis `SK-10` + §15, AUDIT priorità P2, ROADMAP/HANDOFF (viste, senza conteggi mobili).
5. **Non toccato:** motore export, `mss:move`, SK-7/capsule.mjs, hook Claude, guard PROD, commit/push.

## 2. File toccati

| File | Perché |
|---|---|
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | deliverable P2A |
| `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` | ingresso agente freddo + rimando §2 manuale |
| `docs/MetaSkillSystem/PLAN_V0.md` | owner SK-10 P2A + §15 P2A/P2B |
| `docs/MetaSkillSystem/AUDIT_STATO_REALE_23-08-26.md` | vista priorità P2 |
| `Senior-Eval-Pack/ROADMAP_V0.md` | vista SK-10 + ordine P2A/P2B |
| `Senior-Eval-Pack/HANDOFF_SENIOR_V0.md` | istantanea P2A |
| Report + capsula | chiusura |

## 3. Test eseguiti

| Comando | Exit | Evidenza breve |
|---|---|---|
| `npm run mss:status` | 0 | SK-10 **IN CORSO — P2A manuale locale** (derivato da PLAN post-edit) |
| `npm run mss:query -- --verifica` | 0 | 69 file capsula · 68 sedute · grezzo/effettivo amendment visibile |
| `npm run validate:docs` | 0 | 946 path · 0 rotti |
| `npm run test:mss` | 0 | 42 fixture + 38 gruppi |
| `npm run test:mss:tools` | 0 | 25 test |
| `git diff --check` | 0 | solo warning CRLF preesistenti ROADMAP/HANDOFF |
| `validate:mss` report | 0 | `validate:mss OK` con `--require-capsule` |

Conteggi mobili al run: query **68 sedute**, **204** annotazioni; non congelati nel manuale.

## 4. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `METASKILL_SYSTEM_SKILL.md` | sezione agente freddo + rimando manuale | discovery P2A |
| `PLAN_V0.md` | SK-10 + §15 | owner unico |
| `AUDIT/ROADMAP/HANDOFF` | puntatori P2A | viste allineate al plan |
| Skill area prodotto | nessuno | nessun `src/` |

## 5. Dati comunicazione

Mandato unico inline (chat 23-08-26): profilo Meta deep, P2A manuale locale, divieti export/SK-7/commit, verifiche obbligatorie, Q/R §11 verbatim.

## 6. Analisi flusso

Prompt sostanziali: 1 · correzioni: 0 · mandato auto-contenuto con obiettivo e vincoli espliciti.

## 7. La mia lettura

P2A riduce il costo di ingresso: prima servivano METASKILL + PLAN + AUDIT + CHIUSURA per orientarsi; ora un freddo Meta apre manuale → status → §15. Il rischio resta copiare numeri nelle viste: il manuale li rimanda ai comandi by design.

## 8. Derivazione errori

| Evento | Classe | Nota |
|---|---|---|
| HANDOFF con istantanee sovrapposte post-P1/post-P0 | vincolo strutturale | handoff append-only; istantanea P2A in cima |

## 9. Cosa resta

P2B export/bootstrap; gate A/B SK-7; P3 viste/`mss:move`; P4 hook Claude + guard PROD.

## 10. Handoff

**Vero adesso:** P2A consegnato — manuale + puntatori; `SK-10` IN CORSO P2A; HEAD base `46b8bca` + WT P1+P2A; D2/D3 vivi; WP-1 NO-GO; nessun tag ripristino.

**Prossimo:** P2B export motore + checklist bootstrap repo nuova; parallelamente gate Matteo A/B su SK-7 se prioritario.

**Non riaprire:** dichiarare `SK-10`/`R8` chiusi; bootstrap provato senza P2B; reimplementazione D2/D3 silenziosa.

## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0312a-d633-77a7-8102-230699dd8467","correlation_id":"mss-cor-01a0312a-d633-7e13-9646-e111ecad52b3","segment_no":1,"created_at":"2026-08-23T23:15:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-2.5","actor_type":"agente","role":"agente esecutore P2A MSS","agent_runtime":{"provider":"Cursor","model":"composer-2.5","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"ingresso v0 + MANUALE_OPERATIVO_MSS_V0","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"session_event","record_id":"mss-rec-01a0312a-d633-7dbf-bab3-f0a442e6464a","capture_key":"mss-ses-01a0312a-d633-77a7-8102-230699dd8467/1/session_event/1","event":{"event_id":"mss-evt-01a0312a-d633-7403-8d13-c69a370a0674","event_kind":"session_close","occurred_at":"2026-08-23T23:15:00+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"P2A: manuale operativo MSS per agente freddo + puntatori ingresso/viste; nessun export motore","session_type":"deep","capsule_status":"completa","role_key":"agente-esecutore-p2a-mss","area":"MetaSkillSystem / P2A discovery manuale","environment":"workspace locale, branch env/test @ 46b8bca, Windows 11","authorization":{"read":["docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","docs/MetaSkillSystem/PLAN_V0.md","docs/MetaSkillSystem/AUDIT_STATO_REALE_23-08-26.md","docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","docs/Sessioni di lavoro/23-08-26/Report-p1-d1-d4-d5-23-08-26.md"],"write":["docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","docs/MetaSkillSystem/PLAN_V0.md","docs/MetaSkillSystem/AUDIT_STATO_REALE_23-08-26.md","docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md","docs/Sessioni di lavoro/23-08-26/Report-p2a-manuale-mss-23-08-26.md"],"forbid":["WP-1","mss:move","export motore P2B","scripts/mss/capsule.mjs SK-7 fix","hook Claude","guard PROD","commit","push"]},"authorized_outputs":["MANUALE_OPERATIVO_MSS_V0.md","Report-p2a-manuale-mss-23-08-26.md","rettifica puntatori owner/viste"],"route":{"chosen":"manuale + puntatori minimi; preserve WT; verifiche obbligatorie","alternatives_or_conflicts":["scartata: implementare export/bootstrap in P2A — fuori mandato","scartata: congelare conteggi query nel manuale — viola D5"]},"observed_outcome":"manuale operativo creato; SK-10 promosso a IN CORSO P2A in owner; viste allineate senza numeri mobili","open_items":["P2B export/bootstrap","gate A/B SK-7 D2/D3","P4 hook Claude guard PROD","D14 generatore viste"],"controls":[{"control_id":"P2A-STATUS","criterio":"npm run mss:status","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"agente P2A","evidence_refs":[]},{"control_id":"P2A-QUERY","criterio":"npm run mss:query -- --verifica","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"agente P2A","evidence_refs":[]},{"control_id":"P2A-DOCS","criterio":"npm run validate:docs","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"agente P2A","evidence_refs":[]},{"control_id":"P2A-H1","criterio":"npm run test:mss","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"agente P2A","evidence_refs":[]},{"control_id":"P2A-TOOLS","criterio":"npm run test:mss:tools","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"agente P2A","evidence_refs":[]},{"control_id":"P2A-DIFF","criterio":"git diff --check","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"agente P2A","evidence_refs":[]}],"subject_runtime":{"actor_id":"Matteo","provider":"non_applicabile: soggetto umano","model":"non_applicabile: soggetto umano","runtime":"non_applicabile: soggetto umano","surface":"Cursor chat"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["path repo","esiti comandi","SHA"],"prohibited_content":["materiale privato gitignored","segreti"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-plan","owner_id":"SYS-1","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"§4-bis S10 §15 P2A","revision_or_hash":"working tree","sensitivity":"internal"},{"ref_id":"owner-manuale","owner_id":"MSS","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"P2A deliverable","revision_or_hash":"working tree","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-mandato","owner_id":"chat","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-p2a-manuale-mss-23-08-26.md","stable_anchor_or_event_id":"§5 Dati comunicazione mandato inline","revision_or_hash":"working tree","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0312a-d633-77a7-8102-230699dd8467","correlation_id":"mss-cor-01a0312a-d633-7e13-9646-e111ecad52b3","segment_no":1,"created_at":"2026-08-23T23:15:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-2.5","actor_type":"agente","role":"agente esecutore P2A MSS","agent_runtime":{"provider":"Cursor","model":"composer-2.5","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"ingresso v0","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a0312a-d633-74e2-a92b-cf6f739bff2a","capture_key":"mss-ses-01a0312a-d633-77a7-8102-230699dd8467/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a0312a-d633-798d-beeb-27f253e1b5fe","axis":"persona","subject_record_ids":["mss-rec-01a0312a-d633-7dbf-bab3-f0a442e6464a"],"delta":"nessuno","assertions":[{"signal":"Matteo ha consegnato mandato P2A con vincoli espliciti su export/SK-7/commit e output attesi","actor":"Matteo","assistance":"spontaneo","origin":"naturale","source_ref":"source-mandato","effect":"perimetro rispettato","evidence_state":"observed"}],"asserted_by":{"actor_id":"cursor-composer-p2a","role":"agente esecutore P2A","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"source-mandato","evidence_refs":["source-mandato"],"notes":"singola seduta"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0312a-d633-77a7-8102-230699dd8467","correlation_id":"mss-cor-01a0312a-d633-7e13-9646-e111ecad52b3","segment_no":1,"created_at":"2026-08-23T23:15:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-2.5","actor_type":"agente","role":"agente esecutore P2A MSS","agent_runtime":{"provider":"Cursor","model":"composer-2.5","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"ingresso v0","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a0312a-d633-75b9-b950-6657165c7b91","capture_key":"mss-ses-01a0312a-d633-77a7-8102-230699dd8467/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a0312a-d633-7d7f-b1f8-cc2a7ea62e3b","axis":"sistema","subject_record_ids":["mss-rec-01a0312a-d633-7dbf-bab3-f0a442e6464a"],"delta":"verificato","assertions":[{"rule_id_version":"P2A@PLAN §16 R3","trigger_event":"agente freddo apriva troppi file per orientarsi","decision_or_output_changed":"MANUALE_OPERATIVO_MSS_V0.md + ingresso METASKILL; SK-10 IN CORSO P2A in owner","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"cursor-composer-p2a","role":"agente esecutore P2A","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-plan","evidence_refs":["owner-manuale"],"notes":"E2: validate:mss su report; non E3 globale"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0312a-d633-77a7-8102-230699dd8467","correlation_id":"mss-cor-01a0312a-d633-7e13-9646-e111ecad52b3","segment_no":1,"created_at":"2026-08-23T23:15:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-2.5","actor_type":"agente","role":"agente esecutore P2A MSS","agent_runtime":{"provider":"Cursor","model":"composer-2.5","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"ingresso v0","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a0312a-d633-7380-a8fa-34659e06c7bf","capture_key":"mss-ses-01a0312a-d633-77a7-8102-230699dd8467/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a0312a-d633-73d1-a263-561be1440aa4","axis":"output","subject_record_ids":["mss-rec-01a0312a-d633-7dbf-bab3-f0a442e6464a"],"delta":"creato","assertions":[{"output_id":"mss-p2a-manuale","primary_type":"governance","canonical_version":"MANUALE_OPERATIVO_MSS_V0.md","recipient":"agenti freddi MSS","problem_or_job":"discovery locale senza rileggere corpus","intended_use":"ingresso operativo + report P2A","conceived_by":"mandato P2A","decided_by":"Matteo","directed_by":"mandato P2A","authored_by":"cursor-composer-p2a","verified_by":"non_osservato","acceptance_criterion":"manuale + puntatori + verifiche verdi; SK-10 non chiuso; R8 non chiuso","verification_or_use_evidence":"controls[] + validate:mss report","verification_status":"self_report","owner_ref":"owner-manuale","privacy_release":"internal","support_files":["docs/MetaSkillSystem/PLAN_V0.md"],"relations_no_double_count":["non chiude P2B né SK-10"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-composer-p2a","role":"agente esecutore P2A","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-manuale","evidence_refs":["owner-manuale"],"notes":"registro governance; quinto gate fail di proposito"}}}
```

## Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura (es. `git rev-parse HEAD:<path>` o SHA — stesso dato di `source_refs[].revision_or_hash` in capsula). Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1: Mandato inline chat 23-08-26 (verbatim sotto). File @ HEAD: `METASKILL_SYSTEM_SKILL.md` `259001cdae2e3fb1e475c7a2b65a78341f0715d2`; `PLAN_V0.md` `c42ed6735d19211ba23af6e0811371e6021a83a5` (+ diff WT P1/P2A); `AUDIT_STATO_REALE_23-08-26.md` working tree; `CONTRATTO_CAPSULA_SESSIONE_V0.md` WT; `CHIUSURA_SESSIONE.md` `a04af315efdca7f60981f6798ce6e2adc3acb102`; `Report-p1-d1-d4-d5-23-08-26.md` WT.

Verbatim mandato (estratti vincolanti): «Profilo Meta, seduta deep, Esegui P2A: rendere MSS scopribile e leggero da usare nella repository attuale»; «Preserva tutte le modifiche già presenti: non fare reset, checkout, stash, commit o push»; «Non implementare esportazione del motore, mss:move, SK-7, hook Claude o guard PROD»; «Non dichiarare bootstrap in nuova repo provato»; «SK-10 deve diventare IN CORSO — P2A manuale locale, non chiuso».

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).
✅ R2: Sì — `npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/23-08-26/Report-p2a-manuale-mss-23-08-26.md" --kind report --require-capsule` exit 0; §3 allineato a test:mss 42+38, test:mss:tools 25, validate:docs 0 rotti, mss:query 68 sedute al run.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).
✅ R3: Completi — METASKILL, PLAN, AUDIT, ROADMAP, HANDOFF, MANUALE nuovo; nessuna skill area prodotto.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: (1) P2B export/bootstrap motore — esplicitamente fuori P2A. (2) SK-7 D2/D3 e capsule.mjs — divieto mandato. (3) mss:move, hook Claude, guard PROD — divieto. (4) commit/push — divieto. (5) Chiusura SK-10/R8 — mandato vieta dichiararli chiusi.

❓ Q5 — Attrito + migioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: Attrito: HANDOFF accumula istantanee storiche che si sovrappongono — miglioria: generatore D14 o sezione «solo prevalente» in cima con link alle precedenti archiviate.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto per Meta deep (METASKILL + plan + audit + CHIUSURA); hook stop/pre-commit non intercettati in chat — prove via comandi espliciti del mandato.
