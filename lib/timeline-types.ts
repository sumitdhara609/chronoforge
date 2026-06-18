export type TimelineStatus =
  | "PLANNING"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED";

export type Timeline = {
  id: string;
  goal_title: string;
  total_estimated_hours: number;
  available_hours_per_week: number;
  days_until_deadline: number;
  created_at: string;
  updated_at: string;
  last_exported_at: string | null;
  execution_status: TimelineStatus;
  progress_percentage: number;
  last_progress_updated_at: string | null;
};

export type InsightTimeline = Pick<Timeline, "id" | "goal_title">;