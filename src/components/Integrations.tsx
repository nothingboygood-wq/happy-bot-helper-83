import { MessageSquare, ShoppingBag, BarChart3, Mail, Hash, FileText, CreditCard, Database } from "lucide-react";

const integrations = [
  { name: "WhatsApp", icon: MessageSquare, color: "text-green-500" },
  { name: "Messenger", icon: MessageSquare, color: "text-blue-500" },
  { name: "Instagram", icon: Hash, color: "text-pink-500" },
  { name: "Slack", icon: Hash, color: "text-purple-500" },
  { name: "Shopify", icon: ShoppingBag, color: "text-green-600" },
  { name: "HubSpot", icon: BarChart3, color: "text-orange-500" },
  { name: "Stripe", icon: CreditCard, color: "text-violet-500" },
  { name: "Notion", icon: FileText, color: "text-foreground" },
];

const Integrations = () => {
  return (
    <section className="py-12 px-6 border-y border-border/50">
      <div className="container max-w-6xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Integrates with the tools you already use
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {integrations.map((item) => (
            <div key={item.name} className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
