import { ShieldCheck, CalendarCheck } from "lucide-react";

export default function AccountabilityMode() {
  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12 min-h-screen flex flex-col">
      <header className="mb-8 border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-100">Accountability</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          Log your day in plain English. Get calibrated roasts or hype relative to your focus targets.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 shadow-inner">
            <textarea
              className="w-full h-full min-h-[300px] bg-transparent resize-none outline-none text-zinc-200 placeholder:text-zinc-600 focus:ring-0 leading-relaxed"
              placeholder="What did you actually get done today?"
            />
          </div>
          <button className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-emerald-950 px-8 py-4 rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            Submit Daily Log
            <CalendarCheck className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden lg:flex flex-col gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-zinc-100 font-semibold mb-4">Past Week</h3>
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${i < 3 ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                  <span className="text-sm text-zinc-400">Day {-i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
