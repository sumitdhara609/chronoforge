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
      "id, goal_title, total_estimated_hours, available_hours_per_week, days_until_deadline, created_at"
    )
    .eq("id", id)
    .single();

  if (error || !timeline) {
    notFound();
  }

  const savedTimeline = timeline as Timeline;

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