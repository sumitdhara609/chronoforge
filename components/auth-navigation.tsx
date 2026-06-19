"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthNavigation() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkUser() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (isMounted) {
          setUserEmail(user?.email ?? null);
        }
      } catch {
        if (isMounted) {
          setUserEmail(null);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    }

    checkUser();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch {
      setIsSigningOut(false);
    }
  }

  if (isChecking) {
    return (
      <nav className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/create"
          className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
        >
          Create
        </Link>

        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
          Checking...
        </div>
      </nav>
    );
  }

  if (!userEmail) {
    return (
      <nav className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/create"
          className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
        >
          Create
        </Link>

        <Link
          href="/login"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-[0_0_30px_rgba(255,255,255,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-[0_0_45px_rgba(255,255,255,0.24)]"
        >
          Login
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/create"
        className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
      >
        Create
      </Link>

      <Link
        href="/dashboard"
        className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-400/15"
      >
        Dashboard
      </Link>

      <div className="hidden max-w-[220px] truncate rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 lg:block">
        Signed in as{" "}
        <span className="font-medium text-white">{userEmail}</span>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-[0_0_30px_rgba(255,255,255,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSigningOut ? "Signing out..." : "Sign Out"}
      </button>
    </nav>
  );
}