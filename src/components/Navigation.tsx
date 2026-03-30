import Link from "next/link";
import { Brain, Target, MessageSquare, ShieldCheck, NotebookPen } from "lucide-react";

export function Navigation() {
  const navItems = [
    { name: "Dashboard", href: "/", icon: Brain },
    { name: "Focus Mode", href: "/focus", icon: Target },
    { name: "Rubber Duck", href: "/rubber-duck", icon: MessageSquare },
    { name: "Accountability", href: "/accountability", icon: ShieldCheck },
    { name: "Silent Journal", href: "/journal", icon: NotebookPen },
  ];

  return (
    <aside className="w-64 border-r border-dark-border bg-dark-bg/95 backdrop-blur-xl relative z-20 p-6 flex flex-col h-screen sticky top-0">
      <div className="mb-12 flex items-center gap-3">
        <div className="h-8 w-8 rounded bg-neon flex items-center justify-center">
          <Brain className="h-5 w-5 text-black" />
        </div>
        <h1 className="text-xl font-black text-text-main tracking-[0.2em] italic">
          SYN<span className="text-neon">APSE</span>
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

    </aside>
  );
}
