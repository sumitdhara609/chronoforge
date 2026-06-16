"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type DeleteTimelineButtonProps = {
  timelineId: string;
};

export function DeleteTimelineButton({ timelineId }: DeleteTimelineButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState("");

  async function deleteTimeline() {
    const confirmed = window.confirm(
      "Delete this saved timeline? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setStatus("");

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("timelines")
        .delete()
        .eq("id", timelineId);

      if (error) {
        setStatus(error.message);
        setIsDeleting(false);
        return;
      }

      window.location.reload();
    } catch {
      setStatus("Something went wrong while deleting this timeline.");
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={deleteTimeline}
        disabled={isDeleting}
        className="rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>

      {status ? (
        <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200">
          {status}
        </p>
      ) : null}
    </div>
  );
}