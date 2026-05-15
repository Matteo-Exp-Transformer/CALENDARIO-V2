---
name: testing-context
description: >-
  Mappa completa dei test post-sessione 15-05-26, setup MSW, staging Supabase.
  Caricare insieme a TESTING_SKILL.md quando si lavora sui test.
---

# Testing Context

## 1. Mappa test post-sessione 15-05-26

### Vitest (90 test, 10 file)

| File | Flusso coperto | # test | Stato |
|------|---------------|--------|-------|
| `src/lib/__tests__/supabase.test.ts` | Init client, auth, query | 11 | ✅ pass |
| `src/contexts/__tests__/TenantContext.test.tsx` | setTenantFromSlug, setTenantFromAdmin, clearTenant, edition | 5 | ✅ pass |
| `src/config/__tests__/features.test.ts` | buildFeatures — tutte e 3 le edition, tutti i flag | 22 | ✅ pass |
| `src/hooks/__tests__/useFeatures.test.tsx` | useFeatures → flag corretti per edition | 3 | ✅ pass |
| `src/features/booking/hooks/__tests__/useAdminAuth.test.tsx` | login, session check | 4 | ✅ pass |
| `src/features/booking/hooks/__tests__/useMenuCategories.test.tsx` | CRUD categorie menu | 5 | ✅ pass |
| `src/features/booking/hooks/__tests__/useBookingMutations.test.tsx` | accept, reject, restore, no-show | 4 | ✅ pass |
| `src/features/booking/hooks/__tests__/useServiceSlots.test.tsx` | update fascia oraria via RPC jsonb: salvataggio, PATCH, azzera max_guests, errore | 4 | ✅ pass |
| `src/features/booking/utils/__tests__/createBookingCustomerUpsert.test.ts` | upsert customers da form pubblico (fix B01) | 4 | ✅ pass |
| `src/features/booking/utils/__tests__/CONTROLLA_ORARIO-PRENOTAZIONI.test.ts` | contratto orario: scrittura ISO, lettura display, ciclo completo, invarianti | 28 | ✅ pass |

> **Limite noto `useServiceSlots.test.tsx`**: mocka `supabase.rpc` — verifica solo che l'hook costruisca il `payload` JSON corretto, **non** che la RPC esista nel DB. Un bug PGRST202 (funzione mancante/ambigua nel DB reale) NON viene catturato da questo test. Per quello serve verifica manuale browser o test E2E sull'ambiente giusto.

**Nota**: il test `CONTROLLA_ORARIO-PRENOTAZIONI` è il **test di non-regressione del modello orario**. Deve passare dopo ogni modifica a `dateUtils.ts`, `useBookingMutations.ts`, `useWalkInMutation.ts` o qualsiasi mutation che scrive `confirmed_start`/`desired_time`.

### Playwright E2E (13 spec file)

| File | Flusso coperto | Stato |
|------|---------------|-------|
| `e2e/admin-login.spec.ts` | Login, redirect, logout | attivo |
| `e2e/admin-booking-mgmt.spec.ts` | Accetta/rifiuta prenotazione | attivo |
| `e2e/public-booking.spec.ts` | Form prenotazione pubblica | attivo |
| `e2e/menu-crud.spec.ts` | CRUD voci menu | attivo |
| `e2e/invite-flow.spec.ts` | Flusso invito nuovo admin | attivo |
| `e2e/edition-classic.spec.ts` | Classic: no sidebar, 5 tab, no walk-in, no no-show (5 test) | ✅ 5 pass (fix B02: selettori scopati a `header nav`) |
| `e2e/edition-classic-data-protection.spec.ts` | RLS blocca customers per Classic | ✅ pass |
| `e2e/edition-upgrade.spec.ts` | Classic→Pro: sidebar appare dopo reload | ✅ pass (fix B03: timeout 15s + wait esplicito post-login) |
| `e2e/admin-classic-tabs.spec.ts` | Tab Archivio, Tab Impostazioni, cancella prenotazione (soft-delete) | aggiunto sessione 14-05-26 |
| `e2e/pro/pro-login.spec.ts` | Login Pro, redirect con sidebar, credenziali errate | aggiunto sessione 14-05-26 |
| `e2e/pro/pro-sidebar-nav.spec.ts` | Sidebar 5 bottoni, navigazione Home/CRM/Servizio/Analytics | aggiunto sessione 14-05-26 |
| `e2e/pro/pro-crm.spec.ts` | CRM accessibile, lista ≥3 clienti nel DB staging | aggiunto sessione 14-05-26 |
| `e2e/pro/pro-home.spec.ts` | Home default Pro, bodyOverride, navigazione sidebar stabile | aggiunto sessione 14-05-26 |

---

## 2. Setup MSW (tests/setup.ts)

MSW funge da safety net per le chiamate HTTP Supabase non intercettate da `vi.mock`.

```ts
// Pattern handler MSW
http.get('https://test.supabase.co/rest/v1/:table', () => HttpResponse.json([]))
http.post('https://test.supabase.co/rest/v1/:table', () => HttpResponse.json({}))
```

I test unit usano `vi.mock('@/lib/supabase', ...)` per mockare il client prima di MSW.
MSW intercetta solo le chiamate che sfuggono al mock.

**URL Supabase nei test**: `https://test.supabase.co` (fake, configurato in `vitest.config.ts`).
**Mai** usare l'URL staging o produzione nei test Vitest.

---

## 3. Staging Supabase — stato attuale

Progetto: `docnnernvpyrbwuzzach` (separato da produzione `rwuxgvldzrkabglkasym`)

**Migrazioni applicate**: 001 → 015 (tutte, incluso doppio 003)

**Tenant di test**:

| ID | Nome | Edition | Admin |
|----|------|---------|-------|
| `11111111-1111-1111-1111-111111111111` | Ristorante Test Pro | `pro` | `admin-pro@test.local` |
| `22222222-2222-2222-2222-222222222222` | Ristorante Test Classic | `classic` | `admin-classic@test.local` |

Password: `TestE2E2026!`

**Dati presenti**:
- Tenant Pro: 3 clienti in `customers`
- Tenant Classic: 3 prenotazioni in `booking_requests` (2 pending, 1 accepted)

**Come ricreare**: vedi `tests/README.md` § "Ricreare i tenant di test"

---

## 4. Bug risolti nei test E2E

| Bug | Test | Causa | Fix applicato |
|-----|------|-------|---------------|
| B02 | `edition-classic.spec.ts` (4 test) | `getByRole('button', { name: /calendario/i })` trovava 2 elementi: NavItem header + span `sm:hidden` "Calendario" in ArchiveTab | Selettori scopati a `page.locator('header nav')` via helper `dashboardNav()` |
| B03 | `edition-upgrade.spec.ts` | `waitForLoadState('networkidle')` terminava prima del re-render React post-checkSession | Rimosso networkidle, aggiunto wait esplicito sulla sidebar + timeout 15s |

---

## 5. Variabili E2E per i test Pro

I test in `e2e/pro/` usano credenziali separate dalle Classic:

| Variabile | Valore staging | Usata da |
|-----------|---------------|----------|
| `E2E_PRO_ADMIN_EMAIL` | `admin-pro@test.local` | tutti gli spec in `e2e/pro/` |
| `E2E_PRO_ADMIN_PASSWORD` | `TestE2E2026!` | tutti gli spec in `e2e/pro/` |

I test Pro si auto-saltano se `E2E_PRO_ADMIN_EMAIL` non è impostato:
```ts
test.skip(!process.env.E2E_PRO_ADMIN_EMAIL, 'richiede staging Pro configurato')
```

---

## 6. Checklist pre-PR testing

```
□ npm run validate (lint + typecheck + 90 Vitest) → tutto green
□ npm run test:e2e -- --grep edition → 7 pass (RLS + 5 Classic + upgrade)
□ npm run test:e2e -- --grep "Admin Classic" → 5+ pass (tabs + soft-delete)
□ npm run test:e2e -- --grep "Admin Pro" → pass se E2E_PRO_ADMIN_EMAIL configurato
□ Nessun nuovo test tocca produzione
□ Nuovi test Vitest usano mock, non URL reali
□ Nuovi spec Playwright usano variabili E2E_*, non credenziali hardcoded
```
