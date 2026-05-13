# Database

## Migration alignment (storia)

Il DB remoto fu inizializzato con naming timestamped prima di adottare il naming numerico locale. I file 001–007 sono stati marcati come `applied` tramite `supabase migration repair` il 2026-05-13.

Il registro remoto contiene entrambe le versioni per ogni migrazione (es. `002` e `20260504181204`) — questo è atteso e non causa problemi.

Per nuove migrazioni: usare naming numerico progressivo (008_*, 009_*, …) ed eseguire `supabase migration repair --status applied <version>` dopo ogni apply via MCP, per mantenere l'allineamento.
