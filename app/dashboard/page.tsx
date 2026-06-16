import { redirect } from "next/navigation";
import { BackgroundOrbs } from "@/components/background-orbs";
import { PremiumButton } from "@/components/premium-button";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050711] px-5 py-12 text-white sm:px-6 sm:py-16">
      <BackgroundOrbs />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PremiumButton href="/" variant="ghost">
            Back to ChronoForge
          </PremiumButton>

          <PremiumButton href="/create" variant="secondary">
            Forge New Timeline
          </PremiumButton>
        </div>

        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-slate-400">
          Private Workspace
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Your ChronoForge dashboard.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          You are logged in as{" "}
          <span className="font-medium text-white">{user.email}</span>. This
          workspace will store your saved timelines securely.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Timeline Vault
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Saved timelines will appear here.
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
            In the next step, we will create a secure database table and connect
            the Goal Architect to this dashboard so each logged-in user can save
            and revisit their own plans.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <VaultCard
              title="Private by Design"
              description="Each saved timeline will belong to the authenticated user."
            />

            <VaultCard
              title="Database-backed"
              description="Plans will be stored in Supabase Postgres instead of only existing in the browser."
            />

            <VaultCard
              title="Ready for Scaling"
              description="This foundation can later support editing, deleting, sharing, and analytics."
            />
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </main>
  );
}

function VaultCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}