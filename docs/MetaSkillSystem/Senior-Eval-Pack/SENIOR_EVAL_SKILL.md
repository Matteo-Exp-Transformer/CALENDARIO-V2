---
name: senior-eval-pack
description: >-
  Instrada la catalogazione, progettazione e valutazione di sedute senior e delle
  metodologie usate per strutturare il MetaSkillSystem, senza trasformare storia o
  calibrazioni in classifiche.
---

# Senior Eval Pack — ingresso `mss.senior-eval-pack/0.1.0`

> **Stato:** sperimentale · **Parent:** `SYS-1` · **Owner dello stato interno:**
> `MASTERPLAN_V0.md`.
>
> Questo pacchetto è subordinato al MetaSkillSystem. Non è un nuovo kernel, non corregge il
> verdetto H-1.3, non certifica il validator e non autorizza `WP-1` o `WP-3`.

## 1. Confini

Il pacchetto possiede:

- il contratto specifico per osservare configurazioni agente, metodi, sedute, output ed eval senior;
- il catalogo storico sintetico delle sedute e metodologie pertinenti;
- lo stato, i gate e la sequenza del proprio cantiere;
- la roadmap leggibile derivata dal masterplan del pacchetto.
- la continuità operativa fra senior tramite un handoff stabile, che resta una vista e non possiede
  lo stato.

Non possiede:

- lo stato globale di `SYS-1`, che resta in `../PLAN_V0.md`;
- schema, semantica o validator di `mss.session/0.1.1`;
- dati personali, prove sigillate o valutazioni professionali di Matteo;
- remediation e verdetto H-1.3;
- ranking, livelli o classifiche di agenti e metodologie.

## 2. Ordine minimo

1. Identifica l'intento nella tabella di routing.
2. Leggi solo i documenti indicati in **Carica subito**.
3. Prima di valutare o confrontare, verifica nel contratto se criteri, compito, condizioni e
   denominatore erano congelati prima dell'esito.
4. Se manca comparabilità, conserva l'evidenza come storia o calibrazione e non produrre un
   confronto.
5. Per modificare stato o gate apri il masterplan; la roadmap non è autorizzata a possederli.
6. Per riprendere una sessione precedente apri l'handoff, poi verifica il suo prossimo task nel
   masterplan prima di agire.

## 3. Routing interno

| Intento | Carica subito | Solo se necessario | Non caricare | Owner dello stato | Autorità / STOP |
|---|---|---|---|---|---|
| Riprendere il lavoro di un senior precedente | questo file + `HANDOFF_SENIOR_V0.md` | masterplan per verificare stato/gate; ultimo report per le prove | narrativa storica non puntata e dati privati | masterplan per stato; handoff per continuità | read; write dell'handoff solo a fine sessione dopo report e verifiche; STOP su divergenza dagli owner |
| Capire come hanno lavorato i senior | questo file + `CATALOGO_SEDUTE_E_METODI_V0.md` | fonti puntate dal singolo record | masterplan globale, fixture, dati privati | catalogo per evidenza; masterplan per stato | read; STOP se la fonte richiesta è privata o non autorizzata |
| Progettare una nuova metodologia | questo file + `CONTRATTO_EVAL_SENIOR_V0.md` | catalogo delle famiglie pertinenti; masterplan se si apre lavoro | narrativa storica non pertinente | masterplan del pacchetto | proposta; write solo con mandato; STOP se cambia contratto congelato di un'istanza |
| Avviare una seduta senior osservabile | contratto + masterplan | catalogo per evitare metodi già tentati | ranking e verdict attesi | masterplan per gate; contratto per campi | write autorizzato; STOP se protocollo/criteri/ruoli non sono fissati prima |
| Valutare una seduta | contratto + record e fonti della seduta | metodo/versione e output osservato | conclusione dell'esecutore se la revisione deve essere cieca | contratto per eval; Matteo per decisione | evaluator distinto; STOP se indipendenza, prove o denominatore sono ignoti |
| Valutare o confrontare metodologie | contratto + record dei metodi candidati | catalogo e protocolli congelati | sedute non comparabili come se fossero campioni | contratto per comparabilità | STOP se compiti, condizioni o denominatori non sono comparabili |
| Catalogare materiale storico | contratto + catalogo | fonte primaria e Git mirato | file personali non autorizzati | catalogo | append/rectify; vietato assegnare punteggi retroattivi |
| Correggere un'annotazione precedente | contratto + record bersaglio | prove della correzione | riscrittura silenziosa del record | contratto | solo rettifica append-only; STOP se target/provenienza sono ambigui |
| Aggiornare masterplan o roadmap | masterplan | roadmap come vista | `../PLAN_V0.md` salvo mandato globale separato | masterplan | write sul file owner; roadmap solo allineamento di vista |
| Preparare una revisione indipendente | contratto + protocollo/istanza + sole fonti autorizzate | catalogo per precedenti metodologici | verdetto atteso e narrativa non necessaria | contratto per processo; Matteo per go/no-go | revisore distinto; STOP su contaminazione o chiave esposta |

## 4. Autorità sui file

| File | Read | Write | Divieti principali |
|---|---|---|---|
| `SENIOR_EVAL_SKILL.md` | ogni rotta del pacchetto | sessione Meta autorizzata | non duplicare contratto, catalogo o stato |
| `CATALOGO_SEDUTE_E_METODI_V0.md` | storia/metodi | catalogazione o rettifica autorizzata | niente stato dinamico, ranking o overwrite della storia |
| `CONTRATTO_EVAL_SENIOR_V0.md` | progettazione/eval | sessione Meta con versionamento | non cambiare criteri di un'istanza già iniziata |
| `MASTERPLAN_V0.md` | lavoro/stato/gate | writer autorizzato del pacchetto | non possedere lo stato globale di `SYS-1` |
| `ROADMAP_V0.md` | orientamento | solo vista coerente col masterplan | non duplicare stato, decisioni vive o gate correnti |
| `HANDOFF_SENIOR_V0.md` | ripartenza/chiusura | ultimo atto di una sessione senior documentata | non possedere stato/gate, non sostituire report o riscrivere il registro |

## 5. Regole epistemiche

- Separa sempre **fatto**, **inferenza**, **proposta** e **decisione esplicita di Matteo**.
- `Senior` identifica un ruolo o una configurazione, non un voto.
- Self-report dell'esecutore, verifica indipendente e decisione di Matteo sono oggetti diversi.
- Una suite verde dimostra soltanto i casi eseguiti; una revisione successiva può contraddire la
  chiusura senza cancellarla.
- Una seduta che progetta il proprio contratto è `calibrazione`, `non_comparabile` e
  `self_report/unverified` finché non interviene un revisore indipendente.
- Punteggi aggregati, ranking e classifiche restano vietati finché Matteo non approva prima del
  campione una soglia sufficiente e un protocollo comparabile.
- Per le regole critiche registra G, O ed E separatamente; vale il livello più debole, mai la media.

## 6. STOP obbligatori

Fermarsi prima di procedere se:

- ruolo, owner, privacy, autorità o output autorizzati non sono determinati;
- si dovrebbe modificare `../PLAN_V0.md`, H-1.x, validator, hook, fixture o un secondo router senza
  mandato esplicito;
- un confronto richiede di trattare una calibrazione come eval valida;
- il criterio viene definito o cambiato dopo aver visto l'esito;
- revisore, esecutore, autore del self-report e soggetto non sono separati quanto richiesto;
- una rettifica cancellerebbe o riscriverebbe silenziosamente la storia;
- una fonte privata o sigillata dovrebbe essere copiata nel pacchetto.

## 7. Lifecycle

1. **Storico:** record sintetico con fonte, completezza e limiti.
2. **Disegno:** metodo e contratto versionati; nessun verdetto.
3. **Calibrazione:** prova del flusso, non comparabile.
4. **Istanza prospettica:** protocollo e criteri congelati prima dell'avvio.
5. **Eval:** osservazioni criterio-per-criterio con denominatore e confondenti.
6. **Revisione indipendente:** conferma, contraddice o limita l'eval.
7. **Decisione:** appartiene a Matteo ed è registrata senza retro-riscrivere i passaggi precedenti.
8. **Rettifica:** nuovo record append-only collegato al bersaglio.
9. **Handoff:** dopo report e verifiche, aggiorna la vista attiva e accoda il passaggio al registro.

Il prossimo passo e ogni gate vivo si leggono esclusivamente in `MASTERPLAN_V0.md`.
