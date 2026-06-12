# Admin Shell — Context architettura e pattern core

> **Destinazione proposta (post-ok Matteo):** `docs/Admin-Skill/contesto/ADMIN_SHELL_ARCHITECTURE_CONTEXT.md`  
> **Sostituisce:** `docs/Dashboard-laterale-skill/ADMIN_SHELL_CONTEXT.md`  
> **Non duplicare:** routing URL, auth, guard dirty, decisioni Area 1, E2E → `ADMIN_SHELL_NAV_CONTEXT.md` (fonte **viva** per quelle parti).

> Context tecnico comune alle sessioni che toccano **layout shell**, tema, z-index, sidebar responsive, anti-pattern e procedure nuove sezioni.

---

## 1. Architettura componenti

```
AdminShell (src/components/layout/AdminShell.tsx)
│
├── [se !features.sidebar → edition Classic]
│   └── <div className="min-h-screen"> <AdminDashboard /> </div>  ← standalone, nessuna sidebar
│
└── [se features.sidebar → edition Pro/Enterprise]
    ├── <aside> sidebar sinistra — routing sincronizzato con URL (vedi NAV_CONTEXT §1)
    │   ├── Pulsante "Home" (icona Home, in cima → sezione 'home')   ← DEFAULT Pro/Enterprise
    │   ├── SIDEBAR_NAV_ITEMS (4 voci, filtrate per features):
    │   │   ├── Form Pubblico  (ExternalLink → window.open '/prenota/:slug', _blank)
    │   │   ├── Servizio       (ConciergeBell → sezione 'servizio',  featureKey: 'servizio')
    │   │   ├── CRM Clienti    (Users → sezione 'crm',              featureKey: 'crm')
    │   │   └── Analytics      (BarChart3 → sezione 'analytics',    featureKey: 'analytics')
    │   └── Bottom dock: avatar utente + logout
    │
    └── <main> contenuto — section derivata da `/admin/*` (non stato locale)
        ├── 'home'         → <AdminDashboard bodyOverride={<Suspense><AdminHomePage /></Suspense>} />
        ├── 'prenotazioni' → <AdminDashboard />                    ← DEFAULT Classic
        ├── 'crm'          → <Suspense><CrmPage /></Suspense>       [solo se features.crm]
        ├── 'servizio'     → <Suspense><ServizioPage /></Suspense>  [solo se features.servizio]
        └── 'analytics'    → <Suspense><AnalyticsPage /></Suspense> [solo se features.analytics]

⚠️ **Lazy loading**: AdminHomePage, CrmPage, ServizioPage, AnalyticsPage sono `React.lazy()`.
AdminDashboard NON è lazy. I chunk sono separati — Classic non scarica bundle CRM/Servizio/Analytics.
```

**Regole cardine sidebar**:
- `'home'` NON compare in `SIDEBAR_NAV_ITEMS` — coperto dal pulsante Home in cima
- `'prenotazioni'` NON compare in `SIDEBAR_NAV_ITEMS` — da Home si passa via `onBodyOverrideExit` / navigate
- **Form Pubblico**: `window.open(..., '_blank', 'noopener,noreferrer')` — MAI `window.location.href`
- **Classic** (`!features.sidebar`): return anticipato, nessun aside. Default section = `'prenotazioni'`.
- **Pro/Enterprise**: sidebar completa. Default = `'home'` se `features.home`, altrimenti Prenotazioni (NAV §3).

### Sistema Edition e Feature Flags

```typescript
// src/config/features.ts
buildFeatures(edition: TenantEdition): FeatureFlags
// Letto via: const features = useFeatures()
// Sorgente: organizations.edition + tenant_features override (TenantContext)

// Classic → sidebar/home/crm/analytics/servizio/walkIn/noShow/tableAssignments = false (base)
// Pro / Enterprise → bundle base; override per tenant via tenant_features
```

Per tabella route e normalizzazione path → **`ADMIN_SHELL_NAV_CONTEXT.md` §1**.

### bodyOverride — sezione Home

AdminDashboard accetta:
- `bodyOverride?: React.ReactNode` — sostituisce il corpo del `<main>`; header e 5 NavItem restano visibili.
- `onBodyOverrideExit?: () => void` — click NavItem da Home → navigate verso tab dashboard (NAV §5).

---

## 2. File chiave — shell

| File | Ruolo |
|------|-------|
| `src/components/layout/AdminShell.tsx` | Layout: sidebar + main, routing, gating edition |
| `src/hooks/useFeatures.ts` | Hook: edition + override → `FeatureFlags` |
| `src/config/features.ts` | `buildFeatures(edition, overrides)` |
| `src/types/edition.ts` | `TenantEdition = 'classic' \| 'pro' \| 'enterprise'` |
| `src/pages/AdminHomePage.tsx` | Home KPI + quick-nav (bodyOverride) |
| `src/pages/ServizioPage.tsx` | Sezione Servizio — gated `features.servizio` |
| `src/pages/AnalyticsPage.tsx` | Sezione Analytics — gated `features.analytics` |

Per file per-sezione (CRM, Servizio dettaglio, …) → `ADMIN_SHELL_PAGES_CONTEXT.md` e context dominio in `ADMIN_SKILL.md` §7.

---

## 3. Tema — bug risolto, regola obbligatoria

### Il problema (risolto commit e97c97b)

`AdminDashboard` cleanup su `data-admin-theme` al cambio sezione resettava colori su CRM/Home/Servizio/Analytics.

### Fix — non alterare

```typescript
// AdminDashboard.tsx — NESSUN cleanup nell'effect
useEffect(() => {
  const resolved = isAppThemePending ? DEFAULT_APP_THEME : savedAppTheme
  document.documentElement.setAttribute('data-admin-theme', resolved)
  // nessun return cleanup: il tema deve persistere per tutta la sessione admin
}, [savedAppTheme, isAppThemePending])
```

Nuove pagine shell: non toccare il tema; è già impostato al primo mount AdminDashboard. Duplicazione lettura tema AdminShell/AdminDashboard → NAV §6.

---

## 4. Sidebar — comportamento responsive

> **3 stati** (`hidden` / `icons` / `expanded`). Sintesi decisioni → NAV §4; qui il dettaglio implementativo.

L'`<aside>` è **sempre `fixed inset-y-0 left-0 z-8000`**.  
`sidebarMode: 'hidden' | 'icons' | 'expanded'` (iniziale: `'icons'`).

| Stato | Comportamento |
|-------|---------------|
| **`hidden`** | `-translate-x-full`. `<main>` senza `pl-16`. Icona tonda `fixed left-3 top-3 z-8000` (`ChevronRight` → `'icons'`). |
| **`icons`** | `w-16` fixed. `<main>` `pl-16`. Chevron expand/hide sopra footer profilo. |
| **`expanded`** | `w-56 shadow-xl` + backdrop `bg-black/40 z-7999`. Chiusura → `'icons'`, non `'hidden'`. |

`useIsNarrow()` (`max-width: 644px`): in `openSection` chiude solo se era `expanded` → `icons`. **Non riapre da `hidden`.** No hover-to-expand.  
Classic: nessuna sidebar.

---

## 5. Z-index layers nella shell

| Layer | Z-index | Cosa |
|-------|---------|------|
| Sidebar backdrop | `z-[7999]` | overlay chiusibile |
| Sidebar aside / icona flottante hidden | `z-[8000]` | pannello fixed |
| CustomerDetailPanel overlay | `z-[8999]` | sfondo scuro |
| CustomerDetailPanel drawer | `z-[9000]` | slide-in CRM |
| Modal (`<Modal>`) | `z-[10050]` | **non toccare** |

Drawer CRM sotto i modal — `CustomerFormModal` sopra drawer senza chiuderlo: OK.

---

## 6. Anti-pattern comuni

### ❌ Aggiungere 'home' o 'prenotazioni' al SIDEBAR_NAV

### ❌ window.location.href per Form Pubblico

### ❌ Cleanup al useEffect di data-admin-theme

### ❌ Classi Tailwind dinamiche (`bg-${color}-600`)

### ❌ Stato `section` / `activeTab` duplicato rispetto all'URL (flash tab — fix 06-06-26)

---

## 7. Pattern per nuove sezioni

### Procedura (6 passi)

1. `AdminShellSection` type in `AdminShell.tsx`
2. Flag in `FeatureFlags` + `buildFeatures()`
3. Voce in `SIDEBAR_NAV_ITEMS` con `featureKey` — **non** `'home'` / `'prenotazioni'`
4. Render condizionale in `<main>` gated `features.nomeFlag`
5. Page `src/pages/NomePaginaPage.tsx`
6. Sezione in `ADMIN_SHELL_PAGES_CONTEXT.md` + riga in `ADMIN_SKILL.md` §7 + route in `adminShellRouting` (NAV §1)

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
    queryFn: async () => { /* ... */ },
  })
}
```

---

## 8. Tailwind v4 — sintassi canonica

| Vecchia sintassi | Sintassi v4 |
|------------------|-------------|
| `border-[var(--color-border)]` | `border-(--color-border)` |
| `text-[var(--color-text-muted)]` | `text-(--color-text-muted)` |
| `bg-[var(--color-surface)]` | `bg-surface` |
| `bg-[var(--color-bg)]` | `bg-(--color-bg)` |

Correggere solo righe toccate per altro — no sweep intero file.
