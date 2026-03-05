import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot, ArrowLeft, Save, LogOut, ChevronDown, Check, Globe, FileText,
  Type, HelpCircle, Upload, RefreshCw, MessageSquare, Sun, Moon,
} from "lucide-react";
import { toast } from "sonner";

const AI_MODELS = [
  { id: "google/gemini-3-flash-preview", name: "Gemini 3.0 Flash", provider: "Google", icon: "G" },
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", icon: "G" },
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", icon: "G" },
  { id: "google/gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", provider: "Google", icon: "G" },
  { id: "openai/gpt-5", name: "GPT-5", provider: "OpenAI", icon: "⚙" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini", provider: "OpenAI", icon: "⚙" },
  { id: "openai/gpt-5-nano", name: "GPT-5 Nano", provider: "OpenAI", icon: "⚙" },
  { id: "openai/gpt-5.2", name: "GPT-5.2", provider: "OpenAI", icon: "⚙" },
];

const TEMPLATES = [
  { id: "customer_support", name: "Customer Support", prompt: "You are a friendly and helpful customer support chatbot. You help visitors with their questions about the business. Keep responses concise, professional, and helpful." },
  { id: "ai_agent", name: "AI Agent", prompt: "You are an intelligent AI agent. You assist users with complex tasks, provide detailed analysis, and offer actionable recommendations. Be thorough yet concise." },
  { id: "sales_assistant", name: "Sales Assistant", prompt: "You are a persuasive and knowledgeable sales assistant. Help potential customers understand product benefits, answer objections, and guide them toward a purchase decision. Be warm and professional." },
  { id: "knowledge_base", name: "Knowledge Base", prompt: "You are a knowledge base assistant. Provide accurate, detailed information from the training data. If you don't know something, clearly state that. Always cite relevant sources when possible." },
  { id: "custom", name: "Custom", prompt: "" },
];

type TabKey = "instructions" | "training" | "appearance";

const Settings = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [botName, setBotName] = useState("NexaDesk AI");
  const [greeting, setGreeting] = useState("Hi! 👋 How can I help you today?");
  const [systemPrompt, setSystemPrompt] = useState(TEMPLATES[0].prompt);
  const [model, setModel] = useState("google/gemini-3-flash-preview");
  const [template, setTemplate] = useState("customer_support");
  const [theme, setTheme] = useState("light");
  const [primaryColor, setPrimaryColor] = useState("#E8734A");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [trainingText, setTrainingText] = useState("");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modelOpen, setModelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("instructions");
  const [uploading, setUploading] = useState(false);

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
        setModel((data as any).model || "google/gemini-3-flash-preview");
        setTemplate((data as any).template || "customer_support");
        setTheme((data as any).theme || "light");
        setPrimaryColor((data as any).primary_color || "#E8734A");
        setProfilePictureUrl((data as any).profile_picture_url || null);
        setWebsiteUrl((data as any).website_url || "");
        setTrainingText((data as any).training_text || "");
      }
      setLoading(false);
    };
    fetchSettings();
  }, [user]);

  const handleTemplateChange = (templateId: string) => {
    setTemplate(templateId);
    const t = TEMPLATES.find((t) => t.id === templateId);
    if (t && t.id !== "custom") setSystemPrompt(t.prompt);
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/profile.${ext}`;
    const { error } = await supabase.storage.from("agent-assets").upload(path, file, { upsert: true });
    if (error) {
      toast.error("Failed to upload image");
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("agent-assets").getPublicUrl(path);
    setProfilePictureUrl(urlData.publicUrl);
    setUploading(false);
    toast.success("Profile picture uploaded!");
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      bot_name: botName,
      greeting_message: greeting,
      system_prompt: systemPrompt,
      model,
      template,
      theme,
      primary_color: primaryColor,
      profile_picture_url: profilePictureUrl,
      website_url: websiteUrl,
      training_text: trainingText,
    };

    const { data: existing } = await supabase
      .from("widget_settings")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase.from("widget_settings").update(payload).eq("user_id", user.id);
    } else {
      await supabase.from("widget_settings").insert({ user_id: user.id, ...payload });
    }
    setSaving(false);
    toast.success("Settings saved successfully!");
  };

  const selectedModel = AI_MODELS.find((m) => m.id === model);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "instructions", label: "Instructions", icon: <MessageSquare className="w-4 h-4" /> },
    { key: "training", label: "Training Sources", icon: <Globe className="w-4 h-4" /> },
    { key: "appearance", label: "Agent UI", icon: <Sun className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">NexaDesk</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-secondary/50 rounded-lg p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3">
            {activeTab === "instructions" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Instructions</h2>
                  <p className="text-muted-foreground text-sm mt-1">Select a prompt, customize the instructions, and choose your model.</p>
                </div>

                {/* Model selector */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Model</label>
                  <div className="relative">
                    <button
                      onClick={() => setModelOpen(!modelOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 border border-border rounded-lg bg-card text-foreground hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">
                          {selectedModel?.icon}
                        </span>
                        <span className="font-medium">{selectedModel?.name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${modelOpen ? "rotate-180" : ""}`} />
                    </button>
                    {modelOpen && (
                      <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-elevated max-h-80 overflow-y-auto">
                        {AI_MODELS.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => { setModel(m.id); setModelOpen(false); }}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">
                                {m.icon}
                              </span>
                              <div>
                                <div className="font-medium text-sm text-foreground">{m.name}</div>
                                <div className="text-xs text-muted-foreground">{m.provider}</div>
                              </div>
                            </div>
                            {model === m.id && <Check className="w-4 h-4 text-accent" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Template */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Template</label>
                  <div className="relative">
                    <select
                      value={template}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground appearance-none cursor-pointer"
                    >
                      {TEMPLATES.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Instructions</label>
                  <Textarea
                    value={systemPrompt}
                    onChange={(e) => { setSystemPrompt(e.target.value); setTemplate("custom"); }}
                    placeholder="You are a helpful customer support chatbot..."
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Instructions that define your chatbot's personality and behavior.
                  </p>
                </div>

                {/* Bot Name */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Bot Name</label>
                  <Input value={botName} onChange={(e) => setBotName(e.target.value)} placeholder="NexaDesk AI" />
                </div>

                {/* Greeting */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Greeting Message</label>
                  <Input value={greeting} onChange={(e) => setGreeting(e.target.value)} placeholder="Hi! How can I help you?" />
                </div>
              </div>
            )}

            {activeTab === "training" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Add Training Sources</h2>
                  <p className="text-muted-foreground text-sm mt-1">Add content to train your agent on your business knowledge.</p>
                </div>

                {/* Website */}
                <div className="border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Website</h3>
                      <p className="text-xs text-muted-foreground">Add your website URL for the agent to reference</p>
                    </div>
                  </div>
                  <Input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Text */}
                <div className="border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Type className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Text Content</h3>
                      <p className="text-xs text-muted-foreground">Paste custom text, FAQs, or documentation</p>
                    </div>
                  </div>
                  <Textarea
                    value={trainingText}
                    onChange={(e) => setTrainingText(e.target.value)}
                    placeholder="Paste your training content here..."
                    rows={6}
                    className="resize-none"
                  />
                </div>

                {/* Q&A - placeholder */}
                <div className="border border-border rounded-xl p-5 opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Q&A Pairs</h3>
                        <p className="text-xs text-muted-foreground">Add question and answer pairs</p>
                      </div>
                    </div>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">Coming Soon</span>
                  </div>
                </div>

                {/* File upload - placeholder */}
                <div className="border border-border rounded-xl p-5 opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">File Upload</h3>
                        <p className="text-xs text-muted-foreground">Upload PDFs, docs, or text files</p>
                      </div>
                    </div>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">Coming Soon</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Agent's UI</h2>
                  <p className="text-muted-foreground text-sm mt-1">Customize your agent's appearance and colors to match your brand.</p>
                </div>

                {/* Agent Name */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Agent Name</label>
                  <Input value={botName} onChange={(e) => setBotName(e.target.value)} placeholder="NexaDesk AI" />
                </div>

                {/* Appearance */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Appearance</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTheme("light")}
                      className={`p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2 ${
                        theme === "light" ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                      }`}
                    >
                      <div className="w-full h-10 bg-muted rounded-lg" />
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${theme === "light" ? "border-accent bg-accent" : "border-muted-foreground"}`} />
                        <span className="text-sm text-foreground">Light</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2 ${
                        theme === "dark" ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                      }`}
                    >
                      <div className="w-full h-10 bg-foreground rounded-lg" />
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${theme === "dark" ? "border-accent bg-accent" : "border-muted-foreground"}`} />
                        <span className="text-sm text-foreground">Dark</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Primary Color */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 font-mono"
                    />
                    <Button variant="ghost" size="icon" onClick={() => setPrimaryColor("#E8734A")}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Profile Picture */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
                      {profilePictureUrl ? (
                        <img src={profilePictureUrl} alt="Agent" className="w-full h-full object-cover" />
                      ) : (
                        <Bot className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfilePicUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                    {profilePictureUrl && (
                      <Button variant="ghost" size="sm" onClick={() => setProfilePictureUrl(null)}>
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="mt-8 pt-6 border-t border-border">
              <Button onClick={handleSave} disabled={saving} className="gradient-accent text-accent-foreground border-0">
                {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Settings</>}
              </Button>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Preview</h3>
              <div
                className={`rounded-2xl shadow-elevated overflow-hidden border border-border ${
                  theme === "dark" ? "bg-[#1a1a2e]" : "bg-card"
                }`}
              >
                {/* Chat header */}
                <div
                  className="px-4 py-3 flex items-center gap-3"
                  style={{ background: primaryColor }}
                >
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    {profilePictureUrl ? (
                      <img src={profilePictureUrl} alt="Agent" className="w-full h-full object-cover" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="font-medium text-white text-sm truncate">{botName}</span>
                </div>

                {/* Chat body */}
                <div className="p-4 space-y-3 min-h-[280px]">
                  {/* Date */}
                  <div className="text-center">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      theme === "dark" ? "bg-white/10 text-white/60" : "bg-secondary text-muted-foreground"
                    }`}>
                      Today
                    </span>
                  </div>

                  {/* Bot greeting */}
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: primaryColor }}>
                      {profilePictureUrl ? (
                        <img src={profilePictureUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-medium ${theme === "dark" ? "text-white/70" : "text-muted-foreground"}`}>
                        {botName}
                      </span>
                      <div className={`mt-1 px-3 py-2 rounded-2xl rounded-tl-md text-sm max-w-[220px] ${
                        theme === "dark" ? "bg-white/10 text-white/90" : "bg-secondary text-foreground"
                      }`}>
                        {greeting}
                      </div>
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex justify-end">
                    <div
                      className="px-3 py-2 rounded-2xl rounded-br-md text-sm text-white max-w-[200px]"
                      style={{ background: primaryColor }}
                    >
                      I need some help!
                    </div>
                  </div>

                  {/* Bot reply */}
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: primaryColor }}>
                      {profilePictureUrl ? (
                        <img src={profilePictureUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-medium ${theme === "dark" ? "text-white/70" : "text-muted-foreground"}`}>
                        {botName}
                      </span>
                      <div className={`mt-1 px-3 py-2 rounded-2xl rounded-tl-md text-sm max-w-[220px] ${
                        theme === "dark" ? "bg-white/10 text-white/90" : "bg-secondary text-foreground"
                      }`}>
                        Of course! I'd be happy to help. What can I assist you with?
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat input preview */}
                <div className={`px-4 py-3 border-t ${
                  theme === "dark" ? "border-white/10" : "border-border"
                }`}>
                  <div className={`px-3 py-2 rounded-lg text-sm ${
                    theme === "dark" ? "bg-white/5 text-white/30" : "bg-secondary text-muted-foreground"
                  }`}>
                    Type a message...
                  </div>
                </div>
              </div>

              {/* Model & status info */}
              <div className={`mt-4 p-4 rounded-xl border border-border ${
                theme === "dark" ? "bg-[#1a1a2e]" : "bg-card"
              }`}>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-secondary flex items-center justify-center mb-2">
                    <Bot className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h4 className="font-display font-bold text-foreground text-sm">{botName}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedModel?.name}</p>
                </div>
                <div className={`mt-3 p-3 rounded-lg text-xs ${
                  theme === "dark" ? "bg-white/5" : "bg-secondary/50"
                }`}>
                  <p className="font-medium text-foreground mb-1">Instructions</p>
                  <p className="text-muted-foreground line-clamp-3">{systemPrompt}</p>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Ready to deploy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
