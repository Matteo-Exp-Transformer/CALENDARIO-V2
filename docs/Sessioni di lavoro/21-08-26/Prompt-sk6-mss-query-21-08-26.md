# Prompt — `SK-6` · costruire `mss:query`, il lettore delle capsule

> **Uso:** Matteo incolla questo prompt in una chat nuova. Da «Sei un agente senior» in giù.
> **Preparato da:** consulenza esterna `SEP-SES-20260821-039` (Claude Fable 5), 21-08-2026.
> **Scritto per essere eseguibile da chi non ha letto quella chat.**

---

Sei un **agente senior**. Hai un solo compito, e va chiuso con una prova, non con un'opinione.

---

## 1. Dove siamo — comincia da qui

**Primo comando della sessione, prima di leggere qualunque file:**

```bash
npm run mss:status
```

Ti stampa branch, `HEAD`, scarto da `origin`, stato di ogni cantiere e divieti attivi, derivandoli
dagli owner. Esiste da ieri ed è la ragione per cui non devi aprire dieci documenti per sapere dove
sei. Se un valore dice `non ricostruibile`, apri l'owner che ti indica — **non dedurlo**.

**Baseline tecnica:** commit `589822d` su `env/test`, allineato con `origin/env/test`.

**Stato in tre righe:** il MetaSkillSystem (MSS) è un sistema di regole su *come gli agenti AI
lavorano su questo repository*. Ha regole scritte bene e un validator che ne impone una parte. Da
ieri ha una direzione nuova, decisa da Matteo e scritta in `docs/MetaSkillSystem/PLAN_V0.md` §16:
**qualsiasi lavoro di un agente deve essere già raccolta dati, senza inventare contenuti.**

---

## 2. Il problema che devi risolvere

In 41 sedute il sistema ha scritto **41 capsule** — blocchi `JSONL` in fondo ai report, che registrano
chi ha fatto cosa, con quale autorizzazione, con quali prove e con quale stato di verifica.

**Quelle 41 capsule non sono mai state interrogate da nessuno.** Una macchina le rilegge, ma solo per
impedire che il passato venga riscritto. Nessun essere umano e nessun agente le ha mai usate per
rispondere a una domanda.

Finché è così, la raccolta dati non ha un consumatore: si riempie un archivio che nessuno apre.

**Il tuo compito è costruire il lettore.** Si chiama `mss:query`, e gira sulle **41 capsule che già
esistono** — non chiede di raccoglierne di nuove.

> **Perché questo prima di tutto il resto.** Se dalle 41 capsule esistenti non esce niente di utile,
> è un'informazione preziosa e la ottieni spendendo un comando, **prima** di automatizzare la
> raccolta. Se invece ne esce qualcosa, hai la prova che il resto dello scheletro vale la pena.
> Un esito negativo qui è un risultato valido, non un fallimento: **riportalo come tale.**

---

## 3. Che cosa deve fare `mss:query`

Un comando in **sola lettura**, `node scripts/mss/query.mjs`, registrato come `npm run mss:query`.

Legge tutte le capsule dalla storia git e dal working tree, e risponde a domande. Non scrive niente,
non modifica niente, non ripara i dati.

### Le sei domande minime

| Opzione | Domanda | Perché serve |
|---|---|---|
| `--regole` | Quali regole compaiono nelle capsule, e con quali valori `G`/`O`/`E`? Ordinate dal **più debole dei tre**. | Per una regola critica vale il minimo, mai la media. Serve a vedere dove la governance è solo un desiderio |
| `--modelli` | Quante sedute per provider, modello e superficie? | Serve a sapere se le review erano davvero indipendenti |
| `--verifica` | Quante dichiarazioni sono `self_report` e quante `independently_verified`? Chi ha verificato chi? | Quanto del sistema è autocertificato |
| `--gate` | Ogni gate: quando è cambiato, per mano di chi, con quale prova | La storia dei verdetti senza rileggere 54 report |
| `--fail` | Tutti gli esiti negativi, le chiusure invalidate e i `contradicted` | Il sistema promette di conservare il negativo: verifica che sia vero e rendilo consultabile |
| `--costo` | Per seduta: quanti controlli, quanti con esito reale, quanti file toccati | È il dato che oggi non esiste e che serve a capire se la cerimonia è sostenibile |

Senza opzioni: un riepilogo breve con i numeri principali e l'elenco delle domande disponibili.

### Le regole non negoziabili

1. **Non inventare.** Se un campo manca in una capsula, il conteggio dice
   `presente in 28 capsule su 41`, non finge 41. Un dato assente è un dato valido; un dato inventato
   invaliderebbe la raccolta.
2. **Non riparare i dati.** Se trovi capsule malformate o incoerenti, **elencale** e vai avanti.
   Correggere una capsula storica è vietato (vedi §6).
3. **Dichiara ciò che non riesci a vedere,** nell'output del comando stesso. Il comando `mss:status`
   lo fa già: guarda come, e fai lo stesso.
4. **Nessun falso allarme.** Se un controllo produce anche un solo falso positivo, o lo restringi
   finché sparisce, o non lo consegni. «Inventare un problema invalida la raccolta tanto quanto
   nasconderlo.»

---

## 4. Che cosa puoi riusare — non ripartire da zero

| Cosa | Dove | A cosa ti serve |
|---|---|---|
| **Lettura delle capsule dalla storia git** | `scripts/mss/git-adapter.mjs`, funzione `collectGitHeadHistory()` | fa già `git ls-tree` su `docs/Sessioni di lavoro` e ricarica tutte le capsule committate. **È il pezzo che ti risparmia più lavoro** |
| Estrazione del blocco `jsonl` da un report `.md` | `scripts/mss/parse.mjs` | evita di riscrivere il parser |
| Le costanti di schema | `scripts/mss/rules.mjs` righe 3-6 | leggi la versione da lì, **mai a memoria** |
| Radice del repo robusta | `scripts/mss/status.mjs`, funzione `findRepoRoot()` | risale cercando `package.json`. **Usa questa**, non una risalita a numero fisso di livelli |
| Schema della capsula | `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | ⚠️ **leggi prima l'avviso in testa al file**: il titolo dice `0.1.0`, ma la versione viva è `0.1.1` |

---

## 5. Come si prova che hai finito

**Non basta che il comando giri.** Il criterio di chiusura di `SK-6` è:

```bash
npm run mss:query --  --regole
npm run mss:query --  --modelli
npm run mss:query --  --verifica
```

Le tre risposte devono essere **vere**, cioè verificabili a campione risalendo alle capsule di
origine. Nel report scegli **tre affermazioni** prodotte dal comando e dimostra ognuna aprendo il
report da cui viene il dato.

E devono restare verdi:

```bash
npm run test:mss        # 41 fixture + 32 gruppi
npm run validate        # lint + typecheck + test
```

> `npm run validate` è verde da ieri, per la prima volta nella vita del progetto. **Se lo rompi,
> fermati e ripara prima di proseguire.**

**Come si torna indietro se fallisce:** il tuo lavoro è un file nuovo più una riga in `package.json`.
`git revert` del tuo commit, oppure cancella `scripts/mss/query.mjs` e togli la riga. Nessun dato
viene toccato, quindi non c'è niente da recuperare.

---

## 6. Che cosa è vietato, e perché

| Divieto | Perché |
|---|---|
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

- **Tu decidi:** come implementare, come strutturare l'output, quali campi aggregare, se una settima
  domanda vale la pena.
- **Torna a Matteo per:** qualunque cosa che richieda di modificare un dato storico; l'esito della
  domanda «dalle 41 capsule esce qualcosa di utile o no»; l'apertura del pacchetto successivo.
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
| 2 | `docs/Sessioni di lavoro/21-08-26/STRATEGIA-scheletro-mss-21-08-26.md` §3.3 | la specifica di `mss:query` e perché viene per primo |
| 3 | `docs/MetaSkillSystem/PLAN_V0.md` §16 | il target di Matteo e le decisioni D11-D15 |
| 4 | `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | lo schema della capsula — **avviso in testa prima di tutto** |
| 5 | `scripts/mss/git-adapter.mjs` + `scripts/mss/status.mjs` | il codice che riusi |
| 6 | `docs/Sessioni di lavoro/21-08-26/Report-consulenza-esterna-fable-mss-21-08-26.md` | se vuoi il contesto completo di com'è nata questa fase. **Facoltativo** |
| 7 | `.claude/CLAUDE.md` e `docs/Comunicazione-Skill/VOCABOLARIO.md` | come ci si comporta su questo repo e il vocabolario di Matteo |

---

## 9. Backlog dichiarato — **NON** è il tuo compito

Registrato perché non vada perso. Non toccarlo in questa seduta.

| ID | Cosa | Dove |
|---|---|---|
| `SK-4` | La coppia legacy `0.1.0`/`freeze-1` rende **opzionale** il campo `controls`. Il contratto va ri-versionato e il validator deve rifiutare la coppia legacy sui record **nuovi** | avviso già in testa a `CONTRATTO_CAPSULA_SESSIONE_V0.md` |
| `SK-4` | Un report in **sotto-cartella** è fuori dal perimetro del pre-commit (filtro `[^/]+`): 22 report reali. Anche il solo prefisso del nome basta a uscirne | `scripts/mss/adapter.mjs` riga 13 |
| `SK-4` | Il messaggio dell'hook di fine sessione afferma che `_skill-system-v0/` è gitignored: **è tracciato**, 31 file | `.claude/hooks/fine-sessione-senior.mjs` |
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
4. **Genera la capsula, non scriverla a memoria.** UUID, orari, runtime, file toccati ed esiti dei
   comandi vengono dalla macchina. 38 capsule su 41 hanno orari arrotondati a multipli di 5 minuti
   perché scritte a mano: **non aggiungere la trentanovesima.** Un prototipo di generatore è
   descritto in `STRATEGIA-scheletro-mss-21-08-26.md` §3.4.
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

Se `mss:query` gira e le 41 capsule non producono niente di utile, **dillo**. È una risposta legittima,
è un risultato della seduta, e cambia la strategia — molto più di un comando elegante che stampa
tabelle vuote.

Se non riesci a stabilire qualcosa, **scrivi che non riesci** e spiega che cosa servirebbe. In questo
sistema è la risposta che nessuno si ricorda mai di dare.
