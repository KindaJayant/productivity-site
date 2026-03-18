"use client";

import { ShieldCheck, ArrowUpRight, Loader2, Plus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { submitAccountability } from "../actions";
import { Message } from "@/lib/openrouter";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { v4 as uuidv4 } from "uuid";

const HABITS = [
  { id: "gym", label: "Gym" },
  { id: "nofap", label: "NoFap" },
  { id: "read", label: "Read" },
];

type DailyRecord = {
  date: string; // toDateString() format
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

const generateLast14Days = (): DailyRecord[] =>
  Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toDateString(),
    gym: null,
    nofap: null,
    read: null,
  }));

export default function AccountabilityMode() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 5-Slot Sessions via Convex
  const sessions = useQuery(api.memory.getSessions, { type: "accountability" }) || [];
  const createSessionMut = useMutation(api.memory.createSession);
  const deleteSessionMut = useMutation(api.memory.deleteSession);
  const updateMessagesMut = useMutation(api.memory.updateMessages);
  const logActivity = useMutation(api.streaks.log);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Habit tracking — full 14 day history
  const [history, setHistory] = useState<DailyRecord[]>([]);

  // The date cell the user has selected (defaults to today)
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toDateString());

  useEffect(() => {
    // Load habit history
    const stored = localStorage.getItem("brutal_habits");
    if (stored) {
      try {
        const parsed: DailyRecord[] = JSON.parse(stored);
        const baseline = generateLast14Days();
        const merged = baseline.map(day => {
          const found = parsed.find(p => p.date === day.date);
          return found || day;
        });
        setHistory(merged);
      } catch {
        setHistory(generateLast14Days());
      }
    } else {
      setHistory(generateLast14Days());
    }

    setMounted(true);
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages]);

  // Persist history to localStorage whenever it changes
  const persistHistory = (h: DailyRecord[]) => {
    localStorage.setItem("brutal_habits", JSON.stringify(h));
  };

  // Get status for a given habit on a given date string
  const getStatus = (dateStr: string, habitId: string): boolean | null => {
    const record = history.find(r => r.date === dateStr);
    if (!record) return null;
    return record[habitId as keyof DailyRecord] as boolean | null;
  };

  // Set habit status for the currently selected date
  const setHabit = (habitId: string, value: boolean) => {
    setHistory(prev => {
      const newHistory = prev.map(day => {
        if (day.date === selectedDate) {
          return { ...day, [habitId]: value };
        }
        return day;
      });
      persistHistory(newHistory);
      return newHistory;
    });
  };

  // Sessions management
  const handleCreateSession = async () => {
    if (sessions.length >= 5) return;
    const title = `Entry 0${sessions.length + 1}`;
    const date = new Date().toISOString();
    
    const newId = await createSessionMut({
      title,
      type: "accountability",
      date
    });
    // @ts-ignore Since Convex id behaves like a string
    setActiveSessionId(newId);
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // @ts-ignore
    await deleteSessionMut({ id });
    if (activeSessionId === id && sessions.length > 0) {
      const nextSession = sessions.find(s => s.id !== id);
      setActiveSessionId(nextSession ? nextSession.id : null);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || loading || !activeSessionId) return;
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...(activeSession?.messages || []), userMsg];

    // Optimistically UI could be handled by Convex directly if we patch immediately,
    // but here we just wait for the update
    // @ts-ignore
    await updateMessagesMut({ id: activeSessionId, messages: newMessages });
    setInput("");
    setLoading(true);

    try {
      const todayStr = new Date().toDateString();
      const todayRecord = history.find(r => r.date === todayStr);
      const context = (activeSession?.messages.length || 0) === 0 && todayRecord
        ? `Habits today:\nGym: ${todayRecord.gym === true ? "Done" : todayRecord.gym === false ? "Missed" : "Pending"}\nNoFap: ${todayRecord.nofap === true ? "Done" : todayRecord.nofap === false ? "Missed" : "Pending"}\nRead: ${todayRecord.read === true ? "Done" : todayRecord.read === false ? "Missed" : "Pending"}`
        : undefined;

      const result = await submitAccountability(newMessages, context);
      await logActivity();
      
      if (result.error) {
        // @ts-ignore
        await updateMessagesMut({ id: activeSessionId, messages: [...newMessages, { role: "assistant", content: `⚠️ [SYSTEM FAILURE]: ${result.error}` }] });
      } else {
        // @ts-ignore
        await updateMessagesMut({ id: activeSessionId, messages: [...newMessages, { role: "assistant", content: result.content || "Empty response from agent." }] });
      }
    } catch (error) {
      console.error("Accountability mode exception:", error);
      // @ts-ignore
      await updateMessagesMut({ id: activeSessionId, messages: [...newMessages, { role: "assistant", content: "⚠️ [FATAL]: Failed to connect to Accountability Agent." }] });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!activeSessionId) return;
    // @ts-ignore
    await updateMessagesMut({ id: activeSessionId, messages: [] });
    setInput("");
  };

  if (!mounted) return null;

  const todayStr = new Date().toDateString();

  return (
    <div className="max-w-6xl mx-auto p-8 lg:p-16 min-h-[calc(100vh-theme(spacing.16))] flex flex-col relative z-10">

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-dark-card border border-dark-border text-text-muted text-xs font-bold tracking-widest uppercase rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-neon"></span>
            Module 03
          </div>
          <span suppressHydrationWarning className="text-xs text-neon font-mono uppercase tracking-widest bg-neon/10 px-3 py-1 rounded-full border border-neon/20">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-neon" />
          Accountability
        </h1>
        <p className="text-lg text-text-muted mt-4 max-w-xl leading-relaxed">
          Record your reps. Dump your daily execution. Face the reality of your actions.
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">

        {/* Left Col: Habit Tracker Grid */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6">

            {/* Selected date controls */}
            <div className="flex flex-col gap-1 mb-4 border-l-2 border-neon pl-3">
              <h3 className="text-text-muted font-bold text-xs uppercase tracking-widest">Daily Reps</h3>
              <p suppressHydrationWarning className="text-[10px] font-mono text-neon uppercase tracking-widest">
                {selectedDate === todayStr
                  ? "Editing: Today"
                  : `Editing: ${new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
              </p>
            </div>

            {/* Done / Missed buttons — apply to selectedDate */}
            <div className="flex flex-col gap-4 mb-6">
              {HABITS.map(habit => {
                const status = getStatus(selectedDate, habit.id);
                return (
                  <div key={habit.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-text-main font-bold text-sm tracking-wide flex-1">{habit.label}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setHabit(habit.id, true)}
                          className={[
                            "px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all border",
                            status === true
                              ? "bg-neon border-neon text-black shadow-[0_0_10px_rgba(204,255,0,0.5)]"
                              : "bg-transparent border-dark-border text-text-muted hover:text-neon hover:border-neon",
                          ].join(" ")}
                        >
                          Done
                        </button>
                        <button
                          onClick={() => setHabit(habit.id, false)}
                          className={[
                            "px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all border",
                            status === false
                              ? "bg-red-500 border-red-500 text-black shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                              : "bg-transparent border-dark-border text-text-muted hover:text-red-500 hover:border-red-500",
                          ].join(" ")}
                        >
                          Missed
                        </button>
                      </div>
                    </div>

                    {/* Clickable 14-day contribution grid */}
                    <div className="flex gap-1 pt-1">
                      {history.map((day, i) => {
                        const dayStatus = day[habit.id as keyof DailyRecord];
                        const isSelected = day.date === selectedDate;
                        const isToday = day.date === todayStr;
                        const dayNum = new Date(day.date).getDate();

                        // Cell background
                        let cellBg = "bg-dark-bg border border-dark-border/50";
                        if (dayStatus === true) cellBg = "bg-neon/60 hover:bg-neon/80";
                        if (dayStatus === false) cellBg = "bg-red-500/40 hover:bg-red-500/60";
                        if (isSelected) cellBg += " ring-2 ring-white ring-offset-1 ring-offset-dark-card";

                        // Date number color
                        let numColor = "text-dark-border";
                        if (dayStatus === true) numColor = "text-neon font-bold";
                        if (dayStatus === false) numColor = "text-red-500 font-bold";
                        if (isToday) numColor += " underline underline-offset-2";

                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(day.date)}
                            title={`${new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${dayStatus === true ? "Done" : dayStatus === false ? "Missed" : "Not set"}`}
                            className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                          >
                            <span className={["text-[9px] font-mono leading-none transition-colors", numColor].join(" ")}>
                              {dayNum}
                            </span>
                            <div className={["w-full aspect-square rounded-[2px] transition-all", cellBg].join(" ")} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Accountability Chat */}
        <div className="lg:col-span-2 flex flex-col min-h-[500px] relative">

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            {sessions.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={[
                  "group cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-bold tracking-wide",
                  activeSessionId === s.id
                    ? "bg-neon border-neon text-black shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                    : "bg-dark-card border-dark-border text-text-muted hover:border-neon/50 hover:text-text-main",
                ].join(" ")}
              >
                Entry 0{sessions.length - idx}
                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className={[
                    "p-0.5 rounded-md opacity-50 hover:opacity-100 transition-opacity",
                    activeSessionId === s.id ? "hover:bg-black/20" : "hover:bg-dark-bg",
                  ].join(" ")}
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
              <div className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-red-500 border border-red-500/20 bg-red-500/5 rounded-lg">
                Storage Full (5/5)
              </div>
            )}
          </div>

          {!activeSession ? (
            <div className="flex-1 flex items-center justify-center border border-dashed border-dark-border rounded-3xl bg-dark-card/50">
              <div className="text-center">
                <ShieldCheck className="w-12 h-12 text-dark-border mx-auto mb-4" />
                <p className="text-text-muted font-medium">No active entries.</p>
                <button onClick={handleCreateSession} className="mt-4 text-neon font-bold text-sm hover:underline">
                  Create your first Entry
                </button>
              </div>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6 scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent">
                {activeSession.messages.length === 0 ? (
                  <div className="flex-1 h-full min-h-[300px] bg-dark-card rounded-3xl border border-dark-border p-8">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={loading}
                      className="w-full h-full bg-transparent resize-none outline-none text-text-main placeholder:text-dark-border focus:ring-0 sm:text-lg font-medium leading-relaxed disabled:opacity-50"
                      placeholder="Dump everything here. What did you execute? Where did you fail? No excuses."
                    />
                  </div>
                ) : (
                  activeSession.messages.map((msg, i) => (
                    <div key={i} className={["p-6 rounded-2xl", msg.role === "user" ? "bg-dark-card border border-dark-border ml-12" : "bg-neon/10 border border-neon shadow-[0_0_30px_rgba(204,255,0,0.1)] mr-12"].join(" ")}>
                      <h3 className={["font-bold text-sm uppercase tracking-widest mb-3", msg.role === "user" ? "text-text-muted" : "text-neon"].join(" ")}>
                        {msg.role === "user" ? "Daily Log" : "Agent Verdict"}
                      </h3>
                      <p className="text-text-main font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  ))
                )}
              </div>

              <div className={["mt-auto pt-6 flex flex-col gap-4", activeSession.messages.length > 0 ? "border-t border-dark-border" : ""].join(" ")}>
                {activeSession.messages.length > 0 && (
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="w-full bg-dark-card rounded-2xl border border-dark-border p-5 resize-none outline-none text-text-main placeholder:text-dark-border focus:border-neon/50 transition-colors h-24 disabled:opacity-50"
                    placeholder="Log more context or respond to the verdict..."
                  />
                )}

                <div className="flex items-center gap-4 justify-end">
                  {activeSession.messages.length > 0 && (
                    <button onClick={handleReset} className="text-text-muted hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                      Reset Log
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    className="flex items-center justify-between w-full sm:w-80 bg-neon hover:bg-neon/90 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.15)] group"
                  >
                    <span>{loading ? "Evaluating..." : "Commit Log"}</span>
                    <div className="p-1.5 rounded-full bg-black">
                      {loading ? <Loader2 className="h-5 w-5 text-neon animate-spin" /> : <ArrowUpRight className="h-5 w-5 text-neon group-hover:rotate-45 transition-transform" />}
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
