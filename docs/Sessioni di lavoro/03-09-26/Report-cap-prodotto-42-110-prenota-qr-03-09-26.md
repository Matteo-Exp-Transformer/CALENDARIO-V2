# Report — Cap nome/descrizione piatto 42/110 (Prenota + Menu QR) (03-09-26)

**Data:** 03-09-2026 · **Branch:** `env/test` · **HEAD all’avvio:** `b0faef1528042d945aeb58ebd89f5857ccf58a33`  
**Profilo:** Esecuzione · **Modalità:** deep · **Ambiente DB:** TEST (`docnnernvpyrbwuzzach`); nessuna scrittura DB

- **Cosa è cambiato:** in Tab Menu → Modifica Ingredienti il nome del piatto arriva a 42 caratteri e la descrizione a 110 (contatore `42/42` e `110/110`). Lo stesso testo intero compare sulla Pagina Prenota (card menù e riepilogo) e sulla lista piatti del Menu QR, senza taglio a 24/79. Titolo e descrizione categoria restano 24/79.
- **Cosa resta:** niente sul tetto 42/110. Matteo ha confermato Prenota («va bene così, manteniamo»). Commit + push su richiesta.
- **Serve una tua azione:** no.

---

## 2. Cosa è stato fatto

1. **Form prodotto (Tab Menu → Modifica Ingredienti):** Nome prodotto * max 42, Descrizione max 110, contatore `N/max`. Titolo categoria 24 e descrizione categoria 79 invariati (l’overlay non pesca più dal tetto del piatto).
2. **Pagina Prenota:** il cliente vede nome e descrizione piatto fino a 42/110 (card aperta e riga del riepilogo). Categoria ancora 24.
3. **Menu QR lista piatti:** stesso tetto; il nome va a capo, il prezzo resta a destra, niente sfondamento orizzontale a 375px.
4. **Test:** costanti e clamp allineati (42/110 interi; 50→42 e 120→110; categoria 24/79).
5. **DB:** `menu_items.name` / `description` sono `TEXT` senza varchar/CHECK corti (migrazione `001` + schema). Nessuna migrazione.

---

## 3. File toccati e perché

| File | Perché |
|------|--------|
| `src/features/booking/constants/bookingPrenotaTextLimits.ts` | `itemName` 42, `itemDescription` 110; `categoryDescription` 79 esplicito |
| `src/features/booking/constants/__tests__/bookingPrenotaTextLimits.test.ts` | clamp 42/110; categoria resta 24/79 |
| `src/features/booking/constants/__tests__/menuMagazzinoLimits.adminBlindatura.test.ts` | stessi numeri |
| `src/features/booking/components/MenuPricesTab.tsx` | overlay categoria usa `categoryDescription` |
| `src/features/booking/components/publicBooking/BookingSummarySidebar.tsx` | nome riga con wrap |
| `src/pages/PublicMenuCategoryPage.tsx` | clamp 42/110 + wrap vs prezzo |
| skill/mappe (tabella §5) | numeri vivi |
| questo report + judgments | chiusura |

**Non di questa chat** (già sporchi da altre chat): `ERRORI_PROCESSO.md`, `OSSERVAZIONI.md`, `EVOLUZIONE_SKILLS.md`, `FOLLOW_UP.md` (`FU-METODO-SMOKE-ESECUTORE-1`), `METASKILL_SYSTEM_SKILL.md`, `Nota-senior-smoke-esecutore-03-09-26.md`. Non sono consegna di questo mandato.

Storage: nessuna riga scritta. `menu_items.name` / `description` restano `TEXT`.

---

## 4. Test eseguiti e risultato

| Verifica | Esito |
|----------|--------|
| `npm run validate` | verde · lint + typecheck · **164** file test / **1358** test · MSS tools 73 · `validate:mss:views` ok · `check-doc-paths` 197 file / 0 path rotti |
| Vitest cap testo | `bookingPrenotaTextLimits.test.ts` 7 · `menuMagazzinoLimits.adminBlindatura.test.ts` 11 |
| `git diff --check` | da eseguire in coda capsula |
| Layout 375px QR lista piatti | nome 42 a capo (~3 righe), descrizione 110, gap 8px dal prezzo, nessun overlap, nessuno scroll orizzontale (card 343px in viewport 375) |
| Layout 375px Prenota card aperta Antipasti | colonna ~148px (griglia 2); nome 42 e desc 110 a capo, niente overflow orizzontale; il piatto di prova in DB ha ancora descrizione da 79 (salvata col tetto vecchio) |

Nessun fail `mss:capsule` prima del verde: se ne compare uno in coda, va in §4-bis.

### 4-bis. Fail procedura capsula

_(vuoto all’avvio; si riempie solo se l’append o `validate:mss --require-capsule` fallisce.)_

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md` | §E piatto 42/110; categoria 24/79; riga `categoryDescription` | mappa numeri ↔ codice |
| `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` | §3.3 e §9.3 cap piatti 42/110 | form magazzino |
| `docs/Menu-QR-Skill/contesto/MENU_QR_TEXT_LIMITS_MAP.md` | §C piatti ereditano 42/110 + clamp lista | QR mostra, non scrive |
| `docs/Prenota-Skill/PRENOTA_SKILL.md` | §4 numeri attuali | skill d’area |
| `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` | §8.1 42/110 | layout compose |
| `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` | riga test tetti 42/110 | indice suite |
| `docs/SESSION_LOG.md` | riga 03-09-26 | indice |
| `docs/Comunicazione-Skill/OSSERVAZIONI.md` | riga sessione 2 | raccolta dati |

Non toccati: cap carosello Prenota 19/18/38, cap QR card 30/70 e carosello 40/60/125, tetti 6 preset / 6 QR.

---

## 6. Dati comunicazione

- Frasi di Matteo in questa chat: **1** mandato esecutore incollato (sessione 2 cap 42/110). Nessun «lavoro ok» in chat: il mandato stesso chiede report + capsula a fine sessione.
- Formato del mandato: zone etichettate, divieti (categorie 24/79, carosello QR, tetti 7/12/6/6), URL smoke Prenota e QR, prerequisito commit isolato.
- Automatizzabile: numeri e clamp (già in Vitest). Manuale: digitare 42/110 nel form e giudicare se a 375px il testo a più righe sta bene.

### Regia di Matteo (campi fissi)

| Campo | Dato |
|-------|------|
| Opzioni offerte → scelta | nessuna griglia; mandato già chiuso (42/110 sì, categorie no) |
| Vincoli aggiunti da lui | non toccare titolo/descrizione categoria; non toccare cap carosello/card QR; non toccare 7/12/6/6; niente commit |
| Criterio: prima o dopo? | prima (criterio di fatto nel mandato) |
| Cosa NON ha chiesto | unificazione form, migrazione DB, alzare anche le categorie |
| Correzioni: direzione + materia | nessuna in questa chat (un solo turno) |

---

## 6-bis. Registrazione di seduta (MSS)

La capsula viene appesa in coda dal generatore (`mss:capsule --append-to`). I controlli in `controls[]` coincidono con §4.

---

## 7. Analisi flusso prompt, efficienza e statistiche

| Misura | Dato |
|--------|------|
| Prompt sostanziali di Matteo | 1 mandato |
| Correzioni dopo 1ª consegna codice | 0 |
| Follow-up generati da questa chat | 0 |
| Modalità alzata | no (già deep) |
| Commit | no |

Anatomia: il mandato ha tenuto separate le tre zone e ha vietato i tetti da non toccare. Ambiguità di processo: chiede misura visiva 375/834/1280 mentre lo stesso giorno Matteo ha detto che lo smoke lo fa Agente Matteo (`FU-METODO-SMOKE-ESECUTORE-1`). Ho misurato solo 375px (overflow), non le tre view da protocollo QA.

---

## 8. La TUA lettura della sessione

- **Impressioni:** le mappe limiti + magazzino §3.3 erano il pezzo giusto; senza `categoryDescription` separato l’overlay categoria sarebbe salito a 110 per sbaglio.
- **Difficoltà:** (1) working tree con docs Meta sporchi da un’altra chat — non toccati, dichiarati in §3. (2) MCP SQL TEST non autenticato; schema letto da migrazione `001` (`TEXT`). (3) mandato vs volontà smoke: misura 375px per «Ti consiglio», non QA a tre viewport.
- **Migliorie (dato, non modifica skill):** il prepara-prompt di questa sessione 2 ha di nuovo messo URL smoke nel mandato esecutore. Stesso conflitto di `FU-METODO-SMOKE-ESECUTORE-1`. Non promuovo da qui.

---

## 9. Derivazione errori

| Cosa | Classe | Da dove | Come evitarlo |
|------|--------|---------|----------------|
| Overlay categoria usava `itemDescription` | vincolo strutturale | FU-030 aveva unificato 24/79 | `categoryDescription` proprio, test che item ≠ subTab |
| MCP `execute_sql` Unauthorized su TEST | vincolo ambiente | token MCP | schema da `001_schema_completo.sql` + `DB_SCHEMA_CONTEXT.md` |

Nessun pattern nuovo da appendere oltre lo smoke già loggato il 03-09-26.

---

## 10. Cosa resta per la prossima sessione

- **Matteo:** Prenota confermata a vista (03-09-26). Commit + push in questa chiusura.
- **Commit:** in corso su richiesta («fai commit e push»).
- **Processo:** `FU-METODO-SMOKE-ESECUTORE-1` resta aperto (owner Meta senior).

---

## 10-bis. Handoff al prossimo agente

**Cosa è vero adesso.** `BOOKING_MENU_COMPOSE_TEXT_LIMITS` = `{ categoryLabel: 24, categoryDescription: 79, itemName: 42, itemDescription: 110 }`. Form prodotto e clamp Prenota/QR usano item 42/110. Overlay Categorie Menu usa `categoryLabel` / `categoryDescription`. Lista piatti QR: `clampBookingText` + `min-w-0 wrap-break-word`, prezzo `shrink-0`.

**Prossimo task atomico:** smoke visivo Matteo a 375px; poi «fai report finale» = commit isolato (senza i docs Meta sporchi di altre chat).

**Decisioni chiuse (non riaprire):** tetti piatto 42/110 voluti da Matteo con rischio visivo accettato; categorie restano 24/79; niente migrazione TEXT.

**Tentativi:** inject 42/110 in pagina (non persistito) per misurare wrap. Piatto «ant. vegetariano» in DB ha descrizione già da 79 caratteri (tetto vecchio in storage).

**Owner stato:** questo diff uncommitted su `env/test`, HEAD `b0faef1`. DB: nessuno.

**Divieti:** no commit/push senza «fai report finale»; no PROD; no alzare categorie o cap QR card/carosello; no mischiare i file Meta già sporchi.

**Maturità:** G skill scritte; O 375px QR + Prenota card aperta misurati (inject, non digitazione admin); E validate + unit clamp.

Lavoro di esecuzione **terminale** sul mandato 1–6; resta giudizio visivo di Matteo e pubblicazione git.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura (es. `git rev-parse HEAD:<path>` o SHA — stesso dato di `source_refs[].revision_or_hash` in capsula). Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1: Skill lette a HEAD `b0faef1528042d945aeb58ebd89f5857ccf58a33` (blob = `git rev-parse HEAD:<path>`): `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` `279e8a168da7fef5f0fbceca046d29b82f564e11`; `docs/Prenota-Skill/PRENOTA_SKILL.md` `b90a160ea31b52865c6425a4ae318d1d2333a25c`; `docs/Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md` `ec0460736b6a6a1f1a9c186d035c60d220f4aca4`; `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` `aefc4c87f33365a0a8d0d4f2b0989e12c2693ab9`; `docs/Menu-QR-Skill/MENU_QR_SKILL.md` `2db42f3c8bc5ba493b399cb55386e81c604c0c98`; `docs/Menu-QR-Skill/contesto/MENU_QR_TEXT_LIMITS_MAP.md` `c131d02842664b9fd2fcc70a842747ee9b510b14`; `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md` `b677dc51c8b5be55b7fd65da859cb1feb6b84223`; `docs/APP_CONTEXT_SKILL.md` `3ab45078d4e0ee2d4ac356ef3ffa3b2453e22b60`; `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` `77177a7f76b8a7b4cef7e49857a811fd60261218`. Mandato **non** in repo (chat 03-09-26): «Profilo: Esecuzione / Modalità: deep» + skill da leggere + output (1) cap nome 24→42 e descrizione 79→110 nel form Modifica Ingredienti (2) stesso tetto su Prenota e Menu QR lista piatti (3) test (4) mappe §E e MAGAZZINO §3.3 (5) report + capsula (6) npm run validate. «NON toccare titolo/descrizione categoria (restano 24/79). NON toccare cap carosello/card QR. NON toccare tetti 7/12/6/6. NON commit.»

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).
✅ R2: sì — `git diff --stat` su 12 file di questa sessione = 105+/49−; `npm run validate` exit 0 (164/1358) prima dell’append; `mss:capsule` TEST_MSS=pass e GIT_DIFF_CHECK=pass; `validate:mss --require-capsule` → `validate:mss OK` (exit 0).

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).
✅ R3: sì per l’area toccata (mappe Prenota §E, magazzino §3.3, QR §C, PRENOTA_SKILL §4, LAYOUT §8.1, ADMIN_TEST_SUITE_INDEX, SESSION_LOG, OSSERVAZIONI). Non ho messo in §5 i file processo smoke di un’altra chat.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: non commit/push; non migrazione (TEXT, verificato da `001_schema_completo.sql`); non toccare categorie 24/79 né cap QR card/carosello né tetti 6/6; non digitazione admin del form (niente login); non QA 834/1280 — solo misura overflow a 375px (inject 42/110, non persistito) per la riga «Ti consiglio»; non toccare i docs Meta già sporchi.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: attrito = il mandato esecutore chiede ancora URL smoke e 3 view, mentre Matteo lo stesso giorno vuole smoke solo da Agente Matteo; proposta = in Meta senior chiudere `FU-METODO-SMOKE-ESECUTORE-1` e togliere le 3 view dal Prompt 2 in poi.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: giusto (magazzino intero + Prenota skill/mappe/layout + QR skill/mappa limiti + UI_RESPONSIVE + APP_CONTEXT §4/§7 + CHIUSURA). Senza leggere il form overlay avrei alzato anche la descrizione categoria. Hook `stop` non ancora scattato in questa chiusura.

❓ Q7 — Prova nuova: quale **prova utile** hai visto in questa seduta che oggi **non** misuriamo? Una riga: **che cosa separerebbe** e **come si giudica** (chi guarda, con quale fonte, quanto costa). Se non ne hai viste, scrivi `nessuna` e di' **su cosa** ti aspettavi di trovarne una.
✅ R7: a 375px la card Prenota aperta è ~148px (2 colonne): 42 caratteri fanno ~3–4 righe di nome e 110 ~6–7 di descrizione — separa «sta» vs «troppo alto»; giudica Matteo guardando Antipasti aperta, ~20 secondi, senza strumento nuovo.

---

## 12. Self-review del report

1. Triade MSS: `validate` già verde; `test:mss` in coda capsula; `validate:mss --require-capsule` subito dopo append.
2. §5 skill allineate in questo ciclo, non rimandate.
3. §11 compilata; handoff ricostruibile; tono su schermate.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a064e0-b2b1-7fc1-81b9-cebcd77a5f17","correlation_id":"mss-cor-01a064e0-b2b1-79e2-9134-432e3084a708","segment_no":1,"created_at":"2026-09-03T03:27:22+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-esecutore-cap-42-110-03-09-26","actor_type":"agente","role":"agente esecutore","agent_runtime":{"provider":"Cursor","model":"Cursor Grok 4.6","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a064e0-b2b1-76bc-b3f8-ee68c7e887db","capture_key":"mss-ses-01a064e0-b2b1-7fc1-81b9-cebcd77a5f17/1/session_event/1","event":{"event_id":"mss-evt-01a064e0-b2b1-7a82-b05a-4646def03858","event_kind":"session_close","occurred_at":"2026-09-03T03:27:22+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"agente esecutore","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD b0faef1; 21 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/03-09-26/Report-cap-prodotto-42-110-prenota-qr-03-09-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/03-09-26/Report-cap-prodotto-42-110-prenota-qr-03-09-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"TEST_MSS","criterio":"npm run test:mss (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"GIT_DIFF_CHECK","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/ERRORI_PROCESSO.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/OSSERVAZIONI.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/FOLLOW_UP.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/Menu-QR-Skill/contesto/MENU_QR_TEXT_LIMITS_MAP.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"docs/Prenota-Skill/PRENOTA_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-11","owner_id":"git-working-tree","uri_or_path":"docs/Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-12","owner_id":"git-working-tree","uri_or_path":"docs/SESSION_LOG.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-13","owner_id":"git-working-tree","uri_or_path":"src/features/booking/components/MenuPricesTab.tsx","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-14","owner_id":"git-working-tree","uri_or_path":"src/features/booking/components/publicBooking/BookingSummarySidebar.tsx","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-15","owner_id":"git-working-tree","uri_or_path":"src/features/booking/constants/__tests__/bookingPrenotaTextLimits.test.ts","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-16","owner_id":"git-working-tree","uri_or_path":"src/features/booking/constants/__tests__/menuMagazzinoLimits.adminBlindatura.test.ts","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-17","owner_id":"git-working-tree","uri_or_path":"src/features/booking/constants/bookingPrenotaTextLimits.ts","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"},{"ref_id":"source-git-18","owner_id":"git-working-tree","uri_or_path":"src/pages/PublicMenuCategoryPage.tsx","stable_anchor_or_event_id":"working tree","revision_or_hash":"b0faef1","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a064e0-b2b1-7fc1-81b9-cebcd77a5f17","correlation_id":"mss-cor-01a064e0-b2b1-79e2-9134-432e3084a708","segment_no":1,"created_at":"2026-09-03T03:27:22+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-esecutore-cap-42-110-03-09-26","actor_type":"agente","role":"agente esecutore","agent_runtime":{"provider":"Cursor","model":"Cursor Grok 4.6","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a064e0-b2b1-73cc-a89e-25d0e09f68df","capture_key":"mss-ses-01a064e0-b2b1-7fc1-81b9-cebcd77a5f17/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a064e0-b2b1-7e5e-be26-43c68a26ee93","axis":"persona","subject_record_ids":["mss-rec-01a064e0-b2b1-76bc-b3f8-ee68c7e887db"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"cursor-grok-esecutore-cap-42-110-03-09-26","role":"agente esecutore","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a064e0-b2b1-7fc1-81b9-cebcd77a5f17","correlation_id":"mss-cor-01a064e0-b2b1-79e2-9134-432e3084a708","segment_no":1,"created_at":"2026-09-03T03:27:22+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-esecutore-cap-42-110-03-09-26","actor_type":"agente","role":"agente esecutore","agent_runtime":{"provider":"Cursor","model":"Cursor Grok 4.6","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a064e0-b2b1-7d35-bcaa-380eb2c1fe5d","capture_key":"mss-ses-01a064e0-b2b1-7fc1-81b9-cebcd77a5f17/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a064e0-b2b1-730b-bfd4-f2f575004dd1","axis":"sistema","subject_record_ids":["mss-rec-01a064e0-b2b1-76bc-b3f8-ee68c7e887db"],"delta":"modificato","assertions":[{"rule_id_version":"PRENOTA_TEXT_LIMITS_MAP@piatto-42-110-03-09-26","trigger_event":"Mandato Matteo: alzare nome prodotto 24→42 e descrizione 79→110; categorie restano 24/79; stesso tetto su Prenota e lista piatti QR","decision_or_output_changed":"BOOKING_MENU_COMPOSE_TEXT_LIMITS: itemName 42, itemDescription 110, categoryLabel 24, categoryDescription 79. Overlay Categorie Menu non usa più itemDescription. Clamp silenzioso anche sulla lista piatti Menu QR. Mappe §E magazzino §3.3 e QR §C allineate.","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"cursor-grok-esecutore-cap-42-110-03-09-26","role":"agente esecutore","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a064e0-b2b1-7fc1-81b9-cebcd77a5f17","correlation_id":"mss-cor-01a064e0-b2b1-79e2-9134-432e3084a708","segment_no":1,"created_at":"2026-09-03T03:27:22+02:00","finalization":"final","recorded_by":{"actor_id":"cursor-grok-esecutore-cap-42-110-03-09-26","actor_type":"agente","role":"agente esecutore","agent_runtime":{"provider":"Cursor","model":"Cursor Grok 4.6","runtime":"Cursor Agent","surface":"1"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a064e0-b2b1-7388-9aa5-0af20483a223","capture_key":"mss-ses-01a064e0-b2b1-7fc1-81b9-cebcd77a5f17/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a064e0-b2b1-769d-82fd-235f00c662d5","axis":"output","subject_record_ids":["mss-rec-01a064e0-b2b1-76bc-b3f8-ee68c7e887db"],"delta":"creato","assertions":[{"output_id":"cap-prodotto-42-110-prenota-qr-03-09-26","primary_type":"prodotto","canonical_version":"docs/Sessioni di lavoro/03-09-26/Report-cap-prodotto-42-110-prenota-qr-03-09-26.md","recipient":"Matteo","problem_or_job":"nel form Modifica Ingredienti si digitano 42 caratteri nel nome e 110 in descrizione; Prenota e Menu QR mostrano il testo intero senza taglio a 24/79","intended_use":"guardare a 375px; se non convince, revert solo di questo diff dopo commit isolato","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"mandato chat 03-09-26 Profilo Esecuzione deep sessione 2","authored_by":"cursor-grok-esecutore-cap-42-110-03-09-26","verified_by":"non_osservato","acceptance_criterion":"npm run validate verde; costanti 42/110; categoria 24/79; clamp Prenota e QR allo stesso tetto; contatore N/max nel form prodotto; niente migrazione (TEXT)","verification_or_use_evidence":"npm run validate 164/1358; Vitest bookingPrenotaTextLimits + menu-magazzino-limits; misura 375px wrap senza overlap","verification_status":"self_report","owner_ref":"docs/Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md","privacy_release":"internal","support_files":["src/features/booking/constants/bookingPrenotaTextLimits.ts","src/features/booking/components/MenuPricesTab.tsx","src/pages/PublicMenuCategoryPage.tsx","src/features/booking/components/publicBooking/BookingSummarySidebar.tsx"],"relations_no_double_count":["Non include tetti 7/12/6/6 (sessione 1). Non include cap carosello/card QR 30/70 40/60/125. Non include titolo/descrizione categoria (restano 24/79)."],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"cursor-grok-esecutore-cap-42-110-03-09-26","role":"agente esecutore","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
