# Report — M-E: attrezzi mancanti (`T1` mss:move) — 24-08-2026

**Modalità:** deep · **Ruolo:** esecutore · **Stato:** **`M-E` PROVATO, non CHIUSO**
**Branch:** `env/test` · **HEAD passo 0:** `6a76f5759a36ec170a45242f5c876d2db64a5a5b`

## 1. Cappello

- **Cosa è cambiato:** puoi spostare un file MSS con un comando; i link vivi si aggiornano da soli e se qualcosa va storto l’albero torna com’era.
- **Cosa resta:** controverifica di famiglia diversa (`M12`) prima di dire CHIUSO; `T2` (`mss:review`) fuori da questo mandato.
- **Serve una tua azione:** no per usare l’attrezzo in prova; sì solo se vuoi la controverifica / commit.

## 2. Cosa è stato fatto

Passo 0: branch `env/test`, HEAD stabile, working tree già sporco da M-F/M-G non committati (preservati).

Costruito `npm run mss:move -- <sorgente> <destinazione>`:

1. sposta/rinomina nel working tree;
2. aggiorna riferimenti vivi (stesso perimetro di `validate:docs`) + citazioni path sotto `scripts/`;
3. non tocca storia sedute / Archivio / zone congelate (prove L5, privato L6);
4. esce rosso senza scrivere a metà se sorgente assente, destinazione occupata o zona congelata; se `validate:docs` fallisce dopo la scrittura, **annulla**;
5. di default può lasciare uno stub di redirect (TTL 30g); `--no-stub` / `--skip-validate` per prove isolate.

Parser path estratto in `scripts/doc-paths-lib.mjs` e riusato da `validate:docs` (**D18**, niente doppio parser).

**Prova eseguibile (sandbox temp):** move `PROVA_SRC` → `PROVA_DST`, 1 ref aggiornato, `lineDelta ≈ 1` vs baseline manuale **1741** righe; exit 0.

**`T2` (`mss:review`):** **fuori scope** — dichiarato esplicitamente. `T1` è PROVATO qui, ma gonfiare con un secondo attrezzo prima della controverifica `T1` non è obbligatorio e rischia di mischiare i gate.

**PLAN / CRUSCOTTO:** non toccati (solo dopo `M12`).

## 3. File toccati e perché

| File | Perché |
|---|---|
| `scripts/mss/move.mjs` | attrezzo `T1`/`R6` |
| `scripts/doc-paths-lib.mjs` | parser path unico (D18) |
| `scripts/check-doc-paths.mjs` | usa la lib condivisa |
| `scripts/mss/export-kit.mjs` | manifesto + script `mss:move` per export |
| `package.json` | script `mss:move` |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | test `T1/R6` + B4 copia anche la lib |
| `MANUALE_OPERATIVO_MSS_V0.md` | documento il comando; toglie `mss:move` dai «non implementati» |
| questo report + judgments | atti di chiusura |

## 4. Test eseguiti

| Comando | Esito |
|---|---|
| `npm run test:mss:tools` | exit 0 — include `T1/R6` |
| `npm run test:mss` | exit 0 |
| `npm run validate:mss:views` | exit 0 |
| `npm run validate:docs` | exit 0 — 0 path rotti |
| `npm run validate:mss:all` | exit 0 |
| `git diff --check` | exit 0 |
| prova sandbox `runMove(...)` | exit 0 · refs=1 · lineDelta=1 · baseline=1741 |

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `MANUALE_OPERATIVO_MSS_V0.md` | §2.4-quinquies `mss:move`; rimosso da «non implementati» | agente freddo sa usare l’attrezzo |
| `PLAN_V0.md` / cruscotto | **nessuno** | aggiornamento solo post-`M12` |

## 6. Dati comunicazione

Mandato Matteo (verbatim di intestazione + file prompt): profilo Meta deep; skill METASKILL + MANUALE + Prompt M-E; output `mss:move` con prova + test T1/R6; report + capsula; PLAN/CRUSCOTTO solo dopo M12; T2 solo se T1 PROVATO altrimenti fuori; branch `env/test`; nessun commit/push senza sì.

Automatizzabile: il move e l’aggiornamento link. Manuale: decisione di spostare atti vivi e chiusura `M12`.

## 7. Analisi flusso

Un prompt sostanziale (il mandato). Nessuna correzione di rotta sul perimetro. Modalità deep rispettata.

## 8. Lettura dell’agente

`T1` chiude il buco `R6` a zero con una prova misurabile contro le 1741 righe. Lasciare `T2` fuori evita di dichiarare due attrezzi «provati» con una sola controverifica.

## 9. Derivazione errori

Nessun errore di prodotto in seduta. Prima bozza interna di `move.mjs` aveva helper path confusi: riscritta prima dei test (non consegnata rotta).

## 10. Cosa resta

- `M-E` **PROVATO, non CHIUSO** → controverifica famiglia diversa (`M12`)
- `T2` / `SK-3` **NON INIZIATO** (fuori scope)
- `R1` raccomandato ma **non aperto**
- `WP-1` NO-GO · `H-1.3` resta `PASS_CON_RISERVE`

## 10-bis. Handoff

**Vero adesso:** `npm run mss:move -- <da> <a>` esiste; test `T1/R6` non vacuo; cancelli MSS verdi; parser path con `validate:docs` è uno solo.

**Prossimo gate:** revisore di **famiglia diversa** riesegue i gate, riproduce la sandbox move e le controprove rosse (assente / occupata / congelata / rollback). Solo allora `PLAN_V0` → `M-E` CHIUSO e `generate:mss:views`.

**Non aprire:** `R1`, `WP-1`, `T2` senza nuovo mandato, commit/push senza sì.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura (es. `git rev-parse HEAD:<path>` o SHA — stesso dato di `source_refs[].revision_or_hash` in capsula). Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1: `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` @ `318d67faed48d3d7edf2223164b3461421cfd17b`; `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` working-tree hash `1f9e043db99ac9c998aa9cae163fa582a79b9004` (post-edit seduta); `docs/Sessioni di lavoro/24-08-26/Prompt-mandato-ME-attrezzi-mancanti-24-08-26.md` hash oggetto `ca3b8a251666ce435a7aa99a90a9091edd6dc864`. Messaggio Matteo verbatim: profilo Meta deep; skill METASKILL + MANUALE + Prompt M-E; non caricare corpus storico non puntato; non aprire R1; non dichiarare H-1.3 PASS pulito; non aprire WP-1; output mss:move (T1) con prova + test T1/R6; report + capsula; PLAN/CRUSCOTTO solo dopo M12; T2 solo se T1 PROVATO altrimenti fuori; branch env/test; nessun commit/push senza sì esplicito.

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).
✅ R2: sì — gate rieseguiti in seduta; prova sandbox lineDelta=1 vs baseline 1741. Evidenza: `npm run validate:mss:all` exit 0.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).
✅ R3: sì — solo il manuale operativo; PLAN/cruscotto volutamente non toccati pre-M12.

❓ Q4 — Cosa NON hai fatto?
✅ R4: non ho implementato `mss:review` (T2); non ho aggiornato PLAN/CRUSCOTTO a CHIUSO; non ho aperto R1/WP-1; non ho dichiarato H-1.3 PASS pulito; non ho committato né fatto push; non ho toccato `src/` né DB.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: il vincolo «non move manuale» + D18 (un solo parser) ha forzato l’estrazione da `check-doc-paths` prima del comando — giusto, ma va tenuto esplicito nei mandati futuri sugli attrezzi path-aware.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco?
✅ R6: giusto — mandato + manuale + perimetro scripts/mss bastano senza corpus storico.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a034c7-898c-7052-8114-055f0984ac2a","correlation_id":"mss-cor-01a034c7-898c-7582-8fe3-56d9da9e66d0","segment_no":1,"created_at":"2026-08-24T19:18:07+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-cursor-composer","actor_type":"agente","role":"esecutore-mss-me","agent_runtime":{"provider":"Cursor","model":"cursor-composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a034c7-898c-73bc-9416-d273d7369d8d","capture_key":"mss-ses-01a034c7-898c-7052-8114-055f0984ac2a/1/session_event/1","event":{"event_id":"mss-evt-01a034c7-898c-7983-93c4-e705fd0059b4","event_kind":"session_close","occurred_at":"2026-08-24T19:18:07+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"Eseguire M-E: costruire mss:move (T1/R6) con prova eseguibile e test nominato; T2 solo se T1 PROVATO, altrimenti fuori; PLAN/CRUSCOTTO solo dopo M12.","session_type":"deep","capsule_status":"completa","role_key":"esecutore-mss-me","area":"MetaSkillSystem / attrezzi mancanti T1 mss:move","environment":"repo locale CalendarBackup-v2 su env/test; nessuna operazione Supabase","authorization":{"read":["docs/MetaSkillSystem/","docs/Sessioni di lavoro/24-08-26/","scripts/mss/","scripts/check-doc-paths.mjs","package.json"],"write":["scripts/mss/move.mjs","scripts/doc-paths-lib.mjs","scripts/check-doc-paths.mjs","scripts/mss/export-kit.mjs","docs/MetaSkillSystem/tests/tools/run.mjs","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","package.json","docs/Sessioni di lavoro/24-08-26/"],"forbid":["PLAN_V0.md CHIUSO","CRUSCOTTO edit manuale","src/","database","migrazioni","commit","push","WP-1","R1","H-1.3 PASS pulito"]},"authorized_outputs":["mss:move T1","test T1/R6","report e capsula","manuale aggiornato"],"route":{"chosen":"T1 mss:move con parser path condiviso (D18), prova in sandbox, test T1/R6 non vacuo; T2 mss:review lasciato fuori per non gonfiare il mandato","alternatives_or_conflicts":["scartato move manuale di atti vivi (D15)","scartato aggiornare PLAN/CRUSCOTTO prima di M12","scartato implementare T2 nello stesso giro senza controverifica T1"]},"observed_outcome":"npm run mss:move sposta un file, aggiorna riferimenti vivi, rifiuta zone congelate e resta atomico se validate:docs fallisce; test T1/R6 e validate:mss:all verdi; costo misurato << 1741 righe baseline.","open_items":["controverifica famiglia diversa per promuovere M-E a CHIUSO sotto M12","T2 mss:review resta NON INIZIATO","R1 raccomandato ma non aperto","non aggiornare PLAN/CRUSCOTTO fino a M12"],"controls":[{"control_id":"T1","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"MSS-ALL","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"VIEWS","criterio":"npm run validate:mss:views (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:views (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_applicabile: soggetto non valutato","provider":"non_applicabile: seduta tecnica","model":"non_applicabile: seduta tecnica","runtime":"non_applicabile: seduta tecnica","surface":"non_applicabile: seduta tecnica"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["path repo","esiti gate","identificatori M-E T1 R6"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-plan-v0","owner_id":"MSS","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"sezione 15 / prossima azione M-E","revision_or_hash":"6a76f5759a36ec170a45242f5c876d2db64a5a5b","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-mandate-me","owner_id":"MSS","uri_or_path":"docs/Sessioni di lavoro/24-08-26/Prompt-mandato-ME-attrezzi-mancanti-24-08-26.md","stable_anchor_or_event_id":"mandato M-E","revision_or_hash":"ca3b8a251666ce435a7aa99a90a9091edd6dc864","sensitivity":"internal"},{"ref_id":"source-mf-chiusura","owner_id":"MSS","uri_or_path":"docs/Sessioni di lavoro/24-08-26/Report-controverifica-MF-24-08-26.md","stable_anchor_or_event_id":"handoff prossimo M-E","revision_or_hash":"working tree 24-08-2026","sensitivity":"internal"},{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/FOLLOW_UP.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"package.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"scripts/check-doc-paths.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"scripts/mss/export-kit.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a034c7-898c-7052-8114-055f0984ac2a","correlation_id":"mss-cor-01a034c7-898c-7582-8fe3-56d9da9e66d0","segment_no":1,"created_at":"2026-08-24T19:18:07+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-cursor-composer","actor_type":"agente","role":"esecutore-mss-me","agent_runtime":{"provider":"Cursor","model":"cursor-composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a034c7-898c-7d07-aeb8-cb85cbd0c56f","capture_key":"mss-ses-01a034c7-898c-7052-8114-055f0984ac2a/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a034c7-898c-7334-a9d8-a66fbd978db4","axis":"persona","subject_record_ids":["mss-rec-01a034c7-898c-73bc-9416-d273d7369d8d"],"delta":"nessuno","assertions":[{"signal":"nessuna nuova osservazione Persona: seduta tecnica di implementazione","actor":"non_applicabile: soggetto non valutato","assistance":"spontaneo","origin":"naturale","source_ref":"source-mandate-me","effect":"nessuna promozione o inferenza Persona","evidence_state":"not_applicable"}],"asserted_by":{"actor_id":"cursor-composer-esecutore-me","role":"esecutore","basis":"direct_observation"},"verification":{"status":"not_applicable","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile:nessuna valutazione Persona","evidence_refs":[],"notes":"seduta tecnica"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a034c7-898c-7052-8114-055f0984ac2a","correlation_id":"mss-cor-01a034c7-898c-7582-8fe3-56d9da9e66d0","segment_no":1,"created_at":"2026-08-24T19:18:07+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-cursor-composer","actor_type":"agente","role":"esecutore-mss-me","agent_runtime":{"provider":"Cursor","model":"cursor-composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a034c7-898c-773a-ac31-8ec51bdf263c","capture_key":"mss-ses-01a034c7-898c-7052-8114-055f0984ac2a/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a034c7-898c-74d7-9a91-7c7788ba3701","axis":"sistema","subject_record_ids":["mss-rec-01a034c7-898c-73bc-9416-d273d7369d8d"],"delta":"creato","assertions":[{"rule_id_version":"T1/R6/M-E","trigger_event":"spostare un file MSS costava un move manuale da ~1741 righe senza attrezzo","decision_or_output_changed":"mss:move sposta, aggiorna riferimenti vivi, rifiuta zone congelate e annulla se validate:docs fallisce","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"cursor-composer-esecutore-me","role":"esecutore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-plan-v0","evidence_refs":[],"notes":"T1/R6 test + validate:mss:all; richiede controverifica famiglia diversa per M12"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a034c7-898c-7052-8114-055f0984ac2a","correlation_id":"mss-cor-01a034c7-898c-7582-8fe3-56d9da9e66d0","segment_no":1,"created_at":"2026-08-24T19:18:07+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-cursor-composer","actor_type":"agente","role":"esecutore-mss-me","agent_runtime":{"provider":"Cursor","model":"cursor-composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a034c7-898c-7f72-a14d-aa1604b97738","capture_key":"mss-ses-01a034c7-898c-7052-8114-055f0984ac2a/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a034c7-898c-716d-a33f-6f4b83036fcb","axis":"output","subject_record_ids":["mss-rec-01a034c7-898c-73bc-9416-d273d7369d8d"],"delta":"creato","assertions":[{"output_id":"m-e-mss-move-t1-24-08-26","primary_type":"prova","canonical_version":"working tree 24-08-2026","recipient":"Matteo e agenti MSS","problem_or_job":"spostare un file MSS senza rincorrere i link a mano","intended_use":"npm run mss:move -- <da> <a> su path non congelati","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"Matteo","authored_by":"cursor-composer-esecutore-me","verified_by":"non_osservato: controverifica M12 pendente","acceptance_criterion":"test T1/R6 prova move ok, rifiuti leggibili e rollback; validate:mss:all verde; delta righe << 1741","verification_or_use_evidence":"test:mss:tools e validate:mss:all verdi in questa seduta; prova sandbox exit 0 con 1 ref e lineDelta 1","verification_status":"self_report","owner_ref":"owner-plan-v0","privacy_release":"internal","support_files":["scripts/mss/move.mjs","scripts/doc-paths-lib.mjs","docs/MetaSkillSystem/tests/tools/run.mjs"],"relations_no_double_count":[],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-composer-esecutore-me","role":"esecutore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-plan-v0","evidence_refs":[],"notes":"T1/R6 test + validate:mss:all; richiede controverifica famiglia diversa per M12"}}}
```
