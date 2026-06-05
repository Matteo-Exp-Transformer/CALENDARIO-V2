# Sessioni — 04-06-26

> Indice per agenti. Report completi nella stessa cartella. Cronologia globale: [SESSION_LOG.md](../../SESSION_LOG.md) · Debiti: [FOLLOW_UP.md](../../FOLLOW_UP.md)

## Sintesi giornata

Giornata **senior + Prenota**: pilota skill **Prenota-Skill**, hook v4 + guard PROD, chiusura runtime **FU-031** (edge TEST), **FU-032** nome locale 45 char, footer card **courses_label**, dossier evoluzione skill system.

## Entra qui se lavori su…

| Tema | Utile | Report di partenza |
|------|-------|-------------------|
| Skill entry Prenota + sistema didattico | Sì | [Report pilota context-knowledge](./Report-senior-context-knowledge-pilota-prenota-04-06-26.md) |
| Hook fine-chat / guard PROD | Sì | [Report hook v4](./Report-senior-hook-v4-guard-prod-04-06-26.md) |
| Limiti testo cliente + edge `create-booking` | Sì | [Report meta-hook runtime](./Report-meta-hook-controverifica-prenota-runtime-04-06-26.md) |
| Nome ristorante max 45 | Sì | [Report FU-032](./Report-fu-032-restaurant-name-45-04-06-26.md) |
| Numero portate su card sottotab | Sì | [Report courses_label](./Report-courses-label-card-sottotab-prenota-04-06-26.md) |
| Evoluzione skill system (input senior) | Sì | [Dossier senior](./Dossier-senior-evoluzione-skill-04-06-26.md) |

## Report per gruppo

### Pagina Prenota — limiti e UI pubblica
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-fu-031-limiti-cliente-prenota-04-06-26.md](./Report-fu-031-limiti-cliente-prenota-04-06-26.md) | 🔶 | Verifica cap UI OK; edge TEST non rifiutava oltre cap | Report Verifica **non chiuso**; chiusura nella sessione hook stesso giorno |
| [Report-fu-032-restaurant-name-45-04-06-26.md](./Report-fu-032-restaurant-name-45-04-06-26.md) | ✅ | Anagrafica N/45, clamp lettura, h1 Prenota | Commit `a79a5af`; **FU-032 Fatto** |
| [Report-courses-label-card-sottotab-prenota-04-06-26.md](./Report-courses-label-card-sottotab-prenota-04-06-26.md) | ✅ | Footer card: portate sx, prezzo «a persona» dx | QA Matteo OK; commit `a79a5af` |
| [Report-meta-hook-controverifica-prenota-runtime-04-06-26.md](./Report-meta-hook-controverifica-prenota-runtime-04-06-26.md) | ✅ | Deploy edge v7 TEST; ospiti 110; **FU-031** chiuso | Commit `147145d`…`5445640`; **FU-034** PROD aperto |

### Meta senior — skill system, hook, didattico
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-senior-context-knowledge-pilota-prenota-04-06-26.md](./Report-senior-context-knowledge-pilota-prenota-04-06-26.md) | ✅ | Creato `docs/Prenota-Skill/` + piano didattico | Commit `e66c0ae`/`fad207f`/`188b8a6`/`558b6fc`; solo docs |
| [Report-senior-hook-v4-guard-prod-04-06-26.md](./Report-senior-hook-v4-guard-prod-04-06-26.md) | ✅ | Hook v4 domande §11; guard PROD MCP/shell | Milestone mappatura aree **pianificata**, non eseguita |
| [Report-senior-controverifica-didattico-allineamento-v0-04-06-26.md](./Report-senior-controverifica-didattico-allineamento-v0-04-06-26.md) | ✅ | Controverifica didattico; template v0 hook allineati | `_skill-system-v0` gitignored |
| [Dossier-senior-evoluzione-skill-04-06-26.md](./Dossier-senior-evoluzione-skill-04-06-26.md) | 📋 | Dossier per sessione senior evoluzione skill | Nessun codice; input revisore comunicazione |

## Da non confondere

- **FU-031** (form cliente) ≠ **FU-032** (nome locale admin) ≠ **FU-030** (cap ingredienti Tab Menu, ancora aperto).
- Il report FU-031 Verifica è **parziale**; la chiusura runtime è nel report **meta-hook-controverifica** della stessa data.
