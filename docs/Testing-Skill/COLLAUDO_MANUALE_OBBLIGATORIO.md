# Collaudo manuale obbligatorio — quello che DEVE fare Matteo

> **Data:** 06-08-2026 · **Branch:** `env/test` · **Ambiente:** TEST (`docnnernvp`)
> **A cosa serve:** la vecchia [`COLLAUDO_S4_CHECKLIST.md`](COLLAUDO_S4_CHECKLIST.md) ha 62 voci, ma
> **38 di quelle sono già dimostrate da un test automatico che gira nel browser vero**. Questo
> documento tiene solo le **16 prove che nessun test copre** o che richiedono i tuoi occhi
> (colori, PDF, layout, giudizio di prodotto).
> **Come è stato deciso:** gap-analysis voce per voce fra checklist ed E2E/Vitest, con etichette dei
> pulsanti estratte dal codice reale. Le prove già coperte sono elencate in fondo, §5: **non rifarle**.

**Tempo stimato totale: ~2 ore e 30**, divise in 4 blocchi che puoi fare in sessioni separate.

---

## 0. Prima di iniziare (15 minuti, una volta sola)

### 0.1 Accendere l'app

```
npm run dev
```

Deve comparire `http://localhost:5173/`. **Non usare `npm run dev:prod`**: quello punta alla
produzione vera dei clienti.

### 0.2 Con quale account entrare

| Serve per | Account | Dove |
|---|---|---|
| Tutti i blocchi 1-3 | `tomas@t.com` (tenant `da-tommaso`, **Pro**) | `http://localhost:5173/admin` |
| Solo blocco 4 | `testc@c.com` (tenant `test-classic`, **Classic**) | stesso indirizzo |

Le password sono in `.env.local.test` (`E2E_PRO_ADMIN_PASSWORD` / `MANUAL_ADMIN_PASSWORD`).

### 0.3 Dati da avere in Servizio prima di partire

Vai su **Servizio → Lista** e assicurati di avere:

- **1 sala** (es. "Sala principale")
- **4 tavoli**: `T1` = 2 posti · `T2` = 4 · `T3` = 4 · `T4` = 6
- **2 fasce orarie** (es. "Pranzo" e "Cena"), dentro la card **"Fasce orarie"**

Non esiste uno script che li crea: vanno fatti a mano e restano lì.

### 0.4 Come far diventare un tavolo di un certo colore

Crea la prenotazione da **Admin → Nuova prenotazione** (non dal form pubblico): quella nasce già
*accettata* e la trovi subito fra le "da assegnare" in Servizio. L'orario che scegli **deve cadere
dentro la fascia** che poi selezioni in Servizio.

| Colore/stato che vuoi vedere | Che orario mettere nella prenotazione |
|---|---|
| **In arrivo** (azzurro) | adesso **+ 5 minuti** |
| **Occupato** (giallo) | adesso **− 6 minuti** |
| **In ritardo** (rosso) | adesso **− 25 minuti** |
| **In uscita** (viola) + parte l'avviso fine turno | adesso **− 3 ore e 10 minuti** |

I numeri vengono dai valori veri dell'app: soglia ritardo **15 minuti**
(`src/features/booking/hooks/useTableStatuses.ts:35`), durata di default **3 ore**
(`src/features/booking/hooks/useAdminBookingRequests.ts:28`), buffer di riassetto **0 minuti**
(`supabase/migrations/057_service_slots_duration_buffer.sql:7`).
La mappa si aggiorna **da sola ogni 30 secondi**: non ricaricare la pagina per "aiutarla".

### 0.5 ⚠️ Le tre trappole che fanno sembrare rotta l'app quando non lo è

1. **Rate limit del form pubblico.** Massimo **3 invii al minuto** dallo stesso computer; a **6 invii
   in 10 minuti scatta un blocco di 24 ore**. Conta **anche i tentativi rifiutati** (dati sbagliati,
   fascia piena…). Nel Blocco 2 fai gli invii pubblici **lentamente, uno ogni paio di minuti**.
2. **Azienda sbagliata.** Se sei loggato come `da-tommaso` ma apri `/prenota/test-pro`, admin e form
   pubblico guardano **due locali diversi** e sembra che i dati spariscano.
3. **Cache della build.** Con `npm run dev` non c'è problema. Se invece usi `npm run build` +
   `npm run preview`, la pagina può restare quella vecchia: chiudi tutte le schede e riapri.

---

## BLOCCO 1 — Le 5 prove che bloccano un rilascio (~50 min)

Se una di queste è rossa, **non si va in produzione**. Sono le uniche in cui nessun test automatico
guarda l'anello che le collega.

---

### T1 — Una prenotazione fatta dal cliente arriva davvero allo staff 🔴

*Perché per forza tu:* i test dimostrano che la prenotazione **finisce nel database**, e
separatamente che l'admin **legge il database**. Nessuno ha mai verificato l'anello completo. Se è
rotto, un cliente prenota e in sala non lo vede nessuno.

**A. Sequenza di click**
1. Apri una **finestra in incognito** su `http://localhost:5173/prenota/da-tommaso`
2. Scegli la tipologia e l'eventuale sotto-scheda, poi compila: **"Nome Completo *"** = `Anna Prova`
   · **"Ora *"** = un orario dentro la fascia Cena · **"Ospiti *"** = `4` · **"Telefono *"** un numero
   · **"Data *"** = oggi
3. Invia
4. Torna alla finestra admin → sidebar **"Calendario"** → giorno di oggi
5. Sidebar **"Servizio"** → tab **"Mappa"** → sotto-vista **"Servizio"** → scegli la fascia Cena

**B. Risultato atteso**
- Il cliente vede una conferma, senza errori rossi.
- In **Calendario** compare `Anna Prova` **all'orario che ha scelto lei** (non spostato di 1-2 ore).
- In **Servizio** `Anna Prova` compare nel cassetto delle prenotazioni **da assegnare**, con lo
  stesso orario e 4 coperti.

**C. Elementi importanti**
- Le prenotazioni pubbliche nascono **in attesa**, quelle create da admin nascono **accettate**: se
  in Servizio non la vedi subito, controlla prima se va accettata da Prenotazioni.
- Guarda **l'orario in tre posti** (form, Calendario, Servizio): lo scarto di fuso è il difetto
  storico di quest'area, ricomparso più volte.
- Un solo invio: stai consumando il rate limit.

---

### T2 — Cambio gli orari di una fascia e il cliente li vede 🔴

*Perché per forza tu:* nessun test fa il giro "modifico da admin → ricarico il form pubblico". Se
resta indietro, prendi prenotazioni per una fascia che non esiste più.

**A. Sequenza di click**
1. **Servizio** → card **"Fasce orarie"** (clicca per aprirla) → matita sulla fascia **Cena**
2. Nella finestra **"Modifica fascia oraria"** cambia **"Inizio"** (es. da `19:00` a `20:00`)
3. Se compare **"Tipo di salvataggio"**, scegli **"Sempre"**
4. **"Salva modifiche"**
5. Ricarica la finestra in incognito su `/prenota/da-tommaso` e apri il selettore dell'orario

**B. Risultato atteso**
- Gli orari selezionabili dal cliente **partono dal nuovo inizio** (20:00), non più dalle 19:00.
- Rimetti l'orario com'era e ricontrolla: torna indietro.

**C. Elementi importanti**
- Ricarica **davvero** la pagina pubblica (F5), non basta cambiare campo.
- **"Tipo di salvataggio"** ha anche "Solo oggi" / "Questa settimana": se scegli quelli, la modifica
  vale solo per quei giorni — è una funzione voluta, non un bug.
- Non serve inviare nessuna prenotazione: qui guardi solo la tendina degli orari (nessun consumo di
  rate limit).

---

### T3 — Il walk-in senza tavolo si deve rifiutare 🔴

*Perché per forza tu:* la regola esiste nel codice ma **nessun test la esercita**. Se salta, entra
in sala un cliente senza posto assegnato e sparisce dal conto dei tavoli.

**A. Sequenza di click**
1. Sidebar **"Home"** → riquadro **"Aggiungi walk-in"**
2. Compila solo **"Numero coperti *"** = `2`, lascia **"Sala *"** e **"Tavolo *"** vuoti
3. Premi **"Aggiungi walk-in"**
4. Ora scegli la sala ma **non** il tavolo, e premi di nuovo
5. Scegli anche il tavolo (uno libero) e conferma

**B. Risultato atteso**
- Passo 3 → messaggio **"Seleziona una sala."**, niente salvato.
- Passo 4 → messaggio **"Seleziona un tavolo."**, niente salvato.
- Passo 5 → il walk-in viene creato e **il tavolo scelto diventa giallo/occupato** con il nome del
  walk-in sopra.

**C. Elementi importanti**
- Il campo **"Nome cliente (opzionale)"** può restare vuoto: è voluto.
- La finestra si chiama **"Aggiungi walk-in"** e il pulsante finale ha lo stesso testo: al **primo**
  click su un tavolo occupato ti avvisa, al **secondo** conferma (comportamento a due passaggi
  voluto).

---

### T4 — Sfondo il numero di posti di un tavolo: mi avvisa, non mi blocca 🔴

*Perché per forza tu:* i test coprono solo il caso "tavolata su più tavoli". L'assegnazione singola
oltre capienza non è mai stata provata. Se per sbaglio **blocca**, in sala lo staff resta fermo.

**A. Sequenza di click**
1. **Admin → Nuova prenotazione**: crea una prenotazione da **6 coperti**, orario fra 10 minuti
2. **Servizio** → tab **"Mappa"** → vista **"Servizio"** → scegli la fascia giusta
3. Sulla card della prenotazione premi **"Assegna"**
4. Nella finestra **"Assegna tavolo"** scegli **T1 (2 posti)**
5. Premi **"Assegna tavolo"**

**B. Risultato atteso**
- Compare un **avviso** che i posti non bastano (tipo *"Mancano 4 posti…"*).
- L'avviso **non impedisce** di completare: puoi assegnare comunque.
- Alla fine T1 risulta **occupato** con quella prenotazione sopra.

**C. Elementi importanti**
- La filosofia dell'app è **morbida**: l'admin viene sempre avvisato, **mai bloccato**. Se trovi un
  blocco, è un difetto — annotalo.
- Nel contatore in alto leggi **"Selezionati 1 tavoli · 2 posti su 6 richiesti"**: quel testo è la
  prova che sta contando bene.

---

### T5 — L'interruttore D38 fa quello che dice 🔴

*Perché per forza tu:* la logica è testata, **ma con dati finti**. Il pulsante che clicchi tu non è
mai stato premuto da nessun test.

**A. Sequenza di click**
1. **Servizio** → card **"Fasce orarie"** → matita sulla fascia **Pranzo** → imposta
   **"Coperti massimi per fascia"** = `6` → **"Salva modifiche"**
2. Verifica che i tavoli T1+T2+T3 facciano **10 posti** in totale
3. Nella stessa card, la casella **"Mantieni anche il limite coperti della fascia"** deve essere
   **spenta**
4. Crea una prenotazione da **8 coperti** in fascia Pranzo e prova ad assegnarla a T2+T3
5. **Accendi** la casella **"Mantieni anche il limite coperti della fascia"**
6. Riprova la stessa assegnazione

**B. Risultato atteso**
- Passo 4 (casella **spenta**): il conto della capienza usa i **10 posti dei tavoli** → nessun avviso
  di "fascia piena" fino a 10.
- Passo 6 (casella **accesa**): usa il **più piccolo dei due**, cioè **6** → con 8 coperti compare
  l'avviso di superamento.
- In entrambi i casi **puoi comunque completare**: è un avviso, non un blocco.
- **Alla fine rimetti la casella su SPENTA** (è il valore di default).

**C. Elementi importanti**
- La casella sta sotto il titolo "Fasce orarie", con la spiegazione *"Opzione avanzata: con i tavoli
  attivi, l'avviso usa il primo limite raggiunto tra posti dei tavoli e cap della fascia."*
- Questa impostazione vale **solo per l'admin**. Il form pubblico oggi guarda **solo il limite della
  fascia** e ignora i tavoli: è una scelta rimandata, **non un difetto** (vedi lavoro `L4` del piano).

---

## BLOCCO 2 — Le 4 prove su cose che hai chiesto tu (~40 min)

---

### T6 — Il PDF del briefing ha gli orari giusti 🔴

*Perché per forza tu:* generare e **leggere un PDF** non è automatizzabile. Ed è il foglio che va
davvero in sala.

**A. Sequenza di click**
1. Assicurati che nella fascia Cena di oggi ci sia almeno **una prenotazione con orario notturno**
   (es. `03:00`, se hai una fascia che scavalla la mezzanotte) e **una normale**
2. Sidebar **"Home"** → riquadro **"Briefing turno"**
3. Nella finestra, tendina **"Turno:"** → scegli la fascia
4. Premi **"Scarica PDF"** e apri il file

**B. Risultato atteso**
- La tendina **"Turno:"** elenca **le tue fasce vere** (i nomi che hai scritto tu), più "Tutti".
- A video le colonne sono **Orario · Cliente · Tavolo · Coperti · Note**.
- Nel **PDF** gli orari sono **identici a quelli a video** (una prenotazione delle `03:00` non deve
  diventare `05:00`).

**C. Elementi importanti**
- ⚠️ Il pulsante in Home dice **"Briefing turno"** ma la finestra che si apre si intitola
  **"Briefing pre-turno"**: è la stessa cosa, due nomi. (È uno dei lavori del piano, `L7`.)
- ⚠️ Il **PDF non ha la colonna Tavolo** — è previsto, **non è un bug**. Verifica solo gli orari.
- Se scarichi il PDF e gli orari sono spostati, è il difetto storico del fuso: annotalo subito.

---

### T7 — La colonna Tavolo del briefing dice la cosa giusta 🟡

*Perché per forza tu:* i dati che stanno sotto sono testati, ma **come vengono scritti a video** no.

**A. Sequenza di click**
1. Con **una sola sala** configurata: **Home** → **"Briefing turno"** → guarda la colonna **Tavolo**
2. Crea una **seconda sala** (Servizio → **"Aggiungi sala"**) e spostaci dentro un tavolo che ha una
   prenotazione assegnata
3. Riapri il briefing

**B. Risultato atteso**
- Con **una sala**: la colonna mostra solo il nome del tavolo, es. `T2`.
- Con **due sale**: mostra `Sala principale · T2` (nome sala, punto separatore, nome tavolo).
- Prenotazione **non assegnata** a nessun tavolo: mostra un trattino `—`.

**C. Elementi importanti**
- Se hai creato la seconda sala solo per la prova, **eliminala dopo** (Servizio → linguetta sala →
  **"Modifica sala"** → **"Elimina sala"**): con due sale cambiano anche altre schermate.
- ⚠️ **Attenzione:** eliminare una sala **timbra come "servito"** il turno delle prenotazioni
  ancora attive dentro, mentre eliminare un **tavolo** no. È un'incoerenza reale già censita
  (lavoro `L5` del piano): se noti il conto turni che si muove, è quella, non un tuo errore.

---

### T8 — Aggiungo un terzo tavolo a una tavolata già assegnata 🟡

*Perché per forza tu:* i pezzi sono testati separatamente, ma **aprire la finestra da una riga già
assegnata** non l'ha mai fatto nessun test.

**A. Sequenza di click**
1. **Admin → Nuova prenotazione**: una da **10 coperti**
2. **Servizio** → vista **"Servizio"** → sulla card premi **"Assegna"**
3. Nella finestra seleziona **T2** e **T3** (4+4 = 8 posti)
4. Leggi il contatore, poi premi **"Assegna 2 tavoli"**
5. Nella sezione delle assegnate, sulla riga di quella prenotazione premi **"Aggiungi tavolo"**
6. Seleziona **T4** (6 posti) e conferma

**B. Risultato atteso**
- Passo 4: il contatore dice **"Selezionati 2 tavoli · 8 posti su 10 richiesti"** e compare
  **"Mancano 2 posti per questa tavolata"**.
- Dopo l'assegnazione: **una sola riga** nelle assegnate, con **entrambi i tavoli** elencati.
- Passo 5: nella finestra **"Aggiungi tavolo alla tavolata"**, T2 e T3 sono marcati
  **"Già in tavolata"** e **non si possono riselezionare**.
- Dopo il passo 6: il conteggio sale a **14 posti** e sparisce l'avviso "Mancano N posti".
- In piantina **tutti e tre** i tavoli risultano occupati dallo **stesso cliente**.

**C. Elementi importanti**
- La finestra cambia titolo: **"Assegna tavolo"** la prima volta, **"Aggiungi tavolo alla
  tavolata"** la seconda. Se vedi il titolo sbagliato, annotalo.
- Se premi **Annulla** su una tavolata appena creata devono tornare liberi **tutti** i tavoli, non
  solo l'ultimo (questo è già coperto da un test: non serve rifarlo, ma se lo noti rotto segnalalo).

---

### T9 — Il tavolo è già occupato: le tre scelte 🔴 ⚠️ VOCE RISCRITTA

*Perché per forza tu:* **la vecchia checklist descrive una schermata che non esiste più.** Diceva
*"Tavolo occupato: conferma la sostituzione"* con un pulsante *"Libera e assegna"*. Oggi l'app ti fa
scegliere **fra tre cose diverse**. È una schermata che **non hai mai visto**.

**A. Sequenza di click**
1. Assegna una prenotazione a **T2** (cliente A)
2. Crea una seconda prenotazione (cliente B) nella stessa fascia
3. Premi **"Assegna"** su B e scegli **lo stesso T2**

**B. Risultato atteso**

Compare un riquadro giallo con **tre opzioni a scelta singola**:
- **"Sposta [cliente A] su un altro tavolo"** → pulsante **"Sposta e assegna"**
- **"[cliente A] ha finito: libera il tavolo e archivia la prenotazione"** → **"Archivia e assegna"**
- **"[cliente A] torna tra le prenotazioni da assegnare"** → **"Rimetti in attesa e assegna"**

Più un campo **"Motivo (opzionale)"** e un pulsante **"Annulla"**.

Provale **tutte e tre** (rifacendo la situazione ogni volta) e verifica:
- **Sposta** → A finisce su un altro tavolo, B prende T2, nessuno sparisce.
- **Archivia** → A esce dalla mappa ma **resta nello storico**, non si cancella.
- **Rimetti in attesa** → A torna nel cassetto **"da assegnare"**, visibile.
- **Annulla** → non cambia niente, T2 resta di A.

**C. Elementi importanti**
- ⚠️ Questa è la prova più delicata del giro: sono **fino a 5 scritture in fila senza rete di
  sicurezza** (lavoro `L1` del piano, priorità massima). Se a metà qualcosa va storto puoi ritrovarti
  A su **due tavoli** o T2 **vuoto**. Se succede, fotografa la schermata e ricarica: è esattamente il
  difetto che il lavoro `L1` deve chiudere.
- Il campo **"Motivo"** serve a lasciare traccia: scrivici qualcosa almeno una volta e verifica che
  non dia errore.

---

## BLOCCO 3 — Le 4 prove che si fanno solo con gli occhi (~30 min)

Si fanno con **F12** → icona telefono/tablet in alto a sinistra del pannello → scegli la larghezza.
Le tre larghezze sono **375** (telefono), **834** (tablet), **1280** (desktop).

---

### T10 — La piantina a 375px non allarga la pagina 🟡

**A. Sequenza di click**
1. **Servizio** → tab **"Mappa"** → vista **"Servizio"**
2. F12 → larghezza **375**
3. Prova a scorrere la piantina **con il dito/mouse in orizzontale**
4. Prova a scorrere **la pagina** in orizzontale

**B. Risultato atteso**
- La **piantina** scorre lateralmente dentro il suo riquadro.
- **La pagina no**: non deve comparire nessuna barra di scorrimento orizzontale sul bordo del
  browser, e i titoli non devono uscire dallo schermo.

**C. Elementi importanti**
- Ripeti a **834** e **1280**: a 1280 la piantina deve starci tutta senza scorrere.
- Da `lg` in su le sale stanno **affiancate a due colonne**; sotto ne vedi **una sola** (quella
  scelta nelle linguette) — è voluto.

---

### T11 — Da telefono la modifica della sala è nascosta 🟡

**A. Sequenza di click**
1. F12 → larghezza **375**
2. **Servizio** → tab **"Mappa"** → sotto-vista **"Modifica"**

**B. Risultato atteso**
- L'editor con la griglia **non compare**.
- Al suo posto c'è il messaggio: *"Da mobile la modifica della sala è nascosta: passa alla vista
  Servizio per assegnare i tavoli."*
- A **834** e **1280** l'editor torna, con la griglia e il pulsante **"Aggiungi tavolo"**.

**C. Elementi importanti**
- Nel codice esistono **due messaggi diversi** per la stessa cosa; a schermo ne deve comparire
  **uno solo**. Se ne vedi due, è una pulizia da fare (lavoro `L7`).

---

### T12 — La legenda dei 5 colori è leggibile e coerente 🟡

**A. Sequenza di click**
1. Prepara **4 prenotazioni** con i quattro orari della tabella §0.4, assegnate a 4 tavoli diversi
2. **Servizio** → vista **"Servizio"**, guarda la legenda in alto e i tavoli sotto

**B. Risultato atteso**
- Sopra la piantina ci sono **5 etichette**: **Libero** (verde) · **In arrivo** (azzurro) ·
  **Occupato** (giallo) · **In ritardo** (rosso) · **In uscita** (viola).
- Ogni tavolo ha **il colore giusto** rispetto al suo orario.
- I nomi e i colori si **leggono bene** anche a 375px.

**C. Elementi importanti**
- Aspetta **30 secondi** senza toccare nulla e guarda un tavolo "In arrivo" il cui orario sta per
  passare: deve diventare **Occupato da solo**, senza ricaricare.
- ⚠️ **Voce ritirata dalla vecchia checklist:** *"il colore in piantina e quello in elenco
  coincidono"* — la **vista Lista non mostra nessun colore di stato**, solo la vista Servizio. Non
  c'è niente da confrontare, salta quella voce.

---

### T13 — Il badge percentuale del Calendario 🟡 ⚠️ DA DECIDERE, NON SOLO DA GUARDARE

**A. Sequenza di click**
1. Sidebar **"Calendario"** → vista **Giorno** su un giorno con almeno una prenotazione accettata
2. Guarda il badge di occupazione (es. «8 / 128»)
3. Passa alla vista **Mese** e guarda le percentuali

**B. Risultato atteso (da confermare tu)**
- In vista **Giorno**, con i tavoli attivi, il totale sono **i posti fisici del locale**.
- In vista **Mese**, la percentuale compare **solo se hai impostato i coperti massimi sulle fasce**;
  senza quelli non compare nulla.

**C. Elementi importanti**
- ⚠️ **Qui serve una tua decisione, non una spunta.** La vecchia checklist dava per scontato che il
  totale fossero sempre "i posti di tutto il locale". Nel codice **la vista Mese somma invece i
  coperti massimi delle fasce** e ha bisogno del limite acceso. Le due viste **non contano allo
  stesso modo**. Dimmi quale delle due è quella giusta e diventa un lavoro (`L8`).

---

## BLOCCO 4 — Non rovinare i clienti Classic (~20 min)

Da fare **loggato come `testc@c.com`** (Classic).

---

### T14 — Il Classic non vede niente di nuovo 🔴

**A. Sequenza di click**
1. Esci dall'account Pro, entra come **`testc@c.com`**
2. Guarda la schermata subito dopo il login
3. Naviga: Calendario → Prenotazioni → Archivio → Menu → Impostazioni
4. Tieni aperto **F12 → scheda Console** durante tutta la navigazione

**B. Risultato atteso**
- **Non esiste nessuna barra laterale**: il Classic apre direttamente le prenotazioni a tutta pagina.
  Quindi non c'è nemmeno la voce **Servizio**, né CRM, né Analytics, né la Home con i riquadri.
- Il **Calendario** funziona come sempre; l'occupazione «N / M» compare sulle fasce **che hanno un
  limite impostato** (senza limite non compare: è il comportamento storico, non una regressione).
- Nella **Console** non deve comparire **nessuna riga rossa**.

**C. Elementi importanti**
- Righe **gialle** (warning) si possono ignorare; contano solo le **rosse**.
- Se vedi comparire una sidebar, è grave: vuol dire che una funzione Pro è arrivata a un cliente
  Classic. Fotografa e fermati.

---

### T15 — Il form pubblico Classic accetta e rifiuta come prima 🔴

**A. Sequenza di click**
1. Incognito su `http://localhost:5173/prenota/test-classic`
2. Invia **una** prenotazione normale, dentro gli orari e sotto il limite
3. **Aspetta 2-3 minuti** (rate limit!)
4. Invia una seconda prenotazione **oltre il limite di coperti** della fascia

**B. Risultato atteso**
- La prima passa, con messaggio di conferma.
- La seconda viene rifiutata con: *"Questa fascia oraria è al completo per la data scelta. Prova un
  altro orario o un altro giorno."* — e l'errore si aggancia al campo **"Ora *"**.
- Nessuna delle due sparisce nel nulla: la prima la ritrovi nell'admin Classic.

**C. Elementi importanti**
- ⚠️ **Rispetta le pause fra un invio e l'altro.** 6 invii in 10 minuti e ti blocchi da solo per
  **24 ore**, anche i tentativi rifiutati contano.
- Se metti un orario fuori dalle fasce vedi invece: *"L'orario scelto non rientra negli orari di
  servizio. Scegli una fascia valida."* Anche questo è corretto.

---

### T16 — L'intervallo di arrivo cambia gli orari proposti 🟡

**A. Sequenza di click**
1. Torna **Pro** (`tomas@t.com`) → **Servizio** → **"Fasce orarie"** → matita su Cena
2. Campo **"Intervallo di arrivo"** → scegli **"15 minuti"** → **"Salva modifiche"**
3. Incognito su `/prenota/da-tommaso` → apri la tendina dell'orario
4. Torna in admin, metti **"60 minuti"**, salva, ricarica il form pubblico

**B. Risultato atteso**
- Con **15 minuti**: gli orari proposti vanno di quarto d'ora in quarto d'ora.
- Con **60 minuti**: uno ogni ora.
- La tendina si aggiorna dopo un semplice **F5**, senza bisogno di riavviare niente.

**C. Elementi importanti**
- Il campo accetta anche **"Altro"** con un numero libero da **5 a 120** minuti.
- Rimetti il valore che avevi all'inizio quando hai finito.

---

## 4. Dove segnare gli esiti

Per ogni prova scrivi una riga così, e mandamela:

```
T4 — OK
T9 — KO: premendo "Sposta e assegna" il cliente A è rimasto anche su T2 (due tavoli).
     Ricaricando la pagina è sparito da uno dei due.
```

Se una prova è **KO**, non correggere niente da solo: serve la schermata e la sequenza esatta.

---

## 5. Cosa NON devi rifare (già dimostrato da un test nel browser vero)

Queste 38 voci della vecchia checklist sono coperte da test che **girano davvero nel browser** e
asseriscono esattamente il comportamento descritto. Rifarle a mano è tempo perso.

| Argomento | Test che lo dimostra |
|---|---|
| Toggle Servizio/Modifica, editor che appare e sparisce | `src/pages/__tests__/ServizioPage.dueViste.test.tsx:87-117` |
| Click su tavolo occupato in piantina → riquadro + "Libera tavolo" | `e2e/pro/pro-service-tables-lifecycle.spec.ts:1000-1033` |
| Avviso fine turno: si apre da solo, ora giusta, "Libero", "Ancora occupato", "Decido dopo" | stessa spec, `:616-852` |
| I 5 stati in sequenza, cambio automatico senza ricaricare | stessa spec, `:1152-1212` |
| Turni esauriti, campo Motivo, "Assegna comunque" | stessa spec, `:487-609` |
| Tavolata multi-tavolo: contatore, "Mancano N posti", Annulla libera tutti | stessa spec, `:963-1138` |
| Walk-in su tavolo occupato, doppia conferma, reset al cambio tavolo | stessa spec, `:349-481` |
| Chiudo una fascia → il cliente non la vede più | stessa spec, `:283-343` |
| Bottoni fine turno dentro lo schermo a 375px | stessa spec, `:1272-1334` |
| Modali sala/tavolo/walk-in/assegna leggibili a 375/834/1280 | `e2e/pro/pro-service.spec.ts:241-352` |
| Form pubblico Classic: invio buono e invio oltre cap | `e2e/public-booking-classic.spec.ts:270-364` |
| Calendario Classic ignora i tavoli in cache | `src/.../calendario.adminBlindatura.test.tsx:410-430` |
| Briefing: fasce reali incluse quelle a cavallo di mezzanotte, orari non spostati, nomi tavoli separati da virgola | `useShiftBriefing.test.tsx:143-354` |
| Limite walk-in morbido (avvisa, non blocca) | `walkIn.b2.test.tsx:290-317` |
| D38 acceso/spento a livello di logica | `useCapacityCheck.tableMode.test.ts:174-195` |

---

## 6. Voci della vecchia checklist da buttare

| Voce | Perché |
|---|---|
| §3 — *"Tavolo occupato: conferma la sostituzione" / "Libera e assegna"* | La schermata non esiste più: oggi sono **tre scelte**. → sostituita da **T9** |
| §3 — *"Il colore in piantina e quello in elenco coincidono"* | La **vista Lista non mostra colori di stato**. Niente da confrontare. |
| §4 — *badge % «posti di tutto il locale»* | Le viste Giorno e Mese contano in modo diverso. → diventa **T13**, decisione aperta |
| §10 — *buffer di riassetto 10 minuti* | Nel database il valore di default è **0**, non 10. → decisione aperta, lavoro `L6` |
