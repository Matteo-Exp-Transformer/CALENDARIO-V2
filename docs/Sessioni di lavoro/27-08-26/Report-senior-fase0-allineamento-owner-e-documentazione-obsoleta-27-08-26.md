# Report — Fase 0 `AM-C0`, allineamento owner e documentazione obsoleta · 27-08-2026

**Modalità:** deep · MetaSkillSystem / Senior Eval Pack · senior orchestrator
**Cosa è cambiato:** la prova di solidità ha trovato che tre dei cinque casi del test `AM-C0` contraddicevano `docs/FOLLOW_UP.md`; le decisioni sono state rimesse in ordine nel loro owner e il protocollo è stato corretto per rispecchiarle invece di possederle.
**Cosa resta:** il test non è ancora stato lanciato. Restano da congelare denominatore, confondenti e chiave, e da preparare i due prompt Cursor e il prompt del revisore Codex.
**Serve una tua azione:** lanciare le due chat preparate a fine seduta — enforcement della documentazione obsoleta (§5) e orchestrazione dei test per «Agente Matteo» (§6-§7). La proposta di §3.3 è stata confermata e registrata.

## 1. Perimetro e autorità

Seduta di apertura del mandato senior consegnato in `Prompt-senior-preparazione-test-allineamento-agente-matteo-27-08-26.md`. Matteo ha aggiunto in chat due direzioni: usare l'archivio di lavoro come sorgente di scenari di valutazione, e progettare l'«Agente Matteo» come agente che prepara prompt e riprende il punto della situazione.

Ho operato in lettura su tutto il repository, con scrittura limitata a: `docs/FOLLOW_UP.md`, quattro file del Senior Eval Pack, questo report e le viste rigenerate dal generatore. Non ho toccato codice app, database, migrazioni, validator, hook, fixture, `PLAN_V0.md`, stato `SYS-1`, né i tre file di istruzioni già modificati nel worktree prima di questa sessione.

Nessuna fonte privata è stata letta oltre la Bussola, e solo per il metodo di instradamento. Il Tempo 0 non è stato eseguito: l'intervista di Matteo non è iniziata, e la Bussola lo colloca prima delle domande di blocco, non prima di una conversazione di disegno.

## 2. Fase 0 — prova di solidità

Un subagente in sola lettura, senza accesso a `docs/_lavoro/` e senza permessi di scrittura, ha cercato contraddizioni interne su sei assi: owner e stato, cecità e indipendenza, freeze e comparabilità, privacy, casi contro realtà del codice, gate.

Esito: **tredici finding** — sei HIGH, quattro MEDIUM, tre LOW. Ho verificato di persona i quattro che cambiavano il lavoro, prima di agire su di essi.

### 2.1 I tre casi sbagliati

| Caso | Cosa diceva il protocollo | Cosa dice l'owner | Verificato |
|---|---|---|---|
| `C1` walk-in | «rimuovere *Aggiungi walk-in* dalla Home, lasciandolo in Servizio» come decisione coperta | `FU-SERV-WALK-IN-LIMIT-1` documenta la rimozione del **limite coperti**, non del pulsante. La decisione sull'ingresso non era registrata in nessun owner | `docs/FOLLOW_UP.md`:117; `grep WalkInModal src` → unico ingresso in `components/home/`, la pagina Servizio non ne ha nessuno |
| `C2` riepilogo capienza | «prima limite coperti della fascia, poi somma dei tavoli» | `FU-SERV-BADGE-CASCATA-1`, decisione 06-08-26: interruttore `service_layout_confirmed` acceso → **posti fisici**; altrimenti coperti fascia. Precedenza invertita | `docs/FOLLOW_UP.md`:121 |
| `C5` badge e riepilogo | «fonte potenzialmente ambigua, l'agente deve fermarsi e chiedere» | la stessa riga `FU-SERV-BADGE-CASCATA-1` fissa già la regola: non era ambigua | `docs/FOLLOW_UP.md`:121 |

Un quarto caso, `C3` (vista mobile), era tipizzato «scelta nuova» mentre la richiesta è scritta verbatim nella checklist di collaudo T11.

**Effetto se il test fosse partito così.** Un agente che apre `FOLLOW_UP.md`, cita la decisione registrata e la applica correttamente sarebbe stato marcato `negative` dal revisore, perché la chiave diceva il contrario. Il test avrebbe punito il comportamento corretto e concluso che il pacchetto non trasmette decisioni.

### 2.2 La divergenza di stato per rotta d'ingresso

`MASTERPLAN_V0.md` §6 affermava «**WP-1 = NO-GO** (non aprire)» e «H-1.3 = `PASS_CON_RISERVE`». La vista di continuità generata dallo stesso pacchetto affermava «`WP-1`: IN PILOTA — ombra» e «`H-1.3`: PASS 25-08-26, riserva chiusa», indicando come prossima azione autorizzata `T14`.

Siccome `AM-01` e `AM-02` richiedono «tre aperture reali di ciclo Servizio», cioè `WP-1`, la contraddizione stava esattamente sulla strada da percorrere: un senior che entrava dal masterplan doveva fermarsi, uno che entrava dall'handoff partiva. La stessa `ROADMAP_V0.md` dichiarava `SEP-5` bloccato mentre il masterplan lo dà `IN_CORSO`.

⚠️ **`npm run mss:status` non lo intercetta.** Le frasi divergenti vivono in prosa umana, fuori dai marcatori che il generatore controlla. La macchina anti-stale garantisce che le viste siano rigenerate dal loro owner, non che il testo attorno dica il vero.

### 2.3 Difetti di metodo del protocollo

- Il revisore Codex avrebbe ricevuto «la chiave», che il contratto e la skill del pacchetto trattano come contaminazione. Mancava la distinzione fra **chiave di caso** (quale risposta le fonti sostengono) e **verdetto atteso per condizione** (quale delle due risposte il senior si aspetta sia migliore).
- La chiave prevedeva **un solo** esito atteso per caso. Ma su un caso coperto la risposta corretta di un agente *senza* le schede è uno STOP per fonte mancante: con una chiave sola, quel comportamento corretto risulta `negative`.
- Il freeze ometteva cinque elementi richiesti dal piano §5 e dal contratto §5: denominatore, confondenti iniziali, criterio di comparabilità, conseguenza di ciascun esito, timestamp/digest — più il materiale escluso per caso.
- La tabella fonti e le schede decisione non avevano owner dichiarato: eseguito alla lettera, il protocollo avrebbe creato il registro parallelo di decisioni personali che il piano §3.4 vieta.

## 3. Decisioni di Matteo raccolte in questa seduta

### 3.1 Walk-in — nessuna contraddizione, un'annotazione persa

Matteo ha chiarito: ha completato il fix che rimuove il limite coperti del walk-in, **e poi** ha chiesto di annotare la volontà di toglierlo dalla Home. Le due cose non si contraddicono.

⚠️ **L'annotazione non è mai arrivata in un owner.** Ricerca su tutti i `.md` del repository: l'unica traccia della decisione era una riga dentro `PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md` e il suo report — cioè dentro un documento di test scritto il giorno dopo, che non è un registro. Non era in `FOLLOW_UP.md`, non nel prompt orchestratore del 26-08, non nel report B2/B5, non nella checklist di collaudo. Se avessimo cancellato il documento di test, la decisione sarebbe sparita.

Registrata ora come `FU-SERV-WALK-IN-HOME-1`, con lo stato di fatto verificato nel codice: l'unico ingresso è `src/features/booking/components/home/WalkInModal.tsx`, aperto da `AdminHomePage.tsx`; la pagina Servizio non ha alcun ingresso walk-in, quindi «lasciarlo in Servizio» significa **crearlo**, non spostare un pulsante.

### 3.2 Riepilogo capienza — decisione rivista da Matteo

Matteo ha riformulato la decisione: nella card fascia in fondo al Calendario si mostrano i coperti disponibili, pari alla somma dei posti dei tavoli; ma se l'admin imposta il limite per fascia, quello va mostrato **prima**. Ha chiesto se la decisione precedente fosse migliore.

**Analisi.** La regola del 27-08 è la più solida, per una ragione verificabile nel codice: il numero che deve guidare è quello che **blocca davvero** una prenotazione. L'edge `create-booking` rifiuta con codice `SLOT_LIMIT` sulla capienza di fascia (`supabase/functions/create-booking/index.ts`:566); i posti fisici dei tavoli non rifiutano nulla. Mostrare per primi i posti fisici quando un limite di fascia è attivo direbbe all'admin «hai 40 posti» mentre il sistema respinge il 26° cliente.

La decisione del 06-08 nasceva da una preoccupazione diversa, non opposta: evitare di mostrare un denominatore fisico sbagliato per un locale configurato a metà («8 / 12»). Quella ragione resta valida e si sposta al gradino di riserva, senza invertire la precedenza.

⚠️ `service_layout_confirmed` **non è mai stato implementato** — esiste solo nel registro e nel piano 06-08. La rettifica non comporta rilavorazione.

**Cascata registrata** (rettifica append-only su `FU-SERV-BADGE-CASCATA-1`, valida sia per il badge sia per la card):

1. limite coperti della fascia impostato → si mostra quello, etichettato come limite;
2. altrimenti → somma dei posti fisici dei tavoli attivi;
3. se manca tutto → nessun numero + messaggio che dice cosa configurare.

### 3.3 Integrazione — proposta del senior, decisa da Matteo

I due numeri rispondono a domande diverse: il limite di fascia dice «quanti clienti accetto», la somma dei tavoli dice «quante persone ci stanno fisicamente». La card in fondo al Calendario ha spazio, a differenza del badge.

Proposta del senior: la card mostra il numero vincolante in evidenza e l'altro come contesto, e segnala il caso di configurazione incoerente — limite di fascia superiore ai posti fisici, cioè un locale che accetta più prenotazioni di quante ne può servire.

**Decisa da Matteo il 27-08-2026** («sono daccordo con le tue deduzioni su limite coperti e posti dipsonibili. mi hai reso piu netta la distinzione») e registrata in `FU-SERV-BADGE-CASCATA-1`. Confine mantenuto: vale solo per la card, il badge resta a un numero solo perché non ha spazio. La provenienza resta tracciata — concepita dal senior, decisa da Matteo — e non viene riscritta come se fosse nata da lui.

## 4. File allineati

| File | Intervento | Motivo |
|---|---|---|
| `docs/FOLLOW_UP.md` | nuova riga `FU-SERV-WALK-IN-HOME-1`; rettifica append-only su `FU-SERV-BADGE-CASCATA-1` con la decisione 06-08 barrata e conservata | le decisioni di prodotto vivono nel loro owner; la storia non si riscrive |
| `Senior-Eval-Pack/PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md` | §3 owner degli artefatti; §4 cinque casi ritipizzati + rettifica che cita ciò che sostituisce + doppio esito atteso; §5 elementi di freeze mancanti e distinzione chiave/verdetto | il protocollo rispecchia le decisioni, non le possiede |
| `Senior-Eval-Pack/MASTERPLAN_V0.md` | §4 intestazione datata al 27-08; §6 righe su `H-1.3`/`WP-1` sostituite da un puntatore all'owner; §4-bis due righe appese | un valore dinamico ha un solo proprietario; il registro anti-overwrite era stato aggirato il 27-08 |
| `Senior-Eval-Pack/ROADMAP_V0.md` | rimossa l'affermazione «SEP-5 bloccato» | la roadmap è una vista e non possiede lo stato |
| `Senior-Eval-Pack/PIANO_MEMORIA_OPERATIVA_AGENTE_MATTEO_V0.md` | §6 asserzione su `SEP-5` sostituita da puntatore; separatore di tabella a quattro colonne | la colonna «Non dimostra» non veniva renderizzata: era proprio quella che impedisce di sovradichiarare |
| `Senior-Eval-Pack/SENIOR_EVAL_SKILL.md` | §7 distinzione fra prossimo passo del pacchetto e prossimo passo di `SYS-1`, con STOP sulla contraddizione | due ingressi legittimi mandavano un senior su lavori diversi |
| `MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md` | vista rigenerata (+1 riga: questo report) | il suo owner è il filesystem dei report; non è una modifica manuale di contenuto |
| viste generate | `npm run generate:mss:views` | cruscotto, roadmap, handoff e indice report derivati dai rispettivi owner; solo l'indice ha prodotto un delta |
| `Sessioni di lavoro/27-08-26/Prompt-senior-enforcement-documentazione-obsoleta-27-08-26.md` | nuovo | mandato per la chat dedicata al problema di §5 |
| `Sessioni di lavoro/27-08-26/Prompt-senior-orchestratore-test-agente-matteo-27-08-26.md` | nuovo | mandato per congelare e condurre le corsie A e B |
| `Sessioni di lavoro/27-08-26/judgments-senior-fase0-allineamento-owner-27-08-26.json` | nuovo | i tre giudizi espliciti passati a `mss:capsule`; nessun dato dedotto dalla chat |

## 5. Documentazione obsoleta — problema strutturale, non incidente

**Annotazione richiesta esplicitamente da Matteo il 27-08-2026.**

Questa seduta ha prodotto, in poche ore di sola lettura, cinque casi distinti dello stesso difetto:

1. una decisione di prodotto detta in chat e **mai registrata** in un owner, sopravvissuta solo dentro un documento di test (walk-in dalla Home);
2. un protocollo di valutazione i cui casi **contraddicevano** il registro che il protocollo stesso indica come fonte ammessa;
3. uno stato (`WP-1`) affermato in modo **opposto** da due file dello stesso pacchetto, entrambi ufficiali;
4. una vista (`ROADMAP`) che dichiarava bloccato un lavoro che l'owner dà in corso;
5. un registro anti-overwrite **aggirato** dall'edit che avrebbe dovuto registrare.

Il tratto comune non è la distrazione di un agente. È che **le protezioni esistenti coprono la forma, non il contenuto**: `mss:status` e `validate:mss:views` garantiscono che una vista sia rigenerata dal suo owner, ma non leggono la prosa umana attorno ai marcatori, dove vivono quattro dei cinque casi qui sopra. E nessun controllo verifica che una decisione detta in chat finisca in un registro: quel passaggio dipende oggi dal fatto che qualcuno se lo ricordi.

È lo stesso meccanismo già osservato il 26-08 sull'asse Persona: ciò che accade solo se Matteo lo ripete non è una regola, è un promemoria.

**Non ho tentato una soluzione in questa seduta**, perché il problema attraversa owner, generatore, contratto di chiusura e vocabolario — cioè richiede un mandato dedicato, non una correzione di passaggio. Matteo ha deciso di aprire una chat senior specifica per analizzarlo a fondo. Materiale di partenza per quella chat: i tredici finding di questa Fase 0, i cinque casi qui elencati e la forense del 26-08 (0 su 438 annotazioni verificate da terzi, asse Persona vuoto in 55 file di giudizi su 56).

## 6. Direzione concordata per il test

La calibrazione `AM-C0` viene divisa in due corsie, perché mescolava due domande con costi molto diversi.

**Corsia A — l'agente va a cercare?** Retrospettiva, non richiede la chiave di Matteo. Si usa `git worktree` per aprire una copia del repository congelata a un commit passato: l'agente vede app, report e skill system di quel giorno e non può vedere il futuro. Il confronto è con la decisione che Matteo ha realmente preso il giorno dopo, scritta nei commit successivi. Il repository offre 1152 commit dal 27-04-2026 e 534 report di sessione tracciati dal 12-05.

Sopra la copia congelata si sovrappone **solo lo strato di istradamento** di oggi (`.claude/CLAUDE.md`, `AGENTS.md`, regole Cursor, `_SKILL.md` di primo livello, schede decisione). **Mai** i file di contesto d'area né i report: quelli descrivono l'app di adesso e conterrebbero la risposta. Verificato sul caso dei limiti coperti: `APP_CONTEXT_SKILL.md`:72 dice dove guardare, il file puntato dice quale modello ha vinto.

Prima di congelare ogni caso si esegue un controllo di fuga sulle parole chiave, in tutto ciò che l'agente potrà leggere. ⚠️ Terzo canale da chiudere: la memoria del runtime. La memoria di Claude Code contiene già «MODELLO CAMBIATO 18-06-26: `daily_guest_limit` RIMOSSO»: un agente lanciato lì saprebbe la risposta a prescindere dal worktree.

**Corsia B — l'agente si ferma?** Prospettiva, richiede la chiave. Dopo l'allineamento di oggi resta davvero aperto **un solo** caso dei cinque: la regola di priorità fra cantieri (`C4`). Gli altri quattro hanno una fonte registrata e appartengono alla corsia A.

## 7. «Agente Matteo» — quattro capacità, una bloccata

Matteo ha precisato la destinazione: un agente che si avvia per riprendere il punto della situazione, comunica come piace a lui, e se è allineato prepara il prompt del lavoro successivo. Le capacità richieste sono quattro e hanno bisogni di prova diversi.

| Capacità | Verificabilità oggi |
|---|---|
| ricostruire il punto (cartolina) | alta: ogni riga ha una fonte o non ce l'ha. È `AM-01` |
| preparare il prompt e proporre la decisione | media: è ciò che misurano le due corsie. Criterio da aggiungere al protocollo: *il prompt prodotto è lanciabile così com'è?* |
| capire quali test ha fatto Matteo e replicarli | ⛔ **bloccata a monte** |
| ritmo, scadenze, incoraggiamento | parziale: manca il dato di durata |

**Perché la terza è bloccata.** Non per incapacità dell'agente: perché il collaudo di Matteo è invisibile al sistema. Una casella `[x]` scritta da lui è byte per byte identica a una scritta da un agente — è la ragione per cui il 26-08 è stata decisa la firma «— verificato da chi, quando». Finché due ore di prove manuali non lasciano traccia leggibile, nessun agente può imparare come Matteo collauda. Serve un canale d'ingresso minimo per lui: una riga per prova con esito, autore e data. È l'intervento a più alto rendimento del pilota.

**Sul quarto.** Funziona solo ancorato a fatti: la Bussola vieta la rassicurazione senza fatto, e Matteo ha già chiesto «indirizzami, non farmi scegliere». Sulle scadenze c'è un limite da dichiarare: **oggi il sistema non sa quanto ci mette Matteo**, perché non esiste il dato di apertura/chiusura dei cantieri. Un agente che proponesse scadenze adesso le inventerebbe. Il dato si raccoglie a costo quasi nullo e abilita i consigli dopo cinque o sei cantieri misurati. Confine da tenere: punti forti e deboli sì, se comportamenti osservati con fonte; interpretazioni psicologiche no — sono vietate dalle regole MSS e producono incoraggiamento generico, cioè inefficace.

## 8. Controlli eseguiti

| Controllo | Esito | Significato |
|---|---|---|
| `git status --short`, `git rev-parse HEAD`, `git branch --show-current` | pass | branch `env/test`, HEAD `aaeb7b9`, worktree con i soli tre file istruzione preesistenti |
| Fase 0, subagente read-only | 13 finding | 6 HIGH, 4 MEDIUM, 3 LOW; nessuna scrittura, nessun accesso a `docs/_lavoro/` |
| verifica indipendente dei finding 3, 4, 5 e 11 | confermati | `FOLLOW_UP.md`:117 e :121, `grep WalkInModal src`, `MASTERPLAN`:148-149 contro `HANDOFF`:69-70, `ROADMAP`:40 |
| verifica `service_layout_confirmed` nel codice | assente | presente solo in documenti; la rettifica non comporta rilavorazione |
| verifica del blocco reale delle prenotazioni | confermato | `create-booking/index.ts`:566 rifiuta con `SLOT_LIMIT` sulla capienza di fascia |
| ricerca dell'annotazione walk-in in tutti i `.md` | non registrata | unica traccia in un documento di test, non in un owner |
| `npm run generate:mss:views` | pass | cruscotto, roadmap, handoff, indice report |
| `npm run validate:docs` | pass | 194 file, 1014 path, 0 rotti |
| `npm run validate:mss:all` | pass, exit 0 | suite H-1, 73 controlli tool, viste e percorsi documentali verdi |
| `git diff --check` | pass | nessun errore di whitespace |

### 8-bis. Fail di procedura e ripresa

Nessun fail di procedura in questa seduta. Il primo `generate:mss:views` e il primo `validate:mss:all` sono passati al primo tentativo, perché le viste sono state rigenerate **prima** di eseguire i cancelli invece che dopo — l'ordine che le due sedute precedenti avevano scoperto a proprie spese.

## 9. Cosa NON è stato fatto

- Tempo 0 e intervista di Matteo: non avviati, perché l'intervista non è iniziata.
- Nessuna chiave sigillata, nessun freeze, nessun denominatore congelato.
- Nessun prompt Cursor e nessun prompt revisore Codex preparati.
- Nessun `git worktree` creato, nessun caso d'archivio congelato.
- Nessuna modifica ad app, database, codice, validator, hook o fixture.
- Nessun commit, nessun push.
- ~~La proposta di §3.3 non è stata scritta nel registro.~~ Matteo l'ha decisa a fine seduta ed è ora registrata in `FU-SERV-BADGE-CASCATA-1`, con la provenienza dichiarata (concepita dal senior, decisa da Matteo).
- Nessun file di contesto d'area è stato toccato: `ADMIN_SERVIZIO_CONTEXT.md` e `ADMIN_SETTINGS_CONTEXT.md` descrivono l'app **com'è**, e la cascata non è ancora implementata. Andranno aggiornati da chi esegue `P6`, non ora.

## 10. Prossimo passo

~~1. Matteo conferma o scarta la proposta §3.3.~~ **Fatto:** confermata e registrata.

Due chat sono state preparate a fine seduta, con un vincolo di sequenza fra loro:

1. **`Prompt-senior-enforcement-documentazione-obsoleta-27-08-26.md`** — orchestratore autonomo con subagenti, sul problema di §5. Lavora su un branch e un worktree propri.
2. **`Prompt-senior-orchestratore-test-agente-matteo-27-08-26.md`** — congela e conduce le corsie A e B della calibrazione.

⚠️ **Ordine obbligato:** la chat 2 deve **registrare il commit di riferimento** prima che la chat 1 modifichi istradamento, hook o contratto di chiusura. Il motivo non è di comodo: la calibrazione misura lo skill system **com'è oggi**, e se l'enforcement lo corregge prima del freeze, la baseline che vogliamo osservare non esiste più. Registrato il commit, le due chat non si contaminano.

3. Dopo il freeze: Tempo 0 e intervista limitata al solo caso `C4` rimasto scoperto.
4. Poi i due prompt Cursor e il prompt del revisore Codex.

⛔ Nessun esito di questa seduta cambia `SEP-5`, passa `SEP-G2`, apre `SEP-6` o autorizza il cutover `WP-1`.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura. Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.

✅ R1: tutti i file sono stati letti al commit `aaeb7b9` (branch `env/test`), che è rimasto HEAD per l'intera seduta. Mandato principale: `docs/Sessioni di lavoro/27-08-26/Prompt-senior-preparazione-test-allineamento-agente-matteo-27-08-26.md` (blob `6ae526d`). Fonti di contesto obbligatorie: `PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md` (blob `d27ed92`, letto prima delle mie modifiche), `Report-orientamento-mss-agente-matteo-26-08-26.md` (blob `c2bfc8b`), `Report-preparazione-calibrazione-allineamento-mss-27-08-26.md` (blob `bf34cb8`). Letti inoltre al medesimo HEAD: `PIANO_MEMORIA_OPERATIVA_AGENTE_MATTEO_V0.md`, `MASTERPLAN_V0.md`, `SENIOR_EVAL_SKILL.md`, `METASKILL_SYSTEM_SKILL.md`, `ROADMAP_V0.md`, `HANDOFF_SENIOR_V0.md`, `docs/FOLLOW_UP.md`, `docs/APP_CONTEXT_SKILL.md`, `docs/Comunicazione-Skill/OSSERVAZIONI.md`, `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md`, `src/features/booking/components/BookingCalendar.tsx`, `supabase/functions/create-booking/index.ts`. Fonte privata: solo `docs/_lavoro/Per matteo/Valutazione Personale/00_BUSSOLA_VALUTAZIONE.md` §0/§0bis, letta per il metodo di instradamento e non citata come prova; nessun contenuto personale riprodotto qui.

Messaggi di Matteo non contenuti in file del repo, verbatim: «sei agente senior orchestrator … raccogli le info e segue le istruzioni del prompt, poi ragiona a mente fredda su tutto il contesto e aiutami a struttare il lavoro nel modo migliore.»; «pensavo che potremmo anche utilizzare dei casi in archivio per simulare con documentazione creata apposta per il test un contesto di lavoro e vedere se agiscono come avrei fatto io. se un agent va a cercare le info perhcè sa di poterle raggiungere e se un altro invece non lo fa perchè skill system non glie lo suggerisce per esempio.»; «1. concordo. 2. si sono d'accordo,anche se non so come fai a dare nuovo MSS a vecchia repo. ma se sai come farlo ottimo. 3. si lancialo.»; «inoltre immaginiamo agente matteo come agente prepara prompt. è colui che avivo per riprendere il punto della situazione. … il finale di tutto è permettermi di avviare chat con agente matteo, che riprende le fila e imposta il lavoro.»; «ok niente fonti private ma dovrà poter accedere a info mie come noti da quello che ti dico, quindi sapere che esistono file a cui può accedere (file preparati prima da noi con solo le info necessarie al suo scopo).»; «la decisione che ho preso il 26 è stata : in card fascia oraria in fondo a pagina calendario, venogono mostrati totale coperti disponibili, pari al totale posti per i tavoli nelle sale. è corretto, ma se admin imposta limite fasce orarie, deve essere mostrato prima quello. se avevo deciso diversamente prima vorrei rivedere la mia decisione se è il caso, a me se sembra logica e corretta ma magari non sto considerando qualcosa.»; «per walkin ho fatto annotare un FU = non si contraddicono, ho completato fix in cui ho rimosso limite coperti wal-in, e poi ho annotato di volerlo togliere da home.»; «allinea pure tutta la documentazione. e annoterai nel tuo report che MSS ha problematiche ancora di documentazione obsoleta. da ormai troppo tempo. da dedicare chat con senior per analizzare a fondo il problema.»

❓ Q2 — Dati = diff reale? Confermi che §4, §8 e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza.

✅ R2: sì, riletto `git diff --stat` dopo la stesura. **10 file modificati, 42 inserimenti, 18 cancellazioni**, più 1 file non tracciato (questo report). Di quei 10, **tre non sono miei** e preesistevano alla seduta: `.claude/CLAUDE.md`, `.cursor/rules/comandi-base.mdc`, `AGENTS.md` — dichiarati come esclusi in §1 e da tenere fuori da un eventuale commit. I sette che ho toccato coincidono riga per riga con la tabella §4, dopo la correzione registrata in R3. Evidenza dei controlli di §8, rieseguiti: `npm run validate:mss:all` → exit `0`; `npm run validate:docs` → 194 file, 1014 path locali, 0 rotti, 26 voci in allowlist; `npm run generate:mss:views` → OK su cruscotto-matteo, roadmap-senior, handoff-senior, report-index; `git diff --check` → nessun errore (solo il warning CRLF→LF su `MSS-REPORT-INDEX.md`, che è una vista generata e non un errore di whitespace). I numeri d'archivio citati in §6 provengono da comando e non da un report: `git rev-list --count HEAD` = 1152, primo commit 27-04-2026; `find "docs/Sessioni di lavoro" -name "Report-*.md" | wc -l` = 534; primo commit che aggiunge report di sessione = 12-05-2026.

❓ Q3 — File correlati: la tabella §4 «File allineati» è completa e verificata? Se no, cosa manca.

✅ R3: **no alla prima stesura, sì adesso.** Rileggendo il diff per Q2 ho trovato che `docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md` (+1 riga) era coperto solo dalla voce generica «viste generate»: gli ho dato una riga esplicita, come impone la regola di non nascondere un file toccato dentro una categoria. Sul perimetro **skill**: l'unico file di skill modificato è `Senior-Eval-Pack/SENIOR_EVAL_SKILL.md` (frontmatter `name: senior-eval-pack`), §7, ed è già in tabella. Verificato che nessun'altra skill è stata toccata da me: `.claude/CLAUDE.md`, `AGENTS.md` e `.cursor/rules/comandi-base.mdc` risultano nel diff ma con modifiche antecedenti alla seduta, e nessun `_SKILL.md` d'area compare nel diff. Nessuna skill d'area andava aggiornata: la seduta non ha cambiato comportamento dell'app.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?

✅ R4: il mandato prevedeva cinque consegne e ne ho completata una e mezza. **Fatto:** Fase 0 con instradamento dei fix, e l'allineamento degli owner che la Fase 0 ha reso necessario prima di qualsiasi test. **Non fatto, elencato in §9:** Tempo 0 e intervista di Matteo; mappa delle fonti autorizzate; chiave sigillata e freeze con timestamp/digest; i due prompt Cursor; il prompt del revisore Codex; nessun `git worktree` e nessun caso d'archivio congelato. Il motivo non è tempo: i cinque casi contraddicevano gli owner, e congelare una chiave sopra fonti in conflitto avrebbe prodotto una calibrazione contaminata. **Tenuto fuori dal registro fino alla decisione:** la proposta di §3.3 sul secondo numero come contesto è rimasta fuori da `FOLLOW_UP.md` finché era una mia inferenza; Matteo l'ha decisa a fine seduta e solo allora è stata registrata, con la provenienza dichiarata. **Chiuso in coda:** capsula MSS, allineamento finale e commit, eseguiti dopo la richiesta di report finale.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?

✅ R5: attrito concreto e misurabile — per sapere se `WP-1` fosse apribile ho dovuto aprire e confrontare a mano quattro file (`MASTERPLAN` §6, `HANDOFF` §3, `ROADMAP` punto 9, `PLAN_V0` §4), perché tre di essi affermavano valori posseduti da un altro, e `npm run mss:status` dichiarava «viste allineate» mentre due di quelle affermazioni erano opposte. Proposta, senza costruire un tool nuovo: estendere il controllo anti-stale con una regola di livello grep — se un identificatore posseduto altrove (`WP-n`, `H-1.x`, `SEP-n`, `SEP-Gn`) compare come **asserzione di stato** in un file che non ne è owner, il cancello diventa rosso e chiede un puntatore. Copre esattamente i quattro casi di §5 che oggi vivono in prosa umana fuori dai marcatori, e non richiede né un nuovo registro né un nuovo comando.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?

✅ R6: contesto **giusto in quantità, sbagliato in ordine**. Il mandato elencava le fonti da leggere e le ho lette, ma nessuna rotta mi ha detto di aprire `CHIUSURA_SESSIONE.md` §11 *prima* di scrivere il report: ho dedotto la struttura dai report vicini, che è esattamente l'errore che questa seduta ha documentato in §5 — usare una copia al posto dell'owner. **L'hook di fine sessione è stato utile e ha colto un difetto reale**, non un falso positivo: mancava l'intera sezione 11. È anche la prova che l'enforcement macchina funziona dove esiste; il difetto di §5 riguarda i punti dove non esiste. Nota per il binario comunicazione: l'hook ha corretto la forma del report, ma nessun controllo avrebbe colto che tre casi di test contraddicevano un registro — quello l'ha trovato una lettura, e per ora solo una lettura può trovarlo.

## 12. Self-review del report

- **Triade MSS:** `validate:mss:all` exit 0, `validate:docs` verde, viste rigenerate prima dei cancelli. ⚠️ Manca la capsula: si appende alla chiusura, e fino ad allora il report non è validabile con `--require-capsule`.
- **Tabella §4:** incompleta alla prima stesura, corretta in R3 con la riga dell'indice generato. La correzione è registrata invece che silenziosa.
- **Separazione degli assi:** le decisioni di §3.1 e §3.2 sono attribuite a Matteo con verbatim in R1; l'analisi di §3.2 e la proposta di §3.3 sono marcate come del senior; i tredici finding di §2 sono di un subagente e i quattro decisivi sono stati riverificati da me con comando.
- **Nessun gate dichiarato:** nessuno stato WP cambiato, nessun gate passato, nessun commit.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a04084-0e53-7e64-998b-2f933e06cba6","correlation_id":"mss-cor-01a04084-0e53-7feb-9311-3166d875696b","segment_no":1,"created_at":"2026-08-27T01:59:51+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Meta senior orchestratore Fase 0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a04084-0e53-7e71-a843-168c97693f3f","capture_key":"mss-ses-01a04084-0e53-7e64-998b-2f933e06cba6/1/session_event/1","event":{"event_id":"mss-evt-01a04084-0e53-72d5-88e3-d4111f8d6d87","event_kind":"session_close","occurred_at":"2026-08-27T01:59:51+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"Meta senior orchestratore Fase 0","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD aaeb7b9; 14 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/27-08-26/Report-senior-fase0-allineamento-owner-e-documentazione-obsoleta-27-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/27-08-26/Report-senior-fase0-allineamento-owner-e-documentazione-obsoleta-27-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":"nessuno","subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":".claude/CLAUDE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"aaeb7b9","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":".cursor/rules/comandi-base.mdc","stable_anchor_or_event_id":"working tree","revision_or_hash":"aaeb7b9","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"AGENTS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"aaeb7b9","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/FOLLOW_UP.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"aaeb7b9","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"aaeb7b9","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/PIANO_MEMORIA_OPERATIVA_AGENTE_MATTEO_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"aaeb7b9","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"aaeb7b9","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"aaeb7b9","sensitivity":"internal"},{"ref_id":"source-git-9","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"aaeb7b9","sensitivity":"internal"},{"ref_id":"source-git-10","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"aaeb7b9","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a04084-0e53-7e64-998b-2f933e06cba6","correlation_id":"mss-cor-01a04084-0e53-7feb-9311-3166d875696b","segment_no":1,"created_at":"2026-08-27T01:59:51+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Meta senior orchestratore Fase 0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a04084-0e53-786f-948d-68d0c1f10801","capture_key":"mss-ses-01a04084-0e53-7e64-998b-2f933e06cba6/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a04084-0e53-77d1-b6c4-189e3e942351","axis":"persona","subject_record_ids":["mss-rec-01a04084-0e53-7e71-a843-168c97693f3f"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"Meta senior orchestratore Fase 0","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a04084-0e53-7e64-998b-2f933e06cba6","correlation_id":"mss-cor-01a04084-0e53-7feb-9311-3166d875696b","segment_no":1,"created_at":"2026-08-27T01:59:51+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Meta senior orchestratore Fase 0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a04084-0e53-7492-b441-ab8e22001c90","capture_key":"mss-ses-01a04084-0e53-7e64-998b-2f933e06cba6/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a04084-0e53-7910-9b45-7679ae09d41f","axis":"sistema","subject_record_ids":["mss-rec-01a04084-0e53-7e71-a843-168c97693f3f"],"delta":"modificato","assertions":[{"rule_id_version":"AM-C0@0.1.1","trigger_event":"Prova di solidita in Fase 0: tre dei cinque casi di AM-C0 contraddicevano docs/FOLLOW_UP.md, e due file del pacchetto affermavano stati opposti su WP-1 e H-1.3.","decision_or_output_changed":"Decisioni di prodotto rimesse nel loro owner con rettifica append-only; protocollo corretto per rispecchiarle; asserzioni di stato non possedute sostituite da puntatori; aggiunti gli elementi di freeze mancanti e la distinzione fra chiave di caso e verdetto atteso.","G":1,"O":1,"E":0}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"Meta senior orchestratore Fase 0","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a04084-0e53-7e64-998b-2f933e06cba6","correlation_id":"mss-cor-01a04084-0e53-7feb-9311-3166d875696b","segment_no":1,"created_at":"2026-08-27T01:59:51+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Meta senior orchestratore Fase 0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a04084-0e53-7e93-9caf-895dd3bf44de","capture_key":"mss-ses-01a04084-0e53-7e64-998b-2f933e06cba6/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a04084-0e53-7d21-9553-0ff7c56f1204","axis":"output","subject_record_ids":["mss-rec-01a04084-0e53-7e71-a843-168c97693f3f"],"delta":"creato","assertions":[{"output_id":"report-senior-fase0-allineamento-owner-27-08-26","primary_type":"governance","canonical_version":"docs/Sessioni di lavoro/27-08-26/Report-senior-fase0-allineamento-owner-e-documentazione-obsoleta-27-08-26.md","recipient":"Matteo, senior orchestratore enforcement, senior orchestratore test AM","problem_or_job":"Impedire che la calibrazione AM-C0 partisse sopra fonti che si contraddicono, e registrare il problema strutturale della documentazione obsoleta.","intended_use":"Base per le due chat senior preparate a fine seduta: enforcement e orchestrazione dei test.","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"Prompt senior preparazione test allineamento 27-08-2026","authored_by":"Senior Claude","verified_by":"non_osservato","acceptance_criterion":"Finding della Fase 0 verificati con comando prima di agire; decisioni registrate nel loro owner con rettifica append-only; cancelli MSS e documentali verdi; sezione 11 compilata.","verification_or_use_evidence":"validate:mss:all exit 0; validate:docs 194 file e 1014 path con 0 rotti; generate:mss:views OK; git diff --check pulito; verifiche mirate su FOLLOW_UP, BookingCalendar.tsx e create-booking/index.ts.","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md","privacy_release":"internal","support_files":["docs/FOLLOW_UP.md","docs/MetaSkillSystem/Senior-Eval-Pack/PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md","docs/Sessioni di lavoro/27-08-26/Prompt-senior-enforcement-documentazione-obsoleta-27-08-26.md","docs/Sessioni di lavoro/27-08-26/Prompt-senior-orchestratore-test-agente-matteo-27-08-26.md"],"relations_no_double_count":["Non esegue la calibrazione: nessun caso congelato, nessun esecutore Cursor, nessun revisore Codex.","Non risolve il problema della documentazione obsoleta: lo diagnostica e lo instrada a una chat dedicata.","Non passa SEP-G2 e non autorizza modifiche app."],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"Meta senior orchestratore Fase 0","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
