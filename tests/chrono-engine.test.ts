import { describe, expect, it } from "vitest";
import { calculateProjection } from "@/lib/chrono-engine";

describe("calculateProjection", () => {
  it("creates a stable projection when capacity exceeds the required pace", () => {
    const result = calculateProjection({
      totalEstimatedHours: 120,
      availableHoursPerWeek: 12,
      daysUntilDeadline: 90,
    });

    expect(result).toEqual({
      projectedDays: 70,
      requiredWeeklyHours: 9.3,
      driftPercentage: -22.2,
      deadlineRisk: "LOW",
      burnoutRisk: "LOW",
      recoveryBufferDays: 20,
      scopeReductionNeeded: 0,
      recommendation:
        "Your current pace can realistically meet the deadline.",
    });
  });

  it("detects a high-risk plan with impossible weekly capacity", () => {
    const result = calculateProjection({
      totalEstimatedHours: 120,
      availableHoursPerWeek: 4,
      daysUntilDeadline: 30,
    });

    expect(result).toEqual({
      projectedDays: 210,
      requiredWeeklyHours: 28,
      driftPercentage: 600,
      deadlineRisk: "HIGH",
      burnoutRisk: "HIGH",
      recoveryBufferDays: 0,
      scopeReductionNeeded: 86,
      recommendation:
        "Your current pace is not aligned with the deadline. Reduce scope or increase weekly effort.",
    });
  });

  it("normalizes invalid or non-positive values safely", () => {
    const result = calculateProjection({
      totalEstimatedHours: -20,
      availableHoursPerWeek: 0,
      daysUntilDeadline: -10,
    });

    expect(result.projectedDays).toBe(7);
    expect(result.requiredWeeklyHours).toBe(7);
    expect(result.deadlineRisk).toBe("HIGH");
    expect(result.recoveryBufferDays).toBe(0);
  });
});