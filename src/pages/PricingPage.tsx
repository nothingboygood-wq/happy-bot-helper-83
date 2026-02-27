import { Link } from "react-router-dom";
import { Bot, ArrowLeft } from "lucide-react";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">BotDesk</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/terms">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Terms
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/90 border-0"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Pricing />

        {/* FAQ-like trust section */}
        <section className="py-20 px-6 bg-secondary/30">
          <div className="container max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl font-bold text-foreground mb-3">
              No contracts. No surprises.
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              All plans include a 2-day free trial. Cancel anytime from your dashboard.
              Your data stays yours — we never share or sell it.
            </p>
            <Link to="/">
              <Button variant="outline" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
                Back to home
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
