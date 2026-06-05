# Sessioni — 31-05-26

> Indice per agenti. Report completi nella stessa cartella. Cronologia globale: [SESSION_LOG.md](../../SESSION_LOG.md) · Debiti: [FOLLOW_UP.md](../../FOLLOW_UP.md)

## Sintesi giornata

**Ciclo sfondo Pagina Prenota** (fixed full-page, asset sfondo3, padding, header, loop admin — QA chiusa), **viewport menu responsive** (#3b/#6, FU-024/025/027), **meta-analisi routing Prenota vs Menu QR** (revert Prompt B #8), grilletti skill senior.

## Entra qui se lavori su…

| Tema | Utile | Report di partenza |
|------|-------|-------------------|
| Chiusura ciclo sfondo Prenota (QA OK) | Sì | [Report finale ciclo sfondo](./Report-finale-ciclo-prenota-sfondo-31-05-26.md) |
| Sfondo fixed + padding + header | Sì | [Report verifica header](./Report-verifica-prenota-header-personalizza-form-31-05-26.md) |
| Viewport responsive Menu QR + admin | Sì | [Report fix viewport](./Report-fix-viewport-menu-responsive-31-05-26.md) |
| Errore fix su QR invece di Prenota (#8) | Sì | [Meta-analisi routing](./Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md) |

## Report per gruppo

### Ciclo sfondo Pagina Prenota (chiuso ✅)
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-finale-ciclo-prenota-sfondo-31-05-26.md](./Report-finale-ciclo-prenota-sfondo-31-05-26.md) | ✅ | Sintesi QA: fixed+cover, padding, header, loop admin | FU-024/025/027 OK; FU-021 annullato |
| [Report-verifica-prenota-header-personalizza-form-31-05-26.md](./Report-verifica-prenota-header-personalizza-form-31-05-26.md) | ✅ | Header `px-8 md:px-10`; fix loop promo/autosave | QA Matteo ✅ |
| [Report-prenota-sfondo-fixed-padding-31-05-26.md](./Report-prenota-sfondo-fixed-padding-31-05-26.md) | ↩️ | Fixed+cover; asset sfondo3; padding ↑ | verificato 05-06-26: assorbito da verifica-header + finale ciclo sfondo |
| [Report-integrazione-asset-sfondo-prenota-prova-31-05-26.md](./Report-integrazione-asset-sfondo-prenota-prova-31-05-26.md) | ✅ | WebP full-01…04 da PNG prove | QA visivo ⬜ in report |
| [Report-fix-prenota-sfondo-display-hero-31-05-26.md](./Report-fix-prenota-sfondo-display-hero-31-05-26.md) | ✅ | Hero `cover` senza banda crema | Step intermedio ciclo |
| [Report-fix-prenota-footer-scroll-sfondo-31-05-26.md](./Report-fix-prenota-footer-scroll-sfondo-31-05-26.md) | ✅ | Tile/gradiente `absolute` scrollabile | Precursore FU-028 |
| [Report-fix-prenota-mobile-sfondo-scroll-31-05-26.md](./Report-fix-prenota-mobile-sfondo-scroll-31-05-26.md) | ✅ | `100lvh` Android Chrome; merge main | Commit `cd10c64`; FU-028 rimosso |

### Viewport menu + admin scroll
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-fix-viewport-menu-responsive-31-05-26.md](./Report-fix-viewport-menu-responsive-31-05-26.md) | ✅ | Breakpoint 520/1050; freeze QR; unify Prenota | **FU-024/025/027 Fatto** |
| [Report-fix-menu-qr-desktop-freeze-31-05-26.md](./Report-fix-menu-qr-desktop-freeze-31-05-26.md) | ✅ | `PUBLIC_MENU_CONTENT_MAX_WIDTH` ~1024px | No commit su richiesta |
| [Report-fix-menu-admin-scroll-modale-31-05-26.md](./Report-fix-menu-admin-scroll-modale-31-05-26.md) | ✅ | Scroll form categorie; loop modale QR | QA OK; KO #3b/#6/#8 residui |

### Prompt B #8 — errore routing (revert)
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Prompt-B-menu-qr-footer-scroll-31-05-26.md](./Prompt-B-menu-qr-footer-scroll-31-05-26.md) | 📋 | Prompt esecutore #8 sfondo scroll QR | Target errato |
| [Report-fix-menu-qr-footer-scroll-31-05-26.md](./Report-fix-menu-qr-footer-scroll-31-05-26.md) | ↩️ | Layer `fixed` su `PublicMenuPage` poi **revert** | QA revocato |
| [Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md](./Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md) | 📋 | Diagnosi misrouting Prenota↔QR | **FU-021** annullato |

### Meta skill system
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-revisione-senior-skill-system-31-05-26.md](./Report-revisione-senior-skill-system-31-05-26.md) | ✅ | Grilletti avvio; triage 9 proposte | Regola Prenota-vs-QR |

## Da non confondere

- Il fix **#8 footer scroll** era su **Menu QR**; il sintomo era su **Pagina Prenota** → revert + nuovo ciclo Prenota.
- **Report finale ciclo sfondo** è il punto di ingresso per lo stato QA; i singoli fix sono step intermedi.
