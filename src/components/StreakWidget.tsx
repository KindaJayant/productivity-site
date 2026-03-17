"use client";

import { ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

export function getStreak() {
  if (typeof window === 'undefined') return 0;
  try {
    const data = localStorage.getItem('brutal_streak');
    if (!data) return 0;
    const { streak, lastLoggedDate } = JSON.parse(data);
    if (!lastLoggedDate) return 0;
    
    const today = new Date().toDateString();
    if (lastLoggedDate === today) {
      return streak;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastLoggedDate === yesterday.toDateString()) {
      return streak; 
    }
    
    return 0; // Streak broken
  } catch {
    return 0;
  }
}

export function logActivity() {
  try {
    const data = localStorage.getItem('brutal_streak');
    const today = new Date().toDateString();
    
    let currentStreak = 0;
    let lastLoggedDate = null;
    
    if (data) {
      const parsed = JSON.parse(data);
      currentStreak = parsed.streak || 0;
      lastLoggedDate = parsed.lastLoggedDate;
    }
    
    if (lastLoggedDate === today) {
      return currentStreak; 
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastLoggedDate === yesterday.toDateString()) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }
    
    localStorage.setItem('brutal_streak', JSON.stringify({
      streak: currentStreak,
      lastLoggedDate: today
    }));
    
    window.dispatchEvent(new Event('streak_updated'));
    return currentStreak;
  } catch {
    return 1;
  }
}

export function StreakWidget() {
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    setStreak(getStreak());
    const handleUpdate = () => setStreak(getStreak());
    window.addEventListener('streak_updated', handleUpdate);
    return () => window.removeEventListener('streak_updated', handleUpdate);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by rendering an empty placeholder with same dimensions
    return <div className="p-6 rounded-3xl bg-dark-card border border-dark-border min-w-[240px] h-[150px] animate-pulse"></div>;
  }

  return (
    <div className="p-6 rounded-3xl bg-dark-card border border-dark-border relative overflow-hidden group min-w-[240px] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-neon/20 transition-all duration-700"></div>
      <p className="text-xs font-bold text-text-muted tracking-widest uppercase mb-2 relative z-10 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-neon" /> Current Streak
      </p>
      <div className="flex items-baseline gap-1 relative z-10 mb-4">
        <span className="text-5xl font-black text-text-main tracking-tighter">{streak}</span>
        <span className="text-sm font-bold text-text-muted uppercase tracking-widest">Days</span>
      </div>
      <div className="w-full bg-dark-bg border border-dark-border h-2 rounded-full overflow-hidden relative z-10">
        <div 
          className="bg-neon h-full rounded-full shadow-[0_0_15px_rgba(204,255,0,0.8)] transition-all duration-1000"
          style={{ width: `${Math.min(100, Math.max(5, (streak / 30) * 100))}%` }}
        ></div>
      </div>
    </div>
  );
}
