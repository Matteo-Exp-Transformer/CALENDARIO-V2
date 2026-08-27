# Dossier operativo — «Agente Matteo» v0

> **Cos'è.** Il foglio che un agente legge **in apertura** per sapere come si lavora qui: come parlare
> a Matteo, quali decisioni sono già prese, come si collauda, quali cantieri sono aperti. È
> l'attuazione del §3.3 di [`PIANO_MEMORIA_OPERATIVA_AGENTE_MATTEO_V0.md`](PIANO_MEMORIA_OPERATIVA_AGENTE_MATTEO_V0.md).
>
> **Cosa non è.** Non è un owner e non è un registro. Non possiede nessuno stato, nessun conteggio,
> nessuna decisione di prodotto: **le decisioni di prodotto vivono in [`docs/FOLLOW_UP.md`](../../FOLLOW_UP.md)**,
> lo stato del pacchetto in [`MASTERPLAN_V0.md`](MASTERPLAN_V0.md), lo stato MSS in
> [`PLAN_V0.md`](../PLAN_V0.md). Qui ci sono solo puntatori e la riga minima che serve ad agire.
>
> **Regime:** interno al repository, versionato. **Non** sotto `docs/_lavoro/`: un agente che lavora
> in un worktree congelato deve poterlo leggere, e `_lavoro/` è fuori da git. Per la stessa ragione qui
> non entra nulla di personale: niente ipotesi psicologiche, niente materiale recruiter, niente dati
> sensibili. Se una riga avesse bisogno di una fonte privata, la riga non si scrive.

## Le due regole che tengono in piedi questo file

1. **Puntatori, non copie.** Ogni riga dice *dove* sta la verità. Se copi un valore qui, fra una
   settimana questo file mente e nessun controllo se ne accorge — è il difetto che il MetaSkillSystem
   sta studiando ([Report enforcement 27-08-26](../../Sessioni%20di%20lavoro/27-08-26/Report-senior-fase0-allineamento-owner-e-documentazione-obsoleta-27-08-26.md) §5).
2. **Ogni riga ha una fonte osservata.** Non «Matteo preferisce X» per impressione: la colonna fonte
   indica il documento e la data in cui il comportamento è stato *visto*. Una riga senza fonte non
   entra, nemmeno se sembra vera.

---

## 1. Come Matteo vuole essere parlato

> Fonte primaria del comportamento: [`COMUNICAZIONE_UTENTE_SKILL.md`](../../COMUNICAZIONE_UTENTE_SKILL.md).
> Fonte dei dati osservati: [`Comunicazione-Skill/OSSERVAZIONI.md`](../../Comunicazione-Skill/OSSERVAZIONI.md).
> Qui sotto solo ciò che cambia il modo di scrivere una risposta.

| Regola | Come si riconosce che l'hai rispettata | Fonte osservata |
|---|---|---|
| **Prima la scena concreta, poi le sigle.** Chi riceve cosa, cosa fa, cosa si guarda. I codici del sistema vengono dopo, e nessuna sigla resta senza spiegazione. | Un lettore che non conosce il progetto capisce la prima frase | `OSSERVAZIONI.md` § 27-08-26 (feedback verbatim di Matteo: «questo tipo di output mi piace molto… mi fa capire come approfondire il discorso per scegliere bene») |
| **La prima frase è autosufficiente:** elemento → intervento → risultato verificabile. | Se tagli tutto il resto, la prima frase regge da sola | `COMUNICAZIONE_UTENTE_SKILL.md`; `.claude/CLAUDE.md` § Salvaguardie |
| **Parla per schermate e flussi,** non per nomi-file isolati. Mario (ristoratore), Anna (cliente). | Compaiono pagine e pulsanti, non solo path | `OSSERVAZIONI.md` § «Spiegazioni date e formato che ha funzionato» |
| **Indirizzalo, non fargli scegliere fra griglie.** Massimo 1–3 problemi per volta; una raccomandazione motivata, non un menù A/B/C/D. | C'è una proposta con un «perché», non un elenco di opzioni pari | `OSSERVAZIONI.md` § 25-08-26 («basta sigle / griglie A-B / 40 paragrafi») e § 26-08-26 sera |
| **Le domande per lui stanno in una sezione «Domande per te»,** in linguaggio d'app (cosa fare, che effetto ha), separate dal piano tecnico. | Le domande non sono mescolate ai criteri di accettazione | `OSSERVAZIONI.md` § 25-08-26 (correzione richiesta esplicitamente) |
| **Causa → effetto → soluzione.** | Il messaggio spiega perché succede, non solo cosa fare | `Report enforcement 27-08-26` § 6 |
| **Niente rassicurazione senza fatto.** Un incoraggiamento vale solo se ancorato a un comportamento osservato con fonte. | Ogni giudizio positivo porta un fatto datato | `PIANO_MEMORIA_OPERATIVA…` §3.4; Bussola §0bis (privata, non citabile come prova) |
| **Vietato dichiarare debiti per sbloccare.** «Tutto chiuso prima di proseguire» è una richiesta esplicita. | Non esistono «lo sistemiamo dopo» usati come lasciapassare | `OSSERVAZIONI.md` § 25-08-26 |

⛔ **Confine.** Punti forti e deboli sì, se sono comportamenti osservati con fonte. Interpretazioni
psicologiche no: sono vietate dalle regole MSS e producono incoraggiamento generico, cioè inefficace
([Report Fase 0 27-08-26](../../Sessioni%20di%20lavoro/27-08-26/Report-senior-fase0-allineamento-owner-e-documentazione-obsoleta-27-08-26.md) §7).

---

## 2. Come Matteo collauda — e il limite da dichiarare

> Owner della checklist: [`Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md`](../../Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md).
> Owner del setup di test: [`Testing-Skill/TESTING_SKILL.md`](../../Testing-Skill/TESTING_SKILL.md).

| Cosa sapere | Dove sta |
|---|---|
| Il collaudo manuale è una checklist per blocchi, con account, password e sala dedicata; le prove sono descritte come **click → atteso**, non come asserzioni di test | `COLLAUDO_MANUALE_OBBLIGATORIO.md` §0 e blocchi |
| Matteo esegue **di persona** le prove e le annota; nella tornata del 26-08 ha eseguito 26 prove e 3 ritest e ha trovato 7 difetti reali | `OSSERVAZIONI.md` § 26-08-26 sera (dato grezzo, nessuna promozione) |
| Le sue note stanno **dentro la checklist**, in corsivo sotto la prova: sono richieste di prodotto, non commenti | `COLLAUDO_MANUALE_OBBLIGATORIO.md` (es. note T10, T11, T12, T15) |
| Prima di PROD / migrazioni / deploy ci si ferma e si chiede conferma | `OSSERVAZIONI.md` § «Procedure ripetute richieste»; `.claude/CLAUDE.md` § sicurezza PROD |
| Ogni prova superata porta la firma `— verificato da <chi>, <data>` | decisione 26-08-26, `OSSERVAZIONI.md` § 26-08-26 sera |

⛔ **Limite dichiarato, da non aggirare.** Una casella `[x]` scritta da Matteo è **byte per byte
identica** a una scritta da un agente. Finché due ore di collaudo manuale non lasciano una traccia
attribuita e leggibile, **nessun agente può imparare come Matteo collauda**: la capacità «capire quali
test ha fatto e replicarli» è bloccata a monte, e va dichiarata `non_osservabile`, non stimata.
Fonte: [Report Fase 0 27-08-26](../../Sessioni%20di%20lavoro/27-08-26/Report-senior-fase0-allineamento-owner-e-documentazione-obsoleta-27-08-26.md) §7.

⛔ **Secondo limite.** Il sistema **non sa quanto ci mette Matteo**: non esiste il dato di
apertura/chiusura dei cantieri. Un agente che proponesse scadenze oggi le inventerebbe. Stessa fonte, §7.

---

## 3. Decisioni riusabili — schede

> ⚠️ **Queste schede non sostituiscono l'owner.** Ogni scheda ha una riga sola e un puntatore:
> per condizioni, eccezioni e testo integrale si apre `docs/FOLLOW_UP.md` alla voce indicata.
> Campi obbligatori per scheda: `id` · `bivio` · `scelta` · `data` · `stato` · `owner` · `azione agente`
> (schema in [`PIANO_MEMORIA_OPERATIVA_AGENTE_MATTEO_V0.md`](PIANO_MEMORIA_OPERATIVA_AGENTE_MATTEO_V0.md) §3.3).

| id | Il bivio | La scelta di Matteo | Data | Stato | Owner | Azione agente |
|---|---|---|---|---|---|---|
| `D-WALKIN-HOME` | Dove vive l'ingresso «Aggiungi walk-in» | Esce dalla Home e vive nella pagina Servizio. ⚠️ In Servizio **non esiste**: va creato, non spostato | 26-08-26, riconf. 27-08 | attiva | `FU-SERV-WALK-IN-HOME-1` | `chiede` — da dove si apre (piantina / lista / barra azioni) non è deciso |
| `D-WALKIN-LIMITE` | Il walk-in ha un limite coperti suo? | No: rimosso. Resta la sola capienza di fascia, con avviso e conferma al secondo click | 26-08-26 | attiva | `FU-SERV-WALK-IN-LIMIT-1` | `applica` |
| `D-BADGE-CASCATA` | Quale numero mostra il Calendario | **Vince il numero che blocca davvero**: (1) limite coperti di fascia se impostato → (2) somma posti fisici → (3) nessun numero + messaggio. Cascata unica per badge e card | 27-08-26 (supera la 06-08) | attiva, **supera** la precedente | `FU-SERV-BADGE-CASCATA-1` | `applica`. ⚠️ Chi cita la 06-08 cita una fonte **barrata** |
| `D-TURNO-SALA` | Eliminare una sala consuma il turno? | **Vince il tavolo**: eliminare una sala non deve consumare il turno | 06-08-26 | attiva | `FU-SERV-TURNO-SALA-1` | `applica` |
| `D-RIASSEGNA` | Prenotazione multi-tavolo che perde un tavolo | Torna **intera** fra le «da assegnare» — scelta deliberata, non un difetto da correggere | 26-08-26 | attiva | `FU-SERV-RIASSEGNA-PARZIALE-1` | `applica`; ⛔ non aprire l'evoluzione senza decisione esplicita |
| `D-FASCE-V3` | Priorità dei messaggi di validazione fasce | Con nome duplicato + sovrapposizione prevale il **nome duplicato**; per un overlap reale il messaggio nomina entrambe le fasce | 26-08-26 | attiva | `FU-SERV-FASCE-V3-1` | `applica` |
| `D-MANOPOLE` | Soglia ritardo, richiamo fine turno, durata | Durata base esposta dalla console (26-08). **Soglia ritardo e richiamo fine turno restano non modificabili dall'app** | 26-08-26 | parziale | `FU-SERV-MANOPOLE-CONSOLE-1` | `applica` per la durata; `chiede` per le altre due |
| `D-SFONDO-PRENOTA` | Sfondo della Pagina Prenota | Sfondo **full-page unico bloccato** (`fixed` + cover). ⛔ Non ripristinare il task tile `repeat-y` | 31-05-26 | attiva | `FU-021` (annullato, ma la decisione resta) | `applica` |
| `D-ATOMICITA` | Quante scritture non atomiche si chiudono | Solo le 2 più rischiose; le altre 6 restano censite | 06-08-26 | attiva | `FU-ALL-ATOMICITA-1` | `applica` |
| `D-PROD-ROLLOUT` | Quando si va in produzione | Solo dopo collaudo umano verde, con autorizzazione esplicita a parte | 06-08-26 | attiva | `PIANO_MULTIAGENT_LAVORI_APERTI.md` §1 (D-3) | `applica`; ⛔ nessuna autorizzazione implicita |

> ⚠️ **Regola di consegna datata.** Quando questo dossier viene consegnato a un agente che lavora su
> una copia congelata del repository, si consegnano **soltanto le schede con data ≤ data del
> congelamento**. Una scheda più recente sarebbe una risposta arrivata dal futuro: contaminerebbe la
> prova invece di misurarla. Le schede sottratte si registrano come *materiale escluso* del caso.
> Le regole di metodo (§1, §2, §4, §5) non hanno questo vincolo: non contengono decisioni di prodotto.

---

## 4. Cantieri aperti — dove chiedere, non cosa vale

> Nessun conteggio qui: i numeri si muovono e questo file non li possiede.

| Cantiere | Owner dello stato | Come si legge |
|---|---|---|
| MetaSkillSystem (`SYS-1`, work-package, gate) | [`docs/MetaSkillSystem/PLAN_V0.md`](../PLAN_V0.md) §4-bis / §4-ter | `npm run mss:status` · `npm run mss:query` |
| Senior Eval Pack (`SEP-*`, gate `SEP-G*`) | [`MASTERPLAN_V0.md`](MASTERPLAN_V0.md) §4 | mai da `ROADMAP` o `HANDOFF`: sono viste |
| Calibrazione `AM-C0` (disegno) | [`PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md`](PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md) | il disegno; non lo stato del pacchetto |
| Decisioni e lavori di prodotto | [`docs/FOLLOW_UP.md`](../../FOLLOW_UP.md) | è **l'owner unico** delle decisioni di prodotto |
| Collaudo manuale Servizio | [`COLLAUDO_MANUALE_OBBLIGATORIO.md`](../../Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md) | contiene richieste di prodotto nelle note, non solo prove |
| Aree dell'app | [`docs/APP_CONTEXT_SKILL.md`](../../APP_CONTEXT_SKILL.md) §0 | tabella «il task riguarda X → carica skill Y» |
| Ambienti DB | [`docs/APP_CONTEXT_SKILL.md`](../../APP_CONTEXT_SKILL.md) §1b + [`DB_SKILL.md`](../../Database-Skill/DB_SKILL.md) | TEST `docnnernvp` · PROD `rwuxgvld` |

---

## 5. Regole di metodo — quando fermarsi, come citare

> Queste righe valgono in ogni condizione e a ogni data: non sono decisioni di prodotto.

| Situazione | Cosa fa l'agente |
|---|---|
| **Due meccanismi si sovrappongono** e nessun owner dice quale vince | STOP + domanda minima. Non si sceglie «quello che sembra più moderno»: scegliere è una decisione di prodotto |
| **Una fonte è barrata o superata** da una più recente | Si cita **la più recente** e si dichiara esplicitamente che supera la precedente. Citare la vecchia senza dirlo è `fonte non pertinente` |
| **La documentazione dice una cosa e il codice ne dice un'altra** | Si dichiarano entrambe con il riferimento, si indica quale si è verificata e si chiede. Non si sceglie in silenzio |
| **Una decisione manca del tutto** | STOP. ⛔ Non si deduce da un caso «simile»: serve stessa decisione, stessa area/effetto, condizioni compatibili (`PIANO_MEMORIA_OPERATIVA…` §3.4) |
| **Una decisione esiste ma la sua esecuzione non è definita** | Si applica la decisione e si chiede **solo** il pezzo mancante (esempio: `D-WALKIN-HOME` — il «dove» è deciso, il «da dove si apre» no) |
| **Che forma ha una citazione valida** | Owner + sezione/ancora + revisione, tale che un terzo ritrovi la fonte e controlli che sostenga davvero l'azione. Un link a una sintesi, una frase generica su Matteo o una fonte non ammessa valgono `fonte assente` (`PROTOCOLLO…` §3) |
| **Come si registra il superamento di una decisione** | Rettifica **append-only** nell'owner, che cita ciò che sostituisce e conserva il valore superato barrato. Non si riscrive la riga vecchia |
| **Ogni proposta o piano** | Contiene una riga `Perché agisco così:` con decisione/fonte e condizioni applicate. Se non è compilabile con una fonte ammessa → STOP |

| **Da quale lavoro si parte** quando hai davanti un fix piccolo, un progetto grande e follow-up aperti | **Un cantiere grande alla volta.** Un fix piccolo non apre un cantiere: entra solo dentro un'ondata già aperta. Un follow-up non diventa cantiere finché non ha una decisione registrata — se manca, si chiede, non si inizia. Owner: `FU-METODO-PRIORITA-1` |

> ✅ **Sezione chiusa il 27-08-2026.** Le otto righe qui sopra non sono più «derivate dagli owner»: sono
> **regole decise da Matteo** e registrate in `docs/FOLLOW_UP.md` — `FU-METODO-PRIORITA-1`,
> `FU-METODO-FONTE-RECENTE-1`, `FU-METODO-RIUSO-1`, `FU-METODO-CITAZIONE-1`,
> `FU-METODO-SUPERAMENTO-1`. Quelle righe sono l'owner; questa tabella è la vista.

---

## 6. Manutenzione

Questo file si aggiorna **quando una fonte cambia**, non a scadenza. Una riga si tocca solo per:
aggiungere una scheda con owner e data, marcare una scheda `superata` con il puntatore alla rettifica,
o correggere un puntatore rotto. ⛔ Non si aggiunge una riga «per completezza»: senza fonte osservata
non entra. `npm run validate:docs` verifica che i puntatori esistano; non può verificare che siano veri.
