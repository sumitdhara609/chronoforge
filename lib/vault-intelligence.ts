import { calculateProjection } from "@/lib/chrono-engine";
import { calculateChronoScore } from "@/lib/chrono-score";

export type VaultTimeline = {
  id: string;
  goal_title: string;
  total_estimated_hours: number;
  available_hours_per_week: number;
  days_until_deadline: number;
  created_at: string;
};

export type VaultIntelligence = {
  totalPlans: number;
  totalPlannedHours: number;
  averageChronoScore: number;
  highRiskPlans: number;
  criticalPlans: number;
  strongestPlan: VaultTimeline | null;
  weakestPlan: VaultTimeline | null;
  vaultHealthLabel: string;
  vaultSummary: string;
};

function getVaultHealthLabel(averageScore: number) {
  if (averageScore >= 85) return "Excellent Planning Health";
  if (averageScore >= 70) return "Strong Planning Health";
  if (averageScore >= 50) return "Fragile Planning Health";
  return "High-Risk Planning Vault";
}

function getVaultSummary(
  totalPlans: number,
  averageScore: number,
  highRiskPlans: number
) {
  if (totalPlans === 0) {
    return "Your vault is waiting for its first saved goal architecture.";
  }

  if (averageScore >= 85) {
    return "Your saved plans show strong alignment between effort, deadlines, and execution capacity.";
  }

  if (averageScore >= 70) {
    return "Your vault is generally healthy, but some plans may still need protection against drift.";
  }

  if (highRiskPlans > 0) {
    return "Your vault contains plans with meaningful execution risk. Review the weakest timelines before committing serious effort.";
  }

  return "Your vault shows moderate planning pressure. Improving recovery buffer and scope realism can strengthen it.";
}

export function analyzeVaultIntelligence(
  timelines: VaultTimeline[]
): VaultIntelligence {
  if (timelines.length === 0) {
    return {
      totalPlans: 0,
      totalPlannedHours: 0,
      averageChronoScore: 0,
      highRiskPlans: 0,
      criticalPlans: 0,
      strongestPlan: null,
      weakestPlan: null,
      vaultHealthLabel: "Empty Vault",
      vaultSummary: "Your vault is waiting for its first saved goal architecture.",
    };
  }

  const analyzedTimelines = timelines.map((timeline) => {
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

  const totalPlannedHours = timelines.reduce(
    (total, timeline) => total + timeline.total_estimated_hours,
    0
  );

  const totalScore = analyzedTimelines.reduce(
    (total, item) => total + item.chronoScore.score,
    0
  );

  const averageChronoScore = Math.round(totalScore / timelines.length);

  const highRiskPlans = analyzedTimelines.filter(
    (item) => item.projection.deadlineRisk === "HIGH"
  ).length;

  const criticalPlans = analyzedTimelines.filter(
    (item) =>
      item.projection.deadlineRisk === "HIGH" ||
      item.projection.burnoutRisk === "HIGH"
  ).length;

  const strongestPlan =
    analyzedTimelines.reduce((best, current) =>
      current.chronoScore.score > best.chronoScore.score ? current : best
    ).timeline ?? null;

  const weakestPlan =
    analyzedTimelines.reduce((weakest, current) =>
      current.chronoScore.score < weakest.chronoScore.score ? current : weakest
    ).timeline ?? null;

  return {
    totalPlans: timelines.length,
    totalPlannedHours,
    averageChronoScore,
    highRiskPlans,
    criticalPlans,
    strongestPlan,
    weakestPlan,
    vaultHealthLabel: getVaultHealthLabel(averageChronoScore),
    vaultSummary: getVaultSummary(
      timelines.length,
      averageChronoScore,
      highRiskPlans
    ),
  };
}