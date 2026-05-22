# Piano riscrittura UI — CalendarBackup-v2

> Versione: 2026-05-08 | Strategia: custom design system shadcn-inspired, migrazione progressiva

---

## Obiettivo

Sostituire il sistema UI attuale (ibrido a 4 livelli: Tailwind utility + CSS globale + inline style + `<style>` in-component) con un sistema **coerente, scalabile e modificabile**:

- unico vocabolario colori e token
- componenti base riusabili in `src/components/ui/`
- feature components che usano solo quei componenti base (no classi custom sparse)
- nessuna dipendenza nuova obbligatoria (shadcn come riferimento, non come requisito)

---

## Analisi rischio strutturale (rispondi prima di iniziare)

### Zone LOCKED — non toccare

| Componente | Motivo | Azione |
|---|---|---|
| `CollapsibleCard.tsx` | 57 test superati, LOCKED esplicitamente | Skip totale, solo aggiornamento token colori se necessario |
| `DateInput.tsx` | `<style>` block con selettori globali + `!important` | Black box: non riscrivere, solo allineare token |
| `TimeInput.tsx` | `<style>` block con selettori globali + `!important` | Black box: non riscrivere, solo allineare token |
| `TimePicker24h.tsx` | Dipende da DateInput/TimeInput | Tratta come black box |
| `Select.tsx` | Radix UI + inline style forzati + portal layering | Refactoring solo classi visive surface, mai logica |
| `Modal.tsx` | z-index `z-[10050]` calibrato rispetto al Toast (100000) | Aggiornare solo colori/radius, mai lo stack z-index |

### Zone a rischio MEDIO — refactoring safe

| Componente | Rischio | Approccio |
|---|---|---|
| `Button.tsx` | Usato ovunque — API stable | Tieni stessi props, aggiorna solo classi interne |
| `Input.tsx` | Impatta tutti i form | Tieni stessi props, aggiorna classi |
| `Textarea.tsx` | Idem Input | Idem |
| `Label.tsx` | Semplice, basso rischio | Riscrittura completa ok |

### Zone SICURE — scrittura nuovo

| Componente | Note |
|---|---|
| `Badge.tsx` | Non esiste, scrittura nuova |
| `Alert.tsx` | Non esiste, scrittura nuova |
| `Card.tsx` (+ sub) | Non esiste come sistema, scrittura nuova |
| `SectionHeader.tsx` | Non esiste, scrittura nuova |
| `EmptyState.tsx` | Non esiste, scrittura nuova |
| `Tabs.tsx` | Non esiste, scrittura nuova |
| `Separator.tsx` | Non esiste, scrittura nuova |
| `Spinner.tsx` | Non esiste, scrittura nuova |

---

## Problema principale da risolvere PRIMA di toccare i componenti

Il progetto ha **3 vocabolari colori** che convivono:

1. `primary-*` / `slate-*` — sistema base (Button, Input, Modal) — **quello da usare ovunque**
2. `warm-*` (warm-wood, warm-orange, warm-beige, terracotta) — tema brand del ristorante, solo pagine pubbliche — **da mantenere**
3. `al-ritrovo-*` — namespace legacy del ristorante di esempio — **da eliminare**

### Strategia `al-ritrovo-*` (decisione presa)

`al-ritrovo-primary` = alias di `primary-600` (#4F46E5). Stesso valore, nome sbagliato.

- **Sessione 1**: aggiungilo come alias in `tailwind.config.js` per non rompere `CollapsibleCard` (LOCKED)
- **Sessione 2**: sostituisci ogni occorrenza nei file non-LOCKED con `primary-600` / `primary-700`
- **Futuro**: quando `CollapsibleCard` verrà sbloccato e aggiornato, rimuovi l'alias dalla config

**Regola d'oro**: non scrivere mai `al-ritrovo-*` in nessun file nuovo. Se un agente lo propone, rifiuta.

**La token consolidation deve avvenire in `src/index.css` + `tailwind.config.js` PRIMA di riscrivere i componenti**, altrimenti ogni componente riscritto porterà token diversi.

---

## Fase 0 — Token consolidation (prerequisito)

**File da toccare**: `src/index.css`, `tailwind.config.js`

### Token da definire in `:root`

```css
/* Colori semantici — sistema unificato */
--color-primary:        #4f46e5;   /* indigo-600 */
--color-primary-hover:  #4338ca;   /* indigo-700 */
--color-primary-light:  #eef2ff;   /* indigo-50 */

--color-bg:             #f8fafc;   /* slate-50 */
--color-surface:        #ffffff;
--color-surface-muted:  #f1f5f9;   /* slate-100 */
--color-border:         #e2e8f0;   /* slate-200 */

--color-text:           #0f172a;   /* slate-900 */
--color-text-muted:     #64748b;   /* slate-500 */
--color-text-subtle:    #94a3b8;   /* slate-400 */

--color-success:        #10b981;
--color-warning:        #f59e0b;
--color-danger:         #ef4444;
--color-info:           #3b82f6;

/* Tema ristorante — mantieni se usato nelle pagine pubbliche */
--color-warm-primary:   #c2410c;   /* terracotta */
--color-warm-surface:   #fef3c7;   /* warm-beige */
--color-warm-border:    #f97316;   /* warm-orange */

/* Border radius */
--radius-sm:  0.375rem;  /* 6px */
--radius-md:  0.5rem;    /* 8px */
--radius-lg:  0.75rem;   /* 12px */
--radius-xl:  1rem;      /* 16px */
--radius-2xl: 1.5rem;    /* 24px */

/* Shadows */
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1);

/* Z-index stack — documentato */
--z-base:     0;
--z-sticky:   10;
--z-overlay:  50;
--z-dropdown: 100;
--z-modal:    10050;   /* non cambiare — calibrato su Toast 100000 */
--z-toast:    100000;
```

### Azione su `tailwind.config.js`

Aggiungere nei `theme.extend.colors`:
```js
primary: { DEFAULT: 'var(--color-primary)', hover: 'var(--color-primary-hover)', light: 'var(--color-primary-light)' },
surface: { DEFAULT: 'var(--color-surface)', muted: 'var(--color-surface-muted)' },
border: { DEFAULT: 'var(--color-border)' },
// Mantieni al-ritrovo-primary per retrocompat CollapsibleCard (LOCKED)
'al-ritrovo': { primary: '#c2410c', 'primary-dark': '#9a3412' },
```

---

## Fase 1 — Componenti NUOVI (nessun rischio regressione)

Crea nell'ordine:

### 1.1 Badge

```
src/components/ui/Badge.tsx
```

Varianti: `default | primary | success | warning | danger | info | outline`

Props: `variant`, `size` (sm/md), `className`, `children`

### 1.2 Alert

```
src/components/ui/Alert.tsx
```

Varianti: `success | warning | danger | info | default`

Props: `variant`, `title?`, `description?`, `icon?`, `onDismiss?`, `className`, `children`

### 1.3 Separator

```
src/components/ui/Separator.tsx
```

Props: `orientation` (horizontal/vertical), `className`

### 1.4 Spinner

```
src/components/ui/Spinner.tsx
```

Props: `size` (sm/md/lg), `className`

### 1.5 EmptyState

```
src/components/ui/EmptyState.tsx
```

Props: `icon?`, `title`, `description?`, `action?` (`{ label, onClick }`), `className`

### 1.6 SectionHeader

```
src/components/ui/SectionHeader.tsx
```

Props: `title`, `description?`, `icon?`, `actions?`, `className`

### 1.7 Card system

```
src/components/ui/Card.tsx
```

Esportazioni: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

Questo componente SOSTITUIRÀ progressivamente il pattern `<div className="bg-white border rounded-lg shadow-sm">` usato ovunque nei feature components.

---

## Fase 2 — Refactoring componenti ESISTENTI (stessa API, nuove classi)

**Regola**: non cambiare mai l'interfaccia props. Solo le classi CSS interne.

### 2.1 Button.tsx — PRIMO (benchmark)

Cambia solo la mappa `variants` e `sizes`. Stessa firma. Dopo il cambio: `npm run validate`.

### 2.2 Input.tsx

Allinea classi focus ring, border, radius ai nuovi token. Stessa firma.

### 2.3 Textarea.tsx

Idem Input.

### 2.4 Label.tsx

Allinea peso font e colore ai token. Stessa firma.

### 2.5 Modal.tsx — ULTIMO tra i base

Aggiornare solo classi surface (`bg-white`, `rounded-2xl`, `shadow-xl`, header border).
**NON TOCCARE**: z-index, portal logic, scroll lock, Escape handler.

---

## Fase 3 — Feature components: sostituzione progressiva

Ordine dal più sicuro al più critico. Una card per run Cursor.

| Priorità | Componente | Perché | Cosa cambiare |
|---|---|---|---|
| 1 | `SettingsTab.tsx` | Bassa visibilità | Sostituisci `<div className="bg-white border...">` con `<Card>` |
| 2 | `DietaryTab.tsx` | Bassa visibilità | Idem, aggiungi `<Badge>` per le etichette dietetiche |
| 3 | `MenuTab.tsx` | Media visibilità | `<Card>` + `<SectionHeader>` |
| 4 | `ArchiveTab.tsx` | Media visibilità | `<Card>` + `<EmptyState>` |
| 5 | `DetailsTab.tsx` | Media visibilità | `<SectionHeader>` + `<Badge>` status |
| 6 | `BookingRequestCard.tsx` | Alta visibilità | Sostituisci SOLO il wrapper visivo (`BOOKING_REQUEST_CARD_SHELL`), non toccare la logica expand/collapse, status, menu pricing |
| 7 | `PendingRequestsTab.tsx` | Alta criticità | Dopo BookingRequestCard è ok |
| 8 | `MenuSelection.tsx` (pagina pubblica) | Critici — ultimi | Verifica background e contrasto |
| 9 | `BookingRequestForm.tsx` (pagina pubblica) | Critici — ultimi | Idem |

---

## Fase 4 — Magic UI / effetti visivi (opzionale, dopo le fasi 0-3)

Solo dopo che il design system è stabile:

- Magic Card gradient → applica solo come variante di `Card.tsx`
- Shimmer Button → variante `shimmer` di `Button.tsx` (via CSS animation)
- Animated gradient border → utility class in `index.css`, non dipendenza

Usa il workflow: Magic UI (reference) → v0 (adapta) → Cursor (integra in `src/components/ui`).

---

## Regole operative per ogni run Cursor

1. Una fase per run. Mai due fasi in parallelo.
2. Dopo ogni file modificato: `npm run validate` (lint + typecheck + 29 test).
3. Mai toccare: migrazioni Supabase, TenantContext, hooks data-fetching, router.
4. Mai modificare API props di un componente esistente.
5. Ogni nuovo componente va in `src/components/ui/`.
6. Usa sempre `cn()` da `@/lib/utils`.
7. Se un test rompe, torna indietro. Non forzare con `--force` o `// @ts-ignore`.

---

## Checklist pre-PR per ogni fase

- [ ] `npm run validate` green
- [ ] `npm run build` senza errori
- [ ] Dashboard admin: apri e naviga tutte le tab
- [ ] Modal: apri/chiudi, Escape, overlay click
- [ ] Pagina pubblica prenotazione: form funziona end-to-end (solo dopo fase 3.8+)
- [ ] Mobile: verifica layout card su viewport 375px
