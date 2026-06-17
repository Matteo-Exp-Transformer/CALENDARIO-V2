# Componenti UI — Riferimento rapido

> **Estendi questo file ogni volta che aggiungi un componente a `src/components/ui/`.**
> Stack: React 18 + Vite + TypeScript + Tailwind CSS v4 + cn() da @/lib/utils

---

## Regola d'oro

Prima di creare un componente: cerca in questa lista. Se esiste → usalo senza modificare la props API.
Non riscrivere componenti esistenti. Non cambiare le interfacce pubbliche.

---

## Regola cursori (norma globale)

La manina (`cursor: pointer`) su ogni elemento cliccabile è **già globale** —
definita una sola volta in `src/index.css` (blocco "Cursore manina su TUTTI
gli elementi interattivi", subito dopo `body`).

Copre automaticamente: `button`, `a[href]`, `select`, `label[for]`,
`role="button|tab|menuitem|option|switch"`, `[onclick]`, e i `<div>`
cliccabili marcati con la classe `.is-clickable` o l'attributo
`data-clickable`. Il disabilitato (`:disabled`, `aria-disabled`,
`.cursor-not-allowed`) mostra sempre `not-allowed`.

**Da fare / da NON fare:**
- ❌ NON aggiungere `cursor-pointer` a mano su button, link, select o
  componenti che usano `Button` — è ridondante, è già coperto.
- ✅ Per un `<div>` / `<span>` reso cliccabile via `onClick`: aggiungi la
  classe `is-clickable` (oppure `data-clickable`) invece di `cursor-pointer`.
  Così resta agganciato alla norma globale e non si sparpaglia.
- Gli input di testo (`input`, `textarea`) restano col cursore di scrittura
  per scelta esplicita: NON metterci la manina.

---

## Componenti disponibili

---

### Button
**File**: `src/components/ui/Button.tsx` — **NON MODIFICARE**

| variant | Aspetto | Uso |
|---------|---------|-----|
| `primary` | indigo pieno, testo bianco | azione principale |
| `secondary` | grigio chiaro, bordo | azione secondaria |
| `danger` | rosso, testo bianco | elimina / rifiuta |
| `success` | verde, testo bianco | conferma / accetta |
| `ghost` | trasparente, hover grigio | azione terziaria |
| `outline` | bordo indigo, sfondo trasparente | alternativa primary |

**Size**: `sm` · `md` (default) · `lg` · `icon`

```tsx
<Button variant="primary" size="sm">Testo</Button>
<Button variant="danger" size="icon"><X /></Button>
<Button variant="secondary" fullWidth disabled>Non disponibile</Button>
<Button variant="ghost" size="icon"><Edit /></Button>
```

**Regola assoluta**: cambia solo `variant` / `size` nel file chiamante. Mai toccare `Button.tsx`.

---

### Badge
**File**: `src/components/ui/Badge.tsx`

| variant | Uso |
|---------|-----|
| `default` | etichetta neutra |
| `primary` | elemento principale |
| `success` | stato OK / accettato |
| `warning` | attenzione / pending |
| `danger` | errore / rifiuto |
| `info` | informazione neutrale |
| `outline` | bordo, sfondo trasparente |

**Size**: `sm` · `md`

```tsx
<Badge variant="warning">In Attesa</Badge>
<Badge variant="success">Accettata</Badge>
<Badge variant="danger" size="sm">Rifiutata</Badge>
<Badge variant="primary">Cena</Badge>
```

---

### Alert
**File**: `src/components/ui/Alert.tsx`

| variant | Uso |
|---------|-----|
| `default` | info neutra |
| `success` | conferma |
| `warning` | attenzione |
| `danger` | errore |
| `info` | informazione |

```tsx
<Alert variant="danger" description="Prenotazione non trovata." />
<Alert variant="success" title="Salvato" onDismiss={() => setVisible(false)} />
{error && <Alert variant="danger" description={error} />}
```

**Props**: `variant`, `title?`, `description?`, `icon?`, `onDismiss?`, `className`, `children`

---

### Card (sistema)
**File**: `src/components/ui/Card.tsx`

```tsx
<Card>
  <CardHeader>
    <CardTitle>Titolo</CardTitle>
    <CardDescription>Descrizione opzionale</CardDescription>
  </CardHeader>
  <CardContent>
    {/* contenuto */}
  </CardContent>
  <CardFooter>
    <Button variant="primary">Azione</Button>
    <Button variant="secondary">Annulla</Button>
  </CardFooter>
</Card>
```

**Esportazioni**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
**Varianti Card**: `default` · `elevated` · `outlined` · `muted`

---

### Modal
**File**: `src/components/ui/Modal.tsx` — **NON toccare `z-[10050]`**

Stack z-index: Modal `z-[10050]` < Toast `z-index: 100000`. Calibrato — non alterare mai.

```tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Conferma" size="md">
  {/* body */}
</Modal>
```

**Size**: `sm` · `md` · `lg` · `xl`

---

### Input
**File**: `src/components/ui/Input.tsx`

```tsx
<Input placeholder="Nome ospite" value={name} onChange={...} />
<Input type="email" error="Email non valida" />
<Input disabled value="Valore fisso" />
<Input type="number" min={1} max={100} value={coperti} onChange={...} />
```

- Con `type="number"`, la rotella del mouse **non** incrementa/decrementa il valore mentre il campo ha focus (`src/lib/suppressNumberInputWheel.ts`). Digitazione, stepper nativo e tastiera restano invariati; senza focus lo scroll della pagina non viene bloccato.

---

### Textarea
**File**: `src/components/ui/Textarea.tsx`

```tsx
<Textarea placeholder="Note aggiuntive..." rows={4} value={notes} onChange={...} />
```

---

### Select
**File**: `src/components/ui/Select.tsx` — Radix UI — non sostituire il componente.
Aggiorna solo classi surface trigger/content se necessario.

---

### TimePicker24h
**File**: `src/components/ui/TimePicker24h.tsx` — **unico** selettore orario dell'app (pubblico + admin). Due `<select>` ore | minuti, minuti **liberi 0-59** (nessuno step). `TimeInput` è stato eliminato.

```tsx
<TimePicker24h id="orario" value={value} onChange={(v) => setValue(v)} />
<TimePicker24h id="orario" value={value} onChange={...} compact />  {/* form pubblico / griglia 2 col */}
```

- `onChange` riceve **la stringa "HH:mm" diretta**, non un evento (≠ `<Input type="time">`).
- `compact` (default `false`): densità ridotta + font mobile-first per il form pubblico. Con `false` la resa è identica all'uso admin storico.
- Props: `value`, `onChange`, `id`, `required`, `disabled`, `hasError`, `compact`.

---

### Label
**File**: `src/components/ui/Label.tsx`

```tsx
<Label htmlFor="email">Email</Label>
<Label required>Nome *</Label>
```

---

### SectionHeader
**File**: `src/components/ui/SectionHeader.tsx`

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

### EmptyState
**File**: `src/components/ui/EmptyState.tsx`

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

### Spinner
**File**: `src/components/ui/Spinner.tsx`

```tsx
<Spinner size="md" />
<Spinner size="sm" className="text-primary-600" />
```

**Size**: `sm` · `md` · `lg`

---

### Separator
**File**: `src/components/ui/Separator.tsx`

```tsx
<Separator />
<Separator orientation="vertical" className="h-6" />
```

---

### CollapsibleCard
**File**: `src/components/ui/CollapsibleCard.tsx` — **LOCKED — 57 test — non toccare mai**

Solo leggerlo come riferimento.

---

### NotifyNavShinyLayers
**File**: `src/components/ui/NotifyNavShinyLayers.tsx`

Usare esclusivamente per la tab **Prenotazioni con badge notifica** nella nav admin.
Interno al `button` del `NavItem` in `AdminDashboard`.

---

## Zone LOCKED — non toccare mai

| File | Motivo | Cosa puoi fare |
|------|--------|----------------|
| `CollapsibleCard.tsx` | 57 test, LOCKED | Solo leggere come riferimento |
| `DateInput.tsx` | `<style>` globali + `!important` | Solo classi surface esterne |
| `Select.tsx` | Radix portal + inline style | Solo classi trigger/content surface |
| `Modal.tsx` z-index | Stack calibrato con Toast | Non toccare `z-[10050]` |
| `TenantContext.tsx` | Core multi-tenancy | MAI |
| `src/lib/supabase.ts` | Client autenticato | MAI |
| `supabase/migrations/` | DB remoto già applicato | MAI |
| `src/router.tsx` | Routing completo | Solo se esplicitamente richiesto |

---

## Pattern di composizione

### Lista di card con stato
```tsx
const STATUS_VARIANT = {
  pending:  'warning',
  accepted: 'success',
  rejected: 'danger',
} as const

<div className="flex flex-col gap-4">
  {items.map(i => (
    <Card key={i.id}>
      <CardHeader>
        <CardTitle>{i.name}</CardTitle>
        <Badge variant={STATUS_VARIANT[i.status]}>{STATUS_LABEL[i.status]}</Badge>
      </CardHeader>
      <CardContent>...</CardContent>
      <CardFooter>
        <Button variant="primary" size="sm">Accetta</Button>
        <Button variant="danger" size="sm">Rifiuta</Button>
      </CardFooter>
    </Card>
  ))}
</div>
```

### Sezione con empty state
```tsx
<div>
  <SectionHeader title="Prenotazioni" icon={Clock} />
  {items.length === 0
    ? <EmptyState icon={Calendar} title="Nessuna richiesta" />
    : <div className="flex flex-col gap-4">{/* cards */}</div>
  }
</div>
```

### Form row
```tsx
<div className="flex flex-col gap-1.5">
  <Label htmlFor="name">Nome</Label>
  <Input id="name" value={name} onChange={...} />
</div>
```

### Alert in form (validazione)
```tsx
{error && <Alert variant="danger" description={error} />}
```

---

## Template — aggiunta nuovo componente

Quando aggiungi un componente a `src/components/ui/`, incolla questa sezione nel file e compilala:

```markdown
### NomeComponente
**File**: `src/components/ui/NomeComponente.tsx`

| variant / prop | Uso |
|----------------|-----|
| ...            | ... |

```tsx
<NomeComponente prop="value">Contenuto</NomeComponente>
```

**Props**: `prop1`, `prop2?`, `className`, `children`
**Note**: vincoli, dipendenze o comportamenti non ovvi da conoscere
```

---

## Dipendenze disponibili

```
tailwindcss v4              ✅
clsx + tailwind-merge       ✅ → usa cn() da @/lib/utils
lucide-react                ✅ icone
@radix-ui/react-select      ✅ già in Select.tsx
framer-motion / motion      ⚠️  valuta — preferisci CSS animation
```

Nuove dipendenze: approvazione esplicita prima di `npm install`.
