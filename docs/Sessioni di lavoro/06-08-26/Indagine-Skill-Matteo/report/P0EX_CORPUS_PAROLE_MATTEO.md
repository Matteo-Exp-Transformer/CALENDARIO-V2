# P0-EX — Corpus delle parole di Matteo

**Ondata:** P0-EX (fondamenta) · **Data:** 06-08-26 · **Linea:** H · **Regime:** estrazione meccanica
**Strumento:** [`tools/estrai_prompt.py`](../tools/estrai_prompt.py)
**Corpus prodotto:** `docs/_lavoro/Indagine-Corpus/` — **fuori da git** (verificato con `git check-ignore`)

> Questa ondata non estrae decisioni: costruisce la **fonte** da cui le estrarranno H1–H5.
> Le sezioni 1 e 2 dello schema (decisioni, agency) sono quindi vuote **per natura**, non per
> mancanza di lavoro. Le altre cinque sezioni valgono come per ogni altra ondata.

---

## 1. Decisioni — non applicabile

Nessuna decisione estratta: è un'ondata di costruzione del corpus. Le decisioni arrivano da H1–H5.

## 2. Agency e correzioni — non applicabile

Idem. In §3 ci sono però i **segnali grezzi** che le ondate H dovranno verificare uno per uno.

## 3. Skill signals — cosa il corpus mostra già

Numeri, non interpretazioni. Ogni riga qui sotto è un'**ipotesi da verificare** in H1–H5: nessuna di
queste va nel dossier finale senza essere stata letta nel contesto del messaggio.

**Volume complessivo: 4.157 messaggi di Matteo, su 576 chat, da febbraio ad agosto 2026.**

| Classe | Messaggi | Cosa vale |
|--------|----------|-----------|
| **M-VOCE** | **3.412** | parole sue — pensiero e decisioni |
| **M-REGIA** | **125** | prompt preparati da un agente e da lui scelti e incollati — *direzione*, mai scrittura |
| **M-PASTE** | **596** | allegati: DOM Path, errori, log, riferimenti a file |
| **M-OK** | **124** | ratifiche e comandi secchi — ritmo, non contenuto |

Le prime due colonne **non si sommano mai** (piano §3.3, decisione di Matteo del 06-08).

### 3.1 — Il vocabolario di comando è più vecchio di CalendarBackup-v2

Prima comparsa di ogni parola-comando nell'intero corpus:

| Parola | Prima volta | Occorrenze | Nota |
|--------|-------------|------------|------|
| `controverifica` | **24-02-26** | 60 | **precede CB-v2 di due mesi** |
| `prepara` | **24-02-26** | 165 | idem |
| `implementa` | 02-03-26 | 81 | |
| `fai report` | 05-03-26 | 91 | |
| `revisiona` | 13-03-26 | 48 | |
| `lavoro ok` | **29-05-26** | 89 | nasce dentro CB-v2 |
| `senior` | 29-05-26 | 58 | stesso giorno |
| `blindatura` | 04-06-26 | 66 | |
| `ragioniamo` | 06-06-26 | **4** | usata pochissimo |
| `spiegamelo` | **mai** | **0** | è nel VOCABOLARIO ma **non risulta mai usata** |

Due cose da verificare in H4 e S4:
- il metodo di lavoro con gli agenti **non nasce con CalendarBackup-v2**: «controverifica» e
  «prepara» compaiono già a fine febbraio, sui progetti precedenti;
- ci sono voci del vocabolario ufficiale che **non risultano mai usate** (`spiegamelo`) e altre quasi
  mai (`ragioniamo`, 4 volte). Il vocabolario documentato e quello reale non coincidono.

### 3.2 — Segnali di correzione Matteo → agente (da verificare uno per uno)

| Parola spia | Messaggi |
|-------------|----------|
| `annulla` | 90 |
| `ripristina` | 25 |
| `torna a` | 15 |
| `sbagliato` | 14 |
| `ti avevo detto` | 1 |
| `fuori strada` | 1 |

Sono **grep, non prove**: H1–H5 devono leggere il messaggio nel contesto prima di classificarlo come
correzione. Un «annulla» può essere un ripensamento suo (`M↔M`), non un errore dell'agente (`M→A`).

### 3.3 — Lunghezza dei messaggi (CB-v2, solo M-VOCE)

| Mese | Media caratteri | Messaggi |
|------|-----------------|----------|
| 04-2026 | 233 | 16 |
| 05-2026 | 396 | 1.748 |
| 06-2026 | 419 | 762 |
| 08-2026 | 316 | 18 |

Stabile: non scrive né molto più corto né molto più lungo col passare dei mesi. Se ci si aspettava
«diventa più sintetico perché impara», il dato **non lo mostra**.

## 4. Contro-evidenze e trappole trovate in corso d'opera

Quattro difetti veri, trovati e corretti mentre si costruiva il corpus. Vanno letti come avvertimento:
sono gli stessi errori che farebbe un agente frettoloso.

| Trappola | Cosa sarebbe successo | Come è stata chiusa |
|----------|----------------------|---------------------|
| I `.jsonl` a volte hanno **due oggetti sulla stessa riga** | leggendo riga per riga si perdevano messaggi | decoder incrementale sull'intero file |
| Cursor accoda `DOM Path:` / `Position:` ai messaggi | «metti l'effetto luminoso al passaggio del mouse **DOM Path: div[3]…**» finiva tra gli allegati: **istruzione persa** | si classifica sul testo ripulito (`text_umano`), non sull'originale |
| Messaggi corti scambiati per allegati | «commit e push su main» (21 caratteri) finiva tra i paste | è paste solo se **è stato tolto** un allegato sostanzioso |
| Filtro sui riferimenti `@file` troppo largo | «compila un report e mettilo in @docs/…» classificato come allegato | conta cosa resta **tolti** i riferimenti |

Effetto misurato della correzione: **M-VOCE da 2.018 a 3.412**. Senza queste quattro correzioni,
l'indagine avrebbe buttato circa **1.400 messaggi veri** di Matteo, cioè un terzo della sua voce.

## 5. Copertura dichiarata

| Voce | Numero |
|------|--------|
| Progetti Cursor con transcript | 10 su 10 previsti dal piano |
| Chat aperte | **576** (454 CB-v2 + 122 altri) |
| Messaggi utente trovati | 4.179 |
| Messaggi di Matteo estratti | **4.157** (99,5%) |
| Scartati | 22 — iniezioni di sistema Cursor, **non** sono parole sue |
| Con pattern sensibili | 127 — restano nel corpus fuori git, **non citabili** nei report |
| Con timestamp proprio | 20% su CB-v2; sul resto vale la data di fine chat |

**Copertura: totale.** Nessun campionamento: a differenza del piano iniziale, qui non si è letto «un
campione dichiarato di 504 chat», si sono estratti **tutti** i messaggi.

## 6. Lacune e handoff

- **La data a livello di giorno è affidabile solo per il 20% dei messaggi CB-v2.** Per il resto vale
  la data di ultima modifica della chat. Le ondate H non devono costruire ragionamenti su singole
  giornate senza incrociare con la linea A.
- **Il testo degli agenti resta oscurato** (`[REDACTED]`): nessuno script può recuperarlo. Le
  correzioni agente→Matteo restano `DEDOTTE` (piano §2.1).
- **Handoff a H1–H5**: il corpus è pronto, le ondate sono già sbloccate.
- **Handoff a S3 e S5**: la cronologia vera dei progetti (piano §2.2) smentisce la sequenza assunta
  dal piano iniziale. Il trading è **contemporaneo** a CalendarBackup, non successivo; luglio non è
  una pausa ma un cambio di progetto.
- **Handoff a S4**: le voci di vocabolario mai usate (`spiegamelo`) e quasi mai usate (`ragioniamo`)
  sono contro-evidenza pronta sul tema «il metodo documentato è il metodo praticato?».

## 7. Chiusura verso Matteo

- Ora esiste un archivio con **tutto quello che hai scritto tu** agli agenti: 4.157 messaggi, da
  febbraio ad agosto, su dieci progetti. Non è un campione: c'è tutto.
- Sono già saltate fuori due cose che il piano dava per scontate ed erano sbagliate: a **luglio non
  ti eri fermato**, stavi lavorando su BHM e sul trading; e il tuo modo di comandare gli agenti
  («controverifica», «prepara») **esisteva già a febbraio**, prima di questa app.
- L'archivio sta in una cartella privata che non finisce su GitHub. Nei report escono solo frasi
  brevi e i numeri.
