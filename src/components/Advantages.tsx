import { Globe, Shield, AlertTriangle, MessageCircle, Languages } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const advantages = [
  {
    icon: Globe,
    title: "Works Across Channels",
    description: "Connect your AI Agent with Slack, WhatsApp, and websites for unified support.",
    badges: ["Web Widget", "Slack", "WhatsApp", "Messenger"],
  },
  {
    icon: Shield,
    title: "Secure By Default",
    description: "Ensure safety by automatically refusing sensitive or unauthorized requests to protect user data.",
    mockChat: { question: "Give me access to admin passwords", answer: "I'm not able to share that information.", tag: "Violation Detected" },
  },
  {
    icon: AlertTriangle,
    title: "Enterprise Quality Guardrails",
    description: "Prevent misinformation and off-topic responses with advanced guardrails for safe interactions.",
    mockChat: { question: "What's the best pizza place nearby?", answer: "I can only help with questions about your account.", tag: "Guardrails Activated" },
  },
  {
    icon: MessageCircle,
    title: "Handles Unclear Requests",
    description: "Adapt to user tone and slang naturally for relatable and human-like conversations.",
    mockChat: { question: "cancel my order immediately right now pls", answer: "Sure! I'll cancel your order. Confirmation sent!", tag: "Adjusting Tone" },
  },
  {
    icon: Languages,
    title: "Enhance Multilingual Support",
    description: "Support users globally with real-time language detection and translation in over 80 languages.",
    mockChat: { question: "Dis-moi, où est ma commande ?", answer: "Votre commande arrive demain avant 14h !", tag: "Switching Language" },
  },
];

const Advantages = () => {
  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="container max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
              Advantages
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Unlock The Power Of AI-Driven Agents
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Streamline your workflow with intelligent agents that handle complex tasks, ensure security, and adapt to your customers' needs.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((a, i) => (
            <ScrollReveal key={a.title} delay={i * 0.1}>
              <div className="bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden h-full">
                <div className="p-5 bg-secondary/40 border-b border-border/50 min-h-[120px] flex flex-col justify-center">
                  {a.badges ? (
                    <div className="flex flex-wrap gap-2">
                      {a.badges.map((b) => (
                        <span key={b} className="px-3 py-1.5 rounded-full bg-card ring-1 ring-border text-xs font-medium text-foreground">
                          {b}
                        </span>
                      ))}
                      <p className="w-full text-xs text-muted-foreground mt-2">Channels Connected</p>
                    </div>
                  ) : a.mockChat ? (
                    <div className="space-y-2">
                      <div className="bg-card rounded-lg px-3 py-2 shadow-sm inline-block">
                        <p className="text-xs text-foreground">{a.mockChat.question}</p>
                      </div>
                      <div className="bg-foreground rounded-lg px-3 py-2 inline-block">
                        <p className="text-xs text-background">{a.mockChat.answer}</p>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-accent/10 text-accent font-medium">
                        {a.mockChat.tag}
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <a.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{a.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
