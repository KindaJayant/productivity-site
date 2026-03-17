"use client";

import { ShieldCheck, ArrowUpRight, Loader2, RotateCcw, Plus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { submitAccountability } from "../actions";
import { Message } from "@/lib/openrouter";
import { logActivity } from "@/components/StreakWidget";
import { v4 as uuidv4 } from "uuid";

// Mock habit struct array for demonstration of the GitHub style contribution grid
const HABITS = [
  { id: "gym", label: "Gym" },
  { id: "nofap", label: "NoFap" },
  { id: "read", label: "Read" },
];

type DailyRecord = {
  date: string;
  gym: boolean | null;
  nofap: boolean | null;
  read: boolean | null;
};

export type Session = {
  id: string;
  title: string;
  date: string;
  messages: Message[];
};

// Generate the last 14 days scaffolding
const generateLast14Days = (): DailyRecord[] => {
  return Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toDateString(),
    gym: null,
    nofap: null,
    read: null,
  }));
};

export default function AccountabilityMode() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 5-Slot Sessions
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Habits tracking
  const [todaysHabits, setTodaysHabits] = useState<Record<string, boolean | null>>({
    gym: null,
    nofap: null,
    read: null,
  });
  const [history, setHistory] = useState<DailyRecord[]>([]);

  useEffect(() => {
    // Load history from local storage
    const stored = localStorage.getItem('brutal_habits');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const baseline = generateLast14Days();
        
        // Merge stored data into our 14 day window
        const merged = baseline.map(day => {
          const found = parsed.find((p: DailyRecord) => p.date === day.date);
          return found || day;
        });
        
        setHistory(merged);
        
        // Load today's specific toggles if they exist
        const today = new Date().toDateString();
        const todaysRecord = merged.find((r: DailyRecord) => r.date === today);
        if (todaysRecord) {
          setTodaysHabits({
            gym: todaysRecord.gym || false,
            nofap: todaysRecord.nofap || false,
            read: todaysRecord.read || false,
          });
        }
      } catch (e) {
        setHistory(generateLast14Days());
      }
    } else {
      setHistory(generateLast14Days());
    }

    // Load sessions from local storage
    const storedSessions = localStorage.getItem('brutal_acc_sessions');
    if (storedSessions) {
      try {
        const parsed = JSON.parse(storedSessions);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse acc sessions", e);
      }
    }
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("brutal_acc_sessions", JSON.stringify(sessions));
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
      title: `Entry 0${sessions.length + 1}`,
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

  const handleSubmit = async () => {
    if (!input.trim() || loading || !activeSessionId) return;
    
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...(activeSession?.messages || []), userMsg];
    
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId ? { ...s, messages: newMessages } : s
    ));
    setInput("");
    setLoading(true);

    try {
      // Build context string from the habit toggles if it's the first message
      const context = (activeSession?.messages.length || 0) === 0 
        ? `Habits Tracking Status:\nGym: ${todaysHabits.gym === true ? "Completed" : todaysHabits.gym === false ? "Failed" : "Pending"}\nNoFap: ${todaysHabits.nofap === true ? "Completed" : todaysHabits.nofap === false ? "Failed" : "Pending"}\nRead: ${todaysHabits.read === true ? "Completed" : todaysHabits.read === false ? "Failed" : "Pending"}`
        : undefined;

      const result = await submitAccountability(newMessages, context);
      
      // Log the streak once the action completes successfully
      logActivity();
      
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, messages: [...newMessages, { role: "assistant", content: result }] } : s
      ));
    } catch (error) {
      console.error(error);
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, messages: [...newMessages, { role: "assistant", content: "Failed to connect to Accountability Agent. Check your API key." }] } : s
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

  const setHabit = (id: string, value: boolean) => {
    setTodaysHabits(prev => {
      const updated = { ...prev, [id]: value };
      
      setHistory(prevHistory => {
        const todayStr = new Date().toDateString();
        const newHistory = prevHistory.map(day => {
          if (day.date === todayStr) {
            return { ...day, [id]: updated[id] };
          }
          return day;
        });
        localStorage.setItem('brutal_habits', JSON.stringify(newHistory));
        return newHistory;
      });
      
      return updated;
    });
  };

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto p-8 lg:p-16 min-h-[calc(100vh-theme(spacing.16))] flex flex-col relative z-10">
      
      <header className="mb-12 flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-dark-card border border-dark-border text-text-muted text-xs font-bold tracking-widest uppercase rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon"></span>
            Module 03
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main flex items-center gap-4">
            <ShieldCheck className="w-10 h-10 text-neon" />
            Accountability
          </h1>
          <p className="text-lg text-text-muted mt-4 max-w-xl leading-relaxed">
            Record your reps. Dump your daily execution. Face the reality of your actions.
          </p>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        
        {/* Left Col: Habit Tracker Grid */}
        <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent h-full pb-8">
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-l-2 border-neon pl-2">
              <h3 className="text-text-muted font-bold text-xs uppercase tracking-widest">
                Daily Reps
              </h3>
              <span suppressHydrationWarning className="text-[10px] text-neon font-mono uppercase tracking-widest bg-neon/10 px-2 py-0.5 rounded-full border border-neon/20 w-fit">
                {new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            <div className="flex flex-col gap-6">
              {HABITS.map((habit) => {
                const isDoneToday = todaysHabits[habit.id];

                return (
                  <div key={habit.id} className="group">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-text-main font-bold text-sm tracking-wide flex-1">{habit.label}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setHabit(habit.id, true)}
                          className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-colors border \${
                            isDoneToday === true
                              ? "bg-neon border-neon text-black shadow-[0_0_10px_rgba(204,255,0,0.5)]" 
                              : "bg-transparent border-dark-border text-text-muted hover:text-neon hover:border-neon"
                          }`}
                        >
                          Done
                        </button>
                        <button 
                          onClick={() => setHabit(habit.id, false)}
                          className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-colors border \${
                            isDoneToday === false
                              ? "bg-red-500 border-red-500 text-black shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                              : "bg-transparent border-dark-border text-text-muted hover:text-red-500 hover:border-red-500"
                          }`}
                        >
                          Missed
                        </button>
                      </div>
                    </div>
                    
                    {/* Activity Grid */}
                    <div className="flex gap-1 pt-2">
                      {history.slice(0, 13).map((day, i) => {
                        const status = day[habit.id as keyof DailyRecord];
                        let bgColor = "bg-dark-bg border border-dark-border/50"; // null / not recorded
                        if (status === true) bgColor = "bg-neon/60 group-hover:bg-neon/80";
                        if (status === false) bgColor = "bg-red-500/40 group-hover:bg-red-500/60";
                        const dayNum = new Date(day.date).getDate();

                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                            <span className="text-[9px] font-mono text-dark-border leading-none">{dayNum}</span>
                            <div 
                              title={new Date(day.date).toLocaleDateString()}
                              className={`w-full aspect-square rounded-[2px] transition-colors \${bgColor}`}
                            ></div>
                          </div>
                        );
                      })}
                      
                      {/* Today's square tied to state */}
                      <div className="flex-1 flex flex-col items-center gap-1.5">
                        <span suppressHydrationWarning className="text-[9px] font-mono text-neon font-bold leading-none">{new Date().getDate()}</span>
                        <div 
                          title="Today"
                          className={`w-full aspect-square rounded-[2px] transition-all \${
                            isDoneToday === true 
                              ? "bg-neon shadow-[0_0_5px_rgba(204,255,0,0.5)]" 
                              : isDoneToday === false 
                                ? "bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.3)]"
                                : "bg-dark-border animate-pulse"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Accountability Chat */}
        <div className="lg:col-span-2 flex flex-col min-h-[500px] relative">
          
          {/* Tabs UI for 5-Slot Memory */}
          <div className="mb-6 flex flex-wrap gap-2 items-center">
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
                Entry 0{sessions.length - idx}
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

          {!activeSession ? (
            <div className="flex-1 flex items-center justify-center border border-dashed border-dark-border rounded-3xl bg-dark-card/50">
              <div className="text-center">
                <ShieldCheck className="w-12 h-12 text-dark-border mx-auto mb-4" />
                <p className="text-text-muted font-medium">No active entries.</p>
                <button 
                  onClick={handleCreateSession}
                  className="mt-4 text-neon font-bold text-sm hover:underline"
                >
                  Create your first Entry
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-end items-center mb-4 px-2 tracking-widest text-xs uppercase text-dark-border font-bold">
                {activeSession.messages.length > 0 && (
                  <button onClick={handleReset} className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Log
                  </button>
                )}
              </div>
              
              <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6 scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent">
                {activeSession.messages.length === 0 ? (
                  <div className="flex-1 h-full min-h-[300px] bg-dark-card rounded-3xl border border-dark-border p-8 relative overflow-hidden group">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={loading}
                      className="w-full h-full bg-transparent resize-none outline-none text-text-main placeholder:text-dark-border focus:ring-0 sm:text-lg font-medium relative z-10 leading-relaxed disabled:opacity-50"
                      placeholder="Dump everything here. What did you execute? Where did you fail? No excuses."
                    />
                  </div>
                ) : (
                  activeSession.messages.map((msg, i) => (
                    <div key={i} className={`p-6 rounded-2xl \${msg.role === "user" ? "bg-dark-card border border-dark-border ml-12" : "bg-neon/10 border border-neon relative shadow-[0_0_30px_rgba(204,255,0,0.1)] mr-12"}`}>
                      <h3 className={`font-bold text-sm uppercase tracking-widest mb-3 \${msg.role === "user" ? "text-text-muted" : "text-neon"}`}>
                        {msg.role === "user" ? "Daily Log" : "Agent Verdict"}
                      </h3>
                      <p className="text-text-main font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
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
                    className="w-full bg-dark-card rounded-2xl border border-dark-border p-5 resize-none outline-none text-text-main placeholder:text-dark-border focus:border-neon/50 transition-colors h-24 disabled:opacity-50"
                    placeholder="Log more context or respond to the verdict..."
                  />
                )}
                
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !input.trim()}
                  className="flex items-center justify-between w-full sm:w-80 self-end bg-neon hover:bg-neon/90 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.15)] group"
                >
                  <span>{loading ? "Evaluating..." : "Commit Log"}</span>
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
    </div>
  );
}
