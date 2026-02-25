import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, CreditCard, Shield, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

const ActivateTrial = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [activating, setActivating] = useState(false);

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
      const admin = roles?.some((r: any) => r.role === "admin") ?? false;
      setIsAdmin(admin);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setSubscription(sub);

      // Auto-activate admin
      if (admin && !sub) {
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

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleActivate = async () => {
    if (!user) return;
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 16) {
      toast.error("Please enter a valid card number");
      return;
    }
    if (expiry.length < 5) {
      toast.error("Please enter a valid expiry date");
      return;
    }
    if (cvc.length < 3) {
      toast.error("Please enter a valid CVC");
      return;
    }

    setActivating(true);
    const trialEnds = new Date();
    trialEnds.setDate(trialEnds.getDate() + 2);

    if (subscription) {
      await supabase
        .from("subscriptions")
        .update({
          status: "active",
          plan: "trial",
          trial_ends_at: trialEnds.toISOString(),
          card_last_four: digits.slice(-4),
          card_brand: "visa",
          activated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    } else {
      await supabase.from("subscriptions").insert({
        user_id: user.id,
        status: "active",
        plan: "trial",
        trial_ends_at: trialEnds.toISOString(),
        card_last_four: digits.slice(-4),
        card_brand: "visa",
        activated_at: new Date().toISOString(),
      });
    }

    // Also create default widget settings
    const { data: existingSettings } = await supabase
      .from("widget_settings")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existingSettings) {
      await supabase.from("widget_settings").insert({ user_id: user.id });
    }

    toast.success("Trial activated! You have 2 days of free access.");
    navigate("/dashboard");
  };

  if (authLoading || checkingRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Activate Your Free Trial</h1>
          <p className="text-muted-foreground mt-2">Get 2 days of unlimited access to BotDesk AI</p>
        </div>

        <div className="bg-card rounded-xl shadow-card p-6 space-y-5">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <Sparkles className="w-5 h-5 text-accent shrink-0" />
            <p className="text-sm text-foreground">
              <strong>2-day free trial</strong> — full access to all features. Credit card required for activation.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Expiry</label>
              <Input
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">CVC</label>
              <Input
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
              />
            </div>
          </div>

          <Button
            className="w-full gradient-accent text-accent-foreground border-0"
            onClick={handleActivate}
            disabled={activating}
          >
            {activating ? "Activating..." : "Start Free Trial"}
          </Button>

          <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Your card info is stored securely. Cancel anytime.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateTrial;
