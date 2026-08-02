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

Gli **screenshot** non stanno qui: vanno in `docs/_lavoro/e2e-s4/corsia-<X>/`, che è una cartella
privata **non versionata**. I report la citano per percorso.

Quando ci sono tutti e quattro, si lancia il **prompt di consolidamento** (ultimo blocco del file dei
prompt): aggiorna `COLLAUDO_S4_CHECKLIST.md` e scrive il riepilogo finale. Il consolidamento gira
**da solo**, mai in parallelo con le corsie.
