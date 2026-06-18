import { calculateProjection } from "@/lib/chrono-engine";
import { calculateChronoScore } from "@/lib/chrono-score";
import { diagnoseExecution } from "@/lib/diagnosis-engine";
import type { Timeline } from "@/lib/timeline-types";

export type VaultQuickInsights = {
  mostUrgent: Timeline | null;
  strongest: Timeline | null;
  highestWeeklyLoad: Timeline | null;
  bestRecoveryBuffer: Timeline | null;
  mostAdvancedActive: Timeline | null;
  pausedPlanToResume: Timeline | null;
};

type AnalyzedTimeline = {
  timeline: Timeline;
  chronoScore: number;
  requiredWeeklyHours: number;
  recoveryBufferDays: number;
  urgencyScore: number;
};

export function analyzeVaultQuickInsights(
  timelines: Timeline[]
): VaultQuickInsights {
  if (timelines.length === 0) {
    return {
      mostUrgent: null,
      strongest: null,
      highestWeeklyLoad: null,
      bestRecoveryBuffer: null,
      mostAdvancedActive: null,
      pausedPlanToResume: null,
    };
  }

  const analyzedTimelines = timelines.map(analyzeTimeline);

  const unfinishedTimelines = analyzedTimelines.filter(
    (item) => item.timeline.execution_status !== "COMPLETED"
  );

  const activeTimelines = analyzedTimelines.filter(
    (item) => item.timeline.execution_status === "ACTIVE"
  );

  const pausedTimelines = analyzedTimelines.filter(
    (item) => item.timeline.execution_status === "PAUSED"
  );

  const actionableTimelines =
    unfinishedTimelines.length > 0 ? unfinishedTimelines : analyzedTimelines;

  return {
    mostUrgent: getHighestUrgency(actionableTimelines),
    strongest: getHighestChronoScore(analyzedTimelines),
    highestWeeklyLoad: getHighestWeeklyLoad(actionableTimelines),
    bestRecoveryBuffer: getBestRecoveryBuffer(actionableTimelines),
    mostAdvancedActive: getMostAdvancedActive(activeTimelines),
    pausedPlanToResume: getHighestUrgency(pausedTimelines),
  };
}

function analyzeTimeline(timeline: Timeline): AnalyzedTimeline {
  const projection = calculateProjection({
    totalEstimatedHours: timeline.total_estimated_hours,
    availableHoursPerWeek: timeline.available_hours_per_week,
    daysUntilDeadline: timeline.days_until_deadline,
  });

  const chronoScore = calculateChronoScore(projection);
  const diagnosis = diagnoseExecution(projection);

  return {
    timeline,
    chronoScore: chronoScore.score,
    requiredWeeklyHours: projection.requiredWeeklyHours,
    recoveryBufferDays: projection.recoveryBufferDays,
    urgencyScore: getUrgencyScore(
      timeline.execution_status,
      timeline.progress_percentage,
      projection.deadlineRisk,
      diagnosis.severity
    ),
  };
}

function getUrgencyScore(
  status: Timeline["execution_status"],
  progress: number,
  deadlineRisk: "LOW" | "MEDIUM" | "HIGH",
  diagnosisSeverity: "STABLE" | "WATCH" | "CRITICAL"
) {
  const statusWeight =
    status === "ACTIVE"
      ? 80
      : status === "PAUSED"
        ? 65
        : status === "PLANNING"
          ? 25
          : -500;

  const riskWeight =
    deadlineRisk === "HIGH"
      ? 180
      : deadlineRisk === "MEDIUM"
        ? 90
        : 25;

  const diagnosisWeight =
    diagnosisSeverity === "CRITICAL"
      ? 130
      : diagnosisSeverity === "WATCH"
        ? 55
        : 0;

  const progressRelief = clampProgress(progress) * 0.7;

  return statusWeight + riskWeight + diagnosisWeight - progressRelief;
}

function getHighestUrgency(timelines: AnalyzedTimeline[]): Timeline | null {
  if (timelines.length === 0) {
    return null;
  }

  return timelines.reduce((highest, current) =>
    current.urgencyScore > highest.urgencyScore ? current : highest
  ).timeline;
}

function getHighestChronoScore(
  timelines: AnalyzedTimeline[]
): Timeline | null {
  if (timelines.length === 0) {
    return null;
  }

  return timelines.reduce((best, current) =>
    current.chronoScore > best.chronoScore ? current : best
  ).timeline;
}

function getHighestWeeklyLoad(
  timelines: AnalyzedTimeline[]
): Timeline | null {
  if (timelines.length === 0) {
    return null;
  }

  return timelines.reduce((highest, current) =>
    current.requiredWeeklyHours > highest.requiredWeeklyHours
      ? current
      : highest
  ).timeline;
}

function getBestRecoveryBuffer(
  timelines: AnalyzedTimeline[]
): Timeline | null {
  if (timelines.length === 0) {
    return null;
  }

  return timelines.reduce((best, current) =>
    current.recoveryBufferDays > best.recoveryBufferDays ? current : best
  ).timeline;
}

function getMostAdvancedActive(
  timelines: AnalyzedTimeline[]
): Timeline | null {
  if (timelines.length === 0) {
    return null;
  }

  return timelines.reduce((mostAdvanced, current) =>
    clampProgress(current.timeline.progress_percentage) >
    clampProgress(mostAdvanced.timeline.progress_percentage)
      ? current
      : mostAdvanced
  ).timeline;
}

function clampProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}