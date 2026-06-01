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

4b. **Sintesi feedback agenti (da `ERRORI_PROCESSO.md`).** Questo è compito del **revisore Meta**,
   **non** degli agenti di esecuzione/revisione (loro raccolgono solo i dati grezzi nella sezione
   «Derivazione errori» del report). In sessione con Matteo, leggi `ERRORI_PROCESSO.md`, individua le
   **top 3 cause ricorrenti** (bug preesistente / prompt ambiguo / errore agente / vincolo strutturale)
   e per ognuna proponi a Matteo **un'azione correttiva** allo skill system: una RULE in `APP_CONTEXT`,
   una regola in `PREPARA_PROMPT`, o una Nota in skill d'area. Così i dati di feedback non restano solo
   accumulati ma si trasformano in miglioramenti. Quando una causa è risolta da una regola, annotalo in
   `ERRORI_PROCESSO.md`.

4c. **Voto sintetico alla sessione — è compito TUO, non dell'agente di lavoro** (regola 01-06-26).
   Gli agenti di lavoro (esecutore, revisore-codice, prepara-prompt) scrivono nel report **solo la
   loro versione + i dati grezzi** (n° giri, correzioni, chiarezza prompt, qualità skill system) —
   **non** un voto sintetico, per evitare l'autocelebrazione. Il **voto finale** alla sessione lo dai
   **tu**, confrontando le versioni dei vari agenti nel report unico del ciclo.
   - **Le contraddizioni tra versioni sono un dato di prim'ordine.** Se l'esecutore si legge come
     "tutto liscio" e il revisore segnala 4 giri di correzione sulla stessa sessione, quella
     divergenza misura l'**affidabilità dell'agente** (quanto la sua autovalutazione è realistica).
     Annotala esplicitamente: è un segnale su quali agenti fidarsi di più e dove serve enforcement.
   - In fase di **raccolta dati** (attuale): tieni le versioni dei singoli agenti nel report (non
     cancellarle), così la divergenza resta tracciabile. Il voto sintetico va nel «Registro metriche»
     di [`EVOLUZIONE_SKILLS.md`](EVOLUZIONE_SKILLS.md) (M5), non disperso nei report.
   - Origine: Matteo 01-06-26 — «se ci sono contraddizioni lo dovremmo capire; ci aiuta a capire
     quanto gli agenti sono affidabili». Voci collegate: `VOCABOLARIO.md` «lavoro ok» (l'agente
     scrive la sua versione, non il voto) + `COMUNICAZIONE_UTENTE_SKILL.md` protocollo fine-chat.

5. **Parla con Matteo**: presenta le valutazioni in modo sintetico (stile skill comunicazione),
   **proponi attivamente** le nuove voci emerse dall'analisi (punto 1), non solo le candidate già in `PROPOSTE.md`, e chiedi le decisioni. Domande tipiche:
   - "La voce «X» è andata bene N volte, la promuovo a automatica?"
   - "Ho notato che chiedi spesso «Y»: la trasformo in voce di livello [1/2/3]?"
   - "Per scrivere meno, ti basterebbe dire «Z» invece della spiegazione lunga?"

6. **Applica le decisioni approvate**: aggiorna `VOCABOLARIO.md` (voci/livelli), archivia le
   proposte decise in `PROPOSTE.md`, alleggerisce `OSSERVAZIONI.md` dai dati ormai consolidati in
   regole. Scrive un report di revisione e fa commit dedicato `docs(comunicazione):`.

---

## Evoluzione del sistema — due livelli di Meta (`EVOLUZIONE_SKILLS.md`)

Oltre alla revisione del vocabolario sopra, lo skill system **evolve** (automazioni, statistiche,
tecniche nuove, raffinamenti). Questo lavoro è separato in due livelli e vive in
[`EVOLUZIONE_SKILLS.md`](EVOLUZIONE_SKILLS.md):

- **Meta junior** (agenti Cursor / modelli più piccoli, anche durante una sessione di lavoro):
  quando notano un'idea utile per il sistema — un'automazione possibile, un dato/statistica che
  varrebbe la pena raccogliere, una tecnica non ancora usata, un raffinamento — **aggiungono una sola
  riga** nel «Log idee» in fondo a `EVOLUZIONE_SKILLS.md`. **Spontaneo, non a ogni sessione.** Non
  progettano e non decidono: solo annotano.
- **Meta senior** (Opus 4.8+, sessione dedicata lanciata da Matteo): legge il Log idee + le milestone
  + i dati accumulati; **analizza**, decide cosa costruire e in che ordine, fa avanzare le milestone,
  pota le idee morte. Distingue sempre **governance soft (markdown)** da **enforcement vero
  (hook `settings.json`)** quando pianifica un'automazione.

Quando il senior calibra anche la modalità light/standard/deep, è il compito di igiene già previsto.

---

## Cosa il revisore NON fa

- Non implementa codice dell'app (è una sessione di solo skill system).
- Non aggiunge voci al vocabolario senza l'ok di Matteo.
- Non riscrive le regole di comunicazione di base senza discuterle.

---

## Obiettivo di fondo

Ridurre nel tempo i token che Matteo deve scrivere in input: ogni revisione dovrebbe trasformare
spiegazioni ripetute in scorciatoie approvate, così le chat di lavoro diventano più rapide.
