"use client";

import { useState } from "react";

type TimelineOption = {
  id: string;
  goal_title: string;
};

type TimelineCompareSelectorProps = {
  timelines: TimelineOption[];
  selectedFirstId: string;
  selectedSecondId: string;
};

export function TimelineCompareSelector({
  timelines,
  selectedFirstId,
  selectedSecondId,
}: TimelineCompareSelectorProps) {
  const [firstId, setFirstId] = useState(selectedFirstId);
  const [secondId, setSecondId] = useState(selectedSecondId);

  function applyComparison() {
    if (!firstId || !secondId || firstId === secondId) {
      return;
    }

    window.location.href = `/dashboard/compare?first=${firstId}&second=${secondId}`;
  }

  const isInvalid = !firstId || !secondId || firstId === secondId;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Comparison Control
          </p>

          <h2 className="mt-3 text-3xl font-semibold">
            Choose two timelines to compare.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Select any two saved goal architectures and ChronoForge will
            regenerate the comparison verdict.
          </p>
        </div>

        <button
          type="button"
          onClick={applyComparison}
          disabled={isInvalid}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Compare Selected
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-400">Timeline A</span>

          <select
            value={firstId}
            onChange={(event) => setFirstId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-slate-400"
          >
            {timelines.map((timeline) => (
              <option key={timeline.id} value={timeline.id}>
                {timeline.goal_title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-slate-400">Timeline B</span>

          <select
            value={secondId}
            onChange={(event) => setSecondId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-slate-400"
          >
            {timelines.map((timeline) => (
              <option key={timeline.id} value={timeline.id}>
                {timeline.goal_title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isInvalid ? (
        <p className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-200">
          Choose two different timelines to generate a comparison.
        </p>
      ) : null}
    </div>
  );
}