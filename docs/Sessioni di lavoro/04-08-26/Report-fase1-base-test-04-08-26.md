# Report — FASE 1 del piano senior: riparare la base di test (04-08-2026)

> Branch `env/test`. **Nessun commit, nessun push** — mai autorizzati.
> **Nessuna migrazione**, nessuna scrittura di schema. Su TEST (`docnnernvp`) sono stati riscritti
> tre valori di `restaurant_settings` del locale di prova `da-tommaso`, **su decisione esplicita di
> Matteo** (§2.6). PROD non toccata in nessun modo.
>
> **Come è stato fatto:** misura prima, diagnosi poi, correzione infine. Quattro agenti Sonnet su
> file disgiunti, ciascuno con una sezione «fatti già verificati» scritta da me con `file:riga`;
> **tutte le run Playwright le ho eseguite io**, un test alla volta, e ogni consegna è stata
> riverificata prima di dichiararla buona.
>
> Piano di riferimento: [PIANO_SENIOR_TEST_E_SALUTE_CODICE.md](../03-08-26/PIANO_SENIOR_TEST_E_SALUTE_CODICE.md) §3 (Fase 1).
> Prompt per chi continua: [PROMPT_PROSSIMO_SENIOR.md](PROMPT_PROSSIMO_SENIOR.md).

---

## 1. Cappello per Matteo

La batteria di controlli automatici era in condizioni peggiori di come il piano la descriveva, e in
un punto **mentiva su una cosa importante**.

- **Il test che dice «il cliente compila il form e la prenotazione viene creata» era verde senza
  creare nessuna prenotazione.** Dimostrato guardando il database: l'ultima prenotazione col nome
  usato da quel test risaliva al **16 giugno**. Il form era bloccato da un messaggio d'errore, e il
  test scambiava quel messaggio per la conferma di avvenuto invio. Ora sceglie l'orario come farebbe
  un cliente, invia, e **va a controllare nel database che la riga esista davvero**, con il numero di
  ospiti giusto e in stato «in attesa» — poi la cancella.
- **Il locale di prova era travestito da test dal 16 giugno.** Si chiamava «QA 375», la sua pagina
  Prenota era intitolata «Prenota QA E2E — Configurazione temporanea Playwright». Causa: un test che,
  quando va oltre il tempo massimo, non fa in tempo a rimettere a posto quello che ha cambiato; e il
  test successivo fotografava il travestimento credendolo l'originale. Ora il locale si chiama **Da
  Tommaso** e ha una pagina Prenota normale, e quel test rimette a posto le cose anche se muore a
  metà.
- **Un terzo dei rossi non erano guasti, era coda al tornello.** I controlli girano dodici alla volta
  e si pestano i piedi: stesso codice, **51 verdi con dodici in parallelo, 71 con uno alla volta**.
- **Diversi test controllavano schermate che non esistono più**: il riepilogo del Calendario, la
  rubrica del CRM (cercava una tabella dove ci sono schede), la riga della prenotazione da cliccare,
  il link della privacy (oggi è un pulsante che apre una finestra).

**Dove siamo adesso:** su 99 controlli, **87 verdi, 3 rossi, 9 sospesi** — e i 9 sospesi sono tutti
figli dei 3 rossi. Stamattina erano 51 verdi.

**Serve una tua azione?** No per lavorare. Sì per **tre decisioni**, tutte in §6: la più concreta è
che un locale che configura **una sola tipologia di prenotazione «a scheda»** non vede mai applicarsi
il menù collegato — al cliente compare il menù intero. Va deciso se è un difetto o è voluto.

---

## 2. Cosa è stato fatto

### 2.1 Prima di tutto: misurare

Il piano indicava 7 voci da sistemare. Facendo girare **tutta** la batteria — cosa che nessuno aveva
fatto di recente — i test rossi erano **31**, di cui solo 3 previsti dal piano. Poi, rilanciando le
stesse spec una alla volta, i rossi sono diventati **12**: gli altri 19 erano interferenza fra test
in parallelo. Questo ha riscritto il piano di lavoro della giornata.

### 2.2 Due difetti nel file delle credenziali locali (`.env.local.test`)

- **Tre chiavi scritte due volte.** Un blocco «account PRO» era stato incollato riusando i nomi del
  blocco «account Classic»: vinceva l'ultimo, quindi tutti i test «locale Classic» entravano con
  l'account **Pro** e fallivano sull'assenza della barra laterale. Non era un difetto dei test: era
  la configurazione. Blocco disattivato con il motivo scritto accanto.
- **Il codice identificativo del locale Classic puntava a un locale inesistente** su TEST. Il test
  «passo Mario da Classic a Pro» chiedeva al database di aggiornarlo, il database rispondeva `200`
  aggiornando **zero righe**, e il test non aveva modo di accorgersene. Corretto col valore vero,
  letto dal database (`c97a2fa5-…` = `test-classic`, admin `testc@c.com`).
  **Effetto immediato:** quel test ha eseguito l'upgrade **per la prima volta davvero**, ed è emerso
  che la sua asserzione era ambigua («Servizio» compare sia nel menù laterale sia in una scheda della
  Home). Corretta anche quella, e l'helper ora **fallisce** se aggiorna zero righe.

### 2.3 Il form pubblico — la voce più grave (`public-booking.spec.ts`)

Tre difetti sovrapposti, tutti verificati a schermo prima di toccare il codice:

1. **Soglia sbagliata.** L'helper sceglieva il pulsante «Invia» grande dentro il form sopra i 1256px;
   il componente lo nasconde sotto i **1600px** (`hidden min-[1600px]:flex`), lasciandolo al
   riepilogo. La spec gira a 1280 → cercava un pulsante nascosto e moriva dopo 30 secondi.
   `public-booking-smoke.spec.ts` usava già 1600: due spec dello stesso repo raccontavano due app
   diverse.
2. **Locator ambiguo.** Il riepilogo è montato in due varianti (affiancata e impilata): senza
   `:visible` il pulsante risolveva su due elementi.
3. **Il submit non partiva mai** perché la tipologia scelta chiedeva di selezionare un piatto, e
   perché l'orario precompilato viene **azzerato** dal componente se non è fra le fasce di arrivo del
   locale. La spec ora **si semina la propria configurazione pubblica** (una sola tipologia
   «Tavolo»), sceglie l'orario dal calendarietto e **verifica la riga a database**.

### 2.4 I quattro fronti affidati agli agenti (tutti riverificati da me)

| Fronte | Cosa c'era | Cosa c'è ora |
|---|---|---|
| **Calendario** (`admin-calendar-blindatura`) | Scriveva un limite giornaliero **che nessuna schermata legge più** e pretendeva «300%»; cercava una sezione del riepilogo **inesistente in tutta l'app** | Semina i limiti per fascia, calcola il denominatore sommando i cap che ha messo lui, controlla `40%` e la scritta «20 coperti su 50», più un caso a **140%** (oltre 100 il badge dice il vero). Riepilogo verificato sui riquadri per fascia di oggi, con ordine `display_order`, pending e no-show assenti |
| **Servizio a orologio** (`pro-service-tables-lifecycle`) | 6 test su 7 erano ciechi fra le **23:25 e l'01:40**: gli orari venivano incollati alla data sbagliata | Gli scenari sono ancorati a mezzogiorno del giorno prima — mai a cavallo della mezzanotte e **mai avanti al tempo reale** (vincolo obbligato: l'orologio finto nel futuro rompe l'autenticazione). Il calcolo è stato estratto in una funzione a sé e coperto da **12 test unitari** che fingono le 23:50, le 00:30 e un'ora normale |
| **Classic e pulizie** | Skip che dicevano «non ci sono prenotazioni» mentre il vero motivo era un locator verso una marcatura **inesistente**; una suite intera spenta; tre skip che trasformavano un login rotto in un verde | Locator veri (l'evento nel calendario), prenotazioni seminate e ripulite, skip bugiardi diventati fallimenti parlanti, suite legacy cancellata, inviti generati dal test invece che letti dall'ambiente. **Zero `test.skip(true, …)` residui** |
| **CRM** (`pro-crm`) | Cercava una **tabella** di clienti: nel CRM non esiste, è una lista di schede. Poteva essere verde **solo a rubrica vuota** | Semina un cliente proprio, verifica che compaia con nome ed email, lo cancella |

### 2.5 Menu/magazzino — il test che sporcava il locale di prova

Tre rossi (uno per viewport), tutti sistemati:

- **Il ripristino non sopravviveva al tempo massimo.** Playwright interrompe il corpo del test,
  `finally` compreso: le richieste di ripristino non arrivavano al server. Spostato in `afterEach`,
  che ha un budget di tempo separato. **È la causa del travestimento del locale durato sette
  settimane.**
- **Cliccava una scheda che non esiste con una sola sotto-tipologia.** La striscia di schede si monta
  solo da due in su: con una sola il test restava appeso due minuti. Ora ne semina due.
- **A 375px il click cadeva sul pulsante sbagliato.** Il centro dell'intestazione, dove Playwright
  clicca, finisce sui comandi di riga: nello screenshot del fallimento il pulsante «Nascondi»
  risultava premuto — il test non apriva la categoria e per giunta le cambiava la visibilità. Ora si
  clicca il titolo.

### 2.6 Il locale di prova rivestito (decisione di Matteo)

Su TEST, tre valori riscritti per `da-tommaso`: nome → **Da Tommaso**; pagina Prenota → titolo e
descrizione sensati con la sola tipologia «Tavolo» attiva; preset di servizio → svuotato dal residuo
di test. Script con guardia che si rifiuta di partire se il progetto non è `docnnernvp`.

---

## 3. Numeri veri — misurati da me, non riportati

| Momento | Verdi | Rossi | Saltati | Totale |
|---|---|---|---|---|
| Stamattina, com'era (12 worker, file credenziali rotto) | 51 | **31** | 20 | 102 |
| Stessa cosa **un test alla volta** | 71 | 12 | 19 | 102 |
| Dopo il fix credenziali + i quattro agenti | 81 | 7 | 11 | 99 |
| **Fine giornata** | **87** | **3** | **9** | **99** |

- **Unit/integration:** da 1332 test su 161 file a **1344 su 162**, verdi (`npm run test`).
- Il totale passa da 102 a 99 perché la suite legacy `menu-crud` (3 test permanentemente spenti) è
  stata cancellata.
- I **9 saltati sono tutti a cascata** dai 3 rossi (`mode: 'serial'`): chiusi quelli, spariscono.

### I 3 rossi rimasti

| Spec | Stato |
|---|---|
| `public-booking-fix9-compilable.spec.ts:168` [mobile-375] | Non trova la scheda seminata. Indizio forte: è probabilmente lo **stesso** difetto «striscia di schede solo da 2 in su» già chiuso altrove |
| `public-booking-smoke.spec.ts:255` (card/carosello XOR) | Rosso **vero e finora invisibile**: era sospeso dietro il test della privacy, che ora è verde. Non diagnosticato |
| `admin-booking-mgmt.spec.ts:248` [mobile-375] | **Intermittente**: in quattro run di oggi è stato rosso, verde, verde, rosso senza che il codice cambiasse. Va in timeout perché la prenotazione seminata non compare in lista. Non diagnosticato |

---

## 4. Cosa NON è stato verificato — dichiarato, non nascosto

- **La stabilità del fix a orologio non è provata col browser.** È provata da 12 test unitari sulla
  funzione di calcolo alle 23:50 e alle 00:30. La spec vera l'ho eseguita solo di giorno: **rilanciarla
  davvero a cavallo della mezzanotte resta da fare**, ed è l'unica prova definitiva.
- **I 3 rossi rimasti non sono diagnosticati** (il primo ha un indizio forte, gli altri due no).
- **L'intermittenza di `admin-booking-mgmt:248` non è capita.** È la voce più insidiosa: un test che
  a volte passa è peggio di uno che fallisce sempre.
- **Non ho verificato a video** nessuno dei quattro fix della Fase 0: Matteo ha risposto «non ancora»
  alla domanda sul collaudo, e la Fase 1 non li tocca.
- **Il parallelismo non è stato deciso.** Ho misurato che 12 worker producono ~20 rossi finti, ma
  **non ho cambiato `playwright.config.ts`**: è una scelta che cambia la CI e volevo prima chiudere i
  rossi. Oggi la batteria va lanciata a mano con `--workers=1`.
- **La copertura CRUD del menù via interfaccia non esiste** (creare categoria, aggiungere elemento,
  eliminarlo): la suite che diceva di coprirla era spenta da mesi, i due sostituti coprono solo il
  mostra/nascondi. Cancellandola non si è perso nulla che funzionasse, ma la lacuna va scritta.

---

## 5. File di skill aggiornati

| File | Cosa |
|---|---|
| `docs/Testing-Skill/TESTING_SKILL.md` | **§3**: `npm run validate` **non guarda** `e2e/`, `tests/`, `__tests__/` (ESLint `ignorePatterns` + `tsconfig` `include: ["src"]`), col comando ad hoc per il controllo tipi; la batteria non regge 12 worker, coi numeri. **§5**: il `finally` non sopravvive al timeout → pulizia in `afterEach` (col caso reale delle sette settimane); nuova regola «verità a DB, non solo a schermo» col caso del submit verde che non creava nulla |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | **Playbook voce 13** — «misura prima di eseguire la lista che hai ereditato»: separa il guasto dalla contesa, guarda lo screenshot prima del codice, vieta ai subagent di eseguire la batteria; corollario sul verde troppo veloce. Anti-pattern curato: *ereditare i numeri invece di rimisurarli* |
| `docs/Sessioni di lavoro/03-08-26/PIANO_SENIOR_TEST_E_SALUTE_CODICE.md` | Blocco di aggiornamento Fase 1 in cima (vedi §10) |
| `docs/Sessioni di lavoro/03-08-26/PROMPT_PROSSIMO_SENIOR_FASE1.md` | Marcato ⛔ **superato**, con il motivo |
| `docs/Sessioni di lavoro/04-08-26/PROMPT_PROSSIMO_SENIOR.md` | Nuovo — supera il prompt del 03-08 |
| `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` · `docs/Testing-Skill/TESTING_CONTEXT.md` | Riga della suite `menu-crud` cancellata, **con la lacuna dichiarata**: il CRUD del menù via interfaccia resta scoperto. Trovati da `npm run validate:docs`, che senza questa correzione segnalava 16 path rotti invece dei 14 di debito preesistente |

**Template v.0 (`_skill-system-v0/`) — elencato qui come da procedura.**
⚠️ Nota di fatto, contro quanto dice il promemoria di chiusura: in questo repo il template **non è
gitignored**, è tracciato (`git status` lo mostra come modificato). Non cambia niente oggi — non è
stato committato nulla — ma chi preparerà i commit deve decidere consapevolmente se includerlo,
invece di darlo per invisibile.
`aree/TESTING_SKILL.md.template` — propagati in forma **generica** (senza nomi di file di questo
repo) i tre insegnamenti strutturali: «un verde significa qualcosa solo se un rosso era possibile»
(asserisci sul dato, non sullo schermo), «la pulizia non va in `finally` se il test può scadere»,
«verifica cosa copre davvero il gate prima di fidarti di lint/typecheck», più la nota sul rilanciare
la spec da sola prima di indagare un rosso.

**Non aggiornati, deliberatamente:** le ~15 divergenze skill/codice dell'audit (Fase 3) ·
`ADMIN_SERVIZIO_CONTEXT.md` §9.14, che ha **un punto stantio trovato oggi**: dice che «Ancora
occupato» timbra le righe di tenant+tavolo+fascia+data, mentre il codice
(`useTableAssignments.ts:829-835`) scrive per **id della singola riga**. È la correzione chiesta in
revisione ieri sera, non riportata nella scheda. Una riga, ma è area Servizio e non l'ho toccata in
questo giro: **la lascio scritta qui perché non vada persa**.

---

## 6. Domande aperte per Matteo

1. **Sotto-tipologia singola «a scheda»: il menù collegato non si applica mai.** La striscia che
   permette di sceglierla si monta solo da due in su, e l'auto-selezione esiste **solo** per il
   carosello. Un locale che configura una sola tipologia a scheda mostra al cliente il **menù intero**
   invece del suo menù dedicato. Verificato leggendo il codice e osservato a schermo. Difetto o
   comportamento voluto?
2. **Le tre manopole mai confermate**: soglia di ritardo 15', buffer di riassetto 10', durata walk-in 90'.
3. **Il pulsante «Aggiungi tavolo» per sala** è in una posizione diversa da quella scritta nel piano.
4. **Quanti controlli far girare insieme.** Con dodici in parallelo un terzo dei rossi è finto; uno
   alla volta la batteria è affidabile ma lenta. Serve una scelta (probabilmente 2-4 worker, oppure
   isolare i test che si scrivono addosso lo stesso locale).

---

## 7. Stato git e come spezzare i commit (se e quando li chiedi)

**Niente è committato.** 16 file modificati (di cui 1 cancellato) + 3 nuovi. Suggerimento di
suddivisione, il giorno che dirai di committare:

1. `fix(e2e): allinea le spec alle schermate di oggi` — le spec riscritte (Calendario, CRM, Classic,
   form pubblico, menu/magazzino) + `e2e/helpers/supabaseStaging.ts`.
2. `fix(e2e): ancora temporale stabile per gli scenari Servizio` — `pro-service-tables-lifecycle`,
   `e2e/helpers/wallClockAnchor.ts`, `tests/wallClockAnchor.test.ts`.
3. `chore(e2e): cancella la suite legacy menu-crud`.
4. `docs(testing): tre trappole della batteria e2e` — `TESTING_SKILL.md`, `TESTING_CONTEXT.md`,
   `ADMIN_TEST_SUITE_INDEX.md` (le ultime due chiudono i due path rotti lasciati dalla cancellazione).
5. `docs(servizio): report Fase 1 e prompt per il prossimo senior` — la cartella `04-08-26/`, il
   blocco ⛳ nel piano, il ⛔ sul prompt superato, e la voce 13 del playbook in `EVOLUZIONE_SKILLS.md`.
6. Da decidere a parte: `_skill-system-v0/aree/TESTING_SKILL.md.template` (vedi la nota in §5 — è
   tracciato, non gitignored).

⚠️ `.env.local.test` **non è tracciato** e non entra in nessun commit: le sue due correzioni vivono
solo sulla tua macchina. Se un altro computer deve far girare i test, va rifatta lì (è scritto dentro
al file, con la data e il motivo).

---

## 8. La mia lettura della sessione

La cosa che ha funzionato è stata **rifiutarmi di lavorare sulla lista del piano prima di aver
misurato**. Il piano parlava di 7 voci; la realtà era 12 rossi di cui 9 non previsti, più 19 rossi
finti da contesa. Se avessi cominciato a «sistemare la voce 1» avrei speso la giornata su un terzo
del problema, e avrei consegnato un numero finale privo di significato.

La seconda è stata **guardare gli screenshot dei fallimenti**. In tre casi su cinque la causa era
visibile a occhio in dieci secondi (il pulsante «Nascondi» premuto, il travestimento del locale, il
messaggio «Scegli almeno un piatto») e mi ha risparmiato mezz'ora di lettura del codice ogni volta.

Il rischio che ho corso e che segnalo: **ho allargato il perimetro**. Il mandato erano 7 voci; ne ho
toccate 12 più il file delle credenziali più i dati di un locale su TEST. L'ho fatto perché ogni
voce nuova era la causa diretta di un rosso che il gate della Fase 1 mi chiedeva di spiegare, ma è
esattamente il modo in cui una sessione perde il controllo. Il segnale che non è successo: il numero
è migliorato in modo verificabile a ogni passo, e nulla è stato committato.

---

## 9. Derivazione errori

- **Costo pagato:** ho lasciato che la prima run girasse con 12 worker prima di sospettare la
  contesa, e ho quasi scritto «31 rossi» come linea di partenza. Se l'avessi fatto, il prossimo
  senior avrebbe inseguito venti guasti inesistenti. **Cosa lo ha evitato:** rilanciare una singola
  cartella di spec in fila indiana come controprova, prima di riportare il numero.
- **Errore di metodo evitato per un soffio:** il primo fix al form pubblico (soglia 1600) rendeva il
  test verde in 1,1 secondi. Sembrava fatta. È stato il **dubbio sulla velocità** a farmi andare a
  guardare nel database, dove ho scoperto che non veniva creata nessuna prenotazione. Lezione:
  quando un test diventa verde troppo in fretta, quella fretta è un'informazione.
- **Attrito reale:** `npm run validate` non guarda i test. Ho fatto controllare lint e typecheck a
  quattro agenti su file che nessuno dei due strumenti legge. Sistemato nella skill; **la soluzione
  vera** (un `tsconfig` per `e2e/`) non l'ho fatta perché tocca la configurazione del progetto.

---

## 10. Cosa resta per la prossima sessione

1. I **3 rossi** di §3 → gate della Fase 1 chiuso.
2. La **decisione sul parallelismo** (§6.4) e, di conseguenza, `playwright.config.ts`.
3. La **prova a cavallo della mezzanotte** del fix a orologio (§4).
4. La riga stantia in `ADMIN_SERVIZIO_CONTEXT.md` §9.14 (§5).
5. Poi **Fase 2** (§4 del piano): 13 flussi da coprire, si parte dalle prime 4 righe.

---

## 11. Domande di chiusura

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: **Due prompt di testo + tre risposte a scelta multipla.**

Prompt 1: il contenuto integrale di `docs/Sessioni di lavoro/03-08-26/PROMPT_PROSSIMO_SENIOR_FASE1.md`,
incollato come primo messaggio (mandato di supervisione sulla Fase 1, letture obbligatorie, gate,
regole non negoziabili, metodo, due domande da fare prima di lanciare, perimetro escluso).

Prompt 2 (verbatim): «scrivi il report del tuo lavoro svolto e aggiorna handoff per permettere di
proseguire a prossimo agente senior il lavoro che stavi facendo.»

Più un «riprendi» iniziale per far ripartire il lavoro dopo un'interruzione.

Tre decisioni prese rispondendo a domande che ho posto io: (a) collaudo a video dei quattro fix della
Fase 0 → «Non ancora»; (b) correzione del file credenziali → «Sì, correggi»; (c) locale di prova
travestito → «Rivestilo tu in modo sensato».

Nessuna autorizzazione a committare o pushare è stata chiesta né data, e infatti non è stato fatto.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. **Ogni numero di §3 viene da una run che ho lanciato io**, non da un agente: quattro run
complete (12 worker, seriale, dopo-agenti, finale) più sei run mirate su singole spec. `npm run test`
eseguito da me: 1344 test su 162 file.

Riaperti di persona per verificare affermazioni prima di scriverle: `.env.local.test` (le tre chiavi
doppie, e `process.loadEnvFile` eseguito per vedere quale valore vince davvero) · `organizations` e
`admin_users` su TEST via REST in sola lettura (per scoprire che `E2E_CLASSIC_TENANT_ID` non esisteva
e a chi appartengono gli account) · `BookingCalendar.tsx:800-818` (la regola vera del badge) ·
`useTableStatuses.ts:139-147` (gli stati del tavolo, per calcolare le due finestre cieche) ·
`useTableAssignments.ts:66-73` (`filterBookingsOnDate`, che conferma perché la strada alternativa
dell'agente B sarebbe stata peggiore) · `BookingRequestForm.tsx:1300` e `:528-533` (la striscia di
schede e l'auto-selezione solo per il carosello) · `DietaryRestrictionsSection.tsx:286-295` (la
privacy è un pulsante, non un link) · `.eslintrc.cjs` e `tsconfig.json` (la copertura di validate) ·
`booking_requests` su TEST (per dimostrare che il submit non creava nulla).

Due controlli che nessuno mi aveva chiesto: **quanti clienti ha `da-tommaso`** (3 — quindi il ramo
«rubrica vuota» del test CRM non poteva essere vero) e **da quando il locale è travestito**
(`restaurant_name` aggiornato il **16-06-2026**).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: **Uno allineato in questa chiusura, uno lasciato aperto con il motivo scritto.**

Allineato: `docs/Testing-Skill/TESTING_SKILL.md` — è la skill che governa questa materia, e le tre
trappole di oggi (validate cieco sui test, contesa a 12 worker, `finally` che non sopravvive al
timeout) sono esattamente il tipo di sapere che altrimenti si ripaga ogni volta. Aggiornati §3 e §5,
con i numeri reali e i casi concreti, non in astratto.

Lasciato aperto **e scritto in §5**: `ADMIN_SERVIZIO_CONTEXT.md` §9.14 descrive «Ancora occupato»
come se timbrasse tutte le righe di tenant+tavolo+fascia+data, mentre il codice scrive per id della
singola riga (`useTableAssignments.ts:829-835`). È una divergenza nata **ieri sera**, nella sessione
che stava sanando le divergenze. Non l'ho corretta perché è area Servizio e questo giro è sui test:
correggerla di straforo avrebbe reso il diff meno leggibile. È la prima voce della lista di §10 punto 4.

Non toccati: tipi (`src/types/database.ts`) perché nessuna modifica di schema; `MASTERPLAN_SERVIZIO.md`
e `FOLLOW_UP.md` perché nessuna decisione di prodotto è stata presa o chiusa oggi;
`COLLAUDO_S4_CHECKLIST.md` perché nessuna voce di collaudo a mano è stata dimostrata da questi test.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: (1) **Il gate della Fase 1 non è chiuso**: restano 3 rossi e 9 sospesi a cascata. Due dei tre
non li ho nemmeno diagnosticati. (2) **Non ho toccato `playwright.config.ts`**: so che 12 worker
producono rossi finti, ma la scelta cambia la CI e va decisa, non subita. (3) **Non ho provato il fix
a orologio a cavallo della mezzanotte** col browser: ho la prova unitaria, non quella vera.
(4) **Non ho capito l'intermittenza** di `admin-booking-mgmt:248`, e un test che a volte passa è
peggio di uno che fallisce sempre. (5) **Non ho aggiunto un `tsconfig` per `e2e/`**, che è la
soluzione vera al fatto che nessuno controlla i tipi dei test. (6) **Non ho corretto la riga stantia**
di `ADMIN_SERVIZIO_CONTEXT.md` §9.14. (7) **Nessun commit, nessun push** — mai autorizzati.
(8) Non ho toccato rollout PROD, D38, merge su main, divergenze dell'audit: fuori perimetro.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: **Attrito 1 — «lint e typecheck verdi» è una frase che nel repo non significa niente per un
test**, e quattro agenti me l'hanno riportata in buona fede: la skill non lo diceva. Proposta, già
applicata: scritto in `TESTING_SKILL.md` §3, col comando ad hoc; la proposta vera che resta è un
`tsconfig.e2e.json` più uno script `typecheck:e2e`, così la frase torna a voler dire qualcosa.
**Attrito 2 — il piano ereditato descriveva un mondo vecchio di poche ore e già sbagliato nei numeri**:
diceva 7 voci, erano 12 rossi più 19 finti. Proposta: nei piani, separare sempre «voci che ho
verificato oggi eseguendo» da «voci che ho dedotto leggendo», perché il lettore successivo tratta le
due cose allo stesso modo e ci perde mezza giornata.
**Attrito 3 — la cartella di sessione va creata a mano e il report rischia di finire nella cartella
del giorno sbagliato** (il lavoro di stanotte è in `03-08-26`, il mio in `04-08-26`, e i due si
riferiscono l'un l'altro). Proposta: nel prompt al prossimo senior citare i file **per nome più
istruzione di cercarli**, mai per percorso presunto — regola già suggerita ieri e che oggi mi ha
risparmiato un doppione.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: **Giusto per instradare, insufficiente per fidarsi — esattamente come nella sessione
precedente, e per lo stesso motivo.** Il prompt ereditato era ottimo per sapere *dove* guardare (e le
sue due voci evidenziate erano entrambe vere), ma tutti i numeri che conteneva erano superati e tre
quarti dei problemi reali non erano citati. Il valore l'ha dato la misura, non il documento.

Il contesto delle skill d'area l'ho caricato in modo mirato (Testing per intero, Servizio solo §9.13-9.14)
e non ho avuto bisogno di esplorare il codice a tappeto: le voci si sono chiuse tutte con letture
puntuali guidate dagli errori dei test. Il promemoria periodico sulla lista dei task è stato utile in
una giornata con quattro agenti e sei run in parallelo: senza, avrei perso il filo di quale rosso
apparteneva a chi. Le notifiche automatiche di completamento sono state tutte marcate come non-input
umano e nessuna è stata trattata come approvazione.
```

## 12. Self-review del report

1. **Dati = diff reale:** sì. Le quattro righe della tabella §3 vengono da quattro run mie, i file di
   §5 e §7 corrispondono a `git status`, e il conteggio (16 modificati di cui 1 cancellato + 3 nuovi)
   l'ho riletto sul terminale mentre scrivevo, non a memoria.
2. **File correlati allineati:** sì per `TESTING_SKILL.md`, che era il file che *doveva* cambiare. La
   divergenza di `ADMIN_SERVIZIO_CONTEXT.md` §9.14 è dichiarata due volte (§5 e R3) invece di essere
   nascosta in un follow-up: è la cosa che, se non scritta, sparisce.
3. **Q1-Q6 coerenti:** sì. R4 (nessun commit), R1 (nessuna autorizzazione) e §7 dicono la stessa cosa;
   i tre rossi di §3, i «non verificati» di §4 e R4 elencano le stesse voci senza discrepanze.
4. **Tono utente:** §1 e §2 parlano per schermate e flussi (il cliente che invia il form, il locale
   che si chiama «QA 375», il click che preme il pulsante sbagliato); §3-§10 e §11-§12 sono dati
   interni. La distinzione è rispettata.
5. **Cosa un revisore potrebbe contestarmi:** di aver allargato il perimetro oltre le 7 voci del
   piano — è scritto in §8, con il motivo e con il segnale che tiene il rischio sotto controllo. E di
   aver chiuso la giornata con **3 rossi ancora aperti** invece di portare il gate a zero: vero, e
   preferisco consegnare tre rossi spiegati che un verde ottenuto ammorbidendo le asserzioni.
