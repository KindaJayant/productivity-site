"use client";

import { Target, ArrowUpRight, Loader2, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { submitFocus } from "../actions";
import { Message } from "@/lib/openrouter";

export default function FocusMode() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("brutal_focus_history");
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored focus history", e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("brutal_focus_history", JSON.stringify(messages));
    }
  }, [messages, mounted]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStart = async () => {
    if (!input.trim() || loading) return;
    
    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const result = await submitFocus(newMessages);
      setMessages([...newMessages, { role: "assistant", content: result }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "assistant", content: "Failed to connect to the Focus Engine. Check your API key." }]);
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
            Module 01
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main flex items-center gap-4">
            <Target className="w-10 h-10 text-neon" />
            Focus Engine
          </h1>
          <p className="text-lg text-text-muted mt-4 max-w-xl leading-relaxed">
            Brain-dump everything on your mind. We'll park the noise and secure a single clean prompt for your session.
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
            <div className="flex-1 h-full min-h-[300px] bg-dark-card rounded-3xl border border-dark-border p-8 relative overflow-hidden group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="w-full h-full bg-transparent resize-none outline-none text-text-main placeholder:text-dark-border focus:ring-0 sm:text-lg font-medium relative z-10 leading-relaxed disabled:opacity-50"
                placeholder="Example: I keep checking Twitter because I'm stuck on this Redux state bug. My goal for this session is to just isolate the state bug in a CodeSandbox and fix it."
              />
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`p-6 rounded-2xl ${msg.role === "user" ? "bg-dark-card border border-dark-border ml-12" : "bg-neon/10 border border-neon relative shadow-[0_0_30px_rgba(204,255,0,0.1)] mr-12"}`}>
                <h3 className={`font-bold text-sm uppercase tracking-widest mb-3 ${msg.role === "user" ? "text-text-muted" : "text-neon"}`}>
                  {msg.role === "user" ? "User Input" : "System Directives"}
                </h3>
                <p className="text-text-main font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            ))
          )}
        </div>
        
        <div className={`mt-auto pt-6 flex flex-col gap-4 ${messages.length > 0 ? "border-t border-dark-border" : ""}`}>
          {messages.length > 0 && (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="w-full bg-dark-card rounded-2xl border border-dark-border p-5 resize-none outline-none text-text-main placeholder:text-dark-border focus:border-neon/50 transition-colors h-24 disabled:opacity-50"
              placeholder="Refine your focus or add more context..."
            />
          )}
          
          <button 
            onClick={handleStart}
            disabled={loading || !input.trim()}
            className="flex items-center justify-between w-full sm:w-80 self-end bg-neon hover:bg-neon/90 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.15)] group"
          >
            <span>{loading ? "Processing..." : "Engage Workflow"}</span>
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
