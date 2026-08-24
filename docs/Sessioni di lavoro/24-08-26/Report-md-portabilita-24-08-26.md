# Report `M-D` — portabilità del motore MSS (`P1` / `R8`) — 24-08-2026

**Modalità:** deep
**Branch:** `env/test` · **HEAD invariato:** `3d209ee68a612d03d233aa9ccbe644af2ca037c0` · nessun commit, nessun push, nessun tag
**Esito in una riga:** `R8` è **PROVATO** — export parametrico, intervista, checklist di primo run, e una repo vergine in cui una seduta è stata davvero chiusa.

## 2. Cosa è stato fatto

Il mandato diceva la cosa giusta: il motore non ha dipendenze npm esterne, quindi l'export non è
packaging. Tutto il costo di `R8` stava nei path cablati. Il lavoro è stato renderli parametrici
**senza cambiare il comportamento di questa repo**, e poi provare la procedura.

**1. Una sola fonte di configurazione.** `scripts/mss/config.mjs` è ora l'owner unico dei path che
l'*installazione* possiede: `sessionsDir`, `reportKinds`, `owners.plan`, `owners.pack`. Si legge da
`mss.config.json` nella root, **se c'è**. Se non c'è, i default sono identici ai valori cablati
prima — questa repo non ha nessun `mss.config.json` e non ne avrà bisogno. Se invece il file c'è
**ed è rotto**, il motore *lancia*: ricadere sui default in silenzio farebbe validare la cartella
sbagliata dicendo verde, che è il falso verde di `R2`.

**2. Che cosa NON è diventato parametrico, e perché.** La cartella delle fixture resta una costante
del motore (`FIXTURES_ROOT`), non una chiave di config: la suite H-1 le inchioda per sha256 e ne cita
il path in decine di asserzioni, quindi una manopola che `test:mss` non può seguire sarebbe **una
falsa possibilità, peggio di nessuna**. È comunque salita in `config.mjs` per avere un solo owner
(`D18`): prima era riscritta quattro volte in `adapter.mjs`. L'eccezione storica per sha256 in
`parse.mjs` non è stata toccata, come da mandato.

**3. L'intervista + la checklist di primo run.** `MANUALE_AVVIO.md` guadagna un **passo 0** (installa
il motore, rispondi a tre domande) e un **passo 10** (`npm run mss:doctor`). `mss:doctor` è la
checklist: dice per ogni passo *che cosa prova* e com'è andata. Due passi sono prove **attive**, non
osservazioni — «perimetro» controlla che la regex segua la config in **entrambe** le direzioni,
«sa dire di no» dà al validator un report che *deve* essere rifiutato: un motore inerte passerebbe
qualunque conteggio e cadrebbe lì. E **un corpus vuoto è un FAIL**: «zero record, tutto ok» è il
falso verde che `R2` vieta e la stessa forma di `N4`.

**4. L'export.** `npm run mss:export -- --to <dir>` copia il motore. Non c'è nessuna seconda copia
dei moduli dentro `_skill-system-v0/` — sarebbero due sorgenti della stessa regola che divergono al
primo fix (`D18`). L'elenco di `scripts/mss/*.mjs` si **scopre leggendo la cartella**, così un
modulo nuovo entra da solo; e dopo la copia il comando risolve ogni import relativo dei file copiati
e **esce rosso** se manca un pezzo. Nessun `move`, nessuna rinomina (`D15`): solo copie.

### Le tre cose che la repo vergine ha insegnato (e che sono state corrette)

La prova ha trovato tre difetti che a tavolino non si vedevano.

- **La suite H-1 non era portabile, e falliva in modo bugiardo.** Alcuni gruppi non provano il
  motore: provano che *questa* repo ha certi file (report storici inchiodati, guardie PROD con i ref
  di questo progetto, hook cablati nell'IDE). Altrove fallivano dicendo «motore rotto» quando la
  verità era «questa non è la repo sorgente». Ora entrambe le suite dichiarano le proprie **ancore di
  progetto**: se l'ancora manca il gruppo esce `n/a` **col nome dell'ancora**, mai saltato in
  silenzio e mai contato come verde. E se non restasse in piedi nessun gruppo, la suite esce rossa —
  una suite che non esegue niente non è verde.
- **`buildStatusReport` leggeva gli owner dalla config mentre riceveva i testi dal chiamante.** Le
  due cose potevano contraddirsi: testo presente, owner dichiarato assente, sezione muta. Ora il
  render è funzione dei suoi argomenti (`planOwner`/`packOwner` si passano).
- **`validate:docs` restava rosso per sempre nella repo ospite.** I `.md` del motore copiati citano
  path dell'albero di origine, e l'unica «cura» sarebbe stata gonfiare l'allowlist — cioè
  esattamente ciò che `D21` vieta. L'export scrive un marcatore `.mss-vendored` e `check-doc-paths`
  salta le cartelle che lo contengono. **In questa repo il marcatore non esiste: non cambia una riga.**

## 3. File toccati e perché

| File | Perché |
|---|---|
| `scripts/mss/config.mjs` **(nuovo)** | owner unico dei path d'installazione; default = valori cablati prima |
| `scripts/mss/doctor.mjs` **(nuovo)** | checklist di primo run; rossa su corpus vuoto, due prove attive |
| `scripts/mss/export-kit.mjs` **(nuovo)** | copia il motore + controllo di chiusura sugli import |
| `scripts/mss/adapter.mjs` | `REPORT_PATH_RE` e le costanti fixture derivano da `config.mjs`; resta esportato da qui |
| `scripts/mss/query.mjs` | `SESSIONI` dalla config; anche la riga di help dichiara il perimetro configurato |
| `scripts/mss/git-adapter.mjs` | l'array di discovery `ls-tree` usa config + `FIXTURES_ROOT` |
| `scripts/mss/report-paths.mjs` | regex sotto-path e `dayPath` dalla config |
| `scripts/mss/status.mjs` | owner dalla config; `pack` può essere `null`; render puro nei suoi argomenti |
| `scripts/check-doc-paths.mjs` | salta le cartelle con marcatore `.mss-vendored` |
| `package.json` | due script: `mss:doctor`, `mss:export` |
| `docs/MetaSkillSystem/tests/h1/run.mjs` | path di seduta sintetici dalla config; ancore di progetto dichiarate e gruppi `n/a` |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | idem + **sei test nuovi** (§4); runner che attende i test async |
| `_skill-system-v0/MANUALE_AVVIO.md` | passo 0 (installa + intervista) e passo 10 (checklist di primo run) |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | §2.4-bis/§2.4-ter (i due comandi nuovi), §7 riscritta |

**Fuori perimetro, non toccati:** `PLAN_V0.md`, `src/**`, migrazioni, Supabase, `parse.mjs`, le tre
copie di `guard-prod` (`A2`), gli hook di `.cursor/` e `.claude/`.

## 4. Test eseguiti e risultato

Sei test nuovi in `docs/MetaSkillSystem/tests/tools/run.mjs`, ognuno col difetto nel nome:

| Test | Difetto che nomina | Perché non è vacuo |
|---|---|---|
| `R8 — senza mss.config.json il perimetro e IDENTICO al valore cablato prima di R8` | `R8` / «default = comportamento attuale» | confronta con la **stringa storica** letterale, non con un ricalcolo della stessa formula |
| `R8 — una sessionsDir diversa sposta il perimetro in ENTRAMBE le direzioni` | `R8` (parametrizzazione finta) | non basta che accetti il path nuovo: asserisce che **rifiuta** il vecchio e i prefissi non dichiarati |
| `R8 — un mss.config.json rotto e ROSSO, non un default silenzioso` | `R2` (falso verde) | otto asserzioni di rifiuto distinte (chiave ignota, path assoluto, risalita, vuoto, prefissi con metacaratteri, owner ignoto) + `pack: null` che deve restare **legittimo** |
| `R8 — mss:export dichiara INCOMPLETO un motore a cui manca un modulo` | `R8` (export che va stale) | costruisce un motore monco e pretende il rilevamento; poi verifica che l'export reale **non** dia falsi allarmi |
| `R2 — mss:doctor e ROSSO su un corpus vuoto: «zero record» non e un verde` | `R2`, forma di `N4` | asserisce `FAIL` su `corpus`/`cartelle dichiarate`/`motore` **e `ok` sulle due prove attive**: senza questo non distinguerebbe «repo vuota» da «doctor rotto» |
| `R8 — validate:docs salta il materiale vendorizzato SOLO col marcatore, mai per caso` | `R8` + `D21` | prova sull'albero **reale** nei due versi: senza marcatore il link rotto è rosso, col marcatore verde |

Comandi eseguiti, esito reale:

| Comando | Esito |
|---|---|
| `npm run validate:mss:all` | **verde** (`test:mss` + `test:mss:tools` + `validate:docs`) |
| `npm run validate` | **exit 0**, senza configurare nulla |
| `npm run mss:status` | esce 0; `HEAD 3d209ee`, `origin allineato`, stash invariati |
| `npm run mss:query -- --verifica` | esce 0; conteggi calcolati dal corpus al momento del run |
| `npm run mss:doctor` | **exit 0**, tutti i passi verdi in questa repo |
| `npm run validate:mss -- --mode file --file "<questo report>" --kind report --require-capsule` | eseguito **a mano**: il path contiene spazi e `N3` non lo trasporta in `--check` |

I conteggi non sono citati come valori: si rileggono coi comandi. `git diff --stat` per l'elenco reale.

**Che cosa è registrato nei `controls[]` e che cosa no, con onestà su `N3` e `N4`.** Nei `controls[]`
stanno i quattro comandi **senza path con spazi**: `validate:mss:all`, `mss:doctor`, `mss:status`,
`mss:query -- --verifica`. `npm run validate` e il `validate:mss` su questo report sono stati eseguiti
**a mano** (il secondo ha un path con spazi: `N3` lo spezzerebbe e registrerebbe un `fail` che parla
della propria sintassi). Dei quattro registrati, **due sono capaci di fallire** — `validate:mss:all` e
`mss:doctor` — e sono quelli che portano il peso della prova; `mss:status` e `mss:query` sono
quasi-infallibili, quindi il loro `pass` dimostra che il comando gira, non che l'esito sia giusto.
È il limite `N4`, dichiarato invece che nascosto.

## 4-bis. La prova di §2.3 — repo vergine — **FATTA**

In `/c/tmp/mss-r8-prova-24-08`, fuori dal repo, con `git init`. **La cartella delle sedute e l'owner
sono stati deliberatamente rinominati**: un export che funziona solo coi nomi di casa non proverebbe
niente. Config della repo ospite: `sessionsDir` = `registro/sedute`, `owners.plan` = `registro/PIANO.md`,
`owners.pack` = `null`.

Sequenza e esiti reali:

1. `node scripts/mss/export-kit.mjs --to /c/tmp/mss-r8-prova-24-08` → exit 0, «chiusura verificata».
2. `git init` + `mss.config.json` + creazione di `registro/sedute/` e `registro/PIANO.md`.
3. `node scripts/mss/doctor.mjs` → **exit 1**, un solo passo rosso: `corpus`. Tutto il resto verde.
   **È l'esito corretto**: nessuna seduta chiusa, quindi niente da leggere.
4. `npm run validate:mss:all` → verde, con i gruppi ancorati dichiarati `n/a` per nome
   (`hook-stop-cursor`, `sedute-storiche`, `guardie-e-hook-di-progetto`, `owner-di-progetto`).
5. Seduta chiusa davvero: report in `registro/sedute/24-08-26/`, capsula generata con
   `mss:capsule --judgments … --append-to …`. **L'attrezzo ha rifiutato due volte prima di scrivere**
   (assertion Persona vuota; `owner_refs` incompleti), exit `2` e nessuna scrittura: `N1` funziona.
   Al terzo tentativo exit 0.
6. `node scripts/mss/cli.mjs --mode file --file "registro/sedute/24-08-26/Report-primo-run-24-08-26.md" --kind report --require-capsule` → **`validate:mss OK`**, exit 0.
7. `node scripts/mss/doctor.mjs` → **exit 0, tutti i passi verdi**, `corpus` compreso.

`mss:status` e `mss:query --verifica` funzionano lì con l'owner rinominato e senza secondo owner.

## 4-ter. Rettifica — controverifica dell'orchestratore, seduta di completamento (24-08-26)

⚠️ Questa sezione **non cancella** le frasi sopra: le corregge accanto, visibilmente. I record
`final` della capsula in fondo a questo report **non sono stati riscritti**. La seduta di
completamento (`docs/Sessioni di lavoro/24-08-26/Report-completamento-md-r8-24-08-26.md`) ha
**tentato** anche un `amendment` formale sull'annotazione `output` di questa capsula
(`mss-rec-01a033c9-0471-7fbc-85f0-44e5b9de3e12`, `--verify … contradicted …`): l'attrezzo lo ha
**rifiutato** con `MSS-AMENDMENT-ORPHAN` — la vista globale che risolve gli amendment guarda solo lo
snapshot HEAD di git, e né questo report né quello di completamento sono committati (lo STOP del
mandato di completamento vieta il commit). Non forzato: è un limite strutturale del meccanismo di
amendment, non un difetto aggiustabile riscrivendo la regola. La rettifica resta quindi **questa
sezione visibile**, non un amendment validato dall'attrezzo — dettaglio completo nel report di
completamento citato sopra.

**Che cosa era stato dichiarato qui sopra.**
- §4-bis, passo 3: *«`node scripts/mss/doctor.mjs` → **exit 1**, un solo passo rosso: `corpus`. Tutto
  il resto verde.»*
- §4-bis, passo 4: *«`npm run validate:mss:all` → **verde**, con i gruppi ancorati dichiarati `n/a`
  per nome…»*

**Che cosa è risultato vero alla riproduzione** (controverifica dell'orchestratore, 24-08-26, e
riproduzione indipendente rifatta da capo nella seduta di completamento, in una repo ospite diversa
da quella citata sopra):

- Con la stessa config (perimetro configurato diverso da quello storico), `npm run validate:mss:all`
  era **ROSSO**: `MSS tools suite red: 1/50 tests failed`. Il test
  `R8 — senza mss.config.json il perimetro e IDENTICO al valore cablato prima di R8` conteneva
  un'asserzione **ambientale** (`REPORT_PATH_RE`, che per disegno di `R8` segue `mss.config.json`
  dell'installazione) confrontata con la stringa storica di **questa** repo: in una repo ospite
  configurata quell'uguaglianza è falsa **per costruzione**, non perché il motore sia rotto.
- Poiché `mss:doctor` esegue anche `test:mss:tools` come passo `suite`, quel passo era **anch'esso
  rosso** nella stessa riproduzione — non «tutto il resto verde» come dichiarato al passo 3.
- Nella riproduzione rifatta da capo in questa seduta di completamento (sequenza corretta: `doctor`
  eseguito **prima** di creare cartella sedute e file owner), anche i passi `cartelle dichiarate` e
  `owner` risultavano correttamente rossi — perché nulla era ancora stato creato. È l'esito
  **corretto** di un'installazione vuota, non un'ulteriore anomalia: il difetto vero era solo
  `test:mss:tools`.

**Che cosa è stato cambiato per chiudere il difetto** (dettaglio completo nel report di
completamento citato sopra):

1. `docs/MetaSkillSystem/tests/tools/run.mjs` — il test ambiguo sopra è stato separato in due: uno
   **portabile** (`normalizeConfig({})` confrontato con la stringa storica — vale in qualunque repo)
   e uno **ambientale** (`REPORT_PATH_RE` confrontato con la stessa stringa storica), quest'ultimo
   dichiarato come verifica di progetto e ancorato a `owner-di-progetto` (`PLAN_V0.md`, la stessa
   ancora già usata da un altro gruppo in questo file — `D18`, non una seconda regola). In una repo
   ospite configurata esce `n/a` col nome dell'ancora, mai fatto fallire.
2. `scripts/mss/doctor.mjs` — il messaggio del passo `owner` diceva «…o non ha le tabelle attese», ma
   quel passo non verifica le tabelle (un owner con la sola intestazione, senza `## 4. …`, passa
   comunque): corretto per dire solo ciò che è davvero controllato.
3. Riprovato da capo in una repo ospite vergine indipendente, con nomi diversi sia da questa repo sia
   dalla riproduzione dell'orchestratore: `npm run validate:mss:all` ora **verde** nella repo ospite.

## 5. File di skill aggiornati

| File | Aggiornato? | Perché |
|---|---|---|
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | sì | §2.4-bis, §2.4-ter, §7 riscritta come procedura di tre comandi |
| `_skill-system-v0/MANUALE_AVVIO.md` | sì | passo 0 (intervista) e passo 10 (checklist) — è il kit che va nella repo nuova |
| `docs/MetaSkillSystem/PLAN_V0.md` | **no** | owner di stato, **fuori perimetro**: `R8` va portato a `PROVATO` dall'orchestratore |
| `docs/APP_CONTEXT_SKILL.md`, skill d'area | no | il diff non tocca nessuna area di prodotto |

## 6. Dati comunicazione

Nessuna voce di vocabolario applicata: la seduta è arrivata già instradata da un mandato scritto.
Il mandato è servito soprattutto per ciò che **vietava** («non spendere un token su bundler») — il
divieto ha risparmiato più tempo di qualunque istruzione positiva.

## 7. Analisi flusso prompt, efficienza e statistiche

Il censimento già verificato ha eliminato la fase più costosa. L'attrito reale è stato altrove: le
`heredoc` con backslash perdono un livello di escape nel trasporto, e tre modifiche di fila sono
uscite con regex letterali rotte. Corretto passando agli attrezzi di modifica diretta per i blocchi
con metacaratteri. Costo secco: tre cicli.

## 8. La mia lettura della sessione

La parte che credevo difficile — parametrizzare cinque consumatori — è stata la più semplice: bastava
tenere `REPORT_PATH_RE` esportato dallo stesso posto e cambiare solo *da dove arrivano i nomi*. Zero
consumatori toccati.

La parte che credevo semplice — «poi lo provo in una cartella vuota» — ha trovato tre difetti veri.
Nessuno dei tre era visibile leggendo il codice: si vedono solo quando il motore si sveglia in una
repo che non è la sua. **Se avessi dichiarato `R8` soddisfatto senza la prova, avrei consegnato un
export che rompe la suite, mente sul motivo e lascia `validate:docs` rosso per sempre.** Il mandato
insisteva sulla prova e aveva ragione per motivi più concreti di quanto sembrasse.

La decisione di cui sono meno sicuro è aver reso `n/a` i gruppi ancorati invece di renderli
portabili. È la scelta giusta per i report inchiodati per sha256 e per le guardie PROD di questo
progetto — sono storia, non motore — ma abbassa la copertura effettiva in una repo ospite, e il
numero di gruppi `n/a` va guardato, non ignorato.

## 9. Derivazione errori

| Errore | Origine | Cosa lo previene ora |
|---|---|---|
| Suite rossa nella repo ospite con messaggio fuorviante | i test leggevano file della repo sorgente senza dichiararlo | ancore di progetto dichiarate; `n/a` col nome dell'ancora; zero gruppi eseguiti = rosso |
| `status` muto con testo presente ma owner assente | funzione che mescolava argomenti e config di processo | `buildStatusReport` è puro nei suoi argomenti |
| `validate:docs` rosso permanente sul materiale copiato | i link dei `.md` copiati parlano dell'albero d'origine | marcatore `.mss-vendored`, con test nei due versi |
| Prima stesura: cartella fixture configurabile ma non seguibile da `test:mss` | parametrizzato per completezza invece che per bisogno | costante di motore documentata, col perché scritto nel codice |
| Regex letterali rotte da tre modifiche | perdita di escape nelle heredoc | blocchi con metacaratteri scritti con l'editor, non con la shell |

## 10. Cosa resta

- **`R8` è `PROVATO`, non `CHIUSO`**: la chiusura è solo di Matteo. `PLAN_V0.md` §4-bis va allineato
  dall'orchestratore — è owner di stato, fuori dal mio perimetro.
- **`N3` resta aperto** (`--check` non trasporta path con spazi) e **`N4` resta aperto**. `mss:doctor`
  aggira `N4` per conto suo — sceglie prove capaci di fallire — ma non lo chiude in `mss:capsule`.
- Copertura ridotta in repo ospite: i gruppi `n/a` sono un numero da guardare, non un dettaglio.
- `.cursor/hooks/fine-sessione-nudge.mjs` non è nell'export (è cablato sull'IDE di questo progetto):
  in una repo ospite lo stop hook resta da installare a mano seguendo `hooks/README.md` del kit.
- **Nota su un file che non è mio:** durante la seduta è comparso in working tree un
  `Prompt-mandato-MG-…` nella cartella di oggi, non presente nella baseline di apertura. Non l'ho
  scritto io e non l'ho toccato.

## 10-bis. Handoff al prossimo agente

Lo stato reale si legge coi comandi, non qui. Per riprendere: `npm run mss:doctor` dice in un colpo
se il motore è vivo; `npm run mss:export -- --help` elenca che cosa viaggia.

Tre cose da sapere prima di toccare questo codice. **(a)** `config.mjs` è l'owner unico dei path
d'installazione: se ti serve un path, importalo, non riscriverlo. **(b)** Se aggiungi un modulo a
`scripts/mss/`, l'export lo prende da solo — ma se aggiungi un *file dati* fuori da lì, va messo in
`EXPORT_MANIFEST` o il controllo di chiusura non lo vedrà (risolve import, non letture di file).
**(c)** Se un test legge un file che esiste solo in questa repo, dichiaralo in `PROJECT_ANCHORS`:
altrove uscirà `n/a` invece di mentire.

La prova di §2.3 è ripetibile: `npm run mss:export -- --to <cartella vuota>`, `git init`, scrivi
`mss.config.json` con nomi **diversi** dai default, `node scripts/mss/doctor.mjs`. Deve essere rosso
solo su `corpus`.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura. Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1: `docs/Sessioni di lavoro/24-08-26/Prompt-mandato-MD-portabilita-24-08-26.md` → blob `4d7a666f00dc196fa9d02dc5e2ca6760e901a893`; `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` → blob `2efa1bfde7417e39217ca1627c93f31726ed6c6a` (letto prima delle mie modifiche). Nessun messaggio diretto di Matteo in questa seduta: il mandato è arrivato da un agente orchestratore, e un messaggio d'agente non è consenso di Matteo — per questo nessun commit.

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti?
✅ R2: sì. `npm run validate` esce 0 senza configurare nulla; `npm run validate:mss:all` verde; `validate:mss` su questo report eseguito a mano (il path ha spazi, `N3`). L'elenco dei file di §3 corrisponde a `git diff --stat` più i tre file nuovi non ancora tracciati. Nessun conteggio mobile è scritto come valore.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata?
✅ R3: completa. `PLAN_V0.md` è deliberatamente escluso: è owner di stato e il mandato lo mette fuori perimetro. L'allineamento di `R8` a `PROVATO` in §4-bis spetta all'orchestratore.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: (1) non ho reso portabili i gruppi ancorati alle guardie PROD e ai report storici — li ho resi `n/a`, che riduce la copertura in repo ospite; (2) non ho esportato lo stop hook di Cursor, quindi in repo ospite l'enforcement di fine sessione va installato a mano; (3) non ho toccato `N3`/`N4` (fuori mandato) né `PLAN_V0.md` (fuori perimetro); (4) non ho committato nulla.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: `N3` mi ha costretto a eseguire a mano il gate sul mio stesso report perché la cartella si chiama con uno spazio nel nome — la miglioria sta in `--check`, non nel nome della cartella, e farebbe risparmiare un passo manuale a ogni seduta. Attrito secondario: `mss:capsule --template` non dice quali campi degli `owner_refs` siano obbligatori, e l'ho scoperto solo facendomi rifiutare due volte; il template potrebbe emettere gli `owner_refs` con le chiavi vuote invece di un array vuoto.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: giusto, e per un motivo preciso: il censimento già verificato e il divieto esplicito di aprire il corpus hanno tolto la parte più costosa. Il `MANUALE_OPERATIVO` è bastato per i comandi. Nessun hook ricevuto in questa seduta (non c'è stato commit, quindi nessun pre-commit).
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a033c9-0471-7869-aa62-c6fe8c3372da","correlation_id":"mss-cor-01a033c9-0471-7b30-b35b-ea99b5f7596f","segment_no":1,"created_at":"2026-08-24T14:40:07+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"esecutore","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["filesystem","shell"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a033c9-0471-7ebd-bbe4-cd55ab9ee0fe","capture_key":"mss-ses-01a033c9-0471-7869-aa62-c6fe8c3372da/1/session_event/1","event":{"event_id":"mss-evt-01a033c9-0471-728e-b172-81d95fd727ba","event_kind":"session_close","occurred_at":"2026-08-24T14:40:07+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"mandato M-D: rendere parametrico cio che era cablato, costruire la checklist di primo run e provare il bootstrap in una repo vergine (P1 / R8)","session_type":"deep","capsule_status":"completa","role_key":"esecutore","area":"MetaSkillSystem — portabilita del motore","environment":"repo locale su env/test, nessuna operazione Supabase, nessun commit","authorization":{"read":["scripts/mss/","scripts/check-doc-paths.mjs","_skill-system-v0/","docs/MetaSkillSystem/"],"write":["scripts/mss/","scripts/check-doc-paths.mjs","docs/MetaSkillSystem/tests/","_skill-system-v0/","package.json","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md"],"forbid":["commit","push","tag","move o rinomina di file","riscrittura di record final","PLAN_V0.md","src/","migrazioni","qualunque scrittura su database"]},"authorized_outputs":["un solo report di seduta","una sola capsula"],"route":{"chosen":"config unica con default invariati -> mss:export -> mss:doctor -> prova in repo vergine con cartelle rinominate","alternatives_or_conflicts":["scartati bundler e workspace: il motore non ha dipendenze npm esterne","scartata la pubblicazione su registry: l export e una copia di cartella","scartata una seconda copia dei moduli dentro _skill-system-v0 (D18: due sorgenti della stessa regola divergono)","scartata la cartella fixture configurabile: la suite H-1 la inchioda per sha256 e non potrebbe seguirla"]},"observed_outcome":"parametrizzazione fatta con default identici (validate verde senza configurare nulla); checklist di primo run che e rossa su corpus vuoto; prova in repo vergine completata con cartella sedute e owner rinominati; tre difetti di portabilita trovati dalla prova e corretti","open_items":["R8 resta PROVATO e non CHIUSO: la chiusura e solo di Matteo","PLAN_V0.md §4-bis da allineare dall orchestratore (owner di stato, fuori perimetro)","N3 e N4 restano aperti in mss:capsule","copertura ridotta in repo ospite: i gruppi n/a sono un numero da guardare"],"controls":[{"control_id":"MD-MSS-ALL","criterio":"npm run validate:mss:all","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0)","evidence_refs":[]},{"control_id":"MD-DOCTOR","criterio":"npm run mss:doctor","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run mss:doctor (exit 0)","evidence_refs":[]},{"control_id":"MD-STATUS","criterio":"npm run mss:status","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run mss:status (exit 0)","evidence_refs":[]},{"control_id":"MD-QUERY","criterio":"npm run mss:query -- --verifica","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run mss:query -- --verifica (exit 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_applicabile: soggetto non applicabile in questa seduta","provider":"non_applicabile: soggetto non applicabile","model":"non_applicabile: soggetto non applicabile","runtime":"non_applicabile: soggetto non applicabile","surface":"non_applicabile: soggetto non applicabile"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["path di repo","esiti di comandi","identificatori di pacchetto e difetto"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-plan-v0","owner_id":"MSS","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"sezione 4-bis: stato di R8 e SK-10","revision_or_hash":"77730503154c2b98c4644172087674d043a137d5","sensitivity":"internal"},{"ref_id":"owner-manuale-operativo","owner_id":"MSS","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"sezione 7: bootstrap in altra repo","revision_or_hash":"2efa1bfde7417e39217ca1627c93f31726ed6c6a","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-mandato-md","owner_id":"MSS","uri_or_path":"docs/Sessioni di lavoro/24-08-26/Prompt-mandato-MD-portabilita-24-08-26.md","stable_anchor_or_event_id":"sezioni 1 2 3 4 5 6","revision_or_hash":"4d7a666f00dc196fa9d02dc5e2ca6760e901a893","sensitivity":"internal"},{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"_skill-system-v0/MANUALE_AVVIO.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"3d209ee","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"3d209ee","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/h1/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"3d209ee","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"3d209ee","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"package.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"3d209ee","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"scripts/check-doc-paths.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"3d209ee","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"scripts/mss/adapter.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"3d209ee","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"scripts/mss/git-adapter.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"3d209ee","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"scripts/mss/query.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"3d209ee","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"scripts/mss/report-paths.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"3d209ee","sensitivity":"internal"},{"ref_id":"source-git-11","owner_id":"git-working-tree","uri_or_path":"scripts/mss/status.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"3d209ee","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a033c9-0471-7869-aa62-c6fe8c3372da","correlation_id":"mss-cor-01a033c9-0471-7b30-b35b-ea99b5f7596f","segment_no":1,"created_at":"2026-08-24T14:40:07+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"esecutore","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["filesystem","shell"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a033c9-0471-76df-ae4e-8449302d2558","capture_key":"mss-ses-01a033c9-0471-7869-aa62-c6fe8c3372da/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a033c9-0471-73f3-b336-d745853c6569","axis":"persona","subject_record_ids":["mss-rec-01a033c9-0471-7ebd-bbe4-cd55ab9ee0fe"],"delta":"nessuno","assertions":[{"signal":"nessun segnale di persona osservato: la seduta e stata affidata da un agente orchestratore, senza interazione con Matteo","actor":"orchestratore MSS","assistance":"spontaneo","origin":"naturale","source_ref":"docs/Sessioni di lavoro/24-08-26/Report-md-portabilita-24-08-26.md","effect":"nessun effetto su una persona: la seduta agisce solo su codice e documenti del motore","evidence_state":"observed"}],"asserted_by":{"actor_id":"esecutore-md-opus","role":"esecutore","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile:non ancora verificato","evidence_refs":[],"notes":"seduta tecnica senza interlocutore umano"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a033c9-0471-7869-aa62-c6fe8c3372da","correlation_id":"mss-cor-01a033c9-0471-7b30-b35b-ea99b5f7596f","segment_no":1,"created_at":"2026-08-24T14:40:07+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"esecutore","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["filesystem","shell"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a033c9-0471-7d85-a64f-d1f2c8803f92","capture_key":"mss-ses-01a033c9-0471-7869-aa62-c6fe8c3372da/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a033c9-0471-7214-b224-7af1b223c524","axis":"sistema","subject_record_ids":["mss-rec-01a033c9-0471-7ebd-bbe4-cd55ab9ee0fe"],"delta":"creato","assertions":[{"rule_id_version":"R8/bootstrap-e-una-procedura","trigger_event":"installazione del motore in una repo vergine con cartella sedute e owner rinominati","decision_or_output_changed":"i path di installazione vivono in una sola fonte con default invariati; export, intervista e checklist di primo run esistono e sono stati eseguiti davvero","G":1,"O":1,"E":1},{"rule_id_version":"R2/il-corpus-vuoto-non-e-un-verde","trigger_event":"primo mss:doctor in una repo appena installata","decision_or_output_changed":"la checklist esce rossa quando non c e niente da leggere, invece di dire zero record tutto ok","G":1,"O":1,"E":1},{"rule_id_version":"R8/ancore-di-progetto-dichiarate","trigger_event":"suite eseguita fuori dalla repo sorgente","decision_or_output_changed":"i gruppi che dipendono da file della repo sorgente escono n/a col nome dell ancora, mai contati come verdi; zero gruppi eseguiti e rosso","G":1,"O":1,"E":1}],"asserted_by":{"actor_id":"esecutore-md-opus","role":"esecutore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile:self_report","evidence_refs":[],"notes":"autodichiarazione dell esecutore: la controverifica indipendente spetta all orchestratore"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a033c9-0471-7869-aa62-c6fe8c3372da","correlation_id":"mss-cor-01a033c9-0471-7b30-b35b-ea99b5f7596f","segment_no":1,"created_at":"2026-08-24T14:40:07+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"esecutore","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["filesystem","shell"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a033c9-0471-7fbc-85f0-44e5b9de3e12","capture_key":"mss-ses-01a033c9-0471-7869-aa62-c6fe8c3372da/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a033c9-0471-708b-83f2-74c232f8ba2a","axis":"output","subject_record_ids":["mss-rec-01a033c9-0471-7ebd-bbe4-cd55ab9ee0fe"],"delta":"creato","assertions":[{"output_id":"mss-portabilita-r8","primary_type":"prodotto","canonical_version":"docs/Sessioni di lavoro/24-08-26/Report-md-portabilita-24-08-26.md","recipient":"chi deve installare il MetaSkillSystem in un altro repository","problem_or_job":"portare il motore altrove e sapere se l installazione e riuscita","intended_use":"mss:export per copiare, mss.config.json per l intervista, mss:doctor per la checklist di primo run","conceived_by":"orchestratore MSS","decided_by":"esecutore","directed_by":"orchestratore MSS","authored_by":"esecutore","verified_by":"non_osservato","acceptance_criterion":"npm run validate verde in questa repo senza configurare nulla, e in una repo vergine con cartelle rinominate: mss:doctor rosso su corpus vuoto, poi verde dopo la chiusura di una seduta validata","verification_or_use_evidence":"esiti reali registrati nei controls e nella sezione 4-bis del report","verification_status":"unverified","owner_ref":"docs/MetaSkillSystem/PLAN_V0.md","privacy_release":"internal","support_files":[],"relations_no_double_count":[],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"esecutore-md-opus","role":"esecutore","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile:self_report","evidence_refs":[],"notes":"nessun secondo attore ha verificato: R8 resta PROVATO, non CHIUSO"}}}
```
