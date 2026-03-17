import { Target, ArrowRight } from "lucide-react";

export default function FocusMode() {
  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12 min-h-screen flex flex-col">
      <header className="mb-8 border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Target className="h-6 w-6 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-100">Focus Mode</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          Brain-dump everything on your mind. We'll park the noise and give you one clean prompt for this session.
        </p>
      </header>

      <div className="flex-1 flex flex-col gap-6">
        <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
          <textarea
            className="w-full h-full bg-transparent resize-none outline-none text-zinc-200 placeholder:text-zinc-600 focus:ring-0 sm:text-lg"
            placeholder="What's distracting you? What are you trying to achieve right now?"
          />
        </div>
        <button className="flex items-center justify-center gap-2 w-full sm:w-auto self-end bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          Start Session
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
