---
name: apply-dashboard-theme-from-mockups
description: >-
  Applies a visual theme across the CalendarBackup-v2 admin/booking dashboard from
  screenshots and a palette. Guides token updates (Tailwind v4 @theme, :root),
  shared helpers, and exhaustive UI surfaces so tabs, cards, calendar, archive,
  menu toolbar, modals (`BookingDetailsModal`), CTAs and buttons align like the mockup.
  Use when the user shares
  app UI screenshots or a hex palette to restyle dashboard/prenotazioni/menu, or asks
  to roll out Midnight Blue–style consistency after a mockup.
---

# Tema dashboard da screenshot / palette

Workflow per **CalendarBackup-v2**. Il progetto usa **Tailwind v4**: i token nel blocco **`@theme` in `src/index.css`** sono la fonte per le utility (`primary-*`, `bg-background`, ecc.); `tailwind.config.js` non viene letto automaticamente senza `@config` (già indicato in `CLAUDE.md`).

## Prima di modificare il codice

1. Dal mockup estrarre (o chiarire con l’utente): **primary**, **secondary**, **accent** (es. giorno selezionato calendario / filtri), **sfondo pagina**, **sfondo card/pannelli**, **bordo**, **testo** (e se devono essere aggiornati anche **pending / accepted / rejected** ecc.).
2. Costruire una **scala primary-50 … primary-900** coerente (principale sugli step 600–900, accent su ~300, tonalità leggere su 50–100). Evitare classi Tailwind JIT dinamiche con template string interpolate (non generano CSS).
3. Dopo il lavoro: **`npm run validate`** (lint + typecheck + test).

## Livello 1 — Token globali (sempre)

| Dove | Cosa aggiornare |
|------|-----------------|
| `src/index.css` `@theme` | `--color-primary-*`, `--color-booking-cena`, `--color-muted`, `--color-background`, `--color-surface` se esposto, stati `--color-status-*` se richiesto |
| `src/index.css` `:root` | `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-border`, `--color-border-strong`, `--color-text*`, `--color-primary*`, variabili **nav tema** (`--theme-surface-nav-*`, `--theme-border-nav-*`, `--theme-accent-primary`, …), `--admin-nav-tab-active-border`, `--color-accent-selected`, `--admin-warm-wrap-border` |
| `tailwind.config.js` | Stessa scala `primary` e `background` / `muted` allineati a `@theme` (per toolchain che legge il config) |
| `src/lib/adminWarmGradientSurface.ts` | `ADMIN_WARM_BORDER`, `ADMIN_WARM_GRADIENT_SURFACE`: **non sono più “warm”** nel nome funzionale — sfondo/blocco editor menu = card/pannello tema |
| FullCalendar inline in `src/index.css` | Selettori `.booking-calendar-fc`: giorno selezionato (gradient accent), pulsanti toolbar, `--fc-*` vars |
| `src/lib/adminBlueCtaClass.ts` | CTA blu/footer: usare **`primary-*`** tema, non blu Tailwind legacy |

### Inversione “pagina ↔ card” (se richiesta)

- **`--color-bg`**: sfondo viewport (mockup chiaro della pagina).
- **`--color-surface`**: card, fascia menu, dock footer, contenitori contenuto.
- Dopo lo swap aggiornare **`bg-white` hardcoded** sulle superfici dashboard sostituendo con **`bg-[var(--color-surface)]`** dove prima era una card bianca sulla pagina più scura/chiara; micro-elementi tipo **badge icon digest** possono restare **`bg-[var(--color-bg)]`** per contrasto.

## Livello 2 — CSS admin (non dimenticare)

In **`src/index.css`** verificare e riallineare:

- **`.admin-nav-item`**: tab inattive (sfondo `var(--color-surface)`, bordo `var(--color-border)`), hover con `surface-2`.
- **`button.admin-nav-item.admin-nav-tab-active:not(.archive-tab-filter-btn)`**: tab principale attiva = **primary + testo bianco** (non bordo arancio / `bg-orange-200`).
- **`button.admin-nav-item.admin-nav-tab-active.archive-tab-filter-btn`**: filtri archivio attivi = **`--color-accent-selected`** + bordo primary + testo `var(--color-text)`.
- **`.admin-new-booking-collapse-trigger`**: CTA collasso “Nuova prenotazione” = colore **secondary** mockup (es. `#4F7CAC`), non gradient verde legacy.
- **`.admin-warm-surface`**: oggi è **superficie neutra tema** (`surface-2` + bordo tema), non gradient arancio — i consumatori vecchi restano ma l’aspetto deve essere ice.
- **`.menu-prices-category-list-wrap`**: niente gradient caldo; `background-color` + bordo tema.
- **`@keyframes admin-nav-notify-pulse-ring`**: allineare al secondary/brand blu se la pulse non è più indigo.
- **`.menu-prices-icon-btn--visibility-*`**: colori primari tema, non indigo inventato.
- **`button.archive-tab-filter-btn.admin-nav-item.admin-nav-tab-active`**: `border-width` coerente (es. 2px) con filtri accent.

## Livello 3 — Componenti React (checklist anti-dimenticanze)

Copiare e segnare durante il rollout:

### `src/pages/AdminDashboard.tsx`

- Fascia titolo locale: mockup **primary pieno** + testo bianco (non `admin-warm-surface`).
- **`NavItem` attivo**: niente override `bg-orange-200` / `border-4` arancio; classi coerenti con CSS tab.
- **Badge Prenotazioni**: `primary-100` / `primary-900`, non indigo.
- **StatCard**: `border-[var(--color-border)]`, `bg-[var(--color-surface)]`, testi primary/muted.
- **Pannello tab Pendenti**: bordo `var(--color-border)`, CTA header + chevron colori tema.
- **Footer**: striscia `var(--color-bg)`; dock `var(--color-surface)`; shortcut attivi **primary** + icona bianca; **Log-out** via `adminBlueCtaSurfaceClass`.

### `src/features/booking/components/ArchiveTab.tsx`

- **`ArchiveBookingCard`**: strip tipo evento (gradient ice), shell card `border` + `surface`, header digest **no `admin-teal-surface`**, hover digest, pannello espanso, **ArchiveFiltersCard** `bg-[var(--color-surface)]`, filtri senza `bg-orange-200` (stato da CSS `archive-tab-filter-btn`).

### `src/features/booking/components/BookingRequestCard.tsx`

- Stessa famiglia di Archive: strip, shell, focus ring **primary**, icone **primary-500/900**, pannello espanso, separatori `var(--color-border)`, box “menu predefinito” **primary-50/200/800** invece di blu generico.

### `src/features/booking/components/BookingCalendar.tsx`

- **Rimuovere** costanti tipo `CALENDAR_SECTION_WARM_SURFACE` (gradient pesca + bordo salmone).
- Fascia titolo “Calendario Prenotazioni”: **`border-[var(--color-border)]` + `bg-[var(--color-surface)]`**; titolo/data **primary-900**; icona box **primary-600/700** (non `#3b82f6` legacy).
- Eventuali intestazioni digest sotto calendario: se restano `text-warm-wood`, valutare **`text-primary-900`**; `admin-warm-surface` lì è già neutro via CSS.

### `src/features/booking/components/MenuPricesTab.tsx` + `MenuPricesHeroToolbar`

- **Non lasciare** `style={ADMIN_WARM_GRADIENT_SURFACE}` con vecchio gradient (è centralizzato in `adminWarmGradientSurface.ts` — aggiornare il file).
- Sezioni con `border-t`: **`border-[var(--color-border)]`** non `--admin-warm-wrap-border` arancio.
- Blocco panoramica ingredienti: `bg-[var(--color-surface)]`, **CollapsibleCard** bordi/header **tema** non ambra.

### `src/components/ui/Button.tsx`

- **`secondary`** e **`ghost`**: usare **`var(--color-surface)`**, **`var(--color-surface-2)`**, **`var(--color-border)`**, **`var(--color-text*)`** quando il mockup chiede pulsanti allineati alla carta (post-swap pagina/card).

### `src/features/booking/components/BookingDetailsModal.tsx`

Drawer calendario + dialog annidata: spesso ancora **`bg-blue-50`**, **`border-blue-*`**, **`bg-blue-500`** sulle tab, **`#ffffff` inline** sul pannello, badge cliente **`blue-100`**. Allineare a:

- Pannello laterale: **`bg-[var(--color-surface)]`**, ombre coerenti.
- Header: **`bg-primary-50`** + **`border-[var(--color-border)]`**; titolo **`text-primary-900`**.
- Tab: attiva **`bg-primary-600`** (testo bianco), inattiva **`bg-[var(--color-surface)]`** su **`bg-[var(--color-bg)]`** nella barra tab.
- Area scroll contenuto: **`bg-[var(--color-bg)]`** (o **`surface`** se il mockup unifica tutto nel drawer).
- Footer azioni: bordo tema + **`bg-[var(--color-surface)]`**.
- Pulsante chiudi: **`border-[var(--color-border)]`**, **`bg-[var(--color-bg)]`**.
- Badge “da cliente”: **`primary-100` / `primary-800`** (badge admin resta verde se semantico).
- **Conferma cambio tipo** e **Elimina prenotazione** (portal): card **`bg-[var(--color-surface)]`**, **`border-[var(--color-border)]`**, testi **`primary-900`** / **`--color-text-muted`**; textarea conferma cancellazione **`bg-[var(--color-bg)]`**.

Overlay backdrop (`rgba(0,0,0,0.5)`) può restare; opzionale tonalità **`primary`** molto attenuata nel brand book.

## Ricerca residui (obbligatoria prima di chiudere)

Eseguire grep nel repo **`src/`** per catch-all:

- `warm-orange`, `warm-wood`, `bg-orange-200`, `admin-teal-surface`
- `from-[rgba(45,212,191`, `rgb(255 241 232)`, `rgba(251, 191, 160`
- `#3b82f6`, `#2563eb`, `bg-blue-50`, `border-blue`, `BookingDetailsModal`
- `ADMIN_WARM_GRADIENT` se ancora definito locale
- Gradient “strip” duplicate non passate dai token

Correggere o giustificare ogni hit ancora nell’area **admin/dashboard** e nelle card prenotazioni.

## Verifica finale

1. **`npm run validate`** senza warning.
2. Controllare visivamente (o browser): **Dashboard** (header, nav, pendenti, archivio, calendario, menu, footer), **apertura da calendario: `BookingDetailsModal`** (header, tab, contenuto, elimina/conferme), **fascia BookingCalendar**, **FullCalendar** (giorno selezionato = accent palette).
