# Report Codex — controverifica e chiusura SK-7 — 24-08-26

## 1. Cappello

SK-7 è chiusa e pubblicata: il commit `43feca8` (`fix(mss): close reliable capsule checks`) è su `origin/env/test`.

Il risultato pratico è che `mss:capsule` interpreta e verifica i controlli in modo più affidabile: sintassi canonica `ID=>comando`, compatibilità legacy non ambigua, rifiuto dei casi malformati, gestione corretta dei comandi che contengono arrow function e riferimenti sorgente limitati a file presenti nell'indice Git. La chiusura non è stata basata sul solo esito dell'agente esecutore: ho svolto controlli indipendenti, trovato tre difetti reali e chiesto una correzione per ciascuno prima della decisione M3.

Non resta lavoro su SK-7. Restano due modifiche esterne nel working tree, intenzionalmente escluse da questa chiusura e da questo report; non le ho modificate, aggiunte allo stage, né pubblicate.

## 2. Lavoro svolto da Codex

1. Ho analizzato il mandato iniziale e il prompt proposto per SK-7, caricando il contesto MetaSkillSystem, la Bussola, il vocabolario e le regole di chiusura.
2. Ho rilevato l'ambiguità strutturale della vecchia forma `ID:comando`: `test:mss:npm run test:mss` veniva spezzato al primo `:` e una forma come `x::node --version` arrivava alla shell con comando deformato. Ho definito la regola operativa: forma canonica `ID=>comando`; formato legacy ammesso solo con un singolo `:`; qualunque forma legacy con più `:` va rifiutata.
3. Ho riesaminato la prima implementazione e trovato un difetto residuo: il parser interpretava il secondo `=>` di un'arrow function JavaScript come separatore e rigettava un comando lecito. Ho richiesto il fix e la relativa regressione.
4. Ho riesaminato il fix successivo e trovato un difetto di pubblicabilità: `source_refs` poteva includere un report audit non tracciato. Ho richiesto che la raccolta automatica considerasse solo path già nell'indice Git, così una capsula non dichiara sorgenti impossibili da recuperare da un commit.
5. Ho controverificato i test specifici, le fixture, la validazione documentale, il lint, il validator MSS sia su file sia su stage e il controllo di whitespace. Tutti i gate di chiusura sono risultati verdi.
6. Dopo l'esplicita autorizzazione di Matteo a chiudere se tutto era corretto, ho registrato la decisione M3 nel piano, preparato uno stage selettivo, creato il commit `43feca8` e verificato il push su `origin/env/test`.

## 3. File e responsabilità

| Ambito | Intervento | Responsabilità |
| --- | --- | --- |
| `docs/MetaSkillSystem/PLAN_V0.md` | Stato S7 e decisione M3 del 24-08-26 | Modificato da me per registrare la chiusura autorizzata |
| `scripts/mss/capsule.mjs`, test e fixture SK-7 | Parser dei controlli, source refs, regressioni | Implementati dall'agente esecutore; revisionati da me |
| `docs/Sessioni di lavoro/24-08-26/judgments-codex-controverifica-sk7-24-08-26.json` | Giudizi strutturati usati per la capsula di questo report | Creato da me |
| Questo report | Registro completo della mia attività e handoff | Creato da me |

Le modifiche esterne lasciate fuori sono `docs/Sessioni di lavoro/23-08-26/Report-revisione-skill-chiusura-e-hook-23-08-26.md` (modificata) e `docs/Sessioni di lavoro/23-08-26/Report-chiusura-audit-mss-23-08-26.md` (non tracciata). Non appartengono alla mia chiusura SK-7.

## 4. Verifiche effettuate

| Gate | Esito osservato |
| --- | --- |
| `npm run test:mss:tools` | Verde: 37 test, inclusi parsing canonico/legacy, rifiuti e arrow function |
| `npm run test:mss` | Verde: 42 casi fixture e 38 gruppi di controllo |
| `npm run validate:docs` | Verde: 962 path locali, 0 rotti, 26 allowlist |
| `npm run lint:scripts` | Verde |
| `npm run validate` | Exit code 0; presenti soltanto warning React `act(...)` già noti |
| `npm run validate:mss -- --mode file` sui due report SK-7 | Verde |
| `npm run validate:mss` sullo stage selettivo | Verde |
| `git diff --check` sul perimetro SK-7 | Verde |
| commit e push | Commit `43feca8`; push `308e576..43feca8` verso `origin/env/test` riuscito |

Ho rieseguito nel generatore della capsula i quattro gate portabili qui sopra (`test:mss:tools`, `test:mss`, `validate:docs`, `lint:scripts`): sono tutti `pass`. `npm run validate` non è stato incluso nella capsula perché il sottoprocesso del generatore ha superato il suo buffer di output (`ENOBUFS`), pur essendo già passato con exit code 0 nella controverifica diretta; non ho trasformato quel limite tecnico in un falso `pass`.

## 5. Skill e documentazione aggiornate

| Artefatto | Stato | Nota |
| --- | --- | --- |
| MetaSkillSystem manuale e test SK-7 | Aggiornati dall'esecutore, verificati da me | Contratto `ID=>comando`, compatibilità legacy controllata e test di regressione |
| `PLAN_V0.md` | Aggiornato da me | S7 e relativo check 4-ter segnati `CHIUSO 24-08-26 (M3)` |
| Procedura di chiusura | Applicata | Stage selettivo, validator staged, commit e push soltanto dopo gate verdi |

## 6. Comunicazione e decisioni

La conversazione ha seguito un ciclo utile e concreto: mandato iniziale di analisi, tre avvisi dell'utente che il lavoro dell'agente era concluso con richiesta di controverifica, poi autorizzazione condizionata alla chiusura e, infine, richiesta di questo report completo.

La formulazione ripetuta «se è tutto ok chiudiamo, commit e push; altrimenti prompt» ha definito correttamente il confine: non ho dichiarato chiusa SK-7 finché un gate indipendente non avesse confermato ogni correzione. La decisione M3 è quindi di Matteo; il mio ruolo è stato verificare l'evidenza, registrarla nel piano e operare la pubblicazione già autorizzata.

## 6-bis. Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a030ad-d9e2-7010-bfb4-974e103d695d","correlation_id":"mss-cor-01a030ad-d9e2-71bf-998a-5ff1fd9a512c","segment_no":1,"created_at":"2026-08-24T00:11:35+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-reviewer","actor_type":"agente","role":"agente controverificatore MetaSkillSystem","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a030ad-d9e2-7ba6-94b4-9761dde658b7","capture_key":"mss-ses-01a030ad-d9e2-7010-bfb4-974e103d695d/1/session_event/1","event":{"event_id":"mss-evt-01a030ad-d9e2-7a29-9c3f-2bfb5791095c","event_kind":"session_close","occurred_at":"2026-08-24T00:11:35+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"Produrre il report completo del lavoro svolto da Codex: analisi del mandato SK-7, controverifiche indipendenti, individuazione dei difetti residui, decisione M3, commit e push.","session_type":"deep","capsule_status":"completa","role_key":"agente controverificatore MetaSkillSystem","area":"MetaSkillSystem / SK-7 mss:capsule","environment":"repo locale Windows, branch env/test; SK-7 pubblicato nel commit 43feca8; working tree con due modifiche esterne lasciate fuori","authorization":{"read":["docs/MetaSkillSystem/**","scripts/mss/capsule.mjs","docs/Sessioni di lavoro/23-08-26/**","git history e output dei gate"],"write":["docs/Sessioni di lavoro/24-08-26/Report-codex-controverifica-chiusura-sk7-24-08-26.md","docs/Sessioni di lavoro/24-08-26/judgments-codex-controverifica-sk7-24-08-26.json"],"forbid":["src/**","Supabase","riscrittura record final","modifiche esterne nel working tree","nuovo commit o push per questo solo report"]},"authorized_outputs":["report completo Codex","capsula di sessione generata"],"route":{"chosen":"MetaSkillSystem deep: revisione indipendente e chiusura SK-7, poi report richiesto dall'utente","alternatives_or_conflicts":"nessuno"},"observed_outcome":"SK-7 chiuso con decisione M3 dell'utente dopo tre cicli di controverifica: D2/D3, privacy append-only, sintassi con arrow function e source_refs pubblicabili sono coperti; commit 43feca8 è pushato su origin/env/test.","open_items":["modifiche esterne nel working tree, non appartenenti a SK-7"],"controls":[{"control_id":"CODX-TOOLS","criterio":"npm run test:mss:tools","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0)","evidence_refs":[]},{"control_id":"CODX-H1","criterio":"npm run test:mss","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0)","evidence_refs":[]},{"control_id":"CODX-DOCS","criterio":"npm run validate:docs","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:docs (exit 0)","evidence_refs":[]},{"control_id":"CODX-LINT","criterio":"npm run lint:scripts","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run lint:scripts (exit 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"Matteo","provider":"non_applicabile: soggetto umano","model":"non_applicabile: soggetto umano","runtime":"non_applicabile: soggetto umano","surface":"chat Codex"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["stato Git","esiti di test aggregati","path del repository","hash commit"],"prohibited_content":["materiale privato non registrabile","segreti","token di autenticazione"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-plan","owner_id":"SYS-1","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"sezione 4-bis S7","revision_or_hash":"43feca8","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-fix-report","owner_id":"SK-7","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-fix-sk7-timbri-23-08-26.md","stable_anchor_or_event_id":"report completo","revision_or_hash":"43feca8","sensitivity":"internal"},{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-revisione-skill-chiusura-e-hook-23-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"43feca8","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a030ad-d9e2-7010-bfb4-974e103d695d","correlation_id":"mss-cor-01a030ad-d9e2-71bf-998a-5ff1fd9a512c","segment_no":1,"created_at":"2026-08-24T00:11:35+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-reviewer","actor_type":"agente","role":"agente controverificatore MetaSkillSystem","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a030ad-d9e2-75ac-bc82-37b94aa0601b","capture_key":"mss-ses-01a030ad-d9e2-7010-bfb4-974e103d695d/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a030ad-d9e2-74a5-8c4f-6187fc20c2fb","axis":"persona","subject_record_ids":["mss-rec-01a030ad-d9e2-7ba6-94b4-9761dde658b7"],"delta":"nessuno","assertions":[{"signal":"Matteo ha richiesto controverifiche iterative e ha autorizzato la chiusura solo dopo la prova finale.","actor":"Matteo","assistance":"guidato","origin":"naturale","source_ref":"owner-plan","effect":"la decisione M3 è stata presa su gate rieseguiti, non su dichiarazioni dell'esecutore","evidence_state":"observed"}],"asserted_by":{"actor_id":"openai-codex-reviewer","role":"agente controverificatore","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"owner-plan","evidence_refs":[],"notes":"nessuna inferenza di competenza o livello"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a030ad-d9e2-7010-bfb4-974e103d695d","correlation_id":"mss-cor-01a030ad-d9e2-71bf-998a-5ff1fd9a512c","segment_no":1,"created_at":"2026-08-24T00:11:35+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-reviewer","actor_type":"agente","role":"agente controverificatore MetaSkillSystem","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a030ad-d9e2-795f-a82c-b65115d31f67","capture_key":"mss-ses-01a030ad-d9e2-7010-bfb4-974e103d695d/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a030ad-d9e2-7fe7-837b-b12cc01650bd","axis":"sistema","subject_record_ids":["mss-rec-01a030ad-d9e2-7ba6-94b4-9761dde658b7"],"delta":"verificato","assertions":[{"rule_id_version":"SK-7@M3","trigger_event":"tre controverifiche hanno trovato e fatto correggere difetti reali prima della chiusura","decision_or_output_changed":"D2/D3, parsing con arrow function e source_refs di untracked sono ora controllati da test; la chiusura usa solo stage selettivo e validator staged","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"openai-codex-reviewer","role":"agente controverificatore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-plan","evidence_refs":["source-fix-report"],"notes":"gate tecnici rieseguiti nella chat"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a030ad-d9e2-7010-bfb4-974e103d695d","correlation_id":"mss-cor-01a030ad-d9e2-71bf-998a-5ff1fd9a512c","segment_no":1,"created_at":"2026-08-24T00:11:35+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-reviewer","actor_type":"agente","role":"agente controverificatore MetaSkillSystem","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a030ad-d9e2-7e36-baf4-4e016b850916","capture_key":"mss-ses-01a030ad-d9e2-7010-bfb4-974e103d695d/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a030ad-d9e2-7937-8e13-a3a417655abc","axis":"output","subject_record_ids":["mss-rec-01a030ad-d9e2-7ba6-94b4-9761dde658b7"],"delta":"creato","assertions":[{"output_id":"report-codex-controverifica-sk7-24-08-26","primary_type":"registro","canonical_version":"report in docs/Sessioni di lavoro/24-08-26","recipient":"Matteo","problem_or_job":"rendere ricostruibile la controverifica e la chiusura di SK-7","intended_use":"audit e continuità del MetaSkillSystem","conceived_by":"richiesta utente","decided_by":"Matteo","directed_by":"chat corrente","authored_by":"openai-codex-reviewer","verified_by":"validate:mss sul report","acceptance_criterion":"report completo con capsula valida, Q1-Q6 e handoff","verification_or_use_evidence":"validator MSS da eseguire dopo la scrittura","verification_status":"self_report","owner_ref":"owner-plan","privacy_release":"internal","support_files":["docs/MetaSkillSystem/PLAN_V0.md"],"relations_no_double_count":["registro della revisione; non è un prodotto SK-7"],"product_candidate":{"recipient":"fail","problem_or_job":"fail","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"openai-codex-reviewer","role":"agente controverificatore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-plan","evidence_refs":[],"notes":"registro, non deliverable prodotto"}}}
```

## 7. Analisi del flusso

Il flusso ha avuto quattro checkpoint indipendenti: analisi del contratto, revisione del primo fix, revisione del secondo fix e gate finale di chiusura. Ogni checkpoint ha prodotto evidenza nuova; tre hanno trovato un errore che i controlli precedenti non coprivano. Questo dimostra che il ciclo «esecuzione → controverifica → prompt di correzione mirato → riesecuzione» era proporzionato al rischio di SK-7, perché il componente scrive un registro finale e decide se una prova è attendibile.

La miglioria futura non bloccante è rendere visibile nel generatore il conteggio dei file non tracciati scartati: il filtro ora è sicuro, ma un messaggio esplicito aiuterebbe un revisore a capire perché un file locale non compare nelle `source_refs`.

## 8. Lettura del lavoro degli agenti

L'esecutore ha corretto rapidamente ciascun difetto segnalato e ha aggiunto copertura mirata. Il punto più importante della mia lettura non è il numero dei test, ma la loro qualità: le regressioni riproducono le stringhe che avevano causato il problema (`:` multipli, arrow function e sorgente non tracciata). Questo collega test, contratto e difetto reale.

Il limite iniziale era considerare terminata l'implementazione prima della verifica di casi composti: un parser di comandi deve trattare il resto della riga come payload opaco, non cercare separatori oltre quello strutturale. La correzione finale rispetta questo principio.

## 9. Errori emersi e loro derivazione

| Errore | Derivazione | Correzione verificata |
| --- | --- | --- |
| D2/D3: separatore `:` ambiguo | Specifica non abbastanza formale | `=>` canonico; legacy limitato a un solo `:`; input ambiguo rifiutato |
| Arrow function rifiutata | Ricerca di più separatori nel payload | Il parser distingue solo il primo separatore canonico e accetta `=>` nel comando |
| `source_refs` con file non tracciato | Raccolta dal working tree anziché dall'indice Git | Le sorgenti automatiche sono filtrate ai path indicizzati e coperte da test |
| Whitespace in lavoro esterno | File fuori perimetro SK-7 | Non toccato: separazione di responsabilità mantenuta |

## 10. Stato aperto e prossimi passi

Per SK-7 non c'è un prossimo passo obbligatorio. Se si apre un nuovo lavoro sul generatore, mantenere le regole qui consolidate e aggiungere prima il test della nuova grammatica o della nuova fonte dati.

Le due modifiche esterne nel working tree richiedono una revisione separata del loro autore o proprietario. Non vanno incluse retroattivamente nel commit SK-7.

## 10-bis. Handoff

- Stato terminale SK-7: chiusa con M3, commit `43feca8`, push riuscito su `origin/env/test`.
- Contratto da preservare: `ID=>comando`; compatibilità legacy solo per un unico `:`; il payload può contenere `=>`.
- Regola da preservare: `source_refs` automatiche solo da file presenti nell'indice Git.
- Stato di questo report: creato e validato, non committato né pushato perché la richiesta era produrre il report, non pubblicare un nuovo artefatto.
- Stato esterno: due file 23-08-26 restano fuori dal mio perimetro e dal mio stage.

## 11. Risposte Q1–Q6

### Q1. Quali fonti ho usato?

Ho letto `AGENTS.md`, `docs/Comunicazione-Skill/VOCABOLARIO.md`, `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md`, la Bussola di valutazione, il manuale e piano MetaSkillSystem, `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md`, il report di fix SK-7 e le fonti tecniche coinvolte (`scripts/mss/capsule.mjs`, test e fixture). Ho usato la chat corrente, in particolare: «agente ha svolto i lavoro. controverifica e ripetiamo procedura per chiusura sk.7» e «quando hai completato tutto fai il tuo report di tutto il lavoro completo svolto da te». Il riferimento Git terminale è `43feca8`.

### Q2. Quali verifiche ho svolto e con quale esito?

Ho rieseguito `test:mss:tools`, `test:mss`, `validate:docs`, `lint:scripts`, `validate`, validator MSS su file e stage, `git diff --check`, commit e push. Tutti i gate sono passati; l'unica nota è il buffer del generatore per `npm run validate`, gestita come non-inclusione nella capsula e non come falso positivo.

### Q3. Quale cambiamento di stato ho lasciato?

| Prima | Dopo |
| --- | --- |
| SK-7 in attesa di controverifica e decisione | SK-7 `CHIUSO 24-08-26 (M3)` nel piano |
| Fix presenti ma non pubblicati | Commit `43feca8` su `origin/env/test` |
| Tracciabilità del mio lavoro non ancora registrata | Questo report e capsula, non ancora committati |

### Q4. Cosa non ho fatto deliberatamente?

Non ho modificato codice applicativo o Supabase; non ho riscritto record finali; non ho pulito né adottato i due cambi esterni; non ho creato un ulteriore commit/push per il solo report; non ho nascosto i warning React già noti né l'`ENOBUFS` del generatore.

### Q5. Cosa dovrebbe fare chi riprende il lavoro?

Partire dal commit `43feca8` e considerare SK-7 conclusa. Per nuove evoluzioni del generatore, aggiungere la regressione prima del fix e verificare sia la sintassi sia la pubblicabilità delle fonti. Per il working tree corrente, analizzare separatamente i due file esterni prima di stage o commit.

### Q6. Il contesto era sufficiente?

Sì. Il piano, il manuale, i test e i report precedenti hanno reso ricostruibile il contratto e i gate. Il solo attrito emerso è tecnico: il generatore ha buffer limitato per un comando molto verboso; l'evidenza diretta di `npm run validate` resta valida e la capsula lo dichiara correttamente non incluso.

## 12. Autorevisione finale

- Ho separato con chiarezza le mie modifiche, quelle dell'esecutore e quelle esterne.
- Ogni difetto che ha bloccato la chiusura ha una causa, un fix e una verifica documentati.
- Non ho dichiarato verdi controlli non eseguiti: il limite `ENOBUFS` è esplicito.
- La capsula è final, completa e include quattro controlli rieseguiti con esito `pass`.
- Il report non modifica l'esito di SK-7 e non amplia il perimetro di pubblicazione oltre l'autorizzazione ricevuta.
