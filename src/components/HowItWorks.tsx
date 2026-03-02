import { Upload, Settings, Code, Link2, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Import Your Data",
    description: "Upload files or crawl your site to train your agent instantly. It learns from your data to answer right.",
  },
  {
    icon: Settings,
    title: "Customize Behavior",
    description: "Modify prompts and tone to match your brand. Make your agent speak like your best support rep.",
  },
  {
    icon: Code,
    title: "Embed On Your Site",
    description: "Add the chat widget to your site with a simple snippet. Go live in minutes and automate support.",
  },
  {
    icon: Link2,
    title: "Connect Integrations",
    description: "Enable actions like scheduling meetings or updating your CRM. Automate workflows and save time.",
  },
  {
    icon: BarChart3,
    title: "Analyze & Improve",
    description: "Track metrics and improve your agent via user interactions. Optimize performance and results.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
            How It Works
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            An End-To-End Solution For AI
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Build, customize, and deploy AI agents that actually resolve customer issues and automate your entire support workflow.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-6 mb-8 last:mb-0">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center shrink-0">
                  <step.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>

              {/* Content */}
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-accent">{i + 1}</span>
                  <h3 className="font-display text-xl font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
