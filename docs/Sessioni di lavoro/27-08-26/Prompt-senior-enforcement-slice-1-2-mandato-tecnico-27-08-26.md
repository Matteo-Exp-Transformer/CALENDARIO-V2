# Mandato tecnico senior — implementazione dello slice 1+2 dell'enforcement

## Chi sei e cosa devi ottenere

Sei un **senior orchestratore MetaSkillSystem** con mandato tecnico e autonomo, subagenti ammessi.
La chat precedente ha diagnosticato perché il sistema lascia invecchiare la documentazione e ha
proposto quattro interventi. **Matteo ha autorizzato lo slice 1+2 e solo quello.** Il tuo compito è
trasformarlo in enforcement che funziona anche quando nessuno se lo ricorda.

Criterio di riuscita, uno solo: **ciò che accade solo se Matteo lo ripete non è una regola, è un
promemoria.** Se al termine il comportamento nuovo dipende dal fatto che un agente si comporti bene,
non hai finito.

## Che cosa è autorizzato, e che cosa no

✅ **Proposta 1 — dichiarazione di chiusura per le decisioni.** Ogni seduta deep dichiara nella
capsula esistente `nessuna`, oppure la lista delle decisioni con citazione, owner di destinazione e
riferimento registrato. Una decisione ambigua produce una riga `da_confermare` in
`docs/FOLLOW_UP.md`.

✅ **Proposta 2 — ingresso di collaudo di Matteo.** Formula breve immessa da lui in chat
(`Verifica: area — OK/KO — data`); l'agente la riporta nella capsula come controllo con autore,
esito e riferimento al messaggio. Alla chiusura è obbligatorio dichiarare anche
`nessuna prova umana ricevuta`.

⛔ **Proposta 3** (claim di stato strutturati con validatore sulla prosa operativa) e **proposta 4**
restano fuori. Non anticiparle, nemmeno «tanto è mezz'ora». La 3 richiede un perimetro progettato e
la distinzione fra frase viva, storica e condizionale: è un mandato suo.

⛔ Nessun esito cambia `SEP-5`, passa `SEP-G2`, apre `SEP-6` o autorizza il cutover `WP-1`.

## Cosa Matteo ha già deciso (non riaprirlo)

- `docs/FOLLOW_UP.md` è la **destinazione unica** delle decisioni, comprese le ambigue. Non nasce un
  nuovo registro, non nasce un secondo router.
- La formula minima di collaudo è approvata.
- Un agente **non può firmare «Matteo»** senza un messaggio esplicito di Matteo.
- Meglio una riga in più con stato `da_confermare` che una decisione persa.

## Prima riga di lavoro: sblocca la calibrazione

Le tue cinque correzioni documentali del 27-08 sono ferme sul branch
`codex/senior-doc-enforcement-270826` e **sono il prerequisito della calibrazione `AM-C0`**, che
parte in parallelo. Portale su `env/test` **per prime e da sole**, prima di scrivere una riga di
codice: non devono restare ostaggio di questo lavoro più lungo.

⚠️ Se `test:mss` ti risulta rosso con 12 `hash frozen mutato`, **non è un difetto e non sono le
fixture**: era `.gitattributes` senza `eol=lf` per `.jsonl`, corretto in `env/test` al commit
`0e2a487`. Aggiorna il branch e riallinea il worktree senza toccare nulla:

```
git ls-files -z '*.jsonl' | xargs -0 rm -f
git ls-files -z '*.jsonl' | xargs -0 git checkout --
```

## Prima di scrivere codice: congela il disegno

Il tuo stesso report (§9) lo chiede, e vale come cancello. Scrivi e mostra a Matteo, **prima**
dell'implementazione:

1. **Campi esatti** della dichiarazione di chiusura e del controllo di collaudo: nomi, tipi, valori
   ammessi, che cosa è obbligatorio e che cosa è opzionale.
2. **Perimetro**: quali sedute sono soggette (deep? anche standard? mai le light?) e come il sistema
   riconosce il perimetro senza chiedere all'agente di autodichiararsi.
3. **Comportamento su Cloud e Codex, dove l'hook di stop non gira.** Se l'unica rete è il pre-commit
   locale, la regola è aggirabile con `--no-verify` e non è enforcement. La suite ha già i casi
   `H13-E2` su questo: la CI `validate:mss:changed` deve essere il fondo rete. Dichiara la copertura
   reale, non quella sperata.
4. **Compatibilità all'indietro.** Ci sono 56 file di giudizi e centinaia di report già chiusi. Un
   requisito nuovo che li invalida in blocco è un difetto, non un cancello: applica il nuovo obbligo
   alle sedute nuove e lascia leggibile lo storico, come già fa la modalità storica di `H-1.1`.
5. **Fixture e prove negative**: quali casi nuovi dimostrano che la regola blocca davvero ciò che
   deve bloccare. Una regola senza prova negativa non è dimostrata.

## Vincoli non negoziabili

- **Non toccare le fixture congelate né i loro hash.** Copertura nuova = fixture nuove, file nuovi.
- Il tuo lavoro deve chiudersi con `npm run test:mss` e `npm run validate:mss:all` **verdi**, sul tuo
  worktree e su un worktree pulito appena creato. Verificali entrambi: sono due cose diverse, come
  questa settimana ha dimostrato.
- Principio `D18` di Matteo, **«snellire, non duplicare»**: un attrezzo importa la regola, non la
  riscrive. Se stai per copiare una logica già presente in `report-questions.mjs` o nel motore,
  fermati e importala.
- Nessuna modifica ad app, database, migrazioni, `src/`, `supabase/`.
- Nessuna correzione manuale di una vista generata: si rigenera dall'owner.
- Append-only: nessuna rettifica cancella o riscrive la storia; si cita ciò che si supera.
- ⛔ Non leggere `docs/_lavoro/`: è privato e fuori da git.

## Convivenza con la calibrazione, che gira in parallelo

Un'altra seduta senior sta congelando la calibrazione `AM-C0` sullo stesso repository.

- Lavora su **branch e worktree tuoi**, creati da `env/test` aggiornato. Dichiara nel report il
  commit di partenza. Usa un path **corto** (`c:\tmp\<nome>`): `git worktree add` fallisce con
  «Filename too long» sotto i path lunghi.
- ⚠️ **Non portare lo slice implementato su `env/test` finché la calibrazione non ha chiuso.** Tu
  cambi il contratto di capsula, e quella seduta deve chiudere con una capsula: se il contratto si
  muove sotto i suoi piedi, la sua chiusura fallisce per una ragione che non c'entra col suo lavoro.
  Le correzioni documentali sono l'unica eccezione, e vanno prima.

## Cosa NON stai risolvendo (dillo nel report)

La proposta 2 produce attribuzione **dichiarata**, non prova: nessun markdown autentica chi ha
digitato una riga. Serve a rendere apprendibile come Matteo collauda, non a valere come verifica di
terzi. Scrivilo esplicitamente, così nessuno più a valle scambia le due cose.

## Come parlare a Matteo

Matteo non è uno sviluppatore di professione e ha chiesto questo formato più volte:

- **prima la scena concreta** (chi fa cosa, cosa succede, cosa si rompe), **poi** le sigle;
- **causa → effetto → soluzione**, in quest'ordine;
- **indirizzalo, non fargli scegliere fra griglie**: dagli la tua raccomandazione;
- poche domande, e solo quando mancano dati che cambiano il lavoro;
- prima frase autosufficiente: elemento → intervento → risultato verificabile.

## Chiusura richiesta

1. Il disegno congelato dei cinque punti, approvato da Matteo prima dell'implementazione.
2. L'implementazione, con fixture nuove e prove negative.
3. Tabella di che cosa la regola blocca e di che cosa **non** blocca, con la copertura reale su
   locale, Cloud/Codex e CI.
4. Report di seduta con sezione 11 «Domande di chiusura» compilata secondo
   `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` §11 — **aprila prima di scrivere il report**, non
   dedurre la struttura dai report vicini.
5. Capsula, viste rigenerate, `validate:mss:all` e `validate:docs` verdi, commit sul tuo branch.
