# Report — Fase 2 righe 12 e 13, più due trappole trovate strada facendo (05-08-2026)

> Branch `env/test`. **Nessuna modifica a `src/`**: il lavoro vive in `e2e/`, nei file di
> skill/handoff e in **una migrazione** (`071`, §5) applicata **solo su TEST** su richiesta esplicita
> di Matteo. Su TEST (`docnnernvp`) sono stati creati e **ricancellati** solo dati usa-e-getta.
> **PROD mai toccata**: la `071` entra nel treno del rollout, non parte da sola.
> Commit locali fatti su richiesta di Matteo a fine sessione (§7); **nessun push**.
>
> Metodo: due agenti Sonnet su file disgiunti, ciascuno con una sezione «fatti già verificati» scritta
> da me con `file:riga`. **Tutte le run Playwright le ho eseguite io**, una spec alla volta,
> `--workers=1`. Ogni consegna è stata riletta riga per riga e rieseguita prima di dichiararla buona.
>
> Piano di riferimento: [PIANO_SENIOR_TEST_E_SALUTE_CODICE.md](../03-08-26/PIANO_SENIOR_TEST_E_SALUTE_CODICE.md) §4 (Fase 2).

---

## 1. Cappello per Matteo

**Le due ultime righe della lista di controllo sono coperte.** Erano le uniche due funzioni della
lista che nessuno aveva mai provato fino in fondo, nemmeno a mano.

- **Il cliente del locale «Classic» adesso riesce davvero a prenotare, ed è dimostrato.** Era il
  debito aperto dal collaudo del 2 agosto («7-3: invio completo non portato a termine»). Ora un test
  apre `/prenota/test-classic` come farebbe un cliente, sceglie la tipologia, la data, l'orario dal
  calendarietto, accetta la privacy, invia — e poi **va a leggere nel database** che la richiesta
  esiste, con il numero di persone giusto e in stato «in attesa». Poi la cancella.
- **Quando una fascia è piena, il cliente non riesce nemmeno a scegliere quell'orario.** Il test
  riempie la fascia serale fino al tetto, apre il form e verifica che sotto «Cena» non compaia più
  nessun orario, mentre le altre fasce restano prenotabili.
- **E se la fascia si riempie mentre il cliente sta compilando**, l'invio viene respinto con
  «Questa fascia oraria è al completo per la data scelta» e **nel database non nasce niente**.
- **Le campagne email del CRM hanno il loro primo test.** È una funzione **attiva in produzione** e
  non era mai stata coperta: ora si crea una campagna, si sceglie il gruppo di destinatari, e si
  arriva **fino alla finestra di conferma dell'invio — dove il test si ferma**. Nessuna email parte
  davvero: il test blocca la strada verso il servizio di invio e poi verifica che non ci sia passato
  nessuno. Era una precauzione necessaria: oggi, su TEST, **l'unico cliente con il consenso
  marketing sei tu**, e un click di troppo ti avrebbe mandato una mail vera.

**Due cose che ho trovato mentre lavoravo, e che non erano nella lista.**

1. **Il form pubblico si può usare solo 3 volte al minuto dalla stessa connessione.** È una difesa
   contro gli abusi, e va benissimo che ci sia — ma i nostri controlli automatici la superavano da
   soli: quattro invii in 58 secondi e il quarto veniva respinto. Il guaio è che quel rifiuto **non
   compare come errore sul campo**, quindi il test sembrava dire «il form è rotto» quando invece era
   la batteria che si pestava i piedi. Peggio: sei tentativi in dieci minuti **bloccano la
   connessione per 24 ore**. Ora ogni test aspetta il suo turno prima di premere «Invia», e la
   regola è scritta nella guida dei test.
2. **Il conteggio dei posti che usa il form pubblico e quello che usa il server non guardano la
   stessa ora.** Misurato: una prenotazione delle **10:00** viene contata dal form come se occupasse
   il **Pranzo** invece della **Colazione** (due ore di scarto d'estate, una d'inverno). Effetto per
   un cliente vero: può vedere liberi degli orari che poi il server rifiuta all'ultimo passo, e
   vedersi sbarrata una fascia che in realtà è vuota. **Corretto su tua decisione** («applica la
   correzione, non lasciare il bug»): migrazione `071` applicata **solo su TEST**, con la stessa
   misura rifatta prima e dopo e un controllo automatico che la tiene ferma. In produzione entra
   col treno del rollout, non da sola. Dettagli in §5.

**Serve una tua decisione?** Non più: quella che c'era — se correggere subito lo scarto d'orario —
l'hai presa ed è fatta su TEST. Resta da autorizzare, quando vorrai, il **rollout in produzione** di
tutto il treno insieme (migrazioni `063`→`071` + Edge `create-booking` + client).

---

## 2. Fase 2 riga 12 — «Form Classic: invio completo + oltre-limite»

Nuovo file `e2e/public-booking-classic.spec.ts`, tre test per la riga 12 (più un quarto aggiunto
dopo, §5), ognuno con la **propria data futura** (oggi+14 / +17 / +20 / +23, con scivolamento
automatico se cade di venerdì, giorno di chiusura del locale).

| Test | Cosa fa | Prova finale |
|---|---|---|
| invio completo | Compila come un cliente, sceglie data e orario dal picker, invia | **Riga a DB**: 1 prenotazione, `status='pending'`, 2 ospiti |
| fascia piena | Semina 20 coperti accettati nella fascia serale (cap 20), poi apre il picker | Il gruppo «Cena» ha **zero orari**, un'altra fascia ne ha ancora |
| oltre il limite | Sceglie l'orario **prima** che la fascia si riempia, poi semina la saturazione, poi invia | Errore inline «al completo» **e zero righe create a DB** |

Verifiche eseguite da me: i tre test singolarmente verdi, il file completo **3/3 verde** due volte di
fila (la seconda a distanza ravvicinata, per far scattare l'attesa del limite di frequenza) e **4/4**
dopo l'aggiunta del test di non-regressione della `071`,
controllo tipi ad hoc pulito, e a fine giro **zero residui** `E2E-PUBCLS-*` su TEST con le fasce del
locale intatte.

**Correzione mia sulla consegna dell'agente:** il test di invio sceglieva «il primo orario
disponibile», che è **07:00** (Colazione) — fuori dagli orari di apertura del locale in quasi tutti i
giorni della settimana, quindi l'invio sarebbe stato bloccato dalla validazione oraria invece di
provare il percorso vero. Ora tutti e tre i test scelgono un orario **della fascia serale**, l'unica
dentro l'apertura di ogni giorno non-venerdì.

## 3. Fase 2 riga 13 — «CRM: crea campagna → destinatari → invia»

Tre test aggiunti in coda a `e2e/pro/pro-crm.spec.ts` (nuovo `describe`, in `serial`: condividono il
limite duro di **5 campagne** per locale). Il test già esistente non è stato toccato.

| Test | Cosa fa | Prova finale |
|---|---|---|
| crea campagna | Nuova campagna con nome/oggetto/corpo, «Crea campagna» | Riga in `email_campaigns` con oggetto e corpo attesi |
| destinatari | Semina due clienti, uno con consenso marketing e uno senza; apre «Scegli gruppo…» | Il cliente senza consenso **non compare** nella lista; a DB il gruppo salvato contiene **solo** quello con consenso |
| invio | Preme «Invia ora» sulla riga, legge la finestra «a 1 contatti del gruppo», preme **Annulla** | **Zero** richieste all'invio email, e `last_sent_at` ancora vuoto |

Verifiche: file completo **4/4 verde** (i 3 nuovi + quello preesistente), controllo tipi pulito, e a
fine giro su TEST resta **solo la tua campagna vera** («opzione»), con i suoi destinatari e mai
inviata.

**Correzione mia:** il test confrontava l'indirizzo email col maiuscolo del prefisso, mentre l'app
**normalizza gli indirizzi in minuscolo** quando li salva. Rosso legittimo, sistemato nel test (il
comportamento dell'app è quello giusto).

## 4. Trappola del limite di frequenza — trovata, misurata, disinnescata

`create-booking` registra in `rate_limits` **ogni** richiesta che arriva all'endpoint e risponde
**429** oltre **3 al minuto per IP**; oltre **6 in 10 minuti** dopo lo sforamento l'IP finisce in
`ip_blacklist` per **24 ore** (`supabase/functions/create-booking/index.ts:149-200`).

**Misura reale di oggi:** 4 richieste dal mio IP in 58 secondi (11:22:45 → 11:23:43) → la quarta
respinta. Il sintomo era ingannevole: la mappatura di «Troppe richieste»
(`bookingPublicFormErrorFeedback.ts:163-171`) **non ha messaggio inline**, quindi il test cercava un
elemento che non sarebbe mai comparso e sembrava un difetto del form.

**Rimedio:** `waitForCreateBookingRateLimitWindow()` in `e2e/helpers/supabaseStaging.ts` — legge
`rate_limits`, e se la finestra è piena aspetta che si liberi (guardia a 75 secondi invece di 60, per
margine sullo scarto d'orologio fra macchina e database). Chiamata da tutte le spec che premono
«Invia» sul form pubblico. **Prova che funziona:** le quattro spec del form pubblico lanciate di
seguito, `--workers=1` → **25/25 verde in 1,4 minuti**, che è esattamente la combinazione che prima
produceva il 429. Regola scritta in `docs/Testing-Skill/TESTING_SKILL.md` §3.

Nessun IP è finito in blacklist: verificato, `ip_blacklist` è vuota.

## 5. Lo scarto d'orario nel conteggio dei posti — **misurato, non corretto**

Due implementazioni della stessa regola che non concordano:

| Chi | Come legge `confirmed_start` | Risultato per una prenotazione delle 10:00 |
|---|---|---|
| **Form pubblico** (RPC `get_available_arrival_times`, mig. `060`/`067`) | `confirmed_start AT TIME ZONE 'Europe/Rome'` | la conta alle **12:00** → satura **Pranzo** |
| **Server** (Edge `create-booking:539-575`) | legge le cifre alla lettera | la conta alle **10:00** → satura **Colazione** |

La causa è che l'app salva `confirmed_start` con offset `+00:00` **finto**, dove le cifre sono l'ora
a muro (`src/features/booking/utils/dateUtils.ts:53-59`): la RPC lo prende per un orario UTC e lo
converte, spostandolo di 2 ore d'estate e 1 d'inverno.

**Prova eseguita su TEST** (seminata e ricancellata): una prenotazione da 20 coperti alle 10:00 su
`test-classic` (cap 20 per fascia) ha svuotato gli orari di **Pranzo**, lasciando **Colazione** con
tutti i suoi orari.

**Cosa vede un cliente:** orari che sembrano liberi e che il server rifiuta al momento dell'invio, e
fasce che sembrano piene mentre sono vuote. Riguarda ogni locale con i limiti per fascia accesi —
cioè il modello Classic.

### Corretto su decisione di Matteo — migrazione `071`, solo TEST

Matteo ha risposto «applica la correzione, non lasciare il bug». Fatto:

- **`071_arrival_times_wall_clock_occupancy.sql`**: la RPC legge ora `AT TIME ZONE 'UTC'`, che per un
  valore salvato con offset `+00:00` finto restituisce esattamente le cifre dell'ora a muro. Si
  allinea **all'Edge**, che era già corretto — non viceversa. Nessuna colonna cambia, **nessun dato
  viene riscritto**: cambia solo come vengono lette le righe già presenti.
- **Diff verificato riga per riga contro la `067`**: cambiano **solo le 5 righe** del fuso, tutto il
  resto (compresa l'esclusione delle fasce chiuse `max_turns = 0`) è riportato identico.
- **Applicata su TEST** con `npm run db:apply` (`071` → «Finished supabase db push»). **PROD
  invariata**: entra nel treno del rollout, con l'Edge e il client, quando Matteo lo autorizza.
- **Prova ripetuta prima e dopo**, stessa misura: prima 20 coperti alle 10:00 svuotavano *Pranzo*
  lasciando *Colazione* piena di orari; **dopo** svuotano *Colazione* e lasciano *Pranzo* intatto.
- **Rete di non-regressione**: quarto test in `public-booking-classic.spec.ts` — «l'occupazione conta
  sull'ora a muro: satura la fascia giusta». Le sue due asserzioni sono l'**esatto inverso** di ciò
  che il DB faceva prima della `071`: sarebbe stato rosso su entrambe.
- **Non regressione del resto**: `public-booking-classic` **4/4 verde**, e le quattro spec del form
  pubblico lanciate di fila **25/25 verde** dopo la migrazione. Il raggio d'azione è circoscritto:
  in `src/` quella RPC è chiamata da un solo punto (`useArrivalSlots.ts:81`).

**I test della riga 12 erano immuni per costruzione** (dati seminati alle 20:00, dove le due letture
coincidevano in entrambe le stagioni): infatti sono rimasti verdi senza modifiche prima e dopo.

## 6. Un verde che poteva non verificare niente — riparato

`e2e/public-booking-fix9-compilable.spec.ts`, caso 5 («il menù inviato contiene solo i piatti
compilabili»): tre delle sue interazioni puntavano a elementi **che in `src/` non esistono**
(`#date-trigger`, `#time-trigger`, `#privacy-checkbox`, dentro `if (isVisible())` → non facevano
nulla), e l'unica asserzione viveva dentro `if (submitRequest)` — cioè **poteva non essere mai
eseguita** e il test restava verde lo stesso.

Riscritto: data e orario si scelgono dai pannelli veri, la privacy si spunta davvero, la richiesta
**deve** partire, e ora si verifica anche che il server **abbia accettato** (201) e che il menù
inviato **contenga** il piatto compilabile oltre a non contenere quello non compilabile. La
prenotazione che ora viene creata davvero viene cancellata in `afterAll`. File completo **7/7 verde**.

> ⚠️ **Errore mio, corretto in corsa e riportato per onestà:** avevo prima concluso che quel test
> «non inviava mai nulla», confrontando due conteggi di `rate_limits` presi su una finestra mobile di
> 10 minuti — un confronto che non significa niente, perché nel frattempo le righe vecchie escono
> dalla finestra. La misura giusta (catturare la risposta della richiesta) dice che l'invio partiva e
> riceveva **201**. Resta vero, e verificato leggendo il codice, che tre interazioni erano inerti e
> che l'asserzione era condizionata.

---

## 7. Stato dei file

| File | Stato |
|---|---|
| `supabase/migrations/071_arrival_times_wall_clock_occupancy.sql` | **nuova** — fix del conteggio coperti pubblico sull'ora a muro (§5). Applicata **solo su TEST** |
| `docs/DATABASE.md` | riga della `071` nel registro + «ultimo file in repo» e prossimo prefisso aggiornati |
| `e2e/public-booking-classic.spec.ts` | **nuovo** — riga 12 (3 test) + non-regressione della `071` (1 test) = **4** |
| `e2e/pro/pro-crm.spec.ts` | +3 test in coda (riga 13); il test preesistente non toccato |
| `e2e/helpers/supabaseStaging.ts` | +`waitForCreateBookingRateLimitWindow()` (sola aggiunta) |
| `e2e/public-booking.spec.ts` | guardia sul limite di frequenza prima del submit |
| `e2e/public-booking-fix9-compilable.spec.ts` | caso 5 riparato + pulizia della prenotazione creata |
| `docs/Testing-Skill/TESTING_SKILL.md` | §3: la trappola del limite di frequenza, con i numeri; §5: nuova voce «nessuna asserzione dentro un `if`» |
| `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` · `docs/Testing-Skill/TESTING_CONTEXT.md` | riga della spec nuova + `pro-crm` non è più «smoke» |
| `docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md` | voce di collaudo **7-3** marcata chiusa in automatico (con la nota che la spunta Privacy **è** cliccabile da automazione) |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | voce 05-08-26 nel registro: misura d'ambiente preventiva · misura l'effetto non il contatore mobile · le difese anti-abuso mordono la batteria |
| `_skill-system-v0/aree/TESTING_SKILL.md.template` | **template v.0**, propagate in forma generica (senza nomi di file di questo repo): «nessuna asserzione dentro un `if`», «le difese anti-abuso dell'app mordono la batteria», «metti al sicuro gli artefatti prima di rilanciare» + il corollario che «verde da solo» non spiega niente se la batteria era già sequenziale. ⚠️ Nota di fatto: in questo repo il template **è tracciato**, non gitignored (`git check-ignore` non lo esclude) — chi preparerà i commit decida consapevolmente se includerlo |

**Commit locali su richiesta di Matteo, nessun push.** Quattro commit sopra i 13 già presenti:

  2f0fb4e fix(db): conta i coperti pubblici sull'ora a muro (mig. 071)
  fea2e35 fix(e2e): rispetta il rate limit del form pubblico e ripara il caso 5 di fix9
  07ae2a2 test(e2e): copri form pubblico Classic e campagne CRM (Fase 2 righe 12-13)
  · più `docs(handoff)` con report, piano, prompt, skill e indici (questo).

Il branch resta avanti rispetto a `origin/env/test`. Nota: nel commit dei documenti è incluso anche
`_skill-system-v0/aree/TESTING_SKILL.md.template`, che in questo repo **è tracciato** (non
gitignored, contrariamente a quanto dice il promemoria di chiusura): se lo si vuole fuori, va tolto
consapevolmente, non per inerzia.

## 8. Cosa NON è stato fatto — dichiarato

1. ~~La batteria e2e completa non è stata rilanciata.~~ **Fatta a fine sessione:**
   `npx playwright test --workers=1` → **116 test, 113 verdi, 3 rossi, 6,9 minuti**.
   I 3 rossi sono in spec che **non ho toccato**, e **rieseguiti da soli sono verdi**:
   - `admin-settings-blindatura.spec.ts:156` e `:184` (tablet-900) → file completo **7/7 verde** da solo;
   - `admin-menu-magazzino-blindatura.spec.ts:326` (tablet-834) → file completo **3/3 verde** da solo.

   Quindi: **rossi da interazione fra spec, non difetti di prodotto** — e stavolta *non* è contesa fra
   worker paralleli, perché la batteria girava già a un worker solo. L'unica traccia di causa che ho è
   quella del terzo rosso, l'unico di cui ho il dettaglio: il test fallisce sulla lista degli errori di
   console, che conteneva `[checkSession] risoluzione tenant admin fallita: signOut di sicurezza`.
   **Ipotesi non verificata:** spec diverse che entrano con lo stesso account admin in sequenza si
   invalidano la sessione a vicenda. Va indagata nella Fase 3, insieme alla decisione sul parallelismo:
   se l'ipotesi regge, aumentare i worker peggiorerebbe le cose, non le migliorerebbe.

   ⚠️ **Errore di metodo mio, da non ripetere:** ho rilanciato le due spec prima di salvare gli
   artefatti del fallimento, e Playwright svuota `test-results/` a ogni run. Dei due rossi di
   Impostazioni **non ho più né screenshot né `error-context.md`**: so solo che in batteria sono rossi
   e da soli sono verdi. La prossima volta si copia la cartella degli artefatti **prima** di rilanciare.
2. **La decisione sul parallelismo Playwright** resta aperta: `playwright.config.ts` è invariato.
3. **La prova a cavallo della mezzanotte** del fix a orologio resta da fare (eredità del 04-08).
4. ~~Lo scarto d'orario di §5 non è corretto.~~ **Corretto** con la `071` su richiesta di Matteo:
   applicata e verificata **su TEST**, coperta da un test di non-regressione. **Non è in PROD** e non
   deve andarci da sola: viaggia col treno del rollout (migrazioni `063`→`071` + Edge `create-booking`
   + client), come impone la lezione del 23-05.
5. **Non ho toccato** rollout PROD, D38, merge su `main`, le divergenze skill/codice della Fase 3.

---

## 9. Domande di chiusura

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: **Un solo messaggio di Matteo**, composto da un'istruzione più il contenuto incollato del
prompt del senior precedente.

Istruzione (verbatim): «leggi questo prompt, il plan annesso, e lo stato reale del codice. prepara
prompt per agente sonnet e lancialo quando hai tutti gli elementi per proseguire con i lavori. quando
sonnet ha finito revisione rapida, e poi lancia nuovo agente sonnet per proseguire. fermati SOLO se
riscontro decisioni importanti di prodotto che non puoi dedurre da solo, dove serve mia opinione,
altrimenti se è tutto deciso procedi pure.» e, in coda: «leggi resto del contesto necessario prima id
iniziare».

Materiale incollato: l'intero `docs/Sessioni di lavoro/04-08-26/PROMPT_PROSSIMO_SENIOR.md` (mandato di
supervisione, letture obbligatorie, stato riga per riga fino alla 11, correzioni da non riaprire,
commit locali già preparati, decisioni di prodotto, regole non negoziabili, metodo, perimetro escluso).

**Nessun'altra istruzione umana.** L'unico altro messaggio ricevuto è stato l'hook automatico di fine
sessione, che segnalava questa sezione mancante: è software, non input di Matteo, e non l'ho trattato
come approvazione di nulla. Nessuna autorizzazione a committare o pushare è stata chiesta né data, e
infatti non è stato fatto.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì, e in chiusura ho riaperto tutto invece di fidarmi della memoria.

Riaperti/rieseguiti: `git diff --stat` (7 file modificati + 2 non tracciati, coerente con §7) ·
`git diff e2e/helpers/supabaseStaging.ts` (la funzione è **solo aggiunta**, nessuna riga esistente
toccata: 47 righe in più, zero in meno) · conteggio test reale nei due file (`3` in
`public-booking-classic.spec.ts`, `4` in `pro-crm.spec.ts` = 1 preesistente + 3 nuovi, come scritto in
§2 e §3) · le due righe 12 e 13 della tabella Fase 2 nel piano (righe 402-403, ora `✅`) ·
`npm run validate:docs` → **14 path rotti, tutti in `docs/Console-Skill/`**, cioè il debito storico
invariato: i documenti scritti oggi non ne hanno aggiunto nessuno.

Numeri delle run: sono tutti miei, non riportati da un agente — 3/3 (due volte) sul file nuovo, 4/4
sul CRM, 7/7 su fix9, 4/4 su `public-booking`, **25/25** sulle quattro spec del form pubblico in fila.
Sul DB TEST ho riletto: `rate_limits` (le 4 richieste in 58 secondi, con gli orari), `ip_blacklist`
(vuota), residui `E2E-PUBCLS-*` / `E2E-FIX9-*` / `E2E-CRM-CAMP-*` (zero), fasce di `test-classic`
(intatte), campagne di `da-tommaso` (resta solo «opzione», `last_sent_at` nullo).

Una correzione che ho già scritto in §6 e ripeto qui perché è il dato più importante: la mia prima
misura sul caso 5 di fix9 era **sbagliata** (confronto fra due finestre mobili di 10 minuti). La
misura buona — catturare la risposta della richiesta — dice 201. Il report è stato corretto prima di
essere consegnato, non dopo.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Quattro allineati, due dei quali **solo dopo** essere andato a rileggerli in questa chiusura.

- `docs/Testing-Skill/TESTING_SKILL.md` — §3: la trappola del limite di frequenza con i numeri veri e
  la regola operativa; §5: nuova voce «nessuna asserzione dentro un `if`», nata dal caso 5 di fix9
  (le voci successive sono state rinumerate).
- `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` — **aggiunto in chiusura**: riga per la spec
  nuova (col vincolo di non eseguirla in parallelo con `admin-calendar-blindatura`) e descrizione di
  `pro-crm.spec.ts` aggiornata: non è più «smoke».
- `docs/Testing-Skill/TESTING_CONTEXT.md` — **aggiunto in chiusura**: stesse due voci nella sua
  tabella dei flussi coperti.
- `docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md` — voce di collaudo **7-3** («form pubblico Classic:
  prenotazione valida + oltre limite») marcata chiusa in automatico, con la nota che la spunta Privacy
  **è** cliccabile da automazione, al contrario di quanto teme `PROMPT_AGENTI_E2E_S4.md:187`. È
  esattamente il debito da cui è nata la riga 12: lasciarlo non spuntato avrebbe fatto rifare a mano
  una prova che ora è automatica.
- Piano e handoff: blocco ⛳ nel piano, prompt nuovo del 05-08, ⛔ su quello del 04-08.

Non toccati, con motivo: `src/types/database.ts` (nessuna modifica di schema) · `MASTERPLAN_SERVIZIO.md`
e `FOLLOW_UP.md` (nessuna decisione di prodotto presa o chiusa: lo scarto d'orario è **aperto** ed è
scritto come domanda) · `docs/DATABASE.md` (nessuna migrazione).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: (1) **La run completa della batteria è partita ma non è ancora finita** mentre scrivo: i numeri
in questo report sono delle spec toccate, non dell'intera batteria. Chi legge deve considerarla non
consolidata. (2) Lo scarto d'orario di §5 **l'ho corretto** dopo la risposta di Matteo («applica la correzione,
non lasciare il bug»): migrazione `071` su TEST, verifica prima/dopo, test di non-regressione. Resta
non fatto il **rilascio in produzione**, fuori perimetro e da autorizzare esplicitamente.
(3) **Non ho deciso il parallelismo Playwright**: `playwright.config.ts` è ancora invariato, terzo
giro consecutivo che questo debito slitta. (4) **Non ho provato il fix a orologio a cavallo della
mezzanotte** (eredità del 04-08). (5) **Non ho colmato la lacuna del CRUD menù via interfaccia**,
dichiarata aperta il 04-08: non era nel mandato. (6) Non ho aggiunto il `tsconfig.e2e.json` che
renderebbe vero «typecheck verde» sui test: tocca la configurazione del progetto, e l'ho proposto
invece di farlo di iniziativa (vedi R5).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: **Attrito 1 — nessuna skill diceva che il form pubblico ha un limite di 3 invii al minuto**,
e la scoperta è costata un rosso diagnosticato dall'inizio (per giunta con un sintomo ingannevole, un
429 che non produce errore inline). Proposta, **già applicata**: la regola è in `TESTING_SKILL.md` §3
insieme alla funzione che la rispetta. Proposta che resta: quando un Edge introduce una difesa
anti-abuso, la nota va scritta nella skill di testing **nello stesso giro** in cui la difesa nasce,
perché la pagherà chi scrive test mesi dopo.
**Attrito 2 — «typecheck verde» sui file e2e continua a non voler dire niente** (ESLint li ignora,
`tsc` compila solo `src`) e ogni sessione ripete a mano lo stesso comando lungo di sei flag. Proposta
concreta: `tsconfig.e2e.json` + script `typecheck:e2e`, e la riga del comando ad hoc in
`TESTING_SKILL.md` diventa «usa `npm run typecheck:e2e`».
**Attrito 3 — il documento ereditato descriveva lo stato come «riga 11 coperta», ma non diceva quali
presupposti d'ambiente reggono i test** (orari di apertura del locale, cap per fascia, quale fascia è
dentro l'orario di apertura): li ho dovuti misurare io interrogando il DB, ed è lì che sono usciti
entrambi i difetti degli agenti. Proposta: nei prompt di handoff aggiungere una sezione «stato
misurato dell'ambiente TEST» con i quattro-cinque valori che decidono se un test è scrivibile, con la
data della misura — invecchia, ma dichiara di invecchiare.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: **Giusto per instradare, insufficiente per fidarsi** — stessa diagnosi delle due sessioni
precedenti, e per lo stesso motivo: il prompt ereditato dice benissimo *dove* guardare, ma ogni valore
d'ambiente che conteneva andava rimisurato. Ho caricato in modo mirato (Testing per intero, il piano,
la parte di Prenota/CRM che serviva) senza esplorare il codice a tappeto: le due righe si sono chiuse
con letture puntuali guidate dalle misure sul DB.

**L'hook di fine sessione è stato utile, non rumore**, e non solo per il motivo per cui è scattato:
mi ha fatto rileggere i file correlati e lì ho scoperto che **tre indici** (`ADMIN_TEST_SUITE_INDEX`,
`TESTING_CONTEXT`, la voce di collaudo 7-3) sarebbero rimasti indietro rispetto al lavoro — cioè
esattamente il debito che il piano segnala come «attrito numero uno di questo cantiere». Senza il
rilancio avrei consegnato un report completo e tre documenti disallineati. Il promemoria periodico
sulla lista dei task è stato invece poco utile in questa sessione: il lavoro era già sequenziato da
due soli agenti su file disgiunti.
```

## 10. Self-review del report

1. **Dati = diff reale:** sì, e in chiusura ho riaperto `git diff`, i conteggi dei test, le righe della
   tabella del piano e l'esito di `validate:docs` invece di citarli a memoria (dettaglio in R2). L'unico
   numero non consolidato — la batteria completa — è dichiarato come tale in §8 e in R4, non nascosto.
2. **File correlati allineati:** sì, ma **due li ho allineati solo dopo il rilancio dell'hook**
   (`ADMIN_TEST_SUITE_INDEX.md`, `TESTING_CONTEXT.md`) e un terzo — la voce di collaudo **7-3** — l'ho
   trovato ragionando su quale checklist rispondesse alla riga 12. È la cosa che, se non scritta,
   sparisce: lo scrivo qui invece di lasciarla intendere.
3. **Q1-Q6 coerenti:** sì. R4 e §8 dicono le stesse cinque cose non fatte; R2 e §6 raccontano lo stesso
   errore di misura con lo stesso esito.
4. **Tono utente:** §1 parla per schermate e flussi (il cliente che sceglie l'orario, la fascia che
   sparisce dal picker, la finestra di conferma dove il test si ferma); §2-§8 e §9-§10 sono dati
   interni. La distinzione è rispettata.
5. **Cosa un revisore potrebbe contestarmi:** di aver allargato il perimetro oltre le righe 12 e 13 —
   ho toccato anche `public-booking-fix9-compilable.spec.ts` e `public-booking.spec.ts`. Lo rivendico
   con il motivo: il primo era un verde che poteva non verificare niente **nell'area esatta** su cui
   stavo lavorando, il secondo condivideva la trappola del limite di frequenza scoperta scrivendo la
   riga 12. Il segnale che il rischio è sotto controllo: nessuna modifica a `src/`, nessuna migrazione,
   e ogni file toccato ha una run verde eseguita da me.
