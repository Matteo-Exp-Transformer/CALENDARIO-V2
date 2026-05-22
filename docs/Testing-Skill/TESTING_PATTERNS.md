---
name: testing-patterns
description: >-
  Template pronti per Vitest hook test, Playwright E2E, test edition-gated.
  Anti-pattern da evitare. Caricare con TESTING_SKILL.md quando si scrivono nuovi test.
---

# Testing Patterns

## 1. Template Vitest — hook con Supabase mock

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Hoisted: il mock deve essere dichiarato prima di qualsiasi import
const { mockFrom } = vi.hoisted(() => ({ mockFrom: vi.fn() }))

vi.mock('@/lib/supabase', () => ({
  supabase: { from: mockFrom },
  handleSupabaseError: (e: unknown) => {
    if (e && typeof e === 'object' && 'message' in e) return (e as { message: string }).message
    return 'Errore'
  },
}))

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: vi.fn(() => ({ tenantId: 'tenant-abc' })),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return React.createElement(QueryClientProvider, { client: qc }, children)
}

describe('useMyHook', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('caso felice', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [{ id: '1' }], error: null }),
    })

    const { result } = renderHook(() => useMyHook(), { wrapper })
    // await act o waitFor per query async
    expect(result.current.data).toHaveLength(1)
  })
})
```

---

## 2. Template Vitest — funzione pura (nessun mock)

```ts
import { describe, it, expect } from 'vitest'
import { buildFeatures } from '@/config/features'

describe('buildFeatures', () => {
  it("classic → tutti i flag false", () => {
    const f = buildFeatures('classic')
    expect(Object.values(f).every(v => v === false)).toBe(true)
  })

  it("pro → tutti i flag true", () => {
    const f = buildFeatures('pro')
    expect(Object.values(f).every(v => v === true)).toBe(true)
  })
})
```

---

## 3. Template Playwright E2E — flusso admin base

```ts
import { test, expect } from '@playwright/test'

// Skip automatico se staging non configurato
test.skip(!process.env.E2E_ADMIN_EMAIL, 'richiede staging Supabase')

const EMAIL = process.env.E2E_ADMIN_EMAIL ?? ''
const PWD   = process.env.E2E_ADMIN_PASSWORD ?? ''

async function login(page: import('@playwright/test').Page) {
  await page.goto('/admin')
  await page.getByLabel(/email/i).fill(EMAIL)
  await page.getByLabel(/password/i).fill(PWD)
  await page.getByRole('button', { name: /accedi|login/i }).click()
  await page.waitForLoadState('networkidle')
}

test.describe('Flusso admin — [nome flusso]', () => {
  test('[cosa verifica]', async ({ page }) => {
    await login(page)
    // assertions…
  })
})
```

---

## 4. Template Playwright — test edition-gated

```ts
import { test, expect } from '@playwright/test'

const REQUIRED = ['E2E_ADMIN_EMAIL', 'E2E_ADMIN_PASSWORD', 'E2E_CLASSIC_TENANT_ID']
const missing  = REQUIRED.find(v => !process.env[v])
test.skip(!!missing, `richiede staging (${missing ?? ''} non impostato)`)

test.describe('Edition Classic — [feature]', () => {
  test('[feature] non visibile per Classic', async ({ page }) => {
    await page.goto('/admin')
    await page.getByLabel(/email/i).fill(process.env.E2E_ADMIN_EMAIL!)
    await page.getByLabel(/password/i).fill(process.env.E2E_ADMIN_PASSWORD!)
    await page.getByRole('button', { name: /accedi|login/i }).click()
    await page.waitForLoadState('networkidle')

    // Classic non deve vedere questa feature
    await expect(page.locator('[data-testid="feature-element"]')).not.toBeVisible()
  })
})
```

---

## 5. Anti-pattern da evitare

### Selettori ambigui (causa B02)
```ts
// ❌ SBAGLIATO — trova più elementi con lo stesso nome
await page.getByRole('button', { name: /calendario/i }).click()

// ✅ CORRETTO — circoscrivi al contesto o usa .first() con commento
await page.getByRole('banner').getByRole('button', { name: /calendario/i }).click()
// oppure
await page.getByTestId('nav-calendario').click()
```

### Timing flaky
```ts
// ❌ SBAGLIATO — sleep arbitrario
await page.waitForTimeout(2000)

// ✅ CORRETTO — attendi stato specifico
await page.waitForLoadState('networkidle')
await expect(page.locator('.booking-list')).toBeVisible()
```

### Test dipendenti da dati specifici
```ts
// ❌ SBAGLIATO — assume che esistano prenotazioni con ID specifico
await page.goto('/admin?booking=abc123')

// ✅ CORRETTO — usa dati minimi garantiti dallo staging setup
const firstRow = page.locator('tr[role="row"]').first()
if (await firstRow.isVisible()) { /* test condizionale */ }
```

### Mock troppo dettagliati
```ts
// ❌ SBAGLIATO — mocka ogni singola chiamata interna
vi.mock('@/features/booking/hooks/useAdminAuth', () => ({
  useAdminAuth: () => ({ isLoading: false, session: {...}, doLogin: vi.fn(), ... })
}))

// ✅ CORRETTO — mocka solo il boundary (Supabase client)
vi.mock('@/lib/supabase', () => ({ supabase: { from: mockFrom } }))
```

### URL reali nei test Vitest
```ts
// ❌ SBAGLIATO — chiama lo staging reale da un test Vitest
const { data } = await supabase.from('customers').select()

// ✅ CORRETTO — usa sempre vi.mock + MSW, mai URL reali in Vitest
```
