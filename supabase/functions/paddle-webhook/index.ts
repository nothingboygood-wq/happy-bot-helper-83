import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const eventType = body.event_type;
    const data = body.data;

    console.log("Paddle webhook event:", eventType);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (
      eventType === "subscription.created" ||
      eventType === "subscription.activated" ||
      eventType === "subscription.updated"
    ) {
      const customerEmail = data.customer?.email || data.customer_id;
      const paddleSubId = data.id;
      const paddleCustomerId = data.customer_id;
      const status = data.status; // active, paused, canceled, past_due, trialing

      // Find user by email
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", customerEmail)
        .limit(1);

      if (!profiles || profiles.length === 0) {
        console.log("No user found for email:", customerEmail);
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const userId = profiles[0].user_id;
      const priceId = data.items?.[0]?.price?.id;
      const plan =
        priceId === "pri_01kjeyspgn3smejp2dyb55nwy6"
          ? "starter"
          : priceId === "pri_01kjeytvp30tfrx579svf206w8"
          ? "growth"
          : "high_end";

      const subStatus =
        status === "active" || status === "trialing" ? "active" : "inactive";

      // Upsert subscription
      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingSub) {
        await supabase
          .from("subscriptions")
          .update({
            status: subStatus,
            plan,
            paddle_subscription_id: paddleSubId,
            paddle_customer_id: paddleCustomerId,
            activated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      } else {
        await supabase.from("subscriptions").insert({
          user_id: userId,
          status: subStatus,
          plan,
          paddle_subscription_id: paddleSubId,
          paddle_customer_id: paddleCustomerId,
          activated_at: new Date().toISOString(),
        });
      }

      // Also create default widget settings
      const { data: ws } = await supabase
        .from("widget_settings")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (!ws) {
        await supabase.from("widget_settings").insert({ user_id: userId });
      }

      console.log("Subscription updated for user:", userId, plan, subStatus);
    }

    if (eventType === "subscription.canceled") {
      const paddleSubId = data.id;

      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("paddle_subscription_id", paddleSubId);

      console.log("Subscription canceled:", paddleSubId);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
