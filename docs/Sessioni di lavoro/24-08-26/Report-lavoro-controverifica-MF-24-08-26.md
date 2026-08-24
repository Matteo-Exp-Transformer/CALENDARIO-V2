# Report — lavoro svolto: controverifica `M-F` — 24-08-2026

**Modalità:** deep · **Ruolo:** revisore Cursor (Meta)
**Branch:** `env/test` · **HEAD:** `6a76f5759a36ec170a45242f5c876d2db64a5a5b`
**Atto tecnico di prova:** [`Report-controverifica-MF-24-08-26.md`](Report-controverifica-MF-24-08-26.md)
**Consegna esecutore:** [`Report-mf-viste-generate-24-08-26.md`](Report-mf-viste-generate-24-08-26.md)

## 1. Cappello

- **Cosa è cambiato:** il cruscotto MSS si aggiorna dal piano e la macchina ferma le copie vecchie; `M-F` è **CHIUSO**.
- **Cosa resta:** aprire `M-E` (`mss:move`, poi `mss:review`); `R1` raccomandato ma non aperto.
- **Serve una tua azione:** no per chiudere `M-F`. Per continuare: incolla il prompt `M-E` in una chat nuova (Opus esecutore).

## 2. Cosa è stato fatto (in ordine)

1. Controverifica a freddo di `M-F` (senza fidarsi del report Codex).
2. Rieseguiti i cancelli: viste, suite tools, suite mss, `validate:mss:all`, report M-F, `git diff --check` — tutti verdi.
3. Letto il test `V1`: asserzioni non vacue (owner→rosso, generate→verde, fake manuale→resta rosso).
4. Riprodotti gli stessi casi a mano (repo minima + tree reale).
5. Verdetto `M12` soddisfatto → aggiornato `PLAN_V0` (`M-F` CHIUSO, prossimo `M-E` senza aprirlo).
6. Allineato il parser delle viste all’ultimo ciclo (altrimenti dopo la chiusura `generate` restava rosso).
7. Rigenerato il cruscotto solo con `npm run generate:mss:views`.
8. Chiusa la controverifica con capsula e `validate:mss` OK.

## 3. File toccati e perché

| File | Perché |
|---|---|
| `scripts/mss/views.mjs` | generatore + parser ultimo ciclo / etichetta prossima azione |
| `package.json` | `generate`/`validate:mss:views` dentro `validate:mss:all` (già da M-F) |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | test `V1` rafforzato |
| `docs/MetaSkillSystem/PLAN_V0.md` | owner: M-F CHIUSO → prossimo M-E |
| `docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md` | solo via generate |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | già allineato dall’esecutore M-F |
| atti `Report-controverifica-MF-*` + judgments | prova indipendente |

## 4. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| `npm run validate:mss:views` | exit 0 |
| `npm run test:mss:tools` (include V1) | exit 0 |
| `npm run test:mss` | exit 0 |
| `npm run validate:mss:all` | exit 0 |
| `validate:mss` su report M-F e su controverifica MF | OK |
| `git diff --check` | exit 0 |

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `PLAN_V0.md` | stato M-F / prossimo M-E | owner SYS-1 |
| `CRUSCOTTO_MATTEO_MSS.md` | via generate | vista Matteo |
| `MANUALE_OPERATIVO_MSS_V0.md` | nessuno in questa seduta | già fatto in M-F esecutore |
| nessuno skill Prenota/QR/Admin | — | fuori perimetro Meta |

## 6. Dati comunicazione

- Frasi di Matteo: mandato Meta deep controverifica M-F; poi «fai report lavoro svolto, poi prepara prompt per proseguire con m-e».
- Formato che ha funzionato: verdetto in una riga + handoff chiaro (M-E / non R1 / non WP-1).
- Automatizzabile: gate e generate viste. Non automatizzabile: aprire M-E (scelta di avvio chat).

### Regia di Matteo

| Campo | Valore |
|---|---|
| Opzioni offerte → scelta | non applicabile (mandato unico) |
| Vincoli aggiunti da lui | famiglia diversa da Codex; non aprire M-E/R1 in controverifica; niente H-1.3 PASS pulito |
| Criterio: prima o dopo? | prima (nel mandato) |
| Cosa NON ha chiesto | commit/push |
| Correzioni direzione + materia | nessuna |

## 7. Analisi flusso prompt

- Prompt sostanziali: 2 (mandato controverifica; chiusura+prompt M-E).
- Correzioni dopo 1ª risposta: 0.
- Seduta deep, non alzata in corso.
- Efficace: perimetro stretto + M12 esplicito. Da replicare.
- Atto tecnico di prova con capsula già validata: [`Report-controverifica-MF-24-08-26.md`](Report-controverifica-MF-24-08-26.md).

## 8. Lettura dell’agente

- **Impressioni:** il protocollo M12 ha funzionato: senza famiglia diversa M-F restava solo PROVATO.
- **Difficoltà:** il parser vista era agganciato a «prossima = M-F»; chiudere M-F senza aggiornarlo rompeva generate. Risolto allargando il parser all’ultimo ciclo + etichetta.
- **Migliorie (dato, non patch):** ogni vista deve leggere stato corrente dall’owner, non una stringa di mandato congelata.

## 9. Derivazione errori

| Evento | Classe | Evitabile come |
|---|---|---|
| Parser agganciato al mandato M-F | vincolo strutturale / debito di design della prima vista | progettare parser «ultimo ciclo» già in M-F esecutore |
| `--verify` su record M-F untracked → orphan | vincolo strutturale | verificare solo dopo commit in HEAD; non allentare il validator |

## 10. Cosa resta

- **Prossimo task:** `M-E` — `T1` `mss:move` (R6 a zero), poi `T2` `mss:review`.
- Prompt pronto: [`Prompt-mandato-ME-attrezzi-mancanti-24-08-26.md`](Prompt-mandato-ME-attrezzi-mancanti-24-08-26.md).
- `R1` raccomandato ma **non** nel mandato M-E.
- `WP-1` NO-GO · `H-1.3` PASS_CON_RISERVE · niente commit finché non lo chiedi.

## 10-bis. Handoff al prossimo agente

**Cosa è vero adesso:** `M-G` e `M-F` CHIUSI sotto M12; cruscotto generato da `PLAN_V0`; `validate:mss:views` nel cancello globale; working tree sporco (lavoro M-G/M-F non ancora committato).

**Prossimo task atomico:** implementare `mss:move` (`T1`/`SK-9`/`R6`) con prova misurata contro il costo ~1 741 righe del move manuale; test che nomina `T1`/`R6`; un report + una capsula; **non** aprire `T2` nello stesso giro se `T1` non è PROVATO.

**Non riaprire:** WP-1, H-1.3 PASS pulito, R1 come mandato, generate ROADMAP/HANDOFF, move «a mano» di file vivi finché l’attrezzo non esiste (l’attrezzo *è* il move).

**Owner stato:** `PLAN_V0.md` §15. Vista: solo via `generate:mss:views`.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: path e revisione/hash; messaggi Matteo non in file, verbatim.
✅ R1: mandato vivo in chat (controverifica M-F) + skill `METASKILL_SYSTEM_SKILL.md` / `MANUALE_OPERATIVO_MSS_V0.md` / `PROMPT_ORCHESTRATOR_MSS_24-08-26.md` come in [`Report-controverifica-MF-24-08-26.md`](Report-controverifica-MF-24-08-26.md) §10. Messaggio successivo verbatim: «fai report lavoro svolto, poi prepara prompt per proseguire con m-e».

❓ Q2 — Dati = diff reale?
✅ R2: sì — allineato a controverifica MF e a `git status` su `env/test` @ `6a76f57` (tree sporco M-G/M-F). Evidenza: `validate:mss` OK sul report di controverifica.

❓ Q3 — Tabella skill §5 completa?
✅ R3: sì — PLAN + CRUSCOTTO; manuale già allineato in M-F; nessuna skill app toccata.

❓ Q4 — Cosa NON hai fatto?
✅ R4: nessun commit/push; M-E non eseguito (solo prompt preparato); R1 non aperto; nessuna seconda vista.

❓ Q5 — Attrito + miglioria?
✅ R5: come in controverifica — parser agganciato al mandato; miglioria = parser sull’ultimo ciclo (già applicata in chiusura M-F).

❓ Q6 — Contesto & hook?
✅ R6: contesto giusto per Meta; nessun hook di chiusura usato in questo turno di report+prompt.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a034be-c594-77ae-add1-b66b7eaa680d","correlation_id":"mss-cor-01a034be-c594-78b4-993e-42b3a6fa9842","segment_no":1,"created_at":"2026-08-24T19:08:32+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-revisore","actor_type":"agente","role":"revisore","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["mss:capsule"]},"packages_loaded":[{"package_id":"mss","package_version_or_revision":"v0","source_ref":"local"}],"record_type":"session_event","record_id":"mss-rec-01a034be-c594-7b83-963a-a4986c23f068","capture_key":"mss-ses-01a034be-c594-77ae-add1-b66b7eaa680d/1/session_event/1","event":{"event_id":"mss-evt-01a034be-c594-778a-a9bc-53966e223d1c","event_kind":"session_close","occurred_at":"2026-08-24T19:08:32+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"Chiudere la seduta di controverifica M-F con report di lavoro svolto e preparare il prompt per proseguire con M-E.","session_type":"deep","capsule_status":"completa","role_key":"revisore-cursor-mss-chiusura","area":"MetaSkillSystem / chiusura M-F + prompt M-E","environment":"repo locale CalendarBackup-v2 su env/test; nessuna operazione Supabase","authorization":{"read":["docs/MetaSkillSystem/","docs/Sessioni di lavoro/24-08-26/","docs/FOLLOW_UP.md"],"write":["docs/Sessioni di lavoro/24-08-26/","docs/FOLLOW_UP.md"],"forbid":["src/","database","migrazioni","commit","push","esecuzione M-E","apertura R1","H-1.3 PASS pulito"]},"authorized_outputs":["report lavoro svolto","prompt mandato M-E","riga FOLLOW_UP"],"route":{"chosen":"report di chiusura che rimanda alla controverifica tecnica già validata; mandato M-E scritto, non eseguito","alternatives_or_conflicts":["duplicare la capsula tecnica nel report di chiusura senza fatti nuovi","eseguire M-E in questa stessa chat"]},"observed_outcome":"Report lavoro e Prompt-mandato-ME scritti; FU-MSS-ME-T1 aperto; M-E non eseguito; capsula di chiusura generata con mss:capsule.","open_items":["esecutore apre M-E col prompt preparato","R1 raccomandato ma non aperto","WP-1 NO-GO","H-1.3 PASS_CON_RISERVE"],"controls":[{"control_id":"VIEWS","criterio":"npm run validate:mss:views (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:views (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"MF-REVIEW","criterio":"npm run validate:mss -- --mode file --file \"docs/Sessioni di lavoro/24-08-26/Report-controverifica-MF-24-08-26.md\" --kind report --require-capsule (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss -- --mode file --file \"docs/Sessioni di lavoro/24-08-26/Report-controverifica-MF-24-08-26.md\" --kind report --require-capsule (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_applicabile: soggetto non valutato","provider":"non_applicabile: seduta tecnica","model":"non_applicabile: seduta tecnica","runtime":"non_applicabile: seduta tecnica","surface":"non_applicabile: seduta tecnica"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["path repo","identificatori M-F M-E","hash HEAD"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-plan-v0","owner_id":"MSS","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"sezione 15 / M-F CHIUSO prossimo M-E","revision_or_hash":"working tree 24-08-2026","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-mf-review","owner_id":"MSS","uri_or_path":"docs/Sessioni di lavoro/24-08-26/Report-controverifica-MF-24-08-26.md","stable_anchor_or_event_id":"controverifica M12","revision_or_hash":"working tree 24-08-2026","sensitivity":"internal"},{"ref_id":"source-me-prompt","owner_id":"MSS","uri_or_path":"docs/Sessioni di lavoro/24-08-26/Prompt-mandato-ME-attrezzi-mancanti-24-08-26.md","stable_anchor_or_event_id":"mandato M-E","revision_or_hash":"working tree 24-08-2026","sensitivity":"internal"},{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/FOLLOW_UP.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"package.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"6a76f57","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a034be-c594-77ae-add1-b66b7eaa680d","correlation_id":"mss-cor-01a034be-c594-78b4-993e-42b3a6fa9842","segment_no":1,"created_at":"2026-08-24T19:08:32+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-revisore","actor_type":"agente","role":"revisore","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["mss:capsule"]},"packages_loaded":[{"package_id":"mss","package_version_or_revision":"v0","source_ref":"local"}],"record_type":"annotation","record_id":"mss-rec-01a034be-c594-74ff-ab49-8ff466d1230d","capture_key":"mss-ses-01a034be-c594-77ae-add1-b66b7eaa680d/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a034be-c594-775b-9ce6-658775317126","axis":"persona","subject_record_ids":["mss-rec-01a034be-c594-7b83-963a-a4986c23f068"],"delta":"nessuno","assertions":[{"signal":"nessuna nuova osservazione Persona: chiusura documentale e preparazione prompt","actor":"non_applicabile: soggetto non valutato","assistance":"spontaneo","origin":"naturale","source_ref":"source-mf-review","effect":"nessuna promozione o inferenza Persona","evidence_state":"not_applicable"}],"asserted_by":{"actor_id":"cursor-composer-revisore","role":"revisore","basis":"direct_observation"},"verification":{"status":"not_applicable","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"source-mf-review","evidence_refs":[],"notes":"seduta tecnica"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a034be-c594-77ae-add1-b66b7eaa680d","correlation_id":"mss-cor-01a034be-c594-78b4-993e-42b3a6fa9842","segment_no":1,"created_at":"2026-08-24T19:08:32+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-revisore","actor_type":"agente","role":"revisore","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["mss:capsule"]},"packages_loaded":[{"package_id":"mss","package_version_or_revision":"v0","source_ref":"local"}],"record_type":"annotation","record_id":"mss-rec-01a034be-c594-713a-83a7-2bae95a1152d","capture_key":"mss-ses-01a034be-c594-77ae-add1-b66b7eaa680d/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a034be-c594-7617-82f6-ba74f0affd31","axis":"sistema","subject_record_ids":["mss-rec-01a034be-c594-7b83-963a-a4986c23f068"],"delta":"nessuno","assertions":[{"rule_id_version":"M-F/già-CHIUSO","trigger_event":"richiesta report lavoro + prompt M-E dopo controverifica già chiusa","decision_or_output_changed":"nessun cambiamento di motore: solo atti di chiusura e mandato successivo","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"cursor-composer-revisore","role":"revisore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-plan-v0","evidence_refs":["source-mf-review"],"notes":"stato M-F già CHIUSO nell'owner; questa seduta non lo ricalcola"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a034be-c594-77ae-add1-b66b7eaa680d","correlation_id":"mss-cor-01a034be-c594-78b4-993e-42b3a6fa9842","segment_no":1,"created_at":"2026-08-24T19:08:32+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-revisore","actor_type":"agente","role":"revisore","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["mss:capsule"]},"packages_loaded":[{"package_id":"mss","package_version_or_revision":"v0","source_ref":"local"}],"record_type":"annotation","record_id":"mss-rec-01a034be-c594-7f8d-bd48-7f6eb80914c3","capture_key":"mss-ses-01a034be-c594-77ae-add1-b66b7eaa680d/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a034be-c594-7338-80fb-b7c8dd2e0253","axis":"output","subject_record_ids":["mss-rec-01a034be-c594-7b83-963a-a4986c23f068"],"delta":"creato","assertions":[{"output_id":"report-lavoro-e-prompt-me-24-08-26","primary_type":"prova","canonical_version":"working tree 24-08-2026","recipient":"Matteo e prossimo esecutore M-E","problem_or_job":"chiudere documentalmente la seduta e consegnare un mandato M-E auto-contenuto","intended_use":"incollare il prompt M-E in una chat nuova senza rieseguire M-F","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"Matteo","authored_by":"cursor-composer-revisore","verified_by":"non_osservato: validazione report di chiusura in questa correzione","acceptance_criterion":"validate:mss sul report di lavoro exit 0 con capsula; prompt M-E presente su disco","verification_or_use_evidence":"npm run validate:mss sul report dopo mss:capsule","verification_status":"self_report","owner_ref":"owner-plan-v0","privacy_release":"internal","support_files":["docs/Sessioni di lavoro/24-08-26/Report-lavoro-controverifica-MF-24-08-26.md","docs/Sessioni di lavoro/24-08-26/Prompt-mandato-ME-attrezzi-mancanti-24-08-26.md"],"relations_no_double_count":[],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-composer-revisore","role":"revisore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-me-prompt","evidence_refs":["source-mf-review"],"notes":"output documentale di chiusura"}}}
```
