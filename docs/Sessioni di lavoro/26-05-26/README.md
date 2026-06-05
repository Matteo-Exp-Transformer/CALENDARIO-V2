# Sessioni — 26-05-26

> Indice per agenti. Report completi nella stessa cartella. Cronologia globale: [SESSION_LOG.md](../../SESSION_LOG.md) · Debiti: [FOLLOW_UP.md](../../FOLLOW_UP.md)

## Sintesi giornata

Consolidamento **Personalizza form** (carosello, card scorrevole, salvataggio sezioni), **Prenota v2** UI menù/icone/header, **resolver `field_overrides`**, XOR card/carosello, analisi flusso onboarding admin.

## Entra qui se lavori su…

| Tema | Utile | Report di partenza |
|------|-------|-------------------|
| Editor carosello admin (foto-first) | Sì | [Report carosello editor](./Report-carosello-editor-per-slide-26-05-26.md) |
| Overlay carosello pubblico | Sì | [Report overlay campi](./Report-prenota-carosello-overlay-campi-26-05-26.md) |
| Resolver personalizzazioni live vs congelate | Sì | [Report resolver](./Report-resolver-field-overrides-pulizia-26-05-26.md) |
| Flusso dati admin → Prenota (analisi) | Sì | [Analisi flusso onboarding](./Analisi-flusso-admin-onboarding-prenota-26-05-26.md) |

## Report per gruppo

### Personalizza form — carosello e salvataggio
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-personalizza-form-carosello-help-26-05-26.md](./Report-personalizza-form-carosello-help-26-05-26.md) | ✅ | Editor carosello, help Card/Carosello, upload foto | Include rename Card scorrevole |
| [Report-carosello-editor-per-slide-26-05-26.md](./Report-carosello-editor-per-slide-26-05-26.md) | ✅ | `carousel_items[]` per slide; niente prezzo | Migrazione legacy |
| [Report-personalizza-form-salvataggio-sezioni-26-05-26.md](./Report-personalizza-form-salvataggio-sezioni-26-05-26.md) | ✅ | Salva/Annulla per sezione; footer globale | Rimosso «Conferma sfondo» |
| [Report-settings-save-ui-sottotab-26-05-26.md](./Report-settings-save-ui-sottotab-26-05-26.md) | ✅ | `SettingsSaveUi`; Salva sottotab su DB subito | Evita doppio Salva |

### Pagina Prenota — pubblico
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-prenota-carosello-overlay-campi-26-05-26.md](./Report-prenota-carosello-overlay-campi-26-05-26.md) | ✅ | Testi overlay da campi Personalizza form | No «Specialità della casa» |
| [Report-prenota-v2-menu-ui-26-05-26.md](./Report-prenota-v2-menu-ui-26-05-26.md) | ✅ | Menù mobile, sfondi preset, card preset | Commit `1c6cd81`… |
| [Report-prenota-v2-icone-responsive-26-05-26.md](./Report-prenota-v2-icone-responsive-26-05-26.md) | ✅ | Phosphor configurabili; header font/colore | Workflow Personalizza form |

### Resolver, validazione, analisi
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-resolver-field-overrides-pulizia-26-05-26.md](./Report-resolver-field-overrides-pulizia-26-05-26.md) | ✅ | Tracking personalizzazioni; dead code rimosso | Test resolver |
| [Report-xor-card-carosello-validazione-responsive-26-05-26.md](./Report-xor-card-carosello-validazione-responsive-26-05-26.md) | ✅ | Una sola presentazione card XOR carosello | Da analisi onboarding |
| [Analisi-flusso-admin-onboarding-prenota-26-05-26.md](./Analisi-flusso-admin-onboarding-prenota-26-05-26.md) | 📋 | Definizione flusso dati corretto admin→Prenota | Solo analisi |
| [Analisi-flusso-onboarding-admin-prenota.md](./Analisi-flusso-onboarding-admin-prenota.md) | 📋 | Duplicato/analisi parallela stesso tema | Reference |

## Da non confondere

- Due file **Analisi flusso** coprono lo stesso perimetro (onboarding); usare quello con suffisso data come primario.
- **Carosello** (solo immagini in Prenota) ≠ **card scorrevole** (menù compose).
