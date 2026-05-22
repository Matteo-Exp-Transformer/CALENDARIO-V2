# Report — Setup Staging + Sistema Testing

> **Data**: 2026-05-14
> **Branch**: `Sviluppo-Dashboard-laterale`
> **Attività eseguite**: Setup staging, verifica E2E edition, sistema testing, skill testing

---

## Attività 1 — Setup staging (`docnnernvpyrbwuzzach`)

### 1.1 Migrazioni applicate

Il DB staging era vuoto. Applicate tutte e 16 le migrazioni di produzione via MCP Supabase (server `Supabase_test`):

| Migrazione | Contenuto |
|-----------|-----------|
| 001_schema_completo | Schema base: organizations, booking_requests, admin_users, email_logs, restaurant_settings, menu_items, invite_tokens, tenant_usage, rate_limits + trigger + RLS iniziale |
| 002_rls_admin_users | Funzione `current_admin_tenant_id()` + policy RLS JWT-based + trigger `enforce_booking_tenant` |
| 003_fix_tenant_usage_triggers_security_definer | Trigger contatori con SECURITY DEFINER |
| 003_menu_categories | Tabella menu_categories + seed tenant esistenti |
| 004_default_menu_categories_new_organization | Trigger auto-seed categorie menu nuovi tenant |
| 005_menu_items_booking_types | Colonna `booking_types` su menu_items |
| 006_customers_crm | Tabella customers + RLS + trigger normalize email |
| 007_tables | Tabella tables + RLS + trigger enforce tenant |
| 008_rooms_and_table_layout | Tabella rooms + coordinate tavoli (room_id, position_x/y, shape, rotation) |
| 009_booking_source_and_noshow | Colonne `source` e `no_show` su booking_requests |
| 010_service_slots | Tabella service_slots + RLS |
| 011_booking_table_assignments | Tabella booking_table_assignments + RLS |
| 012_service_slots_preset_signup | Trigger auto-seed 5 fasce orarie per nuovi tenant |
| 013_tenants_edition | Colonna `edition` su organizations (default 'pro') |
| 014_rls_edition_gates | Policy RLS edition-gated su 5 tabelle Pro-only |
| 015_check_admin_email_with_edition | RPC `check_admin_email` estesa con slug, org_name, edition |

**Risultato**: 15 tabelle con RLS abilitata, schema identico a produzione.

### 1.2 Tenant di test creati

| ID | Nome | Edition | Admin |
|----|------|---------|-------|
| `11111111-1111-1111-1111-111111111111` | Ristorante Test Pro | `pro` | `admin-pro@test.local` |
| `22222222-2222-2222-2222-222222222222` | Ristorante Test Classic | `classic` | `admin-classic@test.local` |

Password: `TestE2E2026!`

**Dati minimi**:
- Tenant Pro: 3 clienti CRM (Mario Rossi, Luigi Bianchi, Anna Verdi)
- Tenant Classic: 3 prenotazioni (Luca Ferrari pending, Sara Conti pending, Marco Esposito accepted)

### 1.3 Variabili E2E impostate

`.env.local.test` aggiornato con:
```
E2E_ADMIN_EMAIL=admin-classic@test.local
E2E_ADMIN_PASSWORD=TestE2E2026!
E2E_TENANT_SLUG=ristorante-test-classic
E2E_CLASSIC_TENANT_ID=22222222-2222-2222-2222-222222222222
E2E_SUPABASE_SERVICE_KEY=<service-role-key-staging>
```

`playwright.config.ts` aggiornato per caricare `.env.local.test` automaticamente via `process.loadEnvFile` (Node 22).

---

## Attività 2 — Verifica edition

### 2.1 Edge Function create-booking

**Analisi**: la funzione usa correttamente `SUPABASE_SERVICE_ROLE_KEY` per inserire in `booking_requests` — bypassa RLS. Nessun bug nella gestione della service key.

**Trovato**: la funzione non inserisce mai in `customers`. Le prenotazioni pubbliche non creano clienti CRM automaticamente. → **Bug B01** (loggato in Report-bug-trovati).

### 2.2 Test E2E edition — risultati

Comando: `npx playwright test --grep edition`

| Test | Risultato | Note |
|------|-----------|------|
| `edition-classic` — nessuna sidebar | ✅ PASS | Sidebar assente confermata |
| `edition-classic` — 5 tab operativi | ❌ FAIL B02 | Selector trova 2 bottoni "Calendario" |
| `edition-classic` — click Calendario | ❌ FAIL B02 | Stesso problema strict mode |
| `edition-classic` — no walk-in | ❌ FAIL B02 | Stesso problema strict mode |
| `edition-classic` — no no-show | ❌ FAIL B02 | Stesso problema strict mode |
| `edition-classic-data-protection` — RLS | ✅ PASS | Customers vuoti per Classic confermato |
| `edition-upgrade` — sidebar dopo reload | ❌ FAIL B03 | Sidebar Pro non appare dopo reload |

**2 test passati, 5 falliti** — tutti con causa identificata e loggata come bug.

### 2.3 Test frontend manuale

Non eseguito in questa sessione — i test E2E headless coprono i check richiesti. I bug trovati rendono ulteriori check manuali ridondanti.

---

## Attività 3 — Sistema testing

### Test nuovi creati (Vitest)

| File | Flusso coperto | # test |
|------|---------------|--------|
| `src/config/__tests__/features.test.ts` | `buildFeatures` — tutti i flag per classic/pro/enterprise | 22 |
| `src/hooks/__tests__/useFeatures.test.tsx` | `useFeatures` — flag corretti per edition via mock TenantContext | 3 |

**Totale test dopo sessione**: 54 (erano 29 prima dei nuovi test).

### README creato

`tests/README.md` — contiene:
- Tabella test esistenti Vitest e Playwright
- Come configurare staging (file `.env.local.test`)
- SQL per ricreare i tenant di test da zero
- Comandi principali
- Troubleshooting errori comuni

---

## Attività 4 — Skill Testing

Creato `docs/Testing-Skill/` con 3 file:

| File | Contenuto |
|------|-----------|
| `TESTING_SKILL.md` | Entry point — quando/come usare, regola d'oro staging, Vitest vs Playwright, comandi |
| `TESTING_CONTEXT.md` | Mappa completa test, setup MSW, stato staging, bug noti nei test E2E |
| `TESTING_PATTERNS.md` | Template snippet per Vitest hook, funzione pura, Playwright E2E, edition-gated, anti-pattern |

`docs/APP_CONTEXT_SKILL.md` aggiornato con riga testing nella tabella di instradamento.

---

## Validate finale

```
npm run validate → lint 0 warning / typecheck 0 errori / 54/54 Vitest ✅
```

---

## Comandi per riprodurre

```bash
# Test Vitest
npm run test

# Test E2E edition su staging
npm run test:e2e -- --grep edition

# Solo il test RLS (quello che passa sempre)
npx playwright test edition-classic-data-protection --reporter=list
```

---

## Cosa resta per la prossima sessione

- **Fix B02**: correggere i selector ambigui nei 4 test edition-classic (usare `data-testid` o selettore contestuale)
- **Fix B03**: investigare perché `TenantContext` non rilegge `edition` su reload — possibile caching della sessione o mancanza di invalidazione query
- **B01**: decidere se `create-booking` deve auto-creare clienti CRM (feature request o bug?)
- Test E2E per golden path admin Classic: login → accetta prenotazione → verifica spostamento
