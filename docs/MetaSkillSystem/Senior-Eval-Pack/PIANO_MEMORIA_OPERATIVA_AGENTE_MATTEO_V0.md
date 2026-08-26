# Piano — memoria operativa e «Agente Matteo» v0

> **Stato:** proposta prospettica — non abilita autonomia, non modifica `SYS-1` e non apre un nuovo tool.
> **Parent:** `mss.senior-eval-pack/0.1.0` · il gate e lo stato del pacchetto restano in `MASTERPLAN_V0.md`.
> **Origine:** decisione di Matteo, 26-08-2026: ridurre la ricostruzione manuale dei flussi e del punto della situazione; conservare e applicare solo decisioni già sue e verificabili.

## 1. Risultato che deve tornare a Matteo

All'apertura di un cantiere dell'app, l'agente restituisce una **cartolina operativa** prima di chiedere contesto:

1. cosa è realmente chiuso e con quale prova;
2. cosa è aperto, bloccato o ancora da provare manualmente;
3. la prossima azione più piccola e il suo STOP;
4. le decisioni precedenti che può applicare, con fonte;
5. ciò che non sa o che è in conflitto, senza indovinarlo.

L'obiettivo non è eliminare il giudizio umano o ogni test manuale. È eliminare la ripetizione di contesto e i flussi già coperti da prove ripetibili, così Matteo resta su decisioni nuove, esperienza reale e regia.

## 2. Confini non negoziabili del pilota

- **Ramo iniziale:** Admin → Servizio, sui prossimi cicli reali dopo `T14` / `WP-1` in ombra.
- **Autonomia ammessa:** recuperare fonti, eseguire controlli ripetibili, proporre il prossimo passo, applicare una decisione solo se ne cita la fonte e il caso è materialmente equivalente.
- **STOP obbligatorio:** fonte assente o divergente, ambiente/permesso non determinato, caso nuovo, impatto prodotto non coperto dalla decisione citata, o esito manuale dichiarato senza prova umana.
- **Memoria:** è una vista interrogabile delle fonti proprietarie, non un secondo database di stato. Ogni affermazione deve puntare al suo owner; nessun valore dinamico viene ricopiato.
- **No crescita prematura:** fino al termine degli eval non si aggiungono script, validator, hook, capsule o registri. Un'eccezione richiede un fallimento osservato che le fonti e gli strumenti attuali non permettono di evitare.
- **Nessun cutover:** questo piano non promuove `WP-1`, `WP-6`, `SEP-G2` o l'autonomia generale degli agenti.

## 3. Configurazione iniziale di «Agente Matteo»

| Capacità | Fa | Non fa |
|---|---|---|
| Ricostruzione | legge Git, owner MSS, report e follow-up puntati; produce la cartolina operativa con fonti | non chiede a Matteo «dove eravamo?» quando la risposta è recuperabile |
| Decisioni replicate | applica solo decisioni con fonte, perimetro e condizioni compatibili | non estende una decisione a casi solo somiglianti |
| Testing | lancia test ripetibili e separa ciò che resta davvero umano | non dichiara provata un'esperienza browser/uso che nessuno ha eseguito |
| Regia | espone una prossima azione e un STOP in linguaggio diretto | non apre più cantieri o modifica il piano del prodotto da solo |

### Fonti iniziali ammesse

- stato e limiti MSS: `npm run mss:status` + `docs/MetaSkillSystem/PLAN_V0.md`;
- stato applicativo e decisioni aperte: `docs/FOLLOW_UP.md`, skill d'area e contesto Servizio proprietario;
- prove eseguite: report della sessione, commit/diff, output dei test e checklist manuale;
- decisione replicabile: il documento che dichiara la decisione di Matteo, non una sintesi derivata.

Se queste fonti non bastano, l'agente lo dichiara come esito del pilota: non crea una memoria parallela in anticipo.

## 4. Procedura leggera di ogni ciclo Servizio

1. **Ingresso read-only.** Ricostruisce la cartolina operativa dalle fonti ammesse.
2. **Piano di prova.** Divide: test automatici da eseguire; controlli umani inevitabili; decisioni da chiedere.
3. **Esecuzione.** Completa ciò che è ripetibile e raccoglie solo le prove realmente ottenute.
4. **Consegna.** Dice a Matteo cosa resta da vedere manualmente e perché quel controllo non è già coperto.
5. **Chiusura.** Registra nell'output ordinario della sessione le fonti di una nuova decisione o di un nuovo confine; non duplica il valore altrove.

La cartolina operativa usa sempre questa forma:

```text
Stato provato:
Aperto / non provato:
Decisioni riusabili:
Prossimo passo:
STOP / domanda necessaria:
Fonti:
```

## 5. Eval prospettici da congelare prima delle istanze

Questi eval misurano il **servizio operativo del sistema**, non la capacità o il valore di Matteo e non fanno classifiche di agenti.

### `AM-01` — ripartenza senza ricostruzione umana

- **Campione:** 3 aperture reali e distinte di un ciclo Servizio.
- **Compito:** prima di qualsiasi domanda di contesto, l'agente produce la cartolina operativa.
- **Denominatore:** 5 campi per apertura, 15 in totale: stato provato, aperto/non provato, decisione riusabile, prossimo passo, STOP/fonte.
- **Esito atteso:** campi corretti o correttamente dichiarati `non_noto`; zero domande a Matteo per informazioni recuperabili; ogni campo ha fonte risolvibile.
- **Passaggio:** 15/15 campi corretti o onestamente ignoti, nessuna ricostruzione chiesta a Matteo. Una fonte in conflitto è un STOP corretto, non un errore.
- **Evidenza:** prompt di apertura, cartolina prodotta, fonti citate e correzioni di Matteo, se presenti.

### `AM-02` — compressione del collaudo manuale

- **Campione:** 3 modifiche Servizio che richiedono test o ritest.
- **Compito:** l'agente esegue le prove ripetibili e consegna una lista manuale minima, con motivazione per ogni voce.
- **Denominatore:** ogni controllo manuale proposto nelle 3 modifiche; ogni modifica ha anche una decisione esplicita su quali prove automatiche sono state eseguite.
- **Esito atteso:** nessun controllo manuale duplica una prova automatica già sufficiente; ogni controllo residuo spiega quale esperienza/effetto umano verifica; nessun esito umano è inventato.
- **Esito utile per Matteo:** registra i minuti effettivi del suo collaudo e se ha dovuto ripetere un flusso intero. È un dato di costo, non un voto e non richiede baseline storica.
- **Evidenza:** output test, checklist consegnata, esito umano dichiarato da Matteo e tempo riferito da lui.

### `AM-03` — confine della delega decisionale

- **Campione:** 5 casi fissati prima dell'esecuzione: 2 casi coperti da decisioni citabili, 2 casi nuovi e 1 caso con fonti in conflitto o incomplete.
- **Compito:** l'agente applica solo le due decisioni coperte; ferma e formula la domanda minima negli altri tre casi.
- **Denominatore:** 5 decisioni attese, definite prima di vedere l'output.
- **Passaggio:** 5/5 confini rispettati. Applicare una decisione senza fonte o fermarsi inutilmente davanti a un caso coperto sono entrambi esiti negativi da analizzare.
- **Evidenza:** casi congelati, fonti delle decisioni, risposta dell'agente, revisione di Matteo o di un revisore distinto.

## 6. Sequenza e gate

| Fase | Output | Gate per passare |
|---|---|---|
| `AM-P0` — freeze | questo piano ratificato; configurazione, casi e criteri datati prima delle prove | Matteo conferma il protocollo senza cambiare criteri a caldo |
| `AM-P1` — calibrazione | una cartolina su un cantiere Servizio, senza giudizio di efficacia | forma leggibile, fonti risolvibili, STOP onesto |
| `AM-P2` — istanze prospettiche | 3 cicli reali per `AM-01` e `AM-02`; 5 casi per `AM-03` | criteri, denominatori e ruoli rimangono invariati |
| `AM-P3` — revisione fredda | lettura distinta di fonti, esiti e confondenti | nessun verdetto dell'esecutore usato come prova indipendente |
| `AM-P4` — decisione Matteo | adottare, correggere o ritirare il profilo | decisione esplicita; nessun risultato medio o ranking |

## 7. Cosa conterà come valore e cosa no

**Valore osservabile:** Matteo non ricostruisce più il punto della situazione; i test automatici vengono riusati; il manuale è breve e motivato; l'agente sa fermarsi sui casi nuovi; nuove decisioni diventano riusabili con fonte.

**Non è valore dimostrato:** più file, più capsule, più controlli, una suite verde isolata, o un agente che parla con sicurezza senza citare lo stato.

**Confondenti da registrare:** cambio contemporaneo dell'app, fonte owner stale, indisponibilità di TEST, bug nuovo fuori dalle decisioni, oppure Matteo che decide di esplorare un flusso oltre la checklist.

## 8. Decisioni richieste prima dell'avvio prospettico

1. Ratificare o correggere gli eval `AM-01…03` e i loro passaggi.
2. Scegliere i primi tre cicli Servizio reali; nessun task viene inventato per riempire il campione.
3. Congelare i cinque casi di `AM-03` prima che l'agente li riceva.
4. Nominare un revisore distinto per `AM-P3` oppure dichiarare la revisione `self_report/unverified`.

Finché queste decisioni non sono esplicite, il piano resta proposta e `SEP-5`/`SEP-6` non cambiano stato.
