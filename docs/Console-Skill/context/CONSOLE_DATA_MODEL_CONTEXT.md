# Context — Modello dati che la Console legge/scrive

> Mappa del DB **reale** (TEST `docnnernvp`) per la Console. Verificato via MCP read-only.
> **Fonte di verità = DB + codice.** Se `docs/Servizio-Config/` diverge (es. scrive `tenants`),
> **vince questo file**, e si segnala il doc da correggere.

---

## 1. Tenant = `organizations` (NON `tenants`)

La tabella dei ristoranti è **`organizations`**. Colonne principali:

| Colonna | Tipo | Note |
|---------|------|------|
| `id` | uuid | PK; è il `tenant_id` usato altrove |
| `slug` | text | identificatore in URL pubblico |
| `name` | text | nome del locale |
| `edition` | text | **`classic` · `pro` · `enterprise`** — la versione venduta |
| `qr_menu_enabled` | bool | ⚠️ **LEGACY**: non usarla per attivare il Menu QR (vedi §3) |
| `plan` | text | piano commerciale |
| `is_active` | bool | tenant attivo/sospeso |
| `max_bookings_per_year` / `max_booking_requests_per_year` | int | limiti d'uso |

> Come l'app risolve il tenant e l'edition: `src/contexts/TenantContext.tsx` (legge
> `organizations.edition`, normalizza con `normalizeTenantEdition`).

---

## 2. Edition → feature flag: `buildFeatures()`

`src/config/features.ts` calcola i `FeatureFlags` combinando:

1. il **bundle dell'edition** (`classic` = nessuna feature avanzata; `pro`/`enterprise` = bundle pieno:
   sidebar, home, crm, analytics, servizio, walkIn, noShow, tableAssignments, qrMenu);
2. gli **override per-tenant** dalla tabella **`tenant_features`** (aggiunge una feature, o la toglie
   col prefisso `-`, es. `-analytics`).

```ts
buildFeatures(edition, overrides)  // overrides = feature_key attivi del tenant
```

→ Per la Console: cambiare la **versione venduta** = scrivere `organizations.edition`. Accendere/
spegnere **singole feature** fuori dal bundle = riga in `tenant_features`.

---

## 3. `tenant_features` = fonte di verità degli add-on

| Colonna | Tipo | Note |
|---------|------|------|
| `tenant_id` | uuid | → `organizations.id` |
| `feature_key` | text | es. `qrMenu`, `analytics` (chiavi di `FeatureFlags`) |
| `enabled` | bool | l'override è attivo |
| `source` | text | provenienza (es. vendita, promo) |
| `expires_at` | timestamptz | se valorizzata e passata → l'override **non vale più** |
| `notes` / `activated_at` / `created_by` | — | tracciamento |

⚠️ **Menu QR / add-on:** l'attivazione vera è una riga `tenant_features` con `enabled=true` e non
scaduta — **NON** `organizations.qr_menu_enabled` (legacy). Cfr. `docs/Marketing-Skill/MARKETING_SKILL.md` §3.
Oggi la tabella è **vuota** sul TEST: nessun override impostato.

---

## 4. Impostazioni ristorante = `restaurant_settings`

Tabella **key-value per tenant**:

| Colonna | Tipo |
|---------|------|
| `tenant_id` | uuid |
| `setting_key` | text |
| `setting_value` | jsonb |
| `updated_at` | timestamptz |

Le chiavi valide e i loro default/validatori sono nel **registro**
`src/features/booking/lib/restaurantSettingRegistry.ts` (`RESTAURANT_SETTING_KEYS_V1`): nome,
timezone, `booking_window_days`, `slot_guest_capacities`, `slot_limit_enabled`,
`booking_reject_out_of_slot`, `business_hours`, contatti, sfondo/foto pagina, preset menu, ecc.
I «numeri tecnici» della Console (durate, intervalli, cut-off, buffer…) sono chiavi di questo registro.

> La Console **non** inventa chiavi: usa quelle del registro. Aggiungere una chiave nuova = modifica
> al codice dell'app di Matteo → **plan per matteo**, non scrittura diretta.

---

## 5. Altre tabelle utili (sola lettura, salvo sandbox)

`service_slots` (fasce), `rooms`/`tables` (sale/tavoli Pro), `menu_categories`/`menu_items`,
`menu_qr_codes`, `admin_users` (login admin per tenant). Dettaglio schema completo:
`docs/Database-Skill/DB_SCHEMA_CONTEXT.md` (skill di Matteo, sola lettura).

---

## 6. Tenant sandbox del branch (le uniche righe scrivibili)

| slug | id | edition | uso |
|------|----|---------|-----|
| `console-classic` | `4c694cb8-66af-478f-afd2-8719f07d64b4` | classic | ristorante base |
| `console-pro` | `b5436de8-731e-469e-a888-36785823be6b` | pro | ristorante con sala/tavoli/QR |

> ✅ **Creati** (PLAN-DB-001, 2026-06-22) con `restaurant_name` + `timezone`. Le scritture di **dati**
> dell'agente vanno **solo** su questi due. Tenant di Matteo (`test-classic`, `da-tommaso`, …) =
> sola lettura. Scrittura via MCP `CONSOLE` (canale write su TEST `docnnernvp`).
