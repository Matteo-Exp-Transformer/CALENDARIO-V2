# Prompt — `SK-7` · costruire `mss:capsule`, la capsula generata dalla macchina

> **Uso:** Matteo incolla questo prompt in una chat nuova. Da «Sei un agente senior» in giù.
> **Preparato da:** agente supervisore, 22-08-2026, dopo revisione indipendente di `SK-6`.
> **Baseline tecnica:** commit `5b2c7db` su `env/test`, working tree pulito, `npm run validate` verde.
> **Scritto per essere eseguibile da chi non ha letto nessuna chat precedente.**

---

Sei un **agente senior**. Hai un solo compito, e va chiuso con una prova, non con un'opinione.

---

## 1. Dove siamo — comincia da qui

**Primo comando della sessione, prima di leggere qualunque file:**

```bash
npm run mss:status
```

Ti stampa branch, `HEAD`, scarto da `origin`, stato di ogni cantiere e divieti attivi. Se un valore
dice `non ricostruibile`, apri l'owner che ti indica — **non dedurlo**.

**Secondo comando, e ti serve davvero:**

```bash
npm run mss:query
```

È lo strumento costruito ieri da `SK-6`. Legge le 43 capsule esistenti e ti dice che cosa contengono.
**Il tuo lavoro nasce da quello che questo comando ha scoperto**, quindi guardalo prima di leggere
qualunque documento.

**Stato in tre righe:** il MetaSkillSystem (MSS) è un sistema di regole su *come gli agenti AI
lavorano su questo repository*. Ogni seduta sostanziale lascia una **capsula**: un blocco `JSONL` in
fondo al report, che registra chi ha fatto cosa, con quali prove e con quale stato di verifica. La
direzione decisa da Matteo il 21-08 è in `PLAN_V0.md` §16: **qualsiasi lavoro di un agente deve
essere già raccolta dati, senza inventare contenuti.**

---

## 2. Il problema che devi risolvere

**Le capsule sono scritte a mano.** L'agente digita UUID, orari, elenco degli strumenti, elenco dei
file toccati, esiti dei controlli. Sono dati che **la macchina già possiede**, e che a mano vengono
approssimati, arrotondati, o semplicemente omessi.

`SK-6` ha misurato il danno, e non è teorico:

- **`verified_by` è vuoto in tutte e 129 le annotazioni.** Il valore `independently_verified` non
  compare **mai**, in 43 sedute.
- **Ma le review indipendenti sono avvenute davvero:** 6 controlli risultano eseguiti da attori il
  cui identificatore contiene «reviewer», in 3 sedute distinte.
- **38 capsule su 43 hanno orari arrotondati a multipli di 5 minuti**, il segno inequivocabile della
  scrittura a mano.

Metti insieme le tre righe e ottieni la diagnosi: **non è un sistema che non verifica. È un sistema
che verifica e non lo registra**, perché registrarlo è un lavoro manuale che si perde per primo
quando l'agente è stanco.

**Il tuo compito è togliere quel lavoro manuale.** Si chiama `mss:capsule`, ed è il requisito `R1`+`R2`
della strategia: la raccolta dati come **sottoprodotto** del lavoro, non come cerimonia in fondo.

---

## 2-bis. Che cosa ha già stabilito `SK-6` — misurato, non supposto

Verificato in modo indipendente il 22-08. Puoi costruirci sopra senza rimisurare.

| Fatto | Valore |
|---|---|
| Capsule interrogabili | 43 sedute · 173 record · 0 righe malformate |
| `verification.status` | `self_report` 78 · `unverified` 49 · `not_applicable` 2 · `independently_verified` **0** · `contradicted` **0** |
| `verified_by` non vuoto | **0 su 129** |
| Review realmente avvenute ma non registrate | 6 controlli · 3 revisori · 3 sedute |
| Sedute con `controls` valorizzato | 33 su 43 · 9 dichiarano `"nessuno"` · **1 sola** ha il campo assente |
| La seduta con il campo assente | è **esattamente** quella a schema legacy `0.1.0` |
| Controlli con numeratore/denominatore reali | 126 su 126 |
| Esiti negativi conservati | 5 `fail` su 126 |

L'ultima riga della tabella è quella che ti riguarda di più: **la coppia legacy e il campo mancante
sono la stessa seduta.** La porta di servizio dello schema spiega 1 caso su 1. Chiuderla chiude il
problema, non una sua parte.

---

## 3. Che cosa deve fare `mss:capsule`

Un comando `node scripts/mss/capsule.mjs`, registrato come `npm run mss:capsule`. **Scrive** — è il
primo attrezzo dello scheletro che lo fa, quindi il §6 vale doppio.

Produce il blocco `JSONL` da incollare in fondo a un report, con i campi meccanici **presi dalla
macchina** e i campi di giudizio **richiesti all'agente**.

### I tre livelli di campo — la distinzione su cui si regge tutto

**Livello 1 — la macchina li sa, l'agente non li tocca mai.** Se un campo è qui, l'agente non deve
poterlo scrivere nemmeno volendo.

| Campo | Fonte |
|---|---|
| `record_id`, `session_id`, `event_id`, `annotation_id`, `correlation_id`, `capture_key` | UUIDv7 generato |
| `created_at`, `occurred_at` | orologio reale, **secondi veri, mai arrotondati** |
| `schema_version`, `system_revision` | **`scripts/mss/rules.mjs` righe 3-6** — vedi il divieto qui sotto |
| file toccati, e da lì `owner_refs` | `git diff --name-only` / `git status --porcelain` |
| branch, `HEAD`, ambiente | `git rev-parse`, `git branch --show-current` |

**Livello 2 — la macchina li sa in parte, e la parte mancante NON va indovinata.**

Ho verificato che l'ambiente di sessione espone davvero delle variabili utili:
`AI_AGENT=claude-code_2-1-238_agent`, `CLAUDECODE=1`, `CLAUDE_CODE_ENTRYPOINT=claude-vscode`,
e su Cursor `CURSOR_*`. Da queste **si ricava provider, runtime e superficie**.

⚠️ **Il modello no.** Nessuna variabile dice `opus-5` invece di `sonnet-5`. Quindi:
**il modello va chiesto, mai dedotto dal provider.** Se l'agente non lo fornisce, il comando deve
scrivere un valore che **fa fallire `validate:mss`** — non un valore plausibile. Un modello sbagliato
in una capsula è peggio di un modello mancante: `mss:query --modelli` è la domanda che serve a sapere
se le review erano indipendenti, e la avvelena in silenzio.

> 🔴 **Sicurezza, non opinabile.** Fra quelle variabili ce n'è una che si chiama
> `CLAUDE_CODE_MESSAGING_TOKEN` ed è un **segreto**. Un generatore che fotografa l'ambiente e lo
> infila nella capsula scrive un token dentro un file che finisce in un commit. **Leggi solo le
> variabili che ti servono, per nome, una per una.** Mai `Object.keys(process.env)` dentro l'output.

**Livello 3 — solo l'agente li sa, e il comando glieli chiede.** `intent_user`, `authorization`,
`observed_outcome`, `open_items`, le tre annotazioni di giudizio sui tre assi (`persona`, `sistema`,
`output`), le decisioni attribuite. Questi restano scritti a mano, ed è giusto così: sono *giudizio*,
non *misura*.

### La parte difficile: i `controls` con codici di uscita veri

`controls` è il campo che registra **che cosa è stato davvero verificato**, con criterio, numeratore,
denominatore ed esecutore. È il cuore del contratto e il primo a essere raccontato a memoria.

Uno script Node lanciato a fine seduta **non ha accesso** al registro dei comandi che l'agente ha
eseguito. Questa è la difficoltà centrale del pacchetto, e la scopri nella prima ora: affrontala
subito invece di scoprirla dopo.

**La mia raccomandazione — valutala, non eseguirla a scatola chiusa.** Fai in modo che sia il comando
a **eseguire** i controlli, non a raccoglierne il racconto:

```bash
npm run mss:capsule -- --check "SK7-TEST-MSS:npm run test:mss" --check "SK7-VALIDATE:npm run validate"
```

Il comando lancia davvero ogni riga, cattura il **codice di uscita reale**, e ne ricava
`esito`/`numeratore`/`denominatore`/`esecutore`. Così **un `pass` non è dichiarabile: è guadagnato.**
È il salto di qualità del pacchetto — senza questo hai automatizzato la formattazione, non l'onestà.

Se trovi una via migliore, prendila e **spiega perché nel report**. Se scopri che questa via non
regge (tempi, comandi interattivi, output enormi), **dillo**: è un risultato, non un fallimento.

### Il divieto che chiude una porta di servizio

`schema_version` e `system_revision` vanno **letti da `scripts/mss/rules.mjs`**, e il comando deve
**rifiutarsi** di emettere la coppia legacy `mss.session/0.1.0` + `mss-v0.1-wp0.1-freeze-1`.

Perché conta: con la coppia legacy il campo `controls` **non è obbligatorio** e `validate:mss`
risponde `OK` a una capsula priva di prove. È uno dei tre bypass censiti in `SK-4`. Se la versione
la scrive il generatore leggendola dal motore, **nessun agente potrà più dichiarare una versione che
disattiva le prove** — la porta si chiude per costruzione, senza toccare il validator.

Questo è anche la risposta a un'obiezione che devi conoscere: vedi §11.

### Le regole non negoziabili

1. **Mai un valore plausibile al posto di uno mancante.** Se il comando non riesce a determinare un
   campo, emette un marcatore che **fa fallire la validazione**. Il contratto ammette `nessuno`,
   `non_osservato`, `non_applicabile:<motivo>` — usali quando l'assenza è *un fatto*, mai per
   tappare un buco tuo.
2. **Nessun segreto nell'output.** Vedi l'avviso sopra. Prima di consegnare, cerca nella capsula
   generata le stringhe dei token: devono essere zero.
3. **Non riscrivere le capsule storiche.** Il generatore serve da adesso in avanti. Le 43 esistenti
   restano come sono, arrotondamenti compresi: sono la prova del prima.
4. **Dichiara ciò che non riesci a vedere,** nell'output del comando stesso. `mss:status` e
   `mss:query` lo fanno già: guarda come, e fai lo stesso.

---

## 4. Che cosa puoi riusare — non ripartire da zero

| Cosa | Dove | A cosa ti serve |
|---|---|---|
| **Le costanti di schema** | `scripts/mss/rules.mjs` righe 3-6 | `SCHEMA_CURRENT`, `REVISION_CURRENT`. **Leggile da lì, mai a memoria** |
| Un lettore di capsule già scritto e provato | `scripts/mss/query.mjs` | per rileggere la capsula che hai appena generato e verificarla. Guarda anche come dichiara il proprio perimetro: è lo stile da imitare |
| Estrazione del blocco `jsonl` da un `.md` | `scripts/mss/parse.mjs` | evita di riscrivere il parser |
| Radice del repo robusta | `scripts/mss/query.mjs` (cerca `findRepoRoot`) | ⚠️ `status.mjs` ha la stessa funzione ma **stampa il proprio report al caricamento**: non importarla da lì |
| Lo schema della capsula, campo per campo | `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | ⚠️ **leggi l'avviso in testa prima di tutto**: il titolo dice `0.1.0`, la versione viva è `0.1.1` |
| Una capsula recente fatta bene | la capsula in fondo a `Report-sk6-mss-query-22-08-26.md` | è generata a macchina, ha `controls` con esecutori reali e 0 orari arrotondati. **È il bersaglio da colpire** |

---

## 5. Come si prova che hai finito

Il criterio di chiusura di `SK-7` è **una capsula vera, non un comando che gira.**

```bash
npm run mss:capsule -- --check "SK7-TEST:npm run test:mss"
```

La capsula prodotta deve superare **tutte e cinque** queste prove, e ognuna va mostrata nel report:

1. **Valida:** `npm run validate:mss -- --mode file --file "<il tuo report>" --kind report --require-capsule` risponde `OK`.
2. **Orari veri:** nessun timestamp cade su un multiplo di 5 minuti a secondi zero. Confronto
   esplicito con le 38 storiche che invece ci cadono.
3. **`controls` guadagnati:** almeno un controllo il cui esito viene da un **codice di uscita reale**,
   e lo dimostri facendo fallire di proposito un comando e mostrando che la capsula scrive `fail`.
   **Una prova negativa vale più di tre positive.**
4. **Porta legacy chiusa:** provi a far emettere al comando la coppia `0.1.0`/`freeze-1` e mostri che
   **si rifiuta**.
5. **Zero segreti:** la capsula generata non contiene nessuna delle variabili sensibili d'ambiente.

E devono restare verdi:

```bash
npm run test:mss        # 41 fixture cases + 32 gruppi
npm run validate        # lint + typecheck + test — 163 file, 1346 test
npm run mss:query       # lo strumento di ieri continua a leggere tutto
```

> ⚠️ **`npm run validate` non copre `scripts/`.** L'ho verificato: ESLint non la vede due volte — `lint` gira con `--ext ts,tsx` e `.eslintrc.cjs` ignora `*.mjs` per
> pattern esplicito, e `test:mss` non nomina mai gli attrezzi `mss:*`. Quindi **verde non significa
> che il tuo file funzioni.** Come minimo lancia `node --check` sul file nuovo. Vedi anche il
> pacchetto `SK-11` in fondo: il debito è noto e non è tuo, ma sappilo mentre lavori.

**Come si torna indietro se fallisce:** il tuo lavoro è un file nuovo più una riga in `package.json`.
`git revert` del tuo commit, oppure cancella `scripts/mss/capsule.mjs` e togli la riga. **Nessuna
capsula storica viene toccata**, quindi non c'è niente da recuperare.

---

## 6. Che cosa è vietato, e perché

⚠️ **Questo è il primo attrezzo che scrive su disco.** I divieti qui sotto non sono formalità.

| Divieto | Perché |
|---|---|
| **Non scrivere dentro i report esistenti** | il comando produce testo da incollare, oppure crea un file nuovo. Non modifica un `.md` già scritto: un generatore che tocca report è un generatore che può corrompere l'archivio |
| **Non modificare né correggere le capsule storiche**, nemmeno quelle sbagliate | la provenienza è il patrimonio del sistema. Si corregge **aggiungendo**, mai sovrascrivendo |
| **Non toccare `scripts/mss/adapter.mjs`** | il filtro `[^/]+` alla riga 13 governa il perimetro del pre-commit: allargarlo fa entrare 22 report insieme. È `SK-4` e richiede una decisione di Matteo |
| **Non modificare `scripts/mss/query.mjs`** | è il lavoro chiuso ieri e non ancora rivisto da nessuno. Se ti serve una sua funzione, importala o riscrivila; non riaprirla |
| **Nessun `move` o `rename`** di file MSS | la suite delle prove è legata alla **profondità delle cartelle**: `docs/MetaSkillSystem/tests/h1/run.mjs` risale un numero fisso di livelli. La correzione è `SK-8`, non aperta |
| **Nessun segreto nell'output**, mai | vedi §3. Un token in un file committato non si ritira |
| **Non dichiarare superato un gate** | `SEP-G5` **non** è PASS · `H-1.3` è `PASS_CON_RISERVE` · `WP-1` è **NO-GO**. Puoi raccomandare, non dichiarare |
| **Non toccare `src/`, il database, le migrazioni** | è un prodotto con clienti veri, fuori perimetro |
| **Non aprire `docs/_lavoro/`** | materiale personale. Puoi citarne i path, mai il contenuto |
| **Niente `push` senza un sì esplicito di Matteo** | il commit locale è reversibile, la pubblicazione no |
| **Niente git distruttivo** | no `reset --hard`, no `push --force`, no `stash drop`, no cancellazione di rami. **Ci sono 8 stash e alcuni contengono lavoro non replicabile** |
| **Non aprire altri pacchetti `SK-*`** | uno alla volta. Il tuo è `SK-7` |

---

## 7. Chi decide che cosa

- **Tu decidi:** come implementare, la forma dell'interfaccia a riga di comando, come catturare i
  codici di uscita, quali campi meritano un marcatore di fallimento invece di un default.
- **Torna a Matteo per:** qualunque cosa che richieda di modificare un dato storico; se scopri che
  l'obiezione del §11 è fondata e l'ordine dei pacchetti va cambiato; l'apertura del pacchetto
  successivo.
- **Non decidere al posto suo:** l'ordine dei pacchetti dopo `SK-7`, e se `SK-7` è chiuso.

**Come parlargli.** Matteo non è uno sviluppatore di formazione: ha imparato a costruire software
lavorando con agenti AI. Parlagli per **schermate e flussi concreti**, non per nomi di file isolati.
Quando gli poni una scelta, dagli opzioni distinte, l'effetto concreto di ognuna e **la tua
raccomandazione esplicita** — una domanda neutra gli scarica addosso un lavoro che è tuo. Se usi un
termine tecnico nuovo, mettilo in **grassetto** e spiegalo una volta.

---

## 8. Materiale d'ingresso

Leggi in quest'ordine. Sono pochi apposta.

| # | File | Perché |
|---|---|---|
| 1 | *(comandi)* `npm run mss:status` poi `npm run mss:query` | dove sei, e che cosa dicono le capsule oggi |
| 2 | `docs/Sessioni di lavoro/21-08-26/STRATEGIA-scheletro-mss-21-08-26.md` §3.4 | la specifica di `mss:capsule`, tabella dei campi inclusa |
| 3 | `docs/Sessioni di lavoro/22-08-26/Report-sk6-mss-query-22-08-26.md` §§4-8 | che cosa ha scoperto `SK-6`, e **§8 l'obiezione sull'ordine dei pacchetti** |
| 4 | `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | lo schema campo per campo — **avviso in testa prima di tutto** |
| 5 | `docs/MetaSkillSystem/PLAN_V0.md` §16 e §4-bis | il target di Matteo, le decisioni `D11`-`D15`, la riga `S7` |
| 6 | `scripts/mss/rules.mjs` + `scripts/mss/query.mjs` | le costanti da leggere e lo stile da imitare |
| 7 | `.claude/CLAUDE.md` e `docs/Comunicazione-Skill/VOCABOLARIO.md` | come ci si comporta su questo repo e il vocabolario di Matteo |

---

## 9. Backlog dichiarato — **NON** è il tuo compito

Registrato perché non vada perso. Verificato contro il repo il 22-08-2026. Non toccarlo.

| ID | Cosa | Dove |
|---|---|---|
| `SK-4` | La coppia legacy rende **opzionale** `controls`. **Il tuo pacchetto ne chiude il lato della scrittura** (§3), ma il validator continua ad accettarla in lettura: la correzione piena resta `SK-4` | avviso in testa a `CONTRATTO_CAPSULA_SESSIONE_V0.md` |
| `SK-4` | Un report in **sotto-cartella** è fuori dal perimetro del pre-commit (filtro `[^/]+`): 22 report reali | `scripts/mss/adapter.mjs` riga 13 |
| `SK-4` | `rule_id_version` è testo libero: 6 stringhe citano più regole con un solo `G`/`O`/`E`, e quel punteggio non è attribuibile | misurato da `mss:query --regole` |
| `SK-4` | Lo schema **non ha alcun campo per i gate**: la loro storia non è interrogabile, vive in prosa | `Report-sk6-mss-query-22-08-26.md` §7 |
| `SK-11` *(nuovo — `SK-9` è già `mss:move` in `PLAN_V0.md`)* | `scripts/mss/query.mjs` sono 941 righe con **zero test**, fuori da ogni cancello: `lint` gira con `--ext ts,tsx` e ignora `*.mjs`, `test:mss` non lo nomina. Vale per ogni attrezzo `mss:*`, **il tuo compreso** | `.eslintrc.cjs` `ignorePatterns` |
| `SK-2` | 17 path rotti residui: 14 in `docs/Console-Skill/**`, 3 che toccano il MSS | `npm run validate:docs` |
| `SK-5` | Mettere `test:mss` e `validate:mss` in CI e allargare il trigger a `env/test`. Oggi la CI gira **solo su `main`** e non contiene nulla di MSS | `.github/workflows/ci.yml` |
| `SK-1` | Non esiste alcun tag di ripristino: `git tag -l` è vuoto | — |
| `SK-8` | La suite risale un numero fisso di livelli: nessun `move` è sicuro finché non è fatto | `docs/MetaSkillSystem/tests/h1/run.mjs` |
| — | Gli hook di Claude Code vivono in `.claude/settings.local.json`, **escluso da git**: quell'enforcement non esiste per nessun altro | rafforza `SK-5` |
| — | Il commit `5b2c7db` (`SK-6`) è **fermo in locale**, mai pubblicato | decisione di Matteo |

---

## 10. Come chiudere

1. Scrivi un report in `docs/Sessioni di lavoro/<data di oggi>/Report-sk7-mss-capsule-<data>.md`.
   **Direttamente in quella cartella, non in una sotto-cartella:** una sotto-cartella esce dal
   perimetro dei controlli (è il bug `SK-4` qui sopra — non aggravarlo).
2. Il report deve contenere la sezione **`## Domande di chiusura`** con le sei righe `Q1`-`Q6`
   compilate, e la **capsula** in un blocco ` ```jsonl `. Il pre-commit blocca senza.
3. **La capsula di questo report generala con lo strumento che hai appena costruito.** È la prova
   d'uso più onesta che esista: se non è abbastanza buono per te, non è abbastanza buono. Se sei
   costretto a correggerla a mano, **scrivi quali campi** e perché — quelli sono il vero backlog.
4. Verifica il tuo stesso report prima di committare:
   ```bash
   npm run validate:mss -- --mode file --file "<il tuo report>" --kind report --require-capsule
   ```
5. Chiudi con **massimo cinque punti** per Matteo, in italiano concreto: il quadro in una frase · la
   tensione principale · la tua raccomandazione · che cosa non deve fare nessuno · il prossimo passo
   singolo.
6. **Commit sì, push solo con il suo sì.** Il pre-commit ti fermerà una volta con un controllo «a
   mente fredda»: leggilo davvero, poi rilancia lo stesso comando — il secondo tentativo identico
   passa.

---

## 11. Un'obiezione che devi conoscere prima di cominciare

L'agente che ha costruito `mss:query` ieri, alla fine della seduta, ha raccomandato **l'ordine
opposto** a quello che stai per eseguire. Testualmente:

> «`SK-7` risolverebbe alla radice il problema — ma renderebbe automatico uno schema che sappiamo
> difettoso. **Prima si aggiusta lo schema, poi si automatizza la scrittura.**»

**Matteo ha deciso di procedere lo stesso con `SK-7`, e l'obiezione è stata considerata, non ignorata.**
La contromisura è scritta nel §3: il generatore legge la versione dal motore e **rifiuta la coppia
legacy**, quindi chiude uno dei tre bypass di `SK-4` per costruzione. Automatizzi uno schema
difettoso *meno* difettoso di quello di ieri.

Ma l'obiezione resta viva sugli altri due difetti: `rule_id_version` come testo libero, e l'assenza
di un campo per i gate. **Se lavorando scopri che automatizzare li peggiora davvero** — per esempio
perché il generatore finirebbe per produrre in serie stringhe multi-regola inutilizzabili —
**fermati e dillo a Matteo prima di consegnare.** Non è disobbedienza: è esattamente il motivo per
cui questa sezione esiste.

---

## 12. Una nota sull'onestà

Questo sistema è costruito attorno a un'idea semplice: **distinguere ciò che è stato dichiarato da ciò
che è stato verificato.**

Il tuo pacchetto è quello che rende quella distinzione **automatica** invece che volontaria. Finché
`controls` è scritto a mano, un `pass` è un'opinione battuta sulla tastiera. Quando arriva da un
codice di uscita, è un fatto. È tutta qui la differenza fra le due versioni di questo sistema.

Se il generatore gira e le capsule che produce non sono migliori di quelle scritte a mano, **dillo**.
È una risposta legittima, è un risultato della seduta, e cambia la strategia — molto più di un
comando elegante che formatta bene il nulla.

Se non riesci a stabilire qualcosa, **scrivi che non riesci** e spiega che cosa servirebbe. In questo
sistema è la risposta che nessuno si ricorda mai di dare.
