# Follow-up — branch Console (debiti differiti)

> Cose da fare più avanti, con codice `FU-CONSOLE-NNN`. Non bloccano il lavoro corrente.

| ID | Cosa | Note |
|----|------|------|
| FU-CONSOLE-1 | Correggere `tenants` → `organizations` nei doc `docs/Servizio-Config/` (BENVENUTO, INVENTARIO) | Disallineamento col DB reale; vince il DB |
| FU-CONSOLE-2 | Allineare i twin `AGENTS.md` / `.cursor/rules/comandi-base.mdc` alle regole del branch (se servono su questo branch) | Non in scope nel setup iniziale |
| FU-CONSOLE-3 | Scaffolding dell'app `console/` (Vite+React+TS+Supabase isolata) + esclusione dalla pipeline root | Sessione successiva |
| FU-CONSOLE-4 | Decidere meccanismo Edge per scritture privilegiate della Console | Risolto in F4 (DEC-010): Edge Function dedicata |
| FU-CONSOLE-5 | ~~Tenant **sospesi** (`is_active=false`) non visibili al client anon~~ | ✅ **RISOLTO** (DEC-034): la policy `console_admin_select_organizations` per l'utente Console mostra TUTTI i tenant, attivi e sospesi |
| FU-CONSOLE-6 | ~~3 warning ESLint `console.log` nell'Edge Function Deno~~ | ✅ **RISOLTO in F7** (DEC-031): ESLint Console ignora `supabase/` |
| FU-CONSOLE-7 | ~~Pannello feature flag mostra solo il **bundle**, non gli **override** reali di `tenant_features`~~ | ✅ **RISOLTO** (DEC-034): policy `console_admin_select_tenant_features` eseguita su TEST → gli override reali sono leggibili |
| FU-CONSOLE-8 | `prevValueRef` in `IntEditor` (`RestaurantSettingsPanel.tsx`) usa `useState` con nome da `useRef` — fuorviante | Solo leggibilità; funziona. Cleanup con `/simplify` in sessione futura |
| FU-CONSOLE-9 | **Editor dedicati per le sezioni intervista non ancora esposte** nella scheda azienda (F9): Sez.1 contatti (`contact_email/phone/address`, `timezone`), Sez.3 orari/fasce (`business_hours`, `service_slots`, `slot_guest_capacities`), Sez.5 sala/tavoli Pro (`rooms`/`tables`/`booking_placement_areas`), Sez.6 menu/QR (`menu_categories`/`menu_items`/`menu_qr_codes`/promo), Sez.7 aspetto (`public_booking_page_background`, `app_theme`, `booking_public_form_config`). Inoltre: rendere **dinamici** gli stati ✅/⬜ della mappa di copertura per Sez.2/Sez.4 (oggi hardcoded ✅) | Aperto in **F9** (DEC-046/REQ-002 tappa 1). Richiedono editor dedicati e/o ricreare valori enum dell'app; alcune toccano nuove tabelle (sala/tavoli/menu). Pianificare come sotto-tappe dopo il write-block |
| FU-CONSOLE-12 | **Allineare il gate UI dei pannelli scrittura a DEC-037**: `EditionSelector`/`FeatureFlagsPanel`/`RestaurantSettingsPanel` gattano ancora la scrittura su `isSandboxTenant` (solo sandbox), mentre l'Edge (F10) ora consente la scrittura su tutte le aziende. Quindi nella scheda azienda (F9) edition/feature/impostazioni restano in sola lettura per i tenant reali | Le azioni utenti/aziende (F11/F12) già valgono su tutte le aziende; manca l'estensione coerente ai 3 pannelli di configurazione. Richiede di sostituire il gate `isSandboxTenant` con il modello allowlist+Edge anche lato UI |
| FU-CONSOLE-11 | `auth.admin.listUsers()` senza paginazione nell'Edge `console-admin` (usato in `update_admin_user`/`delete_admin_user`/`delete_tenant`): default ~50 utenti, potrebbe non trovare il target se Auth supera 50 utenti | Segnalato dal revisore F10. Su TEST (pochi utenti) non è un problema pratico; prima di uso reale, paginare o usare lookup mirato per email |
| FU-CONSOLE-10 | **Formalizzare in migrazioni versionate** le modifiche SQL fatte in diretta su TEST (tabella `console_allowed_emails`, funzione `is_console_user()`, 3 policy SELECT) | DEC-034. Oggi vivono solo nel DB TEST, non in `supabase/migrations/`. Da fare prima di qualsiasi uso fuori da TEST. Vedi `collaborazione/STATO_AMBIENTE_TEST.md` |

## Domande a Matteo — ✅ TUTTE RISOLTE (2026-06-22, consenso pieno)

Vedi `DECISION_LOG.md`:
1. Deploy → Vercel root `console/`, `console.<dominio>` (dominio TBD) — DEC-012.
2. Add-on via `tenant_features`; `qr_menu_enabled` legacy — DEC-008.
3. «+QR» = classic + `tenant_features` `qrMenu` — DEC-009.
4. Edge Function scritture privilegiate su TEST → OK — DEC-010.
5. Login = Supabase Auth allowlist email — DEC-011.

> **Standing authorization** attiva (DEC-013): si procede senza chiedere conferma, ma **tracciando
> tutto** (`TRACCIABILITA.md`).
