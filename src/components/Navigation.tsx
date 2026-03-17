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
    <aside className="w-64 border-r border-walnut/40 bg-jedi relative z-10 shadow-[4px_0_40px_rgba(15,30,29,0.8)] p-6 flex flex-col h-screen sticky top-0">
      <div className="mb-10 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-english border border-english/50 shadow-[0_0_15px_rgba(71,25,20,0.6)] flex items-center justify-center">
          <Brain className="h-5 w-5 text-martini" />
        </div>
        <h1 className="text-xl font-bold text-martini tracking-tight">OS <span className="text-english drop-shadow-[0_0_8px_rgba(71,25,20,0.8)] font-black">Brutal</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-martini/60 hover:text-martini hover:bg-stallion hover:shadow-[0_0_12px_rgba(15,30,29,1)] hover:border-walnut/30 border border-transparent transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-english/0 to-english/0 group-hover:from-english/5 transition-all duration-500" />
            <item.icon className="h-5 w-5 text-walnut group-hover:text-english group-hover:drop-shadow-[0_0_8px_rgba(71,25,20,0.6)] transition-all duration-300" />
            <span className="relative z-10">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="p-4 rounded-xl bg-stallion border border-walnut/50 shadow-[0_8px_30px_rgba(15,30,29,0.8)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-english/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-english/20 transition-all duration-700"></div>
          <p className="text-xs font-semibold text-martini/50 tracking-wider uppercase mb-2 relative z-10">Daily Streak</p>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-3xl font-black text-martini drop-shadow-[0_0_10px_rgba(182,168,162,0.4)]">12</span>
            <span className="text-xs font-medium text-martini/50">days</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
