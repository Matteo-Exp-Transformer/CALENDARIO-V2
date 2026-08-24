# Report T2 — mss:review + rifinitura riserva R1 — 24-08-2026

**Modalità:** deep · **Ruolo:** esecutore Cursor/Composer (T2 + patch R1)
**Branch:** `env/test`
**HEAD (inizio seduta):** `9e32365733237744d066e602159800dc88574bb3`
**Esito in una riga:** `mss:review` **PROVATO** (non CHIUSO); riserva busta R1 **ridotta**; gate interni verdi; handoff al revisore M12 famiglia diversa.

## 1. Cappello

- **Cosa è cambiato:** esiste `npm run mss:review` che elenca i fatti della seduta (file, livelli L1–L6, avvisi owner/L5/L6, mancanze capsula/Q) senza scrivere nulla; la busta R1 non finge più di aver «visto» area/outcome dalla chat.
- **Cosa resta:** controverifica `T2` da famiglia diversa (`M12`) prima di CHIUSO; `WP-1` NO-GO; `H-1.3` non PASS pulito.
- **Serve una tua azione:** no per usare l’attrezzo; sì per affidare la controverifica M12 (altra famiglia).

## 2. Cosa è stato fatto

1. Passo 0: branch `env/test`, working tree pulito all’avvio.
2. Lettura mandato: Manuale, Contratto, STRATEGIA §3.2, PLAN §4-bis/§15, report controverifica R1.
3. Implementato `scripts/mss/review.mjs` + `npm run mss:review` (sola lettura).
4. Test nominato `T2 / mss:review — …`: seduta sporca trova owner/L5/L6/capsula assente; seduta pulita `problems.length === 0`.
5. Rifinitura R1: `normalizeR1Judgments` → `area`/`observed_outcome` = `non_osservato`; enum = `R1_MODE_CONSTANTS` documentate (Manuale + Contratto).
6. Aggiornati package.json, Manuale §2, skill ingresso, PLAN a **PROVATO** (non CHIUSO), cruscotto rigenerato.
7. Gate: `test:mss:tools`, `test:mss`, `validate:mss:views`, `validate:mss:all`, `git diff --check`.

## 3. File toccati e perché

| File | Perché |
|---|---|
| `scripts/mss/review.mjs` | attrezzo T2 nuovo |
| `scripts/mss/capsule.mjs` | `R1_MODE_CONSTANTS` + busta onesta |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | test T2 + asserzioni R1 |
| `package.json` | script `mss:review` |
| `MANUALE_OPERATIVO_MSS_V0.md` | §2.4-sexies; R1 busta; tolto da «non implementati» |
| `CONTRATTO_CAPSULA_SESSIONE_V0.md` | nota R1 mode vs chat |
| `METASKILL_SYSTEM_SKILL.md` | elenco attrezzi |
| `PLAN_V0.md` | S3 PROVATO; ottavo ciclo; next = controverifica T2 |
| `CRUSCOTTO_MATTEO_MSS.md` | rigenerato da owner |
| questo report + judgments | atti chiusura |

## 4. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| `npm run test:mss:tools` | exit 0 — 60 test (incluso T2 e R1 aggiornato) |
| `npm run test:mss` | exit 0 — H-1 verde |
| `npm run validate:mss:views` | exit 0 |
| `npm run validate:mss:all` | exit 0 |
| `git diff --check` | exit 0 |
| `npm run mss:review -- --json` | exit 0 — sulla seduta corrente segnala correttamente ⚠️ owner `PLAN_V0` e L5 su `scripts/mss` / tests (fatti, non bug) |

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` | aggiunto `mss:review` nell’elenco attrezzi | allineamento ingresso |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | §2.4-sexies + R1 busta | contratto operativo T2/R1 |
| `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | nota mode R1 | coerenza schema |
| nessuno skill area prodotto (Prenota/QR/…) | — | mandato Meta MSS, nessun tocco `src/` |

## 6. Dati comunicazione

- Prompt: mandato unico in chat (Profilo Meta / T2 + rifinitura R1) — vedi Q1.
- Formula utile: «fatti non giudizi»; PROVATO ≠ CHIUSO finché manca M12 famiglia diversa.
- Automatizzabile: classificazione path + gap report; manuale: giudizio di merito e controverifica.

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali: 1. Correzioni dopo 1ª risposta: 0. Modalità: deep (non alzata oltre).
- Il mandato «niente output extra senza Sì/No» ha tenuto il perimetro stretto (un solo attrezzo + patch R1).

## 8. Lettura dell'agente

`mss:review` chiude il buco «Q2 a parole»: ora c’è una tabella macchina. La rifinitura R1 è piccola ma toglie la falsa impressione che area/outcome venissero dalla chat. CHIUSO resta al revisore di famiglia diversa.

## 9. Derivazione errori

- Nessun errore di mandato: PLAN lasciato a PROVATO, non CHIUSO.
- Nota: toccare `PLAN_V0` fa scattare di proposito ⚠️ owner in `mss:review` — coerente col contratto §3.2.

## 10. Cosa resta per la prossima sessione

1. Controverifica `T2` da **famiglia diversa** da Cursor/Composer (`M12`).
2. Solo il revisore M12 può promuovere S3/T2 a CHIUSO e allineare owner se serve.
3. Non aprire `WP-1`; non dichiarare `H-1.3` PASS pulito.

## 10-bis. Handoff al prossimo agente

**Cosa è vero adesso:** `npm run mss:review` esiste e è sola lettura; test nominato T2 non vacuo; riserva R1 busta ridotta (`non_osservato` + costanti di mode); S3 = **PROVATO**, non CHIUSO.

**Non riaprire:** design di `mss:query` / `mss:move`; verdetto M12 di R1 (solo ridotta la riserva documentata).

**Prossimo task atomico:** controverifica T2 (famiglia ≠ Cursor/Composer): rieseguire test nominato + gate + `mss:review` su fixture sporca/pulita; verdetto PASS/PASS CON RISERVE/FAIL + M12.

**Divieti:** commit/push senza sì Matteo; WP-1; H-1.3 PASS pulito; rewrite record `final`.

## Checklist per Matteo (linguaggio semplice)

1. `npm run mss:review` → stampa tabella file; **non** crea file.
2. Su fixture sporca (test T2): deve trovare owner / L5 / L6 / capsula assente.
3. Su seduta pulita: non inventa problemi.
4. `npm run test:mss:tools` deve restare verde (cerca `T2 / mss:review`).
5. Prossimo passo umano: affidare controverifica a un modello di **altra famiglia**.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica path e revisione o hash al momento della lettura (es. git rev-parse HEAD:<path> o SHA — stesso dato di source_refs[].revision_or_hash in capsula). Per i messaggi di Matteo non contenuti in un file del repo, riportali verbatim.
✅ R1: HEAD inizio `9e32365733237744d066e602159800dc88574bb3`. File letti a HEAD: `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` `318d67faed48d3d7edf2223164b3461421cfd17b`; `MANUALE_OPERATIVO_MSS_V0.md` `842d51c063c46a1caef10a0aeaa0b5946146e782`; `CONTRATTO_CAPSULA_SESSIONE_V0.md` `fddc51d048feb2bb959a8aedb84a13e9f017ecdf`; `PLAN_V0.md` `93bf5d113658c02568f023485dbaa141253b231f`; `STRATEGIA-scheletro-mss-21-08-26.md` `3936b6e3c03e1fe0c24b69a1f845e42a84b028d9`; `Report-controverifica-R1-24-08-26.md` (working tree / HEAD all’apertura). Messaggio Matteo: mandato verbatim «Profilo: Meta / Modalità: deep / T2 + rifinitura riserva R1 …» (intero blocco della user_query di questa chat).

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (controls[]) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output validate:mss o comando equivalente).
✅ R2: Sì — gate §4 rieseguiti exit 0; `validate:mss:all` verde; conteggi test da comando (60 tools), non copiati a memoria.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).
✅ R3: Sì — skill Meta + Manuale + Contratto + PLAN/cruscotto; nessun skill area prodotto.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho dichiarato T2 CHIUSO; non ho fatto controverifica M12; non commit/push; non toccato `src/`/DB; non reinventato query/move; non aperto WP-1.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: Il parser del cruscotto riconosce cicli `M-*` ma lo stato utile di T2 vive in prosa §15 — funziona, però «PROVATO non CHIUSO» resta facile da confondere. Miglioria: etichetta esplicita S3/T2 nel blocco generato oltre alla sola prossima azione.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto — elenco file del mandato + Manuale/Contratto/STRATEGIA §3.2; nessun corpus storico non puntato. Nessun hook di chiusura usato prima di questo report.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03527-2e8e-7405-9c24-3565d5f2a582","correlation_id":"mss-cor-01a03527-2e8e-7564-8835-d98fe6996eae","segment_no":1,"created_at":"2026-08-24T21:02:35+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer","actor_type":"agente","role":"esecutore Cursor T2","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a03527-2e8e-7e14-a1b4-35085f70ebfa","capture_key":"mss-ses-01a03527-2e8e-7405-9c24-3565d5f2a582/1/session_event/1","event":{"event_id":"mss-evt-01a03527-2e8e-77a0-9e95-feb1ae5238a5","event_kind":"session_close","occurred_at":"2026-08-24T21:02:35+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"esecutore Cursor T2","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 9e32365; 11 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/24-08-26/Report-t2-mss-review-24-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/24-08-26/Report-t2-mss-review-24-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"TEST-TOOLS","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"VALIDATE-MSS-ALL","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"DIFF-CHECK","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"9e32365","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"9e32365","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"9e32365","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"9e32365","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"9e32365","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"9e32365","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"package.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"9e32365","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"scripts/mss/capsule.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"9e32365","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03527-2e8e-7405-9c24-3565d5f2a582","correlation_id":"mss-cor-01a03527-2e8e-7564-8835-d98fe6996eae","segment_no":1,"created_at":"2026-08-24T21:02:35+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer","actor_type":"agente","role":"esecutore Cursor T2","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03527-2e8e-728b-8663-5affb3dd5fa3","capture_key":"mss-ses-01a03527-2e8e-7405-9c24-3565d5f2a582/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a03527-2e8e-7dab-a578-0a1288912785","axis":"persona","subject_record_ids":["mss-rec-01a03527-2e8e-7e14-a1b4-35085f70ebfa"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer","role":"esecutore Cursor T2","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03527-2e8e-7405-9c24-3565d5f2a582","correlation_id":"mss-cor-01a03527-2e8e-7564-8835-d98fe6996eae","segment_no":1,"created_at":"2026-08-24T21:02:35+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer","actor_type":"agente","role":"esecutore Cursor T2","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03527-2e8e-7a31-b461-61aafe7b99e7","capture_key":"mss-ses-01a03527-2e8e-7405-9c24-3565d5f2a582/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a03527-2e8e-728d-8893-38ed8d43adeb","axis":"sistema","subject_record_ids":["mss-rec-01a03527-2e8e-7e14-a1b4-35085f70ebfa"],"delta":"modificato","assertions":[{"rule_id_version":"SK-3/T2@mss-v0.1-wp0.1-freeze-2","trigger_event":"Mandato T2 + rifinitura riserva R1 (mss:review sola lettura)","decision_or_output_changed":"npm run mss:review produce fatti L1-L6 senza scrivere; busta R1: area/observed_outcome non_osservato; enum come R1_MODE_CONSTANTS; T2 PROVATO non CHIUSO","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"cursor-composer","role":"esecutore Cursor T2","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03527-2e8e-7405-9c24-3565d5f2a582","correlation_id":"mss-cor-01a03527-2e8e-7564-8835-d98fe6996eae","segment_no":1,"created_at":"2026-08-24T21:02:35+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer","actor_type":"agente","role":"esecutore Cursor T2","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03527-2e8e-7b96-aca4-17e69e12a3c9","capture_key":"mss-ses-01a03527-2e8e-7405-9c24-3565d5f2a582/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a03527-2e8e-7b3f-bb39-aa8143ef3699","axis":"output","subject_record_ids":["mss-rec-01a03527-2e8e-7e14-a1b4-35085f70ebfa"],"delta":"creato","assertions":[{"output_id":"t2-mss-review-24-08-26","primary_type":"processo","canonical_version":"docs/Sessioni di lavoro/24-08-26/Report-t2-mss-review-24-08-26.md","recipient":"Matteo e revisore famiglia diversa (M12)","problem_or_job":"avere un attrezzo che elenca fatti della seduta senza giudizio di merito","intended_use":"controverificare T2 e usare mss:review nelle chiusure successive","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"mandato chat T2 + rifinitura R1","authored_by":"cursor-composer-esecutore-t2","verified_by":"non_osservato","acceptance_criterion":"test T2/mss:review non vacuo + gate MSS verdi + T2 al massimo PROVATO","verification_or_use_evidence":"controlli registrati nella capsula di questo report","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["scripts/mss/review.mjs","scripts/mss/capsule.mjs","docs/MetaSkillSystem/tests/tools/run.mjs","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md"],"relations_no_double_count":["processo attrezzo; il report resta registro; CHIUSO solo dopo M12"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer","role":"esecutore Cursor T2","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
