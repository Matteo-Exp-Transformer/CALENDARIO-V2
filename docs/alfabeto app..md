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