# Report revisione blindatura Prenota - 06-06-26

## Sintesi

Obiettivo richiesto: verificare e chiudere i rischi principali su Pagina Prenota, Personalizza form e Anagrafica azienda, con attenzione a:

- niente dati demo o contenuti di altre aziende visibili a un cliente nuovo;
- niente mock o fallback produttivi non neutrali;
- nessuna logica pubblica legata a nomi specifici di prodotti, piatti o ristoranti;
- coerenza tra configurazioni admin salvate e rendering pubblico su `/prenota/:slug`;
- nessuna modifica al submit cliente se non strettamente necessaria.

Risultato operativo: sono stati corretti i bug confermati nel codice Prenota e aggiunti test mirati. Non sono state fatte scritture DB, migrazioni o modifiche a `useCreateBookingRequest`.

Branch di lavoro: `env/test`.

## Metodo seguito

Il lavoro e stato condotto come revisione parent con piu fronti paralleli:

- mappatura storica Prenota da skill, README e report sessioni;
- verifica admin -> pubblico su form, menu, preset, promo, anagrafica e settings;
- audit hardcoded/mock/demo;
- test runtime e suite locali;
- controlli Supabase read-only dove disponibili.

Le modifiche fuori Prenota sono state lasciate fuori dallo scope, come richiesto, perche riferite al lavoro parallelo su QR code menu.

## Bug e rischi risolti

### 1. Tipo prenotazione iniziale hardcoded su tavolo

Prima:

- il form pubblico inizializzava `booking_type` a `tavolo`;
- dopo una richiesta completata, il reset tornava comunque a `tavolo`;
- la promo resolution partiva da `tavolo`;
- se l'admin disabilitava Tavolo e lasciava attiva una modalita diversa, il pubblico poteva partire con un tipo non valido o non coerente con la configurazione.

Ora:

- il tipo iniziale viene scelto dal primo booking mode realmente abilitato;
- se il tipo corrente diventa non valido rispetto alla config, viene riallineato al primo tipo disponibile;
- reset post-success e promo usano lo stesso tipo iniziale calcolato;
- il form resta coerente con quanto impostato in admin.

Miglioramento:

- previene invii con modalita disabilitate;
- evita che un cliente nuovo erediti un comportamento "tavolo first" non deciso dall'admin;
- rende la pagina pubblica piu aderente alla configurazione tenant.

### 2. Reset orario post-success hardcoded alle 16:00

Prima:

- dopo l'invio il form veniva resettato con orario fisso `16:00`.

Ora:

- il reset usa la stessa logica gia prevista per calcolare l'orario di default.

Miglioramento:

- evita un default produttivo arbitrario;
- riduce differenze tra primo caricamento e stato dopo submit.

### 3. Sidebar Prenota non mostrava menu/totali in un caso valido

Prima:

- con preset/card attivo su Tavolo in configurazione Level B, la sidebar non sempre mostrava il riepilogo menu perche la condizione controllava solo `booking_type === 'menu'`.

Ora:

- la sidebar usa la capacita calcolata della tab attiva per capire se deve mostrare menu e totali.

Miglioramento:

- cio che l'admin abilita sul card/preset viene mostrato correttamente anche quando la tab pubblica e Tavolo;
- previene dati compilati visibili nel flusso ma assenti dal riepilogo cliente.

### 4. Resolver `is_fixed_menu` troppo rigido

Prima:

- un preset live esplicitamente personalizzabile poteva non essere rispettato se la card non forzava chiaramente il comportamento.

Ora:

- se la card o il preset live dichiarano `is_fixed_menu === false`, il resolver considera il menu personalizzabile.

Miglioramento:

- il pubblico rispecchia meglio il preset salvato lato admin;
- previene menu configurati come personalizzabili ma trattati come fissi.

### 5. Letture pubbliche Supabase con client non pubblico

Prima:

- alcune query di lettura in hook Prenota usavano il client Supabase autenticato anche per dati che devono essere leggibili nel flusso pubblico.

Ora:

- le letture usano `supabasePublic`;
- le mutation restano sul client autenticato dove serve.

Miglioramento:

- separa meglio flusso pubblico e flusso admin;
- riduce il rischio di dati non caricati su `/prenota/:slug` per mismatch di client/sessione;
- mantiene invariata la parte di scrittura.

### 6. Logiche prodotto-specifiche hardcoded

Prima:

- `Caraffe`, `Drink Premium` e varianti erano trattate con regole speciali basate su nomi;
- `Tiramisù` attivava logica speciale in kg;
- alcune utility riconoscevano categorie/prodotti tramite stringhe specifiche;
- questi comportamenti erano legati a un tenant/prodotto e potevano apparire o influenzare clienti nuovi.

Ora:

- rimosse le regole speciali basate su nomi prodotto;
- `Drink Premium` e `Caraffe` possono coesistere se configurati cosi dall'admin;
- `Tiramisù` non apre piu controlli kg automatici;
- eliminata la utility dedicata `caraffePricing`;
- il builder menu si basa su configurazione e dati, non su nomi hardcoded.

Miglioramento:

- l'app e piu vendibile a un cliente nuovo senza eredita di una azienda precedente;
- previene comportamenti nascosti non configurabili da admin;
- riduce il rischio che nomi casuali di nuovi prodotti attivino regole vecchie.

## File modificati

- `src/features/booking/components/BookingRequestForm.tsx`
- `src/features/booking/components/MenuSelection.tsx`
- `src/features/booking/components/PresetMenuBuilder.tsx`
- `src/features/booking/components/publicBooking/BookingSummarySidebar.tsx`
- `src/features/booking/hooks/useRestaurantSetting.ts`
- `src/features/booking/hooks/useMenuItems.ts`
- `src/features/booking/hooks/useMenuCategories.ts`
- `src/features/booking/services/bookingFormResolver.ts`
- `src/features/booking/utils/buildPresetMenuSelection.ts`
- `src/features/booking/utils/menuPricing.ts`
- rimosso `src/features/booking/utils/caraffePricing.ts`

Test aggiunti o aggiornati:

- `src/features/booking/components/__tests__/PresetMenuBuilder.prodReady.test.tsx`
- `src/features/booking/components/__tests__/BookingRequestForm.flussoUtente.test.tsx`
- `src/features/booking/components/__tests__/BookingSummarySidebar.capability.test.tsx`
- `src/features/booking/services/__tests__/bookingFormResolver.test.ts`
- `src/features/booking/hooks/__tests__/useMenuCategories.test.tsx`

## Test eseguiti

### Test mirati Prenota

Comando:

```powershell
npx vitest run src/features/booking/components/__tests__/PresetMenuBuilder.prodReady.test.tsx src/features/booking/components/__tests__/BookingRequestForm.flussoUtente.test.tsx src/features/booking/components/__tests__/BookingSummarySidebar.capability.test.tsx src/features/booking/services/__tests__/bookingFormResolver.test.ts src/features/booking/services/__tests__/bookingFormResolver.flusso-dati.test.ts
```

Esito:

- PASS;
- 5 file test;
- 37 test superati.

### Suite completa

Comando:

```powershell
npm run validate
```

Esito:

- lint PASS;
- typecheck PASS;
- Vitest full PASS;
- 48 file test;
- 419 test superati.

Nota: durante la suite completa sono comparsi warning React `act(...)` gia presenti nei test dell'area Menu QR (`menuQrCategoryFieldCap.test.tsx`). I test passano e quei warning non sono stati trattati perche fuori scope Prenota.

### Diff check

Comando:

```powershell
git diff --check
```

Esito:

- nessun errore whitespace;
- unico avviso: `src/features/booking/hooks/useMenuItems.ts` verra normalizzato da CRLF a LF quando Git tocchera il file.

## Smoke runtime

Eseguito smoke con dev server locale su `/prenota/:slug` a viewport 375, 834 e 1280 px.

Esito:

- la route rispondeva HTTP 200;
- il contenuto mostrava stato "Prenotazioni temporaneamente non disponibili";
- non erano visibili card, form e submit.

Causa rilevata:

- lookup pubblico su `organizations_public` con lo slug da `.env.local.test` non risolveva correttamente e restituiva errore 406.

Conclusione:

- lo smoke browser funzionale e rimasto bloccato dai dati/API staging, non da una regressione dei fix;
- i dev server usati per lo smoke sono stati fermati;
- serve una verifica con slug pubblico valido o correzione dati ambiente.

## Verifiche Supabase read-only

Accesso MCP diretto disponibile solo per progetto PROD:

- PROD project ref: `rwuxgvldzrkabglkasym`;
- URL: `https://rwuxgvldzrkabglkasym.supabase.co`;
- edge function `create-booking` attiva v8 con `verify_jwt: false`.

Accesso MCP TEST:

- project ref TEST atteso: `docnnernvpyrbwuzzach`;
- non accessibile via MCP con le credenziali disponibili;
- alcuni controlli sono stati ricavati tramite env/REST read-only.

Nessuna scrittura DB e nessuna migrazione sono state eseguite.

## Segnali DB da verificare/bonificare

### TEST

Sono presenti dati demo/test, accettabili in test se consapevoli ma da non copiare in PROD:

- tenant `Ristorante Test Pro`;
- tenant `Ristorante Test Classic`;
- email `admin-pro@test.local`;
- email `admin-classic@test.local`;
- dati CRM/prenotazioni con dominio `example.com`;
- tenant `Trattoria Da Tommaso` con nomi sospetti in preset/item come `ewrwerwer`, `wow`, `tllu`, `tommy`, `neo`, `sbobbona`.

### PROD

Segnali da verificare:

- organizzazioni viste: `al-ritrovo`, `da-matteo`, `da-tommaso`;
- `.env.production.local` contiene `TENANT_SLUG=matteo-restaurant`, slug non trovato tra quelli letti in PROD;
- admin `matteo-test@p.com`, segnale test/demo in produzione;
- `Trattoria Da Tommaso` ha `restaurant_name = "Matteo Cavallaro"`, potenziale mismatch tra anagrafica pubblica e tenant;
- categoria `secondi_piattie`, possibile refuso visibile;
- edge function `check-slot-availability` presente nel repo ma non vista tra le funzioni remote PROD;
- lettura clienti/prenotazioni: 0 record su tenant controllati.

Questi punti non sono stati modificati perche richiedono decisione dati/tenant e, in alcuni casi, accesso DB PROD completo.

## Prompt per agente con tool DB PROD

Usa questo prompt per un agente che abbia accesso completo ai tool Supabase/DB. Deve operare read-only finche non viene autorizzata una bonifica esplicita.

```text
Repo: CalendarBackup-v2, branch env/test.
Contesto: revisione blindatura Pagina Prenota, Personalizza form e Anagrafica azienda.

Agisci SOLO IN LETTURA su PROD e TEST, senza update/delete/insert/migrazioni.

Progetti attesi:
- PROD: rwuxgvldzrkabglkasym
- TEST: docnnernvpyrbwuzzach

Verifiche richieste:
1. Conferma project ref e URL prima di ogni blocco query.
2. Verifica che gli slug pubblici di produzione esistano in organizations_public e siano coerenti con .env.production.local. Segnala mismatch come TENANT_SLUG=matteo-restaurant se non esiste.
3. Per ogni tenant PROD, leggi in sola lettura:
   - organizations / organizations_public;
   - restaurant_settings;
   - booking_public_form_config;
   - booking_custom_staff_presets;
   - booking_menu_promos;
   - menu_categories;
   - menu_items;
   - admin_users o profili admin collegati, se disponibili.
4. Cerca dati demo/test o di aziende non pertinenti:
   - email con test/local/example;
   - nomi tipo demo, test, mock, placeholder;
   - prodotti/preset senza senso operativo;
   - mismatch tra org name, restaurant_name, slug e branding pubblico;
   - refusi visibili come secondi_piattie.
5. Verifica edge functions remote rispetto al repo:
   - create-booking;
   - validate-invite;
   - check-slot-availability.
6. Verifica che le impostazioni admin che dovrebbero arrivare a /prenota/:slug siano popolate e leggibili:
   - booking modes;
   - field overrides;
   - tab labels;
   - staff presets;
   - promo;
   - menu card;
   - foto/sfondo pubblico;
   - anagrafica ristorante.
7. Non correggere nulla. Restituisci:
   - query eseguite;
   - risultati sintetici per tenant;
   - severita di ogni finding;
   - impatto su cliente nuovo;
   - proposta di bonifica dati separata da eventuali fix codice.
```

## Rischi residui

- Smoke pubblico da browser non conclusivo finche lo slug staging/API `organizations_public` non e risolto.
- PROD richiede verifica dati con tool DB completi per decidere eventuale bonifica.
- Dati TEST demo sono presenti: non sono un problema se restano confinati, ma vanno esclusi da export, seed cliente e clonazioni verso produzione.
- Alcuni fallback admin non sono stati cambiati per evitare uno scope troppo ampio senza finding runtime definitivo.
- Non e stata aperta una modifica sul submit cliente: `useCreateBookingRequest` resta invariato.

## Stato finale

La parte codice Prenota e stata resa piu robusta rispetto a configurazioni tenant nuove:

- meno assunzioni hardcoded;
- meno logiche basate su nomi prodotto;
- piu coerenza tra admin e pubblico;
- letture pubbliche piu coerenti con il contesto non autenticato;
- copertura test aumentata sui casi di blindatura.

La parte dati PROD non e stata bonificata. Serve un passaggio separato con tool DB autorizzati e decisione esplicita su quali record correggere o rimuovere.

## Domande di chiusura (Q1-Q6)

❓ Q1 — Lo scope concordato e stato rispettato?
✅ R1: Si. Lo scope operativo e rimasto su Pagina Prenota, Personalizza form, Anagrafica/setting collegati e verifiche Supabase read-only. Nessuna scrittura DB, nessuna migrazione e nessuna modifica a `useCreateBookingRequest`.

❓ Q2 — Il diff corrisponde al report?
✅ R2: Si. Il diff contiene solo fix Prenota, test Prenota e questo report. La cartella non tracciata `immagini di prova/` e rimasta fuori dal commit perche non collegata alla revisione Prenota.

❓ Q3 — Cosa succedeva prima e cosa succede ora?
✅ R3: Prima il pubblico poteva ereditare default hardcoded (`tavolo`, `16:00`) e regole per prodotti specifici come Caraffe/Drink Premium/Tiramisu. Ora il form segue i booking mode abilitati, usa default coerenti, mostra meglio menu/totali su Level B e non applica logiche nascoste basate su nomi prodotto.

❓ Q4 — Stato test e verifica?
✅ R4: Test mirati Prenota PASS con 37 test su 5 file. `npm run validate` PASS con lint, typecheck e 419 test su 48 file. Smoke browser bloccato da slug/API staging `organizations_public` 406, quindi non conclusivo sui dati ambiente.

❓ Q5 — Cosa resta aperto lato DB/PROD?
✅ R5: Restano da verificare e decidere i dati PROD sospetti: slug `matteo-restaurant` non trovato, admin `matteo-test@p.com`, mismatch `Trattoria Da Tommaso` / `Matteo Cavallaro`, categoria `secondi_piattie`, edge function `check-slot-availability` non vista da remoto. Nel report e incluso il prompt per agente con tool DB PROD.

❓ Q6 — Il lavoro altrui nel working tree e stato protetto?
✅ R6: Si. Le modifiche fuori Prenota indicate come lavoro dell'altro agente non sono state incluse. Lo staging e stato esplicito file per file e il report nuovo e stato aggiunto con `git add -f` solo perche `docs/` e ignorata.
