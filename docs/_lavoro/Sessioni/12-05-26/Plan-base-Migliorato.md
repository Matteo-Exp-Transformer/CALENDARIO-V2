# Piano — Skill 0 + Ristrutturazione Plan admin shell

## Context

Il progetto usa skill-file per orientare agenti AI. Esistono 2 skill attive:
- `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` — shell, sidebar, sezioni admin
- `docs/per-ui-design/UI_EDIT_SKILL.md` — UI, componenti, tema Tailwind v4

Il plan `admin_shell_ia_e_responsive_635c879e.plan.md` è un buon design doc ma **non è executable da agenti**: ogni todo manca di istruzioni di caricamento skill, file da leggere e passi atomici. Gli agenti rischiano di reinventare pattern, toccare file locked o dimenticare invarianti.

## Obiettivo

1. Creare **Skill 0** (`docs/APP_CONTEXT_SKILL.md`) — orienta l'agente da zero, instrada al skill corretto
2. Riscrivere il plan come checklist eseguibile: ogni todo = skill da caricare + file + passi + validazione
3. Specificare Home / Servizio / Analytics con roadmap completa (incluse fasi future)

---

## Parte 1 — Skill 0: APP_CONTEXT_SKILL.md (da creare)

**File**: `docs/APP_CONTEXT_SKILL.md`

```yaml
---
name: app-context
description: >-
  Skill 0 — orienta qualsiasi agente su CalendarBackup-v2. Caricalo quando inizi
  una sessione senza sapere quale skill usare, o quando il task attraversa più aree.
  Mappa l'app, definisce invarianti globali e instrada al skill corretto.
---
```

**Sezioni nel file:**

**§1 Stack** — React 18 + Vite + TS + Tailwind v4 + Supabase + TanStack Query

**§2 Due aree**:
- Area pubblica: form prenotazione clienti (`supabasePublic`, no session)
- Area admin: dashboard ristoratore (`supabase`, session admin)

**§3 Mappa routing admin** (state-based, NO cambio URL):

| section | Componente | Stato |
|---------|-----------|-------|
| `'prenotazioni'` | `<AdminDashboard />` | stabile |
| `'home'` | `<AdminDashboard />` ← DEFAULT post-plan | stabile |
| `'crm'` | `<CrmPage />` | stabile |
| `'servizio'` | `<ServizioPage />` | in sviluppo |
| `'analytics'` | `<AnalyticsPage />` | in sviluppo |

**§4 Skill routing table**:

| Task riguarda… | Skill da caricare |
|----------------|-------------------|
| AdminShell / sidebar / nav / sezioni / responsive | `ADMIN_SHELL_SKILL.md` |
| UI / className / Tailwind / componenti / tema / colori | `UI_EDIT_SKILL.md` |
| CRM / clienti / customer / prenotazioni history | `ADMIN_SHELL_SKILL.md` |
| Task che tocca sia layout shell che stile Tailwind | entrambi |
| Non è chiaro | Leggi `CLAUDE.md` → poi usa questa tabella |

**§5 Invarianti globali** (valgono in ogni task, in ogni file):
- `CollapsibleCard.tsx` — LOCKED (57 test), mai toccare
- `Modal.tsx z-[10050]` — non alterare mai (stack con Toast z-100000)
- `TenantContext.tsx` — core multi-tenancy, MAI toccare
- `supabase/migrations/` — DB remoto già applicato, MAI toccare
- `src/router.tsx` — solo su esplicita richiesta
- Classi Tailwind v4: solo stringhe letterali statiche, mai template literal `bg-${x}-600`
- `cn()` da `@/lib/utils` — mai `clsx()` o `twMerge()` direttamente
- Due client Supabase: `supabase` (admin) vs `supabasePublic` (form pubblici) — non mischiare

**§6 Puntatori**:
- Comandi e setup: `CLAUDE.md`
- Architettura sistema completa: `docs/ARCHITECTURE.md`
- Schema DB e migrazioni: `docs/DATABASE.md`

---

## Parte 2 — Plan ristrutturato (todo 1–4)

### TODO: responsive-drawer

**Skill da caricare**:
1. `docs/APP_CONTEXT_SKILL.md` (orientamento)
2. `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` → `ADMIN_SHELL_CONTEXT.md`
3. `docs/per-ui-design/UI_EDIT_SKILL.md` → `STYLING_AGENT_CONTEXT.md`

**File da leggere prima di modificare**:
- `src/components/layout/AdminShell.tsx` (intero — capire `useIsLg`, stati `narrowExpanded`/`wideCollapsed`)
- `ADMIN_SHELL_CONTEXT.md` §4 (Sidebar responsive), §5 (Z-index layers)
- `STYLING_AGENT_CONTEXT.md` §1 (Tailwind v4 breakpoint syntax)

**Invarianti critiche**:
- Z-index: backdrop `z-[7999]`, drawer overlay `z-[8000]` — SOTTO CustomerDetailPanel `z-[8999]`
- Modal `z-[10050]` invariato — non toccare
- Tailwind breakpoint: `max-[645px]:` come classe letterale statica (mai template literal)
- NO hover-to-expand — solo toggle button
- Nessun cleanup su `data-admin-theme`

**Passi atomici**:
1. Aggiungere rilevamento `width < 645px` in `AdminShell.tsx` — stesso pattern `matchMedia` di `useIsLg()`, nuovo stato `isNarrow`
2. Quando `isNarrow && narrowExpanded`: `<aside>` → `fixed inset-y-0 left-0 z-[8000] w-56` + `<div className="fixed inset-0 z-[7999] bg-black/40" onClick={closeDrawer} />`
3. Quando `isNarrow && !narrowExpanded`: `<aside>` resta `w-16` (rail, niente drawer)
4. Toggle button + click backdrop + `Escape` → `setNarrowExpanded(false)`
5. `aria-expanded={narrowExpanded}` su `<aside>`, `aria-label="Chiudi menu"` su backdrop
6. Second pass: verificare 390px — grid 2col AdminDashboard, hero title overflow (solo classi su file già aperti)

**Validazione**: `npm run typecheck && npm run lint && npm run test` + smoke 390px e 768px

---

### TODO: home-dashboard-merge

**Skill da caricare**:
1. `docs/APP_CONTEXT_SKILL.md`
2. `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` → `ADMIN_SHELL_CONTEXT.md` + `ADMIN_PAGES_CONTEXT.md` §Home

**File da leggere prima**:
- `src/components/layout/AdminShell.tsx` (tipo `AdminShellSection`, default state, switch in `<main>`)
- `src/pages/AdminHomePage.tsx` (verificare che sia solo placeholder)

**Invarianti critiche**:
- NON aggiungere cleanup a `data-admin-theme` in nessun file
- `AdminHomePage.tsx` — non eliminare, tenerlo placeholder fase 2
- Pulsante Calendario in cima alla sidebar mantiene la sua logica (`setSection('prenotazioni')`)

**Passi atomici**:
1. `AdminShell.tsx` — `useState<AdminShellSection>('prenotazioni')` → `('home')`
2. Switch in `<main>`: `'home' → <AdminDashboard />` (al posto di `<AdminHomePage />`)
3. Mantenere `'prenotazioni' → <AdminDashboard />` per compatibilità con il pulsante Calendario
4. Non rimuovere `'prenotazioni'` dal tipo `AdminShellSection` (ancora usato dal pulsante Calendario)

**Validazione**: `npm run typecheck && npm run lint && npm run test`

---

### TODO: nav-swaps-callbacks

**Skill da caricare**:
1. `docs/APP_CONTEXT_SKILL.md`
2. `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` → `ADMIN_SHELL_CONTEXT.md` + `ADMIN_PAGES_CONTEXT.md` §CRM

**File da leggere prima**:
- `src/components/layout/AdminShell.tsx` (NAV array, props a AdminDashboard, tenantSlug)
- `src/pages/AdminDashboard.tsx` (props interface, NavItem Impostazioni, NavItem Form Pubblico, footer)

**Passi — sotto-task A: Servizio ↔ Impostazioni locale**:
1. Sidebar NAV: voce Servizio → voce Impostazioni (icon `Store` lucide-react)
   - onClick → `setSection('home')` + `sessionStorage.setItem('admin-open-tab', 'settings-restaurant')`
2. `AdminDashboard.tsx`: ricevere prop `onOpenServizio?: () => void`; NavItem "Impostazioni locale" → "Servizio"; onClick → `props.onOpenServizio?.()`
3. `AdminShell.tsx` passa `onOpenServizio={() => setSection('servizio')}`
4. In `AdminDashboard.tsx` useEffect: `sessionStorage.getItem('admin-open-tab')` → setActiveTab → `sessionStorage.removeItem('admin-open-tab')`
5. Aggiornare footer quick-nav AdminDashboard

**Passi — sotto-task B: CRM ↔ Form Pubblico**:
1. Sidebar NAV: voce CRM Clienti → Form Pubblico (icon `ExternalLink` lucide-react)
   - onClick → apri form pubblico con `tenantSlug` (stessa logica già presente)
2. `AdminDashboard.tsx`: ricevere prop `onOpenCrm?: () => void`; NavItem "Form Pubblico" → "CRM Clienti"; onClick → `props.onOpenCrm?.()`
3. `AdminShell.tsx` passa `onOpenCrm={() => setSection('crm')}`
4. Aggiornare footer quick-nav AdminDashboard

**Invarianti**: non toccare `data-admin-theme`, non aggiungere 'prenotazioni' al NAV.

**Validazione**: `npm run typecheck && npm run lint && npm run test` + smoke su ogni bottone swappato

---

### TODO: docs-context

**Skill da caricare**: nessuno (editing documenti markdown)

**File da aggiornare dopo aver completato i todo 1–3**:
1. `ADMIN_SHELL_CONTEXT.md` §4 — aggiungere riga: `< 645px | Drawer overlay fixed w-56 | backdrop click / Escape`
2. `ADMIN_SHELL_CONTEXT.md` §5 — aggiungere layers: `Sidebar backdrop z-[7999]`, `Sidebar drawer z-[8000]`
3. `ADMIN_SHELL_CONTEXT.md` §1 — aggiornare mappa: `'home' → <AdminDashboard /> ← DEFAULT`
4. `ADMIN_PAGES_CONTEXT.md` §Home — aggiornare stato + nota
5. `ADMIN_PAGES_CONTEXT.md` §CRM — aggiornare percorso UX se accesso da nav dashboard
6. `APP_CONTEXT_SKILL.md` §3 — allineare tabella mappa routing

**Validazione**: rileggere i file per coerenza interna

---

## Parte 3 — TODO: home-servizio-analytics-spec (COMPLETO)

### Home — "Inizio turno" (confermato)

**Obiettivo**: vista operativa rapida per chi apre l'app per iniziare il turno.

**Widget MVP** (query su `booking_requests` filtrate per `tenant_id` + giorno corrente):

| Widget | Query | queryKey |
|--------|-------|----------|
| Pending oggi | count dove `status='pending'` e `date=today` | `['home-pending', tenantId]` |
| Coperti confermati oggi | sum `guests` dove `status='accepted'` e `date=today` | `['home-covers', tenantId]` |
| Prossime 3 prenotazioni | lista `status='accepted'`, `date=today`, ordinate per `time` | `['home-upcoming', tenantId]` |
| Alert anomalie | prenotazioni con `guests >= 10` o note lunghe, `status='pending'` | derivato da query pending |

**Hook**: `useAdminHomeStats(tenantId)` in `src/features/booking/hooks/useAdminHomeStats.ts`

**File da creare**: `src/pages/AdminHomePage.tsx` (riscrivere il placeholder)
**Componenti**: `<SectionHeader>`, `<Card>/<CardContent>`, `<Badge>`, `<EmptyState>` — tutti già in `src/components/ui/`

---

### Servizio — Roadmap a 3 fasi (confermato: obiettivo finale = mappa drag)

**Libreria consigliata per F3**: `react-konva` (`npm install react-konva konva`)
- Canvas-based, nessun servizio esterno, nessun account a pagamento, no dominio speciale
- Solo 2 package npm, entrambi open source
- Konva disegna su HTML5 Canvas → non interferisce con Tailwind (il canvas è fuori dal DOM Tailwind)
- Rischio di integrazione: basso; react-konva è maturo e ampiamente usato in app React
- Nessun problema con Tailwind v4 (il canvas non usa classi Tailwind internamente)

**Migrazione DB necessaria**: `supabase/migrations/007_service_tables.sql`

#### F1 — CRUD lista tavoli/sale

**Schema**:
```sql
CREATE TABLE tables (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        text NOT NULL,
  capacity    int  NOT NULL CHECK (capacity > 0),
  room        text,           -- sala (opzionale, es. "Terrazza", "Interno")
  position_x  float,          -- null in F1, valorizzato in F3
  position_y  float,          -- null in F1, valorizzato in F3
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX ON tables(tenant_id);
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
```

**Hook**: `useTables()` + `useTableMutations()` in `src/features/booking/hooks/`
**File**: `src/pages/ServizioPage.tsx` (da implementare), `src/types/table.ts`

#### F2 — Turni pranzo/cena con capacità per turno

**Schema aggiuntivo**:
```sql
CREATE TABLE service_windows (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        text NOT NULL,  -- es. "Pranzo", "Cena"
  start_time  time NOT NULL,
  end_time    time NOT NULL,
  capacity    int,            -- capienza totale per turno (override tabelle se valorizzato)
  active      bool DEFAULT true
);
```

**Allineamento**: usare le stesse fasce orarie già in `booking_requests` (campo `time`)

#### F3 — Mappa sala drag (react-konva)

**Dipendenza da aggiungere**: `npm install react-konva konva`
**Componente**: `<FloorMapEditor />` in `src/features/booking/components/servizio/`
- Tavoli come rettangoli/cerchi su canvas Konva, draggabili
- Salva `position_x` / `position_y` in tabella `tables`
- `useUpdateTablePosition` mutation che aggiorna solo le coordinate
- Nessun conflitto con Modal/z-index (il canvas è nel flusso normale del layout)

**File da creare in F3**:
- `src/features/booking/components/servizio/FloorMapEditor.tsx`
- `src/features/booking/components/servizio/TableNode.tsx`
- `src/features/booking/hooks/useUpdateTablePosition.ts`

---

### Analytics — Roadmap da 0 a completo (confermato: MVP = trend base)

#### Fase 1 — Trend base (MVP)

**Metriche**:
- Prenotazioni per giorno (7g e 30g) — linechart
- Coperti totali per giorno — barchart
- Tasso no-show (rifiutate + cancellate / totale confermabili) — metric card

**Query**: aggregate su `booking_requests` per `tenant_id` + date range
**Hook**: `useBookingTrend(tenantId, range: '7d'|'30d')` in `src/features/booking/hooks/`
**File**: `src/pages/AnalyticsPage.tsx` (da implementare)
**Orizzonte**: 7g e 30g fissi — nessun picker date custom in F1

#### Fase 2 — Menu e clienti

**Metriche aggiuntive**:
- Menu più richiesti — aggregazione su `booking_requests.menu_type`
- Clienti abituali — count prenotazioni per `lower(trim(client_email))`
**Hook**: `useMenuStats(tenantId)`, `useRepeatCustomers(tenantId)`

#### Fase 3 — Export e confronto periodo

**Feature**:
- Export CSV (download client-side da dati già in memoria — nessun edge function necessaria per MVP)
- Confronto periodo precedente: delta % vs settimana/mese precedente
**Note**: picker date custom + range comparison → complessità media

#### Fase 4 — Integrazione Servizio (dopo F2/F3 Servizio)

**Metriche aggiuntive**:
- Occupancy per turno (prenotati / capienza configurata per `service_window`)
- Utilizzo tavoli (prenotazioni per `table_id` dopo assegnazione)
- Confronto capienza configurata vs prenotato
**Prerequisito**: Servizio F2 completato + join `booking_requests` ↔ `tables` / `service_windows`
**Pattern**: preferire viste/RPC Supabase per join pesanti, non logica duplicata client-side

---

## Skill inventory — nessun nuovo skill di task necessario

| TODO | Skill necessari |
|------|-----------------|
| responsive-drawer | APP_CONTEXT + ADMIN_SHELL + UI_EDIT |
| home-dashboard-merge | APP_CONTEXT + ADMIN_SHELL |
| nav-swaps-callbacks | APP_CONTEXT + ADMIN_SHELL |
| docs-context | Nessuno |
| home-spec (implementazione futura) | APP_CONTEXT + ADMIN_SHELL |
| servizio-spec F1/F2 (implementazione futura) | APP_CONTEXT + ADMIN_SHELL |
| servizio-spec F3 drag (implementazione futura) | APP_CONTEXT + ADMIN_SHELL + UI_EDIT |
| analytics-spec (implementazione futura) | APP_CONTEXT + ADMIN_SHELL |

**Conclusione**: i 2 skill esistenti + il nuovo Skill 0 coprono tutti i todo presenti e futuri.
Quando Servizio e Analytics saranno implementati, aggiornare `ADMIN_PAGES_CONTEXT.md` (già supportato dal template).

---

## File già creati (non ricreare)

| File | Stato |
|------|-------|
| `docs/APP_CONTEXT_SKILL.md` | ✅ Creato — Skill 0 già disponibile |

## File da modificare dopo implementazione todo 1–3

| File | Azione |
|------|--------|
| `ADMIN_SHELL_CONTEXT.md` | Aggiornare §1, §4, §5 |
| `ADMIN_PAGES_CONTEXT.md` | Aggiornare §Home, §CRM |
| `APP_CONTEXT_SKILL.md` | Allineare §3 mappa routing |

## Skill esistenti — nessuna modifica necessaria

- `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` — OK
- `docs/per-ui-design/UI_EDIT_SKILL.md` — OK

---

## Design decisions (confermate)

> Nota: questo progetto è enterprise-grade, non limitato a piccoli ristoranti.
> Le feature devono supportare grandi venue, multi-sala, alta capacità.

### Scelte layout

| Pagina | Layout scelto | Note |
|--------|---------------|------|
| Home | Stat cards (2x2 su mobile, 4 colonne su desktop) + lista prenotazioni prossime 3h | Responsive: 2 colonne su mobile se 4 è caotico |
| Servizio F1 | Card grid raggruppate per sala | Enterprise: supportare multi-sala, molti tavoli, alta capienza |
| Analytics F1 | KPI row (3 metric cards) + grafico trend con toggle 7g/30g | |

### Ordine implementazione

1. **Analytics F1** — zero migrazioni, solo query aggregate su `booking_requests` esistente
2. **Home** — query leggere, massimo impatto su ogni login
3. **Servizio F1** — richiede migrazione `007_service_tables.sql`

### Competitor patterns (enterprise)

Fonte: TheFork Manager / Resy / OpenTable — pattern enterprise

- **Home**: pending + coperti + prossime prenotazioni — "inizio turno" operativo
- **Servizio**: floor map drag è standard enterprise (non solo small); CRUD lista come F1, mappa come F3
- **Analytics**: trend + no-show rate come metriche di base universali; in versioni enterprise + confronto periodo, export, occupancy per turno/sala
