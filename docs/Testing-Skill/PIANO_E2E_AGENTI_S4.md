# Piano e2e S4 — istruzioni per gli agenti tester (Playwright MCP)

> **Chi legge questo file:** un agente automatico che guida un browser con **Playwright MCP** dentro
> Cursor. Ogni agente esegue **una sola corsia** (A, B, C o D). Le quattro corsie girano **in parallelo**.
>
> **Scopo:** eseguire al posto di Matteo il collaudo di
> [COLLAUDO_S4_CHECKLIST.md](COLLAUDO_S4_CHECKLIST.md), così che a lui resti solo la
> **controverifica** delle prove raccolte, non l'esecuzione dei test.
>
> Aggiornato: **02-08-2026** · Ambiente: **TEST** (`docnnernvpyrbwuzzach`) · Branch: `env/test`

---

## 1. Regole assolute — non negoziabili

Se una di queste regole ti impedisce di procedere, **fermati e scrivilo nel report**. Non aggirarla.

1. **Solo TEST.** Prima di qualunque azione apri `.env.local.test` e verifica che
   `VITE_SUPABASE_URL` contenga **`docnnernvpyrbwuzzach`**.
   Se contiene **`rwuxgvld`** (produzione) → **FERMATI IMMEDIATAMENTE**, non fare nulla, segnalalo.
2. **Non modificare il codice sorgente.** Nessun file in `src/`, `supabase/`, `scripts/`, nessuna
   configurazione. Se trovi un bug lo **descrivi**, non lo correggi. Quattro agenti che editano lo
   stesso repo in parallelo lo distruggono.
3. **Nessun `git add`, `git commit`, `git push`, `git checkout`, `git stash`.** Mai.
4. **Nessun comando di migrazione o scrittura DB da riga di comando.** Niente `supabase db push`,
   niente `psql`, niente `npm run seed:*` (i seed scrivono su dati condivisi con le altre corsie).
   Tutte le scritture avvengono **passando dall'interfaccia dell'app**, come farebbe un utente.
5. **Tocca solo le TUE risorse.** Ogni corsia ha un prefisso (`AG-A`, `AG-B`, …). Non creare,
   modificare o cancellare sale, tavoli, fasce o prenotazioni che non portano il tuo prefisso.
6. **Non cancellare niente a fine corsa.** I dati che crei servono a Matteo per la controverifica.
   Ripristina **solo** le impostazioni globali che hai cambiato (vedi §7).
7. **Non dedurre esiti.** Se non hai visto la schermata con i tuoi occhi (snapshot/screenshot), non
   scrivere «OK». Scrivi `NON VERIFICATO` e spiega perché. Un falso «OK» è peggio di un test saltato.

---

## 2. Prerequisiti d'ambiente

### 2.1 Server di sviluppo — uno solo, condiviso

Le quattro corsie usano **lo stesso** server su `http://localhost:5173`.

1. Apri `http://localhost:5173/login`.
2. **Se risponde** → è già avviato da Matteo o da un'altra corsia. **Non avviarne un altro.**
3. **Se non risponde** → avvia `npm run dev` **in background** e riprova dopo qualche secondo.
   Se la porta risulta occupata ma la pagina non carica, fermati e segnalalo: non cambiare porta,
   le altre corsie si aspettano la 5173.

### 2.2 Credenziali

Stanno in **`.env.local.test`** (gitignored, mai copiarle nel report, mai stamparle a video).

| Corsia | Utente | Variabili |
|--------|--------|-----------|
| A, B, C, D (parte Pro) | admin Pro del tenant `da-tommaso` | `E2E_PRO_ADMIN_EMAIL` / `E2E_PRO_ADMIN_PASSWORD` |
| D (parte Classic) | admin Classic | **prima** coppia `E2E_CLASSIC_ADMIN_EMAIL` / `E2E_CLASSIC_ADMIN_PASSWORD` del file |

> ⚠️ **Trappola nota:** in `.env.local.test` le chiavi `E2E_CLASSIC_ADMIN_EMAIL`,
> `E2E_CLASSIC_ADMIN_PASSWORD` e `E2E_CLASSIC_TENANT_SLUG` compaiono **due volte**. La seconda coppia
> punta a un tenant **Pro** (`test-pro`), non Classic. Per la corsia Classic usa la **prima** coppia
> (`test-classic`). Verifica di essere davvero su un Classic: dopo il login la voce **Servizio**
> **non** deve comparire nel menu. Se compare, sei sul tenant sbagliato → fermati e segnalalo.

### 2.3 Un browser per corsia

Se due agenti condividono la stessa istanza di Playwright MCP, comandano **la stessa finestra** e si
pestano i piedi a vicenda.

**Prova di isolamento, da fare come primo passo:** dopo il login, apri `/admin/servizio` e prendi uno
snapshot. Poi ripetilo dopo ~30 secondi senza fare nulla. Se nel frattempo la pagina è cambiata da
sola (altra sezione, altra modale aperta, altro tenant), **non sei isolato**: scrivilo subito nel
report e **fermati**. Matteo dovrà lanciare le corsie a due a due o in finestre separate.

### 2.4 Stato del repo

`git status` deve essere pulito sul branch `env/test`. Se è sporco, **non toccare niente**:
annotalo nel report e prosegui solo con i test (che non toccano file).

---

## 3. Contratto di isolamento fra corsie

Il pannello Servizio filtra le prenotazioni per **(data + fascia oraria)**. È questa coppia a tenere
separate le corsie: due corsie sulla stessa fascia ma su **date diverse** non si vedono a vicenda.

| Corsia | Sala | Tavoli (nome · posti) | Data di lavoro | Fascia |
|--------|------|------------------------|----------------|--------|
| **A** | `AG-A Sala` | `A-T1`·2, `A-T2`·4, `A-T3`·4, `A-T4`·6 | **oggi + 7 giorni** | una fascia **esistente**, in sola lettura |
| **B** | `AG-B Sala` | `B-T1`·2, `B-T2`·4, `B-T3`·4, `B-T4`·6 | **oggi** | **propria** (vedi §6.B.1) |
| **C** | `AG-C Sala` | `C-T1`·5, `C-T2`·5, `C-T3`·4, `C-T4`·2 | **oggi + 5 giorni** | una fascia **esistente**, in sola lettura |
| **D** | `AG-D Sala` | `D-T1`·4, `D-T2`·6 | **oggi + 10 giorni** | **propria** `AG-D` |

**Prefisso dei nomi cliente:** ogni prenotazione che crei si chiama `[X] Cognome`, dove X è la lettera
della tua corsia. Esempio: `[B] Rossi`, `[C] Bianchi`.

### Chi può modificare cosa

| Risorsa | Proprietario | Le altre corsie |
|---------|--------------|-----------------|
| Fasce orarie **esistenti** (Pranzo, Cena, …) | **nessuno** — non si toccano mai | sola lettura |
| Fascia `AG-B` + il suo `max_turns` | **B** | non la usano |
| Fascia `AG-D` + suoi orari / intervallo di arrivo / `max_turns = 0` | **D** | non la usano |
| Interruttore D38 «Mantieni anche il limite coperti della fascia» (**è di tutto il ristorante**) | **D** | nessun'altra lo tocca |
| Card «Limite coperti walk-in» | **B** | nessun'altra la tocca |
| Sale e tavoli `AG-*` | la corsia omonima | non li toccano |
| Form pubblico `/prenota/da-tommaso` | **D** | le altre non ci prenotano |

> **Effetto collaterale atteso:** la corsia D accende per pochi minuti l'interruttore D38. In quella
> finestra le altre corsie potrebbero vedere un **avviso di capienza** inatteso creando prenotazioni.
> **Non è un bug:** annotalo e prosegui. L'avviso non deve mai bloccare l'operazione — se invece
> **blocca**, quello sì è un bug e va scritto.

---

## 4. Come si fanno le cose (procedure comuni)

Sono i mattoni richiamati dalle corsie. Le stringhe fra virgolette sono **letterali**: se non le
trovi a schermo, è già un risultato da annotare.

### P1 — Login
1. `http://localhost:5173/login`
2. Campo «Email» → l'email della tua corsia · Campo «Password» → la password
3. Pulsante «Accedi» → attendi la comparsa della barra laterale di navigazione.

### P2 — Aprire Servizio
Barra laterale → **Servizio**. L'URL diventa `/admin/servizio`. In alto: titolo «Servizio» e i due
tab **«Lista»** e **«Mappa»**.

### P3 — Creare la tua sala e i tuoi tavoli
1. Tab **«Mappa»** → toggle **«Modifica»**.
2. Pulsante **«Nuova sala»** → nome esatto dalla tabella §3 → salva.
3. Con la tua sala selezionata nelle linguette, usa **«Aggiungi tavolo»** (o «Aggiungi tavolo in
   questa sala» dal tab Lista) per ogni tavolo: nome e posti dalla tabella §3.
4. I tavoli nuovi nascono **quadrati** ed è corretto (decisione D44).

### P4 — Creare una fascia oraria (solo corsie B e D)
Tab «Lista» o «Mappa», in fondo alla pagina c'è il riquadro **Fasce orarie** → pulsante
**«Aggiungi fascia»** → si apre «Nuova fascia oraria». Compila nome, orario di inizio e fine,
«Turni massimi per tavolo», «Intervallo di arrivo» → salva.

> Le fasce **non possono sovrapporsi**: se salvando compare un messaggio del tipo *«Le fasce X e Y si
> sovrappongono»*, scegli un'altra finestra oraria e **annota nel report quale hai usato davvero**.

### P5 — Creare una prenotazione da admin
1. Barra laterale → **Calendario**.
2. Seleziona il giorno assegnato alla tua corsia (§3).
3. Pulsante **«Nuova prenotazione il GG/MM»**.
4. Compila: nome cliente `[X] Cognome`, numero di ospiti, orario **dentro la tua fascia**.
5. Salva. La prenotazione creata da admin nasce **già accettata**. Se invece la trovi «in attesa»,
   vai in **Prenotazioni** e accettala: senza accettazione non compare in Servizio.

### P6 — Assegnare una prenotazione a un tavolo (senza trascinamento)
In Servizio → **Mappa** → vista **Servizio**, scegli **Data** e **Fascia oraria** in alto. Nella
colonna di sinistra, sotto «Prenotazioni (N)», ogni card ha un pulsante **«Assegna»**: apre la modale
«Assegna tavolo». Clicca i tavoli (selezione multipla) e conferma con **«Assegna tavolo»** o
**«Assegna N tavoli»**.

> **Il trascinamento (drag & drop) è la strada alternativa, non quella principale.** La mappa usa
> dnd-kit e gli strumenti di automazione spesso non riescono a innescarlo. Se provi a trascinare e
> non succede nulla, **non scrivere che la funzione è rotta**: scrivi
> `NON VERIFICABILE — limite dello strumento`, e ottieni lo stesso risultato con il pulsante
> «Assegna». Il drag va provato **una volta sola** per corsia, e solo dove la checklist lo richiede.

### P7 — Leggere lo stato di un tavolo
Cinque stati, sempre con questi nomi e colori:

| Etichetta | Colore | Significato |
|-----------|--------|-------------|
| **Libero** | verde | nessuno |
| **In arrivo** | azzurro | prenotazione futura assegnata |
| **Occupato** | giallo | ora di arrivo passata |
| **In ritardo** | rosso | oltre la soglia di ritardo (default 15 minuti) |
| **In uscita** | viola | finestra di occupazione finita (arrivo + durata + buffer) |

La legenda dei cinque stati è **sopra la piantina**. L'orologio interno si aggiorna **ogni 30
secondi**: per verificare un cambio di stato automatico **aspetta almeno 40 secondi senza ricaricare**
la pagina e riprendi lo snapshot.

### P8 — Misurare l'overflow orizzontale (test responsive)
Imposta la dimensione della finestra (375×812, 834×1194, 1280×800), poi valuta in pagina:

```js
document.documentElement.scrollWidth <= window.innerWidth + 1
```

`true` = la pagina **non** si allarga (atteso). `false` = overflow → è un difetto, con screenshot.
Attenzione: la **piantina** deve poter scorrere lateralmente **dentro il suo riquadro** — questo è
corretto e non conta come overflow della pagina.

### P9 — Raccogliere gli errori di console
Prima di ogni sequenza, azzera/leggi i messaggi di console del browser e riportali a fine sezione.
Ignora `Failed to load resource` e `favicon`. Tutto il resto va nel report **testuale**.

### P10 — Prove (screenshot)
Salva in `docs/_lavoro/e2e-s4/corsia-<X>/` (cartella **gitignored**, crea tu i percorsi) con nome
`<id-voce>.png` — esempio `docs/_lavoro/e2e-s4/corsia-B/2.2-1.png`.
Uno screenshot **per ogni voce** con esito diverso da `NON APPLICABILE`.

---

## 5. Formato del report (obbligatorio)

Ogni corsia scrive **un solo file**:
`docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_<X>.md`

Nessuna corsia tocca la checklist `COLLAUDO_S4_CHECKLIST.md`: la aggiorna un passaggio finale di
consolidamento, dopo che tutte hanno finito.

Struttura:

```markdown
# Corsia <X> — <titolo> · report e2e

- Eseguita il: <data e ora inizio → fine>
- Ambiente verificato: VITE_SUPABASE_URL → docnnernvp… ✅
- Sala/tavoli creati: …
- Fascia usata: <nome> (<orari>)  · Data di lavoro: <yyyy-mm-dd>
- Isolamento browser: OK / SOSPETTO (dettagli)

## Esiti

| ID | Voce della checklist | Esito | Cosa ho visto | Prova |
|----|----------------------|-------|---------------|-------|
| 2.1-1 | toggle Servizio\|Modifica … | OK | … | corsia-A/2.1-1.png |

Esiti ammessi: **OK** · **KO** · **NON VERIFICABILE** (limite dello strumento) ·
**BLOCCATO** (precondizione mancante) · **NON APPLICABILE**.

## Bug trovati
Per ognuno: cosa doveva succedere, cosa è successo, passi esatti per riprodurlo, screenshot,
eventuali errori di console.

## Errori di console
…

## Cosa deve ricontrollare Matteo
Elenco corto e concreto: le voci KO, le NON VERIFICABILE, e i giudizi che restano suoi
(leggibilità, gusto, PDF aperto a mano).

## Stato lasciato sull'ambiente
Cosa resta creato (sala, tavoli, fascia, prenotazioni) e quali impostazioni globali ho ripristinato.
```

**Regola di fermata:** se ti blocchi su una voce, riprova al massimo **3 volte**, poi segna
`BLOCCATO` con il motivo e **passa alla voce successiva**. Non improvvisare percorsi alternativi non
previsti, non modificare configurazioni di altre corsie per sbloccarti.

---

## 6. Le quattro corsie

Gli **ID** (`2.1-1`, `3-4`, …) corrispondono all'ordine dei riquadri da spuntare nella sezione
omonima di [COLLAUDO_S4_CHECKLIST.md](COLLAUDO_S4_CHECKLIST.md): servono a rimettere insieme i
risultati alla fine.

---

### Corsia A — Le due viste della mappa (checklist §2.1)

**Setup:** P1 → P2 → P3 (sala `AG-A Sala`, tavoli `A-T1..A-T4`) → P5 due prenotazioni su
**oggi + 7 giorni** (`[A] Rossi` 4 coperti, `[A] Bianchi` 2 coperti) su una fascia **esistente**
(annota quale). → P6: assegna `[A] Rossi` a `A-T2`.

Prima di partire verifica che sulla coppia (data oggi+7, fascia scelta) **non ci siano già altre
prenotazioni**. Se ce ne sono, sposta la data a oggi+8 e annotalo.

| ID | Cosa verificare | Atteso |
|----|-----------------|--------|
| 2.1-1 | Servizio → tab «Mappa» | In alto compare il toggle **«Servizio»/«Modifica»** e la pagina apre su **Servizio**. Sotto, la piantina della sala **senza griglia di sfondo**, con i tavoli nelle posizioni salvate. |
| 2.1-2 | Contenuto della piantina | Ogni tavolo mostra il **nome**; se occupato anche **nome cliente** e «N cop.»; se libero «N posti». Sopra la piantina la **legenda dei 5 stati** (Libero, In arrivo, Occupato, In ritardo, In uscita). |
| 2.1-3 | Clicca **«Modifica»** | Compare l'editor con la **griglia**, i tavoli trascinabili e «Aggiungi tavolo». La piantina **sparisce**: non devono vedersi due mappe insieme. |
| 2.1-4 | Sposta `A-T3` in Modifica, poi torna su **«Servizio»** | L'editor sparisce, torna la piantina e `A-T3` è **nella nuova posizione**. |
| 2.1-5 | Clicca su `A-T2` (occupato) nella piantina | Si apre un riquadro con nome cliente, coperti, «arrivo HH:MM» e il pulsante **«Libera tavolo»**. Premilo: il tavolo torna **Libero** e la prenotazione **non sparisce** (ricontrolla in Calendario che `[A] Rossi` ci sia ancora). |
| 2.1-6 | Larghezza **375** sulla vista Servizio | La piantina scorre **dentro il suo riquadro**; la pagina **non** va in overflow (P8). |

Chiudi con P9 (errori di console) e P10.

**Non fare:** non toccare fasce, non toccare sale/tavoli che non iniziano per `A-`, non usare il form
pubblico.

---

### Corsia B — Servizio dal vivo: stati, fine turno, walk-in, briefing (checklist §2.2, §3, §5, §6 e la riga briefing di §2.3)

È la corsia che dipende dall'**orologio**: lavora su **oggi**.

#### B.1 — Scelta della fascia (fai questo per primo)

1. Guarda le fasce esistenti nel riquadro «Fasce orarie».
2. **Se l'ora attuale cade dentro una fascia esistente** → usa **quella**, in sola lettura, e
   **non creare nulla**. Annota quale.
   In questo caso `max_turns` non è tuo: la voce **3-6 «Turni esauriti»** diventa `BLOCCATO`
   (motivo: la fascia attiva è condivisa e non posso modificarla) — a meno che tu riesca a creare una
   fascia `AG-B` in una finestra libera che contenga comunque l'ora attuale.
3. **Altrimenti** crea con P4 la fascia **`AG-B`** su una finestra di **3 ore che contiene l'ora
   attuale** e non si sovrappone a nessuna esistente (es. adesso 16:20 → `AG-B` 15:00–18:00),
   con «Turni massimi per tavolo» = **2** e «Intervallo di arrivo» = **15**.
4. Annota nel report la fascia effettivamente usata e i suoi orari.

**Setup:** P1 → P2 → P3 (sala `AG-B Sala`, tavoli `B-T1..B-T4`) → B.1.

#### B.2 — Stati dei tavoli (checklist §3)

Crea le prenotazioni con P5 **su oggi**, dentro la tua fascia, con questi orari relativi a «adesso»:

| Prenotazione | Ospiti | Orario | Serve per |
|--------------|--------|--------|-----------|
| `[B] Arrivo` | 2 | **fra 20–30 minuti** | stato **In arrivo** |
| `[B] Presente` | 4 | **5 minuti fa** | stato **Occupato** |
| `[B] Ritardo` | 4 | **25 minuti fa** | stato **In ritardo** (oltre la soglia di 15') |
| `[B] Uscita` | 6 | **3 ore fa** | stato **In uscita** (fine finestra di occupazione) |

Se l'intervallo di arrivo non ti lascia scegliere il minuto esatto, prendi l'orario selezionabile più
vicino e **annota lo scarto**.

Assegna con P6: `[B] Arrivo`→`B-T1`, `[B] Presente`→`B-T2`, `[B] Ritardo`→`B-T3`, `[B] Uscita`→`B-T4`.

| ID | Cosa verificare | Atteso |
|----|-----------------|--------|
| 3-1 | `B-T1` | **In arrivo** (azzurro) |
| 3-2 | `B-T2` senza ricaricare la pagina | Passa a **Occupato** (giallo) **da solo**. Se al momento dell'assegnazione era già Occupato, prova diversamente: assegna `[B] Arrivo` a un tavolo con orario **fra 1 minuto** e aspetta ≥40 secondi (P7). |
| 3-3 | `B-T3` | **In ritardo** (rosso) |
| 3-4 | `B-T4` | **In uscita** (viola) → e parte l'avviso di B.3 |
| 3-5 | Confronto piantina ↔ vista a elenco | Stesso colore e stessa etichetta per lo stesso tavolo nelle due viste. (L'elenco è la vista dell'assegnazione: se non riesci a metterle a confronto, screenshot di entrambe.) |
| 3-6 | **Turni esauriti** — solo se la fascia è tua | Porta `max_turns` della fascia `AG-B` a **1**, poi assegna **due** prenotazioni diverse allo stesso tavolo. Alla seconda compare **«Turni esauriti per questo tavolo»** con il campo **«Motivo (opzionale)»** e i pulsanti **«Assegna comunque»** / **«Annulla»**. *Annulla* non assegna; *Assegna comunque* sì. **Riporta poi `max_turns` a 2.** |
| 3-7 | **Tavolo occupato** | Nella modale «Assegna tavolo» clicca un tavolo **già occupato**: compare **«Tavolo occupato: conferma la sostituzione»** con **«Libera e assegna»**. Confermando, il nuovo cliente prende il tavolo e **il precedente torna nell'elenco «Prenotazioni» da assegnare**, senza sparire. |

#### B.3 — Avviso di fine turno (checklist §2.2)

| ID | Cosa verificare | Atteso |
|----|-----------------|--------|
| 2.2-1 | Apri Servizio → vista Servizio → scegli **oggi** e la tua fascia | Si apre **da sola** la finestra **«Tavolo a fine turno»** con sala·tavolo, nome cliente, «N coperti» e **«fine turno HH:MM»**. |
| 2.2-2 | L'ora di fine turno | Deve essere **arrivo + durata + buffer** in ora da orologio da muro. **Non** spostata di 2 ore. Calcola tu il valore atteso e scrivilo nel report accanto a quello letto. |
| 2.2-3 | Premi **«Ancora occupato»** | La finestra si chiude, il tavolo **resta occupato/in uscita** sulla mappa, e **ricaricando la pagina** l'avviso **non** ritorna per quel tavolo nella stessa fascia. |
| 2.2-4 | Porta un secondo tavolo a fine turno e premi **«Libero»** | Il tavolo diventa **Libero** (verde) e la prenotazione **resta** in Calendario (append-only: non sparisce). |
| 2.2-5 | Premi **«Decido dopo»** su un terzo tavolo, poi porta a fine turno **un altro** tavolo | L'avviso **ritorna**, elencando **entrambi** i tavoli ancora da gestire. |
| 2.2-6 | Cambia **fascia** (o giorno) e torna indietro | Gli avvisi già gestiti si azzerano: la finestra si ripresenta. È il comportamento voluto (è un altro servizio). |

> Se l'avviso elenca tavoli che **non** sono tuoi (dati vecchi sulla stessa fascia), ignorali nel
> giudizio ma **scrivilo** nel report.

#### B.4 — Walk-in (checklist §5)

Dalla **Home** (barra laterale → Home) c'è il riquadro **«Aggiungi walk-in»**.

| ID | Cosa verificare | Atteso |
|----|-----------------|--------|
| 5-1 | Walk-in da **4** **senza** assegnare tavolo | In **Calendario**, la fascia corrispondente conta **+4 coperti**. ✅ È corretto così: il walk-in toglie posti al pubblico anche senza tavolo. |
| 5-2 | Walk-in con tavolo **libero** (`B-T1` se libero) | Il tavolo diventa occupato e mostra il **nome del walk-in**. |
| 5-3 | Walk-in su tavolo **occupato** | Il tavolo è selezionabile; il **primo** clic su «Aggiungi walk-in» mostra la spiegazione di cosa succederà, il **secondo** conferma. L'avviso è **stabile**, non lampeggia. |
| 5-4 | Cambia sala o tavolo dentro la modale | La conferma **si azzera**: devi ripremere due volte. |
| 5-5 | Limite walk-in | In Servizio, riquadro **«Limite coperti walk-in»**: imposta un limite basso (es. 2) e supera­lo. Deve **avvisare, non bloccare**. **Rimetti il valore di partenza** a fine prova (annota qual era). |
| 5-6 | Se compare «Nessuna fascia attiva adesso: non posso assegnare il walk-in al tavolo» | Significa che l'ora attuale non ricade in nessuna fascia: è coerente con B.1. Annotalo, non è un bug. |

#### B.5 — Briefing di turno (checklist §6, + riga briefing di §2.3)

Home → **«Briefing turno»** (il titolo della finestra è **«Briefing pre-turno»**). Il briefing mostra
**solo la giornata di oggi**.

| ID | Cosa verificare | Atteso |
|----|-----------------|--------|
| 6-1 | Filtro fascia | Elenca **le fasce reali del ristorante** (non «pranzo/cena» fissi) e include eventuali fasce che scavallano la mezzanotte. |
| 6-2 | Orari a video | Coincidono con gli orari delle prenotazioni `[B] *` create. **Nessuno spostamento di 2 ore.** |
| 6-3 | Colonna **Tavolo** | Con più sale mostra «Sala · Tavolo»; con una sola sala solo il nome del tavolo; se non assegnata «—». (Qui le sale sono più d'una: attendi il formato «Sala · Tavolo».) |
| 6-4 | Pulsante PDF | Scarica il file e **riporta il percorso** dove è finito. **Non giudicare il contenuto**: lo apre Matteo. Segna `SEMI — scaricato, da aprire`. |
| 2.3-8 | Tavolata su più tavoli nel briefing | Crea `[B] Tavolata` da **10** coperti oggi, assegnala con P6 a **due** tavoli insieme, poi apri il briefing: la riga deve mostrare **i nomi di tutti e due i tavoli separati da virgola**. |

Chiudi con P9 e P10.

**Non fare:** non toccare l'interruttore D38, non toccare fasce diverse da `AG-B`, non usare il form
pubblico, non toccare sale/tavoli che non iniziano per `B-`.

---

### Corsia C — Tavolate su più tavoli + responsive (checklist §2.3 e §9)

**Setup:** P1 → P2 → P3 (sala `AG-C Sala`, tavoli `C-T1`·5, `C-T2`·5, `C-T3`·4, `C-T4`·2) → P5 su
**oggi + 5 giorni**, fascia **esistente** (annota quale), prenotazione `[C] Ferrari` da **10 coperti**.
Verifica prima che quella coppia (data, fascia) sia vuota; se no, sposta a oggi+6 e annotalo.

#### C.1 — Tavolata su più tavoli (§2.3)

| ID | Cosa verificare | Atteso |
|----|-----------------|--------|
| 2.3-1 | Card di `[C] Ferrari` → **«Assegna»** | Si apre la modale **«Assegna tavolo»** con l'intestazione «[C] Ferrari · 10 coperti». |
| 2.3-2 | Clicca `C-T1` e `C-T2` | Su entrambi compare la **spunta**; il contatore dice **«Selezionati 2 tavoli · 10 posti su 10 richiesti»**. |
| 2.3-3 | Premi **«Assegna 2 tavoli»** | La prenotazione sparisce da «Prenotazioni» e compare **una sola riga** sotto **«Assegnate (1)»**, con **«10 coperti · C-T1, C-T2 (10 posti)»**. |
| 2.3-4 | Posti insufficienti | Crea `[C] Conti` da **12** coperti e assegnala a `C-T3` + `C-T4` (4+2=6): sotto la riga deve comparire **«Mancano 6 posti per questa tavolata.»** |
| 2.3-5 | **«Aggiungi tavolo»** sulla riga di `[C] Conti` | Si apre «Aggiungi tavolo alla tavolata»: `C-T3` e `C-T4` sono marcati **«Già in tavolata»** e **non cliccabili**; aggiungendone un altro il conteggio dei posti **sale** e i «Mancano N posti» **scendono**. |
| 2.3-6 | Piantina | Tutti i tavoli della stessa tavolata risultano occupati **dallo stesso nome cliente**. |
| 2.3-7 | **«Annulla»** subito dopo un'assegnazione multipla | Il pulsante «Annulla» accanto a «<nome> su <tavoli>» rimette **tutti** i tavoli liberi, non solo uno, e la prenotazione torna fra quelle da assegnare. |

*(la voce 2.3-8, briefing, la fa la corsia B: al briefing servono prenotazioni di oggi)*

#### C.2 — Responsive (§9)

Per **ognuna** delle tre larghezze **375 · 834 · 1280** ripeti le prove seguenti, con P8 per l'overflow
e uno screenshot per riga. Apri le modali **senza confermare nulla** dove non serve scrivere.

| ID | Schermata | Atteso |
|----|-----------|--------|
| 9-1 | Servizio → vista **Servizio** | Piantina scorrevole nel suo riquadro, pagina senza overflow. |
| 9-2 | Servizio → vista **Modifica** | Sotto 768px l'editor è **nascosto** e compare il messaggio «Da mobile la modifica della sala è nascosta: passa alla vista Servizio per assegnare i tavoli.» |
| 9-3 | Modale **sala** («Nuova sala») e modale **tavolo** | Leggibili, pulsanti raggiungibili senza uscire dallo schermo. **Chiudi con Annulla.** |
| 9-4 | Modale **walk-in** (Home → Aggiungi walk-in) | Leggibile, la conferma a due passaggi è raggiungibile. **Non confermare**: chiudi. |
| 9-5 | Modale **briefing** (Home → Briefing turno) | La tabella scorre **senza rompere** la pagina. |
| 9-6 | Modale **«Assegna tavolo»** (selezione multipla) | I tavoli restano cliccabili e visibili, il contatore è leggibile. |
| 9-7 | Finestra **«Tavolo a fine turno»** | I pulsanti «Libero» e «Ancora occupato» **non escono** dallo schermo. Se non riesci a farla comparire (dipende dall'orologio, è la corsia B ad averla), segna `NON APPLICABILE — verificata dalla corsia B` e chiedi a B lo screenshot. |

Chiudi con P9 e P10.

**Non fare:** non modificare **nessuna** fascia, non toccare l'interruttore D38, non usare il form
pubblico, non toccare sale/tavoli che non iniziano per `C-`.

---

### Corsia D — Capienza, coerenza col form pubblico, non-regressione Classic (checklist §4, §8, §7)

**Setup Pro:** P1 (Pro) → P2 → P3 (sala `AG-D Sala`, tavoli `D-T1`·4, `D-T2`·6, **10 posti in tutto**)
→ P4: crea la fascia **`AG-D`** in una finestra libera (suggerita **16:15–17:45**; se si sovrappone,
scegline un'altra e annotala) con «Turni massimi per tavolo» = 2, «Intervallo di arrivo» = **30**,
e **limite coperti della fascia = 6**.
Data di lavoro: **oggi + 10 giorni**.
Form pubblico: `http://localhost:5173/prenota/da-tommaso`.

#### D.1 — Capienza e D38 (§4)

| ID | Cosa verificare | Atteso |
|----|-----------------|--------|
| 4-1 | Assegna più coperti dei posti (es. prenotazione da 8 su `D-T1` da 4) | Compare un **avviso**, **mai un blocco**: l'operazione si può portare a termine. |
| 4-2 | **D38 spento** (default) | In Servizio → Fasce, l'interruttore **«Mantieni anche il limite coperti della fascia»** è **spento**. Con 10 posti di tavoli e limite fascia 6, il sistema usa **10**: dal form pubblico una prenotazione che porta il totale a **7** coperti nella fascia `AG-D` viene **accettata**. |
| 4-3 | **D38 acceso** | Accendi l'interruttore. Ora vale il **minore fra i due**, cioè **6**: la stessa prenotazione per il 7° coperto viene **rifiutata** dal form pubblico, con un messaggio chiaro. |
| 4-4 | **Rimetti D38 spento** | Il 7° coperto torna ad essere **accettato**. ⚠️ Questo ripristino è obbligatorio: l'interruttore è di tutto il ristorante. |
| 4-5 | Badge percentuale in **Calendario** | Riflette il limite attivo (con D38 acceso la percentuale è calcolata su 6, spento su 10). |

> Tieni la finestra con D38 **acceso** più corta possibile e annota l'orario di accensione e di
> spegnimento nel report: serve alle altre corsie per interpretare eventuali avvisi anomali.

#### D.2 — Coerenza Prenota ↔ configurazione admin (§8)

Tutte le modifiche **solo** sulla fascia `AG-D`.

| ID | Cosa verificare | Atteso |
|----|-----------------|--------|
| 8-1 | Cambia gli **orari** di `AG-D` da admin, poi ricarica il form pubblico | Il form mostra i **nuovi** orari. |
| 8-2 | Cambia l'**intervallo di arrivo** (30 → 15 → 60) | Gli orari selezionabili dal cliente cambiano di conseguenza (ogni 15', ogni 60'…). |
| 8-3 | **Chiudi la fascia**: `max_turns = 0` | Il cliente **non** può più prenotare in quella fascia. **Poi riporta `max_turns` a 2.** |
| 8-4 | Prenotazione fatta **dal form pubblico** | Compare in **Calendario** *e* fra le «Prenotazioni» da assegnare in **Servizio**, con l'**orario giusto** (nessuno spostamento di fuso). Se nasce «in attesa», accettala da Prenotazioni e verifica che poi compaia. |

#### D.3 — Non-regressione Classic (§7)

**Esci** dall'account Pro e accedi con l'admin **Classic** (§2.2 — prima coppia, `test-classic`).

| ID | Cosa verificare | Atteso |
|----|-----------------|--------|
| 7-1 | Menu laterale | La voce **Servizio** **non** compare. Se compare, sei sul tenant sbagliato → fermati. |
| 7-2 | **Calendario** | Funziona come prima: vista Giorno, occupazione per fascia visibile **anche senza** limite impostato. |
| 7-3 | **Form pubblico** del tenant Classic (`/prenota/test-classic`) | Accetta una prenotazione valida e **rifiuta** una oltre il limite di fascia. |
| 7-4 | Console | **Nessun errore** durante la navigazione (P9). |

Chiudi con P9 e P10.

**Non fare:** non toccare sale/tavoli/fasce che non iniziano per `D-`/`AG-D`, non toccare il limite
walk-in, non lavorare su date diverse da oggi+10 sul tenant Pro.

---

## 7. Ripristini obbligatori a fine corsia

| Corsia | Da rimettere com'era |
|--------|----------------------|
| A | niente |
| B | `max_turns` della fascia `AG-B` → **2**; valore del **limite coperti walk-in** → quello di partenza (annotalo **prima** di cambiarlo) |
| C | niente (non deve aver modificato configurazioni) |
| D | interruttore **D38** → **spento**; `max_turns` di `AG-D` → **2**; orari e intervallo di arrivo di `AG-D` → quelli iniziali (annotali **prima**) |

Sale, tavoli e prenotazioni **restano**: servono a Matteo per la controverifica.

---

## 8. Cosa resta comunque a Matteo

Queste voci **non** vanno automatizzate. L'agente prepara il terreno, il giudizio è di Matteo.

1. **Le decisioni aperte** della §10 della checklist — soglia di ritardo (15'), buffer di riassetto
   (10'), durata del walk-in (D47). Non sono test: sono risposte di prodotto.
2. **Il contenuto del PDF del briefing** — l'agente lo scarica e dice dove sta; l'apertura e la
   lettura degli orari sono di Matteo (voce 6-4).
3. **Il giudizio estetico** — «leggibile», «raggiungibile», «non confuso». L'agente misura l'overflow
   e allega gli screenshot; il verdetto è di Matteo.
4. **Rollout in produzione e merge su `main`** — fuori da questo piano, richiede autorizzazione
   esplicita e non si tocca da qui.

---

## 9. Trappole note (leggile: ti risparmiano falsi allarmi)

- **Drag & drop:** dnd-kit spesso non si innesca dagli strumenti di automazione. Usa il pulsante
  «Assegna» (P6). Il fallimento del trascinamento **non** è un bug dell'app finché non lo prova una
  mano umana. In più, **sotto 768px il trascinamento dei tavoli è disattivato di proposito**: per la
  vista Modifica allarga a 1280px.
- **Turni: il buco di copertura del giro 1.** La prova «turni esauriti» era finita su una fascia con
  turni **«Illimitata»** (`max_turns = null`), dove il controllo non scatta mai — ed è proprio lì che
  si nascondeva `S4-BUG-2`. Chi rifà quella prova **deve** usare una fascia propria con un numero di
  turni **finito e basso** e **deve** includere la sequenza *assegno → libero il tavolo → riassegno lo
  stesso tavolo*: è il caso reale, non l'assegnazione doppia a tavolo occupato.
- **Orologio a 30 secondi:** i cambi di stato automatici non sono istantanei. Aspetta ≥40 secondi.
- **Ora spostata di 2 ore:** era un bug reale, corretto. Se lo rivedi, è una **regressione seria** →
  segnalo con orario atteso e orario letto, e allega lo screenshot.
- **La piantina mostra tutte le sale**, anche quelle delle altre corsie: guarda **solo** il riquadro
  della tua sala.
- **Avvisi di capienza inattesi** durante la finestra D38 della corsia D: attesi, non bug — a meno
  che **blocchino** l'operazione.
- **Fasce sovrapposte:** l'app le rifiuta di proposito. Non è un bug: scegli un'altra finestra.
- **Il tavolo che si libera non cancella la prenotazione:** il modello è append-only. Se dopo
  «Libero» la prenotazione **sparisce** dallo storico, *quello* è un bug.
- **`validate:docs` rosso** e altri debiti noti: non fanno parte di questo collaudo, ignorali.

---

## 10. Consolidamento (dopo che tutte e quattro hanno finito)

Un ultimo passaggio — **uno solo, non in parallelo** — legge i quattro report, riempie
`COLLAUDO_S4_CHECKLIST.md` (spunte e righe `→ esito:`), e scrive in fondo un riepilogo:
quante voci OK, quante KO, quante NON VERIFICABILE, e la lista dei bug ordinata per gravità.
Il prompt è nell'ultimo blocco di [PROMPT_AGENTI_E2E_S4.md](PROMPT_AGENTI_E2E_S4.md).
