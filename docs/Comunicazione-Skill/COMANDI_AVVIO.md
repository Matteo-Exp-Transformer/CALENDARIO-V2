# COMANDI DI AVVIO — quale frase apre quale chat

> Riferimento rapido per Matteo. Ogni riga: **cosa dici** → **tipo di chat che si apre** → **cosa
> carica l'agente**. La fonte autorevole (con livello e comportamento completo) resta
> [`VOCABOLARIO.md`](VOCABOLARIO.md); qui c'è solo la mappa a colpo d'occhio.

---

## 1. Aprire una chat di lavoro

| Dico… | Si apre la chat… | L'agente carica | Liv. |
|-------|------------------|-----------------|------|
| **«prepara»** · «prepara prompt» | **Prepara-prompt** — non esegue, trasforma il lavoro grezzo in un prompt ottimizzato dopo filtro su rischi e ambiguità | `PREPARA_PROMPT_SKILL` + APP_CONTEXT + vocabolario + CONTESTO_PRODOTTO | 1 |
| **«implementa»** · «fai» · «aggiungi» · «crea» · «sistema» · «nuova feature» | **Esecuzione** — scrive/modifica codice di una feature, fix piccolo o responsive | skill dell'area pertinente (+ UI se tocca layout/stile) | 1 |
| **«revisiona»** · «verifica» · «controlla» · «debugga» · «trova il bug» · «non funziona» | **Verifica** — controlla codice/piani già fatti, diagnosi, testing | `TESTING_SKILL` + skill dell'area revisionata | 1 |
| **«revisione completa»** | **Verifica critica indipendente** (workflow pianifica→esegue→revisiona): dichiara i difetti anche a test verdi | profilo Verifica | 1 |

## 2. Aprire una chat sul sistema (Meta)

| Dico… | Si apre la chat… | L'agente carica | Liv. |
|-------|------------------|-----------------|------|
| **«migliora comunicazione»** · «aggiorna/analizza/revisiona comunicazione» | **Meta revisore** — rifinisce le voci del vocabolario, valuta i dati Liv.2, regole di stile. NON fa evolvere il sistema | `COMUNICAZIONE_UTENTE_SKILL` + `REVISIONE.md` | 1 |
| **«evolvi skill system senior»** · «meta senior» | **Meta senior** — fa evolvere il sistema: Log idee, milestone, automazioni (markdown vs hook). Sessione dedicata Opus | `EVOLUZIONE_SKILLS.md` (+ REVISIONE come contesto) | 1 |
| **«evolvi»** *senza* «senior» | **Ambiguo** → l'agente **chiede**: «senior o revisore?» prima di partire | dipende dalla risposta | 2 |

> ⚠️ La parola **«senior»** è il discriminante: «evolvi … senior» → parte diretto come senior;
> «evolvi» da solo → l'agente chiede conferma. «analizza/revisiona comunicazione» restano **sempre**
> revisore, mai senior.

## 3. Durante / a fine chat

| Dico… | Effetto | Liv. |
|-------|---------|------|
| **«spiegamelo semplice»** · «in modo sintetico» | risposta breve: effetto concreto + chi fa cosa, niente lezione tecnica | 1 |
| **«lavoro ok»** | task accettato **+ scrive il report COMPLETO** (lavoro + comunicazione + dati qualità). NON committa | 1 |
| **«fai report finale»** | **capitolo chiuso**: controlla che il report sia allineato al codice, poi **commit + push** | 1 |
| **«dammi follow up»** | risponde con **solo** il prompt da incollare nella prossima chat (ex «dammi prompt proseguimento») | 1 |

> **«lavoro ok» vs «fai report finale» (01-06-26):** il report completo si scrive su **«lavoro ok»**
> (sempre tutto: comunicazione, dati, lettura qualità dell'agente). **«fai report finale»** è solo
> l'atto di **chiusura e pubblicazione** (commit+push), dopo un controllo che il report rispecchi il
> codice. Il **voto sintetico** alla sessione lo dà il **revisore**, non l'agente che ha lavorato.

---

## Logica di fondo (perché esiste questo file)

1. **Una parola = un profilo.** Il profilo decide quali skill l'agente carica a inizio chat: meno
   contesto inutile, chat più rapide e meno token in input.
2. **I LOCK battono il profilo.** Anche in una chat «Esecuzione» leggera, se il task tocca un file
   LOCK (ADMIN_CLASSIC, BOOKING_DATA_FLOW, orari § 4b) quelle skill vanno caricate comunque.
3. **Se non c'è una parola mappata**, l'agente sceglie il profilo dalla descrizione del task e, se in
   dubbio, chiede; le parole nuove nascono candidate in [`PROPOSTE.md`](PROPOSTE.md) finché Matteo
   non le approva (regola d'oro del vocabolario).

> Origine: sessione test skill system 31-05-26. Aggiornare questa mappa quando si aggiunge/modifica
> un grilletto in `VOCABOLARIO.md`.
