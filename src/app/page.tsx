import { Brain, Target, MessageSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const modes = [
    {
      title: "Focus Mode",
      description: "Brain-dump everything on your mind before a session. Get one clean focus prompt.",
      icon: <Target className="h-8 w-8 text-indigo-400 group-hover:scale-110 transition-transform" />,
      href: "/focus",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
    {
      title: "Rubber Duck Mode",
      description: "Paste your approach. Get max 3 uncomfortable Socratic questions, then a simpler path.",
      icon: <MessageSquare className="h-8 w-8 text-rose-400 group-hover:scale-110 transition-transform" />,
      href: "/rubber-duck",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
    {
      title: "Accountability Mode",
      description: "Log your day in plain English. Get calibrated roasts or hype based on your streak.",
      icon: <ShieldCheck className="h-8 w-8 text-emerald-400 group-hover:scale-110 transition-transform" />,
      href: "/accountability",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 lg:p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
          Welcome back. Let's get to work.
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Your solo productivity OS. Choose a mode to park your noise, clarify your thoughts, and stay accountable.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modes.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className={`group p-6 rounded-2xl border ${mode.borderColor} bg-zinc-900/50 hover:bg-zinc-900 transition-all cursor-pointer`}
          >
            <div className={`h-16 w-16 rounded-xl ${mode.bgColor} flex items-center justify-center mb-6`}>
              {mode.icon}
            </div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-2">{mode.title}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{mode.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
