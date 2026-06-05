# Sessioni — 05-06-26

> Indice per agenti. Report completi nella stessa cartella. Cronologia globale: [SESSION_LOG.md](../../SESSION_LOG.md) · Debiti: [FOLLOW_UP.md](../../FOLLOW_UP.md)

## Sintesi giornata

Due filoni su **Pagina Prenota**: (1) tentativo feature **ordine categorie** `category_order_keys` con regressione griglia compose non risolta; (2) **fix capability-driven** che sblocca il menù per tipologia «tavolo» + fondamenta scalabili. Il secondo ha chiuso **FU-035**; il primo resta storico (**FU-035-storico**).

## Entra qui se lavori su…

| Tema | Utile | Report di partenza |
|------|-------|-------------------|
| Griglia ingredienti vuota dopo card+preset | Sì | [Report capability-driven](./Report-tipologie-capability-driven-Fase1-2-05-06-26.md) |
| Frecce ordine categorie admin | Sì | [Report ordine categorie (storico)](./Report-ordine-categorie-prenota-bug-griglia-05-06-26.md) |
| Residui «decidi per nome» nel pubblico | Sì | [Report capability-driven](./Report-tipologie-capability-driven-Fase1-2-05-06-26.md) §10 → **FU-036** |

## Report per gruppo

### Ordine categorie + bug griglia (tentativo non chiuso)
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-ordine-categorie-prenota-bug-griglia-05-06-26.md](./Report-ordine-categorie-prenota-bug-griglia-05-06-26.md) | ↩️ | Frecce admin `category_order_keys`; griglia compose ancora vuota | Non accettato; no commit; **superato** dal fix capability-driven |

### Tipologie capability-driven (Fase 1–2)
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-tipologie-capability-driven-Fase1-2-05-06-26.md](./Report-tipologie-capability-driven-Fase1-2-05-06-26.md) | ✅ | Menù visibile per capacità (card+preset), non per nome tipologia | QA Matteo OK; commit `67d3df9`/`852f0a7`/`08b2bb4`; **FU-035 Fatto**; Fase 3/4 non eseguite; **FU-036** aperto |

## Da non confondere

- **Ordine categorie** (admin frecce, `category_order_keys`) ≠ **gate menù capability** (chi vede la griglia compose).
- Il report «bug griglia» descrive il tentativo **prima** del fix capability-driven; per lo stato attuale leggere FOLLOW_UP **FU-035** / **FU-035-storico**.
