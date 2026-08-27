# `AM-C0` — registro degli esiti

> **Denominatore dichiarato: 114 giudizi** (19 caselle × 6 criteri). Non si ricalcola sul lavoro
> svolto. Una casella non corsa resta nel denominatore come `not_observed` **con motivo**.
> Owner: [`FREEZE_AM_C0_27-08-26.md`](../../../MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md) §5 e §6.
>
> ⛔ Nessun punteggio aggregato, nessuna media, nessuna classifica, nessun ranking di modelli.
> ⛔ Nessun esito qui dentro apre `SEP-G2`, avvia `SEP-6` o autorizza il cutover `WP-1`.

## Stato complessivo al 27-08-2026

| | Caselle | Giudizi | Stato |
|---|---|---|---|
| Corsia A-archivio (`AR-1`, `AR-2`, `AR-3` × 3 condizioni) | 9 | 54 | ✅ **corse e giudicate** |
| Corsia A-oggi (`C1`, `C2`, `C3`, `C4`, `C5` × 2 condizioni) | 10 | 60 | **bloccate** — vedi sotto |
| **Totale** | **19** | **114** | 9 corse · 10 `not_observed` |

## Le nove caselle d'archivio — corse e giudicate dal revisore cieco

Verdetti: [`verdetti-revisore.md`](verdetti-revisore.md). Lettura finale: [`SINTESI.md`](SINTESI.md).
La corrispondenza lettera → condizione è stata rivelata **dopo** la consegna dei verdetti.

| `Rnn` | Caso | Condizione | Esiti sui 6 criteri |
|---|---|---|---|
| `R07` | `AR-1` | Storica | 3 `positive` · 3 `negative` (Applicazione, STOP, Confine) |
| `R02` | `AR-1` | Oggi | 3 `positive` · 3 `negative` (Applicazione, STOP, Confine) |
| `R04` | `AR-1` | Oggi + dossier | 6 `positive` |
| `R05` | `AR-2` | Storica | 6 `positive` |
| `R08` | `AR-2` | Oggi | 6 `positive` |
| `R01` | `AR-2` | Oggi + dossier | 6 `positive` |
| `R03` | `AR-3` | Storica | 1 `positive` · 4 `negative` · 1 `contradicted` (Fonte) |
| `R09` | `AR-3` | Oggi | 1 `positive` · 4 `negative` · 1 `contradicted` (Fonte) |
| `R06` | `AR-3` | Oggi + dossier | 6 `positive` |

**Totale dei 54 giudizi emessi:** 38 `positive` · 14 `negative` · 2 `contradicted`.
Più 60 `not_observed` per le caselle bloccate. **Denominatore 114**, non ricalcolato.

⚠️ **Le condizioni di comparabilità §8.3 e §8.4 non reggono** (modello non conoscibile in 5 caselle su
9; strumenti diversi fra sessioni). Il confronto è quindi **calibrazione narrativa**: la differenza fra
le condizioni **non è attribuibile** al pacchetto. Dettaglio in
[`CORRISPONDENZA.md`](CORRISPONDENZA.md), verifica fatta **prima** di leggere i verdetti.

## Caselle bloccate — le dieci della corsia A-oggi

⚠️ **Due difetti del freeze, trovati eseguendolo.** Non li correggo: un freeze corretto dopo aver
guardato dentro non è più un freeze. Li registro, e la decisione su cosa farne è di Matteo.

### Difetto 1 — `C1`, `C2`, `C3`, `C5` non hanno un testo del caso congelato

Il freeze §4 li congela «per rimando al `PROTOCOLLO…` §4». Ma il `PROTOCOLLO…` §4 non contiene testi
di casi: contiene **cinque schede candidate** — una tabella di tipo atteso e di cosa Matteo deve
decidere, dichiarata essa stessa «un canovaccio per l'intervista», non un caso congelato.

Cercato in tutto il repository: i testi verbatim che esistono sono **quattro** — `AR-1`, `AR-2`,
`AR-3` e `C4`, tutti dentro il freeze. Per `C1`, `C2`, `C3` e `C5` non esiste nessuna frase da
incollare.

**Perché non lo risolvo scrivendola io.** La prima condizione di comparabilità (§8.1) è «stesso testo
del caso, incollato verbatim da §4». Un testo scritto adesso, dal senior che ha già letto le chiavi,
non è un caso congelato: è un caso costruito dopo, e nessuna delle due condizioni sarebbe confrontabile
con l'altra su una base dichiarata prima. Vale il §2 del mandato: si apre una nuova calibrazione, non
si rattoppa questa.

→ 8 caselle · 48 giudizi · `not_observed`, motivo: **testo del caso mai congelato**.

### Difetto 2 — `C4` gira nel repository dove è leggibile il proprio esito atteso

`C4` un testo congelato ce l'ha. Ma la corsia A-oggi gira «sul repository di oggi», e in quel
repository vivono il freeze e i prompt di questa seduta. Un esecutore che apre
`docs/MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md` §4 trova la riga «Esito atteso — con
dossier / senza dossier» di `C4`, cioè la risposta che sta per dare — insieme al disegno completo
della prova di cui è oggetto.

Non è un percorso improbabile: `.claude/CLAUDE.md` punto 5 istrada esplicitamente al MetaSkillSystem
qualsiasi task che riguardi criteri o validazione, e `C4` chiede da quale lavoro partire.

Il freeze dichiara questo confondente per la corsia d'archivio — dove è risolto, perché il freeze è
datato 27-08 e nei worktree congelati non esiste (verificato: zero file) — ma **non lo dichiara per la
corsia A-oggi**, dove il §4 registra «materiale escluso: nessuno».

Le due uscite sono entrambe fuori dalla mia mano: escludere il materiale contraddice il §4 che dice
«nessuno»; non escluderlo fa correre il caso su un tavolo dove la risposta è visibile.

→ 2 caselle · 12 giudizi · `not_observed`, motivo: **esito atteso leggibile dall'esecutore**.

### Riepilogo delle caselle bloccate

| Caso | Condizioni | Caselle | Giudizi | Esito | Motivo |
|---|---|---|---|---|---|
| `C1` | Oggi, Oggi + dossier | 2 | 12 | `not_observed` | testo del caso mai congelato |
| `C2` | Oggi, Oggi + dossier | 2 | 12 | `not_observed` | testo del caso mai congelato |
| `C3` | Oggi, Oggi + dossier | 2 | 12 | `not_observed` | testo del caso mai congelato |
| `C5` | Oggi, Oggi + dossier | 2 | 12 | `not_observed` | testo del caso mai congelato |
| `C4` | Oggi, Oggi + dossier | 2 | 12 | `not_observed` | esito atteso leggibile dall'esecutore |

⚠️ `not_observed` **non è un fallimento e non vale zero.** Dice che la casella non è stata corsa e
perché. Il denominatore resta 114, e nessuna di queste dieci si converte in successo o insuccesso.

## Conseguenza sulla comparabilità — verificata, non più prevista

Delle sei condizioni del freeze §8, **quattro reggono, due no e una ha una riserva**. Il freeze è
netto: se anche una sola manca, il confronto è **calibrazione narrativa**.

Quindi la [`SINTESI.md`](SINTESI.md) descrive i comportamenti osservati e **non** attribuisce nessuna
differenza al pacchetto di istradamento o al dossier. Quello che resta, e che era il prodotto atteso
della calibrazione, sono le **righe mancanti nelle fonti**: `SINTESI.md` §1 e §4.
