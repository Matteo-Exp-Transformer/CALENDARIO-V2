# Protocollo congelato — primo pilota MetaSkillSystem v0.1

> **Protocol ID:** `MSS-PILOT-001` · **Protocol version:** `1.0.1`
> **Oggetto:** `mss.session/0.1.1` · **System revision:** `mss-v0.1-wp0.1-freeze-2`
> **Stato:** allineato alla coppia viva del contratto; nessun esito pilota ancora prodotto.
> **Owner del protocollo e delle conseguenze:** Matteo. Il masterplan possiede lo stato del lavoro.

> **Nota storica (non utilizzabile per nuovi record):** la revisione protocollo `1.0.0` dichiarava
> la coppia legacy `mss.session/0.1.0` / `mss-v0.1-wp0.1-freeze-1`. Quella coppia resta leggibile
> per la storia già acquisita; **nuovi** record devono usare la coppia viva sopra. Il rifiuto di
> `--force-legacy` (`MSS-LEGACY-NEW-FORBIDDEN`) è intenzionale e non viene allentato da questa
> revisione. I 20 target e i 14 ID congelati sotto non cambiano semantica.

## 1. Scopo e istanza eleggibile

Il primo pilota verifica se un revisore freddo ricostruisce una seduta senza perdita o invenzione
usando soltanto il bundle JSONL e i riferimenti owner autorizzati.

La prima istanza è la **prima sessione Meta/deep sostanziale iniziata dopo la chiusura di H-1** che:

- usa il contratto esatto sopra fin dall'apertura;
- non è un test sigillato e non richiede di esporre una chiave al revisore;
- ha un esecutore/record author e un revisore distinti;
- può consegnare i riferimenti necessari senza copiare dati privati fuori dal loro owner.

Il ciclo del 09-08 che ha prodotto Report 001 e il masterplan resta fonte di calibrazione storica,
non è l'istanza 1: criterio e schema legacy `0.1.0` non erano congelati prima del suo esito. Non
viene retro-adattato per farlo passare e non viene contato come mining normalizzato.

## 2. Ruoli e materiale

- **Protocol owner:** Matteo; autorizza protocollo, eventuali cambi futuri e conseguenze.
- **Capture operator / record author:** agente operativo della seduta; produce evento e self-report.
- **Subject runtime:** agente/modello/superficie osservati; può coincidere col capture operator.
- **Cold reviewer:** agente diverso, non autore/esecutore, senza narrativa completa né verdetto atteso.
- **Adjudicator:** Matteo per conflitti sostanziali; per soli errori meccanici vale il validator H-1.

Il reviewer riceve: bundle finalizzato, questo protocollo, contratto vivo `0.1.1`/`freeze-2` e soli
owner refs necessari. Non riceve report narrativo, chat completa, chiave di test, risultato atteso o
giudizio dell'esecutore oltre alle annotazioni esplicitamente marcate `self_report`.

## 3. Denominatore congelato

Una sola istanza produce **20 target di ricostruzione**, sempre nel denominatore. `non_applicabile`
conta come risposta corretta soltanto con motivo coerente e fonte disponibile.

1. intento utente;
2. tipo e stato capsula;
3. ruolo/chiave;
4. area e pacchetti realmente caricati;
5. ambiente e classificazione privacy;
6. read/write/forbid;
7. output autorizzati;
8. rotta scelta e conflitti/alternative;
9. esito reale e aperti;
10. owner e fonti risolvibili;
11. schema e system revision;
12. produttore, subject runtime e strumenti;
13. identità, segmentazione e correlazione;
14. separazione evento/annotazioni;
15. stato e catena di rettifica, anche `nessuno`;
16. delta Persona senza promozioni improprie;
17. delta Sistema con G/O/E separati;
18. delta Output senza doppio conteggio;
19. cinque gate `product_candidate`, incluso verifica/uso;
20. asserted-by, verified-by e stato di verifica.

Per ogni target il reviewer assegna uno stato: `corretto | perso | inventato | ambiguo`. Non esiste
un parziale. Il denominatore resta 20 anche se l'istanza fallisce presto.

## 4. Gate e conseguenze fissati prima dell'esito

L'istanza passa soltanto con:

- `20/20 corretto`;
- `0 perso`, `0 inventato`, `0 ambiguo`;
- zero violazioni di routing, LOCK, owner, privacy o output autorizzati;
- zero promozioni Persona da singola istanza assistita;
- zero supporti contati come prodotti;
- self-report distinto dalla verifica indipendente;
- nessuna lettura del report narrativo o della risposta attesa da parte del reviewer.

Se fallisce, l'istanza resta fallita sotto le versioni qui indicate. La correzione è append-only;
il contratto riceve una nuova versione, il criterio vecchio non cambia e il nuovo tentativo è una
nuova istanza. Il fallimento non riapre `C9` e non produce valutazioni professionali.

L'ordine è obbligatorio: capture → finalizzazione → consegna cieca → ricostruzione → confronto con
la fonte → verdetto. Tempi, turni, rework, campi `non_noto` e accessi owner richiesti vengono
registrati, ma nel primo campione non decidono il pass/fail.

## 5. Privacy e contaminazione

- Il reviewer lavora in locale e riceve il minimo necessario.
- Contenuti `personal`/`sensitive` restano nel relativo owner; il bundle usa riferimenti stabili.
- Materiale `sealed_test`, segreti e dati di terzi non necessari sono esclusi dalla prima istanza.
- Se una fonte necessaria non è autorizzata, il target è `perso`, non viene dedotto.
- Il protocollo, le soglie e la checklist non cambiano dopo che il capture è iniziato.

## 6. Fixture minime congelate per H-1

H-1 deve implementare esattamente questi **14 casi minimi** prima del primo pilota. Può aggiungere
casi senza cambiare il significato di questi ID.

| ID | Atteso | Caso |
|---|---|---|
| `FX-V01` | pass | bundle standard/deep completo: evento + tre annotazioni |
| `FX-V02` | pass | light collegata da `SESSION_LOG` a file JSONL parsabile |
| `FX-V03` | pass | evento finalizzato + amendment append-only valido |
| `FX-V04` | pass | compact correlato e retry identico deduplicabile |
| `FX-I01` | fail | schema/system revision mancanti o sconosciuti |
| `FX-I02` | fail | vitale assente o placeholder vuoto |
| `FX-I03` | fail | annotazione Persona/Sistema/Output incorporata nel fatto base |
| `FX-I04` | fail | record ID duplicato o capture key riusata con contenuto diverso |
| `FX-I05` | fail | owner/source ref non risolvibile nel perimetro fixture |
| `FX-I06` | fail | candidato prodotto senza uno dei cinque gate canonici |
| `FX-I07` | fail | report standard/deep senza bundle capsula |
| `FX-I08` | fail | riga light senza link/evento light valido |
| `FX-I09` | fail | `independently_verified` senza verificatore indipendente |
| `FX-I10` | warn/deny secondo matrice H-1 | target/LOCK riconoscibile ma non dichiarato/autorizzato |

Le fixture useranno dati sintetici, nessun esempio personale di Matteo. `FX-V02` è già materializzata
come prova di forma in `fixtures/v0.1/`; H-1 completa il set eseguibile e possiede la matrice
superficie/momento/effetto/fallback/bypass/G-O-E. Questo protocollo possiede IDs, numero e significato
congelati.

## 7. Cosa resta deliberatamente aperto

Non sono decisi qui: store definitivo, retention finale, numero di istanze successive, soglia di
continuità fra tipologie, strategia multiutente, backup ed enforcement E3. Dopo la prima istanza il
masterplan registra i dati e Matteo decide il denominatore delle istanze successive **prima** di
eseguirle.
