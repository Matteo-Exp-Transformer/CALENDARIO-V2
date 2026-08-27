# Report — lettura della calibrazione `AM-C0` e apertura del cantiere criteri · 27-08-2026

**Chi/cosa:** senior orchestratore, segmento del 27-08 successivo al report di Fase 0.
**Perché:** leggere l'esito di `AM-C0`, rispondere alle quattro osservazioni di Matteo, e preparare la
seduta in cui lui sceglierà **con** un senior i criteri di valutazione di MSS e di «Agente Matteo».
**Risultato:** difetto CRLF sulle fixture chiuso; mandato tecnico enforcement scritto; lettura critica
della calibrazione con due correzioni al riassunto ricevuto in chat; prompt della prossima seduta.

---

## 2. Cosa è stato fatto

1. **Trovato e chiuso un difetto che avrebbe fatto deragliare la calibrazione.** `test:mss` risultava
   rosso al senior enforcement e verde nel repository principale, **sullo stesso commit**. Causa:
   `.gitattributes` non elencava `.jsonl` fra le estensioni a fine-riga fissa, e con
   `core.autocrlf=true` ogni checkout **nuovo** su Windows convertiva le 34 fixture MSS, rompendo 12
   `sha256` congelati. Riprodotto in un worktree pulito, corretto con una riga, riverificato verde.
   Rilevante perché la corsia A della calibrazione **apre worktree sul passato**: ogni cartella creata
   dal test sarebbe nata rossa.
2. **Scritto il mandato tecnico dello slice 1+2** dell'enforcement, con il disegno da congelare prima
   del codice e il divieto di portarlo su `env/test` finché la calibrazione non ha chiuso.
3. **Imposto alla seduta di calibrazione di registrare a mano le proprie decisioni di metodo.** Ha
   funzionato: `docs/FOLLOW_UP.md` contiene ora cinque righe `FU-METODO-*` che prima sarebbero morte
   in chat.
4. **Letto e verificato l'esito di `AM-C0`** al di là del riassunto ricevuto in chat (§8).

## 3. File toccati e perché

| File | Perché |
|---|---|
| `.gitattributes` | `*.jsonl text eol=lf`: senza, ogni checkout nuovo rompe 12 hash congelati |
| `docs/Sessioni di lavoro/27-08-26/Prompt-senior-enforcement-slice-1-2-mandato-tecnico-27-08-26.md` | mandato tecnico, proposte 1 e 2 autorizzate |
| `docs/Sessioni di lavoro/27-08-26/Prompt-senior-enforcement-documentazione-obsoleta-27-08-26.md` | marcato consumato + puntatore al seguito, per non rilanciarlo a vuoto |
| `docs/Sessioni di lavoro/27-08-26/Prompt-senior-orchestratore-test-agente-matteo-27-08-26.md` | obbligo di registrare le decisioni di metodo in `FOLLOW_UP` prima di chiudere |
| `docs/Sessioni di lavoro/27-08-26/Prompt-senior-criteri-valutazione-mss-e-agente-matteo-27-08-26.md` | mandato della prossima seduta, con Matteo che sceglie |
| questo report | lettura critica + spunti per il senior dei criteri |
| `docs/Sessioni di lavoro/27-08-26/judgments-senior-lettura-am-c0-27-08-26.json` | giudizi della seduta; **primo file con l'asse Persona non vuoto**, dove finora era vuoto in 55 su 56 |

## 4. Test eseguiti e risultato

| Comando | Esito | Lettura |
|---|---|---|
| `npm run test:mss` (repo principale, `97ebf85`) | **verde** — 42 fixture + 57 gruppi | il codice non era rotto |
| `npm run test:mss` (worktree enforcement, stesso commit) | **rosso** — 12 `hash frozen mutato` | il difetto è nel checkout, non nel codice |
| `npm run test:mss` (worktree pulito creato da me, stesso commit) | **rosso**, identico | riprodotto in modo indipendente |
| stesso worktree dopo `*.jsonl text eol=lf` + ri-checkout | **verde** | correzione dimostrata, nessuna fixture toccata |
| `sha256sum` + conteggio `CR` sulle due copie di `FX-V01-bundle.jsonl` | 7602 vs 7606 byte, 0 vs 4 | la causa è la conversione di fine riga |
| `npm run validate:docs` | verde — 194 file, 0 path rotti | |
| grep di «fermati / chiedi prima / STOP» sullo strato di istradamento | solo STOP **specifici** (PROD, comando non riconosciuto, zone confondibili) | conferma indipendente del «buco 1» della sintesi |
| `grep FU-METODO docs/FOLLOW_UP.md` | 5 righe | l'obbligo aggiunto al mandato ha funzionato |

## 5. File di skill aggiornati

| File di skill | Aggiornato? | Perché |
|---|---|---|
| `.claude/CLAUDE.md`, `AGENTS.md`, `.cursor/rules/comandi-base.mdc` | **no, ed è il punto** | qui vivrebbe la regola di STOP mancante (§8.3), ma è una modifica al comportamento di **tutti** gli agenti: la decisione è di Matteo, non mia. Registrata come proposta nel prompt della prossima seduta. Risultano inoltre modificati **da altri** e non committati: ragione in più per non sovrascriverli. |
| Skill d'area applicative | nessuna | la seduta non tocca l'app |

## 6. Dati comunicazione

- Prompt sostanziali di Matteo in questo segmento: **4** (correzione di sequenza; conferma commit +
  richiesta prompt enforcement; esito `AM-C0` con quattro osservazioni; richiesta di opinione).
- Correzioni ricevute: **2** — entrambe hanno cambiato il lavoro, entrambe erano fondate (§9).
- Follow-up generati: **0** diretti; 5 `FU-METODO-*` prodotti dalla seduta di calibrazione per effetto
  dell'obbligo che questa seduta le ha imposto.

## 7. Analisi flusso prompt, efficienza e statistiche

Il segmento è costato poco perché ha **verificato prima di ragionare**: il difetto CRLF è stato isolato
in quattro comandi, ed ha evitato una seduta intera spesa a inseguire «MSS è rotto». Il costo più alto è
stato la lettura degli artefatti `AM-C0` — necessaria, perché il riassunto arrivato in chat aveva
ammorbidito due fatti che cambiano le conclusioni.

Attrito misurato: il cold-check pre-commit è scattato **4 volte**, sempre come da progetto, sempre su
commit legittimi. Costo per volta ≈ una rilettura. Vedi `R5`.

## 8. La mia lettura della sessione

### 8.1 Due cose che il riassunto in chat ha ammorbidito

**Dieci caselle su diciannove non sono corse, e il motivo non è «come deciso».** Il registro dichiara
un denominatore di **114 giudizi**; ne sono stati emessi **54**. Le altre 60 sono `not_observed` per due
difetti del freeze, trovati eseguendolo:

- **Quattro dei cinque casi «di oggi» non hanno mai avuto un testo congelato.** Il freeze li congelava
  «per rimando al `PROTOCOLLO…` §4», ma quel §4 non contiene casi: contiene **cinque schede candidate**,
  dichiarate esse stesse «un canovaccio per l'intervista». ⚠️ **Quel §4 l'ho riscritto io in Fase 0** e
  l'ho lasciato in forma di canovaccio; il freeze l'ha poi trattato come se fosse congelato. È un difetto
  di consegna mio quanto di lettura suo, e va detto così.
- **Il quinto caso girava dove è scritta la sua risposta.** `C4` un testo ce l'ha, ma la corsia «oggi»
  gira sul repository di oggi — dove vivono il freeze e i prompt della seduta, con dentro la riga
  «Esito atteso».

L'esecutore ha fatto la cosa giusta: **non li ha rattoppati.** Un freeze corretto dopo aver guardato
dentro non è più un freeze.

### 8.2 Il quarto canale di contaminazione, che avevo mancato

Nel mandato avevo elencato tre canali: file di contesto d'area, report di sessione, memoria del runtime.
Ne mancava uno, e si è manifestato: **gli artefatti del test vivono nel repository sotto test.** Freeze,
protocollo, prompt, dossier, registro — tutti leggibili dall'esecutore.

È il canale più insidioso perché **cresce ogni volta che si prepara meglio il test**: più il disegno è
accurato, più scrive nel repository la risposta che sta per chiedere. Va risolto strutturalmente — gli
artefatti di una calibrazione vivono fuori dal perimetro che l'esecutore può leggere — non con un
controllo di fuga fatto a mano ogni volta.

### 8.3 Che cosa la calibrazione ha davvero prodotto

Il confronto fra condizioni **non è attribuibile**, ed è dichiarato prima di leggere i verdetti: giusto
così. Ma il prodotto vero non era il confronto. È questo:

- **`AR-2` è il controllo che rende leggibile tutto il resto.** Quando la risposta è scritta nel
  repository, tutte e tre le condizioni l'hanno trovata, 6 criteri su 6, **anche senza dossier**.
  Il problema non è la capacità di cercare.
- **Quando la decisione non esiste, gli agenti decidono al posto di Matteo.** Su `AR-1` (due meccanismi
  sovrapposti) e `AR-3` (una divergenza dichiarata «da decidere dopo»), due risposte su tre hanno
  trovato e citato correttamente la fonte, e poi hanno proceduto lo stesso.
- **La regola che direbbe loro di fermarsi non esiste nel progetto.** Verificato in modo indipendente:
  nello strato di istradamento gli STOP ci sono, ma sono **specifici** — ambiente PROD, comando non
  riconosciuto, zone confondibili fra Prenota e Menu QR. La regola generale «le fonti si contraddicono
  o manca una decisione → fermati e chiedi» non è scritta da nessuna parte. Vive solo nel dossier
  operativo e nelle righe `FU-METODO-*` scritte ieri.

### 8.4 «Auto» non è un difetto del test — ma non risponde alla domanda che il test poneva

Verbatim, il 27-08-2026: «quando uso cursor uso sempre auto. quindi il random in qualche modo è la
condizione di lavoro. se definissi 1 solo modello, non avrei la reale statistica di quando uso cursor.»

Matteo lavora sempre su Auto: fissare il modello misurerebbe un laboratorio che non usa. È un'obiezione
fondata, e va accolta **separando due domande che finora erano una sola**:

| Domanda | Condizione giusta | Che cosa serve |
|---|---|---|
| «cosa mi succede quando lavoro come lavoro davvero?» | **Auto**, che è la sua condizione reale | **volume**: molte esecuzioni dello stesso caso. Con 3 caselle per condizione il caso non si media, si accumula |
| «il dossier cambia il comportamento?» | modello fissato e dichiarato | è una **causa**, e una causa non si legge da un campione dove varia anche altro |

La prima produce una **frequenza** («su 20 volte si è fermato 6»), utilissima e onesta. La seconda
produce un'**attribuzione**, e oggi non è alla portata. Sono due prodotti diversi, e finora sono stati
schiacciati in una tabella sola.

Proposta a costo quasi zero che restituisce la variabile senza rinunciare ad Auto: **far dichiarare
all'esecutore, in prima riga, quale modello è e quali strumenti ha attivi.** Non è garantito — un
modello può sbagliarsi su sé stesso — ma converte una parte dei `non_noto` in noto, e si registra
accanto all'esito invece di perderlo.

⚠️ Il punto che vale più di tutti: **i due buchi trovati non hanno avuto bisogno né dell'una né
dell'altra condizione.** Sono venuti da un `grep` su 31 file.

### 8.5 Tre domande sono poche — ma la cura non è «più domande nello stesso disegno»

Matteo ha ragione sul dato: 54 giudizi emessi su 114 dichiarati, e tre soli quesiti contro un corpus di
oltre 1100 commit e 500 report. Ma la diagnosi non è «serviva più volume». È che **due corsie diverse
competono per lo stesso budget**:

| Corsia | Che cosa prova | Costo | Copertura |
|---|---|---|---|
| **Pesante** — freeze, revisore cieco, sei criteri | **comportamento**: cosa fa un agente davanti a un bivio | una chat per casella (19 caselle = 19 chat) | pochi casi |
| **Leggera** — comando sullo strato di istradamento | **raggiungibilità**: se una regola è incontrabile da chi apre il progetto | secondi | tutto il corpus |

Il «buco 1» è venuto dalla leggera, e la leggera si può girare su **tutte** le righe del dossier, non
su tre. Ma — ed è la ragione per cui la pesante non va buttata — **non si sarebbe saputo cosa cercare
senza la pesante**: la domanda «la regola di STOP è raggiungibile?» nasce dall'aver visto tre agenti
non fermarsi. L'ordine giusto non è sostituire, è **alternare**: pesante su pochi casi per scoprire
quali regole contano, leggera su tutto per misurare quante sono raggiungibili.

### 8.6 Enforcement e fix vanno unificati, e non per comodità

**Il test ha convalidato empiricamente la diagnosi dell'enforcement.** Quella chat aveva dedotto dai
documenti che «le protezioni coprono la forma e non il contenuto, e una decisione detta in chat può non
arrivare mai in un owner». Il test ha osservato il comportamento corrispondente: due agenti su tre
leggono «non sanata, va decisa dopo», la citano correttamente, e procedono lo stesso. **Un'ipotesi
documentale è diventata un comportamento osservato.** È esattamente ciò a cui serve un test, ed è il
risultato più solido della giornata.

La mappatura fra i due cantieri è pulita, con una scoperta in più:

| Trovato dal test | Copertura nell'enforcement |
|---|---|
| **Buco 2** — `S-3` descritta in un file di contesto, nessuna riga in `FOLLOW_UP` | **proposta 1**, già autorizzata: una decisione deve raggiungere un registro |
| **Buco 1** — la regola di STOP non è nello strato che gli agenti leggono | ⚠️ **non coperto da nessuna delle quattro proposte** |

Il buco 1 è un fratello nuovo del difetto: non è una **decisione** che non arriva a un registro, è una
**regola di metodo** che non arriva allo strato di istradamento. Le cinque righe `FU-METODO-*` scritte
ieri sono nel registro giusto e restano comunque irraggiungibili per un agente che apre il progetto e
segue l'istradamento. Il prossimo mandato ha quindi **una proposta in più**, non solo il resto della
lista.

### 8.7 La cosa scomoda: apparato e consegna

Il bisogno dichiarato il 26-08 era operativo e modesto: **non ricostruire lo stato a mano** a ogni
apertura di chat. Tre sedute dopo esistono protocolli, un pacchetto di valutazione, un freeze, un
revisore cieco, un registro di esiti, un dossier — e Matteo ricostruisce ancora lo stato a mano.

Il lavoro non è sprecato e la qualità è alta: la Fase 0 ha impedito che partisse una calibrazione con
tre casi su cinque sbagliati, e l'esecuzione ha rifiutato di rattoppare un freeze difettoso. Questa
disciplina è **il motivo per cui i risultati sono credibili**. Il problema non è la disciplina: è il
**rapporto fra apparato costruito e beneficio consegnato**, che finora ha una sola direzione.

Domanda a cui il senior dei criteri deve rispondere **prima** di proporre qualunque criterio:
**che cosa riceve Matteo, e quando.** Se la risposta è «dopo altre due calibrazioni», il criterio è
sbagliato a prescindere da quanto è elegante.

### 8.8 Spunti tecnici per chi disegnerà i criteri

- **Un criterio che non separa mai è un controllo, non una misura.** Su `AR-2` tutte e tre le condizioni
  hanno fatto 6 su 6. Non è inutile — è il controllo che rende leggibile il resto — ma va **dichiarato**
  come controllo, non contato come misura discriminante.
- **`contradicted` è stato usato dal revisore con una definizione diversa da quella congelata**, e la
  sua era più utile: «la conclusione è smentita dalla fonte che la risposta stessa cita» descrive un
  difetto molto più interessante di «diverso da quello congelato». Vale la pena promuoverlo a criterio
  proprio invece di correggere il revisore.
- **Il denominatore dichiarato ha funzionato ed è da tenere.** Senza le 60 caselle `not_observed` con
  motivo, il riassunto avrebbe detto «tutto bene» guardando 54 caselle e ignorando le altre.
- **Ogni casella costa una chat.** Prima di aggiungere criteri, chiedersi quante caselle si possono
  davvero girare: sei criteri su diciannove caselle fanno 114 giudizi e nove chat lanciate a mano.
- **Gli artefatti del test vanno fuori dal repository sotto test** (§8.2), altrimenti ogni miglioria
  del disegno peggiora la contaminazione.

## 9. Derivazione errori

| Errore | Come è emerso | Correzione |
|---|---|---|
| Avevo consigliato di eseguire la calibrazione sulla baseline pre-enforcement, trattando il test come solo diagnostico | Matteo: «non è meglio testare MSS quando è più solido?» | mandato corretto: si esegue post-enforcement; `cc23837` retrocesso a fotografia recuperabile |
| Avevo elencato **tre** canali di contaminazione | il difetto 2 del freeze: `C4` gira dove è scritta la sua risposta | quarto canale registrato in §8.2 |
| In Fase 0 ho lasciato il `PROTOCOLLO…` §4 in forma di canovaccio, e il freeze l'ha trattato come casi congelati | il senior esecutore, contando i testi verbatim esistenti: quattro su nove | registrato in §8.1; la correzione è una calibrazione nuova, non una toppa |
| Ho ipotizzato che il rosso di `test:mss` fosse un difetto MSS preesistente, come riferito | confronto fra due checkout dello stesso commit | causa reale trovata e chiusa in `0e2a487` |

## 10. Cosa resta

1. La regola di STOP **non è ancora scritta** nello strato di istradamento: proposta, non applicata.
2. Gli artefatti `AM-C0` e il report della seduta di esecuzione non sono committati — non sono miei, e
   la loro seduta ha chiuso deliberatamente con «cancelli verdi, niente commit». ⚠️ **Conseguenza da
   non lasciare aperta:** rigenerando `MSS-REPORT-INDEX.md` l'indice nomina **due** report nuovi, il mio
   e il loro. Non l'ho committato, perché un indice che punta a un file non tracciato è un riferimento
   rotto per chiunque cloni. Va fatto **un commit solo** che porti insieme artefatti `AM-C0`, report di
   esecuzione e indice rigenerato.
3. `.claude/CLAUDE.md`, `AGENTS.md`, `.cursor/rules/comandi-base.mdc`, `OSSERVAZIONI.md` e l'indice
   report risultano modificati e non committati da altri: vanno chiusi prima di aprire nuovi cantieri.
4. Slice 1+2 dell'enforcement: autorizzato, mandato scritto, non implementato.

## 10-bis. Handoff al prossimo agente

**Cosa è vero ora.** `AM-C0` ha chiuso con 54 giudizi su 114 dichiarati; il confronto fra condizioni
non è attribuibile e questo è **dichiarato prima** dei verdetti, non dopo. Il prodotto utile sono due
limiti di fonte verificati con comando: la regola di STOP non è nello strato di istradamento, e una
divergenza «censita ma non decisa» non ha un freno. L'enforcement ha diagnosi consegnata, slice 1+2
autorizzato, mandato tecnico scritto, **niente implementato**.

**Cosa NON dedurre.** Che il dossier funzioni: non è misurato. Che gli agenti siano inaffidabili: su
`AR-2` sono stati corretti sei volte su sei. Che le dieci caselle mancanti si possano recuperare
rattoppando il freeze: servono casi nuovi, congelati da chi non ha ancora letto le chiavi.

**Prossimo passo.** Non è eseguire un'altra calibrazione. È la seduta in cui **Matteo sceglie i
criteri** insieme a un senior, decide come si testa dato che lavora su Auto, e produce il mandato
unificato enforcement + fix. Prompt pronto:
[`Prompt-senior-criteri-valutazione-mss-e-agente-matteo-27-08-26.md`](Prompt-senior-criteri-valutazione-mss-e-agente-matteo-27-08-26.md).

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura (es. `git rev-parse HEAD:<path>` o SHA — stesso dato di `source_refs[].revision_or_hash` in capsula). Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1: Nessun file-prompt ricevuto: questa seduta è la continuazione diretta del segmento di Fase 0, e i mandati citati li ho scritti io. Artefatti letti a `e741cb0`: `docs/Sessioni di lavoro/27-08-26/AM-C0/REGISTRO-ESITI.md` e `SINTESI.md`; report enforcement letto nel worktree `codex/senior-doc-enforcement-270826` a `97ebf85`. Messaggi di Matteo non in repo, verbatim: «committa pure e dammi prompt per senior enforcement. comunque intendevo per MSS completo per il test, che agente che eseguirò il test su repo vecchia con nuovo MSS , avrà uno strumento piu solido che evita errori e misuro uno strumento che porta con se meno errori. intendevo questo sei d accordo oltre che alle tue deduzioni?»; e il messaggio finale con l'esito `AM-C0` e le quattro osservazioni numerate («1. quando uso cursor uso sempre auto… 2. non so quanto queste 3 domande siano utili… 3. vorrei che mi prepari un prompt per proseguire con agente senior… 4. enforcement cosa faccio?»).

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).
✅ R2: Sì. I numeri di §4 vengono da comandi rieseguiti in questa seduta, non da fonti riferite: `test:mss` verde nel repo principale e rosso nei due worktree sullo stesso commit `97ebf85`; `sha256sum` e conteggio dei ritorni-carrello sulle due copie di `FX-V01-bundle.jsonl` (7602 vs 7606 byte, 0 vs 4); verde dopo la riga `*.jsonl text eol=lf` con ri-checkout. I numeri di `AM-C0` (114 dichiarati, 54 emessi, 38/14/2) sono **letti** da `REGISTRO-ESITI.md`, non ricalcolati da me, ed è dichiarato così in §8.1. Il «buco 1» l'ho riverificato per conto mio con `grep` sullo strato di istradamento invece di riportarlo dalla sintesi. `validate:docs` verde; triade MSS in §4.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).
✅ R3: Completa, e con un «no» motivato che è il punto della tabella in questa seduta: i tre file di istradamento **non** li ho toccati, pur essendo il posto dove manca la regola di STOP. Non è una dimenticanza: cambiare quello strato cambia il comportamento di ogni agente in ogni chat, e la decisione è di Matteo. Verificato con `git status` che risultano modificati **da altri** e non committati — ragione in più per non sovrascriverli.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho letto le nove risposte degli esecutori una per una: ho letto registro, sintesi e verdetti, e ho riverificato con comando solo il «buco 1». Se il senior dei criteri vorrà ricavare criteri dalla **forma** delle risposte — e dovrebbe — quelle nove vanno lette per intero, e non l'ho fatto io. Non ho scritto la regola di STOP nello strato di istradamento (`R3`). Non ho committato gli artefatti `AM-C0` né i quattro file modificati da altri. Non ho proposto come togliere gli artefatti del test dal repository sotto test: l'ho diagnosticato in §8.2 e lasciato al disegno della prossima calibrazione.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: Due attriti reali. **Primo:** il difetto CRLF era invisibile a chiunque lavorasse nel repository storico e certo per chiunque ne aprisse uno nuovo — il sistema non ha modo di accorgersi che il proprio verde è un verde locale; proposta: la CI deve girare `test:mss` su un checkout **fresco**, altrimenti certifica solo la cartella di chi l'ha scritta. **Secondo:** il cold-check pre-commit è scattato quattro volte, sempre correttamente, ma non distingue un commit incrementale in una seduta il cui report è già committato da un commit di fine lavoro senza report; proposta: farlo tacere quando i commit della stessa giornata contengono già un report della seduta, oppure lasciar dichiarare «incrementale» una volta e valere per lo stage successivo.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto, con una lacuna che è il tema stesso della seduta: l'istradamento mi ha portato agli owner corretti, ma **non contiene la regola di fermarsi davanti a fonti che si contraddicono** — l'ho applicata perché me l'ero scritta io ieri, non perché il sistema me la desse, che è esattamente il «buco 1» misurato sugli altri agenti. Gli hook sono stati utili e non rumore: il cold-check ha intercettato commit legittimi ma mi ha fatto rileggere lo stage ogni volta, e in una seduta precedente lo stesso controllo aveva trovato una tabella incompleta.

## 12. Self-review del report

1. **Triade MSS:** `test:mss` verde (42 fixture + 57 gruppi), `validate:docs` verde, `validate:mss`
   sul report eseguito in chiusura.
2. **§5 allineata**, con il «no» motivato invece di un rimando.
3. **§11 coerente:** `R4` dichiara una lacuna reale (le nove risposte non lette per intero) invece di
   chiudere con «tutto ok»; `R6` dichiara che ho applicato una regola che il sistema non mi dava, che
   è il finding della seduta applicato a me stesso.

Corretto durante la self-review: §5 diceva inizialmente «nessuno», ma la voce giusta non è «nessuno»
— è «no, e questo è il punto»: quei tre file sono il posto dove manca la regola.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0451c-10e1-7790-84a3-934453373bee","correlation_id":"mss-cor-01a0451c-10e1-756b-99d1-f71b252af377","segment_no":1,"created_at":"2026-08-27T23:24:22+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Meta senior orchestratore lettura AM-C0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a0451c-10e1-7d14-8adb-0938b36be73e","capture_key":"mss-ses-01a0451c-10e1-7790-84a3-934453373bee/1/session_event/1","event":{"event_id":"mss-evt-01a0451c-10e1-7a55-9411-4b94aba95499","event_kind":"session_close","occurred_at":"2026-08-27T23:24:22+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"Meta senior orchestratore lettura AM-C0","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD e741cb0; 26 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/27-08-26/Report-senior-lettura-am-c0-e-apertura-cantiere-criteri-27-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/27-08-26/Report-senior-lettura-am-c0-e-apertura-cantiere-criteri-27-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":"nessuno","subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":".claude/CLAUDE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"e741cb0","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":".cursor/rules/comandi-base.mdc","stable_anchor_or_event_id":"working tree","revision_or_hash":"e741cb0","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"AGENTS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"e741cb0","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/Comunicazione-Skill/OSSERVAZIONI.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"e741cb0","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"e741cb0","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0451c-10e1-7790-84a3-934453373bee","correlation_id":"mss-cor-01a0451c-10e1-756b-99d1-f71b252af377","segment_no":1,"created_at":"2026-08-27T23:24:22+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Meta senior orchestratore lettura AM-C0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a0451c-10e1-781b-923d-bb68fed1f188","capture_key":"mss-ses-01a0451c-10e1-7790-84a3-934453373bee/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a0451c-10e1-7132-aa09-b23ffef8506d","axis":"persona","subject_record_ids":["mss-rec-01a0451c-10e1-7d14-8adb-0938b36be73e"],"delta":"creato","assertions":[{"signal":"Matteo ha dichiarato la propria condizione di lavoro reale — in Cursor usa sempre «Auto» — e ha contestato il disegno di prova che trattava quella variabilita come un difetto da eliminare.","actor":"matteo","assistance":"spontaneo","origin":"naturale","source_ref":"docs/Sessioni di lavoro/27-08-26/Report-senior-lettura-am-c0-e-apertura-cantiere-criteri-27-08-26.md","effect":"Il disegno della prossima prova cambia: si separano frequenza (misurabile su Auto, che e la sua condizione reale) e attribuzione (che richiede il modello fissato), invece di trattare Auto come rumore. Registrato nel report §8.4 e portato come Nodo 1 nel mandato della seduta criteri.","evidence_state":"observed"}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"Meta senior orchestratore lettura AM-C0","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0451c-10e1-7790-84a3-934453373bee","correlation_id":"mss-cor-01a0451c-10e1-756b-99d1-f71b252af377","segment_no":1,"created_at":"2026-08-27T23:24:22+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Meta senior orchestratore lettura AM-C0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a0451c-10e1-7b2c-bc80-f874c2d424c8","capture_key":"mss-ses-01a0451c-10e1-7790-84a3-934453373bee/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a0451c-10e1-7cf1-a029-96a5c34bc327","axis":"sistema","subject_record_ids":["mss-rec-01a0451c-10e1-7d14-8adb-0938b36be73e"],"delta":"verificato","assertions":[{"rule_id_version":"AM-C0@0.1.1","trigger_event":"Esecuzione di AM-C0 chiusa: 54 giudizi emessi sui 114 dichiarati; comparabilita §8.3/§8.4 non retta (modello non conoscibile in 5 caselle su 9, strumenti diversi fra sessioni); due difetti del freeze trovati eseguendolo — quattro casi su cinque senza testo congelato, e C4 eseguito nel repository dove e leggibile il proprio esito atteso.","decision_or_output_changed":"Il confronto fra condizioni resta registrato come non attribuibile e le dieci caselle restano not_observed con motivo, invece di essere recuperate rattoppando il freeze. Registrato un quarto canale di contaminazione mai dichiarato prima: gli artefatti del test vivono nel repository sotto test. Il prodotto utile e riconosciuto nei due limiti di fonte, non nel confronto.","G":2,"O":3,"E":0},{"rule_id_version":"Prompt-senior-orchestratore-test-agente-matteo@a2fe312","trigger_event":"La seduta di calibrazione avrebbe chiuso lasciando le proprie regole di metodo solo nel report di seduta; il mandato le ha imposto una riga in docs/FOLLOW_UP.md prima della chiusura, con stato da_confermare se ambigua.","decision_or_output_changed":"Cinque righe FU-METODO-* esistono ora nell'owner e sono citabili come fonte ammessa: priorita dei lavori, fonte piu recente, riuso di una decisione, forma della citazione, registrazione del superamento. Senza l'obbligo sarebbero rimaste dentro un report. Verificato con grep FU-METODO docs/FOLLOW_UP.md.","G":1,"O":1,"E":1}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"Meta senior orchestratore lettura AM-C0","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a0451c-10e1-7790-84a3-934453373bee","correlation_id":"mss-cor-01a0451c-10e1-756b-99d1-f71b252af377","segment_no":1,"created_at":"2026-08-27T23:24:22+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Meta senior orchestratore lettura AM-C0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a0451c-10e1-727c-a737-9750a50b3dda","capture_key":"mss-ses-01a0451c-10e1-7790-84a3-934453373bee/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a0451c-10e1-77ca-9abf-4b55a2d338f5","axis":"output","subject_record_ids":["mss-rec-01a0451c-10e1-7d14-8adb-0938b36be73e"],"delta":"creato","assertions":[{"output_id":"report-senior-lettura-am-c0-e-apertura-cantiere-criteri-27-08-26","primary_type":"governance","canonical_version":"docs/Sessioni di lavoro/27-08-26/Report-senior-lettura-am-c0-e-apertura-cantiere-criteri-27-08-26.md","recipient":"Matteo, senior dei criteri, senior Codex enforcement+fix","problem_or_job":"Leggere criticamente l'esito di AM-C0 al di la del riassunto ricevuto in chat, rispondere alle quattro osservazioni di Matteo, e aprire la seduta in cui sara lui a scegliere i criteri di valutazione.","intended_use":"Fonte di ingresso §8 del mandato Prompt-senior-criteri-valutazione-mss-e-agente-matteo-27-08-26.md.","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"Messaggi di Matteo 27-08-2026: quattro osservazioni numerate sull'esito AM-C0 e richiesta esplicita di opinione sulla seduta.","authored_by":"Senior Claude","verified_by":"non_osservato","acceptance_criterion":"Ogni affermazione riportata da altri agenti riverificata con comando prima di essere usata; i numeri di AM-C0 dichiarati come letti e non ricalcolati; le lacune proprie dichiarate invece che omesse; cancelli MSS e documentali verdi; sezione 11 compilata.","verification_or_use_evidence":"test:mss verde nel repo principale e rosso nei due worktree sullo stesso commit 97ebf85; sha256sum e conteggio dei ritorni-carrello su FX-V01-bundle.jsonl (7602 vs 7606 byte, 0 vs 4); verde dopo *.jsonl text eol=lf con ri-checkout; validate:docs 194 file 0 path rotti; grep indipendente sullo strato di istradamento che conferma il buco 1; grep FU-METODO che conferma le cinque righe.","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md","privacy_release":"internal","support_files":["docs/Sessioni di lavoro/27-08-26/AM-C0/REGISTRO-ESITI.md","docs/Sessioni di lavoro/27-08-26/AM-C0/SINTESI.md","docs/Sessioni di lavoro/27-08-26/Prompt-senior-criteri-valutazione-mss-e-agente-matteo-27-08-26.md","docs/Sessioni di lavoro/27-08-26/Prompt-senior-enforcement-slice-1-2-mandato-tecnico-27-08-26.md"],"relations_no_double_count":["Non esegue e non ripete la calibrazione: nessun caso nuovo congelato, nessun esecutore lanciato, nessun verdetto emesso o corretto.","Non corregge il freeze AM-C0 ne recupera le dieci caselle not_observed: dichiara che servono casi nuovi.","Non scrive la regola di STOP nello strato di istradamento: la propone, la decisione e di Matteo.","Non implementa lo slice 1+2 dell'enforcement, gia autorizzato e con mandato tecnico separato.","Non apre SEP-G2, non avvia SEP-6, non autorizza il cutover WP-1."],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}},{"output_id":"fix-gitattributes-jsonl-eol-lf-27-08-26","primary_type":"processo","canonical_version":".gitattributes","recipient":"chiunque apra un checkout nuovo del repository: senior enforcement, seduta di calibrazione, CI Windows","problem_or_job":"test:mss e validate:mss:all risultavano rossi su ogni checkout nuovo (worktree fresco, clone, CI Windows) e verdi nel repository storico, sullo stesso commit, per 12 hash di fixture congelate.","intended_use":"Rendere riproducibile la suite MSS fuori dalla cartella di chi l'ha scritta; sblocca la corsia A della calibrazione, che apre worktree sul passato.","conceived_by":"Senior Claude","decided_by":"Matteo","directed_by":"Messaggio di Matteo 27-08-2026: «committa pure».","authored_by":"Senior Claude","verified_by":"non_osservato","acceptance_criterion":"Il rosso deve essere riprodotto in un worktree pulito creato da zero e tornare verde con la sola riga aggiunta, senza toccare nessuna fixture e senza cambiare nessun hash congelato.","verification_or_use_evidence":"Worktree pulito su 97ebf85: 12 hash frozen mutato. Dopo *.jsonl text eol=lf e ri-checkout dei soli .jsonl: 42 fixture + 57 gruppi verdi. Causa isolata con sha256sum e conteggio dei ritorni-carrello: 7602 vs 7606 byte, 0 vs 4. Commit 0e2a487.","verification_status":"self_report","owner_ref":".gitattributes","privacy_release":"internal","support_files":["docs/MetaSkillSystem/fixtures/v0.1/FX-V01-bundle.jsonl"],"relations_no_double_count":["Non modifica ne le fixture ne i loro hash congelati: corregge il checkout, non il dato.","Non chiude la lacuna piu ampia dichiarata in R5: la CI dovrebbe girare test:mss su un checkout fresco, altrimenti certifica solo la cartella di chi l'ha scritta."],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"Meta senior orchestratore lettura AM-C0","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
