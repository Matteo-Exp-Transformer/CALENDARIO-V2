-- 068 — Nome tavolo unico a livello DB (debito "solo lato app", handoff S4 §4-bis punto 4).
--
-- Contesto: TableFormModal.tsx (hasDuplicateTableName, riga ~33) blocca già lato client i nomi
-- duplicati confrontando `candidateName.trim().toLocaleLowerCase('it')` contro tutti i tavoli
-- attivi del tenant, escluso il record in modifica. Nessun vincolo DB rispecchiava questa regola:
-- due admin che salvano nello stesso istante (race) o una scrittura diretta potevano creare due
-- tavoli con lo stesso nome. Questo indice è la seconda barriera, a livello dati.
--
-- Stessa regola del client, con `lower()` semplice invece di `toLocaleLowerCase('it')`: per
-- l'alfabeto italiano standard sono equivalenti (nessun carattere problematico tipo la "İ" turca
-- è in gioco). `btrim()` replica il `.trim()` lato client.
--
-- Parziale su `active = true`: i tavoli soft-deleted (active=false, vedi 007_tables.sql) non
-- entrano nel vincolo — un nome può essere riusato dopo che il vecchio tavolo è stato rimosso.
-- Per-tenant: lo stesso nome può esistere in tenant diversi (dati multi-tenant indipendenti).
--
-- Verifica preventiva 03-08-26 su TEST (docnnernvp): nessun duplicato attivo trovato
-- (54 tavoli attivi, 54 gruppi tenant+nome distinti) — l'indice non fallisce alla creazione.

CREATE UNIQUE INDEX tables_tenant_active_name_lower_idx
  ON public.tables (tenant_id, lower(btrim(name)))
  WHERE active = true;

COMMENT ON INDEX public.tables_tenant_active_name_lower_idx IS
  'S4 debito tecnico: nome tavolo unico case/spazi-insensitive fra i tavoli attivi dello stesso tenant. Doppia barriera con hasDuplicateTableName() lato client (TableFormModal.tsx).';
