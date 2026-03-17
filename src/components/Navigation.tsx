import Link from "next/link";
import { Brain, Target, MessageSquare, ShieldCheck } from "lucide-react";

export function Navigation() {
  const navItems = [
    { name: "Dashboard", href: "/", icon: Brain },
    { name: "Focus Mode", href: "/focus", icon: Target },
    { name: "Rubber Duck", href: "/rubber-duck", icon: MessageSquare },
    { name: "Accountability", href: "/accountability", icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-6 flex flex-col h-screen sticky top-0">
      <div className="mb-10 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-lg font-bold text-zinc-100 tracking-tight">OS <span className="text-zinc-500">Brutal</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all group"
          >
            <item.icon className="h-5 w-5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          <p className="text-xs text-zinc-400 mb-2">Daily Streak</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">12</span>
            <span className="text-xs text-zinc-500">days</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
