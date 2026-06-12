---
name: feature-catalog
description: >-
  Catalogo di tutte le feature_key vendibili come add-on in CalendarBackup-v2.
  Usato da MARKETING_SKILL per decidere dove dichiarare una nuova feature e
  come comunicarla a un cliente.
---

# Feature Catalog

| feature_key | Descrizione per il cliente | Edition di default | Vendibile come add-on | Prezzo add-on |
|-------------|---------------------------|-------------------|----------------------|---------------|
| `qrMenu` | Menu digitale via QR code — i clienti scansionano il QR e vedono il menu sul telefono, con foto dei piatti | Pro/Enterprise incluso | ✅ Sì — anche per Classic | **+16€/mese** (+160€/anno) — vedi `EDITION_PRICING_CONTEXT.md` |
| `sidebar` | Dashboard con sidebar completa (CRM, Servizio, Analytics, Home) | Pro/Enterprise incluso | — (è il Pro stesso) | — |
| `servizio` | Gestione turni e assegnazione tavoli | Pro/Enterprise incluso | ❌ No (richiede sidebar) | — |
| `analytics` | Report e statistiche prenotazioni | Pro/Enterprise incluso | 🔜 Previsto | Da definire |
| `noShow` | Marcatura no-show con storico | Pro/Enterprise incluso | ❌ No (è nella LOCK list Classic) | — |
| `walkIn` | Walk-in con limite ospiti configurabile | Tutte le edition | — (è già in Classic) | — |
| `hasTurnsFeature` | Turni multipli in sala + assegnazione tavolo da calendario | Pro/Enterprise incluso | ❌ No (richiede servizio) | — |

## Come aggiungere una nuova voce

1. Aggiungere `feature_key` in `src/types/edition.ts` (tipo `FeatureKey`)
2. Aggiungere il flag in `FeatureFlags` (`src/config/features.ts`)
3. Implementare la logica in `buildFeatures(edition, featureOverrides)`
4. Aggiornare questa tabella
5. Aggiornare `APP_CONTEXT_SKILL.md` §4 RULE Feature flag commerciali
