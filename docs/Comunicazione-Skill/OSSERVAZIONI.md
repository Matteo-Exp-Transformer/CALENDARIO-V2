# OSSERVAZIONI — registro dati su come lavora Matteo

> **Chi scrive:** gli agenti di lavoro, a fine chat (dopo conferma successo).
> **Chi legge e valuta:** l'agente revisore in sessione separata (vedi [REVISIONE.md](REVISIONE.md)).
> Gli agenti di lavoro **non** valutano né riformano: scrivono solo dati grezzi.
>
> Tenerlo conciso, una riga per osservazione. Quando un pattern matura → candidato in
> [PROPOSTE.md](PROPOSTE.md); approvato (dal revisore con Matteo) → voce in
> [VOCABOLARIO.md](VOCABOLARIO.md).
>
> Fonte storica (analisi iniziale dei pattern, maggio 2026), in `docs/_lavoro/Supporto/` (locale):
> `ANALISI_RACCOLTA_DATI_SKILL_SYSTEM.md.md` e `Metodo_spiegazioni_agenti_coding.md`.

---

## Esiti voci Liv.2 (riepilogo per il revisore)

> Sintesi degli esiti registrati sulle voci Liv.2 (il dettaglio per voce sta nel `VOCABOLARIO`).
> Il revisore guarda qui: tante `ok`/`domanda-superflua` → promuovere a Liv.1; `corretto-da-Matteo`
> ricorrenti → regredire a Liv.3 o riscrivere la voce.

| Voce Liv.2 | ok | domanda-superflua | corretto-da-Matteo | segnale |
|------------|----|-------------------|--------------------|---------|
| *(nessuna voce Liv.2 ancora)* | | | | |

## Frasi / richieste ricorrenti (con conteggio)

| Frase/intento | Volte osservate | Comportamento desiderato emerso |
|---------------|-----------------|--------------------------------|
| «spiegamelo semplice / in modo sintetico» | 3+ (chat PWA, Metodo, report) | metafora concreta + "chi fa cosa" + breve |
| «è una rule che devo ricordare io?» / «devo farlo ogni volta?» | 2+ | distinguere lavoro manuale ricorrente da automatismo del tool |
| «ottimo / funziona / perfetto» (conferma successo) | molte | trigger del protocollo fine-chat (report + skill + commit) |
| «mantieni linea scalabile e pulita, no parti obsolete» | 2+ | preferire soluzioni durevoli, niente codice ridondante/legacy |
| «fammi delle domande per decidere» | 2+ | usare AskUserQuestion prima di pianificare, non calare piani dall'alto |
| report in `Sessioni di lavoro/` non `_lavoro/` | 1 (forte) | i report ufficiali vanno nella cartella datata |

## Spiegazioni date e formato che ha funzionato

- **Cache PWA** → metafora "file usa-e-getta (hash) vs file-indice (html/sw)". Funzionato.
  La domanda chiave di Matteo era "devo rinominare i file io?" → sbloccato dicendo "lo fa Vite da solo".
- Pattern confermato: Matteo capisce quando gli dici **chi fa l'azione** (lui / il tool / l'agente),
  non quando spieghi *come* funziona internamente.

## Procedure ripetute richieste

- Fine sessione: report + aggiornamento skill + (ora) commit dedicato.
- Revisione critica e indipendente del lavoro di un altro agente (workflow multi-agente:
  pianifica → esegue → revisiona).
- Prima di prod/migrazioni/deploy: fermarsi e chiedere conferma.

## Workflow multi-agente osservato

- Matteo usa più agenti in catena: uno pianifica (plan mode), uno esegue (Sonnet in altra chat),
  uno revisiona. La revisione deve trovare difetti veri, non confermare per cortesia.

## Token risparmiabili (dove Matteo scrive molto)

- Spiega ogni volta a lungo lo stile di comunicazione che vuole → risolvibile con vocabolario +
  skill caricata di default.
- Descrive ogni volta il flusso di fine-chat → ora codificato nel protocollo.

---

## Log per data

### 28-05-26 (parte 2) — Costruzione skill system comunicazione + riorganizzazione docs
- Pattern forte: Matteo **estende lo scope** quando risponde alle domande ("anche QR e future
  feature", "in futuro un numero tipo 2.1") → ragiona per principi durevoli, non per caso singolo.
  Comportamento agente utile: proporre già soluzioni scalabili, non solo per il caso immediato.
- Pattern: prima di azioni strutturali rischiose (spostare 77 file, rinominare cartella gitignored)
  vuole capire l'impatto e decidere → fermarsi e fare AskUserQuestion con dati è ciò che si aspetta.
- Privacy: tiene `docs/_lavoro/` privata apposta; molto sensibile a non esporre dati su git.
  Segnalare SEMPRE quando un'azione rischia di pubblicare contenuto privato.
- Commit: ha confermato che vuole commit dell'agente dopo "tutto ok", e ha capito/apprezzato i
  **commit separati** come punti di ripristino indipendenti. Domanda sua: "un commit in più non
  crea disagi giusto?" → rassicurato che è più sicuro.
- Revisione lavoro altri agenti: "revisiona e se è ok committa anche quello" → si fida della
  validazione (npm run validate) come prova, non pretende rilettura riga per riga.
- Token: chiede prompt pronti da copiare per la sessione successiva → fornirli già formattati
  e auto-contenuti è apprezzato.
- Chiusura calorosa ("grazie mille", emoji) → rapporto collaborativo, non solo transazionale.

### 28-05-26 — Sessione PWA + costruzione sistema comunicazione
- Confermato: "spiegamelo semplice" = metafora + chi-fa-cosa (vedi cache PWA).
- Confermato: preoccupazione ricorrente "lavoro mio o del tool?".
- Confermato: vuole flusso fine-chat con commit dedicato (commit = punto di ripristino sicuro).
- Confermato: vocabolario solo con voci approvate; file di supporto dentro la skill comunicazione.
- Nuovo: vuole che l'agente proponga automazioni quando ha abbastanza dati, e chieda come accorciare i suoi prompt.
