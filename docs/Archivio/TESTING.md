# Testing — Stack e guida ai test

Stato: tooling installato e funzionante. **29 test Vitest verdi**, suite Playwright pronta (richiede Supabase staging).

## Stack di test

| Strumento | Tipo | Scopo |
|-----------|------|-------|
| **Vitest** | Unit / integration | Test veloci su funzioni e hook React |
| **Testing Library** | Utility Vitest | Render componenti, query DOM, eventi utente |
| **MSW (Mock Service Worker)** | Mock | Safety net per chiamate Supabase non mockate |
| **Playwright** | End-to-end | Simula un utente vero nel browser Chromium |
| **Husky + lint-staged** | Pre-commit hook | Esegue `eslint --fix` sui file staged |
| **GitHub Actions** | CI | Esegue lint + typecheck + test su push/PR a main |

## Comandi

```bash
npm run test              # esegue tutti i test Vitest (run mode)
npm run test:watch        # modalità watch (riesegue al salvataggio)
npm run test:ui           # interfaccia grafica Vitest nel browser
npm run test:coverage     # report copertura (soglia 50%)
npm run test:e2e          # test Playwright (richiede dev server attivo + staging)
npm run test:e2e:ui       # Playwright con interfaccia grafica
npm run validate          # lint + typecheck + test (da eseguire prima di ogni PR)
```

## Struttura delle cartelle

```
src/
├── lib/__tests__/
│   └── supabase.test.ts                   (11 test)
├── contexts/__tests__/
│   └── TenantContext.test.tsx             (5 test)
└── features/booking/hooks/__tests__/
    ├── useAdminAuth.test.tsx              (4 test)
    ├── useBookingMutations.test.tsx       (4 test)
    └── useMenuCategories.test.tsx         (5 test)

e2e/
├── public-booking.spec.ts
├── admin-login.spec.ts
├── admin-booking-mgmt.spec.ts
├── menu-crud.spec.ts
└── invite-flow.spec.ts

tests/
└── setup.ts                               # MSW server + jest-dom + cleanup

vitest.config.ts                           # jsdom, globals, env vars fake Supabase
playwright.config.ts                       # chromium, baseURL :5173, webServer auto-start
.husky/pre-commit                          # esegue lint-staged
.github/workflows/ci.yml                   # lint + typecheck + test su push/PR
```

## Strategia di mocking

I test Vitest usano `vi.mock()` per sostituire `@supabase/supabase-js` direttamente nei test, in modo da controllare le risposte. **MSW** è configurato in `tests/setup.ts` come safety net: se una chiamata HTTP a `test.supabase.co` sfugge ai mock, MSW restituisce risposte vuote di default e segnala un warning.

Per gli hook React si usa il pattern:
```ts
vi.clearAllMocks()  // preferito a resetAllMocks per preservare i factory mocks
```

## Come scrivere un test Vitest

```tsx
// src/features/booking/hooks/__tests__/useExample.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('useExample', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('comportamento atteso', async () => {
    // arrange / act / assert
  })
})
```

## Test Playwright e2e

I test e2e richiedono un **progetto Supabase staging dedicato** (separato dalla produzione). Variabili in `.env.local.test` (gitignored):

```
VITE_SUPABASE_URL=https://<staging-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<staging-anon-key>
E2E_ADMIN_EMAIL=admin@test.it
E2E_ADMIN_PASSWORD=<password-staging>
E2E_TENANT_SLUG=test-ristorante
E2E_VALID_INVITE_TOKEN=<token-creato-manualmente>
```

Esecuzione:
```bash
npm run test:e2e
# il webServer di Playwright avvia automaticamente npm run dev su :5173
```

## CI con GitHub Actions

Il file [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) esegue ad ogni push/PR su `main`:

```yaml
- npm ci
- npm run lint
- npm run typecheck
- npm run test
```

I test Playwright **non sono in CI** perché richiedono il progetto Supabase staging configurato. Da abilitare aggiungendo le secrets del repo (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, ecc.) e un job dedicato.

## Pre-commit hook

Husky è configurato per eseguire `lint-staged` ad ogni commit. La config in `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix"]
}
```

Se ESLint trova errori non auto-fixabili, il commit viene bloccato.

## Note sui mock MSW

MSW intercetta le chiamate fetch del client Supabase. Se viene aggiornata la versione di `@supabase/supabase-js`, verificare che gli endpoint mockati in `tests/setup.ts` corrispondano ai nuovi (la firma può cambiare tra versioni major).
