import { redirect } from "next/navigation";
import { AuthNavigation } from "@/components/auth-navigation";
import { BackgroundOrbs } from "@/components/background-orbs";
import { CopySummaryButton } from "@/components/copy-summary-button";
import { DeleteTimelineButton } from "@/components/delete-timeline-button";
import { PremiumButton } from "@/components/premium-button";
import { SiteFooter } from "@/components/site-footer";
import { calculateProjection } from "@/lib/chrono-engine";
import { calculateChronoScore } from "@/lib/chrono-score";
import { diagnoseExecution } from "@/lib/diagnosis-engine";
import { createClient } from "@/lib/supabase/server";

type Timeline = {
  id: string;
  goal_title: string;
  total_estimated_hours: number;
  available_hours_per_week: number;
  days_until_deadline: number;
  created_at: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: timelines, error } = await supabase
    .from("timelines")
    .select(
      "id, goal_title, total_estimated_hours, available_hours_per_week, days_until_deadline, created_at"
    )
    .order("created_at", { ascending: false });

  const savedTimelines = (timelines ?? []) as Timeline[];

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050711] px-5 py-12 text-white sm:px-6 sm:py-16">
      <BackgroundOrbs />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <PremiumButton href="/" variant="ghost">
            Back to ChronoForge
          </PremiumButton>

          <AuthNavigation />
        </div>

        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-slate-400">
          Private Workspace
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Your ChronoForge dashboard.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          You are logged in as{" "}
          <span className="font-medium text-white">{user.email}</span>. Your
          saved timelines are stored securely with your account.
        </p>

        <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 shadow-[0_20px_90px_rgba(16,185,129,0.08)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Active Session
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-white">
            You are signed in securely.
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Your private timeline vault is linked to{" "}
            <span className="font-medium text-white">{user.email}</span>. Only
            this account can access its saved goal architectures.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Timeline Vault
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Saved goal architectures.
              </h2>
            </div>

            <div className="w-fit rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-300">
              {savedTimelines.length} saved
            </div>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm leading-7 text-rose-200">
              {error.message}
            </div>
          ) : savedTimelines.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6">
              <h3 className="text-2xl font-semibold">
                No timelines saved yet.
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Create your first goal architecture, save it securely, and it
                will appear here inside your private timeline vault.
              </p>

              <div className="mt-6">
                <PremiumButton href="/create">
                  Create First Timeline
                </PremiumButton>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {savedTimelines.map((timeline) => (
                <TimelineCard key={timeline.id} timeline={timeline} />
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

function TimelineCard({ timeline }: { timeline: Timeline }) {
  const projection = calculateProjection({
    totalEstimatedHours: timeline.total_estimated_hours,
    availableHoursPerWeek: timeline.available_hours_per_week,
    daysUntilDeadline: timeline.days_until_deadline,
  });

  const diagnosis = diagnoseExecution(projection);
  const chronoScore = calculateChronoScore(projection);

  const copyableSummary = [
    "ChronoForge Timeline Summary",
    "",
    `Goal: ${timeline.goal_title}`,
    `ChronoScore: ${chronoScore.score}/100`,
    `Grade: ${chronoScore.grade}`,
    `Score Label: ${chronoScore.label}`,
    "",
    `Projected Completion: ${projection.projectedDays} days`,
    `Deadline Risk: ${projection.deadlineRisk}`,
    `Burnout Risk: ${projection.burnoutRisk}`,
    `Required Weekly Hours: ${projection.requiredWeeklyHours}h`,
    `Recovery Buffer: ${projection.recoveryBufferDays} days`,
    `Scope Reduction Needed: ${projection.scopeReductionNeeded}%`,
    "",
    `Diagnosis: ${diagnosis.title}`,
    `Severity: ${diagnosis.severity}`,
    `Primary Problem: ${diagnosis.primaryProblem}`,
    `Recommended Action: ${diagnosis.recommendedAction}`,
  ].join("\n");

  const createdDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(timeline.created_at));

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/30 hover:shadow-[0_20px_80px_rgba(255,255,255,0.06)]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Saved {createdDate}
          </p>

          <h3 className="mt-4 text-2xl font-semibold">
            {timeline.goal_title}
          </h3>
        </div>

        <div className="w-fit rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
          {chronoScore.score}/100
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4 shadow-[0_20px_70px_rgba(139,92,246,0.06)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-[0.25em] text-violet-300">
            ChronoScore
          </p>

          <span className="w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
            Grade {chronoScore.grade}
          </span>
        </div>

        <div className="mt-4 flex items-end gap-2">
          <span className="text-4xl font-semibold tracking-tight">
            {chronoScore.score}
          </span>
          <span className="pb-1 text-sm text-slate-400">/ 100</span>
        </div>

        <h4 className="mt-3 text-lg font-semibold text-white">
          {chronoScore.label}
        </h4>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {chronoScore.summary}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MiniMetric
          label="Projected"
          value={`${projection.projectedDays} days`}
        />

        <MiniMetric label="Risk" value={projection.deadlineRisk} />

        <MiniMetric
          label="Weekly Need"
          value={`${projection.requiredWeeklyHours}h`}
        />

        <MiniMetric
          label="Current Capacity"
          value={`${timeline.available_hours_per_week}h/week`}
        />
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-400">
        {projection.recommendation}
      </p>

      <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 shadow-[0_20px_70px_rgba(34,211,238,0.06)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
            Execution Diagnosis
          </p>

          <span className="w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
            {diagnosis.severity}
          </span>
        </div>

        <h4 className="mt-3 text-lg font-semibold text-white">
          {diagnosis.title}
        </h4>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {diagnosis.primaryProblem}
        </p>

        <p className="mt-3 text-sm leading-6 text-cyan-100">
          {diagnosis.recommendedAction}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={`/dashboard/${timeline.id}`}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            View Report
          </a>

          <CopySummaryButton summary={copyableSummary} />
        </div>

        <DeleteTimelineButton timelineId={timeline.id} />
      </div>
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