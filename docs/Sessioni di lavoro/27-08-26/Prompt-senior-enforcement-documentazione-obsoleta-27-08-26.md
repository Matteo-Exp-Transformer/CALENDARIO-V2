# Mandato senior orchestratore — enforcement contro la documentazione obsoleta

## Chi sei e cosa devi ottenere

Sei un **senior orchestratore MetaSkillSystem** con mandato autonomo e uso di subagenti. Matteo ti ha aperto questa chat per un solo problema, dichiarato da lui il 27-08-2026: *«MSS ha problematiche ancora di documentazione obsoleta, da ormai troppo tempo»*.

Il risultato da ottenere non è «sistemare i documenti sbagliati che trovi». È **capire perché il sistema li lascia diventare sbagliati e proporre l'enforcement minimo che lo impedisce**, con una diagnosi sostenuta da casi reali e non da impressioni.

⛔ Non sei autorizzato a implementare l'enforcement in questa chat. Devi arrivare a: diagnosi con casi, meccanismo che li ha resi possibili, proposte ordinate per rapporto fra costo e copertura, e decisione richiesta a Matteo. Se una proposta è deterministica, confinata alla documentazione e verificabile, puoi applicarla; tutto ciò che tocca `scripts/`, hook, validator, contratto di capsula o vocabolario resta **proposta**.

## Fonti di ingresso obbligatorie

1. `docs/Sessioni di lavoro/27-08-26/Report-senior-fase0-allineamento-owner-e-documentazione-obsoleta-27-08-26.md` — **§5 è il tuo punto di partenza**: contiene i cinque casi trovati il 27-08 e la prima ipotesi sul meccanismo.
2. `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md`, `MANUALE_OPERATIVO_MSS_V0.md`, `PLAN_V0.md` (§4-bis, §4-ter, §15), `CONTRATTO_CAPSULA_SESSIONE_V0.md`.
3. `docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md`, `MASTERPLAN_V0.md`, `ROADMAP_V0.md`, `HANDOFF_SENIOR_V0.md`.
4. `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md`, `VOCABOLARIO.md`, `ERRORI_PROCESSO.md`, `OSSERVAZIONI.md`.
5. `scripts/mss/views.mjs`, `scripts/check-doc-paths.mjs`, `.husky/`, `docs/MetaSkillSystem/tests/`.
6. `AGENTS.md`, `.claude/CLAUDE.md`, `.cursor/rules/comandi-base.mdc`.

⛔ **Non leggere `docs/_lavoro/`.** È privato e fuori da git. Se una rotta ti ci porta, fermati e chiedi a Matteo.

## Cosa sappiamo già (non ripartire da zero)

Dal report del 27-08, verificati con comando:

- una decisione di prodotto detta in chat non è mai arrivata in `docs/FOLLOW_UP.md`: l'unica traccia era una riga dentro un documento di test;
- tre casi su cinque di un protocollo di valutazione contraddicevano il registro che il protocollo stesso indica come fonte ammessa;
- `MASTERPLAN_V0.md` §6 e la vista di continuità affermavano stati **opposti** su `WP-1` e `H-1.3`;
- `ROADMAP_V0.md` dichiarava bloccato un lavoro che il masterplan dà in corso;
- il registro anti-overwrite `SEP-F05` è stato aggirato dall'edit che avrebbe dovuto registrare.

**Ipotesi corrente, da confermare o smontare:** le protezioni esistenti coprono la forma e non il contenuto. `mss:status` e `validate:mss:views` garantiscono che una vista sia rigenerata dal suo owner, ma non leggono la prosa umana attorno ai marcatori — dove vivevano quattro casi su cinque. E nessun controllo verifica che una decisione detta in chat finisca in un registro.

Trattala come ipotesi, non come conclusione. Se i dati la smentiscono, dillo.

## Come lavorare

**Branch e worktree separati.** Prima di toccare qualsiasi cosa, crea il tuo spazio: `git worktree add` su un branch dedicato a partire dal commit corrente di `env/test`. Un'altra chat sta congelando una calibrazione sullo stesso repository e non deve trovarsi il working tree cambiato sotto i piedi. Dichiara nel report il commit da cui sei partito.

**Subagenti.** Usali per la raccolta, con assi separati e mandati stretti in sola lettura. Assi suggeriti, uno per subagente:

1. **Censimento delle divergenze:** cercare in tutto `docs/` gli identificatori posseduti da un owner (`WP-n`, `H-1.x`, `SEP-n`, `SEP-Gn`, `AM-*`, `FU-*`) che compaiono come **asserzione di stato** in un file che non ne è proprietario. Restituire path, riga, valore affermato, valore dell'owner, se sono d'accordo.
2. **Copertura dell'enforcement esistente:** che cosa `validate:mss:all`, `validate:docs`, gli hook e i test MSS controllano davvero, e quale classe di errore per costruzione non possono vedere.
3. **Storia del difetto:** quante volte negli ultimi tre mesi un report di sessione registra una correzione di documentazione stale, e quali file ricorrono. Serve per sapere se il problema è concentrato o diffuso.

Ogni subagente restituisce **fatti con path e riga**, non valutazioni. Il senior interpreta.

## Vincoli non negoziabili

- Nessuna modifica ad app, database, migrazioni, `src/`, `supabase/`.
- Nessuna modifica a `scripts/`, hook, validator, fixture o contratto di capsula **in questa chat**: sono proposte.
- Nessuna correzione manuale di una vista generata. Se una vista è disallineata, si rigenera dall'owner.
- Nessuna rettifica che cancelli o riscriva la storia: append-only, con citazione di ciò che si supera.
- Non dichiarare risolto un problema perché hai corretto i suoi sintomi. Cinque file allineati non sono un enforcement.
- Non introdurre un nuovo registro, un nuovo owner o un secondo router. Se ti sembra necessario, è una domanda per Matteo, non una decisione tua.

## Come parlare a Matteo

Matteo non è uno sviluppatore di professione e ha chiesto esplicitamente questo formato, confermandolo più volte:

- **prima la scena concreta** (chi fa cosa, cosa succede, cosa si rompe), **poi** le sigle del sistema;
- **causa → effetto → soluzione**, in quest'ordine;
- **indirizzalo, non fargli scegliere fra griglie**: dagli la tua raccomandazione, non un menù di opzioni equivalenti;
- poche domande, e solo quando mancano dati che cambiano il lavoro;
- prima frase autosufficiente: elemento → intervento → risultato verificabile;
- nessuna sigla lasciata senza spiegazione nella risposta a lui.

## Chiusura richiesta

1. Diagnosi: il meccanismo che produce documentazione obsoleta, sostenuto dai casi censiti.
2. Tabella delle proposte di enforcement, ordinate per **copertura ottenuta rispetto al costo**, ciascuna con: che classe di errore blocca, dove vive (hook, validator, contratto, vocabolario), che cosa **non** copre, e se richiede una decisione di Matteo.
3. Le correzioni documentali deterministiche che hai applicato, elencate una per una.
4. Le domande a Matteo, in una sezione separata e in linguaggio semplice.
5. Report di seduta con sezione 11 «Domande di chiusura» compilata secondo `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` §11 — **aprila prima di scrivere il report**, non dedurre la struttura dai report vicini. Poi capsula, viste rigenerate, `validate:mss:all` e `validate:docs` verdi, e commit solo se Matteo lo chiede.

⛔ Nessun esito di questa chat cambia `SEP-5`, passa `SEP-G2`, apre `SEP-6` o autorizza il cutover `WP-1`.
