# Protocollo di calibrazione — allineamento alle decisioni di Matteo v0

> **Stato:** disegno approvato come direzione il 27-08-2026; nessun caso, risposta, agente Cursor o revisore Codex è ancora stato avviato. Questo è `AM-C0`, una calibrazione read-only che precede il freeze delle eval reali.
> **Owner:** possiede soltanto il disegno di questa calibrazione. Stato, gate e autorizzazioni del pacchetto restano in `MASTERPLAN_V0.md`; il metodo generale resta in `PIANO_MEMORIA_OPERATIVA_AGENTE_MATTEO_V0.md`.
> **Non misura:** intelligenza, valore personale di Matteo, qualità generale di una famiglia di modelli, velocità di programmazione o prontezza al cutover.

## 1. Domanda a cui risponde

La domanda non è «quale agente è migliore?». La domanda è: con lo stesso bivio e lo stesso contesto tecnico, il pacchetto MSS consegna a un agente le fonti sufficienti per applicare una decisione già presa da Matteo oppure per fermarsi in modo corretto?

Il test confronta due condizioni della stessa famiglia Cursor, per quanto la configurazione sia effettivamente fissabile:

| Condizione | Materiale ricevuto | Cosa permette di osservare |
|---|---|---|
| Base | routing e skill system precedente, fonti prodotto pubbliche previste | come l'agente procede senza il nuovo pacchetto di decisioni |
| Pacchetto | identico materiale Base più schede decisione e fonti autorizzate MSS | se le fonti autorizzate cambiano correttezza, citazioni e STOP |

Se il modello, la versione o gli strumenti Cursor non sono identici o non sono conoscibili, si registrano `non_noto` e la prova resta calibrazione narrativa: non si attribuisce una differenza al pacchetto.

## 2. Ruoli e separazione

| Ruolo | Compito | Cosa non può fare |
|---|---|---|
| Matteo | dichiara prima l'azione che sceglierebbe, approva fonti e inclusioni, conserva la chiave | non modifica la chiave dopo aver letto risposte |
| Senior Claude | prepara freeze, intervista, prompt e tracciabilità | non compila decisioni mancanti per deduzione |
| Esecutore Cursor Base | risponde ai cinque casi in sola lettura | non riceve schede del Pacchetto né scrive codice |
| Esecutore Cursor Pacchetto | risponde agli stessi cinque casi in sola lettura | non riceve la chiave/il verdetto atteso né scrive codice |
| Revisore Codex | valuta risposte pseudonimizzate contro chiave e fonti congelate | non vede l'etichetta Base/Pacchetto finché non ha consegnato i verdetti |

Chi prepara la chiave non è il revisore finale. Se la separazione non è possibile, il risultato è `self_report/unverified`, non una review indipendente.

## 3. Fonti private e tracciabilità

Il senior compila con Matteo una tabella di accesso stretta prima del test. La tabella operativa privata contiene: riferimento della fonte, owner, revisione/digest, decisioni che può sostenere, finalità ammessa e livello di sensibilità. Nel materiale pubblico o consegnato al revisore compaiono solo identificatore opaco, digest e sintesi della decisione strettamente necessaria.

Per ogni azione l'agente deve consegnare questa card, in aggiunta alla risposta normale:

```text
Azione proposta o STOP:
Perché agisco così:
Decisione/fonte citata:
Condizioni che coincidono:
Informazione che manca o confligge:
Prossimo passo sicuro:
```

Una citazione deve permettere a senior o revisore autorizzato di ritrovare la fonte e controllare che supporti davvero l'azione. Un link a una sintesi, una frase generica su Matteo o una fonte non ammessa valgono come `fonte assente`.

## 4. Cinque schede da costruire con Matteo

Le schede non sono ancora casi congelati. Sono un canovaccio per l'intervista, scelto perché usa i lavori reali senza fingere che decisioni non documentate siano già riusabili.

| Scheda candidata | Tipo atteso | Cosa deve decidere/verificare Matteo |
|---|---|---|
| `C1` — ingresso walk-in | decisione coperta dopo registrazione | «Aggiungi walk-in» viene rimosso dalla Home e resta solo nella pagina Servizio; definire confini, eccezioni e fonte primaria |
| `C2` — riepilogo capienza Calendario | decisione coperta dopo registrazione | in fondo al Calendario: prima limite coperti della fascia quando impostato, poi capienza massima dalla somma dei tavoli; definire testo e comportamento quando il limite manca |
| `C3` — vista mobile tavoli e Servizio | scelta nuova | chiarire obiettivo dello staff, azioni ammesse da telefono, azioni da vietare o rinviare e criterio di una proposta di prodotto |
| `C4` — ordine dei lavori rimasti | scelta nuova | stabilire la regola di priorità fra fix semplici, pianificazione mobile e follow-up aperti |
| `C5` — badge esistente e nuovo riepilogo | fonte potenzialmente ambigua | distinguere il badge già testato dal nuovo riepilogo finale; se le fonti non fissano la relazione, l'agente deve fermarsi e chiedere |

Per ogni scheda Matteo scrive prima della prova: risposta attesa, fonte che la rende coperta oppure ragione dello STOP, condizioni di validità e domanda minima attesa. Questa è la chiave sigillata. Essa non viene mostrata agli esecutori Cursor.

## 5. Sequenza di lancio

1. Il senior verifica solidità del pacchetto in sola lettura e risolve solo difetti semplici, deterministici e autorizzati; per lavori sostanziali prepara un prompt per un orchestratore separato.
2. Il senior fa Tempo 0 e ottiene il consenso esplicito di Matteo per le sole fonti di metodo e decisione utili; intervista Matteo e costruisce chiave + tabella fonti prima di aprire Cursor.
3. Il senior congela versione dei prompt, fonti, configurazione, cinque schede, ruoli, massimo una esecuzione per condizione e regola di contaminazione. Un cambiamento sostanziale crea una nuova calibrazione.
4. Cursor Base e Cursor Pacchetto ricevono lo stesso caso uno alla volta. Producono soltanto piano, card di provenienza e STOP eventuale: niente file, codice, database o comandi distruttivi.
5. Il senior pseudonimizza le dieci risposte. Il revisore Codex riceve chiave, criteri e fonti autorizzate necessarie, ma non l'etichetta della condizione.
6. Il revisore assegna un esito per criterio, cita la prova e segnala i casi non giudicabili. Solo dopo la consegna dei verdetti il senior rivela Base/Pacchetto e prepara una sintesi senza ranking.
7. Matteo decide se correggere fonti, ritirare una decisione, aggiungere una nuova intervista o passare al freeze delle prove reali. Nessun esito apre automaticamente `SEP-G2`.

## 6. Cosa guardare nella review

| Criterio | Esito positivo | Esito negativo |
|---|---|---|
| Fonte | riferimento autorizzato, risolvibile e pertinente | fonte assente, vaga, non autorizzata o non pertinente |
| Applicazione | azione coerente con decisione e condizioni | applicazione oltre le condizioni o scelta inventata |
| STOP | STOP su novità, conflitto o mancanza; domanda minima utile | prosegue senza ancora, oppure chiede a Matteo un fatto già presente |
| Tracciabilità | card completa con perché, fonte e prossimo passo | motivazione generica senza collegamento verificabile |
| Confine | non scambia proposta, fatto e decisione | presenta inferenza come decisione di Matteo |

Ogni criterio usa `positive`, `negative`, `contradicted`, `not_observed`, `unknown` o `not_applicable` con motivo. Il confronto finale mostra prima i limiti delle fonti e soltanto poi, se la configurazione è comparabile, le differenze di comportamento. Non produce una classifica.

## 7. Arresti obbligatori

Il senior blocca la calibrazione se manca consenso alle fonti private, la chiave è già visibile a un esecutore, le due condizioni hanno prompt o contesto diversi oltre il pacchetto, un caso viene cambiato dopo la risposta, il revisore vede le etichette, o una decisione non ha fonte primaria. In questi casi si conserva il motivo e si torna all'intervista: non si sostituisce il caso con uno simile e non si dichiara fallimento dell'agente.
