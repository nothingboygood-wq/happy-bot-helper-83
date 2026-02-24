import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

type Message = {
  role: "bot" | "user";
  content: string;
};

const DEMO_RESPONSES: Record<string, string> = {
  default: "Thanks for your message! I'm BotDesk's demo bot. I can help answer questions about our product, pricing, or features. What would you like to know?",
  pricing: "We offer three plans:\n\n• **Starter** — $29/mo (500 conversations)\n• **Growth** — $79/mo (5,000 conversations)\n• **Enterprise** — Custom pricing\n\nAll plans include a 14-day free trial!",
  features: "BotDesk includes:\n\n• Natural language Q&A\n• 50+ language support\n• Knowledge base integration\n• Intent analytics\n• Smart escalation to humans\n• 24/7 availability",
  hello: "Hey there! 👋 Welcome to BotDesk. I'm here to help you learn about our AI customer support chatbot. Ask me anything!",
  help: "I can help with:\n\n• Pricing information\n• Feature details\n• How to get started\n• Integration questions\n\nJust type your question!",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("pric") || lower.includes("cost") || lower.includes("plan")) return DEMO_RESPONSES.pricing;
  if (lower.includes("feature") || lower.includes("what can") || lower.includes("do you")) return DEMO_RESPONSES.features;
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) return DEMO_RESPONSES.hello;
  if (lower.includes("help")) return DEMO_RESPONSES.help;
  return DEMO_RESPONSES.default;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi! 👋 I'm BotDesk's AI assistant. Try asking me about pricing or features!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", content: getResponse(userMsg) }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-accent shadow-elevated flex items-center justify-center text-accent-foreground hover:scale-105 transition-transform"
        aria-label="Toggle chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] rounded-2xl bg-card shadow-chat border border-border flex flex-col overflow-hidden animate-chat-bubble">
          {/* Header */}
          <div className="gradient-hero px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-primary-foreground text-sm">BotDesk AI</h3>
              <p className="text-primary-foreground/60 text-xs">Always online • Demo mode</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-chat-bubble`}
              >
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-full gradient-accent flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "gradient-accent text-accent-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 animate-chat-bubble">
                <div className="w-7 h-7 rounded-full gradient-accent flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse" />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, features..."
                className="flex-1 bg-secondary text-secondary-foreground rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl gradient-accent text-accent-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
