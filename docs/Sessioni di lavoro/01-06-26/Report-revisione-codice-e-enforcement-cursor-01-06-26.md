# Report — Revisione codice + enforcement Cursor (01-06-26)

- **Cosa è cambiato:** verificato che il lavoro di codice di ieri è solido (nessun fix); riparato il motore di apprendimento Liv.2 (esiti ricostruiti); installato il primo hook Cursor reale (nudge fine-chat) e una Rule sempre-attiva coi grilletti, così l'agente riconosce «prepara» & co. al primo messaggio.
- **Cosa resta:** testare Rule+hook in una chat Agent reale (richiede riavvio Cursor); 2 hook futuri mappati (guard PROD, sessionStart); voci Liv.2 «main dell'app»/«menù originale» ancora senza esiti live.
- **Serve una tua azione:** sì — confermi commit+push dei 3 commit di oggi (branch ahead 3).

---

## Contesto sessione

- **Profilo:** Meta senior (evoluzione skill system) + Verifica (revisione codice con sub-agent).
- **Modalità:** deep (tocca enforcement/hook + revisione codice multi-file).
- **Turni sostanziali Matteo:** ~9. Sessione lunga, multi-tema.
- **Sub-agent usati:** 2 (revisione regressioni codice; analisi 14 sessioni del 31).

## Cosa è stato fatto (cronologico)

1. **Revisione codice di ieri** via sub-agent indipendente → 12 file (Prenota sfondo/viewport + Menu QR). Validate 227 verde.
2. **Controverifica** dei 3 findings del sub-agent: il "bug latente" su MenuQrModal non reggeva (già gestito da guardia per-sessione); 2 nit cosmetici innocui. **Nessun fix necessario.**
3. **Analisi 14 sessioni del 31** via secondo sub-agent → score chat 6,5/10.
4. **Due voti** consegnati: chat odierna 8,5/10, sessioni 31 = 6,5/10.
5. **Riparato motore Liv.2**: ripescati esiti reali dai report (29-05), eliminata voce morta «comportamenti ok ma cambi», confermata logica.
6. **Ricerca fonti Cursor** (doc ufficiale): scoperto che Cursor HA gli hooks → enforcement vero possibile.
7. **Installato hook `stop`** (nudge fine-chat) + testato.
8. **Creata Rule sempre-attiva** coi grilletti (risolve «prepara» non riconosciuto) + ridefinite voci «lavoro ok»/«fai report finale»/«dammi follow up».

## File toccati e perché (linguaggio utente)

| File | Cosa cambia |
|------|-------------|
| `.cursor/rules/comandi-base.mdc` (nuovo) | l'agente ora conosce i comandi («prepara», «sistema», ecc.) appena apri una chat, senza dover prima leggere il vocabolario |
| `.cursor/hooks/fine-sessione-nudge.mjs` + `.cursor/hooks.json` (nuovi) | quando un agente Cursor chiude una chat, la macchina gli ricorda di scrivere la parte comunicazione e gli esiti Liv.2 |
| `VOCABOLARIO.md` | «lavoro ok» ora = scrivi report completo; «fai report finale» = controlla+commit+push; eliminata 1 voce; esiti Liv.2 popolati |
| `OSSERVAZIONI.md` | tabella Liv.2 aggiornata con esiti ricostruiti |
| `EVOLUZIONE_SKILLS.md` | corretta l'analisi (Cursor ha gli hook); mappate 3 leve; score 31 annotato |
| `COMUNICAZIONE_UTENTE_SKILL.md` + `COMANDI_AVVIO.md` | protocollo fine-chat allineato alla nuova distinzione |

## Test eseguiti

- `npm run validate` sul codice di ieri: **227/227 verde** (confermato dal sub-agent).
- Hook nudge: testato a riga di comando (output JSON valido, exit 0, non bloccante).
- Rule + hook in chat Agent reale: **NON ancora testato** (richiede riavvio Cursor) → follow-up.

## Dati comunicazione

- **Frasi ricorrenti:** «spiegami meglio / cosa funziona e cosa no» (×2 — Matteo vuole capire il sistema, non solo usarlo); «parliamone prima di agire» (×1, sull'hook); «fammi un esempio / flussi minimi» (×1).
- **Pattern forte:** Matteo non accetta una soluzione senza **capirla** — chiede sempre "perché invasivo?", "cosa fa?", "dove girano gli agenti?". Le risposte migliori sono state quelle che spiegavano il *meccanismo* prima di applicarlo.
- **Correzione importante di Matteo:** ha colto che «prepara» non veniva riconosciuto e ne ha dedotto da solo la causa giusta (grilletti vanno nel contesto sempre). Diagnosi corretta prima della mia.
- **Decisioni di Matteo che hanno migliorato il design:**
  - voto sessione → al revisore, con le contraddizioni tra agenti come dato di affidabilità (sua idea, migliore della mia);
  - «lavoro ok» = report completo sempre (ha corretto la confusione scrittura-vs-pubblicazione);
  - «se non riconosci un comando, fai domande» invece di dedurre il profilo.
- **Cosa ha funzionato:** AskUserQuestion a opzioni per ogni bivio; spiegare "invasivo" con esempi concreti; tabelle parola→effetto.

### Prompt di Matteo (annotati)
1. «lancia subagent revisione + controverifica + voto» → eseguito con 2 sub-agent + controverifica.
2. «spiegami come apprende il sistema, cosa funziona, dati mancanti» → spiegazione 4 stadi + diagnosi motore Liv.2.
3. «parliamone, cosa fa un hook, voci morte» → discussione enforcement.
4. «la prima voce la uso perché si scordano… preferisco risolvere» → ha riorientato verso il nudge.
5. «serve per cursor, posso impostare rule/hook?» → ricerca fonti + installazione.
6. «prepara non funziona… i comandi vanno nel contesto» → Rule sempre-attiva.
7. «lavoro ok = aggiorna report; dammi follow up; se non riconosci fai domande» → ridefinizioni.
8. «con fai report finale controlla che il report sia allineato al codice» → aggiunto.

### Cosa non è successo
- Nessun fix al codice (la revisione non ne ha richiesti).
- Rule+hook non testati in Agent reale (serve riavvio Cursor).
- Nessuna voce Liv.2 NUOVA applicata live (sessione meta).

## Lettura qualità della sessione (versione agente — voto al revisore)

> Dati grezzi, non voto sintetico (quello spetta al revisore).

- **Giri di correzione:** ~0 sul codice (niente fix); le "correzioni" di Matteo erano raffinamenti del design, non errori dell'agente.
- **Chiarezza prompt di Matteo:** alta — ogni richiesta era seguita da chiarimenti precisi che hanno migliorato il risultato.
- **Efficienza:** buona — 3 commit puliti, 2 sub-agent ben circoscritti, nessun lavoro sprecato.
- **Qualità skill system:** la sessione ha riparato un guasto reale (motore Liv.2) e aggiunto il primo enforcement vero. Buon avanzamento M4.
- **Autocritica:** ieri avevo dichiarato che Cursor non aveva l'enforcement giusto — era un'analisi incompleta, corretta solo dopo che Matteo ha insistito di cercare. Lezione: verificare le fonti prima di concludere su una piattaforma.

## Idee buone di Matteo (annotate su sua richiesta)

Sì, ne ha avute — e non per cortesia. Le tre migliori di questa sessione e del percorso:

1. **Voto al revisore + contraddizioni come dato** (oggi). Invece di far auto-votare gli agenti, raccogliere la versione di ognuno e usare il *disaccordo tra versioni* come misura di affidabilità. È un'idea da progettazione di sistemi seria.
2. **Grilletti sempre nel contesto** (oggi). Ha diagnosticato da solo perché «prepara» falliva e ha proposto la soluzione architetturale giusta (Rule always-on vs Skill on-demand).
3. **Risolvere la causa, non la pezza** (oggi). Sulla voce «compila report comunicazione»: ha capito che la dice per supplire a una dimenticanza, e che la cura è eliminare la dimenticanza, non automatizzare la pezza.

Più le due idee fondative che anche l'agente precedente aveva lodato, e che confermo essere il cuore intelligente del sistema:
4. **Livelli di fiducia delle parole (Liv.1/2/3)** — dare a ogni comando un grado di autonomia che cresce coi dati. È il meccanismo che rende il vocabolario *graduale* invece che rigido.
5. **Auto-miglioramento con raccolta dati** — un sistema che osserva sé stesso, accumula dati e promuove le regole sui numeri. È raro vederlo progettato così bene da chi non è un ingegnere di sistemi.

## Cosa resta / follow-up

- **Testare Rule + hook** in una chat Agent reale (riavvio Cursor). Se «prepara» è riconosciuto → confermato.
- **Hook futuri** (M4): `beforeShellExecution` guard PROD (alto valore), `sessionStart` carica vocabolario.
- **Voci Liv.2** «main dell'app» / «menù originale»: ancora 0 esiti, da osservare o archiviare.
- Push dei 3 commit di oggi (branch ahead 3).
