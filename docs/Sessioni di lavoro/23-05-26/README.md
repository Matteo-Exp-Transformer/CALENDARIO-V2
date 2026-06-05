# Sessioni — 23-05-26

> Indice per agenti. Report completi nella stessa cartella. Cronologia globale: [SESSION_LOG.md](../../SESSION_LOG.md) · Debiti: [FOLLOW_UP.md](../../FOLLOW_UP.md)

## Sintesi giornata

Prime sessioni versionate: **sicurezza DB PROD**, incident Impostazioni bloccate, **refactor promo menù** (rimozione vol-au-vent), layout **Calendario** responsive, pulizia dead code + skill system, scala tipografica.

> Sessioni 23–28 maggio: **nessuna riga FOLLOW_UP** strutturata (sistema nato ~29-05).

## Entra qui se lavori su…

| Tema | Utile | Report di partenza |
|------|-------|-------------------|
| Audit sicurezza RLS PROD | Sì | [Report audit sicurezza](./Report-audit-sicurezza-DB-prod.md) |
| Promo menù generiche / migrazione 029 | Sì | [Report refactor promo](./Report-refactor-promo-menu-rimozione-vol-au-vent.md) |
| Nome promo in prenotazione (snapshot) | Sì | [Report label promo](./Report-promo-menu-label-prenotazione.md) |
| Tab Calendario admin responsive | Sì | [Report layout calendario](./Report-layout-calendario-responsive.md) |

## Report per gruppo

### Sicurezza e incidenti PROD
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-audit-sicurezza-DB-prod.md](./Report-audit-sicurezza-DB-prod.md) | ✅ | 5 falle critiche trovate + hardening | Solo audit/fix DB |
| [Report-incident-prod-impostazioni-bloccate.md](./Report-incident-prod-impostazioni-bloccate.md) | ✅ | Diagnosi pagina Impostazioni bloccata post-migrazione 026 | Severity alta |

### Promo menù
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-refactor-promo-menu-rimozione-vol-au-vent.md](./Report-refactor-promo-menu-rimozione-vol-au-vent.md) | ✅ | `booking_menu_promos`; niente omaggio automatico | Migrazione 029; `a78e41d` |
| [Report-promo-menu-label-prenotazione.md](./Report-promo-menu-label-prenotazione.md) | ✅ | Campo nome promo admin + snapshot su prenotazione | `02d0772` |
| [Report-sessione-chat-admin-ux-promo-23-05-26.md](./Report-sessione-chat-admin-ux-promo-23-05-26.md) | ✅ | Riepilogo chat: nav, modal dettagli, promo UX | Branch `Sviluppo-Dashboard-laterale` |
| [Report-sessione-promo-menu-db-allineamento.md](./Report-sessione-promo-menu-db-allineamento.md) | ✅ | Allineamento DB test/prod 028–029 | verificato 05-06-26: a78e41d su main, migrazione 029 |

### UI admin e skill system
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-layout-calendario-responsive.md](./Report-layout-calendario-responsive.md) | ✅ | Celle mese più alte; tab full-width; titolo responsive | Solo UI Calendario |
| [Report-revisione-responsive-scala-tipografica.md](./Report-revisione-responsive-scala-tipografica.md) | ✅ | Scala tipografica centralizzata in `index.css` | Sub-agent mappatura |
| [Report-pulizia-dead-code-e-allineamento-skill.md](./Report-pulizia-dead-code-e-allineamento-skill.md) | ✅ | Dead code rimosso; skill snellite post-merge sidebar | Commit + push |

## Da non confondere

- **Refactor promo** (modello dati) ≠ **sessione chat** (riepilogo UX multi-area).
- SESSION_LOG 23-05 cita anche layout Calendario in ADMIN_CLASSIC_SKILL §4 senza file Report separato oltre a quello indicato.
