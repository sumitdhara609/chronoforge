import type { ChronoProjection } from "@/lib/chrono-engine";

export type ChronoGrade = "A" | "B" | "C" | "D";

export type ChronoScore = {
  score: number;
  grade: ChronoGrade;
  label: string;
  summary: string;
};

function getRiskPenalty(risk: "LOW" | "MEDIUM" | "HIGH") {
  if (risk === "HIGH") return 25;
  if (risk === "MEDIUM") return 12;
  return 0;
}

function getRecoveryPenalty(recoveryBufferDays: number) {
  if (recoveryBufferDays >= 7) return 0;
  if (recoveryBufferDays >= 3) return 6;
  if (recoveryBufferDays >= 1) return 12;
  return 18;
}

function getScopePenalty(scopeReductionNeeded: number) {
  if (scopeReductionNeeded <= 0) return 0;
  if (scopeReductionNeeded <= 15) return 8;
  if (scopeReductionNeeded <= 35) return 16;
  return 24;
}

function getGrade(score: number): ChronoGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return "D";
}

function getLabel(grade: ChronoGrade) {
  if (grade === "A") return "Strong Execution Architecture";
  if (grade === "B") return "Workable Plan With Some Pressure";
  if (grade === "C") return "Fragile Timeline Structure";
  return "High-Risk Execution Plan";
}

function getSummary(grade: ChronoGrade) {
  if (grade === "A") {
    return "This plan has strong alignment between effort, time, and execution capacity.";
  }

  if (grade === "B") {
    return "This plan is usable, but it needs careful protection against drift and overload.";
  }

  if (grade === "C") {
    return "This plan may work, but the margin is thin and execution pressure is meaningful.";
  }

  return "This plan is structurally risky and should be adjusted before serious execution begins.";
}

export function calculateChronoScore(
  projection: ChronoProjection
): ChronoScore {
  const deadlinePenalty = getRiskPenalty(projection.deadlineRisk);
  const burnoutPenalty = getRiskPenalty(projection.burnoutRisk);
  const recoveryPenalty = getRecoveryPenalty(projection.recoveryBufferDays);
  const scopePenalty = getScopePenalty(projection.scopeReductionNeeded);

  const rawScore =
    100 - deadlinePenalty - burnoutPenalty - recoveryPenalty - scopePenalty;

  const score = Math.max(0, Math.min(100, rawScore));
  const grade = getGrade(score);

  return {
    score,
    grade,
    label: getLabel(grade),
    summary: getSummary(grade),
  };
}