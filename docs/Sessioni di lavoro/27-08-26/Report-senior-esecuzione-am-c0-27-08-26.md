# Report senior — esecuzione `AM-C0`: preparazione verificata, nove caselle pronte, dieci bloccate · 27-08-2026

## 1. Cappello

**Cosa è cambiato:** le sei cartelle congelate della calibrazione esistono, sono state verificate con
comandi (non a memoria) e i nove blocchi da incollare agli esecutori sono pronti in
[`AM-C0/BLOCCHI-ESECUTORI.md`](AM-C0/BLOCCHI-ESECUTORI.md); eseguendo il freeze ho però trovato che
dieci delle diciannove caselle **non sono lanciabili**, per due difetti del freeze che non ho
corretto.

**Cosa resta:** le nove esecuzioni d'archivio (servono runtime che non posso pilotare), la review
cieca, la sintesi. Le dieci caselle della corsia A-oggi restano `not_observed` finché Matteo non
decide.

**Serve una tua azione:** sì — due decisioni (§10 «Domande per te») e l'apertura delle nove sessioni.

## 2. Cosa è stato fatto

1. **Registrato lo stato di partenza.** `HEAD` = `e741cb0` su `env/test`, tre file di istradamento
   modificati e non committati — esattamente la fotografia che il freeze descrive.

2. **Verificato che nessuno abbia toccato lo skill system dopo il freeze.** L'aggregato `sha256` dei
   31 file dello strato è `2f76a704…f622`, **identico** a quello congelato; identici anche i tre
   digest singoli di `.claude/CLAUDE.md`, `AGENTS.md` e `.cursor/rules/comandi-base.mdc`. I risultati
   della calibrazione varranno su questa versione.

3. **Create le sei cartelle congelate** — due date (17-06 e 05-08) × tre condizioni (storica, oggi,
   oggi + dossier), come sei copie indipendenti del repository di allora.

4. **Sovrapposto lo strato di istradamento** solo sulle quattro cartelle «oggi» e «dossier», con
   `docs/ADMIN_CLASSIC_SKILL.md` escluso dalle due `1706-*`: quel file racconta il modello dei limiti
   coperti deciso il 18-06, cioè la risposta del primo caso.

5. **Potato il dossier per data.** Delle dieci schede di decisione ne sopravvive **una sola** in
   entrambe le copie — `D-SFONDO-PRENOTA`, del 31-05. Tutte le altre sono del 26-08, del 27-08 o del
   06-08, quindi successive a entrambe le date di congelamento. Fra quelle rimosse ci sono
   `D-MANOPOLE` e `D-TURNO-SALA`, che **sono** le risposte del secondo e del terzo caso.

6. **Rieseguito il controllo di fuga sulle sei cartelle come costruite**, non sui worktree di verifica
   del freeze: i marcatori delle tre decisioni successive danno **zero file** in tutte e sei, mentre
   lo stato di fatto che i casi devono far scoprire è presente e leggibile.

7. **Generati i nove blocchi** per gli esecutori. Sono prodotti da uno script, non scritti a mano:
   il mandato è identico byte per byte in tutti e nove e cambia solo il testo del caso e la riga del
   dossier. Un controllo confronta i testi dei casi con la fonte congelata e conferma che sono
   verbatim.

8. **Preparato il pacchetto per il revisore cieco** — mandato, chiave dei tre casi nella forma
   prescritta, e l'elenco esplicito di ciò che non entra (il verdetto atteso per condizione, le
   etichette, la corrispondenza).

9. **Fermato quello che non si poteva correre**, registrandone il motivo invece di aggirarlo: vedi §9.

## 3. File toccati e perché

| File | Perché |
|---|---|
| [`AM-C0/BLOCCHI-ESECUTORI.md`](AM-C0/BLOCCHI-ESECUTORI.md) | i nove blocchi già composti, uno per casella |
| [`AM-C0/CORRISPONDENZA.md`](AM-C0/CORRISPONDENZA.md) | mappa `Rnn → caso × condizione` e lettera; ⛔ non va al revisore |
| [`AM-C0/PACCHETTO-REVISORE.md`](AM-C0/PACCHETTO-REVISORE.md) | mandato + chiave di caso, senza il verdetto atteso per condizione |
| [`AM-C0/REGISTRO-ESITI.md`](AM-C0/REGISTRO-ESITI.md) | denominatore 114 e le dieci caselle bloccate con motivo |
| [`AM-C0/risposte/LEGGIMI.md`](AM-C0/risposte/LEGGIMI.md) | dove e come si salvano le risposte grezze |
| questo report | seduta |

⛔ **Nessun file dell'app, dello skill system o del pacchetto congelato è stato toccato.** Nessun
`_SKILL.md`, nessun file di `contesto/`, nessuna regola Cursor, nessun `src/`, `supabase/`, script,
hook, validator o fixture. Nessun accesso al database. Le sei cartelle vivono fuori dal repository, in
`C:/tmp/amc0/`.

## 4. Test eseguiti e risultato

### 4.1 Verifiche della Fase 1 — tutte con comando, nessuna a memoria

| Verifica | Atteso | Esito |
|---|---|---|
| aggregato `sha256` dei 31 file dello strato | `2f76a704…f622` (freeze §0) | ✅ **identico** |
| `sha256` di `.claude/CLAUDE.md` | `8a39c731…3271` | ✅ identico |
| `sha256` di `AGENTS.md` | `8041be42…f80c` | ✅ identico |
| `sha256` di `.cursor/rules/comandi-base.mdc` | `60583e69…2982` | ✅ identico |
| `git status --short` in `1706-storica` | vuoto | ✅ vuoto |
| `git status --short` in `0508-storica` | vuoto | ✅ vuoto |
| `git status --short` in `1706-oggi` / `1706-dossier` | solo file dello strato | ✅ 15 file dello strato + `docs/MetaSkillSystem/` (+ `DOSSIER.md`) |
| `git status --short` in `0508-oggi` / `0508-dossier` | solo file dello strato | ✅ 10 file dello strato + `docs/MetaSkillSystem/` (+ `DOSSIER.md`) |
| `git status --short \| grep ADMIN_CLASSIC` in `1706-oggi` | nessun risultato | ✅ nessun risultato |
| `git status --short \| grep ADMIN_CLASSIC` in `1706-dossier` | nessun risultato | ✅ nessun risultato |
| schede §3 in `1706-dossier/DOSSIER.md` | solo data ≤ 17-06-2026 | ✅ una sola: `D-SFONDO-PRENOTA` (31-05-26) |
| schede §3 in `0508-dossier/DOSSIER.md` | solo data ≤ 05-08-2026 | ✅ una sola: `D-SFONDO-PRENOTA` (31-05-26) |

⚠️ **Il `?? docs/MetaSkillSystem/` andava guardato dentro, non spuntato.** Quella cartella non esiste
nei commit congelati, quindi `git status` la collassa in una riga sola: se dentro fosse finito altro
oltre al file dello strato, l'esecutore avrebbe avuto in mano il freeze stesso — cioè tutte e tre le
risposte più il disegno della prova. Controllato con `find`: contiene **un solo file**,
`METASKILL_SYSTEM_SKILL.md`, in tutte e quattro le cartelle. Cercati anche per nome `FREEZE_AM_C0*`,
`DOSSIER_OPERATIVO*`, `PROTOCOLLO_CALIBRAZIONE*` e `MASTERPLAN_V0*`: **zero** in ognuna delle sei.

### 4.2 Controllo di fuga rieseguito sulle sei cartelle come costruite

| Caso | Marcatori della decisione successiva | Atteso | Esito nelle tre cartelle |
|---|---|---|---|
| `AR-1` | `booking_reject_out_of_slot`, `OUT_OF_SLOT` | 0 file | ✅ 0, 0 |
| `AR-2` | `Valori attuali confermati`, `renderli modificabili`, `MANOPOLE-CONSOLE` | 0 file | ✅ 0, 0, 0 |
| `AR-3` | `FU-SERV-TURNO-SALA-1`, `vince il tavolo`, `TURNO-SALA` | 0 file | ✅ 0, 0, 0 |

E, come contro-prova, lo stato di fatto che i casi devono far **trovare** è presente: `daily_guest_limit`
in 43 file e `slot_limit_enabled` in 5 nelle cartelle `1706-*`; `DEFAULT_LATE_THRESHOLD_MINUTES` in 16,
`turnover_buffer_minutes` in 29 e `table_late_threshold_minutes` in 7 nelle `0508-*`. Le stesse
verifiche sulle due copie potate del dossier: **zero** occorrenze dei marcatori, in §3 e nell'intero
file.

### 4.3 Verbatim dei testi dei casi

Confronto per contenuto fra i blocchi generati e la Parte 4 del prompt esecutori: ogni testo di caso
compare **3 volte** nei blocchi (una per condizione) e nessuno è stato riformulato. Il generatore
verifica inoltre che il mandato spogliato del caso sia **un solo** scheletro distinto fra i nove.

### 4.4 Citazioni della chiave verificate una per una

Prima di consegnarle al revisore ho ricontrollato ogni riferimento nella copia congelata al 05-08:

| Citazione | Esito |
|---|---|
| `useTableStatuses.ts`:35 → `DEFAULT_LATE_THRESHOLD_MINUTES = 15` | ✅ esatta |
| `service_slots.turnover_buffer_minutes` `DEFAULT 0`, migrazione `057` | ✅ `057_service_slots_duration_buffer.sql`:7 |
| `WalkInModal.tsx`:51 → ripiego `?? 90` | ✅ valore esatto, ⚠️ **percorso corretto**: sta in `components/home/`, non in `components/` |
| `ADMIN_SERVIZIO_CONTEXT.md`:157 → «soglia ritardo configurabile» | ✅ esatta |
| `ADMIN_SERVIZIO_CONTEXT.md` voce `S-3` | ✅ riga 631, «non sanata» alla 638 |
| `useDeleteRoom` timbra `checked_out_at` | ✅ `useRooms.ts`:205 |

Il percorso di `WalkInModal.tsx` l'avevo scritto per deduzione, non per verifica: il freeze dà solo il
nome del file. È lo stesso errore che la chiave dichiara «sicuramente sbagliato» per gli esecutori, e
sarebbe stato consegnato al revisore come metro di verità. Corretto prima della consegna.

### 4.5 Cancelli MSS e documentali

Eseguiti **dopo** l'ultima modifica e nell'ordine giusto — viste prima, cancelli poi. Esiti in §6-bis
e nella capsula appesa in coda.

## 5. File di skill aggiornati

**Nessuno — ed è un vincolo del mandato, non una dimenticanza.** I file di skill, i file di
`contesto/` e le regole Cursor sono **il materiale sotto misura** di questa calibrazione: modificarne
uno invaliderebbe i digest del freeze §0 e renderebbe irriproducibile il controllo di fuga. Il mandato
lo vieta esplicitamente «anche per correzioni che sembrano ovvie».

Osservazione annotata e **non** applicata: la §5 del dossier cita `D-WALKIN-HOME` come esempio, e
`D-WALKIN-HOME` è una scheda del 26-08 che la potatura rimuove dalla §3. Nelle due copie potate resta
quindi il riferimento a una scheda che non c'è più. Non tocca nessuno dei tre casi d'archivio, e la §5
è fuori dal perimetro di potatura per regola del freeze: lo lascio com'è e lo registro qui.

## 6. Dati comunicazione

- **Richieste ricorrenti di Matteo in questa chat:** una sola, il mandato iniziale («leggi e esegui»)
  — nessuna correzione, nessuna riformulazione, nessuna domanda di chiarimento.
- **Formato che ha funzionato:** il mandato mette in testa «le tre cose che, se sbagli, invalidano
  tutto» invece di seppellirle in una checklist. Due delle tre erano davvero i punti dove ho dovuto
  rallentare (potatura, cartella `MetaSkillSystem` collassata).
- **Prompt annotato, verbatim dal mandato:** «⚠️ Questo passo è manuale e dipende dal fatto che tu te
  lo ricordi — è esattamente la classe di passo che il report di enforcement del 27-08 ha dichiarato
  inaffidabile. **Verificalo con un comando, non con la memoria.**» È l'istruzione che ha cambiato il
  modo di lavorare: ogni riga della §4.1 è un comando, non una spunta.
- **Automatizzabile con certezza:** la costruzione delle sei cartelle, la potatura per data, il
  controllo di fuga, il confronto dei digest e la generazione dei blocchi — tutti già eseguiti come
  comandi ripetibili in questa seduta.
- **Da lasciare manuale:** l'apertura delle sessioni negli altri runtime e le due decisioni di §10.

## 6-bis. Registrazione di seduta (MSS)

Judgments su file dedicato:
[`judgments-senior-esecuzione-am-c0-27-08-26.json`](judgments-senior-esecuzione-am-c0-27-08-26.json).
La sezione ufficiale con il bundle JSONL è appesa in coda a questo report da `npm run mss:capsule`.

## 7. Analisi flusso prompt, efficienza e statistiche

- **Prompt sostanziali di Matteo:** 1. **Correzioni dopo la prima risposta:** 0. **Follow-up
  generati:** 0 nuove voci `FU` (nessuna decisione presa da lui in seduta). **Modalità alzata:** no.
- **Cosa ha reso il prompt efficace:** dice cosa consegnare, cosa invalida tutto, e — soprattutto —
  cosa **non** chiedere a Matteo. La §7 è un elenco chiuso: senza, avrei probabilmente restituito una
  lista di compiti, che è l'errore che il report precedente ha registrato come già commesso.
- **Cosa ha reso il lavoro più lento del necessario:** il mandato dice «19 esecuzioni» come se fossero
  tutte lanciabili. Dieci non lo sono, e per accorgersene bisogna inseguire un rimando (freeze §4 →
  protocollo §4) e scoprire che in fondo non c'è nessun testo. Un rimando che porta a un file diverso
  da quello che promette è più costoso di un dato mancante dichiarato.
- **Da replicare:** l'ordine «leggi il freeze intero prima di qualsiasi comando». Le due lacune sono
  emerse dalla lettura, non dall'esecuzione.

## 8. La mia lettura della sessione

**Cosa ha funzionato.** Il disegno di questa calibrazione è costruito perché un esecutore distratto
lasci tracce invece di risultati sbagliati in silenzio: le sei cartelle sono copie git indipendenti, e
`git status` dentro ognuna **è** la verifica di cosa è stato sovrapposto. Non è documentazione che
descrive un controllo, è un controllo che si esegue da solo. La stessa idea applicata al dossier
(«poti, poi conti le schede rimaste») ha funzionato al primo colpo.

**Difficoltà, e come le ho risolte.**
1. *La cartella collassata.* `git status` mostrava `?? docs/MetaSkillSystem/` — una riga sola per un
   intero albero. Spuntarla come «file dello strato» sarebbe stato ragionevole e sbagliato: dentro
   quel percorso, nel repository di oggi, c'è il freeze con tutte e tre le risposte. Risolta guardando
   dentro con `find` e cercando per nome i quattro file del pacchetto in tutte e sei le cartelle.
2. *Il percorso dedotto.* Scrivendo la chiave del revisore ho completato `WalkInModal.tsx` con la
   cartella che mi sembrava ovvia. Era sbagliata. Risolta verificando ogni citazione nella copia
   congelata prima della consegna — §4.4.
3. *La tentazione di rattoppare.* Per `C1`, `C2`, `C3` e `C5` mancano i testi dei casi, e scriverli
   avrebbe richiesto dieci minuti e sbloccato otto caselle. Non l'ho fatto: li avrei scritti **dopo**
   aver letto le chiavi, e nessun confronto costruito così sarebbe stato confrontabile con qualcosa
   dichiarato prima.

**Migliorie che suggerirei — come dato, non come modifica.**
- *Il rimando che non porta a niente.* «Congelato per rimando al `PROTOCOLLO…` §4» sembra un congelamento
  e non lo è: la §4 rimandata contiene un canovaccio d'intervista, dichiarato tale. Un cancello che
  verificasse che ogni caso dichiarato congelato **ha un testo verbatim** avrebbe fermato il freeze
  prima delle esecuzioni, non durante.
- *La prova che gira dove è custodita la propria risposta.* La corsia d'archivio è protetta dal tempo:
  il freeze è del 27-08 e nei worktree del 17-06 e del 05-08 non esiste. La corsia A-oggi non ha
  quella protezione e il freeze non la sostituisce con nient'altro. Vale come regola generale: **una
  prova non può correre nella stessa cartella in cui è scritto il suo esito atteso.**
- *Chi verifica le citazioni, con che cosa.* Il mandato del revisore gli impone di verificare ogni
  fonte, e il freeze non dice con quale materiale. Senza, ogni citazione diventa `unknown` e la review
  non dice niente. Ho proposto il minimo indispensabile in
  [`PACCHETTO-REVISORE.md`](AM-C0/PACCHETTO-REVISORE.md) §3, dichiarandolo come scelta mia.
- *La mappa che il freeze pubblica.* Il freeze §2 scrive che `A` = Storica, `B` = Oggi, `C` = Oggi +
  dossier. Il revisore non deve saperlo, e il freeze vive nel repository: la cecità regge **solo** se
  il revisore non ha accesso al repository. È una condizione operativa che nessun documento dichiara.

## 9. Derivazione errori

| # | Cosa è successo | Causa | Come si sarebbe evitato |
|---|---|---|---|
| 1 | `C1`, `C2`, `C3`, `C5` dichiarati congelati non hanno un testo di caso: 8 caselle non lanciabili | **vincolo strutturale** — il freeze congela per rimando a un documento che, alla sezione indicata, contiene un canovaccio d'intervista e non dei casi | un cancello che verifichi «ogni caso congelato ha un testo verbatim» prima di dichiarare il freeze completo |
| 2 | `C4` girerebbe nel repository dove il suo esito atteso è leggibile: 2 caselle non lanciabili in cecità | **bug preesistente nel disegno** — il confondente è dichiarato per la corsia d'archivio, dove è risolto dal tempo, e non per la corsia A-oggi, dove il §4 registra «materiale escluso: nessuno» | dichiarare il materiale escluso della corsia A-oggi come si è fatto per quella d'archivio |
| 3 | Percorso di `WalkInModal.tsx` completato per deduzione e sbagliato, dentro la chiave del revisore | **errore agente** — ho trattato un nome di file come se fosse un percorso | la regola che ho poi applicato: nessuna citazione entra nella chiave senza essere aperta nella copia congelata |
| 4 | `?? docs/MetaSkillSystem/` stava per essere spuntato come «file dello strato» | **errore agente evitato** — `git status` collassa gli alberi non tracciati e la riga sembra un file | non spuntare mai una riga di `git status` che finisce con `/` senza guardarci dentro |

⚠️ Il #1 e il #2 **non sono errori di questa seduta**: sono difetti del freeze, trovati eseguendolo.
Registrarli è il prodotto utile della giornata, non un suo fallimento.

Nessun pattern nuovo da appendere a `ERRORI_PROCESSO.md`: il #3 e il #4 sono due istanze dello stesso
pattern già registrato («ciò che accade solo se qualcuno se lo ricorda non è una regola»), e la ripresa
è stata verificarli con comando.

### 9-bis. Cosa NON è stato fatto — per nome

Vietato «tutto ok» a vuoto: ecco l'elenco chiuso, con il motivo di ciascuna voce.

| Non fatto | Perché |
|---|---|
| **Le 19 esecuzioni: zero corse** | Il freeze impone una sessione nuova per casella e io sono una sessione sola. Ho inoltre letto il freeze intero: conosco tutte e tre le risposte, quindi sono squalificato come esecutore per costruzione |
| **Nessun sub-agente usato al posto degli esecutori** | Erediterebbero cartella e memoria di questo repository, dove è scritta la risposta di `AR-1`: ogni casella si registrerebbe `non_noto` e non entrerebbe nel confronto. Sarebbe stato un numero, non un dato |
| **La review cieca: non avviata** | Non esistono risposte da giudicare, e il revisore è una chat Codex separata che non posso pilotare |
| **La sintesi: non scritta** | Va dopo i verdetti del revisore. Prima delle risposte, qualsiasi differenza fra condizioni sarebbe inventata |
| **Le 10 caselle della corsia A-oggi: non lanciate** | Due difetti del freeze — §9 righe 1 e 2. Registrate `not_observed` con motivo, dentro il denominatore |
| **I testi mancanti di `C1`, `C2`, `C3`, `C5`: non scritti** | Li avrei scritti dopo aver letto le chiavi: non sarebbero casi congelati, e nessun confronto costruito così sarebbe dichiarabile prima della prova |
| **Il freeze: non corretto** | Un freeze corretto dopo aver visto cosa c'è dentro non è più un freeze. I due difetti sono registrati e portati a Matteo |
| **Nessuna riga in `docs/FOLLOW_UP.md`** | Matteo non ha preso nessuna decisione in questa seduta: non gli è stata ancora posta nessuna domanda. Se risponde a §10, la riga si scrive in quella seduta |
| **Il materiale di verifica del revisore: non assemblato** | Le cartelle `W1`/`W2`/`ISTRADAMENTO` di [`PACCHETTO-REVISORE.md`](AM-C0/PACCHETTO-REVISORE.md) §3 si costruiscono quando le risposte esistono; prima sarebbero un pacchetto vuoto che invecchia |
| **Nessun commit, nessun push** | Il lavoro è nel working tree. Il comando «fai report finale» non è stato dato |

⚠️ **Le sei cartelle in `C:/tmp/amc0/` restano in piedi**, di proposito: servono alle esecuzioni. Sono
`git worktree` registrati, quindi a calibrazione chiusa si rimuovono con `git worktree remove`, mai
cancellandole a mano.

## 10. Cosa resta per la prossima sessione

**Nessuna riga nuova in `docs/FOLLOW_UP.md`:** in questa seduta Matteo non ha preso nessuna decisione
di metodo o di prodotto — non gli è stata ancora posta nessuna domanda. Le due che seguono la
richiedono, e se le risponde la riga si scrive prima della chiusura della seduta in cui risponde.

### Domande per te

**1. Le otto caselle senza testo — apro una nuova calibrazione o le lascio `not_observed`?**
Per `C1`, `C2`, `C3` e `C5` non esiste nessuna frase da incollare all'agente: il freeze le dà per
congelate rimandando a un documento che contiene un canovaccio d'intervista, non dei casi.
**Raccomandazione: lasciarle `not_observed` e non aprire niente adesso.** I nove casi d'archivio
rispondono già alla domanda della calibrazione — trova la decisione, o si ferma se non c'è — e aprire
una seconda calibrazione ora significherebbe scrivere quattro casi conoscendone già le risposte, cioè
il difetto che questa prova studia. Se vuoi coprirli, si fa con un'intervista tua **prima** di
rileggere le chiavi, in una seduta dedicata.

**2. `C4` gira dove è scritta la sua risposta — lo escludo o lo lascio fuori?**
`C4` un testo ce l'ha, ma corre «sul repository di oggi», dove l'agente può aprire il freeze e leggere
l'esito atteso del caso che sta rispondendo. **Raccomandazione: lasciarlo `not_observed` con questo
motivo.** L'alternativa — dargli una cartella con il pacchetto rimosso — contraddice il freeze, che per
`C4` registra «materiale escluso: nessuno», e una condizione cambiata dopo il congelamento non è più
confrontabile con niente.

⚠️ Se rispondi «procedi lo stesso» a una delle due, procedo: la conseguenza è che quel confronto si
registra come **calibrazione narrativa** e la differenza non è attribuibile al pacchetto.

## 10-bis. Handoff al prossimo agente

**Cosa è vero adesso.** La preparazione della calibrazione `AM-C0` è finita e verificata. Le sei
cartelle congelate esistono in `C:/tmp/amc0/` (`1706-{storica,oggi,dossier}` su `e130a55`,
`0508-{storica,oggi,dossier}` su `4e84fe7`), sono `git worktree` del repository principale e vanno
rimosse con `git worktree remove` quando la calibrazione chiude — **non** cancellate a mano. Nessuna
esecuzione è avvenuta: zero risposte prodotte, nessun revisore avviato.

**Prossimo task atomico:** lanciare le nove sessioni dei blocchi in
[`AM-C0/BLOCCHI-ESECUTORI.md`](AM-C0/BLOCCHI-ESECUTORI.md). **Gate di chiusura:** nove file in
`AM-C0/risposte/`, nove righe di pre-volo compilate in `AM-C0/CORRISPONDENZA.md`.

**Decisioni chiuse, da non riaprire.** Il freeze non si tocca: né i testi, né gli esiti attesi, né i
criteri, né il denominatore (**114**, anche correndo meno caselle). Nessuna risposta si corregge dopo
averla letta. Nessun caso si sostituisce con uno simile. Chi ha preparato il freeze e la chiave — un
senior Claude il 27-08, me compreso — **non può essere il revisore**.

**Fallimenti e correzioni che cambiano il modo di proseguire.**
- La corrispondenza lettera → condizione è pubblicata nel freeze §2: **il revisore non deve avere
  accesso a questo repository**, o la review si registra `self_report/unverified`.
- La memoria di progetto del repository principale contiene la risposta di `AR-1`: ogni sessione
  esecutore parte con `cwd` nella cartella congelata, mai qui.
- `AR-2` e `AR-3` condividono le cartelle `0508-*`: sei sessioni distinte, non tre.
- Se una casella parte e il pre-volo non è dichiarabile con certezza, si registra `non_noto` e non
  entra nel confronto. Non si rilancia.

**Proprietario di ogni stato.** Disegno della calibrazione →
[`FREEZE_AM_C0_27-08-26.md`](../../MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md). Stato
del pacchetto → [`MASTERPLAN_V0.md`](../../MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md) §4.
Esiti e caselle bloccate → [`AM-C0/REGISTRO-ESITI.md`](AM-C0/REGISTRO-ESITI.md). Decisioni di prodotto
→ [`docs/FOLLOW_UP.md`](../../FOLLOW_UP.md).

**Autorizzazioni e divieti.** Sola lettura sull'app; nessun accesso al database; ⛔ non toccare nessun
`_SKILL.md`, nessun file di `contesto/`, nessuna regola Cursor — sono il materiale sotto misura. ⛔
Nessun esito apre `SEP-G2`, avvia `SEP-6` o autorizza il cutover `WP-1`.

**Maturità, separata.** Preparazione delle cartelle e controllo di fuga: **G** scritta, **O** osservata
(eseguiti in questa seduta), **E** no — nessun cancello automatico li verifica, e il freeze stesso
dichiara questa classe di passo inaffidabile. Comparabilità delle condizioni: **G** soltanto — le sei
condizioni del §8 non sono verificabili finché le esecuzioni non esistono.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura (es. `git rev-parse HEAD:<path>` o SHA — stesso dato di `source_refs[].revision_or_hash` in capsula). Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1: Tutti letti a `HEAD` = `e741cb02189b53c6d32d81a73ad095679142a87f`, branch `env/test`. Mandato: `docs/Sessioni di lavoro/27-08-26/Prompt-senior-esecuzione-calibrazione-am-c0-27-08-26.md` → `785a14007b64e37c64fa71eb3aecc3b1d394c08f`. Freeze: `docs/MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md` → `7fa96de512d31136bddeff7fef8159bcb45cd59d`. Prompt esecutori: `.../Prompt-esecutori-AM-C0-corsia-A-archivio-27-08-26.md` → `476145660e57bdbe1475c687830c4a386819661b`. Prompt revisore: `.../Prompt-revisore-codex-AM-C0-27-08-26.md` → `55f5abee8ed3e477def5a70a26797ccf2ad45351`. Dossier: `docs/MetaSkillSystem/Senior-Eval-Pack/DOSSIER_OPERATIVO_AGENTE_MATTEO_V0.md` → `c2d5126225854e0aa51c0be457ac876aadc61c05`. Protocollo: `.../PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md` → `acc027f41ab141db335ce915891ab2466aa0714b`. Report freeze (§8-bis): `.../Report-senior-freeze-am-c0-27-08-26.md` → `b1ead7a077fc30b8d25a31965997ab1724e11b33`. Chiusura: `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` → `44adf88a8d9806936f6c24d5e24d1d3d07fb9727`. Unico messaggio di Matteo non in un file, verbatim: «leggi e esegui " docs\Sessioni di lavoro\27-08-26\Prompt-senior-esecuzione-calibrazione-am-c0-27-08-26.md"».

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).
✅ R2: Sì. Ogni numero di §4 viene da un comando eseguito in questa seduta, non da una stima: l'aggregato `sha256` è stato ricalcolato con `while read f; do sha256sum "$f"; done < overlay-list.txt | sha256sum` → `2f76a704e3d51c0dc72f1faa03bb454e0c3b3c4276cdc9b83fee0500f496f622`, identico al freeze §0; i conteggi di fuga (0/0, 0/0/0, 0/0/0) e di contro-prova (43, 5, 16, 29, 7) vengono da `grep -r -i -l … | wc -l` per cartella; il «3 volte per caso» del verbatim viene da un confronto per contenuto fra i blocchi generati e la Parte 4 del prompt esecutori, exit 0. Il diff di questa seduta tocca solo i sei file nuovi elencati in §3, tutti sotto `docs/Sessioni di lavoro/27-08-26/`: nessun file dell'app, dello skill system o del pacchetto congelato. Esiti dei cancelli in `controls[]` della capsula.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).
✅ R3: Completa: **nessuno**, e per divieto esplicito del mandato, non per omissione. I file di skill sono il materiale sotto misura di questa calibrazione: toccarne uno cambierebbe l'aggregato `sha256` del freeze §0 e renderebbe irriproducibile il controllo di fuga. Verificato con `git status --short` sul repository principale: gli unici file modificati restano i tre di istradamento che erano già modificati e non committati **prima** che iniziassi, con i digest invariati e identici a quelli congelati. L'unica osservazione su un file di skill — il riferimento a `D-WALKIN-HOME` nella §5 del dossier, che sopravvive alla potatura della §3 — è **annotata e non applicata**, come impone il mandato.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Tre cose, tutte per impossibilità dichiarata, nessuna per scelta di comodo. **(a) Le 19 esecuzioni: zero corse.** Il freeze impone una sessione nuova per casella e io sono una sessione sola; inoltre ho letto il freeze intero, quindi conosco tutte e tre le risposte e sono squalificato come esecutore per costruzione. Non ho usato sub-agenti: erediterebbero la cartella e la memoria di questo repository, che contiene già scritta la risposta di `AR-1`, e ogni casella si registrerebbe `non_noto`. **(b) La review cieca: non avviata.** Non esistono risposte da giudicare, e il revisore è una chat Codex separata che non posso pilotare. **(c) La sintesi: non scritta.** Deve venire dopo i verdetti del revisore, e prima delle risposte qualsiasi differenza fra condizioni sarebbe inventata. Restano inoltre le dieci caselle della corsia A-oggi, bloccate dai due difetti del freeze di §9 — non le ho aggirate scrivendo io i testi mancanti perché li avrei scritti dopo aver letto le chiavi.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: L'attrito vero è che **«congelato per rimando» non è congelato e niente lo controlla**: il freeze dichiara quattro casi congelati rimandando a una sezione che contiene un canovaccio d'intervista, e l'ho scoperto solo cercando in tutto il repository un testo che non c'era — proporrei un cancello che, per ogni caso dichiarato congelato, verifichi che esista un testo verbatim, così l'errore esce alla chiusura del freeze invece che all'esecuzione. Attrito minore ma della stessa famiglia: `git status` collassa gli alberi non tracciati in una riga sola (`?? docs/MetaSkillSystem/`) e la procedura di verifica del prompt esecutori dice «atteso: solo file dello strato», che quella riga sembra soddisfare mentre potrebbe nascondere il freeze intero — proporrei che la verifica sia `git status --porcelain -uall`, che elenca i file uno per uno e toglie il giudizio all'occhio.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto, con un'eccezione che il mandato aveva previsto. Il mandato istrada in modo chiuso — freeze intero, prompt esecutori, prompt revisore, §8-bis del report precedente, §11 della chiusura — e vieta `docs/_lavoro/`: non ho dovuto navigare a tappeto e non ho aperto niente fuori da quell'elenco. L'eccezione è la memoria di progetto, che arriva prima di qualsiasi istradamento e contiene «⚠️ MODELLO CAMBIATO 18-06-26: `daily_guest_limit` RIMOSSO», cioè la risposta di `AR-1`: per me è innocuo perché il freeze me la dà comunque, ma conferma che il terzo canale del §3 è reale e non teorico. Nessun hook ricevuto in questa seduta.

## 12. Self-review del report

1. **Triade MSS:** eseguita — esiti in `controls[]` della capsula, con le viste rigenerate **prima**
   dei cancelli come impone il mandato.
2. **§5 tabella skill:** compilata «nessuno» con il motivo (materiale sotto misura), non rimandata.
3. **§11 coerente:** le sei risposte non si contraddicono col lavoro; §10-bis è ricostruibile a freddo.

Corretto in fase di self-review: la §4.4 inizialmente non esisteva e la chiave del revisore conteneva
un percorso dedotto. Ho verificato tutte e sei le citazioni nella copia congelata, corretto quella
sbagliata e aggiunto la sezione che lo registra.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a04489-55ed-7001-b772-7a6ec4e6b569","correlation_id":"mss-cor-01a04489-55ed-74b7-8aa5-e303f035e082","segment_no":1,"created_at":"2026-08-27T20:44:06+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Senior orchestratore esecuzione calibrazione AM-C0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a04489-55ed-742c-8727-46b286f854e8","capture_key":"mss-ses-01a04489-55ed-7001-b772-7a6ec4e6b569/1/session_event/1","event":{"event_id":"mss-evt-01a04489-55ed-747d-8719-b4824477c53c","event_kind":"session_close","occurred_at":"2026-08-27T20:44:06+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"Senior orchestratore esecuzione calibrazione AM-C0","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD e741cb0; 11 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/27-08-26/Report-senior-esecuzione-am-c0-27-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/27-08-26/Report-senior-esecuzione-am-c0-27-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"VALIDATE-DOCS","criterio":"npm run validate:docs (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:docs (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"VALIDATE-MSS-ALL","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"GIT-DIFF-CHECK","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":".claude/CLAUDE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"e741cb0","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":".cursor/rules/comandi-base.mdc","stable_anchor_or_event_id":"working tree","revision_or_hash":"e741cb0","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"AGENTS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"e741cb0","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"e741cb0","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a04489-55ed-7001-b772-7a6ec4e6b569","correlation_id":"mss-cor-01a04489-55ed-74b7-8aa5-e303f035e082","segment_no":1,"created_at":"2026-08-27T20:44:06+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Senior orchestratore esecuzione calibrazione AM-C0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a04489-55ed-7912-a0c6-97a643e3a5d0","capture_key":"mss-ses-01a04489-55ed-7001-b772-7a6ec4e6b569/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a04489-55ed-77b3-b82b-fb7ade2df23b","axis":"persona","subject_record_ids":["mss-rec-01a04489-55ed-742c-8727-46b286f854e8"],"delta":"nessuno","assertions":[{"signal":"Unico messaggio della seduta: «leggi e esegui \" docs\\Sessioni di lavoro\\27-08-26\\Prompt-senior-esecuzione-calibrazione-am-c0-27-08-26.md\"». Nessuna correzione, nessuna riformulazione, nessuna domanda di chiarimento dopo la prima risposta.","actor":"Matteo","assistance":"spontaneo","origin":"naturale","source_ref":"docs/Sessioni di lavoro/27-08-26/Report-senior-esecuzione-am-c0-27-08-26.md","effect":"La seduta e' stata interamente guidata dal mandato scritto invece che dallo scambio in chat: nessuna decisione di metodo o di prodotto e' stata presa da Matteo, quindi nessuna riga nuova in docs/FOLLOW_UP.md. Le due domande aperte sono poste in sezione dedicata alla fine, senza testo esplicativo prima, come richiesto il 27-08.","evidence_state":"observed"}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"Senior orchestratore esecuzione calibrazione AM-C0","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a04489-55ed-7001-b772-7a6ec4e6b569","correlation_id":"mss-cor-01a04489-55ed-74b7-8aa5-e303f035e082","segment_no":1,"created_at":"2026-08-27T20:44:06+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Senior orchestratore esecuzione calibrazione AM-C0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a04489-55ed-7974-b3ed-b5ce6197ce58","capture_key":"mss-ses-01a04489-55ed-7001-b772-7a6ec4e6b569/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a04489-55ed-7434-9974-8f1db4f0d03d","axis":"sistema","subject_record_ids":["mss-rec-01a04489-55ed-742c-8727-46b286f854e8"],"delta":"modificato","assertions":[{"rule_id_version":"AM-C0@0.1.3","trigger_event":"Eseguendo il freeze e' emerso che i casi C1, C2, C3 e C5, dichiarati congelati «per rimando al PROTOCOLLO §4», non hanno nessun testo di caso verbatim: la sezione rimandata contiene cinque schede candidate dichiarate esse stesse «un canovaccio per l'intervista». Ricerca su tutto il repository: gli unici testi di caso esistenti sono quattro (AR-1, AR-2, AR-3, C4), tutti dentro il freeze.","decision_or_output_changed":"Otto caselle (4 casi x 2 condizioni) e 48 giudizi registrati not_observed con motivo «testo del caso mai congelato» in docs/Sessioni di lavoro/27-08-26/AM-C0/REGISTRO-ESITI.md. Il denominatore resta 114 e non e' stato ricalcolato sul lavoro svolto. Il testo mancante NON e' stato scritto in corsa: sarebbe stato scritto dopo aver letto le chiavi, e la prima condizione di comparabilita' del freeze (stesso testo del caso, incollato verbatim) non sarebbe piu' stata dichiarabile prima della prova.","G":1,"O":1,"E":0},{"rule_id_version":"AM-C0@0.1.3","trigger_event":"La corsia A-oggi gira «sul repository di oggi», dove vivono il freeze e i prompt di questa seduta. Un esecutore del caso C4 che apre docs/MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md sezione 4 legge la riga «Esito atteso — con dossier / senza dossier» del caso a cui sta rispondendo. Il percorso non e' improbabile: .claude/CLAUDE.md punto 5 istrada al MetaSkillSystem i task su criteri e validazione. Il freeze dichiara questo confondente per la corsia d'archivio, dove e' risolto dal tempo, ma per la corsia A-oggi registra «materiale escluso: nessuno».","decision_or_output_changed":"Due caselle e 12 giudizi registrati not_observed con motivo «esito atteso leggibile dall'esecutore». Nessuna delle due uscite e' stata presa dall'agente: escludere il materiale contraddirebbe il freeze, non escluderlo farebbe correre il caso dove la risposta e' visibile. La decisione e' posta a Matteo nella sezione 10 del report. Regola generale ricavata e registrata come dato: una prova non puo' correre nella stessa cartella in cui e' scritto il suo esito atteso.","G":1,"O":1,"E":0},{"rule_id_version":"AM-C0@0.1.3","trigger_event":"La verifica prescritta dal prompt esecutori («git status --short, atteso: solo file dello strato») e' soddisfatta anche da una riga che collassa un intero albero non tracciato: nelle quattro cartelle con sovrapposizione compare «?? docs/MetaSkillSystem/», un percorso che nel repository di oggi contiene il freeze con tutte e tre le risposte piu' il disegno della prova.","decision_or_output_changed":"Controllo aggiuntivo eseguito con find sul contenuto reale: la cartella contiene un solo file, METASKILL_SYSTEM_SKILL.md, in tutte e quattro le cartelle; ricerca per nome di FREEZE_AM_C0*, DOSSIER_OPERATIVO*, PROTOCOLLO_CALIBRAZIONE* e MASTERPLAN_V0* in tutte e sei le cartelle: zero risultati. Miglioria proposta come dato e non applicata: la verifica dovrebbe usare git status --porcelain -uall, che elenca i file uno per uno e toglie il giudizio all'occhio.","G":1,"O":1,"E":0},{"rule_id_version":"AM-C0@0.1.3","trigger_event":"La potatura del dossier per data e' il passo che il mandato dichiara inaffidabile perche' dipende dalla memoria dell'esecutore: se non avviene, D-MANOPOLE e' la risposta di AR-2 e D-TURNO-SALA e' la risposta di AR-3, consegnate all'agente prima di misurare se le trova.","decision_or_output_changed":"Potatura eseguita e verificata con comando invece che con la memoria: delle dieci schede della sezione 3 ne sopravvive una sola in entrambe le copie, D-SFONDO-PRENOTA del 31-05-26, coerente con quanto il freeze prevede per AR-1. Marcatori delle tre risposte cercati sia nella sola sezione 3 sia nell'intero file di entrambe le copie: zero occorrenze. Il controllo di fuga del freeze e' stato rieseguito sulle sei cartelle come costruite, non sui worktree di verifica: zero file per tutti i marcatori post-D, con contro-prova che lo stato di fatto da scoprire e' invece presente.","G":1,"O":1,"E":0}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"Senior orchestratore esecuzione calibrazione AM-C0","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a04489-55ed-7001-b772-7a6ec4e6b569","correlation_id":"mss-cor-01a04489-55ed-74b7-8aa5-e303f035e082","segment_no":1,"created_at":"2026-08-27T20:44:06+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Senior orchestratore esecuzione calibrazione AM-C0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a04489-55ed-7bba-91cd-d52fad101141","capture_key":"mss-ses-01a04489-55ed-7001-b772-7a6ec4e6b569/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a04489-55ed-74c6-8016-7ec53389f9bc","axis":"output","subject_record_ids":["mss-rec-01a04489-55ed-742c-8727-46b286f854e8"],"delta":"creato","assertions":[{"output_id":"pacchetto-esecuzione-am-c0-27-08-26","primary_type":"governance","canonical_version":"docs/Sessioni di lavoro/27-08-26/AM-C0/BLOCCHI-ESECUTORI.md","recipient":"Matteo, che apre le sessioni esecutrici; revisore Codex separato","problem_or_job":"Rendere lanciabile la calibrazione AM-C0 senza scaricare su Matteo nessun lavoro meccanico: cartelle congelate costruite e verificate, dossier potato per data, blocchi gia' composti uno per casella, pacchetto per il revisore cieco pronto, esiti e caselle bloccate registrati con motivo.","intended_use":"Nove sessioni esecutrici in sola lettura sulle cartelle congelate, poi review cieca sulle risposte pseudonimizzate.","conceived_by":"Senior Claude","decided_by":"Matteo","directed_by":"docs/Sessioni di lavoro/27-08-26/Prompt-senior-esecuzione-calibrazione-am-c0-27-08-26.md","authored_by":"Senior Claude","verified_by":"non_osservato","acceptance_criterion":"Aggregato sha256 dei 31 file dello strato identico al freeze sezione 0; cartelle storiche con git status vuoto; ADMIN_CLASSIC_SKILL.md assente dalle due cartelle 1706; dossier potato con sole schede di data anteriore al congelamento; controllo di fuga a zero file su tutti i marcatori post-D nelle sei cartelle; testi dei casi verbatim rispetto alla fonte congelata; cancelli MSS e documentali verdi.","verification_or_use_evidence":"Aggregato sha256 ricalcolato = 2f76a704e3d51c0dc72f1faa03bb454e0c3b3c4276cdc9b83fee0500f496f622, identico al freeze; git status vuoto in 1706-storica e 0508-storica; grep ADMIN_CLASSIC senza risultati in 1706-oggi e 1706-dossier; una sola scheda superstite (D-SFONDO-PRENOTA, 31-05-26) in entrambe le copie del dossier; controllo di fuga 0 file su 8 marcatori nelle sei cartelle, con contro-prova a 43/5/16/29/7 file sullo stato di fatto; confronto per contenuto dei testi dei casi contro la Parte 4 del prompt esecutori, exit 0, 3 occorrenze per caso; sei citazioni della chiave riaperte una per una nella copia congelata, una corretta.","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md","privacy_release":"internal","support_files":["docs/Sessioni di lavoro/27-08-26/AM-C0/CORRISPONDENZA.md","docs/Sessioni di lavoro/27-08-26/AM-C0/PACCHETTO-REVISORE.md","docs/Sessioni di lavoro/27-08-26/AM-C0/REGISTRO-ESITI.md","docs/Sessioni di lavoro/27-08-26/AM-C0/risposte/LEGGIMI.md","docs/Sessioni di lavoro/27-08-26/Prompt-esecutori-AM-C0-corsia-A-archivio-27-08-26.md","docs/Sessioni di lavoro/27-08-26/Prompt-revisore-codex-AM-C0-27-08-26.md","docs/MetaSkillSystem/Senior-Eval-Pack/DOSSIER_OPERATIVO_AGENTE_MATTEO_V0.md"],"relations_no_double_count":["Non esegue la calibrazione: zero caselle corse, zero risposte prodotte, nessun revisore avviato, nessuna sintesi scritta.","Non copre le dieci caselle della corsia A-oggi: otto sono senza testo di caso congelato e due girerebbero dove il loro esito atteso e' leggibile. Restano not_observed con motivo e nel denominatore.","Non corregge il freeze: i due difetti trovati sono registrati e portati a Matteo, non rattoppati in corsa.","Non misura la capacita' di replicare i collaudi di Matteo: e' bloccata a monte e resta dichiarata, non stimata.","Non passa SEP-G2, non avvia SEP-6 e non autorizza il cutover WP-1.","Non modifica app, database, script, hook, validator o fixture; nessun _SKILL.md, nessun file di contesto/, nessuna regola Cursor: sono il materiale sotto misura."],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"Senior orchestratore esecuzione calibrazione AM-C0","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
