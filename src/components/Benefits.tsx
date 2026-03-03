import { User, Zap, ArrowUpRight, Eye } from "lucide-react";

const benefits = [
  {
    icon: User,
    title: "Personalized Answers",
    description: "Your agent knows the logged-in user and can retrieve their information to provide tailored responses instantly.",
  },
  {
    icon: Zap,
    title: "Instant Actions",
    description: "Empower your agent to perform actions like refunds, upgrades, or scheduling directly within the chat.",
  },
  {
    icon: ArrowUpRight,
    title: "Smart Escalations",
    description: "The agent recognizes when a human touch is needed and seamlessly hands off the conversation with full context.",
  },
  {
    icon: Eye,
    title: "Full Observability",
    description: "Track every interaction, analyze sentiment, and gain insights to improve your customer experience continuously.",
  },
];

const Benefits = () => {
  return (
    <section className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
            Benefits
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Works Like Your Best Support Agent
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            BotDesk integrates seamlessly with your existing tools and workflows, delivering a human-like experience that delights customers.
          </p>
        </div>

        {/* Chat mockup + benefits grid */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Chat mockup */}
          <div className="bg-card rounded-2xl shadow-elevated p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 shrink-0 flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-secondary rounded-xl px-4 py-3">
                  <p className="text-sm text-foreground">Why is my bill higher this month?</p>
                </div>
              </div>

              <div className="flex items-start gap-3 justify-end">
                <div className="bg-foreground rounded-xl px-4 py-3 max-w-xs">
                  <p className="text-sm text-background">
                    Hi Sarah! I checked your account. Your bill increased because you upgraded to the Pro plan on March 1st. Here's the breakdown:
                  </p>
                  <div className="mt-2 p-2 rounded-lg bg-background/10">
                    <p className="text-xs text-background/80">Basic: $29 → Pro: $79</p>
                    <p className="text-xs text-background/60">Prorated charge applied</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 shrink-0 flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-secondary rounded-xl px-4 py-3">
                  <p className="text-sm text-foreground">Can I get a refund?</p>
                </div>
              </div>

              <div className="flex items-start gap-3 justify-end">
                <div className="bg-foreground rounded-xl px-4 py-3 max-w-xs">
                  <p className="text-sm text-background">
                    Let me connect you with our billing team for that. I'm creating a ticket now.
                  </p>
                  <div className="mt-2 px-3 py-1.5 rounded-lg bg-accent/20 inline-block">
                    <p className="text-xs text-accent font-medium">🎫 Ticket #3201 created</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits list */}
          <div className="space-y-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
