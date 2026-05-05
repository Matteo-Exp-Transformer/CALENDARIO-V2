import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Metodo non consentito" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const body = await req.json();
    const {
      tenantSlug,
      client_name,
      client_email,
      client_phone,
      desired_date,
      desired_time,
      num_guests,
      special_requests,
      booking_type,
      event_type,
      menu_selection,
      menu_total_per_person,
      menu_total_booking,
      dietary_restrictions,
      preset_menu,
      placement,
      menu,
    } = body;

    // DB: client_email è NOT NULL (default ''). Non usare `|| null`: stringa vuota è falsy e diventerebbe NULL.
    const clientEmailNormalized =
      typeof client_email === "string" ? client_email.trim() : "";

    // --- Validation ---
    if (!tenantSlug) {
      return new Response(
        JSON.stringify({ error: "tenantSlug è obbligatorio" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!client_name || typeof client_name !== "string") {
      return new Response(
        JSON.stringify({ error: "client_name è obbligatorio" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (client_name.length > 200) {
      return new Response(
        JSON.stringify({ error: "client_name non può superare 200 caratteri" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!desired_date || !/^\d{4}-\d{2}-\d{2}$/.test(desired_date)) {
      return new Response(
        JSON.stringify({ error: "desired_date è obbligatorio (formato YYYY-MM-DD)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!num_guests || typeof num_guests !== "number" || num_guests < 1) {
      return new Response(
        JSON.stringify({ error: "num_guests è obbligatorio e deve essere >= 1" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Resolve tenant from slug ---
    const { data: org, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("id, max_booking_requests_per_year")
      .eq("slug", tenantSlug)
      .single();

    if (orgError || !org) {
      return new Response(
        JSON.stringify({ error: "Organizzazione non trovata" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const orgId = org.id;
    const maxRequestsPerYear = org.max_booking_requests_per_year;

    // --- Check annual limits ---
    const currentYear = new Date().getFullYear();
    const { data: usage } = await supabaseAdmin
      .from("tenant_usage")
      .select("booking_requests_count")
      .eq("organization_id", orgId)
      .eq("year", currentYear)
      .single();

    if (usage && usage.booking_requests_count >= maxRequestsPerYear) {
      return new Response(
        JSON.stringify({ error: "Limite annuale di richieste raggiunto per questa organizzazione" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Rate limiting by IP ---
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();

    const { count: recentRequests } = await supabaseAdmin
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .eq("endpoint", "create-booking")
      .gte("requested_at", oneMinuteAgo);

    if (recentRequests !== null && recentRequests >= 5) {
      return new Response(
        JSON.stringify({ error: "Troppe richieste. Riprova tra un minuto." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Insert booking request ---
    const insertData: Record<string, unknown> = {
      tenant_id: orgId,
      client_name,
      client_email: clientEmailNormalized,
      client_phone: client_phone || null,
      desired_date,
      desired_time: desired_time || null,
      num_guests,
      special_requests: special_requests || null,
      booking_type: booking_type || null,
      event_type: event_type || null,
      menu: menu || null,
      menu_selection: menu_selection || null,
      menu_total_per_person: menu_total_per_person ?? null,
      menu_total_booking: menu_total_booking ?? null,
      dietary_restrictions: dietary_restrictions || null,
      preset_menu: preset_menu || null,
      placement: placement || null,
      booking_source: "public",
      status: "pending",
    };

    const { data: booking, error: insertError } = await supabaseAdmin
      .from("booking_requests")
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Errore durante il salvataggio della prenotazione" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Record IP in rate_limits ---
    await supabaseAdmin.from("rate_limits").insert({
      ip_address: ip,
      endpoint: "create-booking",
    });

    // --- Return success ---
    return new Response(
      JSON.stringify({ success: true, booking }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Errore interno del server" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
