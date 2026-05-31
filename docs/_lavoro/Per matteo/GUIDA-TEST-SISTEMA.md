# Guida al sistema di test — CalendarBackup-v2

> Documento per il proprietario del progetto. Spiega in linguaggio semplice cosa testa ogni test, come avviarlo, come modificarlo e cosa deve succedere per dirlo "passato".

---

## Come funziona il sistema in due righe

Ci sono due tipi di test:

- **Vitest** — test veloci, girano in pochi secondi, non aprono un browser. Verificano la logica interna dell'app (calcoli, regole, chiamate al database simulate). Puoi eseguirli sempre, anche senza internet.
- **Playwright** — test che aprono un browser vero e usano il tuo sito come farebbe un utente. Richiedono il database di staging (Supabase separato dalla produzione). Più lenti ma verificano i flussi reali.

---

## Comandi rapidi

```bash
# Tutti i test veloci (Vitest) — esegui sempre prima di fare una PR
npm run validate

# Solo test logica interna
npm run test

# Tutti i test browser (Playwright) — richiede staging configurato
npm run test:e2e

# Solo i test dell'edizione Classic (i più importanti per l'admin senza sidebar)
npm run test:e2e -- --grep "edition|login|booking|menu"

# Solo i test edition (sidebar/no-sidebar/upgrade)
npm run test:e2e -- --grep edition

# Guarda i test Vitest girare in tempo reale (utile quando modifichi codice)
npm run test:watch
```

---

## Parte 1 — Test logica interna (Vitest, 54 test)

Questi test non aprono browser e non toccano mai il database reale. Usano dati finti (mock).

---

### 1.1 · `src/lib/__tests__/supabase.test.ts` — 11 test

**Cosa testa**: le funzioni di base della connessione al database — come l'app riconosce errori di sessione scaduta e come trasforma i messaggi di errore tecnici in testo leggibile.

**Come avviarlo**:
```bash
npm run test -- supabase
```

**Risultati attesi — cosa deve succedere**:
- Se il token di sessione è scaduto → `isInvalidStoredRefreshTokenError` deve riconoscerlo e restituire `true`
- Se l'errore è generico → deve restituire il messaggio originale oppure "Si è verificato un errore. Riprova più tardi."
- Se non c'è nessun utente loggato → `getCurrentUser()` deve restituire `null`

**Come modificarlo — esempi pratici**:
- Vuoi aggiungere un nuovo messaggio di errore da intercettare? Aggiungi un test `it('restituisce true per messaggio "token expired"', ...)` copiando il pattern esistente e cambia la stringa nel mock.
- Vuoi cambiare il testo del messaggio di errore generico? Aggiorna il test che verifica `'Si è verificato un errore. Riprova più tardi.'` con il nuovo testo.

---

### 1.2 · `src/contexts/__tests__/TenantContext.test.tsx` — 5 test

**Cosa testa**: il meccanismo che identifica quale ristorante sta usando l'app. Quando Mario accede come admin, l'app deve riconoscere che è lui (dal suo indirizzo email) e caricare i dati del suo ristorante.

**Come avviarlo**:
```bash
npm run test -- TenantContext
```

**Risultati attesi**:
- Inserendo uno slug valido (es. `ristorante-test`) → l'app trova l'ID del tenant e il nome del ristorante
- Inserendo uno slug inesistente → `tenantId` rimane `null` (nessun crash)
- Dopo login admin → l'app carica ID tenant, nome ristorante e **edition** (classic/pro/enterprise)
- Chiamando `clearTenant()` → tutti i dati del tenant vengono azzerati

**Come modificarlo**:
- Per cambiare i dati di test del ristorante: modifica l'oggetto dentro `mockSingle.mockResolvedValueOnce({ data: { id: '...', name: '...', slug: '...' } })`.
- Per testare un tenant con edition diversa: cambia `edition: 'pro'` in `'classic'` o `'enterprise'` nell'oggetto `mockRpc.mockResolvedValueOnce`.

---

### 1.3 · `src/config/__tests__/features.test.ts` — 22 test

**Cosa testa**: le regole che stabiliscono quali funzionalità sono disponibili in base all'edition acquistata. Classic non deve vedere sidebar, CRM, analytics. Pro deve vedere tutto.

**Come avviarlo**:
```bash
npm run test -- features
```

**Risultati attesi**:
- `buildFeatures('classic')` → tutti i flag devono essere `false` (nessuna feature Pro)
- `buildFeatures('pro')` → tutti i flag devono essere `true`
- `buildFeatures('enterprise')` → stessi flag di Pro

**Come modificarlo**:
- Hai aggiunto una nuova feature (es. `reservationDeposit`)? Aggiungi un test per ciascuna edition: `it('reservationDeposit è false per classic', () => expect(f.reservationDeposit).toBe(false))`.
- Hai cambiato le regole (es. Classic ora vede il menu ma non il CRM)? Aggiorna il test corrispondente e il test "tutti false" che diventerebbe "quasi tutti false".

---

### 1.4 · `src/hooks/__tests__/useFeatures.test.tsx` — 3 test

**Cosa testa**: che il hook React `useFeatures()` — usato da tutti i componenti per sapere cosa mostrare — legga correttamente l'edition dal contesto e restituisca i flag giusti.

**Come avviarlo**:
```bash
npm run test -- useFeatures
```

**Risultati attesi**:
- Con edition `classic` → `sidebar: false`, `crm: false`, `noShow: false`, `walkIn: false`
- Con edition `pro` → `sidebar: true`, `crm: true`, `noShow: true`, `walkIn: true`
- Con edition `enterprise` → stessi flag di Pro

**Come modificarlo**: se aggiungi un nuovo flag a `buildFeatures`, aggiungi la verifica in uno dei tre test esistenti. Es. dopo `expect(result.current.crm).toBe(false)` aggiungi `expect(result.current.tuoNuovoFlag).toBe(false)`.

---

### 1.5 · `src/features/booking/hooks/__tests__/useAdminAuth.test.tsx` — 4 test

**Cosa testa**: il processo di login e logout dell'admin — che le credenziali corrette facciano accedere, che quelle errate vengano rifiutate, e che il logout pulisca lo stato.

**Come avviarlo**:
```bash
npm run test -- useAdminAuth
```

**Risultati attesi**:
- Senza sessione attiva → `user` è `null`, `isLoading` è `false`
- Login con credenziali corrette → `user.email` corrisponde all'email inserita, `success: true`
- Login con password sbagliata → `success: false`, messaggio errore, `user` rimane `null`
- Logout → `user` diventa `null`, Supabase `signOut` viene chiamato, si naviga a `/login`

**Come modificarlo**:
- Vuoi testare il caso "abbonamento non attivo"? Aggiungi un test dove `mockFrom` per `organizations` restituisce `{ is_active: false }` e verifica che il login restituisca `success: false`.
- Per cambiare le credenziali di test: modifica `'admin@test.it'` e `'password123'` dentro le chiamate `result.current.login(...)`.

---

### 1.6 · `src/features/booking/hooks/__tests__/useMenuCategories.test.tsx` — 5 test

**Cosa testa**: le operazioni CRUD sulle categorie del menu (Antipasti, Primi, Secondi, ecc.) — lettura, creazione, modifica.

**Come avviarlo**:
```bash
npm run test -- useMenuCategories
```

**Risultati attesi**:
- Se il tenant non è identificato → la query rimane in pausa (`idle`), non va in errore
- Lettura categorie → restituisce la lista filtrata per tenant, ordinata
- Creazione categoria → chiama `supabase.insert` con `key`, `label` e `tenant_id` corretti
- Creazione categoria duplicata → lancia errore "Esiste già una categoria con questo nome"
- Modifica label → chiama `supabase.update` con il nuovo valore

**Come modificarlo**:
- Per testare dati diversi: modifica `CAT_LIST` in cima al file con le categorie che vuoi simulare.
- Per aggiungere un test sulla cancellazione: copia la struttura di `useUpdateMenuCategory` ma chiama `result.current.mutateAsync({ id: 'cat-1' })` su un hook `useDeleteMenuCategory`.

---

### 1.7 · `src/features/booking/hooks/__tests__/useBookingMutations.test.tsx` — 4 test

**Cosa testa**: le azioni sulle prenotazioni — accettare, rifiutare, cancellare (soft-delete).

**Come avviarlo**:
```bash
npm run test -- useBookingMutations
```

**Risultati attesi**:
- Accettare una prenotazione → `supabase.update` chiamato con `status: 'accepted'`
- Accettare con DB che rifiuta (RLS) → l'errore viene propagato correttamente
- Rifiutare con motivo → `status: 'rejected'` e `rejection_reason` nell'aggiornamento
- Cancellare (soft-delete) → `status: 'deleted'` e `cancellation_reason` nell'aggiornamento

**Come modificarlo**:
- Per testare una prenotazione diversa: modifica `BOOKING_BASE` in cima al file (cambia `id`, `client_name`, `num_guests`, ecc.).
- Per aggiungere il test "no-show": aggiungi un `describe('useMarkNoShow')` copiando la struttura di `useCancelBooking`, con `status: 'no_show'`.

---

## Parte 2 — Test browser (Playwright, 13 spec file)

Questi test aprono Chrome e usano l'app come farebbe un utente reale. Richiedono il database di staging (`docnnernvpyrbwuzzach`) e il file `.env.local.test` nella root.

> **Prima di eseguire**: verifica che `.env.local.test` esista con le credenziali corrette (vedi `tests/README.md` § "Configurare lo staging").

---

### 2.1 · `e2e/admin-login.spec.ts` — 5 test

**Cosa testa**: che solo chi ha le credenziali giuste possa entrare nella dashboard admin.

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "Login admin"
```

**Risultati attesi**:
- Andare su `/` senza essere loggati → reindirizza a `/login`
- Andare su `/admin` senza sessione → reindirizza a `/login`
- Login con email e password corrette → si arriva a `/admin`
- Login con credenziali sbagliate → appare un toast di errore rosso
- Logout dalla dashboard → si torna a `/login`

**Come modificarlo**:
- Per cambiare le credenziali usate: modifica `E2E_ADMIN_EMAIL` e `E2E_ADMIN_PASSWORD` in `.env.local.test`.
- Per testare un secondo account: duplica il test "login OK" e usa credenziali diverse.

---

### 2.2 · `e2e/admin-booking-mgmt.spec.ts` — 3 test

**Cosa testa**: la gestione delle prenotazioni nella dashboard — che Mario possa vedere, accettare e rifiutare le prenotazioni dei clienti.

> **Prerequisito**: il DB staging deve avere almeno una prenotazione in stato `pending`.

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "Gestione prenotazioni"
```

**Risultati attesi**:
- Dashboard caricata → sezione "In attesa" visibile
- Click "Accetta" → appare conferma (modal o toast di successo)
- Click "Rifiuta" → possibile campo motivo + toast di successo

**Come modificarlo**:
- Per inserire prenotazioni di test: esegui lo script SQL in `tests/README.md` § "Dati minimi tenant Classic".
- Per testare un motivo di rifiuto specifico: modifica `'Locale al completo per quella data'` nel test.

---

### 2.3 · `e2e/public-booking.spec.ts` — 3 test

**Cosa testa**: il form pubblico che i clienti usano per prenotare un tavolo, accessibile senza login.

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "Form prenotazione pubblica"
```

**Dati usati dal test** (cliente fittizio):
```
Nome:     Mario Rossi
Email:    mario.rossi@test.it
Telefono: +39 333 1234567
Ospiti:   2
```

**Risultati attesi**:
- Pagina `/prenota/<slug>` si apre → mostra il form, non reindirizza al login
- Submit con email non valida (`non-una-email`) → appare messaggio di errore inline
- Submit con tutti i dati validi → appare toast o messaggio di conferma

**Come modificarlo**:
- Per cambiare il cliente di test: modifica i valori `'Mario Rossi'`, `'mario.rossi@test.it'`, ecc. dentro il test.
- Per cambiare lo slug del ristorante: modifica `E2E_TENANT_SLUG` in `.env.local.test`.

---

### 2.4 · `e2e/menu-crud.spec.ts` — 3 test

**Cosa testa**: la gestione del menu nella dashboard — aggiungere categorie, aggiungere piatti, eliminare voci.

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "Gestione menu"
```

**Dati usati dai test**:
- Categoria creata: `Test Categoria E2E`
- Piatto creato: `Bruschetta al pomodoro`, prezzo `8.50`

**Risultati attesi**:
- Click "Aggiungi categoria" → form si apre, compilando il nome e salvando → toast di successo
- Click "Aggiungi piatto" → form si apre, compilando nome e prezzo e salvando → toast di successo
- Click "Elimina" su un piatto → eventuale conferma → toast di successo

**Come modificarlo**:
- Per usare un nome categoria diverso: cambia `'Test Categoria E2E'` nel test.
- Per testare un prezzo diverso: cambia `'8.50'` nell'input `priceInput`.
- I test usano `test.skip()` automaticamente se i bottoni non sono visibili — questo è intenzionale per renderli robusti anche con DB vuoto.

---

### 2.5 · `e2e/invite-flow.spec.ts` — 4 test

**Cosa testa**: il flusso di registrazione di un nuovo admin tramite link di invito.

> **Prerequisito**: token valido in tabella `invite_tokens` e la variabile `E2E_VALID_INVITE_TOKEN` in `.env.local.test`.

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "Flusso invito"
```

**Risultati attesi**:
- URL `/invite/<token-valido>` → mostra form di registrazione
- URL `/invite/token-inesistente` → mostra messaggio "non valido" o "scaduto"
- Vecchio URL `/register?token=<token>` → funziona come il nuovo (retrocompatibilità)
- Compilare nome + password + conferma → toast di successo o redirect al login

**Come modificarlo**:
- Per cambiare il token usato: aggiorna `E2E_VALID_INVITE_TOKEN` in `.env.local.test`.
- Per testare la password: cambia `'PasswordSicura123!'` nei due campi password del test.

---

### 2.6 · `e2e/edition-classic.spec.ts` — 5 test ⭐ PRIORITARI

**Cosa testa**: che un admin con edition Classic veda esattamente l'interfaccia base, senza nessuna funzionalità Pro.

> Questi sono i test più importanti per garantire che la pagina admin senza sidebar funzioni correttamente.

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "Edition Classic — UI base"
```

**Credenziali usate**: `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` in `.env.local.test` → devono puntare all'admin `admin-classic@test.local`.

**Risultati attesi**:
1. Dopo login → **nessuna sidebar** visibile (niente menu laterale)
2. Sono visibili esattamente **5 tab**: Calendario, Prenotazioni, Archivio, Menu, Impostazioni
3. Click su "Calendario" → si apre la vista calendario
4. Nel calendario → **nessuna icona walk-in** (funzione non inclusa in Classic)
5. Nel modal di una prenotazione → **nessun bottone "No-show"** (funzione non inclusa in Classic)

**Come modificarlo**:
- Per cambiare l'admin Classic testato: modifica `E2E_ADMIN_EMAIL` in `.env.local.test` (deve essere un admin con edition Classic nello staging).
- Per aggiungere un test "nessun bottone X": duplica il pattern del test walk-in cambiando il selettore `[aria-label*="walk"i]` con quello del bottone che vuoi verificare assente.

---

### 2.7 · `e2e/edition-classic-data-protection.spec.ts` — 1 test ⭐ SICUREZZA

**Cosa testa**: che anche se qualcuno cerca di "sbloccare" la UI del CRM via console del browser (devtools), il database blocchi ugualmente la richiesta e non restituisca dati di clienti.

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "protezione dati RLS"
```

**Risultati attesi**:
- Login come admin Classic → nessuna lista clienti visibile nell'interfaccia
- Anche simulando un bypass JS → la query al DB restituisce 0 clienti (RLS blocca)

**Come modificarlo**: questo test è di sicurezza — modificarlo ha senso solo se cambi le policy RLS nel database. In quel caso aggiorna i commenti nel test per riflettere la nuova logica.

---

### 2.8 · `e2e/edition-upgrade.spec.ts` — 1 test

**Cosa testa**: che quando un ristorante viene aggiornato da Classic a Pro nel database, la sidebar Pro appaia dopo il ricaricamento della pagina.

> Questo test modifica il DB staging durante l'esecuzione e lo ripristina alla fine. Usa sempre il tenant di test `E2E_CLASSIC_TENANT_ID`, mai un tenant reale.

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "Edition Upgrade"
```

**Risultati attesi**:
1. Login come Classic → no sidebar
2. Upgrade del tenant a Pro via API (automatico nel test)
3. Reload della pagina → la sidebar Pro compare
4. Nella sidebar → bottoni CRM Clienti, Servizio, Analytics visibili

**Come modificarlo**:
- Per testare il downgrade (Pro → Classic): aggiungi un secondo test che fa il percorso inverso.
- Per cambiare il tenant usato: aggiorna `E2E_CLASSIC_TENANT_ID` in `.env.local.test` (deve essere un tenant dedicato ai test).

---

### 2.9 · `e2e/admin-classic-tabs.spec.ts` — 5 test

**Cosa testa**: le parti dell'admin classica che non erano coperte da altri test — il tab Archivio, il tab Impostazioni, e la cancellazione di una prenotazione (soft-delete) direttamente dal browser.

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "Admin Classic"
```

**Credenziali usate**: `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` — stesse del tenant Classic.

**Risultati attesi**:
- Click "Archivio" → la sezione si apre senza errori (può essere vuota)
- Sezione Archivio caricata → il contenuto del tab è stabile
- Click "Impostazioni" → il form impostazioni ristorante è visibile
- Form Impostazioni → almeno un campo di testo compilabile presente
- Click cancella su una prenotazione → il modal si chiude o appare un toast di conferma

**Nota**: il test di cancellazione usa `test.skip()` automatico se non ci sono prenotazioni disponibili nel DB staging — è robusto anche con DB vuoto.

---

### 2.10 · `e2e/pro/pro-login.spec.ts` — 3 test

**Cosa testa**: che un admin Pro possa fare login e che la sidebar sia immediatamente visibile (comportamento diverso da Classic).

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "Admin Pro — Login"
```

**Credenziali usate**: `E2E_PRO_ADMIN_EMAIL` / `E2E_PRO_ADMIN_PASSWORD` (si saltano se non impostati).

**Risultati attesi**:
- Login corretto → la sidebar appare entro 15 secondi
- Visita `/admin` senza sessione → reindirizza al login
- Login con password sbagliata → appare un toast di errore

---

### 2.11 · `e2e/pro/pro-sidebar-nav.spec.ts` — 5 test

**Cosa testa**: che la sidebar Pro contenga tutti i bottoni corretti e che la navigazione tra sezioni funzioni.

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "Admin Pro — Sidebar"
```

**Risultati attesi**:
1. Sidebar contiene: Home, Prenotazioni, CRM Clienti, Servizio, Analytics
2. Click "CRM Clienti" → appare l'intestazione della sezione CRM
3. Click "Servizio" → appare l'intestazione della sezione Servizio
4. Click "Analytics" → appare l'intestazione della sezione Analytics
5. Click "Prenotazioni" → torna alla dashboard con i 5 tab (Calendario, ecc.)

---

### 2.12 · `e2e/pro/pro-crm.spec.ts` — 2 test attivi + 1 documentale

**Cosa testa**: che la sezione CRM mostri la lista clienti con almeno 3 clienti nel DB staging.

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "Admin Pro — CRM"
```

**Dati richiesti**: il tenant Pro (`11111111-...`) deve avere almeno 3 clienti in tabella `customers` (già inseriti nello staging).

**Risultati attesi**:
- Click "CRM Clienti" dalla sidebar → la pagina CRM si carica
- Lista clienti → almeno 3 righe visibili

---

### 2.13 · `e2e/pro/pro-home.spec.ts` — 4 test

**Cosa testa**: che la sezione Home (la pagina di benvenuto Pro) sia quella attiva di default e che la navigazione con la sidebar funzioni senza rompere il layout.

**Come avviarlo**:
```bash
npm run test:e2e -- --grep "Admin Pro — Home"
```

**Risultati attesi**:
1. Dopo login Pro → la sezione Home è quella visibile (non il calendario come in Classic)
2. Click "Home" nella sidebar (già attivo) → nessun errore, sidebar rimane visibile
3. Dalla Home, click "Calendario" nell'header → si apre la vista calendario
4. Navigazione CRM → Servizio → Home → la sidebar rimane sempre visibile

---
### 2.14 - test per controllare flusso orario da pagina prenotazione e da pagina admin:
 
src\features\booking\utils\__tests__\CONTROLLA_ORARIO-PRENOTAZIONI.test.ts

---

## Parte 3 — Copertura attuale e lacune

### Admin classica (senza sidebar) — stato attuale

| Funzionalità | Vitest | Playwright | Note |
|-------------|--------|------------|------|
| Login / logout | ✅ hook testato | ✅ flusso completo | |
| Risoluzione tenant | ✅ TenantContext | — | |
| Feature flags Classic | ✅ buildFeatures + useFeatures | ✅ edition-classic | |
| Protezione RLS Classic | — | ✅ data-protection | |
| Accetta prenotazione | ✅ mutation | ✅ booking-mgmt | |
| Rifiuta prenotazione | ✅ mutation | ✅ booking-mgmt | |
| Cancella prenotazione | ✅ mutation (soft-delete) | ✅ admin-classic-tabs | |
| Categorie menu (CRUD) | ✅ useMenuCategories | ✅ menu-crud | |
| Tab Calendario | — | ✅ edition-classic | visibilità |
| Tab Archivio | — | ✅ admin-classic-tabs | aggiunto sessione 14-05-26 |
| Tab Impostazioni | — | ✅ admin-classic-tabs | aggiunto sessione 14-05-26 |
| Form prenotazione pubblica | — | ✅ public-booking | |
| Invito nuovo admin | — | ✅ invite-flow | |
| No-sidebar confermata | — | ✅ edition-classic | |
| No walk-in/no-show | — | ✅ edition-classic | |

### Admin con sidebar (Pro/Enterprise) — stato attuale

| Funzionalità | Vitest | Playwright | Note |
|-------------|--------|------------|------|
| Feature flags Pro | ✅ buildFeatures | — | logica ok |
| Sidebar visibile | — | ✅ edition-upgrade + pro-login | |
| Home page (AdminHomePage) | — | ✅ pro-home | aggiunto sessione 14-05-26 |
| Sezione CRM | — | ✅ pro-crm | aggiunto sessione 14-05-26 |
| Sezione Servizio | — | ✅ pro-sidebar-nav | verifica navigazione |
| Sezione Analytics | — | ✅ pro-sidebar-nav | verifica navigazione |
| Navigazione sidebar | — | ✅ pro-sidebar-nav + pro-home | aggiunto sessione 14-05-26 |

---

## Parte 4 — Come aggiungere un nuovo test

### Pattern per un test Vitest (logica)

```ts
// src/features/booking/hooks/__tests__/useNuovaFeature.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// 1. Manda il client Supabase in mock (zero chiamate reali)
const { mockFrom } = vi.hoisted(() => ({ mockFrom: vi.fn() }))
vi.mock('@/lib/supabase', () => ({
  supabase: { from: mockFrom },
  handleSupabaseError: (e: unknown) => (e as any)?.message ?? 'Errore',
}))

import { useNuovaFeature } from '../useNuovaFeature'

describe('useNuovaFeature', () => {
  it('fa la cosa giusta', async () => {
    // 2. Simula la risposta del DB
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null }),
    })

    const { result } = renderHook(() => useNuovaFeature())
    
    // 3. Esegui l'azione
    await act(async () => { await result.current.faiQualcosa() })

    // 4. Verifica il risultato atteso
    expect(result.current.stato).toBe('ok')
  })
})
```

### Pattern per un test Playwright (browser)

```ts
// e2e/nuova-funzionalita.spec.ts
import { test, expect } from '@playwright/test'

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? ''
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? ''

async function loginAdmin(page: import('@playwright/test').Page) {
  await page.goto('/admin')
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL)
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: /accedi|login/i }).click()
  // Attende che la dashboard sia pronta
  await expect(page.locator('header nav')).toBeVisible({ timeout: 10000 })
}

test.describe('Nuova funzionalità', () => {
  test('fa quello che deve fare', async ({ page }) => {
    await loginAdmin(page)
    
    // Naviga al tab giusto
    await page.locator('header nav').getByRole('button', { name: /calendario/i }).click()
    
    // Verifica che qualcosa sia visibile
    await expect(page.getByText('Titolo atteso')).toBeVisible()
  })
})
```

> **Regola importante**: nei test Playwright, usa sempre `page.locator('header nav').getByRole('button', { name: /testo/i })` per i 5 tab della dashboard classica. NON usare `page.getByRole('button', { name: /calendario/i })` direttamente — trova altri elementi con lo stesso testo in altri tab.

---

## Parte 5 — Troubleshooting rapido

| Cosa vedo | Causa | Come risolverlo |
|-----------|-------|-----------------|
| Test Vitest con `stderr` rosso | Log intenzionali da test negativi (es. "Organizzazione non trovata") | Non è un errore — il test verifica proprio quel caso |
| Test Playwright in `.skip` | Variabili `E2E_*` mancanti in `.env.local.test` | Controlla che tutte le variabili siano valorizzate |
| `browserType.launch: Executable doesn't exist` | Chromium non installato | `npx playwright install chromium` |
| Un test Playwright trova "strict mode violation" | Selettore trova 2+ elementi | Usa `locator('header nav').getByRole(...)` invece di `getByRole(...)` diretto |
| `npm run validate` fallisce su lint | Variabile non usata o warning ESLint | Leggi il messaggio e correggi la riga indicata |
