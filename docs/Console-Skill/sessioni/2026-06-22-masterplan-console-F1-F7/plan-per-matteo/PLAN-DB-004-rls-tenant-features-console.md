# PLAN-DB-004 — RLS: policy SELECT su tenant_features per la Console super-admin

**Stato:** da eseguire · **Ambiente:** TEST docnnernvp · **Data:** 2026-06-22

## Obiettivo

La Console super-admin (F6) deve poter **leggere** `tenant_features` per mostrare
lo stato corrente degli override (add-on attivi/spenti) con il loro effetto combinato.

Attualmente l'unica policy su `tenant_features` è `admin_manage_tenant_features`
(role: `authenticated`, qual: `tenant_id = current_admin_tenant_id()`).
La funzione `current_admin_tenant_id()` cerca l'email JWT nella tabella `admin_users`:
l'utente Console (Matteo / Cristiano, autenticato via Supabase Auth Magic Link)
**non è in `admin_users`**, quindi la policy filtra via tutte le righe silenziosamente.
Risultato: la Console legge sempre 0 righe, non può distinguere "nessun override" da
"override presenti ma filtrati da RLS".

Questa policy serve **solo alla lettura lato Console**. Le scritture (INSERT/UPDATE via
`upsert_tenant_feature`) passano dalla Edge Function con la service role key, che bypassa
la RLS — quindi le WRITE non hanno bisogno di policy extra.

## Modifica proposta (SQL)

```sql
-- Policy di sola lettura su tenant_features per gli utenti Console autenticati.
-- L'email del super-admin è nella tabella console_allowlist (creata con PLAN-DB-002).
-- Un utente autenticato la cui email è in console_allowlist può leggere TUTTE le righe
-- di tenant_features (non solo quelle del proprio tenant).
CREATE POLICY "console_admin_read_tenant_features"
  ON public.tenant_features
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.console_allowlist ca
      WHERE lower(ca.email) = lower(auth.jwt() ->> 'email')
        AND ca.is_active = true
    )
  );
```

> **Nota:** se la tabella `console_allowlist` (PLAN-DB-002) non è ancora stata creata
> ed eseguita, eseguire prima PLAN-DB-002, poi questa policy.

## Alternativa più semplice (solo per TEST, se console_allowlist non esiste ancora)

```sql
-- Alternativa temporanea: policy per l'email hardcoded di Matteo/Cristiano.
-- Da sostituire con la versione sopra (console_allowlist) prima della produzione.
CREATE POLICY "console_admin_read_tenant_features_dev"
  ON public.tenant_features
  FOR SELECT
  TO authenticated
  USING (
    lower(auth.jwt() ->> 'email') IN (
      'tulli.cristiano@libero.it'
      -- aggiungere altre email Console se necessario
    )
  );
```

## Tabelle/colonne toccate

- `public.tenant_features` — nuova policy SELECT per il ruolo Console

## Impatto / rischi

- **Nessun impatto sull'app di Matteo**: la policy esistente `admin_manage_tenant_features`
  (che usa `current_admin_tenant_id()`) resta intatta e continua a funzionare per i ristoratori.
- La nuova policy aggiunge solo un canale di lettura per l'utente Console.
- L'utente Console non può scrivere direttamente (nessun INSERT/UPDATE policy aggiunta).
  Le scritture passano dalla Edge Function con service role (bypass RLS).
- Rischio basso: si tratta di una READ-ONLY policy per un utente super-admin.

## Come verificare dopo (su TEST)

1. Fare login nella Console con l'email autorizzata.
2. Aprire il pannello Feature Flags di un tenant sandbox.
3. Attivare un override tramite il toggle (richiede Edge Function deployata — PLAN-DB-003).
4. Verificare che il pannello mostri il dot verde con sorgente `+override` invece di `—` o `bundle`.
5. Query diretta di verifica:
   ```sql
   SELECT * FROM tenant_features
   WHERE tenant_id = '4c694cb8-66af-478f-afd2-8719f07d64b4'; -- console-classic
   ```

## Note per Matteo

- Questo plan dipende da PLAN-DB-002 (console_allowlist) se si usa la variante principale.
- La variante alternativa (email hardcoded) è sufficiente per il branch di sviluppo.
- Dopo deploy Edge Function (PLAN-DB-003) + questa policy: il flusso completo
  toggle → scrittura Edge Function → refetch lettura sarà verificabile end-to-end.
- DEC correlate: DEC-008 (qr_menu_enabled legacy), DEC-009 (+QR = classic + qrMenu override).
