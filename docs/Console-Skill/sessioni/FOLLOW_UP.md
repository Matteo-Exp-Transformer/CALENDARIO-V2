# Follow-up — branch Console (debiti differiti)

> Cose da fare più avanti, con codice `FU-CONSOLE-NNN`. Non bloccano il lavoro corrente.

| ID | Cosa | Note |
|----|------|------|
| FU-CONSOLE-1 | Correggere `tenants` → `organizations` nei doc `docs/Servizio-Config/` (BENVENUTO, INVENTARIO) | Disallineamento col DB reale; vince il DB |
| FU-CONSOLE-2 | Allineare i twin `AGENTS.md` / `.cursor/rules/comandi-base.mdc` alle regole del branch (se servono su questo branch) | Non in scope nel setup iniziale |
| FU-CONSOLE-3 | Scaffolding dell'app `console/` (Vite+React+TS+Supabase isolata) + esclusione dalla pipeline root | Sessione successiva |
| FU-CONSOLE-4 | Decidere meccanismo Edge per scritture privilegiate della Console | Dipende dalle risposte di Matteo |

## Domande aperte per Matteo (vedi README del Console-Skill)

1. Indirizzo/dominio + dove si deploya la Console.
2. `tenant_features` vs `organizations.edition`/`qr_menu_enabled`: la Console pilota gli add-on via `tenant_features` (legacy `qr_menu_enabled` da ignorare)? Confermare.
3. Mappatura «+QR»: classic + riga `tenant_features` `qrMenu`?
4. Ok creare un'Edge Function dedicata alle scritture Console su TEST?
5. Login Console: Supabase Auth con allowlist email solo Matteo?
