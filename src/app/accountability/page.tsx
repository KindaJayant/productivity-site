import { ShieldCheck, CalendarCheck } from "lucide-react";

export default function AccountabilityMode() {
  return (
    <div className="max-w-5xl mx-auto p-8 lg:p-14 min-h-screen flex flex-col relative z-0">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-stallion/60 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <header className="mb-10 border-b border-walnut pb-10">
        <div className="flex items-center gap-5 mb-4">
          <div className="h-16 w-16 rounded-2xl bg-jedi border border-walnut shadow-[0_0_20px_rgba(182,168,162,0.2)] flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-martini drop-shadow-[0_0_10px_rgba(182,168,162,0.6)]" />
          </div>
          <h1 className="text-4xl font-black text-martini tracking-tight drop-shadow-[0_0_10px_rgba(182,168,162,0.1)]">Accountability</h1>
        </div>
        <p className="text-martini/70 text-xl font-light">
          Log your day in plain English. Get calibrated roasts or hype relative to your focus targets.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex-1 bg-stallion rounded-3xl border border-walnut/50 p-8 shadow-[0_10px_40px_rgba(15,30,29,0.8)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-jedi/10 to-transparent pointer-events-none"></div>
            <textarea
              className="w-full h-full min-h-[400px] bg-transparent resize-none outline-none text-martini placeholder:text-walnut focus:ring-0 leading-relaxed text-lg font-light relative z-10"
              placeholder="What did you actually get done today?"
            />
          </div>
          <button className="flex items-center justify-center gap-3 w-full bg-jedi border border-english hover:bg-english text-martini px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-500 shadow-[0_0_20px_rgba(71,25,20,0.3)] hover:shadow-[0_0_40px_rgba(71,25,20,0.8)] group">
            Submit Daily Log
            <CalendarCheck className="h-6 w-6 text-english group-hover:text-martini transition-colors" />
          </button>
        </div>

        <div className="hidden lg:flex flex-col gap-8">
          <div className="bg-stallion border border-walnut/50 rounded-3xl p-8 shadow-[0_10px_40px_rgba(15,30,29,0.8)] relative">
            <h3 className="text-martini font-bold text-xl mb-6 tracking-tight drop-shadow-[0_0_8px_rgba(182,168,162,0.3)]">Past Week</h3>
            <div className="space-y-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={`h-3 w-3 rounded-full ${i < 3 ? 'bg-english shadow-[0_0_10px_rgba(71,25,20,0.8)]' : 'bg-walnut/50'}`} />
                  <span className={`text-base font-medium ${i < 3 ? 'text-martini' : 'text-martini/40'}`}>Day {-i}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-walnut/30">
              <p className="text-sm font-semibold text-english uppercase tracking-widest mb-2">Current Status</p>
              <p className="text-2xl font-black text-martini drop-shadow-[0_0_10px_rgba(182,168,162,0.4)]">On Fire</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
