# Report — P0 dell'indagine skill Matteo + aggiunta ondate M2/M3/M4

## 1. Cappello

- **Cosa è cambiato:** il piano dell'indagine sulle tue skill ora è verificato sul disco reale ed è
  cresciuto: sono state aggiunte 3 nuove ondate (M2, M3, M4) che coprono 147 file di skill d'area
  attuali — incluso un intero prodotto (`Console-Skill`) mai censito prima.
- **Cosa resta:** eseguire le 45 ondate di mining/sintesi (M1-M4, A1-A11, B1-B3, C1-C5, D1-D2, E1-E2,
  F1, G1-G3, H1-H5, I1-I2, J1, poi S1-S6). Nessun lavoro a metà su questa sessione.
- **Serve una tua azione:** no, il piano è pronto per essere eseguito — puoi aprire le prossime chat
  pescando dalle ondate mining come indicato in `00_PROMPTS_SEQUENZA_TRACKING.md`.

---

## 2. Cosa è stato fatto

1. Letto tutto il contesto dell'indagine (piano, tracking, regole di `_stato/`).
2. Eseguita l'ondata **P0**: ricontati sul disco i file di ogni linea A-J del corpus, confrontandoli
   con quanto dichiarato nel piano. Prodotta la lista file per ogni ondata futura, marcati i file
   "ad alto segnale" (senior, owner, decisioni, dossier…), tracciata una timeline grezza per linea,
   verificato quali file di `docs/_lavoro/` sono su GitHub e quali no.
3. Dalla verifica sono emerse 3 scoperte, riportate a te in chat:
   - un pezzo intero di corpus mancante dal piano (147 file di skill d'area attuali, incluso un
     pannello di gestione clienti mai censito, `Console-Skill`);
   - l'intero archivio storico (quasi 1000 file, linee B-F) non è mai stato salvato su GitHub;
   - lo split previsto per i piani salvati (`I1`/`I2`) non corrispondeva al contenuto reale.
4. Hai confermato di voler aggiungere il pezzo mancante. Ho quindi:
   - aggiunto le ondate **M2** (Console-Skill, 46 file), **M3** (Admin/Dashboard/Servizio/Database/
     Testing, 41 file), **M4** (Legal/Marketing/UI/Prenota/Menu QR + file sciolti, 60 file) al piano e
     al file di prompt pronti da copiare;
   - corretto il perimetro di **M1** (36 file invece di ~16, mancava una cartella predecessore dello
     skill system);
   - corretto 3 piccoli errori di somma nel piano (linee A, C, G) e un file scambiato per cartella
     vuota (linea C5);
   - aggiornato la spartizione reale dei piani salvati (I1 = 112 file prenotazioni/HACCP, I2 = 33
     file giochi/trading/altro, non 90/56 come si pensava) e il punto esatto di taglio per dividere
     in due la cartella più grande dell'archivio BHM (B2/B3).
5. Scritto questo report di chiusura.

---

## 3. File toccati e perché

| File | Perché |
|---|---|
| `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/report/P0_INVENTARIO_CORPUS.md` | Nuovo — report dell'ondata P0: conteggi verificati, scoperte, liste file, timeline |
| `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/_stato/P0.md` | Nuovo — file di stato dell'ondata P0 (formato a 8 righe richiesto dal cantiere) |
| `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/PIANO_INDAGINE.md` | Corretti i conteggi §2 (linee A, C, G, M, I), aggiunta sezione §2.3 "Correzioni di P0", aggiunte le righe M2/M3/M4 nella tabella ondate §4, aggiornato il grafo delle dipendenze, corretto il taglio B2/B3 e il perimetro di C5, titolo "44→47 ondate" |
| `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/00_PROMPTS_SEQUENZA_TRACKING.md` | Marcato P0 come fatta, corretto il prompt di M1, aggiunti i 3 nuovi blocchi prompt M2/M3/M4 pronti da copiare, allineate le checkbox "Stato rapido", aggiunte note correttive ai prompt di B2/B3/C1/C2/C4/C5/I1/I2 |
| Questo report (`docs/Sessioni di lavoro/06-08-26/Report-p0-indagine...md`) | Chiusura sessione richiesta da te |

---

## 4. Test eseguiti e risultato

Non applicabile: sessione di sola documentazione (analisi di file e scrittura/correzione di piani in
`docs/`), nessun file di `src/` toccato, nessun comando `npm run validate`/`build`/test da lanciare.
Verificati invece, con comandi di sistema (non test automatici): conteggi file (`Get-ChildItem`),
tracciamento git (`git ls-files`, `git log`), esistenza dei corpus attesi — tutti riportati con
l'evidenza nel report P0.

---

## 5. «File di skill aggiornati»

**Nessuno.** Non è stato toccato lo skill system del progetto (`Comunicazione-Skill/`, le skill
d'area come `Prenota-Skill`, `Database-Skill`, ecc., `APP_CONTEXT_SKILL.md`). I file modificati
appartengono al cantiere di indagine (`PIANO_INDAGINE.md`, `00_PROMPTS_SEQUENZA_TRACKING.md`), che ha
le sue proprie regole di aggiornamento definite nel piano stesso (§5-6): un'ondata scrive report +
stato, e le correzioni al piano derivanti da un'ondata di verifica (P0) sono esplicitamente previste
dal piano («il piano va corretto, non il conteggio», §4 istruzioni P0) — non richiedono un passaggio
di allineamento skill separato.

---

## 6. Dati comunicazione

- Prompt ricorrente in questa chat: **istruzioni sintetiche con esecuzione autonoma** («esegui p0,
  dopo che hai tutto il contesto necessario»; «completa il tuo lavoro poi fai report lavoro svolto
  commit») — nessuna richiesta di conferma intermedia, tranne per la decisione esplicita che ho
  segnalato io stesso (aggiungere o no le 3 ondate).
- Formato che ha funzionato: ho aperto con le 3 scoperte più importanti in cima al report e in chat,
  prima dei dettagli tabellari — coerente con lo stile "schermate/effetto, non nomi di file isolati"
  richiesto dalle regole del progetto. Non ho ricevuto correzioni su questo formato, quindi lo
  considero confermato.
- Un solo punto è stato lasciato esplicitamente alla tua decisione (aggiungere le ondate M2-M4):
  hai risposto con un comando secco («aggiungi le 3 ondate»), senza altre precisazioni — segno che il
  modo in cui ho presentato l'opzione (con numeri e perimetro già pronti) era sufficiente a decidere.

---

## 7. Analisi flusso prompt, efficienza e statistiche

- **Prompt sostanziali di Matteo in questa chat:** 2 (uno di avvio + uno di prosecuzione/chiusura).
- **Correzioni dopo la prima risposta:** 0 — il secondo prompt non corregge nulla del lavoro P0, lo
  approva e ne chiede il seguito.
- **Follow-up generati da me:** 1 domanda esplicita (aggiungere o no le 3 ondate), risolta dal secondo
  prompt di Matteo.
- **Modalità alzata:** no, la modalità (`deep`, sola lettura) era già quella corretta indicata dal
  piano per l'ondata P0; per questa seconda fase (editing dei documenti di piano) ho usato lo stesso
  livello di cura senza bisogno di alzarla.
- **Cosa ha reso i prompt efficaci:** entrambi indicavano un'azione precisa con un criterio d'uscita
  chiaro ("esegui P0 quando hai il contesto", "aggiungi, completa, poi report e commit") — nessuna
  ambiguità su cosa fare dopo, il che ha permesso di incatenare le azioni senza fermarmi a chiedere.

---

## 8. La TUA lettura della sessione

- **Impressioni:** il sistema di skill/regole del cantiere (piano + tracking + regole `_stato/`) ha
  funzionato bene per un'ondata di tipo "inventario": mi ha detto esattamente cosa produrre (report +
  stato, schema libero perché P0 non usa lo schema a 7 sezioni delle ondate di mining) e cosa non fare
  (niente lettura di contenuto, niente modifica ai corpora). Non ho avuto bisogno di indovinare nulla.
- **Difficoltà incontrate:** la shell PowerShell di questo ambiente ha avuto comportamenti intermittenti
  con alcune pipeline (`Get-ChildItem | Select-Object` restituiva output vuoto in alcuni casi, mentre
  la stessa pipeline con `-Name` o `| Out-String` funzionava). Risolto passando sistematicamente a
  `-Name`/`Out-String` per ogni comando di conteggio. Non è un problema del progetto, è
  dell'interazione tool-shell in questo ambiente Windows.
- **Migliorie che suggerirei** (come dato, non come modifica applicata da me): il piano non prevedeva
  un passo esplicito "controlla se sotto `docs/` esistono cartelle non elencate nella mappa corpora" —
  è stato un controllo che ho aggiunto di mia iniziativa leggendo la struttura di `docs/` a tappeto, e
  ha trovato la scoperta più importante della sessione. Suggerirei di rendere esplicito questo
  controllo ("elenca tutte le cartelle di primo livello sotto ognuna delle root del piano e verifica
  che siano tutte assegnate a una linea") in un futuro P0-bis o come check ripetibile, non solo perché
  è andata bene questa volta.
- Non ho un voto sintetico da dare: questi sono i dati, la lettura di sintesi spetta al revisore.

---

## 9. Derivazione errori

Nessuna difficoltà da classificare come bug o errore vero e proprio in questa sessione. Le uniche
"correzioni" sono state al piano stesso (non a codice), e la causa è chiara in ogni caso:

- **Refusi di somma nel piano** (linee A: 461 invece di 458; G: 119 invece di 120): causa **prompt/
  piano incompleto** — chi ha scritto il piano ha sommato a mano invece di ricontare da script, errore
  umano non un errore mio in questa sessione (li ho trovati, non commessi).
- **Linea M sottostimata di 147 file**: causa **vincolo strutturale/di scoping originario** — il piano
  è stato scritto guardando `Comunicazione-Skill/` come "la" cartella meta, senza fare un elenco
  esaustivo di tutte le cartelle sotto `docs/`. Non è un errore di esecuzione, è un gap di scoping alla
  nascita del piano (comprensibile: le 12 cartelle skill d'area sono nate e cresciute nel tempo, non
  tutte insieme).
- **`2025-10-21` scambiato per cartella**: causa **ambiguità nel nome** — un file senza estensione con
  un nome che sembra una data di cartella (coerente con le altre date-cartella del corpus) inganna
  facilmente un elenco fatto a occhio; l'ho trovato solo perché ho contato in automatico con
  `Get-ChildItem -Directory` e il conteggio non tornava.

---

## 10. Cosa resta per la prossima sessione

- Eseguire le ondate di mining: si può partire da una qualsiasi tra M1-M4, A1-A11, B1-B3, C1-C5,
  D1-D2, E1-E2, F1, G1-G3, H1-H5, I1-I2 — sono tutte indipendenti tra loro (nessuna dipendenza residua).
- J1 (fatti oggettivi da git) ha già alcuni numeri anticipati nel report P0 §10, da usare come punto di
  partenza, non come sostituto dell'analisi completa.
- Le sintesi S1-S6 restano in fondo, dopo tutte le mining.
- Nessuna riga in `docs/FOLLOW_UP.md`: questo cantiere ha il proprio tracking dedicato
  (`00_PROMPTS_SEQUENZA_TRACKING.md` + `_stato/`), non passa dal FOLLOW_UP generale del progetto.

---

## 11. Domande di chiusura

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «leggi @docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/00_PROMPTS_SEQUENZA_TRACKING.md
- @docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/PIANO_INDAGINE.md -
@docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/_stato/README.md . esegui p0 , dopo che hai
tutto il contesto necessario» — (2) «aggiungi le 3 ondate. completa il tuo lavoro poi fai report
lavoro svolto commit .»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Ho riaperto `PIANO_INDAGINE.md` e `00_PROMPTS_SEQUENZA_TRACKING.md` dopo ogni modifica
(tramite `Read`/`Grep`) per controllare che i numeri inseriti (36/46/41/60 per M1-M4, 458/386/120 per
A/C/G, 112/33 per I1/I2, il punto di taglio B2/B3) coincidessero esattamente con quelli calcolati nel
report P0, e ho fatto un `Grep` finale su tutto il file per escludere residui delle vecchie cifre
(~16, ~90, ~56, 461, 385, 119, "44 ondate").

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: I due file del cantiere (`PIANO_INDAGINE.md` e `00_PROMPTS_SEQUENZA_TRACKING.md`) sono
mutuamente collegati (uno definisce le ondate, l'altro i prompt pronti) e li ho aggiornati insieme,
riga per riga corrispondente, per non farli divergere. Non ci sono altri file collegati: la modifica
non tocca skill area del prodotto, tipi, test o context applicativo, solo la documentazione di questo
cantiere di indagine.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho generato per esteso, dentro i documenti di piano, la lista dei 144 file di `.cursor/plans`
con la relativa etichetta di progetto (I1/I2): è aggregata nel report P0 §9 ma non allegata riga per
riga, per non appesantire due file che altri agenti dovranno rileggere spesso. È una scelta dichiarata
nel report stesso, non una dimenticanza — resta disponibile a chi eseguirà I1/I2, rigenerabile con lo
stesso criterio in pochi minuti.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: L'unico attrito reale è stato tecnico (comportamento intermittente di alcune pipeline PowerShell,
vedi §8) e non del sistema di documentazione; sul piano/skill l'attrito più probabile per un futuro
agente è dimenticarsi di controllare `git log` sul branch `feature/console-super-admin` oltre a
`main`/`env/test` quando eseguirà M2 — l'ho già scritto esplicitamente nel prompt M2 apposta.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto. Ho caricato solo i 3 file indicati dal comando iniziale (piano, tracking, stato/README)
più, in corsa, la skill `CHIUSURA_SESSIONE.md` per il formato di questo report — nessun contesto
superfluo. Non ho ricevuto notifiche di hook durante la sessione.
```

---

## 12. Self-review (fatta prima di dichiarare il report pronto)

1. **Dati = diff reale**: riverificato con `Grep` che non restassero cifre vecchie nei due file di
   piano (vedi R2).
2. **File correlati allineati**: i due file del cantiere sono coerenti tra loro riga per riga (vedi R3).
3. **Q1-Q6 coerenti**: le risposte non si contraddicono e Q2/Q3 riportano verifiche fatte davvero
   riaprendo i file.
4. **Tono utente**: il cappello e le sezioni 2, 6 parlano di scoperte e decisioni concrete, non di
   nomi-file isolati.

---

## Chiusura verso Matteo

- Il piano ora corrisponde al disco: i numeri tornano, e le 3 nuove ondate (M2 Console, M3
  Admin/Database/Testing, M4 Legal/Marketing/Prenota/Menu-QR) sono pronte da copiare in una chat nuova
  quando vuoi iniziarle.
- Non ho toccato nessun file di prodotto (`src/`) né lo skill system del progetto: solo i due
  documenti del cantiere di indagine.
- Procedo ora con il commit, solo dei file di questa sessione (piano, tracking, report P0, stato P0,
  questo report di chiusura).
