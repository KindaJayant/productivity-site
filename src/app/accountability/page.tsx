"use client";

import { ShieldCheck, ArrowUpRight, Loader2, RotateCcw, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { submitAccountability } from "../actions";
import { Message } from "@/lib/openrouter";

// Mock habit struct array for demonstration of the GitHub style contribution grid
const HABITS = [
  { id: "gym", label: "Gym" },
  { id: "nofap", label: "NoFap" },
  { id: "read", label: "Read" },
];

// Generate 14 random days of mock data (GitHub activity grid style)
const generateMockGrid = () => {
  return Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    completed: Math.random() > 0.4, // 60% completion rate randomly
  }));
};

export default function AccountabilityMode() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Today's toggles
  const [todaysHabits, setTodaysHabits] = useState<Record<string, boolean>>({
    gym: false,
    nofap: false,
    read: false,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    
    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Build context string from the habit toggles if it's the first message
      const context = messages.length === 0 
        ? `Habits Tracking Status:\nGym: ${todaysHabits.gym ? "Completed" : "Failed"}\nNoFap: ${todaysHabits.nofap ? "Completed" : "Failed"}\nRead: ${todaysHabits.read ? "Completed" : "Failed"}`
        : undefined;

      const result = await submitAccountability(newMessages, context);
      setMessages([...newMessages, { role: "assistant", content: result }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "assistant", content: "Failed to connect to Accountability Agent. Check your API key." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  const toggleHabit = (id: string) => {
    setTodaysHabits(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
        
        {messages.length > 0 && (
          <button onClick={handleReset} className="flex items-center gap-2 text-text-muted hover:text-white text-sm font-bold uppercase tracking-widest transition-colors pb-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        )}
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        
        {/* Left Col: Habit Tracker Grid */}
        <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent">
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6">
            <h3 className="text-text-muted font-bold text-xs uppercase tracking-widest pl-2 mb-6 border-l-2 border-neon">
              Daily Reps
            </h3>
            
            <div className="flex flex-col gap-6">
              {HABITS.map((habit) => {
                const isDoneToday = todaysHabits[habit.id];
                const mockHistory = generateMockGrid(); // In reality, fetch from Convex

                return (
                  <div key={habit.id} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-text-main font-bold text-sm tracking-wide">{habit.label}</span>
                      <button 
                        onClick={() => toggleHabit(habit.id)}
                        className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-colors border ${
                          isDoneToday 
                            ? "bg-neon/20 border-neon text-neon shadow-[0_0_10px_rgba(204,255,0,0.2)]" 
                            : "bg-transparent border-dark-border text-text-muted hover:text-text-main"
                        }`}
                      >
                        {isDoneToday ? "Done" : "Pending"}
                      </button>
                    </div>
                    
                    {/* Activity Grid */}
                    <div className="flex gap-1">
                      {mockHistory.map((day, i) => (
                        <div 
                          key={i} 
                          title={day.date}
                          className={`flex-1 aspect-square rounded-[2px] transition-colors ${
                            day.completed ? "bg-neon/60 group-hover:bg-neon/80" : "bg-dark-bg border border-dark-border/50"
                          }`}
                        ></div>
                      ))}
                      {/* Today's square tied to state */}
                      <div 
                        title="Today"
                        className={`flex-1 aspect-square rounded-[2px] transition-all ${
                          isDoneToday ? "bg-neon shadow-[0_0_5px_rgba(204,255,0,0.5)]" : "bg-dark-border animate-pulse"
                        }`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Accountability Chat */}
        <div className="lg:col-span-2 flex flex-col min-h-[500px] relative">
          <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6 scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent">
            {messages.length === 0 ? (
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
              messages.map((msg, i) => (
                <div key={i} className={`p-6 rounded-2xl ${msg.role === "user" ? "bg-dark-card border border-dark-border ml-12" : "bg-neon/10 border border-neon relative shadow-[0_0_30px_rgba(204,255,0,0.1)] mr-12"}`}>
                  <h3 className={`font-bold text-sm uppercase tracking-widest mb-3 ${msg.role === "user" ? "text-text-muted" : "text-neon"}`}>
                    {msg.role === "user" ? "Daily Log" : "Agent Verdict"}
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
        </div>
      </div>
    </div>
  );
}
