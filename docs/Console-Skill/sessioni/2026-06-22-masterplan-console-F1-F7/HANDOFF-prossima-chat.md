# Hand-off — prossima chat · branch `feature/console-super-admin`

> **Copia-incolla questo blocco come primo messaggio della prossima sessione.**
> Stato al **2026-06-22**: ciclo automode **F1→F7 completato, revisionato (esecutore ≠ revisore),
> committato e pushato**. Working tree pulito. Il codice della Console è pronto; mancano 3 azioni
> **lato Matteo** (deploy + 2 policy) per renderla operativa E2E.

---

## PROMPT DA INCOLLARE

```
Sei il Senior Orchestrator del branch feature/console-super-admin.

1. Carica la bussola: docs/Console-Skill/00_BUSSOLA_CONSOLE.md (routing, profili, LOCK, 5 regole d'oro).
2. Leggi lo stato del lavoro in:
   - docs/Console-Skill/MASTERPLAN_CONSOLE.md (§4 = stato fasi)
   - docs/Console-Skill/sessioni/SESSION_LOG.md (ultima riga = F7)
   - docs/Console-Skill/sessioni/DECISION_LOG.md (ultima = DEC-031)
   - docs/Console-Skill/sessioni/PHASE_AUDIT.md (blocchi F1→F7)
   - docs/Console-Skill/sessioni/FOLLOW_UP.md (debiti aperti)
3. Applica sempre le 5 regole d'oro e RULE-5 (tracciabilità). Esecutore ≠ revisore.
   Modello: Haiku per task meccanici, Sonnet per ragionamento (vincolo di Cristiano).
4. Stato: F1→F7 fatte/committate/pushate. NON ricominciare le fasi.
   La prossima mossa dipende da cosa è successo lato Matteo (vedi sotto "Bivio").

Bivio (chiedimi quale prima di partire se non è chiaro dal contesto):
 A) Matteo HA eseguito PLAN-DB-002/003/004 e deployato l'Edge → fai il giro di
    VERIFICA E2E delle scritture sui 2 sandbox (cambio edition, toggle add-on,
    impostazioni), via MCP CONSOLE (get_project_url deve dare docnnernvp).
 B) Matteo NON ha ancora fatto → o prepari il "prompt di consegna per Matteo"
    (i 3 plan in ordine, con comandi), oppure apri F8 (impostazioni avanzate:
    business_hours, slot_guest_capacities, enum tema/sfondo) — chiedimi quale.

Stile didattico (breve + "cosa cambia per te"). Riferisci per fase.
```

---

## Contesto sintetico (se serve senza rileggere tutto)

### Cos'è la Console
App web separata e responsive, **solo per Matteo**, che legge/scrive lo **stesso DB Supabase TEST**
(`docnnernvp`) per configurare i ristoranti (tenant = tabella **`organizations`**, non `tenants`).
Vive **solo** nella sottocartella isolata `console/` (Vite+React+TS+Supabase, porta 5174), esclusa
dalla pipeline root di Matteo.

### Le 5 regole d'oro (sempre attive)
1. **Solo TEST** `docnnernvp` — `get_project_url` prima di ogni scrittura; PROD `rwuxgvld` → STOP.
2. **Scritture dati solo sui sandbox** `console-classic` / `console-pro`; ogni altro tenant = sola lettura.
3. **Schema/DDL/RLS/migrazioni mai dall'agente** → file in `plan-per-matteo/`, li esegue Matteo.
4. **Codice solo in `console/`** — non toccare `src/` né `supabase/`; niente import da `../src`;
   service role **mai** nel browser → scritture via Edge Function.
5. **Tracciabilità = priorità #1** — DEC-NNN per ogni decisione, blocco PHASE_AUDIT per fase prima del
   commit, commit citano fase + DEC, esecutore ≠ revisore.

### Modello dati (fonte di verità = DB)
- `organizations(id, slug, name, edition∈{classic,pro,enterprise}, is_active)`.
- Feature = edition + override **`tenant_features(tenant_id, feature_key, enabled, source, expires_at, …)`**
  combinati da `buildFeatures()` (`src/config/features.ts`, ricreato in `console/src/lib/features.ts`).
  **`organizations.qr_menu_enabled` è LEGACY** → ignorare per gli add-on.
- Impostazioni = **`restaurant_settings(tenant_id, setting_key, setting_value jsonb, updated_at)`**;
  chiavi nel registro `src/features/booking/lib/restaurantSettingRegistry.ts`.

### Cosa è stato costruito (F1→F7)
| Fase | Cosa | Commit |
|------|------|--------|
| F1 | Scaffolding `console/` isolata | `c981fc0` |
| F2 | Elenco ristoranti (legge `organizations`, sola lettura, responsive) | `49c0230` |
| F3 | Login reale (Magic Link + allowlist email) | `8ca16cf` |
| F4 | Edge Function `console-admin` (auth + sandbox guard + 3 azioni, service role solo server) | `bd7d038` |
| F5 | Cambio edition di un sandbox (via Edge) | `37bd836` |
| F6 | Feature flag `tenant_features` (ricrea `buildFeatures`) | `15da08a` |
| F7 | Impostazioni ristorante `restaurant_settings` (5 chiavi esposte) | `52a1b62` |

Tutte 🟢 VERDE. Unica rilavorazione: F4 round 1 🔴 (nomi colonna) → round 2 🟢 (DEC-026).

### ⚠️ Cosa resta a Matteo (sblocca l'uso reale)
1. **PLAN-DB-003** — deploy Edge `console-admin` su TEST + secret `CONSOLE_ALLOWED_EMAILS` +
   impostare `VITE_CONSOLE_ADMIN_FUNCTION_URL`. *Finché non fatto, i pulsanti di scrittura mostrano
   "function non configurata" (gestito, nessun crash).*
2. **PLAN-DB-002** — allowlist login lato DB/RLS (rinforzo del gate email).
3. **PLAN-DB-004** — policy SELECT per leggere gli **override** reali di `tenant_features`
   (oggi il pannello mostra solo il bundle dell'edition).

Poi: **test E2E** scritture sui sandbox = manuale di Matteo (o verifica via MCP dall'Orchestrator).

### Follow-up minori aperti
`FU-CONSOLE-5` (tenant sospesi non visibili al client anon), `FU-CONSOLE-7` (override reali → PLAN-DB-004),
`FU-CONSOLE-8` (leggibilità `prevValueRef`), `FU-CONSOLE-9` (chiavi impostazioni avanzate → eventuale F8).
`FU-CONSOLE-6` chiuso in F7.

### Decisioni di scope ancora "in sospeso" da Cristiano
- **Deploy** della Edge a Matteo deciso (DEC-021); quando Matteo conferma il dominio, DEC-012 (Vercel
  `console.<dominio>`) andrà finalizzata.
