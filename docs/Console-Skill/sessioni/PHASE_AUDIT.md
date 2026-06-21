# Phase Audit — esecuzione del master-plan (audit trail per fase)

> **Obbligatorio.** Per ogni fase `Fi` del `MASTERPLAN_CONSOLE.md`, l'Orchestrator compila un blocco
> qui sotto, così l'intero lavoro è **ricostruibile e revisionabile** dopo, anche con Matteo che ha
> dato consenso pieno (DEC-013). Niente fase "silenziosa".
>
> **Regola:** non si committa una fase il cui blocco di audit non è compilato (almeno fino a "Verdetto").

## Indice fasi

| Fase | Obiettivo | Esecutore | Revisore | Verdetto | Commit | DEC collegate |
|------|-----------|-----------|----------|----------|--------|---------------|
| _(vuoto — si riempie a esecuzione)_ | | | | | | |

---

## Template blocco di fase (copia per ogni Fi)

```markdown
### Fase F<i> — <titolo>
- **Obiettivo / effetto:** <1–2 righe>
- **Modalità:** light / standard / deep
- **Dipendenze:** <fase precedente / risposta Matteo / DEC-NNN>

**Esecutore**
- Prompt usato: <link al MASTERPLAN_CONSOLE.md §F<i> o estratto>
- Sintesi di cosa ha fatto: <…>
- File toccati: <path…>
- Decisioni autonome prese: <DEC-NNN, DEC-MMM …> (registrate nel DECISION_LOG)
- Scritture DB: <nessuna | sandbox console-* via MCP CONSOLE, get_project_url=docnnernvp confermato>
- Plan per Matteo generati: <PLAN-DB-NNN | nessuno>

**Revisore (controverifica)**
- Done-criteria verificati: <elenco ✓/✗>
- Regole d'oro rispettate: <✓/✗ con note>
- Test/lint/typecheck: <esito>
- Regressioni controllate: <aree>
- **Verdetto:** 🟢 VERDE / 🔴 ROSSO → <findings se rosso>
- Ri-lavorazioni: <round 2…, se servono>

**Chiusura fase**
- **Commit:** <hash> — <messaggio>
- Riga aggiunta a SESSION_LOG.md: <sì>
- Follow-up aperti: <FU-CONSOLE-NNN | nessuno>
```
