import type { ChronoProjection } from "@/lib/chrono-engine";
import type { ChronoScore } from "@/lib/chrono-score";

export type ComparisonTimeline = {
  id: string;
  goal_title: string;
  projection: ChronoProjection;
  chronoScore: ChronoScore;
};

export type ComparisonVerdict = {
  winner: ComparisonTimeline | null;
  title: string;
  summary: string;
  strongestSignal: string;
  weakestSignal: string;
};

function getRiskValue(risk: "LOW" | "MEDIUM" | "HIGH") {
  if (risk === "LOW") return 3;
  if (risk === "MEDIUM") return 2;
  return 1;
}

function getTimelineStrength(timeline: ComparisonTimeline) {
  return (
    timeline.chronoScore.score +
    getRiskValue(timeline.projection.deadlineRisk) * 8 +
    getRiskValue(timeline.projection.burnoutRisk) * 6 +
    Math.min(timeline.projection.recoveryBufferDays, 30)
  );
}

function getStrongestSignal(
  first: ComparisonTimeline,
  second: ComparisonTimeline
) {
  const scoreGap = Math.abs(
    first.chronoScore.score - second.chronoScore.score
  );

  const bufferGap = Math.abs(
    first.projection.recoveryBufferDays -
      second.projection.recoveryBufferDays
  );

  const weeklyNeedGap = Math.abs(
    first.projection.requiredWeeklyHours -
      second.projection.requiredWeeklyHours
  );

  if (scoreGap >= 10) {
    return "ChronoScore difference is the strongest signal in this comparison.";
  }

  if (bufferGap >= 7) {
    return "Recovery buffer difference is the strongest signal in this comparison.";
  }

  if (weeklyNeedGap >= 5) {
    return "Required weekly effort is the strongest signal in this comparison.";
  }

  return "Both timelines are relatively close, so the decision depends on execution preference and pressure tolerance.";
}

function getWeakestSignal(timeline: ComparisonTimeline) {
  if (timeline.projection.deadlineRisk === "HIGH") {
    return `${timeline.goal_title} has high deadline risk, making its execution window fragile.`;
  }

  if (timeline.projection.burnoutRisk === "HIGH") {
    return `${timeline.goal_title} has high burnout risk, meaning the required effort may become unsustainable.`;
  }

  if (timeline.projection.recoveryBufferDays === 0) {
    return `${timeline.goal_title} has no recovery buffer, leaving little protection against missed days.`;
  }

  if (timeline.projection.scopeReductionNeeded > 0) {
    return `${timeline.goal_title} may need scope reduction to become more stable.`;
  }

  return `${timeline.goal_title} has no major structural weakness in the current comparison.`;
}

export function compareTimelines(
  first: ComparisonTimeline,
  second: ComparisonTimeline
): ComparisonVerdict {
  const firstStrength = getTimelineStrength(first);
  const secondStrength = getTimelineStrength(second);

  if (firstStrength === secondStrength) {
    return {
      winner: null,
      title: "Balanced Execution Match",
      summary:
        "Both timelines show similar execution strength. The better choice depends on which goal has higher strategic value right now.",
      strongestSignal: getStrongestSignal(first, second),
      weakestSignal:
        "Neither timeline clearly dominates the other based on the current projection data.",
    };
  }

  const winner = firstStrength > secondStrength ? first : second;
  const weaker = firstStrength > secondStrength ? second : first;

  return {
    winner,
    title: `${winner.goal_title} Has the Stronger Execution Structure`,
    summary: `${winner.goal_title} currently shows a stronger execution profile because it combines planning score, risk level, effort demand, and recovery buffer more effectively than ${weaker.goal_title}.`,
    strongestSignal: getStrongestSignal(first, second),
    weakestSignal: getWeakestSignal(weaker),
  };
}