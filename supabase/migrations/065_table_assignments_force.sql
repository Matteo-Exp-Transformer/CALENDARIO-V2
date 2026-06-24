-- 065 — S4 WP-B4: override forzato admin su booking_table_assignments
--
-- Contesto: D25 (overbooking forzabile con avviso) + D39 (multi-tavolo, il UNIQUE già lo permette).
-- Lo staff può assegnare un tavolo già occupato / oltre i turni configurati forzando con motivo:
-- la riga di assegnazione registra forced_by_admin + force_reason per l'audit (coerente con D27/D32).
--
-- RLS già presente su booking_table_assignments; nessun nuovo GRANT (ALTER su tabella esistente).

ALTER TABLE public.booking_table_assignments
  ADD COLUMN IF NOT EXISTS forced_by_admin boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS force_reason text;

COMMENT ON COLUMN public.booking_table_assignments.forced_by_admin IS 'S4/D25: true se l''assegnazione è stata forzata oltre turni/occupazione.';
COMMENT ON COLUMN public.booking_table_assignments.force_reason IS 'S4/D25: motivo della forzatura (audit).';
