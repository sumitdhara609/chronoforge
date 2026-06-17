"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ExportTrackerButtonProps = {
  timelineId: string;
};

export function ExportTrackerButton({ timelineId }: ExportTrackerButtonProps) {
  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  async function markAsExported() {
    setIsUpdating(true);
    setStatus("");

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("timelines")
        .update({
          last_exported_at: new Date().toISOString(),
        })
        .eq("id", timelineId);

      if (error) {
        setStatus(error.message);
        setIsUpdating(false);
        return;
      }

      setStatus("Export activity updated. You can now press Ctrl + P.");
      setIsUpdating(false);
    } catch {
      setStatus("Something went wrong while updating export activity.");
      setIsUpdating(false);
    }
  }

  return (
    <div className="print:hidden">
      <button
        type="button"
        onClick={markAsExported}
        disabled={isUpdating}
        className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUpdating ? "Updating..." : "Mark Export + Print"}
      </button>

      {status ? (
        <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
          {status}
        </p>
      ) : null}
    </div>
  );
}