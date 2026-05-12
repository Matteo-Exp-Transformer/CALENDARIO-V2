---
name: admin-shell-sidebar
description: >-
  Guida per agenti che lavorano alla dashboard laterale (AdminShell) e alle sezioni
  CRM, Home, Servizio, Analytics di CalendarBackup-v2. Copre architettura, pattern
  corretti, bug noti già risolti e anti-pattern da evitare. Leggere prima di toccare
  AdminShell, CrmPage, useCustomers, useCustomerMutations o qualsiasi nuova sezione.
---

# Admin Shell & Sidebar — Guida per agenti

> Aggiornato a ogni sessione che introduce modifiche alla shell o alle sue sezioni.
> Leggere **prima** di toccare qualsiasi file listato nella sezione "File chiave".

---

## 1. Architettura corrente

```
AdminShell (src/components/layout/AdminShell.tsx)
│
├── <aside> sidebar sinistra — state-based (NO cambio URL)
│   ├── Pulsante "Calendario / Prenotazioni" (in cima, accede ad AdminDashboard)
│   ├── NAV: Home · CRM Clienti · Servizio · Analytics
│   └── Bottom dock: avatar utente + logout
│
└── <main> contenuto — switch su `section` state
    ├── 'prenotazioni' → <AdminDashboard />   ← DEFAULT, gestione booking esistente
    ├── 'home'         → <AdminHomePage />    ← placeholder
    ├── 'crm'          → <CrmPage />
    ├── 'servizio'     → <ServizioPage />     ← placeholder
    └── 'analytics'    → <AnalyticsPage />    ← placeholder
```

**Regola cardine**: `section === 'prenotazioni'` non compare nel `NAV` array della sidebar.
La gestione prenotazioni è il punto di partenza (default), raggiungibile tramite il pulsante
Calendario in cima alla sidebar. NON aggiungere "Prenotazioni" come voce nav — sarebbe un
duplicato del sistema di tab già presente in `AdminDashboard`.

---

## 2. File chiave

| File | Ruolo |
|------|-------|
| `src/components/layout/AdminShell.tsx` | Layout wrapper: sidebar + main |
| `src/pages/CrmPage.tsx` | Orchestratore CRM |
| `src/features/booking/hooks/useCustomers.ts` | Query + merge profili clienti |
| `src/features/booking/hooks/useCustomerMutations.ts` | Create / Update / Delete clienti |
| `src/lib/customerEmail.ts` | `normalizeCustomerEmail()` — usare SEMPRE per email CRM |
| `src/types/customer.ts` | `CustomerProfile`, `CustomerDbSource`, `CustomerProfileSource` |
| `supabase/migrations/006_customers_crm.sql` | Schema tabella `customers` |

---

## 3. Tema — BUG RISOLTO, pattern obbligatorio

### Il problema (risolto in commit e97c97b)

`AdminDashboard` montava/smontava al cambio sezione (`section === 'prenotazioni' && <AdminDashboard />`).
Il suo `useEffect` aveva un cleanup `return () => removeAttribute('data-admin-theme')`.
Ogni volta che l'utente lasciava "Prenotazioni", il tema veniva rimosso: CRM, Home, Servizio,
Analytics renderizzavano con il tema navy default invece del tema salvato dall'admin.

### Fix applicato

In `AdminDashboard.tsx` l'effect **non ha più il cleanup**:

```typescript
useEffect(() => {
  const resolved = isAppThemePending ? DEFAULT_APP_THEME : savedAppTheme
  document.documentElement.setAttribute('data-admin-theme', resolved)
  // nessun cleanup: il tema deve persistere per tutta la sessione admin
}, [savedAppTheme, isAppThemePending])
```

### Regola per nuove sezioni

Se crei una nuova pagina/sezione che ha bisogno di leggere token tema (qualsiasi
`bg-primary-*`, `text-primary-*`, `var(--color-*)`) **non devi fare nulla di speciale**:
`data-admin-theme` è già impostato da `AdminDashboard` al primo mount e non viene mai rimosso.

Se l'utente accede direttamente a una sezione NON-prenotazioni prima che `AdminDashboard` sia
mai montato (improbabile ma possibile in futuro con routing), il tema non sarebbe impostato.
Soluzione robusta futura: spostare il `useRestaurantSetting('app_theme')` + l'effect in
`AdminShell` stesso.

---

## 4. CRM — Architettura dati

### Due sorgenti, un profilo unificato

```
booking_requests  ──┐
                    ├── mergeProfiles() ──→ CustomerProfile[]
customers table   ──┘
```

- **`booking_requests`**: fonte primaria. Clienti che hanno prenotato.
  Aggregati per `lower(trim(client_email))`.
- **`customers`**: solo record `source='manual'` (creati da admin) o `source='synced'`
  (creati automaticamente quando si modifica info di un cliente da-solo-booking).

### Regola `source` nel profilo UI

| Condizione | `CustomerProfile.source` | Badge "Manuale" visibile |
|-----------|--------------------------|--------------------------|
| ≥ 1 booking | `'booking'` | No |
| 0 booking, riga customers `source='manual'` | `'manual'` | **Sì** |
| 0 booking, riga customers `source='synced'` | `'manual'` | No (synced = overlay tecnico) |

### Email: normalizzazione obbligatoria

**Usare sempre `normalizeCustomerEmail(raw)` prima di qualsiasi confronto o scrittura.**
La funzione fa `raw.trim().toLowerCase()` e ritorna `null` se vuota.

Il DB ha un trigger `trg_customers_normalize_email` (BEFORE INSERT/UPDATE) che applica la
stessa normalizzazione lato Postgres — doppia difesa. NON affidarsi solo al trigger: la
normalizzazione in TS è necessaria per i confronti lato app (merge, filtri, lookup).

### `CRM_QUERY_KEY` — unica sorgente

```typescript
// useCustomers.ts — l'unica dichiarazione
export const CRM_QUERY_KEY = 'crm-customer-profiles'

// useCustomerMutations.ts — importato, MAI ridichiarato
import { CRM_QUERY_KEY } from './useCustomers'
```

**Regola**: qualsiasi nuovo hook che invalida la query CRM deve importare `CRM_QUERY_KEY`
da `useCustomers.ts`. Non dichiarare la stringa a mano altrove.

---

## 5. Anti-pattern documentati (errori già commessi)

### ❌ Aggiungere "Prenotazioni" nel NAV array di AdminShell

```typescript
// ❌ MAI fare questo
const NAV = [
  { section: 'home', ... },
  { section: 'prenotazioni', label: 'Prenotazioni', ... }, // ← duplicato del dashboard
  { section: 'crm', ... },
]
```

`AdminDashboard` ha già la propria navigazione a tab con una voce "Prenotazioni".
La sezione `'prenotazioni'` è accessibile tramite il pulsante Calendario in cima alla sidebar.

### ❌ Aggiungere cleanup al `useEffect` di `data-admin-theme`

```typescript
// ❌ MAI fare questo — rimuove il tema quando AdminDashboard si smonta
useEffect(() => {
  document.documentElement.setAttribute('data-admin-theme', resolved)
  return () => document.documentElement.removeAttribute('data-admin-theme') // ← NO
}, [resolved])
```

### ❌ Dichiarare `CRM_QUERY_KEY` come costante locale in un nuovo hook

```typescript
// ❌ duplicazione silenziosa — se diverge, invalidateQueries non trova la query
const CRM_QUERY_KEY = 'crm-customer-profiles'
```

### ❌ Confrontare email senza normalizzare

```typescript
// ❌ case-sensitive, non gestisce spazi
if (booking.client_email === customerEmail) ...

// ✅ corretto
if (normalizeCustomerEmail(booking.client_email) === normalizeCustomerEmail(customerEmail)) ...
```

### ❌ Costruire classi Tailwind dinamicamente nelle nuove sezioni

```typescript
// ❌ Tailwind v4 non genera CSS per classi costruite a runtime
const cls = `bg-${color}-600`
```

---

## 6. Pattern corretti per nuove sezioni

### Scheletro pagina placeholder (10 righe)

```tsx
import type { FC } from 'react'
import { IconName } from 'lucide-react'

export const NomePaginaPage: FC = () => (
  <div className="flex min-h-0 flex-1 items-center justify-center bg-[var(--color-bg)] px-4 py-12">
    <div className="max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-sm">
      <IconName className="mx-auto mb-4 h-12 w-12 text-primary-600" aria-hidden />
      <h1 className="text-lg font-semibold text-primary-900">Titolo Sezione</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">Coming soon</p>
    </div>
  </div>
)
```

### Aggiungere una nuova sezione alla sidebar

1. Aggiungere l'`AdminShellSection` type in `AdminShell.tsx`
2. Aggiungere la voce in `NAV` (icona Lucide + label italiano)
3. Aggiungere il render condizionale in `<main>` della shell
4. Creare la page in `src/pages/NomePaginaPage.tsx`
5. Importare e usare in `AdminShell.tsx`

### Query hook per nuova sezione

```typescript
// Struttura standard: queryKey con tenantId, enabled: Boolean(tenantId)
export function useNomeDati() {
  const { tenantId } = useTenantContext()
  return useQuery({
    queryKey: ['nome-sezione', tenantId],
    enabled: Boolean(tenantId),
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant mancante')
      // ...
    },
  })
}
```

---

## 7. Tailwind v4 — avvisi da IDE (non errori, ma da correggere)

Il progetto usa Tailwind v4. L'IDE segnala come warning la sintassi "vecchia" delle CSS vars:

```
// ⚠ warning IDE (funziona ma non canonico)
className="border-[var(--color-border)]"
className="text-[var(--color-text-muted)]"

// ✅ sintassi v4 canonica
className="border-(--color-border)"
className="text-(--color-text-muted)"
```

Nei nuovi file usare sempre la sintassi canonica `(--var-name)`. Nei file esistenti
non modificare in blocco — farlo solo se si tocca quella riga per un'altra ragione.

---

## 8. Sidebar — comportamento responsive

| Breakpoint | Stato default | Toggle |
|-----------|---------------|--------|
| `< 1024px` (mobile/tablet) | Collapsed `w-16`, solo icone | Toggle → expanded `w-56` |
| `≥ 1024px` (desktop) | Expanded `w-56`, icone + label | Toggle → collapsed `w-16` |

La logica è in `useIsLg()` + due stati separati `narrowExpanded` / `wideCollapsed` per non
perdere la preferenza al cambio breakpoint.

**Non usare hover-to-expand**: il toggle è esclusivamente tramite il bottone chevron.

---

## 9. Z-index layers nella shell

| Layer | Z-index | Cosa |
|-------|---------|------|
| Sidebar aside | — (normale) | — |
| CustomerDetailPanel overlay | `z-[8999]` | sfondo scuro |
| CustomerDetailPanel drawer | `z-[9000]` | pannello slide-in |
| Modal (componente `<Modal>`) | `z-[10050]` | **non toccare** |

Il drawer CRM sta SOTTO i modal. `CustomerFormModal` si apre sopra il drawer senza
chiuderlo — comportamento atteso e voluto.

---

## 10. Verifiche obbligatorie dopo ogni modifica

```bash
npm run typecheck   # zero errori TS
npm run lint        # zero warning (--max-warnings 0)
npm run test        # 29/29 test Vitest
```

Per PR: `npm run validate` (lint + typecheck + test in sequenza).
