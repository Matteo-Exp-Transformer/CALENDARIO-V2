# Admin Shell — Context architettura e pattern core

> Context comune a TUTTE le sessioni admin.
> Copre: architettura shell, routing, tema, sidebar, z-index, anti-pattern, pattern nuove sezioni.

---

## 1. Architettura

```
AdminShell (src/components/layout/AdminShell.tsx)
│
├── [se !features.sidebar → edition Classic]
│   └── <div className="min-h-screen"> <AdminDashboard /> </div>  ← standalone, nessuna sidebar
│
└── [se features.sidebar → edition Pro/Enterprise]
    ├── <aside> sidebar sinistra — routing state-based (NO cambio URL)
    │   ├── Pulsante "Home" (icona Home, in cima → sezione 'home')   ← DEFAULT Pro/Enterprise
    │   ├── SIDEBAR_NAV_ITEMS (4 voci, filtrate per features):
    │   │   ├── Form Pubblico  (ExternalLink → window.open '/prenota/:slug', _blank)
    │   │   ├── Servizio       (ConciergeBell → sezione 'servizio',  featureKey: 'servizio')
    │   │   ├── CRM Clienti    (Users → sezione 'crm',              featureKey: 'crm')
    │   │   └── Analytics      (BarChart3 → sezione 'analytics',    featureKey: 'analytics')
    │   └── Bottom dock: avatar utente + logout
    │
    └── <main> contenuto — switch su `section` state
        ├── 'home'         → <AdminDashboard bodyOverride={<Suspense><AdminHomePage /></Suspense>} />
        ├── 'prenotazioni' → <AdminDashboard />                    ← DEFAULT Classic
        ├── 'crm'          → <Suspense><CrmPage /></Suspense>       [solo se features.crm]
        ├── 'servizio'     → <Suspense><ServizioPage /></Suspense>  [solo se features.servizio]
        └── 'analytics'    → <Suspense><AnalyticsPage /></Suspense> [solo se features.analytics]

⚠️ **Lazy loading** (aggiunto 2026-05-14, Fase 4b): AdminHomePage, CrmPage, ServizioPage, AnalyticsPage
sono importati con `React.lazy()`. AdminDashboard NON è lazy (è sempre montata). I chunk sono separati
nel bundle — un cliente Classic non scarica mai il bundle CRM/Servizio/Analytics.
```

**Regole cardine sidebar**:
- `'home'` NON compare in `SIDEBAR_NAV_ITEMS` — è coperto dal pulsante Home in cima
- `'prenotazioni'` NON compare in `SIDEBAR_NAV_ITEMS` — cliccando un tab da Home si passa a 'prenotazioni' via `onBodyOverrideExit`
- **Form Pubblico**: usa sempre `window.open(..., '_blank', 'noopener,noreferrer')` — MAI `window.location.href`
- **Edition Classic** (`!features.sidebar`): AdminShell fa un return anticipato — nessun aside, nessun wrapper sidebar. AdminDashboard occupa tutta la pagina. Section default = `'prenotazioni'`.
- **Edition Pro/Enterprise** (`features.sidebar`): layout completo con sidebar. Section default = `'home'`.

### Sistema Edition e Feature Flags

```typescript
// src/config/features.ts
buildFeatures(edition: TenantEdition): FeatureFlags
// Letto via: const features = useFeatures()  (src/hooks/useFeatures.ts)
// Sorgente: organizations.edition (letto in TenantContext.setTenantFromAdmin)

// Classic → sidebar/home/crm/analytics/servizio/walkIn/noShow/tableAssignments = false
// Pro     → tutti true
// Enterprise → tutti true
```

### bodyOverride — come funziona la sezione Home

AdminDashboard accetta due prop opzionali aggiunte il 2026-05-14:
- `bodyOverride?: React.ReactNode` — se presente, il `<main>` di AdminDashboard mostra questo contenuto invece dei tab. **Header e 5 NavItem restano sempre visibili.**
- `onBodyOverrideExit?: () => void` — chiamata quando l'utente clicca un NavItem mentre Home è attiva. AdminShell la usa per passare `section → 'prenotazioni'` e deselezionare Home dalla sidebar.

---

## 2. File chiave — shell

| File | Ruolo |
|------|-------|
| `src/components/layout/AdminShell.tsx` | Layout: sidebar + main, routing state, gating edition |
| `src/hooks/useFeatures.ts` | Hook: legge `edition` da TenantContext, ritorna `FeatureFlags` |
| `src/config/features.ts` | `buildFeatures(edition)` — fonte unica di tutti i feature flag |
| `src/types/edition.ts` | Tipo `TenantEdition = 'classic' \| 'pro' \| 'enterprise'` |
| `src/pages/AdminHomePage.tsx` | Home page (KPI giorno + quick-nav). Montata via `bodyOverride` in AdminDashboard |
| `src/pages/ServizioPage.tsx` | Sezione Servizio (CRUD tavoli/sale) — gated `features.servizio` |
| `src/pages/AnalyticsPage.tsx` | Sezione Analytics (KPI + trend) — gated `features.analytics` |

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

> Aggiornato 16-05-26 (v2): la sidebar ha ora **3 stati** (`hidden` / `icons` / `expanded`).

L'`<aside>` è **sempre `fixed inset-y-0 left-0 z-8000`** (mai nel flusso).
Stato gestito da `sidebarMode: 'hidden' | 'icons' | 'expanded'` (iniziale: `'icons'`).
`isDrawerOpen = sidebarMode === 'expanded'`.

| Stato | Comportamento |
|-------|---------------|
| **`hidden`** | `-translate-x-full` — sidebar fuori schermo. `<main>` **senza `pl-16`**: contenuto full-width. Icona tonda flottante `fixed left-3 top-3 z-8000` appare in alto a sinistra (`ChevronRight`, `onClick → 'icons'`). |
| **`icons`** | `w-16` striscia icone, sempre `fixed`. `<main>` con `pl-16`. In fondo, **sopra** il footer profilo/logout: sezione dedicata con divisorio come sotto Home (`my-1 border-t` dentro `px-2`) — ChevronRight (→ `expanded`) e ChevronLeft (→ `hidden`). Sotto: footer `mt-auto` con utente + Esci. |
| **`expanded`** | `w-56 shadow-xl` + backdrop scuro `bg-black/40 z-7999`. Si sovrappone in overlay. Chiusura (click backdrop / Escape / ChevronLeft in header) → torna a `'icons'`, **non a `hidden`**. |

`useIsNarrow()` (`max-width: 644px`) è usato in `openSection` / `runSidebarAction` **solo** per chiudere la sidebar se era `expanded` → `icons`. **Non forza mai `icons` se la sidebar era `hidden`** — la navigazione a una sezione non riapre mai la sidebar da `hidden`. **No hover-to-expand**: solo bottoni chevron.
Edition Classic (`!features.sidebar`): return anticipato, nessuna sidebar, nessuna icona flottante.

---

## 5. Z-index layers nella shell

| Layer | Z-index | Cosa |
|-------|---------|------|
| Sidebar backdrop (sidebar espansa, ogni larghezza) | `z-[7999]` | overlay scuro chiudibile |
| Sidebar aside (tutti i modi visibili: icons + expanded) | `z-[8000]` | pannello `fixed` |
| Icona tonda flottante (stato `hidden`) | `z-[8000]` | `fixed left-3 top-3`, stesso layer della sidebar |
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

### Procedura (6 passi)
1. Aggiungere `AdminShellSection` type in `AdminShell.tsx`
2. Aggiungere flag in `FeatureFlags` (`src/config/features.ts`) e in `buildFeatures()`
3. Aggiungere voce in `SIDEBAR_NAV_ITEMS` con `featureKey` corrispondente — **non** aggiungere `'home'` o `'prenotazioni'`
4. Aggiungere render condizionale in `<main>` gated con `features.nomeFlag`
5. Creare page in `src/pages/NomePaginaPage.tsx`
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
