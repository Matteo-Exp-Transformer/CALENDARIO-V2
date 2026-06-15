# MARKETING / EDITION — Mini-pack d'area (ingresso rapido)

> **Cos'è.** Ingresso ~1 schermata per il **modello commerciale** (edition, add-on, `tenant_features`,
> pricing). **Non duplica** le procedure: per il testo pieno apri `MARKETING_SKILL.md` + context.
> Design: `Sessioni di lavoro/12-06-26/Design-wp-e1-mini-pack-area-12-06-26.md`.

## 1. Trigger
«edition» · «pricing» · «add-on» · «vendita» · «cliente» · «pacchetto» · «commerciale» ·
«feature_key» · «bundle» · «tenant_features» · «attivo X a Mario».

## 2. Carica subito
- **`MARKETING_SKILL.md`** (intero) — modello, bundle vs add-on, procedura attivazione, roadmap.
- `../DATA_FLOW_SKILL.md` per il flusso tecnico edition/feature.
- `FEATURE_CATALOG_CONTEXT.md` / `EDITION_PRICING_CONTEXT.md` / `TARGET_CUSTOMERS_CONTEXT.md` se serve.

## 3. Divieti top-3
1. **Fonte di verità add-on = `tenant_features`**, NON `organizations.qr_menu_enabled` (legacy, non
   letta dal codice). L'attivazione vera è la riga in `tenant_features` (enabled + non scaduta).
2. **Ambiente:** la procedura «attivo X a Mario» gira su **PROD** (tenant reale). Prima di ogni
   INSERT/UPDATE → `get_project_url`; `rwuxgvld` = PROD → conferma esplicita. Override consapevole
   della regola «tutto su TEST».
3. **Bundle vs Add-on si decide PRIMA di codificare:** Bundle → `buildFeatures(edition)`; Add-on →
   `buildFeatures(edition, featureOverrides)`; override manuale → `tenant_features`. Sbagliare =
   migrare codice dopo.

## 4. Mappa file
| Se il task tocca… | Apri |
|---|---|
| Modello, attivazione add-on, roadmap, procedura SQL | `MARKETING_SKILL.md` |
| Flusso tecnico edition → feature flag (`buildFeatures`, `useFeatures`) | `../DATA_FLOW_SKILL.md` + `src/config/features.ts` |
| Catalogo feature completo | `FEATURE_CATALOG_CONTEXT.md` |
| Listino prezzi (approvato 12-06-26) | `EDITION_PRICING_CONTEXT.md` |
| Clienti target | `TARGET_CUSTOMERS_CONTEXT.md` |
| `tenant_features` come tabella/RPC | `../Database-Skill/DB_SKILL.md` + `../DATA_FLOW_SKILL.md` |

## 5. LOCK (solo link)
- **`tenant_features` = fonte di verità add-on** (non `qr_menu_enabled`) → `MARKETING_SKILL.md` §3.
- **PROD per attivazioni reali** — `get_project_url` + conferma → `MARKETING_SKILL.md` §3.
