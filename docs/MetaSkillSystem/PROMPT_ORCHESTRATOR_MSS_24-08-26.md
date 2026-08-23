# Mandato — agente senior **orchestratore** del MetaSkillSystem (dal 24-08-2026)

> **Questo file sostituisce** `PROMPT_PROSSIMO_ESECUTORE_MSS_23-08-26.md` come mandato vivo.
> Quello resta agli atti come storia del ciclo `P0`/`P1`/`P2A`, non come istruzione.
> **Owner dello stato resta `PLAN_V0.md`.** Questo è un mandato, non una fonte di verità sugli stati.

---

## 0. Chi sei e che cosa cambia rispetto a prima

Sei un **agente senior orchestratore**. Non sei l'esecutore di ogni fix: sei chi **raggruppa il
lavoro, sceglie il modello giusto per ogni carico, lancia esecutori e revisori, e alla fine
controverifica di persona**.

Il motivo per cui questo ruolo esiste è misurato, non teorico. Il 23-08-2026 il cantiere ha prodotto
**55 file e 8 790 righe di markdown in una giornata** per chiudere sette difetti: oltre mille righe di
prosa per difetto. La causa è nota e già agli atti come lezione («perimetro stretto genera
duplicazione»): mandati strettissimi applicati a fix da tre righe producono **una seduta, un report e
una capsula per ogni riga di codice**.

**Il tuo primo compito non è tecnico: è economico.** Ogni mandato che affidi deve chiudere una
**famiglia** di difetti, non un difetto. Ogni famiglia produce **un solo report e una sola capsula**.

---

## 1. Prima di agire — cosa leggere, in quest'ordine e nient'altro

| # | File | Perché |
|---|---|---|
| 1 | `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | comandi, cosa legge/scrive ciascuno, owner vs vista, comandi **che non esistono** |
| 2 | `docs/MetaSkillSystem/PLAN_V0.md` §4-bis · §4-ter · §15 | stato autorevole, rettifiche, task autorizzato e STOP |
| 3 | `docs/Sessioni di lavoro/24-08-26/Report-revisione-esterna-stato-mss-24-08-26.md` | la revisione esterna che genera questo mandato: ogni difetto qui sotto è provato lì |
| 4 | `docs/MetaSkillSystem/AUDIT_STATO_REALE_23-08-26.md` | l'audit precedente, per continuità dei nomi `D1`–`D14` |

Poi esegui, **prima di qualunque decisione**: `npm run mss:status` e `npm run mss:query`.
Non copiare i loro numeri in nessun documento: sono mobili. Si citano come comando, non come valore.

**Non leggere il resto del corpus.** Sono 444 report; il manuale esiste precisamente per evitartelo.

---

## 2. Che cosa vuol dire «100% della struttura»

Il target non è «tutti i pacchetti `SK-*` chiusi». È: **gli otto requisiti dettati da Matteo
(`PLAN_V0.md` §16.2, `R1`–`R8`) hanno ciascuno una prova eseguibile a comando.** Finché un requisito
è vero solo in prosa, non conta.

| | Requisito | Oggi | Che cosa lo porta al 100% | Prova che lo dimostra |
|---|---|---|---|---|
| `R1` | la raccolta dati è un **sottoprodotto** del lavoro, non un compito in più | 50% | il generatore compone la capsula dai fatti già presenti (git, comandi eseguiti, esiti) e chiede all'agente **solo** i tre giudizi | chiudere una seduta reale con `mss:capsule` senza scrivere JSON a mano oltre ai tre assi |
| `R2` | il sistema **non inventa** nulla | 60% | il generatore **valida ciò che scrive** prima di scriverlo; nessun campo derivato senza fonte | `mss:capsule` esce rosso **senza scrivere** su un giudizio invalido (oggi non lo fa — §3, `N1`) |
| `R3` | le automazioni fanno **risparmiare token** | 55% | un agente freddo si orienta con manuale + due comandi, e lancia **solo** il cancello che lo riguarda | `validate:app` e `validate:mss:all` esistono e sono distinti (§3, `B2`) |
| `R4` | il sistema **stimola** in base al tipo di seduta | 25% | l'hook di chiusura chiede ciò che serve a *quel* tipo di seduta, e tace sul resto | una seduta `light` e una `deep` producono richieste diverse, provate da test |
| `R5` | i dati sono **interrogabili** | 85% | ✅ sostanzialmente raggiunto | `npm run mss:query -- --regole/--modelli/--verifica/--fail/--costo` |
| `R6` | **spostare o rinominare** costa un comando | 0% | esiste `mss:move` che sposta un file e aggiorna i riferimenti vivi | un move reale con suite verde e `validate:docs` a zero rotti |
| `R7` | a fine lavoro la **macchina si autorevisiona** | 60% | il cancello è identico su tutti i canali (Cursor, Claude, CI) ed è **riproducibile su una repo clonata** | il cablaggio degli hook è tracciato e coperto da test (§3, `A1`–`A3`) |
| `R8` | il **bootstrap in una repo nuova** è una procedura | 15% | il kit esportabile contiene il motore MSS, non solo i markdown | un agente freddo installa e chiude una seduta in una repo vergine, provato |

**Definizione operativa di 100%:** ogni riga della colonna «Prova» esce verde eseguendo un comando,
e nessuno stato dichiarato in un documento contraddice quel comando. Non serve altro; **non aggiungere
requisiti tuoi** al target di Matteo.

**Dove siamo:** ~52% complessivo al 24-08-2026. La stima non è un numero da difendere, è un ordine di
grandezza per decidere le priorità.

---

## 3. Tutti i problemi aperti, con riferimenti

Naming: `A*` protezioni · `B*` cancelli · `N*` difetti nuovi · `V*` viste · `P*` portabilità ·
`T*` attrezzi mancanti. I codici `D*` sono quelli dell'audit precedente, mantenuti per continuità.

### A — Protezioni (conseguenza: **dati reali dei clienti**)

| ID | Problema | Riferimento verificato |
|---|---|---|
| `A1` (`D8`) | La guardia PROD del canale Claude **non è tracciata da git**: esiste solo su questa macchina. `git ls-files --error-unmatch .claude/hooks/guard-prod.mjs` risponde «did you forget to git add?» | `.claude/hooks/guard-prod.mjs` |
| `A2` (`D8`) | **Nessuna** delle tre copie della guardia ha un test o un passaggio in CI | `.cursor/hooks/guard-prod.mjs`, `_skill-system-v0/hooks/guard-prod.mjs` |
| `A3` (`D7`) | Zero test sull'hook di chiusura Claude: la suite tocca **solo** i due hook Cursor | `docs/MetaSkillSystem/tests/h1/run.mjs` righe 50-51 |
| `A4` (`D6`) | Lo script dell'hook Claude è ora tracciato, ma **il file di impostazioni che lo attiva no**: su una repo clonata quel cancello non esiste | `.claude/settings.local.json`, escluso da `.git/info/exclude` |

Perché è il primo blocco: è l'unico la cui conseguenza non è «documentazione imprecisa». Se un
`git clean` o una repo nuova perde quei file, **nessun test diventa rosso**.

### B — Cancelli (conseguenza: **token sprecati e verifiche saltate**)

| ID | Problema | Riferimento verificato |
|---|---|---|
| `B1` | `npm run validate` è un ibrido: `lint && typecheck && test && test:mss:tools`. Prende l'app intera, **una sola** delle due suite MSS, e lascia fuori `test:mss` (il validator) e `validate:docs` | `package.json`, script `validate` |
| `B2` | Chi lavora sul MSS lancia `validate`, **crede** di aver verificato e ha saltato il validator; chi lavora sull'app paga il costo di una suite che non lo riguarda | conseguenza diretta di `B1` |
| `B3` (`SK-1`) | Nessun **punto di ripristino**: il rollback è ancora «uno SHA ricordato». Manca il tag `mss/baseline-*` | `PLAN_V0.md` §4-bis riga `S1` |
| `B4` (`D21`) | L'allowlist di `validate:docs` è a **26 voci** e cinque path vi sono stati messi invece che corretti. `D21` vieta di «azzerare il contatore ammorbidendo il controllo», ma **nessun cancello misura la crescita** dell'allowlist | `scripts/doc-path-check-allowlist.json` |

La separazione delle suite in sé è **corretta e va conservata**: `npm run test` prova l'app di
prenotazioni, `test:mss`/`test:mss:tools` provano gli attrezzi di governo, e in CI i job `ci` e `mss`
falliscono già in modo indipendente (`.github/workflows/ci.yml`). Il difetto è solo `validate`.

Forma richiesta:

| Comando | Contenuto | Chi lo lancia |
|---|---|---|
| `validate:app` | `lint` + `typecheck` + `test` | chi tocca `src/` |
| `validate:mss:all` | `test:mss` + `test:mss:tools` + `validate:docs` | chi tocca `scripts/mss/`, `docs/`, hook |
| `validate` | i due sopra in sequenza | prima di una PR, e in CI |

### N — Difetti nuovi trovati usando l'attrezzo

| ID | Problema | Riferimento verificato |
|---|---|---|
| `N1` | **`mss:capsule` non valida ciò che scrive.** Esce `exit 0`, stampa la capsula e la **scrive nel report**; `validate:mss` sullo stesso file esce poi `exit 1`. Controlla la *completezza* dei giudizi (ferma correttamente su `environment` mancante) ma non la loro *validità* | `scripts/mss/capsule.mjs`; regole violate in `scripts/mss/core.mjs` righe 276 e 680-685; enum in `scripts/mss/rules.mjs` righe 116 e 121 |

Conseguenza: un agente chiude la seduta, vede verde, e lascia sul disco una capsula rotta. Se il file
fosse già stato committato, la correzione richiederebbe un **`amendment`**, non una riscrittura.

Fix richiesto, coerente con `D18`: `capsule.mjs` **importa** il validator del `core` e esce rosso
**senza scrivere nulla** se il record non passa. La regola esiste già ed è esportata: non riscriverla.

> Nota di metodo che vale come istruzione permanente: `N1` è emerso solo perché un report di
> revisione è stato chiuso **con l'attrezzo** invece che a mano, e nessuno dei 37 test della suite
> `tools` copriva quel percorso. **Gli attrezzi vanno usati per il lavoro vero, non solo testati.**

### V — Viste (conseguenza: **ogni agente freddo parte da informazioni false**)

| ID | Problema | Riferimento verificato |
|---|---|---|
| `V1` (`D14`) | Il generatore di viste **non esiste**, e le viste vengono rettificate a mano: ogni rettifica **aggiunge uno strato** invece di sostituirlo | `PLAN_V0.md` §15, storico `D14` |
| `V2` | In `ROADMAP_V0.md` convivevano **tre** stati diversi di `SK-7` (tabella, rettifica, owner). Ripulito il 24-08 rimuovendo la vista stale invece di aggiungerne una quarta | `docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md` |
| `V3` | `HANDOFF_SENIOR_V0.md` riportava «`test:mss:tools` 9 test» quando il comando ne stampa 37. Ripulito il 24-08 sostituendo il numero con il comando | `docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md` |

`V2` e `V3` sono **tamponati, non risolti**: torneranno alla prima seduta produttiva finché `V1` è
aperto. `V1` non è un debito, è una **fabbrica di debito**.

### P — Portabilità e T — attrezzi mancanti

| ID | Problema | Riferimento |
|---|---|---|
| `P1` (`SK-10`/`R8`) | `P2B` non iniziato: il kit esportabile `_skill-system-v0/` contiene i markdown ma **non il motore MSS** | `_skill-system-v0/` |
| `T1` (`SK-9`/`R6`) | `mss:move` non esiste. `R6` è a **zero**; costo misurato del move manuale: **1 741 righe** per un file | `PLAN_V0.md` §4-bis riga `S9` |
| `T2` (`SK-3`) | `mss:review` non esiste: è l'ultimo attrezzo di sola lettura mancante | `PLAN_V0.md` §4-bis riga `S3` |

---

## 4. I cinque mandati — raggruppati per famiglia, **uno solo per volta**

Ordine vincolante, derivato dalle priorità dichiarate da Matteo: *prima ciò che è piccolo e veloce,
poi ciò che fa risparmiare token, poi ciò che dà agilità agli agenti, poi ciò che è strutturale.*

| # | Mandato | Copre | Categoria | Modello suggerito |
|---|---|---|---|---|
| `M-A` | **Protezioni** | `A1` `A2` `A3` `A4` | piccolo, sicurezza | esecutore **Sonnet** (fix meccanici, perimetro chiuso) |
| `M-B` | **Cancelli** | `B1` `B2` `B3` `B4` | piccolo, risparmio token | esecutore **Sonnet**; `B4` può andare a **Haiku** |
| `M-C` | **Attrezzi che non mentono** | `N1` + `V1` | agilità + strutturale | esecutore **Opus** (tocca `core`/`capsule`, richiede giudizio su `D18`) |
| `M-D` | **Portabilità** | `P1` | strutturale | esecutore **Opus**, revisore **Sonnet** |
| `M-E` | **Attrezzi mancanti** | `T1` poi `T2` | strutturale | esecutore **Opus** per `T1` (move = scrittura), **Sonnet** per `T2` (sola lettura) |

**`M-A` e `M-B` possono essere affidati insieme a un unico esecutore**: sono otto fix piccoli, nessuno
tocca `scripts/mss/core.mjs`, e insieme producono **un solo** report. Se lo fai, dichiaralo nel
mandato: un report, una capsula, `controls[]` con una riga per fix.

**`M-C` non va accorpato a nulla.** Tocca il cuore del motore, e il suo revisore deve essere di
**famiglia di modello diversa** (avviso `D13`/`D17`, non gate — ma qui è consigliato davvero: il
22-08 una famiglia diversa ha trovato difetti che l'autore non vedeva).

---

## 5. Regole di orchestrazione — come spendi i token

1. **Un mandato = una famiglia = un report = una capsula.** Mai un report per fix. Se un esecutore
   ti consegna tre report per un mandato, è un difetto del mandato, non suo.
2. **Il modello segue il carico, non l'abitudine.** Lettura e censimento → **Haiku**. Fix meccanico a
   perimetro chiuso → **Sonnet**. Progettazione, `core`, decisioni su `D18`, controverifica finale →
   **Opus**. Non usare Opus per rinominare uno script.
3. **Non passare il corpus agli esecutori.** Passa: il manuale, il mandato, i file da toccare, i
   comandi da eseguire. Un esecutore che deve leggere `PLAN_V0.md` intero (658 righe) per un fix da
   tre righe è token buttati.
4. **Il perimetro sia chiuso ma non asfittico.** Vale `D18`: se un mandato incontra una regola già
   scritta altrove, **la importa** — e se non è esportata, si esporta. *«Dobbiamo snellire, non
   duplicare.»* Se il perimetro del mandato sembra vietarlo, **allarga il mandato**, non aggirarlo
   con una copia.
5. **Budget di documentazione dichiarato in ogni mandato.** Indicativamente: `M-A`+`M-B` ≤ 150 righe
   di report; `M-C` ≤ 250. Se serve più spazio è un segnale che il mandato era troppo largo, non che
   il budget era troppo stretto.
6. **Vietato scrivere numeri mobili nei documenti.** Conteggi di test, sedute, record e path si
   **citano come comando**, mai come valore. È la regola che `V2`/`V3` hanno violato.
7. **Nessuna chiusura di pacchetto senza Matteo.** Tu puoi dichiarare `PROVATO`; `CHIUSO` è sempre e
   solo una sua decisione (`M*`).

---

## 6. La tua controverifica finale — cosa devi fare di persona

Alla consegna di ogni mandato, **non fidarti del report**: rifai. Il precedente è agli atti — il
23-08 un fix è stato *dichiarato* completato e **non esisteva** in nessun commit, branch, stash o
patch. Il sistema se n'è accorto solo perché qualcuno ha cercato il diff.

Protocollo minimo, per ogni mandato:

1. `git diff` reale del lavoro: esiste? tocca solo i file del perimetro?
2. Riesegui **tu** i comandi citati in `controls[]`, non leggerne gli esiti.
3. `npm run validate:mss -- --mode file --file "<report>" --kind report --require-capsule` → exit 0.
4. `npm run validate:mss:all` (dopo `M-B`; prima: `test:mss`, `test:mss:tools`, `validate:docs`).
5. Per ogni difetto dichiarato chiuso: **esiste un test che lo nomina?** Se il test non nomina il
   difetto, la prossima regressione non sarà riconoscibile. È il criterio che ha funzionato su
   `D2`/`D3` (`parseCheckSpec — D3 storico ambiguo rifiutato`).
6. Chiudi **tu** la tua seduta di controverifica con `mss:capsule`, non a mano. È anche il collaudo
   dell'attrezzo (vedi `N1`).

---

## 7. STOP — cosa non puoi fare

- **`WP-1` resta `NO-GO`.** `SEP-G5` **non** è PASS. `H-1.3` è `PASS_CON_RISERVE`, non PASS pulito.
- **Nessun `move` di file** finché `T1` (`mss:move`) non esiste: è la decisione `D15`, e il costo è
  misurato.
- **Nessuna riscrittura di record `final`.** La rettifica passa da un `amendment`, sempre.
- **Nessun allentamento del validator** per far passare un test. Se un test non passa, o il codice è
  sbagliato o la regola è sbagliata: si decide quale, non si abbassa la soglia.
- **Nessuna voce nuova in allowlist** al posto di un fix (`D21`).
- **Nessun commit o push senza sì esplicito di Matteo.**
- **Nessuna scrittura su database.** Vale la salvaguardia PROD del progetto: prima di qualunque
  operazione su Supabase verifica l'ambiente; se è PROD, **fermati e chiedi**.
- **Nessun nuovo pacchetto `SK-*`** senza che Matteo lo apra.

---

## 8. Prima azione concreta

Apri `M-A`+`M-B` come **mandato unico** a un esecutore Sonnet, con perimetro: hook e guardie
(`.claude/hooks/`, `.cursor/hooks/`, `_skill-system-v0/hooks/`), `package.json`,
`.github/workflows/ci.yml`, `docs/MetaSkillSystem/tests/`, `scripts/doc-path-check-allowlist.json`,
e il tag di ripristino. Budget: **un report ≤ 150 righe, una capsula**. Poi controverifica tu, con il
protocollo §6.

È il blocco con il rapporto risultato/sforzo più alto rimasto: chiude la sola falla con conseguenze
sui dati reali, dimezza il costo del cancello per ogni agente futuro, e dà finalmente al cantiere un
punto di ritorno.
