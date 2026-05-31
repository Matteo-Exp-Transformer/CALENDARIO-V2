# Report Bug Trovati — Sessione 14-05-26

> Lista grezza. Nessuna proposta di fix. Usare per scrivere il plan di fix.

---

## B01 — create-booking non crea clienti CRM

**Severità**: media — "fastidio per Mario: deve aggiungere manualmente ogni cliente al CRM anche se ha già prenotato"

**Flusso utente impattato**:
Anna va sul sito di Mario e prenota un tavolo per venerdì. Mario apre il CRM il giorno dopo sperando di trovare Anna già registrata come cliente. Invece il CRM è vuoto — Anna non c'è. Mario deve aggiungere Anna a mano.

**Evidenza**:
In `supabase/functions/create-booking/index.ts` (riga 168), la funzione inserisce solo in `booking_requests`. Nessun INSERT in `customers`. Il codice non ha mai avuto questa logica.

**Area**: Edge Function

**Dove riprodurlo**:
1. Aprire `supabase/functions/create-booking/index.ts`
2. Cercare qualsiasi riferimento a `customers` → assente
3. Fare una prenotazione pubblica su staging (`ristorante-test-classic`)
4. Aprire Supabase Studio → tabella `customers` → 0 righe per quel tenant

---

## B02 — Test E2E edition-classic: selector ambiguo trova 2 bottoni

**Severità**: bassa — "bug di test, non blocca Mario; blocca solo l'automazione"

**Flusso utente impattato**:
Il test automatico che garantisce "Mario Classic non vede feature Pro" non funziona per 4 dei 5 assertion. Se qualcuno rompe la UI Classic in futuro, questi 4 test non lo segnalano.

**Evidenza**:
```
Error: strict mode violation: getByRole('button', { name: /calendario/i }) resolved to 2 elements:
  1) <button class="admin-nav-item ...">Calendario</button>  ← NavItem header
  2) <button aria-label="Calendario" ...>                    ← bottone mini-calendario
```

Playwright strict mode blocca quando un selettore trova più di 1 elemento. I selettori `getByRole('button', { name: /calendario/i })` e `getByRole('button', { name: /prenotazioni/i })` trovano sia i NavItem dell'header che i bottoni di navigazione del calendario (FullCalendar) che hanno gli stessi aria-label.

**Area**: Test / selettori E2E

**File**: `e2e/edition-classic.spec.ts` — test 2, 3, 4, 5 (righe 38-74)

**Dove riprodurlo**:
```bash
npx playwright test edition-classic --reporter=list
```
Fallisce i test 2-5 con "strict mode violation".

---

## B03 — edition-upgrade: dopo reload la sidebar Pro non appare

**Severità**: alta — "blocca la verifica automatica che l'upgrade funzioni; in produzione, un cliente che viene aggiornato a Pro dovrebbe vedere la sidebar dopo ricaricamento"

**Flusso utente impattato**:
Mario ha Classic. L'operatore lo aggiorna a Pro nel DB. Mario ricarica la pagina. Mario si aspetta di vedere la sidebar Pro. Invece continua a vedere la dashboard Classic senza sidebar.

**Evidenza**:
```
Error: expect(locator).toBeVisible() failed
Locator: getByRole('navigation', { name: /navigazione principale/i })
Expected: visible
Timeout: 10000ms
Error: element(s) not found
```

Il test in `edition-upgrade.spec.ts` (riga 75):
1. Fa login come admin Classic → nessuna sidebar ✓
2. Aggiorna `organizations.edition='pro'` via PATCH REST API con service key
3. Ricarica la pagina (`page.reload()`)
4. Attende la sidebar → non appare

Il `TenantContext` fa il login via RPC `check_admin_email` che include `edition`. Dopo il reload, la sessione Supabase è ancora valida (localStorage), quindi `setTenantFromAdmin` viene chiamato di nuovo con l'email dal JWT. Se la RPC restituisce la nuova edition `'pro'`, il context dovrebbe aggiornarsi. Il problema potrebbe essere un caching della query TanStack o un race condition nella sequenza di inizializzazione.

**Area**: TenantContext / hook di inizializzazione / possibile caching sessione

**File**: `src/contexts/TenantContext.tsx`, `e2e/edition-upgrade.spec.ts`

**Dove riprodurlo**:
```bash
npx playwright test edition-upgrade --reporter=list
```

---

## B04 — send-email Edge Function inesistente (noto da precedente audit)

**Severità**: alta — "blocca Mario: le email di conferma/rifiuto prenotazione non vengono mai inviate, ma l'app non mostra errori"

**Flusso utente impattato**:
Mario accetta una prenotazione di Anna. Anna dovrebbe ricevere un'email di conferma. Anna non riceve niente. Il flusso fallisce silenziosamente — né Mario né Anna vedono errori. Anna potrebbe non presentarsi al ristorante pensando che la prenotazione non sia confermata.

**Evidenza**:
`src/lib/email.ts` chiama `${SUPABASE_URL}/functions/v1/send-email`. La Edge Function `send-email` non esiste nel progetto (assente da `supabase/functions/`). Ogni chiamata email ritorna 404 o timeout silenzioso.

**Area**: Edge Function mancante

**Dove riprodurlo**:
1. Cercare `supabase/functions/send-email/` → cartella assente
2. Aprire `src/lib/email.ts` → vedi la chiamata HTTP
3. Accettare una prenotazione in produzione → nessuna email ricevuta

---

## Riepilogo

| ID | Titolo | Severità | Area |
|----|--------|----------|------|
| B01 | create-booking non crea clienti CRM | Media | Edge Function |
| B02 | Selector ambiguo in 4 test edition-classic | Bassa | Test E2E |
| B03 | Sidebar Pro non appare dopo reload post-upgrade | Alta | TenantContext |
| B04 | Edge Function send-email inesistente | Alta | Edge Function |
