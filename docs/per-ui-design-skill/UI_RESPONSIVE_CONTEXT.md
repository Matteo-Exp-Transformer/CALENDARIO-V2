# UI Responsive Context — Dettaglio operativo

> Context di dettaglio per la skill `ui-responsive`. Leggere DOPO `STYLING_AGENT_CONTEXT.md`
> e prima di toccare qualsiasi className che influenzi layout su più larghezze schermo.

---

## 0. Principio fondante: la sidebar NON deve mai restringere la pagina

Questa è la regola che governa tutto il resto.

**La pagina admin è progettata come se la sidebar non esistesse.**
Quando la sidebar è aperta, scorre **sopra** il contenuto in overlay con backdrop
scuro — non spinge, non restringe, non richiede adattamento della pagina.

Conseguenze pratiche:
- Il responsive di ogni pagina si calcola sulla **larghezza piena del viewport**,
  mai sulla larghezza "residua dopo la sidebar".
- Non esistono due layout (con-sidebar / senza-sidebar). Esiste **un solo layout**,
  identico tra Classic e Pro/Enterprise.
- L'agente non deve mai aggiungere logica del tipo "se sidebar aperta riduci colonne".

Stato attuale del codice (`AdminShell.tsx`):
- L'`<aside>` è **sempre `fixed inset-y-0 left-0 z-8000`** (mai nel flusso).
- La sidebar ha **3 stati**: `sidebarMode: 'hidden' | 'icons' | 'expanded'`.
- **`hidden`**: `-translate-x-full`, fuori schermo. `<main>` **senza `pl-16`** → contenuto full-width.
- **`icons`**: `w-16` striscia icone. `<main>` con `pl-16`.
- **`expanded`**: `w-56 shadow-xl` + backdrop `bg-black/40 z-7999`, overlay. Chiusura → torna a `'icons'`.
- `isDrawerOpen = sidebarMode === 'expanded'`. `isNarrow` resta usato solo per l'autochiusura on-click.

> Quando lavori su una pagina: progettala per il viewport pieno. Se devi toccare
> `AdminShell.tsx` per il comportamento sidebar, è file di area shell — vedi
> `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` e produci spiegazione
> preventiva prima di modificare.

---

## 1. Riferimento gold standard: AdminDashboard (Classic)

`src/pages/AdminDashboard.tsx` è il **modello da replicare**. Quando crei o
modifichi una pagina Pro, allinea i suoi pattern a quelli della Classic,
adattandoli al contenuto — non inventare pattern nuovi.

Pattern estratti da AdminDashboard (da riusare):

| Elemento | Pattern di riferimento |
|----------|------------------------|
| Container contenuto | `mx-auto w-full max-w-7xl px-4 md:px-6` |
| Padding verticale | `py-5 md:py-7` (adattivo, non fisso) |
| Gap header / blocchi | `gap-4 md:gap-5` |
| Nav a griglia | `grid-cols-3 sm:grid-cols-5` (collassa) |
| Stat card | `grid-cols-2 md:grid-cols-4` |
| Hero / titolo | padding `px-4 md:px-6` allineato al container |

`max-w-7xl` (1280px) è il **container standard di riferimento**. Le pagine Pro
che oggi usano `max-w-6xl` sono disallineate: quando le tocchi, allineale a
`max-w-7xl` salvo che il contenuto specifico richieda diversamente (in quel caso
documenta il perché in commento).

---

## 2. Sistema breakpoint

Mobile-first Tailwind nativo. Breakpoint ammessi nei componenti:

```
sm  640px   md  768px   lg  1024px   xl  1280px   2xl  1536px
```

Regole:
- **Mobile-first**: classi base = mobile, modifier (`md:`, `lg:`) per schermi grandi.
  Mai desktop-first (`max-md:` come default).
- Preferire `sm` / `md` / `lg`. `xl` / `2xl` solo se davvero serve.
- **645px** è un breakpoint custom JS (`matchMedia` in `AdminShell.tsx`) per il
  toggle drawer della sidebar — **non replicarlo nei componenti pagina**. È
  responsabilità esclusiva della shell.
- Le media query CSS custom in `index.css` (537px, 595px, 768px) servono **solo**
  alla compattazione di FullCalendar (`.booking-calendar-fc`). Non estenderle ad
  altri componenti — usare le classi Tailwind.
- Eccezioni calendario (23-05-26): documentate in
  **`docs/per-ui-design-skill/BOOKING_CALENDAR_LAYOUT_CONTEXT.md`** (fonte unica).
  In breve: tab Calendario `max-w-none px-1 md:px-1.5`; titolo con media query
  **400 / 470 / 640 / 768 px** in `index.css`; card titolo `max-w-7xl` via
  `CALENDAR_TITLE_SECTION_INSET_CLASS`; altezza celle mese via CSS var (non
  `dayMinHeight` FullCalendar).

---

## 3. Scala spacing raccomandata

Pattern guida (non scala rigida — coerenza con le pagine vicine ha priorità sul
valore esatto):

| Uso | Pattern raccomandato |
|-----|---------------------|
| Padding orizzontale pagina | `px-4 md:px-6` (tab Calendario: `px-1 md:px-1.5` + `max-w-none`) |
| Padding verticale pagina | `py-5 md:py-7` (preferito) — `py-6` accettato se già dominante nel file |
| Gap tra blocchi maggiori | `gap-4 md:gap-5` |
| Gap tra item lista/griglia | `gap-3 md:gap-4` |
| Padding interno card | `p-4 md:p-5` |

Quando una pagina esistente usa già un pattern coerente diverso, **mantieni la
coerenza locale** invece di forzare lo standard a metà file.

---

## 4. Pattern griglia responsive

Sempre mobile-first con collasso progressivo:

```
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3        // liste card / nav
grid-cols-2 md:grid-cols-4                        // stat card (rif. Classic)
```

Evitare grid che non collassano (`grid-cols-4` secco): su mobile rompono il layout.

---

## 5. Componenti UI base — note responsive

- **Modal** (`Modal.tsx` — LOCK z-index): size `sm→2xl` mappate a `max-w-*`.
  Su mobile occupa quasi tutto (`p-4` esterno). Non aggiungere larghezze custom:
  scegliere la `size` adatta. Non toccare lo stack z-index.
- **Button**: dimensioni fisse per `size`, nessun responsive interno. Per
  comportamento responsive (es. full-width su mobile) usare classi sul **chiamante**
  (`className="w-full sm:w-auto"`), mai modificare `Button.tsx`.
- **Card** (pattern inline, nessun `Card.tsx`): usare `p-4 md:p-5`.

---

## 6. Incongruenze note da sanare quando le incontri

Non fare un refactor di massa non richiesto. Ma se tocchi uno di questi file per
altro motivo, allinealo:

| Disallineamento | Dove | Target |
|-----------------|------|--------|
| _(nessuno aperto al 16-05-26)_ | — | — |

Sanati il 16-05-26 (uniformazione responsive):
- `max-w-6xl → max-w-7xl` su AdminHomePage, CrmPage, ServizioPage, AnalyticsPage.
- `py-6 → py-5 md:py-7` sulle stesse 4 pagine.
- Stat grid AdminHomePage: **resta `md:grid-cols-3`** per scelta — ci sono solo 3
  statistiche, una 4ª colonna resterebbe vuota su desktop (commento nel file).

---

## 7. Checklist prima di chiudere una modifica responsive

1. La pagina funziona a viewport pieno (sidebar trattata come overlay, non come
   sottrazione di spazio)?
2. Mobile-first: classi base mobile, modifier per schermi grandi?
3. Container = `max-w-7xl` (o motivo documentato per altro)?
4. Le griglie collassano su mobile (nessun `grid-cols-N` secco)?
5. Spacing coerente con il pattern di riferimento o con il file vicino?
6. Nessun breakpoint 645px custom dentro un componente pagina?
7. `npm run typecheck && npm run lint` verdi?
