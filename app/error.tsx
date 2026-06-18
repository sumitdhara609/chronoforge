"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050711] px-5 py-12 text-white">
      <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-rose-500/15 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-6rem] h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

      <section className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-12">
        <p className="text-sm uppercase tracking-[0.4em] text-rose-300">
          Workspace Interrupted
        </p>

        <h1 className="mt-7 text-3xl font-semibold tracking-tight sm:text-4xl">
          ChronoForge could not complete that request.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
          Your saved timelines are still protected. Try the request again, or
          return to your dashboard and continue from there.
        </p>

        {error.digest ? (
          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-slate-500">
            Reference: {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-200"
          >
            Try Again
          </button>

          <Link
            href="/dashboard"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            Return to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
