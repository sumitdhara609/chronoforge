"use client";

import { useMemo, useState } from "react";
import { CopySummaryButton } from "@/components/copy-summary-button";
import { DeleteTimelineButton } from "@/components/delete-timeline-button";
import { calculateProjection } from "@/lib/chrono-engine";
import { calculateChronoScore } from "@/lib/chrono-score";
import { diagnoseExecution } from "@/lib/diagnosis-engine";

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

type RiskFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH";

type StatusFilter =
  | "ALL"
  | "PLANNING"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED";

type SortMode =
  | "NEWEST"
  | "OLDEST"
  | "HIGHEST_SCORE"
  | "LOWEST_SCORE"
  | "HIGHEST_RISK"
  | "HIGHEST_PROGRESS"
  | "LOWEST_PROGRESS";

type TimelineVaultFilterProps = {
  timelines: Timeline[];
};

const RISK_FILTERS: RiskFilter[] = ["ALL", "LOW", "MEDIUM", "HIGH"];

const STATUS_FILTERS: StatusFilter[] = [
  "ALL",
  "PLANNING",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
];

const SORT_OPTIONS: {
  label: string;
  value: SortMode;
}[] = [
  { label: "Newest First", value: "NEWEST" },
  { label: "Oldest First", value: "OLDEST" },
  { label: "Highest ChronoScore", value: "HIGHEST_SCORE" },
  { label: "Lowest ChronoScore", value: "LOWEST_SCORE" },
  { label: "Highest Risk First", value: "HIGHEST_RISK" },
  { label: "Highest Progress", value: "HIGHEST_PROGRESS" },
  { label: "Lowest Progress", value: "LOWEST_PROGRESS" },
];

export function TimelineVaultFilter({ timelines }: TimelineVaultFilterProps) {
  const [activeRiskFilter, setActiveRiskFilter] =
    useState<RiskFilter>("ALL");

  const [activeStatusFilter, setActiveStatusFilter] =
    useState<StatusFilter>("ALL");

  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("NEWEST");

  const filteredTimelines = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const analyzed = timelines.map((timeline) => {
      const projection = calculateProjection({
        totalEstimatedHours: timeline.total_estimated_hours,
        availableHoursPerWeek: timeline.available_hours_per_week,
        daysUntilDeadline: timeline.days_until_deadline,
      });

      const chronoScore = calculateChronoScore(projection);

      return {
        timeline,
        projection,
        chronoScore,
      };
    });

    return analyzed
      .filter((item) => {
        const matchesRisk =
          activeRiskFilter === "ALL" ||
          item.projection.deadlineRisk === activeRiskFilter;

        const matchesStatus =
          activeStatusFilter === "ALL" ||
          item.timeline.execution_status === activeStatusFilter;

        const matchesSearch =
          !normalizedSearch ||
          item.timeline.goal_title.toLowerCase().includes(normalizedSearch);

        return matchesRisk && matchesStatus && matchesSearch;
      })
      .sort((first, second) => {
        if (sortMode === "NEWEST") {
          return (
            new Date(second.timeline.created_at).getTime() -
            new Date(first.timeline.created_at).getTime()
          );
        }

        if (sortMode === "OLDEST") {
          return (
            new Date(first.timeline.created_at).getTime() -
            new Date(second.timeline.created_at).getTime()
          );
        }

        if (sortMode === "HIGHEST_SCORE") {
          return second.chronoScore.score - first.chronoScore.score;
        }

        if (sortMode === "LOWEST_SCORE") {
          return first.chronoScore.score - second.chronoScore.score;
        }

        if (sortMode === "HIGHEST_PROGRESS") {
          return (
            clampProgress(second.timeline.progress_percentage) -
            clampProgress(first.timeline.progress_percentage)
          );
        }

        if (sortMode === "LOWEST_PROGRESS") {
          return (
            clampProgress(first.timeline.progress_percentage) -
            clampProgress(second.timeline.progress_percentage)
          );
        }

        return (
          getRiskWeight(second.projection.deadlineRisk) -
          getRiskWeight(first.projection.deadlineRisk)
        );
      })
      .map((item) => item.timeline);
  }, [
    activeRiskFilter,
    activeStatusFilter,
    searchQuery,
    sortMode,
    timelines,
  ]);

  return (
    <div>
      <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Vault Controls
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-white">
              Search, filter, and sort your timelines.
            </h3>
          </div>

          <p className="text-sm text-slate-400">
            Showing{" "}
            <span className="font-semibold text-white">
              {filteredTimelines.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-white">{timelines.length}</span>{" "}
            timelines
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_260px]">
          <label className="block">
            <span className="text-sm text-slate-400">Search Timeline</span>

            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by goal title..."
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Sort By</span>

            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-slate-400"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Deadline Risk
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {RISK_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveRiskFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
                  activeRiskFilter === filter
                    ? "border-violet-400/30 bg-violet-400/15 text-violet-100"
                    : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/10"
                }`}
              >
                {getRiskFilterLabel(filter)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Execution Status
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveStatusFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
                  activeStatusFilter === filter
                    ? "border-amber-400/30 bg-amber-400/15 text-amber-100"
                    : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/10"
                }`}
              >
                {getStatusFilterLabel(filter)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredTimelines.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6">
          <h3 className="text-2xl font-semibold">No timelines found.</h3>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Try changing the search text, execution status, risk filter, or
            sorting method.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filteredTimelines.map((timeline) => (
            <TimelineCard key={timeline.id} timeline={timeline} />
          ))}
        </div>
      )}
    </div>
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

  const progress = clampProgress(timeline.progress_percentage);

  const createdDate = formatDate(timeline.created_at);
  const updatedDate = formatDate(timeline.updated_at);

  const lastExportedDate = timeline.last_exported_at
    ? formatDate(timeline.last_exported_at)
    : null;

  const lastProgressUpdatedDate = timeline.last_progress_updated_at
    ? formatDate(timeline.last_progress_updated_at)
    : null;

  const copyableSummary = [
    "ChronoForge Timeline Summary",
    "",
    `Goal: ${timeline.goal_title}`,
    `Status: ${getStatusLabel(timeline.execution_status)}`,
    `Progress: ${progress}%`,
    lastProgressUpdatedDate
      ? `Last Progress Update: ${lastProgressUpdatedDate}`
      : null,
    "",
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
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/30 hover:shadow-[0_20px_80px_rgba(255,255,255,0.06)]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Saved {createdDate}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Last updated {updatedDate}
          </p>

          {lastExportedDate ? (
            <p className="mt-1 text-xs text-emerald-300">
              Last exported {lastExportedDate}
            </p>
          ) : null}

          <h3 className="mt-4 text-2xl font-semibold">
            {timeline.goal_title}
          </h3>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="w-fit rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
            {chronoScore.score}/100
          </div>

          <div
            className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getRiskBadgeClass(
              projection.deadlineRisk
            )}`}
          >
            {projection.deadlineRisk} Risk
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
              Execution Progress
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              {getStatusLabel(timeline.execution_status)}
            </p>
          </div>

          <span
            className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getStatusBadgeClass(
              timeline.execution_status
            )}`}
          >
            {progress}% Complete
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full border border-white/10 bg-black/30">
          <div
            className="h-full rounded-full bg-amber-300 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          {lastProgressUpdatedDate
            ? `Last progress update: ${lastProgressUpdatedDate}`
            : "No progress update recorded yet."}
        </p>
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

          <a
            href={`/dashboard/${timeline.id}/edit`}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            Edit
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function clampProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function getRiskFilterLabel(filter: RiskFilter) {
  if (filter === "ALL") return "All";
  if (filter === "LOW") return "Low Risk";
  if (filter === "MEDIUM") return "Medium Risk";
  return "High Risk";
}

function getStatusFilterLabel(filter: StatusFilter) {
  if (filter === "ALL") return "All Statuses";
  if (filter === "PLANNING") return "Planning";
  if (filter === "ACTIVE") return "Active";
  if (filter === "PAUSED") return "Paused";
  return "Completed";
}

function getStatusLabel(status: TimelineStatus) {
  if (status === "PLANNING") return "Planning";
  if (status === "ACTIVE") return "Active";
  if (status === "PAUSED") return "Paused";
  return "Completed";
}

function getRiskWeight(risk: "LOW" | "MEDIUM" | "HIGH") {
  if (risk === "HIGH") return 3;
  if (risk === "MEDIUM") return 2;
  return 1;
}

function getRiskBadgeClass(risk: "LOW" | "MEDIUM" | "HIGH") {
  if (risk === "LOW") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }

  if (risk === "MEDIUM") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  }

  return "border-rose-400/20 bg-rose-400/10 text-rose-200";
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