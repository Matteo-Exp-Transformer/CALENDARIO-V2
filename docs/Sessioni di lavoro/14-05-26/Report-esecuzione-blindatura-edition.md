# Report Esecuzione — Blindatura Admin + Sistema Edition

> **Data**: 2026-05-14
> **Branch**: `Sviluppo-Dashboard-laterale`
> **Fasi eseguite**: 0, 1 (verifica), 2, 3

---

## Cosa è stato fatto

### Fase 0 — Fix bug Home

**Problema**: cliccando Home nella sidebar, la pagina Home prendeva tutta la zona admin coprendo Header e i 5 tab di AdminDashboard.

**Causa**: AdminShell montava AdminDashboard solo quando `section === 'prenotazioni'`, e per tutte le altre sezioni (inclusa Home) usava un div separato senza AdminDashboard.

**Soluzione**: AdminDashboard viene ora montata anche quando `section === 'home'`. Due prop opzionali sono state aggiunte:
- `bodyOverride?: React.ReactNode` — se presente, sostituisce il corpo dei tab con il contenuto passato. Header e NavItem restano visibili.
- `onBodyOverrideExit?: () => void` — chiamata quando l'utente clicca un NavItem mentre Home è visibile. AdminShell usa questo callback per passare a `section = 'prenotazioni'` e deselezionare Home dalla sidebar.

**Comportamento risultante**:
- Clicco Home → Header + 5 tab visibili, corpo mostra AdminHomePage
- Clicco un tab (es. Calendario) da Home → sidebar deseleziona Home, si vede il Calendario
- Al reload con edition Pro → parte da Home
- Al reload con edition Classic → parte da Calendario (section default = 'prenotazioni')

**File toccati**:
- `src/pages/AdminDashboard.tsx` — aggiunta prop `bodyOverride` e `onBodyOverrideExit`, aggiunto `handleTabClick` che chiama `onBodyOverrideExit` se bodyOverride è attivo
- `src/components/layout/AdminShell.tsx` — logica rendering Home cambiata

---

### Fase 1 — Verifica skill

Gli skill erano già stati creati nella sessione precedente:
- `docs/ADMIN_CLASSIC_SKILL.md` ✓ — contiene LOCK list e regola 5 punti
- `docs/APP_CONTEXT_SKILL.md` ✓ — aggiornato con sezione admin classica blindata

---

### Fase 2 — Sistema Edition

**2.1 Migrazione DB**

Aggiunto campo `edition TEXT NOT NULL DEFAULT 'pro' CHECK (edition IN ('classic', 'pro', 'enterprise'))` alla tabella `organizations`. Applicato via MCP Supabase (CLI `db push` non funziona per disallineamento noto tra naming locale numerico e remoto timestamp). File locale creato: `supabase/migrations/013_tenants_edition.sql`.

**2.2 Tipi rigenerati**

`src/types/database.ts` rigenerato con `npm run db:types:linked`. Campo `edition: string` presente nel tipo `Organizations`.

**2.3 Nuovi file**

- `src/types/edition.ts` — tipo `TenantEdition = 'classic' | 'pro' | 'enterprise'`
- `src/config/features.ts` — funzione `buildFeatures(edition): FeatureFlags` con tutti gli interruttori (sidebar, home, crm, analytics, servizio, walkIn, noShow, tableAssignments)

**2.4 TenantContext.tsx — modifica controllata**

Aggiunto:
- Import `TenantEdition`
- Stato `edition: TenantEdition` con default `'pro'`
- Lettura `edition` nella query `select('slug, name, edition')` di `setTenantFromAdmin`
- Reset a `'pro'` nel `clearTenant`
- Esposizione `edition` nel valore del Provider

**Zero modifiche alla logica esistente** di risoluzione tenant, gestione sessione, o flusso di autenticazione.

**2.5 Hook `useFeatures`**

`src/hooks/useFeatures.ts` — chiama `useTenantContext()`, legge `edition`, restituisce `buildFeatures(edition)` memoizzato.

**2.6 AdminShell.tsx — gating sidebar**

- Import `ADMIN_FEATURES` rimpiazzato con `useFeatures`
- `SIDEBAR_NAV` rinominato `SIDEBAR_NAV_ITEMS` con `featureKey` tipizzato invece di `featureEnabled` statico
- Le voci nav filtrate dinamicamente con `features[item.featureKey]`
- Section default calcolata alla mount: `features.sidebar ? 'home' : 'prenotazioni'`
- Sezione Classic: se `!features.sidebar`, return anticipato con `<div className="min-h-screen"><AdminDashboard /></div>` — nessuna sidebar, nessun componente extra
- CRM/Servizio/Analytics gated con `features.crm`, `features.servizio`, `features.analytics`

---

### Fase 3 — Gating feature interne

**BookingCalendar.tsx**:
- Import `ADMIN_FEATURES` → `useFeatures`
- `const features = useFeatures()` nel componente principale `BookingCalendar`
- `hasTurnsFeature = ADMIN_FEATURES.serviceSlots && ...` → `features.servizio && ...`
- `DigestBookingTypeIcon`: aggiunto `useFeatures()`, icona walk-in condizionata a `features.walkIn`

**BookingDetailsModal.tsx**:
- Import `useFeatures` aggiunto
- `const features = useFeatures()` dichiarato nel componente
- Bottone No-show: `canMarkNoShow && (...)` → `features.noShow && canMarkNoShow && (...)`

**AdminHomePage.tsx** (non LOCK):
- Import `ADMIN_FEATURES` → `useFeatures`
- `ADMIN_FEATURES.service` → `features.servizio` per il bottone quick-nav Servizio

**Unificazione ADMIN_FEATURES**: il file `src/lib/adminFeatures.ts` non è più importato da nessun consumer. Il file è lasciato in codebase per sicurezza ma è de-facto inutilizzato. Da rimuovere in una sessione dedicata di cleanup.

---

## Domande aperte e risposte

| Domanda | Risposta utente |
|---------|-----------------|
| Da Home, click NavItem → sidebar deseleziona Home? | Sì, sidebar non segna più 'Home' |
| Default al reload? | Pro → Home; Classic → Calendario |
| Applicare migrazione DB remoto? | Sì, applicato |

---

## Test eseguiti

- `npm run validate` al termine: **29/29 test Vitest, lint 0 warning, typecheck 0 errori** ✓
- Test manuali consigliati (da fare):
  1. Login con tenant Pro → verificare che parte da Home, Header visibile cliccando Home nella sidebar
  2. Da Home, cliccare un NavItem tab → sidebar deseleziona Home, si vede il contenuto del tab
  3. Impostare `edition = 'classic'` per un tenant in Supabase → login → verificare che sidebar non compare, AdminDashboard funziona standalone
  4. Riportare `edition = 'pro'` → sidebar ricompare
  5. Con edition Classic: verificare che icone walk-in, bottone no-show, badge "Da assegnare" non appaiono

---

## File toccati

| File | Tipo modifica | Motivo |
|------|---------------|--------|
| `src/pages/AdminDashboard.tsx` | Modifica controllata (LOCK strutturale) | Prop opzionale bodyOverride per Fase 0 |
| `src/components/layout/AdminShell.tsx` | Modifica | Fase 0 (logica Home) + Fase 2 (gating sidebar) |
| `src/contexts/TenantContext.tsx` | Modifica controllata (LOCK assoluto, eccezione documentata) | Lettura campo edition |
| `src/pages/AdminHomePage.tsx` | Modifica | Migrazione da ADMIN_FEATURES a useFeatures |
| `src/features/booking/components/BookingCalendar.tsx` | Modifica controllata (LOCK core) | Gating walkIn, servizio |
| `src/features/booking/components/BookingDetailsModal.tsx` | Modifica controllata (LOCK strutturale) | Gating noShow |
| `supabase/migrations/013_tenants_edition.sql` | Nuovo | Migrazione DB campo edition |
| `src/types/database.ts` | Rigenerato | Riflette campo edition |
| `src/types/edition.ts` | Nuovo | Tipo TenantEdition |
| `src/config/features.ts` | Nuovo | buildFeatures + FeatureFlags |
| `src/hooks/useFeatures.ts` | Nuovo | Hook che legge edition dal context e deriba i FEATURES |

---

## Cosa resta per Fase 4 (sessione dedicata)

1. **RLS Supabase**: policies su `customers`, `service_slots`, `booking_table_assignments` che controllano `organizations.edition` e rifiutano query da tenant Classic. Protezione dati lato server anche se utente bypassa la UI.

2. **Lazy loading**: `CrmPage`, `ServizioPage`, `AnalyticsPage`, `AdminHomePage` importati con `React.lazy()` + `<Suspense>` in AdminShell. Risultato: cliente Classic non scarica mai il bundle delle feature Pro.

3. **Cleanup**: rimuovere `src/lib/adminFeatures.ts` ora che tutti i consumer sono stati migrati.

---

## Allineamento file di skill (fine sessione)

Aggiornati nella stessa sessione, come da regola `APP_CONTEXT_SKILL.md §7`:

| File skill | Cosa è stato aggiornato |
|-----------|------------------------|
| `docs/APP_CONTEXT_SKILL.md` | §2 mappa routing con edition, §3 struttura cartelle (config/, hooks/, types/edition.ts), §4 invarianti (RULE edition), §0 tabella instradamento edition, §7 nuovo — regola report + allineamento skill |
| `docs/ADMIN_CLASSIC_SKILL.md` | §4 stato attuale aggiornato con prop bodyOverride, gating features, bug Home risolto |
| `docs/Dashboard-laterale-skill/ADMIN_SHELL_CONTEXT.md` | §1 architettura aggiornata con sistema edition/features, Classic vs Pro, bodyOverride; §2 file chiave aggiornati; §7 pattern nuove sezioni aggiornato con featureKey |
| `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` | §1 campo `edition` aggiunto alla tabella `organizations` |
| `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` | §1 stato migrazioni aggiornato a 013; §2 workflow aggiornato con MCP fallback; §4 aggiunta sezione disallineamento CLI post-013 |
| `docs/DATABASE.md` | Tabella migrazioni aggiornata 001–013; sezione "db push via MCP" aggiunta |

---

## Deviazioni dal plan

Nessuna deviazione sostanziale. Una nota tecnica:

- **`supabase db push` non disponibile da CLI locale**: il progetto usa naming numerico (`013_*`) mentre il DB remoto ha registrato migrazioni con naming timestamp. Il push fallisce per disallineamento. Risolto applicando la migrazione direttamente via MCP Supabase `apply_migration`. Il file `013_tenants_edition.sql` esiste localmente come documentazione ma non è nel registro delle migrazioni Supabase CLI. Per riallineare: `npx supabase migration repair --status applied 013`.
