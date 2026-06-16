"use client";

import { useState } from "react";

type CopySummaryButtonProps = {
  summary: string;
};

export function CopySummaryButton({ summary }: CopySummaryButtonProps) {
  const [status, setStatus] = useState("");

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);

      setStatus("Copied");

      window.setTimeout(() => {
        setStatus("");
      }, 2000);
    } catch {
      setStatus("Copy failed");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={copySummary}
        className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-400/15"
      >
        {status === "Copied" ? "Copied Summary" : "Copy Summary"}
      </button>

      {status === "Copy failed" ? (
        <p className="text-xs text-rose-300">
          Copy failed. Try selecting the summary manually.
        </p>
      ) : null}
    </div>
  );
}