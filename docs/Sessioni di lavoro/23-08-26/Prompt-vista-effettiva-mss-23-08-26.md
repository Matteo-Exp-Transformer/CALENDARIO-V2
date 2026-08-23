# Mandato — far vedere al lettore le rettifiche che l'archivio già contiene

```
Profilo: Esecuzione
Modalità: deep
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md · docs/MetaSkillSystem/PLAN_V0.md (§4-bis, §15, §16) · docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md (§5 e §6)
Non caricare: APP_CONTEXT_SKILL.md intero (non è un task d'area app) · docs/_lavoro/ (vietato) · src/ (fuori cantiere)
```

> **Data:** 23-08-26 · **ramo:** `env/test` · **HEAD atteso all'apertura:** `473bd51`
> **Seduta a sé.** Un solo lavoro, con un difetto già provato da un revisore indipendente.

---

## 1. Prima di leggere qualsiasi altra cosa

```bash
npm run mss:status
```

Ti dice dove sei in una schermata. **Se `HEAD` non è `473bd51`, fermati e dillo:** qualcosa è
cambiato sotto di te e questo mandato va riletto prima di eseguirlo.

Poi, per capire cosa stai per toccare — e perché *questo* comando esiste:

```bash
npm run mss:query -- --verifica
```

Leggi tutta la schermata, in particolare il blocco **«Limite strutturale — vista grezza, non
effettiva»**. Quel blocco descrive **esattamente il difetto che devi chiudere**. È stato scritto da
chi non ha potuto chiuderlo, perché era fuori dal suo mandato.

---

## 2. Chi sei, e cosa questo mandato NON è

Sei l'**agente senior esecutore**. Il cantiere si chiama **MetaSkillSystem** (MSS) e serve a rendere
**verificabile** il lavoro degli agenti su questo repo.

**Non è `SK-7`.** Non scrivere il generatore di capsule (`mss:capsule`): ha un mandato suo, pronto in
`docs/Sessioni di lavoro/22-08-26/Prompt-sk7-mss-capsule-22-08-26.md`, e **va dopo**, non adesso.
**Non è `SK-4`.** Non allargare il perimetro del pre-commit, non toccare `adapter.mjs`.

⚠️ **Che numero di pacchetto sia questo lo decide Matteo**, non tu: `PLAN_V0` §15 punto 3 lascia
aperto se rientri in `SK-4` o meriti un pacchetto tuo. **Non assegnarti un numero.** Se Matteo non ha
aperto nulla, chiediglielo prima di scrivere codice.

---

## 3. La regola che governa tutto il cantiere

**Non inventare, non aggiustare i numeri, dichiarare ciò che non riesci a vedere.** Un dato mancante
è una risposta («presente in 32 casi su 42»), non un buco da riempire. Un valore che non compare mai
è una risposta: contalo **e scrivi che è zero**.

**Hai il permesso esplicito di fallire.** Un difetto misurato e lasciato aperto **con la sua ragione
scritta** vale più di una correzione che sposta il problema altrove. Se a metà scopri che il lavoro
non si può fare come descritto qui, **dillo e fermati**: è un esito valido, e va riportato come tale.

**Nessun falso allarme.** Se un controllo che scrivi produce anche un solo falso positivo, o lo
restringi finché sparisce, o non lo consegni.

---

## 4. Il lavoro — il sistema sa registrare cose che non sa rileggere

### Il fatto, già provato

Il contratto (`CONTRATTO_CAPSULA_SESSIONE_V0.md` §6) stabilisce che un record `final` **non si
modifica e non si cancella**: la rettifica **aggiunge** un record `amendment`, e una vista corretta
**applica la catena** ordinata per `effective_at` per ricostruire lo stato effettivo.

Il 22-08-26 un revisore indipendente di famiglia di modello diversa ha fatto la **prima rettifica
reale nella storia di questo sistema**: ha marcato un'annotazione `independently_verified` e una
`contradicted`. Sono valide — `validate:mss` passa.

**`mss:query` non le vede.** Legge gli stati **grezzi** e non applica mai la catena. Quindi stampa
`independently_verified 0` e `contradicted 0` mentre la vista effettiva vale **1 e 1**.

La prima verifica indipendente della storia del sistema **è invisibile al lettore costruito per
trovarla**. Finché resta così, ogni misura futura di «questa affermazione è stata verificata?» è
sbagliata, e il meccanismo di rettifica esiste ma non serve a nessuno.

### Cosa devi fare

Fare in modo che `mss:query` presenti la **vista effettiva**, applicando le catene di `amendment`
come prescrive il contratto §6.

### Da dove partire — la logica esiste già, non inventarla

⚠️ **Leggi `scripts/mss/core.mjs` righe ~695-760 prima di scrivere una riga.** Il validator **già
applica** gli amendment: ordina per `effective_at`, raggruppa per lotti, risolve `target_record_id`,
naviga `changes[].field_path` e rileva intenti in conflitto sullo stesso bersaglio. Studia quella
logica e **riusala o allineati a essa**. Due implementazioni divergenti della stessa regola nello
stesso repo sono un difetto peggiore di quello che stai chiudendo.

Vincoli del contratto che quella logica già rispetta, e che devi rispettare anche tu:

| Vincolo | Dove |
|---|---|
| si applicano solo amendment con `finalization: "final"` | `core.mjs` ~702-704 |
| ordinamento per `effective_at`, con `record_id` come spareggio deterministico | `core.mjs` ~705-712 |
| solo `relation: "amends"` porta un payload applicabile; `supersedes` **no** | `core.mjs` ~448-455, ~725 |
| il bersaglio deve esistere ed essere `final` | `core.mjs` ~726-727 |
| `field_path` è un percorso di campo con una regex sua, non prosa | `core.mjs` ~676 |

### Le due domande da risolvere, e sono di progetto

1. **Grezzo e effettivo devono convivere.** Non sostituire i conteggi grezzi con quelli effettivi:
   la differenza fra i due **è essa stessa un dato** — dice quante rettifiche sono state fatte e
   quanto cambiano il quadro. Decidi tu come mostrarli entrambi; **dichiara la scelta in output.**
2. **Cosa fa il comando quando una catena non si risolve** (bersaglio assente, `field_path` che non
   punta a nulla, due amendment in conflitto sullo stesso campo). ⛔ **Non silenziarlo e non
   ripararlo**: mostralo. Un archivio che nasconde le proprie incoerenze è il difetto che questo
   cantiere esiste per impedire.

### Obblighi dopo la modifica, non negoziabili

1. **Il blocco «Limite strutturale» oggi dichiara un limite che tu stai togliendo.** Se lo lasci com'è
   afferma il falso, e il difetto si sposta invece di chiudersi. Riscrivilo per dire cosa il comando
   fa **adesso** — e quale limite **resta**, se ne resta uno.
2. **Aggiorna anche `--json`**, non solo il testo. Chi consuma il JSON deve vedere la stessa verità di
   chi legge lo schermo: `--json` esiste perché gli attrezzi futuri non debbano ri-parsare il testo.
3. **Stampa e guarda l'elenco completo** di ciò che la nuova vista cambia rispetto al grezzo. Se
   cambia qualcosa che non sai spiegare, non consegnare: capiscilo prima.

---

## 5. Trappole già pagate da altri — non ripagarle

Ognuna di queste è costata tempo vero nelle sedute del 21 e 22 agosto.

| Trappola | Cosa succede | Come si evita |
|---|---|---|
| **Congelare un numero mobile** in un documento | il conteggio dei revisori è passato da 6/3 a 19/5 a 24/6 in poche ore; scritto in un `.md` era già falso | nei documenti scrivi il **fatto stabile** e **data la misura**; per il numero di oggi si lancia il comando |
| **`npm` su Windows è `npm.cmd`** | `execFileSync` senza `shell: true` lancia `ENOENT`, e se converti l'errore in exit≠0 registri **`fail` su comandi che passano** | un controllo falso invalida la raccolta quanto uno omesso: leggi l'exit code vero |
| **`npm run validate` verde non dice nulla** su questi file | `lint` gira `--ext ts,tsx` e **ignora `scripts/`**; `test:mss` esercita il validator, non il lettore | usa `node --check`, e non citare `validate` come prova del tuo lavoro |
| **Larghezza di colonna scritta a memoria** | `pad(x, 34)` con un id di 36 caratteri incolla il nome al numero. **Stessa classe di bug comparsa tre volte in un giorno** | calcola la larghezza **dai dati**, mai a memoria |
| **`crypto.randomUUID()` è v4** | gli id MSS vogliono **UUIDv7** (`rules.mjs` righe ~125-131): nibble di versione `7`, variante `[89ab]` | genera v7, o il validator ti rifiuta |
| **`segment_no` dev'essere identico** in tutto il bundle | scrivere `2` per «secondo segmento» fa fallire `validate:mss` (`core.mjs` ~966-971) | resta `1`; il secondo segmento lo racconti in `reason` |

---

## 6. Perimetro e divieti — con il motivo accanto, così non si aggirano per distrazione

| Divieto | Perché |
|---|---|
| **Non toccare `scripts/mss/adapter.mjs`** | è il perimetro del pre-commit: allargarlo fa entrare **22 report** insieme. È `SK-4`, decide Matteo |
| **Non modificare né correggere le capsule storiche**, nemmeno quelle sbagliate | sono `final`, e la provenienza è il patrimonio del sistema. Si corregge **aggiungendo**, mai sovrascrivendo |
| **Non cancellare le tracce dei fallimenti** | un `fail` conservato vale più di un verde inventato |
| **Nessun `move` o `rename`** di file MSS | la suite risale un numero fisso di livelli e si rompe. La correzione è `SK-8`, non aperta |
| **Nessun `commit` e nessun `push`** senza un sì esplicito di Matteo | ci sono **2 commit locali mai pubblicati** (`5b2c7db`, `473bd51`): è una scelta, non una dimenticanza |
| **Niente git distruttivo** — no `reset --hard`, no `push --force`, no `stash drop`, no rami cancellati | ci sono **8 stash** e alcuni contengono lavoro non replicabile |
| **Non aprire `docs/_lavoro/`** | materiale personale. Puoi citarne i path, mai il contenuto |
| **Non toccare `src/`, il database, le migrazioni** | fuori cantiere |
| **Non dichiarare superato un gate** | `SEP-G5` **non** è PASS · `H-1.3` è `PASS_CON_RISERVE` (**non** PASS pulito) · `WP-1` è **NO-GO** |
| **Non dichiarare chiuso `SK-6`** né alcun pacchetto | la chiusura è **decisione di Matteo** e non è stata presa |

**Puoi scrivere in:** `scripts/mss/query.mjs` · `docs/MetaSkillSystem/PLAN_V0.md` ·
`docs/Sessioni di lavoro/23-08-26/**`.

---

## 7. Prove di chiusura — esegui il comando e riporta l'esito vero

Nessuna vale se dichiarata a memoria.

1. `node --check scripts/mss/query.mjs` → **exit 0**
2. `npm run test:mss` → **exit 0**
3. `npm run validate:mss -- --mode file --file "<il tuo report>" --kind report --require-capsule` → **OK**
4. `npm run mss:query -- --verifica` → la vista effettiva mostra le rettifiche esistenti, **e si
   distingue dal grezzo**
5. `npm run mss:query -- --json` → contiene la stessa verità del testo
6. **Prova negativa:** `git status --porcelain` non mostra **nessuna capsula di altra seduta**
   modificata. Se compare un `Report-*.md` che non è il tuo, hai sforato
7. **Prova di non-regressione:** `npm run validate:docs` → **17 link rotti**, la baseline. Se sono
   di più, ne hai introdotto uno

---

## 8. La capsula della tua seduta

Il report va in `docs/Sessioni di lavoro/23-08-26/`, nome `Report-*.md`, e chiude con la capsula in
un blocco ` ```jsonl `. **Leggi schema e revisione da `scripts/mss/rules.mjs`** (righe 3-6), non
copiarli da nessun documento: il contratto in un punto istruisce a scrivere la coppia *legacy*, che è
un bypass noto.

- I `controls` devono avere **codici di uscita veri**: lancia il comando, leggi l'exit code, scrivilo.
- Gli orari con **secondi reali**, presi dall'orologio nel momento in cui scrivi. Niente `:00`.
- `verification.status` resta **`self_report`**: tu sei l'autore, non il verificatore.
  ⛔ **Non scrivere `independently_verified` su te stesso.**
- Il report chiude con la sezione **«Domande di chiusura»** (`docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md`
  §11): sei domande nel formato `❓ Q… / ✅ R…`. Per Q2 (dati = diff) e Q3 (file correlati) **rileggi
  il diff vero** prima di rispondere.

---

## 9. Backlog fuori perimetro — elencato perché non si perda, vietato toccarlo adesso

| Pacchetto | Debito |
|---|---|
| `SK-4` | la coppia schema legacy rende **opzionale** `controls`: `validate:mss` dice OK su una capsula senza prove |
| `SK-4` | un report in **sotto-cartella** è fuori dal perimetro del pre-commit: **22 report reali**, e fra questi una **seduta di revisione** |
| `SK-4` | basta cambiare il **prefisso del nome** (`Verbale-` invece di `Report-`) per uscire dal perimetro |
| `SK-4` | `rule_id_version` è testo libero; lo schema **non ha alcun campo per i gate** né per i file toccati |
| `SK-11` | gli attrezzi `mss:*` non hanno **un solo test** |
| `SK-5` | la CI gira **solo su `main`** e non contiene nulla di MSS |
| `SK-7` | `mss:capsule` — mandato già pronto, va **dopo** questo lavoro |
| `SK-1` | non esiste alcun tag di ripristino: `git tag -l` è vuoto |
| `D14` | `ROADMAP`, `HANDOFF` e indice report **dovevano diventare generati**: il generatore non esiste, sono ancora a mano |
| — | il messaggio dello stop hook **afferma il falso** su `_skill-system-v0/`: dice gitignored, sono **31 file tracciati** |

---

## 10. Decisioni che restano di Matteo — non prenderle tu

1. Se **`SK-6` è chiuso** (l'attrezzo esiste, i cancelli sono verdi, una revisione indipendente lo ha
   esaminato — manca solo la dichiarazione).
2. Se questo lavoro è **`SK-4`** o un **pacchetto nuovo**, e con che numero.
3. Se **pubblicare** i due commit locali.
4. Se il vincolo di **cambio famiglia di modello** (`PLAN_V0` §16.3) va approvato o resta **proposta**:
   oggi il file lo etichetta testualmente «proposto, da approvare», e `D13` lo ha reso **avviso, non
   blocco**. ⛔ Non citarlo come regola già chiusa.

---

## 11. Nota sull'indipendenza della revisione

Il 22-08-26 una famiglia di modello **diversa** ha revisionato il lavoro dell'autore e **ha trovato
difetti che l'autore non aveva visto** — incluso proprio quello che questo mandato ti chiede di
chiudere. Su cinque review condotte prima, **una sola** aveva davvero cambiato famiglia.

Se Matteo farà revisionare anche questa seduta, quella review conta come indipendente **solo se gira
su una famiglia di modello diversa dalla tua**. Dichiara nella capsula quale sei, così chi verrà dopo
può misurarlo invece di doverlo dedurre.
