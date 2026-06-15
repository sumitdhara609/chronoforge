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

export function calculateProjection(
  input: ChronoProjectionInput
): ChronoProjection {
  const weeksUntilDeadline = input.daysUntilDeadline / 7;

  const projectedWeeks =
    input.totalEstimatedHours / input.availableHoursPerWeek;

  const projectedDays = Math.ceil(projectedWeeks * 7);

  const requiredWeeklyHours =
    input.totalEstimatedHours / weeksUntilDeadline;

  const driftWeeks = projectedWeeks - weeksUntilDeadline;

  const driftPercentage =
    weeksUntilDeadline > 0
      ? (driftWeeks / weeksUntilDeadline) * 100
      : 100;

  const paceRatio =
    input.availableHoursPerWeek / requiredWeeklyHours;

  const deadlineRisk: RiskLevel =
    paceRatio >= 1 ? "LOW" : paceRatio >= 0.75 ? "MEDIUM" : "HIGH";

  const burnoutRisk: RiskLevel =
    requiredWeeklyHours > 25
      ? "HIGH"
      : requiredWeeklyHours >= 15
      ? "MEDIUM"
      : "LOW";

  const recoveryBufferDays = Math.max(
    0,
    Math.floor((weeksUntilDeadline - projectedWeeks) * 7)
  );

  const scopeReductionNeeded =
    paceRatio >= 1 ? 0 : Math.round((1 - paceRatio) * 100);

  const recommendation =
    deadlineRisk === "LOW"
      ? "Your current pace can realistically meet the deadline."
      : deadlineRisk === "MEDIUM"
      ? "Your plan is close, but you need more weekly hours or a smaller scope."
      : "Your current pace is not aligned with the deadline. Reduce scope or increase weekly effort.";

  return {
    projectedDays,
    requiredWeeklyHours: Number(requiredWeeklyHours.toFixed(1)),
    driftPercentage: Number(driftPercentage.toFixed(1)),
    deadlineRisk,
    burnoutRisk,
    recoveryBufferDays,
    scopeReductionNeeded,
    recommendation,
  };
}