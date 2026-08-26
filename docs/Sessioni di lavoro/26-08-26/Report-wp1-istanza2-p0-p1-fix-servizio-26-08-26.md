# Report — WP-1 istanza 2: P0 multi-tavolo + P1 refresh Servizio

**Data:** 26-08-2026 · **Branch:** `env/test` · **Ambiente:** TEST only  
**Profilo:** Esecuzione (dopo diagnosi Verifica) · MSS-PILOT-001 ombra · **WP-1 non chiuso**

---

### 1. Cappello

- **Cosa è cambiato:** In Servizio, «Rimetti in attesa» / «Archivia» su una prenotazione con più tavoli liberano **tutta** la tavolata; dopo «Nuova prenotazione» admin la lista «da assegnare» si aggiorna **senza F5**.
- **Cosa resta:** voci checklist `[O]` (V3, V5, T10, T16) non fixate; decisione prodotto **turni tavolo**; ritest umano P0/P1; WP-1 IN PILOTA.
- **Serve una tua azione:** sì — ritesta P0/P1 in Servizio; poi chat senior col prompt allegato.

---

### 2. Cosa è stato fatto

1. Diagnosi collaudo (T7-bis / `[O]`) → UX T9 + path checklist T7-bis.
2. Collaudo Matteo: checklist **26/26** con riserve su T7-bis/T9.
3. **P0:** forzatura guidata libera tutti i tavoli della prenotazione scavalcata (requeue DELETE / archive checkout).
4. **P1:** create admin invalida `table_assignments` + refetch on focus.
5. Skill Servizio allineata; prompt senior per comunicazione + turni + prepara fix `[O]`.

---

### 3. File toccati e perché

| File | Perché |
|---|---|
| `src/features/booking/hooks/useTableAssignments.ts` | P0 multi-tavolo + refetchOnWindowFocus |
| `src/features/booking/hooks/useAdminBookingRequests.ts` | P1 invalidate Servizio |
| `src/features/booking/components/AdminBookingForm.tsx` | P1 invalidate `table_assignments` |
| `src/features/booking/components/servizio/AssignmentMapPanel.tsx` | UX T9 overlay/hint (giro precedente stessa chat) |
| test sostituzioneGuidata / fix2 / appendOnly | mock `.in` + casi multi-tavolo |
| `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md` | 26/26, path T7-bis/T9 |
| `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` | comportamento P0/P1 |
| `docs/Comunicazione-Skill/OSSERVAZIONI.md` | feedback output causa→effetto |
| questo report + prompt senior | chiusura + handoff |

---

### 4. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| vitest sostituzioneGuidata + fix2 + appendOnly + useAdminBookingRequests + AssignmentMapPanel.sostituzioneGuidata | **29/29 pass** |
| `npm run mss:status` | WP-1 IN PILOTA ombra |
| `npm run test:mss` | pass (in capsula) |
| `npm run validate:mss -- --mode file --file "…Report-wp1-istanza2-p0-p1…" --kind report --require-capsule` | **OK** (dopo ripresa fail sotto) |

`npm run validate` full suite: non rilanciata intera in chiusura (gate mirati P0/P1 verdi).

#### 4-bis. Fail procedura capsula (obbligatorio registrare — dato per Meta senior)

> **Regola raccolta:** ogni fail di `mss:capsule` / `validate:mss` in chiusura va **sempre** scritto nel report (comando, codice deny, causa, ripresa). Non basta «poi è andata». Fonte: mandato Matteo 26-08-26.

| # | Comando / sintomo | Deny / exit | Causa (procedura agente) | Ripresa |
|---|---|---|---|---|
| 1 | `mss:capsule --append-to` report | exit 2 · `MSS-PARSE-JSONL-AMBIGUOUS` | Nel report c’era già un titolo «Capsula MetaSkillSystem» (sez. 6-bis) **senza** JSONL → append rifiutato | Rinominata 6-bis in «Registrazione MSS…»; append su sezione unica in coda |
| 2 | `mss:capsule` con judgments minimali | exit 2 · `MSS-OUTPUT-ASSERTION` / `MSS-SYSTEM-ASSERTION` / `MSS-PRODUCT-GATE` | Judgments inventati a mano incompleti (mancavano campi asse output/sistema tipo `product_candidate`, `rule_id_version`, …) | Judgments allineati allo schema del report chiusura collaudo 26-08; capsula OK + `validate:mss` OK |
| 3 | `git commit` P0/P1 ereditato | hook `MSS-REPORT-NO-CAPSULE` | Il report precedente di diagnosi T7-bis/[O] era ancora privo di capsula; il controllo esamina anche gli artefatti MSS non staged | Chiuso retroattivamente quel report con Q/R + judgments + capsula generata, quindi rieseguire i due commit separati |

**Lezione operativa:** (a) non dichiarare «Capsula MetaSkillSystem» finché non c’è il blocco `jsonl`; (b) riusare uno `judgments-*.json` già validato come stampo, non un bozza ridotta.

---

### 5. File di skill aggiornati

| file | modifica | perché |
|---|---|---|
| `ADMIN_SERVIZIO_CONTEXT.md` | Archivia/In attesa = tutta tavolata; invalidate create admin | comportamento prodotto cambiato |
| `COLLAUDO_MANUALE_OBBLIGATORIO.md` | conteggio 26/26; path T7-bis/T9 | collaudo |
| `OSSERVAZIONI.md` | preferenza output causa→effetto | Meta senior |

---

### 6. Dati comunicazione

- Frasi Matteo: «causa effetto soluzione»; «troppe domande»; «implementiamo P0 e P1»; «fai report finale»; «prompt senior… turni… voci O».
- Formato che ha funzionato: tabella causa→effetto→soluzione + ordine 1-2-3.
- Annotato: 2 istanze comunicazione (output verboso diagnosi; correzione formato) → da analizzare in chat senior.

### 6-bis. Registrazione MSS (capsula in coda)

Vedi blocco JSONL in coda del report. Controls: MSS-STATUS, TEST-MSS, VITEST-P0-P1.

---

### 7. Analisi flusso prompt / efficienza

- Modalità deep → esecuzione P0/P1 nella stessa chat dopo collaudo.
- Blocco ask-mode a metà P0 (mock `.in`) → ripresa in agent.
- Sub-agent explore diagnosi utili; output parent troppo denso → correzione Matteo.
- **Errori procedura chiusura MSS:** 2 fail capsula prima del verde (§4-bis) — pattern da accumulare in OSSERVAZIONI / Meta senior.

### 8. La tua lettura della sessione

Checklist umana chiusa con riserve; debito `[O]` e turni restano prodotto/senior. P0/P1 chiudono i due bug che bloccavano il ritest T9. WP-1 non va dichiarato chiuso.

### 9. Follow-up

| ID | Azione |
|---|---|
| Ritest P0 | Prenotazione multi-tavolo → Rimetti in attesa / Archivia → tutta libera |
| Ritest P1 | Nuova prenotazione admin → Servizio senza F5 |
| `[O]` V3 V5 T10 T16 | Prompt fix via senior |
| Turni tavolo | Decisione prodotto in chat senior |
| FU-SERV-TURNO-SALA-1 | P6 ancora aperto |

### 10. MSS istanza 2 vs skill normale

Orchestrazione: diagnosi Verifica + explore → esecuzione fix → chiusura docs/capsula. Cutover vietato. Persona: `non_osservato` su promozioni.

---
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03e9b-07f2-7dd2-9f27-1b57e0e8071f","correlation_id":"mss-cor-01a03e9b-07f2-7c87-8c4d-a326cd09843b","segment_no":1,"created_at":"2026-08-26T17:05:42+02:00","finalization":"final","recorded_by":{"actor_id":"agent-cursor-composer-26-08-p0p1","actor_type":"agente","role":"agente-esecuzione-wp1-p0-p1","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["vitest","Shell"]},"packages_loaded":[{"package_id":"calendarbackup-admin","package_version_or_revision":"pointer","source_ref":".cursor/skills/calendarbackup-admin/SKILL.md"}],"record_type":"session_event","record_id":"mss-rec-01a03e9b-07f2-7daa-a0fa-d5c61eebbbe6","capture_key":"mss-ses-01a03e9b-07f2-7dd2-9f27-1b57e0e8071f/1/session_event/1","event":{"event_id":"mss-evt-01a03e9b-07f2-79e9-bc49-fd0491b07f38","event_kind":"session_close","occurred_at":"2026-08-26T17:05:42+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"agente-esecuzione-wp1-p0-p1","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 60bb537; 15 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/26-08-26/Report-wp1-istanza2-p0-p1-fix-servizio-26-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/26-08-26/Report-wp1-istanza2-p0-p1-fix-servizio-26-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"MSS-STATUS","criterio":"npm run mss:status (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run mss:status (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"TEST-MSS","criterio":"npm run test:mss (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"VITEST-P0-P1","criterio":"npx vitest run src/features/booking/hooks/__tests__/useTableAssignments.sostituzioneGuidata.test.ts --reporter=dot (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npx vitest run src/features/booking/hooks/__tests__/useTableAssignments.sostituzioneGuidata.test.ts --reporter=dot (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"60bb537","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/OSSERVAZIONI.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"60bb537","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/Sessioni di lavoro/26-08-26/Prompt-analisi-collaudo-e-raccolta-fix-servizio-26-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"60bb537","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"60bb537","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"src/features/booking/components/AdminBookingForm.tsx","stable_anchor_or_event_id":"working tree","revision_or_hash":"60bb537","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"src/features/booking/components/servizio/AssignmentMapPanel.tsx","stable_anchor_or_event_id":"working tree","revision_or_hash":"60bb537","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"src/features/booking/hooks/__tests__/useTableAssignments.appendOnly.test.ts","stable_anchor_or_event_id":"working tree","revision_or_hash":"60bb537","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"src/features/booking/hooks/__tests__/useTableAssignments.fix2.test.ts","stable_anchor_or_event_id":"working tree","revision_or_hash":"60bb537","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"src/features/booking/hooks/__tests__/useTableAssignments.sostituzioneGuidata.test.ts","stable_anchor_or_event_id":"working tree","revision_or_hash":"60bb537","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"src/features/booking/hooks/useAdminBookingRequests.ts","stable_anchor_or_event_id":"working tree","revision_or_hash":"60bb537","sensitivity":"internal"},{"ref_id":"source-git-11","owner_id":"git-working-tree","uri_or_path":"src/features/booking/hooks/useTableAssignments.ts","stable_anchor_or_event_id":"working tree","revision_or_hash":"60bb537","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03e9b-07f2-7dd2-9f27-1b57e0e8071f","correlation_id":"mss-cor-01a03e9b-07f2-7c87-8c4d-a326cd09843b","segment_no":1,"created_at":"2026-08-26T17:05:42+02:00","finalization":"final","recorded_by":{"actor_id":"agent-cursor-composer-26-08-p0p1","actor_type":"agente","role":"agente-esecuzione-wp1-p0-p1","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["vitest","Shell"]},"packages_loaded":[{"package_id":"calendarbackup-admin","package_version_or_revision":"pointer","source_ref":".cursor/skills/calendarbackup-admin/SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a03e9b-07f2-752f-8f3b-d93015f4e054","capture_key":"mss-ses-01a03e9b-07f2-7dd2-9f27-1b57e0e8071f/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a03e9b-07f2-7d19-ae68-0c87c057fec8","axis":"persona","subject_record_ids":["mss-rec-01a03e9b-07f2-7daa-a0fa-d5c61eebbbe6"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"agent-cursor-composer-26-08-p0p1","role":"agente-esecuzione-wp1-p0-p1","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03e9b-07f2-7dd2-9f27-1b57e0e8071f","correlation_id":"mss-cor-01a03e9b-07f2-7c87-8c4d-a326cd09843b","segment_no":1,"created_at":"2026-08-26T17:05:42+02:00","finalization":"final","recorded_by":{"actor_id":"agent-cursor-composer-26-08-p0p1","actor_type":"agente","role":"agente-esecuzione-wp1-p0-p1","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["vitest","Shell"]},"packages_loaded":[{"package_id":"calendarbackup-admin","package_version_or_revision":"pointer","source_ref":".cursor/skills/calendarbackup-admin/SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a03e9b-07f2-78a8-bca0-57741152bb84","capture_key":"mss-ses-01a03e9b-07f2-7dd2-9f27-1b57e0e8071f/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a03e9b-07f2-7ea0-8ac4-57c757373256","axis":"sistema","subject_record_ids":["mss-rec-01a03e9b-07f2-7daa-a0fa-d5c61eebbbe6"],"delta":"modificato","assertions":[{"rule_id_version":"WP1-I2-P0-P1@mss-v0.1-wp0.1-freeze-2","trigger_event":"Fix P0 multi-tavolo force-replace + P1 invalidate Servizio dopo create admin; collaudo 26/26 con riserve; ritest checklist aggiornata","decision_or_output_changed":"useForceReplace archive/requeue liberano tutta la tavolata; useCreateAdminBooking invalida TABLE_ASSIGNMENTS_QUERY_KEY; COLLAUDO sezione RITEST; WP-1 resta IN PILOTA ombra; cutover vietato","G":2,"O":1,"E":0}],"asserted_by":{"actor_id":"agent-cursor-composer-26-08-p0p1","role":"agente-esecuzione-wp1-p0-p1","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03e9b-07f2-7dd2-9f27-1b57e0e8071f","correlation_id":"mss-cor-01a03e9b-07f2-7c87-8c4d-a326cd09843b","segment_no":1,"created_at":"2026-08-26T17:05:42+02:00","finalization":"final","recorded_by":{"actor_id":"agent-cursor-composer-26-08-p0p1","actor_type":"agente","role":"agente-esecuzione-wp1-p0-p1","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["vitest","Shell"]},"packages_loaded":[{"package_id":"calendarbackup-admin","package_version_or_revision":"pointer","source_ref":".cursor/skills/calendarbackup-admin/SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a03e9b-07f2-72c3-aab4-4cf242dedf79","capture_key":"mss-ses-01a03e9b-07f2-7dd2-9f27-1b57e0e8071f/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a03e9b-07f2-7319-8286-1b51998ada65","axis":"output","subject_record_ids":["mss-rec-01a03e9b-07f2-7daa-a0fa-d5c61eebbbe6"],"delta":"creato","assertions":[{"output_id":"report-wp1-istanza2-p0-p1-fix-servizio-26-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/26-08-26/Report-wp1-istanza2-p0-p1-fix-servizio-26-08-26.md","recipient":"Matteo","problem_or_job":"chiudere i bug che bloccavano ritest T9 (multi-tavolo + refresh) dopo collaudo 26/26","intended_use":"punto di ripristino fix P0/P1 su env/test; handoff ritest umano + chat senior turni/[O]","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"mandato chat implementiamo P0 e P1 + report finale + prompt senior","authored_by":"agent-cursor-composer-26-08-p0p1","verified_by":"non_osservato","acceptance_criterion":"vitest P0/P1 verdi; report + capsula validate:mss; COLLAUDO con RITEST; WP-1 non chiuso","verification_or_use_evidence":"vitest sostituzioneGuidata/fix2/appendOnly/useAdminBookingRequests; COLLAUDO RITEST; ADMIN_SERVIZIO_CONTEXT","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md","docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md","src/features/booking/hooks/useTableAssignments.ts","src/features/booking/hooks/useAdminBookingRequests.ts"],"relations_no_double_count":["Non chiude WP-1; non fixa voci [O] V3/V5/T10/T16; non decide turni-tavolo; P6 sala ancora aperto"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"agent-cursor-composer-26-08-p0p1","role":"agente-esecuzione-wp1-p0-p1","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
