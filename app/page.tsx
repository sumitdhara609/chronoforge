import { AuthNavigation } from "@/components/auth-navigation";
import { BackgroundOrbs } from "@/components/background-orbs";
import { HoverInsight } from "@/components/hover-insight";
import { PremiumButton } from "@/components/premium-button";
import { ProductIdentityStrip } from "@/components/product-identity-strip";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050711] text-white">
      <BackgroundOrbs />

      <header className="fixed left-0 right-0 top-0 z-50 px-5 py-5 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/25 px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <a
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300 transition hover:text-white"
          >
            ChronoForge
          </a>

          <AuthNavigation />
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        <p className="mb-4 text-center text-sm uppercase tracking-[0.4em] text-slate-400">
          ChronoForge
        </p>

        <h1 className="mx-auto max-w-4xl text-center text-4xl font-semibold tracking-tight sm:text-5xl md:text-7xl">
          Turn Ambition Into Architecture.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          A future-simulation platform that helps people plan serious goals
          with realistic timelines, deadline-risk analysis, effort allocation,
          and scenario forecasting before time breaks the plan.
        </p>

        <div className="mx-auto mt-12 grid w-full max-w-4xl gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6 md:grid-cols-3">
          <HeroPreviewCard
            label="Timeline Forecasting"
            value="Plan before pressure"
            insight="ChronoForge helps estimate how long a serious goal may take before the deadline starts becoming stressful."
          />

          <HeroPreviewCard
            label="Deadline Intelligence"
            value="Detect risk early"
            insight="Instead of discovering timeline failure too late, ChronoForge exposes deadline drift before execution begins."
          />

          <HeroPreviewCard
            label="Private Workspace"
            value="Login to save"
            insight="After signing in, users can save timelines securely and return to their private dashboard."
          />
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate-400">
          Create a timeline to generate your own projection. No personal goal
          data is shown here until you sign in and save it.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <PremiumButton href="/create" fullWidth>
            Forge My Timeline
          </PremiumButton>

          <PremiumButton href="/login" variant="secondary" fullWidth>
            Login to Save
          </PremiumButton>
        </div>
      </section>

      <div className="relative z-10 pb-16">
        <ProductIdentityStrip />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            The Real Problem
          </p>

          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
            Most plans fail before the work even begins.
          </h2>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
            People often underestimate scope, overestimate consistency, ignore
            recovery time, and discover deadline pressure only when it is too
            late. ChronoForge makes those risks visible early.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <RealityCard
              title="Unclear Scope"
              description="Goals feel simple until the hidden work becomes visible."
            />

            <RealityCard
              title="Deadline Drift"
              description="Small delays compound quietly until the original timeline collapses."
            />

            <RealityCard
              title="Burnout Pressure"
              description="Plans often demand more weekly effort than the user can sustain."
            />

            <RealityCard
              title="No Scenario Thinking"
              description="Most people never compare what happens at different effort levels."
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-24">
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

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-24">
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
            <div className="grid gap-4 sm:grid-cols-2">
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

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <PremiumButton href="/create" variant="secondary" fullWidth>
            Open Goal Architect
          </PremiumButton>

          <PremiumButton href="/dashboard" variant="secondary" fullWidth>
            View Dashboard
          </PremiumButton>
        </div>
      </section>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </main>
  );
}

function HeroPreviewCard({
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
        <p className="mt-2 text-2xl font-semibold">{value}</p>
      </div>
    </HoverInsight>
  );
}

function RealityCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <HoverInsight insight="ChronoForge is designed to expose this planning risk before it becomes expensive.">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/30 hover:shadow-[0_20px_80px_rgba(255,255,255,0.06)]">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
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