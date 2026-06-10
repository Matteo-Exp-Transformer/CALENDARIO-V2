# Report fine sessione — Meta senior: propagazione fase fine-chat + hook nel template v.0

**Data:** 03-06-26
**Profilo agente:** Meta senior (evoluzione skill system comunicazione)
**Modalità:** standard
**Test:** smoke-test dell'hook generico (3 percorsi: report completo → followup, sezioni mancanti → followup mirato, no-report/loop_count≥1 → `{}`) — tutti ok.

> **Nota git:** i file del template `_skill-system-v0/` sono **gitignored** → NON entrano nei commit.
> Restano locali sul disco. Questo report (sotto `docs/`, tracciabile) è l'unica traccia versionata
> di cosa è stato toccato nel template (regola REVISIONE §6b).

---

## In 3 righe

- **Cosa è cambiato:** il template generico v.0 ora ha la fase «fine chat» completa (guida unica
  `CHIUSURA_SESSIONE.md` + cartella `hooks/` con l'hook `stop` che rilancia l'agente), prima assente.
- **Cosa resta:** niente di bloccante. Il template è allineato agli upgrade del 02/03-06 fatti sul progetto reale.
- **Serve una tua azione:** no (i file v.0 sono già sul disco). Se vuoi, dai un'occhiata a `MANUALE_AVVIO.md` (ora 9 passi) per vedere come si presenta l'avvio.

---

## Sintesi per l'utente

Il «sistema vuoto» pronto per altri progetti era rimasto indietro: non sapeva spiegare cosa fare a
fine chat (come compilare il report, come committare, come allineare branch/DB) e non aveva l'hook che
rilancia l'agente quando dimentica pezzi del report. Ora ce l'ha, in forma **generica** — zero
riferimenti a questo progetto. Chiunque copi il template in un nuovo progetto trova una guida unica di
chiusura, un hook pronto da installare con istruzioni, e il manuale di avvio aggiornato che spiega
entrambi.

## Cosa è stato fatto (cronologico)

1. Letto lo stato reale del progetto (la guida di chiusura, l'hook v3, il Playbook senior, REVISIONE §6b)
   e confrontato con lo stato del template v.0.
2. Creato `CHIUSURA_SESSIONE.md` generico nel template (Parte A = 10 sezioni del report, incl. «la tua
   lettura» e l'allineamento-skill-implicito; Parte B = commit/push/branch/DB/terminali in forma generica).
3. Creata la cartella `hooks/` del template: hook `stop` generico (`fine-sessione-nudge.mjs`), `hooks.json`
   con `loop_limit:1`, e un README che spiega installazione + i 3 punti da adattare.
4. Arricchito `EVOLUZIONE_SKILLS.md` del template col **Playbook senior** generico (matrice file/chat ×
   durante/dopo, «stop è un rilancio non un promemoria», mappa dei 3 hook che iniettano vs quelli che
   solo bloccano) e aggiornata M4 (l'hook ora è pronto nel template).
5. Allineati i rimandi: README (struttura + principi), Bussola §5, COMUNICAZIONE_SKILL §3/§4,
   `_TEMPLATE_REPORT.md` (sezioni 7/8 + nota allineamento), MANUALE_AVVIO (passi 7-8-9 + diagramma).
6. Verificato: nessun riferimento a una vecchia «COME_COMPILARE_REPORT» (non esiste nel template);
   nessuna fuga di nomi feature/DB del progetto in `CHIUSURA_SESSIONE.md`.

## File toccati e perché (linguaggio utente)

> Tutti sotto `_skill-system-v0/` (gitignored). Vedi tabella «File del template v.0 toccati» sotto.

## Test eseguiti

Smoke-test del nuovo hook generico con Node, simulando lo stdin dell'IDE:
- report fresco e completo → `followup_message` con monito a verificare che le sezioni siano piene;
- report fresco con sezioni mancanti → `followup_message` mirato che nomina file e sezioni mancanti;
- nessun report fresco → `{}` (silenzio); `loop_count >= 1` → `{}` (guardia anti-loop).
Tutti e tre i percorsi corretti.

## File di skill aggiornati — **File del template v.0 toccati** (obbligatorio, git non li traccia)

| File (`_skill-system-v0/…`) | Modifica | Perché |
|------|----------|--------|
| `comunicazione/CHIUSURA_SESSIONE.md` | **NUOVO** | Fonte unica della fase fine-chat (Parte A report 10 sezioni + Parte B procedure) — mancava del tutto |
| `hooks/fine-sessione-nudge.mjs` | **NUOVO** | Hook `stop` generico: legge report freschi, verifica sezioni, rilancia con `followup_message`; guardia `loop_count` |
| `hooks/hooks.json` | **NUOVO** | Registra l'hook su `stop` con `loop_limit:1` |
| `hooks/README.md` | **NUOVO** | Installazione + 3 punti da adattare + limiti onesti |
| `comunicazione/EVOLUZIONE_SKILLS.md` | Aggiunto Playbook senior generico; M4 → 🔶 con rimando a `hooks/` | Descriveva l'enforcement ma non la meccanica `followup_message`/`loop_count` né la matrice/mappa hook |
| `README.md` | Albero struttura (+ `hooks/`, `CHIUSURA_SESSIONE`); 2 principi nuovi | La struttura non citava i file nuovi della fase fine-chat |
| `MANUALE_AVVIO.md` | Passi 7 (CHIUSURA), 8 (hook), 9 (pulizia); diagramma «come funziona»; titolo «I passi» | All'avvio non spiegava la fase fine-chat né l'hook |
| `00_BUSSOLA_SKILL.md` | §5 rimanda a `CHIUSURA_SESSIONE` come fonte unica + nota hook | Puntava solo a COMUNICAZIONE/_TEMPLATE_REPORT |
| `comunicazione/COMUNICAZIONE_SKILL.md` | §3 e §4 rimandano a `CHIUSURA_SESSIONE` (single source of truth) | Duplicavano dettagli di chiusura → rischio disallineamento |
| `sessioni/_TEMPLATE_REPORT.md` | Aggiunte sezioni «Analisi flusso prompt», «La tua lettura», nota allineamento-skill-implicito; rimando a CHIUSURA | Mancavano le sezioni introdotte 01-03/06 |

> **Tutti i file sopra sono gitignored: non compaiono in `git status`/commit.** L'elenco è qui apposta
> perché git non li versiona (REVISIONE §6b).

## Dati comunicazione

- **Frasi/richieste ricorrenti (questa chat):** «forma generica, togli i riferimenti a CalendarBackup» (1×, vincolo forte e ripetuto nel prompt); «valuta se scordiamo qualcosa / mancano contenuti che spiegano funzionamento ad avvio» (1×, ha esteso lo scope da «propaga il plan» a «cura anche la coerenza d'avvio»).
- **Spiegazioni che hanno funzionato:** prompt molto strutturato (OBIETTIVO/CONTESTO/COSA FARE A-D/VINCOLI/FINE SESSIONE) → zero ambiguità su deliverable e su cosa NON toccare.
- **Prompt verbatim utili:** «aiutami a aggiornare v.0 skill system in root … oltre al plan valuta se scordiamo qualcosa o mancano contenuti che spiegano funzionamento ad avvio» → è la riga che ha aggiunto il punto D-bis (coerenza MANUALE_AVVIO/README/Bussola), non presente esplicitamente nel plan.
- **Voci Liv.2 applicate:** «evolvi … senior» (grilletto Meta senior) → **ok** (profilo e skill da caricare individuati correttamente, nessuna correzione).
- **Automatizzabile vs manuale:** la propagazione template è **manuale per natura** (i file sono gitignored, decisione umana su cosa è «strutturale»); l'unica parte automatizzabile sarebbe un linter che segnala quando un file `docs/Comunicazione-Skill/*` cambia e il gemello v.0 no — ma è M4-futuro, in PAUSA-RACCOLTA.

### Analisi flusso prompt, efficienza e statistiche

- **N° prompt sostanziali:** 1 (il prompt iniziale, completissimo) · **correzioni dopo la 1ª risposta:** 0 · **follow-up generati:** 0 · **modalità alzata in corsa:** no.
- **Anatomia:** prompt esemplare — ha dato il plan E il contesto «da rendere generico» E i vincoli E la procedura di fine sessione. L'unico margine: il plan elencava A-D, ma la richiesta in chat («mancano contenuti che spiegano funzionamento ad avvio») ha aggiunto un quinto fronte implicito (coerenza del MANUALE_AVVIO/README) che ho trattato dentro il punto D. Replicabile: un prompt che separa «propaga X» da «verifica che il resto resti coerente con X» riduce a zero il rischio di lasciare rimandi stale.

## La TUA lettura della sessione ⭐

- **Impressioni:** sistema scorrevole. Avere la guida reale (`CHIUSURA_SESSIONE.md`) + l'hook reale +
  il Playbook §2-bis/ter/quater come «sorgente da generalizzare» ha reso il lavoro quasi meccanico:
  togliere lo specifico, non inventare. Il punto più delicato è stato **dove fermare la genericità**:
  es. la Parte B §4 (DB) — ho tenuto «prod vs test, mai scrivere su prod senza conferma» come principio
  e tolto i nomi dei due DB; abbastanza concreto da essere utile, abbastanza generico da non legarsi al progetto.
- **Difficoltà + come le ho risolte:** (1) Lo smoke-test dell'hook all'inizio restituiva `{}` e ho
  rischiato di crederlo un bug della logica — era solo il path Windows con backslash mangiato dal mio
  comando bash di test; risolto passando il path con `pwd -W` (forward slash). Lezione: prima di
  «aggiustare» l'hook, verificare l'input del test. (2) Un backtick orfano introdotto in un edit della
  Bussola, trovato e corretto subito.
- **Migliorie che suggerirei (come dato, non da applicare):** varrebbe la pena un piccolo script di
  igiene-template che, dato il repo, elenca i gemelli `docs/Comunicazione-Skill/*` ↔ `_skill-system-v0/comunicazione/*`
  e segnala dove le date di modifica divergono — renderebbe la propagazione (oggi a memoria del senior)
  verificabile dai file. È coerente con M4/Playbook §1 (file → hook possibile). Da valutare **dopo** la
  PAUSA-RACCOLTA, non ora.

## Derivazione errori

| Causa | Cosa è successo | Da cosa derivava | Come si eviterà |
|-------|-----------------|------------------|-----------------|
| errore agente (sfiorato) | Smoke-test hook → `{}`, interpretato un attimo come bug della logica | Il mio comando di test passava un path Windows con `\` che bash mangiava prima di node | Testare gli hook Windows con path a forward-slash (`pwd -W`) o JSON via file, non `echo` inline |
| errore agente (minore) | Backtick orfano in un edit della Bussola | Edit a mano di una frase con backtick adiacente | Rilettura della frase modificata (fatto, corretto subito) |

> Nessun bug preesistente, nessun vincolo strutturale bloccante, prompt non ambiguo.

## Cosa resta per la prossima sessione

- Niente di bloccante. Idea annotata (NON eseguita, PAUSA-RACCOLTA): script igiene-template che
  confronta i gemelli progetto ↔ v.0 per data di modifica. → candidabile in `EVOLUZIONE_SKILLS` M4 quando si esce dalla pausa.
- Il Log idee del progetto (`docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` riga 03-06 «debito
  propagazione template v.0») può essere segnato come **risolto** in una prossima sessione meta sul progetto.

## Checklist di chiusura mostrata all'utente

(vedi sotto, in risposta alla chat)

## Commit proposti (su conferma utente)

```text
docs(senior): report propagazione fase fine-chat + hook nel template v.0

Review:
- docs/Sessioni di lavoro/03-06-26/Report-meta-senior-propagazione-template-v0.md

Nota: i file _skill-system-v0/* toccati sono gitignored → non in questo commit
(elenco esplicito nel report, sezione «File del template v.0 toccati»).
```
