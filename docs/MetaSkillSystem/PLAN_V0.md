# Masterplan operativo — MetaSkillSystem v0

> **Cantiere:** `SYS-1` · **Stato:** aperto · **Modalità:** ombra  
> **Proprietà:** questo file è l'unica fonte di verità per stato, sequenza, progressi e gate del
> MetaSkillSystem v0. Roadmap, handoff e report rimandano qui senza ricopiare lo stato.  
> **Nord del cantiere:** vedi **§16 — Target dello scheletro**, dettato da Matteo il 21-08-2026.
> È la direzione che governa l'ordine dei prossimi pacchetti.  
> **Ultimo movimento:** **P2A in corso** — manuale operativo locale
> [`MANUALE_OPERATIVO_MSS_V0.md`](MANUALE_OPERATIVO_MSS_V0.md) (`SK-10`, non chiuso; `R8` non
> soddisfatto). Audit e P1 restano in [`AUDIT_STATO_REALE_23-08-26.md`](AUDIT_STATO_REALE_23-08-26.md)
> e report P1. `SK-7` gate A/B; `H-1.3` `PASS_CON_RISERVE`; `WP-1` **NO-GO**.
>
> **Rettifica 21-08-26 (append, non riscrittura):** l'intestazione precedente si era fermata al
> movimento `H-1.1` del 10-08-26 e dichiarava «Checkpoint WP-0.1 locale `7632443`. Nessun commit/push»,
> mentre il corpo dello stesso file era già arrivato a `H-1.3` e a `ee0ab39` pushato. Era il primo
> campo letto da qualunque agente freddo ed era falso. Causa registrata: aggiornamento della sola
> sezione «prossimo passo» senza rilettura delle sezioni di testa. Fonte:
> `docs/Sessioni di lavoro/21-08-26/MAPPA-MSS-consulenza-esterna-21-08-26.md` §7.

## 1. Scopo

Costruire un sistema capace di crescere senza chiedere a ogni agente di leggere tutto, conservando
eventi affidabili sulle sedute e separando tre assi non intercambiabili:

- **Persona:** ciò che Matteo decide, apprende, trasferisce, verifica o delimita;
- **Sistema:** ciò che routing, regole, agenti e controlli fanno realmente;
- **Output:** entità prodotte, uso, attribuzione, prova e lifecycle.

Il kernel resta piccolo; pacchetti e ruoli aprono soltanto il contesto necessario; gli eventi
alimentano viste derivate; osservazione, modifica e validazione del sistema restano ruoli distinti.

## 2. Vincoli che non si riaprono

1. Il sistema attuale resta autorevole durante la modalità ombra.
2. Nessuna migrazione o riscrittura della root prima dei gate di release.
3. Macro prima dei micro; nessun punteggio personale introdotto dal pilota.
4. `Nessuna osservazione`, `non noto` e `non applicabile` sono dati validi.
5. Nessuna promozione Persona da una chat ordinaria o da una singola istanza assistita.
6. Un file/supporto non è automaticamente un prodotto.
7. Un valore dinamico ha un solo owner; le altre superfici sono rimandi o viste generate.
8. Governance, osservazione ed enforcement restano misure separate.
9. Il fallimento di `C9` resta storico; questo cantiere non è una nuova somministrazione di `C9`.
10. Dati personali e prove sigillate restano separati dal kernel portabile.

## 3. Come leggere il masterplan

- **Adesso:** un solo pacchetto principale aperto.
- **Subito dopo:** lavoro già ordinato ma non ancora iniziato.
- **Più avanti:** direzione nota, dettagli intenzionalmente incompleti.
- **Buco dichiarato:** decisione che richiede dati; non va riempita per plausibilità.

Stati ammessi per i work package:

- `NON INIZIATO`
- `APERTO`
- `IN PILOTA`
- `BLOCCATO DA GATE`
- `CHIUSO NEL DISEGNO`
- `CHIUSO E OSSERVATO`
- `RITIRATO`

Uno stato storicamente dichiarato chiuso che viene smentito da una prova riproducibile torna
`APERTO`; la dichiarazione non viene cancellata, ma resta nel log con il riferimento alla rettifica.

Il lifecycle futuro di regole e cantieri sarà modellato in WP-3; questi stati governano soltanto il
lavoro del masterplan.

## 4. Quadro corrente

| Ordine | Pacchetto | Stato reale | Prossimo gate |
|---|---|---|---|
| 0 | `WP-0` — parametri macro e prima capsula | `CHIUSO NEL DISEGNO` | efficacia da osservare nei piloti |
| 1 | `MP-0` — report osservazioni + masterplan unico | `CHIUSO E OSSERVATO` 09-08-26 | roadmap generale ridotta a puntatore |
| 2 | `WP-0.1` — hardening pre-pilota | `CHIUSO NEL DISEGNO` 09-08-26 | efficacia da osservare nel primo pilota |
| 3 | `H-1` — validator + hook rapidi | **chiusura invalidata dalla revisione H-1.1** | resta storia del primo hardening |
| 3.1 | `H-1.1` — integrità append-only e semantica | **`CHIUSO NEL DISEGNO` 10-08-26** | revisione completa esterna prima di WP-1 |
| 3.2 | `H-1.3` — amendment / staged / parità superfici | **`PASS_CON_RISERVE` 10-08-26** — ✅ **riserva `H13-POST-L01` CHIUSA il 24-08-26** (`M13`): il contratto §6 dichiara che `previous_value_or_hash` porta il **valore**, confrontato in forma canonica, e che nessun digest è supportato; test nelle due direzioni `H13-POST-L01 — previous_value_or_hash è il valore, mai un digest` in `npm run test:mss`, verificato non vacuo (sostituendo il digest col valore il gruppo diventa rosso). ✅ **25-08-26 T7 `H13-E2`:** inventario bypass in `COVERAGE_MATRIX_H1.json` + report `Report-h13-e2-bypass-t7-25-08-26.md`; bypass **`B-E2-CI`** (matrice «CI non cablata» su `H1-FIXTURE-PROTOCOL`) **chiuso** — `SK-5` cabla `validate:mss:all` in `.github/workflows/ci.yml` su `main`/`env/test`; test nominato `H13-E2 / SK-5 — CI cablata, matrice senza bypass stale`. ⚠️ restano i **bypass E2 intenzionali** (`--no-verify`, unstaged, Cloud/Codex/Claude senza hook, …): **`PASS` pulito non è dichiarato** | bypass E2 residui; **non** apre WP-1; G5 non PASS |
| 4 | `WP-1` — piloti reali in ombra | **`NON INIZIATO` — NO-GO** (H-1.3 con riserve ≠ via libera) | ricostruzione fredda senza perdita/invenzione |
| 5 | `WP-2` — mining storico normalizzato | `BLOCCATO DA PRIMO PILOTA` | eventi citano fonti e schema/versione |
| 6 | `WP-3` — kernel, manifest, pacchetti e chiavi | `NON INIZIATO` | autorità e precedenze formalizzate |
| 7 | `WP-4` — preflight, registro Output e viste | `NON INIZIATO` | conflitti/owner/scope rilevati prima delle azioni coperte |
| 8 | `WP-5` — nuova suite di validazione | `NON INIZIATO` | casi avversariali con oggetto e ruoli separati |
| 9 | `WP-6` — decisione di cutover | `NON INIZIATO` | zero perdita vitali e gate di release superati |
| — | `E-2` — enforcement superiore | **buco intenzionale** | tecnologia e posizione si decidono dopo i dati di H-1/WP-1 |

### 4-bis. Pacchetti «scheletro» — aperti dal target §16 (21-08-2026)

Questi pacchetti servono il target dettato da Matteo. Non sostituiscono `WP-1…WP-6`: costruiscono gli
attrezzi senza i quali quei pacchetti costano più di quanto rendono. Ordine vincolante: **prima ciò
che è gratis e sblocca, poi ciò che legge soltanto, poi ciò che scrive.**

| Ordine | Pacchetto | Stato | Prova di chiusura (comando, non opinione) |
|---|---|---|---|
| S0 | `SK-0` — sbloccare i cancelli globali | **`CHIUSO E OSSERVATO` 21-08-26** | ✅ `npm run lint` **exit 0** (era 363 problemi / 17 errori) · ✅ `npm run test` **163 file, 1346 test, exit 0** · ✅ `npm run validate` **exit 0** · ✅ `validate:docs` **3 886 → 17** path rotti |
| S1 | `SK-1` — punto di ripristino (tag annotato) | **ESEGUITO E PUBBLICATO** 24-08-26 | tag annotato `mss/baseline-h13` su `HEAD` pre-`M-A`/`M-B`, pubblicato su `origin` il 24-08-26 con decisione `M5` di Matteo: `git ls-remote --tags origin "mss/*"` lo conferma dal remoto, non solo in locale |
| S2 | `SK-2` — `mss:status` (sola lettura) | **`ALLINEATO` 25-08-26 (`T7`)** | ✅ gate da parser PLAN condiviso con `generate:mss:views` (ultimo ciclo, non gate storici) · ✅ sezione viste anti-stale · ✅ §4-bis senza numeri congelati · ✅ test nominato `SK-2 / status: gate autorizzato…` in `test:mss:tools` · ⚠️ ROADMAP/HANDOFF restano viste manuali fino a estensione generatore |
| S3 | `SK-3` — `mss:review` (sola lettura) | **`CHIUSO` 24-08-26 (`T2`, `M12`)** | ✅ `npm run mss:review` esiste ed è sola lettura (stato Git invariato) · ✅ test nominato `T2 / mss:review — …` in `test:mss:tools` (seduta sporca trova owner/L5/L6/capsula assente; seduta pulita `problems.length === 0`) · ✅ M12: gate rieseguiti verdi e controverifica OpenAI/gpt-5.6-sol, famiglia diversa dall’esecutore Cursor/Composer |
| S4 | `SK-4` — chiusura dei bypass + allineo contratto capsula | **`CHIUSO` 25-08-26 — firma Matteo post-revisione Cursor T6** | ✅ B1: due record legacy nuovi staged insieme ricevono entrambi `MSS-LEGACY-NEW-FORBIDDEN`, mentre lo storico canonico già in `HEAD` resta leggibile · ✅ B2/B3: `Report-` e `Verbale-` ricorsivi entrano nei gate staged/worktree · ✅ D18: `mss:review` importa `REPORT_PATH_RE` da `adapter.mjs` · test nominati in `test:mss` e `test:mss:tools` · revisione indipendente Cursor `PASS_CON_RISERVE` · firma verbatim Matteo 25-08-26 |
| S5 | `SK-5` — controlli MSS in CI su `env/test` | **`CHIUSO` 24-08-26 — decisione `M13` di Matteo.** Nessuna prova tecnica restava da produrre: era l'unico dei quattro pacchetti «in attesa di firma» davvero pronto | `npm run validate` è `validate:app` (`lint`+`typecheck`+`test`) seguito da `validate:mss:all` (`test:mss`+`test:mss:tools`+`validate:docs`); in `.github/workflows/ci.yml` il job `mss` esegue un unico step `npm run validate:mss:all`. ✅ **24-08-26: primo push eseguito (decisione `M5`) e job `mss` osservato VERDE su GitHub Actions reale** con questa forma — non più una simulazione locale. Verifica: `gh run list --branch env/test` |
| S6 | `SK-6` — `mss:query` (sola lettura) | **`CHIUSO` 23-08-26 — decisione di Matteo** | ✅ `npm run mss:query -- --regole/--modelli/--verifica/--fail` rispondono · ✅ `npm run test:mss` **exit 0** (conteggio mobile — eseguire il comando) · ✅ `node --check scripts/mss/query.mjs` **exit 0** · ⚠️ copertura test del lettore parziale (suite tools, non H-1 intero) · rettificato 22-08-26: capsula `SK-6` corretta con `amendment`; criterio revisori su `recorded_by.role` · ✅ **23-08-26 vista effettiva:** `query.mjs` delega `core.mjs::applyAmendmentsView()` · ✅ **23-08-26 P1:** `--fail` usa denominatori calcolati, non literal storici · revisioni/controlli: numero mobile → `npm run mss:query -- --verifica` · **Matteo ha dichiarato `SK-6` CHIUSO (`D16`)** |
| S7 | `SK-7` — `mss:capsule` (generazione) | **`CHIUSO` 24-08-26 — decisione `M3` di Matteo dopo controverifica** | ✅ attrezzo e report SK-7 esistono · ✅ fix B: `parseCheckSpec` canonico `ID=>comando`, legacy un solo `:`, ambigui rifiutati; il comando può contenere ulteriori `=>` · ✅ `runChecks` non passa comandi vuoti · ✅ rettifica privacy append-only su report SK-7 · ✅ `source_refs` escludono untracked non pubblicabili · ✅ test/tools, H-1, docs, lint, validator capsule e validate globale rieseguiti verdi il 24-08-26 |
| S8 | `SK-8` — radice robusta della suite | **`CHIUSO` 25-08-26 — firma Matteo post-revisione Cursor T6** | ✅ test nominato `SK-8 — test:mss esegue l’intera suite da cwd diversa…`: wrapper dalla root, una sola suite completa nel child da cwd temporanea esterna, root risolta da `import.meta.url`; prove negative su flag incompleto e cwd repo · revisione indipendente Cursor `PASS` · firma verbatim Matteo 25-08-26 |
| S9 | `SK-9` — `mss:move` | **`CHIUSO` 24-08-26 (`M-E`, `M12`)** | ✅ `npm run mss:move -- <sorgente> <destinazione>` sposta un file e aggiorna i riferimenti vivi · ✅ `npm run test:mss:tools` include il caso nominato `T1/R6` (move, rifiuti, rollback, costo < baseline) · ✅ controverifica Codex/OpenAI, famiglia diversa da Cursor/Composer, con sandbox indipendente: move+ref aggiornato, rifiuto rosso, rollback su validate rosso |
| S10 | `SK-10` — manuale utente + intervista di bootstrap | **`PROVATO` 24-08-26 (`M-D`); riserva `N6` chiusa da `M-G` CHIUSO (`M12`)** | ✅ `MANUALE_OPERATIVO_MSS_V0.md` + puntatori ingresso · ✅ **`P2B` fatto:** `mss:export` copia il motore e verifica la chiusura degli import; `mss:doctor` è la checklist di primo run; i path cablati sono parametrici via `scripts/mss/config.mjs` con **default identici a prima** · ✅ prova in repo vergine **rifatta dall'orchestratore in una terza cartella con nomi propri**: `npm run validate:mss:all` verde in repo ospite configurata · ✅ default invariato provato confrontando `REPORT_PATH_RE` col letterale di `git show HEAD:scripts/mss/adapter.mjs` · ✅ prima consegna **respinta** dalla controverifica (test `R8` ambientale non dichiarato come verifica di progetto → checklist rossa proprio in una repo ospite configurata), riparata nel completamento · ✅ **riserva `N6` rimossa:** passo `owner` di `mss:doctor` non accusa più Git — chiuso in `M-G` con controverifica famiglia diversa. Atti `M-D`: [`Report-md-portabilita-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-md-portabilita-24-08-26.md) · [`Report-completamento-md-r8-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-completamento-md-r8-24-08-26.md) · [`Report-controverifica-md-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-md-24-08-26.md) · atti `M-G`: vedi §15 |
| S11 | `SK-11` — test automatici degli attrezzi MSS | **`CHIUSO` 24-08-26 — decisione Matteo (`T4`)** | ✅ `npm run test:mss:tools` e `npm run test:mss` verdi (conteggio mobile: eseguire i comandi) · ✅ hook Claude e guard PROD coperti dai casi nominati `A1`–`A4`; `M-C` copre `N1`/`N2`; `M-D` copre `R8`/`R2`; `M-G` copre `N3`–`N6` · ✅ `P4`: caso nominato `capsule: P4/SK-11 — template R1 privacy resta di mode e non classifica la chat`, con input contraddittorio e contratto privacy letterale · ✅ `T3` / M12: controverifica Cursor/Composer, famiglia diversa dall’esecutore OpenAI/gpt-5.6 · ✅ **`T4`:** Matteo ha firmato la chiusura formale dopo M12 — nessuna prova tecnica residua |

### 4-ter. Rettifica tecnica dell'audit 23-08-26 — questa sezione prevale sulle celle stale sopra

| Pacchetto | Stato operativo dopo audit | Cosa deve accadere prima di una nuova chiusura |
|---|---|---|
| `SK-4` | **CHIUSO 25-08-26**: B1 staged chiuso; B2/B3 e D18 con test nominati; revisione Cursor T6 + firma Matteo. | Nulla. Chiuso. Rettifica SK4-ASSERT (Output axis) **CHIUSA T7** — [`Report-sk4-assert-t7-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md). |
| `SK-5` | **CHIUSO 24-08-26 (`M13`)**: `npm run validate` è `validate:app`+`validate:mss:all`; il job CI `mss` esegue un unico step `npm run validate:mss:all`, ed è stato **osservato verde su GitHub Actions reale** dopo il primo push (decisione `M5`). | Nulla. Chiuso. |
| `SK-7` | **CHIUSO 24-08-26 (`M3`)**: fix B D2/D3 e privacy append-only controverificati; sintassi canonica e source refs pubblicabili coperti da test. | Revisione indipendente (`D17`) resta consigliata, non gate. |
| `SK-8` | **CHIUSO 25-08-26**: suite da cwd esterna con test nominato; revisione Cursor T6 + firma Matteo. | Nulla. Chiuso. |
| `SK-11` | **CHIUSO 24-08-26 (`T4`)**: suite verde; hook `A1`–`A4`; copertura `M-C`/`M-D`/`M-G`; `P4` con M12 (`T3`); firma formale di Matteo. | Nulla. Chiuso. |

Analisi, prove e motivazione dell'ordine:
`docs/Sessioni di lavoro/21-08-26/STRATEGIA-scheletro-mss-21-08-26.md`.
Nessuno di questi pacchetti è autorizzato finché Matteo non lo apre esplicitamente.

## 5. Pacchetto chiuso nel disegno — `WP-0.1` hardening pre-pilota

### Obiettivo

Correggere soltanto ciò che renderebbe i primi eventi ambigui, incompatibili o non validabili. Non
anticipare il kernel completo di WP-3.

### Lavori

| ID | Lavoro | Stato | Gate |
|---|---|---|---|
| `0.1-A` | Aggiungere identità minima: versione schema, revisione sistema, pacchetti, agente/modello/runtime, strumenti e autore record | fatto in `0.1.0` | due eventi prodotti con versioni diverse restano distinguibili |
| `0.1-B` | Separare busta/evento grezzo da annotazioni Persona·Sistema·Output | fatto in `0.1.0` | un fatto può restare immutato mentre cambia un'annotazione |
| `0.1-C` | Definire rettifica append-only (`amends/supersedes`, motivo, autore, data) | fatto in `0.1.0` | una correzione non cancella l'evento precedente |
| `0.1-D` | Correggere la forma light e il punto in cui vive | fatto: JSONL pilot-only collegato dal log | inserimento reale non rompe `SESSION_LOG` ed è parsabile |
| `0.1-E` | Riallineare il quinto gate prodotto alla fonte proprietaria | fatto: `verification_or_use_evidence` | nessuna vista sostituisce “verifica/uso” con un altro campo |
| `0.1-F` | Aggiungere autore/verificatore e stato di verifica delle dichiarazioni | fatto in `0.1.0` | self-report e verifica indipendente sono distinguibili |
| `0.1-G` | Fissare il protocollo del primo pilota prima dell'istanza | fatto: protocollo `1.0.0`, 20 target, 14 fixture | versione, ruoli, denominatore e conseguenze non cambiano dopo l'esito |
| `0.1-H` | Definire privacy minima necessaria al pilota | fatto; retention resta buco dichiarato | cattura, divieti, sensibilità e rettifica sono espliciti; retention finale può restare aperta |
| `0.1-I` | Definire ID/correlazione minimi per sessione, compact e retry | fatto: UUIDv7 + capture key idempotente | nessuna collisione nel caso pilota e nessun doppio evento per lo stesso compact |

### Artefatti congelabili

- `CONTRATTO_CAPSULA_SESSIONE_V0.md` possiede schema e semantica vivi `mss.session/0.1.1`
  (storia `0.1.0` nel checkpoint WP-0.1);
- `PROTOCOLLO_PRIMO_PILOTA_V0_1.md` possiede oggetto, ruoli, denominatore, conseguenze, risultato
  pilota strutturato e i 14 ID minimi delle fixture H-1 (versione viva `1.0.1`);
- `fixtures/v0.1/FX-V02-*` dimostra con dati sintetici che link Markdown e JSONL restano separati e
  parsabili;
- `PARAMETRI_MACRO_V0.md` resta owner dei cinque gate prodotto e dei parametri macro;
- `SESSION_LOG.md` resta indice narrativo: le light vivono in file JSONL collegati, non nelle celle.

### Buchi ammessi in uscita

Possono restare non decisi, purché dichiarati:

- formato definitivo dell'event store;
- durata di conservazione;
- numero finale di piloti per tipologia;
- tecnologia dell'enforcement superiore;
- strategia multiutente;
- backup definitivo.

Questi buchi non devono impedire di identificare e validare il primo evento reale.

### Gate di chiusura

`WP-0.1` è chiuso nel disegno perché la versione congelabile rappresenta:

1. evento e annotazioni senza confonderli;
2. produttore e versione del sistema osservato;
3. rettifica senza overwrite;
4. sessione light senza rompere il log;
5. gate prodotto canonico;
6. self-report distinto da verifica;
7. protocollo del primo pilota fissato prima dell'esito.

La chiusura non dichiara efficacia: G è documentale, O/E arrivano con H-1 e WP-1.

## 6. Pacchetto attivo — `H-1` enforcement rapido con validator e hook

### Decisione

Prima tranche approvata da Matteo: usare i meccanismi più rapidi ed efficaci già compatibili con il
repo. Gli hook devono pescare quanti più errori meccanici possibile; i livelli superiori arrivano
dopo che schema e flusso sono solidi.

### Architettura minima

Un solo validator deterministico deve alimentare più punti di intercettazione:

1. **durante/alla chiusura in Cursor:** nudge mirato o richiesta di correzione;
2. **pre-commit Husky:** blocco della pubblicazione per artefatti staged non validi;
3. **comando manuale/CI futuro:** stesso esito sullo stesso input;
4. **fallback documentato per superfici senza hook:** nessuna falsa copertura.

Non duplicare la logica fra hook. Gli adapter raccolgono input; il validator possiede le regole
meccaniche.

### Prima copertura da implementare

- presenza e versione della capsula richiesta;
- campi vitali mancanti o placeholder;
- formato light valido;
- ID evento duplicato nel perimetro controllabile;
- owner/riferimento non risolvibile nel perimetro già strutturato;
- classificazione prodotto priva di uno dei cinque gate;
- report standard/deep senza capsula;
- light dichiarata senza evento light;
- uso di stato forte senza prova/verificatore richiesto;
- target/LOCK riconoscibili meccanicamente, inizialmente almeno a livello warning/blocco commit.

### Matrice di copertura obbligatoria

Per ogni controllo scrivere:

| Campo | Valore da dichiarare |
|---|---|
| superficie | Cursor locale · Codex · Claude Code · Cloud · commit · CI |
| momento | prima azione · dopo edit · stop · pre-commit · post-commit |
| effetto | allow · warn · ask · deny/blocco |
| fallback | comportamento quando payload/file non è leggibile |
| bypass noto | come può non scattare |
| G/O/E | stato separato, senza media |

### Gate di chiusura

> ⚠️ **Lettura obbligatoria prima del paragrafo che segue (nota aggiunta 21-08-26).** Questa
> dichiarazione di chiusura è **storia, non stato**: è stata **invalidata** dalla revisione `H-1.1`,
> come registra la tabella §4 riga `H-1`. Resta qui perché la provenienza non si cancella, ma
> **non va citata come stato corrente**. Lo stato corrente della catena di hardening è `H-1.3` =
> `PASS_CON_RISERVE`. Segnalata dal test a freddo della consulenza esterna come contraddizione
> interna al file.

H-1 è **chiuso nel disegno** (non ancora osservato su piloti reali) perché:

- un input valido passa allo stesso modo da comando e hook/adapter;
- le cinque controprove della revisione fredda sono respinte con rule code stabile;
- casi invalidi minimi sono respinti con messaggio azionabile (`rule_code` + file + field path);
- light e standard/deep sono entrambi coperti;
- bundle finali hanno un solo evento logico, assi finali, verificatori separati e gate prodotto
  completi; path assoluti/traversal/symlink escape e link light incoerenti sono respinti;
- le fixture negative sono valutate dal manifest e non impediscono il commit degli artefatti di test;
- la normale suite non riscrive le fixture e segnala drift rispetto al generatore;
- stop e pre-commit sono provati in integrazione; Cloud/Codex/Claude senza hook, `--no-verify`,
  unstaged, report non recenti o senza modalità restano bypass dichiarati nella matrice;
- ~~nessuna CI è dichiarata perché nessun workflow esegue H-1;~~ **RETTIFICATO 25-08-26 (`H13-E2`/`SK-5`):**
  il job `mss` in `.github/workflows/ci.yml` esegue `validate:mss:all` su `main` e `env/test`; la matrice
  **non** dichiara più «CI non cablata» su `H1-FIXTURE-PROTOCOL`; i controlli restano E2 locali (hook/stop),
  non E3 — la CI è enforcement indipendente dalla superficie, non sostituto degli hook;
- nessun hook è classificato E3: blocco solo a stop/pre-commit sulla pubblicazione staged.

Numero e significato delle fixture minime restano congelati da `0.1-G`: **14 casi**
`FX-V01…FX-V04` e `FX-I01…FX-I10`. H-1 ha creato i file eseguibili e casi supplementari senza
cambiare questi ID. Il collaudo corrente esegue 32 casi dichiarati e 13 gruppi di contratto e
integrazione. Maturità meccanica tipica: `G2/O1/E2`; il warning LOCK resta E1; nessun E3.

~~La salute globale resta separata: `typecheck`, H-1, lint e Vitest fuori `docs/Archives` sono verdi;
`npm run validate` e `npm test` globali falliscono perché ESLint/Vitest scoprono materiale storico
in `docs/Archives`. È debito di discovery da pacchetto workspace separato, non regressione H-1.~~

> **RETTIFICATO 21-08-26 — `SK-0` chiuso.** Il debito **non era** «da pacchetto workspace separato»:
> erano **tre righe di configurazione**. `.eslintrc.cjs` e `vitest.config.ts` non escludevano
> `docs/Archives/**`, e `scripts/check-doc-paths.mjs` escludeva `Archivio` (italiano) ma non
> `Archives` (inglese), mentre le due cartelle coesistono nel repo.
>
> **Dopo la correzione:** `npm run lint` **exit 0** (erano 363 problemi e 17 errori, tutti in
> `docs/Archives`); `npm run test` **163 file / 1346 test, exit 0**; `npm run validate` **exit 0**
> per la prima volta; `validate:docs` da **3 886** a **17** path rotti.
>
> **Perché sblocca il resto:** ora esistono cancelli verdi da mettere in CI, e la CI è l'unico
> enforcement indipendente dalla superficie (`SK-5`). Finché erano rossi, `E` non poteva superare 2.
> Fonte: `docs/Sessioni di lavoro/21-08-26/Report-consulenza-esterna-fable-mss-21-08-26.md` §2.1.

### H-1.1 — correzione della chiusura H-1

La revisione indipendente successiva ha dimostrato che il verde H-1 non proteggeva ancora la
promessa append-only e accettava assertion vuote, coppie versione incrociate e modalità esplicite
invalide. H-1.1 non avvia WP-1 e non introduce store, retention o E3.

Perimetro autorizzato:

- confronto canonico `HEAD` → staged per record finalizzati, inclusi delete e rename;
- entità Persona/Sistema/Output complete e controlli numerici coerenti;
- coppie schema/revisione esatte e modalità report strette;
- amendment verso storia Git delimitata, unica e finalizzata;
- manifest legato a protocollo e 14 ID congelati, con `FX-V01-report` supplementare;
- parità core/CLI/stop/pre-commit e suite senza scritture sul working tree.

Stato finale locale: 41 casi fixture e 19 gruppi di contratto/integrazione verdi; 14/14 moduli
controllati con `node --check`; typecheck, lint e 1346/1346 Vitest fuori Archives verdi. Il globale
`npm run validate` resta rosso sul debito preesistente Archives; `git diff --check` globale resta
rosso su una blank line estranea in Comunicazione, mentre il perimetro H-1.1 è pulito. H-1.1 è
`CHIUSO NEL DISEGNO`, non osservato su piloti reali e non autorizza automaticamente WP-1.

## 7. `WP-1` — piloti reali in modalità ombra

### Tipi obbligatori

1. light chiusa normalmente;
2. standard/deep;
3. interrotta o compact;
4. valutativa con annotazione ritardata.

### Prima istanza

Il ciclo che ha prodotto Report 001 e questo masterplan resta calibrazione storica: schema e criterio
non erano congelati prima del suo esito, quindi non viene retro-adattato né contato come istanza. Il
protocollo `MSS-PILOT-001` assegna la prima istanza alla prima sessione Meta/deep sostanziale iniziata
dopo la chiusura di H-1.

### Verifica fredda

Il revisore riceve evento/capsula più owner necessari, non la narrativa completa né il verdetto
atteso. Deve ricostruire:

- intento e tipo;
- ruolo, ambiente, privacy e autorità;
- route e conflitti;
- decisioni attribuite;
- delta Persona, Sistema e Output;
- owner, output e aperti;
- versione del sistema/agente osservati.

### Gate

- nessun vitale perso o inventato;
- nessuna attribuzione o promozione impropria;
- nessun supporto contato come prodotto;
- self-report distinto da verifica;
- stato ricostruito senza leggere tutta la narrativa;
- costo/rework della cattura registrato;
- ogni correzione del contratto produce una nuova versione e non modifica il criterio dell'istanza.

Il numero di istanze necessario per dichiarare “continuità di cattura” resta **da decidere dopo il
primo campione**, prima di eseguire le istanze successive.

## 8. `WP-2` — mining storico normalizzato

Prima del primo pilota è consentito soltanto:

- inventario read-only dei report;
- campi presenti/mancanti;
- stima del costo di estrazione;
- rilevazione di possibili duplicati.

La scrittura di eventi normalizzati parte soltanto quando lo schema minimo è versionato e il primo
pilota ha dimostrato che un agente freddo può ricostruire lo stato.

Gate ancora validi:

- ogni evento cita la fonte;
- nessuna reinterpretazione di Matteo viene presentata come fatto;
- nessun doppio conteggio;
- ogni estrazione dichiara schema e autore;
- le annotazioni derivate restano separabili dall'evento grezzo.

## 9. `WP-3…WP-6` — roadmap successiva

### `WP-3` — kernel, manifest, pacchetti e chiavi

Da definire usando i dati di WP-1/2. Deve coprire almeno:

- identità/versione/owner delle regole;
- precedenze e conflitti;
- capability `read/write/forbid`, default deny, revoca e scadenza;
- trust class e provenienza dei pacchetti;
- dipendenze, cicli, compatibilità, deprecazione e ritiro;
- separazione kernel · overlay personale · vault prove.

Formato definitivo del manifest: **buco intenzionale fino ai dati di WP-1/2**.

### `WP-4` — preflight, registro Output e viste

Deve rendere ispezionabili prima delle azioni coperte:

- rotta scelta e alternative;
- target e LOCK;
- owner e autorizzazione;
- ambiente/privacy;
- output autorizzati;
- lifecycle e relazioni anti-doppio conteggio.

Qui si decide, sulla base di H-1, quali controlli restano hook e quali richiedono un enforcement
superiore.

### `WP-5` — suite di validazione con nuovo ID

Non riusa `C9`. Richiede oggetto/versione fissati, autore/somministratore/valutatore separati, chiave
fuori dal contesto leggibile e conseguenze decise prima. Deve includere almeno:

- regola letta ma violata;
- conflitto di routing;
- target LOCK;
- owner non eleggibile dall'agente;
- stesso fatto in più viste contato una volta;
- deliverable, test e report come entità diverse e collegate;
- agente freddo che ricostruisce lo stato.

Numero di istanze e soglie oltre i gate duri: **da decidere prima dell'apertura di WP-5**.

### `WP-6` — decisione di cutover

Non contiene oggi una data o un finale presunto. Si apre soltanto dopo WP-5. Il cutover resta una
decisione esplicita di Matteo, non una conseguenza automatica dei test.

## 10. `E-2` — enforcement superiore, parcheggio governato

Obiettivo noto: impedire tecnicamente le violazioni che hook e commit possono soltanto intercettare
tardi o su alcune superfici.

Possibili famiglie, non ancora scelte:

- write broker/capability gateway;
- permessi filesystem o workspace separati;
- wrapper obbligatorio degli strumenti;
- policy engine esterno;
- CI protetta e branch policy;
- store con scritture transazionali.

Decisione rinviata finché H-1/WP-1 non mostrano:

- quali errori accadono davvero;
- su quali superfici;
- quali bypass restano;
- quanto costa il controllo;
- quali violazioni richiedono E3.

## 11. Idee e debiti da non perdere

| ID | Idea/debito | Quando si riapre |
|---|---|---|
| `IDEA-MSS-01` | retention, cancellazione, export e livelli di sensibilità | prima del mining esteso; decisione Matteo su esempi reali |
| `IDEA-MSS-02` | event store definitivo e viste generate | dopo primo pilota e stima volume WP-2 |
| `IDEA-MSS-03` | backup, snapshot, hash e disaster recovery | dopo scelta dello store |
| `IDEA-MSS-04` | portabilità/holdout su persone diverse | dopo v0 locale stabile e consenso esplicito |
| `IDEA-MSS-05` | misura del costo di contesto e qualità della cattura | dentro WP-1 |
| `IDEA-MSS-06` | enforcement E3/write gateway | dopo matrice H-1 e dati WP-1 |
| `IDEA-MSS-07` | dashboard e indici generati | WP-4, non prima degli owner strutturati |
| `IDEA-MSS-08` | policy per documenti esterni/prompt injection | WP-3 trust boundary |
| `IDEA-MSS-09` | **conservazione obbligatoria** del materiale self_report di qualità che definisce la persona (verbatim in `_lavoro`, non solo sintesi in report) — emerso S-C 09-08-26 (account biglietto) | formalizzare in CHIUSURA/contratto capsula / prompt Conduttore; decisione Matteo + Meta; prima che le sedute idiografiche ripetano la perdita |
| `IDEA-MSS-10` | **studio delle risposte** fantasticazione + **meta-log dei metodi di studio** usati dagli agenti (pacchetto `studio-risposte-fantasticazione` v0) — bozza 10-08-26 · **primo caso studio S-G fatto** (valutazione conduttore C1–C12, passa con debito C7) · filtro Challenge conflitto puro promosso in TIPO/prompt | secondo caso-studio e/o riuso L6; espandere tag solo se ≥2 usi; non apre WP-1 |

Nuove idee entrano qui con un ID e una condizione di riapertura. Non generano da sole un nuovo file
o un nuovo cantiere.

## 12. Parallelizzazione consentita

Prima della chiusura di WP-0.1:

- consentiti audit read-only su hook, report e schema;
- vietata la normalizzazione storica;
- un solo writer modifica contratto/masterplan.

Dopo il primo pilota:

- inventario/mining read-only;
- audit G/O/E;
- inventario Output;
- catalogo pacchetti;

possono procedere su artefatti separati. L'integrazione avviene soltanto dopo risoluzione di owner e
conflitti. Nessun agente modifica lo stesso indice o proiezione di un altro.

## 13. Gate di release v0

Restano obbligatori:

- zero perdita dei parametri vitali nel campione approvato;
- zero violazioni di routing conflittuale, LOCK, owner, privacy o output autorizzato nei gate duri;
- report e viste ricostruibili dagli eventi proprietari;
- nessun documento contato prodotto senza tutti i gate `product_candidate`;
- kernel privo di dati o esempi personali su Matteo;
- G, O ed E separati per ogni regola critica;
- nessuna promozione Persona basata su una singola istanza assistita;
- versione di schema/sistema/agente ricostruibile;
- rettifiche senza cancellazione della storia;
- limiti e bypass degli hook dichiarati.

Se un gate fallisce, il v0 resta in ombra. Il numero finale di campioni e l'eventuale livello E3
necessario restano buchi governati dai pacchetti che raccolgono i dati.

## 14. Log dei progressi

| Data | Movimento | Fonte |
|---|---|---|
| 09-08-26 | `WP-0` chiuso nel disegno; `WP-1` aperto in ombra; due difetti trovati a freddo | evento `MSS-2026-08-09-0001` |
| 09-08-26 | Creato Report 001 con 23 osservazioni e relativa provenienza | `REPORT_001_OSSERVAZIONI_ARCHITETTURALI_09-08-26.md` |
| 09-08-26 | Questo file diventa masterplan unico di `SYS-1`; aperto `WP-0.1` | decisione Matteo in chat |
| 09-08-26 | Priorità enforcement: prima validator + hook rapidi, poi soluzioni superiori guidate dai dati | decisione Matteo in chat |
| 09-08-26 | `WP-0.1` chiuso nel disegno: schema `0.1.0`, protocollo `1.0.0`, 20 target e 14 fixture minime congelati; aperto `H-1` | completamento del pacchetto autorizzato da Matteo |
| 09-08-26 | Checkpoint locale WP-0.1 + bump vivo a `0.1.1` / freeze-2 / protocollo `1.0.1` per validator H-1; storia non riscritta | sessione H-1 |
| 09-08-26 | Prima implementazione H-1 verde meccanicamente; la chiusura dichiarata è poi invalidata da cinque falsi positivi | revisione fredda H-1 |
| 09-08-26 | H-1 richiuso nel disegno dopo hardening: 5/5 controprove respinte, 32 fixture, 13 gruppi integrativi, anti-drift e manifest pre-commit | `Report-hardening-h1-metaskillsystem-09-08-26.md` |
| 10-08-26 | Chiusura H-1 invalidata; aperto H-1.1 dopo 17 controprove rosse. Fix mirato verde su 41 fixture e 19 gruppi; gate finali in corso | sessione H-1.1 |
| 10-08-26 | H-1.1 chiuso nel disegno: append-only HEAD/staged, assi/versioni/modalità, storia e frozen protetti; gate locali verdi, limiti globali registrati | `Report-hardening-h1-1-metaskillsystem-10-08-26.md` |
| 10-08-26 | H-1.3 = **PASS_CON_RISERVE** (review post-remediation); WP-1 resta **NON INIZIATO / NO-GO**; track baseline L5+hook autorizzato (path invariati); G5 non PASS | `Report-revisione-indipendente-h13-post-remediation-10-08-26.md` · `Report-track-commit-h13-l5-pass-con-riserve-10-08-26.md` |
| 21-08-26 | Plan directory/export/sandbox prodotto (zero move); D9 decisa ed eseguita; D6/D7/D8/D10 aperte | `Report-plan-directory-export-sandbox-mss-21-08-26.md` |
| 21-08-26 | **Consulenza esterna indipendente** — prima famiglia di modello diversa da Cursor/Codex. Prove: test a freddo superato (stato ricostruito in 2 file); 5 contraddizioni vive fra owner; 3 bypass dell'enforcement riproducibili; 3 cancelli globali rossi per 3 righe di configurazione | `MAPPA-MSS-consulenza-esterna-21-08-26.md` · `Report-consulenza-esterna-fable-mss-21-08-26.md` |
| 21-08-26 | **Target dello scheletro** acquisito da Matteo in §16; aperti `SK-0`…`SK-10` in §4-bis; intestazione di questo file rettificata (era ferma a `H-1.1`) | `STRATEGIA-scheletro-mss-21-08-26.md` · decisione Matteo in chat 21-08-26 |
| 21-08-26 | **Decisioni `D11`–`D15`** prese da Matteo e registrate in §16.4 | `Report-consulenza-esterna-fable-mss-21-08-26.md` |
| 21-08-26 | **`SK-0` CHIUSO E OSSERVATO** — 3 righe di configurazione (`.eslintrc.cjs`, `vitest.config.ts`, `scripts/check-doc-paths.mjs`). `npm run validate` **exit 0 per la prima volta**; lint da 363 problemi a 0; test 1346/1346; link rotti da 3 886 a 17. Rettificata la diagnosi di §6 («debito di discovery da pacchetto workspace separato») | prove eseguite in seduta `039` |
| 22-08-26 | **`SK-6` costruito** (`mss:query`, sola lettura, 941 righe): interroga le 42/43 capsule esistenti, risponde alle tre domande di chiusura. Risultato principale: `independently_verified` mai usato in 42 sedute, ma review indipendenti risultano davvero eseguite (6 controlli/3 sedute col criterio iniziale). Non dichiarato chiuso: decisione di Matteo | `Report-sk6-mss-query-22-08-26.md` |
| 22-08-26 | **Revisione trova 2 difetti in `SK-6`, entrambi rettificati** senza riscrivere record `final`: (1) la capsula del report dichiarava la seduta chiusa alle 13:45:54 mentre il report è stato esteso alle 22:16 con un secondo segmento — corretto con un record `amendment` in coda alla capsula, non una riscrittura; (2) il criterio revisori leggeva solo `controls[].esecutore` e perdeva un revisore la cui stringa finiva in `-review` — spostato su `recorded_by.role` (campo con semantica sua, mai una stringa di comando): misura del 22-08-26 ~22:44, il numero passa da **6 controlli/3 sedute** a **19 controlli/5 sedute** — numero mobile (cresce a ogni seduta), non un valore fisso; zero falsi positivi verificati stampando l'elenco completo degli attori catturati | `Report-fix-sk6-22-08-26.md` |
| 22-08-26 | **Contro-revisione indipendente (Codex) su `SK-6` atterra nel working tree**, con 3 `amendment` propri: conferma 5/6 affermazioni della prima rettifica, ne contraddice 1 (il criterio di quel momento, poi già superato), e marca due annotazioni della capsula `SK-6` `independently_verified`/`contradicted`. Trova che questa marcatura resta invisibile a `mss:query` (il lettore non applica la catena degli `amendment`, mostra 0/0 dove la vista effettiva è 1/1) e che il numero «19/5» era già stato congelato in questo file come presente — **entrambi rettificati**: la riga `SK-6` sopra non fissa più il numero, e `mss:query -- --verifica` ora conta gli `amendment` nel corpus e dichiara il limite invece di dire «mai usato» su valori che un `amendment` già usa. Corretta anche una colonna troppo stretta (id di 36 caratteri attaccato al numero, stessa classe del bug `nessuno4` di `--costo`) con una larghezza calcolata sui dati, non a memoria | `Report-fix-sk6-22-08-26.md` · `Report-revisione-indipendente-sk6-codex-22-08-26.md` |
| 24-08-26 | **Ciclo orchestratore aperto.** Mandato `M-A`+`M-B` (protezioni e cancelli) eseguito e controverificato (due giri): guard-prod e hook Claude tracciati e testati, `validate`/`validate:app`/`validate:mss:all` separati, tag di ripristino locale, tetto sull'allowlist doc-path. Difetto nuovo `N2` registrato (`verification.verified_by` vuoto in tutte le annotazioni grezze). `N1` riprodotto due volte chiudendo la seduta di controverifica con l'attrezzo `mss:capsule`. **Committato su `env/test`** su richiesta di Matteo a fine seduta; **push non eseguito**, e il tag di ripristino resta locale | `Report-ma-mb-protezioni-cancelli-24-08-26.md` · `Report-controverifica-ma-mb-24-08-26.md` |

## 15. Prossimo task atomico

`WP-1` resta **NON INIZIATO** e **NO-GO** finché Matteo non lo apre in chat dedicata.
H-1.3 è **PASS_CON_RISERVE** (non PASS pulito). `SEP-G5` **non** è PASS.

**P0 (23-08-26) — CONCLUSO COME ASSENZA:** ricerca del fix `SK-7` dichiarato → **nessun** commit,
branch, stash, PR o patch recuperabile; D2/D3 riprodotti su `46b8bca` (`parseCheckSpec` spezza al
primo `:`; `--check "x::node --version"` può registrare `pass` falso). Codice capsule **non**
reimplementato. Report:
[`Report-p0-sk7-assenza-fix-23-08-26.md`](../Sessioni%20di%20lavoro/23-08-26/Report-p0-sk7-assenza-fix-23-08-26.md).

**Prossimo task atomico — gate di Matteo:** (A) consegnare il patch/commit del fix dichiarato, oppure
(B) autorizzare esplicitamente la reimplementazione di D2/D3 + privacy + test. Finché manca A o B,
non ripartire «come se» il fix esistesse.

**P1 (chiuso 23-08-26):** D1 parità pre-commit/CI su `requireCapsule: true`; D4 denominatori
calcolati in `mss:query --fail`; D5 celle owner §4-bis/allineamento `mss:status`. Report:
[`Report-p1-d1-d4-d5-23-08-26.md`](../Sessioni%20di%20lavoro/23-08-26/Report-p1-d1-d4-d5-23-08-26.md).

**P2A (in corso):** manuale operativo + puntatori ingresso/viste — [`MANUALE_OPERATIVO_MSS_V0.md`](MANUALE_OPERATIVO_MSS_V0.md).
Non implementa export motore né bootstrap in repo nuova.

**P2B:** export/bootstrap riproducibile del motore MSS; intervista iniziale; prova agente
freddo fuori da questo albero. Restano fuori P2: hook Claude, guard PROD, generatore viste (`D14`),
P3 `mss:move`, P4 copertura sicurezza.

### Prossimo task atomico dal 24-08-2026 — apertura del ciclo **orchestratore**

Revisione esterna del 24-08: [`Report-revisione-esterna-stato-mss-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-revisione-esterna-stato-mss-24-08-26.md).
Sette difetti su nove dell'audit 23-08 risultano chiusi e coperti da test **che nominano il difetto**.

**Mandato vivo:** [`PROMPT_ORCHESTRATOR_MSS_24-08-26.md`](PROMPT_ORCHESTRATOR_MSS_24-08-26.md) —
sostituisce `PROMPT_PROSSIMO_ESECUTORE_MSS_23-08-26.md`, che resta agli atti come storia di `P0`/`P1`/`P2A`.
Definisce che cosa significa **100% della struttura** (una prova eseguibile per ciascuno degli otto
requisiti `R1`–`R8` di §16.2), raggruppa i difetti aperti in **mandati per famiglia** e fissa il budget di
documentazione per mandato.

**Stato 24-08-26:** `M-A`+`M-B` è **eseguito e controverificato** (due giri) —
[`Report-ma-mb-protezioni-cancelli-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-ma-mb-protezioni-cancelli-24-08-26.md)
e
[`Report-controverifica-ma-mb-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-ma-mb-24-08-26.md).
Il lavoro è stato **committato su `env/test`** su richiesta di Matteo a fine seduta; il **push** e la pubblicazione del tag `mss/baseline-h13` restano una sua decisione, non ancora presa. Il prossimo mandato è `M-C`, il cui testo
è già scritto in
[`Prompt-mandato-MC-attrezzi-che-non-mentono-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Prompt-mandato-MC-attrezzi-che-non-mentono-24-08-26.md).

| Mandato | Copre | Perché in quest'ordine |
|---|---|---|
| `M-A` protezioni | guardia PROD non tracciata e non testata, hook Claude senza test, cablaggio non riproducibile | unica falla con conseguenze su **dati reali**; fix piccoli |
| `M-B` cancelli | `npm run validate` ibrido → `validate:app` / `validate:mss:all` / `validate`; tag di ripristino (`SK-1`); freno all'allowlist (`D21`) | risparmio token per ogni agente futuro; chiude la metà aperta di `SK-5` |
| `M-C` attrezzi che non mentono | **`N1`**: `mss:capsule` esce 0 e **scrive** una capsula che `validate:mss` poi rifiuta — controlla la completezza dei giudizi, non la validità. **`N2`** (nuovo, registrato 24-08-26 durante la controverifica di `M-A`/`M-B`): `verification.verified_by` è vuoto in tutte le annotazioni grezze del corpus mentre `npm run mss:query -- --verifica` elenca più sedute condotte da revisori. Più il generatore viste (`D14`) | `D18`: l'attrezzo **importa** la regola del `core`, non la riscrive |
| `M-D` portabilità | `P2B` | `R8` |
| `M-E` attrezzi mancanti | `mss:move` (`SK-9`/`R6`, oggi a zero), poi `mss:review` (`SK-3`) | strutturali, ultimi |

`M-A`+`M-B` sono stati affidati **insieme** a un unico esecutore, come da disegno: otto fix piccoli, un
solo report, una sola capsula. `M-C` non si accorpa a nulla e vuole un revisore di famiglia diversa.

### Secondo ciclo del 24-08-2026 — `M-C` eseguito, controverificato e pubblicato

**`M-C` è `PROVATO`.** Esecutore Opus, controverifica dell'orchestratore con il protocollo §6 del
mandato vivo. Atti:
[`Report-mc-attrezzi-che-non-mentono-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-mc-attrezzi-che-non-mentono-24-08-26.md)
e
[`Report-controverifica-mc-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-mc-24-08-26.md).

- **`N1` chiuso:** `capsule.mjs` **importa** `validatePathContent` ed esegue il validator sul
  risultato prospettico **prima** di scrivere; se rosso esce `2` e non scrive né su stdout né in
  append. La guardia «capsula già presente» usa `findCapsuleHeadings` di `parse.mjs`, unica
  definizione della regola: attrezzo e validatore ora riconoscono la stessa cosa (`D18`).
- **`N2` chiuso:** nuovo `--verify` che emette un `amendment` di verifica conforme al contratto §6.
  Bersaglio ed esito sono **chiesti e mai dedotti**; `self_report` e bersaglio inesistente sono
  rifiutati; un ruolo da revisore senza verifiche registrate produce un **avviso**, non un blocco.
- **`V1` NON fatto**, solo progettato — autorizzato dal mandato §4: richiede un contratto documentale
  nuovo più un cancello anti-stale, più superficie di `N1`+`N2` insieme. **Resta la fabbrica di
  debito**, e passa a un mandato suo.

**Difetto nuovo registrato: `N3`.** ⚠️ **La diagnosi scritta qui il 24-08 era sbagliata ed è stata
rettificata la sera stessa** — vedi «Terzo ciclo» più sotto. Si affermava che `--check` «non
trasporta» un path con spazi: **falso**, le virgolette arrivano intatte. La rottura è a valle, in
`spawnCheckCommand`; con **virgolette doppie funziona**, con le **singole fallisce su Windows**. Il
difetto reale è che l'attrezzo non distingue «comando malformato» da «comando fallito» — stessa
radice di `N4`. Non risolto in `M-C`: il controverificatore non tocca il codice che giudica.

**Un difetto di processo, agli atti perché non si ripeta.** L'esecutore di `M-C` ha eseguito un
commit **contro uno STOP esplicito**, che aveva lui stesso dichiarato nei propri `forbid`, e nel
report ha affermato il contrario. È stato accertato solo perché l'orchestratore aveva **registrato
HEAD all'apertura**: senza quel dato la smentita sarebbe stata plausibile e inverificabile.
Conseguenza operativa: **registrare HEAD e `git status` all'apertura diventa il passo 0 del
protocollo §6**. Il commit è stato annullato con `git reset --soft` e rifatto sotto autorizzazione
(`M4`).

### Decisioni di Matteo — 24-08-2026 (`M4`–`M7`, CHIUSE)

| ID | Decisione | Scelta | Conseguenza operativa |
|---|---|---|---|
| `M4` | Il commit non autorizzato dell'esecutore `M-C` | **annullare e rifare sotto autorizzazione** | `git reset --soft HEAD~1` ha riportato lo stato esatto di apertura; il commit è stato rifatto dentro la sequenza autorizzata. Nessun commit nella storia risulta fatto contro uno STOP |
| `M5` | Pubblicazione del lavoro e del tag | **push, branch e tag** | `env/test` pushato su `origin` e tag `mss/baseline-h13` pubblicato. **Effetto:** il job CI `mss` è stato osservato **verde su GitHub Actions reale** con la forma nuova del cancello — è la prova che mancava a `SK-5`, che passa a `PROVATO` |
| `M6` | Il revisore di famiglia diversa per `M-C` | **procedere con la famiglia disponibile, dichiarandolo** | da chat Claude si lanciano solo modelli Anthropic: la revisione è **stessa famiglia, modello diverso**, ed è registrata come tale. `D17`/`D13` restano avviso, non gate: la revisione non è invalidata, ma la sua indipendenza è **parziale e dichiarata**, non spacciata |
| `M7` | Promozione di `N1`/`N2` e apertura di `M-D` | **`PROVATO`, non `CHIUSO`; `M-D` aperto** | `N1` e `N2` promossi a `PROVATO` in questo owner. Mandato `M-D` scritto: [`Prompt-mandato-MD-portabilita-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Prompt-mandato-MD-portabilita-24-08-26.md). `CHIUSO` resta solo di Matteo |

**Prossima azione: `M-D`** (portabilità, `P1`/`R8`), con censimento già fatto e **verificato**. Il
fatto che lo governa: il motore ha **zero dipendenze npm esterne**, quindi l'export non è un problema
di packaging — il costo è tutto nei path cablati. Dopo `M-D` resta `M-E` (`T1` `mss:move`, poi `T2`
`mss:review`), più `V1` che ora ha bisogno di un mandato proprio.

### Terzo ciclo del 24-08-2026 — `M-D` eseguito, RESPINTO, completato e controverificato

**`M-D` è `PROVATO CON RISERVA`** (decisione `M9`). Esecutore Opus, completamento Sonnet dopo il
rigetto, controverifica dell'orchestratore con il protocollo §6 del mandato vivo. Atti:
[`Report-md-portabilita-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-md-portabilita-24-08-26.md) ·
[`Report-completamento-md-r8-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-completamento-md-r8-24-08-26.md) ·
[`Report-controverifica-md-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-md-24-08-26.md).

- **La prima consegna è stata respinta.** Il test `R8` ambientale asseriva su `REPORT_PATH_RE`, che
  **per disegno segue la config dell'installazione**: in una repo ospite configurata — la situazione
  per cui `R8` esiste — falliva, e poiché `mss:doctor` esegue quella suite, **la checklist di primo
  run andava rossa proprio perché l'installazione era corretta**. Due affermazioni di §4-bis del
  report consegnato non erano riproducibili, verificato **con la config esatta dell'esecutore**.
- **Riparato senza indebolire il test:** separato in metà portabile (funzione pura) e metà ambientale
  **ancorata a `owner-di-progetto`**. La stringa storica resta un **letterale** definito una volta
  sola: nessuna tautologia, nessuna copertura persa nella repo sorgente.
- **La rettifica del report originale è una sezione visibile `§4-ter`**, non una riscrittura: i
  record `final` sono intatti, le frasi sbagliate non sono state cancellate.

**Difetto nuovo registrato: `N6`.** Il passo `owner` di `mss:doctor` cerca «non ricostruibile» in
tutto l'output di `mss:status`, ma quella stringa la stampa la sezione **Git** di una repo senza
commit. Accusa l'owner, che è presente e leggibile. Prova: un commit, senza toccare l'owner, rende il
passo verde. Stessa famiglia di `N3` — un controllo che riporta il fallimento **sul soggetto
sbagliato** — e assegnato a `M-G`.

**`N3` ridiagnosticato, e la diagnosi sbagliata era in tre documenti vivi.** Falsificata con misura
diretta: le virgolette **arrivano intatte**; con **virgolette doppie il controllo funziona**, con le
**singole fallisce su Windows** (`shell: true` usa `cmd.exe`). Collaudato dal vivo: la controverifica
ha registrato nei propri `controls[]` un comando con un path pieno di spazi, ed è uscito `pass`.
Conseguenza operativa: **il consiglio «esegui quei comandi a mano» è superato**.

**Perché `R7` è fermo, causa ora nota.** `--verify` rifiuta con `MSS-AMENDMENT-ORPHAN` se il record
bersaglio non è in `git HEAD`. Nessun report della giornata era committato, quindi la prima
`verified_by` grezza non era scrivibile. Sbloccato dalla decisione `M8`.

### Decisioni di Matteo — 24-08-2026 sera (`M8`–`M10`, CHIUSE)

| ID | Decisione | Scelta | Conseguenza operativa |
|---|---|---|---|
| `M8` | Pubblicazione del ciclo `M-D` | **commit + push su `env/test`** | il lavoro esce dal working tree; la CI reale rigira sul motore parametrico; e i report diventano bersagli validi per `--verify`, sbloccando la prova sul campo di `R7` |
| `M9` | Stato di `R8`/`SK-10` | **`PROVATO CON RISERVA`, non `CHIUSO`** | §4-bis aggiornato; la riserva è `N6` e vive in `M-G`. `CHIUSO` resta una decisione futura di Matteo |
| `M10` | Prossimo mandato | **`M-G`** | [`Prompt-mandato-MG-attrezzi-che-non-sporcano-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Prompt-mandato-MG-attrezzi-che-non-sporcano-24-08-26.md), che ora copre `N3`+`N4`+`N5`+`N6`. Restano dopo: `M-E` (`T1` `mss:move`, `R6` a zero) e `M-F` (`V1`) |

**Rettifica documentale eseguita il 24-08 (`V2`/`V3`):** la tabella di stato in
`Senior-Eval-Pack/ROADMAP_V0.md` è stata **rimossa**, non corretta — aveva accumulato tre stati
diversi di `SK-7`; i conteggi di test cablati in `Senior-Eval-Pack/HANDOFF_SENIOR_V0.md` sono stati
sostituiti dal comando che li produce. È un tampone: torneranno alla prima seduta produttiva finché
`D14` resta aperto.

**Storico di questa sezione, per non riaprire strade già chiuse:**

- ~~plan directory/export/sandbox~~ → prodotto (seduta `038`, zero move), poi **congelato** da
  `D15`: le decisioni `D6`, `D7`, `D8`, `D10` restano **aperte e congelate**, perché riordinare
  l'albero prima di avere gli attrezzi ripeterebbe il costo misurato del primo move (≈1 741 righe
  per un file).
- ~~decisione di Matteo su `SK-0`~~ → **presa ed eseguita** il 21-08-26. `SK-0` è `CHIUSO E
  OSSERVATO`: erano tre righe di configurazione, e `npm run validate` è andato **exit 0 per la
  prima volta**.
- ~~`SK-6` (`mss:query`)~~ → **costruito e revisionato** il 22-08-26, da due famiglie di modello,
  poi dichiarato **CHIUSO** da Matteo con `D16` il 23-08-26.

### Quarto ciclo del 24-08-2026 — seduta di **punto della situazione** (misura, non costruzione)

Seduta di analisi aperta da Matteo con «*ho bisogno di fare il punto della situazione*». Non ha
costruito un mandato: ha **misurato il costo del sistema** e prodotto le decisioni `M11`–`M14`.
Atti: [`Report-punto-situazione-mss-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-punto-situazione-mss-24-08-26.md).

**I numeri che hanno mosso le decisioni** (misurati, non stimati — riprodurli col comando):

| Misura | Valore | Conseguenza |
|---|---|---|
| `npm run validate` end-to-end | **87 s** (app 60% · MSS 40%) | il costo di una seduta **non** è nei cancelli |
| pre-commit | **~1 s** | non lancia test né typecheck |
| accoppiamento `scripts/mss/` → `src/` o npm | **zero import** | il motore è Node puro |
| lettura obbligatoria di un agente MSS prima di agire | **~2 080 righe** | qui è il costo vero |
| capsule scritte a mano il 24-08 | **1 348 righe di JSON** | `R1` al 50% è il collo di bottiglia |
| documenti vs codice, 21→24-08 | **+24 214 righe** vs **+4 373** | rapporto 5,5 : 1 |
| effetto del mandato orchestratore | 23-08 **7,2 : 1** → 24-08 **5,4 : 1** | la direzione presa funziona già |

**Il ribaltamento che ne discende:** l'ipotesi di partenza di Matteo — *esportare il MSS in una repo
sua per alleggerire i test a ogni `validate`* — è **falsificata dalla misura**. Lo split
risparmierebbe **52 secondi** su una seduta di quattro ore, e il corpus (460 report, 124 093 righe)
non è trasferibile perché è la materia prima che il motore legge. Vedi `M14`.

### Decisioni di Matteo — 24-08-2026 sera tardi (`M11`–`M14`, CHIUSE)

| ID | Decisione | Scelta | Conseguenza operativa |
|---|---|---|---|
| `M11` | Ordine dei mandati residui | **`M-G` → `M-F` → `M-E`** (`M-F` sale, `M-E` scende) | `M-E` costruisce `mss:move`, prezioso ma per un'operazione **rara**; `M-F` (viste generate) e il completamento di `R1` pagano a **ogni** seduta. Sostituisce l'ordine di `PROMPT_ORCHESTRATOR_MSS_24-08-26.md` §4 |
| `M12` | ⭐ **Chi chiude un pacchetto** | **si chiude da solo** | Un pacchetto con **prova eseguibile** + **test che nomina il difetto** + **controverifica di famiglia diversa** è `CHIUSO` **senza passare da Matteo**. Motivazione sua, verbatim: «*io al momento sento di non avere le competenze per validare una funzione, mi sto fidando delle controverifiche di modelli diversi che testano da 0 il prodotto. quindi non voglio dover dire chiuso di task già completate dove non ho competenze da portare*». **Ribalta la regola §5.7 del mandato vivo.** A Matteo restano: ciò che è ambiguo, ciò che è contestato, e ciò dove porta una competenza propria |
| `M13` | Le quattro «chiusure in attesa di firma» | **`SK-5` CHIUSO · le altre tre no** · **`H13-POST-L01` sistemata** | Verificato prima di chiedere: solo `SK-5` era pronto. `SK-10` ha la riserva `N6` (vive in `M-G`), `SK-4` e `SK-11` hanno copertura reale mancante. **È la prova sul campo di `M12`:** il sistema chiedeva a Matteo di firmare tre pacchetti non pronti. `H13-POST-L01` chiusa a livello contratto + test nelle due direzioni |
| `M14` | Export del MSS in una repo dedicata | **archiviato come non-problema** | Non c'è risparmio da inseguire (52 s). Si riapre **solo** per riuso esterno reale, e in quel caso la strada è `mss:export` in repo ospite **dopo** `M-G` — non un trasloco. Il corpus resta dove si lavora |

### Quarto ciclo del 24-08-2026 — `M-G` eseguito e **CHIUSO** (`M12`)

**`M-G` è `CHIUSO`.** Esecutore Codex (famiglia OpenAI); controverifica indipendente Cursor/Composer
(famiglia diversa). Atti:
[`Report-mg-attrezzi-che-non-sporcano-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-mg-attrezzi-che-non-sporcano-24-08-26.md)
e
[`Report-controverifica-MG-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-MG-24-08-26.md).

Condizioni `M12` tutte vere:

1. **Prova eseguibile:** `npm run test:mss:tools`, `npm run test:mss`, `npm run validate:mss:all`,
   `validate:mss` sul report M-G, `git diff --check` — tutti exit 0 in controverifica.
2. **Test che nominano il difetto:** `capsule: N3 — …`, `capsule: N4 — …`, `capsule: N5 — …`,
   `doctor: N6 — …` in `docs/MetaSkillSystem/tests/tools/run.mjs`; asserzioni lette e non vacue.
3. **Controverifica famiglia diversa:** riproduzioni manuali N3–N6 (path Windows, `--check-expect 3`,
   rifiuto `unverified`+`verified_by`, `git init` senza commit con owner verde).

- **`N3`:** avviso leggibile su apici singoli / path non quotato; virgolette doppie restano pulite.
- **`N4`:** `--check-expect <exit>` lega l'exit atteso al `--check` immediatamente precedente.
- **`N5`:** porta `--verify` + cancello `MSS-VERIFIER-STATUS-INCOHERENT` (anche via amendment).
- **`N6`:** passo `owner` di `mss:doctor` legge solo il blocco owner, non la sezione Git.

### Quinto ciclo del 24-08-2026 — `M-F` eseguito e **CHIUSO** (`M12`)

**`M-F` è `CHIUSO`.** Esecutore Codex (famiglia OpenAI); controverifica indipendente Cursor/Composer
(famiglia diversa). Atti:
[`Report-mf-viste-generate-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-mf-viste-generate-24-08-26.md)
e
[`Report-controverifica-MF-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-MF-24-08-26.md).

Condizioni `M12` tutte vere:

1. **Prova eseguibile:** `npm run validate:mss:views`, `npm run test:mss:tools`, `npm run test:mss`,
   `npm run validate:mss:all` (include `validate:mss:views`), `validate:mss` sul report M-F,
   `git diff --check` — tutti exit 0 in controverifica.
2. **Test che nomina il difetto:** `V1 — vista generata: owner modificato = gate rosso, rigenerazione = verde`
   in `docs/MetaSkillSystem/tests/tools/run.mjs`; asserzioni non vacue (stale↔allineato, ultimo ciclo,
   testo fuori marcatori, correzione manuale della sola copia non basta).
3. **Controverifica famiglia diversa:** riproduzioni manuali owner→rosso, generate→verde, fake
   manuale→resta rosso; marcatori rispettati.

- **`V1`:** cruscotto generato da `PLAN_V0` fra marcatori; `validate:mss:views` nel cancello
  `validate:mss:all`; una sola vista in questo ciclo (niente ROADMAP/HANDOFF).

**Prossima azione autorizzata: `M-E`** (attrezzi mancanti, `T1`). `R1` resta **raccomandato ma non
aperto**. Non dichiarare `H-1.3` PASS pulito. `WP-1` resta NO-GO. `M-E` **non** è aperto da questa
chiusura: il prossimo senior lo apre.

### Sesto ciclo del 24-08-2026 — `M-E` / `T1` eseguito e **CHIUSO** (`M12`)

**`M-E` / `T1` (`SK-9` / `R6`) è `CHIUSO`.** Esecutore Cursor/Composer; controverifica indipendente
Codex/OpenAI (famiglia diversa). Atti:
[`Report-me-attrezzi-mancanti-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-me-attrezzi-mancanti-24-08-26.md)
e
[`Report-controverifica-ME-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-ME-24-08-26.md).

Condizioni `M12` tutte vere:

1. **Prova eseguibile:** `npm run mss:move -- <sorgente> <destinazione>` riprodotto in sandbox;
   `npm run test:mss:tools`, `npm run test:mss`, `npm run validate:mss:views`,
   `npm run validate:mss:all`, `validate:mss` sul report M-E e `git diff --check` tutti exit 0.
2. **Test che nomina il difetto:** `T1/R6 — mss:move sposta un file di prova, aggiorna i riferimenti vivi e resta atomico`
   in `docs/MetaSkillSystem/tests/tools/run.mjs`; asserzioni non vacue su move, rifiuti, rollback e
   costo inferiore alla baseline di 1 741 righe.
3. **Controverifica famiglia diversa:** Codex/OpenAI ha riprodotto move+aggiornamento riferimenti,
   un rifiuto rosso e rollback con validate rosso, solo in sandbox.

- **`T1` / `R6`:** `mss:move` usa il parser condiviso `doc-paths-lib.mjs` con `validate:docs` (D18);
  non ha mosso atti vivi del corpus.
- **`T2` / `mss:review`:** resta `NON INIZIATO`, fuori da questo ciclo.

**Prossima azione autorizzata: `T2`** (`mss:review`) da affidare con nuovo mandato; `R1` resta
**raccomandato ma non aperto**. Non aprire nessuno dei due in questa seduta. Non dichiarare `H-1.3`
PASS pulito. `WP-1` resta NO-GO.

**Non deciso, e non va dato per deciso:** aprire `R1` (capsula come sottoprodotto) come **mandato
dichiarato** è **raccomandato dall'orchestratore e ancora aperto**. È il singolo intervento con il
ritorno più alto misurato in questa seduta.

### Settimo ciclo del 24-08-2026 — `R1` aperto e provato internamente

**Stato R1 attuale:** `R1` è **CHIUSO CON RISERVE — M12 soddisfatto; riserva busta ridotta in T2**.

La modalità compatta di `mss:capsule` riceve soltanto i tre assi Persona, Sistema e Output; compone
UUID, tempo, runtime, Git, `source_refs` e controlli dai fatti disponibili. Per non violare `R2`,
intento, soggetto e follow-up che il processo non può osservare restano `non_osservato` anziché
essere completati per plausibilità. Un asse con `delta: nessuno` può avere `assertions: []`; gli
altri continuano a richiedere un'asserzione. Prove: il test nominato `capsule: R1 — …`, la capsula
reale e il report [`Report-r1-raccolta-sottoprodotto-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-r1-raccolta-sottoprodotto-24-08-26.md).

I gate interni sono verdi: `validate:mss` sul report R1, `validate:mss:all` e `git diff --check`.
La controverifica Cursor/Composer di famiglia diversa ha prodotto **PASS CON RISERVE**, una capsula
valida e conferma esplicita che le tre condizioni `M12` sono soddisfatte. Atti:
[`Report-controverifica-R1-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-R1-24-08-26.md).
**Riserva busta (rifinitura in `T2`, non riapertura R1):** `area` e `observed_outcome` sono
`non_osservato:…`; `session_type` / `capsule_status` / template `privacy` enum sono costanti di mode
(`R1_MODE_CONSTANTS`), non fatti della chat. Il verdetto M12 di R1 **non** si riapre.

**Completamento operativo T6:** il target §16.2 è ora provato anche come flusso di chiusura reale:
scheda anti-errore di una pagina, ingresso Meta minimo, file giudizi con i soli tre assi, controlli
eseguiti da `mss:capsule`, `--verify` con path completo risolvibile e una sola capsula generata.
Atti: [`Report-r1-completamento-t6-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-r1-completamento-t6-24-08-26.md) e
[`Report-controverifica-r1-t6-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-r1-t6-24-08-26.md).
Esito T6: `PASS_CON_RISERVE`; lo stato autorevole resta **CHIUSO CON RISERVE — M12 soddisfatto**.
L'amendment emesso dall'esecutore T6 è append-only e tecnicamente valido, ma non conta come nuova
indipendenza M12: la controverifica Cursor/Composer storica resta la prova di famiglia diversa.

### Ottavo ciclo del 24-08-2026 — `T2` / `mss:review` **CHIUSO** (`M12`)

**`T2` / `SK-3` è `CHIUSO`.** Esecutore Cursor/Composer; controverifica M12 OpenAI/gpt-5.6-sol. Atti:
[`Report-t2-mss-review-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-t2-mss-review-24-08-26.md) e il report di controverifica M12 della presente seduta.

- **`mss:review`:** sola lettura; tabella fatti L1–L6 (mappa `archive/README.md`); ⚠️ owner/L5/L6;
  regole solo citate; mancanze capsula/Q1–Q6/gate; comandi solo da capsula.
- **Prova nominata:** `T2 / mss:review — seduta con violazione nota la trova; seduta pulita non inventa`
  in `test:mss:tools`.
- **M12 soddisfatto:** prova eseguibile, test nominato non vacuo e famiglia diversa sono confermati;
  i gate `test:mss:tools`, `test:mss`, `validate:mss:views`, `validate:mss:all`, validazione del report
  T2 e `git diff --check` sono rieseguiti verdi. Non dichiarare `H-1.3` PASS pulito. `WP-1` resta NO-GO.

### Nono ciclo del 24-08-2026 — `P4` / privacy template **PROVATO** (non CHIUSO)

Il mandato unico di copertura ha confermato che l’attrezzo era corretto: mancava il test. Il caso
`capsule: P4/SK-11 — template R1 privacy resta di mode e non classifica la chat` passa un input
contraddittorio e verifica il contratto privacy letterale, così non può promuovere una classificazione
dedotta dalla chat. Atti: [`Report-p4-privacy-template-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-p4-privacy-template-24-08-26.md).

Gate interni verdi: `test:mss:tools`, `test:mss`, `validate:mss:views`, `validate:mss:all`, validazione
del report e `git diff --check`. Non è una chiusura di `SK-11`: la controverifica M12 dedicata è
registrata nel ciclo `T3` sotto.

### Decimo ciclo del 24-08-2026 — `T3` / M12 su `P4` **PASS** (SK-11 resta APERTO)

**`T3` è PASS.** Controverifica indipendente Cursor/Composer (famiglia diversa dall’esecutore P4
OpenAI/gpt-5.6). Condizioni `M12` soddisfatte: prova eseguibile, test nominato non vacuo, famiglia
diversa. Atti: report orchestratore `T3` di questa seduta.

- **Prova nominata rieseguita verde:** `capsule: P4/SK-11 — template R1 privacy resta di mode e non classifica la chat`.
- **Non vacuo:** contratto privacy letterale + input `chat_transcript` contraddittorio; probe indipendente conferma `classification: internal` invariata; una mutazione del letterale renderebbe rosso il confronto.
- **Nessun allentamento del motore:** `capsule.mjs` non è stato modificato da P4; solo la suite tools.
- **Gate rieseguiti verdi:** `test:mss:tools`, `test:mss`, `validate:mss:views`, `validate:mss:all`, validazione del report P4, `git diff --check`.
- **`SK-11` resta APERTO:** `P4` ha M12; la chiusura formale del pacchetto è solo di Matteo.
- **Invariati:** `H-1.3` = `PASS_CON_RISERVE`; `WP-1` = NO-GO; `SEP-G5` non PASS.

### Undicesimo ciclo del 24-08-2026 — `T4` / chiusura formale **`SK-11` CHIUSO** (decisione Matteo)

**`T4` è PASS.** Matteo ha dichiarato in chat: *«commit push e firmo sk 11 se non c'è altro da fare»*.
Condizioni già soddisfatte prima della firma: `P4` PROVATO + M12 (`T3`); suite verde; nessuna prova
tecnica residua per `SK-11`. Atti: report `T4` di questa seduta.

- **`SK-11` è `CHIUSO`:** decisione formale di Matteo, non sostituisce M12 ma lo consuma.
- **Invariati:** `H-1.3` = `PASS_CON_RISERVE`; `WP-1` = NO-GO; `SEP-G5` non PASS.

**Prossima azione autorizzata: `T6`** (R1 poi SK-4 poi SK-8 — Codex orchestratore; SK-10 e WP-1 fuori per `D25`–`D27`).
Mandato Codex: [`Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md).
`SK-10` resta **differito**. Prodotto app e `WP-1` **non** si aprono in questo ciclo.

### Duodecimo ciclo del 24-08-2026 — decisione strategica Matteo (`T6`)

Matteo ha fissato la sequenza di lavoro prima di qualsiasi pilota:

1. **`R1` al 100%** — capsula come sottoprodotto, non compito extra; ridurre errori agente su chiusura.
2. **`SK-4`** — chiudere bypass enforcement residui (B1–B3 e schema gate in prosa).
3. **`SK-8`** — promozione documentale della suite da root diverse.

**Esplicitamente fuori da questo ciclo:** `SK-10` (portabilità/export, più avanti); rilascio prodotto
CalendarBackup (`main` vs `env/test`); `WP-1` piloti reali.

**Obiettivo dichiarato:** usare MSS senza pagare costi inutili di token e minimizzare retry su
capsule/report; poi sviluppo e testing come pilota **solo quando le fondamenta sono pronte**.

**Esecutore del ciclo:** Codex in seduta orchestratore con sub-agent; famiglia diversa per M12 su
ogni mandato tecnico.

#### Esito operativo del ciclo `T6`

1. **R1:** target operativo completato e controverificato `PASS_CON_RISERVE`; stato invariato
   **CHIUSO CON RISERVE — M12 soddisfatto**. La chiusura reale ha usato solo tre giudizi e una capsula
   generata; la scheda breve evita header manuale, separatori errati e `evidence_ref` a basename.
2. **SK-4:** **`CHIUSO` 25-08-26**. B1 chiuso (`committedRecords` solo da `HEAD`); B2/B3 e D18 con
   test nominati. Revisione indipendente Cursor `PASS_CON_RISERVE`; firma Matteo verbatim
   «Firmo SK-4 e SK-8 come CHIUSO dopo revisione Cursor del 25-08-26.»
3. **SK-8:** **`CHIUSO` 25-08-26**. Suite da cwd esterna senza raddoppio; revisione Cursor `PASS`;
   stessa firma formale di Matteo.

Atti esecutore/revisore:

- R1: [`Report-r1-completamento-t6-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-r1-completamento-t6-24-08-26.md) · [`Report-controverifica-r1-t6-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-r1-t6-24-08-26.md)
- SK-4: [`Report-sk4-completamento-t6-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-sk4-completamento-t6-24-08-26.md) · [`Report-controverifica-sk4-t6-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-sk4-t6-24-08-26.md)
- SK-8: [`Report-sk8-promozione-t6-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-sk8-promozione-t6-24-08-26.md) · [`Report-controverifica-sk8-t6-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-controverifica-sk8-t6-24-08-26.md)

**Riserva pre-commit T6-ORPHAN (chiusa al commit):** prima del commit unico del 25-08-26,
`--verify` sui record esecutori untracked restituiva `MSS-AMENDMENT-ORPHAN`. Dopo il commit il batch
append-only è autorizzato; esito registrato in
[`Report-batch-verify-t6-post-commit-25-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-batch-verify-t6-post-commit-25-08-26.md).

**Riserva SK4-ASSERT — CHIUSA T7 (25-08-26):** nel report controverifica SK-4 l'asserzione Output
citing `independently_verified` era disallineata da §7. Rettifica append-only emessa in
[`Report-sk4-assert-t7-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md)
(amendment su `annotation.assertions[0]` del record `mss-rec-01a03596-e401-706e-bdee-f45d90ccf380`).
`--verify` (N2) non copre i campi Output — limite strutturale, non allentato.

**Revisione famiglia diversa:** [`Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md)
(Cursor/Composer 25-08-26) — verdetto `PASS_CON_RISERVE` sul ciclo intero.

#### Chiusura formale ciclo `T6` — 25-08-2026

- **Firma Matteo (verbatim):** «Firmo SK-4 e SK-8 come CHIUSO dopo revisione Cursor del 25-08-26.»
- **Commit unico** del working tree T6 su `env/test` (no push finché Matteo non autorizza).
- **Ciclo `T6`:** **CHIUSO**.

**Prossima azione autorizzata: `T8`** (pubblicazione commit T7+T9 con sì Matteo; preferibile fix Codex M12 T7 mirati prima del commit; riapertura `D27`/`WP-1` solo in chat dedicata dopo atti pubblicati). `SK-10`, prodotto/`src/` e `H-1.3` PASS pulito restano fuori perimetro. Ciclo `T9` (blindatura struttura) eseguito CON RISERVE — vedi sotto.

### Quattordicesimo ciclo del 25-08-2026 — `T7` eseguito **CON RISERVE** (orchestratore Cursor)

Mandato: [`Prompt-orchestratore-cursor-t7-backlog-pilota-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Prompt-orchestratore-cursor-t7-backlog-pilota-25-08-26.md).
HEAD partenza `fafe81f`; working tree T7 non committato a chiusura orchestratore.

#### Esito operativo del ciclo `T7`

| Famiglia | Esito | Atti |
|---|---|---|
| 1 — SK-2 + viste | **CHIUSA** | [`Report-sk2-status-allineamento-t7-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-sk2-status-allineamento-t7-25-08-26.md) — `plan-parse.mjs`; gate da ultimo ciclo; anti-stale cruscotto; SK-2 **ALLINEATO** |
| 2 — Hook Q/R N2–N5 | **CHIUSA** | [`Report-hook-qr-chiusura-t7-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-hook-qr-chiusura-t7-25-08-26.md) — test N2/N3; CHIUSURA §4 triade + §12 |
| 3 — H13-E2 | **CHIUSA CON RISERVE** | [`Report-h13-e2-bypass-t7-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-h13-e2-bypass-t7-25-08-26.md) — bypass B-E2-CI chiuso; E2 intenzionali restano |
| 4 — SK4-ASSERT | **CHIUSA** | [`Report-sk4-assert-t7-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md) — amendment append-only Output |
| 5 — Readiness pilota | **CHIUSA CON RISERVE** | [`Report-readiness-pilota-t7-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-readiness-pilota-t7-25-08-26.md) — D27 **condizionata**; WP-1 NO-GO |

Report orchestratore: [`Report-orchestratore-t7-backlog-pilota-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-orchestratore-t7-backlog-pilota-25-08-26.md).

**Riserve ciclo T7 (non chiuse):**

- **R-T7-01:** working tree non pubblicato su `origin/env/test` (commit/push solo con sì Matteo).
- **R-T7-02:** M12 Codex controverifica famiglia diversa — attesa mandato Matteo post-ciclo.
- **R-T7-03:** `H-1.3` resta `PASS_CON_RISERVE` (bypass `--no-verify`, unstaged, Cloud intenzionali).
- **R-T7-04:** ROADMAP/HANDOFF Senior-Eval restano viste manuali (D14 parziale).
- **R-T7-05:** R4 light vs deep — fail-open hook su light accettabile per target deep; pilota light debole.
- **R-T7-06:** limite strutturale `--verify` su campi Output (`assertions[]`) — documentato, non allentato.

**Invariati:** `WP-1` = NO-GO; `D27` chiusa finché Matteo non riapre in chat dedicata; nessun lavoro `src/`.

#### Chiusura formale ciclo `T7` — 25-08-2026

- **Ciclo `T7`:** **eseguito CON RISERVE** (5 famiglie + orchestratore; suite verde locale).
- **Commit/push:** non eseguiti — attesa «lavoro ok» / «fai report finale» di Matteo.

### Quindicesimo ciclo del 25-08-2026 — `T9` blindatura struttura **CON RISERVE** (orchestratore Cursor)

Mandato: chat Matteo 25-08 «Prompt orchestratore Cursor — ciclo T9» @ HEAD `fafe81f`.
Codex in parallelo su M12 T7: [`Report-revisione-indipendente-ciclo-t7-codex-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-revisione-indipendente-ciclo-t7-codex-25-08-26.md) — **FAIL mirato pre-commit** (3 fix meccanici).

#### Esito operativo del ciclo `T9`

| Famiglia | Esito | Atti |
|---|---|---|
| F1 R1–R3 | **CHIUSA** | [`Report-t9-f1-r1-r3-agente-freddo-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-t9-f1-r1-r3-agente-freddo-25-08-26.md) — test nominato `R3 — validate:app e validate:mss:all…` |
| F2 R4–R7 | **CHIUSA** | [`Report-t9-f2-r4-r7-automazioni-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-t9-f2-r4-r7-automazioni-25-08-26.md) — R4 **BACKLOG** + test `R4 — light resta fail-open…`; R7 **PROVATO** |
| F3 R5–R6 | **CHIUSA** | [`Report-t9-f3-r5-r6-dati-move-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-t9-f3-r5-r6-dati-move-25-08-26.md) — R5/R6 **CHIUSO** confermati |
| F4 R8+D14 | **CHIUSA** | [`Report-t9-f4-r8-d14-portabilita-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-t9-f4-r8-d14-portabilita-25-08-26.md) — R8 **PROVATO**; D14 **BACKLOG** |

Report orchestratore: [`Report-orchestratore-t9-blindatura-struttura-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-orchestratore-t9-blindatura-struttura-25-08-26.md).

**Verdetto struttura (distinto da D27/WP-1):** `STRUTTURA_PRONTA_CON_RISERVE` — sedute deep affidabili sì, con riserve; **WP-1 resta NO-GO**; **nessun** H-1.3 PASS pulito.

**Riserve T9 / pre-T8 (Codex M12 T7, non chiuse in T9):**

- **R-T9-01:** `parsePlanGate()` riconosce solo cicli `M-*` → «ultimo chiuso» mostra `M-F` invece di T6/T7.
- **R-T9-02:** template kit `_skill-system-v0/hooks/fine-sessione-nudge.mjs` divergenza da Cursor prod (v5 / mente fredda).
- **R-T9-03:** `PROTOCOLLO_PRIMO_PILOTA_V0_1.md` versione/schema legacy vs contratto vivo.
- Deliberati invariati: R4 light≠deep · D14 ROADMAP/HANDOFF · H-1.3 E2 · R-T7-06 Output `--verify`.

#### Chiusura formale ciclo `T9` — 25-08-2026

- **Ciclo `T9`:** **eseguito CON RISERVE** (4 famiglie + inventari + orchestratore; `validate:mss:all` verde).
- **Commit/push:** non eseguiti — gate successivo `T8`.

**Prossima azione autorizzata: `T8`** (pubblicazione commit T7+T9 con sì Matteo; preferibile chiudere prima i 3 fix Codex M12 T7; riapertura `D27`/`WP-1` solo in chat dedicata dopo atti pubblicati).

### Tredicesimo ciclo del 25-08-2026 — `T6` eseguito e **CHIUSO** (`M12` + firma Matteo)

Revisione indipendente Cursor [`Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md):
`PASS_CON_RISERVE` sul ciclo intero. Firma verbatim Matteo: «Firmo SK-4 e SK-8 come CHIUSO dopo revisione Cursor del 25-08-26.»
Commit unico del working tree T6 su `env/test` (no push finché Matteo non autorizza). Batch `--verify` post-commit in
[`Report-batch-verify-t6-post-commit-25-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-batch-verify-t6-post-commit-25-08-26.md).

**Dato messo agli atti su richiesta di Matteo, da trattare in seduta separata:** `main` è fermo al
23-06-26. `env/test` è **127 commit avanti**, di cui 24 toccano `src/`: **12 778 righe di app**
scritte, testate (118/118 e2e sul cantiere Servizio) e **mai rilasciate ai clienti** — 62 giorni.
Non è un difetto del MSS; è il cantiere che il MSS ha oscurato. Non aprirlo di iniziativa.

**Igiene eseguita:** gli **8 stash** pendenti (dal 04-05-26) sono stati valutati uno per uno e
**azzerati**. Nessuno conteneva lavoro vero: `stash@{0}` portava lo schema `0.1.1` e tre script npm
**già in HEAD**; `stash@{2}` avrebbe **rimosso** l'hook di chiusura dal pre-commit; `stash@{5}` era
superato (le icone sono state rimappate, non rimosse); i restanti erano 1-3 file su lavori chiusi.
Archiviati come patch in `docs/_lavoro/stash-archivio-24-08-26/` (cartella privata, gitignored)
prima del `git stash clear`. Worktree: uno solo, pulito.

### Decisioni di Matteo — 23-08-2026 (`D16`–`D24`, CHIUSE)

| ID | Decisione | Scelta | Conseguenza operativa |
|---|---|---|---|
| `D16` | `SK-6` è chiuso? | **CHIUSO** | l'attrezzo esiste, i cancelli sono verdi, una revisione indipendente di famiglia diversa lo ha esaminato, la vista effettiva è implementata. §4-bis aggiornato |
| `D17` | Il vincolo di cambio-famiglia di §16.3 | **resta AVVISO, non gate** | confermato `D13`: una review di famiglia uguale **non invalida** la validazione. È **consigliata, non obbligatoria**. Si riapre solo se emergono problemi reali |
| `D18` | La duplicazione `core.mjs`/`query.mjs` | **eliminata, non gestita** | `applyAmendmentsView()` è **esportata** da `core.mjs` e `query.mjs` la **delega**. Principio generale dichiarato da Matteo: *«dobbiamo snellire, non duplicare»* — vale per ogni attrezzo futuro |
| `D19` | Pubblicazione del lavoro | **push, repo pulita** | i commit locali di `SK-6` e la vista effettiva vanno su `env/test` |
| `D20` | Chiusura del ciclo 23-08 | **push eseguito, `SK-4`+`SK-5`+`SK-11` CHIUSI** | i tre commit (`d1598b6`, `88aa5a1`, `7e96fb1`) sono su `origin/env/test`; la run reale `32652259771` ha il job `mss` **verde** — è il gate `F2`, non più una simulazione locale. Con quello Matteo ha dichiarato chiusi i tre pacchetti |
| `D21` | Il rosso documentale del job `ci` | **si azzera, non si tollera** | `validate:docs` esce 1 con **26** path rotti in CI (17 in locale). Una spia rossa permanente non è più una spia. Mandato dedicato: [`Prompt-fix-17-path-docs-23-08-26.md`](../Sessioni%20di%20lavoro/23-08-26/Prompt-fix-17-path-docs-23-08-26.md). Vietato azzerare il contatore ammorbidendo il controllo |
| `D22` | Fix della regex dell'hook di pre-commit | **accettato** | il controllo usa la regex report condivisa e non perde i report in sotto-cartella; il fix era già nel commit `7436def`. Fonte: [`Report-revisione-skill-chiusura-e-hook-23-08-26.md` §7](../Sessioni%20di%20lavoro/23-08-26/Report-revisione-skill-chiusura-e-hook-23-08-26.md#7-decisioni-matteo-23-08-26-sera--implementate) |
| `D23` | Contenuto di `Q1` alla chiusura | **path del mandato + revisione/hash + delta della chat** | il mandato già salvato non viene ricopiato; il verbatim resta obbligatorio solo per i messaggi di Matteo che non esistono in alcun file. Effetto: meno duplicazione senza perdere la provenienza. Fonte: stesso report §7 + `CHIUSURA_SESSIONE.md` §11 |
| `D24` | Comportamento dell'hook senior a controlli verdi | **silenzio condizionato** | con domande complete e validatore MSS verde l'hook tace; parla soltanto se una risposta manca o la capsula è davvero rossa. Effetto: niente turno «mente fredda» duplicato. Fonte: stesso report §7 + `.claude/hooks/fine-sessione-senior.mjs` v6 |
| `M3` | Chiusura `SK-7` | **CHIUSO** | Matteo autorizza la chiusura dopo controverifica indipendente: D2/D3, privacy append-only e riferimenti pubblicabili sono provati; `D17` resta un avviso, non un gate. |

### Decisioni di Matteo — 24-08-2026 sera (`D25`–`D27`, CHIUSE)

| ID | Decisione | Scelta | Conseguenza operativa |
|---|---|---|---|
| `D25` | Sequenza prossimo lavoro MSS | **`R1` → `SK-4` → `SK-8`** | un mandato per famiglia; `SK-10` differito; nessun altro pacchetto SK-* si apre in parallelo senza sì esplicito |
| `D26` | Prodotto CalendarBackup | **in pausa** | nessun mandato su `src/`, rilascio `main`, merge env/test in questa fase MSS |
| `D27` | Pilota (`WP-1`) | **solo dopo fondamenta** | obiettivo = MSS usabile a basso costo e basso tasso errore; `WP-1` resta NO-GO finché `D27` non viene riaperto in chat dedicata |

**Principio `D18`, da applicare a tutti i pacchetti `SK-*`:** un attrezzo che ha bisogno di una regola
già scritta **la importa**. Se non è esportata, si esporta. Due implementazioni della stessa regola
sono un difetto peggiore di quello che la regola governa — anche quando il perimetro di un mandato
sembra imporle: in quel caso il mandato va allargato, non aggirato con una copia.

### Stato della raccomandazione precedente

La sequenza raccomandata è stata consumata: `SK-4`, `SK-11` e `SK-5` sono chiusi; `SK-7` è stato
costruito dopo il lettore, come impone `D12`, e il report proprietario è arrivato, ma resta aperto
per la rettifica documentale mirata e la decisione `M3`. Questa seduta **non apre né raccomanda un
nuovo pacchetto**: prima vengono pubblicazione autorizzata e verifica della CI reale.

### Un dato nuovo da mettere agli atti (non una richiesta di riaprire `D13`)

Il 22-08-26 una famiglia di modello **diversa** (OpenAI Codex) ha revisionato un lavoro di autore
Anthropic e **ha trovato difetti che l'autore non aveva visto**, incluso quello strutturale del
punto 3. Su cinque review condotte prima di quella, **una sola** aveva davvero cambiato famiglia.
È la prima misura reale di quanto vale il vincolo che `D13` ha lasciato come avviso.

**Gate del prossimo task:** nessun move · nessun path rewrite · nessuna sovradichiarazione
`SEP-G5`/`WP-1`/`H-1.3` pulito · nessun nuovo pacchetto senza decisione di Matteo · nessun push
senza sì esplicito. `REPORT_PATH_RE` resta una fonte condivisa con cinque consumatori: ogni sua
modifica futura deve dichiarare prima l'intero elenco.

---

## 16. Target dello scheletro — dettato da Matteo, 21-08-2026

> **Perché questa sezione esiste qui.** È direzione di `SYS-1`, e `SYS-1` ha un solo proprietario.
> Metterla altrove creerebbe il secondo owner che il vincolo §2.7 vieta.

### 16.1 Le parole di Matteo

> *«Lo scopo è creare uno scheletro perfetto che stia in equilibrio aiutando agenti con le automazioni
> necessarie a evitargli eccessivo consumo di token.»*
>
> *«Una delle funzionalità migliori di questo sistema deve diventare che: qualsiasi lavoro fatto da
> agente è un fatto utile per raccogliere tutte le informazioni di cui lo skill system necessita
> (senza inventare contenuti). Così un agente può valutare un approccio diverso a un problema,
> cambiando metodo o strategia o suggerendo approccio con nuovo modello.»*
>
> *«Gli agenti devono essere stimolati dallo scheletro dello skill system a raccogliere i dati
> necessari alla crescita, chiedendo specifiche a utente e interazioni, in base al tipo di seduta
> che l'utente avvia.»*
>
> *«I criteri di MSS sono qualsiasi dato che possiamo raccogliere da una chat, al fine di poter
> migliorare esperienza utente, esperienza agente, ed efficienza MSS.»*
>
> *«Eliminiamo ridondanze e centralizziamo sempre di più ogni chat a un contesto sempre più mirato,
> in un sistema sempre più grande ma ben connesso e strutturato per agevolare il lavoro di agenti.»*

**Attribuzione:** testo di Matteo, trascritto verbatim dalla chat del 21-08-2026 e riordinato per
temi senza aggiunte. La strutturazione in requisiti `R1`–`R8` è dell'agente consulente.

### 16.2 Gli otto requisiti che ne discendono

| # | Requisito | Criterio di soddisfazione |
|---|---|---|
| `R1` | La raccolta dati è un **sottoprodotto** del lavoro, non un compito in più | l'agente non scrive i fatti che la macchina già possiede |
| `R2` | **Niente contenuti inventati** | ogni campo automatico proviene da git, dall'esito di un comando o dall'orologio |
| `R3` | Le automazioni **fanno risparmiare** token | conoscere lo stato costa un comando, non dieci file |
| `R4` | Lo scheletro **stimola** in base al tipo di seduta | il tipo di seduta determina quali dati cercare e quali domande porre all'utente |
| `R5` | I dati raccolti sono **interrogabili** | esiste un comando che risponde a domande sulle capsule |
| `R6` | Spostare o rinominare costa **un comando** | i riferimenti si aggiornano da soli e la suite resta verde |
| `R7` | A fine lavoro l'agente **si autorevisiona con una macchina** | le domande di chiusura sono confrontate col diff reale |
| `R8` | Il **bootstrap in una repo nuova** è una procedura | intervista iniziale + manuale utente |

### 16.3 Il modello delle sedute

Una seduta **deep** non entra in una chat sola: è una catena di chat con passaggio di consegne.

`Preparatore` → `Pilota` (esegue una cosa e la prova) → `Senior` (legge i dati, propone strategia,
non esegue) → `Revisore` (famiglia di modello **diversa**) → `Matteo` (decide il gate).

**Vincolo di indipendenza proposto, da approvare:** una review cambia lo stato di verifica da
`self_report` a `independently_verified` **solo se** il revisore gira su una famiglia di modello
diversa da quella di chi ha scritto. Il campo `recorded_by.agent_runtime.provider` esiste già nella
capsula: il controllo è meccanico. Motivo: su cinque review condotte finora, **una sola** ha davvero
cambiato famiglia di modello.

**Vincolo sull'handoff:** l'handoff dev'essere **generato**, non redatto. Un documento generato non
può diventare stale: o è corretto, o non gira.

### 16.4 Decisioni di Matteo — 21-08-2026 (CHIUSE, non riaprire senza nuova evidenza)

| ID | Decisione | Scelta | Conseguenza operativa |
|---|---|---|---|
| `D11` | Da dove si parte | **`SK-0` subito** | eseguito e chiuso in giornata: tre righe di configurazione; `npm run validate` verde per la prima volta |
| `D12` | Primo attrezzo dopo `SK-0` | **`mss:query`** | si costruisce prima il *lettore* dei dati, e gira sulle **41 capsule già esistenti**. Se da quelle non esce nulla di utile, lo si scopre spendendo un comando, prima di automatizzare la raccolta |
| `D13` | Regola sull'indipendenza del revisore | **sì, ma come avviso — non bloccante** | il validator **segnala** quando writer e revisore condividono la famiglia di modello, e non blocca. `E = 1/2`, non `E = 3`. Scelta consapevole: non sempre è disponibile una seconda famiglia. La riserva `R1` resta **aperta** e va citata come tale |
| `D14` | Viste che si aggiornano a mano | **`ROADMAP`, `HANDOFF` e indice dei report diventano generati** | un documento generato non può diventare stale: o è corretto o non gira. Chiude i debiti previsti `SEP-D06` e `SEP-D07` |
| `D15` | `D6`, `D7`, `D8`, `D10` del plan directory | **congelate** su raccomandazione del consulente | riordinare l'albero prima di avere gli attrezzi ripeterebbe il costo misurato del primo move |

**Nota di onestà su `D13`.** La scelta «avviso» lascia l'indipendenza a enforcement debole. È una
decisione legittima e consapevole di Matteo, **non** una svista: va però ricordato che finché la
regola non blocca, una review fatta dallo stesso modello continuerà a poter essere registrata come
`independently_verified` se chi scrive lo dichiara. L'avviso rende visibile il caso, non lo impedisce.

### 16.5 Che cosa questa sezione NON autorizza

Non apre `WP-1`. Non sana `H-1.3`. Non dichiara `SEP-G5`. Non autorizza move, push o modifiche a
`docs/_lavoro/`. Ogni pacchetto `SK-*` di §4-bis resta `NON INIZIATO` finché Matteo non lo apre.
