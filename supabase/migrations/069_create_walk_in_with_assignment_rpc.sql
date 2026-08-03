-- 069 — Walk-in: da "insert + rollback manuale" a scrittura atomica (handoff S4 §4-bis punto 4).
--
-- Contesto: useWalkInMutation.ts (client) faceva INSERT su booking_requests, poi controlli e
-- INSERT su booking_table_assignments, e se un passo falliva "annullava" con un secondo UPDATE
-- che marcava il booking `deleted` (rollback compensativo, non transazionale). Se quella seconda
-- scrittura falliva a sua volta (rete che cade a metà, sessione persa fra le due chiamate),
-- restava un walk-in `accepted` orfano, senza tavolo, invisibile alla pulizia.
--
-- Fix: un'unica RPC SECURITY DEFINER che replica ESATTAMENTE la stessa sequenza di controlli
-- dell'originale JS, nello stesso ordine (nessun drift comportamentale). Qualunque
-- RAISE EXCEPTION fa abortire l'intera funzione — Postgres fa il rollback da solo, non serve
-- nessuna scrittura compensativa lato client.
--
-- Pattern SECURITY DEFINER + check tenant esplicito: stesso di insert_service_slot /
-- update_service_slot (026_security_hardening.sql righe ~90-150). Solo-admin: mai GRANT ad anon
-- (il walk-in non è mai pubblico).
--
-- La durata (resolveBookingDuration) resta business logic pura lato client: la RPC riceve
-- duration_minutes/duration_source/duration_rule_version già calcolati, non li ricalcola.

CREATE OR REPLACE FUNCTION public.create_walk_in_with_assignment(
  p_tenant_id uuid,
  p_client_name text,
  p_num_guests integer,
  p_desired_date date,
  p_desired_time text,
  p_confirmed_start timestamptz,
  p_confirmed_end timestamptz,
  p_duration_minutes integer,
  p_duration_source text,
  p_duration_rule_version integer,
  p_placement text,
  p_table_id uuid,
  p_service_slot_id uuid,
  p_max_turns integer DEFAULT NULL,
  p_force_replace_existing boolean DEFAULT false,
  p_force_reason text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  v_booking_id uuid;
  v_active_assignment_id uuid;
  v_turn_number integer;
BEGIN
  -- 1. Check tenant: stesso pattern di insert_service_slot/update_service_slot (026).
  IF p_tenant_id IS DISTINCT FROM current_admin_tenant_id() THEN
    RAISE EXCEPTION 'tenant mismatch: cannot write across tenants'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Tavolo senza fascia = combinazione invalida (stesso testo dell'originale JS:
  --    l'onError del client mostra e.message in un toast, il testo utente deve restare identico).
  IF p_table_id IS NOT NULL AND p_service_slot_id IS NULL THEN
    RAISE EXCEPTION 'Fascia servizio mancante per assegnare il walk-in al tavolo.';
  END IF;

  -- 3. Insert booking_requests (status accepted, booking_type/source walk_in).
  INSERT INTO booking_requests (
    tenant_id, client_name, client_email, num_guests, desired_date, desired_time,
    status, booking_type, source, confirmed_start, confirmed_end, placement,
    duration_minutes, duration_source, duration_rule_version
  ) VALUES (
    p_tenant_id, p_client_name, '', p_num_guests, p_desired_date, p_desired_time,
    'accepted', 'walk_in', 'walk_in', p_confirmed_start, p_confirmed_end, p_placement,
    p_duration_minutes, p_duration_source, p_duration_rule_version
  )
  RETURNING id INTO v_booking_id;

  -- 4. Walk-in senza tavolo: un solo insert, già atomico di per sé.
  IF p_table_id IS NULL THEN
    RETURN v_booking_id;
  END IF;

  -- 5. Assignment attivo esistente sul tavolo/fascia/data (il più vecchio per turn_number).
  SELECT id INTO v_active_assignment_id
  FROM booking_table_assignments
  WHERE tenant_id = p_tenant_id
    AND table_id = p_table_id
    AND service_slot_id = p_service_slot_id
    AND date = p_desired_date
    AND checked_out_at IS NULL
  ORDER BY turn_number ASC
  LIMIT 1;

  -- 6. Occupato e non forzato → stop (testo identico all'originale). L'INSERT del punto 3
  --    viene annullato insieme a tutto il resto: è così che si ottiene l'atomicità.
  IF v_active_assignment_id IS NOT NULL AND NOT p_force_replace_existing THEN
    RAISE EXCEPTION 'Questo tavolo risulta occupato: usa la conferma guidata per liberarlo e assegnare il walk-in.';
  END IF;

  -- 7. Turno successivo: max esistente + 1 su TUTTE le righe (attive e chiuse), stesso calcolo
  --    di computeNextTurnNumber (tableTurnLimits.ts) — un turno concluso ha comunque consumato.
  SELECT COALESCE(MAX(turn_number), 0) + 1 INTO v_turn_number
  FROM booking_table_assignments
  WHERE tenant_id = p_tenant_id
    AND table_id = p_table_id
    AND service_slot_id = p_service_slot_id
    AND date = p_desired_date;

  -- 8. Turni esauriti e non forzato → stop (testo identico all'originale).
  IF NOT p_force_replace_existing
     AND p_max_turns IS NOT NULL
     AND v_turn_number > p_max_turns THEN
    RAISE EXCEPTION 'Turni esauriti per questo tavolo in questa fascia.';
  END IF;

  -- 9. Forzatura: libera l'occupante esistente (append-only, D48).
  IF v_active_assignment_id IS NOT NULL AND p_force_replace_existing THEN
    UPDATE booking_table_assignments
    SET checked_out_at = now()
    WHERE id = v_active_assignment_id;
  END IF;

  -- 10. Insert dell'assegnazione del walk-in.
  INSERT INTO booking_table_assignments (
    tenant_id, booking_id, table_id, service_slot_id, turn_number, date,
    checked_out_at, forced_by_admin, force_reason
  ) VALUES (
    p_tenant_id, v_booking_id, p_table_id, p_service_slot_id, v_turn_number, p_desired_date,
    NULL, COALESCE(p_force_replace_existing, false),
    CASE WHEN p_force_replace_existing
         THEN COALESCE(NULLIF(btrim(p_force_reason), ''), 'Forzatura guidata walk-in: tavolo liberato dallo staff')
         ELSE NULL
    END
  );

  RETURN v_booking_id;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.create_walk_in_with_assignment(
  uuid, text, integer, date, text, timestamptz, timestamptz, integer, text, integer, text, uuid, uuid, integer, boolean, text
) FROM anon, public;

GRANT EXECUTE ON FUNCTION public.create_walk_in_with_assignment(
  uuid, text, integer, date, text, timestamptz, timestamptz, integer, text, integer, text, uuid, uuid, integer, boolean, text
) TO authenticated;
