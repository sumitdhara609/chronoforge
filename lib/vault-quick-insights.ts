import { calculateProjection } from "@/lib/chrono-engine";
import { calculateChronoScore } from "@/lib/chrono-score";

export type QuickInsightTimeline = {
  id: string;
  goal_title: string;
  total_estimated_hours: number;
  available_hours_per_week: number;
  days_until_deadline: number;
  created_at: string;
  updated_at: string;
  last_exported_at: string | null;
};

export type VaultQuickInsights = {
  mostUrgent: QuickInsightTimeline | null;
  strongest: QuickInsightTimeline | null;
  highestWeeklyLoad: QuickInsightTimeline | null;
  bestRecoveryBuffer: QuickInsightTimeline | null;
};

function getUrgencyScore(timeline: QuickInsightTimeline) {
  const projection = calculateProjection({
    totalEstimatedHours: timeline.total_estimated_hours,
    availableHoursPerWeek: timeline.available_hours_per_week,
    daysUntilDeadline: timeline.days_until_deadline,
  });

  const riskWeight =
    projection.deadlineRisk === "HIGH"
      ? 300
      : projection.deadlineRisk === "MEDIUM"
        ? 150
        : 50;

  const burnoutWeight =
    projection.burnoutRisk === "HIGH"
      ? 120
      : projection.burnoutRisk === "MEDIUM"
        ? 60
        : 0;

  const bufferPenalty =
    projection.recoveryBufferDays === 0
      ? 80
      : Math.max(0, 30 - projection.recoveryBufferDays);

  return riskWeight + burnoutWeight + bufferPenalty;
}

export function analyzeVaultQuickInsights(
  timelines: QuickInsightTimeline[]
): VaultQuickInsights {
  if (timelines.length === 0) {
    return {
      mostUrgent: null,
      strongest: null,
      highestWeeklyLoad: null,
      bestRecoveryBuffer: null,
    };
  }

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
      urgencyScore: getUrgencyScore(timeline),
    };
  });

  const mostUrgent = analyzed.reduce((highest, current) =>
    current.urgencyScore > highest.urgencyScore ? current : highest
  ).timeline;

  const strongest = analyzed.reduce((best, current) =>
    current.chronoScore.score > best.chronoScore.score ? current : best
  ).timeline;

  const highestWeeklyLoad = analyzed.reduce((highest, current) =>
    current.projection.requiredWeeklyHours >
    highest.projection.requiredWeeklyHours
      ? current
      : highest
  ).timeline;

  const bestRecoveryBuffer = analyzed.reduce((best, current) =>
    current.projection.recoveryBufferDays >
    best.projection.recoveryBufferDays
      ? current
      : best
  ).timeline;

  return {
    mostUrgent,
    strongest,
    highestWeeklyLoad,
    bestRecoveryBuffer,
  };
}