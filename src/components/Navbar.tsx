import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">BotDesk</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Docs</a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard">
              <Button size="sm" className="gradient-accent text-accent-foreground hover:opacity-90 border-0">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground">Log in</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="gradient-accent text-accent-foreground hover:opacity-90 border-0">
                  Start Free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
