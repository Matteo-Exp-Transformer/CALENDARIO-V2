# Sessioni — 29-05-26

> Indice per agenti. Report completi nella stessa cartella. Cronologia globale: [SESSION_LOG.md](../../SESSION_LOG.md) · Debiti: [FOLLOW_UP.md](../../FOLLOW_UP.md)

## Sintesi giornata

Giornata più densa del periodo: **skill system** (modalità light/deep, template v0), **promo Personalizza form**, **validazione UX Prenota**, **mappature** Impostazioni↔Prenota e Menu QR, cicli **BookingRequestCard** e **Menu QR Fase 3**, **salvataggio admin** fase 1, card ingredienti scroll/overlay.

## Entra qui se lavori su…

| Tema | Utile | Report di partenza |
|------|-------|-------------------|
| Ciclo Menu QR completo (F1→F4) | Sì | [Mappa Menu QR](./Report-mappatura-menu-qr-admin-pubblico-29-05-26.md) → [Fase 3](./Report-fix-menu-qr-fase3-29-05-26.md) |
| Prezzo menù card calendario (digest) | Sì | [Report unificato BookingRequestCard](./Report-unificato-ciclo-booking-request-card-29-05-26.md) |
| Validazione submit Prenota (pulse, overlay) | Sì | [Report validazione UX](./Report-validazione-ux-prenota-29-05-26.md) |
| Salvataggio Impostazioni (footer, guard, autosave) | Sì | [Report ciclo salvataggio](./Report-ciclo-salvataggio-admin-29-05-26.md) |
| Promo in Personalizza form | Sì | [Report promo](./Report-promo-personalizza-form-29-05-26.md) |

## Report per gruppo

### Skill system (meta)
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-skill-system-template-e-snellimento-app-context-29-05-26.md](./Report-skill-system-template-e-snellimento-app-context-29-05-26.md) | ✅ | Template v0; 3 file context estratti; APP_CONTEXT snellito | Nessun `src/` |
| [Report-modalita-light-standard-deep-29-05-26.md](./Report-modalita-light-standard-deep-29-05-26.md) | ✅ | Protocollo modalità + `EVOLUZIONE_SKILLS.md` | Regole strutturali |
| [Report-meta-miglioria-skill-system-29-05-26.md](./Report-meta-miglioria-skill-system-29-05-26.md) | ✅ | 8 PROPOSTE da ciclo card ingredienti | Vocabolario Liv.1/2 |
| [prossimo prompt system migliorato.md](./prossimo%20prompt%20system%20migliorato.md) | 📋 | Note test skill prepara-prompt | Draft Matteo |
| [prossimoprompt.md](./prossimoprompt.md) | ↩️ | Duplicato note skill system | Usare file sopra |

### Promo Personalizza form
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-promo-personalizza-form-29-05-26.md](./Report-promo-personalizza-form-29-05-26.md) | ✅ | Promo spostate in Personalizza form; banner singolo | **FU-001** aperto |
| [Report-promo-multi-target-29-05-26.md](./Report-promo-multi-target-29-05-26.md) | ✅ | `booking_types[]` / `sub_tab_refs[]` | Follow-up promo |
| [Report-promo-conflitto-sostituzione-29-05-26.md](./Report-promo-conflitto-sostituzione-29-05-26.md) | ✅ | Modale Sostituisci/Annulla conflitto placement | QA «ottimo funziona» |
| [Report-revisione-verifica-promo-29-05-26.md](./Report-revisione-verifica-promo-29-05-26.md) | ✅ | Chiusura ciclo promo; helper morto rimosso | **FU-002/003** aperti |

### Validazione UX e palette Prenota
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-validazione-ux-prenota-29-05-26.md](./Report-validazione-ux-prenota-29-05-26.md) | ✅ | `noValidate`, pulse arancione, overlay portal | **FU-011/012/013 Fatto** |
| [Report-revisione-validazione-ux-prenota-29-05-26.md](./Report-revisione-validazione-ux-prenota-29-05-26.md) | ✅ | Approva con riserve | **FU-010** aperto |
| [Report-revisione-palette-prenota-due-layout-29-05-26.md](./Report-revisione-palette-prenota-due-layout-29-05-26.md) | ✅ | Bianco solo full-page; warm su striscia | **FU-014** aperto |

### Card ingredienti — ciclo prepare→exec→review
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-prepara-prompt-prenota-card-ingredienti-stack-29-05-26.md](./Report-prepara-prompt-prenota-card-ingredienti-stack-29-05-26.md) | 📋 | Prompt stacking card; solo docs | Non implementato in quella chat |
| [Report-prenota-card-ingredienti-scroll-overlay-29-05-26.md](./Report-prenota-card-ingredienti-scroll-overlay-29-05-26.md) | ✅ | Scroll 3 righe + overlay portal | Commit in chiusura |
| [Report-finale-ciclo-prepara-prompt-card-ingredienti-29-05-26.md](./Report-finale-ciclo-prepara-prompt-card-ingredienti-29-05-26.md) | ✅ | Chiusura ciclo completo | Template replicabile Menu QR |

### Mappatura Impostazioni ↔ Prenota
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-mappatura-impostazioni-prenota-29-05-26.md](./Report-mappatura-impostazioni-prenota-29-05-26.md) | ✅ | ~30 coppie; fix FU-007/008; revisione OK | **FU-009** aperto |

### Salvataggio admin
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-ciclo-salvataggio-admin-29-05-26.md](./Report-ciclo-salvataggio-admin-29-05-26.md) | ✅ | Footer compatto; guard; autosave debug | **FU-002** fase 1; **FU-004/005/006** |

### Card scorrevole admin
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-card-scorrevole-titolo-admin-29-05-26.md](./Report-card-scorrevole-titolo-admin-29-05-26.md) | ✅ | No prefill «Card scorrevole»; placeholder; riga lista | «lavoro ok» |

### Ciclo BookingRequestCard (prezzo digest)
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-mappatura-booking-request-card-29-05-26.md](./Report-mappatura-booking-request-card-29-05-26.md) | 📋 | Mappa campo-per-campo; INC-01… | Solo doc |
| [Report-revisione-mappatura-booking-request-card-29-05-26.md](./Report-revisione-mappatura-booking-request-card-29-05-26.md) | 📋 | Approva con riserve; handoff `menuPricing` | Revisione mappa |
| [Report-fix-menu-pricing-digest-29-05-26.md](./Report-fix-menu-pricing-digest-29-05-26.md) | ✅ | Policy DB vince; test INC-01/07 | **FU-015/016 Fatto** |
| [Report-revisione-fix-menu-pricing-digest-29-05-26.md](./Report-revisione-fix-menu-pricing-digest-29-05-26.md) | ✅ | **Approva**; QA browser €8/€13.98 | |
| [Report-unificato-ciclo-booking-request-card-29-05-26.md](./Report-unificato-ciclo-booking-request-card-29-05-26.md) | ✅ | Sintesi ciclo mappa→fix→rev | INC-03/04 fuori scope |

### Ciclo Menu QR (Fase 1–4)
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-mappatura-menu-qr-admin-pubblico-29-05-26.md](./Report-mappatura-menu-qr-admin-pubblico-29-05-26.md) | 📋 | 38 coppie; INC-01…16; query TEST | **FU-017/018/019** |
| [Report-revisione-mappatura-menu-qr-admin-pubblico-29-05-26.md](./Report-revisione-mappatura-menu-qr-admin-pubblico-29-05-26.md) | ✅ | 2° passaggio **Approva con riserve** | Handoff Fase 3 |
| [Report-fix-menu-qr-fase3-29-05-26.md](./Report-fix-menu-qr-fase3-29-05-26.md) | ✅ | Modale QR; validazione Salva; pubblico a tema | QA Matteo 30-05 |
| [Report-revisione-fix-menu-qr-fase4-30-05-26.md](./Report-revisione-fix-menu-qr-fase4-30-05-26.md) | ✅ | Revisione finale post-merge `main` | Ciclo chiuso; **FU-022** |

## Da non confondere

- **Pagina Prenota** (`/prenota`) ≠ **Menu QR** (`/menu`) — due cicli paralleli il 29-05.
- `prossimoprompt.md` è duplicato di `prossimo prompt system migliorato.md`.
- Catene tipiche: **prepare card ingredienti** → esecutore → finale; **mappa Menu QR** → rev F2 → F3 → F4 (file 30-05).
