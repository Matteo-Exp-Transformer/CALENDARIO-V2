# S4 — Plan fix post-QA Matteo

> Fonte finding: `Report-revisione-integrazione-S4-24-06-26.md` §10.
> Stato QA: Matteo ha testato **solo Servizio mobile**. Il piano non autorizza PROD.
> Obiettivo: chiudere S4 su TEST con il minor consumo di contesto, senza assorbire prematuramente S4-LIVE.

## 0. Strategia agenti e consumo

Usare **due sole sessioni esecutore**, entrambe Sonnet. Haiku non conviene: anche i fix apparentemente
piccoli confinano con hook condivisi, finestre di occupazione e responsive; il risparmio per-token sarebbe
annullato dal costo di ricaricare il contesto e dal rischio di revisione correttiva. Opus non serve.

| Sessione | Modello | Fasi | Stima | Perché |
|---|---|---|---|---|
| **Esecutore A — Servizio** | Sonnet | A0→A3, stessa chat | 1 sessione lunga, 4 checkpoint; consumo medio-alto | Riusa una sola lettura di skill, flusso dati e componenti Servizio. |
| **Esecutore B — Calendario/Prenota** | Sonnet | B0→B1, stessa chat | 1 sessione media, 2 checkpoint; consumo medio | Contesto e LOCK diversi: separarli evita di trascinare tutto Servizio. |

Regola: ogni fase finisce con test mirati e diff circoscritto; **non** ripetere `npm run validate` dopo ogni
micro-fix. Eseguirlo al checkpoint A2, a fine A3 e a fine B1. Nessun nuovo branch: lavorare su `env/test`.

## 1. Gate di prodotto prima dei fix

L'esecutore A0 deve produrre prove dal codice, non decidere al posto di Matteo:

1. **Tavolo occupato / D25:** S4 approvata consente forzatura con avviso; il QA chiede invece di mostrare
   solo tavoli liberi. Non implementare nessuna delle due interpretazioni finché A0 non chiarisce se il
   problema è disponibilità calcolata male o una nuova decisione di prodotto.
2. **Mappa operativa vs S4-LIVE:** la richiesta di due viste può sovrapporsi alla futura pagina Live.
   Correggere la visualizzazione/stato S4 esistente; non costruire una nuova Live dentro questo piano.
3. **Stato tavolo:** gli stati S4 sono derivati dal tempo, non aggiornati manualmente. A0 deve distinguere
   fra timer/invalidation mancante, dati snapshot errati e comportamento futuro Live.
4. **Ordine Data→Ospiti→Orario:** chiarire se il finding riguarda form pubblico Prenota o form admin;
   sono superfici e LOCK diversi.

## 2. Sequenza e gate di review

| Fase | Contenuto | Review Codex | Gate |
|---|---|---|---|
| **A0** | Diagnosi causale completa, zero codice | **approfondita** | matrice bug / UX / S4-LIVE / decisione Matteo |
| **A1** | CRUD e polish Servizio a basso accoppiamento | rapida | test mirati verdi, nessun cambio contratti dati |
| **A2** | Correttezza dati: booking, refresh, multi-assignment, walk-in, stati, briefing | **approfondita** | validate verde + prove sui dati TEST |
| **A3** | UX assegnazione + mobile + E2E Servizio | **approfondita** | E2E 375/834/1280 + checklist Matteo |
| **B0** | Diagnosi Calendario/Prenota | rapida se cause isolate; altrimenti approfondita | separazione bug da nuova feature |
| **B1** | Fix trasversali confermati + test | **approfondita** | validate/build/E2E mirati verdi |
| **Finale** | controverifica integrata S4 | approfondita Codex | skill/report allineati; S4 chiudibile su TEST |

## 3. Scope per fase

### A0 — Diagnosi Servizio

Verificare tutti i finding del report, con priorità ai difetti che nascondono o corrompono stato:

- prenotazioni con tipologia/menu/carosello mancanti dal cassetto;
- mancato refresh tornando in Servizio;
- due assegnazioni sullo stesso tavolo visualizzate una alla volta;
- walk-in creato ma non visibile sul tavolo;
- stato fermo su “In arrivo”;
- filtro Briefing per fascia vuoto;
- superamento capienza senza warning;
- disponibilità tavolo occupato/occupato a breve.

Output: tabella causa → file responsabile → test che manca → fase proposta. Nessuna modifica.

#### Esito A0 — diagnosi causale completata

> Diagnosi eseguita su `env/test`, senza modifiche a codice, DB o Edge. Collegamento verificato sul
> progetto TEST `docnnernvpyrbwuzzach`. I 66 test mirati esistenti risultano verdi, ma non coprono i
> flussi completi emersi dal QA.

| Finding | Classificazione | Causa concreta e dati coinvolti | Rischio Classic/Pro | Test esistente insufficiente | Test nuovo necessario | Fase |
|---|---|---|---|---|---|---|
| Booking con menu/carosello assente | Non riprodotto come bug autonomo; probabile effetto del refresh | `useUnassignedBookings` legge tutte le `booking_requests` accepted con `select('*')`; `filterUnassignedBookingsForSlot` filtra solo data, orario, fascia e assignment attivo. Non esiste alcun ramo per `booking_type`, `menu_selection`, card o carosello. Sul TEST è presente una `menu_prezzo_fisso` con 3 item e assignment attivo: il tipo è quindi transitato nel flusso. La query resta però nella cache `table_assignments` e può mostrare dati vecchi. | Pro; rischio Classic basso perché il filtro è consumato dalla UI Servizio | `serviceSlotBookingFilter.test.ts` verifica gli orari ma usa casi generici, non la matrice tipologie/card/menu | Integrazione `useUnassignedBookings`: tavolo, menu fisso, card e carosello accepted nella stessa fascia devono comparire; ripetere subito dopo accettazione e navigazione | A2 |
| Mancato refresh tornando in Servizio | Bug certo | Le query Servizio usano chiavi `[table_assignments, tenant, data, ...]`; creazione/accettazione booking invalida solo `bookings`. Il QueryClient globale ha `staleTime=5 min` e `refetchOnWindowFocus=false`: tornando entro 5 minuti viene riusata la cache. Coinvolti `useAcceptedBookingsForDate`, `useUnassignedBookings`, mutation booking e navigazione Admin. | Pro; attenzione a non alterare il refresh globale Classic | Nessun test copre navigazione Prenotazioni/Calendario → Servizio con cache ancora fresh | Crea o accetta booking, entra in Servizio, cambia pagina, crea/accetta una seconda booking, torna entro 5 minuti: la seconda deve apparire senza reload | A2 |
| Due assignment sullo stesso tavolo, uno solo renderizzato | Bug certo | `AssignmentMapPanel` usa `assignments.find(...)`, quindi passa al tavolo una sola booking. `useTableStatuses` raggruppa per tavolo e conserva solo il `turn_number` più basso. Le altre righe `booking_table_assignments` restano nel DB ma non vengono renderizzate. | Solo Pro | `useTableAssignments.occupancy.test.ts` dimostra che due turni sono ammessi; `AssignmentMapPanel.5stati.test.tsx` testa solo le label mockate | Due booking sullo stesso tavolo, sia sequenziali sia sovrapposte/forzate: entrambe visibili con orario, stato e azione coerenti | A2 |
| Walk-in creato ma non visibile sul tavolo | Bug certo, confermato dal DB TEST | `useWalkInMutation` inserisce soltanto `booking_requests` e salva `placement=nome tavolo`; non crea `booking_table_assignments` e non invalida le query `table_assignments`. Sul TEST i walk-in recenti ispezionati hanno zero assignment attivi. | Solo Pro | `walkIn.b2.test.tsx` verifica placement, durata e warning con mutation mockata; non verifica la persistenza dell'assignment | Creazione con tavolo → booking e assignment coerenti; invalidazione immediata; errore della seconda scrittura senza stato parziale | A2 |
| Stato fermo su “In arrivo” | Bug certo | `useTableStatuses` calcola `new Date()` dentro `useMemo`, ma non ha timer né invalidazione temporale. Lo stato cambia soltanto dopo un altro render/query update. Il resolver puro è corretto ai confini temporali, ma il runtime non lo richiama. | Solo Pro | `useTableStatuses.test.ts` testa il resolver con `now` iniettato; `AssignmentMapPanel.5stati.test.tsx` mocka direttamente ogni stato | Fake timer/runtime: upcoming → occupied → late → leaving senza navigazione, mutation o refresh manuale | A2 |
| Briefing vuoto selezionando fascia | Bug certo | Il modal offre soltanto `lunch/dinner`; `useShiftBriefing` usa `getShiftRanges(businessHoursRaw)`, che riconosce un formato limitato e altrimenti applica 11–15/18–23. Non legge le `service_slots` reali Colazione/Pranzo/Aperitivo/Cena/Notturna. | Pro; cautela perché `shifts.ts` è condiviso con Analytics | Tutti i test `useShiftBriefing.test.tsx` chiamano `useShiftBriefing('all')`; coprono join tavoli/sale, non il filtro | Fasce reali tenant, inclusa overnight; ogni selezione mostra le booking della fascia corrispondente e label dinamica | A2 |
| Superamento capienza senza warning | Conflitto di requisito più bug overnight possibile | In modalità tavoli D1/D46 `useCapacityCheck` usa la somma dei posti dei tavoli e ignora `service_slots.max_guests`. Superare il cap fascia ma non la capienza fisica non produce warning: la coesistenza dei due limiti è D38, non ancora attivata. Inoltre `WalkInModal` individua la fascia corrente con confronto stringhe e non gestisce una fascia overnight. | Alto: `useCapacityCheck` è condiviso con Classic; la semantica Classic non va cambiata | `useCapacityCheck.tableMode.test.ts` certifica esplicitamente cap fisica in Pro e cap fascia in Classic; `walkIn.b2.test.tsx` mocka lo sforo | Separare cap fisica, cap fascia, limite esatto, Pro senza tavoli, Classic e fascia overnight; decidere D38 prima di cambiare la doppia soglia | A2 dopo decisione D38 |
| Tavoli occupati/occupati a breve | Bug di calcolo; comportamento UX deciso da Matteo | `WalkInModal.isBusy` guarda solo booking accepted con `placement=nome` occupate nell'istante corrente; ignora `booking_table_assignments` e sovrapposizioni della finestra del walk-in. `AssignmentMapPanel` rende ogni tavolo droppable e `useAssignBookingToTable` offre D25 solo quando supera `max_turns`, non quando le finestre si sovrappongono. I resolver `findFreeTablesAt`/finestre esistono ma non sono collegati a questi flussi. | Solo Pro | `walkIn.b2.test.tsx` certifica solo il vecchio confronto per placement; `useTableAssignments.occupancy.test.ts` testa funzioni/forzatura, non il collegamento UI | Tavolo libero; assegnato ora; libero ora ma assegnato a breve; confine fine finestra; conferma forzatura con audit | A2 per calcolo, A3 per alert e presentazione |

##### Decisioni e confini dopo A0 — review Codex

- **D25 / tavolo occupato — decisione Matteo:** mostrarlo nell'elenco ma **disabilitato perché occupato**.
  L'admin non sovrappone direttamente una nuova prenotazione: può scegliere l'azione separata **Libera
  anticipatamente**, che timbra `checked_out_at` sull'assignment esistente (append-only, nessun DELETE),
  quindi assegna il nuovo walk-in/booking al tavolo ormai libero. La prenotazione precedente non viene
  cancellata; torna non assegnata se deve ancora essere gestita. Disponibilità e conflitti devono usare
  assignment + finestre reali, non soltanto `placement`.
- **Stati S4:** restano temporali e automatici. Non aggiungere un comando manuale per trasformare “In
  arrivo” in “Occupato”. Check-in, cliente seduto/in servizio, proroga e stato fisico manuale appartengono
  a S4-LIVE.
- **Seconda vista operativa:** A3 può separare configurazione e assegnazione riusando le superfici S4
  esistenti. Non deve introdurre sessione tavolo, conto, ordini o altri consumer della futura S4-LIVE.
- **D38 — decisione Matteo: implementare ora il toggle avanzato.** Default OFF: con tavoli comanda la
  capienza fisica. Se il ristoratore attiva “Mantieni anche il limite coperti della fascia”, devono essere
  rispettati sia tavoli sia cap operativo; vince il primo limite raggiunto. Riusa lo scoping override già
  deciso dal masterplan; non applicare automaticamente entrambi i limiti ai tenant esistenti.
- **Nome tavolo — decisione Matteo:** univoco in tutto il ristorante/tenant, non soltanto nella sala.
  Il controllo deve essere case-insensitive e ignorare il record corrente in modifica; messaggio utente
  chiaro, senza affidarsi al solo nome `placement` come identità tecnica.
- **Walk-in + tavolo — atomicità obbligatoria:** il fix richiede booking e assignment coerenti come unica
  operazione logica. Vietato lasciare un booking accettato senza assignment se la seconda scrittura fallisce.
  A2 deve proporre e revisionare il confine transazionale (RPC/operazione server-side o alternativa con
  rollback dimostrabilmente sicuro) prima di implementare; questo può alzare lo scope DB deep.

##### Verdetto review Codex A0

**APPROVATO per passare ad A1 dopo le decisioni Matteo sopra.** Le cause refresh, multi-assignment,
walk-in senza assignment, clock stati e briefing statico sono confermate dal codice. Il finding
menu/carosello va trattato come test di matrice + conseguenza probabile della cache, non come filtro
commerciale dimostrato. Prima di A2 resta obbligatorio il mini-design atomico walk-in+assignment. I “66
test verdi” dichiarati da A0 restano evidenza dell'esecutore: la review non ha ricevuto un log separato.

##### Ordine vincolante dei fix derivato da A0

1. Allineare query key e invalidazione/refetch Servizio.
2. Blindare il cassetto con la matrice di tipologie/card/menu, senza filtri commerciali.
3. Rendere coerente la creazione walk-in con l'assignment e le invalidazioni.
4. Renderizzare tutti gli assignment/turni presenti sul tavolo.
5. Aggiungere il clock/invalidation degli stati temporali.
6. Collegare il briefing alle fasce servizio reali.
7. Collegare disponibilità e conflitti alle finestre/assignment reali.
8. Implementare il toggle D38 default OFF senza violare il default D1.
9. In A3 mostrare gli occupati disabilitati + liberazione anticipata separata, click mobile e separazione
   operativa senza costruire S4-LIVE.

### A1 — CRUD/polish isolato

**Stato: implementato su `env/test`.** Test mirati 22/22, typecheck, lint ed E2E Servizio 2/2 verdi;
viewport E2E 375/834/1280. Nessuna modifica a DB, Edge, assegnazioni, finestre, walk-in o D25.

- contenitore della mappa coerente con le dimensioni della sala senza rompere overflow responsive;
- nome tavolo unico case-insensitive nell'intero tenant, con errore comprensibile;
- coperti precompilati a 2 nella creazione;
- nome/coperti più leggibili nella mappa con limite nome esplicito e coerente fra UI/validazione;
- “Modifica sala” agisce sulla sala selezionata, senza dropdown che copre la mappa;
- conferma elimina-sala senza coppia incoerente Annulla/Salva.

#### Review Codex A1 — 25-06-26

**APPROVATO per passare ad A2.** La review ha ricontrollato il diff e rieseguito:
`npm run test -- src/features/booking/components/__tests__/servizioA1Fixes.test.tsx`, `npm run typecheck`,
`npm run lint`, `npm run validate`, `npm run test:e2e -- e2e/pro/pro-service.spec.ts --workers=1`.
Esito: verde, incluso E2E Servizio 2/2.

Confini rispettati: nessun file DB/Edge, nessuna modifica a semantica assegnazioni, finestre, walk-in o
D25. Il cambio E2E è limitato al locator della sezione Fasce orarie, reso necessario dalla nuova label
`Modifica sala`.

Note non bloccanti da conservare:
- il controllo nome tavolo unico è client-side, coerente con il divieto A1 di DB; non protegge da race fra
  due admin simultanei;
- il nuovo test A1 passa ma produce warning React `act(...)` legati alla guard dirty, in linea col rumore
  già presente in altre suite. Se si decide di ripulire la console test, farlo in un micro-fix dedicato.

### A2 — Correttezza dati e runtime

Implementare soltanto le cause confermate da A0. Richiedere test di regressione per filtri di ogni tipo di
prenotazione, invalidazione al cambio pagina, rendering multi-assignment, walk-in, timer/invalidation stati,
fasce briefing reali e warning capienza. Non costruire la pagina Live.

**Stato: implementato su `env/test` il 25-06-26.** Nessuna migrazione/RPC/deploy; PROD non toccata.
`npm run validate` verde. Vedi report §9-ter per mini-design walk-in atomico, test A2 e checklist manuale.

### A3 — UX operativa e mobile

- conteggio `N` prenotazioni per fascia;
- feedback drag con nome+coperti;
- assegnazione tramite click/modal rapido per mobile, con disponibilità live;
- undo/conferma assegnazione senza lasciare DB e UI divergenti;
- mobile: niente editor/mappa di configurazione, ma lista + assegnazione operative;
- tavoli occupati visibili ma disabilitati; azione separata di liberazione anticipata append-only;
- estensione `e2e/pro/pro-service.spec.ts` con dati TEST e cleanup, marcatori blindatura e viewport.

La proposta “due viste modifica/operativa” non diventa una nuova pagina Live: A3 può separare modalità
configurazione e assegnazione solo se riusa superfici S4 già esistenti.

### B0/B1 — Calendario e Prenota

- doppia apertura di “Form pubblico” dalla tab Prenotazioni;
- occupazione per fascia nella vista giorno anche senza cap per-fascia, preservando la semantica distinta
  del badge mensile complessivo;
- ordine Data→Ospiti→Orario solo sulla superficie identificata da B0, rispettando i LOCK e la validazione;
- test unit/component + Playwright mirati, senza modificare Edge/DB se la diagnosi non lo richiede.

## 4. Prompt sequenziali

### Prompt 1 — Esecutore A / A0 diagnosi

```text
Profilo: Verifica
Modalità: deep
Skill da leggere: `.claude/CLAUDE.md`; `docs/Testing-Skill/TESTING_SKILL.md`; `docs/Testing-Skill/MANUALE_BLINDATURA.md`; `docs/Admin-Skill/ADMIN_MINI.md`; `docs/Admin-Skill/ADMIN_SKILL.md`; `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md`; `docs/MASTERPLAN_SERVIZIO.md`; `docs/Sessioni di lavoro/24-06-26/S4_FIX_PLAN.md`; `docs/Sessioni di lavoro/24-06-26/Report-revisione-integrazione-S4-24-06-26.md` §10.
Non caricare: skill Menu QR, Marketing, Legal e altri report storici non richiamati dai file sopra.
Output attesi: una diagnosi causale dei finding Servizio del report, una matrice bug/UX/S4-LIVE/decisione Matteo, i test mancanti e l'ordine esatto dei fix; zero modifiche a codice, DB, Edge o documentazione; niente output in più senza chiedere Sì/No prima.

Lavora su `env/test`. Questa è una fase di diagnosi, non implementazione. Leggi i file applicativi solo dopo il routing. Riproduci o dimostra dal codice ciascun finding A0 del plan: booking con menu/carosello assente, refresh tornando in Servizio, multi-assignment non renderizzato, walk-in non visibile, stato fermo su “In arrivo”, briefing vuoto per fascia, capienza senza warning, tavoli occupati/occupati a breve.

Per ogni finding indica: causa concreta; dati/query/componenti coinvolti; rischio Classic/Pro; test esistente che avrebbe dovuto intercettarlo; test nuovo necessario; fase A1/A2/A3 corretta. Verifica esplicitamente tre conflitti: D25 consente forzatura su occupato mentre il QA chiede solo tavoli liberi; gli stati S4 sono temporali e non manuali; la seconda vista operativa non deve trasformarsi nella futura S4-LIVE.

Non correggere nulla. Se un finding non è riproducibile, descrivi dati e click esatti necessari. Consegna a Matteo una sintesi semplice: quali sono bug certi, quali richieste UX e quali decisioni restano sue.
```

**Review Codex dopo Prompt 1:** approfondita. Non avviare A1 finché la matrice non separa chiaramente D25,
stati temporali e S4-LIVE.

### Prompt 2 — stesso Esecutore A / A1 CRUD e polish

```text
Prosegui nella STESSA chat e conserva il contesto A0.
Profilo: Esecuzione
Modalità: deep
Skill già caricate: riusa quelle di A0; aggiungi `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md` e `docs/per-ui-design-skill/UI_EDIT_SKILL.md` solo per le sezioni pertinenti.
Output attesi: esclusivamente i fix A1 confermati nel plan, test mirati, aggiornamento skill Servizio/report di fase; niente refactor, nuove viste Live, DB o Edge; niente output in più senza chiedere Sì/No prima.

Implementa il batch isolato A1: dimensionamento contenitore mappa coerente con la sala; unicità case-insensitive del nome tavolo nell'intero tenant (in modifica ignora il record corrente) con messaggio comprensibile; default coperti=2; leggibilità nome/coperti con limite nome coerente; modifica della sola sala selezionata; conferma elimina-sala senza azioni Annulla/Salva incoerenti.

Prima di editare identifica contratti condivisi e adiacenze: RoomTabs/RoomConfig, TableMap/TableShape, modale tavolo, overflow del contenitore, lista e mappa. Verifica 375/834/1280. Non cambiare semantica assegnazioni, finestre, walk-in o D25.

Aggiungi test di regressione proporzionati. Esegui test mirati, lint/typecheck se i tipi cambiano. Puoi solo alzare la modalità. Alla fine consegna una checklist semplice dei click da rifare.
```

**Review Codex:** rapida sul diff + test mirati; diventa approfondita se emerge schema/contratto condiviso.

### Prompt 3 — stesso Esecutore A / A2 correttezza dati

```text
Prosegui nella STESSA chat dopo approvazione Codex di A1.
Profilo: Esecuzione
Modalità: deep
Skill: riusa il contesto A0; rileggi `ADMIN_CLASSIC_SKILL.md` se tocchi hook condivisi con Calendario/Prenotazioni; leggi `DB_SKILL.md` solo se A0 dimostra un problema DB. TEST soltanto, PROD vietata.
Output attesi: fix A2 soltanto per cause confermate dalla matrice A0, test unit/component di regressione, `npm run validate` verde, skill/report allineati; niente nuova pagina Live, migrazione o deploy non dimostrati necessari; niente output in più senza chiedere Sì/No prima.

Correggi la coerenza dati Servizio: tutte le prenotazioni accettate assegnabili indipendentemente da tipologia/menu/carosello; refresh/invalidation tornando nella pagina; rendering simultaneo multi-assignment; walk-in visibile sul tavolo corretto con booking+assignment atomici; stati temporali che si aggiornano secondo finestra; briefing filtrato sulle fasce reali; toggle avanzato D38 default OFF che, quando attivo, applica anche il cap fascia oltre alla capienza tavoli.

Per tavoli occupati rispetta la decisione Matteo: visibili ma non assegnabili finché l'admin non usa la liberazione anticipata separata; nessuna sovrapposizione diretta. Prima di implementare il walk-in presenta nel report tecnico il mini-design atomico e fermati se richiede una migrazione/RPC non già autorizzata dal prompt. Ogni fix deve avere prima un test rosso, poi verde. Controtesta null/legacy, overnight, due assegnazioni, cambio pagina e doppio click. Esegui `npm run validate` una volta a fine batch.

Consegna una checklist semplice con dati da preparare e click per verificare ciascun flusso.
```

**Review Codex:** approfondita su query, invalidazioni, append-only, multi-assignment, finestre e regressione Classic.

### Prompt 4 — stesso Esecutore A / A3 UX operativa + E2E

```text
Prosegui nella STESSA chat dopo approvazione Codex di A2.
Profilo: Esecuzione
Modalità: deep
Skill: riusa A0; rileggi `TESTING_SKILL.md` §E2E/QA e `UI_RESPONSIVE_SKILL.md`.
Output attesi: UX A3 confermata, test unit/component, estensione mirata di `e2e/pro/pro-service.spec.ts`, cleanup dati TEST, validate + E2E mirati verdi, documentazione QA aggiornata; niente S4-LIVE o modifiche Calendario/Prenota; niente output in più senza chiedere Sì/No prima.

Completa il flusso operativo: numero prenotazioni per fascia; feedback drag nome+coperti; assegna via click con modale rapido sala/tavolo e disponibilità live; annulla/conferma assegnazione senza divergenza DB/UI; su mobile mostra lista+assegnazione e nasconde editor/mappa configurazione. Mostra i tavoli occupati disabilitati e offri l'azione separata “Libera anticipatamente”; dopo il timbro append-only il tavolo diventa selezionabile per il nuovo walk-in/booking. Non cancellare né sostituire la prenotazione precedente.

Non creare una nuova pagina Live. Se separi vista modifica/operativa, riusa le superfici S4 esistenti. Mappa adiacenze: cassetto, filtri fascia/data, tavoli, modali, legenda, scroll e bottoni mobile. Verifica 375/834/1280.

Estendi l'E2E Servizio con seed/cleanup TEST e `--workers=1`: CRUD minimo sala/tavolo, assegnazione+undo, walk-in, soft-delete, briefing per fascia e responsive. Non rendere i test dipendenti dall'ora reale senza clock/dati controllati. Esegui validate e spec E2E mirata.

Consegna a Matteo la checklist finale Servizio in linguaggio semplice.
```

**Review Codex:** approfondita, inclusa esecuzione E2E e controllo responsive. Se verde, Servizio può passare
al collaudo visuale Matteo completo; non è ancora rollout PROD.

### Prompt 5 — Esecutore B / B0+B1 Calendario e Prenota

```text
Profilo: Verifica → Esecuzione solo dopo diagnosi
Modalità: deep
Skill da leggere: `.claude/CLAUDE.md`; `docs/Testing-Skill/TESTING_SKILL.md`; `docs/Admin-Skill/ADMIN_MINI.md`; `docs/ADMIN_CLASSIC_SKILL.md`; `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md`; `docs/Prenota-Skill/PRENOTA_MINI.md`; `docs/Prenota-Skill/PRENOTA_SKILL.md`; i context Prenota indicati dal routing per form/validazione; `docs/Sessioni di lavoro/24-06-26/S4_FIX_PLAN.md` §B0/B1; report S4 §10.E.
Non caricare: contesto completo Servizio, Menu QR, CRM, Analytics.
Output attesi: diagnosi dei tre finding B0; implementazione solo dei bug/decisioni già non ambigue; test mirati + validate/build + E2E pertinenti; skill/report allineati; niente DB/Edge/PROD salvo prova e nuova autorizzazione; niente output in più senza chiedere Sì/No prima.

Lavora su `env/test`. Diagnostica prima: (1) click “Form pubblico” apre due tab/pagine; (2) vista giorno deve mostrare occupazione per fascia anche senza limite per-fascia, mantenendo il badge mese complessivo separato; (3) identificare con prova se Data→Ospiti→Orario riguarda il form pubblico Prenota o il form admin. Non toccare un LOCK finché la superficie non è certa.

Dopo la diagnosi, implementa i primi due bug se confermati. Per il terzo, procedi solo se la decisione è già univoca nel report/context; altrimenti fermati e formula una domanda Sì/No a Matteo. Preserva submit, client Supabase pubblico/admin e semantica dei limiti. Verifica 375/834/1280 e le superfici adiacenti del form.

Per ogni fix: test rosso→verde, controtest doppio click/navigazione/limite assente, poi `npm run validate`, `npm run build` ed E2E mirata. Consegna una checklist semplice separata per Calendario e Pagina Prenota.
```

**Review Codex:** approfondita perché coinvolge Admin Classic e potenzialmente il form pubblico LOCK.

## 5. Chiusura prevista

Dopo le review e il nuovo QA Matteo:

1. aggiornare questo plan con esiti per fase;
2. aggiornare report S4 e `ADMIN_TEST_SUITE_INDEX` con viewport realmente eseguiti;
3. eseguire validate/build/E2E Servizio + non-regressione Classic/Prenota;
4. dichiarare S4 chiusa **su TEST** solo se tutti i finding bloccanti sono fixati o esplicitamente classificati
   S4-LIVE/follow-up da Matteo;
5. PROD resta un piano separato con conferma esplicita.
