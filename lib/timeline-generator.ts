export type TimelinePhase = {
  title: string;
  description: string;
  percentage: number;
};

export function generateTimelinePhases() {
  return [
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
  ] satisfies TimelinePhase[];
}