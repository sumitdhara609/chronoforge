import { redirect } from "next/navigation";
import { BackgroundOrbs } from "@/components/background-orbs";
import { PremiumButton } from "@/components/premium-button";
import { SiteFooter } from "@/components/site-footer";
import { TimelineCompareSelector } from "@/components/timeline-compare-selector";
import { calculateProjection, type RiskLevel } from "@/lib/chrono-engine";
import { calculateChronoScore } from "@/lib/chrono-score";
import {
  compareTimelines,
  type ComparisonTimeline,
} from "@/lib/comparison-engine";
import { createClient } from "@/lib/supabase/server";

type Timeline = {
  id: string;
  goal_title: string;
  total_estimated_hours: number;
  available_hours_per_week: number;
  days_until_deadline: number;
  created_at: string;
};

type CompareTimelinesPageProps = {
  searchParams: Promise<{
    first?: string;
    second?: string;
  }>;
};

export default async function CompareTimelinesPage({
  searchParams,
}: CompareTimelinesPageProps) {
  const { first, second } = await searchParams;

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

  const analyzedTimelines = savedTimelines.map((timeline) => {
    const projection = calculateProjection({
      totalEstimatedHours: timeline.total_estimated_hours,
      availableHoursPerWeek: timeline.available_hours_per_week,
      daysUntilDeadline: timeline.days_until_deadline,
    });

    const chronoScore = calculateChronoScore(projection);

    return {
      id: timeline.id,
      goal_title: timeline.goal_title,
      projection,
      chronoScore,
    } satisfies ComparisonTimeline;
  });

  const fallbackFirst = analyzedTimelines[0];
  const fallbackSecond = analyzedTimelines[1];

  const selectedFirstTimeline =
    analyzedTimelines.find((timeline) => timeline.id === first) ??
    fallbackFirst;

  const selectedSecondTimeline =
    analyzedTimelines.find((timeline) => timeline.id === second) ??
    fallbackSecond;

  const hasValidSelection =
    selectedFirstTimeline &&
    selectedSecondTimeline &&
    selectedFirstTimeline.id !== selectedSecondTimeline.id;

  const verdict = hasValidSelection
    ? compareTimelines(selectedFirstTimeline, selectedSecondTimeline)
    : null;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050711] px-5 py-12 text-white sm:px-6 sm:py-16">
      <BackgroundOrbs />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8">
          <PremiumButton href="/dashboard" variant="ghost">
            Back to Dashboard
          </PremiumButton>
        </div>

        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-slate-400">
          Timeline Comparison
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Compare execution paths before choosing one.
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          ChronoForge compares saved timelines across planning score, deadline
          pressure, burnout risk, required weekly effort, recovery buffer, and
          scope realism.
        </p>

        {error ? (
          <div className="mt-10 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-sm leading-7 text-rose-200">
            {error.message}
          </div>
        ) : analyzedTimelines.length < 2 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-3xl font-semibold text-white">
              Save at least two timelines to compare.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              The comparison engine needs two saved goal architectures. Create
              and save another timeline, then return here to compare execution
              paths.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PremiumButton href="/create">Create Timeline</PremiumButton>

              <PremiumButton href="/dashboard" variant="ghost">
                View Dashboard
              </PremiumButton>
            </div>
          </div>
        ) : verdict && selectedFirstTimeline && selectedSecondTimeline ? (
          <>
            <div className="mt-10">
              <TimelineCompareSelector
                timelines={savedTimelines.map((timeline) => ({
                  id: timeline.id,
                  goal_title: timeline.goal_title,
                }))}
                selectedFirstId={selectedFirstTimeline.id}
                selectedSecondId={selectedSecondTimeline.id}
              />
            </div>

            <div className="mt-8 rounded-3xl border border-violet-400/20 bg-violet-400/10 p-6 shadow-[0_20px_90px_rgba(139,92,246,0.08)] backdrop-blur-xl">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
                    Comparison Verdict
                  </p>

                  <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-white">
                    {verdict.title}
                  </h2>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                    {verdict.summary}
                  </p>
                </div>

                <div className="w-fit rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-violet-100">
                  {verdict.winner ? "Clearer Path Found" : "Balanced Match"}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InsightCard
                  label="Strongest Signal"
                  body={verdict.strongestSignal}
                />

                <InsightCard
                  label="Weakest Signal"
                  body={verdict.weakestSignal}
                  highlight
                />
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <ComparisonCard
                timeline={selectedFirstTimeline}
                label="Timeline A"
              />

              <ComparisonCard
                timeline={selectedSecondTimeline}
                label="Timeline B"
              />
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                    Side-by-Side Metrics
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold">
                    Where the timelines differ.
                  </h2>
                </div>

                <p className="max-w-md text-sm leading-7 text-slate-400">
                  A timeline may win by score, but the detailed metrics reveal
                  why the execution structure is stronger or weaker.
                </p>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
                <ComparisonRow
                  label="ChronoScore"
                  first={`${selectedFirstTimeline.chronoScore.score}/100`}
                  second={`${selectedSecondTimeline.chronoScore.score}/100`}
                />

                <ComparisonRow
                  label="Grade"
                  first={selectedFirstTimeline.chronoScore.grade}
                  second={selectedSecondTimeline.chronoScore.grade}
                />

                <ComparisonRow
                  label="Projected Completion"
                  first={`${selectedFirstTimeline.projection.projectedDays} days`}
                  second={`${selectedSecondTimeline.projection.projectedDays} days`}
                />

                <ComparisonRow
                  label="Deadline Risk"
                  first={selectedFirstTimeline.projection.deadlineRisk}
                  second={selectedSecondTimeline.projection.deadlineRisk}
                />

                <ComparisonRow
                  label="Burnout Risk"
                  first={selectedFirstTimeline.projection.burnoutRisk}
                  second={selectedSecondTimeline.projection.burnoutRisk}
                />

                <ComparisonRow
                  label="Required Weekly Hours"
                  first={`${selectedFirstTimeline.projection.requiredWeeklyHours}h`}
                  second={`${selectedSecondTimeline.projection.requiredWeeklyHours}h`}
                />

                <ComparisonRow
                  label="Recovery Buffer"
                  first={`${selectedFirstTimeline.projection.recoveryBufferDays} days`}
                  second={`${selectedSecondTimeline.projection.recoveryBufferDays} days`}
                />

                <ComparisonRow
                  label="Scope Reduction Needed"
                  first={`${selectedFirstTimeline.projection.scopeReductionNeeded}%`}
                  second={`${selectedSecondTimeline.projection.scopeReductionNeeded}%`}
                />
              </div>
            </div>
          </>
        ) : null}
      </section>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </main>
  );
}

function ComparisonCard({
  timeline,
  label,
}: {
  timeline: ComparisonTimeline;
  label: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            {label}
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-white">
            {timeline.goal_title}
          </h2>
        </div>

        <span className="w-fit rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
          {timeline.chronoScore.score}/100
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-5">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
          ChronoScore
        </p>

        <div className="mt-4 flex items-end gap-2">
          <span className="text-5xl font-semibold tracking-tight">
            {timeline.chronoScore.score}
          </span>
          <span className="pb-2 text-slate-400">/ 100</span>
        </div>

        <h3 className="mt-3 text-xl font-semibold text-white">
          {timeline.chronoScore.label}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          {timeline.chronoScore.summary}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MiniMetric
          label="Deadline Risk"
          value={timeline.projection.deadlineRisk}
          tone={timeline.projection.deadlineRisk}
        />

        <MiniMetric
          label="Burnout Risk"
          value={timeline.projection.burnoutRisk}
          tone={timeline.projection.burnoutRisk}
        />

        <MiniMetric
          label="Projected"
          value={`${timeline.projection.projectedDays} days`}
        />

        <MiniMetric
          label="Weekly Need"
          value={`${timeline.projection.requiredWeeklyHours}h`}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={`/dashboard/${timeline.id}`}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10"
        >
          Open Report
        </a>

        <a
          href={`/dashboard/${timeline.id}/edit`}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10"
        >
          Edit Timeline
        </a>
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  first,
  second,
}: {
  label: string;
  first: string;
  second: string;
}) {
  return (
    <div className="grid gap-0 border-b border-white/10 bg-black/20 last:border-b-0 md:grid-cols-3">
      <div className="border-b border-white/10 px-4 py-4 md:border-b-0 md:border-r md:border-white/10">
        <p className="text-sm text-slate-400">{label}</p>
      </div>

      <div className="border-b border-white/10 px-4 py-4 md:border-b-0 md:border-r md:border-white/10">
        <p className="text-sm font-semibold text-white">{first}</p>
      </div>

      <div className="px-4 py-4">
        <p className="text-sm font-semibold text-white">{second}</p>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: RiskLevel;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>

      <p className={`mt-1 font-semibold ${getRiskTextClass(tone)}`}>
        {value}
      </p>
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
          highlight ? "text-violet-100" : "text-slate-300"
        }`}
      >
        {body}
      </p>
    </div>
  );
}

function getRiskTextClass(tone?: RiskLevel) {
  if (tone === "LOW") return "text-emerald-300";
  if (tone === "MEDIUM") return "text-amber-300";
  if (tone === "HIGH") return "text-rose-300";
  return "text-white";
}