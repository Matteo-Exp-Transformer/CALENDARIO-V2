# Report — fix giro a vuoto Prenota con preset asincroni — 05-08-26

**Cosa è cambiato:** la Pagina Prenota con due o più sotto-schede non entra più in un giro di render se il cliente seleziona una card mentre i preset del personale stanno ancora arrivando.
**Cosa resta:** il fix è verificato e committato localmente in `3b4b287`, ma non è stato pubblicato né provato manualmente da Matteo; il piano generale può riprendere e questo specifico cancello multi-sotto-scheda non resta aperto.
**Serve una tua azione:** sì, solo un controllo visivo rapido nella Pagina Prenota seguendo la checklist finale; non servono database, migrazioni o operazioni PROD.

## 1. Cosa è stato fatto

1. Ho verificato subito che la sessione fosse su `env/test` e che il collegamento locale Supabase puntasse a `docnnernvpyrbwuzzach`.
2. Ho caricato il routing, la skill Prenota e la skill Testing prima di leggere il flusso. Ho poi ricostruito il percorso completo: configurazione pubblica, tipologie, preset, sotto-schede, fasce/orari e propagazione della selezione al contenitore della pagina.
3. Sono partito dallo scenario browser esistente `toggle disponibilità e propagazione QR`, riutilizzando il suo seed reale con due sotto-schede. Non sono state inviate prenotazioni.
4. Ho aggiunto una prova diagnostica controllabile che:
   - trattiene una risposta precisa, senza ritardi casuali;
   - seleziona davvero una tipologia e le sue due sotto-schede;
   - registra azioni, console, richieste e risposte in un allegato JSON della trace;
   - conserva screenshot, contesto errore e trace in cartelle distinte.
5. Ho provato per prima l'ipotesi ereditata sugli slot: trattenendo `get_public_slot_config` fino a dopo il click sulla sotto-scheda, la prova è rimasta verde. Quella condizione non riproduce il difetto.
6. Trattenendo invece `booking_custom_staff_presets`, lasciando arrivare configurazione form, menu, slot e capienza, la prova è fallita 5 volte su 5 prima di qualsiasi fix.
7. Ho ridotto lo stesso difetto a un test di componente: il contenitore conserva l'oggetto sotto-scheda ricevuto, mentre i preset risultano ancora in caricamento. Prima del fix la callback superava 20 chiamate e il test si fermava con un errore esplicito.
8. Solo dopo la doppia prova rossa ho applicato il fix minimo: il valore vuoto dei preset durante il caricamento ora mantiene la stessa identità fra i render.
9. Ho rafforzato la prova browser con cambio rapido tipologia → sotto-scheda A → altra tipologia → ritorno → A/B/A, su desktop, telefono e tablet, includendo aggiornamento completo dove richiesto.
10. Ho allineato i contesti Prenota e l'indice dei test, poi ho eseguito suite completa, build e controllo dei diff.

## 2. Riproduzione deterministica e artefatti

### Matrice prima del fix

| Condizione controllata | Viewport | Ripetizioni | Esito | Evidenza |
|---|---:|---:|---|---|
| Scenario originale, pagina fredda | desktop | 1 | verde | baseline: il seed da solo non basta a forzare la finestra temporale |
| `get_public_slot_config` trattenuta fino al click sotto-scheda | desktop | 1 | verde | esclusa la precedente ipotesi `rawSlots → slots → gruppi → onChange` in questa condizione ripetibile |
| `booking_custom_staff_presets` trattenuta; resto dei dati libero di arrivare | desktop | 1 | rosso | 10 avvisi `Maximum update depth exceeded` in circa 1,5 secondi |
| Stessa prova preset trattenuti | desktop | 5 | **rosso 5/5** | conteggi avvisi: **9, 10, 10, 11, 11** |
| Harness di componente con preset pending e contenitore che conserva l'oggetto sotto-scheda | jsdom | 1 | rosso | oltre 20 chiamate a `onActiveSubTabChange` |

### Sequenza esatta che innescava il ciclo

Nella prima trace diagnostica:

1. la richiesta preset viene trattenuta;
2. la configurazione form risponde a circa 2059 ms;
3. la richiesta preset risulta trattenuta a circa 2113 ms;
4. menu e configurazione slot rispondono a circa 2220–2232 ms;
5. viene selezionata la tipologia Menu a circa 2280 ms;
6. la capienza risponde a circa 2334 ms;
7. viene selezionata la sotto-scheda a circa 2346 ms;
8. entro circa 3873 ms compaiono 10 avvisi di profondità massima;
9. solo dopo, a circa 3950 ms, la risposta preset viene rilasciata e ricevuta.

Durante il giro non risultano richieste ripetute: il ciclo era interamente nello stato React del browser.

### Artefatti conservati

- `test-results/prenota-loop-held-staff-presets-desktop-pre-fix-01`
- `test-results/prenota-loop-held-staff-presets-desktop-pre-fix-5x`
- `test-results/prenota-loop-rapid-mode-subtabs-desktop-post-fix-10x`
- `test-results/admin-menu-magazzino-prenota-loop-final-full`
- `test-results/prenota-loop-final-code-post-fix`

Ogni fallimento pre-fix contiene `trace.zip`, screenshot ed `error-context.md`; la trace contiene anche l'allegato diagnostico JSON con console, richieste, risposte e azioni.

## 3. Causa dimostrata riga per riga

Il percorso causale era questo:

1. Durante il caricamento, la destructuring `data: customStaffPresets = []` creava un **nuovo array vuoto a ogni render**.
2. `activeModeSubTabs` dipende da `customStaffPresets`, quindi il suo `useMemo` veniva ricalcolato a ogni render.
3. Il resolver delle sotto-schede produceva nuovi oggetti sotto-scheda.
4. Dopo la selezione, `activeSubTab` diventava quindi un nuovo oggetto a ogni render, anche se il suo `id` non cambiava.
5. L'effetto `onActiveSubTabChange?.(activeSubTab)` consegnava ogni volta quell'oggetto nuovo al contenitore.
6. `BookingRequestPage` usa `setActiveSubTab` come callback: conservare un nuovo oggetto provocava un nuovo render del contenitore e del form.
7. Il nuovo render ricreava `[]`, poi gli oggetti sotto-scheda, e il ciclo ripartiva.

La correzione introduce un solo array vuoto stabile a livello di modulo e lo usa come fallback mentre i preset non hanno ancora `data`. Non sono stati modificati:

- `useArrivalSlots`;
- calcolo o raggruppamento degli orari;
- dipendenze degli effetti;
- comportamento di submit;
- formato strutturale delle sotto-schede;
- query o tempi di caricamento.

## 4. Verifiche dopo il fix

| Prova | Ripetizioni | Esito |
|---|---:|---|
| Regressione componente preset pending | 1 | verde |
| File completo `BookingRequestForm.flussoUtente.test.tsx` | 8 | **8/8 verdi** |
| Browser: cambi rapidi tipologia e A/B/A con preset trattenuti | 10 | **10/10 verdi** |
| Browser: telefono con aggiornamento completo | 1 definitiva, oltre a 3 esplorative | verdi |
| Browser: tablet con aggiornamento completo | 1 definitiva, oltre a 3 esplorative | verdi |
| Spec browser completa: regressione + scenario originale desktop/telefono/tablet | 4 | **4/4 verdi**, un solo processo |
| Typecheck rigoroso della spec E2E | 1 | verde |
| `npm run validate` | 1 | verde: lint, typecheck e suite completa |
| `npm run build` | 1 | verde |
| `npm run validate:docs` dopo il nuovo report | 1 | rosso per 14 path già rotti, tutti in `docs/Console-Skill/**`; nessun errore punta ai file di questa sessione |
| `git diff --check` | 1 prima della chiusura | verde |

La build mantiene soltanto avvisi già esistenti relativi a selettore CSS generato, import Supabase misto e chunk oltre 500 kB; nessuno blocca la build e nessuno deriva dal fix.

Nel corso della diagnosi sono stati eseguiti 47 casi browser: 2 controlli verdi pre-fix, 6 fallimenti intenzionali pre-fix e 39 casi verdi post-fix nelle varie iterazioni. La prova definitiva richiesta è quella rossa 5/5 prima e verde 10/10 dopo.

## 5. File toccati e perché

| File | Perché |
|---|---|
| `src/features/booking/components/BookingRequestForm.tsx` | rende stabile il fallback vuoto dei preset durante il caricamento; è l'unica modifica al comportamento applicativo |
| `src/features/booking/components/__tests__/BookingRequestForm.flussoUtente.test.tsx` | riproduce il ciclo nel contenitore React e impedisce la regressione |
| `e2e/admin-menu-magazzino-blindatura.spec.ts` | riproduzione browser deterministica con due sotto-schede reali, trace diagnostica e cambi rapidi controllati |
| `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` | documenta il vincolo di identità stabile durante i caricamenti asincroni e la causa del ciclo |
| `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` | allinea il flusso delle card sotto-scheda alla correzione |
| `docs/Prenota-Skill/contesto/PRENOTA_TEST_SUITE_INDEX.md` | indicizza la nuova regressione browser e quella di componente, con i comandi corretti |
| `docs/Sessioni di lavoro/05-08-26/Report-fix-giro-vuoto-prenota-preset-async-05-08-26.md` | conserva diagnosi, matrice, prove e passaggio di consegne |
| `docs/SESSION_LOG.md` | aggiunge la sessione all'indice cronologico |

I lavori preesistenti su login, legale e codice morto sono rimasti fuori dal perimetro e non sono stati modificati in questa sessione.

## 6. File di skill aggiornati

| file | modifica | perché |
|---|---|---|
| `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` | aggiunto LOCK sul fallback stabile dei dati asincroni e sulla regressione | il difetto nasce nel flusso dati Prenota |
| `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` | annotato il comportamento delle card mentre i preset sono pending | mantiene coerente la descrizione della schermata |
| `docs/Prenota-Skill/contesto/PRENOTA_TEST_SUITE_INDEX.md` | aggiunti test e comando E2E | rende ritrovabile il cancello automatico |
| `docs/SESSION_LOG.md` | aggiunta riga della sessione | indicizzazione obbligatoria del report |
| `docs/Sessioni di lavoro/05-08-26/Report-fix-giro-vuoto-prenota-preset-async-05-08-26.md` | nuovo report deep | chiusura e handoff verificabile |

Non sono state cambiate regole generali, vocabolario, routing o skill master: i tre contesti d'area coprivano già il punto corretto.

## 7. Dati comunicazione

### Richieste ricorrenti di Matteo

- Dimostrare il difetto prima di correggerlo: 4 richiami espliciti nello stesso prompt, fra mandato, regola dura, soglia 5/5 e divieto di fix prudenziali.
- Proteggere ambiente e lavori paralleli: 6 vincoli espliciti fra branch TEST, project ref, niente PROD, niente migrazioni, preservare il worktree e niente commit/push.
- Usare prove browser ripetibili e conservare gli artefatti: 7 indicazioni operative fra seed esistente, ritardi controllati, trace, console, richieste, azioni e stato dati.
- Verificare la correzione su più viewport e ripetizioni: 4 condizioni principali, cioè desktop, telefono, tablet e aggiornamento completo.
- Comunicare per effetto concreto e chiudere con checklist semplice: 2 richieste esplicite.

### Formato di comunicazione usato

L'aggiornamento intermedio ha prima separato ciò che era escluso da ciò che era dimostrato: la risposta slot trattenuta non causava il ciclo, mentre i preset trattenuti lo causavano. Questo formato è stato utile perché evita di presentare un'ipotesi tecnica come causa già acquisita.

La consegna finale usa tre livelli:

1. esito utente;
2. prova numerica prima/dopo;
3. checklist della schermata da aprire.

### Cosa si può automatizzare con certezza

- trattenere una specifica risposta e rilasciarla dopo una sequenza identificabile;
- catturare warning React, richieste e azioni dentro la trace;
- ripetere lo stesso scenario 5 o 10 volte;
- eseguire la stessa sequenza su viewport note e con reload completo;
- bloccare la regressione sia a livello componente sia browser.

Resta manuale il controllo percettivo di Matteo sulla fluidità della schermata reale e l'eventuale decisione di push/release.

## 8. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali di Matteo: **2** — diagnosi/fix e successiva richiesta di commit con handoff reale.
- Correzioni di Matteo dopo la prima risposta: **0**.
- Follow-up richiesti da Matteo: **1**, chiuso nella stessa sessione; follow-up generati dall'agente: **0**.
- Modalità alzata: **sì, deep/senior**, per rischio, vincolo prova-prima-del-fix e quantità di artefatti.
- Sub-agent usati: **0**; tutte le letture, la diagnosi e le esecuzioni Playwright sono state svolte direttamente.

Il prompt è stato molto efficace perché specificava ambiente, vincoli di mutazione, soglia quantitativa di riproduzione, prova browser di partenza, condizioni da variare, artefatti da conservare e condizione di uscita se il difetto non fosse stato riprodotto. L'unica parte volutamente aperta era quale risposta asincrona causasse davvero il ciclo: era corretto lasciarla aperta, perché costituiva l'oggetto della diagnosi.

Da replicare: indicare sempre una prova di partenza, una soglia numerica pre/post e un divieto esplicito di fix finché la prova non è rossa. Da migliorare solo marginalmente: distinguere nel prompt fra “test di esclusione” e “test candidato alla riproduzione”, così è ancora più immediato capire che una singola esecuzione verde serve a scartare una pista, non a certificare l'assenza assoluta del bug.

## 9. La mia lettura della sessione

### Impressioni

Il routing ha portato ai contesti giusti senza bisogno di navigare a tappeto. Il vincolo di non toccare il codice prima della prova ha migliorato concretamente il risultato: l'ipotesi ereditata sugli slot sembrava plausibile, ma il controllo deterministico l'ha smentita prima che producesse un fix inutile.

La combinazione di prova browser reale e riduzione a test di componente è stata particolarmente efficace. La trace ha dimostrato il contesto asincrono reale; il test di componente ha reso leggibile e veloce il meccanismo del ciclo.

### Difficoltà e soluzione

- Il difetto non compariva nello scenario originale a velocità normale. Ho separato le risposte necessarie e introdotto gate deterministici uno alla volta.
- La prima versione del test di componente conservava soltanto l'ID della sotto-scheda e quindi non riproduceva la semantica vera del contenitore. Ho corretto il harness perché conservasse l'oggetto ricevuto, ottenendo il rosso prima del fix.
- L'output della suite completa era molto esteso e veniva troncato dal terminale, ma i processi hanno restituito exit code 0; ho evitato di riportare un conteggio totale non direttamente visibile.
- Un'applicazione patch sul contesto layout non ha trovato il punto per differenze di contesto; ho riaperto il tratto esatto e applicato una patch puntuale.
- Il controllo aggiuntivo `validate:docs` è rosso su 14 riferimenti preesistenti della skill Console; l'elenco non contiene Prenota, questo report o `SESSION_LOG`, quindi ho registrato l'esito senza allargare il perimetro.

### Miglioria suggerita allo skill system

Per le diagnosi di loop React sarebbe utile un piccolo modello documentale riusabile con quattro campi obbligatori: dato trattenuto, azione che innesca, identità che cambia, aggiornamento di stato che richiude il ciclo. Non propongo di trasformarlo ora in regola: è un dato per una futura sessione Meta.

## 10. Derivazione errori

| Evento | Classificazione | Derivazione | Come evitarlo o come è stato risolto |
|---|---|---|---|
| Giro di render quando i preset sono pending | bug preesistente | fallback `[]` creato nel render del form, poi propagazione dell'oggetto sotto-scheda al contenitore | fallback stabile a livello modulo + doppia regressione automatica |
| Ipotesi `rawSlots → slots → gruppi → onChange` | ipotesi ereditata, non errore agente | riportata negli handoff come pista, non come diagnosi | test controllato con slot config trattenuta; pista esclusa prima del fix |
| Prima versione del harness conservava solo l'ID | errore agente nel test diagnostico | non rappresentava il comportamento reale di `BookingRequestPage`, che conserva l'oggetto | corretto prima di modificare il codice; il test è diventato rosso a comando |
| Prima patch al contesto layout non applicata | attrito operativo minore | contesto testuale diverso da quello atteso | riapertura del paragrafo e patch puntuale, senza modifiche collaterali |
| Output finale Vitest troncato | vincolo strutturale del terminale | volume della suite completa | usato l'exit code di `npm run validate`; nessun numero totale inventato |
| `validate:docs` segnala 14 path Console | debito preesistente fuori perimetro | riferimenti abbreviati o file mancanti sotto `docs/Console-Skill/**` | esito registrato; nessun fix perché il mandato vieta di toccare lavori disgiunti |

Non emerge un pattern di errore ricorrente da aggiungere a `ERRORI_PROCESSO.md`: l'unico errore agente è stato corretto durante la costruzione della prova, prima del fix, e non ha alterato il risultato.

## 11. Cosa resta per la prossima sessione

- Matteo può fare lo smoke visivo descritto nella checklist finale.
- Il codice è committato localmente in `3b4b287`; documentazione e handoff sono nel commit conclusivo della sessione. Nessun push o release.
- Il piano generale può riprendere anche sul flusso Prenota: per questo specifico giro a vuoto, il cancello con due o più sotto-schede è chiuso da prove automatiche.
- Restano distinti e invariati i follow-up Prenota già presenti in `docs/FOLLOW_UP.md`, fra cui testo responsive delle card e cancellazione dell'errore dopo selezione; nessuno descrive questo giro a vuoto, quindi non è stata aggiunta o chiusa una riga FU.
- Nessuna migrazione, nessuna scrittura PROD e nessun allineamento database richiesto.

## 12. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1:

> Sei l’agente senior che prosegue CalendarBackup-v2.
>
> DECISIONE DI PRIORITÀ:
> prima di riprendere il piano generale, dedica questa sessione al giro a vuoto della pagina Prenota.
> Non blocca eventuali lavori completamente disgiunti, ma impedisce di dichiarare chiuso e pronto per
> la produzione il flusso con due o più sotto-schede.
>
> STATO DA LEGGERE PRIMA DI AGIRE:
> @docs/Sessioni di lavoro/05-08-26/Report-fix-logout-legale-codice-morto-handoff-prenota-05-08-26.md
> @docs/Sessioni di lavoro/05-08-26/Report-rossi-parallelismo-mezzanotte-fase3-05-08-26.md
> @docs/Sessioni di lavoro/05-08-26/PROMPT_FIX_LOOP_LOGOUT_LEGALE_CODICE_MORTO.md
>
> Segui il routing di AGENTS.md e carica integralmente la skill Prenota e la skill Testing prima di
> aprire i file dell’area.
>
> AMBIENTE:
> - verifica subito branch `env/test`;
> - verifica `supabase/.temp/project-ref = docnnernvpyrbwuzzach`;
> - nessuna scrittura su PROD `rwuxgvldzrkabglkasym`;
> - non servono migrazioni né operazioni sul database;
> - il worktree contiene già i lavori login, legale e codice morto: preservali e non modificarli.
>
> MANDATO UNICO:
> trovare una riproduzione deterministica del giro a vuoto che era comparso selezionando una
> sotto-scheda nella pagina Prenota e correggerlo soltanto dopo averlo dimostrato.
>
> REGOLA DURA:
> non modificare il comportamento di `useArrivalSlots`, `BookingRequestForm` o componenti collegati
> finché non possiedi una prova che fallisce a comando prima del fix. La precedente ipotesi
> `rawSlots → slots → gruppi → onChange` è soltanto un’ipotesi, non una diagnosi.
>
> METODO:
>
> 1. Leggi il codice vero del flusso e ricostruisci:
>    - caricamento configurazione pubblica;
>    - caricamento fasce e orari;
>    - selezione tipologia;
>    - comparsa e selezione delle sotto-schede;
>    - propagazione degli orari al form;
>    - effetti e callback che possono aggiornarsi a vicenda.
>
> 2. Parti dalla prova browser esistente:
>    `e2e/admin-menu-magazzino-blindatura.spec.ts`,
>    scenario `toggle disponibilità e propagazione QR`.
>    Il seed crea già due sotto-schede e le seleziona davvero.
>
> 3. Cerca di rendere il difetto deterministico variando in modo controllato:
>    - pagina fredda e aggiornamento completo;
>    - ordine e ritardo delle risposte necessarie al form;
>    - cache vuota e dati che arrivano in momenti diversi;
>    - cambio rapido fra tipologia e sotto-schede;
>    - formati desktop, telefono e tablet.
>
>    Non introdurre ritardi casuali. Ogni condizione deve essere ripetibile e identificabile.
>
> 4. Conserva per ogni fallimento:
>    - traccia browser;
>    - errori della console;
>    - richieste ripetute;
>    - sequenza precisa delle azioni;
>    - stato dei dati che innesca il ciclo.
>
> 5. Considera il difetto “riprodotto a comando” solo se la stessa prova fallisce almeno 5 volte su 5
>    prima della correzione.
>
> 6. Solo dopo la riproduzione:
>    - dimostra la causa riga per riga;
>    - applica il fix minimo;
>    - aggiungi una prova automatica che falliva prima;
>    - verifica almeno 10 ripetizioni verdi dopo il fix;
>    - esegui `npm run validate` e `npm run build`;
>    - aggiorna i documenti di contesto e l’indice test Prenota.
>
> PLAYWRIGHT:
> - tutte le esecuzioni browser le fai TU, mai i sub-agent;
> - la configurazione è già fissata a un solo processo: non modificarla;
> - non passare `--workers`;
> - usa cartelle di output diverse quando devi conservare gli artefatti;
> - non eseguire invii ripetuti di prenotazioni che possano attivare il blocco dell’indirizzo di rete.
>
> SUB-AGENT:
> puoi usarne al massimo due soltanto per letture indipendenti o controanalisi della causa. Non possono
> eseguire Playwright. Devi rileggere personalmente ogni loro conclusione e ogni diff riga per riga.
>
> SE NON RIESCI A RIPRODURRE:
> dopo un tempo ragionevole, fermati. Non applicare memo, confronti strutturali o modifiche alle
> dipendenze “per prudenza”. Scrivi un handoff con:
> - matrice completa delle condizioni provate;
> - artefatti conservati;
> - parti del flusso escluse;
> - ipotesi ancora aperte;
> - prossimo esperimento esatto.
>
> In quel caso dichiara chiaramente che il piano generale può proseguire soltanto sui lavori disgiunti,
> mentre il flusso Prenota con due o più sotto-schede resta aperto e non va dichiarato pronto per la
> produzione.
>
> REGOLE:
> - nessun commit o push;
> - nessuna migrazione;
> - mai usare Prettier;
> - non toccare i lavori login, legale e codice morto già presenti;
> - aggiorna Matteo dopo la lettura iniziale con ciò che hai trovato e la strategia di riproduzione,
>   poi lavora in autonomia;
> - alla fine consegna una checklist in italiano semplice di cosa aprire e osservare nell’app.
>
> fai commit lavoro svolto e assicurati che handoff sappia stato reale codice e dei lavori.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Ho riaperto il diff dei sei file di codice/test/contesto della sessione, verificato il fallback stabile nel form, la soglia di 20 chiamate nel test di componente, il titolo e i gate della prova E2E, i tre aggiornamenti ai contesti Prenota, le cartelle artefatti e gli esiti terminali di `validate` e `build`. Ho anche verificato che i 14 errori del controllo documentale aggiuntivo puntino soltanto a `docs/Console-Skill/**`. Ho evitato di attribuire alla suite completa un conteggio test non visibile nell'output troncato.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Sì: `BookingRequestForm.tsx`, il suo test flusso utente, la spec browser esistente, `PRENOTA_DATA_FLOW_CONTEXT.md`, `PRENOTA_LAYOUT_CONTEXT.md` e `PRENOTA_TEST_SUITE_INDEX.md`. Il tipo `CustomStaffPreset` esisteva già ed è stato soltanto importato; `BookingRequestPage.tsx` e `useArrivalSlots.ts` sono stati riletti ma non richiedevano modifiche.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho fatto QA manuale al posto di Matteo, push, release, migrazioni o scritture PROD. Ho committato il lavoro locale come richiesto nel follow-up, separando auth/retry, codice morto, Prenota e documentazione. Non ho inviato prenotazioni e non ho modificato `useArrivalSlots`, submit o dipendenze degli effetti. Non ho corretto i 14 path rotti della skill Console rilevati da `validate:docs`, perché sono preesistenti e fuori perimetro. Il mandato tecnico è completo perché esistono rosso 5/5 pre-fix, causa ridotta, fix minimo, verde 10/10 post-fix, viewport aggiuntive, suite completa e build verdi.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Il routing era corretto ma la diagnosi di loop non ha un formato dedicato; aggiungerei, in una futura sessione Meta, un template non prescrittivo “dato trattenuto → identità che cambia → callback → setState” per rendere più uniforme la raccolta delle prove senza suggerire fix prematuri.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Il contesto era ampio ma giusto per un task senior che attraversava Prenota, testing e un componente Admin Classic in LOCK. I vincoli di chiusura sono stati utili per non perdere matrice, artefatti, derivazione errori e allineamento dei contesti; nessun hook operativo ha introdotto rumore nel lavoro.

## 13. Self-review del report

- **Dati = diff reale:** verificati nomi, file, conteggi 5/5 e 10/10, warning pre-fix, comandi, exit code e origine Console dei 14 path documentali rotti.
- **File correlati allineati:** codice, doppia regressione e tre contesti Prenota sono coerenti.
- **Q1–Q6 coerenti:** tutte le risposte sono sostanziali e non contraddicono il perimetro svolto.
- **Tono utente:** apertura, cronologia e consegna parlano per comportamento della Pagina Prenota; i nomi tecnici restano nelle sezioni di prova.

Correzione fatta durante la self-review: ho distinto esplicitamente il controllo slot verde (esclusione di una pista) dalla prova preset rossa 5/5 (riproduzione certificata), così il report non sovrastima una singola esecuzione di esclusione.
