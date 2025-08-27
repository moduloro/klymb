"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-brand-muted">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        {/* Left: Logo */}
        <div className="shrink-0">
          <Link href="/" className="text-xl font-bold tracking-tight text-brand-text">
            klymb
          </Link>
        </div>

        {/* Center/Right: Nav */}
        <nav className="ml-2 hidden items-center gap-6 text-sm text-brand-text/80 md:flex">
          <Link href="#" className="hover:text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">
            For Job Seekers
          </Link>
          <Link href="#" className="hover:text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">
            For Employers
          </Link>
          <Link href="#" className="hover:text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">
            Insights & Resources
          </Link>
          <Link href="#" className="hover:text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">
            About
          </Link>
        </nav>

        {/* Right: Auth */}
        <div className="ml-auto flex items-center gap-3">
          {!session ? (
            <button
              onClick={() => signIn("google", { prompt: "select_account" })}
              className="inline-flex items-center rounded-md bg-brand-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-label="Sign in"
            >
              Sign in
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user?.name ?? session.user?.email ?? "User avatar"}
                  className="h-8 w-8 rounded-full border border-brand-muted object-cover"
                />
              ) : null}
              <span className="hidden text-sm text-brand-text/80 sm:inline-block" aria-label="Signed in user">
                {session.user?.email ?? session.user?.name ?? "Signed in"}
              </span>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center rounded-md border border-brand-muted bg-white px-3 py-2 text-sm font-medium text-brand-text hover:bg-brand-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                aria-label="Sign out"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

