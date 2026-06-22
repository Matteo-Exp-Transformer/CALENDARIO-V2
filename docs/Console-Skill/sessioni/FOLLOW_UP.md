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
| FU-CONSOLE-9 | Chiavi impostazioni **avanzate** non esposte in F7 (`business_hours`, `slot_guest_capacities`, enum sfondo/tema, preset/promo…) | Eventuale **F8**: richiedono editor dedicati e/o ricreare valori enum dell'app |
| FU-CONSOLE-10 | **Formalizzare in migrazioni versionate** le modifiche SQL fatte in diretta su TEST (tabella `console_allowed_emails`, funzione `is_console_user()`, 3 policy SELECT) | DEC-034. Oggi vivono solo nel DB TEST, non in `supabase/migrations/`. Da fare prima di qualsiasi uso fuori da TEST. Vedi `collaborazione/STATO_AMBIENTE_TEST.md` |
| FU-CONSOLE-11 | **Console: comandi per modificare anche i parametri della pagina Prenota** (Personalizza Form: tipologie/durate, campi, testi, card…) oltre a quelli di Servizio | Richiesto da Matteo 22-06-26 durante la validazione del Masterplan Servizio. Si lega a `FU-SERV-ADMIN-PANEL-1` (classificazione manopole onboarding/preset/console) e alla sotto-area **S6** del Masterplan Servizio. Obiettivo: che dalla console privata si possano cambiare i parametri-chiave di Prenota senza entrare nell'admin del tenant. Da progettare con la sessione manopole. |

## Domande a Matteo — ✅ TUTTE RISOLTE (2026-06-22, consenso pieno)

Vedi `DECISION_LOG.md`:
1. Deploy → Vercel root `console/`, `console.<dominio>` (dominio TBD) — DEC-012.
2. Add-on via `tenant_features`; `qr_menu_enabled` legacy — DEC-008.
3. «+QR» = classic + `tenant_features` `qrMenu` — DEC-009.
4. Edge Function scritture privilegiate su TEST → OK — DEC-010.
5. Login = Supabase Auth allowlist email — DEC-011.

> **Standing authorization** attiva (DEC-013): si procede senza chiedere conferma, ma **tracciando
> tutto** (`TRACCIABILITA.md`).
