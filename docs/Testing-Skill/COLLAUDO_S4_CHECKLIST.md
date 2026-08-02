# Collaudo S4 — Pagina Servizio · checklist unica

> **Documento unico di collaudo.** Sostituisce la checklist §10 del
> `Report-revisione-integrazione-S4-24-06-26.md` e le checklist sparse §9-ter / §9-quater.
> Da qui in poi si spunta **solo qui**.
>
> Aggiornato: **02-08-2026** · Ambiente: **TEST** (`docnnernvp`) · Branch: `env/test`
> Stato codice: `npm run validate` verde — 144 file / 1198 test.
>
> **Non devi eseguirla a mano.** Le sezioni 2→9 sono state trasformate in un piano per agenti con
> Playwright MCP: **[PIANO_E2E_AGENTI_S4.md](PIANO_E2E_AGENTI_S4.md)** (4 corsie in parallelo) con i
> prompt pronti in **[PROMPT_AGENTI_E2E_S4.md](PROMPT_AGENTI_E2E_S4.md)**. Gli agenti eseguono e
> raccolgono le prove; a te resta la **controverifica**. Restano comunque tuoi: le decisioni della
> §10, l'apertura del **PDF** del briefing e i giudizi di leggibilità.

---

## 0. Come si usa

1. Serve un account **Pro** su TEST, con almeno **una sala e 3–4 tavoli** di capienze diverse
   (es. T1=2, T2=4, T3=4, T4=6) e **due fasce** configurate (es. Pranzo e Cena).
2. Spunta `[x]` quando il comportamento atteso si verifica. Se non si verifica, **non spuntare**:
   scrivi cosa hai visto nella riga `→ esito:` sotto la voce.
3. Le voci **🔴 bloccanti** devono essere verdi prima di parlare di produzione.
   Le **🟡** possono diventare follow-up con una tua decisione esplicita.
4. Le larghezze da provare sono tre: **375** (telefono), **834** (tablet), **1280** (desktop).
   Si cambiano con F12 → icona telefono/tablet nel browser.

---

## 1. Già collaudato — NON rifare

Queste voci escono dalla lista perché le hai già provate tu e i fix richiesti sono stati applicati.
Restano qui solo come promemoria di cosa è coperto.

- ✅ **Tavolo nuovo nasce quadrato** (D44) — collaudato ok.
- ✅ **Elimina sala morbida** (D50) — collaudato; i 2 fix UI che avevi chiesto sono stati applicati
  (modifica sala apre direttamente la sala giusta; durante la conferma restano solo Sì/No).
- ✅ **Briefing con colonna Tavolo** (D52) — collaudato; i 2 bug che avevi trovato (filtro fascia
  vuoto, orari spostati di +2h) sono stati corretti. ⚠️ La **riprova degli orari** resta nella
  sezione 6: il fix è successivo al tuo test.
- ✅ **Pagina Servizio da telefono (375px)** — prima passata fatta il 24-06. La rifai solo sulle
  schermate nuove della sezione 2.

---

## 2. 🔴 Novità del 02-08-2026 — da provare per prime

Tre funzioni nuove, mai viste da te. Sono la parte più a rischio perché appena scritte.

### 2.1 Le due viste della mappa

- [ ] **Servizio → tab Mappa**: in alto compare il toggle **Servizio | Modifica**, e si apre su
      **Servizio**. Sotto vedi la **piantina della sala senza griglia**, con i tavoli nelle posizioni
      in cui li hai messi tu.
      `→ esito:`
- [ ] Nella piantina ogni tavolo mostra **nome, chi lo occupa e i coperti**; se libero mostra i posti.
      Sopra la piantina c'è la **legenda dei 5 colori**.
      `→ esito:`
- [ ] Clicchi **Modifica**: compare l'editor di prima (griglia di allineamento, tavoli trascinabili,
      pulsante Aggiungi tavolo) e la piantina sparisce. **Non devono più vedersi due mappe insieme.**
      `→ esito:`
- [ ] Torni su **Servizio**: l'editor sparisce e torna la piantina. Le posizioni dei tavoli
      spostate in Modifica si vedono subito anche in Servizio.
      `→ esito:`
- [ ] **Click su un tavolo occupato nella piantina**: si apre un riquadro con chi c'è, quanti
      coperti, l'orario di arrivo e il pulsante **Libera tavolo**. Il pulsante funziona.
      `→ esito:`
- [ ] 🟡 A **375px** la piantina si può scorrere lateralmente e la pagina **non** si allarga.
      `→ esito:`

### 2.2 Avviso di fine turno con conferma

Preparazione: assegna una prenotazione a un tavolo con orario **già passato** (es. oggi alle 12:00
se sono le 15:00), così il tavolo entra in "In uscita".

- [ ] Apri Servizio → vista Servizio → scegli quella data e fascia: si apre **da sola** una finestra
      **"Tavolo a fine turno"** con sala·tavolo, nome cliente, coperti e **ora di fine turno**.
      `→ esito:`
- [ ] L'ora di fine turno mostrata è **quella giusta** (non spostata di 2 ore).
      `→ esito:`
- [ ] Premi **"Ancora occupato"**: la finestra si chiude, il tavolo **resta occupato** sulla mappa,
      e ricaricando la pagina l'avviso **non** ritorna per quel tavolo nella stessa fascia.
      `→ esito:`
- [ ] Rifai la prova e premi **"Libero"**: il tavolo diventa verde/libero e la prenotazione **non
      sparisce** dallo storico (append-only).
      `→ esito:`
- [ ] Premi **"Decido dopo"**: la finestra si chiude. Se poi **un altro** tavolo arriva a fine turno,
      l'avviso **ritorna** con entrambi.
      `→ esito:`
- [ ] Cambi fascia o giorno: gli avvisi già gestiti si azzerano (è un altro servizio).
      `→ esito:`

### 2.3 Tavolata su più tavoli (la richiesta "10 persone su 2 tavoli da 5")

- [ ] Crea una prenotazione da **10 coperti**. In Servizio, sulla sua card premi **Assegna**.
      `→ esito:`
- [ ] Nella modale puoi selezionare **più tavoli**: cliccandone due compare la spunta su entrambi e
      il contatore dice **"Selezionati 2 tavoli · N posti su 10 richiesti"**.
      `→ esito:`
- [ ] Premi **"Assegna 2 tavoli"**: la prenotazione sparisce dalle "da assegnare" e compare **una
      sola riga** nella sezione **"Assegnate"** con **entrambi i tavoli** e i posti totali.
      `→ esito:`
- [ ] Se i posti non bastano compare **"Mancano N posti per questa tavolata"**.
      `→ esito:`
- [ ] Premi **"Aggiungi tavolo"** su quella riga: si apre la modale, i due tavoli già usati sono
      segnati **"Già in tavolata"** e non riselezionabili. Ne aggiungi un terzo e il conteggio sale.
      `→ esito:`
- [ ] In **piantina** tutti i tavoli della tavolata risultano occupati dallo stesso cliente.
      `→ esito:`
- [ ] Premi **Annulla** subito dopo un'assegnazione multipla: **tutti** i tavoli tornano liberi
      (non solo uno).
      `→ esito:`
- [ ] Apri il **briefing** di quella fascia: la riga mostra **i nomi di tutti i tavoli** separati da
      virgola.
      `→ esito:`

---

## 3. 🔴 Stati dei tavoli e turni

Questa è la parte su cui il 24-06 avevi scritto *"i tavoli non cambiano di stato in automatico"*.
Il timer automatico è stato aggiunto dopo il tuo test: **va riprovato da zero**.

- [ ] Assegna una prenotazione con arrivo **fra pochi minuti**: il tavolo è **In arrivo** (azzurro).
      `→ esito:`
- [ ] Passato l'orario di arrivo il tavolo diventa **Occupato** (giallo) **da solo**, senza ricaricare
      la pagina (l'orologio interno gira ogni 30 secondi).
      `→ esito:`
- [ ] Dopo la soglia di ritardo (default **15 minuti**) diventa **In ritardo** (rosso).
      `→ esito:`
- [ ] A fine durata + buffer diventa **In uscita** (viola) e parte l'avviso della sezione 2.2.
      `→ esito:`
- [ ] 🟡 Il colore nella **piantina** e quello nella **vista a elenco** coincidono sempre.
      `→ esito:`
- [ ] **Turni esauriti**: imposta `max_turns = 1` su una fascia, assegna due prenotazioni diverse
      allo stesso tavolo. Alla seconda compare l'avviso **"Turni esauriti"** con il campo Motivo e
      i pulsanti *Assegna comunque* / *Annulla*. Annulla non assegna; Assegna comunque sì.
      `→ esito:`
- [ ] **Tavolo occupato**: trascina una prenotazione su un tavolo già occupato. Compare
      **"Tavolo occupato: conferma la sostituzione"**. Con *Libera e assegna* il nuovo cliente prende
      il tavolo e il precedente **torna nel cassetto "da assegnare"**, senza sparire.
      `→ esito:`

---

## 4. 🔴 Capienza, limiti e D38

Il 24-06 avevi annotato *"nessun blocco se supero limite fasce orarie"*. Il comportamento **voluto**
è morbido: l'admin non viene mai bloccato, viene avvisato. Va verificato che l'avviso ci sia.

- [ ] Supera la capienza fisica dei tavoli assegnando più coperti dei posti: compare un **avviso**,
      mai un blocco. L'operazione si può completare.
      `→ esito:`
- [ ] **D38 OFF** (default): in Servizio → Fasce, l'interruttore *"mantieni anche il limite coperti
      della fascia"* è **spento**. Con tavoli per 10 posti e cap fascia 6, il sistema usa **10**.
      `→ esito:`
- [ ] **D38 ON**: accendi l'interruttore. Ora il sistema usa il **minore fra i due**, cioè **6**.
      Una prenotazione pubblica per il 7° coperto viene **rifiutata** dal form pubblico.
      `→ esito:`
- [ ] Rimetti D38 su **OFF** e verifica che il 7° coperto torni ad essere accettato.
      `→ esito:`
- [ ] 🟡 Il badge percentuale in Calendario riflette il limite attivo.
      `→ esito:`

---

## 5. 🟡 Walk-in

Il 24-06 avevi scritto *"ho eseguito questo test, non so se è corretto"*. Ecco il criterio esatto.

- [ ] **Walk-in senza tavolo** ("solo coperti"): crea un walk-in da 4 senza assegnare tavolo.
      In Calendario, la fascia corrispondente conta **+4 coperti**. ✅ È questo il comportamento
      corretto: il walk-in toglie sempre posti al pubblico anche senza tavolo.
      `→ esito:`
- [ ] **Walk-in con tavolo libero**: il tavolo diventa occupato e mostra il nome del walk-in.
      `→ esito:`
- [ ] **Walk-in su tavolo occupato**: il tavolo è selezionabile; il **primo** click su
      *Aggiungi walk-in* spiega cosa succederà, il **secondo** conferma. L'avviso è stabile,
      non lampeggia.
      `→ esito:`
- [ ] Cambiando sala o tavolo nella modale, la conferma **si azzera** (devi riconfermare).
      `→ esito:`
- [ ] Il limite walk-in configurato è **morbido**: avvisa, non blocca.
      `→ esito:`

---

## 6. 🔴 Briefing di turno

- [ ] Home → **Briefing turno**: il filtro fascia elenca **le tue fasce reali** (non "pranzo/cena"
      fissi) e include eventuali fasce che scavallano la mezzanotte.
      `→ esito:`
- [ ] Gli **orari a video sono corretti** (riprova del fix +2h: prendi una prenotazione delle 03:00
      e verifica che non mostri 05:00).
      `→ esito:`
- [ ] Colonna **Tavolo**: mono-sala mostra "T12"; multi-sala mostra "Sala · T12"; non assegnate "—".
      `→ esito:`
- [ ] Scarica il **PDF**: gli orari sono corretti anche lì.
      `→ esito:`
- [ ] 🟡 Nota: il PDF **non ha** la colonna Tavolo — è un follow-up già registrato, non un bug.

---

## 7. 🔴 Non regressione Classic

Da fare con un account **Classic** (senza Pro). Serve a garantire che S4 non abbia toccato i clienti
che già pagano.

- [ ] La voce **Servizio** non compare nel menu.
- [ ] Il **Calendario** funziona come prima: vista Giorno, occupazione per fascia visibile anche
      senza limite impostato.
      `→ esito:`
- [ ] Il **form pubblico** accetta e rifiuta come prima (prova una prenotazione buona e una oltre il
      limite di fascia).
      `→ esito:`
- [ ] **Nessun errore in console** durante la navigazione.
      `→ esito:`

---

## 8. 🔴 Coerenza Prenota ↔ configurazione admin

È il punto che il prossimo lavoro (Fable) approfondirà, ma il minimo va verificato ora.

- [ ] Cambia gli **orari di una fascia** da admin: il form pubblico mostra i nuovi orari.
      `→ esito:`
- [ ] Cambia l'**intervallo di arrivo** (15/30/60): gli orari selezionabili dal cliente cambiano
      di conseguenza.
      `→ esito:`
- [ ] **Chiudi una fascia** (`max_turns = 0`): il cliente non può più prenotare in quella fascia.
      `→ esito:`
- [ ] Una prenotazione fatta dal **form pubblico** compare in Calendario **e** fra le "da assegnare"
      in Servizio, con l'orario giusto.
      `→ esito:`

---

## 9. 🟡 Responsive — 375 / 834 / 1280

Da ripetere per ogni larghezza. Mai spuntato finora se non su Servizio a 375.

- [ ] **Servizio** — vista Servizio: piantina scorrevole, nessun overflow della pagina.
- [ ] **Servizio** — vista Modifica: sotto 768px l'editor è nascosto e compare il messaggio che
      rimanda alla vista Servizio.
- [ ] **Modale sala** e **modale tavolo**: leggibili, pulsanti raggiungibili.
- [ ] **Modale walk-in**: leggibile, conferma a due passaggi raggiungibile.
- [ ] **Modale briefing**: la tabella scorre senza rompere la pagina.
- [ ] **Modale assegna tavolo** (selezione multipla): i tavoli restano cliccabili.
- [ ] **Finestra fine turno**: i pulsanti Libero / Ancora occupato non escono dallo schermo.
      `→ esito complessivo:`

---

## 10. Decisioni tue ancora aperte

Non sono test: sono risposte che servono prima di chiudere.

- [x] **Ordine campi Data → Ospiti → Orario** — **RISOLTO 02-08-26**: non serve lo stesso ordine fra
      form pubblico e form admin. Serve invece che i due form abbiano **gli stessi campi** e
      **logiche allineate e centralizzate**. → diventa un intervento a sé, non un riordino.
- [x] **Due viste della mappa** — **RISOLTO 02-08-26**: fatte dentro S4 (sezione 2.1).
- [ ] **Soglia di ritardo**: 15 minuti di default va bene o la vuoi diversa?
- [ ] **Buffer di riassetto**: 10 minuti per i Pro va bene?
- [ ] **Durata walk-in** (D47): oggi usa il calcolo standard con ripiego a 90 minuti. La manopola in
      console super-admin resta un follow-up: la vuoi in questo giro o dopo?

---

## 11. Cosa NON è in questa checklist (e perché)

- **Rollout in produzione** — piano separato, richiede tua autorizzazione esplicita. Ricorda: prima
  va rimessa in `env/test` la correzione dell'Edge che vive solo su `main` (`f617077`).
- **Pagina Live / sessione tavolo / conto** — fuori da S4, previsto in S4-LIVE.
- **Conservazione dati storici** — follow-up Analytics.
- **PDF briefing con colonna Tavolo** — follow-up registrato.
