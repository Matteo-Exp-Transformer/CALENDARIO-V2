# Report — WP-1 istanza 2: checklist QA manuale Servizio

**Modalità:** deep · **Profilo:** Prepara / docs only · **Branch:** `env/test`
**Protocollo:** MSS-PILOT-001 · capsula `mss.session/0.1.1` / `freeze-2`
**HEAD seduta:** `bafb876` · **Istanza:** 2 di N di `WP-1` — **non** chiude WP-1
**Esito in una riga:** checklist umana Servizio aggiornata (setup QA-Manuale + V1–V8 + T1–T16 + T7-bis); gap-analysis consegnata; zero `src/`; cutover no.

> **Data:** 25-08-2026 · **Pilota:** MSS ombra WP-1 istanza 2
> **Mandato:** `Prompt-orchestrator-wp1-istanza2-checklist-qa-servizio-25-08-26.md` +
> `Piano-esecutore-wp1-istanza2-checklist-qa-servizio-25-08-26.md`

---

## 1. Cappello

- **Cosa è cambiato:** la checklist umana Servizio (`COLLAUDO_MANUALE_OBBLIGATORIO.md`) ora parte da zero con sala dedicata «QA-Manuale», include validazione modali (V1–V8), prove T1–T16 refreshate dalle etichette reali del codice, prova esplicita elimina sala vs tavolo (`FU-SERV-TURNO-SALA-1`) e §5 allineato alla blindatura WP-1 (257+19+5 test).
- **Cosa resta:** WP-1 **IN PILOTA ombra** (non chiuso); fix prodotto FU-SERV-* (P5/P6); **tu** esegui la checklist e mandi esiti `T# — OK/KO`; revisione fredda WP-1 dopo chiusura FU.
- **Serve una tua azione:** sì — eseguire `COLLAUDO_MANUALE_OBBLIGATORIO.md` in ordine e rispondere con righe esito §4.
- **Follow-up 26-08-26:** sequenze T1/T2/T5 chiarite (privata/in cognito esplicita + elenchi verticali); snellimento checklist; collaudo in corso **12/26** — vedi [`Report-chiarimento-checklist-collaudo-servizio-26-08-26.md`](../26-08-26/Report-chiarimento-checklist-collaudo-servizio-26-08-26.md). WP-1 **non** chiuso.

---

## 2. Cosa è stato fatto

1. Gate MSS: `npm run mss:status` → WP-1 IN PILOTA ombra, cutover vietato.
2. Gap-analysis voce-per-voce (62 voci S4 vs checklist 06-08 vs E2E/Vitest WP1) → tabelle INCLUSO/ESCLUSO/DA BUTTARE.
3. Schema blocchi 0 → 5 con stime (~3 h 15 totali).
4. Aggiornamento checklist umana: §0-bis setup, §1-bis validazione, T7-bis FU turno sala, §5 WP1, §6 obsolete, note manopole/badge.
5. Controverifica 3 etichette UI (Modifica sala/Configura sala, Tipo di salvataggio, Briefing).
6. Nota breve in `ADMIN_TEST_SUITE_INDEX.md` §5 Servizio.

---

## 3. File toccati

| File | Modifica |
|---|---|
| `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md` | Checklist umana completa WP1 istanza 2 |
| `docs/Sessioni di lavoro/25-08-26/Gap-analysis-Servizio-QA-manuale-25-08-26.md` | **Nuovo** — gap-analysis |
| `docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza2-checklist-qa-servizio-25-08-26.md` | **Nuovo** — questo report |
| `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` | Riga «checklist umana agg. 25-08-26» |

**Non toccati:** `src/`, migrazioni, skill layout Servizio (nessun cambio comportamento app).

---

## 4. Comandi eseguiti

| Comando | Esito | Note |
|---|---|---|
| `npm run mss:status` | exit 0 | WP-1 IN PILOTA ombra; cutover no; HEAD `bafb876` |
| `npm run mss:capsule` (append report) | exit 0 | controls: MSS-STATUS pass, TEST-MSS pass |
| `npm run validate:mss --require-capsule` | exit 0 | Gate chiusura istanza 2 |
| `npm run test:mss` | exit 0 | Eseguito dentro capsula (control TEST-MSS) |

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md` | Riscrittura istanza 2 | Deliverable mandato |
| `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` | Riga checklist umana | Inventario test allineato |
| `ADMIN_SERVIZIO_CONTEXT.md` / layout | nessuno | Zero cambio UI/prodotto |

---

## 6. Dati comunicazione

- Mandato sub-agent orchestrato: 4 fasi sequenziali, solo docs, zero `src/`.
- Decisioni vincolanti Matteo 25-08: sala QA-Manuale, aggiornare COLLAUDO_MANUALE (non file parallelo), FU solo verifica OK/KO.
- Formato utile: prove A/B/C, esiti `T# — OK/KO`, handoff esecuzione checklist a Matteo.

---

---

## 7. Analisi flusso prompt

- Prompt sostanziali: 1 (mandato orchestrator WP-1 istanza 2 completo).
- Correzioni dopo 1ª risposta: 0.
- Profilo mandato: deep / docs only (già nel prompt orchestrator).

---

## 8. Lettura della sessione (agente)

- **Impressioni:** il perimetro docs-only e la gap-analysis WP1 istanza 1 hanno reso rapido distinguere COPERTA vs umano; orchestrazione a fasi sequenziali evita sovrascritture.
- **Difficoltà:** etichetta modale sala «Configura sala» vs pulsante «Modifica sala» — risolto nella checklist con sequenza esplicita.
- **Miglioria (dato):** rigenerare automaticamente §5 «non rifare» quando cambia il conteggio Vitest/E2E (oggi allineamento manuale a ogni istanza WP-1).

---

## 9. Derivazione errori

| Difficoltà | Classe |
|---|---|
| Nessun errore prodotto | — |
| Mismatch etichetta sala | **debito documentale** pre-fix — corretto in checklist |

---

## 10. Cosa resta

- Matteo esegue checklist; esiti §4.
- WP-1 resta IN PILOTA; istanza successiva = fix FU-SERV-* (P5/P6) + revisione fredda.
- **Non** dichiarare WP-1 chiuso · **non** cutover.

---

## 10-bis. Handoff

**Cosa è vero adesso**

- Checklist umana Servizio aggiornata e autosufficiente (setup QA-Manuale incluso).
- Gap-analysis consegnata con classificazione 62 voci S4.
- Blindatura automatica WP1 istanza 1 invariata (257+19+5 verdi).
- FU aperti: `FU-SERV-TURNO-SALA-1`, `FU-SERV-MANOPOLE-CONSOLE-1`, `FU-SERV-BADGE-CASCATA-1` — solo verificati/annotati in checklist, zero fix `src/`.

**Prossimo task atomico:** Matteo → collaudo manuale file `COLLAUDO_MANUALE_OBBLIGATORIO.md`; poi seduta fix FU o istanza WP-1 successiva.

**Divieti:** cutover; «WP-1 finito»; fix FU senza sì; Playwright al posto di Matteo per voci SOLO UMANO.

---

## MSS istanza 2 vs skill normale

| Aspetto | Skill normale (06-08) | MSS istanza 2 ombra |
|---|---|---|
| Orchestrazione | Sub-agent explore + generalPurpose in sequenza nel piano multi-agente | Stesso pattern, mandato esplicito WP-1 + gate `mss:status` |
| Output | `COLLAUDO_MANUALE_OBBLIGATORIO.md` creato 06-08 | **Aggiornamento** stesso file + gap-analysis datata + report capsula |
| Chiusura | Report + commit docs | Report + `mss:capsule` + `validate:mss --require-capsule`; **non** chiude WP-1 |
| Osservazione G/O/E | — | Gap-analysis **G** (scritta); esecuzione checklist Matteo = **O** futura; E2E/Vitest già **E** su WP1 i1 |

Nessuna promozione Persona; osservazione operativa sul pilota orchestrato.

---

## Schema blocchi (da gap-analysis Fase 2)

| Blocco | Contenuto | Dipende | Stima |
|---|---|---|---|
| 0 | Preparazione | — | 15 min |
| 0-bis | Setup QA-Manuale | 0 | ~20 min |
| 1 | V1–V8 validazione | 0-bis | ~25 min |
| 2 | T1–T9 | 0-bis | ~90 min |
| 3 | T10–T12 visive | 2 | ~30 min |
| 4 | T13, T7-bis, T6–T7 | 2 | ~40 min |
| 5 | T14–T16 Classic | — | ~20 min |

**Totale ~3 h 15** (2 h 30 + 45 min setup/validazione).

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: path/revisione o hash; messaggi Matteo non in file → verbatim.
✅ R1: Mandato = messaggio chat sub-agent orchestrato WP-1 istanza 2 (testo completo nel prompt) + lettura ordine file elencato nel mandato (`Prompt-orchestrator`, `Piano-esecutore`, skill Admin/Testing, report WP1 i1, CHIUSURA, CONTRATTO_CAPSULA). HEAD `bafb876` su `env/test` al gate `mss:status`. Nessun altro verbatim Matteo oltre decisioni vincolanti incluse nel mandato (sala QA-Manuale, aggiorna COLLAUDO_MANUALE, FU solo OK/KO).

❓ Q2 — Dati = diff reale?
✅ R2: Sì — 4 file docs creati/modificati come in §3; nessun `src/`; numeri §5 (257+19+5) da `Report-wp1-istanza1` §10-bis e §4; gate `mss:status` exit 0 registrato in §4.

❓ Q3 — File skill aggiornati completi?
✅ R3: Sì — `COLLAUDO_MANUALE_OBBLIGATORIO.md`, `ADMIN_TEST_SUITE_INDEX.md` (riga checklist); nessun aggiornamento `ADMIN_SERVIZIO_CONTEXT` perché zero cambio comportamento UI.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non eseguito collaudo browser (Matteo); non fixato FU-SERV-*; non toccato `src/`/migrazioni; non dichiarato WP-1 chiuso; non cutover; non commit/push; non Playwright al posto di Matteo; non chiuso FU con fix prodotto.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito minimo su allineamento §5 a conteggi WP1 — risolto tabella esplicita. Miglioria: script che derivi §5 da `ADMIN_TEST_SUITE_INDEX` §5 + exit code batteria Servizio.

❓ Q6 — Contesto & hook?
✅ R6: Contesto giusto (Testing §8 + Admin Servizio + COMUNICAZIONE_UTENTE + CHIUSURA). Hook Cursor: `non_osservato` oltre al mandato progress reporting sub-agent.

---

## 12. Self-review

1. Triade MSS: eseguita dopo capsula (§4).
2. §5 tabella skill: completa.
3. §11: sei R con sostanza; tono utente in checklist; handoff ricostruibile.

**Mismatch corretti in controverifica:** T7/T7-bis — sequenza **Modifica sala** → modale **Configura sala**; T2 — menu **Tipo di salvataggio** con opzione **Sempre** (non solo label generica).
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03adc-e38a-7120-8d8a-8de967d79fce","correlation_id":"mss-cor-01a03adc-e38a-77d1-b3d7-f8415f60118e","segment_no":1,"created_at":"2026-08-25T23:39:09+02:00","finalization":"final","recorded_by":{"actor_id":"sub-agent-wp1-i2-checklist-qa","actor_type":"agente","role":"sub-agent-wp1-i2-checklist-qa","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"session_event","record_id":"mss-rec-01a03adc-e38a-7e14-ac9f-cf0c228a127f","capture_key":"mss-ses-01a03adc-e38a-7120-8d8a-8de967d79fce/1/session_event/1","event":{"event_id":"mss-evt-01a03adc-e38a-7713-b0c0-3627588e7f7b","event_kind":"session_close","occurred_at":"2026-08-25T23:39:09+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"sub-agent-wp1-i2-checklist-qa","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD bafb876; 10 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza2-checklist-qa-servizio-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza2-checklist-qa-servizio-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"MSS-STATUS","criterio":"npm run mss:status (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run mss:status (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"TEST-MSS","criterio":"npm run test:mss (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"bafb876","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/COMUNICAZIONE_UTENTE_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"bafb876","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"bafb876","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/OSSERVAZIONI.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"bafb876","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"bafb876","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03adc-e38a-7120-8d8a-8de967d79fce","correlation_id":"mss-cor-01a03adc-e38a-77d1-b3d7-f8415f60118e","segment_no":1,"created_at":"2026-08-25T23:39:09+02:00","finalization":"final","recorded_by":{"actor_id":"sub-agent-wp1-i2-checklist-qa","actor_type":"agente","role":"sub-agent-wp1-i2-checklist-qa","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a03adc-e38a-7bd4-9ea8-8df76b4068bd","capture_key":"mss-ses-01a03adc-e38a-7120-8d8a-8de967d79fce/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a03adc-e38a-74bc-b459-608464aff099","axis":"persona","subject_record_ids":["mss-rec-01a03adc-e38a-7e14-ac9f-cf0c228a127f"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"sub-agent-wp1-i2-checklist-qa","role":"sub-agent-wp1-i2-checklist-qa","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03adc-e38a-7120-8d8a-8de967d79fce","correlation_id":"mss-cor-01a03adc-e38a-77d1-b3d7-f8415f60118e","segment_no":1,"created_at":"2026-08-25T23:39:09+02:00","finalization":"final","recorded_by":{"actor_id":"sub-agent-wp1-i2-checklist-qa","actor_type":"agente","role":"sub-agent-wp1-i2-checklist-qa","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a03adc-e38a-7570-ad5d-52fd8a209d0e","capture_key":"mss-ses-01a03adc-e38a-7120-8d8a-8de967d79fce/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a03adc-e38a-79f2-9b9d-9831e1821df5","axis":"sistema","subject_record_ids":["mss-rec-01a03adc-e38a-7e14-ac9f-cf0c228a127f"],"delta":"modificato","assertions":[{"rule_id_version":"WP1-I2-CHECKLIST-QA@mss-v0.1-wp0.1-freeze-2","trigger_event":"WP-1 istanza 2 ombra: gap-analysis + aggiornamento checklist umana Servizio (solo docs)","decision_or_output_changed":"COLLAUDO_MANUALE_OBBLIGATORIO con setup QA-Manuale, validazione V1-V8, T7-bis FU turno sala, §5 allineato 257+19+5; WP-1 resta IN PILOTA; cutover vietato; zero src/","G":2,"O":0,"E":0}],"asserted_by":{"actor_id":"sub-agent-wp1-i2-checklist-qa","role":"sub-agent-wp1-i2-checklist-qa","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03adc-e38a-7120-8d8a-8de967d79fce","correlation_id":"mss-cor-01a03adc-e38a-77d1-b3d7-f8415f60118e","segment_no":1,"created_at":"2026-08-25T23:39:09+02:00","finalization":"final","recorded_by":{"actor_id":"sub-agent-wp1-i2-checklist-qa","actor_type":"agente","role":"sub-agent-wp1-i2-checklist-qa","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"record_type":"annotation","record_id":"mss-rec-01a03adc-e38a-7a46-b21e-d01b09679e8d","capture_key":"mss-ses-01a03adc-e38a-7120-8d8a-8de967d79fce/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a03adc-e38a-7992-bba3-606892455f79","axis":"output","subject_record_ids":["mss-rec-01a03adc-e38a-7e14-ac9f-cf0c228a127f"],"delta":"creato","assertions":[{"output_id":"report-wp1-istanza2-checklist-qa-servizio-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza2-checklist-qa-servizio-25-08-26.md","recipient":"Matteo","problem_or_job":"consegnare checklist umana Servizio eseguibile da zero per collaudo manuale post-blindatura WP1 i1","intended_use":"Matteo esegue T/V prove e manda esiti OK/KO; base revisione fredda WP-1","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"Prompt-orchestrator-wp1-istanza2-checklist-qa-servizio-25-08-26.md","authored_by":"sub-agent-wp1-i2-checklist-qa","verified_by":"non_osservato","acceptance_criterion":"gap-analysis INCLUSO/ESCLUSO/DA BUTTARE; COLLAUDO aggiornato §0-bis §1-bis T7-bis §5 WP1; mss:status exit 0; capsula controls reali; WP-1 non chiuso; no src/","verification_or_use_evidence":"mss:status; gap-analysis; COLLAUDO_MANUALE_OBBLIGATORIO.md; validate:mss --require-capsule","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/Sessioni di lavoro/25-08-26/Gap-analysis-Servizio-QA-manuale-25-08-26.md","docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md","docs/Sessioni di lavoro/25-08-26/Piano-esecutore-wp1-istanza2-checklist-qa-servizio-25-08-26.md"],"relations_no_double_count":["Chiude istanza 2 WP-1; non chiude WP-1; non esegue collaudo browser; non fix FU prodotto"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"sub-agent-wp1-i2-checklist-qa","role":"sub-agent-wp1-i2-checklist-qa","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
