"use client";

import { useState, useRef, useEffect } from "react";
import { IconSendPurple } from "@/components/ui/Icons";

interface SourceDocument {
  question_id: string;
  subject: string;
  topic: string;
  year: number;
  difficulty: string;
  snippet: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: SourceDocument[];
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your NIMCET AI Study Buddy. Ask me anything about MCA entrance exam topics — Mathematics, Computer Awareness, or English. I'll find relevant questions and explain concepts step by step!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-assistant/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.error || "Sorry, something went wrong. Please try again.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
            sources: data.sources,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Unable to connect to the AI assistant. Make sure the RAG server is running locally.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 lg:sticky lg:top-24 h-[60vh] sm:h-[65vh] lg:h-[70vh] flex flex-col">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-slate-900 dark:text-slate-100">
        AI Study Buddy
      </h2>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2 no-scrollbar">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-lg max-w-[85%] sm:max-w-[75%] ${
                msg.role === "user"
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-tr-none"
                  : "bg-purple-600 text-white rounded-tl-none"
              }`}
            >
              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
              {/* Source references */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-purple-400/30">
                  <p className="text-[10px] sm:text-xs font-semibold opacity-80 mb-1">
                    Sources:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {msg.sources.map((src, j) => (
                      <span
                        key={j}
                        className="inline-block text-[10px] bg-purple-500/30 px-1.5 py-0.5 rounded"
                        title={src.snippet}
                      >
                        {src.question_id} ({src.year}) • {src.topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-purple-600 text-white p-3 rounded-lg rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700"
      >
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about NIMCET topics..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-2.5 sm:py-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white rounded-full transition-colors disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <IconSendPurple className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
