---
name: testing
description: >-
  Skill per qualsiasi lavoro su test in CalendarBackup-v2: aggiungere test Vitest,
  scrivere spec Playwright E2E, configurare staging, analizzare fallimenti.
  Caricalo quando il task riguarda test, CI, staging Supabase o copertura.
---

# Testing — Guida agente

> Stack: Vitest + jsdom + MSW per unit/component — Playwright + Chromium per E2E su staging Supabase.

---

## 0. Quando caricare questo skill (vs altri)

| Il task riguarda… | Skill da usare |
|-------------------|----------------|
| Aggiungere / modificare test Vitest | **TESTING_SKILL** (questo) |
| Scrivere / correggere spec Playwright | **TESTING_SKILL** (questo) |
| Configurare staging Supabase | **TESTING_SKILL** (questo) |
| Analizzare un test che fallisce | **TESTING_SKILL** (questo) |
| Modificare il codice applicativo (non i test) | skill area (ADMIN_CLASSIC, ADMIN_SHELL, DB…) |
| Modificare schema DB per far girare un test | **DB_SKILL** + TESTING_SKILL |

---

## 1. Regole d'oro

**Prima di scrivere un test nuovo, verifica se ne esiste già uno utile.**

- Cerca nel file di test esistente più vicino alla funzione/hook in questione.
- Se un test già copre il comportamento richiesto e passa, non riscriverlo — usalo come riferimento o estendilo con un `it` aggiuntivo nella stessa `describe`.
- Solo se nessun test esistente è riutilizzabile crea un nuovo file o una nuova `describe`.

**Nessun test tocca il DB di produzione** (`rwuxgvldzrkabglkasym`).

- Vitest: usa mock (`vi.mock`) e MSW — zero chiamate reali
- Playwright: usa solo il progetto staging (`docnnernvpyrbwuzzach`) — credenziali in `.env.local.test`

---

## 2. Quando usare Vitest vs Playwright

```
Se puoi testare la logica senza aprire un browser → Vitest
Se stai simulando un utente che clicca su qualcosa → Playwright
```

**Esempi Vitest**: hook, config, utility, trasformazioni dati, logica RLS simulata via mock.

**Esempi Playwright**: login, accettare una prenotazione, verificare che la sidebar non appaia per Classic, form pubblico.

---

## 3. Comandi principali

```bash
npm run test                          # 54 test Vitest — veloci, nessun browser
npm run test:watch                    # watch mode durante sviluppo
npm run test:e2e                      # Playwright completo
npm run test:e2e -- --grep edition    # Solo test edition (7 test su staging)
npm run validate                      # lint + typecheck + test (pre-PR)
npx playwright install chromium       # Prima volta: installa il browser
```

---

## 4. Stack dettagliato

### Vitest (unit + component)
- Config: `vitest.config.ts` — environment jsdom, globals, env Supabase fake
- Setup: `tests/setup.ts` — MSW server + jest-dom + cleanup automatico
- Mock Supabase: `vi.mock('@/lib/supabase', () => ({ supabase: { from: mockFrom } }))`
- Import alias: `@/` → `src/` (configurato in `vitest.config.ts` via resolve.alias)

### Playwright (E2E)
- Config: `playwright.config.ts` — carica automaticamente `.env.local.test` se presente
- Browser: solo Chromium (headless in CI, headed in debug)
- Base URL: `http://localhost:5173` — dev server avviato automaticamente da webServer
- Variabili: `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`, `E2E_CLASSIC_TENANT_ID`, `E2E_SUPABASE_SERVICE_KEY`
- File di credenziali: `.env.local.test` (gitignored) — vedi `tests/README.md` per ricreare

---

## 5. Pattern edition-gated

I test E2E edition si attivano/disattivano automaticamente in base alle variabili:

```ts
// Si skippa se staging non configurato
test.skip(!process.env.E2E_ADMIN_EMAIL, 'richiede staging Supabase')

// Verifica che Classic NON veda la sidebar
await expect(page.getByRole('navigation', { name: /navigazione principale/i })).not.toBeVisible()

// Verifica che Pro VEDA la sidebar
await expect(page.getByRole('navigation', { name: /navigazione principale/i })).toBeVisible()
```

Per i Vitest edition-gated:
```ts
it("classic → nessuna feature Pro", () => {
  const f = buildFeatures('classic')
  expect(f.sidebar).toBe(false)
  expect(f.crm).toBe(false)
})
```

---

## 6. Tabella file di contesto

| File | Cosa contiene |
|------|---------------|
| `TESTING_SKILL.md` | Entry point — quando e come usare il sistema testing |
| `TESTING_CONTEXT.md` | Mappa completa test, setup MSW, come ricreare staging |
| `TESTING_PATTERNS.md` | Template snippet pronti per Vitest, Playwright, edition |
| `tests/README.md` | Guida operativa per sviluppatori — comandi, troubleshooting |
| `tests/setup.ts` | MSW server + cleanup Vitest |
| `vitest.config.ts` | Config Vitest (jsdom, globals, alias) |
| `playwright.config.ts` | Config Playwright (staging env, webServer) |
