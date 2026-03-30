"use client";

import { Target, ArrowUpRight, Loader2, RotateCcw, Plus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { submitFocus } from "../actions";
import { Message } from "@/lib/openrouter";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export type Session = {
  id: string;
  title: string;
  date: string;
  messages: Message[];
};

export default function FocusMode() {
  // 5-Slot Sessions via Convex
  const sessions = useQuery(api.memory.getSessions, { type: "focus" }) || [];
  const createSessionMut = useMutation(api.memory.createSession);
  const deleteSessionMut = useMutation(api.memory.deleteSession);
  const updateMessagesMut = useMutation(api.memory.updateMessages);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages]);

  const handleCreateSession = async () => {
    if (sessions.length >= 5) return;
    
    const title = `Workflow ${sessions.length + 1}`;
    const date = new Date().toISOString();
    
    const newId = await createSessionMut({
      title,
      type: "focus",
      date
    });
    // @ts-expect-error
    setActiveSessionId(newId as string);
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // @ts-expect-error
    await deleteSessionMut({ id: id as any });
    if (activeSessionId === id && sessions.length > 0) {
      const nextSession = sessions.find(s => s.id !== id);
      setActiveSessionId(nextSession ? nextSession.id : null);
    }
  };

  const handleStart = async () => {
    if (!input.trim() || loading || !activeSessionId) return;
    
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...(activeSession?.messages || []), userMsg];
    
    // @ts-expect-error
    await updateMessagesMut({ id: activeSessionId as any, messages: newMessages });
    setInput("");
    setLoading(true);

    try {
      const result = await submitFocus(newMessages);
      
      if (result.error) {
        // @ts-expect-error
        await updateMessagesMut({ id: activeSessionId as any, messages: [...newMessages, { role: "assistant", content: `⚠️ [SYSTEM FAILURE]: ${result.error}` }] });
      } else {
        // @ts-expect-error
        await updateMessagesMut({ id: activeSessionId as any, messages: [...newMessages, { role: "assistant", content: result.content || "Empty response from agent." }] });
      }
    } catch (error) {
      console.error("Focus mode exception:", error);
      // @ts-expect-error
      await updateMessagesMut({ id: activeSessionId as any, messages: [...newMessages, { role: "assistant", content: "⚠️ [FATAL]: Failed to connect to the Focus Engine." }] });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!activeSessionId) return;
    // @ts-expect-error
    await updateMessagesMut({ id: activeSessionId as any, messages: [] });
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
              Module 01
            </div>
            <span suppressHydrationWarning className="text-xs text-neon font-mono uppercase tracking-widest bg-neon/10 px-3 py-1 rounded-full border border-neon/20">
              {new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main flex items-center gap-4">
            <Target className="w-10 h-10 text-neon" />
            Focus Engine
          </h1>
          <p className="text-lg text-text-muted mt-4 max-w-xl leading-relaxed">
            Brain-dump everything on your mind. We&apos;ll park the noise and secure a single clean prompt for your session.
          </p>
        </div>
      </header>

      {/* Tabs UI for 5-Slot Memory */}
      <div className="mb-8 flex flex-wrap gap-2 items-center">
        {sessions.map((s, idx) => (
          <div 
            key={s.id}
            onClick={() => setActiveSessionId(s.id)}
            className={`group cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-bold tracking-wide ${
              activeSessionId === s.id 
                ? "bg-neon border-neon text-black shadow-[0_0_15px_rgba(204,255,0,0.2)]" 
                : "bg-dark-card border-dark-border text-text-muted hover:border-neon/50 hover:text-text-main"
            }`}
          >
            WorkFlow 0{sessions.length - idx}
            <button 
              onClick={(e) => handleDeleteSession(s.id, e)}
              className={`p-0.5 rounded-md opacity-50 hover:opacity-100 transition-opacity ${
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
              <Target className="w-12 h-12 text-dark-border mx-auto mb-4" />
              <p className="text-text-muted font-medium">No active workflows.</p>
              <button 
                onClick={handleCreateSession}
                className="mt-4 text-neon font-bold text-sm hover:underline"
              >
                Create your first Workflow
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-dark-border font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse"></div> Active Sequence
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
                    className="w-full h-full bg-transparent resize-none outline-none text-text-main placeholder:text-dark-border focus:ring-0 sm:text-lg font-medium relative z-10 leading-relaxed disabled:opacity-50"
                    placeholder="Example: I keep checking Twitter because I'm stuck on this Redux state bug. My goal for this session is to just isolate the state bug in a CodeSandbox and fix it."
                  />
                </div>
              ) : (
                activeSession.messages.map((msg, i) => (
                  <div key={i} className={`p-6 rounded-2xl ${msg.role === "user" ? "bg-dark-card border border-dark-border ml-12" : "bg-neon/10 border border-neon relative shadow-[0_0_30px_rgba(204,255,0,0.1)] mr-12"}`}>
                    <h3 className={`font-bold text-sm uppercase tracking-widest mb-3 ${msg.role === "user" ? "text-text-muted" : "text-neon"}`}>
                      {msg.role === "user" ? "User Input" : "System Directives"}
                    </h3>
                    <p className="text-text-main font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                ))
              )}
            </div>
            
            <div className={`mt-auto pt-6 flex flex-col gap-4 ${activeSession.messages.length > 0 ? "border-t border-dark-border" : ""}`}>
              {activeSession.messages.length > 0 && (
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
          </>
        )}
      </div>
    </div>
  );
}
