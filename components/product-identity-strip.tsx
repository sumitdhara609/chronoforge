export function ProductIdentityStrip() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              ChronoForge v0.2 Prototype
            </p>

            <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-white md:text-3xl">
              A future-simulation engine for people building serious things.
            </h2>
          </div>

          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2 md:max-w-xl">
            <ProblemPoint label="Deadline Drift" />
            <ProblemPoint label="Burnout Pressure" />
            <ProblemPoint label="Vague Planning" />
            <ProblemPoint label="Unrealistic Scope" />
          </div>
        </div>

        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400">
          ChronoForge helps transform ambition into measurable time architecture
          by forecasting completion, identifying risk, mapping effort phases,
          and comparing alternate execution scenarios before the deadline starts
          slipping.
        </p>
      </div>
    </div>
  );
}

function ProblemPoint({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-slate-500">Solves </span>
      <span className="font-medium text-slate-200">{label}</span>
    </div>
  );
}