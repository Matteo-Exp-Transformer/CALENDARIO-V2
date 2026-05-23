# UI Theme Context — Rollout token e temi

> Leggi questo file **solo** per task di cambio tema / rollout palette.
> Per modifiche UI normali usa `STYLING_AGENT_CONTEXT.md` + `UI_COMPONENTS_CONTEXT.md`.

---

## Prima di modificare

1. Dal mockup (o palette ricevuta) estrarre: **primary**, **secondary**, **accent**,
   **sfondo pagina**, **sfondo card**, **bordo**, **testo** e stati semantici se richiesti.
2. Costruire una scala `primary-50 … primary-900` coerente.
   — step 600–900: toni scuri (azione principale, hover)
   — step 300: accent (es. giorno selezionato calendario)
   — step 50–100: sfondi leggeri (badge, header sezione)
3. Nessuna classe Tailwind con template string interpolata (`bg-${x}-600`) — non genera CSS.

---

## Livello 1 — Token globali (sempre)

| File | Cosa aggiornare |
|------|-----------------|
| `src/index.css` `@theme` | `--color-primary-*`, stati `--color-status-*`, `--color-muted`, `--color-background`, `--color-surface` |
| `src/index.css` `:root` | `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-border`, `--color-border-strong`, `--color-text*`, `--color-primary*`, variabili nav tema (`--theme-surface-nav-*`, `--theme-border-nav-*`, `--theme-accent-primary`…), `--admin-nav-tab-active-border`, `--color-accent-selected`, `--admin-warm-wrap-border` |
| `tailwind.config.js` | Allineare scala `primary` e `background`/`muted` a `@theme` |
| `src/lib/adminWarmGradientSurface.ts` | `ADMIN_WARM_BORDER`, `ADMIN_WARM_GRADIENT_SURFACE`: sfondo/blocco editor menu = card/pannello tema |
| FullCalendar in `src/index.css` | Selettori `.booking-calendar-fc`: giorno selezionato (gradient accent), pulsanti toolbar, `--fc-*` vars, `min-height` celle mese via `--booking-calendar-day-min-height` (impostata da `BookingCalendar.tsx`) |
| Card titolo calendario in `src/index.css` | `.booking-calendar-title-section .booking-calendar-page-title` — vedi `BOOKING_CALENDAR_LAYOUT_CONTEXT.md` §6 |
| `src/lib/adminBlueCtaClass.ts` | CTA footer: usare `primary-*` tema, non blu Tailwind legacy |

### Inversione "pagina ↔ card" (se richiesta)

- `--color-bg`: sfondo viewport
- `--color-surface`: card, fascia menu, dock footer, contenitori contenuto
- Dopo lo swap: sostituire `bg-white` hardcoded sulle superfici dashboard
  con `bg-[var(--color-surface)]` (micro-elementi tipo badge icon digest
  possono restare `bg-[var(--color-bg)]` per contrasto)

---

## Livello 2 — CSS admin (`src/index.css`)

Verificare e riallineare:

- **`.admin-nav-item`**: tab inattive — sfondo `var(--color-surface)`, bordo `var(--color-border)`, hover `surface-2`
- **`button.admin-nav-item.admin-nav-tab-active:not(.archive-tab-filter-btn)`**: tab principale attiva = primary + testo bianco
- **`button.admin-nav-item.admin-nav-tab-active.archive-tab-filter-btn`**: filtri archivio attivi = `--color-accent-selected` + bordo primary + testo `var(--color-text)`
- **`.admin-new-booking-collapse-trigger`**: CTA collasso = colore secondary (non gradient verde legacy)
- **`.admin-warm-surface`**: superficie neutra tema (`surface-2` + bordo tema)
- **`.menu-prices-category-list-wrap`**: `background-color` + bordo tema, niente gradient caldo
- **`@keyframes admin-nav-notify-pulse-ring`**: allineare al secondary/brand se la pulse non è più indigo
- **`.menu-prices-icon-btn--visibility-*`**: colori primari tema, non indigo hardcoded

---

## Livello 3 — Componenti React (checklist)

### `src/pages/AdminDashboard.tsx`
- Fascia titolo: primary pieno + testo bianco (non `admin-warm-surface`)
- Badge Prenotazioni: `primary-100` / `primary-900`
- StatCard: `border-[var(--color-border)]`, `bg-[var(--color-surface)]`
- Footer: striscia `var(--color-bg)`; dock `var(--color-surface)`; shortcut attivi primary + icona bianca

### `src/features/booking/components/ArchiveTab.tsx`
- ArchiveBookingCard: shell card `border` + `surface`, header digest no `admin-teal-surface`
- ArchiveFiltersCard: `bg-[var(--color-surface)]`, filtri senza `bg-orange-200`

### `src/features/booking/components/BookingRequestCard.tsx`
- Strip, shell, focus ring primary, icone `primary-500/900`, separatori `var(--color-border)`
- Box "menu predefinito": `primary-50/200/800`

### `src/features/booking/components/BookingCalendar.tsx`
- Rimuovere costanti `CALENDAR_SECTION_WARM_SURFACE`
- Fascia titolo: `border-[var(--color-border)]` + `bg-[var(--color-surface)]`; titolo `primary-900`
- **Layout tab Calendario (23-05-26)**: leggere `BOOKING_CALENDAR_LAYOUT_CONTEXT.md` prima di toccare costanti, wrapper FC o titolo

### `src/features/booking/components/MenuPricesTab.tsx`
- Non lasciare `style={ADMIN_WARM_GRADIENT_SURFACE}` con gradient legacy
- Sezioni `border-t`: `border-[var(--color-border)]`
- Blocco ingredienti: `bg-[var(--color-surface)]`

### `src/features/booking/components/BookingDetailsModal.tsx`
- Pannello laterale: `bg-[var(--color-surface)]`
- Header: `bg-primary-50` + `border-[var(--color-border)]`; titolo `text-primary-900`
- Tab: attiva `bg-primary-600` (testo bianco), inattiva `bg-[var(--color-surface)]`
- Footer azioni: bordo tema + `bg-[var(--color-surface)]`
- Badge "da cliente": `primary-100` / `primary-800`
- Portal conferma/elimina: card `bg-[var(--color-surface)]`, `border-[var(--color-border)]`

---

## Ricerca residui (obbligatoria prima di chiudere)

```bash
# Eseguire grep in src/ per:
warm-orange|warm-wood|bg-orange-200|admin-teal-surface
from-\[rgba\(45,212,191|rgb\(255 241 232\)|rgba\(251, 191, 160
#3b82f6|#2563eb|bg-blue-50|border-blue-
ADMIN_WARM_GRADIENT
```

Correggere o giustificare ogni hit nell'area admin/dashboard e nelle card prenotazioni.

---

## Verifica finale

```bash
npm run validate   # lint + typecheck + test — zero warning
```

Controllare visivamente: Dashboard (header, nav, pendenti, archivio, calendario, menu, footer),
`BookingDetailsModal` (header, tab, contenuto, azioni), FullCalendar (giorno selezionato = accent palette).

---

## Sintassi Tailwind v4 — promemoria

| Vecchia sintassi | Sintassi v4 canonica |
|------------------|----------------------|
| `border-[var(--color-border)]` | `border-(--color-border)` |
| `text-[var(--color-text-muted)]` | `text-(--color-text-muted)` |
| `bg-[var(--color-surface)]` | `bg-(--color-surface)` o `bg-surface` se shorthand definito |
| `!border-red-500` (v3) | `border-red-500!` (v4) |
