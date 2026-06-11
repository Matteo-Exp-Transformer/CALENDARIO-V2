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

Una controverifica con sub-agent multipli (10-06-26), che ha letto i **report di sessione** (non i
piani) e li ha confrontati col codice, ha corretto diverse cose che davo per fatte. Le scoperte chiave:

- **Prenota M0 chiuso in repo (10-06-26):** FU-030 cap compose 24/24/79 implementato + accettazione
  visiva; FU-038 seed `/prenota/test`; FU-039 QA browser C1/C3; revisione indipendente Approva con
  riserve; fix polish overlay `showActionRow`. **Merge production M0** ancora da eseguire (procedura § merge).
- **Menu QR confermato blindato**, ma restano 2 follow-up reali: FU-MQR-2 (ordine piatti per-QR) e
  FU-MQR-3 (chiave categoria malformata su PROD).
- **Admin Shell (M1):** ✅ blindato 10-06-26 — unit `shell-*` + E2E FU-042 su TEST; smoke Matteo pre-E2E OK;
  merge prod M1 ⬜.

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
| **Menu QR — pagina clienti** | ✅ (06-06) | ✅ | ✅ | ✅ (FU-MQR-2/3 aperti, fuori blind.) | ✅ già mergeable |
| **Admin — Shell/ingresso/nav** | ✅ (06-06) | ✅ | ✅ unit `shell-*` + E2E FU-042 + smoke Matteo | ✅ **M1 blindato** — su `main` privato (NON in pubblico: zero codice servito, vedi §merge) | **M1** ✔️ **MERGED (10-06)** |
| **Admin — Prenotazioni operative** | ✅ (06-06) | ✅ | 🔶 `@admin-blindatura` | 🔶 (residui U/D/L + E2E) | **M2** |
| **Admin — tab Calendario** | ⬜ **DA ZERO** | ⬜ | ⬜ | ⬜ | **M2** (parte di Dashboard) |
| **Admin — Menu / magazzino** | ⬜ | 🔶 doc | ⬜ | ⬜ | **M3** |
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
- **Prossimo passo:** merge production (§ procedura merge) — senior + Matteo.
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
- **Prossimo passo:** merge production M1 (§ procedura merge) — senior + Matteo.

### M2 — Admin Dashboard prenotazioni (operative + Calendario)
- **Dettaglio:** `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` §3-bis (operative). **Calendario: sezione
  nuova da aggiungere al plan.**
- **Stato:** operative 🔶 (batch FU-046 chiuso 07-06, residui U3/U9/D6/D7/L* + E2E aperti); **tab
  Calendario ⬜ da fare da zero**.
- **Cosa resta:**
  - **Calendario:** ciclo completo → **(1) intervista** Matteo (senso, cosa mostra, limiti, azioni da
    calendario, vista giorno/settimana/mese) → mappa → test → blinda. `BookingCalendar.tsx` (1165 LOC).
  - **Operative:** chiudere residui + E2E/QA reale + controtest responsive sui modali di conferma nuovi.

### M3 — Admin Menu / magazzino
- **Dettaglio:** sezione Area 4 da aggiungere a `PLAN_BLINDATURA_ADMIN.md`; context
  `ADMIN_MENU_MAGAZZINO_CONTEXT.md` esiste.
- **Stato:** ⬜ mappato a doc, **non intervistato**.
- **Cosa serve:** ciclo completo dall'intervista. Attenzione (da `ADMIN_CONFLICTS_AND_DEBTS.md` §3):
  rename/delete categoria sincronizza più risorse (QR + Prenota + settings + storage) **senza
  transazione unica** → controtest race/parziale (è anche la radice di FU-MQR-3). File pesante:
  `MenuPricesTab.tsx` (1900 LOC). Coordinare con Menu QR e Prenota già blindate.

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
| FU-MQR-3 | Chiave categoria malformata `secondi_piattie` su PROD `da-tommaso` (rename solo via modale admin, mai SQL) | `MENU_QR_SKILL.md §5` | basso (chiave interna) | M3 (radice rename categoria) |
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

1. **M0 (Prenota):** ✅ chiuso 10-06-26 — cap FU-030, seed FU-038, QA FU-039, revisione, polish overlay. **Merge prod ⬜.**
2. **M1 (Shell):** ✅ blindato 10-06-26 (FU-042 E2E) · merge Classic ⬜.
3. **M2 (Dashboard prenotazioni):** **intervistare + costruire tab Calendario da zero**; chiudere
   residui operative + E2E/QA reale + controtest responsive → merge.
4. **M3 (Menu admin):** intervista → mappa → test, focus race rename/delete categoria (chiude FU-MQR-3) → merge.
5. **M4 (Settings):** intervista di sezione → salvataggio fase2 + cross-impatto Prenota → merge.
6. **M5 (Pro/sidebar):** intervistare+blindare su TEST, **NON mergiare in main**; chiude FU-TEST-1/TABLE-1/BRIEF-1.
7. **M6 (cross-area):** chiudere FU-EMAIL, FU-TYPES, FU-LOG, FU-AUTH, FU-002/003/023.

Per ogni sezione ⬜ il primo step è **l'intervista di Matteo** (senso/funzionalità/limiti), poi
mappatura, poi test, poi controtest "rompi" sui 4 fronti — non si chiude un'area solo con i test verdi.

---

## 8. Verifica

- **Per sezione, prima del merge:** `npm run validate` (lint + typecheck + ~480 test Vitest) verde su
  `env/test`; controtest sub-agent sui 4 fronti con finding decisi (fix/follow-up/voluto);
  `npm run test:e2e` su staging per le sezioni che lo richiedono (M1, M2).
- **Verificato nel codice (10-06-26, non solo dai report):** i test admin `@admin-blindatura` esistono
  davvero (8 file, 60 test: 40 unit + 20 E2E; tutti e 6 i marcatori `shell-*` coperti) — lo stato
  "test avviati" del plan è confermato, non gonfiato.
- **M0 Prenota (10-06-26):** FU-030 cap 24/24/79 in codice + test Vitest; seed `/prenota/test` su TEST;
  QA browser C1/C3 indipendente OK; fix `showActionRow` overlay verificato in chiusura report finale.
- **M1 Shell (10-06-26):** FU-042 chiuso — E2E `admin-shell-blindatura.spec.ts` + suite shell **19+1 skip**
  su TEST; blindatura formale ✅; merge prod ⬜.
- **Merge production:** `npm run release:prenotazen` → in PrenotaZen `npm run build` verde → deploy
  Vercel → smoke test live (login admin, creare/accettare prenotazione, calendario, menu QR pubblico).
- **Dopo ogni milestone:** aggiornare la tabella «Stato per sezione» (in cima),
  `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md` e il `PLAN_BLINDATURA_ADMIN.md` di area.
