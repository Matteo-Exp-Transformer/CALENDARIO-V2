# Report E1 — SK-4 perimetro path (B2 + B3)

> Slot: **E1** · Wave 1 · Data: 23-08-26 · Branch: `env/test`  
> Mandato: `Prompt-sk4-e1-perimetro-path-23-08-26.md`

---

## 1. Obiettivo

Chiudere i bypass **B2** (report in sotto-cartella invisibili al pre-commit) e **B3** (prefisso `Verbale-` fuori perimetro) unificando la regola path in un'unica costante esportata da `adapter.mjs` (D18), importata da `git-adapter.mjs` e `query.mjs`.

---

## 2. Gate e baseline (prima del codice)

- `npm run mss:status` → exit 0
- G1, G2, G6 in `PLAN-CURSOR-SK-4-23-08-26.md` §3 → **AUTORIZZATE** (chat 23-08-26)

Conteggio su `HEAD` (`git ls-tree -r --name-only HEAD -- "docs/Sessioni di lavoro"`, file con `Report-` o `Verbale-` nel nome):

| Metrica | Valore |
|---|---|
| File Report/Verbale totali | **424** |
| Con **più di un livello** sotto la cartella-data (es. `10-08-26/SEP-10-archiviazione/Report-…`) | **22** |
| **Non** matchano regex **vecchio** `adapter.mjs` riga 13 (`[^/]+` + solo `Report-`) | **23** |
| Matchano regex **nuovo** approvato G1+G2 | **423** |
| Guadagnati dal nuovo regex (match nuovo ∧ ¬ match vecchio) | **22** |

Nota: il ventitreesimo fuori dal vecchio regex (`Report-tiramisù-removal-db-migration-28-05-26.md`) è a un solo livello ma con carattere non-ASCII nel path; resta fuori anche dal nuovo regex per lo stesso motivo (1 file su 424).

Regex **prima**: `/^docs\/Sessioni di lavoro\/[^/]+\/Report-.*\.md$/i`  
Regex **dopo** (export `REPORT_PATH_RE`): `/^docs\/Sessioni di lavoro\/.+\/(Report|Verbale)-.*\.md$/i`

---

## 3. Diff applicato

| File | Modifica |
|---|---|
| `scripts/mss/adapter.mjs` | `REPORT_PATH_RE` esportata; `isMssRelevantPath()` e uso interno allineati |
| `scripts/mss/git-adapter.mjs` | `collectGitHeadHistory()` filtra con `isMssRelevantPath()` — rimosso duplicato righe 114–116 |
| `scripts/mss/query.mjs` | import `REPORT_PATH_RE`; rimosso regex locale; commento SK-4 E1 |

`git diff --stat` sui tre `.mjs`: **3 file, +12 −22** (solo slot E1).

---

## 4. Prove di chiusura E1

| # | Prova | Esito |
|---|---|---|
| 1 | `node --check scripts/mss/adapter.mjs scripts/mss/git-adapter.mjs scripts/mss/query.mjs` | exit **0** |
| 2 | Conteggio post-modifica: vecchio 401 · nuovo 423 · +22 in perimetro | misurato con script Node su HEAD |
| 3 | `collectGitHeadHistory()`: 424 path report matchano `REPORT_PATH_RE` (467 entry totali incl. fixture/light) | misurato |
| 4 | `npm run mss:query -- --verifica` | exit **0** (smoke, non prova di chiusura pacchetto) |

---

## 5. Cosa NON fatto (perimetro E1)

- **B1** legacy (`core.mjs` / `rules.mjs`) → slot **E2**
- Allineamento **contratto** §2 path → slot **E3**
- Dimostrazioni staged pre-commit B2/B3 → slot **E4**
- Refactor CLI/messaggi `query.mjs` (testo «Report-*.md» in output) → fuori perimetro / SK-11
- `commit` / `push`
- Dichiarazione **SK-4** chiuso (solo Matteo, dopo E4)

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «E1 path leggi docs/Sessioni di lavoro/23-08-26/Prompt-sk4-e1-perimetro-path-23-08-26.md e il resto della documentazione necessaria per avere ben chiaro il contesto e come lavorare. poi procedi»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riaperti i tre `.mjs` e il diff git. Numeri baseline e post-change ricalcolati con script Node su `git ls-tree` e import di `REPORT_PATH_RE` / `collectGitHeadHistory`. `node --check` e `mss:query --verifica` rieseguiti in chiusura con exit 0 reali. `query.mjs` ripristinato da HEAD quando il working tree conteneva diff SK-11 (runtime.mjs): nel diff finale restano solo le righe E1 ammesse.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessuna skill area app (Prenota/Menu/Admin). Aggiornato registro §9 in `PLAN-CURSOR-SK-4-23-08-26.md`. `PLAN_V0.md` §4-bis S4 e contratto §2 → slot E3/E4, non E1. Nessun test automatico richiesto per E1 oltre smoke `mss:query`.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Vedi §5: B1, contratto, integrazione E4, commit, chiusura SK-4. Non ho aggiornato i messaggi utente di `mss:query` che citano ancora «Report-*.md» — vietato refactor CLI in questo slot. Capsula corretta dopo primo FAIL validate:mss (assi mancanti + subject_runtime).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: Attrito: `query.mjs` aveva già diff non commessi di SK-11 nel working tree — rischio di scope creep; ho verificato con `git diff` e ripristinato prima di riapplicare solo E1. Miglioria: nel prompt E1 aggiungere «`git diff scripts/mss/query.mjs` deve mostrare solo import/costante/commenti» come gate esplicito prima del report.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto: mandato E1 + PLAN §3/§5/§9 + file `.mjs` target bastano; non caricato APP_CONTEXT intero come da mandato. Hook stop/pre-commit non ricevuti in questa chat; `npm run mss:status` utile come primo comando.

---

## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-01a02dbe-a4d2-7f02-8794-302ad60e7693","session_id":"mss-ses-01a02dbe-a4d0-7d32-b992-e0b82f46e184","correlation_id":"mss-cor-01a02dbe-a4d2-7adb-9c8e-2dde539c1d46","segment_no":1,"capture_key":"mss-ses-01a02dbe-a4d0-7d32-b992-e0b82f46e184/1/session_event/1","created_at":"2026-08-23T10:35:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-sk4-e1","actor_type":"agente","role":"esecutore E1 SK-4 perimetro path","agent_runtime":{"provider":"Cursor","model":"Composer","runtime":"Cursor Agent","surface":"IDE chat"},"tools_used":["Shell","Read","Write","StrReplace","Grep","git","node","npm"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"workspace 23-08-26","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"SK-4-plan","package_version_or_revision":"23-08-26","source_ref":"docs/Sessioni di lavoro/23-08-26/PLAN-CURSOR-SK-4-23-08-26.md"},{"package_id":"SK-4-e1-mandato","package_version_or_revision":"23-08-26","source_ref":"docs/Sessioni di lavoro/23-08-26/Prompt-sk4-e1-perimetro-path-23-08-26.md"}],"event":{"event_id":"mss-evt-01a02dbf-3c10-7acd-95d5-b3826a032bd3","event_kind":"session_close","occurred_at":"2026-08-23T10:35:00+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"chiudere slot E1 SK-4: unificare regex path B2+B3 in REPORT_PATH_RE","session_type":"deep","capsule_status":"completa","role_key":"esecutore-e1-sk4","area":"MetaSkillSystem / SK-4 / enforcement path","environment":"workspace locale env/test","authorization":{"read":["docs/MetaSkillSystem/**","docs/Sessioni di lavoro/23-08-26/**","scripts/mss/adapter.mjs","scripts/mss/git-adapter.mjs","scripts/mss/query.mjs"],"write":["scripts/mss/adapter.mjs","scripts/mss/git-adapter.mjs","scripts/mss/query.mjs (solo import costante)","docs/Sessioni di lavoro/23-08-26/Report-sk4-e1-*.md","PLAN-CURSOR-SK-4 §9 riga E1"],"forbid":["core.mjs","rules.mjs","CONTRATTO","commit","push","refactor CLI query.mjs","SK-11 runtime.mjs"]},"authorized_outputs":["REPORT_PATH_RE condivisa","mini-report E1","riga E1 COMPLETATO in PLAN"],"route":{"chosen":"mandato Prompt-sk4-e1-perimetro-path-23-08-26.md + D18","alternatives_or_conflicts":"nessuno"},"observed_outcome":"export REPORT_PATH_RE da adapter.mjs con regex G1+G2; git-adapter usa isMssRelevantPath; query.mjs importa costante; +22 report in perimetro vs regex legacy; prove node --check e mss:query smoke verdi","open_items":["E2 legacy B1","E3 contratto","E4 integrazione dimostrazioni staged","messaggi CLI query ancora dicono Report-* only"],"controls":[{"control_id":"E1-NODE-CHECK","criterio":"sintassi valida sui tre file .mjs","esito":"pass","numeratore":3,"denominatore":3,"esecutore":"node --check adapter.mjs git-adapter.mjs query.mjs","evidence_refs":["source-report"]},{"control_id":"E1-PERIMETER-COUNT","criterio":"22 report in sotto-cartella entrano nel nuovo regex","esito":"pass","numeratore":22,"denominatore":22,"esecutore":"script Node su git ls-tree HEAD","evidence_refs":["source-report"]},{"control_id":"E1-QUERY-SMOKE","criterio":"mss:query --verifica eseguibile dopo import adapter","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"npm run mss:query -- --verifica","evidence_refs":["source-report"]},{"control_id":"E1-VALIDATE-OWN","criterio":"capsula del report valida validate:mss","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"npm run validate:mss -- --mode file --file Report-sk4-e1-perimetro-path-23-08-26.md --kind report --require-capsule","evidence_refs":["source-report"]}],"subject_runtime":{"actor_id":"non_applicabile:soggetto documentale","provider":"non_applicabile:soggetto documentale","model":"non_applicabile:soggetto documentale","runtime":"non_applicabile:soggetto documentale","surface":"non_applicabile:soggetto documentale"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["path file","metriche regex","exit code comandi"],"prohibited_content":["docs/_lavoro/"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-plan-sk4","owner_id":"SK-4","uri_or_path":"docs/Sessioni di lavoro/23-08-26/PLAN-CURSOR-SK-4-23-08-26.md","stable_anchor_or_event_id":"§9 E1","revision_or_hash":"working tree","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-report","owner_id":"E1","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-sk4-e1-perimetro-path-23-08-26.md","stable_anchor_or_event_id":"§1-§5","revision_or_hash":"working tree","sensitivity":"internal"},{"ref_id":"source-mandato","owner_id":"E1","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Prompt-sk4-e1-perimetro-path-23-08-26.md","stable_anchor_or_event_id":"mandato E1","revision_or_hash":"working tree","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-01a02dbf-ddac-798e-bb31-362f5c1a009c","session_id":"mss-ses-01a02dbe-a4d0-7d32-b992-e0b82f46e184","correlation_id":"mss-cor-01a02dbe-a4d2-7adb-9c8e-2dde539c1d46","segment_no":1,"capture_key":"mss-ses-01a02dbe-a4d0-7d32-b992-e0b82f46e184/1/annotation/1","created_at":"2026-08-23T10:35:01+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-sk4-e1","actor_type":"agente","role":"esecutore E1 SK-4 perimetro path","agent_runtime":{"provider":"Cursor","model":"Composer","runtime":"Cursor Agent","surface":"IDE chat"},"tools_used":["Shell","Read","Write","StrReplace","Grep","git","node","npm"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"annotation":{"annotation_id":"mss-ann-01a02dbf-ddae-7277-8975-e33aefbf4775","axis":"sistema","subject_record_ids":["mss-rec-01a02dbe-a4d2-7f02-8794-302ad60e7693"],"delta":"modificato","assertions":[{"rule_id_version":"SK-4-E1@mss.session/0.1.1","trigger_event":"bypass B2+B3: regex path duplicata e stretta in adapter/git-adapter","decision_or_output_changed":"REPORT_PATH_RE esportata da adapter.mjs; collectGitHeadHistory usa isMssRelevantPath; query.mjs importa costante (D18)","G":1,"O":1,"E":1}],"asserted_by":{"actor_id":"cursor-composer-sk4-e1","role":"esecutore E1","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-mandato","evidence_refs":["source-report"],"notes":"conteggio +22 report misurato su HEAD"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-01a02dbf-ddad-7393-ab90-6408c68991d8","session_id":"mss-ses-01a02dbe-a4d0-7d32-b992-e0b82f46e184","correlation_id":"mss-cor-01a02dbe-a4d2-7adb-9c8e-2dde539c1d46","segment_no":1,"capture_key":"mss-ses-01a02dbe-a4d0-7d32-b992-e0b82f46e184/1/annotation/2","created_at":"2026-08-23T10:35:02+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-sk4-e1","actor_type":"agente","role":"esecutore E1 SK-4 perimetro path","agent_runtime":{"provider":"Cursor","model":"Composer","runtime":"Cursor Agent","surface":"IDE chat"},"tools_used":["Shell","Read","Write","StrReplace","Grep","git","node","npm"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"annotation":{"annotation_id":"mss-ann-01a02dbf-ddae-796d-8a76-4c451ac18b08","axis":"output","subject_record_ids":["mss-rec-01a02dbe-a4d2-7f02-8794-302ad60e7693"],"delta":"creato","assertions":[{"output_id":"sk4-e1-report-path-re","primary_type":"prodotto","canonical_version":"scripts/mss/adapter.mjs + git-adapter.mjs + query.mjs (import minimo)","recipient":"coordinatore SK-4 / slot E4","problem_or_job":"eliminare bypass perimetro path pre-commit e lettura HEAD","intended_use":"base per integrazione E4 e dimostrazioni B2/B3","conceived_by":"PLAN SK-4","decided_by":"Matteo G1+G2","directed_by":"Prompt-sk4-e1-perimetro-path-23-08-26.md","authored_by":"cursor-composer-sk4-e1","verified_by":"comandi E1-NODE-CHECK E1-QUERY-SMOKE E1-PERIMETER-COUNT","acceptance_criterion":"tre file .mjs diff minimi; +22 path; node --check verde","verification_or_use_evidence":"§4 report","verification_status":"self_report","owner_ref":"owner-plan-sk4","privacy_release":"requires_confirmation","support_files":["scripts/mss/adapter.mjs","scripts/mss/git-adapter.mjs","scripts/mss/query.mjs"],"relations_no_double_count":["slot E1 wave 1"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-composer-sk4-e1","role":"esecutore E1","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-mandato","evidence_refs":["source-report"],"notes":"quinto gate fail per scelta: nessun revisore indipendente su E1"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-01a02dbf-ddae-7678-b39d-926f8daf4a3a","session_id":"mss-ses-01a02dbe-a4d0-7d32-b992-e0b82f46e184","correlation_id":"mss-cor-01a02dbe-a4d2-7adb-9c8e-2dde539c1d46","segment_no":1,"capture_key":"mss-ses-01a02dbe-a4d0-7d32-b992-e0b82f46e184/1/annotation/3","created_at":"2026-08-23T10:35:03+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-sk4-e1","actor_type":"agente","role":"esecutore E1 SK-4 perimetro path","agent_runtime":{"provider":"Cursor","model":"Composer","runtime":"Cursor Agent","surface":"IDE chat"},"tools_used":["Shell","Read","Write","StrReplace","Grep","git","node","npm"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"}],"annotation":{"annotation_id":"mss-ann-01a02dbf-ddae-7dd7-807a-141f95099295","axis":"persona","subject_record_ids":["mss-rec-01a02dbe-a4d2-7f02-8794-302ad60e7693"],"delta":"nessuno","assertions":[{"signal":"Matteo ha delegato E1 con mandato scritto e autorizzato G1-G6 in batch","actor":"Matteo","assistance":"spontaneo","origin":"naturale","source_ref":"source-mandato","effect":"esecuzione autonoma sul prompt senza correzione di rotta","evidence_state":"observed"}],"asserted_by":{"actor_id":"cursor-composer-sk4-e1","role":"esecutore E1","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"source-mandato","evidence_refs":["source-mandato"],"notes":"segnale su una seduta, non valutazione"}}}
```
