# Mini-report E3 — allineo contratto capsula (`SK-4`)

> Slot: **E3** · Wave 1 · Data: 23-08-26 · Branch: `env/test`
> File in proprietà: `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md`

## 1. Obiettivo

Allineare il documento owner dello schema capsula alla versione viva del motore (`0.1.1` /
`freeze-2`), così un agente che segue il contratto non produca più capsule nuove senza `controls`.

## 2. Sezioni modificate

| Sezione | Prima | Dopo |
|---|---|---|
| Titolo | `mss.session/0.1.0` | `mss.session/0.1.1` |
| Avviso in testa | disallineamento rosso; corpo ancora 0.1.0 | allineato a 0.1.1/freeze-2; nota «validator in rollout» finché E2 non merge |
| Blocco stato | `freeze-1` con avviso superato | `freeze-2` come revisione viva |
| §2 Dove vive | nessun perimetro path | sotto-cartelle arbitrarie + prefissi `Report-`/`Verbale-` + regex G1/G2 |
| §3 Identità | blocco esempio 0.1.0/freeze-1 con warning inline | coppia viva 0.1.1/freeze-2; sottosezione legacy solo lettura |
| §4 session_event | `controls` assente dal template | `controls` nel template + sottosezione dedicata (campi, obbligatorietà, esito enum) |

## 3. Prove di chiusura E3

1. **Grep §3 — nessun invito a 0.1.0 per record nuovi:** il blocco identità canonico usa
   `0.1.1`/`freeze-2`; `0.1.0`/`freeze-1` compaiono solo in «Coppia legacy — solo lettura» con
   «Vietato usarla su record nuovi».
2. **§2 path:** cita esplicitamente profondità arbitraria sotto cartella-data e prefissi
   `Report-` / `Verbale-` con regex approvata.
3. **Avviso vs corpo:** coerenti — entrambi dichiarano `0.1.1`/`freeze-2` come versione viva;
   l'avviso aggiunge solo lo stato rollout enforcement (E2 pending).

Comando di verifica eseguito:

```text
rg "0\.1\.0|freeze-1" docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md
→ occorrenze solo in avviso storico, sottosezione legacy §3, e riferimenti «non produrre»
```

## 4. Backlog esplicito (fuori E3)

- **E2** (`core.mjs` / `rules.mjs`): regola `MSS-LEGACY-NEW-FORBIDDEN` — finché non merge, il
  validator può ancora accettare legacy su record nuovi (citato nell'avviso).
- **E1** path: regex in §2 documentata; implementazione condivisa in `adapter.mjs` resta a E1.
- **E4** integrazione: dimostrazioni B1–B3 e aggiornamento `PLAN_V0.md` §4-bis riga S4.
- **`rule_id_version` testo libero** — backlog SK-4 esteso, non toccato.
- Capsule storiche — non riscritte (perimetro rispettato).

## 5. Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-0198c100-0003-7000-8000-000000000001","session_id":"mss-ses-0198c100-0003-7000-8000-000000000010","correlation_id":"mss-cor-0198c100-0003-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198c100-0003-7000-8000-000000000010/1/session_event/1","created_at":"2026-08-23T10:30:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-agent-e3","actor_type":"agente","role":"sk4_e3_contract_aligner","agent_runtime":{"provider":"Cursor","model":"Claude","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Read","Grep","Write","StrReplace"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"sk4-plan","package_version_or_revision":"23-08-26","source_ref":"docs/Sessioni di lavoro/23-08-26/PLAN-CURSOR-SK-4-23-08-26.md"}],"event":{"event_id":"mss-evt-0198c100-0003-7000-8000-000000000030","event_kind":"session_close","occurred_at":"2026-08-23T10:30:00+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"SK-4 E3 allineo contratto capsula a 0.1.1/freeze-2","session_type":"deep","capsule_status":"completa","role_key":"Esecuzione E3 SK-4","area":"MetaSkillSystem contratto capsula","environment":"branch env/test; solo documentazione","authorization":{"read":["METASKILL_SYSTEM_SKILL","PLAN_V0","CONTRATTO","PLAN-CURSOR-SK-4","rules.mjs righe 3-6"],"write":["CONTRATTO_CAPSULA_SESSIONE_V0.md","Report-sk4-e3","PLAN §9 riga E3"],"forbid":["scripts/mss","capsule storiche","src/","PLAN_V0 §4-bis S4"]},"authorized_outputs":["contratto allineato","mini-report E3"],"route":{"chosen":"Prompt-sk4-e3-contratto-23-08-26.md","alternatives_or_conflicts":"nessuno"},"observed_outcome":"CONTRATTO_CAPSULA_SESSIONE_V0.md allineato; titolo §3 §2 §4 controls; avviso rollout E2","open_items":["E2 legacy enforcement","E1 path adapter","E4 integrazione"],"controls":[{"control_id":"GATE-G1-G2-G4","criterio":"PLAN §3 G1 G2 G4 = AUTORIZZATE prima di partire","esito":"pass","numeratore":3,"denominatore":3,"esecutore":"cursor-agent-e3","evidence_refs":["owner-plan-sk4"]},{"control_id":"CONTRACT-BODY-VERSION","criterio":"§3 identità canonica = rules.mjs SCHEMA_CURRENT/REVISION_CURRENT","esito":"pass","numeratore":2,"denominatore":2,"esecutore":"cursor-agent-e3","evidence_refs":["owner-contract","owner-rules"]},{"control_id":"SECTION2-PATH-PREFIX","criterio":"§2 cita sotto-cartelle e prefissi Report-/Verbale- con regex G1/G2","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-agent-e3","evidence_refs":["owner-contract"]}],"subject_runtime":{"actor_id":"cursor-agent-e3","provider":"Cursor","model":"Claude","runtime":"Cursor Agent","surface":"Cursor IDE"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["path doc","diff contratto","gate SK-4"],"prohibited_content":["dati personali","segreti"],"redactions":"nessuno","external_release":"forbidden","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-contract","owner_id":"mss-contract-v0.1","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"sk4-e3-align","revision_or_hash":"23-08-26-e3","sensitivity":"internal"},{"ref_id":"owner-plan-sk4","owner_id":"sk4-cursor-plan","uri_or_path":"docs/Sessioni di lavoro/23-08-26/PLAN-CURSOR-SK-4-23-08-26.md","stable_anchor_or_event_id":"G1-G4","revision_or_hash":"23-08-26","sensitivity":"internal"},{"ref_id":"owner-rules","owner_id":"mss-rules","uri_or_path":"scripts/mss/rules.mjs","stable_anchor_or_event_id":"SCHEMA_CURRENT","revision_or_hash":"lines-3-6","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-prompt","owner_id":"conversation","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Prompt-sk4-e3-contratto-23-08-26.md","stable_anchor_or_event_id":"mandate-e3","revision_or_hash":"23-08-26","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198c100-0003-7000-8000-000000000002","session_id":"mss-ses-0198c100-0003-7000-8000-000000000010","correlation_id":"mss-cor-0198c100-0003-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198c100-0003-7000-8000-000000000010/1/annotation/1","created_at":"2026-08-23T10:30:01+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-agent-e3","actor_type":"agente","role":"sk4_e3_contract_aligner","agent_runtime":{"provider":"Cursor","model":"Claude","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Read"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198c100-0003-7000-8000-000000000040","axis":"persona","subject_record_ids":["mss-rec-0198c100-0003-7000-8000-000000000001"],"delta":"nessuno","assertions":[{"signal":"non_osservato","actor":"matteo","assistance":"guidato","origin":"naturale","source_ref":"source-prompt","effect":"autorizzazione G1 G2 G4 e avvio E3","evidence_state":"observed"}],"asserted_by":{"actor_id":"cursor-agent-e3","role":"sk4_e3_contract_aligner","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile:doc-only","evidence_refs":["source-prompt"],"notes":"nessuna valutazione Persona"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198c100-0003-7000-8000-000000000003","session_id":"mss-ses-0198c100-0003-7000-8000-000000000010","correlation_id":"mss-cor-0198c100-0003-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198c100-0003-7000-8000-000000000010/1/annotation/2","created_at":"2026-08-23T10:30:02+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-agent-e3","actor_type":"agente","role":"sk4_e3_contract_aligner","agent_runtime":{"provider":"Cursor","model":"Claude","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write","Grep"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"annotation":{"annotation_id":"mss-ann-0198c100-0003-7000-8000-000000000050","axis":"sistema","subject_record_ids":["mss-rec-0198c100-0003-7000-8000-000000000001"],"delta":"disallineamento contratto -> allineato 0.1.1/freeze-2","assertions":[{"rule_id_version":"SK-4/S4@mss-v0.1-wp0.1-freeze-2","trigger_event":"E3 contratto G4","decision_or_output_changed":"owner schema capsula riallineato; bypass B1 documentale chiuso lato contratto","G":2,"O":2,"E":1}],"asserted_by":{"actor_id":"cursor-agent-e3","role":"sk4_e3_contract_aligner","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-contract","evidence_refs":["owner-contract"],"notes":"enforcement codice B1 resta E2"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198c100-0003-7000-8000-000000000004","session_id":"mss-ses-0198c100-0003-7000-8000-000000000010","correlation_id":"mss-cor-0198c100-0003-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198c100-0003-7000-8000-000000000010/1/annotation/3","created_at":"2026-08-23T10:30:03+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-agent-e3","actor_type":"agente","role":"sk4_e3_contract_aligner","agent_runtime":{"provider":"Cursor","model":"Claude","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"annotation":{"annotation_id":"mss-ann-0198c100-0003-7000-8000-000000000060","axis":"output","subject_record_ids":["mss-rec-0198c100-0003-7000-8000-000000000001"],"delta":"modificato","assertions":[{"output_id":"SK4-OUT-contract-aligned-e3","primary_type":"governance","canonical_version":"23-08-26-e3","recipient":"agenti MSS e E4 integrazione","problem_or_job":"contratto invitava a 0.1.0 senza controls","intended_use":"scrivere capsule valide senza bypass B1 documentale","conceived_by":"SK-4 piano","decided_by":"G4 Matteo 23-08-26","directed_by":"Prompt-sk4-e3","authored_by":"cursor-agent-e3","verified_by":"grep sezioni + lettura rules.mjs","acceptance_criterion":"§3 0.1.1 canonico; §2 path; controls documentato","verification_or_use_evidence":"file riscritto e grep verificato","verification_status":"self_report","owner_ref":"owner-contract","privacy_release":"internal","support_files":[],"relations_no_double_count":["solo contratto owner"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-agent-e3","role":"sk4_e3_contract_aligner","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-contract","evidence_refs":["owner-contract"],"notes":"governance doc; chiusura SK-4 resta E4+Matteo"}}}
```

## 6. Chiusura sessione — Q/R verbatim

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «E3 Contratto @docs/Sessioni di lavoro/23-08-26/Prompt-sk4-e3-contratto-23-08-26.md leggi il file e il resto della documentazione necessaria per avere ben chiaro il contesto e come lavorare. poi procedi»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato aprendo `CONTRATTO_CAPSULA_SESSIONE_V0.md` (titolo, avviso, §2 regex, §3 coppia viva vs legacy, §4 controls), `scripts/mss/rules.mjs` righe 3–6 (`0.1.1`/`freeze-2`), `PLAN-CURSOR-SK-4-23-08-26.md` §3 gate G1/G2/G4 = AUTORIZZATE, §9 E3 era NON INIZIATO. Grep su contratto: `0.1.0`/`freeze-1` solo in contesto legacy/rollout, non nel blocco identità canonico.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessun altro file da allineare nel perimetro E3. `METASKILL_SYSTEM_SKILL.md` punta al contratto come owner — non richiede edit (smista, non duplica schema). `PLAN_V0.md` §4-bis S4 resta a E4 post-prove. Fixture e `core.mjs` restano a E2. Nessun test toccato (mandato esclude `scripts/`).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non modificato codice `.mjs` (E2/E1). Non aggiornato `PLAN_V0.md` §4-bis S4 (E4). Non riscritte capsule storiche. Non implementato enforcement `MSS-LEGACY-NEW-FORBIDDEN` — esplicitamente slot E2. Avviso mantiene nota rollout finché E2 non merge, come da mandato punto 4.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: Attrito minimo: disallineamento storico era già documentato nell'avviso 21-08, quindi il diff era meccanico — miglioria: dopo E4, rimuovere del tutto l'avviso rollout e lasciare solo un richiamo one-liner in `METASKILL_SYSTEM_SKILL.md` §ordine di lavoro. Verificato che `controls` non era nel template §4 nonostante fosse vitale in validator.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto — mandato E3 + PLAN SK-4 + contratto + rules.mjs righe 3–6 bastano; non serviva APP_CONTEXT né src. Nessun hook ricevuto in questa chat; regole workspace comandi-base applicate implicitamente.
