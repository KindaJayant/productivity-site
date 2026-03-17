"use client";

import { MessageSquare, ArrowUpRight, Loader2, RotateCcw, Plus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { submitRubberDuck } from "../actions";
import { Message } from "@/lib/openrouter";
import { v4 as uuidv4 } from "uuid";

export type Session = {
  id: string;
  title: string;
  date: string;
  messages: Message[];
};

export default function RubberDuckMode() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("brutal_rd_sessions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse stored RD sessions", e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("brutal_rd_sessions", JSON.stringify(sessions));
    }
  }, [sessions, mounted]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages]);

  const handleCreateSession = () => {
    if (sessions.length >= 5) return;
    
    const newSession: Session = {
      id: uuidv4(),
      title: `Architecture ${sessions.length + 1}`,
      date: new Date().toISOString(),
      messages: []
    };
    
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (activeSessionId === id) {
      setActiveSessionId(newSessions.length > 0 ? newSessions[0].id : null);
    }
  };

  const handleRoast = async () => {
    if (!input.trim() || loading || !activeSessionId) return;
    
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...(activeSession?.messages || []), userMsg];
    
    // Optimistic UI update
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId ? { ...s, messages: newMessages } : s
    ));
    setInput("");
    setLoading(true);

    try {
      const result = await submitRubberDuck(newMessages);
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, messages: [...newMessages, { role: "assistant", content: result }] } : s
      ));
    } catch (error) {
      console.error(error);
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, messages: [...newMessages, { role: "assistant", content: "Failed to connect to Rubber Duck AI." }] } : s
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!activeSessionId) return;
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId ? { ...s, messages: [] } : s
    ));
    setInput("");
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-16 min-h-[calc(100vh-theme(spacing.16))] flex flex-col relative z-10">
      
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-dark-card border border-dark-border text-text-muted text-xs font-bold tracking-widest uppercase rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-neon"></span>
              Module 02
            </div>
            <span suppressHydrationWarning className="text-xs text-neon font-mono uppercase tracking-widest bg-neon/10 px-3 py-1 rounded-full border border-neon/20">
              {new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main flex items-center gap-4">
            <MessageSquare className="w-10 h-10 text-neon" />
            Rubber Duck
          </h1>
          <p className="text-lg text-text-muted mt-4 max-w-xl leading-relaxed">
            Paste your current approach or architecture. We'll expose the overengineering and find the simpler path.
          </p>
        </div>
      </header>

      {/* Tabs UI for 5-Slot Memory */}
      <div className="mb-8 flex flex-wrap gap-2 items-center">
        {sessions.map((s, idx) => (
          <div 
            key={s.id}
            onClick={() => setActiveSessionId(s.id)}
            className={`group cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-bold tracking-wide \${
              activeSessionId === s.id 
                ? "bg-neon border-neon text-black shadow-[0_0_15px_rgba(204,255,0,0.2)]" 
                : "bg-dark-card border-dark-border text-text-muted hover:border-neon/50 hover:text-text-main"
            }`}
          >
            Architecture 0{sessions.length - idx}
            <button 
              onClick={(e) => handleDeleteSession(s.id, e)}
              className={`p-0.5 rounded-md opacity-50 hover:opacity-100 transition-opacity \${
                activeSessionId === s.id ? "hover:bg-black/20" : "hover:bg-dark-bg"
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        
        {sessions.length < 5 ? (
          <button 
            onClick={handleCreateSession}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold tracking-widest uppercase text-neon border border-neon/30 bg-neon/5 hover:bg-neon/10 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        ) : (
          <div className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-red-500 border border-red-500/20 bg-red-500/5 rounded-lg flex items-center gap-2">
            Storage Full (5/5)
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        {!activeSession ? (
          <div className="flex-1 flex items-center justify-center border border-dashed border-dark-border rounded-3xl bg-dark-card/50">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-dark-border mx-auto mb-4" />
              <p className="text-text-muted font-medium">No active architectures.</p>
              <button 
                onClick={handleCreateSession}
                className="mt-4 text-neon font-bold text-sm hover:underline"
              >
                Create your first Architecture
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-dark-border font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse"></div> terminal_sequence
              </span>
              {activeSession.messages.length > 0 && (
                <button onClick={handleReset} className="flex items-center gap-2 text-text-muted hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6 scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent">
              {activeSession.messages.length === 0 ? (
                <div className="flex-1 h-full min-h-[300px] flex flex-col bg-dark-card rounded-3xl border border-dark-border p-8 relative overflow-hidden group">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="w-full flex-1 bg-transparent resize-none outline-none text-text-main placeholder:text-dark-border focus:ring-0 font-mono text-sm leading-relaxed relative z-10 disabled:opacity-50"
                    placeholder={`> const user = await db.user.findUnique({
>   where: { id: userId },
>   include: { posts: true }
> })
> 
> // I feel like this query is getting too slow when 
> // the user has thousands of posts. Should I paginate 
> // here or just use a separate endpoint entirely?`}
                  />
                </div>
              ) : (
                activeSession.messages.map((msg, i) => (
                  <div key={i} className={`p-6 rounded-2xl \${msg.role === "user" ? "bg-dark-card border border-dark-border ml-12" : "bg-neon/10 border border-neon relative shadow-[0_0_30px_rgba(204,255,0,0.1)] mr-12"}`}>
                    <h3 className={`font-bold text-sm uppercase tracking-widest mb-3 \${msg.role === "user" ? "text-text-muted" : "text-neon"}`}>
                      {msg.role === "user" ? "User Input" : "Duck Output"}
                    </h3>
                    <p className="text-text-main font-mono text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                ))
              )}
            </div>
            
            <div className={`mt-auto pt-6 flex flex-col gap-4 \${activeSession.messages.length > 0 ? "border-t border-dark-border" : ""}`}>
              {activeSession.messages.length > 0 && (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="w-full bg-dark-card rounded-2xl border border-dark-border p-5 resize-none outline-none text-text-main placeholder:text-dark-border focus:border-neon/50 transition-colors h-24 font-mono text-sm disabled:opacity-50"
                  placeholder="> Reply to the duck..."
                />
              )}
              
              <button 
                onClick={handleRoast}
                disabled={loading || !input.trim()}
                className="flex items-center justify-between w-full sm:w-80 self-end bg-neon hover:bg-neon/90 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.15)] group"
              >
                <span>{loading ? "Analyzing..." : "Roast Architecture"}</span>
                <div className="p-1.5 rounded-full bg-black">
                  {loading ? (
                    <Loader2 className="h-5 w-5 text-neon animate-spin" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-neon group-hover:rotate-45 transition-transform" />
                  )}
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
