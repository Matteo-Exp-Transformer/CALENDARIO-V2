# Report sessione — Sistema tenant_features scalabile

**Data**: 2026-05-24  
**Branch**: Sviluppo-Dashboard-laterale  
**Validate**: 137/137 test ✅ · lint ✅ · typecheck ✅

---

## Cosa è stato fatto

### Problema di partenza
Ogni nuovo add-on commerciale (es. "QR Menu per Classic", "Analytics trial") richiedeva una nuova colonna booleana su `organizations`, una nuova migrazione, modifiche in `TenantContext` e in `buildFeatures`. Non scalava.

### Soluzione: sistema ibrido edition + tenant_features
- `edition` resta il bundle base (Classic = minimo, Pro/Enterprise = pacchetto completo)
- `tenant_features` permette override per singolo tenant: attivare o disattivare una feature specifica via INSERT nel DB, senza toccare il codice

### Passi eseguiti (in ordine)

1. **Migrazione 031** (`supabase/migrations/031_tenant_features_system.sql`):
   - Nuova tabella `tenant_features` con RLS (admin solo sul proprio tenant)
   - RPC `get_tenant_features(p_tenant_id)` — restituisce array di feature_key attive (non scadute)
   - `check_admin_email` estesa: ora ritorna anche `feature_overrides TEXT[]` in un solo round-trip al login
   - Vista `organizations_public` estesa: aggiunto `feature_overrides TEXT[]` per pagine pubbliche (anon)
   - Migrazione dati: tenant con `qr_menu_enabled=true` → riga `tenant_features(feature_key='qrMenu', source='legacy_migration')`
   - Colonna `qr_menu_enabled` mantenuta (DEPRECATED) per backward-compat

2. **`src/config/features.ts`** — riscrittura:
   - `BASE_BUNDLE: Record<TenantEdition, Set<FeatureKey>>` — bundle hardcoded per edition
   - `buildFeatures(edition, overrides[])` — nuova firma. Unisce bundle + override; supporta prefisso `-` per disabilitare feature del bundle
   - Zero impatto sui ~20 consumer (output `FeatureFlags` identico)

3. **`src/contexts/TenantContext.tsx`** — refactor:
   - `featureOverrides: string[]` sostituisce `qrMenuEnabled: boolean`
   - `setTenantFromSlug`: legge `feature_overrides` da `organizations_public` (anon)
   - `setTenantFromAdmin`: legge `feature_overrides` da `check_admin_email` (authenticated) — eliminata la seconda query separata a `organizations`

4. **`src/hooks/useFeatures.ts`** — passa `featureOverrides` a `buildFeatures`

5. **`src/types/database.ts`** — rigenerato: include `tenant_features` e `feature_overrides` nelle viste/funzioni

6. **Dead-code cleanup**: i 5 file documentati in §3a non esistevano già nel repo — sezione rimossa da `APP_CONTEXT_SKILL.md`

7. **`docs/APP_CONTEXT_SKILL.md`** aggiornato:
   - §3: `qrMenuEnabled` → `featureOverrides` nella mappa cartelle e LOCK
   - §3a: sezione dead-code rimossa
   - §4: aggiunta RULE "Feature flag commerciali" (sistema `tenant_features`); RULE Menu QR aggiornata
   - §7 mapping: aggiunta riga `tenant_features / buildFeatures / featureOverrides`

---

## Domande poste all'utente e risposte

- **Modello override**: ibrido (edition = bundle base, tenant_features = override per tenant) ✅
- **Backoffice**: placeholder solo documentazione, niente UI ora ✅
- **Dead-code**: rimozione confermata ✅

---

## Test eseguiti

```
npm run validate
→ lint: OK
→ typecheck: OK
→ test: 137/137 passed
```

Migrazione applicata su DB test (`docnnernvp`) con verifica `get_project_url` preventiva.

---

## Come attivare un add-on manualmente (es. QR Menu per Classic)

```sql
INSERT INTO tenant_features (tenant_id, feature_key, enabled, source, notes)
VALUES (
  '<uuid-tenant>',
  'qrMenu',
  true,
  'manual',
  'Upgrade acquistato il 2026-05-24'
)
ON CONFLICT (tenant_id, feature_key) DO UPDATE SET enabled = true;
```

Al prossimo login/reload, il tenant vedrà la feature attiva senza deploy.

---

## Cosa resta per la prossima sessione

- **Plan 2**: revisione e arricchimento skill system (`DATA_FLOW_SKILL.md`, `Marketing-Skill/`, potatura `APP_CONTEXT_SKILL.md`)
- **Produzione**: la migrazione 031 va applicata anche su prod (`rwuxgvld`) quando si decide il rollout
- **Drop `qr_menu_enabled`**: migrazione futura (032+) quando il codice non la legge più
- **UI super-admin** per gestione `tenant_features`: sessione futura quando >5 clienti paganti
