# Mandato senior orchestratore — test di «Agente Matteo» e dello skill system

## Chi sei e cosa devi ottenere

Sei un **senior orchestratore** del Senior Eval Pack. Devi portare la calibrazione `AM-C0` dal disegno all'esecuzione, su due corsie decise con Matteo il 27-08-2026.

La domanda non è «quale agente è più bravo». È: **con lo stesso bivio e lo stesso contesto tecnico, lo skill system porta un agente a trovare la decisione già presa, oppure a fermarsi correttamente quando la decisione non esiste?**

## ⚠️ PRIMA AZIONE, prima di leggere altro

Esegui e **registra nel report** il commit da cui parti:

```
git rev-parse HEAD && git branch --show-current && git status --short
```

Quel commit è la **baseline congelata** della calibrazione. Un'altra chat sta lavorando in parallelo sull'enforcement dello skill system: se corregge istradamento, hook o contratto di chiusura, la baseline che vuoi misurare non esiste più. Con il commit registrato, le due chat non si contaminano — i tuoi esecutori girano su un worktree pinnato lì.

## Fonti di ingresso obbligatorie

1. `docs/Sessioni di lavoro/27-08-26/Report-senior-fase0-allineamento-owner-e-documentazione-obsoleta-27-08-26.md` — **§6 e §7 contengono la direzione concordata**: leggilo per primo.
2. `docs/MetaSkillSystem/Senior-Eval-Pack/PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md` (rivisto il 27-08 dopo la prova di solidità), `PIANO_MEMORIA_OPERATIVA_AGENTE_MATTEO_V0.md`, `CONTRATTO_EVAL_SENIOR_V0.md`, `MASTERPLAN_V0.md`, `SENIOR_EVAL_SKILL.md`.
3. `docs/FOLLOW_UP.md` — owner delle decisioni di prodotto. `FU-SERV-WALK-IN-HOME-1` e `FU-SERV-BADGE-CASCATA-1` sono state allineate il 27-08 e sono ora fonti valide per i casi.
4. `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md`, `docs/APP_CONTEXT_SKILL.md`, `AGENTS.md`, `.claude/CLAUDE.md`.
5. Prima di qualsiasi fonte personale: `docs/_lavoro/Per matteo/Valutazione Personale/00_BUSSOLA_VALUTAZIONE.md` e il suo **Tempo 0**, obbligatorio prima dell'intervista.

## Corsia A — «l'agente va a cercare?»

Retrospettiva. **Non richiede la chiave sigillata di Matteo**, perché la risposta corretta è già successa.

**Meccanica.** `git worktree add` su un commit del passato: l'agente vede app, report e skill system di quel giorno e non può vedere il futuro. Il confronto è con la decisione che Matteo ha realmente preso dopo, scritta nei commit successivi e nel report di quel giorno. Materiale disponibile: 1152 commit dal 27-04-2026, 534 report di sessione tracciati dal 12-05-2026, `docs/APP_CONTEXT_SKILL.md` con 127 revisioni.

**Le tre condizioni** sullo stesso caso:

| Condizione | Che cosa vede l'agente |
|---|---|
| Storica | lo skill system esattamente com'era quel giorno |
| Oggi | app e report di allora, istradamento di oggi |
| Oggi + dossier | come sopra, più le schede decisione |

⚠️ **Regola di sovrapposizione, non negoziabile.** Si sovrappone **solo lo strato che dice come cercare e quando fermarsi**: `.claude/CLAUDE.md`, `AGENTS.md`, `.cursor/rules/comandi-base.mdc`, gli `_SKILL.md` di primo livello, le schede decisione. **Mai** i file di contesto d'area né i report: descrivono l'app di adesso e contengono la risposta. Verificato: `docs/APP_CONTEXT_SKILL.md`:72 dice *dove* guardare per «limite coperti», il file puntato dice *quale modello ha vinto*.

**Controllo di fuga, obbligatorio prima di congelare ogni caso.** Cerca le parole chiave del caso in tutto ciò che l'agente potrà leggere. Se la risposta compare, scarta il caso o escludi il file, e registralo nel freeze.

⚠️ **Terzo canale di contaminazione, quello che si dimentica.** La memoria del runtime. La memoria di Claude Code contiene già scritto «MODELLO CAMBIATO 18-06-26: `daily_guest_limit` RIMOSSO»: un agente lanciato lì conosce la risposta a prescindere dal worktree. Esegui i casi su un runtime senza quella memoria e registra la condizione nel freeze.

**Caso già verificato, usabile come primo.** Il 17-06 l'app aveva il limite coperti giornaliero (`81c90c2`); il 18-06 Matteo l'ha sostituito con il modello per-fascia (`fe6cdd5`), documentato in `Report-limiti-coperti-nuovo-modello-18-06-26.md`. Un agente al 17-06 che propone di estendere il limite giornaliero mostra che il sistema non gli fa vedere il cambiamento in arrivo; uno che si ferma e chiede è nel comportamento corretto.

**Prima di congelare, mostra a Matteo i tre o quattro casi scelti**, con il controllo di fuga già fatto. Proponili motivati: non fargli scegliere da una lista.

## Corsia B — «l'agente si ferma?»

Prospettica, richiede la chiave. Dopo l'allineamento del 27-08 resta scoperto **un solo caso dei cinque**: `C4`, la regola di priorità fra fix semplici, progetto mobile e follow-up aperti. Gli altri quattro hanno una fonte registrata e appartengono alla corsia A.

L'intervista si accorcia di conseguenza: fai il Tempo 0, poi chiedi a Matteo solo ciò che serve a chiudere `C4` e a fissare le regole di metodo che il piano §3.3 richiede (quale fonte prevale fra vecchia e nuova; quando una decisione è riusabile; che forma deve avere una citazione; come si registra il superamento di una decisione).

## Freeze — cosa deve contenere prima di partire

Il protocollo rivisto elenca gli elementi che la prima versione ometteva. Nessuno è facoltativo: **denominatore** dichiarato (criteri × casi × condizioni), **confondenti iniziali**, **criterio di comparabilità**, **conseguenza di ciascun esito ammesso**, **timestamp/digest**, **materiale escluso per caso**, e per ogni caso **due esiti attesi** — quello corretto con le schede e quello corretto senza. Senza denominatore la review non è registrabile come record `eval`.

## Cosa costruisci strada facendo

Il **dossier operativo** non è un file nuovo da inventare: è l'attuazione del §3.3 del piano. Quattro sezioni — come Matteo vuole essere parlato (materiale già sparso in `docs/Comunicazione-Skill/OSSERVAZIONI.md`), decisioni già prese con puntatore alla fonte, come collauda, cantieri aperti con puntatore all'owner.

Due regole che lo tengono in piedi: **puntatori e non copie**, e **ogni riga ha una fonte osservata**. Vive nel repository in regime interno, non sotto `docs/_lavoro/`: un agente in un worktree congelato deve poterlo leggere, e `_lavoro/` è fuori da git.

Il dossier **è** la condizione «Pacchetto» del test: ogni caso che fallisce ti dice quale riga manca.

## Limite noto da dichiarare, non da aggirare

Una delle quattro capacità di «Agente Matteo» — *capire quali test ha fatto Matteo e replicarli* — è **bloccata a monte**, e non per incapacità dell'agente: una casella `[x]` scritta da Matteo è byte per byte identica a una scritta da un agente. Finché due ore di collaudo manuale non lasciano traccia leggibile, nessun agente può imparare come Matteo collauda. Se durante il lavoro ti sembra di poter misurare quella capacità, fermati: staresti misurando un'invenzione.

## Vincoli non negoziabili

- Sola lettura sull'app: gli esecutori producono piano, card di provenienza e STOP. Niente codice, file, database o comandi distruttivi.
- Chi prepara la chiave non è il revisore finale.
- Il revisore Codex riceve la **chiave di caso**, mai il **verdetto atteso per condizione**, e mai l'etichetta Base/Pacchetto: le condizioni gli arrivano come `A` e `B`.
- Una decisione di prodotto si registra in `docs/FOLLOW_UP.md`, non nel pacchetto. Il protocollo la rispecchia.
- Nessun caso viene sostituito o modificato dopo aver visto un output. Nessuna risposta viene corretta dopo averla letta.
- `unknown` non vale zero e non si converte né in successo né in fallimento.
- Nessuna classifica, nessun punteggio aggregato, nessun ranking di modelli.
- Se modello, versione o strumenti non sono fissabili in modo identico, si registra `non_noto` e non si attribuisce la differenza al pacchetto.

## Come parlare a Matteo

Prima la scena concreta (chi riceve cosa, cosa fa, cosa si guarda), poi le sigle. Causa → effetto → soluzione. Indirizzalo invece di fargli scegliere fra griglie. Poche domande, solo quelle che cambiano il lavoro. Prima frase autosufficiente.

## Chiusura richiesta

Freeze datato con tutti gli elementi; casi congelati con controllo di fuga registrato; prompt degli esecutori e del revisore pronti da copiare; report di seduta con sezione 11 compilata secondo `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` §11 — **aprila prima di scrivere**; capsula, viste rigenerate, `validate:mss:all` e `validate:docs` verdi.

⛔ Nessun esito apre automaticamente `SEP-G2`, avvia `SEP-6` o autorizza il cutover `WP-1`. Un test che mostra una fonte mancante è un risultato utile, non un fallimento.
