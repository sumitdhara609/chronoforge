import { BackgroundOrbs } from "@/components/background-orbs";
import { PremiumButton } from "@/components/premium-button";
import { SiteFooter } from "@/components/site-footer";
import { calculateProjection, type RiskLevel } from "@/lib/chrono-engine";
import { calculateChronoScore } from "@/lib/chrono-score";
import { diagnoseExecution } from "@/lib/diagnosis-engine";
import {
  analyzeTimelinePressure,
  generateTimelinePhases,
} from "@/lib/timeline-generator";

const demoGoal = {
  title: "Launch a Recruiter-Ready SaaS Prototype",
  totalEstimatedHours: 240,
  availableHoursPerWeek: 18,
  daysUntilDeadline: 75,
};

export default function DemoPage() {
  const projection = calculateProjection({
    totalEstimatedHours: demoGoal.totalEstimatedHours,
    availableHoursPerWeek: demoGoal.availableHoursPerWeek,
    daysUntilDeadline: demoGoal.daysUntilDeadline,
  });

  const chronoScore = calculateChronoScore(projection);
  const diagnosis = diagnoseExecution(projection);
  const phases = generateTimelinePhases(demoGoal.totalEstimatedHours);
  const pressure = analyzeTimelinePressure(phases);

  const scenarios = [
    {
      title: "Current Pace",
      description: "The original execution capacity for this goal.",
      weeklyHours: demoGoal.availableHoursPerWeek,
    },
    {
      title: "Protected Pace",
      description: "A slightly stronger pace with better deadline control.",
      weeklyHours: Math.round(demoGoal.availableHoursPerWeek * 1.25),
    },
    {
      title: "Aggressive Pace",
      description: "A high-effort version that improves speed but increases pressure.",
      weeklyHours: Math.round(demoGoal.availableHoursPerWeek * 1.5),
    },
  ].map((scenario) => ({
    ...scenario,
    projection: calculateProjection({
      totalEstimatedHours: demoGoal.totalEstimatedHours,
      availableHoursPerWeek: scenario.weeklyHours,
      daysUntilDeadline: demoGoal.daysUntilDeadline,
    }),
  }));

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050711] px-5 py-12 text-white sm:px-6 sm:py-16">
      <BackgroundOrbs />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PremiumButton href="/" variant="ghost">
            Back to ChronoForge
          </PremiumButton>

          <div className="flex flex-col gap-3 sm:flex-row">
            <PremiumButton href="/create" variant="ghost">
              Build Your Own
            </PremiumButton>

            <PremiumButton href="/login">Save Timelines</PremiumButton>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_140px_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-8">
          <p className="text-sm uppercase tracking-[0.4em] text-violet-300">
            Public Recruiter Demo
          </p>

          <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                Experience ChronoForge without creating an account.
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                This demo shows how ChronoForge transforms a raw ambition into
                a structured execution forecast, planning score, diagnosis, and
                phase architecture.
              </p>
            </div>

            <div className="rounded-3xl border border-violet-400/20 bg-violet-400/10 p-5 shadow-[0_20px_90px_rgba(139,92,246,0.08)]">
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
                Demo Goal
              </p>

              <h2 className="mt-4 text-2xl font-semibold text-white">
                {demoGoal.title}
              </h2>

              <div className="mt-5 grid gap-3">
                <MiniMetric
                  label="Estimated Scope"
                  value={`${demoGoal.totalEstimatedHours}h`}
                />
                <MiniMetric
                  label="Weekly Capacity"
                  value={`${demoGoal.availableHoursPerWeek}h/week`}
                />
                <MiniMetric
                  label="Deadline"
                  value={`${demoGoal.daysUntilDeadline} days`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-violet-400/20 bg-violet-400/10 p-6 shadow-[0_20px_90px_rgba(139,92,246,0.08)] backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
                ChronoScore
              </p>

              <span className="w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                Grade {chronoScore.grade}
              </span>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-7xl font-semibold tracking-tight">
                {chronoScore.score}
              </span>
              <span className="pb-3 text-slate-400">/ 100</span>
            </div>

            <h2 className="mt-4 text-3xl font-semibold text-white">
              {chronoScore.label}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              {chronoScore.summary}
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Recruiter Signal
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                ChronoScore is a custom scoring layer built from deadline risk,
                burnout risk, recovery buffer, and scope pressure. It shows
                product logic beyond simple CRUD.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Forecast Metrics
            </p>

            <h2 className="mt-4 text-3xl font-semibold">
              What the timeline reveals.
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ReportMetric
                label="Projected Completion"
                value={`${projection.projectedDays} days`}
              />

              <ReportMetric
                label="Required Weekly Hours"
                value={`${projection.requiredWeeklyHours}h`}
              />

              <ReportMetric
                label="Deadline Risk"
                value={projection.deadlineRisk}
                tone={projection.deadlineRisk}
              />

              <ReportMetric
                label="Burnout Risk"
                value={projection.burnoutRisk}
                tone={projection.burnoutRisk}
              />

              <ReportMetric
                label="Recovery Buffer"
                value={`${projection.recoveryBufferDays} days`}
              />

              <ReportMetric
                label="Scope Reduction"
                value={`${projection.scopeReductionNeeded}%`}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-[0_20px_90px_rgba(34,211,238,0.08)] backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                Execution Diagnosis
              </p>

              <span className="w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                {diagnosis.severity}
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-semibold text-white">
              {diagnosis.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              {diagnosis.summary}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InsightCard
                label="Primary Problem"
                body={diagnosis.primaryProblem}
              />

              <InsightCard
                label="Recommended Action"
                body={diagnosis.recommendedAction}
                highlight
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Timeline Pressure
            </p>

            <h2 className="mt-4 text-3xl font-semibold">
              {pressure.highestPressurePhase.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              {pressure.summary}
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-slate-400">Highest Phase Load</p>

              <p className="mt-2 text-3xl font-semibold">
                {pressure.highestPressurePhase.estimatedHours}h
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Phase Architecture
              </p>

              <h2 className="mt-3 text-3xl font-semibold">
                How ChronoForge breaks the goal down.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              The platform converts a large ambition into execution phases,
              making the project easier to understand, sequence, and evaluate.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, index) => (
              <div
                key={phase.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:-translate-y-1 hover:border-white/20 hover:bg-black/30"
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
                    {phase.percentage}% of estimated effort ·{" "}
                    {phase.estimatedHours}h
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Scenario Simulator
              </p>

              <h2 className="mt-3 text-3xl font-semibold">
                Compare possible execution futures.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              ChronoForge tests alternate weekly-effort scenarios so users can
              understand how effort changes outcomes.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {scenarios.map((scenario) => (
              <div
                key={scenario.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:-translate-y-1 hover:border-white/20 hover:bg-black/30"
              >
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

                <div className="mt-4 grid gap-3">
                  <MiniMetric
                    label="Required Weekly Hours"
                    value={`${scenario.projection.requiredWeeklyHours}h`}
                  />

                  <MiniMetric
                    label="Drift"
                    value={`${scenario.projection.driftPercentage}%`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                Why This Project Matters
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                ChronoForge is built to show product thinking, not only coding.
              </h2>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">
                The app combines custom forecasting logic, authentication,
                private data storage, CRUD workflows, database analytics,
                scenario simulation, and a polished user experience. This public
                demo exists so reviewers can understand the product instantly.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm font-semibold text-white">
                Explore the full workflow
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Create an account to save timelines, open private reports, edit
                saved plans, and view vault-level intelligence.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <PremiumButton href="/create">Build a Timeline</PremiumButton>
                <PremiumButton href="/login" variant="ghost">
                  Login / Sign Up
                </PremiumButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </main>
  );
}

function ReportMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: RiskLevel;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-sm text-slate-400">{label}</p>

      <p className={`mt-2 text-2xl font-semibold ${getRiskTextClass(tone)}`}>
        {value}
      </p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function InsightCard({
  label,
  body,
  highlight,
}: {
  label: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-3 text-sm leading-6 ${
          highlight ? "text-cyan-100" : "text-slate-300"
        }`}
      >
        {body}
      </p>
    </div>
  );
}

function RiskBadge({ value }: { value: RiskLevel }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getRiskBadgeClass(
        value
      )}`}
    >
      {value}
    </span>
  );
}

function getRiskTextClass(tone?: RiskLevel) {
  if (tone === "LOW") return "text-emerald-300";
  if (tone === "MEDIUM") return "text-amber-300";
  if (tone === "HIGH") return "text-rose-300";
  return "text-white";
}

function getRiskBadgeClass(tone: RiskLevel) {
  if (tone === "LOW") return "bg-emerald-500/10 text-emerald-300";
  if (tone === "MEDIUM") return "bg-amber-500/10 text-amber-300";
  return "bg-rose-500/10 text-rose-300";
}