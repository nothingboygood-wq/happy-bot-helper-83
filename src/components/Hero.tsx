import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Zap, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background grid + gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(220_14%_96%)_1px,transparent_1px),linear-gradient(to_bottom,hsl(220_14%_96%)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />

      <div className="container max-w-6xl mx-auto relative">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.08] mb-6 tracking-tight">
            The AI Agent Platform For{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-[hsl(30,90%,55%)]">
              Customer Experience
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Build, deploy, and scale intelligent AI agents across every support channel to automate customer service and reduce costs instantly.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/auth">
              <Button
                size="lg"
                className="gradient-accent text-accent-foreground hover:opacity-90 border-0 px-8 text-base font-medium"
              >
                Try it Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="px-8 text-base font-medium"
              onClick={() => window.open("mailto:support@botdesk.co?subject=Demo%20Request", "_blank")}
            >
              Get a Demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-5">
            Free to start · No credit card · Setup in 5 min
          </p>
        </div>

        {/* Three preview cards */}
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {/* Unified Inbox */}
          <div className="bg-card rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">Unified Inbox</h3>
            <p className="text-xs text-muted-foreground mb-4">All sources, one view</p>

            <div className="space-y-2.5">
              {[
                { name: "WhatsApp", msg: "I need help with my order...", time: "2m", color: "bg-green-500" },
                { name: "Messenger", msg: "Can I change my subscription?", time: "5m", color: "bg-blue-500" },
                { name: "Instagram", msg: "Do you ship internationally?", time: "8m", color: "bg-pink-500" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                  <div className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.msg}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Automation */}
          <div className="bg-card rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">AI Automation</h3>
            <p className="text-xs text-muted-foreground mb-4">Resolution scoring, automated</p>

            <div className="space-y-3">
              {[
                { label: "Order Tracking", score: 96, w: "w-[96%]", color: "bg-green-500" },
                { label: "Subscription Changes", score: 89, w: "w-[89%]", color: "bg-blue-500" },
                { label: "Product Questions", score: 82, w: "w-[82%]", color: "bg-violet-500" },
                { label: "Shipping Inquiries", score: 78, w: "w-[78%]", color: "bg-amber-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">{item.score}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full">
                    <div className={`h-full rounded-full ${item.color} ${item.w}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Insights */}
          <div className="bg-card rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">Live Insights</h3>
            <p className="text-xs text-muted-foreground mb-4">Real-time analytics</p>

            {/* Mini bar chart */}
            <div className="flex items-end gap-1.5 h-20 mb-4">
              {[40, 65, 50, 80, 60, 75, 90, 55, 70, 85, 60, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-accent/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="flex gap-6">
              <div>
                <p className="font-display text-xl font-bold text-foreground">3,429</p>
                <p className="text-xs text-muted-foreground">Requests</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold text-foreground">12.8k</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
