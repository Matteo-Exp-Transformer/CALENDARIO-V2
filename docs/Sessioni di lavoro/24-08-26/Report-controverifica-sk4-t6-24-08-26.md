# SK-4 T6 — controverifica indipendente M12

**Modalità:** deep  
**Ruolo:** revisore indipendente SK-4 / senior orchestratore MSS  
**Branch:** `env/test`  
**HEAD verificato:** `6ec9dbaddae62a643e713096495d26f2bb640904`

## 1. Cappello e verdetto

**Verdetto M12: PASS_CON_RISERVE.** I tre bypass B1-B3 sono respinti da prove nominate; B1 è
anche non vacuo. La verifica è indipendente dall'esecutore `openai/gpt-5.6-sol`. La sola riserva
è di registrazione: `--verify` ha rifiutato in sicurezza l'amendment del record Sistema
`mss-rec-01a0358d-3897-7973-a397-e4e5c0729ef1`, perché il suo report sorgente è ancora untracked e
il bersaglio non esiste nella vista globale validabile.

Questo non chiude formalmente SK-4: resta **APERTO** fino alla firma di Matteo. Non sono stati
modificati codice dell'esecutore, owner/PLAN, cruscotto, `src/`, DB, WP-1, SK-8/SK-10, né è stato
eseguito commit o push.

## 2. Perimetro e diff reale

Il diff SK-4 tocca il contratto, i due test nominati e tre moduli MSS: `adapter.mjs`, `core.mjs`,
`review.mjs`. Le modifiche R1 già presenti nello stesso worktree sono state tenute fuori dal
giudizio. `git diff --check` è verde.

La separazione è coerente in entrambi i flussi:

- staged: `historicalRecords` mantiene la vista transazionale per riferimenti e collisioni,
  mentre `committedRecords` riceve soltanto `headView.records`;
- file mode: se non fornisce un insieme esplicito, il core usa i record del contenuto HEAD come
  base committata; un contenuto nuovo senza HEAD non è esente.

## 3. Risultati B1-B3 e D18

| Punto | Controprova rieseguita | Esito |
|---|---|---|
| B1 non vacuo | Due bundle legacy nuovi, identici e simultanei: controfattuale senza separazione = primo `ok: true`; con base committata vuota = `MSS-LEGACY-NEW-FORBIDDEN` su tutti i quattro record del primo bundle | PASS |
| B1 storico HEAD | Il test H1 nominato passa il medesimo bundle come `headContent` e resta verde; il corpus legge 4 record legacy. Il report storico reale è in HEAD (`7632443`) e non riceve il nuovo codice legacy; conserva però 8 incompatibilità storiche già estranee a B1 | PASS |
| B2 | `Report-*.md` in sotto-cartella ricorsiva, staged e worktree mismatch, riceve i gate dedicati | PASS |
| B3 | Stessa prova per `Verbale-*.md` | PASS |
| D18 | `review.mjs` importa `REPORT_PATH_RE` da `adapter.mjs`, senza `REPORT_NAME_RE`; il test tools confronta selezione Report/Verbale ricorsiva e rifiuto della cartella-data assente | PASS |

Il gruppo H1 è nominato `SK-4 B1-B3 — legacy nuovi falliscono, storico resta leggibile, Report|Verbale ricorsivi staged/worktree`; il gruppo tools è nominato `SK-4 D18/B2/B3 — mss:review usa il perimetro REPORT_PATH_RE condiviso`.

## 4. Controlli rieseguiti

| Controllo | Esito |
|---|---|
| `npm run test:mss` | exit 0 — 42 fixture, 48 gruppi; gruppo SK-4 verde |
| `npm run test:mss:tools` | exit 0 — 62 test; gruppo D18/SK-4 verde |
| `npm run validate:mss -- --mode file --file Report-sk4-completamento-t6-24-08-26.md --kind report --require-capsule` | exit 0 |
| `npm run validate:docs` | exit 0 — 0 path rotti |
| `npm run validate:mss:all` | exit 0 |
| `node --check` sui 3 moduli e 2 suite SK-4 | exit 0 |
| `git diff --check` | exit 0 |

`mss:review` ha segnalato correttamente i confini L5 e l'owner PLAN nel diff condiviso R1+SK-4:
è un fatto di perimetro, non una regressione di SK-4. Il report esecutore è stato validato da
solo prima della suite globale.

## 5. File di skill aggiornati

Nessuno. Il mandato non richiedeva aggiornamenti a una skill viva; contratto, motore e prove sono
allineati. La skill Meta e il manuale sono stati usati soltanto per routing e protocollo.

## 6. Dati comunicazione

- Mandato: sequenza D25 `R1 → SK-4 → SK-8`, Passo 0, controverifica §6, no commit/push.
- Correzioni di Matteo in questa controverifica: nessuna.
- Vincolo recepito: una chiusura M12 non sostituisce la firma formale di Matteo.

## 7. Lettura e limiti

- **Persona:** nessuna nuova valutazione di Matteo.
- **Sistema:** il confine di fiducia B1 è ora misurato, non dedotto; D18 è bloccato da una parità
  eseguibile fra consumatore e owner regex.
- **Output:** questo report e la capsula R1 registrano un M12 indipendente; non promuovono lo
  stato nel PLAN.

L'unico limite osservato è la compatibilità generale del report legacy reale del 09-08: il validator
attuale ne espone otto errori storici (ref/timestamp/struttura), ma non lo riscrive, non lo
classifica come legacy nuovo e `mss:query` lo legge. Non è una riserva a SK-4 perché B1 mira
all'esenzione impropria dei nuovi record e il caso legacy canonicale è coperto dal test dedicato.

La riserva M12 è separata: il tentativo `--verify` ha generato prospetticamente un amendment ma
`validate:mss` l'ha rifiutato con `MSS-AMENDMENT-ORPHAN` perché il record target, pur presente nel
report esecutore nel worktree, è escluso dalla vista globale del generatore finché quel report non
è tracciabile. Nessuna scrittura è avvenuta; non è stato usato un record sostitutivo né una
riscrittura `final`. Dopo che gli atti dell'esecutore saranno tracciabili, un revisore può ripetere
lo stesso `--verify` con questo report come `evidence_ref`.

## 8. Handoff

**Stato:** prove sostanziali M12 PASS, con riserva di registrazione strutturata; SK-4 resta aperto
per firma di Matteo e, se desiderato, per il retry `--verify` dopo che il record diventa visibile
alla vista globale.

**Non riaprire:** B1-B3/D18 senza una nuova controprova rossa. **Non fare:** commit/push,
aggiornamento PLAN/cruscotto o lavoro prodotto. Il prossimo orchestratore può usare questo report
come evidence_ref della verifica del record Sistema SK-4.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura (es. `git rev-parse HEAD:<path>` o SHA — stesso dato di `source_refs[].revision_or_hash` in capsula). Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1: `docs/Sessioni di lavoro/24-08-26/Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md`, SHA-256 `02270e8a9bbcc1987f67518f71f3172732a19567bb4bef57d9ed03b224c95aa1`; messaggio operativo in chat ricevuto dal padre: «Controverifica M12 di SK-4 T6 consegnato da gpt-5.6-sol. Sei revisore, non correggere codice/report esecutore e non toccare PLAN/cruscotto. No commit/push.»

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).
✅ R2: Sì: ho riaperto il diff dei 10 file modificati, isolato i 6 file SK-4 e rieseguito H1, tools, validator del report esecutore, docs e `validate:mss:all`; tutti verdi. La capsula generata qui sotto registra i comandi effettivi.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).
✅ R3: Nessuno — motivo: nessuna skill viva è stata cambiata dal mandato; ho verificato che contratto, adapter/core/review e le due suite sono i correlati tecnici completi del diff SK-4.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho corretto il codice, modificato report esecutore/PLAN/cruscotto, firmato SK-4, aperto SK-8/SK-10/WP-1 o fatto commit/push: sono azioni fuori autorità del revisore e il mandato le vieta.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: Il falso verde B1 è visibile solo confrontando il primo file contro un secondo staged; il gruppo nominato nuovo risolve l'attrito perché inchioda anche il controfattuale, non solo il verdetto aggregato.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto: manuale, mandato, owner e piano SK-4 hanno dato perimetro e prove senza corpus storico completo. Nessun hook ha aggiunto rumore; `mss:review` è stato utile per rendere espliciti gli L5/owner toccati.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03596-e401-7856-8e76-568efe8ea87b","correlation_id":"mss-cor-01a03596-e401-7185-a4c4-e127b13b0b97","segment_no":1,"created_at":"2026-08-24T23:04:36+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-sk4-t6-controverifica","actor_type":"agente","role":"revisore indipendente SK-4 T6","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a03596-e401-7406-a95f-b6d401e0f51a","capture_key":"mss-ses-01a03596-e401-7856-8e76-568efe8ea87b/1/session_event/1","event":{"event_id":"mss-evt-01a03596-e401-72c0-a68f-41ce99cd8506","event_kind":"session_close","occurred_at":"2026-08-24T23:04:36+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"revisore indipendente SK-4 T6","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 6ec9dba; 20 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/24-08-26/Report-controverifica-sk4-t6-24-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/24-08-26/Report-controverifica-sk4-t6-24-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"M12-SK4-DIFF","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"M12-SK4-SYNTAX","criterio":"node --check scripts/mss/core.mjs (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: node --check scripts/mss/core.mjs (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"scripts/mss/adapter.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"scripts/mss/core.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"scripts/mss/review.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6ec9dba","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03596-e401-7856-8e76-568efe8ea87b","correlation_id":"mss-cor-01a03596-e401-7185-a4c4-e127b13b0b97","segment_no":1,"created_at":"2026-08-24T23:04:36+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-sk4-t6-controverifica","actor_type":"agente","role":"revisore indipendente SK-4 T6","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03596-e401-7778-8007-afada236f79c","capture_key":"mss-ses-01a03596-e401-7856-8e76-568efe8ea87b/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a03596-e401-73ea-92ed-871815c0691b","axis":"persona","subject_record_ids":["mss-rec-01a03596-e401-7406-a95f-b6d401e0f51a"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"openai-codex-sk4-t6-controverifica","role":"revisore indipendente SK-4 T6","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03596-e401-7856-8e76-568efe8ea87b","correlation_id":"mss-cor-01a03596-e401-7185-a4c4-e127b13b0b97","segment_no":1,"created_at":"2026-08-24T23:04:36+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-sk4-t6-controverifica","actor_type":"agente","role":"revisore indipendente SK-4 T6","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03596-e401-7505-9645-8ecd0659605c","capture_key":"mss-ses-01a03596-e401-7856-8e76-568efe8ea87b/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a03596-e401-7fba-a876-82b05159d3fc","axis":"sistema","subject_record_ids":["mss-rec-01a03596-e401-7406-a95f-b6d401e0f51a"],"delta":"modificato","assertions":[{"rule_id_version":"SK-4/M12/D18@mss-v0.1-wp0.1-freeze-2","trigger_event":"Controverifica indipendente T6 dei bypass B1-B3","decision_or_output_changed":"Confermati: record legacy nuovi non si auto-qualificano dalla vista staged; storico canonicale HEAD resta esente; review usa REPORT_PATH_RE esportata.","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"openai-codex-sk4-t6-controverifica","role":"revisore indipendente SK-4 T6","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03596-e401-7856-8e76-568efe8ea87b","correlation_id":"mss-cor-01a03596-e401-7185-a4c4-e127b13b0b97","segment_no":1,"created_at":"2026-08-24T23:04:36+02:00","finalization":"final","recorded_by":{"actor_id":"openai-codex-sk4-t6-controverifica","actor_type":"agente","role":"revisore indipendente SK-4 T6","agent_runtime":{"provider":"non_applicabile: runtime non riconosciuto dalle variabili whitelisted","model":"gpt-5","runtime":"non_applicabile: runtime non riconosciuto","surface":"non_applicabile: superficie non riconosciuta"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03596-e401-706e-bdee-f45d90ccf380","capture_key":"mss-ses-01a03596-e401-7856-8e76-568efe8ea87b/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a03596-e401-7ac2-893c-21928c65ca92","axis":"output","subject_record_ids":["mss-rec-01a03596-e401-7406-a95f-b6d401e0f51a"],"delta":"creato","assertions":[{"output_id":"controverifica-sk4-t6-24-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/24-08-26/Report-controverifica-sk4-t6-24-08-26.md","recipient":"orchestratore T6 e Matteo","problem_or_job":"decidere se le prove SK-4 soddisfano M12 senza fidarsi del report dell'esecutore","intended_use":"gate indipendente prima della sola firma formale di Matteo","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"docs/Sessioni di lavoro/24-08-26/Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md","authored_by":"codex-gpt-5","verified_by":"codex-gpt-5","acceptance_criterion":"B1-B3 nominati e non vacui, D18 unica regex, controlli e validate:mss:all verdi","verification_or_use_evidence":"report di controverifica e amendment --verify al record sistema dell'esecutore","verification_status":"independently_verified","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["scripts/mss/adapter.mjs","scripts/mss/core.mjs","scripts/mss/review.mjs","docs/MetaSkillSystem/tests/h1/run.mjs","docs/MetaSkillSystem/tests/tools/run.mjs"],"relations_no_double_count":["M12 indipendente del completamento SK-4; non sostituisce la firma formale di Matteo"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"openai-codex-sk4-t6-controverifica","role":"revisore indipendente SK-4 T6","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
