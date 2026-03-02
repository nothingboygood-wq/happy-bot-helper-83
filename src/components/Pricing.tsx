import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePaddle, PADDLE_PRICES } from "@/hooks/usePaddle";

const monthlyPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    priceId: PADDLE_PRICES.starter,
    description: "For small businesses getting started with AI support.",
    features: [
      "1 website integration",
      "500 conversations/mo",
      "Basic Q&A bot",
      "Email escalation",
      "Standard support",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Growth",
    price: "$79",
    period: "/mo",
    priceId: PADDLE_PRICES.growth,
    description: "For growing teams that need advanced capabilities.",
    features: [
      "5 website integrations",
      "5,000 conversations/mo",
      "Advanced NLP & context tracking",
      "Multi-language (20 languages)",
      "Live chat escalation",
      "Intent analytics dashboard",
      "Priority support",
    ],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    name: "High End",
    price: "$120",
    period: "/mo",
    priceId: PADDLE_PRICES.highEnd,
    description: "For large-scale operations with premium capabilities.",
    features: [
      "Unlimited integrations",
      "Unlimited conversations",
      "Custom AI training",
      "50+ languages",
      "API access & webhooks",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
];

const yearlyPlans = monthlyPlans.map((plan) => ({
  ...plan,
  price: plan.name === "Starter" ? "$23" : plan.name === "Growth" ? "$63" : "$96",
  period: "/mo",
}));

const Pricing = () => {
  const { user } = useAuth();
  const { openCheckout } = usePaddle();
  const navigate = useNavigate();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const plans = billing === "monthly" ? monthlyPlans : yearlyPlans;

  const handlePlanClick = (plan: typeof monthlyPlans[0]) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    openCheckout(plan.priceId, user.email ?? undefined);
  };

  return (
    <section id="pricing" className="py-28 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-medium text-sm tracking-wider uppercase mb-3">
            Pricing
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight">
            Plans that scale with you
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Start with a free trial. Upgrade when you're ready. No hidden fees, cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-medium ${billing === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <button
              onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
              className={`relative w-14 h-7 rounded-full transition-colors ${billing === "yearly" ? "bg-accent" : "bg-border"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${billing === "yearly" ? "translate-x-7" : ""}`} />
            </button>
            <span className={`text-sm font-medium ${billing === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
              <span className="ml-1.5 text-xs text-accent font-semibold">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl transition-all duration-300 ${
                plan.popular
                  ? "bg-foreground text-background ring-1 ring-foreground shadow-elevated -mt-2 pb-2"
                  : "bg-card ring-1 ring-border hover:ring-muted-foreground/30 shadow-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-7">
                <h3
                  className={`font-display text-lg font-semibold mb-1 ${
                    plan.popular ? "text-background" : "text-foreground"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-6 ${
                    plan.popular ? "text-background/60" : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mb-8">
                  <span
                    className={`text-4xl font-display font-bold tracking-tight ${
                      plan.popular ? "text-background" : "text-foreground"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-base ml-1 ${
                      plan.popular ? "text-background/50" : "text-muted-foreground"
                    }`}
                  >
                    {plan.period}
                  </span>
                  {billing === "yearly" && (
                    <span className={`block text-xs mt-1 ${plan.popular ? "text-background/40" : "text-muted-foreground/60"}`}>
                      billed annually
                    </span>
                  )}
                </div>

                <Button
                  className={`w-full font-medium group ${
                    plan.popular
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                  size="lg"
                  onClick={() => handlePlanClick(plan)}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                </Button>

                <div
                  className={`my-7 h-px ${
                    plan.popular ? "bg-background/10" : "bg-border"
                  }`}
                />

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.popular
                            ? "bg-accent/20 text-accent"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span
                        className={`text-sm ${
                          plan.popular ? "text-background/80" : "text-muted-foreground"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Enterprise */}
          <div className="rounded-2xl bg-card ring-1 ring-border hover:ring-muted-foreground/30 shadow-card">
            <div className="p-7">
              <h3 className="font-display text-lg font-semibold mb-1 text-foreground">Enterprise</h3>
              <p className="text-sm mb-6 text-muted-foreground">
                Custom solutions for large organizations.
              </p>

              <div className="mb-8">
                <span className="text-4xl font-display font-bold tracking-tight text-foreground">Custom</span>
              </div>

              <Button
                className="w-full font-medium group bg-foreground text-background hover:bg-foreground/90"
                size="lg"
                onClick={() => window.open("mailto:support@botdesk.co?subject=Enterprise%20Plan%20Inquiry", "_blank")}
              >
                Contact Sales
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Button>

              <div className="my-7 h-px bg-border" />

              <ul className="space-y-3">
                {[
                  "Everything in High End",
                  "Custom integrations",
                  "SSO & SAML",
                  "Custom data retention",
                  "White-label option",
                  "Dedicated infrastructure",
                  "24/7 premium support",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-accent/10 text-accent">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
