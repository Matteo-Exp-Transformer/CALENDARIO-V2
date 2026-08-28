# Mandato senior Codex — enforcement rimasto, fix dai test, regola di STOP nell'istradamento

## Chi sei e cosa devi ottenere

Sei un **senior orchestratore MetaSkillSystem** con mandato tecnico e autonomo, subagenti ammessi.

Cinque lavori, in **quest'ordine di valore**. Il primo vale quindici minuti e cambia il comportamento
di ogni agente da lì in avanti; l'ultimo è una raccolta di dati che oggi non esiste. Non riordinarli
per comodità di implementazione.

Criterio di riuscita, uno solo e già valido nel mandato precedente: **ciò che accade solo se Matteo lo
ripete non è una regola, è un promemoria.** Se al termine un comportamento nuovo dipende dal fatto che
un agente si comporti bene, non hai finito.

---

## ⚠️ Prima di tutto: lo stato che troverai NON è quello dei mandati precedenti

Verificato con comando il 28-08-2026. Tre premesse che circolano nei prompt del 27-08 sono **scadute**,
e se le dai per buone rifarai lavoro già fatto:

| Quello che dicono i prompt del 27-08 | La realtà verificata |
|---|---|
| «Slice 1+2: **niente implementato**» | ❌ **È implementato.** Branch `codex/mss-enforcement-slice-12-270826`, commit `a19c04f`: capsula `0.1.2` con `decision_capture` e `human_verification`, validator, CLI, CI, **5 fixture nuove** `FX-S25`–`FX-S29`, report e giudizi. Worktree vivo in `C:/tmp/mss-enf12-270826`. Il suo report dichiara `validate:mss:all` verde |
| «Cinque correzioni documentali **ferme** sul branch» | ❌ **Già atterrate** su `env/test` con `c07a98d`. Il branch `codex/senior-doc-enforcement-270826` è **ridondante**: verificato che `FOLLOW_UP.md` e `MANUALE_OPERATIVO_MSS_V0.md` su `env/test` contengono già il testo nuovo |
| «Non portare lo slice su `env/test` finché la calibrazione non ha chiuso» | ✅ **Il vincolo è caduto.** `AM-C0` ha chiuso ed è committata (`04f33f5`); la seduta criteri del 28-08 ha chiuso con la sua capsula sul contratto corrente. ⚠️ **Verifica comunque** che nessun'altra seduta sia a metà chiusura prima di muovere il contratto di capsula |

**Prima riga di lavoro, quindi:** non «implementa lo slice», ma **verifica e fai atterrare ciò che
esiste**. Rilancia `npm run test:mss` e `npm run validate:mss:all` sul branch **e su un worktree pulito
appena creato**: sono due cose diverse, e questa settimana lo ha dimostrato.

⚠️ Se `test:mss` ti risulta rosso con hash di fixture mutati, **non sono le fixture**: è la conversione
di fine riga, chiusa in `0e2a487`. Aggiorna il branch e riallinea il worktree con
`git ls-files -z '*.jsonl' | xargs -0 rm -f` seguito da `git ls-files -z '*.jsonl' | xargs -0 git checkout --`.

---

## Lavoro A — La regola di STOP nello strato di istradamento (**prima di tutto il resto**)

**È la consegna più vicina che esista, e costa quindici minuti.** Falla per prima e da sola, come le
correzioni documentali del giro scorso: non deve restare ostaggio del lavoro più lungo.

**La scena.** Un agente apre il progetto, segue l'istradamento, trova due meccanismi che si
sovrappongono e nessun owner che dica quale vince. Non incontra **mai** l'istruzione di fermarsi. Non
gli è stata nascosta: **non c'è**.

**Verificato due volte, indipendentemente** (sintesi `AM-C0` §1.1 con `grep` sui 31 file dello strato,
e di nuovo il 28-08): l'unica regola generale di arresto presente in `.claude/CLAUDE.md`, `AGENTS.md` e
`.cursor/rules/comandi-base.mdc` è

> `comando non riconosciuto → non dedurre, chiedi prima`

che riguarda **il vocabolario**. Gli altri STOP presenti sono **specifici**: ambiente PROD, zone
confondibili Prenota/Menu QR. La regola *«due meccanismi si sovrappongono, o manca una decisione →
STOP + domanda minima»* vive **soltanto** nel dossier operativo §5 e nelle cinque righe `FU-METODO-*`
— due posti che un agente non apre spontaneamente.

⚠️ **Perché è una voce propria e non la proposta 1 dell'enforcement.** La proposta 1 riguarda una
**decisione** che non raggiunge un registro. Questa è una **regola di metodo** che non raggiunge i file
che ogni agente legge aprendo il progetto. Le cinque righe `FU-METODO-*` sono **nel registro giusto** e
restano comunque irraggiungibili. Sono due difetti fratelli, non lo stesso difetto.

**Prova empirica che il difetto è reale, non dedotto:** su `AR-1` e `AR-3`, quattro risposte su sei
hanno trovato e citato correttamente la fonte, e poi hanno proceduto lo stesso. `R09` ha scritto di suo
pugno che la voce di registro mancava, e due paragrafi dopo ha scritto «nessuno STOP».

**Che cosa fare:** portare le regole di metodo nello strato di istradamento, **importando dagli owner,
non riscrivendole** (principio `D18` di Matteo: *snellire, non duplicare*). Gli owner sono
`docs/FOLLOW_UP.md` righe `FU-METODO-*` e `DOSSIER_OPERATIVO_AGENTE_MATTEO_V0.md` §5. I tre file di
istradamento sono **gemelli**: quello che scrivi in uno va nei tre, con lo stesso testo.

---

## Lavoro B — Far atterrare lo slice 1+2

Verifica, poi porta su `env/test`. Non riscriverlo: esiste, è testato, ha le fixture negative.

**Cosa NON stai risolvendo, e va scritto nel report** (già chiesto al giro precedente e ancora valido):
la proposta 2 produce **attribuzione dichiarata, non prova**. Nessun markdown autentica chi ha digitato
una riga. Serve a rendere apprendibile come Matteo collauda, non a valere come verifica di terzi. Deve
essere esplicito, così nessuno a valle scambia le due cose.

⚠️ **Nascerà vuoto.** La capacità «replicare i collaudi di Matteo» resta `non misurata` finché il campo
non contiene almeno una decina di verifiche vere di Matteo — vedi `FU-EVAL-DURATA-1`.

---

## Lavoro C — Il cancello di raggiungibilità delle regole di metodo

Owner della decisione: **`FU-EVAL-RAGGIUNGIBILITA-1`**, decisa da Matteo il 28-08-2026.
Disegno: [`PROTOCOLLO_VALUTAZIONE_MSS_E_AM_V1.md`](../../MetaSkillSystem/Senior-Eval-Pack/PROTOCOLLO_VALUTAZIONE_MSS_E_AM_V1.md) §4.1.

**Che cosa deve fare.** Verificare che le **13 regole di metodo** — le 8 righe del dossier §5 più le 5
righe `FU-METODO-*` — siano incontrabili dallo strato di istradamento. Entra in `validate:mss:all`,
quindi gira in CI su ogni push e PR verso `main` e `env/test`. Se una regola non è raggiungibile, **il
verde non arriva**.

**Requisito non negoziabile sul messaggio d'errore.** Deve nominare **la regola e i file**:

> *«la regola `FU-METODO-RIUSO-1` è in `FOLLOW_UP.md` ma non è raggiungibile da `.claude/CLAUDE.md`,
> `AGENTS.md`, `.cursor/rules/comandi-base.mdc` — aggiungila lì.»*

Senza questo, il caso reale — qualcuno aggiunge una regola lunedì, giovedì il rosso lo prende chi
spingeva un fix sul Menu QR — diventa un'indagine invece di due minuti. **Matteo ha accettato questo
attrito sapendolo**, a condizione che il messaggio sia azionabile.

⚠️ **Limite da dichiarare nel report e accanto a ogni numero che pubblichi:** il controllo cerca
**parole**. Può dire verde perché la frase c'è, mentre la regola resta sepolta in fondo a un file che
nessuno legge. Misura la **raggiungibilità testuale**, non l'efficacia. Non venderlo per più di così.

**Ordine:** il Lavoro A rende verde questo cancello. Falli in quest'ordine o nascerà rosso.

---

## Lavoro D — Q7 e le stringhe che dicono ancora «Q1-Q6»

La settima domanda di chiusura è **già scritta** in `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` §11
(owner: `FU-METODO-PROVE-NUOVE-1`). Il conteggio è generico — `report-questions.mjs` trova ogni `❓ Q` e
verifica la `✅ R` corrispondente — quindi **funziona già**, verificato.

**Ma tre stringhe cosmetiche parlano ancora di sei domande** e vanno allineate, altrimenti un agente
legge «Q1-Q6» e crede che Q7 sia facoltativa:

- `.cursor/hooks/fine-sessione-commit-check.mjs:158` — `'- Q1-Q6 sono coerenti con il lavoro svolto;'`
- `.cursor/hooks/fine-sessione-nudge.mjs:98` — `"le 6 domande ❓Q + ✅R"`
- `scripts/mss/review.mjs:166` e `:181` — commento `Q1–Q6` e codice `q1-q6-assenti`

⚠️ Il codice regola `q1-q6-assenti` è un **identificatore stabile**: se lo rinomini rompi la
compatibilità all'indietro con i giudizi già emessi. Cambia il testo umano, **non** il codice — oppure
dichiara la rettifica append-only.

---

## Lavoro E — Il registro dei cancelli che negano davvero

Owner: **`FU-EVAL-CANCELLI-CAMPO-1`**.

**La scoperta che lo motiva.** Esiste il registro di cosa i cancelli **sono**: 21, catalogati in
`docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json` con superficie, momento, effetto e bypass noti — 19
`deny`, 1 `warn`, 1 `ask`.

> ⚠️ **Non esiste il registro di cosa hanno fatto.**

Ogni cancello ha una **fixture** che dimostra che *sa* bloccare. Nessuno registra se abbia mai bloccato
una **seduta vera**. La prima cosa dice «funziona», la seconda dice «serve».

**Conseguenza da non ammorbidire nel report:** finché quel dato non si raccoglie, la frase di Matteo
*«MSS è troppo macchinoso, snelliamolo»* **non è decidibile su prove**. Si può solo discuterne a
sensazione, e chi difende l'apparato vince sempre, perché il costo lo sentono tutti e il beneficio è
invisibile.

**Che cosa costruire:** il meccanismo minimo perché, **quando un cancello nega**, resti una riga —
quale cancello, quando, che cosa aveva sbagliato. Non un registro nuovo se puoi evitarlo: se ti sembra
necessario, **è una domanda per Matteo**, non una tua decisione.

⚠️ **Questo è il lavoro con più libertà di disegno e meno specifica.** Congela il disegno e mostralo a
Matteo **prima** di implementarlo, come il giro precedente ha già imposto per lo slice.

---

## Vincoli non negoziabili

- ⛔ **Nessun registro nuovo, nessun owner nuovo, nessun secondo router.** `docs/FOLLOW_UP.md` resta la
  destinazione unica delle decisioni, comprese le ambigue. Se sembra necessario, chiedi.
- ⛔ **Non toccare le fixture congelate né i loro hash.** Copertura nuova = fixture nuove, file nuovi.
- ⛔ **Nessuna modifica ad app, database, migrazioni, `src/`, `supabase/`.**
- ⛔ **Nessuna correzione manuale di una vista generata:** si rigenera dall'owner.
- ⛔ **Non leggere `docs/_lavoro/`:** privato e fuori da git.
- ⛔ **Nessun esito** cambia `SEP-5`, passa `SEP-G2`, apre `SEP-6` o autorizza il cutover `WP-1`.
- ⛔ **Nessuna correzione al freeze `AM-C0` né ai verdetti già emessi**, compresi i due `contradicted`
  usati con una definizione diversa da quella congelata: sono **registrati**, non corretti.
- **Append-only:** una decisione superata resta, barrata, con citazione di ciò che la supera.
- **`D18`, snellire non duplicare:** un attrezzo **importa** la regola, non la riscrive. Se stai per
  copiare logica già presente in `report-questions.mjs` o nel motore, fermati e importala.
- **Chiudi con `npm run test:mss` e `npm run validate:mss:all` verdi sul tuo worktree *e* su un
  worktree pulito appena creato.** Sono due cose diverse.
- Lavora su **branch e worktree tuoi**, da `env/test` aggiornato; dichiara nel report il commit di
  partenza. Path **corto** (`c:\tmp\<nome>`): `git worktree add` fallisce con «Filename too long».

---

## Come parlare a Matteo

Matteo non è uno sviluppatore di professione e ha confermato più volte questo formato:

- **prima la scena concreta** (chi fa cosa, cosa succede, cosa si rompe), **poi** le sigle;
- **causa → effetto → soluzione**, in quest'ordine;
- prima frase autosufficiente: elemento → intervento → risultato verificabile;
- **indirizzalo, non fargli scegliere fra griglie**: porta la tua raccomandazione già presa;
- poche domande per volta, e solo quelle che cambiano il lavoro;
- nessuna sigla lasciata senza spiegazione; termini tecnici nuovi **in grassetto**.

---

## Chiusura richiesta

1. Il **Lavoro A** consegnato per primo e da solo, con il commit separato.
2. Lo slice atterrato, con la tabella di che cosa la regola **blocca** e che cosa **non** blocca, e la
   copertura reale su locale, Cloud/Codex e CI — dichiarata, non sperata.
3. Il cancello di raggiungibilità verde, con il messaggio d'errore azionabile e il limite dichiarato.
4. Il disegno del registro dei cancelli **mostrato a Matteo prima** di implementarlo.
5. Report di seduta con sezione 11 «Domande di chiusura» compilata secondo
   `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` §11 — **aprila prima di scrivere il report**, non
   dedurre la struttura dai report vicini. ⚠️ **Ora le domande sono sette:** Q7 chiede quale prova utile
   hai visto che oggi non misuriamo.
6. Capsula, viste rigenerate, `validate:mss:all` e `validate:docs` verdi, commit sul tuo branch.
