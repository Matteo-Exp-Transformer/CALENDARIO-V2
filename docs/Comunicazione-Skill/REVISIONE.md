# REVISIONE — protocollo sessione separata di affinamento skill comunicazione

> **Quando si usa:** in una **sessione dedicata**, su richiesta di Matteo (es. "facciamo la
> revisione della skill comunicazione"). NON durante le normali chat di lavoro.
>
> **Perché separata:** così gli agenti di lavoro restano leggeri (applicano il vocabolario,
> raccolgono dati, scrivono report) e tutto il ragionamento "meta" — valutare i dati, decidere
> promozioni/regressioni, riformare lo skill system — avviene qui, una volta ogni tanto, con
> Matteo presente.

---

## Cosa fa l'agente revisore

1. **Raccoglie il materiale** (fase attuale: **raccolta dati** — non limitarti ai soli report sintetici):
   - Report in `docs/Sessioni di lavoro/*/Report-*.md`: sezione **"Dati comunicazione"** e, se presente, **cronologia / prompt di Matteo** (verbatim o annotati).
   - Quando Matteo le fornisce: **prompt delle chat** con l'agente che ha eseguito il lavoro (oltre al report) — analizzali con la stessa attenzione del report.
   - [`OSSERVAZIONI.md`](OSSERVAZIONI.md), [`PROPOSTE.md`](PROPOSTE.md), campi `Dati Liv.2` in [`VOCABOLARIO.md`](VOCABOLARIO.md).
   - **Analisi attiva su quel materiale:** parole/frasi che Matteo usa per **elementi UI** specifici, per **avviare procedure** (es. chiusura sessione, «prepara prompt»), o che **ripete spesso** e potrebbero diventare scorciatoie — **proponi termini** (voce + livello 1/2/3) in chat e in `PROPOSTE.md`, senza aggiungerli al vocabolario senza ok.

2. **Valuta le voci Liv.2** (promozione / regressione), con criterio basato sui dati:
   - Prevalenza di `ok` + `domanda-superflua` e nessun `corretto-da-Matteo` recente → **proponi Liv.1**.
   - `corretto-da-Matteo` ricorrente → **proponi Liv.3** o riscrittura della voce (l'intento era mal capito).
   - Pochi dati → lascia Liv.2 e segnala che serve più osservazione.

3. **Valuta le candidate in `PROPOSTE.md`**: quali sono mature (pattern ≥2-3 volte, basso rischio)
   per diventare voci di vocabolario, e con quale livello iniziale.

4. **Cerca pattern nuovi** in report + prompt chat che nessun agente aveva ancora formalizzato.

5. **Parla con Matteo**: presenta le valutazioni in modo sintetico (stile skill comunicazione),
   **proponi attivamente** le nuove voci emerse dall'analisi (punto 1), non solo le candidate già in `PROPOSTE.md`, e chiedi le decisioni. Domande tipiche:
   - "La voce «X» è andata bene N volte, la promuovo a automatica?"
   - "Ho notato che chiedi spesso «Y»: la trasformo in voce di livello [1/2/3]?"
   - "Per scrivere meno, ti basterebbe dire «Z» invece della spiegazione lunga?"

6. **Applica le decisioni approvate**: aggiorna `VOCABOLARIO.md` (voci/livelli), archivia le
   proposte decise in `PROPOSTE.md`, alleggerisce `OSSERVAZIONI.md` dai dati ormai consolidati in
   regole. Scrive un report di revisione e fa commit dedicato `docs(comunicazione):`.

---

## Cosa il revisore NON fa

- Non implementa codice dell'app (è una sessione di solo skill system).
- Non aggiunge voci al vocabolario senza l'ok di Matteo.
- Non riscrive le regole di comunicazione di base senza discuterle.

---

## Obiettivo di fondo

Ridurre nel tempo i token che Matteo deve scrivere in input: ogni revisione dovrebbe trasformare
spiegazioni ripetute in scorciatoie approvate, così le chat di lavoro diventano più rapide.
