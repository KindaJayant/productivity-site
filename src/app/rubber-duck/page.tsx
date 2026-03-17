import { MessageSquare, Zap } from "lucide-react";

export default function RubberDuckMode() {
  return (
    <div className="max-w-5xl mx-auto p-8 lg:p-14 min-h-screen flex flex-col relative z-0">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-english/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <header className="mb-10 border-b border-walnut pb-10">
        <div className="flex items-center gap-5 mb-4">
          <div className="h-16 w-16 rounded-2xl bg-jedi border border-walnut shadow-[0_0_20px_rgba(63,41,32,0.6)] flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-walnut drop-shadow-[0_0_8px_rgba(63,41,32,0.8)]" />
          </div>
          <h1 className="text-4xl font-black text-martini tracking-tight drop-shadow-[0_0_10px_rgba(182,168,162,0.1)]">Rubber Duck</h1>
        </div>
        <p className="text-martini/70 text-xl font-light">
          Paste your current approach or architecture. Get uncomfortable Socratic questions, then the simpler path.
        </p>
      </header>

      <div className="flex-1 flex flex-col gap-8">
        <div className="flex-1 bg-stallion rounded-3xl border border-walnut/50 p-8 shadow-[0_10px_40px_rgba(15,30,29,0.8)] relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-jedi/10 pointer-events-none"></div>
          <textarea
            className="w-full flex-1 bg-transparent resize-none outline-none text-martini placeholder:text-walnut focus:ring-0 font-mono text-base leading-relaxed relative z-10"
            placeholder="Paste your code, architecture, or idea here..."
          />
        </div>
        <button className="flex items-center justify-center gap-3 w-full sm:w-auto self-end bg-walnut hover:bg-walnut/90 border border-english/50 text-martini px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_0_30px_rgba(63,41,32,0.4)] hover:shadow-[0_0_50px_rgba(71,25,20,0.6)] hover:-translate-y-1">
          Roast Approach
          <Zap className="h-6 w-6 text-english drop-shadow-[0_0_5px_rgba(71,25,20,1)]" />
        </button>
      </div>
    </div>
  );
}
