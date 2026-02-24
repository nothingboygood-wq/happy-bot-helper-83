import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! 👋 I'm BotDesk's AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveConversation = async (userMsg: string, aiMsg: string) => {
    if (!user) return;
    try {
      let convoId = conversationId;
      if (!convoId) {
        const { data } = await supabase
          .from("conversations")
          .insert({ user_id: user.id, visitor_name: "Website Visitor", status: "active" })
          .select("id")
          .single();
        if (data) {
          convoId = data.id;
          setConversationId(convoId);
        }
      }
      if (convoId) {
        await supabase.from("messages").insert([
          { conversation_id: convoId, role: "user", content: userMsg },
          { conversation_id: convoId, role: "assistant", content: aiMsg },
        ]);
      }
    } catch (e) {
      console.error("Failed to save conversation:", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.content === userMsg) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Save to DB if user is logged in
      if (assistantContent) {
        saveConversation(userMsg, assistantContent);
      }
    } catch (e) {
      console.error("Chat error:", e);
      const errorMsg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      assistantContent = errorMsg;
      setMessages((prev) => [...prev, { role: "assistant", content: `Sorry, ${errorMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-accent shadow-elevated flex items-center justify-center text-accent-foreground hover:scale-105 transition-transform"
        aria-label="Toggle chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] rounded-2xl bg-card shadow-chat border border-border flex flex-col overflow-hidden animate-chat-bubble">
          <div className="gradient-hero px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-primary-foreground text-sm">BotDesk AI</h3>
              <p className="text-primary-foreground/60 text-xs">Always online • Powered by AI</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-chat-bubble`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full gradient-accent flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "gradient-accent text-accent-foreground rounded-br-md"
                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                }`}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
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

          <div className="px-4 py-3 border-t border-border">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-secondary text-secondary-foreground rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
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
