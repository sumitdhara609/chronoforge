import type { ChronoProjection, RiskLevel } from "@/lib/chrono-engine";

export type DiagnosisSeverity = "STABLE" | "WATCH" | "CRITICAL";

export type ExecutionDiagnosis = {
  title: string;
  severity: DiagnosisSeverity;
  summary: string;
  primaryProblem: string;
  recommendedAction: string;
  productSignal: string;
};

function getSeverity(
  deadlineRisk: RiskLevel,
  burnoutRisk: RiskLevel
): DiagnosisSeverity {
  if (deadlineRisk === "HIGH" || burnoutRisk === "HIGH") {
    return "CRITICAL";
  }

  if (deadlineRisk === "MEDIUM" || burnoutRisk === "MEDIUM") {
    return "WATCH";
  }

  return "STABLE";
}

function getTitle(severity: DiagnosisSeverity) {
  if (severity === "CRITICAL") {
    return "Execution Misalignment Detected";
  }

  if (severity === "WATCH") {
    return "Timeline Pressure Warning";
  }

  return "Execution Plan Looks Stable";
}

function getPrimaryProblem(projection: ChronoProjection) {
  if (projection.deadlineRisk === "HIGH") {
    return "Your current weekly capacity is significantly below the pace required to meet the deadline.";
  }

  if (projection.burnoutRisk === "HIGH") {
    return "The deadline may be possible, but the weekly effort required could create unsustainable pressure.";
  }

  if (projection.deadlineRisk === "MEDIUM") {
    return "Your current plan is close to the deadline boundary, leaving limited room for delays.";
  }

  if (projection.burnoutRisk === "MEDIUM") {
    return "The plan is achievable, but the weekly effort requirement should be monitored carefully.";
  }

  return "Your available weekly effort is aligned with the deadline and leaves a healthier execution margin.";
}

function getRecommendedAction(projection: ChronoProjection) {
  if (projection.deadlineRisk === "HIGH") {
    return `Reduce the project scope by around ${projection.scopeReductionNeeded}% or increase weekly capacity before starting execution.`;
  }

  if (projection.burnoutRisk === "HIGH") {
    return "Extend the deadline, reduce scope, or split the goal into smaller milestones to avoid burnout.";
  }

  if (projection.deadlineRisk === "MEDIUM") {
    return "Add a small weekly effort buffer or reduce non-essential tasks to protect the deadline.";
  }

  if (projection.burnoutRisk === "MEDIUM") {
    return "Keep recovery days protected and avoid increasing the workload without adjusting the deadline.";
  }

  return "Maintain the current pace and use the recovery buffer to absorb unexpected delays.";
}

function getSummary(projection: ChronoProjection, severity: DiagnosisSeverity) {
  if (severity === "CRITICAL") {
    return `ChronoForge detected a high-risk execution pattern. The plan needs ${projection.requiredWeeklyHours}h/week, while the projected timeline shows meaningful pressure against the deadline.`;
  }

  if (severity === "WATCH") {
    return "The plan is possible, but not deeply protected. ChronoForge recommends watching the weekly load and preserving buffer time.";
  }

  return "The plan is structurally healthy. Your projected completion and current capacity are aligned with the deadline.";
}

export function diagnoseExecution(
  projection: ChronoProjection
): ExecutionDiagnosis {
  const severity = getSeverity(projection.deadlineRisk, projection.burnoutRisk);

  return {
    title: getTitle(severity),
    severity,
    summary: getSummary(projection, severity),
    primaryProblem: getPrimaryProblem(projection),
    recommendedAction: getRecommendedAction(projection),
    productSignal:
      "This diagnosis is generated from ChronoForge's custom planning logic, combining deadline risk, burnout risk, scope pressure, and recovery buffer analysis.",
  };
}