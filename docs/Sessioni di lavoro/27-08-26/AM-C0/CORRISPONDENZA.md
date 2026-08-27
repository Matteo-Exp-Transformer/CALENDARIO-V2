# `AM-C0` — corrispondenza `Rnn → caso × condizione`

> ⛔ **Questo file non si consegna al revisore.** È l'unico posto dove la lettera di condizione torna
> ad avere un nome. Il revisore riceve `Rnn`, il caso e la lettera; che cosa significhi la lettera lo
> sa solo il senior, e lo rivela **soltanto dopo** che i verdetti sono consegnati.
>
> Owner del disegno: [`FREEZE_AM_C0_27-08-26.md`](../../../MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md) §2 e §4.

## Lettere di condizione

| Lettera | Condizione | Che cosa vede l'agente |
|---|---|---|
| `A` | Storica | lo skill system esattamente com'era il giorno del commit congelato |
| `B` | Oggi | app e report di allora, **istradamento di oggi** sovrapposto |
| `C` | Oggi + dossier | come `B`, più `DOSSIER.md` potato per data |

⚠️ **Questa mappa è già pubblica nel freeze §2.** Il freeze vive nel repository di oggi: un revisore
che avesse accesso al repository leggerebbe la corrispondenza lettera → condizione in dieci secondi, e
la cecità cadrebbe. **Condizione di lancio della review:** il revisore lavora sul solo pacchetto che
gli viene consegnato, senza accesso a questo repository. Se non è garantibile, il risultato si registra
`self_report/unverified` e non si chiama review.

## La tabella

| `Rnn` | Caso | Condizione | Lettera | Cartella di esecuzione | Blocco |
|---|---|---|---|---|---|
| `R01` | `AR-2` | Oggi + dossier | `C` | `C:/tmp/amc0/0508-dossier` | 6 |
| `R02` | `AR-1` | Oggi | `B` | `C:/tmp/amc0/1706-oggi` | 2 |
| `R03` | `AR-3` | Storica | `A` | `C:/tmp/amc0/0508-storica` | 7 |
| `R04` | `AR-1` | Oggi + dossier | `C` | `C:/tmp/amc0/1706-dossier` | 3 |
| `R05` | `AR-2` | Storica | `A` | `C:/tmp/amc0/0508-storica` | 4 |
| `R06` | `AR-3` | Oggi + dossier | `C` | `C:/tmp/amc0/0508-dossier` | 9 |
| `R07` | `AR-1` | Storica | `A` | `C:/tmp/amc0/1706-storica` | 1 |
| `R08` | `AR-2` | Oggi | `B` | `C:/tmp/amc0/0508-oggi` | 5 |
| `R09` | `AR-3` | Oggi | `B` | `C:/tmp/amc0/0508-oggi` | 8 |

**Perché i numeri sono scombinati.** In ordine naturale il revisore vedrebbe `R01·R02·R03` come lo
stesso caso nelle tre condizioni consecutive, e l'ordine gli suggerirebbe quale lettera è «la terza»,
cioè quella con più materiale. L'assegnazione sparsa toglie quel suggerimento senza togliergli nulla di
ciò che gli serve per giudicare.

## Dichiarazione di pre-volo — compilata dalle risposte, 27-08-2026

Tutte e nove le caselle sono state corse. Cartella dichiarata **corretta in tutte e nove**, e nessun
agente dichiara di aver letto file fuori dalla propria cartella: la condizione §8.6 regge.

| `Rnn` | Cartella dichiarata | Memoria caricata | File esterni | Conoscenza pregressa | Modello dichiarato |
|---|---|---|---|---|---|
| `R01` | ✅ `0508-dossier` | sì — `DOSSIER.md` | nessuno | no | **Auto (router Cursor)** |
| `R02` | ✅ `1706-oggi` | no — solo regole workspace | nessuno | no | **Auto (router Cursor)** |
| `R03` | ✅ `0508-storica` | no | nessuno | no | Composer — *versione non esposta* |
| `R04` | ✅ `1706-dossier` | sì — `DOSSIER.md` + regole workspace | nessuno | no | Composer |
| `R05` | ✅ `0508-storica` | no — solo regole workspace | nessuno | no | **Auto (router Cursor)** |
| `R06` | ✅ `0508-dossier` | sì — regole workspace + `.cursor/skills/` | nessuno | no | **Auto (router Cursor)** |
| `R07` | ✅ `1706-storica` | sì — regole workspace + skill pointer | ⚠️ **sì** — «conoscenza generica del repo, **limiti coperti**» | Composer |
| `R08` | ✅ `0508-oggi` | no | ⚠️ **sì** — limitata a regole workspace e skill | **Auto (router Cursor)** |
| `R09` | ✅ `0508-oggi` | sì — regole workspace + agent skills + `git status` | ⚠️ **sì** — «già orientato dalle skill e dal contesto repo» | **Auto (router Cursor)** |

### Verdetto sulle sei condizioni di comparabilità del freeze §8

| # | Condizione | Esito |
|---|---|---|
| 1 | stesso testo del caso, verbatim da §4 | ✅ **regge** — blocchi generati da un solo scheletro, verbatim verificato |
| 2 | stesso worktree e stesso commit | ✅ **regge** — cartella dichiarata corretta in tutte e nove |
| 3 | stesso modello e stessa versione, **dichiarati** | ❌ **non regge** |
| 4 | differenza limitata **esclusivamente** a strato e dossier | ❌ **non regge** |
| 5 | una sola esecuzione per casella, in sessione nuova | ✅ **regge** |
| 6 | nessun materiale escluso finito in sessione | ⚠️ **regge con riserva** |

**Perché la §3 non regge.** Cinque caselle su nove girano su «Auto (router Cursor)»: il router sceglie
il modello, e quale abbia scelto **non è conoscibile a posteriori**. Le altre quattro dichiarano
«Composer», una precisando che la versione non è esposta. I modelli quindi non sono né identici né
conoscibili. Il freeze §8.3 lo prevede alla lettera: *se ignoti → `non_noto`*.

**Perché la §4 non regge.** Gli strumenti disponibili cambiano da sessione a sessione senza che
nessuno li abbia scelti: `R03` e `R06` avevano anche `WebSearch`, `WebFetch`, `ReadLints` e MCP;
`R02` e `R05` solo lettura, ricerca e glob. È una seconda differenza fra le condizioni, oltre allo
strato e al dossier.

**Perché la §6 ha una riserva.** Tre agenti dichiarano conoscenza pregressa del progetto. `R07` è il
caso serio: sta rispondendo ad `AR-1` in condizione `A` e dichiara di conoscere già il repository
«limiti coperti» compresi — cioè proprio la materia del caso. È il confondente n. 2 del freeze §7 che
si manifesta davvero, e `R07` va letta sapendolo.

### Conseguenza, dichiarata prima di leggere i verdetti

Il freeze §8 è netto: *se anche uno solo manca, il confronto è **calibrazione narrativa**: si descrive
quello che si è visto e si dichiara che la differenza non è attribuibile al pacchetto.*

Ne mancano **due** (§3 e §4), più una riserva sulla terza. Quindi la sintesi finale descriverà i
comportamenti osservati e **non** attribuirà nessuna differenza al pacchetto di istradamento o al
dossier. Questo è deciso **adesso**, prima che il revisore consegni: non è una scusa costruita dopo
aver visto un risultato che non piaceva.

⚠️ La review resta utile e va fatta: i sei criteri sono giudicati **per risposta**, e i `negative`
indicano quale riga manca nelle fonti. È quello il prodotto della calibrazione. Ciò che cade è solo la
possibilità di dire «la condizione X si comporta meglio **perché** ha il dossier».
