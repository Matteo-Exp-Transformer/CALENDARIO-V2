# Report — SEP-11 F1+F2 (archive shell + indice)

**Modalità:** deep · MetaSkillSystem / Senior Eval Pack
**Profilo:** Meta — esecuzione create-only (NON F3)
**Configurazione agente:** `SEP-AGC-xai-cursor-001` · Cursor Grok 4.5
**Session pack:** `SEP-SES-20260810-025`
**Capsule session:** `mss-ses-019fec50-0250-7000-8000-000000000025`
**Data:** 10-08-2026

> Zero rename/move/copy di file storici. Solo create-only + allineamento owner + slice track D2 (no commit).

---

## Cappello

- **Cosa è cambiato:** esiste la cartella archivio MSS con policy e un indice che punta ai report senza spostarli.
- **Cosa resta:** sistemare i link di REPORT_001 (B2-F01) prima di qualsiasi spostamento; commit dello slice quando dirai «fai report finale».
- **Serve una tua azione:** no per F1+F2; sì solo se vuoi commit («fai report finale») o aprire B2-F01.

---

## 1. F0 — Fotografia Git + freeze

| Campo | Valore |
|---|---|
| Branch | `env/test` |
| HEAD | `bec82c39f9e821ef33ac99214dc2efada27dcf1a` |
| Remote | ahead 2 · behind 0 |
| Staging pre-sessione | vuoto (poi: slice D2 staged) |
| WT concorrente | sì (hook, L5 fixture/scripts, pack, report) — L5 **non** attribuita a questa seduta |

### Freeze L5 (D4) — non toccati

- `docs/MetaSkillSystem/fixtures/`
- `docs/MetaSkillSystem/tests/h1/`
- `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json`
- `scripts/mss/`
- path-coupled hook/validator (fuori rewrite)

### Freeze L6 — non aperti / non in write

- `docs/_lavoro/.../Valutazione Personale/`
- altri contenuti `_lavoro` privati

---

## 2. Cosa è stato fatto

1. Verificato masterplan: D1–D5 chiuse; perimetro F1+F2; B2-F01 aperto → F3 non aperto.
2. **F1:** creato `docs/MetaSkillSystem/archive/README.md` (policy livelli, freeze, redirect TTL 30gg, owner).
3. **F2:** creato `docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md` (puntatori A4/B1 + report 09/10-08 MSS; limiti dichiarati).
4. **D2 slice:** `git add` mirato pack Senior-Eval-Pack + cartella SEP-10 + report 10-08 SEP correlati + archive + questo report / SESSION_LOG — **senza** L5 fixture/scripts; **senza** commit.
5. Aggiornati MASTERPLAN (SEP-11 → `IN_CORSO`), HANDOFF, ROADMAP, README SEP-10, SESSION_LOG.
6. Controlli: `validate:mss` su questo report; `git diff --check`; checklist no path `_lavoro`/L5 in write.

---

## 3. File toccati e perché

| File | Perché |
|---|---|
| `docs/MetaSkillSystem/archive/README.md` | F1 policy (M01) |
| `docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md` | F2 indice (M02) |
| questo report | prova fase + capsula |
| `Senior-Eval-Pack/MASTERPLAN_V0.md` | owner stato SEP-11 |
| `Senior-Eval-Pack/HANDOFF_SENIOR_V0.md` | continuità ultimo atto |
| `Senior-Eval-Pack/ROADMAP_V0.md` | vista allineata |
| `SEP-10-archiviazione/README.md` | indice ciclo |
| `docs/SESSION_LOG.md` | 1 riga |

**Non toccati:** `PLAN_V0`, fixtures, scripts/mss, tests/h1, REPORT_001 (no move), Valutazione Personale.

---

## 4. Test eseguiti e risultato

| Controllo | Esito |
|---|---|
| Esistenza `archive/README` + indice | sì |
| Zero move storici (solo create) | sì |
| `validate:mss` su questo report | **OK** |
| `git diff --check` perimetro scritto | **OK** (trailing space ripuliti) |
| Checklist write senza `_lavoro`/L5 | sì (staged 25 path; leak check vuoto) |
| Rollback a secco | delete file sotto `archive/` (+ drop riga indice se esteso) |

---

## 5. File di skill aggiornati

| file | modifica | perché |
|---|---|---|
| MASTERPLAN | SEP-11 `IN_CORSO`; prossimo = B2-F01/stop | owner |
| HANDOFF | vista attiva 025 | continuità |
| ROADMAP | nota F1+F2 eseguiti | vista |
| README archive | nuovo | policy |
| README SEP-10 | F1+F2 fatto | indice ciclo |
| SESSION_LOG | riga 025 | indice narrativo |

---

## 6. Dati comunicazione

- Frase: mandato prompt F1+F2 create-only (D1–D5 già chiuse).
- Formato: perimetro stretto → create-only → STOP F3 → report + capsula.

---

## 6-bis. Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-019fec50-0251-7000-8000-000000000001","session_id":"mss-ses-019fec50-0250-7000-8000-000000000025","correlation_id":"mss-cor-019fec50-0240-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec50-0250-7000-8000-000000000025/1/session_event/1","created_at":"2026-08-10T15:50:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep11-f1f2","actor_type":"agente","role":"senior_eval_pack_archive_writer","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["PowerShell","Git","Read","Grep","Write","StrReplace","Node.js"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md"},{"package_id":"communication-closure","package_version_or_revision":"working-tree","source_ref":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md"}],"event":{"event_id":"mss-evt-019fec50-0251-7000-8000-0000000000e1","event_kind":"session_close","occurred_at":"2026-08-10T15:50:00+02:00","continues_record_id":"nessuno","causation_record_id":"mss-rec-019fec50-0241-7000-8000-000000000001","intent_user":"Eseguire SEP-11 F1+F2 create-only archive shell + indice; opz. D2 slice; zero move; no F3","session_type":"deep","capsule_status":"completa","role_key":"Meta writer","area":"MetaSkillSystem Senior-Eval-Pack SEP-11 F1+F2","environment":"branch env/test; HEAD bec82c39; ahead 2; D2 staged post-fase; L5 non staged","authorization":{"read":["Senior-Eval-Pack/*","SEP-10-archiviazione/*","B1","B2","report 024","A4","plan SEP-10"],"write":["docs/MetaSkillSystem/archive/**","questo report","MASTERPLAN","HANDOFF","ROADMAP","README SEP-10","SESSION_LOG","git add D2 slice"],"forbid":["F3","move REPORT_001","touch L5","PLAN_V0 rewrite","H-1.3","WP-1","SEP-5","SEP-G5 PASS","commit","push","Valutazione Personale"]},"authorized_outputs":["archive README","MSS-REPORT-INDEX","report fase","capsula","SESSION_LOG","owner allineati","staging D2"],"route":{"chosen":"SENIOR_EVAL_SKILL -> MASTERPLAN F1+F2 create-only","alternatives_or_conflicts":"nessuno"},"observed_outcome":"F1+F2 create-only fatti; zero move; SEP-11 IN_CORSO; D2 staged; F3 ancora bloccato da B2-F01; SEP-G5 non PASS","open_items":["remediation B2-F01 pre-F3","commit slice D2 su mandato Matteo","F3 vietato"],"controls":[{"control_id":"F1-F2-CREATE-ONLY","criterio":"esistono archive/README e indice; zero move storici","esito":"pass","numeratore":2,"denominatore":2,"esecutore":"cursor-grok-sep11-f1f2","evidence_refs":["owner-archive-readme","owner-archive-index"]},{"control_id":"NO-F3","criterio":"nessun move REPORT_001; B2-F01 ancora aperto","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-grok-sep11-f1f2","evidence_refs":["owner-report"]},{"control_id":"NO-SEP-G5-PASS","criterio":"nessuna dichiarazione SEP-G5 PASS","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-grok-sep11-f1f2","evidence_refs":["owner-masterplan"]},{"control_id":"NO-L5-L6-WRITE","criterio":"nessun path freeze L5/_lavoro nel perimetro write","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-grok-sep11-f1f2","evidence_refs":["owner-report"]}],"subject_runtime":{"actor_id":"mss.senior-eval-pack/0.1.0","provider":"non_applicabile:oggetto documentale","model":"non_applicabile:oggetto documentale","runtime":"docs/MetaSkillSystem/archive","surface":"markdown archive shell"},"privacy":{"classification":"internal","capture_basis":"user_request","allowed_content":["path","git metadata","policy archive","indice report"],"prohibited_content":["Valutazione Personale","segreti"],"redactions":"nessuno","external_release":"forbidden","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-report","owner_id":"SEP-SES-20260810-025","uri_or_path":"docs/Sessioni di lavoro/10-08-26/Report-sep-11-f1-f2-archive-shell-indice-10-08-26.md","stable_anchor_or_event_id":"F1-F2","revision_or_hash":"working-tree-10-08-26","sensitivity":"internal"},{"ref_id":"owner-archive-readme","owner_id":"mss.archive-policy","uri_or_path":"docs/MetaSkillSystem/archive/README.md","stable_anchor_or_event_id":"M01","revision_or_hash":"working-tree","sensitivity":"internal"},{"ref_id":"owner-archive-index","owner_id":"mss.archive-index","uri_or_path":"docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md","stable_anchor_or_event_id":"M02","revision_or_hash":"working-tree","sensitivity":"internal"},{"ref_id":"owner-masterplan","owner_id":"mss.senior-eval-masterplan","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md","stable_anchor_or_event_id":"SEP-11-IN_CORSO","revision_or_hash":"working-tree","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-user","owner_id":"conversation","uri_or_path":"conversation:this-session","stable_anchor_or_event_id":"mandate-F1-F2","revision_or_hash":"10-08-26","sensitivity":"internal"},{"ref_id":"source-024","owner_id":"SEP-SES-20260810-024","uri_or_path":"docs/Sessioni di lavoro/10-08-26/Report-decisioni-d1-d5-perimetro-sep11-f1-f2-10-08-26.md","stable_anchor_or_event_id":"D1-D5","revision_or_hash":"working-tree","sensitivity":"internal"},{"ref_id":"source-b1","owner_id":"SEP-SES-20260810-022","uri_or_path":"docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-B1-sintesi-piano-migrazione.md","stable_anchor_or_event_id":"M01-M02-F1-F2","revision_or_hash":"working-tree","sensitivity":"internal"},{"ref_id":"source-a4","owner_id":"SEP-SES-20260810-021","uri_or_path":"docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-A4-archivi-report-privacy.md","stable_anchor_or_event_id":"A4-inventory","revision_or_hash":"working-tree","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fec50-0252-7000-8000-000000000002","session_id":"mss-ses-019fec50-0250-7000-8000-000000000025","correlation_id":"mss-cor-019fec50-0240-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec50-0250-7000-8000-000000000025/1/annotation/1","created_at":"2026-08-10T15:50:01+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep11-f1f2","actor_type":"agente","role":"senior_eval_pack_archive_writer","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Read"]},"packages_loaded":[{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fec50-0252-7000-8000-0000000000a1","axis":"persona","subject_record_ids":["mss-rec-019fec50-0251-7000-8000-000000000001"],"delta":"nessuno","assertions":[{"signal":"non_osservato","actor":"matteo","assistance":"non_applicabile:mandato gia chiuso in 024","origin":"naturale","source_ref":"source-user","effect":"esecuzione entro D1-D5 gia chiuse; nessuna nuova scelta strutturale richiesta","evidence_state":"observed"}],"asserted_by":{"actor_id":"cursor-grok-sep11-f1f2","role":"senior_eval_pack_archive_writer","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna nuova decisione","criterion_ref":"non_applicabile:governance","evidence_refs":["source-024"],"notes":"delta persona nullo su scelte nuove; mandato esecutivo gia autorizzato"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fec50-0253-7000-8000-000000000003","session_id":"mss-ses-019fec50-0250-7000-8000-000000000025","correlation_id":"mss-cor-019fec50-0240-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec50-0250-7000-8000-000000000025/1/annotation/2","created_at":"2026-08-10T15:50:02+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep11-f1f2","actor_type":"agente","role":"senior_eval_pack_archive_writer","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write","StrReplace"]},"packages_loaded":[{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md"}],"annotation":{"annotation_id":"mss-ann-019fec50-0253-7000-8000-0000000000a2","axis":"sistema","subject_record_ids":["mss-rec-019fec50-0251-7000-8000-000000000001"],"delta":"SEP-11 NON_INIZIATO -> IN_CORSO; F1+F2 create-only presenti; F3 resta bloccato","assertions":[{"rule_id_version":"SEP-11-F1-F2@mss.senior-eval-pack/0.1.0","trigger_event":"esecuzione create-only post D1-D5","decision_or_output_changed":"shell archive + indice; prossimo = B2-F01 o stop; SEP-G5 non PASS","G":2,"O":2,"E":1}],"asserted_by":{"actor_id":"cursor-grok-sep11-f1f2","role":"senior_eval_pack_archive_writer","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-masterplan","evidence_refs":["owner-archive-readme","owner-archive-index","owner-report"],"notes":"E soft: indice e vista, non enforcement path"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fec50-0254-7000-8000-000000000004","session_id":"mss-ses-019fec50-0250-7000-8000-000000000025","correlation_id":"mss-cor-019fec50-0240-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec50-0250-7000-8000-000000000025/1/annotation/3","created_at":"2026-08-10T15:50:03+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep11-f1f2","actor_type":"agente","role":"senior_eval_pack_archive_writer","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write"]},"packages_loaded":[{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fec50-0254-7000-8000-0000000000a3","axis":"output","subject_record_ids":["mss-rec-019fec50-0251-7000-8000-000000000001"],"delta":"creato","assertions":[{"output_id":"SEP-OUT-archive-shell-index-0.1","primary_type":"governance","canonical_version":"2026-08-10-v1","recipient":"Matteo","problem_or_job":"avere shell archive e indice report senza spostare storia","intended_use":"orientare agenti e fasi successive senza cutover","conceived_by":"Matteo (D1-D5)","decided_by":"Matteo (D1-D5)","directed_by":"prompt F1+F2","authored_by":"cursor-grok-sep11-f1f2","verified_by":"validate:mss + diff-check + checklist freeze","acceptance_criterion":"README+indice esistono; zero move; owner allineati; F3 non aperto","verification_or_use_evidence":"file creati; masterplan IN_CORSO; report 025","verification_status":"self_report","owner_ref":"owner-report","privacy_release":"internal","support_files":["docs/MetaSkillSystem/archive/README.md","docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md","docs/SESSION_LOG.md"],"relations_no_double_count":["un report fase; indice e vista non stato"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-grok-sep11-f1f2","role":"senior_eval_pack_archive_writer","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-report","evidence_refs":["owner-archive-readme","owner-archive-index"],"notes":"output documentale create-only; non migrazione"}}}
```

---

## 7. Analisi flusso

- Prompt sostanziali: 1 (mandato F1+F2 autocontenuto).
- Correzioni dopo 1ª risposta: 0 (in corso di chiusura).
- Peso sessione: deep (non abbassata).

---

## 8. Lettura sessione

- Impressioni: perimetro D1–D5 + STOP F3 rende l’esecuzione meccanica e sicura; skill pack + B1 bastano.
- Difficoltà: WT pieno di untracked L5 — mitigato escludendo esplicitamente fixture/scripts dallo stage D2.
- Miglioria (dato, non modifica): checklist “staged vs freeze” come blocco standard nei prompt SEP-11.

---

## 9. Derivazione errori

| Voce | Classe | Nota |
|---|---|---|
| B2-F01 ancora aperto | vincolo strutturale / debito piano | non sanato (fuori F1+F2) |
| nessuna difficoltà operativa F1+F2 | — | create-only riuscito |

---

## 10. Cosa resta

1. Remediation **B2-F01** (link M03) **oppure** stop.
2. Commit/push slice D2 solo su «fai report finale».
3. F3 / move REPORT_001: **vietato** finché B2-F01 + nuovo mandato.
4. H-1.3 / WP-1 / SEP-5 / SEP-G5: corsie separate.

---

## 10-bis. Handoff operativo

- **Vero adesso:** F1+F2 fatti; archive + indice presenti; zero move; SEP-11 `IN_CORSO`; G5 non PASS; D2 staged.
- **Prossimo:** B2-F01 o stop.
- **STOP:** F3, L5, privato, PLAN_V0 rewrite, SEP-G5 PASS, commit senza mandato.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali.
✅ R1: Mandato Agent «pProfilo: Meta (SEP-11 F1+F2 — create-only archive shell + indice; opz. slice track D2)» con D1=b D2=c D3=a D4=a D5=a, STOP F3/move/L5/PLAN_V0/H-1.3/WP-1/SEP-G5 PASS, output F0–F2 + report/capsula/owner.

❓ Q2 — Dati = diff reale?
✅ R2: Branch env/test HEAD bec82c39… ahead 2; creati solo archive/README + indices/MSS-REPORT-INDEX (+ report/owner); zero rename; L5 non staged; D2 slice staged dopo git add mirato.

❓ Q3 — File correlati allineati?
✅ R3: MASTERPLAN, HANDOFF, ROADMAP, README SEP-10, SESSION_LOG, archive README, indice. PLAN_V0 e A*/B1/B2 non riscritti (storia). Contratto/catalogo non toccati.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non F3/move REPORT_001; non touch L5; non commit/push; non SEP-G5 PASS; non H-1.3/WP-1/SEP-5; non sanato B2-F01. Certo: mandato = F1+F2 + opz. D2 stage.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito = rumore untracked L5 vicino al pack; miglioria = elenco esplicito path staged nel report (sezione 12).

❓ Q6 — Contesto & hook?
✅ R6: Contesto giusto (024 + B1/B2 + masterplan); hook chiusura per Q/R e capsula.

---

## 12. Slice D2 — path committed (post chiusura Meta; no push)

Verificato con `git diff --cached --name-only` (25 path; L5 leak check vuoto):

```
docs/MetaSkillSystem/Senior-Eval-Pack/CATALOGO_SEDUTE_E_METODI_V0.md
docs/MetaSkillSystem/Senior-Eval-Pack/CONTRATTO_EVAL_SENIOR_V0.md
docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md
docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md
docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md
docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md
docs/MetaSkillSystem/archive/README.md
docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md
docs/SESSION_LOG.md
docs/Sessioni di lavoro/10-08-26/Report-accettazione-sep-g1-pass-con-riserve-cursor-only-10-08-26.md
docs/Sessioni di lavoro/10-08-26/Report-creazione-handoff-senior-eval-pack-metaskillsystem-10-08-26.md
docs/Sessioni di lavoro/10-08-26/Report-decisioni-d1-d5-perimetro-sep11-f1-f2-10-08-26.md
docs/Sessioni di lavoro/10-08-26/Report-fondazione-senior-eval-pack-metaskillsystem-10-08-26.md
docs/Sessioni di lavoro/10-08-26/Report-orchestrazione-sep-g1-pass-rimandato-controverifica-10-08-26.md
docs/Sessioni di lavoro/10-08-26/Report-remediation-sep-f01-post-sep4-metaskillsystem-10-08-26.md
docs/Sessioni di lavoro/10-08-26/Report-revisione-indipendente-sep4-senior-eval-pack-metaskillsystem-10-08-26.md
docs/Sessioni di lavoro/10-08-26/Report-sep-10-a1-a4-ricognizione-archiviazione-10-08-26.md
docs/Sessioni di lavoro/10-08-26/Report-sep-11-f1-f2-archive-shell-indice-10-08-26.md
docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/README.md
docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-A1-inventario-filesystem.md
docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-A2-grafo-link-owner.md
docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-A3-prove-tecniche-path.md
docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-A4-archivi-report-privacy.md
docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-B1-sintesi-piano-migrazione.md
docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-B2-review-piano-migrazione.md
```

**Esclusi di proposito:** `fixtures/**`, `tests/**`, `COVERAGE_MATRIX_H1.json`, `scripts/mss/**`, hook `.cursor/hooks/*`.

---

## 13. Self-review

1. F1+F2 create-only coerenti con B1 M01/M02 e D1–D5.
2. Owner aggiornati; nessuna migrazione fingendo G5.
3. Q1–Q6 compilate; capsula tre assi.
4. F3 e L5 restano fuori.

---

## Chiusura verso Matteo (max 5)

1. Creati **archivio** (policy) e **indice** dei report MSS — i file restano dove sono.
2. **Niente** spostato (né REPORT_001 né prove tecniche).
3. Pack/analisi SEP-10 sono **in staging**, non ancora in commit.
4. Prossimo passo utile: sistemare i link (B2-F01) **prima** di qualsiasi spostamento.
5. Commit solo quando dirai «fai report finale».
