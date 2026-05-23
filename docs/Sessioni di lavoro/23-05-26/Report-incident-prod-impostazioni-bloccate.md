# Incident produzione — pagina Impostazioni bloccata + menu non salvabile

**Data:** 2026-05-23
**Severity:** alta (sito utilizzabile solo per login, dashboard inerte)
**Durata stimata:** dal merge della 026 in prod DB → fino al push di `main` (~poche ore)

## Sintomo riportato dall'utente

> "in produzione pagina impostazioni non si carica … dice caricamento impostazioni e non succede nulla"

In aggiunta: impossibile salvare o modificare ingredienti / categorie menu.

## Diagnosi

Nei log API di Supabase prod (`rwuxgvldzrkabglkasym`) si vedevano decine di richieste `POST /rest/v1/rpc/check_admin_email` che rispondevano **401** per admin validi (`0cavuz0@gmail.com`, `alritrovo@gmail.com`), pur subito dopo un `POST /auth/v1/token` riuscito con 200.

Eseguendo `SET ROLE anon; SELECT check_admin_email(...)` direttamente sul DB → `permission denied for function check_admin_email` (SQLSTATE 42501) → stesso errore dei log.

Causa: il commit `11ab985` ("feat(security): hardening DB prod") contiene **sia** la migrazione `026_security_hardening.sql` (REVOKE EXECUTE da anon su `check_admin_email`) **sia** il fix client che sposta la chiamata della RPC dal client pubblico (`supabasePublic`) a quello autenticato (`supabase`). La migrazione era stata applicata al DB di produzione, ma il commit era solo sul branch `Sviluppo-Dashboard-laterale` e non era mai stato portato su `main`. Vercel servendo `main` continuava a deployare la build vecchia che chiama `check_admin_email` come anonimo → 401 sistematici → `TenantContext` non popola mai `tenantId`.

Effetto a cascata su tutto ciò che dipende da `tenantId`:

- `RestaurantSettingsTab`: tutte le query `useRestaurantSetting(...)` hanno `enabled: !!tenantId` → restano in `pending` per sempre → il componente entra nel ramo `if (loading && !allSuccess)` e mostra "Caricamento impostazioni…" indefinitamente.
- Mutazioni menu (`useCreateMenuCategory`, `useUpdateMenuCategory`, `useDeleteMenuCategory`, hook ingredienti): le policy RLS richiedono `tenant_id = current_admin_tenant_id()` e gli `insert/update` passano `tenant_id: null` → policy violation lato DB / silent failure lato UI.

## Fix applicato

Fast-forward merge `main ← Sviluppo-Dashboard-laterale` da `ac02267` a `8dcb325` (15 commit avanti, 0 indietro → merge pulito senza conflitti), seguito da `git push origin main`. Vercel ha triggerato il redeploy automatico.

Contenuto principale del catch-up su main:

- Commit `11ab985` — fix `TenantContext` per RPC autenticata + vista `organizations_public`.
- Commit `758b456` — rate limit 3/min + blacklist IP dopo 2 sforamenti (migrazione 027).
- Commit `e8d9981` — privacy policy v2 + nome tenant dinamico + skill legal-production.
- Commit `8f197fb` — layout calendario full-width + responsive.
- Commit `0455924` — rimozione dead code (EmailLogsModal, TestEmailModal, SettingsTab v1, useEmailLogs, pdfAttachment).
- Vari report di sessione e doc skill.

## Verifica utente

1. Aprire il sito in produzione in finestra anonima (evita cache).
2. Login con admin reale.
3. Tab Impostazioni → deve caricare i campi.
4. Aggiungere/modificare categoria menu → deve salvarsi.

In caso di "non funziona" senza errori, hard-refresh (`Ctrl+Shift+R`) per scaricare il bundle nuovo.

## Lezione operativa

Quando una migrazione DB introduce restrizioni di permesso (REVOKE EXECUTE, FORCE RLS, GRANT revocati), il fix client che si adegua **deve viaggiare insieme**: serve essere certi che il commit con la migrazione sia su `main` e che Vercel abbia completato il deploy *prima* di applicare la migrazione in prod — oppure applicare migrazione e deploy nella stessa finestra. La memoria `project_prod_main_lag_026.md` ora documenta questa trappola per le sessioni future.
