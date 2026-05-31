# Report esecuzione — Rifinitura dashboard laterale e layout admin

**Data sessione**: 2026-05-13
**Branch**: `Sviluppo-Dashboard-laterale`
**Stato finale**: typecheck ✓ · lint ✓ · 29/29 test ✓

---

## Scope della sessione

Rifinitura coerente della dashboard laterale, header dashboard e comportamento responsive.
Lavoro organizzato in 10 task (A–J) concordati con l'utente dopo una fase di domande/chiarimenti.

---

## Chiarimenti pre-implementazione

| Domanda | Risposta utente |
|---------|-----------------|
| Task D — come integrare Home dentro AdminDashboard? | Approccio proposto confermato: passare `initialSection` prop, AdminDashboard aggiunge tab `'home'` |
| Task H — turni mostrati solo se configurati dall'admin? | Sì, la configurazione fasce viene fatta manualmente per cliente pro; i turni appaiono solo se `service_slots` presenti |
| Task J — posizione file feature flag | Opzione B: `src/lib/adminFeatures.ts` (lib globale) |
| Task G — breakpoint digest responsive | Opzione A: breakpoint statico `min-[1390px]`, semplice e prevedibile |
| Task B — comportamento sidebar su desktop | Parte sempre chiusa; si apre solo al click sul pulsante; qualsiasi click fuori la chiude subito |

---

## File creati

| File | Contenuto |
|------|-----------|
| `src/lib/adminFeatures.ts` | Mappa `ADMIN_FEATURES` con flag `adminSidebar`, `crm`, `service`, `serviceSlots`, `tableAssignments` |

---

## File modificati

### `src/components/layout/AdminShell.tsx` — Task A + B

**Task A — Ordine e voci sidebar:**
- Rimossa voce "Impostazioni" (`Store`) da `SIDEBAR_NAV`.
- Aggiunte voci "Servizio" (`ConciergeBell`) e "CRM Clienti" (`Users`).
- Ordine voci: Home → Form Pubblico → Servizio → CRM Clienti → Analytics → pulsante Espandi.
- Pulsante "Espandi menu" spostato **sotto** tutte le voci `SIDEBAR_NAV` (era posizionato subito dopo Home).
- Voci Servizio e CRM gated da `ADMIN_FEATURES.service` / `ADMIN_FEATURES.crm`.
- Rimossa dipendenza da `useIsLg()` — la sidebar ora usa un solo stato `expanded` indipendente da breakpoint.
- `activeSidebarItem` aggiornato per coprire i nuovi id `'servizio'` e `'crm'`.

**Task B — Sidebar sempre chiusa, click-outside:**
- Sidebar parte **sempre collassata** all'avvio (`useState(false)`).
- Listener `pointerdown` con `capture: true` su `document`: se il click cade fuori dall'`<aside>` (rilevato tramite `useRef`) → `setExpanded(false)`.
- Listener `keydown Escape` per chiusura da tastiera.
- Entrambi i listener registrati solo quando `expanded === true` e rimossi al cleanup.
- Su narrow (≤644px) l'overlay già esistente continua a funzionare come prima.
- `AdminHomePage` rimosso dall'import diretto (ora montata tramite `AdminDashboard`).

---

### `src/pages/AdminDashboard.tsx` — Task C + D

**Task C — Rimozione Servizio e CRM dal nav header:**
- Rimossi `NavItem` "Servizio" e "CRM Clienti" dalla `<nav>`.
- Rimossi import `ConciergeBell`, `Users` (non più usati nell'header).
- Griglia nav aggiornata da `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` a `grid-cols-2 sm:grid-cols-4`.
- Footer quick-nav: rimossi i pulsanti `ConciergeBell` e `Users` (la navigazione è ora nella sidebar).
- `onOpenServizio` e `onOpenCrm` mantenuti come prop — ancora usati da `AdminHomePage` (azioni da Home).

**Task D — Home come tab interno:**
- Tipo `Tab` esteso con `'home'`.
- Nuova prop `initialSection?: AdminShellSection` (default `'prenotazioni'`).
- `useState<Tab>` inizializzato a `'home'` se `initialSection === 'home'`, altrimenti `'calendar'`.
- `useEffect` sincronizza `activeTab` quando `initialSection` cambia tra `'home'` e `'prenotazioni'`.
- Nel `<main>`: quando `activeTab === 'home'` monta `<AdminHomePage>` con `onOpenPrenotazioni={() => setActiveTab('calendar')}`.
- Header dashboard e footer restano sempre visibili — Home non fa più full-screen override.
- `AdminShell` ora monta sempre `<AdminDashboard initialSection={section}>` per entrambe le sezioni `'home'` e `'prenotazioni'`.
- Rimosse prop `onOpenSettings` e `onOpenPrenotazioni` dalla destructuring (non più usate nel corpo).

---

### `src/pages/AdminHomePage.tsx` — Task E + F

**Task E — Rimozione quick-nav Calendario e CRM:**
- Rimossi `QuickNavButton` "Calendario" e "CRM Clienti" dal `<nav>`.
- Rimossi import `Calendar`, `Users` (non più usati).
- Restano: "Servizio" (condizionato a `ADMIN_FEATURES.service`), "Aggiungi walk-in", "Briefing turno".
- `onOpenCrm` mantenuto nell'interfaccia `AdminHomePageProps` per retrocompatibilità; rinominato `_onOpenCrm` nel corpo per segnalare intenzionalità.

**Task F — Count pending globale + shiny corretto:**
- Aggiunto `useBookingStats()` da `useBookingQueries.ts` (stessa sorgente del tab header "Prenotazioni").
- `pendingGlobal = globalStats?.pending ?? 0` — stesso valore mostrato nel badge header.
- Card "In attesa di conferma" usa `pendingGlobal` invece di `pendingToday`.
- Effetto shiny/pulse (`admin-nav-notify-pulse-wrap` + `NotifyNavShinyLayers`) applicato alla card **solo se `pendingGlobal > 0`**.
- Banner alert aggiornato per usare `pendingGlobal`.
- `useHomeStats` invariato: `pendingToday` resta disponibile per altri usi futuri.

---

### `src/features/booking/components/BookingCalendar.tsx` — Task G + H + I

**Task G — Breakpoint responsive digest:**
- Tutte le occorrenze `min-[819px]:grid`, `min-[819px]:block`, `min-[819px]:hidden` sostituite con `min-[1390px]`.
- Motivo: con sidebar `w-56` aperta lo spazio disponibile scende sotto 819px, schiacciando le 3 colonne. 1390px garantisce 3 colonne solo quando c'è spazio sufficiente.

**Task H — Navigazione turni nel digest:**
- Import aggiuntivi: `ChevronLeft`, `ChevronRight`, `useServiceSlots`, `useTableAssignments`, `ADMIN_FEATURES`.
- Nuovo componente interno `DigestTurnNav` (freccia sx / count "Turno N / M" / freccia dx).
- Hook `useServiceSlots()` — carica le fasce orarie del tenant.
- `hasTurnsFeature = ADMIN_FEATURES.serviceSlots && serviceSlots.length > 0` — guard che disattiva tutta la logica turni se la feature è off o i service_slots non sono configurati.
- Hook `useTableAssignments(selectedDate)` — carica gli assignment per la data selezionata.
- State `activeTurn` (default 1) resettato a 1 ad ogni cambio `selectedDate`.
- `maxTurnFromAssignments` — `Math.max` sui `turn_number` degli assignment della data.
- `maxTurn = Math.max(activeTurn, maxTurnFromAssignments)` — consente di navigare fino al turno più alto esistente.
- `filterByTurn(list)` — se `hasTurnsFeature`: filtra per `turnByBookingId[b.id] ?? 1 === activeTurn`; altrimenti ritorna tutto invariato (fallback base).
- `DigestTurnNav` renderizzato sopra le sezioni digest solo se `hasTurnsFeature`.
- `filterByTurn` applicato a tutte le 12 occorrenze di lista nel digest (4 slot × 3 fasce × desktop+mobile).

**Task I — Stato "Da Assegnare":**
- Nessuna migrazione DB — stato derivato lato UI.
- `assignedBookingIds: Set<string>` — set dei `booking_id` con almeno un assignment attivo (`checked_out_at = null`) per la data.
- Prop `unassigned?: boolean` aggiunta a `DigestBookingListRow`.
- Badge amber "Da assegnare" mostrato sia nel layout esteso (dopo il nome) che nel layout compactGrid (sopra il nome).
- Visibile solo quando `hasTurnsFeature && !assignedBookingIds.has(booking.id)`.

---

## Decisioni prese in corso d'opera

| Decisione | Motivazione |
|-----------|-------------|
| Sidebar parte chiusa con `useState(false)` incondizionato | L'utente ha specificato esplicitamente "deve partire sempre chiusa" — rimossa logica `useIsLg` che la apriva su desktop |
| `pointerdown` con `{ capture: true }` per click-outside | Garantisce che l'handler scatti prima di qualsiasi handler nei componenti figli, evitando che un click interno fermi la propagazione |
| `onOpenCrm` rinominato `_onOpenCrm` invece di rimosso | La prop è dichiarata nell'interfaccia pubblica `AdminHomePageProps` — rimuoverla avrebbe rotto i chiamanti; il prefisso `_` segnala l'intenzionalità senza breaking change |
| `useEffect([initialSection, activeTab])` invece di `// eslint-disable-next-line` | ESLint segnalava un disable inutile; aggiungere `activeTab` alla dep array è corretto perché la condizione `activeTab === 'home'` lo legge |
| `filterByTurn` con fallback `?? 1` per prenotazioni senza assignment | Le prenotazioni base (senza `booking_table_assignments`) non hanno turno — appaiono tutte al turno 1, che è il default attivo |

---

## Struttura branch vs main

```
main                        → produzione invariata
Sviluppo-Dashboard-laterale → aggiunge rifinitura dashboard (questa sessione, nessun commit ancora)
```

---

## Criteri di accettazione verificati

| Criterio | Stato |
|----------|-------|
| Sidebar collassata: pulsante "Espandi menu" sotto Analytics | ✓ |
| Sidebar espansa: click/tocco fuori la chiude | ✓ |
| Sidebar contiene Servizio e CRM, non Impostazioni | ✓ |
| Header dashboard non mostra Servizio e CRM | ✓ |
| Home si apre sotto l'header dashboard, non full screen | ✓ |
| Home non mostra quick-nav Calendario e CRM | ✓ |
| Card "In attesa di conferma" = count globale pending | ✓ |
| Shiny/pulse solo se pending > 0 | ✓ |
| Digest non si schiaccia sotto 1390px con sidebar aperta | ✓ |
| Navigazione turni funziona con dati pro, degrada senza | ✓ |
| Badge "Da Assegnare" su accepted senza assignment (pro) | ✓ |
| Base app: calendario/pending/accetta/rifiuta non dipende da Servizio | ✓ |
