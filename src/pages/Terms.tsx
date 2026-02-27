import { Link } from "react-router-dom";
import { Bot, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const termsSections = [
  {
    title: "Service Overview",
    body: "BotDesk provides AI-powered customer support tools, including chat automation, analytics, and integration capabilities. Access to certain features depends on your selected subscription plan.",
  },
  {
    title: "Account Responsibilities",
    body: "You are responsible for maintaining the security of your account, credentials, and connected systems. You must provide accurate registration and billing information and keep it up to date.",
  },
  {
    title: "Acceptable Use",
    body: "You agree not to use the service for unlawful, harmful, deceptive, or abusive activities, including sending spam, violating data protection laws, or attempting to disrupt the platform.",
  },
  {
    title: "Billing & Renewals",
    body: "Paid subscriptions renew automatically unless canceled before the next billing cycle. Trial periods, payment methods, and invoicing terms are presented during checkout and in your billing settings. Payments are processed securely through Paddle, our merchant of record.",
  },
  {
    title: "Data & Privacy",
    body: "You retain ownership of your content and customer data. By using BotDesk, you grant us limited rights to process this data solely to provide and improve the service, subject to applicable privacy laws.",
  },
  {
    title: "Termination",
    body: "We may suspend or terminate access for violations of these terms, fraud, or security risks. You may cancel at any time; access to paid features remains active until the end of your paid term unless stated otherwise.",
  },
  {
    title: "Contact",
    body: "For legal or billing questions, contact support through your dashboard or your official support email channel.",
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">BotDesk</span>
          </Link>
          <Link to="/pricing">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Pricing
            </Button>
          </Link>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-6 py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-14">
          Last updated — January 1, 2026
        </p>

        <div className="space-y-12">
          {termsSections.map((section, i) => (
            <section key={section.title} className="group">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-xs font-mono text-accent/60 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {section.title}
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-10">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
