import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-illustration.png";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(16_85%_60%_/_0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(222_60%_18%_/_0.04),transparent_50%)]" />

      <div className="container max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6">
              <span className="w-2 h-2 rounded-full gradient-accent animate-pulse-soft" />
              Now with GPT-powered conversations
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6">
              Customer support that{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-[hsl(30,90%,55%)]">
                never sleeps
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Deploy an AI chatbot that handles 80% of your support queries instantly.
              Multi-language, context-aware, and always learning from your knowledge base.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="gradient-accent text-accent-foreground hover:opacity-90 border-0 px-8 text-base font-medium"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 text-base font-medium"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold text-foreground">2k+</span>
                <span>Businesses</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold text-foreground">10M+</span>
                <span>Conversations</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold text-foreground">4.9★</span>
                <span>Rating</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="animate-float">
              <img
                src={heroImage}
                alt="AI chatbot assistant illustration with floating chat bubbles"
                className="w-full max-w-lg rounded-3xl shadow-elevated"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
