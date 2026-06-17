"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EditTimelineFormProps = {
  timelineId: string;
  initialGoalTitle: string;
  initialTotalEstimatedHours: number;
  initialAvailableHoursPerWeek: number;
  initialDaysUntilDeadline: number;
};

export function EditTimelineForm({
  timelineId,
  initialGoalTitle,
  initialTotalEstimatedHours,
  initialAvailableHoursPerWeek,
  initialDaysUntilDeadline,
}: EditTimelineFormProps) {
  const [goalTitle, setGoalTitle] = useState(initialGoalTitle);
  const [totalEstimatedHours, setTotalEstimatedHours] = useState(
    String(initialTotalEstimatedHours)
  );
  const [availableHoursPerWeek, setAvailableHoursPerWeek] = useState(
    String(initialAvailableHoursPerWeek)
  );
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(
    String(initialDaysUntilDeadline)
  );

  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function updateTimeline() {
    setIsSaving(true);
    setStatus("");

    const cleanGoalTitle = goalTitle.trim();

    if (!cleanGoalTitle) {
      setStatus("Goal title cannot be empty.");
      setIsSaving(false);
      return;
    }

    const safeTotalEstimatedHours = toPositiveInteger(totalEstimatedHours);
    const safeAvailableHoursPerWeek = toPositiveInteger(availableHoursPerWeek);
    const safeDaysUntilDeadline = toPositiveInteger(daysUntilDeadline);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("timelines")
        .update({
          goal_title: cleanGoalTitle,
          total_estimated_hours: safeTotalEstimatedHours,
          available_hours_per_week: safeAvailableHoursPerWeek,
          days_until_deadline: safeDaysUntilDeadline,
        })
        .eq("id", timelineId);

      if (error) {
        setStatus(error.message);
        setIsSaving(false);
        return;
      }

      window.location.href = `/dashboard/${timelineId}`;
    } catch {
      setStatus("Something went wrong while updating this timeline.");
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="text-2xl font-semibold text-white">Edit Timeline</h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
        Update this saved goal architecture. ChronoForge will recalculate the
        projection, diagnosis, ChronoScore, and vault intelligence after saving.
      </p>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-sm text-slate-400">Goal Title</span>

          <input
            value={goalTitle}
            onChange={(event) => setGoalTitle(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-400">
            Total Estimated Hours
          </span>

          <input
            type="number"
            min="1"
            step="1"
            value={totalEstimatedHours}
            onChange={(event) => setTotalEstimatedHours(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-400">
            Available Hours Per Week
          </span>

          <input
            type="number"
            min="1"
            step="1"
            value={availableHoursPerWeek}
            onChange={(event) => setAvailableHoursPerWeek(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-400">Days Until Deadline</span>

          <input
            type="number"
            min="1"
            step="1"
            value={daysUntilDeadline}
            onChange={(event) => setDaysUntilDeadline(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={updateTimeline}
          disabled={isSaving}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving Changes..." : "Save Changes"}
        </button>

        <a
          href={`/dashboard/${timelineId}`}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10"
        >
          Cancel
        </a>
      </div>

      {status ? (
        <p className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200">
          {status}
        </p>
      ) : null}
    </div>
  );
}

function toPositiveInteger(value: string) {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return 1;
  }

  return Math.round(number);
}