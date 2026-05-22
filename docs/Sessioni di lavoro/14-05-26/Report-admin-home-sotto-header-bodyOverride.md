# Report — Home admin: nascondere sotto-header con `bodyOverride`

> **Data**: 2026-05-14  
> **Branch**: `Sviluppo-Dashboard-laterale`  
> **Commit**: `feat(admin): nascondi sotto-header con bodyOverride (Home)` (`1cd42d8`)

---

## Obiettivo

Con sezione **Home** (Pro/Enterprise), `AdminShell` monta `AdminDashboard` passando `bodyOverride={<AdminHomePage />}`. Il corpo principale mostra già la Home; restavano però visibili nell’header, in base al tab attivo (`activeTab`), tutte le “sotto-righe” (chrome secondario):

- **Calendario**: griglia statistiche Oggi / Settimana / Mese / Rifiutate  
- **Archivio**: `ArchiveFiltersCard`  
- **Menu**: `MenuPricesHeroToolbar`  
- **Impostazioni**: `RestaurantSettingsIntro`  
- **Prenotazioni**: blocco “Inserisci Nuova Prenotazione” (collapse + form)

Si voleva che in modalità Home **non** comparisse mai quel chrome secondario; al click su un qualsiasi `NavItem` si esce da Home (`onBodyOverrideExit` → `section = 'prenotazioni'`) e la visualizzazione torna normale con le sotto-righe coerenti col tab scelto.

---

## Soluzione implementata

**File**: `src/pages/AdminDashboard.tsx`

1. Introdotto `showTabSecondaryChrome = !bodyOverride` con commento che elenca cosa resta nascosto quando è attiva la Home.

2. Condizioni di render aggiornate da `activeTab === '…'` a `activeTab === '…' && showTabSecondaryChrome` per:
   - statistiche calendario,
   - archivio (filtri),
   - toolbar menu,
   - intro impostazioni ristorante,
   - blocco header Prenotazioni / nuova prenotazione.

3. **Correzione collaterale**: su `<main>`, la classe `hidden` quando `showNewBookingPanel` era attivo nascondeva tutto il corpo anche con Home visibile se l’utente era rimasto su tab Prenotazioni col pannello aperto. Condizione aggiornata a `showNewBookingPanel && !bodyOverride && 'hidden'` così il contenuto `bodyOverride` resta visibile in Home.

4. JSDoc della prop `bodyOverride` in `AdminDashboardProps` aggiornato: non è più accurato dire solo “Header e NavItem restano visibili” senza precisare che le sotto-righe per tab sono soppressse con `bodyOverride`.

**File non modificati**: `AdminShell.tsx` (il flusso `handleTabClick` → `onBodyOverrideExit` era già corretto).

---

## Verifica

- Eseguito `npm run validate` (lint, typecheck, Vitest): **superato** (29 test).

---

## Note per sessioni future

- Se in documentazione (`docs/APP_CONTEXT_SKILL.md`, nota sezione Home) si descrive ancora il solo “header + 5 tab” senza menzionare l’assenza delle sotto-righe in Home, valutare una riga di allineamento testuale.
- Nessuna modifica DB o uso Supabase MCP per questo intervento.
