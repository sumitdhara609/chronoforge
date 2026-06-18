import { calculateProjection } from "@/lib/chrono-engine";
import { calculateChronoScore } from "@/lib/chrono-score";
import { diagnoseExecution } from "@/lib/diagnosis-engine";
import type { Timeline } from "@/lib/timeline-types";

export type VaultIntelligence = {
  totalPlans: number;
  totalPlannedHours: number;
  totalRemainingHours: number;
  averageChronoScore: number;
  averageProgress: number;
  highRiskPlans: number;
  criticalPlans: number;
  planningPlans: number;
  activePlans: number;
  pausedPlans: number;
  completedPlans: number;
  strongestPlan: Timeline | null;
  weakestPlan: Timeline | null;
  mostAtRiskActivePlan: Timeline | null;
  vaultHealthLabel: string;
  vaultSummary: string;
};

type AnalyzedTimeline = {
  timeline: Timeline;
  chronoScore: number;
  deadlineRisk: "LOW" | "MEDIUM" | "HIGH";
  diagnosisSeverity: "STABLE" | "WATCH" | "CRITICAL";
  urgencyScore: number;
};

export function analyzeVaultIntelligence(
  timelines: Timeline[]
): VaultIntelligence {
  if (timelines.length === 0) {
    return {
      totalPlans: 0,
      totalPlannedHours: 0,
      totalRemainingHours: 0,
      averageChronoScore: 0,
      averageProgress: 0,
      highRiskPlans: 0,
      criticalPlans: 0,
      planningPlans: 0,
      activePlans: 0,
      pausedPlans: 0,
      completedPlans: 0,
      strongestPlan: null,
      weakestPlan: null,
      mostAtRiskActivePlan: null,
      vaultHealthLabel: "Vault Ready",
      vaultSummary:
        "Your private vault is ready. Create a timeline to begin building execution intelligence.",
    };
  }

  const analyzedTimelines = timelines.map(analyzeTimeline);

  const actionableTimelines = analyzedTimelines.filter(
    (item) => item.timeline.execution_status !== "COMPLETED"
  );

  const activeTimelines = analyzedTimelines.filter(
    (item) => item.timeline.execution_status === "ACTIVE"
  );

  const totalPlannedHours = timelines.reduce(
    (total, timeline) => total + timeline.total_estimated_hours,
    0
  );

  const totalRemainingHours = Math.round(
    timelines.reduce((total, timeline) => {
      const progress = clampProgress(timeline.progress_percentage);
      const remainingPercentage = 1 - progress / 100;

      return total + timeline.total_estimated_hours * remainingPercentage;
    }, 0)
  );

  const averageChronoScore = Math.round(
    analyzedTimelines.reduce((total, item) => total + item.chronoScore, 0) /
      analyzedTimelines.length
  );

  const averageProgress = Math.round(
    timelines.reduce(
      (total, timeline) => total + clampProgress(timeline.progress_percentage),
      0
    ) / timelines.length
  );

  const highRiskPlans = actionableTimelines.filter(
    (item) => item.deadlineRisk === "HIGH"
  ).length;

  const criticalPlans = actionableTimelines.filter(
    (item) => item.diagnosisSeverity === "CRITICAL"
  ).length;

  const planningPlans = timelines.filter(
    (timeline) => timeline.execution_status === "PLANNING"
  ).length;

  const activePlans = timelines.filter(
    (timeline) => timeline.execution_status === "ACTIVE"
  ).length;

  const pausedPlans = timelines.filter(
    (timeline) => timeline.execution_status === "PAUSED"
  ).length;

  const completedPlans = timelines.filter(
    (timeline) => timeline.execution_status === "COMPLETED"
  ).length;

  const strongestPlan = getHighestScorePlan(analyzedTimelines);

  const weakestPlan = getLowestScorePlan(
    actionableTimelines.length > 0 ? actionableTimelines : analyzedTimelines
  );

  const mostAtRiskActivePlan = getMostUrgentPlan(
    activeTimelines.length > 0 ? activeTimelines : actionableTimelines
  );

  const { vaultHealthLabel, vaultSummary } = getVaultHealth({
    totalPlans: timelines.length,
    activePlans,
    pausedPlans,
    completedPlans,
    highRiskPlans,
    criticalPlans,
    averageProgress,
  });

  return {
    totalPlans: timelines.length,
    totalPlannedHours,
    totalRemainingHours,
    averageChronoScore,
    averageProgress,
    highRiskPlans,
    criticalPlans,
    planningPlans,
    activePlans,
    pausedPlans,
    completedPlans,
    strongestPlan,
    weakestPlan,
    mostAtRiskActivePlan,
    vaultHealthLabel,
    vaultSummary,
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
    deadlineRisk: projection.deadlineRisk,
    diagnosisSeverity: diagnosis.severity,
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

function getHighestScorePlan(
  timelines: AnalyzedTimeline[]
): Timeline | null {
  if (timelines.length === 0) {
    return null;
  }

  return timelines.reduce((best, current) =>
    current.chronoScore > best.chronoScore ? current : best
  ).timeline;
}

function getLowestScorePlan(timelines: AnalyzedTimeline[]): Timeline | null {
  if (timelines.length === 0) {
    return null;
  }

  return timelines.reduce((lowest, current) =>
    current.chronoScore < lowest.chronoScore ? current : lowest
  ).timeline;
}

function getMostUrgentPlan(timelines: AnalyzedTimeline[]): Timeline | null {
  if (timelines.length === 0) {
    return null;
  }

  return timelines.reduce((highest, current) =>
    current.urgencyScore > highest.urgencyScore ? current : highest
  ).timeline;
}

function getVaultHealth({
  totalPlans,
  activePlans,
  pausedPlans,
  completedPlans,
  highRiskPlans,
  criticalPlans,
  averageProgress,
}: {
  totalPlans: number;
  activePlans: number;
  pausedPlans: number;
  completedPlans: number;
  highRiskPlans: number;
  criticalPlans: number;
  averageProgress: number;
}) {
  if (completedPlans === totalPlans) {
    return {
      vaultHealthLabel: "Execution Complete",
      vaultSummary:
        "Every timeline in this vault is marked completed. Your current execution cycle has been successfully closed.",
    };
  }

  if (criticalPlans > 0) {
    return {
      vaultHealthLabel: "Immediate Intervention Required",
      vaultSummary:
        "One or more unfinished timelines have critical execution pressure. Review the highest-risk active plan before adding more workload.",
    };
  }

  if (highRiskPlans > 0) {
    return {
      vaultHealthLabel: "High-Pressure Vault",
      vaultSummary:
        "Your vault contains unfinished high-risk timelines. Protect capacity, reduce scope where needed, and focus on the most urgent plan first.",
    };
  }

  if (pausedPlans > activePlans && pausedPlans > 0) {
    return {
      vaultHealthLabel: "Execution Momentum Paused",
      vaultSummary:
        "More plans are paused than active. Consider resuming one meaningful timeline before creating additional commitments.",
    };
  }

  if (activePlans > 0) {
    return {
      vaultHealthLabel: "Execution In Motion",
      vaultSummary:
        `You have ${activePlans} active ${
          activePlans === 1 ? "plan" : "plans"
        } in progress, with an average completion level of ${averageProgress}%.`,
    };
  }

  return {
    vaultHealthLabel: "Planning Architecture Ready",
    vaultSummary:
      "Your timelines are structured and ready. Activate the plan that deserves your next block of focused execution.",
  };
}

function clampProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}