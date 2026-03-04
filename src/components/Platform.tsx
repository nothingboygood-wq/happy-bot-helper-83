import { useState } from "react";
import { Play, Activity, Database, MessageSquare, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const tabs = [
  {
    id: "playground",
    label: "Playground",
    icon: Play,
    title: "Test & Refine",
    description: "Fine-tune your agent's responses and behavior in real-time. Test changes safely before deploying to customers.",
  },
  {
    id: "activity",
    label: "Activity",
    icon: Activity,
    title: "Monitor Activity",
    description: "Track all conversations and agent interactions in real-time. See how your agent handles every query.",
  },
  {
    id: "sources",
    label: "Sources",
    icon: Database,
    title: "Manage Sources",
    description: "Upload documents, crawl websites, and manage all the data your agent learns from in one place.",
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
    title: "Live Chat",
    description: "View and manage all customer conversations. Jump in when your agent needs a human touch.",
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: Users,
    title: "Customer Contacts",
    description: "See all your customers in one place with their conversation history and interaction data.",
  },
];

const Platform = () => {
  const [activeTab, setActiveTab] = useState("playground");
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="container max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
              Platform
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Support Your Customers With AI
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Manage conversations, track performance, and gain insights — all in one place.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-foreground text-background shadow-elevated"
                    : "bg-card text-muted-foreground hover:text-foreground ring-1 ring-border"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="bg-card rounded-2xl shadow-elevated overflow-hidden max-w-4xl mx-auto">
            <div className="border-b border-border/50 px-6 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-accent/50" />
              <div className="w-3 h-3 rounded-full bg-accent/30" />
              <span className="ml-4 text-xs text-muted-foreground">nexadesk.co/dashboard/{active.id}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-12 text-center min-h-[300px] flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mb-6">
                  <active.icon className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">{active.title}</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed">{active.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Platform;
