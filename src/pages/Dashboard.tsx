import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Bot,
  MessageSquare,
  BarChart3,
  LogOut,
  Clock,
  TrendingUp,
  Users,
  Star,
  Eye,
  Code,
  Copy,
  Check,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";

type Conversation = {
  id: string;
  visitor_name: string;
  visitor_email: string | null;
  status: string;
  satisfaction_rating: number | null;
  created_at: string;
  updated_at: string;
};

type Message = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"conversations" | "analytics" | "widget">("conversations");
  const [copied, setCopied] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [subLoading, setSubLoading] = useState(true);

  const widgetSnippet = user ? `<script src="${import.meta.env.VITE_SUPABASE_URL}/functions/v1/widget?uid=${user.id}"></script>` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchSub = async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setSubscription(data);
      setSubLoading(false);
      if (!data || data.status !== "active") {
        navigate("/activate");
      }
    };
    fetchSub();
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .order("created_at", { ascending: false });
      setConversations((data as Conversation[]) || []);
      setLoading(false);
    };
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!selectedConvo) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConvo)
        .order("created_at", { ascending: true });
      setMessages((data as Message[]) || []);
    };
    fetchMessages();
  }, [selectedConvo]);

  const isTrialExpired = subscription?.plan === "trial" && subscription?.trial_ends_at && new Date(subscription.trial_ends_at) < new Date();

  if (authLoading || loading || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-soft text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const totalConvos = conversations.length;
  const activeConvos = conversations.filter((c) => c.status === "active").length;
  const avgRating =
    conversations.filter((c) => c.satisfaction_rating).length > 0
      ? (
          conversations
            .filter((c) => c.satisfaction_rating)
            .reduce((sum, c) => sum + (c.satisfaction_rating || 0), 0) /
          conversations.filter((c) => c.satisfaction_rating).length
        ).toFixed(1)
      : "N/A";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">BotDesk</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={() => navigate("/settings")}>
            <Settings className="w-4 h-4 mr-2" /> Settings
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-6 py-8">
        {isTrialExpired && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Your trial has expired</p>
              <p className="text-xs text-muted-foreground">Your chatbot widget is currently disabled. Upgrade to continue using BotDesk.</p>
            </div>
          </div>
        )}
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: MessageSquare, label: "Total Conversations", value: totalConvos, color: "text-accent" },
            { icon: Users, label: "Active Now", value: activeConvos, color: "text-green-500" },
            { icon: Star, label: "Avg Rating", value: avgRating, color: "text-yellow-500" },
            { icon: TrendingUp, label: "Resolution Rate", value: totalConvos > 0 ? `${Math.round((conversations.filter(c => c.status === 'closed').length / totalConvos) * 100)}%` : "N/A", color: "text-blue-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <span className="font-display text-3xl font-bold text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === "conversations" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("conversations")}
            className={tab === "conversations" ? "gradient-accent text-accent-foreground border-0" : ""}
          >
            <MessageSquare className="w-4 h-4 mr-2" /> Conversations
          </Button>
          <Button
            variant={tab === "analytics" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("analytics")}
            className={tab === "analytics" ? "gradient-accent text-accent-foreground border-0" : ""}
          >
            <BarChart3 className="w-4 h-4 mr-2" /> Analytics
          </Button>
          <Button
            variant={tab === "widget" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("widget")}
            className={tab === "widget" ? "gradient-accent text-accent-foreground border-0" : ""}
          >
            <Code className="w-4 h-4 mr-2" /> Widget
          </Button>
        </div>

        {tab === "conversations" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Conversation list */}
            <div className="lg:col-span-1 bg-card rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-semibold text-foreground">Recent Chats</h3>
              </div>
              <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No conversations yet. Chat with visitors will appear here.
                  </div>
                ) : (
                  conversations.map((convo) => (
                    <button
                      key={convo.id}
                      onClick={() => setSelectedConvo(convo.id)}
                      className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors ${
                        selectedConvo === convo.id ? "bg-secondary" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-foreground">{convo.visitor_name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          convo.status === "active" ? "bg-green-100 text-green-700" :
                          convo.status === "escalated" ? "bg-yellow-100 text-yellow-700" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {convo.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {format(new Date(convo.created_at), "MMM d, h:mm a")}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Message view */}
            <div className="lg:col-span-2 bg-card rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-semibold text-foreground">
                  {selectedConvo ? "Conversation" : "Select a conversation"}
                </h3>
              </div>
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {!selectedConvo ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Eye className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm">Select a conversation to view messages</p>
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No messages in this conversation.</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.role === "user"
                          ? "gradient-accent text-accent-foreground rounded-br-md"
                          : "bg-secondary text-secondary-foreground rounded-bl-md"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="bg-card rounded-xl shadow-card p-8">
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">Analytics Overview</h3>
            {conversations.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Analytics will appear once you have conversations.</p>
                <p className="text-sm mt-2">Your chatbot will start collecting data automatically.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-secondary/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Conversations This Week</p>
                  <p className="font-display text-4xl font-bold text-foreground">
                    {conversations.filter(c => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(c.created_at) > weekAgo;
                    }).length}
                  </p>
                </div>
                <div className="p-6 bg-secondary/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Escalated Issues</p>
                  <p className="font-display text-4xl font-bold text-foreground">
                    {conversations.filter(c => c.status === 'escalated').length}
                  </p>
                </div>
                <div className="p-6 bg-secondary/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Resolved</p>
                  <p className="font-display text-4xl font-bold text-foreground">
                    {conversations.filter(c => c.status === 'closed').length}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "widget" && (
          <div className="bg-card rounded-xl shadow-card p-8 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
                <Code className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">Embed Your Chatbot</h3>
                <p className="text-sm text-muted-foreground">Add this script to any website to enable your AI chatbot</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Your embed code</label>
                <div className="relative">
                  <pre className="bg-secondary rounded-xl p-4 pr-14 text-sm text-secondary-foreground overflow-x-auto whitespace-pre-wrap break-all font-mono">
                    {widgetSnippet}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h4 className="font-display font-semibold text-foreground mb-3">How to install</h4>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full gradient-accent text-accent-foreground flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <span>Copy the embed code above</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full gradient-accent text-accent-foreground flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    <span>Paste it before the closing <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag of your website</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full gradient-accent text-accent-foreground flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    <span>The chatbot will appear as a floating button on your site. All conversations will show up in your dashboard.</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
