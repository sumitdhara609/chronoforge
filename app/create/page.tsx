"use client";

import { useState } from "react";
import { BackgroundOrbs } from "@/components/background-orbs";
import { HoverInsight } from "@/components/hover-insight";
import { PremiumButton } from "@/components/premium-button";
import { SaveTimelineButton } from "@/components/save-timeline-button";
import { SiteFooter } from "@/components/site-footer";
import { calculateProjection, type RiskLevel } from "@/lib/chrono-engine";
import { diagnoseExecution } from "@/lib/diagnosis-engine";
import {
  analyzeTimelinePressure,
  generateTimelinePhases,
} from "@/lib/timeline-generator";

export default function CreateGoalPage() {
  const [goalTitle, setGoalTitle] = useState("");
  const [totalEstimatedHours, setTotalEstimatedHours] = useState("");
  const [availableHoursPerWeek, setAvailableHoursPerWeek] = useState("");
  const [daysUntilDeadline, setDaysUntilDeadline] = useState("");

  const safeTotalEstimatedHours = toPositiveNumber(totalEstimatedHours);
  const safeAvailableHoursPerWeek = toPositiveNumber(availableHoursPerWeek);
  const safeDaysUntilDeadline = toPositiveNumber(daysUntilDeadline);

  const projection = calculateProjection({
    totalEstimatedHours: safeTotalEstimatedHours,
    availableHoursPerWeek: safeAvailableHoursPerWeek,
    daysUntilDeadline: safeDaysUntilDeadline,
  });

  const diagnosis = diagnoseExecution(projection);

  const scenarios = [
    {
      title: "Current Pace",
      description: "Your present weekly capacity.",
      weeklyHours: safeAvailableHoursPerWeek,
    },
    {
      title: "Focused Pace",
      description: "A stronger but still realistic effort increase.",
      weeklyHours: Math.max(
        1,
        Math.round(safeAvailableHoursPerWeek * 1.25)
      ),
    },
    {
      title: "Intense Pace",
      description: "A high-pressure version of the same goal.",
      weeklyHours: Math.max(1, Math.round(safeAvailableHoursPerWeek * 1.5)),
    },
  ].map((scenario) => ({
    ...scenario,
    projection: calculateProjection({
      totalEstimatedHours: safeTotalEstimatedHours,
      availableHoursPerWeek: scenario.weeklyHours,
      daysUntilDeadline: safeDaysUntilDeadline,
    }),
  }));

  const timelinePhases = generateTimelinePhases(safeTotalEstimatedHours);
  const timelinePressure = analyzeTimelinePressure(timelinePhases);
  const displayGoalTitle = goalTitle.trim() || "Untitled Timeline";

  const hasUserInput =
    goalTitle.trim().length > 0 ||
    totalEstimatedHours.trim().length > 0 ||
    availableHoursPerWeek.trim().length > 0 ||
    daysUntilDeadline.trim().length > 0;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050711] px-5 py-12 text-white sm:px-6 sm:py-16">
      <BackgroundOrbs />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8">
          <PremiumButton href="/" variant="ghost">
            Back to ChronoForge
          </PremiumButton>
        </div>

        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-slate-400">
          Goal Architect
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Forge a timeline from ambition.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          Enter the shape of your goal. ChronoForge will calculate whether your
          current pace can realistically meet your deadline.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            ChronoForge v0.2 Prototype
          </p>

          <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-white">
            Designed to prevent deadline drift before it becomes failure.
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400">
            This workspace helps you test whether your ambition, time, and
            execution capacity are aligned before you commit to a plan.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[1fr_0.9fr] lg:gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold">Goal Input</h2>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm text-slate-400">Goal Title</span>
                <input
                  value={goalTitle}
                  onChange={(event) => setGoalTitle(event.target.value)}
                  placeholder="Example: Build my portfolio website"
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
                    setTotalEstimatedHours(event.target.value)
                  }
                  placeholder="Example: 120"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
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
                    setAvailableHoursPerWeek(event.target.value)
                  }
                  placeholder="Example: 12"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
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
                    setDaysUntilDeadline(event.target.value)
                  }
                  placeholder="Example: 60"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
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

            {!hasUserInput ? (
              <div className="mt-8 rounded-3xl border border-white/10 bg-black/30 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Waiting for Input
                </p>

                <h3 className="mt-4 text-3xl font-semibold">
                  Start by entering your goal.
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Once you enter your estimated effort, weekly capacity, and
                  deadline, ChronoForge will generate a realistic timeline
                  projection.
                </p>
              </div>
            ) : (
              <>
                <HoverInsight insight="This is the central ChronoEngine forecast: how long your goal may take at your current pace.">
                  <div className="mt-8 rounded-3xl border border-white/10 bg-black/30 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/40 hover:shadow-[0_20px_80px_rgba(255,255,255,0.06)]">
                    <p className="text-sm text-slate-400">
                      Projected Completion
                    </p>

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
                </HoverInsight>

                <div className="mt-6 space-y-4">
                  <ProjectionRow
                    label="Deadline Risk"
                    value={projection.deadlineRisk}
                    tone={projection.deadlineRisk}
                    insight="Deadline Risk compares your available weekly capacity with the weekly effort required to finish on time."
                  />

                  <ProjectionRow
                    label="Required Weekly Hours"
                    value={`${projection.requiredWeeklyHours}h`}
                    insight="This is the weekly effort needed to complete the goal within the selected deadline."
                  />

                  <ProjectionRow
                    label="Drift"
                    value={`${projection.driftPercentage}%`}
                    insight="Drift shows how far your projected timeline is moving away from the target deadline."
                  />

                  <ProjectionRow
                    label="Burnout Risk"
                    value={projection.burnoutRisk}
                    tone={projection.burnoutRisk}
                    insight="Burnout Risk estimates whether the required weekly effort may become too intense."
                  />

                  <ProjectionRow
                    label="Recovery Buffer"
                    value={`${projection.recoveryBufferDays} days`}
                    insight="Recovery Buffer shows how much margin the plan has before missed days begin damaging the timeline."
                  />

                  <ProjectionRow
                    label="Scope Reduction Needed"
                    value={`${projection.scopeReductionNeeded}%`}
                    insight="This estimates how much scope may need to be reduced if your current pace cannot meet the deadline."
                  />
                </div>

                <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 shadow-[0_20px_90px_rgba(34,211,238,0.08)] backdrop-blur-xl">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                      Execution Diagnosis
                    </p>

                    <span className="w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                      {diagnosis.severity}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold text-white">
                    {diagnosis.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {diagnosis.summary}
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        Primary Problem
                      </p>

                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {diagnosis.primaryProblem}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        Recommended Action
                      </p>

                      <p className="mt-3 text-sm leading-6 text-cyan-100">
                        {diagnosis.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>

                <SaveTimelineButton
                  goalTitle={displayGoalTitle}
                  totalEstimatedHours={safeTotalEstimatedHours}
                  availableHoursPerWeek={safeAvailableHoursPerWeek}
                  daysUntilDeadline={safeDaysUntilDeadline}
                />
              </>
            )}
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

          {!hasUserInput ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm leading-7 text-slate-400">
                Timeline phases will appear here after you enter your goal
                details.
              </p>
            </div>
          ) : (
            <>
              <HoverInsight insight="The Pressure Indicator identifies the heaviest phase in your timeline, where execution difficulty is most likely to concentrate.">
                <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/40 hover:shadow-[0_20px_80px_rgba(255,255,255,0.06)]">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                    Pressure Indicator
                  </p>

                  <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                      <p className="text-sm text-slate-400">
                        Highest Pressure Phase
                      </p>
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
              </HoverInsight>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {timelinePhases.map((phase, index) => (
                  <HoverInsight
                    key={phase.title}
                    insight={`${phase.title} carries ${phase.estimatedHours}h of estimated effort in this timeline architecture.`}
                  >
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/30 hover:shadow-[0_20px_80px_rgba(255,255,255,0.06)]">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Phase {index + 1}
                      </p>

                      <h3 className="mt-4 text-xl font-semibold">
                        {phase.title}
                      </h3>

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
                          {phase.percentage}% of estimated effort ·{" "}
                          {phase.estimatedHours}h
                        </p>
                      </div>
                    </div>
                  </HoverInsight>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Scenario Simulator
              </p>

              <h2 className="mt-3 text-3xl font-semibold">
                Compare the futures your effort can create.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              ChronoForge tests alternate weekly-effort scenarios so you can see
              how pace changes projected completion and deadline risk.
            </p>
          </div>

          {!hasUserInput ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm leading-7 text-slate-400">
                Scenario comparisons will activate after you enter your timeline
                inputs.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {scenarios.map((scenario) => (
                <HoverInsight
                  key={scenario.title}
                  insight={`${scenario.title} shows what happens if your weekly effort becomes ${scenario.weeklyHours} hours per week.`}
                >
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/30 hover:shadow-[0_20px_80px_rgba(255,255,255,0.06)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          {scenario.weeklyHours}h/week
                        </p>

                        <h3 className="mt-4 text-xl font-semibold">
                          {scenario.title}
                        </h3>
                      </div>

                      <RiskBadge value={scenario.projection.deadlineRisk} />
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {scenario.description}
                    </p>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                      <p className="text-sm text-slate-400">
                        Projected Completion
                      </p>

                      <p className="mt-2 text-3xl font-semibold">
                        {scenario.projection.projectedDays} days
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      <ProjectionRow
                        label="Required Weekly Hours"
                        value={`${scenario.projection.requiredWeeklyHours}h`}
                      />

                      <ProjectionRow
                        label="Drift"
                        value={`${scenario.projection.driftPercentage}%`}
                      />
                    </div>
                  </div>
                </HoverInsight>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </main>
  );
}

function ProjectionRow({
  label,
  value,
  tone,
  insight,
}: {
  label: string;
  value: string;
  tone?: RiskLevel;
  insight?: string;
}) {
  const toneClass = getRiskToneClass(tone);

  const row = (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition duration-300 hover:border-white/20 hover:bg-black/30 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-400">{label}</span>

      <span
        className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${toneClass}`}
      >
        {value}
      </span>
    </div>
  );

  if (!insight) {
    return row;
  }

  return <HoverInsight insight={insight}>{row}</HoverInsight>;
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

function toPositiveNumber(value: string) {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return 1;
  }

  return number;
}