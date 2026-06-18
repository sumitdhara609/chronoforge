import { describe, expect, it } from "vitest";
import { analyzeVaultQuickInsights } from "@/lib/vault-quick-insights";
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

describe("analyzeVaultQuickInsights", () => {
  it("returns empty insight values for an empty vault", () => {
    const result = analyzeVaultQuickInsights([]);

    expect(result).toEqual({
      mostUrgent: null,
      strongest: null,
      highestWeeklyLoad: null,
      bestRecoveryBuffer: null,
      mostAdvancedActive: null,
      pausedPlanToResume: null,
    });
  });

  it("prioritizes unfinished execution work over completed timelines", () => {
    const activeStablePlan = createTimeline({
      id: "active-stable",
      goal_title: "Active Stable Plan",
      total_estimated_hours: 120,
      available_hours_per_week: 12,
      days_until_deadline: 90,
      execution_status: "ACTIVE",
      progress_percentage: 40,
    });

    const pausedHighPressurePlan = createTimeline({
      id: "paused-high-pressure",
      goal_title: "Paused High Pressure Plan",
      total_estimated_hours: 120,
      available_hours_per_week: 4,
      days_until_deadline: 30,
      execution_status: "PAUSED",
      progress_percentage: 15,
    });

    const completedHighRiskPlan = createTimeline({
      id: "completed-high-risk",
      goal_title: "Completed High Risk Plan",
      total_estimated_hours: 120,
      available_hours_per_week: 4,
      days_untilDeadline: 30,
      execution_status: "COMPLETED",
      progress_percentage: 100,
    } as Timeline);

    const result = analyzeVaultQuickInsights([
      activeStablePlan,
      pausedHighPressurePlan,
      completedHighRiskPlan,
    ]);

    expect(result.mostUrgent?.id).toBe("paused-high-pressure");
    expect(result.strongest?.id).toBe("active-stable");
    expect(result.highestWeeklyLoad?.id).toBe("paused-high-pressure");
    expect(result.bestRecoveryBuffer?.id).toBe("active-stable");
    expect(result.mostAdvancedActive?.id).toBe("active-stable");
    expect(result.pausedPlanToResume?.id).toBe("paused-high-pressure");
  });

  it("selects the active timeline with the highest recorded progress", () => {
    const activeEarlyPlan = createTimeline({
      id: "active-early",
      goal_title: "Active Early Plan",
      execution_status: "ACTIVE",
      progress_percentage: 25,
    });

    const activeAdvancedPlan = createTimeline({
      id: "active-advanced",
      goal_title: "Active Advanced Plan",
      execution_status: "ACTIVE",
      progress_percentage: 72,
    });

    const pausedPlan = createTimeline({
      id: "paused-plan",
      goal_title: "Paused Plan",
      execution_status: "PAUSED",
      progress_percentage: 90,
    });

    const result = analyzeVaultQuickInsights([
      activeEarlyPlan,
      activeAdvancedPlan,
      pausedPlan,
    ]);

    expect(result.mostAdvancedActive?.id).toBe("active-advanced");
    expect(result.pausedPlanToResume?.id).toBe("paused-plan");
  });

  it("returns null for execution-specific insights when no matching status exists", () => {
    const planningPlan = createTimeline({
      id: "planning-plan",
      goal_title: "Planning Plan",
      execution_status: "PLANNING",
      progress_percentage: 0,
    });

    const result = analyzeVaultQuickInsights([planningPlan]);

    expect(result.mostAdvancedActive).toBeNull();
    expect(result.pausedPlanToResume).toBeNull();
  });
});