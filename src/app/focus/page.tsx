import { Target, ArrowRight } from "lucide-react";

export default function FocusMode() {
  return (
    <div className="max-w-5xl mx-auto p-8 lg:p-14 min-h-screen flex flex-col relative z-0">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stallion/40 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <header className="mb-10 border-b border-walnut pb-10">
        <div className="flex items-center gap-5 mb-4">
          <div className="h-16 w-16 rounded-2xl bg-jedi border border-walnut shadow-[0_0_20px_rgba(71,25,20,0.3)] flex items-center justify-center">
            <Target className="h-8 w-8 text-english drop-shadow-[0_0_8px_rgba(71,25,20,0.8)]" />
          </div>
          <h1 className="text-4xl font-black text-martini tracking-tight drop-shadow-[0_0_10px_rgba(182,168,162,0.1)]">Focus Mode</h1>
        </div>
        <p className="text-martini/70 text-xl font-light">
          Brain-dump everything on your mind. We'll park the noise and give you one clean prompt for this session.
        </p>
      </header>

      <div className="flex-1 flex flex-col gap-8">
        <div className="flex-1 bg-stallion rounded-3xl border border-walnut/50 p-8 shadow-[0_10px_40px_rgba(15,30,29,0.8)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-jedi/20 pointer-events-none"></div>
          <textarea
            className="w-full h-full bg-transparent resize-none outline-none text-martini placeholder:text-walnut focus:ring-0 sm:text-xl font-light relative z-10"
            placeholder="What's distracting you? What are you trying to achieve right now?"
          />
        </div>
        <button className="flex items-center justify-center gap-3 w-full sm:w-auto self-end bg-english hover:bg-english/90 text-martini px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_0_30px_rgba(71,25,20,0.4)] hover:shadow-[0_0_40px_rgba(71,25,20,0.8)] hover:-translate-y-1">
          Start Session
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
