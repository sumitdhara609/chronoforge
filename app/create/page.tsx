"use client";

import { useState } from "react";
import { calculateProjection, type RiskLevel } from "@/lib/chrono-engine";
import {
  analyzeTimelinePressure,
  generateTimelinePhases,
} from "@/lib/timeline-generator";

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

  const timelinePhases = generateTimelinePhases(totalEstimatedHours);
  const timelinePressure = analyzeTimelinePressure(timelinePhases);
  const displayGoalTitle = goalTitle.trim() || "Untitled Timeline";

  return (
    <main className="min-h-screen bg-[#050711] px-6 py-16 text-white">
      <section className="mx-auto max-w-6xl">
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
                  placeholder="Example: Build ChronoForge MVP"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Name the future you are trying to build.
                </p>
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">
                  Total Estimated Hours
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={totalEstimatedHours}
                  onChange={(event) =>
                    setTotalEstimatedHours(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-slate-400"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Estimate the total focused hours needed to complete this goal.
                </p>
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">
                  Available Hours Per Week
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={availableHoursPerWeek}
                  onChange={(event) =>
                    setAvailableHoursPerWeek(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-slate-400"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Be realistic. ChronoForge works best when your weekly capacity
                  is honest.
                </p>
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">
                  Days Until Deadline
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={daysUntilDeadline}
                  onChange={(event) =>
                    setDaysUntilDeadline(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-slate-400"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Enter the number of days left before the goal must be
                  completed.
                </p>
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Projection
                </p>

                <h2 className="mt-4 text-3xl font-semibold">
                  {displayGoalTitle}
                </h2>
              </div>

              <RiskBadge value={projection.deadlineRisk} />
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-black/30 p-6">
              <p className="text-sm text-slate-400">Projected Completion</p>

              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-tight">
                  {projection.projectedDays}
                </span>
                <span className="pb-2 text-slate-400">days</span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {projection.recommendation}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <ProjectionRow
                label="Deadline Risk"
                value={projection.deadlineRisk}
                tone={projection.deadlineRisk}
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
                tone={projection.burnoutRisk}
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
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Timeline Preview
              </p>

              <h2 className="mt-3 text-3xl font-semibold">
                A first architecture of your goal.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              ChronoForge divides the goal into phases so your ambition becomes
              easier to understand, sequence, and execute.
            </p>
          </div>

<div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
    Pressure Indicator
  </p>

  <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div>
      <p className="text-sm text-slate-400">Highest Pressure Phase</p>
      <h3 className="mt-2 text-3xl font-semibold">
        {timelinePressure.highestPressurePhase.title}
      </h3>
    </div>

    <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold">
      {timelinePressure.highestPressurePhase.estimatedHours}h ·{" "}
      {timelinePressure.highestPressurePhase.percentage}%
    </div>
  </div>

  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
    {timelinePressure.summary}
  </p>
</div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {timelinePhases.map((phase, index) => (
              <div
                key={phase.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Phase {index + 1}
                </p>

                <h3 className="mt-4 text-xl font-semibold">{phase.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {phase.description}
                </p>

                <div className="mt-5">
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-white/70"
                      style={{ width: `${phase.percentage}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {phase.percentage}% of estimated effort · {phase.estimatedHours}h
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProjectionRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: RiskLevel;
}) {
  const toneClass = getRiskToneClass(tone);

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>

      <span
        className={`rounded-full px-3 py-1 text-sm font-semibold ${toneClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function RiskBadge({ value }: { value: RiskLevel }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getRiskToneClass(
        value
      )}`}
    >
      {value}
    </span>
  );
}

function getRiskToneClass(tone?: RiskLevel) {
  if (tone === "LOW") {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (tone === "MEDIUM") {
    return "bg-amber-500/10 text-amber-300";
  }

  if (tone === "HIGH") {
    return "bg-rose-500/10 text-rose-300";
  }

  return "text-white";
}