# Comandi terminale — CalendarBackup dev

Guida rapida per te: cosa lanciare, cosa fa, e come personalizzare data/ora/ospiti.

---

## Configurazione (dopo allineamento repo)

| File | Supabase | Usato da |
|------|----------|----------|
| `.env.local` | **TEST** (`docnnernvp`) | `npm run dev`, `npm run seed:*` |
| `.env.production.local` | **PROD** (`rwuxgvld`) | `npm run dev:prod` |
| `.env.local.test` | TEST + credenziali E2E | `npm run test:e2e` |

- Un file = un ambiente (non mescolare test e prod nello stesso file).
- Template prod: copia `.env.production.local.example` → `.env.production.local`.
- Dopo ogni modifica ai `.env*`: **Ctrl+C** e riavvia il server.

**Setup una tantum:** metti le chiavi **TEST** in `.env.local` (puoi copiarle da `.env.local.test`). Crea `.env.production.local` con le chiavi prod (da ex `.env.local` prod o dall’example).

---

## Comandi base (sviluppo)

```powershell
# Sviluppo normale → DB test
npm run dev

# Solo quando serve verificare su dati produzione
npm run dev:prod

# Lint + typecheck + test veloci (nessun browser, nessun DB reale)
npm run validate
```

App: http://localhost:5173 — login admin: `/login`.

**Login QA manuale (DB test):** `test-pro@p.com` — password in `.env.local.test` (`MANUAL_ADMIN_*` / `E2E_ADMIN_*`).

**Controllo rapido:** DevTools → Network → host Supabase = `docnnernvpyrbwuzzach` (test) o `rwuxgvldzrkabglkasym` (prod).

---

## Inserire prenotazioni di prova nel DB (script seed)

> **Non sono test automatici** — sono comandi che **creano davvero** una prenotazione nel database di test, come se un cliente avesse compilato il form (stato `pending`, in attesa di approvazione in admin).

### Cosa serve prima

1. `.env.local` con chiavi Supabase **TEST** e `TENANT_SLUG` (es. `ristorante-test-classic` o il tuo ristorante).
2. Opzionale ma consigliato: `SUPABASE_SERVICE_ROLE_KEY` nello stesso file (lo script funziona meglio).

### 1 · Prenotazione «solo tavolo» — ✅ funziona

```powershell
npm run seed:booking-table
```

**Cosa fa:** inserisce una prenotazione tipo «Prenota un tavolo» (senza menù). Compare in admin → tab **Prenotazioni** → richieste in sospeso.

**Valori di default** (se non cambi nulla):

| Campo | Valore default |
|-------|----------------|
| Data | `2026-05-08` |
| Ora | `20:00` |
| Ospiti | `4` |
| Nome cliente | casuale (es. «Giulia Romano») |
| Email | `script-table-test@example.invalid` |

### 2 · Prenotazione con menù (rinfresco) — ✅ funziona

```powershell
npm run seed:booking-menu-full
```

**Cosa fa:** inserisce una prenotazione con voci menù scelte a caso dal menù del ristorante.

**Valori di default:**

| Campo | Valore default |
|-------|----------------|
| Data | `2026-05-08` |
| Ora | `20:00` |
| Ospiti | `12` |
| Nome cliente | casuale |

---

### Personalizzare data, ora, ospiti, nome (dal terminale)

Apri PowerShell **nella cartella del progetto** e incolla una riga sola prima del comando.

**Esempio — tavolo per 6 persone, 15 giugno 2026 alle 21:30, nome «Mario Rossi»:**

```powershell
$env:FIXED_BOOKING_DATE="2026-06-15"; $env:DESIRED_TIME="21:30"; $env:NUM_GUESTS="6"; $env:CLIENT_NAME="Mario Rossi"; npm run seed:booking-table
```

**Esempio — menù completo, 8 ospiti, data diversa:**

```powershell
$env:FIXED_BOOKING_DATE="2026-07-20"; $env:DESIRED_TIME="19:00"; $env:NUM_GUESTS="8"; $env:CLIENT_NAME="Anna Bianchi"; npm run seed:booking-menu-full
```

**Tutte le «manopole» che puoi girare dal terminale:**

| Nome (copia esatto) | Cosa cambia | Esempio |
|---------------------|-------------|---------|
| `FIXED_BOOKING_DATE` | Data della prenotazione | `"2026-06-15"` |
| `DESIRED_TIME` | Ora (formato `HH:MM`) | `"21:30"` |
| `NUM_GUESTS` | Numero ospiti | `"6"` |
| `CLIENT_NAME` | Nome sul form | `"Mario Rossi"` |
| `CLIENT_EMAIL` | Email | `"mario@test.it"` |
| `CLIENT_PHONE` | Telefono | `"3331234567"` |
| `TENANT_SLUG` | Quale ristorante (se non è già in `.env.local`) | `"al-ritrovo"` |

**Solo per menù completo** (opzionale):

| Nome | Cosa cambia | Default |
|------|-------------|---------|
| `RANDOM_MENU_MIN` | Minimo piatti scelti a caso | `3` |
| `RANDOM_MENU_MAX` | Massimo piatti scelti a caso | `12` |

**Nota PowerShell:** se hai già impostato una variabile in una sessione precedente e non si aggiorna, chiudi il terminale e riaprilo, oppure:

```powershell
Remove-Item Env:TENANT_SLUG -ErrorAction SilentlyContinue
```

### Verificare che la prenotazione sia arrivata

In Supabase Studio (progetto TEST) oppure in admin → tab **Prenotazioni**.

Query SQL pronte: `docs/_lavoro/Per matteo/GUIDA_USO_QUERIES_CONTROVERIFICA.md` (sezione «Form pubblico»).

---

## Test automatici sulle prenotazioni

Due tipi: **veloci** (Vitest, niente browser) e **browser** (Playwright, apre Chrome e usa il sito vero).

### Test veloci (Vitest) — ✅ funzionano

Non toccano il database reale. Simulano la logica interna.

```powershell
# Form pubblico Pagina Prenota — validazione, reset menù, limiti testo (5 test)
npm run test -- BookingRequestForm.flussoUtente

# Admin «nuova prenotazione» — solo regola placement Classic vs Pro (2 test)
npm run test -- useAdminBookingRequests

# Tutti i test veloci del progetto
npm run test
```

| Comando | Cosa testa | Personalizzabile da terminale? |
|---------|------------|----------------------------------|
| `BookingRequestForm.flussoUtente` | Che il form pubblico non invii dati vuoti, resetti il menù al cambio tipologia, tagli testo troppo lungo | **No** — valori fissi nel file di test |
| `useAdminBookingRequests` | Che in edition Classic il campo «placement» non venga salvato; in Pro sì | **No** |

> Questi test **non creano** prenotazioni nel DB. Per popolare il DB usa gli script `seed:*` sopra.

---

### Test browser (Playwright) — parziali / da sistemare

Usano `.env.local.test` e avviano da soli il sito su http://localhost:5173.

```powershell
# Tutti i test browser
npm run test:e2e

# Solo test form pubblico Pagina Prenota
npm run test:e2e -- --grep "Form prenotazione pubblica"

# Solo test accetta/rifiuta in admin
npm run test:e2e -- --grep "Gestione prenotazioni"
```

#### `Form prenotazione pubblica` — ⚠️ parziale (3 su 5 passano)

File: `e2e/public-booking.spec.ts`

| Test | Cosa fa | Stato |
|------|---------|-------|
| Pagina si apre | Apre `/prenota/<slug>` e controlla che ci sia il form | ✅ |
| Card tipologia | Clicca la prima card (tavolo, menù, ecc.) | ✅ |
| Sezione menù | Se c’è menù, controlla che compaia la lista piatti | ✅ |
| Email non valida | Invia form con email sbagliata → deve comparire errore | ❌ **da fixare** (bottone Invia non visibile senza scroll/card) |
| Dati validi → crea prenotazione | Compila nome/email/tel/2 ospiti e invia | ❌ **da fixare** (stesso problema) |

**Dati fissi nel test** (non cambiabili da terminale senza modificare il file):

- Nome: `Mario Rossi`
- Email: `mario.rossi@test.it`
- Telefono: `+39 333 1234567`
- Ospiti: `2`
- Data/ora: **non le imposta** — il test non compila data e ora (dipende da cosa chiede il form)

**Cosa puoi cambiare senza toccare codice:** solo quale ristorante, tramite `E2E_TENANT_SLUG` in `.env.local.test` (default `ristorante-test-classic`).

#### `Gestione prenotazioni admin` — ❌ tutti e 3 falliscono (da fixare)

File: `e2e/admin-booking-mgmt.spec.ts`

| Test | Cosa dovrebbe fare | Problema attuale |
|------|-------------------|------------------|
| Mostra prenotazioni in attesa | Dopo login, vede la sezione «In attesa» | Non trova la sezione (probabilmente non va sulla tab Prenotazioni) |
| Accetta prenotazione | Clicca Accetta → conferma → toast successo | Non trova il bottone Accetta |
| Rifiuta prenotazione | Clicca Rifiuta → motivo → conferma | Non trova il bottone Rifiuta |

**Prerequisito:** nel DB test devono esserci prenotazioni `pending` (usa `npm run seed:booking-table` prima).

**Non esiste ancora** un test browser per **«Inserisci Nuova Prenotazione»** dall’admin.

---

## Riepilogo — cosa usare per cosa

| Obiettivo | Comando | Funziona? |
|-----------|---------|-----------|
| Mettere una prenotazione finta nel DB (tavolo) | `npm run seed:booking-table` | ✅ |
| Mettere una prenotazione finta con menù | `npm run seed:booking-menu-full` | ✅ |
| Cambiare data/ora/ospiti/nome al volo | Variabili `$env:...` + seed (vedi sopra) | ✅ |
| Controllare che il form pubblico sia logico | `npm run test -- BookingRequestForm.flussoUtente` | ✅ |
| Simulare invio form nel browser | `npm run test:e2e -- --grep "Form prenotazione pubblica"` | ⚠️ 2 test rossi |
| Testare accetta/rifiuta in admin | `npm run test:e2e -- --grep "Gestione prenotazioni"` | ❌ da fixare |
| Controllare tutto prima di una PR | `npm run validate` | ✅ (esclude E2E) |

---

## Attenzione

- `npm run seed:*` legge sempre `.env.local` → resta sul **test** se `.env.local` è test.
- SQL e migrazioni MCP: progetto **TEST** `docnnernvp` salvo sessione esplicita su prod.
- I test E2E **non** leggono `FIXED_BOOKING_DATE` / `NUM_GUESTS` dal terminale: per quelli servono gli script seed, oppure modificare il file `.spec.ts` (in una sessione con l’agente).
- Guida test completa (altre aree): `docs/_lavoro/Per matteo/GUIDA-TEST-SISTEMA.md`
- Query SQL dopo un inserimento: `docs/_lavoro/Per matteo/GUIDA_USO_QUERIES_CONTROVERIFICA.md`
