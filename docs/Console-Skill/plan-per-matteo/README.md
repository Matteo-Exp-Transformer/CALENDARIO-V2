# Plan per Matteo — modifiche DB/schema

> L'agente **non esegue** modifiche di schema (DDL/RLS/migrazioni/colonne nuove) né scritture su
> tenant non-sandbox. Quando servono, le **descrive** in un file qui; **Matteo le esegue**.

## Quando si crea un file qui

- Serve una **colonna/tabella nuova**, una **migrazione**, una modifica **RLS**.
- Serve scrivere dati su un **tenant non sandbox** (tenant reali di Matteo).
- Serve aggiungere una **chiave** al registro impostazioni (richiede codice app).

(Le scritture di **dati** sui soli sandbox `console-classic`/`console-pro` le fa l'agente
direttamente: non serve un plan.)

## Convenzione di naming

`PLAN-DB-<NNN>-<slug-breve>.md` — NNN progressivo (001, 002, …).

## Template

```markdown
# PLAN-DB-<NNN> — <titolo>

**Stato:** da eseguire · **Ambiente:** TEST docnnernvp · **Data:** <YYYY-MM-DD>

## Obiettivo
<perché serve, in 2 righe — effetto concreto per la Console>

## Modifica proposta (SQL / migrazione)
```sql
-- DDL o UPDATE proposto
```

## Tabelle/colonne toccate
- <tabella.colonna> — <cosa cambia>

## Impatto / rischi
- <cosa potrebbe rompersi; aree app coinvolte>

## Come verificare dopo (su TEST)
- <query o passo per confermare che ha funzionato>

## Note per Matteo
- <conferme richieste, dubbi>
```
