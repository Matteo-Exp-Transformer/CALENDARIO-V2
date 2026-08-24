# SK-8 T6 — promozione della suite da root diverse

**Modalità:** deep · **Ruolo:** esecutore SK-8 T6 · **Branch:** `env/test`
**HEAD iniziale:** `6ec9dbaddae62a643e713096495d26f2bb640904`
**Esito in una riga:** **SK-8 pronto, firma formale Matteo pendente** — la capacità già implementata è ora coperta da una prova nominata, non vacua e riproducibile.

## 1. Cappello

- **Cosa è cambiato:** la suite H-1 prova esplicitamente l'esecuzione dell'intero entrypoint da una cwd esterna alla repository.
- **Cosa resta:** controverifica M12 di famiglia diversa, promozione nell'owner e rigenerazione cruscotto a cura dell'orchestratore; firma formale Matteo pendente come richiesto dal mandato.
- **Serve un'azione di Matteo:** solo la firma formale successiva ai gate; commit/push restano vietati senza il suo sì.

## 2. Cosa è stato fatto

1. Aggiunto il caso nominato `SK-8 — test:mss esegue l’intera suite da cwd diversa risolvendo la root dalla posizione del file` alla suite H-1 esistente.
2. Il processo padre crea una directory temporanea esterna e rilancia con path assoluto lo stesso `run.mjs` usando quella directory come `cwd`.
3. Un flag d'ambiente vale solo nel figlio e impedisce il secondo spawn; il figlio continua a eseguire tutte le fixture e tutti i gruppi H-1.
4. Il figlio asserisce che la cwd ricevuta è quella esterna, che non coincide con la root repo e che `package.json` e manifest sono risolti dalla posizione del file.
5. Il padre richiede sia il marker del caso SK-8 sia il completamento `H-1 suite green`; un ritorno a `process.cwd()` rende il processo figlio rosso prima o durante il caricamento delle fixture.

## 3. File toccati e perché

| File | Perché |
|---|---|
| `docs/MetaSkillSystem/tests/h1/run.mjs` | Test nominato e harness child minimale anti-ricorsione. |
| `docs/Sessioni di lavoro/24-08-26/judgments-sk8-promozione-t6-24-08-26.json` | Tre soli giudizi per la capsula R1. |
| questo report | Unico report e unica capsula del mandato SK-8 T6. |

Gli artefatti R1/SK-4, `PLAN_V0.md`, cruscotto, manuale, prodotto e DB sono stati preservati.

## 4. Test e prove

### Prova mirata da cwd diversa

| Dato | Valore osservato |
|---|---|
| cwd figlio | `C:\Users\matte.MIO\AppData\Local\Temp\mss-sk8-manual-87fc318740a74a99bed19deb48383a25` |
| entrypoint assoluto | `C:\Users\matte.MIO\Documents\GitHub\CalendarBackup-v2\docs\MetaSkillSystem\tests\h1\run.mjs` |
| confronto | cwd figlio diversa da `C:\Users\matte.MIO\Documents\GitHub\CalendarBackup-v2` |
| marker | `OK SK-8 — test:mss esegue l’intera suite da cwd diversa risolvendo la root dalla posizione del file` |
| completamento | `H-1 suite green` · exit 0 |

La directory temporanea è stata rimossa dopo la prova. Il comando normale `npm run test:mss` ha poi eseguito lo stesso caso dal processo padre e il rilancio figlio senza ricorsione, exit 0.

I controlli finali rieseguiti da `mss:capsule` sono registrati nei `controls[]`; il validator del report e `validate:mss:all` vengono eseguiti dopo l'append.

| Comando | Esito |
|---|---|
| child diretto `node <entrypoint-assoluto>` con cwd temporanea e flag anti-ricorsione | exit 0; marker SK-8 e coda `H-1 suite green` presenti |
| `npm run test:mss` | exit 0; caso SK-8 nominato verde e repository non riscritta |
| `npm run mss:capsule -- … --check … --append-to <report>` | exit 0; un'unica capsula generata |
| `npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/24-08-26/Report-sk8-promozione-t6-24-08-26.md" --kind report --require-capsule` | exit 0 — `validate:mss OK` |
| `npm run validate:docs` | exit 0; nessun path rotto |
| `npm run validate:mss:all` | exit 0; include `test:mss`, `test:mss:tools`, viste e docs |
| `git diff --check` | exit 0; solo avviso CRLF sul `PLAN_V0.md` preesistente |

## 5. File di skill aggiornati

Nessuno. La nota operativa nel manuale non serve: SK-8 promuove una proprietà coperta dalla suite, non introduce un nuovo comando o flusso utente.

## 6. Dati comunicazione

- Mandato parent: promuovere SK-8 con test nominato e non vacuo da cwd diversa, harness/flag minimale, un solo report e capsula R1.
- Vincoli rispettati: preservare R1/SK-4; nessun owner/cruscotto, `src/`, DB, `WP-1`, `SK-10`, commit o push.
- Correzioni di Matteo durante il mandato: nessuna.

## 7. Analisi del flusso

La prova precedente era solo descritta. Il nuovo test rende falsificabile la proprietà: non controlla una stringa nel sorgente, ma avvia davvero la suite con una cwd estranea e pretende il completamento integrale. Il flag riduce il solo ciclo ricorsivo senza saltare i test del figlio.

## 8. Lettura dell'agente

SK-8 è pronto alla promozione documentale: l'implementazione via `import.meta.url` era già presente e non è stata riscritta. Il valore aggiunto è la regressione riconoscibile per nome e capace di fallire se la suite torna a risolvere file dalla cwd.

## 9. Derivazione errori

- **Rischio:** test tautologico che confronta solo costanti. **Prevenzione:** child process reale con cwd esterna e suite completa.
- **Rischio:** ricorsione infinita. **Prevenzione:** flag `MSS_SK8_DIFFERENT_CWD_CHILD` interpretato soltanto dal caso SK-8 nel figlio.
- **Rischio:** falso verde del child. **Prevenzione:** il padre richiede marker nominato e coda verde dell'intera suite.

## 10. Cosa resta

- Controverifica M12 di famiglia diversa.
- Aggiornamento `PLAN_V0.md` §4-bis/§4-ter e cruscotto da parte dell'orchestratore.
- Firma formale Matteo pendente; nessun commit/push prima del suo sì.

## 10-bis. Handoff

**Vero adesso:** test SK-8 nel working tree, prova manuale da cwd temporanea exit 0, `npm run test:mss` exit 0. **Da rifare:** il test nominato, `validate:mss:all`, validator del report e diff. **Da non toccare:** artefatti R1/SK-4, owner/cruscotto, prodotto, DB, `WP-1`, `SK-10`.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica path e revisione o hash; per i messaggi chat non in repo, riportali verbatim.
✅ R1: mandato `docs/Sessioni di lavoro/24-08-26/Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md` nel working tree; HEAD iniziale `6ec9dbaddae62a643e713096495d26f2bb640904`. Mandato parent: «Nuovo mandato, sequenziale dopo R1 e SK-4: esegui Mandato 3 T6 SK-8 promozione documentale della suite da root diverse […]».

❓ Q2 — Dati = diff reale? Confermi che i controlli e i dati del report coincidono con diff/git/comandi rieseguiti?
✅ R2: Sì; cwd, entrypoint, marker ed exit sono output della prova reale. I controlli finali sono prodotti dal generatore nella capsula.

❓ Q3 — File correlati: la tabella §5 è completa e verificata?
✅ R3: Sì; nessuna skill o manuale è stato aggiornato. L'unico file di codice/test toccato da SK-8 è l'harness H-1.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non ho modificato artefatti R1/SK-4, owner/cruscotto, `src/`, DB o manuale; non ho aperto `WP-1`/`SK-10`; non ho eseguito commit/push.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow e come lo miglioreresti?
✅ R5: Il test deve provare la cwd senza richiamarsi all'infinito. Il flag figlio circoscritto al solo caso SK-8 conserva la suite completa e rende leggibile il motivo della deviazione.

❓ Q6 — Contesto & hook: il contesto caricato era troppo / giusto / troppo poco?
✅ R6: Giusto: prompt T6, ingresso MSS, owner già letto e il solo harness H-1 necessario. Nessun corpus storico o area prodotto è stato aperto.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0359d-3629-7233-b8b1-bcd833dd2377","correlation_id":"mss-cor-01a0359d-3629-761f-a1de-c707db46d754","segment_no":1,"created_at":"2026-08-24T23:11:30+02:00","finalization":"final","recorded_by":{"actor_id":"openai-gpt-5.6-sol-sk8-t6","actor_type":"agente","role":"esecutore SK-8 T6","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5.6-sol","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["Codex"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"session_event","record_id":"mss-rec-01a0359d-3629-7841-979e-52c5447e7350","capture_key":"mss-ses-01a0359d-3629-7233-b8b1-bcd833dd2377/1/session_event/1","event":{"event_id":"mss-evt-01a0359d-3629-7c6c-b9cf-35d44748c62c","event_kind":"session_close","occurred_at":"2026-08-24T23:11:30+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore SK-8 T6","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 6ec9dba; 22 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/24-08-26/Report-sk8-promozione-t6-24-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/24-08-26/Report-sk8-promozione-t6-24-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"SK8-H1","criterio":"npm run test:mss (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"SK8-DOCS","criterio":"npm run validate:docs (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:docs (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"SK8-DIFF","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"scripts/mss/adapter.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"scripts/mss/core.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"scripts/mss/review.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0359d-3629-7233-b8b1-bcd833dd2377","correlation_id":"mss-cor-01a0359d-3629-761f-a1de-c707db46d754","segment_no":1,"created_at":"2026-08-24T23:11:30+02:00","finalization":"final","recorded_by":{"actor_id":"openai-gpt-5.6-sol-sk8-t6","actor_type":"agente","role":"esecutore SK-8 T6","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5.6-sol","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["Codex"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a0359d-3629-7c08-8259-76e0b5c2ae8f","capture_key":"mss-ses-01a0359d-3629-7233-b8b1-bcd833dd2377/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a0359d-3629-749d-bcd4-783277186eb6","axis":"persona","subject_record_ids":["mss-rec-01a0359d-3629-7841-979e-52c5447e7350"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"openai-gpt-5.6-sol-sk8-t6","role":"esecutore SK-8 T6","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0359d-3629-7233-b8b1-bcd833dd2377","correlation_id":"mss-cor-01a0359d-3629-761f-a1de-c707db46d754","segment_no":1,"created_at":"2026-08-24T23:11:30+02:00","finalization":"final","recorded_by":{"actor_id":"openai-gpt-5.6-sol-sk8-t6","actor_type":"agente","role":"esecutore SK-8 T6","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5.6-sol","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["Codex"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a0359d-3629-7f37-928b-aad02b84c7e2","capture_key":"mss-ses-01a0359d-3629-7233-b8b1-bcd833dd2377/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a0359d-3629-76b9-987f-b9ab0ddbce3b","axis":"sistema","subject_record_ids":["mss-rec-01a0359d-3629-7841-979e-52c5447e7350"],"delta":"verificato","assertions":[{"rule_id_version":"SK-8@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato T6: promuovere documentalmente la robustezza della suite MSS rispetto alla cwd","decision_or_output_changed":"La suite H-1 contiene un test nominato che rilancia l'intero entrypoint da una directory temporanea esterna, impedisce la ricorsione con un flag figlio e prova la root derivata dalla posizione del file","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"openai-gpt-5.6-sol-sk8-t6","role":"esecutore SK-8 T6","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0359d-3629-7233-b8b1-bcd833dd2377","correlation_id":"mss-cor-01a0359d-3629-761f-a1de-c707db46d754","segment_no":1,"created_at":"2026-08-24T23:11:30+02:00","finalization":"final","recorded_by":{"actor_id":"openai-gpt-5.6-sol-sk8-t6","actor_type":"agente","role":"esecutore SK-8 T6","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5.6-sol","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["Codex"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a0359d-3629-743d-942f-b66c22c36e3e","capture_key":"mss-ses-01a0359d-3629-7233-b8b1-bcd833dd2377/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a0359d-3629-7dcd-92ea-1833f7556a02","axis":"output","subject_record_ids":["mss-rec-01a0359d-3629-7841-979e-52c5447e7350"],"delta":"creato","assertions":[{"output_id":"sk8-promozione-t6-24-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/24-08-26/Report-sk8-promozione-t6-24-08-26.md","recipient":"orchestratore MSS e Matteo","problem_or_job":"rendere riproducibile e riconoscibile la robustezza di test:mss da cwd diverse","intended_use":"impedire regressioni che reintroducano dipendenza da process.cwd nella suite H-1","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"docs/Sessioni di lavoro/24-08-26/Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md","authored_by":"openai-gpt-5.6-sol-sk8-t6","verified_by":"non_osservato","acceptance_criterion":"test nominato non vacuo verde da cwd esterna, suite e cancelli MSS verdi","verification_or_use_evidence":"comandi registrati nei controls della capsula e prova cwd esplicita nel report","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/MetaSkillSystem/tests/h1/run.mjs"],"relations_no_double_count":["prova di promozione SK-8; non nuova implementazione del resolver"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"openai-gpt-5.6-sol-sk8-t6","role":"esecutore SK-8 T6","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
