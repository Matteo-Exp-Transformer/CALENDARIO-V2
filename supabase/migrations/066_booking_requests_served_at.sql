-- 066 — S4 FIX-2: archiviazione prenotazione al checkout (S4-REQ-3)
--
-- Contesto: liberare un tavolo non deve rimettere la prenotazione nel cassetto
-- «da assegnare». Si marca served_at sul booking; i dati restano per le
-- statistiche senza una tabella archivio separata.
--
-- Distinzione operativa (stesso checked_out_at sull'assignment):
--   • checkout normale → served_at = now() (se nessuna altra assegnazione attiva)
--   • undo / «Libera e assegna» / riassegnazione rapida → NON toccano served_at
--   • riassegnazione successiva → served_at torna a null
--
-- Nullable → retrocompatibile. RLS e GRANT già presenti su booking_requests.

ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS served_at timestamptz;

COMMENT ON COLUMN public.booking_requests.served_at IS
  'S4/FIX-2: prenotazione servita (checkout fine turno). NULL = ancora da assegnare o in corso. Non valorizzato da undo né da sostituzione forzata.';
