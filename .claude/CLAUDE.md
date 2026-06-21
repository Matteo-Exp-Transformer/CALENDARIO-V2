# CLAUDE.md — Guida sessioni AI · branch `feature/console-super-admin` (Console super-admin)

> ⚠️ **Questo è il file master del branch Console**, personalizzato per il lavoro di **Cristiano**
> (sviluppatore della Console privata di Matteo). Su questo branch **sostituisce** le regole operative
> di Matteo. Lo skill system di Matteo (le skill in `docs/` diverse da `docs/Console-Skill/`) resta
> **intatto** e si usa **solo come riferimento in sola lettura** per capire l'app esistente.
>
> Obiettivo del branch: costruire la **Console super-admin** (FU-SERV-ADMIN-PANEL-1) — app web
> separata e responsive, solo per Matteo, che legge/scrive lo stesso DB Supabase **TEST** per
> configurare i ristoranti (tenant). Contesto prodotto: `docs/Servizio-Config/`.

## Prima di toccare il codice — carica la bussola Console

1. Apri **`docs/Console-Skill/00_BUSSOLA_CONSOLE.md`** — è la Skill 0 del nostro lavoro: routing,
   profili, regole operative del branch, LOCK. Caricala **prima** di aprire qualsiasi file.
2. Da lì instradati al file di `docs/Console-Skill/context/` pertinente (modello dati / architettura).
3. Le skill d'area di Matteo (`docs/Prenota-Skill/`, `docs/Menu-QR-Skill/`, `docs/Admin-Skill/`,
   `docs/Database-Skill/`, `docs/Marketing-Skill/`…) servono **solo a capire** come funziona l'app:
   leggile, **non** modificarle e **non** modificare `src/` o `supabase/` dell'app di Matteo.

> I valori reali (limiti, edition, feature) vivono nel **codice/DB**; i `.md` li specchiano. Se un
> documento `docs/Servizio-Config/` diverge dal DB, **vince il DB** (es. il tenant è `organizations`,
> non `tenants`).

## Le 4 regole d'oro del branch (sempre attive)

1. **Solo TEST.** Si lavora solo su Supabase TEST `docnnernvp`. Prima di **ogni** scrittura DB:
   `get_project_url` deve dare `docnnernvp`. Se `rwuxgvld` (PROD) → **FERMATI**.
2. **Scrivo solo nei sandbox.** Le scritture di **dati** sono permesse **solo** sui due tenant
   sandbox del branch (`console-classic`, `console-pro`). Ogni altro tenant = **sola lettura**.
3. **Schema → plan per Matteo.** Modifiche di schema/DDL/RLS/migrazioni: **mai** eseguite
   dall'agente. Si genera un file in `docs/Console-Skill/plan-per-matteo/` e lo esegue Matteo.
4. **Codice solo in `console/`.** Il codice della Console vive nella sottocartella isolata
   `console/`. Non si tocca `src/` né `supabase/`. La Console **non importa** da `../src` (client e
   chiavi Supabase diversi): ricrea i concetti. La chiave privilegiata (service role) **mai nel
   browser** → scritture potenti via Edge/serverless.

## Comandi e vocabolario (leggi a inizio sessione)

> Fonte di verità dei comportamenti: **`docs/Console-Skill/comunicazione/VOCABOLARIO.md`**.
> Applica la voce quando Cristiano usa una parola mappata.

**Livelli di libertà:** Liv. 1 = applica subito · Liv. 2 = applica, ma se ambiguo **una** domanda
breve prima · Liv. 3 = chiedi sempre conferma salvo match identico già registrato come ok.

**Grilletti principali** (riuso dal sistema di Matteo + uno nuovo):
- **«prepara» / «prepara prompt»** → NON eseguire codice; consegna solo il prompt pronto.
- **«implementa» / «fai» / «aggiungi» / «crea»** → profilo Esecuzione (carica la bussola Console).
- **«revisiona» / «verifica» / «debugga» / «non funziona»** → profilo Verifica (test + context).
- **«lavoro ok»** → scrivi/aggiorna il report (no commit). **«fai report finale»** → report + commit.
- **«dammi follow up»** → solo il prompt per la prossima chat. **«spiegamelo semplice»** → breve.
- **«ragioniamo»** → fermati: spiegazione + effetto per te + tabellina + checklist.
- **🆕 «plan per matteo»** → genera il file `plan-per-matteo/PLAN-DB-…` con la modifica DB proposta;
  **NON** esegue scritture di schema.

**Salvaguardie sempre attive:** stile **didattico** (breve, ma per ogni scelta tecnica aggiungi
«cosa cambia per te» in lingua semplice — vedi `docs/Console-Skill/comunicazione/COMUNICAZIONE_SKILL.md`);
le **4 regole d'oro** qui sopra; **comando non riconosciuto → non dedurre, chiedi prima**.

## Dettaglio operativo

### Comandi principali (app di riferimento, root del repo)

```bash
npm run dev                  # dev server app Matteo su :5173 (riferimento)
npm run build                # TypeScript check + Vite build
npm run lint                 # ESLint, zero warning tollerati
npm run typecheck            # tsc --noEmit
npm run test                 # Vitest (run mode) — deve essere verde
npm run validate             # lint + typecheck + test (pre-PR)
npm run db:types:linked      # Rigenera src/types/database.ts dal DB remoto
```

> Quando esisterà la sottocartella `console/`, avrà i **suoi** comandi (suo `package.json`) ed è
> **esclusa** dalla pipeline root. Dettagli in `docs/Console-Skill/context/CONSOLE_APP_CONTEXT.md`.
> Setup test del progetto: `docs/Testing-Skill/TESTING_SKILL.md`.

### Convenzioni

- **Conventional Commits**: `feat(scope):`, `fix(scope):`, `docs(scope):` ecc.
- **Git su questo branch:** commit liberi sul branch; **mai** push/merge su altri branch o su
  env/test **senza ok esplicito** di Cristiano.
- **Import alias**: `@/` → `src/` nell'app di Matteo. La Console userà i propri alias.
- **Logger**: usa il logger del progetto, **non** `console.log` in codice di produzione.
- **Due client Supabase** nell'app: `supabasePublic` (anonimo) vs `supabase` (admin) — non mischiare.
- **Commenti**: spiegano il PERCHÉ, non il COSA.

### Modello dati che la Console legge/scrive (sintesi — dettaglio nel context)

- Tenant = tabella **`organizations`** (`id, slug, name, edition` ∈ {classic, pro, enterprise},
  `is_active`, …). NON esiste `tenants`.
- Edition + feature flag via `organizations.edition` + override **`tenant_features`** combinati da
  `buildFeatures()` in `src/config/features.ts`. **`organizations.qr_menu_enabled` è legacy**: per gli
  add-on (incl. Menu QR) la fonte di verità è `tenant_features`.
- Impostazioni ristorante in **`restaurant_settings`** (specchio di
  `src/features/booking/lib/restaurantSettingRegistry.ts`).
- Dettaglio completo: `docs/Console-Skill/context/CONSOLE_DATA_MODEL_CONTEXT.md`.

### File di riferimento dell'app (sola lettura — non modificare)

| File | Perché ci serve |
|------|-----------------|
| `src/config/features.ts` | `buildFeatures()`: edition + override `tenant_features` |
| `src/features/booking/lib/restaurantSettingRegistry.ts` | registro delle impostazioni configurabili |
| `src/contexts/TenantContext.tsx` | come l'app risolve il tenant (slug / email) e l'edition |
| `src/types/database.ts` | tipi DB (schema reale) |

### Sicurezza ambienti DB

Prima di ogni INSERT/UPDATE/DELETE via MCP: `get_project_url` → `docnnernvp` = TEST ok;
`rwuxgvld` = PROD → **stop**. `apply_migration`/DDL → **mai** dall'agente: vanno in un *plan per
Matteo*. `supabase db push` e CLI di scrittura su PROD: **vietati**. I MCP non leggono `.env.local`.

---

> **Skill system del branch:** `docs/Console-Skill/` (bussola, context, comunicazione, sessioni,
> plan-per-matteo). Template di origine: `_skill-system-v0/`. Contesto prodotto Console:
> `docs/Servizio-Config/`.
