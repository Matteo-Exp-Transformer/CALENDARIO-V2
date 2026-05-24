---
name: marketing
description: >-
  Modello commerciale di CalendarBackup-v2: edition, add-on, tenant_features,
  procedura per attivare feature a singoli clienti, roadmap commerciale.
  Caricare quando il task tocca edition, pricing, add-on, vendita, commerciale,
  pacchetto, feature_key, bundle, tenant_features.
---

# Marketing & Modello Commerciale

> Caricare insieme ad `APP_CONTEXT_SKILL.md` quando il task è commerciale
> o quando si decide dove dichiarare una nuova feature (bundle vs add-on).

---

## 1. Modello commerciale

| Livello | Come si attiva | Cosa include |
|---------|---------------|--------------|
| **Classic** | Default per ogni nuovo tenant | Prenotazioni base, calendario, impostazioni, form pubblico |
| **Pro** | Campo `edition='pro'` su `organizations` | Tutto Classic + sidebar, CRM esteso, Servizio/turni, Analytics, QR Menu incluso |
| **Enterprise** | Campo `edition='enterprise'` su `organizations` | Tutto Pro + features future enterprise |
| **Add-on** | Riga in `tenant_features` (per tenant_id) | Feature singola attivabile su qualsiasi edition |

Il sistema `tenant_features` (migrazione 031) permette di vendere feature individuali senza cambiare l'edition.

Flusso tecnico: vedi `docs/DATA_FLOW_SKILL.md`.

---

## 2. Bundle vs Add-on — quando dichiari una feature, scegli prima

**Prima di codificare una nuova feature**, rispondere a:

> "Questa feature è inclusa in un pacchetto oppure si vende da sola?"

| Risposta | Tipo | Dove dichiararla |
|----------|------|-----------------|
| Inclusa in Pro/Enterprise per tutti | **Bundle** | `buildFeatures(edition)` in `src/config/features.ts` — return `true` se edition ≥ pro |
| Vendibile separatamente a Classic | **Add-on** | `buildFeatures(edition, featureOverrides)` — `true` se `featureOverrides.includes('featureKey')` oppure edition ≥ pro |
| Solo per un cliente specifico temporaneamente | **Override manuale** | `INSERT INTO tenant_features` (operazione manuale oggi, UI super-admin in futuro) |

Questa decisione cambia dove la feature viene dichiarata — sbagliare significa poi dover migrare il codice.

---

## 3. Procedura "attivo X a Mario" (operazione manuale)

Oggi l'attivazione di add-on è manuale via MCP o SQL. UI super-admin prevista quando >5 clienti paganti.

**Passo 1** — trova il tenant_id di Mario:
```sql
SELECT id, name, edition FROM organizations WHERE slug = 'pizzeria-da-mario';
```

**Passo 2** — attiva l'add-on:
```sql
INSERT INTO tenant_features (tenant_id, feature_key, enabled, source)
VALUES ('<tenant-id>', 'qrMenu', true, 'override')
ON CONFLICT (tenant_id, feature_key) DO UPDATE SET enabled = true, source = 'override';
```

**Passo 3** — verifica al prossimo login di Mario:
Mario fa logout e login → `check_admin_email` restituisce `feature_overrides=['qrMenu']` → `features.qrMenu=true`.

**Disattivare**:
```sql
UPDATE tenant_features SET enabled = false WHERE tenant_id = '<tenant-id>' AND feature_key = 'qrMenu';
```

---

## 4. Catalogo feature

Vedi `docs/Marketing-Skill/FEATURE_CATALOG_CONTEXT.md` per tabella completa.

---

## 5. Roadmap commerciale

| Feature | Stato | Note |
|---------|-------|------|
| QR Menu (menu digitale) | Implementato — primo add-on Classic | Bucket `menu-photos`, pagine pubbliche `/menu/:slug`, multi-QR già pronto |
| Ordini al tavolo | Idea v2 del QR | Estensione naturale: da "vedi menu" a "ordina dal tavolo" |
| UI super-admin tenant_features | Da fare | Trigger: >5 clienti paganti — oggi è manuale SQL |
| Analytics avanzate | Bundle Pro — placeholder | Dati di base già in `analytics_query_root` |

---

## 6. Pricing

Vedi `docs/Marketing-Skill/EDITION_PRICING_CONTEXT.md` — da compilare con Matteo.

---

## 7. Clienti target

Vedi `docs/Marketing-Skill/TARGET_CUSTOMERS_CONTEXT.md`.
