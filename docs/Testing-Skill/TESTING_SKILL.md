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
| **Collaudo a mano di S4 / Servizio** (cosa deve provare Matteo) | **[COLLAUDO_S4_CHECKLIST.md](COLLAUDO_S4_CHECKLIST.md)** |
| **Far eseguire il collaudo S4 agli agenti** (Playwright MCP, 4 corsie in parallelo) | **[PIANO_E2E_AGENTI_S4.md](PIANO_E2E_AGENTI_S4.md)** + **[PROMPT_AGENTI_E2E_S4.md](PROMPT_AGENTI_E2E_S4.md)** |
| **Riprendere il cantiere S4 da dove è rimasto** (stato, blocchi, decisioni chiuse, ordine di lavoro) | **[HANDOFF_S4_SENIOR.md](../Sessioni%20di%20lavoro/02-08-26/HANDOFF_S4_SENIOR.md)** |
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
npm run test                          # npm run test deve essere verde — veloci, nessun browser
npm run test:watch                    # watch mode durante sviluppo
npm run test:e2e                      # Playwright completo
npm run test:e2e -- --grep edition    # Solo test edition su staging — deve essere verde
npm run validate                      # lint + typecheck + test (pre-PR)
npx playwright install chromium       # Prima volta: installa il browser
```

> ⚠️ **`npm run validate` NON guarda i test e2e.** ESLint ignora `e2e/**`, `tests/**` e
> `**/__tests__/**` (`.eslintrc.cjs` `ignorePatterns`), e `tsc --noEmit` compila solo `src`
> (`tsconfig.json` `"include": ["src"]`). Quindi «lint e typecheck verdi» dopo aver modificato una
> spec Playwright **non dice niente su quella spec**: nessuno dei due l'ha letta. Finché non esiste
> un `tsconfig` dedicato, per controllare i tipi di un file e2e serve un comando ad hoc, es.
> `npx tsc --noEmit --strict --skipLibCheck --target es2022 --module esnext --moduleResolution bundler --types node e2e/<file>.spec.ts e2e/helpers/supabaseStaging.ts`
> (verificato il 04-08-26; l'unico controllo vero su una spec resta eseguirla).

> ⚠️ **Il form pubblico ha un limite di frequenza per IP, e la batteria ci sbatte contro.**
> `create-booking` (`supabase/functions/create-booking/index.ts:149-200`) registra in `rate_limits`
> **ogni** richiesta che arriva all'endpoint — anche quelle poi respinte — e risponde **429** oltre
> **3 richieste al minuto per IP**; se dopo lo sforamento l'IP totalizza **6+ richieste in 10
> minuti** finisce in `ip_blacklist` per **24 ore**, e da quel momento nessun test sul form pubblico
> gira più da quella macchina.
> Il 429 è insidioso perché **non si vede come errore inline**: la mappatura di «Troppe richieste»
> (`bookingPublicFormErrorFeedback.ts:163-171`) ha `inlineMessage: ''`, quindi il test fallisce
> cercando un elemento che non comparirà mai e sembra un difetto del form. Successo davvero il
> 05-08-26: quattro invii reali in 58 secondi fra `public-booking.spec.ts` e
> `public-booking-classic.spec.ts`.
> **Regola:** ogni spec che preme «Invia» sul form pubblico chiama prima
> `waitForCreateBookingRateLimitWindow()` (`e2e/helpers/supabaseStaging.ts`), che legge `rate_limits`
> e aspetta che ci sia posto. Un invio reale per test, mai due, mai un retry sul submit.
>
> ⚠️ **La batteria e2e gira a UN worker, e la scelta è chiusa (05-08-26).** `playwright.config.ts`
> ha ora `workers: Number(process.env.E2E_WORKERS) || 1` **anche in locale** (prima era `undefined`,
> cioè ~12 worker). Le tre ragioni, tutte misurate, stanno nel commento sopra quella riga: contesa
> (12 worker → 51/31, 1 worker → 71/12, stesso commit), 17 spec su 25 sullo **stesso tenant e stesso
> account**, e soprattutto il fatto che `waitForCreateBookingRateLimitWindow()` è un
> **controlla-poi-agisci**: in parallelo due worker leggono «c'è posto» insieme, inviano insieme, e
> **6 richieste in 10 minuti mettono l'IP in blacklist per 24 ore**. Costo della serialità: **7,0
> minuti per 117 test**. Per riaprire la discussione serve prima l'isolamento per-tenant delle spec.
> Baseline conclusiva 06-08-26 su server dedicato: **118/118 in 6,4 minuti**.
>
> ⚠️ **«Da sola è verde» NON assolve una spec.** Era la regola precedente ed è **insufficiente**:
> misura del 05-08-26 su `admin-menu-magazzino-blindatura.spec.ts`, che la sessione prima era stata
> archiviata come «rosso da interazione fra spec» perché da sola passava. Rilanciata **da sola** 3
> volte × 3 viewport → **1 rossa su 9**, e con **due errori di console diversi** nei due fallimenti
> osservati (un loop di render React sul form pubblico, un `signOut` di sicurezza dopo una RPC
> `check_admin_email` fallita). Un test intermittente al ~10% è verde da solo quasi sempre: se un
> rosso non si riproduce al primo tentativo, **rilancia N volte e conta**, non concludere «era
> contesa». E salva `test-results/` **prima** di rilanciare: Playwright la svuota a ogni run
> (`--output=<cartella>` per tenerne una per giro).
>
> ⚠️ **Asserzioni «zero errori di console» → falliscono per motivi diversi ogni volta.**
> `expect(browserErrors).toEqual([])` è una rete a strascico: prende qualunque cosa la pagina abbia
> loggato, quindi lo stesso test fallisce oggi per un motivo e domani per un altro. Va benissimo
> tenerla, ma quando è rossa **leggi `error-context.md` prima di ipotizzare**: il nome del test non
> dice niente sulla causa.

### Provare gli scenari a orologio a un'ora del giorno diversa

`pro-service-tables-lifecycle.spec.ts` calcola i suoi istanti con `safeAnchorNow()`
(`e2e/helpers/wallClockAnchor.ts`), che gira **in Node** e legge l'ora **locale del processo**. Per
provarlo a ridosso della mezzanotte non serve aspettare la notte: si sposta il fuso.

```powershell
# Node E browser devono stare nello stesso fuso, altrimenti la prova non vale niente:
# su Windows Chromium legge il fuso dal sistema operativo, non da TZ — da qui E2E_TIMEZONE
# (playwright.config.ts → use.timezoneId), che lo forza via CDP.
$env:TZ='Asia/Kabul'; $env:E2E_TIMEZONE='Asia/Kabul'    # ~23:37 locali → finestra pre-mezzanotte
npx playwright test e2e/pro/pro-service-tables-lifecycle.spec.ts --workers=1
$env:TZ='Asia/Karachi'; $env:E2E_TIMEZONE='Asia/Karachi' # ~00:07 locali → finestra post-mezzanotte
npx playwright test e2e/pro/pro-service-tables-lifecycle.spec.ts --workers=1
$env:TZ=$null; $env:E2E_TIMEZONE=$null
```

Il fuso giusto va **ricalcolato al momento** (l'ora scorre): serve una zona la cui ora locale cada
fra le 23:25 e le 01:40. Prima di fidarti della run, verifica che la finestra sia davvero quella:
con la vecchia ancora l'inizio doveva risultare **dopo** la fine. Misura del 05-08-26 a 23:38 Kabul —
pre-fix `inizio 23:43` / `fine 00:04` (invertiti), post-fix `12:05` / `12:26` sul giorno prima.
Esito: **13/13 verde in entrambe le finestre**.

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
- Base URL locale E2E: `http://127.0.0.1:4173` — Playwright avvia un server dedicato con
  `VITE_SETTINGS_AUTOSAVE=false` e `reuseExistingServer:false`. Non riusa il dev server personale
  su 5173: potrebbe avere variabili o codice di avvio diversi. Per un server gestito dal chiamante
  usare esplicitamente `PLAYWRIGHT_BASE_URL`.
- Variabili: `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`, `E2E_TENANT_SLUG`, `E2E_CLASSIC_TENANT_SLUG`, `E2E_SUPABASE_SERVICE_KEY`
- File di credenziali: `.env.local.test` (gitignored) — vedi `tests/README.md` per ricreare

---

## 5. Pattern Playwright E2E che devono funzionare davvero

Usare questo schema per E2E su staging TEST. Serve a evitare test verdi solo sul DB "com'era ieri".

1. **Ambiente:** validare sempre che `VITE_SUPABASE_URL` punti a `docnnernvp`. Se lo spec scrive dati,
   usare solo helper in `e2e/helpers/supabaseStaging.ts`; mai query libere su PROD.
2. **Slug e account:** non assumere slug storici. Usare gli slug TEST correnti (`da-tommaso`,
   `test-classic`, `test-pro`) o un helper che verifica lo slug prima del test. Se `.env.local.test`
   contiene uno slug non più presente, il test deve fallire con messaggio chiaro o cadere su uno slug
   TEST esplicito.
3. **Dati:** non dipendere da dati permanenti se il caso può essere seedato. Fai snapshot prima,
   seed minimo, assert, poi restore/cleanup in `finally` o `afterAll`. Esempi: `getRestaurantSettingSnapshot`,
   `restoreRestaurantSettingSnapshot`, `upsertRestaurantSettingValue`, `deleteBookingsByPrefix`,
   `deleteMenuE2eData`.
   > ⚠️ **Il `finally` NON basta se il test può andare in timeout.** Playwright interrompe il corpo
   > del test allo scadere di `test.setTimeout(...)`, `finally` compreso: le `await` di ripristino
   > non arrivano al server. Se lo spec sovrascrive impostazioni condivise del tenant, la pulizia va
   > in **`afterEach`/`afterAll`**, che hanno un budget di tempo separato. Costo reale di questa
   > lezione: `admin-menu-magazzino-blindatura.spec.ts` ha lasciato `da-tommaso` con nome
   > «QA 375» e pagina Prenota «Configurazione temporanea Playwright» **dal 16-06-26 al 04-08-26**,
   > perché ogni variante di viewport fotografava il travestimento della precedente credendolo
   > l'originale e lo ri-scriveva a fine test.
4. **Verità a DB, non solo a schermo:** quando il test dichiara che un'azione *crea/cancella/modifica*
   qualcosa, l'asserzione finale deve leggere il dato, non un elemento generico dell'interfaccia.
   `[role="status"]`, `[class*="toast"]`, `.or()` fra rami opposti rendono il test verde in mondi
   diversi. Caso reale: «submit con dati validi crea la prenotazione» era verde da mesi **senza
   creare nessuna prenotazione** — il locator generoso stava intercettando il messaggio d'errore che
   diceva che il form era bloccato.
5. **Nessuna asserzione dentro un `if`.** `if (request) { expect(...) }` o
   `if (await x.isVisible()) await x.click()` rendono il test verde **anche quando il ramo non
   viene mai eseguito**: il verde smette di significare «ho verificato» e significa «non ho
   verificato». Caso reale 05-08-26: in `public-booking-fix9-compilable.spec.ts` il caso 5
   compilava data, ora e privacy con tre id **inesistenti in `src/`** dentro altrettanti
   `if (isVisible())` — muti — e l'unica asserzione viveva dentro `if (submitRequest)`. Se ti serve
   un ramo condizionale, la condizione va **asserita prima** (`await expect(x).toBeVisible()`), non
   usata per saltare in silenzio.
6. **Date locali, non UTC, quando il codice usa "oggi" a muro:** se il componente calcola la data con
   `getFullYear()/getMonth()/getDate()` o `date-fns format(..., 'yyyy-MM-dd')`, il test non deve
   seedare con `new Date().toISOString().slice(0, 10)`. In Europa, dopo mezzanotte locale, UTC può
   essere ancora il giorno prima: caso reale 05-08-26, `walkIn.b2.test.tsx` non vedeva il tavolo
   occupato perché l'assignment era stato creato su "ieri" UTC mentre `WalkInModal` leggeva "oggi"
   locale.
7. **Assert oggettivi:** per visual checklist assertare DOM verificabile, non "sembra giusto":
   classi/ruoli/testo/assenza immagini, icona SVG specifica, `toHaveText`, `toHaveCount(0)`,
   niente emoji se il requisito è "mai emoji".
8. **Locator strict:** se un testo appare in più punti responsive, circoscrivere il contenitore o usare
   `.first()` solo quando il requisito è "almeno un recapito visibile". Non lasciare locator ambigui.
9. **Debug onesto:** se un comando è rosso per dati staging obsoleti, documentarlo e correggere lo spec
   o l'ambiente. Non spuntare checklist finché il comando mirato non torna verde nello stato attuale.
10. **Run:** dopo ogni modifica E2E rilanciare il comando mirato dichiarato nel report; se aggiorni docs
   o checklist, controlla `git diff` e allinea il report allo stesso esito reale.

---

## 6. Pattern edition-gated

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

## 7. Tabella file di contesto

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

## 8. Profilo **Verifica** — protocollo QA manuale (obbligatorio)

> Caricare questa sezione quando Matteo chiede **revisiona / verifica / controlla** un lavoro già fatto, o a fine sessione prima di dichiarare «fatto». Vale per ogni area (promo, form Prenota, admin, CRM…), non solo per i test automatici.

### 8.1 Ordine delle verifiche

1. **`npm run validate`** — gate automatico (lint + typecheck + Vitest). Se fallisce, la revisione si ferma qui.
2. **QA manuale funzionale** — stessi casi su **tre viewport** (vedi §8.2). Non basta un solo zoom del browser.
3. **Registro esiti** — tabella nel report sessione (`docs/Sessioni di lavoro/…/Report-*.md`) con colonne: ID test · viewport · esito · nota.

### 8.2 Viewport standard CalendarBackup

Usare queste larghezze (Playwright: `page.setViewportSize`, DevTools device toolbar equivalente):

| Profilo | Larghezza × altezza | Ruolo nel prodotto |
|---------|---------------------|-------------------|
| **mobile** | **375 × 812** | Telefono; sticky bar Prenota; striscia laterale stretta (20vw) |
| **tablet** | **834 × 1194** | Tablet; layout intermedio; spesso ancora sticky bar (<1256px) |
| **desktop** | **1280 × 800** | Desktop; sidebar riepilogo Prenota da **≥1256px**; griglia 2 colonne form da **≥900px** dove documentato |

Per feature **solo admin classica** (Calendario, lista prenotazioni): aggiungere se serve **400px** (titolo calendario) come da `BOOKING_CALENDAR_LAYOUT_CONTEXT.md`.

Per ogni viewport ripetere **gli stessi passi funzionali** (es. cambio tipologia → banner promo → altra tipologia). L’UI può cambiare (sticky bar, colonne) ma il **comportamento dati** deve restare coerente.

### 8.3 Credenziali e ambiente

- **DB:** solo TEST (`docnnernvp`) — mai validare su produzione.
- **Dev server:** `npm run dev` (legge `.env.local` = test).
- **Credenziali QA:** `.env.local.test` → `MANUAL_ADMIN_EMAIL`, `MANUAL_ADMIN_PASSWORD`, `MANUAL_TENANT_SLUG` (gitignored). Riferimento: `docs/_lavoro/Per matteo/Comandi per terminale.md`.
- **Pagina pubblica:** `/prenota/{MANUAL_TENANT_SLUG}`. Non usare più lo slug storico `test`: su TEST gli slug correnti sono `da-tommaso`, `test-classic`, `test-pro`. Per smoke pubblici preferire `da-tommaso` o seed temporaneo con snapshot/restore.

Strumenti ammessi: **Playwright MCP** (browser), DevTools, o test E2E esistenti — l’agente deve **eseguire** i passi, non solo elencarli a Matteo.

### 8.4 Cosa documentare per ogni revisione

Nel report, sezione **«QA manuale»** (o **«QA manuale responsive»**):

- Data, commit/build se noto, tenant/slug usato.
- Tabella con righe per **funzione** (non solo per viewport): ripetere colonne `mobile` / `tablet` / `desktop` oppure una riga per viewport.
- Segnalare **Non testato** esplicitamente (es. submit + snapshot DB).
- Allegare follow-up in `docs/FOLLOW_UP.md` se il polish UI resta fuori scope (es. FU-001).

### 8.5 Esempio — feature Promo (Prenota + Personalizza form)

| ID | Caso | mobile | tablet | desktop |
|----|------|--------|--------|---------|
| C1 | Banner promo su tipologia abbinata | | | |
| C2 | Banner assente su tipologia non abbinata | | | |
| C3 | Banner torna su seconda tipologia (multi-target) | | | |
| A2 | Sezione Messaggio Promozionale in Personalizza form | | | |
| B1 | Tab Menu senza editor promo | | | |

Comportamento atteso Prenota (invariato tra viewport): un solo `region` «Promozioni menù»; priorità card > tipologia; sotto **1256px** tipicamente presente sticky riepilogo, da **≥1256px** riepilogo laterale.

### 8.6 Cosa non sostituisce il manuale

- Vitest su `menuPromo.ts` (o altri helper) — necessario ma non sufficiente.
- Una sola verifica a 1920px senza mobile/tablet.
- Solo lettura codice senza aprire l’app (salvo revisione puramente documentale).
