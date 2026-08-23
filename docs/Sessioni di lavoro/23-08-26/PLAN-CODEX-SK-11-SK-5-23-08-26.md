# Piano condiviso CODEX — `SK-11` test attrezzi → `SK-5` CI `env/test`

> Data: 23-08-2026  
> Stato del documento: **CICLO TECNICO COMPLETATO CON PROVE — chiusura SK-11/SK-5 riservata a Matteo**  
> Branch di lavoro osservato durante la pianificazione: `env/test`  
> Owner operativo del ciclo: questo file. Gli agenti esecutori lo leggono, ma lo aggiorna soltanto
> il coordinatore per evitare stati concorrenti.

## 1. Risultato da ottenere

Il ciclo deve trasformare gli attrezzi di lettura del MetaSkillSystem da script non presidiati a
componenti verificati automaticamente:

1. `SK-11` rende visibili al lint tutti gli `.mjs` sotto `scripts/`, aggiunge test offline e
   deterministici per `mss:query` e `mss:status`, e offre un solo comando il cui exit code decide
   se la suite è verde o rossa.
2. Solo dopo il verde completo di `SK-11`, `SK-5` porta i controlli MSS nella CI anche su
   `env/test`, per push e pull request.
3. `SK-5` non si considera dimostrato finché lo stesso comando eseguito dalla CI non diventa
   realmente rosso davanti a una capsula non valida.

Questo è un ciclo **deep e sequenziale**: `SK-11` precede `SK-5`. Il mandato è indipendente dagli
altri mandati del 23-08, ma non autorizza parallelismo su file condivisi all'interno di questo ciclo.

## 2. Stato reale ricostruito prima del piano

- `SK-6` è chiuso: `mss:query` delega già la vista effettiva a
  `core.mjs::applyAmendmentsView()`; questa delega non deve essere sostituita da una copia.
- `npm run validate` esegue lint, typecheck e Vitest dell'app, ma il lint usa soltanto
  `--ext ts,tsx`; gli `.mjs` sotto `scripts/` non vengono letti.
- `npm run test:mss` esercita 41 fixture e 32 gruppi del validator/H-1, non gli output di
  `mss:query` e `mss:status`.
- `query.mjs` e `status.mjs` eseguono il proprio `main` al momento dell'import: prima dei test
  devono diventare importabili senza produrre output o terminare il processo.
- La CI corrente gira soltanto su `main` e contiene: percorsi documentali, lint, typecheck e unit
  test. Non contiene controlli MSS.
- `PLAN_V0.md` cita `SK-11` nella raccomandazione del §15, ma la tabella autorevole del §4-bis si
  ferma a `SK-10`: **oggi non esiste una riga di stato `SK-11` da aggiornare**.
- Ricognizione lint reale, senza correzioni e con ambiente Node iniettato:
  `npx.cmd eslint scripts --ext mjs --no-ignore --env node --rule "no-console: off"`
  restituisce 4 problemi: tre import inutilizzati dentro `query.mjs`/`status.mjs`, più
  `no-regex-spaces` in `scripts/sync-to-prenotazen.mjs`. Quest'ultimo file è fuori dal perimetro
  di scrittura del mandato.

## 3. Decisioni necessarie di Matteo prima dell'esecuzione

| ID | Decisione | Raccomandazione | Stato |
|---|---|---|---|
| `G1` | Il lint deve coprire davvero tutti gli `.mjs` di `scripts/`: si può allargare il perimetro al solo `scripts/sync-to-prenotazen.mjs` per la violazione preesistente? | **Sì**: correzione meccanica e circoscritta; non indebolire la regola ESLint e non fingere che `scripts/` significhi solo `scripts/mss/`. | **AUTORIZZATA da Matteo il 23-08-26** |
| `G2` | Il nuovo comando dei test attrezzi entra in `npm run validate`? | **Sì**: è il cancello locale che oggi dà un verde falso sugli attrezzi. Tenerlo anche come comando autonomo per diagnosi. | **AUTORIZZATA da Matteo il 23-08-26** |
| `G3` | Si autorizza l'aggiunta della riga `SK-11` nella tabella §4-bis del PLAN? | **Sì**: il masterplan deve poter mostrare stato e prova del pacchetto che nomina già nel §15. | **AUTORIZZATA da Matteo il 23-08-26** |
| `G4` | Il lint globale trova 16 `console.*` preesistenti in `scripts/_test-email-once.mjs`, fuori perimetro; la governance `FU-LOG-1` dichiara zero console negli script. | **Allargare il perimetro a quel solo file e allinearlo al logger CLI esistente**. Non spegnere `no-console` per tutti gli script. | **AUTORIZZATA da Matteo il 23-08-26** |

La dimostrazione rossa di `SK-5` non richiede una scelta aggiuntiva: per default si usa una prova
locale isolata con lo stesso comando della CI, senza branch remoto e senza push. Un branch remoto di
prova richiederebbe invece un nuovo sì esplicito.

## 4. Vincoli non negoziabili per tutti gli agenti

### 4.1 Contesto da caricare

Ogni agente rilegge prima il proprio profilo e non naviga il repository a tappeto.

1. `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` intero.
2. `docs/Testing-Skill/TESTING_SKILL.md` intero per implementazione, revisione o CI.
3. Dal mandato tecnico, nell'ordine:
   - `PLAN_V0.md`: §4-bis, §15, §16;
   - `CONTRATTO_CAPSULA_SESSIONE_V0.md`: §5 e §6;
   - `tests/h1/run.mjs`, `fixture-factory.mjs`, `build-fixtures.mjs`;
   - `query.mjs`, con attenzione a `buildVistaEffettiva()` e `previewValore()`;
   - `core.mjs::applyAmendmentsView()`;
   - le tre voci del 23-08-26 in `EVOLUZIONE_SKILLS.md`.

### 4.2 Scrittura consentita

- `scripts/mss/**`, eccetto `scripts/mss/adapter.mjs`;
- `docs/MetaSkillSystem/tests/**`;
- `.github/workflows/ci.yml`;
- blocco `scripts` di `package.json`;
- configurazione ESLint;
- sole righe di stato dei pacchetti chiusi in `PLAN_V0.md`, salvo autorizzazione `G3` per creare
  la riga mancante di `SK-11`;
- questa cartella di sessione;
- l'eventuale singola eccezione `scripts/sync-to-prenotazen.mjs`, solo se Matteo approva `G1`.

Vietati: `scripts/mss/adapter.mjs`, `src/`, DB e Supabase, capsule storiche, move/rename, push senza
un sì esplicito, git distruttivo e `docs/_lavoro/`.

### 4.3 Regole architetturali

- La semantica degli amendment resta una sola: si importa da `core.mjs`.
- Le fixture sintetiche riusano `tests/h1/fixture-factory.mjs`; si estende la factory soltanto se
  manca un costruttore generale, senza copiare `baseRecord`, `amendment` o `validBundle`.
- Se per rendere importabili gli attrezzi serve una funzione condivisa per radice repo o
  rilevamento del main ESM, crearla una sola volta sotto `scripts/mss/` e importarla da entrambi.
- Nessun test legge rete, DB, ora reale, larghezza terminale o contenuti mobili del repository.
  Timestamp e UUIDv7 sono fissi nelle fixture; colore/TTY e radice repo sono iniettati.
- Un agente non modifica un file assegnato a un altro agente in corso. I passaggi sono sequenziali
  e ogni handoff registra diff e prove in questo piano.

## 5. Organizzazione degli agenti

| Ruolo | Responsabilità | File in proprietà durante la fase | Può dichiarare chiuso? |
|---|---|---|---|
| Coordinatore | decisioni, stato del piano, assegnazioni, verifica perimetro | questo piano | No |
| Esecutore `SK-11` | seam importabili, lint, fixture e suite attrezzi | `scripts/mss/**` ammessi, test MSS, ESLint, scripts package | No |
| Revisore `SK-11` | revisione indipendente del diff e controprova rossa | lettura; eventuali fix solo dopo handoff esplicito | No |
| Esecutore `SK-5` | trigger CI, validazione report cambiati, passi MSS | workflow CI, eventuale helper MSS, scripts package | No |
| Revisore finale | ripete tutte le prove, controlla report/capsula/diff | lettura; report unificato nella propria sezione | No |
| Matteo | decide `G1`–`G3`, accetta i gate e autorizza eventuale push | decisione | **Sì** |

La revisione con famiglia di modello diversa resta consigliata (`D17`) ma non è un gate. Nessun
agente OpenAI può marcare autonomamente `independently_verified` solo perché un secondo Codex ha
riletto il lavoro.

## 6. Piano esecutivo

### Fase 0 — baseline e apertura controllata

1. Verificare branch `env/test`, `git status --porcelain` e assenza di file concorrenti nel
   perimetro.
2. Registrare le risposte `G1`–`G3` in questo piano.
3. Eseguire e conservare le baseline senza correggere:
   - `npm run lint`;
   - lint diagnostico `.mjs` con ambiente Node;
   - `npm run test:mss`;
   - `npm run mss:query -- --verifica`;
   - `npm run mss:status`.
4. Se emergono altre violazioni preesistenti, elencarle a Matteo prima di qualunque correzione in
   massa. Se un nuovo file fuori perimetro è necessario, fermarsi.

Gate: baseline annotata, decisioni risolte, worktree senza collisioni.

### Fase A1 — rendere gli attrezzi importabili senza cambiare la CLI

1. Estrarre una funzione di esecuzione per `mss:query` che riceva almeno argomenti, radice del
   corpus e proprietà TTY; mantenere l'attuale output e gli exit code `0/2` della CLI.
2. Esportare le unità minime necessarie ai test, previste:
   `buildVistaEffettiva`, `previewValore` e il renderer della sezione di verifica. Non esportare
   dettagli non usati.
3. Estrarre da `mss:status` una funzione pura che costruisca il report da owner e stato Git
   iniettati; il wrapper CLI continua a leggere il repository reale.
4. Proteggere entrambi i `main`: importarli dai test non deve stampare né chiamare `process.exit`.
5. Centralizzare soltanto gli helper realmente condivisi emersi dal refactor; nessuna riscrittura
   estetica delle circa 1200 righe di `query.mjs`.
6. Eseguire subito i due comandi CLI e confrontare l'output nominale con la baseline. Differenze di
   contenuto non richieste bloccano la fase.

Gate: CLI invariata nel comportamento, moduli importabili, `node --check` verde.

### Fase A2 — suite `mss:query`

Creare una suite dedicata, proposta:
`docs/MetaSkillSystem/tests/tools/run.mjs`, con fixture sintetiche separate costruite a partire dalla
factory H-1. Ogni caso ha nome, fixture propria, una o più asserzioni oggettive e contribuisce al
conteggio finale.

Copertura minima:

1. **Catena applicata:** due amendment sequenziali `amends`; il valore grezzo resta leggibile e il
   valore effettivo mostra entrambe le correzioni.
2. **Previous non coincidente:** codice `MSS-AMENDMENT-PREVIOUS-MISMATCH`, nessuna correzione
   silenziosa del target.
3. **Orfano:** target assente dal corpus, classificato `MSS-AMENDMENT-ORPHAN`.
4. **Target non final:** target presente ma `draft`, classificato
   `MSS-AMENDMENT-TARGET-NOT-FINAL`.
5. **Supersedes:** nessun payload applicato e caso visibile come
   `MSS-AMENDMENT-SUPERSEDES-UNSUPPORTED`.
6. **Parità a stesso `effective_at`:** due amendment con intento identico sullo stesso path,
   record ID diversi e input invertito. Il risultato e il record scelto come fonte devono essere
   identici nei due ordini e corrispondere al tie-break per `record_id` di `core.mjs`. In questo
   modo il tie-break è osservabile senza duplicare il comparatore.
7. **Collisione dell'anteprima:** valori diversi con gli stessi primi 70 caratteri; il renderer
   deve includere il marcatore che avvisa della coincidenza dovuta al troncamento e il JSON deve
   conservare i valori interi.

La suite deve testare la vista prodotta da `query.mjs`, non una ricostruzione locale della stessa
regola. Il test di spareggio deve diventare rosso se la delega/comportamento diverge dal core.

### Fase A3 — suite `mss:status`

1. **Nominale:** owner sintetici validi + Git sintetico; verificare branch, stato `SK-*`, pacchetto
   Senior-Eval e assenza di divergenze inventate.
2. **Degenere:** owner assente/vuoto e Git non disponibile; verificare la dicitura
   `non ricostruibile`, nessuna eccezione e nessun valore inventato.

`mss:status` non legge capsule o report: perciò il caso degenere corretto è l'assenza degli owner,
non un “report senza capsula” che lo script non consuma. Il report senza capsula resta già coperto
dalla suite H-1 e verrà usato nella dimostrazione CI.

### Fase A4 — lint e comando unico

1. Aggiungere un override ESLint Node per `scripts/**/*.mjs`; per gli script CLI l'uso deliberato
   della console deve essere governato esplicitamente, non segnalato come warning.
2. Estendere `npm run lint` affinché includa gli `.mjs` sotto `scripts/`, direttamente o tramite un
   sottocomando richiamato da `lint`.
3. Correggere soltanto le violazioni inventariate e approvate dopo la baseline. Non disattivare
   `no-console` globalmente: `FU-LOG-1` resta la governance viva. La gestione delle 16 occorrenze in
   `_test-email-once.mjs` dipende da `G4`. Nessun `eslint --fix` indiscriminato.
4. Aggiungere un comando autonomo, nome proposto `npm run test:mss:tools`, che esegue tutta la suite
   A2+A3, stampa il numero di test e restituisce `0` solo se sono tutti verdi.
5. Applicare `G2`: se approvata, aggiungere `test:mss:tools` a `npm run validate`; altrimenti
   mantenerlo autonomo e documentare la decisione.

Gate `SK-11`: lint `.mjs` verde con zero warning, H-1 verde, suite attrezzi verde con conteggio,
`validate` verde, controprova rossa eseguita e ripristinata.

### Fase A5 — revisione e prova che i test sanno fallire

1. Il revisore legge mandato, piano, diff e test senza assumere corretto il lavoro dell'esecutore.
2. Modifica temporaneamente **una sola asserzione della suite** con `apply_patch`, esegue
   `test:mss:tools` e registra exit `1` più la riga rossa.
3. Ripristina la stessa asserzione con patch inversa, rilancia la suite e verifica exit `0`.
4. Confronta `git diff` prima/dopo per provare che la mutazione temporanea non è rimasta.
5. Solo dopo tutte le prove, aggiornare la riga `SK-11` se `G3` è stata autorizzata. Lo stato da
   scrivere descrive le prove; la dichiarazione finale di chiusura resta di Matteo.

### Fase B1 — CI su `env/test`, soltanto dopo il gate A

1. Estendere i trigger del workflow a `main` ed `env/test`, sia `push` sia `pull_request`.
2. Configurare checkout con storia sufficiente per confrontare base e head.
3. Aggiungere un passo che individua i `Report-*.md` aggiunti o modificati dalla PR/push e li passa
   al validator MSS con `--kind report --require-capsule`. La logica di validazione resta nel core
   esistente: l'eventuale helper CI coordina i file, non reimplementa le regole.
4. Gestire esplicitamente “nessun report MSS toccato” come successo dichiarato, non come errore di
   shell nascosto.
5. Aggiungere i passi distinti:
   - validazione MSS dei report cambiati;
   - `npm run test:mss`;
   - `npm run test:mss:tools`.
6. Conservare i gate applicativi esistenti.

Gate: esecuzione locale dello stesso comando CI verde su input validi.

### Fase B2 — dimostrazione rossa di `SK-5`

1. Creare in un'area temporanea isolata un nuovo report standard con capsula intenzionalmente
   invalida; non modificare capsule storiche.
2. Eseguire esattamente il comando usato dal passo CI, con base/head o lista file equivalenti a una
   PR reale.
3. Registrare exit non zero, codice MSS e riga di log che identifica il report rotto.
4. Eliminare soltanto l'artefatto temporaneo creato dalla prova e verificare che il worktree del
   progetto non conservi la capsula rotta.
5. Rilanciare lo stesso comando sul corpus valido e registrare exit `0`.

Non usare una frase descrittiva come prova. Non creare/pushare un branch remoto senza autorizzazione.

### Fase C — validazione completa, report e stato

Eseguire nell'ordine e registrare per ciascuno comando, exit code e riga probante:

1. `node --check` su ogni `.mjs` toccato;
2. lint esteso agli script, zero warning;
3. `npm run test:mss`;
4. `npm run test:mss:tools`, con numero di test;
5. controprova rossa dei test e successivo verde;
6. `npm run validate`;
7. `npm run validate:docs`, baseline attesa **17 path rotti**;
8. `git status --porcelain` e controllo automatico dei path fuori perimetro;
9. comando CI rosso su capsula invalida e verde dopo rimozione;
10. `npm run validate:mss` sul report del ciclo, esito `OK`.

Aggiornare `PLAN_V0.md` soltanto dopo le prove:

- `SK-11`: solo se `G3` autorizza la riga mancante;
- `SK-5`: non oltre lo stato provato dalla CI rossa;
- non toccare `SK-4`, `SK-7`, `WP-1`, `H-1.3` o `SEP-G5`.

## 7. Report unico del ciclo

Tutti gli agenti aggiornano un solo file:

`docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-11-SK-5-23-08-26.md`

Sezioni minime: obiettivo, decisioni `G1`–`G3`, baseline, esecuzione `SK-11`, revisione `SK-11`,
esecuzione `SK-5`, dimostrazione CI rossa, prove finali, cosa non è stato fatto, dati
comunicazione, capsula MSS JSONL e domande di chiusura.

La capsula usa UUIDv7, `segment_no: 1` e `verification.status: self_report` finché una revisione
ammissibile non dimostra altro. Un record `final` eventualmente errato si corregge con amendment,
mai riscrivendolo.

Il report termina con le sei domande canoniche, verbatim:

```text
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1:

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2:

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3:

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4:

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5:

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6:
```

## 8. Registro avanzamento

| Fase | Stato | Agente | Prova/handoff |
|---|---|---|---|
| Piano | `COMPLETATO` | Codex coordinatore | mandato, skill Meta, skill Testing, contratto e codice corrente letti |
| Decisioni `G1`–`G3` | `AUTORIZZATE` | Matteo | messaggio chat 23-08-26: «autorizzo g1 - g2 - g3» |
| Decisione `G4` | `AUTORIZZATA` | Matteo | messaggio chat 23-08-26: «si prosegui» |
| Fase 0 baseline | `COMPLETATA` | Codex esecutore SK-11 | branch `env/test`; lint exit 0; lint `.mjs` exit 1 con 20 problemi attesi; H-1 exit 0 a worktree stabile (`41 fixture cases + 32 contract/integration groups`); query/status exit 0 |
| A1 importabilità | `COMPLETATO` | Codex esecutore SK-11 | query/status importabili senza output; CLI nominali exit 0, opzione ignota exit 2; `node --check` verde |
| A2 query | `COMPLETATO` | Codex esecutore SK-11 | 7 scenari query nella suite strumenti, verdi |
| A3 status | `COMPLETATO` | Codex esecutore SK-11 | nominale + degenere sintetici, verdi |
| A4 lint/comando | `COMPLETATO` | Codex esecutore SK-11 | lint globale exit 0; H-1 `42 + 32`; tools `9/9`; validate exit 0 |
| A5 revisione SK-11 | `COMPLETATO — CERTIFICATO` | Codex revisore SK-11 | rosso exit 1 (`1/9`), patch inversa, verde exit 0 (`9/9`), SHA prima/dopo identico; stessa famiglia = `self_report` |
| B1 CI | `COMPLETATO` | Codex esecutore SK-5 | workflow main+env/test; helper report AM; passi MSS distinti; no-report esplicito |
| B2 CI rossa | `COMPLETATO` | Codex esecutore SK-5 | temp isolato: rosso exit 1 `MSS-VITAL-MISSING` + path; rimozione artefatto; verde exit 0 no-report; temp rimossa |
| C chiusura | `COMPLETATA — APPROVATA CON PROVE` | Codex revisore finale + coordinatore | 7/7 check; lint 0; H-1 `42 + 32`; tools `9/9`; validate 0; docs baseline 17; seconda CI rosso→verde; report MSS OK; stessa famiglia = `self_report` |

## 9. Criterio di arresto

Un agente si ferma e aggiorna l'handoff senza improvvisare se:

- deve toccare `adapter.mjs`, una capsula storica o un path non autorizzato;
- scopre una seconda implementazione di una regola già presente;
- baseline, CLI o output nominale cambiano fuori dai casi richiesti;
- un file è contemporaneamente in modifica da un altro mandato/agente;
- la CI rossa richiederebbe un push non autorizzato;
- manca una decisione `G1`–`G4` che cambia ciò che va costruito.
