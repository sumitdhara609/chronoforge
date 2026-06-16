export type TimelinePhase = {
  title: string;
  description: string;
  percentage: number;
  estimatedHours: number;
};

export type TimelinePressure = {
  highestPressurePhase: TimelinePhase;
  summary: string;
};

const PHASE_BLUEPRINTS = [
  {
    title: "Foundation",
    description:
      "Define the goal, clarify scope, set constraints, and establish the core structure.",
    percentage: 20,
  },
  {
    title: "Core Build",
    description:
      "Build the essential systems that make the goal functional and measurable.",
    percentage: 40,
  },
  {
    title: "System Expansion",
    description:
      "Add depth, refine the workflow, and strengthen the project beyond the basic version.",
    percentage: 25,
  },
  {
    title: "Polish & Launch",
    description:
      "Test, improve presentation, reduce friction, and prepare the goal for completion.",
    percentage: 15,
  },
];

export function generateTimelinePhases(totalEstimatedHours: number) {
  const safeTotalHours = Number.isFinite(totalEstimatedHours)
    ? Math.max(1, totalEstimatedHours)
    : 1;

  return PHASE_BLUEPRINTS.map((phase) => ({
    ...phase,
    estimatedHours: Math.round((safeTotalHours * phase.percentage) / 100),
  })) satisfies TimelinePhase[];
}

export function analyzeTimelinePressure(
  phases: TimelinePhase[]
): TimelinePressure {
  const highestPressurePhase = phases.reduce((highest, current) =>
    current.estimatedHours > highest.estimatedHours ? current : highest
  );

  return {
    highestPressurePhase,
    summary: `${highestPressurePhase.title} carries the highest load with ${highestPressurePhase.estimatedHours}h, making it the phase most likely to define the success or delay of this goal.`,
  };
}