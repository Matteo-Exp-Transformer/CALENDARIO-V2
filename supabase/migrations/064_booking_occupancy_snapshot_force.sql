-- 064 — S4 WP-B4: snapshot finestra di occupazione + override forzato admin su booking_requests
--
-- Contesto: masterplan §4 (snapshot disponibilità) + D14/D15 (snapshot, storico intatto) +
-- D25 (overbooking forzabile admin con traccia) + D37 (occupazione = arrivo + durata + buffer).
--
-- Colonne nullable / con default → RETROCOMPATIBILE: le prenotazioni esistenti non cambiano
-- comportamento (D15). occupancy_start/end e turnover_buffer_minutes sono popolati dal motore
-- (resolver occupazione) quando l'admin accetta/assegna; servono a Calendario/Analytica futura
-- per leggere la finestra senza ricalcoli.
--
-- forced_by_admin/force_reason: tracciano un overbooking forzato dallo staff (D25 + D43: l'override
-- forzato BLOCCA la capienza e registra autore/motivo).
--
-- RLS già presente su booking_requests; nessun nuovo GRANT (ALTER su tabella esistente,
-- i grant a livello tabella coprono le nuove colonne).

ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS occupancy_start timestamptz,
  ADD COLUMN IF NOT EXISTS occupancy_end timestamptz,
  ADD COLUMN IF NOT EXISTS turnover_buffer_minutes integer,
  ADD COLUMN IF NOT EXISTS forced_by_admin boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS force_reason text;

COMMENT ON COLUMN public.booking_requests.occupancy_start IS 'S4: inizio finestra di occupazione (= confirmed_start/arrivo). Snapshot, no ricalcoli.';
COMMENT ON COLUMN public.booking_requests.occupancy_end IS 'S4: fine finestra di occupazione (= confirmed_end + turnover_buffer_minutes). Snapshot.';
COMMENT ON COLUMN public.booking_requests.turnover_buffer_minutes IS 'S4/D37: buffer di turnover applicato (snapshot del valore di fascia al momento del calcolo).';
COMMENT ON COLUMN public.booking_requests.forced_by_admin IS 'S4/D25: true se lo staff ha forzato un overbooking oltre la capienza/finestra.';
COMMENT ON COLUMN public.booking_requests.force_reason IS 'S4/D25: motivo dell''overbooking forzato (audit).';
