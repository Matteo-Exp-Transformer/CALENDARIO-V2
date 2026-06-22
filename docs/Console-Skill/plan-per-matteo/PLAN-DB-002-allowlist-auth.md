# PLAN-DB-002 — Allowlist email lato DB per la Console super-admin

**Stato:** da eseguire · **Ambiente:** TEST docnnernvp · **Data:** 2026-06-22

## Obiettivo

La Console (F3) ha un gate allowlist lato client: solo le email in `VITE_CONSOLE_ALLOWED_EMAILS`
(variabile d'ambiente Vite) possono vedere la UI. Questo gate è **UX, non sicurezza forte**: un
utente tecnico potrebbe aggirarlo modificando il bundle in un contesto di sviluppo.

La difesa vera è la RLS di Supabase: anche senza il gate client, le query al DB restituiscono
solo ciò che la policy permette. Questo plan propone di aggiungere un secondo livello di difesa
DB-side: una tabella `console_allowed_emails` che la RLS usa per filtrare gli accessi
alle tabelle sensibili dalla Console.

**Effetto concreto per la Console:** anche se il gate client venisse bypassato, il DB negherebbe
le letture/scritture a qualsiasi utente la cui email non è nella tabella `console_allowed_emails`.

## Contesto architetturale

- La Console usa il client pubblico (anon key + RLS): non ha la service role.
- Le policies RLS esistenti sulle tabelle `organizations`, `restaurant_settings`, `tenant_features`
  sono pensate per l'app di Matteo (ristoratori), non per un super-admin.
- L'idea è aggiungere policy OR alternative che permettano l'accesso quando
  `auth.jwt() ->> 'email'` è presente in `console_allowed_emails`.

## Modifica proposta (SQL)

```sql
-- =========================================================
-- PLAN-DB-002: Allowlist email per Console super-admin
-- Ambiente: TEST docnnernvp
-- Eseguire in: Supabase Dashboard → SQL Editor
-- =========================================================

-- 1. Tabella allowlist
CREATE TABLE IF NOT EXISTS public.console_allowed_emails (
  email TEXT PRIMARY KEY CHECK (email = lower(email)),  -- stored lowercase
  note  TEXT,          -- es. "Matteo - super admin principale"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Abilita RLS sulla tabella stessa (solo service role può scriverla)
ALTER TABLE public.console_allowed_emails ENABLE ROW LEVEL SECURITY;

-- Nessuna policy SELECT pubblica: la tabella è visibile solo al service role.
-- La funzione helper sotto legge direttamente con SECURITY DEFINER.

-- 2. Funzione helper SECURITY DEFINER (non esposta come RPC pubblica)
--    Restituisce true se l'email dell'utente corrente è in allowlist.
CREATE OR REPLACE FUNCTION public.is_console_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER  -- gira come owner, bypassa la RLS su console_allowed_emails
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.console_allowed_emails
    WHERE email = lower(auth.jwt() ->> 'email')
  );
$$;

-- Revoca l'accesso pubblico alla funzione: è usata solo internamente dalle policy.
REVOKE ALL ON FUNCTION public.is_console_user() FROM PUBLIC;

-- 3. Policy di esempio su `organizations` (adatta alle altre tabelle)
--    ATTENZIONE: verifica prima le policy esistenti con:
--      SELECT * FROM pg_policies WHERE tablename = 'organizations';
--    Non sovrascrivere policy esistenti senza capirle.

-- Esempio: aggiungere accesso SELECT per la Console (se non esiste già)
-- CREATE POLICY "console_super_admin_select_organizations"
--   ON public.organizations
--   FOR SELECT
--   TO authenticated
--   USING (public.is_console_user());

-- Esempio: accesso UPDATE edition/is_active per la Console (scritture future)
-- CREATE POLICY "console_super_admin_update_organizations"
--   ON public.organizations
--   FOR UPDATE
--   TO authenticated
--   USING (public.is_console_user())
--   WITH CHECK (public.is_console_user());

-- 4. Inserisci l'email di Matteo nell'allowlist
--    (sostituisci con l'email reale)
-- INSERT INTO public.console_allowed_emails (email, note)
-- VALUES ('matteo@esempio.com', 'Matteo - super admin Console');
```

## Tabelle/colonne toccate

- `public.console_allowed_emails` — nuova tabella (email allowlist)
- `public.is_console_user()` — nuova funzione SECURITY DEFINER
- `public.organizations` — nuove policy RLS (da aggiungere dopo verifica esistenti)
- Potenzialmente: `public.restaurant_settings`, `public.tenant_features` (stesso pattern)

## Impatto / rischi

- **Rischio policy clash:** se `organizations` ha già una policy SELECT per `authenticated`,
  aggiungerne un'altra con OR potrebbe modificare comportamenti attesi dall'app di Matteo.
  → Soluzione: usare `FOR SELECT TO authenticated USING (...)` con condizione che include
  sia il caso app di Matteo che il caso Console, oppure creare un ruolo DB dedicato `console_admin`.
- **SECURITY DEFINER:** la funzione `is_console_user()` bypassa la RLS su `console_allowed_emails`.
  Questo è intenzionale (la funzione deve leggere la tabella senza esporre un endpoint pubblico),
  ma richiede attenzione: il `search_path` è fissato per evitare SQL injection via schema.
- **Prima esecuzione:** inserire l'email di Matteo DOPO aver creato la tabella, altrimenti
  il primo accesso alla Console darà errore DB anche con gate client superato.

## Come verificare dopo (su TEST)

```sql
-- 1. Verifica che la tabella esista con i vincoli giusti
SELECT * FROM public.console_allowed_emails;

-- 2. Testa la funzione (devi essere loggato come Matteo in una sessione Supabase):
SELECT public.is_console_user();
-- Deve restituire: true

-- 3. Verifica le policy su organizations
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'organizations';
```

## Note per Matteo

- Prima di eseguire: controlla le policy esistenti su `organizations` con la query sopra.
  Le policy esistenti potrebbero già coprire il caso Console (o entrare in conflitto).
- L'email da inserire in `console_allowed_emails` deve essere quella con cui sei registrato
  in **Supabase Auth** (non un altro account). Puoi verificarla in:
  Supabase Dashboard → Authentication → Users.
- Questa modifica è opzionale per il MVP: la Console funziona con il solo gate client.
  Va eseguita prima di portare la Console in produzione su dati reali.
- Le righe SQL commentate (`-- CREATE POLICY`) vanno de-commentate e adattate; non eseguire
  le versioni template così come sono.
