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
| **Blindare una sezione** (quali test dopo la mappatura, quando il "rompi" è dovuto) | **[MANUALE_BLINDATURA.md](MANUALE_BLINDATURA.md)** |
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
| `MANUALE_BLINDATURA.md` | **Metodo di blindatura**: sequenza test dopo mappatura, quando il controtest "rompi" è dovuto, cancello "blindato". Referenziato dal masterplan |
| `TESTING_CONTEXT.md` | Mappa completa test, setup MSW, come ricreare staging |
| `TESTING_PATTERNS.md` | Template snippet pronti per Vitest, Playwright, edition |
| `tests/README.md` | Guida operativa per sviluppatori — comandi, troubleshooting |
| `tests/setup.ts` | MSW server + cleanup Vitest |
| `vitest.config.ts` | Config Vitest (jsdom, globals, alias) |
| `playwright.config.ts` | Config Playwright (staging env, webServer) |

---

## 7. Profilo **Verifica** — protocollo QA manuale (obbligatorio)

> Caricare questa sezione quando Matteo chiede **revisiona / verifica / controlla** un lavoro già fatto, o a fine sessione prima di dichiarare «fatto». Vale per ogni area (promo, form Prenota, admin, CRM…), non solo per i test automatici.

### 7.1 Ordine delle verifiche

1. **`npm run validate`** — gate automatico (lint + typecheck + Vitest). Se fallisce, la revisione si ferma qui.
2. **QA manuale funzionale** — stessi casi su **tre viewport** (vedi §7.2). Non basta un solo zoom del browser.
3. **Registro esiti** — tabella nel report sessione (`docs/Sessioni di lavoro/…/Report-*.md`) con colonne: ID test · viewport · esito · nota.

### 7.2 Viewport standard CalendarBackup

Usare queste larghezze (Playwright: `page.setViewportSize`, DevTools device toolbar equivalente):

| Profilo | Larghezza × altezza | Ruolo nel prodotto |
|---------|---------------------|-------------------|
| **mobile** | **375 × 812** | Telefono; sticky bar Prenota; striscia laterale stretta (20vw) |
| **tablet** | **834 × 1194** | Tablet; layout intermedio; spesso ancora sticky bar (<1256px) |
| **desktop** | **1280 × 800** | Desktop; sidebar riepilogo Prenota da **≥1256px**; griglia 2 colonne form da **≥900px** dove documentato |

Per feature **solo admin classica** (Calendario, lista prenotazioni): aggiungere se serve **400px** (titolo calendario) come da `BOOKING_CALENDAR_LAYOUT_CONTEXT.md`.

Per ogni viewport ripetere **gli stessi passi funzionali** (es. cambio tipologia → banner promo → altra tipologia). L’UI può cambiare (sticky bar, colonne) ma il **comportamento dati** deve restare coerente.

### 7.3 Credenziali e ambiente

- **DB:** solo TEST (`docnnernvp`) — mai validare su produzione.
- **Dev server:** `npm run dev` (legge `.env.local` = test).
- **Credenziali QA:** `.env.local.test` → `MANUAL_ADMIN_EMAIL`, `MANUAL_ADMIN_PASSWORD`, `MANUAL_TENANT_SLUG` (gitignored). Riferimento: `docs/_lavoro/Per matteo/Comandi per terminale.md`.
- **Pagina pubblica:** `/prenota/{MANUAL_TENANT_SLUG}` (es. `test-pro`).

Strumenti ammessi: **Playwright MCP** (browser), DevTools, o test E2E esistenti — l’agente deve **eseguire** i passi, non solo elencarli a Matteo.

### 7.4 Cosa documentare per ogni revisione

Nel report, sezione **«QA manuale»** (o **«QA manuale responsive»**):

- Data, commit/build se noto, tenant/slug usato.
- Tabella con righe per **funzione** (non solo per viewport): ripetere colonne `mobile` / `tablet` / `desktop` oppure una riga per viewport.
- Segnalare **Non testato** esplicitamente (es. submit + snapshot DB).
- Allegare follow-up in `docs/FOLLOW_UP.md` se il polish UI resta fuori scope (es. FU-001).

### 7.5 Esempio — feature Promo (Prenota + Personalizza form)

| ID | Caso | mobile | tablet | desktop |
|----|------|--------|--------|---------|
| C1 | Banner promo su tipologia abbinata | | | |
| C2 | Banner assente su tipologia non abbinata | | | |
| C3 | Banner torna su seconda tipologia (multi-target) | | | |
| A2 | Sezione Messaggio Promozionale in Personalizza form | | | |
| B1 | Tab Menu senza editor promo | | | |

Comportamento atteso Prenota (invariato tra viewport): un solo `region` «Promozioni menù»; priorità card > tipologia; sotto **1256px** tipicamente presente sticky riepilogo, da **≥1256px** riepilogo laterale.

### 7.6 Cosa non sostituisce il manuale

- Vitest su `menuPromo.ts` (o altri helper) — necessario ma non sufficiente.
- Una sola verifica a 1920px senza mobile/tablet.
- Solo lettura codice senza aprire l’app (salvo revisione puramente documentale).
