# Decisioni T12 — Q-A / Q-B / Q-C (25-08-2026)

> Annotazione di seduta. Non è owner di stato (`PLAN_V0.md` resta owner).
> Serve a rivedere queste scelte in un ciclo successivo senza ricostruirle dalla chat.

| ID | Domanda | Decisione Matteo | Default del prompt | Effetto sul ciclo |
|---|---|---|---|---|
| **Q-A** | Indice report: vista generate o solo sync? | **genera vista** | genera vista | `M-D14-INDEX` estende `views.mjs` + test nominato |
| **Q-B** | Estendere denylist N4 oltre casi PROVATI? | **No** (T12) → **Sì in esecuzione** (T13) | No | T12: debito handoff. **T13:** Matteo ha riaperto e autorizzato la chiusura in chat (mandato «Chiudere DAVVERO i tre residui post-T12» + «procedi») — `M-N4-EXTEND` **eseguito e PROVATO** |
| **Q-C** | Opzione B `--verify` multi-assertion? | **No** (T12) → **Sì in esecuzione** (T13) | No | T12: debito handoff. **T13:** stessa riapertura — `M-VERIFY-MULTI` **eseguito e PROVATO** (`--verify-assertion-index`) |

**Contesto T12:** orchestratore residui post-P2; HEAD Passo 0 `6f3edf5` su `env/test`.
**Segnale Matteo T12:** «sono daccordo con le decisioni» (default del plan Fase 1) → Q-B/Q-C No.

**Rettifica T13 (25-08-2026, chat chiusura residui):** Matteo ha riaperto Q-B e Q-C e li ha chiusi
come lavoro da completare nello stesso ciclo (insieme al bug lavagna WP-1→Fatte). Citazione
mandato: *«Chiudere DAVVERO i tre residui post-T12. Vietato rispondere «procedi e lascia debiti».
A T12 Q-B/Q-C erano No: ORA sono autorizzati come lavoro da completare.»* Seguito da *«procedi»*
dopo blocco Ask mode. Pilota D27/WP-1 resta **NO-GO**.

Se un domani si vuole cambiare: riaprire solo la riga interessata con nuovo Sì/No; non reinterpretare il silenzio.
