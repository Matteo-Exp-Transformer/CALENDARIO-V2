-- S4 / WP-A2 / D50: eliminazione sala MORBIDA.
-- La sala non viene più cancellata fisicamente: diventa archiviata con active=false.
-- Le prenotazioni assegnate ai suoi tavoli non si perdono mai (rientrano nel cassetto
-- "da assegnare" timbrando checked_out_at, lato client). Predispone il "ripristina sala" futuro.
--
-- RLS già presente su rooms (mig. 008): admin_update_rooms consente l'UPDATE del soft-delete.
-- Nessun nuovo GRANT necessario: è l'aggiunta di una colonna a una tabella esistente.

ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

-- Indice parziale: l'operativo elenca solo le sale vive (filtro active = true).
CREATE INDEX IF NOT EXISTS rooms_tenant_active_idx
  ON public.rooms (tenant_id)
  WHERE active = true;
