# Report — Cruscotto MSS M/D/P · Fase 0 (lab) + Fase 1 (repo) — 25-08-2026

**Modalità:** deep · **Ruolo:** esecutore + chiusura «lavoro ok» · **Branch:** `env/test` · **Commit feat FASE 1:** `2d159e6` · **HEAD a chiusura report:** `80e46f1` (include FASE 1 + commit successivo M-E2-D)
**Esito in una riga:** metodo M/D/P validato fuori repo; lavagna (stato da PLAN, glosse da §4-quater) nel cruscotto generato; gate verdi; Fase 2 HTML (`mss:views-html`) atterrata con «fai report finale» post-H13.

> **Nota report finale (25-08-26):** FASE 1 già in `2d159e6`; questo report + judgments + FASE 2 (`scripts/mss/views-html.mjs`, `mss:views-html`, MANUALE §2.4-quater-bis) entrano con il commit di chiusura capitolo. Fuori scope invariato: «L'ultima chat», cantieri privati nel `.md`.

## 1. Cappello

- **Cosa è cambiato:** aprendo il cruscotto MSS vedi ora una lavagna a tre colonne (Fatte / Con riserva / Da fare) con etichette in italiano, più «L'ultimo ciclo chiuso» e le riserve aperte — tutto generato da `PLAN_V0`, non a mano. In più: `npm run mss:views-html` produce HTML locale fuori `docs/` (non nei cancelli CI).
- **Cosa resta:** sezione «L'ultima chat» non riproducibile da owner; cantieri privati non in `.md` versionato.
- **Serve una tua azione:** no — capitolo prodotto chiuso con «fai report finale».

## 2. Cosa è stato fatto

### Fase 0 — laboratorio (fuori repo)

In scratchpad (`…/scratchpad/cruscotto-lab/`): parser autonomi, bozza `CRUSCOTTO_CANDIDATO.md`, anteprima `cruscotto.html`, `GLOSSE_BOZZA`, `METODO`, `test-lab` 4/4. **Zero file della repo toccati** in questa fase: solo prova del metodo M (stato) / D (glossa) / P (presentazione).

### Fase 1 — nel repo (commit locale `2d159e6`)

Ora il generatore del cruscotto legge lo stesso owner del piano e costruisce:

1. **L'ultimo ciclo chiuso** — ultimo ciclo §15 con pattern «eseguito e **STATO**» (oggi: T6 CHIUSO).
2. **Lavagna** — conteggi *Fatte 16 · Con riserva 1 · Da fare 6 · Non classificate 2*; colonne con glossario §4-quater; §4-ter prevale sullo stato.
3. **Riserve aperte** — solo celle M con ⚠️.

Vincoli rispettati: `parsePlanGate` intatto; `runViews` / `replaceGeneratedBlock` invariati; `deriveMatteoDashboard` pura (no git/corpus). Gate: `generate:mss:views`, `test:mss:tools` 66/66 (V1+V2), `test:mss`, `validate:mss:views`, `validate:docs`, `validate:mss:all`, `mss:status` — tutti verdi in chiusura.

## 3. File toccati e perché

| File | Perché |
|---|---|
| `scripts/mss/plan-parse.mjs` | `parsePlanBoard` / `Glosses` / `LastCycle` / `validate` / `classify` |
| `scripts/mss/views.mjs` | `deriveMatteoDashboard` arricchito (ciclo, lavagna, riserve) |
| `docs/MetaSkillSystem/PLAN_V0.md` | owner: §4-quater glosse + nota SK-2 lavagna |
| `docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md` | vista rigenerata fra marcatori |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | test V2 lavagna / glossa orfana / §4-ter |
| `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` | lavagna M/D/P in `2d159e6` + riga `mss:views-html` (report finale / Fase 2) |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | bucket **Non classificate** + §2.4-quater-bis `mss:views-html` (report finale) |
| judgments + questo report | deliverable chiusura |

**Non in repo (lab):** scratchpad `cruscotto-lab/*` (HTML di output default). **FASE 2 (post «lavoro ok»):** `scripts/mss/views-html.mjs` + script `mss:views-html` + MANUALE/METASKILL — fuori `validate:mss:all`; atterraggio con «fai report finale».

## 4. Test eseguiti e risultato

| Comando | Esito |
|---|---|
| `npm run generate:mss:views` | **exit 0** — `cruscotto-matteo` |
| `npm run test:mss:tools` | **exit 0** — **66** test (V1 + **V2** lavagna) |
| `npm run test:mss` | **exit 0** — 42 fixture + **57** gruppi |
| `npm run validate:mss:views` | **exit 0** — cruscotto allineato |
| `npm run validate:docs` | **exit 0** — 0 path rotti |
| `npm run validate:mss:all` | **exit 0** |
| `npm run mss:status` | **exit 0** — allineata |
| `validate:mss --require-capsule` su questo report | in `controls[]` §6-bis |

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `METASKILL_SYSTEM_SKILL.md` | lavagna M/D/P (`2d159e6`) + riga `mss:views-html` (Fase 2 / report finale) | ingresso skill allineato |
| `MANUALE_OPERATIVO_MSS_V0.md` | **Non classificate** + §2.4-quater-bis `mss:views-html` | vista MD + attrezzo HTML fuori cancelli |
| skill area prodotto (Prenota/QR/…) | nessuno | fuori perimetro |

## 6. Dati comunicazione

- **Frasi/richieste ricorrenti:** validare metodo M/D/P e avvicinarlo all'artefatto di anteprima (1); «lavoro ok» per chiusura (1).
- **Formato che ha funzionato:** piano a fasi (lab → repo) con vincoli espliciti (gate intatti, derive pura).
- **Prompt:** mandato chiusura sessione inline parent (contesto Fase 0/1, path report, no commit).
- **Automatizzabile:** rigenerazione cruscotto + test V2. **Manuale:** decisione se/quando portare HTML in repo; testo «L'ultima chat».

### Regia di Matteo (campi fissi)

| Campo | Valore |
|---|---|
| Opzioni offerte → scelta | non_osservato in questa chat di chiusura (lavoro già fatto in chat precedente) |
| Vincoli aggiunti da lui | lab fuori repo; `parsePlanGate` intatto; no Fase 2 in questo mandato |
| Criterio: prima o dopo? | prima (piano fasi + vincoli) |
| Cosa NON ha chiesto | non_osservato |
| Correzioni | nessuna in chiusura |
| Reazione alla correzione | non_applicabile |
| Citazione verbatim decisiva | «lavoro ok» |

## 6-bis. Capsula MetaSkillSystem

Judgments: `judgments-cruscotto-mdp-fase0-fase1-25-08-26.json`.

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03883-c158-7d7b-bf02-6804d0066eb1","correlation_id":"mss-cor-01a03883-c158-70bc-a763-99b24cd8f6da","segment_no":1,"created_at":"2026-08-25T12:42:33+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-chiusura-cruscotto-mdp","actor_type":"agente","role":"agente chiusura sessione MSS","agent_runtime":{"provider":"Cursor","model":"cursor-composer-chiusura-cruscotto-mdp","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a03883-c158-734e-9024-4d5e62b8699c","capture_key":"mss-ses-01a03883-c158-7d7b-bf02-6804d0066eb1/1/session_event/1","event":{"event_id":"mss-evt-01a03883-c158-7c97-a2bf-7e2c5750967c","event_kind":"session_close","occurred_at":"2026-08-25T12:42:33+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"agente chiusura sessione MSS","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD 80e46f1; 9 file in working tree","authorization":{"read":[],"write":[],"forbid":[]},"authorized_outputs":["capsula JSONL emessa su stdout"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"TOOLS","criterio":"npm run test:mss:tools (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"VIEWS","criterio":"npm run validate:mss:views (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:views (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"MSSALL","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/FOLLOW_UP.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"80e46f1","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"80e46f1","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"80e46f1","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"package.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"80e46f1","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03883-c158-7d7b-bf02-6804d0066eb1","correlation_id":"mss-cor-01a03883-c158-70bc-a763-99b24cd8f6da","segment_no":1,"created_at":"2026-08-25T12:42:33+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-chiusura-cruscotto-mdp","actor_type":"agente","role":"agente chiusura sessione MSS","agent_runtime":{"provider":"Cursor","model":"cursor-composer-chiusura-cruscotto-mdp","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03883-c158-73f3-b03a-3490a7d90c7b","capture_key":"mss-ses-01a03883-c158-7d7b-bf02-6804d0066eb1/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a03883-c158-7c71-8005-7cfa14e53c1f","axis":"persona","subject_record_ids":["mss-rec-01a03883-c158-734e-9024-4d5e62b8699c"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-composer-chiusura-cruscotto-mdp","role":"agente chiusura sessione MSS","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03883-c158-7d7b-bf02-6804d0066eb1","correlation_id":"mss-cor-01a03883-c158-70bc-a763-99b24cd8f6da","segment_no":1,"created_at":"2026-08-25T12:42:33+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-chiusura-cruscotto-mdp","actor_type":"agente","role":"agente chiusura sessione MSS","agent_runtime":{"provider":"Cursor","model":"cursor-composer-chiusura-cruscotto-mdp","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03883-c158-7c89-abb3-7e7ff594e41a","capture_key":"mss-ses-01a03883-c158-7d7b-bf02-6804d0066eb1/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a03883-c158-7e7a-8383-9573bae20f91","axis":"sistema","subject_record_ids":["mss-rec-01a03883-c158-734e-9024-4d5e62b8699c"],"delta":"verificato","assertions":[{"rule_id_version":"CRUSCOTTO-MDP-FASE1@PLAN_V0§4-quater","trigger_event":"Mandato cruscotto: validare metodo M/D/P (lab) e portare lavagna nell'artefatto generato da PLAN","decision_or_output_changed":"FASE 1 in repo: plan-parse board/glosses/classify; deriveMatteoDashboard arricchito (T6, lavagna, riserve); §4-quater in PLAN; cruscotto rigenerato; test V2; gate verdi. parsePlanGate/runViews invariati. FASE 2 HTML e «L'ultima chat» fuori scope.","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"cursor-composer-chiusura-cruscotto-mdp","role":"agente chiusura sessione MSS","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a03883-c158-7d7b-bf02-6804d0066eb1","correlation_id":"mss-cor-01a03883-c158-70bc-a763-99b24cd8f6da","segment_no":1,"created_at":"2026-08-25T12:42:33+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-composer-chiusura-cruscotto-mdp","actor_type":"agente","role":"agente chiusura sessione MSS","agent_runtime":{"provider":"Cursor","model":"cursor-composer-chiusura-cruscotto-mdp","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a03883-c158-79e0-93ef-4a3812ce195f","capture_key":"mss-ses-01a03883-c158-7d7b-bf02-6804d0066eb1/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a03883-c158-70a3-b7e4-4dc6e1102e59","axis":"output","subject_record_ids":["mss-rec-01a03883-c158-734e-9024-4d5e62b8699c"],"delta":"creato","assertions":[{"output_id":"cruscotto-mdp-fase0-fase1-25-08-26","primary_type":"prova","canonical_version":"docs/Sessioni di lavoro/25-08-26/Report-cruscotto-mdp-fase0-fase1-25-08-26.md","recipient":"Matteo","problem_or_job":"avvicinare il cruscotto al metodo M/D/P validato in lab senza toccare owner gate","intended_use":"handoff verso Fase 2 HTML e chiusura capitolo con «fai report finale»","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"piano cruscotto MSS M/D/P + «lavoro ok»","authored_by":"cursor-composer-chiusura-cruscotto-mdp","verified_by":"non_osservato","acceptance_criterion":"commit 2d159e6 presente; lavagna 16/1/6/2; test:mss:tools 66/66 con V2; validate:mss:views verde; report Q/R+capsula","verification_or_use_evidence":"controls CRUSCOTTO-*; git show 2d159e6; CRUSCOTTO_MATTEO_MSS.md","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":["docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md","scripts/mss/plan-parse.mjs","scripts/mss/views.mjs"],"relations_no_double_count":["Lab Fase 0 fuori repo (scratchpad); non conta come commit","FASE 2 HTML non inclusa"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-composer-chiusura-cruscotto-mdp","role":"agente chiusura sessione MSS","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo (questa chat chiusura): **1** («lavoro ok» + contesto mandato).
- Correzioni dopo 1ª risposta: **0**.
- Follow-up generati: **1** (`FU-MSS-CRUSCOTTO-FASE2`).
- Modalità alzata: no.
- Anatomia: contesto Fase 0/1 completo nel mandato di chiusura → report senza ricostruzione a tentoni. Replicare: numeri lavagna + HEAD + path lab già nel brief.

## 8. La TUA lettura della sessione

- **Impressioni:** lab fuori repo ha tenuto pulita la FASE 1; i vincoli «gate intatti / derive pura» hanno evitato regressioni su `mss:status`. Skill system chiaro (MANUALE + METASKILL + PLAN owner).
- **Difficoltà:** in chiusura c’era working tree sporco di un’altra seduta (M-E2-D unstaged) — non toccato. MANUALE citava lavagna a 3 colonne ma non il bucket Non classificate: allineato ora.
- **Migliorie (dato, non modifica):** un FU esplicito per Fase 2 evita che `views-html.mjs` untracked venga scambiato per deliverable già chiuso.

## 9. Derivazione errori

| Difficoltà | Classe | Derivava da | Evitato come |
|---|---|---|---|
| MANUALE senza «Non classificate» | errore agente (documentazione incompleta in pre-allineamento) / gap minore | FASE 1 documentava tre colonne; il generatore emette anche il quarto bucket | checklist «vista generata vs MANUALE riga per riga» in chiusura |
| nessuna difficoltà di runtime gate | — | — | gate rieseguiti verdi |

Nessun pattern nuovo da appendere a `ERRORI_PROCESSO.md`.

## 10. Cosa resta per la prossima sessione

| ID | Stato | Nota |
|---|---|---|
| `FU-MSS-CRUSCOTTO-FASE2` | **CHIUSA** | Attrezzo `mss:views-html` + docs in git (report finale); HTML solo scratchpad |
| «L'ultima chat» | Aperto | Non riproducibile da owner PLAN — richiede decisione di fonte |
| Cantieri privati | Fuori `.md` | Non in scope cruscotto generato |

Sincronizzato in `docs/FOLLOW_UP.md`.

## 10-bis. Handoff al prossimo agente

**Cosa è vero adesso**

- Feat FASE 1: `2d159e6`. M-E2-D già in HEAD. Report finale pubblica report+judgments + MANUALE/METASKILL + `views-html.mjs` + `package.json` + FOLLOW_UP **CHIUSA**.
- Cruscotto generato: lavagna **16 / 1 / 6 / 2**; sezioni T6 + lavagna + riserve; `validate:mss:views` verde.
- Maturità lavagna MD: **G/O/E** sì. Fase 2 attrezzo in repo; HTML solo scratchpad; `mss:views-html` **non** in `validate:mss:all`.

**Prossimo task atomico:** solo se Matteo chiede «L'ultima chat» o cantieri in vista — non riaprire Fase 2 attrezzo senza nuovo mandato.

**Non riaprire:** riscrivere `parsePlanGate`; cantieri privati nel `.md`; mettere `mss:views-html` in `validate:mss:all` senza decisione.

**Owner stato:** `PLAN_V0.md`. Vista: `CRUSCOTTO_MATTEO_MSS.md` (solo fra marcatori). Lab: scratchpad fuori git.

**Autorizzazioni:** no commit/push su «lavoro ok»; no PROD; no WP-1.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura (es. `git rev-parse HEAD:<path>` o SHA — stesso dato di `source_refs[].revision_or_hash` in capsula). Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1: mandato chiusura inline parent (non file repo) — contesto Fase 0 lab scratchpad + Fase 1 `2d159e6` + «lavoro ok»; `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` @ working tree (letto intero); `PLAN_V0.md` / `METASKILL_SYSTEM_SKILL.md` / `CRUSCOTTO_MATTEO_MSS.md` @ `2d159e6`; `MANUALE_OPERATIVO_MSS_V0.md` @ `a2ec2b9` poi patch locale Non classificate in chiusura. Verbatim Matteo: «lavoro ok».

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).
✅ R2: sì — feat FASE 1 `2d159e6` (6 file / +480−26) è antenato di HEAD `80e46f1`; lavagna «Fatte 16 · Con riserva 1 · Da fare 6 · Non classificate 2»; `test:mss:tools` 66/66 OK V2; `validate:mss:all` exit 0; `validate:mss --require-capsule` su questo report → OK.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).
✅ R3: sì — METASKILL (lavagna + `mss:views-html`); MANUALE (Non classificate + §2.4-quater-bis); nessuna skill prodotto. Allineati al commit di report finale.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: al «lavoro ok» non commit; a «fai report finale» sì commit+push del capitolo (Fase 0/1 report + Fase 2 attrezzo). Non fatti: «L'ultima chat», cantieri privati, HTML in `docs/` versionati.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: attrito minore — MANUALE pre-dichiarato «già allineato» ma senza Non classificate; migliorerei con checklist vista↔manuale in chiusura. Verificato: CHIUSURA_SESSIONE §5 obbligo allineamento, gate V2, cruscotto live.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: contesto giusto (CHIUSURA + MetaSkill + cruscotto/PLAN); hook stop non ancora scattato (questa è la scrittura del report) — utile il contratto Q/R esplicito in CHIUSURA_SESSIONE.

## 12. Self-review del report

1. Triade MSS: `test:mss` + `test:mss:tools` + `validate:mss` su questo file (post-capsula) — da verde in controls.
2. §5 skill: METASKILL + MANUALE aggiornati/verificati, non rimandati.
3. §11: sei R con sostanza; handoff ricostruibile.

Pronto per hook stop / pre-commit mente fredda al prossimo «fai report finale».
