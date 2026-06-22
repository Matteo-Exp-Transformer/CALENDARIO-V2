# Phase Audit — esecuzione del master-plan (audit trail per fase)

> **Obbligatorio.** Per ogni fase `Fi` del `MASTERPLAN_CONSOLE.md`, l'Orchestrator compila un blocco
> qui sotto, così l'intero lavoro è **ricostruibile e revisionabile** dopo, anche con Matteo che ha
> dato consenso pieno (DEC-013). Niente fase "silenziosa".
>
> **Regola:** non si committa una fase il cui blocco di audit non è compilato (almeno fino a "Verdetto").

## Indice fasi

| Fase | Obiettivo | Esecutore | Revisore | Verdetto | Commit | DEC collegate |
|------|-----------|-----------|----------|----------|--------|---------------|
| F1 | Scaffolding `console/` isolata | Sonnet (general-purpose) | Sonnet (general-purpose) | 🟢 VERDE | `c981fc0` | DEC-001, DEC-014, DEC-016 |
| F2 | Elenco ristoranti (sola lettura) | Sonnet (general-purpose) | Sonnet (general-purpose) | 🟢 VERDE | `49c0230` | DEC-017 |
| F3 | Login reale (Supabase Auth + allowlist) | Sonnet (general-purpose) | Sonnet (general-purpose) | 🟢 VERDE | `8ca16cf` | DEC-018, DEC-019, DEC-020; PLAN-DB-002 |
| F4 | Edge Function scritture privilegiate (deploy a Matteo) | Sonnet (R1) + Haiku (R2 fix) | Sonnet (R1) + Haiku (R2) | 🟢 VERDE (round 2) | `bd7d038` | DEC-021/022/023/024/025/026; PLAN-DB-003 |
| F5 | Cambio edition (sandbox, via Edge) | Sonnet (general-purpose) | Sonnet (general-purpose) | 🟢 VERDE | `37bd836` | DEC-027 |
| F6 | Feature flag (`tenant_features`) | Sonnet (general-purpose) | Sonnet (general-purpose) | 🟢 VERDE | `15da08a` | DEC-028, DEC-029; PLAN-DB-004 |
| F7 | Impostazioni ristorante (`restaurant_settings`) | Sonnet (general-purpose) | Sonnet (general-purpose) | 🟢 VERDE | _(vedi git log)_ | DEC-030, DEC-031 |

---

### Fase F1 — Scaffolding `console/` isolata
- **Obiettivo / effetto:** app Console vuota ma funzionante e **isolata** dalla pipeline di Matteo, collegata al DB TEST con sola chiave pubblica. Effetto: cantiere separato che non può rompere l'app di Matteo.
- **Modalità:** deep
- **Dipendenze:** nessuna

**Esecutore**
- Prompt usato: `MASTERPLAN_CONSOLE.md` §F1 (prompt esecutore)
- Sintesi: creato sotto-progetto `console/` (Vite+React+TS+`@supabase/supabase-js`), client Supabase con sola anon key da `import.meta.env`, placeholder login (rimanda a F3), app shell vuota. Isolamento root via exclude.
- File toccati: nuovi sotto `console/` (package.json, vite.config.ts, tsconfig.json, tsconfig.node.json, .eslintrc.cjs, .gitignore, .env.example, postcss.config.js, index.html, src/App.tsx, src/main.tsx, src/vite-env.d.ts, src/lib/supabaseClient.ts, src/components/LoginPlaceholder.tsx, src/components/AppShell.tsx, src/styles/global.css). Root (solo esclusioni minime): `tsconfig.json`, `.eslintrc.cjs`, `vitest.config.ts`.
- Decisioni autonome prese: DEC-016 (porta 5174, alias `@console/`, postcss locale vuoto, `isAuthenticated=false` transitorio, `robots noindex`).
- Scritture DB: nessuna.
- Plan per Matteo generati: nessuno.

**Revisore (controverifica)**
- Done-criteria verificati: DC-1 isolamento ✓ · DC-2 esclusione pipeline root (tsconfig/ESLint/Vitest) ✓ · DC-3 nessun import da `../src` (grep) ✓ · DC-4 nessuna service role/secret nel browser, chiavi solo pubbliche da env, `.env.local` gitignored ✓ · DC-5 placeholder login ✓ · DC-6 build reale `npm run build` 33 moduli, 0 errori ✓
- Regole d'oro rispettate: ✓ (modifiche root = solo esclusioni di `console/`; nessuna scrittura DB; nessun import da `../src`)
- Test/lint/typecheck: build `console/` verde (tsc 0 errori). Pipeline root non installata in ambiente (preesistente), ma non vede `console/`.
- Regressioni controllate: file root toccati = solo righe di esclusione (diff verificato).
- **Verdetto:** 🟢 VERDE
- Ri-lavorazioni: nessuna (verde al round 1).

**Chiusura fase**
- **Commit:** `c981fc0` — feat(console): scaffolding isolato console/ (F1, DEC-016)
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: scelta UI library/Tailwind (F2), deploy Vercel (DEC-012, futuro)

---

### Fase F2 — Elenco ristoranti (sola lettura)
- **Obiettivo / effetto:** prima schermata reale: la Console legge `organizations` e mostra l'elenco dei ristoranti. Effetto: si vedono i tenant veri dal browser, in sola lettura.
- **Modalità:** standard
- **Dipendenze:** F1

**Esecutore**
- Prompt usato: `MASTERPLAN_CONSOLE.md` §F2 (prompt esecutore)
- Sintesi: creata `RestaurantList.tsx` (legge `organizations`, stati loading/error/empty), helper `editionUtils.ts` locale (normalize/label/colori edition), integrata in `AppShell`. Creato `console/.env.local` (gitignored) con URL+anon key TEST recuperati via MCP CONSOLE.
- File toccati: `console/src/components/RestaurantList.tsx` (nuovo), `console/src/lib/editionUtils.ts` (nuovo), `console/src/components/AppShell.tsx` (mod), `console/src/App.tsx` (mod), `console/.env.local` (non tracciato).
- Decisioni autonome prese: DEC-017 (anon key legacy JWT; `isAuthenticated=true` transitorio per mostrare la shell in attesa di F3; griglia responsive senza media query).
- Scritture DB: nessuna. `get_project_url` verificato = docnnernvp (TEST). Lettura via client pubblico (policy `anon_select_active_organizations`): 7 tenant attivi.
- Plan per Matteo generati: nessuno.

**Revisore (controverifica)**
- Done-criteria verificati: name/slug/edition/is_active ✓ · sola lettura (grep insert/update/upsert/delete/rpc = 0) ✓ · responsive + stati loading/error/empty ✓ · helper edition ricreato, nessun import da `../src`/`@/` ✓ · nessuna service role nel browser, `.env.local` non tracciato ✓ · build reale 77 moduli + tsc 0 errori ✓
- Regole d'oro rispettate: ✓ (nessuna modifica fuori da `console/`; `src/`/`supabase/` intatti; RLS non aggirata)
- Test/lint/typecheck: `npm run typecheck` exit 0; `npm run build` ok.
- Regressioni controllate: diff confinato a `console/src/`.
- **Verdetto:** 🟢 VERDE
- Ri-lavorazioni: nessuna (verde al round 1).

**Chiusura fase**
- **Commit:** `49c0230` — feat(console): elenco ristoranti (F2, DEC-017)
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: FU-CONSOLE-5 (tenant sospesi non visibili al client anon — rivalutare in F3/F5 con auth super-admin)

---

### Fase F3 — Login reale (Supabase Auth + allowlist email)
- **Obiettivo / effetto:** sostituito il gate transitorio con un login vero (Magic Link) che fa entrare solo le email in allowlist (DEC-011). Effetto: la Console è privata davvero.
- **Modalità:** deep
- **Dipendenze:** F1

**Esecutore**
- Prompt usato: `MASTERPLAN_CONSOLE.md` §F3 (prompt esecutore)
- Sintesi: implementato login Magic Link (`signInWithOtp`, `shouldCreateUser:false`); hook `useAuth` (getSession + onAuthStateChange) con stati `loading|unauthenticated|denied|authenticated`; allowlist email pura/testabile via env `VITE_CONSOLE_ALLOWED_EMAILS` (case-insensitive, fail-safe vuota=nessuno); `LoginScreen` reale; logout in `AppShell`; rimosso `isAuthenticated=true` di F2.
- File toccati: `console/src/lib/authAllowlist.ts` (nuovo), `console/src/hooks/useAuth.ts` (nuovo), `console/src/components/LoginScreen.tsx` (nuovo), `console/src/App.tsx` (mod), `console/src/components/AppShell.tsx` (mod), `console/.env.example` (mod). `LoginPlaceholder.tsx` orfano.
- Decisioni autonome prese: DEC-018 (`shouldCreateUser:false`), DEC-019 (allowlist come Set singleton env-time), DEC-020 (`AuthState` union discriminata).
- Scritture DB: nessuna.
- Plan per Matteo generati: **PLAN-DB-002** (allowlist lato DB: tabella `console_allowed_emails` + `is_console_user()` SECURITY DEFINER + template RLS) — da eseguire da Matteo.

**Revisore (controverifica)**
- Done-criteria verificati: login Magic Link + getSession/onAuthStateChange ✓ · allowlist case-insensitive + fail-safe + signOut su denied ✓ · viste protette + gate F2 rimosso ✓ · logout ✓ · nessuna service role nel browser (grep) ✓ · build+typecheck+lint 0 errori/0 warning ✓
- Regole d'oro rispettate: ✓ (`src/`/`supabase/` intatti; nessun DDL — allowlist DB solo come PLAN-DB-002; `.env.local` non tracciato)
- Test/lint/typecheck: `npm run build`, `typecheck`, `lint` tutti verdi.
- Regressioni controllate: diff confinato a `console/` + plan-per-matteo.
- **Verdetto:** 🟢 VERDE (1 nota minore: commento citava PLAN-DB-001 → **corretto** dall'Orchestrator a PLAN-DB-002)
- Ri-lavorazioni: nessun round esecutore; correzione commento applicata dall'Orchestrator.

**Chiusura fase**
- **Commit:** `8ca16cf` — feat(console): login Supabase Auth + allowlist (F3, DEC-018/019/020)
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: PLAN-DB-002 da eseguire (Matteo); redirect URL magic link `localhost:5174` da configurare in Supabase Dashboard; email reale di Matteo da inserire in `.env.local`; `LoginPlaceholder.tsx` orfano da rimuovere; test E2E magic link = manuale di Matteo

---

### Fase F4 — Edge Function per scritture privilegiate (deploy a Matteo)
- **Obiettivo / effetto:** "braccio robotico" lato server che esegue le scritture potenti con service role fuori dal browser (DEC-010). Per scelta di Cristiano (DEC-021) l'agente prepara il codice, il deploy lo fa Matteo. Effetto: la Console potrà scrivere in modo sicuro senza esporre la chiave admin.
- **Modalità:** deep
- **Dipendenze:** F3

**Esecutore**
- Prompt usato: `MASTERPLAN_CONSOLE.md` §F4 (prompt esecutore) + vincolo DEC-021 (no deploy)
- Sintesi: creata Edge Function Deno `console-admin` (verifica JWT + allowlist server-side `CONSOLE_ALLOWED_EMAILS` + sandbox guard sui 2 tenant + 3 azioni: `update_edition`, `upsert_tenant_feature`, `upsert_restaurant_setting`; service role solo da `Deno.env`; CORS). Helper client `consoleAdminClient.ts` (JWT della sessione, errori normalizzati). PLAN-DB-003 con istruzioni di deploy per Matteo. Esclusa la cartella `supabase` dalla build Vite (`console/tsconfig.json` exclude).
- File toccati: `console/supabase/functions/console-admin/index.ts` (nuovo), `console/src/lib/consoleAdminClient.ts` (nuovo), `console/tsconfig.json` (mod, exclude), `docs/Console-Skill/plan-per-matteo/PLAN-DB-003-edge-console-admin.md` (nuovo).
- Decisioni autonome prese: DEC-022 (function in `console/supabase/`, non root), DEC-023 (`--no-verify-jwt`, auth gestita in-function), DEC-024 (gate doppio: `CONSOLE_ALLOWED_EMAILS` server ≠ `VITE_CONSOLE_ALLOWED_EMAILS` client), DEC-025 (helper non lancia eccezioni, errori normalizzati).
- Scritture DB: nessuna. Deploy: nessuno (a Matteo).
- Plan per Matteo generati: **PLAN-DB-003** (deploy Edge `console-admin` su TEST).

**Revisore (controverifica)**
- **Round 1 → 🔴 ROSSO:** nomi colonna errati verificati contro lo schema live (via MCP read-only, `get_project_url`=docnnernvp): `organization_id`→`tenant_id`, `is_enabled`→`enabled`, `key`→`setting_key`, `value`→`setting_value` (in `tenant_features` e `restaurant_settings`, codice + PLAN-DB-003). Auth/allowlist/sandbox-guard/service-role/CORS/build già ✓.
- **Round 2 (fix Haiku) → 🟢 VERDE:** confermato `tenant_id`/`enabled`/`feature_key` + `onConflict 'tenant_id,feature_key'`; `tenant_id`/`setting_key`/`setting_value` + `onConflict 'tenant_id,setting_key'`; `update_edition` invariata; grep: nessun residuo dei nomi errati; PLAN-DB-003 allineato; build+typecheck verdi.
- Regole d'oro rispettate: ✓ (function in `console/supabase/`, non root Matteo; `src/`/`supabase/` root intatti; nessun deploy; nessuna scrittura DB; service role solo server).
- **Verdetto:** 🟢 VERDE (al round 2)
- Ri-lavorazioni: 1 round (correzione nomi colonna).

**Chiusura fase**
- **Commit:** `bd7d038` — feat(console): Edge Function console-admin (F4, DEC-022/023/024/025/026)
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: **PLAN-DB-003 da eseguire (Matteo)** — finché la function non è deployata e `VITE_CONSOLE_ADMIN_FUNCTION_URL` impostata, le scritture di F5/F6/F7 dal browser non sono verificabili E2E (l'effetto sul DB resta verificabile dall'Orchestrator via MCP)

---

### Fase F5 — Cambio edition (sandbox, via Edge)
- **Obiettivo / effetto:** dalla Console si cambia la versione venduta (`organizations.edition`) di un tenant sandbox, via Edge. Effetto: primo vero comando di configurazione (classic↔pro↔enterprise) sui banchi di prova.
- **Modalità:** deep
- **Dipendenze:** F4 (helper `callConsoleAdmin`); E2E dipende dal deploy della Edge (PLAN-DB-003)

**Esecutore**
- Prompt usato: `MASTERPLAN_CONSOLE.md` §F5 (prompt esecutore) + nota deploy-deferred
- Sintesi: `sandbox.ts` (`SANDBOX_TENANT_IDS` + `isSandboxTenant`), hook `useEditionChange` (chiama `callConsoleAdmin('update_edition')`, stati idle/loading/success/error), `EditionSelector` (3 bottoni edition, banner successo/errore, gestione "function non configurata"); `RestaurantList` mostra il selettore solo sui sandbox (altri "Sola lettura") e rilegge dopo successo (refetch counter).
- File toccati: `console/src/lib/sandbox.ts` (nuovo), `console/src/hooks/useEditionChange.ts` (nuovo), `console/src/components/EditionSelector.tsx` (nuovo), `console/src/components/RestaurantList.tsx` (mod).
- Decisioni autonome prese: DEC-027 (refetch via counter; stato `useEditionChange` per-tenant).
- Scritture DB: nessuna diretta (passano dall'Edge, non deployata). Nessun `tenant_features` (è F6).
- Plan per Matteo generati: nessuno.

**Revisore (controverifica)**
- Done-criteria verificati: invoca `callConsoleAdmin('update_edition', {tenant_id, edition})` ✓ · gate sandbox via `isSandboxTenant`, non-sandbox = "Sola lettura" ✓ · stati loading/disabled + successo/errore + caso function non configurata senza crash ✓ · refetch post-successo riflette la nuova edition ✓ · nessuna scrittura DB diretta (grep update/upsert/insert/delete = 0), nessun `tenant_features` ✓ · nessun import da `../src` ✓ · build 83 moduli + typecheck 0 errori ✓
- Regole d'oro rispettate: ✓ (`src/`/`supabase/` root intatti; nessuna service role nel browser; nessuna modifica a `docs/` dall'esecutore)
- Test/lint/typecheck: build+typecheck verdi. Lint: 3 warning `console.log` PRE-ESISTENTI nell'Edge di F4 (non di F5) → FU-CONSOLE-6.
- **Verdetto:** 🟢 VERDE
- Ri-lavorazioni: nessuna (verde al round 1).

**Chiusura fase**
- **Commit:** `37bd836` — feat(console): cambio edition tenant sandbox (F5, DEC-027)
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: FU-CONSOLE-6 (lint console.log Edge); test E2E cambio edition = manuale di Matteo dopo deploy

---

### Fase F6 — Feature flag (`tenant_features`)
- **Obiettivo / effetto:** accendere/spegnere add-on per-tenant via `tenant_features` (DEC-008), «+QR»=classic+`qrMenu` (DEC-009), ignorando `qr_menu_enabled` legacy. Effetto: gestione add-on oltre il bundle dell'edition.
- **Modalità:** deep
- **Dipendenze:** F5; E2E dipende da deploy Edge (PLAN-DB-003) + lettura override (PLAN-DB-004)

**Esecutore**
- Prompt usato: `MASTERPLAN_CONSOLE.md` §F6 (prompt esecutore) + nota deploy-deferred
- Sintesi: `features.ts` ricrea fedelmente `buildFeatures` (9 chiavi; classic=vuoto, pro/enterprise=bundle pieno) + `buildFeatureDetails`/`isOverrideActive` (gestione `expires_at`); hook `useFeatureFlags` (legge `tenant_features`, calcola effetto combinato, stato `rls-blocked`) e `useFeatureToggle` (`callConsoleAdmin('upsert_tenant_feature')`); `FeatureFlagsPanel` (lista feature con sorgente bundle/override-on/override-off/absent, toggle solo sandbox); integrato in `RestaurantList`.
- File toccati: `console/src/lib/features.ts` (nuovo), `console/src/hooks/useFeatureFlags.ts` (nuovo), `console/src/hooks/useFeatureToggle.ts` (nuovo), `console/src/components/FeatureFlagsPanel.tsx` (nuovo), `console/src/components/RestaurantList.tsx` (mod).
- Decisioni autonome prese: DEC-028 (lettura `tenant_features` col client anon torna vuota finché PLAN-DB-004 non eseguito → pannello mostra solo bundle; logica UI corretta, manca il dato), DEC-029 (feature già nel bundle con override `enabled=true` mostrata come `bundle`, override ridondante).
- Scritture DB: nessuna diretta (via Edge non deployata). Letture via client pubblico.
- Plan per Matteo generati: **PLAN-DB-004** (policy RLS SELECT su `tenant_features` per la Console).

**Revisore (controverifica)**
- Controllo critico fedeltà `buildFeatures`: ✓ identico all'originale (9 chiavi, bundle, logica override con prefisso `-`).
- Done-criteria verificati: toggle via `callConsoleAdmin('upsert_tenant_feature', {tenant_id, feature_key, is_enabled})` ✓ · gate sandbox (`isSandboxTenant`) + guard in `handleToggle` ✓ · `qr_menu_enabled` non usata (solo commento) ✓ · effetto combinato + `expires_at` gestito ✓ · stati loading/disabled/successo/errore/`rls-blocked` + refetch ✓ · nessuna scrittura DB diretta (grep) + nessun import da `../src` ✓ · build 87 moduli + typecheck 0 errori ✓ · PLAN-DB-004 ben formato, nessun DDL ✓
- Regole d'oro rispettate: ✓ (`src/`/`supabase/` root intatti; service role solo lato Edge)
- **Verdetto:** 🟢 VERDE
- Ri-lavorazioni: nessuna (verde al round 1).

**Chiusura fase**
- **Commit:** `15da08a` — feat(console): feature flag tenant_features (F6, DEC-028/029)
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: **PLAN-DB-004 da eseguire (Matteo)** per leggere gli override reali; test E2E toggle = manuale di Matteo dopo deploy Edge + PLAN-DB-004

---

### Fase F7 — Impostazioni ristorante (`restaurant_settings`)
- **Obiettivo / effetto:** configurare i «numeri tecnici» di un tenant sandbox usando solo le chiavi del registro. Effetto: la Console copre la configurazione fine del ristorante senza inventare chiavi.
- **Modalità:** deep
- **Dipendenze:** F6; E2E dipende da deploy Edge (PLAN-DB-003)

**Esecutore**
- Prompt usato: `MASTERPLAN_CONSOLE.md` §F7 (prompt esecutore) + nota deploy-deferred + freno scope creep (subset rappresentativo)
- Sintesi: `restaurantSettings.ts` ricrea tutte le 20 chiavi di `RESTAURANT_SETTING_KEYS_V1` (`as const`) + 5 esposte con editor/validatori/default fedeli (`booking_window_days`, `walk_in_max_guests`, `slot_limit_enabled`, `booking_reject_out_of_slot`, `booking_time_slots_enabled`); hook `useRestaurantSettings` (lettura, default-se-assente, stato `rls-blocked`) e `useSettingSave` (`callConsoleAdmin('upsert_restaurant_setting')`); `RestaurantSettingsPanel` (valore vs default, validazione pre-invio, toggle solo sandbox); integrato in `RestaurantList`. Risolto FU-CONSOLE-6 (esclusa `supabase/` dall'ESLint Console + rimosso `eslint-disable` ridondante in `FeatureFlagsPanel`).
- File toccati: `console/src/lib/restaurantSettings.ts` (nuovo), `console/src/hooks/useRestaurantSettings.ts` (nuovo), `console/src/hooks/useSettingSave.ts` (nuovo), `console/src/components/RestaurantSettingsPanel.tsx` (nuovo), `console/src/components/RestaurantList.tsx` (mod), `console/src/components/FeatureFlagsPanel.tsx` (mod, cleanup lint), `console/.eslintrc.cjs` (mod, ignore supabase).
- Decisioni autonome prese: DEC-030 (subset di 5 chiavi esposte + registro completo ricreato; chiavi avanzate non esposte → eventuale F8), DEC-031 (ESLint ignora `supabase/` Deno, allineato a tsconfig → chiude FU-CONSOLE-6).
- Scritture DB: nessuna diretta (via Edge non deployata). Letture via client pubblico.
- Plan per Matteo generati: nessuno (lettura `restaurant_settings` non risultata bloccata; se in futuro bloccata → PLAN-DB-005 indicato dal messaggio UI).

**Revisore (controverifica)**
- Controllo critico fedeltà registro/validatori: ✓ chiavi identiche all'originale (nomi/ordine), validatori e default delle 5 esposte coerenti (es. `booking_window_days` int 1–365); nessuna chiave inventata.
- Done-criteria verificati: scrittura via `callConsoleAdmin('upsert_restaurant_setting', {tenant_id, setting_key, value})` ✓ · gate sandbox (`isSandboxTenant`) + guard server ✓ · validazione pre-invio (salva disabilitato se invalido) ✓ · lettura client pubblico + default se assente + `rls-blocked` senza crash ✓ · stati loading/disabled/successo/errore + refetch ✓ · nessuna scrittura diretta (grep) + nessun import da `../src` ✓ · build 91 moduli + typecheck + lint 0 warning ✓
- Controllo `.eslintrc.cjs`/`FeatureFlagsPanel`: modifiche solo di stile/config, nessun cambio di logica, build/lint verdi ✓
- Regole d'oro rispettate: ✓ (`src/`/`supabase/` root intatti; service role solo lato Edge)
- **Verdetto:** 🟢 VERDE (nota minore: `prevValueRef` con `useState` fuorviante → FU-CONSOLE-8, leggibilità)
- Ri-lavorazioni: nessuna (verde al round 1).

**Chiusura fase**
- **Commit:** _(vedi git log — feat(console): impostazioni ristorante (F7, DEC-030/031))_
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: FU-CONSOLE-8 (leggibilità `prevValueRef`); chiavi avanzate non esposte (eventuale F8); test E2E = manuale di Matteo dopo deploy

---

### Fase F8 — Vista "Tutti gli utenti" + navigazione (REQ-001 lettura)
- **Obiettivo / effetto:** elencare tutti gli admin (`admin_users`) con azienda associata; navigazione Ristoranti/Utenti. Sola lettura.
- **Modalità:** deep
- **Dipendenze:** PLAN-DB-005 (policy SELECT `admin_users`, a carico di Matteo); F1-F7 (scaffolding/auth/elenco)

**Esecutore** (general-purpose, Sonnet)
- Prompt usato: `MASTERPLAN_CONSOLE_REQ-001-003.md` §F8 (prompt esecutore)
- Sintesi: navigazione a tab via switch di stato in `AppShell`; nuovo `UserList` con join PostgREST `admin_users(organizations(...))`, ricerca email lato client, gestione caso RLS-non-attiva con citazione PLAN-DB-005, azioni di riga placeholder disabilitate (Apri scheda/Modifica/Elimina).
- File toccati: `console/src/components/AppShell.tsx` (mod), `console/src/components/UserList.tsx` (nuovo)
- Decisioni autonome: DEC-045 (navigazione = switch di stato, non react-router)
- Scritture DB: nessuna (sola lettura)
- Plan per Matteo generati: PLAN-DB-005 era già generato dall'Orchestrator (non duplicato)

**Revisore (controverifica)** (general-purpose, Sonnet — attore distinto)
- Done-criteria verificati: navigazione ✓ · lista admin_users con tutti i campi + ricerca ✓ · caso RLS-non-attiva con messaggio PLAN-DB-005 senza aggirare RLS ✓ · azioni placeholder disabilitate ✓ · responsive/overflow-x + no import da ../src ✓ · DEC-045 motivata ✓
- Regole d'oro rispettate: ✓ (RULE-4 `src/`/`supabase/` intatti, no service role nel browser; RULE-3 PLAN-DB-005 non eseguito)
- Test/lint/typecheck: 🟢 build (92 moduli), lint (0 warning), typecheck puliti — eseguiti dal revisore
- Regressioni: `RestaurantList` non toccato, monta correttamente; logout/header invariati
- **Verdetto:** 🟢 VERDE (round 1)
- Ri-lavorazioni: nessuna

**Nota Orchestrator:** l'esecutore aveva incidentalmente modificato il `package-lock.json` di **root** (fuori da `console/`): ripristinato a HEAD prima del commit (RULE-4 — non si tocca la pipeline di Matteo).

**Chiusura fase**
- **Commit:** _(vedi git log — feat(console): vista "Tutti gli utenti" + navigazione (F8, DEC-045, REQ-001))_
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: nessuno nuovo (REQ-001 resta IN-SVILUPPO: manca la parte scrittura F11)

---

### Fase F9 — Scheda azienda, tappa 1 (REQ-002)
- **Obiettivo / effetto:** vista focus su un singolo tenant che raccoglie i pannelli esistenti + mappa di copertura intervista.
- **Modalità:** deep
- **Dipendenze:** F8 (navigazione + vista Utenti da cui aprire la scheda)

**Esecutore** (general-purpose, Sonnet)
- Prompt usato: `MASTERPLAN_CONSOLE_REQ-001-003.md` §F9 (prompt esecutore)
- Sintesi: nuovo `TenantDetail` (stato drill-down sovrapposto in `AppShell`, DEC-046) apribile da Utenti e Ristoranti, con "← Torna"; riusa EditionSelector/FeatureFlagsPanel/RestaurantSettingsPanel per il tenant + campi base `organizations` in lettura; mappa di copertura delle 9 sezioni intervista (Sez.0/2/4 ✅, le altre 🔒 con nota FU-CONSOLE-9); nota UI sul gate sandbox ancora attivo.
- File toccati: `console/src/components/TenantDetail.tsx` (nuovo); `AppShell.tsx`, `RestaurantList.tsx`, `UserList.tsx` (mod)
- Decisioni autonome: DEC-046 (drill-down sovrapposto)
- Scritture DB: nessuna (solo SELECT `organizations`)
- Plan per Matteo generati: nessuno

**Revisore (controverifica)** (general-purpose, Sonnet — attore distinto)
- Done-criteria verificati: scheda apribile da Utenti+Ristoranti con back ✓ · riuso 3 pannelli + campi base ✓ · mappa 9 sezioni con stati e FU ✓ · gate isSandboxTenant non toccato + nota UI ✓ · responsive/no import ../src/no modifiche root ✓
- Test/lint/typecheck: 🟢 build (93 moduli), lint 0 warning, typecheck pulito
- **Verdetto round 1:** 🔴 ROSSO — (1, obbligatorio) DEC-046 citata nel codice ma non in DECISION_LOG (RULE-5); (2, advisory) `useEffect` in TenantDetail dipendeva solo da `[refetchCounter]` con `eslint-disable`; (3, advisory) blocco PHASE_AUDIT F9 mancante.
- **Ri-lavorazione (Orchestrator, audit):** (1) DEC-046 registrata; (2) `useEffect` corretto → deps `[fetchOrg, refetchCounter]`, rimosso `eslint-disable`; (3) questo blocco. Build/lint/typecheck ri-verificati 🟢.
- **Verdetto finale:** 🟢 VERDE
- Nota: stati ✅ di Sez.2/Sez.4 hardcoded (semplificazione tappa 1) → tracciato in FU-CONSOLE-9 (renderli dinamici).

**Chiusura fase**
- **Commit:** _(vedi git log — feat(console): scheda azienda drill-down (F9, DEC-046, REQ-002))_
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: FU-CONSOLE-9 ampliato (editor sezioni intervista 1/3/5/6/7/8 + stati copertura dinamici)

---

### Fase F10 — Estensione Edge `console-admin` (fondamenta write-block, REQ-001/003)
- **Obiettivo / effetto:** dare all'Edge le azioni potenti su utenti/aziende e sostituire il guard sandbox con la rete di sicurezza DEC-037 (allowlist + conferme forti rivalidate). Nessuna UI.
- **Modalità:** deep (sicurezza, service role, Auth admin)
- **Dipendenze:** F9; deploy + eventuale PLAN-DB-006 a carico di Matteo

**Esecutore** (general-purpose, Sonnet)
- Prompt usato: `MASTERPLAN_CONSOLE_REQ-001-003.md` §F10
- Sintesi: 5 nuove azioni (`create/update/delete_admin_user`, `create/delete_tenant`) con utenti via `auth.admin.*`, conferme distruttive `confirm_email`/`confirm_name` rivalidate server-side, rollback su create; rimosso il guard `SANDBOX_TENANT_IDS` (resta come costante informativa) mantenendo JWT+allowlist; tipi specchio aggiornati in `consoleAdminClient.ts`. Generato PLAN-DB-006 (CASCADE) + aggiornato PLAN-DB-003.
- File toccati: `console/supabase/functions/console-admin/index.ts`, `console/src/lib/consoleAdminClient.ts`, `plan-per-matteo/PLAN-DB-003` (mod), `plan-per-matteo/PLAN-DB-006` (nuovo)
- Decisioni autonome: DEC-047 (strategia cascata)
- Scritture DB: nessuna (get_project_url=docnnernvp confermato; nessun dato scritto)

**Revisore (controverifica)** (general-purpose, Sonnet — attore distinto, focus sicurezza)
- Done-criteria: 5 azioni + 3 esistenti intatte ✓ · JWT+allowlist prima del dispatch, service role solo lato Edge ✓ · conferme distruttive rivalidate server-side ✓ · create con rollback ✓ · cascata+PLAN-DB-006 non eseguito ✓ · RULE-4 (Edge in console/supabase) ✓
- Test/lint/typecheck: 🟢 build (93 moduli), lint 0 warning, typecheck pulito
- **Verdetto round 1:** 🔴 ROSSO — obbligatori: (1) DEC-047 mancante in DECISION_LOG; (2) blocco PHASE_AUDIT F10 mancante; (3) PLAN-DB-003 §5d test obsoleto (descriveva il 403 del guard rimosso); (4) bug `update_admin_user`: email aggiornata su admin_users ma non su Auth → stato incoerente. Advisory: silent failure delete su tenant_features/restaurant_settings; `listUsers()` non paginato; `confirm_name` case-sensitive vs `confirm_email` case-insensitive.
- **Ri-lavorazione (Orchestrator, audit — round 2):** (1) DEC-047 registrata; (2) questo blocco; (3) PLAN-DB-003 §5d riscritto (guard rimosso → test su conferma errata 409); (4) `update_admin_user` corretto: email propagata su Auth PRIMA di admin_users, con rollback Auth se admin_users fallisce; inoltre fix advisory silent-failure (errori espliciti su delete tenant_features/restaurant_settings). `listUsers` paginazione → FU-CONSOLE-11. `confirm_name` case-sensitive lasciato di proposito (DEC-038 "nome esatto"; l'email è per natura case-insensitive). Build/lint/typecheck ri-verificati 🟢.
- **Verdetto finale:** 🟢 VERDE

**Chiusura fase**
- **Commit:** _(vedi git log — feat(console): estensione Edge console-admin utenti/aziende (F10, DEC-047, REQ-001/003))_
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: FU-CONSOLE-11 (paginazione listUsers); azioni Matteo = re-deploy Edge (PLAN-DB-003) + PLAN-DB-006 opzionale (CASCADE)

---

### Fase F11 — CRUD utente dalla UI (REQ-001 scrittura)
- **Obiettivo / effetto:** collegare la vista Utenti (F8) alle azioni Edge (F10): crea/modifica/elimina admin.
- **Modalità:** deep · **Dipendenze:** F10 (azioni Edge) + F8 (vista). E2E dopo re-deploy Edge (Matteo).

**Esecutore** (general-purpose, Sonnet)
- Prompt usato: `MASTERPLAN_CONSOLE_REQ-001-003.md` §F11
- Sintesi: hook `useAdminUserMutations` (stati separati) + 3 modali (Create/Edit/Delete); UserList con "+ Nuovo utente" e azioni di riga reali al posto dei placeholder; dropdown aziende on-demand; eliminazione con riscrittura email esatta + avviso irreversibilità (DEC-038); degrado con messaggio se l'Edge non è raggiungibile.
- File toccati: `console/src/hooks/useAdminUserMutations.ts` (nuovo), `console/src/components/{CreateUserModal,EditUserModal,DeleteUserModal}.tsx` (nuovi), `UserList.tsx` (mod)
- Decisioni autonome: DEC-048 (modali), DEC-049 (dropdown on-demand), DEC-050 (hook stati separati)
- Scritture DB: nessuna (l'app scrive via Edge a runtime)

**Revisore (controverifica)** (general-purpose, Sonnet — distinto)
- Done-criteria: crea (payload allineato, refetch, email-duplicata) ✓ · modifica (solo campi cambiati) ✓ · elimina con conferma email + irreversibilità + confirm_email ✓ · placeholder sostituiti, azioni su tutte le aziende ✓ · degrado senza crash ✓ · RULE-4 ✓
- Test/lint/typecheck: 🟢 build (97 moduli), lint 0 warning, typecheck pulito
- **Verdetto round 1:** 🔴 ROSSO — (1, alta) validazione password client≥8 vs server≥6; (2, media) confronto email eliminazione case-sensitive client vs case-insensitive server + commento errato; (3, bassa) DEC-048/049/050 non registrate.
- **Ri-lavorazione (Orchestrator, audit):** (1) server allineato a min 8 (entrambi i path create); (2) confronto modale reso case-insensitive + commento corretto; (3) DEC-048/049/050 registrate. Build/lint/typecheck ri-verificati 🟢.
- **Verdetto finale:** 🟢 VERDE

**Chiusura fase**
- **Commit:** _(vedi git log — feat(console): CRUD utente dalla UI (F11, DEC-048..050, REQ-001))_
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: nessuno nuovo (E2E lato Matteo dopo re-deploy Edge F10)

---

## Template blocco di fase (copia per ogni Fi)

```markdown
### Fase F<i> — <titolo>
- **Obiettivo / effetto:** <1–2 righe>
- **Modalità:** light / standard / deep
- **Dipendenze:** <fase precedente / risposta Matteo / DEC-NNN>

**Esecutore**
- Prompt usato: <link al MASTERPLAN_CONSOLE.md §F<i> o estratto>
- Sintesi di cosa ha fatto: <…>
- File toccati: <path…>
- Decisioni autonome prese: <DEC-NNN, DEC-MMM …> (registrate nel DECISION_LOG)
- Scritture DB: <nessuna | sandbox console-* via MCP CONSOLE, get_project_url=docnnernvp confermato>
- Plan per Matteo generati: <PLAN-DB-NNN | nessuno>

**Revisore (controverifica)**
- Done-criteria verificati: <elenco ✓/✗>
- Regole d'oro rispettate: <✓/✗ con note>
- Test/lint/typecheck: <esito>
- Regressioni controllate: <aree>
- **Verdetto:** 🟢 VERDE / 🔴 ROSSO → <findings se rosso>
- Ri-lavorazioni: <round 2…, se servono>

**Chiusura fase**
- **Commit:** <hash> — <messaggio>
- Riga aggiunta a SESSION_LOG.md: <sì>
- Follow-up aperti: <FU-CONSOLE-NNN | nessuno>
```
