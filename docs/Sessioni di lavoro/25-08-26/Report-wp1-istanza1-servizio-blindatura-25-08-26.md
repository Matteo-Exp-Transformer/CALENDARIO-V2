# Report — WP-1 istanza 1 ombra: blindatura Admin Servizio — 25-08-2026

**Modalità:** deep · **Profilo:** Verifica (+ fix mirati) · **Branch:** `env/test`
**Protocollo:** MSS-PILOT-001 · capsula `mss.session/0.1.1` / `freeze-2`
**HEAD seduta:** `be480a0` (= `origin/env/test`) · **Istanza:** 1 di N di `WP-1` — **non** chiude WP-1
**Esito in una riga:** batteria Servizio verde (Vitest 34→35 file / E2E 6+13); nessun regress prodotto da fix; aggiunti 5 test CRUD sala + nota debito `FU-SERV-TURNO-SALA-1`; cutover no.

## 1. Cappello

- **Cosa è cambiato:** in Admin → Servizio la rete di regressione automatica (unit + browser su TEST) è stata rieseguita e resta verde; create/update sala ora hanno unit dedicate che bloccano un ritorno indietro sul trim del nome e sul tenant.
- **Cosa resta:** FU Servizio aperti (manopole console, elimina-sala che brucia turno, badge cascata); revisione fredda di questa istanza; altre istanze WP-1; commit/push solo con sì.
- **Serve una tua azione:** sì — (1) priorità sui tre FU-SERV aperti (soprattutto elimina-sala vs tavolo); (2) sì/no commit di questi file test+indice; (3) aprire revisione fredda con capsula+owner.

## 2. Cosa è stato fatto

1. Passo 0: `npm run mss:status` → WP-1 IN PILOTA ombra; T14; branch `env/test`; cutover no.
2. Fotografia batteria: 34 file Vitest Servizio + `pro-service` + `pro-service-tables-lifecycle`.
3. Vitest Servizio: **34 file / 257 test** verdi (nessun rosso prodotto).
4. E2E staging TEST (`docnnernvpyrbwuzzach`): `pro-service` **6/6** (375/834/1280); lifecycle **13/13**.
5. Gap trovato: `useCreateRoom` / `useUpdateRoom` senza unit (solo mock nei test modale) → aggiunto `useRooms.createUpdate.test.tsx` (5 test).
6. Annotato in `useRooms.softDelete.test.tsx` il debito `FU-SERV-TURNO-SALA-1` (comportamento corrente pinato; fix prodotto non eseguito senza sì).
7. Indice test Admin aggiornato con i nuovi file.
8. `npm run validate:app` verde (1351 test, incluso i 5 nuovi). `npm run validate` intero rosso su **1** test MSS tools (lavagna WP-1) per stato PLAN già «IN PILOTA» — preesistente al perimetro Servizio di questa istanza, non allentato.

## 3. File toccati e perché

| File | Perché |
|---|---|
| `src/features/booking/hooks/__tests__/useRooms.createUpdate.test.tsx` | Nuovo — blindatura create/update sala |
| `src/features/booking/hooks/__tests__/useRooms.softDelete.test.tsx` | Commento debito FU-SERV-TURNO-SALA-1 sul pin D50 corrente |
| `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` | Inventario: softDelete + createUpdate |
| Questo report + judgments | Chiusura istanza (non WP-1) |

**Non toccati:** `src/` di prodotto Servizio (nessun regress da fixare); PROD; validator; cutover; FU prodotto.

## 4. Test eseguiti e risultato

| Comando | Esito | Copre |
|---|---|---|
| `npm run mss:status` | OK — WP-1 IN PILOTA ombra; T14 | Gate MSS |
| Vitest 34 file Servizio (lista in §10-bis) | **257/257** pass | Motore sale/tavoli/slot/assegnazioni/walk-in/stati |
| `npx playwright test e2e/pro/pro-service.spec.ts --workers=1` | **6/6** (~52s) | Smoke + modali 375/834/1280 |
| `npx playwright test e2e/pro/pro-service-tables-lifecycle.spec.ts --workers=1` | **13/13** (~1.1m) | Ciclo tavoli, fine turno, multi-tavolo, walk-in, fascia chiusa→pubblico |
| Vitest `useRooms.createUpdate` + `softDelete` | **11/11** | CRUD sala + soft-delete |
| `npm run validate:app` | **OK** — 164 file / **1351** test (run diretta) | Lint+tsc+Vitest app |
| `mss:capsule` control VALIDATE-APP | **non_noto** (ENOBUFS su stdout Vitest) | Stesso comando passa fuori capsula; non inventato pass |
| `npm run validate` (completo) | **FAIL** 1/73 MSS tools: lavagna «WP-1 NON INIZIATO…» vs stato vivo IN PILOTA | Fuori perimetro Servizio; da revisione MSS (classificazione `IN PILOTA`) |
| `validate:mss --require-capsule` su questo report | **OK** | Gate capsula |
| `npm run test:mss` | **OK** (H-1 suite green) | Suite H-1 |

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` | Righe createUpdate + softDelete | Inventario allineato ai test nuovi |
| `ADMIN_SERVIZIO_CONTEXT.md` / layout Servizio | nessuno | Nessun cambio comportamento UI/codice prodotto |

## 6. Dati comunicazione

- Frasi ricorrenti: mandato «prima istanza WP-1 ombra» / Servizio blindatura; divieti cutover e «WP-1 finito».
- Formato utile: elenco comandi+exit+cosa copre; FU aperti con domanda di priorità.
- Automatizzabile: checklist batteria Servizio (Vitest glob + due E2E); non automatizzare decisione FU senza sì.

## 6-bis. Riferimento capsula

Vedi blocco JSONL in fondo al report (generato con `mss:capsule`). Persona: `nessuno` (niente promozioni inventate).

## 7. Analisi flusso prompt

- Prompt sostanziali Matteo: 1 (mandato esecutore completo incollato).
- Correzioni dopo 1ª risposta: 0.
- Modalità alzata: no (già deep).
- Efficace: perimetro scrittura/vietati e criterio chiusura istanza ≠ WP-1 chiarissimi.

## 8. Lettura della sessione (agente)

- **Impressioni:** il vecchio skill system (Admin Servizio + Testing + chiusura 06-08) ha reso la fotografia immediata; batteria già densa → prima istanza = riesecuzione + gap CRUD sala, non riscrittura.
- **Difficoltà:** `validate` completo rosso per lavagna MSS vs PLAN «IN PILOTA» (stesso bug classificazione già notato in prep D27) — risolto documentando e usando `validate:app` come gate prodotto.
- **Miglioria (dato):** classificare `IN PILOTA`/`APERTO` in lavagna; eventuale script `npm run test:servizio` che lancia la lista file+e2e usata qui.

## 9. Derivazione errori

| Difficoltà | Classe |
|---|---|
| Nessun regress Servizio in Vitest/E2E | — |
| `validate` MSS tools 1 rosso (lavagna WP-1) | **bug preesistente** tooling MSS / classifyPlanState vs stato IN PILOTA (già osservato post-T12) |
| Elimina sala consuma turno | **bug/debito prodotto** già in `FU-SERV-TURNO-SALA-1` — non fixato (serve sì) |

## 10. Cosa resta

- **Decisione Matteo 25-08-26 (post-istanza):** tutti i FU Servizio aperti vanno fatti in **prossima seduta** (`FU-SERV-TURNO-SALA-1`, `FU-SERV-MANOPOLE-CONSOLE-1`, `FU-SERV-BADGE-CASCATA-1`). Revisione fredda **rimandata** finché anche i FU non sono chiusi.
- Altre istanze WP-1 (§7 PLAN); non dichiarare WP-1 chiuso.
- Commit istanza: **sì** (Matteo 25-08-26). Push: non richiesto in questa chat.

## 10-bis. Handoff al prossimo agente (revisione fredda / istanza 2)

**Cosa è vero adesso**

- WP-1 resta **IN PILOTA ombra**; cutover **vietato**.
- Batteria Servizio rieseguita verde: Vitest Servizio 257 + createUpdate 5; E2E 6+13 su TEST.
- Nessun fix prodotto `src/` (nessun rosso funzionale).
- Debito pinato: elimina sala viva ancora `UPDATE checked_out_at`.

**Prossimo task atomico:** prossima seduta — chiudere i tre FU-SERV-*; poi revisione fredda (capsula + owner) e eventuale istanza WP-1 successiva.

**Divieti:** cutover; «WP-1 finito»; inventare metriche Persona; `src/` fuori Servizio senza sì; PROD; allentare validator.

**Lista Vitest Servizio usata (34+1):**
`AssignmentMapPanel.*` (9), `serviceSlots*`, `servizioA1Fixes`, `servizioModalsGuard`, hook `useRooms*` / `useServiceSlots` / `useServizioTables*` / `useShiftBriefing` / `useTableAssignments*` / `useTableStatuses` / `useWalkIn*` / `useTableMode` / `walkIn.b2`, `resolveOccupancy`, `serviceSlotBookingFilter`, `tableTurnLimits`, `ServizioPage.*` (3).

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: path/revisione o hash; messaggi Matteo non in file → verbatim.
✅ R1: Mandato = `docs/Sessioni di lavoro/25-08-26/Prompt-esecutore-wp1-istanza1-servizio-blindatura-25-08-26.md` + messaggio chat con stessa intestazione. Skill lette nell’ordine del prompt. Nessun altro verbatim oltre al mandato.

❓ Q2 — Dati = diff reale?
✅ R2: Sì — §3 allineato a `git status` (createUpdate nuovo; softDelete commento; ADMIN_TEST_SUITE_INDEX); §4 = exit reali dei comandi.

❓ Q3 — File skill aggiornati completi?
✅ R3: Sì — solo `ADMIN_TEST_SUITE_INDEX.md`; nessuna skill layout/comportamento da allineare (nessun cambio UI prodotto).

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non fixato FU-SERV-*; non toccato src prodotto; non cutover; non chiuso WP-1; commit autorizzato da Matteo post-istanza; push non richiesto; non PROD; non allentato validator; non inventato metriche Persona.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito = `validate` pieno rosso per lavagna MSS. Miglioria: bucket `IN PILOTA` + script batteria Servizio.

❓ Q6 — Contesto & hook?
✅ R6: Contesto giusto (Verifica + Admin Servizio + Testing + chiusura 06-08). Hook Cursor: `non_osservato` oltre al mandato CHIUSURA_SESSIONE.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a039ea-889a-7091-a9a6-0c2f3b0f9bf2","correlation_id":"mss-cor-01a039ea-889a-7c07-a5a9-fae768b0f14b","segment_no":1,"created_at":"2026-08-25T19:14:26+02:00","finalization":"final","recorded_by":{"actor_id":"agente-verifica-wp1-i1-servizio","actor_type":"agente","role":"agente-verifica-wp1-i1-servizio","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"session_event","record_id":"mss-rec-01a039ea-889a-77b4-b281-346e77c7c4c5","capture_key":"mss-ses-01a039ea-889a-7091-a9a6-0c2f3b0f9bf2/1/session_event/1","event":{"event_id":"mss-evt-01a039ea-889a-7be3-958a-879ff75225e4","event_kind":"session_close","occurred_at":"2026-08-25T19:14:26+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"agente-verifica-wp1-i1-servizio","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 687b0ed; 5 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza1-servizio-blindatura-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza1-servizio-blindatura-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"STATUS","criterio":"npm run mss:status (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run mss:status (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"ROOMS-CRUD","criterio":"npx vitest run src/features/booking/hooks/__tests__/useRooms.createUpdate.test.tsx (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npx vitest run src/features/booking/hooks/__tests__/useRooms.createUpdate.test.tsx (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"VALIDATE-APP","criterio":"npm run validate:app","esito":"non_noto","numeratore":0,"denominatore":1,"esecutore":"mss:capsule: npm run validate:app (non eseguito — ENOBUFS)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"687b0ed","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"src/features/booking/hooks/__tests__/useRooms.softDelete.test.tsx","stable_anchor_or_event_id":"working tree","revision_or_hash":"687b0ed","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a039ea-889a-7091-a9a6-0c2f3b0f9bf2","correlation_id":"mss-cor-01a039ea-889a-7c07-a5a9-fae768b0f14b","segment_no":1,"created_at":"2026-08-25T19:14:26+02:00","finalization":"final","recorded_by":{"actor_id":"agente-verifica-wp1-i1-servizio","actor_type":"agente","role":"agente-verifica-wp1-i1-servizio","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a039ea-889a-7586-9044-0d0860c79f7a","capture_key":"mss-ses-01a039ea-889a-7091-a9a6-0c2f3b0f9bf2/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a039ea-889a-7f53-9bc5-0374877791e9","axis":"persona","subject_record_ids":["mss-rec-01a039ea-889a-77b4-b281-346e77c7c4c5"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"agente-verifica-wp1-i1-servizio","role":"agente-verifica-wp1-i1-servizio","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a039ea-889a-7091-a9a6-0c2f3b0f9bf2","correlation_id":"mss-cor-01a039ea-889a-7c07-a5a9-fae768b0f14b","segment_no":1,"created_at":"2026-08-25T19:14:26+02:00","finalization":"final","recorded_by":{"actor_id":"agente-verifica-wp1-i1-servizio","actor_type":"agente","role":"agente-verifica-wp1-i1-servizio","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a039ea-889a-7770-8e9a-e033eb6ba10e","capture_key":"mss-ses-01a039ea-889a-7091-a9a6-0c2f3b0f9bf2/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a039ea-889a-72a3-b031-85ddc369284c","axis":"sistema","subject_record_ids":["mss-rec-01a039ea-889a-77b4-b281-346e77c7c4c5"],"delta":"modificato","assertions":[{"rule_id_version":"WP1-I1-SERVIZIO@mss-v0.1-wp0.1-freeze-2","trigger_event":"Prima istanza WP-1 ombra: batteria Servizio + gap CRUD sala + nota FU-SERV-TURNO-SALA-1","decision_or_output_changed":"Rete regressione Servizio rieseguita verde; createUpdate unit aggiunte; FU prodotto non chiusi senza sì; WP-1 resta IN PILOTA (non chiuso); cutover vietato","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"agente-verifica-wp1-i1-servizio","role":"agente-verifica-wp1-i1-servizio","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a039ea-889a-7091-a9a6-0c2f3b0f9bf2","correlation_id":"mss-cor-01a039ea-889a-7c07-a5a9-fae768b0f14b","segment_no":1,"created_at":"2026-08-25T19:14:26+02:00","finalization":"final","recorded_by":{"actor_id":"agente-verifica-wp1-i1-servizio","actor_type":"agente","role":"agente-verifica-wp1-i1-servizio","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a039ea-889a-761e-87b7-8a8115eed67c","capture_key":"mss-ses-01a039ea-889a-7091-a9a6-0c2f3b0f9bf2/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a039ea-889a-79e4-9ca2-e7ba821db50c","axis":"output","subject_record_ids":["mss-rec-01a039ea-889a-77b4-b281-346e77c7c4c5"],"delta":"creato","assertions":[{"output_id":"report-wp1-istanza1-servizio-blindatura-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza1-servizio-blindatura-25-08-26.md","recipient":"Matteo","problem_or_job":"chiudere la prima istanza WP-1 ombra su Admin Servizio con prove e handoff","intended_use":"base per revisione fredda e priorità FU-SERV / istanza successiva","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"Prompt-esecutore-wp1-istanza1-servizio-blindatura-25-08-26.md","authored_by":"agente-verifica-wp1-i1-servizio","verified_by":"non_osservato","acceptance_criterion":"batteria Servizio dichiarata con exit; test nuovi elencati; capsula con controls reali; Persona senza promozioni; WP-1 non dichiarato finito; no cutover; no PROD","verification_or_use_evidence":"mss:status; vitest Servizio 257; playwright 6+13; validate:app 1351; createUpdate 5","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/Sessioni di lavoro/25-08-26/Prompt-esecutore-wp1-istanza1-servizio-blindatura-25-08-26.md","docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md","src/features/booking/hooks/__tests__/useRooms.createUpdate.test.tsx"],"relations_no_double_count":["Chiude istanza 1; non chiude WP-1; non esegue FU prodotto; non cutover"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"agente-verifica-wp1-i1-servizio","role":"agente-verifica-wp1-i1-servizio","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
