# Sessioni — 25-05-26

> Indice per agenti. Report completi nella stessa cartella. Cronologia globale: [SESSION_LOG.md](../../SESSION_LOG.md) · Debiti: [FOLLOW_UP.md](../../FOLLOW_UP.md)

## Sintesi giornata

Nascita **Pagina Prenota v2** + admin **Personalizza form**: card tipologie, sottotab orizzontali, griglia compose ingredienti, menù preselezionati; in parallelo **Menu QR** modale unificato, filtri ingredienti, foto categoria Prenota.

## Entra qui se lavori su…

| Tema | Utile | Report di partenza |
|------|-------|-------------------|
| Architettura Prenota v2 + Personalizza form | Sì | [Report pagina Prenota v2](./Report-pagina-prenota-v2-admin-personalizza-form.md) |
| Sottotab card scrollabili | Sì | [Report sottotab orizzontali](./Report-sottotab-orizzontali-prenota-v2.md) |
| Griglia «Componi il tuo menù» | Sì | [Report menu compose cards](./Report-menu-compose-cards.md) |
| Modale Menu QR per-QR | Sì | [Report modale unificato](./Report-menu-qr-modale-unificato-per-qr.md) |

## Report per gruppo

### Pagina Prenota v2 — pubblico e admin
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-pagina-prenota-v2-admin-personalizza-form.md](./Report-pagina-prenota-v2-admin-personalizza-form.md) | ✅ | Card tipologie, sidebar riepilogo, pannello Personalizza form | 137 test |
| [Report-prenota-v2-ui-sessione-25-05-26.md](./Report-prenota-v2-ui-sessione-25-05-26.md) | ✅ | UI form, menù compose, layout mobile, picker data/ora | Commit `2ec770a`–`09a574e` |
| [Report-prenota-v2-fix-admin-panel.md](./Report-prenota-v2-fix-admin-panel.md) | ✅ | Rimosso select tipologia mutabile nel panel | Fix design |
| [Report-sottotab-orizzontali-prenota-v2.md](./Report-sottotab-orizzontali-prenota-v2.md) | ✅ | `sub_tabs[]` preset/manuale, card scroll | Parse DB |
| [Report-menu-compose-cards.md](./Report-menu-compose-cards.md) | ✅ | `BookingMenuComposeGrid` / card categoria | +7 test |
| [Report-menu-preselezionati-descrizione-fisso.md](./Report-menu-preselezionati-descrizione-fisso.md) | ✅ | `description`, `is_fixed_menu` su preset staff | JSON settings |
| [Report-foto-categoria-menu-prenota.md](./Report-foto-categoria-menu-prenota.md) | ✅ | `menu_categories.image_url` admin Tab Menu | Migrazione 035 TEST |

### Menu QR e magazzino menu
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-menu-qr-modale-unificato-per-qr.md](./Report-menu-qr-modale-unificato-per-qr.md) | ✅ | Config per singolo QR; doppio Salva | Migrazione 036 |
| [Report-menu-qr-filtri-e-ui-modale.md](./Report-menu-qr-filtri-e-ui-modale.md) | ✅ | Filtri ingredienti 036/037; fix prod carosello | TEST+PROD |
| [Report-refactor-menu-grouping-centralizzazione.md](./Report-refactor-menu-grouping-centralizzazione.md) | ✅ | `menuCatalogGrouping.ts` centralizzato | Subtitle N ingredienti |

## Asset locali

| Cartella | Contenuto |
|----------|-----------|
| [Pagina Prenota v.2/](./Pagina%20Prenota%20v.2/README.md) | Screenshot v1 vs v2 per confronto layout |

## Da non confondere

- **Personalizza form** (config vetrina Prenota) ≠ **Tab Menu / MenuPricesTab** (magazzino prezzi).
- **Menu QR** homepage ≠ **Pagina Prenota** — stesso catalogo ingredienti, storage e UI diversi.
