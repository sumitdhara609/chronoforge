"use client";

import { useState } from "react";
import { BackgroundOrbs } from "@/components/background-orbs";
import { PremiumButton } from "@/components/premium-button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setStatus("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setStatus("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          })
        : await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

    if (result.error) {
      setStatus(result.error.message);
      setIsLoading(false);
      return;
    }

    if (mode === "signup") {
      setStatus(
        "Account created. Check your email if confirmation is required, then log in."
      );
      setMode("login");
      setPassword("");
      setIsLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050711] px-5 py-12 text-white sm:px-6 sm:py-16">
      <BackgroundOrbs />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col justify-center">
        <div className="mb-8">
          <PremiumButton href="/" variant="ghost">
            Back to ChronoForge
          </PremiumButton>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-slate-400">
              Secure Access
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Save your timelines. Return to your future.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              ChronoForge accounts let users securely store goal architectures,
              compare execution scenarios, and continue planning from where they
              left off.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <AuthPoint label="Secure Supabase Auth" />
              <AuthPoint label="Private User Timelines" />
              <AuthPoint label="Protected Dashboard" />
              <AuthPoint label="Database-backed Planning" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="mb-6 flex rounded-full border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setStatus("");
                }}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setStatus("");
                }}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-white text-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-2xl font-semibold">
              {mode === "login" ? "Welcome back." : "Create your account."}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {mode === "login"
                ? "Access your private ChronoForge workspace."
                : "Start saving your goal timelines securely."}
            </p>

            <form onSubmit={handleAuth} className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm text-slate-400">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
                />
              </label>

              {status ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-slate-300">
                  {status}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-[0_0_60px_rgba(255,255,255,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Login to Dashboard"
                  : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function AuthPoint({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
      <span className="text-slate-500">Built for </span>
      <span className="font-medium text-slate-200">{label}</span>
    </div>
  );
}