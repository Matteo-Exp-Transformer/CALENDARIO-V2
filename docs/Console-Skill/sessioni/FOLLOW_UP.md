# Follow-up — branch Console (debiti differiti)

> Cose da fare più avanti, con codice `FU-CONSOLE-NNN`. Non bloccano il lavoro corrente.

| ID | Cosa | Note |
|----|------|------|
| FU-CONSOLE-1 | Correggere `tenants` → `organizations` nei doc `docs/Servizio-Config/` (BENVENUTO, INVENTARIO) | Disallineamento col DB reale; vince il DB |
| FU-CONSOLE-2 | Allineare i twin `AGENTS.md` / `.cursor/rules/comandi-base.mdc` alle regole del branch (se servono su questo branch) | Non in scope nel setup iniziale |
| FU-CONSOLE-3 | Scaffolding dell'app `console/` (Vite+React+TS+Supabase isolata) + esclusione dalla pipeline root | Sessione successiva |
| FU-CONSOLE-4 | Decidere meccanismo Edge per scritture privilegiate della Console | Dipende dalle risposte di Matteo |

## Domande a Matteo — ✅ TUTTE RISOLTE (2026-06-22, consenso pieno)

Vedi `DECISION_LOG.md`:
1. Deploy → Vercel root `console/`, `console.<dominio>` (dominio TBD) — DEC-012.
2. Add-on via `tenant_features`; `qr_menu_enabled` legacy — DEC-008.
3. «+QR» = classic + `tenant_features` `qrMenu` — DEC-009.
4. Edge Function scritture privilegiate su TEST → OK — DEC-010.
5. Login = Supabase Auth allowlist email — DEC-011.

> **Standing authorization** attiva (DEC-013): si procede senza chiedere conferma, ma **tracciando
> tutto** (`TRACCIABILITA.md`).
