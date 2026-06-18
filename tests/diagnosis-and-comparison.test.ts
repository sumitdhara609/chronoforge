import { describe, expect, it } from "vitest";
import { calculateProjection } from "@/lib/chrono-engine";
import { calculateChronoScore } from "@/lib/chrono-score";
import { compareTimelines } from "@/lib/comparison-engine";
import { diagnoseExecution } from "@/lib/diagnosis-engine";

describe("diagnoseExecution", () => {
  it("returns a stable diagnosis for a healthy execution plan", () => {
    const projection = calculateProjection({
      totalEstimatedHours: 120,
      availableHoursPerWeek: 12,
      daysUntilDeadline: 90,
    });

    const diagnosis = diagnoseExecution(projection);

    expect(diagnosis.severity).toBe("STABLE");
    expect(diagnosis.title).toBe("Execution Plan Looks Stable");
    expect(diagnosis.primaryProblem).toContain(
      "aligned with the deadline"
    );
    expect(diagnosis.recommendedAction).toContain(
      "Maintain the current pace"
    );
  });

  it("returns a watch diagnosis when the plan is near its deadline boundary", () => {
    const projection = calculateProjection({
      totalEstimatedHours: 120,
      availableHoursPerWeek: 9,
      daysUntilDeadline: 90,
    });

    const diagnosis = diagnoseExecution(projection);

    expect(projection.deadlineRisk).toBe("MEDIUM");
    expect(diagnosis.severity).toBe("WATCH");
    expect(diagnosis.title).toBe("Timeline Pressure Warning");
    expect(diagnosis.recommendedAction).toContain(
      "Add a small weekly effort buffer"
    );
  });

  it("returns a critical diagnosis for a high-risk execution plan", () => {
    const projection = calculateProjection({
      totalEstimatedHours: 120,
      availableHoursPerWeek: 4,
      daysUntilDeadline: 30,
    });

    const diagnosis = diagnoseExecution(projection);

    expect(diagnosis.severity).toBe("CRITICAL");
    expect(diagnosis.title).toBe("Execution Misalignment Detected");
    expect(diagnosis.primaryProblem).toContain(
      "significantly below the pace required"
    );
    expect(diagnosis.recommendedAction).toContain(
      `Reduce the project scope by around ${projection.scopeReductionNeeded}%`
    );
  });

  it("identifies burnout pressure when the deadline is achievable", () => {
    const projection = calculateProjection({
      totalEstimatedHours: 300,
      availableHoursPerWeek: 30,
      daysUntilDeadline: 70,
    });

    const diagnosis = diagnoseExecution(projection);

    expect(projection.deadlineRisk).toBe("LOW");
    expect(projection.burnoutRisk).toBe("HIGH");
    expect(diagnosis.severity).toBe("CRITICAL");
    expect(diagnosis.primaryProblem).toContain(
      "weekly effort required could create unsustainable pressure"
    );
  });
});

describe("compareTimelines", () => {
  it("selects the structurally stronger execution timeline", () => {
    const stableProjection = calculateProjection({
      totalEstimatedHours: 120,
      availableHoursPerWeek: 12,
      daysUntilDeadline: 90,
    });

    const riskyProjection = calculateProjection({
      totalEstimatedHours: 120,
      availableHoursPerWeek: 4,
      daysUntilDeadline: 30,
    });

    const result = compareTimelines(
      {
        id: "stable-plan",
        goal_title: "Stable Product Build",
        projection: stableProjection,
        chronoScore: calculateChronoScore(stableProjection),
      },
      {
        id: "risky-plan",
        goal_title: "Risky Product Build",
        projection: riskyProjection,
        chronoScore: calculateChronoScore(riskyProjection),
      }
    );

    expect(result.winner?.id).toBe("stable-plan");
    expect(result.title).toBe(
      "Stable Product Build Has the Stronger Execution Structure"
    );
    expect(result.strongestSignal).toBe(
      "ChronoScore difference is the strongest signal in this comparison."
    );
    expect(result.weakestSignal).toContain(
      "Risky Product Build has high deadline risk"
    );
  });

  it("returns a balanced verdict for identical timelines", () => {
    const projection = calculateProjection({
      totalEstimatedHours: 120,
      availableHoursPerWeek: 12,
      daysUntilDeadline: 90,
    });

    const chronoScore = calculateChronoScore(projection);

    const result = compareTimelines(
      {
        id: "first-plan",
        goal_title: "First Plan",
        projection,
        chronoScore,
      },
      {
        id: "second-plan",
        goal_title: "Second Plan",
        projection,
        chronoScore,
      }
    );

    expect(result.winner).toBeNull();
    expect(result.title).toBe("Balanced Execution Match");
    expect(result.weakestSignal).toBe(
      "Neither timeline clearly dominates the other based on the current projection data."
    );
  });

  it("detects recovery buffer as the strongest difference when scores are close", () => {
    const bufferedProjection = calculateProjection({
      totalEstimatedHours: 60,
      availableHoursPerWeek: 10,
      daysUntilDeadline: 70,
    });

    const tightProjection = calculateProjection({
      totalEstimatedHours: 60,
      availableHoursPerWeek: 10,
      daysUntilDeadline: 49,
    });

    const result = compareTimelines(
      {
        id: "buffered-plan",
        goal_title: "Buffered Plan",
        projection: bufferedProjection,
        chronoScore: calculateChronoScore(bufferedProjection),
      },
      {
        id: "tight-plan",
        goal_title: "Tight Plan",
        projection: tightProjection,
        chronoScore: calculateChronoScore(tightProjection),
      }
    );

    expect(result.strongestSignal).toBe(
      "Recovery buffer difference is the strongest signal in this comparison."
    );
  });
});