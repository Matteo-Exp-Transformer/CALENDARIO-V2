# Studio delle risposte — sedute fantasticazione / immaginazione (v0 bozza)

> **Stato:** bozza viva · **non** apre `WP-1` · **non** è PROVA · **non** promuove Persona.
> **Funzione:** smistare gli agenti che devono **studiare** (non solo condurre) le chat di
> fantasticazione, e raccogliere dati sui **metodi di studio** usati.
> **Owner intent (git):** questo file. Dettaglio operativo + log = pacchetto privato owner Matteo.
> **Creato:** 10-08-26 · idea `IDEA-MSS-10`.

## A cosa serve

Le sedute CFG-* già raccolgono verbatim, evals e ponte §6-ter. Qui si aggiunge un giro
**meta**: non solo “cosa ha detto Matteo”, ma **come l’agente lo ha studiato**, così il metodo
di lettura cresce con i dati (constant comparison leggera).

Tre piani distinti (non fondere):

| Piano | Domanda | Dove vive |
|---|---|---|
| **A — Fonte** | Cosa ha scritto Matteo? | spunti `_lavoro` verbatim |
| **B — Lettura** | Cosa si osserva senza inventare? | analisi / memo / ipotesi falsificabili |
| **C — Meta-studio** | Quale metodo di studio ha usato l’agente? Cosa ha funzionato? | log del pacchetto privato |

## Quando caricare

Se il task è **analizzare / studiare / riusare** risposte di sedute immaginazione (non condurre
una nuova seduta), dopo `METASKILL_SYSTEM_SKILL.md` e `TIPO_SEDUTA_FANTASTICAZIONE_V0.md`
caricare il pacchetto privato:

`docs/_lavoro/Per matteo/Metaskillsystem-Owner-Matteo/Tipo di sedute/Studio-Risposte-v0/`

Se la seduta tocca dati personali, caricare anche la Bussola. Le regole di prova restano lì.

## Coerenza con il sistema già vivo

- Assi Persona / Sistema / Output restano separati.
- Capsula `mss.session/0.1.1` a chiusura se la chat è sostanziale; `packages_loaded` può citare
  `studio-risposte-fantasticazione` + revisione del pacchetto.
- Additività: questo studio **somma** segnali; non sostituisce verbali, INT_04, altre capsule.
- `external_release: forbidden` sul dettaglio; report git resta sintetico.
- Nessuna diagnosi, Big Five, Reid, fusione in INT_03 / albero.

## Cosa NON fare

- Trasformare densità narrativa in livelli Persona.
- Parafrasare i verbatim e citarli come parole sue.
- Chiudere il codice di lettura troppo presto (la bozza deve espandersi).
- Aprire `WP-1` da soli.

## Pacchetto privato (indice)

| File | Ruolo |
|---|---|
| `README.md` | ingresso agenti |
| `METODO_STUDIO_V0.md` | metodo M espandibile (passi + lacune da raccogliere) |
| `LOG_METODI_STUDIO.md` | append-only: ogni sessione di studio = 1 blocco |
| `MEMO_SEED_10-08-26.md` | primo memo di prova (seed) |
| `CRITERI_VALUTAZIONE_CONDUTTORE_V0.md` | griglia valutazione operato conduttore (caso studio) |
| `Prompt-Valutazione-Conduttore-caso-studio.md` | prompt chat parallela |

**Primo caso studio pianificato:** seduta S-G (CFG-02 post S-F) + valutazione conduttore in chat parallela.

*Fine bozza intent 10-08-26 (rev. criteri conduttore).*
