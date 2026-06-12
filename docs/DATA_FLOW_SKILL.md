---
name: data-flow
description: >-
  Flusso identitario end-to-end: come il tenant viene risolto dal DB, come edition
  e feature_overrides arrivano a useFeatures(), quando fermarsi prima di modificare
  TenantContext o buildFeatures. Caricare quando il task tocca TenantContext,
  useFeatures, edition, tenant_features, login, auth, featureOverrides.
---

# Data Flow — Flusso identitario

> Caricare insieme ad `APP_CONTEXT_SKILL.md` ogni volta che il task tocca
> `TenantContext`, `useFeatures`, `buildFeatures`, `edition`, `tenant_features`, `featureOverrides`, `login` / `auth`.

---

## 1. Mappa del flusso

```
DB
├── organizations         (id, name, slug, edition, is_active)
├── admin_users           (tenant_id, email)
└── tenant_features       (tenant_id, feature_key, enabled, source)
        │
        ▼
  [Flusso A] supabasePublic.from('organizations_public')
             (vista: organizations + aggregato feature_overrides da tenant_features)
                     │
        [Flusso B] supabase.rpc('check_admin_email')
                   (RPC: restituisce tenant_id, slug, org_name, edition, feature_overrides[])
        │
        ▼
  TenantContext.tsx
  ├── tenantId
  ├── tenantSlug
  ├── organizationName
  ├── edition              ← 'classic' | 'pro' | 'enterprise'
  └── featureOverrides[]   ← ['qrMenu', 'analytics', ...]
        │
        ▼
  useFeatures()  →  buildFeatures(edition, featureOverrides)
        │
        ▼
  FeatureFlags   ← booleani: features.qrMenu, features.sidebar, features.servizio …
        │
        ▼
  Ogni componente/pagina che fa `if (features.X)`
```

---

## 2. Due flussi side-by-side

### Flusso A — Pubblico (`setTenantFromSlug`)

Triggerato da: `BookingRequestPage`, `PublicMenuPage`, qualsiasi pagina con slug URL.

```
1. URL contiene /:slug  →  TenantContext.setTenantFromSlug(slug)
2. Query anonima su organizations_public (vista sicura, anon può leggerla)
   → restituisce: id, name, slug, edition, feature_overrides[]
3. TenantContext salva i valori nello state
4. useFeatures() li legge e costruisce FeatureFlags
```

Client usato: `supabasePublic` (anonimo, senza sessione).

### Flusso B — Admin (`setTenantFromAdmin`)

Triggerato da: `useAdminAuth` dopo login con email verificata.

```
1. Admin fa login → useAdminAuth chiama setTenantFromAdmin(email)
2. RPC check_admin_email (richiede autenticazione)
   → restituisce: tenant_id, slug, org_name, edition, feature_overrides[]
3. TenantContext salva i valori nello state
4. useFeatures() li legge e costruisce FeatureFlags
```

Client usato: `supabase` (autenticato, sessione in localStorage).

### Guard route pubbliche vs sessione admin

`AdminAuthProvider` è montato nel root layout e quindi vede anche le route pubbliche. Su `/prenota/*`
e `/menu/*` il restore di una sessione admin già presente **non deve** chiamare `setTenantFromAdmin`:
il tenant resta quello risolto dallo slug pubblico con `setTenantFromSlug`. Quando l'utente torna in
`/admin`, il check sessione riparte e ripopola il tenant admin.

`BookingRequestPage` applica lo stesso criterio già usato dal Menu QR: monta le query tenant-scoped
solo quando `TenantContext.tenantSlug` combacia con lo slug URL. Così una sessione admin in memoria
non può far leggere impostazioni pubbliche del tenant sbagliato.

---

## 3. Regola "una fonte di verità"

Al primo caricamento si leggono **tutti** i dati identitari in un singolo round-trip (query o RPC). Poi **tutto legge dal context**. Mai rifare query a `organizations` o `tenant_features` a runtime per gating UI.

```
✅  const features = useFeatures()  →  if (features.qrMenu) ...
❌  const { data } = useQuery(['org'], () => supabase.from('organizations').select('qr_menu_enabled'))
❌  if (tenant.edition === 'pro') ...   // hardcoded edition check
❌  if (context.featureOverrides.includes('qrMenu')) ...  // bypass buildFeatures
```

---

## 4. Anti-pattern — segnalare all'utente se trovati

| Anti-pattern | Problema | Fix |
|---|---|---|
| Query diretta a `organizations` per leggere flag `_enabled` | Bypasssa `featureOverrides`, non è sincronizzato con il context | Usare `features.X` da `useFeatures()` |
| `if (edition === 'pro')` hardcoded | Non considera add-on né overrides | Usare `features.sidebar` o flag specifico |
| `featureOverrides.includes('X')` direttamente | Bypasssa `buildFeatures`, logica duplicata | Usare `features.X` |
| Doppia query a `organizations_public` / `check_admin_email` | Race condition + latenza | Il context viene caricato una volta sola |

---

## 5. Fermati e avvisa l'utente se devi cambiare il flusso

Se il task richiede una di queste modifiche, **spiega prima a Matteo cosa cambia nel flusso** (in linguaggio utente, non tecnico) e aspetta conferma:

- Aggiungere un campo a `TenantContext` (cambia cosa viene letto dal DB al login)
- Modificare `buildFeatures` (cambia quali flag vengono costruiti per ogni edition)
- Aggiungere una colonna identitaria a `organizations` o `tenant_features` (cambia il round-trip iniziale)
- Modificare `check_admin_email` RPC o `organizations_public` vista (cambia cosa il server restituisce)

Esempio spiegazione da dare all'utente:
> "Sto aggiungendo un campo X al contesto. Questo significa che dal prossimo login Mario vedrà [effetto]. Il flusso che cambia è: oggi quando Mario fa login l'app legge solo edition e feature_overrides; dopo la modifica leggerà anche X. Nessun cambiamento visibile finché non aggiungo UI che usa X."

---

## 6. Storie di flusso reali

### Mario fa login (Flusso B)

1. Mario inserisce email e password → `useAdminAuth` chiama `supabase.auth.signInWithPassword`
2. Dopo OK, chiama `setTenantFromAdmin(mario@pizzeria.it)` → RPC `check_admin_email` restituisce `{tenant_id, edition:'classic', feature_overrides:['qrMenu']}`
3. TenantContext salva: `edition='classic'`, `featureOverrides=['qrMenu']`
4. `buildFeatures('classic', ['qrMenu'])` → `features.sidebar=false`, `features.qrMenu=true`
5. Mario vede la dashboard Classic senza sidebar, ma con il pulsante QR nella toolbar

### Luigi scansiona un QR (Flusso A)

1. Luigi apre `/menu/pizzeria-da-mario/qr/abc123` sul telefono
2. `PublicMenuPage` legge lo slug `pizzeria-da-mario` → chiama `setTenantFromSlug('pizzeria-da-mario')`
3. Query anonima su `organizations_public` → restituisce `{id, edition:'classic', feature_overrides:['qrMenu']}`
4. `features.qrMenu=true` → la pagina carica il menu digitale
5. Luigi vede il menu senza doversi autenticare

Se nello stesso browser c'è anche una sessione admin, quella sessione resta valida ma non cambia il
tenant del menu pubblico: lo slug URL continua a vincere finché Luigi resta su `/menu/*`.

### Attivo Analytics a un Classic per trial (operazione manuale)

**Nel DB**:
```sql
INSERT INTO tenant_features (tenant_id, feature_key, enabled, source)
VALUES ('<mario-tenant-id>', 'analytics', true, 'override');
```

**Effetto al prossimo login di Mario**:
- `check_admin_email` restituisce `feature_overrides=['qrMenu','analytics']`
- `buildFeatures('classic', ['qrMenu','analytics'])` → `features.analytics=true`
- Mario vede la voce Analytics nella sidebar (se Pro/Enterprise) oppure un accesso diretto (se Classic con override)
- Nessun cambio a `edition` — resta Classic

Per UI super-admin di gestione `tenant_features`: vedi `docs/Marketing-Skill/MARKETING_SKILL.md` § Roadmap.
