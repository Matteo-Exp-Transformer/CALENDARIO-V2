# Database

## Migration alignment (storia)

Il DB remoto fu inizializzato con naming timestamped prima di adottare il naming numerico locale. I file 001–007 sono stati marcati come `applied` tramite `supabase migration repair` il 2026-05-13.

I 6 timestamp remoti orfani (20260504181204–20260513010545) sono stati marcati come `reverted` il 2026-05-13 tramite `supabase migration repair --status reverted`, eliminando il blocco su `db push`.

### Limite noto: doppio prefisso 003

Esistono due file con prefisso `003`:
- `003_fix_tenant_usage_triggers_security_definer.sql`
- `003_menu_categories.sql`

La tabella `schema_migrations` ha primary key su `version`, quindi può registrare una sola voce `003`. La seconda riga in `migration list --linked` mostra sempre `Remote` vuoto per `003_menu_categories.sql` — questo è atteso e non indica un problema funzionale. La tabella `menu_categories` esiste correttamente nel DB.

`db push --dry-run` segnala `003_menu_categories.sql` come pendente — è un falso positivo dovuto al doppio prefisso. Non eseguire `db push --include-all` per questo file: il push fallisce sulla constraint `schema_migrations_pkey` (la versione `003` esiste già).

**Workaround per future push:** usare `supabase db push` normalmente — la CLI applicherà solo file con versioni non ancora registrate (≥ 008). Il file `003_menu_categories.sql` verrà segnalato ma non causerà problemi reali.

Per nuove migrazioni: usare naming numerico progressivo (008_*, 009_*, …) ed eseguire `supabase db push` direttamente — il registro è ora allineato.
