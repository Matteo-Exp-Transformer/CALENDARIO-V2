# Report — `SK-6`: costruito `mss:query`, il lettore delle capsule

> **Data:** 22-08-26 · **Modalità:** deep · **Pacchetto:** `SK-6` (§4-bis di `PLAN_V0.md`)
> **Perimetro:** un file nuovo (`scripts/mss/query.mjs`) + una riga in `package.json`. Zero dati
> modificati, zero capsule corrette, zero `src/`, zero database, zero move, zero push.

## Cappello

- **Cosa è cambiato:** esiste `npm run mss:query`. Le 42 capsule scritte in 42 sedute sono
  interrogabili per la prima volta: prima servivano solo a impedire che il passato venisse riscritto.
- **Cosa ne esce:** qualcosa di utile, sì — e sono tre fatti scomodi, non tre tabelle. Il più duro:
  **in 42 sedute nessuno ha mai registrato di aver verificato nessuno**, e questo mentre delle review
  indipendenti sono state davvero eseguite.
- **Serve una tua azione:** sì, due decisioni (in fondo, §8). Il commit è locale; il push aspetta il tuo sì.

---

## 1. Che cosa ho costruito

Un comando in **sola lettura**: `npm run mss:query`. Non scrive, non modifica, non ripara i dati.

Senza opzioni stampa un riepilogo e l'elenco delle domande. Con un'opzione risponde a una domanda:

| Comando | Risponde a |
|---|---|
| `npm run mss:query -- --regole` | quali regole compaiono, con quali `G`/`O`/`E`, quante volte |
| `npm run mss:query -- --modelli` | quante **sedute** per provider, modello e superficie |
| `npm run mss:query -- --verifica` | quante dichiarazioni sono verificate, e chi ha verificato chi |
| `npm run mss:query -- --fail` | tutti gli esiti negativi conservati |
| `npm run mss:query -- --costo` | quanto è stato verificato in ogni seduta |

C'è anche `--json` per l'output grezzo, così il prossimo attrezzo può consumarlo senza ri-parsare
il testo.

**Ogni risposta finisce con due blocchi che dichiarano i propri limiti:** «Che cosa questa risposta
NON vede» e «Perimetro di lettura». Non è cortesia: è la regola che impedisce a un numero di
sembrare più solido di quanto sia.

---

## 2. Il conto che non tornava — e chi aveva ragione

Il prompt indicava **42 capsule** e avvisava di non forzare i conti. La mia prima misurazione ne ha
trovate **43**. Ho aperto il caso invece di adeguarmi, ed erano giusti entrambi i numeri, perché
**misurano due cose diverse**:

| Misura | Valore |
|---|---|
| File `.md` con l'**intestazione** `Capsula MetaSkillSystem` | **43** |
| File con **righe `JSONL` vere** dentro quell'intestazione | **42** |

Il quarantatreesimo è
`docs/Sessioni di lavoro/09-08-26/Report-ciclo-metaskillsystem-v0-avvio-e-cattura-09-08-26.md`:
ha l'intestazione ma **nessun blocco `jsonl`**. Non è un difetto ed è tutt'altro che invisibile — è
un'**eccezione storica dichiarata**, inchiodata per hash in `scripts/mss/parse.mjs` (righe 13-16).
Ho verificato che lo `sha256` del file a `HEAD` coincide byte per byte con la costante.

**Come l'ho risolto nel comando:** `mss:query` non decide da sé se un file senza `jsonl` è un caso
storico o un difetto — lo **chiede a `parse.mjs`** chiamando `detectReportMode()`, che è la fonte di
verità. Poi stampa entrambi i numeri, con il nome del file dell'eccezione. Se un domani comparisse
un report con l'intestazione vuota **non** riconosciuto come eccezione, la riga diventa rossa.

> Perché era importante non lasciar correre: se avessi scritto «42» adeguandomi, il comando avrebbe
> letto 43 file e riportato 42 senza che nessuno potesse accorgersene.

### Le altre misure del §2-bis: 10 righe su 11 riprodotte identiche

`session_id` distinti **42** · record `JSONL` **169** (~4,0 per seduta) · malformati **0** ·
`record_type` `session_event` 42 / `annotation` 126 / `amendment` 1 · `axis` 42/42/42 ·
`verification.status` `self_report` 76 / `unverified` 48 / `not_applicable` 2 ·
`verified_by` non vuoto **0 su 169** · `controls[].esito` `pass` 111 / `fail` 5 ·
`event.controls` presente in **32 sedute su 42** · assertion con `G`/`O`/`E` **48**, che citano
**35 stringhe distinte**, di cui **30 una volta sola**.

**Una precisazione sull'undicesima riga.** Il §2-bis dice «10 sedute su 42 non hanno `event.controls`».
È vero, ma le 10 non sono la stessa cosa:

- **9 sedute dichiarano esplicitamente `"nessuno"`** — è una dichiarazione, ed è onesta;
- **1 seduta non ha proprio il campo** — quello è silenzio.

`mss:query -- --costo` tiene le due righe separate, perché la differenza è esattamente ciò che il
sistema dice di voler misurare. La seduta muta è
`Report-completamento-wp-0-1-metaskillsystem-09-08-26.md`.

> **Se lanci il comando adesso vedrai 43 sedute, non 42.** Tutti i numeri di questo report sono
> misurati sull'albero `HEAD` **prima** di questa seduta. `mss:query` legge anche il working tree,
> quindi da quando esiste questo report conta anche la sua capsula — e infatti la etichetta come
> `solo worktree 1`. È il comportamento voluto: la raccolta include il lavoro in corso, e dichiara
> da dove viene ogni file. È anche la prova che il comando vede una capsula appena scritta.

---

## 3. La trappola del filtro: 6 capsule su 42 erano invisibili

Il §4 del prompt avvisava che `collectGitHeadHistory()` è cieca sulle sotto-cartelle per via del
filtro `[^/]+`. **Confermato, e misurato:**

```
collectGitHeadHistory()  →  36 capsule con record
mss:query                →  42 capsule con record
                            ─────────────────────
                            6 invisibili al filtro stretto
```

Le 6 sono tutte in `docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/`.

Nel mio file uso un filtro che accetta qualunque profondità di cartella, e **il comando dichiara in
output quanti file ha letto e da dove**. Non ho toccato `scripts/mss/adapter.mjs`: lì lo stesso
filtro governa il perimetro del pre-commit, allargarlo farebbe entrare 22 report in un colpo solo, ed
è `SK-4` — una decisione tua, non mia.

---

## 4. Che cosa esce davvero dalle 42 capsule

La domanda che vale la seduta non è «il comando gira», è «ne esce qualcosa di utile». **Sì.**
Tre cose, e nessuna è una tabella carina.

### 4.1 Il sistema è autocertificato al 100% — ma le review erano vere

Questo è il risultato principale.

```
independently_verified    0 su 126   mai usato
contradicted              0 su 126   mai usato
self_report              76 su 126
unverified               48 su 126
not_applicable            2 su 126
verified_by              vuoto in tutte e 126 le annotazioni
```

In 42 sedute **nessuno ha mai registrato di aver verificato nessuno**. Vale anche per le sedute che
si sono dichiarate riuscite, e vale per il lavoro mio di oggi.

**Ma il dato non finisce qui, e la seconda metà cambia il senso della prima.** Cercando l'unica
traccia *strutturata* di un revisore — il campo `esecutore` dei `controls`, che nei dati è un id di
attore e non prosa — ne saltano fuori tre:

| Esecutore | Controlli | Sedute |
|---|---|---|
| `cursor-grok-sep4-reviewer` | 4 | 1 |
| `codex-independent-reviewer` | 1 | 1 |
| `cursor-grok-independent-reviewer` | 1 | 1 |

**6 controlli eseguiti da un revisore, in 3 sedute — e zero annotazioni che lo registrino.**
Le review indipendenti *sono state fatte*. Il campo che le renderebbe interrogabili è rimasto vuoto.

E c'è un ultimo dettaglio che chiude il cerchio: la parola `independently_verified` compare **3
volte** nei report, sempre **in prosa**, mai come valore di un record. Una di quelle righe
(`Report-revisione-indipendente-sep4-…-10-08-26.md`, riga 128) afferma a parole che una seduta
**è** `independently_verified`. La macchina non lo sa, e non poteva saperlo.

> **Il divario non è fra «verificato» e «non verificato». È fra ciò che i report raccontano e ciò che
> la capsula registra.** È esattamente il divario che `mss:query` serve a rendere visibile — e non
> era visibile prima di oggi.

**Nota sul criterio.** Il riconoscimento dei revisori usa una regola sola, dichiarata dentro l'output
perché tu possa rifiutarla: *l'id dell'esecutore contiene «reviewer» o «revisor»*. Nessun altro testo
viene letto. Sui dati attuali produce 3 attori su 48 e non ha falsi positivi — li ho controllati uno
per uno. Il comando **non afferma** che quelle review fossero indipendenti: riporta che l'esecutore si
chiama così e che nessuna annotazione lo registra.

### 4.2 La governance è quasi tutta dichiarata, quasi mai provata

Le 29 stringhe che nominano **una regola sola** si raggruppano in 28 regole (`owner-unico` compare
sotto due versioni). Di queste:

- **13 regole su 28 hanno `E` sempre 0** — efficacia mai provata, solo dichiarata. Fra queste
  `SEP-10`, `SEP-G1`, `SEP-G5`, `owner-unico`, `salute-globale`.
- **15 su 28 hanno almeno un `E` > 0**, quasi tutte del filone `H-1*` e `SEP-11-*`.

**Perché non c'è una classifica completa, e perché è giusto così.** `rule_id_version` **non è un
identificatore: è una frase**. Sei stringhe ne citano più d'una con un solo `G`/`O`/`E` — per esempio
`"CFG-02 + TIPO_SEDUTA_FANTASTICAZIONE_V0 + E1-E5 + mss.session/0.1.1 + CHIUSURA_SESSIONE"`: cinque
regole, un punteggio. Attribuire quel punteggio a una qualunque delle cinque sarebbe inventare un
numero. Il comando **le esclude dalla graduatoria, dichiara quante ne ha escluse, e poi le stampa
per intero** perché il dato non vada perso.

**Il limite più importante di questa risposta:** 30 stringhe su 35 sono citate **una volta sola**.
Non è un campione su cui appoggiare nessuna tendenza, e il comando lo scrive in chiaro invece di
mostrare una classifica dall'aria autorevole.

### 4.3 Le review sono state scritte quasi tutte dalla stessa famiglia di modello

Contando per **seduta** (non per record: sono ~4 per seduta, contarli darebbe numeri quadrupli):

| Provider | Sedute |
|---|---|
| xAI/Cursor | **33 su 42 — 79%** |
| OpenAI | 7 su 42 |
| Anthropic | 2 su 42 |

Il vincolo proposto in `PLAN_V0.md` §16.3 — una review vale come indipendente solo se il revisore
gira su una **famiglia di modello diversa** da chi ha scritto — con questa concentrazione
escluderebbe la maggior parte delle sedute. Il dato conferma la nota che accompagna `D13`.

**Due dettagli che il comando dichiara invece di nascondere:**

- Lo stesso modello compare con **due grafie** (`Cursor Grok 4.5` ×30 e `Grok-4.5` ×3). Le unisco, e
  l'output **elenca la fusione** così puoi rifiutarla. Le **superfici** invece non le unisco:
  `Cursor IDE` e `IDE chat` sono distinzioni reali, non errori di scrittura.
- `event.subject_runtime` è **inutilizzabile in 27 sedute su 42** (`non_applicabile:*` o `non_noto`).
  Per questo i conteggi usano `recorded_by.agent_runtime`. Il §2-bis stimava «circa metà»: è il 64%.

### 4.4 Il negativo è stato conservato davvero

**5 controlli falliti su 116, tutti ancora leggibili**, con criterio, esecutore e report d'origine.
Due sono `npm run validate` rosso ad agosto; tre vengono da sedute di revisione indipendente. Il
sistema promette di conservare il negativo, e su questo **ha mantenuto la promessa**.

Il resto del quadro è meno lusinghiero: `capsule_status` vale `completa` in **42 sedute su 42**,
`invalidata` e `interrotta` non compaiono mai, e `event_kind` è sempre `session_close`. Nessuna
seduta si è mai dichiarata interrotta o invalidata. Il comando stampa quegli zeri a parole, con
scritto «mai usato» accanto, invece di far sparire la riga.

Sull'asse Output, **2 asserzioni su 43** superano il quinto gate (`eligible`); 41 restano
`not_eligible`.

---

## 5. Le tre affermazioni, provate risalendo alle capsule

Il criterio di chiusura di `SK-6` chiede che le risposte siano **vere**, non solo stampate.

**Prova 1 — `--fail` dice: `SEP-G1-CHECKLIST 4/5 fail`.** Aperto
`docs/Sessioni di lavoro/10-08-26/Report-revisione-indipendente-sep4-senior-eval-pack-metaskillsystem-10-08-26.md`,
la capsula contiene letteralmente:

```json
{"control_id":"SEP-G1-CHECKLIST","criterio":"ricostruzione+controprove+zero HIGH+separazione+verdetto attribuito","esito":"fail","numeratore":4,"denominatore":5,"esecutore":"cursor-grok-sep4-reviewer","evidence_refs":["owner-report"]}
```

✅ Corrisponde, compreso l'esecutore che ricompare nella tabella dei revisori del §4.1.

**Prova 2 — `--modelli` dice: due grafie dello stesso modello, unite.** In
`Report-sep-11-f3-move-report001-10-08-26.md`:
`{"provider":"xAI/Cursor","model":"Cursor Grok 4.5","runtime":"Cursor Agent","surface":"Cursor IDE"}`.
In `Report-track-commit-h13-l5-pass-con-riserve-10-08-26.md`:
`{"provider":"xAI/Cursor","model":"Grok-4.5","runtime":"Cursor Agent","surface":"local workspace"}`.

✅ Stesso provider, stesso runtime, modello scritto in due modi, superficie diversa: la fusione dei
modelli è corretta e la scelta di **non** fondere le superfici pure.

**Prova 3 — `--verifica` dice: `independently_verified` mai usato.** `git grep` su tutti i report a
`HEAD` trova la stringa **3 volte, in 2 file, sempre in prosa**, mai dentro un blocco `jsonl`. Il
blocco `verification` reale, aperto in `Report-consulenza-esterna-fable-mss-21-08-26.md`, è:

```json
"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report", ...}
```

✅ Il conteggio a zero è corretto. E il confronto fra le 3 occorrenze in prosa e le 0 nei record è
il §4.1.

---

## 6. I cancelli

| Comando | Esito | Che cosa prova davvero |
|---|---|---|
| `npm run test:mss` | ✅ **exit 0** — 41 fixture cases + 32 groups | non ho rotto il validator |
| `npm run validate` | ✅ **exit 0** — 163 file, 1 346 test | non ho rotto il prodotto |
| `npm run mss:query -- --regole` | ✅ risponde | |
| `npm run mss:query -- --modelli` | ✅ risponde | |
| `npm run mss:query -- --verifica` | ✅ risponde | |
| `node --check scripts/mss/query.mjs` | ✅ exit 0 | la sintassi |

`npm run validate` era verde dal 21-08 e **è rimasto verde**.

> ⚠️ **Attenzione a non leggere quei due verdi per più di quello che sono.** Ho verificato che
> `npm run lint` gira con `--ext ts,tsx` e che **`scripts/` è escluso da ESLint**: il mio file
> **non è stato lintato da nessuno**. `npm run validate` verde significa «non ho rotto niente»,
> **non** «il codice nuovo è stato controllato». Allo stesso modo `test:mss` prova il validator
> `H-1`, non `mss:query`: la suite non ha una sola prova sul comando che ho appena scritto.
>
> Detto in chiaro: **l'unica prova che `mss:query` dice il vero è quella del §5**, fatta a mano
> risalendo alle capsule d'origine. Un attrezzo che legge i dati di governance e non ha test è un
> candidato naturale per `SK-5` — lo lascio scritto qui perché non vada perso.

**Come si torna indietro:** il lavoro è un file nuovo più una riga in `package.json`. `git revert`
del commit, oppure cancella `scripts/mss/query.mjs` e togli la riga. **Nessun dato è stato toccato**,
quindi non c'è niente da recuperare.

---

## 7. `--gate`: la sesta domanda non è costruibile, e il motivo è un difetto dello schema

Il prompt la declassava; **confermo il declassamento e ho cercato di smentirlo prima di accettarlo.**

Ho ispezionato tutti i campi di `session_event` sulle 42 sedute: **non esiste alcun campo strutturato
per i gate.** Lo stato dei gate vive in prosa dentro `open_items` e `observed_outcome`. Ricavarlo
richiederebbe scavare nel testo libero e produrrebbe falsi allarmi — vietato dalla regola 4.

**È un difetto dello schema della capsula, non un limite del comando**, e va valutato in `SK-4`.
`mss:query -- --fail` lo dichiara a schermo, così chi lo usa non crede di aver ricevuto una risposta
che non c'è.

Stessa sorte per **«quanti file toccati»**: nessun campo lo registra, e il comando non lo stima.
In compenso ho trovato due campi strutturati che *esistono già* e nessuno usava — `packages_loaded`
(277 voci) e `tools_used` (435 voci): `--costo` li mostra per seduta.

**Un dato di `--costo` che vale la pena guardare:** dei 116 controlli registrati, solo **23 sono
stati eseguiti da un comando reale**; **93 da un attore** (un agente che dichiara di aver
controllato). Un controllo eseguito da un comando è riproducibile; uno eseguito da un attore no.

---

## 8. Le due decisioni che aspettano te

**Decisione 1 — `SK-6` è chiuso?** Non lo dichiaro io. La prova richiesta («risponde a 3 domande
reali sulle capsule già esistenti») è soddisfatta e documentata al §5.

**Decisione 2 — qual è il prossimo pacchetto.** Non lo scelgo io, ma la mia **raccomandazione
esplicita è `SK-4`**, e non per affezione: oggi ho incontrato *tre* dei suoi difetti mentre lavoravo
— il filtro cieco sulle sotto-cartelle (§3), lo schema senza campo per i gate (§7), e la coppia
legacy che rende `controls` opzionale (4 record ancora a `mss.session/0.1.0`). Non sono ipotesi da
backlog: mi hanno rallentato oggi.

L'alternativa sensata è `SK-7` (la capsula generata dalla macchina), che risolverebbe alla radice il
problema del §4.1 — ma renderebbe automatico uno schema che sappiamo difettoso. **Prima si aggiusta
lo schema, poi si automatizza la scrittura.**

**Una proposta, non un'azione.** Per generare la capsula di questo report senza inventare orari ho
usato uno script usa-e-getta nella cartella temporanea, non committato, che prende i valori dalla
macchina. Ha funzionato bene. Se vuoi, **`mss:capsule` come attrezzo stabile** è un pacchetto a sé —
non l'ho costruito perché il mio mandato era `SK-6`.

---

## 9. Cinque punti, in concreto

1. **Il quadro.** Le 42 capsule ora si interrogano con un comando, e quello che ne esce è utile:
   tre risposte vere e scomode, non tabelle vuote. La scommessa di `D12` ha pagato.
2. **La tensione principale.** Il sistema si è auto-certificato in 42 sedute su 42 — **ma le review
   indipendenti sono state fatte davvero** (6 controlli, 3 revisori, 3 sedute) e semplicemente non
   sono mai state registrate. Il problema non è che nessuno controlla: è che **il controllo non
   lascia traccia nel campo che lo renderebbe interrogabile.**
3. **La mia raccomandazione.** Prossimo pacchetto **`SK-4`**: oggi ne ho incontrati tre difetti
   lavorando, non leggendo un backlog. Aggiustare lo schema **prima** di automatizzare la scrittura.
4. **Che cosa non deve fare nessuno.** Non allargare il filtro in `scripts/mss/adapter.mjs` (fa
   entrare 22 report insieme: è una tua decisione); non correggere le capsule storiche, nemmeno la
   seduta senza `controls`; non spostare o rinominare file MSS finché `SK-8` non è chiuso;
   non dichiarare superato nessun gate — `SEP-G5` **non** è PASS, `H-1.3` è `PASS_CON_RISERVE`,
   `WP-1` è **NO-GO**.
5. **Il prossimo passo singolo.** Lancia `npm run mss:query -- --verifica` e guarda il blocco «Chi ha
   verificato chi». Sono venti righe, e sono la ragione per cui il resto dello scheletro ha senso.

---

## 10. Dati comunicazione

### 10.1 Prompt di Matteo (annotati)

**Prompt 1 — apertura, verbatim:**

> «leggi il file prompt aperto in ide e il resto del contesto necessario per svolgere il lavoro
> richiesto. procedi quando hai tutte le informazioni»

*Annotazione.* Delega piena a un mandato scritto in anticipo. Le tre parti («leggi il file aperto» ·
«il resto del contesto necessario» · «procedi quando hai tutte le informazioni») sono un permesso a
spendere tempo in lettura **prima** di produrre, e a decidere da solo quando la lettura è finita.
Nessuna ambiguità da risolvere: il file aperto in IDE era il mandato `SK-6` v2, e il mandato conteneva
già perimetro, divieti e criterio di chiusura. **Zero domande di chiarimento necessarie.**

**Prompt 2 — chiusura, verbatim:**

> «fai report completo lavoro svolto. e dammi un piccolo riassunto i chat da passare a agente
> supervisore che revisionerà tua lavoro»

*Annotazione.* Due richieste distinte. La prima è il grilletto «report completo» → comportamento
«lavoro ok» del `VOCABOLARIO.md` (report con tutte le sezioni, **niente commit/push**) — ed è il
motivo per cui esistono le sezioni 10-12. La seconda chiede un handoff per un **revisore**: è la
prima volta in questa seduta che compare la parola, e cade sulla seduta che ha appena misurato che
in 42 sedute nessuna review è mai stata registrata (§4.1).

**Interazione 3 — hook di fine sessione (non un prompt di Matteo).** Il pre-commit e lo stop hook
hanno chiesto il controllo «a mente fredda». Rispondendo ho verificato due voci che non avevo ancora
guardato (`_skill-system-v0/`, `EVOLUZIONE_SKILLS.md`) e ho trovato che **il messaggio dell'hook
afferma il falso**: dice che `_skill-system-v0/` è gitignored, mentre sono **31 file tracciati** e
`git check-ignore` non lo intercetta.

### 10.2 Frasi di Matteo che hanno pesato sulle scelte

Non dette in questa chat, ma vive nel mandato e in `PLAN_V0.md` §16, e usate come criterio:

- *«qualsiasi lavoro fatto da agente è un fatto utile per raccogliere tutte le informazioni di cui lo
  skill system necessita (senza inventare contenuti)»* → è la ragione per cui ogni risposta del
  comando dichiara il proprio perimetro invece di stampare un numero pieno.
- *«un agente può valutare un approccio diverso a un problema»* → è la ragione per cui esiste
  `--json`: il prossimo attrezzo consuma i dati senza ri-parsare il testo.

---

## 11. Dati grezzi della sessione

| Misura | Valore |
|---|---|
| Prompt sostanziali di Matteo | **2** (apertura + chiusura) |
| Correzioni di rotta chieste da Matteo in corsa | **0** |
| Interruzioni degli hook | **3** (1 pre-commit «mente fredda» + 2 stop hook fine-sessione) |
| Script usa-e-getta di ricognizione (mai committati) | **11** + 1 libreria + 1 generatore di capsula |
| Righe di `scripts/mss/query.mjs` | **941** |
| File committati | **4** (1 nuovo attrezzo, 1 riga in `package.json`, report, prompt) |
| Errori intercettati dal validator prima della consegna | **1** |
| Errori miei auto-rilevati e corretti prima della consegna | **6** |
| Capsule storiche modificate | **0** |
| Push eseguiti | **0** |

### 11.1 I sette errori, e da dove venivano

Li elenco perché la loro **derivazione** è più utile del loro numero.

| # | Errore | Da dove veniva | Come è emerso |
|---|---|---|---|
| 1 | Contavo `verified_by` sull'asse Output come «43 verificatori» | ho assunto che il campo avesse la forma del contratto (lista di attori). **È testo libero che nomina comandi**, e 15 valori su 43 dicevano esplicitamente *nessun verificatore* | la riga **contraddiceva** il risultato principale nella stessa schermata |
| 2 | Il generatore di capsula registrava `fail` su tutti i comandi `npm` | su Windows `npm` è `npm.cmd`: `execFileSync` senza `shell:true` fallisce con `ENOENT`, e io convertivo l'errore in exit 1 | i `controls` dicevano `test:mss fail` mentre l'avevo appena visto verde |
| 3 | `alternatives_or_conflicts` scritto come stringa | il contratto dice `[] \| nessuno`, io ho scritto prosa | **preso dal validator**, non da me |
| 4 | Colonna `ctrl` troncata: stampava `nessuno4` | `pad(...,6)` con una parola di 7 caratteri | visibile a occhio nell'output |
| 5 | «29 stringhe» poi «28 regole» senza spiegazione | `owner-unico` compare sotto due versioni | sembrava un'incoerenza del comando |
| 6 | Stavo per presentare `validate` verde come prova che il codice nuovo è pulito | **ESLint gira su `--ext ts,tsx` e ignora `scripts/`** | ho controllato invece di assumere, e ho corretto la tabella dei cancelli |
| 7 | Il conteggio capsule non tornava (43 contro 42) | due misure diverse (intestazione vs record) | riconciliato con `sha256`, **non** adeguato |

**Il pattern.** Cinque errori su sette (1, 2, 4, 5, 6) li ha trovati **il fatto di guardare l'output
vero** invece di fidarmi di quello che il codice avrebbe dovuto fare. Uno (3) l'ha preso una macchina.
Uno (7) non era un errore ma una differenza di definizione, e sarebbe passato inosservato se avessi
accettato il numero del mandato.

### 11.2 Difficoltà incontrate

1. **Il dato peggiore del previsto era quello che sembrava migliore.** `asserted_by.basis` vale
   `direct_observation` in 115 annotazioni su 126: a prima vista sembra un sistema che osserva. Ma il
   contratto tiene `basis` (come nasce la dichiarazione) separata da `verification` (chi l'ha
   controllata), e i dati rispettano la separazione. Presentarli insieme avrebbe fatto sembrare
   verificato ciò che è solo osservato da chi lo dichiara.
2. **Due filtri identici in due file, con conseguenze opposte.** `adapter.mjs` (perimetro del
   pre-commit, **vietato toccare**) e `git-adapter.mjs` (cosa il sistema riesce a leggere, da
   allargare). Stessa regex, esiti opposti. Ho scritto il filtro nuovo **nel mio file**, senza
   toccare nessuno dei due.
3. **Generare la capsula senza sforare dal mandato.** Il mandato vietava di costruire un generatore
   come strumento del repo e vietava gli orari a memoria. La via è stata lo script usa-e-getta fuori
   dal repo — che però ha prodotto l'errore 2, il più pericoloso della seduta.

---

## 12. La mia lettura della qualità — dati, non voto

> Espressa come **versione dell'agente**, secondo la regola di raccolta dati: il voto sintetico lo dà
> il revisore confrontando le versioni. Le contraddizioni fra la mia lettura e la sua sono un dato
> utile, non un problema da evitare.

### 12.1 Skill system

**Ha funzionato.** `npm run mss:status` come primo comando ha dato lo stato in una schermata: è la
prova pratica del requisito `R3` («conoscere lo stato costa un comando, non dieci file»). I 7 file del
materiale d'ingresso sono bastati, **zero ricerche a tappeto**.

**Non ha funzionato, in ordine di gravità:**

1. **L'enforcement dipende dalla superficie.** Su Claude Code non ho ricevuto nessun hook durante il
   lavoro. Ho scritto la capsula perché il mandato me l'ha chiesto. Se il mandato non l'avesse
   chiesto, niente mi avrebbe fermato — ed è **lo stesso identico buco** che al §4.1 fa risultare
   `verified_by` vuoto in 126 annotazioni su 126. La causa dei due fenomeni è una sola.
2. **Un attrezzo di governance senza test.** `ESLint` non copre `scripts/`, `test:mss` non esercita
   `mss:query`. Il comando che d'ora in poi risponde alle domande sui dati di governance **non ha una
   sola prova automatica**. Oggi funziona perché l'ho verificato a mano.
3. **Il messaggio dello stop hook afferma il falso** su `_skill-system-v0/` (dice gitignored, sono 31
   file tracciati). Un hook che dà un'istruzione sbagliata a ogni sessione costa più di un hook assente.
4. **`rule_id_version` è testo libero.** Metà del lavoro su `--regole` è stato progettare attorno a un
   difetto dei dati invece che attorno alla domanda.

### 12.2 Efficienza

- **Buona sulla lettura:** contesto mirato, nessun file aperto a vuoto.
- **Buona sul riuso:** `parse.mjs` e `rules.mjs` riusati senza modificarli. `findRepoRoot()` invece
  **reimplementato** — `status.mjs` stampa il proprio report già al caricamento, quindi importarlo
  avrebbe stampato lo status dentro `mss:query`. È un piccolo difetto di forma di `status.mjs`
  (script e libreria nello stesso file) che ha causato una duplicazione di 10 righe.
- **Costo evitabile:** i 13 script di ricognizione. Con `mss:query` che ora esiste, la prossima
  seduta che deve capire qualcosa sulle capsule spende **un comando** invece di scriverne 13. È
  esattamente il risparmio che `R3` chiede, e questa seduta è l'ultima che lo paga.

### 12.3 Chiarezza dei prompt

Il mandato `SK-6` v2 è il prompt più utile che abbia letto in questo repo, e vale la pena dire
**perché**, così la forma si può ripetere:

- **Le trappole erano scritte accanto alla domanda**, non in una sezione «avvertenze» a parte.
  Leggendo `--modelli` sapevo già delle tre trappole prima di scrivere una riga.
- **Le misure di orientamento del §2-bis con l'istruzione «se i tuoi numeri sono diversi, non
  assumere che questi abbiano ragione».** È ciò che ha prodotto il risultato migliore della seduta:
  senza quella riga avrei scritto 42 e sarei andato avanti.
- **I divieti avevano il motivo accanto.** «Non toccare `adapter.mjs`» da solo si aggira per
  distrazione; «non toccarlo *perché* fa entrare 22 report insieme ed è una decisione di Matteo» no.
- **Dichiarava che un esito negativo è un risultato valido.** Ha tolto la pressione a far sembrare
  che dalle capsule uscisse qualcosa di buono.

**L'unico difetto:** il §2-bis dava «42 file `.md` con blocco capsula» come misura singola, mentre
sono due misure diverse (43 con intestazione, 42 con record). Il prompt stesso avvisava di non
forzare i conti, quindi il difetto si è auto-corretto — ma è la dimostrazione che **anche una misura
data per verificata va rimisurata**.

### 12.4 Osservazioni e consigli

1. **`M5` di `EVOLUZIONE_SKILLS.md` e `SK-6` sono lo stesso lavoro arrivato da due binari.** `M5`
   prevede «eventuale script di conteggio» sui report; `mss:query` conta sulle capsule. Vanno
   riconciliate, o fra un mese qualcuno costruisce due volte la stessa cosa.
2. **Se `SK-4` ri-versiona il contratto, tre campi vanno cambiati insieme:** `rule_id_version` →
   array di `{rule_id, version}`; un campo strutturato per i **gate**; un campo per i **file toccati**.
   Sono i tre buchi che ho incontrato oggi, e toccano tutti lo stesso file.
3. **`status.mjs` andrebbe diviso** in libreria + entry point, così `findRepoRoot()` si importa invece
   di riscriverlo. Costo stimato: dieci minuti. Vale la pena farlo **dentro** `SK-4` o `SK-5`, non da solo.
4. **Il revisore di questa seduta dovrebbe girare su una famiglia di modello diversa dalla mia**
   (io sono Anthropic `claude-opus-5`). Non è una formalità: è il vincolo di `PLAN_V0.md` §16.3, ed è
   la regola che questa stessa seduta ha misurato non essere mai stata applicata. Applicarla qui la
   renderebbe vera per la prima volta.

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Due. **(1)** «leggi il file prompt aperto in ide e il resto del contesto necessario per svolgere il lavoro richiesto. procedi quando hai tutte le informazioni» — il file aperto era `docs/Sessioni di lavoro/22-08-26/Prompt-sk6-mss-query-v2-22-08-26.md` (mandato `SK-6` v2). **(2)** «fai report completo lavoro svolto. e dammi un piccolo riassunto i chat da passare a agente supervisore che revisionerà tua lavoro» — grilletto «report completo» → comportamento «lavoro ok» del `VOCABOLARIO.md`: report con tutte le sezioni (§10-12 aggiunte per questo), **niente commit e niente push**. Nessuna correzione di rotta fra i due: il lavoro tecnico è stato eseguito in autonomia sul mandato scritto. Annotazioni in §10.1.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ogni cifra è misurata in questa seduta, nessuna ereditata dal §2-bis del prompt. Censimento indipendente delle capsule prima di scrivere una riga di codice (`git ls-tree` + parser), poi riprodotto dal comando finito: 10 righe su 11 del §2-bis coincidono identiche. L'undicesima (42 vs 43) l'ho aperta invece di adeguarmi, e ho verificato lo `sha256` del file a `HEAD` contro la costante `HISTORICAL_MODE_EXCEPTION` di `parse.mjs`: coincide. Cecità del filtro stretto misurata eseguendo davvero `collectGitHeadHistory()` e contando le capsule con record: 36 contro 42. Tre affermazioni del comando tracciate ai report d'origine con `git show`/`git grep` (§5). `verified_by` su asse Output ispezionato a mano — 25 valori distinti — dopo che una mia prima versione lo contava come «43 verificatori»: era **testo libero che nomina comandi**, e la riga era fuorviante; corretta prima di consegnare. `npm run test:mss` e `npm run validate` eseguiti, exit code veri. I `controls` della capsula sono generati dall'output reale dei comandi, non dichiarati a memoria.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Toccati **2 file**: `scripts/mss/query.mjs` (nuovo) e `package.json` (una riga). **Non** allineati di proposito: `PLAN_V0.md` §4-bis (lo stato di `SK-6` lo dichiari tu, non io — §7 del mandato); `scripts/mss/adapter.mjs` (vietato, è `SK-4`); `ROADMAP_V0.md`, `HANDOFF_SENIOR_V0.md`, `MSS-REPORT-INDEX.md`, `SESSION_LOG.md` (sono le viste, e la decisione `D14` è di **generarle**: aggiornarle a mano pagherebbe il costo che quella decisione elimina). Nessuna capsula storica toccata. Riusati senza modificarli: `parse.mjs`, `rules.mjs`, e la strategia `findRepoRoot()` di `status.mjs` — reimplementata anziché importata perché `status.mjs` stampa il proprio report già al caricamento.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non ho costruito `--gate`: ho verificato che non esiste alcun campo strutturato per i gate e l'ho dichiarato come difetto dello schema (§7). Non ho stimato «file toccati» per la stessa ragione. Non ho aperto nessun altro pacchetto `SK-*`. Non ho creato il tag di ripristino (`SK-1`), non ho toccato la CI (`SK-5`), non ho corretto i 17 path rotti (`SK-2`). Non ho costruito `mss:capsule`: proposto, non fatto. Non ho pushato. **Non ho fatto revisionare questo lavoro da nessuno: sono io l'autore, e per lo stesso criterio del §4.1 questa capsula è `self_report`.** Non ho dichiarato `SK-6` chiuso.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito principale: **il campo `rule_id_version` è testo libero**, e mi ha costretto a progettare metà della risposta `--regole` attorno a un difetto dei dati invece che attorno alla domanda. Sei stringhe ne citano fino a cinque regole con un solo punteggio: non sono aggregabili, e nessun comando potrà mai renderle tali. Miglioria: renderlo un **array di riferimenti** `{rule_id, version}` nello schema — il posto giusto è `SK-4`. Secondo attrito, più insidioso: **due filtri identici in due file diversi** (`adapter.mjs` e `git-adapter.mjs`) con conseguenze opposte — uno definisce cosa il pre-commit controlla, l'altro cosa il sistema riesce a leggere. Allargare il secondo era necessario, allargare il primo è vietato: se fossero stati la stessa costante condivisa avrei rotto qualcosa senza accorgermene.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook ti sono stati utili o rumore?
✅ R6: Contesto **giusto e ben mirato**: `npm run mss:status` come primo comando mi ha dato lo stato in una schermata, e i 7 file del §8 del mandato sono bastati — nessuna ricerca a tappeto. È la prova pratica del requisito `R3`. Il prompt v2 valeva il suo peso: i sei punti che correggeva erano tutti reali, e le sue misure di orientamento mi hanno permesso di **incrociare** i miei numeri invece di fidarmi — è così che è saltato fuori il 42-vs-43. Hook: **nessuno ricevuto in questa superficie** (Claude Code); il pre-commit git invece varrà al commit. Ho scritto la capsula perché il mandato me l'ha chiesto, non perché qualcosa me l'abbia imposto: è il bypass di superficie già noto, e questa è l'ennesima istanza. **Una nota per `SK-5`:** il fatto che io possa dimenticarmene senza che nulla mi fermi è lo stesso identico buco che al §4.1 fa risultare `verified_by` vuoto in 126 annotazioni su 126.

---

## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-01a0294a-aa53-75d6-960c-ef9d7847f46f","session_id":"mss-ses-01a0294a-aa53-7905-bd1c-e8583922a38e","correlation_id":"mss-cor-01a0294a-aa53-7d90-bb0e-6b379f9314c0","segment_no":1,"capture_key":"mss-ses-01a0294a-aa53-7905-bd1c-e8583922a38e/1/session_event/1","created_at":"2026-08-22T13:45:54+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus5-sk6","actor_type":"agente","role":"agente senior esecutore SK-6","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["Bash","Read","Write","Edit","git","node","npm"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"source-contratto"},{"package_id":"SYS-1/PLAN_V0","package_version_or_revision":"sezione 16 + 4-bis","source_ref":"owner-plan"},{"package_id":"STRATEGIA-scheletro","package_version_or_revision":"21-08-26 sezione 3.3","source_ref":"source-strategia"},{"package_id":"CLAUDE.md","package_version_or_revision":"repo root .claude","source_ref":"source-routing"}],"event":{"event_id":"mss-evt-01a0294a-aa53-7868-9d81-a3e0e75ecd99","event_kind":"session_close","occurred_at":"2026-08-22T13:45:54+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"leggere il prompt SK-6 aperto in IDE, caricare il contesto necessario e procedere in autonomia","session_type":"deep","capsule_status":"completa","role_key":"agente-senior-esecutore","area":"MetaSkillSystem / scheletro SK-6","environment":"workspace locale su env/test, nessun accesso database","authorization":{"read":["docs/MetaSkillSystem/**","docs/Sessioni di lavoro/**","scripts/mss/**","package.json",".claude/CLAUDE.md"],"write":["scripts/mss/query.mjs","package.json","docs/Sessioni di lavoro/22-08-26/**"],"forbid":["scripts/mss/adapter.mjs","src/**","supabase/**","docs/_lavoro/**","move o rename di file MSS","push","git distruttivo","capsule storiche"]},"authorized_outputs":["scripts/mss/query.mjs","riga mss:query in package.json","Report-sk6-mss-query-22-08-26.md"],"route":{"chosen":"PLAN_V0 sezione 16 + STRATEGIA sezione 3.3 + contratto capsula + parse.mjs/rules.mjs/status.mjs","alternatives_or_conflicts":["STRATEGIA sezione 3.3 prescrive sei domande; il mandato SK-6 v2 ne prescrive cinque e vince il mandato","riuso di collectGitHeadHistory scartato: il suo filtro non vede 6 capsule su 42"]},"observed_outcome":"mss:query costruito e registrato; legge 43 capsule con record da 44 file con intestazione (1 eccezione storica riconosciuta per hash da parse.mjs), 173 record, 43 sedute, 0 righe malformate. Le tre domande di chiusura rispondono e sono state provate a campione risalendo ai report di origine. Risultato principale: independently_verified 0 su 129 e verified_by vuoto in tutte, mentre 6 controlli risultano eseguiti da attori il cui id contiene reviewer in 3 sedute: le review sono avvenute e non sono state registrate. La divergenza 42 contro 43 e stata aperta e risolta con prova sha256, non per adeguamento.","open_items":["SK-6 non e dichiarato chiuso: la decisione e di Matteo","mss:query non ha alcun test automatico; ESLint non copre scripts/ e test:mss non lo esercita","la storia dei gate non e interrogabile: lo schema della capsula non ha un campo per i gate (SK-4)","rule_id_version e testo libero: 6 stringhe citano piu regole con un solo G/O/E (SK-4)","il filtro [^/]+ di adapter.mjs resta invariato per divieto esplicito: e SK-4","questa capsula e self_report: nessuna review indipendente eseguita sul lavoro di oggi"],"subject_runtime":{"actor_id":"non_applicabile:soggetto documentale","provider":"non_applicabile:le 42 capsule osservate provengono da tre provider diversi","model":"non_applicabile:soggetto documentale","runtime":"non_applicabile:soggetto documentale","surface":"non_applicabile:soggetto documentale"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metriche aggregate sulle capsule","path di file tracciati","esiti di comandi"],"prohibited_content":["contenuti di docs/_lavoro/","dati personali"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"controls":[{"control_id":"SK6-TEST-MSS","criterio":"npm run test:mss resta verde dopo il file nuovo","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"comando: npm run test:mss","evidence_refs":["source-report"]},{"control_id":"SK6-VALIDATE-GLOBAL","criterio":"npm run validate globale resta verde con 163 file e 1346 test","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"comando: npm run validate (exit 0)","evidence_refs":["source-report"]},{"control_id":"SK6-TRE-DOMANDE","criterio":"le tre domande del criterio di chiusura rispondono con exit 0","esito":"pass","numeratore":3,"denominatore":3,"esecutore":"comando: npm run mss:query con --regole --modelli --verifica","evidence_refs":["source-report"]},{"control_id":"SK6-PROVE-A-CAMPIONE","criterio":"tre affermazioni del comando tracciate al report di origine con git show e git grep","esito":"pass","numeratore":3,"denominatore":3,"esecutore":"anthropic-claude-opus5-sk6 + git show/git grep","evidence_refs":["source-report","owner-capsule-storiche"]},{"control_id":"SK6-SOTTOCARTELLA","criterio":"le capsule invisibili a collectGitHeadHistory vengono lette dal comando nuovo","esito":"pass","numeratore":6,"denominatore":6,"esecutore":"comando: confronto collectGitHeadHistory 36 contro mss:query 42","evidence_refs":["source-report"]},{"control_id":"SK6-CENSIMENTO-2BIS","criterio":"le 11 misure di orientamento del prompt ri-misurate in autonomia dal comando","esito":"pass","numeratore":11,"denominatore":11,"esecutore":"comando: node scripts/mss/query.mjs --json","evidence_refs":["source-prompt","source-report"]},{"control_id":"SK6-DIVERGENZA-42-43","criterio":"la divergenza sul conteggio capsule risolta con prova e non per adeguamento","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"comando: sha256 del file a HEAD contro la costante di parse.mjs","evidence_refs":["source-report"]},{"control_id":"SK6-FALSO-POSITIVO","criterio":"la riga fuorviante su verified_by asse Output ristretta finche il falso positivo sparisce","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"anthropic-claude-opus5-sk6 su 25 valori distinti ispezionati","evidence_refs":["source-report"]},{"control_id":"SK6-NODE-CHECK","criterio":"il file nuovo e sintatticamente valido, dato che ESLint non copre scripts/","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"comando: node --check scripts/mss/query.mjs","evidence_refs":["source-report"]},{"control_id":"SK6-ZERO-DATI-TOCCATI","criterio":"nessuna capsula storica e nessun file di dati modificato","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"comando: git status --porcelain","evidence_refs":["source-report"]}],"owner_refs":[{"ref_id":"owner-plan","owner_id":"SYS-1","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"sezione 4-bis SK-6","revision_or_hash":"e92b177","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-contratto","owner_id":"MSS","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"avviso di disallineamento 21-08","revision_or_hash":"e92b177","sensitivity":"internal"},{"ref_id":"source-strategia","owner_id":"MSS","uri_or_path":"docs/Sessioni di lavoro/21-08-26/STRATEGIA-scheletro-mss-21-08-26.md","stable_anchor_or_event_id":"sezione 3.3","revision_or_hash":"e92b177","sensitivity":"internal"},{"ref_id":"source-prompt","owner_id":"MSS","uri_or_path":"docs/Sessioni di lavoro/22-08-26/Prompt-sk6-mss-query-v2-22-08-26.md","stable_anchor_or_event_id":"sezione 2-bis","revision_or_hash":"working tree","sensitivity":"internal"},{"ref_id":"source-report","owner_id":"SK-6","uri_or_path":"docs/Sessioni di lavoro/22-08-26/Report-sk6-mss-query-22-08-26.md","stable_anchor_or_event_id":"sezioni 2-7","revision_or_hash":"working tree","sensitivity":"internal"},{"ref_id":"source-routing","owner_id":"repo","uri_or_path":".claude/CLAUDE.md","stable_anchor_or_event_id":"instradamento aree","revision_or_hash":"e92b177","sensitivity":"internal"},{"ref_id":"owner-capsule-storiche","owner_id":"MSS","uri_or_path":"docs/Sessioni di lavoro","stable_anchor_or_event_id":"42 capsule a HEAD","revision_or_hash":"e92b177","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-01a0294a-aa53-7c55-a424-a44cc64c1390","session_id":"mss-ses-01a0294a-aa53-7905-bd1c-e8583922a38e","correlation_id":"mss-cor-01a0294a-aa53-7d90-bb0e-6b379f9314c0","segment_no":1,"capture_key":"mss-ses-01a0294a-aa53-7905-bd1c-e8583922a38e/1/annotation/1","created_at":"2026-08-22T13:45:54+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus5-sk6","actor_type":"agente","role":"agente senior esecutore SK-6","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["Bash","Read","Write","Edit","git","node","npm"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"source-contratto"},{"package_id":"SYS-1/PLAN_V0","package_version_or_revision":"sezione 16 + 4-bis","source_ref":"owner-plan"},{"package_id":"STRATEGIA-scheletro","package_version_or_revision":"21-08-26 sezione 3.3","source_ref":"source-strategia"},{"package_id":"CLAUDE.md","package_version_or_revision":"repo root .claude","source_ref":"source-routing"}],"annotation":{"annotation_id":"mss-ann-01a0294a-aa53-7ff2-a095-df530ec3e2f0","axis":"sistema","subject_record_ids":["mss-rec-01a0294a-aa53-75d6-960c-ef9d7847f46f"],"delta":"creato","assertions":[{"rule_id_version":"SK-6@mss.session/0.1.1","trigger_event":"mandato SK-6 v2: costruire il lettore delle capsule esistenti","decision_or_output_changed":"le 42 capsule sono interrogabili per la prima volta; il filtro di lettura e stato allargato alle sotto-cartelle nel solo file nuovo, senza toccare il perimetro del pre-commit","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"anthropic-claude-opus5-sk6","role":"agente senior esecutore SK-6","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-prompt","evidence_refs":["source-report"],"notes":"esito misurato eseguendo i comandi; nessun revisore indipendente ha controllato questo lavoro, coerentemente con il divario descritto nel report"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-01a0294a-aa54-757f-a5b9-779fe544e3be","session_id":"mss-ses-01a0294a-aa53-7905-bd1c-e8583922a38e","correlation_id":"mss-cor-01a0294a-aa53-7d90-bb0e-6b379f9314c0","segment_no":1,"capture_key":"mss-ses-01a0294a-aa53-7905-bd1c-e8583922a38e/1/annotation/2","created_at":"2026-08-22T13:45:54+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus5-sk6","actor_type":"agente","role":"agente senior esecutore SK-6","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["Bash","Read","Write","Edit","git","node","npm"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"source-contratto"},{"package_id":"SYS-1/PLAN_V0","package_version_or_revision":"sezione 16 + 4-bis","source_ref":"owner-plan"},{"package_id":"STRATEGIA-scheletro","package_version_or_revision":"21-08-26 sezione 3.3","source_ref":"source-strategia"},{"package_id":"CLAUDE.md","package_version_or_revision":"repo root .claude","source_ref":"source-routing"}],"annotation":{"annotation_id":"mss-ann-01a0294a-aa54-7183-8003-6364842fb8bc","axis":"output","subject_record_ids":["mss-rec-01a0294a-aa53-75d6-960c-ef9d7847f46f"],"delta":"creato","assertions":[{"output_id":"mss-query-v0","primary_type":"prodotto","canonical_version":"scripts/mss/query.mjs prima versione","recipient":"Matteo e gli agenti che lavorano sul MetaSkillSystem","problem_or_job":"interrogare le capsule gia scritte senza rileggere 42 report","intended_use":"rispondere a cinque domande sulle capsule in sola lettura","conceived_by":"Matteo (decisione D12) su proposta del consulente esterno","decided_by":"Matteo","directed_by":"mandato SK-6 v2","authored_by":"anthropic-claude-opus5-sk6","verified_by":"controlli locali eseguiti dai comandi; nessun revisore indipendente","acceptance_criterion":"risponde a tre domande reali sulle capsule esistenti, con risposte verificabili a campione","verification_or_use_evidence":"tre affermazioni tracciate ai report di origine (report sezione 5); test:mss e validate verdi","verification_status":"self_report","owner_ref":"owner-plan","privacy_release":"requires_confirmation","support_files":["package.json"],"relations_no_double_count":["supporta SK-7 e SK-4 senza sostituirli"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"anthropic-claude-opus5-sk6","role":"agente senior esecutore SK-6","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-prompt","evidence_refs":["source-report"],"notes":"il quinto gate resta fail per scelta dichiarata: evidenza di verifica a campione dell autore, non di uso indipendente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-01a0294a-aa54-731b-9fe3-aa6b043cdf14","session_id":"mss-ses-01a0294a-aa53-7905-bd1c-e8583922a38e","correlation_id":"mss-cor-01a0294a-aa53-7d90-bb0e-6b379f9314c0","segment_no":1,"capture_key":"mss-ses-01a0294a-aa53-7905-bd1c-e8583922a38e/1/annotation/3","created_at":"2026-08-22T13:45:54+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus5-sk6","actor_type":"agente","role":"agente senior esecutore SK-6","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["Bash","Read","Write","Edit","git","node","npm"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"source-contratto"},{"package_id":"SYS-1/PLAN_V0","package_version_or_revision":"sezione 16 + 4-bis","source_ref":"owner-plan"},{"package_id":"STRATEGIA-scheletro","package_version_or_revision":"21-08-26 sezione 3.3","source_ref":"source-strategia"},{"package_id":"CLAUDE.md","package_version_or_revision":"repo root .claude","source_ref":"source-routing"}],"annotation":{"annotation_id":"mss-ann-01a0294a-aa54-7ce2-85a4-a5d801e8f323","axis":"persona","subject_record_ids":["mss-rec-01a0294a-aa53-75d6-960c-ef9d7847f46f"],"delta":"nessuno","assertions":[{"signal":"Matteo ha delegato la seduta a un mandato scritto in anticipo, senza intervenire in corsa","actor":"Matteo","assistance":"spontaneo","origin":"naturale","source_ref":"source-prompt","effect":"la seduta e stata eseguita in autonomia; nessuna correzione di rotta e stata necessaria","evidence_state":"observed"}],"asserted_by":{"actor_id":"anthropic-claude-opus5-sk6","role":"agente senior esecutore SK-6","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"source-prompt","evidence_refs":["source-prompt"],"notes":"segnale osservato su una sola seduta: non alza alcun livello e non e una valutazione"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"amendment","record_id":"mss-rec-01a02b38-1945-7cd4-9709-7a450dc0464f","session_id":"mss-ses-01a0294a-aa53-7905-bd1c-e8583922a38e","correlation_id":"mss-cor-01a0294a-aa53-7d90-bb0e-6b379f9314c0","segment_no":1,"capture_key":"mss-ses-01a0294a-aa53-7905-bd1c-e8583922a38e/1/amendment/1","created_at":"2026-08-22T22:44:51+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-sonnet5-fix-sk6","actor_type":"agente","role":"agente senior esecutore fix-SK-6","agent_runtime":{"provider":"Anthropic","model":"claude-sonnet-5","runtime":"Claude Code","surface":"CLI locale"},"tools_used":["Bash","Read","Edit","Write","git","node","npm"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"},{"package_id":"CONTRATTO_CAPSULA_SESSIONE_V0","package_version_or_revision":"sezione 5-6 amendment","source_ref":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md"},{"package_id":"Prompt-fix-sk6-esecutore-22-08-26","package_version_or_revision":"22-08-26","source_ref":"docs/Sessioni di lavoro/22-08-26/Prompt-fix-sk6-esecutore-22-08-26.md"},{"package_id":"Addendum-mandato-fix-sk6-22-08-26","package_version_or_revision":"22-08-26","source_ref":"docs/Sessioni di lavoro/22-08-26/Addendum-mandato-fix-sk6-22-08-26.md"}],"amendment":{"amendment_id":"mss-amd-01a02b38-1945-7143-a818-b567564aed7d","target_record_id":"mss-rec-01a0294a-aa53-75d6-960c-ef9d7847f46f","relation":"amends","reason":"Il session_event dichiara la seduta chiusa (event_kind: session_close, finalization: final) alle 13:45:54, ma il report SK-6 (docs/Sessioni di lavoro/22-08-26/Report-sk6-mss-query-22-08-26.md) e stato esteso alle 22:16 con le sezioni 10-12, scritte DOPO quella chiusura: un secondo prompt sostanziale di Matteo, tre interruzioni degli hook (1 pre-commit + 2 stop hook) e 170 righe di report in piu. Chi interroga l'archivio con mss:query vedeva una seduta chiusa alle 13:45 senza sapere che esiste meta del report: il testo e il record macchina non dicevano la stessa cosa. Non e un errore di orario isolato: la seduta ha avuto un secondo segmento reale che il record non descriveva. Il contratto (CONTRATTO_CAPSULA_SESSIONE_V0.md §5-6) impone che il segment_no di questo amendment resti identico a quello del session_event del bundle — il secondo segmento si racconta in reason e in observed_outcome, non in un segment_no diverso, altrimenti il validator segnala SESSION_MISMATCH. Nessun record final viene riscritto: questa e la rettifica in coda che il contratto prescrive.","changes":[{"field_path":"event.observed_outcome","previous_value_or_hash":"mss:query costruito e registrato; legge 43 capsule con record da 44 file con intestazione (1 eccezione storica riconosciuta per hash da parse.mjs), 173 record, 43 sedute, 0 righe malformate. Le tre domande di chiusura rispondono e sono state provate a campione risalendo ai report di origine. Risultato principale: independently_verified 0 su 129 e verified_by vuoto in tutte, mentre 6 controlli risultano eseguiti da attori il cui id contiene reviewer in 3 sedute: le review sono avvenute e non sono state registrate. La divergenza 42 contro 43 e stata aperta e risolta con prova sha256, non per adeguamento.","corrected_value":"mss:query costruito e registrato; legge 43 capsule con record da 44 file con intestazione (1 eccezione storica riconosciuta per hash da parse.mjs), 173 record, 43 sedute, 0 righe malformate. Le tre domande di chiusura rispondono e sono state provate a campione risalendo ai report di origine. Risultato principale: independently_verified 0 su 129 e verified_by vuoto in tutte, mentre 6 controlli risultano eseguiti da attori il cui id contiene reviewer in 3 sedute: le review sono avvenute e non sono state registrate. La divergenza 42 contro 43 e stata aperta e risolta con prova sha256, non per adeguamento. RETTIFICA POST-CHIUSURA (mss-amd-01a02b38-1945-7143-a818-b567564aed7d, effective_at 2026-08-22T22:44:51+02:00): questo record descrive solo il primo segmento della seduta, chiuso qui alle 13:45:54. La seduta e proseguita in un secondo segmento reale — un secondo prompt di Matteo («fai report completo lavoro svolto...»), tre interruzioni degli hook (1 pre-commit + 2 stop hook) e le sezioni 10-12 del report (170 righe in piu) — tutti fatti successivi a questa chiusura e assenti da questo record. Il numero «6 controlli in 3 sedute» sopra riflette il solo criterio esecutore dei controls, in vigore al momento della chiusura; il mandato fix-SK-6 lo ha corretto leggendo recorded_by.role della seduta: il numero che ne esce e 19 controlli in 5 sedute — non una correzione dello stesso conteggio ma una domanda diversa (chi ha condotto la seduta, non chi ha eseguito il singolo controllo). Dettaglio in docs/Sessioni di lavoro/22-08-26/Report-fix-sk6-22-08-26.md."}],"evidence_refs":["source-report"],"effective_at":"2026-08-22T22:44:51+02:00"}}
```
