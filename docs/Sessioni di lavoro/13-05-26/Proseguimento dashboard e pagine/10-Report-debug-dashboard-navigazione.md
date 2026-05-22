# Report — Debug dashboard, navigazione e analytics

**Data sessione**: 2026-05-13 / 2026-05-14
**Branch**: `Sviluppo-Dashboard-laterale`
**Stato finale**: typecheck ✓ · lint ✓

---

## Scope della sessione

Sessione di debug e rifinitura su lavoro prodotto da agente precedente (report 09).
Tre aree principali: navigazione dashboard bloccata, pulsante impostazioni, analytics shift.
Poi refactor architetturale della sezione Home per eliminare il bug alla radice.

---

## Bug corretti

### 1. Navigazione header bloccata su Home — `AdminDashboard.tsx`

**Causa**: `useEffect` di sincronizzazione `initialSection → activeTab` aveva `activeTab` nelle
dipendenze. Ogni click su un tab (es. "Archivio") → `activeTab` cambiava → effect girava di nuovo →
`initialSection` era ancora `'home'` → effect rimetteva `activeTab = 'home'`. Loop.

**Fix iniziale**: spostato `activeTab` in un ref (`activeTabRef`), rimosso dalla dep array.

**Fix definitivo** (vedi §4): problema eliminato alla radice con refactor architetturale.

---

### 2. Errore Recharts `width/height -1` — `AnalyticsTrendChart.tsx`

**Causa**: `ResponsiveContainer height="100%"` non riesce a misurare l'altezza al primo render
quando il contenitore è in `overflow: hidden`. Recharts restituisce -1 e logga un warning.

**Fix**: sostituito `height="100%"` con `height={280}` fisso (stesso pattern di `BookedByChart`).
Rimossa classe `h-80` dal div contenitore (non più necessaria con altezza fissa).

---

### 3. "Impostazioni locale" sparita dalla sidebar

**Causa**: il report 09 documentava la rimozione della voce "Impostazioni" dalla sidebar (task A),
ma il pulsante non era stato riposizionato.

**Soluzione finale**: aggiunto "Impostazioni locale" come **5° tab nell'header dashboard** (nav
`grid-cols-3 sm:grid-cols-5`), con icona `Store` e label mobile "Impost.". La voce nella sidebar
è stata definitivamente rimossa — l'header dashboard è l'unico punto di accesso.

---

### 4. Discrepanza conteggio analytics pranzo/cena vs tutti

**Causa**: filtro shift in `computeAnalytics` aveva la guardia `if (shift !== 'all' && r.confirmed_start)`.
Le prenotazioni **senza `confirmed_start`** passavano il filtro anche con shift=pranzo/cena — non
classificabili per turno, ma contate ugualmente. Risultato: pranzo(4) + cena(18) = 22 ≠ tutti(25).

**Fix**: se `shift !== 'all'` e `confirmed_start` è null → prenotazione esclusa.
`pranzo + cena ≤ tutti` è il comportamento atteso: le prenotazioni senza orario confermato
compaiono solo in "Tutti".

---

### 5. Home rimane evidenziata in sidebar dopo click tab interni — refactor architetturale

**Causa originale**: `activeSidebarItem = null` non bastava perché la condizione di highlight
di Home controllava anche `!activeSidebarItem && section === 'home'`, che rimaneva vera.

**Fix intermedio**: introdotto valore sentinella `'dashboard-tab'` in `SidebarActiveItem`;
`onInternalTabChange` callback da `AdminDashboard` verso `AdminShell`.

**Problema residuo**: dopo il refactor intermedio, recliccare Home dalla sidebar non aggiornava
la vista perché `section` era già `'home'` — React non ri-renderizzava, l'`useEffect` non scattava.

**Fix definitivo — refactor architetturale**:
- Home diventa **sezione di primo livello** in `AdminShell`, montata come `<AdminHomePage>`
  direttamente (identico a CRM, Servizio, Analytics)
- `AdminDashboard` è ora puramente operativo: parte sempre su `'calendar'`, nessuna prop
  `initialSection`, nessun `useEffect` di sync, nessun tab `'home'`
- Rimossi da `AdminDashboard`: tipo `'home'` dal `Tab`, prop `initialSection`,
  `onInternalTabChange`, i tre `useEffect` di sincronizzazione, `onOpenServizio`, `onOpenCrm`
- Rimosso da `AdminShell`: `dashboardShellProps` — sostituito con helper `openSection(section, sidebarItem)`

---

## Funzionalità nuove

### Navigator periodo in Analytics — `AnalyticsPage.tsx` + `useAnalytics.ts`

**Richiesta**: barra con frecce ← → e label del periodo corrente (settimana/mese/anno) per
navigare nei periodi passati senza cambiare vista.

**Implementazione**:
- Stato `offset: number` in `AnalyticsPage` (0 = corrente, -1 = precedente, ecc.)
- Freccia destra disabilitata quando `offset >= 0` (no futuro)
- Cambio range resetta `offset = 0`
- Label in italiano via `date-fns/locale/it`: "21 mag – 27 mag", "maggio 2026", "2025"
- `useAnalytics` e `useAnalyticsComparison` accettano ora `offset`; incluso nella query key
  per invalidazione cache corretta
- `computeOccupancyRate` aggiornata per usare il periodo navigato (non più hardcoded "ora")
- Esportata `getPeriodBounds(range, offset)` per calcoli esterni
- Aggiunto `.lte('created_at', endDay)` alla query Supabase (mancava nel periodo corrente)

---

### Pulsante X — chiusura sezioni sidebar

**Richiesta**: pulsante per tornare alla dashboard con header e tab dalle sezioni aperte da sidebar
(Home, CRM, Servizio, Analytics).

**Implementazione**: barra in flusso normale (`flex justify-end px-3 pt-3`) sopra il contenuto
di ogni sezione sidebar. Non `absolute` — spinge il contenuto fisicamente in basso, evitando
sovrapposizioni con pulsanti interni alle pagine. Click → `openSection('prenotazioni', null)`.
Stile coerente al tema: `bg-surface border-(--color-border) hover:bg-primary-50`.

---

## File modificati

| File | Modifiche |
|------|-----------|
| `src/components/layout/AdminShell.tsx` | Refactor Home come sezione di primo livello; `openSection()` helper; pulsante X in flusso; import `AdminHomePage`, `X` |
| `src/pages/AdminDashboard.tsx` | Rimossi `'home'` tab, `initialSection`, `onInternalTabChange`, `onOpenServizio`, `onOpenCrm`, 3 useEffect sync; `Store` 5° tab header; griglia `sm:grid-cols-5` |
| `src/pages/AnalyticsPage.tsx` | Navigator periodo con `offset`, frecce, label italiana, `handleRangeChange` con reset offset |
| `src/features/booking/hooks/useAnalytics.ts` | `getPeriodBounds(range, offset)` esportata; `getPreviousPeriodBounds` usa offset; `useAnalytics`/`useAnalyticsComparison` accettano offset; fix filtro shift senza `confirmed_start`; fix `.lte` query |
| `src/features/booking/components/analytics/AnalyticsTrendChart.tsx` | `height={280}` fisso invece di `"100%"` |
| `src/pages/AdminHomePage.tsx` | Invariata come componente — ora montata da `AdminShell` |

---

## Decisioni prese

| Decisione | Motivazione |
|-----------|-------------|
| Home come sezione di primo livello, non tab interno | Elimina alla radice il bug di sincronizzazione `initialSection↔activeTab`. Rende `AdminDashboard` configurabile e prevedibile come gli altri tab |
| Pulsante X in flusso (non `absolute`) | `absolute` sovrapponeva i pulsanti interni delle pagine (es. `ShiftToggle` in Analytics). In flusso normale spinge il contenuto in basso senza conflitti |
| `getPeriodBounds` esportata invece di duplicare la logica | `AnalyticsPage` e `computeOccupancyRate` devono entrambe calcolare i bounds del periodo navigato — unica fonte di verità |
| Freccia destra disabilitata per offset ≥ 0 | Non ha senso navigare nel futuro per dati storici |
| Shift filter esclude prenotazioni senza `confirmed_start` | Senza orario confermato non è classificabile il turno — includerle solo in "Tutti" è l'unico comportamento coerente |
