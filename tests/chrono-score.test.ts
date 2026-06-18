import { describe, expect, it } from "vitest";
import { calculateProjection } from "@/lib/chrono-engine";
import { calculateChronoScore } from "@/lib/chrono-score";

describe("calculateChronoScore", () => {
  it("awards a perfect score to a stable timeline with healthy capacity", () => {
    const projection = calculateProjection({
      totalEstimatedHours: 120,
      availableHoursPerWeek: 12,
      daysUntilDeadline: 90,
    });

    expect(calculateChronoScore(projection)).toEqual({
      score: 100,
      grade: "A",
      label: "Strong Execution Architecture",
      summary:
        "This plan has strong alignment between effort, time, and execution capacity.",
    });
  });

  it("heavily penalizes a timeline with deadline, burnout, buffer, and scope pressure", () => {
    const projection = calculateProjection({
      totalEstimatedHours: 120,
      availableHoursPerWeek: 4,
      daysUntilDeadline: 30,
    });

    expect(calculateChronoScore(projection)).toEqual({
      score: 8,
      grade: "D",
      label: "High-Risk Execution Plan",
      summary:
        "This plan is structurally risky and should be adjusted before serious execution begins.",
    });
  });
});