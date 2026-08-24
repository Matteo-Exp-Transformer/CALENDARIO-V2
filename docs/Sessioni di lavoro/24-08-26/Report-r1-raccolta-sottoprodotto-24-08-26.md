# R1 — capsula come sottoprodotto

**Cosa è cambiato:** chi chiude una seduta MSS non deve più riscrivere la busta JSON: consegna solo i tre giudizi Persona, Sistema e Output.
**Cosa resta:** controverifica esterna da una famiglia diversa e sola eventuale chiusura formale di R1.
**Serve una tua azione:** sì — consegnare il prompt di revisione esterna a Cursor dopo i gate interni.

## 2. Cosa è stato fatto

1. Aperto R1 su richiesta di Matteo e rilevato il costo concreto: la modalità precedente chiedeva anche i fatti già ricavabili da Git, runtime e controlli.
2. Aggiunta la modalità compatta di `mss:capsule`: il file giudizi contiene solo i tre assi; UUID, orario, contesto Git, runtime, controlli e riferimenti Git sono composti dalla macchina.
3. Dove un dato non è disponibile (intento chat, soggetto, follow-up), il record lo marca `non_osservato` invece di inventarlo.
4. Consentito `assertions: []` solo quando il delta dell'asse è `nessuno`; per gli altri delta il validator mantiene l'asserzione obbligatoria.
5. Aggiunto un test nominato R1 che costruisce e valida una capsula da soli tre giudizi, senza busta JSON manuale.

## 3. File toccati e perché

| File | Perché |
|---|---|
| `scripts/mss/capsule.mjs` | Nuovo ingresso compatto R1 e template dedicato. |
| `scripts/mss/core.mjs` | Riconosce l'assenza osservata senza richiedere dati fittizi. |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | Prova nominata R1, non solo un golden test generico. |
| `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | Allinea lo schema all'assenza osservata e agli assi senza asserzioni. |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | Spiega il flusso compatto all'agente freddo. |

## 4. Test eseguiti e risultato

I controlli che chiudono questa seduta sono registrati automaticamente nella capsula qui sotto. Dopo l'append verranno rieseguiti anche il validator del report e il cancello MSS completo.

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | Istruzione `--template-r1` e limiti della raccolta automatica. | L'agente freddo deve usare il nuovo flusso senza ricostruirlo dal codice. |
| `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | Assenza osservata e `open_items` non osservato. | Il contratto resta allineato al validator. |

## 6. Dati comunicazione

- Prompt sostanziali di Matteo: 1 richiesta operativa, poi 1 controllo di comprensione.
- Formula utile: «usa questa chat come esperienza per testare il MSS mentre lo utilizzi».
- Automatizzabile con certezza: metadati Git, timestamp, runtime whitelist e controlli lanciati dal generatore.
- Da lasciare esplicito: giudizi sui tre assi e qualsiasi fatto che il generatore non può osservare.

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali: 1. Correzioni dopo la prima risposta: 0.
- Il vincolo «solo tre giudizi» ha fatto emergere due campi del contratto che non distinguevano assenza e nessuno; sono stati corretti senza abbassare i gate per i dati presenti.

## 8. Lettura dell'agente

La prova ha verificato il principio R1 nel flusso reale: il report resta il racconto umano, mentre la capsula registra automaticamente i fatti riproducibili. L'attrito residuo è intenzionale: senza un recorder dei comandi della chat, `--check` riesegue i gate di chiusura anziché attribuire comandi passati non tracciati.

## 9. Derivazione errori

- **Vincolo strutturale:** il validator richiedeva sempre almeno un'asserzione e `open_items` poteva essere solo array o `nessuno`. Per R1 avrebbe indotto un'affermazione fittizia. Correzione: assenza esplicita ammessa soltanto nei due casi, con test R1.

## 10. Cosa resta per la prossima sessione

- Revisione indipendente Cursor della modalità R1 e della prova reale di questa seduta.
- Se la controverifica è verde, aggiornare lo stato owner di R1 a `CHIUSO` secondo M12; nessun commit o push è autorizzato da questa chat.

## 10-bis. Handoff al prossimo agente

**Cosa è vero adesso:** R1 è implementato nel working tree e ha una prova automatica nominata. La capsula di questa stessa seduta viene prodotta dal nuovo ingresso compatto. `WP-1` resta NO-GO e H-1.3 resta PASS_CON_RISERVE.

**Gate rimasto:** la controverifica deve essere eseguita da Cursor (famiglia diversa), rieseguendo i controlli e cercando regressioni o dati inventati. Solo con prova eseguibile, test nominato e controverifica diversa R1 può essere dichiarato chiuso secondo M12.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica path e revisione o hash; per i messaggi chat non in repo, riportali verbatim.
✅ R1: Mandato vivo `docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md` a `65b07e5`; messaggio Matteo: «sei agente senior orchestrator. usa questa chat come esperienza per testare il MSS mentre lo utlizzi. lo scopo di questa chat è : aprire R1 e completarlo. lasciandomi il pormpt di revisione esterna di altro modello ( cursor) quando hai passato tutti i gate di validazione. tu rimane sempre senior orchestator usa pure sub agents.»

❓ Q2 — Dati = diff reale? Confermi che i controlli e i dati del report coincidono con diff/git/comandi rieseguiti?
✅ R2: Sì; la capsula registra i controlli eseguiti dal generatore e il validator del report viene rieseguito dopo l'append.

❓ Q3 — File correlati: la tabella §5 è completa e verificata?
✅ R3: Sì; le uniche skill vive toccate sono manuale MSS e contratto capsula, entrambe elencate e allineate.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non ho aperto WP-1, non ho registrato comandi passati non tracciati, non ho dichiarato R1 chiuso e non ho eseguito commit o push.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow e come lo miglioreresti?
✅ R5: La prima prova R1 è stata rossa perché il fallback automatico dell'ambiente avveniva dopo la validazione; corretta la sequenza. Futuro separato: recorder append-only dei comandi, per non rieseguire i soli gate finali.

❓ Q6 — Contesto & hook: il contesto caricato era troppo / giusto / troppo poco?
✅ R6: Giusto per il lavoro MSS: manuale, mandato, contratto e owner hanno dato i limiti necessari; il corpus storico non è stato riletto a tappeto.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a034f3-3491-7c23-a57a-bd19d9d2bbbc","correlation_id":"mss-cor-01a034f3-3491-7145-af2f-5f9091278e07","segment_no":1,"created_at":"2026-08-24T20:05:49+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-senior-orchestrator-r1","actor_type":"agente","role":"senior orchestrator MSS","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5.6","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"session_event","record_id":"mss-rec-01a034f3-3491-7077-9b4f-8bcfed5665e9","capture_key":"mss-ses-01a034f3-3491-7c23-a57a-bd19d9d2bbbc/1/session_event/1","event":{"event_id":"mss-evt-01a034f3-3491-709f-9441-be7fe3835af0","event_kind":"session_close","occurred_at":"2026-08-24T20:05:49+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"senior orchestrator MSS","area":"MetaSkillSystem / raccolta R1","environment":"branch env/test; HEAD 65b07e5; 7 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/24-08-26/Report-r1-raccolta-sottoprodotto-24-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/24-08-26/Report-r1-raccolta-sottoprodotto-24-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"capsula composta da Git, runtime e controlli eseguiti dal generatore","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"R1-TOOLS","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"R1-H1","criterio":"npm run test:mss (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"R1-DOCS","criterio":"npm run validate:docs (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:docs (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"R1-DIFF","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"65b07e5","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"65b07e5","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"65b07e5","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"scripts/mss/capsule.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"65b07e5","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"scripts/mss/core.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"65b07e5","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a034f3-3491-7c23-a57a-bd19d9d2bbbc","correlation_id":"mss-cor-01a034f3-3491-7145-af2f-5f9091278e07","segment_no":1,"created_at":"2026-08-24T20:05:49+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-senior-orchestrator-r1","actor_type":"agente","role":"senior orchestrator MSS","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5.6","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a034f3-3491-703f-9538-5fbfd489e972","capture_key":"mss-ses-01a034f3-3491-7c23-a57a-bd19d9d2bbbc/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a034f3-3491-7d96-95d8-99ce9534be76","axis":"persona","subject_record_ids":["mss-rec-01a034f3-3491-7077-9b4f-8bcfed5665e9"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"openai-codex-senior-orchestrator-r1","role":"senior orchestrator MSS","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a034f3-3491-7c23-a57a-bd19d9d2bbbc","correlation_id":"mss-cor-01a034f3-3491-7145-af2f-5f9091278e07","segment_no":1,"created_at":"2026-08-24T20:05:49+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-senior-orchestrator-r1","actor_type":"agente","role":"senior orchestrator MSS","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5.6","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a034f3-3491-7999-a52f-36ec7bf6158a","capture_key":"mss-ses-01a034f3-3491-7c23-a57a-bd19d9d2bbbc/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a034f3-3491-7739-a939-030aae73c484","axis":"sistema","subject_record_ids":["mss-rec-01a034f3-3491-7077-9b4f-8bcfed5665e9"],"delta":"modificato","assertions":[{"rule_id_version":"R1@mss-v0.1-wp0.1-freeze-2","trigger_event":"Matteo ha aperto R1 e chiesto di testare MSS usando questa stessa chat","decision_or_output_changed":"mss:capsule accetta tre soli assi e costruisce la busta dai fatti automatici, dichiarando non osservati i dati non deducibili","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"openai-codex-senior-orchestrator-r1","role":"senior orchestrator MSS","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a034f3-3491-7c23-a57a-bd19d9d2bbbc","correlation_id":"mss-cor-01a034f3-3491-7145-af2f-5f9091278e07","segment_no":1,"created_at":"2026-08-24T20:05:49+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-senior-orchestrator-r1","actor_type":"agente","role":"senior orchestrator MSS","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5.6","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a034f3-3491-7fb4-acb6-b90964acf822","capture_key":"mss-ses-01a034f3-3491-7c23-a57a-bd19d9d2bbbc/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a034f3-3491-7f53-9e19-b9f29e0e6787","axis":"output","subject_record_ids":["mss-rec-01a034f3-3491-7077-9b4f-8bcfed5665e9"],"delta":"creato","assertions":[{"output_id":"r1-raccolta-sottoprodotto-24-08-26","primary_type":"processo","canonical_version":"docs/Sessioni di lavoro/24-08-26/Report-r1-raccolta-sottoprodotto-24-08-26.md","recipient":"Matteo e revisore esterno Cursor","problem_or_job":"chiudere una seduta MSS senza ricopiare i fatti che la macchina gia possiede","intended_use":"generare e controverificare capsule R1 con tre soli giudizi","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"richiesta chat corrente","authored_by":"openai-codex-senior-orchestrator-r1","verified_by":"non_osservato","acceptance_criterion":"capsula compatta valida, test nominato R1 e gate MSS verdi","verification_or_use_evidence":"controlli registrati nella capsula di questo report","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["scripts/mss/capsule.mjs","scripts/mss/core.mjs","docs/MetaSkillSystem/tests/tools/run.mjs"],"relations_no_double_count":["processo di raccolta; il report resta un registro"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"openai-codex-senior-orchestrator-r1","role":"senior orchestrator MSS","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
