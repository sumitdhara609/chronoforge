"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type TimelineStatus = "PLANNING" | "ACTIVE" | "PAUSED" | "COMPLETED";

type TimelineProgressEditorProps = {
  timelineId: string;
  initialStatus: TimelineStatus;
  initialProgress: number;
};

const STATUS_OPTIONS: {
  value: TimelineStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "PLANNING",
    label: "Planning",
    description: "The timeline is being designed or prepared.",
  },
  {
    value: "ACTIVE",
    label: "Active",
    description: "Execution is currently in progress.",
  },
  {
    value: "PAUSED",
    label: "Paused",
    description: "Execution is intentionally paused for now.",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    description: "The goal architecture has been completed.",
  },
];

export function TimelineProgressEditor({
  timelineId,
  initialStatus,
  initialProgress,
}: TimelineProgressEditorProps) {
  const router = useRouter();

  const [status, setStatus] = useState<TimelineStatus>(initialStatus);
  const [progress, setProgress] = useState(
    String(clampProgress(initialProgress))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const numericProgress = clampProgress(Number(progress));

  async function saveExecutionUpdate() {
    setIsSaving(true);
    setMessage("");

    const resolvedProgress = clampProgress(Number(progress));

    const resolvedStatus: TimelineStatus =
      resolvedProgress === 100
        ? "COMPLETED"
        : status === "COMPLETED"
          ? "ACTIVE"
          : status;

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("timelines")
        .update({
          execution_status: resolvedStatus,
          progress_percentage: resolvedProgress,
          last_progress_updated_at: new Date().toISOString(),
        })
        .eq("id", timelineId);

      if (error) {
        setMessage(error.message);
        setIsSaving(false);
        return;
      }

      setStatus(resolvedStatus);
      setProgress(String(resolvedProgress));
      setMessage("Execution progress updated successfully.");
      setIsSaving(false);

      router.refresh();
    } catch {
      setMessage("Something went wrong while updating execution progress.");
      setIsSaving(false);
    }
  }

  const selectedStatus =
    STATUS_OPTIONS.find((option) => option.value === status) ??
    STATUS_OPTIONS[0];

  return (
    <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6 shadow-[0_20px_90px_rgba(245,158,11,0.08)] backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
            Execution Progress
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
            Keep this timeline connected to reality.
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Update the current execution status and progress whenever this goal
            meaningfully moves forward.
          </p>
        </div>

        <div className="w-fit rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-amber-100">
          {numericProgress}% Complete
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-300">Execution Status</span>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as TimelineStatus)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-amber-300"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            {selectedStatus.description}
          </p>
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">Progress Percentage</span>

          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={progress}
            onChange={(event) => setProgress(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-amber-300"
          />

          <p className="mt-2 text-xs leading-5 text-slate-400">
            Reaching 100% automatically marks the timeline as completed.
          </p>
        </label>
      </div>

      <div className="mt-6">
        <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-black/30">
          <div
            className="h-full rounded-full bg-amber-300 transition-all duration-500"
            style={{ width: `${numericProgress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>0%</span>
          <span>{numericProgress}% complete</span>
          <span>100%</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={saveExecutionUpdate}
          disabled={isSaving}
          className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving Progress..." : "Save Execution Update"}
        </button>

        {message ? (
          <p
            className={`text-sm leading-6 ${
              message.includes("successfully")
                ? "text-amber-100"
                : "text-rose-200"
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function clampProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}