# Admin Shell Pages — Context tecnico per sezione

> **Destinazione proposta (post-ok Matteo):** `docs/Admin-Skill/contesto/ADMIN_SHELL_PAGES_CONTEXT.md`  
> **Sostituisce:** `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md`

> Dettaglio **tecnico** (file chiave, query key, anti-pattern, state locale) per ogni sezione shell Pro.  
> Per flussi utente e decisioni prodotto leggere anche i context dominio in `contesto/`:
> `ADMIN_CRM_CONTEXT.md`, `ADMIN_SERVIZIO_CONTEXT.md`, `ADMIN_ANALYTICS_HOME_CONTEXT.md`.  
> Per architettura shell / routing → `ADMIN_SHELL_NAV_CONTEXT.md` + `ADMIN_SHELL_ARCHITECTURE_CONTEXT.md`.

Aggiorna questo file quando aggiungi una pagina shell.

---

## Indice sezioni

- [CRM Clienti](#crm-clienti)
- [Home](#home)
- [Servizio](#servizio)
- [Analytics](#analytics)
- [Template — nuova sezione](#template--nuova-sezione)

---

## CRM Clienti

> **Complemento prodotto:** `contesto/ADMIN_CRM_CONTEXT.md`

**Sezione**: `section === 'crm'` → `<CrmPage />`  
**Stato**: implementato e stabile.

**Accesso UX**: dalla sidebar la voce **Form Pubblico** apre il form prenotazioni pubblico (`/prenota/:slug`). Il CRM resta raggiungibile dal bottone **CRM Clienti** nella nav a griglia / footer quick-nav di `AdminDashboard` (callback `onOpenCrm` dalla shell).

### File chiave

| File | Ruolo |
|------|-------|
| `src/pages/CrmPage.tsx` | Orchestratore: state locale, composizione componenti |
| `src/features/booking/hooks/useCustomers.ts` | Query + `mergeProfiles()` + `CRM_QUERY_KEY` |
| `src/features/booking/hooks/useCustomerMutations.ts` | `useCreateCustomer`, `useUpdateCustomer`, `useDeleteCustomer` |
| `src/lib/customerEmail.ts` | `normalizeCustomerEmail()` — usare SEMPRE per email |
| `src/types/customer.ts` | `CustomerProfile`, `CustomerDbSource`, `CustomerProfileSource` |
| `src/types/database.ts` | Tipi Supabase generati — verificare colonne UUID prima di mutazioni |
| `supabase/migrations/006_customers_crm.sql` | Schema `customers`, trigger, vincoli |
| `src/features/booking/components/crm/CustomerDeleteConfirm.tsx` | Modal conferma eliminazione |

### Architettura dati

Due sorgenti → un profilo unificato tramite `mergeProfiles()`:

```
booking_requests (clienti che hanno prenotato)  ──┐
                                                   ├── mergeProfiles() → CustomerProfile[]
customers table  (source: 'manual' | 'synced')  ──┘
```

Aggregazione: `lower(trim(client_email))`.

| Condizione | `CustomerProfile.source` | Badge "Manuale" |
|-----------|--------------------------|-----------------|
| ≥ 1 booking | `'booking'` | No |
| 0 booking, customers `source='manual'` | `'manual'` | **Sì** |
| 0 booking, customers `source='synced'` | `'manual'` | No |

### Regole critiche CRM

**Email — normalizzare sempre:**
```typescript
// ✅ corretto — usare prima di confronto o scrittura
normalizeCustomerEmail(raw)  // trim().toLowerCase(), ritorna null se vuota

// ❌ case-sensitive, non gestisce spazi
if (booking.client_email === customerEmail) ...
```

**`CRM_QUERY_KEY` — unica sorgente:**
```typescript
// useCustomers.ts — unica dichiarazione
export const CRM_QUERY_KEY = 'crm-customer-profiles'

// useCustomerMutations.ts — importato, MAI ridichiarato
import { CRM_QUERY_KEY } from './useCustomers'
```
Qualsiasi hook che invalida la query CRM deve **importare** `CRM_QUERY_KEY`, non ridichiararlo.

**UUID vs email — BUG documentato (commit 84d49d2):**
```typescript
// ❌ BUG CRITICO — cancelled_by è UUID in DB, non stringa
deleteCustomer.mutate({ adminEmail: user?.email })  // "admin@x.com" non è UUID

// ✅ corretto
deleteCustomer.mutate({ adminId: user?.id })  // UUID Supabase Auth

// REGOLA GENERALE: quando passi un campo UUID a Supabase, verifica sempre che
// il valore sia auth.users.id (UUID), NON email o username.
// TypeScript non ti protegge: database.ts tipizza UUID come string | null.
```

### State locale CrmPage

Prima di modificare `CrmPage.tsx`, mappare questi stati:
- `selected` — cliente selezionato (apre CustomerDetailPanel)
- `panelOpen` — visibilità pannello dettaglio
- `formOpen` — visibilità form crea/modifica cliente
- `deleteTarget` — cliente da eliminare (apre CustomerDeleteConfirm)

### Anti-pattern specifici CRM

```typescript
// ❌ ridichiarare CRM_QUERY_KEY
const CRM_QUERY_KEY = 'crm-customer-profiles'  // duplica silenziosamente

// ❌ confronto email senza normalize
customer.email === searchTerm  // case-sensitive, manca trim

// ❌ passare email a campo UUID
{ cancelled_by: user.email }   // Postgres: "invalid input syntax for type uuid"
```

---

## Home

> **Complemento prodotto:** `contesto/ADMIN_ANALYTICS_HOME_CONTEXT.md` §1

**Sezione**: `section === 'home'` → `<AdminHomePage />` (default all'ingresso `/admin` se `features.home`).  
`section === 'prenotazioni'` → `<AdminDashboard />` (montata anche dal pulsante Calendario nella Home).  
**Stato**: implementato — quick-nav + KPI del giorno + lista prossime prenotazioni (3h).

### File chiave

| File | Ruolo |
|------|-------|
| `src/pages/AdminHomePage.tsx` | Home riassuntiva: quick-nav (Servizio se abilitato, walk-in, briefing), 3 stat card, lista prossime 3h |
| `src/features/booking/hooks/useHomeStats.ts` | Query TanStack su `booking_requests`, `HOME_STATS_QUERY_KEY`, calcolo lato client |
| `src/pages/AdminDashboard.tsx` | Vista operativa montata da `section === 'prenotazioni'` |

### Architettura dati

- `useHomeStats` legge `booking_requests` (status, num_guests, desired_date, desired_time, confirmed_start, confirmed_end, client_name) con il client `supabase` autenticato.
- Filtro DB: `tenant_id = tenantId`, `status in ('pending','accepted')` — `rejected`/`deleted` esclusi a monte.
- **Data evento**: `confirmed_start` (porzione data, estratta senza conversione fuso) per accepted; `desired_date` per pending.
- KPI di oggi:
  - **Prenotazioni oggi**: pending + accepted con data evento = oggi.
  - **Coperti confermati**: somma `num_guests` per accepted con data evento = oggi.
  - **In attesa di conferma**: pending con `desired_date` = oggi.
- **Prossime 3 ore**: accepted con `confirmed_start ∈ [now, now+3h]`, ordinate cronologicamente.
- `staleTime: 2 * 60 * 1000` (più frequente di Analytics: la Home è operativa).

### Regole critiche Home

- Per estrarre la data da `confirmed_start` (ISO con TZ) usare il regex `(\d{4})-(\d{2})-(\d{2})` — coerente con `useBookingStats`, evita drift di fuso.
- La sidebar mantiene il bottone **Home** attivo sia su `section === 'home'` che `section === 'prenotazioni'` (logica `activeSidebarItem === 'home' || (!activeSidebarItem && (section === 'home' || section === 'prenotazioni'))`).
- Le callback verso CRM e Servizio sono passate da `AdminShell` come prop `onOpenCrm` / `onOpenServizio` su `AdminHomePage` (montata con `bodyOverride`). Per aprire Prenotazioni/Calendario si usano i NavItem nell'header (`onBodyOverrideExit` / navigate).

### Note

- **Impostazioni** non è una sezione shell Pro: resta una tab di `AdminDashboard`
  (`/admin/impostazioni`). Il vecchio ponte `restaurantSettingsSignal` / `open-settings` è stato
  rimosso.

---

## Servizio

> **Complemento prodotto:** `contesto/ADMIN_SERVIZIO_CONTEXT.md`  
> **RULE APP_CONTEXT §4:** dettaglio autoritativo fasce / override / assegnazioni / quick assign Calendario.

**Sezione**: `section === 'servizio'` → `<ServizioPage />`  
**Stato**: implementato — CRUD tavoli per sala + fasce orarie con modifiche a tempo (override) + assegnazione tavoli con filtro prenotazioni per fascia. Vedi sottosezioni dedicate sotto gli anti-pattern.

### File chiave

| File | Ruolo |
|------|-------|
| `src/pages/ServizioPage.tsx` | Orchestratore: lista tavoli per sala, modal add/edit, conferma delete |
| `src/features/booking/hooks/useServizioTables.ts` | `useTables`, `useCreateTable`, `useUpdateTable`, `useDeleteTable`, `TABLES_QUERY_KEY` |
| `src/features/booking/components/servizio/TableFormModal.tsx` | Modal form aggiungi/modifica tavolo |
| `supabase/migrations/007_tables.sql` | Schema tabella `tables`, trigger, RLS |

### Architettura dati

- **Sale**: lette da `restaurant_settings` tramite `useRestaurantSetting('booking_placement_areas')` — array di stringhe. Nessuna tabella separata.
- **Tavoli**: tabella `tables` con `id, tenant_id, name, capacity, placement (text), active (bool), created_at, updated_at`.
- **Soft delete**: `useDeleteTable()` imposta `active = false`; `useTables()` filtra solo `active = true`.
- **Ordinamento**: per `placement` ASC poi `name` ASC.
- **staleTime**: 5 minuti.

```
restaurant_settings (booking_placement_areas) → lista sale [string[]]
tables (active=true, tenant_id)               → RestaurantTable[]
```

### Regole critiche Servizio

- `TABLES_QUERY_KEY = 'servizio-tables'` — dichiarato in `useServizioTables.ts`, importato da chiunque lo invalida.
- La tabella `tables` non è ancora in `src/types/database.ts` (richiede `npm run db:types:linked` dopo `supabase db push`). Le query usano `(supabase.from('tables') as any)` per bypassare il typecheck fino alla rigenerazione.
- Non costruire classi dinamiche nelle TableCard: usare solo classi letterali statiche Tailwind.

### State locale ServizioPage

- `modal: { open, initial, defaultPlacement }` — controlla apertura modal e pre-compilazione.
- `confirmDelete` — stato locale dentro `TableCard` (non in ServizioPage).

### Anti-pattern specifici Servizio

```typescript
// ❌ non rigenerare database.ts manualmente — usare npm run db:types:linked
// ❌ non mischiare supabase ↔ supabasePublic nelle query tavoli
// ❌ non costruire classi dinamiche: `bg-${color}-600` non genera CSS con JIT
```

### Fasce orarie + modifiche a tempo (override)

Sottosezione Servizio separata dai tavoli. Una fascia (`service_slots`) può
avere **modifiche a tempo**: turni/coperti diversi per un intervallo di date,
poi ritorno automatico ai valori base (nessun job — risoluzione runtime).

| File | Ruolo |
|------|-------|
| `src/features/booking/components/servizio/ServiceSlotsManager.tsx` | Lista fasce, modal CRUD (`FormInfoToggle` + `FormInfoPanel` con ✕), menu durata, card override |
| `src/features/booking/hooks/useServiceSlots.ts` | CRUD fasce base + `update_service_slot` (RPC jsonb) |
| `src/features/booking/hooks/useServiceSlotOverrides.ts` | Override: query/create/delete + helper di risoluzione |
| `supabase/migrations/022_service_slot_overrides.sql` | Tabella `service_slot_overrides`, RLS, RPC insert |
| `supabase/migrations/023_service_slots_max_turns_resume.sql` | Colonna `max_turns_resume` + RPC `update_service_slot` estesa |

Regole chiave:
- Menu durata (pulsante con icona calendario + etichetta scope, es. **Sempre**): scope `forever` → **solo** `service_slots` (impostazioni base permanenti; **non** crea override né conta tra le «Modifiche a tempo») · *Solo oggi* · *Questa settimana* · *Fino a fine mese* · *Scegli i giorni* (ognuno = riga in `service_slot_overrides`). In modifica con `forever`: riga «Tipo di salvataggio» + `FormInfoToggle` → `FormInfoPanel` blu (copy scadenza modifiche; chiusura ✕). Campo coperti: stesso pattern dopo «fascia» (rifiuto automatico oltre limite).
- Sovrapposizioni: **vince il più specifico** (`resolveSlotOverride`, intervallo più corto; a parità il più recente) — stessa regola usata dal capacity check clienti.
- Una fascia con override attivi si rende come `CollapsibleCard` (LOCKED — solo uso); senza override resta una riga semplice. **Header card**: titolo in `h3`; subtitle con orario e riga «N Modifiche a tempo»; badge `ActiveTodayBadge` («Attiva oggi», solo verde) se oggi vince un override — centrato su `sm+`, inline nel subtitle su mobile; `SlotControls` a destra.
- Vincolo: **un solo override per tipo a intervallo** (today/week/month) per fascia, validato nel form; `custom` blocca solo i singoli giorni già coperti.
- **Chiusura servizio** (`SlotControls`): pulsante ✕ imposta `max_turns = 0` (nessun tavolo/turno, come prima); valore precedente in `max_turns_resume` (migrazione 023); riapertura con icona ↺. Riga/card con `opacity-55` + badge «Servizio chiuso». Non usare `0` nel campo turni del form.
- Helper: `isServiceSlotClosed(slot)` → `max_turns === 0`.
- **Orario notturno** (`end_time < start_time`, `slotCrossesMidnight`): copy unico `OVERNIGHT_TIME_END_HINT` in `bookingTimeSlots.ts`. Mostrato nel **modal** nuova/modifica fascia; **non** in lista righe (`SlotRow` mostra solo `HH:mm → HH:mm`, senza `(notturna +1)`). Edition Classic: stesso avviso anche in Impostazioni → «Imposta Fasce Orarie» (`RestaurantSettingsTab`, `!features.servizio`).
- Migrazioni **022** e **023** applicate SOLO sul server di test (`docnnernvp`), non a produzione — vedi DB_SKILL / APP_CONTEXT_SKILL §1b.
- **Divieto di fasce accavallate (S4-FIX-6, 02-08-26):** il salvataggio del ramo «valore base» in
  `ServiceSlotsManager` confronta la fascia con tutte le altre esistenti (esclusa se stessa in modifica)
  tramite `slotRangesOverlap` (`bookingTimeSlots.ts` — la stessa funzione già usata da Impostazioni →
  Imposta Fasce Orarie via `validateSlotConfigs`, nessuna logica duplicata). Fasce adiacenti (fine
  dell'una = inizio dell'altra) restano ammesse. Solo controllo lato app: nessuna migrazione, nessun
  vincolo DB. Test: `serviceSlots.sovrapposizione.test.tsx`.

### Assegnazione tavoli (drag-and-drop)

Sottosezione nella tab **Mappa** di `ServizioPage` (sotto `TableMap`). Il ristoratore sceglie **data** + **fascia oraria**; a sinistra compaiono solo le prenotazioni **accettate** del giorno la cui **ora di inizio** rientra in `start_time`–`end_time` della fascia; a destra i tavoli per sala con drop-zone e stati libero/occupato/liberato.

| File | Ruolo |
|------|-------|
| `src/features/booking/components/servizio/AssignmentMapPanel.tsx` | UI: select data/fascia, lista prenotazioni, mappa tavoli (`@dnd-kit`) |
| `src/features/booking/hooks/useTableAssignments.ts` | `useTableAssignments`, `useUnassignedBookings`, `useAssignBookingToTable`, `useCheckoutTable`, `getTableStatus` |
| `src/features/booking/utils/serviceSlotBookingFilter.ts` | `bookingStartsInServiceSlot` — filtro per ora di inizio nella fascia |
| `src/features/booking/hooks/useServiceSlots.ts` | Fasce nel select (`useServiceSlots`) |

**Dati**

- Fasce: `service_slots` (`id`, `name`, `start_time`, `end_time`, `max_turns`).
- Prenotazioni: `booking_requests` (`status = accepted`, `confirmed_start` / `desired_date`, `desired_time`).
- Assegnazioni: `booking_table_assignments` (`booking_id`, `table_id`, `service_slot_id`, `date`, `turn_number`, `checked_out_at`).

**`useUnassignedBookings(date, slot | null)`** — `slot` = `Pick<ServiceSlot, 'id' | 'start_time' | 'end_time'>`. Filtri in ordine:

1. accettate per tenant;
2. data (`confirmed_start` o `desired_date`);
3. **`bookingStartsInServiceSlot`** — `getAccurateStartTime` + `isTimeInsideSlot` (fasce notturne incluse); senza orario → esclusa;
4. non già assegnate a un tavolo per quello `service_slot_id` + `date` con `checked_out_at` null.

Query key: `[TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, date, slotId, 'unassigned']` (`TABLE_ASSIGNMENTS_QUERY_KEY = 'table_assignments'`).

**Regole**

- Solo **ora di inizio** nella fascia (non overlap con `confirmed_end`) — allineato a `getStartSlotForBooking` / capacity.
- Orari fascia letti dalla riga `service_slots` caricata da `useServiceSlots()` — **non** da `resolveSlotOverride` (override turni/coperti del giorno: gap noto, vedi report 16-05-26).
- `max_turns === 0` (servizio chiuso): assegnazione già bloccata in mutation; UI invariata.
- Query Servizio con cache fresca: gli hook assignment/unassigned refetchano al mount e le mutation booking
  condivise invalidano `TABLE_ASSIGNMENTS_QUERY_KEY`, così il ritorno da Calendario/Prenotazioni mostra le
  booking appena accettate senza reload.
- **`Libera tavolo`** (`useCheckoutTable`): la prenotazione del turno liberato **torna** nell'elenco sinistro
  (non più in `assigned` con `checked_out_at` null). S4 è append-only: la riga in
  `booking_table_assignments` viene timbrata con `checked_out_at`, mai cancellata fisicamente. Se c'è
  turno 2+ in attesa, il tavolo passa al turno successivo; altrimenti torna verde «Libero». Helper:
  `hasWaitingNextTurnOnTable` (`tableCheckout.ts`). Dopo successo: `refetchQueries` su assignments +
  unassigned.
- **Card tavolo occupato** (`DroppableTable`): renderizza tutte le assegnazioni attive del tavolo, ordinate per turno; ogni blocco mostra `client_name, num_guests` e sotto orario `HH:mm` da `getAccurateStartTime` (`dateUtils`). Lookup: `useAcceptedBookingsForDate(date)` + mappa `booking_id` dagli assignment attivi.
- **Tavoli occupati — sostituzione guidata (S4-FIX-5, 02-08-26):** visibili ma non assegnabili/droppable
  finché l'admin non sceglie cosa fare di chi c'è già. Nessuna sovrapposizione diretta da drag: drop/click
  su occupato apre un riquadro con **tre esiti** per la prenotazione scavalcata (`useForceReplaceBookingOnTable`,
  parametro `outcome: 'move' | 'archive' | 'requeue'`), scelti dallo staff — nessuno preselezionato:
  - **`move`** — si sposta su un altro tavolo libero (scelto in una griglia che riusa lo stile della modale
    «Assegna tavolo»): **insert** sul tavolo di destinazione → **delete** della riga sul tavolo conteso →
    insert della prenotazione nuova. Il tavolo conteso non registra un turno per la sosta scavalcata;
    `served_at` del trasferito non viene toccato.
  - **`archive`** — il pasto è finito: `checked_out_at` sulla riga (turno consumato) + `served_at` se non
    restano altri tavoli attivi sulla stessa prenotazione (tavolata multi-tavolo).
  - **`requeue`** — torna tra le prenotazioni da assegnare: **DELETE** fisico della riga (stesso principio
    di `useUndoTableAssignment`), non un `UPDATE checked_out_at` come prima di questo fix — non consuma un
    turno. Comportamento pre-FIX-5 dell'unica scelta «Libera e assegna».
  In tutti i casi la nuova prenotazione entra con `forced_by_admin`/`force_reason`. Test:
  `useTableAssignments.sostituzioneGuidata.test.ts`, `AssignmentMapPanel.sostituzioneGuidata.test.tsx`.
- **Aggiornamento operativo:** `useAcceptedBookingsForDate`, `useTableAssignments` e `useUnassignedBookings`
  hanno polling leggero 15s (`SERVICE_ASSIGNMENTS_REFETCH_INTERVAL_MS`) per tenere allineate due schede
  aperte senza realtime/S4-LIVE.
- **UX A3:** il select fascia mostra `N` prenotazioni da assegnare; la card prenotazione ha drag con anteprima
  nome+coperti e bottone `Assegna` per modal rapida sala/tavolo; dopo assegnazione compare undo/conferma.
  Undo = update append-only `checked_out_at`, non delete.
- Filtro elenco estratto in `unassignedBookingsFilter.ts` (`filterUnassignedBookingsForSlot`, `activeAssignedBookingIds`).
- Test: `serviceSlotBookingFilter.test.ts`, `unassignedBookingsFilter.test.ts`, `tableCheckout.test.ts`.

**Walk-in da Home**

- Se l'admin sceglie un tavolo libero nella fascia attiva, `useWalkInMutation` crea booking + riga
  `booking_table_assignments` e invalida booking/assignment/unassigned.
- Se non c'è fascia attiva o se `max_turns` è già esaurito senza conferma, non crea assignment parziale.
  Se il tavolo è occupato, la option resta selezionabile ma richiede conferma guidata in due passaggi:
  avviso stabile, poi release append-only della prenotazione in corso + nuovo assignment forzato.
- Il fallback anti-parziale è logico: booking marcato `deleted` se l'insert assignment fallisce. Non esiste
  ancora RPC transazionale dedicata.

**Accesso rapido da Calendario**

L'assegnazione/riassegnazione è raggiungibile dalla **pagina Calendario** tramite `QuickTableAssignModal`. Funziona solo se `hasTurnsFeature = features.servizio && serviceSlots.length > 0`.

- Ogni card digest mostra un **pallino** (2.5×2.5) in alto a destra: verde (`bg-(--color-status-accepted)`) = già assegnato; grigio (`bg-primary-300`) = libero. Il pallino non appare in edition Classic senza servizio.
- Click pallino **grigio** → `QuickTableAssignModal` `mode='assign'` (sala → tavolo → `useAssignBookingToTable`).
- Click pallino **verde** → `QuickTableAssignModal` `mode='reassign'`: mostra dialog di conferma con tavolo attuale, poi chiama `useReleaseBookingAssignment` (libera l'assignment per `booking_id` specifico — non per tavolo come `useCheckoutTable`), infine flusso sala/tavolo identico all'assign.
- **Caso turni in coda** (provvisorio): se `hasWaitingNextTurnOnTable` → `useReleaseBookingAssignment` ritorna `{ blocked: 'waiting_next_turn' }` senza modificare DB; il modal mostra avviso «gestisci da Servizio → Mappa». Logica definitiva pianificata in sessione futura.
- `QuickTableAssignModal` riceve `mode` dal Calendario (derivato da `assignedBookingIds`) e non ha più la prop `serviceSlots` (usa `useServiceSlots()` interno).
- `QuickTableAssignModal` deriva `slotId` automaticamente da `bookingStartsInServiceSlot` — nessuna scelta fascia. Se l'orario non ricade in nessuna fascia, mostra avviso testuale.
- File: `src/features/booking/components/QuickTableAssignModal.tsx`.
- Query key condivisa: `TABLE_ASSIGNMENTS_QUERY_KEY` — dopo assegnazione/riassegnazione, anche `ServizioPage → AssignmentMapPanel` si aggiorna.

---

## Analytics

> **Complemento prodotto:** `contesto/ADMIN_ANALYTICS_HOME_CONTEXT.md` §2+

**Sezione**: `section === 'analytics'` → `<AnalyticsPage />`  
**Stato**: implementato (F1 — KPI + trend su `booking_requests`, range 7g/30g).

### File chiave

| File | Ruolo |
|------|-------|
| `src/pages/AnalyticsPage.tsx` | Orchestratore: toggle range, KPI, trend, empty/loading |
| `src/features/booking/hooks/useAnalytics.ts` | Query TanStack su `booking_requests`, `ANALYTICS_QUERY_KEY`, aggregazioni lato client |
| `src/features/booking/components/analytics/AnalyticsKpiCard.tsx` | Card KPI riusabile |
| `src/features/booking/components/analytics/AnalyticsTrendChart.tsx` | Grafico a barre (Recharts), solo dati normalizzati `AnalyticsTrendPoint[]` |

### Contenuto F1

- Tre KPI: prenotazioni totali, coperti totali, tasso conferma (`accepted` / totali × 100, esclusi `deleted`).
- Trend giornaliero: prenotazioni e coperti per giorno (calendario), giorni senza dati a zero; grafico Recharts dietro layer dedicato.
- Toggle **7g** / **30g** (stato locale in pagina). No-show e metriche avanzate: fasi successive.

### Note

- Dati da `booking_requests` (`status`, `num_guests`, `created_at`) con client `supabase` autenticato; nessuna migrazione dedicata.
- Per volumi molto alti valutare in futuro RPC/aggregazioni lato Supabase.

---

## Template — nuova sezione

Quando aggiungi una nuova pagina, copia questo blocco, sostituisci i placeholder e
rimuovi le note template.

```markdown
## [Nome sezione]

**Sezione**: `section === '[slug]'` → `<[Nome]Page />`  
**Stato**: [placeholder | in sviluppo | stabile]

### File chiave

| File | Ruolo |
|------|-------|
| `src/pages/[Nome]Page.tsx` | Entry point |
| `src/features/booking/hooks/use[Nome].ts` | Query dati |
| `src/features/booking/hooks/use[Nome]Mutations.ts` | Mutazioni (se presenti) |
| `src/types/[nome].ts` | Tipi specifici (se necessari) |
| `supabase/migrations/00N_[nome].sql` | Schema DB (se necessario) |

### Architettura dati

[Descrivi sorgenti dati, aggregazioni, tipi principali]

### Regole critiche

[Vincoli tecnici non ovvi: UUID, normalizzazioni, query key, trigger DB]

### State locale [Nome]Page

[Mappa gli stati React locali prima di modificare la pagina]

### Anti-pattern specifici

[Errori già commessi o prevedibili per questa sezione]
```

**Ricorda**: dopo aver aggiunto la sezione qui, aggiorna anche:
- tabella step 0 in `docs/Admin-Skill/ADMIN_SHELL_SKILL.md`;
- riga in `docs/Admin-Skill/ADMIN_SKILL.md` §7;
- route in `ADMIN_SHELL_NAV_CONTEXT.md` §1 se serve URL dedicato.
