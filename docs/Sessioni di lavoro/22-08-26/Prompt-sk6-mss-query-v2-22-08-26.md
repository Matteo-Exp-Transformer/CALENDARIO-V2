# Prompt — `SK-6` v2 · costruire `mss:query`, il lettore delle capsule

> **Uso:** Matteo incolla questo prompt in una chat nuova. Da «Sei un agente senior» in giù.
> **Sostituisce:** `docs/Sessioni di lavoro/21-08-26/Prompt-sk6-mss-query-21-08-26.md` (v1).
> Il mandato è identico. Cambiano le domande da 6 a 5, e sono corretti sei punti che in v1
> avrebbero prodotto **numeri sbagliati senza che l'agente se ne accorgesse**.
> **Revisione:** pressure-test contro il repo del 22-08-2026, misurazioni riportate al §2-bis.
> **Scritto per essere eseguibile da chi non ha letto nessuna delle due chat.**

---

Sei un **agente senior**. Hai un solo compito, e va chiuso con una prova, non con un'opinione.

---

## 1. Dove siamo — comincia da qui

**Primo comando della sessione, prima di leggere qualunque file:**

```bash
npm run mss:status
```

Ti stampa branch, `HEAD`, scarto da `origin`, stato di ogni cantiere e divieti attivi, derivandoli
dagli owner. Esiste dal 20-08 ed è la ragione per cui non devi aprire dieci documenti per sapere dove
sei. Se un valore dice `non ricostruibile`, apri l'owner che ti indica — **non dedurlo**.

**Stato in tre righe:** il MetaSkillSystem (MSS) è un sistema di regole su *come gli agenti AI
lavorano su questo repository*. Ha regole scritte bene e un validator che ne impone una parte. Dal
21-08 ha una direzione nuova, decisa da Matteo e scritta in `docs/MetaSkillSystem/PLAN_V0.md` §16:
**qualsiasi lavoro di un agente deve essere già raccolta dati, senza inventare contenuti.**

---

## 2. Il problema che devi risolvere

In 42 sedute il sistema ha scritto **42 capsule** — blocchi `JSONL` in fondo ai report, che registrano
chi ha fatto cosa, con quale autorizzazione, con quali prove e con quale stato di verifica.

> ⚠️ **Il numero è 42, non 41.** La v1 di questo prompt diceva 41: era il numero delle *fixture*
> della suite `test:mss` («41 fixture cases»), che è un'altra cosa. Se ti trovi 42, è giusto.
> Non forzare i conti per farli tornare a 41.

**Quelle 42 capsule non sono mai state interrogate da nessuno.** Una macchina le rilegge, ma solo per
impedire che il passato venga riscritto. Nessun essere umano e nessun agente le ha mai usate per
rispondere a una domanda.

Finché è così, la raccolta dati non ha un consumatore: si riempie un archivio che nessuno apre.

**Il tuo compito è costruire il lettore.** Si chiama `mss:query`, e gira sulle **42 capsule che già
esistono** — non chiede di raccoglierne di nuove.

> **Perché questo prima di tutto il resto.** Se dalle capsule esistenti non esce niente di utile,
> è un'informazione preziosa e la ottieni spendendo un comando, **prima** di automatizzare la
> raccolta. Se invece ne esce qualcosa, hai la prova che il resto dello scheletro vale la pena.
> Un esito negativo qui è un risultato valido, non un fallimento: **riportalo come tale.**

---

## 2-bis. Misurazioni di orientamento — leggile, poi riproducile

Queste cifre vengono da un censimento **read-only** fatto in sede di revisione del prompt, il
22-08-2026, sulle capsule presenti a `HEAD`. Te le diamo per due motivi: ti risparmiano mezza
giornata, e ti danno un termine di paragone.

| Misura | Valore rilevato |
|---|---|
| File `.md` con blocco capsula, a `HEAD` | **42** |
| `session_id` distinti | **42** |
| Record `JSONL` totali | **169** — quindi **~4 record per seduta** |
| Record malformati | **0** |
| `record_type` | `session_event` 42 · `annotation` 126 · `amendment` 1 |
| `annotation.axis` | `persona` 42 · `sistema` 42 · `output` 42 |
| `verification.status` | `self_report` 76 · `unverified` 48 · `not_applicable` 2 |
| `verification.verified_by` non vuoto | **0 su 169** |
| `controls[].esito` | `pass` 111 · `fail` 5 |
| `event.controls` presente | 32 sedute su 42 |
| Assertion con `G`/`O`/`E` | 48, che citano **35 regole distinte**, di cui **30 una volta sola** |

**Non copiarle nel tuo report come tue.** Riproducile col comando che costruisci. **Se il tuo comando
dà numeri diversi da questi, non assumere che questi abbiano ragione:** apri il caso, capisci chi
sbaglia, e scrivi nel report quale dei due era giusto e perché. È esattamente il tipo di controllo
incrociato che questo sistema esiste per rendere possibile.

---

## 3. Che cosa deve fare `mss:query`

Un comando in **sola lettura**, `node scripts/mss/query.mjs`, registrato come `npm run mss:query`.

Legge tutte le capsule presenti nell'albero `HEAD` e nel working tree, e risponde a domande. Non
scrive niente, non modifica niente, non ripara i dati.

### Le cinque domande

| Opzione | Domanda | Trappola nota — leggila prima di implementare |
|---|---|---|
| `--regole` | Quali regole compaiono nelle capsule, con quali valori `G`/`O`/`E`, e **quante volte ciascuna** | ⚠️ `rule_id_version` **non è un identificatore, è una frase**. Valore reale: `"CFG-01 + Bussola#riga14b + mss.session/0.1.1 + CHIUSURA_SESSIONE"` — quattro regole in una stringa, con un solo `G`/`O`/`E`. **Non puoi attribuire quel punteggio a una regola.** Fai un **censimento onesto**, non una classifica: quante regole citate, quante una volta sola, quali stringhe sono multiple. Se vuoi una graduatoria, falla **solo** sul sottoinsieme di stringhe che nominano una regola sola, e dichiara quante ne hai escluse |
| `--modelli` | Quante **sedute** per provider, modello e superficie | ⚠️ Tre trappole. (a) I record sono ~4 per seduta: se conti i record ottieni numeri quadrupli — **deduplica per `session_id`**. (b) Lo stesso modello compare con **grafie diverse** (`Cursor Grok 4.5` e `Grok-4.5`): normalizza, e **dichiara nell'output** quali grafie hai unito. (c) Esistono **due** campi provider/modello: `recorded_by.agent_runtime` (chi ha *scritto* la capsula) e `event.subject_runtime` (chi era *osservato*, e vale `non_applicabile:*` in circa metà delle sedute). **Usa `recorded_by.agent_runtime`** per la domanda «le review erano indipendenti?», e riporta a parte quanto `subject_runtime` sia inutilizzabile |
| `--verifica` | Quante dichiarazioni sono `self_report`, quante `unverified`, quante di ogni altro valore. E: **chi ha verificato chi** | ⚠️ **Il valore `independently_verified` potrebbe non comparire mai.** La v1 di questo prompt lo dava per esistente: non lo è nei dati rilevati. Non inventare una mappatura per riempire quella colonna, e non far sparire la domanda. Se il conteggio è zero, **l'output deve dirlo a parole**: che quel valore non compare mai, e che `verified_by` è vuoto ovunque. **Un sistema autocertificato al 100% è una scoperta, non un buco nel tuo comando** |
| `--fail` | Tutti gli esiti negativi: `controls[].esito = fail`, e ogni altro segnale di esito negativo o chiusura invalidata | ⚠️ La v1 chiedeva anche i `contradicted`: quella stringa potrebbe non comparire in nessun record. Stessa regola di sopra — se è zero, **scrivi che è zero e che il valore non è mai stato usato**, non ometterlo. I `fail` veri invece esistono: il sistema promette di conservare il negativo, e qui si verifica se è vero |
| `--costo` | Per seduta: quanti controlli, quanti con numeratore/denominatore reali, quante sedute **senza** il campo `controls` | ⚠️ La v1 chiedeva anche «quanti file toccati»: **non esiste alcun campo strutturato** per i file toccati. È stato tolto dalla domanda. Se trovi un modo affidabile di ricavarlo, proponilo a Matteo — **non dedurlo dal testo libero** |

Senza opzioni: un riepilogo breve con i numeri principali e l'elenco delle domande disponibili.

### `--gate` — declassato, e va riportato lo stesso

La v1 chiedeva una sesta domanda: «ogni gate: quando è cambiato, per mano di chi, con quale prova».

**Non costruirla.** Nelle capsule **non esiste alcun campo strutturato di gate**: lo stato dei gate
vive in prosa dentro `open_items` e `observed_outcome`. Ricavarlo richiederebbe scavare nel testo
libero, e questo violerebbe la regola 4 qui sotto.

**Ma non lasciarla cadere in silenzio.** Nel report, in una riga esplicita: *la storia dei gate non è
interrogabile dalle capsule, perché lo schema non ha un campo per i gate* — ed è un difetto **dello
schema**, da valutare in `SK-4`, non un limite del tuo comando. Se durante il lavoro trovi che mi
sbaglio e un campo utilizzabile c'è, dillo: sarebbe una correzione benvenuta.

### Le regole non negoziabili

1. **Non inventare.** Se un campo manca in una capsula, il conteggio dice
   `presente in 32 capsule su 42`, non finge 42. Un dato assente è un dato valido; un dato inventato
   invaliderebbe la raccolta.
2. **Non riparare i dati.** Se trovi capsule malformate o incoerenti, **elencale** e vai avanti.
   Correggere una capsula storica è vietato (vedi §6).
3. **Dichiara ciò che non riesci a vedere,** nell'output del comando stesso. Il comando `mss:status`
   lo fa già: guarda come, e fai lo stesso.
4. **Nessun falso allarme.** Se un controllo produce anche un solo falso positivo, o lo restringi
   finché sparisce, o non lo consegni. «Inventare un problema invalida la raccolta tanto quanto
   nasconderlo.»
5. **Un valore che non compare mai è una risposta, non un buco.** Vale per
   `independently_verified`, per `contradicted`, e per qualunque altro campo previsto dal contratto
   e mai usato nella pratica. Contali a zero **e scrivi che sono a zero.**

---

## 4. Che cosa puoi riusare — e l'unico punto dove il codice esistente ti tradisce

| Cosa | Dove | A cosa ti serve |
|---|---|---|
| **Lettura delle capsule dall'albero git** | `scripts/mss/git-adapter.mjs`, funzione `collectGitHeadHistory()` | fa già `git ls-tree` su `docs/Sessioni di lavoro` e ricarica le capsule committate. **È il pezzo che ti risparmia più lavoro — ma leggi l'avviso qui sotto prima di usarlo** |
| Estrazione del blocco `jsonl` da un report `.md` | `scripts/mss/parse.mjs` | evita di riscrivere il parser |
| Le costanti di schema | `scripts/mss/rules.mjs` righe 3-6 | leggi la versione da lì, **mai a memoria** |
| Radice del repo robusta | `scripts/mss/status.mjs`, funzione `findRepoRoot()` | risale cercando `package.json`. **Usa questa**, non una risalita a numero fisso di livelli |
| Schema della capsula | `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | ⚠️ **leggi prima l'avviso in testa al file**: il titolo dice `0.1.0`, ma la versione viva è `0.1.1` |

### 🔴 `collectGitHeadHistory()` è cieca su 6 sedute su 42

Dentro quella funzione c'è il filtro `^docs/Sessioni di lavoro/[^/]+/Report-.*\.md$`. Quel `[^/]+`
significa **un solo livello di cartella**: qualunque report dentro una **sotto-cartella** è invisibile.

Misurato il 22-08: **42 file con capsula, 36 visti da quella funzione, 6 no** — tutti in
`docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/`.

Se la riusi così com'è, costruisci un lettore che legge **36 capsule e crede di averle lette tutte**.
È il modo più facile di violare la regola 1 senza accorgersene.

**Cosa devi fare:** nel **tuo file nuovo** `scripts/mss/query.mjs`, usa un filtro che accetti anche le
sotto-cartelle, e **dichiara nell'output quante capsule hai letto e da quanti file**.

**Cosa NON devi fare:** ⛔ **non toccare `scripts/mss/adapter.mjs`.** Lì lo stesso filtro governa il
perimetro del pre-commit, e allargarlo ci fa entrare 22 report in un colpo solo. È il pacchetto
`SK-4`, richiede una decisione di Matteo, e non è tuo.

> **Nota sul nome.** `collectGitHeadHistory` fa `git ls-tree HEAD`: è una **fotografia dell'albero
> attuale**, non la storia dei commit. Per le cinque domande va benissimo — ogni capsula porta già la
> propria data — ma se un report è stato cancellato o rinominato in passato, la sua capsula non c'è.
> Dichiaralo nell'output come limite noto.

---

## 5. Come si prova che hai finito

**Non basta che il comando giri.** Il criterio di chiusura di `SK-6` è:

```bash
npm run mss:query -- --regole
npm run mss:query -- --modelli
npm run mss:query -- --verifica
```

Le tre risposte devono essere **vere**, cioè verificabili a campione risalendo alle capsule di
origine. Nel report scegli **tre affermazioni** prodotte dal comando e dimostra ognuna aprendo il
report da cui viene il dato.

E devono restare verdi:

```bash
npm run test:mss        # 41 fixture cases + 32 gruppi
npm run validate        # lint + typecheck + test
```

> `npm run validate` è verde dal 21-08, per la prima volta nella vita del progetto. **Se lo rompi,
> fermati e ripara prima di proseguire.**

**Come si torna indietro se fallisce:** il tuo lavoro è un file nuovo più una riga in `package.json`.
`git revert` del tuo commit, oppure cancella `scripts/mss/query.mjs` e togli la riga. Nessun dato
viene toccato, quindi non c'è niente da recuperare.

---

## 6. Che cosa è vietato, e perché

| Divieto | Perché |
|---|---|
| **Non toccare `scripts/mss/adapter.mjs`** | il filtro `[^/]+` alla riga 13 governa il perimetro del pre-commit: allargarlo ci fa entrare 22 report insieme. È `SK-4` e richiede una decisione di Matteo |
| **Nessun `move` o `rename`** di file MSS | la suite delle prove è legata alla **profondità delle cartelle**, non solo ai nomi: `docs/MetaSkillSystem/tests/h1/run.mjs` risale un numero fisso di livelli. Si rompe anche facendo tutto il resto bene. La correzione è `SK-8`, non ancora aperta |
| **Non modificare né correggere le capsule storiche**, nemmeno quelle sbagliate | la provenienza è il patrimonio del sistema. Si corregge **aggiungendo**, mai sovrascrivendo |
| **Non cancellare le tracce dei fallimenti** | un archivio «pulito» sarebbe un archivio falso |
| **Non aprire `docs/_lavoro/`** | materiale personale. Puoi citarne i path, mai il contenuto |
| **Non dichiarare superato un gate** | `SEP-G5` **non** è PASS · `H-1.3` è `PASS_CON_RISERVE` (**non** PASS pulito) · `WP-1` è **NO-GO**. Puoi raccomandare, non dichiarare |
| **Non toccare `src/`, il database, le migrazioni** | è un prodotto con clienti veri, fuori perimetro |
| **Niente `push` senza un sì esplicito di Matteo** | il commit locale è reversibile, la pubblicazione no |
| **Niente git distruttivo** | no `reset --hard`, no `push --force`, no `stash drop`, no cancellazione di rami. **Ci sono 8 stash e alcuni contengono lavoro non replicabile** |
| **Non aprire altri pacchetti `SK-*`** | uno alla volta. Il tuo è `SK-6` |

---

## 7. Chi decide che cosa

- **Tu decidi:** come implementare, come strutturare l'output, quali campi aggregare, come normalizzare
  le grafie dei modelli, se una sesta domanda vale la pena.
- **Torna a Matteo per:** qualunque cosa che richieda di modificare un dato storico; l'esito della
  domanda «dalle 42 capsule esce qualcosa di utile o no»; l'apertura del pacchetto successivo.
- **Non decidere al posto suo:** l'ordine dei pacchetti dopo `SK-6`, e se `SK-6` è chiuso.

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
| 1 | *(comando)* `npm run mss:status` | dove sei, in una schermata |
| 2 | `docs/Sessioni di lavoro/21-08-26/STRATEGIA-scheletro-mss-21-08-26.md` §3.3 | la specifica di `mss:query` e perché viene per primo. ⚠️ descrive **sei** domande: questo prompt ne prescrive **cinque**, e vince questo |
| 3 | `docs/MetaSkillSystem/PLAN_V0.md` §16 | il target di Matteo e le decisioni D11-D15 |
| 4 | `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | lo schema della capsula — **avviso in testa prima di tutto** |
| 5 | `scripts/mss/git-adapter.mjs` + `scripts/mss/status.mjs` | il codice che riusi — **con il §4 di questo prompt sotto gli occhi** |
| 6 | `docs/Sessioni di lavoro/21-08-26/Report-consulenza-esterna-fable-mss-21-08-26.md` | il contesto completo di com'è nata questa fase. **Facoltativo** |
| 7 | `.claude/CLAUDE.md` e `docs/Comunicazione-Skill/VOCABOLARIO.md` | come ci si comporta su questo repo e il vocabolario di Matteo |

---

## 9. Backlog dichiarato — **NON** è il tuo compito

Registrato perché non vada perso. Verificato contro il repo il 22-08-2026: tutte le voci sono esatte.
Non toccarlo in questa seduta.

| ID | Cosa | Dove |
|---|---|---|
| `SK-4` | La coppia legacy `0.1.0`/`freeze-1` rende **opzionale** il campo `controls`. Il contratto va ri-versionato e il validator deve rifiutare la coppia legacy sui record **nuovi** | avviso già in testa a `CONTRATTO_CAPSULA_SESSIONE_V0.md` |
| `SK-4` | Un report in **sotto-cartella** è fuori dal perimetro del pre-commit (filtro `[^/]+`): 22 report reali. Anche il solo prefisso del nome basta a uscirne. **Lo stesso filtro rende cieca `collectGitHeadHistory()` — vedi §4** | `scripts/mss/adapter.mjs` riga 13 |
| `SK-4` | 10 sedute su 42 non hanno `event.controls`, e **solo 1 di queste usa lo schema legacy**: la porta di servizio legacy spiega un caso su dieci, gli altri 9 sono a schema corrente e nessuno li ha mai fermati | rilevato 22-08 |
| `SK-4` | Il messaggio dell'hook di fine sessione afferma che `_skill-system-v0/` è gitignored: **è tracciato**, 31 file (in radice, non sotto `docs/`) | `.claude/hooks/fine-sessione-senior.mjs` |
| `SK-2` | 17 path rotti residui: 14 in `docs/Console-Skill/**`, 3 che toccano il MSS (`docs/FOLLOW_UP.md:9` e due righe di `TIPO_SEDUTA_FANTASTICAZIONE_V0.md`) | `npm run validate:docs` |
| `SK-5` | Mettere `test:mss` e `validate:mss` in CI, e allargare il trigger a `env/test`. Oggi la CI gira **solo su `main`** e non contiene nulla di MSS | `.github/workflows/ci.yml` |
| `SK-1` | Non esiste alcun tag di ripristino: `git tag -l` è vuoto | — |
| — | Gli hook di Claude Code vivono in `.claude/settings.local.json`, che è **escluso da git**: quell'enforcement non esiste per nessun altro | rafforza `SK-5` |
| `D6`-`D10` | Decisioni sul riordino delle cartelle: **congelate** per decisione `D15` finché non esistono gli attrezzi | — |

---

## 10. Come chiudere

1. Scrivi un report in `docs/Sessioni di lavoro/<data di oggi>/Report-sk6-mss-query-<data>.md`.
   **Direttamente in quella cartella, non in una sotto-cartella:** una sotto-cartella esce dal
   perimetro dei controlli (è il bug `SK-4` qui sopra — non aggravarlo).
2. Il report deve contenere la sezione **`## Domande di chiusura`** con le sei righe `Q1`-`Q6`
   compilate, e la **capsula** in un blocco ` ```jsonl `. Il pre-commit blocca senza.
3. Verifica il tuo stesso report prima di committare:
   ```bash
   npm run validate:mss -- --mode file --file "<il tuo report>" --kind report --require-capsule
   ```
4. **Genera la capsula, non scriverla a memoria — ed ecco come, senza sforare dal mandato.**

   38 capsule su 42 hanno orari arrotondati a multipli di 5 minuti perché scritte a mano: **non
   aggiungere la trentanovesima.** Ma **non costruire un generatore di capsule come strumento del
   repo**: sarebbe un pacchetto a sé, e il tuo è `SK-6`.

   La via è la terza: **uno script usa-e-getta nella cartella temporanea di sessione**, non
   committato, che prende i valori dalla macchina — `crypto.randomUUID()` per gli id, l'orario reale
   di sistema per i timestamp, `git diff --name-only` per i file toccati, e l'output vero dei comandi
   che hai lanciato per gli esiti dei `controls`. Poi incolli il `JSONL` prodotto in fondo al report.
   Zero file nuovi nel repo oltre a `query.mjs`, zero orari inventati.

   Se ti sembra che valga la pena farne uno strumento stabile, **proponilo a Matteo come pacchetto
   successivo** — non costruirlo adesso.
5. Chiudi con **massimo cinque punti** per Matteo, in italiano concreto: il quadro in una frase · la
   tensione principale · la tua raccomandazione · che cosa non deve fare nessuno · il prossimo passo
   singolo.
6. **Commit sì, push solo con il suo sì.** Il pre-commit ti fermerà una volta con un controllo «a
   mente fredda»: leggilo davvero, poi rilancia lo stesso comando — il secondo tentativo identico
   passa.

---

## 11. Una nota sull'onestà

Questo sistema è costruito attorno a un'idea semplice: **distinguere ciò che è stato dichiarato da ciò
che è stato verificato.**

Sulle misurazioni del §2-bis, una in particolare ti riguarda da vicino: `verified_by` risulta **vuoto
in tutti e 169 i record**, e `independently_verified` non compare **mai**. Se il tuo comando conferma,
la risposta a `--verifica` è che **in 42 sedute nessuno ha mai verificato nessuno**. Scrivilo in
chiaro. È scomodo, riguarda anche le sedute che si sono dichiarate riuscite, ed è il genere di frase
che un sistema di governance esiste per rendere dicibile.

Se `mss:query` gira e le 42 capsule non producono niente di utile, **dillo**. È una risposta legittima,
è un risultato della seduta, e cambia la strategia — molto più di un comando elegante che stampa
tabelle vuote.

Se non riesci a stabilire qualcosa, **scrivi che non riesci** e spiega che cosa servirebbe. In questo
sistema è la risposta che nessuno si ricorda mai di dare.
