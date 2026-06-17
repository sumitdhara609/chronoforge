import { notFound, redirect } from "next/navigation";
import { BackgroundOrbs } from "@/components/background-orbs";
import { EditTimelineForm } from "@/components/edit-timeline-form";
import { PremiumButton } from "@/components/premium-button";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";

type Timeline = {
  id: string;
  goal_title: string;
  total_estimated_hours: number;
  available_hours_per_week: number;
  days_until_deadline: number;
  created_at: string;
  updated_at: string;
  last_exported_at: string | null;
};

type EditTimelinePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTimelinePage({
  params,
}: EditTimelinePageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: timeline, error } = await supabase
    .from("timelines")
    .select(
      "id, goal_title, total_estimated_hours, available_hours_per_week, days_until_deadline, created_at, updated_at, last_exported_at"
    )
    .eq("id", id)
    .single();

  if (error || !timeline) {
    notFound();
  }

  const savedTimeline = timeline as Timeline;

  const createdDate = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date(savedTimeline.created_at));

  const updatedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date(savedTimeline.updated_at));

  const lastExportedDate = savedTimeline.last_exported_at
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "long",
      }).format(new Date(savedTimeline.last_exported_at))
    : null;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050711] px-5 py-12 text-white sm:px-6 sm:py-16">
      <BackgroundOrbs />

      <section className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-8">
          <PremiumButton href={`/dashboard/${savedTimeline.id}`} variant="ghost">
            Back to Report
          </PremiumButton>
        </div>

        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-slate-400">
          Timeline Editor
        </p>

        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Refine your saved timeline.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          Editing a saved timeline updates the same private record in your
          vault. The report will regenerate from the new values.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Timeline Activity
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <ActivityMetric label="Created" value={createdDate} />

            <ActivityMetric label="Last Updated" value={updatedDate} />

            <ActivityMetric
              label="Last Exported"
              value={lastExportedDate ?? "Not exported yet"}
            />
          </div>
        </div>

        <div className="mt-10">
          <EditTimelineForm
            timelineId={savedTimeline.id}
            initialGoalTitle={savedTimeline.goal_title}
            initialTotalEstimatedHours={savedTimeline.total_estimated_hours}
            initialAvailableHoursPerWeek={
              savedTimeline.available_hours_per_week
            }
            initialDaysUntilDeadline={savedTimeline.days_until_deadline}
          />
        </div>
      </section>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </main>
  );
}

function ActivityMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-sm font-semibold leading-6 text-slate-200">
        {value}
      </p>
    </div>
  );
}