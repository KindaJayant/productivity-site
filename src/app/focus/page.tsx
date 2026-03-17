"use client";

import { Target, ArrowUpRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { submitFocus } from "../actions";

export default function FocusMode() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    try {
      const result = await submitFocus(input);
      setResponse(result);
    } catch (error) {
      console.error(error);
      setResponse("Failed to connect to the Focus Engine. Check your API key.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-16 min-h-screen flex flex-col relative z-10">
      
      <header className="mb-12 border-b border-dark-border pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon/10 border border-neon/30 text-neon text-xs font-bold tracking-widest uppercase rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse"></span>
          Module 01
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
            <Target className="h-6 w-6 text-neon" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-text-main tracking-tighter">Focus Engine</h1>
        </div>
        <p className="text-text-muted text-lg mt-4 font-medium max-w-2xl">
          Brain-dump everything on your mind. We'll park the noise and secure a single clean prompt for your session.
        </p>
      </header>

      <div className="flex-1 flex flex-col gap-6">
        <div className="flex-1 bg-dark-card rounded-3xl border border-dark-border p-8 relative overflow-hidden group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || response !== null}
            className="w-full h-full bg-transparent resize-none outline-none text-text-main placeholder:text-dark-border focus:ring-0 sm:text-lg font-medium relative z-10 leading-relaxed disabled:opacity-50"
            placeholder="Example: I keep checking Twitter because I'm stuck on this Redux state bug. My goal for this session is to just isolate the state bug in a CodeSandbox and fix it."
          />
        </div>
        
        {response && (
          <div className="bg-neon/10 border border-neon p-6 rounded-2xl relative shadow-[0_0_30px_rgba(204,255,0,0.1)]">
            <h3 className="text-neon font-bold text-sm uppercase tracking-widest mb-3">System Directives</h3>
            <p className="text-text-main font-medium whitespace-pre-wrap">{response}</p>
          </div>
        )}
        
        <button 
          onClick={handleStart}
          disabled={loading || !input.trim() || response !== null}
          className="flex items-center justify-between w-full sm:w-80 self-end bg-neon hover:bg-neon/90 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.15)] group"
        >
          <span>{loading ? "Processing..." : response ? "Session Locked" : "Engage Workflow"}</span>
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
  );
}
