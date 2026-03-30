"use client";

import { NotebookPen, ArrowUpRight, Loader2, RotateCcw, Plus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { submitJournal } from "../actions";
import { Message } from "@/lib/openrouter";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export type JournalSession = {
  id: string;
  date: string;
  messages: Message[];
  sentiment: "positive" | "negative" | "neutral" | "mixed" | null;
};

const SENTIMENT_STYLES: Record<string, { label: string; className: string }> = {
  positive: { label: "Positive", className: "text-neon bg-neon/10 border-neon/30" },
  negative: { label: "Negative", className: "text-red-400 bg-red-500/10 border-red-500/30" },
  neutral: { label: "Neutral", className: "text-text-muted bg-dark-border/20 border-dark-border" },
  mixed: { label: "Mixed", className: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
};

export default function JournalMode() {
  // 5-Slot Sessions via Convex
  const sessionsRaw = useQuery(api.memory.getSessions, { type: "journal" }) || [];
  const sessions = sessionsRaw as unknown as JournalSession[];
  
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
    const title = `Pattern 0${sessions.length + 1}`;
    const date = new Date().toISOString();
    
    const newId = await createSessionMut({
      title,
      type: "journal",
      date
    });
    setActiveSessionId(newId as string);
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteSessionMut({ id: id as any });
    if (activeSessionId === id && sessions.length > 0) {
      const nextSession = sessions.find(s => s.id !== id);
      setActiveSessionId(nextSession ? nextSession.id : null);
    }
  };

  const handleJournal = async () => {
    if (!input.trim() || loading || !activeSessionId) return;

    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...(activeSession?.messages || []), userMsg];

    await updateMessagesMut({ id: activeSessionId as any, messages: newMessages });
    setInput("");
    setLoading(true);

    try {
      const result = await submitJournal(newMessages);
      
      if (result.error) {
        await updateMessagesMut({ 
          id: activeSessionId as any, 
          messages: [...newMessages, { role: "assistant", content: `⚠️ [SYSTEM FAILURE]: ${result.error}` }],
          sentiment: result.sentiment as any
        });
      } else {
        const updatedMessages = result.note
          ? [...newMessages, { role: "assistant" as const, content: result.note }]
          : newMessages;
          
        await updateMessagesMut({ id: activeSessionId as any, messages: updatedMessages, sentiment: result.sentiment as any });
      }
    } catch (error) {
      console.error("Journal mode exception:", error);
      await updateMessagesMut({ id: activeSessionId as any, messages: [...newMessages, { role: "assistant", content: "⚠️ [FATAL]: Failed to connect to Journal AI." }] });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!activeSessionId) return;
    await updateMessagesMut({ id: activeSessionId as any, messages: [], sentiment: null as any });
    setInput("");
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-16 min-h-[calc(100vh-theme(spacing.16))] flex flex-col relative z-10">
      
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-dark-card border border-dark-border text-text-muted text-xs font-bold tracking-widest uppercase rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-neon"></span>
              Module 04
            </div>
            <span suppressHydrationWarning className="text-xs text-neon font-mono uppercase tracking-widest bg-neon/10 px-3 py-1 rounded-full border border-neon/20">
              {new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main flex items-center gap-4">
            <NotebookPen className="w-10 h-10 text-neon" />
            Silent Journal
          </h1>
          <p className="text-lg text-text-muted mt-4 max-w-xl leading-relaxed">
            Free-write anything. The agent only speaks when it detects a pattern. It always reads your sentiment.
          </p>
        </div>
      </header>

      {/* 5-Slot Pattern Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 items-center">
        {sessions.map((s, idx) => {
          const sentiment = s.sentiment ? SENTIMENT_STYLES[s.sentiment] : null;
          return (
            <div
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`group cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-bold tracking-wide ${
                activeSessionId === s.id 
                  ? "bg-neon border-neon text-black shadow-[0_0_15px_rgba(204,255,0,0.2)]" 
                  : "bg-dark-card border-dark-border text-text-muted hover:border-neon/50 hover:text-text-main"
              }`}
            >
              <span>Pattern 0{sessions.length - idx}</span>
              <span className="text-[10px] font-mono opacity-70">{formatDate(s.date)}</span>
              {sentiment && s.id !== activeSessionId && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold uppercase ${sentiment.className}`}>
                  {sentiment.label}
                </span>
              )}
              <button
                onClick={(e) => handleDeleteSession(s.id, e)}
                className={`p-0.5 rounded-md opacity-50 hover:opacity-100 transition-opacity ${
                  activeSessionId === s.id ? "hover:bg-black/20" : "hover:bg-dark-bg"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {sessions.length < 5 ? (
          <button
            onClick={handleCreateSession}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold tracking-widest uppercase text-neon border border-neon/30 bg-neon/5 hover:bg-neon/10 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        ) : (
          <div className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-red-500 border border-red-500/20 bg-red-500/5 rounded-lg">
            Storage Full (5/5)
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        {!activeSession ? (
          <div className="flex-1 flex items-center justify-center border border-dashed border-dark-border rounded-3xl bg-dark-card/50">
            <div className="text-center">
              <NotebookPen className="w-12 h-12 text-dark-border mx-auto mb-4" />
              <p className="text-text-muted font-medium">No active journal patterns.</p>
              <button onClick={handleCreateSession} className="mt-4 text-neon font-bold text-sm hover:underline">
                Start writing
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Active session header with sentiment + reset */}
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse"></div>
                {activeSession.sentiment && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${SENTIMENT_STYLES[activeSession.sentiment]?.className}`}>
                    {SENTIMENT_STYLES[activeSession.sentiment]?.label} sentiment
                  </span>
                )}
              </div>
              {activeSession.messages.length > 0 && (
                <button onClick={handleReset} className="flex items-center gap-2 text-text-muted hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6 scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent">
              {activeSession.messages.length === 0 ? (
                <div className="flex-1 h-full min-h-[300px] flex flex-col bg-dark-card rounded-3xl border border-dark-border p-8 relative overflow-hidden">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="w-full flex-1 bg-transparent resize-none outline-none text-text-main placeholder:text-dark-border focus:ring-0 font-medium sm:text-lg leading-relaxed relative z-10 disabled:opacity-50"
                    placeholder="Write your thoughts, frustrations, or ideas here..."
                  />
                </div>
              ) : (
                activeSession.messages.map((msg, i) => (
                  <div key={i} className={`p-6 rounded-2xl ${msg.role === "user" ? "bg-dark-card border border-dark-border ml-12" : "bg-neon/10 border border-neon relative shadow-[0_0_30px_rgba(204,255,0,0.1)] mr-12"}`}>
                    <h3 className={`font-bold text-sm uppercase tracking-widest mb-3 ${msg.role === "user" ? "text-text-muted" : "text-neon"}`}>
                      {msg.role === "user" ? "Journal Entry" : "Observer Noticed"}
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
                  className="w-full bg-dark-card rounded-2xl border border-dark-border p-5 resize-none outline-none text-text-main placeholder:text-dark-border focus:border-neon/50 transition-colors h-24 font-medium disabled:opacity-50"
                  placeholder="Continue writing..."
                />
              )}
              <button
                onClick={handleJournal}
                disabled={loading || !input.trim()}
                className="flex items-center justify-between w-full sm:w-80 self-end bg-neon hover:bg-neon/90 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.15)] group"
              >
                <span>{loading ? "Processing..." : "Commit Entry"}</span>
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
