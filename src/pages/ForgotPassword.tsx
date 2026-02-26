import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/auth" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>

        <div className="bg-card rounded-2xl shadow-elevated p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <Bot className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">BotDesk</span>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <Mail className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">Check your email</h2>
              <p className="text-muted-foreground text-sm">
                We sent a password reset link to <strong>{email}</strong>. Click the link to set a new password.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-xl font-semibold text-foreground mb-1">Forgot password?</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-accent text-accent-foreground hover:opacity-90 border-0"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
