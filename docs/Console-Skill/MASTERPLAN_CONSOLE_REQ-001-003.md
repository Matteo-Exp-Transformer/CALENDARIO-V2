# MASTERPLAN REQ-001/002/003 — gestione utenti & aziende dalla Console

> **Branch:** `feature/console-super-admin` · **Autore:** Orchestrator (2026-06-22) · **Master:** `.claude/CLAUDE.md`
> **Origine:** canale collaborazione `docs/Console-Skill/collaborazione/` — REQ-001, REQ-002, REQ-003 (DA-FARE).
> **Continua** il `MASTERPLAN_CONSOLE.md` (F1→F7 chiuse). Qui le fasi **F8→F12**.
>
> Ogni fase `F_i` è piccola e chiudibile, con prompt **autosufficienti** (cold start) per ESECUTORE e
> REVISORE, done-criteria verificabili e dipendenze. Ciclo: **esecutore → revisore → (audit) → commit**.
> Tracciabilità = priorità n.1 (RULE-5).

---

## 0. Regole che ogni subagent deve rispettare

```
RULE-1  SOLO TEST docnnernvp. Prima di OGNI scrittura DB: get_project_url == docnnernvp. PROD rwuxgvld → STOP.
RULE-2  ⚠️ REVOCATA per la gestione console (DEC-037): le azioni valgono su TUTTE le aziende su TEST.
        Rete di sicurezza che la sostituisce: gate allowlist (console_allowed_emails / CONSOLE_ALLOWED_EMAILS)
        + scritture solo via Edge service-role + conferme forti "riscrivi il nome" sulle azioni distruttive (DEC-038).
RULE-3  Schema/DDL/RLS/migrazioni/GRANT → MAI dall'agente: file in docs/Console-Skill/plan-per-matteo/ → li esegue Matteo.
RULE-4  Codice solo in console/. Non toccare src/ né supabase/ di Matteo. La Console NON importa da ../src. Service role MAI nel browser.
RULE-5  TRACCIABILITÀ: DEC-NNN per ogni decisione, blocco PHASE_AUDIT per ogni fase, commit che citano fase+DEC. Esecutore ≠ Revisore.
```

**Canale write su TEST:** MCP `CONSOLE` (`mcp__claude_ai_CONSOLE__*`). **Edge della Console:** `console/supabase/functions/console-admin/index.ts` (deploy lato Matteo).

**Modello dati reale (verificato 2026-06-22):**
- Tenant = `organizations` (id, name, slug, edition∈{classic,pro,enterprise}, is_active, plan, max_*). 7 righe.
- Utente admin = `admin_users` (id, email, name, tenant_id→organizations). **5 righe. NESSUNA colonna "ruolo"** → "admin" è implicito.
- Utenti di login vivono in **`auth.users`** (Supabase Auth). Crearli/eliminarli = `supabase.auth.admin.*` (service role, solo lato Edge).
- Feature = `organizations.edition` + override `tenant_features`; impostazioni = `restaurant_settings`; `qr_menu_enabled` = legacy.
- Lettura Console esistente (policy SELECT per `is_console_user()`): `organizations`, `tenant_features`, `restaurant_settings`.
  **`admin_users` NON ha ancora una policy SELECT Console** → PLAN-DB-005.

---

## 1. Quadro delle fasi

| Fase | REQ | Obiettivo | Modalità | Dipende da | Stato |
|------|-----|-----------|----------|-----------|-------|
| **F8** | 001 (lettura) | Vista **"Tutti gli utenti"** (`admin_users`+org) + **navigazione** Ristoranti/Utenti; ricerca per email; sola lettura | deep | PLAN-DB-005 | ⬜ |
| **F9** | 002 (tappa 1) | **Scheda azienda** (drill-down per 1 tenant): riusa i pannelli esistenti + **mappa di copertura** vs intervista (configurato / manca / non ancora supportato) | deep | F8 | ⬜ |
| **F10** | 001/003 (fondamenta scrittura) | **Estensione Edge** `console-admin`: azioni utenti/aziende + sblocco guard sandbox→allowlist (DEC-037). Codice pronto, deploy a Matteo | deep | F9 | ⬜ |
| **F11** | 001 (scrittura) | **CRUD utente** dalla UI: crea (email+password+azienda), modifica, elimina (conferma "riscrivi email", DEC-038) | deep | F10 | ⬜ |
| **F12** | 003 | **Crea/elimina azienda**: form unico azienda+admin (DEC-041), elimina con conferma "riscrivi nome" (DEC-038) | deep | F10 | ⬜ |
| **F13** | FU-CONSOLE-12 | **Sblocco scrittura pannelli su tutte le aziende** (edition/feature/impostazioni): rimuovere il write-gate `isSandboxTenant` (allineamento UI a DEC-037; il gate vero resta Edge+allowlist) | standard | F10/F12 | ⬜ |

> **Ordine (DEC-042):** prima il **read-block** (F8 lettura + F9 scheda) → vedere e configurare; poi il
> **write-block** (F10 Edge → F11 utenti → F12 aziende) → azioni potenti.
>
> **REQ-002 copertura completa (DEC-040):** F9 è la **tappa 1** (struttura + sezioni già esposte +
> mappa). Le sezioni non ancora esposte (contatti/orari/sala-tavoli/menu-QR/aspetto, FU-CONSOLE-9)
> diventano sotto-tappe successive: si aprono come `FU-CONSOLE-9` e si pianificano dopo il write-block.

---

## 2. Fasi in dettaglio

### F8 — Vista "Tutti gli utenti" (REQ-001 lettura) + navigazione

- **Obiettivo / effetto:** una vista che elenca **tutti** gli admin (`admin_users`) con l'azienda
  associata; navigazione tra "Ristoranti" e "Utenti". *Cosa cambia per te:* vedi in un colpo chi
  amministra quale locale, cerchi per email, e da lì entrerai nella scheda (F9). Sola lettura.
- **Modalità:** deep (nuova area + dipendenza RLS).
- **Dipendenze:** PLAN-DB-005 (policy SELECT `admin_users` per la Console) — la **esegue Matteo**.
- **Done-criteria:**
  1. Navigazione nella Console tra **Ristoranti** (vista esistente) e **Utenti** (nuova). `react-router-dom` è già dipendenza.
  2. La vista Utenti legge `admin_users` via client pubblico e mostra per riga: **email**, **name**, **azienda** (org.name + slug), **edition**, **is_active**. Join lato query (`admin_users` → `organizations`) o due fetch.
  3. **Ricerca per email** (filtro client). Stati loading / errore / vuoto gestiti.
  4. Se la policy SELECT non è ancora attiva (PLAN-DB-005 non eseguito) → lista vuota **gestita con messaggio chiaro** ("nessun utente visibile: verifica PLAN-DB-005"), **niente crash**, niente aggiramento RLS.
  5. Azioni di riga **placeholder disabilitate** ("Apri scheda" → pronta per F9; "Modifica"/"Elimina" → etichetta "in arrivo (write-block)"). Nessuna scrittura.
  6. Responsive (~375px e desktop). Niente import da `../src`.
- **Note:** PLAN-DB-005 va **generato** dall'esecutore (RULE-3) se non esiste, non eseguito. L'Orchestrator ha già verificato: `admin_users` ha 5 righe su TEST.

**Prompt ESECUTORE (F8):**
```
Lavori sul branch feature/console-super-admin (Console super-admin di Matteo). Sei un ESECUTORE cold-start.
PRIMA: leggi docs/Console-Skill/00_BUSSOLA_CONSOLE.md, docs/Console-Skill/collaborazione/richieste/REQ-001-vista-tutti-utenti-crud.md, docs/Console-Skill/context/CONSOLE_DATA_MODEL_CONTEXT.md, e i file esistenti console/src/components/AppShell.tsx, RestaurantList.tsx, console/src/lib/supabaseClient.ts, editionUtils.ts.
APPLICA le regole d'oro: RULE-1 solo TEST docnnernvp (in questa fase NON scrivi il DB); RULE-2 è REVOCATA per la console (DEC-037) ma qui è tutto SOLA LETTURA; RULE-3 schema/RLS → file in plan-per-matteo/ (NON eseguire DDL); RULE-4 codice SOLO in console/, no import da ../src, no service role nel browser; RULE-5 elenca a fine lavoro le decisioni non banali come candidate DEC.

CONTESTO DATI (verificato): admin_users = {id, email, name, tenant_id→organizations}, 5 righe, NESSUNA colonna ruolo. La Console legge via client pubblico (utente loggato authenticated). Esistono policy SELECT Console per organizations/tenant_features/restaurant_settings ma NON per admin_users.

TASK (fase F8): vista "Tutti gli utenti" + navigazione.
1) Introduci una navigazione tra "Ristoranti" (la vista attuale RestaurantList) e "Utenti" (nuova). Usa react-router-dom (già dipendenza) oppure uno switch di stato nell'AppShell se più semplice e coerente; mantieni header/logout esistenti. Spiega la scelta come candidata DEC.
2) Crea il componente vista Utenti: legge admin_users e mostra per riga email, name, azienda (organizations.name + /slug), edition (badge, riusa editionUtils), is_active. Join via select supabase ('*, organizations(name,slug,edition,is_active)') o due fetch.
3) Ricerca per email (filtro lato client). Gestisci loading / errore / lista vuota.
4) IMPORTANTE: la policy SELECT su admin_users per la Console potrebbe non essere ancora attiva. Se la query torna 0 righe o un errore RLS, mostra un messaggio chiaro tipo "Nessun utente visibile — verifica che PLAN-DB-005 sia stato eseguito su TEST". NON aggirare la RLS, NON usare service role.
5) Genera (se non esiste) docs/Console-Skill/plan-per-matteo/PLAN-DB-005-rls-admin-users-console.md con la policy SELECT su public.admin_users per is_console_user() (stesso pattern di PLAN-DB-004). NON eseguire la DDL.
6) Azioni di riga come placeholder DISABILITATI: "Apri scheda" (sarà collegata in F9), "Modifica"/"Elimina" con etichetta "in arrivo". Nessuna scrittura.
Responsive (~375px e desktop). Niente import da ../src.
DONE quando: cd console && npm run build && npm run lint && npm run typecheck sono verdi; la navigazione funziona; la vista Utenti gestisce il caso "RLS non ancora attiva" senza crash; PLAN-DB-005 esiste.
Alla fine: riepiloga file toccati, comandi di verifica eseguiti con esito reale, decisioni candidate DEC, e cosa resta a Matteo (eseguire PLAN-DB-005). NON committare.
```

**Prompt REVISORE (F8):**
```
Sei il REVISORE della fase F8 sul branch feature/console-super-admin. Cold-start. NON sei l'esecutore.
PRIMA: leggi docs/Console-Skill/00_BUSSOLA_CONSOLE.md (regole d'oro), REQ-001, e il lavoro dell'esecutore (git status + diff + nuovi file in console/src e plan-per-matteo/).
Controverifica DONE-CRITERIA F8:
- Navigazione Ristoranti/Utenti funzionante; header/logout intatti?
- Vista Utenti legge admin_users e mostra email/name/azienda/edition/is_active? Ricerca per email presente?
- Caso "RLS non ancora attiva" gestito con messaggio chiaro, senza crash e senza aggirare la RLS (nessuna service role, nessun client privilegiato nel browser)?
- PLAN-DB-005 generato e coerente col pattern PLAN-DB-004 (policy SELECT per is_console_user())? Nessuna DDL eseguita dall'agente?
- Azioni di riga sono placeholder disabilitati (nessuna scrittura)?
- Responsive; nessun import da ../src; nessuna modifica a src/ o supabase/ di Matteo.
- ESEGUI: cd console && npm run build && npm run lint && npm run typecheck. Riporta l'esito REALE.
Esito: 🟢 VERDE (pronto al commit) oppure 🔴 ROSSO con lista PUNTUALE di correzioni. NON modificare il codice; NON committare.
```

---

### F9 — Scheda azienda (REQ-002, tappa 1)

- **Obiettivo / effetto:** una vista **focus su un singolo tenant** che raccoglie i pannelli già
  esistenti (edition, feature flag, impostazioni) per quell'azienda **più** una **mappa di copertura**
  che, sezione per sezione dell'intervista, dice cosa è configurato / cosa manca / cosa non è ancora
  supportato dalla Console. *Cosa cambia per te:* da un utente/azienda entri in una pagina dove vedi e
  imposti il setup di quel cliente.
- **Modalità:** deep.
- **Dipendenze:** F8 (navigazione + vista utenti da cui aprire la scheda).
- **Done-criteria:**
  1. Rotta/vista **scheda azienda per un singolo tenant** (es. `/azienda/:tenantId`), apribile da "Apri scheda" nella vista Utenti **e** da una card in Ristoranti.
  2. La scheda **riusa** `EditionSelector`, `FeatureFlagsPanel`, `RestaurantSettingsPanel` per quel solo tenant (non più nella griglia). Mostra anche i campi base `organizations` (name, slug, plan, max_*, is_active) in lettura.
  3. **Mappa di copertura intervista**: per ciascuna delle 9 sezioni di `onboarding/INTERVISTA_NUOVO_CLIENTE.md`, una riga con stato: ✅ configurato / ⬜ manca / 🔒 non ancora supportato dalla Console (con link alla sotto-tappa/FU). Le sezioni non esposte (contatti, orari/fasce, sala/tavoli, menu/QR, aspetto, accessi) sono **mostrate in lettura/placeholder** con lo stato corretto.
  4. Scritture: solo quelle già esistenti (edition/feature/impostazioni), che oggi sono gattate `isSandboxTenant`. **In F9 NON si tocca il gate** (resta sandbox-only fino a F10/F11): per i tenant non-sandbox i pannelli restano in sola lettura. Documenta questo limite come nota (sarà sbloccato in F10).
  5. Responsive; niente import da `../src`; `build`+`lint`+`typecheck` verdi.
- **Note:** la copertura completa (DEC-040) è incrementale: F9 stabilisce la **struttura** + le sezioni già pronte; le altre sezioni hanno editor dedicati che si pianificano come sotto-tappe (FU-CONSOLE-9).

**Prompt ESECUTORE (F9):**
```
Lavori sul branch feature/console-super-admin. ESECUTORE cold-start. NON sei il revisore di F8.
PRIMA: leggi docs/Console-Skill/00_BUSSOLA_CONSOLE.md, REQ-002 (docs/Console-Skill/collaborazione/richieste/REQ-002-scheda-singolo-utente-azienda.md), docs/Console-Skill/onboarding/INTERVISTA_NUOVO_CLIENTE.md, e i componenti esistenti console/src/components/{RestaurantList,EditionSelector,FeatureFlagsPanel,RestaurantSettingsPanel}.tsx + AppShell.tsx + la navigazione introdotta in F8.
APPLICA le regole d'oro (RULE-4 codice solo in console/, no import da ../src; RULE-1 nessuna scrittura nuova qui; RULE-5 traccia le decisioni).

TASK (fase F9): SCHEDA AZIENDA per un singolo tenant (tappa 1 di REQ-002).
1) Crea una vista "scheda azienda" per un singolo tenant (es. rotta /azienda/:tenantId con react-router, o equivalente coerente con la nav di F8). Apribile da "Apri scheda" nella vista Utenti (collega il placeholder di F8) e da una card/azione in Ristoranti.
2) Nella scheda, riusa EditionSelector, FeatureFlagsPanel, RestaurantSettingsPanel passando quel tenantId. Mostra anche i campi base di organizations (name, slug, plan, max_bookings_per_year, max_booking_requests_per_year, is_active) in lettura.
3) Costruisci una MAPPA DI COPERTURA INTERVISTA: per ciascuna delle sezioni di INTERVISTA_NUOVO_CLIENTE.md (Sez.0 anagrafica/versione, Sez.1 contatti, Sez.2 funzioni, Sez.3 orari/fasce, Sez.4 regole prenotazione, Sez.5 sala/tavoli, Sez.6 menu/QR, Sez.7 aspetto, Sez.8 accessi) mostra una riga con stato: ✅ configurato (dato presente), ⬜ manca (esposto ma vuoto), 🔒 non ancora supportato dalla Console. Le sezioni 1/3/5/6/7/8 oggi non hanno editor: mostrale come 🔒 con nota "in arrivo (FU-CONSOLE-9)".
4) NON modificare il gate isSandboxTenant in questa fase: per i tenant non-sandbox i pannelli edition/feature/impostazioni restano in sola lettura (sarà sbloccato in F10 per DEC-037). Scrivi una nota visibile nella scheda che lo spiega.
5) Responsive (~375px e desktop). Niente import da ../src.
DONE quando: cd console && npm run build && npm run lint && npm run typecheck verdi; dalla vista Utenti e da Ristoranti si apre la scheda di un tenant; la scheda mostra pannelli esistenti + mappa di copertura con stati corretti.
Alla fine: riepiloga file toccati, comandi di verifica con esito reale, decisioni candidate DEC, follow-up aperti (FU-CONSOLE-9 sezioni mancanti). NON committare.
```

**Prompt REVISORE (F9):**
```
Sei il REVISORE della fase F9 sul branch feature/console-super-admin. Cold-start. NON sei l'esecutore.
PRIMA: leggi 00_BUSSOLA_CONSOLE.md, REQ-002, INTERVISTA_NUOVO_CLIENTE.md e il lavoro dell'esecutore.
Controverifica DONE-CRITERIA F9:
- Esiste una scheda azienda per singolo tenant, apribile da Utenti (collegato il placeholder F8) e da Ristoranti?
- Riusa EditionSelector/FeatureFlagsPanel/RestaurantSettingsPanel per quel tenant + mostra i campi base di organizations in lettura?
- La mappa di copertura copre tutte le 9 sezioni dell'intervista con stati corretti (✅/⬜/🔒) e nota FU per le sezioni non supportate?
- Il gate isSandboxTenant NON è stato toccato (non-sandbox restano sola lettura) e il limite è documentato in UI?
- Responsive; nessun import da ../src; nessuna modifica a src/ o supabase/ di Matteo; nessuna scrittura DB nuova.
- ESEGUI: cd console && npm run build && npm run lint && npm run typecheck. Esito REALE.
Esito: 🟢 VERDE o 🔴 ROSSO con correzioni puntuali. NON modificare il codice; NON committare.
```

---

### F10 — Estensione Edge `console-admin` (fondamenta del write-block)

- **Obiettivo / effetto:** dare all'Edge le azioni potenti su **utenti** e **aziende** e **sbloccare il
  guard sandbox** sostituendolo con la rete di sicurezza DEC-037 (allowlist + conferme forti).
  *Cosa cambia per te:* il "braccio robotico" lato server impara a creare/modificare/eliminare utenti e
  aziende su qualsiasi tenant di TEST, sempre dietro l'allowlist.
- **Modalità:** deep (sicurezza, service role, Auth admin).
- **Dipendenze:** F9.
- **Done-criteria:**
  1. Nuove azioni nell'Edge `console-admin`: `create_admin_user`, `update_admin_user`, `delete_admin_user`, `create_tenant` (azienda + admin in un passaggio), `delete_tenant`. Tipi specchio aggiornati in `console/src/lib/consoleAdminClient.ts`.
  2. **Sblocco guard (DEC-037):** rimuovere/estendere `SANDBOX_TENANT_IDS` mantenendo **intatto** il gate allowlist (`CONSOLE_ALLOWED_EMAILS`) e la verifica JWT. Le azioni distruttive richiedono nel payload una **conferma esplicita** (es. `confirm_name`/`confirm_email`) che il server **rivalida** contro il valore reale prima di cancellare (DEC-038). RULE-1: la function parla solo col proprio progetto = TEST.
  3. Utenti Auth via `supabase.auth.admin.createUser` / `deleteUser` (service role, solo lato Edge). `create_admin_user` crea l'utente Auth (email+password) **e** la riga `admin_users` associata al tenant; `delete_admin_user` rimuove riga + utente Auth.
  4. `create_tenant`: valida slug **unico** ed edition valida; crea `organizations` + (opzionale) admin in un passaggio. `delete_tenant`: hard-delete protetto.
  5. **FK/cascata:** `organizations` è referenziata da molte tabelle. Verificare se il delete richiede cancellazione figli o `ON DELETE CASCADE`. Se serve schema/GRANT/cascata → **PLAN-DB-006** (RULE-3), **non** eseguito dall'agente; l'azione `delete_tenant` gestisce ciò che può lato applicativo e documenta il resto.
  6. Codice pronto + tipi client allineati; **deploy della function = lato Matteo** (aggiornare istruzioni in PLAN-DB-003 o nuovo plan). Nessun deploy silenzioso.
- **Note:** niente UI in questa fase (è in F11/F12). Qui solo Edge + client helper + plan.

**Prompt ESECUTORE (F10):**
```
Lavori sul branch feature/console-super-admin. ESECUTORE cold-start.
PRIMA: leggi 00_BUSSOLA_CONSOLE.md, REQ-001 e REQ-003, context/CONSOLE_APP_CONTEXT.md (§sicurezza), e i file esistenti console/supabase/functions/console-admin/index.ts + console/src/lib/consoleAdminClient.ts + plan-per-matteo/PLAN-DB-003.
APPLICA le regole d'oro. NOTA DEC-037: RULE-2 (sandbox-only) è REVOCATA per la console — le azioni valgono su tutte le aziende su TEST, ma la rete di sicurezza diventa: gate allowlist (già attivo) + scritture solo via Edge + conferme forti sulle azioni distruttive (DEC-038). RULE-1 resta: solo TEST docnnernvp. RULE-3: schema/GRANT/cascata → PLAN-DB, non eseguiti.

TASK (fase F10): estendi l'Edge Function console-admin con le azioni utenti/aziende e sblocca il guard sandbox.
1) Aggiungi le azioni: create_admin_user, update_admin_user, delete_admin_user, create_tenant (+admin opzionale in un passaggio), delete_tenant. Mantieni le azioni esistenti (update_edition, upsert_tenant_feature, upsert_restaurant_setting).
2) Sblocca il guard: rimuovi/estendi SANDBOX_TENANT_IDS mantenendo INTATTI la verifica JWT e il gate allowlist CONSOLE_ALLOWED_EMAILS. Le azioni distruttive (delete_admin_user, delete_tenant) devono richiedere nel payload una conferma (es. confirm_email / confirm_name) che il SERVER rivalida contro il valore reale letto dal DB prima di cancellare. Se non combacia → 400/409, niente cancellazione.
3) Utenti Auth con service role (solo lato Edge): create_admin_user crea l'utente in Supabase Auth (auth.admin.createUser con email+password, email confermata) e inserisce la riga admin_users (email, name, tenant_id). update_admin_user aggiorna name/tenant_id/email coerentemente. delete_admin_user rimuove riga admin_users + utente Auth.
4) create_tenant: valida slug unico (query) ed edition ∈ {classic,pro,enterprise}; crea organizations; se passato un admin (email+password) crealo come al punto 3. delete_tenant: hard-delete protetto.
5) FK/cascata: organizations è referenziata da molte tabelle (admin_users, restaurant_settings, tenant_features, booking_requests, ...). Verifica (list_tables) cosa impedisce un delete diretto. Gestisci lato applicativo ciò che è ragionevole; se serve ON DELETE CASCADE o GRANT/policy nuovi, genera docs/Console-Skill/plan-per-matteo/PLAN-DB-006-*.md e NON eseguirlo. Documenta cosa delete_tenant fa e cosa resta a Matteo.
6) Aggiorna i tipi specchio in console/src/lib/consoleAdminClient.ts (nuove azioni + risposte). NESSUNA UI qui (è F11/F12). Verifica get_project_url == docnnernvp se fai qualunque prova di scrittura; preferisci NON scrivere dati reali in questa fase (al più sui sandbox per smoke test).
7) Il DEPLOY della function lo fa Matteo: aggiorna le istruzioni (PLAN-DB-003 o nuovo plan) elencando le nuove azioni e gli eventuali nuovi secret/GRANT.
DONE quando: il codice Edge + i tipi client compilano (cd console && npm run build && npm run lint && npm run typecheck verdi); le azioni distruttive hanno la rivalidazione server della conferma; eventuali esigenze di schema sono in un PLAN-DB-006 non eseguito; deploy documentato per Matteo.
Alla fine: riepiloga, candidate DEC (es. forma del payload di conferma, gestione cascata), e azioni lato Matteo. NON committare.
```

**Prompt REVISORE (F10):**
```
Sei il REVISORE della fase F10. Cold-start. NON sei l'esecutore. Leggi 00_BUSSOLA_CONSOLE.md, REQ-001/003, e il lavoro dell'esecutore (diff dell'Edge + consoleAdminClient.ts + eventuale PLAN-DB-006).
Controverifica DONE-CRITERIA F10:
- Le 5 nuove azioni esistono e i tipi client sono allineati al server?
- Il gate allowlist + verifica JWT sono INTATTI dopo lo sblocco del guard sandbox? La service role resta solo lato Edge (mai nel client)?
- Le azioni distruttive RIVALIDANO lato server la conferma (confirm_email/confirm_name) contro il valore reale prima di cancellare? Caso mismatch → niente cancellazione?
- create_admin_user crea sia l'utente Auth sia la riga admin_users? delete_* rimuove entrambi? create_tenant valida slug unico ed edition?
- FK/cascata: gestita lato app o demandata a PLAN-DB-006 NON eseguito? Nessuna DDL eseguita dall'agente?
- Nessuna modifica a src/ o supabase/ di Matteo (l'Edge della Console sta in console/supabase/)? Nessuna scrittura di dati reali non necessaria; get_project_url==docnnernvp per ogni eventuale prova.
- ESEGUI: cd console && npm run build && npm run lint && npm run typecheck. Esito REALE. Sicurezza: cerca chiavi segrete nel client.
Esito: 🟢 VERDE o 🔴 ROSSO con correzioni puntuali. NON modificare il codice; NON committare.
```

---

### F11 — CRUD utente dalla UI (REQ-001 scrittura)

- **Obiettivo / effetto:** collegare la vista Utenti (F8) alle azioni Edge (F10): creare, modificare,
  eliminare un admin. *Cosa cambia per te:* gestisci gli accessi senza toccare il DB a mano.
- **Modalità:** deep. **Dipendenze:** F10 (azioni Edge) + F8 (vista).
- **Done-criteria:**
  1. **Crea utente**: form email + **password** + scelta azienda (tenant esistente) → `create_admin_user`. Refetch lista.
  2. **Modifica**: name, azienda associata, (email) → `update_admin_user`.
  3. **Elimina**: hard-delete con **conferma "riscrivi l'email esatta"** + avviso irreversibilità (DEC-038) → `delete_admin_user`.
  4. Il gate UI riflette DEC-037: azioni disponibili su **tutte** le aziende (non solo sandbox), sempre via Edge. Feedback successo/errore chiaro. `build`+`lint`+`typecheck` verdi.
- **Note:** richiede l'Edge **deployato** da Matteo per il test E2E; senza deploy, `callConsoleAdmin` restituisce errore esplicito gestito (come già fa il pannello impostazioni). Consegnare con i passi di test per Matteo.

**Prompt ESECUTORE (F11) / REVISORE (F11):** *(da espandere all'avvio della fase, sul modello F8/F10: cold-start, leggi REQ-001 + consoleAdminClient.ts esteso in F10 + vista Utenti F8; collega crea/modifica/elimina con conferma "riscrivi email"; gate DEC-037; gestisci function non deployata; build+lint+typecheck; non committare. Revisore distinto verifica done-criteria + conferma distruttiva + nessuna service role nel browser.)*

---

### F12 — Crea / elimina azienda (REQ-003)

- **Obiettivo / effetto:** creare un'azienda (+admin in un passaggio, DEC-041) ed eliminarla
  (hard-delete protetto, DEC-038). *Cosa cambia per te:* da zero a cliente pronto, e pulizia reale.
- **Modalità:** deep. **Dipendenze:** F10 (azioni Edge) + F9 (scheda, da cui eliminare).
- **Done-criteria:**
  1. **Nuova azienda**: form nome, slug (auto dal nome, modificabile, unico), edition, + (opzionale) admin email+password → `create_tenant`. Compare in lista ed è apribile (F9).
  2. **Elimina azienda** dalla scheda/lista con **conferma "riscrivi il nome esatto"** + avviso irreversibilità e di cosa viene rimosso (cascata) → `delete_tenant`.
  3. Validazione slug unico lato UI (oltre al server). Feedback chiaro. `build`+`lint`+`typecheck` verdi.
- **Note:** dipende da come F10 ha risolto la cascata (eventuale PLAN-DB-006 a carico di Matteo). Consegnare con passi di test per Matteo.

**Prompt ESECUTORE (F12) / REVISORE (F12):** *(da espandere all'avvio: cold-start, leggi REQ-003 + Edge esteso F10 + scheda F9; form azienda+admin un passaggio; elimina con conferma "riscrivi nome"; slug unico; gestisci function non deployata + cascata; build+lint+typecheck; non committare. Revisore distinto verifica conferma distruttiva, slug unico, allineamento col PLAN-DB-006.)*

---

### F13 — Sblocco scrittura pannelli su tutte le aziende (FU-CONSOLE-12)

- **Obiettivo / effetto:** allineare la UI a DEC-037. Oggi `EditionSelector`/`FeatureFlagsPanel`/
  `RestaurantSettingsPanel` abilitano la scrittura **solo** sui sandbox (`isSandboxTenant`), mentre
  l'Edge (F10) la consente su tutte le aziende: nella scheda azienda i tenant reali restano in sola
  lettura. *Cosa cambia per te:* dalla scheda puoi finalmente configurare edition/feature/impostazioni
  dei clienti veri, non solo dei due sandbox.
- **Modalità:** standard. **Dipendenze:** F10 (Edge sblocca le scritture) + F12.
- **Done-criteria:**
  1. I tre pannelli sono **scrivibili per qualunque tenant** (non solo sandbox), sia in `RestaurantList` che in `TenantDetail`. Sparisce il badge/blocco "sola lettura — solo sandbox".
  2. Le modifiche restano **reversibili** (edition/feature/impostazioni) → **nessuna** conferma "riscrivi nome" (quella resta solo per le azioni distruttive F11/F12).
  3. Il gate vero resta **Edge `console-admin` + allowlist** (lato server). `isSandboxTenant` può restare per un'eventuale **etichetta visiva** "sandbox", ma **non** gata più la scrittura.
  4. Degrado invariato se l'Edge non è raggiungibile (messaggio, no crash). `build`+`lint`+`typecheck` verdi. Niente import da `../src`, nessuna modifica a `src/`/`supabase/` root.
- **Note:** valutare un piccolo segnale visivo (es. badge) che distingue un tenant reale da un sandbox, per consapevolezza; non è un blocco.

**Prompt ESECUTORE (F13):**
```
Lavori sul branch feature/console-super-admin, repo c:\Users\tulli\Documents\GitHub\CALENDARIO-V2. ESECUTORE cold-start della fase F13 (FU-CONSOLE-12).
PRIMA leggi: docs/Console-Skill/00_BUSSOLA_CONSOLE.md, docs/Console-Skill/sessioni/FOLLOW_UP.md (FU-CONSOLE-12), docs/Console-Skill/MASTERPLAN_CONSOLE_REQ-001-003.md (sezione F13), e i file: console/src/lib/sandbox.ts, console/src/components/{FeatureFlagsPanel,RestaurantSettingsPanel,EditionSelector,RestaurantList,TenantDetail}.tsx.
REGOLE D'ORO: RULE-1 solo TEST (nessuna scrittura DB da te: l'app scrive via Edge a runtime); DEC-037 RULE-2 REVOCATA per la console (scritture su tutte le aziende, gate = allowlist+Edge); RULE-4 codice solo in console/, no import da ../src, no service role nel browser; RULE-5 traccia decisioni (prossimo DEC libero: DEC-052).
TASK (F13): rimuovere il write-gate isSandboxTenant dai 3 pannelli di configurazione, così sono scrivibili su QUALUNQUE tenant (allineamento a DEC-037).
1) FeatureFlagsPanel: oggi `const sandbox = isSandboxTenant(tenantId)` gata il toggle + mostra "sola lettura — solo sandbox". Rendi i toggle abilitati per tutti i tenant; rimuovi/aggiorna il badge "sola lettura solo sandbox". Le scritture passano già da callConsoleAdmin (Edge).
2) RestaurantSettingsPanel: stesso pattern (`const sandbox = isSandboxTenant(tenantId)` gata gli editor int/bool + readOnlyHint). Abilita gli editor per tutti i tenant; rimuovi/aggiorna l'hint sola-lettura.
3) EditionSelector: in RestaurantList (OrgCard) e in TenantDetail viene mostrato SOLO per i sandbox, altrimenti un badge/blocco "Sola lettura". Mostra EditionSelector per TUTTI i tenant; rimuovi il blocco read-only edition.
4) Le modifiche edition/feature/impostazioni sono REVERSIBILI → NON aggiungere conferme "riscrivi nome" (quelle restano solo per delete utente/azienda).
5) isSandboxTenant/SANDBOX_TENANT_IDS: NON è più un gate di scrittura. Puoi: (a) tenerli per un'etichetta visiva opzionale "sandbox" (consigliato, così resta chiaro quali sono i banchi di prova), oppure (b) se diventano inutilizzati, lascia sandbox.ts ma evita import morti (niente warning lint unused). Documenta la scelta come DEC-052.
6) Degrado invariato se l'Edge non è raggiungibile (callConsoleAdmin {data,error} → messaggio inline, no crash). Responsive, stile coerente.
DONE quando: cd console && npm run build && npm run lint && npm run typecheck VERDI (eseguili, riporta output reale); i 3 pannelli sono editabili su un tenant NON-sandbox (verificabile in UI: editor/toggle/selettore attivi, niente badge "solo sandbox"); nessuna conferma distruttiva aggiunta; nessun import morto.
Alla fine RIPORTA: file toccati, comandi con esito reale, candidate DEC, e cosa testa Matteo (dopo re-deploy Edge: cambiare edition/feature/impostazione di un'azienda reale dalla scheda). NON committare, NON git add, ripristina package-lock.json di root se npm lo tocca (git checkout HEAD -- package-lock.json) — NON toccare package.json/package-lock.json di root (lavoro di Matteo in corso).
```

**Prompt REVISORE (F13):**
```
Sei il REVISORE indipendente della fase F13 (FU-CONSOLE-12) sul branch feature/console-super-admin, repo c:\Users\tulli\Documents\GitHub\CALENDARIO-V2. Cold-start. NON sei l'esecutore.
PRIMA leggi: 00_BUSSOLA_CONSOLE.md, FOLLOW_UP.md (FU-CONSOLE-12), MASTERPLAN_CONSOLE_REQ-001-003.md (F13). Poi git status + git diff HEAD e leggi i file modificati ({FeatureFlagsPanel,RestaurantSettingsPanel,EditionSelector,RestaurantList,TenantDetail}.tsx, sandbox.ts).
Controverifica DONE-CRITERIA F13 (✓/✗ con motivo):
1. I 3 pannelli sono scrivibili per qualunque tenant (non solo sandbox), sia in RestaurantList che in TenantDetail? Sparito il badge/blocco "sola lettura solo sandbox"?
2. NESSUNA conferma "riscrivi nome" aggiunta (le modifiche sono reversibili)?
3. Il gate resta Edge+allowlist (le scritture passano sempre da callConsoleAdmin)? isSandboxTenant non gata più la scrittura (al più etichetta visiva)?
4. Nessun import morto / warning lint? Degrado se Edge non raggiungibile invariato?
5. RULE-4: codice solo in console/, no import da ../src, nessuna modifica a src/ o supabase/ o package.json/package-lock root? Nessuna scrittura DB diretta dall'app?
6. DEC-052 sensata?
ESEGUI DAVVERO e riporta esito reale: cd console && npm run build ; npm run lint ; npm run typecheck.
Cerca regressioni: i sandbox continuano a funzionare; nessun componente rotto da prop rimosse; refetch dopo modifica ancora ok.
Esito finale OBBLIGATORIO: ultima riga "VERDETTO: 🟢 VERDE" o "VERDETTO: 🔴 ROSSO" con lista numerata di correzioni. NON modificare il codice; NON committare.
```

---

## 3. Protocollo del ciclo (per ogni F_i) — invariato dal MASTERPLAN_CONSOLE.md §3

1. **Esecutore** (Agent, attore A) col prompt esecutore di `F_i`.
2. **Revisore** (Agent, attore B ≠ A) col prompt revisore di `F_i`.
3. **Se 🟢 VERDE** → compilo il blocco `F_i` in `sessioni/PHASE_AUDIT.md`, registro le `DEC-NNN` nuove,
   poi **commit** (Conventional Commits, es. `feat(console): vista utenti (F8, DEC-0NN, REQ-001)`).
   Aggiorno `sessioni/SESSION_LOG.md` (1 riga) e il `REGISTRO_RICHIESTE.md`.
4. **Se 🔴 ROSSO** → rilancio l'esecutore con le correzioni (annoto i round).
5. **Blocco** (serve schema/deploy lato Matteo) → genero/aggiorno il `PLAN-DB-NNN`, marco la parte come
   bloccata, proseguo con la prossima fase eseguibile.
6. Una REQ passa a **CONSEGNATA** solo con la sezione «② Consegna» compilata + log aggiornati (regola C-3).

---

## 4. Stato di avanzamento (aggiornato dall'Orchestrator)

| Fase | REQ | Esecutore | Revisore | Verdetto | Commit | Note |
|------|-----|-----------|----------|----------|--------|------|
| F8 | 001 (R) | ✅ | ✅ | 🟢 VERDE | sì | dipende da PLAN-DB-005 (Matteo) per i dati reali |
| F9 | 002 (t1) | ✅ | ✅ | 🟢 VERDE | sì | rosso→verde (DEC-046 registrata, useEffect corretto); FU-CONSOLE-9 ampliato |
| F10 | 001/003 | ✅ | ✅ | 🟢 VERDE | sì | rosso→verde (4 fix audit); deploy + PLAN-DB-006 opz. (Matteo); DEC-047 |
| F11 | 001 (W) | ✅ | ✅ | 🟢 VERDE | sì | rosso→verde (password 8, email case-insensitive, DEC-048..050); E2E dopo deploy F10 |
| F12 | 003 | ✅ | ✅ | 🟢 VERDE | sì | verde round 1 (cleanup hint); E2E dopo deploy F10 + PLAN-DB-006 opz.; DEC-051 |
| F13 | FU-12 | ✅ | ✅ | 🟢 VERDE | sì | pannelli scrivibili su tutte le aziende; DEC-052; cleanup→FU-CONSOLE-13 |

> **Plan DB a carico di Matteo per questo master-plan:** PLAN-DB-005 (SELECT admin_users), e — se F10 lo
> richiede — PLAN-DB-006 (cascata/GRANT delete_tenant) + ri-deploy Edge `console-admin`.
