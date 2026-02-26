import { Link } from "react-router-dom";
import { Bot } from "lucide-react";
import Footer from "@/components/Footer";

const termsSections = [
  {
    title: "1. Service overview",
    body: "BotDesk provides AI-powered customer support tools, including chat automation, analytics, and integration capabilities. Access to certain features depends on your selected subscription plan.",
  },
  {
    title: "2. Account responsibilities",
    body: "You are responsible for maintaining the security of your account, credentials, and connected systems. You must provide accurate registration and billing information and keep it up to date.",
  },
  {
    title: "3. Acceptable use",
    body: "You agree not to use the service for unlawful, harmful, deceptive, or abusive activities, including sending spam, violating data protection laws, or attempting to disrupt the platform.",
  },
  {
    title: "4. Billing and renewals",
    body: "Paid subscriptions renew automatically unless canceled before the next billing cycle. Trial periods, payment methods, and invoicing terms are presented during checkout and in your billing settings.",
  },
  {
    title: "5. Data and privacy",
    body: "You retain ownership of your content and customer data. By using BotDesk, you grant us limited rights to process this data solely to provide and improve the service, subject to applicable privacy laws.",
  },
  {
    title: "6. Termination",
    body: "We may suspend or terminate access for violations of these terms, fraud, or security risks. You may cancel at any time; access to paid features remains active until the end of your paid term unless stated otherwise.",
  },
  {
    title: "7. Contact",
    body: "For legal or billing questions, contact support through your dashboard or your official support email channel.",
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
        <div className="container max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">BotDesk</span>
          </Link>
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View pricing
          </Link>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Effective date: January 1, 2026</p>

        <div className="space-y-8">
          {termsSections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
