# Decision Log — branch Console (registro decisioni)

> **Append-only.** Ogni decisione non banale presa da chiunque (Cristiano, Matteo, Orchestrator,
> Esecutore, Revisore) si registra qui, con codice `DEC-NNN`. Non si riscrive la storia: una decisione
> superata si marca `SUPERATA da DEC-MMM`, non si cancella.
>
> **Scopo:** tracciabilità totale — chi ha deciso cosa, perché, con quale effetto, e dove vederne la prova.

## Campi
`ID` · `Data` · `Attore` · `Decisione` · `Motivo` · `Riferimento` (commit/file/plan) · `Stato`.

## Attori
`Cristiano` (sviluppatore) · `Matteo` (proprietario) · `Setup` (sessione 2026-06-22) ·
`Orchestrator` · `Esecutore-Fi` · `Revisore-Fi`.

---

## Registro

| ID | Data | Attore | Decisione | Motivo | Riferimento | Stato |
|----|------|--------|-----------|--------|-------------|-------|
| DEC-001 | 2026-06-22 | Cristiano | Codice Console in sottocartella **isolata `console/`** (no repo separata) | Coerente con "lavoriamo su questo branch", nessuna riconfigurazione dell'app | `CONSOLE_APP_CONTEXT.md` | attiva |
| DEC-002 | 2026-06-22 | Cristiano | Scritture **dati** solo sui tenant sandbox; **schema** sempre via *plan per matteo* | Sicurezza: niente DDL dall'agente, niente dati su tenant reali | `00_BUSSOLA_CONSOLE.md` §1 | attiva |
| DEC-003 | 2026-06-22 | Cristiano | Skill system = **istanza v0 dedicata** `docs/Console-Skill/` + **CLAUDE.md riscritto** | Regole nostre senza toccare le skill di Matteo | commit `a5bae5d` | attiva |
| DEC-004 | 2026-06-22 | Cristiano | Vocabolario: riuso parole di Matteo + **un solo** grilletto nuovo «plan per matteo» | Continuità + copre il flusso DB nuovo | `VOCABOLARIO.md` | attiva |
| DEC-005 | 2026-06-22 | Cristiano | Stile di comunicazione **didattico** (breve + «cosa cambia per te») | Cristiano impara il progetto mentre costruisce | `COMUNICAZIONE_SKILL.md` | attiva |
| DEC-006 | 2026-06-22 | Cristiano | **Commit liberi sul branch**; l'Orchestrator committa dopo ogni fase revisionata. Mai push/merge senza ok | Fluidità con controllo a fine ciclo | `HANDOFF…` §3 | attiva |
| DEC-007 | 2026-06-22 | Setup | Creati tenant sandbox **`console-classic`** / **`console-pro`** su TEST | Banco di prova senza toccare i tenant di Matteo | `PLAN-DB-001` (eseguito) | attiva |
| DEC-008 | 2026-06-22 | Matteo | Add-on (incl. Menu QR) = fonte di verità **`tenant_features`**; `qr_menu_enabled` **legacy** da ignorare | Conferma il modello reale del codice | `CONSOLE_DATA_MODEL_CONTEXT.md` §3 | attiva |
| DEC-009 | 2026-06-22 | Matteo | **«+QR»** = edition `classic` + riga `tenant_features` `qrMenu` | Mappatura versione venduta → DB | come sopra | attiva |
| DEC-010 | 2026-06-22 | Matteo | OK **Edge Function** dedicata su TEST per le scritture privilegiate (service role fuori dal browser) | Sicurezza chiave admin | `CONSOLE_APP_CONTEXT.md` §3 | attiva |
| DEC-011 | 2026-06-22 | Matteo | **Login Console** = Supabase Auth con **allowlist email** (solo Matteo) | MVP accesso, solo proprietario | — | attiva |
| DEC-012 | 2026-06-22 | Matteo | Deploy: OK proposta **Vercel root `console/`**, indirizzo `console.<dominio>`; dominio esatto da definire poi | Sblocca lo scaffolding | — | attiva (dominio TBD) |
| DEC-013 | 2026-06-22 | Cristiano+Matteo | **Standing authorization**: Matteo dà consenso a tutto «per ora». Vincolo: **tracciabilità obbligatoria** di ogni decisione/azione di Orchestrator, Esecutori, Revisori | Velocità senza perdere l'auditabilità | `TRACCIABILITA.md` | attiva |
| DEC-014 | 2026-06-22 | Orchestrator | **Master-plan a 7 fasi** (F1…F7): scomposto lo scope §4 dell'hand-off (5 fasi) separando **login reale** (F3) ed **Edge Function** (F4) in fasi proprie, prima di cambio edition/feature/impostazioni | Login ed Edge sono prerequisiti di sicurezza delle scritture (DEC-010/011): meritano fase e revisione dedicate, non un sotto-passo | `MASTERPLAN_CONSOLE.md` | attiva |
| DEC-015 | 2026-06-22 | Cristiano | **Automode pieno**: dopo la creazione del master-plan, l'Orchestrator procede col ciclo esecutore→revisore→commit senza checkpoint per fase, fermandosi solo su bivi irreversibili/fuori scope o blocchi | Velocità (coerente con DEC-013); la tracciabilità resta il contrappeso | `AskUserQuestion` 2026-06-22 | attiva |
| DEC-016 | 2026-06-22 | Esecutore-F1 | **Convenzioni scaffolding `console/`**: dev server porta **5174** (5173 è di Matteo); alias **`@console/`** (non `@/`); `postcss.config.js` locale vuoto (evita il PostCSS/Tailwind root); `isAuthenticated=false` hardcoded transitorio (auth vera in F3); `<meta robots noindex>` | Coesistenza con l'app di Matteo + sicurezza (no indicizzazione console) | `MASTERPLAN_CONSOLE.md` §F1; `console/` | attiva |
| DEC-017 | 2026-06-22 | Esecutore-F2 | **Scelte F2 elenco ristoranti**: usata **anon key legacy (JWT)** (non publishable `sb_…`, da rivalutare in F3); `isAuthenticated=true` **transitorio** in `App.tsx` per mostrare la shell (sostituisce il gate di DEC-016, sarà risolto da auth reale in F3); griglia responsive `auto-fill minmax(260px,1fr)` senza media query | Far girare e verificare l'elenco prima dell'auth reale | `console/src/components/RestaurantList.tsx`; PHASE_AUDIT F2 | attiva |
| DEC-018 | 2026-06-22 | Esecutore-F3 | **Login = Magic Link** (`signInWithOtp`) con **`shouldCreateUser:false`**: niente creazione automatica account; Matteo deve preesistere in Supabase Auth (o `true` solo al primo setup) | Passwordless adatto a singolo super-admin; evita account spuri | `console/src/components/LoginScreen.tsx` | attiva (sostituisce gate `isAuthenticated` di DEC-016/017) |
| DEC-019 | 2026-06-22 | Esecutore-F3 | **Allowlist** email come `Set` singleton calcolato **a load del modulo** da env `VITE_CONSOLE_ALLOWED_EMAILS` (case-insensitive, fail-safe: vuota=nessuno entra); gate **lato client** = UX, la barriera forte resta la RLS | Semplice e testabile (`isEmailAllowedWith`); cambio env richiede reload (accettabile) | `console/src/lib/authAllowlist.ts`; rinforzo DB = PLAN-DB-002 | attiva |
| DEC-020 | 2026-06-22 | Esecutore-F3 | **`AuthState`** modellato come **union discriminata** (`loading\|unauthenticated\|denied\|authenticated`) invece di booleani | Rende impossibili stati incoerenti; semplifica il rendering | `console/src/hooks/useAuth.ts` | attiva |
| DEC-021 | 2026-06-22 | Cristiano | **F4: deploy della Edge Function a Matteo**, non dall'agente. L'agente prepara codice function + helper client + plan-per-matteo con istruzioni di deploy; il deploy (endpoint privilegiato con service role su TEST) lo esegue Matteo | Cautela su endpoint privilegiato outward; coerente con CONSOLE_APP_CONTEXT §3 | `AskUserQuestion` 2026-06-22; PLAN-DB-003 | attiva |
| DEC-022 | 2026-06-22 | Esecutore-F4 | Edge Function in **`console/supabase/functions/`** (non nella `supabase/` root di Matteo) | Isolamento RULE-4: deploy Console separato dall'app principale | `console/supabase/functions/console-admin/index.ts` | attiva |
| DEC-023 | 2026-06-22 | Esecutore-F4 | Deploy con **`--no-verify-jwt`**: la function gestisce internamente auth+allowlist e risponde con messaggi/audit propri | Controllo fine su 401/403 e logging; trade-off: più responsabilità nel codice | PLAN-DB-003 | attiva |
| DEC-024 | 2026-06-22 | Esecutore-F4 | **Doppio gate allowlist**: `CONSOLE_ALLOWED_EMAILS` (secret server della function) ≠ `VITE_CONSOLE_ALLOWED_EMAILS` (client). Client=UX, server=barriera vera | Difesa a strati; il client non è una barriera di sicurezza | `console/supabase/functions/console-admin/index.ts` | attiva |
| DEC-025 | 2026-06-22 | Esecutore-F4 | Helper client `consoleAdminClient` **non lancia eccezioni**: errori normalizzati in `ConsoleAdminResult {data,error}` | Uso idiomatico in React senza try/catch | `console/src/lib/consoleAdminClient.ts` | attiva |
| DEC-026 | 2026-06-22 | Revisore-F4 | **Nomi colonna allineati allo schema reale** (verificato via MCP): `tenant_features(tenant_id, feature_key, enabled)`, `restaurant_settings(tenant_id, setting_key, setting_value)`; corretti `organization_id/is_enabled/key/value` usati per errore nel round 1 | Le scritture sarebbero fallite a runtime; fonte di verità = DB | PHASE_AUDIT F4 round 2 | attiva |
| DEC-027 | 2026-06-22 | Esecutore-F5 | **Pattern F5**: refetch della lista via **counter** incrementale (no React Query/SWR per non aggiungere dipendenze); stato di `useEditionChange` per-tenant (ogni `EditionSelector` ha la sua istanza) | Semplicità senza store globale; refetch isolato | `console/src/components/RestaurantList.tsx`; `console/src/hooks/useEditionChange.ts` | attiva |
| DEC-028 | 2026-06-22 | Esecutore-F6 | La lettura di **`tenant_features`** col client anon torna **vuota** (policy esistente usa `current_admin_tenant_id()`, il super-admin non è in `admin_users`): il pannello mostra solo il **bundle**, non gli override reali, finché non si esegue **PLAN-DB-004** (policy SELECT per la Console). La logica UI è corretta, manca il dato | Non aggirare la RLS; servirà una policy dedicata | `console/src/hooks/useFeatureFlags.ts`; PLAN-DB-004 | attiva |
| DEC-029 | 2026-06-22 | Esecutore-F6 | Una feature **già nel bundle** dell'edition con override `enabled=true` è mostrata come sorgente **`bundle`** (override ridondante), non `override-on` | L'effetto finale è identico; evita confusione | `console/src/lib/features.ts` | attiva |
| DEC-030 | 2026-06-22 | Esecutore-F7 | **F7 espone un subset di 5 chiavi** "numeri tecnici" (`booking_window_days`, `walk_in_max_guests`, `slot_limit_enabled`, `booking_reject_out_of_slot`, `booking_time_slots_enabled`) con editor semplici; il registro completo (20 chiavi) è ricreato ma le chiavi avanzate (`business_hours`, `slot_guest_capacities`, enum legati a costanti dell'app…) NON sono esposte | Freno scope creep + evitare desync su valori enum dell'app; struttura estendibile (eventuale F8) | `console/src/lib/restaurantSettings.ts` | attiva |
| DEC-031 | 2026-06-22 | Esecutore-F7 | ESLint della Console **ignora `supabase/`** (codice Deno della Edge Function) + rimosso `eslint-disable` ridondante in `FeatureFlagsPanel` | Le regole browser non si applicano al Deno server-side; allineato a `tsconfig` → **chiude FU-CONSOLE-6** | `console/.eslintrc.cjs` | attiva |

---

## Come si aggiunge una riga (per Orchestrator / Esecutori / Revisori)

1. Prendi il prossimo `DEC-NNN`.
2. Una riga = una decisione **non banale** (scelta tecnica con alternative, deviazione dal plan,
   interpretazione di un requisito, rinuncia a qualcosa). Le micro-scelte ovvie non si loggano.
3. **Riferimento** deve puntare a una prova: commit hash, file, `PLAN-DB-NNN`, o riga di `PHASE_AUDIT.md`.
4. Se la decisione cambia una precedente: la nuova entra come attiva, la vecchia → `SUPERATA da DEC-NNN`.
