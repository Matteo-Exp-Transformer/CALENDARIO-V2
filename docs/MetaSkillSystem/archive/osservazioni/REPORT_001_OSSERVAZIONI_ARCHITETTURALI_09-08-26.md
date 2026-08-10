# Report 001 — osservazioni architetturali sul MetaSkillSystem v0

> **Data:** 09-08-26  
> **Autore della lettura:** agente Codex, profilo Meta  
> **Stato:** osservazioni registrate; decisioni operative confluite in `PLAN_V0.md` solo dove Matteo
> le ha approvate.  
> **Funzione:** conservare che cosa è stato notato, da quale evidenza è nato e perché conta. Non
> possiede lo stato dei lavori e non sostituisce il masterplan.

## 1. Perimetro e metodo della lettura

La lettura ha incrociato quattro prospettive:

1. il fallimento del sistema precedente e il rapporto strutturale successivo a `C9`;
2. il disegno corrente del v0: ingresso, parametri macro, capsula e piano;
3. l'evento e il report che hanno prodotto il v0;
4. i punti in cui il disegno è già innestato nel lavoro reale: routing, prepara-prompt, chiusura,
   log di sessione e hook locali.

Non sono stati aperti `C8`, nuovi blocchi personali, mining, HubSpot o codice applicativo: non erano
necessari per valutare l'architettura. Il materiale personale resta privato e fuori da git.

Queste osservazioni non promuovono skill di Matteo e non certificano il sistema. Separano:

- **dato:** contraddizione o assenza verificabile nei documenti/strumenti attuali;
- **rischio:** conseguenza plausibile che deve ancora essere osservata;
- **proposta:** possibile risposta, da validare nel masterplan;
- **decisione:** scelta esplicita di Matteo in questa seduta.

## 2. Giudizio complessivo

La direzione è corretta. Il v0 possiede già un nucleo epistemico più solido del sistema precedente:

- Persona, Sistema e Output non si sostituiscono;
- attribuzione, provenienza e assistenza sono obbligatorie;
- una regola letta non equivale a una regola applicata;
- governance, osservazione ed enforcement restano misure distinte;
- un file non diventa un prodotto per il solo fatto di esistere;
- `nessuna osservazione` è un dato valido;
- la root non viene migrata prima dei gate.

Il sistema attuale è però ancora soprattutto un **contratto documentale di cattura**. Non è ancora
un event store stabile, un router formalizzato o un enforcement autonomo. Questa non è una bocciatura:
è il confine vero da cui proseguire.

## 3. Osservazioni registrate

### `OBS-001` — manca il fingerprint del sistema osservato

- **Tipo:** dato.
- **Da cosa nasce:** la capsula possiede `session_id`, data, ruolo e area, ma non una versione dello
  schema, la revisione del MetaSkillSystem, i pacchetti effettivi, il modello/runtime o gli strumenti
  disponibili. `PARAMETRI_MACRO_V0` dichiara utile confrontare modelli e agenti, ma l'evento non
  conserva ciò che renderebbe possibile il confronto.
- **Perché conta:** un miglioramento futuro potrebbe dipendere da un modello più forte e venire
  attribuito erroneamente a una regola. Eventi prodotti da schemi diversi diventerebbero
  indistinguibili.
- **Direzione proposta:** aggiungere almeno `schema_version`, `system_revision`, `packages_loaded`,
  `agent_runtime/model`, `tool_surface` e `recorded_by` prima del mining normalizzato.

### `OBS-002` — fatti grezzi e interpretazioni convivono nello stesso record

- **Tipo:** rischio strutturale osservabile nello schema.
- **Da cosa nasce:** la capsula unisce busta fattuale, `delta_persona`, effetto, stato prova,
  candidati di evoluzione e G/O/E.
- **Perché conta:** una tassonomia nuova obbligherebbe a riscrivere il passato oppure farebbe
  sembrare originaria un'interpretazione aggiunta dopo.
- **Direzione proposta:** mantenere un evento base immutabile e appendere annotazioni/versioni
  derivate con autore, data e riferimento all'evento.

### `OBS-003` — manca un protocollo di rettifica append-only

- **Tipo:** lacuna.
- **Da cosa nasce:** il sistema dichiara che recupera dagli errori senza cancellare la storia, ma lo
  schema non possiede `supersedes`, `amends`, motivo della rettifica o stato dell'annotazione.
- **Perché conta:** le rettifiche rischiano di diventare riscritture silenziose, proprio la classe
  di errore che il sistema vuole eliminare.
- **Direzione proposta:** introdurre relazioni di rettifica e vietare l'overwrite degli eventi
  finalizzati; le viste mostrano l'ultimo stato, la storia conserva la catena.

### `OBS-004` — la capsula è auto-compilata dall'agente che deve descrivere se stesso

- **Tipo:** rischio di attribuzione.
- **Da cosa nasce:** l'agente operativo scrive report e capsula; la separazione osservatore/revisore
  è prevista, ma non è un campo del record ordinario.
- **Perché conta:** una dichiarazione come «regola applicata» resta self-report anche quando porta
  un effetto plausibile.
- **Direzione proposta:** distinguere `asserted_by`, `verified_by` e `verification_status`. La
  self-telemetria resta utile, ma non viene scambiata per verifica indipendente.

### `OBS-005` — il formato light collide con la tabella che deve ospitarlo

- **Tipo:** difetto concreto.
- **Da cosa nasce:** la forma light usa `|` come separatore; `SESSION_LOG.md` è una tabella Markdown
  che usa gli stessi caratteri per le colonne. Non è definito escaping, colonna proprietaria o
  formato alternativo. La riga del 09-08 resta narrativa, non una capsula compatta.
- **Perché conta:** il primo uso reale può rompere il renderer o produrre un record non parsabile.
- **Direzione proposta:** scegliere un solo formato canonico compatibile col log oppure spostare la
  capsula light in un blocco/event store dedicato e lasciare nel log soltanto il rimando.

### `OBS-006` — il gate prodotto è già stato parafrasato in modo divergente

- **Tipo:** difetto concreto di vista.
- **Da cosa nasce:** il proprietario richiede come quinto gate «evidenza di verifica o uso»; il
  report della seduta lo riassume come «confine di uscita». Privacy e autorizzazione restano vitali,
  ma non sostituiscono la prova di verifica/uso.
- **Perché conta:** dimostra che una vista narrativa può divergere dal proprietario nello stesso
  giorno in cui nasce.
- **Direzione proposta:** riallineare la narrativa e far derivare i gate da campi strutturati, non
  da copie in prosa.

### `OBS-007` — il pilota WP-1 non ha ancora un criterio congelato sufficiente

- **Tipo:** lacuna di validazione.
- **Da cosa nasce:** sono elencati quattro tipi di sessione e una matrice di casi, ma non sono
  fissati numero minimo di istanze, denominatore, ripetizioni, valutatore, versione dell'oggetto e
  trattamento delle correzioni durante il pilota.
- **Perché conta:** correggere lo schema durante il test e poi dichiarare superato lo stesso test
  riprodurrebbe il problema di `WP-5`.
- **Direzione proposta:** congelare protocollo e versione prima della prima istanza; lasciare vuoti
  nel masterplan i numeri che richiedono un primo campione, ma scrivere chi e quando li decide.

### `OBS-008` — il preflight non è automaticamente enforcement

- **Tipo:** distinzione architetturale.
- **Da cosa nasce:** il piano parla di rilevare conflitti, LOCK, owner e scope prima della scrittura;
  un validator può però soltanto segnalare se l'ambiente non gli concede il potere di bloccare.
- **Perché conta:** chiamare E3 un controllo aggirabile creerebbe un falso positivo di maturità.
- **Direzione proposta:** dichiarare per ogni controllo il punto di intercettazione e l'effetto:
  nudge, warning, `ask`, blocco del commit, blocco dell'azione o impossibilità tecnica.

### `OBS-009` — gli hook esistenti sono una base utile, ma hanno superfici diverse

- **Tipo:** dato verificato.
- **Da cosa nasce:** oggi esistono un guard Cursor pre-shell/pre-MCP, un nudge di fine sessione e un
  controllo Husky pre-commit. Il guard PROD può chiedere conferma prima dell'azione; il nudge agisce
  alla chiusura; Husky blocca il commit, non l'edit. Gli hook Cursor non coprono Cloud Agents e alcuni
  rami sono deliberatamente fail-open.
- **Perché conta:** l'enforcement rapido è realistico, ma la sua copertura va misurata per superficie.
- **Decisione Matteo:** partire dagli hook come soluzione efficace e rapida; passare a meccanismi
  superiori quando il resto del sistema è più solido.
- **Direzione approvata:** prima tranche con validator deterministico + hook di chiusura/pre-commit;
  matrice esplicita di copertura e fallback. Non chiamare pre-scrittura ciò che avviene al commit.

### `OBS-010` — le sessioni light non sono oggi coperte dal controllo di completezza

- **Tipo:** dato.
- **Da cosa nasce:** il nudge cerca il report più recente; le light non hanno un report e vivono nel
  log. Il pre-commit controlla report staged, non la presenza/validità della capsula light.
- **Perché conta:** il ramo più economico e frequente rischia di diventare quello con maggiore perdita
  di dati.
- **Direzione proposta:** aggiungere un controllo specifico per l'evento light, senza obbligare a un
  report completo.

### `OBS-011` — manca un’identità robusta e concorrente degli eventi

- **Tipo:** rischio.
- **Da cosa nasce:** l'ID `MSS-2026-08-09-0001` è leggibile ma sembra assegnato manualmente; il piano
  prevede più agenti e output paralleli.
- **Perché conta:** due agenti possono produrre lo stesso progressivo o aggiornare lo stesso indice.
- **Direzione proposta:** definire generazione ID, deduplicazione, correlazione fra compact/handoff,
  regole di concorrenza e un solo writer per indice/proiezione.

### `OBS-012` — owner unico senza registro strutturato e integrità referenziale resta una convenzione

- **Tipo:** rischio.
- **Da cosa nasce:** i proprietari sono nominati in più documenti, ma il manifest proprietario è
  previsto soltanto in WP-3.
- **Perché conta:** una vista può puntare a un owner inesistente, spostato o incompatibile senza che
  il sistema lo rilevi.
- **Direzione proposta:** introdurre nel pre-pilota il minimo indispensabile per risolvere owner e
  versione; lasciare il catalogo completo a WP-3.

### `OBS-013` — le fonti vive hanno riferimenti fragili

- **Tipo:** rischio già osservato nella storia.
- **Da cosa nasce:** il binario personale ha già mostrato riferimenti a riga scaduti nello stesso
  giorno. La capsula lascia `fonte` come campo libero.
- **Perché conta:** una ricostruzione futura può trovare il file ma non più l'evidenza citata.
- **Direzione proposta:** per fonti vive usare ID/sezione stabile più revisione/hash; riservare la
  riga ai verbali congelati, coerentemente con la Bussola.

### `OBS-014` — ruoli e chiavi hanno bisogno di una vera matrice di autorità

- **Tipo:** lacuna rinviata correttamente a WP-3, ma da non perdere.
- **Da cosa nasce:** la visione usa chiavi che aprono porte; oggi il ruolo è ancora testo e non
  definisce precedenze, default deny, delega, revoca o conflitto.
- **Perché conta:** una “chiave” non verificabile rischia di essere soltanto un prompt più autorevole.
- **Direzione proposta:** capability esplicite `read/write/forbid`, negazione prevalente, priorità,
  expiry e audit; nessuna chiave locale può ampliare permessi concessi dal livello superiore.

### `OBS-015` — manca ancora il trust boundary dei pacchetti

- **Tipo:** rischio futuro.
- **Da cosa nasce:** il sistema dovrà caricare pacchetti e documenti da aree diverse. Non è ancora
  definito quali fonti siano normative, informative, esterne o potenzialmente ostili.
- **Perché conta:** istruzioni contenute in un documento di lavoro potrebbero essere interpretate
  come governance e provocare escalation o prompt injection documentale.
- **Direzione proposta:** provenienza e classe di fiducia nel manifest; i pacchetti informativi non
  possono assegnarsi autorità.

### `OBS-016` — il lifecycle privacy è più corto del lifecycle dei dati

- **Tipo:** lacuna.
- **Da cosa nasce:** ambiente, privacy e divieto di uscita sono registrati, ma mancano retention,
  rettifica, cancellazione, sensibilità, consenso/opt-out ed esportazione.
- **Perché conta:** un sistema che raccoglie sedute quotidiane accumula dati personali anche senza
  profilazione nascosta.
- **Direzione proposta:** policy minima prima del mining; scelte di durata e portabilità restano
  aperte finché Matteo non le decide su esempi concreti.

### `OBS-017` — “sessione sostanziale” non è ancora un confine operativo

- **Tipo:** ambiguità.
- **Da cosa nasce:** la capsula è obbligatoria per ogni sessione sostanziale, ma il confine fra
  micro-turno, light e sessione non è formalizzato.
- **Perché conta:** agenti diversi possono catturare troppo, troppo poco o creare eventi duplicati.
- **Direzione proposta:** definire trigger di apertura/chiusura evento e casi `non applicabile`,
  basandosi sui primi piloti invece che su una tassonomia inventata ora.

### `OBS-018` — manca una misura del costo e della qualità della cattura

- **Tipo:** rischio operativo.
- **Da cosa nasce:** i campi sono numerosi e la forma light contiene comunque tutti i vitali. Sono
  previsti costo e rework come dati utili, ma non un gate contro checklist compilate meccanicamente.
- **Perché conta:** più campi possono aumentare completezza formale e ridurre precisione reale.
- **Direzione proposta:** nei piloti misurare vitali persi/inventati, tempo/rework, accordo del
  revisore freddo e campi frequentemente `non noto`; semplificare soltanto dopo i dati.

### `OBS-019` — portabilità e personalizzazione possono produrre overfitting

- **Tipo:** rischio futuro.
- **Da cosa nasce:** il sistema nasce su Matteo ma vuole diventare portabile. Le regole possono
  adattarsi così bene al primo soggetto da non distinguere miglioramento generale e accomodamento.
- **Perché conta:** soddisfazione del primo utente non dimostra portabilità.
- **Direzione proposta:** kernel senza dati personali, overlay separato e, più avanti, casi holdout
  o utenti consenzienti diversi. La tempistica resta da decidere dopo il v0 locale.

### `OBS-020` — la roadmap generale ha già prodotto una vista stale

- **Tipo:** difetto concreto.
- **Da cosa nasce:** la roadmap registra nel log T1 `6/6`, mentre il riquadro del traguardo visibile
  continua a mostrare lo snapshot `1/6`. La riga `SYS-1` ricopia inoltre stato e gate posseduti dal
  piano v0.
- **Perché conta:** conferma che un file vivo lungo non può essere contemporaneamente storia,
  dashboard e fonte operativa affidabile.
- **Decisione Matteo:** usare un solo masterplan MetaSkillSystem come piano + roadmap; alleggerire la
  roadmap generale.
- **Direzione approvata:** `PLAN_V0.md` possiede stato/progressi/gate di `SYS-1`; la roadmap generale
  conserva soltanto il cantiere e il puntatore.

### `OBS-021` — il mining storico non deve precedere la prima stabilizzazione dello schema

- **Tipo:** raccomandazione di sequenza.
- **Da cosa nasce:** WP-2 può partire in sola lettura, ma normalizzare eventi prima di fissare
  versione, rettifiche e fingerprint crea dati già legacy.
- **Perché conta:** aumenterebbe il rework e potrebbe congelare scelte premature per inerzia.
- **Direzione proposta:** consentire inventario read-only; iniziare la normalizzazione soltanto dopo
  hardening minimo e almeno un pilota reale ricostruito a freddo.

### `OBS-022` — serve una politica di dipendenze e deprecazione dei pacchetti

- **Tipo:** rischio futuro.
- **Da cosa nasce:** il sistema prevede crescita continua per pacchetti, ma non ancora compatibilità,
  dipendenze cicliche, sostituzione e data di morte.
- **Perché conta:** l'organismo può crescere per aggiunta e trasformare ogni vecchia eccezione in
  contesto permanente.
- **Direzione proposta:** manifest con dipendenze/versioni e lifecycle
  `draft/active/deprecated/retired`; budget di contesto e scadenza per gli artefatti temporanei.

### `OBS-023` — backup, ripristino e integrità dell'event store non sono ancora modellati

- **Tipo:** rischio futuro.
- **Da cosa nasce:** gli eventi diventano memoria preziosa del sistema e della persona, ma non
  esistono ancora politica di snapshot, ripristino o verifica integrità.
- **Perché conta:** perdere o corrompere la cronologia renderebbe fragili tutte le viste derivate.
- **Direzione proposta:** affrontare dopo la scelta del formato/store; il masterplan conserva il
  buco senza scegliere ora tecnologia e retention.

## 4. Decisioni esplicite di questa seduta

1. Creare questo report come memoria completa delle osservazioni e della loro origine.
2. Trasformare `PLAN_V0.md` nel masterplan unico di `SYS-1`, usato anche come roadmap operativa.
3. Alleggerire la roadmap generale lasciandole soltanto il puntatore al masterplan.
4. Inserire un hardening pre-pilota che chiuda i difetti capaci di rendere inutilizzabili i dati.
5. Dare priorità a hook e validator rapidi, dichiarandone onestamente superficie e limite.
6. Conservare le idee di enforcement superiore senza sceglierne ora la tecnologia.
7. Lasciare buchi espliciti dove servono dati o decisioni future, anziché inventare il finale.

## 5. Lettura operativa

Le osservazioni non richiedono ventitré lavori separati. Nel masterplan confluiscono in pochi
pacchetti coesi:

- **hardening del contratto:** `OBS-001…007`, `011…013`, `016…018`;
- **hook ed enforcement rapido:** `OBS-008…010`;
- **kernel, autorità e pacchetti:** `OBS-012`, `014`, `015`, `022`;
- **portabilità e resilienza future:** `OBS-019`, `023`;
- **governo del lavoro e delle viste:** `OBS-020`, `021`.

Lo stato e l'ordine non vivono qui. Fonte operativa unica: `PLAN_V0.md`.
