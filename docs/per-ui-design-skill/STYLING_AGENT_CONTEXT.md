# Guida stile per agenti — CalendarBackup-v2

> Leggi questo file intero prima di toccare qualsiasi className o file CSS.
> Stack: React 18 + Vite + TypeScript + **Tailwind CSS v4** + Supabase.

---

## 1. Setup Tailwind v4 — CRITICO

Questo progetto usa **Tailwind v4**. Le regole sono diverse da v3.

### Come funziona il CSS

`src/index.css` inizia così:

```css
@import "tailwindcss";

@theme {
  --color-primary-600: #4F46E5;
  --color-primary-700: #4338CA;
  /* ... tutti i token custom */
}
```

**`tailwind.config.js` NON viene letto automaticamente in v4.**
I colori custom (`primary-*`, `status-*`, `warm-*`, ecc.) sono definiti nel blocco `@theme` dentro `src/index.css`. Se manca `@theme`, tutti i token custom risultano grigi/invisibili.

### Regole operative Tailwind v4

| Regola | Dettaglio |
|--------|-----------|
| **Classi letterali** | Tailwind genera solo classi che trova come stringhe complete nel codice. `bg-primary-600` ✅ — `` `bg-${color}-600` `` ❌ |
| **`!important`** | Sintassi v4: suffisso → `border-red-500!` **non** `!border-red-500` |
| **Classi morte** | Se una classe non è in `index.css` e non è un token Tailwind, non genera CSS. Verificare sempre prima di usare classi custom. |
| **CSS variables** | `bg-[var(--color-success)]` funziona sempre perché usa valori CSS runtime, non statici. |

### Token colore disponibili

**Dashboard admin** → usare sempre `primary-*`:

| Token | Valore | Uso |
|-------|--------|-----|
| `bg-primary-600` | #4F46E5 | azione principale |
| `bg-primary-700` | #4338CA | hover |
| `bg-primary-50` | #EEF2FF | background leggero |
| `text-primary-600` | #4F46E5 | testo/link |
| `bg-status-pending` | #F59E0B | prenotazione in attesa |
| `bg-status-accepted` | #10B981 | prenotazione accettata |
| `bg-status-rejected` | #EF4444 | prenotazione rifiutata |

**Pagina pubblica** → usare `warm-*` e `terracotta`:

| Token | Valore | Uso |
|-------|--------|-----|
| `text-warm-wood` | #6B4226 | testo principale pagina pubblica |
| `text-warm-wood-dark` | #4A2D19 | testo secondario |
| `bg-warm-orange` | #F97316 | accento caldo |
| `text-warm-orange` | #F97316 | icone/accento |
| `bg-warm-beige` | #FEF3C7 | sfondo caldo |
| `text-terracotta` | #C2410C | titoli caldi |

**CSS variables** (sempre disponibili, definite in `:root`):

```
--color-success   #10B981    --color-danger    #EF4444
--color-warning   #F59E0B    --color-info      #3B82F6
--color-text      #0F172A    --color-text-muted #64748B
--color-border    #E2E8F0    --color-surface    #FFFFFF
```

---

## 2. Componenti UI — vocabolario

### Button — mai riscrivere, mai toccare `Button.tsx`

Quando devi cambiare un bottone: **cambia solo il `variant` nel file chiamante**.

```tsx
// Cambia QUESTO nel file che usa il bottone:
<Button variant="primary" size="sm">Testo</Button>
//              ↑ solo questo
```

**Varianti disponibili:**

| Variant | Aspetto | Quando usarlo |
|---------|---------|---------------|
| `primary` | indigo pieno, testo bianco, ombra | azione principale |
| `secondary` | grigio chiaro, bordo sottile | azione secondaria |
| `danger` | rosso, testo bianco | elimina / rifiuta |
| `success` | verde, testo bianco | conferma / accetta |
| `ghost` | trasparente, hover grigio | azione terziaria |
| `outline` | bordo indigo, sfondo trasparente | alternativa primary |

**Sizes:** `sm` · `md` (default) · `lg` · `icon`

> Se un bottone appare grigio dopo una modifica: verificare che `@import "tailwindcss"` e il blocco `@theme` siano presenti all'inizio di `src/index.css`.

### Componenti UI esistenti (non riscrivere)

| Componente | File | Note |
|-----------|------|------|
| `<Button>` | `src/components/ui/Button.tsx` | varianti sopra |
| `<Input>` | `src/components/ui/Input.tsx` | forwardRef + cn() |
| `<Textarea>` | `src/components/ui/Textarea.tsx` | |
| `<Select>` | `src/components/ui/Select.tsx` | Radix UI |
| `<Modal>` | `src/components/ui/Modal.tsx` | **NON toccare z-index**. Titolo h2 interno usa `text-title-modal` — non passare className aggiuntive per ridimensionare il titolo |
| `<Card>` `<CardHeader>` ecc. | `src/components/ui/Card.tsx` | sistema card completo |
| `<Badge>` | `src/components/ui/Badge.tsx` | varianti: default/primary/success/warning/danger/info/outline |
| `<Alert>` | `src/components/ui/Alert.tsx` | varianti: default/success/warning/danger/info |
| `<EmptyState>` | `src/components/ui/EmptyState.tsx` | stati zero-data |
| `<Spinner>` | `src/components/ui/Spinner.tsx` | sm/md/lg |
| `<SectionHeader>` | `src/components/ui/SectionHeader.tsx` | titolo sezione con azioni |
| `<Separator>` | `src/components/ui/Separator.tsx` | linea divisoria |
| `<CollapsibleCard>` | `src/components/ui/CollapsibleCard.tsx` | **LOCKED — non toccare** |
| `<NotifyNavShinyLayers>` | `src/components/ui/NotifyNavShinyLayers.tsx` | Solo **tab Prenotazioni con badge** nella nav admin (shiny + bordo). Interno al `button` del `NavItem`. |

### Utility

```tsx
import { cn } from '@/lib/utils'   // clsx + tailwind-merge — sempre usare questo
// Mai usare clsx() o twMerge() direttamente
```

---

## 3. Zone LOCKED — non toccare mai

| File | Motivo |
|------|--------|
| `CollapsibleCard.tsx` | 57 test, LOCKED |
| `DateInput.tsx` | `<style>` globali con `!important` |
| `Modal.tsx` | z-index calibrato con Toast — mai cambiare `z-[10050]` |
| `TenantContext.tsx` | core multi-tenancy |
| `src/lib/supabase.ts` | client autenticato |
| `supabase/migrations/` | DB remoto già applicato |

---

## 4. Regole operative

### Cosa fare per modificare uno stile

1. **Bottone**: cambia `variant` o `size` nel file chiamante. Fine.
2. **Colore su elemento**: usa token Tailwind (`bg-primary-600`, `text-warm-wood`) o CSS var (`bg-[var(--color-success)]`). Non aggiungere CSS in `index.css`.
3. **Spacing/layout**: usa classi Tailwind standard (`px-4`, `gap-3`, `rounded-xl`).
4. **Animazione**: usa `animate-fade-in` (definita in `index.css`) o classi Tailwind native. Per la nav admin, effetti notify (shiny/pulse) sono in `index.css` (classi `admin-nav-notify-*`).

### Anti-pattern da evitare

```tsx
// ❌ NON costruire classi dinamicamente
const cls = `bg-${color}-600`          // Tailwind non la genera

// ❌ NON aggiungere CSS in index.css per bottoni o colori base
.my-button { background: #4F46E5 }     // usa variant="primary"

// ❌ NON usare sintassi !important v3 in classi Tailwind
className="!border-red-500"            // ❌ v3
className="border-red-500!"            // ✅ v4

// ❌ NON usare style={{}} per valori che Tailwind copre
style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}   // ❌
className="bg-white/30"                                 // ✅

// ✅ USA style={{}} solo per valori senza equivalente Tailwind
style={{ fontSize: 'clamp(1.4rem, 2.8vw, 1.8rem)' }}  // ✅ clamp non ha token

```

### Tab nav admin (dashboard)

- Stato **attivo**: `<button>` con classi Tailwind / `.admin-nav-item` come in `AdminDashboard`, non varianti inventate su `<Button>`.
- Bordo warm allineato al resto dell’admin: `border-[color:var(--admin-warm-wrap-border)]` da `:root` in `index.css`, non RGB hardcoded nel TSX se esiste già la variabile.
- Sfondo tab: classe `.admin-nav-item` e `--admin-warm-gradient` in `:root` per coerenza con le altre superfici warm.
- Icona attiva: token `text-primary-900`; badge conteggio: `bg-primary-600` (vedi tabella **Dashboard admin** sopra).
- Tab **Prenotazioni** con notifiche: `notifyHighlight` + `<NotifyNavShinyLayers />` e `admin-nav-notify-pulse-wrap` (vedi `AdminDashboard`).

### Pattern corretti

```tsx
// Glassmorphism
className="bg-white/30 backdrop-blur-[16px] rounded-2xl"

// Card admin standard
className="rounded-xl border shadow-sm p-5 bg-white"

// Stato badge prenotazione
<Badge variant="warning">In Attesa</Badge>
<Badge variant="success">Accettata</Badge>
<Badge variant="danger">Rifiutata</Badge>

// Input frosted (pagina pubblica)
className="bg-white/85 backdrop-blur-[1px] px-4 rounded-xl font-medium"

// Overlay scuro su sfondo
className="fixed inset-0 z-0 bg-black/15"
```

---

## 5. Due client Supabase — non mischiare

| Client | File | Uso |
|--------|------|-----|
| `supabase` | `src/lib/supabase.ts` | operazioni admin (persistSession: true) |
| `supabasePublic` | `src/lib/supabasePublic.ts` | form pubblici (persistSession: false) |

---

## 6. Dopo ogni modifica

```bash
npm run typecheck    # deve passare senza errori
npm run lint         # zero warning tollerati
```

Per PR: `npm run validate` (lint + typecheck + test).

Conventional commits: `feat(scope):` · `fix(scope):` · `update(scope):`
