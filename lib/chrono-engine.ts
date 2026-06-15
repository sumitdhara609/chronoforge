export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type ChronoProjectionInput = {
  totalEstimatedHours: number;
  availableHoursPerWeek: number;
  daysUntilDeadline: number;
};

export type ChronoProjection = {
  projectedDays: number;
  requiredWeeklyHours: number;
  driftPercentage: number;
  deadlineRisk: RiskLevel;
  burnoutRisk: RiskLevel;
  recoveryBufferDays: number;
  scopeReductionNeeded: number;
  recommendation: string;
};

const MIN_TOTAL_ESTIMATED_HOURS = 1;
const MIN_AVAILABLE_HOURS_PER_WEEK = 1;
const MIN_DAYS_UNTIL_DEADLINE = 1;

function normalizeProjectionInput(
  input: ChronoProjectionInput
): ChronoProjectionInput {
  return {
    totalEstimatedHours: Math.max(
      MIN_TOTAL_ESTIMATED_HOURS,
      Number.isFinite(input.totalEstimatedHours)
        ? input.totalEstimatedHours
        : MIN_TOTAL_ESTIMATED_HOURS
    ),

    availableHoursPerWeek: Math.max(
      MIN_AVAILABLE_HOURS_PER_WEEK,
      Number.isFinite(input.availableHoursPerWeek)
        ? input.availableHoursPerWeek
        : MIN_AVAILABLE_HOURS_PER_WEEK
    ),

    daysUntilDeadline: Math.max(
      MIN_DAYS_UNTIL_DEADLINE,
      Number.isFinite(input.daysUntilDeadline)
        ? input.daysUntilDeadline
        : MIN_DAYS_UNTIL_DEADLINE
    ),
  };
}

function getDeadlineRisk(paceRatio: number): RiskLevel {
  if (paceRatio >= 1) return "LOW";
  if (paceRatio >= 0.75) return "MEDIUM";
  return "HIGH";
}

function getBurnoutRisk(requiredWeeklyHours: number): RiskLevel {
  if (requiredWeeklyHours > 25) return "HIGH";
  if (requiredWeeklyHours >= 15) return "MEDIUM";
  return "LOW";
}

function getRecommendation(deadlineRisk: RiskLevel): string {
  if (deadlineRisk === "LOW") {
    return "Your current pace can realistically meet the deadline.";
  }

  if (deadlineRisk === "MEDIUM") {
    return "Your plan is close, but you need more weekly hours or a smaller scope.";
  }

  return "Your current pace is not aligned with the deadline. Reduce scope or increase weekly effort.";
}

export function calculateProjection(
  input: ChronoProjectionInput
): ChronoProjection {
  const safeInput = normalizeProjectionInput(input);

  const weeksUntilDeadline = safeInput.daysUntilDeadline / 7;

  const projectedWeeks =
    safeInput.totalEstimatedHours / safeInput.availableHoursPerWeek;

  const projectedDays = Math.ceil(projectedWeeks * 7);

  const requiredWeeklyHours =
    safeInput.totalEstimatedHours / weeksUntilDeadline;

  const driftWeeks = projectedWeeks - weeksUntilDeadline;

  const driftPercentage =
    weeksUntilDeadline > 0
      ? (driftWeeks / weeksUntilDeadline) * 100
      : 100;

  const paceRatio =
    safeInput.availableHoursPerWeek / requiredWeeklyHours;

  const deadlineRisk = getDeadlineRisk(paceRatio);

  const burnoutRisk = getBurnoutRisk(requiredWeeklyHours);

  const recoveryBufferDays = Math.max(
    0,
    Math.floor((weeksUntilDeadline - projectedWeeks) * 7)
  );

  const scopeReductionNeeded =
    paceRatio >= 1 ? 0 : Math.round((1 - paceRatio) * 100);

  return {
    projectedDays,
    requiredWeeklyHours: Number(requiredWeeklyHours.toFixed(1)),
    driftPercentage: Number(driftPercentage.toFixed(1)),
    deadlineRisk,
    burnoutRisk,
    recoveryBufferDays,
    scopeReductionNeeded,
    recommendation: getRecommendation(deadlineRisk),
  };
}