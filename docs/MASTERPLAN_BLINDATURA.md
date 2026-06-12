# Masterplan Blindatura — Prenota · Menu QR · Admin + governance merge production

> **Cos'è questo file.** È l'**indice canonico in repo** dello stato blindatura (Prenota · Menu QR · Admin +
> merge production). Fonte unica per agenti e sessioni — **non** il plan locale in `.claude/plans/`.
> Lo aggiorno a ogni milestone. Il dettaglio operativo per-area vive nei `PLAN_BLINDATURA_*.md` sotto
> `docs/<Area>-Skill/`; questo masterplan li indicizza e li tiene allineati, non li sostituisce.

---

## Context — perché questo plan

Stiamo blindando le tre pagine dell'app (Prenota, Menu QR, Admin) per portarle a **prod-ready**. L'app
è già **online in production** (Vercel → repo pubblica PrenotaZen), quindi ogni merge tocca utenti
reali: serve una cadenza a milestone con **revisione senior prima di ogni merge**.

Allineamento skill↔codice (post-analisi 12-06-26): vedi [MASTERPLAN_ALLINEAMENTO.md](MASTERPLAN_ALLINEAMENTO.md).

Una controverifica con sub-agent multipli (10-06-26), che ha letto i **report di sessione** (non i
piani) e li ha confrontati col codice, ha corretto diverse cose che davo per fatte. Le scoperte chiave:

- **Prenota M0 chiuso e live (10-06-26):** FU-030 cap compose 24/24/79 implementato + accettazione
  visiva; FU-038 seed `/prenota/test`; FU-039 QA browser C1/C3; revisione indipendente Approva con
  riserve; fix polish overlay `showActionRow`; **merge production M0 eseguito**.
- **Menu QR confermato blindato**; resta **FU-MQR-2** (ordine piatti per-QR). ~~FU-MQR-3~~ chiuso 11-06-26 (categoria assente su PROD `da-tommaso`).
- **Admin Shell (M1):** ✅ blindato 10-06-26 — unit `shell-*` + E2E FU-042 su TEST; smoke Matteo pre-E2E OK;
  M1 su `main` privato (nessun sync pubblico: zero codice servito da pubblicare).

### Il flusso per ogni sezione nuova (regola di Matteo)

L'intervista avviene **all'apertura di OGNI sezione**, non una volta per pagina. Per ogni sezione il
ciclo è: **(1) l'agente intervista Matteo** su funzionalità, senso, limiti → **(2) mappatura** →
**(3) test** → **(4) blindatura**. Finora Matteo è stato intervistato solo su alcune sezioni (sotto) e
su alcune funzionalità trasversali; le sezioni admin elencate come ⬜ partono dallo step (1).

### Confine production (deciso con Matteo 10-06-26)

**main / PrenotaZen pubblica = edition Classic.** La **sidebar e le sue pagine (Home, CRM, Servizio,
Analytics + walk-in/no-show/table-assignments) sono Pro e NON entrano in production ora**: vivono dietro
i feature flag (`src/config/features.ts`, `PRO_BUNDLE`) e sono una **milestone separata** che non fa
parte di main. I merge production riguardano solo la superficie Classic: Shell, Dashboard prenotazioni
(Calendario/Pending/Archivio), Menu admin, Impostazioni.

---

## Stato per sezione e per fase

Legenda fase: ✅ fatto · 🔶 parziale/in corso · ⬜ da fare · n/a non applicabile.
"Blindato" = il cancello di chiusura del **[Manuale di blindatura](Testing-Skill/MANUALE_BLINDATURA.md)**
(intervista + mappatura + test di copertura + controtest "rompi" *se dovuto* + QA responsive + doc allineata).

| Pagina / Sezione | Intervistato | Mappato | Testato | Blindato | Milestone |
|---|---|---|---|---|---|
| **Prenota — form pubblico/vetrina** | ✅ (04-06) | ✅ | ✅ Vitest + QA browser C1/C3 | ✅ **M0 chiuso** | **M0** ✔️ **MERGED PROD (10-06)** |
| **Menu QR — pagina clienti** | ✅ (06-06) | ✅ | ✅ | ✅ (FU-MQR-2 aperto, fuori blind.) | ✅ già mergeable |
| **Admin — Shell/ingresso/nav** | ✅ (06-06) | ✅ | ✅ unit `shell-*` + E2E FU-042 + smoke Matteo | ✅ **M1 blindato** — su `main` privato (NON in pubblico: zero codice servito, vedi §merge) | **M1** ✔️ **MERGED (10-06)** |
| **Admin — Prenotazioni operative** | ✅ (06-06) | ✅ | ✅ Vitest **32** + E2E **7** (FU-043) | ✅ **BLINDATO** (11-06-26) | **M2** ✔️ |
| **Admin — tab Calendario** | ✅ (11-06) | ✅ (11-06) | ✅ Vitest `@admin-blindatura: calendario` (41 test M2 +2 No-show; validate **527**, 11-06-26) | ✅ **BLINDATO** (11-06-26) — Fase C + batch A/B + C-U2 + QA badge §9 OK Matteo | **M2** ✔️ **MERGED PROD (11-06)** |
| **Admin — Menu / magazzino** | ✅ (11-06) | ✅ (11-06) | ✅ Vitest **27** + E2E `@admin-blindatura: menu-magazzino` (375/834/1280; validate **554**) | ✅ **BLINDATO** (11-06-26) — QA Matteo toggle+propagazione; fix modal `b9f283f` | **M3** ✔️ **MERGED PROD (12-06)** |
| **Admin — Impostazioni/Personalizza Form** | 🔶 trasversali* | 🔶 doc | 🔶 salvataggio fase1 | ⬜ | **M4** |
| **Admin — Servizio (Pro)** | ⬜ | 🔶 doc | ⬜ | ⬜ | **M5 (NON in main)** |
| **Admin — CRM (Pro)** | ⬜ | 🔶 doc | ⬜ | ⬜ | **M5 (NON in main)** |
| **Admin — Home/Analytics (Pro)** | ⬜ | 🔶 doc | ⬜ | ⬜ | **M5 (NON in main)** |
| **Cross-area prod-ready (debiti §5)** | n/a | n/a | n/a | ⬜ | **M6** |

\* *Impostazioni: alcune funzionalità trasversali sono già state intervistate (salvataggio admin fase 1,
promo/offerte, limiti testo). Manca l'intervista di SEZIONE su anagrafica/orari/tema come insieme.*

**Trasversali già intervistate** (valgono su più sezioni, non ripetere): limiti testo anti-rottura
(03/04-06), validazione/comportamento form (29-05), salvataggio admin fase 1 (29-05), promo/offerte
(29-05), release/sync versioni (parziale, 05-06). **Trasversali ancora aperte:** pattern salvataggio
unificato (FU-002), conferma delete unica app-wide (FU-003), guard chiusura modale su tutti i modali
(FU-023).

---

## Milestone = cancelli di merge

Ogni milestone è **una sezione/area blindata = un merge in production** (granularità per-area, decisa
con Matteo). Una milestone è "pronta al merge" solo quando supera il **cancello di chiusura** del
**[Manuale di blindatura](Testing-Skill/MANUALE_BLINDATURA.md)** — che è il riferimento unico per
*quali test fare dopo la mappatura* e *quando il controtest "rompi" è obbligatorio* (regola: dovuto
solo se il diff tocca codice `src/` con logica/stato; non dovuto se tocca solo test/config/doc).
Ogni `PLAN_BLINDATURA_<AREA>.md` applica quel manuale all'area specifica.

**Procedura merge (la eseguo io, senior, con Matteo):**
1. Revisione del lavoro dell'agente che ha chiuso la sezione (diff + test + report).
2. `npm run validate` verde su `env/test`.
3. **Classifica il diff:** `git diff --name-only main..env/test -- src/` — tocca codice servito sì/no?
4. Merge `env/test` → `main` + push privato (sempre, è il backup).
5. **Solo se il diff tocca `src/`:** `npm run release:prenotazen` → PrenotaZen `npm run build` →
   commit `release: …` → push → Vercel deploya → smoke live.
   **Se NON tocca `src/`** (solo E2E/config/doc): STOP — il bundle clienti è identico, NON pubblicare.
   Dopo il sync ripulire PrenotaZen (`git checkout -- …` + `rm` untracked). Vedi Playbook §8 in
   `EVOLUZIONE_SKILLS.md`.
6. Aggiorno la tabella «Stato per sezione» e marco la sezione ✔️ merged.

> Niente script nuovo da creare: il merge usa `npm run release:prenotazen` già esistente. Vedi memory
> `project_repo_split_3repos` e Playbook §8 (`EVOLUZIONE_SKILLS.md`) per la regola pubblico/privato.

---

### M0 — Prenota: chiudere la blindatura ✅ **CHIUSO + MERGED PROD 10-06-26**
- **Dettaglio:** `docs/Prenota-Skill/PRENOTA_SKILL.md` + `contesto/*`.
- **Stato:** ✅ intervistata, mappata, testata, revisione indipendente, `npm run validate` **482** verde.
- **MERGE PRODUCTION (10-06-26):** revisione senior indipendente nel codice (2 sub-agent + validate ri-eseguito 482/482) → merge `env/test`→`main` (`d8f8851`, push CALENDARIO-V2) → `release:prenotazen` (solo 5 file src) → PrenotaZen `npm run build` verde → commit `f6e3d13` + push → deploy Vercel. **LIVE.**
- **Completato:**
  - **FU-030** — `BOOKING_MENU_COMPOSE_TEXT_LIMITS` 24/24/79; clamp pubblico + contatori admin; accettazione Matteo.
  - **FU-038/039** — seed TEST slug `test` (`33333333-…`); QA browser C1 (3 card) + C3 (1 slide) su 375/806/834/1256/1280.
  - **Polish 10-06-26** — `showActionRow` in overlay compose (no buco 44px se locked + no € ingredienti).
- **Report consolidato:** `docs/Sessioni di lavoro/10-06-26/Report-finale-m0-prenota-10-06-26.md`
- **Stato merge:** ✅ production M0 eseguita il 10-06-26 (vedi riga MERGE PRODUCTION sopra).
- **Fuori M0 (aperti):** FU-040 hook Vitest, FU-041 doc stale 05-06, cap server edge ingredienti (M6 opzionale).

### M1 — Admin Shell / ingresso / navigazione globale ✅ **BLINDATO** (10-06-26)
- **Dettaglio:** `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` §3 · report Area 1
  `docs/Sessioni di lavoro/06-06-26/Report-blindatura-admin-area1-shell-06-06-26.md`.
- **Stato:** intervista chiusa (06-06); sotto-route refresh/back + logout dirty guard in codice; test
  `@admin-blindatura: shell-*` (unit + marcatori E2E); edition Classic senza sidebar in production.
- **Completato in codice (06-06):** URL stabili sezioni Pro (`/admin/crm`, …); refresh/back dashboard;
  Home rispetta `features.home`; fallback header neutro; guard logout con modifiche non salvate.
- **QA Matteo (10-06-26):** **flusso base utente OK** — ingresso admin, navigazione tab principali
  (Prenotazioni / Calendario / Menu / Impostazioni in edition Classic), refresh e back percepiti
  corretti; nessun blocco segnalato in smoke manuale.
- **Completato (10-06-26):** **FU-042** — `e2e/admin-shell-blindatura.spec.ts` (5 test): refresh/back
  Pro `/admin/crm` + browser back; Classic `/admin/prenotazioni`; dirty guard + logout Classic
  (tema Impostazioni). Allineati `admin-login`, `pro-sidebar-nav` (sidebar `complementary`). Suite E2E
  shell: **19 passed, 1 skipped** su staging TEST (4 file shell); `npm run validate` **482** verde.
- **Report:** `docs/Sessioni di lavoro/10-06-26/Report-chiusura-m1-admin-shell-10-06-26.md`
- **Stato merge:** ✅ M1 su `main` privato; nessun sync PrenotaZen necessario perché non cambiava codice servito.

### M2 — Admin Dashboard prenotazioni (operative + Calendario)
- **Dettaglio:** `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` §3-bis (operative). **Calendario: sezione
  nuova da aggiungere al plan.**
- **Stato:** operative ✅ **BLINDATO** 11-06-26 (FU-043 E2E + QA 375/834; residui U3/U9/D6/D7/L* fuori cancello); **tab
  Calendario: intervista ✅ + mappa ✅ + implementazione ✅ + 4 fix QA ✅ + test Vitest
  `@admin-blindatura: calendario` ✅ (41 test M2 +2 No-show, 11-06-26)**; Fase C controtest ✅ (report
  `docs/Sessioni di lavoro/11-06-26/Report-fase-c-controtest-calendario-11-06-26.md`).
- **Calendario:** ✅ **BLINDATO** 11-06-26 — report
  [`Report-finale-m2-calendario-blindato-11-06-26.md`](Sessioni%20di%20lavoro/11-06-26/Report-finale-m2-calendario-blindato-11-06-26.md);
  FU-047 chiuso; validate **527**; QA badge §9 OK Matteo. Fuori scope Calendario Classic: **FU-048** (C-U3 Pro).
- **MERGE PRODUCTION Calendario (11-06-26):** ✅ revisione senior nel codice + `validate` **527** verde →
  merge `env/test`→`main` (`f2a08e6`, push privato CALENDARIO-V2) → edge `create-booking` deployata + smoke su
  TEST (6/6 scenari: limite giornaliero blocca/passa, no-show libera, per-fascia off-di-default + riattivabile) e
  su **PROD** (v13, prova live `DAILY_LIMIT` 409 OK, zero residui) → frontend `release:prenotazen` → PrenotaZen
  `npm run build` verde → `dad49ee` → push → Vercel. **C-D5 chiuso** (edge ora live su TEST e PROD).
  Verifica prod pre-deploy: i 3 ristoranti reali (al-ritrovo/da-matteo/da-tommaso) non usavano tetti per-fascia
  né limiti giornalieri → la modifica non ha rimosso alcuna protezione esistente.
- **Operative:** chiudere residui FU-046 + E2E/QA reale + controtest responsive sui modali di conferma nuovi.

### M3 — Admin Menu / magazzino
- **Dettaglio:** sezione Area 4 in `PLAN_BLINDATURA_ADMIN.md`; context
  `ADMIN_MENU_MAGAZZINO_CONTEXT.md` — **mappa intervista in §9** (decisioni 11-06-26).
- **Stato:** ✅ intervistato + ✅ mappato (11-06-26). **Fase 1 ✅:** limiti + cap + avviso (9 test limits).
  **Fase 2 ✅ (11-06-26):** toggle `is_available` magazzino + migrazione `045` TEST + 9 test availability.
  **Fase 3 ✅ (11-06-26, FU-M3-3):** Vitest `@admin-blindatura: menu-magazzino-sync` (9 test rename/delete +
  controtest parziale). **QA E2E base ✅ (11-06-26, FU-M3-QA-E2E):** Playwright
  `e2e/admin-menu-magazzino-blindatura.spec.ts` su 1280/375/834. **Fix modal config ✅ (`b9f283f`):**
  filtro `is_available` in modal QR + card scorrevoli. **Blindato ✅ 11-06-26** — report
  [`Report-finale-m3-menu-blindato-11-06-26.md`](Sessioni%20di%20lavoro/11-06-26/Report-finale-m3-menu-blindato-11-06-26.md);
  validate **554**; QA Matteo toggle+propagazione. **Fuori cancello:** FU-M3-QA-CT (controtest browser extra, sessioni future); roadmap E2E completo per area (OSSERVAZIONI 11-06-26).
  **MERGE PRODUCTION M3 (12-06-26):** ✅ controverifica sub-agent doc/codice → `validate` **554** verde →
  E2E M3 `--workers=1` **3/3** → migrazione `045_menu_magazzino_is_available` applicata su **PROD**
  (`rwuxgvld`, colonne `is_available` su `menu_categories` + `menu_items`, default `true`) → merge
  `env/test`→`main` privato (`7d8fd56`) → build privata verde → `release:prenotazen` → build PrenotaZen
  verde → commit pubblico `b324df0` → push. Vercel deploya da PrenotaZen `main`.
- **Decisioni chiave (vedi `ADMIN_MENU_MAGAZZINO_CONTEXT.md §9`):** limiti duri 7/12/6/6; cap 24/79;
  **toggle disponibilità magazzino** ✅ (`is_available`, spento = nascosto Prenota+QR, snapshot intatto);
  avviso propagazione su save/toggle; QR `is_active` spento → "menu non disponibile".
- **Invariante confermato (già nel codice):** prenotazioni pending/accettate/archivio conservano lo
  **snapshot congelato** del menù (`booking_requests.menu_selection`: nome+prezzo+quantità) — cambiare
  il magazzino non altera mai lo storico.
- **Controtest obbligatori:** rename/delete categoria sincronizza più risorse (QR + Prenota + settings +
  storage) **senza transazione unica** → **Vitest FU-M3-3 ✅** (stato parziale documentato; no rollback);
  nuovo toggle
  disponibilità (off sparisce in entrambe le vetrine, snapshot intatto); cap retroattivi. File pesante:
  `MenuPricesTab.tsx` (~1900 LOC). Coordinare con Menu QR e Prenota già blindate.

### M4 — Admin Impostazioni / Personalizza Form
- **Dettaglio:** sezione Area 3 da aggiungere a `PLAN_BLINDATURA_ADMIN.md`; context
  `ADMIN_SETTINGS_CONTEXT.md` esiste.
- **Stato:** ⬜ intervista di sezione mancante (solo trasversali fatte: salvataggio fase1, promo).
- **Cosa serve:** intervista di sezione su anagrafica/orari/tema; chiudere salvataggio fase 2+
  (FU-004 autosave→manuale, FU-005 conferma «dati pubblici»); verificare **cross-impatto Prenota**
  (Personalizza Form alimenta la vetrina). File pesante: `RestaurantSettingsTab.tsx` (1392 LOC).

### M5 — Sidebar + pagine Pro (Servizio / CRM / Home / Analytics) — **NON in main**
- **Dettaglio:** Aree 5/6/7 di `PLAN_BLINDATURA_ADMIN.md`.
- **Stato:** ⬜ implementate, **non intervistate**, dietro feature flag, fuori da production Classic.
- **Confine:** si blindano e si testano su TEST/Pro ma **non si mergiano nella pubblica** finché non
  decidi di attivare/vendere edition Pro. Merge production gestito separatamente quando Pro andrà live.
- **Attenzioni note:** `useTableStatuses` mancante (tavoli sempre verdi, `TableShape.tsx:35`); walk-in
  busy-check placement vs table id; CRM link cliente↔booking via email normalizzata non-FK + delete
  multi-step; Analytics query su `created_at` ma KPI su data evento; **0% test su tutte e quattro**.

### M6 — Cross-area prod-ready
- **Dettaglio:** `docs/Admin-Skill/contesto/ADMIN_CONFLICTS_AND_DEBTS.md`.
- **Stato:** ⬜ — chiude i debiti §5 e gli elementi latenti; conferma niente mock/hardcoded residui,
  azioni pericolose tutte sotto conferma custom.

---

## 5. Follow-up tracciati a parte (NON bloccano i merge di blindatura)

Decisione Matteo (10-06-26): debiti reali ma **non cancelli di milestone**; si chiudono in M6 o nella
milestone naturale di competenza.

| ID | Debito | Evidenza | Impatto | Dove chiude |
|---|---|---|---|---|
| FU-030 | ~~Cap testi menù~~ | ✅ Chiuso M0 10-06-26 | — | **M0** ✅ |
| FU-038/039 | ~~Seed TEST + QA centratura~~ | ✅ Chiuso M0 10-06-26 | — | **M0** ✅ |
| FU-MQR-2 | Ordine piatti per-QR non gestibile (segue `menu_items.sort_order`) | `MENU_QR_SKILL.md §5` | medio | milestone dedicata Menu QR |
| FU-MQR-3 | ~~Chiave categoria `secondi_piattie` su PROD `da-tommaso`~~ — **Chiuso 11-06-26:** Matteo su PROD account test `da-tommaso` — categoria/chiave **non presente** in overlay Categorie; nessuna azione rename. Vitest rename (FU-M3-3) resta copertura codice. | `MENU_QR_SKILL.md §5` | — | chiuso |
| FU-EMAIL-1 | Edge function `send-email` **non esiste**: email accept/reject/cancel falliscono in silenzio | `src/lib/email.ts:37`; gated da `VITE_ENABLE_SEND_EMAIL` in `useBookingMutations.ts:110-171` | alto (UX) | M6 o milestone email |
| FU-EMAIL-2 | Nessuna UI admin per `email_logs` | `database.ts` (`email_logs`) | medio | M6 |
| FU-TEST-1 | 0% test su pagine Pro (CRM/Servizio/Analytics/Home) | nessun `*.test.tsx` | alto (no regression Pro) | M5 (criterio uscita) |
| FU-TABLE-1 | `useTableStatuses` mancante: tavoli sempre verdi | `TableShape.tsx:35` | medio (solo Pro) | M5 |
| FU-BRIEF-1 | Briefing senza join sala/tavolo | `useShiftBriefing.ts:85` | basso (Pro) | M5 |
| FU-TYPES-1 | Uso massivo `as any` su query (bypassa type safety) | `useBookingMutations.ts` (15+), `useBookingQueries.ts`, `useAdminBookingRequests.ts:62` | medio | M6 |
| FU-LOG-1 | Logging misto `console.error` vs `logger` | `useEmailNotifications.ts:33/62/91` | basso | M6 |
| FU-RESP-1 | Larghezze fisse non responsive | `BookingRequestForm.tsx:1456`, `MenuSelection.tsx:463/506`, `CustomerListTable.tsx:89` | basso | nel controtest responsive dell'area (M2/M3/M5) |
| FU-AUTH-1 | Admin rimosso da `admin_users` resta loggato finché refresh token valido | `AdminAuthContext.tsx` | medio (sicurezza) | M6 |
| FU-AUTH-2 | Se RPC `check_admin_email` fallisce, tenant=null ma user loggato | `TenantContext.tsx` | medio | M1/M6 |
| FU-002/003/023 | Pattern salvataggio unificato / conferma delete unica / guard modale su tutti i modali | trasversali aperti | basso-medio | M6 |

---

## 6. Plan vecchio: cosa fare

Decisione (10-06-26): **questo è un masterplan nuovo separato**, indice sopra i plan operativi.
- **NON cancellare** `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md`: è vivo, ha lo stato dettagliato di
  Area 1/2. Va **aggiornato** con le sezioni mancanti (Calendario in M2, Menu in M3, Settings in M4) e
  con lo stato corretto di Prenota/Menu QR riferiti qui.
- **Segnare come superato** (non serve cancellare: è in `_lavoro/`, gitignored) il piano storico
  `docs/_lavoro/Sessioni/14-05-26/Plan-blindatura-admin-e-edition-system.md` — Edition system già live.
- **Allineare** i context dove i report hanno trovato discrepanze (es. slug smoke Prenota → `/prenota/test`
  in report M0; `TESTING_SKILL` §7.3 ancora su `test-pro` — follow-up doc).

---

## 7. Come finire di blindare Admin (sequenza operativa)

1. **M0 (Prenota):** ✅ chiuso 10-06-26 — cap FU-030, seed FU-038, QA FU-039, revisione, polish overlay. **Merged prod 10-06.**
2. **M1 (Shell):** ✅ blindato 10-06-26 (FU-042 E2E) · su `main` privato; sync pubblico non necessario.
3. **M2 (Dashboard prenotazioni):** ✅ operative + Calendario blindati; Calendario **merged prod 11-06**.
   Residui operative restano fuori cancello e passano a M6/milestone naturale.
4. **M3 (Menu admin):** ✅ blindato 11-06-26 — **merged prod 12-06**; FU-MQR-3 chiuso (categoria assente PROD).
5. **M4 (Settings):** intervista di sezione → salvataggio fase2 + cross-impatto Prenota → merge.
6. **M5 (Pro/sidebar):** intervistare+blindare su TEST, **NON mergiare in main**; chiude FU-TEST-1/TABLE-1/BRIEF-1.
7. **M6 (cross-area):** chiudere FU-EMAIL, FU-TYPES, FU-LOG, FU-AUTH, FU-002/003/023.

Per ogni sezione ⬜ il primo step è **l'intervista di Matteo** (senso/funzionalità/limiti), poi
mappatura, poi test, poi controtest "rompi" sui 4 fronti — non si chiude un'area solo con i test verdi.

---

## 8. Verifica

- **Per sezione, prima del merge:** `npm run validate` (lint + typecheck + test) verde su
  `env/test`; controtest sub-agent sui 4 fronti con finding decisi (fix/follow-up/voluto);
  `npm run test:e2e` su staging per le sezioni che lo richiedono (M1, M2).
- **Verificato nel codice (10-06-26, non solo dai report):** i test admin `@admin-blindatura` esistono
  davvero (8 file, 60 test: 40 unit + 20 E2E; tutti e 6 i marcatori `shell-*` coperti) — lo stato
  "test avviati" del plan è confermato, non gonfiato.
- **M0 Prenota (10-06-26):** FU-030 cap 24/24/79 in codice + test Vitest; seed `/prenota/test` su TEST;
  QA browser C1/C3 indipendente OK; fix `showActionRow` overlay verificato in chiusura report finale.
- **M1 Shell (10-06-26):** FU-042 chiuso — E2E `admin-shell-blindatura.spec.ts` + suite shell **19+1 skip**
  su TEST; blindatura formale ✅; M1 su `main` privato, nessun sync pubblico richiesto.
- **Merge production:** `npm run release:prenotazen` → in PrenotaZen `npm run build` verde → deploy
  Vercel → smoke test live (login admin, creare/accettare prenotazione, calendario, menu QR pubblico).
- **Dopo ogni milestone:** aggiornare la tabella «Stato per sezione» (in cima),
  `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md` e il `PLAN_BLINDATURA_ADMIN.md` di area.
