# Prompt da incollare all'agente esecutore

> Copia/incolla il blocco sotto come messaggio iniziale all'agente.
> Le risposte alle sue domande sono già contenute nel TASK file: l'agente non deve più ridiscutere le scelte.

---

```
Esegui il piano di fix RLS multi-tenant su CalendarBackup-v2.

# Riferimenti (leggili PRIMA di iniziare, in quest'ordine)

1. Piano architetturale completo:
   C:\Users\matte.MIO\.claude\plans\c-users-matte-mio-cursor-plans-debug-rls-shiny-porcupine.md

2. Task operativo con sequenza, decisioni chiuse e regole di esecuzione:
   c:\Users\matte.MIO\Documents\GitHub\CalendarBackup-v2\Lavoro\Sessioni di lavoro\04-05-26\TASK_fix_rls_admin_users.md

# Risposte alle domande che hai sollevato (tutte chiuse, non riaprire)

- Approccio RLS: sub-query su admin_users via auth.jwt()->>'email' (helper current_admin_tenant_id, SECURITY DEFINER). Niente JWT custom claim, niente GUC.
- set_tenant(uuid) RPC: rimossa.
- Anon insert su booking_requests e email_logs: chiusi. Pubblico passa solo dalla Edge Function create-booking (service role, già esistente, non si tocca).
- tenant_usage: drop anon_select_tenant_usage e tenant_select_usage; nuova admin_select_tenant_usage su organization_id = current_admin_tenant_id().
- Trigger enforce_booking_tenant: solo per authenticated (IF auth.role() = 'authenticated'), così la Edge Function service-role non viene bloccata.
- Edge Functions: nessuna modifica.
- Ambiente: progetto Supabase rwuxgvldzrkabglkasym, unico. Niente staging.
- Tipi DB: rigenerare con `npm run db:types:linked` post-migrazione e committare src/types/database.ts.
- Admin → tenant: un admin = un solo tenant. current_admin_tenant_id() usa LIMIT 1 senza ORDER BY. Documentato come vincolo. NON introdurre supporto multi-tenant per admin.
- Warning GoTrueClient: fix con storageKey distinto + storage no-op su supabasePublic. Sufficiente.
- email_logs / logEmailToDatabase: ESTESO al piano. Aggiungere tenant_id a EmailLog, SendEmailOptions, e al payload insert. Sorgente del valore:
  * useEmailNotifications.ts (3 funzioni che ricevono BookingRequest) → passare booking.tenant_id
  * TestEmailModal.tsx → leggere tenantId da useTenantContext() con guard

# File da creare/modificare (lista chiusa)

- supabase/migrations/002_rls_admin_users.sql        [NUOVO]
- src/types/database.ts                              [rigenerato da db:types:linked]
- src/contexts/TenantContext.tsx                     [rimuovi 1 riga set_tenant]
- src/lib/supabase.ts                                [rimuovi setCurrentTenant]
- src/lib/supabasePublic.ts                          [storageKey + storage no-op]
- src/features/booking/hooks/useAdminBookingRequests.ts [tenant_id + guard]
- src/lib/email.ts                                   [tenant_id in tipi e insert]
- src/features/booking/hooks/useEmailNotifications.ts [pass booking.tenant_id]
- src/features/booking/components/TestEmailModal.tsx [useTenantContext + pass]
- src/types/booking.ts                               [verifica tenant_id su BookingRequest]

# Cosa NON fare

- Non modificare 001_schema_completo.sql.
- Non toccare le Edge Functions.
- Non rimuovere policy anon_select_* su organizations, restaurant_settings, menu_items, invite_tokens, rate_limits.
- Non aggiungere dipendenze npm.
- Non rifattorizzare oltre lo stretto necessario.
- Non fare git push --force o operazioni distruttive.
- Non aprire la PR con merge automatico.
- Non chiedere conferme intermedie su decisioni già scritte qui o nel TASK. Procedi fino al primo blocker reale.

# Sequenza

Segui esattamente i punti 1-9 della sezione "Sequenza esecuzione" del TASK file. In particolare:
- Branch fix/rls-admin-users
- Migrazione SQL → applica su Supabase Dashboard (rwuxgvldzrkabglkasym)
- Smoke test SQL (3 check + JWT simulation)
- Rigenera tipi
- Modifiche client (5.a → 5.h del TASK)
- npm run lint && npm run build (zero errori)
- Golden path browser (7 step)
- Test negativi (2 step)
- Apri PR

# Output finale richiesto

Report ≤300 parole con: SHA dei commit chiave, output dei 3 check SQL, esito numerato del golden path e dei test negativi, URL PR, deviazioni se presenti.

# Comportamento in caso di errore

- Errore SQL: NON patchare. Rollback policy a 001_schema_completo.sql. Riporta errore esatto.
- TypeScript rotto in file fuori lista: STOP e riporta.
- Test browser KO: raccogli status + body Network + console errors. NON tirare a indovinare con commit speculativi.

Procedi.
```

---

## Note per Matteo

- Quando passi questo prompt all'agente, accerta che abbia accesso in scrittura al repo CalendarBackup-v2 e alle credenziali Supabase del progetto `rwuxgvldzrkabglkasym` (per `db:types:linked` e per applicare la migrazione).
- Se l'agente non ha accesso al Supabase Dashboard, può comunque scrivere `002_rls_admin_users.sql` e dare a te il blocco SQL da applicare manualmente: lo fai eseguire lì e gli passi indietro l'output dei 3 check.
- Il piano è interamente reversibile: se qualcosa va storto in produzione, le policy vecchie possono essere riapplicate da `001_schema_completo.sql` e i 3 file React rollati con `git revert`.
