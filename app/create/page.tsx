"use client";

import { useState } from "react";
import { calculateProjection } from "@/lib/chrono-engine";

export default function CreateGoalPage() {
  const [goalTitle, setGoalTitle] = useState("Build ChronoForge MVP");
  const [totalEstimatedHours, setTotalEstimatedHours] = useState(120);
  const [availableHoursPerWeek, setAvailableHoursPerWeek] = useState(12);
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(60);

  const projection = calculateProjection({
    totalEstimatedHours,
    availableHoursPerWeek,
    daysUntilDeadline,
  });

  return (
    <main className="min-h-screen bg-[#050711] px-6 py-16 text-white">
      <section className="mx-auto max-w-6xl">
        <a
  href="/"
  className="mb-8 inline-flex text-sm text-slate-400 transition hover:text-white"
>
  ← Back to ChronoForge
</a>
        <a
  href="/"
  className="mb-8 inline-flex text-sm text-slate-400 transition hover:text-white"
>
  ← Back to ChronoForge
</a>
        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-slate-400">
          Goal Architect
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
          Forge a timeline from ambition.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Enter the shape of your goal. ChronoForge will calculate whether your
          current pace can realistically meet your deadline.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold">Goal Input</h2>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm text-slate-400">Goal Title</span>
                <input
                  value={goalTitle}
                  onChange={(event) => setGoalTitle(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-slate-400"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">
                  Total Estimated Hours
                </span>
                <input
                  type="number"
                  value={totalEstimatedHours}
                  onChange={(event) =>
                    setTotalEstimatedHours(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-slate-400"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">
                  Available Hours Per Week
                </span>
                <input
                  type="number"
                  value={availableHoursPerWeek}
                  onChange={(event) =>
                    setAvailableHoursPerWeek(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-slate-400"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">
                  Days Until Deadline
                </span>
                <input
                  type="number"
                  value={daysUntilDeadline}
                  onChange={(event) =>
                    setDaysUntilDeadline(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-slate-400"
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Projection
            </p>

            <h2 className="mt-4 text-3xl font-semibold">{goalTitle}</h2>

            <div className="mt-8 space-y-4">
              <ProjectionRow
                label="Projected Completion"
                value={`${projection.projectedDays} days`}
              />

              <ProjectionRow
                label="Deadline Risk"
                value={projection.deadlineRisk}
              />

              <ProjectionRow
                label="Required Weekly Hours"
                value={`${projection.requiredWeeklyHours}h`}
              />

              <ProjectionRow
                label="Drift"
                value={`${projection.driftPercentage}%`}
              />

              <ProjectionRow
                label="Burnout Risk"
                value={projection.burnoutRisk}
              />

              <ProjectionRow
                label="Recovery Buffer"
                value={`${projection.recoveryBufferDays} days`}
              />

              <ProjectionRow
                label="Scope Reduction Needed"
                value={`${projection.scopeReductionNeeded}%`}
              />
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
              <p className="text-sm leading-7 text-slate-300">
                {projection.recommendation}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProjectionRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}