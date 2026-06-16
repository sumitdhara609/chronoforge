type HoverInsightProps = {
  children: React.ReactNode;
  insight: string;
};

export function HoverInsight({ children, insight }: HoverInsightProps) {
  return (
    <div className="group relative">
      {children}

      <div className="pointer-events-none absolute left-1/2 top-0 z-20 w-64 -translate-x-1/2 -translate-y-[110%] scale-95 rounded-2xl border border-white/10 bg-[#0b1020]/95 p-4 text-sm leading-6 text-slate-300 opacity-0 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-300 group-hover:scale-100 group-hover:opacity-100">
        <div className="mb-2 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        {insight}
      </div>
    </div>
  );
}