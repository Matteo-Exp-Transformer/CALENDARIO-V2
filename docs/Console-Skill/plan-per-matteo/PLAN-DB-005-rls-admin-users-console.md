# PLAN-DB-005 — RLS: policy SELECT su admin_users per la Console super-admin

**Stato:** da eseguire · **Ambiente:** TEST docnnernvp · **Data:** 2026-06-22

## Obiettivo

La Console super-admin (F8 — vista "Tutti gli utenti", REQ-001) deve poter **leggere**
`public.admin_users` per elencare tutti gli admin con l'azienda associata. Oggi non esiste
una policy SELECT per l'utente Console su questa tabella: la Console loggata (ruolo
`authenticated`, email Matteo) legge **0 righe** e non può mostrare la lista utenti.

Questa policy serve **solo alla lettura lato Console**. Le scritture (crea/modifica/elimina
utente — F10/F11) passano dalla Edge Function `console-admin` con la **service role key**, che
bypassa la RLS: quindi le WRITE non hanno bisogno di policy extra.

> Stesso pattern delle policy già eseguite su TEST (DEC-034): `console_admin_select_organizations`,
> `console_admin_select_tenant_features`, `console_admin_select_restaurant_settings`. Si riusa la
> funzione esistente `public.is_console_user()` (SECURITY DEFINER, true se l'email del JWT è in
> `public.console_allowed_emails`).

## Modifica proposta (SQL)

```sql
-- Policy di SOLA LETTURA su admin_users per gli utenti Console autorizzati.
-- Riusa is_console_user() (già creata con la parte lettura di PLAN-DB-002, DEC-034).
-- Un utente autenticato in allowlist Console vede TUTTE le righe di admin_users,
-- non solo quelle del proprio tenant (l'utente Console non è un admin di ristorante).
CREATE POLICY "console_admin_select_admin_users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING ( public.is_console_user() );
```

## Tabelle/colonne toccate

- `public.admin_users` — nuova policy **SELECT** per l'utente Console (nessuna colonna modificata).

## Impatto / rischi

- **Nessun impatto sull'app di Matteo:** le policy esistenti di `admin_users` (quelle usate dai
  ristoratori / dall'app) restano **intatte**. Questa aggiunge solo un canale di lettura super-admin.
- L'utente Console **non** può scrivere direttamente: nessuna policy INSERT/UPDATE/DELETE aggiunta.
  Le scritture passano dalla Edge Function con service role (bypass RLS).
- `admin_users` contiene PII (email/nome degli admin): la lettura è ristretta agli utenti in
  `console_allowed_emails` tramite `is_console_user()`. Rischio basso.

## Come verificare dopo (su TEST)

1. Login nella Console con l'email autorizzata (`matteo94cl@gmail.com`).
2. Aprire la vista **Utenti**: deve mostrare gli admin reali (oggi ~5 righe) con azienda associata.
3. Query diretta di verifica (deve restituire le righe, non 0):
   ```sql
   SELECT au.email, au.name, o.name AS azienda, o.slug, o.edition
   FROM public.admin_users au
   JOIN public.organizations o ON o.id = au.tenant_id
   ORDER BY au.email;
   ```

## Note per Matteo

- Dipende dalla parte **lettura** di PLAN-DB-002 già eseguita (DEC-034): `console_allowed_emails`
  + `is_console_user()`. Se per qualche motivo non ci fossero, eseguirle prima.
- Dopo questa policy, la vista Utenti (F8) mostra i dati reali; finché non è eseguita, la Console
  mostra un messaggio "Nessun utente visibile — verifica PLAN-DB-005" senza errori.
- Da formalizzare poi in migrazione versionata insieme alle altre policy Console (vedi FU-CONSOLE-10).
- REQ correlate: REQ-001 (vista utenti). DEC correlate: DEC-039 ("utente"=admin del ristorante), DEC-037.
```

