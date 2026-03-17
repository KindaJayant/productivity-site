"use client";

import { NotebookPen, ArrowUpRight, Loader2, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { submitJournal } from "../actions";
import { Message } from "@/lib/openrouter";

export default function JournalMode() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleJournal = async () => {
    if (!input.trim() || loading) return;
    
    // We display the user's message immediately
    const userMsg: Message = { role: "user", content: input };
    const newMessages: Message[] = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const result = await submitJournal(newMessages);
      // The AI only speaks if it didn't return "."
      if (result && result.trim() !== ".") {
        setMessages([...newMessages, { role: "assistant", content: result }]);
      }
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "assistant", content: "Failed to connect to the Journal AI. Check your API key." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-16 min-h-[calc(100vh-theme(spacing.16))] flex flex-col relative z-10">
      
      <header className="mb-12 flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-dark-card border border-dark-border text-text-muted text-xs font-bold tracking-widest uppercase rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon"></span>
            Module 04
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main flex items-center gap-4">
            <NotebookPen className="w-10 h-10 text-neon" />
            Silent Journal
          </h1>
          <p className="text-lg text-text-muted mt-4 max-w-xl leading-relaxed">
            Free-write anything. The agent only speaks when it detects a pattern or contradiction. Otherwise, it stays silent.
          </p>
        </div>
        
        {messages.length > 0 && (
          <button onClick={handleReset} className="flex items-center gap-2 text-text-muted hover:text-white text-sm font-bold uppercase tracking-widest transition-colors pb-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        )}
      </header>

      <div className="flex-1 flex flex-col min-h-0 relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6 scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="flex-1 h-full min-h-[300px] flex flex-col bg-dark-card rounded-3xl border border-dark-border p-8 relative overflow-hidden group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="w-full flex-1 bg-transparent resize-none outline-none text-text-main placeholder:text-dark-border focus:ring-0 font-medium sm:text-lg leading-relaxed relative z-10 disabled:opacity-50"
                placeholder="Write your thoughts, frustrations, or ideas here..."
              />
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`p-6 rounded-2xl \${msg.role === "user" ? "bg-dark-card border border-dark-border ml-12" : "bg-neon/10 border border-neon relative shadow-[0_0_30px_rgba(204,255,0,0.1)] mr-12"}`}>
                <h3 className={`font-bold text-sm uppercase tracking-widest mb-3 \${msg.role === "user" ? "text-text-muted" : "text-neon"}`}>
                  {msg.role === "user" ? "Journal Entry" : "Observer Output"}
                </h3>
                <p className="text-text-main font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            ))
          )}
        </div>
        
        <div className={`mt-auto pt-6 flex flex-col gap-4 \${messages.length > 0 ? "border-t border-dark-border" : ""}`}>
          {messages.length > 0 && (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="w-full bg-dark-card rounded-2xl border border-dark-border p-5 resize-none outline-none text-text-main placeholder:text-dark-border focus:border-neon/50 transition-colors h-24 font-medium disabled:opacity-50"
              placeholder="Continue writing..."
            />
          )}
          
          <button 
            onClick={handleJournal}
            disabled={loading || !input.trim()}
            className="flex items-center justify-between w-full sm:w-80 self-end bg-neon hover:bg-neon/90 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.15)] group"
          >
            <span>{loading ? "Writing..." : "Commit Entry"}</span>
            <div className="p-1.5 rounded-full bg-black">
              {loading ? (
                <Loader2 className="h-5 w-5 text-neon animate-spin" />
              ) : (
                <ArrowUpRight className="h-5 w-5 text-neon group-hover:rotate-45 transition-transform" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
