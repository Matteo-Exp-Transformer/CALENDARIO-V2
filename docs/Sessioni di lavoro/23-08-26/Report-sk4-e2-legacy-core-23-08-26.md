# Mini-report E2 — legacy schema B1 (`SK-4`)

> Slot: **E2** · Wave 1 · Data: 23-08-26 · Branch: `env/test`
> File in proprietà: `scripts/mss/core.mjs`, `scripts/mss/rules.mjs`, fixture `FX-I11` (G5)

## 1. Obiettivo

Chiudere il bypass **B1**: record **nuovi** con coppia legacy `mss.session/0.1.0` +
`mss-v0.1-wp0.1-freeze-1` devono essere **respinti**; lo storico già committato resta leggibile
senza retro-edit (G3).

## 2. Baseline B1 (prima della correzione)

Comportamento atteso documentato (V3 consulenza 21-08): capsula sintetica `0.1.0`/`freeze-1` **senza**
`controls` → `validate:mss OK` (porta di servizio).

Dopo la correzione, la stessa capsula → **FAIL** `MSS-LEGACY-NEW-FORBIDDEN` (vedi §4).

## 3. Implementazione

| Componente | Modifica |
|---|---|
| `rules.mjs` | Codice stabile `MSS-LEGACY-NEW-FORBIDDEN` |
| `core.mjs` | `validateLegacyNewForbidden()` in coda a `validateVitalFields` dentro `validateBundleRecords`; criterio G3: deny se coppia legacy **e** `record_id` non presente in HEAD con stesso canonical |
| `core.mjs` | `mergeArtifactHeadRecords()` in `validateMss`: unisce record da `input.headContent` e da `options.historicalSnapshots` per lo stesso artifact (preparazione integrazione E4/adapter) |
| `FX-I11-legacy-new.jsonl` | Fixture supplemental fail (G5) |
| `manifest.json` | Voce supplemental `FX-I11` |
| `build-fixtures.mjs` | Generatore allineato (drift test H-1) |

**Non toccati (perimetro):** `adapter.mjs`, `git-adapter.mjs`, `query.mjs`, contratto, capsule
storiche.

## 4. Prove di chiusura E2

| # | Comando / prova | Esito |
|---|---|---|
| 1 | `node --check scripts/mss/core.mjs scripts/mss/rules.mjs` | exit **0** |
| 2 | `npm run test:mss` (prima e dopo) | exit **0** — **42** fixture + **32** gruppi |
| 3 | Capsula sintetica legacy-new senza `controls` | exit **≠ 0**, codice **`MSS-LEGACY-NEW-FORBIDDEN`** |
| 4 | Hash fixture **frozen** invariate | OK (14 frozen, manifest hash ok) |

Prova 3 (comando eseguito):

```text
node -e "… validBundle → 0.1.0/freeze-1, delete controls … validateMss …"
→ ok: false codes: MSS-LEGACY-NEW-FORBIDDEN (×4 record)
```

Record storici legacy: con `historicalSnapshots` da HEAD, **0** deny `MSS-LEGACY-NEW-FORBIDDEN` su
`Report-completamento-wp-0-1-…` (G3 lettura). Passaggio completo `validatePathContent` senza snapshot
HEAD sullo stesso file ancora nega legacy — **E4** dovrà far passare `historicalSnapshots` (o
`headContent`) da `adapter.mjs` a `validateMss`.

## 5. Backlog / handoff

- **E4:** collegare `historicalSnapshots`/`headContent` in `validatePathContent` → opzioni
  `validateMss` per G3 end-to-end su `validate:mss` CLI e pre-commit.
- **E3/E4:** contratto già allineato; integrazione dimostrazioni B1–B3.

## 6. Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-0198c200-0002-7000-8000-000000000001","session_id":"mss-ses-0198c200-0002-7000-8000-000000000010","correlation_id":"mss-cor-0198c200-0002-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198c200-0002-7000-8000-000000000010/1/session_event/1","created_at":"2026-08-23T11:00:00+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-agent-e2","actor_type":"agente","role":"sk4_e2_legacy_core","agent_runtime":{"provider":"Cursor","model":"Claude","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Read","Grep","Shell","Write","StrReplace"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"sk4-plan","package_version_or_revision":"23-08-26","source_ref":"docs/Sessioni di lavoro/23-08-26/PLAN-CURSOR-SK-4-23-08-26.md"}],"event":{"event_id":"mss-evt-0198c200-0002-7000-8000-000000000030","event_kind":"session_close","occurred_at":"2026-08-23T11:00:00+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"SK-4 E2 chiusura bypass B1 legacy-new in core.mjs","session_type":"deep","capsule_status":"completa","role_key":"Esecuzione E2 SK-4","area":"MetaSkillSystem validator core","environment":"branch env/test; scripts/mss only","authorization":{"read":["METASKILL_SYSTEM_SKILL","PLAN_V0","PLAN-CURSOR-SK-4","core.mjs","rules.mjs"],"write":["core.mjs","rules.mjs","fixtures/v0.1/FX-I11","manifest supplemental","Report-sk4-e2","PLAN §9 E2"],"forbid":["adapter.mjs","git-adapter.mjs","query.mjs","CONTRATTO","capsule storiche","commit/push"]},"authorized_outputs":["regola MSS-LEGACY-NEW-FORBIDDEN","fixture FX-I11","mini-report E2"],"route":{"chosen":"Prompt-sk4-e2-legacy-core-23-08-26.md","alternatives_or_conflicts":"nessuno"},"observed_outcome":"B1 negato su record nuovi legacy; test:mss verde 42 fixture; FX-I11 fail atteso","open_items":["E4 integrazione historicalSnapshots adapter","E1 path se non completato"],"controls":[{"control_id":"NODE-CHECK","criterio":"node --check core.mjs rules.mjs exit 0","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-agent-e2","evidence_refs":["owner-core"]},{"control_id":"TEST-MSS","criterio":"npm run test:mss exit 0 post-modifica","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-agent-e2","evidence_refs":["owner-core"]},{"control_id":"SYNTHETIC-LEGACY-FAIL","criterio":"capsula 0.1.0/freeze-1 senza controls → MSS-LEGACY-NEW-FORBIDDEN","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"cursor-agent-e2","evidence_refs":["owner-rules"]},{"control_id":"FROZEN-HASH","criterio":"14 fixture frozen hash manifest invariati","esito":"pass","numeratore":14,"denominatore":14,"esecutore":"cursor-agent-e2","evidence_refs":["owner-manifest"]}],"subject_runtime":{"actor_id":"cursor-agent-e2","provider":"Cursor","model":"Claude","runtime":"Cursor Agent","surface":"Cursor IDE"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["exit code test","path script","codice regola"],"prohibited_content":["dati personali","segreti"],"redactions":"nessuno","external_release":"forbidden","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-core","owner_id":"mss-core","uri_or_path":"scripts/mss/core.mjs","stable_anchor_or_event_id":"validateLegacyNewForbidden","revision_or_hash":"23-08-26-e2","sensitivity":"internal"},{"ref_id":"owner-rules","owner_id":"mss-rules","uri_or_path":"scripts/mss/rules.mjs","stable_anchor_or_event_id":"LEGACY_NEW_FORBIDDEN","revision_or_hash":"23-08-26-e2","sensitivity":"internal"},{"ref_id":"owner-manifest","owner_id":"mss-fixtures","uri_or_path":"docs/MetaSkillSystem/fixtures/v0.1/manifest.json","stable_anchor_or_event_id":"FX-I11","revision_or_hash":"supplemental","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-prompt","owner_id":"conversation","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Prompt-sk4-e2-legacy-core-23-08-26.md","stable_anchor_or_event_id":"mandate-e2","revision_or_hash":"23-08-26","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198c200-0002-7000-8000-000000000002","session_id":"mss-ses-0198c200-0002-7000-8000-000000000010","correlation_id":"mss-cor-0198c200-0002-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198c200-0002-7000-8000-000000000010/1/annotation/1","created_at":"2026-08-23T11:00:01+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-agent-e2","actor_type":"agente","role":"sk4_e2_legacy_core","agent_runtime":{"provider":"Cursor","model":"Claude","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Read"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"}],"annotation":{"annotation_id":"mss-ann-0198c200-0002-7000-8000-000000000040","axis":"persona","subject_record_ids":["mss-rec-0198c200-0002-7000-8000-000000000001"],"delta":"nessuno","assertions":[{"signal":"non_osservato","actor":"matteo","assistance":"guidato","origin":"naturale","source_ref":"source-prompt","effect":"autorizzazione G3 G5 e avvio E2","evidence_state":"observed"}],"asserted_by":{"actor_id":"cursor-agent-e2","role":"sk4_e2_legacy_core","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile:code-only","evidence_refs":["source-prompt"],"notes":"nessuna valutazione Persona"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198c200-0002-7000-8000-000000000003","session_id":"mss-ses-0198c200-0002-7000-8000-000000000010","correlation_id":"mss-cor-0198c200-0002-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198c200-0002-7000-8000-000000000010/1/annotation/2","created_at":"2026-08-23T11:00:02+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-agent-e2","actor_type":"agente","role":"sk4_e2_legacy_core","agent_runtime":{"provider":"Cursor","model":"Claude","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write","Shell"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"scripts/mss/core.mjs"}],"annotation":{"annotation_id":"mss-ann-0198c200-0002-7000-8000-000000000050","axis":"sistema","subject_record_ids":["mss-rec-0198c200-0002-7000-8000-000000000001"],"delta":"bypass B1 aperto -> regola MSS-LEGACY-NEW-FORBIDDEN su record nuovi","assertions":[{"rule_id_version":"SK-4/S4@mss-v0.1-wp0.1-freeze-2","trigger_event":"E2 legacy core G3","decision_or_output_changed":"validator nega coppia legacy su record non in HEAD; storico via committedById","G":2,"O":2,"E":1}],"asserted_by":{"actor_id":"cursor-agent-e2","role":"sk4_e2_legacy_core","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-core","evidence_refs":["owner-core"],"notes":"adapter wiring rimandato E4"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-0198c200-0002-7000-8000-000000000004","session_id":"mss-ses-0198c200-0002-7000-8000-000000000010","correlation_id":"mss-cor-0198c200-0002-7000-8000-000000000020","segment_no":1,"capture_key":"mss-ses-0198c200-0002-7000-8000-000000000010/1/annotation/3","created_at":"2026-08-23T11:00:03+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-agent-e2","actor_type":"agente","role":"sk4_e2_legacy_core","agent_runtime":{"provider":"Cursor","model":"Claude","runtime":"Cursor Agent","surface":"Cursor IDE"},"tools_used":["Write"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/fixtures/v0.1/manifest.json"}],"annotation":{"annotation_id":"mss-ann-0198c200-0002-7000-8000-000000000060","axis":"output","subject_record_ids":["mss-rec-0198c200-0002-7000-8000-000000000001"],"delta":"creato","assertions":[{"output_id":"SK4-OUT-legacy-core-e2","primary_type":"prova","canonical_version":"23-08-26-e2","recipient":"E4 integrazione e test:mss","problem_or_job":"bypass legacy rendeva controls opzionali","intended_use":"enforcement record nuovi","conceived_by":"SK-4 piano","decided_by":"G3 G5 Matteo 23-08-26","directed_by":"Prompt-sk4-e2","authored_by":"cursor-agent-e2","verified_by":"npm run test:mss exit 0","acceptance_criterion":"MSS-LEGACY-NEW-FORBIDDEN su FX-I11 e capsula sintetica","verification_or_use_evidence":"test:mss 42 fixture; node synthetic fail","verification_status":"self_report","owner_ref":"owner-core","privacy_release":"internal","support_files":["FX-I11-legacy-new.jsonl"],"relations_no_double_count":["solo core/rules/fixture"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"cursor-agent-e2","role":"sk4_e2_legacy_core","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-manifest","evidence_refs":["owner-manifest"],"notes":"prova H-1; chiusura SK-4 resta E4+Matteo"}}}
```

## 7. Chiusura sessione — Q/R verbatim

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «E2 Legacy @docs/Sessioni di lavoro/23-08-26/Prompt-sk4-e2-legacy-core-23-08-26.md leggi il file e il resto della documentazione necessaria per avere ben chiaro il contesto e come lavorare. poi procedi»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato `rules.mjs` (`MSS-LEGACY-NEW-FORBIDDEN`), `core.mjs` (`validateLegacyNewForbidden`, `mergeArtifactHeadRecords`, hook in `validateBundleRecords`), `manifest.json` voce `FX-I11`, file `FX-I11-legacy-new.jsonl` presente, `build-fixtures.mjs` genera FX-I11. Comandi: `node --check` exit 0; `npm run test:mss` exit 0 con messaggio «42 fixture cases»; capsula sintetica → deny code verificato in shell. Hash frozen: 14 voci in manifest.frozen invariate (solo supplemental aggiunto).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineato `build-fixtures.mjs` (drift H-1). Non toccato `CONTRATTO` (E3). Non toccato `adapter.mjs`/`query.mjs` (E1). `PLAN_V0.md` §4-bis S4 resta a E4. Nessuna skill area app — solo MetaSkillSystem validator.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non modificato `adapter.mjs` per passare `historicalSnapshots` a `validateMss` (slot E1/E4; core già pronto). Non aggiornato `PLAN_V0.md` §4-bis S4 (E4). Non commit/push. Baseline B1 «OK prima» non ristampata su codice pre-patch (non disponibile in sessione) — comportamento documentato da V3 21-08 e invertito verificato post-patch.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: Attrito: G3 richiede HEAD dello stesso artifact ma `validatePathContent` oggi passa solo `externalHistory` — miglioria: una riga in E4 che passi `historicalSnapshots` (o head del file corrente) nelle opzioni `validateMss`. Verificato con shell che `historicalSnapshots` in opzioni azzera i deny legacy su report 09-08 committato.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto — mandato E2 + PLAN SK-4 §3 G3/G5 + METASKILL_SYSTEM_SKILL + commento core ~302–303 bastano; non serviva APP_CONTEXT né src. Nessun hook attivo in chat; regole workspace applicate.
