# UI Language Bridge — da parole tue a prompt v0

> Usa questo file prima di scrivere un prompt a v0.
> Trova la parola che usi tu → guarda la colonna destra → usala nel prompt.
> Abbinalo sempre a `docs/UI_COMPONENT_ALPHABET.md` per i nomi dei componenti.

---

## 0. "Rendi questo bottone un primary button" — definizione esatta

Quando un agente sente questa frase deve fare **una sola cosa**: cambiare il prop `variant` nel file chiamante.

```tsx
// PRIMA (qualsiasi variant)
<Button variant="success" size="sm" ...>Testo</Button>

// DOPO
<Button variant="primary" size="sm" ...>Testo</Button>
```

**Non toccare `Button.tsx`, non toccare `index.css`.**

### Come appare un primary button

- Sfondo: indigo `#4F46E5` (`bg-primary-600`)
- Hover: indigo scuro `#4338CA` (`hover:bg-primary-700`)
- Testo: bianco (`text-white`)
- Angoli: molto arrotondati (`rounded-xl` = 12px)
- Font: grassetto (`font-semibold`)
- Ombra: `shadow-md`, cresce a `hover:shadow-lg`
- Click: si schiaccia leggermente (`active:scale-[0.98]`)
- Focus: anello indigo (`focus:ring-primary-500`)

### Classi complete generate da `variant="primary"`

```
// base (sempre applicato)
inline-flex items-center justify-center font-semibold rounded-xl
transition-all duration-200 focus:outline-none focus:ring-2
focus:ring-offset-2 active:scale-[0.98]

// variant primary
bg-primary-600 hover:bg-primary-700 text-white
focus:ring-primary-500 shadow-md hover:shadow-lg

// size md (default)
px-4 py-2.5 text-sm gap-2

// size sm
px-3 py-1.5 text-sm gap-1.5

// size lg
px-6 py-3 text-base gap-2
```

> **Come funziona il colore**: `bg-primary-600` è definito in `@theme` dentro `src/index.css`
> (Tailwind v4 — non leggere `tailwind.config.js` automaticamente).
> Il valore è `#4F46E5`. Se il bottone appare grigio, verificare che
> `@import "tailwindcss"` e il blocco `@theme` siano presenti in `src/index.css`.

---

## 1. Come si chiama quello che voglio fare?

| Tu dici | Si chiama | Note |
|---|---|---|
| scheda / riquadro | **Card** | `src/components/ui/Card.tsx` |
| bottone | **Button** | già esiste, non riscrivere |
| etichetta colorata / pillola | **Badge** | da creare in Fase 1 |
| messaggio di errore / avviso verde o rosso | **Alert** | da creare in Fase 1 |
| campo dove si scrive | **Input** | già esiste |
| campo testo lungo / note | **Textarea** | già esiste |
| tendina / menu a discesa | **Select** | già esiste, Radix UI |
| finestra che appare sopra tutto | **Modal** | già esiste, non toccare z-index |
| sezione che si apre e chiude | **CollapsibleCard** | LOCKED — non toccare |
| intestazione di sezione con titolo | **SectionHeader** | da creare in Fase 1 |
| schermata "nessun risultato" | **EmptyState** | da creare in Fase 1 |
| cerchio che gira (caricamento) | **Spinner** | da creare in Fase 1 |
| linea separatrice | **Separator** | da creare in Fase 1 |
| notifica che appare in basso | **Toast** | già esiste via react-toastify |
| menu a linguette | **Tabs** | da creare in Fase 1 |

---

## 2. Come appare visivamente?

| Tu dici | Termine tecnico per v0 | Esempio da aggiungere al prompt |
|---|---|---|
| più arrotondato / morbido | border-radius alto | `"use rounded-xl or rounded-2xl"` |
| più squadrato / rigido | border-radius basso | `"use rounded-md or rounded-sm"` |
| piatto / senza ombra | no shadow | `"no box shadow, flat design"` |
| con ombra leggera | shadow soft | `"add a soft shadow: shadow-sm or shadow-md"` |
| con ombra importante / che si alza | shadow pronunciata | `"add shadow-lg on hover"` |
| effetto vetro / trasparente | glassmorphism | `"glassmorphism: bg-white/20 backdrop-blur-md border border-white/30"` |
| sfumato / con gradiente | gradient background | `"gradient background from-X to-Y"` |
| bordo colorato | colored border | `"border-2 border-primary-500"` |
| bordo che brilla | glow border | `"box-shadow: 0 0 0 2px primary-500 with glow"` |
| sfondo quasi trasparente | low opacity background | `"bg-primary-50 or bg-white/60"` |
| molto bianco / pulito | clean white surface | `"bg-white, no gradient, minimal"` |
| testo grassetto | font bold | `"font-semibold or font-bold"` |
| testo leggero / sottile | font light | `"font-normal or font-light"` |
| testo più grande | font size up | `"text-base or text-lg"` |
| testo più piccolo | font size down | `"text-sm or text-xs"` |
| icona + testo affiancati | icon with label | `"flex items-center gap-2 with lucide icon"` |
| solo icona | icon button | `"icon-only, size='icon', p-2"` |

---

## 3. Come si muove / che animazione voglio?

| Tu dici | Termine tecnico per v0 | Esempio da aggiungere al prompt |
|---|---|---|
| appare piano piano | fade in | `"fade-in animation: opacity 0→1 over 200ms"` |
| scivola da sotto | slide up | `"slide-up: translateY(8px)→0 with opacity"` |
| scivola da destra | slide in from right | `"translateX(100%)→0 on enter"` |
| brilla / shimmer | shimmer animation | `"shimmer effect: CSS animation with gradient sweep"` |
| lampeggia piano | pulse | `"pulse animation: opacity 1→0.6→1 loop"` |
| rimbalza | bounce | `"bounce on appear: scale 0.8→1.05→1"` |
| si alza quando ci passo sopra | lift on hover | `"hover:translateY(-2px) hover:shadow-lg transition-all"` |
| si ingrandisce quando ci passo sopra | scale on hover | `"hover:scale-105 transition-transform"` |
| cambia colore quando ci passo sopra | color on hover | `"hover:bg-primary-700 transition-colors duration-200"` |
| nessuna animazione / statico | no animation | `"no animation, no transition, static"` |
| animazione ridotta (accessibilità) | respect reduced motion | `"@media prefers-reduced-motion: skip animation"` |
| gira su se stesso (loading) | spin | `"animate-spin"` |
| bordo che gira intorno | animated border | `"conic-gradient rotating border animation"` |

---

## 4. Che colore voglio?

| Tu dici | Token da usare | Valore hex |
|---|---|---|
| colore principale dell'app / indigo / blu viola | `primary-600` | #4F46E5 |
| versione chiara del colore principale | `primary-50` o `primary-100` | #EEF2FF |
| versione scura del colore principale | `primary-700` o `primary-800` | #4338CA |
| verde (conferma / accetta / successo) | `--color-success` | #10B981 |
| rosso (errore / rifiuta / pericolo) | `--color-danger` | #EF4444 |
| giallo / arancio (attenzione / warning) | `--color-warning` | #F59E0B |
| blu info / neutro | `--color-info` | #3B82F6 |
| grigio testo principale | `--color-text` | #0F172A |
| grigio testo secondario / label | `--color-text-muted` | #64748B |
| grigio testo leggerissimo / placeholder | `--color-text-light` | #94A3B8 |
| sfondo bianco / superficie | `--color-surface` | #FFFFFF |
| sfondo grigio chiaro / muted | `muted` | #F1F5F9 |
| bordo grigio | `--color-border` | #E2E8F0 |
| colore caldo del ristorante (solo pagina pubblica) | `warm-orange` | #F97316 |
| terracotta / rosso caldo (solo pagina pubblica) | `terracotta` | #C2410C |
| marrone legno (solo pagina pubblica) | `warm-wood` | #6B4226 |

> **Regola**: nella dashboard admin usa sempre `primary-*`. Nei componenti pubblici (pagina prenotazione) puoi usare `warm-*` e `terracotta`.

---

## 5. Come è organizzato lo spazio?

| Tu dici | Termine tecnico per v0 | Esempio da aggiungere al prompt |
|---|---|---|
| in fila / affiancati | flex row | `"flex flex-row items-center gap-3"` |
| in colonna / uno sotto l'altro | flex column | `"flex flex-col gap-4"` |
| centrato | centered | `"flex items-center justify-center"` |
| a sinistra | left aligned | `"justify-start or text-left"` |
| a destra | right aligned | `"justify-end or text-right"` |
| uno a sinistra uno a destra | space between | `"flex justify-between items-center"` |
| in griglia / affiancati a colonne | grid | `"grid grid-cols-2 gap-4" or "grid grid-cols-3"` |
| che si adatta al telefono | responsive | `"mobile-first: stack on mobile, side by side on md+"` |
| padding interno | padding | `"p-4 (16px) or p-6 (24px)"` |
| spazio tra gli elementi | gap | `"gap-2 (8px), gap-4 (16px), gap-6 (24px)"` |
| occupa tutta la larghezza | full width | `"w-full"` |
| larghezza fissa | fixed width | `"w-64 or max-w-sm"` |

---

## 6. Come reagisce all'utente?

| Tu dici | Termine tecnico per v0 | Esempio da aggiungere al prompt |
|---|---|---|
| quando ci passo sopra | hover state | `"hover:bg-primary-700"` |
| quando clicco / premo | active state | `"active:scale-[0.98] active:opacity-90"` |
| quando è selezionato / attivo | selected / active | `"data-[state=active]:bg-primary-600 data-[state=active]:text-white"` |
| quando è disabilitato / non cliccabile | disabled state | `"disabled:opacity-50 disabled:cursor-not-allowed"` |
| quando ci metto il cursore dentro (input) | focus state | `"focus:ring-2 focus:ring-primary-500 focus:outline-none"` |
| dà feedback visivo al click | click feedback | `"active:scale-[0.98] transition-transform duration-100"` |
| che si evidenzia | highlight | `"ring-2 ring-primary-500 or bg-primary-50"` |

---

## 7. Template prompt v0 — costruiscilo pezzo per pezzo

Copia questo template e riempi le righe con le parole della tabella sopra:

```
[INCOLLA PRIMA IL BLOCCO SETUP PROGETTO — vedi sotto]

Task: Create a [NOME COMPONENTE da sezione 1] component.

Visual style:
- Shape: [arrotondato → rounded-xl | squadrato → rounded-md]
- Surface: [bianco pulito | sfumato | vetro | con ombra leggera]
- Border: [bordo sottile grigio | bordo colorato primary | nessun bordo]

Colors:
- Primary color: [colore da sezione 4]
- Background: [colore da sezione 4]
- Text: [colore da sezione 4]

Animation:
- On appear: [nessuna | fade in | slide up]
- On hover: [nessuna | si alza | cambia colore | si ingrandisce]
- On click: [nessuna | click feedback leggero]

Layout:
- Content arrangement: [in fila | in colonna | griglia]
- Spacing: [compatto | normale | spaziato]
- Width: [occupa tutta la larghezza | larghezza automatica]

Variants needed:
- [elenca le varianti che vuoi, es: default / primary / success / danger]

Props needed:
- variant: [lista varianti]
- size?: [sm | md | lg]
- className?: string (always include for overrides)
- children: ReactNode

Output:
1. Full component file for src/components/ui/[NomeComponente].tsx
2. Example usage
3. Any tailwind.config.js additions needed (if any)
```

---

## 8. Blocco setup progetto per v0 — incollalo sempre per primo

```
Project context — read this before generating anything:

- Framework: React 18 + Vite (NOT Next.js)
- Language: TypeScript
- Styling: Tailwind CSS v4
- Utility: cn() from "@/lib/utils" (clsx + tailwind-merge)
- Icons: lucide-react
- No server components, no app router, no Next.js APIs
- Components go in: src/components/ui/
- Color tokens: primary-50→900, status (pending/accepted/rejected),
  warm (wood/orange/beige/terracotta), muted (#f1f5f9), background (#fff)
- Always accept className as prop
- No new dependencies unless strictly necessary
- No inline <style> blocks
- No global CSS additions

Confirm you understand before I give you the task.
```

---

## 9. Segnali che v0 ha sbagliato stack — cosa cercare nel codice

| Vedi nel codice generato | Problema | Cosa dire a v0 |
|---|---|---|
| `"use client"` | Next.js directive | `"Remove 'use client', this is Vite"` |
| `import ... from 'next/...'` | Next.js import | `"Replace with React/browser equivalent"` |
| `export default async function` | Server component | `"Make it a regular React function component"` |
| `useRouter` da `next/navigation` | Next.js router | `"Remove, I don't need routing in this component"` |
| `import ... from '@/components/ui/...'` con nomi shadcn | shadcn import | `"Don't import from shadcn — write the component inline"` |
| `npx shadcn@latest add ...` | shadcn install | `"Don't use shadcn CLI — give me the full component code"` |
| classi tipo `bg-background`, `text-foreground` | token shadcn | `"Replace with: bg-white, text-slate-900"` |
| `framer-motion` o `motion` | nuova dipendenza | `"Rewrite using CSS animation only, no framer-motion"` |

---

## 10. Esempio completo — Badge con shimmer

**Tu dici a Claude Code (qui):**
> "Voglio un Badge con un effetto shimmer sul variant primary, piccolo e arrotondato"

**Claude Code traduce e costruisce il prompt v0:**

```
[BLOCCO SETUP PROGETTO]

Task: Create a Badge component for src/components/ui/Badge.tsx.

Visual style:
- Shape: very rounded, use rounded-full
- Surface: solid background color per variant
- Border: none (except outline variant)

Animation:
- On appear: none
- Hover: none
- Special: the 'primary' variant has a subtle shimmer animation
  (CSS keyframe with gradient sweep, no framer-motion)

Colors per variant:
- default:  bg-slate-100, text-slate-700
- primary:  bg-primary-600, text-white (+ shimmer)
- success:  bg-emerald-100, text-emerald-700
- warning:  bg-amber-100, text-amber-700
- danger:   bg-red-100, text-red-700
- outline:  bg-transparent, border-2 border-current, text-current

Props:
- variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline'
- size: 'sm' | 'md'  (sm = text-xs px-2 py-0.5 / md = text-sm px-2.5 py-1)
- className?: string
- children: ReactNode

Output:
1. Full component file
2. Example usage showing all variants
3. The shimmer must be a CSS @keyframes inside a <style> tag in the component
   OR preferably as a Tailwind arbitrary animation — whichever works without global CSS
```
