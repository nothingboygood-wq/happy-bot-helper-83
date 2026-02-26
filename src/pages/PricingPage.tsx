import { Link } from "react-router-dom";
import { Bot } from "lucide-react";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
        <div className="container max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">BotDesk</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/terms">
              <Button variant="ghost" size="sm">Terms</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gradient-accent text-accent-foreground border-0 hover:opacity-90">Start Free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Pricing />
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
