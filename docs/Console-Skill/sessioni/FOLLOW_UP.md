# Follow-up — branch Console (debiti differiti)

> Cose da fare più avanti, con codice `FU-CONSOLE-NNN`. Non bloccano il lavoro corrente.

| ID | Cosa | Note |
|----|------|------|
| FU-CONSOLE-1 | Correggere `tenants` → `organizations` nei doc `docs/Servizio-Config/` (BENVENUTO, INVENTARIO) | Disallineamento col DB reale; vince il DB |
| FU-CONSOLE-2 | Allineare i twin `AGENTS.md` / `.cursor/rules/comandi-base.mdc` alle regole del branch (se servono su questo branch) | Non in scope nel setup iniziale |
| FU-CONSOLE-3 | Scaffolding dell'app `console/` (Vite+React+TS+Supabase isolata) + esclusione dalla pipeline root | Sessione successiva |
| FU-CONSOLE-4 | Decidere meccanismo Edge per scritture privilegiate della Console | Risolto in F4 (DEC-010): Edge Function dedicata |
| FU-CONSOLE-5 | Tenant **sospesi** (`is_active=false`) non visibili al client anon (policy `anon_select_active_organizations` filtra solo gli attivi) | Rivalutare in F3/F5: con auth super-admin la lettura potrebbe mostrare tutti i tenant (eventuale policy RLS via plan-per-matteo) |
| FU-CONSOLE-6 | 3 warning ESLint `console.log` nell'Edge Function Deno `console/supabase/functions/console-admin/index.ts` (audit log server, lecito in Deno) | Far ignorare la cartella `supabase/functions` all'ESLint della Console o usare `console.info`; minore, non blocca |
| FU-CONSOLE-7 | Pannello feature flag mostra solo il **bundle**, non gli **override** reali di `tenant_features`, finché **PLAN-DB-004** (policy SELECT Console) non è eseguito da Matteo | DEC-028; logica UI corretta, manca solo il dato letto |

## Domande a Matteo — ✅ TUTTE RISOLTE (2026-06-22, consenso pieno)

Vedi `DECISION_LOG.md`:
1. Deploy → Vercel root `console/`, `console.<dominio>` (dominio TBD) — DEC-012.
2. Add-on via `tenant_features`; `qr_menu_enabled` legacy — DEC-008.
3. «+QR» = classic + `tenant_features` `qrMenu` — DEC-009.
4. Edge Function scritture privilegiate su TEST → OK — DEC-010.
5. Login = Supabase Auth allowlist email — DEC-011.

> **Standing authorization** attiva (DEC-013): si procede senza chiedere conferma, ma **tracciando
> tutto** (`TRACCIABILITA.md`).
