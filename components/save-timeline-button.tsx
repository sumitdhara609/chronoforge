"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SaveTimelineButtonProps = {
  goalTitle: string;
  totalEstimatedHours: number;
  availableHoursPerWeek: number;
  daysUntilDeadline: number;
};

export function SaveTimelineButton({
  goalTitle,
  totalEstimatedHours,
  availableHoursPerWeek,
  daysUntilDeadline,
}: SaveTimelineButtonProps) {
  const supabase = createClient();

  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function saveTimeline() {
    setIsSaving(true);
    setStatus("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      window.location.href = "/login";
      return;
    }

    const cleanGoalTitle = goalTitle.trim() || "Untitled Timeline";

    const { error } = await supabase.from("timelines").insert({
      user_id: user.id,
      goal_title: cleanGoalTitle,
      total_estimated_hours: Math.max(1, totalEstimatedHours),
      available_hours_per_week: Math.max(1, availableHoursPerWeek),
      days_until_deadline: Math.max(1, daysUntilDeadline),
    });

    if (error) {
      setStatus(error.message);
      setIsSaving(false);
      return;
    }

    setStatus("Timeline saved securely.");
    setIsSaving(false);
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={saveTimeline}
        disabled={isSaving}
        className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-[0_0_60px_rgba(255,255,255,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving Timeline..." : "Save Timeline Securely"}
      </button>

      {status ? (
        <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
          {status}
        </p>
      ) : null}
    </div>
  );
}