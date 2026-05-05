---
name: ui-card-aesthetics
description: >-
  Guida per modifiche estetiche su card e barre (allineamento, max-width, gradienti)
  nel progetto CalendarBackup-v2 con Tailwind v4 e setup legacy in src/index.css.
  Usare quando si chiedono centramenti card, sfondi sfumati, header colorati o
  “il CSS Tailwind non si applica” dopo aver aggiunto classi from-/to- sui gradienti.
disable-model-invocation: true
---

# Estetica card e superfici (Tailwind v4, progetto CalendarBackup-v2)

## Contesto tecnico

- **Tailwind**: v4 con PostCSS (`@tailwindcss/postcss`), entry in `src/index.css` con `@tailwind base/components/utilities` (stile legacy).
- **Effetto noto**: le utility di **fermata colore** sui gradienti (`from-*`, `via-*`, `to-*` su palette tipo `orange-100`) possono **non comparire nel CSS di build**; in pagina resta visibile solo lo sfondo del genitore (es. `bg-white`). La direzione `bg-gradient-to-r` sì, le fermate spesso no.
- **Verifica rapida**: dopo `npm run build`, cercare in `dist/assets/*.css` la stringa della classe (es. `from-orange-100`). Se assente, il browser non riceve i colori del gradiente.

## Allineamento card (contenuto centrato vs titolo sezione)

**Problema**: card con `width: 100%` e `maxWidth` fissa ma **senza** `margin-left/right: auto` restano attaccate a sinistra nel contenitore più largo del max.

**Pattern consigliato** (stesso filo di `MenuSelection.tsx` con titoli `h3`):

1. Wrapper per ogni card: `maxWidth: 'min(560px, calc(100% - 16px))'` (o equivalente Tailwind se emesso) + `marginLeft: 'auto'`, `marginRight: 'auto'`.
2. Allineare **max-width** e **padding orizzontale** con le intestazioni di sezione già centrate.

## Gradienti e sfondi sfumati

**Opzione A — Affidabile subito**: `style` inline sui elementi critici.

```tsx
style={{
  backgroundImage:
    'linear-gradient(90deg, rgb(255 237 213) 0%, rgb(255 247 237) 42%, rgb(254 249 195) 100%)',
  borderColor: 'rgba(253, 186, 116, 0.55)'
}}
```

Usare colori **espliciti** (`rgb`/`hex`) così non dipendono dal JIT.

**Opzione B**: classi Tailwind `bg-gradient-to-r from-… to-…` solo **dopo** aver verificato nel CSS di build che esistono le regole `.from-*` / `.to-*` corrispondenti; altrimenti preferire A o migrazione Tailwind v4 “full” (`@import "tailwindcss"` in `index.css`, fuori scope di una singola card).

## Barre header tipo AdminDashboard

- Il `<header>` può avere `bg-white`: la barra interna va trattata come sopra (gradiente con inline style se serve coerenza visiva garantita).
- Mantenere `rounded-xl`, `shadow-sm`, `border` sullo stesso nodo dove metti il gradiente, per coerenza con il resto dell’UI admin.

## Checklist operativa

1. Individuare il componente (es. `MenuSelection.tsx`, `AdminDashboard.tsx`).
2. Per **centratura**: controllare genitore (`flex`/`grid`), `w-full` sul figlio che “rompe” il centro, aggiungere `mx-auto` + `max-w` coerente.
3. Per **gradiente**: se le classi `from-*`/`to-*` non compaiono nel CSS build → inline `backgroundImage` o colore pieno `bg-*` che sì esiste nel bundle.
4. `npm run build` + controllo `dist/assets/*.css` se il comportamento è dubbio.

## Riferimenti file (esempi nel repo)

- Card menù allineate: `src/features/booking/components/MenuSelection.tsx` (wrapper con `maxWidth` + margini auto).
- Barra admin con gradiente inline: `src/pages/AdminDashboard.tsx` (top bar sotto `<header>`).
