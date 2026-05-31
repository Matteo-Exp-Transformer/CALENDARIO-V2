# Metodo spiegazioni agenti coding

Questo documento va usato come contesto quando chiedo spiegazioni sul codice, su un bug, su un fix, su una modifica dell’app o quando chiedo espressamente di usare questa skill. Serve a guidare l’agente nel modo in cui deve spiegarmi le cose.

## Obiettivo

Quando mi spieghi qualcosa, non voglio una lezione tecnica lunga. Voglio capire in modo semplice:

- quale problema c’era nell’app;
- quale componente, file o funzione era coinvolta;
- cosa gestisce quel componente nell’app;
- come scorreva il dato prima;
- dove nasceva l’errore;
- cosa cambia dopo il fix;
- se il fix è coerente con struttura prodotto, scalabilità, pulizia del codice e vendita del prodotto.

## Ruoli

Io, Matteo, oriento il prodotto, scelgo lo scope, confermo preferenze UX, provo l’app nel reale e sblocco decisioni operative o di produzione. L’agente costruisce, analizza, migra su test, valida tecnicamente, documenta e mi segnala quando trova rischi o scelte ambigue. Se la domanda è “è giusto per il ristoratore / Mario / il prodotto?”, la decisione finale torna a me.

## Stile di spiegazione

Spiega in italiano, con frasi brevi e concrete. Usa i nomi tecnici di componenti, file o funzioni, ma abbinali sempre a una spiegazione semplice del loro ruolo nell’app.

Esempio:

`BookingForm` = componente che gestisce il form con cui l’admin crea o modifica una prenotazione.

Evita spiegazioni astratte, ridondanti o troppo tecniche. Non incollare codice se non serve davvero a capire il punto.

## Quando chiedo “spiegamelo semplice”

Quando chiedo una spiegazione semplice, usa un’immagine pratica o un esempio concreto. Prima separa i concetti in pochi blocchi, poi collega ogni blocco a cosa succede davvero nell’app.

La spiegazione deve chiarire anche se una cosa è:

- una modifica che deve fare l’agente nel codice;
- una regola operativa che devo ricordare io;
- un comportamento automatico già gestito dagli strumenti;
- una configurazione una-tantum;
- una scelta di prodotto o UX da confermare con me.

Esempio di stile:

“Non devi modificare il nome dei file a mano. Vite lo fa automaticamente quando fai la build. Tu continui a scrivere il codice normalmente. L’unica modifica vera è nella configurazione di Vercel, così il browser sa quali file può tenere in cache e quali deve ricontrollare.”

## Formato standard

Quando mi spieghi una modifica o un fix, usa questo schema sintetico.

### Problema

Spiega in poche righe cosa non funzionava o cosa andava migliorato nell’app.

### Componente coinvolto

Indica il nome del componente, file o funzione coinvolta e spiegami cosa fa nell’app in parole semplici.

### Flusso dati prima del fix

Mostra brevemente come passava il dato prima della modifica.

Esempio:

`form prenotazione → mutation → database → calendario → visualizzazione errata`

### Flusso utente

Fammi un esempio concreto di come il bug o il comportamento si vedeva usando l’app.

Esempio:

Il ristoratore conferma una prenotazione alle 20:00, ma nella dashboard la vede in un orario diverso.

### Fix applicato

Spiega cosa hai cambiato, senza entrare in dettagli inutili.

### Flusso dati dopo il fix

Mostra brevemente come scorre il dato dopo la modifica.

### Perché il fix è corretto

Non limitarti a dire che “funziona”. Valuta se il fix è coerente con:

- struttura del prodotto;
- scalabilità;
- pulizia del codice;
- solidità del sistema;
- flusso reale dell’utente;
- visione di marketing e vendita del prodotto.

## Rischi, conflitti e domande

Non voglio una sezione rischi automatica ogni volta.

Se trovi un rischio, un conflitto strutturale, un dubbio nel flusso dati, nel codice o nella coerenza prodotto, fermati e fammi una domanda chiara prima o durante la modifica.

Segnalami soprattutto dubbi su:

- produzione vs test;
- deploy o migrazioni;
- tenant, RLS e permessi;
- dashboard Classic vs Pro/Enterprise;
- prenotazioni, orari, calendario e booking mutations;
- differenza tra bozza, dato salvato e dato mostrato;
- differenza tra Menu QR, Pagina Prenota e Personalizza form;
- preferenze UX già confermate;
- comportamento che potrebbe sembrare bug ma in realtà è una scelta voluta.

## Test

Esegui i test necessari, ma non serve raccontarmeli ogni volta.

Comunica i test solo se:

- falliscono;
- non puoi eseguirli;
- aprono un dubbio;
- richiedono una mia decisione;
- il task è delicato e serve lasciarne traccia.

## Spiegazione didattica

Non spiegarmi tutto in modo didattico di default.

Se ti chiedo espressamente di spiegarmi meglio, allora approfondisci usando questo ordine:

1. cosa fa il componente;
2. che dato riceve;
3. che dato produce o modifica;
4. dove nasceva l’errore;
5. perché il fix risolve il problema;
6. cosa faccio io e cosa fa invece il tool/codice/configurazione;
7. cosa devo ricordare per riconoscere casi simili.

## Pattern di conversazione utile

Se proponi un meccanismo tecnico e io chiedo una versione semplice, non ripetere solo il nome tecnico. Traducilo in:

- immagine concreta;
- esempio pratico nell’app;
- chi fa cosa;
- cosa devo fare io;
- cosa non devo fare;
- cosa cambia dopo la modifica.

Esempio: se parli di cache, service worker, RLS, resolver, serializer, chiavi di configurazione o migrazioni, spiegami prima l’effetto visibile e poi il dettaglio tecnico minimo.

## Esempio di spiegazione corretta

Il problema non era nel calendario in sé. Era il modo in cui veniva scritto in `BookingForm` l’orario confermato della prenotazione.

Flusso dati errato:

`cliente sceglie orario → BookingForm salva l’orario → useBookingMutations aggiorna la prenotazione → calendario legge l’orario → l’orario appare spostato`

Flusso utente:

Il ristoratore conferma una prenotazione per le 20:00, ma nella dashboard la vede alle 22:00. Quindi pensa di avere disponibilità in un orario sbagliato.

Dopo il fix:

L’orario scelto resta l’orario mostrato. Il calendario non interpreta più male il dato.
