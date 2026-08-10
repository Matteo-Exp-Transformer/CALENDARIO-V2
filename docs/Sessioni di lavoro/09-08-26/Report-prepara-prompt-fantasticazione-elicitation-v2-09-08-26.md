# Report — prepara-prompt: fantasticazione guidata + elicitation professionale v2

**Data:** 09-08-26 · **Modalità:** deep · **Tipo:** prepara-prompt (binario crescita/valutazione) + disegno collaudo MSS ombra
**Stato:** prompt pronto da incollare · **nessun commit/push** · seduta di fantasticazione **non ancora eseguita**.

## 1. Cappello

- **Cosa è cambiato:** hai un prompt esecutore v2 basato su metodi professionali testati (PEACE + Cognitive Interview + McAdams + 5P non clinica + Challenge controllata), più un registro privato dei metodi così puoi provarne altri senza perdere la traccia.
- **Cosa resta:** eseguire il prompt in **nuova chat**; confrontare l’esito con la seduta analoga S-A (roleplay-voce).
- **Serve una tua azione:** sì — aprire nuova chat, incollare il prompt, dire «parti» dopo la FASE PIANO.

## 2. Cosa è stato fatto

1. Caricata skill prepara-prompt; branch `env/test` ok; instradamento binario valutazione (non app).
2. Raccolte basi professionali da fonti pubbliche (PEACE UK; Cognitive Interview; McAdams Actor/Agent/Author; 5P Weerasekera adattata non clinica; falsificazione person-specific).
3. Scelta configurazione **più completa** (non la più soft): **CFG-01** — vedi § strategia sotto.
4. Collegamento esplicito alla seduta analoga precedente (S-A lettura/roleplay).
5. Creato registro metodi privato + questo report; aggiornato `SESSION_LOG`.

## 3. File toccati e perché

| File | Perché |
|---|---|
| `docs/_lavoro/.../Analisi/REGISTRO_METODI_ELICITATION_IDIOgrafica.md` | **Nuovo** — catalogo CFG-00…CFG-06 (gitignored) |
| `docs/Sessioni di lavoro/09-08-26/Report-prepara-prompt-fantasticazione-elicitation-v2-09-08-26.md` | Questo report + capsula |
| `docs/SESSION_LOG.md` | 1 riga indice + `event_id` |

## 4. Test eseguiti e risultato

- Nessun `npm run validate` applicativo (nessun codice).
- Capsula: `npm run validate:mss -- --mode file --file …/Report-prepara-prompt-fantasticazione-elicitation-v2-09-08-26.md --kind report --require-capsule` → **ok: true**.

## 5. File di skill aggiornati

| file | modifica | perché |
|---|---|---|
| nessuno | — | prepara-prompt non riforma skill; registro metodi vive in `_lavoro` |

## 6. Dati comunicazione

- **Frasi/richieste:** «riadatta questo prompt» · «materiale professionale da internet» · «prova configurazione migliore…» · «tieni traccia… collega report precedente» · «provarne altre senza perdere metodi».
- **Formato che ha funzionato:** domande bloccanti A/B/C → poi «scegli tu la migliore» → prompt intero + registro.
- **Automatizzabile:** template FASE PIANO + checklist PEACE · **manuale:** scelta CFG successiva e giudizio su quanto dello spunto è “tu”.

### Strategia scelta (CFG-01) — traccia operativa

| Asse | Scelta | Perché |
|---|---|---|
| Bilanciamento | **50/50** valutazione soggetto / collaudo metodo MSS | doppio scopo dichiarato; sezione «prove del metodo» obbligatoria nello spunto |
| Chiave primaria | **McAdams** Attore/Agente/Autore | personalità idiografica non clinica; già usata in S-A |
| Chiave secondaria | **5P** adattata professionale | organizzazione Presenting→Protective senza diagnosi |
| Intervista | **PEACE** | standard UK non coercitivo; Planning→Engage→Account→Closure→Evaluation |
| Richiamo | **Cognitive Interview** (semplificato) | racconto libero, contesto, “racconta tutto”, no interruzioni prima onda |
| Challenge | **Sì, post-account** | confronta solo incoerenze interne; anti-Reid |
| Scenari | **4–6** (≥1 pressione, ≥1 visione/struttura) | più materiale di CFG-00 senza interrogazione formale |
| Spunto S-A | ipotesi da **testare**, non verità | evita di fossilizzare «trazione→visione→struttura» |

### Collegamento seduta analoga (S-A)

| Voce | S-A (già fatta) | S-B (questa) |
|---|---|---|
| Report | [Report-lettura-idiografica-capsula-mss-09-08-26.md](./Report-lettura-idiografica-capsula-mss-09-08-26.md) | questo file |
| Evento | `mss-evt-019fe834-f430-7d18-b1ed-67391fa4fc40` | `mss-evt-019fe83e-5e27-74f5-a63f-3491785b4597` |
| Metodo | CFG-00 roleplay-voce | CFG-01 PEACE+CI+McAdams+5P |
| Artefatto soggetto | `SPUNTO_Trazione-visione-struttura-09-08-26.md` | nuovo spunto a fine seduta esecutore (non sovrascrivere senza chiedere) |
| Focus | “parlare come Matteo” | “far emergere da Matteo” |

### Regia di Matteo (campi fissi)

| Campo | Valore |
|---|---|
| Cosa ha chiesto | Prompt rielaborato + config migliore + traccia metodi + link report analogo |
| Cosa NON ha chiesto | Esecuzione della fantasticazione in questa chat; commit; apertura WP-1 ufficiale; C8 |
| Correzioni | Dopo le 4 domande bloccanti: «prova configurazione migliore…» |
| Verdetto | Preparazione OK · esecuzione rimandata a nuova chat |

## Capsula MetaSkillSystem

Privacy: classificazione `personal`/`internal`. Il registro metodi dettaglio vive in `_lavoro`; qui meta di predisposizione. Nessuna promozione Persona. Output = registro + prompt predisposto, **not_eligible** come prodotto.

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-019fe83e-5e27-79ff-aeda-6a75f8825fff","session_id":"mss-ses-019fe83e-5e25-7930-b108-2f74daff2a3d","correlation_id":"mss-cor-019fe83e-5e27-7594-bff4-6628b53081b1","segment_no":1,"capture_key":"mss-ses-019fe83e-5e25-7930-b108-2f74daff2a3d/1/session_event/1","created_at":"2026-08-09T22:40:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-45","actor_type":"agente","role":"prepara_prompt_and_capture","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"IDE chat"},"tools_used":["Read","Write","WebSearch","Shell","Grep"]},"packages_loaded":[{"package_id":"prepara-prompt","package_version_or_revision":"working-tree","source_ref":"docs/PREPARA_PROMPT_SKILL.md"},{"package_id":"assessment-compass","package_version_or_revision":"private-working-copy","source_ref":"docs/_lavoro/Per matteo/Valutazione Personale/00_BUSSOLA_VALUTAZIONE.md"},{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"session-close","package_version_or_revision":"working-tree","source_ref":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md"}],"event":{"event_id":"mss-evt-019fe83e-5e27-74f5-a63f-3491785b4597","event_kind":"session_close","occurred_at":"2026-08-09T22:40:00+02:00","continues_record_id":"nessuno","causation_record_id":"mss-rec-019fe834-f430-7e23-b3d6-8dc0e2a711b4","intent_user":"riadattare prompt fantasticazione con metodi professionali testati; scegliere config migliore; tracciare strategia e collegare report lettura idiografica precedente","session_type":"meta","capsule_status":"completa","role_key":"prepara_prompt + tester_MSS_ombra_design","area":"Valutazione Personale; MetaSkillSystem shadow design","environment":"repository locale CalendarBackup-v2; nessun DB","authorization":{"read":["Bussola","handoff","spunto S-A","contratto MSS","PLAN_V0","PREPARA_PROMPT","fonti metodo PEACE CI McAdams 5P"],"write":["registro metodi _lavoro","report sessione","SESSION_LOG","capsula","prompt in chat"],"forbid":["commit/push","esecuzione fantasticazione in questa chat","aprire WP-1 ufficiale","C8","INT_00 rewrite","promozione livelli Persona","diagnosi"]},"authorized_outputs":["prompt copia-incolla","registro metodi privato","report","capsula final","riga SESSION_LOG"],"route":{"chosen":"prepara-prompt + Bussola 14b constraints + CFG-01 PEACE/CI/McAdams/5P","alternatives_or_conflicts":"nessuno"},"observed_outcome":"CFG-01 documentata; prompt v2 consegnato; registro metodi creato; collegato a S-A event 019fe834; WP-1 non aperto","open_items":["eseguire CFG-01 in nuova chat","eventuale CFG-02 soft se troppo duro","non fondere spunto senza mandato"],"controls":"nessuno","subject_runtime":{"actor_id":"cursor-grok-45","provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"IDE chat"},"privacy":{"classification":"personal","capture_basis":"user_request","allowed_content":["meta strategia CFG","ref registro _lavoro","link report S-A","G/O/E sistema"],"prohibited_content":["diagnosi","dettaglio fantasticherie non ancora raccolte","citazione §D/§E idiografica verso terzi"],"redactions":["basi professionali citate per nome metodo nel report; dettaglio registro in _lavoro"],"external_release":"forbidden","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-registro-metodi","owner_id":"matteo-analisi-metodi","uri_or_path":"docs/_lavoro/Per matteo/Valutazione Personale/Analisi/REGISTRO_METODI_ELICITATION_IDIOgrafica.md","stable_anchor_or_event_id":"CFG-01-pronta","revision_or_hash":"2026-08-09","sensitivity":"personal"},{"ref_id":"owner-report","owner_id":"session-report","uri_or_path":"docs/Sessioni di lavoro/09-08-26/Report-prepara-prompt-fantasticazione-elicitation-v2-09-08-26.md","stable_anchor_or_event_id":"report-prepara-cfg01","revision_or_hash":"2026-08-09","sensitivity":"internal"},{"ref_id":"owner-report-sa","owner_id":"session-report-sa","uri_or_path":"docs/Sessioni di lavoro/09-08-26/Report-lettura-idiografica-capsula-mss-09-08-26.md","stable_anchor_or_event_id":"mss-evt-019fe834-f430-7d18-b1ed-67391fa4fc40","revision_or_hash":"2026-08-09","sensitivity":"internal"},{"ref_id":"owner-plan","owner_id":"SYS-1-masterplan","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"WP-1-non-iniziato","revision_or_hash":"mss-v0.1-wp0.1-freeze-2","sensitivity":"internal"},{"ref_id":"owner-contract","owner_id":"mss-contract-v0.1","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"schema-msssession011","revision_or_hash":"mss-v0.1-wp0.1-freeze-2","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-user-chat","owner_id":"conversation","uri_or_path":"conversation:this-session","stable_anchor_or_event_id":"prepara-cfg01","revision_or_hash":"2026-08-09","sensitivity":"personal"},{"ref_id":"source-spunto-sa","owner_id":"matteo-analisi-spunto","uri_or_path":"docs/_lavoro/Per matteo/Valutazione Personale/Analisi/SPUNTO_Trazione-visione-struttura-09-08-26.md","stable_anchor_or_event_id":"spunto-trazione-09-08-26","revision_or_hash":"2026-08-09","sensitivity":"personal"},{"ref_id":"source-registro-metodi","owner_id":"matteo-analisi-metodi","uri_or_path":"docs/_lavoro/Per matteo/Valutazione Personale/Analisi/REGISTRO_METODI_ELICITATION_IDIOgrafica.md","stable_anchor_or_event_id":"CFG-01-e-catena-SA","revision_or_hash":"2026-08-09","sensitivity":"personal"},{"ref_id":"source-report-sa","owner_id":"session-report-sa","uri_or_path":"docs/Sessioni di lavoro/09-08-26/Report-lettura-idiografica-capsula-mss-09-08-26.md","stable_anchor_or_event_id":"mss-evt-019fe834-f430-7d18-b1ed-67391fa4fc40","revision_or_hash":"2026-08-09","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fe83e-5e27-7115-879a-dc1e4b1763e7","session_id":"mss-ses-019fe83e-5e25-7930-b108-2f74daff2a3d","correlation_id":"mss-cor-019fe83e-5e27-7594-bff4-6628b53081b1","segment_no":1,"capture_key":"mss-ses-019fe83e-5e25-7930-b108-2f74daff2a3d/1/annotation/1","created_at":"2026-08-09T22:40:01+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-45","actor_type":"agente","role":"prepara_prompt_and_capture","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"IDE chat"},"tools_used":["Write"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fe83e-5e27-7256-8359-e6f5765ed485","axis":"persona","subject_record_ids":["mss-rec-019fe83e-5e27-79ff-aeda-6a75f8825fff"],"delta":"nessuno","assertions":[{"signal":"non_osservato","actor":"matteo","assistance":"non_applicabile:prepara_only","origin":"naturale","source_ref":"source-user-chat","effect":"nessuno:predisposizione_metodo_senza_nuova_autodescrizione","evidence_state":"not_applicable"}],"asserted_by":{"actor_id":"cursor-grok-45","role":"prepara_prompt_and_capture","basis":"direct_observation"},"verification":{"status":"not_applicable","verified_by":[],"verified_at":"non_applicabile:prepara_only","criterion_ref":"non_applicabile:no_asse2_gate","evidence_refs":["source-user-chat"],"notes":"questa chat predispone il metodo; non raccoglie nuovo self_report di contenuto; nessuna promozione"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fe83e-5e27-7b96-b478-1b966aef3d01","session_id":"mss-ses-019fe83e-5e25-7930-b108-2f74daff2a3d","correlation_id":"mss-cor-019fe83e-5e27-7594-bff4-6628b53081b1","segment_no":1,"capture_key":"mss-ses-019fe83e-5e25-7930-b108-2f74daff2a3d/1/annotation/2","created_at":"2026-08-09T22:40:02+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-45","actor_type":"agente","role":"prepara_prompt_and_capture","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"IDE chat"},"tools_used":["Write"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fe83e-5e27-7544-9d58-b74bf0f65d41","axis":"sistema","subject_record_ids":["mss-rec-019fe83e-5e27-79ff-aeda-6a75f8825fff"],"delta":"non_osservato_contrattuale -> disegnato_protocollo_CFG01_ombra; registro_metodi_creato","assertions":[{"rule_id_version":"PREPARA_PROMPT + Bussola14b + mss.session/0.1.1 + PLAN_V0 ombra","trigger_event":"richiesta_riadattamento_prompt_e_traccia_metodi","decision_or_output_changed":"CFG-01 documentata; WP-1 non aperto; causation a capsula S-A","G":2,"O":1,"E":0}],"asserted_by":{"actor_id":"cursor-grok-45","role":"prepara_prompt_and_capture","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:shadow_design","criterion_ref":"owner-contract","evidence_refs":["owner-contract","owner-registro-metodi","owner-report-sa"],"notes":"ombra: E=0; O=predisposizione osservata in chat; efficacia CFG-01 da misurare in esecuzione"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-019fe83e-5e27-79f7-93c1-d0b0589971d4","session_id":"mss-ses-019fe83e-5e25-7930-b108-2f74daff2a3d","correlation_id":"mss-cor-019fe83e-5e27-7594-bff4-6628b53081b1","segment_no":1,"capture_key":"mss-ses-019fe83e-5e25-7930-b108-2f74daff2a3d/1/annotation/3","created_at":"2026-08-09T22:40:03+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-45","actor_type":"agente","role":"prepara_prompt_and_capture","agent_runtime":{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"IDE chat"},"tools_used":["Write"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-019fe83e-5e27-7ab8-8f32-9ba8a37b2ef8","axis":"output","subject_record_ids":["mss-rec-019fe83e-5e27-79ff-aeda-6a75f8825fff"],"delta":"creato","assertions":[{"output_id":"PROMPT-CFG01-FANTASTICAZIONE-V2","primary_type":"registro","canonical_version":"2026-08-09-cfg01","recipient":"Matteo (incolla in nuova chat) + agente conduttore successivo","problem_or_job":"predisporre elicitation professionale + collaudo MSS ombra senza perdere metodi","intended_use":"esecuzione in chat successiva; confronto con CFG-00","conceived_by":"Matteo (requisiti) + agente (sintesi metodi)","decided_by":"Matteo: config migliore completa","directed_by":"Matteo prepara prompt","authored_by":"cursor-grok-45","verified_by":"non_osservato","acceptance_criterion":"prompt auto-contenuto; registro CFG; link S-A; WP-1 non auto-aperto","verification_or_use_evidence":"non_osservato:esecuzione CFG-01 non ancora avvenuta","verification_status":"unverified","owner_ref":"owner-registro-metodi","privacy_release":"personal; external_release forbidden","support_files":["report sessione","SESSION_LOG","prompt in chat"],"relations_no_double_count":["un registro metodi; prompt e report sono supporto/vista"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-grok-45","role":"prepara_prompt_and_capture","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:not_executed_yet","criterion_ref":"non_applicabile:quinto_gate_verification_or_use","evidence_refs":["owner-registro-metodi","owner-report"],"notes":"predisposizione non prodotto; quinto gate fail per design finche CFG-01 non e eseguita e usata"}}}
```
## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: **2** (richiesta riadattamento · scelta config migliore + traccia).
- Correzioni dopo 1ª risposta: **1** (salta le 4 domande → “prova la migliore”).
- Follow-up generati: registro metodi + candidati CFG-02…06.
- Modalità alzata: no (già deep).
- Anatomia: la richiesta “completa/professionale” ha chiuso l’ambiguità A/B meglio di un questionario lungo.

## 8. La TUA lettura della sessione

Qui non abbiamo ancora “conosciuto” Matteo meglio: abbiamo **blindato il metodo** con cui lo faremo. Il salto rispetto a S-A è netto: da roleplay-voce a protocollo di elicitation con account libero e challenge controllata. Il rischio è il tono “interrogatorio”: per questo Challenge è posticipata e vietato Reid. Il valore strutturale è il registro CFG: senza quello, ogni prova successiva cancella la precedente.

## 9. Derivazione errori

1. Nessun errore di codice.
2. Rischio residuo: PEACE “Challenge” mal interpretata dall’esecutore → mitigata nel prompt con divieti espliciti.
3. 5P è nata clinica: mitigata con adattamento non diagnostico obbligatorio nel prompt.

## 10. Cosa resta per la prossima sessione

- Eseguire CFG-01 (prompt sotto / in chat).
- Dopo esecuzione: aggiornare registro (stato `eseguita` + 3 bullet esito) e collegare nuovo spunto.
- Se troppo duro → predisporre CFG-02 (senza Challenge).

## 10-bis. Handoff al prossimo agente

**Cosa è vero adesso**

- CFG-01 pronta; CFG-00 eseguita e collegata.
- Spunto S-A resta **non approvato intero**.
- `WP-1` ufficiale resta **NON INIZIATO**.
- Questa chat non ha fantasticato: solo predisposto.

**Non riaprire**

- Non trattare CFG-01 come già collaudata.
- Non aprire C8 / ES-* / WP-1 da soli.
- Non citare §D/§E idiografica verso INT_03/datore.

**Prossimo task atomico**

- Nuova chat: incollare il prompt CFG-01 → FASE PIANO → attendere «parti».

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «riadatta questo prompt prendendo materiale professionale da internet per fare valutazioni professionali psicologiche… metodi molto testati, come interrogatori della polizia, profilassi di psicologi… metodi moderni basati su solide basi… prepara prompt… vincoli… metaskillsystem… situazione delicata… test del metodo oltre che a aiutare mia valutazione» + il prompt grezzo Conduttore/fantasticazione allegato. (2) «prova configurazione migliore, piu completa, piu professsionale e tieni traccia nel report che fai dopo che mi dai il prompt della strategia scelta e collega questo lavoro con il report precedente di lavoro analogo. in modo da poterne provare altre senza perdere tutti i metodi riscontrati.» (3) Hook stop: «la sezione Domande di chiusura… manca l'INTERA sezione 11… Compila TUTTE le risposte mancanti».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato ora: (a) `git diff docs/SESSION_LOG.md` — riga CFG-01 con `event:mss-evt-019fe83e-5e27-74f5-a63f-3491785b4597` presente in testa tabella 2026-08; (b) report untracked esiste al path citato; (c) capsula `event_id` nel JSONL = stesso UUID della riga SESSION_LOG e della tabella S-A/S-B nel report; (d) registro `_lavoro/.../REGISTRO_METODI_ELICITATION_IDIOgrafica.md` esiste (Test-Path True), S-B event_id allineato, CFG-01 stato «pronta»; (e) report S-A path esiste; (f) `validate:mss --require-capsule` → OK. Nessun file `src/` nel diff di questa sessione.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: nessuno skill area prodotto/UI da allineare (prepara-prompt, zero codice). Allineati volutamente: SESSION_LOG (indice) + registro metodi privato + questo report. Non toccati (corretto): PREPARA_PROMPT_SKILL, VOCABOLARIO, INT_00, idiografica, PLAN_V0/WP-1, spunto S-A (non sovrascritto).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivi e di' perché ne sei certo.)
✅ R4: Non ho eseguito la fantasticazione CFG-01 (solo predisposta — mandato esplicito era prepara + traccia). Non ho aggiornato i sei owner Bussola §5. Non ho aperto C8/ES-*/WP-1. Non ho committato/pushato. Sezione 11 mancava al primo giro: completata ora su nudge hook.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: Attrito: prima stesura capsula fallita (enum session_type `prepara_prompt` invalido, UUID non-v7, HTTPS in source_refs → REF-TRAVERSAL); fix a `meta` + UUIDv7 + ref workspace. Miglioria candidata (dato): snip/checklist ID+enum MSS nel prepara-prompt quando la chat chiude con capsula, per evitare deny a catena.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto (Bussola/handoff/MSS/PREPARA + fonti metodo; niente APP_CONTEXT). Hook fine-sessione utile: ha segnalato correttamente l’assenza della sezione 11 formale (le R brevi senza ❓Q non bastavano).

## 12. Self-review del report

1. Dati = diff SESSION_LOG + file report/registro/S-A riaperti — ok.
2. Skill correlate prodotto: nessuna da allineare — ok.
3. Q1–Q6 in formato formale ❓Q/✅R — ok.
4. Tono operativo per Matteo — ok.
5. Handoff: CFG-01 pronta, esecuzione in nuova chat — ok.

**Report pronto per hook stop.** Nessun commit (attende «fai report finale» se vorrai pubblicare le parti git-tracked).
