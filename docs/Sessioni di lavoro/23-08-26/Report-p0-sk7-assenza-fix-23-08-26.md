# Report — P0 MSS: assenza fix SK-7 — 23-08-26

**Cosa è cambiato:** il task P0 non ha trovato il fix SK-7 dichiarato; D2/D3 restano riprodotti su `46b8bca`; nessun codice capsule è stato riscritto.

**Cosa resta:** D2/D3 aperti; privacy/test mirati non applicati (manca il patch); P1 (parità pre-commit + numeri calcolati); chiusura `SK-7` (`M3`) a Matteo.

**Serve una tua azione:** sì — (A) consegnare commit/branch/patch del fix dichiarato, oppure (B) autorizzare esplicitamente la reimplementazione. Senza A o B non si tocca `parseCheckSpec`.

**Data:** 23-08-26 · **Tipo:** deep · **Agente:** esecutore P0 MSS (Cursor)

**Modalità:** deep

---

## 1. Cosa è stato fatto

1. Verificati branch `env/test`, HEAD e `origin/env/test` = `46b8bca` (allineati).
2. Letti `METASKILL_SYSTEM_SKILL.md`, `PLAN_V0.md` §4-bis/§4-ter/§15, `AUDIT_STATO_REALE_23-08-26.md`, report SK-7 e prompt fix privacy.
3. Cercato il fix dichiarato: branch locali/remoti, stash, PR GitHub, worktree, transcript agenti (nessun patch con `parseCheckSpec` corretto oltre l'implementazione bugata originale).
4. Riprodotti D2/D3 a HEAD: `parseCheckSpec('test:mss:npm run test:mss')` → `control_id=test`; esecuzione `mss:capsule` con check no-op → `pass` falso.
5. **Fermato senza reimplementare**, come impone il prompt P0.
6. Aggiornati `PLAN_V0.md` (fatti), viste ROADMAP/HANDOFF/AUDIT e questo report.

## 2. File toccati e perché

| File | Perché |
|---|---|
| `docs/MetaSkillSystem/PLAN_V0.md` | Owner: S7 + §4-ter + §15 aggiornati al fatto «fix non recuperabile» |
| `docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md` | Vista: P0 chiuso come assenza; prossimo gate A/B + P1 |
| `docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md` | Vista handoff senior |
| `docs/MetaSkillSystem/AUDIT_STATO_REALE_23-08-26.md` | Nota post-P0 sull'assenza verificata |
| `docs/Sessioni di lavoro/23-08-26/Report-p0-sk7-assenza-fix-23-08-26.md` | Questo report |
| `docs/Sessioni di lavoro/23-08-26/judgments-p0-sk7-assenza-fix-23-08-26.json` | Giudizi per la capsula |
| `docs/Sessioni di lavoro/23-08-26/capsule-p0-sk7-assenza-fix-23-08-26.jsonl` | Bundle generato da `mss:capsule` |

**Non toccati (vincolo P0):** `scripts/mss/capsule.mjs`, `query.mjs`, pre-commit SK-4/D1, status/query D4/D5, `src/**`, nessuna riscrittura di record `final`.

## 3. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| `npm run test:mss:tools` | **exit 0** — 23/23 |
| `npm run test:mss` | **exit 0** — 42 fixture + 38 gruppi |
| caso negativo capsule (persona mancante) | **exit 2** — nessuna capsula emessa |
| `git diff --check` | **exit 0** |
| riproduzione D2/D3 | **bug presente** (vedi §1) |
| `npm run validate:mss -- --mode file --file <questo report> --kind report --require-capsule` | eseguito dopo scrittura |

Denominatori reali di questa seduta: tools **23**, H-1 **42+38**. Nessun test automatico copre ancora D2/D3 o privacy template (assenti perché fix assente).

## 4. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `PLAN_V0.md` | S7, §4-ter SK-7, §15 | owner stato |
| `ROADMAP_V0.md` / `HANDOFF_SENIOR_V0.md` | rettifica P0 assenza | viste derivate |
| `METASKILL_SYSTEM_SKILL.md` | nessuna | già puntava a P0/audit |
| Skill area prodotto | nessuno | nessun `src/` |

## 5. Dati comunicazione

**Prompt sostanziali Matteo (1):** allegato `PROMPT_PROSSIMO_ESECUTORE_MSS_23-08-26.md` (righe 1–32).

**Formato efficace:** mandato binario «integra se c'è / documenta assenza se no» — zero ambiguità sul divieto di reimplementare in silenzio.

## 6. Analisi flusso prompt, efficienza e statistiche

- **Prompt sostanziali:** 1 · **correzioni:** 0 · **follow-up:** 0 · **tipo:** deep.
- Il costo è stato la ricerca negativa (git/transcript/PR), non il codice: corretto rispetto al vincolo P0.

## 7. La mia lettura della sessione

**Cosa ha funzionato:** il prompt P0 ha impedito di «aggiustare» D2/D3 inventando un fix. La riproduzione a HEAD rende l'assenza fattuale, non opinabile.

**Cosa no:** l'audit parlava di un esecutore che «aveva dichiarato» il fix; in repo non resta handoff/patch. Senza A/B di Matteo il debito D2/D3 resta bloccato.

**Miglioria (dato):** ogni dichiarazione «fix terminato» fuori da HEAD dovrebbe lasciare path di branch o file patch nominato nell'audit.

## 8. Derivazione errori

| Evento | Classe | Evitabile come |
|---|---|---|
| Fix dichiarato non trasferito | processo | handoff obbligatorio con SHA/branch prima di chiudere la chat |
| D2/D3 ancora vivi | bug preesistente | test mirati (da fare solo dopo A/B) |

## 9. Cosa resta / limiti residui

1. **Gate Matteo A o B** prima di toccare `capsule.mjs`.
2. Dopo A/B: fix parser check, privacy append-only (amendment se literal in `final`), test che falliscono prima e passano dopo, conteggi dai run.
3. **P1 in evidenza:** `requireCapsule: true` anche nel pre-commit; numeri calcolati non cablati (D4/D5). Non eseguito in questa seduta (fuori perimetro P0).
4. `SK-7` resta **APERTO**; `M3` solo Matteo.
5. `WP-1` / move: non aperti.

## 10. Handoff

**Vero adesso:** HEAD `46b8bca`; D2/D3 riprodotti; P0 = assenza documentata; codice capsule invariato rispetto al bug.

**Prossimo:** A (patch) o B (autorità reimplementazione), poi riprendere i 4 punti del prompt P0. In parallelo o dopo: **P1**.

**Non riaprire:** reimplementazione silenziosa; claim `CHIUSO`/`M3`; D1/D4/D5 in questa chat senza nuovo mandato.

## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03053-6dcf-7f77-b2e1-3c4680115499","correlation_id":"mss-cor-01a03053-6dcf-7eac-93c9-881625ceccd2","segment_no":1,"created_at":"2026-08-23T22:32:49+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-p0","actor_type":"agente","role":"agente esecutore P0","agent_runtime":{"provider":"Cursor","model":"composer-2.5","runtime":"Cursor Agent","surface":"1"},"tools_used":["Read","Write","Shell","Grep"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"source-prompt-p0"},{"package_id":"SK-7","package_version_or_revision":"aperto-senza-fix-recuperabile","source_ref":"source-sk7-report"}],"record_type":"session_event","record_id":"mss-rec-01a03053-6dcf-72cf-abe4-ad238c035129","capture_key":"mss-ses-01a03053-6dcf-7f77-b2e1-3c4680115499/1/session_event/1","event":{"event_id":"mss-evt-01a03053-6dcf-7e52-ad04-3e377e4d582f","event_kind":"session_close","occurred_at":"2026-08-23T22:32:49+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"eseguire P0: integrare e verificare il fix SK-7 dichiarato da altro esecutore; se non recuperabile, documentare assenza senza reimplementare","session_type":"deep","capsule_status":"completa","role_key":"agente-esecutore-p0-mss","area":"MetaSkillSystem / integrazione SK-7 P0","environment":"workspace locale, branch env/test @ 46b8bca, Windows 11","authorization":{"read":["docs/MetaSkillSystem/PROMPT_PROSSIMO_ESECUTORE_MSS_23-08-26.md","docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","docs/MetaSkillSystem/PLAN_V0.md","docs/MetaSkillSystem/AUDIT_STATO_REALE_23-08-26.md","scripts/mss/capsule.mjs"],"write":["docs/MetaSkillSystem/PLAN_V0.md","docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md","docs/MetaSkillSystem/AUDIT_STATO_REALE_23-08-26.md","docs/Sessioni di lavoro/23-08-26/Report-p0-sk7-assenza-fix-23-08-26.md"],"forbid":["WP-1","mss:move","dichiarare pacchetti CHIUSI / M3","reimplementare D2/D3 in silenzio","toccare D1 pre-commit SK-4","toccare D4/D5 status/query","git push","commit senza autorizzazione Matteo","riscrittura record final"]},"authorized_outputs":["Report-p0-sk7-assenza-fix-23-08-26.md","rettifica PLAN_V0 §4-ter/§15","viste ROADMAP/HANDOFF"],"route":{"chosen":"ricerca esaustiva del diff dichiarato (HEAD, origin, branch, stash, PR, transcript, patch); in assenza fermarsi e documentare","alternatives_or_conflicts":["scartata: reimplementare parseCheckSpec/privacy senza patch recuperabile — vietato dal prompt P0","scartata: dichiarare SK-7 chiuso o verde — M3 solo Matteo e bug D2/D3 ancora vivi"]},"observed_outcome":"fix SK-7 dichiarato non recuperabile; D2/D3 riprodotti a 46b8bca; P0 chiude come assenza documentata; prossimo lavoro P1 solo dopo nuova autorita su D2/D3 oppure consegna del patch","open_items":["serve patch/commit/branch del fix dichiarato, oppure nuova autorita di Matteo per reimplementare D2/D3+privacy+test","D2/D3 ancora aperti: parseCheckSpec spezza al primo colon; x::node --version produce pass falso","privacy append-only e test mirati privacy/D2/D3 non eseguiti perche fix assente","P1 residuo: requireCapsule true anche in pre-commit + numeri calcolati non cablati","M3 chiusura SK-7 resta di Matteo"],"controls":[{"control_id":"SK7-TOOLS","criterio":"npm run test:mss:tools","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0)","evidence_refs":[]},{"control_id":"SK7-H1","criterio":"npm run test:mss","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0)","evidence_refs":[]},{"control_id":"SK7-DIFF","criterio":"git diff --check","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0)","evidence_refs":[]},{"control_id":"SK7-NEG","criterio":"npm run mss:capsule -- --judgments docs/MetaSkillSystem/tests/tools/fixtures/judgments-sk7-missing-persona.json --model x","esito":"fail","numeratore":0,"denominatore":1,"esecutore":"mss:capsule: npm run mss:capsule -- --judgments docs/MetaSkillSystem/tests/tools/fixtures/judgments-sk7-missing-persona.json --model x (exit 2)","evidence_refs":[]}],"subject_runtime":{"actor_id":"Matteo","provider":"non_applicabile: soggetto umano","model":"non_applicabile: soggetto umano","runtime":"non_applicabile: soggetto umano","surface":"Cursor chat"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["path del repo","esiti comandi","SHA commit","metriche aggregate"],"prohibited_content":["materiale privato non registrabile","segreti","token di messaging"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-plan","owner_id":"SYS-1","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"sezione 4-ter SK-7 + sezione 15 P0","revision_or_hash":"46b8bca","sensitivity":"internal"},{"ref_id":"owner-audit","owner_id":"MSS","uri_or_path":"docs/MetaSkillSystem/AUDIT_STATO_REALE_23-08-26.md","stable_anchor_or_event_id":"stato SK-7 e confine integrazione","revision_or_hash":"working tree","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-prompt-p0","owner_id":"MSS","uri_or_path":"docs/MetaSkillSystem/PROMPT_PROSSIMO_ESECUTORE_MSS_23-08-26.md","stable_anchor_or_event_id":"righe 1-32","revision_or_hash":"working tree","sensitivity":"internal"},{"ref_id":"source-sk7-report","owner_id":"SK-7","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-sk7-mss-capsule-23-08-26.md","stable_anchor_or_event_id":"report proprietario SK-7","revision_or_hash":"working tree","sensitivity":"internal"},{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/AUDIT_STATO_REALE_23-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"46b8bca","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"46b8bca","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"46b8bca","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"46b8bca","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PROMPT_PROSSIMO_ESECUTORE_MSS_23-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"46b8bca","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"46b8bca","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"46b8bca","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-p0-sk7-assenza-fix-23-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"46b8bca","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"docs/Sessioni di lavoro/23-08-26/capsule-p0-sk7-assenza-fix-23-08-26.jsonl","stable_anchor_or_event_id":"working tree","revision_or_hash":"46b8bca","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"docs/Sessioni di lavoro/23-08-26/judgments-p0-sk7-assenza-fix-23-08-26.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"46b8bca","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03053-6dcf-7f77-b2e1-3c4680115499","correlation_id":"mss-cor-01a03053-6dcf-7eac-93c9-881625ceccd2","segment_no":1,"created_at":"2026-08-23T22:32:49+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-p0","actor_type":"agente","role":"agente esecutore P0","agent_runtime":{"provider":"Cursor","model":"composer-2.5","runtime":"Cursor Agent","surface":"1"},"tools_used":["Read","Write","Shell","Grep"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"source-prompt-p0"},{"package_id":"SK-7","package_version_or_revision":"aperto-senza-fix-recuperabile","source_ref":"source-sk7-report"}],"record_type":"annotation","record_id":"mss-rec-01a03053-6dcf-764b-a57d-9c56e5496452","capture_key":"mss-ses-01a03053-6dcf-7f77-b2e1-3c4680115499/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a03053-6dcf-70ba-bc46-772b7e0e61e3","axis":"persona","subject_record_ids":["mss-rec-01a03053-6dcf-72cf-abe4-ad238c035129"],"delta":"nessuno","assertions":[{"signal":"Matteo ha consegnato il prompt P0 allegato senza aggiungere patch o branch del fix dichiarato","actor":"Matteo","assistance":"spontaneo","origin":"naturale","source_ref":"source-prompt-p0","effect":"l esecutore ha cercato il diff e si e fermato all assenza","evidence_state":"observed"}],"asserted_by":{"actor_id":"cursor-composer-p0","role":"agente esecutore P0","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"source-prompt-p0","evidence_refs":["source-prompt-p0"],"notes":"singola seduta, non alza livelli"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03053-6dcf-7f77-b2e1-3c4680115499","correlation_id":"mss-cor-01a03053-6dcf-7eac-93c9-881625ceccd2","segment_no":1,"created_at":"2026-08-23T22:32:49+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-p0","actor_type":"agente","role":"agente esecutore P0","agent_runtime":{"provider":"Cursor","model":"composer-2.5","runtime":"Cursor Agent","surface":"1"},"tools_used":["Read","Write","Shell","Grep"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"source-prompt-p0"},{"package_id":"SK-7","package_version_or_revision":"aperto-senza-fix-recuperabile","source_ref":"source-sk7-report"}],"record_type":"annotation","record_id":"mss-rec-01a03053-6dcf-755b-aa4d-8729c6d23325","capture_key":"mss-ses-01a03053-6dcf-7f77-b2e1-3c4680115499/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a03053-6dcf-79a6-9a9e-2a1177ebcc0f","axis":"sistema","subject_record_ids":["mss-rec-01a03053-6dcf-72cf-abe4-ad238c035129"],"delta":"verificato","assertions":[{"rule_id_version":"P0@AUDIT+PROMPT 23-08-26","trigger_event":"recupero fix SK-7 dichiarato ma non in HEAD/origin","decision_or_output_changed":"nessun codice capsule modificato; D2/D3 riprodotti; assenza documentata; PLAN/viste aggiornate con fatto negativo","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"cursor-composer-p0","role":"agente esecutore P0","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-audit","evidence_refs":["source-prompt-p0","owner-plan"],"notes":"parseCheckSpec ancora spezza al primo colon; test tools 23/23 senza casi D2/D3"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03053-6dcf-7f77-b2e1-3c4680115499","correlation_id":"mss-cor-01a03053-6dcf-7eac-93c9-881625ceccd2","segment_no":1,"created_at":"2026-08-23T22:32:49+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-p0","actor_type":"agente","role":"agente esecutore P0","agent_runtime":{"provider":"Cursor","model":"composer-2.5","runtime":"Cursor Agent","surface":"1"},"tools_used":["Read","Write","Shell","Grep"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"source-prompt-p0"},{"package_id":"SK-7","package_version_or_revision":"aperto-senza-fix-recuperabile","source_ref":"source-sk7-report"}],"record_type":"annotation","record_id":"mss-rec-01a03053-6dcf-7252-97c3-677f043a48ec","capture_key":"mss-ses-01a03053-6dcf-7f77-b2e1-3c4680115499/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a03053-6dcf-7ee8-b57d-3f58e75990fe","axis":"output","subject_record_ids":["mss-rec-01a03053-6dcf-72cf-abe4-ad238c035129"],"delta":"creato","assertions":[{"output_id":"mss-p0-assenza-fix-sk7","primary_type":"registro","canonical_version":"Report-p0-sk7-assenza-fix-23-08-26.md","recipient":"Matteo e prossimo esecutore MSS","problem_or_job":"decidere se autorizzare reimplementazione oppure recuperare patch esterno","intended_use":"bloccare reimplementazione silenziosa e fissare lo stato dopo ricerca fallita","conceived_by":"PROMPT_PROSSIMO_ESECUTORE_MSS_23-08-26","decided_by":"Matteo","directed_by":"prompt P0","authored_by":"cursor-composer-p0","verified_by":"non_osservato","acceptance_criterion":"assenza del fix dichiarata con prove di ricerca + D2/D3 riprodotti + nessun claim CHIUSO","verification_or_use_evidence":"riproduzione parseCheckSpec e mss:capsule no-op; ricerca branch/stash/PR/transcript negativa","verification_status":"self_report","owner_ref":"owner-plan","privacy_release":"internal","support_files":["docs/MetaSkillSystem/PLAN_V0.md","docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md","docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md"],"relations_no_double_count":["non sostituisce Report-sk7-mss-capsule","non chiude SK-7"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-composer-p0","role":"agente esecutore P0","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-plan","evidence_refs":["source-prompt-p0"],"notes":"quinto gate fail di proposito: nessun revisore indipendente"}}}
```

## Domande di chiusura

❓ Q1 — Prompt ricevuti: path + revisione/hash; messaggi Matteo non in file verbatim.
✅ R1: File: `docs/MetaSkillSystem/PROMPT_PROSSIMO_ESECUTORE_MSS_23-08-26.md` (working tree, non in HEAD `46b8bca` al momento della lettura). Contesto letto: `AUDIT_STATO_REALE_23-08-26.md`, `PLAN_V0.md`, `Report-sk7-mss-capsule-23-08-26.md`, `Prompt-fix-mirato-sk7-report-privacy-23-08-26.md`. Messaggio Matteo: allegato del prompt P0 (nessun altro testo oltre il riferimento al file).

❓ Q2 — Dati = diff reale?
✅ R2: Sì — D2/D3 riprodotti su `parseCheckSpec` e `mss:capsule`; `test:mss` 42+38 exit 0; `test:mss:tools` 23/23 exit 0; negativo capsule exit 2; `git diff --check` exit 0. Nessuna modifica a `scripts/mss/capsule.mjs` in questa seduta. Capsula controls: SK7-TOOLS:pass,SK7-H1:pass,SK7-DIFF:pass,SK7-NEG:fail.

❓ Q3 — File correlati §4 completi?
✅ R3: Completi per owner/viste MSS. Nessuna skill area prodotto.

❓ Q4 — Cosa NON hai fatto?
✅ R4: (1) Non reimplementato D2/D3. (2) Non applicato fix privacy né amendment sul report SK-7. (3) Non toccato D1/P1. (4) Non commit/push. (5) Non dichiarato SK-7 chiuso.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito: claim «fix terminato» senza artefatto recuperabile — miglioria: l'audit deve citare SHA/branch o segnare «claim verbale non verificabile».

❓ Q6 — Contesto & hook?
✅ R6: Contesto giusto (skill MSS + audit + P0). Hook fine-chat non ancora scattato in questa stesura.
