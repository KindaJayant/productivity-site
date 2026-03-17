import { Brain, Target, MessageSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const modes = [
    {
      title: "Focus Mode",
      description: "Brain-dump everything on your mind before a session. Get one clean focus prompt.",
      icon: <Target className="h-8 w-8 text-english drop-shadow-[0_0_12px_rgba(71,25,20,0.8)] group-hover:scale-110 transition-transform duration-500" />,
      href: "/focus",
    },
    {
      title: "Rubber Duck Mode",
      description: "Paste your approach. Get max 3 uncomfortable Socratic questions, then a simpler path.",
      icon: <MessageSquare className="h-8 w-8 text-walnut drop-shadow-[0_0_12px_rgba(63,41,32,0.8)] group-hover:text-english group-hover:drop-shadow-[0_0_15px_rgba(71,25,20,0.8)] group-hover:scale-110 transition-all duration-500" />,
      href: "/rubber-duck",
    },
    {
      title: "Accountability Mode",
      description: "Log your day in plain English. Get calibrated roasts or hype based on your streak.",
      icon: <ShieldCheck className="h-8 w-8 text-martini drop-shadow-[0_0_12px_rgba(182,168,162,0.5)] group-hover:text-english group-hover:scale-110 transition-all duration-500" />,
      href: "/accountability",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 lg:p-14 relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-english/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stallion border border-walnut rounded-full shadow-[0_0_100px_rgba(15,30,29,1)] blur-3xl pointer-events-none -z-10 opacity-50"></div>

      <header className="mb-16 mt-8">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-martini mb-6 drop-shadow-[0_0_15px_rgba(182,168,162,0.2)]">
          Welcome back.
          <br/>
          <span className="text-english drop-shadow-[0_0_20px_rgba(71,25,20,0.6)]">Let's get to work.</span>
        </h1>
        <p className="text-xl text-martini/70 max-w-2xl leading-relaxed font-light">
          Your solo productivity OS. Choose a mode to park your noise, clarify your thoughts, and stay accountable.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modes.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className={`group p-8 rounded-3xl border border-walnut/30 bg-stallion shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:bg-stallion/80 hover:border-english/40 hover:shadow-[0_0_40px_rgba(71,25,20,0.15)] transition-all duration-500 cursor-pointer overflow-hidden relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className={`h-16 w-16 rounded-2xl bg-jedi border border-walnut/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] flex items-center justify-center mb-8 relative z-10`}>
              {mode.icon}
            </div>
            <h2 className="text-2xl font-bold text-martini mb-3 relative z-10">{mode.title}</h2>
            <p className="text-martini/60 text-base leading-relaxed relative z-10">{mode.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
