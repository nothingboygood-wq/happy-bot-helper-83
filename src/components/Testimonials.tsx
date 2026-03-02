import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "BotDesk transformed our support. We automated 80% of queries and our customer satisfaction score jumped from 3.2 to 4.8 in just two months.",
    name: "Sarah Chen",
    role: "Head of Support, TechFlow",
    avatar: "SC",
  },
  {
    quote: "Setting up our AI agent was incredibly simple. No coding needed, live in under one hour. The knowledge base feature explains our complex products perfectly.",
    name: "Marcus Johnson",
    role: "CTO, DataBridge",
    avatar: "MJ",
  },
  {
    quote: "Our chatbot handles questions it knows, delegates to our team when it's stuck, and knows how to push clients through the funnel. 10/10 recommend.",
    name: "Elena Rodriguez",
    role: "CEO, ClickScale",
    avatar: "ER",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Loved By Support Teams
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Join thousands of satisfied companies automating support and growing faster.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-2xl shadow-card p-7 hover:shadow-elevated transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6 text-sm">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-accent-foreground text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="bg-foreground rounded-2xl p-10 max-w-3xl mx-auto">
            <p className="text-xs text-background/40 uppercase tracking-widest font-medium mb-3">Free 7-Day Trial · No Credit Card Required</p>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-background mb-4 tracking-tight">
              Stop Drowning In Tickets. Start Resolving Them Instantly.
            </h3>
            <p className="text-background/60 mb-6 max-w-lg mx-auto text-sm">
              Join 200+ companies using BotDesk to automate 80% of customer questions while keeping a human touch.
            </p>
            <a href="/auth">
              <button className="gradient-accent text-accent-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Start for Free
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
