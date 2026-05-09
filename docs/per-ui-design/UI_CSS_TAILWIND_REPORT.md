# Report tecnico UI/CSS/Tailwind (CalendarBackup-v2)

## Obiettivo del report

Questo documento serve a informare un altro agente su:

- come e dove viene gestito lo styling nell'app;
- come importare/integrare nuove librerie CSS, Tailwind o UI React;
- quali sono i punti di conflitto piu probabili quando si cambiano classi;
- quali accorgimenti seguire per migliorare estetica UI senza regressioni.

---

## 1) Stack styling attuale

### Framework e dipendenze rilevanti

- React + TypeScript + Vite.
- Tailwind CSS presente (`tailwindcss` + `@tailwindcss/postcss`).
- Utility di composizione classi: `clsx` + `tailwind-merge` via `cn()` in `src/lib/utils.ts`.
- Component primitives: `@radix-ui/react-select` (in `src/components/ui/Select.tsx`).
- Icone: `lucide-react`.
- CSS di terze parti importato: `react-toastify/dist/ReactToastify.css`.
- Styling FullCalendar gestito con override in `src/index.css`.

### Pipeline CSS

- Entry globale in `src/main.tsx` con `import './index.css'`.
- PostCSS configurato in `postcss.config.js` con:
  - `@tailwindcss/postcss`
  - `autoprefixer`
- Config Tailwind in `tailwind.config.js` con:
  - `content` su `index.html` e `src/**/*.{js,ts,jsx,tsx}`
  - `theme.extend` (palette `primary`, `status`, `booking`, font e shadow custom).

---

## 2) Architettura styling reale (a livelli)

L'app usa **4 livelli di styling contemporaneamente**:

1. **Tailwind utility classes inline** (prevalente nei componenti TSX).
2. **Classi CSS globali custom** in `src/index.css` (es. `.admin-nav-item`, `.booking-request-card-shell`, override FullCalendar).
3. **Inline style React** (`style={{ ... }}`) per gradienti, layout dinamico, fallback visivi.
4. **Blocchi `<style>{\`...\`}</style>` dentro componenti** (es. `DateInput`, `TimeInput`, `BookingRequestPage`), con selettori globali.

Conseguenza: il design e potente ma piu fragile. Ogni modifica classi va valutata considerando tutti i livelli.

---

## 3) Design tokens e sistema visuale corrente

### Token globali CSS variables (`src/index.css`)

In `:root` esistono variabili usate sia da CSS globale sia da utility arbitrarie Tailwind:

- Colori principali: `--color-primary`, `--color-primary-light`, `--color-primary-dark`.
- Surface/border/text: `--color-bg`, `--color-surface`, `--color-border`, `--color-text`.
- Feedback: `--color-success`, `--color-warning`, `--color-danger`, `--color-info`.
- Ombre: `--shadow-sm/md/lg/xl`.
- Tema admin: variabili `--theme-*`.
- Variabili specifiche wrap admin: `--admin-warm-wrap-border`, `--admin-warm-wrap-border-width`.

### Palette reale usata in UI

Non c'e un solo sistema coerente: convivono almeno tre vocabolari colore:

- `primary-*` / `slate-*` (piu vicino al design system base).
- classi warm custom (`text-warm-wood`, `border-warm-orange`, ecc.).
- classi legacy `al-ritrovo-*` (es. `bg-al-ritrovo-primary`).

Questo e il primo segnale di conflitto potenziale.

---

## 4) UI components e struttura corrente

### Layer base condiviso (`src/components/ui`)

Componenti base principali:

- `Button`, `Input`, `Textarea`, `Label`, `Modal`, `Select`, `DateInput`, `TimeInput`, `TimePicker24h`, `CollapsibleCard`.
- `Button` implementa varianti (`primary`, `secondary`, `danger`, `success`, `ghost`, `outline`).
- `Input` / `Textarea` hanno look standard `slate` e focus ring `primary`.
- `Select` e basato su Radix + classi Tailwind + alcuni style inline forzati.

### Layer feature specific (`src/features/booking/components`)

Molte schermate non usano solo componenti base, ma classi altamente custom:

- Dashboard admin (`AdminDashboard`, `BookingRequestCard`, `ArchiveTab`, `MenuPricesTab`, `RestaurantSettingsTab`, ecc.).
- Form pubblico (`BookingRequestPage`, `BookingRequestForm`, `MenuSelection`, `DietaryRestrictionsSection`).
- Forte uso di gradienti, blur, ombre e override puntuali.

Conclusione: c'e una base UI comune, ma ampie aree sono "feature-themed" e non pienamente centralizzate.

---

## 5) Pattern di composizione classi

### Utility `cn()`

In `src/lib/utils.ts`:

- `cn(...inputs)` = `twMerge(clsx(inputs))`.
- Questo evita conflitti Tailwind comuni (es. `px-2` + `px-4` -> resta l'ultima valida).

### Nota importante

`twMerge` risolve bene utility Tailwind standard, **non** risolve automaticamente conflitti tra:

- classi CSS custom globali (es. `.admin-nav-item`);
- classi non generate da Tailwind (token custom non definiti);
- style inline e classi con `!important`.

---

## 6) Conflitti attuali gia visibili nel codice

### A) Token classe probabilmente non mappati in Tailwind config

Nel codice ci sono classi come:

- `al-ritrovo-primary`, `al-ritrovo-primary-dark`
- `warm-wood`, `warm-wood-dark`, `warm-orange`, `warm-beige`, `terracotta`
- `bg-muted`
- `ring-offset-background`

In `tailwind.config.js` attuale non risultano definiti esplicitamente questi token.  
Rischio: classi non generate (o parzialmente efficaci), UI incoerente tra componenti.

### B) CSS globale + utility Tailwind in competizione

`src/index.css` contiene molti selettori specifici con hover/focus/animation e in alcuni casi `!important`.  
Se una feature cambia classi utility senza aggiornare il CSS globale correlato, si creano regressioni silenziose.

### C) `<style>` inline con scope globale

`DateInput` e `TimeInput` dichiarano blocchi CSS con selettori globali (`.date-input-container`, `.time-input-container`) e `!important`.  
Rischio:

- collisioni con classi omonime future;
- duplicazione di regole in runtime;
- difficile override da design system esterno.

### D) Z-index stack eterogeneo

- `Modal` usa `z-[10050]`.
- `ToastContainer` ha `style={{ zIndex: 100000 }}`.

Se si aggiungono nuove librerie dialog/popover senza governance z-index, si verificano overlay non cliccabili o elementi nascosti.

### E) Forte uso di `style={{...}}`

Gradienti e proprietà layout critiche sono spesso inline (`AdminDashboard`, `BookingRequestPage`, card varie).  
Questo riduce riuso, tematizzazione e override centralizzati.

---

## 7) Come importare nuove librerie CSS/Tailwind/UI in questo progetto

### Regola decisionale consigliata

- Se la libreria e solo utility/design token: integrare in `index.css` + Tailwind config.
- Se la libreria e component-based (Radix/shadcn/headless): usarla sopra il layer `src/components/ui`.
- Evitare import CSS "sparsi" nei feature component, salvo casi mirati.

### Procedura pratica (safe)

1. **Installare dipendenza** (`npm i ...`).
2. **Import CSS globale una sola volta**:
   - preferibilmente in `src/main.tsx` o in `src/index.css` (via `@import` se previsto).
3. **Mappare token colore/spacing al sistema attuale**:
   - allineare nuovi token a `:root` (`--color-*`, `--shadow-*`).
4. **Creare/adattare wrapper in `src/components/ui`**:
   - non usare la libreria nuova direttamente in tutte le feature.
5. **Evitare conflitti di naming**:
   - prefisso dedicato o convenzione chiara per classi custom.
6. **Verificare overlay/focus/animazioni**:
   - modal, popover, select, dropdown.
7. **Testare in entrambe le aree principali**:
   - dashboard admin e pagina pubblica prenotazione.

---

## 8) Impatto per cambi di classi (risk map)

### Alta criticita

- `src/index.css` (override globali, FullCalendar, classi admin condivise).
- `src/components/ui/Select.tsx` (Radix + classi/token misti + inline style).
- `src/pages/BookingRequestPage.tsx` (layout visuale ricco + style inline + classi warm).
- `src/features/booking/components/MenuPricesTab.tsx` / `ArchiveTab.tsx` / `BookingRequestCard.tsx` (forte densita classi custom).

### Media criticita

- `Button`, `Input`, `Textarea` (base UI; cambi qui impattano molte schermate).
- `Modal` (layering e accessibilita visiva).

### Bassa criticita

- componenti senza style custom complesso o senza dipendenze da classi globali specifiche.

---

## 9) Raccomandazioni operative per migliorare estetica senza rompere

1. Definire un **unico dizionario colori** (es. mantenere `primary` + introdurre ufficialmente `warm` o viceversa, non entrambi in modo implicito).
2. Formalizzare i token mancanti in Tailwind (o sostituire classi legacy con utility esistenti).
3. Ridurre gradualmente i blocchi `<style>` inline nei componenti, migrando a:
   - componenti UI riusabili;
   - classi globali con naming namespace (`booking-*`, `admin-*`).
4. Introdurre una mini policy z-index (es. tooltip < dropdown < modal < toast).
5. Centralizzare pattern di superficie (gradient card/header) in helper condivisi (come gia fatto con `ADMIN_WARM_GRADIENT_SURFACE`).
6. Prima di adottare nuova libreria, fare PoC su 1 componente non critico (es. un form field) e validare impatti.

---

## 10) Checklist per l'agente che dovra intervenire

- Verifica se i token classe usati sono realmente generati da Tailwind.
- Cerca collisioni tra classi utility e selettori globali in `index.css`.
- Controlla presenza di `!important` prima di dichiarare "classe non funziona".
- Se tocchi `Select`, valida focus, hover, portal layering e leggibilita.
- Se tocchi pagina pubblica, verifica background root/body e contrasto testo.
- Mantieni pattern `cn()` nei componenti e preferisci override via `className` in ingresso.
- Evita import multipli della stessa libreria CSS.

---

## 11) Sintesi finale (per handoff rapido)

Il progetto usa un sistema ibrido: Tailwind + CSS globale + inline style + componenti custom.  
La qualita visiva e alta ma la coerenza dei token non e ancora unificata (mix `primary`, `warm`, `al-ritrovo`).  
I maggiori rischi nei cambi di classi sono: token non definiti, override globali nascosti, `!important`, e layering overlay.

Per migliorare estetica UI in sicurezza: lavorare prima sul consolidamento del design system (token + componenti base), poi introdurre nuove librerie in modo progressivo e incapsulato.

