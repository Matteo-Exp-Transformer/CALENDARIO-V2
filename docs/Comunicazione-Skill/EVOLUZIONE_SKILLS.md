# EVOLUZIONE SKILLS — roadmap di sviluppo dello skill system

> **A cosa serve.** Qui non si raccolgono dati su *come parla Matteo* (quello è `OSSERVAZIONI.md`)
> né bug di processo (`ERRORI_PROCESSO.md`). Qui si raccoglie e si decide **come far evolvere il
> sistema stesso**: automazioni, statistiche, tecniche non ancora usate, raffinamenti.
>
> **Due ruoli (come nel resto del sistema):**
> - **Meta junior** (per lo più agenti Cursor / modelli più piccoli): *annotano* — quando durante una
>   sessione notano un'idea utile, aggiungono **una riga** nel Log idee in fondo. Non progettano, non
>   decidono. Spontaneo: solo se salta all'occhio qualcosa, non a ogni sessione.
> - **Meta senior** (Opus 4.8+, on-demand quando Matteo lo lancia): *analizza* il Log idee, le milestone
>   e i dati accumulati; decide cosa costruire, in che ordine; fa avanzare le milestone; pota le idee
>   morte. È l'unico che trasforma idee grezze in lavoro pianificato.
>
> **Flusso reale:** agenti annotano durante il lavoro → Matteo, dopo alcune sessioni, chiede una
> revisione comunicazione → poi lancia il Meta senior per analisi + fix + sviluppo del sistema.

---

## ⚠️ Distinzione tecnica importante (markdown vs enforcement vero)

Non tutto ciò che scriviamo qui è "automazione" allo stesso modo:

- **Governance soft** (regole in `.md`): l'agente *dovrebbe* seguirle, ma non è obbligato dalla
  macchina. È quasi tutto lo skill system di oggi. Funziona con agenti collaborativi.
- **Enforcement vero** (eseguito dalla macchina, non dal modello): solo dove la piattaforma lo
  permette — **hook in `settings.json`** di Claude Code (es. comando che gira pre-commit o a inizio
  task). Cursor ha meno leve.

Il senior, quando pianifica un'automazione, **deve dichiarare quale dei due tipi è**. Promettere
"comandi che scattano da soli" via markdown è un buon proposito, non un'automazione.

---

## Milestone attive

> Ordinate per impatto sul workflow di Matteo (scrivere prompt → leggere report → chiudere il lavoro).
> Stato: ⬜ da iniziare · 🔶 in corso · ✅ fatta.

### M1 — Prompt più veloci da scrivere ⬜
**Obiettivo:** ridurre i giri di chiarimento tra Matteo e l'agente prepara-prompt.
**Idee concrete:** template di prompt per i task ricorrenti (es. "fix UI Prenota", "nuova promo",
"nuova migrazione"); mockup HTML per le scelte UX/flusso prima dell'implementazione (già candidato in
`PROPOSTE.md` / `PREPARA_PROMPT_SKILL.md`).
**Tipo:** governance soft.

### M2 — Report a colpo d'occhio 🔶
**Obiettivo:** Matteo decide se aprire un report senza leggerlo tutto.
**Idee concrete:** ogni report standard/deep apre con **3 righe fisse**: (1) cosa è cambiato per
l'utente, (2) cosa resta da fare, (3) serve una tua azione sì/no. La modalità light/standard/deep
(fatta) è il primo passo di questa milestone.
**Tipo:** governance soft (regola nel template report).
**Stato:** ✅ cappello 3 righe codificato in `APP_CONTEXT_SKILL.md` §7.1 (29-05-26). Resta da
valutare all'uso se le 3 righe scelte sono quelle giuste per Matteo (raccogliere feedback).

### M3 — Chiusura con una parola sola ⬜
**Obiettivo:** non ripetere ogni volta "fai report + comunicazione + committa".
**Idee concrete:** una parola di vocabolario fa partire il protocollo di fine lavoro **giusto per la
modalità** del task (light → 1 riga log; standard → report; deep → tutto). Oggi servono più frasi.
**Tipo:** governance soft (voce vocabolario + §7).

### M4 — Enforcement via hook settings.json ⬜
**Obiettivo:** blindare gli errori costosi che una regola markdown non può garantire.
**Idee concrete:** spostare in hook di `settings.json` i controlli critici — es. verifica TEST vs
PROD prima di scrivere sul DB, `npm run validate` pre-commit, blocco commit su file LOCK senza
conferma. La macchina li esegue, non dipende dalla buona volontà dell'agente.
**Tipo:** **enforcement vero** (config tecnica, non markdown). Skill harness: `update-config`.

### M5 — Statistiche d'uso del sistema ⬜
**Obiettivo:** capire dove il sistema funziona e dove no, con numeri semplici.
**Idee concrete:** dai report e dal SESSION_LOG, contare cose come: sessioni light/standard/deep,
quali skill/zone si toccano più spesso, cause di errore ricorrenti (da `ERRORI_PROCESSO`), quante
volte un task è stato "alzato" di modalità in corsa. Input per le decisioni del senior.
**Tipo:** misto — raccolta soft, eventuale script di conteggio (enforcement leggero).

---

## Milestone future (il senior le attiva quando è il momento)

- **Catene di comandi all'avvio task** — sequenza che scatta quando parte una sessione (carica
  contesto, mostra checklist, imposta modalità). Dipende da M4: senza hook è solo un elenco che
  l'agente *dovrebbe* seguire. Da fare dopo che M4 ha dimostrato che gli hook funzionano nel workflow.
- **Integrazione con issue/PR** — collegare follow-up e report a issue GitHub. Enterprise-grade,
  non urgente per un solo sviluppatore.
- **Metriche di successo del sistema** — oltre alle statistiche d'uso (M5), misurare se il sistema
  *riduce davvero* i giri di correzione (prima/dopo). Richiede M5 attiva da un po'.

---

## Log idee (append-only — i Meta junior scrivono qui)

> Una riga per idea. Formato: `GG-MM-AA · [automazione|statistica|tecnica|raffinamento] · idea — perché`.
> Non cancellare: il senior pota da qui spostando le idee mature nelle milestone.

- 29-05-26 · [raffinamento] · creato questo file con M1–M5 + ruolo junior/senior — origine analisi agente revisore skill system v0 + decisione Matteo
- 29-05-26 · [raffinamento] · mockup HTML multi-stato prima dell'esecutore — Matteo «quasi sempre» per scelte UX; già in PREPARA_PROMPT §1.B; alimenta M1
