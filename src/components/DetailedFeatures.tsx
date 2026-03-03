import { RefreshCw, Settings, Brain, ArrowUpRight, BarChart3 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  {
    icon: RefreshCw,
    title: "Sync With Real-Time Data",
    description: "Connect your agent to systems like order management tools or CRMs to access data like order details or active subscriptions.",
    chatPreview: {
      question: "What's the status of my order?",
      answer: "Here's your order status:",
      detail: "Out For Delivery — Arriving Sunday",
    },
  },
  {
    icon: Settings,
    title: "Take Actions On Your Systems",
    description: "Configure actions your agent can perform, like updating a subscription or changing an address via our integrations.",
    chatPreview: {
      question: "Update my subscription to Pro",
      answer: "Done! Your plan has been updated.",
      detail: "Pro Plan — $200.00/m",
    },
  },
  {
    icon: Brain,
    title: "Compare AI Models",
    description: "Experiment with models and configurations to find the best setup for your needs.",
    chatPreview: {
      question: "Which plan is right for me?",
      answer: "Based on your usage, I'd recommend Growth.",
      detail: "GPT-4o · Gemini · Claude",
    },
  },
  {
    icon: ArrowUpRight,
    title: "Smart Escalation",
    description: "Give your agent instructions in natural language on when to escalate queries to human agents.",
    chatPreview: {
      question: "I'd like to request a refund",
      answer: "Sure, creating a ticket!",
      detail: "Ticket #2942 — Refund Request",
    },
  },
  {
    icon: BarChart3,
    title: "Advanced Reporting",
    description: "Gain insights and optimize agent performance with analytics to improve your support.",
    chatPreview: null,
  },
];

const DetailedFeatures = () => {
  return (
    <section className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
              Features
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Everything You Need For Great Support
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features to deliver exceptional customer experiences that scale with your business.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <div className="group bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden h-full">
                {feature.chatPreview && (
                  <div className="p-5 bg-secondary/30 border-b border-border/50">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-7 h-7 rounded-full bg-accent/20 shrink-0 mt-0.5" />
                      <div className="bg-card rounded-xl px-3 py-2 shadow-sm">
                        <p className="text-xs text-foreground">{feature.chatPreview.question}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-foreground rounded-xl px-3 py-2">
                        <p className="text-xs text-background">{feature.chatPreview.answer}</p>
                        <p className="text-xs text-background/60 mt-1">{feature.chatPreview.detail}</p>
                      </div>
                    </div>
                  </div>
                )}

                {!feature.chatPreview && (
                  <div className="p-5 bg-secondary/30 border-b border-border/50">
                    <div className="flex items-end gap-1 h-16 mb-2">
                      {[35, 55, 42, 68, 50, 72, 85, 60, 78, 90].map((h, j) => (
                        <div key={j} className="flex-1 rounded-sm bg-accent/60" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm font-bold text-foreground">512</p>
                        <p className="text-xs text-muted-foreground">Resolved</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">98%</p>
                        <p className="text-xs text-muted-foreground">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedFeatures;
