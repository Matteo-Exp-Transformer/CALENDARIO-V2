# Admin Shell — Context architettura e pattern core

> Context comune a TUTTE le sessioni admin.
> Copre: architettura shell, routing, tema, sidebar, z-index, anti-pattern, pattern nuove sezioni.

---

## 1. Architettura

```
AdminShell (src/components/layout/AdminShell.tsx)
│
├── <aside> sidebar sinistra — routing state-based (NO cambio URL)
│   ├── Pulsante "Home" (icona Home, in cima → sezione 'home')   ← DEFAULT
│   ├── SIDEBAR_NAV (3 voci):
│   │   ├── Form Pubblico  (ExternalLink → window.open '/prenota/:slug', _blank)
│   │   ├── Impostazioni   (Store → 'home' + sessionStorage + restaurantSettingsSignal)
│   │   └── Analytics      (BarChart3 → sezione 'analytics')
│   └── Bottom dock: avatar utente + logout
│
└── <main> contenuto — switch su `section` state
    ├── 'home' | 'prenotazioni' → <AdminDashboard />   ← DEFAULT = 'home'
    ├── 'crm'                  → <CrmPage />
    ├── 'servizio'             → <ServizioPage />
    └── 'analytics'            → <AnalyticsPage />
```

**Regole cardine sidebar**:
- `'home'` NON compare nel `SIDEBAR_NAV` — è coperto dal pulsante Home in cima
- `'prenotazioni'` NON compare nel `SIDEBAR_NAV` — stesso pulsante Home (section 'home' e 'prenotazioni' montano entrambi AdminDashboard)
- **Form Pubblico**: usa sempre `window.open(..., '_blank', 'noopener,noreferrer')` — MAI `window.location.href` (navigherebbe via dalla dashboard admin)

---

## 2. File chiave — shell

| File | Ruolo |
|------|-------|
| `src/components/layout/AdminShell.tsx` | Layout: sidebar + main, routing state |
| `src/pages/AdminHomePage.tsx` | Placeholder per futura dashboard riassuntiva (non montata dalla shell su `home`) |
| `src/pages/ServizioPage.tsx` | Placeholder Servizio |
| `src/pages/AnalyticsPage.tsx` | Placeholder Analytics |

Per file specifici di CRM e altre sezioni → vedi `ADMIN_PAGES_CONTEXT.md`.

---

## 3. Tema — bug risolto, regola obbligatoria

### Il problema (risolto in commit e97c97b)

`AdminDashboard` si montava/smontava al cambio sezione. Il suo `useEffect` aveva un cleanup
`removeAttribute('data-admin-theme')`: ogni uscita da "Prenotazioni" resettava il tema,
rendendo CRM/Home/Servizio/Analytics senza colori.

### Fix applicato — non alterare

```typescript
// AdminDashboard.tsx — NESSUN cleanup nell'effect
useEffect(() => {
  const resolved = isAppThemePending ? DEFAULT_APP_THEME : savedAppTheme
  document.documentElement.setAttribute('data-admin-theme', resolved)
  // nessun return cleanup: il tema deve persistere per tutta la sessione admin
}, [savedAppTheme, isAppThemePending])
```

### Regola per nuove sezioni

Le nuove pagine admin non devono fare nulla per il tema: `data-admin-theme` è già impostato
da `AdminDashboard` al primo mount e non viene mai rimosso.

---

## 4. Sidebar — comportamento responsive

| Breakpoint | Stato default | Toggle |
|-----------|---------------|--------|
| `< 645px` | Rail `w-16`; menu espanso = **drawer** `fixed` `w-56` + backdrop (`z-[7999]`) — chiusura con bottone, click backdrop o `Escape` | chevron |
| `< 1024px` (e ≥ 645px) | Collapsed `w-16` solo icone | → expanded `w-56` |
| `≥ 1024px` | Expanded `w-56` icone + label | → collapsed `w-16` |

Logica: `useIsNarrow()` (`max-width: 644px`) + `useIsLg()` + stati separati `narrowExpanded` / `wideCollapsed` (preserva la
preferenza al cambio breakpoint). **No hover-to-expand**: solo bottone chevron.

---

## 5. Z-index layers nella shell

| Layer | Z-index | Cosa |
|-------|---------|------|
| Sidebar backdrop (solo drawer stretto) | `z-[7999]` | overlay scuro chiudibile |
| Sidebar drawer (`< 645px` espanso) | `z-[8000]` | pannello `fixed` |
| Sidebar aside (flusso normale / desktop) | normale | — |
| CustomerDetailPanel overlay | `z-[8999]` | sfondo scuro |
| CustomerDetailPanel drawer | `z-[9000]` | pannello slide-in CRM |
| Modal (`<Modal>`) | `z-[10050]` | **non toccare mai** |

Il drawer CRM sta SOTTO i modal. `CustomerFormModal` si apre sopra il drawer senza
chiuderlo — comportamento atteso.

---

## 6. Anti-pattern comuni (errori già commessi in tutte le sezioni)

### ❌ Aggiungere 'home' o 'prenotazioni' al SIDEBAR_NAV
```typescript
// ❌ duplica il pulsante Home in cima
const SIDEBAR_NAV = [{ section: 'home', ... }, { section: 'prenotazioni', ... }]
```

### ❌ window.location.href per Form Pubblico
```typescript
// ❌ naviga via dalla dashboard, l'admin perde la sessione corrente
window.location.href = `/prenota/${tenantSlug}`

// ✅ apre nuova tab senza abbandonare la dashboard
window.open(`/prenota/${tenantSlug}`, '_blank', 'noopener,noreferrer')
```

### ❌ Cleanup al useEffect di data-admin-theme
```typescript
// ❌ rimuove il tema al cambio sezione
return () => document.documentElement.removeAttribute('data-admin-theme')
```

### ❌ Classi Tailwind dinamiche
```typescript
const cls = `bg-${color}-600`  // ❌ Tailwind v4 non genera questa classe
```

---

## 7. Pattern per nuove sezioni

### Procedura (5 passi)
1. Aggiungere `AdminShellSection` type in `AdminShell.tsx`
2. Aggiungere voce in `SIDEBAR_NAV` / array nav (icona Lucide + label italiano) — **non** aggiungere `'prenotazioni'`
3. Aggiungere render condizionale in `<main>` della shell
4. Creare page in `src/pages/NomePaginaPage.tsx`
5. Importare e usare in `AdminShell.tsx`
6. **Aggiungere sezione in `ADMIN_PAGES_CONTEXT.md`** con file chiave, pattern e note

### Scheletro pagina placeholder
```tsx
import type { FC } from 'react'
import { IconName } from 'lucide-react'

export const NomePaginaPage: FC = () => (
  <div className="flex min-h-0 flex-1 items-center justify-center bg-(--color-bg) px-4 py-12">
    <div className="max-w-md rounded-xl border border-(--color-border) bg-surface p-8 text-center shadow-sm">
      <IconName className="mx-auto mb-4 h-12 w-12 text-primary-600" aria-hidden />
      <h1 className="text-lg font-semibold text-primary-900">Titolo Sezione</h1>
      <p className="mt-2 text-sm text-(--color-text-muted)">Coming soon</p>
    </div>
  </div>
)
```

### Query hook per nuova sezione
```typescript
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

## 8. Tailwind v4 — sintassi canonica

| Vecchia sintassi (warning IDE) | Sintassi v4 |
|--------------------------------|-------------|
| `border-[var(--color-border)]` | `border-(--color-border)` |
| `text-[var(--color-text-muted)]` | `text-(--color-text-muted)` |
| `bg-[var(--color-surface)]` | `bg-surface` |
| `bg-[var(--color-bg)]` | `bg-(--color-bg)` |

Correggere solo le righe che si toccano per altri motivi — non fare sweep su file interi.
