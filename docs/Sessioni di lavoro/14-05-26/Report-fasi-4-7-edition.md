# Report Esecuzione — Fasi 4-7 Blindatura Edition

> **Data**: 2026-05-14
> **Branch**: `Sviluppo-Dashboard-laterale`
> **Fasi eseguite**: 4a, 4b, 5a, 5b, 6, 7

---

## Cosa è stato fatto

### Fase 4a — RLS Edition Gates (migrazione 014)

**Problema che risolve**: oggi se un dipendente di Mario (Classic) apre i devtools e sblocca la UI CRM, il database risponde comunque alle sue query e restituisce i dati dei clienti. Zero protezione lato server.

**Soluzione**: migrazione `014_rls_edition_gates.sql` che rimpiazza le policy RLS su 5 tabelle Pro-only aggiungendo un secondo livello di controllo: `organizations.edition IN ('pro', 'enterprise')`. Senza questa condizione la query viene rifiutata, indipendentemente da cosa fa la UI.

**Tabelle protette**:
- `customers` — lista clienti CRM
- `service_slots` — fasce orarie Servizio
- `booking_table_assignments` — assegnazioni tavoli
- `rooms` — sale per il layout
- `tables` — tavoli per il layout

**Strategia tecnica**: le policy esistenti `admin_*` sono state rimpiazzate (DROP + CREATE) perché in PostgreSQL più policy permissive si sommano con OR — aggiungerne una nuova che "nega" non avrebbe avuto effetto. La nuova policy include sia `tenant_id = current_admin_tenant_id()` (isolamento multi-tenant esistente) che il nuovo gate edition.

**Verifica**: SQL diretto ha confermato che tutte le policy SELECT includono entrambe le condizioni. Test con tenant di test Classic creato e pulito.

**File toccati**:
- `supabase/migrations/014_rls_edition_gates.sql` — nuovo

---

### Fase 4b — Lazy Loading (AdminShell)

**Problema che risolve**: Mario (Classic) scaricava al login ~900 KB di codice incluso CRM/Servizio/Analytics/Home che non vedrà mai. Spreco di banda e tempo.

**Soluzione**: in `AdminShell.tsx` le 4 pagine Pro sono ora importate con `React.lazy()` + `<Suspense fallback={<SectionFallback />}>`. AdminDashboard rimane import statico (è sempre montata). Un componente `SectionFallback` inline mostra un spinner rotante durante il caricamento del chunk.

**Risultato verificato nel build**:
```
CrmPage-*.js        22.66 kB  — chunk separato ✓
ServizioPage-*.js   71.08 kB  — chunk separato ✓
AnalyticsPage-*.js 391.90 kB  — chunk separato ✓
AdminHomePage-*.js 438.37 kB  — chunk separato ✓
```

Luigi (Pro), al primo click su CRM, vede un brevissimo spinner poi la pagina. Mario (Classic) non scarica mai questi chunk.

**Spiegazione preventiva prodotta**: sì, prima di modificare AdminShell. Modifica applicata dopo.

**File toccati**:
- `src/components/layout/AdminShell.tsx` — import lazy + Suspense wrapper

---

### Fase 5a — Fix Logout Flash (TenantContext)

**Problema che risolve**: Mario (Classic) cliccava logout e per una frazione di secondo vedeva lampeggiare la sidebar Pro, perché `clearTenant()` resettava edition a `'pro'`.

**Soluzione**: `clearTenant()` ora resetta edition a `'classic'`. Così nel frame di rendering prima del redirect a login, l'app mostra sempre la versione base (nessuna sidebar).

**File toccati**:
- `src/contexts/TenantContext.tsx` — LOCK ASSOLUTO, modifica minima (una riga: `'pro'` → `'classic'`)

**Spiegazione preventiva**: prodotta insieme a 5b (unica spiegazione per entrambe le fasi). Conferma utente ricevuta.

---

### Fase 5b — Ottimizzazione Login (migrazione 015 + TenantContext)

**Problema che risolve**: al login di Mario l'app faceva due chiamate al database in sequenza: prima `check_admin_email` (chi sei?), poi una SELECT su `organizations` (qual è la tua edition?). Su 4G lenta: +200-400ms al login.

**Soluzione**: migrazione `015_check_admin_email_with_edition.sql` ricrea la funzione RPC con return esteso: `(name, tenant_id, slug, org_name, edition)`. Una sola chiamata contiene tutto.

In `TenantContext.setTenantFromAdmin()` la seconda SELECT su `organizations` è stata rimossa — i dati ora vengono letti direttamente dalla risposta RPC (`adminInfo.org_name`, `adminInfo.slug`, `adminInfo.edition`).

**Nota tecnica**: PostgreSQL non permette `CREATE OR REPLACE FUNCTION` quando cambia il tipo di ritorno. La migrazione fa `DROP FUNCTION IF EXISTS` + `CREATE FUNCTION`. Questo è sicuro perché la funzione non è chiamata da altri posti oltre a TenantContext.

**File toccati**:
- `supabase/migrations/015_check_admin_email_with_edition.sql` — nuovo
- `src/contexts/TenantContext.tsx` — rimossa seconda SELECT

**Test mock aggiornato**: `TenantContext.test.tsx` mockava il vecchio comportamento a 2 chiamate. Aggiornato per riflettere la nuova struttura della RPC (1 chiamata con tutti i campi).

---

### Fase 6 — Test E2E Edition Classic

**Tre spec Playwright scritti in `e2e/`**:

1. `edition-classic.spec.ts` — verifica che un admin Classic veda: nessuna sidebar, 5 tab operativi, nessuna icona walk-in, nessun bottone no-show nel modal. 5 test.

2. `edition-classic-data-protection.spec.ts` — sblocca UI CRM via JS injection (simula devtools bypass) e verifica che la lista clienti sia vuota (RLS in azione). 1 test.

3. `edition-upgrade.spec.ts` — tenant Classic → upgrade a Pro via API diretta Supabase → reload → verifica che la sidebar appaia e le sezioni Pro siano accessibili. 1 test con `afterEach` che riporta il tenant a Classic.

**Stato skip**: tutti e 3 i file fanno `test.skip()` se le variabili d'ambiente staging non sono configurate (`E2E_ADMIN_EMAIL` ecc.). Questo permette di committare i test senza romper CI, pronti per quando verrà configurato uno staging dedicato.

**Variabili necessarie per staging** (in `.env.local.test`):
```
E2E_ADMIN_EMAIL=admin-classic@test.it
E2E_ADMIN_PASSWORD=...
E2E_SUPABASE_SERVICE_KEY=...    # solo per edition-upgrade.spec.ts
E2E_CLASSIC_TENANT_ID=...       # solo per edition-upgrade.spec.ts
```

---

### Fase 7 — Cleanup Finale

- `src/lib/adminFeatures.ts` cancellato — era già inutilizzato dopo la sessione precedente (zero consumer)
- `grep -rn "ADMIN_FEATURES" src/` → 0 risultati
- `npm run db:types:linked` → tipi rigenerati
- `npm run validate` → **29/29 test Vitest, lint 0 warning, typecheck 0 errori** ✓

---

## Test eseguiti

| Test | Risultato |
|------|-----------|
| `npm run validate` (lint + typecheck + 29 Vitest) | ✅ Tutto green |
| `npm run build` (verifica chunk lazy) | ✅ 4 chunk separati nel build output |
| SQL diretto RLS policy | ✅ Tutte le policy SELECT includono gate edition |
| SQL diretto RPC estesa | ✅ `check_admin_email` restituisce i 5 campi |
| E2E edition (`npm run test:e2e`) | ⏸ Test scritti, .skip senza staging |

---

## File toccati

| File | Tipo modifica | Perché — in linguaggio utente |
|------|---------------|-------------------------------|
| `supabase/migrations/014_rls_edition_gates.sql` | Nuovo | Mario Classic non può leggere clienti/tavoli/slot anche se bypassa la UI |
| `supabase/migrations/015_check_admin_email_with_edition.sql` | Nuovo | Login di Mario fa una chiamata invece di due |
| `src/components/layout/AdminShell.tsx` | Modifica | Mario Classic non scarica il bundle CRM/Servizio; Luigi vede spinner al primo click |
| `src/contexts/TenantContext.tsx` | Modifica controllata (LOCK) | Nessun flash sidebar al logout + login più veloce |
| `src/types/database.ts` | Rigenerato | Allineato con DB post-migrazioni |
| `src/lib/adminFeatures.ts` | Cancellato | File morto, zero consumer, sostituito da useFeatures() |
| `src/contexts/__tests__/TenantContext.test.tsx` | Aggiornato | Mock allineato alla nuova struttura RPC (1 chiamata) |
| `e2e/edition-classic.spec.ts` | Nuovo | Garanzia automatica: edizione Classic rimane funzionante |
| `e2e/edition-classic-data-protection.spec.ts` | Nuovo | Garanzia automatica: RLS blocca anche con UI sbloccata manualmente |
| `e2e/edition-upgrade.spec.ts` | Nuovo | Garanzia automatica: upgrade a Pro funziona senza rebuild |

---

## Migrazioni applicate

### 014_rls_edition_gates.sql
Rimpiazza policy RLS su `customers`, `service_slots`, `booking_table_assignments`, `rooms`, `tables` con versioni che aggiungono controllo `organizations.edition IN ('pro', 'enterprise')`.

### 015_check_admin_email_with_edition.sql
```sql
DROP FUNCTION IF EXISTS public.check_admin_email(text);
CREATE FUNCTION public.check_admin_email(check_email text)
RETURNS TABLE(name text, tenant_id uuid, slug text, org_name text, edition text)
...
```

---

## Spiegazioni preventive prodotte e conferme ricevute

| File toccato | Spiegazione preventiva | Conferma utente |
|---|---|---|
| `AdminShell.tsx` (Fase 4b) | Sì — lazy loading, chunk separati, spinner temporaneo per Pro | Sì (implicita: "procedi") |
| `TenantContext.tsx` (Fasi 5a+5b) | Sì — flash logout + ottimizzazione login, 5 punti completi | Sì — "procedi" |

---

## Deviazioni dal plan

1. **DROP + CREATE invece di CREATE OR REPLACE per la migrazione 015**: PostgreSQL non permette `CREATE OR REPLACE` quando cambia il tipo di ritorno. Risolto con `DROP IF EXISTS` + `CREATE`. Sicuro perché la funzione non ha altri caller.

2. **`SectionFallback` inline invece di `<Spinner>` da `src/components/ui/`**: il componente Spinner non esiste nella UI library. Creato inline in AdminShell con lo stesso pattern `animate-spin` usato in CollapsibleCard. Nessun nuovo file creato.

3. **Test E2E in `.skip` anziché passing**: come previsto dal plan ("marcali come `.skip` con commento 'richiede staging'"). Nessuna deviazione reale.

---

## Allineamento file di skill

| File skill | Cosa è stato aggiornato |
|---|---|
| `docs/Dashboard-laterale-skill/ADMIN_SHELL_CONTEXT.md` | §1 architettura — lazy loading + Suspense indicati nel diagramma |
| `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` | §2 — `check_admin_email` aggiornata con nuova signature e tabella campi |
| `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` | §1 — stato migrazioni aggiornato a 015 |
| `docs/Sessioni di lavoro/14-05-26/Plan-blindatura-admin-e-edition-system.md` | §4 Definition of Done — tutte le caselle 4a-7 spuntate |

---

## Cosa resta (fuori scope di questo plan)

- **Test E2E attivi**: configurare staging Supabase dedicato con tenant Classic di test. Variabili documentate nei 3 spec.
- **UI Super-Admin edition**: pannello per cambiare edition tenant senza Supabase Studio. Documentato in `docs/Upgrade-da-Fare/UI-super-admin-edition.md`.
- **Creare tenant Classic reale**: tutti i tenant in DB hanno ancora `edition='pro'`. Quando si vuole vendere la versione Classic, impostare `edition='classic'` via Supabase Studio per il cliente desiderato.
