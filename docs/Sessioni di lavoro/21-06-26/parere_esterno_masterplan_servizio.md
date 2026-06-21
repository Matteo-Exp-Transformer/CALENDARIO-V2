# Parere esterno — Review critica Masterplan Servizio + motore disponibilità

**Contesto:** CALENDARIO-V2 / Sistema Gestionale Prenotazioni Ristorante  
**Data:** 21-06-2026  
**Tipo documento:** consigli da parere esterno  
**Scopo:** aiutare Matteo e gli agenti senior a prevenire bug, conflitti logici, regressioni e promesse commerciali premature prima di trasformare il masterplan in codice.

---

## 1. Sintesi del parere esterno

Il masterplan è impostato bene perché non ragiona solo su una nuova pagina “Servizio”, ma su un vero **motore di disponibilità** che attraversa più aree del prodotto:

- Prenota pubblico;
- Edge `create-booking`;
- Calendario;
- Settings;
- Menu/QR;
- Servizio;
- futuro Live sala.

Questa è la lettura corretta. La disponibilità non è una UI: è una regola di business centrale.

Il rischio principale non è “scrivere codice difficile”. Il rischio principale è **scrivere codice su concetti non ancora abbastanza definiti**: durata, fascia, orario di arrivo, turno, tavolo libero, tavolo occupato, conto, sessione tavolo, prenotazione pending, overbooking e checkout.

La raccomandazione generale è:

> Prima chiudere le decisioni semantiche. Poi scrivere codice.  
> Ogni ambiguità lasciata nel masterplan diventerà un bug in produzione.

---

## 2. Valutazione generale del masterplan

### Cosa è molto forte

Il masterplan ha già alcuni punti solidi:

1. **Modello progressivo a livelli.**  
   L’app funziona anche senza configurazione avanzata e diventa più intelligente solo quando l’admin configura più dati.

2. **Edge come fonte di verità.**  
   Il client può mostrare preview, ma il blocco reale deve stare server-side.

3. **Configurazione in massimo due luoghi.**  
   Ottimo vincolo di prodotto. Evita un gestionale ingestibile.

4. **Turni manuali non come base.**  
   Scelta corretta. La base deve essere: fasce + intervalli arrivo + durata stimata = finestre automatiche di occupazione.

5. **Gerarchia durata con principio “non si accorcia mai”.**  
   Molto corretta per ristorazione reale. Una festa di laurea non può diventare corta solo perché capita a pranzo.

6. **Separazione tra stima e live reale.**  
   La prenotazione ragiona su previsioni. La sala live deve ragionare su stati reali.

---

## 3. Primo conflitto da correggere: card che sovrascrive vs “non si accorcia mai”

Nel masterplan è presente un possibile conflitto:

- da un lato si dice che la durata card può sovrascrivere la durata della tipologia;
- dall’altro si dice che una prenotazione non si accorcia mai, solo si allunga.

Queste due regole possono entrare in collisione.

Esempio:

- Tipologia: Evento = 180 minuti;
- Card: Menu veloce evento = 120 minuti;
- Fascia: Cena minimo 120 minuti.

Se la card “sovrascrive”, il risultato diventa 120.  
Se “non si accorcia mai”, il risultato deve restare 180.

### Decisione consigliata

Per MVP usare questa formula:

```txt
durata_finale = MAX(
  durata_override_admin,
  durata_card,
  durata_tipologia,
  durata_minima_fascia,
  durata_default_ristorante
)
```

La card non deve accorciare automaticamente la tipologia. Può solo specificare meglio o allungare.

Solo in futuro, se serve davvero, si potrà introdurre un’opzione avanzata:

> “Questa card può accorciare la durata della tipologia.”

Ma non deve essere MVP.

---

## 4. Risposte consigliate ai quesiti aperti

## 4.1 S1 — Tipologie prenotazione + durata

### Tipologie fisse o create dall’admin?

Decisione consigliata:

> **Ibrido controllato.**

L’app propone tipologie predefinite:

- Tavolo normale;
- Cena;
- Pranzo;
- Aperitivo;
- Festa di laurea;
- Degustazione;
- Evento privato;
- Comunione / battesimo;
- Pranzo aziendale.

L’admin può crearne di nuove, ma dentro una UI guidata.

Motivo: un enum rigido è troppo limitante per i ristoranti italiani. Una creazione totalmente libera genera configurazioni stupide.

---

### Durata libera o a step?

Decisione consigliata:

> **Step guidati + campo custom avanzato.**

Step consigliati:

- 60 min;
- 75 min;
- 90 min;
- 105 min;
- 120 min;
- 150 min;
- 180 min;
- 210 min;
- 240 min.

Campo custom solo in “impostazioni avanzate”.

Motivo: evitare durate assurde tipo 37 minuti, 999 minuti o 5 minuti.

---

### Dove sta la durata default?

Decisione consigliata:

> In **Impostazioni → Personalizza Form**.

Qui l’admin configura:

- durata default ristorante;
- durata per tipologia;
- durata per card;
- eventuali note operative.

La durata minima fascia invece resta in **Servizio → Fasce orarie**, perché riguarda la logica operativa della fascia, non il tipo di esperienza.

---

### Override durata su SubTab o CustomStaffPreset?

Decisione consigliata:

> La durata deve vivere sul concetto prodotto selezionabile dal cliente, non sul nome tecnico interno.

Se nel codice esistono `SubTab` e `CustomStaffPreset`, serve un adapter unico, ad esempio:

```txt
selected_booking_option
```

L’agente non deve scegliere il punto tecnico più comodo. Deve agganciarsi al concetto reale:

> “la card scelta dal cliente”.

---

### Avviso se card < tipologia?

Sì, ma il sistema non deve accettare silenziosamente una durata più corta.

Regola consigliata:

- se la card ha durata inferiore alla tipologia, mostra warning admin;
- per MVP il resolver usa comunque il `MAX`;
- se in futuro si vuole permettere durata inferiore, va resa scelta avanzata e consapevole.

---

## 4.2 S2 — Motore durata

### Snapshot o ricalcolo?

Decisione consigliata:

> **Snapshot sempre.**

Quando una prenotazione viene creata o accettata, la durata calcolata deve essere salvata sulla prenotazione.

Motivo: se oggi una festa di laurea dura 180 minuti e domani l’admin cambia la durata a 240 minuti, le prenotazioni già accettate non devono cambiare.

Campi consigliati:

```txt
duration_minutes
duration_source
duration_rule_version
estimated_end
manual_duration_override
applied_slot_min_duration
capacity_mode_used
forced_by_admin
force_reason
```

---

### Cosa fare con lo storico `confirmed_start/end`?

Decisione consigliata:

> Non ricalcolare lo storico.

Le prenotazioni già esistenti devono rimanere intatte.  
Aggiungere nuovi campi, non cambiare retroattivamente il significato dei vecchi dati.

Motivo: toccare lo storico rischia di rompere calendario, analytics, CRM e report già esistenti.

---

### Cosa succede se la durata sfora la chiusura fascia?

Decisione consigliata:

- **cliente pubblico:** blocco o richiesta speciale;
- **admin:** alert forte, ma può forzare.

Esempio:

Cena 19:00–23:00.  
Festa di laurea 180 minuti.  
Cliente sceglie 21:30.  
Fine stimata 00:30.

Messaggio cliente:

> Questo orario non è disponibile per la durata della prenotazione selezionata. Scegli un orario precedente o invia una richiesta speciale.

Messaggio admin:

> Questa prenotazione termina oltre la fascia Cena. Puoi salvarla comunque.

Non tagliare mai automaticamente la durata.

---

### La gerarchia vale anche per inserimento admin?

Sì.

Tutti i flussi devono usare lo stesso resolver:

- prenota pubblico;
- Edge;
- inserimento manuale admin;
- modifica prenotazione;
- calendario;
- servizio;
- live.

L’admin può sovrascrivere manualmente, ma non deve esistere una seconda logica parallela.

---

## 4.3 S3 — Intervalli di arrivo

### Step unico o per fascia?

Decisione consigliata:

> Default globale + override per fascia.

Esempio:

- default ristorante: ogni 30 minuti;
- pranzo: ogni 15 minuti;
- cena: ogni 30 minuti;
- eventi: ogni 60 minuti.

Così si evita configurazione ripetitiva, ma si lascia flessibilità.

---

### Slot pieni nascosti o grigi?

Decisione consigliata:

- cliente pubblico: mostra solo orari disponibili;
- se non ci sono orari: mostra richiesta speciale;
- admin/debug: può vedere anche gli orari pieni con motivo.

Motivo: il cliente non deve vedere 40 bottoni grigi. Si confonde e abbandona.

---

### Cut-off minimo prenotazioni

Decisione consigliata:

> Obbligatorio.

Esempi:

- pranzo: almeno 1 ora prima;
- cena: almeno 2 ore prima;
- eventi/lauree: almeno 24 ore prima.

Admin può sempre inserire o forzare manualmente.

Questa regola evita richieste ingestibili a ridosso del servizio.

---

### Pacing MVP?

Decisione consigliata:

> Non MVP, ma predisposizione sì.

Il pacing è un limite per distribuire gli arrivi.

Esempio:

- massimo 20 coperti alle 20:00;
- massimo 15 coperti alle 20:30;
- massimo 25 coperti alle 21:00.

Non serve subito, ma il modello dati non deve impedirlo.

---

### Mostrare durata al cliente?

Decisione consigliata:

> Solo in modo morbido.

Esempio:

> Durata indicativa: circa 2 ore.

Non mostrare formule tecniche o calcoli complessi.

---

### Ordine corretto del form pubblico

Punto fondamentale:

> Il cliente deve scegliere tipologia/card prima dell’orario.

Flusso consigliato:

1. data;
2. numero ospiti;
3. tipologia/card;
4. orario disponibile;
5. dati cliente;
6. invio richiesta.

Motivo: se l’orario viene scelto prima della card, il sistema non conosce ancora la durata e quindi non può calcolare bene gli orari disponibili.

---

## 4.4 S4 — Motore tavoli / turni automatici

### Checkout automatico o manuale?

Decisione consigliata:

> Manuale come verità. Automatico solo come suggerimento.

Se la durata stimata finisce alle 22:00, il tavolo non deve diventare automaticamente libero.  
Deve diventare:

> Probabilmente da liberare.

Lo staff decide quando chiudere davvero.

Motivo: un tavolo stimato libero non è sempre un tavolo realmente libero.

---

### Definizione di “turno”

Decisione consigliata:

> Non usare “turno” come oggetto principale MVP. Usare “finestra di occupazione”.

Esempio:

Prenotazione alle 20:00.  
Durata 120 minuti.  
Buffer 10 minuti.  
Finestra occupazione: 20:00–22:10.

Questo è il “turno automatico” logico, ma l’admin non deve configurare per forza “Turno 1 / Turno 2”.

---

### Stati/colori tavolo

Stati consigliati:

- libero;
- prenotato;
- in arrivo;
- seduto;
- in servizio;
- conto richiesto;
- da liberare;
- da pulire;
- bloccato;
- no-show;
- cancellato.

Usare pochi colori, coerenti e leggibili.  
Non fare una mappa sala con troppi stati cromatici incomprensibili.

---

### Overbooking admin

Decisione consigliata:

> Sempre permesso, ma tracciato.

L’admin può superare i limiti, ma il sistema deve salvare:

- chi ha forzato;
- quando;
- quale limite ha superato;
- motivo opzionale o obbligatorio in base alla gravità.

Motivo: il gestionale deve aiutare il ristoratore, non sostituirlo. Però ogni forzatura deve essere auditabile.

---

## 4.5 S4-LIVE — Sala live e conto leggero

### Ciclo vita riga conto

Decisione consigliata:

```txt
pending
confirmed
voided
comped
```

Ogni riga deve avere:

- autore;
- timestamp;
- tavolo/sessione;
- origine: staff / cliente QR / sistema;
- eventuale motivo annullamento o modifica.

---

### Conto per tavolo o per turno?

Decisione consigliata:

> Per sessione tavolo.

Serve un concetto tipo:

```txt
table_session_id
```

Motivo: il tavolo fisico è sempre lo stesso, ma può avere più sessioni durante la giornata.

Esempio:

- Tavolo 8, pranzo, sessione 1;
- Tavolo 8, cena, sessione 2.

Il conto non deve vivere direttamente sul tavolo fisico.

---

### Pagato/metodo pagamento o solo chiuso?

Decisione consigliata MVP:

- chiuso;
- pagato opzionale;
- metodo pagamento opzionale;
- no logica fiscale;
- no scontrino;
- no POS.

Chiamarlo “conto leggero” o meglio “riepilogo operativo del tavolo”.

---

### Modifica prezzo / sconto manuale

Sì, ma con permessi.

Regola consigliata:

- owner/admin può modificare prezzo e sconto;
- staff base può aggiungere righe;
- cameriere può modificare solo righe proprie entro pochi minuti;
- ogni modifica importante ha audit log.

---

### Cosa succede se cambia tavolo?

La sessione si trasferisce.

Serve log evento:

> Prenotazione spostata da Tavolo 4 a Tavolo 8.

Le righe conto seguono la sessione, non il tavolo vecchio.

---

### Realtime o refetch?

Decisione consigliata:

- Live sala: Supabase Realtime o equivalente;
- resto del sistema: refetch/polling.

Realtime ovunque aumenterebbe complessità senza vantaggio reale.

---

### Vista cucina?

Non MVP.

È un prodotto quasi diverso: comande, priorità, preparazione, stati cucina, stampanti, KDS.

Rimandare.

---

## 4.6 S6 — Ordine da QR cliente

Decisione consigliata:

> Fuori dal primo ciclo. Non attivare finché Live staff non è stabile.

Motivo: riapre Menu QR, sicurezza pubblica, tavoli sbagliati, spam ordini, rate limit, conferma staff, merge righe, stato ordine.

Se verrà fatto:

- il cliente vede prezzi e totale;
- ordine entra come `pending`;
- il numero tavolo digitato è solo un indizio;
- staff conferma o corregge;
- serve rate limit per tavolo/sessione/IP/device;
- cliente vede solo stati minimi: inviato, ricevuto, accettato.

---

## 5. Conflitti e pericoli aggiuntivi

## 5.1 Prenotazioni pending: bloccano capacità?

Conflitto non abbastanza esplicito.

Decisione consigliata:

```txt
accepted / confirmed = blocca capacità
pending = non blocca hard, ma genera alert
```

Motivo: se le pending bloccano capacità, pochi clienti possono congelare la sala senza conferma.  
Se non contano mai, l’admin rischia overbooking invisibile.

Soluzione:

- pending non consuma capacità hard;
- pending aumenta pressione visiva;
- se troppe pending sulla stessa fascia, mostra warning.

---

## 5.2 Tavoli combinati

Caso reale: prenotazione da 10 persone composta da due tavoli da 5.

Rischio: se il DB impone “una prenotazione = un tavolo”, il motore sarà presto limitante.

Decisione consigliata:

- MVP UI può assegnare un tavolo;
- DB deve permettere più tavoli per prenotazione;
- una `table_session` può includere più tavoli.

Non serve UI completa subito, ma non bloccare l’architettura.

---

## 5.3 Buffer pulizia / reset tavolo

Durata 120 minuti non significa tavolo disponibile esattamente dopo 120 minuti.

Serve un buffer:

```txt
turnover_buffer_minutes
```

Esempio:

- arrivo 20:00;
- durata 120;
- buffer 10;
- occupazione reale stimata 20:00–22:10.

Default consigliato:

- 0 min per Classic;
- 10 min per Pro con tavoli;
- configurabile in Servizio.

---

## 5.4 Tavoli disattivati con prenotazioni future

Se un tavolo viene disattivato ma ha prenotazioni future, non deve sparire in silenzio.

Regola:

- soft delete sempre;
- alert se ha prenotazioni future;
- prenotazioni future diventano “da riassegnare”;
- non cancellare mai storico tavolo da prenotazioni passate.

---

## 5.5 Cambio numero ospiti

Se una prenotazione passa da 2 a 6 persone:

- durata può restare uguale;
- capienza tavolo va ricontrollata;
- disponibilità fascia va ricontrollata;
- se tavolo non basta, alert;
- admin può forzare;
- cliente pubblico no, salvo richiesta speciale.

---

## 5.6 Modifica data/orario dopo accettazione

Ogni modifica importante deve rieseguire il resolver:

- nuova fascia;
- nuova durata;
- nuovo `estimated_end`;
- nuova disponibilità;
- nuovo tavolo compatibile;
- eventuale overbooking;
- eventuale audit log.

Non deve esistere una modifica manuale che lascia dati incoerenti.

---

## 5.7 Cap fascia vs tavoli reali

Il masterplan dice: se esistono tavoli, comanda il calcolo per tavolo.

Corretto, ma c’è un caso reale:

- ho 80 coperti fisici;
- voglio accettarne massimo 60 perché ho poco staff.

Decisione consigliata:

> Se esistono tavoli, il calcolo per tavolo comanda la disponibilità fisica, ma il cap fascia può restare come limite operativo superiore se l’admin lo attiva.

Default: tavoli comandano.  
Avanzato: “mantieni anche limite coperti fascia”.

---

## 5.8 `max_turns` legacy

Nel DB esiste già `max_turns`.  
Attenzione: può generare confusione se i turni manuali non sono MVP.

Decisione consigliata:

- non usarlo come base del nuovo motore;
- trattarlo come legacy o campo da migrare semanticamente;
- il nuovo motore deve basarsi su:
  - `arrival_step_minutes`;
  - `duration_minutes`;
  - `buffer_minutes`;
  - finestre occupazione.

---

## 5.9 Error codes Edge troppo generici

Con il nuovo motore, `OUT_OF_SLOT` e `SLOT_LIMIT` potrebbero non bastare più.

Codici consigliati:

```txt
OUT_OF_SERVICE_SLOT
INVALID_ARRIVAL_STEP
DURATION_EXCEEDS_SLOT
CAPACITY_EXCEEDED
NO_TABLE_AVAILABLE
CUTOFF_EXPIRED
CONFIG_INCOMPLETE
SPECIAL_REQUEST_REQUIRED
```

Motivo: messaggi sbagliati lato cliente/admin generano supporto, confusione e bug apparenti.

---

## 5.10 Configurazione incompleta

Caso reale:

- admin configura tavoli ma non durate;
- configura durate ma non fasce;
- crea tavoli senza capienza;
- crea fascia troppo corta per una tipologia lunga.

Serve una diagnostica configurazione.

Esempi messaggi admin:

> Hai creato tavoli ma non hai impostato una durata stimata. Non possiamo calcolare i prossimi orari liberi.

> Alcuni tavoli non hanno capienza. Completa la configurazione per usare il motore tavoli.

> La card “Festa di laurea” non ha orari validi nella fascia Pranzo.

Regola:

> Se configurazione incompleta, il sistema degrada al livello precedente invece di rompersi.

---

## 5.11 Permessi staff

Live sala e conto leggero richiedono permessi.

Ruoli minimi consigliati:

- owner/admin: tutto;
- responsabile sala: prenotazioni, tavoli, stati, override;
- cameriere: aggiunge righe conto, cambia stato tavolo, ma con limiti;
- marketing/CRM: niente Servizio live;
- cucina futura: sola lettura comande, se verrà introdotta.

Senza permessi, un cameriere può fare danni seri.

---

## 5.12 Concorrenza e race condition

Rischio:

- cliente A vede ultimo slot disponibile;
- cliente B vede lo stesso slot;
- entrambi inviano nello stesso momento;
- Edge accetta entrambi.

Serve strategia server-side:

- transazione;
- lock logico per tenant/data/fascia;
- controllo finale dentro Edge;
- test di race condition.

Il client non può essere la protezione.

---

## 5.13 Fasce overnight e ora legale

Non confrontare semplicemente stringhe `HH:mm`.

Serve logica su:

- timezone del ristorante;
- data servizio;
- fasce che superano mezzanotte;
- ora legale;
- ultimo arrivo valido;
- durata che finisce il giorno dopo.

Questi casi vanno in test obbligatori.

---

## 5.14 Vendita: rischio di promettere troppo

Commercialmente, non vendere subito:

> calcolo perfetto sala / gestione tavoli completa / conto / POS / ordine da QR.

Vendere per livelli:

- Base: richieste organizzate;
- Fasce: controllo coperti;
- Durata: disponibilità più intelligente;
- Tavoli: prossimi tavoli liberi;
- Live: sala sotto controllo durante il servizio.

Il messaggio giusto è:

> Parti semplice. Attivi solo il livello di controllo che ti serve.

---

## 6. Sezioni da aggiungere al masterplan

## 6.1 Regole anti-configurazione stupida

```md
## Regole anti-configurazione stupida

- Le durate standard sono selezionabili da preset guidati.
- Durata minima consigliata: 60 min. Sotto 45 min solo modalità avanzata.
- Durata massima consigliata: 240 min. Oltre 480 min richiede conferma avanzata.
- L’intervallo di arrivo non può essere superiore alla durata della fascia.
- L’ultimo orario prenotabile è `fine_fascia - durata - buffer`.
- Se non esiste nessun orario valido, la card/tipologia non è prenotabile online in quella fascia.
- Le prenotazioni già accettate non vengono invalidate da cambi di configurazione.
- Le richieste pending non bloccano hard la disponibilità, ma generano alert.
- Se i tavoli sono configurati male, il sistema degrada al livello precedente e mostra banner admin.
- Ogni override admin viene tracciato con autore, data e motivo opzionale/obbligatorio in base alla gravità.
```

---

## 6.2 Resolver unico disponibilità

```md
## Resolver unico disponibilità

Ogni flusso deve usare lo stesso motore logico:

- Prenota pubblico;
- Edge create-booking;
- inserimento manuale admin;
- modifica prenotazione;
- Calendario;
- Servizio;
- Live.

Il client può mostrare una preview, ma Edge resta fonte di verità.
Nessun componente deve calcolare disponibilità con regole proprie.
```

---

## 6.3 Stati che bloccano capacità

```md
## Stati che bloccano capacità

Bloccano capacità:

- accepted / confirmed;
- seated / in_service;
- manually_blocked;
- pending_hold, solo se introdotto in futuro.

Non bloccano capacità:

- pending request;
- rejected;
- cancelled;
- no_show, dopo conferma admin;
- archived / concluded.

Le pending request aumentano il livello di attenzione ma non consumano capienza hard.
```

---

## 6.4 Snapshot disponibilità sulla prenotazione

```md
## Snapshot disponibilità sulla prenotazione

Quando una prenotazione viene creata o accettata, il sistema salva:

- arrival_time;
- duration_minutes;
- estimated_end;
- buffer_minutes;
- occupancy_start;
- occupancy_end;
- duration_source;
- selected_booking_type_id;
- selected_card_id;
- service_slot_id;
- applied_slot_min_duration;
- capacity_mode_used: slot_cap / table_engine / manual_override;
- forced_by_admin;
- force_reason.
```

---

## 6.5 Matrice edition

```md
## Matrice edition

| Funzione | Classic | Pro | Enterprise |
|---|---:|---:|---:|
| Fasce + coperti | sì | sì | sì |
| Durata tipologia/card | sì | sì | sì |
| Intervalli arrivo | sì | sì | sì |
| Cut-off prenotazioni | sì | sì | sì |
| Tavoli e sale | no | sì | sì |
| Prossimo tavolo libero | no | sì | sì |
| Mappa sala | no | sì | sì |
| Live sala | no | sì | sì |
| Riepilogo operativo tavolo | no | sì | sì |
| Ordine QR cliente | no | opzionale futuro | sì futuro |
| POS / scontrino | no | no | roadmap avanzata |
```

---

## 7. Test obbligatori consigliati

## 7.1 Test durata

- durata tipologia normale;
- durata card superiore alla tipologia;
- durata card inferiore alla tipologia → usa `MAX`;
- minimo fascia superiore alla tipologia;
- override admin superiore;
- override admin inferiore, se permesso, deve essere esplicito e tracciato;
- nessuna durata configurata → permanenza non attiva.

---

## 7.2 Test storico

- cambio durata tipologia non modifica prenotazioni vecchie;
- cambio durata card non modifica prenotazioni vecchie;
- cambio fascia non invalida prenotazioni già accettate;
- prenotazione salvata conserva `duration_rule_version`.

---

## 7.3 Test pubblico

- cliente non può scegliere 20:07 se step è 30 min;
- cliente non può scegliere orario che sfora chiusura;
- cliente vede richiesta speciale se non ci sono orari validi;
- pending non blocca hard;
- confirmed blocca capacità;
- cut-off scaduto blocca richiesta online.

---

## 7.4 Test admin

- admin può forzare oltre limite;
- forzatura viene tracciata;
- modifica data ricalcola disponibilità;
- modifica orario ricalcola disponibilità;
- modifica numero ospiti ricontrolla capienza;
- tavolo disattivato con prenotazioni future genera alert.

---

## 7.5 Test tavoli

- tavolo occupato non risulta libero;
- tavolo con buffer non risulta libero subito dopo durata;
- tavolo da 2 non accetta prenotazione da 4 senza override;
- più tavoli combinati non devono essere impediti dal DB;
- no-show libera finestra;
- cancellazione libera finestra;
- checkout manuale libera tavolo;
- fine durata stimata mostra “da liberare”, non “libero”.

---

## 7.6 Test tempo / timezone

- fascia cena che supera mezzanotte;
- durata che finisce il giorno dopo;
- cambio ora legale;
- timezone ristorante diversa da UTC;
- ultimo arrivo = fine fascia - durata - buffer.

---

## 7.7 Test race condition

- due clienti inviano nello stesso secondo ultimo slot disponibile;
- Edge deve accettarne solo uno o gestire richiesta speciale;
- client non deve essere considerato fonte di verità.

---

## 8. Analisi finale da senior developer

Il progetto è sulla strada giusta, ma sta entrando nella fase più delicata: passare da **calendario prenotazioni** a **sistema operativo leggero del ristorante**.

Il salto è importante.

Un calendario può permettersi logiche semplici.  
Un motore di disponibilità no.

La regola tecnica più importante è:

> Il motore deve essere unico, testabile, server-side, snapshot-based e degradabile.

Unico: niente logiche duplicate in componenti diversi.  
Testabile: funzioni pure per durata e disponibilità.  
Server-side: Edge decide.  
Snapshot-based: lo storico non cambia.  
Degradabile: se manca configurazione, il sistema torna al livello precedente.

La regola di prodotto più importante è:

> L’app non deve mai fingere più certezza di quella che ha.

Se non ci sono tavoli, non può promettere tavoli liberi.  
Se non c’è live, non può sapere se il tavolo si è davvero liberato.  
Se non c’è POS, non può parlare di pagamento fiscale.  
Se ci sono solo fasce, può parlare solo di coperti per fascia.

---

## 9. Analisi finale da consulente SaaS/vendite

Commercialmente, questo masterplan può diventare un vantaggio forte se viene venduto nel modo giusto.

Non vendere:

> gestione sala perfetta;
> POS;
> scontrini;
> automazione totale;
> ordine QR completo;
> tavoli sempre calcolati con precisione.

Vendere invece:

> **Disponibilità intelligente, attivabile a livelli.**

Frasi commerciali più sicure:

- “Parti dal calendario e aggiungi controllo quando ti serve.”
- “Una laurea non pesa come un tavolo da due. Il sistema lo può considerare.”
- “Se configuri tavoli e durate, l’app ti aiuta a capire quando si libera il prossimo tavolo.”
- “L’admin resta sempre libero di forzare, ma il sistema lo avvisa prima.”
- “Il prodotto non sostituisce il giudizio del ristoratore: lo rende più informato.”

Questo posizionamento è molto più credibile di “facciamo tutto automaticamente”.

---

## 10. Raccomandazione conclusiva

Prima di procedere con codice S3/S4/S4-LIVE, chiudere questi punti:

1. formula durata finale con `MAX`;
2. snapshot durata salvato in prenotazione;
3. stati che bloccano capacità;
4. pending request non bloccante hard;
5. ordine form pubblico: tipologia/card prima dell’orario;
6. buffer pulizia;
7. tavoli combinati predisposti nel DB;
8. checkout manuale come verità;
9. cap fascia operativo anche con tavoli, solo se attivo;
10. error codes Edge specifici;
11. diagnostica configurazione incompleta;
12. matrice edition definitiva;
13. permessi staff;
14. test race condition;
15. vocabolario UI italiano.

La frase guida per gli agenti deve essere:

> Ogni scelta deve prevenire bug reali di ristorazione: overbooking, storico che cambia, tavoli falsamente liberi, configurazioni stupide, clienti che selezionano orari impossibili, admin bloccati quando invece devono poter forzare, e promesse commerciali che il prodotto non può ancora mantenere.

