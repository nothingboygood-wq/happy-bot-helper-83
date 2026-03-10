import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  Building2,
  Code,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  LogOut,
} from "lucide-react";

const steps = [
  { label: "Welcome", icon: Building2 },
  { label: "Bot Setup", icon: Bot },
  { label: "Widget", icon: Code },
];

const Onboarding = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [botName, setBotName] = useState("NexaDesk AI");
  const [greeting, setGreeting] = useState("Hi! 👋 How can I help you today?");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a friendly and helpful customer support chatbot. You help visitors with their questions about the business. Keep responses concise, professional, and helpful."
  );
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const widgetSnippet = user
    ? `<script src="${import.meta.env.VITE_SUPABASE_URL}/functions/v1/widget?uid=${user.id}"></script>`
    : "";

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const check = async () => {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();
      if (sub?.status === "active") {
        navigate("/dashboard");
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("company_name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile?.company_name) setCompanyName(profile.company_name);
    };
    check();
  }, [user, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveStep = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (step === 0) {
        await supabase
          .from("profiles")
          .update({ company_name: companyName })
          .eq("user_id", user.id);
      }
      if (step === 1) {
        const { data: existing } = await supabase
          .from("widget_settings")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (existing) {
          await supabase
            .from("widget_settings")
            .update({ bot_name: botName, greeting_message: greeting, system_prompt: systemPrompt })
            .eq("user_id", user.id);
        } else {
          await supabase
            .from("widget_settings")
            .insert({ user_id: user.id, bot_name: botName, greeting_message: greeting, system_prompt: systemPrompt });
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const activateFreeTrial = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveStep();
      // Create free trial subscription (7 days, 50 conversations)
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);

      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existingSub) {
        await supabase.from("subscriptions").insert({
          user_id: user.id,
          status: "active",
          plan: "free",
          trial_ends_at: trialEnd.toISOString(),
          activated_at: new Date().toISOString(),
        });
      }

      // Ensure widget settings exist
      const { data: ws } = await supabase
        .from("widget_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!ws) {
        await supabase.from("widget_settings").insert({ user_id: user.id });
      }

      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  const next = async () => {
    await saveStep();
    if (step < steps.length - 1) setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">NexaDesk</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
          <LogOut className="w-4 h-4 mr-2" /> Sign out
        </Button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    i < step
                      ? "gradient-accent text-accent-foreground"
                      : i === step
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm hidden sm:block ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-accent" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="bg-card rounded-2xl shadow-card p-8 text-center">
              <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-accent-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome to NexaDesk!</h1>
              <p className="text-muted-foreground mb-8">Let's get your AI chatbot set up. What's your company called?</p>
              <div className="max-w-sm mx-auto">
                <Input
                  placeholder="Your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="text-center text-lg h-12"
                />
              </div>
            </div>
          )}

          {/* Step 1: Bot Setup */}
          {step === 1 && (
            <div className="bg-card rounded-2xl shadow-card p-8">
              <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 text-center">Configure Your Bot</h2>
              <p className="text-muted-foreground mb-8 text-center">Customize how your chatbot behaves and greets visitors.</p>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Bot Name</label>
                  <Input value={botName} onChange={(e) => setBotName(e.target.value)} placeholder="NexaDesk AI" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Greeting Message</label>
                  <Input value={greeting} onChange={(e) => setGreeting(e.target.value)} placeholder="Hi! How can I help?" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">System Prompt</label>
                  <Textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={4}
                    placeholder="Describe your bot's personality and behavior..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">This tells the AI how to behave when talking to visitors.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Widget */}
          {step === 2 && (
            <div className="bg-card rounded-2xl shadow-card p-8">
              <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 text-center">Embed Your Widget</h2>
              <p className="text-muted-foreground mb-8 text-center">Add this script to any website to enable your AI chatbot.</p>

              <div className="relative mb-6">
                <pre className="bg-secondary rounded-xl p-4 pr-14 text-sm text-secondary-foreground overflow-x-auto whitespace-pre-wrap break-all font-mono">
                  {widgetSnippet}
                </pre>
                <Button variant="ghost" size="icon" className="absolute top-3 right-3" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full gradient-accent text-accent-foreground flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  Copy the embed code above
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full gradient-accent text-accent-foreground flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  Paste before the closing <code className="bg-secondary px-1 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full gradient-accent text-accent-foreground flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  The chatbot will appear as a floating button on your site
                </li>
              </ol>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button variant="ghost" onClick={prev} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={next} disabled={saving} className="gradient-accent text-accent-foreground hover:opacity-90 border-0">
                {saving ? "Saving..." : "Continue"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={activateFreeTrial} disabled={saving} className="gradient-accent text-accent-foreground hover:opacity-90 border-0">
                {saving ? "Activating..." : "Start Free Trial (7 days)"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
