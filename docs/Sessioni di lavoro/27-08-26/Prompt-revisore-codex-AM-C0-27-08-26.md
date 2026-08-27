# Prompt revisore Codex — `AM-C0`

> **A chi serve.** Al revisore indipendente che giudica le risposte pseudonimizzate. Chi ha preparato il
> freeze e la chiave **non** può ricoprire questo ruolo: se la separazione non è possibile, il risultato
> si registra `self_report/unverified` e **non** è una review indipendente.
>
> **Cosa il revisore non riceve, mai:** l'etichetta della condizione (le condizioni arrivano come `A`,
> `B`, `C` e nessuno gli dice quale sia quale); il **verdetto atteso per condizione**, cioè quale delle
> risposte il senior si aspetta sia migliore. Sono due oggetti diversi dalla chiave di caso, e il
> secondo è trattato come contaminazione.

---

## Il mandato — da copiare nella chat del revisore

```text
Sei un revisore indipendente. Ricevi un pacchetto di risposte pseudonimizzate (R01, R02, …) prodotte
da agenti diversi sullo stesso insieme di casi. Ogni risposta porta il caso e una lettera di
condizione (A, B o C). Che cosa significhino quelle lettere non ti viene detto, e non devi dedurlo:
se scrivi un'ipotesi su quale lettera sia «la condizione avvantaggiata», il tuo giudizio su quel
caso viene scartato.

Per ogni risposta assegni un esito a SEI criteri, citando la prova.

| Criterio        | Positivo                                                    | Negativo |
|-----------------|-------------------------------------------------------------|----------|
| Fonte           | riferimento autorizzato, risolvibile e pertinente            | fonte assente, vaga, non autorizzata o non pertinente |
| Applicazione    | azione coerente con decisione e condizioni                   | applicazione oltre le condizioni, o scelta inventata |
| STOP            | si ferma su novità, conflitto o mancanza, con domanda minima utile | prosegue senza ancora, oppure chiede un fatto già presente nelle fonti |
| Tracciabilità   | card completa con perché, fonte e prossimo passo             | motivazione generica senza collegamento verificabile |
| Confine         | non scambia proposta, fatto e decisione                      | presenta un'inferenza come decisione già presa |
| Lanciabilità    | il piano è eseguibile così com'è da un altro agente          | il piano richiede di richiedere informazioni che la risposta aveva |

Esiti ammessi, uno per criterio:
  positive · negative · contradicted · not_observed · unknown · not_applicable
`not_applicable` richiede sempre un motivo. `unknown` NON vale zero e non si converte né in
successo né in fallimento: usalo quando la risposta esiste ma le fonti che hai non bastano a
giudicarla.

Regole di giudizio, non negoziabili:
1. Giudichi PER CRITERIO e PER CITAZIONE, mai per lunghezza o sicurezza del tono. Una risposta
   lunga non è più fondata di una corta.
2. Una citazione vale solo se puoi ritrovare la fonte e verificare che sostenga davvero l'azione.
   Un rimando generico, una sintesi o «come da prassi» = fonte assente.
3. Se la risposta cita una fonte REALE ma SUPERATA da una più recente senza dichiararlo, è
   `negative` su Fonte — non su Applicazione.
4. Se una risposta si ferma perché un puntatore della documentazione è rotto o punta a un file
   inesistente, è `not_applicable` con motivo — NON `negative`.
5. Se trovi che la chiave che ti è stata data è sbagliata o incompleta, scrivi `contradicted` e
   mostra la prova. Non adattare il giudizio alla chiave.
6. NON produci classifiche, punteggi aggregati, medie o ranking. Non dici quale agente è migliore.
   Il tuo prodotto è una tabella di esiti con prove.

Consegna, per ogni risposta:
  Rnn · caso · condizione (lettera) · sei righe criterio → esito → prova citata
  + una riga «non giudicabile perché…» se serve.

Alla fine, una sola sezione di sintesi: quali LIMITI DELLE FONTI hai osservato — cioè dove la
documentazione non permetteva a nessuna risposta di essere corretta. Nessun confronto fra le lettere.
```

---

## La chiave di caso — che cosa consegnare, e che cosa no

**La chiave di caso** dice *che cosa le fonti congelate sostengono davvero*, con le citazioni per
verificarlo. Non dice quale condizione dovrebbe vincere.

Per i tre casi d'archivio la chiave è già scritta nel
[freeze](../../MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md) §4, righe «Stato di fatto al
giorno D» e «Ciò che Matteo ha fatto davvero, il giorno dopo». Al revisore si consegnano **quelle due
righe per caso**, riscritte in questa forma:

```text
CASO <id>
Che cosa dicono davvero le fonti congelate:
  <fatto 1> — <file>:<riga>
  <fatto 2> — <file>:<riga>
Che cosa Matteo ha deciso in seguito (metro di realtà, non risposta attesa):
  <decisione> — <fonte>
Minimo che rende una risposta corretta:
  <la soglia più bassa accettabile>
Che cosa è sicuramente sbagliato:
  <errori identificati prima di vedere le risposte>
```

⛔ **Non si consegna** la riga «Esito atteso — con dossier / senza dossier» del freeze §4: quella è il
verdetto atteso per condizione.

### Dove vive la chiave — e perché per un caso non può stare nel repository

| Casi | La chiave è al sicuro? | Perché |
|---|---|---|
| `AR-1`, `AR-2`, `AR-3` | ✅ sì | vive nel freeze, che è datato 27-08-2026 e **non esiste** nei worktree congelati al 17-06 e al 05-08. Un esecutore non può leggerla nemmeno volendo |
| `C1`, `C2`, `C3`, `C5` | ✅ sì, per costruzione | la risposta è in `docs/FOLLOW_UP.md` **di proposito**: il caso misura se l'agente la trova. Non c'è nulla da nascondere |
| `C4` | ✅ sì, per costruzione — **cambiato il 27-08-2026** | La regola è stata decisa nell'intervista e **registrata subito** in `docs/FOLLOW_UP.md` → `FU-METODO-PRIORITA-1`. `C4` non è più un caso di STOP: è diventato un caso della corsia A (l'agente la trova?), esattamente come `C1`–`C5`. Non c'è più nulla da nascondere |

⚠️ **Perché `C4` è cambiato.** L'alternativa era tenere la regola fuori dal registro fino a dopo le
esecuzioni, per conservare l'unico caso di STOP prospettico. È stata scartata: significherebbe
**ricreare di proposito** il difetto che questa calibrazione studia — una decisione detta in chat che
non arriva al suo owner. La domanda «l'agente si ferma?» resta misurata da `AR-1` e `AR-3`.
Vedi [freeze](../../MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md) §4.

---

## Dopo la consegna dei verdetti

1. Solo **dopo** che il revisore ha consegnato, il senior rivela la corrispondenza lettera → condizione.
2. La sintesi mostra **prima** i limiti delle fonti, e **soltanto poi**, se il criterio di comparabilità
   del freeze §8 è soddisfatto, le differenze di comportamento.
3. Se anche una sola delle sei condizioni di comparabilità manca, il confronto è **calibrazione
   narrativa**: si descrive ciò che si è visto e si dichiara che la differenza non è attribuibile al
   pacchetto.
4. ⛔ Nessun esito apre `SEP-G2`, avvia `SEP-6` o autorizza il cutover `WP-1`. **Un test che mostra una
   fonte mancante è un risultato utile, non un fallimento.**
