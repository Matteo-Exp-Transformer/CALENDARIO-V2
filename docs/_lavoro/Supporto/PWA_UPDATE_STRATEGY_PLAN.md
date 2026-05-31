@# Piano base - App admin gia aggiornata all'apertura

## Decisione

Per l'area admin/app operativa, Mario deve aprire l'app e trovarla gia aggiornata alla versione deployata piu recente.

L'aggiornamento non deve avvenire come flusso normale mentre Mario sta lavorando dentro l'app. Se serve un breve passaggio tecnico all'avvio, puo comparire solo un messaggio minimale, ad esempio: "Caricamento nuova versione...".

## Perche questa scelta

Mario non deve iniziare una sessione su una versione vecchia dopo un deploy, soprattutto quando cambiano limiti, logiche di salvataggio, permessi o comportamenti collegati al database.

Per una piattaforma multi-azienda, la priorita dell'admin non e l'offline-first: e avere una versione coerente, aggiornata e uguale per tutti i ristoratori dopo il rilascio.

## Confini della soluzione

- Il controllo aggiornamento avviene all'apertura dell'area admin/app operativa.
- Le richieste a Supabase e i dati tenant non devono essere cacheati dal service worker.
- Gli asset statici possono restare cacheati, ma script e CSS dell'app non devono restare bloccati su versioni vecchie.
- La pagina pubblica puo mantenere cache piu conservativa solo se non rischia di mostrare dati o logiche obsolete.
- Durante una sessione gia avviata non si forza reload automatico.

## Comportamento atteso

1. Mario apre l'app.
2. L'app verifica subito se il browser sta per servire una versione vecchia.
3. Se non ci sono aggiornamenti, Mario entra normalmente.
4. Se e disponibile una nuova versione, l'app la attiva prima dell'uso e mostra solo un messaggio breve di caricamento.
5. Mario entra direttamente nella versione aggiornata.

## Aggiornamenti rilasciati mentre l'app e gia aperta

Se viene rilasciata una nuova versione mentre Mario sta gia usando l'app, non si forza il reload e non si interrompe la compilazione.

L'aggiornamento verra applicato al nuovo avvio dell'app. Se serve, al nuovo avvio si mostra una schermata iniziale di caricamento aggiornamento, ad esempio: "Aggiornamento in corso, stiamo caricando la versione piu recente".

## Implementazione prevista

- Spostare il comportamento principale di aggiornamento all'avvio dell'app.
- Mostrare uno stato visivo minimale solo se all'apertura serve completare l'aggiornamento.
- Evitare cache aggressiva su script e CSS dell'admin, cosi il primo caricamento dopo deploy non resta su bundle vecchi.
- Aggiungere, se utile, una versione build/commit visibile o loggabile per verificare quale build sta servendo la produzione.
- Non usare reload automatico durante sessioni gia avviate.

## Rischi da gestire

- Se Mario tiene l'app aperta per molte ore, potrebbe continuare sulla versione avviata prima del deploy.
- Per mitigare: all'apertura successiva deve ricevere subito la versione nuova, prima di iniziare una nuova compilazione.
- Se il deploy serve il branch sbagliato, il service worker non risolve il problema: va prima verificato che produzione punti al branch corretto.

## Fallback accettabile

Il fallback non deve essere un reload mentre Mario lavora.

Il fallback corretto e un controllo esterno alla sessione attiva: al nuovo avvio l'app verifica la build, mostra una schermata iniziale di caricamento aggiornamento se deve aggiornare, poi entra solo quando la versione servita e quella nuova.

## Criterio di successo

Dopo un deploy, alla successiva apertura dell'app Mario non deve piu vedere vecchi limiti, vecchie regole o vecchi componenti per colpa della cache PWA.

In produzione deve essere possibile verificare rapidamente quale commit/build sta usando l'app.
