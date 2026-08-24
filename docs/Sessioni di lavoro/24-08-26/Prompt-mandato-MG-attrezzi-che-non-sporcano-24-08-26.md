# Mandato `M-G` — attrezzi che non sporcano il corpus (24-08-2026)

> Affidato dall'orchestratore a un esecutore **Sonnet**. Copre `N3` + `N4` + `N5` + **`N6`**.
> **Un solo report** (≤ 180 righe) e **una sola capsula**. Perimetro chiuso su `capsule.mjs` + `doctor.mjs`.
> Fonte: [`PROMPT_ORCHESTRATOR_MSS_24-08-26.md`](../../MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md) §3 · §4.
>
> ⚠️ **Non aprire questo mandato finché `M-D` non è controverificato.** Un mandato per volta.

## 0. Che cosa NON devi leggere

Non aprire il corpus dei report — sono centinaia. Ti bastano: questo mandato, il
[`MANUALE_OPERATIVO_MSS_V0.md`](../../MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md) e i file del
perimetro. **Non** leggere `PLAN_V0.md`.

## 1. Censimento già fatto e verificato — parti da qui

Eseguito a modello leggero il 24-08 e **ricontrollato riga per riga dall'orchestratore contro
`HEAD=3d209ee`**: ogni numero di riga qui sotto è stato aperto e letto, non dedotto.

| Fatto | Dove |
|---|---|
| `--check` è parsato da `parseCheckSpec` | `capsule.mjs:221`, separatore canonico a `:226-229` |
| Il comando è eseguito da `spawnCheckCommand` | `capsule.mjs:271` — `spawnSync(command.trim(), { shell: true, cwd, … })` |
| L'esito è dedotto dall'exit code | `capsule.mjs:308-309` — `const pass = code === 0` |
| Gli esiti possibili sono tre | `pass` · `fail` (`:309`) · `non_noto` (`:283`, `:302`) |
| **Non esiste alcuna forma di esito atteso** | `grep -rniE "check.?expect" scripts/ .cursor/hooks/ .claude/hooks/ docs/MetaSkillSystem/tests/` → zero |
| `VERIFY_STATUSES` esclude solo `self_report` | `capsule.mjs:345` — `ENUM.verificationStatus.filter((s) => s !== 'self_report')` |
| L'enum ha cinque valori | `rules.mjs:107-112` — `self_report`, `unverified`, `independently_verified`, `contradicted`, `not_applicable` |
| `validateVerifier` esce presto | `core.mjs:695` (firma), `core.mjs:698` — esce su tutto ciò che non è `independently_verified` |
| **Nessun test nomina `N3`, `N4` o `N5`** | `grep -rnE "\bN[345]\b" docs/MetaSkillSystem/tests/` → zero |
| La forma da imitare per i test | `docs/MetaSkillSystem/tests/tools/run.mjs`, titoli `capsule: N1 — …` (`:745`, `:772`) e `capsule: N2 — …` (`:800`, `:840`, `:869`) |

### ⚠️ `N3` era mal diagnosticato. Usa questa diagnosi, non quella scritta nei doc.

Il manuale §2.4 e `PROMPT_ORCHESTRATOR` §3 dicono che `--check` «**non trasporta** un path con spazi»
e che «le virgolette si perdono nel trasporto». **È falso, ed è stato provato il 24-08-26
dall'orchestratore.**

Le virgolette **arrivano intatte** a `process.argv` attraverso `npm run … -- --check "…"`. La rottura
è **a valle**, dentro `spawnCheckCommand`. Comportamento reale misurato, stesso comando
`npm run validate:mss -- --mode file --file <report con spazi> --kind report --require-capsule`
eseguito via `spawnSync(cmd, { shell: true })`:

| Forma del path dentro il comando | Esito reale |
|---|---|
| **virgolette doppie** | **exit 0 — funziona** |
| nessuna virgoletta | exit 1 — `fail` falso |
| **virgolette singole** | **exit 1 su Windows** — `shell: true` usa `cmd.exe`, che non riconosce le virgolette singole |

Conseguenze per il tuo lavoro, tutte e tre importanti:

1. **`N3` non è un difetto di trasporto.** È che l'attrezzo non distingue «comando **malformato**» da
   «comando **eseguito e fallito**», e registra il primo come se fosse il secondo. Ha quindi **la
   stessa radice di `N4`**, e vanno risolti insieme — non sono due fix scollegati.
2. **La trappola vera sono le virgolette singole**, perché sono l'abitudine POSIX di chiunque scriva
   quel comando, e su Windows falliscono in silenzio producendo un `fail` che accusa il report.
3. **Un path con spazi si può registrare in `controls[]`**, con virgolette doppie. Il consiglio
   «esegui a mano quei comandi» che circola nei mandati era un ripiego su una diagnosi sbagliata.

**Non ricopiare la vecchia diagnosi da nessuna parte.** Dove la trovi nel perimetro, correggila (§3).

## 2. Che cosa deve diventare vero

### 2.1 `N4` + `N3` — un controllo dice ciò che prova, o non lo registra

Oggi `controls[]` mescola tre cose che sembrano identiche: un comando che ha provato qualcosa, un
comando **incapace di fallire** (`git status --short` → `pass` che non prova nulla), e un comando
**malformato** (path spezzato → `fail` che parla della propria sintassi). Chiunque legga
`npm run mss:query -- --fail` fra un mese le vedrà uguali.

Devi rendere distinguibili almeno il comando malformato e il comando fallito, e permettere di
dichiarare l'esito atteso. La proposta già agli atti dall'esecutore di `M-C` è
**`--check-expect <exit>`**, che chiude anche i controlli a segno invertito (un comando che *deve*
fallire). Non esiste nulla del genere oggi: lo verifichi con il `grep` di §1. Se scegli una forma
diversa, **motivala nel report**.

Vincolo aggiuntivo, che nasce dalla diagnosi corretta: quando il comando registrato contiene un path
con spazi **non quotato**, o quotato con **virgolette singole**, l'attrezzo deve **avvisare in modo
leggibile** invece di registrare in silenzio un `fail` che accusa il bersaglio sbagliato. Un avviso,
non un blocco: l'agente può avere ragioni legittime.

### 2.2 `N5` — chiudere la porta alla dimensione del mandato

`--verify` ammette `unverified` e `not_applicable` **mentre popola `verified_by`**: si scrive un
record che dice «nessuno ha verificato» nominando un verificatore. `validateVerifier` non lo
intercetta perché esce presto (`core.mjs:698`) su tutto ciò che non è `independently_verified`.

Deve diventare impossibile. Due strade, **e servono entrambe**:

- la **porta** di `--verify` va stretta agli esiti che hanno senso con un verificatore nominato;
- il **cancello** nel `core` deve rifiutare un record con `verified_by` popolato e uno stato che nega
  la verifica — perché il difetto è nel dato, e un dato rotto può arrivare anche da un'altra strada.

Stringere solo la porta lascia il corpus indifeso: un cancello che non vede il record sporco è
esattamente il difetto che `R2` vieta.

### 2.2-bis `N6` — il passo `owner` di `mss:doctor` misura git, non l'owner

`scripts/mss/doctor.mjs:140`:

```js
const ricostruibile = status.status === 0 && !/non ricostruibile/.test(status.stdout)
```

Cerca «non ricostruibile» in **tutto** l'output di `mss:status`. Ma quella stringa la stampa la
sezione **Git** quando la repo non ha ancora commit — cioè in ogni repo appena `git init`ata, che è
**esattamente lo scenario di `R8`**. Il passo va rosso e accusa l'owner, che è presente e leggibile,
e il messaggio dice «crealo» a chi lo ha appena creato.

**Prova già eseguita dall'orchestratore:** un commit nella repo ospite, **senza toccare il file
owner**, rende il passo verde. Riferimento:
[`Report-controverifica-md-24-08-26.md`](Report-controverifica-md-24-08-26.md) §5.

Il passo deve verificare **ciò che dice di verificare**: che gli owner dichiarati in config siano
leggibili e interpretabili. Un difetto di git è un fatto diverso — se merita un passo, sia un passo
suo, con il suo nome. ⚠️ Una precedente correzione ha cambiato il **messaggio** senza verificare la
**causa**, producendo un messaggio nuovo che nomina ancora una causa sbagliata: non ripetere
quell'errore, **riproduci prima**.

### 2.3 I test devono **nominare** il difetto

Per ciascuno di `N3`, `N4`, `N5`, `N6` serve **almeno un test il cui titolo nomina il difetto**. Il criterio
non è formale: alla controverifica ogni difetto dichiarato chiuso viene cercato con `grep` sull'albero
dei test, e le asserzioni vengono lette **per escludere che siano vacue**. Un test che asserisce
`exit !== 0` senza guardare *quale* codice o *quale* messaggio è un test vacuo.

Imita la forma già in uso: `capsule: N1 — …`, `capsule: N2 — …` in `tests/tools/run.mjs`.

## 3. Perimetro dei file

`scripts/mss/capsule.mjs` · `scripts/mss/core.mjs` (solo il cancello di §2.2) ·
`scripts/mss/doctor.mjs` (solo il passo `owner` di §2.2-bis) ·
`scripts/mss/rules.mjs` (solo se serve **esportare** una regola, mai duplicarla) ·
`docs/MetaSkillSystem/tests/**` · `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` §2.4
(**già rettificato dall'orchestratore** con la diagnosi corretta: aggiornalo solo per riflettere ciò
che avrai chiuso, non per riscrivere la diagnosi).

**Fuori perimetro:** `PLAN_V0.md` e `PROMPT_ORCHESTRATOR_MSS_24-08-26.md` — sono owner di stato e li
rettifica l'orchestratore · `src/**` · migrazioni · qualunque cosa Supabase.

⚠️ **Attenzione:** il mandato `M-D` ha appena toccato `scripts/mss/**` per la portabilità. Prima di
iniziare esegui `git status` e `git diff --stat`, e **non annullare il lavoro di `M-D`**: se un file
del tuo perimetro risulta già modificato, parti da com'è, non da come lo ricordi.

## 4. Comandi da eseguire e registrare in `controls[]`

```
npm run test:mss:tools
npm run test:mss
npm run validate:mss:all
npm run validate
```

Registra **comandi capaci di fallire** — è il difetto stesso che stai riparando: un `controls[]` di
comandi infallibili sembra una prova e non lo è. E ora che sai come si comporta `spawnCheckCommand`,
il controllo «ho validato il mio report» **puoi** registrarlo, con **virgolette doppie** intorno al
path. Se il tuo stesso fix lo rende registrabile in modo pulito, quella è la prova migliore che hai.

## 5. STOP — vincoli non negoziabili

- **Nessun commit, nessun push, nessun tag.** Il 24-08 un esecutore ha committato contro questo STOP
  e lo ha negato nel report: è stato accertato confrontando `HEAD`. Non ripeterlo.
- **Nessun `move` o rinomina di file** (`D15`): `mss:move` non esiste ancora.
- **Nessuna riscrittura di record `final`**: la rettifica passa da un `amendment`, sempre.
- **Nessun allentamento del validator per far passare un test.** Qui è il rischio principale del
  mandato: stai stringendo un cancello, e la tentazione opposta è allargarlo. Se un test non passa, o
  il codice è sbagliato o la regola è sbagliata: **decidi quale e dichiaralo**.
- **Nessuna voce nuova in allowlist** al posto di un fix (`D21`).
- **Nessuna seconda implementazione di una regola già scritta** (`D18`, «snellire non duplicare»): se
  ti serve una regola già scritta, **importala**; se non è esportata, **esportala**.
- **Nessuna scrittura su database.**
- **Numeri mobili citati come comando**, mai come valore.
- **Nessuna chiusura di pacchetto**: puoi dichiarare `PROVATO`, mai `CHIUSO`.
- ⚠️ **Non pre-scrivere l'intestazione «Capsula MetaSkillSystem»** nel report: `mss:capsule
  --append-to` la rifiuta, correttamente. La scrive l'attrezzo.
- ⚠️ L'attrezzo **valida prima di scrivere**: su un giudizio invalido esce `2` e non scrive nulla. Se
  ti capita, correggi **il giudizio**, mai la regola.

## 6. Come verrai controverificato

L'orchestratore **non leggerà il report per fidarsene: rifarà**.

1. `git diff` reale, e perimetro rispettato.
2. `npm run validate` in questa repo → verde.
3. Per `N3`, `N4` e `N5`: **il test che lo nomina**, e lettura delle asserzioni per escludere che sia
   vacuo.
4. La riproduzione della tabella di §1 **rifatta a mano**: dopo il tuo fix, il caso «virgolette
   singole» e il caso «senza virgolette» devono essere **distinguibili** da un comando eseguito e
   fallito davvero.
5. Il tentativo di scrivere un record `unverified` con `verified_by` popolato deve essere **respinto**.
