import { MessageSquare, Link2, Zap } from "lucide-react";

const highlights = [
  {
    icon: MessageSquare,
    title: "Unified Inbox",
    description: "Manage all customer chats in one unified interface designed for speed.",
    badges: ["WhatsApp", "Messenger", "Instagram", "Telegram", "Slack", "Gmail"],
  },
  {
    icon: Link2,
    title: "Powerful Integrations",
    description: "Connect your favorite tools to automate complex workflows instantly.",
    badges: ["Calendar", "Stripe", "Gmail", "Sheets", "Shopify", "HubSpot", "Notion", "Slack", "Airtable"],
  },
  {
    icon: Zap,
    title: "AI-Powered Automation",
    description: "Deploy intelligent agents to automate complex queries 24/7 instantly.",
    badges: ["OpenAI", "Anthropic", "Google", "DeepSeek"],
  },
];

const Highlights = () => {
  return (
    <section className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
            Highlights
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Built For Modern Support Teams
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Combine powerful AI with human expertise to deliver exceptional customer experiences that scale with your business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((h) => (
            <div key={h.title} className="bg-card rounded-2xl shadow-card p-8 hover:shadow-elevated transition-all duration-300">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-5">
                <h.icon className="w-6 h-6 text-accent-foreground" />
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {h.badges.map((badge) => (
                  <span key={badge} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                    {badge}
                  </span>
                ))}
              </div>

              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{h.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{h.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
