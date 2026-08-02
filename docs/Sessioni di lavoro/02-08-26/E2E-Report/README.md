# Report del collaudo e2e S4 — quattro corsie

Qui atterrano i report degli agenti tester lanciati con
[PROMPT_AGENTI_E2E_S4.md](../../../Testing-Skill/PROMPT_AGENTI_E2E_S4.md), secondo il piano
[PIANO_E2E_AGENTI_S4.md](../../../Testing-Skill/PIANO_E2E_AGENTI_S4.md).

| File | Corsia | Copre |
|------|--------|-------|
| `CORSIA_A.md` | A — Le due viste della mappa | checklist §2.1 |
| `CORSIA_B.md` | B — Servizio dal vivo | checklist §2.2, §3, §5, §6 + voce briefing di §2.3 |
| `CORSIA_C.md` | C — Tavolate su più tavoli + responsive | checklist §2.3, §9 |
| `CORSIA_D.md` | D — Capienza, form pubblico, Classic | checklist §4, §8, §7 |

Giro 2 (fix) e revisione:

| File | Cosa contiene |
|------|---------------|
| `SINTESI.md` | Consolidamento del giro 1: 52 voci, difetti con ID (S4-BUG-1 … S4-NOTE-11) |
| `FIX_1_OROLOGIO.md` | Stati live dei tavoli e ora di punta allineati all'orologio |
| `FIX_2_ASSEGNAZIONI.md` | Turni residui, fascia chiusa, archiviazione al checkout, forzatura visibile |
| `INDAGINE_APERTE.md` | Le cinque domande aperte: risposta + proposta + chi decide |
| `REVISIONE_FIX.md` | **Revisione d'insieme del giro 2** + il blocco della migrazione 066 |

Gli **screenshot** non stanno qui: vanno in `docs/_lavoro/e2e-s4/corsia-<X>/`, che è una cartella
privata **non versionata**. I report la citano per percorso.

Quando ci sono tutti e quattro, si lancia il **prompt di consolidamento** (ultimo blocco del file dei
prompt): aggiorna `COLLAUDO_S4_CHECKLIST.md` e scrive il riepilogo finale. Il consolidamento gira
**da solo**, mai in parallelo con le corsie.
