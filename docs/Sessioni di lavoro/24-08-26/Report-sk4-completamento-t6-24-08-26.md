# SK-4 T6 — completamento bypass enforcement

**Modalità:** deep
**Ruolo:** esecutore SK-4 sotto orchestrazione MSS
**Branch:** `env/test`
**HEAD di apertura:** `6ec9dbaddae62a643e713096495d26f2bb640904`

## 1. Cappello

- **Cosa è cambiato:** il gate legacy riconosce come storico soltanto ciò che è già in Git `HEAD`; due record legacy nuovi staged insieme non possono più qualificarsi a vicenda. Anche `mss:review` usa ora il perimetro Report/Verbale esportato da `adapter.mjs`, senza regex locale.
- **Cosa resta:** controverifica M12 di famiglia diversa e firma formale di Matteo. L'implementazione è pronta, ma `SK-4` resta **APERTO** fino a quei passaggi.
- **Serve un'azione di Matteo:** non per il fix; sì per la firma formale dopo la controverifica.

## 2. Cosa è stato fatto

1. Eseguito Passo 0 su `env/test`, registrando HEAD e working tree R1 già sporco, poi preservato.
2. Riprodotti B1-B3 sul codice reale. I casi semplici erano già negati; il residuo B1 era una qualificazione incrociata fra due file staged nuovi.
3. Separata nel core la vista dei record storici/riferibili dalla base di fiducia dei record committati. In staged, solo `headView.records` alimenta l'esenzione legacy.
4. Rimossa da `mss:review` l'ultima regex locale Report/Verbale: il consumatore importa `REPORT_PATH_RE` da `adapter.mjs` secondo D18.
5. Aggiunti test nominati e non vacui per legacy nuovo/storico, path ricorsivi, entrambi i prefissi, staged/worktree e parità del consumatore `mss:review`.
6. Allineato il contratto: “storico” per B1 significa record canonico già presente in `HEAD`, non visibile soltanto nello staged/worktree.

## 3. Attacchi B1-B3 — prima e dopo

| ID | Attacco riprodotto | Prima del fix | Dopo il fix |
|---|---|---|---|
| B1 | Due report legacy nuovi, byte-identici, staged insieme; validazione focalizzata sul primo | primo risultato `ok: true`, nessun `MSS-LEGACY-NEW-FORBIDDEN`; il secondo cadeva solo su `MSS-CROSS-FILE-DUPLICATE` | entrambi ricevono `MSS-LEGACY-NEW-FORBIDDEN`; il primo è `ok: false`, il secondo conserva anche il controllo duplicati |
| B1 storico | Stesso bundle legacy fornito come contenuto già presente in `HEAD` | leggibile nel modello sintetico | resta interamente leggibile (`ok: true`), senza riscrivere record final |
| B2 | `Report-*.md` invalido in sotto-cartella profonda | già `MSS-REPORT-NO-CAPSULE`; mancava una prova SK-4 unica e nominata | test nominato conferma deny; mismatch staged/worktree produce `MSS-STAGED-WORKTREE-MISMATCH` |
| B3 | `Verbale-*.md` invalido nello stesso path ricorsivo | già `MSS-REPORT-NO-CAPSULE`; copertura sparsa fra suite diverse | test nominato conferma deny e confronto worktree; `mss:review` usa la stessa regex condivisa |

La controprova che rende B1 non vacuo usa due file: eliminando la separazione `committedRecords`/`historicalRecords`, il primo torna verde perché il secondo lo fa apparire storico. La prova D18 include inoltre il boundary `docs/Sessioni di lavoro/Report-senza-cartella-data.md`: la vecchia regex locale di `mss:review` lo selezionava, `REPORT_PATH_RE` correttamente no.

## 4. File toccati

| File | Modifica |
|---|---|
| `scripts/mss/core.mjs` | Base `committedRecords` distinta dalla vista storica/staged usata per riferimenti e collisioni. |
| `scripts/mss/adapter.mjs` | In staged passa `headView.records` come unica base committata. |
| `scripts/mss/review.mjs` | Importa `REPORT_PATH_RE`; rimossa `REPORT_NAME_RE`. |
| `docs/MetaSkillSystem/tests/h1/run.mjs` | Test nominato SK-4 B1-B3, incluso storico leggibile e matrice staged/worktree. |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | Test D18 su parità `mss:review` ↔ regex condivisa. |
| `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | Definizione operativa di storico = record canonico in `HEAD`. |
| `docs/Sessioni di lavoro/24-08-26/judgments-sk4-completamento-t6-24-08-26.json` | Tre giudizi R1, senza busta scritta a mano. |
| questo report | Unico report del mandato SK-4 T6. |

Nessun file R1 è stato modificato; nessun tocco a `PLAN_V0.md`, cruscotto, `src/`, DB, WP-1, SK-10 o SK-11.

## 5. Test eseguiti e risultato

| Controllo | Esito |
|---|---|
| `node --check` sui tre moduli e le due suite modificate | exit 0 |
| `npm run test:mss` | exit 0 — 42 fixture + 48 gruppi; test `SK-4 B1-B3 — …` verde |
| `npm run test:mss:tools` | exit 0 — 62 test; test `SK-4 D18/B2/B3 — …` verde |
| probe B1 a due file dopo fix | primo `MSS-LEGACY-NEW-FORBIDDEN`; secondo legacy + cross-file duplicate |
| gate finali | registrati nei `controls[]` generati della capsula e rieseguiti dopo l'append |

## 6. File di skill aggiornati

Nessuna skill viva modificata. La skill MSS e il manuale hanno instradato correttamente a owner, contratto e mandato; il contratto capsula è stato allineato perché è la fonte della semantica legacy, non una skill di routing.

## 7. Dati comunicazione

- Prompt sostanziali di Matteo: 1, salvato nel mandato T6 e richiamato in Q1.
- Handoff orchestratore: audit indipendente dello stato reale, prova B1-B3, D18, test nominati, unico report/capsula, nessun piano/cruscotto/commit/push.
- Correzioni di Matteo durante l'esecuzione: 0.
- Difficoltà reale: la forma semplice di B1 era già rossa; il residuo emergeva solo componendo due file staged identici e osservando il risultato focalizzato, non il verdetto aggregato del pre-commit.

## 8. Analisi del flusso, efficienza e qualità

Il piano storico descriveva correttamente le intenzioni ma non dimostrava il confine di fiducia. I test esistenti nominavano `FX-I11`, ricorsione e Verbale, però erano distribuiti: non provavano che la vista staged non potesse auto-certificarsi come HEAD. Un singolo gruppo H-1 ora lega B1-B3 ai comportamenti di pubblicazione; un test tools separato inchioda D18 sul consumatore nato dopo il primo SK-4.

## 9. Lettura dell'agente

- **Persona:** nessuna osservazione o valutazione nuova su Matteo; il mandato era già deciso.
- **Sistema:** enforcement migliorato da implicito/mascherato a gate dedicato per ogni record legacy nuovo; una sola regex viva per i report MSS.
- **Output:** prova riproducibile e report destinati alla controverifica M12; non ancora verificati indipendentemente.

## 10. Derivazione errori

- **Radice B1:** `historicalRecords = stagedView.records` serviva correttamente riferimenti/collisioni della transazione, ma veniva riusato come prova di commit. Due file nuovi identici diventavano reciprocamente “committed”.
- **Radice D18:** `mss:review`, introdotto dopo la prima wave SK-4, aveva aggiunto `REPORT_NAME_RE` locale. Era quasi equivalente ma accettava anche un report senza cartella-data; la duplicazione aveva già prodotto divergenza.
- **Perché i gate precedenti non bastavano:** il pre-commit aggregato restava rosso per duplicazione, mascherando l'assenza del gate legacy sul primo file. Il test nuovo richiede il codice specifico su ciascun path.
- **Retry di chiusura:** il primo `mss:capsule --append-to` è uscito 1 senza scrivere perché Q1 ricopiava dal prompt una seconda dichiarazione del tipo di seduta; il parser l'ha classificata come modalità duplicata. Corretto applicando D23: path + hash del mandato già salvato, senza ricopia.

## 10-bis. Handoff al prossimo agente

**Stato vero:** implementazione SK-4 T6 completa nel working tree; B1-B3 e D18 hanno prove nominate verdi. `SK-4` resta **APERTO** perché questo esecutore non è la controverifica M12 e la firma formale è riservata a Matteo dal mandato.

**Controverifica richiesta:** partire dal diff reale; rieseguire il probe B1 a due file, verificare che lo storico sintetico sia `ok: true`, rieseguire i due test nominati e tutti i gate nei `controls[]`. Non modificare i record `final`; eventuali rettifiche solo via amendment.

**Vincoli invariati:** `H-1.3` resta `PASS_CON_RISERVE`; `WP-1` resta NO-GO; nessun commit/push; nessun lavoro prodotto/SK-10/SK-11.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica path e revisione o hash; per i messaggi chat non in repo, riportali verbatim.
✅ R1: Mandato completo già salvato in `docs/Sessioni di lavoro/24-08-26/Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md`, SHA-256 `02270e8a9bbcc1987f67518f71f3172732a19567bb4bef57d9ed03b224c95aa1`, working tree su HEAD `6ec9dbaddae62a643e713096495d26f2bb640904`. Nessun delta sostanziale di Matteo fuori da quel file.

❓ Q2 — Dati = diff reale? Confermi che i controlli e i dati del report coincidono con diff/git/comandi rieseguiti?
✅ R2: Sì. Ho riaperto il diff dei sei file tecnici/documentali, rieseguito i probe prima/dopo e le due suite. I file R1 già presenti non sono inclusi nel diff SK-4.

❓ Q3 — File correlati: la tabella §5 è completa e verificata?
✅ R3: Sì. Core, adapter, consumatore review, due suite e contratto sono allineati. Owner/cruscotto sono esclusi dal mandato dell'esecutore e restano all'orchestratore.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non ho aggiornato PLAN/cruscotto, non ho dichiarato SK-4 chiuso, non ho svolto la controverifica M12, non ho aperto SK-8/SK-10/WP-1, non ho toccato `src/`/DB e non ho eseguito commit/push.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow e come lo miglioreresti?
✅ R5: I test distribuiti davano un'impressione di copertura completa mentre mancava la composizione a due file. Miglioria applicata: un test per pacchetto che nomina gli attacchi e richiede il gate specifico su ogni artefatto, non soltanto un rosso aggregato.

❓ Q6 — Contesto & hook: il contesto caricato era troppo / giusto / troppo poco?
✅ R6: Giusto ma con una rettifica di path nel piano SK-4; manuale, mandato, owner mirato, contratto e codice vitale sono bastati. Nessun hook ha aggiunto rumore durante l'esecuzione.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0358d-3897-74ee-bb7d-847aee6b3300","correlation_id":"mss-cor-01a0358d-3897-724a-b7af-b77217020326","segment_no":1,"created_at":"2026-08-24T22:54:02+02:00","finalization":"final","recorded_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-openai/gpt-5.6-sol","actor_type":"agente","role":"esecutore SK-4 T6","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"openai/gpt-5.6-sol","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"session_event","record_id":"mss-rec-01a0358d-3897-7db9-94be-de02ebec3dd4","capture_key":"mss-ses-01a0358d-3897-74ee-bb7d-847aee6b3300/1/session_event/1","event":{"event_id":"mss-evt-01a0358d-3897-77b2-9362-b040400a01e1","event_kind":"session_close","occurred_at":"2026-08-24T22:54:02+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore SK-4 T6","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 6ec9dba; 18 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/24-08-26/Report-sk4-completamento-t6-24-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/24-08-26/Report-sk4-completamento-t6-24-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"SK4-H1","criterio":"npm run test:mss (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"SK4-TOOLS","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"SK4-DOCS","criterio":"npm run validate:docs (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:docs (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"SK4-ALL","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"SK4-DIFF","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"scripts/mss/adapter.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"scripts/mss/core.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"scripts/mss/review.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0358d-3897-74ee-bb7d-847aee6b3300","correlation_id":"mss-cor-01a0358d-3897-724a-b7af-b77217020326","segment_no":1,"created_at":"2026-08-24T22:54:02+02:00","finalization":"final","recorded_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-openai/gpt-5.6-sol","actor_type":"agente","role":"esecutore SK-4 T6","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"openai/gpt-5.6-sol","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a0358d-3897-729f-8409-259a98a57568","capture_key":"mss-ses-01a0358d-3897-74ee-bb7d-847aee6b3300/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a0358d-3897-7beb-9157-a39b02375f7b","axis":"persona","subject_record_ids":["mss-rec-01a0358d-3897-7db9-94be-de02ebec3dd4"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-openai/gpt-5.6-sol","role":"esecutore SK-4 T6","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0358d-3897-74ee-bb7d-847aee6b3300","correlation_id":"mss-cor-01a0358d-3897-724a-b7af-b77217020326","segment_no":1,"created_at":"2026-08-24T22:54:02+02:00","finalization":"final","recorded_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-openai/gpt-5.6-sol","actor_type":"agente","role":"esecutore SK-4 T6","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"openai/gpt-5.6-sol","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a0358d-3897-7973-a397-e4e5c0729ef1","capture_key":"mss-ses-01a0358d-3897-74ee-bb7d-847aee6b3300/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a0358d-3897-752c-8705-f92d10c5ee23","axis":"sistema","subject_record_ids":["mss-rec-01a0358d-3897-7db9-94be-de02ebec3dd4"],"delta":"modificato","assertions":[{"rule_id_version":"SK-4/D18@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato T6: controprovare B1-B3 e chiudere i bypass enforcement residui","decision_or_output_changed":"Il gate legacy distingue i record committati in HEAD dalla vista staged; il perimetro Report|Verbale ricorsivo ha una sola implementazione esportata da adapter.mjs e importata dai consumatori","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-openai/gpt-5.6-sol","role":"esecutore SK-4 T6","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0358d-3897-74ee-bb7d-847aee6b3300","correlation_id":"mss-cor-01a0358d-3897-724a-b7af-b77217020326","segment_no":1,"created_at":"2026-08-24T22:54:02+02:00","finalization":"final","recorded_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-openai/gpt-5.6-sol","actor_type":"agente","role":"esecutore SK-4 T6","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"openai/gpt-5.6-sol","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"record_type":"annotation","record_id":"mss-rec-01a0358d-3897-7d98-92bc-ee984331afdc","capture_key":"mss-ses-01a0358d-3897-74ee-bb7d-847aee6b3300/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a0358d-3897-7e2e-83a7-10ab1d964d2d","axis":"output","subject_record_ids":["mss-rec-01a0358d-3897-7db9-94be-de02ebec3dd4"],"delta":"creato","assertions":[{"output_id":"sk4-completamento-t6-24-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/24-08-26/Report-sk4-completamento-t6-24-08-26.md","recipient":"Matteo, orchestratore T6 e revisore M12","problem_or_job":"chiudere i bypass B1-B3 con attacchi riproducibili e gate automatici non vacui","intended_use":"controverificare SK-4 e decidere la chiusura formale senza fidarsi della narrativa storica","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"docs/Sessioni di lavoro/24-08-26/Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md","authored_by":"openai-gpt-5.6-sol-sk4-t6","verified_by":"non_osservato","acceptance_criterion":"B1-B3 negati dal gate dedicato, storico HEAD leggibile, D18 senza regex locale e suite MSS verdi","verification_or_use_evidence":"controlli generati nella capsula del report e test nominati SK-4 nelle suite H-1/tools","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["scripts/mss/adapter.mjs","scripts/mss/core.mjs","scripts/mss/review.mjs","docs/MetaSkillSystem/tests/h1/run.mjs","docs/MetaSkillSystem/tests/tools/run.mjs","docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"],"relations_no_double_count":["prova di enforcement SK-4; il report resta registro della seduta"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"non_applicabile:-runtime-non-riconosciuto-dalle-variabili-whitelisted-openai/gpt-5.6-sol","role":"esecutore SK-4 T6","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
