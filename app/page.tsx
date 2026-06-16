import { BackgroundOrbs } from "@/components/background-orbs";
import { HoverInsight } from "@/components/hover-insight";
import { PremiumButton } from "@/components/premium-button";
import { SiteFooter } from "@/components/site-footer";
import { calculateProjection } from "@/lib/chrono-engine";

export default function Home() {
  const demoProjection = calculateProjection({
    totalEstimatedHours: 120,
    availableHoursPerWeek: 12,
    daysUntilDeadline: 60,
  });

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050711] text-white">
      <BackgroundOrbs />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
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
          <MetricCard
            label="Projected Completion"
            value={`${demoProjection.projectedDays} days`}
            insight="ChronoEngine estimates how many days your goal may take based on effort and available weekly time."
          />

          <MetricCard
            label="Deadline Risk"
            value={demoProjection.deadlineRisk}
            insight="This risk level compares your available pace against the pace required to hit the deadline."
          />

          <MetricCard
            label="Required Weekly Hours"
            value={`${demoProjection.requiredWeeklyHours}h`}
            insight="This shows how many hours per week are needed to complete the goal within the target deadline."
          />
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate-400">
          {demoProjection.recommendation}
        </p>

        <div className="mt-8 flex justify-center">
          <PremiumButton href="/create">Forge My Timeline</PremiumButton>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            How It Works
          </p>

          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
            ChronoForge does not just list tasks. It simulates the pressure of
            time.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <ProcessCard
              step="01"
              title="Define the Goal"
              description="Enter your total estimated effort, weekly capacity, and deadline."
              insight="The system starts by understanding the shape of your ambition: effort, capacity, and time limit."
            />

            <ProcessCard
              step="02"
              title="Calculate the Future"
              description="ChronoEngine projects completion time, drift, required weekly hours, and risk."
              insight="ChronoEngine turns raw numbers into a future forecast, so you can see the pressure before it becomes a problem."
            />

            <ProcessCard
              step="03"
              title="Architect the Timeline"
              description="Your goal is divided into phases with effort allocation and pressure analysis."
              insight="The timeline breaks a large ambition into structured phases, making execution clearer and less chaotic."
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              ChronoEngine v0.1
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              The engine behind the timeline.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              ChronoEngine is the calculation layer that transforms raw goal
              inputs into realistic projections. It estimates whether your
              current pace can meet your deadline before the project starts
              drifting.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <EnginePoint
                title="Future Drift"
                value="Pace vs deadline"
                insight="Future Drift shows whether your projected finish is moving ahead of, aligned with, or behind the deadline."
              />

              <EnginePoint
                title="Deadline Risk"
                value="Low / Medium / High"
                insight="Deadline Risk translates time pressure into a simple signal that is easier to act on."
              />

              <EnginePoint
                title="Burnout Risk"
                value="Weekly pressure"
                insight="Burnout Risk looks at the weekly workload required and warns when the plan may become too intense."
              />

              <EnginePoint
                title="Recovery Buffer"
                value="Missed-day margin"
                insight="Recovery Buffer estimates how much room the timeline has before missed effort starts damaging the plan."
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <PremiumButton href="/create" variant="secondary">
            Open Goal Architect
          </PremiumButton>
        </div>
      </section>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  insight,
}: {
  label: string;
  value: string;
  insight: string;
}) {
  return (
    <HoverInsight insight={insight}>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/30 hover:shadow-[0_20px_80px_rgba(255,255,255,0.06)]">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
      </div>
    </HoverInsight>
  );
}

function ProcessCard({
  step,
  title,
  description,
  insight,
}: {
  step: string;
  title: string;
  description: string;
  insight: string;
}) {
  return (
    <HoverInsight insight={insight}>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/30 hover:shadow-[0_20px_80px_rgba(255,255,255,0.06)]">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {step}
        </p>

        <h3 className="mt-4 text-xl font-semibold">{title}</h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
      </div>
    </HoverInsight>
  );
}

function EnginePoint({
  title,
  value,
  insight,
}: {
  title: string;
  value: string;
  insight: string;
}) {
  return (
    <HoverInsight insight={insight}>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/30 hover:shadow-[0_20px_80px_rgba(255,255,255,0.06)]">
        <p className="text-sm text-slate-400">{title}</p>
        <p className="mt-2 text-xl font-semibold">{value}</p>
      </div>
    </HoverInsight>
  );
}