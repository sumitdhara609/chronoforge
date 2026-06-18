import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050711] px-5 py-12 text-white">
      <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-6rem] h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />

      <section className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-12">
        <p className="text-sm uppercase tracking-[0.4em] text-violet-300">
          Route Not Found
        </p>

        <p className="mt-8 text-7xl font-semibold tracking-tight text-white sm:text-8xl">
          404
        </p>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          This timeline does not exist here.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
          The page may have been removed, the link may be incomplete, or this
          timeline may no longer be available in your workspace.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-200"
          >
            Return to Dashboard
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            Back to ChronoForge
          </Link>
        </div>
      </section>
    </main>
  );
}
