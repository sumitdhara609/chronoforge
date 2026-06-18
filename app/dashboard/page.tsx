import { redirect } from "next/navigation";
import { AuthNavigation } from "@/components/auth-navigation";
import { BackgroundOrbs } from "@/components/background-orbs";
import { PremiumButton } from "@/components/premium-button";
import { SiteFooter } from "@/components/site-footer";
import { TimelineVaultFilter } from "@/components/timeline-vault-filter";
import { createClient } from "@/lib/supabase/server";
import { analyzeVaultIntelligence } from "@/lib/vault-intelligence";
import { analyzeVaultQuickInsights } from "@/lib/vault-quick-insights";
import type { Timeline } from "@/lib/timeline-types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: timelines, error } = await supabase
    .from("timelines")
    .select(
      "id, goal_title, total_estimated_hours, available_hours_per_week, days_until_deadline, created_at, updated_at, last_exported_at, execution_status, progress_percentage, last_progress_updated_at"
    )
    .order("created_at", { ascending: false });

  const savedTimelines = (timelines ?? []) as Timeline[];

  const vaultIntelligence = analyzeVaultIntelligence(savedTimelines);
  const quickInsights = analyzeVaultQuickInsights(savedTimelines);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050711] px-5 py-12 text-white sm:px-6 sm:py-16">
      <BackgroundOrbs />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <PremiumButton href="/" variant="ghost">
            Back to ChronoForge
          </PremiumButton>

          <AuthNavigation />
        </div>

        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-slate-400">
          Private Workspace
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Your ChronoForge dashboard.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          You are logged in as{" "}
          <span className="font-medium text-white">{user.email}</span>. Your
          saved timelines are stored securely with your account.
        </p>

        <section className="mt-10 rounded-3xl border border-violet-400/20 bg-violet-400/10 p-6 shadow-[0_20px_90px_rgba(139,92,246,0.08)] backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
                Vault Intelligence
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {vaultIntelligence.vaultHealthLabel}
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                {vaultIntelligence.vaultSummary}
              </p>
            </div>

            <div className="w-fit rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-violet-100">
              Avg Score {vaultIntelligence.averageChronoScore}/100
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <VaultMetric
              label="Saved Plans"
              value={`${vaultIntelligence.totalPlans}`}
            />

            <VaultMetric
              label="Total Planned Hours"
              value={`${vaultIntelligence.totalPlannedHours}h`}
            />

            <VaultMetric
              label="High-Risk Plans"
              value={`${vaultIntelligence.highRiskPlans}`}
            />

            <VaultMetric
              label="Critical Warnings"
              value={`${vaultIntelligence.criticalPlans}`}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <VaultHighlight
              label="Strongest Plan"
              title={
                vaultIntelligence.strongestPlan?.goal_title ?? "No plan yet"
              }
              href={
                vaultIntelligence.strongestPlan
                  ? `/dashboard/${vaultIntelligence.strongestPlan.id}`
                  : "/create"
              }
              accent="violet"
            />

            <VaultHighlight
              label="Needs Most Attention"
              title={vaultIntelligence.weakestPlan?.goal_title ?? "No plan yet"}
              href={
                vaultIntelligence.weakestPlan
                  ? `/dashboard/${vaultIntelligence.weakestPlan.id}`
                  : "/create"
              }
              accent="violet"
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6 shadow-[0_20px_90px_rgba(245,158,11,0.08)] backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
                Execution Lens
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                The real state of your work.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                ChronoForge now separates plans that are being designed, actively
                moving, paused, and completed—so your vault reflects reality,
                not only intention.
              </p>
            </div>

            <div className="w-fit rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-amber-100">
              {vaultIntelligence.averageProgress}% Avg Progress
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <VaultMetric
              label="Planning"
              value={`${vaultIntelligence.planningPlans}`}
            />

            <VaultMetric
              label="Active"
              value={`${vaultIntelligence.activePlans}`}
            />

            <VaultMetric
              label="Paused"
              value={`${vaultIntelligence.pausedPlans}`}
            />

            <VaultMetric
              label="Completed"
              value={`${vaultIntelligence.completedPlans}`}
            />

            <VaultMetric
              label="Remaining Work"
              value={`${vaultIntelligence.totalRemainingHours}h`}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <VaultHighlight
              label="Most At-Risk Active Plan"
              title={
                vaultIntelligence.mostAtRiskActivePlan?.goal_title ??
                "No active plan needs attention yet"
              }
              href={
                vaultIntelligence.mostAtRiskActivePlan
                  ? `/dashboard/${vaultIntelligence.mostAtRiskActivePlan.id}`
                  : "/create"
              }
              accent="amber"
            />

            <VaultHighlight
              label="Execution Guidance"
              title={
                vaultIntelligence.activePlans > 0
                  ? "Protect your active capacity before adding more commitments."
                  : "Activate the timeline that deserves your next focused block."
              }
              href={
                vaultIntelligence.mostAtRiskActivePlan
                  ? `/dashboard/${vaultIntelligence.mostAtRiskActivePlan.id}`
                  : "/create"
              }
              accent="amber"
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-[0_20px_90px_rgba(34,211,238,0.08)] backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                Vault Quick Insights
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                What needs attention now.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                ChronoForge highlights the strongest, most urgent, and most
                meaningful execution signals inside your timeline vault.
              </p>
            </div>

            <div className="w-fit rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-cyan-100">
              Live Analysis
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickInsightCard
              label="Most Urgent"
              timeline={quickInsights.mostUrgent}
              fallback="No urgent plan yet"
            />

            <QuickInsightCard
              label="Strongest"
              timeline={quickInsights.strongest}
              fallback="No strong plan yet"
            />

            <QuickInsightCard
              label="Highest Weekly Load"
              timeline={quickInsights.highestWeeklyLoad}
              fallback="No weekly load yet"
            />

            <QuickInsightCard
              label="Best Recovery Buffer"
              timeline={quickInsights.bestRecoveryBuffer}
              fallback="No recovery buffer yet"
            />

            <QuickInsightCard
              label="Most Advanced Active"
              timeline={quickInsights.mostAdvancedActive}
              fallback="No active plan in progress"
            />

            <QuickInsightCard
              label="Paused Plan to Resume"
              timeline={quickInsights.pausedPlanToResume}
              fallback="No paused plan needs review"
            />
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Timeline Vault
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Saved goal architectures.
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="/dashboard/compare"
                className="rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-center text-sm font-semibold text-violet-100 transition hover:-translate-y-0.5 hover:bg-violet-400/15"
              >
                Compare Timelines
              </a>

              <div className="w-fit rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-300">
                {savedTimelines.length} saved
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm leading-7 text-rose-200">
              {error.message}
            </div>
          ) : savedTimelines.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6">
              <h3 className="text-2xl font-semibold">
                No timelines saved yet.
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Create your first goal architecture, save it securely, and it
                will appear here inside your private timeline vault.
              </p>

              <div className="mt-6">
                <PremiumButton href="/create">
                  Create First Timeline
                </PremiumButton>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <TimelineVaultFilter timelines={savedTimelines} />
            </div>
          )}
        </section>
      </section>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </main>
  );
}

function QuickInsightCard({
  label,
  timeline,
  fallback,
}: {
  label: string;
  timeline: Timeline | null;
  fallback: string;
}) {
  return (
    <a
      href={timeline ? `/dashboard/${timeline.id}` : "/create"}
      className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-black/30"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>

      <h3 className="mt-3 text-xl font-semibold text-white">
        {timeline?.goal_title ?? fallback}
      </h3>

      <p className="mt-3 text-sm text-cyan-200">
        {timeline ? "Open report →" : "Create timeline →"}
      </p>
    </a>
  );
}

function VaultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function VaultHighlight({
  label,
  title,
  href,
  accent,
}: {
  label: string;
  title: string;
  href: string;
  accent: "violet" | "amber";
}) {
  const accentText =
    accent === "amber" ? "text-amber-200" : "text-violet-200";

  return (
    <a
      href={href}
      className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-black/30"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>

      <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>

      <p className={`mt-3 text-sm ${accentText}`}>Open report →</p>
    </a>
  );
}