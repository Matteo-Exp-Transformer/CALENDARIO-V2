# Masterplan Allineamento — skill system ↔ codice

> **Cos'è questo file.** È l'**indice canonico in repo** per riallineare lo skill system al codice reale
> e mantenere l'allineamento nel tempo. Fonte unica per agenti e sessioni: non sostituisce i report di
> analisi, ma li trasforma in Work Package eseguibili.
> Si aggiorna a ogni WP chiuso, come `MASTERPLAN_BLINDATURA.md`: stato in alto, dettaglio operativo sotto.

---

## Context — perché questo plan

Le analisi del 12-06-26 hanno evidenziato tre fronti collegati: codice solido ma con rischi reali,
skill system utile ma appesantito e disallineato in punti critici, e documentazione commerciale/legale
da portare a decisioni operative. Fonti: [solidità codice](Sessioni%20di%20lavoro/12-06-26/Report-analisi-solidita-codice-12-06-26.md),
[skill system](Sessioni%20di%20lavoro/12-06-26/Report-analisi-skill-system-12-06-26.md),
[legale e vendita](Sessioni%20di%20lavoro/12-06-26/Report-analisi-legale-vendita-12-06-26.md).
Questo masterplan non ricopia i finding: li indicizza in WP atomici, con ordine, file, verifiche e cancelli.
In questa creazione non viene eseguito nessun WP.

---

## Regole d'ingaggio

- **Un WP per sessione.** L'agente esegue solo il WP assegnato nel prompt; tutto il resto è vietato anche se sembra facile.
- **Prima del codice:** caricare `docs/APP_CONTEXT_SKILL.md` §0 e poi solo le skill indicate per l'area toccata.
- **Ogni WP ha sempre 6 campi fissi:** Obiettivo · File esatti · Passi numerati · Verifica · Vietato · Cancello.
- **DB:** prima di INSERT/UPDATE/DELETE/migrazioni via MCP chiamare `get_project_url`; `rwuxgvld` = PROD = STOP e conferma esplicita di Matteo; TEST prima, PROD solo dopo QA.
- **Chiusura:** report secondo `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` §11, aggiornamento tabella Stato masterplan, e riga FU in `docs/FOLLOW_UP.md` quando il WP crea/chiude debiti.
- **Se un passo non corrisponde al file reale:** fermarsi, segnalare nel report, non improvvisare adattamenti.
- **Report storici:** i file in `docs/Sessioni di lavoro/` sono fonti, non target di bonifica, salvo WP che dica esplicitamente uno spostamento futuro.

---

## Stato per milestone

Legenda: ✅ fatto · 🔶 in corso/parziale · ⬜ da fare.

| Milestone | WP | Stato | Cancello | Report |
|---|---|---|---|---|
| AL-A | WP-A1 — Rimandi `PUBLIC_MENU_*` | ✅ | Nessun rimando attivo rotto nei file vivi | [Report](Sessioni%20di%20lavoro/12-06-26/Report-wp-a1-public-menu-rimandi-12-06-26.md) |
| AL-A | WP-A2 — FU-ALL fallback/tier | ✅ | FU nuovi non riciclati e registro coerente | [Report](Sessioni%20di%20lavoro/12-06-26/Report-wp-a2-fu-all-fallback-tier-12-06-26.md) |
| AL-A | WP-A3 — Contatori test nei docs | ✅ | Nessun contatore test hardcoded nei file target | [Report](Sessioni%20di%20lavoro/12-06-26/Report-wp-a3-contatori-test-12-06-26.md) |
| AL-A | WP-A4 — APP_CONTEXT/ADMIN_CLASSIC puntuali | ✅ | Routing e struttura docs coerenti col codice | [Report](Sessioni%20di%20lavoro/12-06-26/Report-wp-a4-app-context-admin-classic-12-06-26.md) |
| AL-A | WP-A5 — Database-Skill | ✅ | DB docs puntano alle fonti vive e note anomalie | [Report](Sessioni%20di%20lavoro/12-06-26/Report-wp-a5-database-skill-12-06-26.md) |
| AL-A | WP-A6 — Routing masterplan/capienza | ✅ | §0 instrada capienza e masterplan senza vicoli ciechi | [Report](Sessioni%20di%20lavoro/12-06-26/Report-wp-a6-routing-capienza-masterplan-12-06-26.md) |
| AL-B | WP-B1 — Migrazioni ↔ DB reale | ✅ | Drift critico codificato o documentato con QA senior | [Report](Sessioni%20di%20lavoro/12-06-26/Report-wp-b1-migrazioni-db-12-06-26.md) |
| AL-B | WP-B2 — `restaurant_settings` cross-tenant | ✅ | Lettura anon ristretta senza rompere Prenota/Menu QR | [Report](Sessioni%20di%20lavoro/12-06-26/Report-wp-b2-restaurant-settings-cross-tenant-12-06-26.md) |
| AL-B | WP-B3 — Guard tenant pubblico/admin | ✅ | Tenant pubblico non sovrascritto da sessione admin | [Report](Sessioni%20di%20lavoro/12-06-26/Report-wp-b3-guard-tenant-pubblico-admin-12-06-26.md) |
| AL-B | WP-B4 — `create-booking` hardening | ⬜ | Tenant inattivi bloccati e rate limit conta i respinti | — |
| AL-B | WP-B5 — Slot availability + cleanup rate limits | ⬜ | Scelta applicata e deploy/deprecazione coerenti | — |
| AL-C | WP-C1 — Codice morto | ✅ | Import zero prima delete, validate verde dopo | [Report](Sessioni%20di%20lavoro/12-06-26/Report-wp-c1-codice-morto-12-06-26.md) |
| AL-C | WP-C2 — Logger | ✅ | Convenzione `logger.*` rispettata nei target | [Report](Sessioni%20di%20lavoro/12-06-26/Report-wp-c2-logger-12-06-26.md) |
| AL-C | WP-C3 — `package.json` | ✅ | Dipendenze classificate senza regressione build | [Report](Sessioni%20di%20lavoro/12-06-26/Report-wp-c3-package-json-12-06-26.md) |
| AL-D | WP-D1 — Fusione Menu admin context | ⬜ | Ok Matteo file per file, rimandi aggiornati | — |
| AL-D | WP-D2 — Fusione Dashboard-laterale | ⬜ | Ok Matteo file per file, una sola area Admin | — |
| AL-D | WP-D3 — Potatura `ADMIN_CLASSIC_SKILL.md` | ⬜ | Changelog obsoleto rimosso, LOCK vivi preservati | — |
| AL-D | WP-D4 — Snellimento `.claude/CLAUDE.md` | ⬜ | Gemello stile `AGENTS.md`, senza duplicazioni vive | — |
| AL-D | WP-D5 — Archiviazione plan/report Menu QR | ⬜ | File storici spostati e rimandi non rotti | — |
| AL-F | WP-F1 — Prezzi edition | ⬜ | Prezzi approvati da Matteo scritti nel context | — |
| AL-F | WP-F2 — Stato legale produzione | ⬜ | Nuove voci legali approvate e tracciate | — |
| AL-E | WP-E1 — Mini-pack area | ⬜ | Decisione Meta e design approvati | — |
| AL-E | WP-E2 — Check automatico path docs | ⬜ | Decisione Meta e design approvati | — |
| AL-E | WP-E3 — Anti-storia + protocollo §7 | ⬜ | Decisione Meta e design approvati | — |

---

## AL-A — Bonifica meccanica docs

Rischio basso, prima di tutto: ripara il routing che gli agenti useranno nei WP successivi.

### WP-A1 — Rimandi `PUBLIC_MENU_*` verso Menu QR

- **Obiettivo:** sostituire i vecchi rimandi `PUBLIC_MENU_*` nei file vivi con i percorsi attuali `docs/Menu-QR-Skill/`.
- **File esatti:**
  - `docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md`
  - `docs/Comunicazione-Skill/VOCABOLARIO.md`
  - `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`
  - `docs/Menu-QR-Skill/contesto/MENU_QR_LAYOUT_CONTEXT.md`
  - `docs/Menu-QR-Skill/contesto/MENU_QR_DATA_FLOW_CONTEXT.md`
- **Passi numerati:**
  1. Cercare `PUBLIC_MENU_SKILL`, `PUBLIC_MENU_DATA_FLOW_CONTEXT`, `PUBLIC_MENU_LAYOUT_CONTEXT` solo fuori da `docs/Sessioni di lavoro/`.
  2. In `MENU_ADMIN_CONTEXT.md`, sostituire i rimandi attivi con `docs/Menu-QR-Skill/MENU_QR_SKILL.md` e `docs/Menu-QR-Skill/contesto/MENU_QR_DATA_FLOW_CONTEXT.md`.
  3. In `VOCABOLARIO.md`, aggiornare i comportamenti agente che caricano `PUBLIC_MENU_SKILL` verso `docs/Menu-QR-Skill/MENU_QR_SKILL.md`.
  4. In `PRENOTA_DATA_FLOW_CONTEXT.md`, sostituire il rimando delete sync verso `docs/Menu-QR-Skill/contesto/MENU_QR_DATA_FLOW_CONTEXT.md`.
  5. In `MENU_QR_LAYOUT_CONTEXT.md`, sostituire i rimandi a skill/data-flow legacy con i path Menu QR attuali.
  6. In `MENU_QR_DATA_FLOW_CONTEXT.md`, trasformare il riferimento a `PUBLIC_MENU_LAYOUT_CONTEXT.md` in riferimento al layout context attuale.
- **Verifica:** `rg "PUBLIC_MENU_(SKILL|DATA_FLOW|LAYOUT)" docs --glob "!Sessioni di lavoro/**"` non deve mostrare rimandi attivi nei file vivi; i report storici possono restare invariati.
- **Vietato:** non modificare report storici in `docs/Sessioni di lavoro/`; non spostare file; non cambiare contenuto funzionale dei context.
- **Cancello:** grep pulito sui file vivi + revisione leggera di Matteo.

### WP-A2 — Follow-up globali senza riciclo ID

- **Obiettivo:** correggere il mismatch FU nel router senza riciclare `FU-023` e `FU-024`.
- **File esatti:**
  - `docs/APP_CONTEXT_SKILL.md`
  - `docs/FOLLOW_UP.md`
- **Passi numerati:**
  1. Verificare nel registro che `FU-023` e `FU-024` abbiano già significati diversi.
  2. Coniare `FU-ALL-FALLBACK` per l'audit fallback globale.
  3. Coniare `FU-ALL-TIER` per la milestone futura sugli skill tier/mini-pack.
  4. Aggiornare i rimandi in `APP_CONTEXT_SKILL.md` §0, §4c, §4d e §7.2.
  5. Registrare i due nuovi FU in `docs/FOLLOW_UP.md` con report di chiusura del WP.
  6. Nel report, scrivere esplicitamente che `FU-023` e `FU-024` non sono stati riciclati.
- **Verifica:** `rg "FU-023|FU-024|FU-ALL-" docs/APP_CONTEXT_SKILL.md docs/FOLLOW_UP.md` mostra fallback/tier solo come `FU-ALL-*`; `FU-023` e `FU-024` mantengono il loro significato storico.
- **Vietato:** non rinominare i FU storici; non chiudere o modificare debiti non coinvolti.
- **Cancello:** registro FU coerente e approvazione Matteo sul naming.

### WP-A3 — Rimuovere contatori test hardcoded dai docs

- **Obiettivo:** eliminare numeri di test destinati a marcire, sostituendoli con comandi e risultato atteso.
- **File esatti:**
  - `.claude/CLAUDE.md`
  - `docs/APP_CONTEXT_SKILL.md`
  - eventuali altri `.md` vivi trovati da grep mirato
- **Passi numerati:**
  1. Cercare contatori test hardcoded nei docs vivi con grep mirato.
  2. In `.claude/CLAUDE.md`, sostituire il conteggio test con "`npm run test` deve essere verde".
  3. In `APP_CONTEXT_SKILL.md` §5, sostituire il conteggio test con "`npm run test` deve essere verde".
  4. Ripetere solo per contatori equivalenti in file vivi; non toccare report storici.
  5. Nel report, elencare ogni sostituzione.
- **Verifica:** grep mirato non trova più contatori test hardcoded nei file vivi modificati; `npm run validate` verde.
- **Vietato:** non aggiornare il numero con un numero più recente; non toccare statistiche nei report storici.
- **Cancello:** nessun contatore test vivo nei file target + validate verde.

### WP-A4 — Fix puntuali APP_CONTEXT e ADMIN_CLASSIC

- **Obiettivo:** riallineare struttura e rimandi puntuali già segnalati dal report skill system.
- **File esatti:**
  - `docs/APP_CONTEXT_SKILL.md`
  - `docs/ADMIN_CLASSIC_SKILL.md`
- **Passi numerati:**
  1. In `APP_CONTEXT_SKILL.md` §3, rimuovere `PublicMenuPresetPage` dall'albero `src/` se non esiste più.
  2. In `APP_CONTEXT_SKILL.md` §3, aggiungere `src/features/booking/services/` se presente nel codice.
  3. In `APP_CONTEXT_SKILL.md` §4, togliere il conteggio dal LOCK `CollapsibleCard`.
  4. In `ADMIN_CLASSIC_SKILL.md` §1, correggere il rimando inesistente a `APP_CONTEXT §3a`.
  5. Verificare che i path citati esistano davvero prima di salvare.
- **Verifica:** `rg "PublicMenuPresetPage|§3a|CollapsibleCard.*test" docs/APP_CONTEXT_SKILL.md docs/ADMIN_CLASSIC_SKILL.md` non mostra più le affermazioni obsolete.
- **Vietato:** non riscrivere §0; non potare changelog storico in questo WP (spetta a WP-D3).
- **Cancello:** path verificati + nessun rimando rotto nei due file.

### WP-A5 — Riallineare Database-Skill

- **Obiettivo:** togliere false fonti di verità DB e riportare i context a fonti verificabili.
- **File esatti:**
  - `docs/DATABASE.md`
  - `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md`
  - `docs/Database-Skill/DB_SCHEMA_CONTEXT.md`
  - `supabase/migrations/` (sola lettura per verifica)
- **Passi numerati:**
  1. In `DATABASE.md`, correggere la nota sulla prossima migrazione se la migrazione indicata esiste già.
  2. In `DB_MIGRATIONS_CONTEXT.md`, sostituire l'elenco statico marcito con "fonte = `supabase/migrations/` + `list_migrations` MCP", mantenendo solo anomalie storiche utili.
  3. In `DB_SCHEMA_CONTEXT.md`, aggiornare le colonne introdotte dalle migrazioni recenti, inclusa `is_available`.
  4. Verificare i nomi dei file migrazione con Glob e, per DB remoto, solo lettura via MCP se richiesta dal WP.
  5. Nel report, distinguere fonte versionata e stato remoto.
- **Verifica:** i tre file non dichiarano più una numerazione futura già consumata; i path migrazione citati esistono; `npm run validate` verde.
- **Vietato:** non applicare migrazioni; non generare tipi; non scrivere su DB.
- **Cancello:** revisione senior leggera sui docs DB.

### WP-A6 — Routing capienza e masterplan

- **Obiettivo:** impedire che un agente cada nel vuoto su capienza/limiti coperti e masterplan.
- **File esatti:**
  - `docs/APP_CONTEXT_SKILL.md`
  - `docs/Prenota-Skill/PRENOTA_SKILL.md`
  - `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md` (sola lettura)
  - `supabase/functions/create-booking/` (sola lettura)
  - `docs/MASTERPLAN_BLINDATURA.md`
  - `docs/MASTERPLAN_ALLINEAMENTO.md`
- **Passi numerati:**
  1. In `APP_CONTEXT_SKILL.md` §0, aggiungere routing per "limite coperti/capienza" verso `ADMIN_SETTINGS_CONTEXT.md` + edge `create-booking`.
  2. In `APP_CONTEXT_SKILL.md` §0, aggiungere routing per "masterplan blindatura/allineamento" verso `docs/MASTERPLAN_*.md`.
  3. In `PRENOTA_SKILL.md` §6, aggiungere nota: limiti capienza = area Admin/Settings + server edge.
  4. Verificare che i path citati esistano.
  5. Aggiornare il report con il motivo: evitare vicolo cieco per task Prenota formulati in linguaggio utente.
- **Verifica:** ricerca di "capienza", "limite coperti", "masterplan" in `APP_CONTEXT_SKILL.md` e `PRENOTA_SKILL.md` porta ai path corretti.
- **Vietato:** non eseguire fix di capienza; non modificare `create-booking`; non cambiare contenuti di questo masterplan oltre allo stato del WP.
- **Cancello:** Matteo conferma che il routing è comprensibile.

---

## AL-B — Codice: fix critici dal report solidità

Questa milestone chiude rischi reali. B1 e B2 richiedono profilo senior + Matteo.

### WP-B1 — Riallineare migrazioni ↔ DB reale

- **Obiettivo:** rendere ricostruibile il DB codificando o documentando il drift reale tra migrazioni e ambienti.
- **File esatti:**
  - `supabase/migrations/`
  - `docs/DATABASE.md`
  - `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md`
  - `docs/Database-Skill/DB_SCHEMA_CONTEXT.md`
- **Passi numerati:**
  1. Caricare DB skill e regole PROD/TEST.
  2. Su TEST, via MCP sola lettura, confrontare policy reali con migrazioni versionate.
  3. Preparare una migrazione nuova che codifica `anon_select_active_organizations` e le policy reali di `restaurant_settings`, oppure documentare alternativa `supabase db pull` se scelta da senior+Matteo.
  4. Applicare prima su TEST solo dopo `get_project_url = docnnernvp`.
  5. QA pubblico Prenota/Menu QR su TEST.
  6. Solo dopo QA e conferma esplicita, valutare PROD in sola lettura o applicazione controllata.
- **Verifica:** confronto DB↔repo su TEST pulito; su PROD almeno confronto sola lettura documentato; `npm run validate` verde.
- **Vietato:** non scrivere su PROD senza conferma; non "aggiustare" policy a memoria; non accorpare WP-B2.
- **Cancello:** senior + Matteo approvano l'allineamento.

### WP-B2 — Chiudere lettura cross-tenant `restaurant_settings`

- **Obiettivo:** restringere l'accesso anonimo a `restaurant_settings` senza rompere le pagine pubbliche.
- **File esatti:**
  - `supabase/migrations/`
  - `src/features/booking/lib/restaurantSettingRegistry.ts`
  - hook pubblici Prenota/Menu QR che leggono settings
  - `docs/Database-Skill/DB_SCHEMA_CONTEXT.md`
  - `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`
  - `docs/Menu-QR-Skill/contesto/MENU_QR_DATA_FLOW_CONTEXT.md`
- **Passi numerati:**
  1. Elencare le chiavi realmente lette da pubblico usando `restaurantSettingRegistry.ts` e hook pubblici.
  2. Scegliere pattern senior: whitelist policy o vista pubblica filtrata.
  3. Scrivere migrazione su TEST con `get_project_url = docnnernvp`.
  4. Eseguire QA Prenota e Menu QR pubblici su TEST.
  5. Aggiornare context DB e data-flow coinvolti.
  6. PROD solo con conferma esplicita e dopo QA.
- **Verifica:** anon non può leggere settings di altri tenant fuori whitelist/vista; Prenota/Menu QR pubblici continuano a funzionare; `npm run validate` verde.
- **Vietato:** non restringere prima di mappare le chiavi pubbliche; non rompere `supabasePublic`; non trattare il fix come solo doc.
- **Cancello:** senior + Matteo approvano QA e deploy.

### WP-B3 — Guard tenant pubblico/admin

- **Obiettivo:** impedire che una sessione admin sovrascriva il tenant risolto da `/prenota/:slug` o `/menu/:slug`.
- **File esatti:**
  - `src/contexts/AdminAuthContext.tsx`
  - `src/contexts/TenantContext.tsx`
  - `src/router.tsx` (solo se strettamente necessario)
  - `docs/FOLLOW_UP.md` (`FU-AUTH-2`)
  - skill/context auth collegati da `APP_CONTEXT_SKILL.md` §0
- **Passi numerati:**
  1. Caricare skill auth/data-flow e LOCK TenantContext.
  2. Riprodurre mentalmente il flusso: route pubblica con sessione admin già presente.
  3. Aggiungere guard perché route pubblica non riceva tenant da sessione admin.
  4. Collegare il lavoro a `FU-AUTH-2`, senza creare doppioni.
  5. Testare pubblico Prenota/Menu QR + admin login.
- **Verifica:** aprendo route pubblica con admin loggato, il tenant resta quello dello slug; validate verde.
- **Vietato:** non cambiare il contratto dei due client Supabase; non introdurre fallback tenant hardcoded.
- **Cancello:** QA pubblico/admin documentata nel report.

### WP-B4 — Hardening `create-booking`

- **Obiettivo:** bloccare prenotazioni per tenant inattivi e contare anche i tentativi respinti nel rate limit.
- **File esatti:**
  - `supabase/functions/create-booking/`
  - `supabase/migrations/` se serve supporto DB
  - test collegati a booking pubblico
  - docs DB/Prenota toccati dal comportamento
- **Passi numerati:**
  1. Caricare skill DB + Prenota data-flow.
  2. Filtrare `organizations.is_active = true` nella risoluzione tenant.
  3. Registrare l'IP anche per tentativi respinti dalla validazione, evitando TOCTOU evidenti.
  4. Deploy TEST e smoke con payload valido/non valido.
  5. PROD solo con conferma esplicita dopo QA.
  6. Aggiornare docs collegati.
- **Verifica:** tenant inattivo non riceve prenotazioni; tentativi respinti incrementano rate limit; validate verde.
- **Vietato:** non cambiare `verify_jwt:false`; non alterare limiti testo/capienza fuori scope.
- **Cancello:** smoke TEST ok + conferma Matteo per PROD.

### WP-B5 — `check-slot-availability` e `cleanup_rate_limits`

- **Obiettivo:** decidere e applicare il destino dei controlli disponibilità e cleanup rate limit.
- **File esatti:**
  - `src/features/booking/hooks/useCheckSlotAvailability.ts` o hook equivalente
  - `supabase/functions/check-slot-availability/`
  - `supabase/functions/create-booking/`
  - migrazioni/funzioni DB legate a `cleanup_rate_limits`
  - docs DB/Prenota toccati
- **Passi numerati:**
  1. Verificare funzioni deployate su TEST e PROD in sola lettura.
  2. Decidere con Matteo: deployare `check-slot-availability` o rimuovere la chiamata client fail-open.
  3. Decidere con Matteo: schedulare cleanup con supporto reale o deprecare `cleanup_rate_limits`.
  4. Applicare su TEST.
  5. QA prenotazione pubblica.
  6. PROD solo con conferma esplicita.
- **Verifica:** niente chiamate a funzioni non deployate; rate limit ha strategia di pulizia o deprecazione documentata; validate verde.
- **Vietato:** non lasciare una chiamata fail-open non documentata; non installare estensioni PROD senza conferma.
- **Cancello:** decisione Matteo + QA TEST.

---

## AL-C — Codice: pulizia mirata

Rischio basso, dopo i fix critici. Non duplicare debiti già governati da `MASTERPLAN_BLINDATURA.md`.

### WP-C1 — Eliminare codice morto

- **Obiettivo:** rimuovere componenti/hook non importati che possono confondere agenti futuri.
- **File esatti:**
  - `src/features/booking/components/AcceptBookingModal.tsx`
  - `src/features/booking/components/publicBooking/BookingCrossShineSubmitButton.tsx`
  - `src/features/booking/components/PublicMenuPageHeader.tsx`
  - `src/features/booking/hooks/useBookingRequests.ts`
  - `src/features/booking/hooks/useUpdateBookingStatus.ts` se presente
  - `src/lib/email.ts` per `sendBookingCancelledEmail` solo se confermato orfano
- **Passi numerati:**
  1. Per ogni file, fare grep import prima di cancellare.
  2. Se import = 0, cancellare il file.
  3. Per hook duplicati, verificare che nessuna route/test li usi.
  4. Per `sendBookingCancelledEmail`, verificare chiamanti prima di rimuovere.
  5. Eseguire validate.
- **Verifica:** import zero prima delete; `npm run validate` verde.
- **Vietato:** non cancellare file con import residui; non rifattorizzare booking mutations in questo WP.
- **Cancello:** validate verde e report con elenco import verificati.

### WP-C2 — Logger coerente

- **Obiettivo:** sostituire `console.error/warn` applicativi con `logger.*`.
- **File esatti:**
  - file applicativi trovati da grep `console.error|console.warn`
  - `src/lib/logger.ts` (sola lettura salvo necessità motivata)
  - `docs/FOLLOW_UP.md` (`FU-LOG-1`)
- **Passi numerati:**
  1. Cercare `console.error` e `console.warn` in `src/`, esclusi test se deciso.
  2. Importare `logger` dove manca.
  3. Sostituire con `logger.error` / `logger.warn`, preservando messaggi e dati utili.
  4. Collegare il WP a `FU-LOG-1`.
  5. Eseguire lint/typecheck/validate.
- **Verifica:** grep target pulito o residui motivati; validate verde.
- **Vietato:** non cambiare logica di errore; non usare `console.log`; non chiudere FU-LOG-1 se restano residui.
- **Cancello:** convenzione logger rispettata nei target dichiarati.

### WP-C3 — Pulizia `package.json`

- **Obiettivo:** classificare correttamente dipendenze e rimuovere solo pacchetti davvero inutilizzati.
- **File esatti:**
  - `package.json`
  - lockfile del package manager
  - eventuali import `@vercel/node`
- **Passi numerati:**
  1. Verificare uso reale di `@types/qrcode` e spostarlo in devDependencies se è solo tipo.
  2. Cercare import/uso di `@vercel/node`.
  3. Se inutilizzato, proporre o rimuovere con package manager.
  4. Eseguire install/update lockfile solo via package manager.
  5. Eseguire validate/build se necessario.
- **Verifica:** lockfile coerente; validate verde; nessuna import mancante.
- **Vietato:** non rimuovere dipendenze pesanti solo perché sembrano grandi; non editare lockfile a mano.
- **Cancello:** package manager + validate confermano.

**Nota AL-C:** `FU-EMAIL-1`, `FU-TYPES-1` e `FU-TEST-1` restano governati da `MASTERPLAN_BLINDATURA.md` M5/M6 o milestone naturale. Qui non si crea doppia gestione.

---

## AL-D — Docs: fusioni e spostamenti

Ogni WP richiede ok esplicito di Matteo file per file. Sono cambi strutturali della documentazione.

### WP-D1 — Fondere Menu admin context

- **Obiettivo:** avere una sola fonte per il magazzino Menu admin.
- **File esatti:**
  - `docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md`
  - `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md`
  - `docs/APP_CONTEXT_SKILL.md`
- **Passi numerati:**
  1. Chiedere ok esplicito a Matteo per i file da fondere.
  2. Confrontare i due context e trasferire solo contenuti vivi nel context Admin.
  3. Lasciare tombstone breve al vecchio path oppure rimuoverlo solo se Matteo approva.
  4. Aggiornare `APP_CONTEXT_SKILL.md` §0 verso il nuovo path.
  5. Grep rimandi entranti.
- **Verifica:** nessun rimando rotto; una fonte viva per limiti/cap/promo magazzino.
- **Vietato:** non cancellare senza ok file per file; non perdere note LOCK.
- **Cancello:** conferma Matteo + grep rimandi ok.

### WP-D2 — Fondere `Dashboard-laterale-skill/` in Admin-Skill

- **Obiettivo:** ridurre il doppio sistema skill Admin shell.
- **File esatti:**
  - `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md`
  - `docs/Dashboard-laterale-skill/ADMIN_SHELL_CONTEXT.md`
  - `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md`
  - `docs/Admin-Skill/`
  - `docs/APP_CONTEXT_SKILL.md`
- **Passi numerati:**
  1. Chiedere ok esplicito a Matteo per ogni file.
  2. Mappare cosa è vivo e cosa è storia.
  3. Spostare/fondere il vivo in `docs/Admin-Skill/`.
  4. Lasciare tombstone o rimuovere solo con ok.
  5. Aggiornare §0 e rimandi entranti.
- **Verifica:** grep path vecchi = solo tombstone o report storici; nessun link vivo rotto.
- **Vietato:** non fondere durante un WP codice Admin; non cambiare regole edition.
- **Cancello:** conferma Matteo file per file.

### WP-D3 — Potare `ADMIN_CLASSIC_SKILL.md` §4

- **Obiettivo:** togliere changelog obsoleto mantenendo i LOCK e lo stato attuale.
- **File esatti:**
  - `docs/ADMIN_CLASSIC_SKILL.md`
- **Passi numerati:**
  1. Chiedere ok a Matteo per la potatura.
  2. Tenere §0-§3 e §4b.
  3. Rimuovere o comprimere changelog obsoleto su `useCanonicalTimeSlots`, branch morto e file non esistenti.
  4. Verificare path e simboli citati.
  5. Annotare nel report cosa è rimasto come fonte viva.
- **Verifica:** nessun riferimento a simboli/file morti; skill più corta e operativa.
- **Vietato:** non rimuovere LOCK admin classica; non riscrivere comportamento non verificato nel codice.
- **Cancello:** Matteo approva la potatura.

### WP-D4 — Snellire `.claude/CLAUDE.md`

- **Obiettivo:** rendere `.claude/CLAUDE.md` un gemello disciplinato di `AGENTS.md`, con puntatori alla fonte vera.
- **File esatti:**
  - `.claude/CLAUDE.md`
  - `AGENTS.md`
  - `.cursor/rules/comandi-base.mdc`
  - `docs/Comunicazione-Skill/VOCABOLARIO.md` (fonte, sola lettura salvo ok)
- **Passi numerati:**
 
  1. Rimuovere duplicazioni di struttura `src/` e contatori test.
  2. Tenere puntatori a `APP_CONTEXT_SKILL.md`, VOCABOLARIO e regole DB.
  3. Confrontare con `AGENTS.md` per non perdere obblighi.
  4. Verificare che Claude/Cursor/Codex puntino alle stesse fonti.
- **Verifica:** meno duplicazioni, nessun valore vivo hardcoded, regole principali ancora raggiungibili.
- **Vietato:** non cambiare comportamento dei grilletti senza sessione Meta; non aggiornare vocabolario.
- **Cancello:** Matteo approva il nuovo assetto.

### WP-D5 — Spostare plan/report storici Menu QR

- **Obiettivo:** togliere storia di blindatura dalla skill viva Menu QR.
- **File esatti:**
  - `docs/Menu-QR-Skill/PLAN_BLINDATURA_MENU_QR.md`
  - `docs/Menu-QR-Skill/REPORT_BLINDATURA_06-06-26.md`
  - `docs/Sessioni di lavoro/06-06-26/`
  - rimandi entranti trovati da grep
- **Passi numerati:**
  1. Matteo ha gia approvato.
  2. Spostare i file storici in `docs/Sessioni di lavoro/06-06-26/`.
  3. Aggiornare rimandi vivi.
  4. Lasciare puntatore breve nella skill solo se serve.
  5. Verificare link e grep entranti.
- **Verifica:** file storici fuori dalla skill viva; nessun link rotto.
- **Vietato:** non cancellare report; non modificare il contenuto storico oltre ai path se necessario.
- **Cancello:** conferma Matteo (gia consentito).

---

## AL-F — Docs commerciali/legali

Gated su decisioni Matteo. Sta prima di AL-E perché produce valore operativo senza cambiare architettura skill.

### WP-F1 — Prezzi edition

- **Obiettivo:** scrivere nel context marketing i prezzi approvati da Matteo.
- **File esatti:**
  - `docs/Marketing-Skill/EDITION_PRICING_CONTEXT.md`
  - `docs/Sessioni di lavoro/12-06-26/Report-analisi-legale-vendita-12-06-26.md` (fonte)
  - `docs/Marketing-Skill/MARKETING_SKILL.md` se serve puntatore
- **Passi numerati:**
  1. Chiedere decisione esplicita a Matteo sui prezzi.
  2. Trasformare la proposta del report in tabella operativa solo se approvata.
  3. Indicare cosa è prezzo deciso e cosa resta ipotesi.
  4. Collegare eventuali follow-up vendita.
  5. Verificare coerenza con edition/feature già esistenti.
- **Verifica:** il context non contiene più placeholder per prezzi approvati; nessuna feature venduta se non esiste o non è gated.
- **Vietato:** non approvare prezzi al posto di Matteo; non modificare codice edition.
- **Cancello:** decisione Matteo registrata.

### WP-F2 — Stato legale produzione

- **Obiettivo:** aggiornare il context legale con le nuove voci emerse dal report legale-vendita.
- **File esatti:**
  - `docs/Legal-Production-Skill/LEGAL_STATE_CONTEXT.md`
  - `docs/Legal-Production-Skill/LEGAL_PRODUCTION_SKILL.md` se serve puntatore
  - `docs/Sessioni di lavoro/12-06-26/Report-analisi-legale-vendita-12-06-26.md` (fonte)
- **Passi numerati:**
  1. Chiedere decisione esplicita a Matteo su quali voci promuovere.
  2. Aggiungere partita IVA, contratto B2B, fattura elettronica, EAA e verifica region come fasi o checklist.
  3. Separare bloccanti vendita da consigliati.
  4. Mantenere nota: analisi orientativa, non sostituisce professionisti.
  5. Verificare link e stato.
- **Verifica:** `LEGAL_STATE_CONTEXT.md` rappresenta lo stato operativo aggiornato e distingue fatto/da fare.
- **Vietato:** non scrivere contratti legali definitivi; non dichiarare compliance non verificata.
- **Cancello:** decisione Matteo registrata.

---

## AL-E — Strutturale skill system

Solo design in questo masterplan. Non implementare senza sessione Meta dedicata con Matteo.

### WP-E1 — Mini-pack per area

- **Obiettivo:** progettare ingressi leggeri per agenti con contesto ridotto.
- **File esatti:**
  - `docs/APP_CONTEXT_SKILL.md`
  - skill d'area esistenti in `docs/*-Skill/`
  - eventuale bozza in `docs/_lavoro/Supporto/` se Matteo la chiede
- **Passi numerati:**
  1. Aprire sessione Meta dedicata.
  2. Definire formato mini-pack: trigger, divieti, mappa, LOCK.
  3. Scegliere dove vivono: docs, `.cursor/skills`, o ibrido.
  4. Disegnare aggiornamento senza duplicare RULE.
  5. Solo dopo decisione, preparare WP implementativo separato.
- **Verifica:** decisione scritta, niente file runtime cambiati.
- **Vietato:** non creare mini-pack in chat normale; non duplicare LOCK in due fonti.
- **Cancello:** decisioni Meta con Matteo.

### WP-E2 — Check automatico path nei docs

- **Obiettivo:** progettare un controllo che intercetti path citati ma inesistenti nei `.md`.
- **File esatti:**
  - eventuale script futuro in `scripts/`
  - config pre-commit/CI futura
  - docs vivi esclusi `docs/Sessioni di lavoro/` e `docs/_lavoro/`
- **Passi numerati:**
  1. In sessione Meta, decidere perimetro e falsi positivi accettabili.
  2. Disegnare parser per link markdown e path inline.
  3. Escludere report storici e privati.
  4. Decidere se farlo girare in pre-commit, CI o entrambi.
  5. Solo dopo decisione, aprire WP implementativo.
- **Verifica:** design approvato con esempi di path buono/rotto.
- **Vietato:** non aggiungere hook/script senza sessione Meta; non bloccare report storici.
- **Cancello:** decisioni Meta con Matteo.

### WP-E3 — Regola anti-storia e protocollo §7

- **Obiettivo:** separare narrativa storica dai file skill vivi e valutare lo spostamento del protocollo §7 fuori da APP_CONTEXT.
- **File esatti:**
  - `docs/APP_CONTEXT_SKILL.md`
  - `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md`
  - skill d'area con changelog storico
  - `docs/Comunicazione-Skill/REVISIONE.md` se serve decisione Meta
- **Passi numerati:**
  1. In sessione Meta, definire regola: storia nei report, skill = stato attuale + divieto + link.
  2. Decidere cosa resta in `APP_CONTEXT_SKILL.md` §7 e cosa vive solo in `CHIUSURA_SESSIONE.md`.
  3. Disegnare migrazione graduale per skill d'area.
  4. Preparare WP implementativi separati per ogni area.
  5. Registrare decisione nel report Meta.
- **Verifica:** decisione chiara, nessuna implementazione prematura.
- **Vietato:** non riformare comunicazione o vocabolario in chat di lavoro; non cambiare livelli Liv.1/2/3.
- **Cancello:** decisioni Meta con Matteo.

---

## Ordine esecuzione

1. **AL-A** — ripara i rimandi che gli agenti useranno per tutti i lavori successivi.
2. **AL-B** — chiude i rischi reali su DB, tenant e funzioni pubbliche; B1/B2 solo senior+Matteo.
3. **AL-C** — pulizia a rischio più basso dopo che i punti critici sono stabilizzati.
4. **AL-D** — fusioni docs solo dopo che i file sono stati letti dai WP critici e con ok file per file.
5. **AL-F** — decisioni commerciali/legali operative, indipendenti dal refactor strutturale.
6. **AL-E** — architettura dello skill system in sessione Meta, quando il materiale è già bonificato.

---

## Registro FU

| ID | Stato nel masterplan | Significato | Quando entra in `FOLLOW_UP.md` |
|---|---|---|---|
| `FU-ALL-FALLBACK` | Pianificato | Audit fallback/placeholder prod-ready globale | WP-A2 |
| `FU-ALL-TIER` | Pianificato | Design skill system per tier modello/mini-pack | WP-A2 |
| `FU-AUTH-2` | Riusato | Guard tenant/auth esistente | WP-B3 |
| `FU-LOG-1` | Riusato | Logging con `logger.*` | WP-C2 |
| `FU-EMAIL-1` | Riusato altrove | Edge `send-email` mancante | `MASTERPLAN_BLINDATURA.md` M5/M6 |
| `FU-TYPES-1` | Riusato altrove | Cast `as any` massivi | `MASTERPLAN_BLINDATURA.md` M5/M6 |
| `FU-TEST-1` | Riusato altrove | Test Pro mancanti | `MASTERPLAN_BLINDATURA.md` M5/M6 |

`FU-023` e `FU-024` non si riciclano: hanno già significati storici nel registro.

---

## Verifica globale

Il masterplan è chiuso solo quando tutte le milestone sono ✅ oppure rinunciate esplicitamente da Matteo.
Alla chiusura, fare un ri-audit campione di 20 affermazioni skill→codice con target di allineamento ≥95%.
Se l'audit scende sotto soglia, aprire una nuova milestone di correzione invece di marcare chiuso.

---

## Convenzioni

- Italiano pratico, ma WP scritti per agenti: path esatti, passi atomici, verifiche ripetibili.
- Non ricopiare finding interi: linkare i report fonte.
- Nessun contatore test hardcoded nel masterplan; scrivere "validate verde" o comando equivalente.
- Nuovi FU con prefisso `FU-ALL-*`; mai riciclare ID esistenti.
- Ogni WP che tocca skill/context dichiara chi approva nel Cancello.
- Se il file reale non corrisponde al passo scritto, l'agente si ferma e segnala.
