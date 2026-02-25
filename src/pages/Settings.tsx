import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, ArrowLeft, Save, Check } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [botName, setBotName] = useState("BotDesk AI");
  const [greeting, setGreeting] = useState("Hi! 👋 How can I help you today?");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a friendly and helpful customer support chatbot. You help visitors with their questions about the business. Keep responses concise, professional, and helpful."
  );
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("widget_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setBotName(data.bot_name);
        setGreeting(data.greeting_message);
        setSystemPrompt(data.system_prompt);
      }
      setLoading(false);
    };
    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { data: existing } = await supabase
      .from("widget_settings")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("widget_settings")
        .update({
          bot_name: botName,
          greeting_message: greeting,
          system_prompt: systemPrompt,
        })
        .eq("user_id", user.id);
    } else {
      await supabase.from("widget_settings").insert({
        user_id: user.id,
        bot_name: botName,
        greeting_message: greeting,
        system_prompt: systemPrompt,
      });
    }
    setSaving(false);
    toast.success("Settings saved successfully!");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">BotDesk</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </header>

      <div className="container max-w-2xl mx-auto px-6 py-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Chatbot Settings</h1>
        <p className="text-muted-foreground mb-8">Customize how your AI chatbot behaves and greets visitors.</p>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Bot Name</label>
            <Input
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder="BotDesk AI"
            />
            <p className="text-xs text-muted-foreground mt-1">Displayed in the chat widget header.</p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Greeting Message</label>
            <Input
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder="Hi! How can I help you?"
            />
            <p className="text-xs text-muted-foreground mt-1">First message visitors see when they open the chat.</p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">System Prompt</label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful customer support chatbot..."
              rows={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Instructions that define your chatbot's personality and behavior. This is not visible to visitors.
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving} className="gradient-accent text-accent-foreground border-0">
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
