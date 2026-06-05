# Sessioni — 24-05-26

> Indice per agenti. Report completi nella stessa cartella. Cronologia globale: [SESSION_LOG.md](../../SESSION_LOG.md) · Debiti: [FOLLOW_UP.md](../../FOLLOW_UP.md)

## Sintesi giornata

**Menu QR Fase 1** (tabelle, bucket, pagine pubbliche), redesign homepage QR, sistema **`tenant_features`**, revisione **skill system** (DATA_FLOW, Marketing-Skill, SESSION_LOG), utility tipografiche.

## Entra qui se lavori su…

| Tema | Utile | Report di partenza |
|------|-------|-------------------|
| Prima implementazione Menu QR pubblico | Sì | [Report Menu QR Fase 1](./Report-menu-qr-pubblico-fase-1.md) |
| Layout/sfondo homepage QR | Sì | [Report redesign homepage](./Report-redesign-menu-qr-homepage.md) |
| Feature flag per edition/add-on | Sì | [Report tenant_features](./Report-tenant-features-system.md) |
| Skill system Plan 2 | Sì | [Report skill system revisione](./Report-skill-system-revisione.md) |

## Report per gruppo

### Menu QR — nascita e layout
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-menu-qr-pubblico-fase-1.md](./Report-menu-qr-pubblico-fase-1.md) | ✅ | `menu_qr_codes`, bucket foto, 3 pagine pubbliche | Migrazione 030 TEST; `e039bbc` |
| [Report-redesign-menu-qr-homepage.md](./Report-redesign-menu-qr-homepage.md) | ✅ | Migrazione 032 `menu_homepage_config` | `c56ae58` |
| [Report-menu-qr-homepage-layout-sessione.md](./Report-menu-qr-homepage-layout-sessione.md) | ✅ | Sfondi, tab sticky, carosello homepage | `a934f16`→`44f81c2` |
| [Report-adozione-utility-tipografiche.md](./Report-adozione-utility-tipografiche.md) | ✅ | Migrazione classi tipografiche admin | P3 logout + P2.B |

### Infrastruttura multi-tenant e skill
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-tenant-features-system.md](./Report-tenant-features-system.md) | ✅ | Tabella `tenant_features` + RPC | Migrazione 031 TEST |
| [Report-skill-system-revisione.md](./Report-skill-system-revisione.md) | ✅ | DATA_FLOW_SKILL, Marketing-Skill, SESSION_LOG | Plan 2; LOCK TenantContext |

## Asset locali

| Cartella | Contenuto |
|----------|-----------|
| [QR code menu/](./QR%20code%20menu/README.md) | Mock sfondi, foto piatti, esempi layout homepage QR |
| [esempi menu da fare/](./esempi%20menu%20da%20fare/) | Riferimenti visivi menu (non indicizzati) |

## Da non confondere

- **Fase 1 QR** (infra DB + route) ≠ **redesign homepage** (migrazione 032 aspetto).
- Pagina **Menu QR** (`/menu/:slug`) ≠ **Pagina Prenota** (`/prenota/:slug`).
