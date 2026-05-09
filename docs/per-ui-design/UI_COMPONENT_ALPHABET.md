# Alfabeto dei componenti UI — CalendarBackup-v2

> Documento di riferimento per sessioni Cursor. Leggi questo file prima di dare qualsiasi prompt UI.
> Stack: React 18 + Vite + TypeScript + Tailwind CSS v4 + cn() da @/lib/utils

---

## Le lettere dell'alfabeto (componenti primitivi)

Questi sono i mattoni base. Ogni feature component deve essere costruito SOLO con questi.

### A — Alert

**Scopo**: feedback visivo contestuale (errore, successo, avviso, info)  
**File**: `src/components/ui/Alert.tsx`  
**Quando usarlo**: messaggi di stato inline (non modal, non toast)

```tsx
<Alert variant="danger" title="Errore" description="Prenotazione non trovata." />
<Alert variant="success">Prenotazione confermata.</Alert>
<Alert variant="warning" onDismiss={() => setVisible(false)}>
  Capienza quasi raggiunta.
</Alert>
```

**Varianti**: `default | success | warning | danger | info`  
**Props**: `variant`, `title?`, `description?`, `icon?`, `onDismiss?`, `className`, `children`

---

### B — Badge

**Scopo**: etichetta inline di stato o categoria  
**File**: `src/components/ui/Badge.tsx`  
**Quando usarlo**: status prenotazione, tipo evento, etichette dietetiche

```tsx
<Badge variant="warning">In Attesa</Badge>
<Badge variant="success">Accettata</Badge>
<Badge variant="danger">Rifiutata</Badge>
<Badge variant="primary" size="sm">Cena</Badge>
<Badge variant="outline">Vegetariano</Badge>
```

**Varianti**: `default | primary | success | warning | danger | info | outline`  
**Sizes**: `sm | md`  
**Props**: `variant`, `size`, `className`, `children`

---

### Bu — Button

**Scopo**: azione primaria, secondaria, distruttiva, ghost  
**File**: `src/components/ui/Button.tsx` (ESISTE GIÀ — non riscrivere da zero)  
**API già definita — non cambiare le props**

```tsx
<Button variant="primary">Accetta</Button>
<Button variant="danger" size="sm">Rifiuta</Button>
<Button variant="ghost" size="icon"><X /></Button>
<Button variant="outline" fullWidth>Vedi dettagli</Button>
<Button variant="secondary" disabled>Non disponibile</Button>
```

**Varianti**: `primary | secondary | danger | success | ghost | outline`  
**Sizes**: `sm | md | lg | icon`  
**Props**: `variant`, `size`, `fullWidth`, `disabled`, + tutti gli attributi HTML `<button>`

---

### C — Card (sistema completo)

**Scopo**: contenitore visivo per unità di contenuto  
**File**: `src/components/ui/Card.tsx`  
**Quando usarlo**: sostituisce `<div className="bg-white border border-gray-200 rounded-lg shadow-sm">`

```tsx
<Card>
  <CardHeader>
    <CardTitle>Prenotazione #123</CardTitle>
    <CardDescription>Martedì 10 giugno — 20:00</CardDescription>
  </CardHeader>
  <CardContent>
    {/* contenuto */}
  </CardContent>
  <CardFooter>
    <Button variant="primary">Accetta</Button>
    <Button variant="secondary">Rifiuta</Button>
  </CardFooter>
</Card>
```

**Esportazioni**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`  
**Props di Card**: `className`, `children`, `asChild?`  
**Varianti Card opzionali**: `default | elevated | outlined | muted`

---

### E — EmptyState

**Scopo**: placeholder quando una lista è vuota  
**File**: `src/components/ui/EmptyState.tsx`  
**Quando usarlo**: liste senza risultati, stati zero-data

```tsx
<EmptyState
  icon={Calendar}
  title="Nessuna prenotazione"
  description="Non ci sono richieste in attesa."
  action={{ label: "Aggiorna", onClick: refetch }}
/>
```

**Props**: `icon?`, `title`, `description?`, `action?` (`{ label, onClick }`), `className`

---

### I — Input

**Scopo**: campo testo singola riga  
**File**: `src/components/ui/Input.tsx` (ESISTE GIÀ)  
**API già definita — non cambiare le props**

```tsx
<Input placeholder="Nome ospite" value={name} onChange={...} />
<Input type="email" error="Email non valida" />
<Input disabled value="Valore fisso" />
```

---

### L — Label

**Scopo**: etichetta associata a un campo form  
**File**: `src/components/ui/Label.tsx` (ESISTE GIÀ)

```tsx
<Label htmlFor="email">Email</Label>
<Label required>Nome *</Label>
```

---

### Mo — Modal

**Scopo**: dialogo sovrapposto con overlay  
**File**: `src/components/ui/Modal.tsx` (ESISTE GIÀ — NON TOCCARE z-index)  
**ATTENZIONE**: usa `z-[10050]`, calibrato rispetto a Toast (100000). Non cambiare mai.

```tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Conferma rifiuto" size="md">
  {/* body */}
</Modal>
```

**Sizes**: `sm | md | lg | xl`

---

### Se — Select

**Scopo**: dropdown selezione singola  
**File**: `src/components/ui/Select.tsx` (ESISTE GIÀ — basato su Radix UI)  
**ATTENZIONE**: non sostituire il componente. Aggiorna solo le classi surface se necessario.

---

### Sh — SectionHeader

**Scopo**: intestazione di sezione con titolo, descrizione opzionale, azioni opzionali  
**File**: `src/components/ui/SectionHeader.tsx`  
**Quando usarlo**: intestazione di ogni tab, sezione form, pannello settings

```tsx
<SectionHeader
  title="Impostazioni ristorante"
  description="Configura nome, orari e capacità."
  icon={Settings}
  actions={<Button size="sm" variant="outline">Modifica</Button>}
/>
```

**Props**: `title`, `description?`, `icon?`, `actions?`, `className`

---

### Sp — Spinner

**Scopo**: indicatore di caricamento  
**File**: `src/components/ui/Spinner.tsx`

```tsx
<Spinner size="md" />
<Spinner size="sm" className="text-primary-600" />
```

**Sizes**: `sm | md | lg`

---

### T — Textarea

**Scopo**: campo testo multiriga  
**File**: `src/components/ui/Textarea.tsx` (ESISTE GIÀ)

```tsx
<Textarea placeholder="Note aggiuntive..." rows={4} value={notes} onChange={...} />
```

---

### Sep — Separator

**Scopo**: linea divisoria orizzontale o verticale  
**File**: `src/components/ui/Separator.tsx`

```tsx
<Separator />
<Separator orientation="vertical" className="h-6" />
```

---

## Parole (pattern di composizione)

### Pattern: card-list (lista di card)

```tsx
<div className="flex flex-col gap-4">
  {bookings.map(b => (
    <Card key={b.id}>
      <CardHeader>
        <CardTitle>{b.name}</CardTitle>
        <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
      </CardHeader>
      <CardContent>{/* dettagli */}</CardContent>
      <CardFooter>
        <Button variant="primary" size="sm">Accetta</Button>
        <Button variant="danger" size="sm">Rifiuta</Button>
      </CardFooter>
    </Card>
  ))}
</div>
```

### Pattern: section-with-empty-state

```tsx
<div>
  <SectionHeader title="Prenotazioni pendenti" icon={Clock} />
  {bookings.length === 0
    ? <EmptyState icon={Calendar} title="Nessuna richiesta" />
    : <div className="flex flex-col gap-4">{/* cards */}</div>
  }
</div>
```

### Pattern: form-row

```tsx
<div className="flex flex-col gap-1.5">
  <Label htmlFor="name">Nome</Label>
  <Input id="name" value={name} onChange={...} />
</div>
```

### Pattern: status-badge in card

```tsx
const STATUS_VARIANT = {
  pending:  'warning',
  accepted: 'success',
  rejected: 'danger',
} as const

<Badge variant={STATUS_VARIANT[booking.status]}>
  {STATUS_LABEL[booking.status]}
</Badge>
```

### Pattern: alert-in-form (validazione)

```tsx
{error && <Alert variant="danger" description={error} />}
```

---

## Token visivi (vocabolario colori)

Questi sono gli unici nomi di colore accettati nei nuovi componenti.

```
primary         → azioni principali, link attivi, focus ring
primary-hover   → hover su primary
primary-light   → background leggero primary (es. badge outline)

surface         → background card/modal
surface-muted   → background sezione header, input disabled

border          → linee divisorie, bordi input/card

text            → testo principale
text-muted      → label secondarie, descrizioni
text-subtle     → placeholder, note terziarie

success         → conferme, accetta
warning         → attenzione, pending
danger          → errore, rifiuta, elimina
info            → informazioni neutre

warm-primary    → SOLO pagine pubbliche con tema ristorante
warm-surface    → SOLO pagine pubbliche con tema ristorante
warm-border     → SOLO pagine pubbliche con tema ristorante
```

**Token DEPRECATI** (non usare nei nuovi componenti):
- `al-ritrovo-*` — namespace legacy del ristorante di esempio. Mappa a `primary-600`/`primary-700`.
  Esiste in config SOLO come alias di compatibilità per `CollapsibleCard` (LOCKED).
  In tutti gli altri file usa direttamente `primary-600` / `primary-700`.
  Verrà rimosso dalla config quando CollapsibleCard sarà sbloccato e aggiornato.
- `slate-*` diretto — usa `surface-*` o `text-*`
- `gray-*` diretto — usa i token semantici

---

## Zone proibite (non toccare mai)

Questi componenti/file sono LOCKED o hanno effetti collaterali globali:

| File | Motivo | Cosa puoi fare |
|---|---|---|
| `CollapsibleCard.tsx` | 57 test, LOCKED | Solo leggere come riferimento |
| `DateInput.tsx` | `<style>` globali + `!important` | Solo classi surface esterne |
| `TimeInput.tsx` | Idem | Idem |
| `Select.tsx` | Radix portal + inline style | Solo classi trigger/content surface |
| `Modal.tsx` z-index | Stack calibrato con Toast | Non toccare `z-[10050]` |
| `TenantContext.tsx` | Core multi-tenancy | MAI |
| `src/lib/supabase.ts` | Client autenticato | MAI |
| `supabase/migrations/` | DB remoto già applicato | MAI |
| `src/router.tsx` | Routing completo | Solo se esplicitamente richiesto |

---

## Dipendenze disponibili (non installare nuove senza approvazione)

```
tailwindcss v4         ✅ disponibile
clsx                   ✅ disponibile
tailwind-merge         ✅ disponibile → usa cn() da @/lib/utils
lucide-react           ✅ disponibile (icone)
@radix-ui/react-select ✅ disponibile (già in Select.tsx)
framer-motion / motion ⚠️  valuta se serve davvero — preferisci CSS
```

Nuove dipendenze: approvazione esplicita prima di `npm install`.

---

## Prompt base per Cursor — Integrazione componente singolo

```
You are working on an existing React 18 + Vite + TypeScript + Tailwind CSS v4 app.

Read docs/UI_COMPONENT_ALPHABET.md before starting.

Task: [DESCRIVI QUI COSA FARE — es. "Create Badge.tsx in src/components/ui"]

Rules (non-negotiable):
- Do not modify Supabase, TenantContext, router, hooks, migrations.
- Do not change the props API of existing components (Button, Input, Modal, etc.).
- Do not touch CollapsibleCard.tsx — it is LOCKED (57 tests).
- Do not touch DateInput.tsx, TimeInput.tsx — they have global <style> blocks.
- Do not modify z-index in Modal.tsx.
- Place all new reusable UI in src/components/ui/.
- Use cn() from @/lib/utils — never clsx() or twMerge() directly.
- Use only color tokens from docs/UI_COMPONENT_ALPHABET.md "Token visivi" section.
- No new global CSS unless strictly required.
- No inline <style> blocks.
- No Next.js APIs, no server components.

After changes:
- Run: npm run validate
- Run: npm run build
- Report: files changed, props API preserved? yes/no, tokens used.
```

---

## Prompt base per Cursor — Migrazione feature component

```
You are refactoring a feature component to use the new design system.
Read docs/UI_COMPONENT_ALPHABET.md before starting.

Target: [es. BookingRequestCard.tsx]

Rules:
- Do NOT change business logic, data fetching, hooks, or event handlers.
- Do NOT change component props API.
- Do NOT change Supabase calls, TenantContext, routing.
- ONLY change: visual layout, spacing, card structure, hover/focus states.
- Replace raw <div className="bg-white border..."> with <Card> from src/components/ui/Card.tsx.
- Replace status string rendering with <Badge variant={...}>.
- Replace error/empty divs with <Alert> or <EmptyState>.
- Use SectionHeader for section titles.
- Keep all accessibility attributes (aria-*, role, tabIndex).

After changes:
- Run: npm run validate
- Run: npm run build
- Open admin dashboard and visually verify this tab.
- Report: what changed visually, what stayed the same, any props API modifications.
```

---

## Prompt base per Cursor — Sessione 1: Token consolidation (solo config)

```
You are consolidating the color token system in an existing Tailwind CSS v4 project.
Read docs/UI_COMPONENT_ALPHABET.md before starting.

Task: Add missing color tokens to tailwind.config.js ONLY. Do NOT modify any component or CSS file.

Exact additions in tailwind.config.js > theme.extend.colors:

'al-ritrovo': {
  primary: '#4F46E5',
  'primary-dark': '#4338CA',
},
warm: {
  wood: '#6b4226',
  'wood-dark': '#4a2d19',
  orange: '#f97316',
  beige: '#fef3c7',
  stone: '#d4c4b0',
},
terracotta: '#c2410c',
muted: '#f1f5f9',
background: '#ffffff',

Context:
- 'al-ritrovo' is a TEMPORARY alias for primary-600/primary-700.
  It exists only because CollapsibleCard.tsx uses bg-al-ritrovo-primary and is LOCKED (57 tests).
  Do NOT use al-ritrovo in any new code — always use primary-600/primary-700 directly.
- warm-* and terracotta are the restaurant brand palette used in the public booking page.
- muted and background are shadcn ghost tokens used in Select.tsx.

Rules:
- Touch ONLY tailwind.config.js.
- Do NOT modify any .tsx, .ts, or .css file.
- Do NOT touch CollapsibleCard.tsx — LOCKED (57 tests).
- Do NOT remove existing colors (primary, status, booking).
- Preserve the existing tailwind.config.js structure exactly.

After changes:
- Run: npm run validate
- Run: npm run build
- Report: tokens added, validate result, build result. No component files modified.
```

---

## Prompt base per Cursor — Sessione 2: Replace al-ritrovo → primary nei componenti

```
You are cleaning up a legacy color namespace in an existing React 18 + Vite + TypeScript app.
Read docs/UI_COMPONENT_ALPHABET.md before starting.

Context:
- 'al-ritrovo-primary' was a legacy namespace (restaurant example name, now obsolete).
- It has been aliased to primary-600 (#4F46E5) in tailwind.config.js.
- Goal: replace all usages in non-LOCKED files with the correct primary-* token directly.
- CollapsibleCard.tsx is LOCKED — do NOT touch it. The alias stays in config for it.

Task: Replace in these files ONLY (do not touch other files):
- src/components/ui/Select.tsx
- src/pages/BookingRequestPage.tsx
- src/features/booking/components/AcceptBookingModal.tsx
- src/features/booking/components/BookingCalendarTab.tsx
- src/features/booking/components/ArchiveTab.tsx
- src/features/booking/components/PendingRequestsTab.tsx
- src/features/booking/components/EmailLogsModal.tsx
- src/features/booking/components/DietaryRestrictionsSection.tsx

Replacements to make:
- al-ritrovo-primary      → primary-600
- al-ritrovo-primary-dark → primary-700
- bg-muted                → bg-slate-100       (only in Select.tsx)
- ring-offset-background  → ring-offset-white  (only in Select.tsx)

Rules:
- Do NOT change any business logic, hooks, data fetching, or event handlers.
- Do NOT change component props API.
- Do NOT touch CollapsibleCard.tsx — LOCKED.
- Do NOT touch DateInput.tsx, TimeInput.tsx.
- Do NOT touch z-index in Modal.tsx.
- Only change the className strings where al-ritrovo-* appears.

After changes:
- Run: npm run validate
- Run: npm run build
- Report: files modified, occurrences replaced per file, validate result.
```
