-- 070 — FIX D (03-08-26, D-D): avviso "Tavolo a fine turno" sopravvive al ricaricamento
--
-- Contesto: FU-SERV-RELEASE-NOTICE-1. "Ancora occupato" chiudeva l'avviso solo nello stato
-- React locale (`handledReleaseTableIds` in AssignmentMapPanel.tsx), mai persistito: un
-- ricaricamento (F5, tablet che si risveglia, un secondo dispositivo) faceva ritornare
-- l'avviso anche se lo staff aveva già confermato. La conferma va sul record di
-- assegnazione, così vale per tutti i dispositivi per costruzione.
--
-- Semantica: NULL = nessuna conferma attiva (o mai richiesta). Quando lo staff preme
-- "Ancora occupato" si timbra now() sulle righe attive del tavolo (stessa fascia+data).
-- L'avviso torna una volta se adesso > release_notice_handled_at + intervallo di
-- richiamo (S-5, chiave JSONB restaurant_settings.table_release_notice_recall_minutes,
-- default 30 minuti — nessuna migrazione per la manopola, stesso pattern già in uso per
-- table_late_threshold_minutes, vedi useTableStatuses.ts DEFAULT_LATE_THRESHOLD_MINUTES).
--
-- RLS già presente su booking_table_assignments (011_booking_table_assignments.sql,
-- policy admin_update_bta senza restrizioni per colonna); nessun nuovo GRANT — stesso
-- schema di 065_table_assignments_force.sql (ALTER su tabella esistente).

ALTER TABLE public.booking_table_assignments
  ADD COLUMN IF NOT EXISTS release_notice_handled_at timestamptz;

COMMENT ON COLUMN public.booking_table_assignments.release_notice_handled_at IS
  'FIX D / FU-SERV-RELEASE-NOTICE-1: istante in cui lo staff ha premuto "Ancora occupato" sull''avviso di fine turno. NULL = nessuna conferma attiva. L''avviso torna una volta trascorso l''intervallo di richiamo (default 30 min, restaurant_settings.table_release_notice_recall_minutes).';
