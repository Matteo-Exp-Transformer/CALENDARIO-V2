# Report — verifica post-T12 e preparazione D27/WP-1 — 25-08-2026

**Modalità:** deep · **Profilo:** Meta · **Branch:** `env/test`
**HEAD seduta:** `db17841` (allineato `origin/env/test`) · **Working tree:** pulito
**Esito in una riga:** fondamenta MSS nel perimetro dichiarato **confermate**; **`D27` non aperta** (manca conferma verbatim di Matteo); WP-1 resta **NO-GO**; contratto WP-1 progettato, non eseguito.

## 1. Cappello

- **Cosa è cambiato:** nulla su codice/DB/pacchetti MSS; solo questo report di verifica e il piano operativo WP-1 in bozza.
- **Cosa resta:** decisione esplicita di Matteo su D27; scelta del lavoro app; eventuale prompt esecutore del primo pilota; debiti T13 Q-B/Q-C; residuo lavagna WP-1 in bucket «Fatte».
- **Serve una tua azione:** sì — le quattro decisioni sotto (verbatim D27 + lavoro + successo/fallimento + confronto col vecchio skill system).

## 2. Verifica fondazioni (owner, non narrativa)

| Controllo | Esito | Evidenza |
|---|---|---|
| `npm run mss:status` | **PASS** | ultimo chiuso `T12` CHIUSO; prossimo `T13`; WP-1 `NON INIZIATO — NO-GO`; viste anti-stale allineate; tree pulito; HEAD=`origin`=`db17841` |
| Owner §4 `WP-1` | **NO-GO** | `PLAN_V0.md` §4 riga 4: `NON INIZIATO — NO-GO (D27 chiusa; …)` |
| Owner §4-bis SK-* | **tutti CHIUSI/ALLINEATI** | SK-0…SK-11 chiusi o allineati come da `mss:status` |
| Owner §4 `H-1.3` | **PASS** | 25-08-26 Opzione B; non apre WP-1 |
| Owner §15 ciclo T12 | **CHIUSO** | M-SYNC-ORCH + M-D14-INDEX PROMUOVERE; Q-B/Q-C No → debiti handoff |
| Allineamenti documentali T12 | **fatti** | sync `PROMPT_ORCHESTRATOR`/`PROMPT_AVVIO`; vista `report-index` (`a32a52f`); PLAN mark T12→T13 (`db17841`) |
| Pubblicazione T11+T12 | **su origin** | commit `6f3edf5` (T11), `a32a52f` (indice), `db17841` (chiusura T12); branch allineato |
| `D27` | **chiusa** | PLAN §1156: WP-1 NO-GO finché riapertura in chat dedicata |
| Codice app / DB / nuovo pacchetto | **non toccati** | mandato rispettato |

**Residui non bloccanti (non fermano la domanda D27):**

1. **Lavagna cruscotto:** `WP-1` compare sotto «Fatte» perché `classifyPlanState` matcha `\bPASS\b` nella parentetica `H-1.3 PASS ≠ via libera` *prima* di `NON INIZIATO`. Owner e `mss:status` restano corretti (`NON INIZIATO — NO-GO`). Bug di vista, non di stato.
2. **Prosa formale T12 «Commit/push: non eseguiti»** in PLAN §15 vs git reale: T11+T12 sono già su `origin` @ `db17841`. Il gate «prossimo T13» elenca ancora commit/pubblicazione — pezzo stale; debiti Q-B/Q-C restano vivi.
3. **Debiti espliciti:** Q-B denylist extend · Q-C multi-assertion `--verify` — solo con sì Matteo.

**Verdetto fondazioni:** complete nel perimetro dichiarato post-T12. **Autorizzato chiedere a Matteo la riapertura D27.** Non autorizzato aprire WP-1 senza la frase verbatim.

## 3. Cosa significa aprire D27 (per Matteo)

Aprire D27 **non** spegne il vecchio skill system e **non** è cutover.

Autorizza soltanto un **pilota MSS in modalità ombra** sull’app Calendario: si lavora su un task reale, si raccoglie la capsula, un revisore freddo ricostruisce da evento/owner, e il vecchio sistema resta il confronto operativo finché non decidi altrimenti.

## 4. Verdetto D27 (questa seduta)

| Voce | Stato |
|---|---|
| **D27** | **non aperta** |
| Motivo | manca conferma esplicita verbatim di Matteo |
| Frase attesa | «Riapro D27 e autorizzo WP-1 in modalità ombra» |
| WP-1 | resta **NO-GO** |

## 5. Decisioni richieste a Matteo (non decise dall’agente)

1. Conferma verbatim: **«Riapro D27 e autorizzo WP-1 in modalità ombra»** — oppure No.
2. Quale **lavoro reale** dell’app Calendario usare come prima istanza (schermata/flusso concreto).
3. Quale risultato rende MSS **utile**, e quale sarebbe un **fallimento**.
4. Il **vecchio skill system** resta il confronto operativo per tutto WP-1? **Raccomandazione: sì.**

## 6. Contratto breve del primo WP-1 (progettato, non eseguito)

### 6.1 Perimetro

| Voce | Contenuto |
|---|---|
| Protocollo | `MSS-PILOT-001` v1.0.1 · capsula `mss.session/0.1.1` / `freeze-2` |
| Modalità | ombra — vecchio skill system **attivo** (confronto operativo) |
| Cutover | **vietato** in WP-1 |
| Prima istanza | una seduta Meta/deep su lavoro **app reale** scelto da Matteo (non calibrazione 09-08) |
| Chiusura WP-1 | **non** dopo una sola istanza: servono anche light · standard/deep · interrotta/compact · annotazione ritardata (PLAN §7) |

### 6.2 Raccolta minima (misurabile; «non osservato» valido)

| Campo | Cosa registra | Fallimento se… |
|---|---|---|
| Correzioni al prompt | quante volte Matteo corregge il mandato/prompt a metà | inventare correzioni non dette |
| Retry | quante ripartenze/chat compact | contare retry fittizi |
| Tempo/costo percepito | stima Matteo o agente, esplicitamente attribuita | inventare metriche personali/qualità |
| Controlli eseguiti | `controls[]` reali (comandi + exit) | controlli infallibili / denylist |
| Errori o regressioni | bug app o MSS osservati | silenziare regressioni |
| Decisioni Matteo | Sì/No e verbatim | attribuire decisioni non dette |
| Follow-up | handoff atomico successivo | omettere aperti |

**Vietato:** metriche di «qualità persona» o punteggi non osservati. `non_osservato` è dato valido.

### 6.3 Verifica fredda (gate istanza)

Il revisore riceve **solo** evento/capsula + owner necessari (non la narrativa completa né il verdetto atteso). Deve ricostruire intento, tipo, ruolo/ambiente/privacy, route, decisioni attribuite, delta Persona/Sistema/Output, owner/aperti, versione sistema (PLAN §7).

Pass istanza (protocollo): 20/20 target `corretto`; 0 perso/inventato/ambiguo; self-report ≠ verifica; nessun supporto contato come prodotto.

### 6.4 Criteri di utilità / fallimento (bozza — Matteo conferma in §5)

| Utile (bozza) | Fallimento (bozza) |
|---|---|
| Revisore freddo ricostruisce senza inventare; raccolta minima completa o esplicitamente `non_osservato`; vecchio sistema ancora usabile come confronto; costo di cattura registrato | Inventare fatti; perdere vitali; dichiarare WP-1 «finito» dopo una sola istanza; cutover implicito; promuovere Persona da una seduta assistita |

### 6.5 Prompt esecutore

**Non prodotto in questa seduta** — Matteo non ha ancora scelto il lavoro app.

## 7. File di skill aggiornati

Nessuno — seduta di verifica/progettazione; owner PLAN non modificato (D27 non riaperta).

## 8. Comandi rieseguiti

| Comando | Exit / esito |
|---|---|
| `npm run mss:status` | 0 — T12 CHIUSO; WP-1 NO-GO; viste allineate; tree pulito |
| `git status -sb` / `rev-parse HEAD` vs `origin/env/test` | allineati `db17841` |
| `node` classifyPlanState su stato WP-1 (dalla root) | restituisce `fatta` (bug vista confermato) |
| `validate:mss` report + capsula | **OK** |
| Controllo capsula `CLASSIFY` | **fail** — helper `_check-wp1-bucket.mjs` importava path relativo errato (`ERR_MODULE_NOT_FOUND`); non invalida la prova root sopra |

## 9. Handoff al prossimo agente

**Cosa è vero adesso**

- Fondamenta scheletro MSS post-T12: **confermate** (owner + git).
- `D27` **chiusa**; `WP-1` **NO-GO**.
- Pubblicazione T11+T12 già su `origin/env/test` @ `db17841`.
- Contratto WP-1 §6 di questo report è la bozza operativa; **non** eseguito.
- Debiti: Q-B, Q-C; bug lavagna WP-1→Fatte; prosa T13 «commit» stale.

**Prossimo task atomico (dopo risposte Matteo)**

1. Se frase verbatim D27 → aggiornare PLAN §4/§15 (solo con sì) + produrre prompt esecutore sul lavoro app scelto.
2. Se No → chiudere prep; T13 resta su debiti Q-B/Q-C / eventuale fix lavagna.
3. Mai cutover; mai lavoro `src/` fuori dal pilota autorizzato.

**Divieti:** commit/push senza sì; aprire WP-1 senza verbatim; inventare metriche.

## 10. Cosa resta

- Quattro decisioni Matteo (§5).
- Prompt esecutore (dopo scelta lavoro).
- Eventuale fix `classifyPlanState` (PASS substring) — fuori perimetro se non chiesto.
- Debiti Q-B / Q-C.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica path e revisione o hash al momento della lettura. Per i messaggi di Matteo non contenuti in un file del repo, riportali verbatim.
✅ R1: Mandato = messaggio chat Matteo (verbatim nel transcript di questa seduta: profilo Meta deep, skill chain METASKILL→MANUALE→PLAN §4-bis/ter/15/§7 WP-1→CONTRATTO→CHIUSURA §11, obiettivo post-T12/D27/WP-1). File letti @ HEAD `db17841`: `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` `ab57b1a3…`; `MANUALE_OPERATIVO_MSS_V0.md` `e9dc0178…`; `PLAN_V0.md` `7ce615fc…`; `CONTRATTO_CAPSULA_SESSIONE_V0.md` `c010ef97…`; `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` `24652d69…`. Consultati anche cruscotto, report T12/Decisioni-T12, PROTOCOLLO_PRIMO_PILOTA, SCHEDA_CHIUSURA_META_R1 (stesso HEAD).

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (controls[]) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza.
✅ R2: Sì per §2/§8 — nessun diff di prodotto; stati da `npm run mss:status` + `git rev-parse` rieseguiti su `db17841`; bug lavagna riprodotto dalla root (`classifyPlanState` → `fatta`); `validate:mss --require-capsule` OK. Controllo capsula CLASSIFY fallito per path helper (annotato in §8), non per smentita del bug.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca.
✅ R3: Completa — nessuno (verifica senza modifica skill/owner).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non aperto D27; non eseguito WP-1; non scritto prompt esecutore (manca lavoro app); non aggiornato PLAN; non fixato `classifyPlanState`; non commit/push; non toccato app/DB.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito: lavagna «Fatte» contraddice owner su WP-1 (PASS nella parentetica). Miglioria: in `classifyPlanState`, testare `NON INIZIATO`/`BLOCCATO`/`NO-GO` **prima** del match `\bPASS\b`, o ignorare PASS solo se prefisso stato ≠ NON INIZIATO.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto (catena skill del mandato + `mss:status` prima degli owner). Hook di sistema non osservati come rumore in questa seduta; `non_osservato` su utilità hook Cursor oltre al mandato.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03970-900c-7198-9135-a8639109075f","correlation_id":"mss-cor-01a03970-900c-7b9e-b79e-144d4e25c0da","segment_no":1,"created_at":"2026-08-25T17:01:13+02:00","finalization":"final","recorded_by":{"actor_id":"agente-meta-verifica-t12-d27","actor_type":"agente","role":"meta","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a03970-900c-705c-a671-bd5c1190784d","capture_key":"mss-ses-01a03970-900c-7198-9135-a8639109075f/1/session_event/1","event":{"event_id":"mss-evt-01a03970-900c-73c3-b8c0-9e7ecad4643c","event_kind":"session_close","occurred_at":"2026-08-25T17:01:13+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"meta","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD db17841; 3 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/25-08-26/Report-verifica-post-t12-d27-prep-wp1-25-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/25-08-26/Report-verifica-post-t12-d27-prep-wp1-25-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"STATUS","criterio":"npm run mss:status (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run mss:status (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"CLASSIFY","criterio":"node \"docs/Sessioni di lavoro/25-08-26/_check-wp1-bucket.mjs\" (atteso exit 0)","esito":"fail","numeratore":0,"denominatore":1,"esecutore":"mss:capsule: node \"docs/Sessioni di lavoro/25-08-26/_check-wp1-bucket.mjs\" (exit 1; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03970-900c-7198-9135-a8639109075f","correlation_id":"mss-cor-01a03970-900c-7b9e-b79e-144d4e25c0da","segment_no":1,"created_at":"2026-08-25T17:01:13+02:00","finalization":"final","recorded_by":{"actor_id":"agente-meta-verifica-t12-d27","actor_type":"agente","role":"meta","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03970-900c-7fd8-8170-8be5d51c253d","capture_key":"mss-ses-01a03970-900c-7198-9135-a8639109075f/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a03970-900c-7b85-81a1-0d4d4f7deac9","axis":"persona","subject_record_ids":["mss-rec-01a03970-900c-705c-a671-bd5c1190784d"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"agente-meta-verifica-t12-d27","role":"meta","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03970-900c-7198-9135-a8639109075f","correlation_id":"mss-cor-01a03970-900c-7b9e-b79e-144d4e25c0da","segment_no":1,"created_at":"2026-08-25T17:01:13+02:00","finalization":"final","recorded_by":{"actor_id":"agente-meta-verifica-t12-d27","actor_type":"agente","role":"meta","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03970-900c-7503-a88d-312274cee6be","capture_key":"mss-ses-01a03970-900c-7198-9135-a8639109075f/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a03970-900c-7c2e-b6ea-217d22457775","axis":"sistema","subject_record_ids":["mss-rec-01a03970-900c-705c-a671-bd5c1190784d"],"delta":"modificato","assertions":[{"rule_id_version":"D27-PREP@mss-v0.1-wp0.1-freeze-2","trigger_event":"Verifica post-T12: mss:status + owner PLAN; riproduzione bug lavagna WP-1","decision_or_output_changed":"Fondamenta confermate; D27 resta chiusa (no verbatim); WP-1 NO-GO; bug classifyPlanState WP-1→fatta osservato; contratto WP-1 solo progettato","G":2,"O":1,"E":1}],"asserted_by":{"actor_id":"agente-meta-verifica-t12-d27","role":"meta","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03970-900c-7198-9135-a8639109075f","correlation_id":"mss-cor-01a03970-900c-7b9e-b79e-144d4e25c0da","segment_no":1,"created_at":"2026-08-25T17:01:13+02:00","finalization":"final","recorded_by":{"actor_id":"agente-meta-verifica-t12-d27","actor_type":"agente","role":"meta","agent_runtime":{"provider":"Cursor","model":"composer","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03970-900c-76a5-9c6b-8e0c079d3b43","capture_key":"mss-ses-01a03970-900c-7198-9135-a8639109075f/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a03970-900c-7065-8f78-4e94d78bc421","axis":"output","subject_record_ids":["mss-rec-01a03970-900c-705c-a671-bd5c1190784d"],"delta":"creato","assertions":[{"output_id":"report-verifica-post-t12-d27-prep-wp1-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-verifica-post-t12-d27-prep-wp1-25-08-26.md","recipient":"Matteo","problem_or_job":"verificare fondazioni post-T12 e preparare decisione D27/WP-1 senza aprirle","intended_use":"base per Sì/No verbatim D27 e scelta lavoro app del primo pilota ombra","conceived_by":"Matteo","decided_by":"non_osservato:D27 non ancora riaperta","directed_by":"Mandato Meta deep post-T12 (chat)","authored_by":"agente-meta-verifica-t12-d27","verified_by":"non_osservato","acceptance_criterion":"T12 CHIUSO da owner; D27 non aperta senza verbatim; contratto WP-1 progettato; no prompt esecutore senza lavoro app; no commit/push; no src/","verification_or_use_evidence":"npm run mss:status; git HEAD=origin=db17841; classifyPlanState→fatta; report §2–§6","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/MetaSkillSystem/PLAN_V0.md","docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","docs/Sessioni di lavoro/25-08-26/Report-orchestratore-t12-25-08-26.md","docs/Sessioni di lavoro/25-08-26/Decisioni-T12-QABC-25-08-26.md"],"relations_no_double_count":["Verifica e contratto WP-1; non apre D27; non esegue pilota; non tocca src/"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"agente-meta-verifica-t12-d27","role":"meta","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
