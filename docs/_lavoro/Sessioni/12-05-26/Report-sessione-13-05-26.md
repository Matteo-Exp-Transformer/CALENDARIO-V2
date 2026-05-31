# Report sessione — 13 maggio 2026

## Obiettivo della sessione

Pianificazione delle tre pagine admin mancanti di CalendarBackup-v2:
- **Analytics F1** (prima)
- **Home** (seconda)
- **Servizio F1** (terza)

Prodotto finale: tre prompt eseguibili da agente, uno per fase.

---

## Contesto di partenza

Stack: React 18 + Vite + TypeScript + Tailwind CSS v4 + Supabase + TanStack Query.
Routing admin state-based in `AdminShell.tsx` (nessun cambio URL).

Pagine già stabili: AdminDashboard (calendario, pending, archivio, menu, impostazioni), CrmPage.

Pagine placeholder da implementare: `AnalyticsPage`, `AdminHomePage`, `ServizioPage`.

---

## Decisioni prese per Analytics F1

| Punto | Decisione |
|-------|-----------|
| Libreria grafici | Recharts — con abstraction layer (dati normalizzati → adapter) per permettere cambio futuro senza toccare i componenti parent |
| Empty state | Messaggio testuale se nessun dato nel periodo. Nessun grafico vuoto. |
| No-show | Escluso da F1. Sarà un'azione admin futura nel pannello prenotazione (pulsante "No show" da aggiungere separatamente). La 3ª KPI diventa "Tasso conferma" (approvate / totali × 100). |
| 3 KPI card | Prenotazioni totali, Coperti totali, Tasso conferma |
| Toggle range | 7 giorni / 30 giorni — stato locale in AnalyticsPage |
| Query | Su `booking_requests` filtrata per `tenant_id` + `created_at >= startDate`, calcolo lato client |

**File prodotti dal prompt Analytics:**
- `src/features/booking/hooks/useAnalytics.ts` (nuovo)
- `src/features/booking/components/analytics/AnalyticsKpiCard.tsx` (nuovo)
- `src/features/booking/components/analytics/AnalyticsTrendChart.tsx` (nuovo — wrappa Recharts)
- `src/pages/AnalyticsPage.tsx` (riscrittura placeholder)
- `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` (aggiornamento sezione Analytics)

---

## Decisioni prese per Home

| Punto | Decisione |
|-------|-----------|
| Routing | `section='home'` → `<AdminHomePage />`, `section='prenotazioni'` → `<AdminDashboard />`. I due casi vengono separati in AdminShell. |
| Contenuto | Quick-nav buttons (CRM, Servizio, Calendario) + 3 stat cards (prenotazioni oggi, coperti confermati oggi, pending) + lista prossime prenotazioni (next 3h) |
| Props | AdminHomePage riceve `onOpenPrenotazioni`, `onOpenCrm`, `onOpenServizio` dalla shell |
| Active state sidebar | Il pulsante Home resta evidenziato sia per `section='home'` che `'prenotazioni'` — logica invariata |
| Layout stat cards | 2 colonne mobile / 3 colonne desktop |

**File prodotti dal prompt Home:**
- `src/features/booking/hooks/useHomeStats.ts` (nuovo)
- `src/pages/AdminHomePage.tsx` (riscrittura placeholder)
- `src/components/layout/AdminShell.tsx` (modifiche chirurgiche — separazione sezioni)
- `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` (aggiornamento sezione Home)

---

## Decisioni prese per Servizio F1

| Punto | Decisione |
|-------|-----------|
| Migrazione | `007_service_tables.sql` — tabella `tables` con: id, tenant_id, name, capacity, room, position_x, position_y, created_at |
| F1 scope | CRUD lista tavoli raggruppati per sala. No mappa drag (F3). No turni (F2). |
| Raggruppamento | Per campo `room` ASC, poi `name` ASC. NULL room → etichetta "Sala principale" |
| Grid | 2 col mobile / 3 col md / 4 col lg (supporto enterprise con molti tavoli) |
| Raggruppamento visivo | Header testuale per sala — NON CollapsibleCard (LOCK) |
| position_x / position_y | Presenti nello schema ma non esposti in F1. Riservati a F3 (mappa drag con react-konva) |
| Procedura | 1) push migrazione → 2) rigenera tipi → 3) implementa pagina |

**Roadmap Servizio dichiarata:**
- F1: CRUD lista tavoli
- F2: turni pranzo/cena
- F3: mappa sala drag (react-konva)

**File prodotti dal prompt Servizio:**
- `supabase/migrations/007_service_tables.sql` (nuovo)
- `src/features/booking/hooks/useServiceTables.ts` (nuovo)
- `src/features/booking/hooks/useServiceTableMutations.ts` (nuovo)
- `src/features/booking/components/servizio/TableCard.tsx` (nuovo)
- `src/features/booking/components/servizio/TableFormModal.tsx` (nuovo)
- `src/features/booking/components/servizio/TableDeleteConfirm.tsx` (nuovo)
- `src/pages/ServizioPage.tsx` (riscrittura placeholder)
- `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` (aggiornamento sezione Servizio)

---

## Nota sul no-show

Il no-show non è un dato già presente in DB. Sarà implementato come azione admin:
- Nel pannello laterale di dettaglio prenotazione, aggiungere pulsante "Il tavolo non è arrivato"
- Click → aggiorna `booking_requests.status` (o campo dedicato) a `'no_show'`
- Analytics F2/F3 potrà poi calcolare il tasso no-show reale

Questa feature non è inclusa nei tre prompt correnti. Va pianificata separatamente.

---

## Ordine di esecuzione raccomandato

1. **Analytics F1** — zero migrazioni, zero tocchi a LOCK, isola bene recharts
2. **Home** — modifica chirurgica AdminShell + nuovo hook + riscrittura AdminHomePage
3. **Servizio F1** — richiede push migrazione + rigenera tipi prima di scrivere il codice

---

## Invarianti globali confermate (valide per tutti e tre i prompt)

- LOCK: `CollapsibleCard.tsx`, `Modal.tsx`, `TenantContext.tsx`, `supabase.ts`, `supabase/migrations/001–006`, `router.tsx`
- Classi Tailwind solo letterali statiche — mai interpolazione dinamica
- `cn()` da `@/lib/utils`
- Tailwind v4 `!important`: suffisso `border-red-500!` (non `!border-red-500`)
- Logger: `logger.debug/info/warn/error` da `src/lib/logger.ts` — mai `console.log`
- Due client Supabase: `supabase` per admin autenticato, `supabasePublic` per form pubblici — non mischiare
- `QUERY_KEY` per ogni feature: dichiarato una volta nell'hook query, importato nelle mutazioni — mai ridichiarare
