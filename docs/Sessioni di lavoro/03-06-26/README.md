# Sessioni — 03-06-26

> Indice per agenti. Report completi nella stessa cartella. Cronologia globale: [SESSION_LOG.md](../../SESSION_LOG.md) · Debiti: [FOLLOW_UP.md](../../FOLLOW_UP.md)

## Sintesi giornata

**Limiti testo Pagina Prenota** (vetrina con contatori, cliente cap silenzioso), **layout stack card ingredienti**, evoluzione **hook stop v3** + propagazione template v0, allineamento skill layout post-merge.

## Entra qui se lavori su…

| Tema | Utile | Report di partenza |
|------|-------|-------------------|
| Cap caratteri Personalizza form / form cliente | Sì | [Report limiti testo](./Report-prenota-limiti-testo-03-06-26.md) |
| Tuning numeri (24/79, promo 200, titolo 50…) | Sì | [Report tuning limiti](./Report-prenota-limiti-tuning-03-06-26.md) |
| Layout righe ingredienti nel pannello categoria | Sì | [Report layout card ingredienti](./Report-prenota-layout-card-ingredienti-03-06-26.md) |
| Hook fine-chat + regola allineamento skill | Sì | [Report meta hook followup](./Report-meta-senior-hook-followup-e-mappa-cursor-03-06-26.md) |

## Report per gruppo

### Limiti testo Prenota
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-prenota-limiti-testo-03-06-26.md](./Report-prenota-limiti-testo-03-06-26.md) | ✅ | Costanti centrali; contatori admin; cap silenzioso cliente | Commit `111277e`+docs; **FU-030/031/032** aperti; canonical SESSION_LOG |
| [Report-limiti-testo-prenota-03-06-26.md](./Report-limiti-testo-prenota-03-06-26.md) | ✅ | Stessa sessione limiti; dettaglio hook FINE-SESSIONE | Nome file alternativo; contenuto parallelo al report sopra |
| [Report-prenota-limiti-tuning-03-06-26.md](./Report-prenota-limiti-tuning-03-06-26.md) | ✅ | Calibrazione card 24/79, promo 200, titolo 50, cliente 550 | Post `820a223`; validate 284 |

### Layout card ingredienti
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-prenota-layout-card-ingredienti-03-06-26.md](./Report-prenota-layout-card-ingredienti-03-06-26.md) | ✅ | Stack titolo/descrizione + checkbox/prezzo + divisori | Commit `d76e251`/`bd8f3a5` |
| [Report-revisore-allineamento-skill-layout-ingredienti-03-06-26.md](./Report-revisore-allineamento-skill-layout-ingredienti-03-06-26.md) | ✅ | Skill layout §5/§7 allineata post-merge | Solo docs |

### Meta senior — hook e template
| Report | Stato | Effetto / task | Note |
|--------|-------|----------------|------|
| [Report-meta-senior-hook-followup-e-mappa-cursor-03-06-26.md](./Report-meta-senior-hook-followup-e-mappa-cursor-03-06-26.md) | ✅ | Hook `followup_message` v3; regola allineamento skill implicito | Playbook senior aggiornato |
| [Report-meta-senior-propagazione-template-v0.md](./Report-meta-senior-propagazione-template-v0.md) | ✅ | Template `_skill-system-v0` con CHIUSURA + hook | Template gitignored |

## Da non confondere

- Report **limiti** (numeri/costanti) ≠ report **layout ingredienti** (CSS righe pannello).
- SESSION_LOG cita anche sessioni «light» senza file dedicato in questa cartella (editor card chiusura, € nascosti, padding striscia).
