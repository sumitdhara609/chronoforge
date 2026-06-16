export function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050711]">
      <div className="absolute left-1/2 top-[-10rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="absolute right-[-8rem] top-[18rem] h-[24rem] w-[24rem] rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute bottom-[-10rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.08]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050711_75%)]" />
    </div>
  );
}