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

## 3. Template Playwright E2E — staging TEST con seed/cleanup

```ts
import { test, expect } from '@playwright/test'
import {
  getExistingTenantSlug,
  getRestaurantSettingSnapshot,
  getTenantIdBySlug,
  restoreRestaurantSettingSnapshot,
  upsertRestaurantSettingValue,
} from './helpers/supabaseStaging'

const HAS_STAGING_CONFIG = Boolean(process.env.VITE_SUPABASE_URL && process.env.E2E_SUPABASE_SERVICE_KEY)
const PREFERRED_TENANT_SLUG = process.env.E2E_TENANT_SLUG ?? 'da-tommaso'

test.skip(!HAS_STAGING_CONFIG, 'richiede staging Supabase TEST')

test.describe('Pagina pubblica — [caso]', () => {
  test('seed temporaneo + restore', async ({ page }) => {
    const tenantSlug = await getExistingTenantSlug(PREFERRED_TENANT_SLUG, [
      'da-tommaso',
      'test-classic',
      'test-pro',
    ])
    const tenantId = await getTenantIdBySlug(tenantSlug)
    const snapshot = await getRestaurantSettingSnapshot(tenantId, 'setting_da_modificare')

    try {
      await upsertRestaurantSettingValue(tenantId, 'setting_da_modificare', 'valore-e2e')
      await page.goto(`/prenota/${tenantSlug}?e2e=caso`, { waitUntil: 'domcontentloaded' })

      const container = page.getByRole('status')
      await expect(container.getByText(/testo atteso/i)).toBeVisible()
      await expect(page.locator('#elemento-che-non-deve-esistere')).toHaveCount(0)
    } finally {
      await restoreRestaurantSettingSnapshot(tenantId, 'setting_da_modificare', snapshot).catch(() => {})
    }
  })
})
```

Regole del template:
- Validare TEST (`docnnernvp`) passa dagli helper; non usare query REST sparse nello spec.
- Snapshot/restore per settings; prefisso + delete per booking/QR/menu seedati.
- Se un testo è duplicato responsive, assertare dentro un contenitore o usare `.first()` solo per "almeno uno visibile".

---

## 4. Template Playwright — test edition-gated

```ts
import { test, expect } from '@playwright/test'

const CREDENTIALS = [
  { email: process.env.E2E_CLASSIC_ADMIN_EMAIL ?? '', password: process.env.E2E_CLASSIC_ADMIN_PASSWORD ?? '' },
  { email: process.env.E2E_ADMIN_EMAIL ?? '', password: process.env.E2E_ADMIN_PASSWORD ?? '' },
].filter((cred) => cred.email && cred.password)

test.skip(CREDENTIALS.length === 0, 'richiede credenziali admin TEST')

async function loginWithAnyConfiguredCredential(page: import('@playwright/test').Page) {
  for (const credentials of CREDENTIALS) {
    await page.goto('/login', { waitUntil: 'domcontentloaded' })
    await page.fill('#email', credentials.email)
    await page.fill('#password', credentials.password)
    await page.locator('button[type="submit"]').click()
    try {
      await expect(page).toHaveURL(/\/admin/, { timeout: 8000 })
      return
    } catch {
      // .env.local.test puo essere obsoleto: prova la prossima credenziale TEST configurata.
    }
  }
  throw new Error('Login E2E fallito con tutte le credenziali configurate')
}

test.describe('Edition Classic — [feature]', () => {
  test('[feature] non visibile per Classic', async ({ page }) => {
    await loginWithAnyConfiguredCredential(page)

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

// ✅ CORRETTO — se serve un dato, seedalo e puliscilo
const id = await insertBooking({ tenantId, clientName: 'E2E-CASO-...', status: 'accepted', ... })
try {
  await page.goto('/admin/calendario')
  await expect(page.getByText('E2E-CASO-...')).toBeVisible()
} finally {
  await deleteBookingsByPrefix(tenantId, 'E2E-CASO-').catch(() => {})
}
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
