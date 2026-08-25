# Report — Comunicazione diretta degli agenti — 25-08-2026

**Modalità:** standard · **Ruolo:** revisore comunicazione · **Branch:** `env/test`

## 1. Cappello

- **Cosa è cambiato:** le risposte degli agenti inizieranno indicando quale elemento viene toccato, quale intervento ricevono e quale risultato Matteo può verificare.
- **Cosa resta:** il comportamento reale degli agenti va osservato nelle prossime sessioni; la regola è già inserita nei loro ingressi e prompt.
- **Serve una tua azione:** no.

## 2. Cosa è stato fatto

È stato fissato un formato unico: prima una frase completa e comprensibile, poi soltanto le sezioni utili per capire dove siamo, quale direzione conviene, cosa è già pronto e quale azione resta a Matteo.

Le istruzioni che avviano gli agenti e quelle che preparano i prompt ora vietano sigle, identificatori di task e dettagli tecnici nella parte destinata a Matteo. Il cruscotto usa lo stesso linguaggio: ogni scheda dice cosa fare, l'intervento e il motivo.

## 3. File toccati e perché

| File | Perché |
|---|---|
| Istruzioni comuni degli agenti | Rendere obbligatoria la prima frase autosufficiente su tutte le superfici di lavoro. |
| Skill di comunicazione e chiusura sessione | Definire il formato breve e il modo corretto di iniziare un report. |
| Skill che prepara i prompt | Consegnare agli esecutori il formato già dentro il loro mandato. |
| Generatore e pagina del cruscotto | Mostrare lavori in linguaggio diretto, senza codici nella vista principale. |

## 4. Test eseguiti e risultato

| Verifica | Risultato |
|---|---|
| Controllo del generatore del cruscotto | Superato. |
| Test degli strumenti del sistema | Superati: 73 controlli. |
| Controllo delle viste e dei riferimenti nei documenti | Superato. |
| Anteprima del cruscotto | Controllata e approvata da Matteo per linguaggio e impostazione. |

> Durante la prima generazione della capsula, due controlli hanno segnalato la lista dei report non
> aggiornata: il nuovo report l'aveva resa volutamente non allineata. La lista è stata rigenerata e
> le verifiche finali sono tutte verdi. La capsula conserva onestamente quel primo tentativo rosso.

## 5. File di skill aggiornati

| Area | Modifica | Perché |
|---|---|---|
| Comunicazione verso Matteo | Prima frase autosufficiente e sezioni finali standard. | Evitare testi tecnici, ripetitivi e incompleti. |
| Preparazione prompt | Formato imposto agli agenti esecutori e revisori. | Far arrivare la regola nel punto in cui ricevono il lavoro. |
| Chiusura sessione | Apertura del report in linguaggio diretto. | Rendere leggibile il risultato fin dalla prima riga. |
| MetaSkillSystem | Descrizione del cruscotto aggiornata. | Evitare che il manuale prometta una vista tecnica diversa da quella reale. |

## 6. Dati comunicazione

- **Richiesta di Matteo:** gli agenti ripetono informazioni, usano troppe sigle e costringono a chiedere ogni volta il punto della situazione.
- **Formato che ha funzionato:** una frase completa e diretta, seguita da schede con “cosa fare”, “intervento” e “serve a”. Matteo ha approvato esplicitamente il linguaggio del cruscotto.
- **Automatizzato:** la regola entra nelle istruzioni di Codex, Claude e Cursor e nei prompt degli esecutori.
- **Da osservare:** se gli agenti applicano davvero la regola nelle prossime risposte; non esiste ancora un controllo automatico sul testo di una chat.

## 7. Analisi flusso prompt, efficienza e statistiche

- Messaggi sostanziali di Matteo: 4.
- Correzioni dopo la prima proposta: 2 — il primo cruscotto era troppo tecnico e la prima interpretazione del file di riferimento era errata.
- Rework completato: linguaggio del cruscotto riscritto e poi approvato da Matteo.
- Miglioria replicabile: ogni futuro lavoro deve tradurre il task in elemento → intervento → risultato prima di mostrarne lo stato.

## 8. Lettura della sessione

La regola precedente “breve per default” non bastava: non obbligava l'agente a fornire un quadro completo né a evitare i codici. La nuova regola collega il linguaggio alla struttura della risposta e la passa anche agli esecutori, quindi riduce il rischio che resti soltanto una preferenza scritta in un file secondario.

## 9. Derivazione errori

| Difficoltà | Origine | Correzione applicata |
|---|---|---|
| Cruscotto pieno di codici e stati tecnici | Il generatore trasformava quasi direttamente il testo del piano in HTML. | Schede con lavoro, intervento, scopo e disponibilità espressi in italiano diretto. |
| Risposte brevi ma non sufficienti per decidere | La skill imponeva brevità, non una sequenza decisionale. | Formato con quadro, consiglio e materiale già pronto per il passo dopo. |

## 10. Cosa resta

Niente da implementare ora. Nelle prossime sessioni va raccolto il comportamento reale degli agenti, così potremo correggere eventuali punti in cui la regola viene ignorata.

## 11. Domande di chiusura

❓ Q1 — Origine: quale richiesta ha autorizzato il lavoro?

✅ R1: richiesta diretta di Matteo in questa chat; nessun mandato esterno usato.

❓ Q2 — Dati e diff: le verifiche dichiarate coincidono con il lavoro sul disco?

✅ R2: sì. I controlli sono registrati nella capsula e il report staged passa la validazione.

❓ Q3 — Allineamento: tutte le istruzioni che raggiungono gli agenti sono state aggiornate?

✅ R3: sì. Skill, istruzioni globali, regole Cursor e prepara-prompt sono aggiornati insieme.

❓ Q4 — Non fatto: cosa resta deliberatamente fuori?

✅ R4: non è stato introdotto un blocco automatico sul testo delle chat, perché non è verificabile in modo affidabile dai file.

❓ Q5 — Attrito: quale problema è emerso e come è stato corretto?

✅ R5: il primo artefatto dava priorità ai dati del piano, non alla comprensione di Matteo; la vista è stata riscritta partendo da attività concrete.

❓ Q6 — Contesto: il contesto caricato è stato sufficiente?

✅ R6: sì. Il routing comunicazione e MetaSkillSystem è stato sufficiente; nessun hook di fine sessione necessario.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a039ad-0a82-71a0-9a53-46e1f3718a6d","correlation_id":"mss-cor-01a039ad-0a82-796b-8421-aeb538c2efaa","segment_no":1,"created_at":"2026-08-25T18:07:16+02:00","finalization":"final","recorded_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-gpt-5.6","actor_type":"agente","role":"revisore comunicazione","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5.6","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"comunicazione-utente","package_version_or_revision":"2026-08-25","source_ref":"docs/COMUNICAZIONE_UTENTE_SKILL.md"},{"package_id":"metaskill-system","package_version_or_revision":"v0","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"session_event","record_id":"mss-rec-01a039ad-0a82-7878-82a7-a623c37cd513","capture_key":"mss-ses-01a039ad-0a82-71a0-9a53-46e1f3718a6d/1/session_event/1","event":{"event_id":"mss-evt-01a039ad-0a82-7752-949d-a107f6606adb","event_kind":"session_close","occurred_at":"2026-08-25T18:07:16+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"revisore comunicazione","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD c361f2c; 13 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-contratto-comunicazione-diretta-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-contratto-comunicazione-diretta-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"NODE","criterio":"node --check scripts/mss/views-html.mjs (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: node --check scripts/mss/views-html.mjs (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"TOOLS","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"fail","numeratore":0,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 1; atteso 0)","evidence_refs":[]},{"control_id":"VIEWS","criterio":"npm run validate:mss:views (atteso exit 0)","esito":"fail","numeratore":0,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:views (exit 1; atteso 0)","evidence_refs":[]},{"control_id":"DOCS","criterio":"npm run validate:docs (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:docs (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":".claude/CLAUDE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"c361f2c","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":".cursor/rules/comandi-base.mdc","stable_anchor_or_event_id":"working tree","revision_or_hash":"c361f2c","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":".cursor/skills/calendarbackup-comunicazione-utente/SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"c361f2c","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"AGENTS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"c361f2c","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/COMUNICAZIONE_UTENTE_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"c361f2c","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"c361f2c","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/OSSERVAZIONI.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"c361f2c","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/PROPOSTE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"c361f2c","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"docs/PREPARA_PROMPT_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"c361f2c","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"scripts/mss/views-html.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"c361f2c","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a039ad-0a82-71a0-9a53-46e1f3718a6d","correlation_id":"mss-cor-01a039ad-0a82-796b-8421-aeb538c2efaa","segment_no":1,"created_at":"2026-08-25T18:07:16+02:00","finalization":"final","recorded_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-gpt-5.6","actor_type":"agente","role":"revisore comunicazione","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5.6","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"comunicazione-utente","package_version_or_revision":"2026-08-25","source_ref":"docs/COMUNICAZIONE_UTENTE_SKILL.md"},{"package_id":"metaskill-system","package_version_or_revision":"v0","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a039ad-0a82-79fd-a23d-c1a8f5fd0fb9","capture_key":"mss-ses-01a039ad-0a82-71a0-9a53-46e1f3718a6d/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a039ad-0a82-754b-bd8c-6a06bce2603d","axis":"persona","subject_record_ids":["mss-rec-01a039ad-0a82-7878-82a7-a623c37cd513"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-gpt-5.6","role":"revisore comunicazione","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a039ad-0a82-71a0-9a53-46e1f3718a6d","correlation_id":"mss-cor-01a039ad-0a82-796b-8421-aeb538c2efaa","segment_no":1,"created_at":"2026-08-25T18:07:16+02:00","finalization":"final","recorded_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-gpt-5.6","actor_type":"agente","role":"revisore comunicazione","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5.6","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"comunicazione-utente","package_version_or_revision":"2026-08-25","source_ref":"docs/COMUNICAZIONE_UTENTE_SKILL.md"},{"package_id":"metaskill-system","package_version_or_revision":"v0","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a039ad-0a82-7654-b149-c885e0f1b3a1","capture_key":"mss-ses-01a039ad-0a82-71a0-9a53-46e1f3718a6d/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a039ad-0a82-7e4c-959f-bc2fb936e1b3","axis":"sistema","subject_record_ids":["mss-rec-01a039ad-0a82-7878-82a7-a623c37cd513"],"delta":"modificato","assertions":[{"rule_id_version":"COMUNICAZIONE-REGOLA-ZERO@2026-08-25","trigger_event":"Matteo segnala che gli agenti producono testi lunghi, tecnici e ripetitivi e chiede un formato diretto e comprensibile.","decision_or_output_changed":"La prima frase diventa obbligatoriamente autosufficiente: elemento, intervento e risultato verificabile. Il formato finale guida ogni agente con Dove siamo, Ti consiglio, Pronto per il prossimo passo e Tua azione; le istruzioni globali, Cursor e prepara-prompt lo rendono parte del mandato degli esecutori.","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-gpt-5.6","role":"revisore comunicazione","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a039ad-0a82-71a0-9a53-46e1f3718a6d","correlation_id":"mss-cor-01a039ad-0a82-796b-8421-aeb538c2efaa","segment_no":1,"created_at":"2026-08-25T18:07:16+02:00","finalization":"final","recorded_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-gpt-5.6","actor_type":"agente","role":"revisore comunicazione","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5.6","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"comunicazione-utente","package_version_or_revision":"2026-08-25","source_ref":"docs/COMUNICAZIONE_UTENTE_SKILL.md"},{"package_id":"metaskill-system","package_version_or_revision":"v0","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a039ad-0a82-7208-bcb0-0b09253dc8d1","capture_key":"mss-ses-01a039ad-0a82-71a0-9a53-46e1f3718a6d/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a039ad-0a82-7078-b952-7585e98e0d48","axis":"output","subject_record_ids":["mss-rec-01a039ad-0a82-7878-82a7-a623c37cd513"],"delta":"creato","assertions":[{"output_id":"contratto-comunicazione-diretta-25-08-26","primary_type":"governance","canonical_version":"docs/COMUNICAZIONE_UTENTE_SKILL.md","recipient":"Matteo e gli agenti che lavorano nel repository","problem_or_job":"rendere le risposte degli agenti brevi, complete e comprensibili senza sigle o domande aggiuntive","intended_use":"guidare le risposte in chat e le chiusure dei task con una frase iniziale autosufficiente e il materiale già pronto per proseguire","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"richiesta diretta di migliorare il linguaggio degli agenti e il cruscotto","authored_by":"Codex","verified_by":"Matteo: approvazione del linguaggio del cruscotto","acceptance_criterion":"la skill, le istruzioni globali e i prompt agli esecutori impongono elemento → intervento → risultato verificabile; il cruscotto non mostra codici interni nella vista principale","verification_or_use_evidence":"anteprima del cruscotto controllata da Matteo; node --check; test:mss:tools; validate:mss:views; validate:docs","verification_status":"self_report","owner_ref":"docs/COMUNICAZIONE_UTENTE_SKILL.md","privacy_release":"internal","support_files":["AGENTS.md",".claude/CLAUDE.md",".cursor/rules/comandi-base.mdc",".cursor/skills/calendarbackup-comunicazione-utente/SKILL.md","docs/PREPARA_PROMPT_SKILL.md","scripts/mss/views-html.mjs","docs/MetaSkillSystem/Cruscotto MSS.html"],"relations_no_double_count":["Il cruscotto è una dimostrazione visiva del contratto, non una seconda regola indipendente.","L'osservazione dell'uso reale da parte di agenti futuri resta da raccogliere."],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-gpt-5.6","role":"revisore comunicazione","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
