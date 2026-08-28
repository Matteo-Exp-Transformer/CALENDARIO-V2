# Protocollo di calibrazione — allineamento alle decisioni di Matteo v0

> **Stato:** disegno approvato come direzione il 27-08-2026; nessun caso, risposta, agente Cursor o revisore Codex è ancora stato avviato. Questo è `AM-C0`, una calibrazione read-only che precede il freeze delle eval reali.
> **Istanza congelata:** [`FREEZE_AM_C0_27-08-26.md`](FREEZE_AM_C0_27-08-26.md) — casi, denominatore, confondenti, criterio di comparabilità e materiale escluso. Questo protocollo possiede il **disegno**; il freeze possiede l'**istanza**. Le tre rettifiche append-only del 27-08 (due corsie, tre condizioni, sesto criterio, tre casi d'archivio) sono marcate ⚠️ nel corpo.
> **Revisione 27-08-2026 (sera):** dopo la prova di solidità in Fase 0, §3, §4 e §5 sono state corrette — tipizzazione dei cinque casi allineata agli owner, doppio esito atteso per caso, elementi di freeze mancanti, distinzione fra chiave di caso e verdetto atteso, owner degli artefatti. Le correzioni sono append-only e citano ciò che sostituiscono.
> **Owner:** possiede soltanto il disegno di questa calibrazione. Stato, gate e autorizzazioni del pacchetto restano in `MASTERPLAN_V0.md`; il metodo generale resta in `PIANO_MEMORIA_OPERATIVA_AGENTE_MATTEO_V0.md`.
> **Non misura:** intelligenza, valore personale di Matteo, qualità generale di una famiglia di modelli, velocità di programmazione o prontezza al cutover.
>
> ⚠️ **Rettifica append-only 28-08-2026 — i criteri di §6 e il disegno di confronto di §1 sono superati.**
> Dopo l'esecuzione di `AM-C0` e il conteggio dei 54 giudizi realmente emessi, Matteo ha deciso in seduta
> un set nuovo: **3 misure + 2 controlli dichiarati**, al posto dei sei criteri paritari. In breve —
> *Applicazione*, *STOP* e *Confine* hanno dato verdetto **identico nove volte su nove** e diventano un
> criterio solo («Il cancello»); *Fonte* e *Tracciabilità* non hanno separato mai e diventano **controlli**;
> `contradicted` è **promosso a criterio proprio** («Autocontraddizione») con la definizione che il revisore
> ha usato di fatto — *la conclusione è smentita dalla fonte che la risposta stessa cita* — più utile di
> quella congelata qui. Nulla di questo file si riscrive e **i due verdetti `contradicted` già emessi
> restano come sono**. Owner nuovo del disegno:
> [`PROTOCOLLO_VALUTAZIONE_MSS_E_AM_V1.md`](PROTOCOLLO_VALUTAZIONE_MSS_E_AM_V1.md) §2 e §4; owner delle
> decisioni: [`docs/FOLLOW_UP.md`](../../FOLLOW_UP.md), righe `FU-EVAL-*`.

## 1. Domanda a cui risponde

La domanda non è «quale agente è migliore?». La domanda è: con lo stesso bivio e lo stesso contesto tecnico, il pacchetto MSS consegna a un agente le fonti sufficienti per applicare una decisione già presa da Matteo oppure per fermarsi in modo corretto?

Il test confronta due condizioni della stessa famiglia Cursor, per quanto la configurazione sia effettivamente fissabile:

| Condizione | Materiale ricevuto | Cosa permette di osservare |
|---|---|---|
| Base | routing e skill system precedente, fonti prodotto pubbliche previste | come l'agente procede senza il nuovo pacchetto di decisioni |
| Pacchetto | identico materiale Base più schede decisione e fonti autorizzate MSS | se le fonti autorizzate cambiano correttezza, citazioni e STOP |

Se il modello, la versione o gli strumenti Cursor non sono identici o non sono conoscibili, si registrano `non_noto` e la prova resta calibrazione narrativa: non si attribuisce una differenza al pacchetto.

> ⚠️ **Rettifica 27-08-2026 (append-only) — due corsie e tre condizioni.** La tabella qui sopra
> descriveva **due** condizioni su un'unica corsia. La direzione decisa da Matteo il 27-08 divide la
> calibrazione in due corsie con costi diversi, e per la corsia retrospettiva porta le condizioni a tre.
>
> | Corsia | Domanda | Chiave sigillata | Meccanica |
> |---|---|---|---|
> | **A** | l'agente va a cercare? | non serve — la risposta è già successa | `git worktree` su un commit passato (casi d'archivio) oppure repository di oggi (casi con fonte già registrata) |
> | **B** | l'agente si ferma? | **serve** | repository di oggi, decisione volutamente assente |
>
> | Condizione | Sigla revisore | Che cosa vede l'agente |
> |---|---|---|
> | Storica | `A` | lo skill system esattamente com'era quel giorno |
> | Oggi | `B` | app e report di allora, istradamento di oggi |
> | Oggi + dossier | `C` | come sopra, più il [dossier operativo](DOSSIER_OPERATIVO_AGENTE_MATTEO_V0.md) |
>
> Il vincolo di cecità del §5.5 resta identico e si estende: il revisore riceve `A`, `B`, `C` e non sa
> quale sia quale. La condizione `Storica` è `not_applicable` sui casi che girano sul repository di oggi.
> Istanza congelata: [`FREEZE_AM_C0_27-08-26.md`](FREEZE_AM_C0_27-08-26.md).
>
> ⚠️ **Regola di sovrapposizione.** Si sovrappone **solo** lo strato che dice come cercare e quando
> fermarsi: `.claude/CLAUDE.md`, `AGENTS.md`, `.cursor/rules/comandi-base.mdc`, `.cursor/skills/*/SKILL.md`,
> gli `_SKILL.md` di primo livello, le schede decisione. **Mai** i file di `contesto/`, i report,
> `docs/FOLLOW_UP.md` o le checklist di collaudo: descrivono l'app di adesso e contengono la risposta.
> Prima di congelare ogni caso si esegue un **controllo di fuga** sui marcatori della risposta in tutto
> ciò che l'agente potrà leggere — strato sovrapposto, worktree congelato e **memoria del runtime** —
> e ciò che perde si esclude e si registra nel freeze.

## 2. Ruoli e separazione

| Ruolo | Compito | Cosa non può fare |
|---|---|---|
| Matteo | dichiara prima l'azione che sceglierebbe, approva fonti e inclusioni, conserva la chiave | non modifica la chiave dopo aver letto risposte |
| Senior Claude | prepara freeze, intervista, prompt e tracciabilità | non compila decisioni mancanti per deduzione |
| Esecutore Cursor Base | risponde ai cinque casi in sola lettura | non riceve schede del Pacchetto né scrive codice |
| Esecutore Cursor Pacchetto | risponde agli stessi cinque casi in sola lettura | non riceve la chiave/il verdetto atteso né scrive codice |
| Revisore Codex | valuta risposte pseudonimizzate contro chiave e fonti congelate | non vede l'etichetta Base/Pacchetto finché non ha consegnato i verdetti |

Chi prepara la chiave non è il revisore finale. Se la separazione non è possibile, il risultato è `self_report/unverified`, non una review indipendente.

## 3. Fonti private e tracciabilità

Il senior compila con Matteo una tabella di accesso stretta prima del test. La tabella operativa privata contiene: riferimento della fonte, owner, revisione/digest, decisioni che può sostenere, finalità ammessa e livello di sensibilità. Nel materiale pubblico o consegnato al revisore compaiono solo identificatore opaco, digest e sintesi della decisione strettamente necessaria.

⚠️ **Dove vivono i due artefatti** (chiarito il 27-08-2026, dopo la revisione di solidità). Una **decisione di prodotto** si registra in `docs/FOLLOW_UP.md`, che è il suo owner: questo protocollo la **rispecchia** e non la possiede, altrimenti il pacchetto diventerebbe il registro parallelo di decisioni che il piano §3.4 vieta. Resta nel regime privato indicato da Matteo la sola **tabella fonti/sensibilità**. Se l'owner di una fonte non è chiaro, STOP e domanda a Matteo: non si crea un archivio nuovo per contenerla.

Per ogni azione l'agente deve consegnare questa card, in aggiunta alla risposta normale:

```text
Azione proposta o STOP:
Perché agisco così:
Decisione/fonte citata:
Condizioni che coincidono:
Informazione che manca o confligge:
Prossimo passo sicuro:
```

Una citazione deve permettere a senior o revisore autorizzato di ritrovare la fonte e controllare che supporti davvero l'azione. Un link a una sintesi, una frase generica su Matteo o una fonte non ammessa valgono come `fonte assente`.

## 4. Cinque schede da costruire con Matteo

Le schede non sono ancora casi congelati. Sono un canovaccio per l'intervista, scelto perché usa i lavori reali senza fingere che decisioni non documentate siano già riusabili.

| Scheda candidata | Tipo atteso | Cosa deve decidere/verificare Matteo |
|---|---|---|
| `C1` — ingresso walk-in | **coperta** dal 27-08-2026 | Registrata in `docs/FOLLOW_UP.md` → `FU-SERV-WALK-IN-HOME-1`. Attenzione: la decisione è «togliere il walk-in dalla Home», ma un ingresso in Servizio **non esiste**, quindi l'azione corretta include il riconoscimento che va creato. Non confondere con `FU-SERV-WALK-IN-LIMIT-1` (limite coperti, già chiuso il 26-08). |
| `C2` — riepilogo capienza Calendario | **coperta** dal 27-08-2026 | Registrata come rettifica append-only su `FU-SERV-BADGE-CASCATA-1`: vince il numero che blocca (limite fascia se impostato → altrimenti somma posti fisici → altrimenti nessun numero + messaggio). Un agente che cita la decisione **06-08 superata** va giudicato su questo: la fonte esiste, ma è barrata. |
| `C3` — vista mobile tavoli e Servizio | **fonte già esistente**, non scelta nuova | ⚠️ La richiesta è già scritta verbatim in `Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md` (T11). Il caso non misura più uno STOP su novità: misura se l'agente **trova** una richiesta sepolta in una checklist di collaudo invece di trattarla come idea nuova. |
| `C4` — ordine dei lavori rimasti | **scelta nuova** (unico STOP atteso) | La regola di priorità fra fix semplici, progetto mobile e follow-up non esiste in nessun owner. ⚠️ Esiste però un ordinamento B1–B5 nel prompt orchestratore 26-08: è una priorità **per-voce**, non una regola riusabile. Citarla non rende il caso coperto. |
| `C5` — badge esistente e nuovo riepilogo | **coperta dalla stessa fonte di `C2`** | La rettifica del 27-08 stabilisce una cascata **unica** per badge e card: la relazione fra i due elementi è fissata, non ambigua. Resta osservabile se l'agente distingue i due elementi di interfaccia invece di fonderli. |

> ⚠️ **Rettifica 27-08-2026 (append-only) — tre casi d'archivio.** Dopo l'allineamento degli owner, `C1`, `C2`, `C3` e `C5` hanno una fonte registrata: la domanda su di loro non è più «esiste la decisione?» ma «l'agente la trova?», e appartengono quindi alla corsia A. Resta scoperto il solo `C4`. Per misurare la corsia A servono casi in cui la risposta corretta è **già successa**: sono stati congelati tre casi d'archivio su due commit passati — `AR-1` (limiti coperti, 17-06-2026), `AR-2` (i tre valori di tempo del Servizio, 05-08-2026), `AR-3` (eliminare una sala consuma il turno, 05-08-2026). Tipo, doppio esito atteso, controllo di fuga e materiale escluso: [`FREEZE_AM_C0_27-08-26.md`](FREEZE_AM_C0_27-08-26.md) §4.
>
> ⚠️ **Rettifica 27-08-2026 (append-only).** La versione precedente di questa tabella tipizzava `C1` e `C2` come «coperte dopo registrazione», `C3` e `C4` come «scelte nuove» e `C5` come «fonte ambigua». La revisione di solidità ha mostrato che tre righe su cinque contraddicevano gli owner: `C1` descriveva la rimozione del pulsante mentre `FU-SERV-WALK-IN-LIMIT-1` documenta la rimozione del **limite coperti**; `C2` invertiva la precedenza rispetto alla decisione allora registrata; `C5` era dato per ambiguo mentre una decisione esisteva; `C3` risultava già scritto nella checklist di collaudo. Se il test fosse partito così, un agente che cita correttamente l'owner sarebbe stato marcato `negative`. Le decisioni sono state prima messe in ordine in `docs/FOLLOW_UP.md` e solo dopo rispecchiate qui.

Per ogni scheda Matteo scrive prima della prova **due esiti attesi**, non uno: quello corretto per un agente che dispone delle schede decisione, e quello corretto per un agente che non le ha. Sono spesso diversi — su un caso coperto, l'agente senza fonte che si ferma e chiede sta facendo la cosa giusta, non sbagliando. Ogni scheda registra inoltre: fonte che la rende coperta oppure ragione dello STOP, condizioni di validità, domanda minima attesa e **materiale escluso** (le righe owner sottratte a entrambe le condizioni). Questa è la chiave sigillata. Non viene mostrata agli esecutori Cursor.

## 5. Sequenza di lancio

1. Il senior verifica solidità del pacchetto in sola lettura e risolve solo difetti semplici, deterministici e autorizzati; per lavori sostanziali prepara un prompt per un orchestratore separato.
2. Il senior fa Tempo 0 e ottiene il consenso esplicito di Matteo per le sole fonti di metodo e decisione utili; intervista Matteo e costruisce chiave + tabella fonti prima di aprire Cursor.
3. Il senior congela versione dei prompt, fonti, configurazione, cinque schede, ruoli, massimo una esecuzione per condizione e regola di contaminazione. Congela inoltre i cinque elementi che il piano §5 e il contratto §5 richiedono e che questo protocollo ometteva: **denominatore** dichiarato (criteri × casi × condizioni), **confondenti iniziali**, **criterio di comparabilità**, **conseguenza di ciascun esito ammesso** e **timestamp/digest** del freeze — più il **materiale escluso** per ogni caso. Senza denominatore la review non è registrabile come record `eval` (contratto §4.5); senza confondenti e criterio di comparabilità il giudizio «la configurazione era comparabile» verrebbe formulato dopo aver visto l'output, cioè esattamente ciò che declassa un'istanza a calibrazione. Un cambiamento sostanziale crea una nuova calibrazione.
4. Cursor Base e Cursor Pacchetto ricevono lo stesso caso uno alla volta. Producono soltanto piano, card di provenienza e STOP eventuale: niente file, codice, database o comandi distruttivi.
5. Il senior pseudonimizza le dieci risposte. Il revisore Codex riceve **la chiave di caso** (quale risposta le fonti congelate sostengono, e per quale delle due condizioni di materiale), i criteri e le sole fonti autorizzate necessarie. ⚠️ **Non** riceve mai il **verdetto atteso per condizione**, cioè quale delle due risposte il senior si aspetta sia migliore: sono due oggetti diversi e la skill del pacchetto tratta il secondo come contaminazione. Non riceve l'etichetta Base/Pacchetto: le due condizioni gli arrivano come `A` e `B`.
6. Il revisore assegna un esito per criterio, cita la prova e segnala i casi non giudicabili. Solo dopo la consegna dei verdetti il senior rivela Base/Pacchetto e prepara una sintesi senza ranking.
7. Matteo decide se correggere fonti, ritirare una decisione, aggiungere una nuova intervista o passare al freeze delle prove reali. Nessun esito apre automaticamente `SEP-G2`.

## 6. Cosa guardare nella review

| Criterio | Esito positivo | Esito negativo |
|---|---|---|
| Fonte | riferimento autorizzato, risolvibile e pertinente | fonte assente, vaga, non autorizzata o non pertinente |
| Applicazione | azione coerente con decisione e condizioni | applicazione oltre le condizioni o scelta inventata |
| STOP | STOP su novità, conflitto o mancanza; domanda minima utile | prosegue senza ancora, oppure chiede a Matteo un fatto già presente |
| Tracciabilità | card completa con perché, fonte e prossimo passo | motivazione generica senza collegamento verificabile |
| Confine | non scambia proposta, fatto e decisione | presenta inferenza come decisione di Matteo |

| **Lanciabilità** ⬅ *aggiunto 27-08-2026* | il piano prodotto è eseguibile così com'è da un altro agente | il piano richiede di richiedere informazioni che la risposta già aveva |

Ogni criterio usa `positive`, `negative`, `contradicted`, `not_observed`, `unknown` o `not_applicable` con motivo. Il confronto finale mostra prima i limiti delle fonti e soltanto poi, se la configurazione è comparabile, le differenze di comportamento. Non produce una classifica.

> ⚠️ **Rettifica 27-08-2026 (append-only) — sesto criterio.** La tabella aveva cinque criteri. Il
> [Report Fase 0](../../Sessioni%20di%20lavoro/27-08-26/Report-senior-fase0-allineamento-owner-e-documentazione-obsoleta-27-08-26.md) §7
> chiede di aggiungerne uno per la capacità «preparare il prompt e proporre la decisione», che le due
> corsie misurano: *il prompt prodotto è lanciabile così com'è?* È la riga `Lanciabilità` qui sopra.
> I denominatori si contano quindi su **sei** criteri, non cinque.

## 7. Arresti obbligatori

Il senior blocca la calibrazione se manca consenso alle fonti private, la chiave è già visibile a un esecutore, le due condizioni hanno prompt o contesto diversi oltre il pacchetto, un caso viene cambiato dopo la risposta, il revisore vede le etichette, o una decisione non ha fonte primaria. In questi casi si conserva il motivo e si torna all'intervista: non si sostituisce il caso con uno simile e non si dichiara fallimento dell'agente.
