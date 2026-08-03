-- S4 fix: le fasce chiuse (max_turns = 0) non devono comparire nel percorso pubblico.
-- Bug confermato in RIPROVA_D (docs/Sessioni di lavoro/02-08-26/E2E-Report/RIPROVA_D.md, voce 8-3):
-- "Chiudi servizio" azzera service_slots.max_turns ma né get_public_slot_config né
-- get_available_arrival_times né l'Edge create-booking lo controllavano — il form pubblico
-- continuava a mostrare e accettare gli orari della fascia chiusa.
-- max_turns IS NULL = nessun limite (fascia aperta, va inclusa) — stesso trattamento di
-- isServiceSlotClosed() in src/features/booking/hooks/useServiceSlots.ts (solo `=== 0` è chiuso).

DROP FUNCTION IF EXISTS public.get_public_slot_config(text);

CREATE FUNCTION public.get_public_slot_config(p_slug text)
RETURNS TABLE(
  slot_id uuid,
  slot_name text,
  start_time text,
  end_time text,
  arrival_step_minutes integer,
  min_duration integer,
  slot_limit_enabled boolean,
  cutoff_minutes integer,
  late_arrival_allowed boolean,
  min_order_time_minutes integer,
  timezone text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_tenant_id uuid;
  v_slots_enabled boolean := false;
  v_limit_enabled boolean := false;
  v_cutoff integer := 60;
  v_late boolean := false;
  v_min_order integer := 45;
  v_timezone text := 'Europe/Rome';
BEGIN
  IF p_slug IS NULL OR p_slug !~ '^[a-z0-9][a-z0-9-]{0,62}$' THEN RETURN; END IF;

  SELECT o.id INTO v_tenant_id
  FROM public.organizations o
  WHERE o.slug = p_slug AND o.is_active = true
  LIMIT 1;
  IF v_tenant_id IS NULL THEN RETURN; END IF;

  SELECT
    COALESCE(bool_or((setting_value #>> '{}')::boolean) FILTER (WHERE setting_key = 'booking_time_slots_enabled'), false),
    COALESCE(bool_or((setting_value #>> '{}')::boolean) FILTER (WHERE setting_key = 'slot_limit_enabled'), false),
    COALESCE(max((setting_value #>> '{}')::integer) FILTER (WHERE setting_key = 'cutoff_minutes'), 60),
    COALESCE(bool_or((setting_value #>> '{}')::boolean) FILTER (WHERE setting_key = 'late_arrival_allowed'), false),
    COALESCE(max((setting_value #>> '{}')::integer) FILTER (WHERE setting_key = 'min_order_time_minutes'), 45),
    COALESCE(max(setting_value #>> '{}') FILTER (WHERE setting_key = 'timezone'), 'Europe/Rome')
  INTO v_slots_enabled, v_limit_enabled, v_cutoff, v_late, v_min_order, v_timezone
  FROM public.restaurant_settings
  WHERE tenant_id = v_tenant_id
    AND setting_key IN ('booking_time_slots_enabled', 'slot_limit_enabled', 'cutoff_minutes',
      'late_arrival_allowed', 'min_order_time_minutes', 'timezone');

  IF NOT v_slots_enabled THEN RETURN; END IF;

  RETURN QUERY
  SELECT ss.id, ss.name::text, to_char(ss.start_time, 'HH24:MI'),
    to_char(ss.end_time, 'HH24:MI'), ss.arrival_step_minutes, ss.min_duration,
    v_limit_enabled, greatest(0, least(v_cutoff, 1440)), v_late,
    greatest(1, least(v_min_order, 1440)), v_timezone
  FROM public.service_slots ss
  WHERE ss.tenant_id = v_tenant_id
    AND (ss.max_turns IS NULL OR ss.max_turns <> 0)
  ORDER BY ss.display_order, ss.id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_public_slot_config(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_public_slot_config(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_slot_config(text) TO anon;

-- Difesa in profondità: stesso filtro anche in get_available_arrival_times. Oggi è irraggiungibile
-- per una fascia chiusa (get_public_slot_config filtrata a monte non la fa comparire nella UI, e
-- questa RPC gira solo per fasce già presenti nell'elenco), ma tenere le due RPC pubbliche coerenti
-- evita che un domani si scolleghi di nuovo una fascia chiusa dal controllo se l'ordine delle
-- chiamate lato client cambia o se qualcuno la interroga direttamente.

DROP FUNCTION IF EXISTS public.get_available_arrival_times(text, date, integer, integer);

CREATE FUNCTION public.get_available_arrival_times(
  p_slug text,
  p_date date,
  p_card_duration integer DEFAULT 0,
  p_num_guests integer DEFAULT 1
)
RETURNS TABLE(slot_id uuid, slot_name text, available_times text[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_tenant_id uuid;
  v_slots_enabled boolean := false;
  v_limit_enabled boolean := false;
  v_slot record;
  v_cap integer;
  v_occupied integer;
  v_override_cap integer;
  v_legacy_cap integer;
  v_times text[];
  v_start integer;
  v_end integer;
  v_current integer;
BEGIN
  IF p_slug IS NULL OR p_slug !~ '^[a-z0-9][a-z0-9-]{0,62}$'
     OR p_date IS NULL OR p_num_guests NOT BETWEEN 1 AND 500
     OR p_card_duration NOT BETWEEN 0 AND 1440 THEN
    RETURN;
  END IF;

  SELECT o.id INTO v_tenant_id
  FROM public.organizations o
  WHERE o.slug = p_slug AND o.is_active = true
  LIMIT 1;
  IF v_tenant_id IS NULL THEN RETURN; END IF;

  SELECT COALESCE((rs.setting_value #>> '{}')::boolean, false)
  INTO v_slots_enabled
  FROM public.restaurant_settings rs
  WHERE rs.tenant_id = v_tenant_id
    AND rs.setting_key = 'booking_time_slots_enabled';

  SELECT COALESCE((rs.setting_value #>> '{}')::boolean, false)
  INTO v_limit_enabled
  FROM public.restaurant_settings rs
  WHERE rs.tenant_id = v_tenant_id
    AND rs.setting_key = 'slot_limit_enabled';

  IF NOT COALESCE(v_slots_enabled, false) OR NOT COALESCE(v_limit_enabled, false) THEN
    RETURN;
  END IF;

  FOR v_slot IN
    SELECT ss.id, ss.name, ss.start_time, ss.end_time,
           ss.max_guests, ss.arrival_step_minutes, ss.display_order
    FROM public.service_slots ss
    WHERE ss.tenant_id = v_tenant_id
      AND (ss.max_turns IS NULL OR ss.max_turns <> 0)
    ORDER BY ss.display_order, ss.id
  LOOP
    SELECT (rs.setting_value ->> v_slot.id::text)::integer
    INTO v_legacy_cap
    FROM public.restaurant_settings rs
    WHERE rs.tenant_id = v_tenant_id
      AND rs.setting_key = 'slot_guest_capacities';

    SELECT sso.max_guests
    INTO v_override_cap
    FROM public.service_slot_overrides sso
    WHERE sso.tenant_id = v_tenant_id
      AND sso.service_slot_id = v_slot.id
      AND sso.date_from <= p_date
      AND sso.date_to >= p_date
    ORDER BY (sso.date_to - sso.date_from) ASC, sso.created_at DESC
    LIMIT 1;

    v_cap := COALESCE(v_override_cap, v_slot.max_guests, v_legacy_cap);

    SELECT COALESCE(sum(br.num_guests), 0)::integer
    INTO v_occupied
    FROM public.booking_requests br
    WHERE br.tenant_id = v_tenant_id
      AND br.status = 'accepted'
      AND br.no_show IS NOT TRUE
      AND br.confirmed_start IS NOT NULL
      AND (br.confirmed_start AT TIME ZONE 'Europe/Rome')::date = p_date
      AND (
        CASE WHEN v_slot.end_time < v_slot.start_time
          THEN (br.confirmed_start AT TIME ZONE 'Europe/Rome')::time >= v_slot.start_time
            OR (br.confirmed_start AT TIME ZONE 'Europe/Rome')::time < v_slot.end_time
          ELSE (br.confirmed_start AT TIME ZONE 'Europe/Rome')::time >= v_slot.start_time
            AND (br.confirmed_start AT TIME ZONE 'Europe/Rome')::time < v_slot.end_time
        END
      );

    v_times := ARRAY[]::text[];
    IF v_cap IS NULL OR v_occupied + p_num_guests <= v_cap THEN
      v_start := extract(hour from v_slot.start_time)::integer * 60
        + extract(minute from v_slot.start_time)::integer;
      v_end := extract(hour from v_slot.end_time)::integer * 60
        + extract(minute from v_slot.end_time)::integer;
      IF v_end <= v_start THEN v_end := v_end + 1440; END IF;
      v_current := v_start;
      WHILE v_current < v_end LOOP
        v_times := array_append(v_times,
          lpad(((v_current % 1440) / 60)::text, 2, '0') || ':' ||
          lpad((v_current % 60)::text, 2, '0'));
        v_current := v_current + v_slot.arrival_step_minutes;
      END LOOP;
    END IF;

    slot_id := v_slot.id;
    slot_name := v_slot.name;
    available_times := v_times;
    RETURN NEXT;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.get_available_arrival_times(text, date, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_available_arrival_times(text, date, integer, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_available_arrival_times(text, date, integer, integer) TO anon;
