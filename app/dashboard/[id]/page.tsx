import { notFound, redirect } from "next/navigation";
import { BackgroundOrbs } from "@/components/background-orbs";
import { CopySummaryButton } from "@/components/copy-summary-button";
import { DeleteTimelineButton } from "@/components/delete-timeline-button";
import { PremiumButton } from "@/components/premium-button";
import { SiteFooter } from "@/components/site-footer";
import { TimelineProgressEditor } from "@/components/timeline-progress-editor";
import { calculateProjection } from "@/lib/chrono-engine";
import { calculateChronoScore } from "@/lib/chrono-score";
import { diagnoseExecution } from "@/lib/diagnosis-engine";
import { createClient } from "@/lib/supabase/server";
import {
  analyzeTimelinePressure,
  generateTimelinePhases,
} from "@/lib/timeline-generator";

type TimelineStatus = "PLANNING" | "ACTIVE" | "PAUSED" | "COMPLETED";

type Timeline = {
  id: string;
  goal_title: string;
  total_estimated_hours: number;
  available_hours_per_week: number;
  days_until_deadline: number;
  created_at: string;
  updated_at: string;
  last_exported_at: string | null;
  execution_status: TimelineStatus;
  progress_percentage: number;
  last_progress_updated_at: string | null;
};

type TimelineDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TimelineDetailPage({
  params,
}: TimelineDetailPageProps) {
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
      "id, goal_title, total_estimated_hours, available_hours_per_week, days_until_deadline, created_at, updated_at, last_exported_at, execution_status, progress_percentage, last_progress_updated_at"
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

  const diagnosis = diagnoseExecution(projection);
  const chronoScore = calculateChronoScore(projection);
  const phases = generateTimelinePhases(savedTimeline.total_estimated_hours);
  const pressure = analyzeTimelinePressure(phases);

  const createdDate = formatDate(savedTimeline.created_at);
  const updatedDate = formatDate(savedTimeline.updated_at);

  const lastExportedDate = savedTimeline.last_exported_at
    ? formatDate(savedTimeline.last_exported_at)
    : null;

  const lastProgressUpdatedDate = savedTimeline.last_progress_updated_at
    ? formatDate(savedTimeline.last_progress_updated_at)
    : null;

  const progress = clampProgress(savedTimeline.progress_percentage);

  const copyableSummary = [
    "ChronoForge Timeline Report",
    "",
    `Goal: ${savedTimeline.goal_title}`,
    `Created: ${createdDate}`,
    `Last Updated: ${updatedDate}`,
    lastExportedDate ? `Last Exported: ${lastExportedDate}` : null,
    "",
    "Execution Progress",
    `Status: ${getStatusLabel(savedTimeline.execution_status)}`,
    `Progress: ${progress}%`,
    lastProgressUpdatedDate
      ? `Last Progress Update: ${lastProgressUpdatedDate}`
      : null,
    "",
    "ChronoScore",
    `Score: ${chronoScore.score}/100`,
    `Grade: ${chronoScore.grade}`,
    `Score Label: ${chronoScore.label}`,
    `Score Summary: ${chronoScore.summary}`,
    "",
    "Projection",
    `Projected Completion: ${projection.projectedDays} days`,
    `Deadline Risk: ${projection.deadlineRisk}`,
    `Burnout Risk: ${projection.burnoutRisk}`,
    `Required Weekly Hours: ${projection.requiredWeeklyHours}h`,
    `Recovery Buffer: ${projection.recoveryBufferDays} days`,
    `Scope Reduction Needed: ${projection.scopeReductionNeeded}%`,
    "",
    "Execution Diagnosis",
    `Diagnosis: ${diagnosis.title}`,
    `Severity: ${diagnosis.severity}`,
    `Primary Problem: ${diagnosis.primaryProblem}`,
    `Recommended Action: ${diagnosis.recommendedAction}`,
    "",
    "Timeline Pressure",
    `Highest Pressure Phase: ${pressure.highestPressurePhase.title}`,
    `Estimated Phase Load: ${pressure.highestPressurePhase.estimatedHours}h`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050711] px-5 py-12 text-white sm:px-6 sm:py-16">
      <BackgroundOrbs />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PremiumButton href="/dashboard" variant="ghost">
            Back to Dashboard
          </PremiumButton>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`/dashboard/${savedTimeline.id}/edit`}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Edit Timeline
            </a>

            <a
              href={`/dashboard/${savedTimeline.id}/print`}
              className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-center text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-400/15"
            >
              Export Report
            </a>

            <CopySummaryButton summary={copyableSummary} />
            <DeleteTimelineButton timelineId={savedTimeline.id} />
          </div>
        </div>

        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-slate-400">
          Timeline Report
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          {savedTimeline.goal_title}
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          A full ChronoForge report generated from your saved goal architecture.
          Created on <span className="font-medium text-white">{createdDate}</span>{" "}
          and last updated on{" "}
          <span className="font-medium text-white">{updatedDate}</span>.
        </p>

        <div className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6 shadow-[0_20px_90px_rgba(245,158,11,0.08)] backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
                Execution Status
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {getStatusHeading(savedTimeline.execution_status)}
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                {getStatusDescription(savedTimeline.execution_status, progress)}
              </p>
            </div>

            <div
              className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${getStatusBadgeClass(
                savedTimeline.execution_status
              )}`}
            >
              {getStatusLabel(savedTimeline.execution_status)}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-300">Current progress</p>
                <p className="mt-2 text-5xl font-semibold tracking-tight text-white">
                  {progress}%
                </p>
              </div>

              <p className="max-w-xs text-right text-sm leading-6 text-slate-400">
                {lastProgressUpdatedDate
                  ? `Last progress update: ${lastProgressUpdatedDate}`
                  : "No progress update has been recorded yet."}
              </p>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full border border-white/10 bg-black/30">
              <div
                className="h-full rounded-full bg-amber-300 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <TimelineProgressEditor
            timelineId={savedTimeline.id}
            initialStatus={savedTimeline.execution_status}
            initialProgress={progress}
          />
        </div>

        <div className="mt-10 rounded-3xl border border-violet-400/20 bg-violet-400/10 p-6 shadow-[0_20px_90px_rgba(139,92,246,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
              ChronoScore
            </p>

            <span className="w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              Grade {chronoScore.grade}
            </span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-6xl font-semibold tracking-tight">
              {chronoScore.score}
            </span>
            <span className="pb-2 text-slate-400">/ 100</span>
          </div>

          <h2 className="mt-4 text-3xl font-semibold text-white">
            {chronoScore.label}
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            {chronoScore.summary}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <ReportMetric
            label="Projected Completion"
            value={`${projection.projectedDays} days`}
          />

          <ReportMetric label="Deadline Risk" value={projection.deadlineRisk} />

          <ReportMetric label="Burnout Risk" value={projection.burnoutRisk} />

          <ReportMetric
            label="Weekly Need"
            value={`${projection.requiredWeeklyHours}h`}
          />
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
                How the goal breaks down.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              ChronoForge divides your saved goal into effort phases so the plan
              becomes easier to understand and execute.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, index) => (
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
                    {phase.percentage}% of estimated effort ·{" "}
                    {phase.estimatedHours}h
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Raw Inputs
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ReportMetric
              label="Total Estimated Hours"
              value={`${savedTimeline.total_estimated_hours}h`}
            />

            <ReportMetric
              label="Available Hours / Week"
              value={`${savedTimeline.available_hours_per_week}h`}
            />

            <ReportMetric
              label="Days Until Deadline"
              value={`${savedTimeline.days_until_deadline} days`}
            />
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </main>
  );
}

function ReportMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date(value));
}

function clampProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function getStatusLabel(status: TimelineStatus) {
  if (status === "PLANNING") return "Planning";
  if (status === "ACTIVE") return "Active";
  if (status === "PAUSED") return "Paused";
  return "Completed";
}

function getStatusHeading(status: TimelineStatus) {
  if (status === "PLANNING") return "This plan is being prepared.";
  if (status === "ACTIVE") return "This plan is currently in motion.";
  if (status === "PAUSED") return "This plan is intentionally paused.";
  return "This plan has been completed.";
}

function getStatusDescription(status: TimelineStatus, progress: number) {
  if (status === "PLANNING") {
    return `The architecture is ready, with ${progress}% progress currently recorded.`;
  }

  if (status === "ACTIVE") {
    return `Execution is active. ${progress}% of the goal has been completed so far.`;
  }

  if (status === "PAUSED") {
    return `Execution is paused at ${progress}%. Resume it when the timing and capacity are right.`;
  }

  return `Execution has been completed at ${progress}%.`;
}

function getStatusBadgeClass(status: TimelineStatus) {
  if (status === "PLANNING") {
    return "border-slate-400/20 bg-slate-400/10 text-slate-100";
  }

  if (status === "ACTIVE") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "PAUSED") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-100";
  }

  return "border-violet-400/20 bg-violet-400/10 text-violet-100";
}