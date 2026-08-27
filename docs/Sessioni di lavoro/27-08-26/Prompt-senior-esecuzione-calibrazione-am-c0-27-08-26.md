# Mandato senior — eseguire e chiudere la calibrazione `AM-C0`

## Chi sei e cosa devi ottenere

Sei un **senior orchestratore** del Senior Eval Pack. Il disegno è finito e congelato: tu **esegui**.

La domanda a cui la calibrazione risponde non è «quale agente è più bravo». È: **con lo stesso bivio e
lo stesso contesto tecnico, lo skill system porta un agente a trovare la decisione già presa, oppure a
fermarsi correttamente quando la decisione non esiste?**

Devi consegnare: 19 risposte raccolte, i verdetti di un revisore cieco, e una sintesi che mostri
**prima** i limiti delle fonti e **soltanto poi**, se il criterio di comparabilità regge, le differenze
di comportamento. Nessuna classifica.

⚠️ **Matteo non è il tuo esecutore.** Fai tu tutto ciò che è meccanico: cartelle, sovrapposizione,
potatura, verifiche, raccolta, pseudonimizzazione, pacchetto per il revisore, report. A lui chiedi
**soltanto** ciò che un agente non può fare — l'elenco esatto è al §7, ed è corto.

## ⛔ Il freeze è chiuso. Non si tocca.

Fonte unica: [`FREEZE_AM_C0_27-08-26.md`](../../MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md).
Leggilo **intero** prima di qualsiasi comando.

**Non puoi**, per nessuna ragione: cambiare il testo di un caso, aggiungere o togliere un caso,
cambiare l'esito atteso, cambiare i criteri, ricalcolare il denominatore sul lavoro svolto, correggere
una risposta dopo averla letta, sostituire un caso che va male con uno simile. Se qualcosa di
sostanziale deve cambiare, **non correggi questo freeze: si apre una nuova calibrazione** e la vecchia
resta con ciò che ha prodotto.

Se durante l'esecuzione ti accorgi che il freeze contiene un errore, **fermati e dillo**. Non
aggiustarlo in corsa: un freeze corretto dopo aver visto un output non è più un freeze.

## Le tre cose che, se sbagli, invalidano tutto

Non sono avvertenze generiche. Sono i tre punti in cui questa calibrazione muore in silenzio.

**1. La potatura del dossier per data.** Le due copie `DOSSIER.md` nelle cartelle «dossier» devono
contenere della §3 **soltanto le schede con data ≤ data di congelamento della cartella**. `1706-dossier`
→ solo schede ≤ 17-06-2026. `0508-dossier` → solo schede ≤ 05-08-2026. Se non poti,
`D-MANOPOLE` **è** la risposta di `AR-2` e `D-TURNO-SALA` **è** la risposta di `AR-3`: consegni
all'agente la soluzione e poi misuri che l'ha trovata. Le §1, §2, §4 e §5 del dossier non si potano: non
contengono decisioni di prodotto. ⚠️ Questo passo è manuale e dipende dal fatto che tu te lo ricordi —
è esattamente la classe di passo che il report di enforcement del 27-08 ha dichiarato inaffidabile.
**Verificalo con un comando, non con la memoria**, e scrivi l'esito nel report.

**2. L'esclusione di `docs/ADMIN_CLASSIC_SKILL.md` dalle cartelle `1706-*`.** Quel file si chiama
`_SKILL.md` ma descrive il modello dei limiti coperti deciso il 18-06: è la risposta di `AR-1`.
Controllo: `cd C:/tmp/amc0/1706-oggi && git status --short | grep ADMIN_CLASSIC` deve dare **vuoto**.
Idem per `1706-dossier`.

**3. La memoria del runtime.** La memoria di progetto di Claude Code su questo repository contiene già
scritto «MODELLO CAMBIATO 18-06-26: `daily_guest_limit` RIMOSSO». Un esecutore che parte con la
directory di lavoro nel repository principale **conosce la risposta di `AR-1`**. Ogni sessione parte con
`cwd` nella cartella congelata e supera il pre-volo della Parte 2 del
[prompt esecutori](Prompt-esecutori-AM-C0-corsia-A-archivio-27-08-26.md). Se non è dichiarabile con
certezza → quella casella è `non_noto` e **non entra nel confronto**.

## Fonti di ingresso, in quest'ordine

1. [`FREEZE_AM_C0_27-08-26.md`](../../MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md) — intero.
2. [`Prompt-esecutori-AM-C0-corsia-A-archivio-27-08-26.md`](Prompt-esecutori-AM-C0-corsia-A-archivio-27-08-26.md) — comandi e testi verbatim.
3. [`Prompt-revisore-codex-AM-C0-27-08-26.md`](Prompt-revisore-codex-AM-C0-27-08-26.md) — mandato cieco e forma della chiave.
4. [`DOSSIER_OPERATIVO_AGENTE_MATTEO_V0.md`](../../MetaSkillSystem/Senior-Eval-Pack/DOSSIER_OPERATIVO_AGENTE_MATTEO_V0.md) — è il materiale sotto misura, non una guida per te.
5. [`Report-senior-freeze-am-c0-27-08-26.md`](Report-senior-freeze-am-c0-27-08-26.md) — §8-bis dice quali due errori sono già stati fatti; non rifarli.
6. [`PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md`](../../MetaSkillSystem/Senior-Eval-Pack/PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md) e [`CONTRATTO_EVAL_SENIOR_V0.md`](../../MetaSkillSystem/Senior-Eval-Pack/CONTRATTO_EVAL_SENIOR_V0.md) — disegno e contratto.
7. `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` §11 — **aprila prima di scrivere il report**, non dopo.

⛔ Non leggere `docs/_lavoro/`: non serve a questa seduta e la Bussola non è linkata.

## Sequenza

### Fase 1 — preparazione e verifica (tu, da solo)

Esegui la Parte 1 del prompt esecutori. Poi **verifica con comando** e scrivi gli esiti:

| Verifica | Atteso |
|---|---|
| `git status --short` in `1706-storica` e `0508-storica` | **vuoto** — nessuna sovrapposizione |
| `git status --short` in `1706-oggi` e `0508-oggi` | solo file dello strato |
| `grep ADMIN_CLASSIC` sullo status di `1706-oggi` e `1706-dossier` | **nessun risultato** |
| schede rimaste in `1706-dossier/DOSSIER.md` | solo quelle con data ≤ 17-06-2026 |
| schede rimaste in `0508-dossier/DOSSIER.md` | solo quelle con data ≤ 05-08-2026 |
| `sha256sum` dei 31 file dello strato nel repo di oggi | uguale all'aggregato in freeze §0. **Se è diverso, qualcuno ha modificato lo strato dopo il freeze: fermati e dillo a Matteo** |

⚠️ L'ultima riga non è formalità: i tre file di istradamento erano **non committati** al momento del
freeze, quindi un `git checkout` o un commit di qualcun altro può averli cambiati sotto di te.

### Fase 2 — le 19 esecuzioni

9 caselle d'archivio (3 casi × 3 condizioni) + 10 caselle su `C1`–`C5` (5 casi × 2 condizioni) sul
repository di oggi. Regole, tutte nel freeze §4 e §8:

- **una sola esecuzione per casella**, in **sessione nuova**;
- `AR-2` e `AR-3` condividono la cartella → **sessioni separate**, altrimenti il primo contamina il secondo;
- il testo del caso si **incolla verbatim**; se l'agente chiede chiarimenti sul merito, l'unica risposta
  ammessa è *«rispondi con quello che trovi»*;
- ogni risposta si salva **integrale** in `docs/Sessioni di lavoro/<data>/AM-C0/risposte/Rnn.md`, con
  nome opaco che non dice né il caso né la condizione; la corrispondenza `Rnn → caso × condizione` sta
  in un file separato che **il revisore non vede**;
- una risposta incompleta **è un dato**: non la correggi, non la riassumi, non la rilanci;
- una casella che non parte per causa esterna è `not_observed` **con motivo**, resta nel denominatore,
  e non si ripete oltre una volta.

### Fase 3 — la review cieca

Prepara il pacchetto secondo il prompt revisore. Il revisore riceve: le risposte pseudonimizzate, la
lettera di condizione (`A`/`B`/`C`) **senza sapere quale sia quale**, i sei criteri, e la **chiave di
caso** nella forma indicata.

⛔ **Non consegnare mai** la riga «Esito atteso — con dossier / senza dossier» del freeze §4: quello è
il *verdetto atteso per condizione*, ed è un oggetto diverso dalla chiave di caso. La skill del
pacchetto lo tratta come contaminazione.

**Chi ha preparato il freeze non può essere il revisore.** Il freeze l'ha preparato un senior Claude il
27-08; Matteo ha nominato una **chat Codex separata**. Se per qualsiasi ragione la separazione non
regge, il risultato si registra `self_report/unverified` — non lo si chiama review.

### Fase 4 — sintesi

Solo **dopo** che il revisore ha consegnato: riveli la corrispondenza lettera → condizione e scrivi la
sintesi. In quest'ordine, non invertibile:

1. **i limiti delle fonti** — dove la documentazione non permetteva a nessuna risposta di essere corretta;
2. **poi**, e solo se tutte e sei le condizioni di comparabilità del freeze §8 reggono, le differenze di
   comportamento fra condizioni, **dentro lo stesso caso** e mai fra casi diversi;
3. per ogni `negative`, **quale riga manca nel dossier**: è questo il prodotto utile della calibrazione.

Se anche una sola condizione di comparabilità manca, la prova è **calibrazione narrativa**: descrivi
ciò che hai visto e dichiara che la differenza non è attribuibile al pacchetto.

## Esiti — cosa significano e cosa non puoi farne

`positive` · `negative` · `contradicted` · `not_observed` · `unknown` · `not_applicable` (sempre con
motivo). **`unknown` non vale zero** e non si converte né in successo né in fallimento. Il denominatore
resta **114** anche se corri meno caselle. Nessun punteggio aggregato, nessuna media, nessun ranking di
modelli.

⛔ **Nessun esito** apre `SEP-G2`, avvia `SEP-6` o autorizza il cutover `WP-1`. **Un test che mostra una
fonte mancante è un risultato utile, non un fallimento** — e se le tre condizioni si comportano uguale,
quello è il risultato, non un test riuscito male.

## §7 — Cosa chiedi a Matteo, e solo questo

| Serve lui perché | Cosa gli chiedi |
|---|---|
| aprire sessioni in un runtime che tu non puoi pilotare (Cursor, Codex) | di incollare i blocchi già pronti e rimandarti l'output. Tu gli consegni i testi **pronti**, numerati, uno per casella: non deve comporre niente |
| il freeze risulta manomesso (digest diverso) | una decisione: si ricongela o si rinuncia |
| il revisore indipendente non è disponibile | se accetta `self_report/unverified` o se aspetta |
| una risposta rivela un difetto **di prodotto** vero nell'app | se aprirlo come lavoro — ⚠️ e allora si registra in `docs/FOLLOW_UP.md`, **non** nel pacchetto |

**Non gli chiedi:** di creare cartelle, lanciare comandi, potare il dossier, verificare digest,
pseudonimizzare, tenere corrispondenze, contare esiti. È tutto lavoro tuo.

⚠️ Se durante la seduta Matteo prende una **decisione di metodo o di prodotto**, prima di chiudere ha
una riga nel suo owner (`docs/FOLLOW_UP.md`), con `da_confermare` se è ambigua. Non lasciarla solo nel
report: un report è la storia di un pomeriggio, non un registro che qualcuno andrà a consultare. Le
cinque regole già registrate il 27-08 sono `FU-METODO-PRIORITA-1`, `FU-METODO-FONTE-RECENTE-1`,
`FU-METODO-RIUSO-1`, `FU-METODO-CITAZIONE-1`, `FU-METODO-SUPERAMENTO-1`: **applicale anche a te stesso**
mentre lavori.

## Come parlare a Matteo

Prima la scena concreta (chi riceve cosa, cosa fa, cosa si guarda), poi le sigle. Causa → effetto →
soluzione. Prima frase autosufficiente. **Indirizzalo invece di fargli scegliere fra griglie**: una
raccomandazione motivata, non un menù. Poche domande, solo quelle che cambiano il lavoro. Le domande per
lui stanno in una sezione «Domande per te», separate dal piano tecnico. Niente testo esplicativo prima
delle domande: il 27-08 l'ha chiesto esplicitamente.

## Vincoli non negoziabili

- **Sola lettura sull'app.** Niente modifiche a `src/`, `supabase/`, script, hook, validator o fixture.
  Nessun accesso al database. Gli esecutori producono piano, card di provenienza e STOP: **mai** codice.
- ⛔ **Non toccare nessun `_SKILL.md`, nessun file di `contesto/`, nessuna regola Cursor.** Sono il
  materiale sotto misura: modificarne uno invalida i digest del freeze §0 e rende irriproducibile il
  controllo di fuga. Vale anche per correzioni che sembrano ovvie — annotale e basta.
- Nessuna decisione di prodotto registrata nel pacchetto: il suo owner è `docs/FOLLOW_UP.md`.
- Niente ipotesi psicologiche su Matteo. Comportamenti osservati con fonte sì; interpretazioni no.
- ⛔ Non misurare la capacità «capire quali test ha fatto Matteo e replicarli»: è **bloccata a monte**
  perché una casella `[x]` scritta da lui è byte per byte identica a una scritta da un agente.
  Se ti sembra di poterla misurare, fermati: staresti misurando un'invenzione.

## Chiusura richiesta

1. **Rigenera le viste PRIMA di eseguire i cancelli**, non dopo: `npm run generate:mss:views`, poi
   `npm run validate:mss:all` e `npm run validate:docs`. ⚠️ Questo errore è già stato fatto **due volte**
   in tre sedute, l'ultima il 27-08 da un senior che l'aveva letto: un report nuovo rende stale l'indice
   e il cancello esce rosso. Se lo fai lo stesso, **lascia il fail dentro la capsula** — in quel momento
   il cancello era davvero rosso — e registra la ripresa in §8-bis.
2. Report di seduta con **§11 compilata secondo `CHIUSURA_SESSIONE.md` §11** — aprila prima di scrivere.
3. Capsula MSS: scrivi i giudizi in `judgments-*.json` e genera con `npm run mss:capsule`. ⚠️ Non
   scrivere a mano l'intestazione «Capsula MetaSkillSystem»: `--append-to` la rifiuta se esiste già. I
   `source_ref` degli assi devono essere **path risolvibili**, non prosa.
4. `validate:mss:all` e `validate:docs` verdi a fine seduta, rieseguiti **dopo** l'ultima modifica.
5. Se qualcosa resta non fatto, §9 lo dice per nome. Vietato «tutto ok» a vuoto.

## Stato di partenza da registrare all'avvio

`git rev-parse HEAD`, `git branch --show-current`, `git status --short`, e l'aggregato `sha256` dei 31
file dello strato confrontato con il freeze §0. Servono a dire **su quale versione dello skill system i
risultati valgono**: senza, fra un mese nessuno saprà a cosa si riferiscono.

Riferimento del **prima** dell'enforcement, conservato e mai punto di esecuzione: `cc23837`, riapribile
con `git worktree add <cartella> cc23837`. Quanto l'enforcement abbia cambiato il comportamento **non è
una domanda di questa calibrazione**.
