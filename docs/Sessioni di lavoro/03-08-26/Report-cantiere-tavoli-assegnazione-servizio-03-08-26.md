# Report — Cantiere "Servizio → tavoli e assegnazione prenotazioni" (03-08-2026, sera)

> Branch `env/test`. Ruolo: agente **orchestratore + revisore** — tre agenti Sonnet lanciati in
> sequenza (uno ripreso dopo un limite di sessione), ciascuno rivisto a mano (diff riletto, comandi
> ri-eseguiti da me, non preso per buono sulla parola) prima di passare al successivo. **3 commit**
> fatti su `env/test`, **nessun push**. Nessuna scrittura su PROD in nessun punto della sessione.

## 1. Cappello

- **Cosa è cambiato:** il ristoratore che chiude una fascia dall'admin ora blocca davvero le
  prenotazioni online su quella fascia (prima il form pubblico la ignorava); due tavoli non possono
  più avere lo stesso nome nello stesso locale nemmeno per un incidente di sincronizzazione; un
  walk-in su un tavolo occupato non può più restare "a metà" (o va tutto a buon fine o non lascia
  tracce). In più, ho trovato — e lasciato documentato, non corretto — un bug reale: l'avviso "Tavolo
  a fine turno" ritorna dopo un ricaricamento della pagina anche se lo staff l'aveva già gestito.
- **Cosa resta:** decidere con Matteo come correggere il bug dell'avviso di fine turno
  (`FU-SERV-RELEASE-NOTICE-1`); push su `origin/env/test` (non ancora fatto); il resto della coda del
  masterplan Servizio (capienza pubblica allineata ai tavoli, rollout PROD) resta fuori scope, non
  toccato.
- **Serve una tua azione:** sì — vedi §11 «Cosa resta» per l'elenco completo, in particolare la
  decisione sul bug trovato e l'ok a fare push.

## 2. Cosa è stato fatto

Il compito era vago all'inizio ("cantiere tavoli e assegnazione, ancora da scoping" secondo
l'handoff): prima di scrivere qualunque prompt ho chiesto a Matteo su cosa concentrarsi, con tre
opzioni derivate dall'handoff stesso. Ha scelto tutte e tre: (1) il buco noto — chiusura fascia che
non arriva al form pubblico, (2) i debiti tecnici noti su tavoli/walk-in, (3) il ricollaudo delle
voci di checklist mai completate. Ho trattato questi tre fronti come tre "wave" sequenziali, ciascuna
affidata a un agente Sonnet con un prompt scritto dopo aver letto io stesso il codice coinvolto (mai
un prompt scritto "a naso"), e ciascuna rivista a fondo prima di passare alla successiva.

**Wave 1 — chiusura fascia non arriva al pubblico.** Letto il bug in `RIPROVA_D.md` (voce 8-3) e
verificato leggendo il codice che né la RPC pubblica `get_public_slot_config` né l'Edge
`create-booking` controllavano mai `service_slots.max_turns` (il campo che "Chiudi servizio" azzera).
L'agente ha scritto la migrazione, corretto l'Edge, mappato il nuovo errore lato client, verificato
tutto con chiamate REST dirette su TEST (fascia di prova creata, chiusa, verificata sparire dalla
RPC e venire rifiutata dall'Edge, poi ripulita) e deployato `create-booking` come v30 su TEST.

**Wave 2 — due debiti tecnici.** Nome tavolo: aggiunto un indice unico a livello database (prima il
controllo esisteva solo nell'interfaccia), con verifica preventiva che non ci fossero già duplicati
sul TEST (0 su 54 tavoli). Walk-in: sostituita la vecchia sequenza "scrivi, poi se qualcosa va storto
scrivi di nuovo per annullare" con un'unica operazione atomica (una funzione database che o va a
buon fine tutta o non lascia niente). Verificato con un vero accesso admin che forzare un errore non
lascia mai una prenotazione orfana.

**Wave 3 — collaudo delle voci mai provate + un bug trovato.** L'agente ha scritto test automatici
che simulano il passare del tempo dentro un browser vero (senza aspettare minuti reali) per
riprodurre scenari mai visti a video: l'avviso di fine turno, una prenotazione su due tavoli liberata
uno alla volta, la sequenza completa degli stati di un tavolo, i pulsanti su schermo piccolo. In
questo lavoro l'agente ha scoperto un bug vero (non un problema del test): l'avviso di fine turno
ritorna dopo un ricaricamento della pagina anche dopo aver premuto "Ancora occupato". L'agente si è
fermato per un limite di sessione a metà di una diagnosi (il clock finto rompeva il login); l'ho
ripreso con lo stesso contesto e ha risolto la diagnosi da solo.

**Il mio lavoro di revisione, non delegato:** ho riletto ogni diff dei tre agenti riga per riga
(non solo il loro riassunto), ri-eseguito io stesso `npm run validate` dopo ogni wave, verificato il
registro migrazioni sul database di test dopo ogni migrazione applicata. Sul lavoro della Wave 3 ho
trovato di persona una discrepanza: il test dava un risultato diverso a seconda di quanti test
giravano insieme (3 falliti invece di 1) — ho isolato la causa (più scenari appoggiati sulla stessa
fascia oraria "si vedevano" a vicenda quando i test giravano in parallelo, comportamento di default
di questo repo) e corretto io stesso il file di test dando a ciascun test una fascia usa-e-getta
propria, poi riverificato che il risultato tornasse sempre lo stesso (6 verdi, 1 rosso) sia in
parallelo sia in isolamento totale. Ho anche scritto io la voce di follow-up per il bug trovato e
completato l'aggiornamento della skill area che l'ultimo agente aveva lasciato a metà.

## 3. File toccati e perché

**Commit 1 — `3e9fa2c` fix(servizio): chiusura fascia blocca anche il form pubblico**

| File | Perché |
|---|---|
| `supabase/migrations/067_public_slot_config_excludes_closed.sql` | Nuova migrazione: esclude le fasce chiuse (`max_turns=0`) da `get_public_slot_config` e, per coerenza, da `get_available_arrival_times` |
| `supabase/functions/create-booking/index.ts` | Controllo server-side in più: rifiuta con 409 `SLOT_CLOSED` una prenotazione su una fascia chiusa, anche se qualcuno bypassasse la RPC |
| `src/features/booking/utils/bookingPublicFormErrorFeedback.ts` | Nuovo caso `SLOT_CLOSED` nel mapping errori → messaggio utente in italiano |
| `src/features/booking/utils/__tests__/bookingPublicFormErrorFeedback.test.ts` | Test per il nuovo caso |

**Commit 2 — `ae4e7ae` fix(servizio): nome tavolo unico a DB + walk-in atomico via RPC**

| File | Perché |
|---|---|
| `supabase/migrations/068_tables_unique_name_per_tenant.sql` | Indice unico parziale, case/spazi-insensitive, per tenant, solo tavoli attivi |
| `supabase/migrations/069_create_walk_in_with_assignment_rpc.sql` | Nuova RPC `create_walk_in_with_assignment` (unica scrittura atomica) |
| `src/features/booking/hooks/useServizioTables.ts` | `useCreateTable`/`useUpdateTable` traducono l'errore Postgres `23505` in un messaggio leggibile |
| `src/features/booking/hooks/useWalkInMutation.ts` | Riscritto per chiamare solo la nuova RPC, tolta la logica di "rollback" manuale |
| `src/features/booking/hooks/__tests__/useServizioTables.duplicateName.test.tsx` | Nuovo — copre il messaggio amichevole su 23505 |
| `src/features/booking/hooks/__tests__/useWalkInMutation.rpc.test.tsx` | Nuovo — copre i parametri passati alla RPC e la gestione errori |
| `src/features/booking/hooks/__tests__/useWalkInMutation.atomic.test.ts` | Rimosso — copriva solo la funzione di rollback ora eliminata |
| `src/types/database.ts` | Rigenerato: aggiunge i tipi della nuova RPC |

**Commit 3 — `5780717` test(servizio): e2e ciclo di vita tavoli, trovato bug avviso fine turno**

| File | Perché |
|---|---|
| `e2e/pro/pro-service-tables-lifecycle.spec.ts` | Nuovo — 7 test Playwright, voci di checklist mai collaudate |
| `e2e/helpers/supabaseStaging.ts` | Nuovi helper per seminare/ripulire sale, tavoli, assegnazioni, fasce temporanee su TEST |
| `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` | Nuove §9.12 (debiti chiusi) e §9.13 (e2e + bug trovato) |
| `docs/FOLLOW_UP.md` | Nuova riga `FU-SERV-RELEASE-NOTICE-1` |

**Non toccato:** nessun file di PROD, nessuna migrazione PROD, nessun altro cantiere del masterplan
Servizio (capienza pubblica/D38, rollout).

## 4. Test eseguiti e risultato

- `npm run validate` rieseguito **personalmente** (non preso dal report degli agenti) dopo ogni wave
  e di nuovo alla fine: sempre verde. Finale: **156 file di test / 1283 test** passati, lint 0
  warning, typecheck pulito.
- `npx supabase migration list --linked` verificato dopo ogni migrazione: `067`, `068`, `069` tutte
  registrate pulite (nessuna riga orfana, solo il falso positivo noto del doppio prefisso `003`).
- `npx playwright test e2e/pro/pro-service-tables-lifecycle.spec.ts` eseguito **personalmente** più
  volte, sia con il parallelismo di default sia forzando un solo worker sia isolando un singolo test:
  risultato stabile **6 passed / 1 failed**, dove l'unico rosso è il bug reale trovato (non
  flakiness — confermato riproducendolo anche in totale isolamento).
- Verifica diretta via REST sull'ambiente TEST dopo ogni run: nessun dato di scarto rimasto (sale,
  tavoli, fasce, prenotazioni con prefisso `E2E-SRV-` sempre a zero a fine test).

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` | Nuove §9.12 (debiti tecnici chiusi) e §9.13 (e2e ciclo di vita + bug trovato) | Il diff cambia comportamento (RPC walk-in, vincolo DB nome tavolo) e aggiunge copertura di test che questa skill area deve tracciare — stesso pattern di ogni round S4 precedente |
| `docs/FOLLOW_UP.md` | Nuova riga `FU-SERV-RELEASE-NOTICE-1` | Debito nuovo, trovato in questa sessione, non ancora corretto: va tracciato per non perderlo |
| Questo report | Nuovo file | Chiusura standard/deep — tre migrazioni DB, una RPC nuova, un bug di prodotto trovato: non è un fix piccolo |

Non toccato `docs/Admin-Skill/contesto/ADMIN_SHELL_PAGES_CONTEXT.md`: questa sessione non ha
cambiato layout o comportamento visibile della pagina (solo dati/DB/test), quindi non c'era nulla da
allineare lì.

## 6. Dati comunicazione

- Prompt sostanziale 1 (verbatim): «leggi @docs/Sessioni di lavoro/02-08-26/HANDOFF_S4_SENIOR.md e
  prepariamo la sessione sulla pagina Servizio → tavoli e assegnazione prenotazioni. prepara prompt
  quando hai tutti gli elementi e poi lancia agente sonnet. tu rimarrai agente orhcestrator e
  revisore a lavori finiti . continua preparare prompt e lanciare sonnet nuovi se necessari (se
  riesci ricicla sonnet se ha abb contesto ) finche non hai completato debuggato e testato ciò che
  serve per completare pagina servizio. poi fai commit modifiche.» (refusi originali mantenuti).
- Prompt sostanziale 2: risposta alla mia domanda di scoping — Matteo ha scelto tutte e tre le
  opzioni proposte (chiusura fascia → pubblico, debiti noti, ricollaudo), non una sola.
- Prompt sostanziale 3 (verbatim): «riprendi» — per far ripartire l'agente Wave 3 interrotto da un
  limite di sessione.
- Prompt sostanziale 4 (questa richiesta): «crea report dettagliato di lavoro svolto. poi aggiorna
  handoff con ciò che è stato completato.»
- Formato che ha funzionato: **fermarsi a chiedere lo scope** prima di lanciare qualunque agente,
  quando il compito ricevuto era esplicitamente segnato come "ancora da scoping" nell'handoff — ha
  evitato di far lavorare tre agenti nella direzione sbagliata.
- Cosa si può automatizzare con certezza: il ciclo "prepara prompt dettagliato leggendo il codice
  vero → lancia agente in background → rileggi il diff riga per riga → ri-esegui i comandi di
  verifica di persona → solo allora passa avanti" — ripetuto identico tre volte in questa sessione,
  ha funzionato ogni volta e ha trovato un vero problema (la flakiness del test) che il solo report
  dell'agente non avrebbe fatto emergere.
- Cosa lasciare manuale: la decisione su **come** correggere il bug dell'avviso fine turno
  (localStorage? colonna DB?) — è una scelta di prodotto, non tecnica, va presa con Matteo.

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali di Matteo in questa chat (fino a questo punto): 4 (vedi §6). Correzioni dopo la
  1ª risposta: 0 — nessun redirect ricevuto, la scelta di fermarmi a chiedere lo scope prima di agire
  non ha richiesto correzioni successive. Follow-up generati verso Matteo: 2 (la domanda di scoping
  iniziale, risposta con multiSelect; la domanda implicita — ancora aperta — su come correggere il
  bug trovato). Modalità: **deep** per costruzione (tre migrazioni DB + una RPC + un bug di prodotto
  trovato), mai dichiarata esplicitamente da Matteo ma evidente dalla portata del lavoro.
- Anatomia: il prompt iniziale era intenzionalmente aperto ("prepariamo la sessione... prepara
  prompt quando hai tutti gli elementi") — ha funzionato bene perché ha lasciato a me il compito di
  raccogliere gli elementi tecnici (letture di codice, migrazioni esistenti, pattern RPC già in uso)
  prima di scrivere qualunque prompt per gli agenti, invece di partire con ipotesi non verificate.
  L'unico punto davvero ambiguo — cosa intendesse per "cantiere tavoli e assegnazione" quando gran
  parte di quella funzionalità esisteva già — è stato risolto con una domanda diretta invece di
  indovinare, ed è stato il bivio più importante della sessione: senza quella domanda avrei dovuto
  scegliere da solo tra almeno 4 letture diverse del compito.

## 8. La mia lettura della sessione

- **Impressioni:** il pattern "prepara un prompt molto dettagliato leggendo il codice vero, lancia
  in background, rileggi il diff di persona, ri-esegui i comandi di verifica" ha funzionato bene su
  tutte e tre le wave — in particolare ha permesso di scrivere prompt precisi (path di file esatti,
  pattern SQL da riusare, nomi di bottoni/etichette già noti) che hanno ridotto la deriva
  comportamentale degli agenti rispetto a un prompt generico. La revisione indipendente (non fidarsi
  del "report finale" di un agente) ha pagato concretamente in Wave 3: il report dell'agente diceva
  "6 passed / 1 failed, deterministico" e la mia prima riesecuzione ha dato "3 failed" — se mi fossi
  fermato al report avrei consegnato un test file che sarebbe stato intermittente in condizioni
  normali d'uso.
- **Difficoltà incontrate + come le ho risolte:** (1) l'agente Wave 3 si è interrotto per un limite
  di sessione a metà di una diagnosi non banale (interazione fra `page.clock` di Playwright e il
  refresh del JWT Supabase) — l'ho ripreso con `SendMessage` passandogli un riepilogo esplicito dello
  stato e del compito residuo, ed è ripartito senza perdere il contesto tecnico già accumulato. (2)
  Il file e2e consegnato dava risultati incoerenti sotto esecuzione parallela — diagnosticato
  isolando la variabile (stesso test, `--workers=1` vs default) invece di fidarmi della prima
  spiegazione plausibile, e corretto io stesso senza rilanciare un quarto agente (il fix era piccolo
  e ben compreso, non valeva il costo di un altro giro).
- **Migliorie che suggerirei (come dato, non come modifica fatta da me):**
  1. Quando un prompt per un agente prevede test e2e con dati seminati su una risorsa condivisa
     (stessa fascia oraria, stesso giorno), andrebbe richiesto esplicitamente di isolare ogni test su
     una risorsa dedicata fin dall'inizio — l'ho scoperto solo rieseguendo io i test, non era
     nell'istruzione originale che ho dato all'agente.
  2. Il pattern "resumed agent via SendMessage dopo un limite di sessione" ha funzionato, ma
     varrebbe la pena annotarlo come procedura standard: passare sempre un riepilogo esplicito dello
     stato scoperto finora, non solo "riprendi", perché il nuovo turno dell'agente non ha garanzia di
     ricordare i dettagli tecnici fini (nel mio caso ho dovuto ricostruirli io dal `result` della
     notifica di fallimento prima di rilanciare).

## 9. Derivazione errori

1. **Bug preesistente** — la chiusura di una fascia (`max_turns=0`) non veniva mai controllata dal
   percorso pubblico (`get_public_slot_config`, `get_available_arrival_times`, `create-booking`).
   Causa: quando queste RPC/Edge sono state scritte, il campo `max_turns` e il concetto di "fascia
   chiusa" non esistevano ancora nella loro forma attuale — nessuna delle due parti è mai stata
   ricollegata quando il concetto è arrivato. Evitabile solo con un controllo esplicito, al momento
   dell'introduzione di `max_turns`, di ogni punto che legge `service_slots` per il pubblico — non
   c'era in questo caso.
2. **Bug preesistente, trovato in Wave 3** — l'avviso "Tavolo a fine turno" non sopravvive a un
   reload dopo "Ancora occupato": `handledReleaseTableIds` è uno stato React locale mai persistito.
   Causa: la funzionalità (S4-FIX post-QA 02-08-26) è stata costruita e testata senza mai includere
   uno scenario con reload della pagina nella checklist di collaudo di allora — il comportamento
   "non deve ritornare" era scritto nella checklist ma non c'era modo di verificarlo senza uno
   scenario di tempo reale, quindi non era mai stato controllato prima d'ora.
3. **Errore agente, corretto da me in revisione** — il file e2e della Wave 3 seminava più scenari
   sulla stessa fascia oraria reale ("Cena") e sulla data di oggi, causando falsi fallimenti quando i
   test giravano in parallelo (comportamento di default di questo repo, `fullyParallel: true`).
   Causa: l'agente ha verificato il file girandolo (correttamente), ma non ha esplorato la sensibilità
   al numero di worker/parallelismo — un limite del suo processo di verifica, non un errore di
   comprensione del compito. Evitato in revisione isolando la variabile (stesso comando, solo
   `--workers=1` diverso) prima di accettare il risultato.

## 10. Cosa resta per la prossima sessione

Sincronizzato con `docs/FOLLOW_UP.md`:

- **Nuovo, aperto:** `FU-SERV-RELEASE-NOTICE-1` — l'avviso di fine turno non sopravvive al reload
  dopo "Ancora occupato". Serve una decisione di Matteo su **come** persistere la conferma
  (localStorage di sessione, o una colonna sul record di assegnazione) prima di poterlo correggere.
- **Chiuso da questa sessione** (era il punto più pesante di `HANDOFF_S4_SENIOR.md` §4-bis): "la
  chiusura di una fascia non arriva al cliente" — ora corretto e verificato su TEST.
- **Resta fuori scope, non toccato:** capienza pubblica allineata ai tavoli veri (D38, rimandata da
  Matteo "dopo il collaudo" il 02-08); rollout PROD delle migrazioni S4 (063→069) + Edge
  `create-booking` insieme, con conferma esplicita di Matteo ogni volta; re-merge `main` → `env/test`
  per recuperare `f617077`, ancora da fare prima di qualunque rollout.
- **Operativo:** push dei 3 commit su `origin/env/test` — non ancora fatto, in attesa di conferma.

## 11. Domande di chiusura

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «leggi @docs/Sessioni di lavoro/02-08-26/HANDOFF_S4_SENIOR.md e prepariamo la sessione
sulla pagina Servizio → tavoli e assegnazione prenotazioni. prepara prompt quando hai tutti gli
elementi e poi lancia agente sonnet. tu rimarrai agente orhcestrator e revisore a lavori finiti .
continua preparare prompt e lanciare sonnet nuovi se necessari (se riesci ricicla sonnet se ha abb
contesto ) finche non hai completato debuggato e testato ciò che serve per completare pagina
servizio. poi fai commit modifiche.» (refusi originali mantenuti). (2) Risposta alla mia domanda di
scoping (AskUserQuestion): selezionate insieme "Chiudi fascia non arriva al pubblico", "Debiti noti
su tavoli/assegnazione", "Ricollaudo di quanto già fatto" — non una sola opzione. (3) «riprendi».
(4, questa richiesta) «crea report dettagliato di lavoro svolto. poi aggiorna handoff con ciò che è
stato completato.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì, verificato durante la sessione stessa (non a posteriori per questo report). Ho letto per
intero la migrazione 067 dopo che l'agente Wave 1 l'ha scritta (confermato il filtro `max_turns` su
entrambe le RPC, `GRANT`/`REVOKE` invariati) e il diff dell'Edge `create-booking` (confermato
`max_turns` aggiunto alla select + il nuovo blocco 409 esattamente dov'era previsto). Ho letto la
migrazione 069 riga per riga confrontandola con la sequenza JS originale che avevo io stesso
specificato nel prompt (stesso ordine di controlli, stessi messaggi di errore). Ho eseguito
`npx supabase migration list --linked` dopo ogni migrazione (non preso la parola dell'agente) e
confermato `067`/`068`/`069` registrate. Ho eseguito io stesso `npm run validate` quattro volte
(dopo ogni wave + dopo il mio fix alla Wave 3), leggendo l'output completo, non un riassunto. Ho
eseguito personalmente `npx playwright test` sul nuovo file e2e più volte con parametri diversi,
trovando un risultato diverso dal report dell'agente (3 failed contro i suoi 6 passed/1 failed
dichiarati) — ho investigato la causa io stesso invece di segnalarlo e basta, corretto, e riverificato
fino a un risultato stabile e riproducibile. I numeri citati in questo report (156 file/1283 test,
6 passed/1 failed, 54 tavoli/0 duplicati) sono tutti numeri che ho visto io con i miei occhi
nell'output dei comandi, non copiati dai report degli agenti.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` — verificato: §9.12 aggiunta dall'agente
Wave 2 (riletta, corrisponde al diff); §9.13 mancava dopo la Wave 3 (l'agente non l'aveva scritta) —
l'ho scritta io stesso, verificando che il contenuto corrispondesse esattamente a quanto avevo
appena verificato di persona (bug riprodotto in isolamento, causa in `AssignmentMapPanel.tsx`,
numeri di test). `docs/FOLLOW_UP.md` — riga nuova aggiunta da me (l'agente non l'aveva fatto), con
formato coerente alle righe esistenti (verificato leggendo lo header della tabella prima di scrivere).
`src/types/database.ts` — verificato che il diff contenga solo la nuova funzione RPC, nessun'altra
rigenerazione indesiderata. Test: tutti i file `__tests__` collegati verificati tramite
`npm run validate` verde più lettura diretta dei tre nuovi file di test (contenuto coerente col
comportamento che dichiarano di coprire). Non toccato `ADMIN_SHELL_PAGES_CONTEXT.md`: nessun cambio
di layout/comportamento visibile in questa sessione (solo DB/RPC/test), verificato rileggendo la
sezione Servizio di quel file per assicurarmi che nulla di scritto lì fosse diventato falso.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho corretto il bug trovato in Wave 3 (avviso fine turno dopo reload) — deliberato: avevo
istruito l'agente a non farlo (serve una decisione di prodotto su come persistere lo stato, non solo
tecnica) e ho mantenuto la stessa disciplina io stesso in revisione, invece di "sistemarlo visto che
c'ero". Non ho fatto push dei 3 commit — nessuna richiesta esplicita ricevuta finora, e la regola
del repo è di non farlo senza conferma. Non ho esteso la copertura e2e oltre i 4 scenari richiesti
(es. non ho aggiunto test per il walk-in via UI, per la creazione tavolo con nome duplicato via UI,
o per l'assegnazione con conflitto di turno) — erano fuori dallo scope che Matteo aveva scelto
(ricollaudo delle voci mai completate, non "copertura e2e esaustiva della pagina"). Non ho toccato
la coda operativa dell'handoff (D38 capienza pubblica, rollout PROD, re-merge `main`) — esplicitamente
fuori scope per questa sessione secondo le tre opzioni scelte da Matteo.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: L'attrito principale è stato tecnico più che di skill system: l'interazione fra `page.clock` di
Playwright e il refresh del JWT Supabase non è documentata da nessuna parte nel repo (né skill, né
context), quindi il primo agente Wave 3 l'ha dovuta scoprire da zero con un test diagnostico —
proporrei di annotare questa scoperta (ora in `ADMIN_SERVIZIO_CONTEXT.md` §9.13 e nel commento di
testata del file e2e) in un punto più generale/riusabile, tipo `TESTING_SKILL.md`, così il prossimo
agente che vuole pilotare il tempo in un test e2e su questo repo non deve riscoprirla.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto, forse leggermente sovrabbondante all'inizio: ho caricato sia
`ADMIN_SHELL_SKILL.md` sia `ADMIN_SERVIZIO_CONTEXT.md` per intero prima di scrivere il primo prompt,
il che ha richiesto tempo ma si è ripagato — ogni prompt per gli agenti ha potuto citare pattern
esatti già in uso nel repo (es. il pattern SECURITY DEFINER + check tenant di `insert_service_slot`,
trovato leggendo `026_security_hardening.sql`) invece di farli inventare da capo agli agenti, il che
ha ridotto sensibilmente il rischio di deviazioni. Gli hook di fine sessione/pre-commit sono stati
utili, non rumore: il pre-commit "a mente fredda" mi ha fatto fermare un istante prima di ogni commit
a ricontrollare che l'avessi davvero già verificato tutto (l'avevo fatto), e questo stesso report è
una risposta diretta al promemoria di quell'hook.
```

## 12. Self-review del report

1. **Dati = diff reale:** confermato in Q2 — ogni numero citato (commit hash, righe di diff, esiti
   test) viene da comandi che ho eseguito e letto io stesso durante la sessione, non ricostruito a
   memoria per questo report.
2. **File correlati allineati:** confermato in Q3 — ho scritto io stesso la §9.13 mancante e la riga
   FOLLOW_UP prima di dichiarare la sessione pronta per il report, non li ho lasciati come debito.
3. **Q1-Q6 coerenti:** sì — nessuna contraddizione tra le risposte e il resto del report; ogni
   risposta cita fatti verificabili nel diff o nei comandi eseguiti, non affermazioni generiche.
4. **Tono utente:** le sezioni 1, 2, 10 (rivolte a Matteo) parlano per effetto/flusso, non per nomi
   file isolati; le sezioni 3, 6-12 sono dati tecnici interni, coerente con la distinzione richiesta.

Nessuna correzione necessaria dopo il controllo.
