import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Sparkles, Bot } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hello! 👋 I'm Azhar Engineering (Pvt.) Ltd Assistant, your AI guide for Azhar Engineering (Pvt.) Ltd. Ask me about our services, projects, CEO, equipment, or how to get a quote!";

const QUICK_QUESTIONS = [
  "Who is the CEO of Azhar Engineering?",
  "What services do you provide?",
  "Can you tell me about your recent projects?",
  "How can I get a quote?",
  "How can I contact the company?",
  "What equipment does the company own?",
];

async function askAi(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }
  const data = (await res.json()) as { reply?: string };
  return data.reply ?? "";
}

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasConversation = messages.length > 1;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pending, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    const history = messages.filter((m) => m.role !== "assistant" || m.content !== GREETING);
    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...history, userMessage];
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPending(true);

    try {
      const reply = await askAi(nextMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {/* Floating bubble (hidden while the panel is open) */}
      {!open && (
        <div
          className="fixed z-[60] bottom-4 right-4 md:bottom-5 md:right-5 flex items-center gap-2.5"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] tracking-[0.15em] uppercase font-semibold border shadow-lg shadow-black/40 transition-colors duration-300 ${
              hovered
                ? "text-white bg-[hsl(220,18%,9%)]/95 border-[hsl(38,72%,52%)]"
                : "text-[hsl(220,12%,75%)] bg-[hsl(220,18%,9%)]/95 border-[hsl(220,15%,22%)]"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                hovered ? "bg-[hsl(38,72%,52%)]" : "bg-emerald-500 animate-pulse"
              }`}
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={hovered ? "ask" : "available"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {hovered ? "Ask me Anything" : "Available"}
              </motion.span>
            </AnimatePresence>
          </span>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open AI assistant"
            className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-[hsl(38,72%,52%)] hover:bg-[hsl(38,72%,60%)] text-[hsl(220,18%,9%)] flex items-center justify-center shadow-xl shadow-[hsl(38,72%,52%/0.3)] transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[hsl(38,72%,70%)] focus:ring-offset-2 focus:ring-offset-[hsl(220,18%,9%)]"
          >
            <Sparkles size={20} className="relative" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[hsl(220,18%,9%)]" />
          </button>
        </div>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
            className="fixed z-[60] inset-x-0 bottom-0 h-[min(68dvh,540px)] md:inset-x-auto md:right-5 md:bottom-24 md:h-[460px] md:w-[340px] flex flex-col overflow-hidden bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,20%)] rounded-t-2xl md:rounded-lg shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[hsl(220,15%,20%)] bg-[hsl(220,18%,11%)]">
              <div className="w-9 h-9 rounded-full bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] flex items-center justify-center shrink-0">
                <Bot size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif font-bold text-white text-sm uppercase tracking-tight leading-none">
                  Azhar Assistant
                </p>
                <p className="text-[10px] text-[hsl(220,12%,55%)] mt-1 tracking-wide truncate">
                  Azhar Engineering (Pvt.) Ltd
                </p>
              </div>
              <span className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close AI assistant"
                className="p-2 text-[hsl(220,12%,60%)] hover:text-white transition-colors focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-2.5">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-3 py-2 text-[13px] leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] rounded-lg rounded-br-sm"
                        : "bg-[hsl(220,18%,14%)] border border-[hsl(220,15%,22%)] text-neutral-200 rounded-lg rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {pending && (
                <div className="flex justify-start">
                  <div className="bg-[hsl(220,18%,14%)] border border-[hsl(220,15%,22%)] rounded-lg rounded-bl-sm px-4 py-3 flex gap-1.5">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.18 }}
                        className="w-1.5 h-1.5 rounded-full bg-[hsl(38,72%,58%)]"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick questions */}
            {!hasConversation && (
              <div className="shrink-0 px-3.5 pb-2.5">
                <p className="text-[9px] tracking-[0.2em] uppercase text-[hsl(220,12%,50%)] mb-1.5">
                  Try asking:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={pending}
                      onClick={() => send(q)}
                      className="text-[10px] text-[hsl(38,72%,65%)] border border-[hsl(220,15%,24%)] bg-[hsl(220,18%,12%)] hover:border-[hsl(38,72%,52%)] hover:text-[hsl(38,72%,52%)] transition-colors px-2.5 py-1 rounded-full"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="shrink-0 border-t border-[hsl(220,15%,20%)] bg-[hsl(220,18%,11%)] p-2.5 flex gap-2 pb-[calc(0.625rem+env(safe-area-inset-bottom))]"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Azhar Engineering..."
                aria-label="Message the AI assistant"
                className="flex-1 min-w-0 bg-[hsl(220,18%,14%)] border border-[hsl(220,15%,22%)] rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-[hsl(220,12%,40%)] focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors"
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                aria-label="Send message"
                className="shrink-0 w-9 h-9 rounded-lg bg-[hsl(38,72%,52%)] hover:bg-[hsl(38,72%,60%)] text-[hsl(220,18%,9%)] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
