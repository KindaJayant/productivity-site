import { MessageSquare, Zap } from "lucide-react";

export default function RubberDuckMode() {
  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12 min-h-screen flex flex-col">
      <header className="mb-8 border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-rose-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-100">Rubber Duck</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          Paste your current approach or architecture. Get uncomfortable Socratic questions, then the simpler path.
        </p>
      </header>

      <div className="flex-1 flex flex-col gap-6">
        <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 flex flex-col">
          <textarea
            className="w-full flex-1 bg-transparent resize-none outline-none text-zinc-200 placeholder:text-zinc-600 focus:ring-0 font-mono text-sm leading-relaxed"
            placeholder="Paste your code, architecture, or idea here..."
          />
        </div>
        <button className="flex items-center justify-center gap-2 w-full sm:w-auto self-end bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(244,63,94,0.2)]">
          Roast Approach
          <Zap className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
