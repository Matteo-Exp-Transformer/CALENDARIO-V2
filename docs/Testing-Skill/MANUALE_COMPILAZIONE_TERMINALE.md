# Manuale Matteo — compilare e testare da terminale

> **A cosa serve.** Copia-incolla di comandi per riempire l’app di prova (prenotazioni, menù, ecc.)
> e per lanciare i test, **senza aprire codice**. Solo ambiente TEST (`docnnernvp`), mai produzione.
>
> **Per gli agenti:** se aggiungi o scopri un comando utile a Matteo per compilare/testare da
> terminale, **annotarlo qui** nello stesso ciclo (sezione giusta + 1 riga di spiegazione in parole
> semplici). Non lasciare il comando solo in `package.json` o in un report di sessione.

File correlati (più tecnici): `TESTING_SKILL.md`, `tests/README.md`.

---

## 0. Prima di tutto — file `.env.local.test`

Nella **root del progetto** (stessa cartella di `package.json`) deve esistere `.env.local.test`.
Non si chiama `env.test`. È già escluso da git (non finisce su GitHub).

### Un solo file, non tre

**Non creare** `.env.local.test.pro` / file gemelli. Playwright e `npm run seed:*` leggono
**solo** `.env.local.test`. Un secondo file non viene caricato e ti confonde (“quale sto usando?”).

Il file è un **catalogo** di tutti gli account TEST, con **default fissi** su
`da-tommaso` / `tomas@t.com` (è l’azienda “compilata” usata da Servizio, CRM, form pubblico E2E).

| Ruolo nel file | Chiavi tipiche | Account | A cosa serve |
|----------------|----------------|---------|--------------|
| **Default** (non cambiare alla leggera) | `E2E_TENANT_SLUG`, `E2E_ADMIN_*`, `E2E_PRO_*`, `MANUAL_*`, `E2E_PUBLIC_BOOKING_SLUG` | `tomas@t.com` → `da-tommaso` | Seed senza override + quasi tutti gli E2E Pro |
| **Classic** | `E2E_CLASSIC_*` | `testc@c.com` → `test-classic` | Test edition / shell Classic |
| **Catalogo secondario** | `E2E_TESTPRO_*` (promemoria) | `testp@p.com` → `test-pro` | Seed/QA su quell’azienda **senza** spostare i default |

### Come riempire `test-pro` senza rompere gli altri test

**Non** cambiare `E2E_TENANT_SLUG` o `E2E_PRO_ADMIN_EMAIL` nel file.
Se li punti a `test-pro` / `testp@p.com`, i test Pro che si aspettano `da-tommaso` (e login
allineato a Tommaso) si spezzano.

In PowerShell, **prima** del seed (la variabile di sessione vince sul file):

```powershell
$env:E2E_TENANT_SLUG="test-pro"
npm run seed:booking-table
npm run seed:booking-menu-full
```

Chiudi la finestra PowerShell (o apri una nuova) → tornano i default del file → E2E intatti.

**Cosa significa “slug”:** pezzo di URL dell’azienda.

| Admin | Password | Azienda | Slug (URL) |
|-------|----------|---------|------------|
| `tomas@t.com` | `123456` | Trattoria da Tommaso (**default E2E**) | `da-tommaso` |
| `testp@p.com` | `123456` | Ristorante PRO | `test-pro` → `/prenota/test-pro` |
| `testc@c.com` | `123456` | Ristorante Classic | `test-classic` |

Apri PowerShell nella root del repo, poi lancia i comandi sotto.

---

## 1. App locale (vedere l’interfaccia)

| Comando | In parole semplici |
|---------|-------------------|
| `npm run dev` | Apre l’app in locale sul DB di **test** (legge `.env.local`). |
| `npm run dev:prod` | Apre l’app puntando a **produzione** — solo se sai cosa fai; non usarlo per riempire dati di prova. |

Pagine utili dopo `npm run dev`:

- Login admin: `/admin`
- Form pubblico: `/prenota/test-pro` (o lo slug che hai in `.env.local.test`)

---

## 2. Compilare prenotazioni (seed da terminale)

Questi comandi **scrivono prenotazioni vere** sul DB TEST dell’azienda dello slug.
Ogni lancio = **una** prenotazione nuova (in attesa).

| Comando | In parole semplici |
|---------|-------------------|
| `npm run seed:booking-table` | Crea una prenotazione **solo tavolo** (senza piatti). |
| `npm run seed:booking-menu-full` | Crea una prenotazione **con menù** (sceglie piatti a caso dal magazzino dell’azienda). |

### 2.1 Una prenotazione “base”

Sull’azienda **default** del file (`da-tommaso`):

```powershell
npm run seed:booking-table
npm run seed:booking-menu-full
```

Sull’azienda di **`testp@p.com`** (`test-pro`) — override di sessione, file intatto:

```powershell
$env:E2E_TENANT_SLUG="test-pro"
npm run seed:booking-table
npm run seed:booking-menu-full
```

Controlla in admin → Prenotazioni / Calendario (login `testp@p.com` se hai seedato `test-pro`).

### 2.2 Cambiare giorno, ora, nome, posti

Prima del comando imposti delle “etichette” (variabili). Valgono solo in quella finestra PowerShell.

| Variabile | Cosa cambia | Esempio |
|-----------|-------------|---------|
| `E2E_TENANT_SLUG` | Quale azienda riceve la prenotazione | `test-pro` |
| `FIXED_BOOKING_DATE` | Giorno della prenotazione (`AAAA-MM-GG`) | `2026-05-10` |
| `DESIRED_TIME` | Orario (fascia) | `21:00` |
| `NUM_GUESTS` | Numero posti | `8` |
| `CLIENT_NAME` | Nome cliente in lista | `Mario Rossi` |
| `CLIENT_EMAIL` | Email cliente (finta ok) | `mario@example.invalid` |
| `CLIENT_PHONE` | Telefono | `3401112233` |
| `RANDOM_MENU_MIN` / `RANDOM_MENU_MAX` | Quanti piatti (solo seed menù) | `3` / `8` |

Esempio — un tavolo sabato sera:

```powershell
$env:E2E_TENANT_SLUG="test-pro"
$env:FIXED_BOOKING_DATE="2026-05-10"
$env:DESIRED_TIME="20:30"
$env:NUM_GUESTS="6"
$env:CLIENT_NAME="Sara Bianchi"
npm run seed:booking-table
```

Esempio — un menù a pranzo un altro giorno:

```powershell
$env:E2E_TENANT_SLUG="test-pro"
$env:FIXED_BOOKING_DATE="2026-05-11"
$env:DESIRED_TIME="13:00"
$env:NUM_GUESTS="12"
$env:CLIENT_NAME="Luca Verdi"
npm run seed:booking-menu-full
```

Data di default degli script (se non imposti nulla): **`2026-05-08`**.

### 2.3 Più prenotazioni diverse (stesso giorno, orari diversi)

Copia-incolla blocco per blocco (ogni blocco = 1 prenotazione):

```powershell
$env:E2E_TENANT_SLUG="test-pro"
$env:FIXED_BOOKING_DATE="2026-05-08"

$env:DESIRED_TIME="19:00"; $env:CLIENT_NAME="Tavolo 19"; $env:NUM_GUESTS="2"
npm run seed:booking-table

$env:DESIRED_TIME="20:00"; $env:CLIENT_NAME="Tavolo 20"; $env:NUM_GUESTS="4"
npm run seed:booking-table

$env:DESIRED_TIME="21:00"; $env:CLIENT_NAME="Tavolo 21"; $env:NUM_GUESTS="8"
npm run seed:booking-table
```

### 2.4 Più prenotazioni in giorni diversi

```powershell
$env:E2E_TENANT_SLUG="test-pro"
$env:DESIRED_TIME="20:00"
$env:NUM_GUESTS="4"

$env:FIXED_BOOKING_DATE="2026-05-08"; $env:CLIENT_NAME="Giorno 8"
npm run seed:booking-table

$env:FIXED_BOOKING_DATE="2026-05-09"; $env:CLIENT_NAME="Giorno 9"
npm run seed:booking-table

$env:FIXED_BOOKING_DATE="2026-05-10"; $env:CLIENT_NAME="Giorno 10"
npm run seed:booking-table
```

### 2.5 Misto tavolo + menù (calendario più “pieno”)

```powershell
$env:E2E_TENANT_SLUG="test-pro"
$env:FIXED_BOOKING_DATE="2026-05-08"

$env:DESIRED_TIME="19:30"; $env:CLIENT_NAME="Solo tavolo"; $env:NUM_GUESTS="3"
npm run seed:booking-table

$env:DESIRED_TIME="20:30"; $env:CLIENT_NAME="Con menu"; $env:NUM_GUESTS="10"
npm run seed:booking-menu-full
```

### 2.6 Se qualcosa va storto nei seed

- Messaggio tipo “organizzazione non trovata” → slug sbagliato o assente in `.env.local.test`.
- Messaggio su chiavi mancanti → mancano `VITE_SUPABASE_*` o la service role key.
- Seed menù senza piatti → l’azienda non ha voci attive nel magazzino Menu; aggiungile da admin → tab Menu, poi rilancia.
- In terminale vedi `[seed-…] ✓` con id prenotazione = ok.

---

## 3. Test automatici (senza compilare a mano)

### 3.1 Test veloci (no browser)

| Comando | In parole semplici |
|---------|-------------------|
| `npm run test` | Controlla pezzi di logica in automatico (Vitest). Non scrive prenotazioni vere. |
| `npm run test:watch` | Come sopra, ma resta in ascolto mentre lavori. |
| `npm run test:ui` | Stessi test con interfaccia grafica. |
| `npm run test:coverage` | Test + quanto codice è coperto. |
| `npm run validate` | Lint + controllo tipi + Vitest. **Non** include i test E2E sul browser. |

### 3.2 Test E2E (browser vero su staging)

Prima volta sola:

```powershell
npx playwright install chromium
```

| Comando | In parole semplici |
|---------|-------------------|
| `npm run test:e2e` | Lancia **tutti** i test Playwright (lento; un worker alla volta). |
| `npm run test:e2e:ui` | Stesso, con finestra per scegliere i test. |
| `npm run test:e2e -- --grep "Admin Pro"` | Solo flussi dell’admin **Pro** (`testp@p.com`). |
| `npm run test:e2e -- e2e/pro/` | Solo la cartella Pro. |
| `npm run test:e2e -- e2e/pro/pro-login.spec.ts` | Solo login Pro. |
| `npm run test:e2e -- e2e/pro/pro-crm.spec.ts` | CRM Pro (può creare anche prenotazioni di supporto). |
| `npm run test:e2e -- --grep edition` | Controlli Classic / upgrade edition. |
| `npm run test:e2e -- e2e/public-booking.spec.ts` | Form pubblico di prenotazione. |

**Attenzione form pubblico:** troppi invii di fila dalla stessa rete possono bloccare l’IP per 24 ore (limite anti-spam). Non martellare `public-booking` a raffica.

---

## 4. Database TEST (solo se te lo chiede una sessione)

| Comando | In parole semplici |
|---------|-------------------|
| `npm run db:apply` | Applica le migrazioni sullo staging TEST (usa `.env.local.test`). |
| `npm run db:types:linked` | Rigenera i tipi TypeScript dal DB collegato. |

Non usare comandi DB su produzione da qui.

---

## 5. Scorciatoie “cosa voglio fare”

| Voglio… | Fai questo |
|---------|------------|
| Riempire il calendario di `testp@p.com` | `$env:E2E_TENANT_SLUG="test-pro"` poi §2 (non toccare i default del file) |
| Riempire `da-tommaso` (default) | §2 senza override |
| Stesso giorno, orari diversi | §2.3 |
| Giorni diversi | §2.4 |
| Vedere l’app | `npm run dev` + login admin |
| Controllare che il codice non sia rotto (veloce) | `npm run validate` |
| Controllare l’admin Pro come un utente | `npm run test:e2e -- --grep "Admin Pro"` |
| Capire i dettagli tecnici dei test | `TESTING_SKILL.md` + `tests/README.md` |

---

## 6. Manutenzione di questo file (obbligatoria per agenti)

Quando compare un **nuovo** script `npm run …` utile a Matteo per:

- inserire dati di prova,
- resettare/riempire un’azienda TEST,
- lanciare un pacchetto di test “di uso quotidiano”,

allora:

1. Aggiungi una riga nella sezione giusta di **questo** file (comando + frase semplice “cosa fa”).
2. Se è uno scenario di compilazione (più giorni / più fasce / più tipi), aggiungi un mini esempio PowerShell in §2.
3. Cita il cambio nel report di sessione (“allineato `MANUALE_COMPILAZIONE_TERMINALE.md`”).

Non duplicare qui tutta la teoria Vitest/Playwright: resta in `TESTING_SKILL.md`.
Questo file è il **manuale operativo di Matteo**.
