# Sessione 24-05-26 — Revisione e arricchimento Skill System (Plan 2)

## Cosa è stato fatto (in ordine cronologico)

1. Esplorato l'inventario completo skill: 31 file `.md` in `docs/`, ~4800 righe. Valutato che il sistema è solido ma sfilacciato sulla strategia commerciale e sul flusso dati.
2. Decisa la rotta: NON rifare da zero, ma arricchire in 3 punti e potare in 3.
3. Creata nuova skill **flusso dati identitario** che documenta come `tenant_id`, `edition` e `featureOverrides` arrivano dal DB fino ai componenti che fanno `if (features.X)`.
4. Creata nuova area **Marketing-Skill** con 4 file knowledge base (skill primaria + pricing + catalogo feature + profili clienti) per documentare il modello commerciale di Matteo.
5. Spostata la cronologia sessioni dal file master `APP_CONTEXT_SKILL.md` a un nuovo `SESSION_LOG.md` separato — il file master adesso resta pulito e durevole.
6. Sostituita la regola formale "5 punti obbligatori prima di toccare LOCK" con una più snella "verifica strutturale obbligatoria" — agente deve capire l'impatto e proteggere l'integrità, non più chiedere conferma esplicita.
7. Aggiunta nuova RULE "Linguaggio utente" con esempi concreti: l'agente deve spiegare in termini di flussi e schermate ("ora Mario vede X"), mai con nomi di componenti isolati ("ho modificato `MenuPricesTab.tsx`").
8. Consolidato il LOCK su `TenantContext` (era duplicato in 4 file) → 1 sola fonte autoritativa in `APP_CONTEXT_SKILL.md`, 3 reference negli altri.
9. Aggiornata la tabella routing §0 con righe per le 2 nuove skill (DATA_FLOW + MARKETING) e per `tenant_features`.
10. Aggiornata RULE `qrMenu` per riflettere il nuovo sistema `tenant_features` introdotto nella sessione precedente (Plan 1).

## File toccati e perché

**Nuovi (in linguaggio utente)**:
- `docs/DATA_FLOW_SKILL.md` — quando un agente futuro tocca TenantContext o le feature flag, adesso ha una mappa visuale di cosa succede dal DB fino al pulsante che Mario vede, con esempi pratici ("Mario fa login → 4 step", "Luigi scansiona QR → 4 step", "Apro trial Analytics a un Classic per 30gg")
- `docs/SESSION_LOG.md` — indice unico dei report di sessione, così APP_CONTEXT_SKILL non si gonfia ogni mese
- `docs/Marketing-Skill/MARKETING_SKILL.md` — quando Matteo (o un agente che lavora per lui) deve decidere "questa feature la metto nel bundle Pro o la vendo come add-on?", trova qui la procedura di decisione
- `docs/Marketing-Skill/EDITION_PRICING_CONTEXT.md` — placeholder pricing, da compilare quando Matteo definisce i prezzi
- `docs/Marketing-Skill/FEATURE_CATALOG_CONTEXT.md` — catalogo add-on vendibili (oggi solo qrMenu, crescerà nel tempo)
- `docs/Marketing-Skill/TARGET_CUSTOMERS_CONTEXT.md` — chi sono i clienti target (ristoratori italiani piccoli/medi), come ragionano

**Modificati**:
- `docs/APP_CONTEXT_SKILL.md` — routing tabella aggiornato con le 2 nuove skill; LOCK più snello; nuova RULE Linguaggio utente; nuova RULE Feature flag commerciali; cronologia spostata in SESSION_LOG. Resta a 253 righe (target ≤270).
- `docs/ADMIN_CLASSIC_SKILL.md` — rimossa "spiegazione preventiva 5 punti" → ora "verifica strutturale obbligatoria"
- `docs/COMUNICAZIONE_UTENTE_SKILL.md` — aggiunti esempi "frase tecnica → frase utente"
- `docs/Database-Skill/DB_SKILL.md`, `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md`, `docs/per-ui-design-skill/UI_EDIT_SKILL.md` — LOCK TenantContext sostituito con reference a APP_CONTEXT §4 (zero duplicazione)

## Domande poste all'utente e risposte ricevute

- **Plan 1 — scope tenant_features**: Matteo ha scelto modello ibrido (edition come bundle base + override per singolo tenant per promo/esclusive/trial)
- **Plan 1 — UI gestione flag**: "mini-backoffice futuro (placeholder ora)" → niente UI, solo SQL/MCP manuale finché non ci sono molti clienti
- **Plan 2.A — dove vive DATA_FLOW_SKILL**: file separato `docs/DATA_FLOW_SKILL.md` caricato sempre con APP_CONTEXT
- **Plan 2.C — dove vive marketing KB**: nuova cartella dedicata `docs/Marketing-Skill/` con skill propria

## Verifica

- Tutti i nuovi file presenti e indicizzati nel routing §0
- LOCK TenantContext: da 4 duplicazioni a 1 + 3 reference (verificato con grep)
- `APP_CONTEXT_SKILL.md`: 253 righe (era 255, target ≤270)
- Nessuna modifica al codice applicativo — solo `docs/`
- Plan 1 e Plan 2 coerenti tra loro: la nuova RULE Feature flag commerciali in APP_CONTEXT §4 cita correttamente `tenant_features` (introdotto in Plan 1) e rinvia a `DATA_FLOW_SKILL.md` + `MARKETING_SKILL.md`

## Cosa resta per la prossima sessione

- Compilare `EDITION_PRICING_CONTEXT.md` con i prezzi reali quando Matteo li definisce
- Estendere `FEATURE_CATALOG_CONTEXT.md` man mano che nascono nuovi add-on
- Considerare drop della colonna deprecata `organizations.qr_menu_enabled` in una migrazione futura, quando non sarà più letta da nessuna parte
- Mini-backoffice super-admin per gestione `tenant_features` quando i clienti paganti saranno >5

## Deviazioni dal plan

Nessuna deviazione sostanziale. Snellimenti opzionali §D (overlap STYLING_AGENT_CONTEXT / UI_COMPONENTS_CONTEXT) non eseguiti — basso impatto, candidati a sessione dedicata.
