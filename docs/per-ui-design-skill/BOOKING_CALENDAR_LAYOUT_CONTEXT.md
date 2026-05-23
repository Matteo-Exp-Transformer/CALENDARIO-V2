# BookingCalendar — layout e responsive (contesto agente)

> Sessione **23-05-26**. Tab **Calendario** admin (Classic e Pro via `AdminDashboard` / `BookingCalendarTab`).
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
            ├─ pulsanti vista (Mese / Settimana / Giorno / Lista) — centrati, full width
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
| `CALENDAR_EVENT_ICON_ONLY_MAX_WIDTH_PX` | `500` | Vista mese: solo icona evento sotto questa larghezza |
| `CALENDAR_DAY_GRID_MONTH_MIN_HEIGHT_PX` | `128` | Min-height celle mese (viewport > 630px) |
| `CALENDAR_DAY_GRID_MONTH_MIN_HEIGHT_NARROW_PX` | `112` | Min-height celle mese (viewport ≤ 630px) |
| `CALENDAR_TITLE_SECTION_INSET_CLASS` | `mx-auto w-full max-w-7xl px-3 md:px-[1.125rem]` | Card titolo: stesso respiro laterale di `px-4 md:px-6` rispetto al tab a padding ridotto |

Wrapper FC imposta la variabile runtime:

```tsx
style={{ '--booking-calendar-day-min-height': `${isCalendarNarrowViewport ? NARROW : DESKTOP}px` }}
```

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
- Wrapper: `absolute left-0 top-0 z-20 flex items-center gap-2` dentro `.booking-calendar-fc`.

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
3. **Oggi** + data sulla stessa riga sopra il calendario.
4. Titolo: sinistra a 399px e 450px; centrato a 700px e 1200px; 470–639px a 1.5rem sinistra.

```bash
npm run typecheck && npm run lint
```

---

## 11. Commit di riferimento (branch `Sviluppo-Dashboard-laterale`)

| Commit | Contenuto |
|--------|-----------|
| `ea1acdd` | Altezza minima celle mese (CSS var + costanti) |
| `8f197fb` | Layout full-width, titolo responsive, data su Oggi, doc skill parziale |
