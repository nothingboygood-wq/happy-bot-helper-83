import { Shield, Lock, Key, Server } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const securityItems = [
  {
    icon: Shield,
    title: "Your Data Stays Yours",
    description: "Your data is only accessible to your AI agent and is never used to train our models.",
    badge: "GDPR Compliant",
  },
  {
    icon: Lock,
    title: "Data Encryption",
    description: "All data is encrypted at rest and in transit. Bank-level AES-256 encryption.",
    badge: "AES-256",
  },
  {
    icon: Key,
    title: "Secure Integrations",
    description: "We use verified variables to ensure users access only their own data in your systems.",
    badge: "OAuth 2.0",
  },
  {
    icon: Server,
    title: "SOC 2 Infrastructure",
    description: "Hosted on enterprise-grade infrastructure with 99.99% uptime SLA.",
    badge: "SOC 2 Type II",
  },
];

const Security = () => {
  return (
    <section className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
              Security
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Enterprise-Grade Security & Privacy
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              BotDesk is fully secure, trusted by businesses worldwide to build private AI agents.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityItems.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <div className="bg-card rounded-2xl shadow-card p-7 hover:shadow-elevated transition-all duration-300 text-center h-full">
                <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-accent-foreground" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground mb-4">
                  {item.badge}
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
