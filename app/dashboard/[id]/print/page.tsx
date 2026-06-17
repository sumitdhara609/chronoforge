import { notFound, redirect } from "next/navigation";
import { ExportTrackerButton } from "@/components/export-tracker-button";
import { calculateProjection } from "@/lib/chrono-engine";
import { calculateChronoScore } from "@/lib/chrono-score";
import { diagnoseExecution } from "@/lib/diagnosis-engine";
import { createClient } from "@/lib/supabase/server";
import {
  analyzeTimelinePressure,
  generateTimelinePhases,
} from "@/lib/timeline-generator";

type Timeline = {
  id: string;
  goal_title: string;
  total_estimated_hours: number;
  available_hours_per_week: number;
  days_until_deadline: number;
  created_at: string;
  updated_at: string;
  last_exported_at: string | null;
};

type PrintTimelinePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PrintTimelinePage({
  params,
}: PrintTimelinePageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: timeline, error } = await supabase
    .from("timelines")
    .select(
      "id, goal_title, total_estimated_hours, available_hours_per_week, days_until_deadline, created_at, updated_at, last_exported_at"
    )
    .eq("id", id)
    .single();

  if (error || !timeline) {
    notFound();
  }

  const savedTimeline = timeline as Timeline;

  const projection = calculateProjection({
    totalEstimatedHours: savedTimeline.total_estimated_hours,
    availableHoursPerWeek: savedTimeline.available_hours_per_week,
    daysUntilDeadline: savedTimeline.days_until_deadline,
  });

  const chronoScore = calculateChronoScore(projection);
  const diagnosis = diagnoseExecution(projection);
  const phases = generateTimelinePhases(savedTimeline.total_estimated_hours);
  const pressure = analyzeTimelinePressure(phases);

  const createdDate = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date(savedTimeline.created_at));

  const updatedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date(savedTimeline.updated_at));

  const lastExportedDate = savedTimeline.last_exported_at
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "long",
      }).format(new Date(savedTimeline.last_exported_at))
    : null;

  const generatedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date());

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-slate-950 print:px-0 print:py-0">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_30px_100px_rgba(15,23,42,0.08)] print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between print:hidden">
          <a
            href={`/dashboard/${savedTimeline.id}`}
            className="w-fit rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to Report
          </a>

          <ExportTrackerButton timelineId={savedTimeline.id} />
        </div>

        <header className="border-b border-slate-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
            ChronoForge Report
          </p>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_260px] lg:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {savedTimeline.goal_title}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                A structured execution report generated from ChronoForge’s
                planning intelligence system.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Generated</p>
              <p className="mt-1 font-semibold text-slate-950">
                {generatedDate}
              </p>

              <p className="mt-4 text-sm text-slate-500">Timeline Created</p>
              <p className="mt-1 font-semibold text-slate-950">
                {createdDate}
              </p>

              <p className="mt-4 text-sm text-slate-500">Last Updated</p>
              <p className="mt-1 font-semibold text-slate-950">
                {updatedDate}
              </p>

              <p className="mt-4 text-sm text-slate-500">Last Exported</p>
              <p className="mt-1 font-semibold text-slate-950">
                {lastExportedDate ?? "Not exported yet"}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              ChronoScore
            </p>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-7xl font-semibold tracking-tight">
                {chronoScore.score}
              </span>
              <span className="pb-3 text-slate-400">/ 100</span>
            </div>

            <div className="mt-4 w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Grade {chronoScore.grade}
            </div>

            <h2 className="mt-5 text-2xl font-semibold">
              {chronoScore.label}
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              {chronoScore.summary}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Projection Summary
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <PrintMetric
                label="Projected Completion"
                value={`${projection.projectedDays} days`}
              />

              <PrintMetric
                label="Required Weekly Hours"
                value={`${projection.requiredWeeklyHours}h`}
              />

              <PrintMetric
                label="Deadline Risk"
                value={projection.deadlineRisk}
              />

              <PrintMetric label="Burnout Risk" value={projection.burnoutRisk} />

              <PrintMetric
                label="Recovery Buffer"
                value={`${projection.recoveryBufferDays} days`}
              />

              <PrintMetric
                label="Scope Reduction Needed"
                value={`${projection.scopeReductionNeeded}%`}
              />
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                Execution Diagnosis
              </p>

              <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                {diagnosis.title}
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                {diagnosis.summary}
              </p>
            </div>

            <div className="w-fit rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              {diagnosis.severity}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <PrintInsight
              label="Primary Problem"
              body={diagnosis.primaryProblem}
            />

            <PrintInsight
              label="Recommended Action"
              body={diagnosis.recommendedAction}
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Timeline Pressure
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-slate-950">
            {pressure.highestPressurePhase.title}
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            {pressure.summary}
          </p>

          <div className="mt-5 w-fit rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-sm text-slate-500">Highest Phase Load</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">
              {pressure.highestPressurePhase.estimatedHours}h
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                Phase Architecture
              </p>

              <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                Goal breakdown
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-600">
              ChronoForge divides the goal into effort phases to make execution
              easier to understand and manage.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {phases.map((phase, index) => (
              <div
                key={phase.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Phase {index + 1}
                </p>

                <h3 className="mt-3 text-xl font-semibold text-slate-950">
                  {phase.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {phase.description}
                </p>

                <div className="mt-5">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-950"
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
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Raw Inputs
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <PrintMetric
              label="Total Estimated Hours"
              value={`${savedTimeline.total_estimated_hours}h`}
            />

            <PrintMetric
              label="Available Hours / Week"
              value={`${savedTimeline.available_hours_per_week}h`}
            />

            <PrintMetric
              label="Days Until Deadline"
              value={`${savedTimeline.days_until_deadline} days`}
            />
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-sm leading-7 text-slate-500">
            Generated by ChronoForge — a planning intelligence system for
            turning ambition into structured execution architecture.
          </p>
        </footer>
      </section>
    </main>
  );
}

function PrintMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function PrintInsight({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-sm leading-7 text-slate-700">{body}</p>
    </div>
  );
}