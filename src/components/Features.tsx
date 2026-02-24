import { MessageSquare, Globe, Brain, BarChart3, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Natural Language Q&A",
    description: "Your bot understands context, slang, and complex queries — answering like a real human agent.",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Serve customers in 50+ languages automatically. No translations needed.",
  },
  {
    icon: MessageSquare,
    title: "Knowledge Base Integration",
    description: "Connect your docs, FAQs, and product pages. The bot learns your business instantly.",
  },
  {
    icon: BarChart3,
    title: "Intent Analytics",
    description: "Understand what your customers really want with AI-powered intent detection and reporting.",
  },
  {
    icon: Users,
    title: "Smart Escalation",
    description: "Complex issues get routed to the right human agent with full conversation context.",
  },
  {
    icon: Zap,
    title: "24/7 Instant Response",
    description: "Never miss a customer. Resolve 80% of queries automatically, day or night.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
            Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need to automate support
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From first contact to resolution — handle it all with AI that actually understands your customers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
