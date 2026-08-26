# Indice report MSS (vista generata)

> **Vista derivata.** Non sposta file. Non è catalogo SEP né SESSION_LOG né masterplan.
> Decisione Q-A (25-08-26): **genera vista** — owner = filesystem `docs/Sessioni di lavoro`, non `PLAN_V0.md`.
> Storia: F2/M02 curato fino al 21-08-26; dal mandato `M-D14-INDEX` l'elenco fra marcatori è anti-stale.

## Limiti dichiarati

- Elenca **tutti** i `Report-*.md` sotto `docs/Sessioni di lavoro/` (anche fuori dominio MSS/SEP).
- **Non** include `Prompt-*.md`, `Verbale-*.md`, né path-prova con segmento `_…`.
- Non è inventario dell'intero monorepo fuori da quella cartella.
- Per gate/stato usare `PLAN_V0.md` / comandi (`npm run mss:status`, `npm run mss:query`), non questo file.
- Path relativi alla root del repo. I file restano dove sono.

## Come usare

1. Apri il path nella colonna **Path**.
2. Dopo aver aggiunto/rimosso un `Report-*.md` sotto le sessioni: `npm run generate:mss:views`.
3. Controllo: `npm run validate:mss:views` (rosso = indice stale rispetto al disco).

---

<!-- mss:generated report-index inizio -->
> Generato da `npm run generate:mss:views` scansionando il filesystem owner [`docs/Sessioni di lavoro`](../../../Sessioni%20di%20lavoro/).
> **Owner = filesystem** (non `PLAN_V0.md`): elenco di `Report-*.md` sotto le sessioni, senza metadati inventati.
> Se il controllo anti-stale e rosso, rigenerala; non correggerla a mano.

## Inventario `Report-*.md` (da disco)

Raggruppato per cartella giorno. Nome file = etichetta (nessun «tipo» dedotto). Path relativi alla root del repo.

## 23-05-26

| File | Path |
|---|---|
| Report-audit-sicurezza-DB-prod.md | `docs/Sessioni di lavoro/23-05-26/Report-audit-sicurezza-DB-prod.md` |
| Report-incident-prod-impostazioni-bloccate.md | `docs/Sessioni di lavoro/23-05-26/Report-incident-prod-impostazioni-bloccate.md` |
| Report-layout-calendario-responsive.md | `docs/Sessioni di lavoro/23-05-26/Report-layout-calendario-responsive.md` |
| Report-promo-menu-label-prenotazione.md | `docs/Sessioni di lavoro/23-05-26/Report-promo-menu-label-prenotazione.md` |
| Report-pulizia-dead-code-e-allineamento-skill.md | `docs/Sessioni di lavoro/23-05-26/Report-pulizia-dead-code-e-allineamento-skill.md` |
| Report-refactor-promo-menu-rimozione-vol-au-vent.md | `docs/Sessioni di lavoro/23-05-26/Report-refactor-promo-menu-rimozione-vol-au-vent.md` |
| Report-revisione-responsive-scala-tipografica.md | `docs/Sessioni di lavoro/23-05-26/Report-revisione-responsive-scala-tipografica.md` |
| Report-sessione-chat-admin-ux-promo-23-05-26.md | `docs/Sessioni di lavoro/23-05-26/Report-sessione-chat-admin-ux-promo-23-05-26.md` |
| Report-sessione-promo-menu-db-allineamento.md | `docs/Sessioni di lavoro/23-05-26/Report-sessione-promo-menu-db-allineamento.md` |

## 24-05-26

| File | Path |
|---|---|
| Report-adozione-utility-tipografiche.md | `docs/Sessioni di lavoro/24-05-26/Report-adozione-utility-tipografiche.md` |
| Report-menu-qr-homepage-layout-sessione.md | `docs/Sessioni di lavoro/24-05-26/Report-menu-qr-homepage-layout-sessione.md` |
| Report-menu-qr-pubblico-fase-1.md | `docs/Sessioni di lavoro/24-05-26/Report-menu-qr-pubblico-fase-1.md` |
| Report-redesign-menu-qr-homepage.md | `docs/Sessioni di lavoro/24-05-26/Report-redesign-menu-qr-homepage.md` |
| Report-skill-system-revisione.md | `docs/Sessioni di lavoro/24-05-26/Report-skill-system-revisione.md` |
| Report-tenant-features-system.md | `docs/Sessioni di lavoro/24-05-26/Report-tenant-features-system.md` |

## 25-05-26

| File | Path |
|---|---|
| Report-foto-categoria-menu-prenota.md | `docs/Sessioni di lavoro/25-05-26/Report-foto-categoria-menu-prenota.md` |
| Report-menu-compose-cards.md | `docs/Sessioni di lavoro/25-05-26/Report-menu-compose-cards.md` |
| Report-menu-preselezionati-descrizione-fisso.md | `docs/Sessioni di lavoro/25-05-26/Report-menu-preselezionati-descrizione-fisso.md` |
| Report-menu-qr-filtri-e-ui-modale.md | `docs/Sessioni di lavoro/25-05-26/Report-menu-qr-filtri-e-ui-modale.md` |
| Report-menu-qr-modale-unificato-per-qr.md | `docs/Sessioni di lavoro/25-05-26/Report-menu-qr-modale-unificato-per-qr.md` |
| Report-pagina-prenota-v2-admin-personalizza-form.md | `docs/Sessioni di lavoro/25-05-26/Report-pagina-prenota-v2-admin-personalizza-form.md` |
| Report-prenota-v2-fix-admin-panel.md | `docs/Sessioni di lavoro/25-05-26/Report-prenota-v2-fix-admin-panel.md` |
| Report-prenota-v2-ui-sessione-25-05-26.md | `docs/Sessioni di lavoro/25-05-26/Report-prenota-v2-ui-sessione-25-05-26.md` |
| Report-refactor-menu-grouping-centralizzazione.md | `docs/Sessioni di lavoro/25-05-26/Report-refactor-menu-grouping-centralizzazione.md` |
| Report-sottotab-orizzontali-prenota-v2.md | `docs/Sessioni di lavoro/25-05-26/Report-sottotab-orizzontali-prenota-v2.md` |

## 26-05-26

| File | Path |
|---|---|
| Report-carosello-editor-per-slide-26-05-26.md | `docs/Sessioni di lavoro/26-05-26/Report-carosello-editor-per-slide-26-05-26.md` |
| Report-personalizza-form-carosello-help-26-05-26.md | `docs/Sessioni di lavoro/26-05-26/Report-personalizza-form-carosello-help-26-05-26.md` |
| Report-personalizza-form-salvataggio-sezioni-26-05-26.md | `docs/Sessioni di lavoro/26-05-26/Report-personalizza-form-salvataggio-sezioni-26-05-26.md` |
| Report-prenota-carosello-overlay-campi-26-05-26.md | `docs/Sessioni di lavoro/26-05-26/Report-prenota-carosello-overlay-campi-26-05-26.md` |
| Report-prenota-v2-icone-responsive-26-05-26.md | `docs/Sessioni di lavoro/26-05-26/Report-prenota-v2-icone-responsive-26-05-26.md` |
| Report-prenota-v2-menu-ui-26-05-26.md | `docs/Sessioni di lavoro/26-05-26/Report-prenota-v2-menu-ui-26-05-26.md` |
| Report-resolver-field-overrides-pulizia-26-05-26.md | `docs/Sessioni di lavoro/26-05-26/Report-resolver-field-overrides-pulizia-26-05-26.md` |
| Report-settings-save-ui-sottotab-26-05-26.md | `docs/Sessioni di lavoro/26-05-26/Report-settings-save-ui-sottotab-26-05-26.md` |
| Report-xor-card-carosello-validazione-responsive-26-05-26.md | `docs/Sessioni di lavoro/26-05-26/Report-xor-card-carosello-validazione-responsive-26-05-26.md` |

## 27-05-26

| File | Path |
|---|---|
| Report-carosello-admin-ui-27-05-26.md | `docs/Sessioni di lavoro/27-05-26/Report-carosello-admin-ui-27-05-26.md` |
| Report-footer-striscia-foto-layout-27-05-26.md | `docs/Sessioni di lavoro/27-05-26/Report-footer-striscia-foto-layout-27-05-26.md` |
| Report-prenota-v2-editor-card-preset-27-05-26.md | `docs/Sessioni di lavoro/27-05-26/Report-prenota-v2-editor-card-preset-27-05-26.md` |
| Report-prenota-v2-riepilogo-prezzi-carosello-card-27-05-26.md | `docs/Sessioni di lavoro/27-05-26/Report-prenota-v2-riepilogo-prezzi-carosello-card-27-05-26.md` |
| Report-query-produzione-rls-27-05-26.md | `docs/Sessioni di lavoro/27-05-26/Report-query-produzione-rls-27-05-26.md` |
| Report-revisione-strutturale-fix-27-05-26.md | `docs/Sessioni di lavoro/27-05-26/Report-revisione-strutturale-fix-27-05-26.md` |

## 28-05-26

| File | Path |
|---|---|
| Report-carosello-riepilogo-toggle-finale-28-05-26.md | `docs/Sessioni di lavoro/28-05-26/Report-carosello-riepilogo-toggle-finale-28-05-26.md` |
| Report-carosello-riepilogo-toggle-followup-28-05-26.md | `docs/Sessioni di lavoro/28-05-26/Report-carosello-riepilogo-toggle-followup-28-05-26.md` |
| Report-carosello-riepilogo-toggle-offerta-28-05-26.md | `docs/Sessioni di lavoro/28-05-26/Report-carosello-riepilogo-toggle-offerta-28-05-26.md` |
| Report-debug-sfondo-prenota-striscia-pagina-intera-28-05-26.md | `docs/Sessioni di lavoro/28-05-26/Report-debug-sfondo-prenota-striscia-pagina-intera-28-05-26.md` |
| Report-finale-prenota-sfondo-caselle-28-05-26.md | `docs/Sessioni di lavoro/28-05-26/Report-finale-prenota-sfondo-caselle-28-05-26.md` |
| Report-fix-prenota-striscia-bianca-salvataggio-pagina-intera-28-05-26.md | `docs/Sessioni di lavoro/28-05-26/Report-fix-prenota-striscia-bianca-salvataggio-pagina-intera-28-05-26.md` |
| Report-header-allineamento-data-footer-28-05-26-C.md | `docs/Sessioni di lavoro/28-05-26/Report-header-allineamento-data-footer-28-05-26-C.md` |
| Report-prenota-layout-gap-sessione-28-05-26-B.md | `docs/Sessioni di lavoro/28-05-26/Report-prenota-layout-gap-sessione-28-05-26-B.md` |
| Report-pwa-update-strategy-sessione-28-05-26.md | `docs/Sessioni di lavoro/28-05-26/Report-pwa-update-strategy-sessione-28-05-26.md` |
| Report-revisione-caroselli-pwa-sessione-28-05-26.md | `docs/Sessioni di lavoro/28-05-26/Report-revisione-caroselli-pwa-sessione-28-05-26.md` |
| Report-ripristino-pagina-prenota-striscia-footer-28-05-26.md | `docs/Sessioni di lavoro/28-05-26/Report-ripristino-pagina-prenota-striscia-footer-28-05-26.md` |
| Report-sessione-completa-28-05-26.md | `docs/Sessioni di lavoro/28-05-26/Report-sessione-completa-28-05-26.md` |
| Report-tiramisù-removal-db-migration-28-05-26.md | `docs/Sessioni di lavoro/28-05-26/Report-tiramisù-removal-db-migration-28-05-26.md` |

## 29-05-26

| File | Path |
|---|---|
| Report-card-scorrevole-titolo-admin-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-card-scorrevole-titolo-admin-29-05-26.md` |
| Report-ciclo-salvataggio-admin-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-ciclo-salvataggio-admin-29-05-26.md` |
| Report-finale-ciclo-prepara-prompt-card-ingredienti-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-finale-ciclo-prepara-prompt-card-ingredienti-29-05-26.md` |
| Report-fix-menu-pricing-digest-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-fix-menu-pricing-digest-29-05-26.md` |
| Report-fix-menu-qr-fase3-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-fix-menu-qr-fase3-29-05-26.md` |
| Report-mappatura-booking-request-card-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-mappatura-booking-request-card-29-05-26.md` |
| Report-mappatura-impostazioni-prenota-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-mappatura-impostazioni-prenota-29-05-26.md` |
| Report-mappatura-menu-qr-admin-pubblico-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-mappatura-menu-qr-admin-pubblico-29-05-26.md` |
| Report-meta-miglioria-skill-system-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-meta-miglioria-skill-system-29-05-26.md` |
| Report-modalita-light-standard-deep-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-modalita-light-standard-deep-29-05-26.md` |
| Report-prenota-card-ingredienti-scroll-overlay-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-prenota-card-ingredienti-scroll-overlay-29-05-26.md` |
| Report-prepara-prompt-prenota-card-ingredienti-stack-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-prepara-prompt-prenota-card-ingredienti-stack-29-05-26.md` |
| Report-promo-conflitto-sostituzione-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-promo-conflitto-sostituzione-29-05-26.md` |
| Report-promo-multi-target-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-promo-multi-target-29-05-26.md` |
| Report-promo-personalizza-form-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-promo-personalizza-form-29-05-26.md` |
| Report-revisione-fix-menu-pricing-digest-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-revisione-fix-menu-pricing-digest-29-05-26.md` |
| Report-revisione-fix-menu-qr-fase4-30-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-revisione-fix-menu-qr-fase4-30-05-26.md` |
| Report-revisione-mappatura-booking-request-card-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-revisione-mappatura-booking-request-card-29-05-26.md` |
| Report-revisione-mappatura-menu-qr-admin-pubblico-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-revisione-mappatura-menu-qr-admin-pubblico-29-05-26.md` |
| Report-revisione-palette-prenota-due-layout-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-revisione-palette-prenota-due-layout-29-05-26.md` |
| Report-revisione-validazione-ux-prenota-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-revisione-validazione-ux-prenota-29-05-26.md` |
| Report-revisione-verifica-promo-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-revisione-verifica-promo-29-05-26.md` |
| Report-skill-system-template-e-snellimento-app-context-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-skill-system-template-e-snellimento-app-context-29-05-26.md` |
| Report-unificato-ciclo-booking-request-card-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-unificato-ciclo-booking-request-card-29-05-26.md` |
| Report-validazione-ux-prenota-29-05-26.md | `docs/Sessioni di lavoro/29-05-26/Report-validazione-ux-prenota-29-05-26.md` |

## 30-05-26

| File | Path |
|---|---|
| Report-ciclo-temi-sfondo-menu-qr-30-05-26.md | `docs/Sessioni di lavoro/30-05-26/Report-ciclo-temi-sfondo-menu-qr-30-05-26.md` |
| Report-fix-loop-modifica-menu-qr-30-05-26.md | `docs/Sessioni di lavoro/30-05-26/Report-fix-loop-modifica-menu-qr-30-05-26.md` |
| Report-fix-menu-admin-modali-30-05-26.md | `docs/Sessioni di lavoro/30-05-26/Report-fix-menu-admin-modali-30-05-26.md` |
| Report-fix-menu-qr-pubblico-mobile-30-05-26.md | `docs/Sessioni di lavoro/30-05-26/Report-fix-menu-qr-pubblico-mobile-30-05-26.md` |
| Report-prepara-prompt-ciclo-menu-qr-fix-30-05-26.md | `docs/Sessioni di lavoro/30-05-26/Report-prepara-prompt-ciclo-menu-qr-fix-30-05-26.md` |
| Report-prepara-prompt-temi-sfondo-menu-qr-30-05-26.md | `docs/Sessioni di lavoro/30-05-26/Report-prepara-prompt-temi-sfondo-menu-qr-30-05-26.md` |
| Report-revisione-fix-menu-admin-modali-30-05-26.md | `docs/Sessioni di lavoro/30-05-26/Report-revisione-fix-menu-admin-modali-30-05-26.md` |
| Report-revisione-fix-menu-qr-pubblico-mobile-30-05-26.md | `docs/Sessioni di lavoro/30-05-26/Report-revisione-fix-menu-qr-pubblico-mobile-30-05-26.md` |

## 31-05-26

| File | Path |
|---|---|
| Report-finale-ciclo-prenota-sfondo-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-finale-ciclo-prenota-sfondo-31-05-26.md` |
| Report-fix-menu-admin-scroll-modale-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-fix-menu-admin-scroll-modale-31-05-26.md` |
| Report-fix-menu-qr-desktop-freeze-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-fix-menu-qr-desktop-freeze-31-05-26.md` |
| Report-fix-menu-qr-footer-scroll-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-fix-menu-qr-footer-scroll-31-05-26.md` |
| Report-fix-prenota-footer-scroll-sfondo-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-fix-prenota-footer-scroll-sfondo-31-05-26.md` |
| Report-fix-prenota-mobile-sfondo-scroll-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-fix-prenota-mobile-sfondo-scroll-31-05-26.md` |
| Report-fix-prenota-sfondo-display-hero-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-fix-prenota-sfondo-display-hero-31-05-26.md` |
| Report-fix-viewport-menu-responsive-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-fix-viewport-menu-responsive-31-05-26.md` |
| Report-integrazione-asset-sfondo-prenota-prova-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-integrazione-asset-sfondo-prenota-prova-31-05-26.md` |
| Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md` |
| Report-prenota-sfondo-fixed-padding-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-prenota-sfondo-fixed-padding-31-05-26.md` |
| Report-revisione-senior-skill-system-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-revisione-senior-skill-system-31-05-26.md` |
| Report-verifica-prenota-header-personalizza-form-31-05-26.md | `docs/Sessioni di lavoro/31-05-26/Report-verifica-prenota-header-personalizza-form-31-05-26.md` |

## 01-06-26

| File | Path |
|---|---|
| Report-admin-card-categorie-ingredienti-mobile-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-admin-card-categorie-ingredienti-mobile-01-06-26.md` |
| Report-admin-header-logo-mobile-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-admin-header-logo-mobile-01-06-26.md` |
| Report-card-categoria-qr-match-altezza-mobile-mix-foto-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-card-categoria-qr-match-altezza-mobile-mix-foto-01-06-26.md` |
| Report-card-categoria-qr-senza-foto-30-70-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-card-categoria-qr-senza-foto-30-70-01-06-26.md` |
| Report-ciclo-menu-qr-pill-barra-categorie-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-ciclo-menu-qr-pill-barra-categorie-01-06-26.md` |
| Report-finale-ciclo-menu-qr-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-finale-ciclo-menu-qr-01-06-26.md` |
| Report-follow-up-rimozione-lucide-soup-uova-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-follow-up-rimozione-lucide-soup-uova-01-06-26.md` |
| Report-fu-025-public-menu-category-page-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-fu-025-public-menu-category-page-01-06-26.md` |
| Report-menu-qr-12-icone-categoria-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-menu-qr-12-icone-categoria-01-06-26.md` |
| Report-menu-qr-card-senza-foto-mobile-align-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-menu-qr-card-senza-foto-mobile-align-01-06-26.md` |
| Report-menu-qr-default-icona-insalata-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-menu-qr-default-icona-insalata-01-06-26.md` |
| Report-menu-qr-lucide-icone-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-menu-qr-lucide-icone-01-06-26.md` |
| Report-menu-qr-ordine-categorie-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-menu-qr-ordine-categorie-01-06-26.md` |
| Report-menu-qr-prefill-stale-booking-cat-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-menu-qr-prefill-stale-booking-cat-01-06-26.md` |
| Report-prenota-intestazione-font-dimensione-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-prenota-intestazione-font-dimensione-01-06-26.md` |
| Report-revisione-codice-e-enforcement-cursor-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-revisione-codice-e-enforcement-cursor-01-06-26.md` |
| Report-sync-delete-categoria-qr-form-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-sync-delete-categoria-qr-form-01-06-26.md` |
| Report-sync-rename-categoria-qr-form-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-sync-rename-categoria-qr-form-01-06-26.md` |
| Report-unificazione-icone-prenota-qr.md | `docs/Sessioni di lavoro/01-06-26/Report-unificazione-icone-prenota-qr.md` |
| Report-verifica-card-categoria-qr-mobile-30-70-01-06-26.md | `docs/Sessioni di lavoro/01-06-26/Report-verifica-card-categoria-qr-mobile-30-70-01-06-26.md` |

## 02-06-26

| File | Path |
|---|---|
| Report-analisi-salute-codice-e-dev-console-02-06-26.md | `docs/Sessioni di lavoro/02-06-26/Report-analisi-salute-codice-e-dev-console-02-06-26.md` |
| Report-area-click-ridotta-picker-data-ora-prenota-02-06-26.md | `docs/Sessioni di lavoro/02-06-26/Report-area-click-ridotta-picker-data-ora-prenota-02-06-26.md` |
| Report-card-sottotab-template-menu-compatto-02-06-26.md | `docs/Sessioni di lavoro/02-06-26/Report-card-sottotab-template-menu-compatto-02-06-26.md` |
| Report-evoluzione-hook-e-alleggerimento-skill-system-02-06-26.md | `docs/Sessioni di lavoro/02-06-26/Report-evoluzione-hook-e-alleggerimento-skill-system-02-06-26.md` |
| Report-finale-ciclo-annotazioni-test-prenota-02-06-26.md | `docs/Sessioni di lavoro/02-06-26/Report-finale-ciclo-annotazioni-test-prenota-02-06-26.md` |
| Report-icona-nessuna-card-carosello-prenota-02-06-26.md | `docs/Sessioni di lavoro/02-06-26/Report-icona-nessuna-card-carosello-prenota-02-06-26.md` |
| Report-meta-senior-evoluzione-skill-system-02-06-26.md | `docs/Sessioni di lavoro/02-06-26/Report-meta-senior-evoluzione-skill-system-02-06-26.md` |
| Report-prenota-full-page-fix-sticky-card-scorrevoli-02-06-26.md | `docs/Sessioni di lavoro/02-06-26/Report-prenota-full-page-fix-sticky-card-scorrevoli-02-06-26.md` |
| Report-prenota-full-page-freeze-ciclo-layout-02-06-26.md | `docs/Sessioni di lavoro/02-06-26/Report-prenota-full-page-freeze-ciclo-layout-02-06-26.md` |
| Report-revisione-dossier-senior-02-06-26.md | `docs/Sessioni di lavoro/02-06-26/Report-revisione-dossier-senior-02-06-26.md` |
| Report-rimozione-sticky-bar-mobile-prenota-02-06-26.md | `docs/Sessioni di lavoro/02-06-26/Report-rimozione-sticky-bar-mobile-prenota-02-06-26.md` |

## 03-06-26

| File | Path |
|---|---|
| Report-limiti-testo-prenota-03-06-26.md | `docs/Sessioni di lavoro/03-06-26/Report-limiti-testo-prenota-03-06-26.md` |
| Report-meta-senior-hook-followup-e-mappa-cursor-03-06-26.md | `docs/Sessioni di lavoro/03-06-26/Report-meta-senior-hook-followup-e-mappa-cursor-03-06-26.md` |
| Report-meta-senior-propagazione-template-v0.md | `docs/Sessioni di lavoro/03-06-26/Report-meta-senior-propagazione-template-v0.md` |
| Report-prenota-layout-card-ingredienti-03-06-26.md | `docs/Sessioni di lavoro/03-06-26/Report-prenota-layout-card-ingredienti-03-06-26.md` |
| Report-prenota-limiti-testo-03-06-26.md | `docs/Sessioni di lavoro/03-06-26/Report-prenota-limiti-testo-03-06-26.md` |
| Report-prenota-limiti-tuning-03-06-26.md | `docs/Sessioni di lavoro/03-06-26/Report-prenota-limiti-tuning-03-06-26.md` |
| Report-revisore-allineamento-skill-layout-ingredienti-03-06-26.md | `docs/Sessioni di lavoro/03-06-26/Report-revisore-allineamento-skill-layout-ingredienti-03-06-26.md` |

## 04-06-26

| File | Path |
|---|---|
| Report-courses-label-card-sottotab-prenota-04-06-26.md | `docs/Sessioni di lavoro/04-06-26/Report-courses-label-card-sottotab-prenota-04-06-26.md` |
| Report-fu-031-limiti-cliente-prenota-04-06-26.md | `docs/Sessioni di lavoro/04-06-26/Report-fu-031-limiti-cliente-prenota-04-06-26.md` |
| Report-fu-032-restaurant-name-45-04-06-26.md | `docs/Sessioni di lavoro/04-06-26/Report-fu-032-restaurant-name-45-04-06-26.md` |
| Report-meta-hook-controverifica-prenota-runtime-04-06-26.md | `docs/Sessioni di lavoro/04-06-26/Report-meta-hook-controverifica-prenota-runtime-04-06-26.md` |
| Report-senior-context-knowledge-pilota-prenota-04-06-26.md | `docs/Sessioni di lavoro/04-06-26/Report-senior-context-knowledge-pilota-prenota-04-06-26.md` |
| Report-senior-controverifica-didattico-allineamento-v0-04-06-26.md | `docs/Sessioni di lavoro/04-06-26/Report-senior-controverifica-didattico-allineamento-v0-04-06-26.md` |
| Report-senior-hook-v4-guard-prod-04-06-26.md | `docs/Sessioni di lavoro/04-06-26/Report-senior-hook-v4-guard-prod-04-06-26.md` |

## 05-06-26

| File | Path |
|---|---|
| Report-blindatura-prenota-multiagent-FU-036-05-06-26.md | `docs/Sessioni di lavoro/05-06-26/Report-blindatura-prenota-multiagent-FU-036-05-06-26.md` |
| Report-hook-precommit-riattivazione-husky-05-06-26.md | `docs/Sessioni di lavoro/05-06-26/Report-hook-precommit-riattivazione-husky-05-06-26.md` |
| Report-merge-main-allineamento-prod-FU-034-05-06-26.md | `docs/Sessioni di lavoro/05-06-26/Report-merge-main-allineamento-prod-FU-034-05-06-26.md` |
| Report-ordine-categorie-prenota-bug-griglia-05-06-26.md | `docs/Sessioni di lavoro/05-06-26/Report-ordine-categorie-prenota-bug-griglia-05-06-26.md` |
| Report-prenota-allineamento-card-carosello-05-06-26.md | `docs/Sessioni di lavoro/05-06-26/Report-prenota-allineamento-card-carosello-05-06-26.md` |
| Report-prenota-menu-sottotab-fix-05-06-26.md | `docs/Sessioni di lavoro/05-06-26/Report-prenota-menu-sottotab-fix-05-06-26.md` |
| Report-prepara-prompt-ciclo-centratura-card-05-06-26.md | `docs/Sessioni di lavoro/05-06-26/Report-prepara-prompt-ciclo-centratura-card-05-06-26.md` |
| Report-revisione-prenota-centratura-card-carosello-05-06-26.md | `docs/Sessioni di lavoro/05-06-26/Report-revisione-prenota-centratura-card-carosello-05-06-26.md` |
| Report-revisione-prenota-menu-sottotab-fix-05-06-26.md | `docs/Sessioni di lavoro/05-06-26/Report-revisione-prenota-menu-sottotab-fix-05-06-26.md` |
| Report-tipologie-capability-driven-Fase1-2-05-06-26.md | `docs/Sessioni di lavoro/05-06-26/Report-tipologie-capability-driven-Fase1-2-05-06-26.md` |

## 06-06-26

| File | Path |
|---|---|
| Report-admin-refresh-back-tab-prenotazioni-06-06-26.md | `docs/Sessioni di lavoro/06-06-26/Report-admin-refresh-back-tab-prenotazioni-06-06-26.md` |
| Report-aggancio-skill-system-multi-ambiente-ragioniamo-06-06-26.md | `docs/Sessioni di lavoro/06-06-26/Report-aggancio-skill-system-multi-ambiente-ragioniamo-06-06-26.md` |
| Report-blindatura-admin-area1-shell-06-06-26.md | `docs/Sessioni di lavoro/06-06-26/Report-blindatura-admin-area1-shell-06-06-26.md` |
| Report-blindatura-admin-area2-prenotazioni.md | `docs/Sessioni di lavoro/06-06-26/Report-blindatura-admin-area2-prenotazioni.md` |
| Report-controverifica-menu-qr-prod-ready-06-06-26.md | `docs/Sessioni di lavoro/06-06-26/Report-controverifica-menu-qr-prod-ready-06-06-26.md` |
| Report-fix-flash-tab-admin-06-06-26.md | `docs/Sessioni di lavoro/06-06-26/Report-fix-flash-tab-admin-06-06-26.md` |
| Report-mappatura-admin-area-06-06-26.md | `docs/Sessioni di lavoro/06-06-26/Report-mappatura-admin-area-06-06-26.md` |
| Report-mappatura-menu-qr-06-06-26.md | `docs/Sessioni di lavoro/06-06-26/Report-mappatura-menu-qr-06-06-26.md` |
| Report-revisione-blindatura-prenota-fix-prod-ready-06-06-26.md | `docs/Sessioni di lavoro/06-06-26/Report-revisione-blindatura-prenota-fix-prod-ready-06-06-26.md` |

## 07-06-26

| File | Path |
|---|---|
| Report-archivio-reinserisci-orario-07-06-26.md | `docs/Sessioni di lavoro/07-06-26/Report-archivio-reinserisci-orario-07-06-26.md` |
| Report-batch-fix-fase-d-area2-prenotazioni-07-06-26.md | `docs/Sessioni di lavoro/07-06-26/Report-batch-fix-fase-d-area2-prenotazioni-07-06-26.md` |
| Report-blindatura-admin-area2-conferme.md | `docs/Sessioni di lavoro/07-06-26/Report-blindatura-admin-area2-conferme.md` |
| Report-docs-p2-p3-tracciamento-area2-07-06-26.md | `docs/Sessioni di lavoro/07-06-26/Report-docs-p2-p3-tracciamento-area2-07-06-26.md` |
| Report-fase-d-admin-area2-prenotazioni-07-06-26.md | `docs/Sessioni di lavoro/07-06-26/Report-fase-d-admin-area2-prenotazioni-07-06-26.md` |
| Report-fase-d-subagent-flusso-dati-07-06-26.md | `docs/Sessioni di lavoro/07-06-26/Report-fase-d-subagent-flusso-dati-07-06-26.md` |
| Report-fase-d-subagent-flusso-utente-07-06-26.md | `docs/Sessioni di lavoro/07-06-26/Report-fase-d-subagent-flusso-utente-07-06-26.md` |
| Report-fase-d-subagent-limit-test-07-06-26.md | `docs/Sessioni di lavoro/07-06-26/Report-fase-d-subagent-limit-test-07-06-26.md` |
| Report-fase-d-subagent-responsive-07-06-26.md | `docs/Sessioni di lavoro/07-06-26/Report-fase-d-subagent-responsive-07-06-26.md` |
| Report-fu046-batch-ux-area2-07-06-26.md | `docs/Sessioni di lavoro/07-06-26/Report-fu046-batch-ux-area2-07-06-26.md` |
| Report-revisione-fase-d-e-scoping-fix-07-06-26.md | `docs/Sessioni di lavoro/07-06-26/Report-revisione-fase-d-e-scoping-fix-07-06-26.md` |

## 10-06-26

| File | Path |
|---|---|
| Report-admin-business-hours-anti-overlap-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-admin-business-hours-anti-overlap-10-06-26.md` |
| Report-chiusura-m1-admin-shell-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-chiusura-m1-admin-shell-10-06-26.md` |
| Report-compose-action-row-ghost-fix-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-compose-action-row-ghost-fix-10-06-26.md` |
| Report-controverifica-m1-admin-shell-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-controverifica-m1-admin-shell-10-06-26.md` |
| Report-finale-ciclo-prenota-admin-batch-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-finale-ciclo-prenota-admin-batch-10-06-26.md` |
| Report-finale-m0-prenota-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-finale-m0-prenota-10-06-26.md` |
| Report-fu-030-compose-text-limits-fase1-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-fu-030-compose-text-limits-fase1-10-06-26.md` |
| Report-fu-038-039-prenota-centratura-fase2-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-fu-038-039-prenota-centratura-fase2-10-06-26.md` |
| Report-prenota-footer-salva-carosello-bozza-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-prenota-footer-salva-carosello-bozza-10-06-26.md` |
| Report-prenota-header-descrizione-font-28px-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-prenota-header-descrizione-font-28px-10-06-26.md` |
| Report-prenota-privacy-torna-prenotazione-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-prenota-privacy-torna-prenotazione-10-06-26.md` |
| Report-prenota-sottotab-titolo-tipografia-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-prenota-sottotab-titolo-tipografia-10-06-26.md` |
| Report-prenota-toggle-dettaglio-offerta-riepilogo-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-prenota-toggle-dettaglio-offerta-riepilogo-10-06-26.md` |
| Report-revisione-batch-p1-p2-p3-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-revisione-batch-p1-p2-p3-10-06-26.md` |
| Report-revisione-m0-prenota-fu030-fu038-039-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-revisione-m0-prenota-fu030-fu038-039-10-06-26.md` |
| Report-split-repo-prenotazen-production-10-06-26.md | `docs/Sessioni di lavoro/10-06-26/Report-split-repo-prenotazen-production-10-06-26.md` |

## 11-06-26

| File | Path |
|---|---|
| Report-batch-a-fix-calendario-fase-c-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-batch-a-fix-calendario-fase-c-11-06-26.md` |
| Report-batch-b-fix-calendario-fase-c-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-batch-b-fix-calendario-fase-c-11-06-26.md` |
| Report-c-u2-guard-tab-calendario-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-c-u2-guard-tab-calendario-11-06-26.md` |
| Report-calendario-data-responsive-tablet-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-calendario-data-responsive-tablet-11-06-26.md` |
| Report-fase-c-controtest-calendario-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-fase-c-controtest-calendario-11-06-26.md` |
| Report-finale-fu-m3-qa-e2e-playwright-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-finale-fu-m3-qa-e2e-playwright-11-06-26.md` |
| Report-finale-m2-calendario-blindato-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-finale-m2-calendario-blindato-11-06-26.md` |
| Report-finale-m2-calendario-ciclo-blindatura-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-finale-m2-calendario-ciclo-blindatura-11-06-26.md` |
| Report-finale-m3-menu-blindato-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-finale-m3-menu-blindato-11-06-26.md` |
| Report-m2-calendario-badge-simbolo-percentuale-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-m2-calendario-badge-simbolo-percentuale-11-06-26.md` |
| Report-m2-calendario-fix-qa-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-m2-calendario-fix-qa-11-06-26.md` |
| Report-m2-calendario-mappatura-impl-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-m2-calendario-mappatura-impl-11-06-26.md` |
| Report-m2-calendario-test-blindatura-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-m2-calendario-test-blindatura-11-06-26.md` |
| Report-m2-prenotazioni-operative-e2e-fu043-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-m2-prenotazioni-operative-e2e-fu043-11-06-26.md` |
| Report-m3-fase1-menu-magazzino-limiti-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-m3-fase1-menu-magazzino-limiti-11-06-26.md` |
| Report-m3-fase2-menu-magazzino-availability-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-m3-fase2-menu-magazzino-availability-11-06-26.md` |
| Report-m3-fase2-toggle-ux-panoramica-menu-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-m3-fase2-toggle-ux-panoramica-menu-11-06-26.md` |
| Report-m3-fase3-menu-magazzino-sync-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-m3-fase3-menu-magazzino-sync-11-06-26.md` |
| Report-m3-fix-availability-filter-admin-config-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-m3-fix-availability-filter-admin-config-11-06-26.md` |
| Report-prepara-prompt-ciclo-m3-m2-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-prepara-prompt-ciclo-m3-m2-11-06-26.md` |
| Report-revisione-m2-calendario-test-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-revisione-m2-calendario-test-11-06-26.md` |
| Report-revisione-m3-fase1-menu-magazzino-limiti-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-revisione-m3-fase1-menu-magazzino-limiti-11-06-26.md` |
| Report-senior-audit-skill-system-mappatura-m3-menu-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-senior-audit-skill-system-mappatura-m3-menu-11-06-26.md` |
| Report-senior-revisione-merge-M0-M1-manuale-blindatura-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-senior-revisione-merge-M0-M1-manuale-blindatura-11-06-26.md` |
| Report-verifica-m3-menu-blindatura-11-06-26.md | `docs/Sessioni di lavoro/11-06-26/Report-verifica-m3-menu-blindatura-11-06-26.md` |

## 12-06-26

| File | Path |
|---|---|
| Report-analisi-legale-vendita-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-analisi-legale-vendita-12-06-26.md` |
| Report-analisi-skill-system-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-analisi-skill-system-12-06-26.md` |
| Report-analisi-solidita-codice-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-analisi-solidita-codice-12-06-26.md` |
| Report-chiusura-ciclo-fable-allineamento-sicurezza-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-chiusura-ciclo-fable-allineamento-sicurezza-12-06-26.md` |
| Report-chiusura-m6-docs-prompts-prossimi-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-chiusura-m6-docs-prompts-prossimi-12-06-26.md` |
| Report-ciclo-masterplan-al-f-al-e-intervista-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-ciclo-masterplan-al-f-al-e-intervista-12-06-26.md` |
| Report-completamento-wp-b5-test-apply-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-completamento-wp-b5-test-apply-12-06-26.md` |
| Report-controverifica-fu-log-1-edge-functions-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-controverifica-fu-log-1-edge-functions-12-06-26.md` |
| Report-controverifica-fu-types-1-merge-readiness-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-controverifica-fu-types-1-merge-readiness-12-06-26.md` |
| Report-controverifica-m6-fu-all-fallback-form-empty-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-controverifica-m6-fu-all-fallback-form-empty-12-06-26.md` |
| Report-creazione-masterplan-allineamento-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-creazione-masterplan-allineamento-12-06-26.md` |
| Report-diagnosi-wp-b5-test-apply-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-diagnosi-wp-b5-test-apply-12-06-26.md` |
| Report-fix-digest-calendario-fasce-verticali-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-fix-digest-calendario-fasce-verticali-12-06-26.md` |
| Report-fix-guard-fantasma-calendario-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-fix-guard-fantasma-calendario-12-06-26.md` |
| Report-fu-log-1-chiusura-scripts-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-fu-log-1-chiusura-scripts-12-06-26.md` |
| Report-fu-log-1-edge-functions-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-fu-log-1-edge-functions-12-06-26.md` |
| Report-fu-log-1-merge-commit-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-fu-log-1-merge-commit-12-06-26.md` |
| Report-fu-types-1-chiusura-residuo-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-fu-types-1-chiusura-residuo-12-06-26.md` |
| Report-fu-types-1-hook-perimetro-t1-t5-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-fu-types-1-hook-perimetro-t1-t5-12-06-26.md` |
| Report-fu046-residui-u3-u9-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-fu046-residui-u3-u9-12-06-26.md` |
| Report-m6-fu-all-fallback-form-empty-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-m6-fu-all-fallback-form-empty-12-06-26.md` |
| Report-m6-fu-all-fallback-log-types-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-m6-fu-all-fallback-log-types-12-06-26.md` |
| Report-m6-prod-ready-fallback-guards-prenotazen-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-m6-prod-ready-fallback-guards-prenotazen-12-06-26.md` |
| Report-m6-servizio-guard-fu-types-walkin-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-m6-servizio-guard-fu-types-walkin-12-06-26.md` |
| Report-merge-production-guard-fantasma-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-merge-production-guard-fantasma-12-06-26.md` |
| Report-merge-production-m3-menu-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-merge-production-m3-menu-12-06-26.md` |
| Report-prepara-prompt-ciclo-masterplan-semplici-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-prepara-prompt-ciclo-masterplan-semplici-12-06-26.md` |
| Report-verifica-wp-b3-menu-qr-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-verifica-wp-b3-menu-qr-12-06-26.md` |
| Report-wp-a1-public-menu-rimandi-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-a1-public-menu-rimandi-12-06-26.md` |
| Report-wp-a2-fu-all-fallback-tier-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-a2-fu-all-fallback-tier-12-06-26.md` |
| Report-wp-a3-contatori-test-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-a3-contatori-test-12-06-26.md` |
| Report-wp-a4-app-context-admin-classic-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-a4-app-context-admin-classic-12-06-26.md` |
| Report-wp-a5-database-skill-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-a5-database-skill-12-06-26.md` |
| Report-wp-a6-routing-capienza-masterplan-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-a6-routing-capienza-masterplan-12-06-26.md` |
| Report-wp-al-d-fusioni-docs-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-al-d-fusioni-docs-12-06-26.md` |
| Report-wp-b1-migrazioni-db-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-b1-migrazioni-db-12-06-26.md` |
| Report-wp-b2-restaurant-settings-cross-tenant-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-b2-restaurant-settings-cross-tenant-12-06-26.md` |
| Report-wp-b3-guard-tenant-pubblico-admin-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-b3-guard-tenant-pubblico-admin-12-06-26.md` |
| Report-wp-b5-slot-availability-cleanup-rate-limits-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-b5-slot-availability-cleanup-rate-limits-12-06-26.md` |
| Report-wp-c1-codice-morto-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-c1-codice-morto-12-06-26.md` |
| Report-wp-c2-logger-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-c2-logger-12-06-26.md` |
| Report-wp-c3-package-json-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-c3-package-json-12-06-26.md` |
| Report-wp-e1-mini-pack-area-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-e1-mini-pack-area-12-06-26.md` |
| Report-wp-e2-doc-path-check-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-e2-doc-path-check-12-06-26.md` |
| Report-wp-e3-anti-storia-protocollo-7-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-e3-anti-storia-protocollo-7-12-06-26.md` |
| Report-wp-f1-prezzi-edition-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-f1-prezzi-edition-12-06-26.md` |
| Report-wp-f2-stato-legale-produzione-12-06-26.md | `docs/Sessioni di lavoro/12-06-26/Report-wp-f2-stato-legale-produzione-12-06-26.md` |

## 13-06-26

| File | Path |
|---|---|
| Report-ciclo1-salvataggio-admin-fase2-fu002-004-005-13-06-26.md | `docs/Sessioni di lavoro/13-06-26/Report-ciclo1-salvataggio-admin-fase2-fu002-004-005-13-06-26.md` |
| Report-ciclo2-email-brevo-fu-email-1-13-06-26.md | `docs/Sessioni di lavoro/13-06-26/Report-ciclo2-email-brevo-fu-email-1-13-06-26.md` |
| Report-Ciclo3-Menu-QR-Pack-13-06-26.md | `docs/Sessioni di lavoro/13-06-26/Report-Ciclo3-Menu-QR-Pack-13-06-26.md` |
| Report-finale-capitolo-allineamento-per-fable-13-06-26.md | `docs/Sessioni di lavoro/13-06-26/Report-finale-capitolo-allineamento-per-fable-13-06-26.md` |

## 15-06-26

| File | Path |
|---|---|
| Report-batch1-d-m1-promo-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-batch1-d-m1-promo-15-06-26.md` |
| Report-d-m2-sfondi-prenota-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-d-m2-sfondi-prenota-15-06-26.md` |
| Report-fase-d-rompi-7a-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-fase-d-rompi-7a-15-06-26.md` |
| Report-finale-area3-impostazioni-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-finale-area3-impostazioni-15-06-26.md` |
| Report-gate-batch1-2-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-gate-batch1-2-15-06-26.md` |
| Report-intervista-m4-admin-impostazioni-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-intervista-m4-admin-impostazioni-15-06-26.md` |
| Report-mappa-impostazioni-locale-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-mappa-impostazioni-locale-15-06-26.md` |
| Report-settings-carousel-crud-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-settings-carousel-crud-15-06-26.md` |
| Report-settings-form-config-promo-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-settings-form-config-promo-15-06-26.md` |
| Report-settings-save-guard-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-settings-save-guard-15-06-26.md` |
| Report-settings-theme-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-settings-theme-15-06-26.md` |
| Report-Cicli-3-6-fix-qr-prenotazioni-guard-auth-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-Cicli-3-6-fix-qr-prenotazioni-guard-auth-15-06-26.md` |
| Report-cicli-7-8-9-skill-system-polish-legale-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-cicli-7-8-9-skill-system-polish-legale-15-06-26.md` |
| Report-ciclo8-fu026-fu010-fu-m3-qa-ct-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-ciclo8-fu026-fu010-fu-m3-qa-ct-15-06-26.md` |
| Report-controverifica-fu-email-3-plan-campagne-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-controverifica-fu-email-3-plan-campagne-15-06-26.md` |
| Report-crm-3fix-rubrica-guard-card-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-crm-3fix-rubrica-guard-card-15-06-26.md` |
| Report-d-m2-sfondi-prenota-batch2-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-d-m2-sfondi-prenota-batch2-15-06-26.md` |
| Report-email-invia-card-firma-tenant-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-email-invia-card-firma-tenant-15-06-26.md` |
| Report-fase-c-m4-admin-impostazioni-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-fase-c-m4-admin-impostazioni-15-06-26.md` |
| Report-finale-15-06-26-ciclo8-email-fu026.md | `docs/Sessioni di lavoro/15-06-26/Report-finale-15-06-26-ciclo8-email-fu026.md` |
| Report-finale-fu-email-1-brevo-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-finale-fu-email-1-brevo-15-06-26.md` |
| Report-finale-label-tipologia-da-config-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-finale-label-tipologia-da-config-15-06-26.md` |
| Report-fu-email-1-test-brevo-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-fu-email-1-test-brevo-15-06-26.md` |
| Report-fu-email-3-personalizza-email-crm-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-fu-email-3-personalizza-email-crm-15-06-26.md` |
| Report-fu-email-4-riepilogo-email-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-fu-email-4-riepilogo-email-15-06-26.md` |
| Report-fu-email-7-campagne-email-15-06-26.md | `docs/Sessioni di lavoro/15-06-26/Report-fu-email-7-campagne-email-15-06-26.md` |

## 16-06-26

| File | Path |
|---|---|
| Report-accordion-carosello-menu-prenota-16-06-26.md | `docs/Sessioni di lavoro/16-06-26/Report-accordion-carosello-menu-prenota-16-06-26.md` |
| Report-allineamento-account-e2e-test-16-06-26.md | `docs/Sessioni di lavoro/16-06-26/Report-allineamento-account-e2e-test-16-06-26.md` |
| Report-area-a-quick-wins-prenota-16-06-26.md | `docs/Sessioni di lavoro/16-06-26/Report-area-a-quick-wins-prenota-16-06-26.md` |
| Report-e2e-blindatura-multiarea-16-06-26.md | `docs/Sessioni di lavoro/16-06-26/Report-e2e-blindatura-multiarea-16-06-26.md` |
| Report-e2e-calendario-display-order-16-06-26.md | `docs/Sessioni di lavoro/16-06-26/Report-e2e-calendario-display-order-16-06-26.md` |
| Report-finale-e2e-blindatura-checklist-16-06-26.md | `docs/Sessioni di lavoro/16-06-26/Report-finale-e2e-blindatura-checklist-16-06-26.md` |
| Report-fix-crm-guard-ui-16-06-26.md | `docs/Sessioni di lavoro/16-06-26/Report-fix-crm-guard-ui-16-06-26.md` |
| Report-fix9-admin-compilable-categories-17-06-26.md | `docs/Sessioni di lavoro/16-06-26/Report-fix9-admin-compilable-categories-17-06-26.md` |
| Report-fu-052-validate-docs-16-06-26.md | `docs/Sessioni di lavoro/16-06-26/Report-fu-052-validate-docs-16-06-26.md` |
| Report-rev-a-quick-wins-prenota-16-06-26.md | `docs/Sessioni di lavoro/16-06-26/Report-rev-a-quick-wins-prenota-16-06-26.md` |
| Report-validazione-menu-submit-prenota-16-06-26.md | `docs/Sessioni di lavoro/16-06-26/Report-validazione-menu-submit-prenota-16-06-26.md` |

## 17-06-26

| File | Path |
|---|---|
| Report-admin-footer-dirty-pulse-17-06-26.md | `docs/Sessioni di lavoro/17-06-26/Report-admin-footer-dirty-pulse-17-06-26.md` |
| Report-admin-input-number-no-wheel-17-06-26.md | `docs/Sessioni di lavoro/17-06-26/Report-admin-input-number-no-wheel-17-06-26.md` |
| Report-crm-prompt8-destinatari-stabili-17-06-26.md | `docs/Sessioni di lavoro/17-06-26/Report-crm-prompt8-destinatari-stabili-17-06-26.md` |
| Report-fix9-compilable-category-keys-pubblica-17-06-26.md | `docs/Sessioni di lavoro/17-06-26/Report-fix9-compilable-category-keys-pubblica-17-06-26.md` |
| Report-menu-magazzino-avviso-edition-aware-17-06-26.md | `docs/Sessioni di lavoro/17-06-26/Report-menu-magazzino-avviso-edition-aware-17-06-26.md` |
| Report-personalizza-form-font-descrizione-header-17-06-26.md | `docs/Sessioni di lavoro/17-06-26/Report-personalizza-form-font-descrizione-header-17-06-26.md` |
| Report-prenota-telefono-riepilogo-label-focus-17-06-26.md | `docs/Sessioni di lavoro/17-06-26/Report-prenota-telefono-riepilogo-label-focus-17-06-26.md` |
| Report-prenotazioni-card-tipologia-config-17-06-26.md | `docs/Sessioni di lavoro/17-06-26/Report-prenotazioni-card-tipologia-config-17-06-26.md` |
| Report-rilascio-8fix-allineamento-db-17-06-26.md | `docs/Sessioni di lavoro/17-06-26/Report-rilascio-8fix-allineamento-db-17-06-26.md` |

## 18-06-26

| File | Path |
|---|---|
| Report-admin-dietary-display-batch2-18-06-26.md | `docs/Sessioni di lavoro/18-06-26/Report-admin-dietary-display-batch2-18-06-26.md` |
| Report-consenso-alimentare-gdpr-18-06-26.md | `docs/Sessioni di lavoro/18-06-26/Report-consenso-alimentare-gdpr-18-06-26.md` |
| Report-fix-p1-fasce-capienza-batch2-18-06-26.md | `docs/Sessioni di lavoro/18-06-26/Report-fix-p1-fasce-capienza-batch2-18-06-26.md` |
| Report-fix-p3-consenso-marketing-campagne-18-06-26.md | `docs/Sessioni di lavoro/18-06-26/Report-fix-p3-consenso-marketing-campagne-18-06-26.md` |
| Report-limiti-coperti-nuovo-modello-18-06-26.md | `docs/Sessioni di lavoro/18-06-26/Report-limiti-coperti-nuovo-modello-18-06-26.md` |
| Report-orario-notturno-prenota-18-06-26.md | `docs/Sessioni di lavoro/18-06-26/Report-orario-notturno-prenota-18-06-26.md` |
| Report-prepara-prompt-fix-batch2-18-06-26.md | `docs/Sessioni di lavoro/18-06-26/Report-prepara-prompt-fix-batch2-18-06-26.md` |
| Report-privacy-back-button-multiple-tabs-18-06-26.md | `docs/Sessioni di lavoro/18-06-26/Report-privacy-back-button-multiple-tabs-18-06-26.md` |
| Report-privacy-dietary-guest-count-18-06-26.md | `docs/Sessioni di lavoro/18-06-26/Report-privacy-dietary-guest-count-18-06-26.md` |

## 19-06-26

| File | Path |
|---|---|
| Report-fix-crm-campagna-chiudi-card-19-06-26.md | `docs/Sessioni di lavoro/19-06-26/Report-fix-crm-campagna-chiudi-card-19-06-26.md` |
| Report-fix-crm-campagna-toggle-card-19-06-26.md | `docs/Sessioni di lavoro/19-06-26/Report-fix-crm-campagna-toggle-card-19-06-26.md` |
| Report-fix-crm-contatori-destinatari-campagna-19-06-26.md | `docs/Sessioni di lavoro/19-06-26/Report-fix-crm-contatori-destinatari-campagna-19-06-26.md` |
| Report-fix-crm-prune-destinatari-disiscritti-19-06-26.md | `docs/Sessioni di lavoro/19-06-26/Report-fix-crm-prune-destinatari-disiscritti-19-06-26.md` |
| Report-fix-rotella-input-number-19-06-26.md | `docs/Sessioni di lavoro/19-06-26/Report-fix-rotella-input-number-19-06-26.md` |
| Report-release-crm-destinatari-campagne-19-06-26.md | `docs/Sessioni di lavoro/19-06-26/Report-release-crm-destinatari-campagne-19-06-26.md` |
| Report-release-produzione-privacy-limiti-consensi-19-06-26.md | `docs/Sessioni di lavoro/19-06-26/Report-release-produzione-privacy-limiti-consensi-19-06-26.md` |
| Report-riordino-fasce-pro-serviceslots-19-06-26.md | `docs/Sessioni di lavoro/19-06-26/Report-riordino-fasce-pro-serviceslots-19-06-26.md` |
| Report-scroll-menu-section-prenota-19-06-26.md | `docs/Sessioni di lavoro/19-06-26/Report-scroll-menu-section-prenota-19-06-26.md` |

## 20-06-26

| File | Path |
|---|---|
| Report-fase2-gruppi-orari-griglia-daydigest-20-06-26.md | `docs/Sessioni di lavoro/20-06-26/Report-fase2-gruppi-orari-griglia-daydigest-20-06-26.md` |
| Report-feedback-errori-triplo-prenota-20-06-26.md | `docs/Sessioni di lavoro/20-06-26/Report-feedback-errori-triplo-prenota-20-06-26.md` |
| Report-fix-card-categoria-centratura-personalizza-form-20-06-26.md | `docs/Sessioni di lavoro/20-06-26/Report-fix-card-categoria-centratura-personalizza-form-20-06-26.md` |
| Report-fix-rubrica-crm-identita-email-nome-20-06-26.md | `docs/Sessioni di lavoro/20-06-26/Report-fix-rubrica-crm-identita-email-nome-20-06-26.md` |
| Report-fix-ui-digest-giornata-admin-20-06-26.md | `docs/Sessioni di lavoro/20-06-26/Report-fix-ui-digest-giornata-admin-20-06-26.md` |
| Report-igiene-template-v0.md | `docs/Sessioni di lavoro/20-06-26/Report-igiene-template-v0.md` |
| Report-revisore-fase0-daydigestmodel-20-06-26.md | `docs/Sessioni di lavoro/20-06-26/Report-revisore-fase0-daydigestmodel-20-06-26.md` |

## 21-06-26

| File | Path |
|---|---|
| Report-4fix-mobile-admin.md | `docs/Sessioni di lavoro/21-06-26/Report-4fix-mobile-admin.md` |
| Report-archivio-appunti-release-21-06-26.md | `docs/Sessioni di lavoro/21-06-26/Report-archivio-appunti-release-21-06-26.md` |
| Report-calendario-viste-responsive-release-21-06-26.md | `docs/Sessioni di lavoro/21-06-26/Report-calendario-viste-responsive-release-21-06-26.md` |
| Report-fix-7-booking-details-modal-menu-admin-21-06-26.md | `docs/Sessioni di lavoro/21-06-26/Report-fix-7-booking-details-modal-menu-admin-21-06-26.md` |
| Report-fix-dettagli-prenotazione-21-06-26.md | `docs/Sessioni di lavoro/21-06-26/Report-fix-dettagli-prenotazione-21-06-26.md` |
| Report-fix-ux-admin-prenotazioni-1-6-21-06-26.md | `docs/Sessioni di lavoro/21-06-26/Report-fix-ux-admin-prenotazioni-1-6-21-06-26.md` |
| Report-ordine-categorie-e-salva-qr-21-06-26.md | `docs/Sessioni di lavoro/21-06-26/Report-ordine-categorie-e-salva-qr-21-06-26.md` |

## 23-06-26

| File | Path |
|---|---|
| Report-S3-rollout-prod-prenotazen-23-06-26.md | `docs/Sessioni di lavoro/23-06-26/Report-S3-rollout-prod-prenotazen-23-06-26.md` |

## 24-06-26

| File | Path |
|---|---|
| Report-intervista-S4-24-06-26.md | `docs/Sessioni di lavoro/24-06-26/Report-intervista-S4-24-06-26.md` |
| Report-revisione-integrazione-S4-24-06-26.md | `docs/Sessioni di lavoro/24-06-26/Report-revisione-integrazione-S4-24-06-26.md` |

## 02-08-26

| File | Path |
|---|---|
| Report-allineamento-migrazioni-supabase-test-02-08-26.md | `docs/Sessioni di lavoro/02-08-26/Report-allineamento-migrazioni-supabase-test-02-08-26.md` |
| Report-fix5-fix6-servizio-02-08-26.md | `docs/Sessioni di lavoro/02-08-26/Report-fix5-fix6-servizio-02-08-26.md` |

## 03-08-26

| File | Path |
|---|---|
| Report-7fix-servizio-ui-03-08-26.md | `docs/Sessioni di lavoro/03-08-26/Report-7fix-servizio-ui-03-08-26.md` |
| Report-audit-allineamento-e-checklist-test-03-08-26.md | `docs/Sessioni di lavoro/03-08-26/Report-audit-allineamento-e-checklist-test-03-08-26.md` |
| Report-cantiere-tavoli-assegnazione-servizio-03-08-26.md | `docs/Sessioni di lavoro/03-08-26/Report-cantiere-tavoli-assegnazione-servizio-03-08-26.md` |
| Report-fase0-quattro-fix-03-08-26.md | `docs/Sessioni di lavoro/03-08-26/Report-fase0-quattro-fix-03-08-26.md` |

## 04-08-26

| File | Path |
|---|---|
| Report-fase1-base-test-04-08-26.md | `docs/Sessioni di lavoro/04-08-26/Report-fase1-base-test-04-08-26.md` |

## 05-08-26

| File | Path |
|---|---|
| Report-fase2-righe-12-13-05-08-26.md | `docs/Sessioni di lavoro/05-08-26/Report-fase2-righe-12-13-05-08-26.md` |
| Report-fix-giro-vuoto-prenota-preset-async-05-08-26.md | `docs/Sessioni di lavoro/05-08-26/Report-fix-giro-vuoto-prenota-preset-async-05-08-26.md` |
| Report-fix-logout-legale-codice-morto-handoff-prenota-05-08-26.md | `docs/Sessioni di lavoro/05-08-26/Report-fix-logout-legale-codice-morto-handoff-prenota-05-08-26.md` |
| Report-rossi-parallelismo-mezzanotte-fase3-05-08-26.md | `docs/Sessioni di lavoro/05-08-26/Report-rossi-parallelismo-mezzanotte-fase3-05-08-26.md` |

## 06-08-26

| File | Path |
|---|---|
| Report-blocco1-interrogazione-07-08-26.md | `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/Report-blocco1-interrogazione-07-08-26.md` |
| Report-fase1-interrogazione-07-08-26.md | `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/Report-fase1-interrogazione-07-08-26.md` |
| Report-finale-piano-e-prompt-tracking-06-08-26.md | `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/Report-finale-piano-e-prompt-tracking-06-08-26.md` |
| Report-ondata-S1-catalogo-decisioni-07-08-26.md | `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/Report-ondata-S1-catalogo-decisioni-07-08-26.md` |
| Report-revisione-senior-blocco-sintesi-06-08-26.md | `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/Report-revisione-senior-blocco-sintesi-06-08-26.md` |
| Report-collaudo-filtrato-e-piano-multiagente-06-08-26.md | `docs/Sessioni di lavoro/06-08-26/Report-collaudo-filtrato-e-piano-multiagente-06-08-26.md` |
| Report-finale-chiusura-capitolo-servizio-06-08-26.md | `docs/Sessioni di lavoro/06-08-26/Report-finale-chiusura-capitolo-servizio-06-08-26.md` |
| Report-p0-indagine-skill-matteo-e-aggiunta-ondate-M2-M3-M4-06-08-26.md | `docs/Sessioni di lavoro/06-08-26/Report-p0-indagine-skill-matteo-e-aggiunta-ondate-M2-M3-M4-06-08-26.md` |

## 07-08-26

| File | Path |
|---|---|
| Report-chiusura-organizzazione-indagine-07-08-26.md | `docs/Sessioni di lavoro/07-08-26/Report-chiusura-organizzazione-indagine-07-08-26.md` |
| Report-pulizia-indagine-skill-07-08-26.md | `docs/Sessioni di lavoro/07-08-26/Report-pulizia-indagine-skill-07-08-26.md` |

## 08-08-26

| File | Path |
|---|---|
| Report-es1-referenza-paolo-plan-idea4-08-08-26.md | `docs/Sessioni di lavoro/08-08-26/Report-es1-referenza-paolo-plan-idea4-08-08-26.md` |
| Report-es2-referenza-colleghi-08-08-26.md | `docs/Sessioni di lavoro/08-08-26/Report-es2-referenza-colleghi-08-08-26.md` |
| Report-rev1-plan-idea4-grigio-rotta-stato-08-08-26.md | `docs/Sessioni di lavoro/08-08-26/Report-rev1-plan-idea4-grigio-rotta-stato-08-08-26.md` |
| Report-revisione-idea5-cursor-senior-operativo-2gg-08-08-26.md | `docs/Sessioni di lavoro/08-08-26/Report-revisione-idea5-cursor-senior-operativo-2gg-08-08-26.md` |
| Report-ss5-igiene-idea4-08-08-26.md | `docs/Sessioni di lavoro/08-08-26/Report-ss5-igiene-idea4-08-08-26.md` |
| Report-wp-f-bussola-freddo-correzione-prepara-08-08-26.md | `docs/Sessioni di lavoro/08-08-26/Report-wp-f-bussola-freddo-correzione-prepara-08-08-26.md` |
| Report-wp3-bootstrap-prepara-wp4-08-08-26.md | `docs/Sessioni di lavoro/08-08-26/Report-wp3-bootstrap-prepara-wp4-08-08-26.md` |
| Report-wp4-wp5-idea4-collaudo-08-08-26.md | `docs/Sessioni di lavoro/08-08-26/Report-wp4-wp5-idea4-collaudo-08-08-26.md` |

## 09-08-26

| File | Path |
|---|---|
| Report-ciclo-metaskillsystem-v0-avvio-e-cattura-09-08-26.md | `docs/Sessioni di lavoro/09-08-26/Report-ciclo-metaskillsystem-v0-avvio-e-cattura-09-08-26.md` |
| Report-collaudo-cieco-valutazione-seduta5-09-08-26.md | `docs/Sessioni di lavoro/09-08-26/Report-collaudo-cieco-valutazione-seduta5-09-08-26.md` |
| Report-completamento-wp-0-1-metaskillsystem-09-08-26.md | `docs/Sessioni di lavoro/09-08-26/Report-completamento-wp-0-1-metaskillsystem-09-08-26.md` |
| Report-fantasticazione-cfg01-reazione-09-08-26.md | `docs/Sessioni di lavoro/09-08-26/Report-fantasticazione-cfg01-reazione-09-08-26.md` |
| Report-hardening-h1-metaskillsystem-09-08-26.md | `docs/Sessioni di lavoro/09-08-26/Report-hardening-h1-metaskillsystem-09-08-26.md` |
| Report-lettura-idiografica-capsula-mss-09-08-26.md | `docs/Sessioni di lavoro/09-08-26/Report-lettura-idiografica-capsula-mss-09-08-26.md` |
| Report-prepara-prompt-fantasticazione-elicitation-v2-09-08-26.md | `docs/Sessioni di lavoro/09-08-26/Report-prepara-prompt-fantasticazione-elicitation-v2-09-08-26.md` |

## 10-08-26

| File | Path |
|---|---|
| Report-accettazione-sep-g1-pass-con-riserve-cursor-only-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-accettazione-sep-g1-pass-con-riserve-cursor-only-10-08-26.md` |
| Report-challenge-filtro-studio-risposte-commit-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-challenge-filtro-studio-risposte-commit-10-08-26.md` |
| Report-creazione-handoff-senior-eval-pack-metaskillsystem-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-creazione-handoff-senior-eval-pack-metaskillsystem-10-08-26.md` |
| Report-decisioni-d1-d5-perimetro-sep11-f1-f2-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-decisioni-d1-d5-perimetro-sep11-f1-f2-10-08-26.md` |
| Report-fantasticazione-cfg02-carico-giudizio-allineamento-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-fantasticazione-cfg02-carico-giudizio-allineamento-10-08-26.md` |
| Report-fantasticazione-cfg02-evals-flusso-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-fantasticazione-cfg02-evals-flusso-10-08-26.md` |
| Report-fantasticazione-cfg02-previsto-traccia-merito-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-fantasticazione-cfg02-previsto-traccia-merito-10-08-26.md` |
| Report-fondazione-senior-eval-pack-metaskillsystem-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-fondazione-senior-eval-pack-metaskillsystem-10-08-26.md` |
| Report-go-nogo-b2-f01-e-mandato-f3-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-go-nogo-b2-f01-e-mandato-f3-10-08-26.md` |
| Report-hardening-h1-1-metaskillsystem-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-hardening-h1-1-metaskillsystem-10-08-26.md` |
| Report-orchestrazione-sep-g1-pass-rimandato-controverifica-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-orchestrazione-sep-g1-pass-rimandato-controverifica-10-08-26.md` |
| Report-prepara-post-f3-allineo-commit-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-prepara-post-f3-allineo-commit-10-08-26.md` |
| Report-prepara-post-f3-review-chiusura-commit-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-prepara-post-f3-review-chiusura-commit-10-08-26.md` |
| Report-proseguimento-cfg01-fantasticazione-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-proseguimento-cfg01-fantasticazione-10-08-26.md` |
| Report-remediation-b2-f01-link-report001-pre-f3-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-remediation-b2-f01-link-report001-pre-f3-10-08-26.md` |
| Report-remediation-h13-r01-r05-metaskillsystem-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-remediation-h13-r01-r05-metaskillsystem-10-08-26.md` |
| Report-remediation-sep-f01-post-sep4-metaskillsystem-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-remediation-sep-f01-post-sep4-metaskillsystem-10-08-26.md` |
| Report-revisione-indipendente-h1-3-metaskillsystem-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-revisione-indipendente-h1-3-metaskillsystem-10-08-26.md` |
| Report-revisione-indipendente-h13-post-remediation-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-revisione-indipendente-h13-post-remediation-10-08-26.md` |
| Report-revisione-indipendente-sep4-senior-eval-pack-metaskillsystem-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-revisione-indipendente-sep4-senior-eval-pack-metaskillsystem-10-08-26.md` |
| Report-sep-10-a1-a4-ricognizione-archiviazione-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-sep-10-a1-a4-ricognizione-archiviazione-10-08-26.md` |
| Report-sep-11-f1-f2-archive-shell-indice-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-sep-11-f1-f2-archive-shell-indice-10-08-26.md` |
| Report-sep-11-f3-move-report001-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-sep-11-f3-move-report001-10-08-26.md` |
| Report-sep-11-f4-doc-track-sessioni-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-sep-11-f4-doc-track-sessioni-10-08-26.md` |
| Report-sep-11-post-f3-review-breve-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-sep-11-post-f3-review-breve-10-08-26.md` |
| Report-sep-11-pulizia-solidi-backlog-dedicati-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-sep-11-pulizia-solidi-backlog-dedicati-10-08-26.md` |
| Report-track-commit-h13-l5-pass-con-riserve-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-track-commit-h13-l5-pass-con-riserve-10-08-26.md` |
| Report-valutazione-conduttore-SG-studio-risposte-10-08-26.md | `docs/Sessioni di lavoro/10-08-26/Report-valutazione-conduttore-SG-studio-risposte-10-08-26.md` |
| Report-A1-inventario-filesystem.md | `docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-A1-inventario-filesystem.md` |
| Report-A2-grafo-link-owner.md | `docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-A2-grafo-link-owner.md` |
| Report-A3-prove-tecniche-path.md | `docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-A3-prove-tecniche-path.md` |
| Report-A4-archivi-report-privacy.md | `docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-A4-archivi-report-privacy.md` |
| Report-B1-sintesi-piano-migrazione.md | `docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-B1-sintesi-piano-migrazione.md` |
| Report-B2-review-piano-migrazione.md | `docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-B2-review-piano-migrazione.md` |

## 21-08-26

| File | Path |
|---|---|
| Report-chiusura-documentale-preparazione-036-21-08-26.md | `docs/Sessioni di lavoro/21-08-26/Report-chiusura-documentale-preparazione-036-21-08-26.md` |
| Report-consulenza-esterna-fable-mss-21-08-26.md | `docs/Sessioni di lavoro/21-08-26/Report-consulenza-esterna-fable-mss-21-08-26.md` |
| Report-plan-directory-export-sandbox-mss-21-08-26.md | `docs/Sessioni di lavoro/21-08-26/Report-plan-directory-export-sandbox-mss-21-08-26.md` |

## 22-08-26

| File | Path |
|---|---|
| Report-fix-sk6-22-08-26.md | `docs/Sessioni di lavoro/22-08-26/Report-fix-sk6-22-08-26.md` |
| Report-revisione-indipendente-sk6-codex-22-08-26.md | `docs/Sessioni di lavoro/22-08-26/Report-revisione-indipendente-sk6-codex-22-08-26.md` |
| Report-sk6-mss-query-22-08-26.md | `docs/Sessioni di lavoro/22-08-26/Report-sk6-mss-query-22-08-26.md` |

## 23-08-26

| File | Path |
|---|---|
| Report-allineamento-piano-log-mss-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-allineamento-piano-log-mss-23-08-26.md` |
| Report-chiusura-audit-mss-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-chiusura-audit-mss-23-08-26.md` |
| Report-ciclo-SK-11-SK-5-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-11-SK-5-23-08-26.md` |
| Report-ciclo-SK-4-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-4-23-08-26.md` |
| Report-fase-b-fix-regex-query-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-fase-b-fix-regex-query-23-08-26.md` |
| Report-fase-c-ci-d1-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-fase-c-ci-d1-23-08-26.md` |
| Report-fase-d-docs-amendment-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-fase-d-docs-amendment-23-08-26.md` |
| Report-fase-e-revisione-fix-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-fase-e-revisione-fix-23-08-26.md` |
| Report-fix-path-docs-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-fix-path-docs-23-08-26.md` |
| Report-fix-sk7-timbri-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-fix-sk7-timbri-23-08-26.md` |
| Report-p0-sk7-assenza-fix-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-p0-sk7-assenza-fix-23-08-26.md` |
| Report-p1-d1-d4-d5-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-p1-d1-d4-d5-23-08-26.md` |
| Report-p2a-manuale-mss-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-p2a-manuale-mss-23-08-26.md` |
| Report-revisione-finale-capsula-controlli-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-revisione-finale-capsula-controlli-23-08-26.md` |
| Report-revisione-indipendente-sessione-mss-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-revisione-indipendente-sessione-mss-23-08-26.md` |
| Report-revisione-skill-chiusura-e-hook-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-revisione-skill-chiusura-e-hook-23-08-26.md` |
| Report-senior-chiusura-ciclo-e-mandati-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-senior-chiusura-ciclo-e-mandati-23-08-26.md` |
| Report-senior-chiusura-sessione-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-senior-chiusura-sessione-23-08-26.md` |
| Report-senior-revisione-complessiva-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-senior-revisione-complessiva-23-08-26.md` |
| Report-sk4-backlog-hook-cli-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-sk4-backlog-hook-cli-23-08-26.md` |
| Report-sk4-e1-perimetro-path-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-sk4-e1-perimetro-path-23-08-26.md` |
| Report-sk4-e2-legacy-core-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-sk4-e2-legacy-core-23-08-26.md` |
| Report-sk4-e3-contratto-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-sk4-e3-contratto-23-08-26.md` |
| Report-sk4-revisione-indipendente-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-sk4-revisione-indipendente-23-08-26.md` |
| Report-sk7-mss-capsule-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-sk7-mss-capsule-23-08-26.md` |
| Report-vista-effettiva-mss-query-23-08-26.md | `docs/Sessioni di lavoro/23-08-26/Report-vista-effettiva-mss-query-23-08-26.md` |

## 24-08-26

| File | Path |
|---|---|
| Report-batch-verify-t6-post-commit-25-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-batch-verify-t6-post-commit-25-08-26.md` |
| Report-ciclo-orchestratore-mc-chiusura-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-ciclo-orchestratore-mc-chiusura-24-08-26.md` |
| Report-codex-controverifica-chiusura-sk7-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-codex-controverifica-chiusura-sk7-24-08-26.md` |
| Report-completamento-md-r8-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-completamento-md-r8-24-08-26.md` |
| Report-controverifica-ma-mb-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-ma-mb-24-08-26.md` |
| Report-controverifica-mc-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-mc-24-08-26.md` |
| Report-controverifica-md-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-md-24-08-26.md` |
| Report-controverifica-ME-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-ME-24-08-26.md` |
| Report-controverifica-MF-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-MF-24-08-26.md` |
| Report-controverifica-MG-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-MG-24-08-26.md` |
| Report-controverifica-R1-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-R1-24-08-26.md` |
| Report-controverifica-r1-t6-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-r1-t6-24-08-26.md` |
| Report-controverifica-sk4-t6-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-sk4-t6-24-08-26.md` |
| Report-controverifica-sk8-t6-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-sk8-t6-24-08-26.md` |
| Report-controverifica-T2-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-T2-24-08-26.md` |
| Report-lavoro-controverifica-MF-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-lavoro-controverifica-MF-24-08-26.md` |
| Report-ma-mb-protezioni-cancelli-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-ma-mb-protezioni-cancelli-24-08-26.md` |
| Report-mc-attrezzi-che-non-mentono-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-mc-attrezzi-che-non-mentono-24-08-26.md` |
| Report-md-portabilita-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-md-portabilita-24-08-26.md` |
| Report-me-attrezzi-mancanti-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-me-attrezzi-mancanti-24-08-26.md` |
| Report-mf-viste-generate-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-mf-viste-generate-24-08-26.md` |
| Report-mg-attrezzi-che-non-sporcano-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-mg-attrezzi-che-non-sporcano-24-08-26.md` |
| Report-orchestratore-t2-p4-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-orchestratore-t2-p4-24-08-26.md` |
| Report-orchestratore-t3-p4-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-orchestratore-t3-p4-24-08-26.md` |
| Report-orchestratore-t6-r1-sk4-sk8-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-orchestratore-t6-r1-sk4-sk8-24-08-26.md` |
| Report-p4-privacy-template-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-p4-privacy-template-24-08-26.md` |
| Report-punto-situazione-mss-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-punto-situazione-mss-24-08-26.md` |
| Report-r1-completamento-t6-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-r1-completamento-t6-24-08-26.md` |
| Report-r1-raccolta-sottoprodotto-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-r1-raccolta-sottoprodotto-24-08-26.md` |
| Report-revisione-esterna-stato-mss-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-revisione-esterna-stato-mss-24-08-26.md` |
| Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md` |
| Report-sk4-completamento-t6-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-sk4-completamento-t6-24-08-26.md` |
| Report-sk8-promozione-t6-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-sk8-promozione-t6-24-08-26.md` |
| Report-t2-mss-review-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-t2-mss-review-24-08-26.md` |
| Report-t4-sk11-chiusura-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-t4-sk11-chiusura-24-08-26.md` |
| Report-verifica-indipendente-r8-24-08-26.md | `docs/Sessioni di lavoro/24-08-26/Report-verifica-indipendente-r8-24-08-26.md` |

## 25-08-26

| File | Path |
|---|---|
| Report-chiusura-residui-t13-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-chiusura-residui-t13-25-08-26.md` |
| Report-chiusura-sk10-firma-matteo-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-chiusura-sk10-firma-matteo-25-08-26.md` |
| Report-contratto-comunicazione-diretta-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-contratto-comunicazione-diretta-25-08-26.md` |
| Report-controverifica-indipendente-fix-m12-t7-codex-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-controverifica-indipendente-fix-m12-t7-codex-25-08-26.md` |
| Report-cruscotto-mdp-fase0-fase1-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-cruscotto-mdp-fase0-fase1-25-08-26.md` |
| Report-d14-indice-report-t12-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-d14-indice-report-t12-25-08-26.md` |
| Report-d14-viste-roadmap-handoff-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-d14-viste-roadmap-handoff-25-08-26.md` |
| Report-d27-riapertura-wp1-ombra-t14-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-d27-riapertura-wp1-ombra-t14-25-08-26.md` |
| Report-e2-a-no-verify-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-e2-a-no-verify-25-08-26.md` |
| Report-e2-b-unstaged-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-e2-b-unstaged-25-08-26.md` |
| Report-e2-c-cloud-fallback-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-e2-c-cloud-fallback-25-08-26.md` |
| Report-e2-d-light-enforcement-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-e2-d-light-enforcement-25-08-26.md` |
| Report-fix-m12-t7-codex-opzione-b-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-fix-m12-t7-codex-opzione-b-25-08-26.md` |
| Report-h13-e2-bypass-t7-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-h13-e2-bypass-t7-25-08-26.md` |
| Report-h13-pass-e2-opzione-b-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-h13-pass-e2-opzione-b-25-08-26.md` |
| Report-hook-qr-chiusura-t7-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-hook-qr-chiusura-t7-25-08-26.md` |
| Report-orchestratore-e2-opzione-b-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-orchestratore-e2-opzione-b-25-08-26.md` |
| Report-orchestratore-m-t8-pubblicazione-sk10-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-orchestratore-m-t8-pubblicazione-sk10-25-08-26.md` |
| Report-orchestratore-t11-p2-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-orchestratore-t11-p2-25-08-26.md` |
| Report-orchestratore-t12-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-orchestratore-t12-25-08-26.md` |
| Report-orchestratore-t7-backlog-pilota-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-orchestratore-t7-backlog-pilota-25-08-26.md` |
| Report-orchestratore-t9-blindatura-struttura-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-orchestratore-t9-blindatura-struttura-25-08-26.md` |
| Report-r-t7-06-verify-output-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-r-t7-06-verify-output-25-08-26.md` |
| Report-readiness-pilota-t7-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-readiness-pilota-t7-25-08-26.md` |
| Report-revisione-indipendente-ciclo-t7-codex-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-revisione-indipendente-ciclo-t7-codex-25-08-26.md` |
| Report-sk2-status-allineamento-t7-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-sk2-status-allineamento-t7-25-08-26.md` |
| Report-sk4-assert-t7-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md` |
| Report-sk7-n4-controlli-falsificabili-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-sk7-n4-controlli-falsificabili-25-08-26.md` |
| Report-sync-prompt-orchestrator-n4-t12-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-sync-prompt-orchestrator-n4-t12-25-08-26.md` |
| Report-t9-f1-r1-r3-agente-freddo-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-t9-f1-r1-r3-agente-freddo-25-08-26.md` |
| Report-t9-f2-r4-r7-automazioni-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-t9-f2-r4-r7-automazioni-25-08-26.md` |
| Report-t9-f3-r5-r6-dati-move-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-t9-f3-r5-r6-dati-move-25-08-26.md` |
| Report-t9-f4-r8-d14-portabilita-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-t9-f4-r8-d14-portabilita-25-08-26.md` |
| Report-verifica-post-t12-d27-prep-wp1-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-verifica-post-t12-d27-prep-wp1-25-08-26.md` |
| Report-wp1-istanza1-servizio-blindatura-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza1-servizio-blindatura-25-08-26.md` |
| Report-wp1-istanza2-checklist-qa-servizio-25-08-26.md | `docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza2-checklist-qa-servizio-25-08-26.md` |

## 26-08-26

| File | Path |
|---|---|
| Report-b2-b5-walk-in-durata-console-26-08-26.md | `docs/Sessioni di lavoro/26-08-26/Report-b2-b5-walk-in-durata-console-26-08-26.md` |
| Report-b3-v3-fasce-26-08-26.md | `docs/Sessioni di lavoro/26-08-26/Report-b3-v3-fasce-26-08-26.md` |
| Report-b4-t10-piantina-mobile-26-08-26.md | `docs/Sessioni di lavoro/26-08-26/Report-b4-t10-piantina-mobile-26-08-26.md` |
| Report-chiarimento-checklist-collaudo-servizio-26-08-26.md | `docs/Sessioni di lavoro/26-08-26/Report-chiarimento-checklist-collaudo-servizio-26-08-26.md` |
| Report-chiusura-collaudo-checklist-servizio-26-08-26.md | `docs/Sessioni di lavoro/26-08-26/Report-chiusura-collaudo-checklist-servizio-26-08-26.md` |
| Report-fix-template-capsula-chiusura-26-08-26.md | `docs/Sessioni di lavoro/26-08-26/Report-fix-template-capsula-chiusura-26-08-26.md` |
| Report-meta-senior-analisi-pilota-wp1-e-decisioni-prodotto-26-08-26.md | `docs/Sessioni di lavoro/26-08-26/Report-meta-senior-analisi-pilota-wp1-e-decisioni-prodotto-26-08-26.md` |
| Report-orchestratore-fix-voci-O-servizio-26-08-26.md | `docs/Sessioni di lavoro/26-08-26/Report-orchestratore-fix-voci-O-servizio-26-08-26.md` |
| Report-orientamento-mss-agente-matteo-26-08-26.md | `docs/Sessioni di lavoro/26-08-26/Report-orientamento-mss-agente-matteo-26-08-26.md` |
| Report-wp1-istanza2-diagnosi-O-e-T7bis-26-08-26.md | `docs/Sessioni di lavoro/26-08-26/Report-wp1-istanza2-diagnosi-O-e-T7bis-26-08-26.md` |
| Report-wp1-istanza2-p0-p1-fix-servizio-26-08-26.md | `docs/Sessioni di lavoro/26-08-26/Report-wp1-istanza2-p0-p1-fix-servizio-26-08-26.md` |

<!-- mss:generated report-index fine -->
