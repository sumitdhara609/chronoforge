export default function DashboardLoading() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050711] px-5 py-12 text-white sm:px-6 sm:py-16">
      <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-6rem] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-6xl animate-pulse">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="h-10 w-44 rounded-full bg-white/10" />
          <div className="h-10 w-32 rounded-full bg-white/10" />
        </div>

        <div className="mt-12 h-4 w-40 rounded-full bg-white/10" />
        <div className="mt-5 h-14 max-w-xl rounded-2xl bg-white/10" />
        <div className="mt-6 h-5 max-w-2xl rounded-full bg-white/10" />

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="h-4 w-44 rounded-full bg-violet-400/20" />
          <div className="mt-5 h-10 w-80 max-w-full rounded-xl bg-white/10" />
          <div className="mt-5 h-4 max-w-3xl rounded-full bg-white/10" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 rounded-2xl border border-white/10 bg-black/20"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="h-4 w-40 rounded-full bg-cyan-400/20" />
          <div className="mt-5 h-10 w-96 max-w-full rounded-xl bg-white/10" />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-44 rounded-2xl border border-white/10 bg-black/20"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="h-4 w-36 rounded-full bg-white/10" />
          <div className="mt-5 h-10 w-80 max-w-full rounded-xl bg-white/10" />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-72 rounded-2xl border border-white/10 bg-black/20"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}