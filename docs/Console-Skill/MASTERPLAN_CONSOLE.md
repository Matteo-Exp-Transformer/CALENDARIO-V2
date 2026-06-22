# MASTERPLAN_CONSOLE — primo piano di costruzione della Console super-admin

> **Branch:** `feature/console-super-admin` · **Autore:** Orchestrator (2026-06-22) · **Master:** `.claude/CLAUDE.md`
> **Origine:** `sessioni/HANDOFF-orchestrator-masterplan.md` §4 (scope suggerito, qui affinato).
>
> Questo file è la **mappa eseguibile** della Console. Ogni fase `F_i` è piccola e chiudibile, con
> prompt **autosufficienti** (cold start) per ESECUTORE e REVISORE, done-criteria verificabili e
> dipendenze. Il ciclo è: **esecutore → revisore → (audit) → commit**. Tracciabilità = priorità n.1.

---

## 0. Regole che ogni subagent deve rispettare (le 5 regole d'oro)

```
RULE-1  SOLO TEST docnnernvp. Prima di OGNI scrittura DB: get_project_url == docnnernvp. PROD rwuxgvld → STOP.
RULE-2  Scritture DATI solo sui sandbox console-classic / console-pro. Ogni altro tenant = sola lettura.
RULE-3  Schema/DDL/RLS/migrazioni → MAI dall'agente: file in docs/Console-Skill/plan-per-matteo/ → li esegue Matteo.
RULE-4  Codice solo in console/. Non toccare src/ né supabase/. La Console NON importa da ../src. Service role MAI nel browser.
RULE-5  TRACCIABILITÀ: DEC-NNN per ogni decisione, blocco PHASE_AUDIT per ogni fase, commit che citano fase+DEC. Esecutore ≠ Revisore.
```

**Canale write su TEST:** MCP `CONSOLE` (`mcp__claude_ai_CONSOLE__*`). Verifica sempre `get_project_url` prima di scrivere.

**Sandbox scrivibili:**
- `console-classic` → `4c694cb8-66af-478f-afd2-8719f07d64b4` (edition `classic`)
- `console-pro` → `b5436de8-731e-469e-a888-36785823be6b` (edition `pro`)

**Modello dati reale (vince sul testo dei doc):** tenant = `organizations` (NON `tenants`); feature =
`organizations.edition` + override `tenant_features` via `buildFeatures()` (`src/config/features.ts`,
sola lettura come riferimento); impostazioni = `restaurant_settings` (chiavi in
`src/features/booking/lib/restaurantSettingRegistry.ts`); `organizations.qr_menu_enabled` = **legacy**.

---

## 1. Quadro delle fasi

| Fase | Obiettivo | Modalità | Dipende da | Stato |
|------|-----------|----------|-----------|-------|
| **F1** | Scaffolding `console/` isolata (Vite+React+TS+Supabase), esclusa da pipeline root, connessione DB TEST con sola chiave pubblica, placeholder login | deep | — | ⬜ da fare |
| **F2** | Schermata **elenco ristoranti** (`organizations`: name, slug, edition, is_active) — sola lettura | standard | F1 | ⬜ da fare |
| **F3** | **Login reale** Supabase Auth + allowlist email (solo Matteo) — sostituisce il placeholder | deep | F1 | ⬜ da fare |
| **F4** | **Edge Function** dedicata su TEST per scritture privilegiate (service role lato server) | deep | F3 | ⬜ da fare |
| **F5** | **Cambio edition** di un tenant (scrive `organizations.edition` via Edge; solo sandbox) | deep | F4 | ⬜ da fare |
| **F6** | **Feature flag** per tenant via `tenant_features` (accendi/spegni add-on; `+QR`=classic+`qrMenu`) | deep | F5 | ⬜ da fare |
| **F7** | **Impostazioni ristorante** (numeri tecnici dal `restaurantSettingRegistry`) su sandbox | deep | F6 | ⬜ da fare |

> **Effetto per Cristiano (mappa a colpo d'occhio):** prima si tira su l'app vuota e sicura (F1), poi
> la si fa *leggere* il DB (F2), poi le si mette una *porta con la chiave giusta* (F3) e un *braccio
> robotico lato server* per scrivere senza rischi (F4); da lì in poi sono i tre lavori veri sulla
> configurazione di un ristorante: versione venduta (F5), add-on (F6), numeri tecnici (F7).

> Le DEC rilevanti già prese: DEC-001 (codice in `console/`), DEC-007 (sandbox), DEC-008/009
> (`tenant_features`/`+QR`), DEC-010 (Edge), DEC-011 (login Supabase Auth allowlist), DEC-012
> (deploy Vercel), DEC-013 (consenso pieno + tracciabilità). Vedi `sessioni/DECISION_LOG.md`.

---

## 2. Fasi in dettaglio

### F1 — Scaffolding `console/` isolata

- **Obiettivo / effetto:** creare l'app Console vuota ma funzionante e **isolata** dalla pipeline di
  Matteo, collegata al DB TEST con la **sola chiave pubblica**. *Cosa cambia per te:* da qui in poi
  hai un cantiere separato che non può rompere l'app di Matteo.
- **Modalità:** deep (nuovo sotto-progetto, sicurezza, connessione DB).
- **Dipendenze:** nessuna.
- **Done-criteria:**
  1. Esiste `console/` con `package.json`, `vite.config.ts`, `tsconfig.json`, ESLint, `src/` propri.
  2. `console/` è **esclusa** dalla pipeline root: `tsconfig.json` root (`exclude`), ESLint root
     (`ignorePatterns`), Vitest root. `npm run validate` di Matteo (root) **non** vede `console/`.
  3. La Console **non** importa da `../src` e **non** contiene chiavi service role nel codice browser.
  4. Connessione Supabase TEST via **sola chiave pubblica** (publishable/anon), letta da env
     (`console/.env.local` o `import.meta.env`), **mai** hardcodata; `.env*` in `.gitignore`.
  5. C'è un **placeholder login** (schermata che dichiara "login reale in F3", nessuna auth vera).
  6. `cd console && npm install && npm run build` (o `npm run dev`) parte senza errori.
- **Note tecniche:** stack Vite + React + TS + `@supabase/supabase-js`. Niente import da `../src`:
  i concetti (es. client Supabase) si **ricreano**. Service role assente dal browser (verrà usata
  solo lato Edge in F4).

**Prompt ESECUTORE (F1):**
```
Lavori sul branch feature/console-super-admin (Console super-admin di Matteo). Sei un ESECUTORE cold-start.
PRIMA: leggi docs/Console-Skill/00_BUSSOLA_CONSOLE.md e docs/Console-Skill/context/CONSOLE_APP_CONTEXT.md.
APPLICA le 5 REGOLE D'ORO:
1) solo TEST docnnernvp (get_project_url prima di scrivere il DB; PROD rwuxgvld=STOP) — in questa fase NON scrivi il DB;
2) scritture dati solo sui sandbox console-classic/console-pro (qui nessuna scrittura DB);
3) schema → file in docs/Console-Skill/plan-per-matteo/ (NON eseguire DDL);
4) codice SOLO in console/; NON toccare src/ o supabase/; NON importare da ../src; service role MAI nel browser;
5) tracciabilità: a fine lavoro elenca decisioni non banali come candidate DEC.

TASK (fase F1 del MASTERPLAN_CONSOLE.md): crea lo scaffolding dell'app Console nella sottocartella isolata console/.
- Sotto-progetto a sé: console/package.json, console/vite.config.ts, console/tsconfig.json, ESLint proprio, console/src/.
- Stack: Vite + React + TypeScript + @supabase/supabase-js. Mobile-first/responsive (Matteo la apre dal telefono).
- Client Supabase Console che usa SOLO la chiave pubblica (publishable/anon) letta da import.meta.env (es. VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Niente chiavi hardcodate. Crea console/.env.example (placeholder) e assicurati che console/.env.local sia gitignored.
- Placeholder login: una schermata che dice "Login reale in F3" e poi mostra un layout vuoto/app shell. Nessuna auth vera ora.
- ISOLAMENTO dalla pipeline root (una tantum): aggiungi console/ a exclude del tsconfig.json root, a ignorePatterns di ESLint root, ed escludila da Vitest root. Verifica che la modifica ai file root sia MINIMA e solo di esclusione (queste sono le UNICHE modifiche permesse fuori da console/, perché servono a proteggere la pipeline di Matteo: spiegale nel riepilogo).
File coinvolti: tutto sotto console/ (nuovo) + esclusioni minime in tsconfig.json / config ESLint / config Vitest root.
Vincoli: NON importare da ../src; NON modificare src/ né supabase/; service role assente dal browser.
DONE quando: console/ esiste e builda (cd console && npm install && npm run build OR npm run dev parte senza errori); la pipeline root di Matteo NON vede console/; nessuna chiave segreta nel codice o nei file tracciati.
Alla fine: riepiloga cosa hai creato, i comandi per verificarlo, le modifiche ai file root e perché, e cosa resta aperto. NON committare.
```

**Prompt REVISORE (F1):**
```
Sei il REVISORE della fase F1 sul branch feature/console-super-admin. Cold-start.
PRIMA: leggi docs/Console-Skill/00_BUSSOLA_CONSOLE.md (5 regole d'oro) + il diff/lavoro prodotto dall'esecutore (git status, contenuto di console/).
Controverifica i DONE-CRITERIA F1:
- console/ è un sotto-progetto isolato (package.json, vite.config, tsconfig, ESLint, src/ propri)?
- console/ è esclusa dalla pipeline root (tsconfig exclude, ESLint ignorePatterns, Vitest)? npm run validate root NON deve vedere console/.
- Nessun import da ../src? Nessuna service role key nel codice browser? Chiavi Supabase solo pubbliche e da env, non hardcodate? .env* gitignored, console/.env.example presente?
- Placeholder login presente (nessuna auth vera)?
- L'app builda? Prova: cd console && npm install && npm run build (o npm run dev). Riporta l'esito reale.
- Regole d'oro: nessuna modifica a src/ o supabase/ oltre alle esclusioni minime di pipeline; nessuna scrittura DB.
Esito: VERDE (pronto al commit) oppure ROSSO con lista PUNTUALE di correzioni per l'esecutore.
NON modificare il codice tu stesso; NON committare.
```

---

### F2 — Elenco ristoranti (sola lettura)

- **Obiettivo / effetto:** prima schermata reale: la Console legge `organizations` e mostra
  l'elenco dei ristoranti. *Cosa cambia per te:* vedi i tenant veri dal browser, in sola lettura.
- **Modalità:** standard.
- **Dipendenze:** F1.
- **Done-criteria:**
  1. Una vista elenco mostra, per ogni `organizations`: `name`, `slug`, `edition`, `is_active`.
  2. Dati letti via client pubblico Supabase (RLS permettendo); nessuna scrittura.
  3. Responsive (leggibile a ~375px e desktop). Stato di loading/errore gestiti.
  4. Niente import da `../src`; la logica edition (etichette classic/pro/enterprise) ricreata in `console/`.
- **Note:** se RLS impedisce la lettura anonima di `organizations`, l'esecutore **non forza**: lo
  segnala come blocco e propone un `plan-per-matteo` (RULE-3) o l'uso dell'Edge (F4). Non aggira la RLS.

**Prompt ESECUTORE (F2):**
```
Lavori sul branch feature/console-super-admin (Console super-admin di Matteo). Sei un ESECUTORE cold-start.
PRIMA: leggi docs/Console-Skill/00_BUSSOLA_CONSOLE.md + docs/Console-Skill/context/CONSOLE_DATA_MODEL_CONTEXT.md.
APPLICA le 5 regole d'oro (solo TEST docnnernvp; scritture solo sandbox; schema→plan-per-matteo; codice solo in console/, no import da ../src, no service role nel browser; traccia le decisioni).
Contesto: lo scaffolding console/ esiste già (F1).

TASK (fase F2): crea la schermata ELENCO RISTORANTI nella Console.
- Legge la tabella organizations dal DB TEST via client pubblico Supabase già configurato in console/.
- Mostra per ogni riga: name, slug, edition (classic/pro/enterprise), is_active.
- Sola lettura: nessuna scrittura DB.
- Responsive (leggibile ~375px e desktop), con stato loading ed errore.
- Le etichette/logica edition NON si importano da ../src: ricreale in console/ (un piccolo helper locale).
Se la RLS blocca la lettura anonima di organizations: NON aggirarla. Fermati, segnalalo e proponi (a) un plan-per-matteo per una policy di lettura, oppure (b) di passare la lettura via Edge (fase F4). Documentalo nel riepilogo.
DONE quando: avviando la Console (cd console && npm run dev) si vede l'elenco dei ristoranti reali del DB TEST, oppure è documentato con prova il blocco RLS e la proposta.
Alla fine: riepiloga file toccati, come verificare, e cosa resta aperto. NON committare.
```

**Prompt REVISORE (F2):**
```
Sei il REVISORE della fase F2 sul branch feature/console-super-admin. Cold-start.
PRIMA: leggi docs/Console-Skill/00_BUSSOLA_CONSOLE.md (5 regole d'oro) + il lavoro dell'esecutore.
Controverifica DONE-CRITERIA F2:
- L'elenco mostra name/slug/edition/is_active da organizations? Sola lettura (zero scritture DB)?
- Responsive e stati loading/errore presenti?
- Nessun import da ../src? Helper edition ricreato in console/?
- Se c'è un blocco RLS: è documentato con prova e proposta (plan-per-matteo o Edge), non aggirato?
- Test/lint/typecheck di console/ (gira ciò che esiste). Regressioni nelle aree toccate.
Esito: VERDE o ROSSO con correzioni puntuali. NON modificare il codice; NON committare.
```

---

### F3 — Login reale (Supabase Auth + allowlist email)

- **Obiettivo / effetto:** sostituire il placeholder con un login vero che fa entrare **solo Matteo**
  (allowlist email, DEC-011). *Cosa cambia per te:* la Console diventa privata davvero.
- **Modalità:** deep (auth/identità).
- **Dipendenze:** F1.
- **Done-criteria:**
  1. Login via Supabase Auth (email). Solo email in allowlist accedono; le altre sono rifiutate.
  2. L'allowlist è configurabile (env o costante chiara) e contiene solo l'email di Matteo (placeholder se non nota).
  3. Le viste della Console sono dietro il login (un utente non autenticato non vede l'elenco).
  4. Nessuna chiave service role nel browser. Sessione gestita dal client Supabase pubblico.
- **Note:** se l'allowlist va imposta lato DB/RLS (più robusta), generare un `plan-per-matteo` invece
  di un controllo solo client; documentare il trade-off come DEC.

**Prompt ESECUTORE (F3):**
```
Lavori sul branch feature/console-super-admin. ESECUTORE cold-start.
PRIMA: leggi docs/Console-Skill/00_BUSSOLA_CONSOLE.md + context/CONSOLE_APP_CONTEXT.md. Applica le 5 regole d'oro.
Decisione di prodotto già presa (DEC-011): login = Supabase Auth con allowlist email (solo Matteo).

TASK (fase F3): implementa il login reale nella Console, sostituendo il placeholder di F1.
- Supabase Auth (email) col client pubblico. Solo le email in allowlist accedono; le altre vengono rifiutate con messaggio chiaro.
- Allowlist configurabile via env o costante ben visibile; metti l'email di Matteo se nota, altrimenti un placeholder documentato.
- Proteggi le viste: un utente non autenticato NON vede l'elenco ristoranti (redirect a login).
- Nessuna service role nel browser; sessione gestita dal client pubblico.
Se per sicurezza l'allowlist dovrebbe vivere lato DB/RLS (non solo client): NON eseguire DDL. Genera un plan-per-matteo (PLAN-DB-NNN) e implementa per ora il gate client, documentando il limite.
DONE quando: con un'email fuori allowlist non si entra; con l'email allowlist si entra e si vede l'app; le viste sono protette.
Alla fine: riepiloga, indica come testare il login, e cosa resta aperto. NON committare.
```

**Prompt REVISORE (F3):**
```
Sei il REVISORE della fase F3. Cold-start. Leggi 00_BUSSOLA_CONSOLE.md + il lavoro dell'esecutore.
Controverifica DONE-CRITERIA F3:
- Login Supabase Auth funzionante; allowlist applicata (email fuori lista = rifiutata)?
- Viste protette dietro auth (non autenticato non vede l'elenco)?
- Allowlist configurabile e con la sola email di Matteo/placeholder documentato?
- Nessuna service role nel browser? Solo client pubblico?
- Se l'allowlist è solo client: c'è un plan-per-matteo per la versione DB/RLS e il limite è documentato?
- Test/lint/typecheck console/. Sicurezza: nessuna chiave segreta esposta.
Esito: VERDE o ROSSO con correzioni puntuali. NON toccare il codice; NON committare.
```

---

### F4 — Edge Function per scritture privilegiate (TEST)

- **Obiettivo / effetto:** creare il "braccio robotico" lato server che esegue le scritture potenti
  con la service role **fuori dal browser** (DEC-010). *Cosa cambia per te:* la Console potrà
  modificare i dati in modo sicuro, senza mai esporre la chiave admin.
- **Modalità:** deep (sicurezza, service role, serverless).
- **Dipendenze:** F3.
- **Done-criteria:**
  1. Esiste una Edge Function (TEST `docnnernvp`) che riceve richieste autenticate dalla Console e
     scrive **solo** sui tenant sandbox `console-classic`/`console-pro`; rifiuta altri `tenant_id`.
  2. La function verifica l'autenticazione (utente in allowlist) prima di scrivere.
  3. La service role key vive **solo** nelle env della function, mai nel client.
  4. La Console chiama la function (un client helper) per le operazioni di scrittura; lettura resta col client pubblico.
  5. Operazione minima dimostrabile end-to-end (es. un no-op/echo o un update sandbox controllato), tracciata con `get_project_url`=docnnernvp.
- **⚠️ Confine:** il **deploy** della Edge Function e il setup delle sue env (service role) potrebbero
  richiedere un'azione di Matteo o un `plan-per-matteo`. Se il deploy non è eseguibile in sicurezza
  dall'agente, l'esecutore prepara il codice della function + le istruzioni e **lascia il deploy a
  Matteo** (documentare come DEC + eventuale PLAN). Niente DDL silenzioso.

**Prompt ESECUTORE (F4):**
```
Lavori sul branch feature/console-super-admin. ESECUTORE cold-start.
PRIMA: leggi docs/Console-Skill/00_BUSSOLA_CONSOLE.md + context/CONSOLE_APP_CONTEXT.md §3 (sicurezza). Applica le 5 regole d'oro.
Decisione presa (DEC-010): le scritture privilegiate passano da una Edge Function dedicata su TEST, con service role FUORI dal browser.

TASK (fase F4): crea una Edge Function per le scritture privilegiate della Console su TEST.
- La function riceve richieste autenticate dalla Console e scrive sul DB. DEVE accettare SOLO i tenant sandbox console-classic (4c694cb8-66af-478f-afd2-8719f07d64b4) e console-pro (b5436de8-731e-469e-a888-36785823be6b); qualsiasi altro tenant_id → rifiuto.
- Verifica l'autenticazione (utente in allowlist, coerente con F3) prima di qualsiasi scrittura.
- La service role key vive SOLO nelle env della function (mai nel client browser).
- Aggiungi nella Console un helper client che chiama la function per le scritture; le letture restano col client pubblico.
- Il codice della function va in console/ (es. console/supabase/functions/... o cartella dedicata della Console): NON toccare la cartella supabase/ di Matteo alla root.
ATTENZIONE DEPLOY: prima di QUALSIASI scrittura DB verifica get_project_url == docnnernvp. Se il deploy della function o il setup della service role NON è eseguibile in sicurezza dall'agente, prepara il codice + le istruzioni e LASCIA il deploy a Matteo (genera un plan-per-matteo se serve un'azione manuale o un segreto). Non esporre mai la service role.
DONE quando: la function esiste e (se deployabile in sicurezza) esegue un'operazione minima end-to-end su un sandbox con get_project_url verificato; altrimenti il codice è pronto e il deploy è documentato come passo per Matteo.
Alla fine: riepiloga, come testare, e cosa resta a Matteo. NON committare.
```

**Prompt REVISORE (F4):**
```
Sei il REVISORE della fase F4. Cold-start. Leggi 00_BUSSOLA_CONSOLE.md + context/CONSOLE_APP_CONTEXT.md §3 + il lavoro dell'esecutore.
Controverifica DONE-CRITERIA F4:
- La function accetta SOLO i due tenant sandbox e rifiuta gli altri tenant_id?
- Verifica l'autenticazione (allowlist) prima di scrivere?
- Service role SOLO nelle env della function, mai nel client browser? Cerca esplicitamente chiavi segrete nel codice client.
- La Console chiama la function per le scritture; letture col client pubblico?
- Eventuali scritture DB di prova: get_project_url == docnnernvp confermato e solo sandbox?
- Il codice function NON è nella cartella supabase/ di Matteo? Deploy non sicuro = lasciato a Matteo con plan/DEC?
- Test/lint/typecheck console/.
Esito: VERDE o ROSSO con correzioni puntuali. NON toccare il codice; NON committare.
```

---

### F5 — Cambio edition di un tenant (sandbox, via Edge)

- **Obiettivo / effetto:** dalla Console si cambia la **versione venduta** (`organizations.edition`)
  di un tenant sandbox, passando dall'Edge. *Cosa cambia per te:* il primo vero comando di
  configurazione (classic ↔ pro ↔ enterprise) sui banchi di prova.
- **Modalità:** deep (scrittura DB via Edge).
- **Dipendenze:** F4.
- **Done-criteria:**
  1. UI per selezionare un tenant **sandbox** e cambiarne `edition` ∈ {classic, pro, enterprise}.
  2. La scrittura passa dall'Edge (F4); i tenant non-sandbox sono **non selezionabili** o rifiutati.
  3. `get_project_url`=docnnernvp verificato; cambio riflesso ri-leggendo `organizations`.
  4. Feedback chiaro all'utente (successo/errore). Nessuna scrittura su tenant reali.
- **Note:** l'effetto edition→feature è derivato (`buildFeatures`), non si scrive `tenant_features` qui (è F6).

**Prompt ESECUTORE (F5):**
```
Lavori sul branch feature/console-super-admin. ESECUTORE cold-start.
PRIMA: leggi 00_BUSSOLA_CONSOLE.md + context/CONSOLE_DATA_MODEL_CONTEXT.md (§1-2) + context/CONSOLE_APP_CONTEXT.md. Applica le 5 regole d'oro.
Contesto: scaffolding (F1), elenco (F2), login (F3) ed Edge per scritture (F4) esistono.

TASK (fase F5): schermata CAMBIO EDITION di un tenant.
- L'utente sceglie un tenant SANDBOX (console-classic 4c694cb8-66af-478f-afd2-8719f07d64b4 / console-pro b5436de8-731e-469e-a888-36785823be6b) e ne cambia edition (classic | pro | enterprise).
- La scrittura passa dalla Edge Function di F4. PRIMA di scrivere: get_project_url == docnnernvp (PROD=STOP).
- I tenant NON sandbox non devono essere modificabili: rendili non selezionabili o fai rifiutare la scrittura dall'Edge.
- Mostra feedback (successo/errore) e rifletti il nuovo edition rileggendo organizations.
- NON scrivere tenant_features qui (è F6). edition→feature è derivato da buildFeatures (riferimento src/config/features.ts, sola lettura).
DONE quando: cambiando edition di un sandbox dalla Console il valore in organizations cambia (verificabile rileggendo), e un tenant reale NON è modificabile. Tutte le scritture su docnnernvp e solo sandbox.
Alla fine: riepiloga, come testare, cosa resta aperto. NON committare.
```

**Prompt REVISORE (F5):**
```
Sei il REVISORE della fase F5. Cold-start. Leggi 00_BUSSOLA_CONSOLE.md + context/CONSOLE_DATA_MODEL_CONTEXT.md + il lavoro dell'esecutore.
Controverifica DONE-CRITERIA F5:
- Si cambia edition (classic/pro/enterprise) di un tenant SANDBOX, scrittura via Edge?
- I tenant non-sandbox sono non modificabili (UI e/o rifiuto Edge)?
- get_project_url == docnnernvp per ogni scrittura? Nessuna scrittura fuori dai due sandbox?
- Il nuovo edition è riflesso rileggendo organizations? Feedback utente presente?
- Nessun tenant_features scritto qui? Nessun import da ../src?
- Test/lint/typecheck console/.
Esito: VERDE o ROSSO con correzioni puntuali. NON toccare il codice; NON committare.
```

---

### F6 — Feature flag per tenant (`tenant_features`)

- **Obiettivo / effetto:** accendere/spegnere singoli add-on di un tenant sandbox via
  `tenant_features` (fonte di verità, DEC-008); «+QR» = edition classic + riga `qrMenu` (DEC-009).
  *Cosa cambia per te:* gestisci gli add-on oltre il bundle dell'edition, ignorando il flag legacy.
- **Modalità:** deep.
- **Dipendenze:** F5.
- **Done-criteria:**
  1. UI per vedere/cambiare gli override `tenant_features` di un tenant **sandbox** (es. `qrMenu`, `analytics`).
  2. Scrittura via Edge (F4): inserisce/aggiorna riga `tenant_features` (`tenant_id`, `feature_key`, `enabled`, e campi di tracciamento sensati).
  3. `organizations.qr_menu_enabled` **ignorata** (legacy). Il risultato effettivo combina edition + override come fa `buildFeatures` (mostrato in UF, lettura).
  4. Scritture solo su sandbox, `get_project_url`=docnnernvp.
- **Note:** se servono colonne/feature_key non previste dallo schema o dal set di `FeatureFlags`,
  niente DDL: `plan-per-matteo`.

**Prompt ESECUTORE (F6):**
```
Lavori sul branch feature/console-super-admin. ESECUTORE cold-start.
PRIMA: leggi 00_BUSSOLA_CONSOLE.md + context/CONSOLE_DATA_MODEL_CONTEXT.md (§2-3, tenant_features) + riferimento src/config/features.ts (buildFeatures, SOLA LETTURA). Applica le 5 regole d'oro.
Decisioni: add-on = fonte di verità tenant_features (DEC-008); qr_menu_enabled è legacy da ignorare; «+QR» = edition classic + riga tenant_features qrMenu (DEC-009).

TASK (fase F6): schermata FEATURE FLAG per tenant.
- Per un tenant SANDBOX, mostra e permetti di accendere/spegnere singoli add-on (feature_key di FeatureFlags, es. qrMenu, analytics) via tabella tenant_features.
- Scrittura via Edge Function di F4: inserisce/aggiorna riga tenant_features (tenant_id, feature_key, enabled, e i campi di tracciamento ragionevoli come source/notes/activated_at). PRIMA: get_project_url == docnnernvp.
- NON usare organizations.qr_menu_enabled (legacy). Mostra l'effetto risultante combinando edition + override come fa buildFeatures (ricrea la logica in console/, NON importare da ../src).
- Scritture SOLO sui sandbox.
Se servono feature_key o colonne non presenti nello schema/nel set FeatureFlags: NON eseguire DDL, genera un plan-per-matteo.
DONE quando: accendendo/spegnendo un add-on di un sandbox la riga tenant_features cambia (verificabile rileggendo) e l'effetto combinato è mostrato correttamente; nessuna scrittura fuori dai sandbox.
Alla fine: riepiloga, come testare, cosa resta. NON committare.
```

**Prompt REVISORE (F6):**
```
Sei il REVISORE della fase F6. Cold-start. Leggi 00_BUSSOLA_CONSOLE.md + context/CONSOLE_DATA_MODEL_CONTEXT.md + il lavoro dell'esecutore.
Controverifica DONE-CRITERIA F6:
- Si accendono/spengono add-on di un tenant SANDBOX scrivendo tenant_features via Edge?
- qr_menu_enabled NON usata (legacy)? «+QR» mappato come classic + qrMenu?
- Effetto combinato edition+override mostrato coerentemente con buildFeatures (logica ricreata, non importata da ../src)?
- get_project_url == docnnernvp e solo sandbox per ogni scrittura?
- Eventuali esigenze di schema → plan-per-matteo (niente DDL)?
- Test/lint/typecheck console/.
Esito: VERDE o ROSSO con correzioni puntuali. NON toccare il codice; NON committare.
```

---

### F7 — Impostazioni ristorante (`restaurant_settings`)

- **Obiettivo / effetto:** configurare i «numeri tecnici» (durate, intervalli, cut-off, buffer…) di
  un tenant sandbox, usando **solo** le chiavi del registro. *Cosa cambia per te:* la Console copre
  la configurazione fine del ristorante, senza inventare chiavi.
- **Modalità:** deep.
- **Dipendenze:** F6.
- **Done-criteria:**
  1. UI per vedere/modificare le impostazioni di un tenant **sandbox** lette da `restaurant_settings`.
  2. Si usano **solo** le chiavi del registro `restaurantSettingRegistry` (`RESTAURANT_SETTING_KEYS_V1`); nessuna chiave inventata.
  3. Scrittura via Edge (F4), con validazione coerente con il registro; solo sandbox; `get_project_url`=docnnernvp.
  4. Aggiungere una chiave nuova = `plan-per-matteo` (richiede codice app), non scrittura diretta.
- **Note:** il set di chiavi valide è specchio del file `src/.../restaurantSettingRegistry.ts` (sola
  lettura come riferimento); la Console **ricrea** l'elenco/validatori che le servono.

**Prompt ESECUTORE (F7):**
```
Lavori sul branch feature/console-super-admin. ESECUTORE cold-start.
PRIMA: leggi 00_BUSSOLA_CONSOLE.md + context/CONSOLE_DATA_MODEL_CONTEXT.md (§4, restaurant_settings) + riferimento src/features/booking/lib/restaurantSettingRegistry.ts (SOLA LETTURA). Applica le 5 regole d'oro.

TASK (fase F7): schermata IMPOSTAZIONI RISTORANTE.
- Per un tenant SANDBOX, mostra e permetti di modificare le impostazioni lette da restaurant_settings (key-value jsonb).
- Usa SOLO le chiavi del registro RESTAURANT_SETTING_KEYS_V1 (es. booking_window_days, slot_guest_capacities, slot_limit_enabled, business_hours, ecc.): ricrea in console/ l'elenco e i validatori che ti servono, NON importare da ../src.
- Scrittura via Edge Function di F4, con validazione coerente al registro. PRIMA: get_project_url == docnnernvp. Solo sandbox.
- NON inventare chiavi nuove. Se serve una chiave non nel registro → plan-per-matteo (richiede codice nell'app di Matteo), niente scrittura diretta.
DONE quando: modificando un'impostazione di un sandbox la riga restaurant_settings cambia (verificabile rileggendo) e i valori restano nelle chiavi del registro; nessuna scrittura fuori dai sandbox.
Alla fine: riepiloga, come testare, cosa resta. NON committare.
```

**Prompt REVISORE (F7):**
```
Sei il REVISORE della fase F7. Cold-start. Leggi 00_BUSSOLA_CONSOLE.md + context/CONSOLE_DATA_MODEL_CONTEXT.md + il lavoro dell'esecutore.
Controverifica DONE-CRITERIA F7:
- Si modificano impostazioni di un tenant SANDBOX su restaurant_settings via Edge?
- Solo chiavi del registro RESTAURANT_SETTING_KEYS_V1 (nessuna chiave inventata)? Validazione coerente?
- get_project_url == docnnernvp e solo sandbox per ogni scrittura?
- Chiavi nuove → plan-per-matteo (niente scrittura diretta)? Niente import da ../src?
- Test/lint/typecheck console/.
Esito: VERDE o ROSSO con correzioni puntuali. NON toccare il codice; NON committare.
```

---

## 3. Protocollo del ciclo (per ogni F_i)

1. **Esecutore** (Agent `general-purpose`) col prompt esecutore di `F_i`. Modello: Sonnet per le fasi
   con ragionamento/sicurezza; Haiku per sotto-passi meccanici.
2. **Revisore** (Agent `general-purpose`, attore distinto) col prompt revisore di `F_i`.
3. **Se VERDE** → compilo il blocco `F_i` in `sessioni/PHASE_AUDIT.md`, registro le `DEC-NNN` nuove in
   `sessioni/DECISION_LOG.md`, poi **commit** sul branch (Conventional Commits, es.
   `feat(console): elenco ristoranti (F2, DEC-0NN)`). Aggiorno `sessioni/SESSION_LOG.md` (1 riga).
4. **Se ROSSO** → rilancio l'esecutore con le correzioni del revisore; ripeto 2-3 (annoto i round).
5. **Blocco** (manca risposta Matteo / serve schema): genero `plan-per-matteo/PLAN-DB-NNN`, marco la
   parte come bloccata, proseguo con la prossima fase eseguibile o mi fermo e segnalo a Cristiano.

> Una fase **non è chiusa** senza il suo blocco in `PHASE_AUDIT.md` e le `DEC` collegate (RULE-5).

---

## 4. Stato di avanzamento (aggiornato dall'Orchestrator)

| Fase | Esecutore | Revisore | Verdetto | Commit | Note |
|------|-----------|----------|----------|--------|------|
| F1 | ✅ | ✅ | 🟢 VERDE | sì | scaffolding isolato, build verde |
| F2 | ✅ | ✅ | 🟢 VERDE | sì | elenco 7 tenant, sola lettura |
| F3 | ⏳ | — | — | — | in avvio |
| F4 | ⬜ | — | — | — | |
| F5 | ⬜ | — | — | — | |
| F6 | ⬜ | — | — | — | |
| F7 | ⬜ | — | — | — | |
