# Report hardening H-1.1 — integrità MetaSkillSystem

**Cosa è cambiato:** i record finalizzati sono ora confrontati fra `HEAD` e staged; i tre assi,
versioni, modalità, amendment storici e protocollo fixture hanno controlli semantici permanenti.
**Cosa resta:** H-1.1 non dimostra continuità globale, CI o E3; `WP-1` non è iniziato. Restano i
bypass dichiarati e il debito separato `docs/Archives`.
**Serve una tua azione:** nessuna per il codice locale; prima di aprire WP-1 serve una revisione
completa esterna dedicata e poi una tua decisione esplicita.

**Data:** 10-08-26 · **Modalità:** Meta/deep · **Branch:** `env/test` · **Commit/push:** nessuno

## 1. Esito H-1.1

H-1.1 è pronto per una revisione completa esterna. La promessa verificata localmente è ora:

- un record `final` presente in `HEAD` non può essere riscritto o perso nello staged senza deny;
- narrativa e ordine chiavi JSON possono cambiare se il record canonico resta identico;
- sono ammessi soltanto nuovi record conformi, inclusi amendment;
- Persona, Sistema e Output non possono chiudere con assertion vuote o parziali;
- coppie schema/revisione e modalità esplicite sono non ambigue;
- un amendment può puntare a storia Git delimitata, unica e finalizzata;
- i 14 ID frozen restano 14 e i loro contenuti hanno fingerprint protetti.

Non viene dichiarata efficacia su piloti reali. `G2/O1/E2` descrive il controllo locale osservato in
questa sessione; il LOCK resta E1 e nessun controllo è E3.

## 2. Controprove prima e dopo

Il primo lancio, eseguito dopo aver aggiunto le aspettative ma prima dei fix, ha riprodotto 17
fallimenti. Dopo il fix tutte le controprove sono permanenti.

| Gruppo | Prima | Dopo |
|---|---:|---:|
| Persona vuota; Sistema vuoto/senza G-O-E; Output solo `product_candidate` | 0/4 respinte | 4/4 respinte |
| Denominatore non numerico; source ref orfano; coppia schema/revisione incrociata | 0/3 respinte | 3/3 respinte |
| Modalità ibrida e sconosciuta | 0/2 respinte | 2/2 respinte |
| Target storico valido/inesistente/ambiguo | valido respinto; ambiguo non distinto | 3/3 coerenti |
| Record final modificato/cancellato/renamed fuori perimetro | 0/3 bloccati stabilmente | 3/3 bloccati |
| Manifest: frozen mancante, ID duplicato, protocollo incompatibile | 0/3 respinti | 3/3 respinti |
| **Totale buchi iniziali** | **0/17 chiusi** | **17/17 chiusi** |

Sono inoltre verdi: narrativa modificata con capsula identica, chiavi JSON riordinate, amendment
append-only nello stesso artefatto, amendment verso target unico in `HEAD`, deny su target draft o
ciclico, deny su riscrittura/cancellazione delle fixture frozen e parità dello stesso input fra
core, CLI, stop e pre-commit.

## 3. Implementazione e diff reale

| Superficie | Modifica H-1.1 |
|---|---|
| Core deterministico | canonicalizzazione JSON; semantica assi; rapporti numerici; refs; coppie versione; amendment esterni/cicli; confronto append-only puro |
| Parser report | modalità ammesse esatte; ibrida, duplicata, contraddittoria o sconosciuta → deny |
| Adapter Git | acquisizione `HEAD`, staged e worktree con status A/C/M/R/D; storia limitata a report ed eventi light tracciati |
| Stop, CLI e pre-commit | stesso core e stesso resolver storico; delete/rename inclusi; mismatch staged/worktree conservato |
| Manifest/fixture | `protocol_id/version`; 14 frozen esatti; `FX-V01-report` e supporto light supplementari; SHA-256 dei frozen |
| Suite | 8 fixture semantiche H-1.1 + regressioni in memoria e repository Git temporanei |
| Fonti proprietarie | contratto, protocollo, masterplan e matrice aggiornati senza bump di schema/protocollo |

File H-1.1 coinvolti: moduli sotto `scripts/mss/` (inclusi i nuovi adapter canonicale/Git), i due
hook di fine sessione, generatore e suite H-1, manifest e fixture `FX-S17…FX-S24`, contratto,
protocollo, masterplan, matrice, questo report e il solo puntatore in `SESSION_LOG`.

Non sono stati modificati `src/`, DB, Supabase, PROD, deploy, skill applicative, vocabolario o report
personali/paralleli. Il report H-1 del 09-08 e la sua capsula finalizzata non sono stati riscritti.

## 4. Test e denominatori

| Controllo | Esito | Numeratore / denominatore |
|---|---|---:|
| `npm run test:mss` | PASS | 41/41 fixture; 19/19 gruppi contratto/integrazione |
| Controprove H-1.1 ereditate | PASS | 17/17 chiuse |
| `node --check` moduli MSS, suite e hook | PASS | 14/14 file |
| `npm run typecheck` | PASS | 1/1 comando |
| lint escluso `docs/Archives/**` | PASS | 1/1 comando |
| Vitest escluso `docs/Archives/**` | PASS | 163/163 file; 1346/1346 test |
| Suite senza rewrite del worktree | PASS | 1/1 confronto stato prima/dopo |
| `git diff --check` sul perimetro H-1.1 | PASS | 1/1 comando |
| `git diff --check` globale | FAIL preesistente | 0/1: blank line EOF in `Comunicazione-Skill/OSSERVAZIONI.md` estraneo |
| `npm run validate` globale | FAIL preesistente | 0/1: lint Archives, 17 errori + 346 warning |

Vitest continua a emettere warning React `act(...)` già presenti, senza test falliti. Il gate globale
si ferma al lint Archives e quindi non prova typecheck/test dentro lo stesso comando; i due gate
pertinenti sono stati eseguiti separatamente e sono verdi.

## 5. Derivazione degli errori e correzioni

| Evento | Causa | Correzione permanente |
|---|---|---|
| Sei falsi positivi semantici | il core validava soprattutto il contenitore e il solo gate prodotto | validator per entità complete, enum, G/O/E e rapporto controlli |
| Delete/rename invisibili | pre-commit usava `ACMR` e confrontava staged col worktree | adapter A/C/M/R/D + confronto canonico `HEAD`/staged |
| Amendment storico valido respinto | target cercato soltanto nel bundle | storia Git delimitata passata al core come record normalizzati |
| Modalità invalida trattata come undeclared | ricerca lessicale del primo token noto | parser a valori esatti con stato `invalid` |
| 15° frozen implicito | `FX-V01-report` viveva nella lista frozen | rappresentazione supplementare esplicita di `FX-V01` |
| Primo verde H-1.1 non proteggeva i byte frozen | manifest fissava ID/esiti ma non il contenuto | fingerprint SHA-256, supporto light congelato e deny lifecycle fixture |
| Due aspettative H-1 riallineate | il nuovo validator emetteva correttamente un codice semantico aggiuntivo; `legacy` esplicito non è ammesso | aspettative supplementari aggiornate al contratto, frozen invariati |

La scoperta sul fingerprint è avvenuta durante la rilettura a mente fredda dopo il primo verde: la
chiusura è rimasta aperta, il bypass è stato corretto e testato prima di questo report.

## 6. Limiti e bypass rimasti

- `git commit --no-verify` e superfici senza hook restano bypass.
- Lo stop copre solo il report locale recente; non copre Cloud, Codex/Claude senza hook o report non
  recenti.
- L'append-only forte vale al pre-commit sugli artefatti MSS controllati e staged, non impedisce
  l'edit nel filesystem.
- La storia risolvibile è volutamente limitata ai report e `eventi-light` tracciati in `HEAD`; non è
  uno store definitivo.
- Report realmente senza dichiarazione e senza capsula restano legacy fail-open; una dichiarazione
  esplicita invalida è invece deny.
- Nessuna CI è cablata, nessuna continuità globale è dimostrata, nessun pilota reale è iniziato.
- Il debito Archives e la blank line estranea restano fuori H-1.1.

## 7. Handoff operativo

**Stato vero:** H-1.1 è verde localmente e pronto per revisione esterna; WP-1 resta non iniziato e
non pronto ad apertura senza quel verdetto.
**Decisioni chiuse:** schema `0.1.1`/freeze-2 e protocollo `1.0.1` restano invariati; 14 frozen;
canonicalizzazione JSON; storia Git delimitata; nessuno store/E3/CI anticipato.
**Autorità:** Matteo possiede apertura WP-1, bump protocollo/schema, commit e push.
**Owner:** contratto = semantica; protocollo = 14 casi; masterplan = stato; matrice = copertura;
manifest = rappresentazione eseguibile.
**Prossimo task:** revisione completa esterna di H-1.1 da agente dedicato.
**Gate successivo:** zero falsi positivi residui e conferma indipendente dell'append-only prima di
chiedere a Matteo l'apertura di WP-1.

## 8. Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-0198b111-0001-7000-8000-000000000010","session_id":"mss-ses-0198b111-0001-7000-8000-000000000001","correlation_id":"mss-cor-0198b111-0001-7000-8000-000000000002","segment_no":1,"capture_key":"mss-ses-0198b111-0001-7000-8000-000000000001/1/session_event/1","created_at":"2026-08-10T01:00:00+02:00","finalization":"final","recorded_by":{"actor_id":"codex-root","actor_type":"agente","role":"H-1.1_supervisor_implementer","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"local workspace API"},"tools_used":["PowerShell","apply_patch","Node.js","Vitest","Git"]},"packages_loaded":[{"package_id":"project-guidance","package_version_or_revision":"checkpoint-7632443+working-tree","source_ref":"AGENTS.md; .claude/CLAUDE.md"},{"package_id":"communication","package_version_or_revision":"working-tree@7632443","source_ref":"docs/Comunicazione-Skill/VOCABOLARIO.md"},{"package_id":"testing","package_version_or_revision":"working-tree@7632443","source_ref":"docs/Testing-Skill/TESTING_SKILL.md"},{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; PARAMETRI_MACRO_V0.md; contratto; piano; protocollo; matrice"}],"event":{"event_id":"mss-evt-0198b111-0001-7000-8000-000000000020","event_kind":"session_close","occurred_at":"2026-08-10T01:00:00+02:00","continues_record_id":"nessuno","causation_record_id":"mss-rec-019fe840-fa43-782f-a111-f08584e81fbf","intent_user":"correggere i buchi di integrita H-1 e lasciare regressioni permanenti senza avviare WP-1 o pubblicare","session_type":"meta","capsule_status":"completa","role_key":"MetaSkillSystem H-1.1 supervisor e implementer","area":"MetaSkillSystem H-1.1; validator, adapter, hook, fixture e fonti proprietarie","environment":"branch env/test; workspace locale; nessun DB, rete applicativa o deploy","authorization":{"read":["istruzioni repository","fonti MetaSkillSystem autorizzate","implementazione H-1 e stato Git"],"write":["core e adapter MSS","due hook fine sessione","fixture e suite H-1.1","contratto protocollo piano matrice","report H-1.1 e puntatore SESSION_LOG"],"forbid":["commit","push","WP-1","WP-2","WP-3","store definitivo","retention","E3","DB","Supabase","PROD","src","report personali o paralleli","file anomalo non tracciato"]},"authorized_outputs":["hardening H-1.1","regressioni avversariali","fonti proprietarie allineate","report H-1.1 con capsula e handoff"],"route":{"chosen":"MetaSkillSystem + Testing, perimetro H-1.1","alternatives_or_conflicts":"nessuno"},"observed_outcome":"17 buchi iniziali chiusi; append-only HEAD/staged e manifest frozen protetti; 41 fixture e 19 gruppi verdi; pronto per revisione esterna, WP-1 non iniziato","open_items":["revisione completa esterna H-1.1","decisione Matteo separata prima di WP-1","debito workspace Archives fuori scope"],"controls":[{"control_id":"H11-COUNTEREXAMPLES","criterio":"tutte le controprove obbligatorie producono il risultato contrattuale","esito":"pass","numeratore":17,"denominatore":17,"esecutore":"codex-root + suite deterministica","evidence_refs":["source-suite","source-report"]},{"control_id":"H11-FIXTURES","criterio":"fixture frozen e supplementari rispettano manifest e fingerprint","esito":"pass","numeratore":41,"denominatore":41,"esecutore":"npm run test:mss","evidence_refs":["source-suite","owner-protocol"]},{"control_id":"H11-INTEGRATION","criterio":"core parser refs adapter Git CLI stop pre-commit manifest matrice e anti-rewrite passano","esito":"pass","numeratore":19,"denominatore":19,"esecutore":"npm run test:mss","evidence_refs":["source-suite","owner-matrix"]},{"control_id":"H11-NODE-CHECK","criterio":"moduli MSS suite e hook hanno sintassi valida","esito":"pass","numeratore":14,"denominatore":14,"esecutore":"node --check","evidence_refs":["source-report"]},{"control_id":"H11-APP-WORKSPACE","criterio":"typecheck lint senza Archives e Vitest senza Archives sono verdi","esito":"pass","numeratore":3,"denominatore":3,"esecutore":"codex-root","evidence_refs":["source-report"]},{"control_id":"WORKSPACE-GLOBAL-VALIDATE","criterio":"npm run validate globale e verde","esito":"fail","numeratore":0,"denominatore":1,"esecutore":"npm run validate","evidence_refs":["source-report"]}],"subject_runtime":{"actor_id":"codex-root","provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"local workspace API"},"privacy":{"classification":"internal","capture_basis":"user_request","allowed_content":["fatti tecnici H-1.1","esiti comandi","stato e bypass del validator"],"prohibited_content":["contenuti personali o paralleli","segreti","dati di terzi","materiale sigillato"],"redactions":["nessun report parallelo aperto o copiato"],"external_release":"forbidden","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-contract","owner_id":"mss-contract-v0.1","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"schema-mss-session-0.1.1","revision_or_hash":"mss-v0.1-wp0.1-freeze-2-H1.1","sensitivity":"internal"},{"ref_id":"owner-plan","owner_id":"SYS-1-masterplan","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"H-1.1","revision_or_hash":"working-tree-H1.1","sensitivity":"internal"},{"ref_id":"owner-protocol","owner_id":"MSS-PILOT-001","uri_or_path":"docs/MetaSkillSystem/PROTOCOLLO_PRIMO_PILOTA_V0_1.md","stable_anchor_or_event_id":"fixture-minime-congelate-H1","revision_or_hash":"1.0.1-H1.1-enforcement","sensitivity":"internal"},{"ref_id":"owner-matrix","owner_id":"COVERAGE_MATRIX_H1","uri_or_path":"docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json","stable_anchor_or_event_id":"COVERAGE_MATRIX_H1","revision_or_hash":"working-tree-H1.1","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-user","owner_id":"conversation","uri_or_path":"conversation:this-session","stable_anchor_or_event_id":"user-request-H1.1","revision_or_hash":"turn-1","sensitivity":"internal"},{"ref_id":"source-suite","owner_id":"H1-test-suite","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"H-1.1-suite","revision_or_hash":"41-fixtures-19-groups","sensitivity":"internal"},{"ref_id":"source-report","owner_id":"H1.1-session-report","uri_or_path":"docs/Sessioni di lavoro/10-08-26/Report-hardening-h1-1-metaskillsystem-10-08-26.md","stable_anchor_or_event_id":"report-H1.1-10-08-26","revision_or_hash":"working-tree-H1.1","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198b111-0001-7000-8000-000000000011","session_id":"mss-ses-0198b111-0001-7000-8000-000000000001","correlation_id":"mss-cor-0198b111-0001-7000-8000-000000000002","segment_no":1,"capture_key":"mss-ses-0198b111-0001-7000-8000-000000000001/1/annotation/1","created_at":"2026-08-10T01:00:01+02:00","finalization":"final","recorded_by":{"actor_id":"codex-root","actor_type":"agente","role":"H-1.1_supervisor_implementer","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"local workspace API"},"tools_used":["PowerShell","apply_patch","Node.js","Vitest","Git"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198b111-0001-7000-8000-000000000030","axis":"persona","subject_record_ids":["mss-rec-0198b111-0001-7000-8000-000000000010"],"delta":"nessuno","assertions":[{"signal":"non_osservato","actor":"matteo","assistance":"non_applicabile:nessuna_valutazione_Persona_autorizzata","origin":"naturale","source_ref":"source-user","effect":"nessuno","evidence_state":"not_applicable"}],"asserted_by":{"actor_id":"codex-root","role":"H-1.1_supervisor_implementer","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile:nessun_criterio_Persona","evidence_refs":["source-user"],"notes":"nessuna inferenza, valutazione o promozione Persona"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198b111-0001-7000-8000-000000000012","session_id":"mss-ses-0198b111-0001-7000-8000-000000000001","correlation_id":"mss-cor-0198b111-0001-7000-8000-000000000002","segment_no":1,"capture_key":"mss-ses-0198b111-0001-7000-8000-000000000001/1/annotation/2","created_at":"2026-08-10T01:00:02+02:00","finalization":"final","recorded_by":{"actor_id":"codex-root","actor_type":"agente","role":"H-1.1_supervisor_implementer","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"local workspace API"},"tools_used":["PowerShell","apply_patch","Node.js","Vitest","Git"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198b111-0001-7000-8000-000000000031","axis":"sistema","subject_record_ids":["mss-rec-0198b111-0001-7000-8000-000000000010"],"delta":"H-1 verde ma integrita incompleta -> H-1.1 append-only e semantica verificabili","assertions":[{"rule_id_version":"H-1.1@mss.session/0.1.1-freeze-2","trigger_event":"17 controprove rosse prima dei fix e bypass fingerprint scoperto in rilettura","decision_or_output_changed":"core unico, adapter HEAD/staged, modalita stretta, storia delimitata e manifest frozen con fingerprint","G":2,"O":1,"E":2}],"asserted_by":{"actor_id":"codex-root","role":"H-1.1_supervisor_implementer","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-matrix","evidence_refs":["source-suite","source-report"],"notes":"osservazione locale avversariale; nessun pilota reale, CI o E3"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198b111-0001-7000-8000-000000000013","session_id":"mss-ses-0198b111-0001-7000-8000-000000000001","correlation_id":"mss-cor-0198b111-0001-7000-8000-000000000002","segment_no":1,"capture_key":"mss-ses-0198b111-0001-7000-8000-000000000001/1/annotation/3","created_at":"2026-08-10T01:00:03+02:00","finalization":"final","recorded_by":{"actor_id":"codex-root","actor_type":"agente","role":"H-1.1_supervisor_implementer","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"local workspace API"},"tools_used":["PowerShell","apply_patch","Node.js","Vitest","Git"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198b111-0001-7000-8000-000000000032","axis":"output","subject_record_ids":["mss-rec-0198b111-0001-7000-8000-000000000010"],"delta":"modificato","assertions":[{"output_id":"MSS-H1.1-HARDENING","primary_type":"governance","canonical_version":"mss.session/0.1.1 freeze-2 H-1.1","recipient":"Matteo e successive sessioni MetaSkillSystem","problem_or_job":"impedire perdita o riscrittura dei record finali e chiusure formalmente vuote","intended_use":"validator locale condiviso fra core CLI stop e pre-commit prima del pilota","conceived_by":"revisione indipendente H-1 e prompt di Matteo","decided_by":"Matteo tramite obiettivo e gate H-1.1","directed_by":"contratto 0.1.1 protocollo 1.0.1 e PLAN_V0","authored_by":"codex-root sotto regia di Matteo","verified_by":"suite automatica locale; revisione indipendente successiva non ancora eseguita","acceptance_criterion":"17 controprove chiuse, append-only HEAD/staged reale, 14 frozen protetti e parita superfici","verification_or_use_evidence":"41 fixture, 19 gruppi, 14 node-check, typecheck, lint e 1346 Vitest verdi","verification_status":"self_report","owner_ref":"owner-contract","privacy_release":"internal; external release forbidden","support_files":["scripts/mss","hook Cursor/Husky","fixture v0.1","report H-1.1"],"relations_no_double_count":["un solo output governance H-1.1; codice test documenti e report sono supporti"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"codex-root","role":"H-1.1_supervisor_implementer","basis":"source_derived"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-matrix","evidence_refs":["source-suite","source-report"],"notes":"pronto per revisione esterna; efficacia su piloti e superfici esterne non osservata"}}}
```

## 9. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: richiesta allegata con profilo Meta/deep: correggere H-1.1, riprodurre prima tutti i falsi positivi, implementare append-only HEAD/staged, tre assi completi, versioni/modalità strette, amendment storico e manifest congelato; nessun WP-1, commit, push, DB, `src/`, report personali o subagenti.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero?
✅ R2: sì; riletti core, parser, adapter, Git adapter, CLI, due hook, generatore, suite, manifest, fixture, contratto, piano, protocollo e matrice; rieseguiti 41/41 fixture, 19/19 gruppi, 14/14 node-check e gate workspace.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica?
✅ R3: allineati contratto, protocollo, PLAN, matrice, rules/core/canonical/parser/refs/adapter/Git-adapter/CLI, due hook, generatore/suite, manifest/fixture, report e SESSION_LOG; nessuna skill applicativa, DB o tipo `src` coinvolto.

❓ Q4 — Cosa NON hai fatto?
✅ R4: nessun WP-1/2/3, store, retention, E3, CI, commit, push, DB, Supabase, PROD, deploy o codice applicativo; non corretti Archives, blank line estranea o report paralleli; non riscritta la capsula H-1.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto e come l'hai corretta?
✅ R5: il primo verde H-1.1 proteggeva struttura e ID ma non ancora i byte frozen; la rilettura a mente fredda ha aggiunto fingerprint, supporto light e deny su delete/rename prima della chiusura.

❓ Q6 — Contesto & hook: il contesto caricato era troppo/giusto/troppo poco? Gli hook erano utili?
✅ R6: contesto voluminoso ma giusto per una sessione Meta/deep; contratto, piano, protocollo, matrice, Testing e report H-1 erano tutti necessari. Gli hook erano oggetto essenziale del collaudo; i bypass esterni restano dichiarati.
