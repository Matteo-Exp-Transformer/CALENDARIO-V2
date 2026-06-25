# Report revisione integrazione S4 — 24-06-26

**Cosa è cambiato:** S4 è stata controverificata su `env/test`; DB e Edge TEST sono allineati e lo skill system descrive ora lo stato integrato reale.
**Cosa resta:** collaudo manuale responsive da parte di Matteo e, solo dopo esito positivo, rollout coordinato su PROD.
**Serve una tua azione:** sì — eseguire la checklist click §10 e annotare eventuali anomalie.

## 2. Cosa è stato fatto

1. Verificato che il lavoro S4 sia integrato nel branch corretto: worktree pulito iniziale, `env/test`
   allineato a `origin/env/test`, merge espliciti Traccia A e B presenti.
2. Verificato che non restino branch o worktree temporanei S4: nessun `s4/*` locale/remoto e un solo
   worktree. Restano soltanto branch preesistenti/non-S4 (`feature/console-super-admin` locale+remoto e
   `test/modelli-locali` solo remoto), non cancellati perché contengono cantieri distinti.
3. Completata la revisione DB in sola lettura sul TEST `docnnernvpyrbwuzzach`: progetto/link/host/org/status,
   registro migrazioni, colonne, default, indice e nomi logici delle migrazioni 063–065.
4. Eseguiti advisor DB: nessun finding collegato alle migrazioni S4. Restano warning preesistenti su
   funzioni/policy, bucket pubblico e protezione password; non corretti perché fuori scope.
5. Individuato che l'Edge TEST era ancora v28, precedente al commit S4. Dopo validazione verde è stata
   deployata `create-booking` v29 **solo su TEST** e verificata con smoke controllato.
6. Allineate le skill vive: stato S4 integrato, indice migrazioni fino a 065, schema snapshot/audit,
   Edge TEST v29 e residuo corretto (collaudo manuale → rollout PROD).

## 3. File toccati e perché

| File | Perché |
|---|---|
| `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` | Rimuove lo stato obsoleto “Traccia B design/in attesa d'integrazione” e registra integrazione + Edge TEST v29. |
| `docs/MASTERPLAN_SERVIZIO.md` | Segna le decisioni e i WP S4 come implementati su TEST; lascia aperti solo collaudo e PROD. |
| `docs/DATABASE.md` | Porta l'indice locale a 065 e la prossima numerazione a 066. |
| `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` | Registra 064/065 e la corrispondenza coi timestamp remoti TEST. |
| `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` | Registra colonne snapshot e audit introdotte da 064/065. |
| questo report | Traccia controlli, metodo, finding, azioni esterne e checklist utente. |

Nessun file applicativo è stato modificato in questa revisione. Azione esterna: deploy Edge
`create-booking` v29 sul solo progetto TEST.

## 4. Test eseguiti e risultato

| Controllo | Esito |
|---|---|
| `npm run validate` | ✅ lint + typecheck + suite Vitest, exit 0 |
| Test S4 inclusi nella suite | ✅ resolver occupazione, modalità tavoli, capienza, soft-delete sala, briefing, walk-in, append-only, 5 stati |
| `npm run validate:docs` | ⚠️ fallisce per 14 link già rotti nell'area Console, estranei al diff S4 |
| DB TEST 063–065 | ✅ nomi logici e DDL presenti; colonne/default/indice corrispondono ai file |
| Advisor sicurezza/performance | ✅ nessun finding S4; warning preesistenti fuori scope |
| Edge TEST | ✅ v29 ACTIVE, `verify_jwt=false` |
| Smoke Edge | ✅ `POST {}` → HTTP 400 controllato: `tenantSlug è obbligatorio` |

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `ADMIN_SERVIZIO_CONTEXT.md` | S4 integrata + Edge v29 | Era rimasto allo stato dei branch temporanei. |
| `MASTERPLAN_SERVIZIO.md` | WP S4 implementati | La sezione “Da costruire” contraddiceva lo stato integrato. |
| `DATABASE.md` | 064/065 + prossimo 066 | L'indice si fermava alla Traccia A. |
| `DB_MIGRATIONS_CONTEXT.md` | snapshot remoto completo S4 | Mancavano Traccia B e versioni timestamp. |
| `DB_SCHEMA_CONTEXT.md` | schema 064/065 | Mancavano snapshot occupazione e audit forzature. |

## 6. Dati comunicazione

- Richiesta sostanziale: controllare worktree/branch, completare la verifica DB interrotta, allineare lo
  skill system e consegnare un flusso click per testare.
- Vincolo esplicito precedente: tenere traccia di tutto il lavoro, comprese idee e metodo, nel report.
- Formato applicato: esito tecnico separato dalla checklist concreta per schermate.

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali: 2 (autorizzazione/tracciamento; revisione S4 completa).
- Correzioni richieste dopo prima risposta: 0.
- Follow-up generati: 1 operativo — collaudo manuale prima del rollout PROD.
- Modalità: deep coerente col perimetro multi-area Git + DB + Edge + skill.
- Metodo usato: partire dalle fonti verificabili (Git e piano), poi triangolare file SQL ↔ registro remoto
  ↔ schema reale ↔ tipi TypeScript; infine validare runtime Edge e documentazione viva.

## 8. La mia lettura della sessione

Il piano e i commit rendevano facile ricostruire l'integrazione, ma le skill erano state aggiornate in
momenti diversi dalle due tracce: per questo contenevano contemporaneamente uno stato corretto e uno
obsoleto. La verifica più affidabile non è stata fidarsi della numerazione mostrata da `migration list`,
ma correlare il `name` logico delle righe timestamp col DDL dei file e con lo schema effettivo.

Idea di processo da conservare: al merge finale di lavori paralleli serve un checkpoint unico che aggiorni
le fonti vive e verifichi anche la versione runtime dell'Edge. Il solo merge Git non dimostra che TEST stia
eseguendo la funzione appena integrata.

## 9. Derivazione errori

| Difficoltà | Causa | Soluzione / prevenzione |
|---|---|---|
| Skill S4 contraddittoria | vincolo di processo: ogni traccia aveva aggiornato la propria porzione prima del merge | Check documentale post-merge unico; corretto in questa sessione. |
| Migrazioni 063–065 senza numero remoto omonimo | anomalia storica del registro: applicazione via API con versione timestamp | Verifica per `name` logico + DDL + schema, non per sola colonna Local/Remote. |
| Edge TEST precedente al commit S4 | passo d'integrazione non completato | Deploy v29 su TEST dopo validate + smoke; controllare sempre versione/data runtime. |
| Prima query CLI inline fallita | limite/interpretazione CLI su SQL multilinea | File SQL temporaneo read-only, poi rimosso; nessun residuo nel worktree. |
| Primo `validate` scaduto a 120s | limite tecnico del comando, non errore test | Rilancio con timeout ampio; exit 0 in 39,8s. |
| `validate:docs` rosso | 14 link preesistenti area Console | Registrato senza scope creep; nessuno dei link è nei file S4 modificati. |

## 9-bis. Esito fase A1 — fix post-QA Servizio

Implementato il batch A1 isolato su `env/test`:

- contenitore mappa allineato alla larghezza sala con `max-width: 100%` e overflow interno;
- nome tavolo unico case-insensitive nel tenant, ignorando il record corrente in modifica;
- limite nome tavolo 10 caratteri, condiviso fra input e sagoma; testo nome/coperti ingrandito;
- coperti nuovo tavolo precompilati a 2;
- modifica diretta della sala selezionata, senza dropdown sopra la mappa;
- conferma elimina-sala con sole azioni Sì/No.

Test eseguiti: `servizioA1Fixes`, guard modali, stati `TableShape`, guard modalità tavoli e forma default:
**22/22 verdi**. `npm run typecheck` e `npm run lint` verdi. E2E `pro-service.spec.ts`: **2/2 verdi**,
inclusa verifica 375/834/1280; il locator delle fasce è stato circoscritto alla sezione corretta perché
`Modifica sala` rendeva ambiguo il vecchio locator globale. Nessuna modifica a DB, Edge, assegnazioni,
finestre, walk-in o D25.

Controreview Codex del 25-06-26: diff A1 approvato e rieseguiti `servizioA1Fixes`, `typecheck`, `lint`,
`validate` ed E2E `pro-service.spec.ts --workers=1`, tutti verdi. Note non bloccanti: unicità nome tavolo
solo client-side per rispettare il divieto A1 di DB; il test A1 emette warning React `act(...)` dalla guard
dirty, coerenti col rumore già presente in suite storiche.

## 9-ter. Esito fase A2 — coerenza dati Servizio

Implementato il batch A2 su `env/test`, senza nuove pagine Live, senza migrazioni, senza deploy e senza
scritture PROD.

Mini-design walk-in atomico usato: la mutation crea prima `booking_requests`, poi crea
`booking_table_assignments` per tavolo/fascia/data. Se manca la fascia, se `max_turns` è esaurito o se
l'insert assignment fallisce, il booking appena creato viene marcato `deleted` con motivo tecnico e le
query vengono invalidate. Questo evita lo stato visibile parziale senza introdurre RPC o migrazione; non è
una transazione DB nativa.

Fix inclusi:

- refresh Servizio al ritorno pagina: query assignment/unassigned refetch al mount + invalidazioni da
  `useBookingMutations`;
- prenotazioni accettate assegnabili indipendentemente da tipologia, menu, card scorrevole o carosello;
- rendering simultaneo di più assignment attivi sullo stesso tavolo;
- tavoli occupati visibili ma non assegnabili: nessuna sovrapposizione diretta senza liberazione separata;
- walk-in su tavolo libero visibile subito sul tavolo corretto con booking + assignment;
- stati tavolo aggiornati da clock runtime;
- briefing filtrato sulle fasce `service_slots` reali, anche overnight;
- D38 aggiunto come toggle avanzato default OFF (`table_mode_respects_slot_cap`): OFF usa capienza tavoli,
  ON applica anche il cap fascia usando il limite più basso.

Test A2 aggiunti/aggiornati: `walkIn.b2.test.tsx`, `useWalkInMutation.atomic.test.ts`,
`AssignmentMapPanel.5stati.test.tsx`, `useCapacityCheck.tableMode.test.ts`,
`useShiftBriefing.test.tsx`, `useTableStatuses.test.ts`, più mock di non regressione calendario/guard.

Validazione finale: `npm run validate` verde (lint + typecheck + suite Vitest). Rumore residuo: warning
React `act(...)` preesistenti in test storici, non bloccanti.

### Checklist A2 semplice

- Prepara 2 prenotazioni accettate nella stessa fascia: una con menu/card/carosello e una standard.
  Vai in **Servizio → Mappa**, scegli data+fascia: entrambe devono comparire da assegnare.
- Assegna due prenotazioni allo stesso tavolo in turni compatibili: sul tavolo devono vedersi entrambe,
  non solo la prima.
- Cambia pagina, crea/accetta una nuova prenotazione, torna in **Servizio** entro pochi minuti: deve
  apparire senza ricaricare il browser.
- Home → **Aggiungi walk-in**, scegli sala e tavolo libero nella fascia corrente: dopo il salvataggio il
  walk-in deve comparire sul tavolo; doppio click sul salva non deve creare stato incoerente.
- Nel walk-in prova un tavolo occupato: deve restare visibile ma non selezionabile; prima va liberato dal
  flusso separato.
- Lascia aperta la mappa nel cambio finestra temporale: lo stato deve aggiornarsi da solo entro circa 30s.
- Home → **Briefing turno**: prova `Tutti` e una fascia reale, inclusa eventuale notturna; devono uscire
  solo le prenotazioni di quella fascia.
- In **Servizio → Fasce**, lascia D38 OFF e verifica warning su capienza tavoli; attivalo e verifica che
  conti anche il cap fascia.

## 9-quater. QA manuale Matteo su A2 — 25-06-26

Esiti comunicati da Matteo dopo il collaudo su TEST:

| Punto | Esito | Lettura tecnica/prodotto |
|---|---|---|
| 1. Prenotazioni accettate assegnabili | ✅ Funziona | Il problema menu/card/carosello era legato al refresh/dati, non a un filtro tipologia. |
| 2. Seconda prenotazione sul tavolo | 🔴 Non ancora possibile | La UI disabilita i tavoli occupati. Serve flusso di **forzatura guidata** con alert, non solo liberazione separata. |
| 3. Refresh navigando nell'app | ✅ Funziona | Refetch al mount valido: tornando in Servizio la lista è aggiornata. |
| 3/6. Due schede aperte | 🔴 Non aggiorna | A2 non copre polling/realtime/cross-tab. Serve aggiornamento periodico o invalidazione fra tab per pannello operativo. |
| 4/5. Walk-in su tavolo libero | ✅ Funziona | Booking + assignment sono coerenti. |
| 4/5. Walk-in su tavolo occupato | 🔴 Da cambiare | Matteo vuole poter forzare con procedura chiara: avviso che indica sostituzione/liberazione della prenotazione in corso. |
| 4/5. Messaggio walk-in | 🟡 Da identificare | Matteo segnala un messaggio dentro il form troppo rapido da leggere. Il messaggio esatto non è ancora identificato: va riprodotto in UI prima di correggere copy/durata/posizione. |
| 7. Briefing per fascia | 🟡 Filtro corretto | Mostra le prenotazioni della fascia giusta. |
| 7. Orario briefing | 🔴 Bug timezone | Orari mostrati +2h: 03:00→05:00, 21:00→23:00. Correggere rendering/parsing orario briefing. |
| 8. D38 | Da collaudare | OFF deve usare solo capienza tavoli; ON deve usare il limite più basso fra capienza tavoli e cap fascia. |

Decisione aggiornata: il precedente vincolo A2 “tavoli occupati visibili ma non assegnabili finché non uso
liberazione separata” non è più sufficiente per Matteo. Il prossimo fix deve introdurre una forzatura con
alert esplicito e tracciamento dell'impatto, senza cancellare storico.

Checklist D38 per Matteo:

1. Prepara una fascia con cap basso, per esempio **Cena max 6 coperti**, e tavoli totali più alti, per
   esempio **10 coperti fisici**.
2. Lascia il toggle avanzato D38 **OFF**.
3. Inserisci/accetta prenotazioni o walk-in fino a 7-8 coperti nella fascia: il sistema deve ragionare sui
   10 coperti dei tavoli, quindi non deve avvisare solo perché hai superato 6.
4. Attiva D38 in **Servizio → Fasce**.
5. Ripeti lo stesso scenario: ora a 7 coperti deve comparire l'avviso perché il limite effettivo diventa
   `min(10 tavoli, 6 fascia) = 6`.
6. Controprova: se cap fascia è più alto dei tavoli, per esempio 20, il limite resta la capienza tavoli.

## 10. Checklist click — collaudo manuale S4 su TEST

Eseguire con un'azienda **Pro** sul TEST, prima desktop 1280 px, poi ripetere i punti UI principali a
834 px e 375 px. Tenere aperta la console browser: nessun errore rosso bloccante.

> **QA Matteo, aggiornamento 24-06-26:** eseguita finora **solo la pagina Servizio da mobile**.
> Le caselle `[x]` e le note inline sotto registrano quel collaudo visivo; desktop/tablet, account
> Classic e le superfici Calendario/Prenota restano da verificare dopo i fix. I finding sono trasformati
> in fasi esecutive in [`S4_FIX_PLAN.md`](S4_FIX_PLAN.md).

### A. Avvio e modalità tavoli

- [x] Login admin TEST → sidebar → **Servizio**: la pagina apre senza errori.
- [x] Azienda Pro senza tavoli: compare l'invito a passare a **Mappa** e creare la prima sala; la mappa
  assegnazioni non appare vuota/rotta.
- [x] Click **Mappa** → **Nuova sala** → inserisci nome e dimensioni → salva: la sala compare. ( fix : il riquadro della sezione, che contiene la mappa della nuova sala, non si dimensiona in base alle dimensioni impostate della sala. fixare in modo da mostrare mappa e sua sezione che la contiene delle stesse dimensioni : " DOM Path: div#root > div.flex h-dvh overflow-hidden bg-(--color-bg) > main.flex min-h-0 flex-1 flex-col overflow-y-auto pl-16 > div.flex flex-col > div.min-h-0 flex-1 bg-(--color-bg) px-4 py-5 md:px-6 md:py-7 > div.mx-auto max-w-7xl .pace-y-6 > div.pace-y-4 > div.pace-y-3 > div.overflow-auto rounded-xl border border-(--color-border) .hadow-.m
Position: top=319px, left=88px, width=957px, height=603px
React Component: TableMap
HTML Element: <div class="overflow-auto rounded-xl border border-(--color-border) shadow-sm" data-cursor-element-id="cursor-el-1">1 2p 10 2p 11 2p 2 2p 3 2p 4 2p 5 2p 6 2p 7 2p 8 2p 9 2p</div> DOM Path: div#root > div.flex h-dvh overflow-hidden bg-(--color-bg) > main.flex min-h-0 flex-1 flex-col overflow-y-auto pl-16 > div.flex flex-col > div.min-h-0 flex-1 bg-(--color-bg) px-4 py-5 md:px-6 md:py-7 > div.mx-auto max-w-7xl .pace-y-6 > div.pace-y-4 > div.pace-y-3 > div.overflow-auto rounded-xl border border-(--color-border) .hadow-.m > div
Position: top=321px, left=89px, width=800px, height=600px "
" React Component: TableMap
HTML Element: <div style="width: 800px; height: 600px; position: relative; background-image: linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent …" data-cursor-element-id="cursor-el-94">1 2p 10 2p 11 2p 2 2p 3 2p 4 2p 5 2p 6 2p 7 2p 8 2p 9 2p</div>  ) "
- [x] Click **Lista** → **Aggiungi tavolo** → compila nome, coperti e sala → **Aggiungi**: il nuovo tavolo
  deve apparire quadrato. Modifica e salvataggio non devono cambiare i tavoli preesistenti.  ( fix : nuovi tavoli devono avere nome diverso da tavoli ga inseriti) ( fix : quando apro modal nuovo tavolo, il numero coperti di default deve essere gia impostato a 2 , e se voglio lo cambio o salvo con default gia impostato, velocizzando compilazione base)
  (fix : ingrandire testo nome tavolo e numero coperti dentro a tavolo nella vista mappa, senza rompere UI e cappando limite nome tavolo per non rompere design.)

### B. Assegnazione, finestre e stati

- [x] Prepara due prenotazioni accettate nello stesso servizio, una vicina all'ora corrente e una futura.
- [x] **Servizio → Mappa**: trascina/assegna una prenotazione dal cassetto al tavolo; deve sparire dai “da
  assegnare” e comparire sul tavolo. (fix: se creo una prenotazione con una tipologia che ha menu abbinato, non la vedo in assegnazione tavoli in pagina servizio. assicurarsi che veda ogni tipo di tipologia e card scorrevoli selezionate o tipologia e carosello. dal momento che cliente prenota e viene accettato da sistema, a prescindere da cosa abbia scelto deve essere mostrato per essere assegnato ad un tavolo.) ( Fix : nel dropdown della casella "  DOM Path: div#root > div.flex h-dvh overflow-hidden bg-(--color-bg) > main.flex min-h-0 flex-1 flex-col overflow-y-auto pl-16 > div.flex flex-col > div.min-h-0 flex-1 bg-(--color-bg) px-4 py-5 md:px-6 md:py-7 > div.mx-auto max-w-7xl .pace-y-6 > div.pace-y-4 > div.pace-y-4 rounded-xl border border-(--color-border) bg-.urface p-4 .hadow-.m > div.flex flex-wrap gap-3 > div.pace-y-1[1] > select#assign-slot
Position: top=638px, left=270px, width=208px, height=36px
React Component: AssignmentMapPanel
HTML Element: <select id="assign-slot" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500" data-cursor-element-id="cursor-el-342" style="">— Seleziona fascia — Colazione (07:00–11:30) Pranzo (11:31–15:30) Aperitivo (16:30–19:30) Cena (19:31–22:30) Notturna (23:00–04:00)</select>  " mostrare N di prenotazioni da assegnare per ogni fascia oraria. ) ( fix: quando trascino una prenotazione su un tavolo, mostrare manina che tiene con  piccolo badge che dice nome e coperti della prenotazione che sto trascinando, per ricordare a utente cosa sta assegnando mentre trascina)
(Fix: quando assegno prenotazione al tavolo , possibilità di annullare azione con un pulsante " annulla" che compare nell'area delle prenotazioni di assegnare con la prenotazione appena assegnat, opaca con il pulsante annulla sopra. se utente è sicuro può cliccare spunta per confermare assegnazione e prenotazione opaca per annullare azione sparisce.)
(fix : se inserisco nuove prenotazioni e torno su pagina servizio non si è attivato refresh e non vedo nuove prenotazioni. integrare refresh al cambio di pagina di cliente in generale.)
(fix: se assegno due prenotazioni a un tavolo app lo fa fare ma non vedo doppia assegnazione sul tavolo, vedo solo la prima in arrivo. se libero il tavolo vedo correttamente anche la seconda assegnata)
(considerare questo fix se non va in conflitto con vista servizio che al momento ancora non vedo da nessuna parte : la mappa con i tavoli creati, deve avere 2 viste : 1 vista modifica = come è ora con griglia e CRDU per generare eliminare e modificare tavoli.
Vista 2 = sala confermata e salvata senzza griglia , che mostra per ogni tavolo chi lo occupa al momento , e gli stati tavolo in modo da vederli)
- [ ] Controlla i colori/legenda nei momenti o dati predisposti: **In arrivo**, **Occupato**, **In ritardo**,
  **In uscita**, poi **Libero** fuori finestra. Il tavolo deve liberarsi per disponibilità alla fine di
  durata+buffer anche senza cancellare lo storico. ( Fix i tavoli non cambiano di stato in automatico, vedo solo badge in arrivo, e non so come cambiare io lo stato del tavolo (dobbiamo ancora fare pagina live?))
- [ ] Prova ad assegnare oltre i turni/finestra: compare l'avviso; **Annulla** non assegna, **Assegna ( non so come replicare questo test poichè posso assegnare un tavolo solo nella fascia oraria in cui rientra la prenotazione. e non vedo possibilità di scegliere il turno del tavolo.)
  comunque** procede e conserva la forzatura.
- [x] Su tavolo assegnato click **Libera tavolo** → conferma **Liberare?**: la prenotazione torna nel
  cassetto; ricaricando la pagina non deve riapparire come assegnazione attiva.

### C. Walk-in

- [ ] Home admin → **Aggiungi walk-in** → inserisci coperti, sala e tavolo libero → **Aggiungi walk-in**:
  il tavolo diventa occupato e i coperti incidono sulla capienza.  ( fix : posso inserire walkin ma non lo vedo assegnato al tavolo in assegnazione tavoli. vedo il walkin solo se lo assegno a un tavolo gia occupato, e poi libero il tavolo, allora walkin compare nelle prenotazioni da assegnare.)
- [ ] Seleziona un tavolo già occupato: deve essere selezionabile ma mostrare avviso morbido; primo click
  prepara la forzatura, secondo click conferma ( fix : assicurarsi che in questo caso utente sappia che sta sostituendo una prenotazione che risulta ancora presente, con una nuova, e che questo azione comporterà sostituzione delle prenotazioni). ( fix : mi fa scegliere anche tavoli occupati o occupati a breve = errore deve calcolare tavolo LIBERO.)
- [ ] Supera la capienza della fascia: stesso comportamento morbido, mai blocco definitivo. ( fix : nessun blocco se supero limite fasce orarie)
- [] Crea un walk-in “solo coperti” dove previsto: deve ridurre comunque la capienza residua. ( io ho eseguito questo test, non so se è corretto : creato walkin e il conteggio in pagia calendario della fascia oraria corrispondente, vede correttamente walkin e lo conta nel tasso di occupazione della fascia oraria e nel limite coperti.)

### D. Sala morbida e briefing

- [x] Crea una sala senza prenotazioni attive → **Mappa → Modifica sale → sala → Elimina sala →
  Eliminare?**: deve sparire senza avviso d'impatto aggiuntivo. ( fix : pulsante modifica sale, apre il dropdown sotto a mappa, nascondendo la vista selezione. rifare pulsante modifica, per modificare SOLO la sala selezionata, invece di dropdown scelta sala.)
- [x] Su una sala con prenotazione assegnata ripeti **Elimina sala**: compare il numero di prenotazioni che
  torneranno da assegnare; **Annulla** conserva tutto, conferma archivia la sala e rimette le prenotazioni
  nel cassetto. Ricarica e verifica che la sala non torni. ( fix : vengono mostrati pulsante Annulla e Salva . sbaliato non servono. mantenere solo conferma o no come gia mostrato con avviso per utente per assicurarsi che sappia cosa fa.)
- [x] Home → **Briefing pre-turno**: con una sola sala mostra solo `Tavolo`; con più sale mostra
  `Sala · Tavolo`; non assegnata mostra `—`. **Stampa** e **Scarica PDF** devono restare utilizzabili. ( fix : funziona ma solo con vista " Tutti" se seleziono fascia oraria ( al momento vedo hardcodato pranzo e cena non reali fasce orarie SOLO quelle con prenotazioni attive) con prenotazioni vedo lista vuota.)

### E. Non regressione e responsive

- [ ] Account Classic: Calendario/Prenotazioni continuano a funzionare e il motore tavoli Pro non compare. ( Fix  : calcoliamo occupazione per fascia oraria in vista prenotazioni del giorno, per mostrare tasso occupazione anche se non è impostato un limite per OGNI fascia oraria ( quel vincolo rimane per card giorno del calendario in vista mensile calendario per tasso COMPLESSIVO di occupazione) e anche se non ho spuntato la checkbox per attivare il limite coperti per fascia oraria che vale per pagina prenota. )
- [x] Pagina Prenota TEST: completa una richiesta valida; nessun errore generico Edge. Ripeti un caso fascia
  piena/chiusa e verifica un messaggio controllato, non schermata rotta. ( fix : se clicco " form pubblico" in tab prenotazioni , si aprono 2 pagina prenota cliente.  )  (fix , dobbiamo invertire ordine di compilazione caselle modal prenotazione pagina prenota, in modo da seguire la validazione e il controllo del guard sul moda. : 1 . data - 2 N ospiti - 3 Orario , vincolando utente a compilare in questo oridne limitiamo messaggi di errore da dover mostrare e diamo scelte possibili coerenti a quello che abbiamo salvato nel sistema.)
- [ ] A 375/834/1280 px: modali sala/tavolo/walk-in/briefing leggibili, bottoni raggiungibili, nessun overflow;
  a mobile la mappa resta consultabile senza drag accidentale. (fix : da mobile non mostriamo mappa sala e editor. limitiamo la vista a assegnazione tavoli e lista tavoli. )
  (fix : dobbiamo integrare possibilità di assegnare una prenotazione ad un tavolo anche tramite click, non solo tramite drag & drop : utente clicca la prenotazione da assegnare su tasto assegna , si apre rapido modal di compilazione per sala e tavolo che calcola live stato tavoli se possible farlo.)

**Esito B0 esecuzione Codex (25-06-26):**
- Calendario: fix confermato e implementato. Vista Giorno Pro mostra occupazione per fascia usando capienza tavoli attivi anche senza limite pubblico per-fascia; badge Mese resta separato e continua a mostrare % solo con `slot_limit_enabled` ON e cap per tutte le fasce.
- Pagina Prenota da admin: fix confermato e implementato. Il pulsante **Form Pubblico** usa un lock breve sul click e apre una sola scheda anche con doppio click ravvicinato.
- Ordine Data → Ospiti → Orario: diagnosi aperta. Il report dice "pagina prenota" e il form pubblico oggi mostra Ora → Ospiti → Data; anche il form admin ha campi simili. Non toccato nessun LOCK finché Matteo non conferma la superficie.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «si autorizzo ma tieni traccia di tutto il lavoro svolto. traccia ogni idea e metodo nel tuo report a fine lavoro»; «agenti hanno completato il plan S4_PLAN.md… controlla stato worktree… dammi checklist con flusso click… finisci anche di allineare lo skill system…».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì: log/branch/worktree Git, diff da inizio S4, file 063–065, schema remoto, registro `schema_migrations`, tipi `database.ts`, versione Edge v28→v29, smoke HTTP e diff documentale.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Verificati e allineati ADMIN_SERVIZIO_CONTEXT, MASTERPLAN_SERVIZIO, DATABASE, DB_MIGRATIONS_CONTEXT e DB_SCHEMA_CONTEXT; verificati senza modifica database.ts, migrazioni 063–065 e test S4 inclusi in validate.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho eseguito il collaudo click con credenziali/dati dell'azienda di Matteo e non ho toccato PROD. Non ho corretto i 14 link docs dell'area Console né i warning advisor preesistenti perché fuori scope.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Le due tracce hanno lasciato stati documentali temporalmente diversi; aggiungerei al piano parallelo un gate post-merge obbligatorio “runtime Edge + DB per nome logico + skill senza riferimenti ai branch chiusi”.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Il contesto era ampio ma necessario per un task Git+DB+Edge; routing e checklist TEST sono stati utili. La duplicazione temporanea tra masterplan e context Servizio ha prodotto rumore e ha richiesto confronto col runtime.

## 12. Self-review del report

- [x] Numeri e stati ri-verificati contro Git, CLI TEST e file reali.
- [x] Skill collegate aggiornate nella stessa sessione.
- [x] Q1–Q6 complete e coerenti.
- [x] Checklist espressa per schermate e click, con separazione chiara fra test automatici già verdi e QA manuale ancora da fare.
