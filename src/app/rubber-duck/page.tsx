import { MessageSquare, ArrowUpRight } from "lucide-react";

export default function RubberDuckMode() {
  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-16 min-h-screen flex flex-col relative z-10">
      
      <header className="mb-12 border-b border-dark-border pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon/10 border border-neon/30 text-neon text-xs font-bold tracking-widest uppercase rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse"></span>
          Module 02
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-neon" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-text-main tracking-tighter">Rubber Duck</h1>
        </div>
        <p className="text-text-muted text-lg mt-4 font-medium max-w-2xl">
          Paste your approach. Get uncomfortable Socratic questions, then secure the simpler path.
        </p>
      </header>

      <div className="flex-1 flex flex-col gap-6">
        <div className="flex-1 bg-dark-card rounded-3xl border border-dark-border p-8 relative overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-dark-border pb-4">
             <div className="flex gap-1.5">
               <div className="w-3 h-3 rounded-full bg-dark-border"></div>
               <div className="w-3 h-3 rounded-full bg-dark-border"></div>
               <div className="w-3 h-3 rounded-full bg-dark-border"></div>
             </div>
             <span className="text-dark-border font-mono text-sm">terminal_sequence</span>
          </div>
          <textarea
            className="w-full flex-1 bg-transparent resize-none outline-none text-text-main placeholder:text-dark-border focus:ring-0 font-mono text-sm leading-relaxed relative z-10"
            placeholder={`> const user = await db.user.findUnique({
>   where: { id: userId },
>   include: { posts: true }
> })
> 
> // I feel like this query is getting too slow when 
> // the user has thousands of posts. Should I paginate 
> // here or just use a separate endpoint entirely?`}
          />
        </div>
        
        <button className="flex items-center justify-between w-full sm:w-80 self-end bg-neon hover:bg-neon/90 text-black px-8 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.15)] group">
          Roast Architecture
          <div className="p-1.5 rounded-full bg-black">
            <ArrowUpRight className="h-5 w-5 text-neon group-hover:rotate-45 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
}
