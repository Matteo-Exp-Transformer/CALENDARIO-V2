# Report — D27 riaperta / WP-1 ombra autorizzato (T14) — 25-08-2026

**Modalità:** deep · **Profilo:** Meta · **Branch:** `env/test`
**HEAD seduta (inizio):** `be480a0` (= `origin/env/test`) · **Working tree inizio:** pulito
**Esito in una riga:** `D27` riaperta verbatim; `WP-1` = **IN PILOTA ombra**; prima istanza = Admin Servizio (test/fix/blindatura); cutover vietato; prompt esecutore consegnato; commit/push solo con sì Matteo.

## 1. Cappello

- **Cosa è cambiato:** il pilota MSS in ombra è autorizzato; la prima prova reale sull’app sarà la pagina Admin Servizio (test, fix e blindatura delle funzioni del cantiere), senza spegnere il vecchio skill system e senza cutover.
- **Cosa resta:** eseguire la prima istanza; revisione fredda dopo; altre tipologie di seduta WP-1 (§7); commit/push di questi atti se li vuoi pubblicati.
- **Serve una tua azione:** sì — (1) aprire la chat esecutore col prompt sotto; (2) dire sì/no a commit+push di PLAN/viste/report.

## 2. Cosa è stato fatto

1. Passo 0 ok: `env/test`, tree pulito, T13 CHIUSO, prossimo T14, WP-1 NO-GO, HEAD allineato.
2. Matteo ha scritto verbatim: «Riapro D27 e autorizzo WP-1 in modalità ombra».
3. Scelta lavoro reale: riprendere Servizio — testare, fixare, blindare con test ciò che è stato creato da quando sono iniziati i lavori Servizio.
4. Confermati utile/fallimento (default) e vecchio skill system come confronto (sì).
5. Aggiornato owner `PLAN_V0.md` (§4 WP-1, header, §15 ciclo T14, riga D27).
6. Rigenerate le viste anti-stale (`generate:mss:views`) e HTML locale cruscotto.
7. Scritto questo report + capsula; prodotto il prompt esecutore della prima istanza.

## 3. File toccati e perché

| File | Perché |
|---|---|
| `docs/MetaSkillSystem/PLAN_V0.md` | Owner: WP-1 IN PILOTA ombra; T14; D27 |
| `docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md` | Vista generata |
| `docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md` | Vista generata |
| `docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md` | Vista generata |
| `docs/Sessioni di lavoro/25-08-26/Report-d27-riapertura-wp1-ombra-t14-25-08-26.md` | Questo report |
| `docs/Sessioni di lavoro/25-08-26/judgments-d27-riapertura-wp1-ombra-t14-25-08-26.json` | Giudizi capsula R1 |

## 4. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| `git branch` / `status -sb` / `mss:status` (Passo 0) | ok — T13 CHIUSO; WP-1 era NO-GO; tree pulito |
| `npm run generate:mss:views` | OK — 4 viste |
| `npm run mss:views-html` | OK — HTML fuori da `docs/` |
| `npm run mss:status` (post-PLAN) | WP-1 IN PILOTA ombra; prossimo T14 prima istanza Servizio |
| `npm run validate:mss … --require-capsule` | **OK** |
| `npm run generate:mss:views` (2×, post-report) | OK — incluso `report-index` |

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/MetaSkillSystem/PLAN_V0.md` | WP-1 NO-GO → IN PILOTA ombra; ciclo T14; D27 | Owner SYS-1 — unica fonte di stato |
| Viste generate (cruscotto, roadmap, handoff) | Rigenerate da PLAN | Anti-stale; non corrette a mano |
| Skill Admin/Testing area Servizio | nessuno in questa chat | Meta prep: nessun cambio comportamento app |

## 6. Dati comunicazione

- Frasi ricorrenti: verbatim D27; «confermo. proseguiamo»; ripresa lavoro Servizio sospeso / blindatura.
- Formato che ha funzionato: 1 decisione per messaggio, default D3/D4 espliciti.
- Automatizzabile: checklist Passo 0 + blocco verbatim; non automatizzare la scelta del lavoro app.

## 7. Analisi flusso prompt

- Prompt sostanziali Matteo: 4 (apertura T14; verbatim D27; D2 Servizio; conferma D3/D4).
- Correzioni dopo 1ª risposta: 0.
- Modalità alzata: no (già deep).
- Efficace: prompt file `Prompt-d27-…` + verbatim obbligatorio ha evitato aperture ambigue.

## 8. Lettura della sessione (agente)

- **Impressioni:** il gate verbatim ha funzionato; D2 concreto (Servizio) sblocca subito il prompt esecutore senza calibrazione finta.
- **Difficoltà:** capitolo Servizio già «chiuso tecnicamente su TEST» il 06-08 — la ripresa è blindatura/regressione/protettivi, non riaprire il masterplan S4 come se fosse incompleto.
- **Miglioria (dato, non modifica):** classificare `IN PILOTA`/`APERTO` in `classifyPlanState` (oggi → `non-classificata`) così la lavagna mostra un bucket «in corso» esplicito.

## 9. Derivazione errori

Nessuna difficoltà bloccante. Nota di processo: non confondere chiusura capitolo Servizio 06-08 (blindatura tecnica TEST) con «non toccare più Servizio» — Matteo ha autorizzato esplicitamente ripresa test/fix/blindatura come prima istanza WP-1.

## 10. Cosa resta

- Chat esecutore: prima istanza Servizio (prompt sotto).
- Revisione fredda post-istanza (capsula + owner, senza narrativa completa).
- Altre istanze WP-1 (§7) — WP-1 non si chiude dopo questa.
- Commit/push atti T14 auth — solo con sì Matteo.
- Debiti storici non toccati: Q-B/Q-C già chiusi in T13.

## 10-bis. Handoff al prossimo agente

**Cosa è vero adesso**

- `D27` **riaperta**; `WP-1` = **`IN PILOTA` — ombra**; cutover **vietato**.
- Vecchio skill system = confronto operativo per tutto WP-1.
- Prima istanza = Admin **Servizio**: testare, fixare, blindare con test le funzioni create dal cantiere Servizio (da inizio lavori).
- Owner: `PLAN_V0.md` §4 / §15 T14. Viste rigenerate.
- Questa chat **non** ha eseguito lavoro `src/` Servizio.

**Prossimo task atomico:** eseguire la prima istanza (prompt esecutore sotto) → report+capsula istanza → revisione fredda. Gate chiusura istanza ≠ chiusura WP-1.

**Divieti:** cutover; SEP-G5 PASS; inventare metriche Persona; allentare validator; `src/` fuori Servizio/test collegati; dichiarare WP-1 finito dopo una chat.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: path/revisione o hash; messaggi Matteo non in file → verbatim.
✅ R1: Mandato = `docs/Sessioni di lavoro/25-08-26/Prompt-d27-riapertura-wp1-ombra-25-08-26.md` + messaggio chat con stessa intestazione. Skill: `METASKILL_SYSTEM_SKILL.md`, `MANUALE_OPERATIVO_MSS_V0.md`, `PLAN_V0.md` §4/§4-bis/§15, Report-verifica-post-t12 §5–§6, `CHIUSURA_SESSIONE.md`. Verbatim Matteo: «Riapro D27 e autorizzo WP-1 in modalità ombra»; D2 Servizio ripresa/blindatura; «confermo. proseguiamo».

❓ Q2 — Dati = diff reale?
✅ R2: Sì — §3/§4 allineati a `git status`/`mss:status` post-PLAN; WP-1 cella `IN PILOTA — ombra`; prossimo gate T14 prima istanza Servizio.

❓ Q3 — File skill aggiornati completi?
✅ R3: Sì — PLAN + viste generate; nessuna skill Admin/Testing in questa chat Meta.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non eseguito pilota Servizio; non toccato `src/`; non cutover; non chiuso WP-1; non commit/push (attesa sì); non SEP-G5.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito minimo sul gate verbatim. Miglioria: bucket lavagna per `IN PILOTA`/`APERTO` (oggi non-classificata).

❓ Q6 — Contesto & hook?
✅ R6: Contesto giusto (catena Meta + Prompt-d27). Hook Cursor: `non_osservato` oltre al mandato.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a039d8-1ea7-70ed-be4e-2fbf3399e7f4","correlation_id":"mss-cor-01a039d8-1ea7-721f-8d39-dfec660309cb","segment_no":1,"created_at":"2026-08-25T18:54:20+02:00","finalization":"final","recorded_by":{"actor_id":"agente-meta-t14-d27","actor_type":"agente","role":"meta","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a039d8-1ea7-7873-9b26-b9472baae908","capture_key":"mss-ses-01a039d8-1ea7-70ed-be4e-2fbf3399e7f4/1/session_event/1","event":{"event_id":"mss-evt-01a039d8-1ea7-7295-89c1-aa8e9e76170e","event_kind":"session_close","occurred_at":"2026-08-25T18:54:20+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"meta","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD be480a0; 6 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-d27-riapertura-wp1-ombra-t14-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-d27-riapertura-wp1-ombra-t14-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"STATUS","criterio":"npm run mss:status (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run mss:status (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"be480a0","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"be480a0","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"be480a0","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"be480a0","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a039d8-1ea7-70ed-be4e-2fbf3399e7f4","correlation_id":"mss-cor-01a039d8-1ea7-721f-8d39-dfec660309cb","segment_no":1,"created_at":"2026-08-25T18:54:20+02:00","finalization":"final","recorded_by":{"actor_id":"agente-meta-t14-d27","actor_type":"agente","role":"meta","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a039d8-1ea7-74d6-87cd-ee896dad2240","capture_key":"mss-ses-01a039d8-1ea7-70ed-be4e-2fbf3399e7f4/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a039d8-1ea7-746d-845d-9b1d98a93547","axis":"persona","subject_record_ids":["mss-rec-01a039d8-1ea7-7873-9b26-b9472baae908"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"agente-meta-t14-d27","role":"meta","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a039d8-1ea7-70ed-be4e-2fbf3399e7f4","correlation_id":"mss-cor-01a039d8-1ea7-721f-8d39-dfec660309cb","segment_no":1,"created_at":"2026-08-25T18:54:20+02:00","finalization":"final","recorded_by":{"actor_id":"agente-meta-t14-d27","actor_type":"agente","role":"meta","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a039d8-1ea7-7f2a-8823-1b9d3b86c4e3","capture_key":"mss-ses-01a039d8-1ea7-70ed-be4e-2fbf3399e7f4/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a039d8-1ea7-7f2f-98c4-d6ad300af4ae","axis":"sistema","subject_record_ids":["mss-rec-01a039d8-1ea7-7873-9b26-b9472baae908"],"delta":"modificato","assertions":[{"rule_id_version":"WP-1-SHADOW@mss-v0.1-wp0.1-freeze-2","trigger_event":"Aggiornamento owner PLAN §4/§15 + generate:mss:views dopo D27 verbatim","decision_or_output_changed":"WP-1 da NO-GO a IN PILOTA ombra; T14 attivo su prima istanza Servizio; cutover vietato; SEP-G5 non PASS","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"agente-meta-t14-d27","role":"meta","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a039d8-1ea7-70ed-be4e-2fbf3399e7f4","correlation_id":"mss-cor-01a039d8-1ea7-721f-8d39-dfec660309cb","segment_no":1,"created_at":"2026-08-25T18:54:20+02:00","finalization":"final","recorded_by":{"actor_id":"agente-meta-t14-d27","actor_type":"agente","role":"meta","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a039d8-1ea7-7a2d-8af8-0383768ba286","capture_key":"mss-ses-01a039d8-1ea7-70ed-be4e-2fbf3399e7f4/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a039d8-1ea7-740d-b74d-52e64f43e7e3","axis":"output","subject_record_ids":["mss-rec-01a039d8-1ea7-7873-9b26-b9472baae908"],"delta":"creato","assertions":[{"output_id":"report-d27-riapertura-wp1-ombra-t14-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-d27-riapertura-wp1-ombra-t14-25-08-26.md","recipient":"Matteo","problem_or_job":"registrare riapertura D27 e autorizzazione WP-1 ombra con perimetro prima istanza","intended_use":"base per prompt esecutore Servizio e revisione fredda successiva","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"Prompt-d27-riapertura-wp1-ombra-25-08-26.md","authored_by":"agente-meta-t14-d27","verified_by":"non_osservato","acceptance_criterion":"D27 verbatim; PLAN WP-1 IN PILOTA; viste allineate; prompt esecutore consegnato; no commit senza sì; no cutover; no src/ fuori Servizio","verification_or_use_evidence":"npm run mss:status; generate:mss:views; git status","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/MetaSkillSystem/PLAN_V0.md","docs/Sessioni di lavoro/25-08-26/Prompt-d27-riapertura-wp1-ombra-25-08-26.md"],"relations_no_double_count":["Autorizzazione e prompt; non esegue il pilota Servizio; non chiude WP-1"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"agente-meta-t14-d27","role":"meta","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
