# Report hardening H-1 — MetaSkillSystem

**Cosa è cambiato:** il controllo H-1 ora respinge bundle formalmente verdi ma strutturalmente falsi e usa le stesse regole da comando, stop e pre-commit.
**Cosa resta:** WP-1 non è iniziato; resta un debito separato di discovery su `docs/Archives`.
**Serve una tua azione:** no per H-1; serve un nuovo comando esplicito prima di WP-1, commit o push.

**Data:** 09-08-26 · **Modalità:** Meta/deep · **Branch:** `env/test` · **Commit:** nessuno

## 1. Cosa è stato fatto

1. Riprodotte prima delle modifiche cinque controprove accettate erroneamente: pacchetti caricati
   assenti, assi solo draft, verificatore uguale all'esecutore, output senza gate prodotto e due
   eventi di sessione nello stesso bundle.
2. Reso esplicito nel contratto ciò che prima era ambiguo: un evento logico per bundle, retry
   idempotente, assi finali, controlli con denominatore, indipendenza dei ruoli, gate prodotto,
   modalità report e sicurezza dei riferimenti.
3. Allineati core, parser, resolver, CLI, adapter, stop hook e pre-commit allo stesso contratto.
4. Le fixture negative sono ora committibili soltanto se il manifest conferma esattamente il deny
   atteso; un artefatto operativo con lo stesso difetto resta bloccato.
5. Separata la generazione fixture dalla suite normale: il test confronta in una directory
   temporanea e segnala drift senza riscrivere il working tree.
6. Corretta la matrice: nessuna CI dichiarata, nessun E3, O massimo 1 e fail-open/bypass descritti.
7. Il report storico WP-0.1 è stato riportato identico al checkpoint; i due file estranei indicati
   da Matteo sono rimasti fuori dal lavoro.

## 2. File toccati e perché

| Zona | Modifica | Perché |
|---|---|---|
| Contratto, protocollo e masterplan MetaSkillSystem | Semantica H-1 e stato reale | Evitare un secondo contratto implicito nel codice |
| Validator e codici regola | Struttura completa, bundle, verifica e prodotto | Respingere falsi positivi con codici stabili |
| Parser e riferimenti | Sezione capsula, modalità, path e link light | Evitare fence estranei, traversal, symlink escape e link incoerenti |
| Adapter, stop e pre-commit | Stesso core e manifest fixture | Uniformare il comportamento sulle superfici realmente cablate |
| Fixture e suite H-1 | 32 casi + 13 gruppi di contratto/integrazione | Rendere permanenti controprove, hook e anti-drift |
| `package.json` | Comando generatore separato | Impedire scritture silenziose durante `test:mss` |
| Matrice H-1 | Superfici, bypass e G/O/E reali | Non sovradichiarare CI, osservazione o enforcement |

## 3. Test eseguiti e risultato

| Comando | Esito | Evidenza |
|---|---|---|
| `npm run test:mss` | PASS | 32 casi fixture + 13 gruppi core/parser/adapter/hook; nessuna riscrittura working tree |
| `npm run typecheck` | PASS | TypeScript senza errori |
| `node --check` su moduli MSS, suite e due hook | PASS | sintassi valida |
| `git diff --check` | PASS | nessun errore whitespace; solo avviso Git LF/CRLF su fixture già nota |
| `npx vitest run --exclude "docs/Archives/**"` | PASS | batteria applicativa fuori Archives verde |
| `npm run lint -- --ignore-pattern "docs/Archives/**"` | PASS | lint fuori Archives verde |
| `npm run validate` | FAIL preesistente | si ferma al lint: 17 errori e 346 warning sotto `docs/Archives` |
| `npm test` | FAIL preesistente | Vitest scopre test Playwright/archiviati: 192 file falliti, 163 file passati, 1346 test passati |

Il confronto delle configurazioni conferma un debito di discovery: `.eslintrc.cjs` e
`vitest.config.ts` non escludono `docs/Archives`. Non sono stati corretti i test storici né alterata
la loro semantica in questa sessione.

## 4. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | Contratto meccanico 0.1.1 chiarito | È l'owner di schema e semantica validata |
| `docs/MetaSkillSystem/PROTOCOLLO_PRIMO_PILOTA_V0_1.md` | FX-V04 chiarita come un evento logico + retry | La fixture non deve insegnare due eventi nello stesso bundle |
| `docs/MetaSkillSystem/PLAN_V0.md` | Stato e prove H-1 reali | È l'unico owner dello stato SYS-1 |
| `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json` | Superfici/bypass/G-O-E reali | È la vista verificabile della copertura H-1 |
| `.cursor/hooks/fine-sessione-nudge.mjs` | Stop su report recente con modalità verificabile | Intercetta standard/deep senza bloccare per solo filename |
| `.cursor/hooks/fine-sessione-commit-check.mjs` | Pre-commit su staged e fixture dichiarate | Blocca operativi invalidi senza rendere incommittibili i test negativi |
| `docs/SESSION_LOG.md` | Puntatore a questo report | Mantiene l'indice narrativo senza duplicare la capsula |

Nessuna voce di vocabolario o regola di comunicazione è stata promossa o modificata.

## 5. Dati comunicazione

### Contesto e richieste di Matteo

- Prompt principale sostanziale ×1: supervisione senior H-1, cinque controprove, correzioni A–J,
  collaudi obbligatori, nessun commit/push e stop prima di WP-1.
- Aggiornamento in corso ×1: Matteo sta lavorando in piccole chat parallele che possono contenere
  elementi personali e chiede che lavorino già allineate al MetaSkillSystem in ombra.
- Nessuna richiesta di commit, push, DB, PROD o avvio WP-1.

L'aggiornamento sulle chat parallele è stato trattato come confine operativo, non come raccolta:
nessun contenuto personale è stato acquisito o copiato. Le chat esterne non sono state contate come
piloti WP-1 e confermano il bypass dichiarato delle superfici non viste dagli hook locali.

### Spiegazioni e formato usato

Aggiornamenti brevi per stato/gate: controprove prima, modello corretto, suite mirata, poi salute
workspace. Il formato ha separato sempre H-1 dal debito Archives e non ha presentato il verde locale
come salute globale.

### Automatizzabile vs manuale

| Automatizzabile con certezza | Resta manuale |
|---|---|
| Struttura JSONL, enumerazioni, ID, assi finali, gate prodotto, riferimenti, modalità dichiarata | Verità del testo libero, continuità fra chat non osservate, classificazione di contenuti personali |
| Manifest fixture, staged/worktree, drift generatori, parità CLI/core | Apertura WP-1, decisione retention, E3, conferma commit/push |

### Cosa non è successo in chat

- Nessuna domanda di chiarimento: il prompt principale fissava scope, gate e conseguenze.
- Nessun contenuto personale delle chat parallele è stato letto.
- Nessun commit, push, deploy, DB o migrazione.
- Nessun WP-1/WP-2/WP-3, store, retention definitiva o E3.
- Nessuna conferma «lavoro ok» o «fai report finale»; il report nasce dall'istruzione esplicita di
  chiusura H-1 contenuta nel prompt.

## 6. Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-019fe840-fa43-782f-a111-f08584e81fbf","session_id":"mss-ses-019fe840-fa42-7487-a6c9-d4abc14cc2aa","correlation_id":"mss-cor-019fe840-fa42-7f12-ac53-353163192ef5","segment_no":1,"capture_key":"mss-ses-019fe840-fa42-7487-a6c9-d4abc14cc2aa/1/session_event/1","created_at":"2026-08-09T22:40:00+02:00","finalization":"final","recorded_by":{"actor_id":"codex-root","actor_type":"agente","role":"H-1_supervisor_implementer","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"local workspace API"},"tools_used":["PowerShell","apply_patch","Node.js","Vitest","Git"]},"packages_loaded":[{"package_id":"project-guidance","package_version_or_revision":"checkpoint-7632443+working-tree","source_ref":"AGENTS.md; .claude/CLAUDE.md; docs/APP_CONTEXT_SKILL.md"},{"package_id":"communication","package_version_or_revision":"working-tree@7632443","source_ref":"docs/COMUNICAZIONE_UTENTE_SKILL.md; docs/Comunicazione-Skill/VOCABOLARIO.md; docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md"},{"package_id":"testing","package_version_or_revision":"working-tree@7632443","source_ref":"docs/Testing-Skill/TESTING_SKILL.md"},{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; contratto; piano; protocollo; parametri macro; matrice"}],"event":{"event_id":"mss-evt-019fe840-fa43-73ad-89e8-948779307e6c","event_kind":"session_close","occurred_at":"2026-08-09T22:40:00+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"correggere e ricollaudare H-1 fino alla coerenza reale senza avviare WP-1 o pubblicare","session_type":"meta","capsule_status":"completa","role_key":"MetaSkillSystem H-1 writer e revisore unico della sessione","area":"MetaSkillSystem H-1; salute workspace locale","environment":"branch env/test; workspace locale; nessun DB o rete applicativa","authorization":{"read":["istruzioni repository","fonti MetaSkillSystem","diff e configurazioni di test"],"write":["contratto e piano H-1","validator/parser/resolver/adapter/hook","fixture e test","matrice","report H-1 e SESSION_LOG"],"forbid":["commit","push","WP-1","WP-2","WP-3","store o retention definitivi","E3","DB o PROD","contenuti personali delle chat parallele","due file estranei dichiarati"]},"authorized_outputs":["hardening H-1","test di regressione e integrazione","matrice veritiera","verdetto e report H-1"],"route":{"chosen":"MetaSkillSystem + profilo Verifica/Testing + chiusura deep","alternatives_or_conflicts":"nessuno"},"observed_outcome":"H-1 chiuso nel disegno con cinque controprove respinte, 32 fixture e 13 gruppi integrativi verdi; WP-1 non iniziato; debito Archives separato","open_items":["WP-1 soltanto dopo nuovo comando di Matteo","pacchetto separato per escludere docs/Archives dalla discovery globale"],"controls":[{"control_id":"H1-COUNTEREXAMPLES","criterio":"le cinque controprove iniziali producono deny stabile","esito":"pass","numeratore":5,"denominatore":5,"esecutore":"codex-root + core deterministico","evidence_refs":["source-suite","source-report"]},{"control_id":"H1-FIXTURES","criterio":"fixture congelate e supplementari rispettano il manifest","esito":"pass","numeratore":32,"denominatore":32,"esecutore":"npm run test:mss","evidence_refs":["source-suite","owner-matrix"]},{"control_id":"H1-INTEGRATION-GROUPS","criterio":"core parser resolver adapter CLI hook matrice e anti-drift passano","esito":"pass","numeratore":13,"denominatore":13,"esecutore":"npm run test:mss","evidence_refs":["source-suite","owner-matrix"]},{"control_id":"H1-WORKSPACE-LOCAL","criterio":"test:mss typecheck node-check diff-check e Vitest senza Archives sono verdi","esito":"pass","numeratore":5,"denominatore":5,"esecutore":"codex-root","evidence_refs":["source-report"]},{"control_id":"WORKSPACE-GLOBAL-VALIDATE","criterio":"npm run validate globale è verde","esito":"fail","numeratore":0,"denominatore":1,"esecutore":"npm run validate","evidence_refs":["source-report"]}],"subject_runtime":{"actor_id":"codex-root","provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"local workspace API"},"privacy":{"classification":"internal","capture_basis":"user_request","allowed_content":["fatti tecnici H-1","esiti comandi","esistenza del lavoro parallelo in ombra"],"prohibited_content":["elementi personali condivisi nelle altre chat","segreti","dati di terzi","materiale sigillato"],"redactions":["contenuti personali delle chat parallele non acquisiti"],"external_release":"forbidden","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-contract","owner_id":"mss-contract-v0.1","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"schema-mss-session-0.1.1","revision_or_hash":"mss-v0.1-wp0.1-freeze-2","sensitivity":"internal"},{"ref_id":"owner-plan","owner_id":"SYS-1-masterplan","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"H-1","revision_or_hash":"working-tree-H1-hardening","sensitivity":"internal"},{"ref_id":"owner-matrix","owner_id":"COVERAGE_MATRIX_H1","uri_or_path":"docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","stable_anchor_or_event_id":"COVERAGE_MATRIX_H1","revision_or_hash":"working-tree-H1-hardening","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-user-request","owner_id":"conversation","uri_or_path":"conversation:this-session","stable_anchor_or_event_id":"user-turn-1-and-parallel-update","revision_or_hash":"turns-1-2","sensitivity":"internal"},{"ref_id":"source-suite","owner_id":"H1-test-suite","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"H-1-suite","revision_or_hash":"working-tree-H1-hardening","sensitivity":"internal"},{"ref_id":"source-report","owner_id":"H1-session-report","uri_or_path":"docs/Sessioni di lavoro/09-08-26/Report-hardening-h1-metaskillsystem-09-08-26.md","stable_anchor_or_event_id":"report-H1-09-08-26","revision_or_hash":"working-tree-H1-hardening","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fe840-fa43-72db-b96a-24e701c8682e","session_id":"mss-ses-019fe840-fa42-7487-a6c9-d4abc14cc2aa","correlation_id":"mss-cor-019fe840-fa42-7f12-ac53-353163192ef5","segment_no":1,"capture_key":"mss-ses-019fe840-fa42-7487-a6c9-d4abc14cc2aa/1/annotation/1","created_at":"2026-08-09T22:40:01+02:00","finalization":"final","recorded_by":{"actor_id":"codex-root","actor_type":"agente","role":"H-1_supervisor_implementer","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"local workspace API"},"tools_used":["PowerShell","apply_patch","Node.js","Vitest","Git"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fe840-fa43-7b46-94f4-a4add7660ab1","axis":"persona","subject_record_ids":["mss-rec-019fe840-fa43-782f-a111-f08584e81fbf"],"delta":"nessuno","assertions":[{"signal":"non_osservato","actor":"matteo","assistance":"non_applicabile:nessuna valutazione Persona autorizzata","origin":"naturale","source_ref":"source-user-request","effect":"nessuno","evidence_state":"not_applicable"}],"asserted_by":{"actor_id":"codex-root","role":"H-1_supervisor_implementer","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile:nessun criterio Persona in questa sessione","evidence_refs":["source-user-request"],"notes":"nessuna inferenza o promozione Persona; contenuti paralleli non acquisiti"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fe840-fa43-7c92-9270-370c4beae5e9","session_id":"mss-ses-019fe840-fa42-7487-a6c9-d4abc14cc2aa","correlation_id":"mss-cor-019fe840-fa42-7f12-ac53-353163192ef5","segment_no":1,"capture_key":"mss-ses-019fe840-fa42-7487-a6c9-d4abc14cc2aa/1/annotation/2","created_at":"2026-08-09T22:40:02+02:00","finalization":"final","recorded_by":{"actor_id":"codex-root","actor_type":"agente","role":"H-1_supervisor_implementer","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"local workspace API"},"tools_used":["PowerShell","apply_patch","Node.js","Vitest","Git"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fe840-fa43-71ad-9ff9-ed7f7bf21817","axis":"sistema","subject_record_ids":["mss-rec-019fe840-fa43-782f-a111-f08584e81fbf"],"delta":"suite verde ma contratto incompleto -> contratto core fixture hook e matrice coerenti","assertions":[{"rule_id_version":"H-1@mss.session/0.1.1-freeze-2","trigger_event":"cinque falsi positivi riprodotti prima delle modifiche","decision_or_output_changed":"struttura completa, singolo evento, assi finali, verifica indipendente, gate prodotto, path sicuri, modalità e manifest fixture","G":2,"O":1,"E":2}],"asserted_by":{"actor_id":"codex-root","role":"H-1_supervisor_implementer","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-matrix","evidence_refs":["source-suite","source-report"],"notes":"O1 da una sessione avversariale locale; nessuna osservazione ripetuta o pilota reale; LOCK resta E1 e nessun controllo è E3"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fe840-fa43-70ec-8156-8c6912786daf","session_id":"mss-ses-019fe840-fa42-7487-a6c9-d4abc14cc2aa","correlation_id":"mss-cor-019fe840-fa42-7f12-ac53-353163192ef5","segment_no":1,"capture_key":"mss-ses-019fe840-fa42-7487-a6c9-d4abc14cc2aa/1/annotation/3","created_at":"2026-08-09T22:40:03+02:00","finalization":"final","recorded_by":{"actor_id":"codex-root","actor_type":"agente","role":"H-1_supervisor_implementer","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"local workspace API"},"tools_used":["PowerShell","apply_patch","Node.js","Vitest","Git"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fe840-fa43-7dcc-b801-eca69a1d0d5b","axis":"output","subject_record_ids":["mss-rec-019fe840-fa43-782f-a111-f08584e81fbf"],"delta":"modificato","assertions":[{"output_id":"MSS-H1-HARDENING","primary_type":"governance","canonical_version":"mss.session/0.1.1 freeze-2 H-1 hardening","recipient":"Matteo e successive sessioni MetaSkillSystem","problem_or_job":"intercettare chiusure strutturalmente false prima del pilota","intended_use":"validator locale condiviso fra CLI stop e pre-commit","conceived_by":"revisione precedente + prompt di Matteo","decided_by":"Matteo tramite obiettivo e gate H-1","directed_by":"contratto 0.1.1 e PLAN_V0","authored_by":"codex-root sotto regia di Matteo","verified_by":"suite automatica locale; verifica indipendente non osservata","acceptance_criterion":"cinque controprove respinte; fixture e adapter coerenti; matrice senza sovradichiarazioni; nessuna riscrittura fixture","verification_or_use_evidence":"32 fixture + 13 gruppi integrativi verdi; typecheck e Vitest fuori Archives verdi","verification_status":"self_report","owner_ref":"owner-contract + owner-plan + owner-matrix","privacy_release":"internal; external release forbidden","support_files":["scripts/mss","hook Cursor/Husky","fixture v0.1","report H-1"],"relations_no_double_count":["un solo output governance H-1 con codice test docs e report come supporti"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"codex-root","role":"H-1_supervisor_implementer","basis":"source_derived"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-matrix","evidence_refs":["source-suite","source-report"],"notes":"deliverable governance verificato localmente; efficacia su piloti e superfici esterne non osservata"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"amendment","record_id":"mss-rec-0198b112-0001-7000-8000-000000000014","session_id":"mss-ses-019fe840-fa42-7487-a6c9-d4abc14cc2aa","correlation_id":"mss-cor-019fe840-fa42-7f12-ac53-353163192ef5","segment_no":1,"capture_key":"mss-ses-019fe840-fa42-7487-a6c9-d4abc14cc2aa/1/amendment/1","created_at":"2026-08-10T12:00:00+02:00","finalization":"final","recorded_by":{"actor_id":"codex-root-h12","actor_type":"agente","role":"H-1.2_compatibility_amendment_author","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"local workspace API"},"tools_used":["PowerShell","apply_patch","Node.js","Git"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"amendment":{"amendment_id":"mss-amd-0198b112-0001-7000-8000-000000000040","target_record_id":"mss-rec-019fe840-fa43-70ec-8156-8c6912786daf","relation":"amends","reason":"compatibility correction for the single-owner reference contract without rewriting the finalized H-1 annotation","changes":[{"field_path":"annotation.assertions[0].owner_ref","previous_value_or_hash":"owner-contract + owner-plan + owner-matrix","corrected_value":"owner-contract"}],"evidence_refs":["owner-contract"],"effective_at":"2026-08-10T12:00:00+02:00"}}
```

## 7. Analisi flusso prompt, efficienza e statistiche

| Dato | Valore |
|---|---|
| Messaggi sostanziali di Matteo | 2 |
| Domande preventive | 0 |
| Correzioni di Matteo | 0 |
| Retry tecnici | 2 cicli suite + 2 self-validazioni report/log prima del verde stabile |
| Follow-up generati | 0 |
| Modalità alzata | no, Meta/deep dall'inizio |
| Commit / push | no / no |

Il prompt principale era completo: contesto Git, anti-scope, cinque falsificatori, correzioni A–J,
comandi e conseguenze erano già fissati. L'unico aggiornamento successivo ha aggiunto un confine di
privacy/coprogettazione sulle chat parallele senza cambiare il cantiere.

KPI osservabili: un solo turno di implementazione, nessun rework richiesto da Matteo; due cicli di
suite interni hanno riallineato codici esatti e repo Git temporaneo. Da replicare: controprove prima
del fix e denominatori espliciti. Da migliorare: un pacchetto separato di discovery Archives, senza
mescolarlo a H-1.

## 8. Lettura della sessione dell'agente

Il routing MetaSkillSystem + Testing è stato adeguato e il prompt ha impedito di fermarsi al verde
superficiale. Il maggior valore è arrivato dal confronto continuo fra documento, fixture e adapter:
ha fatto emergere l'ambiguità di FX-V04, la falsa autorizzazione LOCK e il problema delle fixture
negative al commit.

Attrito reale: la suite precedente generava le fixture durante il test e il manifest controllava
solo la presenza di campi; entrambi potevano produrre verde senza provare il sistema dichiarato.
La soluzione è stata separare generazione/controllo drift e testare gli hook in repository Git
temporanei. Suggerimento, come dato e non modifica: trattare l'esclusione Archives come pacchetto
workspace autonomo con criterio “stesso insieme applicativo, zero test storici scoperti”.

## 9. Derivazione errori

| Evento | Classe | Causa | Prevenzione applicata |
|---|---|---|---|
| Cinque bundle invalidi passavano | bug preesistente H-1 | controlli di presenza parziali e semantica bundle implicita | contratto proprietario chiarito + regressioni permanenti |
| FX-V04 conteneva due eventi distinti | errore di modello preesistente H-1 | compact e bundle trattati come la stessa unità | un evento logico + retry identico; segmenti in bundle separati |
| Prima run nuova suite: codici extra | errore agente di fixture | casi negativi non isolati dopo i controlli strutturali | ID validi e manifest con codici esatti |
| Prima integrazione pre-commit negativa falliva | vincolo strutturale del test | repo temporaneo non conteneva l'owner referenziato | owner sintetico risolvibile nel repo isolato |
| Primo comando `validate` non partito (`Unknown command: pm`) | errore agente/ambiente PowerShell | invocazione ambigua del wrapper `npm` | rilancio con `npm.cmd`; il tentativo non è contato come esito workspace |
| Primo report H-1 respinto | bug H-1 emerso in self-review | parser capsula non accettava il titolo numerato imposto dalla procedura report | titolo numerato aggiunto al parser e alla regressione |
| `SESSION_LOG` respinto | bug H-1 emerso in self-review | ogni `event_id` veniva scambiato per dichiarazione light | deny ristretto a righe che dichiarano evento/path light + regressione standard |
| `validate`/`npm test` globali rossi | bug preesistente di configurazione | `docs/Archives` non esclusa da ESLint/Vitest | diagnosi isolata; fix rinviato a pacchetto separato |

Nessun pattern è stato promosso nel vocabolario e non è stato modificato `ERRORI_PROCESSO.md`: i
difetti sono specifici del cantiere H-1 o della discovery workspace già dichiarata.

## 10. Cosa resta per la prossima sessione

- MetaSkillSystem: WP-1 è il prossimo pacchetto del masterplan, ma non è iniziato e richiede un
  nuovo comando esplicito di Matteo.
- Salute workspace, fuori SYS-1: pacchetto proposto `WH-ARCHIVES-1` per escludere
  `docs/Archives/**` dalla discovery ESLint/Vitest e ricollaudare `npm run validate`, senza riparare
  i test storici uno per uno.
- Nessuna riga `FOLLOW_UP.md` aggiunta: il debito è registrato qui e non va confuso con una feature
  dell'app o con lo stato di SYS-1.

## 10-bis. Handoff al prossimo agente

**Cosa è vero adesso:** H-1 è chiuso nel disegno, non osservato su piloti reali. Il core unico è
usato da CLI, stop locale e pre-commit; le fixture negative passano dal manifest; la normale suite
non scrive nel repository. G/O/E tipici sono G2/O1/E2; il controllo LOCK resta E1; nessun E3.

Il masterplan possiede lo stato, il contratto possiede la semantica e la matrice possiede
superfici/bypass. Non riaprire la forma a due eventi di FX-V04, non contare le chat parallele come
WP-1 e non copiare qui i loro dati personali. Cloud, Codex/Claude senza hook, `--no-verify`, file
unstaged, report non recenti e report senza modalità restano bypass dichiarati.

Prossimo task MetaSkillSystem: aprire WP-1 soltanto dopo autorizzazione di Matteo e applicare
`MSS-PILOT-001/1.0.1` senza cambiare criterio dopo l'avvio. Il debito Archives è separato e non
invalida H-1; può essere trattato prima con `WH-ARCHIVES-1`.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «Agisci come agente supervisore senior e implementatore del cantiere MetaSkillSystem» con obiettivo di correggere H-1, cinque controprove, correzioni A–J, collaudi e divieti di commit/push/WP-1; poi «sto lavorando in parallelo su piccole chat dove condivido elemnti personali .. sto dicendo di lavorare gia allineati a metaskillsystem ombra che lavora sotto».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: sì; riaperti contratto, piano, protocollo, matrice, manifest, suite, parser, adapter, hook e SESSION_LOG; verificati 32 casi, 13 gruppi, 5/5 controprove, report/capsula/log validi, stato Git e assenza di diff sul report storico WP-0.1.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: allineati contratto, protocollo, PLAN, matrice, rules/core/parser/refs/CLI/adapter, due hook, factory/generatore/suite, fixture/manifest, package scripts, questo report e SESSION_LOG; nessuna skill applicativa o tipo DB coinvolto.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: non avviati WP-1/2/3, store, retention o E3; nessun commit/push/DB; non corretti i test storici Archives perché il prompt li separa esplicitamente; nessun dato personale delle chat parallele acquisito.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: l'attrito principale era distinguere verde meccanico da contratto vero; controprove prima del fix e manifest con codici esatti hanno risolto; proporrei `WH-ARCHIVES-1` come pacchetto separato per rendere il gate globale nuovamente significativo.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: contesto giusto ma voluminoso per necessità deep; skill MetaSkillSystem, Testing e fonti proprietarie erano tutte necessarie; gli hook sono stati oggetto del collaudo e utili, mentre restano volutamente assenti nelle chat esterne/Cloud dichiarate come bypass.
