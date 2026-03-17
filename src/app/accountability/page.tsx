import { ShieldCheck, ArrowUpRight } from "lucide-react";

export default function AccountabilityMode() {
  return (
    <div className="max-w-6xl mx-auto p-8 lg:p-16 min-h-screen flex flex-col relative z-10">
      
      <header className="mb-12 border-b border-dark-border pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon/10 border border-neon/30 text-neon text-xs font-bold tracking-widest uppercase rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse"></span>
          Module 03
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-neon" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-text-main tracking-tighter">Accountability</h1>
        </div>
        <p className="text-text-muted text-lg mt-4 font-medium max-w-2xl">
          Log your day in plain English. We analyze ecosystem activities and secure your focus targets.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex-1 bg-dark-card rounded-3xl border border-dark-border p-8 relative overflow-hidden">
            <textarea
              className="w-full h-full min-h-[400px] bg-transparent resize-none outline-none text-text-main placeholder:text-dark-border focus:ring-0 leading-relaxed text-lg font-medium relative z-10"
              placeholder="What did you actually accomplish today?"
            />
          </div>
          <button className="flex items-center justify-between w-full bg-neon hover:bg-neon/90 text-black px-8 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.15)] group">
            <span>Commit Daily Log</span>
            <div className="p-1.5 rounded-full bg-black">
              <ArrowUpRight className="h-5 w-5 text-neon group-hover:rotate-45 transition-transform" />
            </div>
          </button>
        </div>

        <div className="hidden lg:flex flex-col gap-6">
          <div className="bg-dark-card border border-dark-border rounded-3xl p-8 relative overflow-hidden">
            <h3 className="text-text-muted font-bold text-xs uppercase tracking-widest pl-2 mb-8 border-l-2 border-neon">
              Ecosystem Status
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-dark-border before:to-transparent">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${i < 3 ? 'bg-neon border-dark-bg shrink-0' : 'bg-dark-card border-dark-border shrink-0'} md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow md:mx-auto z-10`}>
                  </div>
                  <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border ${i < 3 ? 'bg-dark-bg border-dark-border shadow-sm' : 'bg-transparent border-transparent'} text-sm`}>
                    <p className={`font-bold ${i < 3 ? 'text-text-main' : 'text-text-muted/50'}`}>Day {-i}</p>
                    {i < 3 && <p className="text-text-muted text-xs mt-1">Target Secured</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-dark-border flex justify-between items-center bg-dark-bg p-4 rounded-xl border">
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Status</p>
                <p className="text-xl font-black text-neon">Secured</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-neon/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
