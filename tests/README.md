# Guida al sistema di test

## Stack

| Livello | Tool | Quando usarlo |
|---------|------|---------------|
| **Unit / Component** | Vitest + jsdom + MSW | Logica pura, hook, config — niente browser |
| **E2E** | Playwright (Chromium) | Flussi utente reali — richiede staging Supabase |

---

## Comandi

```bash
npm run test              # 54 test Vitest in run mode (veloci, nessun browser)
npm run test:watch        # Vitest in watch mode durante sviluppo
npm run test:e2e          # Playwright completo (tutti i file in e2e/)
npm run test:e2e -- --grep edition   # Solo i 7 test edition su staging
npm run validate          # lint + typecheck + test (obbligatorio pre-PR)
```

---

## Test Vitest esistenti

| File | Flusso coperto | # test |
|------|---------------|--------|
| `src/lib/__tests__/supabase.test.ts` | Init client, auth, query base | 11 |
| `src/contexts/__tests__/TenantContext.test.tsx` | setTenantFromSlug, setTenantFromAdmin, clearTenant, edition | 5 |
| `src/config/__tests__/features.test.ts` | buildFeatures per tutte e 3 le edition | 22 |
| `src/hooks/__tests__/useFeatures.test.tsx` | useFeatures → flag corretti per edition | 3 |
| `src/features/booking/hooks/__tests__/useAdminAuth.test.tsx` | login, session check, subscription | 4 |
| `src/features/booking/hooks/__tests__/useMenuCategories.test.tsx` | CRUD categorie menu | 5 |
| `src/features/booking/hooks/__tests__/useBookingMutations.test.tsx` | accept, reject, restore, no-show | 4 |

---

## Test E2E esistenti (Playwright)

### Admin Classic (credenziali: `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD`)

| File | Flusso coperto | Stato |
|------|---------------|-------|
| `e2e/admin-login.spec.ts` | Login admin, redirect, logout | attivo |
| `e2e/admin-booking-mgmt.spec.ts` | Accetta/rifiuta prenotazione | attivo |
| `e2e/public-booking.spec.ts` | Form prenotazione pubblica | attivo |
| `e2e/menu-crud.spec.ts` | CRUD voci menu | attivo |
| `e2e/invite-flow.spec.ts` | Flusso invito nuovo admin | attivo |
| `e2e/edition-classic.spec.ts` | Classic: no sidebar, 5 tab, no walk-in, no no-show | attivo (staging) |
| `e2e/edition-classic-data-protection.spec.ts` | RLS blocca CRM per tenant Classic | attivo (staging) |
| `e2e/edition-upgrade.spec.ts` | Classic→Pro via DB: sidebar appare dopo reload | attivo (staging) |
| `e2e/admin-classic-tabs.spec.ts` | Tab Archivio, Tab Impostazioni, cancella prenotazione | attivo (staging) |

### Admin Pro (credenziali: `E2E_PRO_ADMIN_EMAIL` / `E2E_PRO_ADMIN_PASSWORD`)

I test in `e2e/pro/` si saltano automaticamente se `E2E_PRO_ADMIN_EMAIL` non è impostato.

| File | Flusso coperto | Stato |
|------|---------------|-------|
| `e2e/pro/pro-login.spec.ts` | Login Pro, redirect con sidebar, credenziali errate | attivo (staging) |
| `e2e/pro/pro-sidebar-nav.spec.ts` | Sidebar 5 bottoni, navigazione Home/CRM/Servizio/Analytics | attivo (staging) |
| `e2e/pro/pro-crm.spec.ts` | CRM accessibile dalla sidebar, lista ≥3 clienti | attivo (staging) |
| `e2e/pro/pro-home.spec.ts` | Home default Pro, bodyOverride, navigazione sidebar stabile | attivo (staging) |

---

## Configurare lo staging per i test E2E

I test edition richiedono il progetto Supabase staging (`docnnernvpyrbwuzzach`), separato dal DB produzione.

### 1. File `.env.local.test`

Crea (o aggiorna) il file `.env.local.test` nella root del progetto (è già in `.gitignore`):

```
VITE_SUPABASE_URL=https://docnnernvpyrbwuzzach.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key-staging>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-staging>

# Admin Classic (richiesto dalla maggior parte dei test E2E)
E2E_ADMIN_EMAIL=admin-classic@test.local
E2E_ADMIN_PASSWORD=TestE2E2026!
E2E_TENANT_SLUG=ristorante-test-classic
E2E_CLASSIC_TENANT_ID=22222222-2222-2222-2222-222222222222
E2E_SUPABASE_SERVICE_KEY=<service-role-key-staging>

# Admin Pro (richiesto solo dai test in e2e/pro/ — ometti per saltarli)
E2E_PRO_ADMIN_EMAIL=admin-pro@test.local
E2E_PRO_ADMIN_PASSWORD=TestE2E2026!
```

`playwright.config.ts` carica automaticamente questo file se presente.

### 2. Tenant di test in staging

Lo staging è già popolato con:

| Tenant | Edition | Slug | Admin |
|--------|---------|------|-------|
| Ristorante Test Pro | `pro` | `ristorante-test-pro` | `admin-pro@test.local` |
| Ristorante Test Classic | `classic` | `ristorante-test-classic` | `admin-classic@test.local` |

Password admin: `TestE2E2026!`

### 3. Ricreare i tenant di test (se lo staging viene resettato)

**Svuotare tutto lo staging** (zero tenant/utenti, schema intatto): `supabase/scripts/reset_test_database.sql` — procedura in `supabase/scripts/README_RESET_TEST_DATABASE.md`. Solo progetto TEST (`docnnernvp`).

Poi esegui **`supabase/scripts/seed_e2e_test_tenants.sql`** (Supabase Studio o MCP `user-supabase-test`).

Include: 2 tenant, login auth (`auth.users` + `auth.identities`), 2 admin, **3 clienti** Pro (CRM E2E), **3 prenotazioni** Classic (2 pending + 1 accepted). Password: `TestE2E2026!`.

---

## Troubleshooting

| Problema | Causa | Soluzione |
|---------|-------|-----------|
| Test edition in `.skip` | Variabili E2E mancanti | Verifica `.env.local.test` — tutte le `E2E_*` devono essere valorizzate |
| `browserType.launch: Executable doesn't exist` | Chromium non installato | `npx playwright install chromium` |
| `strict mode violation` nei test | Selettore ambiguo trova 2+ elementi | Bug B02 — vedi Report-bug-trovati |
| Login fallisce in E2E | Email/password staging errate | Verifica `E2E_ADMIN_EMAIL` e `E2E_ADMIN_PASSWORD` |
| `edition-upgrade` fallisce | TenantContext non rilegge edition su reload | Bug B03 — vedi Report-bug-trovati |
| Vitest stderr su TenantContext | Log attesi (errori di test case negativi) | Non è un bug — i test `stderr` sono intenzionali |
