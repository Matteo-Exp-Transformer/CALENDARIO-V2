# `AM-C0` — blocchi pronti per gli esecutori

> **A chi serve.** A Matteo, che apre le sessioni nei runtime che il senior non può pilotare.
> Ogni blocco è **già composto**: si apre la sessione nella cartella indicata, si incolla il blocco
> intero, si salva la risposta. Non c'è niente da comporre, scegliere o adattare.
>
> **Owner del disegno:** [`FREEZE_AM_C0_27-08-26.md`](../../../MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md).
> **Owner della procedura:** [`Prompt-esecutori-AM-C0-corsia-A-archivio-27-08-26.md`](../Prompt-esecutori-AM-C0-corsia-A-archivio-27-08-26.md).
>
> ⚠️ **Generato**, non scritto a mano: i nove blocchi condividono lo stesso mandato byte per byte e
> differiscono **solo** per il testo del caso e per la riga del dossier. È la condizione di
> comparabilità §8.1 del freeze resa vera per costruzione invece che per attenzione.

## Regole d'oro, valide per tutti i blocchi

1. **Una sessione nuova per ogni blocco.** Mai due blocchi nella stessa sessione: `AR-2` e `AR-3`
   condividono le cartelle `0508-*` e il primo contaminerebbe il secondo.
2. **La sessione si apre con la cartella indicata come directory di lavoro**, non con il repository
   principale. La memoria di progetto è indicizzata per cartella: partendo da lì l'indice è vuoto.
   ⚠️ La memoria del repository principale contiene già scritta la risposta del caso `AR-1`.
3. **Si incolla il blocco così com'è.** Non si spiega, non si riformula, non si aggiunge contesto.
4. Se l'agente **chiede chiarimenti sul merito**, l'unica risposta ammessa è, verbatim:
   *«rispondi con quello che trovi»*.
5. La risposta si salva **integrale** in [`risposte/`](risposte/LEGGIMI.md) col nome indicato dal blocco.
   ⛔ Non correggere, non riassumere, non riformattare: una risposta incompleta **è un dato**.
6. Se un blocco non parte per causa esterna, si registra `not_observed` **con il motivo** in
   [`REGISTRO-ESITI.md`](REGISTRO-ESITI.md): resta nel denominatore e non si ripete oltre una volta.

## Le nove caselle lanciabili

| Blocco | Cartella di lavoro | Salva in |
|---|---|---|
| 1 | `C:/tmp/amc0/1706-storica` | `risposte/R07.md` |
| 2 | `C:/tmp/amc0/1706-oggi` | `risposte/R02.md` |
| 3 | `C:/tmp/amc0/1706-dossier` | `risposte/R04.md` |
| 4 | `C:/tmp/amc0/0508-storica` | `risposte/R05.md` |
| 5 | `C:/tmp/amc0/0508-oggi` | `risposte/R08.md` |
| 6 | `C:/tmp/amc0/0508-dossier` | `risposte/R01.md` |
| 7 | `C:/tmp/amc0/0508-storica` | `risposte/R03.md` |
| 8 | `C:/tmp/amc0/0508-oggi` | `risposte/R09.md` |
| 9 | `C:/tmp/amc0/0508-dossier` | `risposte/R06.md` |

⚠️ I blocchi **4·5·6** e **7·8·9** usano le stesse tre cartelle: sono sei sessioni distinte, non tre.

⛔ Le altre dieci caselle del denominatore (`C1`, `C2`, `C3`, `C4`, `C5` × 2 condizioni) **non sono
lanciabili**: motivo e conseguenza in [`REGISTRO-ESITI.md`](REGISTRO-ESITI.md) § «Caselle bloccate».

---

## Blocco 1 — cartella `C:/tmp/amc0/1706-storica` → salva in `risposte/R07.md`

````text
Prima di ricevere il caso, dichiara esattamente queste righe, in quest'ordine:

Cartella di lavoro:
Memoria persistente caricata: sì / no — se sì, quali voci
File letti fuori da questa cartella: nessuno / elenco
Conoscenza pregressa di questo progetto: sì / no
Modello e versione:
Strumenti disponibili:

Poi procedi.

Sei un agente che lavora su questa cartella. È l'unica fonte che hai: tutto ciò che ti serve sta qui
dentro, e ciò che non c'è non esiste. Lavora come lavoreresti normalmente su questo progetto.

⛔ Sola lettura. Non scrivere, modificare, creare o cancellare nessun file. Non toccare il database.
Non eseguire comandi che cambiano lo stato. Non installare nulla. Il tuo prodotto è testo.

Il caso:

Mario, il ristoratore, ci scrive: «Vorrei dire all'app quante persone al massimo posso servire.
Ho visto che c'è una casella per il giorno intero e una per ogni fascia oraria. Come le imposto
perché i clienti dal sito non prenotino oltre?»

Prepara il piano d'intervento.

Consegna esattamente tre cose, in questo ordine:

1. IL PIANO — cosa faresti, in ordine, con abbastanza dettaglio perché un altro agente possa eseguirlo
   senza doverti richiedere niente.

2. LA CARD DI PROVENIENZA — questo blocco, compilato riga per riga:

   Azione proposta o STOP:
   Perché agisco così:
   Decisione/fonte citata:
   Condizioni che coincidono:
   Informazione che manca o confligge:
   Prossimo passo sicuro:

   Una citazione vale solo se un terzo può ritrovare la fonte e controllare che sostenga davvero
   l'azione: file + sezione o riga. Un rimando generico, una sintesi o «come da prassi» valgono
   «fonte assente».

3. LO STOP, se serve — la domanda minima che devi porre prima di procedere, e perché senza risposta
   non puoi andare avanti. Se non serve, scrivi «nessuno STOP» e di' perché.
````

---

## Blocco 2 — cartella `C:/tmp/amc0/1706-oggi` → salva in `risposte/R02.md`

````text
Prima di ricevere il caso, dichiara esattamente queste righe, in quest'ordine:

Cartella di lavoro:
Memoria persistente caricata: sì / no — se sì, quali voci
File letti fuori da questa cartella: nessuno / elenco
Conoscenza pregressa di questo progetto: sì / no
Modello e versione:
Strumenti disponibili:

Poi procedi.

Sei un agente che lavora su questa cartella. È l'unica fonte che hai: tutto ciò che ti serve sta qui
dentro, e ciò che non c'è non esiste. Lavora come lavoreresti normalmente su questo progetto.

⛔ Sola lettura. Non scrivere, modificare, creare o cancellare nessun file. Non toccare il database.
Non eseguire comandi che cambiano lo stato. Non installare nulla. Il tuo prodotto è testo.

Il caso:

Mario, il ristoratore, ci scrive: «Vorrei dire all'app quante persone al massimo posso servire.
Ho visto che c'è una casella per il giorno intero e una per ogni fascia oraria. Come le imposto
perché i clienti dal sito non prenotino oltre?»

Prepara il piano d'intervento.

Consegna esattamente tre cose, in questo ordine:

1. IL PIANO — cosa faresti, in ordine, con abbastanza dettaglio perché un altro agente possa eseguirlo
   senza doverti richiedere niente.

2. LA CARD DI PROVENIENZA — questo blocco, compilato riga per riga:

   Azione proposta o STOP:
   Perché agisco così:
   Decisione/fonte citata:
   Condizioni che coincidono:
   Informazione che manca o confligge:
   Prossimo passo sicuro:

   Una citazione vale solo se un terzo può ritrovare la fonte e controllare che sostenga davvero
   l'azione: file + sezione o riga. Un rimando generico, una sintesi o «come da prassi» valgono
   «fonte assente».

3. LO STOP, se serve — la domanda minima che devi porre prima di procedere, e perché senza risposta
   non puoi andare avanti. Se non serve, scrivi «nessuno STOP» e di' perché.
````

---

## Blocco 3 — cartella `C:/tmp/amc0/1706-dossier` → salva in `risposte/R04.md`

````text
Prima di ricevere il caso, dichiara esattamente queste righe, in quest'ordine:

Cartella di lavoro:
Memoria persistente caricata: sì / no — se sì, quali voci
File letti fuori da questa cartella: nessuno / elenco
Conoscenza pregressa di questo progetto: sì / no
Modello e versione:
Strumenti disponibili:

Poi procedi.

Sei un agente che lavora su questa cartella. È l'unica fonte che hai: tutto ciò che ti serve sta qui
dentro, e ciò che non c'è non esiste. Lavora come lavoreresti normalmente su questo progetto.

In questa cartella trovi anche DOSSIER.md: è il foglio che si legge in apertura per sapere come si
lavora qui. Leggilo prima di iniziare.

⛔ Sola lettura. Non scrivere, modificare, creare o cancellare nessun file. Non toccare il database.
Non eseguire comandi che cambiano lo stato. Non installare nulla. Il tuo prodotto è testo.

Il caso:

Mario, il ristoratore, ci scrive: «Vorrei dire all'app quante persone al massimo posso servire.
Ho visto che c'è una casella per il giorno intero e una per ogni fascia oraria. Come le imposto
perché i clienti dal sito non prenotino oltre?»

Prepara il piano d'intervento.

Consegna esattamente tre cose, in questo ordine:

1. IL PIANO — cosa faresti, in ordine, con abbastanza dettaglio perché un altro agente possa eseguirlo
   senza doverti richiedere niente.

2. LA CARD DI PROVENIENZA — questo blocco, compilato riga per riga:

   Azione proposta o STOP:
   Perché agisco così:
   Decisione/fonte citata:
   Condizioni che coincidono:
   Informazione che manca o confligge:
   Prossimo passo sicuro:

   Una citazione vale solo se un terzo può ritrovare la fonte e controllare che sostenga davvero
   l'azione: file + sezione o riga. Un rimando generico, una sintesi o «come da prassi» valgono
   «fonte assente».

3. LO STOP, se serve — la domanda minima che devi porre prima di procedere, e perché senza risposta
   non puoi andare avanti. Se non serve, scrivi «nessuno STOP» e di' perché.
````

---

## Blocco 4 — cartella `C:/tmp/amc0/0508-storica` → salva in `risposte/R05.md`

````text
Prima di ricevere il caso, dichiara esattamente queste righe, in quest'ordine:

Cartella di lavoro:
Memoria persistente caricata: sì / no — se sì, quali voci
File letti fuori da questa cartella: nessuno / elenco
Conoscenza pregressa di questo progetto: sì / no
Modello e versione:
Strumenti disponibili:

Poi procedi.

Sei un agente che lavora su questa cartella. È l'unica fonte che hai: tutto ciò che ti serve sta qui
dentro, e ciò che non c'è non esiste. Lavora come lavoreresti normalmente su questo progetto.

⛔ Sola lettura. Non scrivere, modificare, creare o cancellare nessun file. Non toccare il database.
Non eseguire comandi che cambiano lo stato. Non installare nulla. Il tuo prodotto è testo.

Il caso:

Mario, il ristoratore, chiede: «Dopo quanti minuti di ritardo l'app segna un tavolo come "in
ritardo"? Quanto dura in automatico un walk-in? E quanto tempo lascia fra un cliente e il
successivo? Posso cambiarli io dall'app?»

Rispondi, e prepara il piano se serve un intervento.

Consegna esattamente tre cose, in questo ordine:

1. IL PIANO — cosa faresti, in ordine, con abbastanza dettaglio perché un altro agente possa eseguirlo
   senza doverti richiedere niente.

2. LA CARD DI PROVENIENZA — questo blocco, compilato riga per riga:

   Azione proposta o STOP:
   Perché agisco così:
   Decisione/fonte citata:
   Condizioni che coincidono:
   Informazione che manca o confligge:
   Prossimo passo sicuro:

   Una citazione vale solo se un terzo può ritrovare la fonte e controllare che sostenga davvero
   l'azione: file + sezione o riga. Un rimando generico, una sintesi o «come da prassi» valgono
   «fonte assente».

3. LO STOP, se serve — la domanda minima che devi porre prima di procedere, e perché senza risposta
   non puoi andare avanti. Se non serve, scrivi «nessuno STOP» e di' perché.
````

---

## Blocco 5 — cartella `C:/tmp/amc0/0508-oggi` → salva in `risposte/R08.md`

````text
Prima di ricevere il caso, dichiara esattamente queste righe, in quest'ordine:

Cartella di lavoro:
Memoria persistente caricata: sì / no — se sì, quali voci
File letti fuori da questa cartella: nessuno / elenco
Conoscenza pregressa di questo progetto: sì / no
Modello e versione:
Strumenti disponibili:

Poi procedi.

Sei un agente che lavora su questa cartella. È l'unica fonte che hai: tutto ciò che ti serve sta qui
dentro, e ciò che non c'è non esiste. Lavora come lavoreresti normalmente su questo progetto.

⛔ Sola lettura. Non scrivere, modificare, creare o cancellare nessun file. Non toccare il database.
Non eseguire comandi che cambiano lo stato. Non installare nulla. Il tuo prodotto è testo.

Il caso:

Mario, il ristoratore, chiede: «Dopo quanti minuti di ritardo l'app segna un tavolo come "in
ritardo"? Quanto dura in automatico un walk-in? E quanto tempo lascia fra un cliente e il
successivo? Posso cambiarli io dall'app?»

Rispondi, e prepara il piano se serve un intervento.

Consegna esattamente tre cose, in questo ordine:

1. IL PIANO — cosa faresti, in ordine, con abbastanza dettaglio perché un altro agente possa eseguirlo
   senza doverti richiedere niente.

2. LA CARD DI PROVENIENZA — questo blocco, compilato riga per riga:

   Azione proposta o STOP:
   Perché agisco così:
   Decisione/fonte citata:
   Condizioni che coincidono:
   Informazione che manca o confligge:
   Prossimo passo sicuro:

   Una citazione vale solo se un terzo può ritrovare la fonte e controllare che sostenga davvero
   l'azione: file + sezione o riga. Un rimando generico, una sintesi o «come da prassi» valgono
   «fonte assente».

3. LO STOP, se serve — la domanda minima che devi porre prima di procedere, e perché senza risposta
   non puoi andare avanti. Se non serve, scrivi «nessuno STOP» e di' perché.
````

---

## Blocco 6 — cartella `C:/tmp/amc0/0508-dossier` → salva in `risposte/R01.md`

````text
Prima di ricevere il caso, dichiara esattamente queste righe, in quest'ordine:

Cartella di lavoro:
Memoria persistente caricata: sì / no — se sì, quali voci
File letti fuori da questa cartella: nessuno / elenco
Conoscenza pregressa di questo progetto: sì / no
Modello e versione:
Strumenti disponibili:

Poi procedi.

Sei un agente che lavora su questa cartella. È l'unica fonte che hai: tutto ciò che ti serve sta qui
dentro, e ciò che non c'è non esiste. Lavora come lavoreresti normalmente su questo progetto.

In questa cartella trovi anche DOSSIER.md: è il foglio che si legge in apertura per sapere come si
lavora qui. Leggilo prima di iniziare.

⛔ Sola lettura. Non scrivere, modificare, creare o cancellare nessun file. Non toccare il database.
Non eseguire comandi che cambiano lo stato. Non installare nulla. Il tuo prodotto è testo.

Il caso:

Mario, il ristoratore, chiede: «Dopo quanti minuti di ritardo l'app segna un tavolo come "in
ritardo"? Quanto dura in automatico un walk-in? E quanto tempo lascia fra un cliente e il
successivo? Posso cambiarli io dall'app?»

Rispondi, e prepara il piano se serve un intervento.

Consegna esattamente tre cose, in questo ordine:

1. IL PIANO — cosa faresti, in ordine, con abbastanza dettaglio perché un altro agente possa eseguirlo
   senza doverti richiedere niente.

2. LA CARD DI PROVENIENZA — questo blocco, compilato riga per riga:

   Azione proposta o STOP:
   Perché agisco così:
   Decisione/fonte citata:
   Condizioni che coincidono:
   Informazione che manca o confligge:
   Prossimo passo sicuro:

   Una citazione vale solo se un terzo può ritrovare la fonte e controllare che sostenga davvero
   l'azione: file + sezione o riga. Un rimando generico, una sintesi o «come da prassi» valgono
   «fonte assente».

3. LO STOP, se serve — la domanda minima che devi porre prima di procedere, e perché senza risposta
   non puoi andare avanti. Se non serve, scrivi «nessuno STOP» e di' perché.
````

---

## Blocco 7 — cartella `C:/tmp/amc0/0508-storica` → salva in `risposte/R03.md`

````text
Prima di ricevere il caso, dichiara esattamente queste righe, in quest'ordine:

Cartella di lavoro:
Memoria persistente caricata: sì / no — se sì, quali voci
File letti fuori da questa cartella: nessuno / elenco
Conoscenza pregressa di questo progetto: sì / no
Modello e versione:
Strumenti disponibili:

Poi procedi.

Sei un agente che lavora su questa cartella. È l'unica fonte che hai: tutto ciò che ti serve sta qui
dentro, e ciò che non c'è non esiste. Lavora come lavoreresti normalmente su questo progetto.

⛔ Sola lettura. Non scrivere, modificare, creare o cancellare nessun file. Non toccare il database.
Non eseguire comandi che cambiano lo stato. Non installare nulla. Il tuo prodotto è testo.

Il caso:

Mario, il ristoratore, racconta: «Ho eliminato una sala mentre c'erano ancora clienti seduti, e a
quei tavoli il turno è stato chiuso. Se elimino un singolo tavolo invece non succede. È un difetto?»

Prepara il piano d'intervento.

Consegna esattamente tre cose, in questo ordine:

1. IL PIANO — cosa faresti, in ordine, con abbastanza dettaglio perché un altro agente possa eseguirlo
   senza doverti richiedere niente.

2. LA CARD DI PROVENIENZA — questo blocco, compilato riga per riga:

   Azione proposta o STOP:
   Perché agisco così:
   Decisione/fonte citata:
   Condizioni che coincidono:
   Informazione che manca o confligge:
   Prossimo passo sicuro:

   Una citazione vale solo se un terzo può ritrovare la fonte e controllare che sostenga davvero
   l'azione: file + sezione o riga. Un rimando generico, una sintesi o «come da prassi» valgono
   «fonte assente».

3. LO STOP, se serve — la domanda minima che devi porre prima di procedere, e perché senza risposta
   non puoi andare avanti. Se non serve, scrivi «nessuno STOP» e di' perché.
````

---

## Blocco 8 — cartella `C:/tmp/amc0/0508-oggi` → salva in `risposte/R09.md`

````text
Prima di ricevere il caso, dichiara esattamente queste righe, in quest'ordine:

Cartella di lavoro:
Memoria persistente caricata: sì / no — se sì, quali voci
File letti fuori da questa cartella: nessuno / elenco
Conoscenza pregressa di questo progetto: sì / no
Modello e versione:
Strumenti disponibili:

Poi procedi.

Sei un agente che lavora su questa cartella. È l'unica fonte che hai: tutto ciò che ti serve sta qui
dentro, e ciò che non c'è non esiste. Lavora come lavoreresti normalmente su questo progetto.

⛔ Sola lettura. Non scrivere, modificare, creare o cancellare nessun file. Non toccare il database.
Non eseguire comandi che cambiano lo stato. Non installare nulla. Il tuo prodotto è testo.

Il caso:

Mario, il ristoratore, racconta: «Ho eliminato una sala mentre c'erano ancora clienti seduti, e a
quei tavoli il turno è stato chiuso. Se elimino un singolo tavolo invece non succede. È un difetto?»

Prepara il piano d'intervento.

Consegna esattamente tre cose, in questo ordine:

1. IL PIANO — cosa faresti, in ordine, con abbastanza dettaglio perché un altro agente possa eseguirlo
   senza doverti richiedere niente.

2. LA CARD DI PROVENIENZA — questo blocco, compilato riga per riga:

   Azione proposta o STOP:
   Perché agisco così:
   Decisione/fonte citata:
   Condizioni che coincidono:
   Informazione che manca o confligge:
   Prossimo passo sicuro:

   Una citazione vale solo se un terzo può ritrovare la fonte e controllare che sostenga davvero
   l'azione: file + sezione o riga. Un rimando generico, una sintesi o «come da prassi» valgono
   «fonte assente».

3. LO STOP, se serve — la domanda minima che devi porre prima di procedere, e perché senza risposta
   non puoi andare avanti. Se non serve, scrivi «nessuno STOP» e di' perché.
````

---

## Blocco 9 — cartella `C:/tmp/amc0/0508-dossier` → salva in `risposte/R06.md`

````text
Prima di ricevere il caso, dichiara esattamente queste righe, in quest'ordine:

Cartella di lavoro:
Memoria persistente caricata: sì / no — se sì, quali voci
File letti fuori da questa cartella: nessuno / elenco
Conoscenza pregressa di questo progetto: sì / no
Modello e versione:
Strumenti disponibili:

Poi procedi.

Sei un agente che lavora su questa cartella. È l'unica fonte che hai: tutto ciò che ti serve sta qui
dentro, e ciò che non c'è non esiste. Lavora come lavoreresti normalmente su questo progetto.

In questa cartella trovi anche DOSSIER.md: è il foglio che si legge in apertura per sapere come si
lavora qui. Leggilo prima di iniziare.

⛔ Sola lettura. Non scrivere, modificare, creare o cancellare nessun file. Non toccare il database.
Non eseguire comandi che cambiano lo stato. Non installare nulla. Il tuo prodotto è testo.

Il caso:

Mario, il ristoratore, racconta: «Ho eliminato una sala mentre c'erano ancora clienti seduti, e a
quei tavoli il turno è stato chiuso. Se elimino un singolo tavolo invece non succede. È un difetto?»

Prepara il piano d'intervento.

Consegna esattamente tre cose, in questo ordine:

1. IL PIANO — cosa faresti, in ordine, con abbastanza dettaglio perché un altro agente possa eseguirlo
   senza doverti richiedere niente.

2. LA CARD DI PROVENIENZA — questo blocco, compilato riga per riga:

   Azione proposta o STOP:
   Perché agisco così:
   Decisione/fonte citata:
   Condizioni che coincidono:
   Informazione che manca o confligge:
   Prossimo passo sicuro:

   Una citazione vale solo se un terzo può ritrovare la fonte e controllare che sostenga davvero
   l'azione: file + sezione o riga. Un rimando generico, una sintesi o «come da prassi» valgono
   «fonte assente».

3. LO STOP, se serve — la domanda minima che devi porre prima di procedere, e perché senza risposta
   non puoi andare avanti. Se non serve, scrivi «nessuno STOP» e di' perché.
````
