# Tracciabilità — come si revisiona TUTTO il lavoro Console

> **Priorità n.1 del branch** (DEC-013): ogni decisione e ogni azione di Orchestrator, Esecutori e
> Revisori deve restare **ricostruibile e revisionabile**. Matteo ha dato consenso pieno «per ora»:
> il contrappeso è che **niente accade in silenzio**. Questo file è il punto d'ingresso per la revisione.

---

## 1. I 5 registri (dove vive la verità)

| Registro | File | Cosa traccia |
|----------|------|--------------|
| **Decisioni** | `sessioni/DECISION_LOG.md` | ogni scelta non banale → `DEC-NNN` (chi, perché, prova, stato) |
| **Audit di fase** | `sessioni/PHASE_AUDIT.md` | per ogni fase: esecutore, revisore, verdetto, commit, DEC collegate |
| **Log sessioni** | `sessioni/SESSION_LOG.md` | indice cronologico one-liner |
| **Report** | `sessioni/Report-*.md` | dettaglio delle sessioni standard/deep |
| **Plan per Matteo** | `plan-per-matteo/PLAN-DB-*.md` | ogni modifica DB/schema proposta o eseguita |

A questi si aggiunge la **storia git** (commit per fase) e i **PLAN-DB** come prova delle scritture DB.

## 2. Catena di tracciabilità di una fase

```
MASTERPLAN_CONSOLE.md (F_i: obiettivo + prompt esecutore + prompt revisore + done-criteria)
   → Esecutore lavora → registra in PHASE_AUDIT (sintesi, file, scritture, DEC-NNN)
   → Revisore controverifica → verdetto 🟢/🔴 in PHASE_AUDIT
   → Orchestrator committa (hash) → riga in SESSION_LOG + DEC se ha deciso qualcosa
```
Da qualunque commit si risale alla fase, alla revisione e alle decisioni; da ogni `DEC-NNN` si arriva
alla prova (commit/file/plan).

## 3. Regole obbligatorie (valgono anche con consenso pieno di Matteo)

```
TRACE-1  Ogni decisione non banale → riga in DECISION_LOG.md (DEC-NNN) PRIMA o INSIEME all'azione.
TRACE-2  Ogni fase → blocco in PHASE_AUDIT.md compilato almeno fino al Verdetto, PRIMA del commit.
TRACE-3  Ogni scrittura DB → registrata: ambiente confermato (get_project_url=docnnernvp), tenant
         sandbox, query. Schema → sempre un PLAN-DB-NNN (mai DDL silenzioso).
TRACE-4  Ogni commit cita la fase (F_i) e le DEC rilevanti nel messaggio.
TRACE-5  Il Revisore NON modifica il codice: lascia un verdetto scritto. Esecutore e Revisore sono
         attori distinti (no auto-approvazione).
TRACE-6  Consenso pieno ≠ silenzio: si procede senza chiedere conferma, ma si LOGGA tutto.
         Se una scelta è irreversibile o fuori scope, si logga E si segnala a Cristiano.
```

## 4. Come Cristiano (o Matteo) revisiona tutto in 5 minuti

1. Apri `DECISION_LOG.md` → vedi tutte le decisioni e il perché.
2. Apri `PHASE_AUDIT.md` → per ogni fase: chi ha fatto, chi ha revisionato, verdetto, commit.
3. `git log --oneline` del branch → la sequenza dei commit per fase combacia con l'audit.
4. `plan-per-matteo/` → ogni tocco al DB ha un plan tracciato.
5. Dubbi su una scelta? Il `DEC-NNN` rimanda alla prova esatta.

> Se uno di questi anelli manca per una fase, quella fase **non è considerata chiusa**.
