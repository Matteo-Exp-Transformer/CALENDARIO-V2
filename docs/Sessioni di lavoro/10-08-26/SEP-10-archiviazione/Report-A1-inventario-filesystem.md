# Report A1 — Inventario filesystem MetaSkillSystem

**Modalità:** deep · SEP-10 fase A1 · `SEP-SES-20260810-021` (segmento A1)  
**Profilo:** Meta · analisi read-only  
**AGC:** `SEP-AGC-xai-cursor-001` · Cursor Grok 4.5  
**Data:** 10-08-2026  
**Plan:** `.cursor/plans/sep-10_archiviazione_mss_430c9c1d.plan.md` (tenuto)

---

## Cappello

- **Cosa è cambiato:** esiste un inventario classificato dei file MSS per livelli 1–6.
- **Cosa resta:** B1/B2; nessuna migrazione.
- **Serve una tua azione:** no (solo lettura).

---

## 1. Fotografia Git

| Campo | Valore |
|---|---|
| Branch | `env/test` |
| HEAD | `bec82c39f9e821ef33ac99214dc2efada27dcf1a` |
| Staging | vuoto |
| WT concorrente | sì (hook, fixture, scripts/mss, pack untracked) — **delta esterno** |

---

## 2. Contatori per livello

| Livello | Contenuto | Conteggio file (ordine di grandezza) |
|---|---|---|
| 1 Kernel/contratti | `METASKILL_SYSTEM_SKILL`, `CONTRATTO_CAPSULA`, `PARAMETRI_MACRO`, `PLAN_V0`, `PROTOCOLLO_*`, tipi seduta | ~9 |
| 2 Pacchetti entry | `Senior-Eval-Pack/*` (6 file) | 6 |
| 3 Viste/indici | `ROADMAP_V0`, `SESSION_LOG` (vista globale), `REPORT_001` (storia osservazioni) | 3+ |
| 4 Archivio storico | report sotto `docs/Sessioni di lavoro/**` MSS/SEP/fantasticazione/H-1* | ~21 mirati 09–10/08 + archivio totale report repo ~397 |
| 5 Prove tecniche | `fixtures/v0.1/*` (~40), `tests/h1/*` (3), `scripts/mss/*` (9), `COVERAGE_MATRIX_H1.json`, hook Cursor MSS | ~55 |
| 6 Privato/sigillato | solo **puntatori** (`docs/_lavoro/Per matteo/Valutazione Personale/` e owner Matteo) | 0 aperti |

---

## 3. Tabella inventario (perimetro A1)

> Colonne schema plan. Fixture raggruppate dove omogenee.

| path | categoria | owner_attuale | stato | lettori | writer | link_in | link_out | sensibilita | vincolo_spostamento | rischio | certezza | note_1_riga |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` | router | routing MSS | fonte | agenti | Meta | AGENTS/skills | PLAN, contratti, SEP skill | bassa | alto — rompe routing | alto | alta | entry point §0-like |
| `docs/MetaSkillSystem/PLAN_V0.md` | kernel_contratto | SYS-1 stato | fonte | agenti | Meta SYS-1 | skill | WP | media | alto — stale vs H-1.3 | alto | alta | **non correggere** in SEP-10 |
| `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | kernel_contratto | schema capsula | fonte | validator+agenti | Meta H-1 | skill, tests | schema fields | media | alto — freeze H-1 | alto | alta | referenziato da scripts |
| `docs/MetaSkillSystem/PARAMETRI_MACRO_V0.md` | kernel_contratto | gate prodotto | fonte | Meta | Meta | skill | — | bassa | medio | medio | media | |
| `docs/MetaSkillSystem/PROTOCOLLO_PRIMO_PILOTA_V0_1.md` | kernel_contratto | pilota | fonte | Meta | Meta | skill | — | bassa | medio | medio | media | |
| `docs/MetaSkillSystem/TIPO_SEDUTA_FANTASTICAZIONE_V0.md` | pacchetto_entry | tipo CFG | fonte | Meta CFG | Meta | skill | puntatori `_lavoro` | media | medio (privacy hop) | medio | alta | punta privato senza copiarlo |
| `docs/MetaSkillSystem/STUDIO_RISPOSTE_FANTASTICAZIONE_V0.md` | pacchetto_entry | studio metodi | fonte | Meta | Meta | skill | privato | media | medio | medio | alta | |
| `docs/MetaSkillSystem/REPORT_001_OSSERVAZIONI_ARCHITETTURALI_09-08-26.md` | archivio_storico | osservazioni | prova | Meta | storico | skill | PLAN | bassa | basso (storia) | basso | alta | non stato |
| `docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md` | router | pack routing | fonte | senior | Meta SEP | MSS skill | pack docs | bassa | alto | alto | alta | |
| `…/MASTERPLAN_V0.md` | pacchetto_entry | stato SEP | fonte | senior | Meta SEP | skill/handoff | gate WP | media | alto | alto | alta | owner stato pack |
| `…/HANDOFF_SENIOR_V0.md` | vista_indice | continuità | vista | senior | fine sessione | skill | masterplan/report | bassa | medio | medio | alta | non owner stato |
| `…/ROADMAP_V0.md` | vista_indice | sequenza | vista | umani | allinea post-master | skill | masterplan | bassa | basso | basso | alta | |
| `…/CATALOGO_SEDUTE_E_METODI_V0.md` | archivio_storico | catalogo | fonte | senior | catalogazione | skill | report | media | medio | medio | alta | |
| `…/CONTRATTO_EVAL_SENIOR_V0.md` | kernel_contratto | eval form | fonte | senior | Meta SEP | skill | — | media | alto | alto | alta | |
| `docs/MetaSkillSystem/fixtures/v0.1/*` (40 file + manifest) | prova_tecnica | H-1 suite | prova | test:mss | builder | run.mjs | schema | bassa | **alto** path hard-coded | alto | alta | vedi A3 |
| `docs/MetaSkillSystem/tests/h1/*.mjs` | prova_tecnica | runner | prova | CI locale | Meta H-1 | package.json | fixtures+scripts | bassa | alto | alto | alta | |
| `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json` | prova_tecnica | coverage | prova | run.mjs | Meta H-1 | run.mjs | — | bassa | alto | alto | alta | path hard-coded |
| `scripts/mss/*.mjs` (9) | prova_tecnica | validator | prova | hooks+CLI | Meta H-1 | package/hooks | fixtures | media | alto | alto | alta | |
| `.cursor/hooks/fine-sessione-*.mjs` | prova_tecnica | chiusura | prova | Cursor | Meta | — | scripts/mss | bassa | alto | alto | alta | import relativi |
| `docs/SESSION_LOG.md` | vista_indice | indice sessioni | vista | tutti | ogni chiusura | — | report paths | bassa | medio | medio | alta | |
| `docs/Sessioni di lavoro/**/Report-*.md` | report_sessione | storia | prova | umani/agenti | sessioni | SESSION_LOG/catalogo | capsule | variabile | basso-medio | medio | media | molti orfani possibili |
| `docs/_lavoro/Per matteo/Valutazione Personale/` | privato_puntatore | Bussola | privato_sigillato | Matteo | Matteo | skill/Bussola | — | **alta** | non spostare da SEP | alto | alta | **NON aperto** in A1 |

---

## 4. Findings A1

| ID | Sev. | Fonte | Certezza | Asse | Effetto MSS |
|---|---|---|---|---|---|
| A1-F01 | MEDIUM | inventario | alta | sistema | Pack SEP e gran parte fixture/scripts ancora **untracked** → rischio «stato su disco ≠ git» |
| A1-F02 | HIGH | PLAN vs H-1.3 | alta | sistema | `PLAN_V0` stale vs verdetto H-1.3 FAIL — registrato, **non** corretto |
| A1-F03 | MEDIUM | conteggio report | media | output | Archivio report monorepo enorme (~397); MSS è sottoinsieme non isolato fisicamente |
| A1-F04 | LOW | livelli | alta | sistema | Livello 3 (viste) e 4 (storia) convivono nella stessa tree docs/ senza prefisso archive |

---

## 5. Da non spostare (ipotesi)

| Path | Perché | Certezza |
|---|---|---|
| `scripts/mss/**` + `fixtures/v0.1/**` + `tests/h1/**` | path hard-coded (A3) | alta |
| `CONTRATTO_CAPSULA_SESSIONE_V0.md` | freeze H-1 / validator | alta |
| `PLAN_V0.md` | owner SYS-1; divergenza da registrare non sanare | alta |
| `Senior-Eval-Pack/MASTERPLAN_V0.md` | owner stato pack | alta |
| Zone `_lavoro/.../Valutazione Personale/` | privacy | alta |
| Report storici già linkati | provenienza append-only | alta |

---

## 6. Segnali studio MSS

- **Friction routing:** entry MSS → molti file sibling; progressive disclosure dichiarata ma WT sporco aumenta costo contesto.
- **Owner:** chiaro su pack (masterplan) e SYS-1 (PLAN); confusione storia↔stato se si aprono report come se fossero stato.
- **G/O/E archive:** G=«report=vista/storia»; O=agenti a volte trattano report come stato; E=nessun lint anti-overwrite storia (soft).
- **Costo contesto:** hop skill→masterplan→handoff→report tipico 3–5 file; con WT concorrente facilmente 10+.
- **Confondenti:** untracked pack; fixture untracked; HEAD fisso ma tree sporco.

---

## 7. STOP incontrati

- Privacy: Valutazione Personale non aperta.
- Nessuna autorità di migrazione.

---

## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-019fec21-a101-7000-8000-000000000001","session_id":"mss-ses-019fec21-a101-7000-8000-0000000000a1","correlation_id":"mss-cor-019fec21-a101-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec21-a101-7000-8000-0000000000a1/1/session_event/1","created_at":"2026-08-10T15:05:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep10-a1","actor_type":"agente","role":"sep10_a1","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["PowerShell","Git","Read","Grep","Write","Node.js"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md"},{"package_id":"communication-closure","package_version_or_revision":"working-tree","source_ref":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md"}],"event":{"event_id":"mss-evt-019fec21-a101-7000-8000-0000000000e1","event_kind":"session_close","occurred_at":"2026-08-10T15:05:00+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"Eseguire A1 inventario FS","session_type":"deep","capsule_status":"completa","role_key":"Meta writer","area":"MetaSkillSystem SEP-10 A1","environment":"branch env/test; HEAD bec82c39; staging vuoto; working-tree concorrente non attribuito","authorization":{"read":["docs/MetaSkillSystem/**","scripts/mss/**","plan SEP-10"],"write":["docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/**","report ombrello","MASTERPLAN SEP-10","HANDOFF","SESSION_LOG"],"forbid":["rename/move/migrazione","SEP-11","H-1.3 fix","WP-1","Valutazione Personale contents","commit"]},"authorized_outputs":["report A1","capsula"],"route":{"chosen":"SENIOR_EVAL_SKILL + MASTERPLAN","alternatives_or_conflicts":"nessuno"},"observed_outcome":"A1 inventario livelli 1-6","open_items":["B1","B2","SEP-11 vietato"],"controls":[{"control_id":"NO-MIGRATION","criterio":"zero rename/move","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-grok-sep10-a1","evidence_refs":["owner-report"]},{"control_id":"SCHEMA-INVENTORY","criterio":"report contiene inventario/findings/segnali","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-grok-sep10-a1","evidence_refs":["owner-report"]}],"subject_runtime":{"actor_id":"mss.senior-eval-pack/0.1.0","provider":"non_applicabile:oggetto documentale","model":"non_applicabile:oggetto documentale","runtime":"docs/MetaSkillSystem/Senior-Eval-Pack","surface":"markdown pack"},"privacy":{"classification":"internal","capture_basis":"user_request","allowed_content":["finding","path","git metadata","decisioni Matteo"],"prohibited_content":["dati personali Valutazione Personale","segreti"],"redactions":"nessuno","external_release":"forbidden","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-report","owner_id":"SEP-10-A1","uri_or_path":"docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-A1-inventario-filesystem.md","stable_anchor_or_event_id":"SEP-SES-20260810-021","revision_or_hash":"working-tree-10-08-26","sensitivity":"internal"},{"ref_id":"owner-masterplan","owner_id":"mss.senior-eval-masterplan","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md","stable_anchor_or_event_id":"SEP-10","revision_or_hash":"working-tree-10-08-26","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-user","owner_id":"conversation","uri_or_path":"conversation:this-session","stable_anchor_or_event_id":"mandate-SEP-10-A1A4","revision_or_hash":"10-08-26","sensitivity":"internal"},{"ref_id":"source-plan","owner_id":"plan","uri_or_path":".cursor/plans/sep-10_archiviazione_mss_430c9c1d.plan.md","stable_anchor_or_event_id":"A1-A4","revision_or_hash":"kept","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fec21-a101-7000-8000-000000000002","session_id":"mss-ses-019fec21-a101-7000-8000-0000000000a1","correlation_id":"mss-cor-019fec21-a101-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec21-a101-7000-8000-0000000000a1/1/annotation/1","created_at":"2026-08-10T15:05:01+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep10-a1","actor_type":"agente","role":"sep10_a1","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write"]},"packages_loaded":[{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fec21-a101-7000-8000-0000000000a1","axis":"persona","subject_record_ids":["mss-rec-019fec21-a101-7000-8000-000000000001"],"delta":"nessuno","assertions":[{"signal":"non_osservato","actor":"matteo","assistance":"non_applicabile:analisi read-only","origin":"naturale","source_ref":"source-user","effect":"nessuna nuova decisione mid-flight","evidence_state":"observed"}],"asserted_by":{"actor_id":"cursor-grok-sep10-a1","role":"sep10_a1","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile:gate_o_archivio","evidence_refs":["source-user"],"notes":"nessuna inferenza su competenze o profilo di Matteo"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fec21-a101-7000-8000-000000000003","session_id":"mss-ses-019fec21-a101-7000-8000-0000000000a1","correlation_id":"mss-cor-019fec21-a101-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec21-a101-7000-8000-0000000000a1/1/annotation/2","created_at":"2026-08-10T15:05:02+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep10-a1","actor_type":"agente","role":"sep10_a1","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write","Grep"]},"packages_loaded":[{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md"}],"annotation":{"annotation_id":"mss-ann-019fec21-a101-7000-8000-0000000000a2","axis":"sistema","subject_record_ids":["mss-rec-019fec21-a101-7000-8000-000000000001"],"delta":"NON_INIZIATO -> IN_CORSO_analisi","assertions":[{"rule_id_version":"SEP-10@mss.senior-eval-pack/0.1.0","trigger_event":"ricognizione A1","decision_or_output_changed":"artefatto analisi","G":2,"O":2,"E":0}],"asserted_by":{"actor_id":"cursor-grok-sep10-a1","role":"sep10_a1","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-masterplan","evidence_refs":["owner-report"],"notes":"calibrazione/documentazione"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fec21-a101-7000-8000-000000000004","session_id":"mss-ses-019fec21-a101-7000-8000-0000000000a1","correlation_id":"mss-cor-019fec21-a101-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec21-a101-7000-8000-0000000000a1/1/annotation/3","created_at":"2026-08-10T15:05:03+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep10-a1","actor_type":"agente","role":"sep10_a1","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write"]},"packages_loaded":[{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fec21-a101-7000-8000-0000000000a3","axis":"output","subject_record_ids":["mss-rec-019fec21-a101-7000-8000-000000000001"],"delta":"creato","assertions":[{"output_id":"SEP-OUT-sep10-a1-0.1","primary_type":"registro","canonical_version":"2026-08-10-v1","recipient":"Matteo","problem_or_job":"ricognizione archiviazione read-only","intended_use":"input B1","conceived_by":"Matteo via plan","decided_by":"plan tenuto","directed_by":"prompt Fase 2","authored_by":"cursor-grok-sep10-a1","verified_by":"validate capsula","acceptance_criterion":"report in cartella SEP-10 senza migrazione","verification_or_use_evidence":"file presente","verification_status":"self_report","owner_ref":"owner-report","privacy_release":"internal","support_files":["docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/README.md"],"relations_no_double_count":["un report per fase"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-grok-sep10-a1","role":"sep10_a1","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-report","evidence_refs":["owner-report"],"notes":"non eval prospettica"}}}
```

---

## Checklist Matteo (max 5)

1. Router e contratti restano dove sono finché B1 non propone fasi.
2. Non spostare fixture/scripts senza A3.
3. Non «aggiustare» PLAN_V0 in SEP-10.
4. Privato = solo puntatore.
5. Prossimo = leggere A2–A4 poi autorizzare B1.
