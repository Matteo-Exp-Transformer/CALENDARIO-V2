# Mandato — `SK-7` · `mss:capsule` (la capsula generata dalla macchina)

> Data: 23-08-2026 · **Agente: DA ASSEGNARE** — Matteo sceglie fra Codex e Cursor in base ai token
> disponibili · Catena: **indipendente** dagli altri mandati della cartella.

## ⚠️ Questo file NON è il mandato completo. È lo strato di aggiornamento.

Il mandato vero esiste già ed è ancora valido:

> **`docs/Sessioni di lavoro/22-08-26/Prompt-sk7-mss-capsule-22-08-26.md`** — 365 righe, 12 sezioni.
> Leggilo **per intero**: contiene il problema, i tre livelli di campo, i `controls` con codici di
> uscita veri, i divieti, le prove di chiusura, il backlog escluso e l'obiezione da conoscere prima
> di cominciare.

Questo file dice **soltanto che cosa è cambiato dal 22-08 al 23-08**, perché ricopiarlo sarebbe una
violazione del principio `D18` dichiarato da Matteo: *«dobbiamo snellire, non duplicare»*.

**Ordine di lettura: prima il mandato del 22-08, poi questo. Dove divergono, vince questo.**

## 1. Il prerequisito è soddisfatto — ora si può aprire

Il 22-08 `SK-7` era bloccato da una regola precisa (`D12`): **prima il lettore, poi lo scrittore**.
Un generatore che scrive dentro un archivio non presidiato *moltiplica* i difetti invece di
ridurli.

Al 23-08-26 il presidio esiste, ed è provato:

| Cosa | Stato | Perché conta per te |
|---|---|---|
| `SK-6` — `mss:query` | **CHIUSO** (`D16`) | il lettore c'è, e applica la catena degli `amendment`: quello che genererai sarà **rileggibile e confrontabile**, non solo scrivibile |
| `SK-4` — tre bypass | **provato** | capsula legacy senza `controls`, report in sotto-cartella, prefisso `Verbale-`: tutti e tre respinti. Il tuo generatore **non** potrà infilare capsule da una porta di servizio |
| `SK-11` — test attrezzi | **provato** | `npm run test:mss:tools` (16 test) e `npm run lint:scripts`: da oggi il lint **vede** `scripts/`. Il codice che scrivi nasce dentro una rete, non fuori |
| `SK-5` — CI su `env/test` | **provato** | il job `mss` valida ogni `Report-*.md` e `Verbale-*.md` aggiunto o modificato. **Una capsula non valida rende la CI rossa** |

Quest'ultima riga è la novità che cambia il tuo lavoro: fino a ieri un generatore che avesse emesso
una capsula sbagliata l'avrebbe scoperto solo se qualcuno guardava. **Da oggi lo scopre la
macchina.** Puoi sbagliare in sicurezza — ed è esattamente la condizione che mancava.

## 2. Numeri aggiornati (il mandato del 22-08 ne cita di più vecchi)

Il corpus è quasi raddoppiato in un giorno. Al 23-08-26 sera: **60 file con capsula, 245 record,
59 sedute, 177 annotazioni di verifica**. Nella vista effettiva `independently_verified` e
`contradicted` valgono **1 e 1** (erano 0 e 0 nei record grezzi: è la catena degli `amendment` che
li rende visibili).

Sono numeri **mobili**: crescono a ogni seduta registrata. **Non fissarli nel tuo report.** Per il
valore del giorno in cui lavori lancia `npm run mss:query -- --verifica`.

## 3. Decisioni nuove, tutte vincolanti per te

| ID | Decisione | Cosa significa per `mss:capsule` |
|---|---|---|
| `D16` | `SK-6` è **chiuso** | non riaprirlo, non «migliorare» `query.mjs` per far tornare i conti del generatore |
| `D17` | cambio di famiglia del revisore = **avviso, non cancello** | consigliato chiedere una revisione di famiglia diversa; la validazione **non** decade se manca |
| `D18` | **snellire, non duplicare** | il tuo generatore **importa** le regole già scritte (`core.mjs`, `rules.mjs`, `canonical.mjs`), non le riscrive. Se un export non c'è, **si aggiunge**. Se il perimetro sembra costringerti a una copia, **fermati e chiedi a Matteo di allargarlo** |
| `M3` | nessun `CHIUSO` con riserve | non dichiarare chiuso il pacchetto: la dichiarazione è di Matteo |

`D18` è la trappola numero uno del tuo lavoro. Un generatore di capsule ha bisogno di sapere che
cos'è una capsula valida — e quella conoscenza **esiste già** nel validator. Se ti ritrovi a
scrivere una seconda volta la definizione di un campo obbligatorio, hai sbagliato strada.

## 4. Il divieto in più rispetto al 22-08

`scripts/mss/adapter.mjs` era intoccabile fuori da `SK-4`. `SK-4` è finito, quindi il divieto
storico è superato — **ma la costante `REPORT_PATH_RE` che vive lì è ora condivisa** fra
`adapter.mjs`, `git-adapter.mjs`, `query.mjs` e l'helper CI `validate-changed-reports.mjs`.
Toccarla significa toccare quattro consumatori insieme, CI compresa. Se ti serve cambiarla,
**dichiaralo a Matteo prima**, con l'elenco dei quattro punti che ne dipendono.

## 5. Come chiudere (integra §10 del mandato 22-08)

Alle prove già richieste aggiungi queste, nate dopo:

1. `npm run test:mss:tools` → exit 0, con il **numero** di test
2. `npm run lint:scripts` → exit 0, zero warning (il tuo codice `.mjs` è ora sotto lint)
3. `npm run validate` → exit 0
4. `npm run validate:docs` → riporta il valore che trovi: **17 path rotti** è la linea di base del
   23-08, ma un mandato parallelo la sta portando a 0. Non «correggerla» tu: **misurala e basta**
5. **una capsula generata dal tuo attrezzo passa il validator**:
   `npm run validate:mss -- --mode file --file "<report generato>" --kind report --require-capsule`
   → `validate:mss OK`
6. **e una capsula volutamente rotta viene respinta**: rompi un campo obbligatorio, mostra il rosso
   e il codice della regola, ripristina. Un generatore che non sa produrre nulla di rifiutabile non
   è stato provato
7. `git diff --check` → exit 0 (è già stata una prova falsa una volta: verificala davvero)

## 6. Trappole già pagate (non ripagarle)

| Trappola | Cosa fare |
|---|---|
| `crypto.randomUUID()` | è UUID**v4**, MSS lo **rifiuta**: servono UUID**v7**. Per un generatore è **il** difetto da evitare al primo giro |
| `segment_no` | identico su tutto il bundle, sempre `1` |
| `npm` su Windows | è `npm.cmd` quando lo invochi da Node. Un generatore che registra `fail` su comandi che in realtà **passavano** è già successo: è la prova falsa peggiore, perché sembra prudenza |
| Secondi finti | i `controls` devono portare **codici di uscita veri**, misurati eseguendo. È il cuore di `SK-7`, non un dettaglio |
| `/tmp` in git-bash | risolve su `C:\tmp` per Node → `ENOENT`. Usa la cartella temporanea di sessione |
| Percorsi con spazi | `docs/Sessioni di lavoro/` **ha uno spazio nel nome**: sempre fra virgolette |
| Hook di pre-commit | registra la versione in stage e **pretende che tu rilanci il commit identico**. Se cambi lo stage, riparte |
| Scrittura bloccata senza errore | è l'**harness**, non MSS. Segnalalo e prosegui |
| Numeri a memoria | ogni conteggio in questo file è mobile. Rimisura |

## 7. Domande di chiusura — le sei canoniche, VERBATIM

Il report chiude con `## Domande di chiusura` contenente **queste sei domande, non altre**, ognuna
seguita dalla tua risposta. (Incollate qui apposta: citarle per riferimento ha già fatto sbagliare
un agente il 23-08.)

```
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
