import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLAN_LIMITS: Record<string, number> = {
  free: 50,
  starter: 500,
  growth: 5000,
  high_end: -1, // unlimited
  admin: -1,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, widget_user_id, conversation_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const ownerUserId = widget_user_id;

    // Check subscription if this is a widget request
    if (ownerUserId) {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
      const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

      // Check subscription status
      const { data: isActive } = await supabase.rpc("is_subscription_active", { _user_id: ownerUserId });
      if (!isActive) {
        return new Response(JSON.stringify({ error: "Subscription inactive or expired. Please upgrade your plan." }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check conversation limits based on plan
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", ownerUserId)
        .maybeSingle();

      if (sub) {
        const limit = PLAN_LIMITS[sub.plan] ?? 500;
        if (limit > 0) {
          const { data: count } = await supabase.rpc("get_monthly_conversation_count", { _user_id: ownerUserId });
          if ((count ?? 0) >= limit) {
            return new Response(JSON.stringify({ 
              error: `Monthly conversation limit reached (${limit}). Please upgrade your plan.` 
            }), {
              status: 429,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
      }

      // Create or reuse conversation record
      let convoId = conversation_id;
      if (!convoId) {
        const { data: convo } = await supabase
          .from("conversations")
          .insert({ user_id: ownerUserId, status: "active", visitor_name: "Website Visitor" })
          .select("id")
          .single();
        convoId = convo?.id;
      }

      // Save user message
      const lastUserMsg = messages[messages.length - 1];
      if (convoId && lastUserMsg?.role === "user") {
        await supabase.from("messages").insert({
          conversation_id: convoId,
          role: "user",
          content: lastUserMsg.content,
        });
      }

      // Fetch custom system prompt and model
      const { data: settings } = await supabase
        .from("widget_settings")
        .select("system_prompt, model, training_text, training_files, website_url, qa_pairs")
        .eq("user_id", ownerUserId)
        .maybeSingle();

      // Build training context from files
      let trainingContext = "";
      if (settings?.training_text) trainingContext += `\n\nTraining Content:\n${settings.training_text}`;
      if (settings?.website_url) trainingContext += `\n\nWebsite: ${settings.website_url}`;

      // Inject Q&A pairs
      const qaPairs = (settings?.qa_pairs as { question: string; answer: string }[] | null) || [];
      if (qaPairs.length > 0) {
        trainingContext += `\n\nQ&A Knowledge Base:`;
        for (const qa of qaPairs) {
          if (qa.question && qa.answer) {
            trainingContext += `\nQ: ${qa.question}\nA: ${qa.answer}\n`;
          }
        }
      }

      const trainingFiles = (settings?.training_files as { name: string; url: string }[] | null) || [];
      for (const file of trainingFiles) {
        try {
          const res = await fetch(file.url);
          if (res.ok) {
            const text = await res.text();
            trainingContext += `\n\nFile "${file.name}":\n${text.slice(0, 10000)}`;
          }
        } catch { /* skip failed fetches */ }
      }

      const systemPrompt = (settings?.system_prompt ||
        `You are NexaDesk AI, a friendly and helpful customer support chatbot. Keep responses concise, professional, and helpful.`) + trainingContext;
      const selectedModel = settings?.model || "google/gemini-3-flash-preview";

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          stream: true,
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        console.error("AI gateway error:", response.status, t);
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
          status: response.status === 429 ? 429 : 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Read the stream, save assistant response, then return it
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullAssistantContent = "";
      const chunks: Uint8Array[] = [];

      // We need to tee: collect full content AND stream to client
      // Use TransformStream to intercept
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();

      // Process in background
      (async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            await writer.write(value);
            const text = decoder.decode(value, { stream: true });
            const lines = text.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const json = line.slice(6).trim();
                if (json === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(json);
                  const c = parsed.choices?.[0]?.delta?.content;
                  if (c) fullAssistantContent += c;
                } catch {}
              }
            }
          }
          await writer.close();
          // Save assistant message after stream completes
          if (convoId && fullAssistantContent) {
            await supabase.from("messages").insert({
              conversation_id: convoId,
              role: "assistant",
              content: fullAssistantContent,
            });
            // Update conversation timestamp
            await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", convoId);
          }
        } catch (e) {
          console.error("Stream processing error:", e);
          try { await writer.close(); } catch {}
        }
      })();

      return new Response(readable, {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "text/event-stream",
          "X-Conversation-Id": convoId || "",
        },
      });
    }

    // Default path (internal chat widget on NexaDesk site)
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are NexaDesk AI, a friendly and helpful customer support chatbot. You help visitors with their questions about the business. Keep responses concise, professional, and helpful.`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
