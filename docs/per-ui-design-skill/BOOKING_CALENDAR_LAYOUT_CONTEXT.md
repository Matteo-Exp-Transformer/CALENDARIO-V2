# BookingCalendar — layout e responsive (contesto agente)

> Sessioni **23-05-26**, **18-06-26**. Tab **Calendario** admin (Classic e Pro via `AdminDashboard` / `BookingCalendarTab`).
> File LOCK: `BookingCalendar.tsx` — leggere anche `docs/ADMIN_CLASSIC_SKILL.md` prima di modificare.

---

## 1. File coinvolti

| File | Ruolo |
|------|--------|
| `src/pages/AdminDashboard.tsx` | Contenitore tab: eccezione `max-w-none px-1 md:px-1.5` solo se `activeTab === 'calendar'` |
| `src/features/booking/components/BookingCalendarTab.tsx` | Wrapper dati → `<BookingCalendar />` |
| `src/features/booking/components/BookingCalendar.tsx` | UI calendario, costanti layout, wrapper `.booking-calendar-fc` |
| `src/index.css` | `.booking-calendar-title-section`, `.booking-calendar-fc` (celle mese + stili FC esistenti) |

**Storage DB**: nessuna modifica di schema in questa sessione — solo presentazione.

---

## 2. Struttura UI (dall’alto)

```
AdminDashboard <main>
  └─ contenitore tab Calendario (max-w-none, px-1 md:px-1.5)
       └─ BookingCalendar
            ├─ CALENDAR_TITLE_SECTION_INSET_CLASS (max-w-7xl, padding compensato)
            │    └─ card titolo: h2 + icona calendario
            ├─ pulsanti vista — mobile/tablet: Mese + Lista; desktop: tutte le viste
            ├─ .booking-calendar-fc (full width)
            │    ├─ riga «Oggi» + data (currentDateLabel, es. 23/05/26)
            │    └─ FullCalendar (height: 'auto')
            └─ digest giorno selezionato (full width, senza max-w-7xl)
```

---

## 3. Costanti in `BookingCalendar.tsx`

| Costante | Valore | Uso |
|----------|--------|-----|
| `CALENDAR_DEFAULT_LIST_MAX_WIDTH_PX` | `630` | Sotto questa larghezza: vista lista predefinita; `dayMaxEvents: 3` su FC |
| `CALENDAR_DESKTOP_MIN_WIDTH_PX` | `1024` (`lg`) | Da questa larghezza mostra anche Settimana/Giorno; sotto restano Mese/Lista |
| `CALENDAR_EVENT_ICON_ONLY_MAX_WIDTH_PX` | `500` | Vista mese: solo icona evento sotto questa larghezza |
| `CALENDAR_DAY_GRID_MONTH_MIN_HEIGHT_PX` | `128` | Min-height celle mese (viewport > 630px) |
| `CALENDAR_DAY_GRID_MONTH_MIN_HEIGHT_NARROW_PX` | `112` | Min-height celle mese (viewport ≤ 630px) |
| `CALENDAR_TITLE_SECTION_INSET_CLASS` | `mx-auto w-full max-w-7xl px-3 md:px-[1.125rem]` | Card titolo: stesso respiro laterale di `px-4 md:px-6` rispetto al tab a padding ridotto |

Wrapper FC imposta la variabile runtime:

```tsx
style={{ '--booking-calendar-day-min-height': `${isCalendarNarrowViewport ? NARROW : DESKTOP}px` }}
```

---

## 3-bis. Limite eventi per cella — vista mese (18-06-26)

| Viewport | `dayMaxEvents` | Indicatore overflow | Click su indicatore |
|----------|---------------|---------------------|---------------------|
| Mobile ≤630px | `3` | `···` (classe `.booking-calendar-more-dots`) | `moreLinkClick` → `handleDateClick` (seleziona il giorno, nessun popover) |
| Desktop >630px | `5` | `…` (testo plain, nessuna classe custom) | stesso `moreLinkClick` → nessun popover |

**Implementazione**: `config.dayMaxEvents` = valore numerico (mai `false` per desktop).
`moreLinkClick` è estratto fuori dal conditional spread — si applica a entrambe le superfici e
**previene il popover nativo FC** restituendo la view corrente.

**Anti-pattern**: non usare `dayMaxEvents: false` per desktop; non lasciare il `moreLinkClick` solo
nel branch `isCalendarNarrowViewport` (il popover nativo FC si aprirebbe su desktop).

---

## 4. Altezza celle vista mese (FullCalendar)

### Cosa NON funziona

- **`dayMinHeight` in config FullCalendar v6** con `height: 'auto'` viene **ignorato** (nessun effetto visibile).

### Cosa usare

1. Costanti `CALENDAR_DAY_GRID_MONTH_MIN_HEIGHT_*` in `BookingCalendar.tsx`
2. CSS in `index.css`:

```css
.booking-calendar-fc .fc .fc-dayGridMonth-view .fc-daygrid-day .fc-daygrid-day-frame {
  min-height: var(--booking-calendar-day-min-height);
}
```

Fallback su wrapper: `--booking-calendar-day-min-height: 8rem` se la var non è impostata.

Per cambiare l’altezza delle celle: **solo le due costanti** (+ eventuale fallback in CSS).

---

## 5. Larghezza tab Calendario (`AdminDashboard.tsx`)

Altri tab restano su standard responsive:

```tsx
activeTab === 'calendar'
  ? 'max-w-none px-1 md:px-1.5'
  : 'max-w-7xl px-4 md:px-6'
```

- Griglia FC e digest usano quasi tutta la larghezza del `main`
- La **card titolo** resta centrata e capped a `max-w-7xl` tramite `CALENDAR_TITLE_SECTION_INSET_CLASS`

---

## 6. Titolo «Calendario Prenotazioni» (solo `index.css`)

Classi markup: `.booking-calendar-title-section` sulla card, `.booking-calendar-page-title` sull’`h2`.

**Non** duplicare `font-size` / `text-align` con Tailwind arbitrario sull’`h2` — le regole vivono in `index.css`:

| Viewport | `font-size` | `text-align` | Note |
|----------|-------------|--------------|------|
| **&lt; 400px** | `1.375rem` | sinistra | Base mobile |
| **400–469px** | `1.375rem` | sinistra | Come sotto 400px |
| **470–639px** | `1.5rem` | sinistra | Stessa dimensione del desktop, non centrato |
| **≥ 640px (`sm`)** | `1.5rem` | **centro** | Icona calendario `absolute right` sulla riga |
| **≥ 768px (`md`)** | `1.875rem` | centro | |

Layout riga titolo (≥640px): `sm:items-center sm:justify-center` sul flex; icona `sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2`; `h2` con `sm:pr-14 md:pr-16` per non sovrapporsi all’icona.

---

## 7. Data odierna

- **Non** più nella card titolo (rimossa accanto all’icona).
- Accanto al pulsante **Oggi** sopra FullCalendar (`currentDateLabel`, formato `dd/MM/yy`).
- **Responsive (11-06-26):** nascosta sotto **`lg` (1024px)** — su mobile/tablet resta solo **Oggi** per non invadere il titolo mese FC; visibile da desktop in su (`hidden lg:inline`).
- Wrapper: `absolute left-0 top-0 z-20 flex items-center gap-2` dentro `.booking-calendar-fc`.

### Selettore viste

- **Mobile e tablet (`< lg`)**: sono renderizzati solo **Mese** e **Lista**.
- **Desktop (`≥ lg`, 1024px)**: sono renderizzati **Mese**, **Settimana**, **Giorno** e **Lista**.
- Se il viewport passa sotto `lg` con Settimana o Giorno attivi, `currentView` e FullCalendar passano
  a **Mese**. Mese/Lista restano selezionabili normalmente.
- Tornando desktop ricompaiono tutte le viste senza ripristinare quella precedente: resta attiva la
  vista corrente.

---

## 7-bis. Badge riempimento cella-giorno (vista mese, 11-06-26 · aggiornato 18-06-26)

Montaggio: `dayCellDidMount` → `.booking-day-fill-holder` nel `.fc-daygrid-day-frame` (non
`dayCellContent` — anniderebbe nel numero giorno).

**Denominatore % (nuovo modello 18-06-26):** non più `daily_guest_limit` (rimosso) ma la **SOMMA dei cap
per-fascia del giorno** (`resolveDayDenominator`: per ogni fascia `override(data) → service_slots.max_guests
→ slot_guest_capacities[id]`). La % si mostra **solo se** `slot_limit_enabled` ON **e**
`booking_time_slots_enabled` ON **e** esiste ≥1 fascia **e TUTTE** hanno un cap non-null. Altrimenti
(limiti OFF / nessuna fascia / anche una fascia senza cap) → badge `--neutral` con il **solo conteggio**.
Somma solo fasce esistenti (no chiavi orfane in `slot_guest_capacities`).

| Classe | Significato |
|--------|-------------|
| `.booking-day-fill--ok` | &lt; 80% |
| `.booking-day-fill--high` | 80–100% incluso («pieno») |
| `.booking-day-fill--over` | **solo** &gt; 100% (valore reale, mai cappato) |
| `.booking-day-fill--neutral` | conteggio senza % (limiti per-fascia OFF o incompleti) |

**Responsive badge** (`index.css`):

- Desktop: `top: 4px; left: 4px`
- Mobile ≤640px: `bottom: 3px; left: 3px` (non sovrapporsi al numero giorno)
- Anti-sbordo 375px (batch A 11-06): `.booking-day-fill-holder { overflow: hidden }`; badge
  `max-width: calc(100% - 6px); overflow: hidden; text-overflow: ellipsis`

`BookingCalendarTab`: stato errore query mostra pulsante **Riprova** (invalida `useAcceptedBookings`).

**Badge solo vista mese (C-R2, voluto M2):** `dayCellDidMount` monta `.booking-day-fill` **solo** in
`dayGridMonth`. Viste Settimana/Giorno/Lista FC **non** hanno badge % — il segnale «quanto è pieno»
resta sul mese + digest sotto. Nessun fix M2; indicatore compatto altrove → follow-up opzionale M6.

---

## 7-ter. Finding Fase C — classificazione UI calendario (11-06-26)

| ID | Superficie | Stato | Senso per lo staff |
|----|------------|-------|-------------------|
| **C-R2** | Viste FC Settimana/Giorno/Lista senza badge % | **Voluto M2** | La % giornaliera si legge solo in vista **Mese**; sotto restano digest e lista per fascia. |
| **C-R3** | Digest Settimana compatto senza pallino tavolo Pro | **✅ Chiuso batch A** | `hasTurns={hasTurnsFeature}` — pallino «Assegna tavolo» come in vista Giorno (ex FU-CAL-6). |
| **C-U3** | Pro + turni: navigazione turni nel digest giorno | **Superato 20-06** | Il digest giorno non filtra più per turno: `filterByTurn` è passthrough e non esiste più `DigestTurnNav`. La gestione turni vive nella pagina Servizio; nel Calendario resta il badge assegnazione tavolo. |

Dettaglio prodotto C-U3/C-D1/C-U2: `ADMIN_PRENOTAZIONI_CONTEXT.md` §5-ter punti 21–22 e FU-048
marcato superato.

---

## 7-quater. Digest «Prenotazioni del giorno» — fasce collapse + griglia card (20-06-26)

La vista **Giorno** sotto FullCalendar non è più divisa in **Prenotazioni con menu** e **Solo tavolo**.
La struttura attuale è una sintesi in alto + card collassabili per fascia oraria; la distinzione
tipologia/card scelta vive dentro la card prenotazione come badge configurabile.

```
DayDigestSummaryPanel
  └─ DayServiceGroupCard × N (Colazione, Pranzo, Aperitivo, Cena, ...)
       └─ DayHourGroup × N (13:00, 14:00, ...)
            └─ BookingDigestCard × N
  └─ DayServiceGroupCard "Fuori fascia" solo se esistono prenotazioni fuori fascia
```

- `DayServiceGroupCard` usa `CollapsibleCard` con `defaultExpanded={false}`: tutte le fasce partono
  chiuse e possono restare aperte insieme.
- Header fascia: nome fascia e range orario stanno nello stesso titolo visuale
  (`Colazione    07:00 - 11:30`), con spazio ampio fra i due; il riepilogo sotto mostra solo
  conteggi/coperti/assegnazioni. Non usare `actions` del `CollapsibleCard` per il range, altrimenti
  l'orario torna appoggiato al margine destro.
- `DayHourGroup` usa una griglia card: `grid-cols-1 min-[576px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`.
  La vecchia nota “no `grid-cols-3`” è **superata**: la griglia fino a 5 colonne ora è voluta dentro
  ogni gruppo orario, non come griglia delle fasce. Il breakpoint `min-[576px]` è esplicito: sotto i
  576px sempre **1 sola card per riga** (mobile, ~300–575px), 2 card da 576px in su.
- Le label ora in `DayHourGroup` sono badge compatti ma leggibili (`13:00`) e i gruppi successivi al
  primo hanno una riga divisoria interna al digest.
- `BookingDigestCard` struttura fissa su tutti i viewport: (1) nome cliente (nessuna icona tipologia:
  rimossa); (2) colonne statistiche **Ospiti · Orario · Prezzo/pers** (label piccola con icona sopra,
  valore sotto); la colonna Prezzo/pers compare **solo** quando `menuPriceRow` è valorizzato (prenotazione
  con card scorrevole/carosello a prezzo), valore a persona; (3) badge tipologia (tipologia prenotazione
  + card scorrevole) **sotto** i dati, sulla stessa riga con wrap controllato; massimo 3 badge senza
  duplicati; se `booking_badge_enabled === false` sulla modalità o sulla card, quel badge non viene
  renderizzato. **Allineamento auto-centrato**: il contenuto sta in un blocco `mx-auto w-fit max-w-full`,
  quindi prende la larghezza naturale e si centra da solo quando la card è larga (spazio libero), mentre
  su card strette riempie e resta a sinistra — niente JS/misurazioni. Il badge `DA ASSEGNARE` (PRO) NON sta nel flusso: è **esterno** alla card, agganciato al
  bordo in alto a destra (`absolute right-3 top-0 -translate-y-full`, sfondo `bg-surface` coerente con
  la card, bordo proprio `border-(--color-border)`, `rounded-b-none` per saldarsi al bordo superiore),
  così non sottrae spazio al nome; cliccabile apre `QuickTableAssignModal`; in Classic non compare. Il
  badge card scorrevole compare solo per sotto-tab `display === 'cards'`, mai per carosello.
- Barra % occupazione: `h-2.5`; soglie colore: verde-primario <80%, ambra 80-110%, rosso >110%.
  La barra è cappata visivamente a 100% ma il testo mostra il valore reale.
- Se non ci sono fasce attive, la vista giorno usa una griglia piatta di `BookingDigestCard`
  mantenendo gli stessi handler di dettaglio e assegnazione tavolo.
- Sezione **Fuori fascia**: card finale con stile di attenzione, mostrata solo se il view model
  espone `outOfSlotCount > 0`.
- Pro + tavoli: `filterByTurn` è passthrough (nessuna navigazione turni nel digest giorno);
  `assignedBookingIds` e `QuickTableAssignModal` restano per il badge “da assegnare”. In Classic non
  compaiono badge/stati “da assegnare”.

### Verifica visiva consigliata

Con sidebar icone (`pl-16`): 375px, 834px, 1280px, desktop ≥1536px — riepilogo leggibile, fasce chiuse
all’apertura, gruppi orari ordinati, card senza overflow e massimo 4 per riga su desktop largo.

---

## 8. Media query `index.css` — ambiti distinti

| Query | Ambito |
|-------|--------|
| **400 / 470 / 640 / 768 px** | Solo `.booking-calendar-page-title` |
| **537px, 595px, 768px** (esistenti) | Solo compattazione toolbar/eventi **FullCalendar** (`.booking-calendar-fc`) |

Non riusare i breakpoint FC (537px…) per il titolo o altri componenti.

---

## 9. Anti-pattern

| Evitare | Motivo |
|---------|--------|
| `dayMinHeight` in `views.dayGridMonth` | Ignorato con `height: 'auto'` |
| `min-height` celle solo in TSX senza CSS var | FC non espone API affidabile |
| Rimuovere `CALENDAR_TITLE_SECTION_INSET_CLASS` allargando FC | Titolo tornerebbe a filo bordo |
| `text-[2rem]` o `clamp()` sul titolo senza richiesta esplicita | Sessione 23-05: scale a soglie fisse 400/470/640 |
| Centrare titolo sotto 640px | Richiesta prodotto: sinistra &lt;640, centro ≥640 |

---

## 10. Verifica visiva

1. Tab Calendario — FC quasi edge-to-edge; card titolo con margine “classico”.
2. Vista mese — celle ≥112/128px altezza minima (vuote o con pochi eventi).
3. **Oggi** sopra il calendario; data accanto solo da **lg** in su (1280px QA: visibile).
4. Titolo: sinistra a 399px e 450px; centrato a 700px e 1200px; 470–639px a 1.5rem sinistra.
5. Selettore viste: 375/834px solo Mese+Lista con fallback a Mese; 1280px tutte le viste.

```bash
npm run typecheck && npm run lint
```

---

## 11. Commit di riferimento (branch `Sviluppo-Dashboard-laterale`)

| Commit | Contenuto |
|--------|-----------|
| `ea1acdd` | Altezza minima celle mese (CSS var + costanti) |
| `8f197fb` | Layout full-width, titolo responsive, data su Oggi, doc skill parziale |
