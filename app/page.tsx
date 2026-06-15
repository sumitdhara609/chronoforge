import { calculateProjection } from "@/lib/chrono-engine";

export default function Home() {
  const demoProjection = calculateProjection({
    totalEstimatedHours: 120,
    availableHoursPerWeek: 12,
    daysUntilDeadline: 60,
  });

  return (
    <main className="min-h-screen bg-[#050711] text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6">
        <p className="mb-4 text-center text-sm uppercase tracking-[0.4em] text-slate-400">
          ChronoForge
        </p>

        <h1 className="mx-auto max-w-4xl text-center text-5xl font-semibold tracking-tight md:text-7xl">
          Turn Ambition Into Architecture.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-300">
          A future-simulation platform that transforms goals into timelines,
          milestone systems, deadline-risk analysis, and progress projections.
        </p>

        <div className="mx-auto mt-12 grid w-full max-w-4xl gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-slate-400">Projected Completion</p>
            <p className="mt-2 text-3xl font-semibold">
              {demoProjection.projectedDays} days
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-slate-400">Deadline Risk</p>
            <p className="mt-2 text-3xl font-semibold">
              {demoProjection.deadlineRisk}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-slate-400">Required Weekly Hours</p>
            <p className="mt-2 text-3xl font-semibold">
              {demoProjection.requiredWeeklyHours}h
            </p>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate-400">
          {demoProjection.recommendation}
        </p>
        <div className="mt-8 flex justify-center">
  <a
    href="/create"
    className="rounded-full border border-white/10 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
  >
    Forge My Timeline
  </a>
</div>
        <div className="mt-8 flex justify-center">
  <a
    href="/create"
    className="rounded-full border border-white/10 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
  >
    Forge My Timeline
  </a>
</div>
      </section>
    </main>
  );
}