# Report Fase B — convergenza regex e query MSS — 23-08-26

## Esito

La Fase B ha chiuso tecnicamente D3 e D7 nel perimetro autorizzato. L'helper changed-reports usa
ora la policy canonica già esportata dall'adapter; `Report-*.md` e `Verbale-*.md` ricevono lo stesso
trattamento anche nelle sottocartelle; la query dichiara il perimetro reale. Le prove automatiche
sono verdi. Nessun owner o stato è stato aggiornato e nessun pacchetto è dichiarato `CHIUSO`.

## Fatti implementati

- `scripts/mss/adapter.mjs::REPORT_PATH_RE` è rimasta l'unica definizione canonica e non è stata
  modificata.
- `scripts/mss/validate-changed-reports.mjs` importa quella costante; conserva la selezione Git
  `--diff-filter=AM`, la gestione base/head e la delega al CLI MSS con capsula obbligatoria.
- I messaggi del caso vuoto e del conteggio parlano ora di `Report-*.md` e `Verbale-*.md`.
- I tre output interessati di `scripts/mss/query.mjs` dichiarano albero HEAD + working tree,
  entrambe le famiglie sotto `docs/Sessioni di lavoro/` e il limite reale: niente storia dei commit
  e niente capsule fuori da nomi/path riconosciuti dalla regex canonica.
- La suite tools è salita da 9 a 16 test. I sette casi nuovi usano repository Git temporanei
  isolati, dati sintetici, nessuna rete/DB/TTY/ora reale e cleanup in `finally` dopo verifica della
  root assoluta.

## Prove

| Comando o controllo | Exit | Riga o fatto probante |
|---|---:|---|
| `node --check scripts/mss/validate-changed-reports.mjs` | 0 | sintassi helper valida |
| `node --check scripts/mss/query.mjs` | 0 | sintassi query valida |
| `node --check docs/MetaSkillSystem/tests/tools/run.mjs` | 0 | sintassi suite valida |
| `npm run lint` | 0 | ESLint applicativo e `lint:scripts`, zero warning lint |
| `npm run test:mss` | 0 | `H-1 suite green: 42 fixture cases + 32 contract/integration groups` |
| `npm run test:mss:tools` | 0 | `MSS tools suite green: 16 tests` |
| `npm run validate` | 0 | lint, typecheck, Vitest e tools verdi; warning React `act(...)` preesistenti non bloccanti |
| ricerca definizioni `REPORT_PATH_RE` sotto `scripts/mss/` | 0 | una sola definizione: `adapter.mjs`; helper e query la importano |
| ricerca dei tre vecchi testi query solo-Report | 1 | nessuna occorrenza, come atteso |
| `git diff --check -- <tre file tracked Fase B>` | 0 | diff tecnico della sola Fase B senza errori whitespace |
| `git diff --no-index --check -- NUL <report>` | 1 atteso | zero righe diagnostiche; exit 1 segnala soltanto che il nuovo report differisce da `NUL` |

La suite tools prova in modo osservabile:

1. `Report-*` valido in sottocartella: selezionato, validato, exit 0;
2. `Report-*` invalido: exit 1 con path e `MSS-REPORT-NO-CAPSULE`, poi stesso path corretto e verde;
3. `Verbale-*` valido in sottocartella: selezionato, validato, exit 0;
4. `Verbale-*` invalido: exit 1 con path e `MSS-REPORT-NO-CAPSULE`, poi stesso path corretto e verde;
5. diff vuoto: exit 0 e messaggio esplicito su entrambe le famiglie;
6. file non pertinente: ignorato, exit 0;
7. riepilogo query: cita HEAD, working tree e le due famiglie in tutti e tre i punti, e respinge
   le vecchie formulazioni solo-Report.

Il primo giro mirato ha reso rossi soltanto i due casi validi: i record sintetici referenziavano
owner MSS non presenti nel repository temporaneo. La correzione ha aggiunto i due stub referenziati
alla baseline isolata, senza allentare validatore o aspettative; il giro successivo è passato 16/16.

## Limiti e non-interventi

- Non è stata modificata `.github/workflows/ci.yml`: D1 resta alla Fase C già decisa come job MSS
  separato.
- Non sono stati toccati i 17 path documentali, viste/roadmap/handoff Senior, owner, capsule
  storiche, `PLAN_V0.md`, `src/**`, DB, Supabase o `docs/_lavoro/**`.
- `npm run validate` non sostituisce H-1: `npm run test:mss` è stato eseguito e registrato a parte.
- Non è stata eseguita la CI remota e non è stata avviata la Fase C.
- Questa è prova dell'esecutore (`self_report`), non revisione indipendente né autorizzazione a
  commit, push o promozioni di stato.

## File rilasciati

- `scripts/mss/validate-changed-reports.mjs` — import della policy unica e messaggi Report/Verbale;
- `scripts/mss/query.mjs` — testo del perimetro reale;
- `docs/MetaSkillSystem/tests/tools/run.mjs` — sette prove automatiche nuove;
- `scripts/mss/adapter.mjs` — ownership rilasciata, nessuna modifica;
- `package.json` — non posseduto né modificato, perché nessun comando nuovo era necessario.

## Handoff finale

Fase B tecnicamente rilasciata per la revisione distinta prevista dal piano. Il prossimo esecutore
può usare l'helper definitivo per la Fase C, ma deve rispettare il proprio mandato: simulazione
locale del job MSS separato, nessun push senza il sì esplicito di Matteo e nessuna dichiarazione
`CHIUSO`. I file tecnici sopra sono rilasciati; non risultano directory temporanee o capsule di
prova residue.

## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-0198f000-0002-7000-8000-000000000001","session_id":"mss-ses-0198f000-0002-7000-8000-000000000010","correlation_id":"mss-cor-0198f000-0002-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198f000-0002-7000-8000-000000000010/1/session_event/1","created_at":"2026-08-23T15:40:45+02:00","finalization":"final","recorded_by":{"actor_id":"codex-phase-b","actor_type":"agente","role":"esecutore Fase B D3 D7","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"workspace"},"tools_used":["Read","Shell","apply_patch","git","node","npm"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"testing-skill","package_version_or_revision":"workspace 23-08-26","source_ref":"docs/Testing-Skill/TESTING_SKILL.md"}],"event":{"event_id":"mss-evt-0198f000-0002-7000-8000-000000000030","event_kind":"session_close","occurred_at":"2026-08-23T15:40:45+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"eseguire soltanto la Fase B del piano post-revisione e chiudere tecnicamente D3 e D7 con prove automatiche","session_type":"deep","capsule_status":"completa","role_key":"esecutore-mss-fase-b","area":"MetaSkillSystem / D3 / D7","environment":"workspace locale env/test; nessuna rete o DB","authorization":{"read":["skill e piani MSS autorizzati","scripts/mss e test vicini"],"write":["adapter helper query test strettamente necessari","report Fase B"],"forbid":["workflow CI","owner e stati","commit","push","src DB Supabase docs privati"]},"authorized_outputs":["fix D3 D7","test automatici","report Fase B con capsula"],"route":{"chosen":"Prompt esecutore Fase B 23-08-26","alternatives_or_conflicts":"nessuno"},"observed_outcome":"policy regex unica importata; helper e query convergenti su Report e Verbale; H-1 42+32, tools 16/16 e validate verdi","open_items":["revisione distinta della Fase B","Fase C con simulazione locale","autorizzazione esplicita di Matteo prima del push"],"controls":[{"control_id":"B-NODE","criterio":"node --check su ogni mjs modificato","esito":"pass","numeratore":3,"denominatore":3,"esecutore":"Codex Fase B","evidence_refs":["source-report"]},{"control_id":"B-H1","criterio":"npm run test:mss mantiene fixture e gruppi verdi","esito":"pass","numeratore":74,"denominatore":74,"esecutore":"Codex Fase B","evidence_refs":["source-report"]},{"control_id":"B-TOOLS","criterio":"npm run test:mss:tools copre D3 e D7","esito":"pass","numeratore":16,"denominatore":16,"esecutore":"Codex Fase B","evidence_refs":["source-report"]},{"control_id":"B-VALIDATE","criterio":"npm run validate exit 0","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"Codex Fase B","evidence_refs":["source-report"]},{"control_id":"B-REGEX","criterio":"una sola definizione REPORT_PATH_RE sotto scripts/mss","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"Codex Fase B","evidence_refs":["source-report"]}],"subject_runtime":{"actor_id":"codex-phase-b","provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"workspace"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["path repository","exit code","conteggi test","hash tecnici"],"prohibited_content":["segreti","credenziali","dati personali non necessari"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-plan","owner_id":"piano-post-revisione","uri_or_path":"docs/Sessioni di lavoro/23-08-26/PLAN-POST-REVISIONE-RIMANENZE-23-08-26.md","stable_anchor_or_event_id":"§9 Fase B","revision_or_hash":"working tree","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-report","owner_id":"fase-b-d3-d7","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-fase-b-fix-regex-query-23-08-26.md","stable_anchor_or_event_id":"prove e handoff","revision_or_hash":"working tree","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198f000-0002-7000-8000-000000000002","session_id":"mss-ses-0198f000-0002-7000-8000-000000000010","correlation_id":"mss-cor-0198f000-0002-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198f000-0002-7000-8000-000000000010/1/annotation/1","created_at":"2026-08-23T15:40:46+02:00","finalization":"final","recorded_by":{"actor_id":"codex-phase-b","actor_type":"agente","role":"esecutore Fase B D3 D7","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"workspace"},"tools_used":["Read"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198f000-0002-7000-8000-000000000040","axis":"persona","subject_record_ids":["mss-rec-0198f000-0002-7000-8000-000000000001"],"delta":"nessuno","assertions":[{"signal":"non_osservato","actor":"Matteo","assistance":"non_applicabile:seduta tecnica esecutiva","origin":"naturale","source_ref":"source-report","effect":"nessuna inferenza sulla persona","evidence_state":"not_applicable"}],"asserted_by":{"actor_id":"codex-phase-b","role":"esecutore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-report","evidence_refs":["source-report"],"notes":"la seduta misura sistema e output, non competenze personali"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198f000-0002-7000-8000-000000000003","session_id":"mss-ses-0198f000-0002-7000-8000-000000000010","correlation_id":"mss-cor-0198f000-0002-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198f000-0002-7000-8000-000000000010/1/annotation/2","created_at":"2026-08-23T15:40:47+02:00","finalization":"final","recorded_by":{"actor_id":"codex-phase-b","actor_type":"agente","role":"esecutore Fase B D3 D7","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"workspace"},"tools_used":["Shell","node","npm","git"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198f000-0002-7000-8000-000000000050","axis":"sistema","subject_record_ids":["mss-rec-0198f000-0002-7000-8000-000000000001"],"delta":"verificato","assertions":[{"rule_id_version":"D3+D7@mss-v0.1-wp0.1-freeze-2","trigger_event":"mandato Fase B","decision_or_output_changed":"helper changed-reports importa la regex canonica e query dichiara Report e Verbale con test di regressione","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"codex-phase-b","role":"esecutore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-report","evidence_refs":["source-report"],"notes":"E=2 per prove Git isolate rosso-verde, H-1, tools, lint e validate; revisione distinta ancora dovuta"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198f000-0002-7000-8000-000000000004","session_id":"mss-ses-0198f000-0002-7000-8000-000000000010","correlation_id":"mss-cor-0198f000-0002-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198f000-0002-7000-8000-000000000010/1/annotation/3","created_at":"2026-08-23T15:40:48+02:00","finalization":"final","recorded_by":{"actor_id":"codex-phase-b","actor_type":"agente","role":"esecutore Fase B D3 D7","agent_runtime":{"provider":"OpenAI","model":"GPT-5","runtime":"Codex","surface":"workspace"},"tools_used":["apply_patch"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198f000-0002-7000-8000-000000000060","axis":"output","subject_record_ids":["mss-rec-0198f000-0002-7000-8000-000000000001"],"delta":"creato","assertions":[{"output_id":"report-fase-b-fix-regex-query-23-08-26","primary_type":"registro","canonical_version":"23-08-26-working-tree","recipient":"Matteo e revisore Fase B","problem_or_job":"documentare fix D3 D7 prove limiti e rilascio file","intended_use":"revisione distinta e ingresso controllato alla Fase C","conceived_by":"piano post-revisione §9","decided_by":"Matteo","directed_by":"mandato Fase B","authored_by":"Codex Fase B","verified_by":"non_osservato","acceptance_criterion":"policy unica Report Verbale, query coerente, H-1 e tools verdi, nessun file fuori fase","verification_or_use_evidence":"sezioni Prove Limiti File rilasciati del report","verification_status":"self_report","owner_ref":"owner-plan","privacy_release":"requires_confirmation","support_files":["scripts/mss/validate-changed-reports.mjs","scripts/mss/query.mjs","docs/MetaSkillSystem/tests/tools/run.mjs"],"relations_no_double_count":["fix e prove appartengono alla stessa Fase B"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"codex-phase-b","role":"esecutore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-report","evidence_refs":["source-report"],"notes":"report validato localmente; accettazione indipendente e uso in Fase C non ancora osservati"}}}
```
