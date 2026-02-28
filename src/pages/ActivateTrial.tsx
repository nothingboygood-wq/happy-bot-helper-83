import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, Check, Sparkles, LogOut, ArrowRight } from "lucide-react";
import { usePaddle, PADDLE_PRICES } from "@/hooks/usePaddle";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    priceId: PADDLE_PRICES.starter,
    features: ["1 website integration", "500 conversations/mo", "Basic Q&A bot", "Email escalation"],
  },
  {
    name: "Growth",
    price: "$79",
    period: "/mo",
    priceId: PADDLE_PRICES.growth,
    popular: true,
    features: ["5 integrations", "5,000 conversations/mo", "Advanced NLP", "Multi-language", "Live chat escalation"],
  },
  {
    name: "High End",
    price: "$120",
    period: "/mo",
    priceId: PADDLE_PRICES.highEnd,
    features: ["Unlimited integrations", "Unlimited conversations", "Custom AI training", "Dedicated manager"],
  },
];

const ActivateTrial = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [checkingRole, setCheckingRole] = useState(true);
  const { openCheckout } = usePaddle();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const check = async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const isAdmin = roles?.some((r: any) => r.role === "admin") ?? false;

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (isAdmin && !sub) {
        await supabase.from("subscriptions").insert({
          user_id: user.id,
          status: "active",
          plan: "admin",
          activated_at: new Date().toISOString(),
        });
        navigate("/dashboard");
        return;
      }

      if (sub?.status === "active") {
        navigate("/dashboard");
        return;
      }

      setCheckingRole(false);
    };
    check();
  }, [user, navigate]);

  if (authLoading || checkingRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-4">
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
          <LogOut className="w-4 h-4 mr-2" /> Sign out
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center pb-12">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Choose Your Plan</h1>
            <p className="text-muted-foreground mt-2">Pick a plan to activate your BotDesk AI chatbot</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl transition-all duration-300 ${
                  plan.popular
                    ? "bg-foreground text-background ring-1 ring-foreground shadow-elevated"
                    : "bg-card ring-1 ring-border shadow-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h3 className={`font-display text-lg font-semibold mb-1 ${plan.popular ? "text-background" : "text-foreground"}`}>
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className={`text-4xl font-display font-bold ${plan.popular ? "text-background" : "text-foreground"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ml-1 ${plan.popular ? "text-background/50" : "text-muted-foreground"}`}>
                      {plan.period}
                    </span>
                  </div>

                  <Button
                    className={`w-full group mb-5 ${
                      plan.popular
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                    onClick={() => openCheckout(plan.priceId, user?.email ?? undefined)}
                  >
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </Button>

                  <ul className="space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.popular ? "bg-accent/20 text-accent" : "bg-accent/10 text-accent"
                        }`}>
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className={`text-sm ${plan.popular ? "text-background/80" : "text-muted-foreground"}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span>Secure checkout powered by Paddle. Cancel anytime.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateTrial;
