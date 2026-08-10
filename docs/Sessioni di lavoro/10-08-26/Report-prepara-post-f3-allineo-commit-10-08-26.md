# Report — Prepara prompt post-F3 + allineo docs + commit F3

**Modalità:** standard · MetaSkillSystem / Senior Eval Pack
**Profilo:** Meta — prepara prompt + allineo documentazione + commit slice F3
**Configurazione agente:** `SEP-AGC-xai-cursor-001` · Cursor Grok 4.5
**Session pack:** `SEP-SES-20260810-029`
**Capsule session:** `mss-ses-019fec50-0290-7000-8000-000000000029`
**Data:** 10-08-2026

> Zero nuova migrazione. Commit dello slice F3 (`028`). Prompt review breve pronto. Push vietato salvo nuovo ordine.

---

## Cappello

- **Cosa è cambiato:** documentazione allineata allo stato «F3 eseguito»; prompt per la prossima chat (review breve); commit dello slice F3.
- **Cosa resta:** lanciare la review (o stop); push solo se lo chiedi.
- **Serve una tua azione:** sì — incollare il prompt review in Agent (nuova chat), oppure stop.

---

## 1. Stato reale pre-commit (questa seduta)

| Campo | Valore |
|---|---|
| Branch | `env/test` |
| HEAD base | `5084ff0` (remediation + go/no-go) |
| Slice F3 | staged (move+stub+L1/L2+owner+report `028`) |
| L5 | fuori stage |
| Push | no |

---

## 2. Cosa è stato fatto

1. Confermato stato owner: F3 eseguito in `028`; G5 non PASS; prossimo = stop/review breve.
2. Scritto prompt autocontenuto: `Prompt-sep-11-post-f3-review-breve-10-08-26.md`.
3. Allineati HANDOFF / MASTERPLAN / ROADMAP / SESSION_LOG / README SEP-10 al fatto «prompt review pronto + commit F3».
4. Commit mirato dello slice F3 + allineo prepara (no L5, no push).

---

## 3. File toccati (oltre slice F3 già prodotto in `028`)

| File | Perché |
|---|---|
| `Prompt-sep-11-post-f3-review-breve-10-08-26.md` | prompt prossima chat |
| questo report `029` | traccia prepara+commit |
| MASTERPLAN / HANDOFF / ROADMAP / SESSION_LOG / SEP-10 README | stato reale + puntatore prompt |

---

## 6-bis. Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-019fec50-0291-7000-8000-000000000001","session_id":"mss-ses-019fec50-0290-7000-8000-000000000029","correlation_id":"mss-cor-019fec50-0240-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec50-0290-7000-8000-000000000029/1/session_event/1","created_at":"2026-08-10T16:40:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep11-prepara-029","actor_type":"agente","role":"senior_eval_pack_prepara_commit","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["PowerShell","Git","Read","Write","StrReplace"]},"packages_loaded":[{"package_id":"prepara-prompt","package_version_or_revision":"working-tree","source_ref":"docs/PREPARA_PROMPT_SKILL.md"},{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md"},{"package_id":"communication-closure","package_version_or_revision":"working-tree","source_ref":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md"}],"event":{"event_id":"mss-evt-019fec50-0291-7000-8000-0000000000e1","event_kind":"session_close","occurred_at":"2026-08-10T16:40:00+02:00","continues_record_id":"nessuno","causation_record_id":"mss-rec-019fec50-0281-7000-8000-000000000001","intent_user":"Prepara prompt prossima sessione; allinea docs per senior; commit lavoro F3; no push","session_type":"standard","capsule_status":"completa","role_key":"Meta prepara + commit","area":"MetaSkillSystem Senior-Eval-Pack SEP-11 post-F3","environment":"branch env/test; HEAD base 5084ff0; commit F3; no push; L5 escluso","authorization":{"read":["028","MASTERPLAN","HANDOFF","PREPARA_PROMPT"],"write":["prompt review","questo report","MASTERPLAN","HANDOFF","ROADMAP","SESSION_LOG","commit F3"],"forbid":["push","touch L5","F4","PLAN rewrite stato","SEP-G5 PASS","Valutazione Personale"]},"authorized_outputs":["prompt review file","report 029","owner allineati","commit F3"],"route":{"chosen":"PREPARA_PROMPT + SENIOR_EVAL masterplan/handoff","alternatives_or_conflicts":"nessuno"},"observed_outcome":"docs allineate; prompt review breve pronto; commit slice F3; SEP-G5 non PASS; no push","open_items":["esecuzione review breve o stop","push su mandato futuro"],"controls":[{"control_id":"NO-PUSH","criterio":"nessun push","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-grok-sep11-prepara-029","evidence_refs":["owner-report"]},{"control_id":"NO-SEP-G5-PASS","criterio":"nessuna dichiarazione SEP-G5 PASS","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-grok-sep11-prepara-029","evidence_refs":["owner-masterplan"]},{"control_id":"PROMPT-READY","criterio":"file prompt review presente e puntato da handoff","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-grok-sep11-prepara-029","evidence_refs":["owner-prompt"]}],"subject_runtime":{"actor_id":"mss.senior-eval-pack/0.1.0","provider":"non_applicabile:oggetto documentale","model":"non_applicabile:oggetto documentale","runtime":"docs/MetaSkillSystem/Senior-Eval-Pack","surface":"markdown pack"},"privacy":{"classification":"internal","capture_basis":"user_request","allowed_content":["path","git metadata","decisioni","quadro SEP"],"prohibited_content":["Valutazione Personale","segreti"],"redactions":"nessuno","external_release":"forbidden","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-report","owner_id":"SEP-SES-20260810-029","uri_or_path":"docs/Sessioni di lavoro/10-08-26/Report-prepara-post-f3-allineo-commit-10-08-26.md","stable_anchor_or_event_id":"PREPARA-029","revision_or_hash":"working-tree-10-08-26","sensitivity":"internal"},{"ref_id":"owner-prompt","owner_id":"SEP-SES-20260810-029","uri_or_path":"docs/Sessioni di lavoro/10-08-26/Prompt-sep-11-post-f3-review-breve-10-08-26.md","stable_anchor_or_event_id":"REVIEW-PROMPT","revision_or_hash":"working-tree","sensitivity":"internal"},{"ref_id":"owner-masterplan","owner_id":"mss.senior-eval-masterplan","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md","stable_anchor_or_event_id":"SEP-11-post-F3","revision_or_hash":"working-tree","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-user","owner_id":"conversation","uri_or_path":"conversation:this-session","stable_anchor_or_event_id":"prepara-plus-commit","revision_or_hash":"10-08-26","sensitivity":"internal"},{"ref_id":"source-028","owner_id":"SEP-SES-20260810-028","uri_or_path":"docs/Sessioni di lavoro/10-08-26/Report-sep-11-f3-move-report001-10-08-26.md","stable_anchor_or_event_id":"F3-M03","revision_or_hash":"working-tree","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fec50-0292-7000-8000-000000000002","session_id":"mss-ses-019fec50-0290-7000-8000-000000000029","correlation_id":"mss-cor-019fec50-0240-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec50-0290-7000-8000-000000000029/1/annotation/1","created_at":"2026-08-10T16:40:01+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep11-prepara-029","actor_type":"agente","role":"senior_eval_pack_prepara_commit","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Read"]},"packages_loaded":[{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fec50-0292-7000-8000-0000000000a1","axis":"persona","subject_record_ids":["mss-rec-019fec50-0291-7000-8000-000000000001"],"delta":"prepara assente -> prompt review + commit F3 allineati","assertions":[{"signal":"decisione_esplicita","actor":"matteo","assistance":"non_applicabile:governance","origin":"naturale","source_ref":"source-user","effect":"prompt review; docs allineate; commit F3; no push implicito","evidence_state":"observed"}],"asserted_by":{"actor_id":"cursor-grok-sep11-prepara-029","role":"senior_eval_pack_prepara_commit","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:decisione Matteo","criterion_ref":"non_applicabile:governance","evidence_refs":["source-user"],"notes":"nessuna inferenza profilo"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fec50-0293-7000-8000-000000000003","session_id":"mss-ses-019fec50-0290-7000-8000-000000000029","correlation_id":"mss-cor-019fec50-0240-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec50-0290-7000-8000-000000000029/1/annotation/2","created_at":"2026-08-10T16:40:02+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep11-prepara-029","actor_type":"agente","role":"senior_eval_pack_prepara_commit","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write","Git"]},"packages_loaded":[{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md"}],"annotation":{"annotation_id":"mss-ann-019fec50-0293-7000-8000-0000000000a2","axis":"sistema","subject_record_ids":["mss-rec-019fec50-0291-7000-8000-000000000001"],"delta":"F3 staged non committed -> F3 committed; prossimo = review breve via prompt","assertions":[{"rule_id_version":"SEP-11-post-F3-prepara@mss.senior-eval-pack/0.1.0","trigger_event":"mandato prepara+commit","decision_or_output_changed":"handoff punta prompt review; G5 non PASS","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"cursor-grok-sep11-prepara-029","role":"senior_eval_pack_prepara_commit","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-masterplan","evidence_refs":["owner-report","owner-prompt"],"notes":"E = commit locale; push ancora no"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fec50-0294-7000-8000-000000000004","session_id":"mss-ses-019fec50-0290-7000-8000-000000000029","correlation_id":"mss-cor-019fec50-0240-7000-8000-0000000000c1","segment_no":1,"capture_key":"mss-ses-019fec50-0290-7000-8000-000000000029/1/annotation/3","created_at":"2026-08-10T16:40:03+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-sep11-prepara-029","actor_type":"agente","role":"senior_eval_pack_prepara_commit","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write"]},"packages_loaded":[{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fec50-0294-7000-8000-0000000000a3","axis":"output","subject_record_ids":["mss-rec-019fec50-0291-7000-8000-000000000001"],"delta":"creato","assertions":[{"output_id":"SEP-OUT-prepara-post-f3-0.1","primary_type":"governance","canonical_version":"2026-08-10-v1","recipient":"Matteo","problem_or_job":"chiudere F3 in git e consegnare prompt review senza allargare perimetro","intended_use":"incollare prompt review in chat nuova o stop","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"prepara+allineo+commit","authored_by":"cursor-grok-sep11-prepara-029","verified_by":"allineamento owner + file prompt","acceptance_criterion":"F3 committed; prompt review presente; G5 non PASS; no push","verification_or_use_evidence":"report 029; Prompt post-f3; masterplan/handoff","verification_status":"self_report","owner_ref":"owner-report","privacy_release":"internal","support_files":["docs/Sessioni di lavoro/10-08-26/Prompt-sep-11-post-f3-review-breve-10-08-26.md"],"relations_no_double_count":["un commit F3; prompt e vista non stato"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-grok-sep11-prepara-029","role":"senior_eval_pack_prepara_commit","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-report","evidence_refs":["owner-prompt"],"notes":"output governance"}}}
```

---

## 14. Domande di chiusura

❓ Q1 — Prompt ricevuti VERBATIM sostanziali?
✅ R1: (1) «prepara prompt per prossima sessione e aggiorna documentazione per rispecchiare stato reale de lavori. allinea documentazione per prossimo agente senior che riprenderà i lavori. - fai commit lavoro svolto alla fine.»

❓ Q2 — Dati = diff reale?
✅ R2: Slice F3 (move+stub+L1/L2+owner+report 028) + prompt review + report 029 + allineo handoff/masterplan; L5 escluso; no push.

❓ Q3 — File correlati allineati?
✅ R3: MASTERPLAN, HANDOFF, ROADMAP, SESSION_LOG, SEP-10 README, Prompt review, report 029. PLAN_V0 non riscritto.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non push; non F4; non touch L5; non G5 PASS; non review eseguita (solo preparata).

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito = WT rumoroso L5; miglioria = prompt review versionato come F3.

❓ Q6 — Contesto & hook?
✅ R6: Contesto prepara+SEP-11 corretto; chiusura Q/R + capsula.

---

## Chiusura verso Matteo (max 5)

1. Documentazione allineata: F3 fatto; G5 no.
2. Prompt review breve pronto (file in Sessioni 10-08).
3. Commit slice F3 + allineo (locale).
4. **Niente push**.
5. Prossimo: incolla il prompt in chat nuova, oppure stop.
