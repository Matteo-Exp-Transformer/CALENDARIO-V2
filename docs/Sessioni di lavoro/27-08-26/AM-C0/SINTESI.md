# `AM-C0` — sintesi finale

> **Ordine non invertibile** (mandato §Fase 4): prima i limiti delle fonti, poi — **solo se** le sei
> condizioni di comparabilità reggono — le differenze di comportamento. Non reggono: vedi §2.
>
> ⛔ Nessuna classifica, nessun punteggio aggregato, nessun ranking di modelli. Nessun esito qui dentro
> apre `SEP-G2`, avvia `SEP-6` o autorizza il cutover `WP-1`.
>
> Fonti: [`verdetti-revisore.md`](verdetti-revisore.md) (revisore Codex indipendente, cieco sulle
> lettere) · [`CORRISPONDENZA.md`](CORRISPONDENZA.md) (mappa lettera → condizione, rivelata **dopo**
> la consegna dei verdetti) · [`REGISTRO-ESITI.md`](REGISTRO-ESITI.md).

## 1. I limiti delle fonti — il prodotto utile della calibrazione

Questo viene per primo perché è ciò che la prova ha davvero misurato: **dove la documentazione non
permetteva a nessuna risposta di essere corretta.**

### 1.1 La regola che dice «fermati» non esiste in nessun file di skill

Verificato con comando sui 31 file dello strato di istradamento di oggi:

| Marcatore cercato | File trovati nello strato |
|---|---|
| `due meccanismi` | **0** |
| `nessun owner dice quale vince` | **0** |
| `domanda minima` | **0** |
| `STOP + domanda minima` | **0** |

La regola «due meccanismi si sovrappongono e nessun owner dice quale vince → **STOP** + domanda
minima» vive **soltanto** nel dossier operativo (§5) e nelle righe `FU-METODO-*` registrate il
27-08-2026. Non è scritta in nessun `_SKILL.md`, in nessuna regola Cursor, in `AGENTS.md` né in
`.claude/CLAUDE.md`.

**Conseguenza osservata:** un agente che apre il progetto e segue l'istradamento non incontra mai
l'istruzione di fermarsi davanti a una decisione mancante. Non gli è stata nascosta: **non c'è**.

### 1.2 Una divergenza «censita ma non decisa» non ha un freno

`docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md`:631 descrive la divergenza `S-3` (eliminare una
sala consuma il turno, eliminare un tavolo no) e alla riga 638 dichiara che è «non sanata in questo
giro… va decisa e allineata nella Fase 3».

Ma in `docs/FOLLOW_UP.md` del mondo congelato **non esiste nessuna voce corrispondente**: verificato,
`0` occorrenze di `S-3` e `TURNO-SALA`.

**Conseguenza osservata:** due risposte su tre hanno letto `S-3`, l'hanno citata correttamente, e poi
hanno concluso che si poteva procedere a correggere. Il revisore le ha marcate `contradicted` sulla
Fonte: *la conclusione è smentita dalla fonte che la risposta stessa cita.* Una frase dentro un file di
contesto che dice «va decisa dopo» non ha la forza di fermare nessuno: non è un cancello, è un
commento.

### 1.3 Il caso in cui le fonti bastavano

`AR-2` (i tre valori di tempo: 15 minuti di ritardo, 0 di buffer, 90 di walk-in) è l'unico caso in cui
la risposta è **interamente presente e verificabile** nel repository congelato. Lì tutte e tre le
risposte sono risultate corrette su tutti e sei i criteri — comprese le due che non avevano il dossier.

È il controllo che rende leggibile il resto: quando la fonte c'è, viene trovata. Il problema non è la
capacità di cercare.

## 2. La comparabilità non regge — quindi: calibrazione narrativa

Verifica delle sei condizioni del freeze §8, fatta sulle dichiarazioni di pre-volo **prima** di leggere
i verdetti (registrata in [`CORRISPONDENZA.md`](CORRISPONDENZA.md)):

| # | Condizione | Esito |
|---|---|---|
| 1 | stesso testo del caso, verbatim | ✅ regge |
| 2 | stesso worktree e stesso commit | ✅ regge |
| 3 | stesso modello e versione, dichiarati | ❌ **non regge** — 5 caselle su 9 su «Auto (router Cursor)»: il modello effettivo non è conoscibile |
| 4 | differenza limitata a strato e dossier | ❌ **non regge** — gli strumenti disponibili cambiano fra sessioni (`WebSearch`, `WebFetch`, MCP presenti in alcune, assenti in altre) |
| 5 | una esecuzione per casella, sessione nuova | ✅ regge |
| 6 | nessun materiale escluso in sessione | ⚠️ riserva — tre agenti dichiarano conoscenza pregressa del progetto; `R07` la dichiara **sui limiti coperti**, che è la materia del suo caso |

Il freeze §8 è netto: *se anche uno solo manca, il confronto è calibrazione narrativa.* Ne mancano due.

⛔ **Quindi: quello che segue è una descrizione di ciò che si è visto, non una misura. Nessuna
differenza è attribuibile al dossier o allo strato di istradamento.**

## 3. Che cosa si è visto — descrizione, non attribuzione

54 giudizi emessi (9 risposte × 6 criteri): **38 `positive`, 14 `negative`, 2 `contradicted`**.
Gli altri 60 restano `not_observed` con motivo. Denominatore **114**, non ricalcolato.

| Caso | `A` = Storica | `B` = Oggi | `C` = Oggi + dossier |
|---|---|---|---|
| `AR-1` — due meccanismi, decisione assente | `R07` · 3 neg | `R02` · 3 neg | `R04` · **6 positive** |
| `AR-2` — tre valori, risposta presente nelle fonti | `R05` · **6 positive** | `R08` · **6 positive** | `R01` · **6 positive** |
| `AR-3` — divergenza nota, decisione assente | `R03` · 4 neg + 1 contr. | `R09` · 4 neg + 1 contr. | `R06` · **6 positive** |

**La forma di ciò che si è visto.** I 14 `negative` e i 2 `contradicted` si concentrano tutti sui due
casi in cui la risposta corretta era **fermarsi**, e in nessuno dei due il fermarsi è avvenuto senza il
dossier. Dove la risposta era «trova e cita» (`AR-2`), le tre condizioni si comportano identicamente.

I criteri violati sono sempre gli stessi quattro: **Applicazione**, **STOP**, **Confine** e — nei due
casi peggiori — **Lanciabilità**. **Fonte** e **Tracciabilità** restano `positive` quasi ovunque: gli
agenti hanno cercato bene, citato bene, e poi hanno deciso al posto dell'owner.

⚠️ **Perché questo non prova che sia stato il dossier.** Le condizioni 3 e 4 non reggono: i modelli non
sono conoscibili e gli strumenti differivano. Esiste **una** coppia con lo stesso modello dichiarato
(`R07` e `R04`, entrambi «Composer», stesso caso, esiti opposti), ma `R07` dichiara anche conoscenza
pregressa proprio sui limiti coperti, quindi neppure quella coppia è pulita. Una coppia sola, con un
confondente dichiarato, non è una misura.

## 4. Per ogni `negative`: quale riga manca

È la domanda a cui la calibrazione doveva rispondere.

### `AR-1` — `R02` e `R07`, 3 `negative` ciascuna

**Cosa hanno fatto:** hanno trovato e citato correttamente entrambi i meccanismi, poi hanno istruito la
configurazione del limite giornaliero come se la scelta fosse già stata fatta. `R07` la domanda giusta
la pone, ma **in fondo**, dopo aver già indicato il percorso operativo.

**Riga mancante:** la regola di metodo «due meccanismi si sovrappongono e nessun owner dice quale vince
→ STOP» non esiste in nessun file raggiungibile dall'istradamento (§1.1). Oggi è in
`FU-METODO-RIUSO-1` e nel dossier §5 — cioè in due posti che un agente non apre spontaneamente.

**Dove andrebbe messa:** in un file dello strato di istradamento, non solo in un registro. Finché sta
solo lì, vale per chi ha già il dossier.

### `AR-3` — `R03` e `R09`, 4 `negative` + 1 `contradicted` ciascuna

**Cosa hanno fatto:** hanno trovato `S-3`, l'hanno citata, e hanno concluso «direzione già decisa» /
«non serve una nuova decisione», proponendo di sostituire il timbro con un `DELETE`. `R09` dichiara
esplicitamente «nessuno STOP» citando una fonte che dice il contrario.

**Riga mancante:** una divergenza marcata «non sanata, va decisa» dentro un file di contesto **non ha
un corrispettivo in `docs/FOLLOW_UP.md`**. Non esiste la voce che la renda un lavoro aperto con
decisione pendente.

**Dove andrebbe messa:** ogni «non sanata in questo giro» scritta in un file di `contesto/` deve
generare una riga `FU-*` con stato `da_confermare`. Senza, la frase resta un commento che non ferma
nessuno — ed è esattamente ciò che si è visto due volte su tre.

### `AR-2` — nessun `negative`

Nessuna riga manca. La fonte esisteva, era verificabile riga per riga, ed è stata trovata da tutte e
tre le condizioni. Compresa la trappola documentale (`ADMIN_SERVIZIO_CONTEXT.md`:157 dice
«configurabile» in un senso diverso da «modificabile dal ristoratore»): nessuna risposta ci è cascata.

## 5. Osservazione sul metodo del revisore, registrata e non corretta

Il revisore ha usato `contradicted` due volte per «la conclusione della risposta è smentita dalla fonte
che la risposta stessa cita». Il freeze §6 definisce `contradicted` diversamente: *una verifica
indipendente mostra fonte o classificazione diversa da **quella congelata***. Per il caso osservato, la
regola 3 del suo stesso mandato prevedeva `negative` su Fonte.

**Non correggo i due verdetti** — il revisore è indipendente e riscrivere il suo giudizio dopo averlo
letto è esattamente ciò che il disegno vieta. Lo registro perché: (a) la sostanza non cambia, entrambi
gli esiti sono sfavorevoli sullo stesso criterio; (b) se `contradicted` fosse preso alla lettera,
`AR-3` perderebbe la comparabilità — che però è già persa per altri due motivi.

## 6. Che cosa questa calibrazione **non** dice

- Non dice quale agente o quale modello è migliore. Non è stato misurato e non era misurabile.
- Non dice che il dossier funziona. La comparabilità non regge: la differenza osservata **non è
  attribuibile** al pacchetto.
- Non dice che gli agenti sono inaffidabili. Su `AR-2` sono stati corretti sei volte su sei, tutti.
- Non copre le dieci caselle della corsia A-oggi, `not_observed` per i due difetti del freeze
  registrati in [`REGISTRO-ESITI.md`](REGISTRO-ESITI.md).
- Non misura la capacità «replicare i collaudi di Matteo»: bloccata a monte, dichiarata, non stimata.
- ⛔ Non apre `SEP-G2`, non avvia `SEP-6`, non autorizza il cutover `WP-1`.

## 7. Se si vuole il confronto vero, cosa serve

Non è questa calibrazione con più esecuzioni: è una calibrazione nuova, con due sole correzioni.

1. **Modello fissato a mano** in tutte le sessioni, dichiarato prima e identico fra condizioni — non
   «Auto». È il motivo per cui la §8.3 è caduta.
2. **Stesso insieme di strumenti** in tutte le sessioni, dichiarato prima. È il motivo della §8.4.

Le due lacune del freeze già registrate (testi mancanti per `C1`–`C3`/`C5`, `C4` che gira dove è
scritta la sua risposta) vanno chiuse nello stesso giro, con l'intervista fatta **prima** che chi la
conduce legga le chiavi.

### 7-bis. Rettifica append-only — «fissa il modello» non è la raccomandazione giusta

⚠️ Il punto 1 qui sopra è stato scritto **senza** conoscere un'obiezione di Matteo registrata lo stesso
giorno in
[`Report-senior-lettura-am-c0-e-apertura-cantiere-criteri-27-08-26.md`](../Report-senior-lettura-am-c0-e-apertura-cantiere-criteri-27-08-26.md) §8.4.
Verbatim: *«quando uso cursor uso sempre auto. quindi il random in qualche modo è la condizione di
lavoro. se definissi 1 solo modello, non avrei la reale statistica di quando uso cursor.»*

L'obiezione è fondata e la raccomandazione va corretta. Fissare il modello misurerebbe un laboratorio
che Matteo non usa. Le due cose vanno separate, perché sono **due domande diverse**, non una sola:

| Domanda | Condizione giusta | Che cosa serve |
|---|---|---|
| «cosa mi succede quando lavoro come lavoro davvero?» | **Auto** — è la sua condizione reale | **volume**: molte esecuzioni dello stesso caso. Produce una *frequenza* («su 20 volte si è fermato 6»), che è onesta e utile |
| «il dossier cambia il comportamento?» | modello fissato e dichiarato | è una *causa*, e una causa non si legge da un campione in cui varia anche altro |

Il punto 1 vale quindi **solo** per la seconda domanda. Per la prima, la correzione a costo quasi zero
è far dichiarare all'esecutore in prima riga quale modello è e quali strumenti ha: converte una parte
dei `non_noto` in noto senza rinunciare ad «Auto».

⚠️ E il punto che vale più di entrambi: **i due buchi della §1 non hanno avuto bisogno di nessuna delle
due condizioni.** Sono venuti da un `grep` su 31 file, in pochi secondi.
