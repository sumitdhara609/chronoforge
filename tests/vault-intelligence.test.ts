import { describe, expect, it } from "vitest";
import { analyzeVaultIntelligence } from "@/lib/vault-intelligence";
import type { Timeline } from "@/lib/timeline-types";

function createTimeline(
  overrides: Partial<Timeline> & Pick<Timeline, "id" | "goal_title">
): Timeline {
  return {
    id: overrides.id,
    goal_title: overrides.goal_title,
    total_estimated_hours: overrides.total_estimated_hours ?? 120,
    available_hours_per_week: overrides.available_hours_per_week ?? 12,
    days_until_deadline: overrides.days_until_deadline ?? 90,
    created_at: overrides.created_at ?? "2026-06-01T00:00:00.000Z",
    updated_at: overrides.updated_at ?? "2026-06-01T00:00:00.000Z",
    last_exported_at: overrides.last_exported_at ?? null,
    execution_status: overrides.execution_status ?? "PLANNING",
    progress_percentage: overrides.progress_percentage ?? 0,
    last_progress_updated_at: overrides.last_progress_updated_at ?? null,
  };
}

describe("analyzeVaultIntelligence", () => {
  it("returns the correct empty-vault state", () => {
    const result = analyzeVaultIntelligence([]);

    expect(result.totalPlans).toBe(0);
    expect(result.totalPlannedHours).toBe(0);
    expect(result.totalRemainingHours).toBe(0);
    expect(result.averageChronoScore).toBe(0);
    expect(result.vaultHealthLabel).toBe("Vault Ready");
    expect(result.strongestPlan).toBeNull();
    expect(result.weakestPlan).toBeNull();
    expect(result.mostAtRiskActivePlan).toBeNull();
  });

  it("excludes completed plans from unfinished risk and critical-warning counts", () => {
    const completedHighRiskPlan = createTimeline({
      id: "completed-high-risk",
      goal_title: "Completed High Risk Plan",
      total_estimated_hours: 120,
      available_hours_per_week: 4,
      days_until_deadline: 30,
      execution_status: "COMPLETED",
      progress_percentage: 100,
    });

    const activeStablePlan = createTimeline({
      id: "active-stable",
      goal_title: "Active Stable Plan",
      total_estimated_hours: 120,
      available_hours_per_week: 12,
      days_until_deadline: 90,
      execution_status: "ACTIVE",
      progress_percentage: 30,
    });

    const result = analyzeVaultIntelligence([
      completedHighRiskPlan,
      activeStablePlan,
    ]);

    expect(result.totalPlans).toBe(2);
    expect(result.completedPlans).toBe(1);
    expect(result.activePlans).toBe(1);
    expect(result.highRiskPlans).toBe(0);
    expect(result.criticalPlans).toBe(0);
    expect(result.totalRemainingHours).toBe(84);
    expect(result.averageProgress).toBe(65);
    expect(result.strongestPlan?.id).toBe("active-stable");
    expect(result.weakestPlan?.id).toBe("active-stable");
    expect(result.mostAtRiskActivePlan?.id).toBe("active-stable");
    expect(result.vaultHealthLabel).toBe("Execution In Motion");
  });

  it("recognizes when execution momentum is paused", () => {
    const pausedPlanOne = createTimeline({
      id: "paused-one",
      goal_title: "Paused One",
      execution_status: "PAUSED",
      progress_percentage: 20,
    });

    const pausedPlanTwo = createTimeline({
      id: "paused-two",
      goal_title: "Paused Two",
      execution_status: "PAUSED",
      progress_percentage: 45,
    });

    const activePlan = createTimeline({
      id: "active-one",
      goal_title: "Active One",
      execution_status: "ACTIVE",
      progress_percentage: 15,
    });

    const result = analyzeVaultIntelligence([
      pausedPlanOne,
      pausedPlanTwo,
      activePlan,
    ]);

    expect(result.pausedPlans).toBe(2);
    expect(result.activePlans).toBe(1);
    expect(result.vaultHealthLabel).toBe("Execution Momentum Paused");
  });

  it("recognizes a fully completed execution cycle", () => {
    const firstCompletedPlan = createTimeline({
      id: "complete-one",
      goal_title: "Complete One",
      execution_status: "COMPLETED",
      progress_percentage: 100,
    });

    const secondCompletedPlan = createTimeline({
      id: "complete-two",
      goal_title: "Complete Two",
      execution_status: "COMPLETED",
      progress_percentage: 100,
    });

    const result = analyzeVaultIntelligence([
      firstCompletedPlan,
      secondCompletedPlan,
    ]);

    expect(result.completedPlans).toBe(2);
    expect(result.totalRemainingHours).toBe(0);
    expect(result.averageProgress).toBe(100);
    expect(result.vaultHealthLabel).toBe("Execution Complete");
  });
});