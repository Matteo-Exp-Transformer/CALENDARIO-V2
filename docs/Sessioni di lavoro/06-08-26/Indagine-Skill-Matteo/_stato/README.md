# `_stato/` — spunte sicure in parallelo

Ogni ondata dell'indagine scrive **un solo file qui**: `<ID>.md` (es. `A4.md`, `H2.md`).

**Perché così.** Se più agenti in parallelo spuntassero la stessa riga dello stesso file di tracking,
l'ultimo che salva cancellerebbe le spunte degli altri. Un file per ondata elimina il problema:
nessuno scrive dove sta scrivendo un altro.

**Regole:**

- L'agente scrive **solo** il proprio `<ID>.md`. Non tocca `00_PROMPTS_SEQUENZA_TRACKING.md`.
- Le checkbox del file di tracking si aggiornano in blocco leggendo questa cartella (ondata `AGG`).
- Un file di stato incompleto = **ondata non fatta**. Servono tutte le 8 righe del formato.

**Formato (8 righe, esatte):**

```
ID: A4
Data: 07-08-26
Report: report/A4_SESSIONI_02-06_05-06.md
Perimetro: 40 file
File aperti: 40 (100%)
Decisioni estratte: 23
Agency estratte: 7 (M→A 4 | A→M 2 DEDOTTE | M↔M 1)
Note: 2 file illeggibili (allegati binari), dichiarati in sezione 5
```

I numeri di copertura vanno **contati** (`find`), non stimati: sono il criterio di accettazione.
