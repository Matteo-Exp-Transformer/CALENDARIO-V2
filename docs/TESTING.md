# Testing — Stack e guida alla scrittura dei test

> **Nota (Maggio 2026):** Il tooling di test non è ancora installato in questo repo. Questo documento descrive lo stack pianificato e le istruzioni per chi vuole configurarlo. Vedi la Fase 3 del piano di consegna per i dettagli.

## Stack pianificato

| Strumento | Tipo | Scopo |
|-----------|------|-------|
| **Vitest** | Unit / integration | Test veloci su singole funzioni e hook React |
| **Testing Library** | Utility Vitest | Render componenti, query DOM, eventi utente |
| **MSW (Mock Service Worker)** | Mock | Simula le risposte Supabase senza DB reale |
| **Playwright** | End-to-end | Simula un utente vero nel browser |
| **Husky + lint-staged** | Pre-commit hook | Blocca commit se lint fallisce |
| **GitHub Actions** | CI | Esegue lint + typecheck + test ad ogni push |

## Comandi (dopo l'installazione del tooling)

```bash
npm run test              # esegue tutti i test Vitest
npm run test:watch        # modalità watch (riesegue al salvataggio)
npm run test:ui           # interfaccia grafica Vitest nel browser
npm run test:coverage     # report copertura (soglia minima 50%)
npm run test:e2e          # test Playwright (richiede dev server attivo)
npm run test:e2e:ui       # Playwright con interfaccia grafica
npm run validate          # lint + typecheck + test (da eseguire prima di ogni PR)
```

## Struttura delle cartelle

```
src/
└── features/booking/hooks/__tests__/
    ├── useAdminAuth.test.tsx
    ├── useBookingMutations.test.tsx
    └── useMenuCategories.test.tsx
src/
├── lib/__tests__/supabase.test.ts
└── contexts/__tests__/TenantContext.test.tsx
e2e/
├── public-booking.spec.ts
├── admin-login.spec.ts
├── admin-booking-mgmt.spec.ts
├── menu-crud.spec.ts
└── invite-flow.spec.ts
tests/
└── setup.ts              # configurazione globale Vitest
```

## Come scrivere un test Vitest (esempio)

```tsx
// src/lib/__tests__/supabase.test.ts
import { describe, it, expect, vi } from 'vitest'

describe('supabase client', () => {
  it('crea il client con le variabili d\'ambiente corrette', () => {
    // Il client viene creato al momento dell'import,
    // quindi testiamo che le env vars siano state lette
    expect(import.meta.env.VITE_SUPABASE_URL).toBeDefined()
    expect(import.meta.env.VITE_SUPABASE_ANON_KEY).toBeDefined()
  })
})
```

Per mockare Supabase con MSW:

```tsx
// tests/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('*/organizations*', () => {
    return HttpResponse.json([
      { id: 'uuid-123', name: 'Test Ristorante', slug: 'test', is_active: true }
    ])
  }),
]
```

## Come scrivere un test Playwright (esempio)

```ts
// e2e/admin-login.spec.ts
import { test, expect } from '@playwright/test'

test('redirect a /login se non autenticato', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL('/login')
})

test('login con credenziali corrette', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', process.env.TEST_ADMIN_EMAIL!)
  await page.fill('[name="password"]', process.env.TEST_ADMIN_PASSWORD!)
  await page.click('[type="submit"]')
  await expect(page).toHaveURL('/admin')
})
```

## CI con GitHub Actions

Il file `.github/workflows/ci.yml` (da creare nella Fase 3) esegue ad ogni push/PR:

```yaml
- npm ci
- npm run lint
- npm run build       # include TypeScript check
- npm run test
```

I test Playwright in CI richiedono un Supabase staging separato con dati di test stabili (vedi note in `docs/MANUAL_TEST_PLAN.md`).

## Note sui mock MSW

MSW intercetta le chiamate HTTP del client Supabase a livello di fetch. Se viene aggiornata la versione di `@supabase/supabase-js`, verificare che i mock corrispondano ai nuovi endpoint/header — la firma delle richieste può cambiare tra versioni major.
