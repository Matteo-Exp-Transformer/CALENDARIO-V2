# HAND-OFF → Agente Senior Orchestrator (master-plan Console + esecuzione automode)

> **Da:** sessione di setup skill system del branch (2026-06-22).
> **A:** agente **Senior Orchestrator** che creerà il primo master-plan della Console e lo farà
> eseguire da subagent in **automode**.
> **Branch:** `feature/console-super-admin`. **Master del branch:** `.claude/CLAUDE.md`.

---

## 0. Kickoff (blocco da leggere per primo)

Sei il **Senior Orchestrator** del branch Console. Obiettivo: **creare il primo master-plan** della
Console super-admin e **guidarne l'esecuzione** lanciando subagent, in ciclo automatico.

**Prima di tutto, carica (in quest'ordine):**
1. `.claude/CLAUDE.md` (master del branch, già personalizzato per questo lavoro).
2. `docs/Console-Skill/00_BUSSOLA_CONSOLE.md` (Skill 0: profili, routing, **4 regole d'oro**, LOCK).
3. `docs/Console-Skill/context/CONSOLE_DATA_MODEL_CONTEXT.md` e `…/CONSOLE_APP_CONTEXT.md`.
4. `docs/Console-Skill/comunicazione/VOCABOLARIO.md` e `…/COMUNICAZIONE_SKILL.md`.
5. Contesto prodotto: `docs/Servizio-Config/` (BENVENUTO, INVENTARIO, GUIDA, ROADMAP).
6. Formato dei prompt operativi: `docs/PREPARA_PROMPT_SKILL.md` (skill di Matteo, **sola lettura**).

**Non navigare il codice a tappeto:** instradati con la bussola.

---

## 1. Le 4 regole d'oro (vincoli duri — valgono per TE e per OGNI subagent)

```
RULE-1  SOLO TEST docnnernvp. Prima di OGNI scrittura DB: get_project_url == docnnernvp. PROD rwuxgvld → STOP.
RULE-2  Scritture DATI solo sui sandbox: console-classic / console-pro. Ogni altro tenant = sola lettura.
RULE-3  Schema/DDL/RLS/migrazioni → MAI eseguiti dall'agente: file in docs/Console-Skill/plan-per-matteo/ → li esegue Matteo.
RULE-4  Codice solo in console/. Non toccare src/ né supabase/. La Console NON importa da ../src. Service role MAI nel browser.
```

> Il **canale MCP scrivibile su TEST** è **`CONSOLE`** (`mcp__claude_ai_CONSOLE__*`). Verifica sempre
> `get_project_url` prima di scrivere. Gli altri MCP non scrivono il DB di Matteo.

---

## 2. Stato attuale (cosa è già pronto)

- ✅ **Skill system del branch** creato: `docs/Console-Skill/` (bussola, context, vocabolario,
  comunicazione, plan-per-matteo, sessioni).
- ✅ **`.claude/CLAUDE.md`** riscritto per il lavoro Console (instrada alla bussola).
- ✅ **Due tenant sandbox** creati su TEST (PLAN-DB-001 eseguito):
  - `console-classic` → id `4c694cb8-66af-478f-afd2-8719f07d64b4` (edition `classic`)
  - `console-pro` → id `b5436de8-731e-469e-a888-36785823be6b` (edition `pro`)
- ⏳ **`console/` NON ancora creata** (scaffolding app = prima fase del master-plan).
- ⚠️ **Verità del modello dati** (vince sul testo dei doc Servizio-Config):
  - tenant = **`organizations`** (NON `tenants`); edition ∈ {classic, pro, enterprise}.
  - feature = `organizations.edition` + override **`tenant_features`** via `buildFeatures()`
    (`src/config/features.ts`). `organizations.qr_menu_enabled` è **legacy**, non usarla per add-on.
  - impostazioni = **`restaurant_settings`** (key-value jsonb), chiavi in
    `src/features/booking/lib/restaurantSettingRegistry.ts`.

---

## 3. Il workflow automode (come deve girare il ciclo)

### Fase 0 — Crea il master-plan
- File: **`docs/Console-Skill/MASTERPLAN_CONSOLE.md`**.
- Scomponi il lavoro in **fasi `F1…Fn`** sequenziali, ognuna piccola e chiudibile.
- Per **ogni fase** scrivi, usando la skill **«prepara prompt»** (formato `PREPARA_PROMPT_SKILL.md`):
  1. **Obiettivo** + **effetto per Cristiano** (1 riga, stile didattico).
  2. **Modalità** (light/standard/deep) — deep se tocca DB/sicurezza/login/più viste.
  3. **Prompt ESECUTORE** (self-contained — vedi template §5).
  4. **Prompt REVISORE / controverifica** (self-contained — vedi template §5).
  5. **Done-criteria** verificabili (cosa deve essere vero per dire "fatto").
  6. **Dipendenze** (fase precedente, o risposta di Matteo mancante).

### Ciclo per fase (automode)
Per ogni fase `Fi`, nell'ordine:
1. **Lancia subagent ESECUTORE** (Agent `general-purpose`) col *prompt esecutore* di `Fi`.
2. Quando finisce → **lancia subagent REVISORE** (Agent `general-purpose`) col *prompt controverifica* di `Fi`.
3. **Se la revisione passa** → l'orchestrator fa **commit sul branch** (Conventional Commits,
   es. `feat(console): …`) con riferimento alla fase. Poi passa a `Fi+1`.
4. **Se la revisione trova problemi** → rilancia l'ESECUTORE con le correzioni richieste dal revisore;
   ripeti 2–3. Non avanzare finché la fase non è verde.
5. Aggiorna `docs/Console-Skill/sessioni/SESSION_LOG.md` (1 riga per fase) e, se restano debiti,
   `FOLLOW_UP.md`.

### Regole del ciclo
- **Subagent = cold start:** ogni prompt (esecutore e revisore) deve essere **autosufficiente**
  (path della bussola, regole d'oro, file da toccare, done-criteria). Non dare per scontato che il
  subagent "ricordi" questa chat.
- **Git:** commit liberi sul branch (decisione di Cristiano). **Mai** push/merge su altri branch o
  su env/test senza ok esplicito di Cristiano.
- **Stop & ask:** se una fase richiede una risposta di Matteo non ancora data (vedi §6), **non
  inventare**: marca la fase come bloccata, salta alla prossima eseguibile o fermati e chiedi.
- **Mai schema dall'agente:** se una fase scopre di aver bisogno di una modifica di schema, genera un
  `plan-per-matteo/PLAN-DB-NNN` e considera la fase bloccata su quella parte.

---

## 4. Scope suggerito del primo master-plan (proposta, affinala tu)

Ordine coerente con `BENVENUTO_SVILUPPATORE_CONSOLE.md` (primo mattone = elenco tenant + cambio edition):

| Fase | Obiettivo | Modalità | Dipende da |
|------|-----------|----------|-----------|
| **F1** | Scaffolding `console/` isolata (Vite+React+TS+Supabase), esclusa da tsconfig/ESLint/Vitest root; connessione al DB TEST con sola chiave pubblica; placeholder login | deep | — |
| **F2** | Schermata **elenco ristoranti** (legge `organizations`: nome, slug, edition, is_active) — sola lettura | standard | F1 |
| **F3** | Schermata **cambio edition** di un tenant (scrittura su **sandbox**; per i tenant reali predisponi la chiamata a un'Edge, vedi domande Matteo) | deep | F2 + risposta Matteo (Edge) |
| **F4** | **Feature flag** per tenant via `tenant_features` (accendi/spegni add-on; `qr_menu_enabled` ignorata) | deep | F3 |
| **F5** | **Impostazioni ristorante** (numeri tecnici dal `restaurantSettingRegistry`) su sandbox | deep | F4 |

> F1–F2 sono **eseguibili subito** (non bloccate da Matteo). F3+ dipendono dalla decisione sull'Edge
> per le scritture privilegiate e sul login.

---

## 5. Template dei prompt (riusali per ogni fase)

### 5a. Prompt ESECUTORE (incolla, riempi `<…>`)
```
Lavori sul branch feature/console-super-admin (Console super-admin di Matteo).
PRIMA: leggi docs/Console-Skill/00_BUSSOLA_CONSOLE.md e applica le 4 REGOLE D'ORO:
1) solo TEST docnnernvp (get_project_url prima di scrivere il DB; PROD=STOP);
2) scritture dati solo sui sandbox console-classic (id 4c694cb8-66af-478f-afd2-8719f07d64b4) /
   console-pro (id b5436de8-731e-469e-a888-36785823be6b); canale write = MCP CONSOLE;
3) schema → file in docs/Console-Skill/plan-per-matteo/ (NON eseguire DDL);
4) codice solo in console/; non toccare src/ o supabase/; non importare da ../src.
Modello dati reale: organizations (non tenants), edition + tenant_features via buildFeatures()
(src/config/features.ts, sola lettura come riferimento), impostazioni in restaurant_settings.

TASK (fase <Fi> del MASTERPLAN_CONSOLE.md): <obiettivo concreto>.
File coinvolti: <path>. Vincoli: <…>.
DONE quando: <done-criteria verificabili>.
Alla fine: riepiloga cosa hai cambiato, come verificarlo, e cosa resta aperto. NON committare.
```

### 5b. Prompt REVISORE / controverifica (incolla, riempi `<…>`)
```
Sei il REVISORE della fase <Fi> sul branch feature/console-super-admin.
PRIMA: leggi docs/Console-Skill/00_BUSSOLA_CONSOLE.md (4 regole d'oro) + il diff prodotto dall'esecutore.
Controverifica:
- Done-criteria della fase soddisfatti? <elenco>.
- Rispetto regole d'oro: nessuna scrittura fuori dai sandbox, nessun DDL eseguito, codice solo in
  console/, niente import da ../src, nessuna chiave service role nel browser.
- Qualità: gira i test/lint/typecheck del progetto console/ ; controlla regressioni nelle aree toccate.
- Sicurezza ambiente: ogni scrittura DB è andata su docnnernvp e sui soli sandbox.
Esito: VERDE (pronto al commit) oppure ROSSO con lista puntuale di correzioni per l'esecutore.
NON modificare il codice tu stesso; NON committare.
```

---

## 6. Domande aperte per Matteo (bloccano alcune fasi, non F1–F2)

1. **Indirizzo/dominio** della Console e dove si deploya (Vercel root `console/`?).
2. **`tenant_features` vs `edition`/`qr_menu_enabled`**: confermare che gli add-on (incl. Menu QR) si
   pilotano via `tenant_features` e che `qr_menu_enabled` è legacy da ignorare.
3. **Mappatura «+QR»**: classic + riga `tenant_features` `qrMenu`?
4. **Edge Function** dedicata alle scritture privilegiate della Console su TEST: ok? quale forma?
5. **Login Console** (solo Matteo): Supabase Auth con allowlist email?

> Dettaglio anche in `docs/Console-Skill/sessioni/FOLLOW_UP.md`.

---

## 7. Comunicazione e chiusura

- **Stile didattico** (vedi `COMUNICAZIONE_SKILL.md`): breve + «cosa cambia per te» a ogni scelta.
- Riferisci a Cristiano l'avanzamento per **fase** (fatto / revisionato / commit), non riga per riga.
- A fine ciclo (o quando Cristiano dice «fai report finale»): report in `sessioni/` + commit finale.
```
