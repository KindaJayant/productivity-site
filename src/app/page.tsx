import { Target, MessageSquare, ShieldCheck, ArrowUpRight, NotebookPen } from "lucide-react";
import Link from "next/link";
import { StreakWidget } from "@/components/StreakWidget";

export default function Home() {
  const modes = [
    {
      title: "Focus Mode",
      description: "Brain-dump everything on your mind before a session. Get one clean focus prompt.",
      icon: <Target className="h-8 w-8 text-neon" />,
      href: "/focus",
      label: "01.",
    },
    {
      title: "Rubber Duck",
      description: "Paste your approach. Get uncomfortable Socratic questions, then a simpler path.",
      icon: <MessageSquare className="h-8 w-8 text-neon" />,
      href: "/rubber-duck",
      label: "02.",
    },
    {
      title: "Accountability",
      description: "Log your day in plain English. Get calibrated roasts or hype based on your streak.",
      icon: <ShieldCheck className="h-8 w-8 text-neon" />,
      href: "/accountability",
      label: "03.",
    },
    {
      title: "Silent Journal",
      description: "Free-write your thoughts, frustrations, and wins. The agent observes silently and only intercepts for genuine insights.",
      icon: <NotebookPen className="h-8 w-8 text-neon" />,
      href: "/journal",
      label: "04.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 lg:p-16 relative">
      <header className="mb-20 mt-8 relative flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex-1">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-text-main mb-8 leading-[0.85] uppercase italic">
            Welcome back.<br />
            <span className="text-neon">Focus mode.</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed font-medium">
            Your trusted partner for productivity. Choose a module below to park your noise, clarify your thoughts, and secure your focus.
          </p>
        </div>

        <StreakWidget />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modes.map((mode, idx) => (
          <Link
            key={mode.href}
            href={mode.href}
            className={`group flex flex-col justify-between p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer relative overflow-hidden h-[300px]
              ${idx === 1 
                ? 'bg-neon border-neon text-black hover:bg-neon/90 shadow-[0_0_30px_rgba(204,255,0,0.15)]' 
                : 'bg-dark-card border-dark-border text-text-main hover:border-dark-border/80 hover:bg-dark-card/80'}`}
          >
            <div className="flex justify-between items-start">
              <span className={`text-xl font-bold tracking-tighter ${idx === 1 ? 'text-black/50' : 'text-neon'}`}>
                {mode.label}
              </span>
              <div className={`p-2 rounded-full ${idx === 1 ? 'bg-black text-neon' : 'bg-dark-bg border border-dark-border'}`}>
                <ArrowUpRight className={`h-5 w-5 ${idx === 1 ? 'text-neon' : 'text-text-muted group-hover:text-neon transition-colors'}`} />
              </div>
            </div>
            
            <div>
              <h2 className={`text-2xl font-bold mb-3 tracking-tight ${idx === 1 ? 'text-black' : 'text-text-main'}`}>
                {mode.title}
              </h2>
              <p className={`text-sm leading-relaxed ${idx === 1 ? 'text-black/80 font-medium' : 'text-text-muted'}`}>
                {mode.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
