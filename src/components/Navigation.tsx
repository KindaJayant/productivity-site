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
    <aside className="w-64 border-r border-dark-border bg-dark-bg/95 backdrop-blur-xl relative z-20 p-6 flex flex-col h-screen sticky top-0">
      <div className="mb-12 flex items-center gap-3">
        <div className="h-8 w-8 rounded bg-neon flex items-center justify-center">
          <Brain className="h-5 w-5 text-black" />
        </div>
        <h1 className="text-xl font-bold text-text-main tracking-widest uppercase">
          OS <span className="text-neon">Brutal.</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-xs uppercase tracking-widest text-text-muted mb-4 font-semibold px-2">Navigation</p>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-4 px-3 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-dark-card transition-all duration-200 group relative overflow-hidden"
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-neon group-hover:h-1/2 transition-all duration-300 rounded-r-full" />
            <item.icon className="h-5 w-5 text-text-muted group-hover:text-neon transition-colors duration-200" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-neon/20 transition-all duration-500"></div>
          <p className="text-xs font-bold text-text-muted tracking-widest uppercase mb-1 relative z-10">Daily Streak</p>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-4xl font-bold text-text-main">12</span>
            <span className="text-sm font-medium text-text-muted">Days</span>
          </div>
          <div className="mt-3 w-full bg-dark-border h-1.5 rounded-full overflow-hidden">
            <div className="bg-neon h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(204,255,0,0.5)]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
