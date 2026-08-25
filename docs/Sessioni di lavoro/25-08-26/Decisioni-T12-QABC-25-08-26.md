# Decisioni T12 — Q-A / Q-B / Q-C (25-08-2026)

> Annotazione di seduta. Non è owner di stato (`PLAN_V0.md` resta owner).
> Serve a rivedere queste scelte in un ciclo successivo senza ricostruirle dalla chat.

| ID | Domanda | Decisione Matteo | Default del prompt | Effetto sul ciclo |
|---|---|---|---|---|
| **Q-A** | Indice report: vista generate o solo sync? | **genera vista** | genera vista | `M-D14-INDEX` estende `views.mjs` + test nominato |
| **Q-B** | Estendere denylist N4 oltre casi PROVATI? | **No** | No | `M-N4-EXTEND` **non** eseguito; debito resta in handoff |
| **Q-C** | Opzione B `--verify` multi-assertion? | **No** | No | `M-VERIFY-MULTI` **non** eseguito; debito resta in handoff |

**Contesto:** orchestratore T12 residui post-P2; HEAD Passo 0 `6f3edf5` su `env/test`.
**Segnale Matteo:** «sono daccordo con le decisioni» (default del plan Fase 1).

Se un domani si vuole cambiare: riaprire solo la riga interessata con nuovo Sì/No; non reinterpretare il silenzio.
